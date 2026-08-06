> [!NOTE] Where this runs in the docs
>
> [Tools](lc:oss/python/langchain/tools)

```python tool-return-object.py
from langchain.tools import tool


@tool
def get_weather_data(city: str) -> dict:
    """Get structured weather data for a city."""
    return {
        "city": city,
        "temperature_c": 22,
        "conditions": "sunny",
    }


if __name__ == "__main__":
    result = get_weather_data.invoke({"city": "San Francisco"})
    assert result == {
        "city": "San Francisco",
        "temperature_c": 22,
        "conditions": "sunny",
    }
    print("✓ Tool works as expected")
```
