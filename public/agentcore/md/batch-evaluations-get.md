# Get batch evaluation results - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-get.html

---

# Get batch evaluation results  
  
Retrieve the status and results of a batch evaluation job. Poll this operation until the job reaches a terminal state (`COMPLETED`, `FAILED`, or `STOPPED`).

## Code samples

###### Example

AgentCore CLI
    

The `--wait` flag controls how `agentcore run batch-evaluation` behaves:

  * With `--wait`: the command blocks until the job reaches a terminal state.

  * Without `--wait`: the command starts the job and returns immediately. You poll for status separately.

```bash
# Start a job and block until it reaches a terminal state
agentcore run batch-evaluation -r MyAgent -e Builtin.Correctness --wait

# List previously started jobs (running jobs are refreshed from the service)
agentcore batch-evaluations history

# Check the status and results of a single job
agentcore view batch-evaluation <batch-evaluation-id>

# Non-interactive (JSON) output, the CLI analogue of a get_batch_evaluation polling loop
agentcore view batch-evaluation <batch-evaluation-id> --json

# Stop a running job
agentcore stop batch-evaluation -i <batch-evaluation-id>
```
Use the batch evaluation ID from the CLI output of `agentcore run batch-evaluation` or from the `agentcore batch-evaluations history` list.


AWS SDK (boto3)
     ```python
     import time
     import boto3

     client = boto3.client("bedrock-agentcore", region_name="us-west-2")

     # Poll until terminal state
     while True:
         result = client.get_batch_evaluation(batchEvaluationId=batch_eval_id)
         status = result["status"]
         print(f"Status: {status}")

         if status in ("COMPLETED", "COMPLETED_WITH_ERRORS", "FAILED", "STOPPED"):
             break
         time.sleep(30)

     # Display results
     if result.get("evaluationResults"):
         er = result["evaluationResults"]
         print(f"Sessions completed: {er.get('numberOfSessionsCompleted', 0)}")
         print(f"Sessions failed:    {er.get('numberOfSessionsFailed', 0)}")
         print(f"Total sessions:     {er.get('totalNumberOfSessions', 0)}")

         for summary in er.get("evaluatorSummaries", []):
             avg = summary.get("statistics", {}).get("averageScore")
             print(f"  {summary['evaluatorId']}: {avg}")
     ```
## Request parameters

Parameter | Type | Required | Description  
---|---|---|---  
`batchEvaluationId` |  String |  Yes |  The batch evaluation ID returned by `StartBatchEvaluation`. Passed as a path parameter.  
  
## Response

Field | Type | Description  
---|---|---  
`batchEvaluationId` |  String |  The batch evaluation ID.  
`batchEvaluationArn` |  String |  ARN of the batch evaluation.  
`batchEvaluationName` |  String |  The job name.  
`status` |  String |  Current status: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `COMPLETED_WITH_ERRORS`, `FAILED`, `STOPPING`, `STOPPED`, `DELETING`.  
`createdAt` |  Timestamp |  When the job was created.  
`evaluators` |  List |  The evaluators used.  
`outputConfig` |  Object |  CloudWatch Logs destination for per-session detail. Contains `cloudWatchConfig.logGroupName` and `cloudWatchConfig.logStreamName`.  
`evaluationResults` |  Object |  Present when the job has processed sessions. See [Understanding results and output](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations-results.html>).  
`errorDetails` |  List of strings |  Error messages if the job failed.  
  
### evaluationResults fields

Field | Type | Description  
---|---|---  
`numberOfSessionsCompleted` |  Integer |  Number of sessions successfully evaluated.  
`numberOfSessionsFailed` |  Integer |  Number of sessions that failed evaluation.  
`numberOfSessionsInProgress` |  Integer |  Number of sessions still being evaluated.  
`totalNumberOfSessions` |  Integer |  Total number of sessions discovered.  
`numberOfSessionsIgnored` |  Integer |  Number of sessions ignored for evaluation. The service evaluates up to 500 sessions per job; if more are discovered, the most recent 500 are selected.  
`evaluatorSummaries` |  List |  Per-evaluator aggregate results.  
  
### evaluatorSummaries fields

Field | Type | Description  
---|---|---  
`evaluatorId` |  String |  Evaluator ID (for example, `Builtin.GoalSuccessRate`).  
`statistics.averageScore` |  Double |  Average score across all evaluated sessions.  
`totalEvaluated` |  Integer |  Number of sessions this evaluator scored.  
`totalFailed` |  Integer |  Number of sessions where this evaluator failed.  
  
## Status lifecycle

```text
PENDING → IN_PROGRESS → COMPLETED
                      → COMPLETED_WITH_ERRORS
                      → FAILED
         STOPPING     → STOPPED
         DELETING
```
  * **PENDING** — The job has been accepted and is queued for processing.

  * **IN_PROGRESS** — The service is discovering sessions and running evaluators.

  * **COMPLETED** — All sessions have been evaluated. Results are available.

  * **COMPLETED_WITH_ERRORS** — The job finished but some sessions encountered errors. Partial results are available.

  * **FAILED** — The job encountered an error. Check `errorDetails` for details.

  * **STOPPING** — A stop request has been received. The job is winding down.

  * **STOPPED** — The job was stopped before completion. Partial results may be available.

  * **DELETING** — The job is being deleted.


## Errors

Error | HTTP status | Description  
---|---|---  
`ResourceNotFoundException` |  404 |  No batch evaluation found with the specified ID.  
`ValidationException` |  400 |  Invalid batch evaluation ID format.  
`AccessDeniedException` |  403 |  Insufficient permissions.  
`ThrottlingException` |  429 |  Request rate exceeded.  
`InternalServerException` |  500 |  Service-side error.

