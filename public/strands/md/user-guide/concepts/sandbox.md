Agents are most effective when they can perform real actions rather than being constrained to text-only reasoning: executing shell commands, running code, and reading and writing files. But giving an agent unrestricted access to your host machine, especially the ability to run model-generated code, is a serious security risk.

A `Sandbox` gives the agent an execution environment for these operations while keeping the agent’s core process (model calls, hooks, state) decoupled. Now, the agent can run shell commands, write and execute code, and access a filesystem without compromising the host or its own runtime.

## How sandboxes work

There are two ways to think about sandboxed agents: running the entire agent *inside* a sandbox (a deployment concern, not an SDK feature), or giving the agent a sandbox *to use* for execution while the agent itself stays in your trusted infrastructure.

Strands implements the second pattern. The agent process runs on your host and handles model calls, tools, hooks, and state. The sandbox is a pluggable backend that receives only execution operations via a standard interface.

```mermaid
flowchart LR
    subgraph runtime["Agent runtime (your infrastructure)"]
        L[Agent loop]
        M[Model]
        T["sandbox_bash /<br/>sandbox_file_editor"]
        L --> M --> T
    end
    subgraph sb["Sandbox (execution environment you provision)"]
        E[Command / file operation]
    end
    T -->|"execute, read_file, write_file"| E
    E -->|"stdout, stderr, exit code"| T
```

All Sandbox implementations share the same abstract interface:

| Method | Description |
| --- | --- |
| `execute_streaming``executeStreaming` | Run a shell command, stream output |
| `execute_code_streaming``executeCodeStreaming` | Run code via an interpreter, stream output |
| `read_file``readFile` | Read a file as bytes |
| `write_file``writeFile` | Write bytes to a file |
| `remove_file``removeFile` | Delete a file |
| `list_files``listFiles` | List directory contents |

The execution methods accept optional parameters: `timeout` (seconds, throws `SandboxTimeoutError` when exceeded), `cwd` (working directory override), `env` (environment variables), and in TypeScript, `signal` (AbortSignal, throws `SandboxAbortError`).

## Getting started

Pass a sandbox to an agent through the `sandbox` parameter, and the agent’s commands and file operations will execute inside it.

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { DockerSandbox } from '@strands-agents/sdk/sandbox/docker'\n\nconst agent = new Agent({\n  sandbox: new DockerSandbox({ container: 'my-container-id' }),\n})\n\n// The agent's sandbox_bash and sandbox_file_editor tools execute inside the container\nawait agent.invoke('List all files inside the current directory')\n```"
 },
 {
  "label": "Python",
  "body": "```python\nagent = Agent(sandbox=DockerSandbox(\"my-container-id\"))\n\n# The agent's sandbox_bash and sandbox_file_editor tools execute inside the container\nagent(\"List all files inside the current directory\")\n```"
 }
]
```

> [!WARNING] The default is not a sandbox
>
> Omitting the `sandbox` parameter runs the agent’s command and file tools directly on the host with the full permissions of the agent process. Treat this as convenience for trusted, local development only. For untrusted input or production runs, pass an explicit sandbox.

In TypeScript, pass `sandbox: false` to opt out explicitly and keep that intent stable if the default changes:

```typescript
// Explicit opt-out: no sandbox, run on host
const agent = new Agent({ sandbox: false })
```

See [Available Sandboxes](lc:user-guide/concepts/sandbox/available-sandboxes) for Docker and SSH configuration options, programmatic access, and streaming output.

## Using tools with sandboxes

### Default tools

When a sandbox is configured, the agent automatically registers two tools so the model can operate in the sandboxed environment without additional setup:

-   **`sandbox_bash`** — Executes shell commands. Each call runs in a fresh shell; state such as variables and the working directory does not persist across calls.
-   **`sandbox_file_editor`** — Views, creates, and edits files using absolute paths. Supports view (with line ranges), create, string replace, and insert operations.

If a tool with the same name is already registered on the agent, the sandbox-vended version is skipped. This lets you override a vended tool with a stricter variant:

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { DockerSandbox } from '@strands-agents/sdk/sandbox/docker'\nimport { makeBash } from '@strands-agents/sdk/vended-tools/bash'\n\nconst sandbox = new DockerSandbox({ container: 'agent-workspace' })\n\nconst lockedBash = makeBash(sandbox, {\n  name: 'sandbox_bash',\n  description: 'Run read-only shell commands. Do not modify files.',\n})\n\n// The agent keeps lockedBash; the sandbox's own sandbox_bash is skipped\nconst agent = new Agent({ sandbox, tools: [lockedBash] })\n```"
 },
 {
  "label": "Python",
  "body": "```python\nfrom strands.vended_tools import make_bash\n\nsandbox = DockerSandbox(\"agent-workspace\")\n\nlocked_bash = make_bash(\n    sandbox=sandbox,\n    name=\"sandbox_bash\",\n    description=\"Run read-only shell commands. Do not modify files.\",\n)\n\n# The agent keeps locked_bash; the sandbox's own sandbox_bash is skipped\nagent = Agent(sandbox=sandbox, tools=[locked_bash])\n```"
 }
]
```

Custom sandbox implementations can also override `get_tools()``getTools()` to vend their own tools entirely.

### Custom tools

You can add your own tools alongside the auto-vended ones by creating a tool that reads the sandbox from its context and passing it in the agent’s `tools` array:

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, tool } from '@strands-agents/sdk'\nimport { DockerSandbox } from '@strands-agents/sdk/sandbox/docker'\nimport { z } from 'zod'\n\nconst lint = tool({\n  name: 'lint',\n  description: 'Lint a file and return structured errors',\n  inputSchema: z.object({\n    path: z.string().describe('File path to lint'),\n  }),\n  callback: async (input, context) => {\n    const result = await context!.agent.sandbox.execute(\n      `eslint --format json ${input.path}`\n    )\n    const issues = JSON.parse(result.stdout)\n    return issues.flatMap((f: any) => f.messages)\n  },\n})\n\nconst agent = new Agent({\n  sandbox: new DockerSandbox({ container: 'my-dev-env' }),\n  tools: [lint],\n})\n// Agent now has: sandbox_bash, sandbox_file_editor (vended) + lint (yours)\n```"
 },
 {
  "label": "Python",
  "body": "```python\n@tool(context=\"tool_context\")\nasync def lint(path: str, tool_context: ToolContext) -> list:\n    \"\"\"Lint a file and return structured errors.\n\n    Args:\n        path: File path to lint.\n        tool_context: Injected by the framework.\n    \"\"\"\n    result = await tool_context.agent.sandbox.execute(f\"eslint --format json {path}\")\n    issues = json.loads(result.stdout)\n    return [msg for file in issues for msg in file[\"messages\"]]\n\n\nagent = Agent(\n    sandbox=DockerSandbox(\"my-dev-env\"),\n    tools=[lint],\n)\n# Agent now has: sandbox_bash, sandbox_file_editor (vended) + lint (yours)\n```"
 }
]
```

Your custom tools coexist with the auto-vended ones. The sandbox routes all execution to the same environment regardless of which tool initiated it.

## Using plugins with sandboxes

The following vended plugins route their file I/O through the agent’s sandbox when one is configured:

-   **[Agent Skills](lc:user-guide/concepts/plugins/skills)** — Skill files loaded from filesystem paths are read through the agent’s sandbox. Skills stored inside a container or on a remote host are accessible without copying them to the host. URL and inline skill sources are sandbox-independent.
-   **[Context Offloader](lc:user-guide/concepts/plugins/context-offloader)** — When using `FileStorage` as the storage backend, offloaded artifacts are written to and read from the sandbox’s filesystem rather than the host. The plugin binds to the agent’s sandbox during initialization; no explicit wiring is needed.

## Next steps

-   [Available Sandboxes](lc:user-guide/concepts/sandbox/available-sandboxes) — the built-in Docker and SSH backends, programmatic access, and streaming
-   [Building a Custom Sandbox](lc:user-guide/concepts/sandbox/custom-sandbox) — target a backend the built-ins do not cover
-   [Vended Tools](lc:user-guide/concepts/tools/vended-tools) — the `sandbox_bash` and `sandbox_file_editor` tools

## Related pages

- [Available Sandboxes](lc:user-guide/concepts/sandbox/available-sandboxes) (2 shared tags)
- [Building a Custom Sandbox](lc:user-guide/concepts/sandbox/custom-sandbox) (2 shared tags)
- [Creating a Custom Model Provider](lc:user-guide/concepts/model-providers/custom_model_provider) (1 shared tag)
- [Tool Executors](lc:user-guide/concepts/tools/executors) (1 shared tag)
- [Human in the Loop](lc:user-guide/concepts/agents/interventions/human-in-the-loop) (1 shared tag)
- [Cedar Authorization](lc:user-guide/concepts/agents/interventions/cedar-authorization) (1 shared tag)
- [Agent Loop](lc:user-guide/concepts/agents/agent-loop) (1 shared tag)
- [Hooks](lc:user-guide/concepts/agents/hooks) (1 shared tag)
- [Steering (Interventions)](lc:user-guide/concepts/agents/interventions/steering) (1 shared tag)
- [Agents as Tools with Strands Agents SDK](lc:user-guide/concepts/multi-agent/agents-as-tools) (1 shared tag)
