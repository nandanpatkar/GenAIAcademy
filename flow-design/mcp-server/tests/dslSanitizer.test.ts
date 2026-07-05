import { describe, expect, it } from 'vitest';
import { stripCodeFences } from '../src/lib/dslSanitizer.js';

describe('stripCodeFences', () => {
  it('returns input unchanged when no fences are present', () => {
    expect(stripCodeFences('flow: A\n[start] s1')).toBe('flow: A\n[start] s1');
  });

  it('strips opening and closing fences', () => {
    const wrapped = '```openflow\nflow: A\n[start] s1\n```';
    expect(stripCodeFences(wrapped)).toBe('flow: A\n[start] s1');
  });

  it('strips bare ``` lines anywhere in the output', () => {
    const wrapped = '```\nflow: A\n```\n[start] s1\n```';
    expect(stripCodeFences(wrapped)).toBe('flow: A\n[start] s1');
  });

  it('trims surrounding whitespace', () => {
    expect(stripCodeFences('   \nflow: A\n   ')).toBe('flow: A');
  });
});
