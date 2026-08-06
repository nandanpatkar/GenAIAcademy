# Configuration bundle propagation and observability - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-rules-propagation.html

---

# Configuration bundle propagation and observability

When the gateway resolves a configuration bundle through rules, it propagates the bundle to downstream services through OpenTelemetry (OTel) baggage headers. This enables end-to-end configuration management across your gateway and agent architecture.

## How configuration bundles propagate

The gateway sets the resolved bundle ARN and version in OTel baggage using the following keys:

Baggage key | Description  
---|---  
`aws.agentcore.configbundle_arn` |  The ARN of the resolved configuration bundle.  
`aws.agentcore.configbundle_version` |  The version of the resolved configuration bundle.  
  
The propagation flow works as follows:

  1. The gateway evaluates rules and resolves a configuration bundle.

  2. The gateway sets the bundle ARN and version in OTel baggage headers on the outgoing request.

  3. The agent runtime receives the request with the baggage headers. The runtime is controlled by you. Your agent code can read the configuration bundle ARN and version from the OTel baggage if needed.

  4. If the agent invokes a gateway with MCP targets, the gateway reads the bundle from the OTel baggage and applies tool description overrides on `tools/list` responses. For details, see Behavior on MCP targets.


## Behavior on MCP targets

The gateway applies configuration bundle overrides on MCP targets only for the `tools/list` path. The `invoke_tool` and `search_tool` paths do not support configuration bundle overrides.

For example, if a configuration bundle overrides a target’s tool description, the updated description appears in `tools/list` responses but not in `search_tool` responses.

To apply these overrides, the gateway calls `GetConfigurationBundleVersion` to read the bundle contents. Add this permission to the gateway’s execution role:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "bedrock-agentcore:GetConfigurationBundleVersion",
            "Resource": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/*"
        }
    ]
}
```
###### Note

This permission is only required on the gateway execution role for MCP `tools/list` operations. The agent runtime passes the bundle through without accessing it and does not need this permission.

## Constraints

  * The configuration bundle must be in the same account as the gateway. Cross-account bundle access is not supported.

  * Gateways with HTTP targets do not read configuration bundles from OTel baggage. They resolve bundles only through their own rules. If you pass a bundle in OTel baggage to a gateway with HTTP targets, the gateway ignores it.

  * Gateways with MCP targets read configuration bundles from OTel baggage and apply overrides on the `tools/list` path only.


## Observability for rule resolution

When the gateway resolves rules for a request, it emits span attributes on the gateway server span. You can use these attributes to observe which configuration bundle version and routing decisions were applied.

**Configuration bundle override attributes**

Span attribute | Description  
---|---  
`aws.agentcore.configbundle_arn` |  The ARN of the resolved configuration bundle.  
`aws.agentcore.configbundle_version` |  The version of the resolved configuration bundle.  
  
**Target routing attributes**

Span attribute | Description  
---|---  
`aws.agentcore.gateway.resolved_target_name` |  The name of the resolved target.  
  
Use these attributes to verify that rules resolve as expected and to troubleshoot routing behavior.

