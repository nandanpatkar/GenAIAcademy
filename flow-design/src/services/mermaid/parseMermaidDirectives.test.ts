import { describe, expect, it } from 'vitest';
import { parseMermaidDirectives } from './parseMermaidDirectives';

describe('parseMermaidDirectives', () => {
    it('extracts flowchart.curve from YAML frontmatter', () => {
        const input = `---
config:
  flowchart:
    curve: basis
---
flowchart TD
  A --> B
`;
        expect(parseMermaidDirectives(input).flowchartCurve).toBe('basis');
    });

    it('extracts curve from %%{init}%% directive with single quotes', () => {
        const input = `%%{init: {'flowchart': {'curve': 'monotoneX'}}}%%
flowchart LR
  A --> B
`;
        expect(parseMermaidDirectives(input).flowchartCurve).toBe('monotoneX');
    });

    it('extracts curve from %%{init}%% directive with double quotes', () => {
        const input = `%%{init: {"flowchart": {"curve": "cardinal"}}}%%
flowchart TD
  X --> Y
`;
        expect(parseMermaidDirectives(input).flowchartCurve).toBe('cardinal');
    });

    it('falls back to default when curve is unknown', () => {
        const input = `%%{init: {'flowchart': {'curve': 'notARealCurve'}}}%%
flowchart TD
  A --> B
`;
        expect(parseMermaidDirectives(input).flowchartCurve).toBe('basis');
    });

    it('returns empty object when no directives are present', () => {
        expect(parseMermaidDirectives('flowchart TD\n  A --> B\n').flowchartCurve).toBeUndefined();
    });

    it('does not throw on malformed init directives', () => {
        expect(() =>
            parseMermaidDirectives(`%%{init: {flowchart: {curve: }}}%%\nflowchart TD\n  A --> B\n`)
        ).not.toThrow();
    });
});
