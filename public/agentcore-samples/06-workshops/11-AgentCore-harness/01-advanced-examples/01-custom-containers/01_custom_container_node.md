# Custom Container + Command Line

| Info | Details |
|---|---|
| Tutorial | harness with Custom Container (Node.js) + ExecuteCommand |
| SDK | boto3 |
| Model | Claude Haiku 4.5 (Bedrock) |

**What you'll learn:**
- How to attach a **custom container image** to a Harness so the agent runs in your own environment
- How to use **ExecuteCommand** (`invoke_agent_runtime_command`) to run imperative commands directly on the agent's VM
- How to verify the agent can use the container's runtime (Node.js) to write and execute code

**Why custom containers?**
By default, a Harness session runs on Amazon Linux 2023 with Python. But many real-world agents need specific runtimes, system libraries, or pre-installed dependencies. Custom containers let you bring your own environment — Node.js, Go, Rust, Java, or anything packaged as a container image.

**Prerequisites:**
- AWS account with access to Amazon Bedrock AgentCore
- AWS CLI v2 configured with credentials
- Python 3.10+

## Step 0: Setup

Import helper and create the IAM execution role.

```python
import sys
import time
import uuid
from pathlib import Path
import boto3

# helpers
sys.path.insert(0, str(Path.cwd().parent.parent))

# --- Configuration ---
from helper.iam import create_harness_role, delete_harness_role
from helper.client import get_agentcore_control_client, get_agentcore_client

# --- Create boto3 clients ---
control = get_agentcore_control_client()
client = get_agentcore_client()

account_id = boto3.client("sts").get_caller_identity()["Account"]
print(f"Account: {account_id}")
```

```python
role_arn = create_harness_role()
print(f"\nExecution Role ARN: {role_arn}")

print("Waiting for IAM role to propagate...")
time.sleep(10)
print("Ready!")
```

## Step 1: Create a Harness

We create a basic Harness first, then attach the custom container in the next step. This two-step approach mirrors a common workflow: start with defaults, then customize.

```python
HARNESS_NAME = f"NodeContainer_{uuid.uuid4().hex[:8]}"

resp = control.create_harness(
    harnessName=HARNESS_NAME,
    executionRoleArn=role_arn,
)

harness = resp["harness"]
harness_id = harness["harnessId"]
harness_arn = harness["arn"]
print(f"Harness ID: {harness_id}")

for i in range(12):
    resp = control.get_harness(harnessId=harness_id)
    status = resp["harness"]["status"]
    print(f"Attempt {i + 1}: {status}")
    if status == "READY":
        print("✅ Harness is ready")
        break
    time.sleep(5)
```

## Step 2: Attach a Custom Container

We update the harness with a **Node.js** container image from public ECR. This replaces the default Amazon Linux environment with a Node.js runtime, giving the agent access to `node`, `npm`, and the full Node.js ecosystem.

You can use any public or private ECR image:
- `public.ecr.aws/docker/library/node:slim` — Node.js
- `public.ecr.aws/docker/library/python:3.12-slim` — Python
- `public.ecr.aws/docker/library/golang:1.24` — Go
- Your own private ECR image with custom dependencies

We also set a system prompt that tells the agent it has Node.js available.

```python
CONTAINER_URI = "public.ecr.aws/docker/library/node:slim"

control.update_harness(
    harnessId=harness_id,
    environmentArtifact={"optionalValue": {"containerConfiguration": {"containerUri": CONTAINER_URI}}},
    systemPrompt=[
        {
            "text": "You are a helpful coding assistant. You have access to a Node.js runtime. When asked to write and run code, save it to a file and execute it using the shell."
        }
    ],
)

print(f"Container: {CONTAINER_URI}")
print("Waiting for update...")
for i in range(24):
    resp = control.get_harness(harnessId=harness_id)
    status = resp["harness"]["status"]
    print(f"Attempt {i + 1}: {status}")
    if status == "READY":
        print("✅ Harness updated")
        break
    time.sleep(5)
```

## Step 3: Invoke the Agent — Write and Run Node.js Code

Now we invoke the agent and ask it to write a Node.js script, save it to a file, and execute it. The agent uses the built-in `file_operations` and `shell` tools to accomplish this — the Node.js runtime is available because of our custom container.

> Since the container changed, we use a **new session ID** so the agent gets a fresh VM with the updated environment.

```python
import uuid

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
                    "text": (
                        "Write a Node.js script that creates a simple HTTP server on port 3000 "
                        "that returns JSON with the current time, Node.js version, and platform info. "
                        "Save it to /tmp/server.js. Then test it — start the server in the "
                        "background, make an HTTP request using Node.js http module (curl is not available), "
                        "and kill the server. Show me the output."
                    )
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

## Step 4: Run Commands Directly on the VM (ExecuteCommand)

The `invoke_agent_runtime_command` API lets you run **imperative commands** directly on the agent's VM — without going through the agent loop. This is useful for:
- Inspecting the environment (OS, runtimes, installed packages)
- Reading files the agent created
- Running deterministic scripts or verifying artifacts

> **Why not just use `!pwd`?** Jupyter's `!` runs commands on your **local machine**. Here we run commands on the **agent's remote VM** in AWS.

```python
def run_command(command: str):
    """Run a command on the agent's VM and print output."""
    print(f"$ {command}")
    resp = client.invoke_agent_runtime_command(
        agentRuntimeArn=harness_arn,
        runtimeSessionId=session_id,
        body={"command": command},
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

### Verify the Node.js environment

Confirm that the custom container's runtime is available on the VM:

```python
run_command("node --version")
run_command("npm --version")
```

### Inspect the agent's generated code

Read back the script the agent wrote:

```python
run_command("cat /tmp/server.js")
```

### Run the script ourselves via ExecuteCommand

We can also re-run the agent's code directly, without invoking the agent loop:

```python
# Start server, test with Node.js http module, then stop
run_command(
    "node /tmp/server.js & sleep 1 && node -e \"require('http').get('http://localhost:3000',r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>console.log(JSON.stringify(JSON.parse(d),null,2)))})\" && kill %1 2>/dev/null"
)
```

### Explore the VM environment

A few more useful commands to understand what's running:

```python
run_command("cat /etc/os-release")
run_command("pwd")
run_command("whoami")
run_command("ls -la /tmp/")
```

## Step 5: Install npm packages and use them

Since we have a full Node.js environment, the agent can also install npm packages at runtime. Let's ask it to install a package and use it:

```python
# Same session — the VM state persists
response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=session_id,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": (
                        "Install the 'chalk' npm package (latest), then write a Node.js script at /tmp/colors.js "
                        "that uses chalk to print a colorful welcome banner with different colored lines. Run it."
                    )
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

## Cleanup

**Run these cells when done testing** to delete all resources and avoid charges.

```python
control.delete_harness(harnessId=harness_id)
print(f"Deleted harness: {harness_id}")
```

```python
# Delete IAM role (optional — if you've created)
delete_harness_role()
```
