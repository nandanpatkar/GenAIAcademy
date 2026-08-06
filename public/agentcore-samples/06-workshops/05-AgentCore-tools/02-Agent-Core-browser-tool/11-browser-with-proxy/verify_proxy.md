## Verify Browser Proxy Routing

This notebook verifies that the AgentCore Browser routes traffic through the Squid proxy
deployed by `agentcore-browser-proxy.yaml`.

The stack deploys:
- **Squid proxy** on EC2 in a public subnet (with basic auth via Secrets Manager)
- **AgentCore Browser** in a private subnet (VPC mode, egress locked to Squid:3128)
- **S3 bucket** receiving Squid access logs every 5 minutes

### Prerequisites

1. Deploy the `agentcore-browser-proxy.yaml` CloudFormation stack
2. Install dependencies and **restart your kernel**:

```python
!pip install -qU -r requirements.txt
```

### 1. Read CloudFormation outputs

Pull the Browser ID, Squid IPs, and Secrets Manager ARN from the stack.

```python
import boto3
from urllib.parse import urlparse
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest

STACK_NAME = "agentcore-browser-proxy"

session = boto3.Session()
REGION = session.region_name
print(f"Region: {REGION}")
browser_client = session.client("bedrock-agentcore")

cfn = session.client("cloudformation")
outputs = {o["OutputKey"]: o["OutputValue"] for o in cfn.describe_stacks(StackName=STACK_NAME)["Stacks"][0]["Outputs"]}

BROWSER_ID = outputs["BrowserId"]
SQUID_IP = outputs["SquidPrivateIp"]
SQUID_PUBLIC_IP = outputs["SquidPublicIp"]
SECRET_ARN = outputs["ProxySecretArn"]
LOG_BUCKET = outputs["LogBucketName"]

print(f"Browser ID:       {BROWSER_ID}")
print(f"Squid private IP: {SQUID_IP}")
print(f"Squid public IP:  {SQUID_PUBLIC_IP}")
print(f"Log bucket:       {LOG_BUCKET}")
```

### 2. Start a proxied browser session

Build the `proxyConfiguration` pointing to the Squid instance and start a session.
The browser will route all web traffic through the proxy.

```python
proxy_config = {
    "proxies": [
        {
            "externalProxy": {
                "server": SQUID_IP,
                "port": 3128,
                "credentials": {"basicAuth": {"secretArn": SECRET_ARN}},
            }
        }
    ]
}

response = browser_client.start_browser_session(
    browserIdentifier=BROWSER_ID,
    proxyConfiguration=proxy_config,
)
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

### 3. Verify proxy routing

Connect via Playwright and navigate to an IP detection service.
If the proxy is working, the observed IP should match the Squid instance's public IP.

```python
from playwright.async_api import async_playwright

async with async_playwright() as p:
    browser = await p.chromium.connect_over_cdp(ws_url, headers=headers)
    page = browser.contexts[0].pages[0] if browser.contexts else await browser.new_context().new_page()

    print("Checking browser's public IP via icanhazip.com...")
    await page.goto("https://icanhazip.com", timeout=15000, wait_until="domcontentloaded")
    observed_ip = (await page.inner_text("body")).strip()

    print(f"\n{'=' * 50}")
    print(f"Expected IP (Squid public): {SQUID_PUBLIC_IP}")
    print(f"Observed IP (browser):      {observed_ip}")
    match = observed_ip == SQUID_PUBLIC_IP
    print(f"Result: {'PASS' if match else 'FAIL'} — traffic {'is' if match else 'is NOT'} routed through proxy")
    print(f"{'=' * 50}")

    await browser.close()
```

### 4. Stop the session

```python
browser_client.stop_browser_session(browserIdentifier=BROWSER_ID, sessionId=session_id)
print(f"Session {session_id} stopped")
```

### Troubleshooting

- **IP mismatch**: Check that the browser security group only allows egress to Squid:3128
- **Connection timeout**: Verify Squid is running — SSH to the EC2 instance and check `systemctl status squid`
- **Auth errors**: Verify the Secrets Manager secret matches the Squid htpasswd — check `/var/log/squid/access.log` on the instance
- **No S3 logs**: Logs sync every 5 minutes via cron — check `/var/log/user-data.log` on the instance for setup errors
