import { describe, expect, it } from 'vitest';
import { createServer } from '../src/server.js';
import { MCP_SERVER_NAME, MCP_SERVER_VERSION } from '../src/lib/version.js';

describe('createServer', () => {
  it('initialises with the expected name and version', () => {
    const server = createServer();
    // The server.server exposes the underlying low-level server. The version
    // is mirrored on the protocol-level instance.
    expect(MCP_SERVER_NAME).toBe('flow-design');
    expect(MCP_SERVER_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    // Basic shape assertion — instantiation must not throw and must expose tool registration.
    expect(typeof (server as unknown as { registerTool: unknown }).registerTool).toBe('function');
  });
});
