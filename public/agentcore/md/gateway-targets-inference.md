# Inference targets - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-targets-inference.html

---

# Inference targets

You can add inference targets to your gateway to route LLM traffic to model providers. The gateway acts as a unified LLM proxy layer, allowing clients to connect to a single endpoint and route requests to the correct model provider based on the model specified in the request. Inference targets provide model-based routing, credential abstraction, and centralized governance for LLM traffic across multiple providers.

Adding inference targets to your gateway is useful when you want to:

  * Provide a single endpoint that routes to multiple model providers (such as Amazon Bedrock, OpenAI, Anthropic, or other OpenAI-compatible services) without requiring clients to manage provider-specific configurations.

  * Abstract credential management so that clients authenticate to the gateway while the gateway authenticates to providers on their behalf.

  * Apply centralized governance through Amazon Bedrock Guardrails and Amazon Bedrock AgentCore Policy consistently across all LLM calls regardless of provider.

  * Use OpenAI SDK or Anthropic SDK directly with the gateway endpoint, switching between models by changing the model string.

  * List available models across all configured providers through a single aggregated endpoint.


Inference targets use the `inference` key in the target configuration. You can configure an inference target in one of two ways:

  * **Connector** – Zero-configuration setup for supported model providers. Recommended for most use cases.

  * **Provider** – Explicit control over the endpoint, model mappings, and operations. Use when you need to customize routing behavior.


The following topics describe each configuration type in detail.

###### Topics

  * [Inference connector targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-inference-connector.html>)

  * [Inference provider targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-inference-provider.html>)



