# Prerequisites - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-prerequisites.html

---

# Prerequisites

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

Before you use AWS Agent Registry, complete the following prerequisites.

## AWS account and credentials

You need an AWS account with credentials configured. To configure credentials, install and use the AWS Command Line Interface by following the steps at [Getting started with the AWS CLI](<https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html>).

```bash
# Verify installation
aws --version  # Should show version 2.
```
## Python and AWS SDK

To access your AWS credentials and configure them for use with SDKs, follow the steps at [Using IAM Identity Center to authenticate AWS SDK and Tools](<https://docs.aws.amazon.com/sdkref/latest/guide/access-sso.html>) . If you plan to use the AWS Python SDK (Boto3) to interact with AWS Agent Registry programmatically:

  1. Install **Python 3.10+**.

  2. Install the AWS SDK: `pip install boto3`

  3. Verify your credentials are configured: `aws sts get-caller-identity`


Please refer to [AWS Builder Tools](<https://builder.aws.com/build/tools>) for more information on how to setup and use AWS SDK.

## IAM permissions

Set up IAM permissions based on the persona that matches your role. The full list of IAM Permissions for Registry can be found in [IAM Permissions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-iam-permissions.html>).

### Administrator permissions

For administrators who manage the full lifecycle of registries, records, and approve/reject/deprecate records:

```json
{
"Version": "2012-10-17",
    "Statement":
    [
        {
            "Sid": "AllowCreatingAndListingRegistries",
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:CreateRegistry",
                "bedrock-agentcore:ListRegistries"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:*"
            ]
        },
        {
            "Sid": "AllowGetUpdateDeleteRegistry",
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:GetRegistry",
                "bedrock-agentcore:UpdateRegistry",
                "bedrock-agentcore:DeleteRegistry"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:registry/*"
            ]
        },
        {
            "Sid": "AllowCreatingAndListingRecords",
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:CreateRegistryRecord",
                "bedrock-agentcore:ListRegistryRecords"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:registry/*"
            ]
        },
        {
            "Sid": "AllowRecordLevelOperations",
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:GetRegistryRecord",
                "bedrock-agentcore:UpdateRegistryRecord",
                "bedrock-agentcore:DeleteRegistryRecord",
                "bedrock-agentcore:SubmitRegistryRecordForApproval"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:registry/*/record/*"
            ]
        },
        {
            "Sid": "AllowApproveRejectDeprecateRecords",
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:UpdateRegistryRecordStatus"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:registry/*/record/*"
            ]
        },
        {
            "Sid": "AdditionalPermissionForRegistryManagedWorkloadIdentity",
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:*WorkloadIdentity"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:workload-identity-directory/default/*"
            ]
        }
    ]
}
```
### Curator / Approver permissions

For curators who review and approve/reject records but don’t perform administrative operations:

```json
{
"Version": "2012-10-17",
    "Statement":
    [
        {
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:ListRegistries"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:*"
            ]
        },
        {
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:GetRegistry"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:registry/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:ListRegistryRecords"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:registry/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:GetRegistryRecord"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:registry/*/record/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:UpdateRegistryRecordStatus"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:registry/*/record/*"
            ]
        }
    ]
}
```
### Publisher permissions

For publishers who submit MCP servers, agents, or other resources to the registry:

```json
{
"Version": "2012-10-17",
    "Statement":
    [
        {
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:ListRegistries"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:*"
            ]
        },
        {
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:GetRegistry"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:registry/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:CreateRegistryRecord",
                "bedrock-agentcore:ListRegistryRecords"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:registry/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:GetRegistryRecord",
                "bedrock-agentcore:UpdateRegistryRecord",
                "bedrock-agentcore:DeleteRegistryRecord",
                "bedrock-agentcore:SubmitRegistryRecordForApproval"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:registry/*/record/*"
            ]
        },
        {
            "Sid": "AllowWorkloadIdentityForSynchronization",
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:GetWorkloadAccessToken"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:workload-identity-directory/*"
            ]
        },
        {
            "Sid": "AllowGetResourceOauth2TokenForOauthBasedSynchronization",
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:GetResourceOauth2Token"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:token-vault/*"
            ]
        },
        {
            "Sid": "AllowPassRoleForIamBasedSynchronization",
            "Effect": "Allow",
            "Action":
            [
                "iam:PassRole"
            ],
            "Resource":
            [
                "arn:aws:iam::<account>:role/<your-sync-role-name>"
            ],
            "Condition":
            {
                "StringEquals":
                {
                    "iam:PassedToService": "bedrock-agentcore.amazonaws.com"
                },
                "StringLike":
                {
                    "iam:AssociatedResourceARN": "arn:aws:bedrock-agentcore:<region>:<account>:registry/*/record/*"
                }
            }
        }
    ]
}
```
### Consumer permissions

For consumers who search for and use approved resources:

```json
{
"Version": "2012-10-17",
    "Statement":
    [
        {
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:ListRegistries"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:*"
            ]
        },
        {
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:GetRegistry"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:registry/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action":
            [
                "bedrock-agentcore:SearchRegistryRecords",
                "bedrock-agentcore:InvokeRegistryMcp"
            ],
            "Resource":
            [
                "arn:aws:bedrock-agentcore:*:<account>:registry/*"
            ]
        }
    ]
}
```
For example IAM policies, see [Identity and access management for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-iam.html>).

## (Optional) Identity provider for JWT authorization

If you plan to use JWT authorization for inbound identity (to enable consumers to search the registry using Non-IAM identities), set up Amazon Cognito or your own identity provider before creating the registry:

  1. **Create a Cognito User Pool** (or use your existing identity provider)

  2. **Register an App Client** and note the Client ID

  3. **Create a test user** with a username and password


For detailed instructions, see [Configure inbound JWT authorizer](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/inbound-jwt-authorizer.html>).

