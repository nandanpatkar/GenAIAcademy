# Session stickiness for weighted rules - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-rules-session-stickiness.html

---

# Session stickiness for weighted rules

When you use weighted rules for A/B testing or canary deployments, you want each session to receive a consistent experience across multiple requests. Without session stickiness, a session could receive different configuration bundles or route to different targets on each request. Routing to a different target means a new agent runtime with no context from previous requests, which breaks the user experience.

To solve this, the gateway supports session stickiness. When you include a session ID in your requests, the gateway stores the routing decision from the first request and reuses it for all subsequent requests in the same session.

## How session stickiness works

The gateway identifies a session by extracting a session ID from each request. The stickiness flow works as follows:

  1. On the first request with a session ID, the gateway selects a variant based on the configured weights and stores the decision.

  2. Subsequent requests with the same session ID reuse the stored decision without re-evaluating weights.

  3. Requests without a session ID are evaluated independently with no stickiness.


How the gateway determines the session ID depends on the target type:

  * **AgentCore Runtime targets** – The gateway uses the `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id` header. The header value must be a minimum of 33 characters. You do not need to send this header on the first request. If the header is absent, the agent runtime auto-generates a session ID, and the gateway uses that auto-generated session ID for stickiness on subsequent requests if you include it.

  * **HTTP passthrough targets** – By default, the gateway uses the `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id` header. You can also configure a custom session identifier and timeout on the target, so passthrough clients that use their own session header do not have to adopt the runtime session header. For more information, see Configure session stickiness for passthrough targets.


## Configure session stickiness for passthrough targets

For HTTP passthrough targets, you can set an optional `stickinessConfiguration` in the target configuration to control how the gateway identifies sessions and how long session affinity lasts. This is useful when your clients already send their own session header and you don’t want to require them to also send the standard runtime session header.

The `stickinessConfiguration` object contains:

  * **identifier** (required) – An expression that tells the gateway where to find the session ID in the request. Currently, the gateway can resolve the session ID only from a request header. You can specify the header in either of these forms:

    * A plain HTTP header name, such as `x-session-id`. The gateway reads the session ID from that request header.

    * A context path expression of the form `$.AMZN_AC_GW_CONTEXT.headers.{header-name}`, such as `$.AMZN_AC_GW_CONTEXT.headers.x-session-id`.

Only the `headers` source is supported today. Other sources (for example, a JWT claim) are not currently available.

  * **timeout** (optional) – The session affinity timeout, in seconds, from 1 to 86400 (24 hours). After this duration of inactivity, the session affinity expires. The window resets on each request (sliding window).


When a target has a `stickinessConfiguration`, the gateway resolves the session ID from the configured `identifier`.

The following example creates a passthrough target with a `stickinessConfiguration` that extracts the session ID from a custom `x-session-id` header and expires session affinity after 8 hours (28800 seconds):

```bash
aws bedrock-agentcore-control create-gateway-target --cli-input-json '{
    "gatewayIdentifier": "GATEWAY_ID",
    "name": "my-passthrough-target",
    "targetConfiguration": {
        "http": {
            "passthrough": {
                "endpoint": "https://my-service.example.com",
                "protocolType": "CUSTOM",
                "stickinessConfiguration": {
                    "identifier": "$.AMZN_AC_GW_CONTEXT.headers.x-session-id",
                    "timeout": 28800
                }
            }
        }
    },
    "credentialProviderConfigurations": [
        {"credentialProviderType": "GATEWAY_IAM_ROLE"}
    ]
}'
```
For more information about passthrough targets, see [HTTP passthrough targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-http-passthrough.html>).

## Important behaviors

**Stored decisions take precedence over rule changes.** If you update a rule, existing sessions continue with the original decision. This ensures session consistency. To apply new rules to a session, start a new session with a new session ID.

**Sessions expire after a period of inactivity.** The expiration window resets on each request (sliding window). For AgentCore Runtime targets, sessions expire after 15 days of inactivity. For HTTP passthrough targets, the expiration window is the `timeout` you set in the target’s `stickinessConfiguration` (1 to 86400 seconds); if you don’t set a timeout, the default applies. After a session expires, use a new session ID for new sessions to avoid unexpected routing behavior. We recommend that you do not reuse expired session IDs.

**Session state is scoped per target.** Different targets maintain independent session state.

**Supported for AgentCore Runtime and HTTP passthrough targets.** Session stickiness is not supported for MCP targets.

