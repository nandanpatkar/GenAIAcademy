# Process a payment - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-process-payment.html

---

# Process a payment

To process a payment, you need two resources:

  * **Payment instrument** — An embedded crypto wallet with Coinbase or Stripe. See [Create a payment instrument](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-create-instrument.html>).

  * **Payment session** — A time-bounded session that optionally enforces a spending budget. See [Create a payment session](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-create-session.html>).


Once both exist, call `ProcessPayment` with the payment session ID, payment instrument ID, and an x402 payment payload. The service validates the request, checks the budget, signs the transaction on the appropriate blockchain, and returns a cryptographic proof. For the complete request and response schema, see [ProcessPayment](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_ProcessPayment.html>) in the API Reference.

###### Tip

You can automate the steps on this page with the AgentCore Payments skill in the AWS agent toolkit. The skill is part of the **aws-agents** plugin and lets an AI coding agent create your Payment Manager, connector, credential provider, payment instrument, and session using the `agentcore` CLI, and add an x402 payment tool to your agent. For details, see the [quickstart](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-getting-started.html>) and the [AWS agent toolkit on GitHub](<https://github.com/aws/agent-toolkit-for-aws/tree/main>).

There are five ways to invoke the ProcessPayment API:

###### Example

AgentCore CLI
    

If your agent is deployed with payment capabilities configured, invoke it with payment context and the x402 interceptor handles payment processing automatically:

```bash
agentcore invoke \
  --prompt "Access the premium endpoint at https://example-x402-merchant.com/paid-api" \
  --payment-instrument-id <INSTRUMENT_ID> \
  --auto-session \
  --payment-user-id user@example.com
```
To use an explicit session instead of auto-creating one:

```bash
agentcore invoke \
  --prompt "Access the premium endpoint at https://example-x402-merchant.com/paid-api" \
  --payment-instrument-id <INSTRUMENT_ID> \
  --payment-session-id <SESSION_ID> \
  --payment-user-id user@example.com
```
The deployed agent’s x402 plugin intercepts HTTP 402 responses, calls `ProcessPayment`, and retries the request with proof. Requires AgentCore CLI v0.19.0 or later.

AgentCore SDK
    

Use the `PaymentManager` class to generate payment headers manually within any agent framework:

```python
import uuid
from bedrock_agentcore.payments import PaymentManager

manager = PaymentManager(
    payment_manager_arn=mgr["paymentManagerArn"],
    region_name="us-west-2"
)

# When you receive a 402 response, generate payment proof
payment_required_request = {
    "statusCode": 402,
    "headers": payment_required["headers"],
    "body": payment_required["body"],
}
payment_proof_headers = manager.generate_payment_header(
    user_id="test-user-123",
    payment_instrument_id=instrument["paymentInstrumentId"],
    payment_session_id=session["paymentSessionId"],
    payment_required_request=payment_required_request,
    client_token=str(uuid.uuid4()),
)
```
`payment_proof_headers` contains the payment proof header. Include this header when retrying the request to the paid endpoint. You can also call the `process_payment` method of `PaymentManager` for more control over inputs.

AWS CLI
     ```bash
     aws bedrock-agentcore process-payment \
         --payment-manager-arn "arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/my-manager" \
         --payment-session-id "payment-session-abc123" \
         --payment-instrument-id "payment-instrument-xyz789" \
         --payment-type "CRYPTO_X402" \
         --payment-input '{
             "cryptoX402": {
                 "version": "2",
                 "payload": {
                     "scheme": "exact",
                     "network": "eip155:84532",
                     "amount": "100000",
                     "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
                     "payTo": "0x99935f281d3ED1E804bF1413b76E0B03e1fed4F9",
                     "maxTimeoutSeconds": 300,
                     "extra": {"name": "USDC", "version": "2"}
                 }
             }
         }' \
         --client-token "$(uuidgen)" \
         --region us-west-2
     ```
AWS SDK
    

Call `process_payment` directly with the full x402 payload:

```python
import uuid

payment = dp_client.process_payment(
    userId="test-user-123",
    paymentManagerArn=PAYMENT_MANAGER_ARN,
    paymentSessionId=SESSION_ID,
    paymentInstrumentId=INSTRUMENT_ID,
    paymentType="CRYPTO_X402",
    paymentInput={
        "cryptoX402": {
            "version": "2",
            "payload": {
                "scheme": "exact",
                "network": "eip155:84532",
                "amount": "100000",
                "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
                "payTo": "0x99935f281d3ED1E804bF1413b76E0B03e1fed4F9",
                "maxTimeoutSeconds": 300,
                "extra": {"name": "USDC", "version": "2"},
            },
        }
    },
    clientToken=str(uuid.uuid4()),
)
```
Response:

```json
{
    "processPaymentId": "12345678-1234-1234-1234-123456789012",
    "paymentManagerArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:payment-manager/my-manager-a1b2c3d4e5",
    "paymentSessionId": "payment-session-abc123def4567",
    "paymentInstrumentId": "payment-instrument-xyz789abc1234",
    "paymentType": "CRYPTO_X402",
    "status": "PROOF_GENERATED",
    "paymentOutput": {
        "cryptoX402": {
            "version": "2",
            "payload": {
                "...signed transaction proof..."
            }
        }
    },
    "createdAt": "2025-07-15T10:35:00Z",
    "updatedAt": "2025-07-15T10:35:02Z"
}
```
A `status` of `PROOF_GENERATED` indicates the transaction was signed and the cryptographic proof is included in `paymentOutput`.

Strands SDK
    

The AgentCore payments plugin provides automated payment processing for Strands Agents. It supports the [x402 Payment Required](<https://www.x402.org/>) protocol, enabling agents to automatically handle HTTP 402 responses.

**Installation:**

```bash
pip install 'bedrock-agentcore[strands-agents]'
```
**Configure and use the plugin:**

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
The AgentCore payments plugin intercepts x402 payment requests automatically, processes the payment, and retries the request with payment proof for the agent.

LangGraph
    

The AgentCore payments middleware provides automated payment processing for LangGraph agents. It supports the [x402 Payment Required](<https://www.x402.org/>) protocol, enabling agents to automatically handle HTTP 402 responses.

**Installation:**

```bash
pip install 'bedrock-agentcore[langgraph]'
```
**Configure and use the middleware:**

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
The AgentCore payments middleware intercepts x402 payment requests automatically, processes the payment, and retries the request with payment proof for the agent.

## Framework integrations

For full reference documentation including error handling, configuration options, and built-in tools, see [Framework integrations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-framework-integrations.html>).

Framework | Integration type | Reference  
---|---|---  
[Strands Agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-framework-integrations.html#payments-framework-strands>) |  Plugin (hook-based) |  Interrupt handling, config options, built-in tools  
[LangGraph](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-framework-integrations.html#payments-framework-langgraph>) |  Middleware (wraps tool calls) |  Error callbacks, allowlists, async support, config options

