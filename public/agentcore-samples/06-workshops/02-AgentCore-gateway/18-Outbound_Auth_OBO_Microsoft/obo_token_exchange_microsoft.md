# OBO Token Exchange with AgentCore Gateway + Microsoft Graph API

This tutorial shows how to use **AgentCore Gateway** to expose the Microsoft Graph API as MCP tools, with **OBO (On-Behalf-Of) token exchange** handling authentication transparently. The agent code is just a few lines — no token handling, no session binding, no Runtime deployment.

### How It Works

1. User authenticates directly with **Microsoft Entra ID** and gets an access token scoped to the app (`api://<client-id>/access_as_user`)
2. User passes that Entra ID token to the **AgentCore Gateway** as the bearer
3. Gateway validates the token using Entra ID's OIDC discovery URL (inbound auth)
4. Gateway performs **OBO token exchange** — swaps the app-scoped Entra ID token for a Microsoft Graph token using JWT Authorization Grant (RFC 7523)
5. A **Strands agent** connects to the Gateway MCP URL, discovers tools, and invokes them

**Docs:** [OBO Token Exchange](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/on-behalf-of-token-exchange.html) · [Gateway Outbound Auth](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-outbound-auth.html)

## Prerequisites

- Python 3.10+
- AWS credentials configured
- Amazon Bedrock AgentCore SDK
- A Microsoft 365 **work or school account** with access to Microsoft Entra ID

> ⚠️ **Personal Microsoft accounts (`@outlook.com`, `@hotmail.com`, `@live.com`) will not work for the calendar/email demo.** The OBO token exchange itself works with personal accounts, but Microsoft Graph calendar and mail endpoints require an Exchange Online mailbox, which is only available with work/school accounts. Get a free sandbox at the [Microsoft 365 Developer Program](https://developer.microsoft.com/en-us/microsoft-365/dev-program).

```python
!pip3 install -U -r requirements.txt --quiet
```

---
## Step 1: Register Application in Microsoft Entra ID

### 1.1 Create App Registration
1. Go to [entra.microsoft.com](https://entra.microsoft.com) → **Identity** → **Applications** → **App registrations**
2. Click **+ New registration**
3. Name: `AgentCore-OBO-Tutorial`, Single tenant
4. Click **Register**

### 1.2 Record IDs
From the **Overview** page, copy:
- **Application (client) ID** → `MICROSOFT_CLIENT_ID`
- **Directory (tenant) ID** → `MICROSOFT_TENANT_ID`

### 1.3 Create Client Secret
1. **Certificates & secrets** → **+ New client secret**
2. Copy the **Value** immediately → `MICROSOFT_CLIENT_SECRET`

### 1.4 Configure API Permissions
1. **API permissions** → **+ Add a permission** → **Microsoft Graph** → **Delegated permissions**
2. Add: `Calendars.Read`, `Mail.Read`, `User.Read`

### 1.5 Expose an API (Required for OBO)
1. **Expose an API** → Set **Application ID URI** (accept default `api://<client-id>`)
2. **+ Add a scope**: name `access_as_user`, consent by Admins and users, Enabled

### 1.6 Configure Authentication (Redirect URI)
1. **Authentication** → **+ Add a platform** → **Web**
2. Add redirect URI: `http://localhost:9090/oauth2/callback`
3. Click **Configure**

> This redirect URI is used by the token callback server to receive the authorization code.

### 1.7 Grant Admin Consent
1. **API permissions** → **Grant admin consent for [tenant]** → **Yes**

> ✅ All permissions should show green checkmarks.

### Important: Token Version
By default, Entra ID issues **v1.0 access tokens** (issuer: `https://sts.windows.net/{tenant}/`). The Gateway discovery URL in this tutorial uses the v1.0 endpoint to match. If you need v2.0 tokens, set `accessTokenAcceptedVersion: 2` in the app manifest and use the v2.0 discovery URL instead.

---
## Step 2: Create the OBO Credential Provider

Fill in your Entra ID credentials in the `.env` file below, then create the credential provider.

**Important:** The `onBehalfOfTokenExchangeConfig` is only available inside `customOauth2ProviderConfig`, so we use `CustomOauth2` as the vendor (not the built-in `MicrosoftOAuth2` provider).

```python
%%writefile .env
MICROSOFT_CLIENT_ID=""      # Application (client) ID from Entra ID
MICROSOFT_CLIENT_SECRET=""  # Client secret value from Entra ID
MICROSOFT_TENANT_ID=""      # Directory (tenant) ID from Entra ID
```

```python
import os
import json
import time
import urllib.parse

import boto3
from boto3.session import Session
from dotenv import dotenv_values

# Load .env and set environment variables
env = dotenv_values(".env")
os.environ.update(env)

boto_session = Session()
region = boto_session.region_name
print(f"Region: {region}")

identity_client = boto_session.client("bedrock-agentcore-control")
```

```python
tenant_id = os.environ["MICROSOFT_TENANT_ID"]
client_id = os.environ["MICROSOFT_CLIENT_ID"]

# Create Custom OAuth2 credential provider with OBO token exchange
# Note: onBehalfOfTokenExchangeConfig is only available inside customOauth2ProviderConfig
microsoft_provider = identity_client.create_oauth2_credential_provider(
    name="microsoft-obo-provider-v3",
    credentialProviderVendor="CustomOauth2",
    oauth2ProviderConfigInput={
        "customOauth2ProviderConfig": {
            "oauthDiscovery": {
                "discoveryUrl": f"https://login.microsoftonline.com/{tenant_id}/v2.0/.well-known/openid-configuration"
            },
            "clientId": os.environ["MICROSOFT_CLIENT_ID"],
            "clientSecret": os.environ["MICROSOFT_CLIENT_SECRET"],
            "clientAuthenticationMethod": "CLIENT_SECRET_POST",
            "onBehalfOfTokenExchangeConfig": {"grantType": "JWT_AUTHORIZATION_GRANT"},
        }
    },
)
print("Credential provider created \u2713")
print(f"ARN: {microsoft_provider['credentialProviderArn']}")
```

---
## Step 3: Create the AgentCore Gateway

The Gateway "MCPfies" Microsoft Graph API:
- **Inbound auth**: Entra ID OIDC JWT authorizer (CUSTOM_JWT) — validates tokens issued directly by Entra ID
- **Target**: OpenAPI schema exposing calendar, email, and profile endpoints as MCP tools
- **Outbound auth**: OBO token exchange via the credential provider

**Key insight**: We use Entra ID's **v1.0** OIDC discovery URL for inbound auth. Entra ID issues v1.0 access tokens by default (issuer: `sts.windows.net`), so the discovery URL must match. Using the v2.0 URL would cause a 403 because the signing keys and issuer don't match.

First, we create an IAM role for the Gateway, then create the Gateway itself.

```python
iam_client = boto3.client("iam")
account_id = boto3.client("sts").get_caller_identity()["Account"]

# Use the shared utils to create the Gateway IAM role
# This creates a role with bedrock-agentcore:*, secretsmanager:GetSecretValue, etc.
# matching the pattern used by other AgentCore Gateway tutorials
import sys

gw_utils_dir = os.path.abspath(os.path.join(os.getcwd(), "..", "..", "02-AgentCore-gateway"))
sys.path.insert(0, gw_utils_dir)
try:
    from utils import create_agentcore_gateway_role

    gateway_role_name = "agentcore-microsoft-obo-gateway-role"
    gateway_iam_role = create_agentcore_gateway_role("microsoft-obo-gateway")
    gateway_role_arn = gateway_iam_role["Role"]["Arn"]
    print(f"Gateway role: {gateway_role_arn}")
except ImportError:
    print("Shared utils not found, creating role inline...")
    gateway_role_name = "agentcore-obo-gateway-role"
    assume_role_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"Service": "bedrock-agentcore.amazonaws.com"},
                "Action": "sts:AssumeRole",
                "Condition": {
                    "StringEquals": {"aws:SourceAccount": account_id},
                    "ArnLike": {"aws:SourceArn": f"arn:aws:bedrock-agentcore:{region}:{account_id}:*"},
                },
            }
        ],
    }
    try:
        role_response = iam_client.create_role(
            RoleName=gateway_role_name,
            AssumeRolePolicyDocument=json.dumps(assume_role_policy),
        )
        gateway_role_arn = role_response["Role"]["Arn"]
    except iam_client.exceptions.EntityAlreadyExistsException:
        gateway_role_arn = f"arn:aws:iam::{account_id}:role/{gateway_role_name}"
    gateway_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AgentCoreAccess",
                "Effect": "Allow",
                "Action": ["bedrock-agentcore:*"],
                "Resource": "*",
            },
            {
                "Sid": "SecretsManagerAccess",
                "Effect": "Allow",
                "Action": ["secretsmanager:GetSecretValue"],
                "Resource": [f"arn:aws:secretsmanager:{region}:{account_id}:secret:*bedrock-agentcore*"],
            },
        ],
    }
    iam_client.put_role_policy(
        RoleName=gateway_role_name,
        PolicyName="GatewayOBOPolicy",
        PolicyDocument=json.dumps(gateway_policy),
    )
    print(f"Gateway role: {gateway_role_arn}")

print("Waiting for IAM propagation (10s)...")
time.sleep(10)
print("Done \u2713")
```

```python
agentcore_control_client = boto3.client("bedrock-agentcore-control", region_name=region)

# Entra ID v1.0 OIDC discovery URL for inbound auth
# IMPORTANT: Entra ID issues v1.0 access tokens by default (issuer: sts.windows.net).
# The discovery URL MUST match the token version — use v1.0, not v2.0.
discovery_url = f"https://login.microsoftonline.com/{tenant_id}/.well-known/openid-configuration"

# Create Gateway with Entra ID JWT authorizer
# allowedAudience uses the Application ID URI (api://<client-id>) since the
# Entra ID access token will have this as the "aud" claim
gateway_response = agentcore_control_client.create_gateway(
    name="microsoft-obo-gateway-v3",
    roleArn=gateway_role_arn,
    protocolType="MCP",
    authorizerType="CUSTOM_JWT",
    authorizerConfiguration={
        "customJWTAuthorizer": {
            "discoveryUrl": discovery_url,
            "allowedAudience": [f"api://{client_id}"],
        }
    },
    exceptionLevel="DEBUG",  # Show detailed errors for debugging
)
gateway_id = gateway_response["gatewayId"]
print(f"Gateway created \u2713  ID: {gateway_id}")
print(f"Inbound auth: Entra ID OIDC (tenant: {tenant_id})")
print(f"Allowed audience: api://{client_id}")
```

### Step 3b: Wait for Gateway, then Add Microsoft Graph Target

The Gateway must be in `READY` status before adding targets. Then we define the OpenAPI schema for Microsoft Graph endpoints — the Gateway exposes these as MCP tools.

**Important notes:**
- Use `top` and `select` as parameter names (not `$top`/`$select`) — the `$` character breaks Bedrock's tool schema validation
- The `customParameters` with `requested_token_use: on_behalf_of` is **required** for Entra ID's OBO endpoint

```python
# Wait for Gateway to become READY before adding targets
end_statuses = ["READY", "FAILED", "CREATE_FAILED", "UPDATE_FAILED", "DELETE_FAILED"]
status = "CREATING"
print("Waiting for Gateway to become READY...")
while status not in end_statuses:
    time.sleep(10)
    gw = agentcore_control_client.get_gateway(gatewayIdentifier=gateway_id)
    status = gw["status"]
    print(f"  Gateway status: {status}")
print(f"Gateway is {status} \u2713" if status == "READY" else f"\u274c Gateway: {status}")

# Define the OpenAPI spec for Microsoft Graph endpoints
openapi_spec = json.dumps(
    {
        "openapi": "3.0.0",
        "info": {"title": "Microsoft Graph Calendar API", "version": "1.0"},
        "servers": [{"url": "https://graph.microsoft.com/v1.0"}],
        "paths": {
            "/me/calendarview": {
                "get": {
                    "operationId": "listCalendarEvents",
                    "summary": "List calendar events for the current user within a date range",
                    "parameters": [
                        {
                            "name": "startDateTime",
                            "in": "query",
                            "required": True,
                            "schema": {"type": "string"},
                            "description": "Start date/time in ISO 8601 format (e.g. 2025-01-01T00:00:00Z)",
                        },
                        {
                            "name": "endDateTime",
                            "in": "query",
                            "required": True,
                            "schema": {"type": "string"},
                            "description": "End date/time in ISO 8601 format (e.g. 2025-01-02T00:00:00Z)",
                        },
                    ],
                    "responses": {"200": {"description": "Calendar events"}},
                }
            },
            "/me/messages": {
                "get": {
                    "operationId": "listUserMails",
                    "summary": "List recent email messages for the current user",
                    "parameters": [
                        {
                            "name": "top",
                            "in": "query",
                            "required": False,
                            "schema": {"type": "integer"},
                            "description": "Number of messages to return",
                        },
                        {
                            "name": "select",
                            "in": "query",
                            "required": False,
                            "schema": {"type": "string"},
                            "description": "Comma-separated list of fields to return",
                        },
                    ],
                    "responses": {"200": {"description": "Email messages"}},
                }
            },
            "/me": {
                "get": {
                    "operationId": "getMyProfile",
                    "summary": "Get the current user profile information",
                    "responses": {"200": {"description": "User profile"}},
                }
            },
        },
    }
)

# Create the Gateway target with OBO outbound auth
target_response = agentcore_control_client.create_gateway_target(
    gatewayIdentifier=gateway_id,
    name="microsoft-graph-obo",
    description="Microsoft Graph API with OBO token exchange",
    targetConfiguration={"mcp": {"openApiSchema": {"inlinePayload": openapi_spec}}},
    credentialProviderConfigurations=[
        {
            "credentialProviderType": "OAUTH",
            "credentialProvider": {
                "oauthCredentialProvider": {
                    "providerArn": microsoft_provider["credentialProviderArn"],
                    "scopes": ["https://graph.microsoft.com/.default"],
                    "grantType": "TOKEN_EXCHANGE",
                    "customParameters": {"requested_token_use": "on_behalf_of"},
                }
            },
        }
    ],
)
target_id = target_response["targetId"]
print(f"Target created \u2713  ID: {target_id}")
print(f"Target name: {target_response['name']}")
```

### Step 3c: Wait for Target

Wait for the Target to reach `READY` status.

```python
# Wait for Target to become READY
target_end_statuses = [
    "READY",
    "FAILED",
    "UPDATE_UNSUCCESSFUL",
    "SYNCHRONIZE_UNSUCCESSFUL",
]
target_status = "CREATING"

print("Waiting for Target to become READY...")
while target_status not in target_end_statuses:
    time.sleep(10)
    tgt = agentcore_control_client.get_gateway_target(gatewayIdentifier=gateway_id, targetId=target_id)
    target_status = tgt["status"]
    print(f"  Target status: {target_status}")

if target_status == "READY":
    print("\nTarget is READY \u2713")
else:
    print(f"\n\u274c Target ended in status: {target_status}")
```

```python
# Get the Gateway MCP URL
gateway_details = agentcore_control_client.get_gateway(gatewayIdentifier=gateway_id)
gateway_mcp_url = gateway_details.get("gatewayUrl", "")
print(f"Gateway MCP URL: {gateway_mcp_url}")
```

---
## Step 4: Get an Entra ID Access Token

This cell starts an environment-aware callback server, opens the Entra ID login page in your browser, and automatically captures the token when you sign in. No copy-paste needed.

### Environment-Aware OAuth2 Callback Server

The `token_callback_server.py` automatically adapts to different execution environments:

**Local Development:**
- External Callback URL: `http://localhost:9090/oauth2/callback` (browser-accessible)
- Internal Communication: `http://localhost:9090` (notebook ↔ server)
- Server Binding: `127.0.0.1` (localhost only, secure)

**SageMaker Workshop Studio:**
- External Callback URL: `https://<domain>.studio.<region>.sagemaker.aws/proxy/9090/oauth2/callback` (browser-accessible via proxy)
- Internal Communication: `http://localhost:9090` (notebook ↔ server in same container)
- Server Binding: `0.0.0.0` (allows SageMaker proxy to reach server)

The server detects the environment by checking for `/opt/ml/metadata/resource-metadata.json` and configures itself accordingly.

> ⚠️ **Register the callback URL with Entra ID:** The redirect URI in your Entra ID app registration (Step 1.6) must match the callback URL for your environment. For local development use `http://localhost:9090/oauth2/callback`. For SageMaker, use the proxy URL printed by the cell below.

```python
import subprocess
import webbrowser
import base64
import sys
from token_callback_server import (
    is_server_running,
    get_callback_url,
    wait_for_server_ready,
    wait_for_token,
)

bearer_token = None

# Start the token callback server if not already running
if is_server_running():
    print("Token callback server already running, skipping start...")
else:
    server_cmd = [
        sys.executable,
        "token_callback_server.py",
        tenant_id,
        client_id,
        os.environ["MICROSOFT_CLIENT_SECRET"],
    ]
    server_process = subprocess.Popen(server_cmd)
    if not wait_for_server_ready():
        print("\u274c Failed to start token callback server")
    else:
        print("Token callback server started \u2713")

# Build authorize URL using the environment-aware callback URL
callback_url = get_callback_url()
authorize_url = (
    f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/authorize?"
    f"client_id={client_id}&response_type=code&"
    f"redirect_uri={urllib.parse.quote(callback_url)}&"
    f"scope={urllib.parse.quote(f'api://{client_id}/access_as_user openid profile email')}"
)

print(f"Callback URL: {callback_url}")
print("Opening browser for Microsoft sign-in...")
webbrowser.open(authorize_url)
print("Waiting for sign-in (up to 2 minutes)...")

bearer_token = wait_for_token(timeout=120)

if bearer_token:
    payload = bearer_token.split(".")[1]
    payload += "=" * (4 - len(payload) % 4)
    claims = json.loads(base64.urlsafe_b64decode(payload))
    print(f"\n\u2705 Token captured for: {claims.get('name', 'unknown')}")
    print(f"   aud: {claims['aud']}")
    print(f"   scp: {claims.get('scp', 'N/A')}")
    print(f"   iss: {claims['iss']}")
    print(f"   ver: {claims['ver']}")
else:
    print("\u274c Timed out. Run this cell again.")
```

---
## Step 5: Run the Agent

This is the entire agent — just a few lines. The `MCPClient` connects to the Gateway, discovers the MCP tools (profile, calendar, email), and the Strands Agent uses them to answer the user's question.

**No `@requires_access_token`, no custom tools, no callback server, no Docker.**

> 💡 The `getMyProfile` tool works with all account types. The `listCalendarEvents` and `listUserMails` tools require a work/school account with an Exchange Online mailbox.

```python
from strands import Agent
from strands.tools.mcp import MCPClient
from mcp.client.streamable_http import streamablehttp_client

# Connect to the AgentCore Gateway as an MCP server
mcp_client = MCPClient(
    lambda: streamablehttp_client(gateway_mcp_url, headers={"Authorization": f"Bearer {bearer_token}"})
)

with mcp_client:
    # The Gateway provides MCP tools: listCalendarEvents, listUserMails, getMyProfile
    tools = mcp_client.list_tools_sync()
    print(f"Discovered {len(tools)} MCP tools from Gateway:")
    for t in tools:
        print(f"  - {t.tool_name}")

    agent = Agent(
        model="us.anthropic.claude-haiku-4-5-20251001-v1:0",
        tools=tools,
        system_prompt="You are a Microsoft 365 assistant. Use the available tools to help users with their Microsoft profile, Outlook calendar, and email.",
    )

    response = agent("What is my Microsoft profile information?")
    print(response)
```

### Step 5b: Compare User Token vs OBO Token

The OBO exchange transforms the token in two critical ways:

| | User Token (before OBO) | OBO Token (after OBO) |
|---|---|---|
| **Audience (`aud`)** | Your app: `api://<client-id>` | Microsoft Graph: `https://graph.microsoft.com` |
| **Scopes (`scp`)** | `access_as_user` | `Calendars.Read Mail.Read User.Read` |
| **Identity** | User's identity | Same user — preserved through delegation |

The OBO token also carries a **delegation chain** via the `xms_st` claim, which contains the original user's `sub` from the inbound token. This is how Microsoft Graph knows the request comes from an app acting **on behalf of** a specific user, not the app itself.

Let's decode both tokens and see the difference:

```python
import requests as req

# Perform the OBO exchange manually to see the resulting token
obo_resp = req.post(
    f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token",
    data={
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "client_id": client_id,
        "client_secret": os.environ["MICROSOFT_CLIENT_SECRET"],
        "assertion": bearer_token,
        "scope": "https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/User.Read",
        "requested_token_use": "on_behalf_of",
    },
)


def decode_jwt(token):
    payload = token.split(".")[1]
    payload += "=" * (4 - len(payload) % 4)
    return json.loads(base64.urlsafe_b64decode(payload))


obo_token = obo_resp.json().get("access_token", "")
if not obo_token:
    print(f"OBO exchange failed: {obo_resp.json()}")
else:
    user_claims = decode_jwt(bearer_token)
    obo_claims = decode_jwt(obo_token)

    print(f"{'CLAIM':<20} {'USER TOKEN (app-scoped)':<40} {'OBO TOKEN (Graph-scoped)'}")
    print("=" * 100)
    for f in ["aud", "iss", "ver", "scp", "appid", "name", "email", "idp", "oid"]:
        uv = str(user_claims.get(f, "\u2014"))[:38]
        ov = str(obo_claims.get(f, "\u2014"))[:38]
        changed = " \u2190 CHANGED" if uv != ov else ""
        print(f"{f:<20} {uv:<40} {ov}{changed}")

    # Show the delegation claim
    xms_st = obo_claims.get("xms_st", {})
    print("\n\u2705 OBO delegation chain:")
    print(f"   xms_st.sub (original user): {xms_st.get('sub', 'N/A')}")
    print(f"   appid (acting app):         {obo_claims.get('appid', 'N/A')}")
    print(f"   app_displayname:            {obo_claims.get('app_displayname', 'N/A')}")
```

---
## Cleanup (Optional)

Uncomment and run to delete resources.

**Also delete manually:**
- Microsoft Entra ID app registration from the Entra portal
- IAM role (`agentcore-obo-gateway-role`) from IAM Console

```python
# # Delete the Gateway target
# agentcore_control_client.delete_gateway_target(
#     gatewayIdentifier=gateway_id,
#     targetId=target_id
# )
# print("Gateway target deleted \u2713")

# # Delete the Gateway
# agentcore_control_client.delete_gateway(gatewayIdentifier=gateway_id)
# print("Gateway deleted \u2713")

# # Delete the credential provider
# identity_client.delete_oauth2_credential_provider(name="microsoft-obo-provider")
# print("Credential provider deleted \u2713")

# # Delete the IAM role
# iam_client.delete_role_policy(RoleName=gateway_role_name, PolicyName="GatewayOBOPolicy")
# iam_client.delete_role(RoleName=gateway_role_name)
# print("IAM role deleted \u2713")
```

## Congratulations! 🎉

You built a Strands agent that accesses Microsoft Graph API through AgentCore Gateway with OBO token exchange — using **Entra ID directly** for end-to-end authentication. The agent code has **zero token handling logic** — the Gateway handles everything transparently.

### What you accomplished:
- Registered an app in **Microsoft Entra ID** with OBO-compatible scopes and exposed an API
- Created a **Custom OAuth2 credential provider** with `JWT_AUTHORIZATION_GRANT` OBO config
- Set up an **AgentCore Gateway** with Entra ID v1.0 OIDC inbound auth and OpenAPI schema target
- Configured the target with `TOKEN_EXCHANGE` grant type and `requested_token_use: on_behalf_of` custom parameter
- Authenticated directly with **Entra ID** to get an app-scoped access token
- Connected a **Strands agent** to the Gateway MCP URL and discovered tools automatically
- Queried your **Microsoft profile** through the agent — all auth handled by the Gateway via OBO

### Key learnings:
- The Gateway's **inbound auth discovery URL must match the token version** (v1.0 by default for Entra ID)
- Do **not** use `allowedClients` in the Gateway authorizer config for Entra ID v1.0 tokens
- The `customParameters` with `requested_token_use: on_behalf_of` is **required** for Entra ID's OBO endpoint
- The IAM role uses the same `bedrock-agentcore:*` pattern as other Gateway tutorials (via shared `utils.create_agentcore_gateway_role`)
- Personal accounts work for `/me` profile; calendar/email endpoints require a work/school account with Exchange Online

### Next steps:
- Use a **work/school account** to test calendar and email tools
- Add more Microsoft Graph endpoints to the OpenAPI schema (e.g., OneDrive, Teams)
- Try different agent prompts: "What meetings do I have this week?", "List my recent emails"
- Explore the [OBO Token Exchange docs](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/on-behalf-of-token-exchange.html) and [Gateway Outbound Auth docs](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-outbound-auth.html)
