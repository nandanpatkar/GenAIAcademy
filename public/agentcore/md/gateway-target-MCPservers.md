# MCP servers targets - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html

---

# MCP servers targets

MCP servers provide local tools, data access, or custom functions for your interactions with models and agents in Bedrock AgentCore. In Bedrock AgentCore, you can define a preconfigured MCP server as a target when creating a gateway.

MCP servers host tools, prompts, and resources that agents can discover and use. In Bedrock AgentCore, you use a gateway to associate targets with these capabilities and connect them to your agent runtime. You connect with external MCP servers through the `SynchronizeGatewayTargets` API that performs protocol handshakes and indexes available capabilities. For more information about installing and using MCP servers, see [Amazon Bedrock AgentCore MCP Server: Vibe coding with your coding assistant](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./mcp-getting-started.html>).

###### Topics

  * Key considerations and limitations

  * Connecting to an OAuth-protected MCP server using Authorization Code flow

  * Configuring permissions


## Key considerations and limitations

**Listing Mode**

ListingMode can be set as either DYNAMIC or DEFAULT for MCP server targets.

  * In DYNAMIC mode, clients discover MCP server capabilities when a user invokes an MCP operation. Gateway retrieves server capabilities by forwarding requests to the MCP server. Currently DYNAMIC mode is not interoperable with semantic search or outbound three-legged OAuth (3LO).

  * Unless changed, Listing Mode is set to DEFAULT. In DEFAULT mode, clients discover MCP server capabilities through a synchronization operation provided by the SynchronizeGatewayTargets API.


**Implicit Synchronization**

For targets in DEFAULT mode, CreateGatewayTarget and UpdateGatewayTarget operations automatically trigger capability discovery and indexing. When either operation is called, Gateway fetches available tools using MCP’s `tools/list` capability, prompts using `prompts/list`, resources using `resources/list` and `resources/templates/list`, and adds the returned capabilities to the unified catalog.

**Explicit Synchronization**

Capability catalogs for Targets in DEFAULT mode, can be manually refreshed by calling the `SynchronizeGatewayTargets` API. When called, it updates the Gateway’s list of available capabilities. You should call the API any time an MCP server’s tool, prompt, resource definitions change.

Synchronization is a critical mechanism for maintaining accurate capability catalogs when integrating MCP servers. Implicit synchronization occurs automatically during target creation and updates, where Gateway immediately discovers and indexes tools, prompts, and resources from the MCP server to ensure capabilities are available for semantic search and unified listing. Explicit synchronization is performed on-demand through the `SynchronizeGatewayTargets` API, allowing discovery of the MCP capability catalog when MCP servers independently modify their capabilities.

**When to call SynchronizeGatewayTargets**

Whenever an MCP server target has its Listing Mode set to DEFAULT, use the `SynchronizeGatewayTargets` API after tools, prompts, or resources are added, removed, or modified. Since Gateway pre-computes vector embeddings for semantic search and maintains normalized capability catalogs, synchronization is necessary to ensure your users can discover and invoke the latest available tools, prompts, and resources.

**How to call the API**

Make a PUT request to /gateways/ { gatewayIdentifier}/synchronize with the target ID in the request body. The API returns a 202 response immediately and processes synchronization asynchronously. Monitor the target status through GetGatewayTarget to track synchronization progress, as the operation can take several minutes for large capability sets.

**Authorization strategy**

The following types of the authorization strategy are supported.

  * No authorization – The gateway invokes the MCP server without preconfigured authorization. This approach is not recommended.

  * OAuth – The gateway supports two-legged OAuth (`CLIENT_CREDENTIALS` grant type), three-legged OAuth (`AUTHORIZATION_CODE` grant type), and on-behalf-of token exchange (`TOKEN_EXCHANGE` grant type). You configure the authorization provider in Amazon Bedrock AgentCore Identity in the same account and Region for the gateway to make calls to the MCP server. If you use on-behalf-of token exchange, review the on-behalf-of token exchange considerations for this target type.

  * IAM ( [AWS Signature Version 4 (Sig V4)](<https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html>) ) – The gateway signs requests to the MCP server using SigV4 with the gateway service role credentials. You configure an `IamCredentialProvider` with a required service name for SigV4 signing and an optional Region (defaults to the gateway Region).

  * API key – The gateway uses an API key credential provider to authenticate with the MCP server. You configure the API key provider in Amazon Bedrock AgentCore Identity in the same account and Region as the gateway.


###### Important

IAM (SigV4) outbound authorization requires that the MCP server is hosted behind an AWS service that natively supports IAM authentication. The gateway signs outbound requests with SigV4 but does not modify the authentication configuration on the target. The target service must be able to verify SigV4 signatures.

The following AWS services natively support IAM authentication and are compatible with IAM outbound authorization for MCP server targets:

  * Amazon Bedrock AgentCore Gateway

  * Amazon Bedrock AgentCore Runtime (see [Deploy MCP servers in AgentCore Runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-mcp.html>))

  * Amazon API Gateway

  * Lambda Function URLs


Services that do not natively verify SigV4 signatures, such as Application Load Balancer or direct Amazon EC2 endpoints, are not compatible with IAM outbound authorization. If your MCP server is hosted behind one of these services, use OAuth or API key authorization instead.

**Configuration considerations for MCP server targets**

The following must be configured.

  1. The MCP server must have tool capabilities. Prompts and resources capabilities are optional and are synced automatically when the server advertises them.

  2. Supported MCP protocol versions are - **2026-07-28** , **2025-11-25** , **2025-06-18** , and **2025-03-26**.

  3. For the provided URL/endpoint of the server, the URL should be encoded. The Gateway will use the same URL to invoke the server.


###### Note

For accounts that are enabled for MCP version updates, you can modify the gateway’s supported protocol versions with the `UpdateGateway` operation. Otherwise, the supported versions are fixed when you create the gateway.

###### Tip

If your MCP server is hosted on AgentCore Runtime, you can avoid repeated initialization with the MCP server on each request. Enable [MCP sessions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-sessions.html>) on your gateway, or add `Mcp-Session-Id` as an allowed request and response header in the target’s `metadataConfiguration`. This results in lower latency for subsequent tool calls. This guidance applies to version `2025-11-25` and earlier. Version `2026-07-28` is stateless and does not use the `Mcp-Session-Id` header.

**On-behalf-of token exchange considerations**

The following limitations apply when you use on-behalf-of token exchange (the `TOKEN_EXCHANGE` grant type) as the outbound authorization for an MCP server target:

  * **No static tool discovery** – On-behalf-of token exchange does not support providing a static tool catalog upfront. The `mcpToolSchema` field is available only for the `AUTHORIZATION_CODE` grant type (three-legged OAuth), not for `TOKEN_EXCHANGE`. The gateway must instead discover the MCP server’s tools, either through synchronization or at invocation time.

  * **Authorization servers with 2LO support** – If your authorization server allows machine-to-machine authentication (the `CLIENT_CREDENTIALS` grant, also known as two-legged OAuth), you can use DEFAULT listing mode. In DEFAULT listing mode, the gateway runs a background synchronization during `CreateGatewayTarget`, `UpdateGatewayTarget`, and `SynchronizeGatewayTargets` to fetch the MCP server’s tools (using `tools/list`), prompts, and resources. No inbound user token exists during these control plane operations, so the synchronization uses the machine-to-machine token instead of on-behalf-of token exchange.

  * **Authorization servers without 2LO support** – If your authorization server doesn’t support machine-to-machine authentication, use DYNAMIC listing mode instead. In DYNAMIC mode, the gateway discovers the MCP server’s capabilities at invocation time. Because an inbound user token is present and can be exchanged at that point, the gateway requires no control plane background synchronization.


## Connecting to an OAuth-protected MCP server using Authorization Code flow

To support the Authorization Code grant type (three-legged OAuth) with MCP server targets, Amazon Bedrock AgentCore Gateway provides two methods for target creation.

**Implicit sync during MCP server target creation**

With this method, the admin user completes the authorization code flow during `CreateGatewayTarget` , `UpdateGatewayTarget` , or `SynchronizeGatewayTargets` operations using the authorization URL returned in the response. This allows Amazon Bedrock AgentCore Gateway to discover and cache the MCP server’s tools upfront.

###### Note

You cannot delete, update, or synchronize a target that is in a pending authorization state ( `CREATE_PENDING_AUTH` , `UPDATE_PENDING_AUTH` , or `SYNCHRONIZE_PENDING_AUTH` ). Wait for the authorization to complete or fail before performing further operations on the target.

**Provide schema upfront during MCP server target creation**

With this method, admin users provide the tool schema directly during `CreateGatewayTarget` or `UpdateGatewayTarget` operations using the `mcpToolSchema` field, rather than Amazon Bedrock AgentCore Gateway fetching them dynamically from the MCP server. Amazon Bedrock AgentCore Gateway parses the provided schema and caches the tool definitions.

###### Note

You cannot synchronize a target that has a static tool schema ( `mcpToolSchema` ) configured. Remove the static schema through an `UpdateGatewayTarget` call to enable dynamic tool synchronization.

**URL Session Binding**

[OAuth 2.0 authorization URL session binding](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./oauth2-authorization-url-session-binding.html>) verifies that the user who initiated the OAuth authorization request is the same user who granted consent. After the user completes consent, the browser redirects back to a return URL configured on the target with a unique session URI. The application is then responsible for calling the [CompleteResourceTokenAuth](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_CompleteResourceTokenAuth.html>) API, presenting both the user’s identity and the session URI. Amazon Bedrock AgentCore Identity validates that the user who started the flow is the same user who completed it before exchanging the authorization code for an access token.

This prevents a scenario where a user accidentally shares the authorization URL and someone else completes the consent, which would grant access tokens to the wrong party. The authorization URL and session URI are only valid for 10 minutes, further limiting the window for misuse. Session binding applies during target creation (implicit sync) and during tool invocation.

###### Note

When performing target operations (Create, Update, or Synchronize) and authorization through the AWS Management Console, the [CompleteResourceTokenAuth](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_CompleteResourceTokenAuth.html>) call is made on behalf of the resource owner, requiring no further action after authorization.

## Configuring permissions

The IAM role which you use to create, update or synchronize MCP servers targets should have the permissions shown in the following example.

```json
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:CreateGateway",
                "bedrock-agentcore:GetGateway",
                "bedrock-agentcore:CreateGatewayTarget",
                "bedrock-agentcore:GetGatewayTarget",
                "bedrock-agentcore:SynchronizeGatewayTargets",
                "bedrock-agentcore:UpdateGatewayTarget"
            ],
            "Resource": "arn:aws:bedrock-agentcore:*:*:*gateway*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "bedrock-agentcore:CreateWorkloadIdentity",
                "bedrock-agentcore:GetWorkloadAccessToken",
                "bedrock-agentcore:GetWorkloadAccessTokenForUserId",
                "bedrock-agentcore:GetResourceOauth2Token",
                "bedrock-agentcore:GetResourceApiKey",
                "bedrock-agentcore:CompleteResourceTokenAuth",
                "secretsmanager:GetSecretValue"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "kms:EnableKeyRotation",
                "kms:Decrypt",
                "kms:Encrypt",
                "kms:GenerateDataKey*",
                "kms:ReEncrypt*",
                "kms:CreateAlias",
                "kms:DisableKey",
                "kms:*"
            ],
            "Resource": "arn:aws:kms:*:123456789012:key/*"
        }
    ]
}
```
