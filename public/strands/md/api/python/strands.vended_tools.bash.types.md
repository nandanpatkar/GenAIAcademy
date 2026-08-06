Shared types and constants for the bash tool.

## BashOutput

```python
class BashOutput(TypedDict)
```

Defined in: [src/strands/vended\_tools/bash/types.py:6](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_tools/bash/types.py#L6)

Output of a bash command execution.

**Attributes**:

-   `output` - Standard output captured from the command.
-   `error` - Standard error captured from the command. Empty when there was none.

#### SANDBOX\_BASH\_DESCRIPTION

Description for the bash tool.
