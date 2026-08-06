## Verify Domain Filtering with AWS Network Firewall

This notebook verifies that the AWS Network Firewall deployed by `agentcore-browser-firewall.yaml` correctly filters domains for AgentCore Browser sessions.

The firewall enforces three categories:
- **Allowlist** — explicitly permitted domains (e.g. `example.com`, `github.com`)
- **Denylist** — explicitly blocked domains (e.g. `facebook.com`, `twitter.com`)
- **Default deny** — any domain not in either list is blocked

### Prerequisites

1. Deploy the `agentcore-browser-firewall.yaml` CloudFormation stack
2. Install dependencies and **restart your kernel**:

```python
!pip install -qU -r requirements.txt
```

### 1. Setup

Get the Browser ID from the CloudFormation stack outputs and initialize the client.

```python
import boto3
from urllib.parse import urlparse
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest

session = boto3.Session()
REGION = session.region_name
browser_client = boto3.client("bedrock-agentcore")

# Get BROWSER_ID from CloudFormation outputs
cfn = boto3.client("cloudformation")
outputs = cfn.describe_stacks(StackName="agentcore-browser-firewall")["Stacks"][0]["Outputs"]
BROWSER_ID = next(o["OutputValue"] for o in outputs if o["OutputKey"] == "BrowserToolCustomOutput")
print(f"Browser ID: {BROWSER_ID}")
```

### 2. Start a browser session

Start a session and build the SigV4-signed WebSocket URL for Playwright to connect through.

```python
response = browser_client.start_browser_session(browserIdentifier=BROWSER_ID)
session_id = response["sessionId"]
ws_url = f"wss://bedrock-agentcore.{REGION}.amazonaws.com/browser-streams/{BROWSER_ID}/sessions/{session_id}/automation"
print(f"Session ID: {session_id}")

# Sign the WebSocket URL with SigV4
credentials = session.get_credentials()
https_url = ws_url.replace("wss://", "https://")
parsed = urlparse(https_url)
request = AWSRequest(method="GET", url=https_url, headers={"host": parsed.netloc})
SigV4Auth(credentials, "bedrock-agentcore", REGION).add_auth(request)
headers = {k: v for k, v in request.headers.items()}
```

### 3. Run domain filtering verification

Connect via Playwright and attempt to navigate to domains in each category.

The test URLs below match the default `AllowedDomains` and `DeniedDomains` parameters in the CloudFormation template. If you customized those parameters, update the URLs accordingly.

```python
from playwright.async_api import async_playwright

# (url, category, should_allow)
tests = [
    ("https://example.com", "ALLOWLIST", True),
    ("https://github.com", "ALLOWLIST", True),
    ("https://wikipedia.org", "ALLOWLIST", True),
    ("https://facebook.com", "DENYLIST", False),
    ("https://twitter.com", "DENYLIST", False),
    ("https://randomsite12345.com", "UNLISTED", False),
]

async with async_playwright() as p:
    browser = await p.chromium.connect_over_cdp(ws_url, headers=headers)
    page = browser.contexts[0].pages[0] if browser.contexts else await browser.new_context().new_page()

    print("=" * 60)
    print("DOMAIN FILTERING VERIFICATION RESULTS")
    print("=" * 60)

    results = []
    for url, category, should_allow in tests:
        try:
            resp = await page.goto(url, timeout=10000, wait_until="domcontentloaded")
            allowed = resp is not None and resp.status < 400
            passed = allowed == should_allow
            status_str = f"HTTP {resp.status}" if resp else "No response"
            result = "PASS" if passed else "FAIL"
            label = "Allowed" if allowed else "Blocked"
            print(f"{result}: {url} ({category}) - {label} [{status_str}]")
            results.append(passed)
        except Exception as e:
            passed = not should_allow
            result = "PASS" if passed else "FAIL"
            print(f"{result}: {url} ({category}) - Blocked ({type(e).__name__})")
            results.append(passed)

    print("=" * 60)
    print(f"Results: {sum(results)}/{len(results)} tests passed")
    await browser.close()
```

### 4. Stop the session

```python
browser_client.stop_browser_session(browserIdentifier=BROWSER_ID, sessionId=session_id)
print(f"Session {session_id} stopped")
```

### Troubleshooting

If tests don't behave as expected, check the Network Firewall logs in CloudWatch:

```
/aws/network-firewall/agentcore-browser-firewall/alert
/aws/network-firewall/agentcore-browser-firewall/flow
```

Alert logs show which rules matched. Flow logs show all traffic through the firewall, useful for debugging domains that are unexpectedly blocked or allowed.
