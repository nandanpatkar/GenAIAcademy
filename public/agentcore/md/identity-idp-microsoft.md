# Microsoft - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-microsoft.html

---

# Microsoft

Microsoft Entra ID can be configured as an identity provider for accessing AgentCore Gateway and Runtime, or an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate and authorize agent users with Microsoft Entra ID as the identity provider and authorization server, or your agents to obtain credentials to access resources authorized by Microsoft Entra ID.

## Inbound

To add Microsoft Entra ID as an identity provider and authorization server for accessing AgentCore Gateway and Runtime, you must:

  * Configure discovery URL for your Microsoft Entra ID Tenant. This helps AgentCore Identity get the metadata related to your OAuth authorization server and token verification keys.

  * Enter valid `aud` claims for the token. This helps validate the tokens coming from your IDP and allows access for tokens that contain the expected claims.


You can configure these as part of configuration of Gateway and Runtime inbound configuration.

Before configuring Microsoft Entra ID as your identity provider, we recommend completing the basic setup steps outlined in [Integrate with Google Drive using OAuth2](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-getting-started-google.html>) . This ensures your development environment and SDK are properly configured before adding identity provider integration.

We support Microsoft Entra ID for v1.0 and v2.0 Access and ID tokens that do not have any custom claims. You can determine which token versions your entra application is issuing by parsing the JWT and looking at the `ver` claim.

For all token types, in your custom authorizer:

  * **Discovery URL** : Discovery URL should be one of the following:

    * For v1.0 tokens use: `https://login.microsoftonline.com/tenantId/.well-known/openid-configuration`

    * For v2.0 tokens use: `https://login.microsoftonline.com/tenantId/v2.0/.well-known/openid-configuration`

  * **Allowed audiences** : `aud` should be the Application Id.


### Configurations specific for v1.0 Access Tokens

When fetching the token from Microsoft Entra:

  * Include in authorization URL a scope like `entra-application-id/.default` alongside any other scopes your application might require. This allows Microsoft to know that you intend to use the access token against resources other than Microsoft’s Graph API and will result in a token that can be validated by AgentCore Identity.


### Configurations Specific for v2.0 AccessTokens

On Microsoft Entra:

  * While configuring the application, go to the Application Manifest and add `accessTokenAcceptedVersion=2`.

  * On the application, expose an API. The application ID URI and scopes can be whatever is necessary for your application; but, the scope must be included in the authorization URL when retrieving the access token.


### Configurations Specific for v1.0 and v2.0 Id Tokens

On Microsoft Entra:

  * While configuring the application, Enable ID Token Issuance in Application Registration.

  * Include mandatory `openid` scope while calling the authorize and token endpoint for Microsoft Entra Id during Ingress Flows.


## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your Microsoft Entra ID application registration first, then return to the Microsoft Entra admin center to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the Microsoft Entra ID application registration**

Use the following procedure to set up a Microsoft Entra ID application registration and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a Microsoft Entra ID application registration**

  1. Sign in to the Microsoft Entra admin center.

  2. Open **App registrations** and choose **New registration**.

  3. Enter a name for your application.

  4. Under **Supported account types** , select the option appropriate for your application.

  5. Leave the **Redirect URI** field empty for now — you will add the unique callback URL in Step 3.

  6. Choose **Register**.

  7. On the application’s overview page, record the **Application (client) ID** and **Directory (tenant) ID** . You’ll need these values to configure the Microsoft provider in AgentCore Identity.

  8. Open **Certificates & secrets** and create a new client secret. Record the secret value as you’ll need it for AgentCore Identity. Microsoft only displays the secret value once.

  9. Open **API permissions** and add the Microsoft Graph or other permissions your application requires.


For more details, refer to [Quickstart: Register an application](<https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app>) in the Microsoft Entra documentation.

**Step 2: Create the AgentCore Identity credential provider**

To configure the outbound Microsoft resource provider, use the following:

```json
{
        "name": "NAME",
        "credentialProviderVendor": "MicrosoftOAuth2",
        "oauth2ProviderConfigInput": {
            "microsoftOauth2ProviderConfig": {
                "clientId": "your-client-id",
                "clientSecret": "your-client-secret",
                "tenantId": "your-microsoft-entra-tenant"
            }
        }
    }
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with Microsoft Entra**

Return to the Microsoft Entra admin center and add the unique callback URL to your application’s redirect URIs.

  1. Sign in to the Microsoft Entra admin center and open the app registration you created in Step 1.

  2. Open **Authentication** and choose **Add a platform** > **Web**.

  3. Paste the `callbackUrl` value returned by `CreateOauth2CredentialProvider` as the **Redirect URI**.

  4. Choose **Configure** (or **Save**).



