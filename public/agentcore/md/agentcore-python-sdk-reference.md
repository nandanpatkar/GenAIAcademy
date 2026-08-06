# AgentCore Python SDK reference - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-python-sdk-reference.html

---

# AgentCore Python SDK reference

This reference documents the public Amazon Bedrock AgentCore Python SDK releases.

###### Topics

  * Runtime

  * Identity

  * Gateway

  * Evaluation

  * Payments


## Runtime

_Auto-generated from`bedrock-agentcore` v1.18.1 — do not edit by hand._

Amazon Bedrock AgentCore runtime package.

### AgentCoreRuntimeClient

```text
AgentCoreRuntimeClient(region: Optional[str] = None, session: Optional[boto3.session.Session] = None, integration_source: Optional[str] = None) -> None
```
Generates WebSocket authentication for Amazon Bedrock AgentCore runtime.

This client provides authentication credentials for WebSocket connections to Amazon Bedrock AgentCore runtime endpoints so applications can establish bidirectional streaming connections with agent runtimes.

Attributes: region (str): The AWS Region being used. session (boto3.Session): The boto3 session for AWS credentials.

#### _init_

```text
__init__(region: Optional[str] = None, session: Optional[boto3.session.Session] = None, integration_source: Optional[str] = None) -> None
```
Initialize an AgentCoreRuntime client for the specified AWS Region.

**Parameters**

`region`
    

The AWS Region name. If not provided, uses the session’s region or "us-west-2".

`session`
    

An optional boto3 Session to use. If not provided, a default session is created.

`integration_source`
    

An optional integration source for user-agent telemetry.

#### connect_shell

```text
connect_shell(runtime_arn: str, session_id: Optional[str] = None, endpoint_name: Optional[str] = None, shell_id: Optional[str] = None) -> Tuple[str, Dict[str, str]]
```
Return (wss_url, headers) for a SigV4-authenticated shell session.

SigV4 is the correct auth path for server-side Python. Browsers cannot set arbitrary headers on a WebSocket upgrade (RFC 6455); use `connect_shell_oauth` for browser-facing use cases instead.

**Parameters**

`runtime_arn`
    

Full agent runtime ARN.

`session_id`
    

Routes to an existing VM. Auto-generated UUID if omitted; a new VM is provisioned.

`endpoint_name`
    

Endpoint qualifier (default: DEFAULT).

`shell_id`
    

Client-chosen shell name (1–128 chars, no ?, #, &). Auto-generated UUID if omitted. **Store this value** — passing the same ID reconnects to the same PTY, preserving shell state and up to 256 KB of buffered output.

**Returns**

`(wss_url, headers)` — pass both directly to any WebSocket library.

**Raises**

`ValueError`
    

If the ARN format is invalid or `shell_id` is outside the allowed character set.

`RuntimeError`
    

If no AWS credentials are found.

```text
url, headers = client.connect_shell(
    runtime_arn="arn:aws:bedrock-agentcore:us-west-2:123:runtime/r",
    shell_id="my-debug-shell",
)
ws = await websockets.connect(url, additional_headers=headers)
```
#### connect_shell_oauth

```text
connect_shell_oauth(runtime_arn: str, bearer_token: str, session_id: Optional[str] = None, endpoint_name: Optional[str] = None, shell_id: Optional[str] = None) -> Tuple[str, List[str]]
```
Return (wss_url, subprotocols) for an OAuth-authenticated shell session.

This is the only valid auth path for browser clients: browsers cannot set arbitrary headers on a WebSocket upgrade (RFC 6455), so the bearer token is embedded in the `Sec-WebSocket-Protocol` handshake using the `base64UrlBearerAuthorization` scheme instead.

Server-side Python callers should prefer `connect_shell` with SigV4. Use this method when building a browser relay or xterm.js integration.

**Parameters**

`runtime_arn`
    

Full agent runtime ARN.

`bearer_token`
    

OAuth bearer token obtained from your identity provider.

`session_id`
    

Routes to an existing VM. Auto-generated if omitted.

`endpoint_name`
    

Endpoint qualifier (default: DEFAULT).

`shell_id`
    

Client-chosen shell name. Store this value for reconnection. Auto-generated if omitted.

**Returns**

`(wss_url, subprotocols)` — pass both to the WebSocket constructor. `subprotocols` contains the base64url-encoded token as `base64UrlBearerAuthorization.<token>` plus the sentinel `base64UrlBearerAuthorization`.

**Raises**

`ValueError`
    

If `bearer_token` is empty, the ARN is invalid, or `shell_id` contains forbidden characters.


```text
url, protos = client.connect_shell_oauth(
    runtime_arn="arn:...",
    bearer_token=await get_oauth_token(),
    shell_id="inspector-shell",
)
ws = await websockets.connect(url, subprotocols=protos)
```
 
```bash
# Backend returns (url, subprotocols); browser does:
# const ws = new WebSocket(url, subprotocols)
```
 

#### connect_shell_presigned

```text
connect_shell_presigned(runtime_arn: str, session_id: Optional[str] = None, endpoint_name: Optional[str] = None, shell_id: Optional[str] = None, expires: int = 300) -> str
```
Return a presigned wss:// URL for a shell session (auth in query string).

Useful when you need to hand a URL to another process or service without sharing AWS credentials directly.

**Parameters**

`runtime_arn`
    

Full agent runtime ARN.

`session_id`
    

Routes to an existing VM. Auto-generated if omitted.

`endpoint_name`
    

Endpoint qualifier (default: DEFAULT).

`shell_id`
    

Client-chosen shell name. Store this value for reconnection. Auto-generated if omitted.

`expires`
    

Seconds until the URL expires (max 300).

**Returns**

Presigned wss:// URL — open with any WebSocket client, no extra headers needed.

**Raises**

`ValueError`
    

If `expires` exceeds the maximum, the ARN is invalid, or `shell_id` contains forbidden characters.

`RuntimeError`
    

If no AWS credentials are found.

```text
url = client.connect_shell_presigned(
    runtime_arn="arn:aws:bedrock-agentcore:us-west-2:123:runtime/r",
    shell_id="build-shell",
    expires=120,
)
ws = await websockets.connect(url)
```
#### create_agent_runtime_and_wait

```text
create_agent_runtime_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Create an agent runtime and wait for it to reach READY status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the create_agent_runtime API.

**Returns**

Runtime details when READY.

**Raises**

`RuntimeError`
    

If the runtime reaches a failed state.

`TimeoutError`
    

If the runtime doesn’t become READY within max_wait.

#### create_agent_runtime_endpoint_and_wait

```text
create_agent_runtime_endpoint_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Create an agent runtime endpoint and wait for it to reach READY.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the create_agent_runtime_endpoint API.

**Returns**

Endpoint details when READY.

**Raises**

`RuntimeError`
    

If the endpoint reaches a failed state.

`TimeoutError`
    

If the endpoint doesn’t become READY within max_wait.

#### delete_agent_runtime_and_wait

```text
delete_agent_runtime_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> None
```
Delete an agent runtime and wait for deletion to complete.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the delete_agent_runtime API.

**Raises**

`TimeoutError`
    

If the runtime isn’t deleted within max_wait.

#### generate_presigned_url

```text
generate_presigned_url(runtime_arn: str, session_id: Optional[str] = None, endpoint_name: Optional[str] = None, custom_headers: Optional[Dict[str, str]] = None, expires: int = 300) -> str
```
Generate a presigned WebSocket URL for runtime connection.

Presigned URLs include authentication in query parameters, allowing frontend clients to connect without managing AWS credentials.

**Parameters**

`runtime_arn` `str`
    

Full runtime ARN (for example, 'arn:aws:bedrock-agentcore:us-west-2:123:runtime/my-runtime-abc')

`session_id` _(optional)_ `Optional[str]`
    

Session ID to use. If None, auto-generates a UUID.

`endpoint_name` _(optional)_ `Optional[str]`
    

Endpoint name to use as 'qualifier' query parameter. If provided, adds ?qualifier={endpoint_name} to the URL before signing.

`custom_headers` _(optional)_ `Optional[Dict[str, str]]`
    

Additional query parameters to include in the presigned URL before signing (for example, \{"abc": "pqr"}).

`expires` `int`
    

Seconds until URL expires (default: 300, max: 300).

**Returns**

str: Presigned WebSocket URL with query string parameters including: - Original query params (qualifier, custom_headers) - SigV4 auth params (X-Amz-Algorithm, X-Amz-Credential, etc.)

**Raises**

`ValueError`
    

If expires exceeds maximum (300 seconds).

`RuntimeError`
    

If URL generation fails or no credentials found.

```text
>>> client = AgentCoreRuntimeClient('us-west-2')
>>> presigned_url = client.generate_presigned_url(
...     runtime_arn='arn:aws:bedrock-agentcore:us-west-2:123:runtime/my-runtime',
...     endpoint_name='DEFAULT',
...     custom_headers={'abc': 'pqr'},
...     expires=300
... )
```
#### generate_ws_connection

```text
generate_ws_connection(runtime_arn: str, session_id: Optional[str] = None, endpoint_name: Optional[str] = None) -> Tuple[str, Dict[str, str]]
```
Generate WebSocket URL and SigV4 signed headers for runtime connection.

**Parameters**

`runtime_arn` `str`
    

Full runtime ARN (for example, 'arn:aws:bedrock-agentcore:us-west-2:123:runtime/my-runtime-abc')

`session_id` _(optional)_ `Optional[str]`
    

Session ID to use. If None, auto-generates a UUID.

`endpoint_name` _(optional)_ `Optional[str]`
    

Endpoint name to use as 'qualifier' query parameter. If provided, adds ?qualifier={endpoint_name} to the URL.

**Returns**

Tuple[str, Dict[str, str]]: A tuple containing: - WebSocket URL (wss://…​) with query parameters - Headers dictionary with SigV4 signature

**Raises**

`RuntimeError`
    

If no AWS credentials are found.

`ValueError`
    

If runtime_arn format is invalid.

```text
>>> client = AgentCoreRuntimeClient('us-west-2')
>>> ws_url, headers = client.generate_ws_connection(
...     runtime_arn='arn:aws:bedrock-agentcore:us-west-2:123:runtime/my-runtime',
...     endpoint_name='DEFAULT'
... )
```
#### generate_ws_connection_oauth

```text
generate_ws_connection_oauth(runtime_arn: str, bearer_token: str, session_id: Optional[str] = None, endpoint_name: Optional[str] = None) -> Tuple[str, Dict[str, str]]
```
Generate WebSocket URL and OAuth headers for runtime connection.

This method uses OAuth bearer token authentication instead of AWS SigV4. Suitable for scenarios where OAuth tokens are used for authentication.

**Parameters**

`runtime_arn` `str`
    

Full runtime ARN (for example, 'arn:aws:bedrock-agentcore:us-west-2:123:runtime/my-runtime-abc')

`bearer_token` `str`
    

OAuth bearer token for authentication.

`session_id` _(optional)_ `Optional[str]`
    

Session ID to use. If None, auto-generates one.

`endpoint_name` _(optional)_ `Optional[str]`
    

Endpoint name to use as 'qualifier' query parameter. If provided, adds ?qualifier={endpoint_name} to the URL.

**Returns**

Tuple[str, Dict[str, str]]: A tuple containing: - WebSocket URL (wss://…​) with query parameters - Headers dictionary with OAuth authentication

**Raises**

`ValueError`
    

If runtime_arn format is invalid or bearer_token is empty.

```text
>>> client = AgentCoreRuntimeClient('us-west-2')
>>> ws_url, headers = client.generate_ws_connection_oauth(
...     runtime_arn='arn:aws:bedrock-agentcore:us-west-2:123:runtime/my-runtime',
...     bearer_token='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
...     endpoint_name='DEFAULT'
... )
```
#### get_aggregated_status

```text
get_aggregated_status(agent_runtime_id: str, endpoint_name: str = 'DEFAULT') -> Dict[str, Any]
```
Get aggregated status of runtime and endpoint.

**Parameters**

`agent_runtime_id`
    

The agent runtime ID.

`endpoint_name`
    

Endpoint name (default: "DEFAULT").

**Returns**

Dict with 'runtime' and 'endpoint' status details.

#### open_shell

```text
open_shell(runtime_arn: str, session_id: Optional[str] = None, shell_id: Optional[str] = None, endpoint_name: Optional[str] = None, auth: 'AuthMode' = 'sigv4', reconnect_config: Optional[ForwardRef('ReconnectConfig')] = None) -> 'ShellSession'
```
Create a `ShellSession` for interactive shell access to an agent VM.

Returns an async context manager that connects on ` _aenter_ ` and sends a graceful CLOSE frame on ` _aexit_ `.

**Parameters**

`runtime_arn`
    

Full agent runtime ARN.

`session_id`
    

Runtime session ID — routes to an existing VM. Auto-generated UUID if omitted; a new VM is provisioned.

`shell_id`
    

Client-chosen shell name (1–128 UTF-8 chars, no `?`, `#`, or `&`). Auto-generated if omitted. **Store this value alongside** `session_id` — both are required to reconnect to the same PTY. `shell_id` names the PTY; `session_id` routes to the VM that hosts it. Passing either without the other will not reconnect successfully.

`endpoint_name`
    

Endpoint qualifier (default: DEFAULT).

`auth`
    

Authentication mode. One of: - `"sigv4"` **(default)** — SigV4-signed headers from the boto3 session. Correct for all server-side Python use cases. - `PresignedAuth(expires=N)` — auth embedded in the URL query string; valid for up to `expires` seconds (max 300). Use when handing a URL to another process without sharing AWS credentials. - `OAuthAuth(bearer_token="…")` — bearer token embedded as a WebSocket subprotocol. The only valid path for browser clients (browsers cannot set arbitrary headers on a WS upgrade).

`reconnect_config`
    

When provided, `ShellSession` automatically reconnects on unexpected WebSocket disconnects using the same `shell_id`. The `on_reconnect` callback fires after each successful reconnect with `reconnected=True/False` so callers can react to the buffered-output burst. `None` (default) disables auto-retry — callers handle reconnection explicitly.

**Returns**

`ShellSession` async context manager. Example — SigV4 (default): async with client.open_shell(runtime_arn, session_id=sid) as shell: await shell.send("cat /etc/os-release\\\n") async for frame in shell: if frame.channel == ShellChannel.STDOUT: print(frame.text, end="") elif frame.channel == ShellChannel.STATUS: # Termination frames have empty metadata (no shellId). if not frame.json().get("metadata", \{}).get("shellId"): break Example — presigned URL: async with client.open_shell( runtime_arn, auth=PresignedAuth(expires=120), shell_id="build-shell", ) as shell: …​ Example — OAuth (browser relay or OAuth-only environments): async with client.open_shell( runtime_arn, auth=OAuthAuth(bearer_token=await get_oauth_token()), shell_id="inspector-shell", ) as shell: …​ Example — auto-reconnect with callback: async def on_reconnect(reconnected: bool) → None: print(f"reconnected={reconnected}") config = ReconnectConfig(max_retries=5, on_reconnect=on_reconnect) async with client.open_shell( runtime_arn, shell_id="debug", reconnect_config=config, ) as shell: async for frame in shell: …​

#### teardown_endpoint_and_runtime

```text
teardown_endpoint_and_runtime(agent_runtime_id: str, endpoint_name: str = 'DEFAULT') -> None
```
Delete endpoint then runtime in correct order.

Silently ignores ResourceNotFoundException for either resource (already deleted).

**Parameters**

`agent_runtime_id`
    

The agent runtime ID.

`endpoint_name`
    

Endpoint name (default: "DEFAULT").

#### update_agent_runtime_and_wait

```text
update_agent_runtime_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Update an agent runtime and wait for it to reach READY status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the update_agent_runtime API.

**Returns**

Runtime details when READY.

**Raises**

`RuntimeError`
    

If the runtime reaches a failed state.

`TimeoutError`
    

If the runtime doesn’t become READY within max_wait.

#### update_agent_runtime_endpoint_and_wait

```text
update_agent_runtime_endpoint_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Update an agent runtime endpoint and wait for READY status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the update_agent_runtime_endpoint API.

**Returns**

Endpoint details when READY.

**Raises**

`RuntimeError`
    

If the endpoint reaches a failed state.

`TimeoutError`
    

If the endpoint doesn’t become READY within max_wait.

### AGUIApp

```text
AGUIApp(debug: bool = False, lifespan: Any = None, middleware: Any = None)
```
Amazon Bedrock AgentCore AG-UI application.

Exposes the same agent handler over two alternative transports per the AG-UI contract:

  * `POST /invocations` — SSE (unidirectional server→client streaming)

  * `/ws` — WebSocket (bidirectional, same AG-UI events)

  * `GET /ping` — health check


#### _init_

```text
__init__(debug: bool = False, lifespan: Any = None, middleware: Any = None)
```
Initialize AG-UI application.

**Parameters**

`debug`
    

Enable debug mode (default: False).

`lifespan`
    

An optional lifespan context manager.

`middleware`
    

An optional sequence of Starlette Middleware.

#### entrypoint

```text
entrypoint(agent_or_func: Any) -> Any
```
Register the agent handler for both SSE and WebSocket transports.

Accepts either: \- An object with a `.run()` method (framework agents) \- A callable / async generator function (custom agents, decorator form)

The registered handler is served on both `POST /invocations` (SSE) and `/ws` (WebSocket).

**Parameters**

`agent_or_func`
    

The agent or function to register.

**Returns**

The original argument (so it works as a decorator).

#### ping

```text
ping(func: Callable) -> Callable
```
Register a custom ping handler (decorator).

**Parameters**

`func`
    

A callable returning a `PingStatus`.

**Returns**

The original function.

#### run

```text
run(port: int = 8080, host: Optional[str] = None, **kwargs: Any) -> None
```
Start the AG-UI server.

**Parameters**

`port`
    

Port to serve on (default 8080).

`host`
    

Host to bind to; auto-detected if None.

`**kwargs` _(optional)_
    

Additional arguments forwarded to `uvicorn.run()`.

### BedrockAgentCoreApp

```text
BedrockAgentCoreApp(debug: bool = False, lifespan: Union[collections.abc.Callable[[~AppType], contextlib.AbstractAsyncContextManager[None]], collections.abc.Callable[[~AppType], contextlib.AbstractAsyncContextManager[collections.abc.Mapping[str, Any]]], NoneType] = None, middleware: collections.abc.Sequence[starlette.middleware.Middleware] | None = None)
```
Amazon Bedrock AgentCore application class that extends Starlette for AI agent deployment.

#### _init_

```text
__init__(debug: bool = False, lifespan: Union[collections.abc.Callable[[~AppType], contextlib.AbstractAsyncContextManager[None]], collections.abc.Callable[[~AppType], contextlib.AbstractAsyncContextManager[collections.abc.Mapping[str, Any]]], NoneType] = None, middleware: collections.abc.Sequence[starlette.middleware.Middleware] | None = None)
```
Initialize Amazon Bedrock AgentCore application.

**Parameters**

`debug`
    

Enable debug actions for task management (default: False)

`lifespan`
    

An optional lifespan context manager for startup/shutdown

`middleware`
    

An optional sequence of Starlette Middleware objects (or Middleware(…​) entries)

#### add_async_task

```text
add_async_task(name: str, metadata: Optional[Dict] = None) -> int
```
Register an async task for interactive health tracking.

This method provides granular control over async task lifecycle, allowing developers to interactively start tracking tasks for health monitoring. Use this when you need precise control over when tasks begin and end.

**Parameters**

`name`
    

Human-readable task name for monitoring

`metadata`
    

An optional additional task metadata

**Returns**

Task ID for tracking and completion

```text
task_id = app.add_async_task("file_processing", {"file": "data.csv"})
# ... do background work ...
app.complete_async_task(task_id)
```
#### async_task

```text
async_task(func: Callable) -> Callable
```
Decorator to track async tasks for ping status.

When a function is decorated with @async_task, it will: \- Set ping status to HEALTHY_BUSY while running \- Revert to HEALTHY when complete

#### clear_forced_ping_status

```text
clear_forced_ping_status()
```
Clear forced status and resume automatic.

#### complete_async_task

```text
complete_async_task(task_id: int) -> bool
```
Mark an async task as complete for interactive health tracking.

This method provides granular control over async task lifecycle, allowing developers to interactively complete tasks for health monitoring. Call this when your background work finishes.

**Parameters**

`task_id`
    

Task ID returned from add_async_task

**Returns**

True if task was found and completed, False otherwise

```text
task_id = app.add_async_task("file_processing")
# ... do background work ...
completed = app.complete_async_task(task_id)
```
#### entrypoint

```text
entrypoint(func: Callable) -> Callable
```
Decorator to register a function as the main entrypoint.

**Parameters**

`func`
    

The function to register as entrypoint

**Returns**

The decorated function with added serve method

#### force_ping_status

```text
force_ping_status(status: bedrock_agentcore.runtime.models.PingStatus)
```
Force ping status to a specific value.

#### get_async_task_info

```text
get_async_task_info() -> Dict[str, Any]
```
Get info about running async tasks.

#### get_current_ping_status

```text
get_current_ping_status() -> bedrock_agentcore.runtime.models.PingStatus
```
Get current ping status (forced > custom > automatic).

#### ping

```text
ping(func: Callable) -> Callable
```
Decorator to register a custom ping status handler.

**Parameters**

`func`
    

The function to register as ping status handler

**Returns**

The decorated function

#### run

```text
run(port: int = 8080, host: Optional[str] = None, **kwargs)
```
Start the Amazon Bedrock AgentCore server.

**Parameters**

`port`
    

Port to serve on, defaults to 8080

`host`
    

Host to bind to, auto-detected if None

`**kwargs` _(optional)_
    

Additional arguments passed to uvicorn.run()

#### websocket

```text
websocket(func: Callable) -> Callable
```
Decorator to register a WebSocket handler at /ws endpoint.

**Parameters**

`func`
    

The function to register as WebSocket handler

**Returns**

The decorated function

```text
@app.websocket
async def handler(websocket, context):
    await websocket.accept()
    # ... handle messages ...
```
### BedrockCallContextBuilder

```text
BedrockCallContextBuilder() -> None
```
Extracts Bedrock runtime headers and propagates them into BedrockAgentCoreContext.

Implements the a2a-sdk CallContextBuilder ABC so the A2A server automatically calls `build()` on every incoming request.

#### _init_

```text
__init__() -> None
```
Initialize BedrockCallContextBuilder and register the baggage span processor.

#### build

```text
build(request: Any) -> Any
```
Build a ServerCallContext from a Starlette Request.

**Parameters**

`request`
    

A Starlette Request object.

**Returns**

A ServerCallContext with Bedrock headers stored in `state`.

### BedrockAgentCoreContext

```text
BedrockAgentCoreContext()
```
Unified context manager for Amazon Bedrock AgentCore.

### OAuthAuth

```text
OAuthAuth(bearer_token: str) -> None
```
OAuth bearer token authentication for `open_shell`.

Use this when connecting from a browser relay or any context where an OAuth token (not AWS IAM credentials) is the auth mechanism. The token is embedded in the `Sec-WebSocket-Protocol` header — the only auth mechanism browsers can provide on a WebSocket upgrade (RFC 6455 §4.1).

Attributes: bearer_token: OAuth bearer token obtained from your identity provider.

```text
async with client.open_shell(
    runtime_arn,
    auth=OAuthAuth(bearer_token=await get_oauth_token()),
) as shell:
    ...
```
#### _init_

```text
__init__(bearer_token: str) -> None
```
### PresignedAuth

```text
PresignedAuth(expires: int = 300) -> None
```
Presigned URL authentication for `open_shell`.

Use this when you want auth embedded in the URL query string — useful when handing off to another process or service without sharing AWS credentials, or when the WebSocket client cannot set custom headers.

Attributes: expires: Seconds until the presigned URL expires (max 300).

```text
async with client.open_shell(
    runtime_arn,
    auth=PresignedAuth(expires=120),
) as shell:
    ...
```
#### _init_

```text
__init__(expires: int = 300) -> None
```
### ReconnectConfig

```text
ReconnectConfig(max_retries: int = 5, base_delay: float = 1.0, max_delay: float = 15.0, reconnect_window: Optional[float] = 900.0, outer_loop_delay: float = 30.0, on_reconnect: Optional[Callable[[bool], Optional[Awaitable[NoneType]]]] = None) -> None
```
Configuration for automatic reconnection on WebSocket disconnect.

When provided to `open_shell`, `ShellSession` will automatically reconnect using the same `shell_id` after an unexpected disconnect. The shell process on the VM keeps running while detached, and up to 256 KB of buffered output is replayed when the new WebSocket attaches.

Attributes: max_retries: Maximum number of reconnect attempts per inner loop before pausing and starting a fresh inner loop. The inner loop is bounded at 5. Use `reconnect_window=None` for unlimited overall retries across outer loop cycles. base_delay: Initial backoff delay in seconds. Doubles on each attempt up to `max_delay`. max_delay: Upper bound on backoff delay in seconds. The inner loop caps at 15s (sequence: 1s, 2s, 4s, 8s, 15s). reconnect_window: Total seconds to keep retrying after a disconnect before giving up entirely. Matches the server-side ~15 min reconnection window (KARP idle timeout). Set to `None` to retry indefinitely. outer_loop_delay: Seconds to wait between inner loop exhaustion and the next outer retry cycle. on_reconnect: Optional async or sync callback invoked after each successful reconnect. Receives `reconnected: bool` — `True` means the existing PTY was reattached (buffered output will follow as STDOUT frames); `False` means a fresh shell was started.

Example — log reconnects and flush buffered output to a file: async def on_reconnect(reconnected: bool) → None: if reconnected: print("Reattached to existing PTY — replaying buffered output") else: print("New shell started")

```text
config = ReconnectConfig(reconnect_window=None, on_reconnect=on_reconnect)  # None = unlimited
async with client.open_shell(arn, reconnect_config=config) as shell:
    async for frame in shell:
        ...
```
#### _init_

```text
__init__(max_retries: int = 5, base_delay: float = 1.0, max_delay: float = 15.0, reconnect_window: Optional[float] = 900.0, outer_loop_delay: float = 30.0, on_reconnect: Optional[Callable[[bool], Optional[Awaitable[NoneType]]]] = None) -> None
```
### RequestContext

```text
RequestContext(*, session_id: Optional[str] = None, request_headers: Optional[Dict[str, str]] = None, request: Optional[Any] = None) -> None
```
Request context containing metadata from HTTP requests.

### PingStatus

```text
PingStatus(value, names=None, *, module=None, qualname=None, type=None, start=1)
```
Ping status enum for health check responses.

### ShellChannel

```text
ShellChannel(value, names=None, *, module=None, qualname=None, type=None, start=1)
```
Wire channel identifiers for the binary channel-prefix protocol.

### ShellFrame

```text
ShellFrame(channel: bedrock_agentcore.runtime.shell.protocol.ShellChannel, raw_channel_byte: int, payload: bytes) -> None
```
A single decoded WebSocket frame from the shell stream.

Attributes: channel: The channel this frame belongs to. For unrecognised channel bytes (future protocol extensions) this is `ShellChannel.UNKNOWN`; use `raw_channel_byte` to retrieve the original wire value. raw_channel_byte: The original channel byte from the wire, always present regardless of whether the byte maps to a known ShellChannel. payload: Raw bytes of the frame payload (everything after the channel byte).

#### _init_

```text
__init__(channel: bedrock_agentcore.runtime.shell.protocol.ShellChannel, raw_channel_byte: int, payload: bytes) -> None
```
#### json

```text
json() -> Dict[str, Any]
```
Parse payload as JSON.

**Returns**

Parsed JSON object.

### ShellFramer

```text
ShellFramer()
```
Encodes and decodes binary channel-prefix WebSocket frames.

Stateless — a single instance is safe to reuse across frames.

```python
framer = ShellFramer()

# Decode inbound frame
frame = framer.decode(raw_bytes)
if frame.channel == ShellChannel.STDOUT:
    sys.stdout.write(frame.text)
elif frame.channel == ShellChannel.STATUS:
    status = frame.json()
    if status.get("metadata", {}).get("shellId"):
        print(f"connected: {status['metadata']['shellId']}")
    elif status.get("status") == "Failure":
        causes = status.get("details", {}).get("causes", [])
        code = next((c["message"] for c in causes if c["reason"] == "ExitCode"), None)
        print(f"shell exited with code {code}")

# Encode outbound frames
ws.send(framer.encode_stdin("ls /workspace\\n"))
ws.send(framer.encode_resize(220, 50))
ws.send(framer.encode_close())
```
#### decode

```text
decode(frame: bytes) -> bedrock_agentcore.runtime.shell.protocol.ShellFrame
```
Decode one raw WebSocket binary message into a ShellFrame.

**Parameters**

`frame`
    

Raw bytes received from the WebSocket.

**Returns**

Decoded ShellFrame.

**Raises**

`ValueError`
    

If the frame is empty.

#### encode_close

```text
encode_close() -> bytes
```
Encode a graceful-shutdown CLOSE frame (empty payload).

**Returns**

Binary WebSocket frame ready to send.

#### encode_heartbeat

```text
encode_heartbeat() -> bytes
```
Encode an app-level heartbeat frame (channel 0x05, empty payload).

Browser clients cannot send RFC 6455 Ping frames, so the spec defines channel 0x05 as an application-level keepalive: the client sends this every 30 seconds, and the server echoes a single [0x05] back. Both directions reset the KARP idle timer, preventing the ~15-minute proxy timeout on quiet connections.

SDK/CLI clients should prefer RFC 6455 Ping frames (handled automatically by all standard WebSocket libraries). Use this only when building a browser relay.

**Returns**

Binary WebSocket frame ready to send.

#### encode_resize

```text
encode_resize(width: int, height: int) -> bytes
```
Encode a terminal resize event as a RESIZE frame.

Send this whenever the terminal window changes size so the PTY reflows output correctly (for example, on xterm.js onResize).

**Parameters**

`width`
    

New terminal width in columns.

`height`
    

New terminal height in rows.

**Returns**

Binary WebSocket frame ready to send.

**Raises**

`ValueError`
    

If width or height is not a positive integer.

#### encode_stdin

```text
encode_stdin(data: Union[str, bytes]) -> bytes
```
Encode keyboard input or paste data as a STDIN frame.

Large pastes must be chunked into <64 KB segments before calling this method; the server closes the connection on oversized frames.

**Parameters**

`data`
    

Text (encoded as UTF-8) or raw bytes to send to the shell.

**Returns**

Binary WebSocket frame ready to send.

**Raises**

`ValueError`
    

If the encoded payload would exceed the 64 KB frame limit.

### ShellSession

```text
ShellSession(client: 'AgentCoreRuntimeClient', runtime_arn: str, session_id: Optional[str] = None, shell_id: Optional[str] = None, endpoint_name: Optional[str] = None, auth: Union[Literal['sigv4'], bedrock_agentcore.runtime.shell.auth.PresignedAuth, bedrock_agentcore.runtime.shell.auth.OAuthAuth] = 'sigv4', reconnect_config: Optional[bedrock_agentcore.runtime.shell.config.ReconnectConfig] = None) -> None
```
Async context manager wrapping a live interactive shell WebSocket session.

Connects on ` _aenter_ `, reads the mandatory metadata frame that carries `shellId` and `reconnected`, and exposes typed send/resize/iterate/close. When `reconnect_config` is provided, transparently reconnects on unexpected disconnects using the same `shell_id` and `session_id` so the shell’s working directory, environment, background jobs, and up to 256 KB of buffered output are preserved.

Usage — SigV4 (default, server-side Python): client = AgentCoreRuntimeClient("us-west-2") async with client.open_shell(runtime_arn) as shell: await shell.send("cat /etc/os-release\\\n") async for frame in shell: if frame.channel == ShellChannel.STDOUT: print(frame.text, end="", flush=True) elif frame.channel == ShellChannel.STATUS: # Termination: empty metadata (no shellId). if not frame.json().get("metadata", \{}).get("shellId"): break

Usage — presigned URL: async with client.open_shell( runtime_arn, auth=PresignedAuth(expires=120), ) as shell: …​

Usage — OAuth (browser relay or OAuth-only environments): async with client.open_shell( runtime_arn, auth=OAuthAuth(bearer_token=await get_oauth_token()), ) as shell: …​

Usage — auto-reconnect: config = ReconnectConfig(max_retries=5, on_reconnect=my_callback) async with client.open_shell( runtime_arn, shell_id="debug", reconnect_config=config, ) as shell: async for frame in shell: # iterator survives network blips …​

Usage — manual reconnect after network drop: # Both shell_id AND session_id are required. shell_id names the PTY; # session_id routes to the VM that hosts it. # After an abrupt drop _ws is None, so _aexit_ skips the CLOSE frame # and the PTY stays alive on the server for the reconnect. shell_id = "debug" session_id = str(uuid.uuid4()) # generate once, reuse on every reconnect


```text
async with client.open_shell(
    runtime_arn, shell_id=shell_id, session_id=session_id
) as shell:
    async for frame in shell:
        ...   # StopAsyncIteration when the network drops
```
 
```text
async with client.open_shell(
    runtime_arn, shell_id=shell_id, session_id=session_id
) as shell:
    assert shell.reconnected       # True → up to 256 KB buffered output follows
    async for frame in shell:
        ...
```
 

Attributes: shell_id: Confirmed shell identifier echoed by the server in the initial STATUS frame. Preserve this value across your process restarts — passing the same ID to `open_shell` reconnects to the same PTY. session_id: Runtime session ID that routes to the VM hosting this shell. Auto-generated if not supplied. Preserve this alongside `shell_id` when reconnecting across process restarts — passing a different (or omitted) session ID may cause the platform to provision a fresh VM where the PTY no longer exists. reconnected: `True` when the session resumed an existing PTY (buffered output will arrive as STDOUT frames immediately after connect); `False` for a fresh shell. kicked: `True` when iteration stopped because another client connected with the same `shell_id` (close code 4000). The PTY is still alive — a new `open_shell` call with the same ID will reconnect to it. bytes_dropped: Number of bytes lost from the PTY ring buffer during the most recent disconnect. Non-zero only when the 256 KB ring buffer overflowed before reconnection completed. Set after the post-drain STATUS confirmation frame arrives (which follows the buffered STDOUT burst). Zero if no overflow occurred or on a fresh connection. exit_code: Exit code of the shell process. `None` until the shell exits or if the platform terminated the session without providing an exit code (for example, an InternalError). `0` for a clean exit; non-zero for a failed command or a signal-killed process. Set when the termination STATUS frame is processed — check this after the `async for` loop ends.

Example
    

async with client.open_shell(runtime_arn) as shell: await shell.send("make build\\\n") async for frame in shell: if frame.channel == ShellChannel.STDOUT: print(frame.text, end="", flush=True)

```text
if shell.exit_code:  # None = no code available; 0 = clean exit
    raise RuntimeError(f"Build failed with exit code \{shell.exit_code}")
```
#### _init_

```text
__init__(client: 'AgentCoreRuntimeClient', runtime_arn: str, session_id: Optional[str] = None, shell_id: Optional[str] = None, endpoint_name: Optional[str] = None, auth: Union[Literal['sigv4'], bedrock_agentcore.runtime.shell.auth.PresignedAuth, bedrock_agentcore.runtime.shell.auth.OAuthAuth] = 'sigv4', reconnect_config: Optional[bedrock_agentcore.runtime.shell.config.ReconnectConfig] = None) -> None
```
Validate inputs and initialise session state; does not connect.

#### close

```text
close() -> None
```
Send a graceful CLOSE frame and close the underlying WebSocket.

#### resize

```text
resize(width: int, height: int) -> None
```
Notify the PTY of a terminal resize.

**Parameters**

`width`
    

New terminal width in columns.

`height`
    

New terminal height in rows.

#### send

```text
send(data: str) -> None
```
Send keystrokes or paste text to the shell as a STDIN frame.

**Parameters**

`data`
    

Text to send. Encoded as UTF-8 before framing.

#### send_bytes

```text
send_bytes(data: bytes) -> None
```
Send raw bytes to the shell as a STDIN frame (for example, escape sequences).

**Parameters**

`data`
    

Raw bytes to send.

### build_a2a_app

```text
build_a2a_app(executor: Any, agent_card: Any = None, *, task_store: Any = None, context_builder: Any = None, ping_handler: Optional[Callable[[], bedrock_agentcore.runtime.models.PingStatus]] = None) -> Any
```
Build a Starlette app wired for A2A protocol with Bedrock extras.

**Parameters**

`executor`
    

An `AgentExecutor` that implements the agent logic.

`agent_card`
    

An optional `a2a.types.AgentCard` describing the agent. If `None`, one is built automatically by introspecting the executor.

`task_store`
    

An optional `TaskStore`; defaults to `InMemoryTaskStore`.

`context_builder`
    

An optional `CallContextBuilder`; defaults to `BedrockCallContextBuilder`.

`ping_handler`
    

An optional callback returning a `PingStatus`.

**Returns**

A Starlette application.

### build_ag_ui_app

```text
build_ag_ui_app(agent: Any, *, ping_handler: Optional[Callable[[], bedrock_agentcore.runtime.models.PingStatus]] = None) -> bedrock_agentcore.runtime.ag_ui.AGUIApp
```
Build a Starlette app wired for AG-UI protocol with Bedrock extras.

The returned app serves the agent on both `POST /invocations` (SSE) and `/ws` (WebSocket).

**Parameters**

`agent`
    

An agent object with `.run()` or an async generator callable.

`ping_handler`
    

An optional callback returning a `PingStatus`.

**Returns**

An `AGUIApp` instance (not started).

### build_runtime_url

```text
build_runtime_url(agent_arn: str, region: Optional[str] = None) -> str
```
Build the Amazon Bedrock AgentCore runtime invocation URL from an agent ARN.

**Parameters**

`agent_arn`
    

The agent runtime ARN, for example, `arn:aws:bedrock-agentcore:us-east-1:123456789012:runtime/my-agent-abc123`.

`region`
    

The AWS Region override. If `None`, extracted from the ARN.

**Returns**

The full invocation URL with the ARN properly URL-encoded.

### serve_a2a

```text
serve_a2a(executor: Any, agent_card: Any = None, *, port: int = 9000, host: Optional[str] = None, task_store: Any = None, context_builder: Any = None, ping_handler: Optional[Callable[[], bedrock_agentcore.runtime.models.PingStatus]] = None, **kwargs: Any) -> None
```
Start a Bedrock-compatible A2A server.

**Parameters**

`executor`
    

An `AgentExecutor` that implements the agent logic.

`agent_card`
    

An optional `a2a.types.AgentCard` describing the agent. If `None`, one is built automatically by introspecting the executor.

`port`
    

Port to serve on (default 9000).

`host`
    

Host to bind to; auto-detected if `None`.

`task_store`
    

An optional `TaskStore`; defaults to `InMemoryTaskStore`.

`context_builder`
    

An optional `CallContextBuilder`; defaults to `BedrockCallContextBuilder`.

`ping_handler`
    

An optional callback returning a `PingStatus`.

`**kwargs` _(optional)_
    

Additional arguments forwarded to `uvicorn.run()`.

### serve_ag_ui

```text
serve_ag_ui(agent: Any, *, port: int = 8080, host: Optional[str] = None, ping_handler: Optional[Callable[[], bedrock_agentcore.runtime.models.PingStatus]] = None, **kwargs: Any) -> None
```
Start a Bedrock-compatible AG-UI server.

**Parameters**

`agent`
    

An agent object with `.run()` or an async generator callable.

`port`
    

Port to serve on (default 8080).

`host`
    

Host to bind to; auto-detected if `None`.

`ping_handler`
    

An optional callback returning a `PingStatus`.

`**kwargs` _(optional)_
    

Additional arguments forwarded to `uvicorn.run()`.

## Identity

_Auto-generated from`bedrock-agentcore` v1.18.1 — do not edit by hand._

Amazon Bedrock AgentCore Python SDK identity package.

### requires_access_token

```text
requires_access_token(*, provider_name: str, into: str = 'access_token', scopes: List[str], resources: Optional[List[str]] = None, audiences: Optional[List[str]] = None, on_auth_url: Optional[Callable[[str], Any]] = None, auth_flow: Literal['M2M', 'USER_FEDERATION', 'ON_BEHALF_OF_TOKEN_EXCHANGE'], callback_url: Optional[str] = None, force_authentication: bool = False, token_poller: Optional[bedrock_agentcore.services.identity.TokenPoller] = None, custom_state: Optional[str] = None, custom_parameters: Optional[Dict[str, str]] = None) -> Callable
```
Decorator that fetches an OAuth2 access token before calling the decorated function.

**Parameters**

`provider_name`
    

The credential provider name

`into`
    

Parameter name to inject the token into

`scopes`
    

OAuth2 scopes to request

`resources`
    

OAuth2 resources to request

`audiences`
    

OAuth2 audiences to request

`on_auth_url`
    

Callback for handling authorization URLs

`auth_flow`
    

Authentication flow type ("M2M" or "USER_FEDERATION" or "ON_BEHALF_OF_TOKEN_EXCHANGE")

`callback_url`
    

OAuth2 callback URL

`force_authentication`
    

Force re-authentication

`token_poller`
    

Custom token poller implementation

`custom_state`
    

A state that allows applications to verify the validity of callbacks to callback_url

`custom_parameters`
    

A map of custom parameters to include in authorization request to the credential provider

`Note`
    

these parameters are in addition to standard OAuth 2.0 flow parameters

**Returns**

Decorator function

### requires_api_key

```text
requires_api_key(*, provider_name: str, into: str = 'api_key') -> Callable
```
Decorator that fetches an API key before calling the decorated function.

**Parameters**

`provider_name`
    

The credential provider name

`into`
    

Parameter name to inject the API key into

**Returns**

Decorator function

## Gateway

_Auto-generated from`bedrock-agentcore` v1.18.1 — do not edit by hand._

Amazon Bedrock AgentCore Gateway client.

### GatewayClient

```text
GatewayClient(region_name: Optional[str] = None, integration_source: Optional[str] = None, boto3_session: Optional[boto3.session.Session] = None)
```
Client for Amazon Bedrock AgentCore Gateway operations.

Provides access to gateway and gateway target CRUD operations. Allowlisted boto3 methods can be called directly on this client. Parameters accept both camelCase and snake_case (auto-converted).

Example
    

client = GatewayClient(region_name="us-west-2")

```bash
# Pass-through to boto3 control plane client
gateway = client.create_gateway(
    name="my-gateway",
    roleArn="arn:aws:iam::123456789:role/gateway-role",
    protocolType="MCP",
)
```
#### _init_

```text
__init__(region_name: Optional[str] = None, integration_source: Optional[str] = None, boto3_session: Optional[boto3.session.Session] = None)
```
Initialize the Gateway client.

**Parameters**

`region_name`
    

The AWS Region name. If not provided, uses the session’s region or "us-west-2".

`integration_source`
    

An optional integration source for user-agent telemetry.

`boto3_session`
    

An optional boto3 Session to use. If not provided, a default session is created. Useful for named profiles or custom credentials.

#### create_agentic_retrieve_target

```text
create_agentic_retrieve_target(gateway_identifier: str, retrievers: List[Dict[str, Any]], model_arn: str, name: Optional[str] = None, description: Optional[str] = None, max_agent_iteration: Optional[int] = None, parameter_overrides: Optional[List[Dict[str, Any]]] = None, wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Create a gateway target that exposes Knowledge Bases as an MCP AgenticRetrieveStream tool.

**Parameters**

`gateway_identifier`
    

Gateway ID or ARN.

`retrievers`
    

List of retriever configurations, each with knowledge_base_id and optional retrieval_overrides. Example: [\{"knowledgeBaseId": "KB1", "description": "…​"}]

`model_arn`
    

Foundation model ARN for orchestration.

`name`
    

Target name. Defaults to "agentic-retrieve-{timestamp}".

`description`
    

Agent-facing description of the AgenticRetrieveStream tool.

`max_agent_iteration`
    

Max iterations for the agentic loop (default: service default).

`parameter_overrides`
    

An optional per-parameter visibility/description overrides.

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Additional arguments forwarded to create_gateway_target. Overrides built values on conflict.

**Returns**

Gateway target details when READY.

#### create_gateway_and_wait

```text
create_gateway_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Create a gateway and wait for it to reach READY status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior (default: max_wait=300, poll_interval=10).

`**kwargs` _(optional)_
    

Arguments forwarded to the create_gateway API.

**Returns**

Gateway details when READY.

**Raises**

`RuntimeError`
    

If the gateway reaches a failed state.

`TimeoutError`
    

If the gateway doesn’t become READY within max_wait.

#### create_gateway_target_and_wait

```text
create_gateway_target_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Create a gateway target and wait for it to reach READY status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior (default: max_wait=300, poll_interval=10).

`**kwargs` _(optional)_
    

Arguments forwarded to the create_gateway_target API. Must include gatewayIdentifier.

**Returns**

Gateway target details when READY.

**Raises**

`RuntimeError`
    

If the target reaches a failed state.

`TimeoutError`
    

If the target doesn’t become READY within max_wait.

#### create_knowledge_base_target

```text
create_knowledge_base_target(gateway_identifier: str, knowledge_base_id: str, name: Optional[str] = None, description: Optional[str] = None, retrieval_configuration: Optional[Dict[str, Any]] = None, parameter_overrides: Optional[List[Dict[str, Any]]] = None, wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Create a gateway target that exposes a Knowledge Base as an MCP Retrieve tool.

**Parameters**

`gateway_identifier`
    

Gateway ID or ARN.

`knowledge_base_id`
    

The Knowledge Base to expose.

`name`
    

Target name. Defaults to "kb-{knowledge_base_id}".

`description`
    

Agent-facing description of the Retrieve tool.

`retrieval_configuration`
    

An optional retrieval config (vectorSearchConfiguration, etc.).

`parameter_overrides`
    

An optional per-parameter visibility/description overrides.

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Additional arguments forwarded to create_gateway_target (for example, credentialProviderConfigurations, roleArn). Overrides built values on conflict.

**Returns**

Gateway target details when READY.

#### delete_gateway_and_wait

```text
delete_gateway_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> None
```
Delete a gateway and wait for deletion to complete.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the delete_gateway API.

**Raises**

`TimeoutError`
    

If the gateway isn’t deleted within max_wait.

#### delete_gateway_target_and_wait

```text
delete_gateway_target_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> None
```
Delete a gateway target and wait for deletion to complete.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the delete_gateway_target API.

**Raises**

`TimeoutError`
    

If the target isn’t deleted within max_wait.

#### get_gateway_by_name

```text
get_gateway_by_name(name: str, **kwargs) -> Optional[Dict[str, Any]]
```
Look up a gateway by name.

Paginates through gateways and returns the full resource details for the first match. Short-circuits on first match without fetching remaining pages. Returns None if no gateway with that name exists.

**Parameters**

`name`
    

The gateway name to search for.

`**kwargs` _(optional)_
    

Additional arguments forwarded to the list_gateways API.

**Returns**

Gateway details from get_gateway, or None if not found.

#### get_gateway_target_by_name

```text
get_gateway_target_by_name(gateway_identifier: str, name: str, **kwargs) -> Optional[Dict[str, Any]]
```
Look up a gateway target by name.

Paginates through targets for the given gateway and returns the full resource details for the first match. Short-circuits on first match without fetching remaining pages. Returns None if not found.

**Parameters**

`gateway_identifier`
    

Gateway ID or ARN.

`name`
    

The target name to search for.

`**kwargs` _(optional)_
    

Additional arguments forwarded to the list_gateway_targets API.

**Returns**

Gateway target details from get_gateway_target, or None if not found.

#### update_gateway_and_wait

```text
update_gateway_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Update a gateway and wait for it to reach READY status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior (default: max_wait=300, poll_interval=10).

`**kwargs` _(optional)_
    

Arguments forwarded to the update_gateway API.

**Returns**

Gateway details when READY.

**Raises**

`RuntimeError`
    

If the gateway reaches a failed state.

`TimeoutError`
    

If the gateway doesn’t become READY within max_wait.

#### update_gateway_target_and_wait

```text
update_gateway_target_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Update a gateway target and wait for it to reach READY status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior (default: max_wait=300, poll_interval=10).

`**kwargs` _(optional)_
    

Arguments forwarded to the update_gateway_target API. Must include gatewayIdentifier and targetId.

**Returns**

Gateway target details when READY.

**Raises**

`RuntimeError`
    

If the target reaches a failed state.

`TimeoutError`
    

If the target doesn’t become READY within max_wait.

## Evaluation

_Auto-generated from`bedrock-agentcore` v1.18.1 — do not edit by hand._

AgentCore Evaluation: EvaluationClient, OnDemandEvaluationDatasetRunner, and Strands integration.

### ActorProfile

```text
ActorProfile(*, traits: Dict[str, Any] = {}, context: str, goal: str) -> None
```
Describes the simulated actor’s identity and objective.

###### Warning

This feature is in preview and might change in future releases.

Attributes: traits: Characteristics of the actor (for example, expertise level, communication style). context: Background information about the actor. goal: What the actor wants to achieve in the interaction.

### BatchEvaluationRunner

```text
BatchEvaluationRunner(region: Optional[str] = None)
```
Runs evaluation using the AgentCore Batch Evaluation API.

Starts a batch evaluation via StartBatchEvaluation, and polls GetBatchEvaluation for results.

###### Warning

This feature is in preview and might change in future releases.

#### _init_

```text
__init__(region: Optional[str] = None)
```
Initialize the batch evaluation runner.

**Parameters**

`region`
    

The AWS Region. Defaults to boto3 session region or DEFAULT_REGION.

#### fetch_evaluation_events

```text
fetch_evaluation_events(result: bedrock_agentcore.evaluation.runner.batch.batch_evaluation_models.BatchEvaluationResult) -> List[Dict[str, Any]]
```
Fetch per-turn evaluation events from CloudWatch.

Complements `result.evaluation_results` (`BatchEvaluationSummary`), which contains aggregate average scores. This method returns one OTel event per turn per evaluator, each with an individual score and a natural-language explanation (`gen_ai.evaluation.explanation`).

**Parameters**

`result`
    

Completed `BatchEvaluationResult` from `run_dataset_evaluation`.

**Returns**

List of event dicts, one per turn per evaluator, containing `gen_ai.evaluation.name`, `gen_ai.evaluation.score.value`, `gen_ai.evaluation.score.label`, `gen_ai.evaluation.explanation`, and trace context (`traceId`, `gen_ai.response.id`).

**Raises**

`ValueError`
    

If `result.output_data_config` is `None` (job did not produce a CloudWatch destination).

`LookupError`
    

If the log stream does not exist yet; retry after a short delay.

#### run_dataset_evaluation

```text
run_dataset_evaluation(config: bedrock_agentcore.evaluation.runner.batch.batch_evaluation_models.BatchEvaluationRunConfig, dataset: bedrock_agentcore.evaluation.runner.dataset_types.Dataset, agent_invoker: Callable[[bedrock_agentcore.evaluation.runner.invoker_types.AgentInvokerInput], bedrock_agentcore.evaluation.runner.invoker_types.AgentInvokerOutput]) -> bedrock_agentcore.evaluation.runner.batch.batch_evaluation_models.BatchEvaluationResult
```
Run a batch evaluation on a Dataset.

Executes all scenarios in parallel via `agent_invoker`, transforms ground truth data, submits the collected sessions to `StartBatchEvaluation`, and polls until the job reaches a terminal state.

The returned `BatchEvaluationResult` contains two levels of data:

  * `result.evaluation_results` — aggregate per-evaluator statistics (average scores, session counts). Available immediately.

  * Call `fetch_evaluation_events` for individual per-turn scores with explanations (`gen_ai.evaluation.explanation`).


**Parameters**

`config`
    

Evaluation name, evaluator IDs, session source, concurrency, and polling timeouts.

`dataset`
    

Scenarios to evaluate, with optional ground truth (`assertions`, `expected_trajectory`, per-turn `expected_response`).

`agent_invoker`
    

Called once per turn per scenario. Must be thread-safe — up to `config.max_concurrent_scenarios` threads invoke it concurrently.

**Returns**

`BatchEvaluationResult` with job IDs, status, `evaluation_results` (`BatchEvaluationSummary`), `agent_invocation_failures`, and `output_data_config`.

**Raises**

`ValueError`
    

If `dataset` is empty or all scenarios fail during agent invocation.

`RuntimeError`
    

If API calls fail.

`TimeoutError`
    

If the job exceeds `config.polling_timeout_seconds`.

### BatchEvaluationResult

```text
BatchEvaluationResult(*, batch_evaluation_id: str, batch_evaluation_arn: str, batch_evaluation_name: str, description: Optional[str] = None, status: str, created_at: datetime.datetime, updated_at: Optional[datetime.datetime] = None, evaluation_results: Optional[bedrock_agentcore.evaluation.runner.batch.batch_evaluation_models.BatchEvaluationSummary] = None, error_details: Optional[List[str]] = None, agent_invocation_failures: List[bedrock_agentcore.evaluation.runner.batch.batch_evaluation_models.FailedScenario] = <factory>, output_data_config: Optional[bedrock_agentcore.evaluation.runner.batch.batch_evaluation_models.CloudWatchOutputDataConfig] = None, kms_key_arn: Optional[str] = None) -> None
```
Result returned by `BatchEvaluationRunner.run`.

###### Warning

This feature is in preview and might change in future releases.

Attributes: batch_evaluation_id: Unique identifier for the batch evaluation job, returned by StartBatchEvaluation. batch_evaluation_arn: ARN of the batch evaluation resource. batch_evaluation_name: Human-readable name for the batch evaluation job. description: Optional human-readable description of the batch evaluation job. status: Terminal status of the job (for example, `"COMPLETED"`). created_at: Timestamp when the batch evaluation job was created. updated_at: Timestamp when the batch evaluation job was last updated by the service. `None` if the API did not return it. evaluation_results: Aggregated per-evaluator statistics. Present when the job completed successfully; `None` otherwise. error_details: Service-reported error messages when the job failed. agent_invocation_failures: Scenarios that failed during the agent invocation phase (before the evaluation job was started). A non-empty list does not prevent the job from running — the service evaluates only the successfully invoked sessions. output_data_config: CloudWatch destination where the service writes per-session evaluation result events. Pass to `BatchEvaluationRunner.fetch_evaluation_events` to read the raw OTel evaluation records. kms_key_arn: ARN of the KMS key the service used to encrypt this batch evaluation’s data, echoed back by the API. `None` when an AWS-owned key was used.

### BatchEvaluationRunConfig

```text
BatchEvaluationRunConfig(*, batch_evaluation_name: str, description: Optional[str] = None, evaluator_config: bedrock_agentcore.evaluation.runner.batch.batch_evaluation_models.BatchEvaluatorConfig, data_source: bedrock_agentcore.evaluation.runner.batch.batch_evaluation_models.DataSourceConfig, max_concurrent_scenarios: int = 5, polling_timeout_seconds: int = 1800, polling_interval_seconds: int = 30, simulation_config: Optional[bedrock_agentcore.evaluation.runner.dataset_types.SimulationConfig] = None, kms_key_arn: Optional[str] = None, tags: Optional[Dict[str, str]] = None) -> None
```
Configuration for a single batch evaluation run.

###### Warning

This feature is in preview and might change in future releases.

Attributes: batch_evaluation_name: Human-readable name for the batch evaluation job. evaluator_config: Evaluators to run (built-in IDs or custom ARNs). data_source: Source from which the service reads agent session spans. Use `CloudWatchDataSourceConfig` for agents running on Amazon Bedrock AgentCore runtime. max_concurrent_scenarios: Maximum number of scenarios to invoke in parallel during the agent invocation phase. Defaults to 5. polling_timeout_seconds: Maximum time to wait for the evaluation job to reach a terminal state. Defaults to 1800 (30 minutes). polling_interval_seconds: Time between GetBatchEvaluation polls. Defaults to 30 seconds. Must be less than `polling_timeout_seconds`. simulation_config: Actor simulation settings. Required when the dataset contains SimulatedScenario entries. kms_key_arn: ARN of the customer-managed KMS key used to encrypt the batch evaluation’s data at rest. When omitted, the service uses an AWS-owned key. The key must be in the same region as the evaluation, and the calling principal must have `kms:Encrypt`/`kms:Decrypt` permissions on it. tags: Optional resource tags applied to the batch evaluation job (key/value pairs), useful for cost allocation and access control.

#### validate_polling

```text
validate_polling()
```
Validate that polling_timeout_seconds > polling_interval_seconds and max_concurrent_scenarios > 0.

### CloudWatchOutputDataConfig

```text
CloudWatchOutputDataConfig(*, log_group_name: str, log_stream_name: str) -> None
```
CloudWatch destination for batch evaluation output data.

###### Warning

This feature is in preview and might change in future releases.

Attributes: log_group_name: CloudWatch log group where evaluation results are written. log_stream_name: CloudWatch log stream for this batch evaluation’s results.

### CloudWatchDataSourceConfig

```text
CloudWatchDataSourceConfig(*, service_names: Annotated[List[str], MinLen(min_length=1), MaxLen(max_length=1)], log_group_names: Annotated[List[str], MinLen(min_length=1), MaxLen(max_length=5)], ingestion_delay_seconds: typing.Annotated[int, Ge(ge=0)] = 180) -> None
```
CloudWatch data source — pulls spans from CloudWatch log groups.

###### Warning

This feature is in preview and might change in future releases.

Attributes: service_names: Service names for span filtering. The API accepts exactly one (list of length 1). log_group_names: CloudWatch log group names to search (1–5). ingestion_delay_seconds: Seconds to wait for spans to appear in CloudWatch before submitting the evaluation run. Defaults to 180. This sleep blocks the calling thread for the full duration; set to 0 to skip the wait.

#### pre_evaluation_run_hook

```text
pre_evaluation_run_hook() -> None
```
Wait for CloudWatch span ingestion before submitting the evaluation run.

#### to_data_source_config

```text
to_data_source_config(session_ids: List[str], start_time: datetime.datetime, end_time: datetime.datetime) -> Dict[str, Any]
```
Return a cloudWatchLogs dataSourceConfig dict for the evaluation API.

### OnlineEvaluationDataSourceConfig

```text
OnlineEvaluationDataSourceConfig(*, online_evaluation_config_arn: typing.Annotated[str, MinLen(min_length=1)], use_invocation_time_range: bool = True) -> None
```
Online-evaluation data source — pulls spans from an existing OnlineEvaluationConfig.

###### Warning

This feature is in preview and might change in future releases.

Unlike `CloudWatchDataSourceConfig`, this source does not filter by the session IDs generated during agent invocation: the service reads sessions already captured by the referenced OnlineEvaluationConfig, optionally narrowed to a time window. As a result it is typically used to (re-)evaluate previously recorded sessions rather than sessions produced by the current `agent_invoker` run.

Attributes: online_evaluation_config_arn: ARN of the OnlineEvaluationConfig whose captured sessions are evaluated. use_invocation_time_range: When `True` (default), the runner supplies the `sessionFilterConfig` time window from the earliest/latest session times observed during agent invocation. Set to `False` to omit the window and let the service use the OnlineEvaluationConfig’s own session selection.

#### to_data_source_config

```text
to_data_source_config(session_ids: List[str], start_time: datetime.datetime, end_time: datetime.datetime) -> Dict[str, Any]
```
Return an onlineEvaluationConfigSource dataSourceConfig dict for the evaluation API.

### BatchEvaluatorConfig

```text
BatchEvaluatorConfig(*, evaluator_ids: Annotated[List[str], MinLen(min_length=1)]) -> None
```
Configuration for evaluators.

###### Warning

This feature is in preview and might change in future releases.

Attributes: evaluator_ids: List of evaluator IDs (built-in names or custom ARNs).

### BatchEvaluationSummary

```text
BatchEvaluationSummary(*, numberOfSessionsCompleted: Optional[int] = None, numberOfSessionsInProgress: Optional[int] = None, numberOfSessionsFailed: Optional[int] = None, totalNumberOfSessions: Optional[int] = None, numberOfSessionsIgnored: Optional[int] = None, evaluatorSummaries: Optional[List[bedrock_agentcore.evaluation.runner.batch.batch_evaluation_models.EvaluatorSummary]] = None) -> None
```
Provides aggregated results from a completed batch evaluation.

###### Warning

This feature is in preview and might change in future releases.

Attributes: number_of_sessions_completed: Number of sessions that were successfully evaluated. number_of_sessions_in_progress: Number of sessions still being evaluated (non-zero only in intermediate states). number_of_sessions_failed: Number of sessions that failed evaluation. total_number_of_sessions: Total number of sessions submitted for evaluation. number_of_sessions_ignored: Number of sessions that were ignored. evaluator_summaries: Per-evaluator statistics including average score.

### EvaluatorStatistics

```text
EvaluatorStatistics(*, averageScore: Optional[float] = None) -> None
```
Statistics for an evaluator.

###### Warning

This feature is in preview and might change in future releases.

Attributes: average_score: Average evaluation score across all evaluations.

### EvaluatorSummary

```text
EvaluatorSummary(*, evaluatorId: Optional[str] = None, statistics: Optional[bedrock_agentcore.evaluation.runner.batch.batch_evaluation_models.EvaluatorStatistics] = None, totalEvaluated: Optional[int] = None, totalFailed: Optional[int] = None) -> None
```
Summary statistics for a single evaluator.

###### Warning

This feature is in preview and might change in future releases.

Attributes: evaluator_id: Evaluator identifier. statistics: Aggregated statistics (average score). total_evaluated: Number of items evaluated. total_failed: Number of evaluation failures.

### FailedScenario

```text
FailedScenario(*, scenario_id: str, error_message: str) -> None
```
Information about a scenario that failed during invocation.

Attributes: scenario_id: Scenario identifier. error_message: Error description.

### AgentInvokerInput

```text
AgentInvokerInput(*, payload: Any, session_id: Optional[str] = None) -> None
```
Input passed to the agent invoker for each turn.

Attributes: payload: Input data for the agent (from dataset turn or actor simulator). session_id: Framework-managed session ID. Generated once per scenario and stable across all turns. The invoker should pass this to the agent to maintain conversation continuity.

### AgentInvokerOutput

```text
AgentInvokerOutput(*, agent_output: Any) -> None
```
Output returned by the agent invoker after processing a single turn.

Attributes: agent_output: The agent’s response.

### CloudWatchAgentSpanCollector

```text
CloudWatchAgentSpanCollector(log_group_name: str, region: str = 'us-east-1', max_wait_seconds: int = 300, poll_interval_seconds: int = 30)
```
Collects spans from CloudWatch using precise attributes.session.id filtering.

#### _init_

```text
__init__(log_group_name: str, region: str = 'us-east-1', max_wait_seconds: int = 300, poll_interval_seconds: int = 30)
```
Initialize the CloudWatch span collector.

**Parameters**

`log_group_name`
    

CloudWatch log group name for event logs.

`region`
    

The AWS Region for CloudWatch client.

`max_wait_seconds`
    

Maximum time to poll for spans before giving up (default 300s).

`poll_interval_seconds`
    

Time between poll attempts (default 30s).

#### collect

```text
collect(session_id: str, start_time: datetime.datetime, end_time: datetime.datetime) -> List[dict]
```
Collect spans from CloudWatch, polling until spans appear or timeout.

**Parameters**

`session_id`
    

The session ID to collect spans for.

`start_time`
    

The start time of the session invocation.

`end_time`
    

The end time of the session invocation.

**Returns**

List of ADOT span dictionaries.

### Dataset

```text
Dataset(*, scenarios: List[bedrock_agentcore.evaluation.runner.dataset_types.Scenario]) -> None
```
A collection of evaluation scenarios.

#### validate_scenarios

```text
validate_scenarios()
```
Validate that scenarios list is not empty and has unique IDs.

### DatasetClient

```text
DatasetClient(region_name: Optional[str] = None, integration_source: Optional[str] = None, boto3_session: Optional[boto3.session.Session] = None)
```
Client for managing evaluation datasets.

Provides pass-through access to all dataset management APIs on the bedrock-agentcore-control service, plus *_and_wait helpers for async operations.

Example
    

client = DatasetClient(region_name="us-west-2")


```bash
# Create a dataset and wait for ACTIVE
dataset = client.create_dataset_and_wait(
    datasetName="my-dataset",
    schemaType="AGENTCORE_EVALUATION_PREDEFINED_V1",
    source=\{"inlineExamples": \{"examples": [...]}},
)
```
 
```bash
# Pass-through to any dataset API
client.list_datasets(maxResults=10)
client.add_dataset_examples(datasetId="ds-123", examples=[...])
```
 

#### _init_

```text
__init__(region_name: Optional[str] = None, integration_source: Optional[str] = None, boto3_session: Optional[boto3.session.Session] = None)
```
Initialize the DatasetClient.

**Parameters**

`region_name`
    

The AWS Region. Falls back to boto3 session region or us-west-2.

`integration_source`
    

An optional integration framework identifier for telemetry.

`boto3_session`
    

An optional boto3 Session. If not provided, a default is created.

#### add_examples_and_wait

```text
add_examples_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Add examples to a dataset and wait for ACTIVE status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the add_dataset_examples API.

**Returns**

Dataset details when ACTIVE.

**Raises**

`RuntimeError`
    

If the dataset reaches UPDATE_FAILED status.

`TimeoutError`
    

If the dataset doesn’t become ACTIVE within max_wait.

#### create_dataset_and_wait

```text
create_dataset_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Create a dataset and wait for it to reach ACTIVE status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the create_dataset API.

**Returns**

Dataset details when ACTIVE.

**Raises**

`RuntimeError`
    

If the dataset reaches CREATE_FAILED status.

`TimeoutError`
    

If the dataset doesn’t become ACTIVE within max_wait.

#### create_dataset_version_and_wait

```text
create_dataset_version_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Create a dataset version and wait for the dataset to reach ACTIVE status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the create_dataset_version API.

**Returns**

Dataset details when ACTIVE.

**Raises**

`RuntimeError`
    

If the dataset reaches UPDATE_FAILED status.

`TimeoutError`
    

If the dataset doesn’t become ACTIVE within max_wait.

#### delete_dataset_and_wait

```text
delete_dataset_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Optional[Dict[str, Any]]
```
Delete a dataset (or a single version) and wait for completion.

  * Full delete (no `datasetVersion`): polls until `GetDataset` raises `ResourceNotFoundException`. Fails on `DELETE_FAILED`.

  * Version-specific delete (`datasetVersion` provided): the dataset itself is not removed. Polls `GetDataset` until status returns to `ACTIVE`. Fails on `UPDATE_FAILED`. Returns the dataset details.


**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the delete_dataset API.

**Raises**

`RuntimeError`
    

On `DELETE_FAILED` or `UPDATE_FAILED`.

`TimeoutError`
    

If the operation does not finish within `max_wait`.

#### delete_examples_and_wait

```text
delete_examples_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Delete examples from a dataset and wait for ACTIVE status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the delete_dataset_examples API.

**Returns**

Dataset details when ACTIVE.

**Raises**

`RuntimeError`
    

If the dataset reaches UPDATE_FAILED status.

`TimeoutError`
    

If the dataset doesn’t become ACTIVE within max_wait.

#### update_examples_and_wait

```text
update_examples_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Update examples in a dataset and wait for ACTIVE status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the update_dataset_examples API.

**Returns**

Dataset details when ACTIVE.

**Raises**

`RuntimeError`
    

If the dataset reaches UPDATE_FAILED status.

`TimeoutError`
    

If the dataset doesn’t become ACTIVE within max_wait.

### DatasetProvider

```text
DatasetProvider()
```
Abstract provider for loading datasets.

#### get_dataset

```text
get_dataset() -> bedrock_agentcore.evaluation.runner.dataset_types.Dataset
```
Load and return the dataset.

### EvaluationClient

```text
EvaluationClient(region_name: Optional[str] = None, integration_source: Optional[str] = None)
```
Client for evaluating agent sessions.

Collects spans from CloudWatch and calls the evaluation API with level-aware batching.

Example
    

client = EvaluationClient(region_name="us-west-2")


```bash
# Using agent_id (log group derived automatically)
results = client.run(
    evaluator_ids=["accuracy", "toxicity"],
    session_id="sess-123",
    agent_id="my-agent",
)
```
 
```bash
# Using log_group_name directly
results = client.run(
    evaluator_ids=["accuracy", "toxicity"],
    session_id="sess-123",
    log_group_name="/custom/my-log-group",
)
```
 
```python
for r in results:
    print(f"\{r['evaluatorId']}: \{r.get('value')} - \{r.get('explanation')}")
```
 

#### _init_

```text
__init__(region_name: Optional[str] = None, integration_source: Optional[str] = None)
```
Initialize the EvaluationClient.

**Parameters**

`region_name`
    

The AWS Region. Falls back to boto3 session region or us-west-2.

`integration_source`
    

An optional integration framework identifier for telemetry.

#### create_evaluator_and_wait

```text
create_evaluator_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Create an evaluator and wait for it to reach ACTIVE status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the create_evaluator API.

**Returns**

Evaluator details when ACTIVE.

**Raises**

`RuntimeError`
    

If the evaluator reaches a failed state.

`TimeoutError`
    

If the evaluator doesn’t become ACTIVE within max_wait.

#### create_online_evaluation_config_and_wait

```text
create_online_evaluation_config_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Create an online evaluation config and wait for ACTIVE status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the create_online_evaluation_config API.

**Returns**

Online evaluation config details when ACTIVE.

**Raises**

`RuntimeError`
    

If the config reaches a failed state.

`TimeoutError`
    

If the config doesn’t become ACTIVE within max_wait.

#### delete_evaluator_and_wait

```text
delete_evaluator_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> None
```
Delete an evaluator and wait for deletion to complete.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the delete_evaluator API.

**Raises**

`TimeoutError`
    

If the evaluator isn’t deleted within max_wait.

#### delete_online_evaluation_config_and_wait

```text
delete_online_evaluation_config_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> None
```
Delete an online evaluation config and wait for deletion to complete.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the delete_online_evaluation_config API.

**Raises**

`TimeoutError`
    

If the config isn’t deleted within max_wait.

#### run

```text
run(evaluator_ids: List[str], session_id: str, agent_id: Optional[str] = None, look_back_time: datetime.timedelta = datetime.timedelta(days=7), log_group_name: Optional[str] = None, trace_id: Optional[str] = None, reference_inputs: Optional[bedrock_agentcore.evaluation.client.ReferenceInputs] = None) -> List[Dict[str, Any]]
```
Evaluate an agent session end-to-end.

  1. Collects spans from CloudWatch.

  2. For each evaluator, looks up its level (SESSION/TRACE/TOOL_CALL).

  3. Builds the appropriate evaluationTarget based on level.

  4. Calls evaluate() with auto-batching (max 10 target IDs per request).

  5. Returns combined evaluationResults from all evaluators.


Either `agent_id` or `log_group_name` must be provided. When only `agent_id` is given, the log group name is derived as `/aws/bedrock-agentcore/runtimes/{agent_id}-DEFAULT`.

**Parameters**

`evaluator_ids`
    

List of evaluator IDs (built-in or custom ARNs).

`session_id`
    

The session ID to evaluate.

`agent_id`
    

The agent ID. Used to derive the log group when `log_group_name` is not provided.

`look_back_time`
    

How far back to search for spans (default: 7 days).

`log_group_name`
    

CloudWatch log group name. If provided, `agent_id` is not required.

`trace_id`
    

An optional trace ID to narrow evaluation to a single trace.

`reference_inputs`
    

An optional ground truth for evaluation.

**Returns**

List of evaluation result dicts from all evaluators.

**Raises**

`ValueError`
    

If neither `agent_id` nor `log_group_name` is provided.

#### update_evaluator_and_wait

```text
update_evaluator_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Update an evaluator and wait for it to reach ACTIVE status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the update_evaluator API.

**Returns**

Evaluator details when ACTIVE.

**Raises**

`RuntimeError`
    

If the evaluator reaches a failed state.

`TimeoutError`
    

If the evaluator doesn’t become ACTIVE within max_wait.

#### update_online_evaluation_config_and_wait

```text
update_online_evaluation_config_and_wait(wait_config: Optional[bedrock_agentcore._utils.config.WaitConfig] = None, **kwargs) -> Dict[str, Any]
```
Update an online evaluation config and wait for ACTIVE status.

**Parameters**

`wait_config`
    

An optional WaitConfig for polling behavior.

`**kwargs` _(optional)_
    

Arguments forwarded to the update_online_evaluation_config API.

**Returns**

Online evaluation config details when ACTIVE.

**Raises**

`RuntimeError`
    

If the config reaches a failed state.

`TimeoutError`
    

If the config doesn’t become ACTIVE within max_wait.

### EvaluationResult

```text
EvaluationResult(*, scenario_results: List[bedrock_agentcore.evaluation.runner.on_demand.result.ScenarioResult] = <factory>) -> None
```
Aggregate results for an entire evaluation run.

Attributes: scenario_results: Results for each scenario in the dataset.

### EvaluationRunConfig

```text
EvaluationRunConfig(*, evaluator_config: bedrock_agentcore.evaluation.runner.on_demand.config.EvaluatorConfig, evaluation_delay_seconds: int = 180, max_concurrent_scenarios: int = 5, simulation_config: Optional[bedrock_agentcore.evaluation.runner.dataset_types.SimulationConfig] = None) -> None
```
Top-level configuration for an on-demand evaluation run.

Attributes: evaluator_config: Evaluator settings. evaluation_delay_seconds: Seconds to wait for CloudWatch span ingestion. max_concurrent_scenarios: Thread pool size for concurrent scenario execution. simulation_config: Actor simulation settings. Required when the dataset contains SimulatedScenario entries.

### EvaluatorConfig

```text
EvaluatorConfig(*, evaluator_ids: List[str]) -> None
```
Configuration for evaluators.

Attributes: evaluator_ids: List of evaluator IDs (built-in names or custom ARNs).

### EvaluatorInput

```text
EvaluatorInput(*, evaluation_level: str, session_spans: List[Dict], target_trace_id: Optional[str] = None, target_span_id: Optional[str] = None, schema_version: str = '1.0', evaluator_id: Optional[str] = None, evaluator_name: Optional[str] = None, reference_inputs: List[bedrock_agentcore.evaluation.custom_code_based_evaluators.models.ReferenceInput] = <factory>) -> None
```
Parsed input for a code-based evaluator Lambda function.

Attributes: evaluation_level: The evaluation granularity - "SESSION", "TRACE", or "TOOL_CALL". session_spans: Raw ADOT span dicts from the evaluation service. target_trace_id: The target trace ID (set for TRACE level, None otherwise). target_span_id: The target span ID (set for TOOL_CALL level, None otherwise). schema_version: Schema version of the Lambda contract. evaluator_id: The ID of the code-based evaluator that was invoked. evaluator_name: The name of the code-based evaluator that was invoked. reference_inputs: Ground-truth reference inputs (from evaluationReferenceInputs), filtered by the service according to evaluation level. Empty when no ground truth is configured.

### EvaluatorOutput

```text
EvaluatorOutput(*, value: Optional[float] = None, label: Optional[str] = None, explanation: Optional[str] = None, errorCode: Optional[str] = None, errorMessage: Optional[str] = None) -> None
```
Result returned by a code-based evaluator function.

For **success** responses, `label` is required and `errorCode` / `errorMessage` should be omitted. For **error** responses, set `errorCode` (and optionally `errorMessage`); `label` may be omitted.

Attributes: value: Numerical score for the evaluation (success responses). label: Categorical label (for example, "Pass", "Fail"). Required unless errorCode is set. explanation: Optional explanation of the evaluation result. errorCode: Error code for error responses (for example, "VALIDATION_FAILED"). errorMessage: Human-readable error description for error responses.

### EvaluatorResult

```text
EvaluatorResult(*, evaluator_id: str, results: List[Dict[str, Any]]) -> None
```
Results from a single evaluator, grouped.

Attributes: evaluator_id: The evaluator that produced these results. results: List of raw response dicts from the Evaluate API.

### FileDatasetProvider

```text
FileDatasetProvider(file_path: str)
```
A dataset provider that loads a Dataset from a JSON or JSONL file.

JSON format: \{"scenarios": [\{…​}, \{…​}]} JSONL format: one scenario JSON object per line. Format is selected by file extension (".jsonl" → JSONL, otherwise JSON).

#### _init_

```text
__init__(file_path: str)
```
Initialize with a path to a JSON or JSONL dataset file.

#### get_dataset

```text
get_dataset() -> bedrock_agentcore.evaluation.runner.dataset_types.Dataset
```
Load and return the dataset from the file.

### DatasetManagementServiceProvider

```text
DatasetManagementServiceProvider(dataset_id: str, version_id: Optional[str] = None, client: Optional[bedrock_agentcore.evaluation.dataset_client.DatasetClient] = None)
```
A dataset provider that loads a Dataset from the Dataset Management service.

#### _init_

```text
__init__(dataset_id: str, version_id: Optional[str] = None, client: Optional[bedrock_agentcore.evaluation.dataset_client.DatasetClient] = None)
```
Initialize with a dataset ID and optional version.

**Parameters**

`dataset_id`
    

The dataset ID to fetch.

`version_id`
    

An optional version ID. If omitted, fetches DRAFT.

`client`
    

An optional DatasetClient instance. If not provided, a default is created.

#### get_dataset

```text
get_dataset() -> bedrock_agentcore.evaluation.runner.dataset_types.Dataset
```
Load and return the dataset from the Dataset Management service.

Fetches the dataset via the presigned download URL returned by GetDataset. The URL points to a JSONL file where each line is one example.

**Raises**

`ValueError`
    

If the dataset has no downloadUrl or has an unsupported schemaType.

`RuntimeError`
    

If the dataset content cannot be downloaded.

### OnDemandEvaluationDatasetRunner

```text
OnDemandEvaluationDatasetRunner(region: Optional[str] = None)
```
Runs evaluation scenarios end-to-end.

For each scenario in the dataset, the runner: 1\. Invokes the agent for each turn (run_scenario). 2\. Collects spans via the span collector (collect_spans). 3\. Builds the full evaluate API requests with level-aware targeting (build_evaluate_requests). 4\. Sends the requests and collects results (run_evaluations).

#### _init_

```text
__init__(region: Optional[str] = None)
```
Initialize the evaluation runner with AWS clients.

#### run

```text
run(config: bedrock_agentcore.evaluation.runner.on_demand.config.EvaluationRunConfig, dataset: bedrock_agentcore.evaluation.runner.dataset_types.Dataset, agent_invoker: Callable[[bedrock_agentcore.evaluation.runner.invoker_types.AgentInvokerInput], bedrock_agentcore.evaluation.runner.invoker_types.AgentInvokerOutput], span_collector: bedrock_agentcore.evaluation.agent_span_collector.agent_span_collector.AgentSpanCollector) -> bedrock_agentcore.evaluation.runner.on_demand.result.EvaluationResult
```
Run evaluation across all scenarios in the dataset.

Scenarios are processed in three batched phases: Phase 1: Invoke agents for all scenarios concurrently. Phase 2: Wait for CloudWatch span ingestion (evaluation_delay_seconds). Phase 3: Collect spans and evaluate all scenarios concurrently.

**Parameters**

`config`
    

Evaluation runner configuration.

`dataset`
    

The dataset containing scenarios to evaluate.

`agent_invoker`
    

Callable that invokes the agent for each turn.

`span_collector`
    

Collector for retrieving spans after invocation.

**Returns**

EvaluationResult with scores for every scenario and evaluator.

### ReferenceInputs

```text
ReferenceInputs(*, assertions: Optional[List[str]] = None, expected_trajectory: Optional[List[str]] = None, expected_response: Union[str, Dict[str, str], NoneType] = None) -> None
```
Ground truth inputs for evaluation.

Attributes: assertions: Natural language assertions about expected behavior (session-level). expected_trajectory: Expected tool names in order (session-level). expected_response: Expected response text. A plain string applies to the last trace. A `\{trace_id: response}` dict targets specific traces.

### Scenario

```text
Scenario(*, schema_type: str = '', scenario_id: str, assertions: Optional[List[str]] = None, metadata: Optional[Dict[str, Any]] = None) -> None
```
Base class for evaluation scenarios.

### ScenarioExecutionResult

```text
ScenarioExecutionResult(*, scenario_id: str, session_id: str, start_time: datetime.datetime, end_time: datetime.datetime, status: str, error: Optional[str] = None) -> None
```
Return value from a scenario execution.

### ScenarioExecutor

```text
ScenarioExecutor(*, agent_invoker: Callable[[bedrock_agentcore.evaluation.runner.invoker_types.AgentInvokerInput], bedrock_agentcore.evaluation.runner.invoker_types.AgentInvokerOutput]) -> None
```
Invokes the test subject for a single scenario.

#### run_scenario

```text
run_scenario(scenario: bedrock_agentcore.evaluation.runner.dataset_types.Scenario) -> bedrock_agentcore.evaluation.runner.scenario_executor.ScenarioExecutionResult
```
Execute the scenario and return the result.

### ScenarioResult

```text
ScenarioResult(*, scenario_id: str, session_id: str, status: str = 'COMPLETED', error: Optional[str] = None, evaluator_results: List[bedrock_agentcore.evaluation.runner.on_demand.result.EvaluatorResult] = <factory>) -> None
```
Evaluation results for a single scenario.

Attributes: scenario_id: The scenario that was evaluated. session_id: Framework-generated session ID. status: "COMPLETED" or "FAILED". error: Error message if scenario failed, None otherwise. evaluator_results: Results grouped by evaluator.

### AgentSpanCollector

```text
AgentSpanCollector()
```
Abstract base class for collecting spans after agent invocation.

#### collect

```text
collect(session_id: str, start_time: datetime.datetime, end_time: datetime.datetime) -> List[dict]
```
Collect spans for a given session.

**Parameters**

`session_id`
    

The session ID to collect spans for.

`start_time`
    

The start time of the session invocation.

`end_time`
    

The end time of the session invocation.

**Returns**

List of span dictionaries.

### SimulationConfig

```text
SimulationConfig(*, model_id: Optional[str] = None, system_prompt_template: Optional[str] = None, input_type: Optional[Type[pydantic.main.BaseModel]] = None, output_type: Optional[Type[pydantic.main.BaseModel]] = None) -> None
```
Configuration for actor simulation in SimulatedScenario execution.

###### Warning

This feature is in preview and might change in future releases.

Attributes: model_id: Bedrock model ID for the actor agent. Uses the Strands default model when None. system_prompt_template: Jinja2 system prompt template for the actor. Must contain an `\{\{ actor_profile }}` placeholder. When None, the built-in `structured_user_simulator.j2` template is used. input_type: Pydantic model class describing the agent’s expected input. When set, `input` values in SimulatedScenario are validated into this type for the first agent call. For subsequent turns the actor is schema-constrained via tool-use to produce instances of this type directly. output_type: Pydantic model class describing the agent’s output schema.

### StrandsEvalsAgentCoreEvaluator

```text
StrandsEvalsAgentCoreEvaluator(evaluator_id: str, region: str = 'us-east-1', test_pass_score: float = 0.7, config: Optional[botocore.config.Config] = None)
```
Wraps AgentCore Evaluation API as Strands Evaluator.

Automatically converts Strands OTel spans to AgentCore format.

#### _init_

```text
__init__(evaluator_id: str, region: str = 'us-east-1', test_pass_score: float = 0.7, config: Optional[botocore.config.Config] = None)
```
Initialize the evaluator.

**Parameters**

`evaluator_id`
    

Built-in evaluator name or custom evaluator ARN

`region`
    

The AWS Region for the evaluation API

`test_pass_score`
    

Minimum score threshold for test to pass

`config`
    

An optional boto3 Config for client configuration

#### evaluate

```text
evaluate(evaluation_case: strands_evals.types.evaluation.EvaluationData[~InputT, ~OutputT]) -> List[strands_evals.types.evaluation.EvaluationOutput]
```
Evaluate agent output using AgentCore Evaluation API.

**Parameters**

`evaluation_case`
    

Evaluation case with input, expected output, and trajectory

**Returns**

List of evaluation outputs with scores and explanations

#### evaluate_async

```text
evaluate_async(evaluation_case: strands_evals.types.evaluation.EvaluationData[~InputT, ~OutputT]) -> List[strands_evals.types.evaluation.EvaluationOutput]
```
Evaluate agent output asynchronously using AgentCore Evaluation API.

**Parameters**

`evaluation_case`
    

Evaluation case with input, expected output, and trajectory

**Returns**

List of evaluation outputs with scores and explanations

### Turn

```text
Turn(*, input: Union[str, Dict[str, Any]], expected_response: Optional[str] = None) -> None
```
A single conversational turn in an evaluation scenario.

### PredefinedScenario

```text
PredefinedScenario(*, schema_type: str = 'AGENTCORE_EVALUATION_PREDEFINED_V1', scenario_id: str, assertions: Optional[List[str]] = None, metadata: Optional[Dict[str, Any]] = None, turns: List[bedrock_agentcore.evaluation.runner.dataset_types.Turn], expected_trajectory: Optional[List[str]] = None) -> None
```
A scenario with a predefined conversation flow.

#### validate_turns_non_empty

```text
validate_turns_non_empty()
```
Validate that turns list is not empty.

### PredefinedScenarioExecutor

```text
PredefinedScenarioExecutor(*, agent_invoker: Callable[[bedrock_agentcore.evaluation.runner.invoker_types.AgentInvokerInput], bedrock_agentcore.evaluation.runner.invoker_types.AgentInvokerOutput]) -> None
```
Runs a PredefinedScenario by iterating its explicit turns.

#### run_scenario

```text
run_scenario(scenario: bedrock_agentcore.evaluation.runner.dataset_types.Scenario) -> bedrock_agentcore.evaluation.runner.scenario_executor.ScenarioExecutionResult
```
Execute a predefined scenario by invoking the agent for each turn.

### ReferenceInput

```text
ReferenceInput(*, context: Dict[str, Any] = <factory>, expectedResponse: Optional[Dict[str, Any]] = None, assertions: List[Dict[str, Any]] = <factory>, expectedTrajectory: Optional[Dict[str, Any]] = None, **extra_data: Any) -> None
```
A single ground-truth entry from the event’s `evaluationReferenceInputs` list.

Field shapes follow the AgentCore code-based-evaluator contract. `extra="allow"` keeps unknown/future keys instead of dropping them.

Attributes: context: Span context for the entry, for example, \{"spanContext": \{"sessionId", "traceId"}}. expected_response: Expected response object, for example, \{"text": "…​"} (NOT a bare string). assertions: Assertion-style ground truth, for example, [\{"text": "…​"}]. expected_trajectory: Expected tool trajectory, for example, \{"toolNames": […​]}.

### SimulatedScenario

```text
SimulatedScenario(*, schema_type: str = 'AGENTCORE_EVALUATION_SIMULATED_V1', scenario_id: str, assertions: Optional[List[str]] = None, metadata: Optional[Dict[str, Any]] = None, scenario_description: str = '', actor_profile: bedrock_agentcore.evaluation.runner.dataset_types.ActorProfile, input: Union[str, Dict[str, Any], pydantic.main.BaseModel], max_turns: int = 10) -> None
```
A scenario driven by a simulated actor in a multi-turn conversation loop.

###### Warning

This feature is in preview and might change in future releases.

Attributes: scenario_description: Human-readable description of what this scenario tests. actor_profile: Profile defining the simulated actor’s traits, context, and goal. input: The initial payload sent to the agent to start the conversation. Accepts a plain string, a structured dict, or a `pydantic.BaseModel` instance (for example, an instance of `SimulationConfig.input_type`). max_turns: Maximum number of conversation turns before the simulation stops. Defaults to 10.

#### validate_max_turns

```text
validate_max_turns()
```
Validate that max_turns is at least 1.

### SimulatedScenarioExecutor

```text
SimulatedScenarioExecutor(*, agent_invoker: Callable[[bedrock_agentcore.evaluation.runner.invoker_types.AgentInvokerInput], bedrock_agentcore.evaluation.runner.invoker_types.AgentInvokerOutput], simulation_config: Optional[bedrock_agentcore.evaluation.runner.dataset_types.SimulationConfig] = None) -> None
```
Runs a SimulatedScenario using AgentCoreActorSimulator.

###### Warning

This feature is in preview and might change in future releases.

Uses a dynamically-typed structured output model so the LLM is schema-constrained via tool-use enforcement to produce correctly-typed messages, eliminating the need for JSON parsing heuristics.

#### run_scenario

```text
run_scenario(scenario: bedrock_agentcore.evaluation.runner.dataset_types.Scenario) -> bedrock_agentcore.evaluation.runner.scenario_executor.ScenarioExecutionResult
```
Execute a simulated scenario using an actor-driven conversation loop.

### custom_code_based_evaluator

```text
custom_code_based_evaluator()
```
Decorator that wraps a typed evaluator function as a Lambda handler.

The decorated function receives an `EvaluatorInput` and the Lambda `context`, and returns an `EvaluatorOutput`. The decorator handles parsing the raw Lambda event dict into `EvaluatorInput` and serializing the `EvaluatorOutput` into the response contract expected by the evaluation service.

Must be called with parentheses: `@custom_code_based_evaluator()`.

Example
    

@custom_code_based_evaluator() def handler(input: EvaluatorInput, context) → EvaluatorOutput: return EvaluatorOutput(value=1.0, label="Pass")

### convert_strands_to_adot

```text
convert_strands_to_adot(raw_spans: List[Any]) -> List[Dict[str, Any]]
```
Convert Strands OTel spans to ADOT format for AgentCore evaluation.

**Parameters**

`raw_spans`
    

List of OpenTelemetry Span objects from Strands agent

**Returns**

List of ADOT documents (spans and log records)

```text
>>> from strands_evals.telemetry import StrandsEvalsTelemetry
>>> telemetry = StrandsEvalsTelemetry().setup_in_memory_exporter()
>>> # ... run agent ...
>>> raw_spans = telemetry.in_memory_exporter.get_finished_spans()
>>> adot_docs = convert_strands_to_adot(raw_spans)
```
### create_strands_evaluator

```text
create_strands_evaluator(evaluator_id: str, **kwargs) -> bedrock_agentcore.evaluation.integrations.strands_agents_evals.evaluator.StrandsEvalsAgentCoreEvaluator
```
Create Strands-compatible evaluator backed by AgentCore Evaluation API.

**Parameters**

`evaluator_id`
    

"Builtin.Helpfulness" or custom evaluator ARN

`**kwargs` _(optional)_
    

Additional arguments passed to StrandsEvalsAgentCoreEvaluator

`region` `str`
    

The AWS Region (default: us-west-2)

`test_pass_score` `float`
    

Minimum score for test to pass (default: 0.7)

**Returns**

StrandsEvalsAgentCoreEvaluator instance

```text
evaluator = create_strands_evaluator("Builtin.Helpfulness")
dataset = Dataset(cases=cases, evaluator=evaluator)
report = dataset.run_evaluations(task_fn)
```
### fetch_spans_from_cloudwatch

```text
fetch_spans_from_cloudwatch(session_id: str, event_log_group: str, start_time: datetime.datetime, end_time: Optional[datetime.datetime] = None, region: str = 'us-east-1') -> List[dict]
```
Fetch ADOT spans from CloudWatch with configurable event log group.

Convenience function that creates a CloudWatchSpanFetcher and fetches spans.

ADOT spans are always fetched from aws/spans. Event logs can be fetched from any configurable log group.

**Parameters**

`session_id`
    

Session ID from agent execution

`event_log_group`
    

CloudWatch log group name for event logs - For Runtime agents: "/aws/bedrock-agentcore/runtimes/{agent_id}-{endpoint}" - For custom agents: Any log group you configured (for example, "/my-app/agent-events")

`start_time`
    

Start time for log query

`end_time`
    

End time for log query

`region`
    

The AWS Region (default: from DEFAULT_REGION constant)

**Returns**

List of ADOT span and log record dictionaries


```text
>>> from datetime import datetime, timedelta, timezone
>>> start_time = datetime.now(timezone.utc) - timedelta(minutes=10)
>>> end_time = datetime.now(timezone.utc)
>>> spans = fetch_spans_from_cloudwatch(
...     session_id="abc-123",
...     event_log_group="/aws/bedrock-agentcore/runtimes/my-agent-ABC-DEFAULT",
...     start_time=start_time,
...     end_time=end_time,
... )
```
 
```text
>>> spans = fetch_spans_from_cloudwatch(
...     session_id="abc-123",
...     event_log_group="/my-app/agent-events",
...     start_time=start_time,
...     end_time=end_time,
... )
```
 

## Payments

_Auto-generated from`bedrock-agentcore` v1.18.1 — do not edit by hand._

Amazon Bedrock AgentCore Payment SDK.

### PaymentClient

```text
PaymentClient(region_name: Optional[str] = None, integration_source: Optional[str] = None) -> None
```
Low-level control plane client for payment operations.

Provides direct boto3 method forwarding for control plane operations.

#### _init_

```text
__init__(region_name: Optional[str] = None, integration_source: Optional[str] = None) -> None
```
Initialize the Payments control plane client.

**Parameters**

`region_name`
    

The AWS Region name. Defaults to boto3 session region or us-west-2

`integration_source`
    

An optional identifier for tracking integration source in telemetry

#### create_payment_connector

```text
create_payment_connector(payment_manager_id: str, name: str, connector_type: str, credential_provider_configurations: List[Dict[str, Any]], description: Optional[str] = None, client_token: Optional[str] = None, wait_for_ready: bool = False, max_wait: int = 300, poll_interval: int = 10) -> Dict[str, Any]
```
Create a payment connector for a provider.

**Parameters**

`payment_manager_id`
    

The ID of the payment manager

`name`
    

Name of the connector

`connector_type`
    

Connector type (for example, CoinbaseCDP)

`credential_provider_configurations`
    

List of credential provider configurations. Each config should be a dict with provider name as key and credential config as value.

`Example`
    

[\{"coinbaseCDP": \{"credentialProviderArn": "arn:…​"}}]

`description`
    

An optional description

`client_token`
    

An optional idempotency token. If not provided, a UUID will be generated.

`wait_for_ready`
    

Whether to wait for connector to reach READY status

`max_wait`
    

Maximum seconds to wait if wait_for_ready is True

`poll_interval`
    

Seconds between checks if wait_for_ready is True

**Returns**

Dictionary with paymentConnectorId and status

**Raises**

`ClientError`
    

If creation fails

`TimeoutError`
    

If wait_for_ready is True and max_wait is exceeded

#### create_payment_manager

```text
create_payment_manager(name: str, role_arn: str, authorizer_type: str = 'AWS_IAM', description: Optional[str] = None, authorizer_configuration: Optional[Dict[str, Any]] = None, client_token: Optional[str] = None, wait_for_ready: bool = False, max_wait: int = 300, poll_interval: int = 10) -> Dict[str, Any]
```
Create a payment manager resource.

**Parameters**

`name`
    

Name of the payment manager

`role_arn`
    

IAM role ARN for payment manager authorization

`authorizer_type`
    

Authorization type (default: AWS_IAM)

`description`
    

An optional description

`authorizer_configuration`
    

An optional authorizer configuration

`client_token`
    

An optional idempotency token. If not provided, a UUID will be generated.

`wait_for_ready`
    

Whether to wait for manager to reach READY status

`max_wait`
    

Maximum seconds to wait if wait_for_ready is True

`poll_interval`
    

Seconds between checks if wait_for_ready is True

**Returns**

Dictionary with paymentManagerArn, paymentManagerId, and status

**Raises**

`ClientError`
    

If creation fails

`TimeoutError`
    

If wait_for_ready is True and max_wait is exceeded

#### create_payment_manager_with_connector

```text
create_payment_manager_with_connector(payment_manager_name: str, payment_manager_description: Optional[str], authorizer_type: str, role_arn: str, payment_connector_config: bedrock_agentcore.payments.client.PaymentConnectorConfig, wait_for_ready: bool = False, max_wait: int = 300, poll_interval: int = 10) -> Dict[str, Any]
```
Create a payment manager with connector and credential provider in one operation.

This method orchestrates the creation of three interdependent resources: 1\. Payment Credential Provider (via IdentityClient) - stores vendor credentials 2\. Payment Manager (via PaymentClient) - manages payment operations 3\. Payment Connector (via PaymentClient) - connects to payment provider

Client tokens are generated internally for each resource creation call to ensure idempotency. If any step fails, the method automatically rolls back previously created resources.

**Parameters**

`payment_manager_name`
    

Name of the payment manager

`payment_manager_description`
    

An optional description for payment manager

`authorizer_type`
    

Authorization type (default: AWS_IAM)

`role_arn`
    

IAM role ARN for payment manager authorization

`payment_connector_config`
    

Configuration for payment connector including: - name: Unique name for the payment connector - description: Optional description for the payment connector - payment_credential_provider_config: Credential provider configuration with: - name: Unique name for the credential provider - credential_provider_vendor: Vendor type (for example, CoinbaseCDP, StripePrivy) - credentials: Vendor-specific credentials (CoinbaseCdpCredentials or StripePrivyCredentials)

`wait_for_ready`
    

Whether to wait for resources to reach READY status

`max_wait`
    

Maximum seconds to wait if wait_for_ready is True

`poll_interval`
    

Seconds between checks if wait_for_ready is True

**Returns**

Dictionary containing consolidated response with: - paymentManager: Payment manager details (ARN, ID, status) - paymentConnector: Payment connector details (ID, status) - credentialProvider: Credential provider details (ARN, name)

**Raises**

`ValueError`
    

If required parameters are missing or invalid

`ClientError`
    

If any API call fails (with automatic rollback)

```python
from bedrock_agentcore.payments.client import PaymentClient

payment_client = PaymentClient(region_name="us-east-1")

response = payment_client.create_payment_manager_with_connector(
    payment_manager_name="CDPPaymentManager",
    payment_manager_description="Coinbase Payment Manager",
    authorizer_type="AWS_IAM",
    role_arn="arn:aws:iam::123456789012:role/BedrockAgentCoreFullAccess",
    payment_connector_config={
        "name": "coinbase-connector",
        "description": "Coinbase CDP Connector",
        "payment_credential_provider_config": {
            "name": "coinbase-provider-name",
            "credential_provider_vendor": "CoinbaseCDP",
            "credentials": {
                "api_key_id": "your-api-key-id",
                "api_key_secret": "your-api-key-secret",
                "wallet_secret": "your-wallet-secret",
            },
        },
    },
    wait_for_ready=True,
)

manager_arn = response["paymentManager"]["paymentManagerArn"]
payment_connector_id = response["paymentConnector"]["paymentConnectorId"]
provider_arn = response["credentialProvider"]["credentialProviderArn"]
```
#### delete_payment_connector

```text
delete_payment_connector(payment_manager_id: str, payment_connector_id: str) -> Dict[str, Any]
```
Delete a payment connector.

**Parameters**

`payment_manager_id`
    

The ID of the payment manager

`payment_connector_id`
    

The ID of the connector to delete

**Returns**

Dictionary with deletion status

**Raises**

`ClientError`
    

If deletion fails

#### delete_payment_manager

```text
delete_payment_manager(payment_manager_id: str) -> Dict[str, Any]
```
Delete a payment manager.

**Parameters**

`payment_manager_id`
    

The ID of the payment manager to delete

**Returns**

Dictionary with deletion status

**Raises**

`ClientError`
    

If deletion fails

#### get_payment_connector

```text
get_payment_connector(payment_manager_id: str, payment_connector_id: str) -> Dict[str, Any]
```
Retrieve payment connector details.

**Parameters**

`payment_manager_id`
    

The ID of the payment manager

`payment_connector_id`
    

The ID of the connector

**Returns**

Dictionary with payment connector configuration

**Raises**

`ClientError`
    

If retrieval fails

#### get_payment_manager

```text
get_payment_manager(payment_manager_id: str) -> Dict[str, Any]
```
Retrieve payment manager details.

**Parameters**

`payment_manager_id`
    

The ID of the payment manager

**Returns**

Dictionary with payment manager configuration

**Raises**

`ClientError`
    

If retrieval fails

#### list_payment_connectors

```text
list_payment_connectors(payment_manager_id: str, max_results: int = 100, next_token: Optional[str] = None) -> Dict[str, Any]
```
List connectors for a payment manager with pagination support.

**Parameters**

`payment_manager_id`
    

The ID of the payment manager

`max_results`
    

Maximum number of results to return (default: 100)

`next_token`
    

Token for pagination to retrieve the next set of results

**Returns**

Dictionary containing: - paymentConnectors: List of payment connector configurations - nextToken: Token for retrieving the next page (if more results exist)

**Raises**

`ClientError`
    

If listing fails

#### list_payment_managers

```text
list_payment_managers(max_results: int = 100, next_token: Optional[str] = None) -> Dict[str, Any]
```
List all payment managers with pagination support.

**Parameters**

`max_results`
    

Maximum number of results to return (default: 100)

`next_token`
    

Token for pagination to retrieve the next set of results

**Returns**

Dictionary containing: - paymentManagers: List of payment manager configurations - nextToken: Token for retrieving the next page (if more results exist)

**Raises**

`ClientError`
    

If listing fails

#### update_payment_connector

```text
update_payment_connector(payment_manager_id: str, payment_connector_id: str, description: Optional[str] = None, connector_type: Optional[str] = None, credential_provider_configurations: Optional[List[Dict[str, Any]]] = None, client_token: Optional[str] = None, wait_for_ready: bool = False, max_wait: int = 300, poll_interval: int = 10) -> Dict[str, Any]
```
Update a payment connector.

**Parameters**

`payment_manager_id`
    

The ID of the payment manager

`payment_connector_id`
    

The ID of the connector to update

`description`
    

An optional new description

`connector_type`
    

An optional connector type (for example, CoinbaseCDP)

`credential_provider_configurations`
    

An optional list of credential provider configurations. Each config should be a dict with provider name as key and credential config as value.

`Example`
    

[\{"coinbaseCDP": \{"credentialProviderArn": "arn:…​"}}]

`client_token`
    

An optional idempotency token. If not provided, a UUID will be generated.

`wait_for_ready`
    

Whether to wait for connector to reach READY status

`max_wait`
    

Maximum seconds to wait if wait_for_ready is True

`poll_interval`
    

Seconds between checks if wait_for_ready is True

**Returns**

Dictionary with updated connector details

**Raises**

`ClientError`
    

If update fails

`TimeoutError`
    

If wait_for_ready is True and max_wait is exceeded

#### update_payment_manager

```text
update_payment_manager(payment_manager_id: str, description: Optional[str] = None, authorizer_type: Optional[str] = None, authorizer_configuration: Optional[Dict[str, Any]] = None, role_arn: Optional[str] = None, client_token: Optional[str] = None, wait_for_ready: bool = False, max_wait: int = 300, poll_interval: int = 10) -> Dict[str, Any]
```
Update a payment manager.

**Parameters**

`payment_manager_id`
    

The ID of the payment manager to update

`description`
    

An optional new description

`authorizer_type`
    

An optional authorizer type (CUSTOM_JWT or AWS_IAM)

`authorizer_configuration`
    

An optional authorizer configuration

`role_arn`
    

An optional IAM role ARN for the payment manager

`client_token`
    

An optional idempotency token. If not provided, a UUID will be generated.

`wait_for_ready`
    

Whether to wait for manager to reach READY status

`max_wait`
    

Maximum seconds to wait if wait_for_ready is True

`poll_interval`
    

Seconds between checks if wait_for_ready is True

**Returns**

Dictionary with updated manager details

**Raises**

`ClientError`
    

If update fails

`TimeoutError`
    

If wait_for_ready is True and max_wait is exceeded

### PaymentError

```text
PaymentError
```
Base exception for payment operations.

### PaymentInstrumentConfigurationRequired

```text
PaymentInstrumentConfigurationRequired
```
Raised when payment_instrument_id is not set on the plugin config.

### PaymentSessionConfigurationRequired

```text
PaymentSessionConfigurationRequired
```
Raised when payment_session_id is not set on the plugin config.

### PaymentInstrumentNotFound

```text
PaymentInstrumentNotFound
```
Raised when a payment instrument is not found.

### PaymentSessionNotFound

```text
PaymentSessionNotFound
```
Raised when a payment session is not found.

### InvalidPaymentInstrument

```text
InvalidPaymentInstrument
```
Raised when a payment instrument is invalid or inactive.

### InsufficientBudget

```text
InsufficientBudget
```
Raised when payment amount exceeds remaining budget.

### PaymentSessionExpired

```text
PaymentSessionExpired
```
Raised when attempting to use an expired payment session.

### PaymentManager

```text
PaymentManager(payment_manager_arn: str, region_name: Optional[str] = None, boto3_session: Optional[boto3.session.Session] = None, boto_client_config: Optional[botocore.config.Config] = None, agent_name: Optional[str] = None, bearer_token: Optional[str] = None, token_provider: Optional[Callable[[], str]] = None)
```
Manages payment operations through a simplified interface.

The PaymentManager provides a high-level wrapper around AgentCorePayment operations, simplifying payment operations by managing the paymentManagerArn internally. It provides a clean interface for payment instrument creation, payment session management, and payment processing.

Key Capabilities: \- **Payment Instrument Management** : Create and manage payment instruments without repeatedly passing the manager ARN \- **Payment Session Management** : Create payment sessions with automatic ARN injection \- **Payment Processing** : Process payments with automatic payment instrument validation \- **Method Forwarding** : Access PaymentClient methods directly when needed

Usage Patterns: 1\. **Create Payment Instrument** : Store a payment method for a user 2\. **Create Payment Session** : Establish a time-bounded payment context 3\. **Process Payment** : Execute a payment with automatic validation

```bash
# Initialize manager
    manager = PaymentManager(
        payment_manager_arn="arn:aws:bedrock-agentcore:us-east-1:123456789012:payment-manager/pm-123",
        region_name="us-east-1"
    )

    # Create a payment instrument
    instrument_response = manager.create_payment_instrument(
        payment_connector_id="connector-456",
        payment_instrument_type="EMBEDDED_CRYPTO_WALLET",
        payment_instrument_details={"embeddedCryptoWallet": {"network": "ETHEREUM",
            "linkedAccounts": [{"email": {"emailAddress": "user@example.com"}}]}},
        user_id="user-123",
    )

    # Create a payment session
    session_response = manager.create_payment_session(
        expiry_time_in_minutes=60,
        user_id="user-123",
        limits={"maxSpendAmount": {"value": "100.00", "currency": "USD"}},
    )

    # Process a payment
    payment_response = manager.process_payment(
        payment_session_id=session_response["paymentSessionId"],
        payment_instrument_id=instrument_response["paymentInstrumentId"],
        payment_type="CRYPTO_X402",
        payment_input={"cryptoX402": {
            "version": "1",
            "payload": {
                "scheme": "exact",
                "network": "base-sepolia",
                "maxAmountRequired": "5000",
                "resource": "https://premiousEndpoint",
                "description": "Premium AI joke generation",
                "mimeType": "application/json",
                "payTo": "0x6813749E1eB9E0001A44C2684695FE8AD676cdD9",
                "maxTimeoutSeconds": 300,
                "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF71",
                "outputSchema": {"input": {"type": "http", "method": "GET", "discoverable": True}},
                "extra": {"name": "USDC", "version": "2"},
            },
        }},
        user_id="user-123",
    )
```
#### _init_

```text
__init__(payment_manager_arn: str, region_name: Optional[str] = None, boto3_session: Optional[boto3.session.Session] = None, boto_client_config: Optional[botocore.config.Config] = None, agent_name: Optional[str] = None, bearer_token: Optional[str] = None, token_provider: Optional[Callable[[], str]] = None)
```
Initialize a PaymentManager instance.

**Parameters**

`payment_manager_arn`
    

The ARN of the payment manager instance. Must be a non-empty string.

`region_name`
    

The AWS Region for the bedrock-agentcore client. If not provided, will use the region from boto3_session or default session.

`boto3_session`
    

An optional boto3 Session to use. If provided and region_name parameter is also specified, validation ensures they match.

`boto_client_config`
    

An optional boto3 client configuration. If provided, will be merged with default configuration including user agent.

`agent_name`
    

An optional agent name to propagate via the X-Amzn-Bedrock-AgentCore-Payments-Agent-Name HTTP header on every data-plane API call.

`bearer_token`
    

An optional static JWT bearer token for OAuth/CUSTOM_JWT authentication. When set, requests use Bearer token auth instead of SigV4. Mutually exclusive with token_provider.

`token_provider`
    

An optional callable that returns a fresh JWT bearer token string. Called before each request to support token refresh. Mutually exclusive with bearer_token.

**Raises**

`ValueError`
    

If payment_manager_arn is invalid, region_name conflicts with boto3_session region, configuration parameters are inconsistent, or both bearer_token and token_provider are provided.

#### create_payment_instrument

```text
create_payment_instrument(payment_connector_id: str, payment_instrument_type: str, payment_instrument_details: Dict[str, Any], user_id: Optional[str] = None, client_token: Optional[str] = None) -> Dict[str, Any]
```
Create a payment instrument for a user.

Creates a new payment instrument (for example, crypto wallet) associated with a user. The paymentManagerArn is automatically injected from the manager’s configuration.

**Parameters**

`payment_connector_id`
    

The ID of the payment connector to use

`payment_instrument_type`
    

Type of payment instrument (for example, EMBEDDED_CRYPTO_WALLET)

`payment_instrument_details`
    

Details of the payment instrument (for example, embeddedCryptoWallet)

`user_id`
    

Unique identifier for the user (optional, omitted for bearer auth)

`client_token`
    

An optional idempotency token

**Returns**

Dictionary containing paymentInstrumentId and other instrument details

**Raises**

`PaymentError`
    

If validation fails or API call fails

```text
response = manager.create_payment_instrument(
    user_id="user-123",
    payment_connector_id="connector-456",
    payment_instrument_type="EMBEDDED_CRYPTO_WALLET",
    payment_instrument_details={"embeddedCryptoWallet": {"network": "ETHEREUM"}}
)
instrument_id = response["paymentInstrumentId"]
```
#### create_payment_session

```text
create_payment_session(expiry_time_in_minutes: int, user_id: Optional[str] = None, limits: Optional[dict] = None, client_token: Optional[str] = None) -> Dict[str, Any]
```
Create a payment session with spending limits.

**Parameters**

`expiry_time_in_minutes`
    

Session expiry time in minutes (15-480)

`user_id`
    

Unique identifier for the user (optional, omitted for bearer auth)

`limits`
    

An optional spending limits dict with maxSpendAmount structure

`client_token`
    

An optional idempotency token

**Returns**

Dictionary containing paymentSessionId and other session details

**Raises**

`PaymentError`
    

If validation fails or API call fails

#### delete_payment_instrument

```text
delete_payment_instrument(payment_instrument_id: str, payment_connector_id: str, user_id: Optional[str] = None) -> Dict[str, Any]
```
Delete a payment instrument.

Marks a payment instrument as deleted (soft delete). The record is preserved for audit and compliance purposes but is excluded from normal list and get operations.

Deleting an already-deleted or non-existent instrument returns PaymentInstrumentNotFound.

**Parameters**

`payment_instrument_id`
    

Unique identifier for the instrument to delete

`payment_connector_id`
    

The ID of the payment connector (required)

`user_id`
    

Unique identifier for the user (optional, omitted for bearer auth)

**Returns**

Dictionary containing deletion status: \{"status": "DELETED"}

**Raises**

`PaymentInstrumentNotFound`
    

If instrument not found or already deleted

`PaymentError`
    

If API call fails

```text
result = manager.delete_payment_instrument(
    payment_instrument_id="payment-instrument-xyz789",
    payment_connector_id="connector-456",
    user_id="user-123",
)
# result: {"status": "DELETED"}
```
#### delete_payment_session

```text
delete_payment_session(payment_session_id: str, user_id: Optional[str] = None) -> Dict[str, Any]
```
Delete a payment session.

Permanently removes a payment session record (hard delete). Once deleted, the session can no longer be used for payment processing.

Deleting a non-existent or already-deleted session returns PaymentSessionNotFound.

**Parameters**

`payment_session_id`
    

Unique identifier for the session to delete

`user_id`
    

Unique identifier for the user (optional, omitted for bearer auth)

**Returns**

Dictionary containing deletion status: \{"status": "DELETED"}

**Raises**

`PaymentSessionNotFound`
    

If session not found or already deleted

`PaymentError`
    

If API call fails

```text
result = manager.delete_payment_session(
    payment_session_id="payment-session-abc123",
    user_id="user-123",
)
# result: {"status": "DELETED"}
```
#### generate_payment_header

```text
generate_payment_header(payment_instrument_id: str, payment_session_id: str, payment_required_request: Dict[str, Any], user_id: Optional[str] = None, network_preferences: Optional[list[str]] = None, client_token: Optional[str] = None, payment_connector_id: Optional[str] = None) -> Dict[str, str]
```
Generate a payment header for 402 payment required request.

This method orchestrates the complete payment header generation workflow: 1\. Validates input parameters 2\. Generates or validates client_token 3\. Retrieves payment instrument details 4\. Extracts payment requirement from 402 payment required request 5\. Selects appropriate blockchain network accept header. Here is the Selection process: 1\. Filter accepts to those matching the instrument’s blockchain type 2\. Use provided network_preferences or default to NETWORK_PREFERENCES from constants 3\. Pick the first network from preferences that matches a filtered accept 4\. If no match found, return the first filtered accept 6\. Processes the payment transaction 7\. Builds the final payment header (v1 or v2 format)

**Parameters**

`payment_instrument_id`
    

Unique identifier for the payment instrument

`payment_session_id`
    

Unique identifier for the payment session

`payment_required_request`
    

Dictionary containing 402 response with statusCode, headers, and body

`user_id`
    

Unique identifier for the user (optional, omitted for bearer auth)

`network_preferences`
    

An optional list of network identifiers in order of preference. If not provided, defaults to NETWORK_PREFERENCES from constants.

`client_token`
    

An optional unique token for idempotency. If not provided, a new one is generated.

`payment_connector_id`
    

Accepted for backward compatibility but no longer forwarded to process_payment. ProcessPayment derives the connector from the payment instrument; sending paymentConnectorId on that call was rejected by the API as an unknown parameter.

**Returns**

Dictionary with header name and value (for example, \{"X-PAYMENT": "base64…​"} or \{"PAYMENT-SIGNATURE": "base64…​"}) for X402 payment required request

**Raises**

`PaymentError`
    

For validation or processing failures

`PaymentInstrumentNotFound`
    

If instrument not found

`PaymentSessionNotFound`
    

If session not found

`PaymentSessionExpired`
    

If session has expired

`InsufficientBudget`
    

If payment amount exceeds budget

```text
header = manager.generate_payment_header(
    user_id="user-123",
    payment_instrument_id="instrument-456",
    payment_session_id="session-789",
    payment_required_request={
        "statusCode": 402,
        "headers": {"..."},
        "body": {...}
    },
    client_token="optional-token-123",
    network_preferences=["solana-mainnet", "eip155:8453"]
)
# Returns: {"X-PAYMENT": "base64..."} or {"PAYMENT-SIGNATURE": "base64..."}
```
#### get_payment_instrument

```text
get_payment_instrument(payment_instrument_id: str, user_id: Optional[str] = None, payment_connector_id: Optional[str] = None) -> Dict[str, Any]
```
Retrieve payment instrument details.

**Parameters**

`payment_instrument_id`
    

Unique identifier for the instrument

`user_id`
    

Unique identifier for the user (optional, omitted for bearer auth)

`payment_connector_id`
    

The ID of the payment connector (optional)

**Returns**

Dictionary containing instrument details

**Raises**

`PaymentInstrumentNotFound`
    

If instrument not found

`PaymentError`
    

If API call fails

#### get_payment_instrument_balance

```text
get_payment_instrument_balance(payment_connector_id: str, payment_instrument_id: str, chain: str, token: str, user_id: Optional[str] = None) -> Dict[str, Any]
```
Get the token balance for a payment instrument on a specific chain.

**Parameters**

`payment_connector_id`
    

The ID of the payment connector

`payment_instrument_id`
    

Unique identifier for the instrument

`chain`
    

Blockchain chain to query (for example, "BASE_SEPOLIA", "SOLANA_DEVNET")

`token`
    

Token to query balance for (for example, "USDC")

`user_id`
    

Unique identifier for the user (optional, omitted for bearer auth)

**Returns**

Dictionary containing paymentInstrumentId and tokenBalance

**Raises**

`PaymentInstrumentNotFound`
    

If instrument not found

`PaymentError`
    

If API call fails

#### get_payment_session

```text
get_payment_session(payment_session_id: str, user_id: Optional[str] = None) -> Dict[str, Any]
```
Retrieve payment session details.

**Parameters**

`payment_session_id`
    

Unique identifier for the session

`user_id`
    

Unique identifier for the user (optional, omitted for bearer auth)

**Returns**

Dictionary containing session details including remaining_amount and spent_amount

**Raises**

`PaymentSessionNotFound`
    

If session not found

`PaymentError`
    

If API call fails

#### list_payment_instruments

```text
list_payment_instruments(user_id: Optional[str] = None, payment_connector_id: Optional[str] = None, max_results: int = 100, next_token: Optional[str] = None) -> Dict[str, Any]
```
List payment instruments for a user.

**Parameters**

`user_id`
    

Unique identifier for the user (optional, omitted for bearer auth)

`payment_connector_id`
    

An optional ID of the payment connector to filter by

`max_results`
    

Maximum number of results to return (default 100)

`next_token`
    

Token for pagination

**Returns**

Dictionary containing list of instruments and next_token if more results exist

**Raises**

`PaymentError`
    

If API call fails

#### list_payment_sessions

```text
list_payment_sessions(user_id: Optional[str] = None, max_results: int = 100, next_token: Optional[str] = None) -> Dict[str, Any]
```
List payment sessions for a user.

**Parameters**

`user_id`
    

Unique identifier for the user (optional, omitted for bearer auth)

`max_results`
    

Maximum number of results to return (default 100)

`next_token`
    

Token for pagination

**Returns**

Dictionary containing list of sessions and next_token if more results exist

**Raises**

`PaymentError`
    

If API call fails

#### process_payment

```text
process_payment(payment_session_id: str, payment_instrument_id: str, payment_type: str, payment_input: Dict[str, Any], user_id: Optional[str] = None, client_token: Optional[str] = None, payment_connector_id: Optional[str] = None) -> Dict[str, Any]
```
Process a payment transaction.

**Parameters**

`payment_session_id`
    

Unique identifier for the payment session

`payment_instrument_id`
    

Unique identifier for the payment instrument

`payment_type`
    

Type of payment being processed (for example, CRYPTO_X402)

`payment_input`
    

Payment input details specific to the payment type

`user_id`
    

Unique identifier for the user (optional, omitted for bearer auth)

`client_token`
    

An optional idempotency token for request uniqueness

`payment_connector_id`
    

Accepted for backward compatibility but no longer forwarded to the service. ProcessPayment derives the connector from the payment instrument; sending paymentConnectorId on this call was rejected by the API as an unknown parameter.

**Returns**

Dictionary containing processPaymentId and transaction details

**Raises**

`PaymentInstrumentNotFound`
    

If payment instrument not found

`InsufficientBudget`
    

If payment amount exceeds remaining budget

`PaymentSessionExpired`
    

If payment session has expired

`InvalidPaymentInstrument`
    

If payment instrument is invalid or inactive

`PaymentError`
    

If API call fails

### PaymentManagerStatus

```text
PaymentManagerStatus(value, names=None, *, module=None, qualname=None, type=None, start=1)
```
Payment manager resource statuses.

### PaymentConnectorStatus

```text
PaymentConnectorStatus(value, names=None, *, module=None, qualname=None, type=None, start=1)
```
Payment connector statuses.

### PaymentConnectorType

```text
PaymentConnectorType(value, names=None, *, module=None, qualname=None, type=None, start=1)
```
Supported payment connector types.

### PaymentsAuthorizerType

```text
PaymentsAuthorizerType(value, names=None, *, module=None, qualname=None, type=None, start=1)
```
Payment manager authorizer types.

