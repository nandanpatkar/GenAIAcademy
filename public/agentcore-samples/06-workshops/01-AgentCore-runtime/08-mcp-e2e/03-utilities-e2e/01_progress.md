## Progress Notifications on AgentCore Runtime

This tutorial demonstrates **Progress Notifications** — a MCP utility defined in the MCP specification. Progress notifications allow the **server** to stream real-time updates to the client during a long-running tool execution, so users can see what's happening instead of waiting in silence.

### What are Progress Notifications?

In standard MCP, a client calls a tool and waits for the result — the server is a black box until it responds. With progress notifications, the server can **fire updates mid-execution**, giving the client visibility into each stage of the work.

This is different from other stateful MCP primitives:
- **Elicitation**: server asks client for **user input** (blocks and waits for response)
- **Sampling**: server asks client for **LLM inference** (blocks and waits for response)
- **Progress**: server sends **execution updates** to the client — fire-and-forget, no response needed

### Fire-and-Forget vs Request/Response

```
Elicitation / Sampling:
  Server ──request──▶ Client
  Server ◀──response── Client   ← server waits here
  Server continues...

Progress:
  Server ──notification──▶ Client   ← client renders update
  Server continues immediately...   ← no wait
  Server ──notification──▶ Client
  Server continues immediately...
  ...
```

### When to Use Progress Notifications

- Any tool that takes more than a second or two to complete
- Multi-step workflows where each step is meaningful to the user
- Batch operations (importing data, processing records)
- When you want the client to render a progress bar or status display

### Tutorial Details

| Information | Details |
|:------------|:--------|
| Tutorial type | Stateful MCP — Progress Notifications |
| Feature | `ctx.report_progress()` — server-to-client execution updates |
| Session mode | Stateful (`stateless_http=False`) |
| Client | `fastmcp.Client` with `progress_handler` |
| Use case | 5-step monthly financial report (finance tracker) |

```python
!pip install -qU -r requirements.txt
```

Add following path so scripts can access helpers folder

```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path.cwd().parent))
```

### Writing the Progress MCP Server

The server exposes one tool: **`generate_report`**. It builds a monthly financial report in 5 distinct steps, calling `ctx.report_progress()` at the start of each stage so the client can track execution in real time.

| Step | progress/total | Work done |
|:-----|:--------------|:----------|
| 1 | 1/5 | Fetch all transactions from DynamoDB |
| 2 | 2/5 | Group and total spending by category |
| 3 | 3/5 | Fetch budget limits from DynamoDB |
| 4 | 4/5 | Compare spending vs budgets |
| 5 | 5/5 | Format and return the final report |

Key differences from the stateless server:
- `stateless_http` is **not set** (defaults to `False`) — required for progress notifications
- `generate_report` is `async def` and accepts `ctx: Context`
- Uses `await ctx.report_progress(progress=N, total=5)` — fire-and-forget, execution continues immediately
- `asyncio.sleep()` between steps makes the progress visible in the notebook

```python
%%writefile agents/mcp_progress_server.py
import os
import asyncio
from fastmcp import FastMCP, Context
from dynamo_utils import FinanceDB

mcp = FastMCP(name='Progress-MCP-Server')

_region = os.environ.get('AWS_REGION') or os.environ.get('AWS_DEFAULT_REGION') or 'us-east-1'
db = FinanceDB(region_name=_region)

@mcp.tool()
async def generate_report(user_alias: str, ctx: Context) -> str:
    """Generate a monthly financial report in 5 steps, streaming a progress
    notification to the client at the start of each stage.

    Args:
        user_alias: User identifier
    """
    total = 5

    # Step 1: Fetch transactions
    await ctx.report_progress(progress=1, total=total)
    await asyncio.sleep(0.5)
    transactions = db.get_transactions(user_alias)
    if not transactions:
        return f'No transactions found for {user_alias}.'

    # Step 2: Group by category
    await ctx.report_progress(progress=2, total=total)
    await asyncio.sleep(0.5)
    by_category = {}
    for t in transactions:
        cat = t['category']
        by_category[cat] = by_category.get(cat, 0) + abs(float(t['amount']))

    # Step 3: Fetch budgets
    await ctx.report_progress(progress=3, total=total)
    await asyncio.sleep(0.5)
    budgets = {b['category']: float(b['monthly_limit']) for b in db.get_budgets(user_alias)}

    # Step 4: Compare spending vs budgets
    await ctx.report_progress(progress=4, total=total)
    await asyncio.sleep(0.5)
    lines = []
    for cat, spent in sorted(by_category.items(), key=lambda x: -x[1]):
        limit = budgets.get(cat)
        if limit:
            pct = (spent / limit) * 100
            status = 'OVER' if spent > limit else 'OK'
            lines.append(f'  {cat:<15} ${spent:>8.2f} / ${limit:.2f}  [{pct:.0f}%] {status}')
        else:
            lines.append(f'  {cat:<15} ${spent:>8.2f}  (no budget set)')

    # Step 5: Format report
    await ctx.report_progress(progress=5, total=total)
    await asyncio.sleep(0.2)
    total_spent = sum(by_category.values())
    report = (
        f'Monthly Report for {user_alias}\n'
        f'{"=" * 50}\n'
        f'  {"Category":<15} {"Spent":>10}   {"Budget":>8}  Status\n'
        f'{"-" * 50}\n'
        + '\n'.join(lines) +
        f'\n{"-" * 50}\n'
        f'  {"TOTAL":<15} ${total_spent:>8.2f}\n'
    )
    return report


if __name__ == '__main__':
    mcp.run(
        transport="streamable-http",
        host="0.0.0.0",
        port=8000,
        stateless_http=False
    )
```

```python
%%writefile agents/requirements.txt
fastmcp>=2.10.0
mcp
bedrock-agentcore
```

Copy `dynamo_utils` file to agents folder

```python
!cp ../helpers/dynamo_utils.py agents/dynamo_utils.py
```

### Create DynamoDB Table and Seed Data

We create the `finance_tracker` table and seed it with sample expenses and budgets so the report has meaningful data to work with.

```python
import boto3

from helpers.dynamo_utils import FinanceDB

region = boto3.session.Session().region_name
db = FinanceDB(region_name=region)
result = db.create_table()
print(f"Region: {region}")
print(result)
```

```python
# Seed expenses
print("Seeding expenses...")
for user, amount, desc, cat in [
    ("me", 45.50, "Dinner", "food"),
    ("me", 85.30, "Groceries", "food"),
    ("me", 120.00, "Electricity", "bills"),
    ("me", 55.00, "Gas", "transport"),
    ("me", 15.99, "Netflix", "entertainment"),
    ("me", 30.00, "Spotify + apps", "entertainment"),
]:
    print(f"  {db.add_transaction(user, 'expense', -abs(amount), desc, cat)}")

# Seed budgets
print("\nSeeding budgets...")
for user, cat, limit in [
    ("me", "food", 100.00),
    ("me", "bills", 100.00),
    ("me", "transport", 60.00),
    ("me", "entertainment", 40.00),
]:
    print(f"  {db.set_budget(user, cat, limit)}")
```

### Set Up Cognito Authentication

```python
from helpers.utils import get_or_create_cognito_pool, reauthenticate_user

print("Setting up Amazon Cognito user pool...")
cognito_config = get_or_create_cognito_pool()
print("Cognito setup completed ✓")
```

### Create AgentCore Execution Role

```python
from helpers.utils import create_agentcore_runtime_execution_role, SAMPLE_ROLE_NAME

execution_role_arn = create_agentcore_runtime_execution_role(SAMPLE_ROLE_NAME)
```

### Deploy to AgentCore Runtime

```python
import boto3
from boto3.session import Session
from bedrock_agentcore_starter_toolkit import Runtime

boto_session = Session()
sts = boto3.client("sts")
account_id = sts.get_caller_identity()["Account"]

aws_agent_name = "mcp_progress_server"
runtime = Runtime()

runtime.configure(
    entrypoint="agents/mcp_progress_server.py",
    execution_role=execution_role_arn,
    auto_create_ecr=True,
    requirements_file="agents/requirements.txt",
    region=region,
    agent_name=aws_agent_name,
    authorizer_configuration={
        "customJWTAuthorizer": {
            "allowedClients": [cognito_config.get("client_id")],
            "discoveryUrl": cognito_config.get("discovery_url"),
        }
    },
    protocol="MCP",
    deployment_type="direct_code_deploy",
    runtime_type="PYTHON_3_13",
)

launch_result = runtime.launch()
print("Launch completed:", launch_result.agent_arn)
```

```python
status_response = runtime.status()
print(f"Final status: {status_response.endpoint['status']}")
```

### Test Progress Notifications

Now we'll invoke the deployed server and watch the progress bar animate across 5 steps.

#### How the progress_handler works

Each time the server calls `ctx.report_progress()`, fastmcp.Client receives a `notifications/progress` message and immediately calls our `progress_handler` — **without blocking the server**. The server is already running the next step by the time the handler finishes rendering.

| Step | Server emits | Handler renders |
|:-----|:------------|:----------------|
| 1 | `progress=1, total=5` | `[####----------------] 20%` |
| 2 | `progress=2, total=5` | `[########------------] 40%` |
| 3 | `progress=3, total=5` | `[############--------] 60%` |
| 4 | `progress=4, total=5` | `[################----] 80%` |
| 5 | `progress=5, total=5` | `[####################] 100%  Done!` |

```python
ac_runtime_name = launch_result.agent_id

mcp_url = (
    f"https://bedrock-agentcore.{region}.amazonaws.com"
    f"/runtimes/{ac_runtime_name}/invocations"
    f"?qualifier=DEFAULT&accountId={account_id}"
)

bearer_token = reauthenticate_user(cognito_config.get("client_id"), cognito_config.get("client_secret"))

headers = {
    "authorization": f"Bearer {bearer_token}",
    "Content-Type": "application/json",
}

print(f"MCP URL: {mcp_url}")
```

```python
async def progress_handler(progress: float, total: float | None, message: str | None):
    """Renders a live ASCII progress bar for each progress notification."""
    pct = int((progress / total) * 100) if total else 0
    filled = pct // 5
    bar = "#" * filled + "-" * (20 - filled)
    print(
        f"\r  Progress: [{bar}] {pct}% ({int(progress)}/{int(total or 0)})",
        end="",
        flush=True,
    )
    if total and progress >= total:
        print("  Done!")
```

```python
import logging

logging.getLogger("mcp.client.streamable_http").setLevel(logging.ERROR)

from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

transport = StreamableHttpTransport(url=mcp_url, headers=headers)

print("Testing Progress Notifications...\n" + "=" * 50)
async with Client(transport, progress_handler=progress_handler) as client:
    result = await client.call_tool("generate_report", {"user_alias": "me"})

print("=" * 50)
print(f"\n{result.content[0].text}")
```

---

### Clean Up (Optional)

Run the cells below to delete all AWS resources created in this tutorial.

```python
from pathlib import Path
from bedrock_agentcore_starter_toolkit.operations.runtime.destroy import (
    destroy_bedrock_agentcore,
)

print("Destroying AgentCore runtime...")
destroy_bedrock_agentcore(config_path=Path(".bedrock_agentcore.yaml"), agent_name=aws_agent_name)
```

```python
from helpers.utils import delete_agentcore_runtime_execution_role

print("Deleting IAM execution role...")
delete_agentcore_runtime_execution_role(SAMPLE_ROLE_NAME)
print("Execution role deleted ✓")
```

```python
from helpers.utils import cleanup_cognito_resources, delete_cognito_secret

print("Cleaning up Cognito resources...")
cleanup_cognito_resources(cognito_config.get("pool_id"))
print("Cognito resources cleaned up ✓")

print("Deleting Cognito secret...")
delete_cognito_secret()
print("Secret deleted ✓")
```

```python
print("Deleting DynamoDB table...")
result = db.delete_table()
print(result)
```

```python
from helpers.utils import local_file_cleanup

print("📁 Starting Local Files cleanup...")
local_file_cleanup()
```
