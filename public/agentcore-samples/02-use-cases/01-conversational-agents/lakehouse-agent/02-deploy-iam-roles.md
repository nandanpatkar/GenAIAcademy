# Deploy IAM Roles for Tenant Groups

Creates IAM roles for policyholders, adjusters, and administrators groups with Athena/S3 permissions.
These roles are required before setting up Lake Formation permissions on S3 Tables.

## Prerequisites

- ✅ AWS credentials configured (via AWS CLI, environment variables, or `.env` file)
- ✅ Python 3.10+ with virtual environment and dependencies installed
- ✅ Run `01-deploy-cognito.ipynb` first

## What This Notebook Does

1. Creates IAM roles for tenant groups (policyholders, adjusters, administrators)
2. Attaches Athena/S3 permissions to each role
3. Saves role ARNs to SSM Parameter Store

## Next Notebook

- **03-deploy-s3tables.ipynb**

```python
# AWS Initialization - Load credentials and create session
from utils.notebook_init import init_aws
import subprocess

session, region, account_id = init_aws()

# Initialize AWS clients
ssm_client = session.client("ssm", region_name=region)

print("✅ Ready to proceed with AWS operations")
print(f"   Account ID: {account_id}")
print(f"   Region: {region}")
```

## Step 1: Create Gateway Interceptor Lambda Role

The tenant roles need to trust the Gateway Interceptor Lambda role (so it can assume them during token exchange).
This role must exist before creating the tenant roles.

```python
import os

# Pass environment so subprocess inherits AWS credentials from init_aws()
env = os.environ.copy()

result = subprocess.run(
    ["python", "create_lambda_role.py"],
    cwd="deployment/5-gateway-setup",
    capture_output=True,
    text=True,
    env=env,
)

print(result.stdout)
if result.returncode != 0:
    print("❌ Error:", result.stderr)
else:
    print("\n✅ Gateway Interceptor Lambda role created!")
    print("⏳ Waiting for IAM role to propagate...")
    import time

    time.sleep(10)
```

## Step 2: Deploy IAM Tenant Roles

```python
result = subprocess.run(
    ["python", "setup_iam_roles.py"],
    cwd="deployment/2-lakehouse-tenant-roles-setup",
    capture_output=True,
    text=True,
)

print(result.stdout)
if result.returncode != 0:
    print("❌ Error:", result.stderr)
else:
    print("\n✅ IAM tenant roles created!")
    print("\n📋 Role ARNs saved to SSM Parameter Store")
```

## Step 2: Verify IAM Roles in SSM

```python
print("Verifying IAM role parameters in SSM...\n")

parameters_to_check = [
    "/app/lakehouse-agent/roles/lakehouse-policyholders-role",
    "/app/lakehouse-agent/roles/lakehouse-adjusters-role",
    "/app/lakehouse-agent/roles/lakehouse-administrators-role",
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
    print("\n✅ All IAM role parameters verified in SSM!")
else:
    print("\n⚠️  Some role parameters are missing. Re-run the setup script.")
```

## Summary

✅ **IAM Tenant Roles Deployment Complete!**

**Roles Created:**
- `lakehouse-policyholders-role`
- `lakehouse-adjusters-role`
- `lakehouse-administrators-role`

**Next Steps:**
Run **03-deploy-s3tables.ipynb** to create the S3 Tables database and tables.
