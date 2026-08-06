# Limitations - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-limitations-section.html

---

# Limitations

Cedar policies and the current Amazon Bedrock AgentCore Gateway implementation have certain limitations that affect policy authoring and functionality.

## Cedar language limitations

The following limitations are inherent to the Cedar policy language:

  * **No floating-point numbers** \- Cedar does not support float types. Use Decimal for fractional values (limited to 4 decimal places)

  * **No regular expressions** \- Pattern matching is limited to the like operator with * wildcards


## Current implementation limitations

The following limitations are specific to the current Amazon Bedrock AgentCore Gateway implementation:

  * **Custom claims in NL2Cedar** \- to use custom claims with NL2Cedar, provide the custom claims in the prompt

  * **Limited decimal precision** \- Decimal values are limited to 4 decimal places and a specific range

  * **Max policy size** \- 10 KB per individual policy

  * **Max total policy size per resource** \- 200 KB combined across all policies per resource within a policy engine

  * **Cedar schema size** \- supported schemas size under 400 KB. This limit applies to the combined Cedar schema generated from all tools across all gateways associated with the policy engine. The schema size is driven by the total number of tools and the complexity of their input parameter shapes, not just the tool or target count. If the combined schema exceeds this limit, use separate policy engines for different gateways, or remove tools that are no longer in use.

  * **Max Policies per Engine** \- 1,000

  * **Max Policy Engines per account** \- 1,000

  * **Mixing`context.input.` and `context.output.` ** in a single invocation is rejected


These implementation limitations may be addressed in future releases.

