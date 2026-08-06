# AgentCore Browser with Chrome Enterprise Policies and Custom Root CAs

This notebook demonstrates two new features of [Amazon Bedrock AgentCore Browser](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html):

- **Chrome enterprise policies**: Restrict a browser agent to approved domains and disable risky browser features
- **Custom root CA certificates**: Enable agents to connect to services that use non-public certificate authorities

**Part 1** creates a Chrome policy that locks the browser to AWS documentation, uses Playwright to demonstrate the restrictions (allowed URL succeeds, blocked URL is rejected by Chrome), and uses session recording to review the enforcement.

**Part 2** demonstrates custom root CA certificates using [badssl.com](https://badssl.com) — a public site with an intentionally untrusted certificate — to show how Code Interpreter sessions can trust non-public CAs.

### Prerequisites

Before running this notebook, make sure you have the following:

1. **Python 3.10 or later** installed
2. **AWS credentials configured** with the following environment variables set:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_SESSION_TOKEN` (required when using temporary credentials from IAM Identity Center or STS)
   - `AWS_REGION` (for example, `us-west-2`)
3. **IAM permissions** for Amazon Bedrock AgentCore Browser, Code Interpreter, Amazon S3, AWS Secrets Manager, and IAM role creation. See the [README](README.md) for the full policy.
4. **Amazon Bedrock model access** enabled for Anthropic Claude (only needed for the optional Strands agent cell)

You can verify your credentials are configured by running:
```bash
aws sts get-caller-identity
```

> **Important:** Use temporary credentials from AWS IAM Identity Center or AWS STS. Do not use long-lived access keys.

### Install dependencies

```python
!pip install -qU -r requirements.txt
```

### Configuration

The notebook derives the S3 bucket name and IAM role ARN from your AWS account ID and region automatically. You do **not** need to replace placeholder values.

```python
import boto3
import json
import time
import asyncio
from botocore.exceptions import ClientError

session = boto3.Session()
ACCOUNT_ID = boto3.client("sts").get_caller_identity()["Account"]
REGION = session.region_name

# Derived names — no manual replacement needed
BUCKET_NAME = f"ac-browser-policy-demo-{ACCOUNT_ID}-{REGION}"
AC_ROLE_NAME = "ac-browser-policy-execution-role"
BROWSER_NAME = "docs_research_browser"
POLICY_KEY = "browser-policies/docs-only-policy.json"

# Clients
iam_client = boto3.client("iam")
s3_client = boto3.client("s3", region_name=REGION)
sm_client = boto3.client("secretsmanager", region_name=REGION)

print(f"Account: {ACCOUNT_ID}")
print(f"Region:  {REGION}")
print(f"Bucket:  {BUCKET_NAME}")
print(f"Role:    {AC_ROLE_NAME}")
```

### Create S3 bucket

Create an S3 bucket (if it doesn't exist) to store the Chrome policy JSON file and session recordings.

```python
try:
    s3_client.head_bucket(Bucket=BUCKET_NAME)
    print(f"Bucket {BUCKET_NAME} already exists")
except ClientError:
    create_params = {"Bucket": BUCKET_NAME}
    if REGION != "us-east-1":
        create_params["CreateBucketConfiguration"] = {"LocationConstraint": REGION}
    s3_client.create_bucket(**create_params)
    print(f"Bucket {BUCKET_NAME} created in {REGION}")
```

### Create IAM execution role

Create an IAM role that Amazon Bedrock AgentCore assumes when running browser sessions and code interpreter sessions. The role needs:
- A trust policy allowing `bedrock-agentcore.amazonaws.com` to assume it
- S3 permissions for the policy files and session recordings bucket

```python
# Trust policy — bedrock-agentcore.amazonaws.com is the service principal
trust_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"Service": "bedrock-agentcore.amazonaws.com"},
            "Action": "sts:AssumeRole",
        }
    ],
}

# S3 permissions for policy files and session recordings
s3_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:GetObjectVersion",
                "s3:ListBucket",
                "s3:ListMultipartUploadParts",
                "s3:AbortMultipartUpload",
            ],
            "Resource": [
                f"arn:aws:s3:::{BUCKET_NAME}",
                f"arn:aws:s3:::{BUCKET_NAME}/*",
            ],
        }
    ],
}

try:
    role_response = iam_client.create_role(
        RoleName=AC_ROLE_NAME,
        AssumeRolePolicyDocument=json.dumps(trust_policy),
        Description="Execution role for AgentCore Browser chrome policy demo",
    )
    EXECUTION_ROLE_ARN = role_response["Role"]["Arn"]
    print(f"Created role: {EXECUTION_ROLE_ARN}")

    # Attach S3 inline policy
    iam_client.put_role_policy(
        RoleName=AC_ROLE_NAME,
        PolicyName="ac_browser_s3_policy",
        PolicyDocument=json.dumps(s3_policy),
    )
    print("Attached S3 policy")

except ClientError as e:
    if e.response["Error"]["Code"] == "EntityAlreadyExists":
        EXECUTION_ROLE_ARN = iam_client.get_role(RoleName=AC_ROLE_NAME)["Role"]["Arn"]
        print(f"Role already exists: {EXECUTION_ROLE_ARN}")
    else:
        raise

print(f"\nExecution Role ARN: {EXECUTION_ROLE_ARN}")
```

Wait for IAM role propagation:

```python
print("Waiting 10 seconds for IAM role propagation...")
time.sleep(10)
print("Done.")
```

---
## Part 1: Chrome Enterprise Policies

In this section, you will:
1. Define a Chrome enterprise policy that restricts navigation to AWS documentation
2. Upload the policy JSON to Amazon S3
3. Create a custom AgentCore Browser with the policy enforced as a **managed** policy
4. Use Playwright to navigate to an allowed URL (succeeds) and a blocked URL (rejected by Chrome)

### Step 1: Create and upload the Chrome enterprise policy

This policy blocks all URLs by default, then allows only AWS documentation. It also disables the password manager, downloads, DevTools, and autofill.

For the full list of available Chrome policies, see the [Chrome Enterprise policy list](https://chromeenterprise.google/policies/).

> **Important — CDP compatibility:** Do not set `DeveloperToolsAvailability` to `2` (disabled). All AgentCore Browser automation uses the Chrome DevTools Protocol (CDP) via Playwright's `connect_over_cdp`. Setting this policy to `2` disables CDP at the Chrome level, which silently breaks all automation — the WebSocket connection succeeds at the proxy layer but Chrome refuses CDP commands, causing timeouts. Use `0` (allowed) or `1` (allowed only for extensions) instead.

```python
policy = {
    "URLBlocklist": ["*"],
    "URLAllowlist": [
        "docs.aws.amazon.com",
        ".aws.amazon.com",
        ".amazonaws.com",
    ],
    "PasswordManagerEnabled": False,
    "DownloadRestrictions": 3,
    "DeveloperToolsAvailability": 0,
    "BookmarkBarEnabled": False,
    "AutofillAddressEnabled": False,
    "AutofillCreditCardEnabled": False,
}

s3_client.put_object(
    Bucket=BUCKET_NAME,
    Key=POLICY_KEY,
    Body=json.dumps(policy, indent=2),
    ContentType="application/json",
)

print(f"Policy uploaded to s3://{BUCKET_NAME}/{POLICY_KEY}")
print("\nPolicy contents:")
print(json.dumps(policy, indent=2))
```

### Step 2: Create a browser with managed policies and session recording

Create a custom browser that enforces the Chrome policy on every session. The `enterprise_policies` parameter takes a list of policy objects, each with a `location` (S3 path to the JSON file) and a `type`:

- **`MANAGED`** — enforced at the browser level, cannot be overridden (maps to Chrome's `/etc/chromium/policies/managed/`)
- **`RECOMMENDED`** — applied at the session level as preferences (maps to Chrome's `/etc/chromium/policies/recommended/`)

Session recording is enabled so you can replay the session afterward in the AgentCore console.

```python
from bedrock_agentcore.tools import BrowserClient

client = BrowserClient(REGION)

# If the browser already exists (e.g., from a previous run), reuse it.
# If you need to update the policy, run the Cleanup section first,
# then re-run this cell to create a fresh browser with the new policy.
try:
    print("Creating browser with managed policies and session recording...")
    response = client.create_browser(
        name=BROWSER_NAME,
        execution_role_arn=EXECUTION_ROLE_ARN,
        network_configuration={"networkMode": "PUBLIC"},
        enterprise_policies=[
            {
                "location": {
                    "s3": {
                        "bucket": BUCKET_NAME,
                        "prefix": POLICY_KEY,
                    }
                },
                "type": "MANAGED",
            }
        ],
        recording={
            "enabled": True,
            "s3Location": {
                "bucket": BUCKET_NAME,
                "prefix": "policy-demo",
            },
        },
        description="Browser restricted to AWS docs with Chrome enterprise policies",
    )
    browser_id = response["browserId"]
    print(f"Created new browser: {browser_id}")

except ClientError as e:
    if e.response["Error"]["Code"] == "ConflictException":
        print(f"Browser '{BROWSER_NAME}' already exists from a previous run.")
        print("Reusing existing browser. To recreate with a new policy,")
        print("run the Cleanup section first, then re-run this cell.")
        browsers = client.list_browsers(browser_type="CUSTOM")
        browser_id = None
        for b in browsers.get("browserSummaries", []):
            if b.get("name") == BROWSER_NAME:
                browser_id = b["browserId"]
                break
        if not browser_id:
            raise RuntimeError(f"Could not find browser '{BROWSER_NAME}'")
    else:
        raise

print(f"Browser ID: {browser_id}")
```

Wait for the browser to reach **READY** status:

```python
print("Waiting for browser to become ready...")
while True:
    info = client.get_browser(browser_id)
    status = info["status"]
    if status == "READY":
        print(f"Browser is ready: {browser_id}")
        break
    elif status == "CREATE_FAILED":
        reason = info.get("failureReason", "Unknown")
        print(f"Browser creation failed: {reason}")
        raise SystemExit(1)
    print(f"  Status: {status} — waiting...")
    time.sleep(5)
```

### Step 3: Demonstrate Chrome policy enforcement with Playwright

Start a browser session and use [Playwright](https://playwright.dev/docs/intro) to navigate to two URLs:

1. **`docs.aws.amazon.com`** — allowed by the policy → page loads successfully
2. **`www.wikipedia.org`** — blocked by the policy → Chrome displays an error page

This demonstrates that the restriction happens at the browser level, independent of any agent prompt or reasoning logic.

> **Tip:** While this cell runs, you can watch the browser live in the AgentCore console. Navigate to **Built-in tools** → **docs_research_browser** → **View live session**.

```python
from bedrock_agentcore.tools import BrowserClient
from playwright.async_api import async_playwright

session_client = BrowserClient(REGION)
session_id = session_client.start(identifier=browser_id, session_timeout_seconds=3600)
print(f"Session started: {session_id}")

# Poll until session is ready
for i in range(30):
    info = session_client.get_session()
    status = info.get("status")
    print(f"  Status: {status}")
    if status == "READY":
        break
    time.sleep(5)

ws_url, headers = session_client.generate_ws_headers()


async def test_policy_enforcement():
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp(ws_url, headers=headers, timeout=60000)
        print("Connected!")
        context = browser.contexts[0]
        page = context.pages[0] if context.pages else await context.new_page()

        # ── Test 1: Navigate to ALLOWED URL ──
        print("\n" + "=" * 60)
        print("TEST 1: Navigate to docs.aws.amazon.com (ALLOWED)")
        print("=" * 60)
        await page.goto(
            "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html",
            wait_until="domcontentloaded",
            timeout=60000,
        )
        await asyncio.sleep(3)

        title = await page.title()
        print(f"Page title: {title}")

        # Extract text, removing script/style/noscript elements first
        text = await page.evaluate("""() => {
            const scripts = document.querySelectorAll('script, style, noscript');
            scripts.forEach(s => s.remove());
            return document.body.innerText;
        }""")
        print(f"Extracted {len(text)} chars")
        print(f"First 500 chars:\n{text[:500]}")

        # ── Test 2: Navigate to BLOCKED URL ──
        print("\n" + "=" * 60)
        print("TEST 2: Navigate to www.wikipedia.org (BLOCKED)")
        print("=" * 60)
        try:
            await page.goto(
                "https://www.wikipedia.org",
                wait_until="domcontentloaded",
                timeout=15000,
            )
            blocked_title = await page.title()
            content = await page.evaluate("() => document.documentElement.outerHTML", None)
            if "blocked" in content.lower() or "ERR_BLOCKED" in content:
                print("Result: CHROME POLICY BLOCKED THIS URL ✅")
            else:
                print(f"Result: Page loaded (unexpected) — title: {blocked_title}")
        except Exception:
            print("Result: CHROME POLICY BLOCKED THIS URL ✅")

        await browser.close()
        return text


docs_text = await test_policy_enforcement()
session_client.stop()
print("\nSession stopped.")
```

### Step 4: Review the session recording

Because you enabled session recording in Step 2, you can replay the session to observe the policy enforcement.

**To review the recording in the Amazon Bedrock AgentCore console:**

1. Open the [Amazon Bedrock AgentCore console](https://console.aws.amazon.com/bedrock-agentcore/home#)
2. In the navigation pane, choose **Built-in tools**
3. Select your browser tool (**docs_research_browser**)
4. In the **Browser sessions** section, find the completed session with **Terminated** status
5. Choose **View Recording**

The replay interface shows:
- **Video player** — interactive playback with timeline scrubber
- **User actions** — timestamped navigation events, including the blocked URL attempt
- **Network events** — confirming only `docs.aws.amazon.com` traffic succeeded

### (Optional) Step 4b: Run a Strands agent with the restricted browser

You can also use the policy-restricted browser with an AI agent framework. The cell below creates a [Strands](https://strandsagents.com/) agent that researches AgentCore documentation. The agent will succeed on `docs.aws.amazon.com` and observe that `wikipedia.org` is blocked.

This sample uses Anthropic Claude through Amazon Bedrock. AgentCore is model-agnostic — you can substitute any model provider. For model configuration, refer to [Model Providers](https://strandsagents.com/latest/user-guide/concepts/model-providers/).

> **Note:** The `AgentCoreBrowser` tool in `strands-agents-tools` creates browser sessions on demand. If you experience connection timeouts on the first attempt, the tool will retry. The first session creation for a newly created browser may take longer.

```python
from strands import Agent
from strands_tools.browser import AgentCoreBrowser

SYSTEM_PROMPT = """You are a research assistant that reads AWS documentation
and provides summaries. Navigate to the provided URLs, read the content,
and summarize the key information. Stay focused on the documentation pages
provided. If a page fails to load or is blocked, note that it was blocked
and continue working with the pages that are accessible."""

browser_tool = AgentCoreBrowser(
    region=REGION,
    identifier=browser_id,
)

agent = Agent(
    tools=[browser_tool.browser],
    system_prompt=SYSTEM_PROMPT,
)

prompt = """Research Amazon Bedrock AgentCore Browser by reading the documentation at
https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html

Summarize the top 3 capabilities and provide a brief explanation of each.

Also try navigating to https://www.wikipedia.org to find additional context
about AI agents."""

print(f"Prompt: {prompt}\n")
print("Running agent...\n")

response = agent(prompt)

print("\n" + "=" * 60)
print("AGENT RESPONSE:")
print("=" * 60)
print(response.message["content"][0]["text"])
```

---
## Part 2: Custom Root CA Certificates

Organizations that run internal services with private certificate authorities, or route traffic through SSL-intercepting corporate proxies, need their agents to trust those non-public certificates.

To demonstrate this capability without requiring internal infrastructure, this section uses [https://untrusted-root.badssl.com](https://untrusted-root.badssl.com) — a public website that intentionally uses a certificate signed by an untrusted root CA. Normally, HTTPS connections to this site fail with SSL certificate errors, just like connections to your internal services would fail without the correct root CA.

### Step 5: Store the root CA certificate in AWS Secrets Manager

The BadSSL untrusted root CA certificate is publicly available (source: [badssl.com/certs/ca-untrusted-root.crt](https://badssl.com/certs/ca-untrusted-root.crt)). Store it in Secrets Manager so AgentCore can import it into the trusted certificate store.

In your organization, you'd store your internal CA certificate or your SSL-intercepting proxy's root CA certificate the same way.

```python
SECRET_NAME = "demo-badssl-untrusted-root-ca"

BADSSL_ROOT_CA = """-----BEGIN CERTIFICATE-----
MIIGfjCCBGagAwIBAgIJAJeg/PrX5Sj9MA0GCSqGSIb3DQEBCwUAMIGBMQswCQYD
VQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5j
aXNjbzEPMA0GA1UECgwGQmFkU1NMMTQwMgYDVQQDDCtCYWRTU0wgVW50cnVzdGVk
IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5MB4XDTE2MDcwNzA2MzEzNVoXDTM2
MDcwMjA2MzEzNVowgYExCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlh
MRYwFAYDVQQHDA1TYW4gRnJhbmNpc2NvMQ8wDQYDVQQKDAZCYWRTU0wxNDAyBgNV
BAMMK0JhZFNTTCBVbnRydXN0ZWQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkw
ggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDKQtPMhEH073gis/HISWAi
bOEpCtOsatA3JmeVbaWal8O/5ZO5GAn9dFVsGn0CXAHR6eUKYDAFJLa/3AhjBvWa
tnQLoXaYlCvBjodjLEaFi8ckcJHrAYG9qZqioRQ16Yr8wUTkbgZf+er/Z55zi1yn
CnhWth7kekvrwVDGP1rApeLqbhYCSLeZf5W/zsjLlvJni9OrU7U3a9msvz8mcCOX
fJX9e3VbkD/uonIbK2SvmAGMaOj/1k0dASkZtMws0Bk7m1pTQL+qXDM/h3BQZJa5
DwTcATaa/Qnk6YHbj/MaS5nzCSmR0Xmvs/3CulQYiZJ3kypns1KdqlGuwkfiCCgD
yWJy7NE9qdj6xxLdqzne2DCyuPrjFPS0mmYimpykgbPnirEPBF1LW3GJc9yfhVXE
Cc8OY8lWzxazDNNbeSRDpAGbBeGSQXGjAbliFJxwLyGzZ+cG+G8lc+zSvWjQu4Xp
GJ+dOREhQhl+9U8oyPX34gfKo63muSgo539hGylqgQyzj+SX8OgK1FXXb2LS1gxt
VIR5Qc4MmiEG2LKwPwfU8Yi+t5TYjGh8gaFv6NnksoX4hU42gP5KvjYggDpR+NSN
CGQSWHfZASAYDpxjrOo+rk4xnO+sbuuMk7gORsrl+jgRT8F2VqoR9Z3CEdQxcCjR
5FsfTymZCk3GfIbWKkaeLQIDAQABo4H2MIHzMB0GA1UdDgQWBBRvx4NzSbWnY/91
3m1u/u37l6MsADCBtgYDVR0jBIGuMIGrgBRvx4NzSbWnY/913m1u/u37l6MsAKGB
h6SBhDCBgTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNV
BAcMDVNhbiBGcmFuY2lzY28xDzANBgNVBAoMBkJhZFNTTDE0MDIGA1UEAwwrQmFk
U1NMIFVudHJ1c3RlZCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0eYIJAJeg/PrX
5Sj9MAwGA1UdEwQFMAMBAf8wCwYDVR0PBAQDAgEGMA0GCSqGSIb3DQEBCwUAA4IC
AQBQU9U8+jTRT6H9AIFm6y50tXTg/ySxRNmeP1Ey9Zf4jUE6yr3Q8xBv9gTFLiY1
qW2qfkDSmXVdBkl/OU3+xb5QOG5hW7wVolWQyKREV5EvUZXZxoH7LVEMdkCsRJDK
wYEKnEErFls5WPXY3bOglBOQqAIiuLQ0f77a2HXULDdQTn5SueW/vrA4RJEKuWxU
iD9XPnVZ9tPtky2Du7wcL9qhgTddpS/NgAuLO4PXh2TQ0EMCll5reZ5AEr0NSLDF
c/koDv/EZqB7VYhcPzr1bhQgbv1dl9NZU0dWKIMkRE/T7vZ97I3aPZqIapC2ulrf
KrlqjXidwrGFg8xbiGYQHPx3tHPZxoM5WG2voI6G3s1/iD+B4V6lUEvivd3f6tq7
d1V/3q1sL5DNv7TvaKGsq8g5un0TAkqaewJQ5fXLigF/yYu5a24/GUD783MdAPFv
gWz8F81evOyRfpf9CAqIswMF+T6Dwv3aw5L9hSniMrblkg+ai0K22JfoBcGOzMtB
Ke/Ps2Za56dTRoY/a4r62hrcGxufXd0mTdPaJLw3sJeHYjLxVAYWQq4QKJQWDgTS
dAEWyN2WXaBFPx5c8KIW95Eu8ShWE00VVC3oA4emoZ2nrzBXLrUScifY6VaYYkkR
2O2tSqU8Ri3XRdgpNPDWp8ZL49KhYGYo3R/k98gnMHiY5g==
-----END CERTIFICATE-----"""

try:
    sm_client.create_secret(
        Name=SECRET_NAME,
        SecretString=BADSSL_ROOT_CA,
        Description="BadSSL untrusted root CA for demo purposes",
    )
    print(f"Created secret: {SECRET_NAME}")
except sm_client.exceptions.ResourceExistsException:
    print(f"Secret already exists: {SECRET_NAME}")

secret_arn = sm_client.describe_secret(SecretId=SECRET_NAME)["ARN"]
print(f"Secret ARN: {secret_arn}")
```

### Step 6: Code Interpreter WITHOUT root CA — expect SSL error

Create a default Code Interpreter session and attempt to connect to `https://untrusted-root.badssl.com`. The connection will fail because the root CA is not trusted.

```python
from bedrock_agentcore.tools import CodeInterpreter

TEST_CODE = 'import urllib.request\ntry:\n    response = urllib.request.urlopen("https://untrusted-root.badssl.com")\n    print(f"Status: {response.status}")\nexcept Exception as e:\n    print(f"Error: {type(e).__name__}")\n    print(f"The connection failed because the root CA is not trusted.")'

ci_client = CodeInterpreter(REGION)
ci_client.start()

print(f"Session started: {ci_client.session_id}")
print("Connecting to https://untrusted-root.badssl.com ...\n")

result = ci_client.invoke(
    "executeCode",
    {
        "code": TEST_CODE,
        "language": "python",
    },
)

for event in result.get("stream", []):
    if "result" in event:
        content = event["result"]
        is_error = content.get("isError", False)
        structured = content.get("structuredContent", {})
        stderr = structured.get("stderr", "")
        stdout = structured.get("stdout", "")

        if (
            is_error
            or "SSLCertVerificationError" in stderr
            or "SSLCertVerificationError" in stdout
            or "Error:" in stdout
        ):
            print("Result: SSL CERTIFICATE ERROR (expected)")
            print("  The connection failed because the root CA is not trusted.")
        else:
            print(f"  stdout: {stdout[:200]}")

ci_client.stop()
print("\nSession stopped.")
```

### Step 7: Code Interpreter WITH root CA — expect HTTP 200

Create a custom Code Interpreter that trusts the BadSSL root CA certificate using the `certificates` parameter. This uses the same `Certificate.from_secret_arn(...)` pattern shown in the Browser's `create_browser()` call.

```python
from bedrock_agentcore.tools import Certificate

ci_client_with_ca = CodeInterpreter(REGION)

response = ci_client_with_ca.create_code_interpreter(
    name="demo_rootca_interpreter",
    execution_role_arn=EXECUTION_ROLE_ARN,
    network_configuration={"networkMode": "PUBLIC"},
    certificates=[Certificate.from_secret_arn(secret_arn)],
    description="Code interpreter trusting BadSSL untrusted root CA",
)

interpreter_id = response["codeInterpreterId"]
print(f"Created interpreter: {interpreter_id}")

# Wait for ready
print("Waiting for interpreter to become ready...")
while True:
    info = ci_client_with_ca.get_code_interpreter(interpreter_id)
    if info["status"] == "READY":
        print("Interpreter is ready.")
        break
    elif info["status"] == "CREATE_FAILED":
        print(f"Failed: {info.get('failureReason', 'Unknown')}")
        raise SystemExit(1)
    time.sleep(3)
```

Start a session with the custom interpreter and run the same code:

```python
SUCCESS_CODE = 'import urllib.request\nresponse = urllib.request.urlopen("https://untrusted-root.badssl.com")\nprint(f"Status: {response.status}")\nprint(response.read().decode("utf-8")[:200])'

ci_client_with_ca.start(identifier=interpreter_id)
print(f"Session started: {ci_client_with_ca.session_id}")
print("Connecting to https://untrusted-root.badssl.com ...\n")

result = ci_client_with_ca.invoke(
    "executeCode",
    {
        "code": SUCCESS_CODE,
        "language": "python",
    },
)

for event in result.get("stream", []):
    if "result" in event:
        content = event["result"]
        structured = content.get("structuredContent", {})
        stdout = structured.get("stdout", "")
        exit_code = structured.get("exitCode", -1)

        if exit_code == 0 and "200" in stdout:
            print("Result: SUCCESS — HTTP 200")
            print("  The connection succeeded because the root CA is now trusted.")
            print(f"  Output: {stdout[:200]}")
        else:
            print(f"  Unexpected result (exit code {exit_code}): {stdout[:300]}")

ci_client_with_ca.stop()
print("\nSession stopped.")
```

### Apply this to your organization

The `badssl.com` demo mirrors two real-world scenarios:

| Scenario | What you'd store in Secrets Manager | Configuration |
|----------|-------------------------------------|---------------|
| Internal corporate services | Your organization's root CA certificate (HR portal, Jira, Artifactory) | Reference the secret ARN in `certificates` when creating a browser or code interpreter |
| SSL-intercepting corporate proxies | Your proxy's root CA certificate (Zscaler, Palo Alto Networks) | Reference the secret ARN in `certificates` and configure proxy settings |

You can combine root CA certificates with Chrome policies in a single `create_browser` call — see the accompanying blog post for a combined example.

---
## Cleanup

Delete all resources created by this notebook to avoid charges.

```python
# Stop all active sessions, then delete the custom browser
try:
    print(f"Stopping active sessions for browser: {browser_id}")
    sessions = client.list_sessions(browser_id=browser_id, status="READY")
    for s in sessions.get("items", []):
        sid = s["sessionId"]
        print(f"  Stopping session: {sid}")
        try:
            client.data_plane_client.stop_browser_session(browserIdentifier=browser_id, sessionId=sid)
        except Exception as e:
            print(f"    Error: {e}")

    if sessions.get("items"):
        print("Waiting for sessions to terminate...")
        time.sleep(15)

    print(f"Deleting browser: {browser_id}")
    client.delete_browser(browser_id)
    print("  Deleted.")
except Exception as e:
    print(f"  Could not delete browser: {e}")
```

```python
# Delete custom Code Interpreter (if created in Part 2)
try:
    print(f"Deleting interpreter: {interpreter_id}")
    ci_client_with_ca.delete_code_interpreter(interpreter_id)
    print("  Deleted.")
except NameError:
    print("  No interpreter to delete (Part 2 was not run).")
except Exception as e:
    print(f"  Could not delete interpreter: {e}")
```

```python
# Delete Secrets Manager secret
try:
    print(f"Deleting secret: {SECRET_NAME}")
    sm_client.delete_secret(
        SecretId=SECRET_NAME,
        ForceDeleteWithoutRecovery=True,
    )
    print("  Deleted.")
except NameError:
    print("  No secret to delete (Part 2 was not run).")
except Exception as e:
    print(f"  Could not delete secret: {e}")
```

```python
# Delete S3 policy file
print(f"Deleting policy: s3://{BUCKET_NAME}/{POLICY_KEY}")
try:
    s3_client.delete_object(Bucket=BUCKET_NAME, Key=POLICY_KEY)
    print("  Deleted.")
except Exception as e:
    print(f"  Could not delete policy: {e}")
```

```python
# Delete IAM role (detach policies first)
try:
    print(f"Deleting IAM role: {AC_ROLE_NAME}")
    # Delete inline policy
    try:
        iam_client.delete_role_policy(RoleName=AC_ROLE_NAME, PolicyName="ac_browser_s3_policy")
    except Exception:
        pass
    # Delete role
    iam_client.delete_role(RoleName=AC_ROLE_NAME)
    print("  Deleted.")
except Exception as e:
    print(f"  Could not delete role: {e}")

print("\nCleanup complete.")
```
