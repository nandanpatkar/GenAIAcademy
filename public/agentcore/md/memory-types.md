# Memory types - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-types.html

---

# Memory types

AgentCore Memory offers two types of memory that work together to create intelligent, context-aware AI agents:

###### Topics

  * Short-term memory

  * Long-term memory


## Short-term memory

Short-term memory stores raw interactions that help the agent maintain context within a single session. For example, in a shopping website’s [customer support AI agent](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-customer-scenario.html>) , short-term memory captures the entire conversation history as a series of events. Each customer question and agent response is saved as a separate event (or in batches, depending on your implementation). This lets the agent reload the entire conversation as it happened, maintaining context even if the service restarts or the customer returns later to continue the same interaction seamlessly.

When a customer interacts with your agent, each interaction can be captured as an event using the [CreateEvent](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_CreateEvent.html>) operation. Events can contain various types of data, including conversational exchanges (questions, answers, instructions) or structured information (product details, order status). Each event is associated with a session via a session identifier ( `sessionId` ), which you can define or let the system generate by default. You can use the `sessionId` parameter in future requests to maintain conversation context.

To load previous sessions/conversations or enrich context, your agent needs to access the raw interactions with the customer. Imagine a customer returns to follow up on their product support case from last week. To provide seamless assistance, the agent uses [ListSessions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_ListSessions.html>) to locate their previous support interactions. Through [ListEvents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_ListEvents.html>) , it retrieves the conversation history, understanding the reported issue, troubleshooting steps attempted, and any temporary solutions discussed. The agent uses [GetEvent](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_GetEvent.html>) to access specific information from key moments in past conversations. These operations work together to maintain support continuity across sessions, eliminating the need for customers to re-explain their issue or repeat troubleshooting steps already attempted.

### Event metadata

Event metadata lets you attach additional context information to your short-term memory events as key-value pairs. When creating events using the `CreateEvent` operation, you can include metadata that isn’t part of the core event content but provides valuable context for retrieval. For example, a travel booking agent can attach location metadata to events, making it easy to find all conversations that mentioned specific destinations. You can then use the `ListEvents` operation with metadata filters to efficiently retrieve events based on these attached properties, enabling your agent to quickly locate relevant conversation history without scanning through entire sessions. This capability is useful for agents that need to track and retrieve specific attributes across conversations, such as product categories in e-commerce, case types in customer support, or project identifiers in task management applications. Event metadata is not meant to store sensitive content, as it is not encrypted with customer managed key.

## Long-term memory

Long-term memory records store structured information extracted from raw agent interactions, which is retained across multiple sessions. Long-term memory preserves only the key insights such as summaries of the conversations, facts and knowledge, or user preferences. For example, if a customer tells the agent their preferred shoe brand during a conversation, the AI agent stores this as a long-term memory. Later, even in a different conversation, the agent can remember and suggest the shoe brand, making the interaction personalized and relevant.

Long-term memory generation is an asynchronous process that runs in the background and automatically extracts insights after raw conversation/context is stored in short-term memory via `CreateEvent` . This efficiently consolidates key information without interrupting live interactions. As part of the long-term memory generation, AgentCore Memory performs the following operations:

  * **Extraction** : Extracts information from raw interactions with the agent

  * **Consolidation** : Consolidates newly extracted information with existing information in the AgentCore Memory.


Once long-term memory records are generated, you can retrieve these extracted memories to enhance your agent’s responses. Extracted memories are stored as memory records and can be accessed using the [GetMemoryRecord](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_GetMemoryRecord.html>) , [ListMemoryRecords](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_ListMemoryRecords.html>) , or [RetrieveMemoryRecords](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_RetrieveMemoryRecords.html>) operations. The `RetrieveMemoryRecords` operation is powerful as it performs a semantic search to find memory records that are most relevant to the query. For example, when a customer asks about running shoes, the agent can use semantic search to retrieve related memory records, such as customer’s preferred shoe size, favorite shoe brands, and previous shoe purchases. This lets the AI support agent provide highly personalized recommendations without requiring the customer to repeat information they’ve shared before.

