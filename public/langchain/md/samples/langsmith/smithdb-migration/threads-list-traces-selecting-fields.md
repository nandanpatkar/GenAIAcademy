```python threads-list-traces-selecting-fields.py
import asyncio
from datetime import datetime, timedelta, timezone


async def find_thread_id(project_id: str) -> str:
    from langsmith import Client

    client = Client()
    async for thread in client.threads.query(
        project_id=project_id,
        min_start_time=datetime.now(timezone.utc) - timedelta(days=30),
        max_start_time=datetime.now(timezone.utc),
        page_size=5,
    ):
        return thread.thread_id
    raise RuntimeError("no threads found")


from langsmith import Client

client = Client()
thread_id = "<thread-id>"
project = client.read_project(project_name="default")
thread_id = asyncio.run(find_thread_id(str(project.id)))
for run in client.read_thread(
    thread_id=thread_id,
    project_name="default",
    select=["id", "total_tokens", "total_cost"],
):
    print(run.id, run.total_tokens, run.total_cost)
    break

import asyncio

from langsmith import Client


async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    thread_id = "<thread-id>"
    thread_id = await find_thread_id(str(project.id))
    async for trace in client.threads.list_traces(
        thread_id,
        project_id=str(project.id),
        selects=["TRACE_ID", "TOTAL_TOKENS", "TOTAL_COST"],
    ):
        print(trace.trace_id, trace.total_tokens, trace.total_cost)
        break


asyncio.run(main())
```
