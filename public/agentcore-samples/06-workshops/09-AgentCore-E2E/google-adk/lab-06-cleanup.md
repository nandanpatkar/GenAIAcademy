# 🧹 AgentCore End-to-End Cleanup

This notebook provides a comprehensive cleanup process for all resources created during the AgentCore End-to-End tutorial.

## Overview

This cleanup process will remove:
- **Memory**: AgentCore Memory resources and stored data
- **Runtime**: Agent runtime instances and ECR repositories
- **Security**: Execution roles, and Authorization Provider resources
- **Observability**: CloudWatch log groups and streams
- **Local Files**: Generated configuration and code files

⚠️ **Important**: This cleanup is irreversible. Make sure you have saved any important data (if needed) before proceeding.

---

## Step 1: Import Required Dependencies

Load all necessary modules and helper functions for the cleanup process.

```python
# Note: Uncomment and run only for self-paced labs
# !aws sts get-caller-identity

# Install required packages
# %pip install -r requirements.txt -q
```

```python
import json

from lab_helpers.lab2_memory import REGION
from lab_helpers.utils import (
    delete_agentcore_runtime_execution_role,
    delete_ssm_parameter,
    cleanup_cognito_resources,
    get_customer_support_secret,
    delete_customer_support_secret,
    agentcore_memory_cleanup,
    gateway_target_cleanup,
    runtime_resource_cleanup,
    delete_observability_resources,
    local_file_cleanup,
    get_ssm_parameter,
)

print("✅ Dependencies imported successfully")
print(f"🌍 Working in region: {REGION}")
```

## Step 2: Clean Up Memory Resources

Remove AgentCore Memory resources and associated data.

```python
print("🧠 Starting Memory cleanup...")
agentcore_memory_cleanup(get_ssm_parameter("/app/customersupport/agentcore/memory_id"))
```

## Step 3: Clean Up Runtime Resources

Remove the AgentCore Runtime, ECR repository, and associated AWS resources.

```python
print("🚀 Starting Runtime cleanup...")
runtime_resource_cleanup(get_ssm_parameter("/app/customersupport/agentcore/runtime_arn"))
```

## Step 4: Clean Up Gateway Resources
Remove targets, Gateway

```python
# Optional
# print("⚙️ Starting Policy Engine Cleanup...")
# policy_engine_cleanup(get_ssm_parameter("/app/customersupport/agentcore/policy_engine_id"))

print("⚙️ Starting Gateway Cleanup...")
gateway_target_cleanup(get_ssm_parameter("/app/customersupport/agentcore/gateway_id"))
```

## Step 5: Clean Up Security Resources

Remove execution roles, and authentication resources.

```python
print("🛡️  Starting Security cleanup...")
try:
    # bedrock_client = boto3.client("bedrock", region_name=REGION)

    # Delete execution role
    print("  🗑️  Deleting AgentCore Runtime execution role...")
    delete_agentcore_runtime_execution_role()
    print("  ✅ Execution role deleted")

    # Delete SSM parameter
    print("  🗑️  Deleting SSM parameter...")
    delete_ssm_parameter("/app/customersupport/agentcore/runtime_arn")
    print("  ✅ SSM parameter deleted")

    # Clean up Cognito and secrets
    print("  🗑️  Cleaning up Cognito resources...")
    cs = json.loads(get_customer_support_secret())
    cleanup_cognito_resources(cs["pool_id"])
    print("  ✅ Cognito resources cleaned up")

    print("  🗑️  Deleting customer support secret...")
    delete_customer_support_secret()
    print("  ✅ Customer support secret deleted")

except Exception as e:
    print(f"  ⚠️  Error during security cleanup: {e}")
```

## Step 6: Clean Up Local Files

Remove generated configuration and code files from the local directory.

```python
print("📁 Starting Local Files cleanup...")
local_file_cleanup()
```

## Step 7: Clean Up Observability Resources

Remove CloudWatch log groups and streams used for agent monitoring.

```python
print("📊 Starting Observability cleanup...")

delete_observability_resources()
```

## 🎉 Cleanup Complete!

All AgentCore resources have been cleaned up. Here's a summary of what was removed:

```python
print("\n" + "=" * 60)
print("🧹 CLEANUP COMPLETED SUCCESSFULLY! 🧹")
print("=" * 60)
print()
print("📋 Resources cleaned up:")
print("  🧠 Memory: AgentCore Memory resources and data")
print("  🚀 Runtime: Agent runtime and ECR repository")
print("  🛡️ Security: Roles, and SSM secrets")
print("  📊 Observability: CloudWatch logs")
print("  📁 Files: Local configuration files")
print()
print("✨ Your AWS account is now clean and ready for new experiments!")
print("\nThank you for completing the AgentCore End-to-End tutorial! 🚀")
```
