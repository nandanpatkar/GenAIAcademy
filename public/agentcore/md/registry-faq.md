# Comprehensive registry migration guide - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-faq.html

---

# Comprehensive registry migration guide

_AWS Agent Registry — Migrating from Public Preview to General Availability_

## Introduction

As part of launching as Generally Available (GA) on August 6, 2026, AWS Agent Registry is introducing significant changes to the service principal, data and API model. If you used AWS Agent Registry during the public preview, you must complete a migration that spans three areas:

  1. **Namespace and configuration changes** – We are moving AWS Agent Registry from the AWS Bedrock AgentCore namespace into its own dedicated namespace. This namespace change applies only to AWS Agent Registry. All other AgentCore offerings—such as Identity, Gateway, Runtime, and Policy—remain unaffected. For AWS Agent Registry, the service namespace changes from `bedrock-agentcore` to `agent-registry`. This affects every surface that references the service: endpoints, IAM policies, SDK clients, CLI commands, resource ARNs, and observability integrations. You must update your code and infrastructure to use the new namespace.

  2. **API schema changes** – The registry and registry record data models are updated based on customer feedback during the public preview. These changes break backward compatibility with the existing API schemas. Your application code that constructs or parses API requests and responses must be updated to reflect the new schema, as part of migrating to the new namespace.

  3. **Data migration** – You must migrate your existing registries and registry records from the old namespace to the new one. We provide migration tooling to extract your data, transform it to the new schema, and load it into the new namespace. The data is migrated to the same account and region — only the namespace changes.


This guide covers each area in detail with before-and-after examples to help you plan and execute your migration.

## What is the migration timeline?

There are two important milestones you must remember for this migration:

  * **August 6, 2026** — AWS Agent Registry becomes Generally Available, and the new `agent-registry` namespace officially launches. If you have existing registries and records, you have simultaneous access to the `bedrock-agentcore` and `agent-registry` namespaces. Migration tooling becomes available in the [agentcore-samples GitHub repository](<https://github.com/awslabs/agentcore-samples>). You can begin the process of migration.

###### Note

If you are a new customer without existing registries or records as of August 6, 2026, you cannot access AWS Agent Registry through the `bedrock-agentcore` namespace. Start using AWS Agent Registry directly from the `agent-registry` namespace.

  * **September 17, 2026** — Migration window closes. The old `bedrock-agentcore` namespace shuts down on this date. You lose read/write access to the service and any remaining data in the old namespace. After this date, you must use the `agent-registry` namespace.


## Namespace and configuration changes

The `agent-registry` namespace replaces `bedrock-agentcore` in the following places. This section lists every surface that changes and provides examples of how to update your code.

###### Important

The namespace changes only affect APIs offered by AWS Agent Registry, but not the rest of AWS Bedrock AgentCore, such as AWS AgentCore Identity. Thus, workload identity and OAuth credential provider resources remain under the `bedrock-agentcore` namespace.

### Service endpoints

Your applications must point to the new endpoint hostnames. The new endpoints use the `.api.aws` domain.

Surface | Old value | New value  
---|---|---  
Data plane endpoint |  `bedrock-agentcore.{region}.amazonaws.com` |  `agent-registry.{region}.api.aws`  
Control plane endpoint |  `bedrock-agentcore-control.{region}.amazonaws.com` |  `agent-registry-control.{region}.api.aws`  
  
### IAM and security

All IAM policies, service control policies (SCPs), and permission boundaries that reference `bedrock-agentcore` must be updated. Resource ARNs also change to reflect the new namespace.

Surface | Old value | New value  
---|---|---  
IAM action prefix |  `bedrock-agentcore:*` |  `agent-registry:*`  
Service principal |  `bedrock-agentcore.amazonaws.com` |  `agent-registry.amazonaws.com`  
Registry ARN |  `arn:aws:bedrock-agentcore:{region}:{account}:registry/{id}` |  `arn:aws:agent-registry:{region}:{account}:registry/{id}`  
Record ARN |  `arn:aws:bedrock-agentcore:{region}:{account}:registry/{id}/record/{rid}` |  `arn:aws:agent-registry:{region}:{account}:registry/{id}/record/{rid}`  
  
If you have automation that parses ARNs or stores them, update those references as well. Custom policies with conditions on the IAM action prefix or service principal must be updated to match the new values. To see the full list of IAM permissions associated with AWS Agent Registry, refer to the [AWS Agent Registry IAM permissions reference](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-iam-permissions.html>).

###### Note

If you currently use the [BedrockAgentCoreFullAccess](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreFullAccess.html>) AWS Managed Policy for AWS Agent Registry access (see [BedrockAgentCoreFullAccess policy details](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-iam-awsmanpol.html#security-iam-awsmanpol-BedrockAgentCoreFullAccess>)), you must replace it with the new **AgentRegistryFullAccess** managed policy (available at GA). The old BedrockAgentCoreFullAccess managed policy will **NOT** be updated to include `agent-registry:*` permissions.

### SDK, CLI, and infrastructure

Update your application code, deployment scripts, and infrastructure-as-code templates to reference the new client class and CLI namespace.

Surface | Old value | New value  
---|---|---  
Dataplane SDK client class |  `BedrockAgentCoreClient` |  `AgentRegistryClient`  
Controlplane SDK client class |  `BedrockAgentCoreControlClient` |  `AgentRegistryControlClient`  
CLI namespace |  `aws bedrock-agentcore` |  `aws agent-registry`  
Service Quotas code |  `bedrock-agentcore` |  `agent-registry`  
  
If you previously requested custom quota increases under the `bedrock-agentcore` service code, you must re-request them under `agent-registry`.

### Observability and eventing

Update any CloudTrail Lake queries, Athena queries, SIEM integrations, EventBridge rules, CloudWatch dashboards, and alarms that reference the old namespace.

Surface | Old value | New value  
---|---|---  
CloudTrail event source |  `bedrock-agentcore.amazonaws.com` |  `agent-registry.amazonaws.com`  
EventBridge source |  `aws.bedrock-agentcore` |  `aws.agent-registry`  
CloudWatch namespace |  `AWS/BedrockAgentCore` |  `AWS/AgentRegistry`  
  
### Example: Updating IAM policies

Replace the action prefix and resource ARN namespace in all your IAM policies.

**Before (public preview):**

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "bedrock-agentcore:CreateRegistry",
      "bedrock-agentcore:GetRegistry",
      "bedrock-agentcore:UpdateRegistry",
      "bedrock-agentcore:ListRegistries",
      "bedrock-agentcore:DeleteRegistry",
      "bedrock-agentcore:CreateRegistryRecord",
      "bedrock-agentcore:GetRegistryRecord",
      "bedrock-agentcore:UpdateRegistryRecord",
      "bedrock-agentcore:ListRegistryRecords",
      "bedrock-agentcore:DeleteRegistryRecord",
      "bedrock-agentcore:SubmitRegistryRecordForApproval",
      "bedrock-agentcore:UpdateRegistryRecordStatus",
      "bedrock-agentcore:SearchRegistryRecords"
    ],
    "Resource": ["arn:aws:bedrock-agentcore:us-west-2:123456789012:*"]
  }]
}
```
**After (General Availability):**

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "agent-registry:CreateRegistry",
      "agent-registry:GetRegistry",
      "agent-registry:UpdateRegistry",
      "agent-registry:ListRegistries",
      "agent-registry:DeleteRegistry",
      "agent-registry:CreateRegistryRecord",
      "agent-registry:GetRegistryRecord",
      "agent-registry:UpdateRegistryRecord",
      "agent-registry:ListRegistryRecords",
      "agent-registry:DeleteRegistryRecord",
      "agent-registry:SubmitRegistryRecordForApproval",
      "agent-registry:UpdateRegistryRecordStatus",
      "agent-registry:SearchDiscoverableRegistryRecords",
      "agent-registry:ListDiscoverableRegistryRecords",
      "agent-registry:GetDiscoverableRegistryRecord"
    ],
    "Resource": ["arn:aws:agent-registry:us-west-2:123456789012:*"]
  }]
}
```
###### Note

The `BatchGetDiscoverableRegistryRecord` API does not have its own IAM action. It authorizes each requested record against the `agent-registry:GetDiscoverableRegistryRecord` action. Ensure your policy includes `GetDiscoverableRegistryRecord` to use `BatchGet`.

###### Important

Workload identity and OAuth credential provider resources remain under the `bedrock-agentcore` namespace. If your registries use URL sync (`source.fromUrl`) with OAuth or IAM credentials, you must retain the following permissions alongside your new `agent-registry:*` permissions:

```text
"bedrock-agentcore:CreateWorkloadIdentity",
"bedrock-agentcore:GetWorkloadIdentity",
"bedrock-agentcore:DeleteWorkloadIdentity"
```
Do not replace every `bedrock-agentcore` action — these identity resources intentionally retain the old namespace.

### Example: Updating SDK client configuration

Update the service name, client class, and endpoint URL in your SDK calls.

**Before (public preview):**

```python
import boto3

session = boto3.Session(region_name="us-west-2")

cp_client = session.client(
    "bedrock-agentcore-control",
    endpoint_url="https://bedrock-agentcore-control.us-west-2.amazonaws.com"
)

dp_client = session.client(
    "bedrock-agentcore",
    endpoint_url="https://bedrock-agentcore.us-west-2.amazonaws.com"
)
```
**After (General Availability):**

```python
import boto3

session = boto3.Session(region_name="us-west-2")

cp_client = session.client(
    "agent-registry-control",
    endpoint_url="https://agent-registry-control.us-west-2.api.aws"
)

dp_client = session.client(
    "agent-registry",
    endpoint_url="https://agent-registry.us-west-2.api.aws"
)
```
### Example: Updating CLI commands

Replace the CLI namespace in all scripts and automation.

**Before (public preview):**

```bash
aws bedrock-agentcore-control create-registry \
    --name "MyRegistry" \
    --description "Production registry" \
    --region us-west-2 \
    --endpoint-url https://bedrock-agentcore-control.us-west-2.amazonaws.com
```
**After (General Availability):**

```bash
aws agent-registry-control create-registry \
    --name "MyRegistry" \
    --description "Production registry" \
    --region us-west-2 \
    --endpoint-url https://agent-registry-control.us-west-2.api.aws
```
## API schema changes

In addition to the namespace migration, we updated the registry and registry record data models for General Availability. These changes improve the consistency and extensibility of the API based on feedback from the public preview. This section covers each change category with before and after examples so you can update your application code.

### Change 1: Registry entity updates

The authorization configuration on the registry resource — which controls how a registry’s data plane is accessed — now sits under a dedicated `discoveryConfiguration` wrapper that makes its purpose explicit. The approval configuration (which controls whether records submitted to `PENDING_APPROVAL` status automatically transition to `APPROVED` status) moves from a boolean to an extensible enum array.

The specific field changes are:

  * `authorizerType` and `authorizerConfiguration` are moved inside a new `discoveryConfiguration` object.

  * `approvalConfiguration.autoApproval` (boolean) is replaced with `approvalConfiguration.autoApprovalRules` (array of enum strings). The value `"APPROVE_ALL"` has the same semantic meaning as `autoApproval: true`. Rules specified in the enum list are applied. Not specifying (null) means approval is needed.


**Before (public preview):**

```json
{
  "name": "string",
  "description": "string",
  "authorizerConfiguration": { ... },
  "authorizerType": "string",
  "approvalConfiguration": {
    "autoApproval": true
  }
}
```
**After (General Availability): with Approval ALL**

```json
{
  "name": "string",
  "description": "string",
  "discoveryConfiguration": {
    "authorizerConfiguration": { ... },
    "authorizerType": "string"
  },
  "approvalConfiguration": {
    "autoApprovalRules": ["APPROVE_ALL"]
  }
}
```
**After (General Availability): with NULL in enum list**

```json
{
  "name": "string",
  "description": "Registry with manual approval only",
  "approvalConfiguration": {
    "autoApprovalRules": []
  }
}
```
### Change 2: New required fields on registry records

Registry records gain two new required top-level fields to support better categorization and deduplication. You must specify both fields when creating a registry record using the `CreateRegistryRecord` API, and you can change them later using the `UpdateRegistryRecord` API.

Field | Type | Description  
---|---|---  
`name` |  String (required) |  A unique identifier within the registry which can be specified by the customer. Every record must have a unique name in the registry. When `recordVersion` is also present, the combination of `name` and `recordVersion` must be unique.  
`recordType` |  Enum (required) |  The semantic type of the record. Valid values: `AGENT`, `MCP`, `SKILL`, `CUSTOM`. Determines which primary descriptor key is valid under `descriptors`. You can use APIs like `ListRegistryRecords` and `SearchDiscoverableRegistryRecords` to filter results by this semantic type.  
  
### Change 3: Registry record restructuring

The `descriptors` field changes from a discriminated union to a flat keyed structure.

In the previous model, the `descriptorType` field (`MCP`, `A2A`, `AGENT_SKILLS`, `CUSTOM`) determined the inner shape. This coupled descriptor content to a coarse protocol or format classification. That field no longer exists. `recordType`, a separate top-level attribute, replaces it for semantic categorization. The API enforces valid descriptor keys for each `recordType` at runtime rather than structurally in the shape. Each top-level key under `descriptors` now represents a granular primary descriptor type (for example, `a2aAgentCard`, `mcpServer`, `agentSkillsDefinition`, `custom`). Supplementary descriptors (for example, `tools`, `skillMd`) nest under the primary descriptor’s `additionalData`. The `inlineContent` field becomes `data`. The `schemaVersion` and `protocolVersion` fields consolidate into `dataSchemaVersion`.

The top-level `synchronizationConfiguration` attribute becomes `source` and moves inside each descriptor (including `additionalData` children).

The existing `name` field becomes `displayName`, making its meaning more explicit. A net-new `name` field serves as the dedup key and must be unique across all records in a registry. If you specify both `name` and `recordVersion` for the same record, their combination must be unique.

The following fields are renamed:

Before | After | Notes  
---|---|---  
`name` |  `displayName` |  Display name of the record. There will also be a new `name` field which is the dedup key.  
`descriptorType` |  Removed |  Replaced by the top-level `recordType` field.  
`inlineContent` |  `data` |  The content payload within each descriptor.  
`schemaVersion` / `protocolVersion` |  `dataSchemaVersion` |  Unified version field for all descriptor types.  
`synchronizationConfiguration` |  `source` |  Moved inside each descriptor (including `additionalData` children).  
  
**Before (public preview):**

```json
{
  "recordId": "string",
  "name": "string",
  "descriptorType": "string", // A2A, MCP, AGENT_SKILL, CUSTOM
  "descriptors": {
    "agent": {
      "a2aAgentCard": {
        "inlineContent": "string",
        "schemaVersion": "string"
      }
    },
    "agentSkills": {
      "skillDefinition": {
        "inlineContent": "string",
        "schemaVersion": "string"
      },
      "skillMd": {
        "inlineContent": "string"
      }
    },
    "mcp": {
      "server": {
        "inlineContent": "string",
        "schemaVersion": "string"
      },
      "tools": {
        "inlineContent": "string",
        "protocolVersion": "string"
      }
    },
    "custom": {
      "inlineContent": "string"
    }
  },
  "synchronizationType": "URL",
  "synchronizationConfiguration": {
    "fromUrl": {
      "url": "string",
      "credentialProviderConfigurations": [
        {
          "credentialProvider": { ... },
          "credentialProviderType": "string"
        }
      ]
    }
  },
  ...
}
```
**After (General Availability):**

```json
{
  "recordId": "string",
  "displayName": "string",
  "name": "string",
  "recordVersion": "string",
  "recordType": "AGENT" | "MCP" | "SKILL" | "CUSTOM",
  "descriptors": {
    "a2aAgentCard": {
      "data": "string",
      "dataSchemaVersion": "string",
      "source": { "fromUrl": { "url": "string", "credentialProviderConfigurations": [...] } }
    },
    "mcpServer": {
      "data": "string",
      "dataSchemaVersion": "string",
      "source": { "fromUrl": { ... } },
      "additionalData": {
        "tools": { "data": "string", "dataSchemaVersion": "string" }
      }
    },
    "agentSkillsDefinition": {
      "data": "string",
      "dataSchemaVersion": "string",
      "additionalData": {
        "skillMd": { "data": "string", "dataSchemaVersion": "string", "source": { "fromUrl": { ... } } }
      }
    },
    "custom"?: {
      "data": "string"
    }
  }
  ...
}
```
The following constraints apply:

Exactly one primary descriptor key may be populated per record. The valid primary descriptor per `recordType` are:

  * **AGENT:** `a2aAgentCard`, `mcpServer`, `custom`

  * **MCP:** `mcpServer`, `custom`

  * **SKILL:** `agentSkillsDefinition`, `custom`

  * **CUSTOM:** `custom`


`source` is per-descriptor rather than a single top-level block. It attaches to descriptors that carry a `source` field in the schema — `mcpServer` and `a2aAgentCard`. The `tools` child (under `mcpServer.additionalData`), the `agentSkillsDefinition` parent, and the `custom` descriptor carry no `source`.

At GA, only `source.fromUrl` is supported.

Auto-synchronization is only triggered for the `mcpServer` and `a2aAgentCard` primary descriptors — that is, MCP and AGENT record types. A `source` on the `skillMd` child is persisted but not used to run sync, and SKILL records cannot be auto-synchronized. CUSTOM records must be created manually by providing `data` directly.

### Change 4: Data plane filter updates

`SearchRegistryRecords` becomes `SearchDiscoverableRegistryRecords` (`POST /discoverable-records-search`). Its request and response pick up the new field names and data model:

  * Filter by `recordType` (replaces `descriptorType`).

  * Filter by `recordVersion` (replaces `version`).

  * The response returns descriptors in the new format, without `credentialProviderConfigurations`.


The MCP search tool `search_registry_records` becomes `search_discoverable_registry_records`, returns the new descriptor format, and uses the new filter names.

### Change 5: New browsing APIs

Two new data plane APIs support building browsing and catalog experiences over approved records. These APIs do not require any explicit migration; we mention them here as additions to the AWS Agent Registry API model at GA.

**ListDiscoverableRegistryRecords** — Returns a paginated list of approved registry records. Use this to build browsing interfaces over published content.

```text
// HTTP: POST /registries/{registryId}/discoverable-records-list
{
  "registryId": "string",           // path param, required (ARN or ID)
  "maxResults": 1-100,              // query param, optional
  "nextToken": "string",            // query param, optional
  "filters": [ { "name": "recordType", "values": ["MCP"] } ]
}
{
  "registryRecords": [
    {
      "registryArn": "string",
      "recordArn": "string",
      "recordId": "string",
      "name": "string",
      "displayName": "string",
      "description": "string",
      "recordType": "string",
      "recordVersion": "string",
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "nextToken": "string"
}
```
**BatchGetDiscoverableRegistryRecord** — Retrieves full details for a batch of records across one or more registries in a single call.

```text
// HTTP: POST /discoverable-records-batch
{
  "entries": [
    { "registryId": "reg-AAA", "recordIds": ["rec-111", "rec-222"] }
  ]
}
{
  "registryRecords": [
    {
      "registryArn": "string",
      "recordArn": "string",
      "recordId": "string",
      "name": "string",
      "displayName": "string",
      "description": "string",
      "recordType": "string",
      "descriptors": { ... },
      "recordVersion": "string",
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "errors": [
    {
      "registryId": "string",
      "recordId": "string",
      "errorCode": "RESOURCE_NOT_FOUND" | "ACCESS_DENIED" | "INTERNAL_ERROR",
      "message": "string"
    }
  ]
}
```
The response includes a `registryRecords` array with the full record details and an `errors` array for any records that could not be retrieved.

At launch, exactly one entry (one registry, 1-100 record IDs) is accepted. The grouped shape is forward-compatible with cross-registry batching in future releases.

### Change 6: List APIs adopt structured filters parameter

In public preview, List APIs expose each filterable field as its own query parameter (for example, `--status READY`, `--recordType MCP`). In GA, a single structured `filters` parameter replaces these discrete parameters. The `filters` value is a list of `{ "name": "<dotted.path>", "values": ["<value>"] }` entries where `name` is a dot-delimited attribute path. New filterable fields, including nested ones, become new `name` paths rather than new API parameters. List operations also change from `GET` to `POST`. Pagination parameters (`maxResults`, `nextToken`) are unchanged.

**Before (public preview):**

```text
GET /registries?status=READY&authorizerType=AWS_IAM
GET /registries/{registryId}/records?name=my-agent&status=APPROVED&recordType=MCP
```
**After (General Availability):**

```text
// ListRegistries
// POST /registries-list
{
  "filters": [
    { "name": "status", "values": ["READY"] },
    { "name": "discoveryConfiguration.authorizerType", "values": ["AWS_IAM"] }
  ],
  "maxResults": 100,
  "nextToken": "string"
}

// ListRegistryRecords
// POST /registries/{registryId}/records-list
{
  "filters": [
    { "name": "name", "values": ["my-agent"] },
    { "name": "status", "values": ["APPROVED"] },
    { "name": "recordType", "values": ["MCP"] }
  ],
  "maxResults": 100,
  "nextToken": "string"
}
```
## Data migration

You must migrate your existing registries and registry records from the `bedrock-agentcore` namespace to the `agent-registry` namespace. We provide a script to assist with the migration. The script handles extraction of existing data, transformation from the old schema to the new schema, and loading into registries in the new namespace. The script creates new registries in the `agent-registry` namespace within the same account and region. It migrates all existing records from your old registries to the new ones, accounting for namespace and API schema changes.

### Choosing your migration approach

The right approach depends on the scale of your registry usage and your operational environment.

#### Case 1: Small-scale migration with direct script execution

  * **Profile:** Fewer than 5 registries and fewer than 100 records. You have direct access to a terminal or CloudShell in the target account.

  * **Approach:** Run the migration Python script directly. The script connects to the preview namespace, lists your registries and records, transforms the data to the GA schema, and creates them in the new namespace. This is the simplest path and requires no infrastructure deployment.


#### Case 2: Managed migration with Lambda or Glue

  * **Profile:** You do not have direct terminal access to the target environment, or you prefer a managed execution model.

  * **Approach:** Deploy the migration as an AWS Lambda function or AWS Glue job. The migration engine performs the same extract-transform-load workflow but runs as a managed job within your account. For most accounts, the full migration completes in under 15 minutes.


The migration engine:

  * **Extracts** registries and records from the preview namespace, supporting both full and incremental loads. It paginates through all API responses and serializes the data to a staging location.

  * **Transforms** each record by applying the API schema changes (field renames, descriptor restructuring, new required fields).

  * **Loads** the transformed data into the new `agent-registry` namespace, creating registries and records using the GA API.

  * **Generates a report** summarizing what was migrated, any errors encountered, and record counts for verification.


#### Case 3: Dual-write migration for active production workloads

  * **Profile:** You have built a platform or automation pipeline on top of the public preview APIs and are actively writing new data in production.

  * **Approach:** Use a dual-write migration strategy to avoid data loss during the transition:

    * **Update your writer** – Modify your application to write to both the preview namespace and the new `agent-registry` namespace simultaneously.

    * **Run the migration script with deduplication** – Execute the migration tooling to migrate historical data. The script deduplicates based on the `name` field, so records that already exist in the new namespace (from your dual-write) are not duplicated.

    * **Switch your reader** – After you verify that all data exists in the new namespace, update your application to read exclusively from `agent-registry`.

    * **Remove the dual-write** – After confirming all reads and writes are successful on the new namespace, remove the preview namespace writer from your application.


### Verifying your migration

After running the migration, confirm that your data was migrated correctly:

  * List all registries in the new namespace using the `list-registries` CLI command and confirm the count matches your source.

  * For each registry, compare the record count using `list-registry-records`.

  * Spot-check individual records to confirm that descriptors were transformed correctly (field renames, descriptor restructuring).

  * Update your IAM policies, endpoints, and SDK clients as described in the Namespace and configuration changes section.

  * Verify that your applications can successfully read and write using the new namespace.


## FAQ

### What is changing in AWS Agent Registry?

AWS Agent Registry is moving from the public preview `bedrock-agentcore` namespace to the generally available `agent-registry` namespace. The migration spans three areas: namespace and configuration changes (endpoints, IAM, SDK, CLI, ARNs, observability), API schema changes (restructured data model for registries and records), and data migration (moving your existing registries and records to the new namespace).

### Can I continue using Registry on the `bedrock-agentcore` namespace?

Your existing Registry usage on the `bedrock-agentcore` namespace continues to work without interruption during the migration window. However, we recommend that you begin your migration as soon as tooling becomes available to ensure you have sufficient time to complete both data migration and code updates.

However, if you do not have existing registries or records as of August 6, 2026, you cannot access the `bedrock-agentcore` namespace for AWS Agent Registry from August 6, 2026. If you have existing registries or records as of August 6, 2026, you have access to the `bedrock-agentcore` namespace for AWS Agent Registry during the migration window (August 6, 2026 – September 17, 2026).

### Will my data be automatically migrated?

No. You must initiate the migration yourself using the migration tooling that we provide. See the Data migration section for details on the available approaches based on your scale.

### What API schema changes are included?

In addition to the namespace change, we updated the API data model in six areas: registry entity (authorization config grouped under `discoveryConfiguration`), registry record new fields (`name` and `recordType`), registry record restructuring (descriptors flattened, field renames), search API filter updates (`recordType`, `recordVersion`), new browsing APIs (`ListDiscoverableRegistryRecords`, `BatchGetDiscoverableRegistryRecord`), and structured filters for List operations.

### How long will the data migration take?

Migration time depends on the number of registries and records in your account. For accounts with fewer than 100 records, the migration completes in minutes when running locally. For accounts with thousands of records, expect the migration to complete in under 15 minutes when running as a managed job.

### What if I have a large-scale deployment with active writes?

If you are actively writing data to the preview namespace in production, use the dual-write migration strategy as described in Case 3. This approach ensures no data is lost during the transition by writing to both namespaces simultaneously, migrating historical data with deduplication, and then cutting over reads.

### Where can I get help?

For questions or assistance with your migration, contact [AWS Support](<https://aws.amazon.com/support>).

