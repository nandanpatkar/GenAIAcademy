## What are Model Providers?

A model provider is a service or platform that hosts and serves large language models through an API. The Strands Agents SDK abstracts away the complexity of working with different providers, offering a unified interface that makes it easy to switch between models or use multiple providers in the same application.

## Supported Providers

The following table shows all model providers supported by Strands Agents SDK and their availability in Python and TypeScript:

| Provider | Python Supported | TypeScript Supported |
| --- | --- | --- |
| [Amazon Bedrock](lc:user-guide/concepts/model-providers/amazon-bedrock) | ✅ | ✅ |
| [Amazon Nova](lc:user-guide/concepts/model-providers/amazon-nova) | ✅ | ❌ |
| [Anthropic](lc:user-guide/concepts/model-providers/anthropic) | ✅ | ✅ |
| [Custom Providers](lc:user-guide/concepts/model-providers/custom_model_provider) | ✅ | ✅ |
| [Google](lc:user-guide/concepts/model-providers/google) | ✅ | ✅ |
| [LiteLLM](lc:user-guide/concepts/model-providers/litellm) | ✅ | ❌ |
| [llama.cpp](lc:user-guide/concepts/model-providers/llamacpp) | ✅ | ❌ |
| [LlamaAPI](lc:user-guide/concepts/model-providers/llamaapi) | ✅ | ❌ |
| [MistralAI](lc:user-guide/concepts/model-providers/mistral) | ✅ | ❌ |
| [Ollama](lc:user-guide/concepts/model-providers/ollama) | ✅ | ❌ |
| [OpenAI](lc:user-guide/concepts/model-providers/openai) | ✅ | ✅ |
| [OpenAI Responses API](lc:user-guide/concepts/model-providers/openai-responses) | ✅ | ✅ |
| [SageMaker](lc:user-guide/concepts/model-providers/sagemaker) | ✅ | ❌ |
| [Vercel](lc:user-guide/concepts/model-providers/vercel) | ❌ | ✅ |
| [Writer](lc:user-guide/concepts/model-providers/writer) | ✅ | ❌ |

### Community providers

The following providers are built and maintained by the Strands community. Browse the [Community Catalog](lc:community/community-packages) to explore additional community packages.

| Provider | Python Supported | TypeScript Supported |
| --- | --- | --- |
| [CLOVA Studio](lc:community/model-providers/clova-studio) | ✅ | ❌ |
| [Cohere](lc:community/model-providers/cohere) | ✅ | ❌ |
| [Fireworks AI](lc:community/model-providers/fireworksai) | ✅ | ❌ |
| [MLX](lc:community/model-providers/mlx) | ✅ | ❌ |
| [Nebius Token Factory](lc:community/model-providers/nebius-token-factory) | ✅ | ❌ |
| [NVIDIA NIM](lc:community/model-providers/nvidia-nim) | ✅ | ❌ |
| [OVHcloud AI Endpoints](lc:community/model-providers/ovhcloud-ai-endpoints) | ✅ | ❌ |
| [SGLang](lc:community/model-providers/sglang) | ✅ | ❌ |
| [vLLM](lc:community/model-providers/vllm) | ✅ | ❌ |
| [xAI](lc:community/model-providers/xai) | ✅ | ❌ |

## Getting Started

### Installation

Most providers are available as optional dependencies. Install the provider you need:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```bash\n# Install with specific provider\npip install 'strands-agents[bedrock]'\npip install 'strands-agents[openai]'\npip install 'strands-agents[anthropic]'\n\n# Or install with all providers\npip install 'strands-agents[all]'\n```"
 },
 {
  "label": "TypeScript",
  "body": "```bash\n# Core SDK includes BedrockModel by default\nnpm install @strands-agents/sdk\n\n# To use OpenAI, install the openai package\nnpm install openai\n```\n\n> **Note:** All model providers except Bedrock are listed as optional dependencies in the SDK. This means npm will attempt to install them automatically, but won\u2019t fail if they\u2019re unavailable. You can explicitly install them when needed."
 }
]
```

### Basic Usage

Each provider follows a similar pattern for initialization and usage. Models are interchangeable - you can easily switch between providers by changing the model instance:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.models.bedrock import BedrockModel\nfrom strands.models.openai import OpenAIModel\n\n# Use Bedrock\nbedrock_model = BedrockModel()\nagent = Agent(model=bedrock_model)\nresponse = agent(\"What can you help me with?\")\n\n# Alternatively, use OpenAI by just switching model provider\nopenai_model = OpenAIModel(\n    client_args={\"api_key\": \"<KEY>\"},\n    model_id=\"gpt-4o\"\n)\nagent = Agent(model=openai_model)\nresponse = agent(\"What can you help me with?\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { BedrockModel } from '@strands-agents/sdk/models/bedrock'\nimport { OpenAIModel } from '@strands-agents/sdk/models/openai'\n\n// Use Bedrock\nconst bedrockModel = new BedrockModel()\nlet agent = new Agent({ model: bedrockModel })\nlet response = await agent.invoke('What can you help me with?')\n\n// Alternatively, use OpenAI by just switching model provider\nconst openaiModel = new OpenAIModel({\n  api: 'chat',\n  apiKey: process.env.OPENAI_API_KEY,\n  modelId: 'gpt-5.4',\n})\nagent = new Agent({ model: openaiModel })\nresponse = await agent.invoke('What can you help me with?')\n```"
 }
]
```

## Next Steps

### Explore Model Providers

-   **[Amazon Bedrock](lc:user-guide/concepts/model-providers/amazon-bedrock)** - Default provider with wide model selection, enterprise features, and full Python/TypeScript support
-   **[OpenAI](lc:user-guide/concepts/model-providers/openai)** - GPT models with streaming support
-   **[Google](lc:user-guide/concepts/model-providers/google)** - Google’s Gemini models with tool calling support
-   **[Custom Providers](lc:user-guide/concepts/model-providers/custom_model_provider)** - Build your own model integration
-   **[Anthropic](lc:user-guide/concepts/model-providers/anthropic)** - Direct Claude API access
