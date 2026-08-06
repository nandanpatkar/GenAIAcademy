# Travel Agent Example

| Info | Details |
|---|---|
| Tutorial | Harness — Create, Invoke, Observability, Memory |
| SDK | boto3 |
| Model | Claude Haiku 4.5 (Bedrock) |

**Prerequisites:**
- AWS account with access to Amazon Bedrock AgentCore
- AWS CLI v2 configured with credentials
- `uv` installed

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

## Part 1: Create Harness (Control Plane)

AgentCore has:

- **Control Plane** — manages agent resources (create, read, update, delete harnesses, etc.)
- **Data Plane** — runs the agent (invoke, stream responses, execute commands inside the microVM)

In this step we use the Control Plane to create a Harness resource. The command returns immediately with `status: CREATING`. We then poll until it transitions to `READY`.

> 💡 You can change `HARNESS_NAME` to any name you like. The system appends a random suffix to ensure uniqueness.

```python
HARNESS_NAME = f"TravelGuideAgent_{uuid.uuid4().hex[:8]}"

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
```

### Verify it's READY

The harness takes a few seconds to provision. This cell polls every 5 seconds until the status is `READY`.

```python
for i in range(12):
    resp = control.get_harness(harnessId=harness_id)
    status = resp["harness"]["status"]
    print(f"Attempt {i + 1}: {status}")
    if status == "READY":
        print("\u2705 Harness is ready")
        break
    time.sleep(5)
```

## Part 2: Invoke harness (Data Plane)

Now we invoke the agent using the Data Plane API via boto3. The `client` was configured in the setup cell.

Each invocation needs a `session_id` — this identifies the isolated microVM. Same session ID = same VM (with state preserved). New session ID = fresh VM.

The response is a stream of events. We print text deltas as they arrive and show tool calls the agent makes.

> 💡 You can change the **model** by editing the `modelId`.
>
> 💡 You can change the **prompt** to anything you want — the agent has `file_operations` and `shell` tools available by default.

```python
session_id = str(uuid.uuid4()).upper()
print(f"Session ID: {session_id}")
```

```python
response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=session_id,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": "Recommend three fun things to do in NYC on a rainy day. Save your answer as a single self-contained HTML file at /tmp/travel.html. The HTML should have a modern dark-themed design with horizontal swipeable cards (one per activity) that the user can navigate using left/right arrow buttons. Each card should include the activity name, a short description, and a practical tip. Include all CSS and JS inline."
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

### Render the agent's HTML output

The agent saved a self-contained HTML file on its VM. We pull it back using `ExecuteCommand` and render it directly in the notebook using `IPython.display.HTML`.

```python
from IPython.display import HTML

# Fetch the HTML from the agent's VM
html_content = ""
resp = client.invoke_agent_runtime_command(
    agentRuntimeArn=harness_arn,
    runtimeSessionId=session_id,
    body={"command": "cat /tmp/travel.html"},
)
for event in resp["stream"]:
    if "chunk" in event:
        chunk = event["chunk"]
        if "contentDelta" in chunk and "stdout" in chunk["contentDelta"]:
            html_content += chunk["contentDelta"]["stdout"]

# Render inside an iframe to isolate styles from the notebook
import html as html_mod

iframe = f'<iframe srcdoc="{html_mod.escape(html_content)}" width="100%" height="480" style="border:none;border-radius:12px;"></iframe>'
HTML(iframe)
```

## Part 3: Explore AgentCore Observability

Every Harness invocation automatically generates traces in CloudWatch via AgentCore Observability. You can see each step of the agent loop: model calls, tool invocations, and timing details.

**One-time setup:** You need to [enable Transaction Search](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Transaction-Search-getting-started.html) in CloudWatch (per account). This is required to view traces.

> 💡 The cell below opens the CloudWatch X-Ray console directly in your browser. Look for traces from your recent invocations — you'll see the full agent loop breakdown.

```python
import webbrowser

# Check if Transaction Search is enabled
import boto3

xray = boto3.client("xray", region_name="us-west-2")
rules = xray.get_indexing_rules()
sampling = rules["IndexingRules"][0]["Rule"]["Probabilistic"]["DesiredSamplingPercentage"]
print(f"Transaction Search sampling: {sampling}%")
if sampling == 0:
    print("⚠️  Transaction Search is not enabled. Enable it in CloudWatch console first.")
else:
    print("✅ Transaction Search is enabled")

# Open CloudWatch X-Ray traces in browser
url = "https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#xray:traces"
webbrowser.open(url)
print(f"\n🔗 Opened: {url}")
```

## Part 4: Add AgentCore Memory

When Memory is attached to a Harness, every invocation automatically saves the conversation to the Memory instance (scoped by session ID). On subsequent invocations with the same session ID, the agent's history is loaded from Memory before it starts reasoning — so it remembers previous turns, even after the VM session has expired.

This means you don't need to pass previous messages yourself — just send the new message and the agent picks up where it left off.

**Steps:**
1. Create a Memory instance (takes ~5 minutes to provision)
2. Associate it with the Harness
3. Test multi-turn conversation

> 💡 The `event-expiry-duration` controls how long memories are kept (in days). Adjust based on your use case.

### 4.1 Create Memory Instance

```python
try:
    # Memory APIs use the standard AgentCore endpoint, NOT the beta endpoint
    resp = control.create_memory(
        name="TravelGuideMemory",
        eventExpiryDuration=30,
        description="Memory for TravelGuideAgent",
    )
    memory_id = resp.get("id") or resp.get("memory", {}).get("id")
except Exception as e:
    print(f"Create returned: {e}")
    memory_id = None

if not memory_id:
    print("Looking for existing TravelGuideMemory...")
    resp = control.list_memories()
    for m in resp.get("memories", []):
        if "TravelGuide" in m.get("id", ""):
            memory_id = m["id"]
            break

assert memory_id, "Could not find or create TravelGuideMemory"
print(f"Memory ID: {memory_id}")
```

```python
for i in range(30):
    resp = control.get_memory(memoryId=memory_id)
    status = resp.get("status", resp.get("memory", {}).get("status", "UNKNOWN"))
    print(f"Attempt {i + 1}: {status}")
    if status in ("ACTIVE", "READY"):
        print("\u2705 Memory is ready")
        break
    time.sleep(10)
```

```python
memory_arn = resp["memory"]["arn"]
```

### 4.2 Associate Memory with Harness

```python
control.update_harness(
    harnessId=harness_id,
    memory={"optionalValue": {"agentCoreMemoryConfiguration": {"arn": memory_arn}}},
)
print(f"Memory ARN: {memory_arn}")
print("Waiting for Harness to update...")

for i in range(12):
    resp = control.get_harness(harnessId=harness_id)
    status = resp["harness"]["status"]
    print(f"Attempt {i + 1}: {status}")
    if status == "READY":
        print("\u2705 Harness updated")
        break
    time.sleep(5)
```

### 4.3 Test Memory — Multi-turn Conversation

We'll send two messages in the same session. The second message references the first — the agent should remember the context thanks to Memory.

```python
memory_session_id = str(uuid.uuid4()).upper()
print(f"Memory test session: {memory_session_id}\n")

# Turn 1
print("=== Turn 1 ===")
resp = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=memory_session_id,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": "My name is John Doe and I love electronic music with balance — deep house, nu-disco, anything with a nice groove. Remember that."
                }
            ],
        }
    ],
    model={"bedrockModelConfig": {"modelId": "global.anthropic.claude-haiku-4-5-20251001-v1:0"}},
)
for event in resp["stream"]:
    if "contentBlockDelta" in event:
        delta = event["contentBlockDelta"].get("delta", {})
        if "text" in delta:
            print(delta["text"], end="", flush=True)
    elif "messageStop" in event:
        print()
```

```python
# Turn 2 — the agent should remember the name and preference
print("=== Turn 2 ===")
resp = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=memory_session_id,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": "What's my name and what kind of music do I like? Recommend a place in Amsterdam where I can enjoy it."
                }
            ],
        }
    ],
    model={"bedrockModelConfig": {"modelId": "global.anthropic.claude-haiku-4-5-20251001-v1:0"}},
)
for event in resp["stream"]:
    if "contentBlockDelta" in event:
        delta = event["contentBlockDelta"].get("delta", {})
        if "text" in delta:
            print(delta["text"], end="", flush=True)
    elif "messageStop" in event:
        print()
```

## Part 5: Browser Tool — Live Web Data

The `agentcore_browser` tool gives the agent a real browser inside the microVM. It can navigate websites, click links, extract content, and bring back live data — perfect for a travel agent that needs current information.

> 💡 Pass `tools` in the invoke call to enable the browser for that invocation. This doesn't change the Harness config — it's an override for this call only.

```python
browser_session_id = str(uuid.uuid4()).upper()
print(f"Browser session: {browser_session_id}\n")

response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=browser_session_id,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": "Check the weather forecast for Amsterdam this week. "
                    "Browse a real weather website to get current, accurate data. "
                    "Save the forecast as a clean HTML file at /tmp/weather.html with a modern dark theme, "
                    "showing each day as a card with temperature, conditions, and an emoji for the weather."
                }
            ],
        }
    ],
    tools=[{"type": "agentcore_browser", "name": "browser"}],
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

### Render the weather forecast

Pull the HTML file from the agent's VM and render it in the notebook:

```python
from IPython.display import HTML
import html as html_mod

html_content = ""
resp = client.invoke_agent_runtime_command(
    agentRuntimeArn=harness_arn,
    runtimeSessionId=browser_session_id,
    body={"command": "cat /tmp/weather.html"},
)
for event in resp["stream"]:
    if "chunk" in event:
        chunk = event["chunk"]
        if "contentDelta" in chunk and "stdout" in chunk["contentDelta"]:
            html_content += chunk["contentDelta"]["stdout"]

if html_content:
    iframe = f'<iframe srcdoc="{html_mod.escape(html_content)}" width="100%" height="480" style="border:none;border-radius:12px;"></iframe>'
    display(HTML(iframe))
else:
    print("No HTML file found — the agent may not have created it.")
```

## Part 6: Exa Search + Code Interpreter — Tourism Data Analysis

This demonstrates **combining multiple tools** across invocations in the same session. The agent will:
1. Use **Exa** (web search via MCP) to find real Amsterdam tourism data
2. Use **Code Interpreter** to analyze the data and generate a chart

> 💡 You can pass multiple tools in the same invoke call. The agent decides which to use and in what order.

```python
research_session_id = str(uuid.uuid4()).upper()
print(f"Research session: {research_session_id}\n")

# Step 1: Search for tourism data with Exa
print("=== Step 1: Searching with Exa ===")
response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=research_session_id,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": "Search for Amsterdam tourism statistics — visitor numbers by year, "
                    "top 5 most visited attractions, and monthly visitor trends. "
                    "Collect the data and save it as a structured JSON file at /tmp/tourism_data.json."
                }
            ],
        }
    ],
    tools=[
        {
            "type": "remote_mcp",
            "name": "exa",
            "config": {"remoteMcp": {"url": "https://mcp.exa.ai/mcp"}},
        }
    ],
    model={"bedrockModelConfig": {"modelId": "global.anthropic.claude-haiku-4-5-20251001-v1:0"}},
    timeoutSeconds=300,
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

print("\n=== Step 1 complete ===")
```

```python
# Step 2: Generate chart with Code Interpreter (same session — data persists)
print("=== Step 2: Generating chart with Code Interpreter ===")
response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=research_session_id,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": "Read the tourism data from /tmp/tourism_data.json and create a beautiful "
                    "visualization chart using matplotlib. Make a bar chart or line chart showing "
                    "the most interesting trends you found. Use a dark theme with vibrant colors. "
                    "Save the chart as /tmp/amsterdam_tourism.png and a brief summary as /tmp/tourism_report.md."
                }
            ],
        }
    ],
    tools=[{"type": "agentcore_code_interpreter", "name": "code_interpreter"}],
    model={"bedrockModelConfig": {"modelId": "global.anthropic.claude-haiku-4-5-20251001-v1:0"}},
    timeoutSeconds=300,
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

print("\n=== Step 2 complete ===")
```

### View the generated report and chart

```python
# Read the tourism report
report = ""
resp = client.invoke_agent_runtime_command(
    agentRuntimeArn=harness_arn,
    runtimeSessionId=research_session_id,
    body={"command": "cat /tmp/tourism_report.md 2>/dev/null || echo 'No report found'"},
)
for event in resp["stream"]:
    if "chunk" in event:
        chunk = event["chunk"]
        if "contentDelta" in chunk and "stdout" in chunk["contentDelta"]:
            report += chunk["contentDelta"]["stdout"]
print(report)
```

```python
# Display the chart (if generated as PNG)
import base64
from IPython.display import Image, display

chart_data = b""
resp = client.invoke_agent_runtime_command(
    agentRuntimeArn=harness_arn,
    runtimeSessionId=research_session_id,
    body={"command": "base64 /tmp/amsterdam_tourism.png 2>/dev/null || echo 'NO_CHART'"},
)
for event in resp["stream"]:
    if "chunk" in event:
        chunk = event["chunk"]
        if "contentDelta" in chunk and "stdout" in chunk["contentDelta"]:
            chart_data += chunk["contentDelta"]["stdout"].encode()

chart_str = chart_data.decode().strip()
if chart_str and chart_str != "NO_CHART":
    display(Image(data=base64.b64decode(chart_str)))
    print("\u2705 Chart rendered from /tmp/amsterdam_tourism.png")
else:
    print("No chart found — the agent may have saved it in a different format or location.")
    # Try listing what was created
    resp = client.invoke_agent_runtime_command(
        agentRuntimeArn=harness_arn,
        runtimeSessionId=research_session_id,
        body={"command": "ls -la /tmp/*.png /tmp/*.html /tmp/*.md 2>/dev/null"},
    )
    for event in resp["stream"]:
        if "chunk" in event:
            chunk = event["chunk"]
            if "contentDelta" in chunk and "stdout" in chunk["contentDelta"]:
                print(chunk["contentDelta"]["stdout"], end="")
```

## Part 7: Local Chat UI

This part saves a lightweight chat web app that connects to the Harness agent we created above.

The notebook writes two files to `travel_chat/`:
- **`server.py`** — FastAPI backend that proxies messages to `invoke_harness` with SSE streaming
- **`index.html`** — Minimal chat UI

Run the cells below — the last one prints the exact command to start the server.

```python
!mkdir -p travel_chat
```

```python
%%writefile travel_chat/server.py
# /// script
# requires-python = ">=3.10"
# dependencies = ["fastapi", "uvicorn", "boto3", "sse-starlette"]
# ///
import os, uuid, json, logging
from contextlib import asynccontextmanager
import boto3, botocore.session
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from sse_starlette.sse import EventSourceResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

HARNESS_ARN = os.environ["HARNESS_ARN"]
REGION = os.getenv("AWS_DEFAULT_REGION")
DATA_ENDPOINT = os.getenv("DATA_ENDPOINT")

def make_client():
    kwargs = {"region_name": REGION}
    return boto3.client("bedrock-agentcore", **kwargs)

client = make_client()
sessions = {}

@asynccontextmanager
async def lifespan(app):
    logger.info("Chat app started")
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def index():
    return FileResponse(os.path.join(os.path.dirname(__file__), "index.html"))

@app.post("/session")
async def new_session():
    sid = str(uuid.uuid4()).upper()
    sessions[sid] = []
    return {"session_id": sid}

@app.post("/chat")
async def chat(req: dict):
    msg = req.get("message", "").strip()
    sid = req.get("session_id", "")
    if not msg or not sid:
        raise HTTPException(400, "message and session_id required")

    if sid not in sessions:
        sessions[sid] = []
    sessions[sid].append({"role": "user", "content": [{"text": msg}]})

    async def stream():
        try:
            resp = client.invoke_harness(
                harnessArn=HARNESS_ARN,
                runtimeSessionId=sid,
                messages=sessions[sid],
            )
            full = ""
            for event in resp["stream"]:
                if "contentBlockDelta" in event:
                    txt = event["contentBlockDelta"].get("delta", {}).get("text", "")
                    if txt:
                        full += txt
                        yield {"data": json.dumps({"type": "text_delta", "text": txt})}
            if full:
                sessions[sid].append({"role": "assistant", "content": [{"text": full}]})
            yield {"data": json.dumps({"type": "done"})}
        except Exception as e:
            logger.error(str(e), exc_info=True)
            yield {"data": json.dumps({"type": "error", "message": str(e)})}

    return EventSourceResponse(stream())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Save the chat UI

```python
%%writefile travel_chat/index.html
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Travel Guide Chat</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:system-ui; background:#1a1a2e; color:#eee; height:100vh; display:flex; flex-direction:column; }
  #header { padding:16px 24px; background:#16213e; border-bottom:1px solid #0f3460; }
  #header h1 { font-size:18px; color:#e94560; }
  #messages { flex:1; overflow-y:auto; padding:20px; }
  .msg { max-width:75%; margin:8px 0; padding:12px 16px; border-radius:12px; line-height:1.5; white-space:pre-wrap; }
  .user { background:#0f3460; margin-left:auto; }
  .assistant { background:#16213e; }
  #input-bar { display:flex; padding:16px; gap:8px; background:#16213e; border-top:1px solid #0f3460; }
  #input { flex:1; padding:12px; border-radius:8px; border:1px solid #0f3460; background:#1a1a2e; color:#eee; font-size:15px; }
  #send { padding:12px 24px; border-radius:8px; border:none; background:#e94560; color:#fff; cursor:pointer; font-size:15px; }
  #send:disabled { opacity:0.5; }
</style></head><body>
<div id="header"><h1>✈️ Travel Guide Agent</h1></div>
<div id="messages"></div>
<div id="input-bar">
  <input id="input" placeholder="Ask about any destination..." />
  <button id="send" onclick="send()">Send</button>
</div>
<script>
let sessionId = null;
const msgs = document.getElementById("messages");
const inp = document.getElementById("input");
const btn = document.getElementById("send");
inp.addEventListener("keydown", e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} });

async function init() {
  const r = await fetch("/session",{method:"POST"});
  sessionId = (await r.json()).session_id;
}
init();

function addMsg(role, text) {
  const d = document.createElement("div");
  d.className = "msg " + role;
  d.textContent = text;
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
  return d;
}

async function send() {
  const text = inp.value.trim();
  if(!text) return;
  inp.value = "";
  btn.disabled = true;
  addMsg("user", text);
  const el = addMsg("assistant", "");
  try {
    const r = await fetch("/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text,session_id:sessionId})});
    const reader = r.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while(true) {
      const {done, value} = await reader.read();
      if(done) break;
      buf += dec.decode(value, {stream:true});
      const lines = buf.split("\n");
      buf = lines.pop();
      for(const line of lines) {
        if(!line.startsWith("data: ")) continue;
        const d = JSON.parse(line.slice(6));
        if(d.type==="text_delta") el.textContent += d.text;
        if(d.type==="error") el.textContent += "\nError: "+d.message;
      }
      msgs.scrollTop = msgs.scrollHeight;
    }
  } catch(e) { el.textContent += "\nError: "+e; }
  btn.disabled = false;
  inp.focus();
}
</script></body></html>
```

## Cleanup

When you're done testing, **run the cells below to delete all resources** so you don't get billed for idle Harnesses or Memory instances.

Resources created by this notebook:
- **Harness** — delete with `delete-harness`
- **Memory instance** — delete with `delete-memory`
- **IAM role** — delete with `delete_harness_role()`

```python
control.delete_harness(harnessId=harness_id)
print(f"Deleted harness: {harness_id}")
```

```python
control.delete_memory(memoryId=memory_id)
print(f"Deleted memory: {memory_id}")
```

```python
# Delete IAM role

delete_harness_role()
```
