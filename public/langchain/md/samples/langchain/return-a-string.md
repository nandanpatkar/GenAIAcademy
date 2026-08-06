> [!NOTE] Where this runs in the docs
>
> [Tools](lc:oss/python/langchain/tools)

```python return-a-string.py
from langchain.tools import tool


@tool
def get_weather(city: str) -> str:
    """Get weather for a city."""
    return f"It is currently sunny in {city}."


if __name__ == "__main__":
    result = get_weather.invoke({"city": "San Francisco"})
    assert result == "It is currently sunny in San Francisco."
    print("✓ Tool works as expected")
```
