# Update OAuth client - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-update-oauth-client.html

---

# Update OAuth client

You can modify the configuration settings for your existing OAuth client. For example, you can update your client credentials (Client ID and Client secret) when they’ve been rotated or changed by your identity provider.

**To update an OAuth client**

  1. Open the [AgentCore Identity](<https://console.aws.amazon.com/bedrock-agentcore/identity>) console.

  2. In the **Outbound Auth** section, select the OAuth client you want to update.

  3. Choose **Edit**.

  4. On the **Update OAuth Client** page, update the information as needed. For **Client secret selection method** , choose one of the following options:

     1. **Provide Client secret** – Enter the client secret value directly.

        1. For **Client secret** , enter the updated confidential key associated with your client ID. AgentCore Identity securely stores this value for authentication.

     2. **Provide Client secret via Secrets Manager** – Reference a secret stored in AWS Secrets Manager instead of entering the value directly.

        1. For **Secrets Manager** , enter or select the ARN of the Secrets Manager secret that contains your client secret.

        2. For **JSON key** , enter the JSON key in your Secrets Manager secret that contains the client secret value for your OAuth client.

  5. Choose **Update OAuth Client** to save your configuration settings.


The updated OAuth client configuration takes effect immediately and will be used for all subsequent authentication requests made by your agents.

###### Note

You cannot switch between providing a client secret directly and referencing one stored in AWS Secrets Manager. To change the client secret selection method, delete the OAuth client and create a new one.

