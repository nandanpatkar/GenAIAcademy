# Create a configuration bundle - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-create.html

---

# Create a configuration bundle

Create a configuration bundle to store a versioned snapshot of your agent’s dynamic configuration. The bundle is created with an initial version on the `mainline` branch.

###### Note

The CLI `add config-bundle` command saves the bundle definition to `agentcore.json` locally. To actually create it on the service, you must run `agentcore deploy` afterwards.

## Code samples

###### Example

AgentCore CLI
    

Create with inline components JSON, then deploy:

```bash
agentcore add config-bundle \
  --name myAgentConfig \
  --description "Initial config" \
  --branch mainline \
  --commit-message "Initial bundle creation" \
  --components '{"arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/MyAgent-abc123": {"configuration": {"system_prompt": "You are a helpful assistant.", "model_id": "global.anthropic.claude-sonnet-4-5-20250929-v1:0"}}}'

agentcore deploy
```
The `--components` keys can be ARNs or placeholders in the form `{{runtime:<name>}}` or `{{gateway:<name>}}`. Placeholders resolve to real ARNs at deploy time, so use the placeholder form for resources managed in your project. Raw ARN keys require the resource to already exist:

```bash
agentcore add config-bundle \
  --name myAgentConfig \
  --components '{"{{runtime:MyAgent}}": {"configuration": {"system_prompt": "You are a helpful assistant."}}}'

agentcore deploy
```
Add `--description`, `--branch`, and `--commit-message` to set version metadata, or `--json` to output the result as JSON.

Create from a components file, then deploy:

```bash
agentcore add config-bundle \
  --name myAgentConfig \
  --components-file ./components.json

agentcore deploy
```
Sample `components.json`:

```json
{
    "arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/MyAgent-abc123": {
        "configuration": {
            "system_prompt": "You are a helpful customer support assistant for Acme Store. When handling requests: 1) Identify ALL actions needed before starting any. 2) Execute each action in sequence. 3) Before ending any conversation, summarize what was done.",
            "model_id": "global.anthropic.claude-sonnet-4-5-20250929-v1:0"
        }
    }
}
```
AWS SDK (boto3)
     ```python
     import boto3
     import uuid

     client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

     RUNTIME_ARN = "arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/MyAgent-abc123"

     response = client.create_configuration_bundle(
         bundleName="myAgentConfig",
         components={
             RUNTIME_ARN: {
                 "configuration": {
                     "system_prompt": "You are a helpful customer support assistant.",
                     "model_id": "global.anthropic.claude-sonnet-4-5-20250929-v1:0",
                     "temperature": 0.7,
                 }
             }
         },
         description="Initial configuration for MyAgent",
         branchName="mainline",
         commitMessage="Initial bundle creation",
         clientToken=str(uuid.uuid4()),
     )

     print(f"Bundle ID: {response['bundleId']}")
     print(f"Bundle ARN: {response['bundleArn']}")
     print(f"Version ID: {response['versionId']}")
     ```
## Request parameters

Parameter | Type | Required | Description  
---|---|---|---  
`bundleName` |  String |  Yes |  Name for the bundle. Must match `[a-zA-Z][a-zA-Z0-9_]{0,99}`. Names must be unique within your account.  
`components` |  Map |  Yes |  Map of component identifier to component configuration. The key is typically the ARN of the AgentCore resource being configured (for example, a runtime ARN). Each value contains a `configuration` object with arbitrary key-value pairs.  
`description` |  String |  No |  Description of the bundle. Maximum 500 characters.  
`branchName` |  String |  No |  Branch name for version tracking. Defaults to `mainline`. Must match `[a-zA-Z][a-zA-Z0-9_/-]{0,127}`.  
`commitMessage` |  String |  No |  Commit message for the initial version. Maximum 500 characters.  
`createdBy` |  Object |  No |  Source that created this version. Contains `name` (required) and `arn` (optional).  
`clientToken` |  String |  No |  Idempotency token. If you retry with the same token, the service returns the existing bundle instead of creating a new one.  
`tags` |  Map |  No |  Resource tags. Maximum 50 tags.  
  
## Response

Field | Type | Description  
---|---|---  
`bundleArn` |  String |  ARN of the created configuration bundle.  
`bundleId` |  String |  Unique identifier for the bundle. Format: `{name}-{10-char-suffix}`.  
`versionId` |  String |  UUID of the initial version created with the bundle.  
`createdAt` |  Timestamp |  When the bundle was created.  
  
## Errors

Error | HTTP status | Description  
---|---|---  
`ValidationException` |  400 |  Invalid request parameters. Check field constraints and naming patterns.  
`ConflictException` |  409 |  A bundle with the same name or client token already exists.  
`ServiceQuotaExceededException` |  402 |  You have reached the maximum number of configuration bundles for your account.  
`AccessDeniedException` |  403 |  Insufficient permissions. Verify IAM policies include `bedrock-agentcore:CreateConfigurationBundle`.  
`ThrottlingException` |  429 |  Request rate exceeded. Retry with exponential backoff.  
`InternalServerException` |  500 |  Service-side error. Retry the request.

