import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { findIcons, getIconProviders } from '../lib/iconCatalog.js';
import { describeError, toolError } from '../lib/errors.js';

export function registerFindIcon(server: McpServer): void {
  server.registerTool(
    'find_icon',
    {
      title: 'Find a provider icon by human name',
      description:
        'Fuzzy-search the Flow Design icon catalog (1600+ icons across AWS, Azure, GCP, ' +
        'CNCF, and developer brand logos). Returns ranked matches with their `provider` ' +
        'and `slug` values, which you pass back into [architecture] node attributes as ' +
        '`archProvider` and `archResourceType` to render the icon. Always call this before ' +
        'guessing a slug, since silent fallback to a generic icon is a poor user experience.',
      inputSchema: {
        query: z
          .string()
          .min(1, 'Query is required')
          .describe('Human-friendly name to search for (e.g. "postgres", "kafka", "react").'),
        provider: z
          .string()
          .optional()
          .describe('Optional: limit results to one provider (aws, azure, gcp, cncf, developer).'),
        limit: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .describe('Maximum number of matches to return. Defaults to 10.'),
      },
    },
    async (args) => {
      try {
        const matches = await findIcons(args.query, {
          provider: args.provider,
          limit: args.limit,
        });
        const providers = await getIconProviders();
        const knownProvider = args.provider
          ? providers.includes(args.provider.toLowerCase())
          : true;

        const hint = !knownProvider
          ? `Unknown provider "${args.provider}". Known providers: ${providers.join(', ')}.`
          : matches.length === 0
            ? `No icons matched "${args.query}". Try a broader term or omit the provider filter.`
            : `${matches.length} match${matches.length === 1 ? '' : 'es'}. Pick one and use { archProvider: "<provider>", archResourceType: "<slug>" } on an [architecture] node.`;

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({ hint, matches }, null, 2),
            },
          ],
        };
      } catch (error) {
        return toolError(`Icon search failed: ${describeError(error)}`);
      }
    }
  );
}
