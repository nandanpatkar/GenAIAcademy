Data types for the sandbox abstraction.

These types represent the inputs and outputs of sandbox operations — execution results, file metadata, and streaming chunks. They mirror the structural interfaces in `strands-ts/src/sandbox/types.ts` using idiomatic Python dataclasses (the TypeScript discriminator fields such as `type: 'streamChunk'` are replaced by `isinstance` checks, the Pythonic way to discriminate a union).

#### StreamType

Type of a streaming output chunk — distinguishes stdout from stderr.

## StreamChunk

```python
@dataclass
class StreamChunk()
```

Defined in: [src/strands/sandbox/types.py:18](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/sandbox/types.py#L18)

A typed chunk of streaming output from command or code execution.

Allows consumers to distinguish stdout from stderr during streaming, enabling richer UIs and more precise output handling.

**Attributes**:

-   `data` - The text content of the chunk.
-   `stream_type` - Whether this chunk is from stdout or stderr.

## FileInfo

```python
@dataclass
class FileInfo()
```

Defined in: [src/strands/sandbox/types.py:34](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/sandbox/types.py#L34)

Metadata about a file or directory in a sandbox.

Provides minimal structured information that lets tools distinguish files from directories and report sizes. `is_dir` and `size` are `None` when the backend cannot determine them accurately (rather than guessing).

**Attributes**:

-   `name` - The file or directory name (not the full path).
-   `is_dir` - Whether this entry is a directory. `None` if unknown.
-   `size` - File size in bytes. `None` if unknown.

## OutputFile

```python
@dataclass
class OutputFile()
```

Defined in: [src/strands/sandbox/types.py:53](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/sandbox/types.py#L53)

A file produced as output by code execution.

Used to carry binary artifacts (images, charts, PDFs, compiled files) from sandbox execution back to the agent. Shell-based sandboxes typically return an empty list. Jupyter-backed or API-backed sandboxes can populate this with generated artifacts.

**Attributes**:

-   `name` - Filename (e.g., `"plot.png"`).
-   `content` - Raw file content as bytes.
-   `mime_type` - MIME type of the content (e.g., `"image/png"`).

## ExecutionResult

```python
@dataclass
class ExecutionResult()
```

Defined in: [src/strands/sandbox/types.py:73](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/sandbox/types.py#L73)

Result of command or code execution in a sandbox.

**Attributes**:

-   `exit_code` - The exit code of the command or code execution.
-   `stdout` - Standard output captured from execution.
-   `stderr` - Standard error captured from execution.
-   `output_files` - Files produced by the execution (e.g., images, charts). Shell-based sandboxes typically return an empty list.
