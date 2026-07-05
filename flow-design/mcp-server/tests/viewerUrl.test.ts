import { describe, expect, it } from 'vitest';
import { inflate } from 'pako';
import { buildViewerUrl } from '../src/lib/viewerUrl.js';

describe('buildViewerUrl', () => {
  it('encodes DSL into the Flow Design viewer URL with pako compression', () => {
    const dsl = 'flow: Hello\n[start] s\n[end] e\ns -> e';
    const url = buildViewerUrl(dsl);
    expect(url).toMatch(/^https:\/\/app\.flow-design\.com\/#\/view\?flow=~/);

    const encoded = url.split('flow=')[1]!;
    expect(encoded.startsWith('~')).toBe(true);
    const b64url = encoded.slice(1);
    const pad = b64url.length % 4 === 0 ? '' : '='.repeat(4 - (b64url.length % 4));
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/') + pad;
    const bytes = Buffer.from(b64, 'base64');
    const decoded = new TextDecoder().decode(inflate(bytes));
    expect(decoded).toBe(dsl);
  });

  it('compresses larger DSL meaningfully', () => {
    const dsl =
      'flow: Big\n' +
      Array.from({ length: 50 }, (_, i) => `[process] n${i}: Node Number ${i}`).join('\n') +
      '\n' +
      Array.from({ length: 49 }, (_, i) => `n${i} -> n${i + 1}`).join('\n');
    const url = buildViewerUrl(dsl);
    const encoded = url.split('flow=')[1]!.slice(1);
    expect(encoded.length).toBeLessThan(dsl.length);
  });
});
