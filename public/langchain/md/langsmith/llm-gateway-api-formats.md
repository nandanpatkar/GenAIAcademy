The standard LLM Gateway API supports three request and response formats. Choose the format your application already uses, then call bring-your-own-key or Gateway Credits models through the same endpoint.


> [!NOTE]
>
> **Beta:** The LLM Gateway is in [beta](lc:langsmith/release-stages).


## Compare API formats

| API format | Base URL | Prompt endpoint | Compatible client |
| --- | --- | --- | --- |
| OpenAI Chat Completions | `https://gateway.smith.langchain.com/v1` | `POST /chat/completions` | OpenAI-compatible Chat Completions clients |
| Anthropic Messages | `https://gateway.smith.langchain.com` | `POST /v1/messages` | Anthropic Messages clients |
| OpenAI Responses | `https://gateway.smith.langchain.com/v1` | `POST /responses` | OpenAI-compatible Responses clients |

All formats authenticate with a workspace-scoped LangSmith API key. Pass it as the provider API key or as an `Authorization: Bearer` token.

For bring-your-own-key models, set `model` to `<provider>/<model>`, such as `openai/gpt-5.4-mini` or `anthropic/claude-sonnet-4-6`. For Gateway Credits models, pass a supported model name, such as `moonshotai/kimi-k3`.

## Use Chat Completions

Point an OpenAI-compatible client at `https://gateway.smith.langchain.com/v1`. For the full request and response schema, see the [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat).

```lc-tabs
[
 {
  "label": "cURL",
  "lang": "bash",
  "code": "curl https://gateway.smith.langchain.com/v1/chat/completions \\\n    -H \"Authorization: Bearer $LANGSMITH_API_KEY\" \\\n    -H \"Content-Type: application/json\" \\\n    -d '{\"model\":\"anthropic/claude-sonnet-4-6\",\"messages\":[{\"role\":\"user\",\"content\":\"Hello!\"}]}'"
 },
 {
  "label": "Python",
  "lang": "python",
  "code": "from openai import OpenAI\n\nclient = OpenAI(\n    base_url=\"https://gateway.smith.langchain.com/v1\",\n    api_key=os.environ[\"LANGSMITH_API_KEY\"],\n)\nresponse = client.chat.completions.create(\n    model=\"anthropic/claude-sonnet-4-6\",\n    messages=[{\"role\": \"user\", \"content\": \"Hello!\"}],\n)"
 }
]
```

## Use Messages

Point an Anthropic client at `https://gateway.smith.langchain.com`. For the full request and response schema, see the [Anthropic Messages API](https://docs.anthropic.com/en/api/messages).

```lc-tabs
[
 {
  "label": "cURL",
  "lang": "bash",
  "code": "curl https://gateway.smith.langchain.com/v1/messages \\\n    -H \"Authorization: Bearer $LANGSMITH_API_KEY\" \\\n    -H \"Content-Type: application/json\" \\\n    -d '{\"model\":\"openai/gpt-5.4-mini\",\"max_tokens\":1024,\"messages\":[{\"role\":\"user\",\"content\":\"Hello!\"}]}'"
 },
 {
  "label": "Python",
  "lang": "python",
  "code": "client = anthropic.Anthropic(\n    base_url=\"https://gateway.smith.langchain.com\",\n    api_key=os.environ[\"LANGSMITH_API_KEY\"],\n)\nmessage = client.messages.create(\n    model=\"openai/gpt-5.4-mini\",\n    max_tokens=1024,\n    messages=[{\"role\": \"user\", \"content\": \"Hello!\"}],\n)"
 }
]
```

## Use Responses

Point an OpenAI-compatible client at `https://gateway.smith.langchain.com/v1`. For the full request and response schema, see the [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses).

```lc-tabs
[
 {
  "label": "cURL",
  "lang": "bash",
  "code": "curl https://gateway.smith.langchain.com/v1/responses \\\n    -H \"Authorization: Bearer $LANGSMITH_API_KEY\" \\\n    -H \"Content-Type: application/json\" \\\n    -d '{\"model\":\"anthropic/claude-sonnet-4-6\",\"input\":\"Hello!\"}'"
 },
 {
  "label": "Python",
  "lang": "python",
  "code": "from openai import OpenAI\n\nclient = OpenAI(\n    base_url=\"https://gateway.smith.langchain.com/v1\",\n    api_key=os.environ[\"LANGSMITH_API_KEY\"],\n)\nresponse = client.responses.create(\n    model=\"anthropic/claude-sonnet-4-6\",\n    input=\"Hello!\",\n)"
 }
]
```

## Understand translation behavior

The endpoint determines the format your application sends and receives. The model ID determines the upstream provider.

- When the provider supports the selected format natively, the gateway preserves that format.
- Otherwise, the gateway translates the request into a format supported by the provider and translates the response back, including streaming responses.
- Translation can reject fields that cannot be represented in the target provider format. Use [Direct model access](lc:langsmith/llm-gateway-direct-model-access) when provider-native behavior is required.

Every request resolves the same Provider Secrets, policies, and tracing configuration regardless of format.

## List models

Call `GET /v1/models` to list models available from providers configured for the workspace and from [Gateway Credits](lc:langsmith/llm-gateway-credits). The gateway returns a single OpenAI-compatible list:

```bash
curl https://gateway.smith.langchain.com/v1/models \
    -H "Authorization: Bearer $LANGSMITH_API_KEY"
```

```json
{
  "object": "list",
  "data": [
    {"id": "openai/gpt-5.4-mini", "object": "model"},
    {"id": "fireworks/accounts/fireworks/models/glm-5p2", "object": "model"},
    {"id": "anthropic/claude-opus-5", "object": "model"},
    {"id": "moonshotai/kimi-k3", "object": "model"}
  ]
}
```

Bring-your-own-key model IDs use the form `<provider>/<model>`. Hosted models use the slug shown in the response. Pass either ID exactly as shown when making a call. A bring-your-own-key provider without a configured secret is omitted; hosted models do not require a provider secret.

## Use a regional gateway

Replace `gateway.smith.langchain.com` with the hostname for your LangSmith region:

| Region | Gateway hostname |
| --- | --- |
| GCP US | `gateway.smith.langchain.com` |
| GCP EU | `eu.gateway.smith.langchain.com` |
| GCP APAC | `apac.gateway.smith.langchain.com` |
| AWS US | `aws.gateway.smith.langchain.com` |

Keep the same path for the selected API format.

## Handle errors

| Status or symptom | Meaning |
| --- | --- |
| `400 Bad Request` | The request is malformed, the model ID is unavailable or incorrectly formatted, or the request cannot be translated. |
| `401 Unauthorized` | The LangSmith API key is missing or invalid. |
| `403 Forbidden` | The key does not have the required gateway permissions. |
| `429 Too Many Requests` | A gateway rate limit or an upstream provider rate limit was reached. |
| No models with a provider prefix appear in `GET /v1/models` | The provider may not be configured or may not have returned a model catalog. |

For setup-specific resolutions, see the [Quickstart](lc:langsmith/llm-gateway-quickstart).

## See also

- [Quickstart](lc:langsmith/llm-gateway-quickstart): make your first request and view its trace.
- [Direct model access](lc:langsmith/llm-gateway-direct-model-access): bypass format translation and use provider-native APIs.
- [Model fallbacks](lc:langsmith/llm-gateway-fallbacks): retry requests against backup models.
