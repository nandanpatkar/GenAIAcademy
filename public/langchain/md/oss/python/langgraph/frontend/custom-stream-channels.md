LangGraph agents stream more than messages and tool calls. A server-side
**stream transformer** can inspect or rewrite the protocol as it flows to the
client and publish its own structured data on a named **custom channel**. The
frontend reads that channel with two selectors: `useExtension` for the latest
payload, and `useChannel` as a raw-events escape hatch.

The example below is a customer-support agent whose transformer redacts PII
(emails, phone numbers, SSNs, card numbers, IPs) from every event before it
reaches the browser, and publishes running redaction counts on a
`redaction-stats` channel. The side panel renders those counts live.


## How custom channels work

A custom channel has two ends. On the server, a `StreamTransformer` opens a
named `StreamChannel` and pushes payloads onto it. On the client, a selector
subscribes to the matching `custom:<name>` channel and exposes the payloads as
reactive state.

The transformer's `process` method runs for every protocol event. It can mutate
the event in place (here, scrubbing PII from `messages`, `tools`, and `values`
data) and push side-channel updates whenever it has something to report.

The client-side selectors (`useExtension`, `useChannel`) ship with the v1
frontend SDK packages (`@langchain/react`, `@langchain/vue`,
`@langchain/svelte`, `@langchain/angular`).


> [!NOTE]
>
> Stream transformers and `StreamChannel` require `langgraph>=1.2`.


```python

from langgraph.stream import ProtocolEvent, StreamChannel, StreamTransformer

class RedactionStatsTransformer(StreamTransformer):
    def __init__(self, scope: tuple[str, ...] = ()) -> None:
        super().__init__(scope)
        # Open a channel named "redaction-stats".
        self.redaction_stats = StreamChannel("redaction-stats")
        self.counts = empty_counts()

    def init(self) -> dict[str, StreamChannel]:
        return {"redactionStats": self.redaction_stats}

    def process(self, event: ProtocolEvent) -> bool:
        # Redact event["params"]["data"] in place and tally what was found.
        delta = redact_in_place(event, self.counts)
        if delta:
            # Publish a payload on the channel.
            self.redaction_stats.push(
                {
                    "kind": "update",
                    "at": int(time.time() * 1000),
                    "delta": delta,
                    "counts": dict(self.counts),
                    "total": sum(self.counts.values()),
                }
            )
        return True  # Keep the (now-redacted) event in the stream.

def create_redaction_stats_transformer() -> RedactionStatsTransformer:
    return RedactionStatsTransformer()
```

Attach the transformer when you build the agent:

```python
from langchain.agents import create_agent

agent = create_agent(
    model="anthropic:claude-haiku-4-5",
    tools=[...],
    transformers=[create_redaction_stats_transformer],
)
```


The payload type is whatever the transformer pushes. The client examples below
read this shape:

```ts
type PiiType = "email" | "phone" | "ssn" | "credit_card" | "ip_address";

type RedactionStatsEvent = {
  kind: "update";
  at: number;
  delta: Partial<Record<PiiType, number>>;
  counts: Record<PiiType, number>;
  total: number;
};
```

## Setting up `useStream`

Wire up `useStream` as usual. The custom-channel selectors take the same
`stream` handle returned here.


> [!NOTE]
>
> The code examples use `useStream<typeof myAgent>` for type-safe stream state. See Type inference for [Python](lc:oss/python/langchain/frontend/overview#type-inference) or [JavaScript](lc:oss/python/langchain/frontend/overview#type-inference) backends.


```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\nexport function RedactionChat() {\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"custom_stream_channel\",\n  });\n\n  return ;\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nconst AGENT_URL = \"http://localhost:2024\";\n\nconst stream = useStream<typeof myAgent>({\n  apiUrl: AGENT_URL,\n  assistantId: \"custom_stream_channel\",\n});\n</script>\n\n<template>\n\n</template>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n\n  const AGENT_URL = \"http://localhost:2024\";\n\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"custom_stream_channel\",\n  });\n</script>"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\n@Component({\n  selector: \"app-redaction-chat\",\n  template: `<app-redaction-stats-panel [stream]=\"stream\" />`,\n})\nexport class RedactionChatComponent {\n  stream = injectStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"custom_stream_channel\",\n  });\n}"
 }
]
```

## Read the latest payload with `useExtension`

`useExtension` subscribes to a `custom:<name>` channel and returns the most
recent payload the transformer pushed, already unwrapped and typed. It is the
ergonomic choice when the UI only needs the current value, such as a live
counter, progress percentage, or status badge.

Pass the bare channel name (`"redaction-stats"`), not the `custom:` prefix:

```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "const latest = useExtension<RedactionStatsEvent>(stream, \"redaction-stats\");\n// latest?.total, latest?.counts.email, latest?.delta"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "const latest = useExtension<RedactionStatsEvent>(stream, \"redaction-stats\");\n// latest.value?.total"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "const latest = useExtension<RedactionStatsEvent>(stream, \"redaction-stats\");\n// latest?.total"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "const latest = injectExtension<RedactionStatsEvent>(stream, \"redaction-stats\");\n// latest()?.total"
 }
]
```

The return value follows each framework's reactivity model: a plain value in
React and Svelte, a `Ref` in Vue (`latest.value`), and a signal in Angular
(`latest()`). The value is `undefined` until the first payload arrives.

An optional third `target` argument scopes the subscription to a namespace, the
same way `useMessages(stream, node)` scopes messages to a discovered graph node.
See [Graph execution](lc:oss/python/langgraph/frontend/graph-execution) for namespace
targeting.

## Buffer raw events with `useChannel`

`useChannel` is the raw-events escape hatch. It subscribes to one or more
channels and returns a bounded buffer of the underlying protocol events rather
than a single unwrapped value. Reach for it when you need history instead of the
latest value, such as an event log or audit trail, or when you need a channel
that no higher-level selector covers.

Pass the full channel id (`"custom:redaction-stats"`):

```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "const rawEvents = useChannel(stream, [\"custom:redaction-stats\"]);"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "const rawEvents = useChannel(stream, [\"custom:redaction-stats\"]);\n// rawEvents.value"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "const rawEvents = useChannel(stream, [\"custom:redaction-stats\"]);"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "const rawEvents = injectChannel(stream, [\"custom:redaction-stats\"]);\n// rawEvents()"
 }
]
```

Each entry is a raw protocol event, so the payload sits under
`event.params.data`. Unwrap it yourself:

```ts
function parseRedactionStatsEvents(rawEvents: Event[]): RedactionStatsEvent[] {
  const out: RedactionStatsEvent[] = [];
  for (const event of rawEvents) {
    const data = event.params?.data;
    const payload = data?.payload ?? data;
    if (payload?.kind === "update") out.push(payload);
  }
  return out;
}
```

Control the buffer with the options argument:

```ts
const rawEvents = useChannel(
  stream,
  ["custom:redaction-stats"],
  undefined, // target namespace
  { bufferSize: 200, replay: true },
);
```

| Option | Default | Effect |
| --- | --- | --- |
| `bufferSize` | `"default"` | Maximum number of buffered events. Older events drop once the cap is reached. |
| `replay` | `true` | Replay events already seen on the channel when the selector mounts, instead of only live events. |


> [!NOTE]
>
> Prefer the higher-level selectors (`useExtension`, `useMessages`,
> `useToolCalls`, `useValues`) for common cases. They return typed, unwrapped
> values and track only what you render. Use `useChannel` when you specifically
> need the raw event stream.


## Choosing between `useExtension` and `useChannel`

Both read the same custom channel but differ in what they return:

| | `useExtension` | `useChannel` |
| --- | --- | --- |
| **Returns** | Latest payload (`T \| undefined`) | Bounded buffer of raw events (`Event[]`) |
| **Shape** | Unwrapped, typed payload | Raw protocol events; unwrap `event.params.data` yourself |
| **Subscribe by** | Channel name (`"redaction-stats"`) | Full channel id (`["custom:redaction-stats"]`) |
| **Use when** | You need the current value | You need history, a log, or multiple channels |
| **Options** | — | `bufferSize`, `replay` |

A common pattern is to use both on the same channel: `useExtension` drives a
live summary (current totals), while `useChannel` backs a scrolling event log of
every update across the thread.

## Use cases

Custom channels fit any server-side signal that does not map cleanly to
messages, tool calls, or graph state:

- **Compliance and redaction stats**: counts of scrubbed PII, blocked content,
  or policy hits, as in the example above.
- **Progress reporting**: percentage complete or step labels emitted by a
  long-running tool.
- **Live metrics**: token usage, latency, or cost accumulating during a run.
- **Sources and citations**: retrieved documents pushed to a side panel as the
  agent grounds its answer.
- **Domain events**: any structured update your backend wants to surface
  without changing the message transcript.

## Related

- [Overview](lc:oss/python/langgraph/frontend/overview) — the LangGraph frontend stream
  API and architecture.
- [Graph execution](lc:oss/python/langgraph/frontend/graph-execution) — namespace-scoped
  selectors for multi-node pipelines.
