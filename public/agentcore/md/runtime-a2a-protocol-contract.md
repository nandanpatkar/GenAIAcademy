# A2A protocol contract - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-a2a-protocol-contract.html

---

# A2A protocol contract

The A2A protocol contract defines the requirements for implementing agent-to-agent communication in Amazon Bedrock AgentCore Runtime. This contract specifies the technical requirements, endpoints, and communication patterns that your A2A server must implement.

For example code, see [Deploy A2A servers in AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-a2a.html>).

###### Topics

  * Protocol implementation requirements

  * Container requirements

  * Path requirements

  * Authentication requirements

  * Error handling

  * OAuth authentication responses


## Protocol implementation requirements

Your A2A server must implement these specific protocol requirements:

  * **Transport** : [JSON-RPC 2.0](<https://www.jsonrpc.org/specification>) over HTTP - Enables standardized agent-to-agent communication

  * **Session Management** : Platform automatically adds `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id` header for session isolation

  * **Agent Discovery** : Must provide Agent Card at `/.well-known/agent-card.json` endpoint


## Container requirements

Your A2A server must be deployed as a containerized application meeting these specifications:

  * **Host** : `0.0.0.0`

  * **Port** : `9000` \- Standard port for A2A server communication (different from HTTP and MCP protocols)

  * **Platform** : ARM64 container - Required for compatibility with AWS Amazon Bedrock AgentCore runtime environment


## Path requirements

### / - POST

#### Purpose

Receives JSON-RPC 2.0 messages and processes them through your agent’s capabilities, complete pass-through of [InvokeAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_InvokeAgentRuntime.html>) API payload with A2A protocol messages

#### Use cases

The root endpoint serves several key purposes:

  * Agent-to-agent communication and collaboration

  * Multi-step agent workflows and task delegation

  * Real-time conversational experiences between agents

  * Tool invocation and capability sharing


#### Request format

A2A servers expect JSON-RPC 2.0 formatted requests:

```text
Content-Type: application/json
{
  "jsonrpc": "2.0",
  "id": "req-001",
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "Your message content here"
        }
      ],
      "messageId": "unique-message-id"
    }
  }
}
```
#### Response format

A2A servers respond with JSON-RPC 2.0 formatted responses containing tasks and artifacts:

```text
Content-Type: application/json
{
  "jsonrpc": "2.0",
  "id": "req-001",
  "result": {
    "artifacts": [
      {
        "artifactId": "unique-artifact-id",
        "name": "agent_response",
        "parts": [
          {
            "kind": "text",
            "text": "Agent response content"
          }
        ]
      }
    ]
  }
}
```
### /.well-known/agent-card.json - GET

#### Purpose

Provides Agent Card metadata for agent discovery and capability advertisement

#### Use cases

The Agent Card endpoint serves several key purposes:

  * Agent discovery in multi-agent systems

  * Capability and skill advertisement

  * Authentication requirement specification

  * Service endpoint configuration


#### Response format

Returns JSON metadata describing the agent’s identity and capabilities:

```text
Content-Type: application/json
{
  "name": "Agent Name",
  "description": "Agent description and purpose",
  "version": "1.0.0",
  "url": "https://bedrock-agentcore.region.amazonaws.com/runtimes/agent-arn/invocations/",
  "protocolVersion": "0.3.0",
  "preferredTransport": "JSONRPC",
  "capabilities": {
    "streaming": true
  },
  "defaultInputModes": ["text"],
  "defaultOutputModes": ["text"],
  "skills": [
    {
      "id": "skill-id",
      "name": "Skill Name",
      "description": "Skill description and capabilities",
      "tags": []
    }
  ]
}
```
### /ping - GET

#### Purpose

Verifies that your A2A server is operational and ready to handle requests

#### Response format

Returns a status code indicating your agent’s health:

  * **Content-Type** : `application/json`

  * **HTTP Status Code** : `200` for healthy, appropriate error codes for unhealthy states


```json
{
  "status": "Healthy"
}
```
`status` is required and is one of `Healthy` or `HealthyBusy`. While the status is `HealthyBusy`, the runtime session is kept alive.

An optional `time_of_last_update` field (a Unix timestamp in seconds) may be included to report when the `status` last changed.

###### Warning

Do not set `time_of_last_update` to the current time on every ping. A timestamp that advances on every ping signals a continuous status change, which prevents the idle session timeout from ever firing — sessions then persist until `MaxLifetime` and can exhaust your session quota. If you omit the field, the platform tracks status changes on its own. If you use the Bedrock AgentCore SDK, the ping response is handled for you.

## Authentication requirements

A2A servers support multiple authentication mechanisms:

### OAuth 2.0 Bearer Tokens

For A2A client authentication, include the Bearer token in request headers:

```yaml
Authorization: Bearer <oauth-token>
X-Amzn-Bedrock-AgentCore-Runtime-Session-Id: <session-id>
```
### SigV4 Authentication

Standard AWS SigV4 authentication is also supported for programmatic access.

## Error handling

A2A servers return errors as standard JSON-RPC 2.0 error responses. The following table maps each runtime exception to its JSON-RPC error code, HTTP status code, and message. Some exceptions share a JSON-RPC error code but return different messages, so they are listed as separate rows.

JSON-RPC Error Code | Runtime Exception | HTTP Error Code | JSON-RPC Error Message  
---|---|---|---  
Not applicable |  AccessDeniedException |  403 |  Access denied (returned as a standard HTTP error, not a JSON-RPC error)  
-32051 |  ResourceNotFoundException |  404 |  Resource not found - Requested resource does not exist  
-32052 |  ValidationException |  400 |  Validation error - Invalid request data  
-32053 |  ThrottlingException |  429 |  Rate limit exceeded - Too many requests  
-32053 |  ServiceQuotaExceededException |  429 |  Rate limit exceeded - Too many requests  
-32054 |  ConflictException |  409 |  Resource conflict - Resource already exists  
-32054 |  RetryableConflictException |  409 |  Session operation in progress, please retry  
-32055 |  RuntimeClientError |  424 |  Runtime client error - Please check your CloudWatch logs for more information  
-32603 |  Any other exception |  500 |  Internal error - An unexpected error occurred while processing the request  
  
`ConflictException` and `RetryableConflictException` both use JSON-RPC error code `-32054` (HTTP 409). Their messages distinguish them. The service returns `RetryableConflictException` (`Session operation in progress, please retry`) when a second operation targets a session that the service is provisioning or tearing down. This condition is transient and retryable. The caller must retry with short exponential backoff, because A2A clients do not auto-retry it.

###### Note

Unlike the A2A specification’s convention of delivering JSON-RPC errors over an HTTP 200 response, AgentCore Runtime returns the real HTTP status code (for example, 409 or 404). Parse the JSON-RPC `error` body even on non-2xx responses, so your client does not miss the error code (such as `-32054`) or the `Session operation in progress, please retry` message it needs to drive a retry.

Example error response:

```json
{
  "jsonrpc": "2.0",
  "id": "req-001",
  "error": {
    "code": -32052,
    "message": "Validation error - Invalid request data"
  }
}
```
## OAuth authentication responses

OAuth-configured agents follow [RFC 6749 (OAuth 2.0)](<https://datatracker.ietf.org/doc/html/rfc6749>) authentication standards. When authentication is missing, the service returns a 401 Unauthorized response with a WWW-Authenticate header (per [RFC 7235](<https://datatracker.ietf.org/doc/html/rfc7235>) ), enabling clients to discover the authorization server endpoints through the GetRuntimeProtectedResourceMetadata API.

### 401 Unauthorized - Missing Authentication

```text
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{ESCAPED_ARN}/invocations/.well-known/oauth-protected-resource?qualifier={QUALIFIER}"
```
###### Note

SigV4-configured agents return HTTP 403 with an `ACCESS_DENIED` error and do not include `WWW-Authenticate` headers.

