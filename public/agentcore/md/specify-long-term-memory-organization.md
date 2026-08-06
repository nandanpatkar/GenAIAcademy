# Specify long-term memory organization with namespaces - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/specify-long-term-memory-organization.html

---

# Specify long-term memory organization with namespaces

When you [create](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-create-a-memory-store.html>) an AgentCore Memory, use a namespace to specify where the [long-term memories](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-types.html#memory-long-term-memory>) for a [memory strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-strategies.html>) are logically grouped. Every time a new long-term memory is extracted using the memory strategy, it is saved under the namespace you set. This means that all long-term memories are scoped to their specific namespace, keeping them organized and preventing any mix-ups with other users or sessions. You should use a hierarchical format separated by forward slashes `/` . This helps keep memories organized clearly. As needed, you can choose to use the following pre-defined variables within braces in the namespace based on your application’s organization needs:

  * **actorId** – Identifies who the long-term memory belongs to.

An actor refers to entity such as end users or agent/user combinations. For example, in a coding support chatbot, the actor is usually the developer asking questions. Using the actor ID helps the system know which user the memory belongs to, keeping each user’s data separate and organized.

  * **strategyId** – Shows which memory strategy is being used. This strategy identifier is auto-generated when you create an AgentCore Memory.

  * **sessionId** – Identifies which session or conversation the memory is from.

A session is usually a single conversation or interaction period between the user and the AI agent. It groups all related messages and events that happen during that conversation.


For example, if you define the following namespace as the input to your strategy when creating an AgentCore Memory:

```text
/strategy/{memoryStrategyId}/actor/{actorId}/session/{sessionId}/
```
After memory creation, this namespace might look like:

```text
/strategy/summarization-93483043//actor/actor-9830m2w3/session/session-9330sds8
```
A namespace can have different levels of granularity:

**Most granular Level of organization**

`/strategy/{memoryStrategyId}/actor/{actorId}/session/{sessionId}/`

**Granular at the actor Level across sessions**

`/strategy/{memoryStrategyId}/actor/{actorId}/`

**Granular at the strategy Level across actors**

`/strategy/{memoryStrategyId}/`

**Global across all strategies**

`/`

For example code, see [Enable long-term memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./long-term-enabling-long-term-memory.html>).

## Restrict access with IAM

You can create IAM policies to restrict memory access by the scopes you define, such as actor, session, and namespace. Use the scopes as context keys in your IAM policies.

The following policy restricts access to retrieving memories to a specific namespace or records under a particular namespacePath hierarchy. In this example, the policy allows access only to memories with exact namespaces such as `summaries/agent1/` OR with namespaces under the following namespacePath hierarchy with `summaries/agent1/` , such as `summaries/agent1/session1/` or `summaries/agent1/session2/`.

```json
{
"Version":"2012-10-17",
  "Statement": [
    {
      "Sid": "SpecificNamespaceAccess",
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:RetrieveMemoryRecords"
      ],
      "Resource": "arn:aws:bedrock-agentcore:us-east-1:123456789012:memory/memory_id",
      "Condition": {
        "StringEquals": {
          "bedrock-agentcore:namespace": "summaries/agent1/"
        }
      }
    },
    {
      "Sid": "SpecificNamespacePathAccess",
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:RetrieveMemoryRecords"
      ],
      "Resource": "arn:aws:bedrock-agentcore:us-east-1:123456789012:memory/memory_id",
      "Condition": {
        "StringLike": {
          "bedrock-agentcore:namespacePath": "summaries/agent1/*"
        }
      }
    }
  ]
}
```
