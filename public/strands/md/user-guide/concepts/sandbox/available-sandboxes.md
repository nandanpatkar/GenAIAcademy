Strands provides two built-in Sandbox backends: `DockerSandbox` for containers on the local host, and `SshSandbox` for remote machines. Both automatically register `sandbox_bash` and `sandbox_file_editor` tools on the agent. This page covers their configuration, plus how to drive a sandbox directly from your own code.

## DockerSandbox

Executes operations inside a Docker container on the host via `docker exec`. The container must already be running; Strands does not create it.

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { DockerSandbox } from '@strands-agents/sdk/sandbox/docker'\n\nconst sandbox = new DockerSandbox({\n  container: 'agent-workspace',\n  workingDir: '/workspace',\n  user: '1000:1000',\n})\nconst agent = new Agent({ sandbox })\nvoid agent.invoke('Run the test suite and summarize any failures')\n```"
 },
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.sandbox.docker import DockerSandbox\n\nsandbox = DockerSandbox(\n    \"agent-workspace\",\n    working_dir=\"/workspace\",\n    user=\"1000:1000\",\n)\nagent = Agent(sandbox=sandbox)\nagent(\"Run the test suite and summarize any failures\")\n```"
 }
]
```

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `container``container` | `str``string` | (required) | ID or name of a running container |
| `working_dir``workingDir` | `str \| None``string` | `None``container default` | Working directory for executed commands. If omitted, runs in the container’s configured working directory. |
| `user``user` | `str \| None``string` | `None``container default` | User to run commands as (`"uid"`, `"uid:gid"`, or name). If omitted, runs as the container’s configured user. |

## SshSandbox

Executes operations on a remote host via SSH. Each command spawns a fresh `ssh` process. There is no persistent connection. The host must be reachable with key-based authentication; `BatchMode` is enforced, so password prompts fail rather than block.

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { SshSandbox } from '@strands-agents/sdk/sandbox/ssh'\n\nconst sandbox = new SshSandbox({\n  host: 'ubuntu@10.0.1.5',\n  workingDir: '/home/ubuntu/workspace',\n  identityFile: '~/.ssh/agent_key',\n})\nconst agent = new Agent({ sandbox })\nvoid agent.invoke('Check disk usage and list running processes')\n```"
 },
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.sandbox.ssh import SshSandbox\n\nsandbox = SshSandbox(\n    \"ubuntu@10.0.1.5\",\n    working_dir=\"/home/ubuntu/workspace\",\n    identity_file=\"~/.ssh/agent_key\",\n)\nagent = Agent(sandbox=sandbox)\nagent(\"Check disk usage and list running processes\")\n```"
 }
]
```

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `host``host` | `str``string` | (required) | SSH destination (e.g., `"user@host"`, `"192.168.1.10"`) |
| `working_dir``workingDir` | `str``string` | (required) | Working directory on the remote host |
| `identity_file``identityFile` | `str \| None``string` | `None``undefined` | Path to SSH private key file |
| `port``port` | `int``number` | `22` | SSH port |
| `allow_unknown_hosts``allowUnknownHosts` | `bool``boolean` | `False``false` | When false, uses `StrictHostKeyChecking=accept-new`. When true, disables host key verification. |
| `ssh_options``sshOptions` | `list[str] \| None``string[]` | `None``[]` | Additional SSH options passed as `-o` flags |
| `allow_unsafe_ssh_options``allowUnsafeSshOptions` | `bool``boolean` | `False``false` | Bypass the SSH option allowlist. When false, unknown options throw at construction time. |

### SSH Option Allowlist

By default, `SshSandbox` only permits known-safe SSH options (connection tuning, crypto, authentication). Unknown options throw an error at construction time. This prevents model-generated or user-provided options from executing commands on the host via directives like `ProxyCommand` or `LocalCommand`.

> [!WARNING] Security Warning
>
> Setting `allowUnsafeSshOptions: true` bypasses this allowlist and lets any SSH option through, including directives that run commands on the local host. Only enable it with options you control, never with model-generated or untrusted input.

Neither backend sets environment variables at construction time. Pass them per-command via the `env` option on `execute()``execute()` / `execute_code()``executeCode()`.

## Working with a sandbox directly

You can drive a sandbox directly from your own code. This is useful for setup and verification around an agent run: seed input files, invoke the agent, then read results back.

| Method | Description |
| --- | --- |
| `execute``execute` | Run a shell command, return the result |
| `execute_code``executeCode` | Run code via an interpreter, return the result |
| `read_text``readText` | Read a file as a UTF-8 string |
| `write_text``writeText` | Write a string as UTF-8 |

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { DockerSandbox } from '@strands-agents/sdk/sandbox/docker'\n\nconst agent = new Agent({\n  sandbox: new DockerSandbox({ container: 'my-container-id' }),\n})\n\n// Seed an input file, let the agent work, then read the result back\nawait agent.sandbox.writeText('/workspace/input.csv', 'id,value\\n1,42\\n')\n\nawait agent.invoke(\n  'Summarize /workspace/input.csv and write the summary to /workspace/out.txt'\n)\n\nconst result = await agent.sandbox.execute('cat /workspace/out.txt')\nconsole.log(result.exitCode, result.stdout)\n```"
 },
 {
  "label": "Python",
  "body": "```python\nasync def main():\n    agent = Agent(sandbox=DockerSandbox(\"my-container-id\"))\n\n    # Seed an input file, let the agent work, then read the result back\n    await agent.sandbox.write_text(\"/workspace/input.csv\", \"id,value\\n1,42\\n\")\n\n    agent(\"Summarize /workspace/input.csv and write the summary to /workspace/out.txt\")\n\n    result = await agent.sandbox.execute(\"cat /workspace/out.txt\")\n    print(result.exit_code, result.stdout)\n\n\nasyncio.run(main())\n```"
 }
]
```

### Streaming output

`execute` waits for the command to finish. When you need output as it arrives, use the streaming form. It yields chunks as they are produced, then a final result with the exit code:

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { DockerSandbox } from '@strands-agents/sdk/sandbox/docker'\n\nconst sandbox = new DockerSandbox({ container: 'my-container-id' })\n\nfor await (const chunk of sandbox.executeStreaming('npm run build')) {\n  if (chunk.type === 'streamChunk') {\n    process.stdout.write(chunk.data)\n  } else {\n    console.log(`\\nexit code: ${chunk.exitCode}`)\n  }\n}\n```"
 },
 {
  "label": "Python",
  "body": "```python\nfrom strands.sandbox import ExecutionResult, StreamChunk\n\n\nasync def stream_example():\n    sandbox = DockerSandbox(\"my-container-id\")\n\n    async for chunk in sandbox.execute_streaming(\"npm run build\"):\n        if isinstance(chunk, StreamChunk):\n            print(chunk.data, end=\"\")\n        elif isinstance(chunk, ExecutionResult):\n            print(f\"\\nexit code: {chunk.exit_code}\")\n\n\nasyncio.run(stream_example())\n```"
 }
]
```

## Next steps

For more on configuring tools and plugins that work with sandboxes, see the overview. To target an environment the built-ins don’t cover, build a custom sandbox.

-   [Sandbox Overview](lc:user-guide/concepts/sandbox) — what a sandbox is, the tools it vends, and plugin compatibility
-   [Building a Custom Sandbox](lc:user-guide/concepts/sandbox/custom-sandbox) — target a backend the built-ins do not cover

## Related pages

- [Building a Custom Sandbox](lc:user-guide/concepts/sandbox/custom-sandbox) (2 shared tags)
- [Sandbox](lc:user-guide/concepts/sandbox) (2 shared tags)
- [Creating a Custom Model Provider](lc:user-guide/concepts/model-providers/custom_model_provider) (1 shared tag)
- [Tool Executors](lc:user-guide/concepts/tools/executors) (1 shared tag)
- [Human in the Loop](lc:user-guide/concepts/agents/interventions/human-in-the-loop) (1 shared tag)
- [Cedar Authorization](lc:user-guide/concepts/agents/interventions/cedar-authorization) (1 shared tag)
- [Agent Loop](lc:user-guide/concepts/agents/agent-loop) (1 shared tag)
- [Hooks](lc:user-guide/concepts/agents/hooks) (1 shared tag)
- [Steering (Interventions)](lc:user-guide/concepts/agents/interventions/steering) (1 shared tag)
- [Agents as Tools with Strands Agents SDK](lc:user-guide/concepts/multi-agent/agents-as-tools) (1 shared tag)
