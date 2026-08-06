Not every agent interaction is a chat. Sometimes the agent is executing a
multi-step plan, and the best way to show progress is a **todo list** that
updates in real time. The deep agent todo list pattern reads a `todos` array
directly from the agent's state, rendering each item with its current status as
the agent works through its plan. It's a progress dashboard built on the same
`useStream` hook you use for chat. It shows that agent state can power any UI,
not just message bubbles.


## How it works

Deep agents can expose a **`todos` state** channel when you opt into `TodoListMiddleware`. That middleware adds the `write_todos` tool and persists task progress as the agent works through its plan. As the agent executes, it updates each
todo's status from `"pending"` to `"in_progress"` to `"completed"`. The
`useStream` hook exposes this state via `stream.values.todos`, and your UI
renders it reactively.


> [!NOTE]
>
> Task planning is opt-in. Without `TodoListMiddleware`, `stream.values.todos` is not present. See [Task planning](lc:oss/python/deepagents/overview#task-planning).


The flow looks like this:

1. User submits a request
2. Agent creates a plan and populates `todos` in its state
3. Agent begins executing each todo transitions through `pending` →
   `in_progress` → `completed`
4. `stream.values.todos` updates in real time as the agent progresses
5. Your UI re-renders the todo list with current statuses

## Setting up `useStream`

Enable `TodoListMiddleware` on the agent.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain.agents.middleware import TodoListMiddleware\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    middleware=[TodoListMiddleware()],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain.agents.middleware import TodoListMiddleware\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    middleware=[TodoListMiddleware()],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain.agents.middleware import TodoListMiddleware\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    middleware=[TodoListMiddleware()],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain.agents.middleware import TodoListMiddleware\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    middleware=[TodoListMiddleware()],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain.agents.middleware import TodoListMiddleware\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    middleware=[TodoListMiddleware()],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain.agents.middleware import TodoListMiddleware\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    middleware=[TodoListMiddleware()],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain.agents.middleware import TodoListMiddleware\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    middleware=[TodoListMiddleware()],\n)"
 }
]
```


Then point `useStream` at that agent and
read the `todos` from `stream.values`.


> [!NOTE]
>
> The code examples use `useStream<typeof myAgent>` for type-safe stream state. See Type inference for [Python](lc:oss/python/langchain/frontend/overview#type-inference) or [JavaScript](lc:oss/python/langchain/frontend/overview#type-inference) backends.


```lc-tabs
[
 {
  "label": "React",
  "lang": "tsx",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\nexport function TodoAgent() {\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"deep_agent_todo_list\",\n  });\n\n  const todos = stream.values?.todos ?? [];\n\n  return (\n\n\n      {stream.messages.map((msg) => (\n\n      ))}\n\n  );\n}"
 },
 {
  "label": "Vue",
  "lang": "vue",
  "code": "<script setup lang=\"ts\">\n\nconst AGENT_URL = \"http://localhost:2024\";\n\nconst stream = useStream<typeof myAgent>({\n  apiUrl: AGENT_URL,\n  assistantId: \"deep_agent_todo_list\",\n});\n\nconst todos = computed(() => stream.values.value?.todos ?? []);\n</script>\n\n<template>\n\n\n\n\n</template>"
 },
 {
  "label": "Svelte",
  "lang": "svelte",
  "code": "<script lang=\"ts\">\n\n  const AGENT_URL = \"http://localhost:2024\";\n\n  const stream = useStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"deep_agent_todo_list\",\n  });\n\n  const todos = $derived(stream.values?.todos ?? []);\n</script>\n\n\n  {#each stream.messages as msg (msg.id)}\n\n  {/each}"
 },
 {
  "label": "Angular",
  "lang": "ts",
  "code": "const AGENT_URL = \"http://localhost:2024\";\n\n@Component({\n  selector: \"app-todo-agent\",\n  template: `\n\n      <app-todo-list [todos]=\"todos()\" />\n      @for (msg of stream.messages(); track msg.id) {\n        <app-message [message]=\"msg\" />\n      }\n\n  `,\n})\nexport class TodoAgentComponent {\n  stream = injectStream<typeof myAgent>({\n    apiUrl: AGENT_URL,\n    assistantId: \"deep_agent_todo_list\",\n  });\n\n  todos = computed(() => this.stream.values()?.todos ?? []);\n}"
 }
]
```

## Building the TodoList component

The todo list renders each item with a status icon, color coding, and visual
styling that reflects the current state:

```tsx
function TodoList({ todos }: { todos: Todo[] }) {
  const completed = todos.filter((t) => t.status === "completed").length;
  const percentage = todos.length
    ? Math.round((completed / todos.length) * 100)
    : 0;

  return (
    
      
        ## Agent Progress
        <span className="text-sm text-gray-500">
          {completed}/{todos.length} tasks
        </span>
      

      

      <ul className="mt-4 space-y-2">
        {todos.map((todo, i) => (
          
        ))}
      </ul>
    
  );
}
```

## Progress bar

A visual progress bar gives users an at-a-glance summary of overall completion:

```tsx
function ProgressBar({ percentage }: { percentage: number }) {
  return (
    
      
        <span>Progress</span>
        <span>{percentage}%</span>
      
      
        
      
    
  );
}
```

## Individual todo items

Each item gets a status icon, color-coded text, and strikethrough styling for
completed tasks:

```tsx
function TodoItem({ todo }: { todo: Todo }) {
  const config = {
    pending: {
      icon: "○",
      textClass: "text-gray-600",
      bgClass: "bg-gray-50",
      iconClass: "text-gray-400",
    },
    in_progress: {
      icon: "◉",
      textClass: "text-amber-800",
      bgClass: "bg-amber-50 border-amber-200",
      iconClass: "text-amber-500 animate-pulse",
    },
    completed: {
      icon: "✓",
      textClass: "text-green-800 line-through",
      bgClass: "bg-green-50 border-green-200",
      iconClass: "text-green-500",
    },
  };

  const style = config[todo.status];

  return (
    <li
      className={`flex items-start gap-3 rounded-md border px-3 py-2 ${style.bgClass}`}
    >
      <span className={`mt-0.5 text-lg leading-none ${style.iconClass}`}>
        {style.icon}
      </span>
      <span className={`text-sm ${style.textClass}`}>{todo.content}</span>
    </li>
  );
}
```

The `in_progress` icon uses `animate-pulse` to draw attention to the currently
active task.

## Calculating progress

Derive progress metrics directly from the todos array:

```ts
const todos = stream.values?.todos ?? [];

const completed = todos.filter((t) => t.status === "completed").length;
const inProgress = todos.filter((t) => t.status === "in_progress").length;
const pending = todos.filter((t) => t.status === "pending").length;
const percentage = todos.length
  ? Math.round((completed / todos.length) * 100)
  : 0;
```

These values update reactively as the agent modifies its state, keeping the
progress bar and counters in sync.

## Combining with chat messages

The todo list works alongside the regular chat interface. A practical layout
shows the todo list as a persistent sidebar or header panel, with chat messages
below:

```tsx
function TodoAgentLayout() {
  const stream = useStream<typeof myAgent>({
    apiUrl: AGENT_URL,
    assistantId: "deep_agent_todo_list",
  });

  const todos = stream.values?.todos ?? [];

  return (
    
      {todos.length > 0 && (
        
          
        
      )}

      <main className="flex-1 overflow-y-auto p-6">
        
          {stream.messages.map((msg) => (
            
          ))}
        
      </main>

      <ChatInput
        onSubmit={(text) =>
          stream.submit({ messages: [{ type: "human", content: text }] })
        }
        isLoading={stream.isLoading}
      />
    
  );
}
```


> [!TIP]
>
> Show the todo list only when `todos.length > 0`. Before the agent creates its
> plan, there's nothing to display. Showing an empty component wastes space.


## Use cases

The todo list pattern fits any scenario where an agent executes a structured
plan:

- **Project planning**: agent breaks a project into tasks and works through
  them sequentially
- **Research workflows**: each research question becomes a todo that the agent
  investigates and completes
- **Data processing**: steps like ingestion, validation, transformation, and
  export each get their own todo
- **Onboarding flows**: agent walks through setup steps, checking off each one
  as it configures services
- **Report generation**: sections of a report become todos: gather data,
  analyze trends, write summary, format output

## Handling empty and loading states

Handle the initial state before the agent has created its plan:

```tsx
function TodoList({ todos, isLoading }: { todos: Todo[]; isLoading: boolean }) {
  if (todos.length === 0 && !isLoading) {
    return null;
  }

  if (todos.length === 0 && isLoading) {
    return (
      
        
          <span className="animate-spin">⟳</span>
          Agent is creating a plan...
        
      
    );
  }

  return (
    
      {/* ... full todo list rendering */}
    
  );
}
```

## Best practices

- **Show the todo list prominently**. It's the primary progress indicator for
  plan-based agents. Don't bury it below the fold.
- **Animate status transitions**. Smooth transitions make the agent feel more
  responsive. Use CSS transitions on background color, text decoration, and
  opacity.
- **Only highlight one `in_progress` item**. Agents typically work on one task
  at a time. If multiple items show as `in_progress`, the UI gets noisy.
  Consider only pulsing the first one.
- **Collapse or dim completed items**. As the list grows, completed items
  become less relevant. Reduce their visual weight so users focus on what's
  still happening.
- **Show the progress percentage**. A single number like "67% complete" is
  immediately understandable, even from across the room.
- **Keep the todo list in sync**. Because `stream.values` updates reactively,
  the todo list stays current automatically. Don't add manual polling or
  refresh logic.
