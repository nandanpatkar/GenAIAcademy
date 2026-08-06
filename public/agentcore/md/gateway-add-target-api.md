# Add a target using the API - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-add-target-api.html

---

# Add a target using the API

To add a target using the API, make a [CreateGatewayTarget](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGatewayTarget.html>) request with one of the [AgentCore control plane endpoints](<https://docs.aws.amazon.com/general/latest/gr/bedrock_agentcore.html#bedrock_agentcore_cp>) and define a target configuration that matches the target type.

###### Note

To add an integration provider template as a gateway target, you must use the AWS Management Console. For more information, see [Built-in templates from integration providers as targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-integrations.html>).

When you create a gateway target, you specify the following configurations depending on what you set up when you fulfilled the prerequisites:

  * **A credential provider configuration** – To specify the authorization type and credentials to access the target.

  * **A target configuration** – To specify the target, tools, and how the gateway communicates with the target.


To learn more about each type of configuration, see the following topics:

###### Topics

  * [Specify the authorization type and credentials to access the gateway target](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-building-adding-targets-authorization.html>)

  * [Define the gateway target configuration](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html>)



