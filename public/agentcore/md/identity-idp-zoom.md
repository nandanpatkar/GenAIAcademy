# Zoom - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-zoom.html

---

# Zoom

Zoom can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Zoom’s OAuth2 service and obtain access tokens for Zoom API resources.

## Outbound

###### Note

You can only configure a Zoom OAuth2 application as either a user federation or M2M OAuth2 client but not both.

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your Zoom OAuth2 client first, then return to the Zoom developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the Zoom OAuth2 client**

Use the following procedure to set up a Zoom OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a Zoom OAuth2 application**

  1. Sign in to the Zoom App Marketplace.

  2. Choose **Develop** > **Build App**.

  3. For a user federation app, select **General app** and choose **Create**.

     * On the app details page, add a name for your application and select how your application will be managed.

     * In the **OAuth Information** section, leave the OAuth Redirect URL and OAuth Allow Lists empty for now — you will add the unique callback URL in Step 3.

  4. For a M2M app, select **Server to Server OAuth App** and choose **Create**.

     * Add a name for your application.

     * On the app details page, choose **Scopes** and add the necessary scopes for your application.

     * Open **Information** and provide a company name, and developer contact information.

  5. Record the client ID and client secret that have been generated for your application. You’ll need these values to configure the Zoom credential provider in AgentCore Identity.


For more details, refer to [Zoom’s integration documentation](<https://developers.zoom.us/docs/integrations/create/>).

**Step 2: Create the AgentCore Identity credential provider**

To configure Zoom as an outbound resource provider, use the following:

```json
{
  "name": "Zoom",
  "credentialProviderVendor": "ZoomOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret"
    }
  }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with Zoom**

Return to the Zoom developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the Zoom developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



