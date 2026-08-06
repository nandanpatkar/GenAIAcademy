# Inference provider targets - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-inference-provider.html

---

# Inference provider targets

Inference provider targets give you explicit control over the endpoint, model mappings, and operations for a model provider. Use a provider configuration when you need to customize which models are available, set per-model token limits, configure path rewriting, or connect to a provider that doesn’t have a built-in connector.

###### Topics

  * Target configuration

  * Creating a provider inference target

  * Invoking a provider inference target

  * Model-based routing

  * Streaming

  * Outbound authorization


## Target configuration

The target configuration for an inference provider target uses the following structure:

```json
{
    "inference": {
        "provider": {
            "endpoint": "https://api.openai.com",
            "operations": [
                {
                    "path": "/v1/chat/completions",
                    "models": [
                        {"model": "gpt-5.5"},
                        {"model": "gpt-5.4"},
                        {"model": "gpt-5.4-mini"}
                    ]
                },
                {
                    "path": "/v1/responses",
                    "models": [
                        {"model": "gpt-5.5"},
                        {"model": "gpt-5.4"}
                    ]
                }
            ]
        }
    }
}
```
  * **endpoint** (required) – The HTTPS URL of the model provider.

  * **modelMapping** (optional) – Model ID translation configuration.

    * **providerPrefix** (optional) – Configures how clients can omit the provider prefix from model IDs. If omitted, no prefix translation is applied and clients must use the provider’s full model IDs.

      * **strip** (optional) – When `true`, clients can use model IDs without the provider prefix (for example, `claude-opus-4-7` instead of `anthropic.claude-opus-4-7`). Defaults to `false`.

      * **separator** (optional) – The separator character between the provider prefix and the model name (for example, `.`).

  * **operations** (optional) – A list of operation configurations that map request paths to supported models:

    * **path** (required) – The request path for this operation (for example, `/v1/chat/completions`).

    * **providerPath** (optional) – The path to forward to on the provider if it differs from the request path.

    * **models** (optional) – The models supported for this operation. Each entry includes a **model** field (required) containing a model ID or glob pattern (for example, `anthropic.claude-opus-*`).


## Creating a provider inference target

The following example creates an OpenAI inference target using a provider configuration:

```bash
aws bedrock-agentcore-control create-gateway-target --cli-input-json '{
    "gatewayIdentifier": "GATEWAY_ID",
    "name": "openai",
    "targetConfiguration": {
        "inference": {
            "provider": {
                "endpoint": "https://api.openai.com",
                "operations": [
                    {
                        "path": "/v1/chat/completions",
                        "models": [
                            {"model": "gpt-5.5"},
                            {"model": "gpt-5.4"},
                            {"model": "gpt-5.4-mini"}
                        ]
                    },
                    {
                        "path": "/v1/responses",
                        "models": [
                            {"model": "gpt-5.5"},
                            {"model": "gpt-5.4"}
                        ]
                    }
                ]
            }
        }
    },
    "credentialProviderConfigurations": [
        {
            "credentialProviderType": "API_KEY",
            "credentialProvider": {
                "apiKeyCredentialProvider": {
                    "providerArn": "arn:aws:bedrock-agentcore:us-west-2:111122223333:token-vault/default/apikeycredentialprovider/openai-key",
                    "credentialLocation": "HEADER",
                    "credentialParameterName": "Authorization",
                    "credentialPrefix": "Bearer "
                }
            }
        }
    ]
}'
```
The following example creates a Bedrock inference target with explicit provider configuration and model mapping. The `modelMapping` configuration with `providerPrefix` allows clients to use short model names (like `claude-opus-4-7`) while the gateway translates them to provider-prefixed names (like `anthropic.claude-opus-4-7`):

```bash
aws bedrock-agentcore-control create-gateway-target --cli-input-json '{
    "gatewayIdentifier": "GATEWAY_ID",
    "name": "bedrock",
    "targetConfiguration": {
        "inference": {
            "provider": {
                "endpoint": "https://bedrock-mantle.us-east-1.api.aws",
                "modelMapping": {
                    "providerPrefix": {"strip": true, "separator": "."}
                },
                "operations": [
                    {
                        "path": "/v1/chat/completions",
                        "models": [
                            {"model": "anthropic.claude-opus-*"},
                            {"model": "anthropic.claude-sonnet-*"},
                            {"model": "openai.gpt-oss-*"}
                        ]
                    },
                    {
                        "path": "/v1/messages",
                        "providerPath": "/anthropic/v1/messages",
                        "models": [
                            {"model": "anthropic.claude-opus-*"},
                            {"model": "anthropic.claude-sonnet-*"}
                        ]
                    }
                ]
            }
        }
    },
    "credentialProviderConfigurations": [
        {"credentialProviderType": "GATEWAY_IAM_ROLE"}
    ]
}'
```
## Invoking a provider inference target

To invoke an inference target, send requests to the gateway’s `/inference` path. The gateway routes each request to the correct target based on the `model` field in the request body. The `model` value can be either a plain model ID (for example, `gpt-5.5`) or a target-qualified model ID in the form `{targetName}/{modelId}` (for example, `openai/gpt-5.5`). For details on how the `model` value is matched to a target, see Model-based routing.

The URL format is:

```text
https://{gatewayId}.gateway.bedrock-agentcore.{region}.amazonaws.com/inference/{path}
```
Replace `{path}` with the inference operation path (for example, `v1/chat/completions`, `v1/responses`, or `v1/messages`).

### Using the OpenAI SDK

Set the gateway’s `/inference/v1` path as the `base_url`:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://<gateway-id>.gateway.bedrock-agentcore.us-west-2.amazonaws.com/inference/v1",
    api_key="<gateway-auth-token>"
)

response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": "Hello!"}]
)
```
### Using the Anthropic SDK

Set the gateway’s `/inference` path as the `base_url`:

```python
import anthropic

client = anthropic.Anthropic(
    base_url="https://<gateway-id>.gateway.bedrock-agentcore.us-west-2.amazonaws.com/inference",
    api_key="<gateway-auth-token>"
)

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
```
### Using awscurl

```text
awscurl --service bedrock-agentcore --region us-west-2 -X POST \
    "https://<gateway-id>.gateway.bedrock-agentcore.us-west-2.amazonaws.com/inference/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -d '{"model": "gpt-5.5", "messages": [{"role": "user", "content": "Hello!"}]}'
```
### Qualified model routing

When multiple targets serve the same model, prefix the model ID with the target name to route to a specific provider:

```bash
# Route explicitly to the "bedrock" target
response = client.chat.completions.create(
    model="bedrock/claude-opus-4-7",
    messages=[{"role": "user", "content": "Hello!"}]
)
```
## Model-based routing

The gateway routes inference requests based on the `model` field in the request body:

  1. **Qualified routing** – If the model ID contains a `/` and the prefix matches a target name, the request is routed to that target (for example, `openai/gpt-5.5` routes to the `openai` target).

  2. **Unqualified routing** – If the model ID does not contain a `/`, the gateway matches it against all configured targets. An exact match takes priority over glob patterns. If exactly one target matches, the request is routed to it.

  3. **Collision handling** – When multiple targets match the same model at the same specificity, the gateway defaults to the Amazon Bedrock target if one is among the matches. Otherwise, it distributes requests across the matching targets in round-robin order. To pin requests to a specific target, qualify the model with the target name as a prefix (for example, `bedrock/claude-opus-4-7`).


## Streaming

Streaming follows the OpenAI SSE convention. Set `"stream": true` in the request body, and the gateway passes through the SSE stream from the provider without transformation:

```python
stream = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": "Write a story."}],
    stream=True
)

for chunk in stream:
    print(chunk.choices[0].delta.content, end="")
```
## Outbound authorization

Inference provider targets support the following outbound authorization types:

  * **IAM (SigV4)** – Use `GATEWAY_IAM_ROLE` for providers that accept IAM authentication (such as Amazon Bedrock).

  * **API key** – Use `API_KEY` for providers that require an API key (such as OpenAI and Anthropic). The gateway injects the stored API key into outbound requests.



