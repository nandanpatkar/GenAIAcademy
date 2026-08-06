```python runs-query-selecting-fields.py
from langsmith import Client

client = Client()
# returns a default set of fields; no explicit selection needed
runs = client.list_runs(project_name="default")
for run in runs:
    print(run.id, run.name, run.run_type, run.status, run.start_time, run.inputs, run.error)
    break

import asyncio

from langsmith import Client


async def main():
    client = Client()
    project = await client.aread_project(project_name="default")
    # must explicitly list every field needed; default returns only id
    async for run in client.runs.query(
        project_ids=[str(project.id)],
        selects=["ID", "NAME", "RUN_TYPE", "STATUS", "START_TIME", "INPUTS", "ERROR"],
    ):
        print(run.id, run.name, run.run_type, run.status, run.start_time, run.inputs, run.error)
        break


asyncio.run(main())
```
