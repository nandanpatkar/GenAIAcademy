To persist agent state between restarts, pass a Storage backend to the plugins that need it. You pick the backend once; plugins like [Context Offloader](lc:user-guide/concepts/plugins/context-offloader), [Session Management](lc:user-guide/concepts/agents/session-management), and [Memory](lc:user-guide/concepts/memory/overview) handle the rest.

The SDK ships three backends. Pick one based on where you need your data to live:

| Backend | Where data lives | Best for |
| --- | --- | --- |
| `InMemoryStorage` | Process memory | Tests, short-lived agents |
| `LocalFileStorage` | Local filesystem | Development, single-machine |
| `S3Storage` | Amazon S3 | Production, multi-instance |

## Usage

Pass a storage instance to whichever plugin needs persistence:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nstorage = LocalFileStorage()\n\nagent = Agent(plugins=[\n    ContextOffloader(storage=storage)\n])\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { LocalFileStorage } from '@strands-agents/sdk/storage'\nimport { Agent } from '@strands-agents/sdk'\nimport { ContextOffloader } from '@strands-agents/sdk/vended-plugins/context-offloader'\n\nconst storage = new LocalFileStorage()\n\nconst agent = new Agent({\n  plugins: [new ContextOffloader({ storage })],\n})\n```"
 }
]
```

## Built-in backends

### InMemoryStorage

Data lives in process memory. No constructor arguments. Fast, zero-config, gone when the process exits.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nstorage = InMemoryStorage()\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { InMemoryStorage } from '@strands-agents/sdk/storage'\n\nconst storage = new InMemoryStorage()\n```"
 }
]
```

### LocalFileStorage

Each key becomes a file under a base directory. Writes are atomic (temp file + rename).

| Parameter | Default | Description |
| --- | --- | --- |
| `base_dir``baseDir` | `"./.strands/"` | Root directory |
| `sandbox``sandbox` | `None`/`undefined` | Optional [Sandbox](lc:user-guide/concepts/sandbox) |

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nstorage = LocalFileStorage(\"./my-data/\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { LocalFileStorage } from '@strands-agents/sdk/storage'\n\nconst storage = new LocalFileStorage('./my-data/')\n```"
 }
]
```

You can also bind a sandbox after construction with `for_sandbox(sandbox)``forSandbox(sandbox)`, which returns a new instance routed through the sandbox.

### S3Storage

Stores data as objects in an S3 bucket. The AWS SDK loads lazily, so applications that never construct an `S3Storage` pay nothing.

| Parameter | Default | Description |
| --- | --- | --- |
| `bucket` | *(required)* | S3 bucket name |
| `prefix` | `""` | Key prefix (namespace within the bucket) |
| `region_name``region` | `None`/`undefined` | AWS region override |
| `boto_session``s3Client` | `None`/`undefined` | Pre-configured client |

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nstorage = S3Storage(\"my-bucket\", prefix=\"agents/prod/\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { S3Storage } from '@strands-agents/sdk/storage'\n\nconst storage = new S3Storage('my-bucket', {\n  prefix: 'agents/prod/',\n})\n```"
 }
]
```

You cannot pass both a region and a pre-configured client; pick one or the other.

## Custom backends

Implement four async methods (`write, read, delete, list``write, read, delete, list`) and pass your class anywhere a `Storage` is accepted. In Python, `Storage` is a [protocol](lc:api/python/strands.storage.storage#Storage); in TypeScript, implement the [interface](https://strandsagents.com/docs/api/typescript/Storage/).

Community backends can add methods beyond the core four (e.g. `search` for vector similarity, or structured queries for databases like DynamoDB). Plugins that only need basic persistence use the four standard methods; plugins that need richer access can check for and use the extra surface your backend provides.

Plugins scope their own keys automatically, so you don’t need to worry about collisions between session data and offloaded content.

## Next steps

-   [Context Offloader](lc:user-guide/concepts/plugins/context-offloader): offload large tool results
-   [Session Management](lc:user-guide/concepts/agents/session-management): persist conversations across restarts
-   [Sandbox](lc:user-guide/concepts/sandbox): route Storage I/O through a sandboxed environment

## Related pages

- [Conversation Management](lc:user-guide/concepts/agents/conversation-management) (1 shared tag)
- [Bidirectional Streaming Session Management](lc:user-guide/concepts/bidirectional-streaming/session-management) (1 shared tag)
- [Session Management](lc:user-guide/concepts/agents/session-management) (1 shared tag)
- [State Management](lc:user-guide/concepts/agents/state) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/storage/storage.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/storage/storage.py)
- [harness-sdk/strands-py/src/strands/storage/in_memory_storage.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/storage/in_memory_storage.py)
- [harness-sdk/strands-py/src/strands/storage/local_file_storage.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/storage/local_file_storage.py)
- [harness-sdk/strands-py/src/strands/storage/s3_storage.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/storage/s3_storage.py)

### TypeScript

- [harness-sdk/strands-ts/src/storage/storage.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/storage/storage.ts)
- [harness-sdk/strands-ts/src/storage/in-memory-storage.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/storage/in-memory-storage.ts)
- [harness-sdk/strands-ts/src/storage/local-file-storage.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/storage/local-file-storage.ts)
- [harness-sdk/strands-ts/src/storage/s3-storage.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/storage/s3-storage.ts)
