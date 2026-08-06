# Amazon Bedrock AgentCore payments: Enable secure microtransaction payments for AI agents - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments.html

---

# Amazon Bedrock AgentCore payments: Enable secure microtransaction payments for AI agents

## What is AWS Amazon Bedrock AgentCore payments?

Amazon Bedrock AgentCore payments is a fully managed service that enables microtransaction payments in AI agents to access paid APIs, MCP servers, and content. AI agents increasingly handle complex tasks by calling APIs, accessing MCP servers, and interacting with other agents. As more services monetize through pay-per-use models, developers face challenges integrating payments into agentic workflows. Transactions are typically microtransactions (often under $1 or fractions of a cent), making traditional payment methods cost-prohibitive due to high minimum transaction fees. Meanwhile, content providers and publishers are introducing paywalls for AI agents to access their content. AgentCore payments provides a suite of developer-friendly capabilities that help you develop solutions to enable secure, instant payments to paid services using stablecoin, open protocols like x402 for cost-effective microtransactions, and configurable guardrails to help control agent spending. This can reduce developer effort from months to days.

###### Note

AgentCore payments is currently available as a preview. Features and APIs may change before general availability.

## What customer problem does it solve?

Amazon Bedrock AgentCore payments addresses challenges that agent developers face when integrating payment capabilities into their AI agents. Traditionally, developers must establish and manage separate billing relationships with each external service provider their agents need to access, creating operational overhead and complexity. The economics of agent-to-merchant transactions present a fundamental challenge: individual API calls or content requests often have values measured in cents, yet traditional payment methods like credit cards (limited availability due to geographical restrictions) impose minimum transaction fees, making microtransactions economically unviable.

Beyond the cost structure, developers can face months of engineering effort to integrate third-party wallets, build payment orchestration systems, implement support for emerging agentic protocols, handle edge cases, and establish end-to-end observability across payment flows. Because AI agents operate autonomously, developers typically build governance frameworks and budget controls from scratch to prevent runaway spending, while supporting compliance with payment regulations and maintaining security standards, which can be complex. These requirements become increasingly complex in a payments context. AgentCore payments addresses these challenges by providing a fully managed, purpose-built service that enables developers to add payment capabilities to their agents with a few lines of code.

## Use cases

Amazon Bedrock AgentCore payments supports use cases where AI agents require dynamic, pay-per-use access to premium resources and services.

  * **Research** — Research agents can operate with allocated budgets, intelligently selecting and purchasing access to specialized paid data sources on demand to deliver insights while staying within cost constraints.

  * **Financial analysis** — Financial analysts can use agents to pay for access to real-time market data behind paywalls (such as proprietary financial databases and trading platforms) to perform analysis and inform investment decisions.

  * **Browser agents** — Browser-based UI or browser agents can navigate and extract content from websites that monetize or restrict bot access, enabling automated research, data collection, and task completion at scale.

  * **Pay-per-intelligence** — Agents can dynamically route tasks to the optimal AI model, paying only for actual token usage rather than maintaining subscriptions across multiple model providers.

  * **On-demand storage** — Agents can provision temporary storage resources on demand with granular pay-per-use pricing, helping to reduce the need for pre-allocated capacity and reducing waste.


These capabilities enable autonomous workflows that were previously impractical due to payment friction, while giving developers more control over costs and resource allocation.

## Key features

Amazon Bedrock AgentCore payments provides the following capabilities to simplify and secure payment operations for AI agents.

  * **Orchestrating Payments** — The service orchestrates payments using the x402 protocol, an open HTTP-native standard that uses the HTTP 402 Payment Required status code for programmatic payments. AgentCore payments help manage the complete lifecycle on the agent side, from receiving the merchant’s payment request, through transaction signing via the configured wallet provider, to returning cryptographic proof that the agent submits back to the merchant. It handles multi-step flows and exceptions automatically, enabling real-time agent-to-merchant microtransactions that would be cost-prohibitive with traditional payment methods (which impose minimum fees).

  * **Payment limits** — Built-in payment limits help developers to establish granular budget controls at both user and agent levels. Each PaymentSession has a configurable budget limit (maxSpendAmount, currency) and an expiry time. When the session expires or the budget is reached, further payment requests are denied. If a payment signing fails after budget deduction, the budget does not deduct the failed payment.

  * **Third-party wallet integration** — The service offers secure wallet integration with two providers: CoinbaseCDP and Stripe(Privy) for embedded stablecoin wallet operations. Sensitive credentials such as API keys and wallet secrets are stored via AgentCore Identity. AgentCore helps developers limit which agents can access wallet resources.

  * **Endpoint discoverability** — AgentCore payments offers a ready-to-use Coinbase x402 Bazaar MCP server, which exposes 10,000+ pay-per-use x402 endpoints through the AgentCore Gateway. Developers can browse and search for x402-enabled services and add them as targets in a Gateway via the console or CLI.

  * **Observability** — End-to-end observability through Amazon CloudWatch provides visibility across the entire payment lifecycle. Customers can access vended logs (application logs published automatically to your CloudWatch log group) and vended spans (trace records viewable in AWS X-Ray) for every data plane API call, helping developers to monitor transaction success rates, track spending patterns, and diagnose errors.


## Accessing AgentCore payments

You can interact with AWS AgentCore payments by directly invoking the payments service’s public APIs via the AWS CLI, AWS SDKs and AgentCore SDK. You can also integrate with supported agent SDK frameworks like Strands Agents and LangGraph.

## Related services

  * **[AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity.html>) ** \- Securely store and federate payment credentials to help implement least permissions principle for access. Your Coinbase API keys and Stripe/Privy Wallet credentials will be securely stored here as a PaymentCredentialProvider.

  * **[AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway.html>) ** \- Connect to paid MCP servers ensuring your agents have secure access to them via AgentCore Gateway. You can also leverage pre-existing integration of Coinbase x402 Bazaar through AgentCore Gateway to discover thousands of existing paid MCP tools.

  * **[AgentCore Browser](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-tool.html>) ** \- AgentCore Browser, together with AgentCore payments, helps you autonomously and securely access paywalled websites that support x402.

  * **[AgentCore Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability.html>) ** \- Helps you trace, debug, and monitor AI agents' performance in production environments. AgentCore payments provides metrics and traces for you to observe for your AI agent.



