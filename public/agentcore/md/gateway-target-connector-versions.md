# Connector versions - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-connector-versions.html

---

# Connector versions

Built-in connectors on Amazon Bedrock AgentCore Gateway use semantic versioning (`MAJOR.MINOR.PATCH`). You can pin a target to a specific connector version or let it use the connector’s current default version.

## Versioning behavior

The following table describes how the Gateway resolves connector versions when you create or update a target.

Scenario | Behavior  
---|---  
Create with `source.version` |  Target is pinned to that version.  
Create without `source.version` |  Target gets the connector’s current default version.  
Update with `source.version` |  Target moves to the specified version.  
Update without `source.version` |  Target keeps its current version (sticky).  
`GetGatewayTarget` |  Response includes the resolved `source.version`.  
  
## Web Search Tool (`web-search`)

**Default version:** `1.1.0`

Version | Released | Changes  
---|---|---  
`1.2.0` |  2026-07-20 |  Agent-side request-level filters: domain include and exclude lists (up to 100 domains per list) and published-date range filtering (ISO-8601 UTC).  
`1.1.0` |  2026-06-15 |  Added `structuredContent` in tool results; added `publishedDate` field; improved snippet extraction.  
  
## Amazon Bedrock Managed Knowledge Bases (`bedrock-knowledge-bases`)

**Default version:** `1.0.0`

Version | Released | Changes  
---|---|---  
`1.0.0` |  2026-04-01 |  Initial release — `Retrieve` and `AgenticRetrieveStream` operations.  
  
## Example: pin a version

To pin a target to a specific connector version, include `source.version` in the target configuration:

```json
{
  "targetConfiguration": {
    "mcp": {
      "connector": {
        "source": {
          "connectorId": "web-search",
          "version": "1.1.0"
        }
      }
    }
  }
}
```
If you specify a version that does not exist, the API returns a `ValidationException` that lists the available versions.

## Version lifecycle

Each connector version moves through the following stages:

Stage | Description  
---|---  
Available |  You can select this version for new or updated targets.  
Default |  Assigned when you omit `source.version`.  
Deprecated |  Works for existing targets but is not recommended for new ones.  
Retired |  No longer available for new targets. Existing targets must upgrade.  
  
## Backward compatibility

Minor and patch versions are backward-compatible. New fields on the tool input schema and admin configuration are additive.

Existing targets keep their pinned version when the connector’s default version changes. To adopt a new minor version, update the target with the new `source.version`.

`tools/list` may expose additional properties on new minor versions. Clients that parse the schema strictly should tolerate unknown properties.

Admin-side configuration keys are validated against the target’s connector version. Passing a key that the pinned version does not recognize returns a `ValidationException` at target creation or update.

A major version bump indicates a breaking change and includes a migration guide.

