Model providers occasionally encounter errors such as rate limits, service unavailability, or network timeouts. By default, the agent retries throttled responses automatically with exponential backoff. The `Agent.retry_strategy``Agent.retryStrategy` parameter lets you customize this behavior.

## Default Behavior

Without configuration, agents retry throttling errors up to 5 times (6 total attempts) with exponential backoff starting at 4 seconds:

```plaintext
Attempt 1: fails → wait 4s
Attempt 2: fails → wait 8s
Attempt 3: fails → wait 16s
Attempt 4: fails → wait 32s
Attempt 5: fails → wait 64s
Attempt 6: fails → exception raised
```

## Customizing Retry Behavior

To adjust retry parameters, pass a configured strategy to the agent constructor.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, ModelRetryStrategy\n\nagent = Agent(\n    retry_strategy=ModelRetryStrategy(\n        max_attempts=3,      # Total attempts (including first try)\n        initial_delay=2,     # Seconds before first retry\n        max_delay=60         # Cap on backoff delay\n    )\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "In TypeScript, `ModelRetryStrategy` is the abstract base class. Use `DefaultModelRetryStrategy` for the standard configurable strategy:\n\n```typescript\nimport { Agent, DefaultModelRetryStrategy } from '@strands-agents/sdk'\n\nconst agent = new Agent({\n  retryStrategy: new DefaultModelRetryStrategy({ maxAttempts: 3 }),\n})\n```"
 }
]
```

### Parameters

```sa-tabs
[
 {
  "label": "Python",
  "body": "| Parameter | Type | Default | Description |\n| --- | --- | --- | --- |\n| `max_attempts` | `int` | `6` | Total number of attempts including the initial call. Set to `1` to disable retries. |\n| `initial_delay` | `float` | `4` | Seconds to wait before the first retry. Subsequent retries double this value. |\n| `max_delay` | `float` | `128` | Maximum seconds to wait between retries. Caps the exponential growth. |"
 },
 {
  "label": "TypeScript",
  "body": "`DefaultModelRetryStrategy` accepts:\n\n| Parameter | Type | Default | Description |\n| --- | --- | --- | --- |\n| `maxAttempts` | `number` | `6` | Total number of attempts including the initial call. Must be `>= 1`. |\n| `backoff` | `BackoffStrategy` | `new ExponentialBackoff({ baseMs: 4000, maxMs: 240000 })` | Computes delay between retries. See [Backoff Strategies](#backoff-strategies). |"
 }
]
```

### Backoff Strategies

In TypeScript, the delay between retries is delegated to a `BackoffStrategy` passed via the `backoff` parameter. The Python SDK does not expose a separate backoff interface; configure exponential backoff through the `initial_delay` and `max_delay` parameters above.

```sa-tabs
[
 {
  "label": "Python",
  "body": "Configure backoff through `ModelRetryStrategy` parameters in [Customizing Retry Behavior](#customizing-retry-behavior)."
 },
 {
  "label": "TypeScript",
  "body": "The TypeScript SDK ships three built-in strategies:\n\n-   `ExponentialBackoff` (default): delay grows as `baseMs * multiplier^(attempt-1)`, capped at `maxMs`.\n-   `LinearBackoff`: delay grows as `baseMs * attempt`, capped at `maxMs`.\n-   `ConstantBackoff`: same delay for every retry.\n\n`ExponentialBackoff` and `LinearBackoff` accept a `jitter` option (`'none'`, `'full'`, `'equal'`, `'decorrelated'`). Default is `'full'` jitter, which spreads concurrent clients across the wait window. `ConstantBackoff` returns the configured delay unchanged.\n\n```typescript\nimport { Agent, DefaultModelRetryStrategy, ExponentialBackoff } from '@strands-agents/sdk'\n\nconst agent = new Agent({\n  retryStrategy: new DefaultModelRetryStrategy({\n    maxAttempts: 4,\n    backoff: new ExponentialBackoff({\n      baseMs: 2_000,\n      maxMs: 60_000,\n      multiplier: 2,\n      jitter: 'full',\n    }),\n  }),\n})\n```"
 }
]
```

## Disabling Retries

To disable automatic retries entirely:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\nagent = Agent(\n    retry_strategy=None\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\n\nconst agent = new Agent({\n  retryStrategy: null,\n})\n```"
 }
]
```

## When Retries Occur

Default retry strategies handle throttling errors (`ModelThrottledException``ModelThrottledError`) raised by model providers for rate-limiting. Other exceptions propagate immediately without retry.

To extend or narrow the retryable set, see [Custom Retry Logic](#custom-retry-logic).

## Custom Retry Logic

For more control over retry decisions, such as validating model responses or handling additional error types, two paths are available:

1.  Subclass the retry strategy class to own the full decision shape and reuse hook plumbing.
2.  Use a hook on `AfterModelCallEvent` to set `event.retry = true` directly.

### Subclassing the Retry Strategy

```sa-tabs
[
 {
  "label": "Python",
  "body": "To extend or narrow which errors are retryable, subclass `ModelRetryStrategy` and override `is_retryable`. The default implementation retries `ModelThrottledException` only; `super().is_retryable(exception)` preserves that base behavior so you can opt additional error types in (or specific ones out) without reimplementing the rest of the retry policy.\n\n```python\nfrom strands import Agent, ModelRetryStrategy\nfrom strands.types.exceptions import ModelThrottledException\n\nclass MyRetryStrategy(ModelRetryStrategy):\n    def is_retryable(self, exception: Exception) -> bool:\n        return super().is_retryable(exception) or isinstance(exception, TimeoutError)\n\nagent = Agent(\n    retry_strategy=MyRetryStrategy(max_attempts=4, initial_delay=2, max_delay=60)\n)\n```\n\nA retry-strategy instance carries per-turn state and must not be shared across agents. Create a new instance per agent."
 },
 {
  "label": "TypeScript",
  "body": "To extend or narrow which errors are retryable, subclass `DefaultModelRetryStrategy` and override `isRetryable`. The default implementation retries `ModelThrottledError` only; `super.isRetryable(error)` preserves that base behavior so you can opt additional error types in (or specific ones out) without reimplementing the rest of the retry policy.\n\n```typescript\nimport { Agent, DefaultModelRetryStrategy } from '@strands-agents/sdk'\n\nclass TransientServiceError extends Error {\n  readonly name = 'TransientServiceError'\n}\n\n// Retry throttles (the default retryable set) plus our own transient error class.\nclass WiderRetryStrategy extends DefaultModelRetryStrategy {\n  protected override isRetryable(error: Error): boolean {\n    return super.isRetryable(error) || error instanceof TransientServiceError\n  }\n}\n\nconst agent = new Agent({\n  retryStrategy: new WiderRetryStrategy({ maxAttempts: 5 }),\n})\n```\n\nFor full control over the retry decision (custom backoff state, attempt-aware logic), subclass the abstract `ModelRetryStrategy` directly and implement `computeRetryDecision`. The base class handles short-circuits, per-turn state reset, and sleeping between attempts.\n\nA retry-strategy instance carries per-turn state and must not be shared across agents. Create a new instance per agent."
 }
]
```

### Using a Hook

Hooks are simpler when you only need to inspect a model error and request a retry. Set `event.retry = true` from an `AfterModelCallEvent` callback. Hooks do not introduce delays automatically; the example below adds a 2-second wait.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nimport asyncio\nfrom strands import Agent\nfrom strands.hooks import HookProvider, HookRegistry, AfterModelCallEvent\n\nclass CustomRetry(HookProvider):\n    def __init__(self, max_retries: int = 3, delay: float = 2.0):\n        self.max_retries = max_retries\n        self.delay = delay\n        self.attempts = 0\n\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(AfterModelCallEvent, self.maybe_retry)\n\n    async def maybe_retry(self, event: AfterModelCallEvent) -> None:\n        if event.exception and self.attempts < self.max_retries:\n            self.attempts += 1\n            await asyncio.sleep(self.delay)\n            event.retry = True\n\nagent = Agent(hooks=[CustomRetry()])\n```"
 },
 {
  "label": "TypeScript",
  "body": "The `AfterModelCallEvent` exposes `attemptCount` (1-indexed). Use it to bound retry counts without tracking state outside the hook.\n\n```typescript\nimport { Agent, AfterModelCallEvent } from '@strands-agents/sdk'\n\nconst agent = new Agent({})\n\nlet attempts = 0\nagent.addHook(AfterModelCallEvent, async (event) => {\n  if (event.error && attempts < 3) {\n    attempts += 1\n    await new Promise((resolve) => setTimeout(resolve, 2_000))\n    event.retry = true\n  }\n})\n```"
 }
]
```

See [Hooks](lc:user-guide/concepts/agents/hooks#model-call-retry) for more examples.

## Related pages

- [Interrupts](lc:user-guide/concepts/interrupts) (2 shared tags)
- [Tool Executors](lc:user-guide/concepts/tools/executors) (1 shared tag)
- [Plugins](lc:user-guide/concepts/plugins) (1 shared tag)
- [Chaos Testing](lc:user-guide/evals-sdk/chaos_testing) (1 shared tag)
- [Detectors](lc:user-guide/evals-sdk/detectors) (1 shared tag)
- [Failure Detection](lc:user-guide/evals-sdk/detectors/failure_detection) (1 shared tag)
- [Hooks](lc:user-guide/concepts/agents/hooks) (1 shared tag)
- [Steering (Interventions)](lc:user-guide/concepts/agents/interventions/steering) (1 shared tag)
- [Agent Loop](lc:user-guide/concepts/agents/agent-loop) (1 shared tag)
- [Operating Agents in Production](lc:user-guide/deploy/operating-agents-in-production) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/event_loop/_retry.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/event_loop/_retry.py)

### TypeScript

- [harness-sdk/strands-ts/src/retry/model-retry-strategy.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/retry/model-retry-strategy.ts)
- [harness-sdk/strands-ts/src/retry/default-model-retry-strategy.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/retry/default-model-retry-strategy.ts)
