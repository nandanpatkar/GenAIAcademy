As conversations grow, your agent’s context window fills with messages, tool results, and system prompts. Without management, this leads to token limit errors, degraded performance, and loss of relevant information.

The SDK ships context management configurations that work out of the box, so you don’t have to assemble conversation managers, offloaders, and thresholds by hand. Pick a mode and the SDK wires up the pieces with tuned defaults. You can still drop down to explicit configuration when you need it.

## Automatic context management

For most agents with multi-turn conversations, you don’t need to configure conversation management and context offloading separately. Pass `context_manager="auto"``contextManager: "auto"` and the SDK wires up both with tuned defaults:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\nagent = Agent(context_manager=\"auto\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\n\nconst agent = new Agent({\n  contextManager: 'auto',\n})\n```"
 }
]
```

### What it sets up

This composes two components whose defaults scored highest across [ContextBench](https://arxiv.org/abs/2602.05892) evaluations relative to other Strands Agent configurations:

-   **SummarizingConversationManager** (summary ratio of 0.3, compression threshold of 0.85): proactively summarizes older messages before the context window fills, preserving key information while freeing space for new turns.
-   **ContextOffloader plugin** (max result tokens of 1,500, preview tokens of 750): intercepts large tool results at execution time, stores them externally, and keeps a truncated preview in context. Registers a `retrieve_offloaded_content` tool so the agent can fetch full content on demand.

For full details on each component, see [Conversation Management](lc:user-guide/concepts/agents/conversation-management#summarizingconversationmanager) and [Context Offloader](lc:user-guide/concepts/plugins/context-offloader).

### Combining with explicit configuration

Your own settings take precedence when you need fine-grained control:

-   **Custom conversation manager**: If you also pass `conversation_manager``conversationManager`, your manager replaces the auto-composed `SummarizingConversationManager`. The SDK still adds the `ContextOffloader` plugin.
-   **Existing ContextOffloader**: If your `plugins` list already contains a `ContextOffloader` instance, no duplicate is added. Your configuration is preserved.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.agent.conversation_manager import (\n    SlidingWindowConversationManager,\n)\n\n# Your conversation manager is used;\n# ContextOffloader is still added automatically\nagent = Agent(\n    context_manager=\"auto\",\n    conversation_manager=SlidingWindowConversationManager(\n        window_size=30,\n    ),\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, SlidingWindowConversationManager } from '@strands-agents/sdk'\n\n// Your conversation manager is used;\n// ContextOffloader is still added automatically\nconst agent = new Agent({\n  contextManager: 'auto',\n  conversationManager: new SlidingWindowConversationManager({\n    windowSize: 30,\n  }),\n})\n```"
 }
]
```

## Agentic context management

Auto mode compresses on a fixed threshold the SDK controls. Agentic mode hands that control to the model. Pass `context_manager="agentic"``contextManager: "agentic"` and the model manages its own working memory: it sees how full the context window is and chooses when to compress, what to compress, and what to protect.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\nagent = Agent(context_manager=\"agentic\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\n\nconst agent = new Agent({\n  contextManager: 'agentic',\n})\n```"
 }
]
```

The model is better positioned than a threshold to know which messages still matter. A coding agent can drop a stale file it already edited while pinning the failing test it is working toward. A threshold cannot tell the difference; it compresses by age. Agentic mode trades tokens for that judgment.

### What it sets up

Two things give the model the information and the levers to manage context.

**Token-usage telemetry.** Before each model call, the SDK appends a status block to the latest message reporting how much of the window is in use:

```plaintext
<context-status>
<used>50,000 / 200,000 tokens (25.0%)</used>
<remaining>~150,000 tokens</remaining>
</context-status>
```

This is the signal the model acts on. It decides whether the window is full enough to compress, instead of waiting for a fixed cutoff.

**Three tools the model can call**, each a different lever with its own choices:

-   `summarize_context` folds older messages into a model-written summary. The model chooses how many recent messages to keep verbatim, how aggressively to summarize, and whether to target tool results, discussion, or both.
-   `truncate_context` drops older messages outright when they no longer need preserving. The model again chooses how much recent history to keep and what kind of messages to target.
-   `pin_context` marks messages that must survive compression: a user constraint, a key fact, the current task. Pinned messages are never evicted by either tool. The model can pin the current exchange, the last few messages, or specific ones.

Recent messages stay verbatim regardless, and the first user message is always preserved so the conversation stays valid. New tools may be added to agentic mode in future releases.

Behind the tools, agentic mode also composes a `SummarizingConversationManager` with no proactive compression and a `ContextOffloader`. The conversation manager is only a safety net: if the model lets the window overflow anyway, it compresses reactively. The offloader uses a higher inline threshold than auto mode (8,000 tokens versus 1,500), since the model is already managing context and benefits from seeing more tool output inline before it is offloaded.

### Choosing between auto and agentic

Use `"auto"` for most agents. It manages context in the background, with no model involvement and no extra tool calls. Reach for `"agentic"` when you want the model itself to decide what stays in context: it judges relevance per message rather than compressing on a fixed threshold. The tradeoff is the tokens the model spends reading telemetry and calling the tools.

## Limitations

**Stateful models**: Stateful models manage conversation state server-side. Setting `context_manager``contextManager` to either mode with a stateful model raises a `ValueError``Error`.

Both modes compose an offloader that uses in-memory storage, which does not persist across process restarts. If your agent uses session management and needs durable offloaded content, configure an explicit `ContextOffloader` with `FileStorage` or `S3Storage`. See [Storage Backends](lc:user-guide/concepts/plugins/context-offloader#storage-backends).

## Related pages

- [Context Offloader](lc:user-guide/concepts/plugins/context-offloader) (2 shared tags)
- [Conversation Management](lc:user-guide/concepts/agents/conversation-management) (2 shared tags)
- [Context Injector](lc:user-guide/concepts/plugins/context-injector) (1 shared tag)
- [Coherence Evaluator](lc:user-guide/evals-sdk/evaluators/coherence_evaluator) (1 shared tag)
- [Conciseness Evaluator](lc:user-guide/evals-sdk/evaluators/conciseness_evaluator) (1 shared tag)
- [Goal Success Rate Evaluator](lc:user-guide/evals-sdk/evaluators/goal_success_rate_evaluator) (1 shared tag)
- [Helpfulness Evaluator](lc:user-guide/evals-sdk/evaluators/helpfulness_evaluator) (1 shared tag)
- [Interactions Evaluator](lc:user-guide/evals-sdk/evaluators/interactions_evaluator) (1 shared tag)
- [Output Evaluator](lc:user-guide/evals-sdk/evaluators/output_evaluator) (1 shared tag)
- [Skills](lc:user-guide/concepts/plugins/skills) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/_context_manager/modes/agentic/agentic_context.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/_context_manager/modes/agentic/agentic_context.py)
- [harness-sdk/strands-py/src/strands/agent/conversation_manager/conversation_manager.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/agent/conversation_manager/conversation_manager.py)

### TypeScript

- [harness-sdk/strands-ts/src/context-manager/modes/agentic/agentic-context.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/context-manager/modes/agentic/agentic-context.ts)
- [harness-sdk/strands-ts/src/conversation-manager/conversation-manager.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/conversation-manager/conversation-manager.ts)
