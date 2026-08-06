When a coordinator agent spawns specialist subagents (a researcher, an
analyst, a writer), you need to render the orchestrator's messages separately
from each subagent's streaming output. The v1 SDK keeps coordinator messages on
the root stream and exposes subagents as discovery snapshots. Pass a snapshot to
selector hooks or composables such as `useMessages(stream, subagent)` to render
the specialist's scoped stream.

This is where the LangChain frontend SDKs go beyond a flat chat transcript:
subagents are first-class stream entities with their own status, messages,
tool-call metadata, and results. Your UI can show delegation, progress, errors,
and final synthesis without asking users to read interleaved tokens from every
worker.


## Why selector-based subagent streams

The root stream stays focused on the coordinator conversation:

- `stream.messages` contains only the coordinator's messages
- `stream.subagents` contains discovery snapshots with identity, namespace, and status
- Each subagent's messages, tool calls, and values are read with selector helpers
- The UI stays clean: the coordinator's reasoning is separate from the
  specialists' work

This separation lets you render the orchestrator's messages in one place and
mount subagent cards only when the user needs to see specialist work.

For large tasks, this also keeps the UI scalable. Users can skim the
coordinator's high-level plan, expand only the specialist work they care about,
and still retain the full subagent trace for debugging, audit, or replay.

## Setting up `useStream`

No extra stream options are required. Point the stream at your deep agent,
render coordinator messages from `stream.messages`, and use `stream.subagents`
to mount cards for active specialists. In chat layouts, index subagents by the
tool-call ID that spawned them so each card appears under the coordinator turn
Point the stream at your deep agent, render coordinator messages from `stream.messages`, and use `stream.subagents` to mount cards for active specialists. In chat layouts, index subagents by the
tool-call ID that spawned them so each card appears under the coordinator turn that delegated the work.


> [!NOTE]
>
> The code examples use `useStream<typeof myAgent>` for type-safe stream state. See Type inference for [Python](lc:oss/python/langchain/frontend/overview#type-inference) or [JavaScript](lc:oss/python/langchain/frontend/overview#type-inference) backends.


```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\nexport function DeepAgentChat() {\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"deep_agent_subagent_cards\",\n  });\n  const subagents = [...stream.subagents.values()];\n  const subagentsByCallId = new Map(subagents.map((s) => [s.id, s]));\n\n  return (\n\n      {stream.messages.map((msg) => {\n        const turnSubagents = AIMessage.isInstance(msg)\n          ? (msg.tool_calls ?? [])\n              .map((tc) => subagentsByCallId.get(tc.id ?? \"\"))\n              .filter((s): s is NonNullable<typeof s> => !!s)\n          : [];\n\n        return (\n\n            {HumanMessage.isInstance(msg) && <HumanBubble>{msg.text}</HumanBubble>}\n            {AIMessage.isInstance(msg) && msg.text.trim() && (\n              <AIBubble>{msg.text}</AIBubble>\n            )}\n            {turnSubagents.map((subagent) => (\n\n            ))}\n\n        );\n      })}\n\n  );\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nconst AGENT_URL = \"http://localhost:2024\";\n\nconst stream = useStream<typeof myAgent>({\n  apiUrl: AGENT_URL,\n  assistantId: \"deep_agent_subagent_cards\",\n});\n\nconst subagentsByCallId = computed(\n  () => new Map([...stream.subagents.value.values()].map((s) => [s.id, s]))\n);\n\nfunction subagentsForMessage(msg: unknown) {\n  if (!AIMessage.isInstance(msg)) return [];\n  return (msg.tool_calls ?? [])\n    .map((tc) => subagentsByCallId.value.get(tc.id ?? \"\"))\n    .filter(Boolean);\n}\n</script>\n\n<template>\n\n\n      <HumanBubble v-if=\"HumanMessage.isInstance(msg)\">\n        {{ msg.text }}\n      </HumanBubble>\n      <AIBubble v-else-if=\"AIMessage.isInstance(msg) && msg.text.trim()\">\n        {{ msg.text }}\n      </AIBubble>\n\n\n\n</template>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n\n  const AGENT_URL = \"http://localhost:2024\";\n\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"deep_agent_subagent_cards\",\n  });\n</script>\n\n  {#each stream.messages as msg (msg.id)}\n\n  {/each}\n  {#each [...stream.subagents.values()] as subagent (subagent.id)}\n\n  {/each}"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\n@Component({\n  selector: \"app-deep-agent-chat\",\n  template: `\n    @for (msg of stream.messages(); track msg.id) {\n      <app-message [message]=\"msg\" />\n    }\n    @for (subagent of subagents(); track subagent.id) {\n      <app-subagent-card [stream]=\"stream\" [subagent]=\"subagent\" />\n    }\n  `,\n})\nexport class DeepAgentChatComponent {\n  stream = injectStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"deep_agent_subagent_cards\",\n  });\n\n  subagents = computed(() => [...this.stream.subagents().values()]);\n}"
 }
]
```

## Submitting messages

Submit messages through the root stream. Deep agent workflows often involve
multiple layers of nested subgraphs, so set an appropriate recursion limit if
your agent can delegate deeply:

```ts
stream.submit(
  { messages: [{ type: "human", content: text }] },
  { config: { recursion_limit: 100 } }
);
```


> [!NOTE]
>
> Deep Agents sets a default recursion limit of 10,000, which is sufficient for
> most multi-expert setups. You can override this via `config.recursion_limit` if
> needed.


## The SubagentDiscoverySnapshot

Each `SubagentDiscoverySnapshot` is a lightweight discovery record for a
subagent running inside the thread. It tells your UI that a subagent exists,
where it sits in the subagent tree, and what lifecycle state it is in.

The snapshot does **not** include the subagent's streamed messages or tool calls.
Instead, pass the snapshot to selector hooks such as
`useMessages(stream, subagent)` or `useToolCalls(stream, subagent)`. These hooks
use the snapshot namespace to subscribe to the subagent's stream primitives only
when the corresponding card or panel is mounted.

## Building the SubagentCard

Each subagent card shows the specialist's name, status, streaming content, and
tool calls. Use selector hooks to subscribe to the subagent namespace:

```tsx

  useMessages,
  useToolCalls,
  type AnyStream,
  type SubagentDiscoverySnapshot,
} from "@langchain/react";

function SubagentCard({
  stream,
  subagent,
}: {
  stream: AnyStream;
  subagent: SubagentDiscoverySnapshot;
}) {
  const [expanded, setExpanded] = useState(true);
  const messages = useMessages(stream, subagent);
  const toolCalls = useToolCalls(stream, subagent);

  const lastAIMessage = messages
    .filter(AIMessage.isInstance)
    .at(-1);

  const displayContent =
    lastAIMessage?.text ?? subagent.output ?? "";

  return (
    
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4"
      >
        
          
          
            ## {subagent.name}
            <p className="text-xs text-gray-500">
              {toolCalls.length} tool call{toolCalls.length === 1 ? "" : "s"}
            </p>
          
        
        
          
        
      </button>

      {expanded && displayContent && (
        
          
            {displayContent}
            {subagent.status === "running" && (
              <span className="inline-block h-4 w-1 animate-pulse bg-blue-500" />
            )}
          
        
      )}
    
  );
}
```

## Progress tracking

Show a progress bar and counter so users know how many subagents have finished:

```tsx
function SubagentProgress({
  subagents,
}: {
  subagents: SubagentDiscoverySnapshot[];
}) {
  const completed = subagents.filter((s) => s.status === "complete").length;
  const total = subagents.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    
      
        <span>Subagent progress</span>
        <span>
          {completed}/{total} complete
        </span>
      
      
        
      
    
  );
}
```

## Rendering messages with subagent cards

The key layout pattern is to render coordinator messages from the root stream
and attach subagent cards to the AI message whose tool call spawned them:

```tsx
function DeepAgentLayout({ stream }: { stream: AnyStream }) {
  const subagents = [...stream.subagents.values()];
  const subagentsByCallId = new Map(subagents.map((s) => [s.id, s]));

  return (
    
      {stream.messages.map((message) => {
        const turnSubagents = AIMessage.isInstance(message)
          ? (message.tool_calls ?? [])
              .map((tc) => subagentsByCallId.get(tc.id ?? ""))
              .filter((s): s is SubagentDiscoverySnapshot => !!s)
          : [];

        return (
          
            
            {turnSubagents.length > 0 && (
              
                
                {turnSubagents.map((subagent) => (
                  
                ))}
              
            )}
          
        );
      })}
    
  );
}
```

You can combine inline cards with a global subagent view: index subagents by
the coordinator tool call that spawned them for transcript cards, and use
`stream.subagents` for a persistent sidebar that summarizes all active workers.
That gives users both local context and a bird's-eye view of the whole run.

## Best practices

- **Mount selectors only where needed**. Scoped messages and tool calls stream
  when a card calls `useMessages(stream, subagent)` or `useToolCalls(stream, subagent)`.
- **Show specialist names**. `subagent.name` tells users which worker is active.
- **Use collapsible cards**. In workflows with 5+ subagents, auto-collapse
  completed cards so users can focus on active work.
- **Override recursion only when needed**. Deep Agents sets a high default
  recursion limit; pass `config.recursion_limit` only for unusually deep custom
  workflows.
- **Handle errors per subagent**. One subagent failing shouldn't crash the
  entire UI. Show the error in that subagent's card while others continue
  running.
