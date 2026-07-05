import { describe, expect, it } from 'vitest';
import { decodeDslFromViewerParam, encodeDslForViewer } from './viewerUrlCodec';

describe('viewerUrlCodec', () => {
  it('round-trips compressed OpenFlow DSL viewer params', () => {
    const dsl = 'flow: Test\n[start] start: Start\n[end] done: Done\nstart -> done';
    const encoded = encodeDslForViewer(dsl);

    expect(encoded.startsWith('~')).toBe(true);
    expect(decodeDslFromViewerParam(encoded)).toBe(dsl);
  });
});
