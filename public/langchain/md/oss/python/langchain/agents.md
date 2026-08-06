An agent is a model calling tools in a loop until a given task is complete.


![Core agent loop diagram](/langchain/images/oss/images/core_agent_loop.svg)


A harness is everything around that loop: the prompt, the tools, and any middleware that shapes the model's behavior.


> [!NOTE]
>
> **Agent = Model + Harness**
>
> The job of a harness: get the model the right context at the right time for the given task.


`create_agent` is a highly configurable harness. At its simplest, you can create one with:


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"google_genai:gemini-3.6-flash\", tools=tools)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"openai:gpt-5.5\", tools=tools)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"anthropic:claude-sonnet-4-6\", tools=tools)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"openrouter:z-ai/glm-5.2\", tools=tools)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"fireworks:accounts/fireworks/models/glm-5p2\", tools=tools)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"baseten:zai-org/GLM-5.2\", tools=tools)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"ollama:north-mini-code-1.0\", tools=tools)"
 }
]
```


Building on that, you can configure the basics directly with the `model=`, `tools=`, and `system_prompt=` parameters. For more advanced capabilities, extend the harness with [middleware](#configure-the-harness).

## Core components


![Agent model and harness components diagram](/langchain/images/oss/images/agent_model_harness.svg)


### Model

Pass a model identifier string (`"provider:model"`) or an initialized model instance to select the model for your agent. See [Models](lc:oss/python/langchain/models) for parameters, provider setup, and dynamic model selection.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"google_genai:gemini-3.6-flash\", tools=tools)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"openai:gpt-5.5\", tools=tools)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"anthropic:claude-sonnet-4-6\", tools=tools)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"openrouter:z-ai/glm-5.2\", tools=tools)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"fireworks:accounts/fireworks/models/glm-5p2\", tools=tools)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"baseten:zai-org/GLM-5.2\", tools=tools)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(model=\"ollama:north-mini-code-1.0\", tools=tools)"
 }
]
```


### Tools

To provide the agent with tools, pass any Python callable, LangChain tool, or tool dict. See [Tools](lc:oss/python/langchain/tools) for tool definition, context access, and dynamic tool selection.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for information.\"\"\"\n    return f\"Results for: {query}\"\n\n\nagent = create_agent(model=\"google_genai:gemini-3.6-flash\", tools=[search])"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for information.\"\"\"\n    return f\"Results for: {query}\"\n\n\nagent = create_agent(model=\"openai:gpt-5.5\", tools=[search])"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for information.\"\"\"\n    return f\"Results for: {query}\"\n\n\nagent = create_agent(model=\"anthropic:claude-sonnet-4-6\", tools=[search])"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for information.\"\"\"\n    return f\"Results for: {query}\"\n\n\nagent = create_agent(model=\"openrouter:z-ai/glm-5.2\", tools=[search])"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for information.\"\"\"\n    return f\"Results for: {query}\"\n\n\nagent = create_agent(model=\"fireworks:accounts/fireworks/models/glm-5p2\", tools=[search])"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for information.\"\"\"\n    return f\"Results for: {query}\"\n\n\nagent = create_agent(model=\"baseten:zai-org/GLM-5.2\", tools=[search])"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for information.\"\"\"\n    return f\"Results for: {query}\"\n\n\nagent = create_agent(model=\"ollama:north-mini-code-1.0\", tools=[search])"
 }
]
```


### System prompt

Shape how the agent approaches tasks. The system prompt parameter accepts a string or `SystemMessage`. For dynamic prompts at runtime, use [middleware](lc:oss/python/langchain/middleware/overview).


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "agent = create_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=tools,\n    system_prompt=\"You are a helpful assistant. Be concise and accurate.\",\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "agent = create_agent(\n    model=\"openai:gpt-5.5\",\n    tools=tools,\n    system_prompt=\"You are a helpful assistant. Be concise and accurate.\",\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "agent = create_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=tools,\n    system_prompt=\"You are a helpful assistant. Be concise and accurate.\",\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "agent = create_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=tools,\n    system_prompt=\"You are a helpful assistant. Be concise and accurate.\",\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "agent = create_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=tools,\n    system_prompt=\"You are a helpful assistant. Be concise and accurate.\",\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "agent = create_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=tools,\n    system_prompt=\"You are a helpful assistant. Be concise and accurate.\",\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "agent = create_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=tools,\n    system_prompt=\"You are a helpful assistant. Be concise and accurate.\",\n)"
 }
]
```


### Structured output

Return a validated schema from the agent using `response_format=`. See [Structured output](lc:oss/python/langchain/structured-output) for strategies and examples.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from pydantic import BaseModel\nfrom langchain.agents import create_agent\n\n\nclass Answer(BaseModel):\n    summary: str\n    confidence: float\n\n\nagent = create_agent(model=\"google_genai:gemini-3.6-flash\", tools=tools, response_format=Answer)\nresult = agent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"Summarize AI trends\"}]})\nresult[\"structured_response\"]  # Answer(summary=..., confidence=...)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from pydantic import BaseModel\nfrom langchain.agents import create_agent\n\n\nclass Answer(BaseModel):\n    summary: str\n    confidence: float\n\n\nagent = create_agent(model=\"openai:gpt-5.5\", tools=tools, response_format=Answer)\nresult = agent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"Summarize AI trends\"}]})\nresult[\"structured_response\"]  # Answer(summary=..., confidence=...)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from pydantic import BaseModel\nfrom langchain.agents import create_agent\n\n\nclass Answer(BaseModel):\n    summary: str\n    confidence: float\n\n\nagent = create_agent(model=\"anthropic:claude-sonnet-4-6\", tools=tools, response_format=Answer)\nresult = agent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"Summarize AI trends\"}]})\nresult[\"structured_response\"]  # Answer(summary=..., confidence=...)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from pydantic import BaseModel\nfrom langchain.agents import create_agent\n\n\nclass Answer(BaseModel):\n    summary: str\n    confidence: float\n\n\nagent = create_agent(model=\"openrouter:z-ai/glm-5.2\", tools=tools, response_format=Answer)\nresult = agent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"Summarize AI trends\"}]})\nresult[\"structured_response\"]  # Answer(summary=..., confidence=...)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from pydantic import BaseModel\nfrom langchain.agents import create_agent\n\n\nclass Answer(BaseModel):\n    summary: str\n    confidence: float\n\n\nagent = create_agent(model=\"fireworks:accounts/fireworks/models/glm-5p2\", tools=tools, response_format=Answer)\nresult = agent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"Summarize AI trends\"}]})\nresult[\"structured_response\"]  # Answer(summary=..., confidence=...)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from pydantic import BaseModel\nfrom langchain.agents import create_agent\n\n\nclass Answer(BaseModel):\n    summary: str\n    confidence: float\n\n\nagent = create_agent(model=\"baseten:zai-org/GLM-5.2\", tools=tools, response_format=Answer)\nresult = agent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"Summarize AI trends\"}]})\nresult[\"structured_response\"]  # Answer(summary=..., confidence=...)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from pydantic import BaseModel\nfrom langchain.agents import create_agent\n\n\nclass Answer(BaseModel):\n    summary: str\n    confidence: float\n\n\nagent = create_agent(model=\"ollama:north-mini-code-1.0\", tools=tools, response_format=Answer)\nresult = agent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"Summarize AI trends\"}]})\nresult[\"structured_response\"]  # Answer(summary=..., confidence=...)"
 }
]
```


## Invocation


> [!TIP]
>
> Trace each step of this loop, debug tool calls, and evaluate agent outputs with [LangSmith](https://smith.langchain.com). Follow the [tracing quickstart](lc:langsmith/trace-with-langchain) to get set up. We recommend you also set up [LangSmith Engine](lc:langsmith/engine) which monitors your traces, detects issues, and proposes fixes.


You can invoke an agent with a message. Behind the scenes that passes an update to the agent's [`State`](lc:oss/python/langgraph/graph-api#state). All agents include a [sequence of messages](lc:oss/python/langgraph/use-graph-api#messagesstate) in their state; to invoke the agent, pass a new message along with a `thread_id` so the agent can persist and resume conversation history:


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": str(uuid7())}}\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config=config,\n)\n\n# A follow-up turn on the same conversation: reuse the same thread_id to keep history\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What about tomorrow?\"}]},\n    config=config,\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": str(uuid7())}}\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config=config,\n)\n\n# A follow-up turn on the same conversation: reuse the same thread_id to keep history\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What about tomorrow?\"}]},\n    config=config,\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": str(uuid7())}}\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config=config,\n)\n\n# A follow-up turn on the same conversation: reuse the same thread_id to keep history\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What about tomorrow?\"}]},\n    config=config,\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": str(uuid7())}}\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config=config,\n)\n\n# A follow-up turn on the same conversation: reuse the same thread_id to keep history\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What about tomorrow?\"}]},\n    config=config,\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": str(uuid7())}}\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config=config,\n)\n\n# A follow-up turn on the same conversation: reuse the same thread_id to keep history\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What about tomorrow?\"}]},\n    config=config,\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": str(uuid7())}}\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config=config,\n)\n\n# A follow-up turn on the same conversation: reuse the same thread_id to keep history\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What about tomorrow?\"}]},\n    config=config,\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": str(uuid7())}}\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config=config,\n)\n\n# A follow-up turn on the same conversation: reuse the same thread_id to keep history\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What about tomorrow?\"}]},\n    config=config,\n)"
 }
]
```


> [!NOTE]
>
> Persisting conversation history with `thread_id` requires the agent to be configured with a [checkpointer](lc:oss/python/langchain/long-term-memory). When deployed on [LangSmith](lc:langsmith/deployment), a checkpointer is provisioned automatically. Locally, pass one explicitly, for example `create_agent(..., checkpointer=InMemorySaver())`.


If you also need to pass per-run configuration (such as a user ID, API keys, or feature flags) to tools and middleware, pass it as `context` alongside `config`. Define the shape of that data with `context_schema` and access it through `runtime.context`:


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\nagent = create_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[],\n    context_schema=Context,\n    checkpointer=InMemorySaver(),\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=Context(user_id=\"user-123\"),\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\nagent = create_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[],\n    context_schema=Context,\n    checkpointer=InMemorySaver(),\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=Context(user_id=\"user-123\"),\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\nagent = create_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[],\n    context_schema=Context,\n    checkpointer=InMemorySaver(),\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=Context(user_id=\"user-123\"),\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\nagent = create_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[],\n    context_schema=Context,\n    checkpointer=InMemorySaver(),\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=Context(user_id=\"user-123\"),\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\nagent = create_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[],\n    context_schema=Context,\n    checkpointer=InMemorySaver(),\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=Context(user_id=\"user-123\"),\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\nagent = create_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[],\n    context_schema=Context,\n    checkpointer=InMemorySaver(),\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=Context(user_id=\"user-123\"),\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from dataclasses import dataclass\n\nfrom langchain.agents import create_agent\nfrom langchain_core.utils.uuid import uuid7\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\n@dataclass\nclass Context:\n    user_id: str\n\n\nagent = create_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[],\n    context_schema=Context,\n    checkpointer=InMemorySaver(),\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]},\n    config={\"configurable\": {\"thread_id\": str(uuid7())}},\n    context=Context(user_id=\"user-123\"),\n)"
 }
]
```


`thread_id` scopes the *conversation* (message history, checkpoints), while `context` carries *per-run* data your tools and middleware read at invocation time. Both are commonly passed together. See [tool context](lc:oss/python/langchain/tools#context) and [Runtime](lc:oss/python/langchain/runtime) for more.

## Streaming

`invoke` returns the final response at the end of a run. If an agent executes multiple tool calls, users often need progress updates before completion. Use streaming to surface intermediate messages and tool activity as they happen.


```python
from langchain.messages import AIMessage, HumanMessage

stream = agent.stream_events(
    {"messages": [{"role": "user", "content": "Search for AI news and summarize the findings"}]},
    version="v3",
)
for snapshot in stream.values:
    # Each snapshot contains the full state at that point
    latest_message = snapshot["messages"][-1]
    if latest_message.content:
        if isinstance(latest_message, HumanMessage):
            print(f"User: {latest_message.content}")
        elif isinstance(latest_message, AIMessage):
            print(f"Agent: {latest_message.content}")
    elif latest_message.tool_calls:
        print(f"Calling tools: {[tc['name'] for tc in latest_message.tool_calls]}")
```


> [!TIP]
>
> For streaming modes, event types, and UI patterns, see [Streaming](lc:oss/python/langchain/streaming).


## Configure the harness

`create_agent` is highly extensible. Middleware is the primitive for customization: each piece handles one concern, hooks into the agent loop at the right moment, and composes freely with any other. Take exactly what your use case needs and skip the rest.

Common patterns are prebuilt as first-class middleware. You can build anything else as [custom middleware](lc:oss/python/langchain/middleware/custom).


![Agent harness capabilities by category](/langchain/images/oss/images/agent_harness_capabilities.svg)


As agents take on complex work, they need support across a few key areas. The middleware ecosystem provides:

  ### [Execution environment](#)
Tools, filesystem, sandboxes, and code execution

  ### [Context management](#)
Summarization, memory, skills, and prompt caching

  ### [Planning and delegation](#)
Todo lists and subagents for parallel, isolated work

  ### [Fault tolerance](#)
Retries, fallbacks, and call limits

  ### [Guardrails](#)
PII detection and content controls

  ### [Steering](#)
Human-in-the-loop approval before high-impact actions


> [!TIP]
>
> `create_deep_agent` pre-assembles this stack for long-running coding and research tasks (filesystem, summarization, subagents, and prompt caching included by default). See [Deep Agents](https://docs.langchain.com/oss/deepagents/harness) for the full prebuilt harness.


### Execution environment

Agents are especially useful when they can take action rather than just generate text. The execution environment gives the agent a workspace: tools it can call, a filesystem for reading and writing files across turns, and code execution for running scripts or shell commands.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\n\nagent = create_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[search],\n    middleware=[FilesystemMiddleware(backend=StateBackend())],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\n\nagent = create_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[search],\n    middleware=[FilesystemMiddleware(backend=StateBackend())],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\n\nagent = create_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[search],\n    middleware=[FilesystemMiddleware(backend=StateBackend())],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\n\nagent = create_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[search],\n    middleware=[FilesystemMiddleware(backend=StateBackend())],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\n\nagent = create_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[search],\n    middleware=[FilesystemMiddleware(backend=StateBackend())],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\n\nagent = create_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[search],\n    middleware=[FilesystemMiddleware(backend=StateBackend())],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\n\nagent = create_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[search],\n    middleware=[FilesystemMiddleware(backend=StateBackend())],\n)"
 }
]
```


See `FilesystemMiddleware`, [Sandboxes](lc:oss/python/deepagents/sandboxes), [Interpreters](lc:oss/python/deepagents/interpreters).

### Context management

Every model call has a fixed context window. As an agent runs, that window fills with accumulating history, tool results, and intermediate steps. Summarization compresses history before overflow hits; memory loads persistent instructions at startup so knowledge carries across sessions; skills surface domain knowledge on demand rather than loading everything upfront.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware, MemoryMiddleware, SkillsMiddleware, SummarizationMiddleware\n\nbackend = StateBackend()\nmodel=\"google_genai:gemini-3.6-flash\"\n\nagent = create_agent(\n    model=model,\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        SummarizationMiddleware(model=model, backend=backend),\n        MemoryMiddleware(backend=backend, sources=[\"./AGENTS.md\"]),\n        SkillsMiddleware(backend=backend, sources=[\"./skills/\"]),\n    ],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware, MemoryMiddleware, SkillsMiddleware, SummarizationMiddleware\n\nbackend = StateBackend()\nmodel=\"openai:gpt-5.5\"\n\nagent = create_agent(\n    model=model,\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        SummarizationMiddleware(model=model, backend=backend),\n        MemoryMiddleware(backend=backend, sources=[\"./AGENTS.md\"]),\n        SkillsMiddleware(backend=backend, sources=[\"./skills/\"]),\n    ],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware, MemoryMiddleware, SkillsMiddleware, SummarizationMiddleware\n\nbackend = StateBackend()\nmodel=\"anthropic:claude-sonnet-4-6\"\n\nagent = create_agent(\n    model=model,\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        SummarizationMiddleware(model=model, backend=backend),\n        MemoryMiddleware(backend=backend, sources=[\"./AGENTS.md\"]),\n        SkillsMiddleware(backend=backend, sources=[\"./skills/\"]),\n    ],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware, MemoryMiddleware, SkillsMiddleware, SummarizationMiddleware\n\nbackend = StateBackend()\nmodel=\"openrouter:z-ai/glm-5.2\"\n\nagent = create_agent(\n    model=model,\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        SummarizationMiddleware(model=model, backend=backend),\n        MemoryMiddleware(backend=backend, sources=[\"./AGENTS.md\"]),\n        SkillsMiddleware(backend=backend, sources=[\"./skills/\"]),\n    ],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware, MemoryMiddleware, SkillsMiddleware, SummarizationMiddleware\n\nbackend = StateBackend()\nmodel=\"fireworks:accounts/fireworks/models/glm-5p2\"\n\nagent = create_agent(\n    model=model,\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        SummarizationMiddleware(model=model, backend=backend),\n        MemoryMiddleware(backend=backend, sources=[\"./AGENTS.md\"]),\n        SkillsMiddleware(backend=backend, sources=[\"./skills/\"]),\n    ],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware, MemoryMiddleware, SkillsMiddleware, SummarizationMiddleware\n\nbackend = StateBackend()\nmodel=\"baseten:zai-org/GLM-5.2\"\n\nagent = create_agent(\n    model=model,\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        SummarizationMiddleware(model=model, backend=backend),\n        MemoryMiddleware(backend=backend, sources=[\"./AGENTS.md\"]),\n        SkillsMiddleware(backend=backend, sources=[\"./skills/\"]),\n    ],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware, MemoryMiddleware, SkillsMiddleware, SummarizationMiddleware\n\nbackend = StateBackend()\nmodel=\"ollama:north-mini-code-1.0\"\n\nagent = create_agent(\n    model=model,\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        SummarizationMiddleware(model=model, backend=backend),\n        MemoryMiddleware(backend=backend, sources=[\"./AGENTS.md\"]),\n        SkillsMiddleware(backend=backend, sources=[\"./skills/\"]),\n    ],\n)"
 }
]
```


See `SummarizationMiddleware`, `MemoryMiddleware`, [Skills](lc:oss/python/langchain/multi-agent/skills), [Context engineering](lc:oss/python/deepagents/context-engineering).

### Planning and delegation

Complex tasks often exceed what one context window can handle. Delegation lets the main agent break work into pieces, hand them to subagents that each run in their own isolated context, and stay focused on coordination rather than execution. Work can run in parallel; the main agent's context stays clean.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\nfrom deepagents.middleware.subagents import SubAgentMiddleware\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import TodoListMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nbackend = StateBackend()\n\nagent = create_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        TodoListMiddleware(),\n        SubAgentMiddleware(\n            backend=backend,\n            subagents=[\n                {\n                    \"name\": \"researcher\",\n                    \"description\": \"Searches and returns a structured summary.\",\n                    \"system_prompt\": \"Use the search tool to research the question and summarize key points.\",\n                    \"tools\": [search],\n                    \"model\": \"anthropic:claude-sonnet-4-6\",\n                    \"middleware\": [],\n                }\n            ],\n        ),\n    ],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\nfrom deepagents.middleware.subagents import SubAgentMiddleware\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import TodoListMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nbackend = StateBackend()\n\nagent = create_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        TodoListMiddleware(),\n        SubAgentMiddleware(\n            backend=backend,\n            subagents=[\n                {\n                    \"name\": \"researcher\",\n                    \"description\": \"Searches and returns a structured summary.\",\n                    \"system_prompt\": \"Use the search tool to research the question and summarize key points.\",\n                    \"tools\": [search],\n                    \"model\": \"anthropic:claude-sonnet-4-6\",\n                    \"middleware\": [],\n                }\n            ],\n        ),\n    ],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\nfrom deepagents.middleware.subagents import SubAgentMiddleware\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import TodoListMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nbackend = StateBackend()\n\nagent = create_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        TodoListMiddleware(),\n        SubAgentMiddleware(\n            backend=backend,\n            subagents=[\n                {\n                    \"name\": \"researcher\",\n                    \"description\": \"Searches and returns a structured summary.\",\n                    \"system_prompt\": \"Use the search tool to research the question and summarize key points.\",\n                    \"tools\": [search],\n                    \"model\": \"anthropic:claude-sonnet-4-6\",\n                    \"middleware\": [],\n                }\n            ],\n        ),\n    ],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\nfrom deepagents.middleware.subagents import SubAgentMiddleware\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import TodoListMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nbackend = StateBackend()\n\nagent = create_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        TodoListMiddleware(),\n        SubAgentMiddleware(\n            backend=backend,\n            subagents=[\n                {\n                    \"name\": \"researcher\",\n                    \"description\": \"Searches and returns a structured summary.\",\n                    \"system_prompt\": \"Use the search tool to research the question and summarize key points.\",\n                    \"tools\": [search],\n                    \"model\": \"anthropic:claude-sonnet-4-6\",\n                    \"middleware\": [],\n                }\n            ],\n        ),\n    ],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\nfrom deepagents.middleware.subagents import SubAgentMiddleware\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import TodoListMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nbackend = StateBackend()\n\nagent = create_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        TodoListMiddleware(),\n        SubAgentMiddleware(\n            backend=backend,\n            subagents=[\n                {\n                    \"name\": \"researcher\",\n                    \"description\": \"Searches and returns a structured summary.\",\n                    \"system_prompt\": \"Use the search tool to research the question and summarize key points.\",\n                    \"tools\": [search],\n                    \"model\": \"anthropic:claude-sonnet-4-6\",\n                    \"middleware\": [],\n                }\n            ],\n        ),\n    ],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\nfrom deepagents.middleware.subagents import SubAgentMiddleware\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import TodoListMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nbackend = StateBackend()\n\nagent = create_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        TodoListMiddleware(),\n        SubAgentMiddleware(\n            backend=backend,\n            subagents=[\n                {\n                    \"name\": \"researcher\",\n                    \"description\": \"Searches and returns a structured summary.\",\n                    \"system_prompt\": \"Use the search tool to research the question and summarize key points.\",\n                    \"tools\": [search],\n                    \"model\": \"anthropic:claude-sonnet-4-6\",\n                    \"middleware\": [],\n                }\n            ],\n        ),\n    ],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents.backends import StateBackend\nfrom deepagents.middleware import FilesystemMiddleware\nfrom deepagents.middleware.subagents import SubAgentMiddleware\nfrom langchain.agents import create_agent\nfrom langchain.agents.middleware import TodoListMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nbackend = StateBackend()\n\nagent = create_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[search],\n    middleware=[\n        FilesystemMiddleware(backend=backend),\n        TodoListMiddleware(),\n        SubAgentMiddleware(\n            backend=backend,\n            subagents=[\n                {\n                    \"name\": \"researcher\",\n                    \"description\": \"Searches and returns a structured summary.\",\n                    \"system_prompt\": \"Use the search tool to research the question and summarize key points.\",\n                    \"tools\": [search],\n                    \"model\": \"anthropic:claude-sonnet-4-6\",\n                    \"middleware\": [],\n                }\n            ],\n        ),\n    ],\n)"
 }
]
```


See [Subagents](lc:oss/python/langchain/multi-agent/subagents).

### Name your agent

Optionally use an identifier for the agent. This is especially useful when embedding the agent as a subgraph in [multi-agent](lc:oss/python/langchain/multi-agent/index) systems.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "agent = create_agent(model=\"google_genai:gemini-3.6-flash\", tools=tools, name=\"research_assistant\")"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "agent = create_agent(model=\"openai:gpt-5.5\", tools=tools, name=\"research_assistant\")"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "agent = create_agent(model=\"anthropic:claude-sonnet-4-6\", tools=tools, name=\"research_assistant\")"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "agent = create_agent(model=\"openrouter:z-ai/glm-5.2\", tools=tools, name=\"research_assistant\")"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "agent = create_agent(model=\"fireworks:accounts/fireworks/models/glm-5p2\", tools=tools, name=\"research_assistant\")"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "agent = create_agent(model=\"baseten:zai-org/GLM-5.2\", tools=tools, name=\"research_assistant\")"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "agent = create_agent(model=\"ollama:north-mini-code-1.0\", tools=tools, name=\"research_assistant\")"
 }
]
```


### Fault tolerance

Agents in production encounter failures that rarely appear in development: rate limits, model timeouts, transient API errors. Fault tolerance middleware handles these at the infrastructure level so your tools and business logic don't need try/catch around every call.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import ModelRetryMiddleware, ToolRetryMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[search],\n    middleware=[\n        ModelRetryMiddleware(max_retries=3),\n        ToolRetryMiddleware(max_retries=2),\n    ],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import ModelRetryMiddleware, ToolRetryMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[search],\n    middleware=[\n        ModelRetryMiddleware(max_retries=3),\n        ToolRetryMiddleware(max_retries=2),\n    ],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import ModelRetryMiddleware, ToolRetryMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[search],\n    middleware=[\n        ModelRetryMiddleware(max_retries=3),\n        ToolRetryMiddleware(max_retries=2),\n    ],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import ModelRetryMiddleware, ToolRetryMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[search],\n    middleware=[\n        ModelRetryMiddleware(max_retries=3),\n        ToolRetryMiddleware(max_retries=2),\n    ],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import ModelRetryMiddleware, ToolRetryMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[search],\n    middleware=[\n        ModelRetryMiddleware(max_retries=3),\n        ToolRetryMiddleware(max_retries=2),\n    ],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import ModelRetryMiddleware, ToolRetryMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[search],\n    middleware=[\n        ModelRetryMiddleware(max_retries=3),\n        ToolRetryMiddleware(max_retries=2),\n    ],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import ModelRetryMiddleware, ToolRetryMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[search],\n    middleware=[\n        ModelRetryMiddleware(max_retries=3),\n        ToolRetryMiddleware(max_retries=2),\n    ],\n)"
 }
]
```


See `ModelRetryMiddleware`, `ToolRetryMiddleware`, [Prebuilt middleware](lc:oss/python/langchain/middleware/built-in).


### Guardrails

Some policies can't live in a prompt—they need to be enforced deterministically regardless of what the model does. Guardrails intercept data as it flows through the agent loop, applying compliance rules or content policies before tool results reach the model's context.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import PIIMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[search],\n    middleware=[PIIMiddleware(\"email\")],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import PIIMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[search],\n    middleware=[PIIMiddleware(\"email\")],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import PIIMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[search],\n    middleware=[PIIMiddleware(\"email\")],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import PIIMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[search],\n    middleware=[PIIMiddleware(\"email\")],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import PIIMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[search],\n    middleware=[PIIMiddleware(\"email\")],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import PIIMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[search],\n    middleware=[PIIMiddleware(\"email\")],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import PIIMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[search],\n    middleware=[PIIMiddleware(\"email\")],\n)"
 }
]
```


See `PIIMiddleware`, [Prebuilt middleware](lc:oss/python/langchain/middleware/built-in).


### Steering

Full autonomy isn't always appropriate. Steering lets you place humans at specific decision points—before destructive writes, expensive API calls, or anything requiring judgment—without restructuring your agent. The agent pauses and waits; a human approves, edits, or rejects; execution continues.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import HumanInTheLoopMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[search],\n    middleware=[HumanInTheLoopMiddleware(interrupt_on={\"write_file\": True})],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import HumanInTheLoopMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[search],\n    middleware=[HumanInTheLoopMiddleware(interrupt_on={\"write_file\": True})],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import HumanInTheLoopMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[search],\n    middleware=[HumanInTheLoopMiddleware(interrupt_on={\"write_file\": True})],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import HumanInTheLoopMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[search],\n    middleware=[HumanInTheLoopMiddleware(interrupt_on={\"write_file\": True})],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import HumanInTheLoopMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[search],\n    middleware=[HumanInTheLoopMiddleware(interrupt_on={\"write_file\": True})],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import HumanInTheLoopMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[search],\n    middleware=[HumanInTheLoopMiddleware(interrupt_on={\"write_file\": True})],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import HumanInTheLoopMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for a query and return a short summary.\"\"\"\n    return f\"Search results for: {query}\"\n\n\nagent = create_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[search],\n    middleware=[HumanInTheLoopMiddleware(interrupt_on={\"write_file\": True})],\n)"
 }
]
```


See `HumanInTheLoopMiddleware`, [Human-in-the-loop](lc:oss/python/langchain/human-in-the-loop).


### Middleware resources

  ### [Middleware overview](#)
How the middleware stack works and when hooks fire

  ### [Prebuilt middleware](#)
Full reference with configuration examples

  ### [Custom middleware](#)
Write your own hooks for business logic, PII scrubbing, and more
