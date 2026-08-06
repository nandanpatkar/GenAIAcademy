# HubSpot - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-hubspot.html

---

# HubSpot

HubSpot can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through HubSpot’s OAuth2 service and obtain access tokens for HubSpot API resources.

###### Note

HubSpot does not support the M2M/Client Credentials flow.

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your HubSpot OAuth2 client first, then return to the HubSpot developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the HubSpot OAuth2 client**

Use the following procedure to set up a HubSpot OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a HubSpot OAuth2 application**

  1. Open the developer console for HubSpot.

  2. In the main navigation bar, choose **Apps**.

  3. Choose **Create App**.

  4. Enter a name for your application.

  5. Open the **Auth** tab. Leave the Redirect URL field empty for now — you will add the unique callback URL in Step 3.

  6. Configure any scopes that are required for your application.

  7. Once your app has been created, go back to the **Auth** tab for your application.

  8. Record the client ID and client secret, you’ll need these when creating the HubSpot resource provider in AgentCore Identity.


For more details, refer to [HubSpot’s OAuth quickstart guide](<https://developers.hubspot.com/docs/apps/legacy-apps/authentication/oauth-quickstart-guide>).

**Step 2: Create the AgentCore Identity credential provider**

To configure HubSpot as an outbound resource provider, use the following:

```json
{
  "name": "Hubspot",
  "credentialProviderVendor": "HubspotOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret"
    }
  }
}
```
###### Note

When calling GetResourceOAuth2Token, the scopes must include `oauth`.

The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with HubSpot**

Return to the HubSpot developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the HubSpot developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



