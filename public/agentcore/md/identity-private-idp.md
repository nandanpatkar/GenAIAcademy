# Connect to private identity providers - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-private-idp.html

---

# Connect to private identity providers

Amazon Bedrock AgentCore Identity supports connecting to OAuth 2.0 identity providers (IdPs) hosted inside your AWS VPC, such as self-hosted Keycloak, PingFederate, or other OIDC-compliant authorization servers, without exposing them to the public internet. This enables you to use private IdPs for both inbound JWT authorization with AgentCore Runtime and AgentCore Gateway as well as outbound OAuth2 credential providers.

Private connectivity to VPC hosted IdPs is established using [Amazon VPC Lattice](<https://docs.aws.amazon.com/vpc-lattice/latest/ug/what-is-vpc-lattice.html>) resource gateways and resource configurations, following the same pattern used by [AgentCore Gateway VPC egress](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-vpc-egress.html>). AgentCore Identity uses the `AWSServiceRoleForBedrockAgentCoreIdentity` service-linked role to create and manage VPC Lattice resources in your account for private connectivity to your IdP endpoints.

###### Important

AgentCore supports two VPC Lattice connectivity modes — **managed Lattice** (simpler, AgentCore handles resource lifecycle) and **self-managed Lattice** (advanced, with cross-account support and full governance visibility). Each mode has different trade-offs for complexity, cost, and control. For a detailed comparison with pros and cons, see [Supported VPC egress modes](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html#lattice-vpc-egress-compare-modes>).

## Use cases

Private identity providers are common in enterprise environments where organizations:

  * Run self-hosted authorization servers inside their VPC for compliance or data residency requirements

  * Use private OIDC discovery endpoints that are not publicly accessible

  * Require all authentication traffic to stay within the AWS network without traversing the public internet


## Inbound JWT authorization with a private IdP

When you configure inbound JWT authorization for AgentCore Runtime or AgentCore Gateway, the authorizer uses the discovery URL to fetch the IdP’s public keys (JWKS) and validate incoming JWT tokens. If your IdP is hosted inside a VPC and the discovery URL is not publicly accessible, you must configure a private endpoint so that AgentCore Identity can reach the IdP’s OIDC discovery and JWKS endpoints.

### Configure inbound authorization with a private IdP

To configure inbound JWT authorization with a private IdP, include the `privateEndpoint` block in the authorizer configuration when creating or updating your AgentCore Runtime or Gateway.

**Example: CreateAgentRuntime with private IdP for inbound auth**

```json
{
  "agentRuntimeName": "my-runtime",
  "authorizerConfiguration": {
    "customJWTAuthorizer": {
      "discoveryUrl": "https://idp.internal.example.com/.well-known/openid-configuration",
      "allowedAudiences": [
        "my-agent-audience"
      ],
      "allowedClients": [
        "my-client-id"
      ],
      "privateEndpoint": {
        "managedVpcResource": {
          "vpcIdentifier": "vpc-0abc123def456",
          "subnetIds": [
            "subnet-0abc123",
            "subnet-0def456"
          ],
          "endpointIpAddressType": "IPV4",
          "securityGroupIds": [
            "sg-0abc123def"
          ]
        }
      }
    }
  }
}
```
**Example: CreateGateway with private IdP for inbound auth**

```json
{
  "name": "my-gateway",
  "authorizerConfiguration": {
    "customJWTAuthorizer": {
      "discoveryUrl": "https://idp.internal.example.com/.well-known/openid-configuration",
      "allowedAudiences": [
        "my-gateway-audience"
      ],
      "allowedClients": [
        "my-client-id"
      ],
      "privateEndpoint": {
        "managedVpcResource": {
          "vpcIdentifier": "vpc-0abc123def456",
          "subnetIds": [
            "subnet-0abc123",
            "subnet-0def456"
          ],
          "endpointIpAddressType": "IPV4",
          "securityGroupIds": [
            "sg-0abc123def"
          ]
        }
      }
    }
  }
}
```
If your IdP uses a TLS certificate issued by a private certificate authority, you can place an internal Application Load Balancer with a public ACM certificate in front of it. For more information, see [Workaround for private certificates: ALB](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html#lattice-vpc-egress-private-certs>).

For self-managed Lattice, replace `managedVpcResource` with `selfManagedLatticeResource`:

**Example: CreateAgentRuntime with self-managed Lattice for inbound auth**

```json
{
  "agentRuntimeName": "my-runtime",
  "authorizerConfiguration": {
    "customJWTAuthorizer": {
      "discoveryUrl": "https://idp.internal.example.com/.well-known/openid-configuration",
      "allowedAudiences": [
        "my-agent-audience"
      ],
      "allowedClients": [
        "my-client-id"
      ],
      "privateEndpoint": {
        "selfManagedLatticeResource": {
          "resourceConfigurationIdentifier": "arn:aws:vpc-lattice:us-east-1:123456789012:resourceconfiguration/rcfg-abc123"
        }
      }
    }
  }
}
```
**Example: CreateGateway with self-managed Lattice for inbound auth**

```json
{
  "name": "my-gateway",
  "authorizerConfiguration": {
    "customJWTAuthorizer": {
      "discoveryUrl": "https://idp.internal.example.com/.well-known/openid-configuration",
      "allowedAudiences": [
        "my-gateway-audience"
      ],
      "allowedClients": [
        "my-client-id"
      ],
      "privateEndpoint": {
        "selfManagedLatticeResource": {
          "resourceConfigurationIdentifier": "arn:aws:vpc-lattice:us-east-1:123456789012:resourceconfiguration/rcfg-abc123"
        }
      }
    }
  }
}
```
## Outbound OAuth credential provider with a private IdP

When you configure an outbound OAuth2 credential provider that uses a private IdP, AgentCore Identity needs to reach the IdP’s token endpoint to exchange authorization codes for access tokens or to perform client credentials grants. If the IdP’s token endpoint is hosted inside your VPC, you must configure a private endpoint on the credential provider.

### Configure outbound credential provider with a private IdP

To configure an outbound OAuth credential provider with a private IdP, include the `privateEndpoint` block when creating the credential provider using a custom provider with manual configuration.

**Example: Create an OAuth credential provider with a private IdP**

```json
{
  "name": "my-private-idp-provider",
  "credentialProviderType": "OAUTH",
  "oauthCredentialProvider": {
    "providerType": "CUSTOM",
    "customProviderConfiguration": {
      "issuer": "https://idp.internal.example.com/realms/my-realm",
      "authorizationEndpoint": "https://idp.internal.example.com/realms/my-realm/protocol/openid-connect/auth",
      "tokenEndpoint": "https://idp.internal.example.com/realms/my-realm/protocol/openid-connect/token"
    },
    "clientId": "my-client-id",
    "clientSecret": "my-client-secret",
    "privateEndpoint": {
      "managedVpcResource": {
        "vpcIdentifier": "vpc-0abc123def456",
        "subnetIds": [
          "subnet-0abc123",
          "subnet-0def456"
        ],
        "endpointIpAddressType": "IPV4",
        "securityGroupIds": [
          "sg-0abc123def"
        ]
      }
    }
  }
}
```
For self-managed Lattice, replace `managedVpcResource` with `selfManagedLatticeResource`:

```json
{
  "name": "my-private-idp-provider",
  "credentialProviderType": "OAUTH",
  "oauthCredentialProvider": {
    "providerType": "CUSTOM",
    "customProviderConfiguration": {
      "issuer": "https://idp.internal.example.com/realms/my-realm",
      "authorizationEndpoint": "https://idp.internal.example.com/realms/my-realm/protocol/openid-connect/auth",
      "tokenEndpoint": "https://idp.internal.example.com/realms/my-realm/protocol/openid-connect/token"
    },
    "clientId": "my-client-id",
    "clientSecret": "my-client-secret",
    "privateEndpoint": {
      "selfManagedLatticeResource": {
        "resourceConfigurationIdentifier": "arn:aws:vpc-lattice:us-east-1:123456789012:resourceconfiguration/rcfg-abc123"
      }
    }
  }
}
```
## Prerequisites

Before configuring a private identity provider, ensure the following:

  * Your identity provider is running and accessible within your VPC.

  * The IdP’s OIDC discovery endpoint ( `/.well-known/openid-configuration` ), JWKS endpoint, and token endpoint are reachable from the specified subnets.

  * Your security groups allow inbound traffic on the port used by your IdP (typically port 443 for HTTPS).

  * For managed Lattice, your IAM principal must have the `iam:CreateServiceLinkedRole` permission so that AgentCore can create the Identity Network service-linked role on your behalf. For the required IAM policy, see [Identity Network service-linked role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./service-linked-roles.html#identity-network-service-linked-role>).

  * For managed Lattice, your IAM principal needs the following Amazon EC2 permission: `ec2:CreateNetworkInterface` as well.


## Service-linked role for private identity providers

When you configure a private endpoint for an identity provider, AgentCore Identity uses the `AWSServiceRoleForBedrockAgentCoreIdentity` service-linked role to manage the connectivity to your VPC hosted IdP. This role is created automatically the first time you configure a managed private endpoint for an identity provider, provided your IAM principal has the required `iam:CreateServiceLinkedRole` permission.

For the full policy document and instructions for creating, editing, and deleting this role, see [Identity Network service-linked role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./service-linked-roles.html#identity-network-service-linked-role>).

## Limitations and considerations

  * **Discovery URL must be HTTPS** : The IdP’s OIDC discovery URL must use HTTPS. HTTP endpoints are not supported.

  * **Private certificates** : Your IdP must use a publicly trusted TLS certificate, or you must place an ALB with a public ACM certificate in front of it. For more information, see [Workaround for private certificates: ALB](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html#lattice-vpc-egress-private-certs>).

  * **Cross-account** : Cross-account private IdP connectivity requires the self-managed Lattice option. Managed Lattice does not support cross-account scenarios.


For additional limitations related to VPC Lattice connectivity, see [Limitations and considerations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html#lattice-vpc-egress-limitations>) in [Connect to private resources in your VPC using VPC Lattice](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html>).

