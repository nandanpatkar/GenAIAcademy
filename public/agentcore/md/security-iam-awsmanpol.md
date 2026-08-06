# AWS managed policies for Amazon Bedrock AgentCore - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-iam-awsmanpol.html

---

# AWS managed policies for Amazon Bedrock AgentCore

An AWS managed policy is a standalone policy that is created and administered by AWS. AWS managed policies are designed to provide permissions for many common use cases so that you can start assigning permissions to users, groups, and roles.

Keep in mind that AWS managed policies might not grant least-privilege permissions for your specific use cases because they’re available for all AWS customers to use. We recommend that you reduce permissions further by defining [customer managed policies](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html#customer-managed-policies>) that are specific to your use cases.

You cannot change the permissions defined in AWS managed policies. If AWS updates the permissions defined in an AWS managed policy, the update affects all principal identities (users, groups, and roles) that the policy is attached to. AWS is most likely to update an AWS managed policy when a new AWS service is launched or new API operations become available for existing services.

For more information, see [AWS managed policies](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html#aws-managed-policies>) in the _IAM User Guide_.

###### Topics

  * AWS managed policy: BedrockAgentCoreFullAccess

  * AWS managed policy: BedrockAgentCoreNetworkServiceRolePolicy

  * AWS managed policy: AmazonBedrockAgentCoreMemoryBedrockModelInferenceExecutionRolePolicy

  * AWS managed policy: BedrockAgentCoreRuntimeIdentityServiceRolePolicy

  * AgentCore updates to AWS managed policies


## AWS managed policy: BedrockAgentCoreFullAccess

You can attach [BedrockAgentCoreFullAccess](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreFullAccess.html>) to your users, groups, and roles.

This policy grants permissions that allow full access to the Amazon Bedrock AgentCore.

**Permissions details**

This policy includes the following permissions:

  * `bedrock-agentcore` (Amazon Bedrock Agent Core) – Allows principals full access to all Amazon Bedrock Agent Core resources.

  * `iam` (AWS Identity and Access Management) – Allows principals to list and get information about roles and policies, and to pass roles with "BedrockAgentCore" in the name to the bedrock-agentcore service. Also allows creating service-linked roles for CloudWatch Application Signals, Amazon Bedrock AgentCore network, and Amazon Bedrock AgentCore runtime identity.

  * `secretsmanager` (AWS Secrets Manager) – Allows principals to create, update, retrieve, and delete secrets with names that begin with "bedrock-agentcore".

  * `kms` (AWS Key Management Service) – Allows principals to list and describe keys, and to decrypt data within the same AWS account when called via the Amazon Bedrock AgentCore service.

  * `s3` (Amazon Simple Storage Service) – Allows principals to get objects from S3 buckets with names that begin with "bedrock-agentcore-gateway-" when called via the Amazon Bedrock AgentCore service.

  * `lambda` (AWS Lambda) – Allows principals to list Lambda functions.

  * `logs` (Amazon CloudWatch Logs) – Allows principals to access, query, and manage log data in log groups related to Amazon Bedrock AgentCore and Application Signals, including creating log groups and streams.

  * `application-autoscaling` (Application Auto Scaling) – Allows principals to describe scaling policies.

  * `application-signals` (Amazon CloudWatch Application Signals) – Allows principals to retrieve information about application signals and start discovery.

  * `autoscaling` (Amazon EC2 Auto Scaling) – Allows principals to describe Auto Scaling resources.

  * `cloudwatch` (Amazon CloudWatch) – Allows principals to retrieve and list metrics, generate queries, and access other CloudWatch resources.

  * `oam` (Amazon CloudWatch Observability Access Manager) – Allows principals to list sinks.

  * `rum` (Amazon CloudWatch RUM) – Allows principals to retrieve and list RUM resources.

  * `synthetics` (Amazon CloudWatch Synthetics) – Allows principals to describe and get information about Synthetics resources.

  * `xray` (AWS X-Ray) – Allows principals to retrieve trace information, manage trace segment destinations, and work with indexing rules.

  * `ecr` (Amazon Elastic Container Registry) – Allows principals to describe repositories, list images, and describe images.

  * `bedrock` (Amazon Bedrock) – Allows principals to invoke foundation models and inference profiles for evaluation purposes.


### Considerations

Note the following limitations of this policy:

  * **`iam:CreateRole` is not included.** When you create certain AgentCore resources (for example, harness or runtime) in the console, you can elect for the console to auto-create the resource’s execution role on your behalf. This requires `iam:CreateRole` permissions, which are not included in this managed policy. For more information, see [Troubleshooting iam:CreateRole authorization in the console](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security_iam_troubleshoot.html#security_iam_troubleshoot-createrole>).

  * **`iam:PassRole` is scoped by role name.** When you create certain AgentCore resources (for example, harness or runtime), you must have `iam:PassRole` permissions on the resource’s execution role. This managed policy only includes `iam:PassRole` permissions for roles with names matching `*BedrockAgentCore*`. For more information, see [Troubleshooting iam:PassRole authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security_iam_troubleshoot.html#security_iam_troubleshoot-passrole>).

  * **`GetWorkloadAccessTokenForUserId` is included.** This policy grants permission to call `GetWorkloadAccessTokenForUserId`, which allows issuing workload access tokens using a caller-supplied user identifier string without IdP token verification. This is suitable for development and quickstart scenarios. For production deployments, create custom IAM policies that only grant `GetWorkloadAccessTokenForJWT` (which validates the JWT signature, issuer, and expiry) and explicitly deny `GetWorkloadAccessTokenForUserId` if your workloads always have a JWT available. For more information, see [Get workload access token](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./get-workload-access-token.html>).


## AWS managed policy: BedrockAgentCoreNetworkServiceRolePolicy

This policy is attached to a service-linked role that allows the service to perform actions on your behalf. You cannot attach this policy to your users, groups, or roles.

This policy grants permissions that allow AgentCore to create and manage network interfaces in your VPC when running in VPC mode.

**Permissions details**

This policy includes the following permissions:

  * `ec2` (Amazon Elastic Compute Cloud) – Allows the service to create, manage, and delete network interfaces in your VPC, assign and unassign private IP addresses, and describe VPC resources. Network interfaces are tagged with "AmazonBedrockAgentCoreManaged" to ensure the service only manages resources it creates.


You can view this policy at [BedrockAgentCoreNetworkServiceRolePolicy](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreNetworkServiceRolePolicy.html>).

For more information about the service-linked role that uses this policy, see [Using service-linked roles for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./service-linked-roles.html>).

## AWS managed policy: AmazonBedrockAgentCoreMemoryBedrockModelInferenceExecutionRolePolicy

You can attach [AmazonBedrockAgentCoreMemoryBedrockModelInferenceExecutionRolePolicy](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonBedrockAgentCoreMemoryBedrockModelInferenceExecutionRolePolicy.html>) to your users, groups, and roles.

This policy grants permissions that allow full access to the Amazon Bedrock Agent Core Memory.

**Permissions details**

This policy includes the following permissions.

  * `bedrock` – Allows principals to call the Amazon Bedrock `Invokemodel` and `InvokeModelWithResponseStream` actions. This is required so that an agent can store memories.

  * `bedrock-mantle` – Allows principals to call the `CreateInference` and `CallWithBearerToken` actions. This is required so that the service can process memories using Amazon Bedrock Mantle models.


## AWS managed policy: BedrockAgentCoreRuntimeIdentityServiceRolePolicy

This policy is attached to a service-linked role that allows the service to perform actions on your behalf. You cannot attach this policy to your users, groups, or roles.

This policy grants permissions that allow access to identity and token management resources that are required for AgentCore Runtime authentication and authorization.

**Permissions details**

This policy includes the following permissions:

  * `bedrock-agentcore` (Amazon Bedrock Agent Core) – Allows the service to get workload access tokens for JWT authentication and user ID-based authentication. Specifically allows `GetWorkloadAccessToken` , `GetWorkloadAccessTokenForJWT` , and `GetWorkloadAccessTokenForUserId` actions on the default workload identity directory and its associated workload identities.


**Policy contents**

You can view the complete policy at [BedrockAgentCoreRuntimeIdentityServiceRolePolicy](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreRuntimeIdentityServiceRolePolicy.html>).

For more information about the service-linked role that uses this policy, see [Using service-linked roles for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./service-linked-roles.html>).

## AgentCore updates to AWS managed policies

View details about updates to AWS managed policies for AgentCore since this service began tracking these changes. For automatic alerts about changes to this page, subscribe to the RSS feed on the AgentCore Document history page.

Change | Description | Date  
---|---|---  
AmazonBedrockAgentCoreMemoryBedrockModelInferenceExecutionRolePolicy – Updated policy |  Added Amazon Bedrock Mantle permissions ( `bedrock-mantle:CreateInference` , `bedrock-mantle:CallWithBearerToken` ) to allow Amazon Bedrock AgentCore Memory to invoke Mantle models. |  July 17, 2026  
BedrockAgentCoreFullAccess – Updated policy |  Added Amazon Elastic Container Registry permissions ( `ecr:DescribeRepositories` , `ecr:DescribeImages` , `ecr:ListImages` ) to allow Amazon Bedrock AgentCore to access container images for runtime deployments. Added Amazon Bedrock permissions ( `bedrock:InvokeModel` , `bedrock:InvokeModelWithResponseStream` ) to allow Amazon Bedrock AgentCore Evaluations to invoke foundation models and inference profiles for evaluation purposes. Added CloudWatch Logs permissions for evaluations ( `logs:CreateLogGroup` for /aws/bedrock-agentcore/evaluations/* log groups, `logs:PutIndexPolicy` , `logs:DescribeIndexPolicies` ) to support evaluation logging and indexing. |  December 2, 2025  
BedrockAgentCoreFullAccess – Updated policy |  Added the `cloudtrail:CreateServiceLinkedChannel` permission to allow Amazon Bedrock AgentCore to create a CloudTrail service-linked channel for the Application Signals feature. Added `kms:CreateGrant` permission to allow the Amazon Bedrock AgentCore Gateway service to create grants on customer managed keys for the S3 vectors service used for semantic search. Added `kms:ListGrants` permission to check if previously created grants exist. Added S3 permissions to create bucket, put bucket policy, versioning, put object for buckets with prefix bedrock-agentcore-runtime-. Added list buckets, list objects in the bucket, and get object permissions. Added ECR permissions to describe repositories, list images, and describe images. Added logs `PutResourcePolicy` permissions to enable transaction search. |  November 3, 2025  
BedrockAgentCoreRuntimeIdentityServiceRolePolicy – New policy |  Added a new AWS managed policy that allows AgentCore to manage workload identity access tokens and OAuth credentials for agent runtimes. |  October 10, 2025  
BedrockAgentCoreFullAccess – Updated policy |  Added permission to create the Amazon Bedrock AgentCore runtime identity service-linked role. |  October 9, 2025  
BedrockAgentCoreFullAccess – Updated policy |  Added permission to create the Amazon Bedrock AgentCore runtime identity service-linked role. |  October 8, 2025  
BedrockAgentCoreFullAccess – Updated policy |  Added permission to create the Amazon Bedrock AgentCore network service-linked role. |  September 19, 2025  
BedrockAgentCoreNetworkServiceRolePolicy – New policy |  Added a new AWS managed policy that allows AgentCore to create and manage network interfaces in your VPC when running in VPC mode. |  September 19, 2025  
AgentCore started tracking changes |  AgentCore started tracking changes for its AWS managed policies. |  July 16, 2025

