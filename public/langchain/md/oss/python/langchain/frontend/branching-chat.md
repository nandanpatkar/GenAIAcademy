Conversations with AI agents are rarely linear. You may want to rephrase a
question, regenerate a response you didn't like, or explore a different
conversational path without losing the checkpoint history. Branching chat uses
LangGraph checkpoints as fork points: every edit or regeneration submits a new
run from the selected message's parent checkpoint.


> [!NOTE]
>
> This feature requires the [LangGraph Agent Server](lc:oss/python/langgraph/local-server). Run your agent locally with `langgraph dev` or [deploy it to LangSmith](lc:langsmith/deployment) to use this pattern.


## What is branching chat?

Branching chat treats a conversation as a checkpointed timeline rather than a
flat list. Each message has metadata that points to the checkpoint before that
message was created. Editing a message or regenerating a response submits a new
run from that checkpoint.

Key capabilities:

- **Edit any user message:** rewrite a previous prompt and re-run the agent from that point
- **Regenerate any AI response:** ask the agent to produce a different answer for the same input
- **Inspect history:** use the LangGraph client to load checkpoints when you need a branch timeline

## Set up stream metadata

Use the root stream for messages, then read per-message checkpoint metadata in
the component that renders each message. The metadata includes the parent
checkpoint ID to fork from.


> [!NOTE]
>
> The code examples use `useStream<typeof myAgent>` for type-safe stream state. See Type inference for [Python](lc:oss/python/langchain/frontend/overview#type-inference) or [JavaScript](lc:oss/python/langchain/frontend/overview#type-inference) backends.


```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\nexport function Chat() {\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"simple_agent\",\n  });\n\n  return (\n\n      {stream.messages.map((msg) => (\n\n      ))}\n\n  );\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nconst AGENT_URL = \"http://localhost:2024\";\n\nconst stream = useStream<typeof myAgent>({\n  apiUrl: AGENT_URL,\n  assistantId: \"simple_agent\",\n});\n</script>\n\n<template>\n\n\n\n</template>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n\n  const AGENT_URL = \"http://localhost:2024\";\n\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"simple_agent\",\n  });\n</script>\n\n  {#each stream.messages as msg (msg.id)}\n\n  {/each}"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\n@Component({\n  selector: \"app-chat\",\n  template: `\n    @for (msg of stream.messages(); track msg.id) {\n      <app-message\n        [message]=\"msg\"\n        [stream]=\"stream\"\n      />\n    }\n  `,\n})\nexport class ChatComponent {\n  stream = injectStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"simple_agent\",\n  });\n}"
 }
]
```

## Understand message metadata

The `useMessageMetadata(stream, messageId)` helper returns `MessageMetadata`
for one message. Use it in the component that renders each message so the
metadata stays scoped to that message ID:

```tsx

function Chat() {
  const stream = useStream<typeof myAgent>({
    apiUrl: AGENT_URL,
    assistantId: "simple_agent",
  });

  return stream.messages.map((message) => (
    
  ));
}

function MessageWithForkControls({
  stream,
  message,
}: {
  stream: ReturnType<typeof useStream>;
  message: BaseMessage;
}) {
  const metadata = useMessageMetadata(stream, message.id);
  const checkpointId = metadata?.parentCheckpointId;
  const [editedText, setEditedText] = useState(message.text);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!checkpointId) return;

        stream.submit(
          { messages: [{ type: "human", content: editedText }] },
          { forkFrom: { checkpointId } }
        );
      }}
    >
      <textarea
        value={editedText}
        onChange={(event) => setEditedText(event.target.value)}
      />
      <button disabled={!checkpointId || editedText === message.text}>
        Submit edited branch
      </button>
    </form>
  );
}
```

`parentCheckpointId` is the checkpoint just before the message. Use it as the
fork point for edits and regenerations.

## Edit a message

To edit a user message and fork the conversation:

1. Get `parentCheckpointId` from the message's metadata
2. Submit the edited message with `forkFrom: { checkpointId }`
3. The agent re-runs from that point

```ts
function handleEdit(
  stream: ReturnType<typeof useStream>,
  originalMsg: HumanMessage,
  metadata: MessageMetadata | undefined,
  newText: string
) {
  if (!metadata?.parentCheckpointId) return;

  stream.submit(
    {
      messages: [{ type: "human", content: newText }],
    },
    { forkFrom: { checkpointId: metadata.parentCheckpointId } }
  );
}
```

After the edit:

- The agent re-runs from the fork point with the updated message
- The original path remains available in the thread history

## Regenerate a response

To regenerate an AI response without changing the input:

1. Get the `parent_checkpoint` from the AI message's metadata
2. Submit with empty input and `forkFrom: { checkpointId }`
3. The agent produces a fresh response from that point

```ts
function handleRegenerate(
  stream: ReturnType<typeof useStream>,
  metadata: MessageMetadata | undefined
) {
  if (!metadata?.parentCheckpointId) return;

  stream.submit(undefined, {
    forkFrom: { checkpointId: metadata.parentCheckpointId },
  });
}
```

Each regeneration creates a new path for the AI message at that position.


> [!TIP]
>
> Regeneration is useful for non-deterministic agents. Since LLM outputs vary
> with temperature, regenerating the same prompt often produces meaningfully
> different responses.


## How branching works under the hood

LangGraph persists every state transition as a **checkpoint**. When you submit
with `forkFrom`, the backend starts a new execution path from that point instead
of appending to the current conversation. The result is a tree structure:

```
User: "What is React?"
  └─ AI: "React is a JavaScript library..." (branch A)
  └─ AI: "React is a UI framework..." (branch B, regenerated)

User: "Tell me about hooks" (branch A)
  └─ AI: "Hooks are functions..."

User: "Tell me about JSX" (edited from branch A)
  └─ AI: "JSX is a syntax extension..."
```

Each path is persisted in the checkpoint store. Use
`stream.client.threads.getHistory(threadId)` when you want to build a separate
timeline view across checkpoints.

## Best practices

- **Read metadata near the message**: call `useMessageMetadata` in the component
  that renders the message controls.
- **Show fork controls on hover**: edit and regenerate buttons should appear on
  hover to keep the UI clean.
- **Refresh history on demand**: call `client.threads.getHistory()` only when
  rendering a timeline or after a fork settles.
- **Disable controls while streaming**: don't allow edits or regeneration
  while the agent is actively streaming a response. Check `stream.isLoading`
  before enabling these actions.
- **Preserve edit text on cancel**: if the user starts editing, then cancels,
  reset the textarea to the original message content.
- **Test with deep checkpoint trees**: users who edit and regenerate frequently
  can create many paths. Ensure timeline rendering remains performant.
