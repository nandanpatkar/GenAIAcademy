```python runs-query-pagination.py
from langsmith import Client

client = Client()
runs = client.list_runs(project_name="default", limit=150)

import asyncio

from langsmith import Client


async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    runs = []
    async for run in client.runs.query(
        project_ids=[str(project.id)],
    ):
        runs.append(run)
        if len(runs) >= 150:
            break


asyncio.run(main())
```
