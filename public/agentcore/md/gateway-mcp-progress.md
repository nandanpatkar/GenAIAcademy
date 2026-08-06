# Receive progress notifications from your AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-mcp-progress.html

---

# Receive progress notifications from your AgentCore gateway

Progress notifications allow MCP server targets to report incremental progress on long-running tool calls. When a tool call takes time to complete, the server can send `notifications/progress` events to keep the client informed about the operation’s status. AgentCore Gateway forwards these notifications from MCP server targets to your client as Server-Sent Events (SSE) chunks.

## Prerequisites

To receive progress notifications from your gateway:

  * **Response streaming enabled** — Progress notifications are delivered as SSE chunks during an open connection. Set `streamingConfiguration.enableResponseStreaming` to `true` in your gateway’s `protocolConfiguration.mcp`.

  * **MCP server target type** — Progress notifications originate from MCP server targets.

  * **Client sends the`Accept` header** — The client must send `Accept: application/json, text/event-stream` so that the gateway can return a streaming (SSE) response.


## How progress notifications work

When a client makes a `tools/call` request with a `progressToken` in the request parameters, the MCP server target can send `notifications/progress` events during execution. The gateway forwards these events to the client as SSE chunks before the final tool result.

Each progress notification includes:

  * `progressToken` — Matches the token provided in the original request.

  * `progress` — The current progress value (numeric).

  * `total` — Optional total value indicating completion target.

  * `message` — Optional human-readable description of current status.


## Code samples

###### Example

curl (2025-11-25 and earlier)
    

Call a tool with a progress token. Set the `MCP-Protocol-Version` header to a version that your gateway supports.

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
      "name": "analyzeDataset",
      "arguments": {
        "datasetId": "ds-12345"
      },
      "_meta": {
        "progressToken": "progress-1"
      }
    }
}'
```
The gateway returns an SSE stream with progress notifications followed by the final result:

```text
event: message
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{"progressToken":"progress-1","progress":1,"total":4,"message":"Loading dataset..."}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{"progressToken":"progress-1","progress":2,"total":4,"message":"Running analysis..."}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{"progressToken":"progress-1","progress":3,"total":4,"message":"Generating report..."}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{"progressToken":"progress-1","progress":4,"total":4,"message":"Complete"}}

event: message
data: {"jsonrpc":"2.0","id":"tool-call-1","result":{"content":[{"type":"text","text":"Analysis complete. Found 3 anomalies in dataset ds-12345."}]}}
```
curl (2026-07-28)
    

On version `2026-07-28`, include the `Mcp-Method` and `Mcp-Name` request-metadata headers and the `_meta` version fields in the body. Keep `progressToken` in `_meta` to opt into progress notifications. The `MCP-Protocol-Version` header must match `_meta.io.modelcontextprotocol/protocolVersion`. Your gateway’s `supportedVersions` must include `2026-07-28`.

```bash
curl -N -X POST \
  https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "MCP-Protocol-Version: 2026-07-28" \
  -H "Mcp-Method: tools/call" \
  -H "Mcp-Name: analyzeDataset" \
  -d '{
    "jsonrpc": "2.0",
    "id": "tool-call-1",
    "method": "tools/call",
    "params": {
      "name": "analyzeDataset",
      "arguments": {
        "datasetId": "ds-12345"
      },
      "_meta": {
        "io.modelcontextprotocol/protocolVersion": "2026-07-28",
        "io.modelcontextprotocol/clientInfo": {
          "name": "my-agent",
          "version": "1.0.0"
        },
        "io.modelcontextprotocol/clientCapabilities": {},
        "progressToken": "progress-1"
      }
    }
}'
```
The gateway returns an SSE stream with progress notifications followed by the final result:

```text
event: message
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{"progressToken":"progress-1","progress":1,"total":4,"message":"Loading dataset..."}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{"progressToken":"progress-1","progress":2,"total":4,"message":"Running analysis..."}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{"progressToken":"progress-1","progress":3,"total":4,"message":"Generating report..."}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{"progressToken":"progress-1","progress":4,"total":4,"message":"Complete"}}

event: message
data: {"jsonrpc":"2.0","id":"tool-call-1","result":{"content":[{"type":"text","text":"Analysis complete. Found 3 anomalies in dataset ds-12345."}]}}
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

# Call tool with progress token (streaming response)
response = requests.post(gateway_url, headers=headers, json={
    "jsonrpc": "2.0",
    "id": "tool-call-1",
    "method": "tools/call",
    "params": {
        "name": "analyzeDataset",
        "arguments": {"datasetId": "ds-12345"},
        "_meta": {"progressToken": "progress-1"}
    }
}, stream=True)

# Process SSE events
client = sseclient.SSEClient(response)
for event in client.events():
    data = json.loads(event.data)
    if data.get("method") == "notifications/progress":
        params = data["params"]
        print(f"Progress: {params['progress']}/{params.get('total', '?')} - {params.get('message', '')}")
    elif "result" in data:
        print(f"Tool result: {data['result']}")
        break
```
Python requests package (2026-07-28)
    

On version `2026-07-28`, add the `MCP-Protocol-Version`, `Mcp-Method`, and `Mcp-Name` headers, and include the `_meta` version fields in the request body. Keep `progressToken` in `_meta` to opt into progress notifications. Your gateway’s `supportedVersions` must include `2026-07-28`.

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
    "Mcp-Name": "analyzeDataset"
}

# Call tool with progress token (streaming response)
response = requests.post(gateway_url, headers=headers, json={
    "jsonrpc": "2.0",
    "id": "tool-call-1",
    "method": "tools/call",
    "params": {
        "name": "analyzeDataset",
        "arguments": {"datasetId": "ds-12345"},
        "_meta": {
            "io.modelcontextprotocol/protocolVersion": "2026-07-28",
            "io.modelcontextprotocol/clientInfo": {"name": "my-agent", "version": "1.0.0"},
            "io.modelcontextprotocol/clientCapabilities": {},
            "progressToken": "progress-1"
        }
    }
}, stream=True)

# Process SSE events
client = sseclient.SSEClient(response)
for event in client.events():
    data = json.loads(event.data)
    if data.get("method") == "notifications/progress":
        params = data["params"]
        print(f"Progress: {params['progress']}/{params.get('total', '?')} - {params.get('message', '')}")
    elif "result" in data:
        print(f"Tool result: {data['result']}")
        break
```
MCP Client
     ```python
     from mcp import ClientSession
     from mcp.client.streamable_http import streamablehttp_client
     import asyncio

     async def progress_handler(progress_token, progress, total, message=None):
         """Handle progress notifications."""
         print(f"[{progress}/{total}] {message or ''}")

     async def use_progress(url, token):
         headers = {"Authorization": f"Bearer {token}"}

         async with streamablehttp_client(url=url, headers=headers) as (
             read_stream, write_stream, _
         ):
             async with ClientSession(
                 read_stream, write_stream,
                 progress_handler=progress_handler
             ) as session:
                 await session.initialize()

                 # Call tool with progress token - notifications handled by callback
                 result = await session.call_tool(
                     name="analyzeDataset",
                     arguments={"datasetId": "ds-12345"}
                 )
                 print(f"Tool result: {result}")
                 return result

     asyncio.run(use_progress(
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

     # Strands handles streaming and progress notifications automatically
     with mcp_client:
         agent = Agent(tools=mcp_client.list_tools_sync())
         response = agent("Analyze dataset ds-12345")
         print(response)
     ```
