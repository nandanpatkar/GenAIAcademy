# Start batch evaluation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-start.html

---

# Start batch evaluation

Start a batch evaluation to run evaluators against multiple agent sessions. The service discovers sessions from CloudWatch Logs, runs each evaluator against each session, and produces aggregate results.

## Code samples

###### Example

AgentCore CLI
    

The CLI resolves `serviceNames` and `logGroupNames` automatically from the project configuration when you use `--runtime`:

```bash
agentcore run batch-evaluation \
  --runtime MyAgent \
  --evaluator Builtin.GoalSuccessRate Builtin.Helpfulness Builtin.Faithfulness
```
With optional flags:

```bash
# Custom name and lookback window
agentcore run batch-evaluation \
  --runtime MyAgent \
  --evaluator Builtin.GoalSuccessRate \
  --name my_baseline_eval \
  --lookback-days 1

# Specific sessions
agentcore run batch-evaluation \
  --runtime MyAgent \
  --evaluator Builtin.GoalSuccessRate \
  --session-ids session-abc123 session-def456

# With ground truth
agentcore run batch-evaluation \
  --runtime MyAgent \
  --evaluator Builtin.GoalSuccessRate Builtin.Correctness \
  --ground-truth ground-truth.json
```
By default the command starts the job and returns immediately. Pass `--wait` to block until the job reaches a terminal state (`COMPLETED`, `FAILED`, or `STOPPED`), after which the CLI displays per-evaluator average scores and saves results to `.cli/jobs/batch-eval-results/`.

`agentcore run batch-evaluation` also supports the following flags:

  * `--wait` — block until the job reaches a terminal state.

  * `--json` — emit machine-readable JSON output.

  * `--kms-key <arn>` — encrypt batch evaluation results with a customer-managed KMS key.

  * `--dataset <name>` / `--dataset-version <version>` — invoke the agent with dataset scenarios before batch evaluation (omit the version for a local file, or use `N`/`DRAFT`).

  * `--endpoint <name>` — target a specific runtime endpoint (for example, `PROMPT_V1`); defaults to the `AGENTCORE_RUNTIME_ENDPOINT` environment variable, then `DEFAULT`.

  * `--evaluator-arn <arns…​>` — reference evaluators by ARN instead of `-e`.

Most flags have short aliases: `-r` (`--runtime`), `-e` (`--evaluator`), `-n` (`--name`), `-d` (`--lookback-days`), `-s` (`--session-ids`), and `-g` (`--ground-truth`).

To manage a job after it starts, run `agentcore stop batch-evaluation -i <id>` to stop a running job and `agentcore archive batch-evaluation -i <id>` to archive a job record.


AWS SDK (boto3)
     ```python
     import boto3
     import uuid
     import time
     import json

     client = boto3.client("bedrock-agentcore", region_name="us-west-2")

     # All sessions in the log group
     response = client.start_batch_evaluation(
         batchEvaluationName=f"baseline_eval_{uuid.uuid4().hex[:8]}",
         evaluators=[
             {"evaluatorId": "Builtin.GoalSuccessRate"},
             {"evaluatorId": "Builtin.Helpfulness"},
             {"evaluatorId": "Builtin.Faithfulness"},
         ],
         dataSourceConfig={
             "cloudWatchLogs": {
                 "serviceNames": ["MyAgent.DEFAULT"],
                 "logGroupNames": ["/aws/bedrock-agentcore/runtimes/MyAgent-abc123-DEFAULT"],
             }
         },
         clientToken=str(uuid.uuid4()),
     )

     batch_eval_id = response["batchEvaluationId"]
     print(f"Started: {batch_eval_id}")

     # Poll until complete
     while True:
         result = client.get_batch_evaluation(batchEvaluationId=batch_eval_id)
         status = result["status"]
         print(f"Status: {status}")

         if status in ("COMPLETED", "COMPLETED_WITH_ERRORS", "FAILED", "STOPPED"):
             break
         time.sleep(30)

     print(json.dumps(result, indent=4, default=str))
     ```
With session ID filtering:

```text
response = client.start_batch_evaluation(
    batchEvaluationName=f"targeted-eval-{uuid.uuid4().hex[:8]}",
    evaluators=[
        {"evaluatorId": "Builtin.GoalSuccessRate"},
    ],
    dataSourceConfig={
        "cloudWatchLogs": {
            "serviceNames": ["MyAgent.DEFAULT"],
            "logGroupNames": ["/aws/bedrock-agentcore/runtimes/MyAgent-abc123-DEFAULT"],
            "filterConfig": {
                "sessionIds": ["session-001", "session-002", "session-003"]
            },
        }
    },
    clientToken=str(uuid.uuid4()),
)
```
With time range filtering:

```python
from datetime import datetime, timedelta, timezone

now = datetime.now(timezone.utc)
response = client.start_batch_evaluation(
    batchEvaluationName=f"weekly-eval-{uuid.uuid4().hex[:8]}",
    evaluators=[
        {"evaluatorId": "Builtin.GoalSuccessRate"},
    ],
    dataSourceConfig={
        "cloudWatchLogs": {
            "serviceNames": ["MyAgent.DEFAULT"],
            "logGroupNames": ["/aws/bedrock-agentcore/runtimes/MyAgent-abc123-DEFAULT"],
            "filterConfig": {
                "timeRange": {
                    "startTime": (now - timedelta(days=7)).isoformat(),
                    "endTime": now.isoformat(),
                }
            },
        }
    },
    clientToken=str(uuid.uuid4()),
)
```
## Request parameters

Parameter | Type | Required | Description  
---|---|---|---  
`batchEvaluationName` |  String |  Yes |  A name for the batch evaluation job. Pattern: starts with a letter, alphanumeric and underscores, max 48 characters.  
`dataSourceConfig` |  Object |  Yes |  Where to find agent sessions. Specify a `cloudWatchLogs` source with the log groups and service name for your agent. See Session source below.  
`evaluators` |  List |  Yes |  List of evaluators. Each entry has an `evaluatorId` field (for example, `Builtin.GoalSuccessRate`). Maximum 10 evaluators.  
`evaluationMetadata` |  Object |  No |  Contains `sessionMetadata`, a list of per-session ground truth and metadata. Maximum 500 entries.  
`clientToken` |  String |  No |  Idempotency token. If you retry a request with the same client token, the service returns the existing job instead of creating a new one.  
  
## Session source

The `dataSourceConfig` parameter specifies the CloudWatch Logs location where the service discovers agent sessions.

### Required fields

Field | Type | Description  
---|---|---  
`cloudWatchLogs.serviceNames` |  List of strings (exactly 1) |  The service name that identifies your agent’s traces in CloudWatch. Convention: `{RuntimeName}.DEFAULT`.  
`cloudWatchLogs.logGroupNames` |  List of strings (1–5) |  CloudWatch log group names where agent telemetry is stored. Convention: `/aws/bedrock-agentcore/runtimes/{agentId}-DEFAULT`.  
  
### Optional fields

Field | Type | Description  
---|---|---  
`cloudWatchLogs.filterConfig.sessionIds` |  List of strings |  Evaluate only these specific session IDs. When omitted, the service discovers all sessions in the log group.  
`cloudWatchLogs.filterConfig.timeRange.startTime` |  ISO 8601 datetime |  Filter sessions created after this time.  
`cloudWatchLogs.filterConfig.timeRange.endTime` |  ISO 8601 datetime |  Filter sessions created before this time.  
  
## Response

Field | Type | Description  
---|---|---  
`batchEvaluationId` |  String |  Unique identifier for the batch evaluation.  
`batchEvaluationArn` |  String |  ARN of the batch evaluation.  
`batchEvaluationName` |  String |  The name you specified.  
`status` |  String |  Initial status. One of: `PENDING`, `IN_PROGRESS`.  
`evaluators` |  List |  The evaluators used.  
`createdAt` |  Timestamp |  When the job was created.  
`outputConfig` |  Object |  CloudWatch Logs destination for per-session results.  
  
## Errors

Error | HTTP status | Description  
---|---|---  
`ValidationException` |  400 |  Invalid request parameters. Check field constraints and required fields.  
`AccessDeniedException` |  403 |  Insufficient permissions. Verify IAM policies.  
`ConflictException` |  409 |  A batch evaluation with the same client token already exists with different parameters.  
`ThrottlingException` |  429 |  Request rate exceeded. Retry with exponential backoff.  
`InternalServerException` |  500 |  Service-side error. Retry the request.

