# Client authentication methods - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/client-auth-methods.html

---

# Client authentication methods

Client authentication method controls how the OAuth client authenticates with the authorization server’s token endpoint when requesting access tokens.

For provider-specific credential providers, AgentCore Identity manages the client authentication method for you based on each vendor’s requirements, so no additional configuration is needed.

For use cases that require finer-grained control — such as authenticating with an IAM-signed JWT assertion instead of a client secret, or targeting an authorization server whose requirements differ from a built-in vendor — use the custom provider, which allows you to choose from the supported methods below.

## Supported client authentication methods

AgentCore Identity supports the following values for client authentication method.

  1. **`CLIENT_SECRET_BASIC` ** (default) — Clients that have received a client secret value from the authorization server authenticate with the authorization server in accordance with Section 2.3.1 of OAuth 2.0 (RFC 6749) using the HTTP Basic authentication scheme. Both client ID and client secret are required.

  2. **`CLIENT_SECRET_POST` ** — Clients that have received a client secret value from the authorization server authenticate with the authorization server in accordance with Section 2.3.1 of OAuth 2.0 (RFC 6749) by including the client credentials in the request body. Both client ID and client secret are required.

  3. **`AWS_IAM_ID_TOKEN_JWT` ** — Authenticates to the authorization server’s token endpoint by sending an AWS IAM-signed JWT assertion for the agent’s execution role (obtained via [sts:GetWebIdentityToken](<https://docs.aws.amazon.com/STS/latest/APIReference/API_GetWebIdentityToken.html>)) as client assertion, per RFC 7523, Section 2.2. The authorization server must support this mechanism and trust AWS IAM as an issuer. When this method is selected, client secret is not required, and client ID is only required for the user-delegated access flow ([User-delegated access (OAuth 2.0 authorization code grant)](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./common-use-cases.html#user-delegated-access>)). To use `AWS_IAM_ID_TOKEN_JWT` as client authentication method, here are the prerequisites:

     1. Outbound web identity federation must be enabled on your account. Enable it with [iam:EnableOutboundWebIdentityFederation](<https://docs.aws.amazon.com/IAM/latest/APIReference/API_EnableOutboundWebIdentityFederation.html>).

     2. The calling AWS IAM identity must have permission to call [sts:GetWebIdentityToken](<https://docs.aws.amazon.com/STS/latest/APIReference/API_GetWebIdentityToken.html>).

  4. **`PRIVATE_KEY_JWT` ** Authenticates to the authorization server’s token endpoint by sending a short-lived JWT client assertion. AgentCore Identity builds and signs the assertion with a customer-managed AWS KMS asymmetric key via `kms:Sign`, per RFC 7523, Section 2.2. The private key never leaves KMS. The authorization server validates the assertion against the public key you registered. When you select this method, no client secret is required. A client ID is required for all flows. To use `PRIVATE_KEY_JWT` as the client authentication method, satisfy the following prerequisites:

     1. An asymmetric signing key in AWS KMS with key usage `SIGN_VERIFY`, with an appropriate key policy and a key spec compatible with your chosen signing algorithm (see [Private Key JWT](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./private-key-jwt.html>) for the algorithm-to-key-spec table).

     2. The AgentCore Identity execution role (or calling identity) must have `kms:DescribeKey` and `kms:Sign` permissions on the KMS key.

     3. The identity provider’s authorization server must support Private Key JWT client authentication, and the corresponding public key must be registered with their authorization server.


## How to configure client authentication method

Configuring client authentication method for CustomOauth2

To configure client authentication method for custom provider on AWS Console, see [Add OAuth client using custom provider](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-add-oauth-client-custom.html>). You can also configure it using CLI.

### CLI example: using `CLIENT_SECRET_BASIC` as client authentication method

```bash
aws bedrock-agentcore-control create-oauth2-credential-provider \
  --cli-input-json '{
    "name": "sample-client-basic",
    "credentialProviderVendor": "CustomOauth2",
    "oauth2ProviderConfigInput": {
      "customOauth2ProviderConfig": {
        "oauthDiscovery": {
          "discoveryUrl": "https://my.idp.com/.well-known/openid-configuration"
        },
        "clientId": "your-client-id",
        "clientSecret": "your-client-secret",
        "clientAuthenticationMethod": "CLIENT_SECRET_BASIC"
      }
    }
  }'
```
### CLI example: using `AWS_IAM_ID_TOKEN_JWT` as client authentication method

```bash
aws bedrock-agentcore-control create-oauth2-credential-provider \
  --cli-input-json '{
    "name": "sample-iam-jwt",
    "credentialProviderVendor": "CustomOauth2",
    "oauth2ProviderConfigInput": {
      "customOauth2ProviderConfig": {
        "oauthDiscovery": {
          "discoveryUrl": "https://my.idp.com/.well-known/openid-configuration"
        },
        "clientId": "your-client-id",
        "clientAuthenticationMethod": "AWS_IAM_ID_TOKEN_JWT"
      }
    }
  }'
```
### CLI example: Using `PRIVATE_KEY_JWT` as client authentication method

```bash
aws bedrock-agentcore-control create-oauth2-credential-provider \
  --cli-input-json '{
    "name": "sample-private-key-jwt",
    "credentialProviderVendor": "CustomOauth2",
    "oauth2ProviderConfigInput": {
      "customOauth2ProviderConfig": {
        "oauthDiscovery": {
          "discoveryUrl": "https://your-idp.example.com/.well-known/openid-configuration"
        },
        "clientId": "your-client-id",
        "clientAuthenticationMethod": "PRIVATE_KEY_JWT",
        "privateKeyJwtConfig": {
          "privateKeySource": {
            "kmsKeySource": {
              "kmsKeyArn": "arn:aws:kms:us-east-1:111122223333:key/your-key-id"
            }
          },
          "signingAlgorithm": "RS256"
        }
      }
    }
  }'
```
For more information about the full configuration reference, including KMS key setup, cross-account support, and signing algorithm options, see [Private Key JWT](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./private-key-jwt.html>).

## Notice

The [`tokenEndpointAuthMethods`](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_Oauth2AuthorizationServerMetadata.html>) field is not recommended in favor of client authentication method but maintained for backward compatibility in CLI and SDK. Providing both in the same request will result in a validation error.

