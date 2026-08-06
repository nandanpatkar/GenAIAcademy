> [!NOTE] Where this runs in the docs
>
> [Async subagents](lc:oss/python/deepagents/async-subagents)

```python async-subagents-descriptions.py
"""Async subagents: good and bad subagent descriptions."""

from deepagents import AsyncSubAgent

AsyncSubAgent(
    name="researcher",
    description="Conducts in-depth research using web search. Use for questions requiring multiple searches and synthesis.",
    graph_id="researcher",
)

from deepagents import AsyncSubAgent

AsyncSubAgent(
    name="helper",
    description="helps with stuff",
    graph_id="helper",
)

print("✓ async-subagents-descriptions sample validated")
```
