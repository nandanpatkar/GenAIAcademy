```python runs-query-filter-root.py
from langsmith import Client

client = Client()
runs = client.list_runs(project_name="default", is_root=True)

import asyncio

from langsmith import Client


async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    runs = client.runs.query(project_ids=[str(project.id)], is_root=True)


asyncio.run(main())
```
