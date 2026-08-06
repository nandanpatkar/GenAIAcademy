# Protecting your gateway with AWS WAF - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-waf.html

---

# Protecting your gateway with AWS WAF

You can use AWS WAF with Amazon Bedrock AgentCore Gateway to protect your gateway from web exploits, bot traffic, and volumetric attacks. AWS WAF provides an inline security layer that evaluates all inbound requests before they reach your targets.

When you associate an AWS WAF web access control list (web ACL) with your gateway, AWS WAF inspects every inbound request and applies the rules you configure. Requests that match a block rule are rejected before they reach any target. You associate a web ACL at the gateway level, with one web ACL per gateway.

## How AWS WAF works with your gateway

When you associate a web ACL with your gateway, the following request flow occurs:

  1. A client sends a request to your gateway endpoint.

  2. AWS WAF evaluates the request against the rules in the associated web ACL.

  3. If the request is allowed, the gateway routes it to the appropriate target.

  4. If the request is blocked, the gateway returns an error to the client without forwarding the request.


AWS WAF evaluates every inbound request inline. When no web ACL is associated with your gateway, there is zero overhead and no AWS WAF evaluation occurs.

## Prerequisites

Before you associate a web ACL with your gateway, ensure that you meet the following requirements:

  * Your AWS WAF web ACL must exist in the same AWS Region as your gateway.

  * You must use a regional web ACL. CloudFront (global) web ACLs are not supported.

  * Your gateway must be in `READY` state.

  * Your IAM identity must have the following permissions:

    * `wafv2:AssociateWebACL`

    * `wafv2:DisassociateWebACL`

    * `wafv2:GetWebACLForResource`

    * `wafv2:ListResourcesForWebACL`

    * `bedrock-agentcore:GatewayAssociateWebACL`

    * `bedrock-agentcore:GatewayDisassociateWebACL`

    * `bedrock-agentcore:GatewayGetWebACLForResource`

    * `bedrock-agentcore:GatewayListResourcesForWebACL`


## Associating a web ACL with your gateway

You can associate a web ACL with your gateway by using the AWS WAF console or the AWS CLI. One gateway can have at most one web ACL. However, one web ACL can be associated with multiple gateways. To change the web ACL associated with your gateway, associate a new web ACL. The new association replaces the existing one.

To associate a web ACL with your gateway by using the AWS CLI, run the following command:

```bash
aws wafv2 associate-web-acl \
    --web-acl-arn arn:aws:wafv2:us-east-1:123456789012:regional/webacl/my-web-acl/a1b2c3d4-5678-90ab-cdef-example11111 \
    --resource-arn arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/my-gateway-id
```
Replace the ARN values with your web ACL ARN and gateway ARN.

## Disassociating a web ACL from your gateway

To remove AWS WAF protection from your gateway, disassociate the web ACL. You must disassociate any web ACL from your gateway before you can delete the gateway.

To disassociate a web ACL from your gateway by using the AWS CLI, run the following command:

```bash
aws wafv2 disassociate-web-acl \
    --resource-arn arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/my-gateway-id
```
Replace the ARN value with your gateway ARN.

## Configuring the AWS WAF failure mode

If AWS WAF is unreachable or times out during request evaluation, the gateway uses the configured failure mode to determine whether to block or allow the request.

`FAIL_CLOSE`
    

The gateway blocks the request. This is the default behavior.

`FAIL_OPEN`
    

The gateway allows the request through to the target without AWS WAF evaluation.

To configure the failure mode, use the `UpdateGateway` API with the `wafConfiguration` parameter:

```bash
aws bedrock-agentcore-control update-gateway \
    --gateway-identifier my-gateway-id \
    --name my-gateway \
    --role-arn arn:aws:iam::123456789012:role/my-gateway-service-role \
    --authorizer-type CUSTOM_JWT \
    --authorizer-configuration '{
      "customJWTAuthorizer": {
        "discoveryUrl": "https://cognito-idp.us-east-1.amazonaws.com/my-user-pool/.well-known/openid-configuration",
        "allowedClients": ["clientId"]
      }
    }' \
    --waf-configuration '{"failureMode": "FAIL_OPEN"}'
```
###### Important

The default failure mode is `FAIL_CLOSE`, which provides a security-first approach. Use `FAIL_OPEN` only when availability is more critical than security for your workload.

## AWS WAF response handling

When AWS WAF blocks a request, the error response depends on your target type:

MCP targets
    

Blocked requests return a JSON-RPC error with code `-32002` and the message `"Authorization error - Request forbidden"`.

HTTP and passthrough targets
    

Blocked requests return HTTP 403.

If AWS WAF times out with `FAIL_CLOSE` configured, the gateway returns the same error as a blocked request. If AWS WAF returns a 5xx error, MCP targets receive a JSON-RPC error with code `-32603` and the message `"Internal error - Server error"`.

## Monitoring AWS WAF activity

You can monitor AWS WAF activity for your gateway by using Amazon CloudWatch metrics.

The following metrics are available in the `AWS/Bedrock-AgentCore` namespace:

Metric | Description  
---|---  
`WafBlocks` |  The count of requests blocked by AWS WAF, including both default and custom block responses.  
`WafFailOpens` |  The count of requests where AWS WAF was unreachable and the gateway’s failure mode is `FAIL_OPEN`, so the request was forwarded to the target without AWS WAF evaluation. Sustained non-zero values indicate your gateway is letting traffic through without AWS WAF inspection.  
`WafFailCloses` |  The count of requests where AWS WAF was unreachable and the gateway’s failure mode is `FAIL_CLOSE`, so the request was rejected. Sustained non-zero values indicate your gateway is dropping traffic due to AWS WAF unreachability.  
  
To get rule-level detail about blocked requests, use AWS WAF logging. You can correlate the request ID in your gateway logs with AWS WAF logs.

## Quotas and limitations

The following quotas and limitations apply to AWS WAF integration with your gateway:

  * Maximum of 100 web ACL associations per account.

  * AWS WAF association is at the gateway level only, not per-target. To apply different rules to different targets, use URI path-based AWS WAF rules.

  * AWS WAF integration is available in AWS Regions where both AWS WAF and AgentCore Gateway are available.


## Best practices

We recommend the following practices when using AWS WAF with your gateway:

  * Use AWS Managed Rules rule groups for common protections against known threats.

  * Implement rate-based rules to protect against volumetric attacks.

  * Use IP-based rules to allowlist or denylist known sources.

  * Test AWS WAF rules in `COUNT` mode before switching to `BLOCK` to understand the impact on your traffic.

  * Monitor the `WafBlocks`, `WafFailOpens`, and `WafFailCloses` metrics to tune your rules and identify issues.

  * Use the default `FAIL_CLOSE` mode for security-sensitive workloads. Use `FAIL_OPEN` only when availability is critical and you have other security controls in place.



