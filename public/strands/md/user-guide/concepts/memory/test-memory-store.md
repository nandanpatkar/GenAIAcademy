`TestMemoryStore` is a [`MemoryStore`](lc:user-guide/concepts/memory/overview#stores) backed by a JSON file. It requires no setup and no provisioned resources, so you can give an agent memory in one line and try recall, injection, and extraction for prototyping or writing tests.

It persists to disk by default, so an agent remembers across restarts with no setup. Point it at a store name and go:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.memory import MemoryManager\nfrom strands.vended_memory_stores.test_memory_store import TestMemoryStore\n\n# Persists to ~/.strands/memory/notes.json by default. Survives restarts.\nstore = TestMemoryStore(name=\"notes\")\n\nagent = Agent(memory_manager=MemoryManager(stores=[store]))\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, BedrockModel } from '@strands-agents/sdk'\nimport { TestMemoryStore } from '@strands-agents/sdk/vended-memory-stores/test-memory-store'\n\n// Persists to ~/.strands/memory/notes.json by default. Survives restarts.\nconst store = new TestMemoryStore({ name: 'notes' })\n\nconst agent = new Agent({\n  model: new BedrockModel(),\n  memoryManager: { stores: [store] },\n})\n```"
 }
]
```

The store is writable by default, unlike a read-only managed store. So the [`add_memory` tool](lc:user-guide/concepts/memory/overview#memory-tools) and [automatic extraction](lc:user-guide/concepts/memory/overview#automatic-extraction) work as soon as you enable them, with no data source to set up first.

It suits prototyping and tests, not a production corpus: each write rewrites the whole file and recall is keyword matching rather than semantic. For a production backend, use the [Bedrock Knowledge Base store](lc:user-guide/concepts/memory/bedrock-knowledge-base).

## Persistence and Location

The store writes to `~/.strands/memory/<store-name>.json`, deriving the filename from `name`. Give it an explicit `path` to control where the file lands, or turn persistence off for a store that lives only in memory:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.vended_memory_stores.test_memory_store import TestMemoryStore\n\n# Ephemeral: nothing is written to disk, and a fresh instance forgets everything.\nscratch = TestMemoryStore(name=\"notes\", persist=False)\n\n# Explicit file location instead of the default under ~/.strands/memory/.\nproject = TestMemoryStore(name=\"notes\", path=\"./notes.json\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { TestMemoryStore } from '@strands-agents/sdk/vended-memory-stores/test-memory-store'\n\n// Ephemeral: nothing is written to disk, and a fresh instance forgets everything.\nconst scratch = new TestMemoryStore({ name: 'notes', persist: false })\n\n// Explicit file location instead of the default under ~/.strands/memory/.\nconst project = new TestMemoryStore({ name: 'notes', path: './notes.json' })\n```"
 }
]
```

Reach for `persist=False``persist: false` in tests and throwaway runs where you want recall and ranking without leaving a file behind. The default (persist to disk) is what demonstrates the feature: memory that survives a restart.

Persistence runs on the SDK’s `Storage` interface: `persist=False``persist: false` uses an in-memory backend, and persisting to disk uses a local-file backend. The config above is all you configure; the store selects the backend for you.

The on-disk format is shared between the Python and TypeScript SDKs. Records use the same keys and timestamp shape, so a file written by one SDK reads in the other.

## Configuration

`TestMemoryStore` takes the [shared `MemoryStore` fields](lc:user-guide/concepts/memory/overview#stores) (`name`, `description`, `max_search_results``maxSearchResults`, `writable`, `extraction`) plus two of its own:

| Field | Purpose |
| --- | --- |
| `persist` | Whether to write entries to disk. On by default: flushes to `path`. When off, entries stay in memory only and are lost when the process exits. |
| `path` | Full path to the backing JSON file. Defaults to `~/.strands/memory/<store-name>.json`. Ignored when persistence is off. |

`writable` is on by default here. Construction rejects an empty `name`, an empty `path`, or a `max_search_results``maxSearchResults` below `1`.

## Recall

`search` ranks entries by lexical overlap: it counts how many distinct words from the query appear in each entry’s content, and returns the highest scorers first, breaking ties toward the most recent entry. Each result carries the count under a reserved `_relevanceScore` metadata key. A query with no usable words returns nothing.

Note

> [!NOTE]
>
> Recall is keyword matching, not semantic search. A query word matches only the same word, not a synonym, so “seat” does not find an entry about “chair.” For embedding-based semantic search over a managed vector store, use the [Bedrock Knowledge Base store](lc:user-guide/concepts/memory/bedrock-knowledge-base).

## Writing Memories

`add` stores a single piece of content and returns its id. Identical content is deduplicated: a repeat write returns the existing record’s id instead of storing a second copy, so the at-least-once retries that extraction may perform never accumulate duplicates.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.vended_memory_stores.test_memory_store import TestMemoryStore\n\nstore = TestMemoryStore(name=\"notes\")\n\n# add returns the id of the stored (or already-present, on dedup) record.\nresult = await store.add(\"User prefers aisle seats\", {\"category\": \"travel\"})\nprint(result.id)\n\nresults = await store.search(\"which seats does the user prefer?\")\nfor entry in results:\n    print(entry.content, entry.metadata.get(\"_relevanceScore\"))\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { TestMemoryStore } from '@strands-agents/sdk/vended-memory-stores/test-memory-store'\n\nconst store = new TestMemoryStore({ name: 'notes' })\n\n// add returns the id of the stored (or already-present, on dedup) record.\nconst { id } = await store.add('User prefers aisle seats', { category: 'travel' })\n\nconst results = await store.search('which seats does the user prefer?')\nfor (const entry of results) {\n  console.log(entry.content, entry.metadata?._relevanceScore)\n}\n```"
 }
]
```

Writing to a store constructed with `writable=False``writable: false`, or adding empty content, raises. When the backing directory is unreachable or not writable, the write raises, naming the backing file.

## Extraction

Enable [automatic extraction](lc:user-guide/concepts/memory/overview#automatic-extraction) to capture memories from the conversation without the agent calling a tool:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.vended_memory_stores.test_memory_store import TestMemoryStore\n\nstore = TestMemoryStore(\n    name=\"notes\",\n    extraction=True,  # distill facts from the conversation, every 5 turns\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { TestMemoryStore } from '@strands-agents/sdk/vended-memory-stores/test-memory-store'\n\nconst store = new TestMemoryStore({\n  name: 'notes',\n  extraction: true, // distill facts from the conversation, every 5 turns\n})\n```"
 }
]
```

The store implements `add``add` but not `add_messages``addMessages`, so extraction runs client-side: a `ModelExtractor` distills facts from the conversation and writes each through `add`. To change the cadence or swap the extractor, see [Automatic Extraction](lc:user-guide/concepts/memory/overview#automatic-extraction) on the Memory page.

## Scale and Limitations

Each `add` reads the current file and rewrites it in full, replacing it atomically so a crash mid-write never leaves a partial file. That design suits prototyping and personal memory, hundreds to low thousands of entries, not a production corpus. For large or high-throughput workloads, use a managed store like the [Bedrock Knowledge Base store](lc:user-guide/concepts/memory/bedrock-knowledge-base).

Concurrent `add` calls on one store instance are serialized, so they can’t clobber one another. Separate instances or processes writing the same file are not coordinated, so avoid pointing two at the same file: the last write wins. A corrupt or wrong-shaped backing file raises rather than returning bad data; a missing file starts empty.

## Related

-   [Memory](lc:user-guide/concepts/memory/overview) - the `MemoryManager` concept this store plugs into, including the tools, extraction, and injection it enables.
-   [Bedrock Knowledge Base store](lc:user-guide/concepts/memory/bedrock-knowledge-base) - the managed `MemoryStore` with semantic search, for production workloads.

## Related pages

- [Memory](lc:user-guide/concepts/memory/overview) (1 shared tag)
- [Bedrock Knowledge Base Store](lc:user-guide/concepts/memory/bedrock-knowledge-base) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/vended_memory_stores/test_memory_store/store.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_memory_stores/test_memory_store/store.py)

### TypeScript

- [harness-sdk/strands-ts/src/vended-memory-stores/test-memory-store/store.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-memory-stores/test-memory-store/store.ts)
