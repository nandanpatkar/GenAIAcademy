# Create an agent that uses your AgentCore gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-agent-integration.html

---

# Create an agent that uses your AgentCore gateway

After creating and testing your gateway, you can create and connect AI agents to your gateway. An agent connected to your gateway is able to call the tools in the gateway and use a [Amazon Bedrock model](<https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html>) to respond to queries.

To learn how to create an agent, connect it to a gateway, and invoke it to answer queries, select one of the following methods:

###### Example

Strands
    

  1. 
```python
from strands import Agent
from strands.models import BedrockModel
from strands.tools.mcp.mcp_client import MCPClient
from mcp.client.streamable_http import streamablehttp_client

def _invoke_agent(
    bedrock_model,
    mcp_client,
    prompt
):
    with mcp_client:
        tools = mcp_client.list_tools_sync()
        agent = Agent(
            model=bedrock_model,
            tools=tools
        )
        return agent(prompt)

def _create_streamable_http_transport(headers=None):
    url = {gatewayUrl}
    access_token = {AccessToken}
    headers = {**headers} if headers else {}
    headers["Authorization"] = f"Bearer {access_token}"
    return streamablehttp_client(
        url,
        headers=headers
    )

def _get_bedrock_model(model_id):
    return BedrockModel(
        inference_profile_id=model_id,
        temperature=0.0,
        streaming=True,
   )

mcp_client = MCPClient(_create_streamable_http_transport)

if __name__ == "__main__":
    user_prompt = "What orders do I have?"
    _response = _invoke_agent(
        bedrock_model=_get_bedrock_model("us.anthropic.claude-sonnet-4-20250514-v1:0"),
        mcp_client=mcp_client,
        prompt=user_prompt
    )
    print(_response)
```
 


LangGraph
    

  1. 
```python
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

from langgraph.prebuilt import create_react_agent
from langchain_mcp_adapters.tools import load_mcp_tools

# Replace with actual values and the Amazon Bedrock model of your choice
gateway_url = "${GatewayUrl}"
access_token = "${AccessToken}"
model = ChatBedrock(model_id="anthropic.claude-3-sonnet-20240229-v1:0", region_name="us-west-2")

async with streamablehttp_client(gateway_url, headers={"Authorization": f"Bearer {access_token}"}) as (read, write, _):
    async with ClientSession(read, write) as session:
        # Initialize the connection
        await session.initialize()

        # Get tools
        tools = await load_mcp_tools(session)
        agent = create_react_agent(model, tools)
        math_response = await agent.ainvoke({"messages": "what's (3 + 5) x 12?"})
```
 


Claude Code
    

  1. 
```text
#!/bin/bash
# Script to add MCP server to Claude

# Server configuration
SERVER_NAME=${ServerName} # Write your server name
GATEWAY_MCP_SERVER_URL=${GatewayUrl} # The gateway MCP URL
AUTH_TOKEN=${AuthToken} # Claude authentication token

echo "Adding MCP server to Claude..."
echo "Server Name: $SERVER_NAME"
echo "Server URL: $SERVER_URL"
echo ""

# Add the MCP server
claude mcp add "$SERVER_NAME" "$GATEWAY_MCP_SERVER_URL" \
  --transport http \
  --header "Authorization: Bearer $AUTH_TOKEN"

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "MCP server added successfully!"
    echo ""
    echo "You can now check mcp server health with: claude mcp list"
else
    echo "Failed to add MCP server"
    exit 1
fi
```
 



