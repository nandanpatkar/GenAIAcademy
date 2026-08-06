Managed Deep Agents support the normal Deep Agents `tools` configuration surface. Define LangChain tools in your project, import them into `agent.py` or `agent.ts`, and pass them to `define_deep_agent` or `defineDeepAgent`.


> [!NOTE]
>
> Managed Deep Agents is in **private [beta](lc:langsmith/release-stages)**, available on [LangSmith Cloud](lc:langsmith/cloud) in the US region only. [Join the waitlist](https://www.langchain.com/langsmith-managed-deep-agents-waitlist) to request access.


## Authored tools and connector tools

Managed Deep Agents can use two kinds of tools:

| Tool source | Where you configure it | Runtime behavior |
| --- | --- | --- |
| Authored tools | `agent.py` or `agent.ts` imports from your project source | Managed Deep Agents copies the source into the compiled build and passes the tools to Deep Agents. |
| MCP connector tools | `connectors/mcp.py` or `connectors/mcp.ts` | Managed Deep Agents loads remote MCP tools at runtime and appends them to authored tools. |

Use authored tools for business logic, private APIs, database access, and other code that belongs in your agent project. Use [MCP connectors](lc:langsmith/managed-deep-agents-connectors/mcp) when the tool surface is exposed by a remote MCP server.

For more about LangChain tool definitions, see [Tools](lc:oss/python/langchain/tools).

## Add a tool module

Put custom tool code under `tools/` in your project and import it from the agent entry. For the full project layout, see the [CLI project file reference](lc:langsmith/managed-deep-agents-cli#project-file-reference).

```python tools/customer.py
from langchain.tools import tool

@tool(parse_docstring=True)
def lookup_customer(customer_id: str) -> str:
    """Look up a customer record by ID.

    Args:
        customer_id: Customer ID from the CRM.
    """
    return f"Customer {customer_id} is on the enterprise plan."
```

## Attach tools to the agent

Import the tools into the project-root agent entry and pass them in the `tools` list.

```python agent.py
from managed_deepagents import define_deep_agent

from tools.customer import lookup_customer

agent = define_deep_agent(
    name="support-agent",
    model="openai:gpt-5.5",
    tools=[lookup_customer],
)
```

`mda dev` and `mda deploy` copy the project files into the compiled build. Your imports should work the same way they do in a normal local Python or TypeScript project.


> [!TIP]
>
> Use clear, unique tool names. MCP connector tools are appended after authored tools, and connector names are prefixed by default to avoid collisions.


## Use secrets and context

Tools can read deployment secrets from environment variables. Put local values in `.env` for `mda dev`; `mda deploy` forwards non-reserved `.env` values as hosted deployment secrets.

When the project declares [identity](lc:langsmith/managed-deep-agents-identity), tools and middleware receive a frozen `runtime.identity` envelope for the authenticated caller. Prefer that over client-supplied configurable keys for actor or tenant ids.

For other per-run values such as request metadata or feature flags, use the normal LangChain runtime context patterns for tools. See [how to access context from within your tools](lc:oss/python/langchain/tools#access-context).

## Test and deploy


Test the project locally with [`mda dev`](lc:langsmith/managed-deep-agents-cli#develop-locally), then deploy it with [`mda deploy`](lc:langsmith/managed-deep-agents-deploy). Open deployment traces in LangSmith to inspect model calls, tool calls, errors, and latency.
