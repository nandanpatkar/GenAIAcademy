Managed Deep Agents discovers channel modules under `channels/`. Each file is a messaging ingress: the managed runtime mounts a public Events URL, verifies the provider signature, invokes your agent with [identity](lc:langsmith/managed-deep-agents-identity) stamps, and can auto-reply on the same conversation.


> [!NOTE]
>
> Managed Deep Agents is in **private [beta](lc:langsmith/release-stages)**, available on [LangSmith Cloud](lc:langsmith/cloud) in the US region only. [Join the waitlist](https://www.langchain.com/langsmith-managed-deep-agents-waitlist) to request access.


## Channel types

| Channel | File | What it does |
| --- | --- | --- |
| [Slack](lc:langsmith/managed-deep-agents-channels/slack) | `channels/slack.{py\|ts}` | Receives Slack Events (`app_mention`, DMs, thread replies), runs the agent, and optionally replies with the Slack Web API. |
| [GitHub](lc:langsmith/managed-deep-agents-channels/github) | `channels/github.{py\|ts}` | Receives GitHub App webhooks (any event via handlers), runs the agent as the App installation, and optionally comments on the issue/PR. |

Declare each channel as its own file under `channels/`; you do not register channels in the agent entry.

Channels receive provider events. Connectors add tools, HTTP capabilities, or sandbox setup, while identity connect links a user's external account. For a comparison, see [Choose the right integration](lc:langsmith/managed-deep-agents-connectors/index#choose-the-right-integration).

For the full project layout, see the [CLI project file reference](lc:langsmith/managed-deep-agents-cli#project-file-reference).

## How channels work

1. You declare a channel under `channels/` (for example `defineSlackChannel` / `defineGitHubChannel`).
2. Compile and deploy discover the file name as the channel name (`channels/slack.ts` → `slack`).
3. The runtime mounts provider ingress for that channel on the Agent Server (`POST /channels/{name}/events`).
4. Inbound messages invoke your agent with [identity](lc:langsmith/managed-deep-agents-identity) stamps so tools and memory see the same caller model as HTTP runs.
5. When enabled, the runtime can reply on the originating conversation.

Channels require a root identity declaration. Provider-specific delivery details live on each channel page.

## Identity and threading

| Pattern | Identity approach | Thread behavior |
| --- | --- | --- |
| Shared workspace bot | `shared-bot` preset (`threads: "channel"`) | Conversations are scoped by provider source thread (for example Slack `slack:T…:U…` or GitHub `github-app:<installationId>`). |
| Linked web + Slack | `validated_token` (for example Supabase/guest) + Connect-with-Slack | Unlinked Slack users get a connect prompt; linked users run as the web actor so browser and Slack share history when `threads: "actor"`. |

The GitHub channel uses an installation/service actor and does not require Connect-with-GitHub. For Slack app setup, secrets, Event Subscriptions, and Connect-with-Slack, see [Slack](lc:langsmith/managed-deep-agents-channels/slack). For GitHub App webhooks, see [GitHub](lc:langsmith/managed-deep-agents-channels/github).

## Test and deploy


Test the project locally with [`mda dev`](lc:langsmith/managed-deep-agents-cli#develop-locally), then deploy it with [`mda deploy`](lc:langsmith/managed-deep-agents-deploy). Open deployment traces in LangSmith to inspect model calls, tool calls, errors, and latency.


When `channels/` is present, `mda deploy` preflights secrets listed in each compiled channel manifest’s `requiredEnv` (for example Slack’s signing secret and bot token, or GitHub App webhook/App credentials) before upload. Missing secrets fail the deploy early.

## Next steps

  ### [Slack](#)
Declare a Slack channel, configure the Slack app, and enable Connect-with-Slack.

  ### [GitHub](#)
Declare a GitHub App webhook channel with handlers for any event.

  ### [Identity](#)
Choose `shared-bot` or linked `validated_token` for channel callers.

  ### [CLI reference](#)
Look up `channels/` project file rules and deploy preflight.
