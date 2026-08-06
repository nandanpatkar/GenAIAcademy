This guide outlines the major changes between [LangChain v1](lc:oss/python/releases/langchain-v1) and previous versions.

## Simplified package

The `langchain` package namespace has been significantly reduced in v1 to focus on essential building blocks for agents. The streamlined package makes it easier to discover and use the core functionality.

### Namespace

| Module                  | What's available                               | Notes                             |
|-------------------------|------------------------------------------------|-----------------------------------|
| `langchain.agents`      | `create_agent`, `AgentState`                   | Core agent creation functionality |
| `langchain.messages`    | Message types, `content blocks`[ContentBlock], `trim_messages` | Re-exported from `langchain-core` |
| `langchain.tools`       | `@tool`, `BaseTool`, injection helpers          | Re-exported from `langchain-core` |
| `langchain.chat_models` | `init_chat_model`, `BaseChatModel`             | Unified model initialization      |
| `langchain.embeddings`  | `init_embeddings`, `Embeddings`                | Embedding models                  |

### `langchain-classic`

If you were using any of the following from the `langchain` package, you'll need to install [`langchain-classic`](https://pypi.org/project/langchain-classic/) and update your imports:

- Legacy chains (`LLMChain`, `ConversationChain`, etc.)
- Retrievers (e.g. `MultiQueryRetriever` or anything from the previous `langchain.retrievers` module)
- The indexing API
- The hub module (for managing prompts programmatically)
- Embeddings modules (e.g. `CacheBackedEmbeddings` and community embeddings)
- [`langchain-community`](https://pypi.org/project/langchain-community) re-exports
- Other deprecated functionality

    ```lc-tabs
    [
     {
      "label": "v1 (new)",
      "lang": "python",
      "code": "# Chains\nfrom langchain_classic.chains import LLMChain\n\n# Retrievers\nfrom langchain_classic.retrievers import ...\n\n# Indexing\nfrom langchain_classic.indexes import ...\n\n# Hub\nfrom langchain_classic import hub"
     },
     {
      "label": "v0 (old)",
      "lang": "python",
      "code": "# Chains\nfrom langchain_classic.chains import LLMChain\n\n# Retrievers\nfrom langchain.retrievers import ...\n\n# Indexing\nfrom langchain.indexes import ...\n\n# Hub\nfrom langchain import hub"
     }
    ]
    ```

Install with:

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install langchain-classic"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langchain-classic"
 }
]
```

---

## Migrate to `create_agent`

Prior to v1.0, we recommended using `langgraph.prebuilt.create_react_agent`[create_react_agent] to build agents. Now, we recommend you use `langchain.agents.create_agent`[create_agent] to build agents.

The table below outlines what functionality has changed from `create_react_agent` to `create_agent`:

| Section | TL;DR - What's changed |
|---------|--------------|
| [Import path](#import-path) | Package moved from `langgraph.prebuilt` to `langchain.agents` |
| [Prompts](#prompts) | Parameter renamed to `system_prompt`, dynamic prompts use middleware |
| [Pre-model hook](#pre-model-hook) | Replaced by middleware with `before_model` method |
| [Post-model hook](#post-model-hook) | Replaced by middleware with `after_model` method |
| [Custom state](#custom-state) | `TypedDict` only, can be defined via `state_schema` or middleware |
| [Model](#model) | Dynamic selection via middleware, pre-bound models not supported |
| [Tools](#tools) | Tool error handling moved to middleware with `wrap_tool_call` |
| [Structured output](#structured-output) | prompted output removed, use `ToolStrategy`/`ProviderStrategy` |
| [Streaming node name](#streaming-node-name-rename) | Node name changed from `"agent"` to `"model"` |
| [Runtime context](#runtime-context) | Dependency injection via `context` argument instead of `config["configurable"]` |
| [Namespace](#simplified-package) | Streamlined to focus on agent building blocks, legacy code moved to `langchain-classic` |

### Import path

The import path for the agent prebuilt has changed from `langgraph.prebuilt` to `langchain.agents`.
The name of the function has changed from `create_react_agent` to `create_agent`:

```python
from langgraph.prebuilt import create_react_agent # [!code --]
from langchain.agents import create_agent # [!code ++]
```

For more information, see [Agents](lc:oss/python/langchain/agents).

### Prompts

#### Static prompt rename

The `prompt` parameter has been renamed to `system_prompt`:

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=[check_weather],\n    system_prompt=\"You are a helpful assistant\"  # [!code highlight]\n)"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from langgraph.prebuilt import create_react_agent\n\nagent = create_react_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=[check_weather],\n    prompt=\"You are a helpful assistant\"  # [!code highlight]\n)"
 }
]
```

#### `SystemMessage` to string

If using `SystemMessage` objects in the system prompt, extract the string content:

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=[check_weather],\n    system_prompt=\"You are a helpful assistant\"  # [!code highlight]\n)"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from langchain.messages import SystemMessage\nfrom langgraph.prebuilt import create_react_agent\n\nagent = create_react_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=[check_weather],\n    prompt=SystemMessage(content=\"You are a helpful assistant\")  # [!code highlight]\n)"
 }
]
```

#### Dynamic prompts

Dynamic prompts are a core context engineering pattern—they adapt what you tell the model based on the current conversation state. To do this, use the `@dynamic_prompt` decorator:

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import dynamic_prompt, ModelRequest\nfrom langgraph.runtime import Runtime\n\n@dataclass\nclass Context:  # [!code highlight]\n    user_role: str = \"user\"\n\n@dynamic_prompt  # [!code highlight]\ndef dynamic_prompt(request: ModelRequest) -> str:  # [!code highlight]\n    user_role = request.runtime.context.user_role\n    base_prompt = \"You are a helpful assistant.\"\n\n    if user_role == \"expert\":\n        prompt = (\n            f\"{base_prompt} Provide detailed technical responses.\"\n        )\n    elif user_role == \"beginner\":\n        prompt = (\n            f\"{base_prompt} Explain concepts simply and avoid jargon.\"\n        )\n    else:\n        prompt = base_prompt\n\n    return prompt  # [!code highlight]\n\nagent = create_agent(\n    model=\"gpt-5.5\",\n    tools=tools,\n    middleware=[dynamic_prompt],  # [!code highlight]\n    context_schema=Context\n)\n\n# Use with context\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Explain async programming\"}]},\n    context=Context(user_role=\"expert\")\n)"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langgraph.prebuilt import create_react_agent, AgentState\nfrom langgraph.runtime import get_runtime\n\n@dataclass\nclass Context:\n    user_role: str\n\ndef dynamic_prompt(state: AgentState) -> str:\n    runtime = get_runtime(Context)  # [!code highlight]\n    user_role = runtime.context.user_role\n    base_prompt = \"You are a helpful assistant.\"\n\n    if user_role == \"expert\":\n        return f\"{base_prompt} Provide detailed technical responses.\"\n    elif user_role == \"beginner\":\n        return f\"{base_prompt} Explain concepts simply and avoid jargon.\"\n    return base_prompt\n\nagent = create_react_agent(\n    model=\"gpt-5.5\",\n    tools=tools,\n    prompt=dynamic_prompt,\n    context_schema=Context\n)\n\n# Use with context\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Explain async programming\"}]},\n    context=Context(user_role=\"expert\")\n)"
 }
]
```

### Pre-model hook

Pre-model hooks are now implemented as middleware with the `before_model` method.
This new pattern is more extensible--you can define multiple middlewares to run before the model is called,
reusing common patterns across different agents.

Common use cases include:
* Summarizing conversation history
* Trimming messages
* Input guardrails, like PII redaction

v1 now has summarization middleware as a built in option:

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import SummarizationMiddleware\n\nagent = create_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=tools,\n    middleware=[\n        SummarizationMiddleware(  # [!code highlight]\n            model=\"claude-sonnet-4-6\",  # [!code highlight]\n            trigger={\"tokens\": 1000}  # [!code highlight]\n        )  # [!code highlight]\n    ]  # [!code highlight]\n)"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from langgraph.prebuilt import create_react_agent, AgentState\n\ndef custom_summarization_function(state: AgentState):\n    \"\"\"Custom logic for message summarization.\"\"\"\n    ...\n\nagent = create_react_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=tools,\n    pre_model_hook=custom_summarization_function\n)"
 }
]
```

### Post-model hook

Post-model hooks are now implemented as middleware with the `after_model` method.
This new pattern is more extensible--you can define multiple middlewares to run after the model is called,
reusing common patterns across different agents.

Common use cases include:
* [Human in the loop](lc:oss/python/langchain/human-in-the-loop)
* Output guardrails

v1 has a built in middleware for human in the loop approval for tool calls:

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import HumanInTheLoopMiddleware\n\nagent = create_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=[read_email, send_email],\n    middleware=[\n        HumanInTheLoopMiddleware(\n            interrupt_on={\n                \"send_email\": {\n                    \"description\": \"Please review this email before sending\",\n                    \"allowed_decisions\": [\"approve\", \"reject\"]\n                }\n            }\n        )\n    ]\n)"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from langgraph.prebuilt import create_react_agent\nfrom langgraph.prebuilt import AgentState\n\ndef custom_human_in_the_loop_hook(state: AgentState):\n    \"\"\"Custom logic for human in the loop approval.\"\"\"\n    ...\n\nagent = create_react_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=[read_email, send_email],\n    post_model_hook=custom_human_in_the_loop_hook\n)"
 }
]
```

### Custom state

Custom state extends the default agent state with additional fields. You can define custom state in two ways:

1. **Via `state_schema` on `create_agent`** - Best for state used in tools
2. **Via middleware** - Best for state managed by specific middleware hooks and tools attached to said middleware


> [!NOTE]
>
> Defining custom state via middleware is preferred over defining it via `state_schema` on `create_agent` because it allows you to keep state extensions conceptually scoped to the relevant middleware and tools.
>
> `state_schema` is still supported for backwards compatibility on `create_agent`.


#### Defining state via `state_schema`

Use the `state_schema` parameter when your custom state needs to be accessed by tools:

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from langchain.tools import tool, ToolRuntime\nfrom langchain.agents import create_agent, AgentState  # [!code highlight]\n\n# Define custom state extending AgentState\nclass CustomState(AgentState):\n    user_name: str\n\n@tool  # [!code highlight]\ndef greet(\n    runtime: ToolRuntime[None, CustomState]\n) -> str:\n    \"\"\"Use this to greet the user by name.\"\"\"\n    user_name = runtime.state.get(\"user_name\", \"Unknown\")  # [!code highlight]\n    return f\"Hello {user_name}!\"\n\nagent = create_agent(  # [!code highlight]\n    model=\"claude-sonnet-4-6\",\n    tools=[greet],\n    state_schema=CustomState  # [!code highlight]\n)"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from typing import Annotated\nfrom langgraph.prebuilt import InjectedState, create_react_agent\nfrom langgraph.prebuilt.chat_agent_executor import AgentState\n\nclass CustomState(AgentState):\n    user_name: str\n\ndef greet(\n    state: Annotated[CustomState, InjectedState]\n) -> str:\n    \"\"\"Use this to greet the user by name.\"\"\"\n    user_name = state[\"user_name\"]\n    return f\"Hello {user_name}!\"\n\nagent = create_react_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=[greet],\n    state_schema=CustomState\n)"
 }
]
```

#### Defining state via middleware

Middleware can also define custom state by setting the `state_schema` attribute.
This helps to keep state extensions conceptually scoped to the relevant middleware and tools.

```python
from langchain.agents.middleware import AgentState, AgentMiddleware
from typing_extensions import NotRequired
from typing import Any

class CustomState(AgentState):
    model_call_count: NotRequired[int]

class CallCounterMiddleware(AgentMiddleware[CustomState]):
    state_schema = CustomState  # [!code highlight]

    def before_model(self, state: CustomState, runtime) -> dict[str, Any] | None:
        count = state.get("model_call_count", 0)
        if count > 10:
            return {"jump_to": "end"}
        return None

    def after_model(self, state: CustomState, runtime) -> dict[str, Any] | None:
        return {"model_call_count": state.get("model_call_count", 0) + 1}

agent = create_agent(
    model="claude-sonnet-4-6",
    tools=[...],
    middleware=[CallCounterMiddleware()]  # [!code highlight]
)
```

See the [middleware documentation](lc:oss/python/langchain/middleware/overview#custom-state-schema) for more details on defining custom state via middleware.

#### State type restrictions

`create_agent` only supports `TypedDict` for state schemas. Pydantic models and dataclasses are no longer supported.

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from langchain.agents import AgentState, create_agent\n\n# AgentState is a TypedDict\nclass CustomAgentState(AgentState):  # [!code highlight]\n    user_id: str\n\nagent = create_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=tools,\n    state_schema=CustomAgentState  # [!code highlight]\n)"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from typing_extensions import Annotated\n\nfrom pydantic import BaseModel\nfrom langgraph.graph import StateGraph\nfrom langgraph.graph.messages import add_messages\nfrom langchain.messages import AnyMessage\n\nclass AgentState(BaseModel):  # [!code highlight]\n    messages: Annotated[list[AnyMessage], add_messages]\n    user_id: str\n\nagent = create_react_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=tools,\n    state_schema=AgentState\n)"
 }
]
```

Simply inherit from `langchain.agents.AgentState` instead of `BaseModel` or decorating with `dataclass`.
If you need to perform validation, handle it in middleware hooks instead.

### Model

Dynamic model selection allows you to choose different models based on runtime context (e.g., task complexity, cost constraints, or user preferences). `create_react_agent` released in v0.6 of [`langgraph-prebuilt`](https://pypi.org/project/langgraph-prebuilt) supported dynamic model and tool selection via a callable passed to the `model` parameter.

This functionality has been ported to the middleware interface in v1.

#### Dynamic model selection

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import (\n    AgentMiddleware, ModelRequest\n)\nfrom langchain.agents.middleware.types import ModelResponse\nfrom langchain_openai import ChatOpenAI\nfrom typing import Callable\n\nbasic_model = ChatOpenAI(model=\"gpt-5-nano\")\nadvanced_model = ChatOpenAI(model=\"gpt-5.5\")\n\nclass DynamicModelMiddleware(AgentMiddleware):\n\n    def wrap_model_call(self, request: ModelRequest, handler: Callable[[ModelRequest], ModelResponse]) -> ModelResponse:\n        if len(request.state.messages) > self.messages_threshold:\n            model = advanced_model\n        else:\n            model = basic_model\n        return handler(request.override(model=model))\n\n    def __init__(self, messages_threshold: int) -> None:\n        self.messages_threshold = messages_threshold\n\nagent = create_agent(\n    model=basic_model,\n    tools=tools,\n    middleware=[DynamicModelMiddleware(messages_threshold=10)]\n)"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from langgraph.prebuilt import create_react_agent, AgentState\nfrom langchain_openai import ChatOpenAI\n\nbasic_model = ChatOpenAI(model=\"gpt-5-nano\")\nadvanced_model = ChatOpenAI(model=\"gpt-5.5\")\n\ndef select_model(state: AgentState) -> BaseChatModel:\n    # use a more advanced model for longer conversations\n    if len(state.messages) > 10:\n        return advanced_model\n    return basic_model\n\nagent = create_react_agent(\n    model=select_model,\n    tools=tools,\n)"
 }
]
```

#### Pre-bound models

To better support structured output, `create_agent` no longer accepts pre-bound models with tools or configuration:

```python
# No longer supported
model_with_tools = ChatOpenAI().bind_tools([some_tool])
agent = create_agent(model_with_tools, tools=[])

# Use instead
agent = create_agent("gpt-5.4-mini", tools=[some_tool])
```


> [!NOTE]
>
> Dynamic model functions can return pre-bound models if structured output is *not* used.


### Tools

The `tools`[create_agent(tools)] argument to `create_agent` accepts a list of:

* LangChain `BaseTool` instances (functions decorated with `@tool`)
* Callable objects (functions) with proper type hints and a docstring
* `dict` that represents a built-in provider tools

The argument will no longer accept `ToolNode` instances.

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=[check_weather, search_web]\n)"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from langgraph.prebuilt import create_react_agent, ToolNode\n\nagent = create_react_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=ToolNode([check_weather, search_web]) # [!code highlight]\n)"
 }
]
```

#### Handling tool errors

You can now configure the handling of tool errors with middleware implementing the `wrap_tool_call` method.

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import wrap_tool_call\nfrom langchain.messages import ToolMessage\n\n@wrap_tool_call\ndef handle_tool_errors(request, handler):\n    \"\"\"Handle tool execution errors with custom messages.\"\"\"\n    try:\n        return handler(request)\n    except Exception as e:\n        # Only handle errors that occur during tool execution due to invalid inputs\n        # that pass schema validation but fail at runtime (e.g., invalid SQL syntax).\n        # Do NOT handle:\n        # - Network failures (use tool retry middleware instead)\n        # - Incorrect tool implementation errors (should bubble up)\n        # - Schema mismatch errors (already auto-handled by the framework)\n        #\n        # Return a custom error message to the model\n        return ToolMessage(\n            content=f\"Tool error: Please check your input and try again. ({str(e)})\",\n            tool_call_id=request.tool_call[\"id\"]\n        )\n\nagent = create_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=[check_weather, search_web],\n    middleware=[handle_tool_errors]\n)"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from langgraph.prebuilt import create_react_agent, ToolNode\nfrom langchain.messages import ToolMessage\n\ndef handle_tool_error(error: Exception) -> str:\n    \"\"\"Custom error handler function.\"\"\"\n    return f\"Tool error: Please check your input and try again. ({str(error)})\"\n\nagent = create_react_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=ToolNode(\n        [check_weather, search_web],\n        handle_tool_errors=handle_tool_error  # [!code highlight]\n    )\n)"
 }
]
```

### Structured output

#### Node changes

Structured output used to be generated in a separate node from the main agent. This is no longer the case.
We generate structured output in the main loop, reducing cost and latency.

#### Tool and provider strategies

In v1, there are two new structured output strategies:

* `ToolStrategy` uses artificial tool calling to generate structured output
* `ProviderStrategy` uses provider-native structured output generation

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.structured_output import ToolStrategy, ProviderStrategy\nfrom pydantic import BaseModel\n\nclass OutputSchema(BaseModel):\n    summary: str\n    sentiment: str\n\n# Using ToolStrategy\nagent = create_agent(\n    model=\"gpt-5.4-mini\",\n    tools=tools,\n    # explicitly using tool strategy\n    response_format=ToolStrategy(OutputSchema)  # [!code highlight]\n)"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from langgraph.prebuilt import create_react_agent\nfrom pydantic import BaseModel\n\nclass OutputSchema(BaseModel):\n    summary: str\n    sentiment: str\n\nagent = create_react_agent(\n    model=\"gpt-5.4-mini\",\n    tools=tools,\n    # using tool strategy by default with no option for provider strategy\n    response_format=OutputSchema  # [!code highlight]\n)\n\n# OR\n\nagent = create_react_agent(\n    model=\"gpt-5.4-mini\",\n    tools=tools,\n    # using a custom prompt to instruct the model to generate the output schema\n    response_format=(\"please generate ...\", OutputSchema)  # [!code highlight]\n)"
 }
]
```

#### Prompted output removed

**Prompted output** is no longer supported via the `response_format` argument. Compared to strategies
like artificial tool calling and provider native structured output, prompted output has not proven to be particularly reliable.

### Streaming node name rename

When streaming events from agents, the node name has changed from `"agent"` to `"model"` to better reflect the node's purpose.

{/* TODO: add diagrams */}

### Runtime context

When you invoke an agent, it's often the case that you want to pass two types of data:
* Dynamic state that changes throughout the conversation (e.g., message history)
* Static context that doesn't change during the conversation (e.g., user metadata)

In v1, static context is supported by setting the `context` parameter to `invoke` and `stream`.

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\n\n@dataclass\nclass Context:\n    user_id: str\n    session_id: str\n\nagent = create_agent(\n    model=model,\n    tools=tools,\n    context_schema=Context  # [!code highlight]\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}]},\n    context=Context(user_id=\"123\", session_id=\"abc\")  # [!code highlight]\n)"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from langgraph.prebuilt import create_react_agent\n\nagent = create_react_agent(model, tools)\n\n# Pass context via configurable\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}]},\n    config={  # [!code highlight]\n        \"configurable\": {  # [!code highlight]\n            \"user_id\": \"123\",  # [!code highlight]\n            \"session_id\": \"abc\"  # [!code highlight]\n        }  # [!code highlight]\n    }  # [!code highlight]\n)"
 }
]
```


> [!NOTE]
>
> The old `config["configurable"]` pattern still works for backward compatibility, but using the new `context` parameter is recommended for new applications or applications migrating to v1.


---

## Standard content

In v1, messages gain provider-agnostic standard content blocks. Access them via `message.content_blocks`[content_blocks] for a consistent, typed view across providers. The existing `message.content`[BaseMessage(content_blocks)] field remains unchanged for strings or provider-native structures.

### What changed

- New `content_blocks`[BaseMessage(content_blocks)] property on messages for normalized content
- Standardized block shapes, documented in [Messages](lc:oss/python/langchain/messages#standard-content-blocks)
- Optional serialization of standard blocks into `content` via `LC_OUTPUT_VERSION=v1` or `output_version="v1"`

### Read standardized content

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\"gpt-5-nano\")\nresponse = model.invoke(\"Explain AI\")\n\nfor block in response.content_blocks:\n    if block[\"type\"] == \"reasoning\":\n        print(block.get(\"reasoning\"))\n    elif block[\"type\"] == \"text\":\n        print(block.get(\"text\"))"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "# Provider-native formats vary; you needed per-provider handling\nresponse = model.invoke(\"Explain AI\")\nfor item in response.content:\n    if item.get(\"type\") == \"reasoning\":\n        ...  # OpenAI-style reasoning\n    elif item.get(\"type\") == \"thinking\":\n        ...  # Anthropic-style thinking\n    elif item.get(\"type\") == \"text\":\n        ...  # Text"
 }
]
```

### Create multimodal messages

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from langchain.messages import HumanMessage\n\nmessage = HumanMessage(content_blocks=[\n    {\"type\": \"text\", \"text\": \"Describe this image.\"},\n    {\"type\": \"image\", \"url\": \"https://example.com/image.jpg\"},\n])\nres = model.invoke([message])"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from langchain.messages import HumanMessage\n\nmessage = HumanMessage(content=[\n    # Provider-native structure\n    {\"type\": \"text\", \"text\": \"Describe this image.\"},\n    {\"type\": \"image_url\", \"image_url\": {\"url\": \"https://example.com/image.jpg\"}},\n])\nres = model.invoke([message])"
 }
]
```

### Example block shapes

```python
# Text block
text_block = {
    "type": "text",
    "text": "Hello world",
}

# Image block
image_block = {
    "type": "image",
    "url": "https://example.com/image.png",
    "mime_type": "image/png",
}
```

See the content blocks [reference](lc:oss/python/langchain/messages#content-block-reference) for more details.

### Serialize standard content

Standard content blocks are **not serialized** into the `content` attribute by default. If you need to access standard content blocks in the `content` attribute (e.g., when sending messages to a client), you can opt-in to serializing them into `content`.

```lc-tabs
[
 {
  "label": "Environment variable",
  "lang": "bash",
  "code": "export LC_OUTPUT_VERSION=v1"
 },
 {
  "label": "Initialization parameter",
  "lang": "python",
  "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\n    \"gpt-5-nano\",\n    output_version=\"v1\",\n)"
 }
]
```


> [!NOTE]
>
> Learn more: [Messages](lc:oss/python/langchain/messages#message-content), [Standard content blocks](lc:oss/python/langchain/messages#standard-content-blocks), and [Multimodal](lc:oss/python/langchain/messages#multimodal).


---

## Simplified package

The `langchain` package namespace has been significantly reduced in v1 to focus on essential building blocks for agents. The streamlined package makes it easier to discover and use the core functionality.

### Namespace

| Module                  | What's available                               | Notes                             |
|-------------------------|------------------------------------------------|-----------------------------------|
| `langchain.agents`      | `create_agent`, `AgentState`                   | Core agent creation functionality |
| `langchain.messages`    | Message types, `content blocks`[ContentBlock], `trim_messages` | Re-exported from `langchain-core` |
| `langchain.tools`       | `@tool`, `BaseTool`, injection helpers          | Re-exported from `langchain-core` |
| `langchain.chat_models` | `init_chat_model`, `BaseChatModel`             | Unified model initialization      |
| `langchain.embeddings`  | `init_embeddings`, `Embeddings`                | Embedding models                  |

### `langchain-classic`

If you were using any of the following from the `langchain` package, you'll need to install [`langchain-classic`](https://pypi.org/project/langchain-classic/) and update your imports:

- Legacy chains (`LLMChain`, `ConversationChain`, etc.)
- Retrievers (e.g. `MultiQueryRetriever` or anything from the previous `langchain.retrievers` module)
- The indexing API
- The hub module (for managing prompts programmatically)
- Embeddings modules (e.g. `CacheBackedEmbeddings` and community embeddings)
- [`langchain-community`](https://pypi.org/project/langchain-community) re-exports
- Other deprecated functionality

    ```lc-tabs
    [
     {
      "label": "v1 (new)",
      "lang": "python",
      "code": "# Chains\nfrom langchain_classic.chains import LLMChain\n\n# Retrievers\nfrom langchain_classic.retrievers import ...\n\n# Indexing\nfrom langchain_classic.indexes import ...\n\n# Hub\nfrom langchain_classic import hub"
     },
     {
      "label": "v0 (old)",
      "lang": "python",
      "code": "# Chains\nfrom langchain_classic.chains import LLMChain\n\n# Retrievers\nfrom langchain.retrievers import ...\n\n# Indexing\nfrom langchain.indexes import ...\n\n# Hub\nfrom langchain import hub"
     }
    ]
    ```

**Installation**:
```bash
uv pip install langchain-classic
```

---

## Breaking changes

### Dropped Python 3.9 support

All LangChain packages now require **Python 3.10 or higher**. Python 3.9 reaches [end of life](https://devguide.python.org/versions/) in October 2025.

### Updated return type for chat models

The return type signature for chat model invocation has been fixed from `BaseMessage` to `AIMessage`. Custom chat models implementing `bind_tools`[BaseChatModel.bind_tools] should update their return signature:

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "def bind_tools(\n        ...\n    ) -> Runnable[LanguageModelInput, AIMessage]:"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "def bind_tools(\n        ...\n    ) -> Runnable[LanguageModelInput, BaseMessage]:"
 }
]
```

### Default message format for OpenAI responses API

When interacting with the Responses API, `langchain-openai` now defaults to storing response items in message `content`. To restore previous behavior, set the `LC_OUTPUT_VERSION` environment variable to `v0`, or specify `output_version="v0"` when instantiating `ChatOpenAI`.

```python
# Enforce previous behavior with output_version flag
model = ChatOpenAI(model="gpt-5.4-mini", output_version="v0")
```

### Default `max_tokens` in `langchain-anthropic`

The `max_tokens` parameter in `langchain-anthropic` now defaults to higher values based on the model chosen, rather than the previous default of `1024`. If you relied on the old default, explicitly set `max_tokens=1024`.

### Legacy code moved to `langchain-classic`

Existing functionality outside the focus of standard interfaces and agents has been moved to the [`langchain-classic`](https://pypi.org/project/langchain-classic) package. See the [Simplified namespace](#simplified-package) section for details on what's available in the core `langchain` package and what moved to `langchain-classic`.

### Removal of deprecated APIs

Methods, functions, and other objects that were already deprecated and slated for removal in 1.0 have been deleted. Check the [deprecation notices](https://python.langchain.com/docs/versions/migrating_chains) from previous versions for replacement APIs.

### Text property

Use of the `.text()` method on message objects should drop the parentheses, as it is now a property:

```python
# Property access
text = response.text

# Deprecated method call
text = response.text()
```

Existing usage patterns (i.e., `.text()`) will continue to function but now emit a warning. The method form will be removed in v2.

### `example` parameter removed from `AIMessage`

The `example` parameter has been removed from `AIMessage` objects. We recommend migrating to use `additional_kwargs` for passing extra metadata as needed.

## Minor changes

- `AIMessageChunk` objects now include a `chunk_position` attribute with position `'last'` to indicate the final chunk in a stream. This allows for clearer handling of streamed messages. If the chunk is not the final one, `chunk_position` will be `None`.
- `LanguageModelOutputVar` is now typed to `AIMessage` instead of `BaseMessage`.
- The logic for merging message chunks (`AIMessageChunk.add`) has been updated with more sophisticated selection handling for the final id for the merged chunk. It prioritizes provider-assigned IDs over LangChain-generated IDs.
- We now open files with `utf-8` encoding by default.
- Standard tests now use multimodal content blocks.

## Archived docs

Old docs are archived for reference:

- [v0.3 docs content](https://github.com/langchain-ai/langchain/tree/v0.3/docs/docs)
- [v0.3 API reference](https://reference.langchain.com/v0.3/python/)
