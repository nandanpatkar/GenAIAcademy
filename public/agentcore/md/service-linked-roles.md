# Using service-linked roles for Amazon Bedrock AgentCore - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/service-linked-roles.html

---

# Using service-linked roles for Amazon Bedrock AgentCore  
  
Amazon Bedrock AgentCore uses AWS Identity and Access Management (IAM) service-linked roles. A service-linked role is a unique type of IAM role that is linked directly to AgentCore. Service-linked roles are predefined by AgentCore and include all the permissions that the service requires to call other AWS services on your behalf.

A service-linked role makes using AgentCore easier because you don’t have to manually add the necessary permissions. AgentCore defines the permissions of its service-linked roles, and unless defined otherwise, only AgentCore can assume its roles. The defined permissions include the trust policy and the permissions policy, and that permissions policy cannot be attached to any other IAM entity.

You can delete the roles only after first deleting their related resources. This protects your AgentCore resources because you can’t inadvertently remove permission to access the resources.

AgentCore uses the following service-linked roles:

  * `AWSServiceRoleForBedrockAgentCoreNetwork` \- Manages network interfaces in your VPC

  * `AWSServiceRoleForBedrockAgentCoreRuntimeIdentity` \- Manages workload identity access tokens and OAuth credentials for agent runtimes

  * `AWSServiceRoleForBedrockAgentCoreGatewayNetwork` \- Manages Amazon VPC Lattice resources for AgentCore Gateway private connectivity

  * `AWSServiceRoleForBedrockAgentCoreIdentity` \- Manages Amazon VPC Lattice resources for AgentCore Identity connectivity to private identity providers


## AgentCore service-linked role permissions

### Network service-linked role

AgentCore uses the service-linked role named `AWSServiceRoleForBedrockAgentCoreNetwork` to allow AgentCore to create and manage network interfaces in your VPC on your behalf.

The `AWSServiceRoleForBedrockAgentCoreNetwork` service-linked role trusts the following services to assume the role:

  * `network.bedrock-agentcore.amazonaws.com`


The role permissions policy allows AgentCore to complete the following actions on the specified resources:

You can view the complete policy at [BedrockAgentCoreNetworkServiceRolePolicy](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreNetworkServiceRolePolicy.html>).

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCreateEniInAnySubnet",
            "Effect": "Allow",
            "Action": "ec2:CreateNetworkInterface",
            "Resource": "arn:aws:ec2:*:*:subnet/*"
        },
        {
            "Sid": "AllowCreateEniWithSecurityGroups",
            "Effect": "Allow",
            "Action": "ec2:CreateNetworkInterface",
            "Resource": "arn:aws:ec2:*:*:security-group/*"
        },
        {
            "Sid": "AllowCreateEniWithBedrockManagedRequestTag",
            "Effect": "Allow",
            "Action": "ec2:CreateNetworkInterface",
            "Resource": "arn:aws:ec2:*:*:network-interface/*",
            "Condition": {
                "ForAllValues:StringEquals": {
                    "aws:TagKeys": [
                        "AmazonBedrockAgentCoreManaged"
                    ]
                },
                "StringEquals": {
                    "aws:RequestTag/AmazonBedrockAgentCoreManaged": "true"
                }
            }
        },
        {
            "Sid": "AllowTagEniOnCreate",
            "Effect": "Allow",
            "Action": "ec2:CreateTags",
            "Resource": "arn:aws:ec2:*:*:network-interface/*",
            "Condition": {
                "StringEquals": {
                    "ec2:CreateAction": "CreateNetworkInterface"
                }
            }
        },
        {
            "Sid": "AllowManageEniWhenBedrockManaged",
            "Effect": "Allow",
            "Action": [
                "ec2:DeleteNetworkInterface",
                "ec2:AssignPrivateIpAddresses",
                "ec2:UnassignPrivateIpAddresses",
                "ec2:CreateNetworkInterfacePermission"
            ],
            "Resource": "arn:aws:ec2:*:*:network-interface/*",
            "Condition": {
                "StringEquals": {
                    "aws:ResourceTag/AmazonBedrockAgentCoreManaged": "true"
                }
            }
        },
        {
            "Sid": "AllowGetSecurityGroupsForVpc",
            "Effect": "Allow",
            "Action": [
                "ec2:GetSecurityGroupsForVPC"
            ],
            "Resource": "arn:aws:ec2:*:*:vpc/*"
        },
        {
            "Sid": "AllowDescribeNetworkingResources",
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeNetworkInterfaces",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeSubnets",
                "ec2:DescribeVpcs"
            ],
            "Resource": "*"
        }
    ]
}
```
### Identity service-linked role

AgentCore uses the service-linked role named `AWSServiceRoleForBedrockAgentCoreRuntimeIdentity` to allow AgentCore to manage workload identity access tokens and OAuth credentials on your behalf.

The `AWSServiceRoleForBedrockAgentCoreRuntimeIdentity` service-linked role trusts the following services to assume the role:

  * `runtime-identity.bedrock-agentcore.amazonaws.com`


The role permissions policy allows AgentCore to complete these actions on the specified resources.

You can view the complete policy at [BedrockAgentCoreRuntimeIdentityServiceRolePolicy](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreRuntimeIdentityServiceRolePolicy.html>).

```json
{
"Version": "2012-10-17",
    "Statement": {
        "Sid": "AllowWorkloadIdentityAccess",
        "Effect": "Allow",
        "Action": [
            "bedrock-agentcore:GetWorkloadAccessToken",
            "bedrock-agentcore:GetWorkloadAccessTokenForJWT",
            "bedrock-agentcore:GetWorkloadAccessTokenForUserId"
        ],
        "Resource": [
            "arn:aws:bedrock-agentcore:*:*:workload-identity-directory/default",
            "arn:aws:bedrock-agentcore:*:*:workload-identity-directory/default/workload-identity/*"
        ]
    }
}
```
For information about changes to this policy, see [AgentCore updates to AWS managed policies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security-iam-awsmanpol.html#security-iam-awsmanpol-updates>).

**Understanding the Identity Feature**

The service-linked role is used to support OAuth authentication and JWT bearer token features for AgentCore Runtime resources. This feature allows agent runtimes to securely manage workload identities and access external OAuth providers on behalf of users.

**Key Benefits of Identity Management**

  * **Simplified Permission Management** : Eliminates the need to manually configure IAM policies for workload identity access

  * **Secure Token Management** : Provides secure access to workload access tokens for OAuth flows

  * **User Federation** : Enables three-legged OAuth flows for accessing external services like Google Drive, Microsoft Graph, etc.

  * **Automatic Provisioning** : Service-linked role is created automatically when needed


**How Identity Management Works**

When you invoke an AgentCore Runtime with OAuth authentication or JWT bearer tokens:

  1. You configure JWT authorizer settings (discovery URL, allowed clients, allowed audiences) during runtime creation

  2. AgentCore creates the service-linked role automatically to manage workload identity permissions

  3. The runtime uses the service-linked role to exchange JWT tokens for workload access tokens

  4. Your agent code can use these tokens to access external OAuth providers and services

  5. All token management is handled securely through the AgentCore Identity service


**Migration from Legacy Approach**

For existing agents (created before October 13, 2025)
    

  * Continue to use manual IAM policies attached to the agent execution role

  * No automatic migration - existing behavior is preserved


For new agents (created on or after October 13, 2025)
    

  * Automatically use the service-linked role approach

  * No manual IAM policy configuration required

  * Simplified setup and management


The service-linked role ensures that AgentCore can only access workload identity resources that are explicitly associated with your agent runtimes, maintaining secure isolation and clear resource attribution.

For implementation details, see [Authenticate and authorize with Inbound Auth and Outbound Auth](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-oauth.html>).

### Gateway service-linked role

AgentCore uses the service-linked role named `AWSServiceRoleForBedrockAgentCoreGatewayNetwork` to allow AgentCore Gateway to create and manage Amazon VPC Lattice resources in your account on your behalf. This role is used when you configure a gateway target with a managed private endpoint, enabling AgentCore Gateway to set up the necessary VPC Lattice resource gateways for private connectivity to resources in your VPC.

The `AWSServiceRoleForBedrockAgentCoreGatewayNetwork` service-linked role trusts the following services to assume the role:

  * `bedrock-agentcore.amazonaws.com`


The role permissions policy allows AgentCore to complete the following actions on the specified resources:

You can view the complete policy at [BedrockAgentCoreGatewayNetworkServiceRolePolicy](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreGatewayNetworkServiceRolePolicy.html>).

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowSLRActionsForLattice",
            "Effect": "Allow",
            "Action": [
                "iam:CreateServiceLinkedRole"
            ],
            "Resource": [
                "arn:aws:iam::*:role/aws-service-role/vpc-lattice.amazonaws.com/AWSServiceRoleForVpcLattice"
            ],
            "Condition": {
                "StringEquals": {
                    "iam:AWSServiceName": "vpc-lattice.amazonaws.com"
                }
            }
        },
        {
            "Sid": "AllowResourceGatewayCreate",
            "Effect": "Allow",
            "Action": [
                "vpc-lattice:CreateResourceGateway",
                "vpc-lattice:TagResource"
            ],
            "Resource": [
                "arn:aws:vpc-lattice:*:*:resourcegateway/*"
            ],
            "Condition": {
                "StringEquals": {
                    "aws:RequestTag/BedrockAgentCoreGatewayManaged": "true",
                    "aws:ResourceTag/BedrockAgentCoreGatewayManaged": "true"
                }
            }
        },
        {
            "Sid": "AllowEC2PermissionsForResourceGatewayCreate",
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeSubnets",
                "ec2:DescribeVpcs",
                "ec2:DescribeSecurityGroups"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Sid": "AllowResourceGatewayDelete",
            "Effect": "Allow",
            "Action": [
                "vpc-lattice:DeleteResourceGateway",
                "vpc-lattice:GetResourceGateway"
            ],
            "Resource": [
                "*"
            ],
            "Condition": {
                "StringEquals": {
                    "aws:ResourceTag/BedrockAgentCoreGatewayManaged": "true"
                }
            }
        }
    ]
}
```
**Understanding the Gateway Managed Lattice Feature**

The service-linked role is used to support the managed private endpoint feature for AgentCore Gateway targets. When you create a gateway target with a managed private endpoint, AgentCore uses this role to create and manage VPC Lattice resource gateways in your account on your behalf. These managed resource gateways enable private connectivity between AgentCore Gateway and resources in your VPC without requiring you to set up VPC Lattice resources manually.

**Key Benefits of Managed Lattice Resources**

  * **Simplified Setup** : Eliminates the need to manually create and configure VPC Lattice resource gateways

  * **Scoped-down Networking permissions** : Application developers don’t need VPC Lattice networking permissions in their own IAM policies

  * **Managed Lifecycle** : AgentCore manages the full lifecycle of the Lattice resources, including creation, reuse, and cleanup

  * **Automatic Provisioning** : The service-linked role is created automatically when you create a gateway target with a managed private endpoint


**How Managed Lattice Resources Work**

When you create a gateway target with a managed private endpoint:

  1. You specify the VPC, subnets, and optional security groups for the private endpoint in the `managedVpcResource` configuration

  2. AgentCore creates the service-linked role automatically if it does not already exist

  3. AgentCore uses the role to create a managed VPC Lattice resource gateway in your account, tagged with `BedrockAgentCoreGatewayManaged`

  4. AgentCore sets up the necessary VPC Lattice resources to enable private connectivity

  5. When you delete the gateway target, AgentCore cleans up the managed Lattice resources that are no longer in use


###### Note

The service-linked role can only manage VPC Lattice resource gateways that are tagged with `BedrockAgentCoreGatewayManaged` . It cannot modify or delete resource gateways that you create and manage yourself. If you use the self-managed Lattice resource option for your gateway targets, this service-linked role is not required.

### Identity Network service-linked role

AgentCore uses the service-linked role named `AWSServiceRoleForBedrockAgentCoreIdentity` to allow AgentCore Identity to create and manage Amazon VPC Lattice resources in your account on your behalf. This role is used when you configure a private endpoint for a private identity provider, enabling AgentCore Identity to set up the necessary VPC Lattice resource gateways for private connectivity to identity providers in your VPC.

The `AWSServiceRoleForBedrockAgentCoreIdentity` service-linked role trusts the following services to assume the role:

  * `identity-network.bedrock-agentcore.amazonaws.com`


The role permissions policy allows AgentCore to complete the following actions on the specified resources:

You can view the complete policy at [AWSBedrockAgentCoreIdentityNetworkServiceRolePolicy](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSBedrockAgentCoreIdentityNetworkServiceRolePolicy.html>).

```text
{
  "Version" : "2012-10-17",
  "Statement" : [
    {
      "Sid" : "AllowSLRActionsForLattice",
      "Effect" : "Allow",
      "Action" : [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource" : [
        "arn:aws:iam::*:role/aws-service-role/vpc-lattice.amazonaws.com/AWSServiceRoleForVpcLattice"
      ],
      "Condition" : {
        "StringEquals" : {
          "iam:AWSServiceName" : "vpc-lattice.amazonaws.com"
        }
      }
    },
    {
      "Sid" : "AllowResourceGatewayCreate",
      "Effect" : "Allow",
      "Action" : [
        "vpc-lattice:CreateResourceGateway",
        "vpc-lattice:TagResource"
      ],
      "Resource" : [
        "arn:aws:vpc-lattice:*:*:resourcegateway/*"
      ],
      "Condition" : {
        "StringEquals" : {
          "aws:RequestTag/BedrockAgentCoreIdentityManaged" : "true",
          "aws:ResourceTag/BedrockAgentCoreIdentityManaged" : "true"
        }
      }
    },
    {
      "Sid" : "AllowEC2PermissionsForResourceGatewayCreate",
      "Effect" : "Allow",
      "Action" : [
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcs",
        "ec2:DescribeSecurityGroups"
      ],
      "Resource" : [
        "*"
      ]
    },
    {
      "Sid" : "AllowResourceGatewayDelete",
      "Effect" : "Allow",
      "Action" : [
        "vpc-lattice:DeleteResourceGateway",
        "vpc-lattice:GetResourceGateway"
      ],
      "Resource" : [
        "*"
      ],
      "Condition" : {
        "StringEquals" : {
          "aws:ResourceTag/BedrockAgentCoreIdentityManaged" : "true"
        }
      }
    }
  ]
}
```
**Understanding the Identity Network Feature**

The service-linked role is used to support the managed private endpoint feature for AgentCore Identity. When you configure a private endpoint for a private identity provider, AgentCore uses this role to create and manage VPC Lattice resource gateways in your account on your behalf. These managed resource gateways enable private connectivity between AgentCore Identity and identity providers in your VPC, such as self-hosted Keycloak, PingFederate, or other OIDC-compliant authorization servers, without requiring you to set up VPC Lattice resources manually.

**How Managed Lattice Resources Work for Identity**

When you configure a private endpoint for a private identity provider:

  1. You specify the VPC, subnets, and optional security groups for the private endpoint in the `managedVpcResource` configuration

  2. AgentCore creates the service-linked role automatically if it does not already exist

  3. AgentCore uses the role to create a managed VPC Lattice resource gateway in your account, tagged with `BedrockAgentCoreIdentityManaged`

  4. AgentCore sets up the necessary VPC Lattice resources to enable private connectivity to your identity provider

  5. When you remove the private endpoint configuration, AgentCore cleans up the managed Lattice resources that are no longer in use


###### Note

The service-linked role can only manage VPC Lattice resource gateways that are tagged with `BedrockAgentCoreIdentityManaged` . It cannot modify or delete resource gateways that you create and manage yourself. If you use the self-managed Lattice resource option for your private identity provider, this service-linked role is not required.

For more information about configuring private identity providers, see [Connect to private identity providers in your VPC](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-private-idp.html>).

## Creating a service-linked role for AgentCore

You don’t need to manually create service-linked roles. AgentCore creates them automatically when needed:

  * **Network service-linked role** : Created when you create an AgentCore Runtime, Code Interpreter, or Browser resources with VPC configuration

  * **Identity service-linked role** : Created when you create or update an AgentCore Runtime on or after **October 13, 2025**

  * **Gateway service-linked role** : Created when you create a AgentCore Gateway target with a managed private endpoint ( `managedVpcResource` ) configuration

  * **Identity Network service-linked role** : Created when you configure a private endpoint for a VPC hosted identity provider ( `managedVpcResource` ) configuration


If you delete a service-linked role and then need to create it again, you can use the same process to re-create the role in your account. When you create the appropriate AgentCore resources, AgentCore creates the service-linked role for you again.

### Permissions required to create a service-linked role

You must configure permissions to allow an IAM entity (such as a user, group, or role) to create, edit, or delete a service-linked role. The IAM entity needs to have the following permissions:

**For the Network service-linked role**

```json
{
    "Action": "iam:CreateServiceLinkedRole",
    "Effect": "Allow",
    "Resource": "arn:aws:iam::*:role/aws-service-role/network.bedrock-agentcore.amazonaws.com/AWSServiceRoleForBedrockAgentCoreNetwork",
    "Condition": {
        "StringLike": {
            "iam:AWSServiceName": "network.bedrock-agentcore.amazonaws.com"
        }
    }
}
```
**For the Identity service-linked role**

```json
{
    "Sid": "CreateBedrockAgentCoreRuntimeIdentityServiceLinkedRolePermissions",
    "Effect": "Allow",
    "Action": "iam:CreateServiceLinkedRole",
    "Resource": "arn:aws:iam::*:role/aws-service-role/runtime-identity.bedrock-agentcore.amazonaws.com/AWSServiceRoleForBedrockAgentCoreRuntimeIdentity",
    "Condition": {
        "StringEquals": {
            "iam:AWSServiceName": "runtime-identity.bedrock-agentcore.amazonaws.com"
        }
    }
}
```
**For the Gateway service-linked role**

```json
{
    "Effect": "Allow",
    "Action": "iam:CreateServiceLinkedRole",
    "Resource": "arn:aws:iam::*:role/aws-service-role/bedrock-agentcore.amazonaws.com/AWSServiceRoleForBedrockAgentCoreGatewayNetwork",
    "Condition": {
        "StringEquals": {
            "iam:AWSServiceName": "bedrock-agentcore.amazonaws.com"
        }
    }
}
```
**For the Identity Network service-linked role**

```json
{
    "Effect": "Allow",
    "Action": "iam:CreateServiceLinkedRole",
    "Resource": "arn:aws:iam::*:role/aws-service-role/identity-network.bedrock-agentcore.amazonaws.com/AWSServiceRoleForBedrockAgentCoreIdentity",
    "Condition": {
        "StringEquals": {
            "iam:AWSServiceName": "identity-network.bedrock-agentcore.amazonaws.com"
        }
    }
}
```
These permissions are already included in the AWS managed policy [BedrockAgentCoreFullAccess](<https://docs.aws.amazon.com/aws-managed-policy/latest/reference/BedrockAgentCoreFullAccess.html>).

## Editing a service-linked role for AgentCore

AgentCore does not allow you to edit the `AWSServiceRoleForBedrockAgentCoreNetwork` , `AWSServiceRoleForBedrockAgentCoreRuntimeIdentity` , `AWSServiceRoleForBedrockAgentCoreGatewayNetwork` , or `AWSServiceRoleForBedrockAgentCoreIdentity` service-linked roles. After you create a service-linked role, you cannot change the name of the role because various entities might reference the role. However, you can edit the description of the role using IAM. For more information, see [Editing a service-linked role](<https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html#edit-service-linked-role>).

## Deleting a service-linked role for AgentCore

If you no longer need to use a feature or service that requires a service-linked role, we recommend that you delete that role. That way you don’t have an unused entity that is not actively monitored or maintained. However, you must delete all your AgentCore resources that use the service-linked role before you can delete the role:

  * **Network service-linked role** : Delete all AgentCore Runtime, Code Interpreter, and Browser resources with VPC configuration

  * **Identity service-linked role** : Delete all AgentCore Runtime resources

  * **Gateway service-linked role** : Delete all AgentCore Gateway targets that use managed private endpoints ( `managedVpcResource` configuration)

  * **Identity Network service-linked role** : Delete all AgentCore Identity resources that use managed private endpoints for VPC hosted identity providers ( `managedVpcResource` configuration). This includes outbound OAuth credential providers and inbound JWT authorizer configurations (on AgentCore Runtime or Gateway).


### Cleaning up a service-linked role

Before you can use IAM to delete a service-linked role, you must first confirm that the role has no active sessions and remove any resources used by the role.

**To check whether the service-linked role has an active session in the IAM console**

  1. Sign in to the AWS Management Console and open the IAM console at [https://console.aws.amazon.com/iam/](<https://console.aws.amazon.com/iam/>).

  2. In the navigation pane of the IAM console, choose **Roles** , and then choose the name (not the check box) of the `AWSServiceRoleForBedrockAgentCoreNetwork` role.

  3. On the **Summary** page for the selected role, choose the **Access Advisor** tab.

  4. On the **Access Advisor** tab, review the recent activity for the service-linked role.


###### Note

If you are unsure whether AgentCore is using a service-linked role, you can try to delete the role. If the service is using the role, then the deletion fails and you can view the Regions where the role is being used. If the role is being used, then you must wait for the session to end before you can delete the role. You cannot revoke the session for a service-linked role.

If you want to remove a service-linked role, you must first delete the appropriate AgentCore resources:

  * `AWSServiceRoleForBedrockAgentCoreNetwork` : Delete all AgentCore Runtime, Code Interpreter, and Browser resources with VPC configuration

  * `AWSServiceRoleForBedrockAgentCoreRuntimeIdentity` : Delete all AgentCore Runtime resources

  * `AWSServiceRoleForBedrockAgentCoreGatewayNetwork` : Delete all AgentCore Gateway targets that use managed private endpoints. After all managed targets are deleted, AgentCore releases the managed VPC Lattice resource gateways that are no longer in use.

  * `AWSServiceRoleForBedrockAgentCoreIdentity` : Delete all AgentCore Identity resources that use managed private endpoints for VPC hosted identity providers. This includes outbound OAuth credential providers and inbound JWT authorizer configurations (on AgentCore Runtime or Gateway) that have a `managedVpcResource` private endpoint. After all managed private endpoint configurations are removed, AgentCore releases the managed VPC Lattice resource gateways that are no longer in use.


### Manually delete the service-linked role

Use the IAM console, the AWS CLI, or the IAM API to delete service-linked roles. For more information, see [Deleting a service-linked role](<https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html#delete-service-linked-role>).

