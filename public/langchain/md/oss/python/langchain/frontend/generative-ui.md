Generative UI lets the AI generate complete user interfaces from natural language
prompts. Instead of rendering text responses in chat bubbles, the AI output **is**
the UI: forms, cards, dashboards, and more. The developer defines which components
are available (the "catalog"), and the AI composes them into a valid UI tree.

This pattern uses [json-render](https://json-render.dev), the Generative UI framework,
to define component catalogs, generate specs with AI, and render them safely across
React, Vue, Svelte, and Angular.


## How it works

1. **Define a catalog**: declare what components the AI can use, with typed props
2. **Prompt the AI**: describe the UI you want in natural language
3. **AI generates a spec**: a JSON document describing the component tree
4. **Render safely**: json-render's `Renderer` renders the spec using your components

The catalog acts as a guardrail: the AI can only use components you've defined,
with props that match your schema. The output is always predictable and safe.

## Define a component catalog

The catalog describes every component the AI is allowed to use. Each component has a
Zod schema for its props and a description that the AI reads to understand when to
use it:

```ts

const catalog = defineCatalog(schema, {
  components: {
    Card: {
      description: "A card container with optional title and padding",
      props: z.object({
        title: z.string().optional(),
        padding: z.enum(["sm", "md", "lg"]).optional(),
      }),
    },
    Stack: {
      description: "Layout children vertically or horizontally with consistent spacing",
      props: z.object({
        direction: z.enum(["vertical", "horizontal"]).optional(),
        gap: z.enum(["sm", "md", "lg"]).optional(),
      }),
    },
    TextInput: {
      description: "A text input field with optional label and placeholder",
      props: z.object({
        label: z.string().optional(),
        placeholder: z.string().optional(),
        type: z.enum(["text", "email", "password", "number", "textarea"]).optional(),
      }),
    },
    Button: {
      description: "A clickable button with label and style variants",
      props: z.object({
        label: z.string(),
        variant: z.enum(["primary", "secondary", "ghost", "link"]).optional(),
        fullWidth: z.boolean().optional(),
      }),
    },
  },
  actions: {},
});
```


> [!TIP]
>
> Keep catalogs focused. Include only components the AI needs for the use case.
> A smaller catalog produces better results than a kitchen-sink approach.


## Build a component registry

The registry maps each catalog component to its actual rendering implementation.
Use `defineRegistry` to get type-safe bindings between the catalog props and
your component functions:

```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "const { registry } = defineRegistry(catalog, {\n  components: {\n    Card: ({ props, children }) => (\n\n        {props.title && ## {props.title}}\n        {children}\n\n    ),\n    Stack: ({ props, children }) => (\n\n        {children}\n\n    ),\n    TextInput: ({ props }) => (\n\n        {props.label && <label>{props.label}</label>}\n        <input type={props.type ?? \"text\"} placeholder={props.placeholder} />\n\n    ),\n    Button: ({ props }) => (\n      <button className={props.variant ?? \"primary\"}>\n        {props.label}\n      </button>\n    ),\n  },\n});"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nconst { registry } = defineRegistry(catalog, {\n  components: {\n    Card: ({ props, children }) =>\n      h(\"div\", { class: \"card\" }, [\n        props.title ? h(\"h2\", null, props.title) : null,\n        children,\n      ]),\n    Stack: ({ props, children }) =>\n      h(\"div\", { class: `stack stack-${props.direction ?? \"vertical\"} gap-${props.gap ?? \"md\"}` }, children),\n    TextInput: ({ props }) =>\n      h(\"div\", null, [\n        props.label ? h(\"label\", null, props.label) : null,\n        h(\"input\", { type: props.type ?? \"text\", placeholder: props.placeholder }),\n      ]),\n    Button: ({ props }) =>\n      h(\"button\", { class: props.variant ?? \"primary\" }, props.label),\n  },\n});\n</script>"
 }
]
```

## Connect to the agent

The agent uses structured output to return a json-render spec. Set up `useStream`
with your agent's assistant ID, then extract the spec from the AI message's
`tool_calls`:

```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "function GenerativeUI() {\n  const stream = useStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"generative_ui\",\n  });\n\n  const aiMessage = stream.messages.find(AIMessage.isInstance);\n  const rawSpec = aiMessage?.tool_calls?.[0]?.args;\n\n  // ... filter and render (see streaming section below)\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nconst stream = useStream<typeof myAgent>({\n  apiUrl: \"http://localhost:2024\",\n  assistantId: \"generative_ui\",\n});\n\nconst aiMessage = computed(() => stream.messages.value.find(AIMessage.isInstance));\nconst rawSpec = computed(() => aiMessage.value?.tool_calls?.[0]?.args);\n</script>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n\n  const stream = useStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"generative_ui\",\n  });\n\n  const aiMessage = $derived(stream.messages.find((m) => AIMessage.isInstance(m)));\n  const rawSpec = $derived(aiMessage?.tool_calls?.[0]?.args);\n</script>"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "@Component({\n  selector: \"app-generative-ui\",\n  template: `...`,\n})\nexport class GenerativeUIComponent {\n  stream = injectStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"generative_ui\",\n  });\n\n  get rawSpec() {\n    const ai = this.stream.messages().find(AIMessage.isInstance);\n    return ai?.tool_calls?.[0]?.args;\n  }\n}"
 }
]
```

## Stream and render progressively

During streaming, the spec is built up incrementally. Elements arrive one at a
time and may initially lack `type` or `props`. Filter to only complete elements
and pass `loading={true}` to the `Renderer`, which tells it to silently skip
children that haven't arrived yet. The UI builds up component by component:

```tsx
/*
 * Filter the streamed spec to only include elements with valid type/props,
 * enabling progressive rendering as the AI response builds up. Passing
 * loading={true} to the Renderer tells it to skip missing children silently.
 */
const spec = (() => {
  if (!rawSpec?.root || !rawSpec?.elements) return null;
  const rootEl = rawSpec.elements[rawSpec.root];
  if (!rootEl?.type || rootEl?.props == null) return null;

  const safeElements = {};
  for (const [key, el] of Object.entries(rawSpec.elements)) {
    if (el?.type && el?.props != null) {
      safeElements[key] = el;
    }
  }
  return { root: rawSpec.root, elements: safeElements };
})();

return (
  <>
    {spec && (
      <JSONUIProvider registry={registry}>
        
      </JSONUIProvider>
    )}
  </>
);
```


> [!NOTE]
>
> The `JSONUIProvider` is required to set up json-render's internal context
> providers (state, visibility, validation, actions). The `Renderer` component
> must be rendered inside it.


## The spec format

The AI agent generates a flat JSON spec with a `root` key pointing to the
root element and an `elements` map containing all components:

```json
{
  "root": "login-card",
  "elements": {
    "login-card": {
      "type": "Card",
      "props": { "title": "Login" },
      "children": ["login-stack"]
    },
    "login-stack": {
      "type": "Stack",
      "props": { "direction": "vertical", "gap": "md" },
      "children": ["email-input", "password-input", "submit-btn"]
    },
    "email-input": {
      "type": "TextInput",
      "props": { "label": "Email", "placeholder": "Enter your email", "type": "email" },
      "children": []
    },
    "password-input": {
      "type": "TextInput",
      "props": { "label": "Password", "placeholder": "Enter your password", "type": "password" },
      "children": []
    },
    "submit-btn": {
      "type": "Button",
      "props": { "label": "Sign In", "variant": "primary", "fullWidth": true },
      "children": []
    }
  }
}
```

Each element references its children by ID, and leaf elements like `TextInput`
and `Button` have empty `children` arrays.

## Best practices

- **Use descriptive component descriptions**: the AI uses these to understand when
  to use each component. Clear descriptions lead to better UI generation.
- **Validate before rendering**: always check that elements have valid `type` and
  non-null `props` before passing to the Renderer, since streaming delivers partial data.
- **Design for streaming**: pass `loading={true}` during streaming so the Renderer
  gracefully handles children that haven't arrived yet. Users see the UI build up
  in real time rather than waiting for the full response.
- **Style with design tokens**: use CSS custom properties so rendered components
  adapt to light and dark themes automatically.
- **Wrap with JSONUIProvider**: the `Renderer` must be inside a `JSONUIProvider`
  to access json-render's internal context for state, visibility, and actions.
