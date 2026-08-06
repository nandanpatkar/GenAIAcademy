# List batch evaluations - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-list.html

---

# List batch evaluations  
  
List all batch evaluation jobs in your account. Results are paginated.

## Code samples

###### Example

AWS SDK (boto3)
     ```python
     import boto3

     client = boto3.client("bedrock-agentcore", region_name="us-west-2")

     # List all batch evaluations
     paginator_token = None
     all_evaluations = []

     while True:
         params = {"maxResults": 50}
         if paginator_token:
             params["nextToken"] = paginator_token

         response = client.list_batch_evaluations(**params)
         all_evaluations.extend(response["batchEvaluations"])

         paginator_token = response.get("nextToken")
         if not paginator_token:
             break

     for evaluation in all_evaluations:
         print(
             f"{evaluation['batchEvaluationId']}  "
             f"{evaluation['batchEvaluationName']}  "
             f"{evaluation['status']}  "
             f"{evaluation['createdAt']}"
         )
     ```
AgentCore CLI
    

List all batch evaluation jobs (running jobs are refreshed from the service). Use `--json` for machine-readable output:

```bash
agentcore batch-evaluations history --json
```
To view a single batch evaluation job and its results, pass the job ID:

```bash
agentcore view batch-evaluation <batch-evaluation-id> --json
```
## Request parameters

Parameter | Type | Required | Description  
---|---|---|---  
`maxResults` |  Integer |  No |  Maximum number of results per page. Range: 1–100. Default: service-defined.  
`nextToken` |  String |  No |  Pagination token from a previous response.  
  
## Response

Field | Type | Description  
---|---|---  
`batchEvaluations` |  List |  List of batch evaluation summaries.  
`nextToken` |  String |  Pagination token for the next page. Absent when there are no more results.  
  
### Batch evaluation summary fields

Field | Type | Description  
---|---|---  
`batchEvaluationId` |  String |  Unique identifier.  
`batchEvaluationArn` |  String |  ARN of the batch evaluation.  
`batchEvaluationName` |  String |  Job name.  
`status` |  String |  Current status: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `COMPLETED_WITH_ERRORS`, `FAILED`, `STOPPING`, `STOPPED`, `DELETING`.  
`createdAt` |  Timestamp |  When the job was created.  
`evaluators` |  List |  The evaluators used.  
`evaluationResults` |  Object |  Aggregate results summary. Present when the job has completed.  
`errorDetails` |  List of strings |  Error messages if the job failed.  
  
## Errors

Error | HTTP status | Description  
---|---|---  
`ValidationException` |  400 |  Invalid pagination parameters.  
`AccessDeniedException` |  403 |  Insufficient permissions.  
`ThrottlingException` |  429 |  Request rate exceeded.  
`InternalServerException` |  500 |  Service-side error.

