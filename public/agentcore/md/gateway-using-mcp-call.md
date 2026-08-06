# Call a tool in a AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-call.html

---

# Call a tool in a AgentCore gateway

To call a specific tool, make a POST request to the gateway’s MCP endpoint. Specify `tools/call` as the method in the request body, along with the name of the tool and its arguments. The request format depends on the MCP protocol version:

###### Example

2025-11-25 and earlier
     ```text
     POST /mcp HTTP/1.1
     Host: ${GatewayEndpoint}
     Accept: application/json, text/event-stream
     Content-Type: application/json
     Authorization: ${Authorization header}
     MCP-Protocol-Version: ${McpProtocolVersion}

     ${RequestBody}
     ```
2026-07-28
    

On version `2026-07-28`, each request carries the `MCP-Protocol-Version` header, the `Mcp-Method` and `Mcp-Name` request-metadata headers, and the `_meta` version fields in the body.

```text
POST /mcp HTTP/1.1
Host: ${GatewayEndpoint}
Accept: application/json, text/event-stream
Content-Type: application/json
Authorization: ${Authorization header}
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: ${ToolName}

${RequestBody}
```
###### Note

The gateway accepts only the MCP protocol versions listed in the `supportedVersions` field of its `protocolConfiguration.mcp` configuration. To use version `2026-07-28`, make sure that your gateway’s `supportedVersions` includes it. You can change the supported versions with the [UpdateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateGateway.html>) API.

Replace the following values:

  * `${GatewayEndpoint}` – The URL of the gateway, as provided in the response of the [CreateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGateway.html>) API.

  * `${Authorization header}` – The authorization credentials from the identity provider when you set up [inbound authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-inbound-auth.html>).

  * `${McpProtocolVersion}` – The MCP protocol version for the request, such as `2025-11-25`. The version must be one that your gateway supports.

  * `${RequestBody}` – The JSON payload of the request body, as specified in [Calling tools](<https://modelcontextprotocol.io/specification/2025-06-18/server/tools#calling-tools>) in the [Model Context Protocol (MCP)](<https://modelcontextprotocol.io/docs/getting-started/intro>) . Include `tools/call` as the `method` and include the `name` of the tool and its `arguments`.


The response returns the content returned by the tool and associated metadata.

## Code samples for calling tools

To see examples of calling tools in the gateway, select one of the following methods:

###### Example

curl (2025-11-25 and earlier)
    

The following curl request shows an example request to call a tool called `searchProducts` through a gateway with the ID `mygateway-abcdefghij`. Set the `MCP-Protocol-Version` header to a version that your gateway supports.

```bash
curl -X POST \
  https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "MCP-Protocol-Version: 2025-11-25" \
  -d '{
    "jsonrpc": "2.0",
    "id": "invoke-tool-request",
    "method": "tools/call",
    "params": {
      "name": "searchProducts",
      "arguments": {
        "query": "wireless headphones",
        "category": "Electronics",
        "maxResults": 2,
        "priceRange": {
          "min": 50.00,
          "max": 200.00
        }
      }
    }
}'
```
curl (2026-07-28)
    

On version `2026-07-28`, include the `Mcp-Method` and `Mcp-Name` request-metadata headers and the `_meta` version fields in the body. The `MCP-Protocol-Version` header must match `_meta.io.modelcontextprotocol/protocolVersion`. Your gateway’s `supportedVersions` must include `2026-07-28`.

```bash
curl -X POST \
  https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "MCP-Protocol-Version: 2026-07-28" \
  -H "Mcp-Method: tools/call" \
  -H "Mcp-Name: searchProducts" \
  -d '{
    "jsonrpc": "2.0",
    "id": "invoke-tool-request",
    "method": "tools/call",
    "params": {
      "name": "searchProducts",
      "arguments": {
        "query": "wireless headphones",
        "category": "Electronics",
        "maxResults": 2,
        "priceRange": {
          "min": 50.00,
          "max": 200.00
        }
      },
      "_meta": {
        "io.modelcontextprotocol/protocolVersion": "2026-07-28",
        "io.modelcontextprotocol/clientInfo": {
          "name": "my-agent",
          "version": "1.0.0"
        },
        "io.modelcontextprotocol/clientCapabilities": {}
      }
    }
}'
```
Python requests package (2025-11-25 and earlier)
    

Set the `MCP-Protocol-Version` header to a version that your gateway supports.

```python
import requests
import json

def call_tool(gateway_url, access_token, tool_name, arguments):
    headers = {
        "Accept": "application/json, text/event-stream",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "MCP-Protocol-Version": "2025-11-25"
    }

    payload = {
        "jsonrpc": "2.0",
        "id": "call-tool-request",
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": arguments
        }
    }

    response = requests.post(gateway_url, headers=headers, json=payload)
    return response.json()

# Example usage
gateway_url = "https://${GatewayEndpoint}/mcp" # Replace with your actual gateway endpoint
access_token = "${AccessToken}" # Replace with your actual access token
result = call_tool(
    gateway_url,
    access_token,
    "openapi-target-1___get_orders_byId",  # Replace with <{TargetId}__{ToolName}>
    {"orderId": "ORD-12345-67890", "customerId": "CUST-98765"}
)
print(json.dumps(result, indent=2))
```
Python requests package (2026-07-28)
    

On version `2026-07-28`, include the `Mcp-Method` and `Mcp-Name` request-metadata headers and the `_meta` version fields in the body. The `MCP-Protocol-Version` header must match `_meta.io.modelcontextprotocol/protocolVersion`. Your gateway’s `supportedVersions` must include `2026-07-28`.

```python
import requests
import json

def call_tool(gateway_url, access_token, tool_name, arguments):
    headers = {
        "Accept": "application/json, text/event-stream",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "MCP-Protocol-Version": "2026-07-28",
        "Mcp-Method": "tools/call",
        "Mcp-Name": tool_name
    }

    payload = {
        "jsonrpc": "2.0",
        "id": "call-tool-request",
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": arguments,
            "_meta": {
                "io.modelcontextprotocol/protocolVersion": "2026-07-28",
                "io.modelcontextprotocol/clientInfo": {"name": "my-agent", "version": "1.0.0"},
                "io.modelcontextprotocol/clientCapabilities": {}
            }
        }
    }

    response = requests.post(gateway_url, headers=headers, json=payload)
    return response.json()

# Example usage
gateway_url = "https://${GatewayEndpoint}/mcp" # Replace with your actual gateway endpoint
access_token = "${AccessToken}" # Replace with your actual access token
result = call_tool(
    gateway_url,
    access_token,
    "openapi-target-1___get_orders_byId",  # Replace with <{TargetId}__{ToolName}>
    {"orderId": "ORD-12345-67890", "customerId": "CUST-98765"}
)
print(json.dumps(result, indent=2))
```
MCP Client
     ```python
     from mcp import ClientSession
     from mcp.client.streamable_http import streamablehttp_client
     import asyncio

     async def execute_mcp(
         url,
         token,
         tool_params,
         headers=None
     ):
         default_headers = {
             "Authorization": f"Bearer {token}"
         }
         headers = {**default_headers, **(headers or {})}

         async with streamablehttp_client(
            url=url,
            headers=headers,
         ) as (
             read_stream,
             write_stream,
             callA,
         ):
             async with ClientSession(read_stream, write_stream) as session:
                 # 1. Perform initialization handshake
                 print("Initializing MCP...")
                 _init_response = await session.initialize()
                 print(f"MCP Server Initialize successful! - {_init_response}")

                 # 2. Call specific tool
                 print(f"Calling tool: {tool_params['name']}")
                 tool_response = await session.call_tool(
                     name=tool_params['name'],
                     arguments=tool_params['arguments']
                 )
                 print(f"Tool response: {tool_response}")
                 return tool_response

     async def main():
         url = "https://${GatewayEndpoint}/mcp"
         token = "your_bearer_token_here"
         tool_params = {
             "name": "LambdaTarget___get_order_tool",
             "arguments": {
                 "orderId": "order123"
             }
         }
         await execute_mcp(
             url=url,
             token=token,
             tool_params=tool_params
         )

     if __name__ == "__main__":
         asyncio.run(main())
     ```
Strands MCP Client
    

NOTE: This is for invoking an agent.

```python
from strands.tools.mcp.mcp_client import MCPClient
from mcp.client.streamable_http import streamablehttp_client

def create_streamable_http_transport(mcp_url: str, access_token: str):
    return streamablehttp_client(mcp_url, headers={"Authorization": f"Bearer {access_token}"})

def run_agent(mcp_url: str, access_token: str):
    mcp_client = MCPClient(lambda: create_streamable_http_transport(mcp_url, access_token))

    with mcp_client:
        result = mcp_client.call_tool_sync(
            tool_use_id="tool-123",  # A unique ID for the tool call
            name="openapi-target-1___get_orders",  # The name of the tool to invoke
            arguments={}  # A dictionary of arguments for the tool
        )
        print(result)

url = {gatewayUrl}
token = {AccessToken}
run_agent(url, token)
```
LangGraph MCP Client
    

NOTE: This is for invoking an agent.

```python
import asyncio

from langgraph.prebuilt import create_react_agent

def execute_agent(
    user_prompt,
    model_id,
    region,
    tools
):
    model = ChatBedrock(model_id=model_id, region_name=region)

    agent = create_react_agent(model, tools)
    _response = asyncio.run(agent.ainvoke({
        "messages": user_prompt
    }))

    _response = _response.get('messages', {})[1].content
    print(
        f"Invoke Langchain Agents Response"
        f"Response - \n{_response}\n"
    )
    return _response
```
## Errors

The `tools/call` operation can return the following types of errors:

  * Errors returned as part of the HTTP status code:

**AuthenticationError**
    

The request failed due to invalid authentication credentials.

**HTTP Status Code** : 401

**AuthorizationError**
    

The caller does not have permission to invoke the tool.

**HTTP Status Code** : 403

**ResourceNotFoundError**
    

The specified tool does not exist.

**HTTP Status Code** : 404

**ValidationError**
    

The provided arguments do not conform to the tool’s input schema.

**HTTP Status Code** : 400

**ToolExecutionError**
    

An error occurred while executing the tool.

**HTTP Status Code** : 500

**InternalServerError**
    

An internal server error occurred.

**HTTP Status Code** : 500

  * MCP errors. For more information about these types of errors, [Error Handling](<https://modelcontextprotocol.io/specification/2024-11-05/server/tools#error-handlinghttps://modelcontextprotocol.io/specification/2024-11-05/server/tools#error-handling>) in the [Model Context Protocol (MCP)](<https://modelcontextprotocol.io/docs/getting-started/intro>) documentation.



