# Authorization flow - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-authorization-flow.html

---

# Authorization flow

Amazon Bedrock AgentCore Gateway evaluates Cedar policies against incoming requests. This section explains how authorization information flows from the request to policy evaluation.

## Request processing

Amazon Bedrock AgentCore Gateway processes two key pieces of information from each request:

  1. **JWT Token** \- Contains OAuth claims about the user:

```json
{
  "sub": "12345678-1234-1234-1234-123456789012",
  "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Vg2efaoGO",
  "username": "refund-agent",
  "scope": "aws.cognito.signin.user.admin refund:write",
  "role": "admin",
  "department": "finance"
}
```
  2. **MCP Tool Call Request** \- The actual tool invocation:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "RefundTool___process_refund",
    "arguments": {
      "orderId": "12345",
      "amount": 450,
      "reason": "Defective product"
    }
  }
}
```
## Cedar authorization request

The Gateway extracts information from both sources and constructs a Cedar authorization request.

**Complete Authorization Request:**

```json
{
  "principal": "AgentCore::OAuthUser::\"12345678-1234-1234-1234-123456789012\"",
  "action": "AgentCore::Action::\"RefundTool___process_refund\"",
  "resource": "AgentCore::Gateway::\"arn:aws:bedrock-agentcore:us-west-2:123456789012:gateway/refund-gateway\"",
  "context": {
    "input": {
      "orderId": "12345",
      "amount": 450,
      "reason": "Defective product"
    }
  }
}
```
**Components:**

Principal
    

Created from the JWT token’s sub claim:

```text
AgentCore::OAuthUser::"12345678-1234-1234-1234-123456789012"
```
Action
    

Extracted from the tool name:

```text
AgentCore::Action::"RefundTool___process_refund"
```
Resource
    

The Gateway instance:

```text
AgentCore::Gateway::"arn:aws:bedrock-agentcore:us-west-2:123456789012:gateway/refund-gateway"
```
Context
    

Contains the tool arguments:

```json
{
  "input": {
    "orderId": "12345",
    "amount": 450,
    "reason": "Defective product"
  }
}
```
**Entity Store** \- The JWT claims are stored as tags on the OAuthUser entity:

```json
{
  "uid": {
    "type": "AgentCore::OAuthUser",
    "id": "12345678-1234-1234-1234-123456789012"
  },
  "attrs": {
    "id": "12345678-1234-1234-1234-123456789012"
  },
  "tags": {
    "username": "refund-agent",
    "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Vg2efaoGO",
    "scope": "aws.cognito.signin.user.admin refund:write",
    "role": "admin",
    "department": "finance"
  }
}
```
## Policy evaluation

Cedar evaluates:

  1. **Principal check:** Is the principal an OAuthUser? ✓ (matches)

  2. **Action check:** Is the action RefundTool___process_refund? ✓ (matches)

  3. **Resource check:** Is the resource the refund gateway? ✓ (matches)

  4. **Condition checks:**

     * Does principal have username tag? ✓ (yes, from JWT)

     * Is username = "refund-agent"? ✓ (yes)

     * Is context.input.amount < 500? ✓ (450 < 500)


**Result:** ALLOW - All checks pass, the refund is authorized.

