> [!NOTE] Where this runs in the docs
>
> [Tools](lc:oss/python/deepagents/tools)

```python tools.py
"""Deep Agents tools page examples."""

from deepagents import create_deep_agent

def search(query: str) -> str:
    """Search the web."""
    return query


def fetch_url(url: str) -> str:
    """Fetch a URL."""
    return url


def run_query(sql: str) -> str:
    """Run a SQL query."""
    return sql


agent = create_deep_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[search, fetch_url, run_query],
)

assert agent is not None
```
