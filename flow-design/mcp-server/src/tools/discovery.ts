import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { MCP_SERVER_NAME, MCP_SERVER_VERSION } from '../lib/version.js';

const NODE_TYPE_CATALOG = [
  { type: 'start', usage: 'Diagram entry point.' },
  { type: 'end', usage: 'Terminal / outcome.' },
  { type: 'process', usage: 'Generic action, step, or task (rectangle).' },
  { type: 'decision', usage: 'Branch / conditional (diamond). Exactly two outgoing labeled edges.' },
  { type: 'system', usage: 'Internal backend service or business logic.' },
  { type: 'architecture', usage: 'Cloud / infra resource (AWS, Azure, GCP, CNCF, Docker).' },
  { type: 'browser', usage: 'Web page or frontend client.' },
  { type: 'mobile', usage: 'Mobile screen.' },
  { type: 'note', usage: 'Callout / annotation. Connect with `..` to attach.' },
];

const EDGE_STYLES = [
  { syntax: '->', usage: 'Default edge.' },
  { syntax: '->|label|', usage: 'Edge with an inline label (e.g. Yes / No / HTTP).' },
  { syntax: '==>', usage: 'Primary / critical path. Renders heavier.' },
  { syntax: '-->', usage: 'Secondary / soft flow.' },
  { syntax: '..', usage: 'Async, error, or optional flow. Renders dotted.' },
];

export function registerDiscoveryTools(server: McpServer): void {
  server.registerTool(
    'list_diagram_node_types',
    {
      title: 'List OpenFlow DSL node types and edge styles',
      description:
        'Quick reference for every supported OpenFlow node type and edge style. ' +
        'Use this when authoring DSL by hand or when guiding another agent.',
    },
    async () => ({
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({ nodeTypes: NODE_TYPE_CATALOG, edgeStyles: EDGE_STYLES }, null, 2),
        },
      ],
    })
  );

  server.registerTool(
    'server_info',
    {
      title: 'Server info',
      description:
        'Return version, capabilities, and a self-test report from the MCP server. ' +
        'Useful when debugging client connections.',
    },
    async () => ({
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            {
              name: MCP_SERVER_NAME,
              version: MCP_SERVER_VERSION,
              localFirst: true,
              tools: [
                'validate_openflow_dsl',
                'analyze_codebase',
                'list_starter_templates',
                'get_starter_template',
                'list_diagram_node_types',
                'find_icon',
                'create_viewer_url',
                'server_info',
              ],
              resources: [
                'flow-design://docs/dsl-cheatsheet',
                'flow-design://templates',
                'flow-design://templates/{name}',
                'flow-design://icons',
                'flow-design://icons/{provider}',
              ],
              prompts: [
                'flowchart_from_description',
                'convert_mermaid_to_openflow',
                'architecture_from_codebase',
              ],
            },
            null,
            2
          ),
        },
      ],
    })
  );
}
