Looking for something beyond the built-in implementations? Build a custom sandbox when your execution environment is not a local Docker container or an SSH host: a microVM, a cloud code-execution API, or a managed runtime. The agent loop, model, and vended tools all stay the same; you only implement the methods that run commands and access files in your backend.

## Extending PosixShellSandbox

`PosixShellSandbox` is a base class that reduces the implementation burden to a single method. If you can implement `execute_streaming``executeStreaming` (run a shell command via your backend and stream the output), you get everything else for free:

-   Code execution via base64-encoded heredoc piped to the interpreter
-   File read/write via base64 encoding over the shell
-   Directory listing via `ls`

Both `DockerSandbox` and `SshSandbox` extend `PosixShellSandbox`.

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { spawn } from 'node:child_process'\nimport { PosixShellSandbox } from '@strands-agents/sdk/sandbox'\nimport type { ExecuteOptions, StreamChunk, ExecutionResult } from '@strands-agents/sdk/sandbox'\n\nclass FirecrackerSandbox extends PosixShellSandbox {\n  constructor(private readonly vmId: string) {\n    super()\n  }\n\n  async *executeStreaming(\n    command: string,\n    options?: ExecuteOptions\n  ): AsyncGenerator<StreamChunk | ExecutionResult, void, undefined> {\n    const proc = spawn('fc-exec', [this.vmId, 'sh', '-c', command])\n\n    let stdout = ''\n    let stderr = ''\n    for await (const data of proc.stdout) {\n      const text = data.toString()\n      stdout += text\n      yield { type: 'streamChunk', data: text, streamType: 'stdout' }\n    }\n    for await (const data of proc.stderr) {\n      const text = data.toString()\n      stderr += text\n      yield { type: 'streamChunk', data: text, streamType: 'stderr' }\n    }\n    const exitCode: number = await new Promise((resolve) =>\n      proc.on('close', (code) => resolve(code ?? 0))\n    )\n    yield { type: 'executionResult', exitCode, stdout, stderr, outputFiles: [] }\n  }\n```"
 },
 {
  "label": "Python",
  "body": "```python\nimport asyncio\nfrom collections.abc import AsyncGenerator\nfrom typing import Any\n\nfrom strands.sandbox import PosixShellSandbox\nfrom strands.sandbox.types import ExecutionResult, StreamChunk\n\n\nclass FirecrackerSandbox(PosixShellSandbox):\n    \"\"\"Run commands in a Firecracker microVM addressed by id.\"\"\"\n\n    def __init__(self, vm_id: str) -> None:\n        self.vm_id = vm_id\n\n    async def execute_streaming(\n        self,\n        command: str,\n        *,\n        timeout: float | None = None,\n        cwd: str | None = None,\n        env: dict[str, str] | None = None,\n        **kwargs: Any,\n    ) -> AsyncGenerator[StreamChunk | ExecutionResult, None]:\n        proc = await asyncio.create_subprocess_exec(\n            \"fc-exec\", self.vm_id, \"sh\", \"-c\", command,\n            stdout=asyncio.subprocess.PIPE,\n            stderr=asyncio.subprocess.PIPE,\n        )\n        stdout, stderr = await proc.communicate()\n        if stdout:\n            yield StreamChunk(data=stdout.decode(), stream_type=\"stdout\")\n        if stderr:\n            yield StreamChunk(data=stderr.decode(), stream_type=\"stderr\")\n        yield ExecutionResult(\n            exit_code=proc.returncode or 0,\n            stdout=stdout.decode(),\n            stderr=stderr.decode(),\n        )\n```"
 }
]
```

## Vending tools from a custom sandbox

To give your sandbox the same `sandbox_bash` and `sandbox_file_editor` tools the built-in sandboxes provide, override `getTools()` / `get_tools()` and return tools bound to it:

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport type { Tool } from '@strands-agents/sdk'\nimport { makeBash } from '@strands-agents/sdk/vended-tools/bash'\nimport { makeFileEditor } from '@strands-agents/sdk/vended-tools/file-editor'\n\noverride getTools(): Tool[] {\n  return [\n    makeFileEditor(this, { name: 'sandbox_file_editor' }),\n    makeBash(this, { name: 'sandbox_bash' }),\n  ]\n}\n```"
 },
 {
  "label": "Python",
  "body": "```python\nfrom strands.types.tools import AgentTool\nfrom strands.vended_tools import make_bash, make_file_editor\n\n\n# Inside your custom sandbox class:\ndef get_tools(self) -> list[AgentTool]:\n    return [\n        make_file_editor(sandbox=self, name=\"sandbox_file_editor\"),\n        make_bash(sandbox=self, name=\"sandbox_bash\"),\n    ]\n```"
 }
]
```

## Extend the base interface directly

For environments where you have native API access (no shell), extend `Sandbox` directly and implement all six abstract methods: `execute_streaming``executeStreaming`, `execute_code_streaming``executeCodeStreaming`, `read_file``readFile`, `write_file``writeFile`, `remove_file``removeFile`, and `list_files``listFiles`.

Prefer the shell base whenever your backend can run `sh -c`. Reach for the raw interface only when shaping every operation as a shell command would be a worse fit than calling your backend’s native API.

## Security

A custom sandbox is a boundary only when the environment behind it is isolated. The interface routes operations; it does not confine them. Whatever the agent can reach through your `execute_streaming` implementation (the method that runs commands in your environment), it can reach.

A container running as root with the host filesystem mounted is not a boundary, even though it uses the same `Sandbox` interface as a locked-down container. The security comes from the environment you provision, not from the interface itself. Scope the environment to the least privilege the task needs, and treat that configuration as the actual control.

## Next steps

-   [Sandbox Overview](lc:user-guide/concepts/sandbox) — what a sandbox is, the tools it vends, and plugin compatibility
-   [Available Sandboxes](lc:user-guide/concepts/sandbox/available-sandboxes) — the built-in Docker and SSH backends
-   [Vended Tools](lc:user-guide/concepts/tools/vended-tools) — the `sandbox_bash` and `sandbox_file_editor` tool factories

## Related pages

- [Available Sandboxes](lc:user-guide/concepts/sandbox/available-sandboxes) (2 shared tags)
- [Sandbox](lc:user-guide/concepts/sandbox) (2 shared tags)
- [Creating a Custom Model Provider](lc:user-guide/concepts/model-providers/custom_model_provider) (1 shared tag)
- [Tool Executors](lc:user-guide/concepts/tools/executors) (1 shared tag)
- [Human in the Loop](lc:user-guide/concepts/agents/interventions/human-in-the-loop) (1 shared tag)
- [Cedar Authorization](lc:user-guide/concepts/agents/interventions/cedar-authorization) (1 shared tag)
- [Agent Loop](lc:user-guide/concepts/agents/agent-loop) (1 shared tag)
- [Hooks](lc:user-guide/concepts/agents/hooks) (1 shared tag)
- [Steering (Interventions)](lc:user-guide/concepts/agents/interventions/steering) (1 shared tag)
- [Agents as Tools with Strands Agents SDK](lc:user-guide/concepts/multi-agent/agents-as-tools) (1 shared tag)
