AI coding assistants work best when they have access to current documentation. Strands Agents provides two ways to give your AI tools the context they need: an **MCP server** for interactive documentation search, and **llms.txt files** for bulk documentation access.

## Strands Agents MCP Server

The [Strands Agents MCP server](https://github.com/strands-agents/harness-sdk/tree/main/strands-mcp) gives AI coding assistants direct access to the Strands Agents documentation through the [Model Context Protocol (MCP)](https://modelcontextprotocol.io). It provides intelligent search with TF-IDF based ranking, section-based browsing for token-efficient retrieval, and on-demand content fetching so your AI tools can find and retrieve exactly the documentation they need.

### Prerequisites

The MCP server requires [uv](https://github.com/astral-sh/uv) to be installed on your system. Follow the [official installation instructions](https://github.com/astral-sh/uv#installation) to set it up.

### Setup

Choose your AI coding tool below and follow the setup instructions.

```sa-tabs
[
 {
  "label": "Strands",
  "body": "You can use the Strands Agents MCP server as a tool within your own Strands agents:\n\n```sa-tabs\n[\n {\n  \"label\": \"Python\",\n  \"body\": \"```python\\nfrom mcp import stdio_client, StdioServerParameters\\nfrom strands import Agent\\nfrom strands.tools.mcp import MCPClient\\n\\nmcp_client = MCPClient(lambda: stdio_client(\\n    StdioServerParameters(\\n        command=\\\"uvx\\\",\\n        args=[\\\"strands-agents-mcp-server\\\"]\\n    )\\n))\\n\\nagent = Agent(tools=[mcp_client])\\nagent(\\\"How do I create a custom tool in Strands Agents?\\\")\\n```\"\n },\n {\n  \"label\": \"TypeScript\",\n  \"body\": \"```typescript\\nconst mcpClient = new McpClient({\\n  transport: new StdioClientTransport({\\n    command: 'uvx',\\n    args: ['strands-agents-mcp-server'],\\n  }),\\n})\\n\\nconst agent = new Agent({ tools: [mcpClient] })\\nawait agent.invoke('How do I create a custom tool in Strands Agents?')\\n\\nawait mcpClient.disconnect()\\n```\"\n }\n]\n```\n\nSee the [MCP tools documentation](lc:user-guide/concepts/tools/mcp-tools) for more details on using MCP tools with Strands agents."
 },
 {
  "label": "Kiro",
  "body": "Add the following to `~/.kiro/settings/mcp.json`:\n\n```json\n{\n  \"mcpServers\": {\n    \"strands-agents\": {\n      \"command\": \"uvx\",\n      \"args\": [\"strands-agents-mcp-server\"],\n      \"disabled\": false,\n      \"autoApprove\": [\"search_docs\", \"fetch_doc\"]\n    }\n  }\n}\n```\n\nSee the [Kiro MCP documentation](https://kiro.dev/docs/mcp/configuration/) for more details."
 },
 {
  "label": "Claude Code",
  "body": "Run the following command:\n\n```bash\nclaude mcp add strands uvx strands-agents-mcp-server\n```\n\nSee the [Claude Code MCP documentation](https://docs.anthropic.com/en/docs/claude-code/tutorials#configure-mcp-servers) for more details."
 },
 {
  "label": "Cursor",
  "body": "Add the following to `~/.cursor/mcp.json`:\n\n```json\n{\n  \"mcpServers\": {\n    \"strands-agents\": {\n      \"command\": \"uvx\",\n      \"args\": [\"strands-agents-mcp-server\"]\n    }\n  }\n}\n```\n\nSee the [Cursor MCP documentation](https://docs.cursor.com/context/model-context-protocol#configuring-mcp-servers) for more details."
 },
 {
  "label": "VS Code",
  "body": "Add the following to your `mcp.json` file:\n\n```json\n{\n  \"servers\": {\n    \"strands-agents\": {\n      \"command\": \"uvx\",\n      \"args\": [\"strands-agents-mcp-server\"]\n    }\n  }\n}\n```\n\nSee the [VS Code MCP documentation](https://code.visualstudio.com/docs/copilot/customization/mcp-servers) for more details."
 },
 {
  "label": "Other",
  "body": "The Strands Agents MCP server works with [40+ applications that support MCP](https://modelcontextprotocol.io/clients). The general configuration is:\n\n-   **Command:** `uvx`\n-   **Args:** `[\"strands-agents-mcp-server\"]`"
 }
]
```

### Verify the connection

You can test the MCP server using the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector):

```bash
npx @modelcontextprotocol/inspector uvx strands-agents-mcp-server
```

## llms.txt files

The Strands Agents documentation site provides [llms.txt](https://llmstxt.org/) files optimized for AI consumption. These are static files containing the full documentation in plain markdown, suitable for feeding directly into an LLM’s context window.

### Available endpoints

| Endpoint | Description |
| --- | --- |
| [`/llms.txt`](https://strandsagents.com/docs/llms.txt/) | Index file with links to all documentation pages in raw markdown format |
| [`/llms-full.txt`](https://strandsagents.com/docs/llms-full.txt/) | Complete documentation content in a single file (excludes API reference) |

### Raw markdown convention

Every documentation page is available in raw markdown format by appending `/index.md` to its URL path:

-   [`/docs/user-guide/quickstart/`](https://strandsagents.com/docs/user-guide/quickstart/) → [`/docs/user-guide/quickstart/index.md`](https://strandsagents.com/docs/user-guide/quickstart/index.md)
-   [`/docs/user-guide/concepts/tools/`](https://strandsagents.com/docs/user-guide/concepts/tools/) → [`/docs/user-guide/concepts/tools/index.md`](https://strandsagents.com/docs/user-guide/concepts/tools/index.md)

This gives you clean markdown content without HTML markup, navigation, or styling.

### When to use llms.txt

The llms.txt files are useful when:

-   Your AI tool does not support MCP
-   You want to provide full documentation context in a single prompt
-   You are building custom tooling around the documentation

Note

> [!NOTE]
>
> The llms-full.txt file contains the entire documentation and can be large. For most use cases, the MCP server provides a more token-efficient way to access documentation.

## Tips for AI-assisted Strands development

-   **Use the MCP server over llms.txt when possible** — it retrieves only the relevant sections, saving tokens and improving accuracy.
-   **Start from examples** — point your AI tool at the [examples](lc:examples) for common patterns like [multi-agent systems](lc:examples/python/multi_agent_example/multi_agent_example), [structured output](lc:examples/structured_output), and [tool use](lc:examples/python/mcp_calculator).
-   **Review AI-generated code** — always verify that generated code follows the patterns in the official documentation, especially for model provider configuration and tool definitions.
-   **Use project rules** — many AI coding tools support project-level instructions (e.g., `.cursorrules`, `CLAUDE.md`). Add Strands-specific conventions to keep AI output consistent across your project.

## Related pages

- [Model Context Protocol (MCP) Tools](lc:user-guide/concepts/tools/mcp-tools) (2 shared tags)
- [Tools Overview](lc:user-guide/concepts/tools) (2 shared tags)
- [Community Built Tools](lc:user-guide/concepts/tools/community-tools-package) (1 shared tag)
- [Creating Custom Tools](lc:user-guide/concepts/tools/custom-tools) (1 shared tag)
- [Vended Tools](lc:user-guide/concepts/tools/vended-tools) (1 shared tag)
- [OpenAI Responses API](lc:user-guide/concepts/model-providers/openai-responses) (1 shared tag)
- [Agents as Tools with Strands Agents SDK](lc:user-guide/concepts/multi-agent/agents-as-tools) (1 shared tag)
- [Agent Configuration](lc:user-guide/concepts/experimental/agent-config) (1 shared tag)
