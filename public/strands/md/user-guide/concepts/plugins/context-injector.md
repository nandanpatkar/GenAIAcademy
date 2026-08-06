The `ContextInjector` plugin folds real-time text into the model input before each call. The text is added to that single call’s input only: it is never written to the conversation history, so it is not persisted or replayed on later turns. Use it for context the agent should always have but that does not belong in the stored history: the current time, a sandbox descriptor, environment facts, or a retrieval lookup.

## How It Works

A `ContextInjector` has two parts. The callback function decides **what** text to fold into the next model call’s input. The trigger decides **when** the callback is called. The injected text is **ephemeral by design**: it augments the model input for that one call and never persists into the durable conversation or session.

This is the same injection mechanism that powers [memory context injection](lc:user-guide/concepts/memory/overview#context-injection). `ContextInjector` is the generic surface for any consumer.

## Getting Started

Pass a `ContextInjector` to your agent’s `plugins` list with a callback that renders the text to inject. By default it injects only on a fresh user turn, the common case for chat agents:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom datetime import datetime, timezone\n\nfrom strands import Agent\nfrom strands.vended_plugins.context_injector import ContextInjector\n\nagent = Agent(\n    plugins=[\n        ContextInjector(lambda context: f\"<now>{datetime.now(timezone.utc).isoformat()}</now>\"),\n    ],\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { ContextInjector } from '@strands-agents/sdk/vended-plugins/context-injector'\n\nconst agent = new Agent({\n  plugins: [\n    new ContextInjector({\n      renderContent: async () => `<now>${new Date().toISOString()}</now>`,\n    }),\n  ],\n})\n```"
 }
]
```

## When to Inject

The trigger controls when the callback runs:

-   `'userTurn'` (the default) injects only when the latest message is a fresh user ask, a user message carrying no tool result. This is the common case for chat agents.
-   `'everyTurn'` injects before every model call, including mid-task tool-result turns. Use it for autonomous agents that should consult the injected context at each step.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom datetime import datetime, timezone\n\nfrom strands.vended_plugins.context_injector import ContextInjector\n\nclock = ContextInjector(\n    lambda context: f\"<now>{datetime.now(timezone.utc).isoformat()}</now>\",\n    name=\"clock\",\n    trigger=\"everyTurn\",  # inject before every model call, not just fresh user asks\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { ContextInjector } from '@strands-agents/sdk/vended-plugins/context-injector'\n\nconst clock = new ContextInjector({\n  name: 'clock',\n  trigger: 'everyTurn', // inject before every model call, not just fresh user asks\n  renderContent: async () => `<now>${new Date().toISOString()}</now>`,\n})\n```"
 }
]
```

For finer control, pass a predicate: a function that receives the injection context and returns whether to inject this call. The context carries the current messages, durable state shared across calls via `context.state``context.appState`, and the agent. A predicate that throws fails open, so the model call still proceeds:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.vended_plugins.context_injector import ContextInjector\n\ninjector = ContextInjector(\n    lambda context: f\"<context>{len(context.messages)} turns so far</context>\",\n    # Inject only when a tool stashed a flag in agent state last turn.\n    trigger=lambda context: context.state.get(\"recall_enabled\") is True,\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { ContextInjector } from '@strands-agents/sdk/vended-plugins/context-injector'\nimport type { InjectionContext } from '@strands-agents/sdk/vended-plugins/context-injector'\n\nconst injector = new ContextInjector({\n  // Inject only when a tool stashed a flag in app state last turn.\n  trigger: ({ appState }: InjectionContext) => appState.get('recallEnabled') === true,\n  renderContent: async ({ messages }) =>\n    `<context>${messages.length} turns so far</context>`,\n})\n```"
 }
]
```

## Configuration

| Field | Purpose |
| --- | --- |
| `render_content``renderContent` | Returns the text to inject for this call, or `None / empty string``undefined / empty string` to skip. Required, and the only positional argument. |
| `trigger` | `'userTurn'` (default), `'everyTurn'`, or a predicate over the injection context. |
| `name` | Plugin name for logging and duplicate detection. Defaults to `'strands:context-injector'`. Set a distinct name when registering more than one. |

> [!WARNING] Injected text reaches the model verbatim
>
> The rendered text is a prompt-injection surface. If it interpolates attacker-influenced data (tool output, user-derived state), escape it yourself before returning. A callback that throws fails open: injection is skipped and the model call proceeds.

## Related

-   [Memory](lc:user-guide/concepts/memory/overview#context-injection) builds on this engine to inject retrieved knowledge before a model call.

## Related pages

- [Context Management](lc:user-guide/concepts/context-management) (1 shared tag)
- [Skills](lc:user-guide/concepts/plugins/skills) (1 shared tag)
- [Context Offloader](lc:user-guide/concepts/plugins/context-offloader) (1 shared tag)
- [Conversation Management](lc:user-guide/concepts/agents/conversation-management) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/vended_plugins/context_injector/plugin.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/context_injector/plugin.py)

### TypeScript

- [harness-sdk/strands-ts/src/vended-plugins/context-injector/plugin.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-plugins/context-injector/plugin.ts)
