# List resource templates in an AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-resources-templates-list.html

---

# List resource templates in an AgentCore gateway

To list all available resource templates that an AgentCore gateway provides, make a POST request to the gateway’s MCP endpoint and specify `resources/templates/list` as the method in the request body:

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
    

On version `2026-07-28`, each request carries the `MCP-Protocol-Version` header, the `Mcp-Method` request-metadata header, and the `_meta` version fields in the body.

```text
POST /mcp HTTP/1.1
Host: ${GatewayEndpoint}
Accept: application/json, text/event-stream
Content-Type: application/json
Authorization: ${Authorization header}
MCP-Protocol-Version: 2026-07-28
Mcp-Method: resources/templates/list

${RequestBody}
```
###### Note

The gateway accepts only the MCP protocol versions listed in the `supportedVersions` field of its `protocolConfiguration.mcp` configuration. To use version `2026-07-28`, make sure that your gateway’s `supportedVersions` includes it. You can change the supported versions with the [UpdateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateGateway.html>) API.

Replace the following values:

  * `${GatewayEndpoint}` – The URL of the gateway, as provided in the response of the [CreateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGateway.html>) API.

  * `${Authorization header}` – The authorization credentials from the identity provider when you set up [inbound authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-inbound-auth.html>).

  * `${McpProtocolVersion}` – The MCP protocol version for the request, such as `2025-11-25`. The version must be one that your gateway supports.

  * `${RequestBody}` – The JSON payload of the request body, as specified in [Resource templates](<https://modelcontextprotocol.io/specification/2025-06-18/server/resources#resource-templates>) in the [Model Context Protocol (MCP)](<https://modelcontextprotocol.io/docs/getting-started/intro>) . Include `resources/templates/list` as the `method`. On version `2026-07-28`, also include the `_meta` version fields in `params`.


###### Note

For a list of optionally supported parameters for `resources/templates/list` , see the `params` object in the request body at [Resources](<https://modelcontextprotocol.io/specification/2025-06-18/server/resources>) in the [Model Context Protocol documentation](<https://modelcontextprotocol.io/specification/2025-06-18>) . At the top of the page next to the search bar, you can select the MCP version whose documentation you want to view. Make sure that the version is one [supported by Amazon Bedrock AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-using.html>).

The response returns a list of available resource templates with their URI templates, names, descriptions, and MIME types.

###### Note

Resource templates use RFC 6570 URI templates to describe parameterized resources. Clients can fill in template parameters to construct concrete resource URIs for use with `resources/read`. For example, a template `users://{user_id}/profile` can be expanded to `users://123/profile`.

## Code samples for listing resource templates

To see examples of listing available resource templates in the gateway, select one of the following methods:

###### Example

Python requests package (2025-11-25 and earlier)
    

Set the `MCP-Protocol-Version` header to a version that your gateway supports.

```python
import requests
import json

def list_resource_templates(gateway_url, access_token):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "MCP-Protocol-Version": "2025-11-25"
    }

    payload = {
        "jsonrpc": "2.0",
        "id": "list-resource-templates-request",
        "method": "resources/templates/list"
    }

    response = requests.post(gateway_url, headers=headers, json=payload)
    return response.json()

# Example usage
gateway_url = "https://${GatewayEndpoint}/mcp" # Replace with your actual gateway endpoint
access_token = "${AccessToken}" # Replace with your actual access token
templates = list_resource_templates(gateway_url, access_token)
print(json.dumps(templates, indent=2))
```
Python requests package (2026-07-28)
    

On version `2026-07-28`, add the `MCP-Protocol-Version` and `Mcp-Method` headers, and include the `_meta` version fields in the request body. Your gateway’s `supportedVersions` must include `2026-07-28`.

```python
import requests
import json

def list_resource_templates(gateway_url, access_token):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "MCP-Protocol-Version": "2026-07-28",
        "Mcp-Method": "resources/templates/list"
    }

    payload = {
        "jsonrpc": "2.0",
        "id": "list-resource-templates-request",
        "method": "resources/templates/list",
        "params": {
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
templates = list_resource_templates(gateway_url, access_token)
print(json.dumps(templates, indent=2))
```
MCP Client
     ```python
     import asyncio
     from mcp import ClientSession
     from mcp.client.streamable_http import streamablehttp_client

     async def execute_mcp(
         url,
         token,
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

                 # 2. List available resource templates
                 print("Listing resource templates...")
                 cursor = True
                 templates = []
                 while cursor:
                     next_cursor = cursor
                     if isinstance(cursor, bool):
                         next_cursor = None
                     list_templates_response = await session.list_resource_templates(next_cursor)
                     templates.extend(list_templates_response.resourceTemplates)
                     cursor = list_templates_response.nextCursor

                 if templates:
                     for template in templates:
                         print(f"{template.uriTemplate} - {template.name}")
                 print(f"Total resource templates: {len(templates)}")

     async def main():
         url = "https://${GatewayEndpoint}/mcp"
         token = "your_bearer_token_here"

         # Optional additional headers
         additional_headers = {
             "Content-Type": "application/json",
         }

         await execute_mcp(
             url=url,
             token=token,
             headers=additional_headers
         )

     # Run the async function
     if __name__ == "__main__":
         asyncio.run(main())
     ```
Strands MCP Client
     ```bash
     # NOTE: Strands SDK resource template support may vary. Use the MCP Client
     # approach above for the most reliable resources/templates/list implementation.
     from strands.tools.mcp.mcp_client import MCPClient
     from mcp.client.streamable_http import streamablehttp_client

     def create_streamable_http_transport(mcp_url: str, access_token: str):
            return streamablehttp_client(mcp_url, headers={"Authorization": f"Bearer {access_token}"})

     def run_agent(mcp_url: str, access_token: str):
         mcp_client = MCPClient(lambda: create_streamable_http_transport(mcp_url, access_token))

         with mcp_client:
             result = mcp_client.list_resource_templates_sync()
             print(f"Found the following templates: {[t.uriTemplate for t in result.resourceTemplates]}")

     run_agent(<MCP URL>, <Access token>)
     ```
LangGraph MCP Client
     ```bash
     # NOTE: LangGraph MCP adapter resource template support may vary. Use the MCP
     # Client approach above for the most reliable implementation.

     import asyncio
     from mcp import ClientSession
     from mcp.client.streamable_http import streamablehttp_client

     async def list_resource_templates(url, token):
         headers = {"Authorization": f"Bearer {token}"}
         async with streamablehttp_client(url=url, headers=headers) as (
             read_stream, write_stream, callA
         ):
             async with ClientSession(read_stream, write_stream) as session:
                 await session.initialize()
                 response = await session.list_resource_templates()
                 for template in response.resourceTemplates:
                     print(f"{template.uriTemplate} - {template.name}")

     asyncio.run(list_resource_templates("https://${GatewayEndpoint}/mcp", "${AccessToken}"))
     ```
