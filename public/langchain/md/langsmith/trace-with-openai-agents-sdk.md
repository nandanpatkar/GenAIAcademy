The OpenAI Agents SDK lets you build agentic applications powered by OpenAI models.

Use LangSmith to trace OpenAI Agents SDK runs, including agent steps, model calls, tool calls, and handoffs.

#### Tab: Python

## Installation


> [!NOTE]
>
> Requires Python SDK version `langsmith>=0.3.15`.


Install LangSmith with OpenAI Agents support:

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install \"langsmith[openai-agents]\""
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add \"langsmith[openai-agents]\""
 }
]
```

This installs both the LangSmith library and the OpenAI Agents SDK.

## Environment configuration

```bash Shell
export LANGSMITH_API_KEY=<your-api-key>
export OPENAI_API_KEY=<your-openai-api-key>

# Optional: set a project for your traces
export LANGSMITH_PROJECT=<your-project-name>

# For LangSmith API keys linked to multiple workspaces, set the LANGSMITH_WORKSPACE_ID environment variable to specify which workspace to use.
export LANGSMITH_WORKSPACE_ID=<your-workspace-id>
```

## Quick start

Integrate LangSmith tracing with the OpenAI Agents SDK by using the `OpenAIAgentsTracingProcessor` class.

```python

from agents import Agent, Runner, set_trace_processors
from langsmith.integrations.openai_agents_sdk import OpenAIAgentsTracingProcessor

async def main():
    agent = Agent(
        name="Captain Obvious",
        instructions="You are Captain Obvious, the world's most literal technical support agent.",
    )

    question = "Why is my code failing when I try to divide by zero? I keep getting this error message."
    result = await Runner.run(agent, question)
    print(result.final_output)

if __name__ == "__main__":
    set_trace_processors([OpenAIAgentsTracingProcessor()])
    asyncio.run(main())
```

The agent's execution flow, including spans and their details, is logged to LangSmith.

#### Tab: JavaScript

## Installation


> [!NOTE]
>
> Requires JS SDK version `langsmith>=0.5.25`.


Install LangSmith and the OpenAI Agents SDK:

```lc-tabs
[
 {
  "label": "npm",
  "lang": "bash",
  "code": "npm install langsmith @openai/agents zod"
 },
 {
  "label": "yarn",
  "lang": "bash",
  "code": "yarn add langsmith @openai/agents zod"
 },
 {
  "label": "pnpm",
  "lang": "bash",
  "code": "pnpm add langsmith @openai/agents zod"
 }
]
```

## Environment configuration

```bash Shell
export LANGSMITH_API_KEY=<your-api-key>
export OPENAI_API_KEY=<your-openai-api-key>

# Optional: set a project for your traces
export LANGSMITH_PROJECT=<your-project-name>

# For LangSmith API keys linked to multiple workspaces, set the LANGSMITH_WORKSPACE_ID environment variable to specify which workspace to use.
export LANGSMITH_WORKSPACE_ID=<your-workspace-id>
```


> [!NOTE]
>
> Installing `OpenAIAgentsTracingProcessor` is an explicit opt-in to tracing. The processor posts traces even when `LANGSMITH_TRACING` is not set, and nested `traceable` calls inside agent tools inherit the active trace context.


## Quick start

Register `OpenAIAgentsTracingProcessor` with the OpenAI Agents SDK before running agents.

```typescript

setTraceProcessors([new OpenAIAgentsTracingProcessor()]);

const getWeather = tool({
  name: "get_weather",
  description: "Get the current weather for a city",
  parameters: z.object({
    city: z.string().describe("The city to get weather for"),
  }),
  execute: async ({ city }: { city: string }) => {
    return `The weather in ${city} is sunny.`;
  },
});

const agent = new Agent({
  name: "WeatherAgent",
  instructions: "You are a helpful assistant. Use the get_weather tool when asked about weather.",
  model: "gpt-5-nano",
  tools: [getWeather],
});

const result = await run(agent, "What's the weather in San Francisco?");
console.log(result.finalOutput);
```

The resulting trace contains the root agent run, response spans, and nested tool call spans.

## Configure the processor

Pass options to the processor to set a LangSmith client, project, tags, metadata, or root trace name.

```typescript

const client = new Client();
const processor = new OpenAIAgentsTracingProcessor({
  client,
  projectName: "openai-agents-demo",
  name: "Support agent workflow",
  tags: ["openai-agents"],
  metadata: {
    environment: "development",
  },
});

setTraceProcessors([processor]);

const agent = new Agent({
  name: "SupportAgent",
  instructions: "You are a concise support agent.",
  model: "gpt-5-nano",
});

const result = await run(agent, "Help me reset my password.");
console.log(result.finalOutput);
```

## Nest `traceable` calls in tools

You can use `traceable` inside OpenAI Agents SDK tool handlers. LangSmith nests those runs under the active tool span.

```typescript

setTraceProcessors([new OpenAIAgentsTracingProcessor()]);

const lookupOrder = traceable(
  async (orderId: string) => {
    return { orderId, status: "shipped" };
  },
  { name: "lookup_order" }
);

const orderStatus = tool({
  name: "order_status",
  description: "Look up the status of an order",
  parameters: z.object({
    orderId: z.string().describe("The order ID to look up"),
  }),
  execute: async ({ orderId }: { orderId: string }) => {
    return JSON.stringify(await lookupOrder(orderId));
  },
});

const agent = new Agent({
  name: "OrdersAgent",
  instructions: "Use the order_status tool to answer order questions.",
  model: "gpt-5-nano",
  tools: [orderStatus],
});

await run(agent, "Where is order 123?");
```

## Flush traces in serverless environments

When tracing in serverless environments, flush pending traces before the process exits.

```typescript

const client = new Client();
const processor = new OpenAIAgentsTracingProcessor({ client });
setTraceProcessors([processor]);

try {
  const agent = new Agent({
    name: "SupportAgent",
    instructions: "You are a concise support agent.",
    model: "gpt-5-nano",
  });

  const result = await run(agent, "Help me reset my password.");
  console.log(result.finalOutput);
} finally {
  await processor.forceFlush();
}
```
