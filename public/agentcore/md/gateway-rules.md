# Add rules to a gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-rules.html

---

# Add rules to a gateway

Gateway rules let you control traffic routing and override target configurations on your gateway without redeploying targets. You create [configuration bundles](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./configuration-bundles.html>) that override a target’s behavior, then use rules to control which bundle version applies to which traffic. Rules also support routing requests to different targets based on request path or caller identity.

Use gateway rules to accomplish the following goals:

  * Experiment with configuration bundle versions through A/B testing

  * Pin specific principals to a configuration bundle version for debugging

  * Route traffic to specific targets based on request path or caller identity

  * Set a default configuration bundle or target for all traffic


## How gateway rules work

Each gateway rule contains the following components:

Component | Description  
---|---  
Priority |  An integer from 1 to 1,000,000. Lower numbers indicate higher precedence. Each priority value must be unique within a gateway.  
Conditions (optional) |  Criteria that determine whether the rule matches a request. A rule without conditions acts as a catch-all that matches all traffic.  
Actions (required) |  The action to take when the rule matches. You can override configuration bundles, route to specific targets, or both.  
Description (optional) |  A text description of the rule’s purpose.  
  
## Rule resolution

The gateway evaluates rules in ascending priority order (lower numbers first). The gateway resolves each action type independently using first-match semantics.

The following table shows how the gateway resolves rules for a sample request. In this example, the QA role sends a request to `/my-target-canary/chat`.

Priority | Conditions | Actions | Matches request? | Result  
---|---|---|---|---  
100 |  QA role |  `configurationBundle`: bundle version A |  Yes |  Resolves `configurationBundle` to version A  
200 |  Path `/my-target-canary/*` |  `routeToTarget`: `my-target-canary` |  Yes |  Resolves `routeToTarget` to `my-target-canary`  
1000000 |  None (catch-all) |  `configurationBundle`: bundle version B, `routeToTarget`: `my-target-primary` |  Yes |  Both action types already resolved. Skipped.  
  
**Final result:** The request uses bundle version A and routes to `my-target-canary`.

###### Tip

Leave gaps between priority numbers (for example, 100, 200, 300) so that you can insert rules later without renumbering existing rules.

## Conditions

Conditions determine which requests a rule matches. A rule can have a maximum of 2 conditions. A rule with no conditions matches all traffic.

The gateway supports the following condition types:

**matchPrincipals**
    

Matches requests based on the caller’s IAM principal. The `anyOf` list contains 1 to 100 entries. Each entry specifies an `iamPrincipal` with the following fields:

  * `arn` — The IAM principal ARN to match.

  * `operator` (optional) — The comparison operator. Valid values are `StringEquals` (default) and `StringLike`. Use `StringLike` for wildcard matching.


**matchPaths**
    

Matches requests based on the request path. The `anyOf` list contains 1 to 10 entries. Each entry must use the format `/<targetName>/*`, where `<targetName>` matches the name of an existing HTTP target on the gateway. The target must be in `Ready` state. The `matchPaths` condition is supported only for gateways with HTTP targets. The following reserved path prefixes are not allowed: `/mcp`, `/a2a`, `/responses`, `/converse`, `/.well-known`.

**Condition evaluation logic**

  * **Within a condition type:** The gateway uses OR logic. A request matches if it satisfies any entry in the `anyOf` list.

  * **Across condition types:** The gateway uses AND logic. If a rule has both `matchPrincipals` and `matchPaths`, the request must match at least one entry from each condition type.


## Actions

Actions define what the gateway does when a rule matches. A rule can have a maximum of 2 actions.

The gateway supports the following action types:

**Configuration bundle overrides (`configurationBundle`)**
    

Override the [configuration bundle](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./configuration-bundles.html>) applied to matching traffic.

  * `staticOverride` — Pins all matching traffic to a specific configuration bundle version. Specify the bundle ARN and version ID.

  * `weightedOverride` — Splits traffic between two configuration bundle versions. The `trafficSplit` list must contain exactly 2 entries with weights that sum to 100. The configuration bundle must be in the same account as the gateway.


**Target routing (`routeToTarget`)**
    

Routes matching traffic to a specific target. The target must use the HTTP protocol and be in `Ready` state.

  * `staticRoute` — Routes all matching traffic to a specific target by name.

  * `weightedRoute` — Splits traffic between two targets. The `trafficSplit` list must contain exactly 2 entries with weights that sum to 100. Traffic split entry names must be unique.


## Limits

The following table lists the limits for gateway rules.

Resource | Limit  
---|---  
Rules per gateway |  20  
Priority range |  1 to 1,000,000  
Maximum conditions per rule |  2  
Maximum actions per rule |  2  
`matchPrincipals.anyOf` maximum entries |  100  
`matchPaths.anyOf` maximum entries |  10  
`trafficSplit` entries |  Exactly 2  
`trafficSplit` weight range |  1 to 99  
  
###### Topics



