# Framework integrations for AgentCore payments - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-framework-integrations.html

---

# Framework integrations for AgentCore payments  
  
AgentCore payments integrates with popular agent frameworks to provide automated payment processing. Each framework uses a different integration pattern:

  * **Strands Agents ** — Plugin-based integration using hooks

  * **LangGraph ** — Middleware-based integration that wraps tool calls


## Strands Agents

The AgentCore payments plugin provides automated payment processing for Strands Agents. It supports the [x402 Payment Required](<https://www.x402.org/>) protocol, enabling agents to automatically handle HTTP 402 responses.

### Installation

```bash
pip install 'bedrock-agentcore[strands-agents]'
```
### Configure and use the plugin

```python
from strands import Agent
from strands_tools import http_request
from bedrock_agentcore.payments.integrations.config import AgentCorePaymentsPluginConfig
from bedrock_agentcore.payments.integrations.strands.plugin import AgentCorePaymentsPlugin

# Configure the plugin
config = AgentCorePaymentsPluginConfig(
    payment_manager_arn="arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/pm-abc123",
    user_id="test-user-123",
    payment_instrument_id="payment-instrument-XJU4RSQP9VO0ler",
    payment_session_id="payment-session-xuzrnUCd7RT725G",
    region="us-west-2",
)

# Create the plugin
plugin = AgentCorePaymentsPlugin(config=config)

# Create agent with the plugin
agent = Agent(
    system_prompt="You are a helpful assistant that can access paid APIs.",
    tools=[http_request],
    plugins=[plugin],
)

# Use the agent -- 402 responses are automatically handled
agent("access https://drvd12nxpcyd5.cloudfront.net/market-recap")
```
### Handling payment interrupts

When payment processing fails, the plugin stores the failure and raises an interrupt. Your application should handle these interrupts:

```text
result = agent("Access the premium endpoint at https://api.example.com/premium")
while result.stop_reason == "interrupt":
    responses = []
    for interrupt in result.interrupts:
        if interrupt.name.startswith("payment-failure-"):
            reason = interrupt.reason
            exception_type = reason.get("exceptionType")

            if exception_type == "PaymentInstrumentConfigurationRequired":
                plugin.config.update_payment_instrument_id("payment-instrument-new123")
                responses.append({
                    "interruptResponse": {
                        "interruptId": interrupt.id,
                        "response": "Payment instrument configured. Please retry.",
                    }
                })
            elif exception_type == "PaymentSessionConfigurationRequired":
                plugin.config.update_payment_session_id("payment-session-new456")
                responses.append({
                    "interruptResponse": {
                        "interruptId": interrupt.id,
                        "response": "Payment session configured. Please retry.",
                    }
                })
            else:
                responses.append({
                    "interruptResponse": {
                        "interruptId": interrupt.id,
                        "response": f"Payment failed: {reason.get('exceptionMessage')}",
                    }
                })

    result = agent(responses)
```
### Disabling auto-payment

To access only payment visibility tools without automatic payment execution (for example, to keep a human or custom logic in the loop before any payment transaction), disable automatic processing:

```text
config = AgentCorePaymentsPluginConfig(
    payment_manager_arn="arn:aws:bedrock-agentcore:us-east-1:123456789012:payment-manager/pm-abc123",
    user_id="user-123",
    region="us-east-1",
    auto_payment=False,  # Disable automatic 402 processing
)
```
### Network preferences

You can specify preferred blockchain networks for payment processing:

```text
config = AgentCorePaymentsPluginConfig(
    payment_manager_arn="arn:aws:bedrock-agentcore:us-east-1:123456789012:payment-manager/pm-abc123",
    user_id="user-123",
    payment_instrument_id="payment-instrument-xyz789",
    payment_session_id="payment-session-def456",
    region="us-east-1",
    network_preferences_config=["eip155:8453", "base-sepolia", "solana-mainnet"],
)
```
If not specified, the system uses a default preference order prioritizing Solana mainnet and Base (Ethereum L2) for low transaction fees.

### Configuration options

The following table lists the `AgentCorePaymentsPluginConfig` parameters:

Parameter | Type | Required | Description  
---|---|---|---  
`payment_manager_arn` |  `str` |  Yes |  ARN of the Bedrock AgentCore Payment Manager resource  
`user_id` |  `str` |  Yes |  Unique identifier for the user  
`payment_instrument_id` |  `Optional[str]` |  No |  Payment instrument ID. Can be set later via `update_payment_instrument_id()`  
`payment_session_id` |  `Optional[str]` |  No |  Payment session ID. Can be set later via `update_payment_session_id()`  
`region` |  `Optional[str]` |  No |  AWS region for the payment manager  
`network_preferences_config` |  `Optional[list[str]]` |  No |  List of network CAIP-2 identifiers in order of preference  
`auto_payment` |  `bool` |  No (default: `True`) |  Whether to automatically process 402 payment requirements  
`max_interrupt_retries` |  `int` |  No (default: `5`) |  Maximum interrupt retries per tool use. Set to 0 to disable interrupts  
`agent_name` |  `Optional[str]` |  No |  Agent name propagated via HTTP header on API calls  
  
### Built-in agent tools

The plugin registers three tools that agents can use to query payment information at runtime:

Tool | Description  
---|---  
`get_payment_instrument` |  Retrieve details about a specific payment instrument  
`list_payment_instruments` |  List all payment instruments for a user  
`get_payment_session` |  Retrieve details about a payment session (budget, status, expiry)  
  
These tools enable agents to make informed decisions about payment methods and payment limits during conversations. For more details and end-to-end examples, refer to the [Strands Agents](<https://strandsagents.com/latest/>) documentation.

## LangGraph

The AgentCore payments middleware provides automated payment processing for LangGraph agents. It supports the [x402 Payment Required](<https://www.x402.org/>) protocol, enabling agents to automatically handle HTTP 402 responses.

### Installation

```bash
pip install 'bedrock-agentcore[langgraph]'
```
### Configure and use the middleware

```python
from langchain.agents import create_agent
from bedrock_agentcore.payments.integrations.langgraph import (
    AgentCorePaymentsConfig,
    AgentCorePaymentsMiddleware,
)

config = AgentCorePaymentsConfig(
    payment_manager_arn="arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/pm-abc123",
    user_id="test-user-123",
    payment_instrument_id="payment-instrument-XJU4RSQP9VO0ler",
    region="us-west-2",
    auto_session=True,
)

payments = AgentCorePaymentsMiddleware(config)

agent = create_agent(
    model="us.anthropic.claude-sonnet-4-20250514-v1:0",
    tools=[],
    middleware=[payments],
)

result = agent.invoke({"messages": [{"role": "user", "content": "access https://drvd12nxpcyd5.cloudfront.net/market-recap"}]})
print(result)
```
### How the middleware works

The middleware intercepts tool calls and handles the x402 payment flow in six steps:

  1. The agent makes a tool call that results in an HTTP request to a paid endpoint.

  2. The endpoint responds with HTTP 402 Payment Required and an x402 payment payload.

  3. The middleware intercepts the 402 response and extracts the payment requirements.

  4. The middleware calls `ProcessPayment` with the payment instrument and session to generate cryptographic proof.

  5. The middleware retries the original request with the payment proof header attached.

  6. The endpoint validates the proof and returns the requested content to the agent.


### Error handling with callbacks

Use the `on_payment_error` callback to handle payment failures gracefully:

```python
from bedrock_agentcore.payments.integrations.langgraph import (
    AgentCorePaymentsConfig,
    AgentCorePaymentsMiddleware,
    ErrorResolution,
)

def handle_payment_error(error, context):
    """Custom error handler for payment failures."""
    if "InsufficientFunds" in str(error):
        return ErrorResolution.STOP  # Stop the agent
    return ErrorResolution.RETRY  # Retry with updated config

config = AgentCorePaymentsConfig(
    payment_manager_arn="arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/pm-abc123",
    user_id="test-user-123",
    payment_instrument_id="payment-instrument-XJU4RSQP9VO0ler",
    region="us-west-2",
    auto_session=True,
    on_payment_error=handle_payment_error,
)
```
The `ErrorResolution` enum provides the following options:

Value | Behavior  
---|---  
`RETRY` |  Retry the payment with the current configuration  
`STOP` |  Stop processing and return the error to the agent  
`SKIP` |  Skip the payment and continue without the paid content  
  
### Disabling auto-payment

To disable automatic payment processing and require explicit payment approval:

```text
config = AgentCorePaymentsConfig(
    payment_manager_arn="arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/pm-abc123",
    user_id="test-user-123",
    region="us-west-2",
    auto_payment=False,  # Disable automatic 402 processing
)
```
When `auto_payment` is `False`, the middleware surfaces 402 responses to the agent without processing them, allowing custom logic or human approval before payment.

### Payment tool allowlist

Restrict which tools can trigger automatic payments:

```text
config = AgentCorePaymentsConfig(
    payment_manager_arn="arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/pm-abc123",
    user_id="test-user-123",
    payment_instrument_id="payment-instrument-XJU4RSQP9VO0ler",
    region="us-west-2",
    auto_session=True,
    tool_allowlist=["http_request", "web_fetch", "mcp_call"],
)
```
Only tool calls from tools in the allowlist trigger automatic payment processing. Tool calls from other tools pass through without payment interception.

### Network preferences

You can specify preferred blockchain networks for payment processing:

```text
config = AgentCorePaymentsConfig(
    payment_manager_arn="arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/pm-abc123",
    user_id="test-user-123",
    payment_instrument_id="payment-instrument-XJU4RSQP9VO0ler",
    region="us-west-2",
    auto_session=True,
    network_preferences_config=["eip155:8453", "base-sepolia", "solana-mainnet"],
)
```
If not specified, the system uses a default preference order prioritizing Solana mainnet and Base (Ethereum L2) for low transaction fees.

### Configuration options

The following table lists the `AgentCorePaymentsConfig` parameters:

Parameter | Type | Required | Description  
---|---|---|---  
`payment_manager_arn` |  `str` |  Yes |  ARN of the Bedrock AgentCore Payment Manager resource  
`user_id` |  `str` |  Yes |  Unique identifier for the user  
`payment_instrument_id` |  `Optional[str]` |  No |  Payment instrument ID  
`payment_session_id` |  `Optional[str]` |  No |  Payment session ID. Not required when `auto_session` is `True`  
`region` |  `Optional[str]` |  No |  AWS region for the payment manager  
`auto_session` |  `bool` |  No (default: `False`) |  Automatically create or reuse a payment session  
`auto_session_expiry_minutes` |  `int` |  No (default: `60`) |  Expiry time for auto-created sessions in minutes  
`auto_session_max_spend` |  `str` |  No (default: `"5.00"`) |  Maximum spend amount for auto-created sessions  
`auto_session_currency` |  `str` |  No (default: `"USD"`) |  Currency for auto-created session spend limits  
`auto_payment` |  `bool` |  No (default: `True`) |  Whether to automatically process 402 payment requirements  
`network_preferences_config` |  `Optional[list[str]]` |  No |  List of network CAIP-2 identifiers in order of preference  
`tool_allowlist` |  `Optional[list[str]]` |  No |  List of tool names that can trigger automatic payments. If not set, all tools can trigger payments  
`max_retries` |  `int` |  No (default: `3`) |  Maximum number of payment retries per tool call  
`on_payment_error` |  `Optional[Callable]` |  No |  Callback function invoked on payment failure  
`on_payment_success` |  `Optional[Callable]` |  No |  Callback function invoked on successful payment  
`on_payment_start` |  `Optional[Callable]` |  No |  Callback function invoked before payment processing begins  
`agent_name` |  `Optional[str]` |  No |  Agent name propagated via HTTP header on API calls  
`endpoint_url` |  `Optional[str]` |  No |  Custom endpoint URL for the AgentCore payments service  
  
### Built-in agent tools

The middleware registers five tools that agents can use to query and manage payment information at runtime:

Tool | Description  
---|---  
`get_payment_instrument` |  Retrieve details about a specific payment instrument  
`list_payment_instruments` |  List all payment instruments for a user  
`get_payment_session` |  Retrieve details about a payment session (budget, status, expiry)  
`get_payment_balance` |  Retrieve the current balance of a payment instrument  
`list_payment_sessions` |  List all payment sessions for a user  
  
### Sync vs async

The LangGraph middleware supports both synchronous and asynchronous execution:

**Synchronous:**

```text
result = agent.invoke({"messages": [{"role": "user", "content": "access the paid endpoint"}]})
```
**Asynchronous:**

```text
result = await agent.ainvoke({"messages": [{"role": "user", "content": "access the paid endpoint"}]})
```
Both modes support the same configuration options and payment processing behavior. Use async when integrating with async frameworks or when handling multiple concurrent agents.

