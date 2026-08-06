Managed Deep Agents is a hosted runtime for deploying and operating code-first Deep Agents in LangSmith, pairing the [Deep Agents](lc:oss/python/deepagents/overview) harness with managed infrastructure. It lets you run a production agent without standing up your own agent server or infrastructure. You author an agent in Python or TypeScript, then use the `mda` CLI to test and deploy it to the managed runtime.

The managed runtime provides:

- Durable runs
- [LangSmith sandboxes](lc:langsmith/sandboxes)
- [Context Hub](lc:langsmith/use-the-context-hub)-backed instructions, skills, and memory
- Traces
- Hosted LangGraph deployment

To deploy your first agent, see the [quickstart](lc:langsmith/managed-deep-agents-quickstart).


> [!NOTE]
>
> Managed Deep Agents is in **private [beta](lc:langsmith/release-stages)**, available on [LangSmith Cloud](lc:langsmith/cloud) in the US region only. [Join the waitlist](https://www.langchain.com/langsmith-managed-deep-agents-waitlist) to request access.
>
>
> **Private beta access:** During private beta, Managed Deep Agents is CLI-first while LangChain finalizes the supported API. API-driven creation, update, and invocation examples have been removed. To use agents programmatically, contact your LangChain team at the address in your beta access email.


## When to use Managed Deep Agents

Choose the path that matches your control and infrastructure needs:

| Path | Use when | You manage | LangSmith manages |
|------|----------|------------|-------------------|
| **Managed Deep Agents** | You want a code-first Deep Agent deployed quickly on managed infrastructure. | Agent code, tools, middleware, instructions, schedules, optional identity. | Backend, store, checkpointer, memory, skills, sandbox, hosted deployment, identity auth when declared. |
| **[LangSmith Deployment](lc:langsmith/deployment-quickstart)** | You need custom application code, custom routes, advanced authentication, stronger isolation controls, or maximum scalability. | Application code, server, deployment configuration. | Hosted infrastructure and scaling. |
| **[OSS Deep Agents](lc:oss/python/deepagents/overview)** | You want to run the Deep Agents harness in your own environment. | Everything, including hosting and persistence. | Nothing (self-managed). |

## Structure your agent project

You organize a Managed Deep Agent as a local project directory. A file's location determines its role: the CLI reads the directory to find the agent entry, managed instructions, skills, connectors, channels, schedules, optional identity, sandbox configuration, and local eval tasks, then packages the deploy-owned pieces into a hosted deployment.

For the full directory layout and packaging rules, see the [CLI project file reference](lc:langsmith/managed-deep-agents-cli#project-file-reference). For how the CLI compiles this directory and what a deploy creates, see [How Managed Deep Agents work](lc:langsmith/managed-deep-agents-how-it-works).

## Recommended workflow

1. Install `managed-deepagents` for Python or TypeScript.
2. Create a local code-first agent project with `mda init`.
3. Put the agent system prompt in `instructions.md`.
4. Add authored tools, middleware, schedules, skills, connectors, messaging channels, optional identity, and an optional sandbox.
5. Optionally compile Harbor-style [evals](lc:langsmith/managed-deep-agents-evals) with `mda evals compile` and run them with Harbor.
6. Use `mda dev` to test your agent locally in LangSmith Studio, then `mda deploy` to deploy to LangSmith.
7. Inspect the deployment, traces, and runtime state in LangSmith.

New to Managed Deep Agents? Start with the [quickstart](lc:langsmith/managed-deep-agents-quickstart), then build a complete agent step by step in the [tutorial](lc:langsmith/managed-deep-agents-tutorial).

## Beta notes and limits

Operational notes that apply during private beta. Behavior may change before general availability.

### Supported models

Pass model identifiers in the form `{provider}:{model_id}`. For example, `openai:gpt-5.5`. The runtime resolves models with `init_chat_model`, so any provider that `init_chat_model` supports is usable from Managed Deep Agents, as long as the runtime has credentials for that provider. See [Supported providers and models](lc:oss/python/langchain/models#supported-providers-and-models) for the current list.

Put local keys in `.env`, export them in your shell, or configure them as LangSmith workspace secrets before deploying.

### Context Hub memory

Managed memory lives in the same Context Hub repo as the deployed instructions and skills. The runtime remounts one Hub slice as `/memories/user/` (hot memories are stored in `/memories/user/AGENTS.md`, cold memories are stored in other files under `/memories/user/`) and optional org facts as `/memories/org/` (read-only). Deploy syncs `instructions.md` and `skills/**`, but preserves existing `memories/**` and does not overwrite runtime-created memory. Set `disableMemory: true` or `disable_memory=True` to disable managed memory. For more information about hot/cold tiers, identity remounts, and org memory, see [Memory](lc:langsmith/managed-deep-agents-memory). To partition memory per caller, see [Identity](lc:langsmith/managed-deep-agents-identity).

### Rate limits and quotas

During private beta, Managed Deep Agents does not publish per-key, per-workspace, or per-agent request rate limits. For workspace-specific limits, contact your LangChain team at the address in your beta access email.

### Support and feedback

Beta access includes direct support. The contact for bug reports and feature requests is included in the email you receive when access is granted.

### Private beta scope

Managed Deep Agents is available on LangSmith Cloud in the US region only during private beta. Self-hosted and Hybrid deployments are not supported.

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
