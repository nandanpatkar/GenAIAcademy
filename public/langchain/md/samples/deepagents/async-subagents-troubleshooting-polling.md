> [!NOTE] Where this runs in the docs
>
> [Async subagents](lc:oss/python/deepagents/async-subagents)

```python async-subagents-troubleshooting-polling.py
"""Async subagents: prevent polling immediately after launch."""

from deepagents import AsyncSubAgent

async_subagents = [
    AsyncSubAgent(
        name="researcher",
        description="Research agent",
        graph_id="researcher",
    ),
]

from deepagents import create_deep_agent

agent = create_deep_agent(
    model="google_genai:gemini-3.6-flash",
    system_prompt="""...your instructions...

    After launching an async subagent, ALWAYS return control to the user.
    Never call check_async_task immediately after launch.""",
    subagents=async_subagents,
)

assert agent is not None
print("✓ async-subagents-troubleshooting-polling sample validated")
```
