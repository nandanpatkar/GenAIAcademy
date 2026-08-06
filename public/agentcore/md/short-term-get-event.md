# Get an event - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/short-term-get-event.html

---

# Get an event

The [GetEvent](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_GetEvent.html>) API retrieves a specific raw event by its identifier from short-term memory in AgentCore Memory. This API requires you to specify the `memoryId` , `actorId` , `sessionId` , and `eventId` as path parameters in the request URL.

```python
import boto3

data_client = boto3.client('bedrock-agentcore')

response = data_client.get_event(
    memoryId="your-memory-id",
    actorId="your-actor-id",
    sessionId="your-session-id",
    eventId="your-event-id"
)

event = response['event']
print(f"Event ID: {event['eventId']}")
print(f"Timestamp: {event['eventTimestamp']}")
print(f"Payload: {event['payload']}")
```
