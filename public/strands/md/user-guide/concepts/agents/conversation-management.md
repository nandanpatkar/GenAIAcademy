In the Strands Agents SDK, context refers to the information provided to the agent for understanding and reasoning. This includes:

-   User messages
-   Agent responses
-   Tool usage and results
-   System prompts

As conversations grow, managing this context becomes increasingly important for several reasons:

1.  **Token Limits**: Language models have fixed context windows (maximum tokens they can process)
2.  **Performance**: Larger contexts require more processing time and resources
3.  **Relevance**: Older messages may become less relevant to the current conversation
4.  **Coherence**: Maintaining logical flow and preserving important information

> [!TIP] Quick setup
>
> For most agents, you can skip manual configuration entirely. See [Context Management](lc:user-guide/concepts/context-management).

## Built-in Conversation Managers

The SDK provides a flexible system for context management through the ConversationManager interface. This allows you to implement different strategies for managing conversation history. You can either leverage one of Strands’s provided managers:

-   [**NullConversationManager**](#nullconversationmanager): A simple implementation that does not modify conversation history
-   [**SlidingWindowConversationManager**](#slidingwindowconversationmanager): Maintains a fixed number of recent messages (default manager)
-   [**SummarizingConversationManager**](#summarizingconversationmanager): Intelligently summarizes older messages to preserve context

or [build your own manager](#creating-a-conversationmanager) that matches your requirements.

### NullConversationManager

The [`NullConversationManager`](lc:api/python/strands.agent.conversation_manager.null_conversation_manager#NullConversationManager) is a simple implementation that does not modify the conversation history. It’s useful for:

-   Short conversations that won’t exceed context limits
-   Debugging purposes
-   Cases where you want to manage context manually

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.agent.conversation_manager import NullConversationManager\n\nagent = Agent(\n    conversation_manager=NullConversationManager()\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, NullConversationManager } from '@strands-agents/sdk'\n\nconst agent = new Agent({\n  conversationManager: new NullConversationManager(),\n})\n```"
 }
]
```

### SlidingWindowConversationManager

The [`SlidingWindowConversationManager`](lc:api/python/strands.agent.conversation_manager.sliding_window_conversation_manager#SlidingWindowConversationManager) implements a sliding window strategy that maintains a fixed number of recent messages. This is the default conversation manager used by the Agent class.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.agent.conversation_manager import SlidingWindowConversationManager\n\n# Create a conversation manager with custom window size\nconversation_manager = SlidingWindowConversationManager(\n    window_size=20,  # Maximum number of messages to keep\n    should_truncate_results=True, # Enable truncating the tool result when a message is too large for the model's context window\n)\n\nagent = Agent(\n    conversation_manager=conversation_manager\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, SlidingWindowConversationManager } from '@strands-agents/sdk'\n\n// Create a conversation manager with custom window size\nconst conversationManager = new SlidingWindowConversationManager({\n  windowSize: 40, // Maximum number of messages to keep\n  shouldTruncateResults: true, // Enable truncating the tool result when a message is too large for the model's context window\n})\n\nconst agent = new Agent({\n  conversationManager,\n})\n```"
 }
]
```

Key features of the `SlidingWindowConversationManager`:

-   **Maintains Window Size**: Automatically removes messages from the window if the number of messages exceeds the limit.
    
-   **Dangling Message Cleanup**: Removes incomplete message sequences to maintain valid conversation state.
    
-   **Overflow Trimming**: In the case of a context window overflow, it will trim the oldest messages from history until the request fits in the models context window.
    
-   **Configurable Tool Result Truncation**: Enable or disable truncation of tool results when the message exceeds context window limits. When enabled (the default; `should_truncate_results=True``shouldTruncateResults: true`), the oldest message with tool results is truncated first so recent context is preserved as long as possible. Truncation depends on content type:
    
    -   Text payloads keep their head and tail, separated by a `<truncated chars="N"/>` marker.
    -   Images, videos, binary documents, and oversized JSON are replaced by a typed placeholder, for example `[image: png, source: bytes, 12345 bytes]`.
    -   The tool result’s original `status` and `error` fields are preserved.
    
    When disabled, full results are preserved but more historical messages may be removed. For a proactive alternative that preserves full content externally, see the [Context Offloader](lc:user-guide/concepts/plugins/context-offloader) plugin.
    
-   **Per-Turn Management**: Optionally apply context management proactively during the agent loop execution, not just at the end.
    
-   **Message Pinning**: Protect specific messages from trimming during context reduction. See [Message Pinning](#message-pinning).
    
-   **Proactive Compression**: Pass `proactiveCompression: true` or `proactiveCompression: { compressionThreshold: 0.7 }` to trigger context reduction before the model call when projected input tokens exceed a configurable threshold. See [Proactive Context Compression](#proactive-context-compression).
    

**Per-Turn Management**:

By default, the `SlidingWindowConversationManager` applies context management only after the agent loop completes. The `per_turn` parameter allows you to proactively manage context during execution, which is useful for long-running agent loops with many tool calls.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.agent.conversation_manager import SlidingWindowConversationManager\n\n# Apply management before every model call\nconversation_manager = SlidingWindowConversationManager(\n    per_turn=True,  # Apply management before each model call\n)\n\n# Or apply management every N model calls\nconversation_manager = SlidingWindowConversationManager(\n    per_turn=3,  # Apply management every 3 model calls\n)\n\nagent = Agent(\n    conversation_manager=conversation_manager\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```ts\n// Not supported in TypeScript\n```"
 }
]
```

The `per_turn` parameter accepts:

-   `False` (default): Only apply management after the agent loop completes
-   `True`: Apply management before every model call
-   An integer `N` (must be > 0): Apply management every N model calls

### SummarizingConversationManager

The [`SummarizingConversationManager`](lc:api/python/strands.agent.conversation_manager.summarizing_conversation_manager#SummarizingConversationManager) (Python) / [`SummarizingConversationManager`](https://strandsagents.com/docs/api/typescript/SummarizingConversationManager/) (TypeScript) implements intelligent conversation context management by summarizing older messages instead of simply discarding them. This approach preserves important information while staying within context limits.

```sa-tabs
[
 {
  "label": "Python",
  "body": "Configuration parameters:\n\n-   **`summary_ratio`** (float, default: 0.3): Ratio of the oldest messages to summarize and replace when reducing context (clamped between 0.1 and 0.8)\n-   **`preserve_recent_messages`** (int, default: 10): Minimum number of recent messages to always keep\n-   **`summarization_agent`** (Agent, optional): Custom agent for generating summaries. If not provided, uses the main agent instance. Cannot be used together with `summarization_system_prompt`.\n-   **`summarization_system_prompt`** (str, optional): Custom system prompt for summarization. If not provided, uses a default prompt that creates structured bullet-point summaries focusing on key topics, tools used, and technical information in third-person format. Cannot be used together with `summarization_agent`."
 },
 {
  "label": "TypeScript",
  "body": "Configuration parameters:\n\n-   **`model`** (Model, optional): Override model to use for generating summaries. When not provided, uses the agent\u2019s own model.\n-   **`summaryRatio`** (number, default: 0.3): Ratio of the oldest messages to summarize and replace when reducing context (clamped between 0.1 and 0.8)\n-   **`preserveRecentMessages`** (number, default: 10): Minimum number of recent messages to always keep\n-   **`summarizationSystemPrompt`** (string, optional): Custom system prompt for summarization. If not provided, uses a default prompt that creates structured bullet-point summaries focusing on key topics, tools used, and technical information in third-person format.\n-   **`proactiveCompression`** (`boolean | { compressionThreshold: number }`, optional): Enable proactive context compression before the model call. Pass `true` for the default 0.7 threshold, or an object with a custom threshold. See [Proactive Context Compression](#proactive-context-compression)."
 }
]
```

**Basic Usage:**

```sa-tabs
[
 {
  "label": "Python",
  "body": "By default, the `SummarizingConversationManager` leverages the same model and configuration as your main agent to perform summarization.\n\n```python\nfrom strands import Agent\nfrom strands.agent.conversation_manager import SummarizingConversationManager\n\nagent = Agent(\n    conversation_manager=SummarizingConversationManager()\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "By default, the `SummarizingConversationManager` uses the agent\u2019s own model for summarization. You can optionally provide a different model to override this behavior.\n\n```typescript\nimport { Agent, SummarizingConversationManager } from '@strands-agents/sdk'\n\nconst agent = new Agent({\n  conversationManager: new SummarizingConversationManager(),\n})\n```"
 }
]
```

You can also customize the behavior by adjusting parameters like summary ratio and number of preserved messages:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.agent.conversation_manager import SummarizingConversationManager\n\n# Create the summarizing conversation manager with default settings\nconversation_manager = SummarizingConversationManager(\n    summary_ratio=0.3,  # Summarize and replace the oldest 30% of messages when context reduction is needed\n    preserve_recent_messages=10,  # Always keep 10 most recent messages\n)\n\nagent = Agent(\n    conversation_manager=conversation_manager\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, SummarizingConversationManager, BedrockModel } from '@strands-agents/sdk'\n\n// Optionally use a different model for summarization\nconst summarizationModel = new BedrockModel({\n  modelId: 'global.anthropic.claude-sonnet-4-6',\n})\n\nconst conversationManager = new SummarizingConversationManager({\n  model: summarizationModel, // Override the agent's model for summarization\n  summaryRatio: 0.3, // Summarize and replace the oldest 30% of messages\n  preserveRecentMessages: 10, // Always keep 10 most recent messages\n})\n\nconst agent = new Agent({\n  conversationManager,\n})\n```"
 }
]
```

**Custom System Prompt for Domain-Specific Summarization:**

You can customize the summarization behavior by providing a custom system prompt that tailors the summarization to your domain or use case.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.agent.conversation_manager import SummarizingConversationManager\n\n# Custom system prompt for technical conversations\ncustom_system_prompt = \"\"\"\nYou are summarizing a technical conversation. Create a concise bullet-point summary that:\n- Focuses on code changes, architectural decisions, and technical solutions\n- Preserves specific function names, file paths, and configuration details\n- Omits conversational elements and focuses on actionable information\n- Uses technical terminology appropriate for software development\n\nFormat as bullet points without conversational language.\n\"\"\"\n\nconversation_manager = SummarizingConversationManager(\n    summarization_system_prompt=custom_system_prompt\n)\n\nagent = Agent(\n    conversation_manager=conversation_manager\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, SummarizingConversationManager } from '@strands-agents/sdk'\n\n// Custom system prompt for technical conversations\n  const customSystemPrompt = `\nYou are summarizing a technical conversation.\nCreate a concise bullet-point summary that:\n- Focuses on code changes, architectural decisions, and technical solutions\n- Preserves specific function names, file paths, and configuration details\n- Omits conversational elements and focuses on actionable information\n- Uses technical terminology appropriate for software development\n\nFormat as bullet points without conversational language.\n`\n\n  const conversationManager = new SummarizingConversationManager({\n    summarizationSystemPrompt: customSystemPrompt,\n  })\n\n  const agent = new Agent({\n    conversationManager,\n  })\n```"
 }
]
```

**Advanced Configuration with Custom Summarization Agent:**

```sa-tabs
[
 {
  "label": "Python",
  "body": "For advanced use cases, you can provide a custom `summarization_agent` to handle the summarization process. This enables using a different model (such as a faster or a more cost-effective one), incorporating tools during summarization, or implementing specialized summarization logic tailored to your domain. The custom agent can leverage its own system prompt, tools, and model configuration to generate summaries that best preserve the essential context for your specific use case.\n\n```python\nfrom strands import Agent\nfrom strands.agent.conversation_manager import SummarizingConversationManager\nfrom strands.models import AnthropicModel\n\n# Create a cheaper, faster model for summarization tasks\nsummarization_model = AnthropicModel(\n    model_id=\"claude-haiku-4-5-20251001\",  # More cost-effective for summarization\n    max_tokens=1000,\n    params={\"temperature\": 0.1}  # Low temperature for consistent summaries\n)\ncustom_summarization_agent = Agent(model=summarization_model)\n\nconversation_manager = SummarizingConversationManager(\n    summary_ratio=0.4,\n    preserve_recent_messages=8,\n    summarization_agent=custom_summarization_agent\n)\n\nagent = Agent(\n    conversation_manager=conversation_manager\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "Pass a custom `model` to `SummarizingConversationManager` to override the model used for summarization. This enables using a different model, such as a faster or more cost-effective one, without affecting the agent\u2019s primary model. Injecting a full `Agent` (with its own tools, hooks, or plugins) for summarization is not currently supported in TypeScript.\n\n```typescript\nimport { Agent, SummarizingConversationManager } from '@strands-agents/sdk'\nimport { AnthropicModel } from '@strands-agents/sdk/models/anthropic'\n\n// Use a cheaper, faster model for summarization tasks\nconst summarizationModel = new AnthropicModel({\n  modelId: 'claude-haiku-4-5-20251001',\n  maxTokens: 1000,\n  params: { temperature: 0.1 }, // Low temperature for consistent summaries\n})\n\nconst conversationManager = new SummarizingConversationManager({\n  model: summarizationModel,\n  summaryRatio: 0.4,\n  preserveRecentMessages: 8,\n})\n\nconst agent = new Agent({\n  conversationManager,\n})\n```"
 }
]
```

#### Key Features

-   **Context Window Management**: Automatically reduces context when token limits are exceeded
-   **Intelligent Summarization**: Uses structured bullet-point summaries to capture key information
-   **Tool Pair Preservation**: Ensures tool use and result message pairs aren’t broken during summarization
-   **Message Pinning**: Protect specific messages from summarization during context reduction. See [Message Pinning](#message-pinning).
-   **Flexible Configuration**: Customize summarization behavior through various parameters
-   **Fallback Safety**: Handles summarization failures gracefully

## Message Pinning

Message pinning protects specific messages from eviction during context reduction. Pinned messages survive both sliding-window trimming and summarization, which makes pinning useful for preserving system prompts, critical instructions, or key decisions that must remain in the conversation regardless of length.

Messages are pinned by setting `metadata.custom.pinned = true` on the message object. The SDK provides both a declarative configuration (`pin_first` / `pinFirst`) and runtime utility functions for programmatic control.

### Protecting Initial Messages with `pin_first`

Both `SlidingWindowConversationManager` and `SummarizingConversationManager` accept a `pin_first` (Python) / `pinFirst` (TypeScript) parameter that permanently protects the first N messages from eviction. This is the simplest way to preserve system prompts or initial instructions across all context reductions.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.agent.conversation_manager import SlidingWindowConversationManager\n\nagent = Agent(\n    conversation_manager=SlidingWindowConversationManager(\n        window_size=40,\n        pin_first=1,\n    )\n)\n```\n\nThe same parameter works with `SummarizingConversationManager`:\n\n```python\nfrom strands.agent.conversation_manager import SummarizingConversationManager\n\nagent = Agent(\n    conversation_manager=SummarizingConversationManager(\n        pin_first=2,\n    )\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, SlidingWindowConversationManager } from '@strands-agents/sdk'\n\nconst agent = new Agent({\n  conversationManager: new SlidingWindowConversationManager({\n    windowSize: 40,\n    pinFirst: 1,\n  }),\n})\n```\n\nThe same parameter works with `SummarizingConversationManager`."
 }
]
```

The pin metadata is written during the first context reduction and remains set permanently, protecting those messages through all subsequent reductions.

## Proactive Context Compression

By default, conversation managers are reactive. They only reduce context after the model rejects a request with a context window overflow error. Proactive compression avoids wasting round-trips and output token starvation by triggering context reduction before the model call when the projected input token count exceeds a configurable threshold of the model’s context window.

### Enabling Proactive Compression

```sa-tabs
[
 {
  "label": "Python",
  "body": "Pass `proactive_compression` to any built-in conversation manager. Use `True` for the default 0.7 threshold, or pass a dict with a custom `compression_threshold` ratio between 0 and 1. For example, `0.7` will trigger compression when 70% of the model\u2019s context window is used:\n\n**With SlidingWindowConversationManager:**\n\n```python\nfrom strands import Agent\nfrom strands.agent.conversation_manager import SlidingWindowConversationManager\n\nagent = Agent(\n    conversation_manager=SlidingWindowConversationManager(\n        window_size=50,\n        proactive_compression={\"compression_threshold\": 0.7},\n    ),\n)\n```\n\n**With SummarizingConversationManager:**\n\n```python\nfrom strands import Agent\nfrom strands.agent.conversation_manager import SummarizingConversationManager\n\nagent = Agent(\n    conversation_manager=SummarizingConversationManager(\n        proactive_compression=True,\n    ),\n)\n```\n\nWithout `proactive_compression`, only reactive overflow recovery is used."
 },
 {
  "label": "TypeScript",
  "body": "Pass `proactiveCompression` to any built-in conversation manager. Use `true` for the default 0.7 threshold, or pass an object with a custom `compressionThreshold` ratio between 0 and 1. For example, `0.7` will trigger compression when 70% of the model\u2019s context window is used:\n\n**With SlidingWindowConversationManager:**\n\n```typescript\nimport { Agent, SlidingWindowConversationManager } from '@strands-agents/sdk'\n\nconst agent = new Agent({\n  conversationManager: new SlidingWindowConversationManager({\n    windowSize: 50,\n    proactiveCompression: { compressionThreshold: 0.7 },\n  }),\n})\n```\n\n**With SummarizingConversationManager:**\n\n```typescript\nimport { Agent, SummarizingConversationManager } from '@strands-agents/sdk'\n\nconst agent = new Agent({\n  conversationManager: new SummarizingConversationManager({\n    proactiveCompression: true,\n  }),\n})\n```\n\nWithout `proactiveCompression`, only reactive overflow recovery is used."
 }
]
```

### How It Works

Before each model call, the agent estimates the projected input token count and attaches it to the `BeforeModelCallEvent`. When proactive compression is configured, the conversation manager compares this estimate against the model’s `contextWindowLimit`:

```plaintext
if projectedInputTokens / contextWindowLimit >= compressionThreshold:
    reduce()  // proactively compress context
```

Each conversation manager uses the same reduction logic for proactive compression as reactive overflow recovery. Proactive compression is best-effort only, so if `reduce()` throws or returns `false`, the error is swallowed and the model call proceeds normally.

Because `BeforeModelCallEvent` triggers before every model call including calls within a tool-use cycle, this provides automatic in-loop compression. If an agent makes five tool calls in a single invocation and context grows past the threshold between calls three and four, compression triggers before call four.

### Context Window Limit

The threshold check requires the model’s context window size. The SDK auto-populates `contextWindowLimit` from built-in lookup tables ([Python](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/models/_defaults.py), [TypeScript](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/models/defaults.ts)) for known models. You can override it manually for models not in the lookup table:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nmodel = BedrockModel(\n    model_id=\"my-custom-model\",\n    context_window_limit=128_000,\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst model = new BedrockModel({\n  modelId: 'my-custom-model',\n  contextWindowLimit: 128_000,\n})\n```"
 }
]
```

> [!WARNING] Inaccurate compression with default fallback
>
> If `contextWindowLimit` is not set and the model ID is not in the built-in lookup table, the SDK falls back to a default of 200,000 tokens. When the default token limit is used but the model’s actual context window is significantly different, proactive compression will not behave correctly.

### Token Estimation

The agent estimates input tokens using the following strategy:

1.  **Known baseline**: Reads `inputTokens + outputTokens` from the last assistant message’s `metadata.usage`
2.  **Delta estimation**: Only estimates tokens for new messages added since that assistant message using the model’s `countTokens()` method
3.  **Cold start fallback**: When no prior usage metadata exists (first call or after session restore without metadata), estimates all messages via `countTokens()`

The `countTokens()` method uses a character-based heuristic to estimate token count by default (characters ÷ 4 for text, characters ÷ 2 for JSON). Some model providers support native token counting APIs for exact counts, which can be enabled on the model. See the Token Counting section on each provider’s page for details and instructions:

-   [Amazon Bedrock](lc:user-guide/concepts/model-providers/amazon-bedrock#token-counting)
-   [Anthropic](lc:user-guide/concepts/model-providers/anthropic#token-counting)
-   [Google Gemini](lc:user-guide/concepts/model-providers/google#token-counting)
-   [OpenAI Responses](lc:user-guide/concepts/model-providers/openai-responses#token-counting)
-   [llama.cpp](lc:user-guide/concepts/model-providers/llamacpp#token-counting)

## Creating a ConversationManager

```sa-tabs
[
 {
  "label": "Python",
  "body": "To create a custom conversation manager, implement the [`ConversationManager`](lc:api/python/strands.agent.conversation_manager.conversation_manager#ConversationManager) interface, which is composed of three key elements:\n\n1.  [`apply_management`](lc:api/python/strands.agent.conversation_manager.conversation_manager#ConversationManager.apply_management): This method is called after each event loop cycle completes to manage the conversation history. It\u2019s responsible for applying your management strategy to the messages array, which may have been modified with tool results and assistant responses. The agent runs this method automatically after processing each user input and generating a response.\n    \n2.  [`reduce_context`](lc:api/python/strands.agent.conversation_manager.conversation_manager#ConversationManager.reduce_context): This method is called when the model\u2019s context window is exceeded (typically due to token limits). It implements the specific strategy for reducing the window size when necessary. The agent calls this method when it encounters a context window overflow exception, giving your implementation a chance to trim the conversation history before retrying.\n    \n3.  `removed_message_count`: This attribute is tracked by conversation managers, and utilized by [Session Management](lc:user-guide/concepts/agents/session-management) to efficiently load messages from the session storage. The count represents messages provided by the user or LLM that have been removed from the agent\u2019s messages, but not messages included by the conversation manager through something like summarization.\n    \n4.  `register_hooks` (optional): Override this method to integrate with [hooks](lc:user-guide/concepts/agents/hooks). This enables proactive context management patterns, such as trimming context before model calls. Always call `super().register_hooks` when overriding.\n    \n\nSee the [SlidingWindowConversationManager](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/agent/conversation_manager/sliding_window_conversation_manager.py) implementation as a reference example."
 },
 {
  "label": "TypeScript",
  "body": "To create a custom conversation manager, extend the abstract [`ConversationManager`](https://strandsagents.com/docs/api/typescript/ConversationManager/) base class and implement the `reduce` method:\n\n1.  **`reduce(options: ReduceOptions): boolean`**: Called in two scenarios: reactively when a `ContextWindowOverflowError` occurs (`options.error` is set), and proactively before model calls that exceed the compression threshold (`options.error` is `undefined`). Mutate `agent.messages` in place to reduce history, then return `true` if any reduction was made. When `error` is set, returning `false` lets the error propagate out of the agent loop uncaught. When `error` is `undefined`, returning `false` or throwing is safe \u2014 the model call proceeds regardless.\n    \n2.  **`initAgent(agent)` (optional)**: Override to add proactive management (e.g. trimming after each invocation). Always call `super.initAgent(agent)` to preserve the built-in overflow recovery and proactive compression hooks.\n    \n\n```typescript\nimport {\n  Agent,\n  ConversationManager,\n  type ConversationManagerReduceOptions,\n} from '@strands-agents/sdk'\n\nclass Last10MessagesManager extends ConversationManager {\n  readonly name = 'my:last-10-messages'\n\n  reduce({ agent }: ConversationManagerReduceOptions): boolean {\n    if (agent.messages.length <= 10) return false\n    agent.messages.splice(0, agent.messages.length - 10)\n    return true\n  }\n}\n\nconst agent = new Agent({\n  conversationManager: new Last10MessagesManager(),\n})\n```\n\nFor proactive management alongside overflow recovery, override `initAgent`:\n\n```typescript\nimport {\n  Agent,\n  ConversationManager,\n  AfterInvocationEvent,\n  type AgentData,\n  type ConversationManagerReduceOptions,\n} from '@strands-agents/sdk'\n\nclass MyManager extends ConversationManager {\n  readonly name = 'my:manager'\n  private readonly _maxMessages = 5\n\n  reduce({ agent }: ConversationManagerReduceOptions): boolean {\n    return this._trim(agent.messages)\n  }\n\n  override initAgent(agent: LocalAgent): void {\n    super.initAgent(agent) // preserves overflow recovery\n    agent.addHook(AfterInvocationEvent, (event) => {\n      this._trim(event.agent.messages)\n    })\n  }\n\n  private _trim(messages: LocalAgent['messages']): boolean {\n    if (messages.length <= this._maxMessages) return false\n    messages.splice(0, messages.length - this._maxMessages)\n    return true\n  }\n}\n```\n\nSee the [SlidingWindowConversationManager](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/conversation-manager/sliding-window-conversation-manager.ts) implementation as a reference example."
 }
]
```

## Related pages

- [Context Management](lc:user-guide/concepts/context-management) (2 shared tags)
- [Context Offloader](lc:user-guide/concepts/plugins/context-offloader) (2 shared tags)
- [Context Injector](lc:user-guide/concepts/plugins/context-injector) (1 shared tag)
- [Storage](lc:user-guide/concepts/storage) (1 shared tag)
- [Coherence Evaluator](lc:user-guide/evals-sdk/evaluators/coherence_evaluator) (1 shared tag)
- [Conciseness Evaluator](lc:user-guide/evals-sdk/evaluators/conciseness_evaluator) (1 shared tag)
- [Goal Success Rate Evaluator](lc:user-guide/evals-sdk/evaluators/goal_success_rate_evaluator) (1 shared tag)
- [Helpfulness Evaluator](lc:user-guide/evals-sdk/evaluators/helpfulness_evaluator) (1 shared tag)
- [Interactions Evaluator](lc:user-guide/evals-sdk/evaluators/interactions_evaluator) (1 shared tag)
- [Output Evaluator](lc:user-guide/evals-sdk/evaluators/output_evaluator) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/agent/conversation_manager/conversation_manager.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/agent/conversation_manager/conversation_manager.py)
- [harness-sdk/strands-py/src/strands/agent/conversation_manager/sliding_window_conversation_manager.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/agent/conversation_manager/sliding_window_conversation_manager.py)
- [harness-sdk/strands-py/src/strands/agent/conversation_manager/summarizing_conversation_manager.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/agent/conversation_manager/summarizing_conversation_manager.py)

### TypeScript

- [harness-sdk/strands-ts/src/conversation-manager/conversation-manager.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/conversation-manager/conversation-manager.ts)
- [harness-sdk/strands-ts/src/conversation-manager/sliding-window-conversation-manager.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/conversation-manager/sliding-window-conversation-manager.ts)
- [harness-sdk/strands-ts/src/conversation-manager/summarizing-conversation-manager.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/conversation-manager/summarizing-conversation-manager.ts)
