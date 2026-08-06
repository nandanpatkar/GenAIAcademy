# Update a configuration bundle - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-update.html

---

# Update a configuration bundle  
  
Update a configuration bundle to create a new immutable version with changed configuration. Each update produces a new version ID; existing versions are never modified. Versions form a chain via `parentVersionIds`, similar to git commits.

## Code samples

###### Example

AgentCore CLI
    

Edit the configuration in `agentcore.json` and redeploy. The CLI detects the existing bundle and creates a new version with the correct `parentVersionIds` automatically:

```bash
# Edit the bundle configuration in agentcore.json (change model_id, system prompt, etc.)
# Then redeploy to create a new version:
agentcore deploy

# After deploying, confirm a new immutable version was created:
agentcore cb versions --name MyBundle

# Inspect what changed between two versions (get IDs from `cb versions`):
agentcore cb diff --name MyBundle --from <v1> --to <v2>
```
AWS SDK (boto3)
    

Update changing the model ID:

```python
import boto3
import uuid

client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

RUNTIME_ARN = "arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/MyAgent-abc123"

response = client.update_configuration_bundle(
    bundleId="myAgentConfig-a1b2c3d4e5",
    components={
        RUNTIME_ARN: {
            "configuration": {
                "system_prompt": "You are a helpful customer support assistant.",
                "model_id": "us.anthropic.claude-sonnet-4-20250514-v1:0",
                "temperature": 0.7,
            }
        }
    },
    parentVersionIds=["12345678-1234-1234-1234-123456789012"],
    commitMessage="Switch to Claude Sonnet 4",
    clientToken=str(uuid.uuid4()),
)

print(f"New version ID: {response['versionId']}")
```
Update with a recommended system prompt from a recommendation result:

```python
import boto3
import uuid

cp_client = boto3.client("bedrock-agentcore-control", region_name="us-west-2")
dp_client = boto3.client("bedrock-agentcore", region_name="us-west-2")

RUNTIME_ARN = "arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/MyAgent-abc123"

# Get the recommendation result
recommendation = dp_client.get_recommendation(recommendationId="myRec-a1b2c3d4e5")
recommended_prompt = recommendation["result"]["systemPromptRecommendationResult"]["recommendedSystemPrompt"]

# Update the bundle with the recommended prompt
response = cp_client.update_configuration_bundle(
    bundleId="myAgentConfig-a1b2c3d4e5",
    components={
        RUNTIME_ARN: {
            "configuration": {
                "system_prompt": recommended_prompt,
                "model_id": "global.anthropic.claude-sonnet-4-5-20250929-v1:0",
                "temperature": 0.7,
            }
        }
    },
    parentVersionIds=["12345678-1234-1234-1234-123456789012"],
    commitMessage="Apply recommended system prompt",
    createdBy={"name": "optimization-job", "arn": recommendation["recommendationArn"]},
    clientToken=str(uuid.uuid4()),
)

print(f"New version ID: {response['versionId']}")
```
## Request parameters

Parameter | Type | Required | Description  
---|---|---|---  
`bundleId` |  String |  Yes |  The ID of the configuration bundle to update. Passed as a path parameter.  
`bundleName` |  String |  No |  Updated name for the bundle.  
`description` |  String |  No |  Updated description. Maximum 500 characters.  
`components` |  Map |  No |  Updated component configurations. Creates a new version with these components.  
`parentVersionIds` |  List of strings |  No |  Parent version IDs for lineage tracking. **Required when updating`components`.** Regular commits: single parent. Merge commits: two parents (target branch latest, source branch latest). If the branch already exists, the first parent must be the latest version on that branch.  
`branchName` |  String |  No |  Branch name for this version. If not specified, inherits the parent’s branch or defaults to `mainline`.  
`commitMessage` |  String |  No |  Commit message describing the changes. Maximum 500 characters.  
`createdBy` |  Object |  No |  Source that created this version. Contains `name` (required) and `arn` (optional). Use this to track whether a version was created by a user, recommendation job, or other automation.  
`clientToken` |  String |  No |  Idempotency token.  
  
## Response

Field | Type | Description  
---|---|---  
`bundleArn` |  String |  ARN of the configuration bundle.  
`bundleId` |  String |  ID of the configuration bundle.  
`versionId` |  String |  UUID of the new version created by this update.  
`updatedAt` |  Timestamp |  When the update was applied.  
  
## Branching and merges

Configuration bundles support git-like branching:

  * **Linear commits.** Omit `parentVersionIds` or pass a single parent. The new version extends the branch lineage.

  * **New branch.** Specify a `branchName` that does not yet exist and a `parentVersionIds` pointing to the version you want to branch from.

  * **Merge commits.** Pass two `parentVersionIds`: the first is the latest version on the target branch, the second is the latest on the source branch. This creates a merge commit on the target branch.


## Errors

Error | HTTP status | Description  
---|---|---  
`ValidationException` |  400 |  Invalid request parameters. Check field constraints.  
`ResourceNotFoundException` |  404 |  The specified `bundleId` does not exist.  
`ConflictException` |  409 |  Version conflict. The specified parent version is not the latest on the branch. Fetch the latest version and retry.  
`AccessDeniedException` |  403 |  Insufficient permissions. Verify IAM policies include `bedrock-agentcore:UpdateConfigurationBundle`.  
`ThrottlingException` |  429 |  Request rate exceeded. Retry with exponential backoff.  
`InternalServerException` |  500 |  Service-side error. Retry the request.

