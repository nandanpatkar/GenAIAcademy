# Policy generation: per-policy validation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-generation-validation.html

---

# Policy generation: per-policy validation

When using the policy authoring service to generate policies from natural language, validation and analysis occur **per individual policy** during generation.

## How it works

  1. Natural language is converted to a Cedar policy

  2. Each generated policy is validated against the gateway schema

  3. Analysis runs on each policy individually

  4. Results are available in the generation response


## Example: Generate and validate a policy

Retrieving generation results is a two-step process: first check the generation status, then list the generated assets to see the policies and their validation findings.

Start a policy generation:

```bash
aws bedrock-agentcore-control start-policy-generation \
  --policy-engine-id MyEngine-abc123 \
  --name RefundPolicy \
  --content '{
    "rawText": "Allow customer service agents to process refunds up to 500 dollars for orders placed within the last 30 days"
  }' \
  --resource '{
    "arn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/MyGateway-xyz789"
  }'
```
The response includes a policy generation ID and status:

```json
{
  "policyGenerationId": "RefundPolicy-def456",
  "policyEngineId": "MyEngine-abc123",
  "status": "GENERATING"
}
```
Check the generation status using `get-policy-generation` :

```bash
aws bedrock-agentcore-control get-policy-generation \
  --policy-engine-id MyEngine-abc123 \
  --policy-generation-id RefundPolicy-def456
```
The response shows the overall generation status:

```json
{
  "policyGenerationId": "RefundPolicy-def456",
  "status": "GENERATED",
  "statusReasons": []
}
```
Once the status is `GENERATED` , list the generated assets to retrieve the policies and their per-policy validation findings:

```bash
aws bedrock-agentcore-control list-policy-generation-assets \
  --policy-engine-id MyEngine-abc123 \
  --policy-generation-id RefundPolicy-def456
```
The response includes each generated policy with its Cedar definition and validation findings:

```json
{
  "policyGenerationAssets": [
    {
      "policyGenerationAssetId": "asset-1",
      "definition": {
        "cedar": {
          "statement": "permit(\n  principal is AgentCore::OAuthUser,\n  action == AgentCore::Action::\"RefundTool___process_refund\",\n  resource == AgentCore::Gateway::\"arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/MyGateway-xyz789\"\n) when {\n  context.input.amount <= 500\n};"
        }
      },
      "findings": [
        {
          "type": "VALID"
        }
      ],
      "rawTextFragment": "Allow customer service agents to process refunds up to 500 dollars"
    },
    {
      "policyGenerationAssetId": "asset-2",
      "definition": {
        "cedar": {
          "statement": "permit(\n  principal,\n  action == AgentCore::Action::\"RefundTool___view_order_history\",\n  resource\n);"
        }
      },
      "findings": [
        {
          "type": "ALLOW_ALL",
          "description": "Overly Permissive: Policy Engine will allow every request for the specified principal (AgentCore::OAuthUser), action (RefundTool___view_order_history) and resource (gateway/*) combination if the policy is added or updated"
        }
      ],
      "rawTextFragment": "Allow customer service agents to view order history"
    }
  ]
}
```
## Validation findings per policy

Each generated policy asset includes a `findings` array of `Finding` objects, each with a `type` and `description` . The following examples show different finding types:

A policy that passed validation and analysis:

```json
{
  "findings": [
    {
      "type": "VALID"
    }
  ]
}
```
A policy flagged as overly permissive:

```json
{
  "findings": [
    {
      "type": "ALLOW_ALL",
      "description": "Overly Permissive: Policy Engine will allow every request for the specified principal (AgentCore::OAuthUser), action (RefundTool___view_order_history) and resource (gateway/*) combination if the policy is added or updated"
    }
  ]
}
```
A policy that could not be generated from the natural language input:

```json
{
  "findings": [
    {
      "type": "NOT_TRANSLATABLE",
      "description": "Unsupported Condition Error: The request includes conditions that rely on data or attributes currently not supported."
    }
  ]
}
```
## Common findings for generated policies

The following table describes the finding types that can be returned for generated policies:

Finding type | Severity | Description | Recommended action  
---|---|---|---  
`VALID` |  Success |  Policy is valid Cedar with no findings. No description is returned for this finding type. |  No action required. The policy is ready to use.  
`INVALID` |  Error |  The generated Cedar policy contains syntax errors or does not comply with the gateway schema. |  Review the generated policy for schema violations or syntax issues. Rephrase the natural language input and regenerate.  
`NOT_TRANSLATABLE` |  Error |  Natural language could not be converted to valid Cedar. The request may include conditions that rely on unsupported data or attributes. |  Double check targeted gateway resource for tools definition.  
`ALLOW_ALL` |  Warning |  Permit policy applies to all principal, action, and resource combinations. |  Confirm that unrestricted access is intended. Add conditions to restrict the scope if not.  
`ALLOW_NONE` |  Warning |  Permit policy is non-determining because it permits nothing. |  Review the policy conditions. The policy may contain contradictory or unreachable conditions.  
`DENY_ALL` |  Warning |  Policy denies all actions for all principals. |  Confirm that a full deny is intended. This overrides all permit policies due to forbid-overrides-permit semantics.  
`DENY_NONE` |  Warning |  Forbid policy is non-determining because it denies nothing. |  Review the policy conditions. The forbid policy may contain contradictory or unreachable conditions.

