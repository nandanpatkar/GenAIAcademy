Error types raised by sandbox execution and file operations.

Mirrors `strands-ts/src/sandbox/errors.ts`. Each error subclasses its stdlib equivalent so existing `except TimeoutError` / `except FileNotFoundError` handlers keep working, while giving callers a sandbox-specific type to branch on.

## SandboxTimeoutError

```python
class SandboxTimeoutError(TimeoutError)
```

Defined in: [src/strands/sandbox/errors.py:9](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/sandbox/errors.py#L9)

Raised by sandbox execution when the configured `timeout` elapses.

#### \_\_init\_\_

```python
def __init__(seconds: float | None) -> None
```

Defined in: [src/strands/sandbox/errors.py:12](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/sandbox/errors.py#L12)

Initialize the error with the timeout duration.

**Arguments**:

-   `seconds` - The timeout duration, in seconds, that elapsed.

## SandboxPathNotFoundError

```python
class SandboxPathNotFoundError(FileNotFoundError)
```

Defined in: [src/strands/sandbox/errors.py:21](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/sandbox/errors.py#L21)

Raised by :meth:`~strands.sandbox.base.Sandbox.list_files` when the path does not exist.

Distinguishes genuine absence (a missing path, or a file where a directory was expected) from permission or transport failures, which raise plain :class:`OSError`/:class:`FileNotFoundError`.

#### \_\_init\_\_

```python
def __init__(path: str) -> None
```

Defined in: [src/strands/sandbox/errors.py:29](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/sandbox/errors.py#L29)

Initialize the error with the missing path.

**Arguments**:

-   `path` - The path that does not exist.
