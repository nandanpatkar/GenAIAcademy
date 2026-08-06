## AgentCore Browser Tool with OS-Level Actions (boto3 SDK)

This notebook demonstrates how to use **OS-level actions** (`InvokeBrowser`) with [Amazon Bedrock AgentCore Browser](https://docs.aws.amazon.com/bedrock/latest/userguide/agentcore-browser.html) using the **boto3 SDK** — no manual SigV4 signing required.

OS-level actions let you perform raw mouse, keyboard, screenshot, and scroll operations directly on the browser sandbox, bypassing the CDP/Playwright automation layer entirely. This is useful for interacting with:

- **OS-native dialogs** — file upload/download prompts, print dialogs, authentication pop-ups
- **Browser chrome elements** — address bar, extension popups, permission banners
- **Keyboard shortcuts** — `Ctrl+S`, `Ctrl+A`, `Alt+Tab` that CDP-based automation cannot send to the OS
- **Canvas / WebGL content** — where DOM selectors don't exist
- **Any element** that resists traditional CDP-based automation

#### What you'll do

1. Create a custom AgentCore Browser (control plane)
2. Start a browser session (data plane)
3. Execute OS-level actions via `invoke_browser()`: mouse (click, move, drag), scroll, keyboard (type, press, shortcuts), and screenshots
4. Clean up resources

#### Prerequisites

- `boto3 >= 1.42.85` (includes `invoke_browser` support)
- AWS credentials with `bedrock-agentcore` permissions

### 1. Install dependencies

```python
!uv pip install -qU -r requirements.txt

import boto3

print(f"boto3: {boto3.__version__}")
```

### 2. Load AWS credentials

Just for your experimentation, create the credential files in your terminal.

```python
import os
from pathlib import Path

env_file = Path(".env")
assert env_file.exists(), "Missing .env — run: ./setup_aws_creds.sh <account_id>"

for line in env_file.read_text().splitlines():
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        os.environ[k.strip()] = v.strip()

assert os.environ.get("AWS_ACCESS_KEY_ID"), "Credentials not loaded"
print("AWS credentials loaded ✓")
```

### 3. Setup boto3 clients

```python
import time

REGION = "us-west-2"
BROWSER_NAME = "browser_with_os_actions"

# Control plane — create/delete browsers
control_client = boto3.client("bedrock-agentcore-control", region_name=REGION)

# Data plane — sessions and invoke
runtime_client = boto3.client("bedrock-agentcore", region_name=REGION)

print(f"Clients ready — region: {REGION}")
```

### 3.1 Create IAM Role

```python
import sys

sys.path.insert(0, str(Path.cwd()))

from helpers.utils import create_agentcore_execution_role, SAMPLE_ROLE_NAME

execution_role_arn = create_agentcore_execution_role(SAMPLE_ROLE_NAME)

# Wait for IAM propagation
print("Waiting 10s for IAM propagation...")
time.sleep(10)
```

### 4. Create the AgentCore Browser

```python
created = control_client.create_browser(
    name=BROWSER_NAME,
    executionRoleArn=execution_role_arn,
    networkConfiguration={"networkMode": "PUBLIC"},
)

browser_id = created["browserId"]
print(f"Browser created: {browser_id}")
```

### 5. Start a browser session

```python
session = runtime_client.start_browser_session(
    browserIdentifier=browser_id,
    name=BROWSER_NAME,
    sessionTimeoutSeconds=3600,
    viewPort={"width": 1920, "height": 1080},
)

session_id = session["sessionId"]
print(f"Session started: {session_id}")

print("Waiting 3s for session init...")
time.sleep(3)
```

### Helper — invoke wrapper

Small wrapper to keep the action cells clean.

```python
def invoke(action: dict) -> dict:
    """Invoke a browser action and return the result dict."""
    resp = runtime_client.invoke_browser(browserIdentifier=browser_id, sessionId=session_id, action=action)
    return resp["result"]


print("invoke() helper ready")
```

### 6. Mouse Actions

```python
print("── Mouse Click Actions ──\n")

# Left click
r = invoke({"mouseClick": {"x": 600, "y": 370, "button": "LEFT"}})
print(f"Left click: {r}")

# Double click
r = invoke({"mouseClick": {"x": 500, "y": 300, "button": "LEFT", "clickCount": 2}})
print(f"Double click: {r}")

# Right click
r = invoke({"mouseClick": {"x": 200, "y": 400, "button": "RIGHT", "clickCount": 1}})
print(f"Right click: {r}")

# Middle click
r = invoke({"mouseClick": {"x": 960, "y": 540, "button": "MIDDLE", "clickCount": 1}})
print(f"Middle click: {r}")

# Multi click
r = invoke({"mouseClick": {"x": 500, "y": 300, "button": "LEFT", "clickCount": 10}})
print(f"Multi click (10x): {r}")
```

```python
print("── Mouse Move Actions ──\n")

r = invoke({"mouseMove": {"x": 800, "y": 600}})
print(f"Move to (800,600): {r}")

r = invoke({"mouseMove": {"x": 1, "y": 1}})
print(f"Move to (1,1): {r}")
```

```python
print("── Mouse Drag Actions ──\n")

r = invoke(
    {
        "mouseDrag": {
            "startX": 1,
            "startY": 1,
            "endX": 705,
            "endY": 180,
            "button": "LEFT",
        }
    }
)
print(f"Drag (1,1)->(705,180): {r}")

r = invoke(
    {
        "mouseDrag": {
            "startX": 1,
            "startY": 1,
            "endX": 370,
            "endY": 330,
            "button": "LEFT",
        }
    }
)
print(f"Drag (1,1)->(370,330): {r}")

r = invoke(
    {
        "mouseDrag": {
            "startX": 500,
            "startY": 300,
            "endX": 100,
            "endY": 200,
            "button": "MIDDLE",
        }
    }
)
print(f"Drag middle button: {r}")
```

### 7. Scroll Actions

```python
print("── Scroll Actions ──\n")

r = invoke({"mouseScroll": {"x": 800, "y": 600, "deltaX": 0, "deltaY": -500}})
print(f"Scroll up: {r}")

r = invoke({"mouseScroll": {"x": 500, "y": 300, "deltaX": 300, "deltaY": 0}})
print(f"Scroll right: {r}")

r = invoke({"mouseScroll": {"x": 500, "y": 300, "deltaX": -100, "deltaY": -200}})
print(f"Scroll diagonal: {r}")

r = invoke({"mouseScroll": {"x": 500, "y": 300, "deltaX": 1000, "deltaY": 1000}})
print(f"Scroll large: {r}")
```

### 8. Keyboard Actions

```python
print("── Key Type Actions ──\n")

r = invoke({"keyType": {"text": "Hello World"}})
print(f"Type 'Hello World': {r}")

r = invoke({"keyType": {"text": "user@example.com!#$%^&*()"}})
print(f"Type special chars: {r}")

r = invoke({"keyType": {"text": "https://www.example.com"}})
print(f"Type URL: {r}")

r = invoke({"keyType": {"text": "1" * 10000}})
print(f"Type long string (10k): {r}")
```

```python
print("── Key Press Actions ──\n")

r = invoke({"keyPress": {"key": "enter"}})
print(f"Enter: {r}")

r = invoke({"keyPress": {"key": "tab"}})
print(f"Tab: {r}")

r = invoke({"keyPress": {"key": "escape"}})
print(f"Escape: {r}")

r = invoke({"keyPress": {"key": "backspace", "presses": 5}})
print(f"Backspace x5: {r}")

r = invoke({"keyPress": {"key": "ArrowDown", "presses": 100}})
print(f"ArrowDown x100: {r}")
```

```python
print("── Key Shortcut Actions ──\n")

r = invoke({"keyShortcut": {"keys": ["ctrl", "s"]}})
print(f"Ctrl+S: {r}")

r = invoke({"keyShortcut": {"keys": ["ctrl", "p"]}})
print(f"Ctrl+P: {r}")

r = invoke({"keyShortcut": {"keys": ["ctrl", "shift", "i"]}})
print(f"Ctrl+Shift+I: {r}")
```

### 9. Screenshot

```python
from IPython.display import Image, display
import base64


def take_screenshot(fmt="PNG"):
    """Take a screenshot and display it inline."""
    action = {"screenshot": {"format": fmt}} if fmt else {"screenshot": {}}
    result = invoke(action)
    print(f"Screenshot status: {result.get('screenshot', {})}")

    data = result.get("screenshot", {}).get("data")
    if data:
        # data comes as bytes from boto3 (blob type)
        img_bytes = data if isinstance(data, bytes) else base64.b64decode(data)
        display(Image(img_bytes))
    else:
        print("No screenshot data returned")


print("── Screenshot (PNG) ──")
take_screenshot("PNG")

print("\n── Screenshot (default format) ──")
take_screenshot(None)
```

### 10. Stop the browser session

```python
runtime_client.stop_browser_session(browserIdentifier=browser_id, sessionId=session_id)
print(f"Session {session_id} stopped ✓")
```

### 11. Cleanup (Optional)

Delete the browser and IAM role.

```python
control_client.delete_browser(browserId=browser_id)
print(f"Browser {browser_id} deleted ✓")
```

```python
from helpers.utils import delete_agentcore_execution_role, SAMPLE_ROLE_NAME

delete_agentcore_execution_role(SAMPLE_ROLE_NAME)
print("IAM role cleaned up ✓")
```
