# Create an AgentCore gateway using the CLI - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-create-cli.html

---

# Create an AgentCore gateway using the CLI

You can use the AgentCore CLI to create gateways with simplified commands. The CLI handles common configurations automatically, including IAM role creation and authorization setup.

###### Example

AgentCore CLI
    

  1. Create a gateway without authorization:

```bash
agentcore add gateway \
  --name MyGateway \
  --authorizer-type NONE \
  --runtimes MyAgent
agentcore deploy
```
Create a gateway with JWT authorization:

```bash
agentcore add gateway \
  --name MyGateway \
  --authorizer-type CUSTOM_JWT \
  --discovery-url https://your-idp.example.com/.well-known/openid-configuration \
  --allowed-audience your-audience
agentcore deploy
```
Semantic search is enabled by default. To disable it, pass the `--no-semantic-search` flag:

```bash
agentcore add gateway \
  --name MyGateway \
  --authorizer-type NONE \
  --runtimes MyAgent \
  --no-semantic-search
agentcore deploy
```
Interactive
    

  1. You can also use the AgentCore CLI interactive terminal UI. Run `agentcore` to open the TUI, then select **add** and choose **Gateway** :

  2. In the **Add Resource** menu, select **Gateway** and press **Enter**.

![TUI Add Resource menu with Gateway highlighted](/agentcore/images/gateway-add-resource.png)

  3. Enter a name for your gateway and press **Enter**.

![TUI gateway wizard Name step with text input](/agentcore/images/gateway-add-name.png)

  4. Select the authorizer type for your gateway. Choose **None** , **Custom JWT** , or **IAM** , then press **Enter**.

![TUI gateway wizard Authorizer step showing None selected](/agentcore/images/gateway-add-auth-none.png)

  5. (Optional) Configure advanced settings such as semantic search and debug exception level. Use **Space** to toggle options, then press **Enter** to continue.

![TUI gateway wizard Advanced Configuration step with Semantic Search enabled](/agentcore/images/gateway-add-advanced.png)

  6. Review the gateway configuration summary and press **Enter** to confirm.

![TUI gateway wizard Review Configuration summary](/agentcore/images/gateway-add-confirm.png)


After creating the gateway, you can add targets using the `agentcore add gateway-target` command. For more information about CLI commands, see the [Get started with AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-quick-start.html>).

