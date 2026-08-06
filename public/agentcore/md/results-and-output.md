# Results and output - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/results-and-output.html

---

# Results and output

Online evaluation results are automatically saved to Amazon CloudWatch. When you create an online evaluation configuration, the service creates a dedicated CloudWatch log group to store your evaluation results in JSON format.

###### Topics

  * Log group structure

  * Result format

  * Viewing results in CloudWatch Observability Console

  * Viewing evaluation scores in CloudWatch Metrics


## Log group structure

Evaluation results are stored in a CloudWatch log group with the format `/aws/bedrock-agentcore/evaluations/results/<online-evaluation-config-id>` . The log group can be viewed on evaluation configuration **details page** in Amazon Bedrock AgentCore console.

Each evaluation generates a separate log entry within this log group. Additionally, evaluation scores are emitted as CloudWatch metrics for monitoring and analysis.

## Result format

Evaluations results follow OpenTelemetry semantic conventions for GenAI evaluation result events. The events are parented to the original span ID when possible and contain references the original trace ID and session ID.

You can use CloudWatch Logs Insights to query and analyze your evaluation results, and CloudWatch Metrics to monitor evaluation trends over time.

## Viewing results in CloudWatch Observability Console

You can view and analyze your evaluation results using the CloudWatch Observability Console. The console provides visualizations, metrics, and detailed logs of your agent evaluations.

**To view evaluation results**

  1. Open the CloudWatch console at [https://console.aws.amazon.com/cloudwatch/](<https://console.aws.amazon.com/cloudwatch/>)

  2. In the navigation pane, choose **GenAI Observability** > **Bedrock AgentCore**

  3. Under the **Agents** section, select the agent and endpoint associated with your evaluation configuration

  4. Navigate to the **Evaluations** tab for detailed results


For more details, see [AWS CloudWatch session trace evaluations documentation](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/session-traces-evaluations.html>).

## Viewing evaluation scores in CloudWatch Metrics

Evaluation scores are published as CloudWatch metrics. You can view them directly in the CloudWatch Metrics console.

**To view evaluation scores**

  1. Open the CloudWatch console at [https://console.aws.amazon.com/cloudwatch/](<https://console.aws.amazon.com/cloudwatch/>)

  2. In the navigation pane, choose **Metrics** > **All Metrics**

  3. In the **Browse** tab, select **Bedrock-AgentCore/Evaluations**

  4. Select dimension combinations to optionally narrow down results by evaluator type or evaluation label


For more details, see [AWS CloudWatch session trace evaluations documentation](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/session-traces-evaluations.html>).

