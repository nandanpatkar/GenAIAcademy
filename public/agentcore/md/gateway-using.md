# Use an AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using.html

---

# Use an AgentCore gateway

After [setting up your gateway with targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-building.html>) , you can configure your application or agent to use the gateway through the [Model Context Protocol (MCP)](<https://modelcontextprotocol.io/docs/getting-started/intro>) . The MCP provides a standardized way for agents to discover and invoke tools.

###### Note

AgentCore Gateway supports the following MCP versions: 2026-07-28, 2025-11-25, 2025-06-18, and 2025-03-26.

Version `2026-07-28` is a stateless protocol revision. Clients do not perform an `initialize` handshake. Each request carries its protocol version in the `MCP-Protocol-Version` header and in the `_meta` field (`io.modelcontextprotocol/protocolVersion`). The gateway discovers capabilities through `server/discover`. Version `2025-11-25` and earlier continue to use the `initialize` handshake.

You can use the following MCP operations with an AgentCore gateway:

Operation | Description  
---|---  
tools/call |  Invokes a specific tool with the provided arguments  
tools/list |  Lists all available tools provided by the gateway  
prompts/list |  Lists all available prompts provided by the gateway  
prompts/get |  Retrieves a specific prompt template, rendered with the provided arguments  
resources/list |  Lists all available resources provided by the gateway  
resources/read |  Reads the contents of a specific resource by URI  
resources/templates/list |  Lists all available resource templates provided by the gateway  
elicitation/create |  Requests additional input from the client during a tool call (server-initiated)  
sampling/createMessage |  Requests an LLM completion from the client during a tool call (server-initiated)  
notifications/progress |  Reports progress on long-running tool calls (server-initiated)  
notifications/message |  Sends log messages from the server during tool execution (server-initiated)  
  
On version `2026-07-28`, server-initiated interactions (`elicitation/create` and `sampling/createMessage`) use the multi round-trip requests (MRTR) pattern:

  1. The server returns an interim result with `resultType` set to `input_required`.

  2. The client provides the requested input on a retry of the original request.


The gateway delivers notifications (`notifications/progress` and `notifications/message`) only for requests that opt in to them. On version `2025-11-25` and earlier, the gateway delivers these interactions as server-initiated messages on the open stream.

The following topics describe how to invoke your AgentCore gateway:

###### Topics

  * [Authorize and authenticate to an AgentCore gateway and gateway target](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using-auth.html>)

  * [List available tools in an AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using-mcp-list.html>)

  * [Call a tool in a AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using-mcp-call.html>)

  * [List available prompts in an AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using-mcp-prompts-list.html>)

  * [Get a prompt from an AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using-mcp-prompts-get.html>)

  * [List available resources in an AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using-mcp-resources-list.html>)

  * [Read a resource from an AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using-mcp-resources-read.html>)

  * [List resource templates in an AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using-mcp-resources-templates-list.html>)

  * [Use elicitation with your AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-elicitation.html>)

  * [Receive progress notifications from your AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-progress.html>)

  * [Receive logging messages from your AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-logging.html>)

  * [Use sampling with your AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-sampling.html>)

  * [Search for tools in your AgentCore gateway with a natural language query](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using-mcp-semantic-search.html>)

  * [Create an agent that uses your AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-agent-integration.html>)



