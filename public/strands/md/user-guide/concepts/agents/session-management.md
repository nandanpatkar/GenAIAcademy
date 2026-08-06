Session management in Strands Agents provides a robust mechanism for persisting agent state and conversation history across multiple interactions. This enables agents to maintain context and continuity even when the application restarts or when deployed in distributed environments.

## Overview

A session represents all of stateful information that is needed by agents and multi-agent systems to function, including:

**Single Agent Sessions**:

-   Conversation history (messages)
-   Agent state (key-value storage)
-   Other stateful information (like [Conversation Manager](lc:user-guide/concepts/agents/state#conversation-manager))

**Multi-Agent Sessions**:

-   Orchestrator state and configuration
-   Individual agent states and result within the orchestrator
-   Cross-agent shared state and context
-   Execution flow and node transition history

Strands provides built-in session persistence capabilities that automatically capture and restore this information, allowing agents to seamlessly continue conversations where they left off.

Beyond the built-in options, [third-party session managers](#third-party-session-managers) provide additional storage and memory capabilities.

## Basic Usage

### Single Agent Sessions

Simply create an agent with a session manager and use it:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.session.file_session_manager import FileSessionManager\n\n# Create a session manager with a unique session ID\nsession_manager = FileSessionManager(session_id=\"test-session\")\n\n# Create an agent with the session manager\nagent = Agent(session_manager=session_manager)\n\n# Use the agent - all messages and state are automatically persisted\nagent(\"Hello!\")  # This conversation is persisted\n```"
 },
 {
  "label": "TypeScript",
  "body": "`SessionManager` implements both [Plugin](lc:user-guide/concepts/plugins) (for agents) and `MultiAgentPlugin` (for orchestrators). The `sessionManager` constructor field is a convenience shorthand \u2014 you can also pass it directly in the `plugins` array:\n\n```typescript\nconst session = new SessionManager({\n  sessionId: 'test-session',\n  storage: new LocalFileStorage('./sessions/'),\n})\n\nconst agent = new Agent({ sessionManager: session })\n\n// Use the agent - all messages and state are automatically persisted\nawait agent.invoke('Hello!') // This conversation is persisted\n```\n\n```typescript\nconst session = new SessionManager({\n  sessionId: 'test-session',\n  storage: new LocalFileStorage('./sessions/'),\n})\n\n// Equivalent to passing via sessionManager field\nconst agent = new Agent({ plugins: [session] })\nawait agent.invoke('Hello!')\n```"
 }
]
```

The conversation, and associated state, is persisted to the underlying storage backend.

### Multi-Agent Sessions

Multi-agent systems (Graph/Swarm) can also use session management to persist their state.

```sa-tabs
[
 {
  "label": "Python",
  "body": "Caution\n\n> [!WARNING]\n>\n> Agents inside a multi-agent system must not have their own session manager \u2014 only the orchestrator should have one. Python will raise a `ValueError` if an agent with a session manager is added to a Graph or Swarm.\n\n```python\nfrom strands.multiagent import GraphBuilder\nfrom strands.session.file_session_manager import FileSessionManager\n\n# Create agents\nagent1 = Agent(name=\"researcher\")\nagent2 = Agent(name=\"writer\")\n\n# Create a session manager for the graph\nsession_manager = FileSessionManager(session_id=\"multi-agent-session\")\n\n# Create graph with session management\ngraph = Graph(\n    agents={\"researcher\": agent1, \"writer\": agent2},\n    session_manager=session_manager\n)\n\n# Use the graph - all orchestrator state is persisted\nresult = graph(\"Research and write about AI\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "Caution\n\n> [!WARNING]\n>\n> Agents inside a multi-agent system must not have their own session manager \u2014 only the orchestrator should have one. The orchestrator snapshots and restores each agent node\u2019s state on every execution, so an agent-level session manager would conflict with the orchestrator\u2019s persistence.\n\n```typescript\nconst session = new SessionManager({\n  sessionId: 'graph-session',\n  storage: new LocalFileStorage('./sessions/'),\n})\n\nconst researcher = new Agent({\n  id: 'researcher',\n  systemPrompt: 'You are a research specialist.',\n})\nconst writer = new Agent({\n  id: 'writer',\n  systemPrompt: 'You are a writing specialist.',\n})\n\nconst graph = new Graph({\n  nodes: [researcher, writer],\n  edges: [['researcher', 'writer']],\n  sessionManager: session,\n})\n\n// Orchestrator state is automatically persisted after each node completes\nconst result = await graph.invoke('Research and write about AI')\n```\n\nSwarm works the same way:\n\n```typescript\nconst session = new SessionManager({\n  sessionId: 'swarm-session',\n  storage: new LocalFileStorage('./sessions/'),\n})\n\nconst researcher = new Agent({\n  id: 'researcher',\n  description: 'Researches a topic and gathers key facts.',\n  systemPrompt: 'Research the answer, then hand off to the writer.',\n})\n\nconst writer = new Agent({\n  id: 'writer',\n  description: 'Writes a polished final answer.',\n  systemPrompt: 'Write the final answer. Do not hand off.',\n})\n\nconst swarm = new Swarm({\n  nodes: [researcher, writer],\n  start: 'researcher',\n  sessionManager: session,\n})\n\nconst result = await swarm.invoke('Explain quantum computing')\n```"
 }
]
```

Multi-agent session managers only track the current state of the Graph/Swarm execution and do not persist individual agent conversation histories.

## Storage Backends

```sa-tabs
[
 {
  "label": "Python",
  "body": "Strands offers two built-in session managers:\n\n| Session Manager | Persistence | Best for |\n| --- | --- | --- |\n| [`FileSessionManager`](lc:api/python/strands.session.file_session_manager#FileSessionManager) | Local disk | Development, single-machine |\n| [`S3SessionManager`](lc:api/python/strands.session.s3_session_manager#S3SessionManager) | Amazon S3 | Production, distributed |\n\n```python\nfrom strands import Agent\nfrom strands.session.file_session_manager import FileSessionManager\nfrom strands.session.s3_session_manager import S3SessionManager\n\n# File-based persistence\nsession_manager = FileSessionManager(\n    session_id=\"user-123\",\n    storage_dir=\"/path/to/sessions\"\n)\n\n# S3-based persistence\nsession_manager = S3SessionManager(\n    session_id=\"user-123\",\n    bucket=\"my-agent-sessions\",\n    prefix=\"production/\",\n)\n\nagent = Agent(session_manager=session_manager)\n```"
 },
 {
  "label": "TypeScript",
  "body": "Session management accepts any [Storage](lc:user-guide/concepts/storage) backend. Choose one based on your durability needs:\n\n| Backend | Persistence | Best for |\n| --- | --- | --- |\n| `LocalFileStorage` | Local disk | Development, single-machine |\n| `S3Storage` | Amazon S3 | Production, distributed |\n\nSee [Storage](lc:user-guide/concepts/storage) for full details on each backend.\n\n```typescript\nconst session = new SessionManager({\n  sessionId: 'user-123',\n  storage: new LocalFileStorage('./sessions/'),\n})\n\nconst agent = new Agent({ sessionManager: session })\nawait agent.invoke(\"Hello, I'm a new user!\")\n```\n\n```typescript\nconst session = new SessionManager({\n  sessionId: 'user-456',\n  storage: new S3Storage('my-agent-sessions', {\n    prefix: 'production/',\n    s3Client: new S3Client({ region: 'us-west-2' }),\n  }),\n})\n\nconst agent = new Agent({ sessionManager: session })\nawait agent.invoke('Tell me about AWS S3')\n```"
 }
]
```

### Required S3 Permissions

To use S3-backed session storage, your AWS credentials must have the following permissions:

-   `s3:PutObject` - To create and update session data
-   `s3:GetObject` - To retrieve session data
-   `s3:DeleteObject` - To delete session data
-   `s3:ListBucket` - To list objects in the bucket

Here’s a sample IAM policy that grants these permissions for a specific bucket:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::my-agent-sessions/*"
        },
        {
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::my-agent-sessions"
        }
    ]
}
```

## How Session Management Works

### Session Persistence Triggers

Session persistence is automatically triggered by lifecycle events in the agent:

**Single Agent Events**

```sa-tabs
[
 {
  "label": "Python",
  "body": "-   **Agent Initialization**: When an agent is created with a session manager, it automatically restores any existing state and messages from the session.\n-   **Message Addition**: When a new message is added to the conversation, it\u2019s automatically persisted to the session.\n-   **Agent Invocation**: After each agent invocation, the agent state is synchronized with the session to capture any updates.\n-   **Message Redaction**: When sensitive information needs to be redacted, the session manager can replace the original message with a redacted version while maintaining conversation flow."
 },
 {
  "label": "TypeScript",
  "body": "-   **Agent Initialization**: Restores state from `snapshot_latest` if it exists.\n-   **Message Addition** (`saveLatestOn: 'message'`): Saves after every message and after model calls with guardrail redactions.\n-   **Agent Invocation** (`saveLatestOn: 'invocation'`, default): Saves after each invocation completes.\n-   **Snapshot Trigger**: Creates an immutable checkpoint when the `snapshotTrigger` callback returns `true`.\n\nSee [Basic Usage](#basic-usage) for configuration examples."
 }
]
```

**Multi-Agent Events**:

```sa-tabs
[
 {
  "label": "Python",
  "body": "-   **Multi-Agent Initialization**: Restores orchestrator state from the session.\n-   **Node Execution**: Synchronizes orchestrator state after node transitions.\n-   **Multi-Agent Invocation**: Captures final orchestrator state after execution."
 },
 {
  "label": "TypeScript",
  "body": "-   **Before Multi-Agent Invocation**: Restores orchestrator state from `snapshot_latest` on first invocation.\n-   **After Node Call** (`multiAgentSaveLatestOn: 'node'`, default): Saves after each node completes, enabling resume from the last completed node after a crash.\n-   **After Multi-Agent Invocation** (`multiAgentSaveLatestOn: 'invocation'`): Saves after the full orchestrator invocation completes (lower I/O, but only captures state at invocation boundaries).\n\n```typescript\nconst session = new SessionManager({\n  sessionId: 'my-session',\n  storage: new LocalFileStorage('./sessions/'),\n  // Save orchestrator state after each node completes (default)\n  multiAgentSaveLatestOn: 'node',\n  // Or save only after the full orchestrator invocation completes:\n  // multiAgentSaveLatestOn: 'invocation',\n})\n```"
 }
]
```

> [!NOTE] Direct Message Modifications Not Persisted
>
> After initializing the agent, direct modifications to `agent.messages` will not be persisted. Utilize the [Conversation Manager](lc:user-guide/concepts/agents/conversation-management) to help manage context of the agent in a way that can be persisted.

## Immutable Snapshots *(TypeScript only)*

In addition to `snapshot_latest`, the TypeScript SDK supports **immutable snapshots** — append-only checkpoints identified by UUID v7. These enable time-travel restore: you can restore the agent to any prior checkpoint, not just the latest state.

### Creating Immutable Snapshots

Use the `snapshotTrigger` callback to control when an immutable snapshot is created. The callback receives the current agent data and returns `true` to trigger a snapshot:

```typescript
const session = new SessionManager({
  sessionId: 'my-session',
  storage: new LocalFileStorage('./sessions/'),
  // Create an immutable snapshot after every 4 messages
  snapshotTrigger: ({ agentData }) => agentData.messages.length % 4 === 0,
})

const agent = new Agent({ sessionManager: session })
await agent.invoke('First message') // 2 messages — no snapshot
await agent.invoke('Second message') // 4 messages — immutable snapshot created
```

### Listing and Restoring Snapshots

Snapshot IDs are UUID v7, so they sort lexicographically in chronological order. Use `listSnapshotIds` on the `SessionManager` to retrieve them, then pass a `snapshotId` to `restoreSnapshot`:

```typescript
const storage = new LocalFileStorage('./sessions/')

const session = new SessionManager({
  sessionId: 'my-session',
  storage,
})
const agent = new Agent({ sessionManager: session })
await agent.initialize()

// List all immutable snapshot IDs (chronological order)
const snapshotIds = await session.listSnapshotIds({
  target: agent,
})

// Restore agent to a specific checkpoint
await session.restoreSnapshot({
  target: agent,
  snapshotId: snapshotIds[0]!,
})
```

## Deleting Sessions *(TypeScript only)*

To remove all snapshots and manifests for a session, call `deleteSession()` on the `SessionManager`. This removes the entire session root directory (filesystem) or all objects under the session prefix (S3):

```typescript
const session = new SessionManager({
  sessionId: 'my-session',
  storage: new LocalFileStorage('./sessions/'),
})

// Remove all snapshots and manifests for this session
await session.deleteSession()
```

## Data Models

```sa-tabs
[
 {
  "label": "Python",
  "body": "Session data is stored using these key data models:\n\n**Session**\n\nThe [`Session`](lc:api/python/strands.types.session#Session) model is the top-level container for session data:\n\n-   **Purpose**: Provides a namespace for organizing multiple agents and their interactions\n-   **Key Fields**:\n    -   `session_id`: Unique identifier for the session\n    -   `session_type`: Type of session (currently `\"AGENT\"` for both agent & multiagent in order to keep backward compatibility)\n    -   `created_at`: ISO format timestamp of when the session was created\n    -   `updated_at`: ISO format timestamp of when the session was last updated\n\n**SessionAgent**\n\nThe [`SessionAgent`](lc:api/python/strands.types.session#SessionAgent) model stores agent-specific data:\n\n-   **Purpose**: Maintains the state and configuration of a specific agent within a session\n-   **Key Fields**:\n    -   `agent_id`: Unique identifier for the agent within the session\n    -   `state`: Dictionary containing the agent\u2019s state data (key-value pairs)\n    -   `conversation_manager_state`: Dictionary containing the state of the conversation manager\n    -   `created_at`: ISO format timestamp of when the agent was created\n    -   `updated_at`: ISO format timestamp of when the agent was last updated\n\n**SessionMessage**\n\nThe [`SessionMessage`](lc:api/python/strands.types.session#SessionMessage) model stores individual messages in the conversation:\n\n-   **Purpose**: Preserves the conversation history with support for message redaction\n-   **Key Fields**:\n    -   `message`: The original message content (role, content blocks)\n    -   `redact_message`: Optional redacted version of the message (used when sensitive information is detected)\n    -   `message_id`: Index of the message in the agent\u2019s messages array\n    -   `created_at`: ISO format timestamp of when the message was created\n    -   `updated_at`: ISO format timestamp of when the message was last updated\n\nThese data models work together to provide a complete representation of an agent\u2019s state and conversation history. The session management system handles serialization and deserialization of these models, including special handling for binary data using base64 encoding.\n\n**Multi-Agent State**\n\nMulti-agent systems serialize their state as JSON objects containing:\n\n-   **Orchestrator Configuration**: Settings, parameters, and execution preferences\n-   **Node State**: Current execution state and node transition history\n-   **Shared Context**: Cross-agent shared state and variables"
 },
 {
  "label": "TypeScript",
  "body": "The TypeScript SDK stores session state as a `Snapshot` object written to JSON. Each snapshot contains:\n\n-   `data.messages`: The full conversation history\n-   `data.state`: Agent key-value state\n-   `data.systemPrompt`: The agent\u2019s system prompt\n-   `schemaVersion`: Schema version for forward compatibility\n-   `createdAt`: ISO 8601 timestamp\n\nThere are two kinds of snapshots:\n\n-   **`snapshot_latest.json`**: A single mutable file overwritten on each save. Used to resume the most recent state after a restart.\n-   **Immutable snapshots** (`immutable_history/snapshot_<uuid7>.json`): Append-only checkpoints created when `snapshotTrigger` fires. Used for time-travel restore."
 }
]
```

## Third-Party Session Managers

The following third-party session managers extend Strands with additional storage and memory capabilities:

| Session Manager | Provider | Description | Documentation |
| --- | --- | --- | --- |
| AgentCoreMemorySessionManager | Amazon | Advanced memory with intelligent retrieval using Amazon Bedrock AgentCore Memory. Supports both short-term memory (STM) and long-term memory (LTM) with strategies for user preferences, facts, and session summaries. | [View Documentation](lc:community/session-managers/agentcore-memory) |
| **Contribute Your Own** | Community | Have you built a session manager? Share it with the community! | [Learn How](lc:community/community-packages) |

## Custom Session Repositories

For advanced use cases, you can implement your own session storage backend.

```sa-tabs
[
 {
  "label": "Python",
  "body": "Create a custom session repository by implementing the `SessionRepository` interface:\n\n```python\nfrom typing import Optional\nfrom strands import Agent\nfrom strands.session.repository_session_manager import RepositorySessionManager\nfrom strands.session.session_repository import SessionRepository\nfrom strands.types.session import Session, SessionAgent, SessionMessage\n\nclass CustomSessionRepository(SessionRepository):\n    \"\"\"Custom session repository implementation.\"\"\"\n\n    def __init__(self):\n        \"\"\"Initialize with your custom storage backend.\"\"\"\n        # Initialize your storage backend (e.g., database connection)\n        self.db = YourDatabaseClient()\n\n    def create_session(self, session: Session) -> Session:\n        \"\"\"Create a new session.\"\"\"\n        self.db.sessions.insert(asdict(session))\n        return session\n\n    def read_session(self, session_id: str) -> Optional[Session]:\n        \"\"\"Read a session by ID.\"\"\"\n        data = self.db.sessions.find_one({\"session_id\": session_id})\n        if data:\n            return Session.from_dict(data)\n        return None\n\n    # Implement other required methods...\n    # create_agent, read_agent, update_agent\n    # create_message, read_message, update_message, list_messages\n\n# Use your custom repository with RepositorySessionManager\ncustom_repo = CustomSessionRepository()\nsession_manager = RepositorySessionManager(\n    session_id=\"user-789\",\n    session_repository=custom_repo\n)\n\nagent = Agent(session_manager=session_manager)\n```"
 },
 {
  "label": "TypeScript",
  "body": "The simplest approach is to pass any [Storage](lc:user-guide/concepts/storage) backend directly \u2014 the `SessionManager` wraps it automatically. For full control, you can implement the `SnapshotStorage` interface:\n\n```typescript\n// Implement SnapshotStorage to plug in any backend\nclass MyStorage implements SnapshotStorage {\n  async saveSnapshot({\n    location,\n    snapshotId,\n    snapshot,\n  }: {\n    location: SnapshotLocation\n    snapshotId: string\n    isLatest: boolean\n    snapshot: Snapshot\n  }) {\n    // Store the snapshot JSON keyed by location + snapshotId\n  }\n\n  async loadSnapshot({\n    location,\n    snapshotId,\n  }: {\n    location: SnapshotLocation\n    snapshotId?: string\n  }) {\n    // Return the snapshot, or null if not found\n    return null\n  }\n\n  async listSnapshotIds({\n    location,\n  }: {\n    location: SnapshotLocation\n    limit?: number\n    startAfter?: string\n  }) {\n    // Return immutable snapshot IDs sorted chronologically\n    return []\n  }\n\n  async deleteSession({ sessionId }: { sessionId: string }) {\n    // Remove all stored data for this session\n  }\n\n  async loadManifest({\n    location,\n  }: {\n    location: SnapshotLocation\n  }): Promise<SnapshotManifest> {\n    return {\n      schemaVersion: '1',\n      updatedAt: new Date().toISOString(),\n    }\n  }\n\n  async saveManifest({\n    location,\n    manifest,\n  }: {\n    location: SnapshotLocation\n    manifest: SnapshotManifest\n  }) {\n    // Persist the manifest\n  }\n}\n\nconst agent = new Agent({\n  sessionManager: new SessionManager({\n    sessionId: 'user-789',\n    storage: { snapshot: new MyStorage() },\n  }),\n})\n```"
 }
]
```

This approach allows you to store session data in any backend system while leveraging the built-in session management logic.

## Data Layout

Both file and S3 backends use the same key structure:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```plaintext\n<root>/\n\u2514\u2500\u2500 session_<session_id>/\n    \u251c\u2500\u2500 session.json\n    \u251c\u2500\u2500 agents/\n    \u2502   \u2514\u2500\u2500 agent_<agent_id>/\n    \u2502       \u251c\u2500\u2500 agent.json\n    \u2502       \u2514\u2500\u2500 messages/\n    \u2502           \u251c\u2500\u2500 message_0.json\n    \u2502           \u2514\u2500\u2500 message_1.json\n    \u2514\u2500\u2500 multi_agents/\n        \u2514\u2500\u2500 multi_agent_<orchestrator_id>/\n            \u2514\u2500\u2500 multi_agent.json\n```"
 },
 {
  "label": "TypeScript",
  "body": "```plaintext\n<root>/\n\u2514\u2500\u2500 <sessionId>/\n    \u2514\u2500\u2500 scopes/\n        \u251c\u2500\u2500 agent/\n        \u2502   \u2514\u2500\u2500 <agentId>/\n        \u2502       \u2514\u2500\u2500 snapshots/\n        \u2502           \u251c\u2500\u2500 snapshot_latest.json\n        \u2502           \u2514\u2500\u2500 immutable_history/\n        \u2502               \u2514\u2500\u2500 snapshot_<uuid7>.json\n        \u2514\u2500\u2500 multiAgent/\n            \u2514\u2500\u2500 <orchestratorId>/\n                \u2514\u2500\u2500 snapshots/\n                    \u2514\u2500\u2500 snapshot_latest.json\n```"
 }
]
```

## Session Persistence Best Practices

When implementing session persistence in your applications, consider these best practices:

-   **Use Unique Session IDs**: Generate unique session IDs for each user or conversation context to prevent data overlap.
-   **Session Cleanup**: Implement a strategy for cleaning up old or inactive sessions. Consider adding TTL (Time To Live) for sessions in production environments.
-   **Understand Persistence Triggers**: Remember that changes to agent state or messages are only persisted during specific lifecycle events.
-   **Concurrent Access**: Session managers are not thread-safe; use appropriate locking for concurrent access.
-   **Secure Storage Directories**: The session storage directory is a trusted data store. Restrict filesystem permissions so that only the agent process can read and write to it. In shared or multi-tenant environments (shared volumes, containers), be aware that the SDK does not block symlinks in the session storage directory. If an attacker with write access to the storage directory creates a symlink (e.g., `message_0.json` pointing to an arbitrary file), the SDK will follow it, which could cause sensitive file contents to be loaded into the agent’s conversation history.

## Related pages

- [State Management](lc:user-guide/concepts/agents/state) (3 shared tags)
- [Bidirectional Streaming Session Management](lc:user-guide/concepts/bidirectional-streaming/session-management) (2 shared tags)
- [Serialization](lc:user-guide/evals-sdk/how-to/serialization) (1 shared tag)
- [Storage](lc:user-guide/concepts/storage) (1 shared tag)
- [OpenAI Responses API](lc:user-guide/concepts/model-providers/openai-responses) (1 shared tag)
- [Conversation Management](lc:user-guide/concepts/agents/conversation-management) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/session/session_manager.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/session_manager.py)
- [harness-sdk/strands-py/src/strands/session/file_session_manager.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/file_session_manager.py)
- [harness-sdk/strands-py/src/strands/session/s3_session_manager.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py)

### TypeScript

- [harness-sdk/strands-ts/src/session/session-manager.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/session/session-manager.ts)
