Every state change in a LangGraph agent creates a **checkpoint**, a complete
snapshot of the agent's state at that moment. Time travel lets you inspect any
checkpoint, view the exact state the agent held, and **resume execution from
that point** to explore alternative paths. It's a debugger, an undo button, and
an audit log all in one.


> [!NOTE]
>
> This feature requires the [LangGraph Agent Server](lc:oss/python/langgraph/local-server). Run your agent locally with `langgraph dev` or [deploy it to LangSmith](lc:langsmith/deployment) to use this pattern.


## How checkpoints work

LangGraph persists agent state after every node execution. Each persisted state
is a `ThreadState`[ThreadStateJS] object that captures:

- **checkpoint**: metadata identifying this specific snapshot (ID, timestamp)
- **values**: the full agent state at this point (messages, custom keys)
- **tasks**: the graph nodes that were scheduled to run next
- **next**: the names of upcoming nodes in the execution plan

This creates a linear timeline of every decision the agent made, every tool it
called, and every response it produced. Your UI can render this timeline and let
users jump to any point.

## Setting up `useStream`

Create the stream for your agent, then fetch checkpoint history explicitly from
the LangGraph client for the active thread. Resuming from a checkpoint uses
`forkFrom: { checkpointId }`.


> [!NOTE]
>
> The code examples use `useStream<typeof myAgent>` for type-safe stream state. See Type inference for [Python](lc:oss/python/langchain/frontend/overview#type-inference) or [JavaScript](lc:oss/python/langchain/frontend/overview#type-inference) backends.


```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\nexport function TimeTravelChat() {\n  const [threadId, setThreadId] = useState<string | null>(null);\n  const [history, setHistory] = useState<ThreadState[]>([]);\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"time_travel\",\n    threadId,\n    onThreadId: setThreadId,\n  });\n\n  useEffect(() => {\n    if (!threadId || stream.isLoading) return;\n    stream.client.threads.getHistory(threadId).then(setHistory);\n  }, [stream.client, threadId, stream.isLoading]);\n\n  function resumeFrom(cp: ThreadState) {\n    stream.submit({}, {\n      forkFrom: { checkpointId: cp.checkpoint.checkpoint_id },\n    });\n  }\n\n  return (\n\n\n\n\n  );\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nconst AGENT_URL = \"http://localhost:2024\";\nconst threadId = ref<string | null>(null);\nconst history = ref<ThreadState[]>([]);\n\nconst stream = useStream<typeof myAgent>({\n  apiUrl: AGENT_URL,\n  assistantId: \"time_travel\",\n  threadId,\n  onThreadId: (id) => (threadId.value = id),\n});\n\nwatch(\n  [threadId, stream.isLoading],\n  async ([id, isLoading]) => {\n    if (isLoading) return;\n    history.value = id\n      ? ((await stream.client.threads.getHistory(id)) as ThreadState[])\n      : [];\n  },\n  { immediate: true },\n);\n\nfunction resumeFrom(cp: ThreadState) {\n  stream.submit({}, {\n    forkFrom: { checkpointId: cp.checkpoint.checkpoint_id },\n  });\n}\n</script>\n\n<template>\n\n\n\n\n</template>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n\n  const AGENT_URL = \"http://localhost:2024\";\n  let threadId = $state<string | null>(null);\n  let history = $state<ThreadState[]>([]);\n\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"time_travel\",\n    threadId: () => threadId,\n    onThreadId: (id) => (threadId = id),\n  });\n\n  $effect(() => {\n    if (!threadId) {\n      history = [];\n      return;\n    }\n    if (stream.isLoading) return;\n    stream.client.threads.getHistory(threadId).then((states) => {\n      history = states as ThreadState[];\n    });\n  });\n\n  function resumeFrom(cp: ThreadState) {\n    stream.submit({}, {\n      forkFrom: { checkpointId: cp.checkpoint.checkpoint_id },\n    });\n  }\n</script>"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\n@Component({\n  selector: \"app-time-travel-chat\",\n  template: `\n\n      <app-chat-panel [messages]=\"stream.messages()\" />\n      <app-timeline-sidebar\n        [history]=\"history()\"\n        (select)=\"resumeFrom($event)\"\n      />\n\n  `,\n})\nexport class TimeTravelChatComponent {\n  threadId = signal<string | null>(null);\n  history = signal<ThreadState[]>([]);\n\n  stream = injectStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"time_travel\",\n    threadId: this.threadId,\n    onThreadId: (id) => this.threadId.set(id),\n  });\n\n  constructor() {\n    effect(() => {\n      if (this.stream.isLoading()) return;\n      void this.refreshHistory(this.threadId());\n    });\n  }\n\n  async refreshHistory(id: string | null) {\n    this.history.set(id\n      ? ((await this.stream.client.threads.getHistory(id)) as ThreadState[])\n      : []);\n  }\n\n  resumeFrom(cp: ThreadState) {\n    this.stream.submit({}, {\n      forkFrom: { checkpointId: cp.checkpoint.checkpoint_id },\n    });\n  }\n}"
 }
]
```

## Building a checkpoint timeline

The timeline sidebar shows every checkpoint as a clickable entry. Each entry
displays the node that ran and how many messages existed at that point:

```tsx
function TimelineSidebar({
  history,
  onSelect,
}: {
  history: ThreadState[];
  onSelect: (cp: ThreadState) => void;
}) {
  return (
    <aside className="w-80 overflow-y-auto border-l bg-gray-50 p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500">
        Checkpoint Timeline
      </h2>
      
        {history.map((cp, i) => {
          const taskName = cp.tasks?.[0]?.name ?? "unknown";
          const msgCount = (cp.values?.messages as unknown[])?.length ?? 0;

          return (
            <button
              key={cp.checkpoint.checkpoint_id}
              onClick={() => onSelect(cp)}
              className="w-full rounded-lg border bg-white p-3 text-left
                         hover:border-blue-400 hover:shadow-sm transition-all"
            >
              
                <span className="text-xs text-gray-400">#{i + 1}</span>
                
              
              <p className="mt-1 text-sm font-medium">{taskName}</p>
              <p className="text-xs text-gray-500">
                {msgCount} message{msgCount !== 1 ? "s" : ""}
              </p>
            </button>
          );
        })}
      
    </aside>
  );
}
```

## Inspecting checkpoint state

Clicking a checkpoint should show the full state at that point. A JSON viewer
gives developers complete visibility into what the agent knew and decided:

```tsx
function CheckpointInspector({ checkpoint }: { checkpoint: ThreadState }) {
  const [expanded, setExpanded] = useState(false);

  return (
    
      
        <h3 className="font-semibold">
          Checkpoint {checkpoint.checkpoint.checkpoint_id.slice(0, 8)}...
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:underline"
        >
          {expanded ? "Collapse" : "Expand"} state
        </button>
      

      
        <p>
          <strong>Node:</strong>{" "}
          {checkpoint.tasks?.[0]?.name ?? "—"}
        </p>
        <p>
          <strong>Next:</strong>{" "}
          {checkpoint.next?.join(", ") || "—"}
        </p>
        <p>
          <strong>Messages:</strong>{" "}
          {(checkpoint.values?.messages as unknown[])?.length ?? 0}
        </p>
      

      {expanded && (
        
          <pre className="text-xs text-gray-200">
            {JSON.stringify(checkpoint.values, null, 2)}
          </pre>
        
      )}
    
  );
}
```


> [!TIP]
>
> For production UIs, consider using a proper JSON viewer component with
> collapsible nodes instead of raw `JSON.stringify`. Libraries like
> `react-json-view` or `react-json-tree` give users a much better exploration
> experience.


## Resuming from a checkpoint

The core of time travel is the ability to **resume execution from any prior
checkpoint**. When a user selects a checkpoint, call `submit` with `null` input
and pass the checkpoint ID:

```ts
stream.submit({}, {
  forkFrom: { checkpointId: selectedCheckpoint.checkpoint.checkpoint_id },
});
```

This tells LangGraph to:

1. Roll back to the selected checkpoint's state
2. Re-execute the graph from that point forward
3. Stream the new results to the client

The existing messages after the selected checkpoint are replaced by the new
execution path. This effectively creates a **branch** in the conversation
timeline.


> [!NOTE]
>
> Resuming from a checkpoint does not delete the original timeline. The previous
> checkpoints remain available in the history. This means users can always go back
> and try a different path without losing any prior work.


## The SplitView layout

Time travel works best with a split layout, with the main chat on the left and the
timeline on the right:

```tsx
function TimeTravelLayout() {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [history, setHistory] = useState<ThreadState[]>([]);
  const stream = useStream<typeof myAgent>({
    apiUrl: AGENT_URL,
    assistantId: "time_travel",
    threadId,
    onThreadId: setThreadId,
  });

  const [selectedCheckpoint, setSelectedCheckpoint] =
    useState<ThreadState | null>(null);

  useEffect(() => {
    if (!threadId || stream.isLoading) return;
    stream.client.threads.getHistory(threadId).then(setHistory);
  }, [stream.client, threadId, stream.isLoading]);

  return (
    
      {/* Main chat area */}
      <main className="flex-1 overflow-y-auto p-6">
        
          {stream.messages.map((msg) => (
            
          ))}
        
        <ChatInput
          onSubmit={(text) =>
            stream.submit({ messages: [{ type: "human", content: text }] })
          }
          isLoading={stream.isLoading}
        />
      </main>

      {/* Timeline sidebar */}
      <aside className="w-96 overflow-y-auto border-l bg-gray-50">
        <TimelineSidebar
          history={history}
          selected={selectedCheckpoint}
          onSelect={setSelectedCheckpoint}
          onResume={(cp) =>
            stream.submit({}, {
              forkFrom: { checkpointId: cp.checkpoint.checkpoint_id },
            })
          }
        />
        {selectedCheckpoint && (
          
        )}
      </aside>
    
  );
}
```

## Extracting checkpoint metadata

Transform raw checkpoint data into display-friendly entries for your timeline:

```ts
function formatCheckpoints(history: ThreadState[]) {
  return history.map((cp, index) => ({
    index,
    id: cp.checkpoint?.checkpoint_id,
    taskName: cp.tasks?.[0]?.name ?? "unknown",
    messageCount: (cp.values?.messages as unknown[])?.length ?? 0,
    hasInterrupts: cp.tasks?.some((t) => t.interrupts?.length) ?? false,
    nextNodes: cp.next ?? [],
  }));
}
```

This makes it easy to render timeline entries with meaningful labels instead of
raw IDs.

## Use cases

Time travel is invaluable across many scenarios:

- **Debugging agent behavior**: step through the agent's decisions to
  understand why it chose a particular path
- **Undoing actions**: if the agent took a wrong turn, resume from an earlier
  checkpoint and try again
- **Exploring alternatives**: fork from a mid-conversation checkpoint to see
  how different inputs change the outcome
- **Auditing**: review the complete history of an agent's actions for
  compliance, quality assurance, or post-incident analysis
- **Teaching**: walk through an agent's execution step by step to explain how
  multi-step reasoning works


> [!NOTE]
>
> Time travel is especially powerful when combined with
> [human-in-the-loop](lc:oss/python/langchain/frontend/human-in-the-loop) patterns. If a human reviewer
> rejects an agent's action at an interrupt, they can resume from the checkpoint
> before the action was taken and provide corrective input.


## Handling interrupts in the timeline

Checkpoints that contain interrupts (human-in-the-loop pauses) deserve special
visual treatment. They represent moments where the agent stopped and waited for
human input:

```tsx
function TimelineEntry({
  checkpoint,
  index,
}: {
  checkpoint: ThreadState;
  index: number;
}) {
  const hasInterrupt = checkpoint.tasks?.some(
    (t) => t.interrupts && t.interrupts.length > 0
  );

  return (
    
      
        <span className="text-xs text-gray-400">#{index + 1}</span>
        {hasInterrupt && (
          <span className="rounded bg-amber-200 px-1.5 py-0.5 text-xs font-medium text-amber-800">
            Interrupt
          </span>
        )}
      
      <p className="mt-1 text-sm font-medium">
        {checkpoint.tasks?.[0]?.name ?? "—"}
      </p>
    
  );
}
```

## Best practices

- **Load history lazily**: for threads with hundreds of checkpoints, paginate
  or load only the most recent N entries to keep the UI responsive.
- **Show meaningful labels**: display node names and message counts instead of
  raw checkpoint IDs. Users need context, not UUIDs.
- **Confirm before resuming**: resuming from an old checkpoint replaces the
  current execution path. Show a confirmation dialog so users don't
  accidentally lose the current conversation state.
- **Highlight the current checkpoint**: make it visually obvious which
  checkpoint corresponds to the current state of the conversation.
- **Support keyboard navigation**: power users will want to step through
  checkpoints with arrow keys. Add keyboard handlers to the timeline for a
  smooth debugging experience.
- **Diff state between checkpoints**: for advanced users, showing what changed
  between two consecutive checkpoints can reveal exactly how the agent's state
  evolved at each step.
