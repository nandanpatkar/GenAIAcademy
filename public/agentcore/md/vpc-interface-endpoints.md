# Use interface VPC endpoints (AWS PrivateLink) to create a private connection between your VPC and your Amazon Bedrock AgentCore resources - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/vpc-interface-endpoints.html

---

# Use interface VPC endpoints (AWS PrivateLink) to create a private connection between your VPC and your Amazon Bedrock AgentCore resources

You can use AWS PrivateLink to create a private connection between your VPC and Amazon Bedrock AgentCore. You can access AgentCore as if it were in your VPC, without the use of an internet gateway, NAT device, VPN connection, or Direct Connect connection. Instances in your VPC don’t need public IP addresses to access AgentCore.

You establish this private connection by creating an _interface endpoint_ , powered by AWS PrivateLink. We create an endpoint network interface in each subnet that you enable for the interface endpoint. These are requester-managed network interfaces that serve as the entry point for traffic destined for AgentCore.

For more information, see [Access AWS services through AWS PrivateLink](<https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-access-aws-services.html>) in the _AWS PrivateLink Guide_.

## Considerations for AgentCore

Before you set up an interface endpoint for AgentCore, review [Considerations](<https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html#considerations-interface-endpoints>) in the _AWS PrivateLink Guide_.

AgentCore provides three AWS PrivateLink endpoints:

  * **Data plane endpoint** \- `com.amazonaws.region.bedrock-agentcore`

  * **Control plane endpoint** \- `com.amazonaws.region.bedrock-agentcore-control`

  * **Gateway endpoint** \- `com.amazonaws.region.bedrock-agentcore.gateway`


The following table shows AWS PrivateLink support status for each AgentCore primitive:

Primitive | Data plane | Control plane  
---|---|---  
Runtime |  Supported |  Supported  
Memory |  Supported |  Supported  
Built-in Tools (Code Interpreter, Browser Tool) |  Supported |  Supported  
Identity |  Supported |  Supported  
Gateway |  Supported |  Supported  
Evaluations and Optimizations |  Supported |  Supported  
Policy |  Supported |  Supported  
  
For a list of AWS Regions in which AgentCore interface endpoints are available, see [Supported AWS Regions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agentcore-regions.html>).

###### Important

The data plane APIs support both AWS Signature Version 4 (SigV4) headers for authentication and Bearer Token (OAuth) authentication. VPC endpoint policies can only restrict callers based on IAM principals and not OAuth users. For OAuth-based requests to succeed through the VPC endpoint, the principal must be set to * in the endpoint policy. Otherwise, only SigV4 allowlisted callers can make successful calls over the VPC endpoint.

AWS IAM global condition context keys are supported. By default, full access to AgentCore is allowed through the interface endpoint. You can control access by attaching an endpoint policy to the interface endpoint or by associating a security group with the endpoint network interfaces.

## Create an interface endpoint for AgentCore

You can create an interface endpoint for AgentCore using either the Amazon VPC console or the AWS Command Line Interface (AWS CLI). For more information, see [Create an interface endpoint](<https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html#create-interface-endpoint-aws>) in the _AWS PrivateLink Guide_.

Create an interface endpoint for AgentCore using the following service name format:

  * All data plane primitives (Runtime, Built-in Tools, Memory, Identity): `com.amazonaws.region.bedrock-agentcore`

  * For AgentCore Gateway: `com.amazonaws.region.bedrock-agentcore.gateway`

  * For control plane operations (Runtime and Memory management): `com.amazonaws.region.bedrock-agentcore-control`


If you enable private DNS for the interface endpoint, you can make API requests to AgentCore using its default Regional DNS name. For example, `bedrock-agentcore.us-east-1.amazonaws.com`.

## Create an endpoint policy for your interface endpoint

An endpoint policy is an IAM resource that you can attach to an interface endpoint. The default endpoint policy allows full access to AgentCore through the interface endpoint. To control the access allowed to AgentCore from your VPC, attach a custom endpoint policy to the interface endpoint.

An endpoint policy specifies the following information:

  * The principals that can perform actions (AWS accounts, IAM users, and IAM roles).

    * For AgentCore Gateway, if your gateway ingress isn’t [AWS Signature Version 4 (SigV4)](<https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html>) -based (for example, if you use OAuth instead), you must specify the `Principal` field as the wildcard * . SigV4 -based authentication allows you to define the `Principal` as a specific AWS identity. This also applies to AgentCore Runtime.

  * The actions that can be performed.

  * The resources on which the actions can be performed.


For more information, see [Control access to services using endpoint policies](<https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html>) in the _AWS PrivateLink Guide_.

**Endpoint policies for various primitives**

The following examples show endpoint policies for different AgentCore components:

###### Example

Runtime
    

  1. The following endpoint policy allows specific IAM principals to invoke agent runtime resources.

```json
{
   "Statement": [
      {
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws::iam::ACCOUNT_ID:user/USERNAME"
         },
         "Action": [
            "bedrock-agentcore:InvokeAgentRuntime"
         ],
         "Resource": "arn:aws::bedrock-agentcore:us-east-1:ACCOUNT_ID:runtime/RUNTIME_ID"
      }
   ]
}
```
**Mixed IAM and OAuth authentication**

The `InvokeAgentRuntime` API supports two modes of VPC endpoint authorization. The following example policy allows both IAM principals and OAuth callers to access different agent runtime resources.

```json
{
   "Statement": [
      {
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws::iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:InvokeAgentRuntime"
         ],
         "Resource": "arn:aws::bedrock-agentcore:us-east-1:ACCOUNT_ID:runtime/customAgent1"
      },
      {
         "Effect": "Allow",
         "Principal": "*",
         "Action": [
            "bedrock-agentcore:InvokeAgentRuntime"
         ],
         "Resource": "arn:aws::bedrock-agentcore:us-east-1:ACCOUNT_ID:runtime/customAgent2"
      }
   ]
}
```
The above policy allows only the IAM principal to make `InvokeAgentRuntime` calls to `customAgent1` . It also allows both IAM principals and OAuth callers to make `InvokeAgentRuntime` calls to `customAgent2`.

**Protected Resource Metadata (PRM) endpoint policies**

The `GetRuntimeProtectedResourceMetadata` API implements [OAuth 2.0 Protected Resource Metadata (RFC 9728)](<https://datatracker.ietf.org/doc/html/rfc9728>). Clients call this endpoint _before_ they have credentials, to discover which authorization server protects a given agent runtime. This endpoint is unauthenticated by design, so the `Principal` must be set to * in the endpoint policy.

VPC endpoint policies are enforced on PRM requests. If your endpoint policy does not explicitly allow `bedrock-agentcore:GetRuntimeProtectedResourceMetadata` , PRM requests through that endpoint are denied with HTTP 403. Any OAuth-configured agent runtime accessed through a VPC endpoint requires PRM access for authorization server discovery.

###### Note

If you have a deny-all endpoint policy for data perimeter enforcement and do not use OAuth or JWT authentication, PRM requests are denied automatically. No additional configuration is needed.

The following endpoint policy allows any caller to discover the authorization server (PRM) while restricting runtime invocations to a specific IAM principal:

```json
{
   "Statement": [
      {
         "Sid": "AllowPRMDiscovery",
         "Effect": "Allow",
         "Principal": "*",
         "Action": [
            "bedrock-agentcore:GetRuntimeProtectedResourceMetadata"
         ],
         "Resource": "arn:aws:bedrock-agentcore:REGION:ACCOUNT_ID:runtime/*"
      },
      {
         "Sid": "AllowInvoke",
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws:iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:InvokeAgentRuntime"
         ],
         "Resource": "arn:aws:bedrock-agentcore:REGION:ACCOUNT_ID:runtime/RUNTIME_ID"
      }
   ]
}
```
To block cross-account PRM lookups through your VPC endpoint (data perimeter enforcement), scope the PRM allow statement to only your account’s runtimes:

```json
{
   "Statement": [
      {
         "Sid": "AllowPRMOwnAccountOnly",
         "Effect": "Allow",
         "Principal": "*",
         "Action": [
            "bedrock-agentcore:GetRuntimeProtectedResourceMetadata"
         ],
         "Resource": "arn:aws:bedrock-agentcore:REGION:ACCOUNT_ID:runtime/*"
      },
      {
         "Sid": "DenyCrossAccountPRM",
         "Effect": "Deny",
         "Principal": "*",
         "Action": [
            "bedrock-agentcore:GetRuntimeProtectedResourceMetadata"
         ],
         "NotResource": "arn:aws:bedrock-agentcore:REGION:ACCOUNT_ID:runtime/*"
      },
      {
         "Sid": "AllowInvoke",
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws:iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:InvokeAgentRuntime"
         ],
         "Resource": "arn:aws:bedrock-agentcore:REGION:ACCOUNT_ID:runtime/*"
      }
   ]
}
```
Code Interpreter Tool
    

  1. The following endpoint policy allows specific IAM principals to invoke Code Interpreter resources.

```json
{
   "Statement": [
      {
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws::iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:InvokeCodeInterpreter"
         ],
         "Resource": "arn:aws::bedrock-agentcore:us-east-1:ACCOUNT_ID:code-interpreter/CODE_INTERPRETER_ID"
      }
   ]
}
```
Memory
    

  1. ====== All data plane operations

The following endpoint policy allows specific IAM principals to access us-east-1 data plane operations for a specific AgentCore Memory.

```json
{
   "Statement": [
      {
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws::iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:CreateEvent",
            "bedrock-agentcore:DeleteEvent",
            "bedrock-agentcore:GetEvent",
            "bedrock-agentcore:ListEvents",
            "bedrock-agentcore:DeleteMemoryRecord",
            "bedrock-agentcore:GetMemoryRecord",
            "bedrock-agentcore:ListMemoryRecords",
            "bedrock-agentcore:RetrieveMemoryRecords",
            "bedrock-agentcore:ListActors",
            "bedrock-agentcore:ListSessions",
            "bedrock-agentcore:BatchCreateMemoryRecords",
            "bedrock-agentcore:BatchDeleteMemoryRecords",
            "bedrock-agentcore:BatchUpdateMemoryRecords"
         ],
         "Resource": "arn:aws::bedrock-agentcore:us-east-1:ACCOUNT_ID:memory/MEMORY_ID"
      }
   ]
}
```
**Access to all memories**

The following endpoint policy allows specific IAM principals access to all memories.

```json
{
   "Statement": [
      {
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws::iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:CreateEvent",
            "bedrock-agentcore:DeleteEvent",
            "bedrock-agentcore:GetEvent",
            "bedrock-agentcore:ListEvents",
            "bedrock-agentcore:DeleteMemoryRecord",
            "bedrock-agentcore:GetMemoryRecord",
            "bedrock-agentcore:ListMemoryRecords",
            "bedrock-agentcore:RetrieveMemoryRecords",
            "bedrock-agentcore:ListActors",
            "bedrock-agentcore:ListSessions",
            "bedrock-agentcore:BatchCreateMemoryRecords",
            "bedrock-agentcore:BatchDeleteMemoryRecords",
            "bedrock-agentcore:BatchUpdateMemoryRecords"
         ],
         "Resource": "arn:aws::bedrock-agentcore:us-east-1:ACCOUNT_ID:memory/*"
      }
   ]
}
```
**Access restriction by APIs**

The following endpoint policy grants permission for a specific IAM principal to create events in a specific AgentCore Memory resource.

```json
{
   "Statement": [
      {
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws::iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:CreateEvent"
         ],
         "Resource": "arn:aws::bedrock-agentcore:us-east-1:ACCOUNT_ID:memory/MEMORY_ID"
      }
   ]
}
```
Browser Tool
    

  1. The following endpoint policy allows specific IAM principals to connect to Browser Tool resources.

```json
{
   "Statement": [
      {
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws::iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:ConnectBrowserAutomationStream"
         ],
         "Resource": "arn:aws::bedrock-agentcore:us-east-1:ACCOUNT_ID:browser/BROWSER_ID"
      }
   ]
}
```
Gateway
    

  1. The following is an example of a custom endpoint policy. When you attach this policy to your interface endpoint, it allows all principals to invoke the gateway specified in the `Resource` field.

```json
{
   "Statement": [
      {
         "Effect": "Allow",
         "Principal": "*",
         "Action": [
            "bedrock:InvokeGateway"
         ],
         "Resource": "arn:aws::bedrock-agentcore:us-east-1::gateway/my-gateway"
      }
   ]
}
```
Identity
    

  1. The following endpoint policy allows access to Identity resources.

```json
{
   "Statement": [
      {
         "Effect": "Allow",
         "Principal": "*",
         "Action": [
            "*"
         ],
         "Resource": "arn:aws:bedrock-agentcore:us-east-1:ACCOUNT_ID:workload-identity-directory/default/workload-identity/WORKLOAD_IDENTITY_ID"
      }
   ]
}
```
Evaluations and Optimizations
    

  1. The following endpoint policy allows specific IAM principals to access Evaluations and Optimizations operations.

```json
{
   "Statement": [
      {
         "Sid": "AllowBatchEvaluations",
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws:iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:StartBatchEvaluation",
            "bedrock-agentcore:GetBatchEvaluation",
            "bedrock-agentcore:ListBatchEvaluations",
            "bedrock-agentcore:StopBatchEvaluation",
            "bedrock-agentcore:DeleteBatchEvaluation"
         ],
         "Resource": "arn:aws:bedrock-agentcore:us-east-1:ACCOUNT_ID:batch-evaluate/*"
      },
      {
         "Sid": "AllowRecommendations",
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws:iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:StartRecommendation",
            "bedrock-agentcore:GetRecommendation",
            "bedrock-agentcore:ListRecommendations",
            "bedrock-agentcore:DeleteRecommendation"
         ],
         "Resource": "arn:aws:bedrock-agentcore:us-east-1:ACCOUNT_ID:recommendation/*"
      },
      {
         "Sid": "AllowEvaluators",
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws:iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:CreateEvaluator",
            "bedrock-agentcore:GetEvaluator",
            "bedrock-agentcore:ListEvaluators",
            "bedrock-agentcore:UpdateEvaluator",
            "bedrock-agentcore:DeleteEvaluator"
         ],
         "Resource": "arn:aws:bedrock-agentcore:us-east-1:ACCOUNT_ID:evaluator/*"
      },
      {
         "Sid": "AllowOnlineEvaluationConfigs",
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws:iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:CreateOnlineEvaluationConfig",
            "bedrock-agentcore:GetOnlineEvaluationConfig",
            "bedrock-agentcore:ListOnlineEvaluationConfigs",
            "bedrock-agentcore:UpdateOnlineEvaluationConfig",
            "bedrock-agentcore:DeleteOnlineEvaluationConfig"
         ],
         "Resource": "arn:aws:bedrock-agentcore:us-east-1:ACCOUNT_ID:online-evaluation-config/*"
      },
      {
         "Sid": "AllowABTests",
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws:iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:CreateABTest",
            "bedrock-agentcore:GetABTest",
            "bedrock-agentcore:ListABTests",
            "bedrock-agentcore:UpdateABTest",
            "bedrock-agentcore:DeleteABTest"
         ],
         "Resource": "arn:aws:bedrock-agentcore:us-east-1:ACCOUNT_ID:ab-test/*"
      },
      {
         "Sid": "AllowConfigurationBundles",
         "Effect": "Allow",
         "Principal": {
            "AWS": "arn:aws:iam::ACCOUNT_ID:root"
         },
         "Action": [
            "bedrock-agentcore:CreateConfigurationBundle",
            "bedrock-agentcore:GetConfigurationBundle",
            "bedrock-agentcore:GetConfigurationBundleVersion",
            "bedrock-agentcore:ListConfigurationBundles",
            "bedrock-agentcore:ListConfigurationBundleVersions",
            "bedrock-agentcore:UpdateConfigurationBundle",
            "bedrock-agentcore:DeleteConfigurationBundle"
         ],
         "Resource": "arn:aws:bedrock-agentcore:us-east-1:ACCOUNT_ID:configuration-bundle/*"
      }
   ]
}
```
