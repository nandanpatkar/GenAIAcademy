```python runs-retrieve-not-found.py
import uuid

from langsmith import Client
from langsmith.utils import LangSmithNotFoundError

client = Client()
run_id = "<run-id>"
run_id = str(uuid.uuid4())

try:
    run = client.read_run(run_id)
except LangSmithNotFoundError:
    print(f"Run {run_id} not found")

import asyncio

from langsmith import Client
from langsmith import NotFoundError


async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    run_id = "<run-id>"
    start_time = "2026-06-01T12:00:00Z"
    run_id = str(uuid.uuid4())

    try:
        run = await client.runs.retrieve(
            run_id=run_id,
            project_id=str(project.id),
            start_time=start_time,
        )
    except NotFoundError:
        print(f"Run {run_id} not found")


asyncio.run(main())
```
