# Delete recommendation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/recommendations-delete.html

---

# Delete recommendation  
  
Delete a recommendation and its associated metadata. The recommendation must be in a terminal state (`COMPLETED` or `FAILED`) before it can be deleted.

Deleting a recommendation removes the record from `ListRecommendations`. It does not affect any configuration bundle versions that were created as part of the recommendation result.

## Code samples

###### Example

AWS SDK (boto3)
     ```python
     import boto3

     client = boto3.client("bedrock-agentcore", region_name="us-west-2")

     response = client.delete_recommendation(
         recommendationId="MyPromptRec-Ab1Cd2Ef3G"
     )
     print(f"Deleted: {response['recommendationId']}")
     print(f"Status: {response['status']}")
     ```
AgentCore CLI
     ```bash
     agentcore archive recommendation -i MyPromptRec-Ab1Cd2Ef3G
     ```
The recommendation must be in a terminal state (`COMPLETED` or `FAILED`). This command archives the recommendation job record on the service and clears local history.

## Request parameters

Parameter | Type | Required | Description  
---|---|---|---  
`recommendationId` |  String |  Yes |  The recommendation ID to delete. Passed as a path parameter.  
  
## Response

Field | Type | Description  
---|---|---  
`recommendationId` |  String |  The recommendation ID.  
`status` |  String |  Status of the deleted recommendation (`DELETING`).  
  
## Errors

Error | HTTP status | Description  
---|---|---  
`ResourceNotFoundException` |  404 |  No recommendation found with the specified ID.  
`ConflictException` |  409 |  The recommendation is still running (`PENDING` or `IN_PROGRESS`). Wait for it to complete or fail before deleting.  
`ValidationException` |  400 |  Invalid recommendation ID format.  
`AccessDeniedException` |  403 |  Insufficient permissions.  
`ThrottlingException` |  429 |  Request rate exceeded.  
`InternalServerException` |  500 |  Service-side error.

