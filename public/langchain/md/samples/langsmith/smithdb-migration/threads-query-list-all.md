```python threads-query-list-all.py
from langsmith import Client

client = Client()
threads = client.list_threads(project_name="default")
for thread in threads:
    print(thread["thread_id"], thread["count"])
    break

import asyncio
from datetime import datetime, timedelta, timezone

from langsmith import Client


async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    async for thread in client.threads.query(
        project_id=str(project.id),
        min_start_time=datetime.now(timezone.utc) - timedelta(days=30),
        max_start_time=datetime.now(timezone.utc),
    ):
        print(thread.thread_id, thread.count)
        break


asyncio.run(main())
```
