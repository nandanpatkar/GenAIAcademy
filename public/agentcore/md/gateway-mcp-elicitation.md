# Use elicitation with your AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-mcp-elicitation.html

---

# Use elicitation with your AgentCore gateway

Elicitation is an MCP feature that allows an MCP server to request additional information from the client during a tool call. When a tool needs user confirmation, authentication, or additional input to proceed, the server sends an elicitation request back to the client. AgentCore Gateway forwards elicitation requests from MCP server targets to your clients, replacing the request `id` with a gateway-generated identifier.

## Prerequisites

To use elicitation with your gateway, you must have:

  * **Sessions enabled (version 2025-11-25 and earlier)** — Elicitation requires session support. See [Use MCP sessions with your gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-sessions.html>). For version `2026-07-28` and later, you do not need to add `sessionConfiguration` to your gateway, because these versions are stateless.

  * **Response streaming enabled (version 2025-11-25 and earlier)** — Elicitation requests are sent as Server-Sent Events (SSE) chunks during an open connection. Set `streamingConfiguration.enableResponseStreaming` to `true` in your gateway’s `protocolConfiguration.mcp`. For version `2026-07-28` and later, you do not need to enable response streaming. These versions deliver elicitation through the multi round-trip requests (MRTR) pattern instead of a server-initiated request on the response stream. For more information, see [Multi round-trip requests](<https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr>) in the Model Context Protocol documentation.

  * **MCP server target type** — Elicitation is only supported for MCP server targets. The elicitation originates from the MCP server and is forwarded through the gateway to the client.

  * **Client declares elicitation capability** — The client must declare support for elicitation for the gateway to forward elicitation requests. For version `2025-11-25` and earlier, the client declares this support in the `initialize` request. For version `2026-07-28` and later, the client declares capabilities for each request in the `_meta` field (`io.modelcontextprotocol/clientCapabilities`).


## Supported elicitation modes

AgentCore Gateway supports three elicitation modes defined by the MCP specification:

Mode | Description  
---|---  
**Form mode** |  The server sends a structured form with fields for the client to fill out. Used for collecting user confirmations, preferences, or input data. The request remains open while waiting for the response.  
**URL mode (request-based)** |  The server sends a URL that the user must visit to complete an action (typically authentication). The request remains open while waiting for the action to complete.  
**URL mode (exception-based)** |  The server throws a `URLElicitationRequiredError` containing a URL. The request closes, the user completes the action at the URL, and the client retries the original tool call.  
  
## Capability negotiation

The gateway only declares elicitation support to an MCP server target if:

  1. The **client** declared elicitation support. For version `2025-11-25` and earlier, the client declares this during `initialize`. For version `2026-07-28` and later, the client declares it for each request in `_meta`.

  2. The **MCP protocol version** supports the elicitation mode. `form` mode requires version `2025-03-26` or later. `url` modes require version `2025-11-25` or later.

  3. The gateway matches the specific elicitation capabilities declared by the client (form, url, or both).


## Form mode elicitation flow

###### Note

The flow described here applies to version `2025-11-25` and earlier, where the server sends `elicitation/create` as a server-initiated request on the open SSE stream. For version `2026-07-28` and later, elicitation instead uses the multi round-trip requests (MRTR) pattern. The server returns an interim result, and the client retries the original request with the collected input. For more information, see [Multi round-trip requests](<https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr>) in the Model Context Protocol documentation.

  1. Client sends a `tools/call` request with the `Mcp-Session-Id` header.

  2. Gateway forwards the tool call to the MCP server target.

  3. The target opens an SSE stream and sends an `elicitation/create` request as the first event.

  4. Gateway forwards the `elicitation/create` request to the client on the SSE stream, replacing the request `id`.

  5. The client presents the form to the user and collects the response.

  6. The client sends a new request with the elicitation response (action: `accept` or `decline`) using the same `Mcp-Session-Id`.

  7. Gateway forwards the response to the MCP server target.

  8. The target acknowledges with HTTP 202 Accepted.

  9. The target completes the tool call and sends the final result on the original SSE stream.

  10. Gateway forwards the final result to the client and closes the stream.


## URL mode (exception-based) elicitation flow

  1. Client sends a `tools/call` request with the `Mcp-Session-Id` header.

  2. Gateway forwards the tool call to the MCP server target.

  3. The target throws a `URLElicitationRequiredError` as a JSON-RPC error, containing the URL and an elicitation ID.

  4. Gateway forwards the `URLElicitationRequiredError` to the client, replacing the request `id`.

  5. The client redirects the user to the provided URL to complete the action (typically OAuth authentication).

  6. After the user completes the action, the client retries the original `tools/call` request.

  7. Gateway forwards the retry to the target. The target completes the tool call since the URL elicitation was fulfilled.

  8. Gateway forwards the final tool result to the client.


## Parallel tool calls with elicitations

A client can initiate multiple `tools/call` requests within the same session, even while an elicitation is pending. Each elicitation is tracked independently by its `id`. When sending an elicitation response, the client must include the same `id` that was sent by the gateway in the `elicitation/create` request.

## Guidance for MCP server target developers

###### Important

MCP server targets that send elicitation requests **should** wrap elicitation calls in try-catch blocks and handle the case where the client does not support elicitation. If the gateway’s client did not declare elicitation capability, the gateway does not declare it to the target. If the target sends an elicitation anyway, the gateway returns a `-32601` (Method not found) error to the target.

Servers should implement a fallback path (such as using default values or skipping the operation) when elicitation is not available.

## Error handling

Scenario | Error | Description  
---|---|---  
Client sends an elicitation response when no elicitation is pending |  JSON-RPC `-32600` (Invalid Request) |  No matching elicitation found for this session.  
Client sends elicitation response with an `id` that doesn’t match a pending elicitation |  JSON-RPC `-32600` (Invalid Request) |  The `id` must match the one sent by the gateway in the `elicitation/create` request.  
Connection breaks between gateway and MCP server target |  JSON-RPC error with DependencyFailedException |  Client should retry the original tool call request.  
Connection breaks between client and gateway |  N/A |  The pending elicitation is cleaned up. Client should retry the tool call.  
MCP server sends elicitation but gateway did not declare support |  JSON-RPC `-32601` (Method not found) |  Returned to the MCP server target. See Troubleshooting.  
Gateway-authored elicitation requires a capability the client did not declare (version `2026-07-28` and later) |  JSON-RPC `-32021` (Missing required client capability), HTTP `400` |  On version `2026-07-28` and later, the gateway returns this code instead of `-32601`. This happens when the client did not declare the required capability in its request `_meta`.  
  
## Troubleshooting

**Error: "Error calling tool 'sample_tool': Method not found: elicitation/create"**

This error occurs when an MCP server target sends an elicitation request but the gateway’s client did not declare elicitation capability. For version `2025-11-25` and earlier, the client declares this capability during `initialize`. For version `2026-07-28` and later, the client declares it for each request in the `_meta` field. The gateway returns a `-32601` (Method not found) error to the target. The target might return this as a tool execution error to the client.

To resolve:

  * **If you are the MCP server developer** : Add error handling around your elicitation calls. Implement a fallback path when elicitation is not supported:

```text
try:
    result = await context.session.create_elicitation(
        message="Confirm this action?",
        requested_schema={"type": "object", "properties": {"confirm": {"type": "boolean"}}}
    )
except Exception as e:
    # Fallback when client doesn't support elicitation
    logger.warning(f"Elicitation not supported: {e}")
    result = default_action()
```
  * **If you are the gateway client developer** : For version `2025-11-25` and earlier, ensure your client declares elicitation capability during `initialize`:

```json
{
  "capabilities": {
    "elicitation": {
      "form": {},
      "url": {}
    }
  }
}
```
**Error: "Missing required client capability" (`-32021`)**

On version `2026-07-28` and later, the gateway returns a `-32021` error (HTTP `400`) when a gateway-authored elicitation requires an undeclared capability. Because these versions are stateless and have no `initialize` handshake, the client declares capabilities in each request. To resolve this error, include the elicitation capability in the request’s `_meta` field (`io.modelcontextprotocol/clientCapabilities`) on every request that might trigger an elicitation.

## Code samples

### Form mode example

In form mode, the server sends a structured schema for the client to fill out. The request remains open while waiting for the response.

###### Example

Python requests package (2025-11-25 and earlier)
    

On these versions, the client declares the elicitation capability during `initialize`, and the elicitation arrives as an `elicitation/create` request on the open SSE stream. Set the `MCP-Protocol-Version` header to a version that your gateway supports.

```python
import requests
import json
import sseclient

gateway_url = "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp"
headers = {
    "Content-Type": "application/json",
    "Accept": "text/event-stream",
    "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}

# Step 1: Initialize with elicitation capability
init_response = requests.post(gateway_url, headers=headers, json={
    "jsonrpc": "2.0",
    "id": "init-request",
    "method": "initialize",
    "params": {
        "protocolVersion": "2025-06-18",
        "capabilities": {"elicitation": {"form": {}, "url": {}}},
        "clientInfo": {"name": "my-agent", "version": "1.0.0"}
    }
})
session_id = init_response.headers["Mcp-Session-Id"]
headers["Mcp-Session-Id"] = session_id
headers["MCP-Protocol-Version"] = "2025-06-18"

# Step 2: Call tool (streaming response)
response = requests.post(gateway_url, headers=headers, json={
    "jsonrpc": "2.0",
    "id": "tool-call-1",
    "method": "tools/call",
    "params": {
        "name": "use_aws",
        "arguments": {"command": "aws s3 rm s3://my-bucket/important-file"}
    }
}, stream=True)

# Step 3: Process SSE events
client = sseclient.SSEClient(response)
for event in client.events():
    data = json.loads(event.data)
    if data.get("method") == "elicitation/create":
        elicitation_id = data["id"]
        print(f"Form elicitation received: {data['params']['message']}")

        # Step 4: Send elicitation response
        requests.post(gateway_url, headers=headers, json={
            "jsonrpc": "2.0",
            "id": elicitation_id,
            "result": {"action": "accept", "content": {"confirm": True}}
        })
    elif "result" in data:
        print(f"Tool result: {data['result']}")
        break
```
Python requests package (2026-07-28)
    

On version `2026-07-28`, elicitation uses the multi round-trip requests pattern instead of a server-initiated request on the SSE stream. The client declares the elicitation capability in `_meta` on each request. If the tool needs input, the response is an `input_required` result containing `inputRequests` and an opaque `requestState`. The client gathers the input and retries the original request with a new `id`, the `inputResponses`, and the unmodified `requestState`. Sessions and the `initialize` handshake are not used. Your gateway’s `supportedVersions` must include `2026-07-28`.

```python
import requests

gateway_url = "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp"

META = {
    "io.modelcontextprotocol/protocolVersion": "2026-07-28",
    "io.modelcontextprotocol/clientInfo": {"name": "my-agent", "version": "1.0.0"},
    "io.modelcontextprotocol/clientCapabilities": {"elicitation": {"form": {}, "url": {}}}
}
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream",
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "MCP-Protocol-Version": "2026-07-28",
    "Mcp-Method": "tools/call",
    "Mcp-Name": "use_aws"
}
arguments = {"command": "aws s3 rm s3://my-bucket/important-file"}

# Step 1: Call the tool, declaring the elicitation capability in _meta
response = requests.post(gateway_url, headers=headers, json={
    "jsonrpc": "2.0",
    "id": "tool-call-1",
    "method": "tools/call",
    "params": {"name": "use_aws", "arguments": arguments, "_meta": META}
}).json()

result = response["result"]
if result.get("resultType") == "input_required":
    # Step 2: Fulfill each input request (form elicitation)
    input_responses = {}
    for key, input_request in result.get("inputRequests", {}).items():
        print(f"Form elicitation received: {input_request['params']['message']}")
        input_responses[key] = {"action": "accept", "content": {"confirm": True}}

    # Step 3: Retry the tool call with a new id, the input responses,
    # and the requestState echoed back unmodified
    retry_params = {"name": "use_aws", "arguments": arguments, "_meta": META,
                    "inputResponses": input_responses}
    if "requestState" in result:
        retry_params["requestState"] = result["requestState"]
    response = requests.post(gateway_url, headers=headers, json={
        "jsonrpc": "2.0",
        "id": "tool-call-2",
        "method": "tools/call",
        "params": retry_params
    }).json()
    result = response["result"]

print(f"Tool result: {result}")
```
MCP Client
     ```python
     from mcp import ClientSession
     from mcp.client.streamable_http import streamablehttp_client
     import asyncio

     async def elicitation_handler(request):
         """Handle form elicitation requests from the server."""
         print(f"Elicitation: {request.params.message}")
         return {"action": "accept", "content": {"confirm": True}}

     async def use_elicitation(url, token):
         headers = {"Authorization": f"Bearer {token}"}

         async with streamablehttp_client(url=url, headers=headers) as (
             read_stream, write_stream, _
         ):
             async with ClientSession(
                 read_stream, write_stream,
                 elicitation_handler=elicitation_handler
             ) as session:
                 await session.initialize()
                 result = await session.call_tool(
                     name="use_aws",
                     arguments={"command": "aws s3 rm s3://my-bucket/important-file"}
                 )
                 print(f"Tool result: {result}")
                 return result

     asyncio.run(use_elicitation(
         url="https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp",
         token="YOUR_ACCESS_TOKEN"
     ))
     ```
Strands MCP Client
     ```python
     from mcp.client.streamable_http import streamablehttp_client
     from mcp.types import ElicitResult
     from strands import Agent
     from strands.tools.mcp import MCPClient

     mcp_url = "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp"
     access_token = "YOUR_ACCESS_TOKEN"

     async def elicitation_callback(context, params):
         """Handle form elicitation requests from the MCP server target."""
         print(f"Elicitation: {params.message}")
         user_response = get_user_input(params)  # Your UI logic
         return ElicitResult(action="accept", content=user_response)

     mcp_client = MCPClient(
         lambda: streamablehttp_client(
             mcp_url, headers={"Authorization": f"Bearer {access_token}"}
         ),
         elicitation_callback=elicitation_callback,
     )

     with mcp_client:
         agent = Agent(tools=mcp_client.list_tools_sync())
         response = agent("Delete the file s3://my-bucket/important-file using AWS CLI")
         print(response)
     ```
LangGraph MCP Client
     ```python
     from langchain_mcp_adapters.client import MultiServerMCPClient
     from langchain_mcp_adapters.callbacks import Callbacks, CallbackContext
     from langchain.agents import create_agent
     from mcp.shared.context import RequestContext
     from mcp.types import ElicitRequestParams, ElicitResult

     async def on_elicitation(
         mcp_context: RequestContext,
         params: ElicitRequestParams,
         context: CallbackContext,
     ) -> ElicitResult:
         """Handle elicitation requests from MCP servers."""
         print(f"[{context.server_name}] Elicitation: {params.message}")
         # Prompt user for input based on params.requestedSchema
         return ElicitResult(
             action="accept",
             content={"confirm": True},
         )

     client = MultiServerMCPClient(
         {
             "gateway": {
                 "url": "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp",
                 "transport": "http",
                 "headers": {"Authorization": "Bearer YOUR_ACCESS_TOKEN"},
             }
         },
         callbacks=Callbacks(on_elicitation=on_elicitation),
     )

     tools = await client.get_tools()
     agent = create_agent("claude-sonnet-4-20250514", tools)

     result = await agent.ainvoke(
         {"messages": [{"role": "user", "content": "Delete s3://my-bucket/important-file"}]}
     )
     ```
### URL mode example

In URL mode, the server sends a URL that the user must visit to complete an action (typically OAuth authentication). The request remains open while waiting for the user to complete the action at the URL.

###### Example

Python requests package (2025-11-25 and earlier)
    

On these versions, the URL elicitation arrives as an `elicitation/create` request on the open SSE stream within an MCP session. Set the `MCP-Protocol-Version` header to a version that your gateway supports.

```python
import requests
import json
import sseclient
import webbrowser

gateway_url = "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp"
headers = {
    "Content-Type": "application/json",
    "Accept": "text/event-stream",
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "MCP-Protocol-Version": "2025-11-25",
    "Mcp-Session-Id": "session-abc123def456"
}

# Call tool that triggers URL elicitation
response = requests.post(gateway_url, headers=headers, json={
    "jsonrpc": "2.0",
    "id": "tool-call-2",
    "method": "tools/call",
    "params": {
        "name": "access_github_repo",
        "arguments": {"repo": "my-org/my-repo"}
    }
}, stream=True)

# Process SSE events
client = sseclient.SSEClient(response)
for event in client.events():
    data = json.loads(event.data)
    if data.get("method") == "elicitation/create":
        elicitation_id = data["id"]
        url = data["params"]["url"]
        print(f"URL elicitation: {data['params']['message']}")

        # Open browser for user to complete authentication
        webbrowser.open(url)
        input("Press Enter after completing authentication...")

        # Send elicitation response
        requests.post(gateway_url, headers=headers, json={
            "jsonrpc": "2.0",
            "id": elicitation_id,
            "result": {"action": "accept"}
        })
    elif "result" in data:
        print(f"Tool result: {data['result']}")
        break
```
Python requests package (2026-07-28)
    

On version `2026-07-28`, the URL elicitation arrives as an `input_required` result through the multi round-trip requests pattern instead of on the SSE stream. The user completes the action at the URL, then the client retries the original request with a new `id`, the `inputResponses`, and the unmodified `requestState`. Sessions are not used. Your gateway’s `supportedVersions` must include `2026-07-28`.

```python
import requests
import webbrowser

gateway_url = "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp"

META = {
    "io.modelcontextprotocol/protocolVersion": "2026-07-28",
    "io.modelcontextprotocol/clientInfo": {"name": "my-agent", "version": "1.0.0"},
    "io.modelcontextprotocol/clientCapabilities": {"elicitation": {"form": {}, "url": {}}}
}
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream",
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "MCP-Protocol-Version": "2026-07-28",
    "Mcp-Method": "tools/call",
    "Mcp-Name": "access_github_repo"
}
arguments = {"repo": "my-org/my-repo"}

# Step 1: Call the tool, declaring the elicitation capability in _meta
response = requests.post(gateway_url, headers=headers, json={
    "jsonrpc": "2.0",
    "id": "tool-call-1",
    "method": "tools/call",
    "params": {"name": "access_github_repo", "arguments": arguments, "_meta": META}
}).json()

result = response["result"]
if result.get("resultType") == "input_required":
    # Step 2: Open the browser for the user to complete each URL elicitation
    input_responses = {}
    for key, input_request in result.get("inputRequests", {}).items():
        params = input_request["params"]
        print(f"URL elicitation: {params['message']}")
        webbrowser.open(params["url"])
        input("Press Enter after completing authentication...")
        input_responses[key] = {"action": "accept"}

    # Step 3: Retry the tool call with a new id, the input responses,
    # and the requestState echoed back unmodified
    retry_params = {"name": "access_github_repo", "arguments": arguments, "_meta": META,
                    "inputResponses": input_responses}
    if "requestState" in result:
        retry_params["requestState"] = result["requestState"]
    response = requests.post(gateway_url, headers=headers, json={
        "jsonrpc": "2.0",
        "id": "tool-call-2",
        "method": "tools/call",
        "params": retry_params
    }).json()
    result = response["result"]

print(f"Tool result: {result}")
```
MCP Client
     ```python
     from mcp import ClientSession
     from mcp.client.streamable_http import streamablehttp_client
     import asyncio
     import webbrowser

     async def elicitation_handler(request):
         """Handle URL elicitation by opening the browser."""
         if hasattr(request.params, 'url') and request.params.url:
             print(f"Opening URL for authentication: {request.params.url}")
             webbrowser.open(request.params.url)
             input("Press Enter after completing authentication...")
             return {"action": "accept"}
         # Form mode fallback
         return {"action": "accept", "content": {}}

     async def use_url_elicitation(url, token):
         headers = {"Authorization": f"Bearer {token}"}

         async with streamablehttp_client(url=url, headers=headers) as (
             read_stream, write_stream, _
         ):
             async with ClientSession(
                 read_stream, write_stream,
                 elicitation_handler=elicitation_handler
             ) as session:
                 await session.initialize()
                 result = await session.call_tool(
                     name="access_github_repo",
                     arguments={"repo": "my-org/my-repo"}
                 )
                 print(f"Tool result: {result}")
                 return result

     asyncio.run(use_url_elicitation(
         url="https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp",
         token="YOUR_ACCESS_TOKEN"
     ))
     ```
Strands MCP Client
     ```python
     from mcp.client.streamable_http import streamablehttp_client
     from mcp.types import ElicitResult
     from strands import Agent
     from strands.tools.mcp import MCPClient
     import webbrowser

     mcp_url = "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp"
     access_token = "YOUR_ACCESS_TOKEN"

     async def elicitation_callback(context, params):
         """Handle URL elicitation by opening the browser."""
         if hasattr(params, 'url') and params.url:
             print(f"Opening URL: {params.url}")
             webbrowser.open(params.url)
             input("Press Enter after completing authentication...")
             return ElicitResult(action="accept")
         return ElicitResult(action="accept", content={})

     mcp_client = MCPClient(
         lambda: streamablehttp_client(
             mcp_url, headers={"Authorization": f"Bearer {access_token}"}
         ),
         elicitation_callback=elicitation_callback,
     )

     with mcp_client:
         agent = Agent(tools=mcp_client.list_tools_sync())
         response = agent("Access the my-org/my-repo GitHub repository")
         print(response)
     ```
LangGraph MCP Client
     ```python
     from langchain_mcp_adapters.client import MultiServerMCPClient
     from langchain_mcp_adapters.callbacks import Callbacks, CallbackContext
     from langchain.agents import create_agent
     from mcp.shared.context import RequestContext
     from mcp.types import ElicitRequestParams, ElicitResult
     import webbrowser

     async def on_elicitation(
         mcp_context: RequestContext,
         params: ElicitRequestParams,
         context: CallbackContext,
     ) -> ElicitResult:
         """Handle URL elicitation by opening the browser."""
         if params.url:
             print(f"[{context.server_name}] Opening URL: {params.url}")
             webbrowser.open(params.url)
             input("Press Enter after completing authentication...")
             return ElicitResult(action="accept")
         return ElicitResult(action="accept", content={})

     client = MultiServerMCPClient(
         {
             "gateway": {
                 "url": "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp",
                 "transport": "http",
                 "headers": {"Authorization": "Bearer YOUR_ACCESS_TOKEN"},
             }
         },
         callbacks=Callbacks(on_elicitation=on_elicitation),
     )

     tools = await client.get_tools()
     agent = create_agent("claude-sonnet-4-20250514", tools)

     result = await agent.ainvoke(
         {"messages": [{"role": "user", "content": "Access the my-org/my-repo GitHub repository"}]}
     )
     ```
