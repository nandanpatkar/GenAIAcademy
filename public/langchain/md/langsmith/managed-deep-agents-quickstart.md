Deploy a hosted Deep Agent without setting up infrastructure. This quickstart scaffolds a code-first project, runs the agent locally, edits the managed system prompt, and deploys it with `mda`. To build a fuller agent step by step, follow the [tutorial](lc:langsmith/managed-deep-agents-tutorial).

For the full deploy workflow and all CLI flags, see [Deploy an agent](lc:langsmith/managed-deep-agents-deploy) and the [CLI reference](lc:langsmith/managed-deep-agents-cli).


> [!NOTE]
>
> Managed Deep Agents is in **private [beta](lc:langsmith/release-stages)**, available on [LangSmith Cloud](lc:langsmith/cloud) in the US region only. [Join the waitlist](https://www.langchain.com/langsmith-managed-deep-agents-waitlist) to request access.


## Prerequisites


Before you start, make sure you have:

- An organization with Managed Deep Agents [private beta access](https://www.langchain.com/langsmith-managed-deep-agents-waitlist).
- A [LangSmith API key](lc:langsmith/create-account-api-key).
- Python and `uv` for Python projects, or Node.js and npm for TypeScript projects.
- An API key for your model provider of choice.


## Create and deploy an agent

  #### Step: Install the package

Install `managed-deepagents` for the language you want to author in. Both packages include the `mda` CLI.

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install --pre managed-deepagents"
 },
 {
  "label": "npm",
  "lang": "bash",
  "code": "npm install -g managed-deepagents@dev"
 }
]
```

For Python, the `pip` command installs the `mda` CLI. After you scaffold a project, run `uv sync` inside that project to install the dependencies from its generated `pyproject.toml`.

  

  #### Step: Create a project

Create a Managed Deep Agents project:

```bash
mda init research-assistant
cd research-assistant
```

The CLI detects `pyproject.toml` or `package.json` in the current directory. If it cannot infer a language, it prompts you to choose Python or TypeScript.

The scaffold creates:

| File | Purpose |
| --- | --- |
| `agent.py` or `agent.ts` | The named `agent` definition compiled by `mda`. |
| `instructions.md` | Managed system prompt embedded locally and synced to Context Hub on deploy. |
| `pyproject.toml` or `package.json` | Minimal project manifest with `managed-deepagents`. |
| `README.md` | Local project notes and deploy command. |
| `.env` | Deploy auth and runtime secrets. Do not commit real secrets. |
| `.gitignore` | Ignores `.env`, `.env.*`, `.mda/`, and dependency caches. |
| `sandbox/` | Managed LangSmith sandbox declaration. Delete it to opt out. |
| `evals/` | Example Harbor tasks for `mda evals compile`. |

For the full project layout, see the [CLI project file reference](lc:langsmith/managed-deep-agents-cli#project-file-reference).

  

  #### Step: Add API keys to `.env`

Open the generated `.env` file and add your LangSmith API key plus the provider key for the model you plan to use:

```text .env
LANGSMITH_API_KEY=<LANGSMITH_API_KEY>
OPENAI_API_KEY=<OPENAI_API_KEY>
```

`LANGSMITH_API_KEY` authenticates `mda deploy`. Provider keys, MCP tokens, database URLs, and other non-reserved `.env` values are sent to the hosted deployment as secrets when you deploy. The `.env` file itself is not uploaded in the source archive.

The CLI targets US LangSmith Cloud by default. To deploy with an organization-scoped key, set `LANGSMITH_TENANT_ID` in `.env` or pass `--tenant-id` to `mda deploy`.


> [!NOTE]
>
> If a request returns 401 or 403, confirm the key belongs to a workspace with beta access.


  

  #### Step: Edit the agent

Open the generated `agent.py` or `agent.ts` and configure the model, tools, middleware, and interrupts in code.

```python agent.py
from managed_deepagents import define_deep_agent

agent = define_deep_agent(
    name="research-assistant",
    model="openai:gpt-5.5",
)
```

`name` is required. It becomes the LangGraph assistant ID and the default LangSmith deployment name.


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


The generated model uses OpenAI. If you use another provider, change the model identifier and set the API key required by that provider in `.env`, your shell environment, or LangSmith workspace secrets.

  

  #### Step: Edit the instructions

Open `instructions.md` and replace the generated prompt with the behavior you want:

```markdown instructions.md
# Research assistant

You are a careful research assistant. Search for sources, keep notes, and return
concise answers with citations.
```

`mda dev` embeds this file into the generated local entry module. `mda deploy` syncs it to Context Hub and the deployed runtime reads it from there.

  

  #### Step: Run locally

Install the generated project dependencies, then start the local LangGraph dev server:

```lc-tabs
[
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv sync\nmda dev ."
 },
 {
  "label": "npm",
  "lang": "bash",
  "code": "npm install\nmda dev ."
 }
]
```

For TypeScript projects, `mda dev` runs `npx --yes @langchain/langgraph-cli dev`. For Python projects, it uses `uv` to resolve and run the local LangGraph dev server automatically. You do not need to install `langgraph-cli[inmem]` yourself.

`mda dev` loads the project `.env` file from the compiled local build so model provider keys and connector tokens are available during local development.

  

  #### Step: Deploy the agent

Deploy the local project:

```bash
mda deploy .
```

On success, the CLI prints the LangSmith deployment dashboard URL:

```text
Deployment live
Deployment dashboard
https://smith.langchain.com/o/<tenant-id>/host/deployments/<deployment-id>
Deployed 'research-assistant' to LangSmith.
```

Open the printed URL in LangSmith to inspect build status, revisions, and traces.

  

## Next steps


### [Tutorial](#)
Build a scheduled research agent from an empty directory.

  ### [How it works](#)
Understand compilation, the deploy lifecycle, and Context Hub.

  ### [Identity](#)
Scope threads and memory to the authenticated caller.

  ### [Memory](#)
Persist preferences across threads with Context Hub `/memories`.

  ### [Evals](#)
Compile a Harbor handoff and run Harbor-style tasks.

  ### [Custom tools](#)
Add authored LangChain tools from your project source.

  ### [Custom middleware](#)
Add built-in or custom middleware around model and tool calls.

  ### [Connectors](#)
Attach remote MCP servers or constrained LangSmith capabilities.

  ### [Channels](#)
Receive Slack Events and reply from messaging channels.

  ### [Schedules](#)
Run agents on managed cron schedules.

  ### [Deploy an agent](#)
Test and deploy Managed Deep Agents with `mda`.

  ### [Examples](#)
Explore a complete project that combines common features.

  ### [CLI reference](#)
Review `mda init`, `mda evals`, `mda dev`, and `mda deploy`.
