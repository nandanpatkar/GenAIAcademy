This guide outlines changes in LangGraph v1 and how to migrate from previous versions. For a high-level overview of changes, see the [what's new](lc:oss/python/releases/langgraph-v1) page.

To upgrade:

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install -U langgraph langchain-core"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langgraph langchain-core"
 }
]
```

## Summary of changes

LangGraph v1 is largely backwards compatible with previous versions. The main change is the deprecation of `create_react_agent` in favor of LangChain's new `create_agent` function.

## Deprecations

The following table lists all items deprecated in LangGraph v1:

| Deprecated item | Alternative |
|----------------|-------------|
| `create_react_agent` | `langchain.agents.create_agent`[create_agent] |
| `AgentState` | `langchain.agents.AgentState`[AgentState] |
| `AgentStatePydantic` | `langchain.agents.AgentState` (no more pydantic state) |
| `AgentStateWithStructuredResponse` | `langchain.agents.AgentState` |
| `AgentStateWithStructuredResponsePydantic` | `langchain.agents.AgentState` (no more pydantic state) |
| `HumanInterruptConfig` | `langchain.agents.middleware.human_in_the_loop.InterruptOnConfig` |
| `ActionRequest` | `langchain.agents.middleware.human_in_the_loop.InterruptOnConfig` |
| `HumanInterrupt` | `langchain.agents.middleware.human_in_the_loop.HITLRequest` |
| `ValidationNode` | Tools automatically validate input with `create_agent` |
| `MessageGraph` | `StateGraph` with a `messages` key, like `create_agent` provides |

## `create_react_agent` → `create_agent`

LangGraph v1 deprecates the `create_react_agent` prebuilt. Use LangChain's `create_agent`, which runs on LangGraph and adds a flexible middleware system.

See the LangChain v1 docs for details:

- [Release notes](lc:oss/python/releases/langchain-v1#create_agent)
- [Migration guide](lc:oss/python/migrate/langchain-v1#migrate-to-create_agent)

```lc-tabs
[
 {
  "label": "v1 (new)",
  "lang": "python",
  "code": "from langchain.agents import create_agent\n\nagent = create_agent(  # [!code highlight]\n    model,\n    tools,\n    system_prompt=\"You are a helpful assistant.\",\n)"
 },
 {
  "label": "v0 (old)",
  "lang": "python",
  "code": "from langgraph.prebuilt import create_react_agent\n\nagent = create_react_agent(  # [!code highlight]\n    model,\n    tools,\n    prompt=\"You are a helpful assistant.\",  # [!code highlight]\n)"
 }
]
```

## Breaking changes

### Dropped Python 3.9 support

All LangChain packages now require **Python 3.10 or higher**. Python 3.9 reached [end of life](https://devguide.python.org/versions/) in October 2025.
