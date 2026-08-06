# Dropbox - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-dropbox.html

---

# Dropbox

Dropbox can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Dropbox’s OAuth2 service and obtain access tokens for Dropbox API resources.

###### Note

Dropbox does not support the M2M/Client Credentials flow.

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your Dropbox OAuth2 client first, then return to the Dropbox developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the Dropbox OAuth2 client**

Use the following procedure to set up a Dropbox OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a Dropbox OAuth2 application**

  1. Open the developer **App Console** for Dropbox.

  2. Choose **Create app**.

  3. Choose **Scoped access**.

  4. For the access type, choose the access type appropriate for your application.

  5. Provide a name for your application.

  6. Choose **Create app**.

  7. On the app overview page, open the OAuth2 section. Leave the redirect URI list empty for now — you will add the unique callback URL in Step 3.

  8. In the same section choose the dropdown below **Allow public clients (Implicit Grant & PKCE)** and choose **Disallow** in the options.

  9. Record the app key and app secret as you’ll need the information to configure the Dropbox resource provider in AgentCore Identity.

  10. In the **Permissions** tab for the application, select the scopes that are needed for your application.


For more details, refer to [Dropbox’s OAuth implementation guide](<https://developers.dropbox.com/oauth-guide#implementing-oauth>).

**Step 2: Create the AgentCore Identity credential provider**

To configure Dropbox as an outbound resource provider, use the following:

```json
{
  "name": "DropBox",
  "credentialProviderVendor": "DropboxOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret"
    }
  }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with Dropbox**

Return to the Dropbox developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the Dropbox developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



