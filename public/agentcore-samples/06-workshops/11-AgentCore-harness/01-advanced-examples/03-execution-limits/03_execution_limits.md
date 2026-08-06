# Execution Limits

Control how much work a Harness agent can do per invocation by setting execution limits.

| Info | Details |
|---|---|
| Tutorial | Execution Limits — maxIterations, timeoutSeconds, maxTokens |
| SDK | boto3 |
| Model | Claude Haiku 4.5 (Bedrock) |

The `invoke_harness` API accepts three limit parameters:

| Parameter | What it controls |
|---|---|
| `maxIterations` | Maximum number of agent loop iterations (think → act → observe cycles) |
| `timeoutSeconds` | Wall-clock time limit for the entire invocation |
| `maxTokens` | Maximum tokens the model can generate per invocation |

This notebook demonstrates each limit and shows what happens when the agent hits them.

### 1. Install Dependencies

```python
!uv pip install -qU -r ../../requirements.txt
```

Please restart your jupyter kernel before continuing.

### 2. Setup

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

### 3. Create IAM Role & Harness

```python
role_arn = create_harness_role()
print(f"\nExecution Role ARN: {role_arn}")

print("Waiting for IAM role to propagate...")
time.sleep(10)
print("Ready!")
```

```python
HARNESS_NAME = f"ExecLimits_{uuid.uuid4().hex[:8]}"

resp = control.create_harness(harnessName=HARNESS_NAME, executionRoleArn=role_arn)
harness = resp["harness"]
harness_id = harness["harnessId"]
harness_arn = harness["arn"]
print(f"Harness ID: {harness_id}")

for i in range(12):
    status = control.get_harness(harnessId=harness_id)["harness"]["status"]
    print(f"  {status}")
    if status == "READY":
        print("\u2705 Harness is ready")
        break
    time.sleep(5)
```

### Helper — stream and print harness responses

```python
MODEL_ID = "global.anthropic.claude-haiku-4-5-20251001-v1:0"


def invoke(prompt: str, **limits) -> str:
    """Invoke the harness with a prompt and optional execution limits.

    Pass any of: maxIterations=, timeoutSeconds=, maxTokens=
    Returns the session ID so you can use run() to inspect the VM.
    """
    sid = str(uuid.uuid4()).upper()
    limit_str = ", ".join(f"{k}={v}" for k, v in limits.items()) or "(defaults)"
    print(f"--- Limits: {limit_str} ---")
    print(f"Session: {sid}\n")

    response = client.invoke_harness(
        harnessArn=harness_arn,
        runtimeSessionId=sid,
        messages=[{"role": "user", "content": [{"text": prompt}]}],
        model={"bedrockModelConfig": {"modelId": MODEL_ID}},
        **limits,
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
            stop = event["messageStop"]
            reason = stop.get("stopReason", "")
            print(f"\n\n\u2192 stopReason: {reason}")
        elif "metadata" in event:
            meta = event["metadata"]
            usage = meta.get("usage", {})
            if usage:
                print(f"\u2192 usage: input={usage.get('inputTokens', 0)}, output={usage.get('outputTokens', 0)}")
        elif "internalServerException" in event:
            print(f"\nError: {event['internalServerException']}")
    print()
    return sid


def run(cmd: str, session_id: str):
    """Run a shell command on the agent's VM for a given session."""
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

### 4. Limit Max Iterations

`maxIterations` caps how many think → act → observe loops the agent can perform. Setting it to `1` means the agent gets a single tool call before it must respond.

This is useful when you want a quick, bounded answer and don't want the agent going on a multi-step adventure.

```python
invoke(
    "Create 3 files: hello.txt, world.txt, and readme.md with some content in each.",
    maxIterations=1,
)
```

```python
# Inspect the VM from the previous invocation = no files
run("ls -la", sid)
```

```python
# Compare: same prompt with more iterations allowed
sid = invoke(
    "Create 3 files: hello.txt, world.txt, and readme.md with some content in each.",
    maxIterations=10,
)
```

```python
# Inspect the VM from the previous invocation = 3 files
run("ls -la", sid)
run("cat *.md", sid)
```

### 5. Limit Timeout

`timeoutSeconds` sets a wall-clock deadline. If the agent is still working when time runs out, the invocation stops.

Useful for keeping latency predictable in production or preventing runaway tasks.

```python
# Give the agent a complex task but only 5 seconds
invoke(
    "Write a Python script that generates the first 50 prime numbers, save it to primes.py, then run it and show the output.",
    timeoutSeconds=5,
)
```

```python
# Same task with a generous timeout
invoke(
    "Write a Python script that generates the first 50 prime numbers, save it to primes.py, then run it and show the output.",
    timeoutSeconds=120,
)
```

### 6. Limit Max Tokens

`maxTokens` caps the total tokens the model can generate. This is useful for controlling cost or keeping responses concise.

```python
# Very tight token budget — the agent will be cut short
invoke(
    "Explain the history of the Python programming language in detail.",
    maxTokens=10,
)
```

```python
# More generous token budget
invoke(
    "Explain the history of the Python programming language in detail.",
    maxTokens=2048,
)
```

### 7. Combining Limits

All three limits can be used together. The agent stops as soon as any limit is hit.

```python
invoke(
    "List all files in the current directory, then create a summary.txt with what you found.",
    maxIterations=3,
    timeoutSeconds=30,
    maxTokens=1024,
)
```

### 8. Cleanup

```python
control.delete_harness(harnessId=harness_id)
print(f"Deleted harness: {harness_id}")
```

```python
delete_harness_role()
```
