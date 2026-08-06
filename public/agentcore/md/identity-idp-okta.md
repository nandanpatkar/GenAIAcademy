# Okta - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-okta.html

---

# Okta

Okta can be configured as an identity provider for accessing AgentCore Gateway and Runtime, or an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate and authorize agent users with Okta as the identity provider and authorization server, or your agents to obtain credentials to access resources authorized by Okta.

## Inbound

To add Okta as an identity provider and authorization server for accessing AgentCore Gateway and Runtime, you must:

  * Configure a discovery URL from your Okta tenant. This helps AgentCore Identity get the metadata related to your OAuth authorization server and token verification keys.

  * Enter valid `aud` claims for the token. This helps validate the tokens coming from your IdP and allows access for tokens that contain expected claims.


**To configure Okta for inbound authentication**

  1. Open the Okta developer console.

  2. In the left navigation bar, choose **Applications**.

  3. Choose **Create App Integration**.

  4. Choose **OIDC - OpenID Connect** as the sign-in method for your application.

  5. Choose **Web Application** as your application type.

  6. Provide a name for your application.

  7. Select **Authorization Code** and/or **Client Credentials** depending on your needs.

  8. For **Sign-in redirect URIs** add your application endpoint that will receive the Okta token.

  9. Adjust the **Assignments** section as necessary depending on your needs.

  10. Choose **Save**.

  11. Create an Okta API to represent your application:

     * In the left navigation bar, choose **Security**.

     * Go to **API** and choose **Add Authorization Server**.

     * Follow the flow to create an authorization server dedicated to your Okta tenant.

     * Once the authorization server has been created, choose the **Access Policies** tab on the overview page to configure an appropriate access policy.

     * Define the necessary custom scopes for the authorization server that is needed for your application.

  12. Construct the discovery URL for your Okta tenant:

```text
https://your-tenant.okta.com/oauth2/your-authorization-server
```
  13. Configure Inbound Auth with the following values:

     * **Discovery URL:** The URL constructed in the previous step

     * **Allowed Audiences:** The audience value you provided when creating the API in step 11


For more details, refer to [Okta’s documentation](<https://developer.okta.com/docs/concepts/oauth-openid/>).

### Add a client_id claim into access token claims

Okta by default does not include `client_id` as a standard claim in their tokens. To populate the claim in the token, you need to customize the claims through the authorization server that you use to issue tokens.

**To add client_id claim to access tokens**

  1. In the left navigation bar, choose **Security** . Go to **API** and choose the authorization server that you intend to use for your application.

  2. In the details page for the authorization server, choose the **Claims** tab and choose **Add Claim**.

  3. Name the new claim **client_id** and set the value to **app.clientId**.

  4. Set **Include in token type** to **Access Token**.

  5. Choose **Save**.


For more details, refer to [Okta’s documentation](<https://developer.okta.com/docs/guides/customize-tokens-returned-from-okta/main/>).

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your Okta OIDC application first, then return to the Okta developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the Okta OIDC application**

Follow the procedure in the Inbound section to create your Okta OIDC application and authorization server. When prompted for **Sign-in redirect URIs** in the application settings, leave the field empty for now — you will add the unique callback URL in Step 3.

**Step 2: Create the AgentCore Identity credential provider**

To configure Okta as an outbound resource provider in AgentCore Identity, use the following:

```json
{
  "name": "Okta",
  "credentialProviderVendor": "OktaOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret",
      "authorizationEndpoint": "https://your-tenant.okta.com/oauth2/your-authorization-server/v1/authorize",
      "tokenEndpoint": "https://your-tenant.okta.com/oauth2/your-authorization-server/v1/token",
      "issuer": "https://your-tenant.okta.com/oauth2/your-authorization-server"
    }
  }
}
```
To use [Okta OAuth 2.0 on-behalf-of token exchange](<https://developer.okta.com/docs/guides/set-up-token-exchange/main/>), use custom provider for advanced configuration. For details, see [On-behalf-of token exchange with AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./on-behalf-of-token-exchange.html>).

```json
{
  "name": "Okta",
  "credentialProviderVendor": "CustomOauth2",
  "oauth2ProviderConfigInput": {
    "customOauth2ProviderConfig": {
      "clientAuthenticationMethod": "CLIENT_SECRET_BASIC",
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret",
      "oauthDiscovery": {
        "authorizationServerMetadata": {
          "authorizationEndpoint": "https://your-tenant.okta.com/oauth2/your-authorization-server/v1/authorize",
          "tokenEndpoint": "https://your-tenant.okta.com/oauth2/your-authorization-server/v1/token",
          "issuer": "https://your-tenant.okta.com/oauth2/your-authorization-server"
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

**Step 3: Register the unique callback URL with Okta**

Return to the Okta developer console and add the unique callback URL to your application’s **Sign-in redirect URIs**.

  1. Sign in to the Okta developer console and open the OIDC application you created in Step 1.

  2. Open the **General** tab and edit the **LOGIN** settings.

  3. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to **Sign-in redirect URIs**.

  4. Choose **Save**.



