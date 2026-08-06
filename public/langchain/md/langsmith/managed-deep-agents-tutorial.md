This tutorial builds a research assistant one capability at a time. Complete the [quickstart](lc:langsmith/managed-deep-agents-quickstart) first to scaffold a project, add API keys, and run `mda dev` locally. Then add a search tool, use durable memory, run the agent on a daily schedule, and deploy it to LangSmith.

For a complete project that combines common features, see the [example project](lc:langsmith/managed-deep-agents-examples).


> [!NOTE]
>
> Managed Deep Agents is in **private [beta](lc:langsmith/release-stages)**, available on [LangSmith Cloud](lc:langsmith/cloud) in the US region only. [Join the waitlist](https://www.langchain.com/langsmith-managed-deep-agents-waitlist) to request access.


## Build the agent

  #### Step: Write the instructions

Replace `instructions.md` with the research assistant's behavior. The instructions reference the tool you add next and the durable memory the runtime provides:

```markdown instructions.md
# Research assistant

You are a careful research assistant. Find sources, keep notes, and return
concise answers with citations.

## Behavior

- Use the `web_search` tool to find sources instead of guessing.
- Cite the sources you used.

## Memory

- Remember the user's topics of interest and preferred answer format.
- Never store secrets, API keys, or credentials in memory.
```

  

  #### Step: Add a search tool

Create a `tools/` module with a search tool, then import it into the agent entry. This example returns a placeholder result, so it runs without an external API. Replace the body with a call to your search provider.

```python tools/search.py
from langchain.tools import tool

@tool(parse_docstring=True)
def web_search(query: str) -> str:
    """Search the web for a query and return result snippets.

    Args:
        query: The search query.
    """
    # Replace this stub with a call to your search provider.
    return f"Top results for '{query}': ..."
```

Import the tool into the agent entry and pass it to the definition:

```python agent.py
from managed_deepagents import define_deep_agent

from tools.search import web_search

agent = define_deep_agent(
    name="research-assistant",
    model="openai:gpt-5.5",
    tools=[web_search],
)
```

For more on authored tools, see [Custom tools](lc:langsmith/managed-deep-agents-tools).

  

  #### Step: Run the agent locally

Install dependencies and start the local dev server:

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

`mda dev` opens the agent in LangSmith Studio. Send a question and confirm the agent calls `web_search` and answers with the returned snippets.

  

  #### Step: Use durable memory

Managed memory is on by default, so you do not configure a backend. The runtime stores durable memory in Context Hub, and the agent reads and writes it during runs. Because the instructions tell the agent to remember topics of interest, tell it a preference in one turn ("I only care about open-source releases"), then start a new conversation and confirm it recalls the preference.

To turn off managed memory, set `disable_memory=True` or `disableMemory: true` in the agent definition. For more information about hot/cold tiers, identity remounts, and org memory, see [Memory](lc:langsmith/managed-deep-agents-memory).

  

  #### Step: Schedule a daily digest

Add a `schedules/` module so the agent runs on a cron cadence without a user message. This schedule runs every weekday at 8am Pacific:

```python schedules/daily_digest.py
from managed_deepagents import define_schedule

schedule = define_schedule(
    cron="0 8 * * 1-5",
    timezone="America/Los_Angeles",
    prompt="Summarize what you learned yesterday and list open questions.",
)
```

`mda deploy` reconciles this schedule into a LangSmith cron job after the deployment is live. For thread behavior and constraints, see [Schedules](lc:langsmith/managed-deep-agents-schedules).

  

  #### Step: Deploy the agent

Deploy the project to LangSmith:

```bash
mda deploy .
```

On success, the CLI prints the deployment dashboard URL. The deploy syncs the instructions to Context Hub, uploads the compiled project, and reconciles the daily schedule. For deploy flags and troubleshooting, see [Deploy an agent](lc:langsmith/managed-deep-agents-deploy) and the [CLI reference](lc:langsmith/managed-deep-agents-cli#deploy-projects).

  

  #### Step: Inspect the run

Open the printed URL in LangSmith to inspect build status and revisions. Open traces to inspect the agent's inputs, model calls, `web_search` calls, memory reads and writes, and final responses.

  

## Next steps

  ### [Custom middleware](#)
Add logging, retries, limits, and guardrails around model and tool calls.

  ### [Identity](#)
Scope threads and memory to the authenticated caller.

  ### [Memory](#)
Persist preferences across threads with Context Hub `/memories`.

  ### [Evals](#)
Compile a Harbor handoff and run Harbor-style tasks.

  ### [Connectors](#)
Load MCP tools or constrained LangSmith capabilities.

  ### [Channels](#)
Receive Slack Events and reply from messaging channels.

  ### [Example project](#)
See a complete project that combines common features.
