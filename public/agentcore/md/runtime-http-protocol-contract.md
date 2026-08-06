# HTTP protocol contract - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-http-protocol-contract.html

---

# HTTP protocol contract  
  
Understand the requirements for implementing the HTTP protocol in your agent application. Use the HTTP protocol to create direct REST API endpoints for traditional request/response patterns and WebSocket endpoints for real-time bidirectional streaming connections.

###### Note

Both HTTP ( `/invocations` ) and WebSocket ( `/ws` ) endpoints can be deployed on the same container using port 8080, allowing a single agent implementation to support both traditional API interactions and real-time bidirectional streaming.

For example code, see [Get started with the AgentCore CLI](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-get-started-cli.html>).

###### Topics

  * Container requirements

  * Path requirements

  * Error handling

  * OAuth authentication responses


## Container requirements

Your agent must be deployed as a containerized application meeting these specifications:

  * **Host** : `0.0.0.0`

  * **Port** : `8080` \- Standard port for HTTP-based agent communication

  * **Platform** : ARM64 container - Required for compatibility with the AgentCore Runtime environment


## Path requirements

### /invocations - POST

This is the primary agent interaction endpoint with JSON input and JSON/SSE output.

**Purpose**

Receives incoming requests from users or applications and processes them through your agent’s business logic

**Use cases**

The `/invocations` endpoint serves several key purposes:

  * Direct user interactions and conversations

  * API integrations with external systems

  * Batch processing of multiple requests

  * Real-time streaming responses for long-running operations


**Example Request format**

```text
Content-Type: application/json

{
  "prompt": "What's the weather today?"
}
```
**Response formats**

Your agent can respond using either of the following formats depending on the use case:

#### JSON response (non-streaming)

**Purpose**

Provides complete responses for requests that can be processed quickly

**Use cases**

JSON responses are ideal for:

  * Simple question-answering scenarios

  * Deterministic computations

  * Quick data lookups

  * Status confirmations


**Example JSON response format**

```text
Content-Type: application/json

{
  "response": "Your agent's response here",
  "status": "success"
}
```
#### SSE response (streaming)

Server-sent events (SSE) let you deliver real-time streaming responses. For more information, see the [Server-sent events](<https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events>) specification.

**Purpose**

Enables incremental response delivery for long-running operations and improved user experience

**Use cases**

SSE responses are ideal for:

  * Real-time conversational experiences

  * Progressive content generation

  * Long-running computations with intermediate results

  * Live data feeds and updates


**Example SSE response format**

```text
Content-Type: text/event-stream

data: {"event": "partial response 1"}
data: {"event": "partial response 2"}
data: {"event": "final response"}
```
### /ws - WebSocket (Optional)

This is the primary WebSocket connection endpoint for real-time bidirectional communication.

**Purpose**

Accepts WebSocket upgrade requests and maintains persistent connections for streaming agent interactions

**Use cases**

The `/ws` endpoint serves several key purposes:

  * Real-time conversational interfaces

  * Interactive agent sessions with immediate feedback

  * Streaming data processing with bidirectional communication


**Connection establishment**

WebSocket connections begin with an HTTP upgrade request:

**Example HTTP Upgrade Request**

```text
GET /ws HTTP/1.1
Host: agent-endpoint
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
X-Amzn-Bedrock-AgentCore-Runtime-Session-Id: session-uuid
```
**Example WebSocket Upgrade Response**

```text
HTTP/1.1 101 Switching Protocols
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```
**Message handling requirements**

Your WebSocket endpoint must handle:

  * **Connection acceptance** : Call `await websocket.accept()` to establish the connection

  * **Message reception** : Support text or binary message types based on your application requirement

  * **Message processing** : Handle incoming messages according to your agent’s business logic

  * **Response sending** : Send appropriate responses using `send_text()` or `send_bytes()`

  * **Connection lifecycle** : Manage connection establishment, maintenance, and termination


#### Message formats

##### Text Messages

##### JSON Format (Recommended)

**Purpose**

Structured data exchange for agent interactions

**Example message**

```json
{
  "prompt": "Hello, can you help me with this question?",
  "session_id": "session-uuid",
  "message_type": "user_message"
}
```
**Example response**

```json
{
  "response": "I'd be happy to help you with your question!",
  "session_id": "session-uuid",
  "message_type": "agent_response"
}
```
##### Plain Text Format

**Purpose**

Simple text-based communication

**Example**

```text
Hello, can you help me with this question?
```
##### Binary Messages

**Purpose**

Support for non-text data such as images, audio, or other binary formats

**Use cases**

Binary messages support several scenarios:

  * Multi-modal agent interactions

  * File uploads and downloads

  * Compressed data transmission

  * Binary protocol data


**Handling requirements**

Binary message handling requires:

  * Use `receive_bytes()` and `send_bytes()` methods

  * Implement appropriate binary data processing

  * Consider message size limitations


#### Connection lifecycle

##### Connection Establishment

  1. **HTTP Handshake** : Client sends WebSocket upgrade request

  2. **Upgrade Response** : Agent accepts and returns 101 Switching Protocols

  3. **WebSocket Active** : Bidirectional communication begins

  4. **Session Binding** : Associate connection with session identifier


##### Message Exchange

  1. **Continuous Loop** : Implement message listening loop

  2. **Message Processing** : Handle incoming messages asynchronously

  3. **Response Generation** : Send appropriate responses

  4. **Error Handling** : Manage exceptions and connection issues


### /ping - GET

**Purpose**

Verifies that your agent is operational and ready to handle requests

**Use cases**

The `/ping` endpoint serves several key purposes:

  * Service monitoring to detect and remediate issues

  * Automated recovery through AWS's managed infrastructure


**Response format**

Returns a status code indicating your agent’s health:

  * **Content-Type** : `application/json`

  * **HTTP Status Code** : `200` for healthy, appropriate error codes for unhealthy states


If your agent needs to process background tasks, you can indicate it with the `/ping` status. If the ping status is `HealthyBusy` , the runtime session is considered active.

**Example Ping response format**

```json
{
  "status": "<status_value>"
}
```
**status** (required)
    

`Healthy` \- System is ready to accept new work

`HealthyBusy` \- System is operational but currently busy with async tasks. While the status is `HealthyBusy`, the runtime session is considered active and is kept alive.

**time_of_last_update** (optional)
    

Unix timestamp (in seconds) of when the `status` last changed. Set it only on an actual status change.

###### Warning

Do not set `time_of_last_update` to the current time on every ping. A timestamp that advances on every ping signals a continuous status change, which prevents the idle session timeout from ever firing — sessions then persist until `MaxLifetime` and can exhaust your session quota. If you omit the field, the platform tracks status changes on its own. If you use the Bedrock AgentCore SDK, the ping response is handled for you.

## Error handling

Unlike the A2A, MCP, and AG-UI protocols, the HTTP protocol does not wrap errors in a protocol-specific envelope. The service returns errors directly as native HTTP responses: the HTTP status code reflects the exception, and the `x-amzn-ErrorType` response header carries the exception name. The following table lists the exceptions you can receive.

HTTP Error Code | Runtime Exception (`x-amzn-ErrorType`) | Description  
---|---|---  
400 |  ValidationException |  Invalid request data or parameters  
401 |  UnauthorizedException |  Authentication required or invalid credentials (OAuth-configured agents)  
402 |  ServiceQuotaExceededException |  Request would exceed a service quota  
403 |  AccessDeniedException |  Insufficient permissions for the requested operation  
404 |  ResourceNotFoundException |  Requested resource does not exist  
409 |  ConflictException |  Resource conflict - Resource already exists  
409 |  RetryableConflictException |  Session operation in progress, please retry  
424 |  RuntimeClientError |  Your agent’s container returned a 4xx or 5xx error - check your CloudWatch logs  
429 |  ThrottlingException |  Too many requests - the request rate limit was exceeded  
500 |  InternalServerException |  An unexpected error occurred while processing the request  
  
`ConflictException` and `RetryableConflictException` both return HTTP 409. The `x-amzn-ErrorType` header and message distinguish them. The service returns `RetryableConflictException` (`Session operation in progress, please retry`) when a second operation targets a session that the service is provisioning or tearing down. This condition is transient and retryable. Retry with short exponential backoff. The AWS SDKs auto-retry this exception when default retries are enabled. If you call the API directly without an AWS SDK, you must retry it yourself.

###### Note

`ServiceQuotaExceededException` returns HTTP 402 on this native HTTP surface. On the A2A protocol it returns HTTP 429, the same HTTP status as throttling. On the MCP protocol it shares the throttling JSON-RPC error code (`-32003`) but returns HTTP 200. On AG-UI it uses a distinct `SERVICE_QUOTA_EXCEEDED` SSE code and returns HTTP 429.

## OAuth authentication responses

OAuth-configured agents follow [RFC 6749 (OAuth 2.0)](<https://datatracker.ietf.org/doc/html/rfc6749>) authentication standards. When authentication is missing, the service returns a 401 Unauthorized response with a WWW-Authenticate header (per [RFC 7235](<https://datatracker.ietf.org/doc/html/rfc7235>) ), enabling clients to discover the authorization server endpoints through the GetRuntimeProtectedResourceMetadata API.

### 401 Unauthorized

Returned when Authorization header is missing.

Includes WWW-Authenticate header:

```text
WWW-Authenticate: Bearer resource_metadata="https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{ESCAPED_ARN}/invocations/.well-known/oauth-protected-resource?qualifier={QUALIFIER}"
```
###### Note

SigV4-configured agents return HTTP 403 with an `ACCESS_DENIED` error and do not include `WWW-Authenticate` headers.

