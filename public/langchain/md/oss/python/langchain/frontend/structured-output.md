Structured output lets the agent return typed, machine-readable data instead of plain text. Instead of rendering a single string, you get a structured object you can map to any UI: cards, tables, charts, step-by-step breakdowns, or domain-specific renderers.


## What is structured output?

Instead of returning a free-form text response, the agent uses a tool call to return a structured object conforming to a predefined schema. This gives you:

- **Type-safe data**: parse the response into a known TypeScript type
- **Precise rendering control**: render each field with its own UI treatment
- **Consistent formatting**: every response follows the same structure regardless of the underlying model

The agent accomplishes this by calling a "structured output" tool whose arguments contain the response data. The tool itself doesn't execute any logic and is purely a vehicle for returning typed data.

## Use cases

- **Product comparisons**: feature tables, pros/cons lists, ratings
- **Data analysis**: summaries with metrics, breakdowns, and highlights
- **Step-by-step guides**: ordered instructions with descriptions and code snippets
- **Recipes**: ingredients, steps, timings, and nutritional info
- **Math and science**: formulas rendered with LaTeX, step-by-step derivations
- **Travel planning**: itineraries with dates, locations, and cost estimates

## Define a schema

Define a TypeScript type for the structured data the agent returns. The shape of this schema determines how you render the UI.

The following is the math-solution schema used by the embedded demo:

```ts
interface MathSolution {
  problem: string; // The original math problem
  steps: {
    explanation: string;
    latex: string; // Optional display math for this step
  }[]; // Step-by-step derivation
  finalAnswer: string; // Plain-text final answer
  finalAnswerLatex: string; // LaTeX representation of the final answer
}
```

Your schema can be anything. The pattern works the same way regardless of shape.

## Extract structured output from messages

The structured output lives in the `tool_calls` array of the last `AIMessage`. Extract it by finding the AI message and accessing the first tool call's arguments:

```ts

function extractStructuredOutput<T>(messages: any[]): T | null {
  const aiMessage = messages.find(AIMessage.isInstance);
  const toolCall = aiMessage?.tool_calls?.[0];
  if (!toolCall) return null;

  return toolCall.args as T;
}
```


> [!NOTE]
>
> The structured output tool call may not have `args` populated until the agent finishes streaming. During streaming, `args` may be partially populated or undefined. Always check for completeness before rendering.


## Set up `useStream`

Connect `useStream` to your structured-output agent, then read
`stream.messages` and extract the typed payload from the latest `AIMessage`
tool call. Render your custom UI once `args` is complete, show a loading state
while `stream.isLoading` is true (tool arguments may stream in gradually), and
use `stream.submit()` to send the next prompt.


> [!NOTE]
>
> The code examples use `useStream<typeof myAgent>` for type-safe stream state. See Type inference for [Python](lc:oss/python/langchain/frontend/overview#type-inference) or [JavaScript](lc:oss/python/langchain/frontend/overview#type-inference) backends.


```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "function MathSolutionChat() {\n  const stream = useStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"structured_output_latex\",\n  });\n\n  const solution = extractStructuredOutput<MathSolution>(stream.messages);\n\n  return (\n\n      {!solution && !stream.isLoading && (\n        <PromptInput onSubmit={(text) =>\n          stream.submit({ messages: [{ type: \"human\", content: text }] })\n        } />\n      )}\n      {stream.isLoading && }\n      {solution && }\n\n  );\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nconst stream = useStream<typeof myAgent>({\n  apiUrl: \"http://localhost:2024\",\n  assistantId: \"structured_output_latex\",\n});\n\nconst solution = computed(() =>\n  extractStructuredOutput<MathSolution>(stream.messages.value)\n);\n\nfunction handleSubmit(text: string) {\n  stream.submit({ messages: [{ type: \"human\", content: text }] });\n}\n</script>\n\n<template>\n\n\n\n\n\n</template>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n\n  const stream = useStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"structured_output_latex\",\n  });\n\n  const solution = $derived(extractStructuredOutput<MathSolution>(stream.messages));\n\n  function handleSubmit(text: string) {\n    stream.submit({ messages: [{ type: \"human\", content: text }] });\n  }\n</script>\n\n  {#if !solution && !stream.isLoading}\n    <PromptInput on:submit={(e) => handleSubmit(e.detail)} />\n  {/if}\n  {#if stream.isLoading}\n\n  {/if}\n  {#if solution}\n\n  {/if}"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "@Component({\n  selector: \"app-math-solution-chat\",\n  template: `\n    @if (!solution() && !stream.isLoading()) {\n      <prompt-input (onSubmit)=\"handleSubmit($event)\" />\n    }\n    @if (stream.isLoading()) {\n      <loading-indicator />\n    }\n    @if (solution()) {\n      <solution-card [solution]=\"solution()\" />\n    }\n  `,\n})\nexport class MathSolutionChatComponent {\n  stream = injectStream<typeof myAgent>({\n    apiUrl: \"http://localhost:2024\",\n    assistantId: \"structured_output_latex\",\n  });\n\n  solution = computed(() =>\n    extractStructuredOutput<MathSolution>(this.stream.messages())\n  );\n\n  handleSubmit(text: string) {\n    this.stream.submit({\n      messages: [{ type: \"human\", content: text }],\n    });\n  }\n}"
 }
]
```

## Render the structured data

Once you have a typed object, build a component that maps each field to the
appropriate UI element. This is the core of the pattern: turning structured
data into a purpose-built interface.

```tsx
function LatexBlock({ latex }: { latex: string }) {
  return {latex}; // Render with KaTeX or MathJax.
}

function SolutionCard({ solution }: { solution: MathSolution }) {
  return (
    
      ## {solution.problem}
      <ol>
        {solution.steps.map((step, i) => (
          <li key={i}>
            <span>{step.explanation}</span>
            {step.latex && }
          </li>
        ))}
      </ol>
      <strong>{solution.finalAnswer}</strong>
      {solution.finalAnswerLatex && }
    
  );
}
```

## Handle partial streaming data

During streaming, the tool call arguments may be incomplete JSON. Guard against this in your extraction logic:

```ts
function extractStructuredOutput<T>(
  messages: any[],
  requiredFields: string[] = [],
): T | null {
  const aiMessages = messages.filter(AIMessage.isInstance);
  if (aiMessages.length === 0) return null;

  const lastAI = aiMessages[aiMessages.length - 1];
  const toolCall = lastAI.tool_calls?.[0];
  if (!toolCall?.args) return null;

  const args = toolCall.args as Record<string, unknown>;
  const hasRequired = requiredFields.every(
    (field) => args[field] !== undefined
  );

  if (requiredFields.length > 0 && !hasRequired) return null;
  return args as T;
}
```

Use the `requiredFields` parameter to wait until critical fields are populated before rendering:

```ts
const solution = extractStructuredOutput<MathSolution>(stream.messages, [
  "problem",
  "steps",
  "finalAnswer",
]);
```

## Render progressively during streaming

Rather than waiting for the complete structured output, render fields as they arrive. This gives users immediate feedback while the agent is still generating:

```tsx
function ProgressiveSolutionCard({ messages }: { messages: any[] }) {
  const partial = extractStructuredOutput<Partial<MathSolution>>(messages);
  if (!partial) return null;

  return (
    
      {partial.problem && ## {partial.problem}}

      {partial.steps && partial.steps.length > 0 && (
        
          ## Steps
          {partial.steps.map((step, i) => (
            
              Step {i + 1}
              <p>{step.explanation}</p>
              {step.latex && }
            
          ))}
        
      )}

      {partial.finalAnswer && <strong>{partial.finalAnswer}</strong>}
    
  );
}
```


> [!TIP]
>
> Progressive rendering works well when the schema has a natural top-to-bottom
> order: problem, then derivation steps, then final answer. The agent typically
> generates fields in schema order, so the UI fills in naturally.


## Best practices

- **Validate before rendering**: always check that required fields exist before rendering, since streaming may deliver partial data
- **Use a generic extraction function**: parameterize your extraction logic with a type and required fields so it works across different schemas
- **Render progressively**: show fields as they arrive rather than waiting for the complete object, so users see immediate feedback
- **Provide fallback representations**: if a field supports rich rendering (LaTeX, Markdown, charts), also include a plain-text equivalent in your schema as a fallback
- **Keep schemas flat when possible**: deeply nested schemas are harder to render progressively and more likely to break during partial streaming
- **Match UI to data**: choose the rendering strategy that best represents each field type (tables for arrays, cards for nested objects, badges for status fields)
