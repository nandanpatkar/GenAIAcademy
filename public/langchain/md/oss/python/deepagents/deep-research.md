## Overview

This guide demonstrates how to build a multi-step web research agent from scratch using [Deep Agents](lc:oss/python/deepagents/overview). The agent decomposes research questions into focused tasks, delegates them to specialized sub-agents, and synthesizes findings into a comprehensive report.

The agent you build will:

1. Plan research using the opt-in todo list middleware
1. Delegate focused research tasks to sub-agents with isolated context
1. Assess search results and plan next steps as you gather information
1. Synthesize findings with proper citations into a final report

The spawned sub-agents will conduct web searches with Tavily, fetching full webpage content for analysis.

### Key concepts

This tutorial covers:

- [Subagents](lc:oss/python/deepagents/subagents) for parallel, context-isolated research
- Custom [tools](lc:oss/python/langchain/tools) for web search
- Multi-step planning with the opt-in [planning tool](lc:oss/python/deepagents/overview#task-planning)

## Prerequisites

API keys for:

- Anthropic (Claude) or Google (Gemini)
- [Tavily](https://www.tavily.com/) for web search (optional - free tier sufficient)
- [LangSmith](https://smith.langchain.com) for tracing (optional)

## Setup


#### Step: Create project directory

```bash
mkdir deep-research-agent
cd deep-research-agent
```

#### Step: Install dependencies

#### Tab: Claude

```lc-tabs
[
 {
  "label": "pip wrap",
  "lang": "bash",
  "code": "pip install deepagents tavily-python httpx markdownify langchain-anthropic langchain-core"
 },
 {
  "label": "uv wrap",
  "lang": "bash",
  "code": "uv init\nuv add deepagents tavily-python httpx markdownify langchain-anthropic langchain-core\nuv sync"
 }
]
```

#### Tab: Gemini

```lc-tabs
[
 {
  "label": "pip wrap",
  "lang": "bash",
  "code": "pip install deepagents tavily-python httpx markdownify langchain-google-genai langchain-core"
 },
 {
  "label": "uv wrap",
  "lang": "bash",
  "code": "uv init\nuv add deepagents tavily-python httpx markdownify langchain-google-genai langchain-core\nuv sync"
 }
]
```

#### Step: Set API keys

#### Tab: Claude

```bash
export ANTHROPIC_API_KEY="your_anthropic_api_key"
export TAVILY_API_KEY="your_tavily_api_key"
export LANGSMITH_API_KEY="your_langsmith_api_key"   # Optional
```

#### Tab: Gemini

```bash
export GOOGLE_API_KEY="your_google_api_key"
export TAVILY_API_KEY="your_tavily_api_key"
export LANGSMITH_API_KEY="your_langsmith_api_key"   # Optional
```


## Build the agent

Create `agent.py` in your project directory:


#### Step: Add tools

Add the custom search tool. The `tavily_search` tool uses Tavily for URL discovery, then fetches full webpage content so the agent can analyze complete sources instead of summaries.


```python

from typing import Annotated, Literal

from langchain.tools import InjectedToolArg, tool
from markdownify import markdownify
from tavily import TavilyClient

tavily_client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

def fetch_webpage_content(url: str, timeout: float = 10.0) -> str:
    """Fetch webpage and convert HTML to markdown."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    try:
        response = httpx.get(url, headers=headers, timeout=timeout)
        response.raise_for_status()
        return markdownify(response.text)
    except Exception as e:
        return f"Error fetching {url}: {e!s}"

@tool(parse_docstring=True)
def tavily_search(
    query: str,
    max_results: Annotated[int, InjectedToolArg] = 1,
    topic: Annotated[
        Literal["general", "news", "finance"], InjectedToolArg
    ] = "general",
) -> str:
    """Search the web for information on a given query.

    Uses Tavily to discover relevant URLs, then fetches and returns full webpage content as markdown.

    Args:
        query: Search query to execute
        max_results: Maximum number of results to return (default: 1)
        topic: Topic filter - 'general', 'news', or 'finance' (default: 'general')

    Returns:
        Formatted search results with full webpage content
    """
    search_results = tavily_client.search(
        query,
        max_results=max_results,
        topic=topic,
    )
    result_texts = []
    for result in search_results.get("results", []):
        url = result["url"]
        title = result["title"]
        content = fetch_webpage_content(url)
        result_texts.append(f"## {title}\n**URL:** {url}\n\n{content}\n---")

    return f"Found {len(result_texts)} result(s) for '{query}':\n\n" + "\n".join(
        result_texts
    )
```


#### Step: Add prompts

Add the orchestrator workflow and sub-agent prompt templates to `agent.py`:


```lc-tabs
[
 {
  "label": "expandable wrap",
  "lang": "python",
  "code": "RESEARCH_WORKFLOW_INSTRUCTIONS = \"\"\"# Research Workflow\n\nFollow this workflow for all research requests:\n\n1. **Plan**: Create a todo list with write_todos to break down the research into focused tasks\n2. **Save the request**: Use write_file() to save the user's research question to `/research_request.md`\n3. **Research**: Delegate research tasks to sub-agents using the task() tool - ALWAYS use sub-agents for research, never conduct research yourself\n4. **Synthesize**: Review all sub-agent findings and consolidate citations (each unique URL gets one number across all findings)\n5. **Write Report**: Write a comprehensive final report to `/final_report.md` (see Report Writing Guidelines below)\n6. **Verify**: Read `/research_request.md` and confirm you've addressed all aspects with proper citations and structure\n\n## Research Planning Guidelines\n- Batch similar research tasks into a single TODO to minimize overhead\n- For simple fact-finding questions, use 1 sub-agent\n- For comparisons or multi-faceted topics, delegate to multiple parallel sub-agents\n- Each sub-agent should research one specific aspect and return findings\n\n## Report Writing Guidelines\n\nWhen writing the final report to `/final_report.md`, follow these structure patterns:\n\n**For comparisons:**\n1. Introduction\n2. Overview of topic A\n3. Overview of topic B\n4. Detailed comparison\n5. Conclusion\n\n**For lists/rankings:**\nSimply list items with details - no introduction needed:\n1. Item 1 with explanation\n2. Item 2 with explanation\n3. Item 3 with explanation\n\n**For summaries/overviews:**\n1. Overview of topic\n2. Key concept 1\n3. Key concept 2\n4. Key concept 3\n5. Conclusion\n\n**General guidelines:**\n- Use clear section headings (## for sections, ### for subsections)\n- Write in paragraph form by default - be text-heavy, not just bullet points\n- Do NOT use self-referential language (\"I found...\", \"I researched...\")\n- Write as a professional report without meta-commentary\n- Each section should be comprehensive and detailed\n- Use bullet points only when listing is more appropriate than prose\n\n**Citation format:**\n- Cite sources inline using [1], [2], [3] format\n- Assign each unique URL a single citation number across ALL sub-agent findings\n- End report with ### Sources section listing each numbered source\n- Number sources sequentially without gaps (1,2,3,4...)\n- Format: [1] Source Title: URL (each on separate line for proper list rendering)\n- Example:\n\n Some important finding [1]. Another key insight [2].\n\n ### Sources\n [1] AI Research Paper: https://example.com/paper\n [2] Industry Analysis: https://example.com/analysis\n\"\"\""
 },
 {
  "label": "expandable wrap",
  "lang": "python",
  "code": "RESEARCHER_INSTRUCTIONS = \"\"\"You are a research assistant conducting research on the user's input topic. For context, today's date is {date}.\n\nYour job is to use tools to gather information about the user's input topic.\nYou can use the tavily_search tool to find resources that can help answer the research question.\nYou can call it in series or in parallel, your research is conducted in a tool-calling loop.\n\nYou have access to the tavily_search tool for conducting web searches.\n\nThink like a human researcher with limited time. Follow these steps:\n\n1. **Read the question carefully** - What specific information does the user need?\n2. **Start with broader searches** - Use broad, comprehensive queries first\n3. **After each search, pause and assess** - Do I have enough to answer? What's still missing?\n4. **Execute narrower searches as you gather information** - Fill in the gaps\n5. **Stop when you can answer confidently** - Don't keep searching for perfection\n\n**Tool Call Budgets** (Prevent excessive searching):\n- **Simple queries**: Use 2-3 search tool calls maximum\n- **Complex queries**: Use up to 5 search tool calls maximum\n- **Always stop**: After 5 search tool calls if you cannot find the right sources\n\n**Stop Immediately When**:\n- You can answer the user's question comprehensively\n- You have 3+ relevant examples/sources for the question\n- Your last 2 searches returned similar information\n\nAfter each search, assess results before continuing: What key information did I find? What's missing? Do I have enough to answer? Should I search more or provide my answer?\n\nWhen providing your findings back to the orchestrator:\n\n1. **Structure your response**: Organize findings with clear headings and detailed explanations\n2. **Cite sources inline**: Use [1], [2], [3] format when referencing information from your searches\n3. **Include Sources section**: End with ### Sources listing each numbered source with title and URL\n\nExample:\n## Key Findings\nContext engineering is a critical technique for AI agents [1]. Studies show that proper context management can improve performance by 40% [2].\n\n### Sources\n[1] Context Engineering Guide: https://example.com/context-guide\n[2] AI Performance Study: https://example.com/study\n\nThe orchestrator will consolidate citations from all sub-agents into the final report.\n\"\"\""
 },
 {
  "label": "expandable wrap",
  "lang": "python",
  "code": "SUBAGENT_DELEGATION_INSTRUCTIONS = \"\"\"# Sub-Agent Research Coordination\n\nYour role is to coordinate research by delegating tasks from your TODO list to specialized research sub-agents.\n\n## Delegation Strategy\n\n**DEFAULT: Start with 1 sub-agent** for most queries:\n- \"What is quantum computing?\" -> 1 sub-agent (general overview)\n- \"List the top 10 coffee shops in San Francisco\" -> 1 sub-agent\n- \"Summarize the history of the internet\" -> 1 sub-agent\n- \"Research context engineering for AI agents\" -> 1 sub-agent (covers all aspects)\n\n**ONLY parallelize when the query EXPLICITLY requires comparison or has clearly independent aspects:**\n\n**Explicit comparisons** -> 1 sub-agent per element:\n- \"Compare OpenAI vs Anthropic vs DeepMind AI safety approaches\" -> 3 parallel sub-agents\n- \"Compare Python vs JavaScript for web development\" -> 2 parallel sub-agents\n\n**Clearly separated aspects** -> 1 sub-agent per aspect (use sparingly):\n- \"Research renewable energy adoption in Europe, Asia, and North America\" -> 3 parallel sub-agents (geographic separation)\n- Only use this pattern when aspects cannot be covered efficiently by a single comprehensive search\n\n## Key Principles\n- **Bias towards single sub-agent**: One comprehensive research task is more token-efficient than multiple narrow ones\n- **Avoid premature decomposition**: Don't break \"research X\" into \"research X overview\", \"research X techniques\", \"research X applications\" - just use 1 sub-agent for all of X\n- **Parallelize only for clear comparisons**: Use multiple sub-agents when comparing distinct entities or geographically separated data\n\n## Parallel Execution Limits\n- Use at most {max_concurrent_research_units} parallel sub-agents per iteration\n- Make multiple task() calls in a single response to enable parallel execution\n- Each sub-agent returns findings independently\n\n## Research Limits\n- Stop after {max_researcher_iterations} delegation rounds if you haven't found adequate sources\n- Stop when you have sufficient information to answer comprehensively\n- Bias towards focused research over exhaustive exploration\"\"\""
 }
]
```


#### Step: Enable task planning

[Task planning](lc:oss/python/deepagents/overview#task-planning) is opt-in. The research workflow uses `write_todos` to break questions into focused tasks, so pass `TodoListMiddleware` when you create the agent.

```python
from langchain.agents.middleware import TodoListMiddleware
```


You include this middleware in the next step when you create the agent.

#### Step: Create the agent

Add the model initialization and agent creation to `agent.py`. Choose your provider. Include `TodoListMiddleware` so the planning tool is available:

#### Tab: Claude


```python
from datetime import datetime

from deepagents import create_deep_agent
from langchain.agents.middleware import TodoListMiddleware
from langchain.chat_models import init_chat_model

max_concurrent_research_units = 3
max_researcher_iterations = 3

current_date = datetime.now().strftime("%Y-%m-%d")

INSTRUCTIONS = (
    RESEARCH_WORKFLOW_INSTRUCTIONS
    + "\n\n"
    + "=" * 80
    + "\n\n"
    + SUBAGENT_DELEGATION_INSTRUCTIONS.format(
        max_concurrent_research_units=max_concurrent_research_units,
        max_researcher_iterations=max_researcher_iterations,
    )
)

research_sub_agent = {
    "name": "research-agent",
    "description": "Delegate research to the sub-agent. Give one topic at a time.",
    "system_prompt": RESEARCHER_INSTRUCTIONS.format(date=current_date),
    "tools": [tavily_search],
}

model = init_chat_model(model="anthropic:claude-sonnet-4-5-20250929", temperature=0.0)

agent = create_deep_agent(
    model=model,
    tools=[tavily_search],
    system_prompt=INSTRUCTIONS,
    subagents=[research_sub_agent],
    middleware=[TodoListMiddleware()],
)
```


#### Tab: Gemini


```python
from datetime import datetime

from deepagents import create_deep_agent
from langchain.agents.middleware import TodoListMiddleware
from langchain_google_genai import ChatGoogleGenerativeAI

max_concurrent_research_units = 3
max_researcher_iterations = 3

current_date = datetime.now().strftime("%Y-%m-%d")

INSTRUCTIONS = (
    RESEARCH_WORKFLOW_INSTRUCTIONS
    + "\n\n"
    + "=" * 80
    + "\n\n"
    + SUBAGENT_DELEGATION_INSTRUCTIONS.format(
        max_concurrent_research_units=max_concurrent_research_units,
        max_researcher_iterations=max_researcher_iterations,
    )
)

research_sub_agent = {
    "name": "research-agent",
    "description": "Delegate research to the sub-agent. Give one topic at a time.",
    "system_prompt": RESEARCHER_INSTRUCTIONS.format(date=current_date),
    "tools": [tavily_search],
}

model = ChatGoogleGenerativeAI(model="gemini-3-pro-preview", temperature=0.0)

agent = create_deep_agent(
    model=model,
    tools=[tavily_search],
    system_prompt=INSTRUCTIONS,
    subagents=[research_sub_agent],
    middleware=[TodoListMiddleware()],
)
```


## Run the agent

You can run the agent synchronously, meaning it will wait for the full result and then print it, or you can stream updates as they come in.

Add the code from the respective tab at the bottom of `agent.py`:


#### Tab: Run synchronously


```python
from langchain.messages import HumanMessage

if __name__ == "__main__":
    result = agent.invoke(
        {
            "messages": [
                HumanMessage(
                    content="What are the main differences between RAG and fine-tuning for LLM applications?"
                )
            ]
        }
    )

    for msg in result.get("messages", []):
        if hasattr(msg, "content") and msg.content:
            print(msg.content)
```


#### Tab: Stream updates


```python
from langchain.messages import HumanMessage

if __name__ == "__main__":
    stream = agent.stream_events(
        {
            "messages": [
                HumanMessage(content="Compare Python vs JavaScript for web development")
            ]
        },
        version="v3",
    )
    for message in stream.messages:
        for token in message.text:
            print(token, end="", flush=True)
```


Run the agent from the project root:

```sh
python agent.py
```


If you set the `LANGSMITH_API_KEY` environment variable before running, you can view the agent's traces in [LangSmith](lc:langsmith/observability) to debug and monitor multi-step behavior.

## Full code

View the complete [Deep Research example](https://github.com/langchain-ai/deepagents/tree/main/examples/deep_research) on GitHub.

## Next steps

Now that you've built the agent, customize it by changing the prompt constants in your agent file to adjust the workflow, delegation strategy, or researcher behavior.
You can also tune the delegation limits to allow for more parallel sub-agents or delegation rounds.

For more information on the concepts in this tutorial, check out the following resources:

- [Subagents](lc:oss/python/deepagents/subagents): Learn how to configure subagents with different tools and prompts
- [Customization](lc:oss/python/deepagents/customization): Customize models, tools, system prompts, and optional [task planning](lc:oss/python/deepagents/overview#task-planning)
- [LangSmith](lc:langsmith/observability): Trace research runs and debug multi-step behavior
- [Deep Research Course](https://academy.langchain.com/courses/deep-research-with-langgraph): Full course on deep research with LangGraph
