# Set up an Amazon Bedrock AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-building.html

---

# Set up an Amazon Bedrock AgentCore gateway

Amazon Bedrock AgentCore Gateway provides a unified connectivity layer between agents and the tools and resources they need to interact with. Before setting up your Gateway, it’s important to understand how to specify permissions so that you can secure your gateway properly.

###### Topics

  * Gateway workflow

  * [Create an Amazon Bedrock AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-create.html>)

  * [Add targets to an existing AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-building-adding-targets.html>)


## Gateway workflow

The Gateway workflow involves the following steps to connect your agents to external tools:

  1. **Create the tools for your Gateway** \- Define your tools using schemas such as OpenAPI specifications for REST APIs or JSON schemas for Lambda functions. The OpenAPI specifications or tool schemas for your tools are then parsed by Amazon Bedrock AgentCore for creating the Gateway.

  2. **Create a Gateway endpoint** \- Use the AWS console or AWS SDK to create the gateway that will serve as the MCP entry point. Each API endpoint or function will become an MCP-compatible tool, and will be made available through your MCP server URL. To secure the gateway, you can use inbound authorization to control the ingress to the gateway.

  3. **Add targets to your Gateway** \- Configure targets that define how the gateway routes requests to specific tools. To securely connect to backend resources on behalf of authenticated users, use Outbound Authorization. Together, Inbound and Outbound Authorization create a secure bridge between users and their target resources, supporting both IAM credentials and OAuth-based authentication flows.

  4. **Update your agent code** \- Connect your agent to the Gateway endpoint to access all configured tools through the unified MCP interface.



