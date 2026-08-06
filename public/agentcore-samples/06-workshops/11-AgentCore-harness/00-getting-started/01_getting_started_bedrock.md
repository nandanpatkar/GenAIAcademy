# Getting Started with harness in AgentCore 

Welcome to **harness in AgentCore** — it helps developers experiment and ship agents faster by letting them define and run agents in one API call, skipping framework setup, orchestration code, and deployment.

| Info | Details |
|---|---|
| Tutorial | Getting Started — Create, Invoke, ExecuteCommand |
| SDK | boto3 |
| Model | Claude Haiku 4.5 and Claude Sonnet 4.6 (Bedrock) |

This notebook walks you through:
1. Creating an IAM execution role
2. Creating a Harness agent
3. Invoking the agent with a prompt
4. Running commands on the agent's VM
5. Cleanup

### 1. Install Dependencies

```python
!uv pip install -qU -r ../requirements.txt
```

```python
!uv pip freeze | grep boto3
```

Please restart your jupyter kernel before continuing.

### 2. Setup

Import the shared helper from the project root. These handle IAM role creation, boto3 client configuration, and lifecycle operations.

```python
import sys
import time
import uuid
from pathlib import Path
import boto3

# helpers
sys.path.insert(0, str(Path.cwd().parent))

# --- Configuration ---
from helper.iam import create_harness_role, delete_harness_role
from helper.client import get_agentcore_control_client, get_agentcore_client

# --- Create boto3 clients ---
control = get_agentcore_control_client()
client = get_agentcore_client()

account_id = boto3.client("sts").get_caller_identity()["Account"]
print(f"Account: {account_id}")
```

### 3. Create IAM Role

Create the IAM execution role with all necessary permissions for it. This is idempotent — if the role already exists, it returns the existing ARN.

```python
role_arn = create_harness_role()
print(f"\nExecution Role ARN: {role_arn}")

print("Waiting for IAM role to propagate...")
time.sleep(10)
print("Ready!")
```

### 4. Create Harness Agent

Create a new Harness agent with a unique name. The agent starts in `CREATING` status and transitions to `READY` after a few seconds.

```python
HARNESS_NAME = f"GettingStarted_{uuid.uuid4().hex[:8]}"

resp = control.create_harness(
    harnessName=HARNESS_NAME,
    executionRoleArn=role_arn,
)
harness = resp["harness"]
harness_id = harness["harnessId"]
harness_arn = harness["arn"]
print(f"Harness ID: {harness_id}")
print(f"Harness ARN: {harness_arn}")
print(f"Status: {harness['status']}")

# Check for readiness
for i in range(12):
    resp = control.get_harness(harnessId=harness_id)
    status = resp["harness"]["status"]
    print(f"Attempt {i + 1}: {status}")
    if status == "READY":
        print("\u2705 Harness is ready")
        break
    time.sleep(5)
```

### 5. Invoke Agent

Send a message to the agent. Each invocation needs a `session_id` that identifies the isolated microVM. The response is streamed — text and tool calls arrive as events.

> 💡 Change the message or model to experiment. The agent has `file_operations` and `shell` tools available by default.

```python
session_id = str(uuid.uuid4()).upper()
print(f"Session ID: {session_id}\n")

response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=session_id,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": "What are three fun things to do in Seattle on a rainy day?"
                    "Save your answer to a Markdown file."
                }
            ],
        }
    ],
    model={"bedrockModelConfig": {"modelId": "global.anthropic.claude-haiku-4-5-20251001-v1:0"}},
)

for event in response["stream"]:
    if "contentBlockStart" in event:
        start = event["contentBlockStart"].get("start", {})
        if "toolUse" in start:
            print(f"\n[Tool: {start['toolUse'].get('name', '?')}]", flush=True)
    elif "contentBlockDelta" in event:
        delta = event["contentBlockDelta"].get("delta", {})
        if "text" in delta:
            print(delta["text"], end="", flush=True)
    elif "messageStop" in event:
        print()
    elif "internalServerException" in event:
        print(f"\nError: {event['internalServerException']}")
```

Now, let's reuse same session ID, change the model, and generate a new file with the new model.

```python
print(f"Session ID: {session_id}\n")

response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=session_id,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": "What are three fun things to do in Seattle on a rainy day?"
                    "Save your answer to a Markdown file with Sonnet prefix."
                }
            ],
        }
    ],
    model={"bedrockModelConfig": {"modelId": "global.anthropic.claude-sonnet-4-6"}},
)

for event in response["stream"]:
    if "contentBlockStart" in event:
        start = event["contentBlockStart"].get("start", {})
        if "toolUse" in start:
            print(f"\n[Tool: {start['toolUse'].get('name', '?')}]", flush=True)
    elif "contentBlockDelta" in event:
        delta = event["contentBlockDelta"].get("delta", {})
        if "text" in delta:
            print(delta["text"], end="", flush=True)
    elif "messageStop" in event:
        print()
    elif "internalServerException" in event:
        print(f"\nError: {event['internalServerException']}")
```

### 6. Run Commands on the Agent's VM

Every Harness session runs in an isolated microVM. Use `execute_command` to run shell commands directly on the VM — useful for inspecting the environment or reading files the agent created.

> ⚠️ **Why not `!ls`?** Jupyter's `!` runs commands on your **local environment** where Jupyter is running. `execute_command` runs on the **agent's remote microVM** in AWS.

```python
def run(cmd: str):
    print(f"$ {cmd}")
    resp = client.invoke_agent_runtime_command(
        agentRuntimeArn=harness_arn,
        runtimeSessionId=session_id,
        body={"command": cmd},
    )
    for event in resp["stream"]:
        if "chunk" in event:
            chunk = event["chunk"]
            if "contentDelta" in chunk:
                d = chunk["contentDelta"]
                if "stdout" in d:
                    print(d["stdout"], end="", flush=True)
                if "stderr" in d:
                    print(d["stderr"], end="", flush=True)
            elif "contentStop" in chunk:
                print(f"\n[exit: {chunk['contentStop']['exitCode']}]")
    print()
```

```python
run("ls -la")
```

```python
run("pwd")
```

```python
# List files, then read each .md file
run('for f in *.md; do echo "=== $f ==="; cat "$f"; echo; done')
```

### 7. Cleanup

Delete the Harness agent and IAM role when done.

```python
control.delete_harness(harnessId=harness_id)
print(f"Deleted harness: {harness_id}")
```

```python
delete_harness_role()
```
