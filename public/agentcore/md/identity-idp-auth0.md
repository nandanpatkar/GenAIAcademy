# Auth0 by Okta - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-auth0.html

---

# Auth0 by Okta

Auth0 can be configured as an identity provider for accessing AgentCore Gateway and Runtime, or an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate and authorize agent users with Auth0 as the identity provider and authorization server, or your agents to obtain credentials to access resources authorized by Auth0.

## Inbound

To add Auth0 as an identity provider and authorization server for accessing AgentCore Gateway and Runtime, you must:

  * Configure discovery URL from your IDP directory. This helps AgentCore Identity get the metadata related to your OAuth authorization server and token verification keys.

  * Enter valid `aud` claims for the token. This helps validate the tokens coming from your IDP and allows access for tokens that contain expected claims.


Use the following procedure to set up Auth0 and obtain the necessary configuration values for Gateway authentication.

**To configure Auth0 for inbound authentication**

  1. Create an API in Auth0:

     1. Sign in to your Auth0 dashboard.

     2. Open **APIs** and choose **Create API**.

     3. Enter a name and identifier for your API (e.g., "gateway-api").

     4. Select the signing algorithm (RS256 recommended).

     5. Choose **Create**.

  2. Configure API scopes:

     1. In the API settings, go to the **Scopes** tab.

     2. Add scopes such as "invoke:gateway" and "read:gateway".

  3. Create an application:

     1. Open **Applications** and choose **Create Application**.

     2. Select **Machine to Machine Application**.

     3. Select the API you created in step 1.

     4. Authorize the application for the scopes you created.

     5. Choose **Create**.

  4. Record the client ID and client secret from the application settings. You’ll need these values to configure the Auth0 provider in AgentCore Identity.

  5. Construct the discovery URL for your Auth0 tenant:

```text
https://your-domain/.well-known/openid-configuration
```
Where `your-domain` is your Auth0 tenant domain (e.g., "dev-example.us.auth0.com").

  6. Configure Inbound Auth with the following values:

     1. **Discovery URL** : The URL constructed in the previous step

     2. **Allowed audiences** : The API identifier you created in step 1


## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your Auth0 application first, then return to the Auth0 dashboard to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the Auth0 application**

Use the following procedure to set up an Auth0 OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure an Auth0 OAuth2 application**

  1. Sign in to your Auth0 dashboard.

  2. Open **Applications** and choose **Create Application**.

  3. Enter a name for your application and select **Regular Web Application** as the application type.

  4. Choose **Create**.

  5. On the application’s **Settings** tab, leave **Allowed Callback URLs** empty for now — you will add the unique callback URL in Step 3.

  6. Configure any connections, scopes, and permissions necessary for your application.

  7. Record the **Client ID** and **Client Secret** from the application settings. You’ll need these values to configure the Auth0 provider in AgentCore Identity.

  8. Note your Auth0 tenant domain (for example, `dev-example.us.auth0.com`). You’ll use this to construct the authorization, token, and issuer endpoints in Step 2.


For more details, refer to [Auth0’s documentation on creating applications](<https://auth0.com/docs/get-started/auth0-overview/create-applications>).

**Step 2: Create the AgentCore Identity credential provider**

To configure Auth0 as an outbound resource provider, use the following:

```json
{
  "name": "NAME",
  "credentialProviderVendor": "Auth0Oauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret",
      "authorizationEndpoint": "https://your-auth0-tenant.auth0.com/authorize",
      "tokenEndpoint": "https://your-auth0-tenant.auth0.com/oauth/token",
      "issuer": "https://your-auth0-tenant.auth0.com"
    }
  }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with Auth0**

Return to the Auth0 dashboard and add the unique callback URL to your application’s allowed callbacks.

  1. Sign in to your Auth0 dashboard and open the application you created in Step 1.

  2. On the **Settings** tab, paste the `callbackUrl` value returned by `CreateOauth2CredentialProvider` into **Allowed Callback URLs**.

  3. Choose **Save Changes**.



