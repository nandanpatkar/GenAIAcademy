#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stdio servers are kept alive by their transport; nothing more to do here.
}

main().catch((error) => {
  // Stderr only — stdout is the MCP protocol channel.
  console.error('flow-design-mcp failed to start:', error);
  process.exit(1);
});
