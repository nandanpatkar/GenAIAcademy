# Create and manage registries - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-create-manage.html

---

# Create and manage registries

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

## Create a registry

### Console

  1. Open the [Amazon Bedrock AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/home?region=us-east-1#>).

  2. In the navigation pane, under **Discover** , choose **Registry**.

  3. In the **Registries** section, choose **Create registry**.

  4. For **Name** , enter a name for your registry. The name must start with a letter or digit. Valid characters are a-z, A-Z, 0-9, _ (underscore), - (hyphen), . (dot), and / (forward slash). The name can have up to 64 characters.

  5. (Optional) Expand **Additional details** and enter a **Description** (1–4,096 characters).

  6. (Optional) Expand **Search API Authorization** to configure how consumers authorize when searching the registry (Inbound Authorization). Choose **AWS IAM** to use standard AWS credentials, or **JSON Web tokens (JWT)** to use your corporate identity provider credentials. If you choose JWT, you can either quick create with Cognito, or bring your own IdP by providing the discovery URL, audience, scope, custom claims and clients.

  7. Under **Record approval** , choose whether to enable **Auto-approval** . When auto-approval is off, a curator must review and approve each record before it becomes searchable.

  8. Choose **Create registry**.


The registry status starts as **Creating** and transitions to **Ready** when provisioning completes.

###### Note

For JWT enabled registries, At least one **JWT authorization configuration** field is required: allowed audiences, allowed clients, allowed scopes, or custom claims. If you configure more than one, AWS Agent Registry verifies all of them.

### AWS CLI

**IAM-based registry:**

```bash
aws bedrock-agentcore-control create-registry \
  --name "MyRegistry" \
  --description "Production registry" \
  --region us-east-1
```
**JWT-based registry:**

```bash
aws bedrock-agentcore-control create-registry \
  --name "MyOAuthRegistry" \
  --authorizer-type CUSTOM_JWT \
  --authorizer-configuration '{"customJWTAuthorizer": {"discoveryUrl": "https://cognito-idp.us-east-1.amazonaws.com/<poolId>/.well-known/openid-configuration", "allowedClients": ["<appClientId>"]}}' \
  --region us-east-1
```
### AWS SDK

**IAM-based registry:**

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.create_registry(
    name='MyRegistry',
    description='Production registry'
)
print(response['registryArn'])
```
**JWT-based registry:**

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.create_registry(
    name='MyOAuthRegistry',
    authorizerType='CUSTOM_JWT',
    authorizerConfiguration={
        'customJWTAuthorizer': {
            'discoveryUrl': 'https://cognito-idp.us-east-1.amazonaws.com/<poolId>/.well-known/openid-configuration',
            'allowedClients': ['<appClientId>']
        }
    }
)
print(response['registryArn'])
```
## List registries

### Console

  1. Open the [Amazon Bedrock AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/home?region=us-east-1#>).

  2. In the navigation pane, under **Discover** , choose **Registry**.

  3. The **Registries** table displays all registries in your account with the following columns:

     1. **Name** — The registry name (linked to the detail page).

     2. **Description** — The registry description, if provided.

     3. **Authorization type** — The inbound authorization method (AWS_IAM or CUSTOM_JWT).

     4. **Status** — The current status (Creating, Ready, Updating, Deleting, or a failure state).

     5. **ARN** — The registry Amazon Resource Name.

     6. **Created** — The creation timestamp.

     7. **Last updated** — The last modification timestamp.

  4. Use the **Find registries** search bar to filter by name.

  5. Use the pagination controls to navigate through results.


### AWS CLI

```bash
aws bedrock-agentcore-control list-registries \
  --region us-east-1
```
### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.list_registries()
for registry in response['registries']:
    print(f"{registry['name']} - {registry['status']} - {registry['registryArn']}")
```
## View registry details

### Console

  1. Open the [Amazon Bedrock AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/home?region=us-east-1#>).

  2. In the navigation pane, under **Discover** , choose **Registry**.

  3. Choose the registry name from the **Registries** table.

  4. The registry detail page has two tabs:

     1. **Manage records** — View and manage registry records.

     2. **Search records** — Search for approved records in the registry.

  5. The **Registry details** section displays: Name, Status, Description, Auto-approval (Enabled or Disabled), Registry ARN, Last updated date, Created date.

  6. The **Registry records** section shows status summary counters (Total submitted, Pending approval, Approved, Deprecated, Rejected) and a records table.

  7. The **Search API Authorization** (Inbound Authorization) section shows the current authorization type.


### AWS CLI

```bash
aws bedrock-agentcore-control get-registry \
  --registry-id "<registryId>" \
  --region us-east-1
```
### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.get_registry(
    registryId='<registryId>'
)
print(f"Name: {response['name']}")
print(f"Status: {response['status']}")
print(f"ARN: {response['registryArn']}")
```
## Update a registry

### Console

  1. Open the [Amazon Bedrock AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/home?region=us-east-1#>).

  2. In the navigation pane, under **Discover** , choose **Registry**.

  3. Select the radio button next to the registry you want to edit, then choose **Edit** . Alternatively, choose the registry name and then choose **Edit**.

  4. On the **Edit registry** page, update any of the following:

     1. **Name** — Change the registry name (same naming rules as creation).

     2. **Description** — Under **Additional details** , update or add a description.

     3. **Record approval** — Toggle **Auto-approval** on or off. Changes only affect records submitted after the update.

  5. Choose **Save changes**.


###### Note

Updating auto-approval config from OFF to ON only affects records submitted after the change. Existing records already 'Pending Approval' are not affected and must still be approved or rejected by calling UpdateRegistryRecordStatus API. Changing the config from ON to OFF only affects records that are published to 'Pending Approval' after the change is made.

###### Note

The discovery URL (for a JWT authorized registry) cannot be changed after the registry is created. The inbound authorization type (IAM or JWT) cannot be changed after the registry is created.

### AWS CLI

```bash
aws bedrock-agentcore-control update-registry \
  --registry-id "<registryId>" \
  --description '{"optionalValue": "Updated description"}' \
  --region us-east-1
```
### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.update_registry(
    registryId='<registryId>',
    description={'optionalValue': 'Updated description'}
)
print(f"Updated: {response['name']} - Status: {response['status']}")
```
## Delete a registry

### Console

  1. Open the [Amazon Bedrock AgentCore console](<https://console.aws.amazon.com/bedrock-agentcore/home?region=us-east-1#>).

  2. In the navigation pane, under **Discover** , choose **Registry**.

  3. Select the radio button next to the registry you want to delete, then choose **Delete**.

  4. In the confirmation dialog, review the warning: you must first delete all registry records before deleting the registry.

  5. Type **delete** in the confirmation field.

  6. Choose **Delete**.


The registry status changes to **Deleting** . A success banner confirms when deletion completes.

### AWS CLI

```bash
aws bedrock-agentcore-control delete-registry \
  --registry-id "<registryId>" \
  --region us-east-1
```
### AWS SDK

```python
import boto3

client = boto3.client('bedrock-agentcore-control')

response = client.delete_registry(
    registryId='<registryId>'
)
print(f"Status: {response['status']}")  # DELETING
```
