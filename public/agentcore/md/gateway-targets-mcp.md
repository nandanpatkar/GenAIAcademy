# MCP targets - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-targets-mcp.html

---

# MCP targets

MCP targets operate in aggregation mode — the gateway acts as an MCP server whose capabilities combine those of all its MCP targets. Clients see a single consolidated `tools/list` response that includes tools from all attached MCP targets. MCP targets support capability synchronization, semantic tool search, and three-legged OAuth (3LO) at the target level.

The following topics describe the MCP target types that you can add to your gateway.

###### Topics

  * [AWS Lambda function targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-lambda.html>)

  * [Amazon API Gateway REST API stages as targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-api-gateway.html>)

  * [OpenAPI schema targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-schema-openapi.html>)

  * [Smithy model targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-building-smithy-targets.html>)

  * [MCP servers targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-MCPservers.html>)

  * [Built-in templates from integration providers as targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-integrations.html>)

  * [Built-in connectors as targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-connectors.html>)

  * [Understand how AgentCore Gateway tools are named](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-tool-naming.html>)



