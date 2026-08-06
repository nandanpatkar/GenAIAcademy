> [!NOTE] Where this runs in the docs
>
> [Overview](lc:oss/python/deepagents/overview)

```python overview-tools.py
"""Overview page: tools parameter example."""

def search(query: str) -> str:
    """Search for information."""
    return query


def fetch_page(url: str) -> str:
    """Fetch a web page."""
    return url


def run_query(sql: str) -> str:
    """Run a database query."""
    return sql


from deepagents import create_deep_agent

agent = create_deep_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[search, fetch_page, run_query],
)

assert agent is not None
print("✓ overview-tools sample validated")
```
