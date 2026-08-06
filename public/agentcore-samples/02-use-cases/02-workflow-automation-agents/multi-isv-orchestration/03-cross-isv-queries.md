Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. SPDX-License-Identifier: Apache-2.0

# Cross-ISV Queries: Salesforce + SAP via Single Gateway

## Overview

This notebook demonstrates the power of routing multiple ISV platforms through a single [Amazon Bedrock AgentCore Gateway](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html). With Salesforce (CRM) and SAP (ERP) connected to the same gateway, an AI agent can answer questions that span both systems. The user does not need to know which system holds which data.

**Use cases demonstrated:**
1. Customer 360 — combine SAP business partner data with Salesforce account history
2. Pipeline Reconciliation — compare Salesforce opportunities with SAP sales orders
3. Support Case with ERP Context — enrich Salesforce cases with SAP inventory data
4. Natural Language Agent — let Claude orchestrate cross-system queries autonomously

| Information | Details |
|:---|:---|
| Prerequisites | Both Salesforce + SAP targets READY on same gateway (from notebooks 01 + 02) |
| Tools available | ~52 (43 Salesforce + 9 SAP) |
| Agent framework | Strands Agents |
| LLM | Anthropic Claude Sonnet 4.6 (`us.anthropic.claude-sonnet-4-6`) |

### Prerequisites

This notebook assumes you have completed:
1. [01-salesforce-gateway-target.ipynb](01-salesforce-gateway-target.ipynb) — Salesforce target is READY
2. [02-sap-mcp-server-target.ipynb](02-sap-mcp-server-target.ipynb) — SAP target is READY

Both targets must be on the **same gateway**. You'll provide the gateway connection details below.

```python
!pip install --force-reinstall -U -r requirements.txt --quiet
```

```python
import getpass
import json
import logging
import os
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

# Derive Bedrock model ID geo prefix from region
GEO_PREFIX = {"us-": "us", "eu-": "eu", "ap-": "ap", "ca-": "us", "sa-": "us"}
MODEL_PREFIX = next((v for k, v in GEO_PREFIX.items() if REGION.startswith(k)), "us")
MODEL_ID = f"{MODEL_PREFIX}.anthropic.claude-sonnet-4-6"

print(f"Using region: {REGION}")
print(f"Model ID: {MODEL_ID}")
```

```python
# Connect to the gateway (auto-detect from kernel or enter ID)
gateway_client = boto3.client("bedrock-agentcore-control", region_name=REGION)

try:
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

pool_id = DISCOVERY_URL.split("/")[3]
cognito_client = boto3.client("cognito-idp", region_name=REGION)
client_info = cognito_client.describe_user_pool_client(
    UserPoolId=pool_id, ClientId=GW_CLIENT_ID
)["UserPoolClient"]
GW_CLIENT_SECRET = client_info.get("ClientSecret", "")

pool_desc = cognito_client.describe_user_pool(UserPoolId=pool_id)["UserPool"]
COGNITO_DOMAIN = pool_desc.get("Domain", "")
TOKEN_ENDPOINT = f"https://{COGNITO_DOMAIN}.auth.{REGION}.amazoncognito.com/oauth2/token"
FULL_SCOPE = client_info.get("AllowedOAuthScopes", [""])[0]

# Salesforce domain (needed for SF tool calls)
try:
    _ = SF_DOMAIN
except NameError:
    SF_DOMAIN = input("Enter Salesforce domain (e.g., myorg-dev-ed): ").strip()

print(f"✓ Connected to gateway: {GATEWAY_NAME}")
print(f"  Gateway URL: {GATEWAY_URL}")
print(f"  SF domain:   {SF_DOMAIN}")
```

```python
# Connect to the gateway
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

# List all tools from both targets
all_tools = mcp.list_all_tools()
sf_tools = [t for t in all_tools if t["name"].startswith("salesforce-target___")]
sap_tools = [t for t in all_tools if t["name"].startswith("sap-target___")]

print(f"Total tools: {len(all_tools)}")
print(f"  Salesforce: {len(sf_tools)}")
print(f"  SAP: {len(sap_tools)}")
print(f"  Other: {len(all_tools) - len(sf_tools) - len(sap_tools)}")
```

## Use Case 1: Customer 360

Combine customer data from both SAP (business partner master data) and Salesforce (CRM account history) to build a unified view.

**Pattern:** Query SAP for business partner details → Query Salesforce for account + opportunities

```python
# SAP: Get business partner data
sap_result = mcp.call_tool(
    "sap-target___odata_read",
    {
        "service_name": "API_BUSINESS_PARTNER",
        "entity_set": "A_BusinessPartner",
        "top": 5,
        "select": "BusinessPartner,BusinessPartnerFullName,BusinessPartnerCategory",
    },
)

print("=== SAP Business Partners ===")
content = sap_result.get("result", {}).get("content", [])
for item in content:
    if item.get("type") == "text":
        data = json.loads(item["text"])
        for bp in data.get("data", []):
            print(f"  {bp.get('BusinessPartner', '?'):>6}  {bp.get('BusinessPartnerFullName', '?'):40s}  Cat: {bp.get('BusinessPartnerCategory', '?')}")
```

```python
# Salesforce: Get accounts
sf_result = mcp.call_tool(
    "salesforce-target___queryAccounts",
    {
        "domainName": SF_DOMAIN,
        "q": "SELECT Id, Name, Industry, CreatedDate FROM Account LIMIT 5",
    },
)

print("=== Salesforce Accounts ===")
content = sf_result.get("result", {}).get("content", [])
for item in content:
    if item.get("type") == "text":
        data = json.loads(item["text"])
        for rec in data.get("records", []):
            print(f"  {rec.get('Name', '?'):40s} Industry: {rec.get('Industry', 'N/A')}")
```

## Use Case 2: Pipeline Reconciliation

Compare Salesforce opportunities (sales pipeline) with SAP sales orders to identify which deals have been converted to orders.

**Pattern:** Query Salesforce for open opportunities → Query SAP for matching sales orders

```python
# Salesforce: Get open opportunities
sf_opps = mcp.call_tool(
    "salesforce-target___queryAccounts",
    {
        "domainName": SF_DOMAIN,
        "q": "SELECT Id, Name, Amount, StageName, CloseDate FROM Opportunity WHERE IsClosed = false LIMIT 5",
    },
)

print("=== Salesforce Open Opportunities ===")
content = sf_opps.get("result", {}).get("content", [])
for item in content:
    if item.get("type") == "text":
        data = json.loads(item["text"])
        for rec in data.get("records", []):
            amt = rec.get("Amount", "N/A")
            print(f"  {rec.get('Name', '?'):40s} Stage: {rec.get('StageName', '?'):15s} Amount: {amt}")
```

```python
# SAP: Get recent sales orders
sap_orders = mcp.call_tool(
    "sap-target___odata_read",
    {
        "service_name": "API_SALES_ORDER_SRV",
        "entity_set": "A_SalesOrder",
        "top": 5,
        "select": "SalesOrder,SoldToParty,TotalNetAmount,TransactionCurrency,CreationDate",
    },
)

print("=== SAP Sales Orders ===")
content = sap_orders.get("result", {}).get("content", [])
for item in content:
    if item.get("type") == "text":
        data = json.loads(item["text"])
        for order in data.get("data", []):
            print(f"  Order {order.get('SalesOrder', '?'):>10}  Customer: {order.get('SoldToParty', '?'):>10}  Amount: {order.get('TotalNetAmount', '?')} {order.get('TransactionCurrency', '')}")
```

## Use Case 3: Support Case with ERP Context

When creating a support case in Salesforce, enrich it with relevant SAP data (e.g., material stock levels, order history).

**Pattern:** Query SAP for relevant data → Create enriched Salesforce case

```python
# SAP: Check available services for material/inventory
sap_services = mcp.call_tool(
    "sap-target___get_metadata",
    {"service_name": "API_MATERIAL_STOCK_SRV"},
)

print("=== SAP Material Stock Service Metadata ===")
content = sap_services.get("result", {}).get("content", [])
for item in content:
    if item.get("type") == "text":
        print(item["text"][:2000])
```

```python
# Salesforce: Create a case with ERP context
# Content-Type is a restricted header managed by the gateway — pass "" to avoid duplication
case_result = mcp.call_tool(
    "salesforce-target___createCase",
    {
        "domainName": SF_DOMAIN,
        "Content-Type": "",
        "Subject": "Stock Discrepancy - Cross-System Investigation",
        "Description": "Customer reported inventory mismatch. SAP material stock checked via AgentCore Gateway.",
        "Status": "New",
        "Priority": "Medium",
        "Origin": "Web",
    },
)

print("=== Created Salesforce Case ===")
content = case_result.get("result", {}).get("content", [])
for item in content:
    if item.get("type") == "text":
        data = json.loads(item["text"])
        if data.get("success"):
            print(f"  ✓ Case created: {data['id']}")
        else:
            print(f"  ✗ Failed: {data.get('errors', data)}")
```

## Use Case 4: Natural Language Agent (Cross-ISV)

Let a Strands Agent handle cross-system queries autonomously using all tools from both targets.

```python
from strands import Agent, tool

# Suppress verbose logging
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("strands").setLevel(logging.WARNING)

# Create a generic gateway tool that the agent can call with any tool name
@tool
def gateway_tool_call(tool_name: str, arguments: str) -> str:
    """Call any tool on the AgentCore Gateway by name. Pass arguments as a JSON string."""
    args = json.loads(arguments)
    result = mcp.call_tool(tool_name, args)
    content = result.get("result", {}).get("content", [])
    for item in content:
        if item.get("type") == "text":
            return item["text"]
    return json.dumps(result)

# Build a tool list description for the system prompt
tool_list = "\n".join(f"  - {t['name']}: {t.get('description', '')}" for t in all_tools)

SYSTEM_PROMPT = (
    "You are a helpful enterprise assistant. You can call any of these tools via gateway_tool_call:\n\n"
    f"{tool_list}\n\n"
    f"For Salesforce tools, always include domainName='{SF_DOMAIN}' in arguments. "
    "For SAP tools, use service_name and entity_set parameters. "
    "Keep answers concise and tabular."
)

agent = Agent(
    model=MODEL_ID,
    system_prompt=SYSTEM_PROMPT,
    tools=[gateway_tool_call],
)

result = agent(
    "Get the first 3 SAP business partners (use sap-target___odata_read with "
    "service_name=API_BUSINESS_PARTNER, entity_set=A_BusinessPartner, top=3, "
    "select=BusinessPartner,BusinessPartnerFullName) "
    f"and the first 3 Salesforce accounts (use salesforce-target___queryAccounts with "
    f"domainName={SF_DOMAIN}, q=SELECT Id,Name FROM Account LIMIT 3). "
    "Then compare which names exist in both systems."
)
print(result)
```

## Summary

| Use Case | Salesforce Tools | SAP Tools | Value |
|---|---|---|---|
| Customer 360 | queryAccounts, getAccountById | odata_read (A_BusinessPartner) | Unified customer view across CRM + ERP |
| Pipeline Reconciliation | queryAccounts (Opportunities) | odata_read (A_SalesOrder) | Track deal-to-order conversion |
| Support + ERP Context | createCase | find_sap_services, odata_read | Enriched support tickets |
| Natural Language Agent | All 43 SF tools | All 9 SAP tools | AI-driven cross-system intelligence |

**Key takeaway:** A single AgentCore Gateway endpoint consolidates access to multiple ISV platforms, enabling AI agents to answer cross-system questions without custom integration code.

## Clean Up

If you're done with all three notebooks, clean up the gateway and related resources. Refer to the cleanup cells in [01-salesforce-gateway-target.ipynb](01-salesforce-gateway-target.ipynb) and [02-sap-mcp-server-target.ipynb](02-sap-mcp-server-target.ipynb) for the full deletion sequence:

1. Delete gateway targets (both Salesforce and SAP)
2. Delete credential providers
3. Delete the gateway
4. Delete Cognito resources (domain, then user pool)
5. Delete IAM role
