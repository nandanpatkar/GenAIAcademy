Deploying a Managed Deep Agent compiles a code-first project into a managed LangGraph app, syncs deploy-owned context to [Context Hub](lc:langsmith/use-the-context-hub), uploads the compiled source, and triggers a LangSmith hosted deployment build.


> [!NOTE]
>
> Managed Deep Agents is in **private [beta](lc:langsmith/release-stages)**, available on [LangSmith Cloud](lc:langsmith/cloud) in the US region only. [Join the waitlist](https://www.langchain.com/langsmith-managed-deep-agents-waitlist) to request access.


This page covers secrets routing, local development behavior, sandbox configuration, and deploy tips. For command flags, the deploy step list, and troubleshooting, see the [CLI reference](lc:langsmith/managed-deep-agents-cli).


> [!TIP]
>
> For a conceptual walkthrough of compilation, the deploy lifecycle diagram, Context Hub, threads, and sandboxes, see [How Managed Deep Agents work](lc:langsmith/managed-deep-agents-how-it-works).


## Prerequisites

Before you deploy, make sure you have:

- A workspace with Managed Deep Agents [private beta access](https://www.langchain.com/langsmith-managed-deep-agents-waitlist).
- A [LangSmith API key](lc:langsmith/create-account-api-key) for that workspace, either in `.env` or your shell environment.
- The `mda` CLI installed from `managed-deepagents`.
- Project dependencies installed with `npm install` for TypeScript projects or `uv sync` for generated Python projects.
- Model provider credentials, such as `OPENAI_API_KEY`, in `.env`, your shell environment, or LangSmith workspace secrets.

The CLI targets US LangSmith Cloud by default.

## Project files

A Managed Deep Agents project starts with an agent entry and optional project folders. Create a project with `mda init`, or adapt an existing TypeScript or Python project by adding `agent.ts`, `agent.tsx`, or `agent.py` at the project root.

For the full file layout and packaging rules, see the [CLI project file reference](lc:langsmith/managed-deep-agents-cli#project-file-reference). To define the agent entry, tools, middleware, and interrupts, see the [quickstart](lc:langsmith/managed-deep-agents-quickstart#edit-the-agent).


The managed runtime owns `backend`, `store`, `checkpointer`, `memory`, `skills`, and the system prompt. Do not set those fields in the agent definition.

| Concern | Owner | Where you configure it |
| --- | --- | --- |
| `name` | You | Required in the agent definition; used as the assistant ID and default deployment name. |
| `backend`, `store`, `checkpointer` | Managed runtime | Not configurable. |
| `memory` | Managed runtime, backed by Context Hub | `disableMemory` / `disable_memory` to turn off agent-scoped memory. |
| `skills` | Managed runtime, backed by Context Hub | `skills/**` in the project. |
| System prompt | Managed runtime, backed by Context Hub | `instructions.md` in the project. |
| Model, tools, middleware, subagents, interrupts | You | The agent definition and imported modules. |

For the full field list, see the [agent definition reference](lc:langsmith/managed-deep-agents-cli#agent-definition-reference).


## Configure instructions, skills, and memory

Put the system prompt in `instructions.md` next to the project-root agent entry file:

```markdown instructions.md
# Assistant

You are a careful assistant. Use available tools when needed and cite sources.
```

Put deploy-owned skills under `skills/` next to the project-root agent entry file. Deploy syncs `instructions.md` and `skills/**` to the Context Hub repo associated with the deployment.

Managed memory is stored in the same Context Hub repo under `memories/**` and remounted for the agent as `/memories/user/` (hot `/memories/user/AGENTS.md`). Deploy syncs `instructions.md` and `skills/**`, but preserves memory and does not overwrite `memories/**`. To disable managed memory, set `disableMemory: true` or `disable_memory=True` in the agent definition.

## Add tools, connectors, and middleware

Add authored tools and middleware directly in the agent source. Managed Deep Agents copies your project files into the compiled build, so imports from `tools/`, `middleware/`, or other local modules work like they do in a normal Python or TypeScript project.

- Use [custom tools](lc:langsmith/managed-deep-agents-tools) for business logic, private APIs, database access, and other project-owned code.
- Use [custom middleware](lc:langsmith/managed-deep-agents-middleware) for cross-cutting behavior around model calls, tool calls, lifecycle hooks, retries, limits, and data handling.
- Declare remote MCP servers in `connectors/mcp.ts` or `connectors/mcp.py`; Managed Deep Agents loads those connector tools and appends them to the authored tools at runtime. For examples and guidance, see [Connectors](lc:langsmith/managed-deep-agents-connectors/index).
- Optionally declare [identity](lc:langsmith/managed-deep-agents-identity) in `identity.ts` or `identity.py` to authenticate callers and scope threads and memory.

To pause for human approval before sensitive tool calls, set `interrupt_on` in the agent definition. See [Human-in-the-loop](lc:langsmith/managed-deep-agents-middleware#human-in-the-loop).

## Add schedules

Add managed cron schedules under `schedules/` when the agent should run on a recurring cadence. Each schedule file exports a named `schedule` declaration created with `defineSchedule` or `define_schedule`.

For examples and schedule constraints, see [Schedules](lc:langsmith/managed-deep-agents-schedules).

## Configure a sandbox

Use a sandbox when the agent needs isolated code execution or filesystem work. Export `sandbox` from `sandbox/index.ts` or `sandbox/__init__.py`.

```python sandbox/__init__.py
from managed_deepagents import define_sandbox
from deepagents.backends import LangSmithSandbox

sandbox = define_sandbox(
    LangSmithSandbox,
    scope="thread",
    idle_ttl_seconds=600,
    default_timeout=600,
)
```

Sandbox scope controls reuse:

- `thread` (default): Each durable thread or conversation gets its own sandbox.
- `agent`: All threads handled by the agent process share one sandbox.

If `sandbox/setup.sh` exists, Managed Deep Agents runs it once when a new managed sandbox is provisioned. Use it to install packages, seed files, or prepare workspace state.

For sandbox scope and lifecycle during local development, see [How Managed Deep Agents work](lc:langsmith/managed-deep-agents-how-it-works#sandboxes).

## Run locally

Run the local LangGraph dev server:

```bash
mda dev .
```

`mda dev` compiles into `.mda/build` and starts the matching LangGraph dev server from that directory. Pass `--port`, `--hostname`, `--browser`, or `--no-reload` to forward local dev server options.

For local development, `mda dev` stages the project `.env` file into `.mda/build/.env` so LangGraph can load model provider keys and connector tokens.

For Python projects, `mda dev` requires `uv` on `PATH` and resolves the local LangGraph dev server automatically.

When a sandbox is configured, `mda dev` tries the configured provider and falls back to a local temp-directory sandbox when provider credentials are unavailable. The local fallback is intended only for development.

For all `mda dev` flags, see the [CLI reference](lc:langsmith/managed-deep-agents-cli#develop-locally).

## Deploy to LangSmith

Deploy the local project:

```bash
mda deploy .
```


> [!TIP]
>
> `mda deploy` routes local project inputs to different managed surfaces:
>
> ```text
> instructions.md + skills/**  -> Context Hub deploy-owned context
> memories/**                  -> ignored; existing Context Hub memory is preserved
> .env                         -> deploy auth + non-reserved hosted secrets, not archived
> project source files         -> .mda/build source archive -> hosted deployment
> schedules/**                 -> LangSmith cron jobs after the deployment is live
> ```


Set the deployment name explicitly when the directory name is not the name you want:

```bash
mda deploy . --name research-assistant
```

Use `--deployment-type prod` when creating a production deployment:

```bash
mda deploy . --deployment-type prod
```

Use `--no-wait` to trigger the build without polling for completion:

```bash
mda deploy . --no-wait
```

When `--no-wait` is set, schedule reconciliation is skipped for that deploy invocation because the CLI exits before the deployment reaches `DEPLOYED`.

On success, the CLI prints the LangSmith deployment dashboard URL. For the full deploy step list, see the [CLI reference](lc:langsmith/managed-deep-agents-cli#deploy-projects).

## Secrets and environment files

`mda deploy` reads project `.env` values before shell environment variables. Use `.env` for the LangSmith API key that authenticates the deploy and for runtime secrets the hosted deployment needs:

```text .env
LANGSMITH_API_KEY=<LANGSMITH_API_KEY>
OPENAI_API_KEY=<OPENAI_API_KEY>
GITHUB_MCP_TOKEN=<GITHUB_MCP_TOKEN>
DATABASE_URL=<DATABASE_URL>
```

`LANGSMITH_API_KEY`, `LANGGRAPH_HOST_API_KEY`, `LANGCHAIN_API_KEY`, and other platform variables are reserved. They can authenticate the deploy, but they are not uploaded as user-managed deployment secrets.

Non-reserved `.env` entries, such as model provider keys, MCP tokens, channel secrets, and custom tool credentials, are forwarded as hosted deployment secrets when `mda deploy` creates or updates the deployment. If the configured model requires a provider key, deploy fails before upload unless that key is available from `.env`, the shell environment, or LangSmith workspace secrets. When the provider key is only in the shell environment, `mda deploy` forwards it as a secret for that deploy. When the project declares `channels/`, deploy also preflights each channel manifest’s `requiredEnv` (for example Slack or GitHub App secrets)—see [Channels](lc:langsmith/managed-deep-agents-channels/index).

Reserved platform variables, empty values, `.env`, and `.env.*` files are not copied into the compiled build archive.

For authentication key order and reserved variables, see the [CLI reference](lc:langsmith/managed-deep-agents-cli#authentication).

## Troubleshoot a deploy

For deploy troubleshooting, see the [CLI reference](lc:langsmith/managed-deep-agents-cli#troubleshooting).

If a deployment reaches `BUILD_FAILED` or `DEPLOY_FAILED`, open the printed deployment URL in LangSmith and inspect the revision logs.

## Next steps

  ### [Identity](#)
Authenticate callers and scope threads and memory.

  ### [Connectors](#)
Attach MCP servers or constrained LangSmith capabilities.

  ### [Channels](#)
Receive Slack Events and configure channel secrets.

  ### [Schedules](#)
Run agents on managed cron schedules.

  ### [Custom tools](#)
Add authored LangChain tools to the agent definition.

  ### [CLI reference](#)
Look up every `mda` command and flag.
