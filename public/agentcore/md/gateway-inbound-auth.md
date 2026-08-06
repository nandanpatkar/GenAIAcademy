# Set up inbound authorization for your gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-inbound-auth.html

---

# Set up inbound authorization for your gateway

Before you create your gateway, you must set up inbound authorization. Inbound authorization validates users who attempt to access targets through your AgentCore gateway. AgentCore supports the following types of inbound authorization:

  * **JSON Web Token (JWT)** – A secure and compact token used for authorization. After creating the JWT, you specify it as the authorization configuration when you create the gateway. You can create a JWT with any of the identity providers at [Provider setup and configuration](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idps.html>).

  * **IAM identity** – Authorizes through the credentials of the AWS IAM identity trying to access the gateway.

  * **Offloaded authorization types** – The gateway makes no authorization decision of its own and instead offloads authorization to another component, such as the downstream target, a policy engine attached to the gateway, or an interceptor Lambda function. This category includes **Authenticate only** and **No Authorization**. For details and guidance, see Offloaded inbound authorization.


###### Note

If you use the AWS Management Console or AgentCore CLI to create your gateway, you can create a default inbound authorization configuration using Amazon Cognito during gateway creation. If you plan to use the default authorization configuration, you can skip this prerequisite.

If you don’t plan to use the default authorization configuration using Amazon Cognito, select the topic that corresponds to the type of authorization that you plan to use to learn how to set it up:

###### Topics

  * IAM-based inbound authorization

  * JSON Web Token (JWT)-based inbound authorization

  * Offloaded inbound authorization


## IAM-based inbound authorization

IAM-based inbound authorization lets you use the gateway caller’s IAM credentials for authorization. You can use this option if you want to create an IAM identity through which users that call your gateway can be authenticated.

**To set up IAM-based inbound authorization**

  1. Create or use an existing IAM identity for your gateway callers.

  2. Create an identity-based IAM policy that contains the following permissions:

     * `bedrock-agentcore:InvokeGateway` – After you create the gateway, you should modify this policy such that the `Resource` field is scoped to the gateway that you create as a security best practice.

  3. Attach the policy to the gateway caller identity.


**Example policy**

The following example shows a policy you could attach to an identity to allow it to invoke a gateway with the ID `my-gateway-12345`

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowGatewayInvocation",
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:InvokeGateway"
      ],
      "Resource": [
        "arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/my-gateway-12345"
      ]
    }
  ]
}
```
**Resources**

  * For more information about AWS Identity and Access Management, see [Identity and access management for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./security-iam.html>).

  * For more information about Amazon Bedrock AgentCore actions, resources, and condition keys that you can specify in IAM policies, see [Actions, resources, and condition keys for Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrockagentcore.html>).


## JSON Web Token (JWT)-based inbound authorization

A JSON Web Token (JWT) is a secure and compact token used for authorization. You can create a JWT with a supported identity provider. After you create a JWT, you can retrieve it and specify it as the authorization configuration when you create the gateway.

###### Important

Using inbound authorization based on JWT tokens will result in logging of some claims of the JWT token in CloudTrail. The entry includes the [Subject](<http://openid.net/specs/openid-connect-core-1_0.html#Claims>) of the provided web identity token. We recommend that you avoid using any personally identifiable information (PII) in this field. For example, you could instead use a GUID or a pairwise identifier, as [suggested in the OIDC specification](<http://openid.net/specs/openid-connect-core-1_0.html#SubjectIDTypes>).

You can use the AgentCore CLI to set up a default JWT, or create one manually with a supported identity provider. To learn more about different methods for setting up a JWT, select from the following topics:

###### Topics

  * Set up a default JWT

  * Set up a JWT manually

  * Scope advertisement in authentication challenges

  * Use a private (VPC-hosted) identity provider


### Set up a default JWT

The AgentCore CLI lets you easily create a default authorization configuration using Amazon Cognito that you can then use when creating a gateway. When you run `agentcore create` , the CLI prompts you to configure inbound authorization and can automatically set up a Amazon Cognito user pool for you.

```bash
agentcore create
```
After the command completes, the AgentCore CLI provides authentication and authorization information:

  * You’ll use the authorizer configuration when you create the gateway.

  * For inbound authorization when invoking your gateway, you’ll need to obtain an access token by using your client ID, client secret, and the token endpoint. For more information on how to obtain your access token, see the **Example** at [Use an AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using.html>) or [The token issuer endpoint](<https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html>) in the Amazon Cognito Developer Guide.


### Set up a JWT manually

Amazon Bedrock AgentCore supports JWTs from all identity providers. You can see some examples at [Provider setup and configuration](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idps.html>).

In the process of creating the JWT, take note of the following values, which you’ll fill out in the [CustomJWTAuthorizerConfiguration](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CustomJWTAuthorizerConfiguration.html>) when you create a gateway, if they’re applicable to your use case:

  * **Discovery URL** – The URL from which login credentials and the token endpoint can be retrieved.

  * **Client ID** – The public identifier of a client application that requests a token, validated against the `client_id` claim.

  * **Client secret** – The private key that authenticates access for the client application to retrieve a token.

  * **Allowed audience** – The identifier that validates the intended recipients or consumers of a token via the `aud` claim.

  * **Allowed scopes** – The scopes that define the limitations of an application’s access to a user’s account. For more information, see [OAuth Scopes](<https://oauth.net/2/scope/>).

  * **Other required claim values** – Depending on the authorizer you use, you might need to specify required custom claim fields and rules to match the claim field value to for authentication.


You’ll need these values to do the following:

  * Create the gateway by specifying values in the [authorizer configuration](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_AuthorizerConfiguration.html>).

  * Obtain authorization credentials to invoke the gateway. To learn how to obtain your credentials, look up your identity provider’s documentation. For example, if you used Amazon Cognito, see [The token issuer endpoint](<https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html>) in the Amazon Cognito Developer Guide.


### Scope advertisement in authentication challenges

When a client sends a request to a JWT-authorized gateway without a valid access token, the gateway returns an error response with a `WWW-Authenticate` header that advertises the required OAuth scopes. This follows the [RFC 6750 Bearer token challenge](<https://datatracker.ietf.org/doc/html/rfc6750#section-3>) format and enables MCP-compliant clients to automatically discover the scopes needed for token acquisition.

The gateway returns the following responses depending on the error:

  * **401 Unauthorized** – The request has no token or an invalid token. The `WWW-Authenticate` header includes `resource_metadata` and `scope` parameters.

  * **403 Forbidden** – The token is valid but does not contain the required scopes. The `WWW-Authenticate` header includes `error="insufficient_scope"`, `scope`, and `resource_metadata` parameters.


The `scope` value contains the space-delimited scopes configured as **Allowed scopes** in the gateway’s [CustomJWTAuthorizerConfiguration](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CustomJWTAuthorizerConfiguration.html>). The `resource_metadata` value points to the gateway’s [OAuth Protected Resource Metadata](<https://datatracker.ietf.org/doc/html/rfc9728>) document at `/.well-known/oauth-protected-resource`, which clients can fetch to discover the authorization server and supported scopes.

### Use a private (VPC-hosted) identity provider

AgentCore Gateway supports JWT-based inbound authorization with identity providers hosted inside your VPC. You can configure a `privateEndpoint` on the `customJWTAuthorizer` to enable AgentCore to reach your private OIDC discovery, token, and JWKS endpoints without exposing them to the public internet.

Your IAM principal must have the `iam:CreateServiceLinkedRole` permission for `identity-network.bedrock-agentcore.amazonaws.com`, so that AgentCore Identity can create the `AWSServiceRoleForBedrockAgentCoreIdentity` service-linked role on your behalf if it does not already exist.

The `privateEndpoint` applies to the domain in the `discoveryUrl`. If your identity provider uses different domains for other endpoints (for example, the token or JWKS endpoint resolves to a different domain than the discovery URL), use `privateEndpointOverrides` to specify a separate private endpoint configuration for each additional domain.

The following example creates a gateway with a private identity provider using managed Lattice:

```json
{
  "name": "my-private-idp-gateway",
  "protocolType": "MCP",
  "roleArn": "arn:aws:iam::123456789012:role/my-gateway-role",
  "authorizerType": "CUSTOM_JWT",
  "authorizerConfiguration": {
    "customJWTAuthorizer": {
      "allowedAudience": [
        "my-audience"
      ],
      "discoveryUrl": "https://my-idp.internal.example.com/.well-known/openid-configuration",
      "privateEndpoint": {
        "managedVpcResource": {
          "vpcIdentifier": "vpc-0abc123def456",
          "subnetIds": ["subnet-0abc123", "subnet-0def456"],
          "endpointIpAddressType": "IPV4",
          "securityGroupIds": ["sg-0abc123def"]
        }
      }
    }
  }
}
```
If your token or JWKS endpoints use a different domain than the discovery URL, add a `privateEndpointOverrides` entry for each additional domain. Currently, `privateEndpointOverrides` is only supported with self-managed Lattice resources:

```json
{
  ...
  "authorizerConfiguration": {
    "customJWTAuthorizer": {
      "allowedAudience": ["my-audience"],
      "discoveryUrl": "https://my-idp.internal.example.com/.well-known/openid-configuration",
      "privateEndpoint": {
        "selfManagedLatticeResource": {
          "resourceConfigurationIdentifier": "arn:aws:vpc-lattice:us-east-1:123456789012:resourceconfiguration/rcfg-abc123"
        }
      },
      "privateEndpointOverrides": [
        {
          "domain": "my-token-server.internal.example.com",
          "privateEndpoint": {
            "selfManagedLatticeResource": {
              "resourceConfigurationIdentifier": "arn:aws:vpc-lattice:us-east-1:123456789012:resourceconfiguration/rcfg-def456"
            }
          }
        }
      ]
    }
  }
}
```
For self-managed Lattice, cross-account setups, and advanced configurations, see [Connect to private resources in your VPC using VPC Lattice](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./vpc-egress-private-endpoints.html>). For a comprehensive guide covering both inbound and outbound private IdP scenarios, see [Connect to private identity providers](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-private-idp.html>).

## Offloaded inbound authorization

With offloaded inbound authorization, the gateway does not make any authorization decision of its own. Instead, it offloads authorization to another component:

  * The downstream target service, which authorizes the request it receives.

  * A policy engine attached to the gateway, which evaluates access policies.

  * An interceptor Lambda function, which runs your custom authentication or authorization logic before requests reach your targets.


AgentCore offers two offloaded types:

  * **Authenticate only** (`AUTHENTICATE_ONLY`) – The gateway verifies the caller’s SigV4 signature to authenticate the caller, but makes no authorization decision. Requests must be signed, but any authenticated caller is forwarded to the target.

  * **No Authorization** (`NONE`) – The gateway performs no inbound authentication or authorization. Requests can be unauthenticated, and any caller is forwarded to the target.


With either type, you decide where authorization is actually enforced:

  * **Policy engine** – Attach a policy engine to the gateway to evaluate access policies centrally. This is a recommended pattern for production gateways and is frequently used together with OAuth.

  * **Interceptor Lambda function** – Run your own authentication or authorization logic before requests reach your targets. This is recommended for production gateways when the built-in inbound authorization options do not meet your requirements.

  * **Downstream target** – Let the target enforce authorization on the request it receives. This is useful for experimentation and progressive onboarding — for example, putting a gateway in front of an existing runtime **without changing the runtime’s authentication and authorization** — so you can adopt gateway capabilities incrementally while the runtime continues to enforce the auth it already trusts.


###### Important

If you offload inbound authorization by choosing either `AUTHENTICATE_ONLY` or `NONE`, AgentCore Gateway does not enforce authorization on its own. In this scenario, you must offload authorization to a separate component — a policy engine, an interceptor Lambda function, or the downstream target — otherwise any caller can reach your target.

### Authenticate-only authorization

With authenticate-only authorization (`AUTHENTICATE_ONLY`), the gateway verifies the caller’s Signature Version 4 (SigV4) signature to confirm their identity, but does not make any authorization decision of its own. Any authenticated IAM principal can invoke the gateway regardless of their permissions, and the request is forwarded to the target. Authorization is delegated to the downstream target service or to a policy engine attached to the gateway.

###### Important

With `AUTHENTICATE_ONLY`, the gateway does not enforce any authorization policies. Any valid SigV4-signed request will be forwarded to the target. Ensure that your downstream targets implement their own authorization logic, or attach a policy engine to the gateway to control access. Without proper authorization at the target or gateway policy level, any authenticated caller can reach your backend services.

### No Authorization

You can create a gateway that is configured with no authorization by using `authorizerType=NONE` . The gateway will not perform any authorization on the incoming gateway request and the request can be unauthenticated.

###### Important

Do not use No Authorization gateways for production workloads unless you have implemented all the security best practices listed below. If you need custom authentication logic, consider using an [interceptor Lambda function](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors.html>) to handle authentication before requests reach your targets.

**Security Best Practices**

  1. Use the `bedrock-agentcore:GatewayAuthorizerType` condition key to selectively allow/deny access within your organization for creating gateways with `authorizerType=NONE`

  2. Do not use No Authorization gateways out of convenience for testing. They should be used for gateways you intend to make public but have implemented your own custom throttling rules and checks to ensure your public gateway can handle unauthenticated users

  3. Do not use No Authorization gateways with targets that may respond with sensitive information. Although targets are configured with their own authorization configurations, it is best to add another security layer on the gateway.


### Onboard an existing runtime without changing its auth

When you pair an offloaded inbound type with a matching outbound authorization type that forwards the caller’s identity to the runtime, onboarding to a gateway can be as simple as setting an endpoint override on your existing client — no auth changes required:

  * **IAM runtimes** – Combine `AUTHENTICATE_ONLY` inbound authorization with **Caller IAM credentials** (`CALLER_IAM_CREDENTIALS`) outbound authorization. The gateway authenticates the SigV4 caller and then signs the request to the runtime with that same caller identity, so the runtime’s existing IAM authorization continues to apply unchanged. For more information, see [Caller IAM credentials](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-building-adding-targets-authorization.html#gateway-building-adding-targets-authorization-caller-iam>).

  * **OAuth runtimes** – Combine **No Authorization** inbound authorization with **Token passthrough** (`JWT_PASSTHROUGH`) outbound authorization. The gateway forwards the inbound JWT to the runtime without modification, so the runtime validates the token exactly as it does today. (Token passthrough forwards a bearer token, so it requires a JWT-bearing inbound type — JWT inbound authorization or `NONE`. It is not available with `AUTHENTICATE_ONLY`, which is SigV4-based and carries no bearer token.) For more information, see [Token passthrough](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-building-adding-targets-authorization.html#gateway-building-adding-targets-authorization-jwt-passthrough>).

###### Note

Token passthrough (`JWT_PASSTHROUGH`) is **not** the recommended approach for production. When you forward the inbound token unchanged, the same token is accepted by both the gateway and the downstream target, so it should be tightly scoped — for example, each token’s audience (`aud`) should be restricted to the intended resource. The recommended pattern is [on-behalf-of (OBO) token exchange](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./on-behalf-of-token-exchange.html>), where the gateway exchanges the caller’s token for a fresh, audience-scoped token for the target instead of replaying the caller’s token. Use token passthrough for easy experimentation, testing, and onboarding, and move to OBO for long-term production workloads.


###### Warning

The identity-forwarding configurations in this section rely solely on the downstream runtime to authorize requests; the gateway adds no authorization of its own. They are intended for testing, experimentation, and low-disruption onboarding. For a production gateway, enforce authorization at the gateway — configure JWT or IAM inbound authorization, attach a policy engine, or use an interceptor Lambda function. To ensure callers cannot bypass the gateway once you adopt it, see [Enforcing traffic through the gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-http-runtime.html#gateway-target-http-runtime-source-validation>).

