# Guardrails in policies - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-guardrails-in-policies.html

---

# Guardrails in policies

This section explains how to define Bedrock Guardrails in policy. Bedrock Guardrails provides configurable safeguards that can run on both requests and responses to keep AI applications safe. You can currently define prompt attack, content filter, and sensitive information guardrails in policy. Each guardrail must be configured with a category and a threshold between 0 and 1.

When a guardrail evaluates context, it returns a confidence score between 0 and 1, indicating the degree of confidence that the evaluated content exhibits the defined property (e.g. `PROMPT_INJECTION`).

## Guardrails regional availability

The following table shows which AWS Regions have support for guardrails in policy:

| US East (N. Virginia) | US East (Ohio) | US West (Oregon) | Europe (Frankfurt) | Europe (Ireland) | Europe (London) | Europe (Paris) | Europe (Stockholm) | Asia Pacific (Mumbai) | Asia Pacific (Singapore) | Asia Pacific (Sydney) | Asia Pacific (Tokyo) | Asia Pacific (Seoul) | Canada (Central) | South America (São Paulo) |  AWS GovCloud (US-West)  
---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  
Guardrails Support |  ✅ |  ❌ |  ❌ |  ❌ |  ❌ |  ✅ |  ❌ |  ✅ |  ❌ |  ❌ |  ✅ |  ✅ |  ❌ |  ❌ |  ❌ |  ❌  
  
## Before you begin

Before you start, you need to properly configure your IAM role.

### Permissions

The AgentCore Gateway Execution Role configured on the gateway associated with your policy engine must have permissions for both Bedrock AgentCore operations and Bedrock Guardrails. The `bedrock:InvokeGuardrailChecks` permission is required because the Policy data plane uses FAS (Forward Access Session) credentials derived from the gateway’s execution role to call the Bedrock Guardrails API on your behalf.

```json
{
  "Version": "2012-10-17", 
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "bedrock-agentcore:*",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "bedrock:InvokeGuardrailChecks",
      "Resource": "*"
    }
  ]
}
```
### Supported guardrails

Safeguard Name | Entity Type | Safeguard Categories  
---|---|---  
Content filter |  `ContentFilter` |  `VIOLENCE`, `HATE`, `SEXUAL`, `MISCONDUCT`, `INSULTS`  
Prompt attack detection |  `PromptAttack` |  `JAILBREAK`, `PROMPT_INJECTION`, `PROMPT_LEAKAGE`  
Sensitive information |  `SensitiveInformation` |  `CREDIT_DEBIT_CARD_NUMBER`, `US_SOCIAL_SECURITY_NUMBER`, `EMAIL`, `PHONE`, `ADDRESS`, `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `PASSWORD`, `IP_ADDRESS`, `NAME`, `USERNAME`, and [20+ more](<https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-sensitive-filters.html>)  
  
## Defining guardrails in policies

To define guardrails in policy, you can either write policy as code or describe the policy in natural language. Similar to any existing policies you may have already created, you need to specify an effect (e.g. `permit`) with a condition (`when guardrails`). In the condition, you need to provide the specific guardrail safeguard you want to enable, the category of safeguard to use, the context you want the guardrail safeguard to evaluate, and the confidence score threshold.

**Example guardrail definition**

```text
suppressOutput (principal, action == AgentCore::Action::"<TARGET_NAME>_<METHOD>:<URI>", resource == AgentCore::Gateway::"<GATEWAY_ARN>")
when guardrails {
    BedrockGuardrails::ContentFilter(["HATE"],[context.output.message])["HATE"]
    .confidenceScore
    .greaterThan(decimal("0.2"))
};
```
### Specifying a guardrail safeguard

To choose a specific safeguard entity type, use the BedrockGuardrails namespace:

Safeguard | Guardrail function name  
---|---  
Content Filter |  `BedrockGuardrails::ContentFilter`  
Prompt Attack |  `BedrockGuardrails::PromptAttack`  
Sensitive Information |  `BedrockGuardrails::SensitiveInformation`  
  
### Selecting a safeguard category

Select a category for the given safeguard (see Supported guardrails).

e.g. `BedrockGuardrails::ContentFilter(["HATE"],[context.output.message])`

### Effects for guardrails

To create guardrails for use in authorization requests, use the `permit` and `forbid` effects. These continue to govern request authorization.

```text
forbid (principal, action == AgentCore::Action::"<TargetName>___POST:/invocations", resource) when guardrails {
  BedrockGuardrails::PromptAttack(["PROMPT_INJECTION"], [context.input.prompt])["PROMPT_INJECTION"].confidenceScore.greaterThan(decimal("0.6"))
};
```
To create guardrails for use in suppressing outputs from tools, agents, or models, use the `suppressOutput` effect. `suppressOutput` is a new effect that operates on the data an action returns. After an authorized action is completed, it evaluates the outputs against the guardrail and suppresses the output when the guardrail is violated.

```text
suppressOutput (principal, action == AgentCore::Action::"<TargetName>___POST:/invocations", resource) when guardrails {
  BedrockGuardrails::SensitiveInformation(["US_SOCIAL_SECURITY_NUMBER"], [context.output.text])["US_SOCIAL_SECURITY_NUMBER"]
    .confidenceScore
    .greaterThan(decimal("0.5"))
};
```
### Passing context to your guardrail

When defining guardrails in policy, you must specify data paths (e.g. `context.input.message`) that identify the values to extract from the action’s payload. The guardrail evaluates the extracted values. You can specify one or more paths to data based on your request or response schema.

e.g. `[context.input.message, context.input.systemPrompt]`

### Thresholds for guardrails

With content filters and prompt attack detection, the guardrail returns a confidence score, which is a numeric value in the range [0, 1], where 0 is low confidence and 1 is high confidence. The score represents how confidently the guardrail detected a violation. Current possible scores are discrete values {0, 0.2, 0.4, 0.6, 0.8, and 1.0}.

To set a threshold, you need to provide the decimal value to the comparison operator (e.g. `greaterThan(decimal("0.4"))`).

**Score comparison operators**

You can apply the below comparison operators to any of `confidenceScore`, `maxConfidenceScore()`, or `minConfidenceScore()`:

Operator | Usage  
---|---  
`.greaterThan(decimal("X.X"))` |  Score > threshold  
`.greaterThanOrEqual(decimal("X.X"))` |  Score ≥ threshold  
`.lessThan(decimal("X.X"))` |  Score < threshold  
`.lessThanOrEqual(decimal("X.X"))` |  Score ≤ threshold  
  
You can use an aggregation in your policy to extract and compare scores returned by guardrails:

**Aggregations**

Aggregation | Description | Example  
---|---|---  
`[<category>].confidenceScore` |  Access the confidence score for a specific category ([decimal](<https://docs.cedarpolicy.com/policies/syntax-datatypes.html#datatype-decimal>)) |  `["HATE"].confidenceScore`  
`maxConfidenceScore()` |  Maximum confidence across all scanned categories ([decimal](<https://docs.cedarpolicy.com/policies/syntax-datatypes.html#datatype-decimal>)) |  `.maxConfidenceScore()`  
`minConfidenceScore()` |  Minimum confidence across all scanned categories ([decimal](<https://docs.cedarpolicy.com/policies/syntax-datatypes.html#datatype-decimal>)) |  `.minConfidenceScore()`  
`count()` |  Number of findings detected ([Long](<https://docs.cedarpolicy.com/policies/syntax-datatypes.html#datatype-long>)) |  `.count()`  
  
#### How to choose a threshold

If you do not specify a threshold when prompting the authoring service, AgentCore sets a default value. If you write your policies without the help of the authoring service, you must provide the threshold value.

The below defaults are calibrated to provide broad coverage with acceptable precision for most workloads:

Safeguard | Default threshold  
---|---  
Content Filter |  0.2  
Prompt Attack Detection |  0.4  
Sensitive Information |  0.2  
  
##### Choosing a custom threshold

If the default thresholds do not meet your requirements, you can determine the optimal threshold for your workload using one of the following approaches.

**Option 1: Evaluate against a golden test set**

Use this approach when you have a curated set of test inputs with clear expected outcomes.

  1. Create your policies and set your policy engine mode to LOG_ONLY.

  2. Run your test set through the gateway your policy engine is attached to.

  3. Review the logs for each evaluation. Each log entry includes the content evaluated and the confidence score returned by the guardrail.

  4. For each result, label whether the guardrail should have flagged the content or done nothing (true and false respectively).

  5. Using these labels, combined with the confidence scores available in your logs, build a confusion matrix at multiple threshold values. Compare precision and recall at each threshold to select the value that aligns with your tolerance for false positives versus missed detections.


**Option 2: Evaluate against production traffic**

Use this approach when you do not have a pre-built test set and want to calibrate using real traffic patterns.

  1. Create your policies and set your policy engine mode to LOG_ONLY.

  2. Allow the policy engine to evaluate production traffic. Each log entry includes the content evaluated and the confidence score returned by the guardrail.

  3. Use an LLM-as-a-judge to label each logged result as true (the guardrail should have flagged the content) or false (the guardrail should not have flagged the content).

  4. Using these labels, build a confusion matrix at multiple threshold values. Compare precision and recall at each threshold to select the value that aligns with your tolerance for false positives versus missed detections.


### Test guardrails in policy

AgentCore provides multiple mechanisms for testing guardrail policies before enforcing them on production traffic. You can control enforcement at the policy engine level, at the individual policy level, or both, allowing you to validate guardrail behavior incrementally. See [test a policy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-test-a-policy.html>) for more information.

## How guardrails works with policy

Guardrail policies can be applied to any gateway target. Guardrails run on: * **MCP targets** — `POST /mcp` (JSON-RPC `tools/call`) * **HTTP runtime targets** — `POST /<target>/invocations` * **HTTP Inference targets** — `POST /inference`

When a call arrives at your gateway, the Policy Evaluator performs the following:

  1. **Matches scope** — Identifies which guardrail policies apply to this request

  2. **Extracts content** — Pulls the field specified by `dataPath` (e.g., `context.input.message`) from the request body

  3. **Calls Bedrock InvokeGuardrailChecks API** — Evaluates the content and injects the returned confidence scores into the policy evaluation context

  4. **Evaluates the policy using guardrail scores** — Compares the returned confidence scores against the threshold defined in the policy

  5. **Returns a decision** — `ALLOW` or `DENY` with policy annotations back to the gateway


Note: Guardrails are non-deterministic. The same input can result in different outputs. Policies, however, are deterministic, the same input will always result in the same output.

## Limitations of guardrails in policy

  * **No support for regex or pattern matching** — guardrails use ML scoring, not regular expressions

  * **You cannot mix standard Cedar policies with guardrails** — `when guardrails {…​}` replaces `when {…​}`

  * **A guardrail is required in a`when guardrails {…​}` block** — guardrails blocks must have at least one guardrail defined within



