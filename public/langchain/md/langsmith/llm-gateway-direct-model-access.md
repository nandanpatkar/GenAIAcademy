> [!NOTE]
>
> **Beta:** The LLM Gateway is in [beta](lc:langsmith/release-stages).


Direct model access exposes each provider API through a provider-specific gateway path. The gateway still handles authentication, provider secrets, policies, and tracing, but it does not translate the request and response into another provider's API format.

Prefer [standard model access](lc:langsmith/llm-gateway-quickstart) for model calls across providers. Use direct model access when you want to access a provider's API directly, preserve its native request and response behavior, and avoid the gateway's standardization layer.

## Choose a provider path

Append a provider path to your regional gateway base URL:

| Provider | Gateway path | Secret name |
| --- | --- | --- |
| Anthropic | `/anthropic` | `ANTHROPIC_API_KEY` |
| AWS Bedrock | `/bedrock` | `AWS_BEARER_TOKEN_BEDROCK` |
| Baseten | `/baseten` | `BASETEN_API_KEY` |
| Fireworks | `/fireworks` | `FIREWORKS_API_KEY` |
| Google Gemini | `/gemini` | `GOOGLE_API_KEY` |
| Google Vertex AI | `/vertex` | `VERTEX_SERVICE_ACCOUNT_JSON` |
| OpenAI | `/openai` | `OPENAI_API_KEY` |

[Gateway Credits models](lc:langsmith/llm-gateway-credits) use the standard endpoint rather than a provider-specific path. These hosted models require no provider secret of your own.

## Configure provider SDKs

Set each provider SDK's base URL to its direct gateway path and use your LangSmith API key as the provider API key:

```bash
export LANGSMITH_API_KEY="lsv2_..._....cbed3e"
export BASE_URL="https://gateway.smith.langchain.com"

export ANTHROPIC_BASE_URL="$BASE_URL/anthropic"
export OPENAI_BASE_URL="$BASE_URL/openai/v1"
export GOOGLE_GEMINI_BASE_URL="$BASE_URL/gemini"

export ANTHROPIC_API_KEY="$LANGSMITH_API_KEY"
export OPENAI_API_KEY="$LANGSMITH_API_KEY"
export GEMINI_API_KEY="$LANGSMITH_API_KEY"
export GOOGLE_API_KEY="$LANGSMITH_API_KEY"
```

The gateway resolves the actual provider key from your workspace's Provider Secrets, so the provider key does not need to be stored locally.

```lc-tabs
[
 {
  "label": "OpenAI SDK",
  "lang": "python",
  "code": "from openai import OpenAI\n\nclient = OpenAI(\n    base_url=os.environ[\"OPENAI_BASE_URL\"],\n    api_key=os.environ[\"LANGSMITH_API_KEY\"],\n)\nresponse = client.chat.completions.create(\n    model=\"gpt-4o-mini\",\n    messages=[{\"role\": \"user\", \"content\": \"ping\"}],\n)\nprint(response.choices[0].message.content)"
 },
 {
  "label": "Anthropic SDK",
  "lang": "python",
  "code": "client = anthropic.Anthropic(\n    base_url=os.environ[\"ANTHROPIC_BASE_URL\"],\n    api_key=os.environ[\"LANGSMITH_API_KEY\"],\n)\nmessage = client.messages.create(\n    model=\"claude-sonnet-4-6\",\n    max_tokens=1024,\n    messages=[{\"role\": \"user\", \"content\": \"ping\"}],\n)\nprint(message.content[0].text)"
 }
]
```

Direct paths use the provider's native model name without a provider prefix.

## Configure LangChain and Deep Agents

[LangChain](lc:oss/python/langchain/overview) chat models and [Deep Agents](lc:oss/python/deepagents/overview), including [Deep Agents Code](lc:oss/deepagents/code/overview), support direct gateway paths through two convenience environment variables:

```bash
export LANGSMITH_GATEWAY="true"
export LANGSMITH_GATEWAY_API_KEY="$LANGSMITH_API_KEY"
```

This routes supported chat models through their provider-specific paths at `https://gateway.smith.langchain.com`. To use a regional gateway, set its URL instead of `true`:

```bash
export LANGSMITH_GATEWAY="https://eu.gateway.smith.langchain.com"
export LANGSMITH_GATEWAY_API_KEY="$LANGSMITH_API_KEY"
```

### Supported models and configuration precedence

- Supported in Python only.
- Supported chat models:
  - [Anthropic](lc:oss/python/integrations/chat/anthropic) (`langchain-anthropic >= 1.5.1`)
  - [Baseten](lc:oss/python/integrations/chat/baseten) (`langchain-baseten >= 0.2.3`)
  - [Fireworks](lc:oss/python/integrations/chat/fireworks) (`langchain-fireworks >= 1.5.1`)
  - [Google Gemini](lc:oss/python/integrations/chat/google_generative_ai) (`langchain-google-genai >= 4.3.2`)
  - [OpenAI](lc:oss/python/integrations/chat/openai) (`langchain-openai >= 1.4.1`)
- Provider-specific base URLs take precedence over the gateway setting. For example, `OPENAI_API_BASE` sends OpenAI to that URL while every other supported provider continues to use the gateway.

## Use a regional gateway

If your LangSmith account is on a regional instance, use the corresponding [regional gateway](lc:langsmith/llm-gateway-api-formats#use-a-regional-gateway) and append the provider path. For example, use `https://eu.gateway.smith.langchain.com/anthropic` for direct Anthropic access in GCP EU.

## See also

- [Quickstart](lc:langsmith/llm-gateway-quickstart): use the standard API to call models across providers.
- [Admin setup](lc:langsmith/llm-gateway-admin-setup): configure provider secrets and access.
- [Traces, Engine, and access control](lc:langsmith/llm-gateway-access): see where gateway traces appear and who can view them.
