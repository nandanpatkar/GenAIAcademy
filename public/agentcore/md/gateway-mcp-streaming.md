# Enable MCP response streaming for your AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-mcp-streaming.html

---

# Enable MCP response streaming for your AgentCore gateway

MCP response streaming enables your AgentCore gateway to deliver real-time Server-Sent Events (SSE) to clients during tool execution. Instead of waiting for the entire tool call to complete before returning a response, the gateway streams events as they occur — including progress notifications, log messages, elicitation requests, and sampling requests.

## Benefits of response streaming

**Real-time feedback**
    

Clients receive progress updates and log messages as they happen, rather than waiting for the full tool response.

**Enables interactive MCP features**
    

Response streaming is a prerequisite for [elicitation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-elicitation.html>), [sampling](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-sampling.html>), [progress notifications](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-progress.html>), and [logging messages](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-logging.html>). These features require an open SSE connection to deliver server-initiated events during tool execution.

**Better user experience for long-running tools**
    

For tools that take seconds or minutes to complete, streaming keeps the client informed and responsive.

## Enable response streaming

To enable response streaming, set `streamingConfiguration.enableResponseStreaming` to `true` in the `protocolConfiguration.mcp` field when creating or updating your gateway:

```json
{
  "protocolConfiguration": {
    "mcp": {
      "streamingConfiguration": {
        "enableResponseStreaming": true
      }
    }
  }
}
```
###### Note

Enabling response streaming introduces a change to the response interceptor input contract. If you use response interceptors, review your interceptor logic to ensure compatibility with streaming responses. See [Response interceptors with streaming enabled](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-interceptors-types.html#gateway-interceptors-types-streaming>) for details.

## How response streaming works

When response streaming is enabled and the client sends a request with `Accept: text/event-stream`, the gateway returns an SSE stream instead of a single JSON response. Events are delivered as they are received from the MCP server target.

The SSE stream can include the following event types:

Event type | Description  
---|---  
`notifications/progress` |  Progress updates from the target during tool execution. See [Receive progress notifications](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-progress.html>).  
`notifications/message` |  Log messages from the target. See [Receive logging messages](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-logging.html>).  
`elicitation/create` |  Elicitation requests from the target asking for user input. See [Use elicitation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-elicitation.html>).  
`sampling/createMessage` |  Sampling requests from the target asking for an LLM completion. See [Use sampling](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-sampling.html>).  
Final result |  The tool call result, delivered as the last event before the stream closes.  
  
If the client does not send `Accept: text/event-stream`, the gateway buffers the response and returns a single JSON response after the tool call completes. Intermediate events (progress, logging) are not delivered in this case.

## Client requirements

To receive streaming responses, clients must:

  * Send the `Accept: text/event-stream` header in their requests.

  * Handle SSE events as they arrive, parsing each `data:` line as a JSON-RPC message.

  * Keep the connection open until the final result event is received.


## Code samples

###### Example

curl
    

  1. Send a tool call request with SSE accept header:

```bash
curl -N -X POST \
  https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "id": "tool-call-1",
    "method": "tools/call",
    "params": {
      "name": "analyzeDataset",
      "arguments": {
        "datasetId": "ds-12345"
      }
    }
}'
```
Example SSE stream response:

```text
event: message
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{"progressToken":"auto-1","progress":1,"total":3,"message":"Loading data..."}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/message","params":{"level":"info","logger":"analyzer","data":"Processing 10,000 records"}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{"progressToken":"auto-1","progress":2,"total":3,"message":"Analyzing..."}}

event: message
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{"progressToken":"auto-1","progress":3,"total":3,"message":"Complete"}}

event: message
data: {"jsonrpc":"2.0","id":"tool-call-1","result":{"content":[{"type":"text","text":"Analysis complete. Found 3 anomalies."}]}}
```
Python requests package
    

  1. 
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

response = requests.post(gateway_url, headers=headers, json={
    "jsonrpc": "2.0",
    "id": "tool-call-1",
    "method": "tools/call",
    "params": {
        "name": "analyzeDataset",
        "arguments": {"datasetId": "ds-12345"}
    }
}, stream=True)

client = sseclient.SSEClient(response)
for event in client.events():
    data = json.loads(event.data)
    method = data.get("method")

    if method == "notifications/progress":
        params = data["params"]
        print(f"Progress: {params['progress']}/{params.get('total', '?')} - {params.get('message', '')}")
    elif method == "notifications/message":
        params = data["params"]
        print(f"[{params['level'].upper()}] {params['data']}")
    elif "result" in data:
        print(f"Final result: {data['result']}")
        break
```
 


MCP Client
    

  1. 
```python
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
import asyncio

async def use_streaming(url, token):
    headers = {"Authorization": f"Bearer {token}"}

    # The MCP client uses streamable HTTP transport which handles SSE automatically
    async with streamablehttp_client(url=url, headers=headers) as (
        read_stream, write_stream, _
    ):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()

            # Tool calls automatically receive streaming events
            result = await session.call_tool(
                name="analyzeDataset",
                arguments={"datasetId": "ds-12345"}
            )
            print(f"Tool result: {result}")
            return result

asyncio.run(use_streaming(
    url="https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp",
    token="YOUR_ACCESS_TOKEN"
))
```
 



