# Security in Amazon Bedrock AgentCore payments - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-security-best-practices.html

---

# Security in Amazon Bedrock AgentCore payments

The following best practices can help you prevent security incidents when using Amazon Bedrock AgentCore payments. Preventative controls stop unsafe actions before they happen. Detective controls surface unexpected activity so you can respond to it.

## Preventative controls

Use these controls to constrain what your agent can do and to keep sensitive material out of its reach.

### Enforce least privilege with the four-role IAM pattern

AgentCore payments separates the control plane from the data plane by using distinct IAM roles. Set up IAM permissions based on the persona that matches each role. With this pattern, no single role can both raise a budget and spend against it.

# | Role | Purpose  
---|---|---  
1 |  `ControlPlaneRole` |  Administers the service.  
2 |  `ManagementRole` |  Configures sessions. This role is explicitly denied `ProcessPayment`.  
3 |  `ProcessPaymentRole` |  Executes payments.  
4 |  `ResourceRetrievalRole` |  Service-assumed. Fetches session and credential state.  
  
For more information, see [IAM roles for AgentCore payments](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-iam-roles.html>).

### Store credentials in AgentCore Identity

Never embed wallet provider credentials in agent code or environment variables.

  * Store Coinbase CDP or Stripe (Privy) credentials as a `PaymentCredentialProvider` in AgentCore Identity.

  * The service retrieves them at runtime by using `ResourceRetrievalRole`.

  * Rotate credentials on the wallet provider’s recommended schedule. If a credential is compromised, revoke it immediately.


For more information, see [AgentCore Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity.html>).

### Set the UserId header correctly

On an IAM-configured inbound authorization payment manager, your backend asserts the `X-Amzn-Bedrock-AgentCore-Payments-User-Id` header, and AgentCore payments does **not** verify it. You are responsible for setting this value correctly.

AgentCore payments verifies the IAM caller and the JWT (when using OAuth), but the correctness of the `UserId` header on API calls is your responsibility. Do not let end users or agents influence this header directly.

### Secure multi-tenant deployments

For multi-tenant deployments that serve multiple end users, use the `CUSTOM_JWT` (OAuth) authorization type in the payment manager. This provides the service with a verified end-user identity. With the IAM-configured payment manager, AgentCore payments does not verify end-user identity.

### Require explicit end-user consent and delegation

Funding and delegation are two separate end-user decisions, and both are made out-of-band from the agent:

  * **Funding** – The end user deposits funds through the wallet provider portal. The agent has no API access to funding and must never prompt for it or auto-initiate it.

  * **Delegation** – The end user grants permission through Coinbase Spend Permissions or Privy Delegated Actions. Do not assume delegation is permanent, because users can revoke it at any time. Handle revoked delegation gracefully.


### Keep the agent isolated from payment instruments

The agent must never access card numbers, CVV values, bank details, or wallet private keys. The agent’s view stops at "a permission to spend from a user-owned wallet."

  * Wallet keys are held by the provider in self-custody—not by AWS or the developer.

  * Never pass payment instrument details through prompts, tool inputs, or context windows.


### Scope tool access with Policy in AgentCore

For tool-level authorization, expose paid endpoints through Amazon Bedrock AgentCore Gateway. Every call through the Gateway is intercepted by Policy in AgentCore, a Cedar-based engine that evaluates the request—including the agent’s identity, the tool name, and the parameters—and decides whether to allow it.

Policy and payment sessions cover different decisions:

  * **Policy** controls _who_ calls _which tool_ with _what parameters_.

  * **Payment sessions** control _how much_ can be spent and _for how long_.


Together, they give you orthogonal levers for tool access and spend amount.

  * Write Cedar policies scoped by agent identity, user group, and request parameters.

  * Deny access to high-cost tools for agents that don’t require them.

  * Review and audit policies regularly as your tool catalog changes.


For more information, see [Policy in AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy.html>).

### Use payment sessions with budget limits and TTL

Every payment runs inside a payment session that has a maximum spend amount and an expiry time. The infrastructure layer enforces these limits, so prompt injection and model non-determinism cannot override them.

  * Set `maxSpendAmount` to the minimum needed for the task, and set a short TTL.

  * Start with conservative budgets and raise them only as the agent proves reliable.

  * Failed signings automatically roll back budget deductions.


For more information, see [Create a payment session](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-create-session.html>).

### Validate and restrict payTo addresses

The `payTo` address specifies the recipient wallet. AgentCore payments does not enforce `payTo` restrictions server-side, so your application must validate the address before calling the `ProcessPayment` API.

  * **Maintain an allowlist** of pre-verified merchant addresses, and reject unknown addresses.

  * **Never let the model generate payTo addresses.** They must come from a trusted source, such as an x402 payment request or a verified registry.

  * **Validate against the expected merchant** when processing x402 responses.

  * **Prefer AgentCore Gateway** for endpoint discovery, because it provides verified `payTo` addresses through the x402 Bazaar.

  * **Apply Cedar policies** to constrain which addresses an agent can pay.

  * **Don’t cache addresses across sessions.** Always use the current merchant-provided address, validated against your allowlist.


### Secure network access

  * Use VPC endpoints to keep traffic off the public internet.

  * Apply endpoint policies and IAM conditions (`aws:sourceVpc`, `aws:sourceVpce`) to restrict origins.

  * Enable AWS CloudTrail for all AgentCore payments API calls.


### Design for payment failure and rollback

  * Implement idempotency to prevent duplicate payments on retries.

  * Handle payment failures with clear fallback behavior. Don’t retry indefinitely.

  * Monitor for partial failures and implement compensating transactions.


## Detective controls

Use these controls to observe payment activity and surface anomalies so you can respond to them.

### Enable observability and audit logging

AgentCore payments provides automatic observability through Amazon CloudWatch:

  * **Vended logs** – Every data plane call is logged (who, what, how much, and to whom).

  * **Vended spans** – Full payment lifecycle traces are available in AWS X-Ray.

  * Set alarms for anomalous spending patterns, such as payments to unlisted addresses, an unusually large number of distinct recipients, or sudden address changes for known merchants.

  * Retain logs according to your compliance requirements.

  * Don’t rely on agent code to log its own actions.


For more information, see [Observability with Amazon CloudWatch](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-observability.html>).

### Regularly review configurations

  * Audit budgets and reduce limits for agents that underspend.

  * Review Cedar policies and IAM roles quarterly.

  * Monitor wallet provider dashboards for unexpected delegation or funding activity.



