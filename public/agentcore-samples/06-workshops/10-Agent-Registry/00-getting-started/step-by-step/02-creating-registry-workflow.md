# 02 - Creating Registry as Admin

This notebook walks through the creation of a new AWS Agent Registry using Admin Persona and highlights different API operations associated with Registry. 

## What You'll Learn

- Create and configure a **Registry** using admin persona
- List registries in your account
- Update registry configuration

## Prerequisites

- boto3 >= 1.42.87
- Execute [notebook 01](01-create-user-personas-workflow.ipynb) to create IAM roles for admin, publisher and consumer personas

## Admin API References

| # | API | Description |
|---|-----|-------------|
| 1 | [CreateRegistry](https://docs.aws.amazon.com/boto3/latest/reference/services/bedrock-agentcore-control/client/create_registry.html) | Create a new registry with approval configuration |
| 2 | [GetRegistry](https://docs.aws.amazon.com/boto3/latest/reference/services/bedrock-agentcore-control/client/get_registry.html) | Fetch registry details and poll for READY status |
| 3 | [ListRegistries](https://docs.aws.amazon.com/boto3/latest/reference/services/bedrock-agentcore-control/client/list_registries.html) | List all registries in the account |
| 4 | [UpdateRegistry](https://docs.aws.amazon.com/boto3/latest/reference/services/bedrock-agentcore-control/client/update_registry.html) | Update registry description or approval config |
| 5 | [DeleteRegistry](https://docs.aws.amazon.com/boto3/latest/reference/services/bedrock-agentcore-control/client/delete_registry.html) | Delete a registry by ID |
| 6 | [ListRegistryRecords](https://docs.aws.amazon.com/boto3/latest/reference/services/bedrock-agentcore-control/client/list_registry_records.html) | List all records in a registry (cleanup) |
| 7 | [DeleteRegistryRecord](https://docs.aws.amazon.com/boto3/latest/reference/services/bedrock-agentcore-control/client/delete_registry_record.html) | Delete a specific record from a registry (cleanup) |

#### Notebook Chain

**02 (this notebook)** → 03 (publish records) → 04 (admin approval) → 05 (semantic search)

#### Use Case: Enterprise Payment Processing
**Admin Persona:** AnyCompany's administrator creates a centralized registry for payment processing agents and tools. This enables customer service AI agents to discover and use standardized payment, refund, and transaction capabilities — without requiring individual integrations per deployment.

---
## 1. Install boto3 SDK and dependencies

Install core dependencies (`boto3` and `python-dotenv`).

```python
!pip install boto3 python-dotenv --force-reinstall
```

## 2. Initialize boto3 Session as Admin

Assume the `admin_persona` IAM role and create a boto3 session with temporary credentials. All subsequent API calls use this session.

```python
import boto3
import time
import utils
import os

AWS_REGION = os.environ.get("AWS_DEFAULT_REGION", "us-west-2")

# Auto-detect account ID from current credentials
sts = boto3.client("sts", region_name=AWS_REGION)
ACCOUNT_ID = sts.get_caller_identity()["Account"]
CALLER_ARN = sts.get_caller_identity()["Arn"]

ADMIN_ROLE_ARN = f"arn:aws:iam::{ACCOUNT_ID}:role/admin_persona"

print(f"Account:  {ADMIN_ROLE_ARN}")

# Assume the Admin role
creds = utils.assume_role(
    role_arn=ADMIN_ROLE_ARN,
    session_name="admin-session",
)

admin_session = boto3.Session(
    aws_access_key_id=creds["AccessKeyId"],
    aws_secret_access_key=creds["SecretAccessKey"],
    aws_session_token=creds["SessionToken"],
    region_name=AWS_REGION,
)
```

## 3. Initialize the Control Plane Client

The control plane (`bedrock-agentcore-control`) handles CRUD operations for registries and records.

```python
# Control plane client (admin operations)
cp_client = admin_session.client("bedrock-agentcore-control")
```

---
## 4. Create a Registry

As an admin, you can create the registry that publishers can submit records to.

Setting `autoApproval: False` is the default — records require explicit admin approval before becoming searchable.

```python
NEW_REGISTRY_NAME = "AWSAgentRegistry"  # Change this
NEW_REGISTRY_DESCRIPTION = "Registry created during the getting-started workshop"  # Change this

print(f"This will create registry: {NEW_REGISTRY_NAME}\n")

resp = cp_client.create_registry(
    name=NEW_REGISTRY_NAME,
    description=NEW_REGISTRY_DESCRIPTION,
    approvalConfiguration={"autoApproval": False},
)

REGISTRY_ARN = resp["registryArn"]
REGISTRY_ID = REGISTRY_ARN.split("/")[-1]

print(f"Created registry: {NEW_REGISTRY_NAME} (ID: {REGISTRY_ID})")
```

### 4.1 Wait for Registry to be Ready

Registry creation is asynchronous. Poll `GetRegistry` until the status transitions from `CREATING` to `READY`.

```python
while True:
    r = cp_client.get_registry(registryId=REGISTRY_ID)
    if r["status"] == "READY":
        print("Registry is READY")
        break
    print(f"Status: {r['status']} - waiting...")
    time.sleep(3)
```

### 4.2 Inspect Registry Details

Fetch the full registry object to confirm the name, description, approval configuration, and timestamps.

```python
registry = cp_client.get_registry(registryId=REGISTRY_ID)
utils.pp(registry)
```


## 5. List Registries

List all registries in your account. You can filter by status (`CREATING` or `READY`).

```python
# List all registries
registries = cp_client.list_registries()
print(f"Found {len(registries.get('registries', []))} registries:\n")
print(f"{'#':<4} {'Name':<30} {'Registry ID':<20} {'Status':<18} {'Created At':<28} {'Updated At'}")
print("-" * 140)
for i, reg in enumerate(registries.get("registries", []), 1):
    print(
        f"{i:<4} {reg['name']:<30} {reg['registryId']:<20} {reg['status']:<18} {str(reg.get('createdAt', 'N/A')):<28} {str(reg.get('updatedAt', 'N/A'))}"
    )
```


## 6. Update Registry Configuration

The following example highlights changing Registry description.

```python
updated = cp_client.update_registry(
    registryId=REGISTRY_ID,
    description={"optionalValue": "Registry created and updated"},
)

print(f"Registry entry updated with New description: {updated['description']}")
print(f"Updated at: {updated['updatedAt']}")

registry = cp_client.get_registry(registryId=REGISTRY_ID)
utils.pp(registry)
```

### 6.1 Verify the Update

Re-fetch the registry to confirm the description change was applied.

```python
registry = cp_client.get_registry(registryId=REGISTRY_ID)
utils.pp(registry)
```

---
## 7. Deleting a Registry and Its Records (Run with Caution)

A registry can be deleted when it's in a terminal/settled state.

Do not attempt to delete when it's in a transitional state like `CREATING`, `UPDATING`, or `DELETING` — the service is still processing and the delete call will likely fail or conflict.

| Status | Type | Description |
|--------|------|-------------|
| `CREATING` | Transitional | Registry is being provisioned |
| `READY` | Terminal | Registry is active and usable |
| `UPDATING` | Transitional | A registry update is in progress |
| `DELETING` | Transitional | Registry deletion is in progress |
| `CREATE_FAILED` | Terminal | Registry provisioning failed |
| `UPDATE_FAILED` | Terminal | A registry update failed |
| `DELETE_FAILED` | Terminal | A registry deletion failed |

⚠️ Uncomment the code below to delete all records in the registry, then the registry itself.

```python
# import botocore.exceptions

# REGISTRY_ID = "xa9Ms0EuuzddjpSF" # You can update with specific Registry ID.

# try:
#     # Check registry status first
#     reg = cp_client.get_registry(registryId=REGISTRY_ID)
#     reg_status = reg.get("status", "")

#     if reg_status == "CREATE_FAILED":
#         cp_client.delete_registry(registryId=REGISTRY_ID)
#         print(f"Deleted registry in {reg_status} state.")
#     else:
#         # Delete all records in the registry
#         records = cp_client.list_registry_records(registryId=REGISTRY_ID)
#         for rec in records["registryRecords"]:
#             cp_client.delete_registry_record(
#                 registryId=REGISTRY_ID,
#                 recordId=rec["recordId"]
#             )
#             print(f"Deleted record: {rec['recordId']}")

#         # Delete the registry
#         cp_client.delete_registry(registryId=REGISTRY_ID)
#         print(f"Deleted registry: {REGISTRY_ID}")

#     print("\nCleanup complete!")

# except cp_client.exceptions.ResourceNotFoundException:
#     print(f"Registry {REGISTRY_ID} not found - already cleaned up.")
# except botocore.exceptions.ClientError as e:
#     print(f"Error during cleanup: {e}")

# # List all registries
# registries = cp_client.list_registries()
# print(f"Found {len(registries.get('registries', []))} registries:\n")
# print(f"{'#':<4} {'Name':<30} {'Registry ID':<20} {'Status':<18} {'Created At':<28} {'Updated At'}")
# print("-" * 140)
# for i, reg in enumerate(registries.get('registries', []), 1):
#     print(f"{i:<4} {reg['name']:<30} {reg['registryId']:<20} {reg['status']:<18} {str(reg.get('createdAt','N/A')):<28} {str(reg.get('updatedAt','N/A'))}")
```

## Pre-requisites
- **Notebook 01** — [Create User Personas](01-create-user-personas-workflow.ipynb): Set up user personas: admin, publisher, consumer

## Next Steps
- **Notebook 03** — [Publishing Records](03-publishing-records-workflow.ipynb): Publish records as a Publisher
- **Notebook 04** — [Admin Approval](04-admin-approval-workflow.ipynb): Admin Approval workflow 
- **Notebook 05** — [Semantic Search](05-search-registry-workflow.ipynb): Search approved records using NLQ as a Consumer
