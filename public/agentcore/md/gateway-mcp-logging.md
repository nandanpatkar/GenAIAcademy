# Receive logging messages from your AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-mcp-logging.html

---

# Receive logging messages from your AgentCore gateway

MCP server targets can send log messages to clients during tool execution using the `notifications/message` method. These messages provide real-time visibility into what the server is doing, useful for debugging, auditing, and monitoring tool behavior. AgentCore Gateway forwards these log notifications from MCP server targets to your client as Server-Sent Events (SSE) chunks.

## Prerequisites

To receive logging messages from your gateway:

  * **Response streaming enabled** — Log messages are delivered as SSE chunks during an open connection. Set `streamingConfiguration.enableResponseStreaming` to `true` in your gateway’s `protocolConfiguration.mcp`.

  * **MCP server target type** — Log messages originate from MCP server targets.

  * **Client sends the`Accept` header** — The client must send `Accept: application/json, text/event-stream` so that the gateway can return a streaming (SSE) response.


## Log levels

MCP defines the following log levels, in order of increasing severity:

Level | Description  
---|---  
`debug` |  Detailed diagnostic information for troubleshooting.  
`info` |  General informational messages about normal operation.  
`notice` |  Normal but significant events.  
`warning` |  Potentially harmful situations that don’t prevent operation.  
`error` |  Error conditions that prevented a specific operation.  
`critical` |  Critical conditions requiring immediate attention.  
`alert` |  Action must be taken immediately.  
`emergency` |  System is unusable.  
  
## How logging messages work

When an MCP server target emits a `notifications/message` during tool execution, the gateway forwards it to the client as an SSE event. Each log message includes:

  * `level` — The severity level of the message.

  * `logger` — Optional name identifying the source component.

  * `data` — The log content (string or structured object).


Log messages are informational and do not require a response from the client. They are delivered alongside other SSE events such as progress notifications and the final tool result.

## Code samples

###### Example

curl (2025-11-25 and earlier)
    

Call a tool and receive log messages in the SSE stream. Set the `MCP-Protocol-Version` header to a version that your gateway supports.

```bash
curl -N -X POST \
  https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "MCP-Protocol-Version: 2025-11-25" \
  -d '{
    "jsonrpc": "2.0",
    "id": "tool-call-1",
    "method": "tools/call",
    "params": {
      "name": "deployService",
      "arguments": {
        "serviceName": "my-api",
        "environment": "staging"
      }
    }
}'
```
The gateway returns an SSE stream with log messages followed by the final result:

```text
event: message
data: {"jsonrpc":"2.0","method":"notifications/message","params":{"level":"info","logger":"deploy-service","data":"Starting deployment of my-api to staging"}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/message","params":{"level":"info","logger":"deploy-service","data":"Building container image..."}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/message","params":{"level":"warning","logger":"deploy-service","data":"Deprecated configuration detected in service manifest"}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/message","params":{"level":"info","logger":"deploy-service","data":"Deployment complete"}}

event: message
data: {"jsonrpc":"2.0","id":"tool-call-1","result":{"content":[{"type":"text","text":"Successfully deployed my-api to staging environment."}]}}
```
curl (2026-07-28)
    

On version `2026-07-28`, the client opts into log messages for each request by setting `io.modelcontextprotocol/logLevel` in `_meta` (the `logging/setLevel` operation is retired in this version). The server sends `notifications/message` only at or above the requested level. Also include the `Mcp-Method` and `Mcp-Name` request-metadata headers and the `_meta` version fields. The `MCP-Protocol-Version` header must match `_meta.io.modelcontextprotocol/protocolVersion`. Your gateway’s `supportedVersions` must include `2026-07-28`.

```bash
curl -N -X POST \
  https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "MCP-Protocol-Version: 2026-07-28" \
  -H "Mcp-Method: tools/call" \
  -H "Mcp-Name: deployService" \
  -d '{
    "jsonrpc": "2.0",
    "id": "tool-call-1",
    "method": "tools/call",
    "params": {
      "name": "deployService",
      "arguments": {
        "serviceName": "my-api",
        "environment": "staging"
      },
      "_meta": {
        "io.modelcontextprotocol/protocolVersion": "2026-07-28",
        "io.modelcontextprotocol/clientInfo": {
          "name": "my-agent",
          "version": "1.0.0"
        },
        "io.modelcontextprotocol/clientCapabilities": {},
        "io.modelcontextprotocol/logLevel": "info"
      }
    }
}'
```
The gateway returns an SSE stream with log messages followed by the final result:

```text
event: message
data: {"jsonrpc":"2.0","method":"notifications/message","params":{"level":"info","logger":"deploy-service","data":"Starting deployment of my-api to staging"}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/message","params":{"level":"info","logger":"deploy-service","data":"Building container image..."}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/message","params":{"level":"warning","logger":"deploy-service","data":"Deprecated configuration detected in service manifest"}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/message","params":{"level":"info","logger":"deploy-service","data":"Deployment complete"}}

event: message
data: {"jsonrpc":"2.0","id":"tool-call-1","result":{"content":[{"type":"text","text":"Successfully deployed my-api to staging environment."}]}}
```
Python requests package (2025-11-25 and earlier)
    

Set the `MCP-Protocol-Version` header to a version that your gateway supports.

```python
import requests
import json
import sseclient

gateway_url = "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp"
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream",
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "MCP-Protocol-Version": "2025-11-25"
}

# Call tool (streaming response)
response = requests.post(gateway_url, headers=headers, json={
    "jsonrpc": "2.0",
    "id": "tool-call-1",
    "method": "tools/call",
    "params": {
        "name": "deployService",
        "arguments": {"serviceName": "my-api", "environment": "staging"}
    }
}, stream=True)

# Process SSE events
client = sseclient.SSEClient(response)
for event in client.events():
    data = json.loads(event.data)
    if data.get("method") == "notifications/message":
        params = data["params"]
        print(f"[{params['level'].upper()}] {params.get('logger', '')}: {params['data']}")
    elif "result" in data:
        print(f"Tool result: {data['result']}")
        break
```
Python requests package (2026-07-28)
    

On version `2026-07-28`, opt into log messages by setting `io.modelcontextprotocol/logLevel` in `_meta` (the `logging/setLevel` operation is retired in this version). Also add the `MCP-Protocol-Version`, `Mcp-Method`, and `Mcp-Name` headers and the `_meta` version fields. Your gateway’s `supportedVersions` must include `2026-07-28`.

```python
import requests
import json
import sseclient

gateway_url = "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp"
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream",
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "MCP-Protocol-Version": "2026-07-28",
    "Mcp-Method": "tools/call",
    "Mcp-Name": "deployService"
}

# Call tool (streaming response)
response = requests.post(gateway_url, headers=headers, json={
    "jsonrpc": "2.0",
    "id": "tool-call-1",
    "method": "tools/call",
    "params": {
        "name": "deployService",
        "arguments": {"serviceName": "my-api", "environment": "staging"},
        "_meta": {
            "io.modelcontextprotocol/protocolVersion": "2026-07-28",
            "io.modelcontextprotocol/clientInfo": {"name": "my-agent", "version": "1.0.0"},
            "io.modelcontextprotocol/clientCapabilities": {},
            "io.modelcontextprotocol/logLevel": "info"
        }
    }
}, stream=True)

# Process SSE events
client = sseclient.SSEClient(response)
for event in client.events():
    data = json.loads(event.data)
    if data.get("method") == "notifications/message":
        params = data["params"]
        print(f"[{params['level'].upper()}] {params.get('logger', '')}: {params['data']}")
    elif "result" in data:
        print(f"Tool result: {data['result']}")
        break
```
MCP Client
     ```python
     from mcp import ClientSession
     from mcp.client.streamable_http import streamablehttp_client
     import asyncio

     async def log_handler(level, logger, data):
         """Handle log messages from the server."""
         print(f"[{level.upper()}] {logger or 'server'}: {data}")

     async def use_logging(url, token):
         headers = {"Authorization": f"Bearer {token}"}

         async with streamablehttp_client(url=url, headers=headers) as (
             read_stream, write_stream, _
         ):
             async with ClientSession(
                 read_stream, write_stream,
                 logging_handler=log_handler
             ) as session:
                 await session.initialize()

                 # Call tool - log messages handled by callback
                 result = await session.call_tool(
                     name="deployService",
                     arguments={"serviceName": "my-api", "environment": "staging"}
                 )
                 print(f"Tool result: {result}")
                 return result

     asyncio.run(use_logging(
         url="https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp",
         token="YOUR_ACCESS_TOKEN"
     ))
     ```
Strands MCP Client
     ```python
     from mcp.client.streamable_http import streamablehttp_client
     from strands import Agent
     from strands.tools.mcp import MCPClient

     mcp_url = "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp"
     access_token = "YOUR_ACCESS_TOKEN"

     mcp_client = MCPClient(
         lambda: streamablehttp_client(
             mcp_url, headers={"Authorization": f"Bearer {access_token}"}
         )
     )

     # Strands handles streaming and log messages automatically
     with mcp_client:
         agent = Agent(tools=mcp_client.list_tools_sync())
         response = agent("Deploy my-api to staging")
         print(response)
     ```
