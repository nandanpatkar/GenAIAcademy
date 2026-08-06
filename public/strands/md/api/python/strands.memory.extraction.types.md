Primitive types for the memory extraction subsystem.

## ExtractionResult

```python
@dataclass
class ExtractionResult()
```

Defined in: [src/strands/memory/extraction/types.py:39](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/types.py#L39)

A discrete entry produced by an :class:`Extractor`, ready to write via `add`.

## ExtractorContext

```python
@dataclass
class ExtractorContext()
```

Defined in: [src/strands/memory/extraction/types.py:47](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/types.py#L47)

Context passed to :meth:`Extractor.extract`.

**Attributes**:

-   `default_model` - The agent’s model, supplied so an extractor can default to it.

## Extractor

```python
class Extractor(Protocol)
```

Defined in: [src/strands/memory/extraction/types.py:58](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/types.py#L58)

Transforms conversation messages into discrete, searchable entries.

Optional on a store’s :class:`ExtractionConfig`: when absent, the manager passes messages straight to the store’s `add_messages` (the no-extractor passthrough), which is the right path for backends that extract server-side.

#### extract

```python
async def extract(
        messages: list[Message],
        context: ExtractorContext | None = None) -> list[ExtractionResult]
```

Defined in: [src/strands/memory/extraction/types.py:66](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/types.py#L66)

Extract entries from a batch of messages.

## MemoryMessageFilter

```python
@dataclass
class MemoryMessageFilter()
```

Defined in: [src/strands/memory/extraction/types.py:72](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/types.py#L72)

Filters content blocks out of messages before extraction.

Blocks whose kind is in :attr:`exclude` are stripped; a message left with no content is dropped. Defaults to excluding tool traffic (`toolUse` / `toolResult`).

## ExtractionTriggerContext

```python
@dataclass
class ExtractionTriggerContext()
```

Defined in: [src/strands/memory/extraction/types.py:88](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/types.py#L88)

Context handed to :meth:`ExtractionTrigger.attach`.

**Attributes**:

-   `agent` - The agent the trigger attaches its hooks to.
-   `fire` - Save this store’s unsaved messages now. Runs in the background and returns immediately. To await completion, see `MemoryManager.flush`.

## ExtractionTrigger

```python
class ExtractionTrigger(ABC)
```

Defined in: [src/strands/memory/extraction/types.py:101](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/types.py#L101)

Controls when a store’s :class:`ExtractionConfig` runs.

A trigger is a self-attaching value object: :meth:`attach` wires the agent hooks it needs and calls :attr:`ExtractionTriggerContext.fire` when extraction should happen. Subclass for custom triggering logic. A trigger that never fires never extracts; for a guaranteed final write, use `MemoryManager.flush`.

**Attributes**:

-   `name` - Stable identifier for this trigger kind, used in logging.

#### attach

```python
@abstractmethod
def attach(context: ExtractionTriggerContext) -> None
```

Defined in: [src/strands/memory/extraction/types.py:117](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/types.py#L117)

Wire this trigger into the agent lifecycle.

Called once per store during `MemoryManager` initialization. Register hooks on `context.agent` and call `context.fire()` when extraction should run.

## ExtractionConfig

```python
class ExtractionConfig(TypedDict)
```

Defined in: [src/strands/memory/extraction/types.py:127](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/types.py#L127)

Per-store automatic-extraction configuration.

**Attributes**:

-   `trigger` - When to run extraction. A single trigger or a list; multiple triggers compose (extraction runs whenever any fires). Omit to default to every 5 turns; an explicit empty list is rejected at construction.
-   `extractor` - How to turn messages into entries. When set, the store must implement `add`. When omitted, the default depends on the store’s write methods: a store implementing only `add` defaults to a :class:`~strands.memory.extraction.model_extractor.ModelExtractor` that distills facts client-side, while a store implementing `add_messages` uses server-side extraction (the manager hands the filtered messages straight to `add_messages`, no model call).
-   `filter` - Content blocks to strip before extraction. Defaults to :data:`DEFAULT_MEMORY_MESSAGE_FILTER` (excludes `toolUse` / `toolResult`). Pass `MemoryMessageFilter(exclude=[])` to keep tool blocks.
