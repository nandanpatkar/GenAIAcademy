# Step 4: Deploy MCP Server

Deploy the MCP Athena Server to AgentCore Runtime.

## Prerequisites

- ✅ Run `03-deploy-s3tables.ipynb` first
- ✅ Docker installed and running

## What This Notebook Does

1. Deploys MCP Server to AgentCore Runtime
2. Configures JWT authentication with Cognito
3. Saves Runtime ARN to SSM

## Next Notebook

- **05-deploy-gateway.ipynb**

```python
# AWS Initialization - Load credentials and create session
from utils.notebook_init import init_aws
import os

# This will:
# 1. Load credentials from .env file (if it exists)
# 2. Create and validate AWS session (env vars take precedence over SSO)
# 3. Return session, region, and account_id for use in this notebook
session, region, account_id = init_aws()

# Initialize AWS clients
ssm_client = session.client("ssm", region_name=region)
os.environ["AWS_DEFAULT_REGION"] = region

print("✅ Ready to proceed with AWS operations")
print(f"   Account ID: {account_id}")
print(f"   Region: {region}")
```

## Step 1: Deploy MCP Server

```python
import subprocess

# Run deploy_runtime.py with --yes flag to skip interactive confirmation
# This allows the script to run without blocking in the notebook
result = subprocess.run(
    ["python", "deploy_runtime.py", "--yes"],
    cwd="deployment/4-mcp-lakehouse-server",
    capture_output=True,
    text=True,
)

print(result.stdout)
if result.returncode != 0:
    print("❌ Error:", result.stderr)
else:
    print("\n✅ MCP Server deployed!")
    print("\n📋 Runtime configuration saved to SSM Parameter Store")
```

## Step 2: Verify MCP Server Deployment

The deploy_runtime.py script automatically saves the Runtime ARN to SSM.
Run this cell to verify the deployment.

```python
# Verify MCP Server Runtime configuration in SSM
print("Verifying MCP Server Runtime in SSM...\n")

parameters_to_check = [
    "/app/lakehouse-agent/mcp-server-runtime-arn",
    "/app/lakehouse-agent/mcp-server-runtime-id",
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
    print("\n✅ MCP Server Runtime configuration verified in SSM!")
else:
    print("\n⚠️  MCP Server Runtime parameters missing.")
    print("    The deploy_runtime.py script should have saved these automatically.")
    print("    Check the deployment output for errors.")
```

## Summary

✅ **MCP Server Deployment Complete!**

The MCP Server Runtime has been deployed and configuration saved to SSM Parameter Store.

**Next Steps:**
Run **05-deploy-gateway.ipynb** to deploy the AgentCore Gateway
