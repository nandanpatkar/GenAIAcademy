# Recurring insights report - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/insights-recurring-report.html

---

# Recurring insights report

Create an online evaluation configuration with insights and a clustering schedule. The service automatically runs insights analysis on the configured cadence without manual intervention.

###### Topics

  * Create the configuration

  * Configuration parameters

  * Update a configuration

  * View recurring report results

  * Manage the configuration


## Create the configuration

###### Example

AgentCore CLI
     ```bash
     agentcore add online-insights --name my_agent_insights --runtime MyAgent --insights Builtin.Insight.FailureAnalysis --sampling-rate 100 --clustering-frequency DAILY --enable-on-create --json
     ```
Then deploy via CloudFormation:

```bash
agentcore deploy -y --json
```
Interactive
    

  1. Run `agentcore` to open the TUI, then select **add** and choose **Online Insights** :

![Insights wizard: select agent to monitor](/agentcore/images/insights-add-agent.png)

  2. Select the insights to enable:

![Insights wizard: select insights](/agentcore/images/insights-add-insights.png)

  3. Set the sampling rate:

![Insights wizard: set sampling rate](/agentcore/images/insights-add-sampling-rate.png)

  4. Choose clustering frequencies:

![Insights wizard: select clustering frequency](/agentcore/images/insights-add-clustering.png)

  5. Enter a config name:

![Insights wizard: enter config name](/agentcore/images/insights-add-name.png)

  6. Review the configuration and press Enter to confirm:

![Insights wizard: review configuration](/agentcore/images/insights-add-confirm.png)


AWS SDK (boto3)
     ```python
     import boto3

     client_cp = boto3.client("bedrock-agentcore-control", region_name="us-west-2")

     response = client_cp.create_online_evaluation_config(
         onlineEvaluationConfigName="my_agent_insights",
         rule={
             "samplingConfig": {"samplingPercentage": 100.0},
             "sessionConfig": {"sessionTimeoutMinutes": 30},
         },
         dataSourceConfig={
             "cloudWatchLogs": {
                 "serviceNames": ["MyAgent.DEFAULT"],
                 "logGroupNames": [
                     "/aws/bedrock-agentcore/runtimes/MyAgent-abc123-DEFAULT"
                 ],
             }
         },
         insights=[
             {"insightId": "Builtin.Insight.FailureAnalysis"},
             {"insightId": "Builtin.Insight.UserIntent"},
         ],
         clusteringConfig={"frequencies": ["DAILY"]},
         evaluationExecutionRoleArn="arn:aws:iam::123456789012:role/AgentCoreEvaluationRole",
         enableOnCreate=True,
     )

     config_id = response["onlineEvaluationConfigId"]
     print(f"Created config: {config_id}")
     ```
This tells the service to:

  * Sample sessions at the configured rate (100% in this example — adjust `--sampling-rate` or `samplingPercentage` to analyze a subset of traffic).

  * Run failure analysis and user intent extraction on each sampled session.

  * Trigger a clustering report daily.


## Configuration parameters

Parameter | Type | Required | Description  
---|---|---|---  
`insights` |  List |  Required (mutually exclusive with `evaluators`) |  List of insight types to run. Each entry has an `insightId`. Maximum 10.  
`rule.samplingConfig.samplingPercentage` |  Number |  No (default: 100) |  Percentage of sessions to analyze (1—​100). Use a lower sampling rate for high-traffic agents to control costs while still surfacing failure patterns.  
`clusteringConfig` |  Object |  No |  Configures periodic batch evaluation jobs for clustering. Contains a `frequencies` list. Can only be used when `insights` is provided.  
`clusteringConfig.frequencies` |  List of strings |  Yes (within `clusteringConfig`) |  One or more of: `DAILY`, `WEEKLY`, `MONTHLY`. Maximum 3 values.  
  
###### Note

Insights and evaluators are mutually exclusive — you must provide one or the other, not both. If you want both quality scoring and failure triage for the same agent, create two separate configurations pointing at the same data source.

## Update a configuration

Modify the insights or clustering frequency:

```text
client_cp.update_online_evaluation_config(
    onlineEvaluationConfigId=config_id,
    insights=[
        {"insightId": "Builtin.Insight.FailureAnalysis"},
        {"insightId": "Builtin.Insight.UserIntent"},
    ],
    clusteringConfig={"frequencies": ["DAILY", "WEEKLY"]},
)
```
## View recurring report results

Recurring reports produce batch evaluation jobs automatically. Use `ListBatchEvaluations` to find completed reports, then `GetBatchEvaluation` to retrieve results:

```python
client = boto3.client("bedrock-agentcore", region_name="us-west-2")

# List recent batch evaluations
evaluations = client.list_batch_evaluations()

for eval_summary in evaluations.get("batchEvaluations", []):
    if eval_summary["status"] == "COMPLETED" and eval_summary.get("insights"):
        result = client.get_batch_evaluation(
            batchEvaluationId=eval_summary["batchEvaluationId"]
        )
        print(f"Report: {eval_summary['batchEvaluationName']}")
        if "failureAnalysisResult" in result:
            failures = result["failureAnalysisResult"]["failures"]
            print(f"  Found {len(failures)} failure categories")
```
## Manage the configuration

###### Example

AgentCore CLI
    

Pause:

```bash
agentcore pause online-insights my_agent_insights --json
```
Resume:

```bash
agentcore resume online-insights my_agent_insights --json
```
Remove:

```bash
agentcore remove online-insights --name my_agent_insights --yes --json
```
AWS SDK (boto3)
    

Pause or resume:

```bash
# Pause
client_cp.update_online_evaluation_config(
    onlineEvaluationConfigId=config_id,
    executionStatus="DISABLED",
)

# Resume
client_cp.update_online_evaluation_config(
    onlineEvaluationConfigId=config_id,
    executionStatus="ENABLED",
)
```
Delete:

```text
client_cp.delete_online_evaluation_config(
    onlineEvaluationConfigId=config_id,
)
```
###### Warning

Deleting a configuration does not delete past batch evaluation results. Historical insight results remain accessible through `GetBatchEvaluation`.

