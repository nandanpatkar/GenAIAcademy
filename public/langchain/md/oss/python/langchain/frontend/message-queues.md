Message queuing lets users send multiple messages in rapid succession without waiting for the agent to finish processing the current one. Each message is accepted immediately, queued for the active thread, and processed sequentially, giving you full visibility and control over the pending work.


> [!NOTE]
>
> This feature requires the [LangGraph Agent Server](lc:oss/python/langgraph/local-server). Run your agent locally with `langgraph dev` or [deploy it to LangSmith](lc:langsmith/deployment) to use this pattern.


## Why message queues?

In a typical chat interface, users must wait for the agent to finish responding before sending another message. This creates friction in several scenarios:

- **Batch questions**: a user wants to ask five related questions at once rather than waiting for each answer
- **Follow-up chains**: submitting clarifications or additional context while the agent is still working
- **Automated testing sequences**: programmatically sending a series of prompts to validate agent behavior
- **Data entry workflows**: feeding structured inputs one after another for processing

Message queuing solves this by accepting all submissions immediately and processing them in order.

This is an agent UX primitive rather than a cosmetic chat feature. The SDK keeps
track of the queue as part of the stream controller, so your UI can show pending
work, cancel stale requests, and keep the composer active while the current run
continues.

## How it works

Pass `multitaskStrategy: "enqueue"` when you want a submission to wait behind
the currently running request. While the agent is processing, queued submissions
are added to the active thread's queue. Once the current run completes, the
next queued message is dispatched automatically.

Read queue state with the companion queue helper for your framework:

| Property | Type | Description |
|---|---|---|
| `queue.entries` | `SubmissionQueueEntry[]` | Array of all pending queue entries |
| `queue.size` | `number` | Number of entries currently in the queue |
| `queue.cancel(id)` | `(id: string) => Promise<void>` | Cancel a specific queued entry by ID |
| `queue.clear()` | `() => Promise<void>` | Cancel all queued entries |

Each `SubmissionQueueEntry` object contains:

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier for this queue entry |
| `values` | `object` | The input values (including messages) that were submitted |
| `options` | `object` | Any additional options passed with the submission |
| `createdAt` | `string` | ISO timestamp of when the entry was created |

## Setting up `useStream`

Connect `useStream` to your agent, then pair it with the submission queue
helper for your framework. Call `stream.submit()` to send messages while a run
is in progress; pass `multitaskStrategy: "enqueue"` on submissions that should
wait behind the active request. Read `queue.entries` and `queue.size` to render
pending work, and use `queue.cancel()` or `queue.clear()` to remove items before
they start processing.


> [!NOTE]
>
> The code examples use `useStream<typeof myAgent>` for type-safe stream state. See Type inference for [Python](lc:oss/python/langchain/frontend/overview#type-inference) or [JavaScript](lc:oss/python/langchain/frontend/overview#type-inference) backends.


```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "function Chat() {\n  const stream = useStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"simple_agent\",\n  });\n  const queue = useSubmissionQueue(stream);\n\n  const handleSubmit = (text: string) => {\n    stream.submit({\n      messages: [{ type: \"human\", content: text }],\n    });\n  };\n\n  const pendingCount = queue.size;\n  const entries = queue.entries;\n\n  return (\n\n\n      {pendingCount > 0 && }\n\n\n  );\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nconst stream = useStream<typeof myAgent>({\n  apiUrl: \"http://localhost:2024\",\n  assistantId: \"simple_agent\",\n});\nconst queue = useSubmissionQueue(stream);\n\nfunction handleSubmit(text: string) {\n  stream.submit({\n    messages: [{ type: \"human\", content: text }],\n  });\n}\n\nconst pendingCount = computed(() => queue.size.value);\nconst entries = computed(() => queue.entries.value);\n</script>\n\n<template>\n\n\n    <QueueList v-if=\"pendingCount > 0\" :entries=\"entries\" :queue=\"queue\" />\n\n\n</template>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n\n  const stream = useStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"simple_agent\",\n  });\n  const queue = useSubmissionQueue(stream);\n\n  function handleSubmit(text: string) {\n    stream.submit({\n      messages: [{ type: \"human\", content: text }],\n    });\n  }\n</script>\n\n\n  {#if queue.size > 0}\n\n  {/if}\n  <ChatInput on:submit={(e) => handleSubmit(e.detail)} />"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "@Component({\n  selector: \"app-chat\",\n  template: `\n    <message-list [messages]=\"stream.messages()\" />\n    @if (queue.size() > 0) {\n      <queue-list [entries]=\"queue.entries()\" [queue]=\"queue\" />\n    }\n    <chat-input (onSubmit)=\"handleSubmit($event)\" />\n  `,\n})\nexport class ChatComponent {\n  stream = injectStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"simple_agent\",\n  });\n  queue = injectSubmissionQueue(this.stream);\n\n  handleSubmit(text: string) {\n    this.stream.submit({\n      messages: [{ type: \"human\", content: text }],\n    });\n  }\n}"
 }
]
```

## Displaying the queue

Build a `QueueList` component that shows each pending message with a cancel button. This gives users visibility into what's waiting and the ability to remove items they no longer need.

```tsx
function QueueList({ entries, queue }) {
  return (
    
      
        <span>Queued messages ({entries.length})</span>
        <button onClick={() => queue.clear()}>Clear all</button>
      
      <ul className="queue-entries">
        {entries.map((entry) => {
          const text = entry.values?.messages?.at(-1)?.content ?? "Pending...";
          return (
            <li key={entry.id} className="queue-entry">
              <span className="queue-text">{text}</span>
              <span className="queue-time">
                {new Date(entry.createdAt).toLocaleTimeString()}
              </span>
              <button
                className="queue-cancel"
                onClick={() => queue.cancel(entry.id)}
              >
                Cancel
              </button>
            </li>
          );
        })}
      </ul>
    
  );
}
```


> [!TIP]
>
> Display the first few characters of each queued message as a preview so users can quickly identify which items to cancel without reading full messages.


## Cancelling queued messages

You have two levels of cancellation:

### Cancel a single entry

Remove a specific message from the queue by its ID. The agent will skip it and move to the next entry.

```ts
await queue.cancel(entryId);
```

### Clear the entire queue

Remove all pending messages at once. Useful when the user changes context or wants to start over.

```ts
await queue.clear();
```


> [!NOTE]
>
> Cancelling a queue entry only affects messages that have **not yet started
> processing**. If the agent is already working on a message, cancelling it from
> the queue has no effect. Use `stream.stop()` to interrupt the current run.


## Chaining follow-up submissions with `onCreated`

The `onCreated` callback fires when a new run is created, giving you a hook to submit follow-up messages programmatically. This is useful for building multi-step workflows where the next question depends on the previous submission being accepted.

```ts
stream.submit(
  { messages: [{ type: "human", content: "What is quantum computing?" }] },
  {
    onCreated(run) {
      console.log("Run created:", run.runId);
      // Chain a follow-up
      stream.submit({
        messages: [{ type: "human", content: "Give me a simple analogy." }],
      });
    },
  }
);
```

This pattern naturally fills the queue. The first message starts processing
immediately, and the follow-up is queued behind it.

## Starting a new thread

When a user wants to begin a fresh conversation, update the reactive `threadId`
that you pass into the stream. Passing `null` clears the current thread binding;
the next submission creates a new thread.

```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "function NewThreadButton() {\n  const [threadId, setThreadId] = useState<string | null>(null);\n  const stream = useStream<typeof myAgent>({ threadId, onThreadId: setThreadId });\n\n  return (\n    <button onClick={() => setThreadId(null)}>\n      New conversation\n    </button>\n  );\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\nconst threadId = ref<string | null>(null);\nconst stream = useStream<typeof myAgent>({\n  threadId,\n  onThreadId: (id) => (threadId.value = id),\n});\n</script>\n\n<template>\n  <button @click=\"threadId = null\">New conversation</button>\n</template>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n  let threadId = $state<string | null>(null);\n  const stream = useStream<typeof myAgent>({\n    threadId: () => threadId,\n    onThreadId: (id) => (threadId = id),\n  });\n</script>\n\n<button onclick={() => (threadId = null)}>New conversation</button>"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "threadId = signal<string | null>(null);\nstream = injectStream<typeof myAgent>({\n  threadId: this.threadId,\n  onThreadId: (id) => this.threadId.set(id),\n});\n\n// In template:\n// <button (click)=\"threadId.set(null)\">New conversation</button>"
 }
]
```

## Best practices

- **Limit queue size**: While there is no hard client-side limit on queue size,
be mindful that very large queues can degrade user experience. Consider
showing a warning when the queue exceeds a reasonable threshold (e.g., 10
items).
- **Show queue position**: Number each queued item so users know the processing order.
- **Preserve input focus**: Keep the input field focused after submission so users can type the next message immediately.
- **Animate transitions**: Smoothly move items from the queue panel into the message list as they start processing.
- **Handle errors gracefully**: If a queued message fails, surface the error without blocking subsequent queue entries.
- **Debounce rapid submissions**: For automated or programmatic submissions, add a small delay between messages to avoid overwhelming the server.
