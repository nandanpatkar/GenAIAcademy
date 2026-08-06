> [!NOTE] Where this runs in the docs
>
> [Async subagents](lc:oss/python/deepagents/async-subagents)

```python async-subagents-hybrid.py
"""Async subagents: hybrid ASGI and HTTP deployment."""

from deepagents import AsyncSubAgent

async_subagents = [
    AsyncSubAgent(
        name="researcher",
        description="Research agent",
        graph_id="researcher",
        # No url → ASGI (co-deployed)
    ),
    AsyncSubAgent(
        name="coder",
        description="Coding agent",
        graph_id="coder",
        url="https://coder-deployment.langsmith.dev",
        # url present → HTTP (remote)
    ),
]

assert len(async_subagents) == 2
print("✓ async-subagents-hybrid sample validated")
```
