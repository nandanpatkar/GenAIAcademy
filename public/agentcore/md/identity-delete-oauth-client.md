# Delete OAuth client - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-delete-oauth-client.html

---

# Delete OAuth client

When you no longer need an OAuth client, you can delete it from your account. Deleting an OAuth client removes the stored configuration and credentials, making them unavailable to your agents. Any invocations that reference the deleted OAuth client will fail once it’s removed, and this outbound authentication might be used across multiple runtimes and gateways.

**To delete an OAuth client**

  1. Open the [AgentCore Identity](<https://console.aws.amazon.com/bedrock-agentcore/identity>) console.

  2. In the **Outbound Auth** section, select the OAuth client you want to delete.

  3. Choose **Delete**.

  4. In the confirmation dialog, type `Delete` to confirm the deletion.

  5. Choose **Delete**.


The OAuth client is permanently removed from your account. Any agents or applications that reference this OAuth client’s ARN will no longer be able to access the stored credentials.

