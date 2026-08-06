# Troubleshooting - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-troubleshooting.html

---

# Troubleshooting  
  
###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

## Schema validation errors

When creating different types of records, you may see validation exception for the descriptors. See [Supported record types](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-supported-record-types.html>) section for valid schemas.

Common errors:

  * "Schema version '0.3.0' is not supported for descriptor type 'a2a'." — The schemaVersion field value should be `0.3` instead of `0.3.0` . This aligns with the [official A2A protocol version description](<https://a2a-protocol.org/latest/specification/#446-agentinterface>) : "Use the latest supported minor version per major version".

  * "Schema validation failed: content is not in compliance with schema version '0.3' for descriptor type 'a2a'." — You can find the schema on [Supported record types](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-supported-record-types.html>) . Note that the content will be validated against #/definitions/AgentCard in the json schema.


## Record synchronization errors

When you create or update record using synchronization feature, the record may transition to CREATE_FAILED or UPDATE_FAILED status, with a `statusReason` explaining what happened.

At high level, errors can be categorized as: permission errors, connection errors, validation errors, and server side errors.

### Permission errors

Synchronization configuration is wrong or expired:

  * "Unable to connect to MCP server because caller credentials have expired." — the caller of the create or update API has expired credentials. You can retry with UpdateRegistryRecord API again.

  * "Received exception from GetWorkloadAccessToken API: <detailed message>" — registry calls [GetWorkloadAccessToken](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_GetWorkloadAccessToken.html>) API on-behalf-of the caller. Refer to the detailed message to learn about the error. Refer to [Synchronize records from external sources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-sync-records.html>) if you see access denied exception.

  * "Unable to parse credential provider ARN: <arn>" — malformed credential provider ARN. This must be a valid [credential provider](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-outbound-credential-provider.html>) ARN created from AgentCore Identity.

  * "Received exception from GetResourceOauth2Token API: <detailed message>" — registry calls [GetResourceOauth2Token](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_GetResourceOauth2Token.html>) API on-behalf-of the caller. Refer to the detailed message to learn about the error. Refer to [Synchronize records from external sources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-sync-records.html>) if you see access denied exception.

  * "Unable to assume the provided IAM role for MCP server authorization." — registry calls AssumeRole API on-behalf-of the caller. Refer to [Synchronize records from external sources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-sync-records.html>) for the expected IAM permissions, e.g. caller must have `iam:PassRole` permission.


### Connection errors

Can’t reach the server:

  * "Failed to fetch agent card from URL: %s" — A2A IOException

  * "MCP server returned HTTP <code>" — non-200/202 HTTP response from the MCP server. Please check if the URL is correct and the MCP server can be connected.

  * "The provided URL resolves to a non-public IP address" — Registry only supports connecting to public IP address servers.

  * "Failed to connect to MCP server" — IOException/connection failure

  * "Invalid MCP server URL" — malformed URL

  * "Failed to initialize MCP connection" — initialize request exception

  * "Failed to send initialized notification" — notification exception

  * "Failed to list tools from MCP server" — tools/list exception

  * "MCP server tools/list pagination timed out" — registry only supports at most 30 seconds when paginating tools from MCP server. Contact AWS support if your MCP server needs more time for synchronization.


### Validation errors

Server responded but content is not supported:

  * "Failed to parse agent card JSON" — A2A content empty or malformed JSON

  * "Agent card exceeds maximum size limit" — A2A response too large

  * "Failed to parse MCP server response JSON" — MCP content empty or malformed

  * "MCP server returned invalid response: missing result" — MCP JSON-RPC missing result

  * "MCP server response exceeds maximum allowed size" — MCP response too large

  * "Descriptor type %s does not support URL synchronization" — unsupported descriptor type


### Server side errors

  * "Unknown error" — This is a server side error. Please retry later or contact AWS support for help.



