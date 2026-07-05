import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { lintOpenFlowDsl } from '../lib/dslLinter.js';

export function registerValidateDsl(server: McpServer): void {
  server.registerTool(
    'validate_openflow_dsl',
    {
      title: 'Validate OpenFlow DSL',
      description:
        'Lint an OpenFlow DSL document. Returns structured diagnostics ' +
        '(errors + warnings), declared node ids, and edge count. ' +
        'No network access; runs locally.',
      inputSchema: {
        dsl: z.string().describe('OpenFlow DSL source to validate.'),
      },
    },
    async (args) => {
      const result = lintOpenFlowDsl(args.dsl);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}
