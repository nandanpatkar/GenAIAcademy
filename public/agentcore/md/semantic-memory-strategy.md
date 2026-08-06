# Semantic memory strategy - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/semantic-memory-strategy.html

---

# Semantic memory strategy

The semantic memory strategy is designed to identify and extract key pieces of factual information and contextual knowledge from conversational data. This lets your agent to build a persistent knowledge base about the entities, events, and key details discussed during an interaction.

**Steps in the strategy**

The semantic memory strategy includes the following steps:

  * **Extraction** – Identifies useful insights from short-term memory to place into long-term memory as memory records.

  * **Consolidation** – Determines whether to write useful information to a new record or an existing record.


###### Note

The semantic strategy processes only `USER` and `ASSISTANT` role messages during extraction. For more information about roles in agent conversations, see [Conversational](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_Conversational.html>).

**Strategy output**

The semantic memory strategy returns facts as JSON objects, each representing a standalone personal fact about the user.

**Example of facts captured by this strategy**

  * An order number ( #XYZ-123 ) is associated with a specific support case.

  * A project’s deadline of October 25th.

  * The user is running version 2.1 of the software.


By referencing this stored knowledge, your agent can provide more accurate, context-aware responses, perform multi-step tasks that rely on previously stated information, and avoid asking users to repeat key details.

**Default namespace**

`/strategy/{memoryStrategyId}/actors/{actorId}/`

###### Topics

  * [System prompt for semantic memory strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-system-prompt.html>)



