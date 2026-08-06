# Supported record types - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-supported-record-types.html

---

# Supported record types

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

AWS Agent Registry validates record content against official protocol schemas. The console displays the reference schema side-by-side with your input and shows inline validation errors with a **Diagnose with Amazon Q** button. The registry supports all versions of the MCP Protocol Schema and the A2A Schema.

Each record has 3 metadata fields (name, description, recordVersion). Besides, the `descriptorType` and `descriptors` are where you specify the record metadata.

## MCP descriptors

An MCP server record contains following descriptors:

  * **Server** — This descriptor is based on the [official MCP registry](<https://registry.modelcontextprotocol.io/>) server.json definition. The content would be validated against the selected schema version, which can be [found here](<https://github.com/modelcontextprotocol/static/tree/main/schemas>) . Current supported `SchemaVersion` include: [2025-12-11](<https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json>) , [2025-10-17](<https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json>) , [2025-10-11](<https://static.modelcontextprotocol.io/schemas/2025-10-11/server.schema.json>) , [2025-09-29](<https://static.modelcontextprotocol.io/schemas/2025-09-29/server.schema.json>) , [2025-09-16](<https://static.modelcontextprotocol.io/schemas/2025-09-16/server.schema.json>) , [2025-07-09](<https://static.modelcontextprotocol.io/schemas/2025-07-09/server.schema.json>) . If you do not have a server.json, we recommend you create one with the latest schema.

  * **Tools** — Tools available on the server, validated against the [MCP protocol](<https://modelcontextprotocol.io/specification/2025-11-25/schema>) . Current supported `protocolVersion` include: [2025-11-25](<https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2025-11-25/schema.json>) , [2025-06-18](<https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2025-06-18/schema.json>) , [2025-03-26](<https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2025-03-26/schema.json>) , [2024-11-05](<https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2024-11-05/schema.json>).


**Minimal valid example of server descriptor:**

```json
{
  "name": "my-org/weather-server",
  "description": "Weather data and forecasts via OpenWeatherMap API",
  "version": "1.0.0"
}
```
**Minimal valid example of tools descriptor:**

```json
{
    "tools":
    [
        {
            "name": "get_weather",
            "description": "Get weather for a city",
            "inputSchema":
            {
                "type": "object",
                "properties":
                {
                    "city":
                    {
                        "type": "string"
                    }
                }
            }
        }
    ]
}
```
**Console:** Select **MCP** under Record type. The editor shows server and tools JSON editors with an optional official schema reference.

## Agent descriptors

Agents are autonomous programs that reason, plan, and take actions. An agent record contains:

  * **Agent card** — Capabilities, skills, and communication interface validated against the [A2A agent card specification](<https://a2a-protocol.org/latest/specification/#441-agentcard>) . Current supported `schemaVersion` : [0.3](<https://github.com/a2aproject/A2A/blob/v0.3.0/specification/json/a2a.json#L138>) . Note that the content will be validated against #/definitions/AgentCard in the json schema.


**Minimal valid example:**

```json
{
    "name": "My Agent",
    "description": "Brief description of what this agent does",
    "version": "1.0.0",
    "protocolVersion": "0.3.0",
    "url": "https://api.example.com/a2a",
    "capabilities": {},
    "defaultInputModes": ["text/plain"],
    "defaultOutputModes": ["text/plain"],
    "skills": [
        {
            "id": "default-skill",
            "name": "Default Skill",
            "description": "Description of what this skill does",
            "tags": ["general"]
        }
    ]
}
```
**Console:** Select **Agent** under Record type. The editor shows **Your agent card** alongside an **Official agent card** reference schema with a version dropdown (e.g., 0.3). Toggle **Show official schema** to display the reference.

## AgentSkills descriptors

Skills are reusable capabilities shared across agents. A skill record contains:

  * **Skill markdown (optional)** — Content of SKILL.md, which will be validated against the [official AgentSkills specification](<https://agentskills.io/home>) . Note that the markdown is only used as metadata for discovery purpose. Registry does not support storing other agent skill files.

  * **Skill definition (optional)** — Structured definition validated against an Amazon pre-defined schema. The supported `schemaVersion` : 0.1.0.


The skill definition schema is defined as follow:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Agent skills skill definition schema",
  "description": "Schema for skill definition metadata. All top-level fields are optional. Unknown fields are allowed for forward compatibility.",
  "type": "object",
  "properties": {
    "_meta": {
      "description": "Extension metadata using reverse DNS namespacing for vendor-specific data.",
      "type": "object"
    },
    "repository": {
      "$ref": "#/definitions/Repository"
    },
    "websiteUrl": {
      "description": "URL to the skill's homepage, documentation, or project website.",
      "type": "string",
      "format": "uri"
    },
    "packages": {
      "description": "Package distribution configurations for the skill.",
      "type": "array",
      "items": {
        "$ref": "#/definitions/Package"
      }
    }
  },
  "definitions": {
    "Repository": {
      "description": "Source code repository metadata for the skill.",
      "type": "object",
      "properties": {
        "url": {
          "description": "Repository URL for browsing source code.",
          "type": "string",
          "format": "uri"
        },
        "source": {
          "description": "Repository hosting service identifier (e.g., 'github', 'gitlab', 'codecommit').",
          "type": "string"
        }
      },
      "required": ["url", "source"]
    },
    "Package": {
      "description": "Package distribution configuration.",
      "type": "object",
      "properties": {
        "registryType": {
          "description": "Package registry type (e.g., 'npm', 'pypi').",
          "type": "string"
        },
        "identifier": {
          "description": "Package identifier in the registry (e.g., '@scope/package-name').",
          "type": "string"
        },
        "version": {
          "description": "Package version. Must be a specific version.",
          "type": "string"
        }
      },
      "required": ["registryType", "identifier"]
    }
  }
}
```
**A valid example of skill markdown:**

```text
---
name: my-skill
description: Brief description of what this skill does.
---

# My Skill

Describe your skill's purpose, usage, and capabilities here.
```
**A valid example of skill definition:**

```json
{
  "websiteUrl": "https://example.com/my-skill",
  "repository": {"url": "https://github.com/example/my-skill", "source": "github"}
}
```
**Console:** Select **Agent Skills** under Record type.

## Custom descriptors

For resources not fitting standard types (Eg - APIs, Lambda functions, knowledge bases, databases, agents using other protocols), you can use custom descriptor. The content must be a valid JSON.

**Console:** Select **Custom** under Record type. The editor shows a single **Definition** JSON editor with no official schema reference.

###### Note

The console displays the record type column as **Record type** in the records table. The API uses the field name `descriptorType`.

