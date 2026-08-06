# OneLogin - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-onelogin.html

---

# OneLogin

OneLogin can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through OneLogin’s OAuth2 service and obtain access tokens for OneLogin API resources.

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your OneLogin OAuth2 client first, then return to the OneLogin developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the OneLogin OAuth2 client**

Use the following procedure to set up a OneLogin OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a OneLogin OAuth2 application**

  1. Open the OneLogin Administration panel.

  2. Add a new app.

  3. Search for OIDC and select the OpenId Connect app.

  4. Choose a name for your application and choose **Save**.

  5. On the page for the app, go to the **Configuration** tab. Leave the redirect URI list empty for now — you will add the unique callback URL in Step 3.

  6. Open the **SSO** tab and note the client ID and client secret as you’ll need these to configure the OneLogin app in AgentCore Identity.

  7. Change the Token endpoint authentication method to **POST**.

  8. Choose **Save**.


**Step 2: Create the AgentCore Identity credential provider**

To configure OneLogin as an outbound resource provider use the following:

```json
{
  "name": "OneLogin",
  "credentialProviderVendor": "OneLoginOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret",
      "authorizationEndpoint": "https://your-tenant.onelogin.com/oidc/2/auth",
      "tokenEndpoint": "https://your-tenant.onelogin.com/oidc/2/token",
      "issuer": "https://your-tenant.onelogin.com/oidc/2"
    }
  }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with OneLogin**

Return to the OneLogin developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the OneLogin developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



