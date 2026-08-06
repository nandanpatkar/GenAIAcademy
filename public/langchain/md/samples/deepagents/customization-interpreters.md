> [!NOTE] Where this runs in the docs
>
> [Customization](lc:oss/python/deepagents/customization)

```python customization-interpreters.py
"""Customization: code interpreter middleware example."""

from deepagents import create_deep_agent
from langchain_quickjs import CodeInterpreterMiddleware

agent = create_deep_agent(
    model="anthropic:claude-sonnet-4-6",
    middleware=[CodeInterpreterMiddleware()],
)

assert agent is not None
```
