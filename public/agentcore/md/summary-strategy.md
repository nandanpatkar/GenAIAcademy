# Summary strategy - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/summary-strategy.html

---

# Summary strategy

The `SummaryStrategy` is responsible for generating condensed, real-time summaries of conversations within a single session. It captures key topics, main tasks, and decisions, providing a high-level overview of the dialogue.

**Steps in the strategy**

The summary strategy includes the following steps:

  * **Consolidation** – Determines whether to write useful information to a new record or an existing record.


**Strategy output**

The summary strategy returns XML-formatted output, where each `<topic>` tag represents a distinct area of the user’s memory. XML lets multiple topics to be captured and organized in a single summary while preserving clarity.

A single session can have multiple summary chunks, each representing a portion of the conversation. Together, these chunks form the complete summary for the entire session.

These summary chunks can be retrieved using the [ListMemoryRecords](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_ListMemoryRecords.html>) operation with namespace filter, or you can also perform semantic search over the summary chunks using the [RetrieveMemoryRecords](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_RetrieveMemoryRecords.html>) operation to retrieve only the relevant summary chunks for your query.

**Examples of insights captured by this strategy include:**

  * A summary of a support interaction, such as "The user reported an issue with order #XYZ-123 , and the agent initiated a replacement."

  * The outcome of a planning session, like "The team agreed to move the project deadline to Friday."


By referencing this summary, an agent can quickly recall the context of a long or complex conversation without needing to re-process the entire history. This is essential for maintaining conversational flow and for efficiently managing the context window of the foundation model.

**Default namespace**

`/strategy/{memoryStrategyId}/actor/{actorId}/session/{sessionId}/`

###### Note

`sessionId` is a required parameter for summary namespace since summaries are generated and maintained at session level.

###### Topics

  * [System prompt for summary strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-summary-prompt.html>)



