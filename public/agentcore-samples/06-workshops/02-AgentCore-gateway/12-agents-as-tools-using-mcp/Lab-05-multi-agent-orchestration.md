# Lab 5: Supervisor Agent with Central Gateway

## Overview
Build a supervisor agent deployed to AgentCore Runtime that orchestrates three specialized agents through a central gateway:
- **Diagnostics Agent** (Lambda from Lab 02)
- **Remediation Agent** (Runtime from Lab 03a)
- **Prevention Agent** (Runtime from Lab 04)

## Architecture
```
┌─────────────────────────────────────────────────────────────────────┐
│                              USER                                   │
│                    (Cognito JWT Token).                             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP POST /invocations
                             │ Authorization: Bearer <JWT>
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    SUPERVISOR AGENT (Local)                         │
│                                                                     │
│  • Orchestrates incident response workflow                          │
│  • Coordinates 3 specialized agents via MCP                         │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ MCP with JWT (passes Authorization header)
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    CENTRAL GATEWAY (MCP)                            │
│  • Single gateway for all agent communication                       │
│  • JWT Authorization (Cognito)                                      │
│  • Lambda Interceptor at REQUEST phase                              │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ Interceptor validates JWT
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    LAMBDA INTERCEPTOR (Lab 03b)                     │
│  • Extracts cognito:groups from JWT                                 │
│  • Approvers: Full access to all tools                              │
│  • SRE: Limited access (diagnostics + prevention only)              │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    ↓                 ↓
                 ALLOW              DENY
                    ↓                 ↓
         Routes to targets    Returns error
                    │
    ┌───────────────┼───────────────┬───────────────┐
    │               │               │               │
    ↓               ↓               ↓               ↓
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ TARGET 1│   │ TARGET 2│   │ TARGET 3│   │ (Future)│
│         │   │         │   │         │   │         │
│ Lambda  │   │ Runtime │   │ Runtime │   │ Agents  │
│ (Lab 02)│   │(Lab 03a)│   │ (Lab 04)│   │         │
│         │   │         │   │         │   │         │
│Diagnose │   │Remediate│   │ Prevent │   │   ...   │
└─────────┘   └─────────┘   └─────────┘   └─────────┘
     │             │             │
     │ IAM Role    │ OAuth2 M2M  │ OAuth2 M2M
     │             │             │
     ↓             ↓             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    AWS INFRASTRUCTURE                               │
│  • CloudWatch Logs & Metrics                                        │
│  • DynamoDB Tables                                                  │
│  • EC2 Instances                                                    │
│  • AgentCore Code Interpreter                                       │
│  • AgentCore Browser                                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Components

1. **Supervisor Agent (Runtime)**
   - Receives HTTP POST to `/invocations` with JWT
   - Extracts Authorization header and passes to MCP client
   - Orchestrates all specialized agents

2. **Central Gateway**
   - Single gateway for all agent communication
   - JWT authentication via Cognito
   - Lambda interceptor validates tokens

3. **Lambda Interceptor (Lab 03b)**
   - Reused from Lab 03b
   - Validates JWT and checks cognito:groups
   - Enforces role-based permissions

4. **Three Specialized Agents**
   - **Diagnostics** (Lambda): Analyzes logs and metrics
   - **Remediation** (Runtime): Executes fixes with Code Interpreter
   - **Prevention** (Runtime): Researches best practices with Browser

### Authentication Flow

```
User → Cognito (JWT)
         ↓
HTTP POST /invocations (Authorization: Bearer <JWT>)
         ↓
Supervisor extracts Authorization header
         ↓
MCP Client → Central Gateway (with Authorization header)
         ↓
Interceptor validates JWT and cognito:groups
         ↓
┌────────┴────────┐
↓                 ↓
Approvers         SRE
(All tools)       (Diagnostics + Prevention only)
```

## Prerequisites
- ✅ Lab 02 completed (Diagnostics Lambda)
- ✅ Lab 03a completed (Remediation Runtime)
- ✅ Lab 03b completed (Interceptor Lambda)
- ✅ Lab 04 completed (Prevention Runtime)

## 0. Install Dependencies

```python
%pip install -q -r requirements.txt
print("✅ Dependencies installed")
```

## 1. Imports and Configuration

```python
import json
import boto3
import time
import urllib.parse

from lab_helpers.config import AWS_REGION, WORKSHOP_NAME
from lab_helpers.parameter_store import get_parameter, put_parameter
from lab_helpers.constants import PARAMETER_PATHS
from lab_helpers.lab_01.infrastructure import get_app_url

print("✅ Imports loaded")
print(f"   Region: {AWS_REGION}")
print(f"   Workshop: {WORKSHOP_NAME}")
```

## 2. Verify Prerequisites

```python
# Verify all required resources exist
try:
    lab02_lambda_arn = get_parameter(PARAMETER_PATHS["lab_02"]["lambda_function_arn"])
    lab03_runtime_arn = get_parameter(PARAMETER_PATHS["lab_03"]["runtime_arn"])
    lab04_runtime_arn = get_parameter(PARAMETER_PATHS["lab_04"]["runtime_arn"])
    interceptor_arn = get_parameter(PARAMETER_PATHS["lab_03b"]["interceptor_function_arn"])
    user_pool_id = get_parameter(PARAMETER_PATHS["cognito"]["user_pool_id"])

    print("✅ All prerequisites verified")
    print(f"   Lab 02 Lambda: {lab02_lambda_arn}")
    print(f"   Lab 03a Runtime: {lab03_runtime_arn}")
    print(f"   Lab 04 Runtime: {lab04_runtime_arn}")
    print(f"   Interceptor: {interceptor_arn}")
    print(f"   Cognito Pool: {user_pool_id}")
except Exception as e:
    print(f"❌ Missing prerequisites: {e}")
    raise
```

## 3. Create Central Gateway with Interceptor

```python
# Create gateway service role
iam = boto3.client("iam", region_name=AWS_REGION)
sts = boto3.client("sts", region_name=AWS_REGION)
account_id = sts.get_caller_identity()["Account"]

gateway_role_name = f"{WORKSHOP_NAME}_CentralGatewayRole"
gateway_trust = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"Service": "bedrock-agentcore.amazonaws.com"},
            "Action": "sts:AssumeRole",
        }
    ],
}
gateway_permissions = {
    "Version": "2012-10-17",
    "Statement": [
        {"Effect": "Allow", "Action": "lambda:InvokeFunction", "Resource": "*"},
        {"Effect": "Allow", "Action": "bedrock-agentcore:*", "Resource": "*"},
        {"Effect": "Allow", "Action": "logs:*", "Resource": "*"},
        {
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:*",
                "bedrock:*",
                "agent-credential-provider:*",
                "iam:PassRole",
                "secretsmanager:GetSecretValue",
                "lambda:InvokeFunction",
            ],
            "Resource": "*",
        },
    ],
}

try:
    gw_role = iam.create_role(RoleName=gateway_role_name, AssumeRolePolicyDocument=json.dumps(gateway_trust))
    gateway_role_arn = gw_role["Role"]["Arn"]
    time.sleep(10)
except iam.exceptions.EntityAlreadyExistsException:
    gateway_role_arn = iam.get_role(RoleName=gateway_role_name)["Role"]["Arn"]

iam.put_role_policy(
    RoleName=gateway_role_name,
    PolicyName="GatewayPermissions",
    PolicyDocument=json.dumps(gateway_permissions),
)
print(f"✅ Gateway role: {gateway_role_arn}")
```

```python
# Save Gateway Role ARN in Parametere
put_parameter(
    PARAMETER_PATHS["lab_05"]["gateway_role_arn"],
    gateway_role_arn,
    region_name=AWS_REGION,
)
```

**Create Central Gateway with JWT Authorization**

Creates AgentCore Gateway with:
- Custom JWT authorizer (Cognito discovery URL)
- Allowed clients: user auth + M2M
- Lambda interceptor for request authorization
- Saves gateway ID and URL to Parameter Store

```python
# Get Cognito config
user_auth_client_id = get_parameter(PARAMETER_PATHS["cognito"]["user_auth_client_id"])
m2m_client_id = get_parameter(PARAMETER_PATHS["cognito"]["m2m_client_id"])
discovery_url = f"https://cognito-idp.{AWS_REGION}.amazonaws.com/{user_pool_id}/.well-known/openid-configuration"

# Create gateway with interceptor
agentcore = boto3.client("bedrock-agentcore-control", region_name=AWS_REGION)
gateway = agentcore.create_gateway(
    name="aiml301-central-gateway",
    roleArn=gateway_role_arn,
    protocolType="MCP",
    authorizerType="CUSTOM_JWT",
    authorizerConfiguration={
        "customJWTAuthorizer": {
            "discoveryUrl": discovery_url,
            "allowedClients": [user_auth_client_id, m2m_client_id],
        }
    },
    interceptorConfigurations=[
        {
            "interceptionPoints": ["REQUEST"],
            "interceptor": {"lambda": {"arn": interceptor_arn}},
            "inputConfiguration": {"passRequestHeaders": True},
        }
    ],
)

central_gateway_id = gateway["gatewayId"]
central_gateway_url = gateway["gatewayUrl"]
put_parameter(PARAMETER_PATHS["lab_05"]["gateway_id"], central_gateway_id, region_name=AWS_REGION)

put_parameter(
    PARAMETER_PATHS["lab_05"]["gateway_url"],
    central_gateway_url,
    region_name=AWS_REGION,
)

print(f"✅ Gateway created: {central_gateway_id}")
print(f"   URL: {central_gateway_url}")
```

```python
!aws sts get-caller-identity
```

```python
# Add Lambda permission
lambda_client = boto3.client("lambda", region_name=AWS_REGION)
try:
    lambda_client.add_permission(
        FunctionName=interceptor_arn.split(":")[-1],
        StatementId=f"AllowGateway{central_gateway_id[:8]}",
        Action="lambda:InvokeFunction",
        Principal="bedrock-agentcore.amazonaws.com",
        SourceArn=f"arn:aws:bedrock-agentcore:{AWS_REGION}:{account_id}:gateway/{central_gateway_id}",
    )
    print("✅ Lambda permission added")
except lambda_client.exceptions.ResourceConflictException:
    print("ℹ️  Permission exists")
```

## 4. Add Target 1: Diagnostics Lambda

```python
diagnostics_schema = [
    {
        "name": "logs_analysis_agent",
        "description": "This agent is a system diagnostics tool that analyzes AWS infrastructure health by examining logs and metrics from EC2, NGINX, and DynamoDB services. It uses AI to correlate findings across different data sources, identify issues like throttling, high resource utilization, and application errors, then provides evidence-based assessments with recommended actions for troubleshooting system problems.",
        "inputSchema": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"],
        },
    }
]

target1 = agentcore.create_gateway_target(
    gatewayIdentifier=central_gateway_id,
    name="strands-diagnostics-agent",
    targetConfiguration={
        "mcp": {
            "lambda": {
                "lambdaArn": lab02_lambda_arn,
                "toolSchema": {"inlinePayload": diagnostics_schema},
            }
        }
    },
    credentialProviderConfigurations=[{"credentialProviderType": "GATEWAY_IAM_ROLE"}],
)
print(f"✅ Target 1: {target1['targetId']}")
```

## 5. Add Target 2: Remediation Runtime

```python
# Get OAuth2 provider
try:
    oauth2_provider_arn = get_parameter(PARAMETER_PATHS["lab_03"]["oauth2_provider_arn"])
except:
    m2m_client_secret = get_parameter(PARAMETER_PATHS["cognito"]["m2m_client_secret"])
    cred = agentcore.create_oauth2_credential_provider(
        name="aiml301-m2m-lab05a",
        credentialProviderVendor="CustomOauth2",
        oauth2ProviderConfigInput={
            "customOauth2ProviderConfig": {
                "clientId": m2m_client_id,
                "clientSecret": m2m_client_secret,
                "oauthDiscovery": {"discoveryUrl": discovery_url},
            }
        },
    )
    oauth2_provider_arn = cred["credentialProviderArn"]

resource_server_id = get_parameter(PARAMETER_PATHS["cognito"]["resource_server_identifier"])
m2m_scopes = [
    f"{resource_server_id}/mcp.invoke",
    f"{resource_server_id}/runtime.access",
]

encoded_arn = urllib.parse.quote(lab03_runtime_arn, safe="")
remediation_endpoint = (
    f"https://bedrock-agentcore.{AWS_REGION}.amazonaws.com/runtimes/{encoded_arn}/invocations?qualifier=DEFAULT"
)

target2 = agentcore.create_gateway_target(
    gatewayIdentifier=central_gateway_id,
    name="aiml301-runtime-target",
    targetConfiguration={"mcp": {"mcpServer": {"endpoint": remediation_endpoint}}},
    credentialProviderConfigurations=[
        {
            "credentialProviderType": "OAUTH",
            "credentialProvider": {
                "oauthCredentialProvider": {
                    "providerArn": oauth2_provider_arn,
                    "scopes": m2m_scopes,
                }
            },
        }
    ],
)
print(f"✅ Target 2: {target2['targetId']}")
```

## 6. Add Target 3: Prevention Runtime

```python
encoded_arn = urllib.parse.quote(lab04_runtime_arn, safe="")
prevention_endpoint = (
    f"https://bedrock-agentcore.{AWS_REGION}.amazonaws.com/runtimes/{encoded_arn}/invocations?qualifier=DEFAULT"
)

target3 = agentcore.create_gateway_target(
    gatewayIdentifier=central_gateway_id,
    name="aiml301-prevention-runtime-target",
    targetConfiguration={"mcp": {"mcpServer": {"endpoint": prevention_endpoint}}},
    credentialProviderConfigurations=[
        {
            "credentialProviderType": "OAUTH",
            "credentialProvider": {
                "oauthCredentialProvider": {
                    "providerArn": oauth2_provider_arn,
                    "scopes": m2m_scopes,
                }
            },
        }
    ],
)
print(f"✅ Target 3: {target3['targetId']}")
```

**Synchronize Gateway Targets**

Initiates target synchronization and polls gateway status until:
- `AVAILABLE`: Sync successful
- `FAILED`: Sync failed with reasons
- Timeout after 30 attempts (60 seconds)

```python
time.sleep(20)
```

```python
# Synchronize Runtime targets only (skip Lambda)
for target in [target2, target3]:  # Remediation and Prevention (Runtime)
    agentcore.synchronize_gateway_targets(gatewayIdentifier=central_gateway_id, targetIdList=[target["targetId"]])
    print(f"⏳ Synchronizing {target['targetId']}...")

# Poll for sync status
import time

max_attempts = 30
for i in range(max_attempts):
    time.sleep(2)
    response = agentcore.get_gateway(gatewayIdentifier=central_gateway_id)
    status = response["status"]

    if status == "READY":
        print("✅ Runtime targets synchronized successfully")
        break
    elif status == "FAILED":
        print(f"❌ Synchronization failed: {response.get('failureReasons', [])}")
        break
    else:
        print(f"   Status: {status} ({i + 1}/{max_attempts})")
else:
    print("⚠️ Synchronization timeout - check gateway status manually")
```

## 7. Get Token

```python
# Authenticate as approver
cognito = boto3.client("cognito-idp", region_name=AWS_REGION)
approver_username = get_parameter(PARAMETER_PATHS["cognito"]["approver_user_email"])
approver_password = get_parameter(PARAMETER_PATHS["cognito"]["approver_user_password"])

auth_response = cognito.initiate_auth(
    ClientId=user_auth_client_id,
    AuthFlow="USER_PASSWORD_AUTH",
    AuthParameters={"USERNAME": approver_username, "PASSWORD": approver_password},
)
access_token = auth_response["AuthenticationResult"]["AccessToken"]
print("✅ Authenticated as approver")
```

```python
print(access_token)
```

## 8. Run Supervisor Code

**Run Local Supervisor Agent**

Execute the supervisor agent locally using Strands framework:
- Connects to central gateway with JWT authentication
- Retrieves all available tools from gateway targets
- Orchestrates diagnostic, remediation, and prevention agents
- Processes user queries and returns comprehensive responses

### Supervisor Tool List Call - Connects to Central Gateway (having 3 agents exposed as tools)

```python
from lab_helpers.lab_05.local_supervisor_agent import run_supervisor_agent

# Configure your query
user_prompt = "List all tools available"

# Run supervisor agent
response = run_supervisor_agent(gateway_url=central_gateway_url, access_token=access_token, prompt=user_prompt)

print("\n" + "=" * 80)
print("SUPERVISOR AGENT RESPONSE")
print("=" * 80)
print(response)
```

### Diagnostic Agent Call

```python
# Configure your query
user_prompt = "what recent issues related to dynamodb throttling, do you see in the CRM application"

# Run supervisor agent
response = run_supervisor_agent(gateway_url=central_gateway_url, access_token=access_token, prompt=user_prompt)

print("\n" + "=" * 80)
print("SUPERVISOR AGENT RESPONSE")
print("=" * 80)
print(response)
```

**Example Queries for Streamlit**

Try these example queries with the supervisor agent:

```python
# Diagnostic query
"What recent issues related to DynamoDB throttling do you see in the CRM application?"

# Infrastructure query
"List all DynamoDB tables. Use infrastructure agent and action_type=only_execute"

# Prevention query
"Research DynamoDB best practices to avoid table throttling"

# Full workflow
"Fix IAM Permissions to resolve dynamo DB access issue.You have the required IAM permissions and always use action_type='only_execute'"
```

## 9. Interactive Chat Interface with Streamlit

Launch a web-based chat interface to interact with the supervisor agent through a user-friendly UI.

### 9.1 Create Gateway Configuration File

```python
# Create gateway_config.json for Streamlit app
# Note: GatewayClient expects specific fields for Cognito authentication
gateway_config = {
    "gateway_id": central_gateway_id,
    "gateway_url": central_gateway_url,
    "region": AWS_REGION,
    "client_info": {
        "user_pool_id": user_pool_id,
        "client_id": user_auth_client_id,
        "client_secret": "",  # Empty for user auth client (no secret)
        "scope": "openid",  # Required scope for Cognito
        "username": approver_username,
        "password": approver_password,
    },
}

import json

with open("gateway_config.json", "w") as f:
    json.dump(gateway_config, f, indent=2)

print("✅ Gateway configuration saved to gateway_config.json")
print(f"   Gateway ID: {central_gateway_id}")
print(f"   Gateway URL: {central_gateway_url}")
print(f"   User: {approver_username}")
```

### 9.2 Install Streamlit

```python
%pip install -q streamlit
print("✅ Streamlit installed")
```

### 9.3 Launch Streamlit App

```python
import subprocess
import time
import os
import json
import boto3


def get_streamlit_url():
    """
    Generate accessible Streamlit URL for SageMaker Studio or local environment
    """
    try:
        # Check if running in SageMaker Studio
        with open("/opt/ml/metadata/resource-metadata.json", "r") as file:
            data = json.load(file)
            domain_id = data["DomainId"]
            space_name = data["SpaceName"]

        # Get SageMaker Studio URL
        sagemaker_client = boto3.client("sagemaker")
        response = sagemaker_client.describe_space(DomainId=domain_id, SpaceName=space_name)
        streamlit_url = response["Url"] + "/proxy/8501/"
        print("📍 Running in SageMaker Studio")
        print(f"   Domain ID: {domain_id}")
        print(f"   Space Name: {space_name}")

    except (FileNotFoundError, json.JSONDecodeError, KeyError):
        # Running locally or outside SageMaker Studio
        streamlit_url = "http://localhost:8501"
        print("📍 Running in local environment")

    return streamlit_url


# Kill any existing streamlit processes
try:
    subprocess.run(["pkill", "-f", "streamlit"], check=False)
    time.sleep(2)
except:
    pass

# Launch streamlit in background
streamlit_process = subprocess.Popen(
    [
        "streamlit",
        "run",
        "lab_helpers/lab_05/streamlit_app.py",
        "--server.port",
        "8501",
    ],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    cwd=os.getcwd(),
)

time.sleep(5)

# Get the accessible URL
streamlit_url = get_streamlit_url()

print("✅ Streamlit app launched!")
print("\n" + "=" * 80)
print(f"🌐 Access the chat interface at:\n{streamlit_url}")
print("=" * 80)
print("\n💡 Tips:")
print("   • The app uses the same gateway and authentication as the notebook")
print("   • Try queries like: 'What issues do you see in the CRM application?'")
print("   • Click 'Clear Chat History' in sidebar to reset conversation")
print("\n⚠️  To stop the app, run the cleanup cell below")
```

### 9.4 Architecture: Streamlit Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER (Web Browser)                           │
│                    http://localhost:8501                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    STREAMLIT APP                                │
│  • Chat interface with streaming                                │
│  • Loads gateway_config.json                                    │
│  • Authenticates with Cognito                                   │
│  • Creates MCP client with JWT                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ MCP + JWT
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CENTRAL GATEWAY                              │
│  • Validates JWT via interceptor                                │
│  • Routes to appropriate agent                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────┴────────┬────────────────┐
                    ↓                 ↓                ↓
              Diagnostics       Remediation      Prevention
              (Lambda)          (Runtime)        (Runtime)
```

**Key Features:**

- **Real-time Streaming**: See agent responses as they're generated
- **Chat History**: Maintains conversation context
- **Tool Visibility**: Shows which tools are being called in sidebar
- **Error Handling**: Graceful error messages with retry suggestions
- **OAuth Integration**: Automatic token management via Cognito

### 9.5 Stop Streamlit App

```python
# Stop the streamlit process
try:
    streamlit_process.terminate()
    streamlit_process.wait(timeout=5)
    print("✅ Streamlit app stopped")
except:
    subprocess.run(["pkill", "-f", "streamlit"], check=False)
    print("✅ Streamlit processes killed")
```

```python
# Try url with both port 80 and 8080
print(f"Click here to access the CRM App UI: '{get_app_url()}'")
```

## 10. Cleanup

```python
# Cleanup Lab 05a resources only
print("🗑️  Cleaning up...")

# Find gateway with 'aiml301-central-gateway' in the ID
central_gateway_id = None
try:
    gateways = agentcore.list_gateways().get("items", [])
    for gateway in gateways:
        if "aiml301-central-gateway" in gateway.get("gatewayId", ""):
            central_gateway_id = gateway["gatewayId"]
            print(f"Found central gateway: {central_gateway_id}")
            break
except Exception as e:
    print(f"Error finding gateway: {e}")

if central_gateway_id:
    # Delete all targets first
    try:
        targets = agentcore.list_gateway_targets(gatewayIdentifier=central_gateway_id).get("items", [])
        print(f"Found {len(targets)} targets to delete")
        for target in targets:
            target_id = target["targetId"]
            print(f"Deleting target: {target_id}")
            agentcore.delete_gateway_target(gatewayIdentifier=central_gateway_id, targetId=target_id)
            time.sleep(2)
        print("✅ All targets deleted")
    except Exception as e:
        print(f"Error deleting targets: {e}")

    # Wait for targets to fully delete
    time.sleep(5)

    # Delete gateway
    try:
        print(f"Deleting gateway: {central_gateway_id}")
        response = agentcore.delete_gateway(gatewayIdentifier=central_gateway_id)
        print(f"Gateway delete response: {response}")
        time.sleep(3)
        print("✅ Gateway deleted")
    except Exception as e:
        print(f"❌ Error deleting gateway: {e}")
        import traceback

        traceback.print_exc()
else:
    print("⚠️  No gateway found with 'aiml301-central-gateway' in ID")

print("✅ Cleanup complete")
```
