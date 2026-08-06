Middleware provides a way to more tightly control what happens inside the agent. Middleware is useful for the following:

- Tracking agent behavior with logging, analytics, and debugging.
- Transforming prompts, [tool selection](lc:oss/python/langchain/middleware/built-in#llm-tool-selector), and output formatting.
- Adding [retries](lc:oss/python/langchain/middleware/built-in#tool-retry), [fallbacks](lc:oss/python/langchain/middleware/built-in#model-fallback), and early termination logic.
- Applying [rate limits](lc:oss/python/langchain/middleware/built-in#model-call-limit), guardrails, and [PII detection](lc:oss/python/langchain/middleware/built-in#pii-detection).

Add middleware by passing them to `create_agent`:

```python
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware, HumanInTheLoopMiddleware

agent = create_agent(
    model="gpt-5.5",
    tools=[...],
    middleware=[
        SummarizationMiddleware(...),
        HumanInTheLoopMiddleware(...)
    ],
)
```


## The agent loop

The core agent loop involves calling a model, letting it choose tools to execute, and then finishing when it calls no more tools:


![Core agent loop diagram](/langchain/images/oss/images/core_agent_loop.png)


Middleware exposes hooks before and after each of those steps:


![Middleware flow diagram](/langchain/images/oss/images/middleware_final.png)


## Use middleware inside a LangGraph workflow

Middleware is not a separate runtime: hooks run inside the compiled [LangGraph](lc:oss/python/langgraph/overview) that `create_agent` returns. You can drop the whole agent (middleware and all) into a larger `StateGraph` as a node or subgraph, and every middleware hook continues to run.

Reach for this pattern when the surrounding topology is more than a standard "loop until done": classifying input before routing to one of several agents, fanning out work in parallel, or stitching agent calls together with deterministic steps.

`HumanInTheLoopMiddleware` matches against each tool's `.name`. In Python, `@tool`-decorated functions take their name from the function (so the key below is `"send_email"`); in TypeScript, the key matches the `name` you pass to `tool({...}, { name })`.

```python
from langchain.agents import AgentState, create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langgraph.graph import START, StateGraph

# Assumes read_email, send_email, classify_node, and route are defined elsewhere.
email_agent = create_agent(
    model="claude-sonnet-4-6",
    tools=[read_email, send_email],
    middleware=[HumanInTheLoopMiddleware(interrupt_on={"send_email": True})],
)

graph = (
    StateGraph(AgentState)
    .add_node("classify", classify_node)
    .add_node("email_agent", email_agent)
    .add_edge(START, "classify")
    .add_conditional_edges("classify", route)
    .compile()
)
```


The HITL interrupt, summarization, PII redaction, retries, and any custom hooks all travel with the agent node. See [Use subgraphs](lc:oss/python/langgraph/use-subgraphs) for the full set of composition patterns, including subgraph checkpointer scoping (per-invocation versus per-thread).

## Additional resources

    ### [Built-in middleware](#)
Explore built-in middleware for common use cases.

    ### [Custom middleware](#)
Build your own middleware with hooks and decorators.

    ### [Middleware API reference](#)
Complete API reference for middleware.

    ### [Middleware integrations](#)
Provider-specific middleware for Anthropic, AWS, OpenAI, and more.

    ### [Testing agents](#)
Test your agents with LangSmith.
