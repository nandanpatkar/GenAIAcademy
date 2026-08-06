# Use an AgentCore Gateway with Policy in AgentCore - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/use-gateway-with-policy.html

---

# Use an AgentCore Gateway with Policy in AgentCore

Follow the gateway authorization and authentication guide to obtain the credentials needed for gateway access.

###### MCP tools only

Policy evaluation applies only to MCP tools. Regardless of the policy evaluation mode, the gateway always allows MCP prompts (`prompts/list`, `prompts/get`) and resources (`resources/list`, `resources/read`, `resources/templates/list`).

###### Topics

  * List AgentCore Gateway Tools with Policy in AgentCore

  * Call gateway tools with policy

  * Policy responses


## List AgentCore Gateway Tools with Policy in AgentCore

Tool listing is treated as a **meta action** . When a principal lists available tools, the policy engine does not evaluate the full context of a specific tool invocation (for example, input parameters).

A principal is only allowed to see tools in the listing that they would be permitted to call by policy. Because the full context of a tool call is not available during listing, this means a principal is allowed to list a tool **if there exists any set of circumstances under which a call to that tool would be permitted**.

As a result, a tool appearing in the list does not guarantee that a subsequent call to that tool will be authorized. The authorization decision for an actual tool invocation is evaluated separately using the full request context, including input parameters.

Select one of the following methods:

###### Example

curl
    

  1. 
```bash
curl -X POST \
  https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "id": "list-tools-request",
    "method": "tools/list"
  }'
```
 


Python requests package
    

  1. 
```python
import requests
import json

def list_tools(gateway_url, access_token):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    payload = {
        "jsonrpc": "2.0",
        "id": "list-tools-request",
        "method": "tools/list"
    }

    response = requests.post(gateway_url, headers=headers, json=payload)
    return response.json()

# Example usage
gateway_url = "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp"
access_token = "YOUR_ACCESS_TOKEN"
tools = list_tools(gateway_url, access_token)
print(json.dumps(tools, indent=2))
```
 

The response returns only the tools that your policies allow you to see. Tools that are denied by policies will not appear in the list.


## Call gateway tools with policy

Make tool calls to your gateway. Policy evaluation determines whether the call is allowed or denied.

Select one of the following methods:

###### Example

curl
    

  1. 
```bash
# Call a tool to test policy enforcement
curl -X POST \
  https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-policy",
    "method": "tools/call",
    "params": {
      "name": "tool_name",
      "arguments": {arguments}
    }
  }'
```
 


Python requests package
    

  1. 
```python
import requests
import json

def call_gateway_tool(gateway_url, access_token, tool_name, arguments):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    payload = {
        "jsonrpc": "2.0",
        "id": "test-policy",
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": arguments
        }
    }

    response = requests.post(gateway_url, headers=headers, json=payload)
    return response.json()

# Example usage
gateway_url = "https://mygateway-abcdefghij.gateway.bedrock-agentcore.us-west-2.amazonaws.com/mcp"
access_token = "YOUR_ACCESS_TOKEN"
result = call_gateway_tool(
    gateway_url,
    access_token,
    "RefundTool___process_refund",
    {
        "orderId": "12345",
        "amount": 450,
        "reason": "Defective product"
    }
)
print(json.dumps(result, indent=2))
```
 


## Policy responses

When a policy allows the request:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "isError": false,
    "content": [
      {
        "type": "text",
        "text": "ToolResult"
      }
    ]
  }
}
```
When a policy denies the request:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "AuthorizeActionException - Tool Execution Denied: Tool call not allowed due to policy enforcement [No policy applies to the request (denied by default).]"
      }
    ],
    "isError": true
  }
}
```
