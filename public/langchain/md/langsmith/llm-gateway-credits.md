> [!NOTE]
>
> **Beta:** The LLM Gateway is in [beta](lc:langsmith/release-stages). APIs and features may change as we iterate.


**Gateway Credits** let you call LangChain-hosted models through the standard LLM Gateway API without setting up a provider account or key. Authenticate with only your [LangSmith API key](lc:langsmith/create-account-api-key). No [provider secret](lc:langsmith/llm-gateway-admin-setup#1-add-provider-secrets) is required.

The gateway routes each request based on its model ID. A hosted model slug such as `moonshotai/kimi-k3` uses Gateway Credits. A model ID that starts with a configured bring-your-own-key provider, such as `anthropic/claude-opus-5`, uses that provider's secret instead.

### [Base URL](#)
Point any supported client at the standard gateway API:

```text
https://gateway.smith.langchain.com/v1
```

Authenticate with your LangSmith API key as a bearer token.

For regional base URLs, see [Regional gateways](lc:langsmith/llm-gateway-api-formats#use-a-regional-gateway).

## Available models

Select a hosted model by ID in the request body. Model IDs are case-insensitive.

| Model ID | Description |
| --- | --- |
| `moonshotai/kimi-k2.6` | Kimi K2.6 by Moonshot AI. A strong general-purpose model. Powered by Fireworks Inference. |
| `moonshotai/kimi-k3` | Kimi K3 by Moonshot AI. Powered by Fireworks Inference. |

List every model available to your workspace, including configured bring-your-own-key providers and hosted models, with the standard model-list endpoint:

```bash
curl https://gateway.smith.langchain.com/v1/models \
    -H "Authorization: Bearer $LANGSMITH_API_KEY"
```

Use a returned model ID exactly as shown in the `model` field of a prompt request.

## Prerequisites

Before using Gateway Credits:

- Your organization is on a paid plan ([Developer, Plus, Startup, or Premier](lc:langsmith/pricing-plans)).
- You have a workspace-scoped [LangSmith API key](lc:langsmith/create-account-api-key) attached to a role with `gateway:invoke` and `workspaces:read` [permissions](lc:langsmith/organization-workspace-operations). See [Admin setup](lc:langsmith/llm-gateway-admin-setup) if you are unsure.

## Make a call

Point an OpenAI-compatible client at `https://gateway.smith.langchain.com/v1`, authenticate with your LangSmith API key, and set `model` to a hosted model ID.

```lc-tabs
[
 {
  "label": "cURL",
  "lang": "bash",
  "code": "curl https://gateway.smith.langchain.com/v1/chat/completions \\\n    -H \"Authorization: Bearer $LANGSMITH_API_KEY\" \\\n    -H \"Content-Type: application/json\" \\\n    -d '{\"model\":\"moonshotai/kimi-k3\",\"messages\":[{\"role\":\"user\",\"content\":\"ping\"}]}'"
 },
 {
  "label": "OpenAI SDK",
  "lang": "python",
  "code": "from openai import OpenAI\n\nclient = OpenAI(\n    base_url=\"https://gateway.smith.langchain.com/v1\",\n    api_key=os.environ[\"LANGSMITH_API_KEY\"],\n)\nresponse = client.chat.completions.create(\n    model=\"moonshotai/kimi-k3\",\n    messages=[{\"role\": \"user\", \"content\": \"ping\"}],\n)\nprint(response.choices[0].message.content)"
 },
 {
  "label": "LangChain",
  "lang": "python",
  "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\n    model=\"moonshotai/kimi-k3\",\n    model_provider=\"openai\",\n    base_url=\"https://gateway.smith.langchain.com/v1\",\n    api_key=os.environ[\"LANGSMITH_API_KEY\"],\n)\nprint(model.invoke(\"ping\").content)"
 }
]
```

## Supported endpoints

Hosted models use the same standard API formats as bring-your-own-key models:

| Method and path | Behavior |
| --- | --- |
| `POST /v1/chat/completions` | OpenAI Chat Completions, including streaming. |
| `POST /v1/messages` | Anthropic Messages, including streaming. |
| `POST /v1/responses` | OpenAI Responses. |
| `GET /v1/models` | Lists models available to the workspace. |

For request examples and translation behavior, see [API formats](lc:langsmith/llm-gateway-api-formats).

## Pricing

Gateway Credits are available on all paid plans besides Enterprise. See [the pricing page](https://www.langchain.com/pricing) for plan details and current rates. Gateway Credits are denominated in **LangChain Credit Units (LCUs)** at **$1.50 per LCU**; each call consumes LCUs based on token usage.

Standard gateway [spend policies](lc:langsmith/llm-gateway-spend-policies) apply to hosted-model traffic, so any organization, workspace, API key, or user cap you have configured also governs Gateway Credit usage. You can control Gateway Credit consumption with the same tools you use for bring-your-own-key providers. For example, cap a specific API key at $200/month across every provider, or set a workspace-wide daily limit that includes hosted-model calls.

## Tracing

Like all gateway traffic, hosted-model calls are traced to LangSmith. For where traces land and how to control access to them, see [Traces, Engine, and access control](lc:langsmith/llm-gateway-access).

## Next steps

- [Quickstart](lc:langsmith/llm-gateway-quickstart): make your first gateway-proxied call.
- [API formats](lc:langsmith/llm-gateway-api-formats): call models through Chat Completions, Messages, or Responses.
- [Spend policies](lc:langsmith/llm-gateway-spend-policies): add cost limits to Gateway Credit usage.
- [Direct model access](lc:langsmith/llm-gateway-direct-model-access): use provider-native APIs and model IDs.
