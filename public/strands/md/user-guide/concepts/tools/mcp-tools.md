The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open protocol that standardizes how applications provide context to Large Language Models. Strands Agents integrates with MCP to extend agent capabilities through external tools and services.

MCP enables communication between agents and MCP servers that provide additional tools. Strands includes built-in support for connecting to MCP servers and using their tools in both Python and TypeScript.

## Quick Start

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom mcp import stdio_client, StdioServerParameters\nfrom strands import Agent\nfrom strands.tools.mcp import MCPClient\n\n# Create MCP client with stdio transport\nmcp_client = MCPClient(lambda: stdio_client(\n    StdioServerParameters(\n        command=\"uvx\",\n        args=[\"awslabs.aws-documentation-mcp-server@latest\"]\n    )\n))\n\n# Pass MCP client directly to agent - lifecycle managed automatically\nagent = Agent(tools=[mcp_client])\nagent(\"What is AWS Lambda?\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Create MCP client with stdio transport\nconst mcpClient = new McpClient({\n  transport: new StdioClientTransport({\n    command: 'uvx',\n    args: ['awslabs.aws-documentation-mcp-server@latest'],\n  }),\n})\n\n// Pass MCP client directly to agent\nconst agent = new Agent({\n  tools: [mcpClient],\n})\n\nawait agent.invoke('What is AWS Lambda?')\n```"
 }
]
```

## Integration Approaches

```sa-tabs
[
 {
  "label": "Python",
  "body": "**Managed Integration (Recommended)**\n\nThe `MCPClient` implements the `ToolProvider` interface, enabling direct usage in the Agent constructor with automatic lifecycle management:\n\n```python\nfrom mcp import stdio_client, StdioServerParameters\nfrom strands import Agent\nfrom strands.tools.mcp import MCPClient\n\nmcp_client = MCPClient(lambda: stdio_client(\n    StdioServerParameters(\n        command=\"uvx\",\n        args=[\"awslabs.aws-documentation-mcp-server@latest\"]\n    )\n))\n\n# Direct usage - connection lifecycle managed automatically\nagent = Agent(tools=[mcp_client])\nresponse = agent(\"What is AWS Lambda?\")\n```\n\n**Manual Context Management**\n\nFor cases requiring explicit control over the MCP session lifecycle, use context managers:\n\n```python\nwith mcp_client:\n    tools = mcp_client.list_tools_sync()\n    agent = Agent(tools=tools)\n    agent(\"What is AWS Lambda?\")  # Must be within context\n```"
 },
 {
  "label": "TypeScript",
  "body": "**Direct Integration**\n\n`McpClient` instances are passed directly to the agent. The client connects lazily on first use:\n\n```typescript\nconst mcpClientDirect = new McpClient({\n  transport: new StdioClientTransport({\n    command: 'uvx',\n    args: ['awslabs.aws-documentation-mcp-server@latest'],\n  }),\n})\n\n// MCP client passed directly - connects on first tool use\nconst agentDirect = new Agent({\n  tools: [mcpClientDirect],\n})\n\nawait agentDirect.invoke('What is AWS Lambda?')\n```\n\nTools can also be listed explicitly if needed:\n\n```typescript\n// Explicit tool listing\nconst tools = await mcpClient.listTools()\nconst agentExplicit = new Agent({ tools })\n```"
 }
]
```

## Transport Options

Both Python and TypeScript support multiple transport mechanisms for connecting to MCP servers.

### Standard I/O (stdio)

For command-line tools and local processes that implement the MCP protocol:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom mcp import stdio_client, StdioServerParameters\nfrom strands import Agent\nfrom strands.tools.mcp import MCPClient\n\n# For macOS/Linux:\nstdio_mcp_client = MCPClient(lambda: stdio_client(\n    StdioServerParameters(\n        command=\"uvx\",\n        args=[\"awslabs.aws-documentation-mcp-server@latest\"]\n    )\n))\n\n# For Windows:\nstdio_mcp_client = MCPClient(lambda: stdio_client(\n    StdioServerParameters(\n        command=\"uvx\",\n        args=[\n            \"--from\",\n            \"awslabs.aws-documentation-mcp-server@latest\",\n            \"awslabs.aws-documentation-mcp-server.exe\"\n        ]\n    )\n))\n\nwith stdio_mcp_client:\n    tools = stdio_mcp_client.list_tools_sync()\n    agent = Agent(tools=tools)\n    response = agent(\"What is AWS Lambda?\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst stdioClient = new McpClient({\n  transport: new StdioClientTransport({\n    command: 'uvx',\n    args: ['awslabs.aws-documentation-mcp-server@latest'],\n  }),\n})\n\nconst agentStdio = new Agent({\n  tools: [stdioClient],\n})\n\nawait agentStdio.invoke('What is AWS Lambda?')\n```"
 }
]
```

### Streamable HTTP

For HTTP-based MCP servers that use Streamable HTTP transport:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom mcp.client.streamable_http import streamablehttp_client\nfrom strands import Agent\nfrom strands.tools.mcp import MCPClient\n\nstreamable_http_mcp_client = MCPClient(\n    lambda: streamablehttp_client(\"http://localhost:8000/mcp\")\n)\n\nwith streamable_http_mcp_client:\n    tools = streamable_http_mcp_client.list_tools_sync()\n    agent = Agent(tools=tools)\n```\n\nAdditional properties like authentication can be configured:\n\n```python\nimport os\nfrom mcp.client.streamable_http import streamablehttp_client\nfrom strands.tools.mcp import MCPClient\n\ngithub_mcp_client = MCPClient(\n    lambda: streamablehttp_client(\n        url=\"https://api.githubcopilot.com/mcp/\",\n        headers={\"Authorization\": f\"Bearer {os.getenv('MCP_PAT')}\"}\n    )\n)\n```\n\n#### AWS IAM\n\nFor MCP servers on AWS that use SigV4 authentication with IAM credentials, you can conveniently use the [`mcp-proxy-for-aws`](https://pypi.org/project/mcp-proxy-for-aws/) package to handle AWS credential management and request signing automatically. See the [detailed guide](https://dev.to/aws/no-oauth-required-an-mcp-client-for-aws-iam-k1o) for more information.\n\nFirst, install the package:\n\n```bash\npip install mcp-proxy-for-aws\n```\n\nThen you use it like any other transport:\n\n```python\nfrom mcp_proxy_for_aws.client import aws_iam_streamablehttp_client\nfrom strands.tools.mcp import MCPClient\n\nmcp_client = MCPClient(lambda: aws_iam_streamablehttp_client(\n    endpoint=\"https://your-service.us-east-1.amazonaws.com/mcp\",\n    aws_region=\"us-east-1\",\n    aws_service=\"bedrock-agentcore\"\n))\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst httpClient = new McpClient({\n  transport: new StreamableHTTPClientTransport(\n    new URL('http://localhost:8000/mcp')\n  ) as Transport,\n})\n\nconst agentHttp = new Agent({\n  tools: [httpClient],\n})\n\n// With authentication\nconst githubMcpClient = new McpClient({\n  transport: new StreamableHTTPClientTransport(\n    new URL('https://api.githubcopilot.com/mcp/'),\n    {\n      requestInit: {\n        headers: {\n          Authorization: `Bearer ${process.env.GITHUB_PAT}`,\n        },\n      },\n    }\n  ) as Transport,\n})\n```"
 }
]
```

### Server-Sent Events (SSE)

```sa-tabs
[
 {
  "label": "Python",
  "body": "For HTTP-based MCP servers that use Server-Sent Events transport:\n\n```python\nfrom mcp.client.sse import sse_client\nfrom strands import Agent\nfrom strands.tools.mcp import MCPClient\n\nsse_mcp_client = MCPClient(lambda: sse_client(\"http://localhost:8000/sse\"))\n\nwith sse_mcp_client:\n    tools = sse_mcp_client.list_tools_sync()\n    agent = Agent(tools=tools)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'\n\nconst sseClient = new McpClient({\n  transport: new SSEClientTransport(new URL('http://localhost:8000/sse')),\n})\n\nconst agentSse = new Agent({\n  tools: [sseClient],\n})\n```"
 }
]
```

## Using Multiple MCP Servers

Combine tools from multiple MCP servers in a single agent:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom mcp import stdio_client, StdioServerParameters\nfrom mcp.client.sse import sse_client\nfrom strands import Agent\nfrom strands.tools.mcp import MCPClient\n\n# Create multiple clients\nsse_mcp_client = MCPClient(lambda: sse_client(\"http://localhost:8000/sse\"))\nstdio_mcp_client = MCPClient(lambda: stdio_client(\n    StdioServerParameters(command=\"python\", args=[\"path/to/mcp_server.py\"])\n))\n\n# Manual approach - explicit context management\nwith sse_mcp_client, stdio_mcp_client:\n    tools = sse_mcp_client.list_tools_sync() + stdio_mcp_client.list_tools_sync()\n    agent = Agent(tools=tools)\n\n# Managed approach\nagent = Agent(tools=[sse_mcp_client, stdio_mcp_client])\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst localClient = new McpClient({\n  transport: new StdioClientTransport({\n    command: 'uvx',\n    args: ['awslabs.aws-documentation-mcp-server@latest'],\n  }),\n})\n\nconst remoteClient = new McpClient({\n  transport: new StreamableHTTPClientTransport(\n    new URL('https://api.example.com/mcp/')\n  ) as Transport,\n})\n\n// Pass multiple MCP clients to the agent\nconst agentMultiple = new Agent({\n  tools: [localClient, remoteClient],\n})\n```"
 }
]
```

## Client Configuration

```sa-tabs
[
 {
  "label": "Python",
  "body": "Python\u2019s `MCPClient` supports tool filtering and name prefixing to manage tools from multiple servers.\n\n**Tool Filtering**\n\nControl which tools are loaded using the `tool_filters` parameter:\n\n```python\nfrom mcp import stdio_client, StdioServerParameters\nfrom strands.tools.mcp import MCPClient\nimport re\n\n# String matching - loads only specified tools\nfiltered_client = MCPClient(\n    lambda: stdio_client(StdioServerParameters(\n        command=\"uvx\",\n        args=[\"awslabs.aws-documentation-mcp-server@latest\"]\n    )),\n    tool_filters={\"allowed\": [\"search_documentation\", \"read_documentation\"]}\n)\n\n# Regex patterns\nregex_client = MCPClient(\n    lambda: stdio_client(StdioServerParameters(\n        command=\"uvx\",\n        args=[\"awslabs.aws-documentation-mcp-server@latest\"]\n    )),\n    tool_filters={\"allowed\": [re.compile(r\"^search_.*\")]}\n)\n\n# Combined filters - applies allowed first, then rejected\ncombined_client = MCPClient(\n    lambda: stdio_client(StdioServerParameters(\n        command=\"uvx\",\n        args=[\"awslabs.aws-documentation-mcp-server@latest\"]\n    )),\n    tool_filters={\n        \"allowed\": [re.compile(r\".*documentation$\")],\n        \"rejected\": [\"read_documentation\"]\n    }\n)\n```\n\n**Tool Name Prefixing**\n\nPrevent name conflicts when using multiple MCP servers:\n\n```python\naws_docs_client = MCPClient(\n    lambda: stdio_client(StdioServerParameters(\n        command=\"uvx\",\n        args=[\"awslabs.aws-documentation-mcp-server@latest\"]\n    )),\n    prefix=\"aws_docs\"\n)\n\nother_client = MCPClient(\n    lambda: stdio_client(StdioServerParameters(\n        command=\"uvx\",\n        args=[\"other-mcp-server@latest\"]\n    )),\n    prefix=\"other\"\n)\n\n# Tools will be named: aws_docs_search_documentation, other_search, etc.\nagent = Agent(tools=[aws_docs_client, other_client])\n```"
 },
 {
  "label": "TypeScript",
  "body": "TypeScript\u2019s `McpClient` accepts optional application metadata:\n\n```typescript\nconst mcpClient = new McpClient({\n  applicationName: 'My Agent App',\n  applicationVersion: '1.0.0',\n  transport: new StdioClientTransport({\n    command: 'npx',\n    args: ['-y', 'some-mcp-server'],\n  }),\n})\n```\n\nTool filtering and prefixing are not currently supported in TypeScript."
 }
]
```

## Direct Tool Invocation

While tools are typically invoked by the agent based on user requests, MCP tools can also be called directly:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nresult = mcp_client.call_tool_sync(\n    tool_use_id=\"tool-123\",\n    name=\"calculator\",\n    arguments={\"x\": 10, \"y\": 20}\n)\nprint(f\"Result: {result['content'][0]['text']}\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Get tools and find the target tool\nconst tools = await mcpClient.listTools()\nconst calcTool = tools.find(t => t.name === 'calculator')\n\n// Call directly through the client\nconst result = await mcpClient.callTool(calcTool, { x: 10, y: 20 })\n```"
 }
]
```

## Implementing an MCP Server

Custom MCP servers can be created to extend agent capabilities:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom mcp.server import FastMCP\n\n# Create an MCP server\nmcp = FastMCP(\"Calculator Server\")\n\n# Define a tool\n@mcp.tool(description=\"Calculator tool which performs calculations\")\ndef calculator(x: int, y: int) -> int:\n    return x + y\n\n# Run the server with SSE transport\nmcp.run(transport=\"sse\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'\nimport { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'\nimport { z } from 'zod'\n\nconst server = new McpServer({\n  name: 'Calculator Server',\n  version: '1.0.0',\n})\n\nserver.tool(\n  'calculator',\n  'Calculator tool which performs calculations',\n  {\n    x: z.number(),\n    y: z.number(),\n  },\n  async ({ x, y }) => {\n    return {\n      content: [{ type: 'text', text: String(x + y) }],\n    }\n  }\n)\n\nconst transport = new StdioServerTransport()\nawait server.connect(transport)\n```"
 }
]
```

For more information on implementing MCP servers, see the [MCP documentation](https://modelcontextprotocol.io).

## Advanced Usage

### Elicitation

An MCP server can pause a tool call to request additional input from the user. Configure an elicitation callback on the client to respond to these requests:

```sa-tabs
[
 {
  "label": "Python",
  "body": "The server declares the schema it wants back, and the client returns a matching response:\n\nserver.py\n\n```python\nfrom mcp.server import FastMCP\nfrom pydantic import BaseModel, Field\n\nclass ApprovalSchema(BaseModel):\n    username: str = Field(description=\"Who is approving?\")\n\nserver = FastMCP(\"mytools\")\n\n@server.tool()\nasync def delete_files(paths: list[str]) -> str:\n    result = await server.get_context().elicit(\n        message=f\"Do you want to delete {paths}\",\n        schema=ApprovalSchema,\n    )\n    if result.action != \"accept\":\n        return f\"User {result.data.username} rejected deletion\"\n\n    # Perform deletion...\n    return f\"User {result.data.username} approved deletion\"\n\nserver.run()\n```\n\nclient.py\n\n```python\nfrom mcp import stdio_client, StdioServerParameters\nfrom mcp.types import ElicitResult\nfrom strands import Agent\nfrom strands.tools.mcp import MCPClient\n\nasync def elicitation_callback(context, params):\n    print(f\"ELICITATION: {params.message}\")\n    # Get user confirmation...\n    return ElicitResult(\n        action=\"accept\",\n        content={\"username\": \"myname\"}\n    )\n\nclient = MCPClient(\n    lambda: stdio_client(\n        StdioServerParameters(command=\"python\", args=[\"/path/to/server.py\"])\n    ),\n    elicitation_callback=elicitation_callback,\n)\n\nwith client:\n    agent = Agent(tools=client.list_tools_sync())\n    result = agent(\"Delete 'a/b/c.txt' and share the name of the approver\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "Pass an `elicitationCallback` when constructing the client. The callback receives the request context and the server\u2019s elicitation params, and returns an `ElicitResult`:\n\n```typescript\nconst client = new McpClient({\n  transport: new StdioClientTransport({\n    command: 'python',\n    args: ['/path/to/server.py'],\n  }),\n  elicitationCallback: async (_context, params): Promise<ElicitResult> => {\n    console.log(`ELICITATION: ${params.message}`)\n    // Get user confirmation...\n    return {\n      action: 'accept',\n      content: { username: 'myname' },\n    }\n  },\n})\n\nconst agent = new Agent({ tools: [client] })\nawait agent.invoke(\"Delete 'a/b/c.txt' and share the name of the approver\")\n```"
 }
]
```

For more information on elicitation, see the [MCP specification](https://modelcontextprotocol.io/specification/draft/client/elicitation).

### Progress Notifications

MCP servers can report incremental progress during long-running tool calls. Configure a `progress_callback` on the client to receive these updates:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom mcp import stdio_client, StdioServerParameters\nfrom strands import Agent\nfrom strands.tools.mcp import MCPClient\n\nasync def progress_callback(progress, total, message):\n    pct = f\"{progress}/{total}\" if total is not None else str(progress)\n    label = f\" \u2014 {message}\" if message else \"\"\n    print(f\"Progress: {pct}{label}\")\n\nclient = MCPClient(\n    lambda: stdio_client(\n        StdioServerParameters(command=\"python\", args=[\"/path/to/server.py\"])\n    ),\n    progress_callback=progress_callback,\n)\n\nwith client:\n    agent = Agent(tools=client.list_tools_sync())\n    agent(\"Run the long-running task\")\n```\n\nThe callback receives three arguments:\n\n| Argument | Type | Description |\n| --- | --- | --- |\n| `progress` | `float` | Current progress value reported by the server |\n| `total` | `float | None` | Total value (may be `None` if the server doesn\u2019t report it) |\n| `message` | `str | None` | Optional human-readable status message from the server |\n\nYou can also pass a `progress_callback` directly to `call_tool_sync` or `call_tool_async` to override the instance-level callback for a single call:\n\n```python\nresult = client.call_tool_sync(\n    tool_use_id=\"tool-123\",\n    name=\"long_running_tool\",\n    arguments={\"input\": \"data\"},\n    progress_callback=my_one_off_callback,\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "Progress notifications are not yet supported in the TypeScript SDK."
 }
]
```

## Best Practices

-   **Tool Descriptions**: Provide clear descriptions for tools to help the agent understand when and how to use them
-   **Error Handling**: Return informative error messages when tools fail to execute properly
-   **Security**: Consider security implications when exposing tools via MCP, especially for network-accessible servers
-   **Connection Management**: In Python, always use context managers (`with` statements) to ensure proper cleanup of MCP connections
-   **Timeouts**: Set appropriate timeouts for tool calls to prevent hanging on long-running operations

## Troubleshooting

### MCPClientInitializationError (Python)

Tools relying on an MCP connection must be used within a context manager. Operations will fail when the agent is used outside the `with` statement block.

```python
# Correct
with mcp_client:
    agent = Agent(tools=mcp_client.list_tools_sync())
    response = agent("Your prompt")  # Works

# Incorrect
with mcp_client:
    agent = Agent(tools=mcp_client.list_tools_sync())
response = agent("Your prompt")  # Fails - outside context
```

### Connection Failures

Connection failures occur when there are problems establishing a connection with the MCP server. Verify that:

-   The MCP server is running and accessible
-   Network connectivity is available and firewalls allow the connection
-   The URL or command is correct and properly formatted

### Tool Discovery Issues

If tools aren’t being discovered:

-   Confirm the MCP server implements the `list_tools` method correctly
-   Verify all tools are registered with the server

### Tool Execution Errors

When tool execution fails:

-   Verify tool arguments match the expected schema
-   Check server logs for detailed error information

## Related pages

- [Build with AI](lc:user-guide/build-with-ai) (2 shared tags)
- [Tools Overview](lc:user-guide/concepts/tools) (2 shared tags)
- [Community Built Tools](lc:user-guide/concepts/tools/community-tools-package) (1 shared tag)
- [Creating Custom Tools](lc:user-guide/concepts/tools/custom-tools) (1 shared tag)
- [Vended Tools](lc:user-guide/concepts/tools/vended-tools) (1 shared tag)
- [OpenAI Responses API](lc:user-guide/concepts/model-providers/openai-responses) (1 shared tag)
- [Agents as Tools with Strands Agents SDK](lc:user-guide/concepts/multi-agent/agents-as-tools) (1 shared tag)
- [Agent Configuration](lc:user-guide/concepts/experimental/agent-config) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/tools/mcp/mcp_client.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/mcp/mcp_client.py)
- [harness-sdk/strands-py/src/strands/tools/mcp/mcp_agent_tool.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/mcp/mcp_agent_tool.py)

### TypeScript

- [harness-sdk/strands-ts/src/tools/mcp-tool.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/tools/mcp-tool.ts)
