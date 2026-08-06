LangChain and [Deep Agents](lc:oss/python/deepagents/overview) provide prebuilt middleware for common use cases. Each middleware is production-ready and configurable for your specific needs.

## Provider-agnostic middleware

The following middleware work with any LLM provider:


| Middleware | Description |
|------------|-------------|
| [Summarization](#summarization) | Automatically summarize conversation history when approaching token limits. |
| [Human-in-the-loop](#human-in-the-loop) | Pause execution for human approval of tool calls. |
| [Model call limit](#model-call-limit) | Limit the number of model calls to prevent excessive costs. |
| [Tool call limit](#tool-call-limit) | Control tool execution by limiting call counts. |
| [Model fallback](#model-fallback) | Automatically fallback to alternative models when primary fails. |
| [PII detection](#pii-detection) | Detect and handle Personally Identifiable Information (PII). |
| [To-do list](#to-do-list) | Equip agents with task planning and tracking capabilities. |
| [LLM tool selector](#llm-tool-selector) | Use an LLM to select relevant tools before calling main model. |
| [Tool error](#tool-error) | Catch tool execution exceptions and convert them to error messages for the model. |
| [Tool retry](#tool-retry) | Automatically retry failed tool calls with exponential backoff. |
| [Model retry](#model-retry) | Automatically retry failed model calls with exponential backoff. |
| [LLM tool emulator](#llm-tool-emulator) | Emulate tool execution using an LLM for testing purposes. |
| [Context editing](#context-editing) | Manage conversation context by trimming or clearing tool uses. |
| [Provider tool search](#provider-tool-search) | Defer tools behind providers' server-side tool search, surfacing them on demand. |
| [Shell tool](#shell-tool) | Expose a persistent shell session to agents for command execution. |
| [File search](#file-search) | Provide Glob and Grep search tools over filesystem files. |
| [Filesystem](#filesystem-middleware) | Provide agents with a filesystem for storing context and long-term memories. |
| [Subagent](#subagent) | Add the ability to spawn subagents. |
| [Rubric grading (Beta)](#rubric-grading) | Apply LLM-as-a-judge grading so agents self-evaluate and iterate until a rubric is satisfied. |


### Summarization

Automatically summarize conversation history when approaching token limits, preserving recent messages while compressing older context. Summarization is useful for the following:
- Long-running conversations that exceed context windows.
- Multi-turn dialogues with extensive history.
- Applications where preserving full conversation context matters.


> [!NOTE]
>
> Summarization is text-oriented context compression. It does not resize, downsample, or otherwise compress image/audio/video payloads. Recent messages retained by `keep` still include their original multimodal blocks, while older multimodal messages that are summarized are represented only by the generated text summary. For image-heavy applications, store media in a filesystem or object store and pass URLs or file references through message history.


**API reference:** `SummarizationMiddleware`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware

agent = create_agent(
    model="gpt-5.5",
    tools=[your_weather_tool, your_calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model="gpt-5.4-mini",
            trigger=("tokens", 4000),
            keep=("messages", 20),
        ),
    ],
)
```


### Configuration options


> [!TIP]
>
> The `fraction` conditions for `trigger` and `keep` (shown below) rely on a chat model's [profile data](lc:oss/python/langchain/models#model-profiles) if using `langchain>=1.1`. If data are not available, use another condition or specify manually:
>
>     ```python
>     from langchain.chat_models import init_chat_model
>
>     custom_profile = {
>         "max_input_tokens": 100_000,
>         # ...
>     }
>     model = init_chat_model("gpt-5.5", profile=custom_profile)
>     ```


    Model for generating summaries. Can be a model identifier string (e.g., `'openai:gpt-5.4-mini'`) or a `BaseChatModel` instance. See `init_chat_model`[init_chat_model(model)] for more information.

    Condition(s) for triggering summarization. Can be:

    - A single `ContextSize` tuple (the specified threshold must be met)
    - A single `TriggerClause` dict (all specified thresholds must be met - AND logic)
    - A list mixing either form (any item must be met - OR logic)

    Supported thresholds are:

    - `fraction` (float): Fraction of model's context size (0-1)
    - `tokens` (int): Absolute token count
    - `messages` (int): Message count

    A `ContextSize` tuple expresses exactly one threshold. A `TriggerClause` dict can include one or more thresholds, e.g. `{"tokens": 4000, "messages": 10}`, and all thresholds in the dict must be met (AND).

    Each `TriggerClause` dict must specify at least one threshold. If `trigger` is not provided, summarization will not trigger automatically.

    See the API reference for `ContextSize` and `TriggerClause` for more information.

    How much context to preserve after summarization. Specify exactly one of:

    - `fraction` (float): Fraction of model's context size to keep (0-1)
    - `tokens` (int): Absolute token count to keep
    - `messages` (int): Number of recent messages to keep

    See the API reference for `ContextSize` for more information.

    Custom token counting function. Defaults to character-based counting.

    Custom prompt template for summarization. Uses built-in template if not specified. The template should include `{messages}` placeholder where conversation history will be inserted.

    Maximum number of tokens to include when generating the summary. Messages will be trimmed to fit this limit before summarization.

    **Deprecated:** Use `summary_prompt` to provide the full prompt instead.

    **Deprecated:** Use `trigger: ("tokens", value)` instead. Token threshold for triggering summarization.

    **Deprecated:** Use `keep: ("messages", value)` instead. Recent messages to preserve.


### Full example

The summarization middleware monitors message token counts and automatically summarizes older messages when thresholds are reached.

**Trigger conditions** control when summarization runs:
- A single threshold triggers when that threshold is met
- A trigger clause with multiple thresholds triggers only when all thresholds are met (AND logic)
- A list of trigger conditions triggers when any item is met (OR logic)
- Each threshold can use `fraction` (of model's context size), `tokens` (absolute count), or `messages` (message count)

**Keep condition** control how much context to preserve (specify exactly one):
- `fraction` - Fraction of model's context size to keep
- `tokens` - Absolute token count to keep
- `messages` - Number of recent messages to keep

```python
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware

# Single condition: trigger if tokens >= 4000
agent = create_agent(
    model="gpt-5.5",
    tools=[your_weather_tool, your_calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model="gpt-5.4-mini",
            trigger=("tokens", 4000),
            keep=("messages", 20),
        ),
    ],
)

# Multiple conditions: trigger if number of tokens >= 3000 OR messages >= 6
agent2 = create_agent(
    model="gpt-5.5",
    tools=[your_weather_tool, your_calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model="gpt-5.4-mini",
            trigger=[
                ("tokens", 3000),
                ("messages", 6),
            ],
            keep=("messages", 20),
        ),
    ],
)

# AND logic: trigger only when tokens >= 4000 AND messages >= 10
agent3 = create_agent(
    model="gpt-5.5",
    tools=[your_weather_tool, your_calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model="gpt-5.4-mini",
            trigger={"tokens": 4000, "messages": 10},
            keep=("messages", 20),
        ),
    ],
)

# Combine AND and OR: trigger if (tokens >= 5000 AND messages >= 3)
# OR (tokens >= 3000 AND messages >= 6)
agent4 = create_agent(
    model="gpt-5.5",
    tools=[your_weather_tool, your_calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model="gpt-5.4-mini",
            trigger=[
                {"tokens": 5000, "messages": 3},
                {"tokens": 3000, "messages": 6},
            ],
            keep=("messages", 20),
        ),
    ],
)

# Using fractional limits
agent5 = create_agent(
    model="gpt-5.5",
    tools=[your_weather_tool, your_calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model="gpt-5.4-mini",
            trigger=("fraction", 0.8),
            keep=("fraction", 0.3),
        ),
    ],
)
```


### Human-in-the-loop

Pause agent execution for human approval, editing, or rejection of tool calls before they execute. [Human-in-the-loop](lc:oss/python/langchain/human-in-the-loop) is useful for the following:

- High-stakes operations requiring human approval (e.g. database writes, financial transactions).
- Compliance workflows where human oversight is mandatory.
- Long-running conversations where human feedback guides the agent.

**API reference:** `HumanInTheLoopMiddleware`


> [!WARNING]
>
> Human-in-the-loop middleware requires a [checkpointer](lc:oss/python/langgraph/checkpointers#checkpoints) to maintain state across interruptions.


```python
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langgraph.checkpoint.memory import InMemorySaver

def your_read_email_tool(email_id: str) -> str:
    """Mock function to read an email by its ID."""
    return f"Email content for ID: {email_id}"

def your_send_email_tool(recipient: str, subject: str, body: str) -> str:
    """Mock function to send an email."""
    return f"Email sent to {recipient} with subject '{subject}'"

agent = create_agent(
    model="gpt-5.5",
    tools=[your_read_email_tool, your_send_email_tool],
    checkpointer=InMemorySaver(),
    middleware=[
        HumanInTheLoopMiddleware(
            interrupt_on={
                "your_send_email_tool": {
                    "allowed_decisions": ["approve", "edit", "reject"],
                },
                "your_read_email_tool": False,
            }
        ),
    ],
)
```


> [!TIP]
>
> For complete examples, configuration options, and integration patterns, see the [Human-in-the-loop documentation](lc:oss/python/langchain/human-in-the-loop).


> 
    Watch this [video guide](https://www.youtube.com/watch?v=SpfT6-YAVPk) demonstrating Human-in-the-loop middleware behavior.


### Model call limit

Limit the number of model calls to prevent infinite loops or excessive costs. Model call limit is useful for the following:

- Preventing runaway agents from making too many API calls.
- Enforcing cost controls on production deployments.
- Testing agent behavior within specific call budgets.

**API reference:** `ModelCallLimitMiddleware`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ModelCallLimitMiddleware
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
    model="gpt-5.5",
    checkpointer=InMemorySaver(),  # Required for thread limiting
    tools=[],
    middleware=[
        ModelCallLimitMiddleware(
            thread_limit=10,
            run_limit=5,
            exit_behavior="end",
        ),
    ],
)
```


> 
    Watch this [video guide](https://www.youtube.com/watch?v=nJEER0uaNkE) demonstrating Model Call Limit middleware behavior.


### Configuration options


    Maximum model calls across all runs in a thread. Defaults to no limit.

    Maximum model calls per single invocation. Defaults to no limit.

    Behavior when limit is reached. Options: `'end'` (graceful termination) or `'error'` (raise exception)


### Tool call limit

Control agent execution by limiting the number of tool calls, either globally across all tools or for specific tools. Tool call limits are useful for the following:

- Preventing excessive calls to expensive external APIs.
- Limiting web searches or database queries.
- Enforcing rate limits on specific tool usage.
- Protecting against runaway agent loops.

**API reference:** `ToolCallLimitMiddleware`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ToolCallLimitMiddleware

agent = create_agent(
    model="gpt-5.5",
    tools=[search_tool, database_tool],
    middleware=[
        # Global limit
        ToolCallLimitMiddleware(thread_limit=20, run_limit=10),
        # Tool-specific limit
        ToolCallLimitMiddleware(
            tool_name="search",
            thread_limit=5,
            run_limit=3,
        ),
    ],
)
```


> 
    Watch this [video guide](https://www.youtube.com/watch?v=6gYlaJJ8t0w) demonstrating Tool Call Limit middleware behavior.


### Configuration options


    Name of specific tool to limit. If not provided, limits apply to **all tools globally**.

    Maximum tool calls across all runs in a thread (conversation). Persists across multiple invocations with the same thread ID. Requires a checkpointer to maintain state. `None` means no thread limit.

    Maximum tool calls per single invocation (one user message → response cycle). Resets with each new user message. `None` means no run limit.

    **Note:** At least one of `thread_limit` or `run_limit` must be specified.

    Behavior when limit is reached:

    - `'continue'` (default) - Block exceeded tool calls with error messages, let other tools and the model continue. The model decides when to end based on the error messages.
    - `'error'` - Raise a `ToolCallLimitExceededError` exception, stopping execution immediately
    - `'end'` - Stop execution immediately with a `ToolMessage` and AI message for the exceeded tool call. Only works when limiting a single tool; raises `NotImplementedError` if other tools have pending calls.


### Full example

Specify limits with:
- **Thread limit** - Max calls across all runs in a conversation (requires checkpointer)
- **Run limit** - Max calls per single invocation (resets each turn)

Exit behaviors:
- `'continue'` (default) - Block exceeded calls with error messages, agent continues
- `'error'` - Raise exception immediately
- `'end'` - Stop with ToolMessage + AI message (single-tool scenarios only)

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ToolCallLimitMiddleware

global_limiter = ToolCallLimitMiddleware(thread_limit=20, run_limit=10)
search_limiter = ToolCallLimitMiddleware(tool_name="search", thread_limit=5, run_limit=3)
database_limiter = ToolCallLimitMiddleware(tool_name="query_database", thread_limit=10)
strict_limiter = ToolCallLimitMiddleware(tool_name="scrape_webpage", run_limit=2, exit_behavior="error")

agent = create_agent(
    model="gpt-5.5",
    tools=[search_tool, database_tool, scraper_tool],
    middleware=[global_limiter, search_limiter, database_limiter, strict_limiter],
)
```


### Model fallback

Automatically fallback to alternative models when the primary model fails. Model fallback is useful for the following:

- Building resilient agents that handle model outages.
- Cost optimization by falling back to cheaper models.
- Provider redundancy across OpenAI, Anthropic, etc.

**API reference:** `ModelFallbackMiddleware`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ModelFallbackMiddleware

agent = create_agent(
    model="gpt-5.5",
    tools=[],
    middleware=[
        ModelFallbackMiddleware(
            "gpt-5.4-mini",
            "claude-3-5-sonnet-20241022",
        ),
    ],
)
```


> 
    Watch this [video guide](https://www.youtube.com/watch?v=8rCRO0DUeIM) demonstrating Model Fallback middleware behavior.


### Configuration options


    First fallback model to try when the primary model fails. Can be a model identifier string (e.g., `'openai:gpt-5.4-mini'`) or a `BaseChatModel` instance.

    Additional fallback models to try in order if previous models fail


### PII detection

Detect and handle Personally Identifiable Information (PII) in conversations using configurable strategies. PII detection is useful for the following:

- Healthcare and financial applications with compliance requirements.
- Customer service agents that need to sanitize logs.
- Any application handling sensitive user data.


> [!NOTE]
>
> With `apply_to_output=True`, `PIIMiddleware` also redacts streamed wire output—text deltas, tool-call args, tool outputs, and state snapshots—via a registered stream transformer. Requires `langchain>=1.3.2`. See [Register transformers on middleware](lc:oss/python/langchain/event-streaming#register-transformers-on-middleware).


**API reference:** `PIIMiddleware`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware

agent = create_agent(
    model="gpt-5.5",
    tools=[],
    middleware=[
        PIIMiddleware("email", strategy="redact", apply_to_input=True),
        PIIMiddleware("credit_card", strategy="mask", apply_to_input=True),
    ],
)
```


#### Custom PII types

You can create custom PII types by providing a `detector` parameter. This allows you to detect patterns specific to your use case beyond the built-in types.

**Three ways to create custom detectors:**

1. **Regex pattern string** - Simple pattern matching
1. **Custom function** - Complex detection logic with validation

```python
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware

# Method 1: Regex pattern string
agent1 = create_agent(
    model="gpt-5.5",
    tools=[],
    middleware=[
        PIIMiddleware(
            "api_key",
            detector=r"sk-[a-zA-Z0-9]{32}",
            strategy="block",
        ),
    ],
)

# Method 2: Compiled regex pattern
agent2 = create_agent(
    model="gpt-5.5",
    tools=[],
    middleware=[
        PIIMiddleware(
            "phone_number",
            detector=re.compile(r"\+?\d{1,3}[\s.-]?\d{3,4}[\s.-]?\d{4}"),
            strategy="mask",
        ),
    ],
)

# Method 3: Custom detector function
def detect_ssn(content: str) -> list[dict[str, str | int]]:
    """Detect SSN with validation.

    Returns a list of dictionaries with 'text', 'start', and 'end' keys.
    """

    matches = []
    pattern = r"\d{3}-\d{2}-\d{4}"
    for match in re.finditer(pattern, content):
        ssn = match.group(0)
        # Validate: first 3 digits shouldn't be 000, 666, or 900-999
        first_three = int(ssn[:3])
        if first_three not in [0, 666] and not (900 <= first_three <= 999):
            matches.append({
                "text": ssn,
                "start": match.start(),
                "end": match.end(),
            })
    return matches

agent3 = create_agent(
    model="gpt-5.5",
    tools=[],
    middleware=[
        PIIMiddleware(
            "ssn",
            detector=detect_ssn,
            strategy="hash",
        ),
    ],
)
```


**Custom detector function signature:**

The detector function must accept a string (content) and return matches:

Returns a list of dictionaries with `text`, `start`, and `end` keys:
```python
def detector(content: str) -> list[dict[str, str | int]]:
    return [
        {"text": "matched_text", "start": 0, "end": 12},
        # ... more matches
    ]
```


> [!TIP]
>
> For custom detectors:
>
>     - Use regex strings for simple patterns
>     - Use RegExp objects when you need flags (e.g., case-insensitive matching)
>     - Use custom functions when you need validation logic beyond pattern matching
>     - Custom functions give you full control over detection logic and can implement complex validation rules


### Configuration options


    Type of PII to detect. Can be a built-in type (`email`, `credit_card`, `ip`, `mac_address`, `url`) or a custom type name.

    How to handle detected PII. Options:

    - `'block'` - Raise exception when detected
    - `'redact'` - Replace with `[REDACTED_{PII_TYPE}]`
    - `'mask'` - Partially mask (e.g., `****-****-****-1234`)
    - `'hash'` - Replace with deterministic hash

    Custom detector function or regex pattern. If not provided, uses built-in detector for the PII type.

    Check user messages before model call

    Check AI messages after model call. With `langchain>=1.3.2`, also redacts streamed wire output (text deltas, tool-call args, tool outputs, state snapshots) via a registered stream transformer. See [event streaming](lc:oss/python/langchain/event-streaming#register-transformers-on-middleware).

    Check tool result messages after execution


### To-do list

Equip agents with task planning and tracking capabilities for complex multi-step tasks. To-do lists are useful for the following:

- Complex multi-step tasks requiring coordination across multiple tools.
- Long-running operations where progress visibility is important.


> [!NOTE]
>
> This middleware automatically provides agents with a `write_todos` tool and system prompts to guide effective task planning.


**API reference:** `TodoListMiddleware`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import TodoListMiddleware

agent = create_agent(
    model="gpt-5.5",
    tools=[read_file, write_file, run_tests],
    middleware=[TodoListMiddleware()],
)
```


> 
    Watch this [video guide](https://www.youtube.com/watch?v=yTWocbVKQxw) demonstrating To-do List middleware behavior.


### Configuration options


    Custom system prompt for guiding todo usage. Uses built-in prompt if not specified.

    Custom description for the `write_todos` tool. Uses built-in description if not specified.


### LLM tool selector

Use an LLM to intelligently select relevant tools before calling the main model. LLM tool selectors are useful for the following:

- Agents with many tools (10+) where most aren't relevant per query.
- Reducing token usage by filtering irrelevant tools.
- Improving model focus and accuracy.

This middleware uses structured output to ask an LLM which tools are most relevant for the current query. The structured output schema defines the available tool names and descriptions. Model providers often add this structured output information to the system prompt behind the scenes.

**API reference:** `LLMToolSelectorMiddleware`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import LLMToolSelectorMiddleware

agent = create_agent(
    model="gpt-5.5",
    tools=[tool1, tool2, tool3, tool4, tool5, ...],
    middleware=[
        LLMToolSelectorMiddleware(
            model="gpt-5.4-mini",
            max_tools=3,
            always_include=["search"],
        ),
    ],
)
```


### Configuration options


    Model for tool selection. Can be a model identifier string (e.g., `'openai:gpt-5.4-mini'`) or a `BaseChatModel` instance. See `init_chat_model`[init_chat_model(model)] for more information.

    Defaults to the agent's main model.

    Instructions for the selection model. Uses built-in prompt if not specified.

    Maximum number of tools to select. If the model selects more, only the first max_tools will be used. No limit if not specified.

    Tool names to always include regardless of selection. These do not count against the max_tools limit.


### Tool error


Catch exceptions raised during tool execution and convert them into error `ToolMessage`s that the model can see and recover from, instead of halting the agent run. Tool error is useful for the following:

- Letting the model retry a failed tool call with corrected arguments.
- Surfacing controlled, sanitized error messages instead of raw exception details.
- Preventing unexpected tool exceptions from crashing the agent.


> [!NOTE]
>
> Tool error middleware does not automatically retry failed calls. For retries, compose with [Tool retry](#tool-retry) middleware placed *inner* (earlier in the `middleware` list) and configured with `on_failure="error"` so that exceptions reach the tool error middleware. See the [full example](#tool-error-full-example) below.


**API reference:** `ToolErrorMiddleware`


> [!NOTE]
>
> `ToolErrorMiddleware` requires `langchain>=1.3.14`.


```python
from langchain.agents import create_agent
from langchain.agents.middleware import ToolErrorMiddleware

def on_error(exc: Exception, request: ToolCallRequest) -> str | None:
    if isinstance(exc, ValueError):
        return f"`{request.tool_call['name']}` failed with {type(exc).__name__}."
    # propagate everything else

agent = create_agent(
    model="gpt-5.5",
    tools=[your_tools],
    middleware=[ToolErrorMiddleware(on_error)],
)
```

### Configuration options

    Sync handler called for each exception raised by tool execution. Return content (a `str` or list of content blocks) to convert the exception into a `ToolMessage(status="error")`. Return `None` or omit a return statement to let the exception propagate. Used on the sync path and, unless `aon_error` is given, on the async path.

    Optional async handler, used on the async execution path. Falls back to `on_error` when not provided.

    Optional list of tools or tool names to apply error handling to. If `None`, applies to all tools.

### Tool error full example

The `on_error` handler receives the exception and the `ToolCallRequest` (which includes the tool call dict with name, args, and call ID). Return `None` for exceptions you do not want to handle, and they will propagate normally.

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ToolErrorMiddleware, ToolRetryMiddleware

def on_error(exc: Exception, request: ToolCallRequest) -> str | None:
    # Surface ValueError to the model so it can correct the input
    if isinstance(exc, ValueError):
        return f"`{request.tool_call['name']}` failed: {type(exc).__name__}. Fix the input and retry."
    # Let all other exceptions propagate (halts the run)
    return None

# Async-only usage
async def aon_error(exc: Exception, request: ToolCallRequest) -> str | None:
    if isinstance(exc, ConnectionError):
        return f"Tool `{request.tool_call['name']}` encountered a connection error."
    return None

agent = create_agent(
    model="gpt-5.5",
    tools=[search_tool, database_tool],
    middleware=[
        # Place retry inner so exceptions reach ToolErrorMiddleware after retries are exhausted
        ToolRetryMiddleware(max_retries=3, on_failure="error"),
        ToolErrorMiddleware(on_error=on_error, tools=["search_tool"]),
    ],
)

# Async-only: pass aon_error alone (do not pass on_error)
async_agent = create_agent(
    model="gpt-5.5",
    tools=[api_tool],
    middleware=[ToolErrorMiddleware(aon_error=aon_error)],
)
```


> [!NOTE]
>
> Prefer returning content that names the exception type over the raw exception message, which may carry sensitive or internal detail. The `on_error` handler controls disclosure: the raw exception message is never sent to the model unless you choose to include it.


### Tool retry

Automatically retry failed tool calls with configurable exponential backoff. Tool retry is useful for the following:

- Handling transient failures in external API calls.
- Improving reliability of network-dependent tools.
- Building resilient agents that gracefully handle temporary errors.

**API reference:** `ToolRetryMiddleware`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ToolRetryMiddleware

agent = create_agent(
    model="gpt-5.5",
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=3,
            backoff_factor=2.0,
            initial_delay=1.0,
        ),
    ],
)
```


### Configuration options


    Maximum number of retry attempts after the initial call (3 total attempts with default)

    Optional list of tools or tool names to apply retry logic to. If `None`, applies to all tools.

    Either a tuple of exception types to retry on, or a callable that takes an exception and returns `True` if it should be retried. By default, all exceptions are retried. Exceptions that do not match propagate immediately and are not handled by `on_failure`.

    Behavior when all retries are exhausted. Options:
    - `'continue'` (default) - Return a `ToolMessage` with error details, allowing the LLM to handle the failure
    - `'error'` - Re-raise the exception, stopping agent execution
    - Custom callable - Function that takes the exception and returns a string for the `ToolMessage` content

    **Deprecated values:** `'return_message'` (use `'continue'` instead) and `'raise'` (use `'error'` instead).

    Multiplier for exponential backoff. Each retry waits `initial_delay * (backoff_factor ** retry_number)` seconds. Set to `0.0` for constant delay.

    Initial delay in seconds before first retry

    Maximum delay in seconds between retries (caps exponential backoff growth)

    Whether to add random jitter (`±25%`) to delay to avoid thundering herd


### Full example

The middleware automatically retries failed tool calls with exponential backoff.

**Key configuration:**
- `max_retries` - Number of retry attempts (default: 2)
- `backoff_factor` - Multiplier for exponential backoff (default: 2.0)
- `initial_delay` - Starting delay in seconds (default: 1.0)
- `max_delay` - Cap on delay growth (default: 60.0)
- `jitter` - Add random variation (default: True)

**Failure handling:**
- `on_failure='continue'` (default) - Return error message
- `on_failure='error'` - Re-raise exception
- Custom function - Function returning error message

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ToolRetryMiddleware

agent = create_agent(
    model="gpt-5.5",
    tools=[search_tool, database_tool, api_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=3,
            backoff_factor=2.0,
            initial_delay=1.0,
            max_delay=60.0,
            jitter=True,
            tools=["api_tool"],
            retry_on=(ConnectionError, TimeoutError),
            on_failure="continue",
        ),
    ],
)
```


### Model retry

Automatically retry failed model calls with configurable exponential backoff. Model retry is useful for the following:

- Handling transient failures in model API calls.
- Improving reliability of network-dependent model requests.
- Building resilient agents that gracefully handle temporary model errors.

**API reference:** `ModelRetryMiddleware`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ModelRetryMiddleware

agent = create_agent(
    model="gpt-5.5",
    tools=[search_tool, database_tool],
    middleware=[
        ModelRetryMiddleware(
            max_retries=3,
            backoff_factor=2.0,
            initial_delay=1.0,
        ),
    ],
)
```


### Configuration options


    Maximum number of retry attempts after the initial call (3 total attempts with default)

    Either a tuple of exception types to retry on, or a callable that takes an exception and returns `True` if it should be retried.

    Behavior when all retries are exhausted. Options:
    - `'continue'` (default) - Return an `AIMessage` with error details, allowing the agent to potentially handle the failure gracefully
    - `'error'` - Re-raise the exception (stops agent execution)
    - Custom callable - Function that takes the exception and returns a string for the `AIMessage` content

    Multiplier for exponential backoff. Each retry waits `initial_delay * (backoff_factor ** retry_number)` seconds. Set to `0.0` for constant delay.

    Initial delay in seconds before first retry

    Maximum delay in seconds between retries (caps exponential backoff growth)

    Whether to add random jitter (`±25%`) to delay to avoid thundering herd


### Full example

The middleware automatically retries failed model calls with exponential backoff.

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ModelRetryMiddleware

# Basic usage with default settings (2 retries, exponential backoff)
agent = create_agent(
    model="gpt-5.5",
    tools=[search_tool],
    middleware=[ModelRetryMiddleware()],
)

# Custom exception filtering
class TimeoutError(Exception):
    """Custom exception for timeout errors."""
    pass

class ConnectionError(Exception):
    """Custom exception for connection errors."""
    pass

# Retry specific exceptions only
retry = ModelRetryMiddleware(
    max_retries=4,
    retry_on=(TimeoutError, ConnectionError),
    backoff_factor=1.5,
)

def should_retry(error: Exception) -> bool:
    # Only retry on rate limit errors
    if isinstance(error, TimeoutError):
        return True
    # Or check for specific HTTP status codes
    if hasattr(error, "status_code"):
        return error.status_code in (429, 503)
    return False

retry_with_filter = ModelRetryMiddleware(
    max_retries=3,
    retry_on=should_retry,
)

# Return error message instead of raising
retry_continue = ModelRetryMiddleware(
    max_retries=4,
    on_failure="continue",  # Return AIMessage with error instead of raising
)

# Custom error message formatting
def format_error(error: Exception) -> str:
    return f"Model call failed: {error}. Please try again later."

retry_with_formatter = ModelRetryMiddleware(
    max_retries=4,
    on_failure=format_error,
)

# Constant backoff (no exponential growth)
constant_backoff = ModelRetryMiddleware(
    max_retries=5,
    backoff_factor=0.0,  # No exponential growth
    initial_delay=2.0,  # Always wait 2 seconds
)

# Raise exception on failure
strict_retry = ModelRetryMiddleware(
    max_retries=2,
    on_failure="error",  # Re-raise exception instead of returning message
)
```


### LLM tool emulator

Emulate tool execution using an LLM for testing purposes, replacing actual tool calls with AI-generated responses. LLM tool emulators are useful for the following:

- Testing agent behavior without executing real tools.
- Developing agents when external tools are unavailable or expensive.
- Prototyping agent workflows before implementing actual tools.

**API reference:** `LLMToolEmulator`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import LLMToolEmulator

agent = create_agent(
    model="gpt-5.5",
    tools=[get_weather, search_database, send_email],
    middleware=[
        LLMToolEmulator(),  # Emulate all tools
    ],
)
```


### Configuration options


    List of tool names (str) or BaseTool instances to emulate. If `None` (default), ALL tools will be emulated. If empty list `[]`, no tools will be emulated. If array with tool names/instances, only those tools will be emulated.

    Model to use for generating emulated tool responses. Can be a model identifier string (e.g., `'google_genai:gemini-3.6-flash'`) or a `BaseChatModel` instance. Defaults to the agent's model if not specified. See `init_chat_model`[init_chat_model(model)] for more information.


### Full example

The middleware uses an LLM to generate plausible responses for tool calls instead of executing the actual tools.

```python
from langchain.agents import create_agent
from langchain.agents.middleware import LLMToolEmulator
from langchain.tools import tool

@tool
def get_weather(location: str) -> str:
    """Get the current weather for a location."""
    return f"Weather in {location}"

@tool
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email."""
    return "Email sent"

# Emulate all tools (default behavior)
agent = create_agent(
    model="gpt-5.5",
    tools=[get_weather, send_email],
    middleware=[LLMToolEmulator()],
)

# Emulate specific tools only
agent2 = create_agent(
    model="gpt-5.5",
    tools=[get_weather, send_email],
    middleware=[LLMToolEmulator(tools=["get_weather"])],
)

# Use custom model for emulation
agent4 = create_agent(
    model="gpt-5.5",
    tools=[get_weather, send_email],
    middleware=[LLMToolEmulator(model="claude-sonnet-4-6")],
)
```


### Context editing

Manage conversation context by clearing older tool call outputs when token limits are reached, while preserving recent results. This helps keep context windows manageable in long conversations with many tool calls. Context editing is useful for the following:

- Long conversations with many tool calls that exceed token limits
- Reducing token costs by removing older tool outputs that are no longer relevant
- Maintaining only the most recent N tool results in context

**API reference:** `ContextEditingMiddleware`, `ClearToolUsesEdit`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ContextEditingMiddleware, ClearToolUsesEdit

agent = create_agent(
    model="gpt-5.5",
    tools=[],
    middleware=[
        ContextEditingMiddleware(
            edits=[
                ClearToolUsesEdit(
                    trigger=100000,
                    keep=3,
                ),
            ],
        ),
    ],
)
```


### Configuration options


    List of `ContextEdit` strategies to apply

    Token counting method. Options: `'approximate'` or `'model'`

**`ClearToolUsesEdit` options:**

    Token count that triggers the edit. When the conversation exceeds this token count, older tool outputs will be cleared.

    Minimum number of tokens to reclaim when the edit runs. If set to 0, clears as much as needed.

    Number of most recent tool results that must be preserved. These will never be cleared.

    Whether to clear the originating tool call parameters on the AI message. When `True`, tool call arguments are replaced with empty objects.

    List of tool names to exclude from clearing. These tools will never have their outputs cleared.

    Placeholder text inserted for cleared tool outputs. This replaces the original tool message content.


### Full example

The middleware applies context editing strategies when token limits are reached. The most common strategy is `ClearToolUsesEdit`, which clears older tool results while preserving recent ones.

**How it works:**
1. Monitor token count in conversation
2. When threshold is reached, clear older tool outputs
3. Keep most recent N tool results
4. Optionally preserve tool call arguments for context

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ContextEditingMiddleware, ClearToolUsesEdit

agent = create_agent(
    model="gpt-5.5",
    tools=[search_tool, your_calculator_tool, database_tool],
    middleware=[
        ContextEditingMiddleware(
            edits=[
                ClearToolUsesEdit(
                    trigger=2000,
                    keep=3,
                    clear_tool_inputs=False,
                    exclude_tools=[],
                    placeholder="[cleared]",
                ),
            ],
        ),
    ],
)
```


### Provider tool search

Defer selected tools behind model providers' server-side tool search, so the model discovers them on demand instead of receiving every tool schema up front. Provider tool search is useful for:

- Reducing context bloat when using many tools.
- Improving tool selection accuracy by surfacing only relevant tools.


> [!NOTE]
>
> Requires a model with server-side tool search support: Anthropic (Claude Sonnet 4+/Opus 4+/Haiku 4.5+) or OpenAI (gpt-5.5+). Other providers raise a `ValueError`.


**API reference:** `ProviderToolSearchMiddleware`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ProviderToolSearchMiddleware

agent = create_agent(
    model="anthropic:claude-opus-4-8",
    tools=[get_weather, lookup_order],
    middleware=[
        ProviderToolSearchMiddleware(searchable_tools=["lookup_order"]),
    ],
)
```

### Configuration options

    Tools to defer behind the provider's tool search, given by name or instance. Deferred tools are withheld from the model until its search surfaces them. Tools constructed with `extras={"defer_loading": True}` are deferred regardless of this option; if `searchable_tools` is omitted, only those pre-marked tools are deferred.

### Full example

The middleware opts-in all tools included in `searchable_tools` for deferral and search. A tool can also opt into deferral at construction time by setting `extras={"defer_loading": True}`.

```python
from langchain.agents import create_agent
from langchain.agents.middleware import ProviderToolSearchMiddleware
from langchain.tools import tool

# Marked `defer_loading` at construction, so it's deferred on its own —
# no need to list it in `searchable_tools`.
@tool(extras={"defer_loading": True})
def send_email(to: str) -> str:
    """Send an email."""
    return "sent"

agent = create_agent(
    model="anthropic:claude-opus-4-8",
    tools=[send_email],
    middleware=[ProviderToolSearchMiddleware()],
)
```


### Shell tool

Expose a persistent shell session to agents for command execution. Shell tool middleware is useful for the following:

- Agents that need to execute system commands
- Development and deployment automation tasks
- Testing and validation workflows
- File system operations and script execution


> [!WARNING]
>
> **Security consideration**: Use appropriate execution policies (`HostExecutionPolicy`, `DockerExecutionPolicy`, or `CodexSandboxExecutionPolicy`) to match your deployment's security requirements.


> [!NOTE]
>
> **Limitation**: Persistent shell sessions do not currently work with interrupts (human-in-the-loop). We anticipate adding support for this in the future.


**API reference:** `ShellToolMiddleware`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import (
    ShellToolMiddleware,
    HostExecutionPolicy,
)

agent = create_agent(
    model="gpt-5.5",
    tools=[search_tool],
    middleware=[
        ShellToolMiddleware(
            workspace_root="/workspace",
            execution_policy=HostExecutionPolicy(),
        ),
    ],
)
```

### Configuration options

    Base directory for the shell session. If omitted, a temporary directory is created when the agent starts and removed when it ends.

    Optional commands executed sequentially after the session starts

    Optional commands executed before the session shuts down

    Execution policy controlling timeouts, output limits, and resource configuration. Options:

    - `HostExecutionPolicy` - Full host access (default); best for trusted environments where the agent already runs inside a container or VM
    - `DockerExecutionPolicy` - Launches a separate Docker container for each agent run, providing harder isolation
    - `CodexSandboxExecutionPolicy` - Reuses the Codex CLI sandbox for additional syscall/filesystem restrictions

    Optional redaction rules to sanitize command output before returning it to the model.
    

> [!WARNING]
>
> Redaction rules are applied post execution and do not prevent exfiltration of secrets or sensitive data when using `HostExecutionPolicy`.


    Optional override for the registered shell tool description

    Optional shell executable (string) or argument sequence used to launch the persistent session. Defaults to `/bin/bash`.

    Optional environment variables to supply to the shell session. Values are coerced to strings before command execution.

### Full example

The middleware provides a single persistent shell session that agents can use to execute commands sequentially.

**Execution policies:**
- `HostExecutionPolicy` (default) - Native execution with full host access
- `DockerExecutionPolicy` - Isolated Docker container execution
- `CodexSandboxExecutionPolicy` - Sandboxed execution via Codex CLI

```python
from langchain.agents import create_agent
from langchain.agents.middleware import (
    ShellToolMiddleware,
    HostExecutionPolicy,
    DockerExecutionPolicy,
    RedactionRule,
)

# Basic shell tool with host execution
agent = create_agent(
    model="gpt-5.5",
    tools=[search_tool],
    middleware=[
        ShellToolMiddleware(
            workspace_root="/workspace",
            execution_policy=HostExecutionPolicy(),
        ),
    ],
)

# Docker isolation with startup commands
agent_docker = create_agent(
    model="gpt-5.5",
    tools=[],
    middleware=[
        ShellToolMiddleware(
            workspace_root="/workspace",
            startup_commands=["pip install requests", "export PYTHONPATH=/workspace"],
            execution_policy=DockerExecutionPolicy(
                image="python:3.11-slim",
                command_timeout=60.0,
            ),
        ),
    ],
)

# With output redaction (applied post execution)
agent_redacted = create_agent(
    model="gpt-5.5",
    tools=[],
    middleware=[
        ShellToolMiddleware(
            workspace_root="/workspace",
            redaction_rules=[
                RedactionRule(pii_type="api_key", detector=r"sk-[a-zA-Z0-9]{32}"),
            ],
        ),
    ],
)
```

### File search

Provide Glob and Grep search tools over a filesystem. File search middleware is useful for the following:

- Code exploration and analysis
- Finding files by name patterns
- Searching code content with regex
- Large codebases where file discovery is needed

**API reference:** `FilesystemFileSearchMiddleware`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import FilesystemFileSearchMiddleware

agent = create_agent(
    model="gpt-5.5",
    tools=[],
    middleware=[
        FilesystemFileSearchMiddleware(
            root_path="/workspace",
            use_ripgrep=True,
        ),
    ],
)
```

### Configuration options

    Root directory to search. All file operations are relative to this path.

    Whether to use ripgrep for search. Falls back to Python regex if ripgrep is unavailable.

    Maximum file size to search in MB. Files larger than this are skipped.

### Full example

The middleware adds two search tools to agents:

**Glob tool** - Fast file pattern matching:
- Supports patterns like `**/*.py`, `src/**/*.ts`
- Returns matching file paths sorted by modification time

**Grep tool** - Content search with regex:
- Full regex syntax support
- Filter by file patterns with `include` parameter
- Three output modes: `files_with_matches`, `content`, `count`

```python
from langchain.agents import create_agent
from langchain.agents.middleware import FilesystemFileSearchMiddleware
from langchain.messages import HumanMessage

agent = create_agent(
    model="gpt-5.5",
    tools=[],
    middleware=[
        FilesystemFileSearchMiddleware(
            root_path="/workspace",
            use_ripgrep=True,
            max_file_size_mb=10,
        ),
    ],
)

# Agent can now use glob_search and grep_search tools
result = agent.invoke({
    "messages": [HumanMessage("Find all Python files containing 'async def'")]
})

# The agent will use:
# 1. glob_search(pattern="**/*.py") to find Python files
# 2. grep_search(pattern="async def", include="*.py") to find async functions
```


### Filesystem middleware

Context engineering is a main challenge in building effective agents. This is particularly difficult when using tools that return variable-length results (for example, `web_search` and RAG), as long tool results can quickly fill your context window.

`FilesystemMiddleware` from [Deep Agents](lc:oss/python/deepagents/overview) provides four tools for interacting with both short-term and long-term memory:

- `ls`: List the files in the filesystem
- `read_file`: Read an entire file or a certain number of lines from a file
- `write_file`: Write a new file to the filesystem
- `edit_file`: Edit an existing file in the filesystem

```python
from langchain.agents import create_agent
from deepagents.middleware.filesystem import FilesystemMiddleware

# FilesystemMiddleware is included by default in create_deep_agent
# You can customize it if building a custom agent
agent = create_agent(
    model="claude-sonnet-4-6",
    middleware=[
        FilesystemMiddleware(
            backend=None,  # Optional: custom backend (defaults to StateBackend)
            system_prompt="Write to the filesystem when...",  # Optional custom addition to the system prompt
            custom_tool_descriptions={
                "ls": "Use the ls tool when...",
                "read_file": "Use the read_file tool to..."
            },  # Optional: Custom descriptions for filesystem tools
            tools=["read_file", "ls", "glob", "grep"],  # Optional: Allowlist restricting which filesystem tools are exposed
        ),
    ],
)
```


#### Short-term vs. long-term filesystem

By default, these tools write to a local "filesystem" in your graph state. To enable persistent storage across threads, configure a `CompositeBackend` that routes specific paths (like `/memories/`) to a `StoreBackend`.

```python
from langchain.agents import create_agent
from deepagents.middleware import FilesystemMiddleware
from deepagents.backends import CompositeBackend, StateBackend, StoreBackend
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()

agent = create_agent(
    model="claude-sonnet-4-6",
    store=store,
    middleware=[
        FilesystemMiddleware(
            backend=CompositeBackend(
                default=StateBackend(),
                routes={"/memories/": StoreBackend()}
            ),
            custom_tool_descriptions={
                "ls": "Use the ls tool when...",
                "read_file": "Use the read_file tool to..."
            }  # Optional: Custom descriptions for filesystem tools
        ),
    ],
)
```


When you configure a `CompositeBackend` with a `StoreBackend` for `/memories/`, any files prefixed with **/memories/** are saved to persistent storage and survive across different threads. Files without this prefix remain in ephemeral state storage.

### Subagent

Handing off tasks to subagents isolates context, keeping the main (supervisor) agent's context window clean while still going deep on a task.

The subagents middleware from [Deep Agents](lc:oss/python/deepagents/overview) allows you to supply subagents through a `task` tool.

```python
from langchain.tools import tool
from langchain.agents import create_agent
from deepagents.middleware.subagents import SubAgentMiddleware

@tool
def get_weather(city: str) -> str:
    """Get the weather in a city."""
    return f"The weather in {city} is sunny."

agent = create_agent(
    model="claude-sonnet-4-6",
    middleware=[
        SubAgentMiddleware(
            default_model="claude-sonnet-4-6",
            default_tools=[],
            subagents=[
                {
                    "name": "weather",
                    "description": "This subagent can get weather in cities.",
                    "system_prompt": "Use the get_weather tool to get the weather in a city.",
                    "tools": [get_weather],
                    "model": "gpt-5.5",
                    "middleware": [],
                }
            ],
        )
    ],
)
```


A subagent is defined with a **name**, **description**, **system prompt**, and **tools**. You can also provide a subagent with a custom **model**, or with additional **middleware**. This can be particularly useful when you want to give the subagent an additional state key to share with the main agent.

For more complex use cases, you can also provide your own prebuilt LangGraph graph as a subagent.

```python
from langchain.agents import create_agent
from deepagents.middleware.subagents import SubAgentMiddleware
from deepagents import CompiledSubAgent
from langgraph.graph import StateGraph

# Create a custom LangGraph graph
def create_weather_graph():
    workflow = StateGraph(...)
    # Build your custom graph
    return workflow.compile()

weather_graph = create_weather_graph()

# Wrap it in a CompiledSubAgent
weather_subagent = CompiledSubAgent(
    name="weather",
    description="This subagent can get weather in cities.",
    runnable=weather_graph
)

agent = create_agent(
    model="claude-sonnet-4-6",
    middleware=[
        SubAgentMiddleware(
            default_model="claude-sonnet-4-6",
            default_tools=[],
            subagents=[weather_subagent],
        )
    ],
)
```


In addition to any user-defined subagents, the main agent has access to a `general-purpose` subagent at all times. This subagent has the same instructions as the main agent and all the tools it has access to. The primary purpose of the `general-purpose` subagent is context isolation—the main agent can delegate a complex task to this subagent and get a concise answer back without bloat from intermediate tool calls.

### Rubric grading


> [!NOTE]
>
> `RubricMiddleware` requires `deepagents>=0.6.5`. It is in [**beta**](lc:oss/python/versioning); the API may change in the future.


Some tasks have a clear definition of "done" that an agent cannot reliably hit on the first try. `RubricMiddleware` lets you declare _what done looks like_ as a rubric and have the agent self-evaluate and iterate until the rubric is satisfied or a maximum iteration cap is hit.

**API reference:** `RubricMiddleware`


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 }
]
```


For full configuration options, streaming events, and a complete code generation example, see [Grading rubrics](lc:oss/python/deepagents/rubric).

## Provider-specific middleware

These middleware are optimized for specific LLM providers. See each provider's documentation for full details and examples.


### [Anthropic](lc:oss/python/integrations/middleware/anthropic)
Prompt caching, bash tool, text editor, memory, and file search middleware for Claude models.

    ### [AWS](lc:oss/python/integrations/middleware/aws)
Prompt caching middleware for Amazon Bedrock models.

    ### [OpenAI](lc:oss/python/integrations/middleware/openai)
Content moderation middleware for OpenAI models.
