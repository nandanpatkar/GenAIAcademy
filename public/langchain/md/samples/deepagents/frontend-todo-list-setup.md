> [!NOTE] Where this runs in the docs
>
> [Todo list](lc:oss/python/deepagents/frontend/todo-list), [Overview](lc:oss/python/deepagents/overview)

```python frontend-todo-list-setup.py
"""Frontend todo list: enable TodoListMiddleware on create_deep_agent."""

from deepagents import create_deep_agent
from langchain.agents.middleware import TodoListMiddleware

agent = create_deep_agent(
    model="anthropic:claude-sonnet-4-6",
    middleware=[TodoListMiddleware()],
)

assert agent is not None
print("✓ frontend-todo-list-setup sample validated")
```
