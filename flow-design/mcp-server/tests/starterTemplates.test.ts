import { describe, expect, it } from 'vitest';
import { lintOpenFlowDsl } from '../src/lib/dslLinter.js';
import { findStarterTemplate, STARTER_TEMPLATES } from '../src/lib/starterTemplates.js';

describe('starter templates', () => {
  it('exposes a stable set of templates', () => {
    expect(STARTER_TEMPLATES.length).toBeGreaterThan(0);
    const names = STARTER_TEMPLATES.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  for (const template of STARTER_TEMPLATES) {
    it(`template "${template.name}" passes the lightweight DSL linter`, () => {
      const result = lintOpenFlowDsl(template.dsl);
      const errors = result.diagnostics.filter((d) => d.severity === 'error');
      expect(errors, `${template.name} should have no errors:\n${JSON.stringify(errors, null, 2)}`).toEqual([]);
      expect(result.declaredNodeIds.length).toBeGreaterThan(0);
    });
  }

  it('findStarterTemplate returns undefined for unknown names', () => {
    expect(findStarterTemplate('does-not-exist')).toBeUndefined();
  });
});
