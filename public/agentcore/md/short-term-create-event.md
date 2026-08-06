# Create an event - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/short-term-create-event.html

---

# Create an event

Events are the fundamental units of short-term from which structured informations are extracted into long-term memory in AgentCore Memory. The [CreateEvent](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_CreateEvent.html>) operation lets you store various types of data within AgentCore Memory, organized by an actor and session. Events are scoped within memory under:

**ActorId**
    

Identifies the entity associated with the event, such as end-users or agent/user combinations

**SessionId**
    

Groups related events together, such as a conversation session

The `CreateEvent` operation stores a new immutable event within a specified memory session. Events represent individual pieces of information that your agent wants to remember, such as conversation messages, user actions, or system events.

This operation is useful for:

  * Recording conversation history between users, agents and tools

  * Storing user interactions and behaviors

  * Capturing system events and state changes

  * Building a chronological record of activities within a session


For example code, see [Scenario: A customer support AI agent using AgentCore Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-customer-scenario.html>).

## Event payload types

The `payload` parameter accepts a list of payload items, letting you store different types of data in a single event. Common payload types include:

**Conversational**
    

For storing conversation messages with roles (for example, "user" or "assistant") and content.

**Blob**
    

For storing binary format data, such as images and documents, or data that is unique to your agent, such as data stored in JSON format.

###### Note

Currently, only conversational data flows into long-term memory.

## Event branching

The `branch` parameter lets you organize events through advanced branching. This is useful for scenarios like message editing or alternative conversation paths. For example, suppose you have a long-running conversation, and you realize you’re interested in exploring an alternative conversation starting from 5 messages ago. You can use the `branch` parameter to start a new conversation from that message, stored in the new branch — which lets you also return to the original conversation. And more mundanely, this is useful if you want to let your user edit their most recent message (in case the user presses enter early or has a typo) and continue the conversation.

When creating a branch, you specify:

**name**
    

A descriptive name for the branch, such as "edited-conversation".

**rootEventId**
    

The ID of the event from which the branch originates.

Here’s an example of creating a branched event to represent an edited message:

```json
{
  "memoryId": "mem-12345abcdef",
  "actorId": "/agent-support-123/customer-456",
  "sessionId": "session-789",
  "eventTimestamp": 1718806000000,
  "payload": [
    {
      "Conversational": {
        "content": "I'm looking for a waterproof action camera for extreme sports.",
        "role": "user"
      }
    }
  ],
  "branch": {
    "name": "edited-conversation",
    "rootEventId": "evt-67890"
  }
}
```
