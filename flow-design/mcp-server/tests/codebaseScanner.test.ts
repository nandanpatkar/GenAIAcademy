import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { buildArchitectureSummary, scanCodebase } from '../src/lib/codebaseScanner.js';

const createdRoots: string[] = [];

afterEach(async () => {
  for (const root of createdRoots) {
    await fs.promises.rm(root, { recursive: true, force: true });
  }
  createdRoots.length = 0;
});

async function makeTempProject(layout: Record<string, string>): Promise<string> {
  const root = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'openflow-mcp-'));
  createdRoots.push(root);
  for (const [relativePath, content] of Object.entries(layout)) {
    const full = path.join(root, relativePath);
    await fs.promises.mkdir(path.dirname(full), { recursive: true });
    await fs.promises.writeFile(full, content, 'utf8');
  }
  return root;
}

describe('scanCodebase', () => {
  it('detects AWS services from import lines', async () => {
    const root = await makeTempProject({
      'src/index.ts': `import { S3Client } from '@aws-sdk/client-s3';\n`,
      'package.json': JSON.stringify({ dependencies: { '@aws-sdk/client-s3': '^3.0.0' } }),
    });

    const result = await scanCodebase(root);
    expect(result.cloudPlatform).toBe('aws');
    expect(result.detectedServices.some((s) => s.name === 'S3')).toBe(true);
  });

  it('detects Docker Compose from file path', async () => {
    const root = await makeTempProject({
      'docker-compose.yml': 'services:\n  app:\n    image: nginx',
    });

    const result = await scanCodebase(root);
    expect(result.cloudPlatform).toBe('docker');
    expect(result.detectedServices.some((s) => s.name === 'Docker Compose')).toBe(true);
  });

  it('produces a readable architecture summary', async () => {
    const root = await makeTempProject({
      'src/db.ts': "import { Pool } from 'pg';\nconst pool = new Pool();\n",
    });

    const result = await scanCodebase(root);
    const summary = buildArchitectureSummary(result);
    expect(summary).toMatch(/Cloud platform:/);
    expect(summary).toMatch(/PostgreSQL/);
  });

  it('throws when rootPath is not a directory', async () => {
    await expect(scanCodebase('/this/path/does/not/exist/12345')).rejects.toThrow();
  });
});
