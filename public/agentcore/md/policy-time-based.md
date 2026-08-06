# Time-based policy support - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-time-based.html

---

# Time-based policy support

Policy in AgentCore supports time-based restrictions in Cedar policies through the `context.system.now` datetime value. This enables you to enforce policies based on specific dates, times, or time ranges.

###### Topics

  * How it works

  * Absolute date and time range restrictions

  * Daily recurring time restrictions

  * Combined date and time restrictions

  * Timezone handling

  * Using natural language to generate time-based policies


## How it works

During policy evaluation, the current UTC timestamp is provided as part of evaluation context:

```text
// Current datetime in UTC
context.system.now
```
You can use Cedar’s datetime functions to create time-based conditions:

  * `datetime("YYYY-MM-DDTHH:MM:SSZ")` — Create a datetime value

  * `duration("Xh")` — Create a duration (hours, minutes, seconds)

  * `.toTime()` — Extract time of day from datetime

  * Comparison operators: `<` , `⇐` , `>` , `>=` , `==`


## Absolute date and time range restrictions

Enforce policies within specific calendar periods.

### Example: Promotional period policy

```text
permit(
  principal,
  action == AgentCore::Action::"RefundToolTarget___refund",
  resource == AgentCore::Gateway::"arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/my-gateway"
)
when {
  context.system.now >= datetime("2025-01-01T00:00:00Z") &&
  context.system.now < datetime("2025-01-31T23:59:59Z")
};
```
**Use case:** Allow refunds only during January 2025.

## Daily recurring time restrictions

Enforce policies based on time of day that recur daily.

### Example: Business hours policy

```text
permit(
  principal,
  action == AgentCore::Action::"RefundToolTarget___refund",
  resource == AgentCore::Gateway::"arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/my-gateway"
)
when {
  duration("9h") <= context.system.now.toTime() &&
  context.system.now.toTime() <= duration("17h")
};
```
**Use case:** Allow refunds only during business hours (9 AM–5 PM UTC daily).

## Combined date and time restrictions

Combine absolute dates with daily time restrictions.

### Example: Limited-time promotion with daily hours

```text
permit(
  principal,
  action == AgentCore::Action::"DiscountToolTarget___apply_discount",
  resource == AgentCore::Gateway::"arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/my-gateway"
)
when {
  // Valid dates: Feb 1-28, 2025
  context.system.now >= datetime("2025-02-01T00:00:00Z") &&
  context.system.now < datetime("2025-03-01T00:00:00Z") &&
  // Valid hours: 9am-9pm UTC daily
  duration("9h") <= context.system.now.toTime() &&
  context.system.now.toTime() <= duration("21h")
};
```
**Use case:** Allow discount tool only during February 2025, between 9 AM and 9 PM UTC daily.

## Timezone handling

All datetime values must be in UTC. The Policy Engine does not support timezone conversions or timezone-aware policies.

When specifying times in your policies, always use UTC. If your business operates in a different timezone, convert your local times to UTC before creating the policy.

## Using natural language to generate time-based policies

The policy authoring service can generate time-based policies from natural language descriptions.

### Example: Generate business hours policy

```bash
aws bedrock-agentcore-control start-policy-generation \
  --policy-engine-id MyEngine-abc123 \
  --name BusinessHoursOnly \
  --content '{
    "rawText": "Allow refunds only during business hours 9am to 5pm UTC"
  }' \
  --resource '{
    "arn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/MyGateway-xyz789"
  }'
```
Generated policy:

```text
permit(
  principal,
  action == AgentCore::Action::"RefundToolTarget___refund",
  resource == AgentCore::Gateway::"arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/MyGateway-xyz789"
)
when {
  duration("9h") <= context.system.now.toTime() &&
  context.system.now.toTime() <= duration("17h")
};
```
### Best practices for natural language

  * **Be explicit about times** — Use "9am to 5pm UTC" instead of "business hours"

  * **Always specify UTC** — Include "UTC" to avoid ambiguity

  * **Use ISO format for dates** — Use "2025-01-01" instead of "January 1st"

  * **Provide specific time ranges** — Avoid vague terms like "daytime" or "after hours"


Good examples of natural language prompts:

```text
"Allow refunds only between 9am and 5pm UTC"
"Allow payments except between 2am and 4am UTC daily"
"Allow discounts only from 2025-02-01 to 2025-02-28"
"Permit high-value transactions between 8am and 8pm UTC"
```
