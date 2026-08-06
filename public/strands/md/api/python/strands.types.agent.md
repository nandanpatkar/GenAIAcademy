Agent-related type definitions for the SDK.

This module defines the types used for an Agent.

## Limits

```python
class Limits(TypedDict)
```

Defined in: [src/strands/types/agent.py:17](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/types/agent.py#L17)

Per-invocation budget caps for the agent loop.

Each cap, when set, bounds a single `invoke_async` / `stream_async` call only; counters are not cumulative across reuses of the same agent. Caps are checked at the top of each loop iteration, so tools requested by the previous turn always run to completion before a cap fires and `agent.messages` remains in a reinvokable state.

Each cap, when set, must be a positive `int`. Omit any field (or pass `limits=None`) for no limit on that dimension.

Priority on simultaneous trip (highest first): `turns`, `total_tokens`, `output_tokens`. The corresponding `stop_reason` is `"limit_turns"`, `"limit_total_tokens"`, or `"limit_output_tokens"`.

**Attributes**:

-   `turns` - Maximum number of agent loop iterations (turns). One turn is one model call plus any tool execution that follows. Counted against `len(metrics.latest_agent_invocation.cycles)`.
-   `output_tokens` - Maximum cumulative model-generated tokens, summed across every model call in the loop (`metrics.latest_agent_invocation.usage["outputTokens"]`). Distinct from per-call provider-level caps, which bound a single model call’s output. Soft cap: a single oversized response can overshoot the budget; checked at turn boundaries, not within an individual model call.
-   `total_tokens` - Maximum cumulative input + output tokens (`metrics.latest_agent_invocation.usage["totalTokens"]`). Each model call’s input includes prior turns, so this counter compounds across the run and approximates total token spend. Soft cap, same caveat as `output_tokens`.

## ConcurrentInvocationMode

```python
class ConcurrentInvocationMode(str, Enum)
```

Defined in: [src/strands/types/agent.py:52](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/types/agent.py#L52)

Mode controlling concurrent invocation behavior.

Values: THROW: Raises ConcurrencyException if concurrent invocation is attempted (default). UNSAFE\_REENTRANT: Allows concurrent invocations without locking.

**Warnings**:

The `UNSAFE_REENTRANT` mode makes no guarantees about resulting behavior and is provided only for advanced use cases where the caller understands the risks.
