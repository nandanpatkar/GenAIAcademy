Managed Deep Agents use MCP connectors to load tools from remote MCP servers. Declare the servers in `connectors/mcp.ts` or `connectors/mcp.py`, export a named `mcp` declaration, and Managed Deep Agents loads those tools into the agent at runtime.


> [!NOTE]
>
> Managed Deep Agents is in **private [beta](lc:langsmith/release-stages)**, available on [LangSmith Cloud](lc:langsmith/cloud) in the US region only. [Join the waitlist](https://www.langchain.com/langsmith-managed-deep-agents-waitlist) to request access.


For other connector types, and how connectors differ from channels and identity connect, see [Connectors](lc:langsmith/managed-deep-agents-connectors/index) and [Choose the right integration](lc:langsmith/managed-deep-agents-connectors/index#choose-the-right-integration).

Managed Deep Agents configures MCP servers through the `connectors/mcp` module shown on this page, not through a CLI command. The `mda` CLI has no MCP server management commands, so do not use older `deepagents mcp-servers ...` examples in a Managed Deep Agents project.

## Add an MCP connector

Add `connectors/mcp.py` or `connectors/mcp.ts` next to your [agent entry file](lc:langsmith/managed-deep-agents-cli#agent-entry).

The connector module must export a named `mcp` declaration.

```python connectors/mcp.py
from managed_deepagents.connectors import define_mcp_servers

mcp = define_mcp_servers(
    mcp_servers={
        "langchainDocs": {
            "transport": "http",
            "url": "https://docs.langchain.com/mcp",
        },
    },
)
```

You do not import `MultiServerMCPClient` or call `getTools()` / `get_tools()` yourself. `mda` discovers the connector module, injects the MCP adapter dependency into the compiled build, creates the client in the managed runtime, loads the tools, and appends them to the [authored tools](lc:langsmith/managed-deep-agents-tools) from `agent.ts` or `agent.py`.

## Supported MCP servers

Connectors support remote MCP servers only:

| Transport | Use |
| --- | --- |
| `http` | Streamable HTTP MCP servers. |
| `sse` | Legacy SSE MCP servers. |

To connect a legacy SSE server, set `transport` to `sse` on the server config; the remaining fields match the `http` examples above.

Stdio MCP servers are not supported in connectors. If a server needs local process management, expose it over HTTP/SSE or wrap the behavior as a normal authored tool.

## Configure server options

Each server key is the logical server name Managed Deep Agents uses for validation, tracing metadata, and tool-name prefixing. Server configs can include static headers.

Connectors do not run an OAuth authorization flow. If an MCP server requires OAuth, provide a pre-provisioned access token or another static credential through headers. Store the token in `.env` (see the security warning below).

The connector module is normal project code, so read secrets as environment variables with `os.environ` in Python or `process.env` in TypeScript. You do not load or parse the `.env` file directly.

```python connectors/mcp.py
from managed_deepagents.connectors import define_mcp_servers

mcp = define_mcp_servers(
    mcp_servers={
        "github": {
            "transport": "http",
            "url": "https://example.com/mcp",
            "headers": {
                "Authorization": f"Bearer {os.environ['GITHUB_MCP_TOKEN']}",
            },
        },
    },
)
```


> [!WARNING]
>
> **Security warning:** Do not commit MCP tokens, API keys, OAuth access tokens, or passwords. Put local values in `.env`; `mda dev` loads them for local development, and `mda deploy` forwards non-reserved `.env` values as hosted deployment secrets. Reserved platform variables such as `LANGSMITH_API_KEY` are not forwarded; for the full list, see the [CLI authentication reference](lc:langsmith/managed-deep-agents-cli#authentication).


## MCP connector defaults

Managed Deep Agents applies these default options when it loads connector tools:

| Option (Python / TypeScript) | Default | Description |
| --- | --- | --- |
| `prefix_tool_name_with_server_name` / `prefixToolNameWithServerName` | `true` | Prefix MCP tool names with the server name, for example `github__search`, to avoid collisions. |
| `throw_on_load_error` / `throwOnLoadError` | `true` | Fail when tools cannot be loaded instead of starting with a partial tool surface. |
| `use_standard_content_blocks` / `useStandardContentBlocks` | `true` | Convert MCP tool outputs to standard LangChain content blocks. Python connectors currently require the default `true` value. |
| `on_connection_error` / `onConnectionError` | `"throw"` | Fail when a server cannot be reached. `"throw"` is the only supported value. |

Disable tool-name prefixing only when you know the MCP tool names do not collide. With prefixing disabled, Managed Deep Agents checks the loaded MCP tools for duplicate names.

## Test and deploy


Test the project locally with [`mda dev`](lc:langsmith/managed-deep-agents-cli#develop-locally), then deploy it with [`mda deploy`](lc:langsmith/managed-deep-agents-deploy). Open deployment traces in LangSmith to inspect model calls, tool calls, errors, and latency.


MCP misconfiguration surfaces during local startup or first tool load, depending on when the runtime reaches the MCP server. For deploy symptoms and fixes, see [Troubleshooting](lc:langsmith/managed-deep-agents-cli#troubleshooting).

## Next steps

  ### [Connectors](#)
Compare MCP and LangSmith connector types.

  ### [Custom tools](#)
Add authored tools alongside MCP connector tools.

  ### [Deploy an agent](#)
Run and deploy the connector-enabled agent.
