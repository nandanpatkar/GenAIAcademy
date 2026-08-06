# Salesforce - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-salesforce.html

---

# Salesforce

Salesforce can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Salesforce’s OAuth2 service and obtain access tokens for Salesforce API resources.

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your Salesforce OAuth2 client first, then return to the Salesforce developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the Salesforce OAuth2 client**

Use the following procedure to set up a Salesforce OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a Salesforce OAuth2 application**

  1. In the developer portal for Salesforce, create a connected app and enter the name and other requested information specific to your application.

  2. Enable and configure the OAuth settings for the application. Leave the callback URL field empty for now — you will add the unique callback URL in Step 3.

  3. Choose the necessary scopes and permissions your application will need.

  4. Choose **Require Proof Key for Code Exchange (PKCE) Extension for Supported Authorization Flows**.

  5. Choose **Require Secret for the Web Server Flow**.

  6. Choose **Enable Authorization Code and Credentials Flow**.

  7. If you wish to use Salesforce as a ClientCredentials/M2M provider then choose **Enable Client Credentials Flow** and follow the prompts.

  8. Save your application and copy the client ID and client secret that is issued for the application. You will need these to configure Salesforce in AgentCore Identity.


For more details, refer to Salesforce’s documentation [Define an OpenID Connect Provider](<https://help.salesforce.com/s/articleView?id=xcloud.service_provider_define_oid.htm>).

**Step 2: Create the AgentCore Identity credential provider**

To configure the outbound Salesforce resource provider, use the following:

```json
{
        "name": "NAME",
        "credentialProviderVendor": "SalesforceOauth2",
        "oauth2ProviderConfigInput": {
            "SalesforceOauth2ProviderConfigInput": {
                "clientId": "your-client-id",
                "clientSecret": "your-client-secret",
            }
        },
    }
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with Salesforce**

Return to the Salesforce developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the Salesforce developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



