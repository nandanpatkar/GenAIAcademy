Tools are the primary mechanism for extending agent capabilities, enabling them to perform actions beyond simple text generation. Tools allow agents to interact with external systems, access data, and manipulate their environment.

Strands Agents Tools is a community-driven project that provides a powerful set of tools for your agents to use. For more information, see [Strands Agents Tools](lc:user-guide/concepts/tools/community-tools-package).

> [!WARNING] Tool Security
>
> All tools, whether custom, community-provided, or included in the Strands tools package, execute code on behalf of your agent with the permissions of the host process. Under the shared responsibility model, you should audit each tool’s behavior (file access patterns, network calls, shell execution) and ensure it is appropriate for your deployment environment and threat model. See [Responsible AI](lc:user-guide/safety-security/responsible-ai) for more details.

## Adding Tools to Agents

Tools are passed to agents during initialization or at runtime, making them available for use throughout the agent’s lifecycle. Once loaded, the agent can use these tools in response to user requests:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands_tools import calculator, file_read, shell\n\n# Add tools to our agent\nagent = Agent(\n    tools=[calculator, file_read, shell]\n)\n\n# Agent will automatically determine when to use the calculator tool\nagent(\"What is 42 ^ 9\")\n\nprint(\"\\n\\n\")  # Print new lines\n\n# Agent will use the shell and file reader tool when appropriate\nagent(\"Show me the contents of a single file in this directory\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst agent = new Agent({\n  tools: [fileEditor],\n})\n\n// Agent will use the file_editor tool when appropriate\nawait agent.invoke('Show me the contents of a single file in this directory')\n```"
 }
]
```

We can see which tools are loaded in our agent:

```sa-tabs
[
 {
  "label": "Python",
  "body": "In Python, you can access `agent.tool_names` for a list of tool names, and `agent.tool_registry.get_all_tools_config()` for a JSON representation including descriptions and input parameters:\n\n```python\nprint(agent.tool_names)\n\nprint(agent.tool_registry.get_all_tools_config())\n```"
 },
 {
  "label": "TypeScript",
  "body": "In TypeScript, you can access the tools array directly:\n\n```typescript\n// Access all tools\nconsole.log(agent.tools)\n```"
 }
]
```

## Loading Tools from Files

```sa-tabs
[
 {
  "label": "Python",
  "body": "Tools can also be loaded by passing a file path to our agents during initialization:\n\n```python\nagent = Agent(tools=[\"/path/to/my_tool.py\"])\n```"
 },
 {
  "label": "TypeScript",
  "body": "```ts\n// Not supported in TypeScript\n```"
 }
]
```

### Auto-loading and reloading tools

```sa-tabs
[
 {
  "label": "Python",
  "body": "Tools placed in your current working directory `./tools/` can be automatically loaded at agent initialization, and automatically reloaded when modified. This can be really useful when developing and debugging tools: simply modify the tool code and any agents using that tool will reload it to use the latest modifications!\n\nAutomatic loading and reloading of tools in the `./tools/` directory is disabled by default. To enable this behavior, set `load_tools_from_directory=True` during `Agent` initialization:\n\n```python\nfrom strands import Agent\n\nagent = Agent(load_tools_from_directory=True)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```ts\n// Not supported in TypeScript\n```"
 }
]
```

> [!NOTE] Tool Loading Implications
>
> When enabling automatic tool loading, any Python file placed in the `./tools/` directory will be executed by the agent. Under the shared responsibility model, it is your responsibility to ensure that only safe, trusted code is written to the tool loading directory, as the agent will automatically pick up and execute any tools found there.

## Using Tools

Tools can be invoked in two primary ways.

Agents have context about tool calls and their results as part of conversation history. See [Using State in Tools](lc:user-guide/concepts/agents/state#using-state-in-tools) for more information.

### Natural Language Invocation

The most common way agents use tools is through natural language requests. The agent determines when and how to invoke tools based on the user’s input:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\n# Agent decides when to use tools based on the request\nagent(\"Please read the file at /path/to/file.txt\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst agent = new Agent({\n  tools: [notebook],\n})\n\n// Agent decides when to use tools based on the request\nawait agent.invoke('Please read the default notebook')\n```"
 }
]
```

### Direct Method Calls

Tools can be invoked programmatically in addition to natural language invocation.

```sa-tabs
[
 {
  "label": "Python",
  "body": "Every tool added to an agent becomes a method accessible directly on the agent object:\n\n```python\n# Directly invoke a tool as a method\nresult = agent.tool.file_read(path=\"/path/to/file.txt\", mode=\"view\")\n```\n\nWhen calling tools directly as methods, always use keyword arguments - positional arguments are *not* supported:\n\n```python\n# This will NOT work - positional arguments are not supported\nresult = agent.tool.file_read(\"/path/to/file.txt\", \"view\")  # \u274c Don't do this\n```\n\nIf a tool name contains hyphens, you can invoke the tool using underscores instead:\n\n```python\n# Directly invoke a tool named \"read-all\"\nresult = agent.tool.read_all(path=\"/path/to/file.txt\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "Every tool added to an agent is accessible as a method on `agent.tool`. Call `.invoke(input)` for the result, or `.stream(input)` to consume intermediate events:\n\n```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { notebook } from '@strands-agents/sdk/vended-tools/notebook'\n\nconst agent = new Agent({\n  tools: [notebook],\n})\n\n// Call a tool by name. Returns a ToolResultBlock with `status`\n// ('success' | 'error') and `content` blocks.\nconst result = await agent.tool.notebook!.invoke({\n  mode: 'read',\n  name: 'default',\n})\nconsole.log(result.status, result.content)\n\n// Stream intermediate events; the generator returns the final result.\nfor await (const event of agent.tool.notebook!.stream({\n  mode: 'read',\n  name: 'default',\n})) {\n  console.log('progress:', event)\n}\n\n// Skip recording the call in conversation history.\nawait agent.tool.notebook!.invoke(\n  { mode: 'read', name: 'default' },\n  { recordDirectToolCall: false }\n)\n```\n\nNote `agent.tool` (singular) is the direct-call accessor; `agent.tools` (plural) is the array of registered tools.\n\nThe accessor resolves names by exact match first, then with underscores substituted for hyphens, then case-insensitively. `agent.tool.read_all` resolves to a tool registered as `read-all`. Calling a name that doesn\u2019t resolve throws `ToolNotFoundError`.\n\nBy default, direct calls are recorded in the agent\u2019s message history. Pass `{ recordDirectToolCall: false }` to skip recording. This is required when calling tools during an active agent invocation (otherwise `ConcurrentInvocationError` is thrown), and useful for side-effect tools whose output should stay out of conversation context."
 }
]
```

## Tool Executors

When models return multiple tool requests, you can control whether they execute concurrently or sequentially. Both SDKs default to concurrent execution.

```sa-tabs
[
 {
  "label": "Python",
  "body": "Agents use concurrent execution by default, but you can specify sequential execution for cases where order matters:\n\n```python\nfrom strands import Agent\nfrom strands.tools.executors import SequentialToolExecutor\n\n# Concurrent execution (default)\nagent = Agent(tools=[weather_tool, time_tool])\nagent(\"What is the weather and time in New York?\")\n\n# Sequential execution\nagent = Agent(\n    tool_executor=SequentialToolExecutor(),\n    tools=[screenshot_tool, email_tool]\n)\nagent(\"Take a screenshot and email it to my friend\")\n```\n\nFor more details, see [Tool Executors](lc:user-guide/concepts/tools/executors)."
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { notebook } from '@strands-agents/sdk/vended-tools/notebook'\nimport { fileEditor } from '@strands-agents/sdk/vended-tools/file-editor'\n\n// Concurrent execution (default)\nconst agent = new Agent({\n  tools: [notebook, fileEditor],\n})\nawait agent.invoke('List the notebooks and edit a file')\n\n// Sequential execution for order-dependent tools\nconst sequentialAgent = new Agent({\n  tools: [notebook, fileEditor],\n  toolExecutor: 'sequential',\n})\nawait sequentialAgent.invoke('Create a notebook entry, then edit a file based on it')\n```\n\nFor more details, see [Tool Executors](lc:user-guide/concepts/tools/executors)."
 }
]
```

## Building & Loading Tools

### 1\. Custom Tools

Build your own tools using the Strands SDK’s tool interfaces. Both Python and TypeScript support creating custom tools, though with different approaches.

#### Function-Based Tools

```sa-tabs
[
 {
  "label": "Python",
  "body": "Define any Python function as a tool by using the [`@tool`](lc:api/python/strands.tools.decorator#tool) decorator. Function decorated tools can be placed anywhere in your codebase and imported in to your agent\u2019s list of tools.\n\n```python\nimport asyncio\nfrom strands import Agent, tool\n\n\n@tool\ndef get_user_location() -> str:\n    \"\"\"Get the user's location.\"\"\"\n\n    # Implement user location lookup logic here\n    return \"Seattle, USA\"\n\n\n@tool\ndef weather(location: str) -> str:\n    \"\"\"Get weather information for a location.\n\n    Args:\n        location: City or location name\n    \"\"\"\n\n    # Implement weather lookup logic here\n    return f\"Weather for {location}: Sunny, 72\u00b0F\"\n\n\n@tool\nasync def call_api() -> str:\n    \"\"\"Call API asynchronously.\n\n    Strands will invoke all async tools concurrently.\n    \"\"\"\n\n    await asyncio.sleep(5)  # simulated api call\n    return \"API result\"\n\n\ndef basic_example():\n    agent = Agent(tools=[get_user_location, weather])\n    agent(\"What is the weather like in my location?\")\n\n\nasync def async_example():\n    agent = Agent(tools=[call_api])\n    await agent.invoke_async(\"Can you call my API?\")\n\n\ndef main():\n    basic_example()\n    asyncio.run(async_example())\n```"
 },
 {
  "label": "TypeScript",
  "body": "Use the `tool()` function to create tools with [Zod](https://zod.dev/) schema validation or plain JSON Schema objects. These tools can then be passed directly to your agents.\n\n```typescript\nconst weatherTool = tool({\n  name: 'weather_forecast',\n  description: 'Get weather forecast for a city',\n  inputSchema: z.object({\n    city: z.string().describe('The name of the city'),\n    days: z.number().default(3).describe('Number of days for the forecast'),\n  }),\n  callback: (input) => {\n    return `Weather forecast for ${input.city} for the next ${input.days} days...`\n  },\n})\n```\n\nFor more details on building custom tools, see [Creating Custom Tools](lc:user-guide/concepts/tools/custom-tools)."
 }
]
```

#### Module-Based Tools

```sa-tabs
[
 {
  "label": "Python",
  "body": "Tool modules can also provide single tools that don\u2019t use the decorator pattern, instead they define the `TOOL_SPEC` variable and a function matching the tool\u2019s name. In this example `weather.py`:\n\nweather.py\n\n```python\nfrom typing import Any\nfrom strands.types.tools import ToolResult, ToolUse\n\nTOOL_SPEC = {\n    \"name\": \"weather\",\n    \"description\": \"Get weather information for a location\",\n    \"inputSchema\": {\n        \"json\": {\n            \"type\": \"object\",\n            \"properties\": {\n                \"location\": {\n                    \"type\": \"string\",\n                    \"description\": \"City or location name\"\n                }\n            },\n            \"required\": [\"location\"]\n        }\n    }\n}\n\n# Function name must match tool name\n# May also be defined async similar to decorated tools\ndef weather(tool: ToolUse, **kwargs: Any) -> ToolResult:\n    tool_use_id = tool[\"toolUseId\"]\n    location = tool[\"input\"][\"location\"]\n\n    # Implement weather lookup logic here\n    weather_info = f\"Weather for {location}: Sunny, 72\u00b0F\"\n\n    return {\n        \"toolUseId\": tool_use_id,\n        \"status\": \"success\",\n        \"content\": [{\"text\": weather_info}]\n    }\n```\n\nAnd finally our `agent.py` file that demonstrates loading the decorated `get_user_location` tool from a Python module, and the single non-decorated `weather` tool module:\n\nagent.py\n\n```python\nfrom strands import Agent\nimport get_user_location\nimport weather\n\n# Tools can be added to agents through Python module imports\nagent = Agent(tools=[get_user_location, weather])\n\n# Use the agent with the custom tools\nagent(\"What is the weather like in my location?\")\n```\n\nTool modules can also be loaded by providing their module file paths:\n\n```python\nfrom strands import Agent\n\n# Tools can be added to agents through file path strings\nagent = Agent(tools=[\"./get_user_location.py\", \"./weather.py\"])\n\nagent(\"What is the weather like in my location?\")\n```\n\nFor more details on building custom Python tools, see [Creating Custom Tools](lc:user-guide/concepts/tools/custom-tools)."
 },
 {
  "label": "TypeScript",
  "body": "```ts\n// Not supported in TypeScript\n```"
 }
]
```

### 2\. Vended Tools

Pre-built tools are available in both Python and TypeScript to help you get started quickly.

```sa-tabs
[
 {
  "label": "Python",
  "body": "**Community Tools Package**\n\nFor Python, Strands offers a [community-supported tools package](https://github.com/strands-agents/tools/blob/main) with pre-built tools for development:\n\n```python\nfrom strands import Agent\nfrom strands_tools import calculator, file_read, shell\n\nagent = Agent(tools=[calculator, file_read, shell])\n```\n\nFor a complete list of available tools, see [Community Tools Package](lc:user-guide/concepts/tools/community-tools-package)."
 },
 {
  "label": "TypeScript",
  "body": "**Vended Tools**\n\nTypeScript [vended tools](lc:user-guide/concepts/tools/vended-tools) are included directly in the SDK. The Community Tools Package (`strands-agents-tools`) is Python-only.\n\n```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { notebook } from '@strands-agents/sdk/vended-tools/notebook'\nimport { fileEditor } from '@strands-agents/sdk/vended-tools/file-editor'\n\nconst agent = new Agent({\n  tools: [notebook, fileEditor],\n})\n```"
 }
]
```

### 3\. Model Context Protocol (MCP) Tools

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) provides a standardized way to expose and consume tools across different systems. This approach is ideal for creating reusable tool collections that can be shared across multiple agents or applications.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom mcp.client.sse import sse_client\nfrom strands import Agent\nfrom strands.tools.mcp import MCPClient\n\n# Connect to an MCP server using SSE transport\nsse_mcp_client = MCPClient(lambda: sse_client(\"http://localhost:8000/sse\"))\n\n# Create an agent with MCP tools\nwith sse_mcp_client:\n    # Get the tools from the MCP server\n    tools = sse_mcp_client.list_tools_sync()\n\n    # Create an agent with the MCP server's tools\n    agent = Agent(tools=tools)\n\n    # Use the agent with MCP tools\n    agent(\"Calculate the square root of 144\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Create MCP client with stdio transport\nconst mcpClientOverview = new McpClient({\n  transport: new StdioClientTransport({\n    command: 'uvx',\n    args: ['awslabs.aws-documentation-mcp-server@latest'],\n  }),\n})\n\n// Pass MCP client directly to agent\nconst agentOverview = new Agent({\n  tools: [mcpClientOverview],\n})\n\nawait agentOverview.invoke('Calculate the square root of 144')\n```"
 }
]
```

For more information on using MCP tools, see [MCP Tools](lc:user-guide/concepts/tools/mcp-tools).

### 4\. Agents as Tools

Agents can be passed directly in another agent’s `tools` array — the SDK automatically converts them into tools. Use `.as_tool()``.asTool()` when you need to customize the tool name, description, or context behavior. For full details, see [Agents as Tools](lc:user-guide/concepts/multi-agent/agents-as-tools).

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\nresearch_agent = Agent(\n    system_prompt=\"You are a specialized research assistant.\",\n)\n\norchestrator = Agent(\n    system_prompt=\"You are an assistant that routes queries to specialized agents.\",\n    tools=[research_agent],\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst researchAgent = new Agent({\n  name: 'research_agent',\n  description: 'A specialized research assistant.',\n  systemPrompt: 'You are a specialized research assistant.',\n  printer: false,\n})\n\nconst orchestrator = new Agent({\n  systemPrompt: 'You are an assistant that routes queries to specialized agents.',\n  tools: [researchAgent],\n})\n```"
 }
]
```

## Tool Design Best Practices

### Effective Tool Descriptions

Language models rely heavily on tool descriptions to determine when and how to use them. Well-crafted descriptions significantly improve tool usage accuracy.

A good tool description should:

-   Clearly explain the tool’s purpose and functionality
-   Specify when the tool should be used
-   Detail the parameters it accepts and their formats
-   Describe the expected output format
-   Note any limitations or constraints

Example of a well-described tool:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\n@tool\ndef search_database(query: str, max_results: int = 10) -> list:\n    \"\"\"\n    Search the product database for items matching the query string.\n\n    Use this tool when you need to find detailed product information based on keywords,\n    product names, or categories. The search is case-insensitive and supports fuzzy\n    matching to handle typos and variations in search terms.\n\n    This tool connects to the enterprise product catalog database and performs a semantic\n    search across all product fields, providing comprehensive results with all available\n    product metadata.\n\n    Example response:\n        [\n            {\n                \"id\": \"P12345\",\n                \"name\": \"Ultra Comfort Running Shoes\",\n                \"description\": \"Lightweight running shoes with...\",\n                \"price\": 89.99,\n                \"category\": [\"Footwear\", \"Athletic\", \"Running\"]\n            },\n            ...\n        ]\n\n    Notes:\n        - This tool only searches the product catalog and does not provide\n          inventory or availability information\n        - Results are cached for 15 minutes to improve performance\n        - The search index updates every 6 hours, so very recent products may not appear\n        - For real-time inventory status, use a separate inventory check tool\n\n    Args:\n        query: The search string (product name, category, or keywords)\n               Example: \"red running shoes\" or \"smartphone charger\"\n        max_results: Maximum number of results to return (default: 10, range: 1-100)\n                     Use lower values for faster response when exact matches are expected\n\n    Returns:\n        A list of matching product records, each containing:\n        - id: Unique product identifier (string)\n        - name: Product name (string)\n        - description: Detailed product description (string)\n        - price: Current price in USD (float)\n        - category: Product category hierarchy (list)\n    \"\"\"\n\n    # Implementation\n    pass\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst searchDatabaseTool = tool({\n    name: 'search_database',\n    description: `Search the product database for items matching the query string.\n\nUse this tool when you need to find detailed product information based on keywords,\nproduct names, or categories. The search is case-insensitive and supports fuzzy\nmatching to handle typos and variations in search terms.\n\nThis tool connects to the enterprise product catalog database and performs a semantic\nsearch across all product fields, providing comprehensive results with all available\nproduct metadata.\n\nExample response:\n[\n  {\n    \"id\": \"P12345\",\n    \"name\": \"Ultra Comfort Running Shoes\",\n    \"description\": \"Lightweight running shoes with...\",\n    \"price\": 89.99,\n    \"category\": [\"Footwear\", \"Athletic\", \"Running\"]\n  }\n]\n\nNotes:\n- This tool only searches the product catalog and does not provide inventory or availability information\n- Results are cached for 15 minutes to improve performance\n- The search index updates every 6 hours, so very recent products may not appear\n- For real-time inventory status, use a separate inventory check tool`,\n    inputSchema: z.object({\n      query: z\n        .string()\n        .describe(\n          'The search string (product name, category, or keywords). Example: \"red running shoes\"'\n        ),\n      maxResults: z\n        .number()\n        .default(10)\n        .describe('Maximum number of results to return (default: 10, range: 1-100)'),\n    }),\n    callback: () => {\n      // Implementation would go here\n      return []\n    },\n  })\n```"
 }
]
```

## Related pages

- [Build with AI](lc:user-guide/build-with-ai) (2 shared tags)
- [Model Context Protocol (MCP) Tools](lc:user-guide/concepts/tools/mcp-tools) (2 shared tags)
- [Community Built Tools](lc:user-guide/concepts/tools/community-tools-package) (1 shared tag)
- [Creating Custom Tools](lc:user-guide/concepts/tools/custom-tools) (1 shared tag)
- [Vended Tools](lc:user-guide/concepts/tools/vended-tools) (1 shared tag)
- [OpenAI Responses API](lc:user-guide/concepts/model-providers/openai-responses) (1 shared tag)
- [Agents as Tools with Strands Agents SDK](lc:user-guide/concepts/multi-agent/agents-as-tools) (1 shared tag)
- [Agent Configuration](lc:user-guide/concepts/experimental/agent-config) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/tools/decorator.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/decorator.py)
- [harness-sdk/strands-py/src/strands/tools/registry.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/registry.py)

### TypeScript

- [harness-sdk/strands-ts/src/tools/tool.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/tools/tool.ts)
- [harness-sdk/strands-ts/src/tools/tool-factory.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/tools/tool-factory.ts)
