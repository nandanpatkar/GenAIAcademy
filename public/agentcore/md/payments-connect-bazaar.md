# Coinbase Bazaar via AgentCore Gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-connect-bazaar.html

---

# Coinbase Bazaar via AgentCore Gateway

AgentCore Gateway lets you connect to paid MCP servers and API endpoints. You can add the Coinbase x402 Bazaar MCP server as a target in a Gateway to discover 10,000+ existing paid MCP tools that support x402 microtransactions.

  * Server URL — `https://api.cdp.coinbase.com/platform/v2/x402/discovery/mcp`

  * Outbound authentication types accepted — No Authorization (default)


## Add Coinbase x402 Bazaar MCP server to a Gateway

###### Example

Console
    

  1. Navigate to the **Target** section.

  2. (Optional) Change the generated **Target name**.

  3. (Optional) Provide a **Target description**.

  4. For **Target type** , choose **Integrations**.

  5. Select **Coinbase x402 Bazaar**.

  6. Skip **Outbound Auth configurations**. "No Authorization" is the only supported option and is selected by default.


AgentCore CLI
     ```bash
     agentcore add gateway-target \
       --name CoinbaseTarget \
       --type mcp-server \
       --endpoint https://api.cdp.coinbase.com/platform/v2/x402/discovery/mcp \
       --gateway MyGateway

     agentcore deploy
     ```
AWS SDK
     ```python
     import boto3

     agentcore_client = boto3.client('bedrock-agentcore-control')

     target = agentcore_client.create_gateway_target(
         gatewayIdentifier="your-gateway-id",
         name="Coinbasex402BazaarTarget",
         description="Coinbase x402 Bazaar MCP server for paid API discovery",
         targetConfiguration={
             "mcp": {
                 "mcpServer": {
                     "endpoint": "https://api.cdp.coinbase.com/platform/v2/x402/discovery/mcp"
                 }
             }
         }
     )
     ```
Strands SDK
    

Use the Coinbase x402 Bazaar Gateway Target with your agent:

```python
from strands import Agent
from strands.models import BedrockModel
from strands.tools.mcp.mcp_client import MCPClient
from mcp.client.streamable_http import streamablehttp_client
from bedrock_agentcore.payments.integrations.config import AgentCorePaymentsPluginConfig
from bedrock_agentcore.payments.integrations.strands.plugin import AgentCorePaymentsPlugin

GATEWAY_URL = "https://<your-gateway-id>.gateway.bedrock-agentcore.<region>.amazonaws.com/mcp"
ACCESS_TOKEN = "<your-inbound-auth-token>"

mcp_client = MCPClient(
    lambda: streamablehttp_client(GATEWAY_URL, headers={"Authorization": f"Bearer {ACCESS_TOKEN}"})
)

# Configure the Payment plugin
config = AgentCorePaymentsPluginConfig(
    payment_manager_arn="arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/pm-abc123",
    user_id="test-user-123",
    payment_instrument_id="payment-instrument-XJU4RSQP9VO0ler",
    payment_session_id="payment-session-xuzrnUCd7RT725G",
    region="us-west-2",
)

# Create the plugin
plugin = AgentCorePaymentsPlugin(config=config)

with mcp_client:
    tools = mcp_client.list_tools_sync()
    agent = Agent(
        model=BedrockModel(inference_profile_id="us.anthropic.claude-sonnet-4-20250514-v1:0", streaming=True),
        tools=tools,
        plugins=[plugin],  # enables automatic payments
    )
    response = agent("Search for available x402 paid APIs related to weather data")
    print(response)
```
LangGraph
    

Use the Coinbase x402 Bazaar Gateway Target with your LangGraph agent:

```python
import asyncio
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langchain_mcp_adapters.client import MultiServerMCPClient
from bedrock_agentcore.payments.integrations.langgraph import (
    AgentCorePaymentsConfig,
    AgentCorePaymentsMiddleware,
)

GATEWAY_URL = "https://<your-gateway-id>.gateway.bedrock-agentcore.<region>.amazonaws.com/mcp"
ACCESS_TOKEN = "<your-inbound-auth-token>"

async def main():
    client = MultiServerMCPClient({
        "bazaar": {
            "transport": "streamable_http",
            "url": GATEWAY_URL,
            "headers": {"Authorization": f"Bearer {ACCESS_TOKEN}"},
        }
    })
    mcp_tools = await client.get_tools()

    config = AgentCorePaymentsConfig(
        payment_manager_arn="arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/pm-abc123",
        user_id="test-user-123",
        payment_instrument_id="payment-instrument-XJU4RSQP9VO0ler",
        region="us-west-2",
        auto_session=True,
    )

    payments = AgentCorePaymentsMiddleware(config)

    agent = create_agent(
        model=ChatOpenAI(model="gpt-4o-mini"),
        tools=mcp_tools,
        middleware=[payments],
    )

    result = await agent.ainvoke(
        {"messages": [{"role": "user", "content": "Search for available x402 paid APIs related to weather data"}]}
    )
    print(result["messages"][-1].content)

asyncio.run(main())
```
Once the Bazaar target is configured, your agents can discover and call paid x402 endpoints through the Gateway. When an endpoint returns HTTP 402, AgentCore payments handles the payment flow automatically if you have configured a payments plugin (Strands) or middleware (LangGraph) in your agent. To learn more, see [Framework integrations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-framework-integrations.html>).

To set up the Payment Manager and Connector required for processing payments, see [Create a Payment Manager and Connector](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-create-manager.html>).

