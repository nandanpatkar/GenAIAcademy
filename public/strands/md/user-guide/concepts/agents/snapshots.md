Snapshots capture agent state at a point in time so you can save and restore it later. You choose which fields to include — either by picking a preset (a preconfigured set of fields) or by specifying fields directly — and you can further refine with includes and excludes. Snapshots are plain JSON-serializable objects — persistence is up to you.

## Basic Usage

### Taking a Snapshot

Use the `"session"` preset to capture the most common fields:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\nagent = Agent(system_prompt=\"You are a helpful assistant\")\nagent(\"Hello!\")\nagent.state.set(\"user_id\", \"user-123\")\n\n# Capture a snapshot with the session preset\nsnapshot = agent.take_snapshot(preset=\"session\")\n\nprint(snapshot.schema_version)  # \"1.0\"\nprint(snapshot.created_at)      # ISO 8601 timestamp\nprint(snapshot.data.keys())     # messages, state, conversation_manager_state, interrupt_state, model_state\n```\n\nThe `\"session\"` preset captures `messages`, `state`, `conversation_manager_state`, `interrupt_state`, and `model_state`. The `system_prompt` field is not included by default \u2014 see [Field Selection](#field-selection) to customize which fields are captured."
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\n\nconst agent = new Agent({ systemPrompt: 'You are a helpful assistant' })\nawait agent.invoke('Hello!')\nagent.appState.set('user_id', 'user-123')\n\n// Capture a snapshot with the session preset\nconst snapshot = agent.takeSnapshot({ preset: 'session' })\n\nconsole.log(snapshot.schemaVersion) // \"1.0\"\nconsole.log(snapshot.createdAt) // ISO 8601 timestamp\nconsole.log(Object.keys(snapshot.data)) // messages, state, systemPrompt, modelState, interrupts\n```\n\nThe `\"session\"` preset captures `messages`, `state`, `systemPrompt`, `modelState`, and `interrupts`."
 }
]
```

### Restoring a Snapshot

Load a snapshot to restore the agent to a previous state:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\nagent = Agent(system_prompt=\"You are a helpful assistant\")\nagent(\"Hello!\")\n\n# Take a snapshot\nsnapshot = agent.take_snapshot(preset=\"session\")\n\n# Continue the conversation\nagent(\"Tell me a joke\")\nagent(\"Tell me another one\")\n\n# Restore to the earlier state\nagent.load_snapshot(snapshot)\n\n# The agent is back to the state after \"Hello!\"\nprint(len(agent.messages))  # Only the messages from before the jokes\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\n\nconst agent = new Agent({ systemPrompt: 'You are a helpful assistant' })\nawait agent.invoke('Hello!')\n\n// Take a snapshot\nconst snapshot = agent.takeSnapshot({ preset: 'session' })\n\n// Continue the conversation\nawait agent.invoke('Tell me a joke')\nawait agent.invoke('Tell me another one')\n\n// Restore to the earlier state\nagent.loadSnapshot(snapshot)\n\n// The agent is back to the state after \"Hello!\"\nconsole.log(agent.messages.length) // Only the messages from before the jokes\n```"
 }
]
```

Only fields present in the snapshot are restored. If a field was not included when the snapshot was taken, the agent’s current value for that field is left unchanged.

> [!WARNING] Snapshots are restored verbatim
>
> A snapshot’s `messages` are loaded into the agent as-is, including any tool-call content they carry. Load snapshots only from a source you control. A snapshot influenced by an untrusted party is untrusted input: its content reaches the model, and in the Python SDK a trailing tool-call block runs a tool directly on the next invocation. See [Trusted Message History](lc:user-guide/safety-security/trusted-message-history).

## Field Selection

Snapshots support flexible field selection through presets, includes, and excludes. The resolution order is: **preset → include → exclude** — start with the fields defined by the preset, add any fields listed in `include`, then remove any fields listed in `exclude`.

```sa-tabs
[
 {
  "label": "Python",
  "body": "| Field | Description |\n| --- | --- |\n| `messages` | Conversation history |\n| `state` | Agent key-value state |\n| `conversation_manager_state` | Conversation manager internal state |\n| `interrupt_state` | Human-in-the-loop interrupt state |\n| `system_prompt` | System prompt content |\n| `model_state` | Model provider state (e.g. response IDs for stateful models) |"
 },
 {
  "label": "TypeScript",
  "body": "| Field | Description |\n| --- | --- |\n| `messages` | Conversation history |\n| `state` | Agent key-value state (appState) |\n| `systemPrompt` | System prompt content |\n| `modelState` | Model provider state (e.g. response IDs for stateful models) |\n| `interrupts` | Human-in-the-loop interrupt state |"
 }
]
```

Note

> [!NOTE]
>
> The `"session"` preset is currently the only available preset. It includes the same fields that the [Session Manager](lc:user-guide/concepts/agents/session-management) persists by default.

Use `include` to select specific fields without a preset, or to add fields on top of a preset. Use `exclude` to remove fields from a preset:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\n# Capture only messages and state (no preset)\nsnapshot = agent.take_snapshot(include=[\"messages\", \"state\"])\n\n# Session preset plus system_prompt\nsnapshot = agent.take_snapshot(preset=\"session\", include=[\"system_prompt\"])\n\n# Session preset minus interrupt_state\nsnapshot = agent.take_snapshot(preset=\"session\", exclude=[\"interrupt_state\"])\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\n\n// Capture only messages and state (no preset)\nconst messagesOnly = agent.takeSnapshot({ include: ['messages', 'state'] })\n\n// Session preset minus systemPrompt\nconst noPrompt = agent.takeSnapshot({ preset: 'session', exclude: ['systemPrompt'] })\n```"
 }
]
```

## Application Data

Snapshots support an `app_data``appData` field for storing application-owned data alongside the agent state. Strands does not read or modify this data — it’s passed through verbatim.

This is useful for attaching metadata like a display name for the snapshot, the current step in a workflow, user preferences, or any other context your application needs to associate with a particular point in time.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nsnapshot = agent.take_snapshot(\n    preset=\"session\",\n    app_data={\n        \"snapshot_label\": \"After onboarding\",\n        \"workflow_step\": 3,\n        \"user_display_name\": \"Alice\",\n    },\n)\n\n# Access app data later\nprint(snapshot.app_data[\"snapshot_label\"])     # \"After onboarding\"\nprint(snapshot.app_data[\"user_display_name\"])  # \"Alice\"\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\n\nconst snapshot = agent.takeSnapshot({\n  preset: 'session',\n  appData: {\n    snapshotLabel: 'After onboarding',\n    workflowStep: 3,\n    userDisplayName: 'Alice',\n  },\n})\n\n// Access app data later\nconsole.log(snapshot.appData.snapshotLabel) // \"After onboarding\"\nconsole.log(snapshot.appData.userDisplayName) // \"Alice\"\n```"
 }
]
```

## Serialization

Snapshots are JSON-serializable, making them easy to persist to any storage backend.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nimport json\nfrom strands import Agent, Snapshot\n\nagent = Agent()\nagent(\"Hello!\")\n\n# Take a snapshot\nsnapshot = agent.take_snapshot(preset=\"session\")\n\n# Serialize to JSON\njson_str = json.dumps(snapshot.to_dict())\n\n# Store to file, database, S3, etc.\nwith open(\"snapshot.json\", \"w\") as f:\n    f.write(json_str)\n\n# Later, restore from JSON\nwith open(\"snapshot.json\", \"r\") as f:\n    data = json.loads(f.read())\n\nrestored_snapshot = Snapshot.from_dict(data)\n\n# Load into a new agent\nnew_agent = Agent()\nnew_agent.load_snapshot(restored_snapshot)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, type Snapshot } from '@strands-agents/sdk'\n\nconst agent = new Agent()\nawait agent.invoke('Hello!')\n\n// Take a snapshot\nconst snapshot = agent.takeSnapshot({ preset: 'session' })\n\n// Serialize to JSON string\nconst jsonString = JSON.stringify(snapshot)\n\n// Store to file, database, S3, etc.\n// ...\n\n// Later, restore from JSON\nconst parsed: Snapshot = JSON.parse(jsonString)\n\n// Load into a new agent\nconst newAgent = new Agent()\nnewAgent.loadSnapshot(parsed)\n```"
 }
]
```

## Use Cases

### Checkpointing

Save agent state at key points in a workflow so you can resume from the last checkpoint if something goes wrong:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\nagent = Agent(system_prompt=\"You are a research assistant\")\n\n# Step 1: Gather information\nagent(\"Research the latest trends in AI agents\")\ncheckpoint_1 = agent.take_snapshot(preset=\"session\")\n\n# Step 2: Analyze (might fail or produce poor results)\nagent(\"Analyze the key themes and summarize\")\ncheckpoint_2 = agent.take_snapshot(preset=\"session\")\n\n# If step 2 didn't go well, roll back to checkpoint 1\nagent.load_snapshot(checkpoint_1)\nagent(\"Focus specifically on multi-agent systems and summarize\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\n\nconst agent = new Agent({ systemPrompt: 'You are a research assistant' })\n\n// Step 1: Gather information\nawait agent.invoke('Research the latest trends in AI agents')\nconst checkpoint1 = agent.takeSnapshot({ preset: 'session' })\n\n// Step 2: Analyze (might fail or produce poor results)\nawait agent.invoke('Analyze the key themes and summarize')\nconst checkpoint2 = agent.takeSnapshot({ preset: 'session' })\n\n// If step 2 didn't go well, roll back to checkpoint 1\nagent.loadSnapshot(checkpoint1)\nawait agent.invoke('Focus specifically on multi-agent systems and summarize')\n```"
 }
]
```

### Branching Conversations

Create multiple conversation branches from the same starting point:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\nagent = Agent(system_prompt=\"You are a creative writer\")\nagent(\"Write the opening paragraph of a mystery novel\")\n\n# Save the branch point\nbranch_point = agent.take_snapshot(preset=\"session\")\n\n# Branch A: formal tone\nagent(\"Continue in a formal, academic tone\")\nformal_snapshot = agent.take_snapshot(preset=\"session\")\n\n# Branch B: go back and try casual tone\nagent.load_snapshot(branch_point)\nagent(\"Continue in a casual, conversational tone\")\ncasual_snapshot = agent.take_snapshot(preset=\"session\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\n\nconst agent = new Agent({ systemPrompt: 'You are a creative writer' })\nawait agent.invoke('Write the opening paragraph of a mystery novel')\n\n// Save the branch point\nconst branchPoint = agent.takeSnapshot({ preset: 'session' })\n\n// Branch A: formal tone\nawait agent.invoke('Continue in a formal, academic tone')\nconst formalSnapshot = agent.takeSnapshot({ preset: 'session' })\n\n// Branch B: go back and try casual tone\nagent.loadSnapshot(branchPoint)\nawait agent.invoke('Continue in a casual, conversational tone')\nconst casualSnapshot = agent.takeSnapshot({ preset: 'session' })\n```"
 }
]
```

## Relationship to Session Management

[Session management](lc:user-guide/concepts/agents/session-management) handles persistence automatically — state is saved and restored at the right lifecycle points without you writing any persistence code. Snapshots give you manual control: you decide when to capture state, what to include, and where to store it. Use session management when you want hands-off persistence, and snapshots when you need precise control over save points.

## See Also

-   [State Management](lc:user-guide/concepts/agents/state) — Conversation history, agent state, and request state
-   [Session Management](lc:user-guide/concepts/agents/session-management) — Automatic persistence with file or S3 storage
-   [Conversation Management](lc:user-guide/concepts/agents/conversation-management) — Managing conversation history and context window

## Implementation

### Python

- [harness-sdk/strands-py/src/strands/types/_snapshot.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/types/_snapshot.py)

### TypeScript

- [harness-sdk/strands-ts/src/agent/snapshot.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/agent/snapshot.ts)
