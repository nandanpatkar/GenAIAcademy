```python feedback-create.py
from langsmith import Client

client = Client()
run_id = "<run-id>"
project = client.read_project(project_name="default")
runs = list(client.list_runs(project_name="default", limit=1))
assert len(runs) > 0, "expected at least one run in the 'default' project"
run_id = str(runs[0].id)
client.create_feedback(
    run_id=run_id,
    key="user_feedback",
    score=1,
)

print("✓ feedback-create-before validated")


from langsmith import Client

client = Client()
run_id = "<run-id>"
session_id = "<session-id>"
project = client.read_project(project_name="default")
session_id = str(project.id)
runs = list(client.list_runs(project_name="default", limit=1))
assert len(runs) > 0, "expected at least one run in the 'default' project"
run_id = str(runs[0].id)
client.create_feedback(
    run_id=run_id,
    key="user_feedback",
    score=1,
    session_id=session_id,
)

print("✓ feedback-create-after validated")
```
