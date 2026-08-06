Configuration types shared by injection consumers.

Consumed by the `ContextInjector` plugin and the `MemoryManager`.

#### InjectionTrigger

Determines when injection runs before a model call.

-   `"userTurn"`: only when the latest message is a fresh user ask (a `user` message with no tool result) — the common case for chat agents, where it keeps the user’s ask the final message the model sees.
-   `"everyTurn"`: before every model call, including mid-task tool-result turns — for autonomous agents that should consult injected context at each step.

For finer control, pass a predicate instead of a trigger name.

## InjectionContext

```python
@dataclass
class InjectionContext()
```

Defined in: [src/strands/injection/types.py:33](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/injection/types.py#L33)

The context an injection consumer receives on each model call.

Passed to the `render_content` callback and to a predicate trigger.

**Attributes**:

-   `messages` - The current conversation, as data.
-   `state` - Durable agent state shared across calls, hooks, and tools — read what a tool stashed last turn.
-   `agent` - The agent the injection is attached to (escape hatch for advanced consumers).

## TriggerCallback

```python
class TriggerCallback(Protocol)
```

Defined in: [src/strands/injection/types.py:50](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/injection/types.py#L50)

A predicate that decides whether to inject on a given model call.

Implemented by a plain function as well — the `**kwargs` tail lets the calling convention grow new keyword arguments without breaking existing predicates.

#### \_\_call\_\_

```python
def __call__(context: InjectionContext, **kwargs: Any) -> bool
```

Defined in: [src/strands/injection/types.py:57](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/injection/types.py#L57)

Return whether to inject this call, given the injection context.

## InjectionConfig

```python
class InjectionConfig(TypedDict)
```

Defined in: [src/strands/injection/types.py:68](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/injection/types.py#L68)

Configuration common to every injection consumer: when to inject.

What text to inject is a consumer concern, added by the configs that extend this one (e.g. `MemoryInjectionConfig`).

**Attributes**:

-   `trigger` - When injection runs. An `InjectionTrigger` name selects a built-in policy; a predicate is the escape hatch — it receives the `InjectionContext` and returns whether to inject this call. A predicate that raises fails open (injection is skipped, the model call proceeds). Defaults to `"userTurn"`.
