# Resource-based policies for Amazon Bedrock AgentCore - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/resource-based-policies.html

---

# Resource-based policies for Amazon Bedrock AgentCore

Resource-based policies in Amazon Bedrock AgentCore allow you to control which principals (AWS accounts, IAM users, or IAM roles) can invoke and manage your Amazon Bedrock AgentCore resources (currently supported for Runtime, Gateway and Memory). You can attach IAM-style policies directly to your resources to define rules around who can start runtime sessions, invoke a gateway, access memory or perform other management and invocation actions.

Resource-based policies work in conjunction with identity-based IAM policies to provide access control for your Amazon Bedrock AgentCore resources. While identity-based policies are attached to IAM identities and specify what actions they can perform, resource-based policies are attached directly to resources and specify who can access them.

###### Topics

  * Supported resources

  * How resource-based policies work

  * Policy structure

  * Supported actions

  * Condition keys

  * Common use cases and examples

  * Managing resource policies

  * Security best practices

  * Troubleshooting


## Supported resources

Amazon Bedrock AgentCore supports resource-based policies for the following resources:

  * **Agent Runtime and Agent Endpoints** \- Control access to agent invocation and management operations

  * **Gateway** \- Control access to gateway invocation operations

  * **Memory** \- Control access to memory operations


## How resource-based policies work

### Identity-based vs resource-based policies

Aspect | Identity-Based Policy | Resource-Based Policy  
---|---|---  
Attachment |  Attached to IAM users, roles, or groups |  Attached directly to Amazon Bedrock AgentCore resources  
Management |  Managed through AWS IAM |  Managed through Amazon Bedrock AgentCore APIs  
Specifies |  Actions and Resources (Principal is implicit) |  Principals, Actions, and Conditions (Resource is implicit)  
Use Case |  Define what an identity can do |  Define who can access a resource  
  
### Policy evaluation

When a request is made to a Amazon Bedrock AgentCore resource, AWS evaluates both identity-based and resource-based policies. The following table shows how different policy combinations affect access:

IAM Policy | Resource Policy | Result  
---|---|---  
Grants access |  Silent |  Allowed  
Grants access |  Grants access |  Allowed  
Grants access |  Denies access |  Denied  
Silent |  Silent |  Denied  
Silent |  Grants access |  Allowed  
Silent |  Denies access |  Denied  
Denies access |  Silent |  Denied  
Denies access |  Allows access |  Denied  
Denies access |  Denies access |  Denied  
  
Key principles:

  * **Explicit Deny Always Wins** : If any policy explicitly denies the action, access is denied regardless of other policies

  * **Either Policy Can Allow** : If either identity-based or resource-based policy allows the action (and no policy denies it), access is granted

  * **Default Deny** : If no policy explicitly permits an action, access is denied


### Hierarchical authorization for agent runtime and endpoint

Agent endpoints are addressable access points to specific versions of an agent runtime. Each endpoint points to a particular version of the runtime configuration, with a DEFAULT endpoint automatically routing to the latest version. When authorizing runtime API operations such as `InvokeAgentRuntime` and `InvokeAgentRuntimeCommand` , AWS evaluates both identity-based and resource-based policies for both the agent runtime and the agent endpoint being invoked.

For a request to be authorized, the following conditions must be met:

  * The identity-based policies attached to the calling principal must allow the action on both the agent runtime and agent endpoint resources

  * The resource-based policy on the agent runtime must allow the action (if a policy exists)

  * The resource-based policy on the agent endpoint must allow the action (if a policy exists)


###### Important

To provide cross-account access to a principal, you must create resource-based policies granting access for **both** the agent runtime and the agent endpoint. If either resource denies access or lacks an explicit allow statement, the request will be denied.

Example: Granting cross-account access requires policies on both resources:

```text
// Policy for Agent Runtime (attached to
// arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID)
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:role/CrossAccountRole"
            },
            "Action": "bedrock-agentcore:InvokeAgentRuntime",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID"
        }
    ]
}

// Policy for Agent Endpoint (attached to
// arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID/endpoint/ENDPOINTID)
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:role/CrossAccountRole"
            },
            "Action": "bedrock-agentcore:InvokeAgentRuntime",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID/endpoint/ENDPOINTID"
        }
    ]
}
```
### Authentication type considerations

The way you write resource-based policies depends on the authentication type configured for your Agent Runtime or Gateway:

SigV4 Authentication
    

Use specific AWS principals (IAM users, roles, or accounts) in the `Principal` element. For example: `"Principal": {"AWS": "arn:aws:iam::123456789012:role/MyRole"}` . The policy is evaluated in conjunction with the caller’s IAM permissions. For an example that restricts a runtime to only be invoked by an AgentCore Gateway, see [Restrict IAM (SigV4) inbound invocation to your gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-oauth.html#runtime-restrict-iam-gateway>).

OAuth Authentication
    

Must use wildcard principal ( "Principal": "*" ) in policy statements. OAuth tokens are validated by AWS Identity Service before policy evaluation. Only authenticated OAuth users with valid JWT tokens from the registered Identity Provider (IdP) can invoke the resource. Anonymous or unauthenticated requests are rejected before policy evaluation. Use condition keys to restrict access (e.g., `aws:SourceVpc` , `aws:SourceVpce` ).

###### Important

An Agent Runtime or Gateway can only be configured with either SigV4 OR OAuth authentication at creation time, not both simultaneously. This means a single resource-based policy applies to only one authentication type.

## Policy structure

A resource-based policy is a JSON document with the following structure:

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "StatementId",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::account-id:role/role-name"
            },
            "Action": "bedrock-agentcore:ActionName",
            "Resource": "arn:aws:bedrock-agentcore:region:account-id:resource-type/resource-id",
            "Condition": {
                "ConditionOperator": {
                    "ConditionKey": "ConditionValue"
                }
            }
        }
    ]
}
```
###### Important

The `Resource` field in the policy document must contain the exact ARN of the resource to which the policy is attached. Using "Resource": "*" is not supported and will result in a validation error.

## Supported actions

### Agent Runtime actions

  * `bedrock-agentcore:InvokeAgentRuntime` \- Invoke an agent runtime

  * `bedrock-agentcore:InvokeAgentRuntimeForUser` \- Invoke an agent runtime endpoint with X-Amzn-Bedrock-AgentCore-Runtime-User-Id header

  * `bedrock-agentcore:InvokeAgentRuntimeCommand` \- Execute a shell command in an active runtime session

  * `bedrock-agentcore:InvokeAgentRuntimeCommandShell` \- Open an interactive WebSocket shell session in an active runtime session

  * `bedrock-agentcore:InvokeAgentRuntimeWithWebSocketStream` \- Invoke an agent runtime with WebSocket stream

  * `bedrock-agentcore:InvokeAgentRuntimeWithWebSocketStreamForUser` \- Invoke an agent runtime with WebSocket stream with X-Amzn-Bedrock-AgentCore-Runtime-User-Id header

  * `bedrock-agentcore:StopRuntimeSession` \- Stop an active runtime session

  * `bedrock-agentcore:GetAgentCard` \- Retrieve agent card information


### Gateway actions

  * `bedrock-agentcore:InvokeGateway` \- Invoke a gateway


### Memory actions

  * `bedrock-agentcore:GetMemory` \- Retrieve a Memory resource

  * `bedrock-agentcore:UpdateMemory` \- Update a Memory resource

  * `bedrock-agentcore:DeleteMemory` \- Delete a Memory resource

  * `bedrock-agentcore:CreateEvent` \- Create an event in a Memory resource

  * `bedrock-agentcore:GetEvent` \- Retrieve an event from a Memory resource

  * `bedrock-agentcore:DeleteEvent` \- Delete an event from a Memory resource

  * `bedrock-agentcore:ListEvents` \- List Events from a Memory resource

  * `bedrock-agentcore:ListActors` \- List actors from a Memory resource

  * `bedrock-agentcore:ListSessions` \- List sessions from a Memory resource

  * `bedrock-agentcore:GetMemoryRecord` \- Get a memory record from a Memory resource

  * `bedrock-agentcore:ListMemoryRecords` \- List memory records from a Memory resource

  * `bedrock-agentcore:RetrieveMemoryRecords` \- Search memory records from a Memory resource

  * `bedrock-agentcore:DeleteMemoryRecord` \- Delete a memory record from a Memory resource

  * `bedrock-agentcore:BatchCreateMemoryRecords` \- Batch create memory records in a Memory resource

  * `bedrock-agentcore:BatchUpdateMemoryRecords` \- Batch update memory records in a Memory resource

  * `bedrock-agentcore:BatchDeleteMemoryRecords` \- Batch delete memory records in a Memory resource

  * `bedrock-agentcore:StartMemoryExtractionJob` \- Start an extraction job within a Memory Resource

  * `bedrock-agentcore:ListMemoryExtractionJobs` \- List extraction jobs within a Memory Resource


## Condition keys

You can use condition keys to further refine access control in your policies. For a complete list of available condition keys, see [Bedrock AgentCore Condition Keys](<https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrockagentcore.html>) and [AWS Global Condition Context Keys](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html>).

## Common use cases and examples

This section provides practical examples of resource-based policies for common scenarios. The `Resource` field in each example must contain the exact ARN of the resource to which the policy is attached. Replace the example ARNs with your actual resource ARNs.

### Allow roles in another AWS account

Grant API access to specific roles in a different AWS account:

```text
// Policy attached to arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "arn:aws:iam::123456789012:role/DeveloperRole",
                    "arn:aws:iam::123456789012:role/AdminRole"
                ]
            },
            "Action": "bedrock-agentcore:InvokeAgentRuntime",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID"
        }
    ]
}
```
### Deny traffic based on source IP address

Block incoming traffic from specific IP address ranges:

```text
// Policy attached to arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:role/ApplicationRole"
            },
            "Action": "bedrock-agentcore:InvokeAgentRuntime",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID"
        },
        {
            "Effect": "Deny",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:role/ApplicationRole"
            },
            "Action": "bedrock-agentcore:InvokeAgentRuntime",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID",
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": [
                        "192.0.2.0/24",
                        "198.51.100.0/24"
                    ]
                }
            }
        }
    ]
}
```
### Allow traffic only from specific VPC

Restrict access to requests from a specific VPC:

```text
// Policy attached to arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:role/ApplicationRole"
            },
            "Action": "bedrock-agentcore:InvokeAgentRuntime",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID"
        },
        {
            "Effect": "Deny",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:role/ApplicationRole"
            },
            "Action": "bedrock-agentcore:InvokeAgentRuntime",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID",
            "Condition": {
                "StringNotEquals": {
                    "aws:SourceVpc": "vpc-1a2b3c4d"
                }
            }
        }
    ]
}
```
### OAuth authentication with VPC restriction

When your Agent Runtime or Gateway is configured with OAuth authentication, you must use a wildcard principal. This example restricts OAuth-authenticated requests to a specific VPC:

```text
// Policy attached to arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowOAuthFromVPC",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "bedrock-agentcore:InvokeAgentRuntime",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID",
            "Condition": {
                "StringEquals": {
                    "aws:SourceVpc": "vpc-1a2b3c4d"
                }
            }
        }
    ]
}
```
###### Important

The wildcard principal ( "Principal": "*" ) is **required** for OAuth authentication. OAuth tokens are validated by AWS Identity Service before policy evaluation. Only users with valid JWT tokens from your registered Identity Provider can access the resource. Anonymous or unauthenticated requests are rejected before reaching policy evaluation. Use condition keys (like `aws:SourceVpc` , `aws:SourceVpce` ) to further restrict access

## Managing resource policies

Select one of the following methods:

###### Example

AWS CLI
    

  1. ====== Create or update a resource policy

Use the `put-resource-policy` command:

```bash
aws bedrock-agentcore-control put-resource-policy \
    --resource-arn arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID \
    --policy file://policy.json
```
**Get a resource policy**

Use the `get-resource-policy` command:

```bash
aws bedrock-agentcore-control get-resource-policy \
    --resource-arn arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID
```
**Delete a resource policy**

Use the `delete-resource-policy` command:

```bash
aws bedrock-agentcore-control delete-resource-policy \
    --resource-arn arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID
```
Python (Boto3)
    

  1. The following examples show how to manage resource policies using the AWS Python SDK (Boto3):

```python
import boto3
import json

client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

# Define the resource ARN
resource_arn = 'arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID'

# Put resource policy
# Note: The Resource field must match the resource ARN to which the policy is attached
policy = {
"Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": "arn:aws:iam::123456789012:role/MyRole"},
            "Action": "bedrock-agentcore:InvokeAgentRuntime",
            "Resource": resource_arn
        }
    ]
}

response = client.put_resource_policy(
    resourceArn=resource_arn,
    policy=json.dumps(policy)
)

# Get resource policy
response = client.get_resource_policy(
    resourceArn='arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID'
)
print(response['policy'])

# Delete resource policy
response = client.delete_resource_policy(
    resourceArn='arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID'
)
```
## Security best practices

### Grant least privilege

Grant only the minimum permissions necessary for your use case:

```text
// Policy attached to arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::111122223333:role/ApplicationRole"
            },
            "Action": "bedrock-agentcore:InvokeAgentRuntime",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID"
        }
    ]
}
```
### Prevent confused deputy

Always use condition keys when granting access to AWS services:

```text
// Policy attached to arn:aws:bedrock-agentcore:us-west-2:111122223333:gateway/GATEWAYID
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "bedrock-agentcore:InvokeGateway",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:111122223333:gateway/GATEWAYID",
            "Condition": {
                "StringEquals": {
                    "aws:SourceAccount": "111122223333"
                },
                "ArnEquals": {
                    "aws:SourceArn": "arn:aws:lambda:us-west-2:111122223333:function/SpecificFunction"
                }
            }
        }
    ]
}
```
### Use explicit deny for critical controls

Use explicit deny statements for security-critical restrictions:

```text
// Policy attached to arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DenyAllExceptVPC",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "bedrock-agentcore:InvokeAgentRuntime",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENTID",
            "Condition": {
                "StringNotEquals": {
                    "aws:SourceVpc": "vpc-12345678"
                },
                "Bool": {
                    "aws:ViaAWSService": "false"
                }
            }
        }
    ]
}
```
## Troubleshooting

### Access denied errors

If you receive an "Access Denied" error:

  * **Check both policies** : Verify both identity-based and resource-based policies

  * **Look for explicit denies** : An explicit deny in any policy overrides all allows

  * **Verify principal ARN** : Ensure the principal ARN in the policy matches the caller

  * **Check conditions** : Verify all condition keys evaluate to true

  * **Review SCPs** : Organization service control policies can override resource policies


### Policy validation errors

Common policy validation errors:

  * **Invalid JSON** : Ensure your policy is valid JSON

  * **Invalid ARN format** : Verify all ARNs follow the correct format

  * **Unsupported actions** : Check that all actions are supported for the resource type

  * **Missing required elements** : Ensure Version, Statement, Effect, Principal, and Action are present



