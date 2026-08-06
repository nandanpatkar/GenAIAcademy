# Custom Container — Go

| Info | Details |
|---|---|
| Tutorial | harness — Custom Container (Go) + ExecuteCommand |
| SDK | boto3 |
| Model | Claude Haiku 4.5 (Bedrock) |

**What you'll learn:**
- Attach a **Go** container to a harness so the agent can compile and run Go programs
- Use **ExecuteCommand** to verify the Go toolchain and inspect artifacts on the VM

**Why Go?**
Go compiles to a single static binary — no runtime dependencies, no `node_modules`, no virtualenvs. This makes it ideal for agents that build CLI tools, microservices, or system utilities. The agent writes `.go` files, runs `go build`, and executes the binary — all inside the isolated microVM.

> See also: [Node.js custom container](01_custom_container_node.ipynb) and [CLI script](02_custom_container_cli.py) (works with any container image).

## Step 0: Setup

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

## Step 1: Create Harness + Attach Go Container

We create the Harness and immediately update it with the Go container image in one flow.

```python
HARNESS_NAME = f"GoContainer_{uuid.uuid4().hex[:8]}"
CONTAINER_URI = "public.ecr.aws/docker/library/golang:1.24"

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
        break
    time.sleep(5)

print(f"\nAttaching container: {CONTAINER_URI}")
control.update_harness(
    harnessId=harness_id,
    environmentArtifact={"optionalValue": {"containerConfiguration": {"containerUri": CONTAINER_URI}}},
    systemPrompt=[
        {
            "text": "You are a helpful coding assistant. You have access to a full Go toolchain. When asked to write and run code, save .go files, use 'go run' or 'go build', and execute the resulting binary."
        }
    ],
)

for i in range(24):
    resp = control.get_harness(harnessId=harness_id)
    status = resp["harness"]["status"]
    print(f"Attempt {i + 1}: {status}")
    if status == "READY":
        print("✅ Harness ready with Go container")
        break
    time.sleep(5)
```

## Step 2: Invoke — Write, Build, and Run a Go Program

We ask the agent to write an HTTP server in Go, compile it, and test it. This demonstrates the full Go workflow: write source, `go build`, execute binary.

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
                        "Write a Go HTTP server that listens on port 3000 and returns a JSON response "
                        "with the current time, Go version, OS, architecture, and number of CPUs. "
                        "Initialize a Go module at /tmp/goserver, save the code as main.go, build it "
                        "into a binary called 'goserver', then test it: start the binary in the background, "
                        "curl localhost:3000, and kill the server. Show me the curl output."
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

## Step 3: ExecuteCommand — Verify the Go Environment

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

```python
run_command("go version")
run_command("go env GOROOT GOPATH GOARCH GOOS")
```

### Inspect the generated source and binary

```python
run_command("cat /tmp/goserver/main.go")
run_command("ls -lh /tmp/goserver/")
```

### Re-run the compiled binary ourselves

```python
# Start the compiled binary, curl it, kill it — all via ExecuteCommand
run_command(
    "cd /tmp/goserver && ./goserver & sleep 1 && curl -s http://localhost:3000 | python3 -m json.tool && kill %1 2>/dev/null"
)
```

## Step 4: Bonus — Cross-compile for Linux AMD64

Go makes cross-compilation trivial. Let's ask the agent to cross-compile the same server for `linux/amd64` and verify the binary.

```python
# Same session — state persists
response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=session_id,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": (
                        "Cross-compile the Go server at /tmp/goserver for linux/amd64 as /tmp/goserver/goserver-amd64. "
                        "Then use 'file' to show the binary type of both the original and the cross-compiled binary."
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

```python
control.delete_harness(harnessId=harness_id)
print(f"Deleted harness: {harness_id}")
```

```python
# Delete IAM role (optional — you may want to keep it for other notebooks)
delete_harness_role()
```
