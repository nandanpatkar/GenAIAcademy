# Create an AgentCore gateway using the AWS Management Console - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-create-console.html

---

# Create an AgentCore gateway using the AWS Management Console

**To create a gateway using the console**

  1. Open the AgentCore console at [https://console.aws.amazon.com/bedrock-agentcore/home#](<https://console.aws.amazon.com/bedrock-agentcore/home#>).

  2. From the left navigation pane, select **Gateways**.

  3. In the **Gateways** section, choose **Create gateway**.

  4. (Optional) In the **Gateway details** section, do the following:

     1. Change the generated **Gateway name**

     2. Expand the **Additional configurations** section and do the following:

        1. In the **Gateway description** field, provide a description for your gateway.

        2. In the **Instruction** field, enter any special instructions or context that should be passed to tools when they are invoked.

        3. To enable a built-in tool for searching tools in the gateway, select **Enable semantic search** . If you enable this tool, you can’t disable it later. For more information, see [Search for tools in your AgentCore gateway with a natural language query](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using-mcp-semantic-search.html>).

        4. To enable detailed debugging messages to be returned in the gateway response, select **Exception level debug** . You can disable debugging messages later. For more information, see [Turn on debugging messages](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-debug-messages.html>).

  5. In the **Inbound Auth configurations** section, select one of the following options:

     * To allow Amazon Cognito to create authorization resources for you, select **Quick create configurations with Cognito**.

     * To use an authorization configuration that you have set up already, select **Use existing identity provider configurations** and then configure the following fields:

       * **Discovery URL** – Enter the discovery URL from your identity provider.

       * **Allowed audiences** – Enter the audience value that your gateway will accept. To add more audiences, choose **Add audience**.

       * **Allowed clients** – Enter the public identifier of the client that your gateway will accept. To add more clients, choose **Add client**.

       * **Allowed scopes** – Enter a list of permitted scopes that will be validated against the scope claim in the JWT token. The `allowedScopes` authorization field will be configured as a list of strings.

       * **Required custom claims** – Enter a list of required claims that will be validated against the claim name and value contained in the incoming JWT token. For details on configuring the authorizer, see [Configure inbound JWT authorizer](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./inbound-jwt-authorizer.html>)

  6. In the **Permissions** section, do the following:

     1. To use an IAM service role to invoke the gateway on the user’s behalf, select **Use an IAM service role**.

     2. (If you use an IAM service role) Choose one of the following options under **IAM role** :

        * To create a service role with the necessary permissions to access your gateway, choose **Create and use a new service role** and optionally change the generated **Service role name**.

        * To use an existing service role, choose **Use an existing service role** and then select a role from the **Service role name** dropdown menu. Make sure that the service role that you choose has the necessary permissions. For more information, see [AgentCore Gateway service role permissions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-prerequisites-permissions.html#gateway-service-role-permissions>).

  7. (Optional) By default, your gateway is encrypted with an AWS managed key. To encrypt your gateway with a custom KMS key, expand the **KMS key** section, select **Customize encryption settings (advanced)** , and choose a customer managed key. For more information, see [Encrypt your AgentCore gateway with a customer-managed KMS key](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-encryption.html>).

  8. In the **Target: ${target-name}** section, do the following:

     1. (Optional) Change the generated **Target name**.

     2. (Optional) Provide a **Target description**.

     3. For the **Target type** , choose an option. For more information about different target types, see [Add targets to an existing AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-building-adding-targets.html>).

     4. Select or enter how the target type is defined.

     5. For the **Outbound Auth configurations** , select an outbound authorization method. Then, select or provide the necessary details and any optional additional configurations. For more information, see [Set up outbound authorization for your gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-outbound-auth.html>).

  9. To add more targets, choose **Add another target** and repeat the target configuration steps.

  10. Choose **Create gateway**.


After creating your gateway, you can view its details, including the endpoint URL and associated targets.

