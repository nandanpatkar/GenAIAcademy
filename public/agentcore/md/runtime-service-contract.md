# Understand the AgentCore Runtime service contract - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-service-contract.html

---

# Understand the AgentCore Runtime service contract

The AgentCore Runtime service contract defines the standardized communication protocol that your agent application must implement to integrate with the Amazon Bedrock agent hosting infrastructure. This contract ensures seamless communication between your custom agent code and AWS's managed hosting environment.

###### Topics

  * Supported protocols

  * Compare supported protocols

  * [HTTP protocol contract](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-http-protocol-contract.html>)

  * [MCP protocol contract](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-mcp-protocol-contract.html>)

  * [A2A protocol contract](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-a2a-protocol-contract.html>)

  * [AG-UI protocol contract](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-agui-protocol-contract.html>)


## Supported protocols

The AgentCore Runtime service contract supports the following communication protocols:

  * [HTTP](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-http-protocol-contract.html>) : Direct REST API endpoints for traditional request/response patterns

  * [MCP](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-mcp-protocol-contract.html>) : Model Context Protocol for tools and agent servers

  * [A2A](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-a2a-protocol-contract.html>) : Agent-to-Agent protocol for multi-agent communication and discovery

  * [AG-UI](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-agui-protocol-contract.html>) : Agent-to-User Interface protocol for interactive agent experiences with UI rendering


## Compare supported protocols

Compare the HTTP, MCP, A2A, and AG-UI protocols to understand the differences and use cases.

Feature | HTTP Protocol | MCP Protocol | A2A Protocol | AG-UI Protocol  
---|---|---|---|---  
**Port** |  8080 |  8000 |  9000 |  8080  
**Mount Path** |  /invocations (HTTP), /ws (WebSocket) |  /mcp |  / (root) |  /invocations (SSE), /ws (WebSocket)  
**Message Format** |  REST JSON/SSE, WebSocket (text/binary) |  JSON-RPC |  JSON-RPC 2.0 |  Event streams (SSE/WebSocket)  
**Discovery** |  N/A |  Tool listing |  Agent Cards |  N/A  
**Authentication** |  SigV4, OAuth 2.0; WebSocket supports SigV4 by headers and query params |  SigV4, OAuth 2.0 |  SigV4, OAuth 2.0 |  SigV4, OAuth 2.0  
**Use Case** |  Direct API calls, real-time streaming |  Tool servers |  Agent-to-agent communication |  Interactive UI experiences

