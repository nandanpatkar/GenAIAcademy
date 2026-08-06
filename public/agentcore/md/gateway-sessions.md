# Use MCP sessions with your AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-sessions.html

---

# Use MCP sessions with your AgentCore gateway

MCP sessions enable stateful interactions between clients and your AgentCore gateway. When sessions are enabled, the gateway generates a unique session identifier during initialization and maintains state across multiple requests, enabling advanced MCP features such as elicitation and sampling.

## Benefits of using sessions

**Stateful MCP server target interactions**
    

The gateway stores the MCP server target’s session ID and reuses it on subsequent tool calls. This avoids re-initialization on every request and enables targets to maintain context across calls.

**Faster responses with AgentCore Runtime targets**
    

When the target’s session is reused, AgentCore Runtime doesn’t need to cold-start a new MCP server connection on each request, resulting in faster response times.

**Enables advanced MCP features**
    

Sessions are a prerequisite for [elicitation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-elicitation.html>) and [sampling](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-mcp-sampling.html>), which require tracking state across multiple requests.

**User-scoped security (authenticated gateways)**
    

For gateways with inbound authentication, sessions are bound to the verified user identity, preventing session hijacking.

## Enable sessions on your gateway

To enable sessions, specify a `sessionConfiguration` in the `protocolConfiguration.mcp` field when creating or updating your gateway.

```json
{
  "protocolConfiguration": {
    "mcp": {
      "sessionConfiguration": {
        "sessionTimeoutInSeconds": 3600
      }
    }
  }
}
```
The `sessionTimeoutInSeconds` parameter is optional. If omitted, the default timeout is 3600 seconds (1 hour). Valid range is 900 (15 minutes) to 28800 (8 hours). The timeout is absolute, calculated from the first `initialize` request.

To also enable features that depend on sessions such as elicitation and sampling, you must additionally enable response streaming:

```json
{
  "protocolConfiguration": {
    "mcp": {
      "sessionConfiguration": {
        "sessionTimeoutInSeconds": 3600
      },
      "streamingConfiguration": {
        "enableResponseStreaming": true
      }
    }
  }
}
```
###### Note

When sessions are enabled on a gateway, you cannot include `Mcp-Session-Id` in the `metadataConfiguration` of a gateway target’s header propagation settings. The gateway manages session IDs internally. Attempting to do so returns an HTTP 400 Bad Request error.

## Session lifecycle

The session lifecycle follows the MCP protocol’s initialization flow:

  1. The client sends an `initialize` request to the gateway.

  2. The gateway creates a session, stores session metadata, and returns a unique `Mcp-Session-Id` in the response header.

  3. The client includes the `Mcp-Session-Id` header in all subsequent requests.

  4. The gateway validates the session existence, expiry, and user identity (for authenticated gateways) on each request.

  5. When the session times out or the client disconnects, the session expires.


On the first tool call to an MCP server target within a session, the gateway initializes a connection with the target and stores the target’s session ID. Subsequent tool calls to the same target reuse this stored session ID, avoiding repeated initialization.

## User identity and session scoping

Sessions are scoped to the authenticated user identity to prevent session hijacking. The gateway derives the user identity differently depending on the inbound authentication method configured on your gateway:

Authentication method | User identifier | Behavior  
---|---|---  
OAuth / OIDC |  `sub` claim from the JWT token |  Fully scoped. Only the user who created the session can use it. The `sub` claim is required by the OIDC specification, is locally unique within the issuer, case-sensitive, and never reassigned.  
AWS IAM (SigV4) |  Principal ARN |  Fully scoped. Only the IAM principal who created the session can use it. The Principal ARN is globally unique across AWS, immutable for the IAM entity’s lifetime. Example: `arn:aws:iam::123456789012:user/john-doe`  
No authentication |  None |  **No user scoping.** Sessions are available but not bound to any identity. Anyone with the session ID can interact with the session.  
  
###### Important

For gateways with no inbound authentication, sessions carry a **session hijacking risk** as described in the [MCP specification security considerations](<https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation#security-considerations>). If a session ID is leaked or guessed, another party can resume the session. Use unauthenticated sessions only for development and testing, not for production workloads handling sensitive data.

For authenticated gateways, if a different user attempts to use an existing session ID, the gateway returns HTTP 404 Not Found — the session is invisible to other users.

## Session timeout and expiry

The session timeout is calculated from the first `initialize` request. After the timeout period, the session expires and cannot be used.

  * **Default timeout** : 3600 seconds (1 hour)

  * **Configurable range** : 900 seconds (15 minutes) to 28800 seconds (8 hours)


If an MCP server target’s session expires before the gateway session timeout, the gateway transparently re-initializes with the target and updates the stored target session ID. The gateway session remains active.

## Error handling

Scenario | HTTP status | Description  
---|---|---  
Missing `Mcp-Session-Id` header on a session-enabled gateway |  400 Bad Request |  All requests after `initialize` must include the session header.  
Invalid or expired session ID |  404 Not Found |  The session does not exist or has timed out.  
Different user attempts to use another user’s session (authenticated gateways) |  404 Not Found |  The session is invisible to other users.  
`Mcp-Session-Id` in target `metadataConfiguration` when sessions are enabled |  400 Bad Request |  Returned at control plane when creating or updating a target.  
  
## Code samples

###### Example

curl
    

  1. Send an `initialize` request to start a session:

```bash
curl -X POST \
  https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "id": "init-request",
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-06-18",
      "capabilities": {},
      "clientInfo": {
        "name": "my-agent",
        "version": "1.0.0"
      }
    }
}'
```
The response includes the `Mcp-Session-Id` header:

```text
HTTP/1.1 200 OK
Mcp-Session-Id: session-abc123def456
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": "init-request",
  "result": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": { "listChanged": true }
    },
    "serverInfo": {
      "name": "agentcore-gateway",
      "version": "1.0.0"
    }
  }
}
```
  2. Include the session ID in subsequent requests:

```bash
curl -X POST \
  https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Mcp-Session-Id: session-abc123def456" \
  -d '{
    "jsonrpc": "2.0",
    "id": "call-tool-request",
    "method": "tools/call",
    "params": {
      "name": "searchProducts",
      "arguments": {
        "query": "wireless headphones"
      }
    }
}'
```
Python requests package
    

  1. 
```python
import requests
import json

gateway_url = "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp"
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}

# Step 1: Initialize and get session ID
init_response = requests.post(gateway_url, headers=headers, json={
    "jsonrpc": "2.0",
    "id": "init-request",
    "method": "initialize",
    "params": {
        "protocolVersion": "2025-06-18",
        "capabilities": {},
        "clientInfo": {"name": "my-agent", "version": "1.0.0"}
    }
})

session_id = init_response.headers["Mcp-Session-Id"]
print(f"Session ID: {session_id}")

# Step 2: Use session ID in subsequent requests
headers["Mcp-Session-Id"] = session_id

tool_response = requests.post(gateway_url, headers=headers, json={
    "jsonrpc": "2.0",
    "id": "call-tool-request",
    "method": "tools/call",
    "params": {
        "name": "searchProducts",
        "arguments": {"query": "wireless headphones"}
    }
})

print(json.dumps(tool_response.json(), indent=2))
```
 


MCP Client
    

  1. 
```python
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
import asyncio

async def use_session(url, token):
    headers = {"Authorization": f"Bearer {token}"}

    async with streamablehttp_client(url=url, headers=headers) as (
        read_stream, write_stream, _
    ):
        async with ClientSession(read_stream, write_stream) as session:
            # Initialize - session ID is managed automatically by the MCP client
            init_response = await session.initialize()
            print(f"Initialized: {init_response}")

            # Subsequent calls reuse the session automatically
            tool_response = await session.call_tool(
                name="searchProducts",
                arguments={"query": "wireless headphones"}
            )
            print(f"Tool response: {tool_response}")
            return tool_response

asyncio.run(use_session(
    url="https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp",
    token="YOUR_ACCESS_TOKEN"
))
```
 


Strands MCP Client
    

  1. 
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

# Strands MCP client handles session management automatically
with mcp_client:
    agent = Agent(tools=mcp_client.list_tools_sync())
    response = agent("Search for wireless headphones")
    print(response)
```
 



