```python runs-query-filter-time-range.py
from datetime import datetime, timedelta

from langsmith import Client

client = Client()
runs = client.list_runs(
    project_name="default",
    start_time=datetime.now() - timedelta(days=1),
    run_type="llm",
)

import asyncio
from datetime import datetime, timedelta

from langsmith import Client


async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    runs = client.runs.query(
        project_ids=[str(project.id)],
        min_start_time=datetime.now() - timedelta(days=1),
        run_type="LLM",
    )


asyncio.run(main())
```
