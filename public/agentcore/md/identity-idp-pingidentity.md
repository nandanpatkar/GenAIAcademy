# Ping Identity - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-pingidentity.html

---

# Ping Identity

Ping Identity’s PingOne platform can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through PingOne’s OAuth2 service and obtain access tokens for PingOne API resources.

## Outbound

###### Note

You can only configure a PingOne OAuth2 application as either a user federation or M2M OAuth2 client but not both.

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your PingOne OAuth2 application first, then return to the PingOne admin console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the Ping Identity OAuth2 application**

Use the following procedure to set up a PingOne OAuth2 application and obtain the necessary client credentials for AgentCore Identity. If you are configuring a user federation client, you will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a PingOne OAuth2 application**

  1. Sign onto the PingOne admin console.

  2. In the navigation bar, under **Applications** , choose **Application**.

  3. On the page, choose the **+** icon next to **Applications** to create a new application.

  4. To configure your application as a M2M OAuth2 client:

     * Select **Client Credentials** for Grant Type.

     * Select **Client Secret Post** for Token Endpoint Authentication Method.

     * Create a custom resource under Applications→Resources in the tabs, including a scope. Then, add that scope to the application under its personal **Resources** tab. Then, make sure that scope is present in the 'scopes' field of GetResourceOauth2AccessToken.

  5. To configure your application as a user federation Oauth2 client:

     * Select **Code** for Response Type.

     * Select **Authorization Code** for Grant Type.

     * Select **Client Secret Basic** for Token Endpoint Authentication Method.

     * Leave the redirect URI list empty for now — you will add the unique callback URL in Step 3.


For more details, refer to [Ping Identity’s PingOne API documentation](<https://apidocs.pingidentity.com/pingone/getting-started/v1/api>).

**Step 2: Create the AgentCore Identity credential provider**

To configure PingOne as an outbound resource provider use the following:

```json
{
  "name": "PingOne",
  "credentialProviderVendor": "PingOneOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret",
      "authorizationEndpoint": "https://auth.pingone.com/your-env-id/as/authorize",
      "tokenEndpoint": "https://auth.pingone.com/your-env-id/as/token",
      "issuer": "https://auth.pingone.com/your-env-id/as"
    }
  }
}
```
To use [PingIdentity OAuth 2.0 token exchange for delegation](<https://docs.pingidentity.com/pingone/use_cases/p1_oauth_2_token_exchange_delegation.html>), use custom provider for advanced configuration. For details, see [On-behalf-of token exchange with AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./on-behalf-of-token-exchange.html>).

```json
{
  "name": "PingOne",
  "credentialProviderVendor": "CustomOauth2",
  "oauth2ProviderConfigInput": {
    "customOauth2ProviderConfig": {
      "clientAuthenticationMethod": "CLIENT_SECRET_BASIC",
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret",
      "oauthDiscovery": {
        "authorizationServerMetadata": {
          "authorizationEndpoint": "https://auth.pingone.com/your-env-id/as/authorize",
          "tokenEndpoint": "https://auth.pingone.com/your-env-id/as/token",
          "issuer": "https://auth.pingone.com/your-env-id/as"
        }
      },
      "onBehalfOfTokenExchangeConfig": {
        "grantType": "TOKEN_EXCHANGE",
        "tokenExchangeGrantTypeConfig": {
          "actorTokenContent": "M2M"
        }
      }
    }
  }
}
```
To use [PingIdentity OAuth 2.0 token exchange for impersonation](<https://docs.pingidentity.com/pingone/use_cases/p1_oauth_2_token_exchange_impersonation.html>), use custom provider for advanced configuration. For details, see [On-behalf-of token exchange with AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./on-behalf-of-token-exchange.html>).

```json
{
  "name": "PingOne",
  "credentialProviderVendor": "CustomOauth2",
  "oauth2ProviderConfigInput": {
    "customOauth2ProviderConfig": {
      "clientAuthenticationMethod": "CLIENT_SECRET_BASIC",
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret",
      "oauthDiscovery": {
        "authorizationServerMetadata": {
          "authorizationEndpoint": "https://auth.pingone.com/your-env-id/as/authorize",
          "tokenEndpoint": "https://auth.pingone.com/your-env-id/as/token",
          "issuer": "https://auth.pingone.com/your-env-id/as"
        }
      },
      "onBehalfOfTokenExchangeConfig": {
        "grantType": "TOKEN_EXCHANGE",
        "tokenExchangeGrantTypeConfig": {
          "actorTokenContent": "NONE"
        }
      }
    }
  }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

###### Note

The unique callback URL only applies to user federation clients. If you configured PingOne as an M2M client, no callback URL registration is required.

**Step 3: Register the unique callback URL with PingOne**

Return to the PingOne admin console and add the unique callback URL to your user federation application’s redirect URI list.

  1. Sign in to the PingOne admin console and open the application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



