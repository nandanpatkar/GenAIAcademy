# Use the MCP Inspector - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-inspector.html

---

# Use the MCP Inspector

The MCP Inspector, available through the [Model Context Protocol (MCP)](<https://modelcontextprotocol.io/docs/getting-started/intro>) , is a developer tool that helps you test and debug MCP servers by through an interactive interface. You can connect your AgentCore gateway to the MCP inspector to help you debug your gateway targets.

For more information about the MCP Inspector, see the [MCP Inspector documentation](<https://modelcontextprotocol.io/docs/tools/inspector>).

**To connect your gateway to the inspector**

  1. Open a terminal and run `npx @modelcontextprotocol/inspector` to do the following:

     1. Install the inspector

     2. Start the inspector on localhost.

     3. Generate a session token for authentication.

     4. Open your browser to the inspector interfacee.

  2. In the inspector interface, configure the following fields:

     * **Transport Type** – Select **Streamable HTTP**

     * **URL** – Enter the gateway endpoint URL returned when you created your gateway.

     * Expand **Authentication** . The **Custom Headers** section should be pre-populated with one key-value pair.

       * The key’s name should be `Authorization`.

       * Replace the value with your gateway’s [inbound authorization credentials](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-inbound-auth.html>).

  3. Choose **Connect** . You will be connected to your gateway. You can use the MCP Inspector as a tool to examine and test your gateway before integrating it with your agent.


For more information about how you can inspect the MCP server that your gateway is connected to, see **Feature overview** in the [Feature overview](<https://modelcontextprotocol.io/docs/tools/inspector>) in the [MCP Inspector documentation](<https://modelcontextprotocol.io/docs/tools/inspector>).

###### Important

The MCP Inspector is a development tool and should not be used in production environments. Always secure your access tokens and gateway credentials.

## Troubleshooting

If you encounter issues when using the MCP Inspector with your gateway, check the following:

  * **Connection issues** : Ensure that your gateway URL is correct and accessible from your network

  * **Authentication issues** : Verify that your access token is valid and has not expired

  * **Tool invocation errors** : Check the error messages in the response and ensure that your input parameters match the tool’s schema

  * **Proxy errors** : If you see errors related to the proxy connection, try restarting the MCP Inspector



