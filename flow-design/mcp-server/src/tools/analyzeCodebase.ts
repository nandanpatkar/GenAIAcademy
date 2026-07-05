import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { buildArchitectureSummary, scanCodebase } from '../lib/codebaseScanner.js';
import { describeError, toolError } from '../lib/errors.js';

export function registerAnalyzeCodebase(server: McpServer): void {
  server.registerTool(
    'analyze_codebase',
    {
      title: 'Analyze a local codebase',
      description:
        'Walk a directory on disk and report detected cloud platform, services, ' +
        'top-level structure, and language breakdown. No network access — pure ' +
        'local filesystem scan. Useful to seed an architecture diagram.',
      inputSchema: {
        rootPath: z
          .string()
          .describe('Absolute path to the project root directory.'),
        maxFiles: z
          .number()
          .int()
          .min(1)
          .max(5000)
          .optional()
          .describe('Cap on files scanned. Defaults to 500.'),
      },
    },
    async (args) => {
      try {
        const result = await scanCodebase(args.rootPath, args.maxFiles ?? 500);
        return {
          content: [
            { type: 'text' as const, text: buildArchitectureSummary(result) },
            { type: 'text' as const, text: JSON.stringify(result, null, 2) },
          ],
        };
      } catch (error) {
        return toolError(`Codebase analysis failed: ${describeError(error)}`);
      }
    }
  );
}
