> [!NOTE] Where this runs in the docs
>
> [Async subagents](lc:oss/python/deepagents/async-subagents)

```python async-subagents-configure.py
"""Async subagents: configure supervisor with async subagent specs."""

from deepagents import AsyncSubAgent, create_deep_agent

async_subagents = [
    AsyncSubAgent(
        name="researcher",
        description="Research agent for information gathering and synthesis",
        graph_id="researcher",
        # No url → ASGI transport (co-deployed in the same deployment)
    ),
    AsyncSubAgent(
        name="coder",
        description="Coding agent for code generation and review",
        graph_id="coder",
        # url="https://coder-deployment.langsmith.dev"  # Optional: HTTP transport for remote
    ),
]

agent = create_deep_agent(
    model="google_genai:gemini-3.6-flash",
    subagents=async_subagents,
)

assert agent is not None
print("✓ async-subagents-configure sample validated")
```
