# Deploy Lakehouse Agent

Deploy the Lakehouse Agent to AgentCore Runtime.

## Prerequisites

- ✅ Run `05-deploy-gateway.ipynb` first
- ✅ Gateway ARN saved to SSM
- ✅ Docker installed and running

## What This Notebook Does

1. Deploys Lakehouse Agent to AgentCore Runtime
2. Configures Gateway integration
3. Saves Agent Runtime ARN to SSM

## Next Notebook

- **07-streamlit-ui.ipynb**

```python
# AWS Initialization - Load credentials and create session
from utils.notebook_init import init_aws

# This will:
# 1. Load credentials from .env file (if it exists)
# 2. Create and validate AWS session (env vars take precedence over SSO)
# 3. Return session, region, and account_id for use in this notebook
session, region, account_id = init_aws()

# Initialize AWS clients
ssm_client = session.client("ssm", region_name=region)

# Load Gateway ARN from SSM
try:
    gateway_arn = ssm_client.get_parameter(Name="/app/lakehouse-agent/gateway-arn")["Parameter"]["Value"]
    print("✅ Ready to proceed with AWS operations")
    print(f"   Account ID: {account_id}")
    print(f"   Region: {region}")
    print(f"   Gateway ARN: {gateway_arn}")
except ssm_client.exceptions.ParameterNotFound:
    print("✅ Ready to proceed with AWS operations")
    print(f"   Account ID: {account_id}")
    print(f"   Region: {region}")
    print("❌ Gateway ARN not found in SSM")
    print("   Please run 05-deploy-gateway.ipynb first")
    gateway_arn = None
```

## Step 1: Deploy Lakehouse Agent

```python
import subprocess

# Run deploy_lakehouse_agent.py with --yes flag to skip interactive prompts
result = subprocess.run(
    ["python", "deploy_lakehouse_agent.py", "--yes"],
    cwd="deployment/6-lakehouse-agent",
    capture_output=True,
    text=True,
)

print(result.stdout)
if result.returncode != 0:
    print("❌ Error:", result.stderr)
else:
    print("\n✅ Lakehouse Agent deployed!")
    print("\n📋 Configuration automatically saved to SSM")
```

## Step 2: Verify Agent Deployment

The deploy_lakehouse_agent.py script automatically saves the Runtime ARN to SSM.
Run this cell to verify the deployment.

```python
# Verify Agent configuration in SSM
print("Verifying Agent Runtime configuration in SSM...\n")

parameters_to_check = [
    "/app/lakehouse-agent/agent-runtime-arn",
    "/app/lakehouse-agent/agent-runtime-id",
    "/app/lakehouse-agent/agent-name",
]

all_found = True
for param_name in parameters_to_check:
    try:
        response = ssm_client.get_parameter(Name=param_name)
        value = response["Parameter"]["Value"]
        print(f"✅ {param_name}")
        print(f"   Value: {value}")
    except ssm_client.exceptions.ParameterNotFound:
        print(f"⚠️  {param_name} - NOT FOUND (optional)")
        if "agent-runtime-arn" in param_name:
            all_found = False
    except Exception as e:
        print(f"⚠️  {param_name} - ERROR: {e}")

if all_found:
    print("\n✅ Agent Runtime configuration verified in SSM!")
else:
    print("\n❌ Agent Runtime ARN missing in SSM.")
    print("    The deploy_lakehouse_agent.py script should have saved this automatically.")
    print("    Check the deployment output for errors.")
```

## Summary

✅ **Lakehouse Agent Deployment Complete!**

The Agent Runtime has been deployed and configuration saved to SSM Parameter Store.

**Next Steps:**
Run **07-streamlit-ui.ipynb** to test the complete system
