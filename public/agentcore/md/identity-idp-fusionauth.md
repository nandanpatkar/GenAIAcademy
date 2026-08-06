# FusionAuth - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-fusionauth.html

---

# FusionAuth

FusionAuth can be configured as an outbound resource credential provider for AgentCore Identity. This allows your agents to authenticate users through FusionAuth’s OAuth2 service and obtain access tokens for FusionAuth API resources.

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your FusionAuth OAuth2 client first, then return to the FusionAuth developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the FusionAuth OAuth2 client**

Use the following procedure to set up a FusionAuth OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a FusionAuth OAuth2 application**

  1. Open the developer console for FusionAuth.

  2. In the main navigation bar, choose **Applications**.

  3. Choose **Add** to create a new application.

  4. Enter a name for your application.

  5. In the form mark the following as required: **Client Authentication** , **PKCE**.

  6. Leave the authorized redirect URLs list empty for now — you will add the unique callback URL in Step 3.

  7. Add the necessary scopes for your application.

  8. Record the client ID and client secret. You’ll need this information to configure the FusionAuth resource provider in AgentCore Identity.


For more details, refer to [FusionAuth’s OAuth documentation](<https://fusionauth.io/docs/lifecycle/authenticate-users/oauth/>).

**Step 2: Create the AgentCore Identity credential provider**

To configure FusionAuth as an outbound resource provider, use the following:

```json
{
  "name": "FusionAuth",
  "credentialProviderVendor": "FusionAuthOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret",
      "authorizationEndpoint": "https://your-tenant-authorization-url",
      "tokenEndpoint": "https://your-tenant-token-endpoint",
      "issuer": "https://your-tenant-token-issuer"
    }
  }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with FusionAuth**

Return to the FusionAuth developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the FusionAuth developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



