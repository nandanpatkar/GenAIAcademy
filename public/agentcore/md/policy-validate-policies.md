# Validate and test policies - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-validate-policies.html

---

# Validate and test policies

Before deploying policies to production, Policy in AgentCore provides validation capabilities to catch errors and identify potential issues. Validation works differently depending on whether you are generating policies from natural language or creating and updating policies directly.

Schema checks always run to verify that policies comply with the Cedar schema for your gateways. Semantic validation (automated reasoning) detects security and logic issues and can be controlled through the `validationMode` parameter. For more information about these capabilities and the validation modes, see [Validation and analysis overview](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-validation-overview.html>).

###### Topics

  * [Test a policy in LOG_ONLY mode](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-test-a-policy.html>)

  * [Validation and analysis overview](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-validation-overview.html>)

  * [Policy generation: per-policy validation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-generation-validation.html>)

  * [Policy create and update: per-policy engine validation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-create-update-validation.html>)



