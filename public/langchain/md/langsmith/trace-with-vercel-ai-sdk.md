You can use LangSmith to trace runs from the Vercel AI SDK. This guide shows you how to set up tracing for AI SDK v5, v6, and v7.

## Installation

Install the Vercel AI SDK, a model provider package, and LangSmith. This guide uses Vercel's OpenAI integration for the following code snippets, but you can use any other Vercel AI SDK provider.

    #### Tab: AI SDK v7

        

> [!NOTE]
>
> `LangSmithTelemetry` requires AI SDK v7 and is available in `langsmith>=0.7.2`.


        

        ```lc-tabs
        [
         {
          "label": "npm",
          "lang": "bash",
          "code": "npm install ai @ai-sdk/openai zod langsmith"
         },
         {
          "label": "yarn",
          "lang": "bash",
          "code": "yarn add ai @ai-sdk/openai zod langsmith"
         },
         {
          "label": "pnpm",
          "lang": "bash",
          "code": "pnpm add ai @ai-sdk/openai zod langsmith"
         }
        ]
        ```

        
    
    #### Tab: AI SDK v5 and v6

        

> [!NOTE]
>
> `wrapAISDK` supports AI SDK v6 and requires `langsmith>=0.3.63`. If you are using an older version of the AI SDK or `langsmith`, refer to the [OpenTelemetry (OTEL) based approach](https://docs.langchain.com/langsmith/legacy-trace-with-vercel-ai-sdk).


        

        ```lc-tabs
        [
         {
          "label": "npm",
          "lang": "bash",
          "code": "npm install ai @ai-sdk/openai zod langsmith"
         },
         {
          "label": "yarn",
          "lang": "bash",
          "code": "yarn add ai @ai-sdk/openai zod langsmith"
         },
         {
          "label": "pnpm",
          "lang": "bash",
          "code": "pnpm add ai @ai-sdk/openai zod langsmith"
         }
        ]
        ```

        
    

## Environment configuration

```bash Shell
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=<your-api-key>

# The examples use OpenAI, but you can use any LLM provider of choice
export OPENAI_API_KEY=<your-openai-api-key>

# For LangSmith API keys linked to multiple workspaces, set the LANGSMITH_WORKSPACE_ID environment variable to specify which workspace to use.
export LANGSMITH_WORKSPACE_ID=<your-workspace-id>
```

## Basic setup

    #### Tab: AI SDK v7

        Register `LangSmithTelemetry` once, then use AI SDK methods as you normally would.

        ```typescript

        registerTelemetry(LangSmithTelemetry());

        await generateText({
            model: openai("gpt-5.5"),
            prompt: "Write a vegetarian lasagna recipe for 4 people.",
        });
        ```

        You should see a trace in your LangSmith dashboard [like this one](https://smith.langchain.com/public/4f0e689e-c801-44d3-8857-93b47ab100cc/r).

        You can also trace runs with tool calls:

        ```typescript

        registerTelemetry(LangSmithTelemetry());

        await generateText({
            model: openai("gpt-5.5"),
            messages: [
                {
                    role: "user",
                    content: "What are my orders and where are they? My user ID is 123",
                },
            ],
            tools: {
                listOrders: tool({
                    description: "list all orders",
                    inputSchema: z.object({ userId: z.string() }),
                    execute: async ({ userId }) => `User ${userId} has the following orders: 1`,
                }),
                viewTrackingInformation: tool({
                    description: "view tracking information for a specific order",
                    inputSchema: z.object({ orderId: z.string() }),
                    execute: async ({ orderId }) => `Here is the tracking information for ${orderId}`,
                }),
            },
            stopWhen: stepCountIs(5),
        });
        ```

        Which results in a trace like [this one](https://smith.langchain.com/public/6075fa2c-d255-4885-a66a-4fc798afaa9f/r).
    
    #### Tab: AI SDK v5 and v6

        Wrap the AI SDK methods once with `wrapAISDK`, then call the wrapped methods as you normally would.

        ```typescript

        const { generateText } = wrapAISDK(ai);

        await generateText({
            model: openai("gpt-5.5"),
            prompt: "Write a vegetarian lasagna recipe for 4 people.",
        });
        ```

        You can also trace runs with tool calls:

        ```typescript

        const { generateText, tool } = wrapAISDK(ai);

        await generateText({
            model: openai("gpt-5.5"),
            messages: [
                {
                    role: "user",
                    content: "What are my orders and where are they? My user ID is 123",
                },
            ],
            tools: {
                listOrders: tool({
                    description: "list all orders",
                    parameters: z.object({ userId: z.string() }),
                    execute: async ({ userId }) => `User ${userId} has the following orders: 1`,
                }),
                viewTrackingInformation: tool({
                    description: "view tracking information for a specific order",
                    parameters: z.object({ orderId: z.string() }),
                    execute: async ({ orderId }) => `Here is the tracking information for ${orderId}`,
                }),
            },
            maxSteps: 5,
        });
        ```
    

You can use other AI SDK methods exactly as you usually would.

### With `traceable`

You can wrap `traceable` calls around AI SDK calls or within AI SDK tool calls. This is useful if you want to group runs together in LangSmith.

    #### Tab: AI SDK v7

        ```typescript

        registerTelemetry(LangSmithTelemetry());

        const wrapper = traceable(
            async (input: string) => {
                const { text } = await generateText({
                    model: openai("gpt-5.5"),
                    messages: [
                        {
                            role: "user",
                            content: input,
                        },
                    ],
                    tools: {
                        listOrders: tool({
                            description: "list all orders",
                            inputSchema: z.object({ userId: z.string() }),
                            execute: async ({ userId }) => `User ${userId} has the following orders: 1`,
                        }),
                        viewTrackingInformation: tool({
                            description: "view tracking information for a specific order",
                            inputSchema: z.object({ orderId: z.string() }),
                            execute: async ({ orderId }) => `Here is the tracking information for ${orderId}`,
                        }),
                    },
                    stopWhen: stepCountIs(5),
                });
                return text;
            },
            { name: "wrapper" },
        );

        await wrapper("What are my orders and where are they? My user ID is 123.");
        ```

        The resulting trace will look [like this](https://smith.langchain.com/public/ff25bc26-9389-4798-8b91-2bdcc95d4a8e/r).
    
    #### Tab: AI SDK v5 and v6

        ```typescript

        const { generateText, tool } = wrapAISDK(ai);

        const wrapper = traceable(
            async (input: string) => {
                const { text } = await generateText({
                    model: openai("gpt-5.5"),
                    messages: [
                        {
                            role: "user",
                            content: input,
                        },
                    ],
                    tools: {
                        listOrders: tool({
                            description: "list all orders",
                            parameters: z.object({ userId: z.string() }),
                            execute: async ({ userId }) => `User ${userId} has the following orders: 1`,
                        }),
                        viewTrackingInformation: tool({
                            description: "view tracking information for a specific order",
                            parameters: z.object({ orderId: z.string() }),
                            execute: async ({ orderId }) => `Here is the tracking information for ${orderId}`,
                        }),
                    },
                    maxSteps: 5,
                });
                return text;
            },
            { name: "wrapper" },
        );

        await wrapper("What are my orders and where are they? My user ID is 123.");
        ```
    

## Tracing in serverless environments

When tracing in serverless environments, wait for all runs to flush before your environment shuts down.

    #### Tab: AI SDK v7

        Pass a LangSmith [`Client`](https://docs.smith.langchain.com/reference/js/classes/client.Client) instance to `LangSmithTelemetry`, then call `await client.awaitPendingTraceBatches()`. Make sure to also pass it into any `traceable` wrappers you create:

        ```typescript

        const client = new Client();
        const telemetry = LangSmithTelemetry({ client });

        const wrapper = traceable(
            async (input: string) => {
                const { text } = await generateText({
                    model: openai("gpt-5.5"),
                    messages: [
                        {
                            role: "user",
                            content: input,
                        },
                    ],
                    tools: {
                        listOrders: tool({
                            description: "list all orders",
                            inputSchema: z.object({ userId: z.string() }),
                            execute: async ({ userId }) => `User ${userId} has the following orders: 1`,
                        }),
                        viewTrackingInformation: tool({
                            description: "view tracking information for a specific order",
                            inputSchema: z.object({ orderId: z.string() }),
                            execute: async ({ orderId }) => `Here is the tracking information for ${orderId}`,
                        }),
                    },
                    stopWhen: stepCountIs(5),
                    telemetry: { integrations: [telemetry] },
                });
                return text;
            },
            {
                name: "wrapper",
                client,
            },
        );

        try {
            await wrapper("What are my orders and where are they? My user ID is 123.");
        } finally {
            await client.awaitPendingTraceBatches();
        }
        ```
    
    #### Tab: AI SDK v5 and v6

        Pass a LangSmith [`Client`](https://docs.smith.langchain.com/reference/js/classes/client.Client) instance to `wrapAISDK` and any `traceable` wrappers you create, then call `await client.awaitPendingTraceBatches()`:

        ```typescript

        const client = new Client();
        const { generateText, tool } = wrapAISDK(ai, { client });

        const wrapper = traceable(
            async (input: string) => {
                const { text } = await generateText({
                    model: openai("gpt-5.5"),
                    messages: [
                        {
                            role: "user",
                            content: input,
                        },
                    ],
                    tools: {
                        listOrders: tool({
                            description: "list all orders",
                            parameters: z.object({ userId: z.string() }),
                            execute: async ({ userId }) => `User ${userId} has the following orders: 1`,
                        }),
                        viewTrackingInformation: tool({
                            description: "view tracking information for a specific order",
                            parameters: z.object({ orderId: z.string() }),
                            execute: async ({ orderId }) => `Here is the tracking information for ${orderId}`,
                        }),
                    },
                    maxSteps: 5,
                });
                return text;
            },
            {
                name: "wrapper",
                client,
            },
        );

        try {
            await wrapper("What are my orders and where are they? My user ID is 123.");
        } finally {
            await client.awaitPendingTraceBatches();
        }
        ```
    

If you are using `Next.js`, there is a convenient [`after`](https://nextjs.org/docs/app/api-reference/functions/after) hook where you can put this logic:

```typescript

export async function POST(request: Request) {
    const client = new Client();
    const body = await request.json();

    after(async () => {
        await client.awaitPendingTraceBatches();
    });

    return Response.json({ ok: true, body });
}
```

See [Trace JS functions in serverless environments](lc:langsmith/serverless-environments) for more detail, including information around managing rate limits in serverless environments.

## Passing LangSmith config

You can pass LangSmith-specific config such as metadata, run names, tags, and custom client instances.

    #### Tab: AI SDK v7

        If you register the integration globally, the config applies to future AI SDK calls:

        ```typescript

        registerTelemetry(
            LangSmithTelemetry({
                metadata: { key_for_all_runs: "value" },
                tags: ["myrun"],
            }),
        );

        await generateText({
            model: openai("gpt-5.5"),
            prompt: "Write a vegetarian lasagna recipe for 4 people.",
        });
        ```

        To apply config to a single run, pass a telemetry integration in that AI SDK call:

        ```typescript

        await generateText({
            model: openai("gpt-5.5"),
            prompt: "Write a vegetarian lasagna recipe for 4 people.",
            telemetry: {
                integrations: [
                    LangSmithTelemetry({
                        metadata: { individual_key: "value" },
                        name: "my_individual_run",
                    }),
                ],
            },
        });
        ```
    
    #### Tab: AI SDK v5 and v6

        If you pass config into `wrapAISDK`, the config applies to the wrapped methods:

        ```typescript

        const { generateText } = wrapAISDK(ai, {
            metadata: { key_for_all_runs: "value" },
            tags: ["myrun"],
        });

        await generateText({
            model: openai("gpt-5.5"),
            prompt: "Write a vegetarian lasagna recipe for 4 people.",
        });
        ```

        To apply config to a single run, pass LangSmith provider options in that AI SDK call:

        ```typescript

            createLangSmithProviderOptions,
            wrapAISDK,
        } from "langsmith/experimental/vercel";

        const { generateText } = wrapAISDK(ai);

        await generateText({
            model: openai("gpt-5.5"),
            prompt: "Write a vegetarian lasagna recipe for 4 people.",
            providerOptions: {
                langsmith: createLangSmithProviderOptions<typeof ai.generateText>({
                    metadata: { individual_key: "value" },
                    name: "my_individual_run",
                }),
            },
        });
        ```
    

## Redacting data

You can customize what inputs and outputs the AI SDK sends to LangSmith by specifying custom input/output processing functions. This is useful if you are dealing with sensitive data that you would like to avoid sending to LangSmith.

Because output formats vary depending on which AI SDK method you are using, we suggest defining and passing telemetry config individually into AI SDK calls. You will also need to provide separate functions for child LLM runs within AI SDK calls, since calling `generateText` at top level calls the LLM internally and can do so multiple times.

Here's an example for `generateText`:

    #### Tab: AI SDK v7

        ```typescript

        const telemetry = LangSmithTelemetry({
            processInputs: (inputs) => {
                const messages = inputs.messages as Array<Record<string, unknown>> | undefined;
                return {
                    messages: messages?.map((message) => ({
                        providerMetadata: message.providerOptions,
                        role: "assistant",
                        content: "REDACTED",
                    })),
                    prompt: "REDACTED",
                };
            },
            processOutputs: (outputs) => {
                return {
                    providerMetadata: outputs.providerMetadata,
                    role: "assistant",
                    content: "REDACTED",
                };
            },
            processChildLLMRunInputs: (inputs) => {
                const messages = inputs.messages as Array<Record<string, unknown>> | undefined;
                return {
                    messages: messages?.map((message) => ({
                        ...message,
                        content: "REDACTED CHILD INPUTS",
                    })),
                };
            },
            processChildLLMRunOutputs: (outputs) => {
                return {
                    providerMetadata: outputs.providerMetadata,
                    content: "REDACTED CHILD OUTPUTS",
                    role: "assistant",
                };
            },
        });

        const { text } = await generateText({
            model: openai("gpt-5.5"),
            prompt: "What is the capital of France?",
            telemetry: { integrations: [telemetry] },
        });

        console.log(text);
        ```
    
    #### Tab: AI SDK v5 and v6

        ```typescript

            createLangSmithProviderOptions,
            wrapAISDK,
        } from "langsmith/experimental/vercel";

        const { generateText } = wrapAISDK(ai);

        const langsmith = createLangSmithProviderOptions<typeof ai.generateText>({
            processInputs: (inputs) => {
                return {
                    messages: inputs.messages?.map((message) => ({
                        providerMetadata: message.providerOptions,
                        role: "assistant",
                        content: "REDACTED",
                    })),
                    prompt: "REDACTED",
                };
            },
            processOutputs: () => {
                return {
                    role: "assistant",
                    content: "REDACTED",
                };
            },
            processChildLLMRunInputs: (inputs) => {
                return {
                    messages: inputs.prompt.map((message) => ({
                        ...message,
                        content: "REDACTED CHILD INPUTS",
                    })),
                };
            },
            processChildLLMRunOutputs: () => {
                return {
                    content: "REDACTED CHILD OUTPUTS",
                    role: "assistant",
                };
            },
        });

        const { text } = await generateText({
            model: openai("gpt-5.5"),
            prompt: "What is the capital of France?",
            providerOptions: { langsmith },
        });

        console.log(text);
        ```
    

The actual return value will contain the original, non-redacted result, but the trace in LangSmith will be redacted.

For redacting tool input/output, wrap your `execute` method in a `traceable` like this:

    #### Tab: AI SDK v7

        ```typescript

        const client = new Client();
        const telemetry = LangSmithTelemetry({ client });

        await generateText({
            model: openai("gpt-5.5"),
            messages: [
                {
                    role: "user",
                    content: "What are my orders? My user ID is 123.",
                },
            ],
            tools: {
                listOrders: tool({
                    description: "list all orders",
                    inputSchema: z.object({ userId: z.string() }),
                    execute: traceable(
                        async ({ userId }) => {
                            return `User ${userId} has the following orders: 1`;
                        },
                        {
                            processInputs: () => ({ text: "REDACTED" }),
                            processOutputs: () => ({ text: "REDACTED" }),
                            run_type: "tool",
                            name: "listOrders",
                        },
                    ) as (input: { userId: string }) => Promise<string>,
                }),
            },
            stopWhen: stepCountIs(5),
            telemetry: { integrations: [telemetry] },
        });

        await client.awaitPendingTraceBatches();
        ```
    
    #### Tab: AI SDK v5 and v6

        ```typescript

        const client = new Client();
        const { generateText, tool } = wrapAISDK(ai, { client });

        await generateText({
            model: openai("gpt-5.5"),
            messages: [
                {
                    role: "user",
                    content: "What are my orders? My user ID is 123.",
                },
            ],
            tools: {
                listOrders: tool({
                    description: "list all orders",
                    parameters: z.object({ userId: z.string() }),
                    execute: traceable(
                        async ({ userId }) => {
                            return `User ${userId} has the following orders: 1`;
                        },
                        {
                            processInputs: () => ({ text: "REDACTED" }),
                            processOutputs: () => ({ text: "REDACTED" }),
                            run_type: "tool",
                            name: "listOrders",
                        },
                    ) as (input: { userId: string }) => Promise<string>,
                }),
            },
            maxSteps: 5,
        });

        await client.awaitPendingTraceBatches();
        ```
    

The `traceable` return type is complex, which makes the cast necessary. You may also omit the AI SDK `tool` helper if you wish to avoid the cast.
