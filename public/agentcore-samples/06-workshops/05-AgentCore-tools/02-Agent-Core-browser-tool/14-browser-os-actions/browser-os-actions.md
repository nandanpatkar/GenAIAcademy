## AgentCore Browser Tool with OS-Level Actions

In this example, you will learn how to use **OS-level actions** (`InvokeBrowser`) with Amazon Bedrock AgentCore Browser.

OS-level actions let you perform raw mouse, keyboard, screenshot, and scroll operations directly on the browser sandbox — bypassing the CDP/Playwright automation layer entirely. This is useful for interacting with:

- **OS-native dialogs** (file upload/download prompts, print dialogs, authentication pop-ups)
- **Browser chrome elements** (address bar, extension popups, permission banners)
- **Keyboard shortcuts** (Ctrl+S, Ctrl+A, Alt+Tab) that CDP-based automation cannot send to the OS
- **Canvas / WebGL content** where DOM selectors don't exist
- **Any element** that resists CDP-based automation

This notebook walks through the `InvokeBrowser` API using SigV4-signed REST calls, covering mouse actions (click, move, drag), scroll, keyboard input (type, press, shortcuts), and screenshots.

### 1. Install dependencies

```python
!uv pip install -qU -r requirements.txt

import boto3

print("botocore:", boto3.__version__)
```

### 2. Load AWS Credentials

Just for your experimentation, create the credential files in your terminal.

```python
import os
from pathlib import Path

env_file = Path(".env")
assert env_file.exists(), "Missing .env file. Run: ./setup_aws_creds.sh <account_id>"

for line in env_file.read_text().splitlines():
    if "=" in line and not line.startswith("#"):
        key, value = line.split("=", 1)
        os.environ[key.strip()] = value.strip()

assert os.environ.get("AWS_ACCESS_KEY_ID"), "Failed to load credentials from .env"
print("AWS credentials loaded from .env")
```

### 3. Setup

Initializing variables

```python
import boto3

browser_boto3 = boto3.client(
    "bedrock-agentcore-control",
    region_name="us-west-2",
)

BROWSER_NAME = "browser_with_os_actions"
```

Adding helpers directory into Python path

```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path.cwd()))
```

#### 3.1 Create IAM Role

Then, you will create a custom IAM role that will be attached into the AgentCore Browser.
Note the additional `bedrock-agentcore:InvokeBrowser` permission required for OS-level actions.

```python
# Create IAM ROLE
from helpers.utils import create_agentcore_execution_role, SAMPLE_ROLE_NAME

execution_role_arn = create_agentcore_execution_role(SAMPLE_ROLE_NAME)
```

Sleep 10 seconds to make sure IAM role is propagated

```python
import time

time.sleep(10)
```

### 4. Create the AgentCore custom Browser

You are creating a custom browser for this example with recording enabled.

```python
created_browser = browser_boto3.create_browser(
    name=BROWSER_NAME,
    executionRoleArn=execution_role_arn,
    networkConfiguration={"networkMode": "PUBLIC"},
)

browser_id = created_browser["browserId"]
print(f"Browser ID: {browser_id}")
```

#### 5. Start a browser session with OS-level actions enabled

```python
from helpers.browser import get_credentials, invoke, start_session, stop_session

creds, default_region = get_credentials()
BEDROCK_AGENTCORE_DP_ENDPOINT = f"https://bedrock-agentcore.{default_region}.amazonaws.com/"
```

```python
creds, default_region
```

```python
import time

sid = start_session(BEDROCK_AGENTCORE_DP_ENDPOINT, browser_id, region=default_region, credentials=creds)
print("  Waiting 3s for session to initialize...")

time.sleep(3)
```

```python
print("\n── Happy Path: Mouse Actions ──")

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"mouseClick": {"x": 600, "y": 370, "button": "LEFT"}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse click status: {r.status_code}, action" {r.json()["result"]}')
```

```python
r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"mouseClick": {"x": 500, "y": 300, "button": "LEFT", "clickCount": 2}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse click status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"mouseClick": {"x": 200, "y": 400, "button": "RIGHT", "clickCount": 1}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse click status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"mouseClick": {"x": 960, "y": 540, "button": "MIDDLE", "clickCount": 1}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse click status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"mouseClick": {"x": 500, "y": 300, "button": "LEFT", "clickCount": 10}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse click status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"mouseMove": {"x": 800, "y": 600}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse click status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"mouseMove": {"x": 1, "y": 1}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse click status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {
        "mouseDrag": {
            "startX": 1,
            "startY": 1,
            "endX": 705,
            "endY": 180,
            "button": "LEFT",
        }
    },
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse click status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {
        "mouseDrag": {
            "startX": 1,
            "startY": 1,
            "endX": 370,
            "endY": 330,
            "button": "LEFT",
        }
    },
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse click status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {
        "mouseDrag": {
            "startX": 500,
            "startY": 300,
            "endX": 100,
            "endY": 200,
            "button": "MIDDLE",
        }
    },
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse click status: {r.status_code}, action" {r.json()["result"]}')
```

```python
print("\n── Happy Path: Scroll Actions ──")

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"mouseScroll": {"x": 800, "y": 600, "deltaX": 0, "deltaY": -500}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse action status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"mouseScroll": {"x": 500, "y": 300, "deltaX": 300, "deltaY": 0}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse action status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"mouseScroll": {"x": 500, "y": 300, "deltaX": -100, "deltaY": -200}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse action status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"mouseScroll": {"x": 500, "y": 300, "deltaX": 1000, "deltaY": 1000}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Mouse action status: {r.status_code}, action" {r.json()["result"]}')
```

```python
print("\n── Happy Path: Keyboard Actions ──")

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"keyType": {"text": "Hello World"}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Keyboard status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"keyType": {"text": "user@example.com!#$%^&*()"}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Keyboard status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"keyType": {"text": "https://www.example.com"}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Keyboard status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"keyType": {"text": "1" * 10000}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Keyboard status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"keyPress": {"key": "enter"}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Keyboard status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"keyPress": {"key": "tab"}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Keyboard status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"keyPress": {"key": "escape"}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Keyboard status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"keyPress": {"key": "backspace", "presses": 5}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Keyboard status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"keyPress": {"key": "ArrowDown", "presses": 100}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Keyboard status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"keyShortcut": {"keys": ["ctrl", "s"]}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Keyboard status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"keyShortcut": {"keys": ["ctrl", "p"]}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Keyboard status: {r.status_code}, action" {r.json()["result"]}')

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"keyShortcut": {"keys": ["ctrl", "shift", "i"]}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Keyboard status: {r.status_code}, action" {r.json()["result"]}')
```

```python
from IPython.display import Image, display
import base64


def check_screenshot(resp):
    data = resp.json().get("result", {}).get("screenshot", {}).get("data")
    if not data:
        return "screenshot data is empty"

    img_bytes = base64.b64decode(data)
    display(Image(img_bytes))


print("\n── Happy Path: Screenshot ──")

r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"screenshot": {"format": "PNG"}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Screenshot status: {r.status_code}, action" {r.json()["result"]}')
check_screenshot(r)
```

```python
r = invoke(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    {"screenshot": {}},
    region=default_region,
    credentials=creds,
    browser_id=browser_id,
)
print(f'Screenshot status: {r.status_code}, action" {r.json()["result"]}')
check_screenshot(r)
```

#### 6. Stop the browser session

```python
print("\n── Teardown: Stopping browser session ──")
stop_session(
    BEDROCK_AGENTCORE_DP_ENDPOINT,
    sid,
    browser_id,
    region=default_region,
    credentials=creds,
)
```

### 7. Clean Up (Optional)

Delete the custom browser, and remove the IAM role.

#### 7.1 Delete the custom browser

```python
browser_boto3.delete_browser(browserId=browser_id)
print(f"Browser {browser_id} deleted")
```

#### 7.2 Delete the IAM role

```python
from helpers.utils import delete_agentcore_execution_role, SAMPLE_ROLE_NAME

response = delete_agentcore_execution_role(SAMPLE_ROLE_NAME)

print(f"Role Deleted: {response}")
```
