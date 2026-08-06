# Get recommendation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/recommendations-get.html

---

# Get recommendation  
  
Retrieve the status and results of a recommendation. Poll this operation until the recommendation reaches a terminal state (`COMPLETED` or `FAILED`).

## Code samples

###### Example

AgentCore CLI
    

`agentcore run recommendation` submits a fire-and-forget job. Pass `--wait` to block until it reaches a terminal state, or check on it later by ID:

```bash
agentcore view recommendation <recommendation-id>
```
List all recommendation jobs, or view as JSON:

```bash
agentcore view recommendation
agentcore view recommendation <recommendation-id> --json
```
AWS SDK (boto3)
    

Poll until completion and extract the result:

```python
import time
import boto3

client = boto3.client("bedrock-agentcore", region_name="us-west-2")

# Poll until terminal state
while True:
    result = client.get_recommendation(recommendationId=recommendation_id)
    status = result["status"]
    print(f"Status: {status}")

    if status in ("COMPLETED", "FAILED"):
        break
    time.sleep(15)

# Extract system prompt result
if status == "COMPLETED":
    rec_result = result.get("recommendationResult", {})

    if "systemPromptRecommendationResult" in rec_result:
        sys_result = rec_result["systemPromptRecommendationResult"]
        print(f"Recommended prompt:\n{sys_result['recommendedSystemPrompt']}")

        if "explanation" in sys_result:
            print(f"Explanation:\n{sys_result['explanation']}")

        if "configurationBundle" in sys_result:
            bundle = sys_result["configurationBundle"]
            print(f"New bundle version: {bundle['versionId']}")

    elif "toolDescriptionRecommendationResult" in rec_result:
        tool_result = rec_result["toolDescriptionRecommendationResult"]
        for tool in tool_result.get("tools", []):
            print(f"{tool['toolName']}: {tool['recommendedToolDescription']}")
            if "explanation" in tool:
                print(f"  Explanation: {tool['explanation']}")

elif status == "FAILED":
    rec_result = result.get("recommendationResult", {})
    r = rec_result.get("systemPromptRecommendationResult") or rec_result.get("toolDescriptionRecommendationResult")
    print(f"Error: [{r['errorCode']}] {r['errorMessage']}")
```
Extract configuration bundle reference for use in A/B testing:

```python
result = client.get_recommendation(recommendationId=recommendation_id)

if result["status"] == "COMPLETED":
    rec_result = result["recommendationResult"]
    sys_result = rec_result.get("systemPromptRecommendationResult", {})

    if "configurationBundle" in sys_result:
        bundle_arn = sys_result["configurationBundle"]["bundleArn"]
        version_id = sys_result["configurationBundle"]["versionId"]
        print(f"Use in A/B test: bundle={bundle_arn}, version={version_id}")
```
## Request parameters

Parameter | Type | Required | Description  
---|---|---|---  
`recommendationId` |  String |  Yes |  The recommendation ID returned by `StartRecommendation`. Passed as a path parameter.  
  
## Response

Field | Type | Description  
---|---|---  
`recommendationId` |  String |  Unique identifier for the recommendation.  
`recommendationArn` |  String |  ARN of the recommendation.  
`name` |  String |  The recommendation name.  
`type` |  String |  `SYSTEM_PROMPT_RECOMMENDATION` or `TOOL_DESCRIPTION_RECOMMENDATION`.  
`status` |  String |  Current status: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `FAILED`, or `DELETING`.  
`recommendationConfig` |  Object |  The configuration you submitted.  
`recommendationResult` |  Object |  Present when status is `COMPLETED`. Contains the optimized configuration. The shape depends on the recommendation type.  
`createdAt` |  Timestamp |  When the recommendation was created.  
`updatedAt` |  Timestamp |  When the recommendation was last updated.  
  
### System prompt result fields

Present in `recommendationResult.systemPromptRecommendationResult` when type is `SYSTEM_PROMPT_RECOMMENDATION`:

Field | Type | Description  
---|---|---  
`recommendedSystemPrompt` |  String |  The optimized system prompt text.  
`configurationBundle` |  Object |  Present when the input was a configuration bundle. Contains `bundleArn` and `versionId` for the new bundle version.  
`explanation` |  String |  An explanation of why the recommendation was generated and the reasoning behind the suggested changes.  
`errorCode` |  String |  Present on failure. Error code.  
`errorMessage` |  String |  Present on failure. Human-readable description.  
  
### Tool description result fields

Present in `recommendationResult.toolDescriptionRecommendationResult` when type is `TOOL_DESCRIPTION_RECOMMENDATION`:

Field | Type | Description  
---|---|---  
`tools` |  List |  Per-tool results. Each entry contains `toolName`, `recommendedToolDescription`, and `explanation`.  
`configurationBundle` |  Object |  Present when the input was a configuration bundle. Contains `bundleArn` and `versionId` for the new bundle version.  
`errorCode` |  String |  Present on failure. Error code.  
`errorMessage` |  String |  Present on failure. Human-readable description.  
  
## Example responses

Completed system prompt recommendation (inline input):

```json
{
    "recommendationId": "MyPromptRec-Ab1Cd2Ef3G",
    "recommendationArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:recommendation/MyPromptRec-Ab1Cd2Ef3G",
    "name": "my-prompt-rec",
    "type": "SYSTEM_PROMPT_RECOMMENDATION",
    "status": "COMPLETED",
    "recommendationConfig": { ... },
    "recommendationResult": {
        "systemPromptRecommendationResult": {
            "recommendedSystemPrompt": "<optimized system prompt text>",
            "explanation": "<explanation of why the recommendation was generated>"
        }
    },
    "createdAt": "2025-03-15T10:00:00Z",
    "updatedAt": "2025-03-15T10:05:30Z"
}
```
Completed system prompt recommendation (configuration bundle input):

```json
{
    "recommendationId": "MyBundleRec-Xy9Zw8Vq1R",
    "recommendationArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:recommendation/MyBundleRec-Xy9Zw8Vq1R",
    "name": "my-bundle-prompt-rec",
    "type": "SYSTEM_PROMPT_RECOMMENDATION",
    "status": "COMPLETED",
    "recommendationConfig": { ... },
    "recommendationResult": {
        "systemPromptRecommendationResult": {
            "recommendedSystemPrompt": "<optimized system prompt text>",
            "configurationBundle": {
                "bundleArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/myBundle-Ab1Cd2Ef3G",
                "versionId": "12345678-1234-1234-1234-123456789012"
            },
            "explanation": "<explanation of why the recommendation was generated>"
        }
    },
    "createdAt": "2025-03-15T10:00:00Z",
    "updatedAt": "2025-03-15T10:06:12Z"
}
```
Completed tool description recommendation:

```json
{
    "recommendationId": "MyToolRec-Qr5St6Uv7W",
    "recommendationArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:recommendation/MyToolRec-Qr5St6Uv7W",
    "name": "my-tool-rec",
    "type": "TOOL_DESCRIPTION_RECOMMENDATION",
    "status": "COMPLETED",
    "recommendationConfig": { ... },
    "recommendationResult": {
        "toolDescriptionRecommendationResult": {
            "tools": [
                {
                    "toolName": "<tool-name-1>",
                    "recommendedToolDescription": "<optimized description for tool 1>",
                    "explanation": "<explanation of why this tool description was changed>"
                },
                {
                    "toolName": "<tool-name-2>",
                    "recommendedToolDescription": "<optimized description for tool 2>",
                    "explanation": "<explanation of why this tool description was changed>"
                }
            ]
        }
    },
    "createdAt": "2025-03-15T11:00:00Z",
    "updatedAt": "2025-03-15T11:04:45Z"
}
```
Failed recommendation:

```json
{
    "recommendationId": "MyFailedRec-Mn3Op4Qr5S",
    "recommendationArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:recommendation/MyFailedRec-Mn3Op4Qr5S",
    "name": "my-failed-rec",
    "type": "SYSTEM_PROMPT_RECOMMENDATION",
    "status": "FAILED",
    "recommendationConfig": { ... },
    "recommendationResult": {
        "systemPromptRecommendationResult": {
            "errorCode": "<error-code>",
            "errorMessage": "<human-readable error description>"
        }
    },
    "createdAt": "2025-03-15T12:00:00Z",
    "updatedAt": "2025-03-15T12:01:10Z"
}
```
## Errors

Error | HTTP status | Description  
---|---|---  
`ResourceNotFoundException` |  404 |  No recommendation found with the specified ID.  
`ValidationException` |  400 |  Invalid recommendation ID format.  
`AccessDeniedException` |  403 |  Insufficient permissions.  
`ThrottlingException` |  429 |  Request rate exceeded.  
`InternalServerException` |  500 |  Service-side error.

