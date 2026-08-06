Bash tool for executing shell commands through a sandbox.

Provides :func:`make_bash` (a factory for a stateless, sandbox-routed bash tool) and :data:`bash` (the default instance that reads the sandbox from the agent at call time). Each call runs in a fresh shell; state such as variables and the working directory does not persist across calls.

#### make\_bash

```python
def make_bash(
        *,
        sandbox: Sandbox | None = None,
        name: str = "bash",
        description: str = SANDBOX_BASH_DESCRIPTION) -> DecoratedFunctionTool
```

Defined in: [src/strands/vended\_tools/bash/bash.py:25](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_tools/bash/bash.py#L25)

Create a stateless, sandbox-routed bash tool.

If a `sandbox` is passed, it is bound at creation time. Otherwise the tool reads the sandbox from `tool_context.agent.sandbox` at call time. Used by sandbox implementations in :meth:`~strands.sandbox.base.Sandbox.get_tools` and by users who want a customized bash tool.

**Arguments**:

-   `sandbox` - Sandbox to bind at creation. When `None`, the agent’s configured sandbox is used at call time.
-   `name` - Tool name. Defaults to `"bash"`.
-   `description` - Tool description shown to the model.

**Returns**:

A decorated tool that executes shell commands through the sandbox.

#### bash

Default bash tool. Reads the sandbox from the agent’s context at call time.
