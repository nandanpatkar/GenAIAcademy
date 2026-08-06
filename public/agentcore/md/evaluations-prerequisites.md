# Prerequisites - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations-prerequisites.html

---

# Prerequisites

Before you begin using Amazon Bedrock AgentCore Evaluations, ensure you have the necessary AWS permissions and service roles configured.

###### Topics

  * Required permissions

  * IAM user permissions

  * Service execution role


## Required permissions

To use AgentCore Evaluations online evaluation features, you need:

  * **AWS Account** with appropriate IAM permissions

  * **Amazon Bedrock** access with model invocation permissions (required when using a custom evaluator)

  * **Amazon CloudWatch** access for viewing evaluation results

  * **Transaction Search** enabled in CloudWatch - see Enable Transaction Search

  * **AWS Distro for OpenTelemetry (ADOT) SDK** instrumenting your agent. Use AgentCore Observability instructions to configure observability for agents hosted on AgentCore Runtime and agents hosted elsewhere.


## IAM user permissions

Your IAM user or role needs the following permissions to create and manage evaluations:

###### Topics

  * Console and API operations


### Console and API operations

To use Amazon Bedrock AgentCore, you can attach the [BedrockAgentCoreFullAccess](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreFullAccess.html>) AWS managed policy to your IAM user or IAM role. This policy grants broad permissions for all AgentCore capabilities. If you only use AgentCore Evaluations, we recommend creating a custom IAM policy that includes only the permissions required for evaluation.

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:CreateEvaluator",
                "bedrock-agentcore:GetEvaluator",
                "bedrock-agentcore:ListEvaluators",
                "bedrock-agentcore:UpdateEvaluator",
                "bedrock-agentcore:DeleteEvaluator",
                "bedrock-agentcore:CreateOnlineEvaluationConfig",
                "bedrock-agentcore:GetOnlineEvaluationConfig",
                "bedrock-agentcore:ListOnlineEvaluationConfigs",
                "bedrock-agentcore:UpdateOnlineEvaluationConfig",
                "bedrock-agentcore:DeleteOnlineEvaluationConfig",
                "bedrock-agentcore:Evaluate"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:PassRole"
            ],
            "Resource": "arn:aws:iam::*:role/AgentCoreEvaluationRole*",
            "Condition": {
                "StringEquals": {
                    "iam:PassedToService": "bedrock-agentcore.amazonaws.com"
                }
            }
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
            "Effect": "Allow",
            "Action": [
                "logs:DescribeIndexPolicies",
                "logs:PutIndexPolicy",
                "logs:CreateLogGroup"
            ],
            "Resource": "*"
        },
        {
            "Sid": "KMSPermissionsForCMKEvaluators",
            "Effect": "Allow",
            "Action": [
                "kms:DescribeKey",
                "kms:GenerateDataKey",
                "kms:Decrypt"
            ],
            "Resource": "arn:aws:kms:*:*:key/*"
        }
    ]
}
```
###### Note

The `KMSPermissionsForCMKEvaluators` statement is only required if you use customer managed KMS keys to encrypt custom evaluators. For more information, see [Encryption at rest for AgentCore Evaluations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./evaluations-encryption.html>).

## Service execution role

Amazon Bedrock AgentCore Evaluations requires a custom IAM role to access AWS resources on your behalf. This role allows the service to:

  * Invoke Amazon Bedrock models for evaluation (required when using a custom evaluator)

  * Read traces from Amazon CloudWatch

  * Write evaluation results to Amazon CloudWatch

  * Configure log indexing for trace analysis


To create the IAM role you can use the AgentCore Evaluations console, the AWS console, or the AgentCore CLI.

###### Topics

  * Option 1: Using AgentCore Evaluations Console

  * Option 2: Using the AgentCore CLI

  * Option 3: Using the AWS Console


### Option 1: Using AgentCore Evaluations Console

You can create the required IAM role directly through the AgentCore Evaluations console, which provides a streamlined approach with automatic role creation.

**To create an IAM role using the AgentCore Evaluations console**

  1. Open the Amazon Bedrock AgentCore console.

  2. In the left navigation pane, choose **Evaluation**.

  3. Choose **Create evaluation configuration**.

  4. In the Permission section, select **Create and use a new service role** and the console will automatically create the IAM role for you.


### Option 2: Using the AgentCore CLI

The AgentCore CLI automatically creates the required IAM role when you deploy your project.

### Option 3: Using the AWS Console

You can manually create the IAM role using the AWS console, which gives you full control over the role configuration and policies.

**To create an IAM role using the AWS console**

  1. Open the IAM Console

  2. Navigate to Roles and choose **Create role**

  3. Select **AWS service** as the trusted entity type

  4. Create an IAM role with the following trust policy to allow Amazon Bedrock AgentCore to assume the role:

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "TrustPolicyStatement",
            "Effect": "Allow",
            "Principal": {
                "Service": "bedrock-agentcore.amazonaws.com"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "StringEquals": {
                    "aws:SourceAccount": "{{accountId}}",
                    "aws:ResourceAccount": "{{accountId}}"
                },
                "ArnLike": {
                    "aws:SourceArn": [
                        "arn:aws:bedrock-agentcore:{{region}}:{{accountId}}:evaluator/*",
                        "arn:aws:bedrock-agentcore:{{region}}:{{accountId}}:online-evaluation-config/*"
                    ]
                }
            }
        }
    ]
}
```
  5. Attach the following permissions policy to the execution role:

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CloudWatchLogReadStatement",
            "Effect": "Allow",
            "Action": [
                "logs:DescribeLogGroups",
                "logs:GetQueryResults",
                "logs:StartQuery"
            ],
            "Resource": "*"
        },
        {
            "Sid": "CloudWatchLogWriteStatement",
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:{{region}}:{{accountId}}:log-group:/aws/bedrock-agentcore/evaluations/*"
        },
        {
            "Sid": "CloudWatchIndexPolicyStatement",
            "Effect": "Allow",
            "Action": [
                "logs:DescribeIndexPolicies",
                "logs:PutIndexPolicy"
            ],
            "Resource": [
                "arn:aws:logs:{{region}}:{{accountId}}:log-group:aws/spans",
                "arn:aws:logs:{{region}}:{{accountId}}:log-group:aws/spans:*"
            ]
        },
        {
            "Sid": "BedrockInvokeStatement",
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream"
            ],
            "Resource": [
                "arn:aws:bedrock:{{region}}::foundation-model/*",
                "arn:aws:bedrock:{{region}}:{{accountId}}:inference-profile/*"
            ]
        }
    ]
}
```
###### Note

Replace { { region}} and { { accountId}} with your actual AWS region and account ID. If you are using a custom evaluator and have specified a BedrockInvokeStatement, you can also scope the allowed model IDs.

  6. Name your role (e.g., AgentCoreEvaluationRole)

  7. Review and create the role



