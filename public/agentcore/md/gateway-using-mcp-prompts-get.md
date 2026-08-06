# Get a prompt from an AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-using-mcp-prompts-get.html

---

# Get a prompt from an AgentCore gateway

To get a specific prompt, make a POST request to the gateway’s MCP endpoint and specify `prompts/get` as the method in the request body, name of the prompt, and the arguments:

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
Mcp-Method: prompts/get
Mcp-Name: ${PromptName}

${RequestBody}
```
###### Note

The gateway accepts only the MCP protocol versions listed in the `supportedVersions` field of its `protocolConfiguration.mcp` configuration. To use version `2026-07-28`, make sure that your gateway’s `supportedVersions` includes it. You can change the supported versions with the [UpdateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateGateway.html>) API.

Replace the following values:

  * `${GatewayEndpoint}` – The URL of the gateway, as provided in the response of the [CreateGateway](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGateway.html>) API.

  * `${Authorization header}` – The authorization credentials from the identity provider when you set up [inbound authorization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-inbound-auth.html>).

  * `${McpProtocolVersion}` – The MCP protocol version for the request, such as `2025-11-25`. The version must be one that your gateway supports.

  * `${PromptName}` – The name of the prompt, matching the `name` in the request body.

  * `${RequestBody}` – The JSON payload of the request body, as specified in [Getting a prompt](<https://modelcontextprotocol.io/specification/2025-06-18/server/prompts#getting-a-prompt>) in the [Model Context Protocol (MCP)](<https://modelcontextprotocol.io/docs/getting-started/intro>) . Include `prompts/get` as the `method` and include the `name` of the prompt and its `arguments`. On version `2026-07-28`, also include the `_meta` version fields in `params`.


The response returns the rendered prompt as an array of messages, each with a role and content.

###### Note

The `prompts/get` operation proxies the request live to the downstream MCP server. The prompt name must include the target prefix (for example, `myTarget___myPrompt`).

## Code samples for getting a prompt

To see examples of getting a prompt from the gateway, select one of the following methods:

###### Example

curl (2025-11-25 and earlier)
    

The following curl request shows an example request to get a prompt called `myTarget___code_review` through a gateway with the ID `mygateway-abcdefghij`. Set the `MCP-Protocol-Version` header to a version that your gateway supports.

```bash
curl -X POST \
  https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "MCP-Protocol-Version: 2025-11-25" \
  -d '{
    "jsonrpc": "2.0",
    "id": "get-prompt-request",
    "method": "prompts/get",
    "params": {
      "name": "myTarget___code_review",
      "arguments": {
        "language": "python",
        "code": "print(\"hello\")"
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
  -H "Mcp-Method: prompts/get" \
  -H "Mcp-Name: myTarget___code_review" \
  -d '{
    "jsonrpc": "2.0",
    "id": "get-prompt-request",
    "method": "prompts/get",
    "params": {
      "name": "myTarget___code_review",
      "arguments": {
        "language": "python",
        "code": "print(\"hello\")"
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

def get_prompt(gateway_url, access_token, prompt_name, arguments):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "MCP-Protocol-Version": "2025-11-25"
    }

    payload = {
        "jsonrpc": "2.0",
        "id": "get-prompt-request",
        "method": "prompts/get",
        "params": {
            "name": prompt_name,
            "arguments": arguments
        }
    }

    response = requests.post(gateway_url, headers=headers, json=payload)
    return response.json()

# Example usage
gateway_url = "https://${GatewayEndpoint}/mcp" # Replace with your actual gateway endpoint
access_token = "${AccessToken}" # Replace with your actual access token
result = get_prompt(
    gateway_url,
    access_token,
    "myTarget___code_review",  # Replace with {targetName}___{promptName}
    {"language": "python", "code": "print('hello')"}
)
print(json.dumps(result, indent=2))
```
Python requests package (2026-07-28)
    

On version `2026-07-28`, include the `Mcp-Method` and `Mcp-Name` request-metadata headers and the `_meta` version fields in the body. The `MCP-Protocol-Version` header must match `_meta.io.modelcontextprotocol/protocolVersion`. Your gateway’s `supportedVersions` must include `2026-07-28`.

```python
import requests
import json

def get_prompt(gateway_url, access_token, prompt_name, arguments):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "MCP-Protocol-Version": "2026-07-28",
        "Mcp-Method": "prompts/get",
        "Mcp-Name": prompt_name
    }

    payload = {
        "jsonrpc": "2.0",
        "id": "get-prompt-request",
        "method": "prompts/get",
        "params": {
            "name": prompt_name,
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
result = get_prompt(
    gateway_url,
    access_token,
    "myTarget___code_review",  # Replace with {targetName}___{promptName}
    {"language": "python", "code": "print('hello')"}
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
         prompt_name,
         prompt_arguments,
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

                 # 2. Get specific prompt
                 print(f"Getting prompt: {prompt_name}")
                 prompt_response = await session.get_prompt(
                     name=prompt_name,
                     arguments=prompt_arguments
                 )
                 print(f"Prompt response: {prompt_response}")
                 return prompt_response

     async def main():
         url = "https://${GatewayEndpoint}/mcp"
         token = "your_bearer_token_here"
         prompt_name = "myTarget___code_review"
         prompt_arguments = {
             "language": "python",
             "code": "print('hello')"
         }
         await execute_mcp(
             url=url,
             token=token,
             prompt_name=prompt_name,
             prompt_arguments=prompt_arguments
         )

     if __name__ == "__main__":
         asyncio.run(main())
     ```
LangGraph MCP Client
    

NOTE: LangGraph MCP adapter prompt support might vary. Use the MCP Client approach shown previously for the most reliable `prompts/get` implementation.

```python
import asyncio
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

async def get_prompt(url, token, prompt_name, arguments):
    headers = {"Authorization": f"Bearer {token}"}
    async with streamablehttp_client(url=url, headers=headers) as (
        read_stream, write_stream, callA
    ):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            response = await session.get_prompt(
                name=prompt_name,
                arguments=arguments
            )
            for message in response.messages:
                print(f"{message.role}: {message.content}")

asyncio.run(get_prompt(
    "https://${GatewayEndpoint}/mcp",
    "${AccessToken}",
    "myTarget___code_review",
    {"language": "python", "code": "print('hello')"}
))
```
## Errors

The `prompts/get` operation can return the following types of errors:

  * Errors returned as part of the HTTP status code:

**AuthenticationError**
    

The request failed due to invalid authentication credentials.

**HTTP Status Code** : 401

**AuthorizationError**
    

The caller does not have permission to get the prompt.

**HTTP Status Code** : 403

**ResourceNotFoundError**
    

The specified prompt does not exist.

**HTTP Status Code** : 404

**ValidationError**
    

The provided arguments do not satisfy the prompt’s required arguments.

**HTTP Status Code** : 400

**InternalServerError**
    

An internal server error occurred.

**HTTP Status Code** : 500

  * MCP errors. For more information about these types of errors, see [Prompts](<https://modelcontextprotocol.io/specification/2025-06-18/server/prompts>) in the [Model Context Protocol (MCP)](<https://modelcontextprotocol.io/docs/getting-started/intro>) documentation.



