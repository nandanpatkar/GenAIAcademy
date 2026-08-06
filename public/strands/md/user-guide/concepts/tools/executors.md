Tool executors control whether tools from a single assistant turn run concurrently or sequentially. Both SDKs default to concurrent execution.

## Concurrent Executor

Concurrent execution runs all tool calls from a single turn in parallel. This is the default in both SDKs — you get it without any extra configuration.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.tools.executors import ConcurrentToolExecutor\n\nagent = Agent(\n    tool_executor=ConcurrentToolExecutor(),\n    tools=[weather_tool, time_tool]\n)\n# or simply Agent(tools=[weather_tool, time_tool])\n\nagent(\"What is the weather and time in New York?\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\n\nconst agent = new Agent({\n  tools: [weatherTool, timeTool],\n  toolExecutor: 'concurrent',\n})\n// Omit toolExecutor to use concurrent execution by default.\n\nawait agent.invoke('What is the weather and time in New York?')\n```\n\nThe `'concurrent'` string shorthand keeps your imports minimal. Passing `new ConcurrentToolExecutor()` is equivalent if you prefer to be explicit."
 }
]
```

Assuming the model returns `weather_tool` and `time_tool` use requests, the concurrent executor runs both at the same time. End-to-end latency scales with the slowest tool rather than their sum.

### Sequential Behavior

On certain prompts, the model may decide to return one tool use request at a time. Under these circumstances, the tools will execute sequentially. Concurrency is only achieved if the model returns multiple tool use requests in a single response. Certain models however offer additional abilities to coerce a desired behavior. For example, Anthropic exposes an explicit parallel tool use setting ([docs](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use)).

## Sequential Executor

Use sequential execution when tool order matters — for example, when a later tool depends on a side effect of an earlier one:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.tools.executors import SequentialToolExecutor\n\nagent = Agent(\n    tool_executor=SequentialToolExecutor(),\n    tools=[screenshot_tool, email_tool]\n)\n\nagent(\"Please take a screenshot and then email the screenshot to my friend\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\n\nconst agent = new Agent({\n  tools: [screenshotTool, emailTool],\n  toolExecutor: 'sequential',\n})\n\nawait agent.invoke('Take a screenshot and email it to my friend')\n```\n\nThe `'sequential'` string shorthand keeps your imports minimal. Passing `new SequentialToolExecutor()` is equivalent if you prefer to be explicit."
 }
]
```

Assuming the model returns `screenshot_tool` and `email_tool` use requests, the sequential executor runs both in the order given.

## Event Ordering

Both modes preserve per-tool event order. In concurrent mode, events from different tools may interleave across that per-tool sequence.

```sa-tabs
[
 {
  "label": "Python",
  "body": "Per-tool event order: `BeforeToolCallEvent` \u2192 `ToolStreamEvent*` \u2192 `AfterToolCallEvent` \u2192 `ToolResultEvent`."
 },
 {
  "label": "TypeScript",
  "body": "Per-tool event order: `BeforeToolCallEvent` \u2192 `ToolStreamUpdateEvent*` \u2192 `AfterToolCallEvent` \u2192 `ToolResultEvent`."
 }
]
```

## Cancellation

Cancellation works identically in both modes. Call `agent.cancel()` to request cooperative cancellation. In TypeScript, this flips `agent.cancelSignal`.

```sa-tabs
[
 {
  "label": "Python",
  "body": "-   **Pre-launch cancel**: set `BeforeToolCallEvent.cancel_tool` on a per-tool hook to produce an error result for that tool.\n-   **Mid-flight cancel** in sequential mode short-circuits not-yet-started tools. In concurrent mode, all tools have already launched, so each in-flight tool must cooperatively check for cancellation to stop early."
 },
 {
  "label": "TypeScript",
  "body": "-   **Pre-launch cancel**: set `BeforeToolsEvent.cancel` on the batch-level hook, or call `agent.cancel()` before tools start, to produce error results for every tool in the batch.\n-   **Mid-flight cancel** in sequential mode short-circuits not-yet-started tools. In concurrent mode, all tools have already launched, so each in-flight tool must cooperatively observe `agent.cancelSignal` to stop early."
 }
]
```

## Custom Executors

Custom tool executors are not currently supported but are planned for a future release. You can track progress on this feature at [GitHub Issue #762](https://github.com/strands-agents/harness-sdk/issues/762).

## Related pages

- [Agent Loop](lc:user-guide/concepts/agents/agent-loop) (2 shared tags)
- [Hooks](lc:user-guide/concepts/agents/hooks) (2 shared tags)
- [Steering (Interventions)](lc:user-guide/concepts/agents/interventions/steering) (2 shared tags)
- [Interrupts](lc:user-guide/concepts/interrupts) (2 shared tags)
- [Creating a Custom Model Provider](lc:user-guide/concepts/model-providers/custom_model_provider) (1 shared tag)
- [Interventions](lc:user-guide/concepts/agents/interventions) (2 shared tags)
- [Retry Strategies](lc:user-guide/concepts/agents/retry-strategies) (1 shared tag)
- [Plugins](lc:user-guide/concepts/plugins) (1 shared tag)
- [Available Sandboxes](lc:user-guide/concepts/sandbox/available-sandboxes) (1 shared tag)
- [Building a Custom Sandbox](lc:user-guide/concepts/sandbox/custom-sandbox) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/tools/executors/concurrent.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/executors/concurrent.py)
- [harness-sdk/strands-py/src/strands/tools/executors/sequential.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/tools/executors/sequential.py)

### TypeScript

- [harness-sdk/strands-ts/src/tools/executors/concurrent.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/tools/executors/concurrent.ts)
- [harness-sdk/strands-ts/src/tools/executors/sequential.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/tools/executors/sequential.ts)
