# Notion - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-notion.html

---

# Notion

Notion can be configured as an AgentCore Identity credential provider for outbound resource access. This allows your agents to authenticate users through Notion’s OAuth2 service and obtain access tokens for Notion API resources.

## Outbound

###### Note

AgentCore Identity issues a unique OAuth2 callback URL for each credential provider you create. The unique callback URL enables session binding, which protects the OAuth2 authorization-code exchange against cross-provider replay and CSRF-style attacks by ensuring an authorization response can only be redeemed against the specific credential provider that initiated it. Because the URL is unique per provider, you won’t know it until **after** you call `CreateOauth2CredentialProvider`. Create your Notion OAuth2 client first, then return to the Notion developer console to register the callback URL once AgentCore Identity has issued it.

**Step 1: Create the Notion OAuth2 client**

Use the following procedure to set up a Notion OAuth2 application and obtain the necessary client credentials for AgentCore Identity. You will register the redirect URI in Step 3, after AgentCore Identity issues the unique callback URL.

**To configure a Notion OAuth2 application**

  1. Open [https://www.notion.so/my-integrations](<https://www.notion.so/my-integrations>).

  2. Choose **\+ New integration**.

  3. Choose **Public integration**.

  4. Provide a name for your integration.

  5. Choose **Submit**.

  6. On the integration details page, open the **OAuth Domain & URIs** section. Leave the redirect URI list empty for now — you will add the unique callback URL in Step 3.

  7. Record the OAuth client ID and OAuth client secret as you’ll need this information to configure the Notion resource provider in AgentCore Identity.


For more details, refer to [Notion’s authorization documentation](<https://developers.notion.com/docs/authorization>).

**Step 2: Create the AgentCore Identity credential provider**

To configure Notion as an outbound resource provider, use the following:

```json
{
  "name": "Notion",
  "credentialProviderVendor": "NotionOauth2",
  "oauth2ProviderConfigInput" : {
    "includedOauth2ProviderConfig": {
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret"
    }
  }
}
```
The [CreateOauth2CredentialProvider](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html>) response includes a `callbackUrl` field. This URL is unique to this credential provider and looks like: `https://bedrock-agentcore.us-east-1.amazonaws.com/identities/oauth2/callback/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`. Save this value for the next step.

**Step 3: Register the unique callback URL with Notion**

Return to the Notion developer console and add the unique callback URL to your OAuth2 application’s redirect URI list.

  1. Sign in to the Notion developer console and open the OAuth2 application you created in Step 1.

  2. Add the `callbackUrl` value returned by `CreateOauth2CredentialProvider` to the application’s redirect URI configuration.

  3. Save your changes.



