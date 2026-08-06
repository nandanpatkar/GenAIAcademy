# Read a resource from an AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-resources-read.html

---

# Read a resource from an AgentCore gateway

To read a specific resource, make a POST request to the gateway’s MCP endpoint and specify `resources/read` as the method in the request body and the URI of the resource:

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
    

On version `2026-07-28`, each request carries the `MCP-Protocol-Version` header, the `Mcp-Method` and `Mcp-Name` request-metadata headers, and the `_meta` version fields in the body. For `resources/read`, `Mcp-Name` is the resource `uri`.

```text
POST /mcp HTTP/1.1
Host: ${GatewayEndpoint}
Accept: application/json, text/event-stream
Content-Type: application/json
Authorization: ${Authorization header}
MCP-Protocol-Version: 2026-07-28
Mcp-Method: resources/read
Mcp-Name: ${ResourceUri}

${RequestBody}
```
###### Note

The gateway accepts only the MCP protocol versions listed in the `supportedVersions` field of its `protocolConfiguration.mcp` configuration. To use version `2026-07-28`, make sure that your gateway’s `supportedVersions` includes it. You can change the supported versions with the [UpdateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateGateway.html>) API.

Replace the following values:

  * `${GatewayEndpoint}` – The URL of the gateway, as provided in the response of the [CreateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGateway.html>) API.

  * `${Authorization header}` – The authorization credentials from the identity provider when you set up [inbound authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-inbound-auth.html>).

  * `${McpProtocolVersion}` – The MCP protocol version for the request, such as `2025-11-25`. The version must be one that your gateway supports.

  * `${ResourceUri}` – The URI of the resource, matching the `uri` in the request body.

  * `${RequestBody}` – The JSON payload of the request body, as specified in [Reading resources](<https://modelcontextprotocol.io/specification/2025-06-18/server/resources#reading-resources>) in the [Model Context Protocol (MCP)](<https://modelcontextprotocol.io/docs/getting-started/intro>) . Include `resources/read` as the `method` and include the `uri` of the resource. On version `2026-07-28`, also include the `_meta` version fields in `params`.


The response returns a `contents` array where each entry includes the `uri`, `mimeType`, and either `text` (for text content) or `blob` (base64-encoded binary content).

###### Note

The `resources/read` operation proxies the request live to the downstream MCP server. The resource URI is the raw URI as returned by `resources/list` (no target prefix).

###### Note

When multiple targets expose the same resource URI, the gateway routes the request to the target with the lowest `resourcePriority` value.

###### Important

The `uri` parameter is passed through to the downstream MCP server target without sanitization. A user-provided resource URI could contain a malicious URL endpoint intended for SSRF attacks or attempt to read local filesystem paths (for example, `file:///etc/passwd`). Validate resource URIs against an allowlist of expected URI schemes and patterns before calling `resources/read`. Only use URIs returned by `resources/list` from trusted MCP server targets.

## Code samples for reading a resource

To see examples of reading a resource from the gateway, select one of the following methods:

###### Example

curl (2025-11-25 and earlier)
    

The following curl request shows an example request to read a resource with URI `config://app-settings` through a gateway with the ID `mygateway-abcdefghij`. Set the `MCP-Protocol-Version` header to a version that your gateway supports.

```bash
curl -X POST \
  https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "MCP-Protocol-Version: 2025-11-25" \
  -d '{
    "jsonrpc": "2.0",
    "id": "read-resource-request",
    "method": "resources/read",
    "params": {
      "uri": "config://app-settings"
    }
}'
```
curl (2026-07-28)
    

On version `2026-07-28`, include the `Mcp-Method` and `Mcp-Name` request-metadata headers and the `_meta` version fields in the body. For `resources/read`, `Mcp-Name` is the resource `uri`, and the `MCP-Protocol-Version` header must match `_meta.io.modelcontextprotocol/protocolVersion`. Your gateway’s `supportedVersions` must include `2026-07-28`.

```bash
curl -X POST \
  https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "MCP-Protocol-Version: 2026-07-28" \
  -H "Mcp-Method: resources/read" \
  -H "Mcp-Name: config://app-settings" \
  -d '{
    "jsonrpc": "2.0",
    "id": "read-resource-request",
    "method": "resources/read",
    "params": {
      "uri": "config://app-settings",
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

def read_resource(gateway_url, access_token, resource_uri):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "MCP-Protocol-Version": "2025-11-25"
    }

    payload = {
        "jsonrpc": "2.0",
        "id": "read-resource-request",
        "method": "resources/read",
        "params": {
            "uri": resource_uri
        }
    }

    response = requests.post(gateway_url, headers=headers, json=payload)
    return response.json()

# Example usage
gateway_url = "https://${GatewayEndpoint}/mcp" # Replace with your actual gateway endpoint
access_token = "${AccessToken}" # Replace with your actual access token
result = read_resource(
    gateway_url,
    access_token,
    "config://app-settings"  # Replace with the resource URI from resources/list
)
print(json.dumps(result, indent=2))
```
Python requests package (2026-07-28)
    

On version `2026-07-28`, include the `Mcp-Method` and `Mcp-Name` request-metadata headers and the `_meta` version fields in the body. For `resources/read`, `Mcp-Name` is the resource `uri`, and the `MCP-Protocol-Version` header must match `_meta.io.modelcontextprotocol/protocolVersion`. Your gateway’s `supportedVersions` must include `2026-07-28`.

```python
import requests
import json

def read_resource(gateway_url, access_token, resource_uri):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "MCP-Protocol-Version": "2026-07-28",
        "Mcp-Method": "resources/read",
        "Mcp-Name": resource_uri
    }

    payload = {
        "jsonrpc": "2.0",
        "id": "read-resource-request",
        "method": "resources/read",
        "params": {
            "uri": resource_uri,
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
result = read_resource(
    gateway_url,
    access_token,
    "config://app-settings"  # Replace with the resource URI from resources/list
)
print(json.dumps(result, indent=2))
```
MCP Client
     ```python
     from mcp import ClientSession
     from mcp.client.streamable_http import streamablehttp_client
     from pydantic import AnyUrl
     import asyncio

     async def execute_mcp(
         url,
         token,
         resource_uri,
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

                 # 2. Read specific resource
                 print(f"Reading resource: {resource_uri}")
                 resource_response = await session.read_resource(uri=AnyUrl(resource_uri))
                 for content in resource_response.contents:
                     print(f"URI: {content.uri}, MIME: {content.mimeType}")
                     if hasattr(content, 'text') and content.text:
                         print(f"Text: {content.text}")
                     elif hasattr(content, 'blob') and content.blob:
                         print(f"Blob (base64): {content.blob[:100]}...")
                 return resource_response

     async def main():
         url = "https://${GatewayEndpoint}/mcp"
         token = "your_bearer_token_here"
         resource_uri = "config://app-settings"
         await execute_mcp(
             url=url,
             token=token,
             resource_uri=resource_uri
         )

     if __name__ == "__main__":
         asyncio.run(main())
     ```
Strands MCP Client
    

NOTE: Strands SDK resource support might vary. Use the MCP Client approach shown previously for the most reliable `resources/read` implementation.

```python
from strands.tools.mcp.mcp_client import MCPClient
from mcp.client.streamable_http import streamablehttp_client

def create_streamable_http_transport(mcp_url: str, access_token: str):
    return streamablehttp_client(mcp_url, headers={"Authorization": f"Bearer {access_token}"})

def run_agent(mcp_url: str, access_token: str):
    mcp_client = MCPClient(lambda: create_streamable_http_transport(mcp_url, access_token))

    with mcp_client:
        result = mcp_client.read_resource_sync(uri="config://app-settings")
        print(result)

run_agent(<MCP URL>, <Access token>)
```
LangGraph MCP Client
    

NOTE: LangGraph MCP adapter resource support might vary. Use the MCP Client approach shown previously for the most reliable `resources/read` implementation.

```python
import asyncio
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
from pydantic import AnyUrl

async def read_resource(url, token, resource_uri):
    headers = {"Authorization": f"Bearer {token}"}
    async with streamablehttp_client(url=url, headers=headers) as (
        read_stream, write_stream, callA
    ):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            response = await session.read_resource(uri=AnyUrl(resource_uri))
            for content in response.contents:
                if hasattr(content, 'text') and content.text:
                    print(f"{content.uri}: {content.text}")
                elif hasattr(content, 'blob') and content.blob:
                    print(f"{content.uri}: <blob, {len(content.blob)} chars base64>")

asyncio.run(read_resource(
    "https://${GatewayEndpoint}/mcp",
    "${AccessToken}",
    "config://app-settings"
))
```
## Errors

The `resources/read` operation can return the following types of errors:

  * Errors returned as part of the HTTP status code:

**AuthenticationError**
    

The request failed due to invalid authentication credentials.

**HTTP Status Code** : 401

**AuthorizationError**
    

The caller does not have permission to read the resource.

**HTTP Status Code** : 403

**ResourceNotFoundError**
    

The specified resource URI does not exist or is not exposed by any target.

**HTTP Status Code** : 404

**ValidationError**
    

The provided URI is malformed or missing.

**HTTP Status Code** : 400

**InternalServerError**
    

An internal server error occurred.

**HTTP Status Code** : 500

  * MCP errors. For more information about these types of errors, see [Resources](<https://modelcontextprotocol.io/specification/2025-06-18/server/resources>) in the [Model Context Protocol (MCP)](<https://modelcontextprotocol.io/docs/getting-started/intro>) documentation.



