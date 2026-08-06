# Prerequisites - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization-prereqs.html

---

# Prerequisites

Before using AgentCore optimization features, make sure the following are in place.

## Requirements and supported frameworks

Recommendations and A/B testing have the same agent requirements as AgentCore Evaluations:

  * An agent deployed on AgentCore Runtime with observability enabled, or an agent built with a supported framework configured with [AgentCore Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability.html>). Supported frameworks:

    * Strands Agents

    * LangGraph with `opentelemetry-instrumentation-langchain` or `openinference-instrumentation-langchain`

  * [Transaction Search](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Transaction-Search-getting-started.html>) enabled in CloudWatch.

  * Agent sessions with telemetry data in CloudWatch Logs. Invoke your agent and wait 2–5 minutes for CloudWatch to ingest the telemetry before starting a recommendation or A/B test.


## SDK and CLI requirements

  * **AgentCore CLI:** Install the latest version by running `agentcore update`.

  * **AWS SDK (boto3):** Python 3.10 or later. Install or upgrade with `pip install --upgrade boto3`.

  * **AgentCore SDK:** If using the `bedrock-agentcore-sdk-python`, version 1.8 or later is required.


## IAM permissions

The following IAM policy grants permissions for all three optimization features:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ConfigurationBundles",
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:CreateConfigurationBundle",
                "bedrock-agentcore:GetConfigurationBundle",
                "bedrock-agentcore:GetConfigurationBundleVersion",
                "bedrock-agentcore:ListConfigurationBundles",
                "bedrock-agentcore:ListConfigurationBundleVersions",
                "bedrock-agentcore:UpdateConfigurationBundle",
                "bedrock-agentcore:DeleteConfigurationBundle"
            ],
            "Resource": "arn:aws:bedrock-agentcore:*:*:configuration-bundle/*"
        },
        {
            "Sid": "Recommendations",
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:StartRecommendation",
                "bedrock-agentcore:GetRecommendation",
                "bedrock-agentcore:ListRecommendations",
                "bedrock-agentcore:DeleteRecommendation"
            ],
            "Resource": "arn:aws:bedrock-agentcore:*:*:recommendation/*"
        },
        {
            "Sid": "ABTesting",
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:CreateABTest",
                "bedrock-agentcore:GetABTest",
                "bedrock-agentcore:ListABTests",
                "bedrock-agentcore:UpdateABTest",
                "bedrock-agentcore:DeleteABTest"
            ],
            "Resource": "arn:aws:bedrock-agentcore:*:*:ab-test/*"
        },
        {
            "Sid": "CloudWatchLogs",
            "Effect": "Allow",
            "Action": [
                "logs:GetLogEvents",
                "logs:FilterLogEvents",
                "logs:StartQuery",
                "logs:GetQueryResults"
            ],
            "Resource": "arn:aws:logs:*:*:log-group:/aws/bedrock-agentcore/runtimes/*"
        }
    ]
}
```
