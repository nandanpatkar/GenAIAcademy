# Identity and access management for Amazon Bedrock AgentCore - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-iam.html

---

# Identity and access management for Amazon Bedrock AgentCore  
  
AWS Identity and Access Management (IAM) is an AWS service that helps an administrator securely control access to AWS resources. IAM administrators control who can be _authenticated_ (signed in) and _authorized_ (have permissions) to use AgentCore resources. IAM is an AWS service that you can use with no additional charge.

###### Topics

  * Audience

  * Authenticating with identities

  * Managing access using policies

  * [How Amazon Bedrock AgentCore works with IAM](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security_iam_service-with-iam.html>)

  * [Use IAM condition keys with Amazon Bedrock AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security-gateway-condition-keys.html>)

  * [Identity-based policy examples for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security_iam_id-based-policy-examples.html>)

  * [AWS managed policies for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security-iam-awsmanpol.html>)

  * [Using service-linked roles for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./service-linked-roles.html>)

  * [Understanding Credentials Management in Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security-credentials-management.html>)

  * [Troubleshooting Amazon Bedrock AgentCore identity and access](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security_iam_troubleshoot.html>)


## Audience

How you use AWS Identity and Access Management (IAM) differs based on your role:

  * **Service user** \- request permissions from your administrator if you cannot access features (see [Troubleshooting Amazon Bedrock AgentCore identity and access](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security_iam_troubleshoot.html>) )

  * **Service administrator** \- determine user access and submit permission requests (see [How Amazon Bedrock AgentCore works with IAM](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security_iam_service-with-iam.html>) )

  * **IAM administrator** \- write policies to manage access (see [Identity-based policy examples for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security_iam_id-based-policy-examples.html>) )


## Authenticating with identities

Authentication is how you sign in to AWS using your identity credentials. You must be authenticated as the AWS account root user, an IAM user, or by assuming an IAM role.

You can sign in as a federated identity using credentials from an identity source like AWS IAM Identity Center (IAM Identity Center), single sign-on authentication, or Google/Facebook credentials. For more information about signing in, see [How to sign in to your AWS account](<https://docs.aws.amazon.com/signin/latest/userguide/how-to-sign-in.html>) in the _AWS Sign-In User Guide_.

For programmatic access, AWS provides an SDK and CLI to cryptographically sign requests. For more information, see [AWS Signature Version 4 for API requests](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html>) in the _IAM User Guide_.

### AWS account root user

When you create an AWS account, you begin with one sign-in identity called the AWS account _root user_ that has complete access to all AWS services and resources. We strongly recommend that you don’t use the root user for everyday tasks. For tasks that require root user credentials, see [Tasks that require root user credentials](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html#root-user-tasks>) in the _IAM User Guide_.

### Federated identity

As a best practice, require human users to use federation with an identity provider to access AWS services using temporary credentials.

A _federated identity_ is a user from your enterprise directory, web identity provider, or Directory Service that accesses AWS services using credentials from an identity source. Federated identities assume roles that provide temporary credentials.

For centralized access management, we recommend AWS IAM Identity Center. For more information, see [What is IAM Identity Center?](<https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html>) in the _AWS IAM Identity Center User Guide_.

### IAM users and groups

An _IAM user_ is an identity with specific permissions for a single person or application. We recommend using temporary credentials instead of IAM users with long-term credentials. For more information, see [Require human users to use federation with an identity provider to access AWS using temporary credentials](<https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#bp-users-federation-idp>) in the _IAM User Guide_.

An [IAM group](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html>) specifies a collection of IAM users and makes permissions easier to manage for large sets of users. For more information, see [Use cases for IAM users](<https://docs.aws.amazon.com/IAM/latest/UserGuide/gs-identities-iam-users.html>) in the _IAM User Guide_.

### IAM roles

An _IAM role_ is an identity with specific permissions that provides temporary credentials. You can assume a role by [switching from a user to an IAM role (console)](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-console.html>) or by calling an AWS CLI or AWS API operation. For more information, see [Methods to assume a role](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_manage-assume.html>) in the _IAM User Guide_.

IAM roles are useful for federated user access, temporary IAM user permissions, cross-account access, cross-service access, and applications running on Amazon EC2. For more information, see [Cross account resource access in IAM](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-cross-account-resource-access.html>) in the _IAM User Guide_.

## Managing access using policies

You control access in AWS by creating policies and attaching them to AWS identities or resources. A policy defines permissions when associated with an identity or resource. AWS evaluates these policies when a principal makes a request. Most policies are stored in AWS as JSON documents. For more information about JSON policy documents, see [Overview of JSON policies](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policies-json>) in the _IAM User Guide_.

Using policies, administrators specify who has access to what by defining which **principal** can perform **actions** on what **resources** , and under what **conditions**.

By default, users and roles have no permissions. An IAM administrator creates IAM policies and adds them to roles, which users can then assume. IAM policies define permissions regardless of the method used to perform the operation.

### Identity-based policies

Identity-based policies are JSON permissions policy documents that you attach to an identity (user, group, or role). These policies control what actions identities can perform, on which resources, and under what conditions. To learn how to create an identity-based policy, see [Define custom IAM permissions with customer managed policies](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html>) in the _IAM User Guide_.

Identity-based policies can be _inline policies_ (embedded directly into a single identity) or _managed policies_ (standalone policies attached to multiple identities). To learn how to choose between managed and inline policies, see [Choose between managed policies and inline policies](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-choosing-managed-or-inline.html>) in the _IAM User Guide_.

### Resource-based policies

Resource-based policies are JSON policy documents that you attach to a resource. Examples include IAM _role trust policies_ and Amazon S3 _bucket policies_ . In services that support resource-based policies, service administrators can use them to control access to a specific resource. You must [specify a principal](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html>) in a resource-based policy.

Resource-based policies are inline policies that are located in that service. You can’t use AWS managed policies from IAM in a resource-based policy.

### Other policy types

AWS supports additional policy types that can set the maximum permissions granted by more common policy types:

  * **Permissions boundaries** – Set the maximum permissions that an identity-based policy can grant to an IAM entity. For more information, see [Permissions boundaries for IAM entities](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html>) in the _IAM User Guide_.

  * **Service control policies (SCPs)** – Specify the maximum permissions for an organization or organizational unit in AWS Organizations. For more information, see [Service control policies](<https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html>) in the _AWS Organizations User Guide_.

  * **Resource control policies (RCPs)** – Set the maximum available permissions for resources in your accounts. For more information, see [Resource control policies (RCPs)](<https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html>) in the _AWS Organizations User Guide_.

  * **Session policies** – Advanced policies passed as a parameter when creating a temporary session for a role or federated user. For more information, see [Session policies](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#policies_session>) in the _IAM User Guide_.


### Multiple policy types

When multiple types of policies apply to a request, the resulting permissions are more complicated to understand. To learn how AWS determines whether to allow a request when multiple policy types are involved, see [Policy evaluation logic](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html>) in the _IAM User Guide_.

