# List events - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/short-term-list-events.html

---

# List events

The [ListEvents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_ListEvents.html>) operation is valuable for applications that need to reconstruct conversation histories, analyze interaction patterns, or implement memory-based features like conversation summarization and context awareness.

The `ListEvents` operation is a read-only operation that lists events from a specified session in AgentCore Memory instance. This paginated operation requires you to specify the `memoryId` , `actorId` , and `sessionId` as path parameters, and supports optional filtering through the `filter` parameter in the request body, letting you efficiently retrieve relevant events from your memory sessions. You can control whether payloads are included in the response using the `includePayloads` parameter (default is true), and limit the number of results with `maxResults`.

