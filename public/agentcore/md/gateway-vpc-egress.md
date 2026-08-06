# Configure Amazon Bedrock AgentCore Gateway VPC Egress for Gateway Targets - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-vpc-egress.html

---

# Configure Amazon Bedrock AgentCore Gateway VPC Egress for Gateway Targets

The AgentCore Gateway service provides secure and controlled egress traffic management for your applications, enabling seamless communication with resources within your Virtual Private Cloud (VPC). This document outlines how egress traffic flows through the AgentCore Gateway to reach VPC resources. You’ll learn about the supported gateway target types (Lambda, API Gateway, and MCP servers via AgentCore Runtime), their configuration requirements, and the authentication methods supported for each target type. This guide covers the security considerations, routing mechanisms, and best practices needed to enable proper egress traffic flow while maintaining network isolation and following the principle of least privilege throughout your architecture.

## MCP

AgentCore Gateway supports Model Context Protocol (MCP) servers as target endpoints, providing flexible deployment options to meet various customer requirements. MCP servers can be configured in multiple ways depending on your infrastructure needs and security requirements.

Your MCP targets could be of two types, not hosted on AgentCore, or hosted on AgentCore Runtime or Gateway. We discuss both below.

### MCPs not hosted on AgentCore

AgentCore Gateway supports connecting to self-hosted MCP servers running inside your VPC using private endpoints powered by Amazon VPC Lattice. You can configure a `privateEndpoint` on your gateway target to route traffic privately to your MCP server without exposing it to the public internet.

The following example creates a private MCP server target using managed Lattice:

```json
{
  "name": "my-private-mcp-target",
  "privateEndpoint": {
    "managedVpcResource": {
      "vpcIdentifier": "vpc-0abc123def456",
      "subnetIds": ["subnet-0abc123", "subnet-0def456"],
      "endpointIpAddressType": "IPV4",
      "securityGroupIds": ["sg-0abc123def"]
    }
  },
  "targetConfiguration": {
    "mcp": {
      "mcpServer": {
        "endpoint": "https://my-mcp-server.internal.example.com/mcp"
      }
    }
  }
}
```
If you want to route traffic through an intermediate component such as a VPC endpoint or internal load balancer, you can specify a `routingDomain` . For more information, see [Route traffic through an intermediate domain](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html#lattice-vpc-egress-routing-domain>).

If your MCP server uses a TLS certificate issued by a private certificate authority, you can place an internal Application Load Balancer with a public ACM certificate in front of it. For more information, see [Workaround for private certificates: ALB](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html#lattice-vpc-egress-private-certs>).

For self-managed Lattice, cross-account setups, and advanced configurations, see [Connect to private resources in your VPC using VPC Lattice](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html>).

### AgentCore Runtime or Gateway

AgentCore Runtime provides native support for communicating with resources within your VPC through a managed infrastructure approach. All communication between AgentCore Gateway and AgentCore Runtime stays on the AWS backbone, ensuring your data never traverses the public internet (except for cross-region calls to China datacenters). For more information, see the [Connectivity](<https://aws.amazon.com/vpc/faqs/#connectivity>) section in the Amazon VPC FAQs. For detailed setup instructions on connecting AgentCore Runtime to your VPC, refer to the [Configure Amazon Bedrock AgentCore Runtime and tools for VPC](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-vpc.html>)

For outbound authorization from AgentCore Gateway to AgentCore Runtime, two authentication methods are supported: no authorization (not recommended for production use) and OAuth with client credentials grant (for machine-to-machine authentication). When no authorization is configured, the request from AgentCore Gateway to AgentCore Runtime has no auth tokens. This architecture provides a seamless connection pathway while maintaining security isolation. As a security best practice, configure restrictive authentication and authorization permissions for both AgentCore Runtime and AgentCore Gateway, limiting access to only the necessary resources and operations required for your specific use case. To configure an OAuth Identity to be used by AgentCore Gateway for egress and ingress for AgentCore Runtime use the following documents:

  * [Configure an OAuth client](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-oauth-client.html>)

  * [Specify the authorization type and credentials to access the gateway target](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building-adding-targets-authorization.html>)

  * [Authenticate and authorize with Inbound Auth and Outbound Auth](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-oauth.html>)


![Architecture diagram showing AgentCore Gateway cannot connect to Private Link endpoint.](/agentcore/images/gateway-runtime-vpc-access.png)

**Example CreateGatewayTarget with AgentCore Runtime as a the target**

The following example shows how to create a gateway target with AgentCore Runtime:

```text
POST /gateways/gatewayIdentifier/targets/ HTTP/1.1
Content-type: application/json

    {
    "clientToken": "string",
    "credentialProviderConfigurations": [
      {
         "credentialProvider": {
            "oauthCredentialProvider": {
               "providerArn": "string",
               "scopes": [ "string" ],
               ...
            }
         },
         "credentialProviderType": "OAUTH"
      }
    ],
    "description": "string",
    "metadataConfiguration": {
      "allowedQueryParameters": [ "string" ],
      "allowedRequestHeaders": [ "string" ],
      "allowedResponseHeaders": [ "string" ]
    },
    "name": "string",
    "targetConfiguration": {
      "mcp": {
         "mcpServer": {
            "endpoint": "https://bedrock-agentcore.<region>.amazonaws.com/runtimes/<runtime-id>/invocations?qualifier=DEFAULT&accountId=<account-id>"
         }
      }
    }
}
```
###### Note

Avoid using a VPC endpoint (VPCE) URL with `privateEndpoint` to prevent an unnecessary extra network hop. Use the direct AgentCore Runtime endpoint instead, with which traffic remains on the AWS backbone.

## Open API target

### API Gateway endpoint via Open API Target

If your API Gateway can’t be directly added as a target, you can always export the resource as an OpenAPI spec and import the spec into AgentCore Gateway as a OpenAPI target.

  * [Export a REST API from API Gateway](<https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-export-api.html>)

  * [OpenAPI schema targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-schema-openapi.html>)


If you have Private REST APIs in API Gateway, follow the instructions here: Private REST APIs in API Gateway.

### Other endpoints

You can configure Open API targets to reach private endpoints inside your VPC using the `privateEndpoint` configuration. AgentCore Gateway uses Amazon VPC Lattice to establish private connectivity to your endpoint without exposing it to the public internet.

The following example creates a private OpenAPI target using managed Lattice:

```json
{
  "name": "my-private-openapi-target",
  "privateEndpoint": {
    "managedVpcResource": {
      "vpcIdentifier": "vpc-0abc123def456",
      "subnetIds": ["subnet-0abc123", "subnet-0def456"],
      "endpointIpAddressType": "IPV4",
      "securityGroupIds": ["sg-0abc123def"]
    }
  },
  "targetConfiguration": {
    "mcp": {
      "openApiSchema": {
        "inlinePayload": "<your OpenAPI spec JSON with server URL pointing to your private endpoint>"
      }
    }
  }
}
```
If you want to route traffic through an intermediate component such as a VPC endpoint or internal load balancer, you can specify a `routingDomain` . For more information, see [Route traffic through an intermediate domain](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html#lattice-vpc-egress-routing-domain>).

If your endpoint uses a TLS certificate issued by a private certificate authority, you can place an internal Application Load Balancer with a public ACM certificate in front of it. For more information, see [Workaround for private certificates: ALB](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html#lattice-vpc-egress-private-certs>).

For self-managed Lattice, cross-account setups, and advanced configurations, see [Connect to private resources in your VPC using VPC Lattice](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html>).

###### Note

The `privateEndpoint` configuration applies to a single domain in your OpenAPI schema. If your schema references multiple server endpoints with different domains, open an [AWS Support case](<https://console.aws.amazon.com/support/home>) to request support for `privateEndpointOverrides`.

## Smithy target

Private endpoint ( `privateEndpoint` ) configuration is not currently supported for Smithy targets. If your Smithy target requires private connectivity, open an [AWS Support case](<https://console.aws.amazon.com/support/home>) to request support.

## API Gateway

AgentCore Gateway supports API Gateway as a target type, which can serve as an intermediary layer for accessing VPC resources. AgentCore Gateway specifically supports REST API Gateways configured with regional endpoints only. While direct VPC communication from the Gateway is not currently available (this feature is planned for future release), the gateway communicates with API Gateway over the AWS backbone, ensuring that traffic never traverses the public internet (except for cross-region calls to China datacenters). The API Gateway can then communicate with resources using VPC Link, creating a secure pathway for the AgentCore Gateway to reach internal services while maintaining network isolation.

To implement security best practices, configure your API Gateway to restrict inbound traffic exclusively to the AgentCore Gateway service principal or the configured API key, preventing unauthorized access from other sources. For outbound authorization from AgentCore Gateway to API Gateway, only two authentication methods are supported: IAM-based authentication (using the gateway service role to authenticate with AWS Signature Version 4) and API key authentication (managed by AgentCore Gateway); OAuth-based authorization and Cross Account API Gateways are not supported for API Gateway targets, please use API Gateway endpoint via Open API Target for those. Limit the AgentCore Gateway execution role permissions to invoke only the specific API Gateway endpoint required, rather than granting broad API Gateway access, ensuring that the gateway cannot interact with unintended API resources and maintaining the principle of least privilege throughout your architecture.

[Amazon API Gateway REST API stages as targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-api-gateway.html>)

### Permissions for API Gateway integration using IAM Auth

**API Gateway Resource Policy Locked Down to AgentCore Gateway**

The following resource policy restricts API Gateway access to AgentCore Gateway:

```json
{
"Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "bedrock-agentcore.amazonaws.com"
        },
        "Action": "execute-api:Invoke",
        "Resource": [
          "arn:aws:execute-api:us-west-2:111122223333:rest-api-id/api-stage/*/*"
        ],
        "Condition": {
          "ArnEquals": {
            "aws:SourceArn": "arn:aws:bedrock-agentcore:us-west-2:111122223333:gateway/my-gateway-d4jrgkaske"
          }
        }
      }
    ]
}
```
**AgentCore Gateway Execution Role policy**

The following policy grants the gateway permission to invoke the API Gateway:

```json
{
"Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "execute-api:Invoke"
        ],
        "Resource": [
          "arn:aws:execute-api:us-west-2:111122223333:abcd123/prod/*/*"
        ]
      }
    ]
}
```
**AgentCore Gateway Execution Role trust policy**

The following trust policy allows AgentCore Gateway to assume the execution role:

```json
{
"Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "bedrock-agentcore.amazonaws.com"
        },
        "Action": "sts:AssumeRole",
        "Condition": {
          "StringEquals": {
            "aws:SourceAccount": "111122223333"
          },
          "ArnLike": {
            "aws:SourceArn": "arn:aws:bedrock-agentcore:us-west-2:111122223333:gateway/*"
          }
        }
      }
    ]
}
```
#### Private REST APIs in API Gateway

API Gateway targets with private endpoints are not natively supported. However, you can export your private API Gateway as an OpenAPI schema and use an Open API target with that schema, configured with a `privateEndpoint` . Set the `routingDomain` to your API Gateway VPC endpoint (VPCE) DNS name, and ensure the OpenAPI schema server URL uses the domain that matches your public TLS certificate.

```json
{
  "name": "my-private-apigw-target",
  "privateEndpoint": {
    "managedVpcResource": {
      "vpcIdentifier": "vpc-0123456789abcdef0",
      "subnetIds": ["subnet-0123456789abcdef0", "subnet-0abcdef1234567890"],
      "endpointIpAddressType": "IPV4",
      "routingDomain": "<vpce-id>.execute-api.<region>.vpce.amazonaws.com"
    }
  },
  "targetConfiguration": {
    "mcp": {
      "openApiSchema": {
        "inlinePayload": "<OpenAPI spec JSON with server URL matching the public certificate domain for your API Gateway, for example https://<api-id>.execute-api.<region>.amazonaws.com>"
      }
    }
  }
}
```
For more details on private endpoint configuration, see [Connect to private resources in your VPC using VPC Lattice](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html>).

  * [Export a REST API from API Gateway](<https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-export-api.html>)

  * [OpenAPI schema targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-schema-openapi.html>)


## Lambda

AgentCore Gateway supports Lambda targets as one of it target types, allowing seamless invocation of Lambda functions that can communicate with resources within your VPC. This functionality is available out-of-the-box and requires no additional configuration from customers - the gateway can immediately invoke Lambda functions that have been configured with VPC access to reach your internal resources such as databases, APIs, or other services. To maintain security best practices, it’s strongly recommended to configure the AgentCore Gateway execution role with minimal permissions, specifically limiting it to invoke only the intended Lambda function rather than granting broad Lambda execution permissions. This principle of least privilege ensures that the gateway, or any other caller using the same role, cannot inadvertently invoke unintended Lambda functions, thereby reducing your security attack surface and maintaining strict access controls within your AWS environment.

## Private identity providers

AgentCore now supports connecting to private OAuth identity providers for both inbound JWT authorization and outbound OAuth credential providers. This enables you to use self-hosted IdPs such as Keycloak, PingFederate, or other OIDC-compliant authorization servers running inside your VPC without exposing them to the public internet.

For detailed configuration instructions, see [Connect to private identity providers in your VPC](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-private-idp.html>).

Alternatively, you can use an interceptor Lambda function for inbound authentication and override the Authorization header in the interceptor Lambda for use with outbound auth:

  * [Gateway interceptors](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors.html>)

  * [Specify the authorization type and credentials to access the gateway target](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building-adding-targets-authorization.html>)


## Limitations and considerations

  * **Inbound authorization required** : Gateway targets configured with a `privateEndpoint` cannot use `NO_AUTH` as the inbound authorizer type unless an interceptor Lambda is configured on the gateway.


For additional limitations related to cross-account connectivity and DNS TTL configuration, see [Limitations and considerations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html#lattice-vpc-egress-limitations>) in [Connect to private resources in your VPC using VPC Lattice](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html>).

