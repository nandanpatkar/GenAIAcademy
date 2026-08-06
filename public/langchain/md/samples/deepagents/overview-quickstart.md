> [!NOTE] Where this runs in the docs
>
> [Overview](lc:oss/python/deepagents/overview)

```python overview-quickstart.py
"""Overview page: minimal get_weather quickstart."""

from deepagents import create_deep_agent


def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"


agent = create_deep_agent(
    model="google_genai:gemini-3.6-flash",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

# Run the agent
assert agent is not None
assert get_weather("sf") == "It's always sunny in sf!"
print("✓ overview-quickstart sample validated")
agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]}
)
```
