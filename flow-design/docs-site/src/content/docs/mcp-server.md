---
draft: false
title: MCP Server
description: Use the Flow Design MCP server with Claude Desktop, Cursor, Windsurf, and other MCP clients.
---

The Flow Design MCP server gives AI clients diagramming skills that run local-first — on your machine, no API key, no cloud round-trip, deterministic output. Claude Desktop, Cursor, Windsurf, and other MCP clients already have an LLM; Flow Design supplies the local tools that make that model good at diagrams.

The package is `@genai-roadmap/flow-design-mcp`. It runs locally over the standard MCP stdio transport.

## Install and run

Use it directly with `npx`:

```bash
npx -y @genai-roadmap/flow-design-mcp
```

Or install it globally:

```bash
npm install -g @genai-roadmap/flow-design-mcp
flow-design-mcp
```

The server requires Node 18 or newer.

## Claude Desktop setup

Add the server to your Claude Desktop config:

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

For Cursor, Windsurf, and other MCP clients, use the same command and args in that client's MCP settings.

## How generation works

Flow Design MCP is agent-native:

1. The agent reads `flow-design://docs/dsl-cheatsheet`.
2. The agent writes OpenFlow DSL itself.
3. The agent calls `find_icon` when it needs exact cloud or developer icon slugs.
4. The agent calls `validate_openflow_dsl`.
5. The agent fixes any diagnostics.
6. The agent calls `create_viewer_url`.
7. The agent returns editable DSL and a viewer link.

No API keys are required for MCP diagram generation.

## Tools

The current server exposes 8 local-first tools (no API key, deterministic, run on your machine):

| Tool | What it does |
| --- | --- |
| `validate_openflow_dsl` | Lint DSL with structured diagnostics |
| `create_viewer_url` | Create a shareable Flow Design viewer URL from DSL |
| `analyze_codebase` | Detect platforms, services, top-level structure, and language mix from a local repo |
| `find_icon` | Search 1,600+ provider and developer icons for exact `archProvider` and `archResourceType` values |
| `list_starter_templates` | Browse built-in templates |
| `get_starter_template` | Fetch a template's DSL |
| `list_diagram_node_types` | Return DSL node and edge reference data |
| `server_info` | Return version and capability metadata |

## Resources and prompts

The server exposes five resources:

| URI | Description |
| --- | --- |
| `flow-design://docs/dsl-cheatsheet` | OpenFlow DSL syntax reference |
| `flow-design://templates` | Starter template catalog |
| `flow-design://templates/{name}` | DSL for a named starter template |
| `flow-design://icons` | Full architecture icon catalog |
| `flow-design://icons/{provider}` | Icons for one provider pack (`aws`, `azure`, `gcp`, `cncf`, or `developer`) |

Clients can also surface three prompt templates: `flowchart_from_description`, `convert_mermaid_to_openflow`, and `architecture_from_codebase`.

## Try it

Paste this into a connected MCP client:

```text
Using the flow-design MCP server: read flow-design://docs/dsl-cheatsheet, then write an OpenFlow DSL flowchart for a checkout flow (cart → shipping → promo-code decision → payment → Stripe webhook → confirm). Call validate_openflow_dsl on your output, fix any errors, then call create_viewer_url. Show me the final DSL and viewer URL.
```

For codebases:

```text
Using flow-design: call analyze_codebase on /path/to/project, read flow-design://docs/dsl-cheatsheet, use find_icon for exact architecture icons, write OpenFlow DSL, validate it, then create a viewer URL.
```

## Privacy model

The server does not store diagrams, require an Flow Design account, ask for provider keys, or phone home. Local tools run on your machine. Codebase analysis only reads the directory you explicitly pass to `analyze_codebase`.

## Related pages

- [OpenFlow DSL](/openflow-dsl/)
- [AI Generation](/ai-generation/)
- [Prompting AI Agents](/prompting-agents/)
