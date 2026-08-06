Join and rejoin lets you disconnect from a running agent stream without stopping the agent, then reconnect to it later. The agent continues executing server-side while the client is away, and you pick up the stream exactly where you left off.


> [!NOTE]
>
> This feature requires the [LangGraph Agent Server](lc:oss/python/langgraph/local-server). Run your agent locally with `langgraph dev` or [deploy it to LangSmith](lc:langsmith/deployment) to use this pattern.


## Why join & rejoin?

Traditional streaming APIs tightly couple the client and server: if the client disconnects, the stream is lost. Join and rejoin breaks this coupling, enabling several important patterns:

- **Network interruptions**: mobile users moving between cell towers or Wi-Fi networks can seamlessly resume
- **Page navigation**: users navigating away from a chat page and returning later without losing progress
- **Mobile backgrounding**: apps suspended by the OS can rejoin the stream when foregrounded
- **Long-running tasks**: agents performing multi-minute operations (research, code generation, data analysis) where users don't need to keep the page open
- **Multi-device handoff**: start a conversation on your phone, rejoin on your desktop

## Core concepts

The join/rejoin pattern involves three key mechanisms:

| Method / Option | Purpose |
|---|---|
| `threadId` | Bind the stream to the LangGraph thread you want to observe |
| `onThreadId` | Persist newly-created thread IDs so a remount can reconnect |
| `stream.disconnect()` | Leave the stream client-side while the agent keeps running server-side |
| Remount with the same `threadId` | Reattach to in-flight work for that thread |


> [!NOTE]
>
> **Join/rejoin uses `stream.disconnect()`, not `stream.stop()`.** By default, `stream.stop()` **cancels the active run**: it disconnects the client *and* cancels the run on the server. For join/rejoin, call `stream.disconnect()` (alias for `stop({ cancel: false })`) so the agent continues processing while you are away.
>
> To cancel execution explicitly from app code, use `stream.stop()` or `client.runs.cancel`.


## Setting up `useStream`

The key setup step is persisting `threadId`. When the component remounts with
the same thread ID, the stream attaches to the thread's current state and any
in-flight run.


> [!NOTE]
>
> The code examples use `useStream<typeof myAgent>` for type-safe stream state. See Type inference for [Python](lc:oss/python/langchain/frontend/overview#type-inference) or [JavaScript](lc:oss/python/langchain/frontend/overview#type-inference) backends.


```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "function Chat() {\n  const [connected, setConnected] = useState(true);\n  const [mountKey, setMountKey] = useState(0);\n  const [threadId, setThreadId] = useState<string | null>(\n    () => sessionStorage.getItem(\"activeThreadId\"),\n  );\n\n  const stream = useStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"join_rejoin\",\n    threadId,\n    onThreadId(id) {\n      setThreadId(id);\n      if (id) sessionStorage.setItem(\"activeThreadId\", id);\n    },\n  });\n\n  const disconnect = useCallback(() => {\n    void stream.disconnect();\n    setConnected(false);\n  }, [stream]);\n\n  const rejoin = useCallback(() => {\n    setMountKey((key) => key + 1);\n    setConnected(true);\n  }, []);\n\n  return (\n\n\n\n\n\n  );\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nconst connected = ref(true);\nconst mountKey = ref(0);\nconst threadId = ref<string | null>(sessionStorage.getItem(\"activeThreadId\"));\n\nconst stream = useStream<typeof myAgent>({\n  apiUrl: \"http://localhost:2024\",\n  assistantId: \"join_rejoin\",\n  threadId,\n  onThreadId(id) {\n    threadId.value = id;\n    if (id) sessionStorage.setItem(\"activeThreadId\", id);\n  },\n});\n\nfunction disconnect() {\n  void stream.disconnect();\n  connected.value = false;\n}\n\nfunction rejoin() {\n  mountKey.value += 1;\n  connected.value = true;\n}\n</script>\n\n<template>\n\n\n\n\n\n</template>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n\n  let connected = $state(true);\n  let mountKey = $state(0);\n  let threadId = $state<string | null>(sessionStorage.getItem(\"activeThreadId\"));\n\n  const stream = useStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"join_rejoin\",\n    threadId: () => threadId,\n    onThreadId(id) {\n      threadId = id;\n      if (id) sessionStorage.setItem(\"activeThreadId\", id);\n    },\n  });\n\n  function disconnect() {\n    void stream.disconnect();\n    connected = false;\n  }\n\n  function rejoin() {\n    mountKey += 1;\n    connected = true;\n  }\n</script>"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "@Component({\n  selector: \"app-chat\",\n  template: `\n    <connection-status [connected]=\"connected()\" />\n    <message-list [messages]=\"stream.messages()\" />\n    <chat-controls\n      [stream]=\"stream\"\n      [threadId]=\"threadId()\"\n      [connected]=\"connected()\"\n      (disconnect)=\"disconnect()\"\n      (rejoin)=\"rejoin()\"\n    />\n  `,\n})\nexport class ChatComponent {\n  threadId = signal<string | null>(sessionStorage.getItem(\"activeThreadId\"));\n  connected = signal(true);\n  mountKey = signal(0);\n\n  stream = injectStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"join_rejoin\",\n    threadId: this.threadId,\n    onThreadId: (id) => {\n      this.threadId.set(id);\n      if (id) sessionStorage.setItem(\"activeThreadId\", id);\n    },\n  });\n\n  disconnect() {\n    void this.stream.disconnect();\n    this.connected.set(false);\n  }\n\n  rejoin() {\n    this.mountKey.update((key) => key + 1);\n    this.connected.set(true);\n  }\n}"
 }
]
```

## Submitting messages

Submit messages normally. The thread ID binding is what allows a later remount
to reconnect to the same conversation:

```ts
stream.submit({ messages: [{ type: "human", content: text }] });
```

## Disconnecting from a stream

Call `stream.disconnect()` to leave the stream without cancelling the run. The agent continues processing server-side.

```ts
await stream.disconnect();
// equivalent to: await stream.stop({ cancel: false })
```

Do **not** use `stream.stop()` here — by default it cancels the run on the server.

After calling `disconnect()`:
- `stream.isLoading` becomes `false`
- Your own `connected` flag should also become `false`
- The message list retains all messages received up to the disconnect point
- The agent continues running on the server
- No new messages are received until you rejoin

## Rejoining a stream

Remount the stream consumer with the saved thread ID to reconnect. In React, the
demo bumps a `mountKey`; in other frameworks, use the equivalent remount or
conditional-render pattern:

```ts
setMountKey((key) => key + 1);
setConnected(true);
```

After rejoining:
- `connected` becomes `true`
- Any messages generated while disconnected are delivered
- New streaming messages resume in real-time
- If the agent is still running, `stream.isLoading` becomes `true`; if it has
  already finished, you receive the final state immediately

## Best practices

- **Use `disconnect()` for join/rejoin, `stop()` to cancel**: navigating away or backgrounding the app should call `stream.disconnect()`. A user-facing "Stop" or "Cancel" button should call `stream.stop()` (or `client.runs.cancel`).
- **Always save the thread ID**: without it, rejoining is impossible. Use both component state and persistent storage for resilience.
- **Show clear connection state**: users should always know whether they are receiving live updates or viewing a snapshot.
- **Auto-rejoin on visibility change**: use the Page Visibility API to automatically rejoin when the user returns to the tab.
- **Set reasonable timeouts**: if a rejoin attempt takes too long, fall back to fetching the thread history instead.
- **Clean up stale threads**: remove persisted thread IDs when the user starts over or the backend reports that the thread is unavailable.
