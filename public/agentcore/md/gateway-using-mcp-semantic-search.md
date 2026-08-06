# Search for tools in your AgentCore gateway with a natural language query - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-semantic-search.html

---

# Search for tools in your AgentCore gateway with a natural language query

If you enabled semantic search for your gateway when you created it, you can call the `x_amz_bedrock_agentcore_search` tool to search for tools in your gateway with a natural language query. Semantic search is particularly useful when you have many tools and need to find the most appropriate ones for your use case. To learn how to enable semantic search during gateway creation, see [Create an Amazon Bedrock AgentCore gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-create.html>).

To search for a tool using this AgentCore tool, make the following POST request with the `tools/call` method to the gateway’s MCP endpoint:

###### Example

2025-11-25 and earlier
     ```text
     POST /mcp HTTP/1.1
     Host: ${GatewayEndpoint}
     Accept: application/json, text/event-stream
     Content-Type: application/json
     Authorization: ${Authorization header}
     MCP-Protocol-Version: ${McpProtocolVersion}

     {
       "jsonrpc": "2.0",
       "id": "${RequestName}",
       "method": "tools/call",
       "params": {
         "name": "x_amz_bedrock_agentcore_search",
         "arguments": {
           "query": ${Query}
         }
       }
     }
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
Mcp-Name: x_amz_bedrock_agentcore_search

{
  "jsonrpc": "2.0",
  "id": "${RequestName}",
  "method": "tools/call",
  "params": {
    "name": "x_amz_bedrock_agentcore_search",
    "arguments": {
      "query": ${Query}
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
}
```
###### Note

The gateway accepts only the MCP protocol versions listed in the `supportedVersions` field of its `protocolConfiguration.mcp` configuration. To use version `2026-07-28`, make sure that your gateway’s `supportedVersions` includes it. You can change the supported versions with the [UpdateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateGateway.html>) API.

Replace the following values:

  * `${GatewayEndpoint}` – The URL of the gateway, as provided in the response of the [CreateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGateway.html>) API.

  * `${Authorization header}` – The authorization credentials from the identity provider when you set up [inbound authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-inbound-auth.html>).

  * `${McpProtocolVersion}` – The MCP protocol version for the request, such as `2025-11-25`. The version must be one that your gateway supports.

  * `${RequestName}` – A name for the request.

  * `${Query}` – A natural language query to search for tools.


The response returns a list of tools that are relevant to the query.

## Code samples for tool searching

To see examples of using natural language queries to find tools in the gateway, select one of the following methods:

###### Example

Python requests package (2025-11-25 and earlier)
    

Set the `MCP-Protocol-Version` header to a version that your gateway supports.

```python
import requests
import json

def search_tools(gateway_url, access_token, query):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "MCP-Protocol-Version": "2025-11-25"
    }

    payload = {
        "jsonrpc": "2.0",
        "id": "search-tools-request",
        "method": "tools/call",
        "params": {
            "name": "x_amz_bedrock_agentcore_search",
            "arguments": {
                "query": query
            }
        }
    }

    response = requests.post(gateway_url, headers=headers, json=payload)
    return response.json()

# Example usage
gateway_url = "https://${GatewayEndpoint}/mcp" # Replace with your actual gateway endpoint
access_token = "${AccessToken}" # Replace with your actual access token
results = search_tools(gateway_url, access_token, "find order information")
print(json.dumps(results, indent=2))
```
Python requests package (2026-07-28)
    

On version `2026-07-28`, include the `Mcp-Method` and `Mcp-Name` request-metadata headers and the `_meta` version fields in the body. The `MCP-Protocol-Version` header must match `_meta.io.modelcontextprotocol/protocolVersion`. Your gateway’s `supportedVersions` must include `2026-07-28`.

```python
import requests
import json

def search_tools(gateway_url, access_token, query):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "MCP-Protocol-Version": "2026-07-28",
        "Mcp-Method": "tools/call",
        "Mcp-Name": "x_amz_bedrock_agentcore_search"
    }

    payload = {
        "jsonrpc": "2.0",
        "id": "search-tools-request",
        "method": "tools/call",
        "params": {
            "name": "x_amz_bedrock_agentcore_search",
            "arguments": {
                "query": query
            },
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
results = search_tools(gateway_url, access_token, "find order information")
print(json.dumps(results, indent=2))
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
             "name": "x_amz_bedrock_agentcore_search",
             "arguments": {
                 "query": "How do I find order details?"
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
     ```python
     from strands.tools.mcp.mcp_client import MCPClient
     from mcp.client.streamable_http import streamablehttp_client

     def create_streamable_http_transport(mcp_url: str, access_token: str):
         return streamablehttp_client(mcp_url, headers={"Authorization": f"Bearer {access_token}"})

     def get_full_tools_list(client):
         """
         List tools w/ support for pagination
         """
         more_tools = True
         tools = []
         pagination_token = None
         while more_tools:
             tmp_tools = client.list_tools_sync(pagination_token=pagination_token)
             tools.extend(tmp_tools)
             if tmp_tools.pagination_token is None:
                 more_tools = False
             else:
                 more_tools = True
                 pagination_token = tmp_tools.pagination_token
         return tools

     def run_agent(mcp_url: str, access_token: str):
         mcp_client = MCPClient(lambda: create_streamable_http_transport(mcp_url, access_token))

         with mcp_client:
             tools = get_full_tools_list(mcp_client)
             print(f"Found the following tools: {[tool.tool_name for tool in tools]}")
             result = mcp_client.call_tool_sync(
                 tool_use_id="tool-123",  # A unique ID for the tool call
                 name="x_amz_bedrock_agentcore_search",  # The name of the tool to invoke
                 arguments={"query": "find order information"}  # A dictionary of arguments for the tool
             )
             print(result)

     url = {gatewayUrl}
     token = {AccessToken}
     run_agent(url, token)
     ```
LangGraph MCP Client
     ```python
     import asyncio

     from langchain_mcp_adapters.client import MultiServerMCPClient
     from langgraph.prebuilt import create_react_agent

     url = ""
     headers = {}

     def filter_search_tool(
     ):
         mcp_client = MultiServerMCPClient(
             {
                 "agent": {
                     "transport": "streamable_http",
                     "url": url,
                     "headers": headers,
                 }
             }
         )
         tools = asyncio.run(mcp_client.get_tools())
         builtin_search_tool = []
         for tool in tools:
             if tool.name == "x_amz_bedrock_agentcore_search":
                 builtin_search_tool.append(tool)
         return builtin_search_tool

     def execute_agent(
         user_prompt,
         model_id,
         region,
         tools
     ):
         model = ChatBedrock(model_id=model_id, region_name=region)

         agent = create_react_agent(model, filter_search_tool())
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
