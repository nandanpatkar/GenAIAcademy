> [!NOTE] Where this runs in the docs
>
> [Long-term memory](lc:oss/python/langchain/long-term-memory)

```python long-term-memory-create-agent-inmemory.py
from langchain.agents import create_agent
from langchain_core.runnables import Runnable
from langgraph.store.memory import InMemoryStore

# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production use.
store = InMemoryStore()

agent: Runnable = create_agent(
    "claude-sonnet-4-6",
    tools=[],
    store=store,
)

if __name__ == "__main__":
    # Verify the agent was created successfully
    assert agent is not None
    print("✓ Agent with InMemoryStore created successfully")
```
