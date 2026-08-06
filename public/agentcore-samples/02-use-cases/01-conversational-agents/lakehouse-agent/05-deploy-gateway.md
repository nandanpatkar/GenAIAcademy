# Deploy Gateway & Interceptors

Deploy the AgentCore Gateway with request and response interceptor Lambdas.

## Prerequisites

- ✅ Run `04-deploy-mcp-server.ipynb` first
- ✅ MCP Server Runtime ARN saved to SSM

## What This Notebook Does

1. Deploys request interceptor Lambda (JWT validation, token exchange)
2. Creates DynamoDB tenant-to-role mapping table
3. Deploys response interceptor Lambda (tool filtering)
4. Creates AgentCore Gateway
5. Saves Gateway ARN to SSM

## Next Notebook

- **06-deploy-agent.ipynb**

```python
# AWS Initialization - Load credentials and create session
from utils.notebook_init import init_aws

# This will:
# 1. Load credentials from .env file (if it exists)
# 2. Create and validate AWS session (env vars take precedence over SSO)
# 3. Return session, region, and account_id for use in this notebook
session, AWS_REGION, AWS_ACCOUNT_ID = init_aws()

# Initialize AWS clients
lambda_client = session.client("lambda", region_name=AWS_REGION)
ssm_client = session.client("ssm", region_name=AWS_REGION)

print("✅ Ready to proceed with AWS operations")
print(f"   Account ID: {AWS_ACCOUNT_ID}")
print(f"   Region: {AWS_REGION}")
```

## Step 1: Deploy Request Interceptor Lambda

```python
import subprocess

# Run deploy_interceptor.py to deploy Lambda function
result = subprocess.run(
    ["bash", "deploy.sh"],
    cwd="deployment/5-gateway-setup/interceptor-request",
    capture_output=True,
    text=True,
)

print(result.stdout)
if result.returncode != 0:
    print("❌ Error:", result.stderr)
else:
    print("\n✅ Interceptor Lambda deployed!")
```

## Step 2: Deploy Response Interceptor Lambda

```python
# Deploy response interceptor Lambda
result = subprocess.run(
    ["bash", "deploy.sh"],
    cwd="deployment/5-gateway-setup/interceptor-response",
    capture_output=True,
    text=True,
)

print(result.stdout)
if result.returncode != 0:
    print("❌ Error:", result.stderr)
else:
    print("\n✅ Response Interceptor Lambda deployed!")
```

## Step 3: Get Required ARNs

```python
# Get Interceptor Lambda ARN from SSM (saved by deploy_interceptor.py)
INTERCEPTOR_ARN = ssm_client.get_parameter(Name="/app/lakehouse-agent/interceptor-lambda-arn")["Parameter"]["Value"]
print(f"✅ Interceptor ARN: {INTERCEPTOR_ARN}")

# Get MCP Server Runtime ARN from SSM
MCP_SERVER_RUNTIME_ARN = ssm_client.get_parameter(Name="/app/lakehouse-agent/mcp-server-runtime-arn")["Parameter"][
    "Value"
]
print(f"✅ MCP Server ARN: {MCP_SERVER_RUNTIME_ARN}")

# Get Cognito User Pool ARN
COGNITO_USER_POOL_ID = ssm_client.get_parameter(Name="/app/lakehouse-agent/cognito-user-pool-id")["Parameter"]["Value"]
COGNITO_USER_POOL_ARN = f"arn:aws:cognito-idp:{AWS_REGION}:{AWS_ACCOUNT_ID}:userpool/{COGNITO_USER_POOL_ID}"
print(f"✅ Cognito User Pool ARN: {COGNITO_USER_POOL_ARN}")
```

## Step 4: Create AgentCore Gateway

This will create the gateway and automatically configure it with the MCP server and interceptor.

```python
# Create AgentCore Gateway
result = subprocess.run(
    [
        "python",
        "create_gateway.py",
        "--yes",  # Auto-confirm for notebook execution
    ],
    cwd="deployment/5-gateway-setup",
    capture_output=True,
    text=True,
)

print(result.stdout)
if result.returncode != 0:
    print("❌ Error:", result.stderr)
else:
    print("\n✅ Gateway created!")
    print("\n📋 Gateway ARN saved to SSM Parameter Store")
```

## Step 5: Verify Gateway Configuration

The create_gateway.py script automatically saves the Gateway ARN to SSM.
Run this cell to verify the deployment.

```python
# Verify Gateway configuration in SSM
print("Verifying Gateway configuration in SSM...\n")

parameters_to_check = [
    "/app/lakehouse-agent/gateway-arn",
    "/app/lakehouse-agent/gateway-id",
    "/app/lakehouse-agent/gateway-url",
]

all_found = True
for param_name in parameters_to_check:
    try:
        response = ssm_client.get_parameter(Name=param_name)
        value = response["Parameter"]["Value"]
        print(f"✅ {param_name}")
        print(f"   Value: {value}")
    except ssm_client.exceptions.ParameterNotFound:
        print(f"❌ {param_name} - NOT FOUND")
        all_found = False
    except Exception as e:
        print(f"⚠️  {param_name} - ERROR: {e}")
        all_found = False

if all_found:
    print("\n✅ Gateway configuration verified in SSM!")
else:
    print("\n⚠️  Gateway parameters missing.")
    print("    The create_gateway.py script should have saved these automatically.")
    print("    Check the deployment output for errors.")
```

## Summary

✅ **Gateway & Interceptor Deployment Complete!**

**What was created:**
- Request Interceptor Lambda (JWT validation, token exchange, DynamoDB tenant mapping)
- Response Interceptor Lambda (tool filtering by user group)
- AgentCore Gateway (routing)

All configuration saved to SSM Parameter Store.

**Next Steps:**
Run **06-deploy-agent.ipynb**
