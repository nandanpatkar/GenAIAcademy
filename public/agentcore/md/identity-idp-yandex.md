# Yandex - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-yandex.html

---

# Yandex

Yandex can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Yandex’s OAuth2 service and obtain access tokens for Yandex API resources.

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your Yandex OAuth2 client first, then return to the Yandex developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the Yandex OAuth2 client**

Use the following procedure to set up a Yandex OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a Yandex OAuth2 application**

  1. Open the developer console for Yandex at [https://oauth.yandex.com/](<https://oauth.yandex.com/>).

  2. Choose **Create app**.

  3. Provide a name for your application.

  4. For platforms, select **Web services**.

  5. Choose **Save and Continue**.

  6. Select the permissions necessary for your application and then choose **Save and Continue**.

  7. Leave the redirect URI field empty for now — you will add the unique callback URL in Step 3.

  8. Choose **Save and Continue**.

  9. Once the client has been created, note the client ID and client secret assigned to your application as you’ll need them for configuring the Yandex provider in AgentCore Identity.


For more details, refer to [Yandex’s OAuth documentation](<https://yandex.com/dev/id/doc/en/>).

**Step 2: Create the AgentCore Identity credential provider**

To configure Yandex as an outbound resource provider, use the following:

```json
{
  "name": "Yandex",
  "credentialProviderVendor": "YandexOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret"
    }
  }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with Yandex**

Return to the Yandex developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the Yandex developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



