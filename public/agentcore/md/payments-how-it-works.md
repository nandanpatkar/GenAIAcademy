# How AgentCore payments works - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-how-it-works.html

---

# How AgentCore payments works

Amazon Bedrock AgentCore payments offers payment connection, wallet management, payment limits, payment processing, and payment observability. Using the components and workflows described on this page, you can configure payment providers, connect to external wallet infrastructure, and enable your agents to autonomously pay for APIs, MCP servers, and web content using the x402 protocol.

## PaymentManager

A PaymentManager is the top-level resource that coordinates payment operations for your AWS account. It represents the configuration boundary for how your agents authenticate and interact with external payment providers. When you create a PaymentManager, you specify an authorizer type and an IAM role, and the service provisions a corresponding workload identity in AgentCore Identity. For example, a developer building a research agent that accesses premium data sources would create a single PaymentManager and attach one or more PaymentConnectors to it.

Each PaymentManager:

  * Has a unique identifier and ARN

  * Uses either `AWS_IAM` or `CUSTOM_JWT` authorization for data plane operations

  * Manages one or more PaymentConnectors as child resources


PaymentManager lifecycle states include:

  * `CREATING` — Initial state during provisioning

  * `READY` — Operational and accepting connector configurations

  * `UPDATING` — A configuration change is being applied

  * `CREATE_FAILED` — Provisioning failure

  * `UPDATE_FAILED` — Update operation failure


You create a PaymentManager with the [CreatePaymentManager](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-create-manager.html>) operation. For the complete list of PaymentManager operations, see the [Payments API reference](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreatePaymentManager.html>).

## PaymentConnector

A PaymentConnector integrates your PaymentManager with an external payment provider such as Coinbase or Stripe (Privy). Each connector references a credential provider stored in AgentCore Identity, using existing secure connection and storage for your API keys and secrets.

AgentCore payments supports the following connector types:

  * [CoinbaseCDP](<https://docs.cdp.coinbase.com/embedded-wallets/welcome>) — Connects to the Coinbase Developer Platform for crypto wallet operations.

  * [StripePrivy](<https://docs.privy.io/basics/get-started/organization>) — Connects to Stripe with Privy wallet infrastructure.


Key connector characteristics:

  * Each PaymentConnector belongs to exactly one PaymentManager

  * Credentials are stored in AWS Secrets Manager through AgentCore Identity and referenced by ARN

  * Connectors follow the same lifecycle states as PaymentManagers (`CREATING`, `READY`, `UPDATING`, `CREATE_FAILED`, `UPDATE_FAILED`, `DELETE_FAILED`)


You create a connector with the [CreatePaymentConnector](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-create-manager.html#payments-create-manager-create>) operation. For the complete list of connector operations, see the [Payments API reference](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreatePaymentConnector.html>).

## Credential management

AgentCore payments integrates with [AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity.html>) to securely manage external payment provider credentials. When you create a PaymentConnector, the service references a PaymentCredentialProvider in AgentCore Identity. The PaymentCredentialProvider stores vendor-specific credentials (such as Coinbase CDP API keys and wallet secrets, or Privy app credentials and authorization keys) in AWS Secrets Manager. At runtime, the Payments service retrieves authentication tokens through the `GetResourcePaymentToken` Identity data plane API.

## Payment sessions and instruments

Payment sessions represent individual payment contexts between an agent and an end user. Each session has configurable payment limits (`maxSpendAmount`, `currency`) and an expiry time, providing spending control per interaction. When the session expires or the payment limit is reached, further payment requests within that session are denied.

Payment instruments represent the end user’s payment credentials, such as a crypto wallet address. Each instrument is associated with a specific blockchain network and has an `INITIATED`, `ACTIVE`, `FAILED`, or `DELETED` status.

At runtime, the agent creates a session and instrument, then calls `ProcessPayment` when the agent encounters a paid resource. The service orchestrates the full payment lifecycle (payment limit check, secure connection to wallet, and transaction signing across both x402 v1 and v2) through the configured PaymentConnector.

For more information about data plane operations, see [Processing payments](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-process-payment.html>). For the complete API schemas, see [CreatePaymentSession](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_CreatePaymentSession.html>), [CreatePaymentInstrument](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_CreatePaymentInstrument.html>), and [ProcessPayment](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_ProcessPayment.html>) in the API Reference.

## Authentication and security

AgentCore payments implements authentication and authorization at multiple layers. For more details, refer to [IAM roles and permissions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-iam-roles.html>).

## Funding the wallet (instrument)

A payment instrument, once created, starts with 0 USDC. The agent does not have permissions to transact through the instrument unless the customer explicitly grants them. The following steps describe how to fund the wallet:

### Coinbase

  1. **Launch Coinbase-powered frontend** — Deploy Coinbase’s wallet hub in your service. The [Coinbase AgentCore template on GitHub](<https://github.com/coinbase/cdp-agentcore-template>) provides a template frontend for Agent Developers integrating AWS AgentCore SDK with Coinbase to allow users to login, connect agents, and onramp funds. Alternatively, in the response body of the `CreatePaymentInstrument` API, fetch the redirect URL from `paymentInstrumentDetails.redirectUrl` to access Coinbase WalletHub directly.

  2. **Wallet top-up** — Once the user is logged in to the wallet hub, they can top up their wallet using crypto-to-crypto transfer or through traditional payment methods like Credit cards (limited availability due to geographical restrictions), Debit cards, Apple Pay, Google Pay, or ACH

  3. **Grant permissions to agent** — Within the same wallet hub, the user can grant or revoke permissions to the agent, which allows or denies the agent to operate on the user’s newly created crypto wallet.


### Stripe (Privy)

  1. **Launch Privy-powered frontend** — Deploy Privy’s wallet hub in your service. The [Privy AgentCore SDK on GitHub](<https://github.com/privy-io/aws-agentcore-sdk>) provides a template frontend for Agent Developers integrating AWS AgentCore SDK with Privy to allow users to login, connect agents, and onramp funds.

  2. **Wallet top-up** — Once the user is logged in to the wallet hub, they can top up their wallet using crypto-to-crypto transfer or through traditional payment methods like Credit cards (limited availability due to geographical restrictions), Debit cards, Apple Pay, Google Pay, or ACH

  3. **Grant permissions to agent** — Within the same wallet hub, the user can grant permissions to the agent, which allows the agent to operate on the user’s newly created crypto wallet.


## Connecting to paid APIs, MCP servers, and content

[AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway.html>) lets you connect to paid MCP servers and API endpoints, ensuring your agents have secure access to them. You can also use the pre-existing integration of [Coinbase x402 Bazaar](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-integrations.html#gateway-target-integrations-supported-apis-coinbase-bazaar>) through AgentCore Gateway to discover thousands of existing paid MCP tools.

[AgentCore Browser](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-tool.html>) enables agents to autonomously access paywalled websites that support x402, securely through the AgentCore Browser and payments combination.

## Payment flow

The following steps describe the runtime flow when an agent accesses a paid resource using the x402 protocol.

  1. **Tool invocation** — The agent invokes a paid tool or endpoint (for example, `GET /premium-data`) either through AgentCore Gateway or by direct invocation.

  2. **Payment required** — The merchant responds with HTTP `402 Payment Required`, including a payment payload that specifies the amount, recipient, asset, and network.

  3. **Payment limit check** — AgentCore payments checks the active session’s spending against the configured limits. If the transaction would exceed the limits, the request is denied.

  4. **Payment signing** — AgentCore payments retrieves wallet credentials from AgentCore Identity, constructs the payment proof, and signs the transaction through the configured external partner.

  5. **Retry with payment** — The agent retries the original request with the signed payment payload in the `X-PAYMENT` header.

  6. **Verification and settlement** — The merchant verifies the payment proof and settles the transaction on-chain. Upon successful verification, the merchant returns the requested content.

  7. **State update** — AgentCore payments commits the transaction and updates the session spending ledger. If any step fails, the payment limit reservation is released and the transaction is recorded as `FAILED`.


## Observability

[AgentCore Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability.html>) provides visibility across the entire payment lifecycle, delivering detailed logs, real-time dashboards, and actionable metrics that enable developers to monitor transaction success rates, track spending patterns, diagnose errors, and optimize payment performance.

