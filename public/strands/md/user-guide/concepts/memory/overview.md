By default a Strands agent starts every conversation from zero: it cannot recall a user’s preferences, past decisions, or anything it learned in an earlier session. The `MemoryManager` gives an agent long-term memory that persists across sessions.

It works through **memory stores**, the backends that hold the memories. A store can be the built-in zero-setup [test store](lc:user-guide/concepts/memory/test-memory-store), a managed service like [Amazon Bedrock Knowledge Bases](lc:user-guide/concepts/memory/bedrock-knowledge-base), or [your own implementation](#custom-stores). The manager handles three jobs across the stores you give it:

1.  **Recall** - the agent searches stored knowledge on demand through a tool.
2.  **Injection** - the manager folds relevant knowledge into the prompt automatically, before the model runs.
3.  **Extraction** - turning conversation messages into memories and writing them to stores.

Recall and injection are enabled by default when you attach a store. Extraction and fact storage through tools is opt-in.

## Getting Started

Attach a memory manager to an agent through the `memory_manager``memoryManager` parameter. The [test store](lc:user-guide/concepts/memory/test-memory-store) below needs no cloud account and persists to disk by default, so this agent remembers across restarts with no setup. For a managed backend see [Bedrock Knowledge Base](lc:user-guide/concepts/memory/bedrock-knowledge-base), or [Custom Stores](#custom-stores) to create your own.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.memory import MemoryManager\nfrom strands.vended_memory_stores.test_memory_store import TestMemoryStore\n\n# Persists to ~/.strands/memory/notes.json by default.\nstore = TestMemoryStore(name=\"notes\")\n\nagent = Agent(memory_manager=MemoryManager(stores=[store]))\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, BedrockModel } from '@strands-agents/sdk'\nimport { TestMemoryStore } from '@strands-agents/sdk/vended-memory-stores/test-memory-store'\n\n// Persists to ~/.strands/memory/notes.json by default.\nconst store = new TestMemoryStore({ name: 'notes' })\n\nconst agent = new Agent({\n  model: new BedrockModel(),\n  memoryManager: { stores: [store] },\n})\n```"
 }
]
```

With no further configuration, reading through recall and injection is enabled. Writing is opt-in, and comes in two modes:

-   **The `add_memory` tool** lets the agent decide what to save. Enable it on the manager with `add_tool_config=True``addToolConfig: true`.
-   **Automatic extraction** captures memories from the conversation without tool call. Enable it on a writable store, where it runs every 5 turns by default using your agent’s model.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.memory import MemoryManager\nfrom strands.vended_memory_stores import BedrockKnowledgeBaseStore\n\nstore = BedrockKnowledgeBaseStore(\n    name=\"preferences\",\n    writable=True,\n    extraction=True,  # capture memories from the conversation, every 5 turns\n    config={\"knowledge_base_id\": \"KB123\", \"data_source_type\": \"CUSTOM\", \"data_source_id\": \"DS456\"},\n)\n\nagent = Agent(\n    memory_manager=MemoryManager(\n        stores=[store],\n        add_tool_config=True,  # let the agent save memories itself\n    ),\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, BedrockModel } from '@strands-agents/sdk'\nimport { BedrockKnowledgeBaseStore } from '@strands-agents/sdk/vended-memory-stores/bedrock-knowledge-base'\n\nconst store = new BedrockKnowledgeBaseStore({\n  name: 'preferences',\n  writable: true,\n  extraction: true, // capture memories from the conversation, every 5 turns\n  config: { knowledgeBaseId: 'KB123', dataSourceType: 'CUSTOM', dataSourceId: 'DS456' },\n})\n\nconst agent = new Agent({\n  model: new BedrockModel(),\n  memoryManager: {\n    stores: [store],\n    addToolConfig: true, // let the agent save memories itself\n  },\n})\n```"
 }
]
```

## Stores

A manager can own several stores at once, which keeps multi-tenancy out of your application code. A single agent can query personal, team, and organization knowledge together, with each store scoped to its own tenant:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.memory import MemoryManager\n\n# personal and team are two MemoryStore instances, each scoped to its own tenant.\nagent = Agent(memory_manager=MemoryManager(stores=[personal, team]))\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, BedrockModel } from '@strands-agents/sdk'\nimport {\n  BedrockKnowledgeBaseStore,\n  type BedrockKnowledgeBaseConfig,\n} from '@strands-agents/sdk/vended-memory-stores/bedrock-knowledge-base'\n\n// Build the connection once, vary only name and scope per store.\nconst connection: BedrockKnowledgeBaseConfig = {\n  knowledgeBaseId: 'KB123',\n  dataSourceType: 'CUSTOM',\n  dataSourceId: 'DS456',\n}\n\nconst personal = new BedrockKnowledgeBaseStore({\n  name: 'personal',\n  description: 'Knowledge specific to this user.',\n  writable: true,\n  scope: 'user-abc',\n  config: connection,\n})\n\nconst team = new BedrockKnowledgeBaseStore({\n  name: 'team',\n  description: 'Shared team knowledge.',\n  scope: 'team-xyz',\n  config: connection,\n})\n\nconst agent = new Agent({\n  model: new BedrockModel(),\n  memoryManager: { stores: [personal, team] },\n})\n```"
 }
]
```

Each store carries its own identity and behavior:

| Field | Purpose |
| --- | --- |
| `name` | Unique identifier, used to target the store from tools and the programmatic API. |
| `description` | Human-readable summary, surfaced in the memory tool descriptions so the model knows what each store holds. |
| `max_search_results``maxSearchResults` | Default result cap per search when a caller does not pass one. The manager falls back to `3` if neither is set. |
| `writable` | Whether the store accepts writes. |

The manager attaches each store’s `name` to its results, so the model and your code can tell which store produced each entry and target follow-up queries.

## Memory Tools

The manager can register two tools the agent can call during the loop, both configurable. `search_memory` is registered for you; `add_memory` is opt-in:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.memory import MemoryManager\nfrom strands.memory.types import MemoryAddToolConfig, MemoryToolConfig\n\nagent = Agent(\n    memory_manager=MemoryManager(\n        stores=[store],\n        search_tool_config=MemoryToolConfig(\n            name=\"recall\",\n            description=\"Look up what you remember about the user.\",\n        ),\n        # opt in, and return as soon as writes dispatch instead of awaiting them\n        add_tool_config=MemoryAddToolConfig(wait_for_writes=False),\n    ),\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, BedrockModel } from '@strands-agents/sdk'\nimport { BedrockKnowledgeBaseStore } from '@strands-agents/sdk/vended-memory-stores/bedrock-knowledge-base'\n\nconst store = new BedrockKnowledgeBaseStore({\n  name: 'preferences',\n  config: { knowledgeBaseId: 'KB123' },\n})\n\nconst agent = new Agent({\n  model: new BedrockModel(),\n  memoryManager: {\n    stores: [store],\n    searchToolConfig: {\n      name: 'recall',\n      description: 'Look up what you remember about the user.',\n    },\n    // add_memory: opt in, and return as soon as writes dispatch instead of awaiting them\n    addToolConfig: { waitForWrites: false },\n  },\n})\n```"
 }
]
```

`search_memory` lets the agent recall knowledge on demand. Rename or re-describe it through its config, or turn it off. When the manager owns multiple stores, their names and descriptions are folded into the tool description so the model can target a specific store by name or search them all.

`add_memory` lets the agent write new memories. Enable it to allow writes to your writable stores, or pass a config to scope it to specific ones. By default it waits for writes so it can report failures back to the model. The fire-and-forget option returns as soon as writes are dispatched, so a slow backend never blocks the agent loop. This tool can only targets stores implementing `add``add`.

## Context Injection

Injection searches memory before a model call and folds the top results into the prompt, so relevant knowledge is present on every turn. It is **on by default**: the manager injects on a fresh user turn, retrieves up to 5 entries, derives the query adaptively from the latest user message, and renders the results as a `<memory>` block. Turn it off by disabling the injection config.

The injected text is **ephemeral by design**: it augments the model input for a single call and never persists into the durable conversation or session.

Customize retrieval, timing, and formatting with a config object:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.memory import MemoryManager\nfrom strands.memory.types import MemoryInjectionConfig\n\nagent = Agent(\n    memory_manager=MemoryManager(\n        stores=[store],\n        injection=MemoryInjectionConfig(\n            trigger=\"everyTurn\",  # inject before every model call\n            max_entries=3,\n            format=lambda context: \"\\n\".join(f\"- {entry.content}\" for entry in context.entries),\n        ),\n    ),\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, BedrockModel, type MessageData } from '@strands-agents/sdk'\nimport { BedrockKnowledgeBaseStore } from '@strands-agents/sdk/vended-memory-stores/bedrock-knowledge-base'\n\nconst store = new BedrockKnowledgeBaseStore({\n  name: 'preferences',\n  config: { knowledgeBaseId: 'KB123' },\n})\n\nconst agent = new Agent({\n  model: new BedrockModel(),\n  memoryManager: {\n    stores: [store],\n    injection: {\n      // 'userTurn' (default), 'everyTurn', or a predicate over the conversation\n      trigger: ({ messages }) => messages.length >= 4,\n      maxEntries: 3,\n      query: ({ messages }: { messages: MessageData[] }) => {\n        const block = messages.at(-1)?.content[0]\n        return block && 'text' in block ? block.text : undefined\n      },\n      format: ({ entries }) => entries.map((entry) => `- ${entry.content}`).join('\\n'),\n    },\n  },\n})\n```"
 }
]
```

-   `trigger` accepts `'userTurn'` (the default, inject only on a fresh user ask), `'everyTurn'` (inject before every model call, for autonomous agents), or a predicate: a function that receives the injection context and returns whether to inject this call.
-   `max_entries``maxEntries` caps how many entries are retrieved and injected.
-   `query` overrides the adaptive default with your own query logic. Return an empty value to skip injection for this call.
-   `format` renders the retrieved entries. The default emits an escaped `<memory>` block; a custom formatter that emits markup owns its own escaping.

Injection fails open: if the search fails or a callback throws, the manager logs it and proceeds with the model call uninjected. The agent runs without the memory context rather than erroring, so a backend outage degrades silently.

### The injection engine is generic

Memory injection is built on a reusable engine. For non-memory context (a clock, a sandbox descriptor, a fixed reminder), the same mechanism is exposed as the [`ContextInjector`](lc:user-guide/concepts/plugins/context-injector) vended plugin: supply a render callback and it folds the result into the model input the same way.

## Automatic Extraction

Extraction captures memories from the conversation automatically, instead of relying on the agent to call the `add_memory` tool. Enable it on a writable store:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.vended_memory_stores import BedrockKnowledgeBaseStore\n\n# Set extraction on the store at construction; True uses the defaults.\nstore = BedrockKnowledgeBaseStore(\n    name=\"preferences\",\n    writable=True,\n    extraction=True,\n    config={\"knowledge_base_id\": \"KB123\", \"data_source_type\": \"CUSTOM\", \"data_source_id\": \"DS456\"},\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { BedrockKnowledgeBaseStore } from '@strands-agents/sdk/vended-memory-stores/bedrock-knowledge-base'\n\nconst store = new BedrockKnowledgeBaseStore({\n  name: 'preferences',\n  writable: true,\n  extraction: true, // extract every 5 turns with a ModelExtractor\n  config: { knowledgeBaseId: 'KB123', dataSourceType: 'CUSTOM', dataSourceId: 'DS456' },\n})\n```"
 }
]
```

With defaults, extraction runs every 5 turns. For a store that implements only `add``add` (like Bedrock Knowledge Bases), it uses a `ModelExtractor` to distill facts from the conversation; a store that implements `add_messages``addMessages` extracts server-side instead, covered under [Custom Stores](#custom-stores).

### Triggers and extractors

An extraction config has two parts. A **trigger** decides *when* extraction runs; an **extractor** decides *how* messages become entries:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.models import BedrockModel\nfrom strands.memory.extraction.triggers import InvocationTrigger\nfrom strands.memory.extraction.types import ExtractionConfig\nfrom strands.memory.extraction.model_extractor import ModelExtractor\nfrom strands.vended_memory_stores import BedrockKnowledgeBaseStore\n\nstore = BedrockKnowledgeBaseStore(\n    name=\"preferences\",\n    writable=True,\n    extraction=ExtractionConfig(\n        trigger=InvocationTrigger(),  # after every turn, not every 5\n        extractor=ModelExtractor(\n            model=BedrockModel(model_id=\"us.anthropic.claude-haiku-4-5-20251001-v1:0\"),  # cheaper than the agent's\n            system_prompt=\"Extract durable user preferences as discrete facts.\",\n        ),\n    ),\n    config={\"knowledge_base_id\": \"KB123\", \"data_source_type\": \"CUSTOM\", \"data_source_id\": \"DS456\"},\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { InvocationTrigger, ModelExtractor, BedrockModel } from '@strands-agents/sdk'\nimport { BedrockKnowledgeBaseStore } from '@strands-agents/sdk/vended-memory-stores/bedrock-knowledge-base'\n\nconst store = new BedrockKnowledgeBaseStore({\n  name: 'preferences',\n  writable: true,\n  extraction: {\n    trigger: new InvocationTrigger(), // after every turn, not every 5\n    extractor: new ModelExtractor({\n      model: new BedrockModel(), // a cheaper model than the agent's to cut cost\n      systemPrompt: 'Extract durable user preferences as discrete facts.',\n    }),\n  },\n  config: { knowledgeBaseId: 'KB123', dataSourceType: 'CUSTOM', dataSourceId: 'DS456' },\n})\n```"
 }
]
```

The `ModelExtractor` distills messages into discrete facts with a model call. It uses the agent’s own model by default. Pass a cheaper model to cut cost, or a system prompt to steer what information you want to save as memories. Some backends extract server-side instead: a store that implements the `add_messages``addMessages` sink receives the raw message batch with no model call, so for those you omit the extractor.

Two triggers ship with the SDK. `InvocationTrigger` runs after every turn, `IntervalTrigger` runs every N turns. For a custom trigger, extend `ExtractionTrigger`. A trigger registers a hook on the agent and calls `fire()` when extraction should run. Tying it to agent state can let a tool decide the moment, rather than extracting on a turn cadence:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.memory.extraction.types import ExtractionConfig, ExtractionTrigger, ExtractionTriggerContext\nfrom strands.hooks import AfterInvocationEvent\nfrom strands.vended_memory_stores import BedrockKnowledgeBaseStore\n\n\nclass CustomTrigger(ExtractionTrigger):\n    name = \"custom-trigger\"\n\n    def attach(self, context: ExtractionTriggerContext) -> None:\n        # Extract only after a tool has flagged extraction.\n        def maybe_fire(event: AfterInvocationEvent) -> None:\n            if context.agent.state.get(\"extract\"):\n                context.fire()\n\n        context.agent.add_hook(maybe_fire, AfterInvocationEvent)\n\n\nstore = BedrockKnowledgeBaseStore(\n    name=\"preferences\",\n    writable=True,\n    extraction=ExtractionConfig(trigger=CustomTrigger()),\n    config={\"knowledge_base_id\": \"KB123\", \"data_source_type\": \"CUSTOM\", \"data_source_id\": \"DS456\"},\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { ExtractionTrigger, AfterInvocationEvent } from '@strands-agents/sdk'\nimport type { ExtractionTriggerContext } from '@strands-agents/sdk'\n\n// Extract only after a tool has flagged extraction\nclass CustomTrigger extends ExtractionTrigger {\n  readonly name = 'custom-trigger'\n\n  attach(context: ExtractionTriggerContext): void {\n    context.agent.addHook(AfterInvocationEvent, () => {\n      if (context.agent.appState.get('extract')) {\n        context.fire()\n      }\n    })\n  }\n}\n```"
 }
]
```

`fire()` runs the save in the background and returns immediately, so a trigger never blocks the agent loop. A trigger that never fires never extracts; for a guaranteed final write regardless of triggers, use the manager’s flush method.

Extraction is at-least-once: a failed batch is retried, so the same entry may be written more than once. A store used with extraction should tolerate duplicate writes (the manager tracks a high-water mark per store, so a successful batch is never re-extracted).

### Flushing pending writes

Extraction writes run in the background and are not awaited by the agent loop, so the most recent turn may not be saved yet when the agent responds. The manager’s flush method closes that gap. It forces every store to save its buffered messages, even a store whose trigger has not fired this turn or one currently backed off, and awaits all of those writes (including any that start while it waits). Awaiting it as part of a graceful shutdown guarantees nothing in the buffer is lost.

When to call it differs by SDK:

```sa-tabs
[
 {
  "label": "Python",
  "body": "Whether you need to flush manually depends on how you call the agent:\n\n-   **`agent(...)`** (the synchronous call) runs each invocation in its own event loop. Closing that loop would cancel in-flight background saves, so this path awaits a flush after every invocation. Writes already persist by the time the call returns, and you never flush manually.\n-   **`agent.invoke_async(...)`** and **`agent.stream_async(...)`** share your own long-lived event loop and do not flush. Extraction stays on its trigger cadence, so flush yourself at a shutdown boundary before the loop closes:\n\n```python\n# After driving the agent with invoke_async / stream_async, before the loop closes.\nawait memory_manager.flush()\n```"
 },
 {
  "label": "TypeScript",
  "body": "The agent loop never flushes for you, on any call path. Await `flush()` as part of a graceful shutdown and every outstanding write lands before the process exits; skip it and the last turns\u2019 background writes are dropped:\n\n```typescript\n// At a shutdown boundary you control, before the process exits.\nprocess.on('beforeExit', async () => {\n  await memoryManager.flush()\n})\n```"
 }
]
```

This protects a graceful shutdown. A process killed without one (crash, `SIGKILL`, hard timeout) can still lose the last unsaved turn, since the flush never runs; a more frequent trigger narrows that window. Do not call `flush()` after every turn alongside a periodic trigger, since that forces a save each time and defeats the trigger’s schedule.

## Programmatic Access

You can search and write directly on the memory manager, outside the agent loop. Both methods target all relevant stores by default, or a subset by name:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.memory.types import MemoryAddOptions, MemorySearchOptions\n\n# Search every store, or a subset by name.\nall_results = await memory_manager.search(\"travel plans\")\nscoped = await memory_manager.search(\n    \"travel plans\",\n    MemorySearchOptions(stores=[\"personal\"], max_search_results=5),\n)\n\n# Write to writable stores, with metadata.\nawait memory_manager.add(\n    \"Prefers aisle seats\",\n    MemoryAddOptions(stores=[\"personal\"], metadata={\"category\": \"travel\"}),\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Search every store, or a subset by name.\nconst all = await memoryManager.search('travel plans')\nconst scoped = await memoryManager.search('travel plans', {\n  stores: ['personal'],\n  maxSearchResults: 5,\n})\n\n// Write to writable stores, with metadata.\nawait memoryManager.add('Prefers aisle seats', {\n  stores: ['personal'],\n  metadata: { category: 'travel' },\n})\n```"
 }
]
```

Partial failures are handled per method. `search` logs and skips any store that fails, returning whatever the rest produced. `add` validates the target stores first, then raises an aggregate error if any write fails, so a failed write is never silent.

## Custom Stores

Use the memory manager with any backend by implementing the `MemoryStore` interface. Only `search` is required; add an `add` method to make the store writable, and a tool method to expose backend-native tools alongside the manager’s:

```sa-tabs
[
 {
  "label": "Python",
  "body": "A store implements the config attributes (`name`, `writable`, and so on) plus an async `search`, and optionally `add`, `add_messages`, and `get_tools`:\n\n```python\nfrom strands.memory.types import MemoryEntry, SearchOptions\n\n\nclass InMemoryStore:\n    name = \"preferences\"\n    description = \"User preferences and stable facts.\"\n    max_search_results = None\n    writable = True\n    extraction = None\n\n    def __init__(self) -> None:\n        self._entries: list[str] = []\n\n    async def search(self, query: str, options: SearchOptions | None = None) -> list[MemoryEntry]:\n        limit = (options and options.max_search_results) or 3\n        matches = [content for content in self._entries if query in content]\n        return [MemoryEntry(content=content) for content in matches[:limit]]\n\n    async def add(self, content: str, metadata: dict | None = None) -> None:\n        self._entries.append(content)\n\n\nstore = InMemoryStore()\n```"
 },
 {
  "label": "TypeScript",
  "body": "A store implements `search`, and optionally `add`, `addMessages`, and `getTools`:\n\n```typescript\nimport type { MemoryStore, MemoryEntry, SearchOptions } from '@strands-agents/sdk'\n\nclass InMemoryStore implements MemoryStore {\n  readonly name = 'preferences'\n  readonly writable = true\n  private readonly _entries: string[] = []\n\n  async search(query: string, options?: SearchOptions): Promise<MemoryEntry[]> {\n    const limit = options?.maxSearchResults ?? 3\n    return this._entries\n      .filter((content) => content.includes(query))\n      .slice(0, limit)\n      .map((content) => ({ content }))\n  }\n\n  async add(content: string): Promise<void> {\n    this._entries.push(content)\n  }\n}\n```"
 }
]
```

A store exposes two write paths, and which ones it implements decides how it can be written to:

-   `add` takes a single piece of content. It backs the `add_memory` tool, the programmatic `add` method, and extraction that distills facts client-side with a `ModelExtractor`.
-   `add_messages``addMessages` takes a batch of raw conversation messages. It backs **server-side extraction**: the manager hands the filtered message batch straight to this method with no client-side model call, so the backend does the distillation itself. The batch preserves the conversation’s role structure.

A store can implement either path or both. The following store extracts server-side, delegating to `my_backend`, a stand-in for your managed backend’s client:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.memory.types import AddMessagesContext, MemoryEntry, SearchOptions\nfrom strands.types.content import Message\n\n\nclass ServerSideStore:\n    name = \"preferences\"\n    description = \"User preferences and stable facts.\"\n    max_search_results = None\n    writable = True\n    extraction = True  # extract every 5 turns; no extractor, so add_messages is used\n\n    async def search(self, query: str, options: SearchOptions | None = None) -> list[MemoryEntry]:\n        return await my_backend.retrieve(query, options and options.max_search_results)\n\n    # The manager hands the raw message batch here; the backend extracts server-side.\n    async def add_messages(\n        self, messages: list[Message], context: AddMessagesContext | None = None\n    ) -> None:\n        await my_backend.ingest_conversation(messages)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport type {\n  MemoryStore,\n  MemoryEntry,\n  SearchOptions,\n  MessageData,\n  AddMessagesContext,\n} from '@strands-agents/sdk'\n\nclass ServerSideStore implements MemoryStore {\n  readonly name = 'preferences'\n  readonly writable = true\n  // Extract every 5 turns; no extractor, so the manager calls addMessages.\n  readonly extraction = true\n\n  async search(query: string, options?: SearchOptions): Promise<MemoryEntry[]> {\n    return myBackend.retrieve(query, options?.maxSearchResults)\n  }\n\n  // The manager hands the raw message batch here; the backend extracts server-side.\n  async addMessages(\n    messages: MessageData[],\n    context?: AddMessagesContext\n  ): Promise<void> {\n    await myBackend.ingestConversation(messages)\n  }\n}\n```"
 }
]
```

For a reference implementation backed by a managed service, see the [Bedrock Knowledge Base store](lc:user-guide/concepts/memory/bedrock-knowledge-base), which extracts client-side.

## Best Practices

-   **Choose how the agent reads.** The `search_memory` tool lets the model pull knowledge when it judges it needs it; injection guarantees relevant context on every user turn. They compose: enable both for a guaranteed baseline plus on-demand depth.
-   **Match extraction cadence to cost.** An every-turn trigger with a model extractor means a model call per turn. That is a token cost, not a latency cost, since extraction runs in the background; an interval trigger lowers it, and turns skipped between runs are still captured when the trigger next fires.
-   **Scope stores for multi-tenancy.** Give each tenant its own scoped store rather than mixing knowledge in one (see [Bedrock Knowledge Base](lc:user-guide/concepts/memory/bedrock-knowledge-base)).
-   **Give the agent context.** Add a meaningful description to each store, so the agent knows what type of knowledge each store contains.
-   **Tolerate duplicate writes** in custom stores used with extraction, since failed batches are retried.

## How Memory Relates to Other Strands Constructs

Three SDK features manage different kinds of state; memory is the one that crosses sessions:

-   [Session management](lc:user-guide/concepts/agents/session-management) persists the full conversation so an agent can resume where it left off.
-   [Conversation management](lc:user-guide/concepts/agents/conversation-management) keeps the conversation within the model’s context window during a session.
-   **Memory** carries durable knowledge *across* sessions, without replaying past conversations.

## Related

-   [Test memory store](lc:user-guide/concepts/memory/test-memory-store) - the zero-setup vended `MemoryStore` backed by a local JSON file, for prototyping and testing.
-   [Bedrock Knowledge Base store](lc:user-guide/concepts/memory/bedrock-knowledge-base) - the vended `MemoryStore` backed by Amazon Bedrock Knowledge Bases.
-   [Context Injector](lc:user-guide/concepts/plugins/context-injector) - the generic injection plugin that memory injection builds on.
-   [Session management](lc:user-guide/concepts/agents/session-management) - persist the conversation itself across restarts.
-   [Conversation management](lc:user-guide/concepts/agents/conversation-management) - keep a session within the model’s context window.

## Related pages

- [Test Memory Store](lc:user-guide/concepts/memory/test-memory-store) (1 shared tag)
- [Bedrock Knowledge Base Store](lc:user-guide/concepts/memory/bedrock-knowledge-base) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/memory/memory_manager.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/memory_manager.py)
- [harness-sdk/strands-py/src/strands/memory/types.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/types.py)

### TypeScript

- [harness-sdk/strands-ts/src/memory/memory-manager.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/memory/memory-manager.ts)
- [harness-sdk/strands-ts/src/memory/types.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/memory/types.ts)
