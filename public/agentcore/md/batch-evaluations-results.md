# Understanding results and output - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-results.html

---

# Understanding results and output  
  
Batch evaluation results come in two layers: aggregate summaries in the API response, and per-session detail in CloudWatch Logs.

## Aggregate results

When a batch evaluation completes, the `GetBatchEvaluation` response includes an `evaluationResults` object with aggregate summaries.

### Session counts

Field | Description  
---|---  
`numberOfSessionsCompleted` |  Number of sessions successfully evaluated by all evaluators.  
`numberOfSessionsFailed` |  Number of sessions where at least one evaluator failed.  
`numberOfSessionsInProgress` |  Number of sessions still being evaluated (0 when the job is complete).  
`totalNumberOfSessions` |  Total number of sessions discovered from the session source.  
`numberOfSessionsIgnored` |  Number of sessions ignored for evaluation. The service evaluates up to 500 sessions per job. If more than 500 sessions are discovered, the service selects the 500 most recent sessions and ignores the rest.  
  
### Per-evaluator summaries

Each entry in `evaluatorSummaries` provides aggregate metrics for one evaluator:

Field | Description  
---|---  
`evaluatorId` |  Short ID (for example, `Builtin.GoalSuccessRate`).  
`statistics.averageScore` |  Mean score across all evaluated sessions. Range depends on the evaluator (typically 0–1).  
`totalEvaluated` |  Number of sessions this evaluator successfully scored.  
`totalFailed` |  Number of sessions where this evaluator returned an error.  
  
### Example response

```json
{
    "batchEvaluationId": "12345678-1234-1234-1234-123456789012",
    "status": "COMPLETED",
    "evaluationResults": {
        "numberOfSessionsCompleted": 47,
        "numberOfSessionsFailed": 3,
        "numberOfSessionsIgnored": 0,
        "totalNumberOfSessions": 50,
        "evaluatorSummaries": [
            {
                "evaluatorId": "Builtin.GoalSuccessRate",
                "statistics": {
                    "averageScore": 0.72
                },
                "totalEvaluated": 47,
                "totalFailed": 0
            },
            {
                "evaluatorId": "Builtin.Helpfulness",
                "statistics": {
                    "averageScore": 0.81
                },
                "totalEvaluated": 47,
                "totalFailed": 0
            }
        ]
    }
}
```
## Per-session detail in CloudWatch Logs

The `outputConfig` field in the `GetBatchEvaluation` response specifies a CloudWatch Logs location where per-session, per-evaluator results are written as OpenTelemetry events.

```json
{
    "outputConfig": {
        "cloudWatchConfig": {
            "logGroupName": "/aws/bedrock-agentcore/evaluations/batch",
            "logStreamName": "12345678-1234-1234-1234-123456789012"
        }
    }
}
```
Each event in the log stream contains per-turn, per-evaluator detail:

Field | Description  
---|---  
`gen_ai.evaluation.score.value` |  Numeric score for this turn.  
`gen_ai.evaluation.score.label` |  Categorical label (for example, `PASS`, `Very Helpful`).  
`gen_ai.evaluation.explanation` |  LLM-generated reasoning for the score.  
  
To read these events, use the CloudWatch Logs API:

```python
import boto3

logs_client = boto3.client("logs", region_name="us-west-2")

response = logs_client.get_log_events(
    logGroupName="/aws/bedrock-agentcore/evaluations/batch",
    logStreamName="12345678-1234-1234-1234-123456789012",
)

for event in response["events"]:
    print(event["message"])
```
## Interpreting scores

Batch evaluation scores follow the same conventions as on-demand evaluation:

  * **Numeric scores** (`value`): Range depends on the evaluator. Most built-in evaluators score from 0 to 1, where higher is better.

  * **Labels** (`label`): Categorical descriptions of the score. For example, `Builtin.Helpfulness` returns labels like `Very Helpful`, `Somewhat Helpful`, `Not Helpful`.


## Error handling

### Job-level errors

If the batch evaluation job fails entirely, the `status` is `FAILED` and `errorDetails` contains one or more error messages describing what went wrong. Common causes:

  * No sessions found in the specified source.

  * Invalid CloudWatch log group or service name.


### Session-level errors

Individual sessions can fail while the overall job succeeds. The `numberOfSessionsFailed` count in `evaluationResults` indicates how many sessions had errors. Per-session errors are recorded in the CloudWatch Logs output.

### Evaluator-level errors

Within a successfully evaluated session, individual evaluators can fail. The `totalFailed` count on each evaluator summary indicates how many sessions that evaluator could not score. Common causes include malformed spans or missing required attributes.

## Comparing results across runs

A common workflow is to run batch evaluation before and after a change (prompt update, model swap, tool modification) and compare the aggregate scores:

```bash
# After running two batch evaluations
baseline = client.get_batch_evaluation(batchEvaluationId=baseline_id)
treatment = client.get_batch_evaluation(batchEvaluationId=treatment_id)

baseline_summaries = {
    s["evaluatorId"]: s["statistics"]["averageScore"]
    for s in baseline["evaluationResults"]["evaluatorSummaries"]
}
treatment_summaries = {
    s["evaluatorId"]: s["statistics"]["averageScore"]
    for s in treatment["evaluationResults"]["evaluatorSummaries"]
}

print(f"{'Evaluator':<35} {'Baseline':>10} {'Treatment':>10} {'Delta':>10}")
print("=" * 67)
for eid in baseline_summaries:
    b = baseline_summaries[eid]
    t = treatment_summaries.get(eid, 0)
    delta = t - b
    print(f"{eid:<35} {b:>10.4f} {t:>10.4f} {delta:>+10.4f}")
```
## Viewing results from the CLI

In addition to the `GetBatchEvaluation` API, the AgentCore CLI surfaces the same results:

  * `agentcore view batch-evaluation <batch-evaluation-id>` — view a single job and its results (add `--json` for the raw output).

  * `agentcore batch-evaluations history` — list batch evaluation jobs (running jobs are refreshed from the service; add `--json`).

  * `agentcore run batch-evaluation …​ --json` — returns the same `batchEvaluationId` / `evaluationResults` / `evaluatorSummaries` object shown in the JSON example above.


```bash
# View a single batch evaluation job and its results
agentcore view batch-evaluation 12345678-1234-1234-1234-123456789012 --json

# List batch evaluation jobs (running jobs are refreshed from the service)
agentcore batch-evaluations history --json
```
###### Note

The run command flag for selecting evaluators is `-e, --evaluator <ids…​>` (or `--evaluator-arn <arns…​>`).

