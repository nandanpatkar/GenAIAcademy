Connectors extend an agent with external tools and capabilities, remote MCP tools, constrained LangSmith operations, and GitHub sandbox access, without wiring up your own clients, OAuth flows, or credential plumbing. Managed Deep Agents discovers connector modules under `connectors/`. Each file directly under that folder is a connector; you do not register connectors in the [agent entry](lc:langsmith/managed-deep-agents-cli#agent-entry) (`agent.py` or `agent.ts`).


> [!NOTE]
>
> Managed Deep Agents is in **private [beta](lc:langsmith/release-stages)**, available on [LangSmith Cloud](lc:langsmith/cloud) in the US region only. [Join the waitlist](https://www.langchain.com/langsmith-managed-deep-agents-waitlist) to request access.


## Connector types

| Connector | File | What it does |
| --- | --- | --- |
| [MCP](lc:langsmith/managed-deep-agents-connectors/mcp) | `connectors/mcp.{py\|ts}` | Loads tools from remote MCP servers at runtime and appends them to authored tools. |
| [LangSmith](lc:langsmith/managed-deep-agents-connectors/langsmith) | `connectors/langsmith.{py\|ts}` | Lets browsers and other untrusted callers invoke allowlisted LangSmith operations without receiving `LANGSMITH_API_KEY`. Requires [identity](lc:langsmith/managed-deep-agents-identity). |
| [GitHub](lc:langsmith/managed-deep-agents-connectors/github) | `connectors/github.{py\|ts}` | Clones repositories, installs `gh`, and injects credentials into the managed sandbox. |

For the full project layout, see the [CLI project file reference](lc:langsmith/managed-deep-agents-cli#project-file-reference).

## Choose the right integration

| You want to | Use |
| --- | --- |
| Add tools, HTTP capabilities, or sandbox setup | A connector |
| Receive provider webhooks and optionally reply | A [channel](lc:langsmith/managed-deep-agents-channels/index) |
| Let a signed-in user link an external account | Identity connect under [identity](lc:langsmith/managed-deep-agents-identity) |

For example, the [GitHub connector](lc:langsmith/managed-deep-agents-connectors/github) prepares repositories in a sandbox, while the [GitHub channel](lc:langsmith/managed-deep-agents-channels/github) receives App webhooks.

## Combine connectors with authored tools

Use [custom tools](lc:langsmith/managed-deep-agents-tools) for business logic, private APIs, database access, and other project-owned code. Use [custom middleware](lc:langsmith/managed-deep-agents-middleware) for cross-cutting behavior around model calls, tool calls, lifecycle hooks, retries, limits, and data handling.

MCP connector tools are appended to the tools you define in the agent entry. LangSmith capabilities are exposed on separate HTTP routes scoped by [identity](lc:langsmith/managed-deep-agents-identity).

## Test and deploy


Test the project locally with [`mda dev`](lc:langsmith/managed-deep-agents-cli#develop-locally), then deploy it with [`mda deploy`](lc:langsmith/managed-deep-agents-deploy). Open deployment traces in LangSmith to inspect model calls, tool calls, errors, and latency.


Connector misconfiguration surfaces during local startup or first tool load. LangSmith capability calls return 401 without a resolved identity and 403 when ownership checks fail. For deploy symptoms and fixes, see [Troubleshooting](lc:langsmith/managed-deep-agents-cli#troubleshooting).

## Next steps

  ### [MCP connector](#)
Load tools from remote MCP servers.

  ### [LangSmith connector](#)
Expose constrained LangSmith capabilities to untrusted callers.

  ### [GitHub connector](#)
Prepare repositories, the GitHub CLI, and credentials in a sandbox.

  ### [Identity](#)
Authenticate callers required by the LangSmith connector.

  ### [CLI reference](#)
Look up connector project file rules.
