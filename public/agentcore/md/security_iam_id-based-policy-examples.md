# Identity-based policy examples for Amazon Bedrock AgentCore - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security_iam_id-based-policy-examples.html

---

# Identity-based policy examples for Amazon Bedrock AgentCore

By default, users and roles don’t have permission to create or modify AgentCore resources. To grant users permission to perform actions on the resources that they need, an IAM administrator can create IAM policies.

To learn how to create an IAM identity-based policy by using these example JSON policy documents, see [Create IAM policies (console)](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html>) in the _IAM User Guide_.

For details about actions and resource types defined by AgentCore, including the format of the ARNs for each of the resource types, see [Actions, Resources, and Condition Keys for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazonbedrockagentcore.html>) in the _Service Authorization Reference_.

###### Topics

  * Policy best practices

  * Using the AgentCore console

  * Allow users to view their own permissions


## Policy best practices

Identity-based policies determine whether someone can create, access, or delete AgentCore resources in your account. These actions can incur costs for your AWS account. When you create or edit identity-based policies, follow these guidelines and recommendations:

  * **Get started with AWS managed policies and move toward least-privilege permissions** – To get started granting permissions to your users and workloads, use the _AWS managed policies_ that grant permissions for many common use cases. They are available in your AWS account. We recommend that you reduce permissions further by defining AWS customer managed policies that are specific to your use cases. For more information, see [AWS managed policies](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html#aws-managed-policies>) or [AWS managed policies for job functions](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html>) in the _IAM User Guide_.

  * **Apply least-privilege permissions** – When you set permissions with IAM policies, grant only the permissions required to perform a task. You do this by defining the actions that can be taken on specific resources under specific conditions, also known as _least-privilege permissions_ . For more information about using IAM to apply permissions, see [Policies and permissions in IAM](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html>) in the _IAM User Guide_.

  * **Use conditions in IAM policies to further restrict access** – You can add a condition to your policies to limit access to actions and resources. For example, you can write a policy condition to specify that all requests must be sent using SSL. You can also use conditions to grant access to service actions if they are used through a specific AWS service, such as CloudFormation. For more information, see [IAM JSON policy elements: Condition](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html>) in the _IAM User Guide_.

  * **Use IAM Access Analyzer to validate your IAM policies to ensure secure and functional permissions** – IAM Access Analyzer validates new and existing policies so that the policies adhere to the IAM policy language (JSON) and IAM best practices. IAM Access Analyzer provides more than 100 policy checks and actionable recommendations to help you author secure and functional policies. For more information, see [Validate policies with IAM Access Analyzer](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-validation.html>) in the _IAM User Guide_.

  * **Require multi-factor authentication (MFA)** – If you have a scenario that requires IAM users or a root user in your AWS account, turn on MFA for additional security. To require MFA when API operations are called, add MFA conditions to your policies. For more information, see [Secure API access with MFA](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html>) in the _IAM User Guide_.


For more information about best practices in IAM, see [Security best practices in IAM](<https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html>) in the _IAM User Guide_.

## Using the AgentCore console

To access the Amazon Bedrock AgentCore console, you must have a minimum set of permissions. These permissions must allow you to list and view details about the AgentCore resources in your AWS account. If you create an identity-based policy that is more restrictive than the minimum required permissions, the console won’t function as intended for entities (users or roles) with that policy.

You don’t need to allow minimum console permissions for users that are making calls only to the AWS CLI or the AWS API. Instead, allow access to only the actions that match the API operation that they’re trying to perform.

To ensure that users and roles can still use the AgentCore console, also attach the AgentCore `ConsoleAccess` or `ReadOnly` AWS managed policy to the entities. For more information, see [Adding permissions to a user](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_change-permissions.html#users_change_permissions-add-console>) in the _IAM User Guide_.

## Allow users to view their own permissions

This example shows how you might create a policy that allows IAM users to view the inline and managed policies that are attached to their user identity. This policy includes permissions to complete this action on the console or programmatically using the AWS CLI or AWS API.

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ViewOwnUserInfo",
            "Effect": "Allow",
            "Action": [
                "iam:GetUserPolicy",
                "iam:ListGroupsForUser",
                "iam:ListAttachedUserPolicies",
                "iam:ListUserPolicies",
                "iam:GetUser"
            ],
            "Resource": ["arn:aws:iam::*:user/${aws:username}"]
        },
        {
            "Sid": "NavigateInConsole",
            "Effect": "Allow",
            "Action": [
                "iam:GetGroupPolicy",
                "iam:GetPolicyVersion",
                "iam:GetPolicy",
                "iam:ListAttachedGroupPolicies",
                "iam:ListGroupPolicies",
                "iam:ListPolicyVersions",
                "iam:ListPolicies",
                "iam:ListUsers"
            ],
            "Resource": "*"
        }
    ]
}
```
