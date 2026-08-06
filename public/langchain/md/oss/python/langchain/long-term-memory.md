Long-term memory lets your agent store and recall information across different conversations and sessions.
Unlike [short-term memory](lc:oss/python/langchain/short-term-memory), which is scoped to a single thread, long-term memory persists across threads and can be recalled at any time.

Long-term memory is built on [LangGraph stores](lc:oss/python/langgraph/stores), which save data as JSON documents organized by namespace and key.

## Usage

To add long-term memory to an agent, create a store and pass it to `create_agent`:

    #### Tab: InMemoryStore


```python
from langchain.agents import create_agent
from langchain_core.runnables import Runnable
from langgraph.store.memory import InMemoryStore

# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production use.
store = InMemoryStore()

agent: Runnable = create_agent(
    "claude-sonnet-4-6",
    tools=[],
    store=store,
)
```


    
    #### Tab: PostgreSQL

```shell
pip install langgraph-checkpoint-postgres
```


```python
from langchain.agents import create_agent
from langchain_core.runnables import Runnable
from langgraph.store.postgres import PostgresStore  # type: ignore[import-not-found]

DB_URI = "postgresql://postgres:postgres@localhost:5432/postgres?sslmode=disable"

with PostgresStore.from_conn_string(DB_URI) as store:
    store.setup()
    agent: Runnable = create_agent(
        "claude-sonnet-4-6",
        tools=[],
        store=store,
    )
```


    

Tools can then read from and write to the store using the `runtime.store` parameter. See [Read long-term memory in tools](#read-long-term-memory-in-tools) and [Write long-term memory from tools](#write-long-term-memory-from-tools) for examples.


> [!TIP]
>
> For a deeper dive into memory types (semantic, episodic, procedural) and strategies for writing memories, see the [Memory conceptual guide](lc:oss/python/concepts/memory#long-term-memory).


## Memory storage

LangGraph stores long-term memories as JSON documents in a [store](lc:oss/python/langgraph/stores).

Each memory is organized under a custom `namespace` (similar to a folder) and a distinct `key` (like a file name). Namespaces often include user or org IDs or other labels that makes it easier to organize information.

This structure enables hierarchical organization of memories. Cross-namespace searching is then supported through content filters.

    #### Tab: InMemoryStore


```python
from collections.abc import Sequence

from langgraph.store.base import IndexConfig
from langgraph.store.memory import InMemoryStore

def embed(texts: Sequence[str]) -> list[list[float]]:
    # Replace with an actual embedding function or LangChain embeddings object
    return [[1.0, 2.0] for _ in texts]

# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production use.
store = InMemoryStore(index=IndexConfig(embed=embed, dims=2))
user_id = "my-user"
application_context = "chitchat"
namespace = (user_id, application_context)
store.put(
    namespace,
    "a-memory",
    {
        "rules": [
            "User likes short, direct language",
            "User only speaks English & python",
        ],
        "my-key": "my-value",
    },
)
# get the "memory" by ID
item = store.get(namespace, "a-memory")
# search for "memories" within this namespace, filtering on content equivalence, sorted by vector similarity
items = store.search(
    namespace, filter={"my-key": "my-value"}, query="language preferences"
)
```


    
    #### Tab: PostgreSQL


```python
from collections.abc import Sequence

from langgraph.store.base import IndexConfig
from langgraph.store.postgres import PostgresStore  # type: ignore[import-not-found]

def embed(texts: Sequence[str]) -> list[list[float]]:
    # Replace with an actual embedding function or LangChain embeddings object
    return [[1.0, 2.0] for _ in texts]

DB_URI = "postgresql://postgres:postgres@localhost:5432/postgres?sslmode=disable"

with PostgresStore.from_conn_string(
    DB_URI,
    index=IndexConfig(embed=embed, dims=2),  # type: ignore[arg-type]
) as store:
    store.setup()
    user_id = "my-user"
    application_context = "chitchat"
    namespace = (user_id, application_context)
    store.put(
        namespace,
        "a-memory",
        {
            "rules": [
                "User likes short, direct language",
                "User only speaks English & python",
            ],
            "my-key": "my-value",
        },
    )
    item = store.get(namespace, "a-memory")
    items = store.search(
        namespace, filter={"my-key": "my-value"}, query="language preferences"
    )
```


    

For more information about the memory store, see the [Persistence](lc:oss/python/langgraph/stores) guide.

## Read long-term memory in tools

    #### Tab: InMemoryStore


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n# Write sample data to the store using the put method\nstore.put(\n    (\n        \"users\",\n    ),  # Namespace to group related data together (users namespace for user data)\n    \"user_123\",  # Key within the namespace (user ID as key)\n    {\n        \"name\": \"John Smith\",\n        \"language\": \"English\",\n    },  # Data to store for the given user\n)\n\n\n@tool\ndef get_user_info(runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Look up user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    user_id = runtime.context.user_id\n    # Retrieve data from store - returns StoreValue object with value and metadata\n    user_info = runtime.store.get((\"users\",), user_id)\n    return str(user_info.value) if user_info else \"Unknown user\"\n\n\nagent: Runnable = create_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[get_user_info],\n    # Pass store to agent - enables agent to access store when running tools\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"look up user information\"}]},\n    context=Context(user_id=\"user_123\"),\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n# Write sample data to the store using the put method\nstore.put(\n    (\n        \"users\",\n    ),  # Namespace to group related data together (users namespace for user data)\n    \"user_123\",  # Key within the namespace (user ID as key)\n    {\n        \"name\": \"John Smith\",\n        \"language\": \"English\",\n    },  # Data to store for the given user\n)\n\n\n@tool\ndef get_user_info(runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Look up user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    user_id = runtime.context.user_id\n    # Retrieve data from store - returns StoreValue object with value and metadata\n    user_info = runtime.store.get((\"users\",), user_id)\n    return str(user_info.value) if user_info else \"Unknown user\"\n\n\nagent: Runnable = create_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[get_user_info],\n    # Pass store to agent - enables agent to access store when running tools\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"look up user information\"}]},\n    context=Context(user_id=\"user_123\"),\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n# Write sample data to the store using the put method\nstore.put(\n    (\n        \"users\",\n    ),  # Namespace to group related data together (users namespace for user data)\n    \"user_123\",  # Key within the namespace (user ID as key)\n    {\n        \"name\": \"John Smith\",\n        \"language\": \"English\",\n    },  # Data to store for the given user\n)\n\n\n@tool\ndef get_user_info(runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Look up user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    user_id = runtime.context.user_id\n    # Retrieve data from store - returns StoreValue object with value and metadata\n    user_info = runtime.store.get((\"users\",), user_id)\n    return str(user_info.value) if user_info else \"Unknown user\"\n\n\nagent: Runnable = create_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[get_user_info],\n    # Pass store to agent - enables agent to access store when running tools\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"look up user information\"}]},\n    context=Context(user_id=\"user_123\"),\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n# Write sample data to the store using the put method\nstore.put(\n    (\n        \"users\",\n    ),  # Namespace to group related data together (users namespace for user data)\n    \"user_123\",  # Key within the namespace (user ID as key)\n    {\n        \"name\": \"John Smith\",\n        \"language\": \"English\",\n    },  # Data to store for the given user\n)\n\n\n@tool\ndef get_user_info(runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Look up user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    user_id = runtime.context.user_id\n    # Retrieve data from store - returns StoreValue object with value and metadata\n    user_info = runtime.store.get((\"users\",), user_id)\n    return str(user_info.value) if user_info else \"Unknown user\"\n\n\nagent: Runnable = create_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[get_user_info],\n    # Pass store to agent - enables agent to access store when running tools\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"look up user information\"}]},\n    context=Context(user_id=\"user_123\"),\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n# Write sample data to the store using the put method\nstore.put(\n    (\n        \"users\",\n    ),  # Namespace to group related data together (users namespace for user data)\n    \"user_123\",  # Key within the namespace (user ID as key)\n    {\n        \"name\": \"John Smith\",\n        \"language\": \"English\",\n    },  # Data to store for the given user\n)\n\n\n@tool\ndef get_user_info(runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Look up user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    user_id = runtime.context.user_id\n    # Retrieve data from store - returns StoreValue object with value and metadata\n    user_info = runtime.store.get((\"users\",), user_id)\n    return str(user_info.value) if user_info else \"Unknown user\"\n\n\nagent: Runnable = create_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[get_user_info],\n    # Pass store to agent - enables agent to access store when running tools\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"look up user information\"}]},\n    context=Context(user_id=\"user_123\"),\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n# Write sample data to the store using the put method\nstore.put(\n    (\n        \"users\",\n    ),  # Namespace to group related data together (users namespace for user data)\n    \"user_123\",  # Key within the namespace (user ID as key)\n    {\n        \"name\": \"John Smith\",\n        \"language\": \"English\",\n    },  # Data to store for the given user\n)\n\n\n@tool\ndef get_user_info(runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Look up user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    user_id = runtime.context.user_id\n    # Retrieve data from store - returns StoreValue object with value and metadata\n    user_info = runtime.store.get((\"users\",), user_id)\n    return str(user_info.value) if user_info else \"Unknown user\"\n\n\nagent: Runnable = create_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[get_user_info],\n    # Pass store to agent - enables agent to access store when running tools\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"look up user information\"}]},\n    context=Context(user_id=\"user_123\"),\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n# Write sample data to the store using the put method\nstore.put(\n    (\n        \"users\",\n    ),  # Namespace to group related data together (users namespace for user data)\n    \"user_123\",  # Key within the namespace (user ID as key)\n    {\n        \"name\": \"John Smith\",\n        \"language\": \"English\",\n    },  # Data to store for the given user\n)\n\n\n@tool\ndef get_user_info(runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Look up user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    user_id = runtime.context.user_id\n    # Retrieve data from store - returns StoreValue object with value and metadata\n    user_info = runtime.store.get((\"users\",), user_id)\n    return str(user_info.value) if user_info else \"Unknown user\"\n\n\nagent: Runnable = create_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[get_user_info],\n    # Pass store to agent - enables agent to access store when running tools\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"look up user information\"}]},\n    context=Context(user_id=\"user_123\"),\n)"
 }
]
```


    
    #### Tab: PostgreSQL


```python
from dataclasses import dataclass

from langchain.agents import create_agent
from langchain.tools import ToolRuntime, tool
from langchain_core.runnables import Runnable
from langgraph.store.postgres import PostgresStore  # type: ignore[import-not-found]

@dataclass
class Context:
    user_id: str

DB_URI = "postgresql://postgres:postgres@localhost:5432/postgres?sslmode=disable"

with PostgresStore.from_conn_string(DB_URI) as store:
    store.setup()
    store.put(("users",), "user_123", {"name": "John Smith", "language": "English"})

    @tool
    def get_user_info(runtime: ToolRuntime[Context]) -> str:
        """Look up user info."""
        assert runtime.store is not None
        user_info = runtime.store.get(("users",), runtime.context.user_id)
        return str(user_info.value) if user_info else "Unknown user"

    agent: Runnable = create_agent(
        "claude-sonnet-4-6",
        tools=[get_user_info],
        store=store,
        context_schema=Context,
    )

    result = agent.invoke(
        {"messages": [{"role": "user", "content": "look up user information"}]},
        context=Context(user_id="user_123"),
    )
```


    

<a id="write-long-term"></a>
## Write long-term memory from tools

    #### Tab: InMemoryStore


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\nfrom typing_extensions import TypedDict\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# TypedDict defines the structure of user information for the LLM\nclass UserInfo(TypedDict):\n    name: str\n\n\n# Tool that allows agent to update user information (useful for chat applications)\n@tool\ndef save_user_info(user_info: UserInfo, runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Save user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    store = runtime.store\n    user_id = runtime.context.user_id\n    # Store data in the store (namespace, key, data)\n    store.put((\"users\",), user_id, dict(user_info))\n    return \"Successfully saved user info.\"\n\n\nagent: Runnable = create_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[save_user_info],\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"My name is John Smith\"}]},\n    # user_id passed in context to identify whose information is being updated\n    context=Context(user_id=\"user_123\"),\n)\n\n# You can access the store directly to get the value\nitem = store.get((\"users\",), \"user_123\")"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\nfrom typing_extensions import TypedDict\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# TypedDict defines the structure of user information for the LLM\nclass UserInfo(TypedDict):\n    name: str\n\n\n# Tool that allows agent to update user information (useful for chat applications)\n@tool\ndef save_user_info(user_info: UserInfo, runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Save user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    store = runtime.store\n    user_id = runtime.context.user_id\n    # Store data in the store (namespace, key, data)\n    store.put((\"users\",), user_id, dict(user_info))\n    return \"Successfully saved user info.\"\n\n\nagent: Runnable = create_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[save_user_info],\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"My name is John Smith\"}]},\n    # user_id passed in context to identify whose information is being updated\n    context=Context(user_id=\"user_123\"),\n)\n\n# You can access the store directly to get the value\nitem = store.get((\"users\",), \"user_123\")"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\nfrom typing_extensions import TypedDict\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# TypedDict defines the structure of user information for the LLM\nclass UserInfo(TypedDict):\n    name: str\n\n\n# Tool that allows agent to update user information (useful for chat applications)\n@tool\ndef save_user_info(user_info: UserInfo, runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Save user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    store = runtime.store\n    user_id = runtime.context.user_id\n    # Store data in the store (namespace, key, data)\n    store.put((\"users\",), user_id, dict(user_info))\n    return \"Successfully saved user info.\"\n\n\nagent: Runnable = create_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[save_user_info],\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"My name is John Smith\"}]},\n    # user_id passed in context to identify whose information is being updated\n    context=Context(user_id=\"user_123\"),\n)\n\n# You can access the store directly to get the value\nitem = store.get((\"users\",), \"user_123\")"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\nfrom typing_extensions import TypedDict\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# TypedDict defines the structure of user information for the LLM\nclass UserInfo(TypedDict):\n    name: str\n\n\n# Tool that allows agent to update user information (useful for chat applications)\n@tool\ndef save_user_info(user_info: UserInfo, runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Save user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    store = runtime.store\n    user_id = runtime.context.user_id\n    # Store data in the store (namespace, key, data)\n    store.put((\"users\",), user_id, dict(user_info))\n    return \"Successfully saved user info.\"\n\n\nagent: Runnable = create_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[save_user_info],\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"My name is John Smith\"}]},\n    # user_id passed in context to identify whose information is being updated\n    context=Context(user_id=\"user_123\"),\n)\n\n# You can access the store directly to get the value\nitem = store.get((\"users\",), \"user_123\")"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\nfrom typing_extensions import TypedDict\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# TypedDict defines the structure of user information for the LLM\nclass UserInfo(TypedDict):\n    name: str\n\n\n# Tool that allows agent to update user information (useful for chat applications)\n@tool\ndef save_user_info(user_info: UserInfo, runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Save user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    store = runtime.store\n    user_id = runtime.context.user_id\n    # Store data in the store (namespace, key, data)\n    store.put((\"users\",), user_id, dict(user_info))\n    return \"Successfully saved user info.\"\n\n\nagent: Runnable = create_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[save_user_info],\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"My name is John Smith\"}]},\n    # user_id passed in context to identify whose information is being updated\n    context=Context(user_id=\"user_123\"),\n)\n\n# You can access the store directly to get the value\nitem = store.get((\"users\",), \"user_123\")"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\nfrom typing_extensions import TypedDict\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# TypedDict defines the structure of user information for the LLM\nclass UserInfo(TypedDict):\n    name: str\n\n\n# Tool that allows agent to update user information (useful for chat applications)\n@tool\ndef save_user_info(user_info: UserInfo, runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Save user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    store = runtime.store\n    user_id = runtime.context.user_id\n    # Store data in the store (namespace, key, data)\n    store.put((\"users\",), user_id, dict(user_info))\n    return \"Successfully saved user info.\"\n\n\nagent: Runnable = create_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[save_user_info],\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"My name is John Smith\"}]},\n    # user_id passed in context to identify whose information is being updated\n    context=Context(user_id=\"user_123\"),\n)\n\n# You can access the store directly to get the value\nitem = store.get((\"users\",), \"user_123\")"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain.tools import ToolRuntime, tool\nfrom langchain_core.runnables import Runnable\nfrom langgraph.store.memory import InMemoryStore\nfrom typing_extensions import TypedDict\n\n# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.\nstore = InMemoryStore()\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\n# TypedDict defines the structure of user information for the LLM\nclass UserInfo(TypedDict):\n    name: str\n\n\n# Tool that allows agent to update user information (useful for chat applications)\n@tool\ndef save_user_info(user_info: UserInfo, runtime: ToolRuntime[Context]) -> str:\n    \"\"\"Save user info.\"\"\"\n    # Access the store - same as that provided to `create_agent`\n    assert runtime.store is not None\n    store = runtime.store\n    user_id = runtime.context.user_id\n    # Store data in the store (namespace, key, data)\n    store.put((\"users\",), user_id, dict(user_info))\n    return \"Successfully saved user info.\"\n\n\nagent: Runnable = create_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[save_user_info],\n    store=store,\n    context_schema=Context,\n)\n\n# Run the agent\nagent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"My name is John Smith\"}]},\n    # user_id passed in context to identify whose information is being updated\n    context=Context(user_id=\"user_123\"),\n)\n\n# You can access the store directly to get the value\nitem = store.get((\"users\",), \"user_123\")"
 }
]
```


    
    #### Tab: PostgreSQL


```python
from dataclasses import dataclass

from langchain.agents import create_agent
from langchain.tools import ToolRuntime, tool
from langchain_core.runnables import Runnable
from langgraph.store.postgres import PostgresStore  # type: ignore[import-not-found]
from typing_extensions import TypedDict

@dataclass
class Context:
    user_id: str

class UserInfo(TypedDict):
    name: str

@tool
def save_user_info(user_info: UserInfo, runtime: ToolRuntime[Context]) -> str:
    """Save user info."""
    assert runtime.store is not None
    runtime.store.put(("users",), runtime.context.user_id, dict(user_info))
    return "Successfully saved user info."

DB_URI = "postgresql://postgres:postgres@localhost:5432/postgres?sslmode=disable"

with PostgresStore.from_conn_string(DB_URI) as store:
    store.setup()
    agent: Runnable = create_agent(
        "claude-sonnet-4-6",
        tools=[save_user_info],
        store=store,
        context_schema=Context,
    )

    agent.invoke(
        {"messages": [{"role": "user", "content": "My name is John Smith"}]},
        context=Context(user_id="user_123"),
    )
```
