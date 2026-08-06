## CleanUp

```python
%store -r
```

```python
from helpers.utils import (
    delete_agentcore_runtime_execution_role,
    delete_ssm_parameter,
    cleanup_cognito_resources,
    get_cognito_secret,
    delete_cognito_secret,
    delete_observability_resources,
    local_file_cleanup,
    AWS_DOCS_ROLE_NAME,
    ORCHESTRATOR_ROLE_NAME,
    AWS_BLOG_ROLE_NAME,
    SSM_DOCS_AGENT_ARN,
    SSM_BLOGS_AGENT_ARN,
)

print("✅ Dependencies imported successfully")
```

```python
from pathlib import Path
from bedrock_agentcore_starter_toolkit.operations.runtime.destroy import (
    destroy_bedrock_agentcore,
)

print("🚀 Starting Runtime cleanup...")
destroy_bedrock_agentcore(
    config_path=Path(".bedrock_agentcore.yaml"),
    agent_name=MCP_AGENT_NAME,
    delete_ecr_repo=True,
)
```

```python
print("🚀 Starting Runtime cleanup...")
destroy_bedrock_agentcore(
    config_path=Path(".bedrock_agentcore.yaml"),
    agent_name=BLOG_AGENT_NAME,
    delete_ecr_repo=True,
)
```

```python
print("🚀 Starting Runtime cleanup...")
destroy_bedrock_agentcore(
    config_path=Path(".bedrock_agentcore.yaml"),
    agent_name=ORCHESTRATION_NAME,
    delete_ecr_repo=True,
)
```

```python
print("🛡️  Starting Security cleanup...")
import json

try:
    # bedrock_client = boto3.client("bedrock", region_name=REGION)

    # Delete execution role
    print("  🗑️  Deleting Agent 1 - AWS Docs execution role...")
    delete_agentcore_runtime_execution_role(AWS_DOCS_ROLE_NAME)
    print("  ✅ Execution role deleted")

    print("  🗑️  Deleting Agent 2 - AWS Blogs execution role...")
    delete_agentcore_runtime_execution_role(AWS_BLOG_ROLE_NAME)
    print("  ✅ Execution role deleted")

    print("  🗑️  Deleting Orchestration execution role...")
    delete_agentcore_runtime_execution_role(ORCHESTRATOR_ROLE_NAME)
    print("  ✅ Execution role deleted")

    # Clean up Cognito and secrets
    print("  🗑️  Cleaning up Cognito resources...")
    cs = json.loads(get_cognito_secret())
    cleanup_cognito_resources(cs["pool_id"])
    print("  ✅ Cognito resources cleaned up")

    print("  🗑️  Deleting customer support secret...")
    delete_cognito_secret()
    print("  ✅ Customer support secret deleted")

    print("  🗑️  Deleting SSM Parameter...")
    delete_ssm_parameter(SSM_DOCS_AGENT_ARN)
    print("  ✅ SSM parameter deleted")

    print("  🗑️  Deleting SSM Parameter...")
    delete_ssm_parameter(SSM_BLOGS_AGENT_ARN)
    print("  ✅ SSM parameter deleted")

except Exception as e:
    print(f"  ⚠️  Error during security cleanup: {e}")
```

```python
print("📁 Starting Local Files cleanup...")
local_file_cleanup()
```

```python
print("📊 Starting Observability cleanup...")
delete_observability_resources(MCP_AGENT_ID)
```

```python
print("📊 Starting Observability cleanup...")
delete_observability_resources(BLOG_AGENT_ID)
```

```python
print("📊 Starting Observability cleanup...")
delete_observability_resources(ORCHESTRATION_ID)
```
