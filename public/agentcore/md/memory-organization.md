# Memory organization in AgentCore Memory - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-organization.html

---

# Memory organization in AgentCore Memory

You can set how short-term and long-term memories are organized in an AgentCore Memory. This lets you isolate memories by session and by actor. For long-term memory, you can also set a namespace to organize the extracted memories for a memory strategy.

  * **Actor** – Refers to entities such as end users or agent/user combinations. For example, in a coding support chatbot, the actor is usually the developer asking questions. Using the actor ID helps the system know which user the memory belongs to, keeping each user’s data separate and organized.

  * **Session** – A single conversation or interaction period between the user and the AI agent. It groups all related messages and events that happen during that conversation.

  * **Strategy** (Long-term memory only) – Shows which long-term memory strategy is being used. This strategy identifier is auto-generated when you [create](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-create-a-memory-store.html>) an AgentCore Memory.


## Short-term memory organization

When you create a short term memory event with [CreateEvent](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_CreateEvent.html>) , you specify a session ID ( `sessionId` ) and an actor ID ( `actorId` ) that uniquely identify the session and actor for the event. Later, you can retrieve events for a user or session by using [short-term memory operations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./using-memory-short-term.html>).

For example code, see [Step 3: Capture the conversation history](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-customer-scenario.html#capture-conversation>).

## Long-term memory organization

When you [create](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-create-a-memory-store.html>) or update an AgentCore Memory, you can optionally create one or more [memory strategies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-strategies.html>) . Within a strategy, use a namespace to specify AgentCore Memory organizes [long-term memories](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-types.html#memory-long-term-memory>).

Every time AgentCore Memory extracts a new long-term memory with a memory strategy, the long-term memory is saved under the namespace you set. This means that all long-term memories are scoped to their specific namespace, keeping them organized and preventing any conflicts with other users or sessions. You should use a hierarchical format separated by forward slashes `/` , ending with a trailing slash. The trailing slash prevents prefix collisions in multi-tenant applications—for example, use `/actors/Alice/` instead of `/actors/Alice` . As needed, you can use the following pre-defined variables within braces in the namespace based on your application’s organization needs:

  * **actorId** – Identifies who the long-term memory belongs to.

  * **strategyId** – Shows which memory strategy is being used.

  * **sessionId** – Identifies which session or conversation the memory is from.


For example, if you define the following namespace as the input to your strategy when creating an AgentCore Memory:

```text
/strategy/{memoryStrategyId}/actor/{actorId}/session/{sessionId}/
```
After memory creation, this namespace might look like:

```text
/strategy/summarization-93483043/actor/actor-9830m2w3/session/session-9330sds8/
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

### Restrict access with IAM

You can create IAM policies to restrict memory access by the scopes you define, such as actor, session, and namespace. Use the scopes as context keys in your IAM polices.

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
