# Create an Amazon Bedrock AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-create.html

---

# Create an Amazon Bedrock AgentCore gateway

This guide walks you through the process of creating and configuring an Amazon Bedrock AgentCore Gateway. The Gateway serves as a unified entry point for agents to access tools and resources through the Model Context Protocol (MCP) and creating it is the first step in building your tool integration platform. When you create a gateway, you create a managed service that handles authentication and invokes callable endpoints as tools.

To create a gateway, you set up inbound authorization and configure invocable targets. Targets establish the connection between your gateway and various tool types, including Lambda functions and REST API services. Each target contains configuration details that specify the tool location, authentication requirements, and any necessary request transformation rules.

You can create a gateway in the following ways:

  * **AWS Management Console** – With the console, you can configure authorization, create the gateway, and add targets all on one page.

  * **AgentCore CLI** – Create gateways and targets with simplified commands that handle common configurations automatically.

  * **Amazon Bedrock AgentCore API** – You can directly invoke the [CreateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGateway.html>) API or through the help of a supported tool. If you use the API, you will add targets to your gateway in a separate step.


###### Note

When you create a gateway, a [workload identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-manage-agent-ids.html>) is automatically created for the gateway.

**Gateway features that can be set during creation**

You can activate the following features of the gateway during creation:

  * **Protocol configuration** – Configure how the gateway implements the protocol.

  * **Custom encryption of the gateway** – Specify the Amazon Resource Name (ARN) of a customer-managed AWS KMS key for greater control over the encryption process of your resource. If you don’t include one, AWS encrypts the resource with an AWS-managed key. For more information, see [Encrypt your AgentCore gateway with a customer-managed KMS key](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-encryption.html>).

  * **Debug mode** – Allow the return of specific error messages during gateway invocation to help you with debugging. For more information, see [Turn on debugging messages](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-debug-messages.html>).

  * **Semantic search** – Add the `x_amz_bedrock_agentcore_search` to the gateway so that the target can deliver tools that are relevant to the search query. For more information, see [Search for tools in your AgentCore gateway with a natural language query](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using-mcp-semantic-search.html>).

###### Note

Note the following for semantic search: **You can only enable semantic search when creating a gateway. After you’ve created a gateway, you can’t change its configuration to enable semantic search.** For an identity to create a gateway with semantic search, ensure that it has permissions to use the `bedrock-agentcore:SynchronizeGatewayTargets` IAM action.

  * **Policy engine configuration** – Attach a policy engine to control what actions agents can perform when calling tools through the gateway. Policy engines use Cedar policies to define authorization rules with enforcement modes for logging only or actively enforcing access decisions.

  * **Gateway interceptors** – Allow you to run custom code during each invocation of your gateway. For more information, see [Using interceptors with Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-interceptors.html>).


Select a topic to learn how to create a gateway using that method:

###### Topics

  * [Create an AgentCore gateway using the AWS Management Console](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-create-console.html>)

  * [Create an AgentCore gateway using the CLI](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-create-cli.html>)

  * [Create an AgentCore gateway using the API](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-create-api.html>)



