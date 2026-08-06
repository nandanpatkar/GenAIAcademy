# HTTP passthrough targets - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-http-passthrough.html

---

# HTTP passthrough targets  
  
You can add an HTTP passthrough target to route traffic through the gateway to any HTTP endpoint. The gateway forwards requests to the target endpoint without protocol translation, acting as a secure proxy layer. This makes passthrough targets ideal for fronting agent URLs, external APIs, or any HTTP service that you want to access through the gateway’s centralized authentication, policy enforcement, and observability.

Adding an HTTP passthrough target to your gateway is useful when you want to:

  * Front agent services (such as A2A agents, external MCP servers, or custom inference endpoints) behind a single gateway endpoint with unified access control.

  * Route traffic to external services while the gateway manages inbound authentication and outbound credential injection.

  * Apply gateway policies such as guardrails and access control to requests destined for external endpoints.

  * Use path-based routing (`/{targetName}/{path}`) to reach multiple external services through a single gateway.


###### Topics

  * Target configuration

  * Creating an HTTP passthrough target

  * Invoking an HTTP passthrough target

  * Outbound authorization


## Target configuration

When you create an HTTP passthrough target, you provide the target endpoint URL and a protocol type that indicates the application protocol the target implements. The gateway uses the protocol type for observability and policy evaluation but does not perform protocol translation.

The target configuration for an HTTP passthrough target uses the following structure:

```json
{
    "http": {
        "passthrough": {
            "endpoint": "https://partner-agent.example.com",
            "protocolType": "A2A"
        }
    }
}
```
The following example shows a passthrough target with a custom protocol and an explicit API schema:

```json
{
    "http": {
        "passthrough": {
            "endpoint": "https://my-service.example.com",
            "protocolType": "CUSTOM",
            "schema": {
                "source": {
                    "s3": {
                        "uri": "s3://DOC-EXAMPLE-BUCKET/service-schema.yaml"
                    }
                }
            }
        }
    }
}
```
  * **endpoint** (required) – The HTTPS URL of the target service. The gateway forwards requests to this endpoint.

  * **protocolType** (required) – The application protocol that the target implements. Valid values:

    * `MCP` – The target is an MCP server. Use this when routing to a single MCP server that you want to access directly (not aggregated with other MCP targets).

    * `A2A` – The target implements the Agent-to-Agent (A2A) protocol.

    * `INFERENCE` – The target is an inference endpoint.

    * `CUSTOM` – The target implements a custom or proprietary protocol.

  * **schema** (optional) – The API schema that describes the passthrough target’s request and response structure. The gateway uses this schema to enable policy engine features such as guardrails. The schema format is auto-detected as either OpenAPI or Smithy.

The schema requirement depends on the protocol type:

    * For `MCP` and `A2A` protocol types, a default schema is applied automatically. You don’t need to provide a schema unless you want to override the default.

    * For `INFERENCE` protocol types with well-known providers (OpenAI, Anthropic, or Amazon Bedrock), a default schema is applied based on the endpoint domain.

    * For `CUSTOM` protocol types, you must provide a schema to use guardrails.

The `schema` object contains a `source` that specifies where the schema content is located:

    * **s3** – An S3 URI pointing to the schema file (for example, `s3://DOC-EXAMPLE-BUCKET/service-schema.yaml`).

    * **inlinePayload** – The schema content provided directly as a string.


## Creating an HTTP passthrough target

The following examples create a passthrough target that routes to different types of endpoints: an A2A agent, an external MCP server, an IAM-authenticated internal service, and an external API authenticated with an API key.

###### Example

AgentCore CLI
    

  1. Route to an A2A agent using an OAuth credential:

```bash
agentcore add gateway-target \
  --name partner-agent \
  --type passthrough \
  --passthrough-endpoint https://partner-agent.example.com \
  --passthrough-protocol A2A \
  --outbound-auth oauth \
  --credential-name partner-oauth \
  --gateway MyGateway
agentcore deploy
```
Route to an external MCP server using an OAuth credential:

```bash
agentcore add gateway-target \
  --name slack-mcp \
  --type passthrough \
  --passthrough-endpoint https://mcp-slack.example.com \
  --passthrough-protocol MCP \
  --outbound-auth oauth \
  --credential-name slack-oauth \
  --gateway MyGateway
agentcore deploy
```
Route to an internal service using IAM (SigV4) role-based authentication, with a `CUSTOM` protocol and an S3 schema:

```bash
agentcore add gateway-target \
  --name internal-service \
  --type passthrough \
  --passthrough-endpoint https://internal-service.example.com \
  --passthrough-protocol CUSTOM \
  --schema s3://amzn-s3-demo-bucket/internal-service-schema.yaml \
  --signing-service execute-api \
  --signing-region us-west-2 \
  --gateway MyGateway
agentcore deploy
```
Route to an external API using an API key credential:

```bash
agentcore add gateway-target \
  --name external-api \
  --type passthrough \
  --passthrough-endpoint https://api.example.com \
  --passthrough-protocol CUSTOM \
  --outbound-auth api-key \
  --credential-name my-api-key \
  --credential-parameter-name x-api-key \
  --gateway MyGateway
agentcore deploy
```
AWS CLI
    

  1. Route to an A2A agent using an OAuth credential:

```bash
aws bedrock-agentcore-control create-gateway-target --cli-input-json '{
    "gatewayIdentifier": "GATEWAY_ID",
    "name": "partner-agent",
    "targetConfiguration": {
        "http": {
            "passthrough": {
                "endpoint": "https://partner-agent.example.com",
                "protocolType": "A2A"
            }
        }
    },
    "credentialProviderConfigurations": [
        {
            "credentialProviderType": "OAUTH",
            "credentialProvider": {
                "oauthCredentialProvider": {
                    "providerArn": "arn:aws:bedrock-agentcore:us-west-2:111122223333:token-vault/default/oauthcredentialprovider/partner-oauth"
                }
            }
        }
    ]
}'
```
Route to an external MCP server using an OAuth credential:

```bash
aws bedrock-agentcore-control create-gateway-target --cli-input-json '{
    "gatewayIdentifier": "GATEWAY_ID",
    "name": "slack-mcp",
    "targetConfiguration": {
        "http": {
            "passthrough": {
                "endpoint": "https://mcp-slack.example.com",
                "protocolType": "MCP"
            }
        }
    },
    "credentialProviderConfigurations": [
        {
            "credentialProviderType": "OAUTH",
            "credentialProvider": {
                "oauthCredentialProvider": {
                    "providerArn": "arn:aws:bedrock-agentcore:us-west-2:111122223333:token-vault/default/oauthcredentialprovider/slack-oauth"
                }
            }
        }
    ]
}'
```
Route to an internal service using IAM role-based authentication, with a `CUSTOM` protocol and an S3 schema:

```bash
aws bedrock-agentcore-control create-gateway-target --cli-input-json '{
    "gatewayIdentifier": "GATEWAY_ID",
    "name": "internal-service",
    "targetConfiguration": {
        "http": {
            "passthrough": {
                "endpoint": "https://internal-service.example.com",
                "protocolType": "CUSTOM",
                "schema": {
                    "source": {
                        "s3": {
                            "uri": "s3://DOC-EXAMPLE-BUCKET/internal-service-schema.yaml"
                        }
                    }
                }
            }
        }
    },
    "credentialProviderConfigurations": [
        {"credentialProviderType": "GATEWAY_IAM_ROLE"}
    ]
}'
```
Route to an external API using an API key credential:

```bash
aws bedrock-agentcore-control create-gateway-target --cli-input-json '{
    "gatewayIdentifier": "GATEWAY_ID",
    "name": "external-api",
    "targetConfiguration": {
        "http": {
            "passthrough": {
                "endpoint": "https://api.example.com",
                "protocolType": "CUSTOM"
            }
        }
    },
    "credentialProviderConfigurations": [
        {
            "credentialProviderType": "API_KEY",
            "credentialProvider": {
                "apiKeyCredentialProvider": {
                    "providerArn": "arn:aws:bedrock-agentcore:us-west-2:111122223333:token-vault/default/apikeycredentialprovider/my-api-key",
                    "credentialParameterName": "x-api-key"
                }
            }
        }
    ]
}'
```
## Invoking an HTTP passthrough target

To invoke an HTTP passthrough target through the gateway, send a request to the target using path-based routing. The URL format is:

```text
https://{gatewayId}.gateway.bedrock-agentcore.{region}.amazonaws.com/{targetName}/{path}
```
The gateway forwards the request to `{endpoint}/{path}` on the target. Replace `{gatewayId}` with your gateway ID, `{region}` with the AWS Region, `{targetName}` with the target name, and `{path}` with the path to forward.

The following example sends an A2A message to a partner agent through the gateway:

```bash
curl -X POST https://gateway-id.gateway.bedrock-agentcore.us-west-2.amazonaws.com/partner-agent/invocations \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <token>" \
    -d '{
        "jsonrpc": "2.0",
        "id": "req-001",
        "method": "message/send",
        "params": {
            "message": {
                "role": "user",
                "parts": [{"kind": "text", "text": "What is the stock price of AMZN?"}],
                "messageId": "msg-001"
            }
        }
    }'
```
The following example calls an MCP server through the gateway:

```bash
curl -X POST https://gateway-id.gateway.bedrock-agentcore.us-west-2.amazonaws.com/slack-mcp/mcp \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <token>" \
    -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
```
## Outbound authorization

HTTP passthrough targets support the following outbound authorization types:

  * **IAM (SigV4)** (`GATEWAY_IAM_ROLE`) – The gateway assumes the gateway service role to sign requests to the target.

  * **OAuth** (`OAUTH`) – The gateway retrieves OAuth tokens from credential providers configured in the target through the Amazon Bedrock AgentCore identity service.

  * **Caller IAM credentials** (`CALLER_IAM_CREDENTIALS`) – The gateway uses the IAM identity and permissions of the caller to sign requests to the target using SigV4. Only available for gateways with `AWS_IAM` or `AUTHENTICATE_ONLY` authorizer type.

  * **Token passthrough** (`JWT_PASSTHROUGH`) – The gateway validates the inbound token and passes it through to the target without modification.

  * **API key** (`API_KEY`) – The gateway retrieves an API key from a credential provider configured in the token vault and injects it into outbound requests as a specified request header.



