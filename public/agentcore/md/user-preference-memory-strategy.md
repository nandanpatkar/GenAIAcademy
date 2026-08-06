# User preference memory strategy - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/user-preference-memory-strategy.html

---

# User preference memory strategy

The `UserPreferenceMemoryStrategy` is designed to automatically identify and extract user preferences, choices, and styles from conversational data. This lets your agent to learn from interactions and builds a persistent, dynamic profile of each user over time.

**Steps in the strategy**

The user preference strategy includes the following steps:

  * **Extraction** – Identifies useful insights from short-term memory to place into long-term memory as memory records.

  * **Consolidation** – Determines whether to write useful information to a new record or an existing record.


###### Note

The user preference strategy processes only `USER` and `ASSISTANT` role messages during extraction. For more information about roles in agent conversations, see [Conversational](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_Conversational.html>).

**Strategy output**

The user preference strategy returns JSON objects with context, preference, and categories, making it easier to capture user choices and decision patterns.

**Examples of insights captured by this strategy include:**

  * A customer’s preferred shipping carrier or shopping brand.

  * A developer’s preferred coding style or programming language.

  * A user’s communication preferences, such as a formal or informal tone.


By leveraging this strategy, your agent can deliver highly personalized experiences, such as offering tailored recommendations, adapting its responses to a user’s style, and anticipating needs based on past choices. This creates a more relevant and effective conversational experience.

**Default namespace**

`/strategy/{memoryStrategyId}/actors/{actorId}/`

###### Topics

  * [System prompt for user preference memory strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-user-prompt.html>)



