Core tool implementations.

This module provides the base classes for all tool implementations in the SDK, including function-based tools and Python module-based tools, as well as utilities for validating tool uses and normalizing tool schemas.

## InvalidToolUseNameException

```python
class InvalidToolUseNameException(Exception)
```

Defined in: [src/strands/tools/tools.py:35](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py#L35)

Exception raised when a tool use has an invalid name.

#### validate\_tool\_use

```python
def validate_tool_use(tool: ToolUse) -> None
```

Defined in: [src/strands/tools/tools.py:41](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py#L41)

Validate a tool use request.

**Arguments**:

-   `tool` - The tool use to validate.

#### validate\_tool\_use\_name

```python
def validate_tool_use_name(tool: ToolUse) -> None
```

Defined in: [src/strands/tools/tools.py:50](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py#L50)

Validate the name of a tool use.

**Arguments**:

-   `tool` - The tool use to validate.

**Raises**:

-   `InvalidToolUseNameException` - If the tool name is invalid.

#### normalize\_schema

```python
def normalize_schema(schema: dict[str, Any],
                     *,
                     _depth: int = 0) -> dict[str, Any]
```

Defined in: [src/strands/tools/tools.py:116](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py#L116)

Normalize a JSON schema to match expectations.

This function recursively processes nested objects to preserve the complete schema structure. Uses a copy-then-normalize approach to preserve all original schema properties.

**Arguments**:

-   `schema` - The schema to normalize.
-   `_depth` - Current nesting depth, used to bound recursion into nested object schemas.

**Returns**:

The normalized schema.

**Raises**:

-   `ValueError` - If the schema is nested too deeply.

#### normalize\_tool\_spec

```python
def normalize_tool_spec(tool_spec: ToolSpec) -> ToolSpec
```

Defined in: [src/strands/tools/tools.py:152](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py#L152)

Normalize a complete tool specification by transforming its inputSchema.

**Arguments**:

-   `tool_spec` - The tool specification to normalize.

**Returns**:

The normalized tool specification.

**Raises**:

-   `ValueError` - If the inputSchema is nested too deeply.

## PythonAgentTool

```python
class PythonAgentTool(AgentTool)
```

Defined in: [src/strands/tools/tools.py:179](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py#L179)

Tool implementation for Python-based tools.

This class handles tools implemented as Python functions, providing a simple interface for executing Python code as SDK tools.

#### \_\_init\_\_

```python
def __init__(tool_name: str, tool_spec: ToolSpec, tool_func: ToolFunc) -> None
```

Defined in: [src/strands/tools/tools.py:190](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py#L190)

Initialize a Python-based tool.

**Arguments**:

-   `tool_name` - Unique identifier for the tool.
-   `tool_spec` - Tool specification defining parameters and behavior.
-   `tool_func` - Python function to execute when the tool is invoked.

#### tool\_name

```python
@property
def tool_name() -> str
```

Defined in: [src/strands/tools/tools.py:205](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py#L205)

Get the name of the tool.

**Returns**:

The name of the tool.

#### tool\_spec

```python
@property
def tool_spec() -> ToolSpec
```

Defined in: [src/strands/tools/tools.py:214](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py#L214)

Get the tool specification for this Python-based tool.

**Returns**:

The tool specification.

#### tool\_spec

```python
@tool_spec.setter
def tool_spec(value: ToolSpec) -> None
```

Defined in: [src/strands/tools/tools.py:223](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py#L223)

Set the tool specification.

This allows runtime modification of the tool’s schema, enabling dynamic tool configurations based on feature flags or other runtime conditions.

**Arguments**:

-   `value` - The new tool specification.

**Raises**:

-   `ValueError` - If the spec fails structural validation (wrong name or missing required field).

#### supports\_hot\_reload

```python
@property
def supports_hot_reload() -> bool
```

Defined in: [src/strands/tools/tools.py:248](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py#L248)

Check if this tool supports automatic reloading when modified.

**Returns**:

Always true for function-based tools.

#### tool\_type

```python
@property
def tool_type() -> str
```

Defined in: [src/strands/tools/tools.py:257](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py#L257)

Identifies this as a Python-based tool implementation.

**Returns**:

“python”.

#### stream

```python
@override
async def stream(tool_use: ToolUse, invocation_state: dict[str, Any],
                 **kwargs: Any) -> ToolGenerator
```

Defined in: [src/strands/tools/tools.py:266](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py#L266)

Stream the Python function with the given tool use request.

**Arguments**:

-   `tool_use` - The tool use request.
-   `invocation_state` - Context for the tool invocation, including agent state.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Yields**:

Tool events with the last being the tool result.
