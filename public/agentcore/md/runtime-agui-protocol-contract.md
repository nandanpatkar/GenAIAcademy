# AG-UI protocol contract - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-agui-protocol-contract.html

---

# AG-UI protocol contract

The AG-UI protocol contract defines the requirements for implementing agent-to-user interface communication in Amazon Bedrock AgentCore Runtime. This contract specifies the technical requirements, endpoints, and communication patterns that your AG-UI agent must implement.

For example code, see [Deploy AG-UI servers in AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-agui.html>).

###### Topics

  * Protocol implementation requirements

  * Container requirements

  * Path requirements

  * Authentication requirements

  * Error handling

  * OAuth authentication responses


## Protocol implementation requirements

Your AG-UI agent must implement these specific protocol requirements:

  * **Transport** : Server-Sent Events (SSE) or WebSocket - SSE provides unidirectional streaming from server to client, while WebSocket enables bidirectional real-time communication

  * **Session Management** : Platform automatically adds `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id` header for session isolation


## Container requirements

Your AG-UI agent must be deployed as a containerized application meeting these specifications:

  * **Host** : `0.0.0.0`

  * **Port** : `8080` \- Standard port for AG-UI agent communication (same as HTTP protocol)

  * **Platform** : ARM64 container - Required for compatibility with AWS Amazon Bedrock AgentCore runtime environment


## Path requirements

### /invocations - POST

#### Purpose

Receives user requests and streams responses as Server-Sent Events (SSE)

#### Use cases

The invocations endpoint serves several key purposes:

  * Streaming chat responses

  * Agent status and thinking steps

  * Tool calls and results


#### Request format

Amazon Bedrock AgentCore passes request payloads directly to your container without validation. To be AG-UI-compliant, your requests should follow the `RunAgentInput` format. Your container implementation determines which fields are required and how validation errors are handled.

AG-UI-compliant agents expect a `RunAgentInput` JSON payload. Example:

```json
{
  "threadId": "thread-123",
  "runId": "run-456",
  "messages": [{"id": "msg-1", "role": "user", "content": "Hello, agent!"}],
  "tools": [],
  "context": [],
  "state": {},
  "forwardedProps": {}
}
```
For the complete `RunAgentInput` schema and message format details, see [AG-UI Types](<https://docs.ag-ui.com/sdk/js/core/types>).

#### Response format

AG-UI agents respond with SSE-formatted event streams:

```text
Content-Type: text/event-stream

data: {"type":"RUN_STARTED","threadId":"thread-123","runId":"run-456"}

data: {"type":"TEXT_MESSAGE_START","messageId":"msg-789","role":"assistant"}

data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"msg-789","delta":"Processing your request"}

data: {"type":"TOOL_CALL_START","toolCallId":"tool-001","toolCallName":"search","parentMessageId":"msg-789"}

data: {"type":"TOOL_CALL_RESULT","messageId":"msg-789","toolCallId":"tool-001","content":"Search completed"}

data: {"type":"TEXT_MESSAGE_END","messageId":"msg-789"}

data: {"type":"RUN_FINISHED","threadId":"thread-123","runId":"run-456"}
```
### /ws - WebSocket

#### Purpose

Provides bidirectional real-time communication between clients and agents

#### Use cases

The WebSocket endpoint serves several key purposes:

  * Real-time conversational interfaces

  * Interactive agent sessions with user interrupts

  * Multi-turn conversations with persistent connections


### /ping - GET

#### Purpose

Verifies that your AG-UI agent is operational and ready to handle requests

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

AG-UI agents support multiple authentication mechanisms:

### OAuth 2.0 Bearer Tokens

For AG-UI client authentication, include the Bearer token in request headers:

```yaml
Authorization: Bearer <oauth-token>
X-Amzn-Bedrock-AgentCore-Runtime-Session-Id: <session-id>
```
### SigV4 Authentication

Standard AWS SigV4 authentication is also supported for programmatic access.

## Error handling

AG-UI serializes every error as an SSE `RUN_ERROR` event (`Content-Type: text/event-stream`), whether the error occurs before or during streaming. The categories differ only in the HTTP status code that accompanies the event:

  * **Connection-level errors** : Occur before the request reaches your container (authentication, authorization, validation, throttling, session conflicts). The `RUN_ERROR` event is returned with the error’s real HTTP status code (for example, 401, 403, or 409).

  * **Runtime errors** : Occur during agent execution after the stream has started. Only `AGENT_ERROR` falls into this category. Its `RUN_ERROR` event returns HTTP 200 because the stream has already begun.


The following table maps each runtime exception to its AG-UI SSE error code, HTTP status code, and message. Some exceptions share an SSE error code but return different messages, so they are listed as separate rows.

SSE Error Code | Runtime Exception | HTTP Error Code | Error Message  
---|---|---|---  
`UNAUTHORIZED` |  UnauthorizedException |  401 |  Authentication required or invalid credentials  
`ACCESS_DENIED` |  AccessDeniedException |  403 |  Insufficient permissions for requested operation  
`VALIDATION_ERROR` |  ValidationException |  400 |  Invalid request data or parameters  
`RATE_LIMIT_EXCEEDED` |  ThrottlingException |  429 |  Too many requests from client  
`SESSION_BUSY` |  ConflictException |  409 |  Resource conflict - Resource already exists  
`SESSION_BUSY` |  RetryableConflictException |  409 |  Session operation in progress, please retry  
`SERVICE_QUOTA_EXCEEDED` |  ServiceQuotaExceededException |  429 |  Service quota exceeded  
`AGENT_ERROR` |  RuntimeClientError |  200 |  Agent code failed during execution – check your CloudWatch logs  
`INTERNAL_ERROR` |  Any other exception |  500 |  An internal error occurred while processing the request  
  
`ConflictException` and `RetryableConflictException` both use the `SESSION_BUSY` SSE error code (HTTP 409) but are distinguished by their message. The service returns `RetryableConflictException` (`Session operation in progress, please retry`) when a second operation reaches a session while the service is provisioning or tearing down that session. It is transient and retryable — retry with short exponential backoff, because AG-UI clients do not auto-retry it.

Example runtime error (agent failure):

```text
HTTP/1.1 200 OK
Content-Type: text/event-stream
x-amzn-requestid: 12345678-1234-1234-1234-123456789012

data: {"type":"RUN_ERROR","code":"AGENT_ERROR","message":"Agent execution failed"}
```
Example session-busy error (retryable conflict):

```text
HTTP/1.1 409 Conflict
Content-Type: text/event-stream
x-amzn-requestid: 12345678-1234-1234-1234-123456789012

data: {"type":"RUN_ERROR","code":"SESSION_BUSY","message":"Session operation in progress, please retry"}
```
## OAuth authentication responses

OAuth-configured agents return authentication errors with standard HTTP status codes. The response includes a `WWW-Authenticate` header (per [RFC 7235](<https://datatracker.ietf.org/doc/html/rfc7235>) ) for OAuth discovery through the GetRuntimeProtectedResourceMetadata API.

Example OAuth authentication error:

```text
HTTP/1.1 401 Unauthorized
Content-Type: text/event-stream
WWW-Authenticate: Bearer resource_metadata="https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{ESCAPED_ARN}/invocations/.well-known/oauth-protected-resource?qualifier={QUALIFIER}"
x-amzn-requestid: 12345678-1234-1234-1234-123456789012

data: {"type":"RUN_ERROR","code":"UNAUTHORIZED","message":"Authentication required"}
```
SigV4-configured agents return HTTP 403 with an `ACCESS_DENIED` error and do not include `WWW-Authenticate` headers.

