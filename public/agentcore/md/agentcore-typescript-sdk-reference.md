# AgentCore TypeScript SDK reference - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-typescript-sdk-reference.html

---

# AgentCore TypeScript SDK reference

This reference documents the public Amazon Bedrock AgentCore TypeScript SDK releases.

###### Topics

  * Runtime

  * Identity

  * Code Interpreter


## Runtime

_Auto-generated from`bedrock-agentcore` v0.4.1 — do not edit by hand._

### BedrockAgentCoreApp

```text
BedrockAgentCoreApp
```
Hosts agents on Amazon Bedrock AgentCore runtime.

Provides health check and invocation endpoints for deploying agent handlers. The server supports JSON and Server-Sent Events (SSE) response modes.

```typescript
const app = new BedrockAgentCoreApp({
  invocationHandler: {
    requestSchema: z.object({ message: z.string() }),
    process: async (request, context) => {
      console.log(`Processing request with session ${context.sessionId}`)
      return `Hello ${request.message}!`
    }
  }
})

app.run()
```
#### constructor

```text
constructor(params: BedrockAgentCoreAppParams<BedrockAgentCoreApp.TSchema>): BedrockAgentCoreApp<BedrockAgentCoreApp.TSchema>
```
Creates a new BedrockAgentCoreApp instance.

**Parameters**

`params` `BedrockAgentCoreAppParams<BedrockAgentCoreApp.TSchema>`
    

Configuration including handler and optional settings

#### addAsyncTask

```text
addAsyncTask(name: string, metadata: Record<string, unknown>): number
```
Register an async task for health tracking.

**Parameters**

`name` `string`
    

Human-readable task name

`metadata` _(optional)_ `Record<string, unknown>`
    

The optional task metadata

**Returns**

`number` — Task ID for completion tracking

#### asyncTask

```text
asyncTask(fn: T): T
```
Decorator to automatically track async tasks. Status becomes HealthyBusy during execution.

**Parameters**

`fn` `T`
    

Async function to wrap

**Returns**

`T` — Wrapped function with automatic task tracking

**Raises**

`Error`
    

Error if fn is not an async function

#### completeAsyncTask

```text
completeAsyncTask(taskId: number): boolean
```
Mark an async task as complete.

**Parameters**

`taskId` `number`
    

Task ID from addAsyncTask

**Returns**

`boolean` — True if task was found and removed

#### getAsyncTaskInfo

```text
getAsyncTaskInfo(): AsyncTaskStatus
```
Get information about currently running async tasks.

**Returns**

`AsyncTaskStatus` — Task status with count and details

#### getCurrentPingStatus

```text
getCurrentPingStatus(): HealthStatus
```
Get current ping status based on priority system. Priority: Forced \> Custom Handler \> Automatic

**Returns**

`HealthStatus` — Current health status

#### run

```text
run(options: { host?: string; port?: number }): void
```
Starts the Fastify server.

**Parameters**

`options` _(optional)_ `{ host?: string; port?: number }`
    

The optional server options. Supports `port` (defaults to 8080) and `host` (defaults to '0.0.0.0').

### RuntimeClient

```text
RuntimeClient
```
Generates WebSocket authentication for Amazon Bedrock AgentCore runtime.

```typescript
const client = new RuntimeClient({ region: 'us-west-2' })

// Generate WebSocket connection with SigV4 headers
const { url, headers } = await client.generateWsConnection({
  runtimeArn: 'arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/my-runtime',
  endpointName: 'DEFAULT'
})

// Generate presigned WebSocket URL
const presignedUrl = await client.generatePresignedUrl({
  runtimeArn: 'arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/my-runtime',
  expires: 300
})
```
#### constructor

```text
constructor(config: RuntimeClientConfig): RuntimeClient
```
Creates a new RuntimeClient instance.

**Parameters**

`config` `RuntimeClientConfig`
    

Configuration options for the client

**Raises**

`Error`
    

Error if region is not provided via config or AWS_REGION environment variable

#### connectShellOAuth

```text
connectShellOAuth(params: ConnectShellOAuthParams): Promise<ShellConnectionOAuth>
```
Generate a WebSocket URL and OAuth subprotocols for a shell connection. Low-level helper — use `openShell` for a fully managed session.

**Parameters**

`params` `ConnectShellOAuthParams`
    

The connection parameters.

```typescript
const { url, subprotocols } = await client.connectShellOAuth({ runtimeArn, shellId, sessionId, bearerToken })
const ws = new WebSocket(url, subprotocols)
```
#### connectShellPresigned

```text
connectShellPresigned(params: ConnectShellPresignedParams): Promise<ShellConnectionPresigned>
```
Generate a presigned WebSocket URL for a shell connection. Auth is embedded in the query string — suitable for browser clients or short-lived tokens. Low-level helper — use `openShell` for a fully managed session.

**Parameters**

`params` `ConnectShellPresignedParams`
    

The connection parameters.

```typescript
const { url } = await client.connectShellPresigned({ runtimeArn, shellId, sessionId, expires: 120 })
const ws = new WebSocket(url)
```
#### connectShellSigV4

```text
connectShellSigV4(params: ConnectShellSigV4Params): Promise<ShellConnectionSigV4>
```
Generate a SigV4-signed WebSocket URL and headers for a shell connection. Low-level helper — use `openShell` for a fully managed session.

**Parameters**

`params` `ConnectShellSigV4Params`
    

The connection parameters.

```typescript
const { url, headers } = await client.connectShellSigV4({ runtimeArn, shellId, sessionId })
const ws = new WebSocket(url, { headers })
```
#### generatePresignedUrl

```text
generatePresignedUrl(params: GeneratePresignedUrlParams): Promise<string>
```
Generates a presigned WebSocket URL for runtime connection.

Presigned URLs include authentication in query parameters, allowing frontend clients to connect without managing AWS credentials.

**Parameters**

`params` `GeneratePresignedUrlParams`
    

Parameters for generating the presigned URL

**Returns**

`Promise<string>` — Presigned WebSocket URL with authentication in query parameters

**Raises**

`Error`
    

Error if expires exceeds maximum (300 seconds)

`Error`
    

Error if runtime ARN format is invalid

`Error`
    

Error if AWS credentials are not available

```typescript
const client = new RuntimeClient({ region: 'us-west-2' })

// Basic presigned URL
const url = await client.generatePresignedUrl({
  runtimeArn: 'arn:aws:bedrock-agentcore:us-west-2:123:runtime/my-runtime'
})

// With custom parameters
const url = await client.generatePresignedUrl({
  runtimeArn: 'arn:aws:bedrock-agentcore:us-west-2:123:runtime/my-runtime',
  sessionId: 'my-session-123',
  endpointName: 'DEFAULT',
  customHeaders: { 'custom-param': 'value' },
  expires: 300
})
```
#### generateWsConnection

```text
generateWsConnection(params: GenerateWsConnectionParams): Promise<WebSocketConnection>
```
Generates WebSocket URL and SigV4 signed headers for runtime connection.

This method creates authentication credentials for establishing a WebSocket connection to an AgentCore runtime. The returned headers include AWS SigV4 signature for authentication.

**Parameters**

`params` `GenerateWsConnectionParams`
    

Parameters for generating the connection

**Returns**

`Promise<WebSocketConnection>` — WebSocket URL and authentication headers

**Raises**

`Error`
    

Error if runtime ARN format is invalid

`Error`
    

Error if AWS credentials are not available

```typescript
const client = new RuntimeClient({ region: 'us-west-2' })

// With auto-generated session ID
const { url, headers } = await client.generateWsConnection({
  runtimeArn: 'arn:aws:bedrock-agentcore:us-west-2:123:runtime/my-runtime'
})

// With custom session ID and endpoint
const connection = await client.generateWsConnection({
  runtimeArn: 'arn:aws:bedrock-agentcore:us-west-2:123:runtime/my-runtime',
  sessionId: 'my-session-123',
  endpointName: 'DEFAULT'
})
```
#### generateWsConnectionOAuth

```text
generateWsConnectionOAuth(params: GenerateWsConnectionOAuthParams): Promise<WebSocketConnection>
```
Generates WebSocket URL and OAuth headers for runtime connection.

This method uses OAuth bearer token authentication instead of AWS SigV4. Suitable for scenarios where OAuth tokens are used for authentication. Does NOT require AWS credentials.

**Parameters**

`params` `GenerateWsConnectionOAuthParams`
    

Parameters for generating the connection

**Returns**

`Promise<WebSocketConnection>` — WebSocket URL and OAuth authentication headers

**Raises**

`Error`
    

Error if bearer token is empty

`Error`
    

Error if runtime ARN format is invalid

```typescript
const client = new RuntimeClient({ region: 'us-west-2' })

// With OAuth bearer token
const { url, headers } = await client.generateWsConnectionOAuth({
  runtimeArn: 'arn:aws:bedrock-agentcore:us-west-2:123:runtime/my-runtime',
  bearerToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  endpointName: 'DEFAULT'
})

// Use with WebSocket client
const ws = new WebSocket(url, { headers })
```
#### openShell

```text
openShell(params: OpenShellParams): Promise<ShellSession>
```
Open a fully managed interactive PTY shell session on an agent VM.

Returns a connected `ShellSession` — an async iterable that yields `ShellFrame` objects. Call `close()` when done, or use `try/finally`.

For lower-level control (custom WebSocket handling, browser relay), use the `connectShellSigV4`, `connectShellPresigned`, or `connectShellOAuth` helpers directly with `ShellFramer`.

**Parameters**

`params` `OpenShellParams`
    

The connection parameters.


```typescript
const shell = await client.openShell({ runtimeArn })
try {
  await shell.send('echo hello\n')
  for await (const frame of shell) {
    if (frame.channel === ShellChannel.STDOUT) process.stdout.write(frame.text)
  }
} finally {
  await shell.close()
}
```
 
```typescript
const shell = await client.openShell({
  runtimeArn,
  shellId: 'debug',
  reconnectConfig: { maxRetries: 5, onReconnect: (r) => console.log('reconnected:', r) }
})
```
 

### getContext

```text
getContext(): undefined | RequestContext
```
Get the current request context.

**Returns**

`undefined | RequestContext` — The RequestContext if called within a request scope (inside runWithContext), undefined otherwise (for example, during app initialization or outside request handlers)

```python
import { getContext } from 'bedrock-agentcore/context'

const handler = async (request, context) => {
  const ctx = getContext()
  console.log('Request ID:', ctx?.requestId)
  console.log('Session ID:', ctx?.sessionId)
}
```
### runWithContext

```typescript
runWithContext(context: RequestContext, fn: () => T): T
```
Runs a function within a request context scope.

**Parameters**

`context` `RequestContext`
    

The request context to make available

`fn` `() ⇒ T`
    

The function to execute within the context scope

**Returns**

`T` — The return value of the function

### ShellFramer

```text
ShellFramer
```
Encodes and decodes binary channel-prefix WebSocket frames. Stateless — a single instance is safe to reuse across frames.

#### constructor

```text
constructor(): ShellFramer
```
#### decode

```text
decode(frame: Buffer): ShellFrame
```
Decode one raw WebSocket binary message into a ShellFrame.

**Parameters**

`frame` `Buffer`
    

The frame data to process.

#### encodeClose

```text
encodeClose(): Buffer
```
Encode a graceful-shutdown CLOSE frame (empty payload).

#### encodeHeartbeat

```text
encodeHeartbeat(): Buffer
```
Encode an app-level heartbeat frame (channel 0x05, empty payload).

#### encodeResize

```text
encodeResize(width: number, height: number): Buffer
```
Encode a terminal resize event as a RESIZE frame.

**Parameters**

`width` `number`
    

The width in pixels.

`height` `number`
    

The height in pixels.

#### encodeStdin

```text
encodeStdin(data: string | Buffer<ArrayBufferLike>): Buffer
```
Encode keyboard input or paste data as a STDIN frame.

**Parameters**

`data` `string | Buffer<ArrayBufferLike>`
    

The data to process.

### ShellSession

```text
ShellSession
```
Async-iterable shell session wrapping a live PTY WebSocket.

Read-only observable attributes (updated by the session as events arrive): \- `shellId` — Server-confirmed shell identifier. Preserve to reconnect to the same PTY. \- `sessionId` — Runtime session ID routing to the VM. \- `reconnected` — True when the most recent connect reattached an existing PTY. \- `kicked` — True when another client connected with the same shellId (close 4000). Check this after the `for await` loop exits to distinguish a kick from a clean shell exit. \- `bytesDropped` — PTY ring-buffer bytes lost during the most recent disconnect, as reported by the server in the reconnect confirmation frame. Zero if no overflow occurred or on a fresh connection. \- `exitCode` — Shell process exit code. `null` until the shell exits; `0` for a clean exit. Check this after the `for await` loop exits alongside `kicked`.

#### constructor

```text
constructor(opts: ShellSessionOptions): ShellSession
```
**Parameters**

`opts` `ShellSessionOptions`
    

The options to use.

#### _terminateConnection

```text
_terminateConnection(): void
```
Forcibly terminates the underlying WebSocket without a clean handshake. Useful in tests to simulate an abrupt network drop and trigger the reconnect path. Has no effect if the session is not currently open.

#### [asyncIterator]

```text
[asyncIterator](): AsyncIterator<ShellFrame>
```
Async iterator — yields inbound ShellFrames, reconnecting on drop if configured.

The loop exits silently (no throw) in three cases: shell exit, kicked by a new client, or reconnect budget exhausted. Check `exitCode`, `kicked`, and `bytesDropped` after the loop to distinguish them:

```typescript
for await (const frame of shell) { ... }
if (shell.kicked) { ... }          // another client took over
if (shell.exitCode !== null) { ... } // shell process exited
if (shell.bytesDropped > 0) { ... } // ring-buffer overflow on reconnect
```
#### close

```text
close(): Promise<void>
```
Send a CLOSE frame (0xFF) to permanently kill the shell, then close the WebSocket. The server kills the shell process (SIGHUP → SIGKILL) and responds with its own [0xFF]. Unlike dropping the WebSocket (which detaches and allows reconnection), this is permanent.

#### connect

```text
connect(): Promise<ShellSession>
```
Connect and read the initial STATUS metadata frame.

#### resize

```text
resize(width: number, height: number): Promise<void>
```
Resize the terminal PTY.

**Parameters**

`width` `number`
    

The width in pixels.

`height` `number`
    

The height in pixels.

#### send

```text
send(data: string | Buffer<ArrayBufferLike>): Promise<void>
```
Send text or raw bytes to the shell’s stdin. Pass a string for text commands; pass a Buffer for binary/escape sequences.

If a reconnect is in flight, this waits for it and sends on the recovered connection. Throws a descriptive `Error` (never the raw `ws` "readyState 3" error) when the session is closed or could not be recovered.

**Parameters**

`data` `string | Buffer<ArrayBufferLike>`
    

The data to process.

#### sendHeartbeat

```text
sendHeartbeat(): Promise<void>
```
Send a HEARTBEAT frame (0x05) to the server.

### validateShellId

```text
validateShellId(shellId: string): void
```
Validate a shell ID. Must start with alphanumeric, contain only alphanumeric, _ or -, max 128 chars.

**Parameters**

`shellId` `string`
    

The shell ID.

**Raises**

`Error`
    

Error if invalid.

## Identity

_Auto-generated from`bedrock-agentcore` v0.4.1 — do not edit by hand._

### IdentityClient

```text
IdentityClient
```
Client for interacting with Amazon Bedrock AgentCore Identity service. Provides methods for managing workload identities, credential providers, and retrieving OAuth2 tokens and API keys.

#### constructor

```text
constructor(region: string): IdentityClient
```
Creates a new IdentityClient instance

**Parameters**

`region` _(optional)_ `string`
    

The AWS Region (defaults to AWS_REGION env var)

**Raises**

`Error`
    

Error if region cannot be determined

#### getApiKey

```text
getApiKey(request: ApiKeyRequest): Promise<string>
```
Retrieves an API key from Amazon Bedrock AgentCore Identity token vault.

**Parameters**

`request` `ApiKeyRequest`
    

API key request parameters

**Returns**

`Promise<string>` — API key string

**Raises**

`Error`
    

Error if API key retrieval fails

#### getOAuth2Token

```text
getOAuth2Token(request: OAuth2TokenRequest): Promise<string>
```
Retrieves an OAuth2 access token from Amazon Bedrock AgentCore Identity. Handles both M2M (immediate), ON_BEHALF_OF_TOKEN_EXCHANGE (immediate) and USER_FEDERATION (polling) flows.

**Parameters**

`request` `OAuth2TokenRequest`
    

OAuth2 token request parameters

**Returns**

`Promise<string>` — OAuth2 access token

**Raises**

`Error`
    

Error if token retrieval fails or times out

### withAccessToken

```typescript
withAccessToken(config: OAuth2WrapperConfig): <TParams extends [...unknown[], string], TReturn>(fn: (...args: TParams) => Promise<TReturn>) => (...args: InitParams<TParams>) => Promise<TReturn>
```
Wraps an async function to automatically inject OAuth2 access token. The token is injected as the last parameter of the wrapped function.

**Parameters**

`config` `OAuth2WrapperConfig`
    

OAuth2 configuration

**Returns**

`<TParams extends […​unknown[], string], TReturn>(fn: (…​args: TParams) ⇒ Promise<TReturn>) ⇒ (…​args: InitParams<TParams>) ⇒ Promise<TReturn>` — Function wrapper that injects token as last parameter

```typescript
const myTool = withAccessToken({
  workloadIdentityToken: token,
  providerName: 'github',
  scopes: ['repo'],
  authFlow: 'M2M'
})(async (input: string, token: string) => {
  // Use token to call GitHub API
  return { result: input };
});

await myTool('hello'); // token injected automatically
```
### withApiKey

```typescript
withApiKey(config: ApiKeyWrapperConfig): <TParams extends [...unknown[], string], TReturn>(fn: (...args: TParams) => Promise<TReturn>) => (...args: InitParams<TParams>) => Promise<TReturn>
```
Wraps an async function to automatically inject API key. The API key is injected as the last parameter of the wrapped function.

**Parameters**

`config` `ApiKeyWrapperConfig`
    

API key configuration

**Returns**

`<TParams extends […​unknown[], string], TReturn>(fn: (…​args: TParams) ⇒ Promise<TReturn>) ⇒ (…​args: InitParams<TParams>) ⇒ Promise<TReturn>` — Function wrapper that injects API key as last parameter

```typescript
const myTool = withApiKey({
  workloadIdentityToken: token,
  providerName: 'openai'
})(async (input: string, apiKey: string) => {
  // Use API key to call OpenAI API
  return { result: input };
});

await myTool('hello'); // apiKey injected automatically
```
## Code Interpreter

_Auto-generated from`bedrock-agentcore` v0.4.1 — do not edit by hand._

### CodeInterpreter

```text
CodeInterpreter
```
Provides a client interface for Amazon Bedrock AgentCore Code Interpreter.

Executes Python, JavaScript, and TypeScript code in isolated sandbox environments with file system access and shell commands. Each instance manages one session, which starts automatically on first use and can be managed with startSession or stopSession.

```python
const interpreter = new CodeInterpreter({ region: 'us-east-1' })

// Execute code (auto-creates session)
await interpreter.executeCode({ code: 'print("Hello")' })

// Explicitly manage session lifecycle
await interpreter.startSession({ sessionName: 'my-session' })
await interpreter.executeCode({ code: 'x = 1' })
await interpreter.stopSession()
```
#### constructor

```text
constructor(config: CodeInterpreterConfig): CodeInterpreter
```
Creates a new CodeInterpreter instance.

**Parameters**

`config` `CodeInterpreterConfig`
    

Configuration options

#### executeCode

```text
executeCode(params: ExecuteCodeParams): Promise<string>
```
Execute code in a code interpreter session. Automatically creates a session if one doesn’t exist.

**Parameters**

`params` `ExecuteCodeParams`
    

Execution parameters

**Returns**

`Promise<string>` — Execution result with output or error

```python
// Auto-creates default session
const result = await interpreter.executeCode({
  code: 'print("Hello")',
  language: 'python'
})
```
#### executeCommand

```text
executeCommand(params: ExecuteCommandParams): Promise<string>
```
Execute a shell command in a code interpreter session. Automatically creates a session if one doesn’t exist.

**Parameters**

`params` `ExecuteCommandParams`
    

Command parameters

**Returns**

`Promise<string>` — Command result with output or error

```typescript
const result = await interpreter.executeCommand({
  command: 'ls -la'
})
```
#### getSession

```text
getSession(params: GetSessionParams): Promise<GetSessionResponse>
```
Get detailed information about a code interpreter session.

**Parameters**

`params` _(optional)_ `GetSessionParams`
    

The optional parameters specifying which session to query

**Returns**

`Promise<GetSessionResponse>` — Detailed session information

```typescript
// Get current active session details
const sessionInfo = await interpreter.getSession()
console.log(`Session status: ${sessionInfo.status}`)

// Get details for a specific session
const sessionInfo = await interpreter.getSession({
  sessionId: 'specific-session-id'
})
```
#### listFiles

```text
listFiles(params: ListFilesParams): Promise<string>
```
List files in the code interpreter sandbox. Automatically creates a session if one doesn’t exist.

**Parameters**

`params` _(optional)_ `ListFilesParams`
    

List parameters

**Returns**

`Promise<string>` — List result with file information or error

```typescript
const result = await interpreter.listFiles({ path: '/tmp' })
```
#### listSessions

```text
listSessions(params: ListSessionsParams): Promise<ListSessionsResponse>
```
List code interpreter sessions for this interpreter.

**Parameters**

`params` _(optional)_ `ListSessionsParams`
    

The optional filtering and pagination parameters

**Returns**

`Promise<ListSessionsResponse>` — List of session summaries with optional pagination token

```typescript
// List all active sessions
const response = await interpreter.listSessions({ status: 'READY' })
for (const session of response.items) {
  console.log(`Session ${session.sessionId}: ${session.status}`)
}

// Paginate through results
let response = await interpreter.listSessions({ maxResults: 10 })
while (response.nextToken) {
  response = await interpreter.listSessions({
    maxResults: 10,
    nextToken: response.nextToken
  })
}
```
#### readFiles

```text
readFiles(params: ReadFilesParams): Promise<string>
```
Read files from the code interpreter sandbox. Automatically creates a session if one doesn’t exist.

**Parameters**

`params` `ReadFilesParams`
    

Read parameters

**Returns**

`Promise<string>` — Read result with file contents or errors

```typescript
const result = await interpreter.readFiles({
  paths: ['data.txt', 'output.json']
})
```
#### removeFiles

```text
removeFiles(params: RemoveFilesParams): Promise<string>
```
Remove files from the code interpreter sandbox. Automatically creates a session if one doesn’t exist.

**Parameters**

`params` `RemoveFilesParams`
    

Remove parameters

**Returns**

`Promise<string>` — Remove result with removed file paths or errors

```text
await interpreter.removeFiles({
  paths: ['temp.txt', 'cache.json']
})
```
#### startSession

```text
startSession(params: StartSessionParams): Promise<SessionInfo>
```
Start a new code interpreter session.

**Parameters**

`params` _(optional)_ `StartSessionParams`
    

Session configuration

**Returns**

`Promise<SessionInfo>` — Session information including AWS-assigned session ID

```typescript
const session = await interpreter.startSession({
  sessionName: 'data-analysis',
  description: 'Processing customer data',
  timeout: 1800
})
```
#### stopSession

```text
stopSession(): Promise<void>
```
Stop the active code interpreter session. Gracefully handles non-existent sessions without throwing errors.

```text
await interpreter.stopSession()
```
#### writeFiles

```text
writeFiles(params: WriteFilesParams): Promise<string>
```
Write files to the code interpreter sandbox. Automatically creates a session if one doesn’t exist.

**Parameters**

`params` `WriteFilesParams`
    

Write parameters

**Returns**

`Promise<string>` — Write result with written file paths or errors

```python
await interpreter.writeFiles({
  files: [
    { path: 'script.py', content: 'print("Hello")' },
    { path: 'data.json', content: '{"key": "value"}' }
  ]
})
```
### createExecuteCodeTool (Strands SDK)

```text
createExecuteCodeTool(interpreter: CodeInterpreter): InvokableTool<{ code: string; language: "python" | "javascript" | "typescript" }, string>
```
Creates a Strands SDK tool for executing code in CodeInterpreter.

**Parameters**

`interpreter` `CodeInterpreter`
    

CodeInterpreter instance

**Returns**

`InvokableTool<{ code: string; language: "python" | "javascript" | "typescript" }, string>` — Strands SDK tool for code execution

```python
import { createExecuteCodeTool } from 'bedrock-agentcore/experimental/code-interpreter/strands'
import { CodeInterpreter } from 'bedrock-agentcore/code-interpreter'

const interpreter = new CodeInterpreter({ region: 'us-west-2' })
const executeCodeTool = createExecuteCodeTool(interpreter)

// Use with Strands SDK Agent
const agent = new Agent({
  model: new BedrockModel({ modelId: 'anthropic.claude-sonnet-4-20250514-v1:0' }),
  tools: [executeCodeTool]
})
```
### createExecuteCommandTool (Strands SDK)

```text
createExecuteCommandTool(interpreter: CodeInterpreter): InvokableTool<{ command: string }, string>
```
Creates a Strands SDK tool for executing shell commands in CodeInterpreter.

**Parameters**

`interpreter` `CodeInterpreter`
    

CodeInterpreter instance

**Returns**

`InvokableTool<{ command: string }, string>` — Strands SDK tool for command execution

```python
import { createExecuteCommandTool } from 'bedrock-agentcore/experimental/code-interpreter/strands'
import { CodeInterpreter } from 'bedrock-agentcore/code-interpreter'

const interpreter = new CodeInterpreter({ region: 'us-west-2' })
const executeCommandTool = createExecuteCommandTool(interpreter)

// Use with Strands SDK Agent
const agent = new Agent({
  model: new BedrockModel({ modelId: 'anthropic.claude-sonnet-4-20250514-v1:0' }),
  tools: [executeCommandTool]
})
```
### createFileOperationsTool (Strands SDK)

```text
createFileOperationsTool(interpreter: CodeInterpreter): InvokableTool<{ files?: { content: string; path: string }[]; operation: "remove" | "write" | "read" | "list"; path: string; paths?: string[] }, string>
```
Creates a Strands SDK tool for file operations in CodeInterpreter.

**Parameters**

`interpreter` `CodeInterpreter`
    

CodeInterpreter instance

**Returns**

`InvokableTool<{ files?: { content: string; path: string }[]; operation: "remove" | "write" | "read" | "list"; path: string; paths?: string[] }, string>` — Strands SDK tool for file operations

```python
import { createFileOperationsTool } from 'bedrock-agentcore/experimental/code-interpreter/strands'
import { CodeInterpreter } from 'bedrock-agentcore/code-interpreter'

const interpreter = new CodeInterpreter({ region: 'us-west-2' })
const fileOpsTool = createFileOperationsTool(interpreter)

// Use with Strands SDK Agent
const agent = new Agent({
  model: new BedrockModel({ modelId: 'anthropic.claude-sonnet-4-20250514-v1:0' }),
  tools: [fileOpsTool]
})
```
### CodeInterpreterTools (Strands SDK)

```text
CodeInterpreterTools
```
CodeInterpreterTools - All-in-one CodeInterpreter integration for Strands SDK

Provides three ready-to-use tools and session management in a single class.

```python
import { CodeInterpreterTools } from 'bedrock-agentcore/experimental/code-interpreter/strands'
import { Agent, BedrockModel } from '@strands-agents/sdk'

// Create tools instance
const codeInterpreter = new CodeInterpreterTools({ region: 'us-west-2' })

// Start session (optional - automatically started on first use)
await codeInterpreter.startSession()

// Create agent with all three tools
const agent = new Agent({
  model: new BedrockModel({ modelId: 'anthropic.claude-sonnet-4-20250514-v1:0' }),
  tools: codeInterpreter.tools,
})

// Clean up when done
await codeInterpreter.stopSession()
```
#### constructor

```text
constructor(config: CodeInterpreterConfig): CodeInterpreterTools
```
**Parameters**

`config` `CodeInterpreterConfig`
    

The configuration to use.

#### getClient

```text
getClient(): CodeInterpreter
```
Get the underlying CodeInterpreter client

Provides direct access to the client for advanced use cases.

**Returns**

`CodeInterpreter` — The CodeInterpreter client instance

#### startSession

```text
startSession(sessionName: string, timeout: number): Promise<SessionInfo>
```
Start a CodeInterpreter session

Sessions are automatically started on first tool use, but you can call this explicitly to start the session upfront.

**Parameters**

`sessionName` _(optional)_ `string`
    

The optional session name for AWS 

`timeout` _(optional)_ `number`
    

The optional session timeout in seconds (default: 900, max: 28800)

**Returns**

`Promise<SessionInfo>` — Session information

#### stopSession

```text
stopSession(): Promise<void>
```
Stop the current CodeInterpreter session

Call this when you’re done using the tools to clean up resources.

### createExecuteCodeTool (Vercel AI SDK)

```text
createExecuteCodeTool(interpreter: CodeInterpreter): Tool<{ code: string; language: "python" | "javascript" | "typescript" }, string>
```
Creates a Vercel AI SDK tool for executing code in CodeInterpreter.

**Parameters**

`interpreter` `CodeInterpreter`
    

CodeInterpreter instance

**Returns**

`Tool<{ code: string; language: "python" | "javascript" | "typescript" }, string>` — Vercel AI SDK tool for code execution

```python
import { createExecuteCodeTool } from 'bedrock-agentcore/code-interpreter/vercel-ai'
import { CodeInterpreter } from 'bedrock-agentcore/code-interpreter'

const interpreter = new CodeInterpreter({ region: 'us-west-2' })
const executeCodeTool = createExecuteCodeTool(interpreter)

// Use with Vercel AI SDK Agent
const agent = new ToolLoopAgent({
  model: bedrock('global.anthropic.claude-sonnet-4-20250514-v1:0'),
  tools: { executeCode: executeCodeTool }
})
```
### createExecuteCommandTool (Vercel AI SDK)

```text
createExecuteCommandTool(interpreter: CodeInterpreter): Tool<{ command: string }, string>
```
Creates a Vercel AI SDK tool for executing shell commands in CodeInterpreter.

**Parameters**

`interpreter` `CodeInterpreter`
    

CodeInterpreter instance

**Returns**

`Tool<{ command: string }, string>` — Vercel AI SDK tool for command execution

```python
import { createExecuteCommandTool } from 'bedrock-agentcore/code-interpreter/vercel-ai'
import { CodeInterpreter } from 'bedrock-agentcore/code-interpreter'

const interpreter = new CodeInterpreter({ region: 'us-west-2' })
const executeCommandTool = createExecuteCommandTool(interpreter)

// Use with Vercel AI SDK Agent
const agent = new ToolLoopAgent({
  model: bedrock('global.anthropic.claude-sonnet-4-20250514-v1:0'),
  tools: { executeCommand: executeCommandTool }
})
```
### createFileOperationsTool (Vercel AI SDK)

```text
createFileOperationsTool(interpreter: CodeInterpreter): Tool<{ files?: { content: string; path: string }[]; operation: "remove" | "write" | "read" | "list"; path: string; paths?: string[] }, string>
```
Creates a Vercel AI SDK tool for file operations in CodeInterpreter.

**Parameters**

`interpreter` `CodeInterpreter`
    

CodeInterpreter instance

**Returns**

`Tool<{ files?: { content: string; path: string }[]; operation: "remove" | "write" | "read" | "list"; path: string; paths?: string[] }, string>` — Vercel AI SDK tool for file operations

```python
import { createFileOperationsTool } from 'bedrock-agentcore/code-interpreter/vercel-ai'
import { CodeInterpreter } from 'bedrock-agentcore/code-interpreter'

const interpreter = new CodeInterpreter({ region: 'us-west-2' })
const fileOpsTool = createFileOperationsTool(interpreter)

// Use with Vercel AI SDK Agent
const agent = new ToolLoopAgent({
  model: bedrock('global.anthropic.claude-sonnet-4-20250514-v1:0'),
  tools: { fileOps: fileOpsTool }
})
```
### CodeInterpreterTools (Vercel AI SDK)

```text
CodeInterpreterTools
```
CodeInterpreterTools - All-in-one CodeInterpreter integration for Vercel AI SDK

Provides three ready-to-use tools and session management in a single class.

```python
import { CodeInterpreterTools } from 'bedrock-agentcore/code-interpreter/vercel-ai'
import { ToolLoopAgent } from 'ai'
import { bedrock } from '@ai-sdk/amazon-bedrock'

// Create tools instance
const codeInterpreter = new CodeInterpreterTools({ region: 'us-west-2' })

// Start session (optional - automatically started on first use)
await codeInterpreter.startSession()

// Create agent with all three tools
const agent = new ToolLoopAgent({
  model: bedrock('global.anthropic.claude-sonnet-4-20250514-v1:0'),
  tools: codeInterpreter.tools,
})

// Clean up when done
await codeInterpreter.stopSession()
```
#### constructor

```text
constructor(config: CodeInterpreterConfig): CodeInterpreterTools
```
**Parameters**

`config` `CodeInterpreterConfig`
    

The configuration to use.

#### getClient

```text
getClient(): CodeInterpreter
```
Get the underlying CodeInterpreter client

Provides direct access to the client for advanced use cases.

**Returns**

`CodeInterpreter` — The CodeInterpreter client instance

#### startSession

```text
startSession(sessionName: string, timeout: number): Promise<SessionInfo>
```
Start a CodeInterpreter session

Sessions are automatically started on first tool use, but you can call this explicitly to start the session upfront.

**Parameters**

`sessionName` _(optional)_ `string`
    

The optional session name for AWS 

`timeout` _(optional)_ `number`
    

The optional session timeout in seconds (default: 900, max: 28800)

**Returns**

`Promise<SessionInfo>` — Session information

#### stopSession

```text
stopSession(): Promise<void>
```
Stop the current CodeInterpreter session

Call this when you’re done using the tools to clean up resources.

