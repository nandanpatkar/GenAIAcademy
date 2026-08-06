> [!NOTE] Where this runs in the docs
>
> [Async subagents](lc:oss/python/deepagents/async-subagents)

```python async-subagents-http-transport.py
"""Async subagents: HTTP transport subagent spec."""

from deepagents import AsyncSubAgent

AsyncSubAgent(
    name="researcher",
    description="Research agent",
    graph_id="researcher",
    url="https://my-research-deployment.langsmith.dev",
)

print("✓ async-subagents-http-transport sample validated")
```
