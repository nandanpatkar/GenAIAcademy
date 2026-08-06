Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. SPDX-License-Identifier: Apache-2.0

# AWS for SAP MCP Server as AgentCore Gateway Target

## Overview

This notebook walks through adding the [AWS for SAP MCP Server](https://docs.aws.amazon.com/mcp-sap/latest/awsforsapmcp/introduction.html) as an MCP target on [Amazon Bedrock AgentCore Gateway](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html). The SAP MCP Server provides AI agents with structured, protocol-driven access to SAP S/4HANA and SAP ECC OData V2 services.

| Information | Details |
|:---|:---|
| Target type | MCP Server Target |
| SAP MCP Server | [AWS for SAP MCP Server](https://docs.aws.amazon.com/mcp-sap/latest/awsforsapmcp/introduction.html) |
| Communication | Streamable HTTP (`/mcp` endpoint) |
| Outbound auth | CustomOauth2 (SAP MCP Server Cognito) |
| Inbound auth | Amazon Cognito (M2M) |
| Tools exposed | 9 (5 read + 4 write, read-only by default) |
| Default mode | Read-only (write operations disabled unless explicitly enabled) |

### Prerequisites

Before starting this notebook, you need:

1. **AWS account** with access to Amazon Bedrock AgentCore
2. **AWS for SAP MCP Server** deployed — see [Getting Started](https://docs.aws.amazon.com/mcp-sap/latest/awsforsapmcp/getting-started.html)
3. **SAP MCP Server endpoint URL** and **Cognito credentials** for M2M authentication
4. **Python 3.11+** with Jupyter kernel
5. **AWS CLI** configured with appropriate credentials

You can either create a new gateway here or reuse the one created in [01-salesforce-gateway-target.ipynb](01-salesforce-gateway-target.ipynb).

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
# Collect SAP MCP Server credentials
SAP_MCP_ENDPOINT = input("Enter the SAP MCP Server endpoint URL (e.g., https://<runtime-url>/mcp): ")
SAP_TOKEN_ENDPOINT = input("Enter the SAP MCP Server Cognito token endpoint: ")
SAP_CLIENT_ID = input("Enter the SAP MCP Server Client ID: ")
SAP_CLIENT_SECRET = getpass.getpass("Enter the SAP MCP Server Client Secret: ")
SAP_SCOPE = input("Enter the OAuth scope (e.g., <resource-server-id>/invoke): ")

assert SAP_MCP_ENDPOINT.strip(), "SAP MCP endpoint cannot be empty"
assert SAP_TOKEN_ENDPOINT.strip(), "Token endpoint cannot be empty"
assert SAP_CLIENT_ID.strip(), "Client ID cannot be empty"
assert SAP_CLIENT_SECRET.strip(), "Client Secret cannot be empty"

print(f"\nSAP MCP endpoint: {SAP_MCP_ENDPOINT}")
print(f"Token endpoint: {SAP_TOKEN_ENDPOINT}")
```

## AWS for SAP MCP Server — Architecture

The [AWS for SAP MCP Server](https://docs.aws.amazon.com/mcp-sap/latest/awsforsapmcp/introduction.html) runs on Amazon Bedrock AgentCore Runtime and provides AI agents with access to SAP S/4HANA and SAP ECC OData V2 services.

**Key characteristics:**
- Communicates via **Streamable HTTP** on a `/mcp` endpoint
- **Read-only by default** — write operations require explicit opt-in
- Credentials are **never stored on disk** — retrieved at runtime from AWS Secrets Manager
- Supports **Basic Auth** or **OAuth 2.0** for outbound SAP authentication
- See [Getting Started](https://docs.aws.amazon.com/mcp-sap/latest/awsforsapmcp/getting-started.html) for deployment options

### Available Tools

| Tool | Category | Description |
|---|---|---|
| `find_sap_services` | Read | Discover available SAP OData services from the catalog |
| `get_metadata` | Read | Retrieve OData service metadata (entity types, properties) |
| `get_service_hints` | Read | Get usage guidance for specific services |
| `odata_read` | Read | Read data from SAP OData entity sets with filtering |
| `odata_count` | Read | Count records in an entity set (use before reads) |
| `odata_create` | Write | Create new entity records (deep insert supported) |
| `odata_update` | Write | Update existing entity records |
| `odata_delete` | Write | Delete entity records |
| `odata_function_import` | Write | Execute custom backend logic |

> **Security:** Write tools are only registered when explicitly enabled in the SAP MCP Server configuration. Follow the principle of least privilege — only enable the specific write operations your use case requires.

```python
# Test SAP MCP Server authentication
sap_token = gateway_mcp_client.get_cognito_m2m_token(
    token_endpoint=SAP_TOKEN_ENDPOINT,
    client_id=SAP_CLIENT_ID,
    client_secret=SAP_CLIENT_SECRET,
    scope=SAP_SCOPE,
)
print(f"✓ SAP MCP Server token obtained ({len(sap_token)} chars)")
```

## Step 2: Connect to Existing Gateway

This notebook adds the SAP target to the **same gateway** created in [01-salesforce-gateway-target.ipynb](01-salesforce-gateway-target.ipynb). Provide the Gateway ID from notebook 01.

```python
# Connect to the gateway created in notebook 01
gateway_client = boto3.client("bedrock-agentcore-control", region_name=REGION)

try:
    # If running in same kernel as NB01, GATEWAY_ID is already set
    _ = GATEWAY_ID
except NameError:
    GATEWAY_ID = input("Enter Gateway ID from notebook 01: ").strip()

# Look up all gateway details from the API
gw = gateway_client.get_gateway(gatewayIdentifier=GATEWAY_ID)
GATEWAY_URL = gw["gatewayUrl"]
GATEWAY_NAME = gw["name"]

# Get Cognito details from the authorizer config
authorizer = gw["authorizerConfiguration"]["customJWTAuthorizer"]
DISCOVERY_URL = authorizer["discoveryUrl"]
GW_CLIENT_ID = authorizer["allowedClients"][0]

# Derive token endpoint and scope from the discovery URL / gateway name
# Discovery URL format: https://cognito-idp.<region>.amazonaws.com/<pool-id>/.well-known/openid-configuration
pool_id = DISCOVERY_URL.split("/")[3]
cognito_client = boto3.client("cognito-idp", region_name=REGION)
pool_clients = cognito_client.list_user_pool_clients(UserPoolId=pool_id, MaxResults=10)
client_info = cognito_client.describe_user_pool_client(
    UserPoolId=pool_id, ClientId=GW_CLIENT_ID
)["UserPoolClient"]
GW_CLIENT_SECRET = client_info.get("ClientSecret", "")

# Get domain for token endpoint
pool_desc = cognito_client.describe_user_pool(UserPoolId=pool_id)["UserPool"]
COGNITO_DOMAIN = pool_desc.get("Domain", "")
TOKEN_ENDPOINT = f"https://{COGNITO_DOMAIN}.auth.{REGION}.amazoncognito.com/oauth2/token"

# Get scope from allowed scopes
FULL_SCOPE = client_info.get("AllowedOAuthScopes", [""])[0]

print(f"✓ Connected to gateway: {GATEWAY_NAME}")
print(f"  Gateway ID:  {GATEWAY_ID}")
print(f"  Gateway URL: {GATEWAY_URL}")
print(f"  Region:      {REGION}")
```

## Step 3: Create SAP Credential Provider

Register the SAP MCP Server's OAuth2 credentials with AgentCore Identity so the gateway can authenticate outbound requests.

```python
SAP_CREDENTIAL_PROVIDER_NAME = f"sap-mcp-oauth-{str(uuid.uuid4())[:8]}"

cred_resp = gateway_client.create_oauth2_credential_provider(
    name=SAP_CREDENTIAL_PROVIDER_NAME,
    credentialProviderVendor="CustomOauth2",
    oauth2ProviderConfigInput={
        "customOauth2ProviderConfig": {
            "clientId": SAP_CLIENT_ID,
            "clientSecret": SAP_CLIENT_SECRET,
            "oauthDiscovery": {
                "authorizationServerMetadata": {
                    "issuer": SAP_TOKEN_ENDPOINT.replace("/oauth2/token", ""),
                    "authorizationEndpoint": SAP_TOKEN_ENDPOINT.replace("/token", "/authorize"),
                    "tokenEndpoint": SAP_TOKEN_ENDPOINT,
                }
            },
        }
    },
)

SAP_CREDENTIAL_PROVIDER_ARN = cred_resp["credentialProviderArn"]
print(f"Created SAP credential provider: {SAP_CREDENTIAL_PROVIDER_NAME}")
print(f"ARN: {SAP_CREDENTIAL_PROVIDER_ARN}")
```

## Step 4: Add SAP MCP Server as Gateway Target

We add the SAP MCP Server as an MCP server target on the gateway. This tells the gateway to proxy MCP requests to the SAP MCP Server endpoint.

```python
SAP_TARGET_NAME = "sap-target"

target_resp = gateway_client.create_gateway_target(
    gatewayIdentifier=GATEWAY_ID,
    name=SAP_TARGET_NAME,
    targetConfiguration={
        "mcp": {
            "mcpServer": {
                "endpoint": SAP_MCP_ENDPOINT,
            }
        }
    },
    credentialProviderConfigurations=[
        {
            "credentialProviderType": "OAUTH",
            "credentialProvider": {
                "oauthCredentialProvider": {
                    "providerArn": SAP_CREDENTIAL_PROVIDER_ARN,
                    "scopes": [],
                    "grantType": "CLIENT_CREDENTIALS",
                }
            },
        }
    ],
)

SAP_TARGET_ID = target_resp["targetId"]
print(f"Created SAP target: {SAP_TARGET_NAME} ({SAP_TARGET_ID})")
print("Waiting for target to reach READY status...")
```

```python
# Wait for target to become READY
gateway_mcp_client.wait_for_target_ready(
    client=gateway_client,
    gateway_id=GATEWAY_ID,
    target_name=SAP_TARGET_NAME,
    region=REGION,
    timeout=300,
)
print("\n✓ SAP MCP Server target is READY")
```

```python
# Set up gateway client for tool invocation
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

# Verify tools are accessible
all_tools = mcp.list_all_tools()
sap_tools = [t for t in all_tools if t["name"].startswith("sap-target___")]
print(f"Total tools on gateway: {len(all_tools)}")
print(f"SAP tools: {len(sap_tools)}")
print("\nSAP tool names:")
for t in sorted(sap_tools, key=lambda x: x["name"]):
    print(f"  - {t['name']}")
```

## Step 5: Query SAP Data via Gateway

Now that the SAP target is ready, let's read data from SAP through the gateway.

```python
# Query 1: Show the first 3 business partners
result = mcp.call_tool(
    "sap-target___odata_read",
    {
        "service_name": "API_BUSINESS_PARTNER",
        "entity_set": "A_BusinessPartner",
        "top": 3,
        "select": "BusinessPartner,BusinessPartnerFullName,BusinessPartnerCategory",
    },
)
print("=== First 3 SAP Business Partners ===")
content = result.get("result", {}).get("content", [])
for item in content:
    if item.get("type") == "text":
        try:
            data = json.loads(item["text"])
            for bp in data.get("data", data.get("results", [])):
                print(f"  {bp.get('BusinessPartner', '?'):>6}  {bp.get('BusinessPartnerFullName', '?')}")
        except json.JSONDecodeError:
            print(item["text"][:500])
```

```python
# Query 2: Count how many business partners exist
result = mcp.call_tool(
    "sap-target___odata_count",
    {
        "service_name": "API_BUSINESS_PARTNER",
        "entity_set": "A_BusinessPartner",
    },
)
print("=== Business Partner Count ===")
content = result.get("result", {}).get("content", [])
for item in content:
    if item.get("type") == "text":
        print(f"  Total business partners in SAP: {item['text']}")
```

## Step 6: Use Strands Agent with SAP Tools

Let a Strands Agent answer a business question using SAP data.

```python
from strands import Agent
from strands.tools.mcp import MCPClient
from mcp.client.streamable_http import streamablehttp_client

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
    "You are a helpful assistant with access to SAP ERP data. "
    "Use odata_read to query data. Keep answers concise."
)

with mcp_client:
    agent = Agent(
        model=MODEL_ID,
        system_prompt=SYSTEM_PROMPT,
        tools=mcp_client.list_tools_sync(),
    )
    result = agent(
        "Show me the first 3 sales orders from SAP with their amounts and currencies."
    )
    print(result)
```

## Best Practices

From the [AWS for SAP MCP Server documentation](https://docs.aws.amazon.com/mcp-sap/latest/awsforsapmcp/security.html):

1. **Read-only by default** — Write tools are disabled unless both global and per-operation flags are set to `true`. Only enable writes your use case requires.
2. **Principle of least privilege** — Assign the SAP user only the minimum necessary roles and authorizations.
3. **Scope OAuth access** — Configure OAuth scopes to grant access only to specific required OData services.
4. **Use odata_count before reads** — Understand data volume before issuing broad reads to avoid overwhelming the agent.
5. **Use get_metadata proactively** — SAP field names are non-obvious (e.g., `OverallOrdReltdBillgStatus` not `OverallBillingStatus`). Always check metadata before constructing filters.
6. **Credentials never stored on disk** — The MCP Server retrieves credentials at runtime from AWS Secrets Manager.

## Step 8: Clean Up

Delete resources created in this notebook. Skip if you plan to continue with [03-cross-isv-queries.ipynb](03-cross-isv-queries.ipynb).

```python
SKIP_CLEANUP = input("Skip cleanup to use gateway in notebook 03? (yes/no): ").strip().lower() == "yes"

if not SKIP_CLEANUP:
    # Delete SAP gateway target
    print("Deleting SAP gateway target...")
    gateway_client.delete_gateway_target(gatewayIdentifier=GATEWAY_ID, targetId=SAP_TARGET_ID)
    time.sleep(5)
    print("  ✓ SAP target deleted")

    # Delete SAP credential provider
    print("Deleting SAP credential provider...")
    gateway_client.delete_oauth2_credential_provider(name=SAP_CREDENTIAL_PROVIDER_NAME)
    print("  ✓ Credential provider deleted")

    if CREATED_GATEWAY:
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
else:
    print("\nSkipping cleanup. Remember to clean up resources when done!")
    print(f"  Gateway ID: {GATEWAY_ID}")
    print(f"  Gateway URL: {GATEWAY_URL}")
    print(f"  SAP Target ID: {SAP_TARGET_ID}")
```
