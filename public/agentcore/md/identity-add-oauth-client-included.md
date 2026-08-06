# Add OAuth client using included provider - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-add-oauth-client-included.html

---

# Add OAuth client using included provider

Built-in providers offer streamlined setup for popular services including Google, GitHub, Slack, and Salesforce. These providers have pre-configured authorization server endpoints and provider-specific parameters to reduce development effort.

**To add an OAuth client using an included provider**

  1. Open the [AgentCore Identity](<https://console.aws.amazon.com/bedrock-agentcore/identity>) console.

  2. In the **Outbound Auth** section, choose **Add OAuth client / API key** , and then select **Add OAuth client**.

  3. For **Name** , you can either use the auto-generated name or enter your own descriptive name to help you identify this OAuth client in your account. Use alphanumeric characters, hyphens, and underscores only, with a maximum length of 50 characters.

  4. For **Provider** , choose **Included provider**.

  5. Choose your identity provider from the available options (Google, GitHub, Microsoft, Salesforce, or Slack).

  6. In the **Provider configurations** section, enter your client credentials:

     1. For **Client ID** , enter the unique identifier you received when registering your application with the identity provider.

     2. For **Client secret selection method** , choose one of the following options:

        1. **Provide Client secret** – Enter the client secret value directly.

           1. For **Client secret** , enter the confidential key associated with your client ID. AgentCore Identity securely stores this value for authentication.

        2. **Provide Client secret via Secrets Manager** – Reference a secret stored in AWS Secrets Manager instead of entering the value directly.

           1. For **Secrets Manager** , enter or select the ARN of the Secrets Manager secret that contains your client secret.

           2. For **JSON key** , enter the JSON key in your Secrets Manager secret that contains the client secret value for your OAuth client.

  7. Choose **Add OAuth Client**.


After creating the OAuth client, AgentCore Identity provides an ARN that you can reference in your agent code to request authentication tokens without embedding sensitive credentials in your application. You can find this ARN in the properties page of the OAuth client (Choose the client name in the **Outbound Auth** section).

