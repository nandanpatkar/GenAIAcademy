# MCP protocol contract - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-mcp-protocol-contract.html

---

# MCP protocol contract

Understand the requirements for implementing the Model Context Protocol (MCP) so that agents can call tools and agent servers.

For example code, see [Deploy MCP servers in AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-mcp.html>).

###### Topics

  * Protocol implementation requirements

  * Container requirements

  * Path requirements

  * Error handling

  * OAuth authentication responses


## Protocol implementation requirements

Your MCP server must implement these specific protocol requirements:

  * **Transport** : Streamable-http transport is required. By default, use stateless mode ( `stateless_http=True` ) for compatibility with AWS's session management and load balancing.

  * **Session Management** : Platform automatically adds `Mcp-Session-Id` header for session isolation. In stateless mode, servers must support stateless operation so as to not reject platform generated `Mcp-Session-Id` header.


###### Tip

Amazon Bedrock AgentCore also supports stateful MCP servers ( `stateless_http=False` ) that enable capabilities such as elicitation (multi-turn user interactions) and sampling (LLM-generated content). For MCP protocol version `2025-11-25` and earlier, stateful mode is required for elicitation and sampling, because the server delivers these requests over an open session. For version `2026-07-28` and later, elicitation and sampling use the multi round-trip requests (MRTR) pattern, which does not require stateful mode. For more information about MRTR, see [Multi round-trip requests](<https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr>) in the Model Context Protocol documentation.

Stateful mode carries state within an MCP session across multiple requests. A stateless MCP server keeps state in a backing store that your application manages, such as a database. It uses explicit state handles to reference that state. The server returns a state identifier in a tool result, and the client passes it back on later tool calls to key into the store. For more information about explicit state handles, see [explicit state handles](<https://modelcontextprotocol.io/seps/2567-sessionless-mcp#explicit-state-handles>) in the Model Context Protocol documentation. For more information about stateful MCP servers, see [Stateful MCP server features](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./mcp-stateful-features.html>).

### MCP session management and microVM stickiness

The Model Context Protocol (MCP) uses the `Mcp-Session-Id` header to manage session state and route requests. For the MCP specification, see [MCP Streamable HTTP Transport](<https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http>).

**MicroVM Stickiness** : Amazon Bedrock AgentCore uses the `Mcp-Session-Id` header to route requests to the same microVM instance. Clients must capture the `Mcp-Session-Id` returned in the response and include it in all subsequent requests to ensure session affinity. Without a consistent session ID, each request may be routed to a new microVM, which may result in additional latency due to cold starts.

**Stateless MCP** ( `stateless_http=True` ):

  * Platform generates the `Mcp-Session-Id` and includes it in the request to your MCP server.

  * Your MCP server must accept the platform-provided session ID (do not reject it).

  * Platform returns the same `Mcp-Session-Id` to the client in the response.

  * Client must include this session ID in all subsequent requests for microVM affinity.


**Stateful MCP** ( `stateless_http=False` ):

  * Client sends the initialize request without an `Mcp-Session-Id` header.

  * Platform returns `Mcp-Session-Id` in the response.

  * Client must include this `Mcp-Session-Id` in all subsequent requests for both session state and microVM affinity.


For more details on stateful MCP session management, see the [MCP session management specification](<https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#session-management>).

###### Note

In both modes, Amazon Bedrock AgentCore always returns an `Mcp-Session-Id` header to clients. Always capture and reuse this header for optimal performance.

## Container requirements

Your MCP server must be deployed as a containerized application meeting these specifications:

  * **Host** : `0.0.0.0`

  * **Port** : `8000` \- Standard port for MCP server communication (different from HTTP protocol)

  * **Platform** : ARM64 container - Required for compatibility with AWS Amazon Bedrock AgentCore runtime environment


## Path requirements

### /mcp - POST

**Purpose**

Receives MCP RPC messages and processes them through your agent’s tool capabilities, complete pass-through of [InvokeAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_InvokeAgentRuntime.html>) API payload with standard MCP RPC messages

**Response format**

JSON-RPC based request/response format, supporting both `application/json` and `text/event-stream` as response content-types

**Use cases**

The `/mcp` endpoint serves several key purposes:

  * Tool invocation and management

  * Agent capability discovery

  * Resource access and manipulation

  * Multi-step agent workflows


## Error handling

MCP servers return errors as standard JSON-RPC 2.0 error responses. Most errors are carried in the JSON-RPC `error` object with an HTTP 200 status code, as required by the MCP specification. Only authentication, authorization, and protocol-level request errors use non-200 HTTP status codes. The following table maps each runtime exception to its JSON-RPC error code, HTTP status code, and message. Some exceptions share a JSON-RPC error code but return different messages, so they are listed as separate rows.

JSON-RPC Error Code | Runtime Exception | HTTP Error Code | Error Message  
---|---|---|---  
-32001 |  UnauthorizedException |  401 |  Authentication error - Invalid credentials  
-32002 |  AccessDeniedException |  403 |  Authorization error - Insufficient permissions  
-32003 |  ThrottlingException |  200 |  Rate limit exceeded - Too many requests  
-32003 |  ServiceQuotaExceededException |  200 |  Rate limit exceeded - Too many requests  
-32004 |  ResourceNotFoundException |  200 |  Resource not found - Requested resource does not exist  
-32005 |  ConflictException |  200 |  Resource conflict - Resource already exists  
-32005 |  RetryableConflictException |  200 |  Session operation in progress, please retry  
-32006 |  ValidationException |  200 |  Validation error - Invalid request data  
-32010 |  RuntimeClientError |  200 |  Tool execution error - Please check your CloudWatch logs for more information  
-32011 |  McpRequestUnacceptableException |  406 |  Accept Header Error - MCP protocol requires Accept header: application/json, text/event-stream  
-32603 |  Any other exception |  200 |  Internal error - Server error  
  
`ConflictException` and `RetryableConflictException` both use JSON-RPC error code `-32005` (HTTP 200) but are distinguished by their message. The service returns `RetryableConflictException` (`Session operation in progress, please retry`) when a second operation targets a session while the service is provisioning or tearing down that session. Because MCP returns HTTP 200 with the error in the JSON-RPC body, the caller must inspect the response body and retry with short exponential backoff — MCP clients do not auto-retry it.

Example error response:

```json
{
  "jsonrpc": "2.0",
  "id": "req-001",
  "error": {
    "code": -32005,
    "message": "Session operation in progress, please retry"
  }
}
```
## OAuth authentication responses

OAuth-configured agents follow [RFC 6749 (OAuth 2.0)](<https://datatracker.ietf.org/doc/html/rfc6749>) authentication standards. When authentication is missing, the service returns a 401 Unauthorized response with a WWW-Authenticate header (per [RFC 7235](<https://datatracker.ietf.org/doc/html/rfc7235>) ), enabling clients to discover the authorization server endpoints through the GetRuntimeProtectedResourceMetadata API.

### 401 Unauthorized

Returned when the Authorization header is missing or empty.

Response includes WWW-Authenticate header:

```text
WWW-Authenticate: Bearer resource_metadata="https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{ESCAPED_ARN}/invocations/.well-known/oauth-protected-resource?qualifier={QUALIFIER}"
```
###### Note

SigV4-configured agents return HTTP 403 with an `ACCESS_DENIED` error and do not include `WWW-Authenticate` headers.

