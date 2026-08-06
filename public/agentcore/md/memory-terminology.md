# Memory terminology - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-terminology.html

---

# Memory terminology

**AgentCore Memory**
    

The primary, top-level container for your agent’s memory resource. Each AgentCore Memory holds all the events and extracted insights for agents or applications.

**Memory strategy**
    

Memory strategies are configurable rules that determine how to process information from short-term memory into long-term memory. They determine what type of information is kept, turning raw conversations into structured and useful knowledge.

**Namespace**
    

A namespace is a structured path used to logically group and organize long-term memories. By defining a namespace in your memory strategy, you maintain that all extracted memories are organized under predictable paths, which aids in retrieval, filtering, and access control.

**Memory record**
    

A memory record is a structured unit of information within the memory resource. Each record is associated with a unique identifier and is stored within a specified namespace, allowing for organized retrieval and management.

**Session**
    

Represents a single, continuous interaction between a user and the agent, such as a customer support conversation. A unique `sessionId` is used to group all events within that conversation.

**Actor**
    

Represents the entity interacting with the agent. This can be a human user, another agent, or a system (software or hardware component) that initiates interactions with the agent. A unique `actorId` maintains that memory records are correctly associated with the individual or system.

**Event**
    

Event is the fundamental unit of short-term memory. It represents a discrete interaction or activity within a session, associated with a specific actor. Events are stored using the [CreateEvent](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_CreateEvent.html>) operation and are organized by `actorId` and `sessionId` . Each event is immutable and timestamped, capturing real-time data such as user messages, system actions, or tool invocations.

**Event metadata**
    

Event metadata refers to the supplementary information that provides context about an event in an AgentCore Memory. While not always explicitly required, metadata can enhance the organization and retrieval of events.

