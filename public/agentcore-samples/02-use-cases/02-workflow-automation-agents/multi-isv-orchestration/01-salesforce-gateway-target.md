Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. SPDX-License-Identifier: Apache-2.0

# Salesforce Lightning Platform as AgentCore Gateway Target

## Overview

This notebook walks through adding **Salesforce Lightning Platform** as a gateway target on [Amazon Bedrock AgentCore Gateway](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html) using the [built-in Integration Provider Template](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-integrations.html#gateway-target-integrations-supported-apis-salesforce) and OAuth2 (`client_credentials` flow). Once configured, the gateway exposes Salesforce REST API operations (Account, Case, Contact, Lead, Opportunity, Campaign, etc.) as MCP tools that any agent can invoke.

| Information | Details |
|:---|:---|
| Target type | Integration Provider Template (Salesforce Lightning Platform) |
| Outbound auth | CustomOauth2 (Salesforce Connected App, client_credentials) |
| Inbound auth | Amazon Cognito (M2M) |
| Tools exposed | 43 Salesforce CRUD operations (Account, Case, Contact, Lead, Opportunity, Campaign, etc.) |
| Salesforce API version | v62.0 |

### Prerequisites

Before starting this notebook, you need:

1. **AWS account** with access to Amazon Bedrock AgentCore
2. **Salesforce Developer Edition org** — free at [developer.salesforce.com/signup](https://developer.salesforce.com/signup)
3. **Salesforce Connected App** configured for OAuth2 `client_credentials` flow (see Step 1 below)
4. **Python 3.11+** with Jupyter kernel
5. **AWS CLI** configured with credentials that have AgentCore permissions

```python
!pip install --force-reinstall -U -r requirements.txt --quiet
```

```python
import getpass
import json
import logging
import os
import time
import uuid

import boto3
import requests
from boto3.session import Session

import gateway_mcp_client

# AWS credentials — set your profile
os.environ["AWS_PROFILE"] = "default"  # Change to your profile

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    handlers=[logging.StreamHandler()],
)

session = Session()
REGION = session.region_name or "eu-west-1"
ACCOUNT_ID = boto3.client("sts").get_caller_identity()["Account"]

# Derive Bedrock model ID geo prefix from region
GEO_PREFIX = {"us-": "us", "eu-": "eu", "ap-": "ap", "ca-": "us", "sa-": "us"}
MODEL_PREFIX = next((v for k, v in GEO_PREFIX.items() if REGION.startswith(k)), "us")
MODEL_ID = f"{MODEL_PREFIX}.anthropic.claude-sonnet-4-6"

print(f"Using region: {REGION}")
print(f"AWS account: {ACCOUNT_ID}")
print(f"Model ID: {MODEL_ID}")
```

```python
# Collect Salesforce credentials (never hardcoded)
SF_DOMAIN = input("Enter your Salesforce domain (e.g., myorg-dev-ed): ").strip()
SF_CLIENT_ID = input("Enter your Salesforce Consumer Key (Client ID): ").strip()
SF_CLIENT_SECRET = getpass.getpass("Enter your Salesforce Consumer Secret: ").strip()

# Strip common suffixes if user pastes full URL
for suffix in [".develop.my.salesforce.com", ".my.salesforce.com", ".salesforce.com"]:
    if SF_DOMAIN.endswith(suffix):
        SF_DOMAIN = SF_DOMAIN.removesuffix(suffix)
if SF_DOMAIN.startswith("https://"):
    SF_DOMAIN = SF_DOMAIN.removeprefix("https://")

assert SF_DOMAIN, "Salesforce domain cannot be empty"
assert SF_CLIENT_ID, "Client ID cannot be empty"

# Security note: SF_DOMAIN is interpolated into the Salesforce target URL
# (https://{domainName}.develop.my.salesforce.com/...). In a production deployment,
# validate it against an allow-list of expected org domains to prevent an operator
# from redirecting tool calls to an attacker-controlled host (see threat T-006).
import re
assert re.fullmatch(r"[A-Za-z0-9-]+", SF_DOMAIN), "SF_DOMAIN must be a bare org domain (letters, digits, hyphens)"
assert SF_CLIENT_SECRET, "Client Secret cannot be empty"

print(f"\nSalesforce domain: {SF_DOMAIN}")
print(f"Token endpoint: https://{SF_DOMAIN}.develop.my.salesforce.com/services/oauth2/token")
```

## Step 1: Create a Salesforce Connected App

If you haven't already created a Connected App, follow these steps in your Salesforce org:

### Option A: Connected App (Classic)

1. Log in to Salesforce → Setup (gear icon → Setup)
2. Quick Find → **App Manager** → **New Connected App**
3. Enable OAuth Settings:
   - Callback URL: `https://bedrock-agentcore.<your-region>.amazonaws.com/identities/oauth2/callback`
   - OAuth Scopes: `Full access (full)`, `Perform requests at any time (refresh_token, offline_access)`, `Manage user data via APIs (api)`
4. Security settings:
   - ✅ Require Proof Key for Code Exchange (PKCE)
   - ✅ Require Secret for Web Server Flow
   - ✅ Enable Client Credentials Flow
5. Save → wait 2-10 minutes for propagation
6. **Critical:** App Manager → find your app → Manage → Edit Policies → Client Credentials Flow → set **Run As** to your admin username
7. Get Consumer Key + Consumer Secret from Manage Consumer Details

### Option B: External Client App (newer orgs)

1. Setup → **External Client App Manager** → New External Client App
2. Enable OAuth with same callback URL and scopes as above
3. Enable Client Credentials Flow with Run As user = admin username
4. Get Client ID and Secret from the app's OAuth settings page

> **Note:** Developer Edition orgs hibernate after ~24h of inactivity. If you get HTTP 420 errors, log into the Salesforce web UI to wake the org.

## Step 2: Verify Salesforce OAuth2 Token

Test that your credentials work before configuring the gateway.

```python
# Test Salesforce OAuth2 client_credentials flow
token_endpoint = f"https://{SF_DOMAIN}.develop.my.salesforce.com/services/oauth2/token"

resp = requests.post(
    token_endpoint,
    data={
        "grant_type": "client_credentials",
        "client_id": SF_CLIENT_ID,
        "client_secret": SF_CLIENT_SECRET,
    },
    headers={"Content-Type": "application/x-www-form-urlencoded"},
    timeout=30,
)

if resp.status_code == 200:
    sf_token_data = resp.json()
    print("✓ Salesforce OAuth2 token obtained successfully")
    print(f"  Token type: {sf_token_data.get('token_type')}")
    print(f"  Instance URL: {sf_token_data.get('instance_url')}")
else:
    print(f"✗ Failed to get token: {resp.status_code}")
    print(f"  Response: {resp.text}")
    raise RuntimeError("Fix your Salesforce credentials before proceeding")
```

## Step 3: Create AgentCore Gateway

This cell creates all gateway infrastructure in one shot: Cognito User Pool (inbound M2M auth), IAM role (with confused-deputy protection), and the gateway itself.

```python
GATEWAY_NAME = f"multi-isv-tutorial-{str(uuid.uuid4())[:8]}"
ACCOUNT_ID = boto3.client("sts").get_caller_identity()["Account"]
print(f"Gateway name: {GATEWAY_NAME}")
print(f"AWS account:  {ACCOUNT_ID}")

# --- Cognito User Pool (inbound auth) ---
cognito_client = boto3.client("cognito-idp", region_name=REGION)
pool_resp = cognito_client.create_user_pool(
    PoolName=f"{GATEWAY_NAME}-pool",
    Policies={"PasswordPolicy": {"MinimumLength": 8}},
)
USER_POOL_ID = pool_resp["UserPool"]["Id"]

COGNITO_DOMAIN = f"{GATEWAY_NAME}-domain"
cognito_client.create_user_pool_domain(Domain=COGNITO_DOMAIN, UserPoolId=USER_POOL_ID)
TOKEN_ENDPOINT = f"https://{COGNITO_DOMAIN}.auth.{REGION}.amazoncognito.com/oauth2/token"

RESOURCE_SERVER_ID = f"{GATEWAY_NAME}-id"
SCOPE_NAME = "invoke"
cognito_client.create_resource_server(
    UserPoolId=USER_POOL_ID,
    Identifier=RESOURCE_SERVER_ID,
    Name=f"{GATEWAY_NAME} Gateway",
    Scopes=[{"ScopeName": SCOPE_NAME, "ScopeDescription": "Invoke gateway"}],
)
FULL_SCOPE = f"{RESOURCE_SERVER_ID}/{SCOPE_NAME}"

app_resp = cognito_client.create_user_pool_client(
    UserPoolId=USER_POOL_ID,
    ClientName=f"{GATEWAY_NAME}-client",
    GenerateSecret=True,
    AllowedOAuthFlows=["client_credentials"],
    AllowedOAuthScopes=[FULL_SCOPE],
    AllowedOAuthFlowsUserPoolClient=True,
)
GW_CLIENT_ID = app_resp["UserPoolClient"]["ClientId"]
GW_CLIENT_SECRET = app_resp["UserPoolClient"]["ClientSecret"]
DISCOVERY_URL = f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/openid-configuration"
print(f"  ✓ Cognito pool + client created")

# --- IAM Role ---
iam = boto3.client("iam")
ROLE_NAME = f"agentcore-{GATEWAY_NAME}-role"
trust_policy = {
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Principal": {"Service": "bedrock-agentcore.amazonaws.com"},
        "Action": "sts:AssumeRole",
        "Condition": {
            "StringEquals": {"aws:SourceAccount": ACCOUNT_ID},
            "ArnLike": {"aws:SourceArn": f"arn:aws:bedrock-agentcore:{REGION}:{ACCOUNT_ID}:*"},
        },
    }],
}
role_resp = iam.create_role(
    RoleName=ROLE_NAME,
    AssumeRolePolicyDocument=json.dumps(trust_policy),
    Description="IAM role for AgentCore Gateway multi-ISV tutorial",
)
ROLE_ARN = role_resp["Role"]["Arn"]
iam.put_role_policy(
    RoleName=ROLE_NAME,
    PolicyName="AgentCorePolicy",
    PolicyDocument=json.dumps({
        "Version": "2012-10-17",
        "Statement": [
            {
                # Gateway runtime: manage/invoke gateways, targets, credential providers.
                # Kept at service-action level because the gateway/target/provider IDs are
                # created later (here and in NB02) and are not known at role-creation time.
                "Sid": "AgentCoreGatewayRuntime",
                "Effect": "Allow",
                "Action": ["bedrock-agentcore:*", "agent-credential-provider:*"],
                "Resource": f"arn:aws:bedrock-agentcore:{REGION}:{ACCOUNT_ID}:*",
            },
            {
                # Strands Agent inference (NB03) only calls InvokeModel on Claude Sonnet.
                "Sid": "BedrockInvokeModel",
                "Effect": "Allow",
                "Action": ["bedrock:InvokeModel"],
                "Resource": [
                    f"arn:aws:bedrock:{REGION}::foundation-model/anthropic.claude-*",
                    f"arn:aws:bedrock:{REGION}:{ACCOUNT_ID}:inference-profile/*.anthropic.claude-*",
                ],
            },
            {
                # Outbound ISV OAuth secrets are stored by AgentCore credential providers
                # under the bedrock-agentcore-* secret name prefix.
                "Sid": "ReadCredentialProviderSecrets",
                "Effect": "Allow",
                "Action": ["secretsmanager:GetSecretValue"],
                "Resource": f"arn:aws:secretsmanager:{REGION}:{ACCOUNT_ID}:secret:bedrock-agentcore-*",
            },
            {
                # Only this execution role is ever passed, and only to AgentCore.
                "Sid": "PassGatewayExecutionRole",
                "Effect": "Allow",
                "Action": ["iam:PassRole"],
                "Resource": ROLE_ARN,
                "Condition": {
                    "StringEquals": {"iam:PassedToService": "bedrock-agentcore.amazonaws.com"}
                },
            },
        ],
    }),
)
print(f"  ✓ IAM role created: {ROLE_NAME}")
time.sleep(10)

# --- Gateway ---
gateway_client = boto3.client("bedrock-agentcore-control", region_name=REGION)
gw_resp = gateway_client.create_gateway(
    name=GATEWAY_NAME,
    roleArn=ROLE_ARN,
    protocolType="MCP",
    authorizerType="CUSTOM_JWT",
    authorizerConfiguration={
        "customJWTAuthorizer": {
            "discoveryUrl": DISCOVERY_URL,
            "allowedClients": [GW_CLIENT_ID],
            "allowedScopes": [FULL_SCOPE],
        }
    },
)
GATEWAY_ID = gw_resp["gatewayId"]
GATEWAY_URL = gw_resp["gatewayUrl"]

print(f"  Waiting for gateway READY...")
for _ in range(60):
    status = gateway_client.get_gateway(gatewayIdentifier=GATEWAY_ID)["status"]
    if status == "READY":
        break
    if status == "FAILED":
        raise RuntimeError("Gateway creation failed")
    time.sleep(5)
else:
    raise TimeoutError("Gateway did not reach READY within 5 minutes")

print(f"\n{'='*60}")
print(f"  ✓ GATEWAY IS READY")
print(f"{'='*60}")
print(f"  Gateway name: {GATEWAY_NAME}")
print(f"  Gateway ID:   {GATEWAY_ID}")
print(f"  Gateway URL:  {GATEWAY_URL}")
print(f"{'='*60}")
```

## Step 4: Create CustomOauth2 Credential Provider

AgentCore Gateway needs OAuth2 credentials to authenticate to Salesforce on behalf of the agent.

> **Important:** Use `CustomOauth2` — NOT `SalesforceOauth2`. The built-in Salesforce vendor uses `login.salesforce.com` which does not support `client_credentials` on Developer Edition org domains. With `CustomOauth2`, we specify the org-specific token endpoint directly.

```python
CREDENTIAL_PROVIDER_NAME = f"{GATEWAY_NAME}-sf-oauth"

identity_client = boto3.client("bedrock-agentcore-control", region_name=REGION)

cred_resp = identity_client.create_oauth2_credential_provider(
    name=CREDENTIAL_PROVIDER_NAME,
    credentialProviderVendor="CustomOauth2",
    oauth2ProviderConfigInput={
        "customOauth2ProviderConfig": {
            "clientId": SF_CLIENT_ID,
            "clientSecret": SF_CLIENT_SECRET,
            "oauthDiscovery": {
                "discoveryUrl": f"https://{SF_DOMAIN}.develop.my.salesforce.com/.well-known/openid-configuration",
            },
        }
    },
)

CREDENTIAL_PROVIDER_ARN = cred_resp["credentialProviderArn"]
print(f"Created credential provider: {CREDENTIAL_PROVIDER_NAME}")
print(f"ARN: {CREDENTIAL_PROVIDER_ARN}")
```

```python
# Summary — copy these values for the Console step and for notebooks 02/03
print(f"""
{'='*60}
  CONNECTION DETAILS (save for notebooks 02 + 03)
{'='*60}
  Gateway name:           {GATEWAY_NAME}
  Gateway ID:             {GATEWAY_ID}
  Gateway URL:            {GATEWAY_URL}
  Cognito token endpoint: {TOKEN_ENDPOINT}
  Cognito client ID:      {GW_CLIENT_ID}
  Cognito client secret:  <retrieve via: aws cognito-idp describe-user-pool-client --user-pool-id {USER_POOL_ID} --client-id {GW_CLIENT_ID}>
  OAuth scope:            {FULL_SCOPE}
  Credential provider:    {CREDENTIAL_PROVIDER_NAME}
{'='*60}

  FOR THE CONSOLE STEP (Step 5):
  - Gateway:    {GATEWAY_NAME}
  - Target name: salesforce-target
  - Server URL:  https://{{domainName}}.develop.my.salesforce.com/services/data/v62.0
  - Credential provider: {CREDENTIAL_PROVIDER_NAME}
{'='*60}
""")
```

## Step 5: Add Salesforce as Gateway Target (Console)

The Salesforce integration uses the **built-in Integration Provider Template** — a pre-defined OpenAPI schema managed by AgentCore. This target type can only be created via the [AWS Management Console](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-integrations.html#gateway-target-integrations-supported-apis-salesforce).

### Steps:

1. Open the [AgentCore Gateway console](https://console.aws.amazon.com/bedrock-agentcore/home#/gateways)
2. Select your gateway (`GATEWAY_NAME` printed above)
3. Click **Add target**
4. Select **Integration provider template** → **Salesforce Lightning Platform**
5. Configure:
   - **Target name:** `salesforce-target`
   - **Server URL:** `https://{domainName}.develop.my.salesforce.com/services/data/v62.0`
   - **Authentication:** OAuth2
   - **Credential provider:** Select the credential provider created above
6. Click **Create target**
7. Wait for target status to become **READY** (1–2 minutes)

Once the target is READY, run the next cell to verify.

```python
# Verify the Salesforce target is READY
SF_TARGET_NAME = "salesforce-target"

gateway_mcp_client.wait_for_target_ready(
    client=gateway_client,
    gateway_id=GATEWAY_ID,
    target_name=SF_TARGET_NAME,
    region=REGION,
    timeout=300,
)

# Get the target ID for cleanup later
targets = gateway_client.list_gateway_targets(gatewayIdentifier=GATEWAY_ID)
SF_TARGET_ID = next(
    t["targetId"] for t in targets["items"] if t["name"] == SF_TARGET_NAME
)
print(f"✓ Salesforce target is READY (ID: {SF_TARGET_ID})")
```

## Step 6: List Salesforce Tools via Gateway

Now that the target is ready, we can list all available Salesforce tools through the gateway's MCP endpoint.

```python
# Get a gateway access token
def get_gw_token() -> str:
    return gateway_mcp_client.get_cognito_m2m_token(
        token_endpoint=TOKEN_ENDPOINT,
        client_id=GW_CLIENT_ID,
        client_secret=GW_CLIENT_SECRET,
        scope=FULL_SCOPE,
    )

mcp = gateway_mcp_client.GatewayMCPClient(
    gateway_url=GATEWAY_URL,
    get_token=get_gw_token,
    session_id=str(uuid.uuid4()),
)

# List all tools (handles pagination automatically)
all_tools = mcp.list_all_tools()
sf_tools = [t for t in all_tools if t["name"].startswith("salesforce-target___")]

print(f"Total tools on gateway: {len(all_tools)}")
print(f"Salesforce tools: {len(sf_tools)}")
print("\nSalesforce tool names:")
for t in sorted(sf_tools, key=lambda x: x["name"]):
    print(f"  - {t['name']}")
```

## Step 7: Invoke Salesforce Tools

Let's invoke Salesforce tools through the gateway.

> **Important:** Every Salesforce tool call requires the `domainName` parameter. Without it, the gateway resolves to a non-existent default domain.

```python
# Query accounts using SOQL
result = mcp.call_tool(
    "salesforce-target___queryAccounts",
    {"domainName": SF_DOMAIN, "q": "SELECT Id, Name, Industry FROM Account LIMIT 5"},
)
print("=== Salesforce Accounts ===")
content = result.get("result", {}).get("content", [])
for item in content:
    if item.get("type") == "text":
        data = json.loads(item["text"])
        print(f"  Total records: {data.get('totalSize', '?')}\n")
        for rec in data.get("records", []):
            print(f"  {rec.get('Name', '?'):40s} Industry: {rec.get('Industry', 'N/A')}")
```

```python
# Get account list (returns recently viewed accounts)
result = mcp.call_tool(
    "salesforce-target___getAccountList",
    {"domainName": SF_DOMAIN},
)
print("=== Recently Viewed Accounts ===")
content = result.get("result", {}).get("content", [])
for item in content:
    if item.get("type") == "text":
        data = json.loads(item["text"])
        for rec in data.get("recentItems", data.get("records", []))[:5]:
            print(f"  {rec.get('Name', rec.get('Id', '?'))}")
```

```python
# Create a test account
# Content-Type is a restricted header managed by the gateway — pass "" to avoid duplication
result = mcp.call_tool(
    "salesforce-target___createAccount",
    {
        "domainName": SF_DOMAIN,
        "Content-Type": "",
        "Name": "AgentCore Tutorial Test Account",
        "Industry": "Technology",
        "Description": "Created by AgentCore Gateway multi-ISV tutorial",
    },
)
print("=== Create Account ===")
content = result.get("result", {}).get("content", [])
for item in content:
    if item.get("type") == "text":
        data = json.loads(item["text"])
        if data.get("success"):
            print(f"  ✓ Account created: {data['id']}")
        else:
            print(f"  ✗ Failed: {data.get('errors', data)}")
```

```python
# Describe an SObject to see available fields
result = mcp.call_tool(
    "salesforce-target___describeSObject",
    {"domainName": SF_DOMAIN, "sObject": "Account"},
)
print("=== Account SObject Fields ===")
content = result.get("result", {}).get("content", [])
for item in content:
    if item.get("type") == "text":
        data = json.loads(item["text"])
        fields = data.get("fields", [])
        print(f"  Total fields: {len(fields)}\n  First 10:")
        for f in fields[:10]:
            print(f"    {f['name']:30s} ({f['type']})")
```

## Step 8: Use Strands Agent with Salesforce Tools

Now let's connect a Strands Agent to the gateway and let it use Salesforce tools via natural language.

```python
from strands import Agent
from strands.tools.mcp import MCPClient
from mcp.client.streamable_http import streamablehttp_client

# Connect to gateway via MCP
mcp_client = MCPClient(
    lambda: streamablehttp_client(
        url=GATEWAY_URL,
        headers={
            "Authorization": f"Bearer {get_gw_token()}",
            "MCP-Protocol-Version": "2025-03-26",
        },
    )
)

SYSTEM_PROMPT = (
    "You are a helpful assistant with access to Salesforce tools. "
    f"Always include domainName='{SF_DOMAIN}' in every Salesforce tool call. "
    "Use queryAccounts with SOQL for listing accounts rather than getAccountList."
)

with mcp_client:
    agent = Agent(
        model=MODEL_ID,
        system_prompt=SYSTEM_PROMPT,
        tools=mcp_client.list_tools_sync(),
    )
    result = agent("List all Salesforce accounts with their industry")
    print(result)
```

## Step 9: Clean Up

Delete all resources created in this notebook.

```python
# Delete test data created in Salesforce
print("Cleaning up Salesforce test data...")
try:
    query_result = mcp.call_tool(
        "salesforce-target___queryAccounts",
        {"domainName": SF_DOMAIN, "q": "SELECT Id FROM Account WHERE Name = 'AgentCore Tutorial Test Account'"},
    )
    content = query_result.get("result", {}).get("content", [])
    for item in content:
        if item.get("type") == "text":
            data = json.loads(item["text"])
            for record in data.get("records", []):
                mcp.call_tool(
                    "salesforce-target___deleteAccount",
                    {"domainName": SF_DOMAIN, "Content-Type": "", "accountId": record["Id"]},
                )
                print(f"  ✓ Deleted test account {record['Id']}")
except Exception as e:
    print(f"  (Could not clean up SF test data: {e})")

# Delete gateway target
print("Deleting Salesforce gateway target...")
gateway_client.delete_gateway_target(
    gatewayIdentifier=GATEWAY_ID,
    targetId=SF_TARGET_ID,
)
time.sleep(5)
print("  ✓ Target deleted")

# Delete credential provider
print("Deleting credential provider...")
identity_client.delete_oauth2_credential_provider(name=CREDENTIAL_PROVIDER_NAME)
print("  ✓ Credential provider deleted")

# Delete gateway
print("Deleting gateway...")
gateway_client.delete_gateway(gatewayIdentifier=GATEWAY_ID)
time.sleep(5)
print("  ✓ Gateway deleted")

# Delete Cognito resources
print("Deleting Cognito resources...")
cognito_client.delete_user_pool_domain(Domain=COGNITO_DOMAIN, UserPoolId=USER_POOL_ID)
cognito_client.delete_user_pool(UserPoolId=USER_POOL_ID)
print("  ✓ Cognito pool deleted")

# Delete IAM role (must remove inline policy first)
print("Deleting IAM role...")
iam.delete_role_policy(RoleName=ROLE_NAME, PolicyName="AgentCorePolicy")
iam.delete_role(RoleName=ROLE_NAME)
print("  ✓ IAM role deleted")

print("\n✓ All resources cleaned up")
```
