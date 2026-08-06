# Policy enforcement modes - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-enforcement-modes.html

---

# Policy enforcement modes

Enforcement mode defines how the gateway applies policy decisions. The policy engine supports two modes:

  * In `LOG_ONLY` mode, the policy engine evaluates and logs whether the action would be allowed or denied without enforcing the the decision

  * In `ENFORCE` mode, the policy engine evaluates the action and enforces decisions by allowing or denying agent operations.



