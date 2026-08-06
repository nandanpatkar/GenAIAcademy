# Core concepts for AgentCore payments - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-concepts.html

---

# Core concepts for AgentCore payments

## Key personas

Personas that interact with AgentCore payments can vary from organization to organization. The following are the general personas found across organizations.

![Key personas for AgentCore payments](/agentcore/images/key-personas.jpg)

  1. **Agent developer** : Agent developers build AI agents that execute microtransaction payments to access paid APIs, MCP servers, and web content. They handle administrative tasks such as configuring spending guardrails, monitoring payment activity, and managing wallet credential policies. They perform one-time control plane setup (creating PaymentManagers and PaymentConnectors) and integrate their agent code with the AgentCore payments SDK or data plane APIs to enable autonomous payment execution.

  2. **End user** : End users interact with the agent to achieve a specific goal. They can top up agent balance through crypto-based stablecoins or traditional payment methods like Credit cards (limited availability due to geographical restrictions), Debit cards, Apple Pay, Google Pay, or ACH so that agents can execute transactions on their behalf, with spending permissions, configurable spending limits, and full transparency into how their funds are used.

  3. **Merchant** : Merchants are API providers, content providers, and service operators who monetize their offerings through pay-per-use models. They set pricing, accept x402 payments, and deliver the requested content or service upon payment confirmation.


## Key concepts

![AgentCore payments core concepts](/agentcore/images/core-concept.jpg)

### PaymentManager

A PaymentManager is the top-level resource you create in your AWS account to coordinate payment operations for your AI agents. Each PaymentManager has a name, an authorizer configuration that controls how agents authenticate to the data plane (`AWS_IAM` or `CUSTOM_JWT`), and an IAM role that the service assumes at runtime. When you create a PaymentManager, AgentCore payments provisions a corresponding workload identity in AgentCore Identity. Each PaymentManager has a unique identifier and ARN, and manages one or more PaymentConnectors as child resources.

How you organize your PaymentManagers depends on your needs. For example, separate PaymentManagers for different agent applications, different environments (production, staging, development), or different teams within your organization.

### PaymentConnector

A PaymentConnector integrates your PaymentManager with an external payment provider. Each connector references a credential provider stored in AgentCore Identity, ensuring that sensitive credentials such as API keys and wallet secrets are never passed directly to the Payments API. Credentials are stored in AWS Secrets Manager through AgentCore Identity and referenced by ARN. A PaymentConnector belongs to exactly one PaymentManager, and a single PaymentManager can have multiple connectors (for example, one for Coinbase and another for Stripe). AgentCore payments supports the following connector types:

  1. **[ CoinbaseCDP](<https://docs.cdp.coinbase.com/wallets/non-custodial-wallets/overview>) ** — Connects to the Coinbase Developer Platform for crypto wallet operations.

  2. **[ StripePrivy](<https://docs.privy.io/wallets/overview/embedded>) ** — Connects to Stripe with Privy wallet infrastructure.


### PaymentSession

A PaymentSession is a scoped payment context that tracks spending for a single agent interaction. Each session has a configurable expiry duration and can optionally include spending limits (`maxSpendAmount`, `currency`) that enforce payment limits. When the session expires or the payment limit is reached, further payment requests within that session are denied. If a payment signing fails after a deduction, the amount is automatically rolled back.

### PaymentInstrument

A PaymentInstrument represents an embedded crypto wallet that an agent uses to pay merchants on behalf of a user. Each instrument is associated with a specific blockchain network and has one of the following statuses: `INITIATED`, `ACTIVE`, `FAILED`, or `DELETED`. Because the same wallet address cannot be used across chains, developers maintain separate instruments for each supported network (for example, Ethereum and Solana). The only supported instrument type is `EMBEDDED_CRYPTO_WALLET`.

### PaymentCredentialProvider

A PaymentCredentialProvider is a specialized credential provider in AgentCore Identity designed for cryptocurrency payment protocols. It securely stores vendor-specific credentials (such as Coinbase CDP API keys and wallet secrets, or Privy app credentials and authorization keys) in AWS Secrets Manager. At runtime, the Payments service retrieves authentication tokens through the AgentCore Identity `GetResourcePaymentToken` data plane API. Each PaymentConnector maintains a 1:1 mapping with a PaymentCredentialProvider.

### x402 protocol

The x402 protocol is an open, HTTP-native payment standard that repurposes the HTTP 402 status code for direct, programmatic payments. When an agent requests a paid resource, the merchant responds with HTTP `402 Payment Required` including a payment payload that specifies the amount, recipient, asset, and network. The agent signs the payment and retries the request with the signed proof in the `X-PAYMENT` header. The merchant verifies the payment and delivers the content.

### Microtransaction

A microtransaction is a small-value payment (often in cents) for an individual API call, tool invocation, or content access. Traditional payment systems have minimum transaction costs, making them inefficient for payments under $0.01. AgentCore payments uses cryptocurrency and stablecoins to enable cost-effective micropayments.

