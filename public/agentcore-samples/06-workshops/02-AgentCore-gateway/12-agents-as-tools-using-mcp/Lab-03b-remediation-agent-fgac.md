# Lab 3B: Remediation Agent with Fine-Grained Access Control

## Overview
This lab builds on Lab 3A by introducing role-based access control using JWT authentication and Lambda interceptors. We'll implement a separation of duties pattern where SRE users can plan remediations, but only approvers can execute them.

## Learning Objectives
- Understand JWT-based authentication with Cognito
- Implement role-based access control (RBAC) via Lambda interceptors
- Deploy and configure AgentCore gateways with custom authorization
- Enforce separation of duties in automated remediation workflows
- Monitor and audit access decisions

## Personas & Access Model

### SRE Role
- **Permissions:** Create and validate remediation plans
- **Restrictions:** Cannot execute remediations
- **Use Case:** Diagnose issues and propose fixes

### Approver Role
- **Permissions:** Execute and validate remediations
- **Restrictions:** None (full access)
- **Use Case:** Review SRE plans and execute approved fixes

---

# Step 1: Use Case Explanation

## Scenario

Your organization requires **separation of duties** for infrastructure changes:

- **SRE Team:** Diagnoses issues and creates remediation plans
- **Approver Team:** Reviews and executes approved changes

**Problem:** Without access control, anyone can execute infrastructure changes, creating compliance and security risks.

**Solution:** Use JWT authentication + Lambda interceptors to enforce role-based permissions at the gateway level.

## Why JWT + Lambda Interceptor?

**JWT Authentication:**
- Industry-standard token format
- Contains user identity and group membership
- Cryptographically signed by Cognito
- No database lookups needed

**Lambda Interceptor:**
- Runs at gateway REQUEST phase
- Examines JWT claims before routing to runtime
- Enforces fine-grained access control
- Provides audit trail via CloudWatch logs

**Benefits:**
- Centralized authorization logic
- No changes to agent code
- Scalable and serverless
- Easy to audit and modify

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SRE Workflow (Planning)                      │
└─────────────────────────────────────────────────────────────────┘

SRE User → Cognito Auth → JWT (groups: ["sre"])
                                ↓
                          Gateway receives token
                                ↓
                    Lambda Interceptor checks:
                    - Extract cognito:groups = ["sre"]
                    - Tool: generate_remediation_plan
                    - Permission: ✅ ALLOWED
                                ↓
                          Runtime executes
                                ↓
                    Remediation plan created ✅

┌─────────────────────────────────────────────────────────────────┐
│              SRE Workflow (Execution Attempt)                   │
└─────────────────────────────────────────────────────────────────┘

SRE User → Cognito Auth → JWT (groups: ["sre"])
                                ↓
                          Gateway receives token
                                ↓
                    Lambda Interceptor checks:
                    - Extract cognito:groups = ["sre"]
                    - Tool: execute_remediation_step
                    - Permission: ❌ DENIED
                                ↓
                    Request blocked at gateway ❌

┌─────────────────────────────────────────────────────────────────┐
│                 Approver Workflow (Execution)                   │
└─────────────────────────────────────────────────────────────────┘

Approver → Cognito Auth → JWT (groups: ["approvers"])
                                ↓
                          Gateway receives token
                                ↓
                    Lambda Interceptor checks:
                    - Extract cognito:groups = ["approvers"]
                    - Tool: execute_remediation_step
                    - Permission: ✅ ALLOWED
                                ↓
                          Runtime executes
                                ↓
                    Remediation executed ✅
```

```python
%pip install -q -r requirements.txt
print("✅ Workshop dependencies installed")
```

```python
# Verify Lab 3A completion
from lab_helpers.parameter_store import get_parameter
from lab_helpers.constants import PARAMETER_PATHS

try:
    user_pool_id = get_parameter(PARAMETER_PATHS["cognito"]["user_pool_id"])
    print("✅ Lab 3A prerequisites verified")
    print(f"   Cognito User Pool: {user_pool_id}")
    print("   Ready to proceed with Lab 3B")
except Exception:
    print("❌ Lab 3A not complete. Please run Lab-03a-remediation-agent.ipynb first.")
    raise
```

---

# Step 2: Cognito Tokens & Group Claims

## Objective
Understand what Cognito tokens contain and how group claims enforce access control.

## Activities
- [ ] Fetch Cognito tokens for SRE user
- [ ] Fetch Cognito tokens for Approver user
- [ ] Decode JWT tokens
- [ ] Display group claims from both tokens
- [ ] Compare differences between token payloads

```python
# Imports
import json
import boto3
from datetime import datetime
from lab_helpers.parameter_store import get_parameter
from lab_helpers.constants import PARAMETER_PATHS
from lab_helpers.config import AWS_REGION
from lab_helpers.lab_03 import decode_jwt, print_token_claims, compare_tokens

cognito = boto3.client("cognito-idp", region_name=AWS_REGION)
```

### SRE User Token

```python
# Authenticate SRE user
user_client_id = get_parameter(PARAMETER_PATHS["cognito"]["user_auth_client_id"])
sre_username = get_parameter(PARAMETER_PATHS["cognito"]["test_user_email"])
sre_password = get_parameter(PARAMETER_PATHS["cognito"]["test_user_password"])

sre_response = cognito.initiate_auth(
    ClientId=user_client_id,
    AuthFlow="USER_PASSWORD_AUTH",
    AuthParameters={"USERNAME": sre_username, "PASSWORD": sre_password},
)

sre_token = sre_response["AuthenticationResult"]["AccessToken"]
print(f"✅ SRE authenticated: {sre_username}")
print(f"   Token (first 50 chars): {sre_token}")
```

```python
# Decode and display SRE token
sre_claims = decode_jwt(sre_token)
print_token_claims(sre_claims, "SRE Token Claims")
```

### Approver User Token

```python
# Authenticate Approver user
approver_username = get_parameter(PARAMETER_PATHS["cognito"]["approver_user_email"])
approver_password = get_parameter(PARAMETER_PATHS["cognito"]["approver_user_password"])

approver_response = cognito.initiate_auth(
    ClientId=user_client_id,
    AuthFlow="USER_PASSWORD_AUTH",
    AuthParameters={"USERNAME": approver_username, "PASSWORD": approver_password},
)

approver_token = approver_response["AuthenticationResult"]["AccessToken"]
print(f"✅ Approver authenticated: {approver_username}")
print(f"   Token (first 50 chars): {approver_token[:50]}...")
```

```python
# Decode and display Approver token
approver_claims = decode_jwt(approver_token)
print_token_claims(approver_claims, "Approver Token Claims")
```

### Compare Token Payloads

```python
# Compare tokens side-by-side
compare_tokens(sre_claims, approver_claims)
```

### Key Concepts

**JWT Structure:**
- `header.payload.signature`
- Payload contains claims (user attributes)
- Signature validates token authenticity

**Group Claims in Cognito:**
- `cognito:groups` is automatically included in tokens
- Lists all groups the user belongs to
- No custom attributes needed

**Authorization Flow:**
```
User → Cognito → JWT with cognito:groups
                        ↓
                  Gateway receives token
                        ↓
                Lambda Interceptor extracts cognito:groups
                        ↓
                Maps groups to allowed tools
                        ↓
                Allow/Deny decision
```

**Permission Mapping (to be implemented in Lambda):**
```python
GROUP_PERMISSIONS = {
    "sre": ["generate_remediation_plan"],
    "approvers": ["execute_remediation_step", "validate_remediation_environment"]
}
```

---

# Step 3: Deploy Interceptor Lambda

## Objective
Create and deploy the Lambda function that will enforce access control at the gateway level.

## Interceptor Logic
The Lambda examines incoming requests and:
- [ ] Extracts JWT from request headers
- [ ] Validates JWT signature
- [ ] Checks group claims
- [ ] Enforces action-based access control
- [ ] Returns allow/deny decision

### Review Interceptor Code

```python
# Review interceptor Lambda code
with open("lab_helpers/lab_03/interceptor-request.py", "r") as f:
    print(f.read())
```

### Deploy Lambda Function

```python
# Deploy interceptor Lambda in us-west-2
from lab_helpers.lab_03 import deploy_interceptor
from lab_helpers.parameter_store import put_parameter
from lab_helpers.constants import PARAMETER_PATHS
from lab_helpers.config import AWS_REGION, WORKSHOP_NAME

print("📦 Deploying interceptor Lambda...")
function_arn = deploy_interceptor(region=AWS_REGION, prefix=WORKSHOP_NAME)

# Store for later use
put_parameter(PARAMETER_PATHS["lab_03b"]["interceptor_function_arn"], function_arn)

print(f"\n✅ Interceptor ready: {function_arn}")
```

**Note:** We'll test the interceptor in Steps 8-10 by invoking the gateway with different user tokens.

---

# Step 4: Clean Up Lab 3A Gateway

## Objective
Delete the gateway from Lab 3A because it lacks the Lambda interceptor configuration needed for fine-grained access control.

## Why Delete the Gateway?

**Lab 3A Gateway Configuration:**
- No authentication required
- No interceptor attached
- Open access to all tools

**Lab 3B Gateway Requirements:**
- JWT authentication via Cognito
- Lambda interceptor at REQUEST phase
- Role-based access control enforcement

**Why Not Update?**
Gateway interceptor configuration cannot be modified after creation—it must be set during initial deployment. Therefore, we need to:
1. Delete the Lab 3A gateway
2. Create a new gateway with interceptor configuration
3. Reuse the existing runtime (no changes needed)

**What Gets Deleted:**
- ✅ Gateway (requires interceptor config)
- ✅ Gateway targets (automatically deleted with gateway)

**What Gets Reused:**
- ✅ Runtime (same agent logic, different gateway)
- ✅ Cognito User Pool (already configured)
- ✅ Lambda Interceptor (deployed in Step 3)

### Delete Lab 3A Gateway

```python
import boto3
import time

# Initialize bedrock-agentcore-control client
agentcore_client = boto3.client("bedrock-agentcore-control", region_name=AWS_REGION)

# List all gateways
print("🔍 Listing all gateways...")
response = agentcore_client.list_gateways()
gateways = response.get("items", [])

if not gateways:
    print("ℹ️  No gateways found")
else:
    print(f"📋 Found {len(gateways)} gateway(s)\n")

    # Filter to only Lab 3A gateways (to be replaced by Lab 3B)
    lab_3a_gateways = [gw for gw in gateways if "aiml301-remediation-gateway" in gw.get("name", "")]

    if not lab_3a_gateways:
        print("ℹ️  No Lab 3A gateways to delete")
    else:
        print(f"🗑️  Deleting {len(lab_3a_gateways)} Lab 3A gateway(s)\n")

        # Delete each Lab 3A gateway
        for gateway in lab_3a_gateways:
            gateway_id = gateway["gatewayId"]
            gateway_name = gateway.get("name", "N/A")

            print(f"🗑️  Deleting: {gateway_name} ({gateway_id})")

            try:
                # First, list and delete all targets
                targets_response = agentcore_client.list_gateway_targets(gatewayIdentifier=gateway_id)
                targets = targets_response.get("items", [])

                for target in targets:
                    target_id = target["targetId"]
                    print(f"   🎯 Deleting target: {target_id}")
                    agentcore_client.delete_gateway_target(gatewayIdentifier=gateway_id, targetId=target_id)

                # Wait for all targets to be deleted
                if targets:
                    print("   ⏳ Waiting for targets to be deleted...")
                    for _ in range(30):
                        time.sleep(2)
                        check = agentcore_client.list_gateway_targets(gatewayIdentifier=gateway_id)
                        if len(check.get("items", [])) == 0:
                            break

                # Now delete the gateway
                agentcore_client.delete_gateway(gatewayIdentifier=gateway_id)
                print("   ✅ Deleted")

            except Exception as e:
                print(f"   ❌ Error: {e}")

        print("\n✅ Cleanup complete")
```

**Note:** Runtime is reused from Lab 3A—no deletion needed.

---

# Step 5: Create New Gateway & Target with JWT Auth

## Objective
Deploy a new gateway configured with JWT authentication and Lambda interceptor.

### Gateway Configuration

**Gateway Details:**
- Name: `interceptor-gateway-jwt-[random]`
- Protocol: MCP
- Authorizer Type: CUSTOM_JWT
- Intercept Points: REQUEST

**JWT Configuration:**
```json
{
  "authorizerType": "CUSTOM_JWT",
  "discoveryUrl": "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_POOL_ID/.well-known/openid-configuration",
  "allowedClients": [
    "CLIENT_ID_1",
    "CLIENT_ID_2"
  ]
}
```

**Interceptor Configuration:**
```json
{
  "interceptionPoints": ["REQUEST"],
  "interceptor": {
    "lambda": {
      "arn": "arn:aws:lambda:us-west-2:ACCOUNT:function:custom-interceptor-request"
    }
  },
  "inputConfiguration": {
    "passRequestHeaders": true
  }
}
```

### Create Gateway

```python
import random
import string
import time
import boto3
from lab_helpers.parameter_store import get_parameter, put_parameter
from lab_helpers.constants import PARAMETER_PATHS
from lab_helpers.config import AWS_REGION
from lab_helpers.lab_03.gateway_setup import AgentCoreGatewaySetup

# Initialize bedrock-agentcore-control client
agentcore_client = boto3.client("bedrock-agentcore-control", region_name=AWS_REGION)

# Get configuration values
user_pool_id = get_parameter(PARAMETER_PATHS["cognito"]["user_pool_id"])
user_client_id = get_parameter(PARAMETER_PATHS["cognito"]["user_auth_client_id"])
m2m_client_id = get_parameter(PARAMETER_PATHS["cognito"]["m2m_client_id"])
interceptor_arn = get_parameter(PARAMETER_PATHS["lab_03b"]["interceptor_function_arn"])

# Create Gateway IAM role in us-west-2
gateway_setup = AgentCoreGatewaySetup(region=AWS_REGION, prefix=WORKSHOP_NAME, verbose=False)
role_info = gateway_setup.create_gateway_service_role()
role_arn = role_info["role_arn"]
print(f"✅ Gateway role: {role_arn}")

# Generate unique gateway name
suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=10))
gateway_name = f"aiml301-interceptor-gateway-jwt-{suffix}"

print(f"📤 Creating gateway: {gateway_name}")
print("   Gateway region: us-west-2")
print(f"   Cognito region: {AWS_REGION}")
print(f"   Role: {role_arn}")
print(f"   Interceptor: {interceptor_arn}")

# Create gateway
response = agentcore_client.create_gateway(
    name=gateway_name,
    protocolType="MCP",
    protocolConfiguration={"mcp": {"supportedVersions": ["2025-03-26"]}},
    authorizerType="CUSTOM_JWT",
    authorizerConfiguration={
        "customJWTAuthorizer": {
            "discoveryUrl": f"https://cognito-idp.{AWS_REGION}.amazonaws.com/{user_pool_id}/.well-known/openid-configuration",
            "allowedClients": [user_client_id, m2m_client_id],
        }
    },
    interceptorConfigurations=[
        {
            "interceptionPoints": ["REQUEST"],
            "interceptor": {"lambda": {"arn": interceptor_arn}},
            "inputConfiguration": {"passRequestHeaders": True},
        }
    ],
    roleArn=role_arn,
)

gateway_id = response["gatewayId"]
gateway_arn = response["gatewayArn"]

print(f"\n✅ Gateway created: {gateway_id}")
print(f"   ARN: {gateway_arn}")
```

```python
# Wait for gateway to be READY
print("⏳ Waiting for gateway to be ready...")
while True:
    response = agentcore_client.get_gateway(gatewayIdentifier=gateway_id)

    status = response["status"]
    if status == "READY":
        gateway_url = response["gatewayUrl"]
        print(f"✅ Gateway ready: {status}")
        print(f"   URL: {gateway_url}")
        break
    elif status == "FAILED":
        print("❌ Gateway creation failed")
        break
    print(f"   Status: {status}")
    time.sleep(5)

# Store for later use
put_parameter(PARAMETER_PATHS["lab_03b"]["gateway_id"], gateway_id)
put_parameter(PARAMETER_PATHS["lab_03b"]["gateway_url"], gateway_url)
```

### Inspect Gateway Configuration

```python
# Display full gateway configuration
result = agentcore_client.get_gateway(gatewayIdentifier=gateway_id)

print("📋 Gateway Configuration:")
print("=" * 70)
print(json.dumps(result, indent=2, default=str))
print("=" * 70)

# Highlight key configuration elements
print("\n🔑 Key Configuration Elements:")
print(f"   Gateway ID: {result['gatewayId']}")
print(f"   Gateway URL: {result['gatewayUrl']}")
print(f"   Protocol: {result['protocolType']}")
print(f"   Authorizer: {result['authorizerType']}")

# JWT Configuration
jwt_config = result["authorizerConfiguration"]["customJWTAuthorizer"]
print("\n🔐 JWT Configuration:")
print(f"   Discovery URL: {jwt_config['discoveryUrl']}")
print(f"   Allowed Clients: {len(jwt_config['allowedClients'])} clients")
for i, client in enumerate(jwt_config["allowedClients"], 1):
    print(f"      {i}. {client}")

# Interceptor Configuration
interceptor_config = result["interceptorConfigurations"][0]
print("\n🛡️  Interceptor Configuration:")
print(f"   Lambda ARN: {interceptor_config['interceptor']['lambda']['arn']}")
print(f"   Interception Points: {interceptor_config['interceptionPoints']}")
print(f"   Pass Request Headers: {interceptor_config['inputConfiguration']['passRequestHeaders']}")
print("\n   ℹ️  The interceptor will:")
print("      • Examine JWT tokens in Authorization header")
print("      • Extract cognito:groups claim")
print("      • Enforce group-based permissions")
print("      • Allow/deny requests before reaching runtime")
```

Add permissions to lambda so it can be invoked by Interceptor Gateway

```python
# Update Lambda permission with gateway ARN
import boto3

lambda_client = boto3.client("lambda", region_name=AWS_REGION)
function_name = f"{WORKSHOP_NAME}-interceptor-request"
gateway_arn = result["gatewayArn"]

print("🔧 Updating Lambda permission with gateway ARN...")

# Remove old permission
try:
    lambda_client.remove_permission(FunctionName=function_name, StatementId="AllowGatewayInvoke")
    print("   Removed old permission")
except:
    pass

# Add new permission with source ARN
lambda_client.add_permission(
    FunctionName=function_name,
    StatementId="AllowGatewayInvoke",
    Action="lambda:InvokeFunction",
    Principal="bedrock-agentcore.amazonaws.com",
    SourceArn=gateway_arn,
)

print("✅ Lambda permission updated with source ARN")
print(f"   Gateway ARN: {gateway_arn}")
```

### Target Configuration

**Target Details:**
- Name: `mcp-remediation-target`
- Type: MCP Server
- Endpoint: [Runtime endpoint from step 6]

**Credential Provider:**
- Type: OAUTH
- Provider: Cognito MCP Provider

### Create Target

```python
# Get runtime endpoint from Lab 3A
runtime_arn = get_parameter(PARAMETER_PATHS["lab_03"]["runtime_arn"])
runtime_endpoint = f"https://bedrock-agentcore.{AWS_REGION}.amazonaws.com/runtimes/{runtime_arn.replace(':', '%3A').replace('/', '%2F')}/invocations?qualifier=DEFAULT"
print(f"runtime endpoint: {runtime_endpoint}")
# Get OAuth provider ARN
oauth_provider_arn = get_parameter(PARAMETER_PATHS["lab_03"]["oauth2_provider_arn"])

# Create target
response = agentcore_client.create_gateway_target(
    gatewayIdentifier=gateway_id,
    name="mcp-remediation-target",
    description="MCP server target for remediation agent with JWT auth",
    targetConfiguration={"mcp": {"mcpServer": {"endpoint": runtime_endpoint}}},
    credentialProviderConfigurations=[
        {
            "credentialProviderType": "OAUTH",
            "credentialProvider": {
                "oauthCredentialProvider": {
                    "providerArn": oauth_provider_arn,
                    "scopes": [],
                }
            },
        }
    ],
)

target_id = response["targetId"]
print(f"✅ Target Creating: {target_id}")
print(f"   Runtime: {runtime_arn}")
```

```python
# Wait for target to be READY
print("⏳ Waiting for target to be ready...")

target_info = agentcore_client.get_gateway_target(gatewayIdentifier=gateway_id, targetId=target_id)
time.sleep(5)
status = target_info.get("status", "UNKNOWN")

if status == "READY":
    print("✅ Target is READY")
    print("\n🎉 Gateway and target ready for testing!")
    print(f"   Gateway URL: {gateway_url}")
    print(f"   Target ID: {target_id}")
if status == "FAILED" or status == "SYNCHRONIZE_UNSUCCESSFUL":
    print(f"❌ Target in ERROR state: {target_info.get('statusReasons', 'No error message')}")
```

### Inspect Target Configuration

```python
# Display full target configuration
result = agentcore_client.get_gateway_target(gatewayIdentifier=gateway_id, targetId=target_id)

print("📋 Target Configuration:")
print("=" * 70)
print(json.dumps(result, indent=2, default=str))
print("=" * 70)

# Highlight key configuration elements
print("\n🔑 Key Configuration Elements:")
print(f"   Target ID: {result['targetId']}")
print(f"   Target Name: {result['name']}")
print(f"   Status: {result['status']}")

# MCP Server Configuration
mcp_config = result["targetConfiguration"]["mcp"]["mcpServer"]
print("\n🔌 MCP Server Configuration:")
print(f"   Endpoint: {mcp_config['endpoint'][:80]}...")
print("   ℹ️  Points to Lab 3A runtime (reused)")

# Credential Provider Configuration
cred_config = result["credentialProviderConfigurations"][0]
oauth_config = cred_config["credentialProvider"]["oauthCredentialProvider"]
print("\n🔐 Credential Provider Configuration:")
print(f"   Type: {cred_config['credentialProviderType']}")
print(f"   Provider ARN: {oauth_config['providerArn']}")
print("   ℹ️  Uses Cognito OAuth provider for machine-to-machine auth")

# Explain the flow
print("\n📊 Request Flow:")
print("   1. User sends request with JWT token → Gateway")
print("   2. Gateway validates JWT (Cognito OIDC)")
print("   3. Lambda interceptor checks permissions")
print("   4. If allowed → Gateway forwards to Target")
print("   5. Target uses OAuth to authenticate with Runtime")
print("   6. Runtime executes agent logic")
print("   7. Response flows back through Gateway")
```

---

# Step 6: Review MCP Runtime

## Objective
Review the remediation agent runtime that will be accessed through the gateway.

### Check Runtime Configuration

```python
# Verify runtime from Lab 3A is available
from lab_helpers.parameter_store import get_parameter
from lab_helpers.constants import PARAMETER_PATHS
from lab_helpers.config import AWS_REGION
import boto3

runtime_arn = get_parameter(PARAMETER_PATHS["lab_03"]["runtime_arn"])
runtime_id = runtime_arn.split("/")[-1]

print("✅ Runtime from Lab 3A:")
print(f"   ARN: {runtime_arn}")
print(f"   ID: {runtime_id}")
print(f"   Region: {AWS_REGION}")

# Check runtime status using control plane client
agentcore_control = boto3.client("bedrock-agentcore-control", region_name=AWS_REGION)
try:
    runtime_info = agentcore_control.get_agent_runtime(agentRuntimeId=runtime_id)
    status = runtime_info["status"]
    print(f"\n📊 Runtime Status: {status}")

    if status == "READY":
        print("   ✅ Runtime is ready for gateway integration")
    elif status == "FAILED" or status == "SYNCHRONIZE_UNSUCCESSFUL":
        print(f"❌ Target in ERROR state: {target_info.get('statusReasons', 'No error message')}")
except Exception as e:
    print(f"   ❌ Error checking runtime: {e}")
```

---

# Step 7: Regenerate Cognito Tokens

## Objective
Obtain fresh JWT tokens for both personas that are valid for the new gateway.

### SRE User Token

```python
# Regenerate SRE token (in case Step 2 tokens expired)
sre_response = cognito.initiate_auth(
    ClientId=user_client_id,
    AuthFlow="USER_PASSWORD_AUTH",
    AuthParameters={"USERNAME": sre_username, "PASSWORD": sre_password},
)

sre_token = sre_response["AuthenticationResult"]["AccessToken"]
sre_claims = decode_jwt(sre_token)

print("✅ Fresh SRE token generated")
print(f"   Username: {sre_username}")
print(f"   Groups: {sre_claims.get('cognito:groups', [])}")
print(f"   Token (first 50 chars): {sre_token[:50]}...")
```

### Approver User Token

```python
# Regenerate Approver token (in case Step 2 tokens expired)
approver_response = cognito.initiate_auth(
    ClientId=user_client_id,
    AuthFlow="USER_PASSWORD_AUTH",
    AuthParameters={"USERNAME": approver_username, "PASSWORD": approver_password},
)

approver_token = approver_response["AuthenticationResult"]["AccessToken"]
approver_claims = decode_jwt(approver_token)

print("✅ Fresh Approver token generated")
print(f"   Username: {approver_username}")
print(f"   Groups: {approver_claims.get('cognito:groups', [])}")
print(f"   Token (first 50 chars): {approver_token[:50]}...")
```

## Enrich Context from Memory with Diagnostics Information

Let's get additional information from our curated memory to enrich the context with diagnostics information.

```python
agent_memory_client = boto3.client("bedrock-agentcore", region_name=AWS_REGION)

memory_id = get_parameter(PARAMETER_PATHS["memory"]["memory_id"])
memory_session_id = get_parameter(PARAMETER_PATHS["memory"]["default_session_id"])

print(memory_id)
print(memory_session_id)
actor_id = "diagnostics_agent"


# list events added to agent memory, to confirm successful write
params = {
    "memoryId": memory_id,
    "actorId": actor_id,
    "sessionId": memory_session_id,
    "includePayloads": True,
}
# Get all messages
response = agent_memory_client.list_events(**params)
additional_context = ""
for event in response.get("events", []):
    payload = event.get("payload", [])
    for i, item in enumerate(payload):
        if "conversational" in item:
            text = item["conversational"]["content"]["text"]
            additional_context += text
additional_context
```

---

# Step 8: SRE Simulates Plan Creation

## Objective
Show that SRE users can create remediation plans successfully.

## Scenario
SRE detects an issue and creates a plan to remediate it.

### Execute Plan Creation

```python
# Connect to gateway with SRE token
from lab_helpers.lab_03.mcp_client import MCPClient

gateway_url = get_parameter(PARAMETER_PATHS["lab_03b"]["gateway_url"])

print("🔗 Connecting to gateway as SRE user...")
print(f"   Gateway: {gateway_url}")
print(f"   User: {sre_username}")
print(f"   Groups: {sre_claims.get('cognito:groups', [])}")

sre_client = MCPClient(gateway_url, sre_token)
sre_client.initialize()

print("\n✅ Connected to gateway")
```

```python
# List available tools
print("🔧 Listing available tools...\n")
tools = sre_client.list_tools()

print(f"📋 Available tools ({len(tools)}):")
for tool in tools:
    print(f"   • {tool['name']}")
    if "description" in tool:
        print(tool)
        desc = tool["description"]
        print(f"     {desc[:80]}..." if len(desc) > 80 else f"     {desc}")
```

```python
# Invoke remediation planning tool
start_time = datetime.now()
print("\n🎯 Invoking generate_remediation_plan tool...\n")
try:
    result = sre_client.call_tool(
        tool_name="mcp-remediation-target___infrastructure_agent",
        arguments={
            "remediation_query": f"""I need help with infrastructure remediation for our CRM application. We're experiencing: {additional_context} """,
            "action_type": "only_plan",
        },
    )
except Exception as e:
    print(f"❌ Error: {e}")
analysis_time = (datetime.now() - start_time).total_seconds()
print(f"Analysis Time: {analysis_time:.2f} seconds")
print("✅ Tool invocation successful!")
print("\n📋 Remediation Plan:")
print(f"{result[:500]}..." if len(result) > 500 else result)
```

### Verify Success

```python
print("\n✅ SRE User Successfully:")
print("   1. Connected to gateway with JWT token")
print("   2. Listed available tools")
print("   3. Invoked generate_remediation_plan tool")
print("   4. Received remediation plan")
print("\n🔒 Interceptor allowed this operation because:")
print("   • User is in 'sre' group")
print("   • Tool 'generate_remediation_plan' is allowed for SRE users")
```

### Expected Outcome
✅ Plan created successfully with SRE token

---

# Step 9: SRE Attempts to Execute (Access Denied)

## Objective
Demonstrate that SRE users CANNOT execute remediations—the interceptor blocks them.

## Scenario
SRE attempts to execute the plan they created.

### Attempt Execution

```python
# Invoke remediation planning tool
print("\n🎯 Invoking execute_remediation_step tool...\n")

result = sre_client.call_tool(
    tool_name="mcp-remediation-target___infrastructure_agent",
    arguments={
        "remediation_query": f"""
            Help me change the read and write capacity to on-demand for the DynamoDb tables in my CRM application, based on this diagnostic information: {additional_context}
            """,
        "action_type": "only_execute",
    },
)
```

### Analyze Access Denial

```python
# Check Lambda logs to see the interceptor rejection
# Since it may take few minutes for logs to reach cloudwatch, please wait and retry
import boto3
from datetime import datetime

logs = boto3.client("logs", region_name=AWS_REGION)
log_group = "/aws/lambda/aiml301_sre_agentcore-interceptor-request"

streams = logs.describe_log_streams(logGroupName=log_group, orderBy="LastEventTime", descending=True, limit=1)

print("📋 Interceptor Lambda Logs (Last 20 lines):\n")
stream = streams["logStreams"][0]
events = logs.get_log_events(
    logGroupName=log_group,
    logStreamName=stream["logStreamName"],
    limit=30,
    startFromHead=False,
)

for event in events["events"][-20:]:
    msg = event["message"].strip()
    if any(x in msg for x in ["Tool call", "User groups", "not authorized", "Denying"]):
        print(msg)

print("\n✅ The interceptor blocked the execute_remediation_step call for SRE user")
```

### Expected Outcome
❌ Access denied - Interceptor rejection visible

---

# Step 10: Approver Executes & Validates

## Objective
Show that approver users can execute and validate remediations.

### Part A: Approver Executes Remedy

```python
approver_client = MCPClient(gateway_url, approver_token)
approver_client.initialize()
```

```python
# Invoke remediation planning tool
print("\n🎯 Invoking execute_remediation_step tool...\n")
start_time = time.time()
try:
    result = approver_client.call_tool(
        tool_name="mcp-remediation-target___infrastructure_agent",
        arguments={
            "remediation_query": """
            This is a test invocation to validate access to infrastructure_agent and tool. Please do a health check and confirm your status.
            """,
            "action_type": "only_execute",
        },
    )
except Exception as e:
    print(f"❌ Error: {e}")
end_time = time.time()
print(f"  ⏰ Total time taken: {end_time - start_time:.2f} seconds")
```

### Part B: Approver Validates Fix

### Expected Outcome
✅ Remediation executed and validated with Approver token

---

# Cleanup

## Objective
Remove Lab 3B resources while preserving Lab 3A base infrastructure.

**Resources Deleted:**
- Gateway with JWT authentication
- Lambda interceptor function
- Lambda execution role

**Resources Preserved:**
- AgentCore Runtime (from Lab 3A)
- Cognito User Pool and users
- OAuth2 Credential Provider
- Parameter Store entries

```python
from lab_helpers.config import AWS_REGION

# cleanup_lab_03b(region_name=AWS_REGION, verbose=True)
```

---

# References
- Lab 3A: Remediation Agent Foundations
- Cognito JWT Configuration
- AgentCore Gateway Documentation
- Lambda Interceptor Patterns
