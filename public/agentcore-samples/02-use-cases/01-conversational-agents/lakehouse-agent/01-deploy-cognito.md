# Deploy Cognito

Set up user authentication with AWS Cognito.

## Prerequisites

- ✅ AWS credentials configured (via AWS CLI, environment variables, or `.env` file)
- ✅ Python 3.10+ with virtual environment and dependencies installed

## What This Notebook Does

1. Creates Cognito User Pool with OAuth clients
2. Creates groups (policyholders, adjusters, administrators)
3. Creates test users
4. Saves configuration to SSM

## Next Notebook

- **02-deploy-iam-roles.ipynb**

```python
!pip install -r requirements.txt
```

```python
# AWS Initialization - Load credentials and create session
from utils.notebook_init import init_aws

# This will:
# 1. Load credentials from .env file (if it exists)
# 2. Create and validate AWS session (env vars take precedence over SSO)
# 3. Return session, region, and account_id for use in this notebook
session, region, account_id = init_aws()

# Initialize AWS clients
cognito_client = session.client("cognito-idp", region_name=region)
ssm_client = session.client("ssm", region_name=region)

print("✅ Ready to proceed with AWS operations")
print(f"   Account ID: {account_id}")
print(f"   Region: {region}")
```

## Step 1: Run Cognito Setup

```python
import subprocess

result = subprocess.run(
    ["python", "setup_cognito.py"],
    cwd="deployment/1-cognito-setup",
    capture_output=True,
    text=True,
)

print(result.stdout)
if result.returncode != 0:
    print("❌ Error:", result.stderr)
else:
    print("\n✅ Cognito setup complete!")
    print("\n📋 Configuration automatically saved to SSM Parameter Store")
```

## Step 2: Verify Cognito Configuration in SSM

The setup_cognito.py script automatically saves all configuration to SSM Parameter Store.
Run this cell to verify the parameters were saved correctly.

```python
# Verify Cognito Configuration in SSM Parameter Store

print("Verifying Cognito parameters in SSM Parameter Store...\n")

# List of parameters to check
parameters_to_check = [
    "/app/lakehouse-agent/cognito-user-pool-id",
    "/app/lakehouse-agent/cognito-app-client-id",
    "/app/lakehouse-agent/cognito-domain",
    "/app/lakehouse-agent/cognito-resource-server-id",
]

# Check each parameter
all_found = True
for param_name in parameters_to_check:
    try:
        response = ssm_client.get_parameter(Name=param_name)
        value = response["Parameter"]["Value"]
        # Mask sensitive values
        display_value = value[:30] + "..." if len(value) > 30 else value
        print(f"✅ {param_name}")
        print(f"   Value: {display_value}")
    except ssm_client.exceptions.ParameterNotFound:
        print(f"❌ {param_name} - NOT FOUND")
        all_found = False
    except Exception as e:
        print(f"⚠️  {param_name} - ERROR: {e}")
        all_found = False

# Check secure parameters (without displaying values)
secure_params = [
    "/app/lakehouse-agent/cognito-app-client-secret",
]

for param_name in secure_params:
    try:
        response = ssm_client.get_parameter(Name=param_name, WithDecryption=False)
        print(f"✅ {param_name} (SecureString)")
        print("   Value: ***MASKED***")
    except ssm_client.exceptions.ParameterNotFound:
        print(f"❌ {param_name} - NOT FOUND")
        all_found = False
    except Exception as e:
        print(f"⚠️  {param_name} - ERROR: {e}")

if all_found:
    print("\n✅ All Cognito parameters verified in SSM Parameter Store!")
else:
    print("\n⚠️  Some parameters are missing. Re-run the setup_cognito.py script.")
```

## (Optional) Step 3: Deploy Login Audit Tracking

This optional step enables login audit logging for the lakehouse agent. When enabled, every user login through Cognito is recorded in a DynamoDB table (`lakehouse_user_login_audit`), which administrators can query through the agent's `query_login_audit` MCP tool.

**How it works:**
1. A DynamoDB table (`lakehouse_user_login_audit`) is created to store login events with TTL-based expiration
2. A Lambda function (`lakehouse-cognito-post-auth`) is deployed that writes login records on each authentication
3. The Lambda is registered as a Cognito Post-Authentication trigger, so it fires automatically after every successful login
4. Administrators can then ask the agent questions like "show me recent login activity" and the `query_login_audit` tool will query this table

**Resources created:**
- DynamoDB table: `lakehouse_user_login_audit` (PAY_PER_REQUEST, TTL enabled)
- Lambda function: `lakehouse-cognito-post-auth`
- IAM role: `lakehouse-cognito-post-auth-role`
- Cognito Post-Authentication trigger

**Skip this step** if you don't need login history tracking. The rest of the system works without it.

```python
import subprocess
import os

# Ensure aws CLI is on PATH for the bash subprocess
env = os.environ.copy()
env["PATH"] = "/opt/homebrew/bin:/usr/local/bin:" + env.get("PATH", "")

print("🚀 Deploying Login Audit Lambda and DynamoDB table...\n")

result = subprocess.run(
    ["bash", "deploy_post_auth_lambda.sh"],
    cwd="deployment/1-cognito-setup",
    capture_output=True,
    text=True,
    env=env,
)

print(result.stdout)
if result.returncode != 0:
    print("❌ Error:", result.stderr)
else:
    print("\n✅ Login audit Lambda deployed!")
```

```python
# Configure Cognito Post-Authentication trigger
print("🔗 Configuring Cognito Post-Authentication trigger...\n")

result = subprocess.run(
    ["python", "setup_cognito.py", "--add-post-auth-trigger"],
    cwd="deployment/1-cognito-setup",
    capture_output=True,
    text=True,
)

print(result.stdout)
if result.returncode != 0:
    print("❌ Error:", result.stderr)
else:
    print("\n✅ Post-Authentication trigger configured!")
    print("   Login events will now be recorded to DynamoDB table: lakehouse_user_login_audit")
```

## Summary

✅ **Cognito Deployment Complete!**

**Test Users Created:**
- policyholder001@example.com / TempPass123! → policyholders group
- policyholder002@example.com / TempPass123! → policyholders group
- adjuster001@example.com / TempPass123! → adjusters group
- adjuster002@example.com / TempPass123! → adjusters group
- admin@example.com / TempPass123! → administrators group

**Next Steps:**
Run **02-deploy-iam-roles.ipynb**
