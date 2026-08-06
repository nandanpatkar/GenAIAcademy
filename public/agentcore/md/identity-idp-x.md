# X - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-x.html

---

# X

X can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through X’s OAuth2 service and obtain access tokens for X API resources.

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your X OAuth2 client first, then return to the X developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the X OAuth2 client**

Use the following procedure to set up an X OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure an X OAuth2 application**

  1. Open the X developer portal.

  2. In the left navigation bar, choose **Project & Apps**.

  3. Choose on the X project you’ve created for the application.

  4. Under the **Apps** header choose **Add an App**.

  5. Choose **Create new**.

  6. Provide a name and description for your application.

  7. In the left navigation bar, choose the application that was just generated.

  8. On the app details page for your new app, choose **Edit** in the User Authentication settings.

  9. Select the **App permissions** necessary for your application.

  10. For **Type of App** select **Web App, Automated App or Bot**.

  11. Under **App Info** , leave the callback URL field empty for now — you will add the unique callback URL in Step 3.

  12. For **Website URL** enter the URL for your application.

  13. Choose **Save**.

  14. Under the **Keys and token** tab for your application, go to the **OAuth 2.0 Client ID and Client Secret**.

  15. Choose **Generate** and note the client ID and secret that get generated as you’ll need this information to configure the X resource provider in AgentCore Identity.


###### Note

X only displays the full client secret when it is generated, if you lose this information you’ll need to re-generate the client secret in the X developer portal.

For more details, refer to [X’s OAuth 2.0 documentation](<https://docs.x.com/fundamentals/authentication/oauth-2-0/overview>).

**Step 2: Create the AgentCore Identity credential provider**

To configure X as an outbound resource provider, use the following:

```json
{
  "name": "X",
  "credentialProviderVendor": "XOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret"
    }
  }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with X**

Return to the X developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the X developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



