Built-in extraction triggers that control *when* a store’s extraction runs.

-   :class:`InvocationTrigger` — fire after every agent invocation.
-   :class:`IntervalTrigger` — fire once every `turns` invocations.

See :class:`ExtractionTrigger` for the self-attaching trigger contract.

## InvocationTrigger

```python
class InvocationTrigger(ExtractionTrigger)
```

Defined in: [src/strands/memory/extraction/triggers.py:16](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/triggers.py#L16)

Runs extraction after every agent invocation.

The highest-fidelity option, and the most expensive when an :class:`~strands.memory.extraction.types.Extractor` is configured (a model call per turn).

**Example**:

```python
ExtractionConfig(trigger=[InvocationTrigger()])
```

#### attach

```python
def attach(context: ExtractionTriggerContext) -> None
```

Defined in: [src/strands/memory/extraction/triggers.py:31](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/triggers.py#L31)

Register an after-invocation callback that fires extraction.

Runs after the SDK’s own after-invocation hooks so extraction sees the settled turn. The save runs in a background task, so the hook never blocks.

## IntervalTrigger

```python
class IntervalTrigger(ExtractionTrigger)
```

Defined in: [src/strands/memory/extraction/triggers.py:45](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/triggers.py#L45)

Runs extraction every `turns` agent invocations.

A controllable middle ground: the high-water mark still picks up the skipped turns when the trigger fires.

**Example**:

```python
ExtractionConfig(trigger=[IntervalTrigger(turns=5)])
```

**Attributes**:

-   `name` - Stable identifier for this trigger kind (`interval`).

#### \_\_init\_\_

```python
def __init__(turns: int) -> None
```

Defined in: [src/strands/memory/extraction/triggers.py:62](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/triggers.py#L62)

Initialize the trigger with a firing cadence.

**Arguments**:

-   `turns` - Run extraction once every this many invocations. Must be a positive integer.

**Raises**:

-   `ValueError` - If `turns` is not a positive integer (`bool` is rejected even though it subclasses `int`).

#### attach

```python
def attach(context: ExtractionTriggerContext) -> None
```

Defined in: [src/strands/memory/extraction/triggers.py:78](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/memory/extraction/triggers.py#L78)

Register an after-invocation callback that fires every `turns` turns.

Each `attach` creates a fresh closure counter, so one trigger instance shared across stores keeps an independent count per attachment.
