# Memory - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-memory.html

---

# Memory

The harness automatically persists conversation state in [AgentCore Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html>). On every invocation, the conversation is saved, scoped by session ID (and additionally by actor ID, if provided). On subsequent invocations with the same session ID, the agent’s history is loaded from Memory before it reasons - it remembers what happened in previous turns, even after the underlying microVM session has expired. You do not need to pass previous messages yourself; just send the new message.

## How memory works

  * **Short-term memory** captures raw events (messages, tool calls) within a session. This is what gives the agent continuity across turns.

  * **Long-term memory** extracts durable knowledge via configurable strategies ([semantic](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/semantic-memory-strategy.html>), [summarization](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/summary-strategy.html>), [user preference](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/user-preference-memory-strategy.html>), [episodic](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/episodic-memory-strategy.html>), or [custom](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-custom-strategy.html>)) and makes them retrievable via semantic search in later sessions.

  * **Actor ID** identifies the entity interacting with the agent (a user, another agent, or a system). Memory events are scoped by actorId + sessionId, so each actor has isolated memory. Long-term retrieval uses actorId as a template variable in namespace paths (e.g. `/summary/{actorId}/{sessionId}/`), mapping to the configured memory strategies.


## Managed memory (default)

By default, the harness provisions an [AgentCore Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html>) instance automatically with sensible defaults (semantic + summarization strategies, 30-day event expiry). You don’t need to create or configure anything - memory just works.

###### Memory charges

There is no additional charge for the harness itself. Managed Memory incurs standard AgentCore Memory charges for short-term events, stored long-term memory records, and retrieval requests. To avoid persistent Memory charges, disable Memory when you create the harness. For more information, see [Understand harness costs](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-operations.html#harness-costs>) and [Amazon Bedrock AgentCore pricing](<https://aws.amazon.com/bedrock/agentcore/pricing/>).

To customize the managed memory at create time:

###### Example

AWS CLI/boto3
     ```bash
     aws bedrock-agentcore-control create-harness \
       --harness-name "MyHarness" \
       --execution-role-arn "arn:aws:iam::123456789012:role/MyHarnessRole" \
       --memory '{"managedMemoryConfiguration": {"strategies": ["SEMANTIC", "SUMMARIZATION", "USER_PREFERENCE"], "eventExpiryDuration": 60}}'
     ```
To update strategies on an existing harness:

```bash
aws bedrock-agentcore-control update-harness \
  --harness-id "MyHarness-UuFdkQoXSL" \
  --memory '{"optionalValue": {"managedMemoryConfiguration": {"strategies": ["SEMANTIC", "SUMMARIZATION", "USER_PREFERENCE", "EPISODIC"]}}}'
```
AgentCore CLI
    

Memory is enabled by default when you create a harness:

```bash
agentcore create --name myagent
agentcore deploy
```
To skip managed memory:

```bash
agentcore create --name myagent --no-harness-memory
```
Interactive
    

Run `agentcore` in a project directory, select **add** , then choose **Harness** . The wizard includes a memory step.

  1. On the **Memory** step, choose **No persistent memory** or **Enabled** to create persistent memory for the harness.

![Memory step: No persistent memory or Enabled](/agentcore/images/harness-memory-01-memory.png)

  2. When memory is **Enabled** , an extra **Memory tuning** option appears in **Advanced settings** . Enable it with **Space** and press **Enter** to tune retrieval.

![Advanced settings: Memory tuning option](/agentcore/images/harness-memory-02-advanced-memory-tuning.png)

  3. Optionally set the messages count, retrieval top K, and relevance score (each can be skipped).

![Memory tuning: messages count, top K, relevance score](/agentcore/images/harness-memory-03-messages-count.png)


Confirm the wizard, then run `agentcore deploy` to apply.

Managed memory is fully managed by the harness:

  * Strategy configuration is controlled through `UpdateHarness`. You can still read/write events and query records directly through the Memory APIs.

  * Managed memory cannot be deleted directly through the Memory APIs. To turn managed memory into a regular AgentCore memory resource, you can disassociate it from the harness in two ways:

    * Use `UpdateHarness` to switch to BYO (`agentCoreMemoryConfiguration`) or disabled.

    * Pass `deleteManagedMemory=false` on deletion to disassociate instead - `DeleteHarness` cascade-deletes the managed memory by default.


### Available strategies

Strategy | Description  
---|---  
`SEMANTIC` |  Extracts factual knowledge from conversations, retrievable via semantic search.  
`SUMMARIZATION` |  Creates running summaries of conversations, scoped by actor and session.  
`USER_PREFERENCE` |  Captures user preferences and settings expressed during conversations.  
`EPISODIC` |  Records significant events and experiences as discrete episodes.  
  
## Add existing memory (BYO)

If you need advanced configuration beyond what managed memory provides - custom namespace templates, KMS encryption, or shared memory across multiple harnesses - attach an existing [AgentCore Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html>) instance instead.

###### Example

AWS CLI/boto3
    

Create a memory instance:

```bash
aws bedrock-agentcore-control create-memory \
  --name "MyMemory" \
  --event-expiry-duration 30 \
  --description "Memory for my harness"
```
Attach it to the harness:

```bash
aws bedrock-agentcore-control update-harness \
  --harness-id "MyHarness-UuFdkQoXSL" \
  --memory '{"optionalValue": {"agentCoreMemoryConfiguration": {"arn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:memory/MyMemory-abc123"}}}'
```
AgentCore CLI
     ```bash
     agentcore create --name myagent --memory-arn "arn:aws:bedrock-agentcore:us-west-2:123456789012:memory/MyMemory-abc123"
     agentcore deploy
     ```
## Disable memory

To disable memory entirely:

```bash
aws bedrock-agentcore-control update-harness \
  --harness-id "MyHarness-UuFdkQoXSL" \
  --memory '{"optionalValue": {"disabled": {}}}'
```
## Per-user memory scoping with actor ID

Pass `actorId` at invoke time to scope memory to a specific user. Each actor gets isolated short-term and long-term memory:

```text
response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    actorId="user-123",
    messages=[{"role": "user", "content": [{"text": "What do you remember about my preferences?"}]}],
)
```
## Long-term memory retrieval

When a harness has active memory strategies (managed or BYO), retrieval works automatically - the harness derives a retrieval configuration from the Memory instance’s active strategies. On each invocation, the agent queries relevant long-term memories and injects them into the conversation context before reasoning.

**Default behavior:**

  * Retrieval is configured automatically with default parameters (`topK=10`, `relevanceScore=0.2`) for each active strategy’s namespace.

  * No manual configuration needed for either managed or BYO memory.


**Override the defaults:** If you explicitly provide a `retrievalConfig` in the BYO memory configuration, your values take priority and no automatic derivation occurs. This lets you customize which namespaces are queried, adjust `topK` or `relevanceScore`, or disable retrieval for specific strategies.

```bash
aws bedrock-agentcore-control update-harness \
  --harness-id "MyHarness-UuFdkQoXSL" \
  --memory '{"optionalValue": {"agentCoreMemoryConfiguration": {"arn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:memory/MyMemory-abc123", "retrievalConfig": {"/facts/{actorId}/": {"topK": 5, "relevanceScore": 0.5, "strategyId": "FactExtractor-abc123"}}}}}'
```
###### Important

If you update your BYO Memory instance’s strategies (add or remove) after attaching it to a harness, call `UpdateHarness` to refresh the retrieval configuration. For managed memory, strategy changes through `UpdateHarness` refresh the configuration automatically.

## Context truncation

When conversation history grows beyond the model’s context window, the harness applies a truncation strategy. Configure this on the harness or override per invocation.

  * **`sliding_window` ** (default) - keeps the most recent N messages. Simple and predictable.

  * **`summarization` ** \- compresses older messages into a summary, preserving more context in fewer tokens.

  * **`none` ** \- no truncation. Use only if you manage context size yourself.


```bash
aws bedrock-agentcore-control update-harness \
  --harness-id "MyHarness-UuFdkQoXSL" \
  --truncation '{"strategy": "sliding_window", "slidingWindowConfig": {"numMessages": 30}}'
```
Learn more: [AgentCore Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html>), [create a memory store](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-create-a-memory-store.html>), [long-term memory strategies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-configuring-built-in-strategies.html>).

### Related topics

  * [Models and instructions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-models.html>) \- configure models and system prompts

  * [Environment and filesystem](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-environment.html>) \- environment, filesystem, and custom containers

  * [Skills](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-skills.html>) \- attach skills from Git, S3, or AWS Skills

  * [Security and access controls](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html>) \- execution role policies for memory access

  * [API Documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-get-started.html#api-documentation>)



