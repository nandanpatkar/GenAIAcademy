> [!NOTE] Where this runs in the docs
>
> [Overview](lc:oss/python/deepagents/frontend/overview)

```python frontend-overview-backend.py
"""Frontend overview: coordinator-worker backend setup."""


def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return "It's always sunny in San Francisco."


from deepagents import create_deep_agent

agent = create_deep_agent(
    model="google_genai:gemini-3.6-flash",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
    subagents=[
        {
            "name": "researcher",
            "description": "Research assistant",
            "system_prompt": "You are a research assistant.",
        }
    ],
)
```
