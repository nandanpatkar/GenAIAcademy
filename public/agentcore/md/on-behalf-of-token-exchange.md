# On-behalf-of token exchange with AgentCore Identity - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/on-behalf-of-token-exchange.html

---

# On-behalf-of token exchange with AgentCore Identity

Amazon Bedrock AgentCore Identity supports On-Behalf-Of (OBO) token exchange, enabling agents and other workloads—such as MCP servers—to exchange an inbound user access token for a new, scoped access token that targets a downstream resource server. As the exchange converts a token issued for one audience directly into a token for a different downstream audience, your agents can access protected resources on behalf of authenticated users without triggering additional consent flows. The exchanged token carries both the agent’s own identity and the original caller’s identity, giving resource servers the signals they need to enforce fine-grained, zero-trust authorization at every hop.

## How on-behalf-of token exchange works

On-behalf-of token exchange is built into the existing OAuth Credential Provider. When an agent requests a downstream token, AgentCore Identity automatically takes the inbound access token—representing the upstream caller—along with the client credentials already stored in the credential provider, and brokers the token exchange request with the customer’s IdP or OAuth authorization server. It submits the request, parses the response, and returns it to the agent. Agent developers never need to handle the inbound token or manage client secrets directly. The authorization server makes the final authorization decision, including whether to grant the requested scopes and whether to permit the delegation.

AgentCore Identity supports identity providers that implement on-behalf-of token exchange through either of two established standards. Under RFC 8693 (OAuth 2.0 Token Exchange), the credential provider follows the standard token exchange grant type, submitting the inbound token as the subject_token alongside the agent’s client credentials. Some identity providers instead implement on-behalf-of through RFC 7523 §2.1 (JWT Profile for OAuth 2.0 Authorization Grants), where the inbound token is presented as a JWT authorization grant to obtain the downstream access token. You configure which mode your identity provider expects when setting up the OAuth Credential Provider; AgentCore Identity handles the protocol differences from there.

## Configuring on-behalf-of token exchange

To use this feature, configure an on-behalf-of token exchange mode on your OAuth 2.0 credential provider. You can customize the configuration when using a custom provider, or choose from one of the supported providers.

### Custom OAuth2 Credential Provider

To configure on-behalf-of token exchange for custom provider on AWS Console, see [Add OAuth client using custom provider](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-add-oauth-client-custom.html>). You can also configure it using CLI

#### CLI example: using `TOKEN_EXCHANGE` grant type with machine-to-machine token as actor token

```bash
aws bedrock-agentcore-control create-oauth2-credential-provider \
  --cli-input-json '{
    "name": "sample-obo-custom",
    "credentialProviderVendor": "CustomOauth2",
    "oauth2ProviderConfigInput": {
      "customOauth2ProviderConfig": {
        "oauthDiscovery": {
          "discoveryUrl": "https://my.idp.com/.well-known/openid-configuration"
        },
        "clientId": "your-client-id",
        "clientSecret": "your-client-secret",
        "clientAuthenticationMethod": "CLIENT_SECRET_BASIC",
        "onBehalfOfTokenExchangeConfig": {
          "grantType": "TOKEN_EXCHANGE",
          "tokenExchangeGrantTypeConfig": {
            "actorTokenContent": "M2M",
            "actorTokenScopes": ["scope1", "scope2"]
          }
        }
      }
    }
  }'
```
#### CLI example: using `JWT_AUTHORIZATION_GRANT` grant type

```bash
aws bedrock-agentcore-control create-oauth2-credential-provider \
  --cli-input-json '{
    "name": "sample-obo-custom",
    "credentialProviderVendor": "CustomOauth2",
    "oauth2ProviderConfigInput": {
      "customOauth2ProviderConfig": {
        "oauthDiscovery": {
          "discoveryUrl": "https://my.idp.com/.well-known/openid-configuration"
        },
        "clientId": "your-client-id",
        "clientSecret": "your-client-secret",
        "clientAuthenticationMethod": "CLIENT_SECRET_BASIC",
        "onBehalfOfTokenExchangeConfig": {
          "grantType": "JWT_AUTHORIZATION_GRANT"
        }
      }
    }
  }'
```
### Provider specific on-behalf-of token exchange config

AgentCore Identity includes out-of-the-box on-behalf-of token exchange support for selected providers, preconfigured according to each provider’s public documentation. To adjust protocol-level settings beyond these defaults, set up a custom provider for full control over the exchange configuration.

Provider Name | Grant Type Mode | Note | Related Documentation  
---|---|---|---  
`MicrosoftOauth2` |  `JWT_AUTHORIZATION_GRANT` * Microsoft’s On-Behalf-Of flow is a proprietary delegation pattern built upon the RFC 7523 standard, using the JWT-bearer grant type to facilitate secure token exchange between tiered services. |  `requested_token_use=on_behalf_of` is automatically added to the request unless overridden. |  [Microsoft identity platform and OAuth 2.0 On-Behalf-Of flow](<https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-on-behalf-of-flow>)  
  
## Using on-behalf-of token exchange

To request an on-behalf-of token at runtime, call [GetResourceOauth2Token](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_GetResourceOauth2Token.html>) and set oauth2Flow to the `ON_BEHALF_OF_TOKEN_EXCHANGE`. Pass the workload access token you obtained from [GetWorkloadAccessTokenForJWT](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_GetWorkloadAccessTokenForJWT.html>) — this token carries the inbound token as the subject, which AgentCore Identity uses as the subject token in the exchange. For the full API reference, see the AWS documentation.

```bash
# obtain workload access token using inbound token
aws bedrock-agentcore get-workload-access-token-for-jwt --workload-name sample-workload \
      --user-token "inbound-jwt-token"

{
    "workloadAccessToken": "workload-access-token"
}

# perform on-behalf-of token exchange
aws bedrock-agentcore get-resource-oauth2-token --resource-credential-provider-name sample-obo-provider \
      --oauth2-flow ON_BEHALF_OF_TOKEN_EXCHANGE --scopes "sample-scope" \
      --workload-identity-token "workload-access-token"

{
    "accessToken": "on-behalf-of-token"
}
```
## Grant types and token types

### `grant_type` = `TOKEN_EXCHANGE`

With this grant type, AgentCore Identity sends the inbound JWT as the subject token to obtain an access token. Configure `actor_token_content` value to be one of `M2M`, `AWS_IAM_ID_TOKEN_JWT`, or `NONE`

Parameter | Value  
---|---  
`grant_type` |  `TOKEN_EXCHANGE` (we map it to `urn:ietf:params:oauth:grant-type:token-exchange` when constructing the token exchange request)  
`subject_token` |  We use the inbound JWT token and map the subject token type to `urn:ietf:params:oauth:token-type:jwt` when constructing the token exchange request. Default and can be overridden, see [customParameters](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_GetResourceOauth2Token.html#API_GetResourceOauth2Token_RequestSyntax>)  
  
### `grant_type` = `JWT_AUTHORIZATION_GRANT`

With this grant type, AgentCore Identity sends the inbound JWT as an authorization to obtain an access token. No `actor_token_content` configuration is required as this grant type does not require any actor token.

Parameter | Value  
---|---  
`grant_type` |  `JWT_AUTHORIZATION_GRANT` (we map it to `urn:ietf:params:oauth:grant-type:jwt-bearer` when constructing the token exchange request)  
`assertion` |  Inbound JWT token  
  
#### `actor_token_content` = `M2M` (only when `grant_type` = `TOKEN_EXCHANGE`)

AgentCore Identity first performs [machine-to-machine authentication (OAuth 2.0 client credentials grant)](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./common-use-cases.html#machine-to-machine-auth>) against the credential provider to obtain an access token, then sends it as the `actor_token`.

Parameter | Value  
---|---  
`actor_token_content` |  `M2M`

  * we map it to `urn:ietf:params:oauth:token-type:access_token` when constructing token exchange request
  * we obtain access token via `client_credentials` grant

  
  
The optional `actorTokenScopes` configuration is used as the `scope` parameters for the client credentials request.

#### `actor_token_content` = `AWS_IAM_ID_TOKEN_JWT` (only when `grant_type` = `TOKEN_EXCHANGE`)

AgentCore Identity calls [`sts:GetWebIdentityToken`](<https://docs.aws.amazon.com/STS/latest/APIReference/API_GetWebIdentityToken.html>) using the credential provider’s token endpoint as the aud claim, then sends the resulting JWT as the `actor_token`.

Parameter | Value  
---|---  
`actor_token_content` |  `AWS_IAM_ID_TOKEN_JWT`

  * we map it to `urn:ietf:params:oauth:token-type:jwt` when constructing token exchange request
  * we obtain JWT via [`sts:GetWebIdentityToken`](<https://docs.aws.amazon.com/STS/latest/APIReference/API_GetWebIdentityToken.html>)

  
  
This mode requires your account to be enabled for outbound web identity federation. See [`iam:EnableOutboundWebIdentityFederation`](<https://docs.aws.amazon.com/IAM/latest/APIReference/API_EnableOutboundWebIdentityFederation.html>).

#### `actor_token_content` = `NONE` (only when `grant_type` = `TOKEN_EXCHANGE`)

No `actor_token` or `actor_token_type` is included in the token exchange request. Use this mode with identity providers that derive the actor identity from client authentication alone.

