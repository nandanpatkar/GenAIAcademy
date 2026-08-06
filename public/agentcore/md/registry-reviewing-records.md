# Reviewing registry records - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-reviewing-records.html

---

# Reviewing registry records

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

## Overview

As a curator, you review records in Pending Approval status against your organization’s standards for security, compliance, and metadata quality.

## View pending records

Filter by PENDING_APPROVAL status via console, AWS CLI, or ListRegistryRecords API.

## Approve a record

### Console

  1. Open the record detail page for a record in **Pending approval** status.

  2. Choose the **Update status** dropdown, then choose **Approve**.

  3. In the **Update status** dialog, enter a **Reason** for the status change.

  4. Choose **Update**.


### AWS CLI

```bash
aws bedrock-agentcore-control update-registry-record-status \
  --registry-id "<registryId>" \
  --record-id "<recordId>" \
  --status APPROVED \
  --status-reason "Reviewed and approved" \
  --region us-east-1
```
### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.update_registry_record_status(
    registryId='<registryId>',
    recordId='<recordId>',
    status='APPROVED',
    statusReason='Reviewed and approved'
)
print(f"Status: {response['status']}")  # APPROVED
print(f"StatusReason: {response['statusReason']}")
```
## Reject a record

### Console

  1. Open the record detail page for a record in **Pending approval** status.

  2. Choose the **Update status** dropdown, then choose **Reject**.

  3. In the **Update status** dialog, enter a **Reason** for the rejection.

  4. Choose **Update**.


### AWS CLI

```bash
aws bedrock-agentcore-control update-registry-record-status \
  --registry-id "<registryId>" \
  --record-id "<recordId>" \
  --status REJECTED \
  --status-reason "Missing tool input schemas" \
  --region us-east-1
```
### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.update_registry_record_status(
    registryId='<registryId>',
    recordId='<recordId>',
    status='REJECTED',
    statusReason='Missing tool input schemas'
)
print(f"Status: {response['status']}")  # REJECTED
print(f"StatusReason: {response['statusReason']}")
```
###### Note

Publisher can edit and resubmit, or curator can directly approve a rejected record.

