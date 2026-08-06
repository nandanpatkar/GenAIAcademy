# IAM Permissions for AgentCore Runtime - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html

---

# IAM Permissions for AgentCore Runtime

The following are IAM permissions you need to create an agent in an AgentCore Runtime and the execution role permissions that an agent needs to run in an AgentCore Runtime. You can also use resource-based policies to control access to your runtime resources.

For information about using resource-based policies to control access to your AgentCore Runtime resources, see [Resource-based policies for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./resource-based-policies.html>).

###### Topics

  * Use Amazon Bedrock AgentCore

  * Use the AgentCore CLI

  * User permissions for Amazon Bedrock AgentCore Console

  * Execution role for running an agent in AgentCore Runtime


## Use Amazon Bedrock AgentCore

To use Amazon Bedrock AgentCore, you can attach the [BedrockAgentCoreFullAccess](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreFullAccess.html>) AWS managed policy to your IAM user or IAM role. This AWS managed policy grants broad permissions including `GetWorkloadAccessTokenForUserId`, which allows issuing workload access tokens using caller-supplied user identifier strings without IdP token verification. We recommend creating a custom policy with only the permissions your application requires by copying the relevant statements and restricting the resources to your specific use case. For production deployments where your application has JWT tokens available, explicitly deny `GetWorkloadAccessTokenForUserId` and grant only `GetWorkloadAccessTokenForJWT`. For more information, see [Get workload access token](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./get-workload-access-token.html>). To use the AgentCore CLI, you need additional permissions.

## Use the AgentCore CLI

To use the AgentCore CLI, attach the following IAM policy to your IAM user or role. To change IAM permissions, see [Change permissions for an IAM user](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html>).

###### Important

The IAM policies created by the AgentCore CLI are designed for development and testing purposes. These permissions grant broad access to facilitate rapid prototyping and are not suitable for production environments. For production deployments, create custom IAM policies that follow the principle of least privilege and restrict permissions to only the specific resources and actions required by your Amazon Bedrock AgentCore application. For complete IAM security guidance, see [Security best practices for AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-security-best-practices.html>).

```json
{
"Version":"2012-10-17",
    "Statement": [
        {
            "Sid": "IAMRoleManagement",
            "Effect": "Allow",
            "Action": [
                "iam:CreateRole",
                "iam:DeleteRole",
                "iam:GetRole",
                "iam:PutRolePolicy",
                "iam:DeleteRolePolicy",
                "iam:AttachRolePolicy",
                "iam:DetachRolePolicy",
                "iam:TagRole",
                "iam:ListRolePolicies",
                "iam:ListAttachedRolePolicies"
            ],
            "Resource": [
                "arn:aws:iam::*:role/*BedrockAgentCore*",
                "arn:aws:iam::*:role/service-role/*BedrockAgentCore*"
            ]
        },
        {
            "Sid": "CodeBuildProjectAccess",
            "Effect": "Allow",
            "Action": [
                "codebuild:StartBuild",
                "codebuild:BatchGetBuilds",
                "codebuild:ListBuildsForProject",
                "codebuild:CreateProject",
                "codebuild:UpdateProject",
                "codebuild:BatchGetProjects"
            ],
            "Resource": [
                "arn:aws:codebuild:*:*:project/bedrock-agentcore-*",
                "arn:aws:codebuild:*:*:build/bedrock-agentcore-*"
            ]
        },
        {
            "Sid": "CodeBuildListAccess",
            "Effect": "Allow",
            "Action": [
                "codebuild:ListProjects"
            ],
            "Resource": "*"
        },
        {
            "Sid": "IAMPassRoleAccess",
            "Effect": "Allow",
            "Action": [
                "iam:PassRole"
            ],
            "Resource": [
                "arn:aws:iam::*:role/AmazonBedrockAgentCore*",
                "arn:aws:iam::*:role/service-role/AmazonBedrockAgentCore*"
            ]
        },
        {
            "Sid": "CloudWatchLogsAccess",
            "Effect": "Allow",
            "Action": [
                "logs:GetLogEvents",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams"
            ],
            "Resource": [
                "arn:aws:logs:*:*:log-group:/aws/bedrock-agentcore/*",
                "arn:aws:logs:*:*:log-group:/aws/codebuild/*"
            ]
        },
        {
            "Sid": "S3Access",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:ListBucket",
                "s3:CreateBucket",
                "s3:PutLifecycleConfiguration"
            ],
            "Resource": [
                "arn:aws:s3:::bedrock-agentcore-*",
                "arn:aws:s3:::bedrock-agentcore-*/*"
            ]
        },
        {
            "Sid": "ECRRepositoryAccess",
            "Effect": "Allow",
            "Action": [
                "ecr:CreateRepository",
                "ecr:DescribeRepositories",
                "ecr:GetRepositoryPolicy",
                "ecr:InitiateLayerUpload",
                "ecr:CompleteLayerUpload",
                "ecr:PutImage",
                "ecr:UploadLayerPart",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:ListImages",
                "ecr:TagResource"
            ],
            "Resource": [
                "arn:aws:ecr:*:*:repository/bedrock-agentcore-*"
            ]
        },
        {
            "Sid": "ECRAuthorizationAccess",
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken"
            ],
            "Resource": "*"
        }
    ]
}
```
## User permissions for Amazon Bedrock AgentCore Console

Attach the [BedrockAgentCoreFullAccess](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreFullAccess.html>) policy to the console role. Additionally, add the following permissions for IAM if you want service console to auto-create the execution role.

```json
{
"Version": "2012-10-17",
  "Statement": [{
    "Sid": "IAMRoleAccess",
    "Effect": "Allow",
    "Action": ["iam:CreateRole"],
    "Resource": ["arn:aws:iam::*:role/service-role/AmazonBedrockAgentCoreRuntimeDefaultServiceRole-*"]
  }, {
    "Sid": "IAMPolicyAccess",
    "Effect": "Allow",
    "Action": ["iam:CreatePolicy"],
    "Resource": ["arn:aws:iam::*:policy/service-role/AmazonBedrockAgentCoreRuntimeExecutionPolicy_*"]
  }, {
    "Sid": "IAMRolePolicyAccess",
    "Effect": "Allow",
    "Action": ["iam:AttachRolePolicy"],
    "Resource": ["arn:aws:iam::*:role/service-role/AmazonBedrockAgentCoreRuntimeDefaultServiceRole-*"],
    "Condition": {
      "ArnLike": {
        "iam:PolicyARN": "arn:aws:iam::*:policy/service-role/AmazonBedrockAgentCoreRuntimeExecutionPolicy_*"
      }
    }
  }]
}
```
## Execution role for running an agent in AgentCore Runtime

To run agent or tool in AgentCore Runtime you need an AWS Identity and Access Management execution role. For information about creating an IAM role, see [IAM role creation](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create.html>).

The Amazon Bedrock AgentCore direct deploy execution role is an IAM role that Amazon Bedrock AgentCore assumes to run an agent. Replace the following:

  * `us-east-1` with the AWS Region that you are using

  * `123456789012` with your AWS account ID

  * `agentName` with the name of your agent. You’ll need to decide the agent name before creating the role and AgentCore Runtime.


```json
{
"Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "logs:DescribeLogStreams",
      "logs:CreateLogGroup"
    ],
    "Resource": [
      "arn:aws:logs:us-east-1:123456789012:log-group:/aws/bedrock-agentcore/runtimes/*"
    ]
  }, {
    "Effect": "Allow",
    "Action": [
      "logs:PutResourcePolicy"
    ],
    "Resource": [
      "arn:aws:logs:us-east-1:123456789012:log-group:/aws/bedrock-agentcore/runtimes/agentName-*"
    ]
  }, {
    "Effect": "Allow",
    "Action": ["logs:DescribeLogGroups"],
    "Resource": ["arn:aws:logs:us-east-1:123456789012:log-group:*"]
  }, {
    "Effect": "Allow",
    "Action": [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ],
    "Resource": [
      "arn:aws:logs:us-east-1:123456789012:log-group:/aws/bedrock-agentcore/runtimes/*:log-stream:*"
    ]
  }, {
    "Effect": "Allow",
    "Action": [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
      "xray:GetSamplingRules",
      "xray:GetSamplingTargets"
    ],
    "Resource": ["*"]
  }, {
    "Effect": "Allow",
    "Resource": "*",
    "Action": "cloudwatch:PutMetricData",
    "Condition": {
      "StringEquals": {
        "cloudwatch:namespace": "bedrock-agentcore"
      }
    }
  }, {
    "Sid": "BedrockModelInvocation",
    "Effect": "Allow",
    "Action": [
      "bedrock:InvokeModel",
      "bedrock:InvokeModelWithResponseStream"
    ],
    "Resource": [
      "arn:aws:bedrock:*::foundation-model/*",
      "arn:aws:bedrock:us-east-1:123456789012:*"
    ]
  }]
}
```
The AgentCore Runtime execution role is an IAM role that AgentCore Runtime assumes to run an agent. Replace the following:

  * `us-east-1` with the AWS Region that you are using

  * `123456789012` with your AWS account ID

  * `agentName` with the name of your agent. You’ll need to decide the agent name before creating the role and AgentCore Runtime.


```json
{
"Version":"2012-10-17",
    "Statement": [
        {
            "Sid": "ECRImageAccess",
            "Effect": "Allow",
            "Action": [
                "ecr:BatchGetImage",
                "ecr:GetDownloadUrlForLayer"
            ],
            "Resource": [
                "arn:aws:ecr:us-east-1:123456789012:repository/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:DescribeLogStreams",
                "logs:CreateLogGroup"
            ],
            "Resource": [
                "arn:aws:logs:us-east-1:123456789012:log-group:/aws/bedrock-agentcore/runtimes/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:PutResourcePolicy"
            ],
            "Resource": [
                "arn:aws:logs:us-east-1:123456789012:log-group:/aws/bedrock-agentcore/runtimes/agentName-*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:DescribeLogGroups"
            ],
            "Resource": [
                "arn:aws:logs:us-east-1:123456789012:log-group:*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:us-east-1:123456789012:log-group:/aws/bedrock-agentcore/runtimes/*:log-stream:*"
            ]
        },
        {
            "Sid": "ECRTokenAccess",
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken"
            ],
            "Resource": "*"
        },
        {
        "Effect": "Allow",
        "Action": [
            "xray:PutTraceSegments",
            "xray:PutTelemetryRecords",
            "xray:GetSamplingRules",
            "xray:GetSamplingTargets"
            ],
         "Resource": [ "*" ]
         },
         {
            "Effect": "Allow",
            "Resource": "*",
            "Action": "cloudwatch:PutMetricData",
            "Condition": {
                "StringEquals": {
                    "cloudwatch:namespace": "bedrock-agentcore"
                }
            }
        },
        {
            "Sid": "GetAgentAccessToken",
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:GetWorkloadAccessToken",
                "bedrock-agentcore:GetWorkloadAccessTokenForJWT",
                "bedrock-agentcore:GetWorkloadAccessTokenForUserId"
            ],
            "Resource": [
              "arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default",
              "arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/agentName-*"
            ]
        },
         {"Sid": "BedrockModelInvocation",
         "Effect": "Allow",
         "Action": [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream"
              ],
        "Resource": [
            "arn:aws:bedrock:*::foundation-model/*",
            "arn:aws:bedrock:us-east-1:123456789012:*"
        ]
        }
    ]
}
```
### AgentCore Runtime trust policy

The AgentCore Runtime execution role must include the following trust policy which allows the AgentCore Runtime to assume the role.

In the policy, replace:

  * `us-east-1` with the AWS Region that you are using

  * `123456789012` with your AWS account ID


To add the trust policy to the AgentCore Runtime execution role, go to the AWS Management Console, navigate to the role, choose the **Trust relationships** tab, and choose **Edit trust policy**.

```json
{
"Version":"2012-10-17",
  "Statement": [
    {
      "Sid": "AssumeRolePolicy",
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock-agentcore.amazonaws.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
            "StringEquals": {
                "aws:SourceAccount": "123456789012"
            },
            "ArnLike": {
                "aws:SourceArn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:*"
            }
       }
    }
  ]
}
```
