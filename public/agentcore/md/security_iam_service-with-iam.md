# How Amazon Bedrock AgentCore works with IAM - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security_iam_service-with-iam.html

---

# How Amazon Bedrock AgentCore works with IAM

Before you use IAM to manage access to AgentCore, learn what IAM features are available to use with AgentCore.

IAM feature | AgentCore support  
---|---  
Identity-based policies |  Yes  
Resource-based policies |  Partial  
Policy actions |  Yes  
Policy resources |  Yes  
Policy condition keys |  Yes  
ACLs |  No  
ABAC (tags in policies) |  Partial  
Temporary credentials |  Yes  
Principal permissions |  Yes  
Service roles |  Yes  
Service-linked roles |  Yes  
  
To get a high-level view of how AgentCore and other AWS services work with most IAM features, see [AWS services that work with IAM](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_aws-services-that-work-with-iam.html>) in the _IAM User Guide_.

## Identity-based policies for AgentCore

**Supports identity-based policies:** Yes

Identity-based policies are JSON permissions policy documents that you can attach to an identity, such as an IAM user, group of users, or role. These policies control what actions users and roles can perform, on which resources, and under what conditions. To learn how to create an identity-based policy, see [Define custom IAM permissions with customer managed policies](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html>) in the _IAM User Guide_.

With IAM identity-based policies, you can specify allowed or denied actions and resources as well as the conditions under which actions are allowed or denied. To learn about all of the elements that you can use in a JSON policy, see [IAM JSON policy elements reference](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html>) in the _IAM User Guide_.

### Identity-based policy examples for AgentCore

To view examples of AgentCore identity-based policies, see [Identity-based policy examples for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security_iam_id-based-policy-examples.html>).

## Resource-based policies within AgentCore

**Supports resource-based policies:** Partial

Resource-based policies are JSON policy documents that you attach to a resource. Examples of resource-based policies are IAM _role trust policies_ and Amazon S3 _bucket policies_ . In services that support resource-based policies, service administrators can use them to control access to a specific resource. For the resource where the policy is attached, the policy defines what actions a specified principal can perform on that resource and under what conditions. You must [specify a principal](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html>) in a resource-based policy. Principals can include accounts, users, roles, federated users, or AWS services.

To enable cross-account access, you can specify an entire account or IAM entities in another account as the principal in a resource-based policy. For more information, see [Cross account resource access in IAM](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-cross-account-resource-access.html>) in the _IAM User Guide_.

Amazon Bedrock AgentCore supports resource-based policies for Agent Runtime and Gateway resources. These policies are attached directly to your resources and define which principals can perform actions on them.

To learn how to create and manage resource-based policies for Amazon Bedrock AgentCore resources, see [Resource-based policies for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./resource-based-policies.html>).

### Resource-based policy examples within AgentCore

To view examples of AgentCore resource-based policies, see [Common use cases and examples](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./resource-based-policies.html#resource-based-policies-examples>).

## Policy actions for AgentCore

**Supports policy actions:** Yes

Administrators can use AWS JSON policies to specify who has access to what. That is, which **principal** can perform **actions** on what **resources** , and under what **conditions**.

The `Action` element of a JSON policy describes the actions that you can use to allow or deny access in a policy. Include actions in a policy to grant permissions to perform the associated operation.

To see a list of AgentCore actions, see [Actions Defined by Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazonbedrockagentcore.html#amazonbedrockagentcore-actions-as-permissions>) in the _Service Authorization Reference_.

Policy actions in AgentCore use the following prefix before the action:

```text
bedrock-agentcore
```
To specify multiple actions in a single statement, separate them with commas.

```text
"Action": [
      "bedrock-agentcore:action1",
      "bedrock-agentcore:action2"
         ]
```
To view examples of AgentCore identity-based policies, see [Identity-based policy examples for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security_iam_id-based-policy-examples.html>).

## Policy resources for AgentCore

**Supports policy resources:** Yes

Administrators can use AWS JSON policies to specify who has access to what. That is, which **principal** can perform **actions** on what **resources** , and under what **conditions**.

The `Resource` JSON policy element specifies the object or objects to which the action applies. As a best practice, specify a resource using its [Amazon Resource Name (ARN)](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html>) . For actions that don’t support resource-level permissions, use a wildcard (*) to indicate that the statement applies to all resources.

```text
"Resource": "*"
```
To see a list of AgentCore resource types and their ARNs, see [Resources Defined by Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazonbedrockagentcore.html#amazonbedrockagentcore-resources-for-iam-policies>) in the _Service Authorization Reference_ . To learn with which actions you can specify the ARN of each resource, see [Actions Defined by Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazonbedrockagentcore.html#amazonbedrockagentcore-actions-as-permissions>).

To view examples of AgentCore identity-based policies, see [Identity-based policy examples for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security_iam_id-based-policy-examples.html>).

## Policy condition keys for AgentCore

**Supports service-specific policy condition keys:** Yes

Administrators can use AWS JSON policies to specify who has access to what. That is, which **principal** can perform **actions** on what **resources** , and under what **conditions**.

The `Condition` element specifies when statements execute based on defined criteria. You can create conditional expressions that use [condition operators](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html>) , such as equals or less than, to match the condition in the policy with values in the request. To see all AWS global condition keys, see [AWS global condition context keys](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html>) in the _IAM User Guide_.

To see a list of AgentCore condition keys, see [Condition Keys for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazonbedrockagentcore.html#amazonbedrockagentcore-policy-keys>) in the _Service Authorization Reference_ . To learn with which actions and resources you can use a condition key, see [Actions Defined by Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazonbedrockagentcore.html#amazonbedrockagentcore-actions-as-permissions>).

The following condition keys are especially useful when working with Amazon Bedrock AgentCore:

  * `bedrock-agentcore:InboundJwtClaim/iss` \- You can use this condition key to restrict access to APIs that accept a JWT representing an enduser to work with specific issuer (iss) claim values present in the JWT passed in the request. You can apply this condition key to the `GetWorkloadAccessTokenForJwt` and `CompleteResourceTokenAuth` operations.

  * `bedrock-agentcore:InboundJwtClaim/sub` \- You can use this condition key to restrict access to APIs that accept a JWT to work with specific subject (sub) claim values present in the JWT passed in the request. You can apply this condition key to the `GetWorkloadAccessTokenForJwt` and `CompleteResourceTokenAuth` operations.

  * `bedrock-agentcore:InboundJwtClaim/aud` \- You can use this condition key to restrict access to APIs that accept a JWT to work with specific audience (aud) claim values present in the JWT passed in the request. You can apply this condition key to the `GetWorkloadAccessTokenForJwt` and `CompleteResourceTokenAuth` operations.

  * `bedrock-agentcore:userid` \- You can use this condition key to restrict access to APIs that accept a static user ID to work only with the defined user ID values in your policy statement. You can apply this condition key to the `GetWorkloadAccessTokenForUserId` and `CompleteResourceTokenAuth` operations.

  * `bedrock-agentcore:InboundJwtClaim/scope` \- You can use this condition key to restrict access based on the scope claim in the JWT passed in the request.

  * `bedrock-agentcore:InboundJwtClaim/client_id` \- You can use this condition key to restrict access to APIs that accept a JWT to work with specific `client_id` claim values present in the JWT passed in the request. This key is only available when the JWT has the `client_id` claim exactly and is not available when the information is communicated in other similar claims. You can apply this condition key to the `GetWorkloadAccessTokenForJwt` and `CompleteResourceTokenAuth` operations.


To view examples of AgentCore identity-based policies, see [Identity-based policy examples for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security_iam_id-based-policy-examples.html>).

For detailed information about condition keys for specific AgentCore capabilities, see the following topics:

  * [Use IAM condition keys with Amazon Bedrock AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security-gateway-condition-keys.html>) – Condition keys for the `CreateGateway`, `UpdateGateway`, `CreateGatewayTarget`, and `UpdateGatewayTarget` API operations.

  * [Use IAM condition keys with AgentCore VPC settings](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security-vpc-condition.html>) – VPC-related condition keys for AgentCore runtime, built-in tools, and gateway targets.


## ACLs in AgentCore

**Supports ACLs:** No

Access control lists (ACLs) control which principals (account members, users, or roles) have permissions to access a resource. ACLs are similar to resource-based policies, although they do not use the JSON policy document format.

## ABAC with AgentCore

**Supports ABAC (tags in policies):** Partial

Attribute-based access control (ABAC) is an authorization strategy that defines permissions based on attributes called tags. You can attach tags to IAM entities and AWS resources, then design ABAC policies to allow operations when the principal’s tag matches the tag on the resource.

To control access based on tags, you provide tag information in the [condition element](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html>) of a policy using the `aws:ResourceTag/key-name` , `aws:RequestTag/key-name` , or `aws:TagKeys` condition keys.

If a service supports all three condition keys for every resource type, then the value is **Yes** for the service. If a service supports all three condition keys for only some resource types, then the value is **Partial**.

For more information about ABAC, see [Define permissions with ABAC authorization](<https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html>) in the _IAM User Guide_ . To view a tutorial with steps for setting up ABAC, see [Use attribute-based access control (ABAC)](<https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_attribute-based-access-control.html>) in the _IAM User Guide_.

## Using temporary credentials with AgentCore

**Supports temporary credentials:** Yes

Temporary credentials provide short-term access to AWS resources and are automatically created when you use federation or switch roles. AWS recommends that you dynamically generate temporary credentials instead of using long-term access keys. For more information, see [Temporary security credentials in IAM](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html>) and [AWS services that work with IAM](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_aws-services-that-work-with-iam.html>) in the _IAM User Guide_.

## Cross-service principal permissions for AgentCore

**Supports forward access sessions (FAS):** Yes

Forward access sessions (FAS) use the permissions of the principal calling an AWS service, combined with the requesting AWS service to make requests to downstream services. For policy details when making FAS requests, see [Forward access sessions](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_forward_access_sessions.html>).

## Service roles for AgentCore

**Supports service roles:** Yes

A service role is an [IAM role](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html>) that a service assumes to perform actions on your behalf. An IAM administrator can create, modify, and delete a service role from within IAM. For more information, see [Create a role to delegate permissions to an AWS service](<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html>) in the _IAM User Guide_.

###### Warning

Changing the permissions for a service role might break AgentCore functionality. Edit service roles only when AgentCore provides guidance to do so.

## Service-linked roles for AgentCore

**Supports service-linked roles:** Yes

A service-linked role is a type of service role that is linked to an AWS service. The service can assume the role to perform an action on your behalf. Service-linked roles appear in your AWS account and are owned by the service. An IAM administrator can view, but not edit the permissions for service-linked roles.

For details about creating or managing service-linked roles, see [AWS services that work with IAM](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_aws-services-that-work-with-iam.html>) . Find a service in the table that includes a `Yes` in the **Service-linked role** column. Choose the **Yes** link to view the service-linked role documentation for that service.

