Background coordinator that saves conversation messages to memory stores.

The :class:`ExtractionCoordinator` buffers every message the agent produces and, when a store’s trigger fires, saves that store’s unsaved messages in the background. It keeps a per-store high-water mark so each message is delivered to a store at most once, serializes a single store’s saves through a per-store task chain, and backs off stores that fail repeatedly.

## ExtractionCoordinator

```python
class ExtractionCoordinator()
```

Defined in: [src/strands/memory/extraction/coordinator.py:58](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/coordinator.py#L58)

Saves conversation messages to memory stores in the background.

Buffers every recorded message and, per store, tracks a high-water mark of the last `seq` saved so each message is delivered at most once. A single store’s saves are serialized through a per-store task chain; different stores save independently. Failures are logged and swallowed, with per-store backoff for repeatedly failing stores.

#### \_\_init\_\_

```python
def __init__(bindings: list[_ExtractionBinding], default_model: Model) -> None
```

Defined in: [src/strands/memory/extraction/coordinator.py:68](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/coordinator.py#L68)

Initialize the coordinator.

**Arguments**:

-   `bindings` - The extraction-configured stores this coordinator manages, each paired with its fully-resolved config.
-   `default_model` - The agent’s model, passed to extractors that do not configure their own.

#### record

```python
def record(message: Message) -> None
```

Defined in: [src/strands/memory/extraction/coordinator.py:98](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/coordinator.py#L98)

Add a message to the buffer.

#### schedule

```python
def schedule(store: MemoryStore) -> None
```

Defined in: [src/strands/memory/extraction/coordinator.py:103](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/coordinator.py#L103)

Save this store’s unsaved messages in the background, non-blocking.

Dispatches the save and returns immediately. A no-op when the store is backed off and this request is not a probe.

#### process

```python
def process(store: MemoryStore,
            link_context: SpanContext | None = None) -> asyncio.Task | None
```

Defined in: [src/strands/memory/extraction/coordinator.py:127](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/coordinator.py#L127)

Queue a save for this store behind its previous save.

Returns the task running the save, or `None` when the store is backed off and this request is not a probe.

#### flush

```python
async def flush() -> None
```

Defined in: [src/strands/memory/extraction/coordinator.py:174](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/coordinator.py#L174)

Save every store’s remaining buffered messages and wait for completion.

Bypasses backoff and also waits out saves that start while waiting. Never raises.

Flush typically runs at a shutdown boundary, after the agent span has ended, so these extractions are enqueued without an agent span link and appear as unlinked root traces.
