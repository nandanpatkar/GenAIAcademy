# CyberArk - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-cyberark.html

---

# CyberArk

CyberArk can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through CyberArk’s OAuth2 service and obtain access tokens for CyberArk API resources.

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your CyberArk OAuth2 client first, then return to the CyberArk developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the CyberArk OAuth2 client**

Use the following procedure to set up a CyberArk OpenID Connect application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a CyberArk OAuth2 application**

  1. Open the developer console for CyberArk.

  2. Open **Identity Administration** and then choose **Web Apps**.

  3. Open the **Custom** tab.

  4. Create a custom **OpenID Connect** application.

  5. Open the **Trust** page. Leave the **Authorized Redirect URIs** field empty for now — you will add the unique callback URL in Step 3.

  6. Record the client ID and client secret generated as you’ll need this information to configure the CyberArk resource provider in AgentCore Identity.

  7. Configure any scopes necessary for your application.

  8. Deploy the application by setting the appropriate permissions by opening the **Permissions** page and adding the relevant permissions.


For more details, refer to [CyberArk’s OpenID Connect documentation](<https://docs.cyberark.com/identity/latest/en/content/applications/appscustom/openidaddconfigapp.htm>).

**Step 2: Create the AgentCore Identity credential provider**

To configure CyberArk as an outbound resource provider, use the following:

```json
{
  "name": "CyberArk",
  "credentialProviderVendor": "CyberArkOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret",
      "authorizationEndpoint": "https://your-tenant-id.id.cyberark.cloud/OAuth2/Authorize/__idaptive_cybr_user_oidc",
      "tokenEndpoint": "https://your-tenant-id.id.cyberark.cloud/OAuth2/Token/__idaptive_cybr_user_oidc",
      "issuer": "https://your-tenant-id.id.cyberark.cloud/__idaptive_cybr_user_oidc"
    }
  }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with CyberArk**

Return to the CyberArk developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the CyberArk developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



