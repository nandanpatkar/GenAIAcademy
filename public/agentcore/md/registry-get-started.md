# Get started with AWS Agent Registry - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-get-started.html

---

# Get started with AWS Agent Registry

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

In this guide, you’ll create your first registry, add a record, approve it, and search for it.

## Prerequisites

Complete the steps in [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-prerequisites.html>).

## Step 1: Create a registry

Create a registry with IAM authorization and manual approval.

### Console

**To Create a Registry with IAM based Auth**

  1. Open the AWS Agent Registry Page in [AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/home?region=us-east-1#>).

  2. In the navigation pane, choose **Registry**.

  3. In the **Registries** section, choose **Create registry**.

  4. In the **Registry details** section, for **Name** , enter a name for your registry. The name must start with an alphanumeric character. Valid characters are a–z, A–Z, 0–9, `_` (underscore), `-` (hyphen), `.` (period), and `/` (forward slash). The name can have up to 64 characters.

  5. (Optional) Choose **Additional details** to expand the section, and then for **Description** , enter a description to help identify this registry.

  6. In the **Search API Authorization** section, for **Auth type** , choose **Use IAM Authorization** . Note - This is Inbound Authorization

  7. In the **Record approval** section, turn on or turn off **Auto-approval** :

     * When **Auto-approval** is on, when you submit a record for approval, the record moves directly to **Approved** status and becomes visible in search results shortly after.

     * When **Auto-approval** is off, when you submit a record for approval, the record moves to **Pending approval** status and requires a curator to review and approve it before it’s published.

  8. Choose **Create registry**.


**To Create a Registry with JWT based Auth** Identity provider authorization uses JSON Web Tokens (JWT) to control access to the registry’s search API. You can use Amazon Cognito to quickly set up authorization, or bring your own identity provider to enable OAuth 2.0.

  1. Open the AWS Agent Registry Page in [AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/home?region=us-east-1#>).

  2. In the navigation pane, choose **Registry**.

  3. In the **Registries** section, choose **Create registry**.

  4. In the **Registry details** section, for **Name** , enter a name for your registry. The name must start with an alphanumeric character. Valid characters are a–z, A–Z, 0–9, `_` (underscore), `-` (hyphen), `.` (period), and `/` (forward slash). The name can have up to 64 characters.

  5. (Optional) Choose **Additional details** to expand the section, and then for **Description** , enter a description to help identify this registry.

  6. In the **Search API Authorization** section, for **Auth type** , choose **Use JSON Web Tokens (JWT)** . Note - This is Inbound Authorization

  7. For **JWT schema configuration** , choose one of the following options:

     1. **Quick create configurations with Cognito (recommended)** – AWS Agent Registry creates the authorization configurations on your behalf using Amazon Cognito as the identity provider. No additional configuration is required.

     2. **Use existing Identity provider configurations** – Bring your own identity provider to enable OAuth 2.0. If you choose this option, complete the following steps:

        1. For **Discovery URL** , enter the discovery URL from your identity provider. AWS Agent Registry uses this URL to automatically fetch the login, token, and verification settings for your provider. You can find this URL in your identity provider’s dashboard or documentation (for example, `https://cognito-identity.amazonaws.com/.well-known/openid-configuration` ).

Note: Discovery URL cannot be changed after the Registry is created

        2. (Optional) Under **JWT authorization configuration** , select **Allowed audiences** to provide a list of permitted audiences that AWS Agent Registry validates against the `aud` claim in the JWT token. An audience claim ( `aud` ) in OAuth 2.0 specifies which resource server (API) the token is intended for. This ensures the token is the correct recipient before processing the request, preventing a token from being reused at a different API it was not issued for.

        3. (Optional) Select **Allowed clients** to provide a list of permitted client identifiers that AWS Agent Registry validates against the `client_id` claim in the JWT token. A `client_id` is a public, unique identifier for an application that is requesting access tokens to access the registry’s search API. If you enable this option, enter one or more client IDs in the **Clients** field, and then choose **Add client** to add additional clients.

        4. (Optional) Select **Allowed scopes** to provide a list of permitted permissions, defined as scopes. If configured, at least one scope value in the incoming token must match one of the configured values. Scopes act as permissions to limit what an application can do.

        5. (Optional) Select **Custom claims** to provide a set of rules that match specific claims in the incoming token against predefined values. For each rule, specify the claim name, the value type ( **STRING** or **STRING_ARRAY** ), and the required match value.

  8. In the **Record approval** section, turn on or turn off **Auto-approval** :

     1. When **Auto-approval** is on, when you submit a record for approval, the record moves directly to **Approved** status and becomes immediately visible in search results.

     2. When **Auto-approval** is off, when you submit a record for approval, the record moves to **Pending approval** status and requires a registry admin to review and approve it before it’s published.

  9. Choose **Create registry**.


###### Note

* At least one **JWT authorization configuration** field is required: allowed audiences, allowed clients, allowed scopes, or custom claims. If you configure more than one, AWS Agent Registry verifies all of them. * The discovery URL cannot be changed after the registry is created. * The authorization type (IAM or JWT) cannot be changed after the registry is created. * A registry supports only one form of inbound authorization type at a time — IAM SigV4 or JWT Bearer Token. You cannot use both simultaneously. Search via IAM is only supported via IAM-based registry; and search via Oauth is only supported via Oauth based registry.

After creating the registry, the console navigates to the registry details page. The registry status is initially **Creating** . AWS Agent Registry assigns the registry an ARN, which you can find in the **Registry details** section. The registry status changes to **Ready** after provisioning is complete. You can add records to the registry when its status is **Ready**.

### AWS CLI

```bash
aws bedrock-agentcore-control create-registry \
  --name "MyFirstRegistry" \
  --description "My first Agent Registry" \
  --region us-east-1
```
The registry status starts as CREATING and transitions to READY when provisioning completes.

### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.create_registry(
    name='my-agent-registry',
    description='My first Agent Registry'
)
print(response['registryArn'])
```
## Step 2: Add a registry record

Create a record for an MCP server in your registry.

### Console

A registry record represents an agent, tool, skill, or custom resource.

  1. Open the AWS Agent Registry Page in [AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/home?region=us-east-1#>).

  2. In the navigation pane, choose **Registry** , and then choose the name of the registry where you want to add a record.

  3. In the **Registry records** section, choose **Create record**.

  4. Choose a source type:

     1. **Synchronize from endpoint** — Provide an endpoint URL and optional credentials to fetch metadata from an MCP server or Agent (A2A) endpoint. See [Synchronize records from external sources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-sync-records.html>) for details.

     2. **Manual** — Manually configure the record details and protocol configuration. Continue with the steps below.

  5. In the **Record details** section, for **Name** , enter a name for the record. The name must start with an alphanumeric character. Valid characters are a–z, A–Z, 0–9, `_` (underscore), `-` (hyphen), `.` (period), and `/` (forward slash). The name can have up to 255 characters.

  6. (Optional) For **Description** , enter a description for the record. The description can be 1 to 4,096 characters.

  7. For **Record version** , enter a version identifier for the record (for example, `1.0.0` or `v2.1` ).

  8. In the **Record type** section, choose the type that matches your resource:

     1. **MCP** – Protocol designed for AI tool and agent communications. Handles context management and structured message formats. If you choose this type, complete the following steps:

        1. In the **MCP server definition** section, select a schema version from the **Schema version** dropdown (for example, `2025-12-11` ), and then enter [MCP registry](<https://registry.modelcontextprotocol.io/>) server.json in the **Your MCP server definition** editor. The definition must comply with the official MCP server schema for the selected version. To view the official schema as a reference, turn on **Show official schema**.

        2. (Optional) Select **Add tool definition** to add specific tools available on this server with their input parameters, outputs, and usage examples to enhance discoverability. If you select this option, select a schema version from the **Schema version** dropdown (for example, `2025-11-25` ), and then enter your tool definition in the **Your Tool definition** editor. To view the official tool schema as a reference, turn on **Show official schema**.

     2. **Agent** – Protocol designed for secure agent-to-agent interactions. Enables distributed workflows and information exchange. If you choose this type, the schema version is `0.3` . Enter your agent card definition in the editor. To view the official schema as a reference, turn on **Show official schema**.

     3. **Agent Skills** – Register agent skills with markdown documentation and an optional structured definition. If you choose this type, complete the following steps:

        1. For **Skill documentation** , enter the markdown documentation that describes this skill.

        2. (Optional) Select **Include skill definition** to add a structured definition. If you select this option, select a schema version from the **Schema version** dropdown, and then enter the skill definition as a JSON object in the editor.

     4. **Custom** – Custom protocol implementation for specialized communication patterns. Define your own interface specification and integration requirements. If you choose this type, enter your custom definition as a JSON object in the editor.

  9. Choose **Create record**.


###### Note

If you wish to add a Server or Agent into the registry that does not conform to the standard MCP or A2A Protocol Schemas, use Custom record type to add such a resource into the registry.

After you choose Create record, AWS Agent Registry begins provisioning the record. The record status is initially Creating. When provisioning is complete, the status changes to Draft. To make the record available for others to discover, submit it for approval. For more information, see Step 3: Submit the record for approval.

### AWS CLI

```bash
aws bedrock-agentcore-control create-registry-record \
  --registry-id <registryId> \
  --name "WeatherServer" \
  --descriptor-type MCP \
  --descriptors '{"mcp": {"server": {"inlineContent": "{\"name\": \"weather/mcp-server\", \"description\": \"Weather data service\", \"version\": \"1.0.0\"}"}}}' \
  --record-version "1.0" \
  --region us-east-1
```
The record is created in CREATING status and transitions to DRAFT when processing completes. For more AWS CLI examples for creating records of other types, refer to the [Create and manage records](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-create-manage-records.html>) section.

### AWS SDK

```python
import boto3
import json

client = boto3.client('bedrock-agentcore-control')

server_content = json.dumps({
    "name": "io.example/weather-server",
    "description": "A weather MCP server",
    "version": "1.0.0"
})

tools_content = json.dumps({
    "tools": [{
        "name": "get_weather",
        "description": "Get the current weather for a location",
        "inputSchema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City name"
                }
            },
            "required": ["location"]
        }
    }]
})

response = client.create_registry_record(
    registryId='<registryId>',
    name='my-mcp-server',
    descriptorType='MCP',
    descriptors={
        'mcp': {
            'server': {
                'schemaVersion': '2025-12-11',
                'inlineContent': server_content
            },
            'tools': {
                'protocolVersion': '2024-11-05',
                'inlineContent': tools_content
            }
        }
    }
)
print(f"Record ARN: {response['recordArn']}")
print(f"Status: {response['status']}")  # CREATING
```
## Step 3: Submit the record for approval

### Console

Submitting a record for approval starts the review process that makes the record available for discovery. You can submit a record from the registry records table or from the record details page.

**To submit a record for approval from the registry records table**

  1. Open the AWS Agent Registry Page in [AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/home?region=us-east-1#>).

  2. In the navigation pane, choose **Registry** , and then choose the registry name.

  3. In the **Registry records** section, select the record that you want to submit.

  4. Choose **Update status** , and then choose **Submit for approval**.


**To submit a record for approval from the record details page**

  1. Open the AWS Agent Registry Page in [AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/home?region=us-east-1#>).

  2. In the navigation pane, choose **Registry** , and then choose the registry name.

  3. In the **Registry records** section, choose the name of the record that you want to submit.

  4. Choose **Update status** , and then choose **Submit for approval**.


After you submit a record for approval, the record status changes based on the registry’s approval setting:

  * If the registry has **Auto-approval** turned on, the record status changes directly to **Approved** and becomes visible in search results shortly after.

  * If the registry has **Auto-approval** turned off, the record status changes to **Pending approval** and requires a registry admin to review and approve it before it’s published.


### AWS CLI

```bash
aws bedrock-agentcore-control submit-registry-record-for-approval \
  --registry-id <registryId> \
  --record-id <recordId> \
  --region us-east-1
```
The record moves to PENDING_APPROVAL (or directly to APPROVED if auto-approval is enabled).

### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.submit_registry_record_for_approval(
    registryId='<registryId>',
    recordId='<recordId>'
)
print(f"Record ARN: {response['recordArn']}")
print(f"Record ID: {response['recordId']}")
print(f"Status: {response['status']}")  # PENDING_APPROVAL or APPROVED
print(f"Updated At: {response['updatedAt']}")
```
## Step 4: Approve the record

### Console

**To approve a record from the registry records table**

  1. Open the AWS Agent Registry Page in [AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/home?region=us-east-1#>).

  2. In the navigation pane, choose **Registry** , and then choose the registry name.

  3. In the **Registry records** section, select the record that you want to approve.

  4. Choose **Update status** , and then choose **Approve**.

  5. In the confirmation dialog, enter a reason for the status change.

  6. Choose **Confirm**


**To approve a record from the record details page**

  1. Open the AWS Agent Registry Page in [AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/home?region=us-east-1#>).

  2. In the navigation pane, choose **Registry** , and then choose the registry name.

  3. In the **Registry records** section, choose the name of the record that you want to approve.

  4. In record details page, Choose **Update status** , and then choose **Approve**.

  5. In the confirmation dialog, enter a reason for the status change.

  6. Choose **Confirm**


### AWS CLI

```bash
aws bedrock-agentcore-control update-registry-record-status \
  --registry-id <registryId> \
  --record-id <recordId> \
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
    statusReason='Meets all requirements'
)
print(f"Record ARN: {response['recordArn']}")
print(f"Status: {response['status']}")  # APPROVED
print(f"Reason: {response['statusReason']}")
```
## Step 5: Search the registry

### Console

You can search for approved records in a registry using semantic or keyword search to find agents, MCP servers, skills, and other resources. You can filter results by name, protocol, or version to narrow your search.

###### Note

* The console search feature is available only for registries that use **Use IAM** as the authorization type. * If your registry uses JSON Web Tokens (JWT), you must call the search API directly using an HTTP client such as curl or Postman, with a valid JWT Bearer Token in the request header. The AWS CLI and AWS SDKs use IAM SigV4 signing and cannot be used with JWT-authorized registries. More details can be found [Search for registry records](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-search-records.html>).

**To search for registry records**

  1. Open the AWS Agent Registry Page in [AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/home?region=us-east-1#>).

  2. In the navigation pane, choose **Registry** , and then choose the registry name.

  3. Choose the **Search records** tab.

  4. In the **Search approved records** field, enter your search query.

  5. (Optional) To filter results by a specific property, choose the search field to expand the **Properties** menu, and then choose a filter: **Name** , **Descriptor type** , or **Version**.

  6. Choose **Search**.


Search returns only records in **Approved** status. Records in other states such as Draft, Pending approval, Rejected, or Deprecated status don’t appear in search results.

### AWS CLI

```bash
aws bedrock-agentcore search-registry-records \
  --search-query "weather" \
  --registry-ids "<registry-id>" \
  --region us-east-1
```
Your approved record should appear in the search results.

### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore')

response = client.search_registry_records(
    registryIds=['arn:aws:bedrock-agentcore:us-east-1:<account>:registry/<registryId>'],
    searchQuery='weather forecast tool',
    maxResults=10
)
for record in response['registryRecords']:
    print(f"Record: {record['name']} ({record['recordId']})")
    print(f"  Type: {record['descriptorType']}")
    print(f"  Status: {record['status']}")
    print(f"  Version: {record['version']}")
```
## What you’ve built

  * A **registry** with IAM authorization and manual approval

  * A **registry record** describing an MCP server

  * An **approved record** discoverable through search


## Next steps

  * Set up Amazon EventBridge notifications to automate your approval workflow

  * Add more records for your agents, servers, skills, and custom resources



