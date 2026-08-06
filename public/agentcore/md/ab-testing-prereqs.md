# A/B testing prerequisites - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ab-testing-prereqs.html

---

# A/B testing prerequisites

Before you create an A/B test, ensure the following resources are in place.

## Required resources

Resource | Description  
---|---  
AgentCore Gateway |  An active AgentCore Gateway with at least one HTTP target pointing to your agent runtime. The AgentCore Gateway handles traffic splitting between variants.  
Agent runtime |  At least one deployed agent runtime using the Amazon Bedrock AgentCore SDK (version 1.8+). The SDK’s `BaggageSpanProcessor` automatically attaches A/B test experiment details (experiment ARN and variant name) to all OpenTelemetry spans emitted by the runtime.

  * **Configuration bundle based variants:** One runtime is sufficient. Both variants run on the same runtime with different configuration bundle versions.
  * **Target-based variants:** Deploy one runtime per variant (two total).

  
Online evaluation configuration |  An active online evaluation config that specifies which evaluators to run against sessions.

  * **Configuration bundle based variants:** One online evaluation config that points to the single runtime where both variants run.
  * **Target-based variants:** One online evaluation config per runtime endpoint that you are using for your A/B test (two total), since each endpoint has its own log group.

  
Configuration bundles (optional) |  Required when using configuration bundle based variants. Two bundle versions or two separate bundles: one for control and one for treatment.  
  
## SDK requirements

The Amazon Bedrock AgentCore SDK version 1.8 or later is required. The SDK includes a `BaggageSpanProcessor` that reads experiment baggage headers propagated by the AgentCore Gateway and automatically stamps all runtime OpenTelemetry spans with the experiment ARN and variant name. The online evaluation pipeline reads these attributes to map session scores to the correct variant. No additional instrumentation is required in your agent code.

## Evaluator requirements

###### Note

A/B testing supports built-in, custom LLM-as-judge, and code-based evaluators, but requires each evaluator to return a numerical value for statistical significance computation. For custom LLM-as-judge evaluators, configure the `ratingScale` with a `numerical` scale (not `categorical`). For code-based evaluators, include the `value` field in the [response schema](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-based-evaluators.html#code-based-response-schema>).

## IAM permissions

The A/B test execution role must trust the `bedrock-agentcore.amazonaws.com` service principal and have permissions for AgentCore Gateway operations, configuration bundle reads, online evaluation config reads, and CloudWatch Logs access.

###### Note

You only need to create this role manually if you bring your own execution role and pass it with `agentcore run ab-test --role-arn <arn>`. If you omit `--role-arn`, the AgentCore CLI auto-creates an execution role for the test.

Example trust policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "bedrock-agentcore.amazonaws.com"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "StringEquals": {
                    "aws:SourceAccount": "${aws:PrincipalAccount}"
                },
                "ArnLike": {
                    "aws:SourceArn": "arn:aws:bedrock-agentcore:*:${aws:PrincipalAccount}:ab-test/*"
                }
            }
        }
    ]
}
```
Example permissions policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AgentCoreResources",
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:GetGateway",
                "bedrock-agentcore:GetGatewayTarget",
                "bedrock-agentcore:ListGatewayTargets",
                "bedrock-agentcore:CreateGatewayRule",
                "bedrock-agentcore:UpdateGatewayRule",
                "bedrock-agentcore:GetGatewayRule",
                "bedrock-agentcore:DeleteGatewayRule",
                "bedrock-agentcore:ListGatewayRules",
                "bedrock-agentcore:GetOnlineEvaluationConfig",
                "bedrock-agentcore:GetEvaluator",
                "bedrock-agentcore:GetConfigurationBundle",
                "bedrock-agentcore:GetConfigurationBundleVersion",
                "bedrock-agentcore:ListConfigurationBundleVersions"
            ],
            "Resource": "arn:aws:bedrock-agentcore:*:${aws:PrincipalAccount}:*",
            "Condition": {
                "StringEquals": {
                    "aws:ResourceAccount": "${aws:PrincipalAccount}"
                }
            }
        },
        {
            "Sid": "CloudWatchLogsDescribe",
            "Effect": "Allow",
            "Action": [
                "logs:DescribeLogGroups"
            ],
            "Resource": "*"
        },
        {
            "Sid": "CloudWatchLogs",
            "Effect": "Allow",
            "Action": [
                "logs:DescribeIndexPolicies",
                "logs:PutIndexPolicy",
                "logs:StartQuery",
                "logs:GetQueryResults",
                "logs:StopQuery",
                "logs:FilterLogEvents",
                "logs:GetLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:*:${aws:PrincipalAccount}:log-group:/aws/bedrock-agentcore/evaluations/*",
                "arn:aws:logs:*:${aws:PrincipalAccount}:log-group:aws/spans",
                "arn:aws:logs:*:${aws:PrincipalAccount}:log-group:aws/spans:*"
            ]
        }
    ]
}
```
