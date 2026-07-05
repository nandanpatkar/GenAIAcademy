import { describe, expect, it } from 'vitest';
import {
    buildCurvedPath,
    coerceEdgeCurve,
    curveFromLegacyVariant,
    isOrthogonalStepCurve,
    isSmoothCurve,
} from './edgeCurve';

describe('edgeCurve', () => {
    it('classifies smooth and orthogonal curves correctly', () => {
        expect(isSmoothCurve('basis')).toBe(true);
        expect(isSmoothCurve('catmullRom')).toBe(true);
        expect(isSmoothCurve('linear')).toBe(false);
        expect(isSmoothCurve('step')).toBe(false);
        expect(isOrthogonalStepCurve('step')).toBe(true);
        expect(isOrthogonalStepCurve('smoothstep')).toBe(true);
        expect(isOrthogonalStepCurve('basis')).toBe(false);
    });

    it('builds a path that begins with a move-to', () => {
        const path = buildCurvedPath(
            [
                { x: 0, y: 0 },
                { x: 50, y: 25 },
                { x: 100, y: 0 },
            ],
            'basis'
        );
        expect(path).not.toBeNull();
        expect(path!.startsWith('M')).toBe(true);
    });

    it('returns null for fewer than two distinct points', () => {
        expect(buildCurvedPath([{ x: 5, y: 5 }], 'basis')).toBeNull();
        expect(buildCurvedPath([{ x: 5, y: 5 }, { x: 5, y: 5 }], 'basis')).toBeNull();
    });

    it('returns null for smoothstep (handled elsewhere)', () => {
        expect(buildCurvedPath([{ x: 0, y: 0 }, { x: 10, y: 10 }], 'smoothstep')).toBeNull();
    });

    it('coerces unknown curve strings to fallback', () => {
        expect(coerceEdgeCurve('nope')).toBe('basis');
        expect(coerceEdgeCurve('linear')).toBe('linear');
        expect(coerceEdgeCurve(undefined, 'step')).toBe('step');
    });

    it('maps legacy variants to curves', () => {
        expect(curveFromLegacyVariant('bezier')).toBe('basis');
        expect(curveFromLegacyVariant('smoothstep')).toBe('smoothstep');
        expect(curveFromLegacyVariant('step')).toBe('step');
        expect(curveFromLegacyVariant('straight')).toBe('linear');
    });

    it('produces a linear path that traces every waypoint exactly', () => {
        const path = buildCurvedPath(
            [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
            ],
            'linear'
        );
        // L100,0L100,100 — straight lines should preserve corners verbatim
        expect(path).toContain('100,0');
        expect(path).toContain('100,100');
    });
});
