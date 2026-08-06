Agents can invoke external tools like weather APIs, calculators, web search,
database queries, and more. The results are in raw JSON. This pattern shows you
how to render
structured, type-safe UI cards for every tool call your agent makes, complete
with loading states and error handling.


## How tool calling works

When a LangGraph agent decides it needs external data, it emits one or more
**tool calls** as part of an AI message. Each tool call includes:

- **name**: the tool being invoked (e.g. `"get_weather"`, `"calculator"`)
- **args**: the structured arguments passed to the tool
- **id**: a unique identifier linking the call to its result

The agent runtime executes the tool, and the result comes back as a
`ToolMessage`. The `useStream` hook unifies all of this into a single
`toolCalls` array you can render directly.

## Setting up `useStream`

The first step is wiring up `useStream` to your agent backend. The hook returns
reactive state including a `toolCalls` array that updates in real time as the
agent streams.


> [!NOTE]
>
> The code examples use `useStream<typeof myAgent>` for type-safe stream state. See Type inference for [Python](lc:oss/python/langchain/frontend/overview#type-inference) or [JavaScript](lc:oss/python/langchain/frontend/overview#type-inference) backends.


```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\nexport function Chat() {\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"tool_calling\",\n  });\n\n  return (\n\n      {stream.messages.map((msg) => (\n\n      ))}\n\n  );\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nconst AGENT_URL = \"http://localhost:2024\";\n\nconst stream = useStream<typeof myAgent>({\n  apiUrl: AGENT_URL,\n  assistantId: \"tool_calling\",\n});\n</script>\n\n<template>\n\n\n\n</template>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n\n  const AGENT_URL = \"http://localhost:2024\";\n\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"tool_calling\",\n  });\n</script>\n\n  {#each stream.messages as msg (msg.id)}\n\n  {/each}"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\n@Component({\n  selector: \"app-chat\",\n  template: `\n    @for (msg of stream.messages(); track msg.id) {\n      <app-message [message]=\"msg\" [toolCalls]=\"stream.toolCalls()\" />\n    }\n  `,\n})\nexport class ChatComponent {\n  stream = injectStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"tool_calling\",\n  });\n}"
 }
]
```

## The AssembledToolCall type

Each entry in the `toolCalls` array is an `AssembledToolCall` object:

```ts
interface AssembledToolCall<
  TName extends string = string,
  TInput = unknown,
  TOutput = unknown,
> {
  name: TName;
  callId: string;
  id: string;
  namespace: string[];
  input: TInput;
  args: TInput;
  output: TOutput | null;
  status: "running" | "finished" | "error";
  error: string | undefined;
}
```

| Property | Description |
| --- | --- |
| `name` | The name of the tool (e.g. `"get_weather"`) |
| `callId` | Unique ID matching the AI message's `tool_calls` entry |
| `id` | Alias for `callId`, matching message-level tool calls |
| `namespace` | Namespace where the tool call was emitted |
| `input` | Structured arguments the agent passed to the tool |
| `args` | Alias for `input`, matching message-level tool calls |
| `output` | Tool output after a successful call, or `null` while running or after an error |
| `status` | Lifecycle state: `"running"`, `"finished"`, or `"error"` |
| `error` | Error details when the tool call fails |

## Filtering tool calls per message

An AI message may trigger multiple tool calls, and your chat may contain many AI
messages. To render the right tool cards under each message, filter by matching
`callId` against the message's `tool_calls` array:

```tsx
function Message({
  message,
  toolCalls,
}: {
  message: AIMessage;
  toolCalls: AssembledToolCall[];
}) {
  const messageToolCalls = toolCalls.filter((tc) =>
    message.tool_calls?.find((t) => t.id === tc.callId)
  );

  return (
    
      <p>{message.text}</p>
      {messageToolCalls.map((tc) => (
        
      ))}
    
  );
}
```

## Building specialized tool cards

Rather than dumping raw JSON, build dedicated UI components for each tool. Use
`name` to select the right card:

```tsx
function ToolCard({ toolCall }: { toolCall: AssembledToolCall }) {
  if (toolCall.status === "running") {
    return ;
  }

  if (toolCall.status === "error") {
    return ;
  }

  switch (toolCall.name) {
    case "get_weather":
      return ;
    case "calculator":
      return (
        
      );
    case "web_search":
      return ;
    default:
      return ;
  }
}
```

### Weather card example

```tsx
function WeatherCard({
  input,
  output,
}: {
  input: { location: string };
  output: { temperature: number; condition: string };
}) {
  return (
    
      
        
        ## {input.location}
      
      {output.temperature}°F
      <p className="text-muted-foreground">{output.condition}</p>
    
  );
}
```

### Loading and error states

Always handle the pending and error states to give users clear feedback:

```tsx
function LoadingCard({ name }: { name: string }) {
  return (
    
      
      <span>Running {name}...</span>
    
  );
}

function ErrorCard({ name, error }: { name: string; error?: unknown }) {
  return (
    
      ## Error in {name}
      <p className="text-sm text-red-600">
        {String(error ?? "Tool execution failed")}
      </p>
    
  );
}
```

## Type-safe tool arguments

If your tools are defined with structured schemas, you can use the
`ToolCallFromTool` utility type to get fully typed `args`:

```ts

const getWeather = tool(async ({ location }) => { /* ... */ }, {
  name: "get_weather",
  description: "Get the current weather for a location",
  schema: z.object({
    location: z.string().describe("City name"),
  }),
});

type WeatherToolCall = ToolCallFromTool<typeof getWeather>;
// WeatherToolCall.input and WeatherToolCall.args are now { location: string }
```


> [!TIP]
>
> Using `ToolCallFromTool` gives you compile-time safety. If the tool schema
> changes, your UI components will flag type errors immediately.


## Rendering tool calls inline with streaming text

Tool calls often arrive interleaved with streamed text. The `useStream` hook
keeps `toolCalls` in sync with the stream, so pending cards appear as soon as
the agent emits the call, before the tool has finished executing.

This means users see:

1. The AI's text as it streams in
2. A loading card the moment a tool call is emitted
3. The card updates to show the result once the tool completes


> [!NOTE]
>
> Tool calls update in place. The same `callId` transitions from `"running"` to
> `"finished"` (or `"error"`), so your UI re-renders the same component
> with new state.


## Handling multiple concurrent tool calls

Agents can invoke several tools in parallel. The `toolCalls` array will contain
multiple entries with `status: "running"` simultaneously. Each resolves
independently, so your UI should handle partial completion gracefully:

```tsx
function ToolCallList({ toolCalls }: { toolCalls: AssembledToolCall[] }) {
  const pending = toolCalls.filter((tc) => tc.status === "running");
  const completed = toolCalls.filter((tc) => tc.status === "finished");

  return (
    
      {completed.map((tc) => (
        
      ))}
      {pending.map((tc) => (
        
      ))}
    
  );
}
```

## Best practices

Follow these guidelines when building tool call UIs:

- **Always handle all three states**: `running`, `finished`, and `error`.
  Users should never see a blank card.
- **Validate results safely**. Tool outputs are typed as `unknown` until you
  narrow them for a specific card.
- **Provide a generic fallback**. Not every tool needs a bespoke card. Render
  a collapsible JSON view for unknown tool names.
- **Show the tool name and args during loading**. Users want to know *what*
  the agent is doing, even before the result arrives.
- **Keep cards compact**. Tool cards sit inline with chat messages. Avoid
  overwhelming the conversation with oversized widgets.
