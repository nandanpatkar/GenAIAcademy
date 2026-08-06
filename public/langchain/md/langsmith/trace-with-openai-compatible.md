Many LLM providers accept requests in the same format as the OpenAI API. To trace calls from these providers to LangSmith, construct an OpenAI client pointed at the provider's base URL, then wrap it with `wrap_openai` / [`wrapOpenAI`](https://reference.langchain.com/javascript/modules/langsmith.html).

Use `wrap_openai` / `wrapOpenAI` for direct API calls. Use `@traceable` when you need to trace application logic around the call or set metadata per invocation.

| | `wrap_openai` / `wrapOpenAI` | `@traceable` / `traceable` |
|---|---|---|
| Token tracking | Automatic | Requires `run_type="llm"` |
| Run type | LLM (set automatically) | Chain by default |
| Traces | The API call | The function wrapping it |
| Metadata | Client-level only (Python); client-level or per-call (TypeScript) | Per-call via `langsmith_extra` |


> [!NOTE]
>
> To trace OpenAI directly, refer to [Trace OpenAI applications](lc:langsmith/trace-openai).


## Setup

```lc-tabs
[
 {
  "label": "Python",
  "lang": "bash",
  "code": "pip install langsmith openai"
 },
 {
  "label": "npm",
  "lang": "bash",
  "code": "npm install langsmith openai"
 }
]
```

```bash
export LANGSMITH_API_KEY=<your-api-key>
export LANGSMITH_TRACING=true
```

## Trace API calls

```python Python
from langsmith import wrappers

client = wrappers.wrap_openai(
    openai.OpenAI(
        base_url="https://<provider-base-url>/v1",
        api_key=os.environ["PROVIDER_API_KEY"],
    )
)

completion = client.chat.completions.create(
    model="<provider-model-name>",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(completion.choices[0].message.content)
```

## Add metadata

#### Tab: Python

Pass `tracing_extra` when wrapping the client. The metadata applies to all calls made with that client.

```python

from langsmith import wrappers

client = wrappers.wrap_openai(
    openai.OpenAI(
        base_url="https://<provider-base-url>/v1",
        api_key=os.environ["PROVIDER_API_KEY"],
    ),
    tracing_extra={"metadata": {"environment": "production"}},
)
```

#### Tab: TypeScript

Pass options as the second argument to `wrapOpenAI` for client-level metadata, or pass [`langsmithExtra`](https://reference.langchain.com/javascript/modules/langsmith.html) per call.

```typescript

const client = wrapOpenAI(
  new OpenAI({
    baseURL: "https://<provider-base-url>/v1",
    apiKey: process.env.PROVIDER_API_KEY!,
  }),
  { metadata: { environment: "production" } }
);

// Per-call metadata
const completion = await client.chat.completions.create(
  {
    model: "<provider-model-name>",
    messages: [{ role: "user", content: "Hello!" }],
  },
  { langsmithExtra: { metadata: { request_id: "abc123" } } }
);
```

## Related guides

Some providers have dedicated setup guides that use `@traceable` or a native callback. These approaches trace at the function level rather than wrapping the client directly, or integrate with the provider's own SDK and routing layer.

- [DeepSeek](lc:langsmith/trace-deepseek): OpenAI-compatible API; guide uses `@traceable` with custom provider metadata
- [LiteLLM](lc:langsmith/trace-litellm): proxy that exposes an OpenAI-compatible endpoint; guide covers `@traceable` and LiteLLM's built-in LangSmith callback
