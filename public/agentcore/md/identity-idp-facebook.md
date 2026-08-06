# Facebook - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-facebook.html

---

# Facebook

Facebook can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Facebook’s OAuth2 service and obtain access tokens for Facebook API resources.

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your Facebook OAuth2 client first, then return to the Facebook developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the Facebook OAuth2 client**

Use the following procedure to set up a Facebook OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a Facebook OAuth2 application**

  1. Create a [developer account with Facebook](<https://developers.facebook.com/docs/facebook-login>).

  2. [Sign in](<https://developers.facebook.com/>) with your Facebook credentials.

  3. From the **My Apps** menu, choose **Create New App**.

###### Note

If you don’t have an existing Facebook app, you will see a different option. Choose **Create App**.

  4. On the **Create an app** page, choose a use case for your app, and then choose **Next**.

  5. Enter a name for your Facebook app and choose **Create App**.

  6. In the navigation bar, choose **App Settings** , and then choose **Basic**.

  7. Record the **App ID** and the **App Secret** . You will use them for configuring the Facebook provider in AgentCore Identity.

  8. Choose **\+ Add platform**.

  9. On the **Select Platform** screen, select your platforms, and then choose **Next**.

  10. Choose **Save changes**.

  11. For **App Domains** , enter the domain of your application and `bedrock-agentcore.region.amazonaws.com`.

  12. Choose **Save changes**.

  13. From the navigation bar, choose **Products** , and then choose **Configure** from **Facebook Login**.

  14. From the **Facebook Login** **Configure** menu, choose **Settings**.

  15. Leave the **Valid OAuth Redirect URIs** field empty for now — you will add the unique callback URL in Step 3.

  16. Choose **Save changes**.


**Step 2: Create the AgentCore Identity credential provider**

To configure Facebook as an outbound resource provider, use the following:

```json
{
  "name": "Facebook",
  "credentialProviderVendor": "FacebookOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret"
    }
  }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with Facebook**

Return to the Facebook developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the Facebook developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



