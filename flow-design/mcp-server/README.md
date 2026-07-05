<div align="center">

# Flow Design MCP Server

**Give Claude Desktop, Cursor, Windsurf, or any MCP client first-class diagramming tools.**

[![npm](https://img.shields.io/npm/v/@genai-roadmap/flow-design-mcp?style=flat-square&color=f97316)](https://www.npmjs.com/package/@genai-roadmap/flow-design-mcp)
[![MIT License](https://img.shields.io/badge/License-MIT-f97316.svg?style=flat-square)](https://github.com/GenAIAcademy/flow-design/blob/main/LICENSE)
[![Node 18+](https://img.shields.io/badge/Node-18%2B-339933.svg?style=flat-square)](https://nodejs.org/)

</div>

---

Flow Design MCP is **local-first by design** — it runs on your machine over stdio with no API key and no cloud round-trip, and its tools return deterministic output. Your MCP client already has an LLM; this server just gives it diagram-specific tools.

Instead, it gives the agent diagram-specific powers:

- read the OpenFlow DSL reference
- inspect starter templates
- analyze local codebases
- find exact cloud and developer icon slugs
- validate agent-authored DSL
- create shareable Flow Design viewer URLs

No API keys, no telemetry, no account, no server-side storage.

```
You:    Create a checkout flow with a promo-code branch
Claude: reads flow-design://docs/dsl-cheatsheet
        writes OpenFlow DSL itself
        calls validate_openflow_dsl
        fixes any issues
        calls create_viewer_url
        returns DSL + viewer link
```

---

## Install

```bash
# No install required; npx fetches the latest published version
npx -y @genai-roadmap/flow-design-mcp

# Or install globally
npm install -g @genai-roadmap/flow-design-mcp
flow-design-mcp
```

Requires **Node 18+**.

---

## Claude Desktop setup

Edit your Claude Desktop config:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "flow-design": {
      "command": "npx",
      "args": ["-y", "@genai-roadmap/flow-design-mcp"]
    }
  }
}
```

Restart Claude Desktop. You should see **flow-design** in the tool picker.

### Cursor / Windsurf / other MCP clients

Point the client at the same command:

- command: `npx`
- args: `["-y", "@genai-roadmap/flow-design-mcp"]`

The server speaks the standard MCP stdio protocol. Client UIs differ, but the command shape is the same.

---

## Tools

All tools run locally and require no provider key.

| Tool | What it does |
|---|---|
| `validate_openflow_dsl` | Lint OpenFlow DSL with structured diagnostics |
| `create_viewer_url` | Encode OpenFlow DSL into a shareable Flow Design viewer URL |
| `analyze_codebase` | Detect platforms, services, top-level structure, and language mix from a local repo |
| `find_icon` | Fuzzy-search 1,600+ AWS, Azure, GCP, CNCF, and developer icons |
| `list_starter_templates` | Browse built-in starter templates |
| `get_starter_template` | Fetch a named starter template as DSL |
| `list_diagram_node_types` | Return DSL node and edge reference data |
| `server_info` | Return version and capability metadata |

---

## Resources

Agents can read these directly:

| URI | Description |
|---|---|
| `flow-design://docs/dsl-cheatsheet` | OpenFlow DSL syntax reference |
| `flow-design://templates` | Starter template catalog |
| `flow-design://templates/{name}` | DSL for a named starter template |
| `flow-design://icons` | Full icon catalog |
| `flow-design://icons/{provider}` | Icon catalog for one provider pack |

Provider packs are `aws`, `azure`, `gcp`, `cncf`, and `developer`.

---

## Prompts

Clients can surface three prompt templates:

- `flowchart_from_description` — agent writes, validates, and links a flowchart
- `convert_mermaid_to_openflow` — agent converts Mermaid into OpenFlow DSL, validates it, and links it
- `architecture_from_codebase` — agent scans a local repo, picks icon slugs, validates DSL, and links the result

---

## Recommended agent workflow

Ask your MCP client:

```text
Using the flow-design MCP server: read flow-design://docs/dsl-cheatsheet, then write an OpenFlow DSL flowchart for checkout with cart, shipping, promo-code decision, payment, Stripe webhook, and confirmation. Call validate_openflow_dsl, fix any issues, then call create_viewer_url. Return the final DSL and viewer URL.
```

For architecture diagrams:

```text
Using flow-design: call analyze_codebase on /path/to/project, read flow-design://docs/dsl-cheatsheet, use find_icon for exact architecture icons, write OpenFlow DSL, validate it, then create a viewer URL.
```

---

## Privacy model

- **No telemetry.** The server never phones home.
- **No provider keys.** The MCP client model authors diagrams directly.
- **No Flow Design account.** Viewer URLs encode the DSL locally in the URL hash.
- **Local filesystem access only when requested.** Codebase analysis only reads the path passed to `analyze_codebase`.

---

## Development

This package lives in the [flow-design monorepo](https://github.com/GenAIAcademy/flow-design).

```bash
# From the repo root
npm install --workspace=mcp-server
npm run --workspace=mcp-server build
npm run --workspace=mcp-server test:run

# Run locally against the MCP Inspector
npx @modelcontextprotocol/inspector dist/index.js
```

The MCP Inspector gives you a UI to manually call every tool, browse every resource, and verify client behavior before publishing.
