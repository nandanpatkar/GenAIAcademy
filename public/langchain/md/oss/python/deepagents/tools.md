Deep Agents can call any tool you define, any [LangChain tool](https://python.langchain.com/docs/concepts/tools/), and tools from any [MCP server](#mcp-tools).
Pass them to `create_deep_agent` via the `tools=` parameter alongside the [built-in harness tools](lc:oss/python/deepagents/overview#execution-environment) for file management and subagent spawning.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[search, fetch_url, run_query],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[search, fetch_url, run_query],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[search, fetch_url, run_query],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[search, fetch_url, run_query],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[search, fetch_url, run_query],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[search, fetch_url, run_query],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[search, fetch_url, run_query],\n)"
 }
]
```


## Custom tools

Pass any callable, such as plain functions, LangChain `@tool`-decorated functions, or tool dicts—directly to `tools=`.
Deep Agents infers the tool schema from the function signature and docstring, so you don't need to define a separate schema in most cases.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[internet_search],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[internet_search],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[internet_search],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[internet_search],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[internet_search],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[internet_search],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[internet_search],\n)"
 }
]
```


For full details on defining and using LangChain tools (tool dicts, `StructuredTool`, return types, error handling, and more), see [Tools](lc:oss/python/langchain/tools).

## MCP tools


> [!NOTE]
>
> Deep Agents fully support [Model Context Protocol (MCP)](lc:oss/python/langchain/mcp), the open standard for connecting agents to external services. Load tools from any MCP server and pass them directly to `create_deep_agent`.


MCP is an open protocol that lets agents connect to a growing ecosystem of servers—databases, APIs, file systems, browsers, and more—through a standard interface. Instead of writing custom integration code for each service, you point Deep Agents at an MCP server and it gets all the tools that server exposes.

Install `langchain-mcp-adapters` to connect to MCP servers:

```bash
pip install langchain-mcp-adapters
```


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    client = MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    )\n    tools = await client.get_tools()\n\n    agent = create_deep_agent(\n        model=\"google_genai:gemini-3.6-flash\",\n        tools=tools,\n    )\n\n    result = await agent.ainvoke(\n        {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n        config={\"configurable\": {\"thread_id\": \"1\"}},\n    )\n\n\nasyncio.run(main())"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    client = MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    )\n    tools = await client.get_tools()\n\n    agent = create_deep_agent(\n        model=\"openai:gpt-5.5\",\n        tools=tools,\n    )\n\n    result = await agent.ainvoke(\n        {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n        config={\"configurable\": {\"thread_id\": \"1\"}},\n    )\n\n\nasyncio.run(main())"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    client = MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    )\n    tools = await client.get_tools()\n\n    agent = create_deep_agent(\n        model=\"anthropic:claude-sonnet-4-6\",\n        tools=tools,\n    )\n\n    result = await agent.ainvoke(\n        {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n        config={\"configurable\": {\"thread_id\": \"1\"}},\n    )\n\n\nasyncio.run(main())"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    client = MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    )\n    tools = await client.get_tools()\n\n    agent = create_deep_agent(\n        model=\"openrouter:z-ai/glm-5.2\",\n        tools=tools,\n    )\n\n    result = await agent.ainvoke(\n        {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n        config={\"configurable\": {\"thread_id\": \"1\"}},\n    )\n\n\nasyncio.run(main())"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    client = MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    )\n    tools = await client.get_tools()\n\n    agent = create_deep_agent(\n        model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n        tools=tools,\n    )\n\n    result = await agent.ainvoke(\n        {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n        config={\"configurable\": {\"thread_id\": \"1\"}},\n    )\n\n\nasyncio.run(main())"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    client = MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    )\n    tools = await client.get_tools()\n\n    agent = create_deep_agent(\n        model=\"baseten:zai-org/GLM-5.2\",\n        tools=tools,\n    )\n\n    result = await agent.ainvoke(\n        {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n        config={\"configurable\": {\"thread_id\": \"1\"}},\n    )\n\n\nasyncio.run(main())"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    client = MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    )\n    tools = await client.get_tools()\n\n    agent = create_deep_agent(\n        model=\"ollama:north-mini-code-1.0\",\n        tools=tools,\n    )\n\n    result = await agent.ainvoke(\n        {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n        config={\"configurable\": {\"thread_id\": \"1\"}},\n    )\n\n\nasyncio.run(main())"
 }
]
```


For detailed configuration options—including stdio servers, OAuth authentication, tool filtering, and stateful sessions—see the full [MCP guide](lc:oss/python/langchain/mcp).

## Built-in harness tools

In addition to the tools you provide, every Deep Agent comes with a built-in set of tools from the harness:


| Tool | Description |
| ---- | ----------- |
| `ls` | List files in a directory. |
| `read_file` | Read file contents (with pagination and multimodal support). |
| `write_file` | Create a new file, or overwrite an existing one. |
| `edit_file` | Perform exact string replacements in files. |
| `delete` | Delete a file, or a directory and its contents recursively. The `delete` tool requires `deepagents>=0.7`. |
| `glob` | Find files matching a glob pattern. |
| `grep` | Search file contents. |
| `execute` | Run shell commands (sandbox backends only). |
| `task` | Spawn a subagent to handle a delegated task. |


To add structured task planning with `write_todos`, opt in with `TodoListMiddleware`. See [Task planning](lc:oss/python/deepagents/overview#task-planning).

For a full breakdown of what each built-in tool does, see [Harness overview](lc:oss/python/deepagents/overview#execution-environment).

## Multimodal tool outputs

Custom tools can return plain text or [standard content blocks](lc:oss/python/langchain/messages#standard-content-blocks) (text, images, audio, video, and files) when the selected model supports multimodal tool results. The built-in `read_file` tool also returns multimodal blocks for supported non-text file types.

Return a string for text-only results, or an ordered list of content blocks for text plus media or interleaved multimodal output. See [Multimodal](lc:oss/python/deepagents/multimodal) and [Tool return values](lc:oss/python/langchain/tools#return-multimodal-content) for examples and context-compression considerations.
