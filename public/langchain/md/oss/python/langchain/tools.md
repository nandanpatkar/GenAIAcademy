Tools extend what [agents](lc:oss/python/langchain/agents) can do—letting them fetch real-time data, execute code, query external databases, and take actions in the world.

Under the hood, tools are callable functions with well-defined inputs and outputs that get passed to a [chat model](lc:oss/python/langchain/models). The model decides when to invoke a tool based on the conversation context, and what input arguments to provide.


> [!TIP]
>
> For details on how models handle tool calls, see [Tool calling](lc:oss/python/langchain/models#tool-calling). Trace tool calls and debug errors with [LangSmith](https://smith.langchain.com). Follow the [tracing quickstart](lc:langsmith/trace-with-langchain) to get set up.
>
> We recommend you also set up [LangSmith Engine](lc:langsmith/engine) which monitors your traces, detects issues, and proposes fixes.


## Create tools

### Basic tool definition

The simplest way to create a tool is with the `@tool` decorator. By default, the function's docstring becomes the tool's description that helps the model understand when to use it:

```python
from langchain.tools import tool

@tool
def search_database(query: str, limit: int = 10) -> str:
    """Search the customer database for records matching the query.

    Args:
        query: Search terms to look for
        limit: Maximum number of results to return
    """
    return f"Found {limit} results for '{query}'"
```

Type hints are **required** as they define the tool's input schema. The docstring should be informative and concise to help the model understand the tool's purpose.


> [!NOTE]
>
> **Server-side tool use:** Some chat models feature built-in tools (web search, code interpreters) that are executed server-side. See [Server-side tool use](#server-side-tool-use) for details.


> [!WARNING]
>
> Prefer `snake_case` for tool names (e.g., `web_search` instead of `Web Search`). Some model providers have issues with or reject names containing spaces or special characters with errors. Sticking to alphanumeric characters, underscores, and hyphens helps to improve compatibility across providers.


### Customize tool properties

#### Custom tool name

By default, the tool name comes from the function name. Override it when you need something more descriptive:

```python
@tool("web_search")  # Custom name
def search(query: str) -> str:
    """Search the web for information."""
    return f"Results for: {query}"

print(search.name)  # web_search
```

#### Custom tool description

Override the auto-generated tool description for clearer model guidance:

```python
@tool("calculator", description="Performs arithmetic calculations. Use this for any math problems.")
def calc(expression: str) -> str:
    """Evaluate mathematical expressions."""
    return str(eval(expression))
```

### Advanced schema definition

Define complex inputs with Pydantic models or JSON schemas:

    ```lc-tabs
    [
     {
      "label": "Pydantic model",
      "lang": "python",
      "code": "from pydantic import BaseModel, Field\nfrom typing import Literal\n\nclass WeatherInput(BaseModel):\n    \"\"\"Input for weather queries.\"\"\"\n    location: str = Field(description=\"City name or coordinates\")\n    units: Literal[\"celsius\", \"fahrenheit\"] = Field(\n        default=\"celsius\",\n        description=\"Temperature unit preference\"\n    )\n    include_forecast: bool = Field(\n        default=False,\n        description=\"Include 5-day forecast\"\n    )\n\n@tool(args_schema=WeatherInput)\ndef get_weather(location: str, units: str = \"celsius\", include_forecast: bool = False) -> str:\n    \"\"\"Get current weather and optional forecast.\"\"\"\n    temp = 22 if units == \"celsius\" else 72\n    result = f\"Current weather in {location}: {temp} degrees {units[0].upper()}\"\n    if include_forecast:\n        result += \"\\nNext 5 days: Sunny\"\n    return result"
     },
     {
      "label": "JSON Schema",
      "lang": "python",
      "code": "weather_schema = {\n    \"type\": \"object\",\n    \"properties\": {\n        \"location\": {\"type\": \"string\"},\n        \"units\": {\"type\": \"string\"},\n        \"include_forecast\": {\"type\": \"boolean\"}\n    },\n    \"required\": [\"location\", \"units\", \"include_forecast\"]\n}\n\n@tool(args_schema=weather_schema)\ndef get_weather(location: str, units: str = \"celsius\", include_forecast: bool = False) -> str:\n    \"\"\"Get current weather and optional forecast.\"\"\"\n    temp = 22 if units == \"celsius\" else 72\n    result = f\"Current weather in {location}: {temp} degrees {units[0].upper()}\"\n    if include_forecast:\n        result += \"\\nNext 5 days: Sunny\"\n    return result"
     }
    ]
    ```

### Reserved argument names

The following parameter names are reserved and cannot be used as tool arguments. Using these names will cause runtime errors.

| Parameter name | Purpose |
|----------------|---------|
| `config` | Reserved for passing `RunnableConfig` to tools internally |
| `runtime` | Reserved for `ToolRuntime` parameter (accessing state, context, store) |

To access runtime information, use the `ToolRuntime` parameter instead of naming your own arguments `config` or `runtime`.

If you use `InjectedState`, `InjectedStore`, `get_runtime()`, or `InjectedToolCallId`, see [Migrate from older injection patterns](#migrate-from-older-injection-patterns).

## Access context

Tools are most powerful when they can access runtime information like conversation history, user data, and persistent memory. This section covers how to access and update this information from within your tools.

Tools can access runtime information through the `ToolRuntime` parameter, which provides:

| Component | Description | Use case |
|-----------|-------------|----------|
| **State** | Short-term memory - mutable data that exists for the current conversation (messages, counters, custom fields) | Access conversation history, track tool call counts |
| **Context** | Immutable configuration passed at invocation time (user IDs, session info) | Personalize responses based on user identity |
| **Store** | Long-term memory - persistent data that survives across conversations | Save user preferences, maintain knowledge base |
| **Stream Writer** | Emit real-time updates during tool execution | Show progress for long-running operations |
| **Execution Info** | Identity and retry information for the current execution (thread ID, run ID, attempt number) | Access thread/run IDs, adjust behavior based on retry state |
| **Server Info** | Server-specific metadata when running on LangGraph Server (assistant ID, graph ID, authenticated user) | Access assistant ID, graph ID, or authenticated user info |
| **Config** | `RunnableConfig` for the execution | Access callbacks, tags, and metadata |
| **Tool Call ID** | Unique identifier for the current tool invocation | Correlate tool calls for logs and model invocations |

```mermaid
graph LR
    %% Runtime Context
    subgraph "🔧 Tool Runtime Context"
        A[Tool Call] --> B[ToolRuntime]
        B --> C[State Access]
        B --> D[Context Access]
        B --> E[Store Access]
        B --> F[Stream Writer]
    end

    %% Available Resources
    subgraph "📊 Available Resources"
        C --> G[Messages]
        C --> H[Custom State]
        D --> I[User ID]
        D --> J[Session Info]
        E --> K[Long-term Memory]
        E --> L[User Preferences]
    end

    %% Tool Capabilities
    subgraph "⚡ Enhanced Tool Capabilities"
        M[Context-Aware Tools]
        N[Stateful Tools]
        O[Memory-Enabled Tools]
        P[Streaming Tools]
    end

    %% Connections
    G --> M
    H --> N
    I --> M
    J --> M
    K --> O
    L --> O
    F --> P

    classDef trigger fill:#F6FFDB,stroke:#6E8900,stroke-width:2px,color:#2E3900
    classDef process fill:#E5F4FF,stroke:#006DDD,stroke-width:2px,color:#030710
    classDef output fill:#EBD0F0,stroke:#885270,stroke-width:2px,color:#441E33
    classDef neutral fill:#F2FAFF,stroke:#40668D,stroke-width:2px,color:#2F4B68

    class A trigger
    class B,C,D,E,F process
    class G,H,I,J,K,L neutral
    class M,N,O,P output
```

### Short-term memory (State)

State represents short-term memory that exists for the duration of a conversation. It includes the message history and any custom fields you define in your [graph state](lc:oss/python/langgraph/graph-api#state).


> [!NOTE]
>
> Add `runtime: ToolRuntime` to your tool signature to access state. This parameter is automatically injected and hidden from the LLM - it won't appear in the tool's schema.


#### Access state

Tools can access the current conversation state using `runtime.state`:

```python
from langchain.tools import tool, ToolRuntime
from langchain.messages import HumanMessage

@tool
def get_last_user_message(runtime: ToolRuntime) -> str:
    """Get the most recent message from the user."""
    messages = runtime.state["messages"]

    # Find the last human message
    for message in reversed(messages):
        if isinstance(message, HumanMessage):
            return message.content

    return "No user messages found"

# Access custom state fields
@tool
def get_user_preference(
    pref_name: str,
    runtime: ToolRuntime
) -> str:
    """Get a user preference value."""
    preferences = runtime.state.get("user_preferences", {})
    return preferences.get(pref_name, "Not set")
```


> [!WARNING]
>
> The `runtime` parameter is hidden from the model. For the example above, the model only sees `pref_name` in the tool schema.


#### Update state

Use `Command` to update the agent's state. This is useful for tools that need to update custom state fields.
Include a `ToolMessage` in the update so the model can see the result of the tool call:


```python
from langchain.agents import AgentState
from langchain.messages import ToolMessage
from langchain.tools import ToolRuntime, tool
from langgraph.types import Command

class CustomState(AgentState):
    user_name: str

@tool
def set_user_name(new_name: str, runtime: ToolRuntime[None, CustomState]) -> Command:
    """Set the user's name in the conversation state."""
    return Command(
        update={
            "user_name": new_name,
            "messages": [
                ToolMessage(
                    content=f"User name set to {new_name}.",
                    tool_call_id=runtime.tool_call_id,
                )
            ],
        }
    )
```


> [!TIP]
>
> When tools update state variables, consider defining a [reducer](lc:oss/python/langgraph/graph-api#reducers) for those fields. Since LLMs can call multiple tools in parallel, a reducer determines how to resolve conflicts when the same state field is updated by concurrent tool calls.


### Context

Context provides immutable configuration data that is passed at invocation time. Use it for user IDs, session details, or application-specific settings that shouldn't change during a conversation.


> [!NOTE]
>
> While `thread_id` (passed via `config={"configurable": {"thread_id": ...}}`) scopes the *conversation*: message history and checkpoints, `context` carries *per-run* data your tools and middleware read at invocation time. In production you typically pass both together: a stable `thread_id` per conversation, and a `context` object on every invoke.


Access context through `runtime.context`. Pass it alongside a `thread_id` so the conversation is persisted across turns:


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import tool, ToolRuntime\nfrom langchain_core.utils.uuid import uuid7\nfrom langchain_openai import ChatOpenAI\n\n\nUSER_DATABASE = {\n    \"user123\": {\n        \"name\": \"Alice Johnson\",\n        \"account_type\": \"Premium\",\n        \"balance\": 5000,\n        \"email\": \"alice@example.com\",\n    },\n    \"user456\": {\n        \"name\": \"Bob Smith\",\n        \"account_type\": \"Standard\",\n        \"balance\": 1200,\n        \"email\": \"bob@example.com\",\n    },\n}\n\n\n@dataclass\nclass UserContext:\n    user_id: str\n\n\n@tool\ndef get_account_info(runtime: ToolRuntime[UserContext]) -> str:\n    \"\"\"Get the current user's account information.\"\"\"\n    user_id = runtime.context.user_id\n\n    if user_id in USER_DATABASE:\n        user = USER_DATABASE[user_id]\n        return (\n            f\"Account holder: {user['name']}\\n\"\n            f\"Type: {user['account_type']}\\n\"\n            f\"Balance: ${user['balance']}\"\n        )\n    return \"User not found\"\n\n\nmodel = ChatOpenAI(model=\"google_genai:gemini-3.6-flash\")\nagent = create_agent(\n    model,\n    tools=[get_account_info],\n    context_schema=UserContext,\n    system_prompt=\"You are a financial assistant.\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's my current balance?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=UserContext(user_id=\"user123\"),\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import tool, ToolRuntime\nfrom langchain_core.utils.uuid import uuid7\nfrom langchain_openai import ChatOpenAI\n\n\nUSER_DATABASE = {\n    \"user123\": {\n        \"name\": \"Alice Johnson\",\n        \"account_type\": \"Premium\",\n        \"balance\": 5000,\n        \"email\": \"alice@example.com\",\n    },\n    \"user456\": {\n        \"name\": \"Bob Smith\",\n        \"account_type\": \"Standard\",\n        \"balance\": 1200,\n        \"email\": \"bob@example.com\",\n    },\n}\n\n\n@dataclass\nclass UserContext:\n    user_id: str\n\n\n@tool\ndef get_account_info(runtime: ToolRuntime[UserContext]) -> str:\n    \"\"\"Get the current user's account information.\"\"\"\n    user_id = runtime.context.user_id\n\n    if user_id in USER_DATABASE:\n        user = USER_DATABASE[user_id]\n        return (\n            f\"Account holder: {user['name']}\\n\"\n            f\"Type: {user['account_type']}\\n\"\n            f\"Balance: ${user['balance']}\"\n        )\n    return \"User not found\"\n\n\nmodel = ChatOpenAI(model=\"openai:gpt-5.5\")\nagent = create_agent(\n    model,\n    tools=[get_account_info],\n    context_schema=UserContext,\n    system_prompt=\"You are a financial assistant.\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's my current balance?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=UserContext(user_id=\"user123\"),\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import tool, ToolRuntime\nfrom langchain_core.utils.uuid import uuid7\nfrom langchain_openai import ChatOpenAI\n\n\nUSER_DATABASE = {\n    \"user123\": {\n        \"name\": \"Alice Johnson\",\n        \"account_type\": \"Premium\",\n        \"balance\": 5000,\n        \"email\": \"alice@example.com\",\n    },\n    \"user456\": {\n        \"name\": \"Bob Smith\",\n        \"account_type\": \"Standard\",\n        \"balance\": 1200,\n        \"email\": \"bob@example.com\",\n    },\n}\n\n\n@dataclass\nclass UserContext:\n    user_id: str\n\n\n@tool\ndef get_account_info(runtime: ToolRuntime[UserContext]) -> str:\n    \"\"\"Get the current user's account information.\"\"\"\n    user_id = runtime.context.user_id\n\n    if user_id in USER_DATABASE:\n        user = USER_DATABASE[user_id]\n        return (\n            f\"Account holder: {user['name']}\\n\"\n            f\"Type: {user['account_type']}\\n\"\n            f\"Balance: ${user['balance']}\"\n        )\n    return \"User not found\"\n\n\nmodel = ChatOpenAI(model=\"anthropic:claude-sonnet-4-6\")\nagent = create_agent(\n    model,\n    tools=[get_account_info],\n    context_schema=UserContext,\n    system_prompt=\"You are a financial assistant.\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's my current balance?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=UserContext(user_id=\"user123\"),\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import tool, ToolRuntime\nfrom langchain_core.utils.uuid import uuid7\nfrom langchain_openai import ChatOpenAI\n\n\nUSER_DATABASE = {\n    \"user123\": {\n        \"name\": \"Alice Johnson\",\n        \"account_type\": \"Premium\",\n        \"balance\": 5000,\n        \"email\": \"alice@example.com\",\n    },\n    \"user456\": {\n        \"name\": \"Bob Smith\",\n        \"account_type\": \"Standard\",\n        \"balance\": 1200,\n        \"email\": \"bob@example.com\",\n    },\n}\n\n\n@dataclass\nclass UserContext:\n    user_id: str\n\n\n@tool\ndef get_account_info(runtime: ToolRuntime[UserContext]) -> str:\n    \"\"\"Get the current user's account information.\"\"\"\n    user_id = runtime.context.user_id\n\n    if user_id in USER_DATABASE:\n        user = USER_DATABASE[user_id]\n        return (\n            f\"Account holder: {user['name']}\\n\"\n            f\"Type: {user['account_type']}\\n\"\n            f\"Balance: ${user['balance']}\"\n        )\n    return \"User not found\"\n\n\nmodel = ChatOpenAI(model=\"openrouter:z-ai/glm-5.2\")\nagent = create_agent(\n    model,\n    tools=[get_account_info],\n    context_schema=UserContext,\n    system_prompt=\"You are a financial assistant.\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's my current balance?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=UserContext(user_id=\"user123\"),\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import tool, ToolRuntime\nfrom langchain_core.utils.uuid import uuid7\nfrom langchain_openai import ChatOpenAI\n\n\nUSER_DATABASE = {\n    \"user123\": {\n        \"name\": \"Alice Johnson\",\n        \"account_type\": \"Premium\",\n        \"balance\": 5000,\n        \"email\": \"alice@example.com\",\n    },\n    \"user456\": {\n        \"name\": \"Bob Smith\",\n        \"account_type\": \"Standard\",\n        \"balance\": 1200,\n        \"email\": \"bob@example.com\",\n    },\n}\n\n\n@dataclass\nclass UserContext:\n    user_id: str\n\n\n@tool\ndef get_account_info(runtime: ToolRuntime[UserContext]) -> str:\n    \"\"\"Get the current user's account information.\"\"\"\n    user_id = runtime.context.user_id\n\n    if user_id in USER_DATABASE:\n        user = USER_DATABASE[user_id]\n        return (\n            f\"Account holder: {user['name']}\\n\"\n            f\"Type: {user['account_type']}\\n\"\n            f\"Balance: ${user['balance']}\"\n        )\n    return \"User not found\"\n\n\nmodel = ChatOpenAI(model=\"fireworks:accounts/fireworks/models/glm-5p2\")\nagent = create_agent(\n    model,\n    tools=[get_account_info],\n    context_schema=UserContext,\n    system_prompt=\"You are a financial assistant.\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's my current balance?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=UserContext(user_id=\"user123\"),\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import tool, ToolRuntime\nfrom langchain_core.utils.uuid import uuid7\nfrom langchain_openai import ChatOpenAI\n\n\nUSER_DATABASE = {\n    \"user123\": {\n        \"name\": \"Alice Johnson\",\n        \"account_type\": \"Premium\",\n        \"balance\": 5000,\n        \"email\": \"alice@example.com\",\n    },\n    \"user456\": {\n        \"name\": \"Bob Smith\",\n        \"account_type\": \"Standard\",\n        \"balance\": 1200,\n        \"email\": \"bob@example.com\",\n    },\n}\n\n\n@dataclass\nclass UserContext:\n    user_id: str\n\n\n@tool\ndef get_account_info(runtime: ToolRuntime[UserContext]) -> str:\n    \"\"\"Get the current user's account information.\"\"\"\n    user_id = runtime.context.user_id\n\n    if user_id in USER_DATABASE:\n        user = USER_DATABASE[user_id]\n        return (\n            f\"Account holder: {user['name']}\\n\"\n            f\"Type: {user['account_type']}\\n\"\n            f\"Balance: ${user['balance']}\"\n        )\n    return \"User not found\"\n\n\nmodel = ChatOpenAI(model=\"baseten:zai-org/GLM-5.2\")\nagent = create_agent(\n    model,\n    tools=[get_account_info],\n    context_schema=UserContext,\n    system_prompt=\"You are a financial assistant.\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's my current balance?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=UserContext(user_id=\"user123\"),\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import tool, ToolRuntime\nfrom langchain_core.utils.uuid import uuid7\nfrom langchain_openai import ChatOpenAI\n\n\nUSER_DATABASE = {\n    \"user123\": {\n        \"name\": \"Alice Johnson\",\n        \"account_type\": \"Premium\",\n        \"balance\": 5000,\n        \"email\": \"alice@example.com\",\n    },\n    \"user456\": {\n        \"name\": \"Bob Smith\",\n        \"account_type\": \"Standard\",\n        \"balance\": 1200,\n        \"email\": \"bob@example.com\",\n    },\n}\n\n\n@dataclass\nclass UserContext:\n    user_id: str\n\n\n@tool\ndef get_account_info(runtime: ToolRuntime[UserContext]) -> str:\n    \"\"\"Get the current user's account information.\"\"\"\n    user_id = runtime.context.user_id\n\n    if user_id in USER_DATABASE:\n        user = USER_DATABASE[user_id]\n        return (\n            f\"Account holder: {user['name']}\\n\"\n            f\"Type: {user['account_type']}\\n\"\n            f\"Balance: ${user['balance']}\"\n        )\n    return \"User not found\"\n\n\nmodel = ChatOpenAI(model=\"ollama:north-mini-code-1.0\")\nagent = create_agent(\n    model,\n    tools=[get_account_info],\n    context_schema=UserContext,\n    system_prompt=\"You are a financial assistant.\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's my current balance?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=UserContext(user_id=\"user123\"),\n)"
 }
]
```


### Long-term memory (Store)

The `BaseStore` provides persistent storage that survives across conversations. Unlike state (short-term memory), data saved to the store remains available in future sessions.

Access the store through `runtime.store`. The store uses a namespace/key pattern to organize data:


> [!TIP]
>
> For production deployments, use a persistent store implementation like `PostgresStore`, `MongoDBStore`, or `RedisStore` instead of `InMemoryStore`. See the [memory documentation](lc:oss/python/langgraph/add-memory) for setup details.


```python expandable
from typing import Any
from langgraph.store.memory import InMemoryStore
from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime
from langchain_openai import ChatOpenAI

# Access memory
@tool
def get_user_info(user_id: str, runtime: ToolRuntime) -> str:
    """Look up user info."""
    store = runtime.store
    user_info = store.get(("users",), user_id)
    return str(user_info.value) if user_info else "Unknown user"

# Update memory
@tool
def save_user_info(user_id: str, user_info: dict[str, Any], runtime: ToolRuntime) -> str:
    """Save user info."""
    store = runtime.store
    store.put(("users",), user_id, user_info)
    return "Successfully saved user info."

model = ChatOpenAI(model="gpt-5.5")

store = InMemoryStore()
agent = create_agent(
    model,
    tools=[get_user_info, save_user_info],
    store=store
)

# First session: save user info
agent.invoke({
    "messages": [{"role": "user", "content": "Save the following user: userid: abc123, name: Foo, age: 25, email: foo@langchain.dev"}]
})

# Second session: get user info
agent.invoke({
    "messages": [{"role": "user", "content": "Get user info for user with id 'abc123'"}]
})
# Here is the user info for user with ID "abc123":
# - Name: Foo
# - Age: 25
# - Email: foo@langchain.dev
```


### Stream writer

Stream real-time updates from tools during execution. This is useful for providing progress feedback to users during long-running operations.

Use `runtime.stream_writer` to emit custom updates:

```python
from langchain.tools import tool, ToolRuntime

@tool
def get_weather(city: str, runtime: ToolRuntime) -> str:
    """Get weather for a given city."""
    writer = runtime.stream_writer

    # Stream custom updates as the tool executes
    writer(f"Looking up data for city: {city}")
    writer(f"Acquired data for city: {city}")

    return f"It's always sunny in {city}!"
```


> [!NOTE]
>
> If you use `runtime.stream_writer` inside your tool, the tool must be invoked within a LangGraph execution context. See [Streaming](lc:oss/python/langchain/streaming) for more details.


### Execution info

Access thread ID, run ID, and retry state from within a tool via `runtime.execution_info`:

```python
from langchain.tools import tool, ToolRuntime

@tool
def log_execution_context(runtime: ToolRuntime) -> str:
    """Log execution identity information."""
    info = runtime.execution_info
    print(f"Thread: {info.thread_id}, Run: {info.run_id}")  # [!code highlight]
    print(f"Attempt: {info.node_attempt}")
    return "done"
```


> [!NOTE]
>
> Requires `deepagents>=0.5.0` (or `langgraph>=1.1.5`).


### Server info

When your tool runs on LangGraph Server, access the assistant ID, graph ID, and authenticated user via `runtime.server_info`:

```python
from langchain.tools import tool, ToolRuntime

@tool
def get_assistant_scoped_data(runtime: ToolRuntime) -> str:
    """Fetch data scoped to the current assistant."""
    server = runtime.server_info
    if server is not None:
        print(f"Assistant: {server.assistant_id}, Graph: {server.graph_id}")  # [!code highlight]
        if server.user is not None:
            print(f"User: {server.user.identity}")  # [!code highlight]
    return "done"
```

`server_info` is `None` when the tool is not running on LangGraph Server (e.g., during local development or testing).


> [!NOTE]
>
> Requires `deepagents>=0.5.0` (or `langgraph>=1.1.5`).


### Migrate from older injection patterns

Older examples used `InjectedState`, `InjectedStore`, `get_runtime()`, or `InjectedToolCallId`. Use `ToolRuntime` instead for one explicit interface to state, context, store, and execution metadata.

#### Previous pattern

```python
from langchain.tools import tool, InjectedState

@tool
def summarize(state: InjectedState) -> str:
    """Summarize the conversation."""
    messages = state["messages"]
    return f"Conversation length: {len(messages)} messages."
```

#### Recommended pattern

```python
from langchain.tools import tool, ToolRuntime

@tool
def summarize(runtime: ToolRuntime) -> str:
    """Summarize the conversation."""
    messages = runtime.state["messages"]
    return f"Conversation length: {len(messages)} messages."
```

For agent-level migrations (for example `create_react_agent` and custom state), see the [LangChain v1 migration guide](lc:oss/python/migrate/langchain-v1).


## Tool execution

In LangChain, tools are used by agents (for example via `create_agent`) and tool error handling is configured through [middleware](lc:oss/python/langchain/middleware/overview).

For LangGraph workflows, tool execution is handled by `ToolNode`. See [ToolNode](lc:oss/python/langgraph/workflows-agents#toolnode) for Graph API usage, including how tools can access the current graph state and run-scoped context.

### Tool return values

You can choose different return values for your tools:

- Return a `string` for human-readable results.
- Return an `object` for structured results the model should parse.
- Return a `Command` with optional message when you need to write to state.

#### Return a string

Return a string when the tool should provide plain text for the model to read and use in its next response.


```python
from langchain.tools import tool

@tool
def get_weather(city: str) -> str:
    """Get weather for a city."""
    return f"It is currently sunny in {city}."
```


Behavior:

- The return value is converted to a `ToolMessage`.
- The model sees that text and decides what to do next.
- No agent state fields are changed unless the model or another tool does so later.

Use this when the result is naturally human-readable text.

#### Return an object

Return an object (for example, a `dict`) when your tool produces structured data that the model should inspect.


```python
from langchain.tools import tool

@tool
def get_weather_data(city: str) -> dict:
    """Get structured weather data for a city."""
    return {
        "city": city,
        "temperature_c": 22,
        "conditions": "sunny",
    }
```


Behavior:

- The object is serialized and sent back as tool output.
- The model can read specific fields and reason over them.
- Like string returns, this does not directly update graph state.

Use this when downstream reasoning benefits from explicit fields instead of free-form text.

#### Return multimodal content

Tools are not limited to plain text. When the model supports multimodal tool results, the tool can return [standard content blocks](lc:oss/python/langchain/messages#standard-content-blocks) so the model receives text, images, and other media in one tool result.

```python
from langchain.tools import tool

@tool
def capture_screenshot() -> list[dict]:
    """Capture a screenshot of the current page."""
    return [
        {"type": "text", "text": "Screenshot of the current page:"},
        {"type": "image", "url": "https://example.com/page.png"},
    ]
```


Behavior:

- The return value is converted to a `ToolMessage` with multimodal `content`.
- Use `message.content_blocks` to read the normalized block list after the tool runs.
- The model must support the modalities you return. Check your [model's capabilities](lc:oss/python/integrations/chat/index) before returning images, audio, or video.

For block types and provider-specific requirements, see [Multimodal messages](lc:oss/python/langchain/messages#multimodal). MCP tools that return images or mixed content are converted the same way; see [Multimodal tool content](lc:oss/python/langchain/mcp#multimodal-tool-content).

#### Return a Command

Return a `Command` when the tool needs to update graph state (for example, setting user preferences or app state).
You can return a `Command` with or without including a `ToolMessage`.
If the model needs to see that the tool succeeded (for example, to confirm a preference change), include a `ToolMessage` in the update, using `runtime.tool_call_id` for the `tool_call_id` parameter.


```python
from langchain.messages import ToolMessage
from langchain.tools import ToolRuntime, tool
from langgraph.types import Command

@tool
def set_language(language: str, runtime: ToolRuntime) -> Command:
    """Set the preferred response language."""
    return Command(
        update={
            "preferred_language": language,
            "messages": [
                ToolMessage(
                    content=f"Language set to {language}.",
                    tool_call_id=runtime.tool_call_id,
                )
            ],
        }
    )
```


Behavior:

- The command updates state using `update`.
- Updated state is available to subsequent steps in the same run.
- Use reducers for fields that may be updated by parallel tool calls.

Use this when the tool is not just returning data, but also mutating agent state.

#### Return directly from a tool

Set return direct on a tool to short-circuit the agent loop: the agent returns the tool's output to the caller immediately, without sending it back through the model for further processing.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\nfrom langchain_openai import ChatOpenAI\n\n\n@tool(return_direct=True)\ndef fetch_order_status(order_id: str) -> str:\n    \"\"\"Fetch the current status of a customer order.\"\"\"\n    # In production, query your order management system here\n    return f\"Order {order_id} is shipped and will arrive in 2 days.\"\n\n\nagent = create_agent(\n    ChatOpenAI(model=\"google_genai:gemini-3.6-flash\"),\n    tools=[fetch_order_status],\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"What is the status of order #12345?\"}]\n})\n# The agent returns the tool output directly without another LLM call:\n# \"Order 12345 is shipped and will arrive in 2 days.\""
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\nfrom langchain_openai import ChatOpenAI\n\n\n@tool(return_direct=True)\ndef fetch_order_status(order_id: str) -> str:\n    \"\"\"Fetch the current status of a customer order.\"\"\"\n    # In production, query your order management system here\n    return f\"Order {order_id} is shipped and will arrive in 2 days.\"\n\n\nagent = create_agent(\n    ChatOpenAI(model=\"openai:gpt-5.5\"),\n    tools=[fetch_order_status],\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"What is the status of order #12345?\"}]\n})\n# The agent returns the tool output directly without another LLM call:\n# \"Order 12345 is shipped and will arrive in 2 days.\""
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\nfrom langchain_openai import ChatOpenAI\n\n\n@tool(return_direct=True)\ndef fetch_order_status(order_id: str) -> str:\n    \"\"\"Fetch the current status of a customer order.\"\"\"\n    # In production, query your order management system here\n    return f\"Order {order_id} is shipped and will arrive in 2 days.\"\n\n\nagent = create_agent(\n    ChatOpenAI(model=\"anthropic:claude-sonnet-4-6\"),\n    tools=[fetch_order_status],\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"What is the status of order #12345?\"}]\n})\n# The agent returns the tool output directly without another LLM call:\n# \"Order 12345 is shipped and will arrive in 2 days.\""
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\nfrom langchain_openai import ChatOpenAI\n\n\n@tool(return_direct=True)\ndef fetch_order_status(order_id: str) -> str:\n    \"\"\"Fetch the current status of a customer order.\"\"\"\n    # In production, query your order management system here\n    return f\"Order {order_id} is shipped and will arrive in 2 days.\"\n\n\nagent = create_agent(\n    ChatOpenAI(model=\"openrouter:z-ai/glm-5.2\"),\n    tools=[fetch_order_status],\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"What is the status of order #12345?\"}]\n})\n# The agent returns the tool output directly without another LLM call:\n# \"Order 12345 is shipped and will arrive in 2 days.\""
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\nfrom langchain_openai import ChatOpenAI\n\n\n@tool(return_direct=True)\ndef fetch_order_status(order_id: str) -> str:\n    \"\"\"Fetch the current status of a customer order.\"\"\"\n    # In production, query your order management system here\n    return f\"Order {order_id} is shipped and will arrive in 2 days.\"\n\n\nagent = create_agent(\n    ChatOpenAI(model=\"fireworks:accounts/fireworks/models/glm-5p2\"),\n    tools=[fetch_order_status],\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"What is the status of order #12345?\"}]\n})\n# The agent returns the tool output directly without another LLM call:\n# \"Order 12345 is shipped and will arrive in 2 days.\""
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\nfrom langchain_openai import ChatOpenAI\n\n\n@tool(return_direct=True)\ndef fetch_order_status(order_id: str) -> str:\n    \"\"\"Fetch the current status of a customer order.\"\"\"\n    # In production, query your order management system here\n    return f\"Order {order_id} is shipped and will arrive in 2 days.\"\n\n\nagent = create_agent(\n    ChatOpenAI(model=\"baseten:zai-org/GLM-5.2\"),\n    tools=[fetch_order_status],\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"What is the status of order #12345?\"}]\n})\n# The agent returns the tool output directly without another LLM call:\n# \"Order 12345 is shipped and will arrive in 2 days.\""
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\nfrom langchain_openai import ChatOpenAI\n\n\n@tool(return_direct=True)\ndef fetch_order_status(order_id: str) -> str:\n    \"\"\"Fetch the current status of a customer order.\"\"\"\n    # In production, query your order management system here\n    return f\"Order {order_id} is shipped and will arrive in 2 days.\"\n\n\nagent = create_agent(\n    ChatOpenAI(model=\"ollama:north-mini-code-1.0\"),\n    tools=[fetch_order_status],\n)\n\nresult = agent.invoke({\n    \"messages\": [{\"role\": \"user\", \"content\": \"What is the status of order #12345?\"}]\n})\n# The agent returns the tool output directly without another LLM call:\n# \"Order 12345 is shipped and will arrive in 2 days.\""
 }
]
```


Behavior:

- The tool executes normally and its output is wrapped in a `ToolMessage`.
- The agent stops looping and returns the tool's output as the final response, bypassing any additional model call.
- If the model calls multiple tools in a single turn, `return_direct` takes effect only when **all** called tools have `return_direct=True`.

Use this when:

- The tool's output is the complete, user-ready answer (for example, a lookup that returns a ready-to-display result).
- You want to avoid an extra model call when no additional reasoning is needed.
- You need deterministic, unmodified output — the model cannot rephrase, summarize, or act on the tool result.


> [!WARNING]
>
> Because the model does not process the tool's output, `return_direct=True` is not suitable for tools whose results require further reasoning, summarization, or chaining with other tool calls.


### Error handling

Handle tool errors using LangChain agent [middleware](lc:oss/python/langchain/middleware/overview) to retry failed tool calls or return custom error messages:


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from collections.abc import Callable\n\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import wrap_tool_call\nfrom langchain.messages import ToolMessage\nfrom langchain.tools.tool_node import ToolCallRequest\n\n\n@wrap_tool_call\ndef handle_tool_errors(\n    request: ToolCallRequest,\n    handler: Callable[[ToolCallRequest], ToolMessage],\n) -> ToolMessage:\n    \"\"\"Convert tool exceptions into ToolMessages the model can handle.\"\"\"\n    try:\n        return handler(request)\n    except Exception as e:\n        return ToolMessage(\n            content=f\"Tool error: Please check your input and try again. ({e})\",\n            tool_call_id=request.tool_call[\"id\"],\n        )\n\n\nagent = create_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[],\n    middleware=[handle_tool_errors],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from collections.abc import Callable\n\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import wrap_tool_call\nfrom langchain.messages import ToolMessage\nfrom langchain.tools.tool_node import ToolCallRequest\n\n\n@wrap_tool_call\ndef handle_tool_errors(\n    request: ToolCallRequest,\n    handler: Callable[[ToolCallRequest], ToolMessage],\n) -> ToolMessage:\n    \"\"\"Convert tool exceptions into ToolMessages the model can handle.\"\"\"\n    try:\n        return handler(request)\n    except Exception as e:\n        return ToolMessage(\n            content=f\"Tool error: Please check your input and try again. ({e})\",\n            tool_call_id=request.tool_call[\"id\"],\n        )\n\n\nagent = create_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[],\n    middleware=[handle_tool_errors],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from collections.abc import Callable\n\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import wrap_tool_call\nfrom langchain.messages import ToolMessage\nfrom langchain.tools.tool_node import ToolCallRequest\n\n\n@wrap_tool_call\ndef handle_tool_errors(\n    request: ToolCallRequest,\n    handler: Callable[[ToolCallRequest], ToolMessage],\n) -> ToolMessage:\n    \"\"\"Convert tool exceptions into ToolMessages the model can handle.\"\"\"\n    try:\n        return handler(request)\n    except Exception as e:\n        return ToolMessage(\n            content=f\"Tool error: Please check your input and try again. ({e})\",\n            tool_call_id=request.tool_call[\"id\"],\n        )\n\n\nagent = create_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[],\n    middleware=[handle_tool_errors],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from collections.abc import Callable\n\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import wrap_tool_call\nfrom langchain.messages import ToolMessage\nfrom langchain.tools.tool_node import ToolCallRequest\n\n\n@wrap_tool_call\ndef handle_tool_errors(\n    request: ToolCallRequest,\n    handler: Callable[[ToolCallRequest], ToolMessage],\n) -> ToolMessage:\n    \"\"\"Convert tool exceptions into ToolMessages the model can handle.\"\"\"\n    try:\n        return handler(request)\n    except Exception as e:\n        return ToolMessage(\n            content=f\"Tool error: Please check your input and try again. ({e})\",\n            tool_call_id=request.tool_call[\"id\"],\n        )\n\n\nagent = create_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[],\n    middleware=[handle_tool_errors],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from collections.abc import Callable\n\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import wrap_tool_call\nfrom langchain.messages import ToolMessage\nfrom langchain.tools.tool_node import ToolCallRequest\n\n\n@wrap_tool_call\ndef handle_tool_errors(\n    request: ToolCallRequest,\n    handler: Callable[[ToolCallRequest], ToolMessage],\n) -> ToolMessage:\n    \"\"\"Convert tool exceptions into ToolMessages the model can handle.\"\"\"\n    try:\n        return handler(request)\n    except Exception as e:\n        return ToolMessage(\n            content=f\"Tool error: Please check your input and try again. ({e})\",\n            tool_call_id=request.tool_call[\"id\"],\n        )\n\n\nagent = create_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[],\n    middleware=[handle_tool_errors],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from collections.abc import Callable\n\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import wrap_tool_call\nfrom langchain.messages import ToolMessage\nfrom langchain.tools.tool_node import ToolCallRequest\n\n\n@wrap_tool_call\ndef handle_tool_errors(\n    request: ToolCallRequest,\n    handler: Callable[[ToolCallRequest], ToolMessage],\n) -> ToolMessage:\n    \"\"\"Convert tool exceptions into ToolMessages the model can handle.\"\"\"\n    try:\n        return handler(request)\n    except Exception as e:\n        return ToolMessage(\n            content=f\"Tool error: Please check your input and try again. ({e})\",\n            tool_call_id=request.tool_call[\"id\"],\n        )\n\n\nagent = create_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[],\n    middleware=[handle_tool_errors],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from collections.abc import Callable\n\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import wrap_tool_call\nfrom langchain.messages import ToolMessage\nfrom langchain.tools.tool_node import ToolCallRequest\n\n\n@wrap_tool_call\ndef handle_tool_errors(\n    request: ToolCallRequest,\n    handler: Callable[[ToolCallRequest], ToolMessage],\n) -> ToolMessage:\n    \"\"\"Convert tool exceptions into ToolMessages the model can handle.\"\"\"\n    try:\n        return handler(request)\n    except Exception as e:\n        return ToolMessage(\n            content=f\"Tool error: Please check your input and try again. ({e})\",\n            tool_call_id=request.tool_call[\"id\"],\n        )\n\n\nagent = create_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[],\n    middleware=[handle_tool_errors],\n)"
 }
]
```


### State injection

Tools access graph state through `ToolRuntime`. See [Access context](#access-context) for state, context, store, and streaming APIs.

```python
from langchain.tools import tool, ToolRuntime

@tool
def get_message_count(runtime: ToolRuntime) -> str:
    """Get the number of messages in the conversation."""
    messages = runtime.state["messages"]
    return f"There are {len(messages)} messages."
```

For more details on accessing state, context, and long-term memory from tools, see [Access context](#access-context).

## Dynamic tool selection

With dynamic tools, the set of tools available to the agent is modified at runtime rather than defined all upfront. Not every tool is appropriate for every situation. Too many tools may overwhelm the model (overload context) and increase errors; too few limit capabilities. Dynamic tool selection enables adapting the available toolset based on authentication state, user permissions, feature flags, or conversation stage.

There are two approaches depending on whether tools are known ahead of time:

  #### Tab: Filtering pre-registered tools

    When all possible tools are known at agent creation time, you can pre-register them and dynamically filter which ones are exposed to the model based on state, permissions, or context.

    
      #### Tab: State

        Enable advanced tools only after certain conversation milestones:


        ```python
        from langchain.agents import create_agent
        from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
        from typing import Callable

        @wrap_model_call
        def state_based_tools(
            request: ModelRequest,
            handler: Callable[[ModelRequest], ModelResponse]
        ) -> ModelResponse:
            """Filter tools based on conversation State."""
            # Read from State: check if user has authenticated
            state = request.state
            is_authenticated = state.get("authenticated", False)
            message_count = len(state["messages"])

            # Only enable sensitive tools after authentication
            if not is_authenticated:
                tools = [t for t in request.tools if t.name.startswith("public_")]
                request = request.override(tools=tools)
            elif message_count < 5:
                # Limit tools early in conversation
                tools = [t for t in request.tools if t.name != "advanced_search"]
                request = request.override(tools=tools)

            return handler(request)

        agent = create_agent(
            model="gpt-5.5",
            tools=[public_search, private_search, advanced_search],
            middleware=[state_based_tools]
        )
        ```


      

      #### Tab: Store

        Filter tools based on user preferences or feature flags in Store:


        ```python
        from dataclasses import dataclass
        from langchain.agents import create_agent
        from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
        from typing import Callable
        from langgraph.store.memory import InMemoryStore

        @dataclass
        class Context:
            user_id: str

        @wrap_model_call
        def store_based_tools(
            request: ModelRequest,
            handler: Callable[[ModelRequest], ModelResponse]
        ) -> ModelResponse:
            """Filter tools based on Store preferences."""
            user_id = request.runtime.context.user_id

            # Read from Store: get user's enabled features
            store = request.runtime.store
            feature_flags = store.get(("features",), user_id)

            if feature_flags:
                enabled_features = feature_flags.value.get("enabled_tools", [])
                # Only include tools that are enabled for this user
                tools = [t for t in request.tools if t.name in enabled_features]
                request = request.override(tools=tools)

            return handler(request)

        agent = create_agent(
            model="gpt-5.5",
            tools=[search_tool, analysis_tool, export_tool],
            middleware=[store_based_tools],
            context_schema=Context,
            store=InMemoryStore()
        )
        ```


      

      #### Tab: Runtime Context

        Filter tools based on user permissions from Runtime Context:


        ```python
        from dataclasses import dataclass
        from langchain.agents import create_agent
        from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
        from typing import Callable

        @dataclass
        class Context:
            user_role: str

        @wrap_model_call
        def context_based_tools(
            request: ModelRequest,
            handler: Callable[[ModelRequest], ModelResponse]
        ) -> ModelResponse:
            """Filter tools based on Runtime Context permissions."""
            # Read from Runtime Context: get user role
            if request.runtime is None or request.runtime.context is None:
                # If no context provided, default to viewer (most restrictive)
                user_role = "viewer"
            else:
                user_role = request.runtime.context.user_role

            if user_role == "admin":
                # Admins get all tools
                pass
            elif user_role == "editor":
                # Editors can't delete
                tools = [t for t in request.tools if t.name != "delete_data"]
                request = request.override(tools=tools)
            else:
                # Viewers get read-only tools
                tools = [t for t in request.tools if t.name.startswith("read_")]
                request = request.override(tools=tools)

            return handler(request)

        agent = create_agent(
            model="gpt-5.5",
            tools=[read_data, write_data, delete_data],
            middleware=[context_based_tools],
            context_schema=Context
        )
        ```


      
    

    This approach is best when:
    - All possible tools are known at compile/startup time
    - You want to filter based on permissions, feature flags, or conversation state
    - Tools are static but their availability is dynamic

    See [Dynamically selecting tools](lc:oss/python/langchain/middleware/custom#dynamically-selecting-tools) for more examples.

  

  #### Tab: Runtime tool registration

    When tools are discovered or created at runtime (e.g., loaded from an MCP server, generated based on user data, or fetched from a remote registry), you need to both register the tools and handle their execution dynamically.

    This requires two middleware hooks:
    1. `wrap_model_call` - Add the dynamic tools to the request
    2. `wrap_tool_call` - Handle execution of the dynamically added tools


    ```python
    from langchain.tools import tool
    from langchain.agents import create_agent
    from langchain.agents.middleware import AgentMiddleware, ModelRequest, ToolCallRequest

    # A tool that will be added dynamically at runtime
    @tool
    def calculate_tip(bill_amount: float, tip_percentage: float = 20.0) -> str:
        """Calculate the tip amount for a bill."""
        tip = bill_amount * (tip_percentage / 100)
        return f"Tip: ${tip:.2f}, Total: ${bill_amount + tip:.2f}"

    class DynamicToolMiddleware(AgentMiddleware):
        """Middleware that registers and handles dynamic tools."""

        def wrap_model_call(self, request: ModelRequest, handler):
            # Add dynamic tool to the request
            # This could be loaded from an MCP server, database, etc.
            updated = request.override(tools=[*request.tools, calculate_tip])
            return handler(updated)

        def wrap_tool_call(self, request: ToolCallRequest, handler):
            # Handle execution of the dynamic tool
            if request.tool_call["name"] == "calculate_tip":
                return handler(request.override(tool=calculate_tip))
            return handler(request)

    agent = create_agent(
        model="gpt-5.5",
        tools=[get_weather],  # Only static tools registered here
        middleware=[DynamicToolMiddleware()],
    )

    # The agent can now use both get_weather AND calculate_tip
    result = agent.invoke({
        "messages": [{"role": "user", "content": "Calculate a 20% tip on $85"}]
    })
    ```


    This approach is best when:
    - Tools are discovered at runtime (e.g., from an MCP server)
    - Tools are generated dynamically based on user data or configuration
    - You're integrating with external tool registries

    

> [!NOTE]
>
> The `wrap_tool_call` hook is required for runtime-registered tools because the agent needs to know how to execute tools that weren't in the original tool list. Without it, the agent won't know how to invoke the dynamically added tool.


  

## Headless tools

Some tools should run **where your user's app runs** (typically the browser), not inside the process. **Headless tools** are tool definitions, which include the name, description, and argument schema, that you register on the **server** with your agent. The **implementation** is registered only on the **client** and executed after a short interrupt/resume handshake.

This is different from ordinary tools whose function body runs on the server, and from [server-side tool use](#server-side-tool-use) where the model provider executes built-in tools remotely.

### When to use headless tools

Use them when the work depends on the **environment, device, or UI** that only exists on the client. For example:

- **Browser APIs:** Geolocation, IndexedDB, Clipboard, Canvas 2D, file pickers, Battery API, etc.
- **Privacy and locality:** Data stays on the device (for example, local “memory” in IndexedDB).
- **Latency:** No extra server round trip for purely local operations.
- **Structured, safe effects:** Prefer many small, typed tools (for example one tool per canvas primitive) instead of sending arbitrary code to `eval`.

### How the pattern works

In both runtimes, the model sees a normal tool it can call, but the actual execution happens outside the server process.

1. **Define** a headless tool with `tool(name=..., description=..., args_schema=...)` from `langchain.tools`. A headless tool is schema-only, with no in-process implementation.
2. **Register** that tool with `create_agent` or your LangGraph graph so the model can call it normally.
3. **Handle** the interrupt payload when the tool is invoked. Instead of running locally, the graph pauses with a payload shaped like `{"type": "tool", "tool_call": {"id", "name", "args"}}`.
4. **Resume** the graph after your app, another service, or a human step performs the action. For browser-based flows, you can mirror the schema in the frontend and attach `.implement(...)` there.


> [!NOTE]
>
> If you call `tool(...)` in Python with only `name`, `description`, and `args_schema`, LangChain returns a `HeadlessTool`. There is no `.implement()` API on the Python side.


When the model issues a tool call for one of these tools, the run **interrupts** instead of executing the tool locally. Your app can inspect the payload, perform the action in the right environment (for example a browser, another service, or a human review step), then **resume** the graph with the tool result. When you use the supported JS SDK hooks, they can detect headless-tool interrupts, run the matching client implementation, and submit the resume command for you.

Use the optional **`onTool`** callback to observe lifecycle events (`start`, `success`, `error`) for UI feedback such as spinners or toasts.

### [Headless tools frontend pattern](lc:oss/python/langchain/frontend/headless-tools)
See an end-to-end example of schema-only tools executed in the client with `useStream`.

## Prebuilt tools

LangChain provides a large collection of prebuilt tools and toolkits for common tasks like web search, code interpretation, database access, and more. These ready-to-use tools can be directly integrated into your agents without writing custom code.

See the [tools and toolkits](lc:oss/python/integrations/tools/index) integration page for a complete list of available tools organized by category.

## Server-side tool use

Some chat models feature built-in tools that are executed server-side by the model provider. These include capabilities like web search and code interpreters that don't require you to define or host the tool logic.

Refer to the individual [chat model integration pages](lc:oss/python/integrations/providers/overview) and the [tool calling documentation](lc:oss/python/langchain/models#server-side-tool-use) for details on enabling and using these built-in tools.
