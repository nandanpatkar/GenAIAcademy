# Specify the authorization type and credentials to access the gateway target - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building-adding-targets-authorization.html

---

# Specify the authorization type and credentials to access the gateway target

In the [CreateGatewayTarget](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGatewayTarget.html>) request body, you specify the credential provider configuration in the `credentialProviderConfigurations` array. The configuration depends on the outbound authorization type that you set up. For reference information about the API structure for the credential provider configuration, see [CredentialProviderConfiguration](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CredentialProviderConfiguration.html>) . For more information on outbound authorization, see [Set up outbound authorization for your gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-outbound-auth.html>).

To learn more about a credential provider configuration, select a topic:

###### Topics

  * AgentCore Gateway service role (IAM) authorization

  * OAuth authorization

  * API key authorization

  * Caller IAM credentials authorization

  * JWT passthrough authorization


## AgentCore Gateway service role (IAM) authorization

If you’re using IAM authorization through an AgentCore Gateway service role for your target, specify the `credentialProviderType` as `GATEWAY_IAM_ROLE` . The configuration depends on your target type.

**For Lambda, API Gateway, Smithy and Connector targets**

The `iamCredentialProvider` configuration is not needed because the target service name is already known to the AgentCore Gateway service. Use only the `credentialProviderType` configuration, as shown in the following example:

```json
{
    "credentialProviderType": "GATEWAY_IAM_ROLE"
}
```
**For MCP server and OpenAPI targets**

For MCP server and OpenAPI targets, you must also provide an `iamCredentialProvider` with the service name used for [AWS Signature Version 4 (Sig V4)](<https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html>) signing. The `service` field is required. The `region` field is optional and defaults to the gateway’s Region.

```json
{
    "credentialProviderType": "GATEWAY_IAM_ROLE",
    "credentialProvider": {
        "iamCredentialProvider": {
            "service": "execute-api",
            "region": "us-west-2"
        }
    }
}
```
The following table describes the fields in the `iamCredentialProvider` object:

Field | Required | Description  
---|---|---  
`service` |  Yes |  The AWS service name used for SigV4 signing. This value must match the service name that the target expects when verifying the SigV4 signature. The following are common values:

  * `bedrock-agentcore` – For MCP servers hosted on Amazon Bedrock AgentCore, such as the runtime (see [Deploy MCP servers in AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-mcp.html>)) or another gateway.
  * `execute-api` – For MCP servers or OpenAPI targets behind Amazon API Gateway.
  * `lambda` – For MCP servers behind Lambda Function URLs.

  
`region` |  No |  The AWS Region for SigV4 signing. If omitted, defaults to the gateway’s Region.  
  
## OAuth authorization

If you’re using OAuth authorization, you specify the `credentialProviderType` as `OAUTH` . In the object that the `credentialProvider` field maps to, map an `oauthCredentialProvider` field name to an [OAuthCredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_OAuthCredentialProvider.html>) object and provide the values based on your outbound authorization setup.

The structure of the [OAuthCredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_OAuthCredentialProvider.html>) differs depending on the type of authentication pattern that you set up. To learn more about different authentication patterns, see [Supported authentication patterns](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./common-use-cases.html>).

  * If you set up machine-to-machine authentication, also known as a client credentials grant or 2-legged OAuth (2LO), follow the structure in the **Client credentials** tab.

  * If you set up user-delegated access, also known as an authorization code grant or 3-legged OAuth (3LO), follow the structure in the **Authorization code** tab.

  * If you set up on-behalf-of token exchange to propagate an authenticated user’s identity to a downstream service or obtain an access token with the actor context, follow the structure in the **Token exchange (On-behalf-of)** tab.


Select one of the following methods:

###### Example

Client credentials
    

  1. Specify the `grantType` as `CLIENT_CREDENTIALS` , as in the following example:

```json
{
    "credentialProviderType": "OAUTH",
    "credentialProvider": {
        "oauthCredentialProvider": {
            "providerArn": "string",
            "grantType": "CLIENT_CREDENTIALS",
            "scopes": [
                "string",
                ...
            ],
            "customParameters": {
                "string": "string"
            }
        }
    }
}
```
Authorization code
    

  1. Specify the `grantType` as `AUTHORIZATION_CODE` and include, in the `defaultReturnUrl` field, the URL to which to redirect the end user’s browser after obtaining the authorization code, as in the following example:

```json
{
    "credentialProviderType": "OAUTH",
    "credentialProvider": {
        "oauthCredentialProvider": {
            "providerArn": "string",
            "grantType": "AUTHORIZATION_CODE",
            "defaultReturnUrl": "string",
            "scopes": [
                "string",
                ...
            ],
            "customParameters": {
                "string": "string"
            }
        }
    }
}
```
To learn more about 3LO authentication, see [OAuth 2.0 authorization URL session binding](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./oauth2-authorization-url-session-binding.html>).


Token exchange (On-behalf-of)
    

  1. Specify the `grantType` as `TOKEN_EXCHANGE`. The gateway exchanges the inbound user’s access token for a target-scoped token via the credential provider. Include any IdP-specific parameters in `customParameters`. For more information about configuring the credential provider, see [On-behalf-of token exchange](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./on-behalf-of-token-exchange.html>).

```json
{
    "credentialProviderType": "OAUTH",
    "credentialProvider": {
        "oauthCredentialProvider": {
            "providerArn": "string",
            "grantType": "TOKEN_EXCHANGE",
            "scopes": [
                "string",
                ...
            ],
            "customParameters": {
                "subject_token_type": "urn:ietf:params:oauth:token-type:access_token"
            }
        }
    }
}
```
###### Note

The `customParameters` field passes values directly to the identity provider’s token endpoint. Required parameters vary by provider. For example, Okta requires an `audience` parameter in addition to `subject_token_type`. See your identity provider’s documentation and [On-behalf-of token exchange](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./on-behalf-of-token-exchange.html>) for details.


## API key authorization

If you set up API key authorization, you specify the `credentialProviderType` as `API_KEY` . In the object that the `credentialProvider` field maps to, map an `apiKeyCredentialProvider` field name to an [ApiKeyCredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_ApiKeyCredentialProvider.html>) object and provide the values based on your outbound authorization setup. The following JSON shows the structure:

```json
{
    "credentialProviderType": "API_KEY",
    "credentialProvider": {
        "apiKeyCredentialProvider": {
            "providerArn": "string",
            "credentialLocation": "HEADER" | "QUERY_PARAMETER",
            "credentialParameterName": "string",
            "credentialPrefix": "string"
        }
    }
}
```
## Caller IAM credentials authorization

If you want the gateway to use the IAM identity and permissions of the caller to sign requests to the downstream target, specify the `credentialProviderType` as `CALLER_IAM_CREDENTIALS`. With this authorization type, the gateway makes a request to the downstream target on behalf of the gateway caller using SigV4. This allows the downstream target to apply IAM policies based on who originally called the gateway.

###### Note

`CALLER_IAM_CREDENTIALS` is only available for gateways that have `AWS_IAM` or `AUTHENTICATE_ONLY` as the authorizer type.

```json
{
    "credentialProviderType": "CALLER_IAM_CREDENTIALS"
}
```
## JWT passthrough authorization

If you want the gateway to pass the bearer token from the incoming request directly to the downstream target without modification, specify the `credentialProviderType` as `JWT_PASSTHROUGH`. The gateway validates the inbound token and then forwards it to the target in the outbound request. This is useful when the target service handles its own authorization using the original caller’s token.

###### Note

`JWT_PASSTHROUGH` is only available for HTTP targets (passthrough and AgentCore Runtime).

```json
{
    "credentialProviderType": "JWT_PASSTHROUGH"
}
```
