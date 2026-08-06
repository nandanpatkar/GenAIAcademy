Use one [LangSmith API key](lc:langsmith/create-account-api-key) to call models across configured providers. Switch providers by changing the model ID, while the LLM Gateway traces every call and applies centralized governance policies.


> [!NOTE]
>
> **Beta:** The LLM Gateway is in [beta](lc:langsmith/release-stages).


## Make your first request


> [!NOTE]
>
> An administrator must [enable the gateway, add a provider secret, and grant access](lc:langsmith/llm-gateway-admin-setup) once for your workspace. After setup, developers need only a workspace-scoped LangSmith API key.


Set your key and make a standard Chat Completions request. This example assumes the workspace has an Anthropic provider secret:

```bash
export LANGSMITH_API_KEY="lsv2_..._....cbed3e"

curl https://gateway.smith.langchain.com/v1/chat/completions \
    -H "Authorization: Bearer $LANGSMITH_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model":"anthropic/claude-sonnet-4-6","messages":[{"role":"user","content":"Hello!"}]}'
```

A `200` response confirms that the gateway, your LangSmith API key, permissions, and the selected provider secret are configured correctly. For Python, TypeScript, alternative API formats, and troubleshooting, follow the [quickstart](lc:langsmith/llm-gateway-quickstart).

## What the gateway provides

- **One key, multiple providers:** Developers authenticate with a LangSmith API key instead of storing provider keys locally.
- **One request format, multiple models:** Use Chat Completions, Messages, or Responses with models across configured providers.
- **Built-in observability:** Every gateway call appears as a [LangSmith trace](lc:langsmith/llm-gateway-access).
- **Central governance:** Apply [spend limits](lc:langsmith/llm-gateway-spend-policies), [rate limits](lc:langsmith/llm-gateway-rate-limit-policies), and [data-protection policies](lc:langsmith/llm-gateway-data-protection).

## Use the standard API

Choose the request format already used by your application. The format does not limit which configured provider you can call.

| API format | Endpoint |
| --- | --- |
| OpenAI Chat Completions | `POST /v1/chat/completions` |
| Anthropic Messages | `POST /v1/messages` |
| OpenAI Responses | `POST /v1/responses` |

Set `model` to a provider-prefixed bring-your-own-key ID such as `openai/gpt-5.4-mini` or `anthropic/claude-opus-5`, or use a [Gateway Credits](lc:langsmith/llm-gateway-credits) model slug such as `moonshotai/kimi-k3`. The model ID determines the upstream route. When the selected provider uses a different native format, the gateway translates the request and response.

For base URLs, examples, translation behavior, and regional endpoints, see [API formats](lc:langsmith/llm-gateway-api-formats).

## Choose how credentials are managed

| Option | Upstream credential | Setup and billing |
| --- | --- | --- |
| Bring your own provider account | An administrator stores the provider key in workspace [Provider Secrets](lc:langsmith/llm-gateway-admin-setup#1-add-provider-secrets). | The provider bills usage to your provider account. |
| [Gateway Credits](lc:langsmith/llm-gateway-credits) | LangChain owns the upstream credential. | No provider secret is required. Invocations are billed to your LangSmith account. |

## Go further

  ### [Quickstart](#)
Make a request with cURL, Python, or TypeScript, then view its trace.

  ### [Administrator setup](#)
Enable the gateway, add provider credentials, and grant developer access.

Need provider-native request and response behavior? Use [Direct model access](lc:langsmith/llm-gateway-direct-model-access) to bypass the standardization layer. This is an advanced alternative to the standard API.

For further questions, contact [LangChain support](https://support.langchain.com).
