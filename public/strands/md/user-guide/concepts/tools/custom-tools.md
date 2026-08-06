There are multiple approaches to defining custom tools in Strands, with differences between Python and TypeScript implementations.

```sa-tabs
[
 {
  "label": "Python",
  "body": "Python supports three approaches to defining tools:\n\n-   **Python functions with the [`@tool`](lc:api/python/strands.tools.decorator#tool) decorator**: Transform regular Python functions into tools by adding a simple decorator. This approach leverages Python\u2019s docstrings and type hints to automatically generate tool specifications.\n    \n-   **Class-based tools with the [`@tool`](lc:api/python/strands.tools.decorator#tool) decorator**: Create tools within classes to maintain state and leverage object-oriented programming patterns.\n    \n-   **Python modules following a specific format**: Define tools by creating Python modules that contain a tool specification and a matching function. This approach gives you more control over the tool\u2019s definition and is useful for dependency-free implementations of tools."
 },
 {
  "label": "TypeScript",
  "body": "TypeScript supports two main approaches:\n\n-   **tool() function with [Zod](https://zod.dev/) or JSON schemas**: Create tools using the `tool()` function with either Zod schemas for type-safe validated input, or plain JSON Schema objects for schema-only definitions without runtime validation.\n    \n-   **Class-based tools extending FunctionTool**: Create tools within classes to maintain shared state and resources."
 }
]
```

## Tool Creation Examples

### Basic Example

```sa-tabs
[
 {
  "label": "Python",
  "body": "Here\u2019s a simple example of a function decorated as a tool:\n\n```python\nfrom strands import tool\n\n@tool\ndef weather_forecast(city: str, days: int = 3) -> str:\n    \"\"\"Get weather forecast for a city.\n\n    Args:\n        city: The name of the city\n        days: Number of days for the forecast\n    \"\"\"\n    return f\"Weather forecast for {city} for the next {days} days...\"\n```\n\nThe decorator extracts information from your function\u2019s docstring to create the tool specification. The first paragraph becomes the tool\u2019s description, and the \u201cArgs\u201d section provides parameter descriptions. These are combined with the function\u2019s type hints to create a complete tool specification."
 },
 {
  "label": "TypeScript",
  "body": "Here\u2019s a simple example of a function based tool with Zod:\n\n```typescript\nconst weatherTool = tool({\n  name: 'weather_forecast',\n  description: 'Get weather forecast for a city',\n  inputSchema: z.object({\n    city: z.string().describe('The name of the city'),\n    days: z.number().default(3).describe('Number of days for the forecast'),\n  }),\n  callback: (input) => {\n    return `Weather forecast for ${input.city} for the next ${input.days} days...`\n  },\n})\n```\n\nThe `tool()` function accepts either a [Zod](https://zod.dev/) schema or a plain JSON Schema object as `inputSchema`. With Zod, input is validated at runtime and the callback receives typed input. With JSON Schema, the schema is passed through as-is and the callback receives `unknown`.\n\nHere\u2019s the same tool using a JSON Schema object instead:\n\n```typescript\nconst weatherTool = tool({\n  name: 'weather_forecast',\n  description: 'Get weather forecast for a city',\n  inputSchema: {\n    type: 'object',\n    properties: {\n      city: { type: 'string', description: 'The name of the city' },\n      days: { type: 'number', description: 'Number of days for the forecast' },\n    },\n    required: ['city'],\n  },\n  callback: (input) => {\n    const { city, days = 3 } = input as { city: string; days?: number }\n    return `Weather forecast for ${city} for the next ${days} days...`\n  },\n})\n```"
 }
]
```

### Overriding Tool Name, Description, and Schema

```sa-tabs
[
 {
  "label": "Python",
  "body": "You can override the tool name, description, and input schema by providing them as arguments to the decorator:\n\n```python\n@tool(name=\"get_weather\", description=\"Retrieves weather forecast for a specified location\")\ndef weather_forecast(city: str, days: int = 3) -> str:\n    \"\"\"Implementation function for weather forecasting.\n\n    Args:\n        city: The name of the city\n        days: Number of days for the forecast\n    \"\"\"\n    return f\"Weather forecast for {city} for the next {days} days...\"\n```"
 },
 {
  "label": "TypeScript",
  "body": "In TypeScript, the tool name and description are always provided explicitly in the `tool()` configuration:\n\n```typescript\nconst weatherTool = tool({\n  name: 'get_weather',\n  description: 'Retrieves weather forecast for a specified location',\n  inputSchema: z.object({\n    city: z.string().describe('The name of the city'),\n    days: z.number().default(3).describe('Number of days for the forecast'),\n  }),\n  callback: (input: { city: any; days: any }) => {\n    return `Weather forecast for ${input.city} for the next ${input.days} days...`\n  },\n})\n```"
 }
]
```

Tool names must match `^[a-zA-Z0-9_-]+$` and be 1 to 64 characters long. Names that do not match this format are replaced with `INVALID_TOOL_NAME` on assistant messages before they are sent to the model, so the request still succeeds but the model can no longer reference the original name.

### Overriding Input Schema

```sa-tabs
[
 {
  "label": "Python",
  "body": "You can provide a custom JSON schema to override the automatically generated one:\n\n```python\n@tool(\n    inputSchema={\n        \"json\": {\n            \"type\": \"object\",\n            \"properties\": {\n                \"shape\": {\n                    \"type\": \"string\",\n                    \"enum\": [\"circle\", \"rectangle\"],\n                    \"description\": \"The shape type\"\n                },\n                \"radius\": {\"type\": \"number\", \"description\": \"Radius for circle\"},\n                \"width\": {\"type\": \"number\", \"description\": \"Width for rectangle\"},\n                \"height\": {\"type\": \"number\", \"description\": \"Height for rectangle\"}\n            },\n            \"required\": [\"shape\"]\n        }\n    }\n)\ndef calculate_area(shape: str, radius: float = None, width: float = None, height: float = None) -> float:\n    \"\"\"Calculate area of a shape.\"\"\"\n    if shape == \"circle\":\n        return 3.14159 * radius ** 2\n    elif shape == \"rectangle\":\n        return width * height\n    return 0.0\n```"
 },
 {
  "label": "TypeScript",
  "body": "In TypeScript, `inputSchema` is always provided explicitly in the `tool()` configuration - as either a Zod schema or a JSON Schema object. See the [basic example](#basic-example) above for both approaches."
 }
]
```

## Using and Customizing Tools:

### Loading Function-Based Tools

To use function-based tools, simply pass them to the agent:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nagent = Agent(\n    tools=[weather_forecast]\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst agent = new Agent({\n    tools: [weatherTool]\n})\n```"
 }
]
```

### Custom Return Type

```sa-tabs
[
 {
  "label": "Python",
  "body": "By default, your function\u2019s return value is automatically formatted as a text response. However, if you need more control over the response format, you can return a dictionary with a specific structure:\n\n```python\n@tool\ndef fetch_data(source_id: str) -> dict:\n    \"\"\"Fetch data from a specified source.\n\n    Args:\n        source_id: Identifier for the data source\n    \"\"\"\n    try:\n        data = some_other_function(source_id)\n        return {\n            \"status\": \"success\",\n            \"content\": [ {\n                \"json\": data,\n            }]\n        }\n    except Exception as e:\n        return {\n            \"status\": \"error\",\n             \"content\": [\n                {\"text\": f\"Error:{e}\"}\n            ]\n        }\n```"
 },
 {
  "label": "TypeScript",
  "body": "In Typescript, your tool\u2019s return value is automatically converted into a `ToolResultBlock`. You can return **any** JSON serializable object:\n\n```typescript\nconst weatherTool = tool({\n  name: 'get_weather',\n  description: 'Retrieves weather forecast for a specified location',\n  inputSchema: z.object({\n    city: z.string().describe('The name of the city'),\n    days: z.number().default(3).describe('Number of days for the forecast'),\n  }),\n  callback: (input: { city: any; days: any }) => {\n    return {\n      city: input.city,\n      days: input.days,\n      forecast: `Weather forecast for ${input.city} for the next ${input.days} days...`,\n    }\n  },\n})\n```"
 }
]
```

For more details, see the [Tool Response Format](#tool-response-format) section below.

### Async Invocation

Function tools may also be defined async. Strands will invoke all async tools concurrently.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nimport asyncio\nfrom strands import Agent, tool\n\n\n@tool\nasync def call_api() -> str:\n    \"\"\"Call API asynchronously.\"\"\"\n\n    await asyncio.sleep(5)  # simulated api call\n    return \"API result\"\n\n\nasync def async_example():\n    agent = Agent(tools=[call_api])\n    await agent.invoke_async(\"Can you call my API?\")\n\n\nasyncio.run(async_example())\n```"
 },
 {
  "label": "TypeScript",
  "body": "**Async callback:**\n\n```typescript\nconst callApiTool = tool({\n  name: 'call_api',\n  description: 'Call API asynchronously',\n  inputSchema: z.object({}),\n  callback: async (): Promise<string> => {\n    await new Promise((resolve) => setTimeout(resolve, 5000)) // simulated api call\n    return 'API result'\n  },\n})\n\nconst agent = new Agent({ tools: [callApiTool] })\nawait agent.invoke('Can you call my API?')\n```\n\n**AsyncGenerator callback:**\n\n```typescript\nconst insertDataTool = tool({\n  name: 'insert_data',\n  description: 'Insert data with progress updates',\n  inputSchema: z.object({\n    table: z.string().describe('The table name'),\n    data: z.record(z.string(), z.any()).describe('The data to insert'),\n  }),\n  callback: async function* (input: {\n    table: string\n    data: Record<string, any>\n  }): AsyncGenerator<string, string, unknown> {\n    yield 'Starting data insertion...'\n    await new Promise((resolve) => setTimeout(resolve, 1000))\n    yield 'Validating data...'\n    await new Promise((resolve) => setTimeout(resolve, 1000))\n    return `Inserted data into ${input.table}: ${JSON.stringify(input.data)}`\n  },\n})\n```"
 }
]
```

### ToolContext

Tools can access their execution context to interact with the invoking agent, current tool use data, and invocation state. The [`ToolContext`](lc:api/python/strands.types.tools#ToolContext) provides this access:

```sa-tabs
[
 {
  "label": "Python",
  "body": "In Python, set `context=True` in the decorator and include a `tool_context` parameter:\n\n```python\nfrom strands import tool, Agent, ToolContext\n\n@tool(context=True)\ndef get_self_name(tool_context: ToolContext) -> str:\n    return f\"The agent name is {tool_context.agent.name}\"\n\n@tool(context=True)\ndef get_tool_use_id(tool_context: ToolContext) -> str:\n    return f\"Tool use is {tool_context.tool_use[\"toolUseId\"]}\"\n\n@tool(context=True)\ndef get_invocation_state(tool_context: ToolContext) -> str:\n    return f\"Invocation state: {tool_context.invocation_state[\"custom_data\"]}\"\n\nagent = Agent(tools=[get_self_name, get_tool_use_id, get_invocation_state], name=\"Best agent\")\n\nagent(\"What is your name?\")\nagent(\"What is the tool use id?\")\nagent(\"What is the invocation state?\", custom_data=\"You're the best agent ;)\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "In TypeScript, the context is passed as an optional second parameter to the callback function:\n\n```typescript\nconst getAgentInfoTool = tool({\n  name: 'get_agent_info',\n  description: 'Get information about the agent',\n  inputSchema: z.object({}),\n  callback: (input, context?: ToolContext): string => {\n    // Access agent state through context\n    return `Agent has ${context?.agent.messages.length} messages in history`\n  },\n})\n\nconst getToolUseIdTool = tool({\n  name: 'get_tool_use_id',\n  description: 'Get the tool use ID',\n  inputSchema: z.object({}),\n  callback: (input, context?: ToolContext): string => {\n    return `Tool use is ${context?.toolUse.toolUseId}`\n  },\n})\n\nconst agent = new Agent({ tools: [getAgentInfoTool, getToolUseIdTool] })\n\nawait agent.invoke('What is your information?')\nawait agent.invoke('What is the tool use id?')\n```"
 }
]
```

### Custom ToolContext Parameter Name

```sa-tabs
[
 {
  "label": "Python",
  "body": "To use a different parameter name for ToolContext, specify the desired name as the value of the `@tool.context` argument:\n\n```python\nfrom strands import tool, Agent, ToolContext\n\n@tool(context=\"context\")\ndef get_self_name(context: ToolContext) -> str:\n    return f\"The agent name is {context.agent.name}\"\n\nagent = Agent(tools=[get_self_name], name=\"Best agent\")\n\nagent(\"What is your name?\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```ts\n// Not supported in TypeScript\n```"
 }
]
```

#### Accessing State in Tools

```sa-tabs
[
 {
  "label": "Python",
  "body": "The `invocation_state` attribute in `ToolContext` provides access to data passed through the agent invocation. This is particularly useful for:\n\n1.  **Request Context**: Access session IDs, user information, or request-specific data\n2.  **Multi-Agent Shared State**: In [Graph](lc:user-guide/concepts/multi-agent/graph) and [Swarm](lc:user-guide/concepts/multi-agent/swarm) patterns, access state shared across all agents\n3.  **Per-Invocation Overrides**: Override behavior or settings for specific requests\n\n```python\nfrom strands import tool, Agent, ToolContext\nimport requests\n\n@tool(context=True)\ndef api_call(query: str, tool_context: ToolContext) -> dict:\n    \"\"\"Make an API call with user context.\n\n    Args:\n        query: The search query to send to the API\n        tool_context: Context containing user information\n    \"\"\"\n    user_id = tool_context.invocation_state.get(\"user_id\")\n\n    response = requests.get(\n        \"https://api.example.com/search\",\n        headers={\"X-User-ID\": user_id},\n        params={\"q\": query}\n    )\n\n    return response.json()\n\nagent = Agent(tools=[api_call])\nresult = agent(\"Get my profile data\", user_id=\"user123\")\n```\n\n**Invocation State Compared To Other Approaches**\n\nIt\u2019s important to understand how invocation state compares to other approaches that impact tool execution:\n\n-   **Tool Parameters**: Use for data that the LLM should reason about and provide based on the user\u2019s request. Examples include search queries, file paths, calculation inputs, or any data the agent needs to determine from context.\n    \n-   **Invocation State**: Use for context and configuration that should not appear in prompts but affects tool behavior. Best suited for parameters that can change between agent invocations. Examples include user IDs for personalization, session IDs, or user flags.\n    \n-   **[Class-based tools](#class-based-tools)**: Use for configuration that doesn\u2019t change between requests and requires initialization. Examples include API keys, database connection strings, service endpoints, or shared resources that need setup."
 },
 {
  "label": "TypeScript",
  "body": "In TypeScript, tools access **invocation state** through `context.invocationState`. This per-invocation `Record<string, unknown>` is passed in via `InvokeOptions` and shared by reference across hooks and tools for the duration of one invocation:\n\n```typescript\nconst apiCallTool = tool({\n  name: 'api_call',\n  description: 'Make an API call with user context',\n  inputSchema: z.object({\n    query: z.string().describe('The search query'),\n  }),\n  callback: async (input, context) => {\n    if (!context) {\n      throw new Error('Context is required')\n    }\n\n    // Access per-invocation state via context.invocationState\n    const userId = context.invocationState.userId as string | undefined\n\n    const response = await fetch('https://api.example.com/search', {\n      method: 'GET',\n      headers: { 'X-User-ID': userId || '' },\n    })\n\n    return response.json()\n  },\n})\n\nconst agent = new Agent({ tools: [apiCallTool] })\n\n// Pass invocation state when invoking\nconst result = await agent.invoke('Get my profile data', {\n  invocationState: { userId: 'user123' },\n})\n```\n\nInvocation state is useful for:\n\n1.  **Request Context**: Access session IDs, user information, or request-specific data without polluting model context\n2.  **Multi-Agent Shared State**: In [Graph](lc:user-guide/concepts/multi-agent/graph) and [Swarm](lc:user-guide/concepts/multi-agent/swarm) patterns, access state shared across all agents\n3.  **Cross-Hook Counters**: Track tool call counts, model calls, or custom metrics across hooks and tools within a single invocation\n\n**Invocation State Compared To Other Approaches**\n\n-   **Tool Parameters**: Data the LLM should reason about \u2014 search queries, file paths, user requests.\n    \n-   **Invocation State** (`context.invocationState`): Request-scoped context that should not appear in prompts but affects tool behavior. Ephemeral \u2014 scoped to one invocation and accepts arbitrary values.\n    \n-   **Agent State** (`context.agent.appState`): Durable key-value storage that persists across invocations. JSON-serializable and deep-copied on read/write. Use for configuration that doesn\u2019t change between requests.\n    \n-   **[Class-based tools](#class-based-tools)**: Instance-level configuration that requires initialization. Use for API keys, database connections, or shared resources."
 }
]
```

### Tool Streaming

```sa-tabs
[
 {
  "label": "Python",
  "body": "Async tools can yield intermediate results to provide real-time progress updates. Each yielded value becomes a [streaming event](lc:user-guide/concepts/streaming), with the final value serving as the tool\u2019s return result:\n\n```python\nfrom datetime import datetime\nimport asyncio\nfrom strands import tool\n\n@tool\nasync def process_dataset(records: int) -> str:\n    \"\"\"Process records with progress updates.\"\"\"\n    start = datetime.now()\n\n    for i in range(records):\n        await asyncio.sleep(0.1)\n        if i % 10 == 0:\n            elapsed = datetime.now() - start\n            yield f\"Processed {i}/{records} records in {elapsed.total_seconds():.1f}s\"\n\n    yield f\"Completed {records} records in {(datetime.now() - start).total_seconds():.1f}s\"\n```\n\nStream events contain a `tool_stream_event` dictionary with `tool_use` (invocation info) and `data` (yielded value) fields:\n\n```python\nasync def tool_stream_example():\n    agent = Agent(tools=[process_dataset])\n\n    async for event in agent.stream_async(\"Process 50 records\"):\n        if tool_stream := event.get(\"tool_stream_event\"):\n            if update := tool_stream.get(\"data\"):\n                print(f\"Progress: {update}\")\n\nasyncio.run(tool_stream_example())\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst processDatasetTool = tool({\n  name: 'process_dataset',\n  description: 'Process records with progress updates',\n  inputSchema: z.object({\n    records: z.number().describe('Number of records to process'),\n  }),\n  callback: async function* (input: {\n    records: number\n  }): AsyncGenerator<string, string, unknown> {\n    const start = Date.now()\n\n    for (let i = 0; i < input.records; i++) {\n      await new Promise((resolve) => setTimeout(resolve, 100))\n      if (i % 10 === 0) {\n        const elapsed = (Date.now() - start) / 1000\n        yield `Processed ${i}/${input.records} records in ${elapsed.toFixed(1)}s`\n      }\n    }\n\n    const elapsed = (Date.now() - start) / 1000\n    return `Completed ${input.records} records in ${elapsed.toFixed(1)}s`\n  },\n})\n\nconst agent = new Agent({ tools: [processDatasetTool] })\n\nfor await (const event of agent.stream('Process 50 records')) {\n  if (event.type === 'toolStreamUpdateEvent') {\n    console.log(`Progress: ${event.event.data}`)\n  }\n}\n```"
 }
]
```

## Class-Based Tools

Class-based tools allow you to create tools that maintain state and leverage object-oriented programming patterns. This approach is useful when your tools need to share resources, maintain context between invocations, follow object-oriented design principles, customize tools before passing them to an agent, or create different tool configurations for different agents.

### Example with Multiple Tools in a Class

You can define multiple tools within the same class to create a cohesive set of related functionality:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, tool\n\nclass DatabaseTools:\n    def __init__(self, connection_string):\n        self.connection = self._establish_connection(connection_string)\n\n    def _establish_connection(self, connection_string):\n        # Set up database connection\n        return {\"connected\": True, \"db\": \"example_db\"}\n\n    @tool\n    def query_database(self, sql: str) -> dict:\n        \"\"\"Run a SQL query against the database.\n\n        Args:\n            sql: The SQL query to execute\n        \"\"\"\n        # Uses the shared connection\n        return {\"results\": f\"Query results for: {sql}\", \"connection\": self.connection}\n\n    @tool\n    def insert_record(self, table: str, data: dict) -> str:\n        \"\"\"Insert a new record into the database.\n\n        Args:\n            table: The table name\n            data: The data to insert as a dictionary\n        \"\"\"\n        # Also uses the shared connection\n        return f\"Inserted data into {table}: {data}\"\n\n# Usage\ndb_tools = DatabaseTools(\"example_connection_string\")\nagent = Agent(\n    tools=[db_tools.query_database, db_tools.insert_record]\n)\n```\n\nWhen you use the [`@tool`](lc:api/python/strands.tools.decorator#tool) decorator on a class method, the method becomes bound to the class instance when instantiated. This means the tool function has access to the instance\u2019s attributes and can maintain state between invocations."
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nclass DatabaseTools {\n  private connection: { connected: boolean; db: string }\n  readonly queryTool: ReturnType<typeof tool>\n  readonly insertTool: ReturnType<typeof tool>\n\n  constructor(connectionString: string) {\n    // Establish connection\n    this.connection = { connected: true, db: 'example_db' }\n\n    const connection = this.connection\n\n    // Create query tool\n    this.queryTool = tool({\n      name: 'query_database',\n      description: 'Run a SQL query against the database',\n      inputSchema: z.object({\n        sql: z.string().describe('The SQL query to execute'),\n      }),\n      callback: (input) => {\n        return { results: `Query results for: ${input.sql}`, connection }\n      },\n    })\n\n    // Create insert tool\n    this.insertTool = tool({\n      name: 'insert_record',\n      description: 'Insert a new record into the database',\n      inputSchema: z.object({\n        table: z.string().describe('The table name'),\n        data: z.record(z.string(), z.any()).describe('The data to insert'),\n      }),\n      callback: (input) => {\n        return `Inserted data into ${input.table}: ${JSON.stringify(input.data)}`\n      },\n    })\n  }\n}\n\n// Usage\nasync function useDatabaseTools() {\n  const dbTools = new DatabaseTools('example_connection_string')\n  const agent = new Agent({\n    tools: [dbTools.queryTool, dbTools.insertTool],\n  })\n}\n```\n\nIn TypeScript, you can create tools within a class and store them as properties. The tools can access the class\u2019s private state through closures."
 }
]
```

## Tool Response Format

Tools can return responses in various formats using the [`ToolResult`](lc:api/python/strands.types.tools#ToolResult) structure. This structure provides flexibility for returning different types of content while maintaining a consistent interface.

#### ToolResult Structure

```sa-tabs
[
 {
  "label": "Python",
  "body": "The [`ToolResult`](lc:api/python/strands.types.tools#ToolResult) dictionary has the following structure:\n\n```python\n{\n    \"toolUseId\": str,       # The ID of the tool use request (should match the incoming request).  Optional\n    \"status\": str,          # Either \"success\" or \"error\"\n    \"content\": List[dict]   # A list of content items with different possible formats\n}\n```"
 },
 {
  "label": "TypeScript",
  "body": "The ToolResult schema:\n\n```typescript\n{\n  type: 'toolResultBlock'\n  toolUseId: string\n  status: 'success' | 'error'\n  content: Array<ToolResultContent>\n  error?: Error\n}\n```"
 }
]
```

#### Content Types

The `content` field is a list of content blocks, where each block can contain:

-   `text`: A string containing text output
-   `json`: Any JSON-serializable data structure

#### Response Examples

```sa-tabs
[
 {
  "label": "Python",
  "body": "**Success Response:**\n\n```python\n{\n    \"toolUseId\": \"tool-123\",\n    \"status\": \"success\",\n    \"content\": [\n        {\"text\": \"Operation completed successfully\"},\n        {\"json\": {\"results\": [1, 2, 3], \"total\": 3}}\n    ]\n}\n```\n\n**Error Response:**\n\n```python\n{\n    \"toolUseId\": \"tool-123\",\n    \"status\": \"error\",\n    \"content\": [\n        {\"text\": \"Error: Unable to process request due to invalid parameters\"}\n    ]\n}\n```"
 },
 {
  "label": "TypeScript",
  "body": "**Success Response:**\n\nThe output structure of a successful tool response:\n\n```typescript\n{\n    \"type\": \"toolResultBlock\",\n    \"toolUseId\": \"tooluse_xq6vYsQ-QcGZOPcIx0yM3A\",\n    \"status\": \"success\",\n    \"content\": [\n        {\n            \"type\": \"jsonBlock\",\n            \"json\": {\n                \"result\": \"The letter 'r' appears 3 time(s) in 'strawberry'\"\n            }\n        }\n    ]\n}\n```\n\n**Error Response:**\n\nThe output structure of a unsuccessful tool response:\n\n```typescript\n{\n    \"type\": \"toolResultBlock\",\n    \"toolUseId\": \"tooluse_rFoPosVKQ7WfYRfw_min8Q\",\n    \"status\": \"error\",\n    \"content\": [\n        {\n            \"type\": \"textBlock\",\n            \"text\": \"Error: Test error\"\n        }\n    ],\n    \"error\": Error // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error\n}\n```"
 }
]
```

#### Tool Result Handling

```sa-tabs
[
 {
  "label": "Python",
  "body": "When using the [`@tool`](lc:api/python/strands.tools.decorator#tool) decorator, your function\u2019s return value is automatically converted to a proper [`ToolResult`](lc:api/python/strands.types.tools#ToolResult):\n\n1.  If you return a string or other simple value, it\u2019s wrapped as `{\"text\": str(result)}`\n2.  If you return a dictionary with the proper [`ToolResult`](lc:api/python/strands.types.tools#ToolResult) structure, it\u2019s used directly\n3.  If an exception occurs, it\u2019s converted to an error response"
 },
 {
  "label": "TypeScript",
  "body": "The `tool()` function automatically handles return value conversion:\n\n1.  Any of the following types are converted to a ToolResult schema: `string | number | boolean | null | { [key: string]: JSONValue } | JSONValue[]`\n2.  Exceptions are caught and converted to error responses"
 }
]
```

## Module Based Tools (python only)

```sa-tabs
[
 {
  "label": "Python",
  "body": "An alternative approach is to define a tool as a Python module with a specific structure. This enables creating tools that don\u2019t depend on the SDK directly.\n\nA Python module tool requires two key components:\n\n1.  A `TOOL_SPEC` variable that defines the tool\u2019s name, description, and input schema\n2.  A function with the same name as specified in the tool spec that implements the tool\u2019s functionality"
 }
]
```

### Basic Example

```sa-tabs
[
 {
  "label": "Python",
  "body": "Here\u2019s how you would implement the same weather forecast tool as a module:\n\nweather\\_forecast.py\n\n```python\nfrom typing import Any\n\n\n# 1. Tool Specification\nTOOL_SPEC = {\n    \"name\": \"weather_forecast\",\n    \"description\": \"Get weather forecast for a city.\",\n    \"inputSchema\": {\n        \"json\": {\n            \"type\": \"object\",\n            \"properties\": {\n                \"city\": {\n                    \"type\": \"string\",\n                    \"description\": \"The name of the city\"\n                },\n                \"days\": {\n                    \"type\": \"integer\",\n                    \"description\": \"Number of days for the forecast\",\n                    \"default\": 3\n                }\n            },\n            \"required\": [\"city\"]\n        }\n    }\n}\n\n# 2. Tool Function\ndef weather_forecast(tool, **kwargs: Any):\n    # Extract tool parameters\n    tool_use_id = tool[\"toolUseId\"]\n    tool_input = tool[\"input\"]\n\n    # Get parameter values\n    city = tool_input.get(\"city\", \"\")\n    days = tool_input.get(\"days\", 3)\n\n    # Tool implementation\n    result = f\"Weather forecast for {city} for the next {days} days...\"\n\n    # Return structured response\n    return {\n        \"toolUseId\": tool_use_id,\n        \"status\": \"success\",\n        \"content\": [{\"text\": result}]\n    }\n```"
 }
]
```

### Loading Module Tools

```sa-tabs
[
 {
  "label": "Python",
  "body": "To use a module-based tool, import the module and pass it to the agent:\n\n```python\nfrom strands import Agent\nimport weather_forecast\n\nagent = Agent(\n    tools=[weather_forecast]\n)\n```\n\nAlternatively, you can load a tool by passing in a path:\n\n```python\nfrom strands import Agent\n\nagent = Agent(\n    tools=[\"./weather_forecast.py\"]\n)\n```"
 }
]
```

### Async Invocation

```sa-tabs
[
 {
  "label": "Python",
  "body": "Similar to decorated tools, users may define their module tools async.\n\n```python\nTOOL_SPEC = {\n    \"name\": \"call_api\",\n    \"description\": \"Call my API asynchronously.\",\n    \"inputSchema\": {\n        \"json\": {\n            \"type\": \"object\",\n            \"properties\": {},\n            \"required\": []\n        }\n    }\n}\n\nasync def call_api(tool, **kwargs):\n    await asyncio.sleep(5)  # simulated api call\n    result = \"API result\"\n\n    return {\n        \"toolUseId\": tool[\"toolUseId\"],\n        \"status\": \"success\",\n        \"content\": [{\"text\": result}],\n    }\n```"
 }
]
```

## Related pages

- [Community Built Tools](lc:user-guide/concepts/tools/community-tools-package) (1 shared tag)
- [Vended Tools](lc:user-guide/concepts/tools/vended-tools) (1 shared tag)
- [Build with AI](lc:user-guide/build-with-ai) (1 shared tag)
- [Model Context Protocol (MCP) Tools](lc:user-guide/concepts/tools/mcp-tools) (1 shared tag)
- [Tools Overview](lc:user-guide/concepts/tools) (1 shared tag)
- [Agents as Tools with Strands Agents SDK](lc:user-guide/concepts/multi-agent/agents-as-tools) (1 shared tag)
- [Agent Configuration](lc:user-guide/concepts/experimental/agent-config) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/tools/decorator.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/decorator.py)
- [harness-sdk/strands-py/src/strands/tools/tools.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/tools.py)
- [harness-sdk/strands-py/src/strands/tools/loader.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/loader.py)

### TypeScript

- [harness-sdk/strands-ts/src/tools/function-tool.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/tools/function-tool.ts)
- [harness-sdk/strands-ts/src/tools/tool-factory.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/tools/tool-factory.ts)
