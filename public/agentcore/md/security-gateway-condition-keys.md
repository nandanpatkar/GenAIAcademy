# Use IAM condition keys with Amazon Bedrock AgentCore Gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-gateway-condition-keys.html

---

# Use IAM condition keys with Amazon Bedrock AgentCore Gateway

Use Amazon Bedrock AgentCore-specific condition keys to control how you create and configure gateways and gateway targets in your organization. These condition keys apply to control plane operations. They are especially useful in Service Control Policies (SCPs) to enforce organizational security requirements.

For example, you can:

  * Require that all gateways use a specific identity provider for authentication.

  * Restrict what types of targets can be created.

  * Enforce that targets use specific credential provider types.

  * Require that gateway targets connect through approved subnets and security groups.


## Gateway condition keys

The following condition keys apply to the `CreateGateway` and `UpdateGateway` operations.

Condition key | Type | API operations | Description  
---|---|---|---  
`bedrock-agentcore:DiscoveryUrl` |  String |  `CreateGateway`, `UpdateGateway` |  Filters access by the discovery URL configured on the gateway. Use this to ensure gateways use a specific identity provider.  
`bedrock-agentcore:KmsKeyArn` |  String |  `CreateGateway`, `UpdateGateway` |  Filters access by the KMS key ARN used to encrypt gateway resources.  
`bedrock-agentcore:PolicyEngineArn` |  String |  `CreateGateway`, `UpdateGateway` |  Filters access by the ARN of the policy engine configuration associated with the gateway.  
`bedrock-agentcore:PolicyEngineMode` |  String |  `CreateGateway`, `UpdateGateway` |  Filters access by the mode of the policy engine configuration associated with the gateway.  
`bedrock-agentcore:ProtocolType` |  String |  `CreateGateway`, `UpdateGateway` |  Filters access by the protocol type of the gateway.  
`bedrock-agentcore:GatewayAuthorizerType` |  String |  `CreateGateway`, `UpdateGateway` |  Filters access by the authorizer type configured on the gateway. Valid values are `AWS_IAM`, `CUSTOM_JWT`, and `NONE`.  
  
## Gateway target condition keys

The following condition keys apply to the `CreateGatewayTarget` and `UpdateGatewayTarget` operations.

Condition key | Type | API operations | Description  
---|---|---|---  
`bedrock-agentcore:McpTargetConfigurationType` |  String |  `CreateGatewayTarget`, `UpdateGatewayTarget` |  Filters access by the type of an MCP target. Valid values include `apiGateway`, `lambda`, `mcpServer`, `openApiSchema`, `smithyModel`, and `connector`.  
`bedrock-agentcore:HttpTargetConfigurationType` |  String |  `CreateGatewayTarget`, `UpdateGatewayTarget` |  Filters access by the type of an HTTP target. Valid values include `agentcoreRuntime` and `passthrough`.  
`bedrock-agentcore:InferenceTargetConfigurationType` |  String |  `CreateGatewayTarget`, `UpdateGatewayTarget` |  Filters access by the type of an inference target. Valid values include `connector` and `provider`.  
`bedrock-agentcore:CredentialProviderType` |  String |  `CreateGatewayTarget`, `UpdateGatewayTarget` |  Filters access by the credential provider type configured on the target. Valid values include `GATEWAY_IAM_ROLE`, `OAUTH`, `API_KEY`, `CALLER_IAM_CREDENTIALS`, and `JWT_PASSTHROUGH`.  
`bedrock-agentcore:PrivateEndpointType` |  String |  `CreateGatewayTarget`, `UpdateGatewayTarget` |  Filters access by the private endpoint type of a target. Valid values include `managedVpcResource` and `selfManagedLatticeResource`.  
`bedrock-agentcore:ResourceConfigurationIdentifier` |  String |  `CreateGatewayTarget`, `UpdateGatewayTarget` |  Filters access by the resource configuration identifier of a target’s private endpoint.  
`bedrock-agentcore:subnets` |  ArrayOfString |  `CreateGatewayTarget`, `UpdateGatewayTarget` |  Filters access by the subnets configured for the managed VPC resource of a target. See [Use IAM condition keys with AgentCore VPC settings](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security-vpc-condition.html>).  
`bedrock-agentcore:securityGroups` |  ArrayOfString |  `CreateGatewayTarget`, `UpdateGatewayTarget` |  Filters access by the security groups configured for the managed VPC resource of a target.  
`bedrock-agentcore:AllowedQueryParameters` |  ArrayOfString |  `CreateGatewayTarget`, `UpdateGatewayTarget` |  Filters access by the allowed query parameters in the target’s metadata configuration.  
`bedrock-agentcore:AllowedRequestHeaders` |  ArrayOfString |  `CreateGatewayTarget`, `UpdateGatewayTarget` |  Filters access by the allowed request headers in the target’s metadata configuration.  
`bedrock-agentcore:AllowedResponseHeaders` |  ArrayOfString |  `CreateGatewayTarget`, `UpdateGatewayTarget` |  Filters access by the allowed response headers in the target’s metadata configuration.  
`bedrock-agentcore:CredentialProviderScope` |  ArrayOfString |  `CreateGatewayTarget`, `UpdateGatewayTarget` |  Filters access by the scopes configured on an OAuth credential provider for the target.  
  
## Example policies

The following examples show how to use condition keys in IAM policies and SCPs to enforce organizational controls on gateway configuration.

### Require gateways to use a specific identity provider

Use the following SCP to deny gateway creation or updates when the gateway does not use your organization’s approved identity provider discovery URL.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "EnforceGatewayIdP",
            "Effect": "Deny",
            "Action": [
                "bedrock-agentcore:CreateGateway",
                "bedrock-agentcore:UpdateGateway"
            ],
            "Resource": "*",
            "Condition": {
                "StringNotEquals": {
                    "bedrock-agentcore:DiscoveryUrl": "https://login.example.com/.well-known/openid-configuration"
                }
            }
        }
    ]
}
```
### Restrict credential provider types for targets

Use the following SCP to restrict gateway targets to approved credential provider types. With this example, you restrict gateway targets to use only the gateway’s IAM role or caller IAM credentials. Targets cannot use externally managed API keys or OAuth tokens.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "RestrictTargetCredentialTypes",
            "Effect": "Deny",
            "Action": [
                "bedrock-agentcore:CreateGatewayTarget",
                "bedrock-agentcore:UpdateGatewayTarget"
            ],
            "Resource": "*",
            "Condition": {
                "StringNotEquals": {
                    "bedrock-agentcore:CredentialProviderType": [
                        "GATEWAY_IAM_ROLE",
                        "CALLER_IAM_CREDENTIALS"
                    ]
                }
            }
        }
    ]
}
```
### Restrict the types of MCP targets that can be created

Use the following policy to deny creation of MCP targets that use certain configuration types. This example prevents targets from using direct MCP server URLs.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DenyDirectMcpServerTargets",
            "Effect": "Deny",
            "Action": [
                "bedrock-agentcore:CreateGatewayTarget",
                "bedrock-agentcore:UpdateGatewayTarget"
            ],
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "bedrock-agentcore:McpTargetConfigurationType": "mcpServer"
                }
            }
        }
    ]
}
```
### Require targets to use private endpoints

Use the following SCP to deny creation of targets that do not specify a private endpoint type. This ensures that all target traffic stays within private networks.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "EnforcePrivateEndpoints",
            "Effect": "Deny",
            "Action": [
                "bedrock-agentcore:CreateGatewayTarget",
                "bedrock-agentcore:UpdateGatewayTarget"
            ],
            "Resource": "*",
            "Condition": {
                "Null": {
                    "bedrock-agentcore:PrivateEndpointType": "true"
                }
            }
        }
    ]
}
```
### Require gateways to use a customer managed KMS key

Use this SCP to require that all gateways use a customer managed KMS key for encryption instead of the service default.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "EnforceCustomerManagedKey",
            "Effect": "Deny",
            "Action": [
                "bedrock-agentcore:CreateGateway",
                "bedrock-agentcore:UpdateGateway"
            ],
            "Resource": "*",
            "Condition": {
                "Null": {
                    "bedrock-agentcore:KmsKeyArn": "true"
                }
            }
        }
    ]
}
```
### Enforce approved subnets for gateway targets

Use the following policy to restrict gateway targets to approved subnets. For more information, see [Use IAM condition keys with AgentCore VPC settings](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security-vpc-condition.html>).

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "EnforceApprovedSubnets",
            "Effect": "Deny",
            "Action": [
                "bedrock-agentcore:CreateGatewayTarget",
                "bedrock-agentcore:UpdateGatewayTarget"
            ],
            "Resource": "*",
            "Condition": {
                "ForAnyValue:StringNotEquals": {
                    "bedrock-agentcore:subnets": [
                        "subnet-0123456789abcdef0",
                        "subnet-0123456789abcdef1"
                    ]
                }
            }
        }
    ]
}
```
