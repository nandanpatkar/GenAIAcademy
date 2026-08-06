The LLM Gateway lets you call models across configured providers through one standard endpoint with one LangSmith API key. This quickstart uses the OpenAI Chat Completions format to call an Anthropic model.


> [!NOTE]
>
> **Beta:** The LLM Gateway is in [beta](lc:langsmith/release-stages).


## Prerequisites

Before you start, confirm that:

- Your [Organization admin](lc:langsmith/rbac#organization-admin) has enabled the LLM Gateway. For bring-your-own-key models, the admin must also add the provider API key to workspace secrets. To set this up, see [Admin setup](lc:langsmith/llm-gateway-admin-setup).
- You have a workspace-scoped [LangSmith API key](lc:langsmith/create-account-api-key) attached to a role with `gateway:invoke` and `workspaces:read` [permissions](lc:langsmith/organization-workspace-operations). Ask your organization admin if you are unsure.

You can call a [Gateway Credits model](lc:langsmith/llm-gateway-credits) without a provider secret. The example below uses a bring-your-own-key Anthropic model.

## 1. Set environment variables

Set the standard gateway base URL and your LangSmith API key:

```bash
export LANGSMITH_GATEWAY_BASE_URL="https://gateway.smith.langchain.com/v1"
export LANGSMITH_API_KEY="lsv2_..._....cbed3e"
```

The unified base URL accepts provider-prefixed bring-your-own-key model IDs, such as `anthropic/claude-opus-5`, and hosted model slugs, such as `moonshotai/kimi-k3`. The model ID determines the upstream route.


> [!NOTE]
>
> If your LangSmith account is on a regional instance, use the corresponding [regional gateway](lc:langsmith/llm-gateway-api-formats#use-a-regional-gateway).


To preserve a provider's native API without format translation, use a [direct provider route](lc:langsmith/llm-gateway-direct-model-access) instead.

### Using LangChain and Deep Agents

[LangChain](lc:oss/python/langchain/overview) chat models and [Deep Agents](lc:oss/python/deepagents/overview) (including [Deep Agents Code](lc:oss/deepagents/code/overview)) support the gateway through two convenience environment variables:

```bash
export LANGSMITH_GATEWAY="true"
export LANGSMITH_GATEWAY_API_KEY="$LANGSMITH_API_KEY"
```

This routes all supported chat models through the gateway at `https://gateway.smith.langchain.com`. To use a different gateway (for example, the EU instance), set its URL instead of `true`:

```bash
export LANGSMITH_GATEWAY="https://eu.gateway.smith.langchain.com"
export LANGSMITH_GATEWAY_API_KEY="$LANGSMITH_API_KEY"
```


> [!NOTE]
>
> If the gateway is enabled but `LANGSMITH_GATEWAY_API_KEY` is unset, the gateway falls back to `LANGSMITH_API_KEY`.


You can also configure base URLs and API keys for individual providers. See the following accordion for provider support and interactions with provider-specific environment variables.

### More details

- Supported in Python only.
- Supported chat models:
  - [Anthropic](lc:oss/python/integrations/chat/anthropic) (`langchain-anthropic >= 1.5.1`)
  - [Baseten](lc:oss/python/integrations/chat/baseten) (`langchain-baseten >= 0.2.3`)
  - [Fireworks](lc:oss/python/integrations/chat/fireworks) (`langchain-fireworks >= 1.5.1`)
  - [Google Gemini](lc:oss/python/integrations/chat/google_generative_ai) (`langchain-google-genai >= 4.3.2`)
  - [OpenAI](lc:oss/python/integrations/chat/openai) (`langchain-openai >= 1.4.1`).
- Provider-specific base URLs take precedence over the gateway, so you can still route an individual provider elsewhere. For example, with the gateway enabled, `OPENAI_API_BASE` sends OpenAI to that URL while every other provider continues to use the gateway:

  ```bash
  export OPENAI_API_BASE="https://my.custom.gateway/openai/v2"
  ```

The following table shows how the base URL and key are resolved, using OpenAI as the example (other providers use their own `*_API_BASE` and `*_API_KEY` variables). `GW default` is `https://gateway.smith.langchain.com/openai/v1`.

| `LANGSMITH_GATEWAY` | `LANGSMITH_GATEWAY_API_KEY` | `OPENAI_API_BASE` | `OPENAI_API_KEY` | `base_url=` kwarg | Resolved base URL | Resolved key |
|---|---|---|---|---|---|---|
| unset / `false` | — | — | — | — | `api.openai.com` | none |
| unset / `false` | ✓ | — | provider-key | — | `api.openai.com` | provider-key |
| `true` | ✓ | — | — | — | GW default | gateway-key |
| `true` | — | — | — | — | GW default | none |
| `true` | ✓ | — | provider-key | — | GW default | gateway-key |
| `true` | — | — | provider-key | — | GW default | provider-key |
| `true` | ✓ | `api.openai.com/v1` | provider-key | — | `api.openai.com/v1` | provider-key |
| `true` | ✓ | `api.openai.com/v1` | — | — | `api.openai.com/v1` | gateway-key |
| `true` | ✓ | `my.dev.gateway` | — | — | `my.dev.gateway` | gateway-key |
| `https://eu…` | ✓ | — | — | — | `eu…/openai/v1` | gateway-key |
| `https://eu…` | ✓ | — | — | `https://apac…` | `apac…` | gateway-key |
| `https://eu…` | ✓ | — | provider-key | `https://apac…` | `apac…` | provider-key |

## 2. Make a call

```lc-tabs
[
 {
  "label": "cURL",
  "lang": "bash",
  "code": "curl \"$LANGSMITH_GATEWAY_BASE_URL/chat/completions\" \\\n    -H \"Authorization: Bearer $LANGSMITH_API_KEY\" \\\n    -H \"Content-Type: application/json\" \\\n    -d '{\"model\":\"anthropic/claude-opus-5\",\"messages\":[{\"role\":\"user\",\"content\":\"ping\"}]}'"
 },
 {
  "label": "OpenAI SDK",
  "lang": "python",
  "code": "from openai import OpenAI\n\nclient = OpenAI(\n    base_url=os.environ[\"LANGSMITH_GATEWAY_BASE_URL\"],\n    api_key=os.environ[\"LANGSMITH_API_KEY\"],\n)\nresponse = client.chat.completions.create(\n    model=\"anthropic/claude-opus-5\",\n    messages=[{\"role\": \"user\", \"content\": \"ping\"}],\n)\nprint(response.choices[0].message.content)"
 },
 {
  "label": "LangChain",
  "lang": "python",
  "code": "from langchain.agents import create_agent\nfrom langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\n    model=\"anthropic/claude-opus-5\",\n    model_provider=\"openai\",\n    base_url=os.environ[\"LANGSMITH_GATEWAY_BASE_URL\"],\n    api_key=os.environ[\"LANGSMITH_API_KEY\"],\n)\nagent = create_agent(model=model, system_prompt=\"You are a helpful assistant.\")\nresult = agent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"ping\"}]})\nprint(result[\"messages\"][-1].content)"
 }
]
```

A `200` response with a chat completion confirms that the gateway, your API key, role permissions, and selected model route are working.

## 3. View your trace

Open the [LangSmith UI](https://smith.langchain.com) and navigate to the tracing project named `gateway` or `gateway-<short_api_key>-<api_key_id>` in the workspace associated with your API key. You should see a new trace for the call you just made.


> [!NOTE]
>
> If your application also emits its own LangSmith traces, for example, through [LangChain or LangGraph tracing](lc:langsmith/observability), the gateway-side trace and your application trace appear as separate runs. Linking gateway traces to the parent application run is not yet supported.


## 4. Set a spend policy (optional)

Go to **Settings → Gateway → LLM Gateway** in LangSmith to create a spend policy. For example, you can set a daily $10 cap on your API key. When the cap is reached, the gateway returns a `402` response with the message: `"Request blocked by gateway policies: R&D Spend Cap"`.

See [Spend policies](lc:langsmith/llm-gateway-spend-policies) for the full guide on policy dimensions, time windows, and conflict resolution.

## How the gateway handles requests

The gateway performs these steps for each standard endpoint request:

1. **Authenticates** the request using the LangSmith API key.
1. **Selects** a hosted model or configured bring-your-own-key provider from the model ID.
1. **Resolves** the upstream credential. Hosted models use Gateway Credits, while bring-your-own-key models use workspace Provider Secrets.
1. **Evaluates** active policies, including spend limits, PII redaction, and secrets redaction.
1. **Translates** the request and response when the selected provider uses a different API format.
1. **Traces** the call to LangSmith, including token counts, cost, and policy events.

## Next steps

- [Set up coding agents](lc:langsmith/llm-gateway-coding-agents): route Claude Code, Codex, Gemini CLI, or Deep Agents Code through the gateway.
- [API formats](lc:langsmith/llm-gateway-api-formats): use Chat Completions, Messages, or Responses through the standard endpoint.
- [Direct model access](lc:langsmith/llm-gateway-direct-model-access): use provider-native request and response formats.
- [Spend policies](lc:langsmith/llm-gateway-spend-policies): configure cost limits across your organization.
- [Data protection](lc:langsmith/llm-gateway-data-protection): prevent sensitive data from reaching providers.
