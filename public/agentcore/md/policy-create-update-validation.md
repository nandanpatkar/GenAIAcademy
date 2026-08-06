# Policy create and update: per-policy engine validation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-create-update-validation.html

---

# Policy create and update: per-policy engine validation  
  
When creating or updating policies directly (not through generation), validation and analysis takes into account the new policy as well as its interactions with **all preexisting policies** in the policy engine.

## How it works

  1. The policy is checked against the Cedar schema for **all gateways** associated with the policy engine. Schema checks always run regardless of the validation mode.

  2. If the validation mode is set to `FAIL_ON_ANY_FINDINGS`, semantic validation runs in the context of the **entire policy engine** , checking for overly permissive, overly restrictive, and ineffective policies. If either schema checks or semantic validation produces findings, the policy is rejected. For details on each check, see [Validation and analysis overview](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./policy-validation-overview.html>).


###### Note

With `IGNORE_ALL_FINDINGS`, only schema checks run. Policies are accepted as long as they pass the schema checks. For more information, see [Add policies to the Policy Engine](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./add-policies-to-engine.html>).

## Example: Create a policy with validation

Create a policy with strict validation that rejects policies with any findings:

```bash
aws bedrock-agentcore-control create-policy \
  --policy-engine-id MyEngine-abc123 \
  --name RestrictRefunds \
  --validation-mode FAIL_ON_ANY_FINDINGS \
  --definition '{
    "cedar": {
      "statement": "forbid(\n  principal,\n  action == Action::\"processRefund\",\n  resource\n) when {\n  context.amount > 1000\n};"
    }
  }'
```
The response indicates the policy is being created:

```json
{
  "policyId": "RestrictRefunds-ghi789",
  "status": "CREATING"
}
```
Check the policy status to confirm validation passed:

```bash
aws bedrock-agentcore-control get-policy \
  --policy-engine-id MyEngine-abc123 \
  --policy-id RestrictRefunds-ghi789
```
When validation passes, the policy becomes active:

```json
{
  "policyId": "RestrictRefunds-ghi789",
  "status": "ACTIVE",
  "statusReasons": []
}
```
## Example: Validation failure

If a policy references an action that doesn’t exist in any associated gateway’s schema, validation fails:

```bash
aws bedrock-agentcore-control create-policy \
  --policy-engine-id MyEngine-abc123 \
  --name InvalidPolicy \
  --validation-mode FAIL_ON_ANY_FINDINGS \
  --definition '{
    "cedar": {
      "statement": "permit(\n  principal,\n  action == Action::\"nonExistentTool\",\n  resource\n);"
    }
  }'
```
When you check the policy status, the response shows the validation failure:


```bash
aws bedrock-agentcore-control get-policy \
  --policy-engine-id MyEngine-abc123 \
  --policy-id InvalidPolicy-jkl012
```
 
```json
{
  "policyId": "InvalidPolicy-jkl012",
  "status": "CREATE_FAILED",
  "statusReasons": [
    "Validation failed: Action 'nonExistentTool' is not defined in the schema for any associated gateway"
  ]
}
```
 

