```python runs-query-scoped-filters.py
from langsmith import Client

client = Client()
runs = client.list_runs(
    project_name="default",
    filter='eq(name, "RetrieveDocs")',
    trace_filter='and(eq(feedback_key, "user_score"), eq(feedback_score, 1))',
    tree_filter='eq(name, "ExpandQuery")',
)

import asyncio

from langsmith import Client


async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    runs = client.runs.query(
        project_ids=[str(project.id)],
        filter='eq(name, "RetrieveDocs")',
        trace_filter='and(eq(feedback_key, "user_score"), eq(feedback_score, 1))',
        tree_filter='eq(name, "ExpandQuery")',
    )


asyncio.run(main())
```
