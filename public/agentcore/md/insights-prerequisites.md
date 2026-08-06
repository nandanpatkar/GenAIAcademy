# Prerequisites - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/insights-prerequisites.html

---

# Prerequisites  
  
Before you begin using AgentCore insights, ensure you have the following:

###### Topics

  * Requirements

  * IAM permissions

  * Execution role


## Requirements

  * **AWS Account** with appropriate IAM permissions

  * **Amazon CloudWatch** access for reading agent session traces and viewing insight results

  * **Transaction Search** enabled in CloudWatch — see [AgentCore Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability.html>) for setup instructions

  * **AWS Distro for OpenTelemetry (ADOT) SDK** instrumenting your agent — your agent must emit traces to CloudWatch Logs

  * **An active agent** with at least one completed session producing traces in CloudWatch Logs


## IAM permissions

Your IAM user or role needs the following permissions to configure and run insights:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:CreateOnlineEvaluationConfig",
                "bedrock-agentcore:GetOnlineEvaluationConfig",
                "bedrock-agentcore:ListOnlineEvaluationConfigs",
                "bedrock-agentcore:UpdateOnlineEvaluationConfig",
                "bedrock-agentcore:DeleteOnlineEvaluationConfig",
                "bedrock-agentcore:StartBatchEvaluation",
                "bedrock-agentcore:GetBatchEvaluation",
                "bedrock-agentcore:ListBatchEvaluations"
            ],
            "Resource": "*"
        }
    ]
}
```
## Execution role

The online evaluation configuration requires an execution role (`evaluationExecutionRoleArn`) that allows the service to:

  * Read traces from CloudWatch Logs

  * Invoke Amazon Bedrock models for insight analysis

  * Store and retrieve insight results


If you have already configured an execution role for AgentCore Evaluations, the same role works for insights. See [Evaluations Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./evaluations-prerequisites.html>) for details on creating this role.

###### Note

If you plan to use insights findings to generate optimized configurations through [AgentCore optimization recommendations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization-recommendations.html>), you also need `bedrock-agentcore:StartRecommendation`, `bedrock-agentcore:GetRecommendation`, `bedrock-agentcore:ListRecommendations`, and `bedrock-agentcore:DeleteRecommendation` permissions. See [Optimization Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization-prereqs.html>) for details.

