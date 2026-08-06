## End-to-end Stateless MCP Client on AgentCore Runtime

This example demonstrates full MCP client capabilities (from MCP Spec) deployed on AgentCore Runtime.

This can be useful to create MCP servers on AgentCore Runtime that can take advantage of MCP native elicitation, and sampling for example.

In this tutorial, you will learn:

* How to create an MCP server with elicitation and sampling
* How to deploy into AgentCore Runtime
* How to invoke your deployed server

### Tutorial Details

| Information         | Details                                                   |
|:--------------------|:----------------------------------------------------------|
| Tutorial type       | Hosting Elicitation and Sampling on Runtime               |
| Tool type           | MCP server                                                |
| Tutorial components | Hosting on AgentCore Runtime, Creating an MCP server      |
| Tutorial vertical   | Cross-vertical                                            |
| Example complexity  | Medium                                                    |
| SDK used            | Amazon BedrockAgentCore Python SDK and MCP Client         |

### Tutorial Architecture

In this tutorial notebook, you are going to build one agent. First you will deploy the agent on AgentCore Runtime with four tools. Then you will update it to add prompts. Finally you will update it again to deploy resources.

So let's get started!

```python
!uv pip install -qU -r requirements.txt
```

Add following path so scripts can access helpers folder

```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path.cwd().parent))
```

### Creating MCP Server

To get started, you are going to create the MCP Server with Elicitation (only) and later we will add other features on it.

This MCP consists of 4 MCP tools:

- **add_expense_interactive**: add expenses interactively, asking for values

Data will be persisted in a DynamoDB table, so we can have data persisted and used in next steps during this tutorial. 

Execute the following code to generate local file for MCP server and requirements file

```python
%%writefile agents/mcp_client_features.py
import os
from pydantic import BaseModel
from fastmcp import FastMCP, Context
from fastmcp.server.elicitation import AcceptedElicitation
from dynamo_utils import FinanceDB

mcp = FastMCP(name='ElicitationMCP')

# AWS_REGION is reliably set in all AgentCore/Lambda containers
_region = os.environ.get('AWS_REGION') or os.environ.get('AWS_DEFAULT_REGION') or 'us-east-1'
db = FinanceDB(region_name=_region)

class AmountInput(BaseModel):
    amount: float

class DescriptionInput(BaseModel):
    description: str

class CategoryInput(BaseModel):
    category: str  # one of: food, transport, bills, entertainment, other

class ConfirmInput(BaseModel):
    confirm: str  # Yes or No

@mcp.tool()
async def add_expense_interactive(user_alias: str, ctx: Context) -> str:
    """Interactively add a new expense using elicitation
    Args:
        user_alias: User identifier
    """
    print(f'Debug this method, user_alias: {user_alias}')
    # Step 1: Ask for the amount
    result = await ctx.elicit('How much did you spend?', AmountInput)
    if not isinstance(result, AcceptedElicitation):
       return 'Expense entry cancelled.'
    amount = result.data.amount

    # Step 2: Ask for a description
    result = await ctx.elicit('What was it for?', DescriptionInput)
    if not isinstance(result, AcceptedElicitation):
       return 'Expense entry cancelled.'
    description = result.data.description

    # Step 3: Select a category
    result = await ctx.elicit(
        'Select a category (food, transport, bills, entertainment, other):',
        CategoryInput
    )
    if not isinstance(result, AcceptedElicitation):
       return 'Expense entry cancelled.'
    category = result.data.category

    # Step 4: Confirm before saving
    confirm_msg = f'Confirm: add expense of ${amount:.2f} for {description} (category: {category})? Reply Yes or No'
    result = await ctx.elicit(confirm_msg, ConfirmInput)
    if not isinstance(result, AcceptedElicitation) or result.data.confirm != 'Yes':
        return 'Expense entry cancelled.'

    return db.add_transaction(user_alias, 'expense', -abs(amount), description, category)

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

Now let's create our DynamoDB table, in case it wasn't created, that will be used for our MCP

```python
import boto3

from helpers.dynamo_utils import FinanceDB

region = boto3.session.Session().region_name
db = FinanceDB(region_name=region)
result = db.create_table()
print(f"Region: {region}")
print(result)
```

#### Create Cognito User Pool for Authentication

Let's create a Cognito user pool to ensure authentication in our MCP Server

```python
from helpers.utils import get_or_create_cognito_pool, reauthenticate_user

print("Setting up Amazon Cognito user pool...")
cognito_config = get_or_create_cognito_pool()  # You'll get your bearer token from this output cell.
print("Cognito setup completed ✓")
```

Now, let's create the AgentCore execution role:

```python
from helpers.utils import create_agentcore_runtime_execution_role, SAMPLE_ROLE_NAME

execution_role_arn_mcp = create_agentcore_runtime_execution_role(SAMPLE_ROLE_NAME)
```

#### Configure and Launch MCP Server on AgentCore Runtime

Configure and launch the elicitation server on AgentCore. The server code uses `stateless_http=False` (the default) — AgentCore maintains the session so the server can pause and resume for each elicitation step.

```python
import json
import boto3
from boto3.session import Session
from bedrock_agentcore_starter_toolkit import Runtime

boto_session = Session()
sts = boto3.client("sts")
account_id = sts.get_caller_identity()["Account"]
region = boto_session.region_name

aws_agent_name = "mcp_client_features"
runtime = Runtime()

response = runtime.configure(
    entrypoint="agents/mcp_client_features.py",
    execution_role=execution_role_arn_mcp,
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
print("Configuration completed:", response)
```

```python
launch_result = runtime.launch()
print("Launch completed:", launch_result.agent_arn)
```

```python
status_response = runtime.status()
status = status_response.endpoint["status"]
print(f"Final status: {status}")
```

### Test Elicitation

Now we'll invoke the deployed server and watch elicitation in action.

#### The scenario

We're logging a lunch expense. Instead of passing all arguments to the tool upfront, the server will guide us through the entry step by step — asking for the amount, what it was for, a category, and finally a confirmation before writing to DynamoDB.

This mirrors how a real user-facing assistant would work: the server drives the conversation, collecting one piece of information at a time.

#### How the test works

`fastmcp.Client` is the only MCP client that supports an `elicitation_handler` callback. Each time the **server** calls `await ctx.elicit(...)`, it sends an `elicitation/create` request back to the client over the open session. The client calls our handler, which returns the next pre-defined response.

Since Jupyter can't interactively accept `input()` calls from a remote server, we simulate the user by pre-loading the four answers:

| Step | Server asks | We respond |
|:-----|:------------|:-----------|
| 1 | `"How much did you spend?"` | `{"amount": 45.50}` |
| 2 | `"What was it for?"` | `{"description": "Lunch at the office"}` |
| 3 | `"Select a category..."` | `{"category": "food"}` |
| 4 | `"Confirm: add expense of $45.50..."` | `{"confirm": "Yes"}` |

Each response is a dict whose keys match the field names of the Pydantic model the server defined for that step (`AmountInput`, `DescriptionInput`, `CategoryInput`, `ConfirmInput`). On the final `"Yes"`, the server calls `db.add_transaction()` and returns the result.

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
import asyncio
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

# Recreated on every run so the iterator is always fresh
_responses = iter(
    [
        {"amount": 45.50},
        {"description": "Lunch at the office"},
        {"category": "food"},
        {"confirm": "Yes"},
    ]
)


async def elicit_handler(message, response_type, params, context):
    response = next(_responses)
    print(f"  Server asks: {message}")
    print(f"  Auto-responding: {response}\n")
    return response


async def invoke_tool(tool_name: str, tool_params: dict):
    transport = StreamableHttpTransport(url=mcp_url, headers=headers)
    async with Client(transport, elicitation_handler=elicit_handler) as client:
        print("\n    Waiting 2s for session initialization...")
        await asyncio.sleep(2)

        print(f"\n➕ Testing tool: {tool_name}()...")
        try:
            result = await client.call_tool(tool_name, tool_params)
            print(f"   Result: {result.content[0].text}")
        except Exception as e:
            print(f"   Error: {e}")
```

```python
tool_name = "add_expense_interactive"
tool_arguments = {"user_alias": "me"}
await invoke_tool(tool_name, tool_arguments)
```

---

### Changing our Runtime to add Sampling on it

Let's make a few changes into our MCP code, to add more features on it.

#### What is Sampling?

In standard MCP, the client calls a tool and the server responds. With sampling, the server can **pause tool execution** and ask the client to run an LLM, then use the AI-generated result to complete the task.

This is different from other MCP features:
- **Tools**: client calls server with arguments → server responds
- **Prompts**: server returns a prompt template for the client to send to an LLM
- **Resources**: server exposes data the client can read
- **Elicitation**: server asks the client for **user input**
- **Sampling**: server asks the client for **LLM-generated text**

### The Inverted Flow

```
Normal:   Client ──tool call──▶ Server ──result──▶ Client

Sampling: Client ──tool call──▶ Server
                                  │
                                  └──sampling/createMessage──▶ Client
                                  ◀────────LLM response────────┘
                                  │
                                  └──────────result────────────▶ Client
```

The server has the **data** (from DynamoDB). The client has the **LLM** (Bedrock Claude). Sampling bridges them.

### When to Use Sampling

- When a tool needs to generate natural language from structured data it just retrieved
- When the server wants AI-powered analysis without embedding an LLM in the server itself
- When different clients may use different LLMs — the server stays model-agnostic

```python
%%writefile agents/mcp_client_features.py
import os
from pydantic import BaseModel
from fastmcp import FastMCP, Context
from fastmcp.server.elicitation import AcceptedElicitation
from dynamo_utils import FinanceDB

mcp = FastMCP(name='ElicitationMCP')

# AWS_REGION is reliably set in all AgentCore/Lambda containers
_region = os.environ.get('AWS_REGION') or os.environ.get('AWS_DEFAULT_REGION') or 'us-east-1'
db = FinanceDB(region_name=_region)

class AmountInput(BaseModel):
    amount: float

class DescriptionInput(BaseModel):
    description: str

class CategoryInput(BaseModel):
    category: str  # one of: food, transport, bills, entertainment, other

class ConfirmInput(BaseModel):
    confirm: str  # Yes or No

@mcp.tool()
async def add_expense_interactive(user_alias: str, ctx: Context) -> str:
    """Interactively add a new expense using elicitation
    Args:
        user_alias: User identifier
    """
    print(f'Debug this method, user_alias: {user_alias}')
    # Step 1: Ask for the amount
    result = await ctx.elicit('How much did you spend?', AmountInput)
    if not isinstance(result, AcceptedElicitation):
       return 'Expense entry cancelled.'
    amount = result.data.amount

    # Step 2: Ask for a description
    result = await ctx.elicit('What was it for?', DescriptionInput)
    if not isinstance(result, AcceptedElicitation):
       return 'Expense entry cancelled.'
    description = result.data.description

    # Step 3: Select a category
    result = await ctx.elicit(
        'Select a category (food, transport, bills, entertainment, other):',
        CategoryInput
    )
    if not isinstance(result, AcceptedElicitation):
       return 'Expense entry cancelled.'
    category = result.data.category

    # Step 4: Confirm before saving
    confirm_msg = f'Confirm: add expense of ${amount:.2f} for {description} (category: {category})? Reply Yes or No'
    result = await ctx.elicit(confirm_msg, ConfirmInput)
    if not isinstance(result, AcceptedElicitation) or result.data.confirm != 'Yes':
        return 'Expense entry cancelled.'

    return db.add_transaction(user_alias, 'expense', -abs(amount), description, category)


@mcp.tool()
def add_expense(user_alias: str, amount: float, description: str, category: str = 'other') -> str:
    """Add a new expense transaction.

    Args:
        user_alias: User identifier
        amount: Expense amount (positive number)
        description: Description of the expense
        category: Expense category (food, transport, bills, entertainment, other)
    """
    return db.add_transaction(user_alias, 'expense', -abs(amount), description, category)


@mcp.tool()
async def analyze_spending(user_alias: str, ctx: Context) -> str:
    """Fetch this user's expenses from DynamoDB and use the client's LLM
    to generate a personalised financial analysis.

    Args:
        user_alias: User identifier
    """
    transactions = db.get_transactions(user_alias)
    if not transactions:
        return f'No transactions found for {user_alias}.'

    lines = '\n'.join(
        f"- {t['description']} (${abs(float(t['amount'])):.2f}, {t['category']})"
        for t in transactions
    )

    prompt = (
        f'Here are the recent expenses for a user:\n{lines}\n\n'
        f'Please analyse the spending patterns and give 3 concise, '
        f'actionable recommendations to improve their finances. '
        f'Keep the response under 120 words.'
    )

    ai_analysis = 'Analysis unavailable.'
    try:
        response = await ctx.sample(messages=prompt, max_tokens=300)
        if hasattr(response, 'text') and response.text:
            ai_analysis = response.text
    except Exception:
        pass

    return f'Spending Analysis for {user_alias}:\n\n{ai_analysis}'


if __name__ == '__main__':
    mcp.run(
        transport="streamable-http",
        host="0.0.0.0",
        port=8000,
        stateless_http=False
    )
```

Now, let's redeploy with sampling

```python
launch_result = runtime.launch()
print("Launch completed:", launch_result.agent_arn)
```

#### Testing new feature

Let's test the brand new feature that we just added into our MCP server.

```python
bearer_token = reauthenticate_user(cognito_config.get("client_id"), cognito_config.get("client_secret"))

headers = {
    "authorization": f"Bearer {bearer_token}",
    "Content-Type": "application/json",
}
```

```python
import boto3
from mcp.types import CreateMessageResult, TextContent

MODEL_ID = "us.anthropic.claude-haiku-4-5-20251001-v1:0"
bedrock = boto3.client("bedrock-runtime", region_name=region)


def _invoke_bedrock(prompt: str, max_tokens: int) -> str:
    body = json.dumps(
        {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "messages": [{"role": "user", "content": prompt}],
        }
    )
    resp = bedrock.invoke_model(modelId=MODEL_ID, body=body)
    return json.loads(resp["body"].read())["content"][0]["text"]


async def sampling_handler(messages, params, ctx):
    """Called by fastmcp.Client when the server issues ctx.sample()."""
    prompt = (
        messages
        if isinstance(messages, str)
        else " ".join(m.content.text for m in messages if hasattr(m.content, "text"))
    )
    max_tokens = params.maxTokens if params and hasattr(params, "maxTokens") and params.maxTokens else 300
    text = await asyncio.to_thread(_invoke_bedrock, prompt, max_tokens)
    return CreateMessageResult(
        role="assistant",
        content=TextContent(type="text", text=text),
        model=MODEL_ID,
        stopReason="end_turn",
    )
```

```python
transport = StreamableHttpTransport(url=mcp_url, headers=headers)

print("Testing Sampling...\n" + "=" * 50)

async with Client(transport, sampling_handler=sampling_handler) as client:
    expenses = [
        {
            "user_alias": "me",
            "amount": 45.50,
            "description": "Dinner",
            "category": "food",
        },
        {
            "user_alias": "me",
            "amount": 120.00,
            "description": "Electricity",
            "category": "bills",
        },
        {
            "user_alias": "me",
            "amount": 15.99,
            "description": "Netflix",
            "category": "entertainment",
        },
        {
            "user_alias": "me",
            "amount": 85.30,
            "description": "Groceries",
            "category": "food",
        },
    ]
    for args in expenses:
        await client.call_tool("add_expense", args)
        print(f"  Added: {args['description']} (${args['amount']:.2f})")

    print("\n  Calling analyze_spending...")
    result = await client.call_tool("analyze_spending", {"user_alias": "me"})

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

# Delete execution role
print("  🗑️  Deleting Agent execution role...")
delete_agentcore_runtime_execution_role(SAMPLE_ROLE_NAME)
print("  ✅ Execution role deleted")
```

```python
from helpers.utils import (
    cleanup_cognito_resources,
    delete_cognito_secret,
    get_cognito_secret,
)

# Clean up Cognito and secrets
print("  🗑️  Cleaning up Cognito resources...")
cs = json.loads(get_cognito_secret())
cleanup_cognito_resources(cognito_config.get("pool_id"))
print("  ✅ Cognito resources cleaned up")

print("  🗑️  Deleting customer support secret...")
delete_cognito_secret()
print("  ✅ Customer support secret deleted")
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
