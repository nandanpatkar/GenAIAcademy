# Twitch - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-twitch.html

---

# Twitch

Twitch can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Twitch’s OAuth2 service and obtain access tokens for Twitch API resources.

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your Twitch OAuth2 client first, then return to the Twitch developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the Twitch OAuth2 client**

Use the following procedure to set up a Twitch OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a Twitch OAuth2 application**

  1. Sign in to the Twitch developer console.

  2. Choose the **Applications** tab and then choose **Register your Application**.

  3. Set a name for your application.

  4. Leave the **OAuth Redirect URLs** field empty for now — you will add the unique callback URL in Step 3.

  5. Select the application category that is appropriate for the application you’re developing (most likely this will be **Chat bot** ).

  6. Set **Client Type** as **Confidential**.

  7. Choose **Create**.

  8. On the application details page, record the client ID and client secret as you’ll need this information for configuring the Twitch resource provider in AgentCore Identity.


For more details, refer to [Twitch’s app registration documentation](<https://dev.twitch.tv/docs/authentication/register-app/>).

**Step 2: Create the AgentCore Identity credential provider**

To configure Twitch as an outbound resource provider, use the following:

```json
{
  "name": "Twitch",
  "credentialProviderVendor": "TwitchOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret"
    }
  }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with Twitch**

Return to the Twitch developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the Twitch developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



