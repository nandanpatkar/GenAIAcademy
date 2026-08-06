```python runs-geturl.py
from langsmith import Client

client = Client()
run_id = "<run-id>"
runs = list(client.list_runs(project_name="default", limit=1))
assert len(runs) > 0, "expected at least one run in the 'default' project"
run_id = runs[0].id
run = client.read_run(run_id)
url = client.get_run_url(run=run)
print(url)

print("✓ runs-geturl-before validated")


import asyncio

from langsmith import Client


async def main():
    client = Client()
    run_id = "<run-id>"
    runs = list(client.list_runs(project_name="default", limit=1))
    assert len(runs) > 0, "expected at least one run in the 'default' project"
    run_id = runs[0].id
    run = client.read_run(run_id)
    response = await client.runs.get_url(
        run.id,
        project_id=str(run.session_id),
        trace_id=str(run.trace_id),
        start_time=run.start_time.isoformat(),  # Optional, but speeds up retrieval
    )
    print(response.url)


asyncio.run(main())

print("✓ runs-geturl-after validated")
```
