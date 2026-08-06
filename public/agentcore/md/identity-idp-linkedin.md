# LinkedIn - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-linkedin.html

---

# LinkedIn

LinkedIn can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through LinkedIn’s OAuth2 service and obtain access tokens for LinkedIn API resources.

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your LinkedIn OAuth2 client first, then return to the LinkedIn developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the LinkedIn OAuth2 client**

Use the following procedure to set up a LinkedIn OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a LinkedIn OAuth2 application**

  1. Open LinkedIn’s developer portal and create an application.

  2. In the Auth tab, note the client ID and client secret as you’ll need this information to configure LinkedIn as a provider in AgentCore Identity.

  3. Under the OAuth2 settings section, leave the authorized redirect URL list empty for now — you will add the unique callback URL in Step 3.

  4. Configure any scopes that are necessary for your application.


For more information about LinkedIn authentication, see [Authentication overview](<https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication>) on the Microsoft website.

**Step 2: Create the AgentCore Identity credential provider**

To configure LinkedIn as an outbound resource provider, use the following configuration:

```json
{
   "name": "NAME",
   "credentialProviderVendor": "LinkedInOAuth2",
   "oauth2ProviderConfigInput": {
       "linkedInOauth2ProviderConfig": {
           "clientId": "your-client-id",
           "clientSecret": "your-client-secret"
       }
   }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with LinkedIn**

Return to the LinkedIn developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the LinkedIn developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



