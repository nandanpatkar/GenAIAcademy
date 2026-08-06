# Create and manage records - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-create-manage-records.html

---

# Create and manage records  
  
###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

## Create a registry record

### Console

  1. Open the registry detail page.

  2. In the **Registry records** section, choose **Create record**.

  3. Choose a source type:

     1. **Synchronize from endpoint** — Provide an endpoint URL and optional credentials to invoke the endpoint, and the registry fetches metadata from the source. Available for MCP and Agent record types only. To update the record after the source changes, you must manually trigger synchronization. See [Synchronize records from external sources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-sync-records.html>) for details.

     2. **Manual** — Manually configure the record details and protocol configuration.


**Synchronize from endpoint**

  1. Under **Record details** , select the record type: **MCP** or **Agent**.

###### Note

Synchronization is only supported for MCP and Agent record types. Agent Skills and Custom record types do not support synchronization — use the Manual source type instead.

  2. Enter the **Endpoint** URL. Must be a valid HTTPS URL.

  3. Under **Credential type** , choose how the registry authorizes with the endpoint:

     1. **IAM** — Provide a **Role ARN** for SigV4 signing and a **Service** name (e.g., `bedrock-agentcore`, `execute-api`, `lambda`). Optionally specify a **Region** for signing.

     2. **OAuth** — Select or enter a **Credential provider** ARN from AgentCore Identity. Optionally configure **Scopes** and **Custom parameters** under Additional configuration.

     3. **None** — No authorization (for public endpoints).

  4. Choose **Create record**.

The record is created in CREATING status. The registry connects to the endpoint, extracts metadata, and populates the record’s descriptors. After synchronization completes, the record transitions to DRAFT. If synchronization fails, the record transitions to CREATE_FAILED status with the error details available in the Status Reason field on the record detail page. For troubleshooting, see [Record synchronization errors](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-troubleshooting.html#registry-troubleshooting-sync-errors>). To update the record when the source changes, use the **Sync** button on the record detail page or select **Re-sync from endpoint** during editing.


For AWS CLI and SDK examples of creating records with synchronization, see [Synchronize records from external sources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-sync-records.html>).

**Manual**

  1. Under **Record details** , enter:

     1. **Name** — Must start with a letter or digit. Valid characters are a-z, A-Z, 0-9, _ (underscore), - (hyphen), . (dot), and / (forward slash). The name can have up to 255 characters.

     2. **Description** (optional) — 1 to 4,096 characters.

     3. **Record version** — Specify the version of this record (e.g., 1.0.0, v2.1).

  2. Under **Record type** , select one of: **MCP** , **Agent** , **Agent Skills** , or **Custom**.

  3. A type-specific editor appears. Enter your protocol configuration in JSON format.

     1. For **Agent** and **MCP** types, toggle **Show official schema** to display the reference schema side-by-side for guidance.

     2. The console validates your JSON against the official schema and shows inline errors (e.g., "Missing property 'name'") with a **Diagnose with Amazon Q** button.

  4. Choose one of:

     1. **Create as draft** — Creates the record in Draft status.

     2. **Create and submit for approval** — Creates the record and immediately submits it for approval.


### AWS CLI

```bash
aws bedrock-agentcore-control create-registry-record \
  --registry-id <registryId> \
  --name "MyMCPServer" \
  --descriptor-type MCP \
  --descriptors '{"mcp": {"server": {"inlineContent": "{\"name\": \"my/mcp-server\", \"description\": \"My MCP server\", \"version\": \"1.0.0\"}"}}}' \
  --record-version "1.0" \
  --region us-east-1
```
### AWS SDK

```python
import boto3
import json

client = boto3.client('bedrock-agentcore-control')

server_content = json.dumps({
    "name": "my/mcp-server",
    "description": "My MCP server",
    "version": "1.0.0"
})

response = client.create_registry_record(
    registryId='<registryId>',
    name='MyMCPServer',
    descriptorType='MCP',
    descriptors={
        'mcp': {
            'server': {
                'inlineContent': server_content
            }
        }
    },
    recordVersion='1.0'
)
print(f"Record ARN: {response['recordArn']}")
print(f"Status: {response['status']}")  # CREATING
```
## List registry records

### Console

  1. Open the registry detail page.

  2. The **Registry records** section displays:

     1. **Status summary counters** — Total submitted, Pending approval, Approved, Deprecated, Rejected.

     2. **Records table** with columns: Name, Description, Status, Record type, Record ARN, Last updated.

  3. Use the **Search records** bar to filter by name.

  4. Use the **Update status** dropdown to perform bulk status changes on selected records.


### AWS CLI

```bash
aws bedrock-agentcore-control list-registry-records \
  --registry-id "<registryId>" \
  --region us-east-1
```
### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.list_registry_records(
    registryId='<registryId>'
)
for record in response['registryRecords']:
    print(f"{record['name']} - {record['status']} - {record['descriptorType']}")
```
## View record details

### Console

  1. From the registry detail page, choose a record name from the records table.

  2. The record detail page displays:

     1. **Record details** section — Name, Description, Record ARN, Status (shown as a badge next to the record name), Version, Last updated date, Record type, Record ID, Created date.

     2. **Synchronization configuration** section (if configured) — Synchronization type, Source URL, and credential provider details (IAM role ARN, service, region or OAuth provider ARN, grant type, scopes, custom parameters).

     3. **Protocol configuration** section — The descriptor content displayed as formatted JSON (e.g., "Agent card" for A2A records, "Server" and "Tools" for MCP records).

  3. Actions available:

     1. **Sync** button (MCP and Agent records only) — Triggers a fresh synchronization from the configured endpoint. Opens a confirmation dialog before proceeding. The record transitions to UPDATING status during synchronization.

     2. **Update status** dropdown — Submit for approval, Approve, Reject, or Deprecate.

     3. **Three-dot menu (⋮)** — Edit or Delete.


### AWS CLI

```bash
aws bedrock-agentcore-control get-registry-record \
  --registry-id "<registryId>" \
  --record-id "<recordId>" \
  --region us-east-1
```
### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.get_registry_record(
    registryId='<registryId>',
    recordId='<recordId>'
)
print(f"Name: {response['name']}")
print(f"Description: {response['description']}")
print(f"Status: {response['status']}")
print(f"Descriptor Type: {response['descriptorType']}")
print(f"Version: {response['recordVersion']}")
```
## Update a registry record

### Console

  1. From the record detail page, choose the three-dot menu (⋮), then choose **Edit**.

  2. On the **Edit record** page, update any of the following:

     1. **Name** , **Description** , **Record version** under Record details.

     2. **Record type** — Change the protocol type if needed.

  3. (MCP and Agent records only) Under **Synchronize from endpoint** , optionally configure synchronization:

You can update records via synchronization regardless of whether they were originally created with synchronization. When synchronization is triggered during an update, the record transitions to UPDATING status. If it succeeds, a new record version is created in DRAFT status. If it fails, the record transitions to UPDATE_FAILED status with error details in the Status Reason field. The synchronized data overwrites the record’s name, description, version, tool definitions, and server definitions with the values found at the source, but does not modify fields that the source does not provide. An admin or curator must review and approve the new draft for it to become visible in search. Until then, the previous approved revision (if any) remains searchable. For more information on dual-revision behavior, see [Record lifecycle](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-record-lifecycle.html>).

     1. Enter an **Endpoint** URL to enable synchronization. Credential type fields appear when an endpoint is provided. If the record already has synchronization configured, the endpoint and credential provider fields are pre-populated with the existing configuration.

     2. Choose a **Credential type** (IAM, OAuth, or None) and fill in the required fields. If the record was previously configured with a credential provider, the existing values are pre-filled.

     3. Select **Re-sync from endpoint** to trigger a fresh synchronization when saving. The record transitions to UPDATING status during synchronization.

     4. To remove synchronization, choose the clear button next to the endpoint field. This resets the endpoint and all credential fields.

  4. Under **Record configuration** , update the record’s definitions in the JSON editor.

     1. You can configure both the endpoint for synchronization and manually edit the record’s definitions. When synchronization is triggered, the registry fetches the latest metadata from the endpoint and updates the record’s name, description, version, tool definitions, and server definitions with the values found at the source, taking precedence over any manual edits to those fields. Fields that the source does not provide are not modified.

  5. The console validates your JSON against the official schema and shows inline errors with a **Diagnose with Amazon Q** button.

  6. Choose one of:

     1. **Save changes** — Saves the record as a draft.

     2. **Save and submit for approval** — Saves and submits in one step.


A success banner confirms: "[Name] is updated and submitted for approval successfully."

### AWS CLI

```bash
aws bedrock-agentcore-control update-registry-record \
  --registry-id "<registryId>" \
  --record-id "<recordId>" \
  --description "Updated description" \
  --region us-east-1
```
### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.update_registry_record(
    registryId='<registryId>',
    recordId='<recordId>',
    description='Updated description'
)
print(f"Updated: {response['name']} - Status: {response['status']}")
```
## Submit a record for approval

### Console

From the record detail page -

  1. Choose the **Update status** dropdown

  2. Then, choose **Submit for approval**.

     1. Alternatively, use **Create and submit for approval** or **Save and submit for approval** during creation or editing.


###### Note

If the Registry’s Auto-Approval configuration is set to TRUE, then submitting a record for approval automatically approves it. Otherwise, if the Auto-Approval configuration is set to FALSE, then the record moves to 'Pending Approval' status and waits for the Curator to either Approve it or Reject it. Additionally, an Amazon EventBridge notification is triggered indicating a new record has been requested for approval.

### AWS CLI

```bash
aws bedrock-agentcore-control submit-registry-record-for-approval \
  --registry-id "<registryId>" \
  --record-id "<recordId>" \
  --region us-east-1
```
### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.submit_registry_record_for_approval(
    registryId='<registryId>',
    recordId='<recordId>'
)
print(f"Status: {response['status']}")  # PENDING_APPROVAL or APPROVED
```
## Delete a registry record

### Console

  1. From the record detail page, choose the three-dot menu (⋮), then choose **Delete**.

  2. Confirm the deletion by typing in 'delete' when prompted


Deletion is permanent and cannot be undone.

### AWS CLI

```bash
aws bedrock-agentcore-control delete-registry-record \
  --registry-id "<registryId>" \
  --record-id "<recordId>" \
  --region us-east-1
```
### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.delete_registry_record(
    registryId='<registryId>',
    recordId='<recordId>'
)
print("Record deleted successfully")
```
## Schema validation

When you create or edit a record, the console and API validate your protocol configuration against the official schema for the selected record type. More details on validations can be found in [Supported record types](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-supported-record-types.html>).

