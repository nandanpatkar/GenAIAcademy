# Automated Visual QA with Harness

| Info | Details |
|---|---|
| Tutorial | Build, run, and visually test a web app — all inside the agent's microVM |
| SDK | boto3 |
| Model | Claude Haiku 4.5 (Bedrock) |
| Features | ExecuteCommand, Custom Container, Headless Browser (Puppeteer) |

### The idea

Imagine you could hand off your web app to an AI agent and say: *"build it, run it, test it, and show me screenshots of every step."* That's what this notebook does.

The harness microVM is a full Linux environment with its own filesystem and network stack. The agent can install tools, start servers, and run headless browsers — all in isolation. This makes it a natural fit for **automated visual QA**:

- **CI/CD pipelines** — After every commit, an agent spins up the app, runs visual tests, and flags UI regressions before code review.
- **Cross-version comparison** — Build two versions of the app side by side, screenshot both, and diff them.
- **Exploratory QA** — Give the agent a URL and say *"find anything that looks broken"* — it navigates, interacts, and reports.
- **Onboarding docs** — Agent walks through the app and generates an annotated screenshot walkthrough automatically.

### What we'll build

A simple but complete example: the agent creates a TodoMVC app, serves it on `localhost:3000`, installs Puppeteer (headless Chrome), writes a test script that adds items / marks them complete / takes screenshots, runs it, and we pull the screenshots back into the notebook.

**Key insight:** Puppeteer runs inside the same VM as the web server, so `localhost` just works — no network isolation issues.

## Part 0: Setup

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

## Part 1: Create Harness with Node.js Container

The agent needs Node.js to run both the web server and Puppeteer. We attach a `node:20-slim` container to the Harness — this becomes the base OS for the microVM.

```python
HARNESS_NAME = f"WebAppTester_{uuid.uuid4().hex[:8]}"

resp = control.create_harness(
    harnessName=HARNESS_NAME,
    executionRoleArn=role_arn,
)
harness = resp["harness"]
harness_id = harness["harnessId"]
harness_arn = harness["arn"]
print(f"Harness ID: {harness_id}")
print(f"Harness ARN: {harness_arn}")
```

```python
control.update_harness(
    harnessId=harness_id,
    environmentArtifact={
        "optionalValue": {"containerConfiguration": {"containerUri": "public.ecr.aws/docker/library/node:20-slim"}}
    },
)
print("Attaching Node.js container...")

for i in range(24):
    resp = control.get_harness(harnessId=harness_id)
    status = resp["harness"]["status"]
    print(f"  {status}")
    if status == "READY":
        print("\u2705 Harness is ready")
        break
    time.sleep(5)
```

## Part 2: Prepare the Environment

This is where the Harness microVM shines. Using `ExecuteCommand`, we:
1. Install system dependencies (git, curl, Chromium)
2. Clone or generate the web app
3. Serve it on `localhost:3000`
4. Install `puppeteer-core` for headless browser automation

Everything happens inside the isolated VM — nothing touches your local machine.

```python
session_id = str(uuid.uuid4()).upper()


def run_command(cmd):
    """Run a command on the agent's microVM and return stdout."""
    output = ""
    resp = client.invoke_agent_runtime_command(
        agentRuntimeArn=harness_arn, runtimeSessionId=session_id, body={"command": cmd}
    )
    for event in resp["stream"]:
        if "chunk" in event and "contentDelta" in event["chunk"]:
            delta = event["chunk"]["contentDelta"]
            if "stdout" in delta:
                output += delta["stdout"]
            if "stderr" in delta:
                output += delta["stderr"]
    return output


print("Installing git and dependencies...")
out = run_command("apt-get update -qq && apt-get install -y -qq git curl chromium > /dev/null 2>&1 && echo 'done'")
print(out.strip())

print("\nCloning TodoMVC...")
out = run_command("git clone --depth 1 https://github.com/tastejs/todomvc.git /tmp/todomvc 2>&1")
print(out[-300:] if len(out) > 300 else out)
```

```python
# Create a self-contained TodoMVC app (avoids repo dependency issues)
print("Creating TodoMVC app...")
run_command("mkdir -p /tmp/todomvc")

# Ask the agent to generate the app
response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=session_id,
    model={"bedrockModelConfig": {"modelId": "global.anthropic.claude-haiku-4-5-20251001-v1:0"}},
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": "Create a single-file TodoMVC app at /tmp/todomvc/index.html. It should be a complete, self-contained HTML file with inline CSS and JS. Features: add todos, toggle complete, filter (All/Active/Completed), delete. Use a clean modern design. No external dependencies."
                }
            ],
        }
    ],
)
for event in response["stream"]:
    if "contentBlockDelta" in event:
        delta = event["contentBlockDelta"].get("delta", {})
        if "text" in delta:
            print(delta["text"], end="", flush=True)
    elif "messageStop" in event:
        print()

# Verify
out = run_command("ls -la /tmp/todomvc/index.html")
print(f"\n{out.strip()}")
```

```python
# Start server
print("Starting server...")
run_command("cd /tmp/todomvc && nohup npx -y serve -l 3000 > /tmp/server.log 2>&1 &")
time.sleep(5)

out = run_command("curl -s -o /dev/null -w '%{http_code}' http://localhost:3000")
print(f"Server status: {out.strip()}")

# Install Puppeteer
print("\nInstalling Puppeteer (this takes ~1 min)...")
out = run_command("cd /tmp && npm install puppeteer-core 2>&1 | tail -3")
print(out)
print("\u2705 Ready")
```

## Part 3: The Agent Writes and Runs the Tests

This is the most powerful part. Instead of writing test scripts ourselves, we **ask the agent to write them**. The agent:

1. Understands the app structure (it just built it)
2. Writes a Puppeteer script with the test steps we describe in natural language
3. Runs the script inside the VM
4. Saves screenshots at each step

In a real QA pipeline, you'd replace the TodoMVC app with your own — clone your repo, build it, and let the agent explore. The pattern is the same:

```
ExecuteCommand: git clone + npm install + npm start
ExecuteCommand: npm install puppeteer-core
invoke_harness: "Write and run tests for the app at localhost:3000"
ExecuteCommand: base64 /tmp/screenshot_*.png → pull back
```

```python
# test_session = str(uuid.uuid4()).upper()
print(f"Test session: {session_id}\n")


response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=session_id,
    model={"bedrockModelConfig": {"modelId": "global.anthropic.claude-haiku-4-5-20251001-v1:0"}},
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": """There is a TodoMVC web app running at http://localhost:3000 and puppeteer-core is installed at /tmp/node_modules/puppeteer-core. Chromium is at /usr/bin/chromium.

Write a Puppeteer test script at /tmp/test.mjs and run it. The script should:

1. Launch chromium (headless, no-sandbox) and open http://localhost:3000
2. Take screenshot → /tmp/screenshot_1.png (empty app)
3. Add three todos: 'Book flights to Amsterdam', 'Reserve hotel', 'Plan museum visits'
4. Take screenshot → /tmp/screenshot_2.png (three todos)
5. Click the checkbox on 'Book flights to Amsterdam' to mark it complete
6. Take screenshot → /tmp/screenshot_3.png (one completed)
7. Close the browser

Use import from '/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js' or require('/tmp/node_modules/puppeteer-core').
After writing the script, run it with: node /tmp/test.mjs
Then list the screenshots: ls -la /tmp/screenshot_*.png"""
                }
            ],
        }
    ],
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
```

## Part 4: Pull and Review Screenshots

The screenshots live on the agent's VM. We pull them back via `ExecuteCommand` (base64 encoded) and display them inline.

In a production pipeline, you could:
- Upload them to S3 for archival
- Compare against baseline screenshots (visual regression)
- Attach them to a PR as a comment
- Feed them back to the agent: *"Do these screenshots look correct?"*

```python
import base64
from IPython.display import Image, display

out = run_command("ls -la /tmp/screenshot_*.png 2>/dev/null || echo 'No screenshots found'")
print(out)

screenshots = []
for i in range(1, 10):
    b64 = ""
    resp = client.invoke_agent_runtime_command(
        agentRuntimeArn=harness_arn,
        runtimeSessionId=session_id,
        body={"command": f"base64 /tmp/screenshot_{i}.png 2>/dev/null"},
    )
    for event in resp["stream"]:
        if "chunk" in event and "contentDelta" in event["chunk"]:
            delta = event["chunk"]["contentDelta"]
            if "stdout" in delta:
                b64 += delta["stdout"]

    if not b64.strip():
        break

    b64_clean = b64.strip().replace("\n", "").replace("\r", "").replace(" ", "")
    remainder = len(b64_clean) % 4
    if remainder:
        b64_clean = b64_clean[:-remainder]

    try:
        img_bytes = base64.b64decode(b64_clean)
        screenshots.append(img_bytes)
        print(f"\nScreenshot {i}: {len(img_bytes):,} bytes")
        display(Image(data=img_bytes))
    except Exception as e:
        print(f"\nScreenshot {i}: falha no decode — {e}")

print(f"\n\u2705 Retrieved {len(screenshots)} screenshots")
```

## Cleanup

```python
control.delete_harness(harnessId=harness_id)
print(f"Deleted harness: {harness_id}")
```

```python
delete_harness_role()
```
