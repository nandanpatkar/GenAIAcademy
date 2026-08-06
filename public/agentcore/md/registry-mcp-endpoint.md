# Using the Registry MCP endpoint - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-mcp-endpoint.html

---

# Using the Registry MCP endpoint

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

## Overview

Each registry exposes an MCP-compatible endpoint following [2025-11-25 specification](<https://modelcontextprotocol.io/specification/2025-11-25>) . The endpoint supports tool listing and tool invocation for searching registry records.

```text
https://bedrock-agentcore.<region>.amazonaws.com/registry/<registryId>/mcp
```
The MCP contains one tool named "search_registry_records".

```text
Tool name: search_registry_records

Description:
Searches for registry records using natural language queries. Returns metadata for matching records.

Parameters:
- searchQuery (required): string - Natural language search query
- maxResults: integer - Maximum number of results to return (1-20, default 10)
- filter: object - Optional metadata filter using structured JSON operators. Supports field-level operators ($eq, $ne,
  $in) and logical operators ($and, $or) on filterable fields (name, descriptorType, version). Example:
  {"descriptorType": {"$eq": "MCP"}}
```
You can connect to registry from an existing MCP client, such as Kiro, Claude, etc.

## Connect to OAuth-based registry MCP endpoint from an existing MCP client

### Permissions

The MCP endpoint will use the same **CustomJWTAuthorizerConfiguration** to authorize the incoming requests.

The `.well-known/oauth-protected-resource` path is: `https://bedrock-agentcore.<region>.amazonaws.com/.well-known/oauth-protected-resource/registry/<registryId>/mcp`.

The client can discover the metadata from `WWW-Authenticate` header as well:

```yaml
www-authenticate: Bearer resource_metadata="https://bedrock-agentcore.<region>.amazonaws.com/.well-known/oauth-protected-resource/registry/<registryId>/mcp"
```
Once you obtained the access token, you can validate it:

```bash
curl -s -X POST "https://bedrock-agentcore.<region>.amazonaws.com/registry/<registryId>/mcp" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_registry_records","arguments":{"searchQuery":"weather"}}}'
```
Depending on your authorization server and organization’s security requirements, you may choose one of the following approaches to configure your MCP client:

  1. Bearer token: use a separate process to fetch bearer token and configure it in MCP client header

  2. Pre-registered client: create a client in your authorization server, and allowlist the client on registry’s configuration.

  3. Dynamic client registration: if your authorization server supports dynamic client registration (DCR), you can allowlist the audience in registry’s configuration.


### OAuth-based MCP client setup

#### Use bearer token

In most IDEs, you can configure authorization header bearer token in an mcp configuration. For example, [Kiro supports](<https://kiro.dev/blog/introducing-remote-mcp/#securing-mcp-connections>) environment variables using the `${ENV_VAR}` syntax. You can use following example:

```json
{
  "mcpServers": {
    "my-registry": {
      "type": "http",
      "url": "https://bedrock-agentcore.<region>.amazonaws.com/registry/<registryId>/mcp",
      "headers": {
        "Authorization": "Bearer ${ACCESS_TOKEN}"
      }
    }
  }
}
```
#### Pre-registered client

You can create a new client based on authorization code grant in your authorization server, and use the client to access registry. For example, [create a client in Cognito](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idp-cognito.html>) user pool.

Once you have the client ID, make sure you allowlist it in registry:

```bash
aws bedrock-agentcore-control update-registry \
  --registry-id <registryId> \
  --authorizer-configuration '{
    "optionalValue": {
      "customJWTAuthorizer": {
        "discoveryUrl": "https://<example-domain>/.well-known/openid-configuration",
        "allowedClients": ["<client-id>"]
      }
    }
  }'
```
Then you can configure your MCP client if it supports specifying clientId. An example in Claude code:

```json
{
  "mcpServers": {
    "pre-registered-registry": {
      "type": "http",
      "url": "https://bedrock-agentcore.<region>.amazonaws.com/registry/<registryId>/mcp",
      "oauth": {
        "clientId": "<client-id>",
        "callbackPort": "<port-number>"
      }
    }
  }
}
```
###### Note

Some authorization servers like Auth0 and Cognito don’t let you configure a range of ports as allowed redirect URIs, so you need to explicitly set one in the preregistered client’s allowed redirect/callback URL, as well as in the mcp.json.

#### Dynamic client registration

Most MCP client applications support dynamic client registration. In this case, you should NOT specify `allowedClients` value in registry. Instead, you can choose to set `allowedAudience` . The value can be the same as your MCP registry. You should configure your authorization server to issue JWT with `aud` field with the same value as in `allowedAudience`.

```bash
aws bedrock-agentcore-control update-registry \
  --registry-id <registryId> \
  --authorizer-configuration '{
    "optionalValue": {
      "customJWTAuthorizer": {
        "discoveryUrl": "https://<example-domain>/.well-known/openid-configuration",
        "allowedAudience": ["https://bedrock-agentcore.<region>.amazonaws.com/registry/<registryId>/mcp"]
      }
    }
  }'
```
Then you can configure your MCP client simply using an url:

```json
{
  "mcpServers": {
    "dcr-registry": {
      "type": "http",
      "url": "https://bedrock-agentcore.<region>.amazonaws.com/registry/<registryId>/mcp"
    }
  }
}
```
Common errors when you setup dynamic client registration:

  * You must ensure the authorization server supports dynamic client registration.

  * The authorization server must issue JWT with `aud` field, which is allowed in your registry’s CustomJWTAuthorizerConfiguration.

  * Currently registry does not return scope challenge in www-authenticate header. Some MCP clients support explicitly defining `oauthScopes` in configuration, such as [Kiro](<https://kiro.dev/docs/cli/custom-agents/configuration-reference/#oauth-configuration>).


## Connect to IAM-based registry MCP endpoint from an existing MCP client

### Permissions

For MCP initialization and tool listing:

```json
{
    "Effect": "Allow",
    "Action": "bedrock-agentcore:InvokeRegistryMcp",
    "Resource": "arn:aws:bedrock-agentcore:*:<account>:registry/*"
}
```
For searching via MCP tool invocation, you also need:

```json
{
    "Effect": "Allow",
    "Action":
    [
        "bedrock-agentcore:InvokeRegistryMcp",
        "bedrock-agentcore:SearchRegistryRecords"
    ],
    "Resource": "arn:aws:bedrock-agentcore:*:<account>:registry/*"
}
```
You can verify permission with command:

```bash
curl -s -X POST "https://bedrock-agentcore.<region>.amazonaws.com/registry/<registryId>/mcp" \
  -H "Content-Type: application/json" \
  -H "X-Amz-Security-Token: ${AWS_SESSION_TOKEN}" \
  --aws-sigv4 "aws:amz:<region>:bedrock-agentcore" \
  --user "${AWS_ACCESS_KEY_ID}:${AWS_SECRET_ACCESS_KEY}" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_registry_records","arguments":{"searchQuery":"weather"}}}'
```
### IAM-based MCP client setup

You can use [mcp-proxy-for-aws](<https://github.com/aws/mcp-proxy-for-aws>) to connect to an IAM-based registry. For example, in Kiro mcp.json:

```json
{
  "mcpServers": {
    "iam-based-registry": {
      "disabled": false,
      "type": "stdio",
      "command": "uvx",
      "args": [
        "mcp-proxy-for-aws@latest",
        "https://bedrock-agentcore.<region>.amazonaws.com/registry/<registryId>/mcp",
        "--service",
        "bedrock-agentcore",
        "--region",
        "<region>",
        "--profile",
        "my-profile"
      ]
    }
  }
}
```
## Develop your own MCP client

For more code references of how to invoke the Registry MCP endpoint, including from popular IDEs like Kiro or Claude Code, please refer to sample code references in the public code repository.

