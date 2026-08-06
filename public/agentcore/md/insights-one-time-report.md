# One-time insights report - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/insights-one-time-report.html

---

# One-time insights report

Use `StartBatchEvaluation` to run an on-demand insights analysis over your agent’s sessions. This is useful when you want to investigate agent behavior after a deployment, a spike in failures, or as a periodic manual check.

###### Topics

  * Start the analysis

  * Poll for results

  * Review failure analysis findings

  * User intent results

  * Execution summary results

  * Interpreting results

  * Validation rules


## Start the analysis

###### Example

AgentCore CLI
     ```bash
     agentcore run insights --runtime MyAgent --insights Builtin.Insight.FailureAnalysis --lookback-days 7 --json
     ```
The CLI is async by default — it prints the job ID and exits. Use `--wait` to block until the job completes:

```bash
agentcore run insights --runtime MyAgent --insights Builtin.Insight.FailureAnalysis --lookback-days 7 --wait --json
```
If you have an online evaluation config already deployed, you can inherit its settings:

```bash
agentcore run insights --online-eval-config-arn <arn> --json
```
Interactive
    

  1. Run `agentcore` to open the TUI, then select **run** and choose **Insights** :

![Run menu: select Insights](/agentcore/images/insights-run-select.png)

  2. Choose the session source:

![Run Insights wizard: select session source](/agentcore/images/insights-run-source.png)

  3. Select the insights to run:

![Run Insights wizard: select insights](/agentcore/images/insights-run-insights.png)

Continue through the remaining wizard steps (sessions, lookback period, name) and confirm.


AWS SDK (boto3)
     ```python
     import boto3
     import uuid

     client = boto3.client("bedrock-agentcore", region_name="us-west-2")

     response = client.start_batch_evaluation(
         batchEvaluationName=f"insights-run-{uuid.uuid4().hex[:8]}",
         insights=[
             {"insightId": "Builtin.Insight.FailureAnalysis"},
             {"insightId": "Builtin.Insight.UserIntent"},
         ],
         dataSourceConfig={
             "cloudWatchLogs": {
                 "serviceNames": ["MyAgent.DEFAULT"],
                 "logGroupNames": [
                     "/aws/bedrock-agentcore/runtimes/MyAgent-abc123-DEFAULT"
                 ],
             }
         },
         # Optional: narrow to a specific time range
         filterConfig={
             "timeRange": {
                 "startTime": "2026-05-27T00:00:00Z",
                 "endTime": "2026-06-03T00:00:00Z",
             },
             # Or analyze specific sessions by ID
             "sessionIds": ["session-001", "session-002", "session-003"]
         },
         clientToken=str(uuid.uuid4()),
     )

     batch_eval_id = response["batchEvaluationId"]
     print(f"Started: {batch_eval_id}")
     ```
You can also:

  * Narrow the analysis to a specific time range by adding `filterConfig.timeRange`

  * Analyze specific sessions by ID using `filterConfig.sessionIds`


## Poll for results

###### Example

AgentCore CLI
    

List all insights jobs:

```bash
agentcore view insights --json
```
View detail for a specific job:

```bash
agentcore view insights <id> --json
```
AWS SDK (boto3)
     ```python
     import time

     while True:
         result = client.get_batch_evaluation(batchEvaluationId=batch_eval_id)
         status = result["status"]
         print(f"Status: {status}")

         if status in ("COMPLETED", "COMPLETED_WITH_ERRORS", "FAILED", "STOPPED"):
             break
         time.sleep(30)
     ```
## Review failure analysis findings

```python
if "failureAnalysisResult" in result:
    for category in result["failureAnalysisResult"]["failures"]:
        print(f"\nCategory: {category['name']} ({category['affectedSessionCount']} sessions)")
        for sub in category.get("subCategories", []):
            print(f"  Subcategory: {sub['name']} ({sub['affectedSessionCount']} sessions)")
            for rc in sub.get("rootCauses", []):
                print(f"    Root cause: {rc['name']}")
                print(f"    Recommendation: {rc['recommendation']}")
                print(f"    Affected sessions: {rc['affectedSessionCount']}")
```
Field | Type | Description  
---|---|---  
`failures[].name` |  String |  Failure category name (e.g., "Execution errors", "Hallucinations").  
`failures[].affectedSessionCount` |  Integer |  Number of sessions affected by this category.  
`failures[].subCategories[].name` |  String |  Subcategory name (e.g., "Rate limiting", "Tool schema violations").  
`failures[].subCategories[].affectedSessionCount` |  Integer |  Number of sessions affected by this subcategory.  
`failures[].subCategories[].rootCauses[].name` |  String |  Root cause cluster name.  
`failures[].subCategories[].rootCauses[].recommendation` |  String |  Suggested fix for this root cause.  
`failures[].subCategories[].rootCauses[].affectedSessionCount` |  Integer |  Number of sessions affected by this root cause.  
`failures[].subCategories[].rootCauses[].affectedSessions` |  List |  Sessions in this cluster, each with `sessionId`.  
  
## User intent results

The `userIntentResult` field contains clustered user intents:

```python
if "userIntentResult" in result:
    for cluster in result["userIntentResult"]["userIntents"]:
        print(f"  {cluster['name']} ({cluster['affectedSessionCount']} sessions)")
        print(f"    {cluster['description']}")
```
Field | Type | Description  
---|---|---  
`userIntents[].clusterId` |  Integer |  Cluster identifier.  
`userIntents[].name` |  String |  Cluster name describing the common intent.  
`userIntents[].description` |  String |  Detailed description of the intent pattern.  
`userIntents[].affectedSessionCount` |  Integer |  Number of sessions with this intent.  
`userIntents[].affectedSessions` |  List |  Sessions in this cluster, each with `sessionId` and `userMessages`.  
  
## Execution summary results

The `executionSummaryResult` field contains clustered execution patterns:

Field | Type | Description  
---|---|---  
`executionSummaries[].clusterId` |  Integer |  Cluster identifier.  
`executionSummaries[].name` |  String |  Cluster name describing the execution pattern.  
`executionSummaries[].description` |  String |  Detailed description of the pattern.  
`executionSummaries[].affectedSessionCount` |  Integer |  Number of sessions with this pattern.  
`executionSummaries[].affectedSessions` |  List |  Sessions in this cluster, each with `sessionId`, `approachTaken`, and `finalOutcome`.  
  
## Interpreting results

  * **Start with failure analysis:** Focus on categories with the highest `affectedSessionCount`. These represent the most impactful issues.

  * **Drill into root causes:** Within each subcategory, root cause clusters tell you exactly what’s going wrong and how to fix it. Each cluster includes a `recommendation` field.

  * **Use user intents to prioritize:** Cross-reference failure categories with user intent clusters. Failures affecting your most common user intents should be highest priority.

  * **Track execution patterns:** Execution summaries reveal how your agent approaches problems — useful for understanding whether failures stem from the agent’s strategy versus tool/environment issues.


## Validation rules

  * `insights` and `evaluators` are mutually exclusive — provide one or the other, not both.

  * Maximum 10 insights per request.

  * `dataSourceConfig` is required and must include at least one log group and one service name.

  * If using `onlineEvaluationConfigSource`, do not provide `insights` or `evaluators` (the config is inherited).

  * If `filterConfig.timeRange` is specified, `startTime` must be earlier than `endTime`.

  * Timestamps must be valid ISO 8601 format.

  * Only one batch evaluation can be active per account at a time.

  * A maximum of 500 sessions are analyzed per insights run.



