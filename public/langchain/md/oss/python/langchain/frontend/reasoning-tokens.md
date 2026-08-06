Reasoning tokens expose the internal thought process of advanced models like OpenAI's GPT-5 and Anthropic's Claude with extended thinking. These models produce structured content blocks that separate reasoning from the final answer, letting you build UIs that show *how* the model arrived at its response.


## What are reasoning tokens?

When models with reasoning capabilities process a prompt, they generate two distinct types of content:

1. **Reasoning blocks**: the model's internal chain-of-thought, problem decomposition, and step-by-step analysis
2. **Text blocks**: the final, polished response presented to the user

These are delivered as typed content blocks within an `AIMessage`, accessible via the `contentBlocks` property:

```ts
// Reasoning block
{ type: "reasoning", reasoning: "Let me think about this step by step..." }

// Text block
{ type: "text", text: "The answer is 42." }
```


> [!NOTE]
>
> Not all models produce reasoning tokens. This pattern applies specifically to models that support extended thinking or chain-of-thought output. Standard chat models return only text blocks.


## Use cases

- **Transparency**: show users the model's reasoning process to build trust in its answers
- **Debugging**: inspect the model's thought process to identify where it goes wrong
- **Educational tools**: teach students problem-solving by revealing how an AI approaches questions
- **Decision support**: let domain experts validate the reasoning behind recommendations
- **Quality assurance**: audit reasoning chains for compliance in regulated industries

## Extracting reasoning and text blocks

The `contentBlocks` array on an `AIMessage` contains all blocks in the order they were generated. Filter them by `type` to separate reasoning from text:

```ts

function extractBlocks(msg: AIMessage) {
  const reasoningBlocks = msg.contentBlocks
    .filter((b) => b.type === "reasoning")
    .map((b) => b.reasoning);

  const textBlocks = msg.contentBlocks
    .filter((b) => b.type === "text")
    .map((b) => b.text);

  return {
    reasoning: reasoningBlocks.join(""),
    text: textBlocks.join(""),
  };
}
```

A single message may contain multiple reasoning blocks (e.g., if the model pauses its reasoning, produces partial text, then reasons further). Joining them gives you the complete thought process.

## Accessing messages from `useStream`

Connect `useStream` to your reasoning-capable agent and iterate
`stream.messages` in your chat UI. Branch on `HumanMessage.isInstance` and
`AIMessage.isInstance`, then pass each assistant message to a component that
reads `contentBlocks` and separates reasoning from text. Set `isStreaming` on
the last message while `stream.isLoading` is true so thinking blocks update as
tokens arrive.


> [!NOTE]
>
> The code examples use `useStream<typeof myAgent>` for type-safe stream state. See Type inference for [Python](lc:oss/python/langchain/frontend/overview#type-inference) or [JavaScript](lc:oss/python/langchain/frontend/overview#type-inference) backends.


```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "function Chat() {\n  const stream = useStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"reasoning\",\n  });\n\n  return (\n\n      {stream.messages.map((msg, i) => {\n        if (HumanMessage.isInstance(msg)) {\n          return ;\n        }\n        if (AIMessage.isInstance(msg)) {\n          return (\n\n          );\n        }\n        return null;\n      })}\n\n  );\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nconst stream = useStream<typeof myAgent>({\n  apiUrl: \"http://localhost:2024\",\n  assistantId: \"reasoning\",\n});\n</script>\n\n<template>\n\n    <template v-for=\"(msg, i) in stream.messages.value\" :key=\"i\">\n\n\n    </template>\n\n</template>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n\n  const stream = useStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"reasoning\",\n  });\n</script>\n\n  {#each stream.messages as msg, i}\n    {#if HumanMessage.isInstance(msg)}\n\n    {:else if AIMessage.isInstance(msg)}\n\n    {/if}\n  {/each}"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "@Component({\n  selector: \"app-chat\",\n  template: `\n\n      @for (msg of stream.messages(); track $index) {\n        @if (isHuman(msg)) {\n          <human-bubble [text]=\"msg.text\" />\n        } @else if (isAI(msg)) {\n          <ai-response\n            [message]=\"msg\"\n            [isStreaming]=\"stream.isLoading() && $index === stream.messages().length - 1\"\n          />\n        }\n      }\n\n  `,\n})\nexport class ChatComponent {\n  stream = injectStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"reasoning\",\n  });\n\n  isHuman = HumanMessage.isInstance;\n  isAI = AIMessage.isInstance;\n}"
 }
]
```

## Building a ThinkingBubble component

The `ThinkingBubble` presents reasoning tokens in a visually distinct, collapsible container. Users can expand it to see the full thought process or collapse it to focus on the final answer.

```tsx

function ThinkingBubble({
  reasoning,
  isStreaming,
}: {
  reasoning: string;
  isStreaming: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const charCount = reasoning.length;
  const previewLength = 120;
  const preview =
    reasoning.length > previewLength
      ? reasoning.slice(0, previewLength) + "..."
      : reasoning;

  return (
    
      <button
        className="thinking-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="thinking-icon">
          {isStreaming ? (
            <span className="thinking-spinner" />
          ) : (
            "💭"
          )}
        </span>
        <span className="thinking-label">
          {isStreaming ? "Thinking..." : `Thought process (${charCount} chars)`}
        </span>
        <span className={`chevron ${isExpanded ? "expanded" : ""}`}>▶</span>
      </button>

      {isExpanded && (
        
          <pre>{reasoning}</pre>
        
      )}

      {!isExpanded && !isStreaming && (
        {preview}
      )}
    
  );
}
```

## Rendering the complete AI response

Combine the `ThinkingBubble` and a standard text bubble into a single `AIResponse` component:

```tsx
function AIResponse({
  message,
  isStreaming,
}: {
  message: AIMessage;
  isStreaming: boolean;
}) {
  const reasoningBlocks = message.contentBlocks
    .filter((b) => b.type === "reasoning")
    .map((b) => b.reasoning)
    .join("");

  const textBlocks = message.contentBlocks
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  const hasReasoning = reasoningBlocks.length > 0;
  const hasText = textBlocks.length > 0;

  const isReasoningPhase = isStreaming && !hasText;
  const isTextPhase = isStreaming && hasText;

  return (
    
      {hasReasoning && (
        
      )}
      {hasText && (
        
          <p>{textBlocks}</p>
          {isTextPhase && <span className="cursor-blink">▊</span>}
        
      )}
    
  );
}
```

## Handling edge cases

### Messages without reasoning

Not every AI message will contain reasoning blocks. When `contentBlocks` has only text blocks, render a standard message bubble without the ThinkingBubble.

### Empty reasoning blocks

Some models produce empty reasoning blocks as placeholders. Filter these out:

```ts
const meaningfulReasoning = message.contentBlocks
  .filter((b) => b.type === "reasoning" && b.reasoning.trim().length > 0);
```

### Multiple reasoning-text cycles

A single message can alternate between reasoning and text blocks. If you need to preserve this interleaving, iterate `contentBlocks` in order rather than grouping by type:

```ts
message.contentBlocks.forEach((block) => {
  if (block.type === "reasoning") {
    // Render ThinkingBubble
  } else if (block.type === "text") {
    // Render text paragraph
  }
});
```

## Best practices

- **Default to collapsed**: show reasoning on demand, not by default
- **Show character count**: gives users a quick sense of how much thinking went into the response
- **Differentiate visually**: use distinct colors, borders, or backgrounds so reasoning is never confused with the actual answer
- **Animate transitions**: smooth expand/collapse animations improve perceived quality
- **Consider accessibility**: use proper ARIA attributes (`aria-expanded`, `aria-controls`) on the toggle button
- **Truncate in previews**: show a short preview of the reasoning when collapsed so users can decide whether to expand
