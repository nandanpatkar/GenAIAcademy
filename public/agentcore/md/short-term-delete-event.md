# Delete an event - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/short-term-delete-event.html

---

# Delete an event

The [DeleteEvent](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_DeleteEvent.html>) operation removes individual events from your AgentCore Memory. This operation helps maintain data privacy and relevance by letting you selectively remove specific events from a session while preserving the broader context and relationship structure within your application’s memory.

###### Note

These are manual deletion operations, and do not overlap with automatic deletion of events based on the `eventExpiryDuration` parameter set at the time of [CreateEvent](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_CreateEvent.html>) operation. Also deleting an event doesn’t remove the structured information derived out of it from the long term memory. For more information, see [DeleteMemoryRecord](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_DeleteMemoryRecord.html>).

