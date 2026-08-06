# Schema constraints - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-schema-constraints.html

---

# Schema constraints

Policies for Amazon Bedrock AgentCore Gateway must validate against a specific Cedar schema that is automatically generated from the Gateway’s MCP tool manifest. This schema defines what’s possible in your policies.

###### Topics

  * Principal Types

  * Resource Type

  * Actions

  * Context

  * What You Cannot Do


## Principal Types

The principal type depends on the authentication method configured for your AgentCore Gateway:

`AgentCore::OAuthUser`
    

  * Used for OAuth-authenticated gateways

  * Has an `id` attribute (from JWT sub claim)

  * Supports tags for OAuth claims (username, scope, role, etc.)


`AgentCore::IamEntity`
    

  * Used for IAM-authenticated gateways (AWS_IAM authorizer)

  * Has an `id` attribute containing the caller’s IAM ARN

  * Does not support tags; use pattern matching on `principal.id` for access control


## Resource Type

  * Must be `AgentCore::Gateway`

  * Represents the MCP Gateway instance

  * Can be matched by type ( `is` ) or specific ARN ( `==` )

  * Must use specific ARNs to refer to specific actions


## Actions

  * Each MCP tool becomes an action: `AgentCore::Action::"ToolName"`

  * All tool actions inherit from CallTool → Mcp hierarchy

  * Example: `Action::"RefundTool___process_refund"` is a CallTool


## Context

  * Only available context is `context.input`

  * Contains the tool’s input parameters as defined in the MCP manifest

  * Each tool has a typed input structure (e.g., RefundTool___process_refundInput)

  * Parameter types are automatically mapped from JSON Schema to Cedar types:

    * string → String

    * integer → Long

    * boolean → Bool

    * number → Decimal


## What You Cannot Do

  * Cannot reference entity types outside AgentCore namespace

  * Cannot access context fields other than `context.input` (`context.output` can only be used with guardrails)

  * Cannot use custom attributes on OAuthUser (use tags instead)

  * Cannot define new entity types in policies



