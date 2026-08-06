LLMs naturally produce markdown-formatted text, including headings, lists, code blocks,
tables, and inline formatting. Rendering this content as plain text wastes the
structure the model is providing. This pattern shows you how to parse and render
markdown in real time as it streams from the agent, across all major frontend
frameworks.


## How markdown rendering works

The rendering pipeline has three steps:

1. **Receive:** `useStream` accumulates the streamed text into `msg.text` on
   each AI message, updating reactively as new tokens arrive.
2. **Parse:** A markdown parser converts the raw text to HTML (or a React
   element tree). This runs on every update but is fast enough for chat-length
   content (< 5ms for a 5 KB message).
3. **Render:** The parsed output is rendered into the DOM. React uses virtual
   DOM diffing; Vue and Svelte use `v-html` / `{@html}` with sanitized HTML.

## Setting up `useStream`

The markdown pattern uses a simple chat agent with no special configuration.
Wire up `useStream` with your agent URL and assistant ID.


> [!NOTE]
>
> The code examples use `useStream<typeof myAgent>` for type-safe stream state. See Type inference for [Python](lc:oss/python/langchain/frontend/overview#type-inference) or [JavaScript](lc:oss/python/langchain/frontend/overview#type-inference) backends.


```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\nexport function Chat() {\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"simple_agent\",\n  });\n\n  return (\n\n      {stream.messages.map((msg) => {\n        if (AIMessage.isInstance(msg)) {\n          return <Markdown key={msg.id}>{msg.text}</Markdown>;\n        }\n        if (HumanMessage.isInstance(msg)) {\n          return <p key={msg.id}>{msg.text}</p>;\n        }\n      })}\n\n  );\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nconst AGENT_URL = \"http://localhost:2024\";\n\nconst stream = useStream<typeof myAgent>({\n  apiUrl: AGENT_URL,\n  assistantId: \"simple_agent\",\n});\n</script>\n\n<template>\n\n    <template v-for=\"msg in stream.messages.value\" :key=\"msg.id\">\n      <Markdown v-if=\"AIMessage.isInstance(msg)\">{{ msg.text }}</Markdown>\n      <p v-else-if=\"HumanMessage.isInstance(msg)\">{{ msg.text }}</p>\n    </template>\n\n</template>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n\n  const AGENT_URL = \"http://localhost:2024\";\n\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"simple_agent\",\n  });\n</script>\n\n  {#each stream.messages as msg (msg.id)}\n    {#if AIMessage.isInstance(msg)}\n\n    {:else if HumanMessage.isInstance(msg)}\n      <p>{msg.text}</p>\n    {/if}\n  {/each}"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\n@Component({\n  selector: \"app-chat\",\n  template: `\n    @for (msg of stream.messages(); track msg.id) {\n      <app-markdown [content]=\"msg.text\" />\n    }\n  `,\n})\nexport class ChatComponent {\n  stream = injectStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"simple_agent\",\n  });\n}"
 }
]
```

## Choosing a markdown library

Each framework has a natural choice for markdown rendering:

| Framework | Library | Output | Why |
| --- | --- | --- | --- |
| React | `react-markdown` + `remark-gfm` | React elements | Component-based, virtual DOM diffing, no `dangerouslySetInnerHTML` |
| Vue | `marked` + `dompurify` | Sanitized HTML via `v-html` | Lightweight, fast, GFM built-in |
| Svelte | `marked` + `dompurify` | Sanitized HTML via `{@html}` | Same as Vue, consistent API |
| Angular | `marked` + `dompurify` | Sanitized HTML via `[innerHTML]` | Same as Vue/Svelte |


> [!TIP]
>
> React's `react-markdown` converts markdown directly to React elements, so it
> doesn't need HTML sanitization. There's no `dangerouslySetInnerHTML` involved.
> For Vue, Svelte, and Angular, always sanitize the parsed HTML with `dompurify`
> before rendering.


## Building the Markdown component

```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "export function Markdown({ children }: { children: string }) {\n  return (\n\n      <ReactMarkdown remarkPlugins={[remarkGfm]}>\n        {children}\n      </ReactMarkdown>\n\n  );\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nmarked.setOptions({ gfm: true, breaks: true });\n\nconst slots = useSlots();\n\nconst html = computed(() => {\n  const slot = slots.default?.();\n  const text = slot\n    ?.map((vnode) =>\n      typeof vnode.children === \"string\" ? vnode.children : \"\"\n    )\n    .join(\"\") ?? \"\";\n  if (!text) return \"\";\n  return DOMPurify.sanitize(marked.parse(text) as string);\n});\n</script>\n\n<template>\n\n</template>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n\n  let { content }: { content: string } = $props();\n\n  marked.setOptions({ gfm: true, breaks: true });\n\n  let html = $derived.by(() => {\n    if (!content) return \"\";\n    return DOMPurify.sanitize(marked.parse(content) as string);\n  });\n</script>\n\n  {@html html}"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "marked.setOptions({ gfm: true, breaks: true });\n\n@Component({\n  selector: \"app-markdown\",\n  template: ``,\n})\nexport class MarkdownComponent {\n  @Input() set content(value: string) {\n    this._content.set(value);\n  }\n\n  private _content = signal(\"\");\n\n  html = computed(() => {\n    const text = this._content();\n    if (!text) return \"\";\n    return DOMPurify.sanitize(marked.parse(text) as string);\n  });\n}"
 }
]
```

## Sanitizing HTML output

When rendering parsed markdown as raw HTML (`v-html`, `{@html}`, `[innerHTML]`),
you must sanitize the output to prevent cross-site scripting (XSS). LLM
responses may contain arbitrary text, including markup that a markdown parser
could turn into executable HTML.

Use `dompurify` to strip dangerous elements:

```ts

const safeHtml = DOMPurify.sanitize(rawHtml);
```

DOMPurify removes `<script>` tags, `onclick` attributes, `javascript:` URLs,
and other XSS vectors while preserving safe markdown output like headings,
lists, code blocks, tables, and links.


> [!NOTE]
>
> React's `react-markdown` does not need `dompurify` because it produces React
> elements directly, no raw HTML injection is involved.


## Streaming considerations

`useStream` updates `msg.text` reactively as each token arrives. The markdown
component re-parses on every update. For typical chat messages, this is
performant:

- `marked` parses at ~1 MB/s. A 5 KB message takes < 5ms
- `react-markdown` + remark pipeline is similarly fast for chat-length content
- The browser's layout engine handles the DOM update efficiently

For very long responses (> 50 KB), consider these optimizations:

- **Throttle renders:** use `requestAnimationFrame` to batch updates at 60fps
  instead of re-rendering on every token
- **Incremental parsing:** parse only new content and append to a rendered
  buffer (advanced, typically not needed for chat UIs)


> [!NOTE]
>
> For most chat applications, the simple approach of re-parsing the full message
> on each token is sufficient. Only optimize if you observe janky scrolling or
> dropped frames with very long messages.


## Best practices

- **Always sanitize:** when using `v-html`, `{@html}`, or `[innerHTML]`,
  always run the parsed output through `dompurify`. Never trust raw HTML from a
  markdown parser fed with LLM output.
- **Enable GFM:** GitHub Flavored Markdown adds tables, strikethrough, task
  lists, and autolinks. These features are commonly used by LLMs.
- **Handle empty content:** check for empty strings before parsing to avoid
  rendering empty containers.
- **Use `breaks: true`:** enable line break conversion so single newlines in
  LLM output render as `<br>` rather than being ignored. LLMs often use single
  newlines for visual separation.
- **Style for chat context:** use compact margins and sizes appropriate for
  chat bubbles, not full-width article layouts.
- **Test with rich content:** verify rendering with headings, nested lists,
  code blocks with long lines, wide tables, and blockquotes to catch overflow
  or layout issues.
