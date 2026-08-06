Managed Deep Agents can run agents on a cron schedule. Add one schedule file under `schedules/`, export a named `schedule` declaration, and `mda deploy` provisions it as a LangSmith cron after the deployment is live.


> [!NOTE]
>
> Managed Deep Agents is in **private [beta](lc:langsmith/release-stages)**, available on [LangSmith Cloud](lc:langsmith/cloud) in the US region only. [Join the waitlist](https://www.langchain.com/langsmith-managed-deep-agents-waitlist) to request access.


## Add a schedule

Create one file per schedule under `schedules/`. The file name becomes the managed schedule name. For the full project layout, see the [CLI project file reference](lc:langsmith/managed-deep-agents-cli#project-file-reference).

The schedule module must export a named `schedule` declaration.

```python schedules/daily_digest.py
from managed_deepagents import define_schedule

schedule = define_schedule(
    cron="0 8 * * 1-5",
    timezone="America/Los_Angeles",
    prompt="Write the daily digest.",
)
```

## Configure schedule input

Each schedule must define exactly one of:

- `prompt`: A natural-language prompt. MDA converts it to a user message when the cron fires.
- `input`: A structured LangGraph input object. Use this when you need to pass custom graph input instead of a single prompt.

```python schedules/nightly_sweep.py
from managed_deepagents import define_schedule

schedule = define_schedule(
    cron="30 2 * * *",
    input={
        "messages": [
            {"role": "user", "content": "Sweep stale tickets and summarize changes."}
        ]
    },
)
```

`cron` must be a standard five-field cron expression: minute, hour, day of month, month, and day of week. If `timezone` is omitted, LangSmith crons use UTC.

## Choose thread behavior

Schedules use ephemeral threads by default. MDA creates a fresh thread for each run and asks LangSmith to delete that temporary thread after the run completes.

Use a persistent thread only when scheduled runs should accumulate durable thread state across invocations.

```python schedules/nightly_memory.py
from managed_deepagents import define_schedule

schedule = define_schedule(
    cron="0 3 * * *",
    prompt="Review the current project memory and list follow-up tasks.",
    thread={"mode": "persistent", "id": "nightly-memory"},
)
```

## Deliver results to Slack

Set `deliver_to` / `deliverTo` to post the final response through a configured Slack channel. Use a Slack channel ID because scheduled runs have no originating thread.


> [!NOTE]
>
> Schedule delivery requires `managed-deepagents>=0.4.0`.


```python schedules/monday_greeting.py
from managed_deepagents import define_schedule

schedule = define_schedule(
    cron="0 9 * * 1",
    prompt="Write a short Monday greeting.",
    deliver_to={
        "channel": "slack",
        "to": {
            "type": "provider_conversation",
            "conversation_id": "C0123456789",
        },
    },
)
```

The Slack bot must have access to the destination. For channel setup and required secrets, see [Slack](lc:langsmith/managed-deep-agents-channels/slack).

## Use static declarations

Schedule declarations are extracted at compile time. Keep schedule configuration statically serializable:

- Use literals, arrays, objects, and references to top-level literal constants.
- Do not read environment variables, call functions, spread objects, use `**kwargs`, or compute schedule values dynamically.
- Put dynamic behavior in the agent, tools, middleware, or runtime context instead.

## Deploy schedules


Test the project locally with [`mda dev`](lc:langsmith/managed-deep-agents-cli#develop-locally), then deploy it with [`mda deploy`](lc:langsmith/managed-deep-agents-deploy). Open deployment traces in LangSmith to inspect model calls, tool calls, errors, and latency.


When the deployment reaches `DEPLOYED`, `mda deploy` searches for existing MDA-owned cron jobs on the deployed Agent Server, deletes them, and creates cron jobs for the current `schedules/` declarations. Removing a local schedule file and redeploying removes the corresponding managed cron.


> [!WARNING]
>
> If you deploy with `--no-wait`, the CLI triggers the remote build and exits before the deployment reaches `DEPLOYED`, so it does not reconcile schedules during that invocation. Run `mda deploy .` without `--no-wait` when adding, changing, or removing schedules.


## Troubleshoot schedules

- `must export a named schedule declaration`: Export a top-level `schedule` from each file in `schedules/`.
- `must define exactly one of prompt or input`: Add either `prompt` or `input`, but not both.
- `cron must be a standard 5-field expression`: Use five cron fields, not seconds-based cron syntax.
- `schedule is not static`: Replace computed values with literals or top-level literal constants.
- `failed to create cron for schedule`: Open the deployment URL in LangSmith and confirm the deployed Agent Server is healthy.

## Next steps

  ### [Deploy an agent](#)
Deploy and reconcile schedule changes.

  ### [CLI reference](#)
Look up `mda deploy` flags and troubleshooting.
