# IAM permissions for on-demand evaluation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/iam-permissions-on-demand.html

---

# IAM permissions for on-demand evaluation

Your IAM user or role needs the following permissions to run on-demand evaluations:

## Console and API operations

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:Evaluate"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:Converse",
                "bedrock:InvokeModelWithResponseStream",
                "bedrock:ConverseStream"
            ],
            "Resource": [
                "arn:aws:bedrock:*::foundation-model/*",
                "arn:aws:bedrock:*:*:inference-profile/*"
            ]
        },
        {
            "Sid": "LambdaInvokeForCodeBasedEvaluators",
            "Effect": "Allow",
            "Action": [
                "lambda:InvokeFunction",
                "lambda:GetFunction"
            ],
            "Resource": "arn:aws:lambda:*:*:function:*"
        }
    ]
}
```
###### Note

The Lambda permissions are only required if you use [Custom code-based evaluator](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-based-evaluators.html>) . You can scope the Lambda resource ARN to specific functions as needed.

