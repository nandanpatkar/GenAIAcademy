# Troubleshooting Amazon Bedrock AgentCore identity and access - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security_iam_troubleshoot.html

---

# Troubleshooting Amazon Bedrock AgentCore identity and access

Use the following information to help you diagnose and fix common issues that you might encounter when working with AgentCore and IAM.

###### Topics

  * I am not authorized to perform an action in AgentCore

  * I am not authorized to perform iam:PassRole

  * I am not authorized to perform iam:CreateRole in the console

  * I want to allow people outside of my AWS account to access my AgentCore resources


## I am not authorized to perform an action in AgentCore

If you receive an error that you’re not authorized to perform an action, your policies must be updated to allow you to perform the action.

The following example error occurs when the `mateojackson` IAM user tries to use the console to view details about a fictional `my-example-widget` resource but doesn’t have the fictional `bedrock-agentcore:GetWidget` permissions.

```yaml
User: arn:aws:iam::123456789012:user/mateojackson is not authorized to perform: bedrock-agentcore:GetWidget on resource: my-example-widget
```
In this case, the policy for the `mateojackson` user must be updated to allow access to the `my-example-widget` resource by using the `bedrock-agentcore:GetWidget` action.

If you need help, contact your AWS administrator. Your administrator is the person who provided you with your sign-in credentials.

## I am not authorized to perform iam:PassRole

If you receive an error that you’re not authorized to perform the `iam:PassRole` action, your policies must be updated to allow you to pass a role to AgentCore.

Some AWS services allow you to pass an existing role to that service instead of creating a new service role or service-linked role. To do this, you must have permissions to pass the role to the service.

The following example error occurs when an IAM user named `marymajor` tries to use the console to perform an action in AgentCore. However, the action requires the service to have permissions that are granted by a service role. Mary does not have permissions to pass the role to the service.

```yaml
User: arn:aws:iam::123456789012:user/marymajor is not authorized to perform: iam:PassRole
```
In this case, Mary’s policies must be updated to allow her to perform the `iam:PassRole` action.

If you need help, contact your AWS administrator. Your administrator is the person who provided you with your sign-in credentials.

## I am not authorized to perform iam:CreateRole in the console

If you receive an error that you’re not authorized to perform the `iam:CreateRole` action when creating an AgentCore resource in the AWS Management Console, you need to add additional permissions to your IAM user or role.

The following example error occurs when you create a harness and the console attempts to auto-create the execution role on your behalf:

```yaml
User: arn:aws:iam::123456789012:assumed-role/MyConsoleRole/user is not authorized to perform: iam:CreateRole on resource: arn:aws:iam::123456789012:role/service-role/AmazonBedrockAgentCoreHarnessDefaultServiceRole-abc12 because no identity-based policy allows the iam:CreateRole action
```
To resolve this issue, do one of the following:

  * **Add an inline policy:** Add a policy to your IAM user or role that grants the necessary permissions for the console to create execution roles on your behalf:

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iam:CreateRole",
      "Resource": "arn:aws:iam::123456789012:role/service-role/AmazonBedrockAgentCore*"
    },
    {
      "Effect": "Allow",
      "Action": "iam:CreatePolicy",
      "Resource": "arn:aws:iam::123456789012:policy/service-role/AmazonBedrockAgentCore*"
    },
    {
      "Effect": "Allow",
      "Action": "iam:AttachRolePolicy",
      "Resource": "arn:aws:iam::123456789012:role/service-role/AmazonBedrockAgentCore*",
      "Condition": {
        "ArnLike": {
          "iam:PolicyARN": "arn:aws:iam::123456789012:policy/service-role/AmazonBedrockAgentCore*"
        }
      }
    }
  ]
}
```
  * **Create the execution role manually:** Create the role before creating the resource in the console, and then select the existing role instead of allowing the console to auto-create one. For the required trust policy and permissions, see [Execution role for running an agent in AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-permissions.html#runtime-permissions-execution>).


## I want to allow people outside of my AWS account to access my AgentCore resources

You can create a role that users in other accounts or people outside of your organization can use to access your resources. You can specify who is trusted to assume the role. For services that support resource-based policies or access control lists (ACLs), you can use those policies to grant people access to your resources.

To learn more, consult the following:

  * To learn whether AgentCore supports these features, see [How Amazon Bedrock AgentCore works with IAM](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security_iam_service-with-iam.html>).

  * To learn how to provide access to your resources across AWS accounts that you own, see [Providing access to an IAM user in another AWS account that you own](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_aws-accounts.html>) in the _IAM User Guide_.

  * To learn how to provide access to your resources to third-party AWS accounts, see [Providing access to AWS accounts owned by third parties](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html>) in the _IAM User Guide_.

  * To learn how to provide access through identity federation, see [Providing access to externally authenticated users (identity federation)](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_federated-users.html>) in the _IAM User Guide_.

  * To learn the difference between using roles and resource-based policies for cross-account access, see [Cross account resource access in IAM](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-cross-account-resource-access.html>) in the _IAM User Guide_.



