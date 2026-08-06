# Spotify - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-spotify.html

---

# Spotify

Spotify can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Spotify’s OAuth2 service and obtain access tokens for Spotify API resources.

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your Spotify OAuth2 client first, then return to the Spotify developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the Spotify OAuth2 client**

Use the following procedure to set up a Spotify OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a Spotify OAuth2 application**

  1. Open the developer dashboard for Spotify.

  2. Choose **Create an App**.

  3. Provide a name and description for your application.

  4. Leave the **Redirect URI** field empty for now — you will add the unique callback URL in Step 3.

  5. Select **Web API** for the API/SDKs that you intend to use for Spotify.

  6. Choose **Save**.

  7. On the application overview page, choose **Settings**.

  8. On the **Basic Information** tab, record the client ID and client secret. You’ll need these values for configuring the Spotify resource provider in AgentCore Identity.


**Step 2: Create the AgentCore Identity credential provider**

To configure Spotify as an outbound resource provider, use the following:

```json
{
  "name": "Spotify",
  "credentialProviderVendor": "SpotifyOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret"
    }
  }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with Spotify**

Return to the Spotify developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the Spotify developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



