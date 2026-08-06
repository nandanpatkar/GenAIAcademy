# Delete API key - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-delete-api-key.html

---

# Delete API key

When you no longer need an API key, you can delete it from your account. Deleting an API key removes the stored credentials and makes them unavailable to your agents. Any invocations that reference the deleted API key will fail once it’s removed.

**To delete an API key**

  1. Open the [AgentCore Identity](<https://console.aws.amazon.com/bedrock-agentcore/identity>) console.

  2. In the **Outbound Auth** section, select the API key you want to delete.

  3. Choose **Delete**.

  4. In the confirmation dialog, type `Delete` to confirm the deletion.

  5. Choose **Delete**.


The API key is permanently removed from your account. Any agents or applications that reference this API key’s ARN will no longer be able to access the stored credentials.

