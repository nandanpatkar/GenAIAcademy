import { describe, expect, it } from 'vitest';
import type { FlowEdge, FlowNode } from '@/lib/types';
import { buildElkRootGraph } from './graphBuilding';
import { getLayoutCacheKey } from './layoutCache';

function createNode(id: string, position = { x: 0, y: 0 }, pinned = false): FlowNode {
  return {
    id,
    type: 'process',
    position,
    data: { label: id, ...(pinned ? { pinned: true } : {}) },
  } as FlowNode;
}

describe('anchored layout — buildElkRootGraph', () => {
  it('emits the pinned node with x/y and FIXED placement strategy', () => {
    const pinned = createNode('pinned', { x: 120, y: 80 }, true);
    const free = createNode('free');
    const graph = buildElkRootGraph(
      [pinned, free],
      new Map(),
      [],
      { 'elk.direction': 'DOWN' },
      120,
      40
    );

    const pinnedChild = graph.children?.find((c) => c.id === 'pinned');
    expect(pinnedChild?.x).toBe(120);
    expect(pinnedChild?.y).toBe(80);
    expect(pinnedChild?.layoutOptions?.['org.eclipse.elk.position']).toBe('(120,80)');
    expect(pinnedChild?.layoutOptions?.['org.eclipse.elk.layered.nodePlacement.strategy']).toBe(
      'FIXED'
    );
  });

  it('does not emit position options for unpinned nodes', () => {
    const free = createNode('free', { x: 50, y: 50 });
    const graph = buildElkRootGraph([free], new Map(), [], { 'elk.direction': 'DOWN' }, 120, 40);
    const freeChild = graph.children?.find((c) => c.id === 'free');
    expect(freeChild?.x).toBeUndefined();
    expect(freeChild?.y).toBeUndefined();
    expect(freeChild?.layoutOptions?.['org.eclipse.elk.position']).toBeUndefined();
  });

  it('does not pin compound (parent) nodes — only leaves carry positions', () => {
    const parent = createNode('parent', { x: 10, y: 10 }, true);
    const child = createNode('child');
    const childrenByParent = new Map<string, FlowNode[]>([['parent', [child]]]);
    const graph = buildElkRootGraph(
      [parent],
      childrenByParent,
      [],
      { 'elk.direction': 'DOWN' },
      120,
      40
    );
    const parentChild = graph.children?.find((c) => c.id === 'parent');
    expect(parentChild?.x).toBeUndefined();
    expect(parentChild?.layoutOptions?.['org.eclipse.elk.position']).toBeUndefined();
  });
});

describe('anchored layout — cache key', () => {
  it('changes when a node is pinned vs unpinned', () => {
    const free = createNode('a', { x: 0, y: 0 });
    const pinned = createNode('a', { x: 0, y: 0 }, true);
    const edges: FlowEdge[] = [];
    expect(getLayoutCacheKey([free], edges, {})).not.toEqual(
      getLayoutCacheKey([pinned], edges, {})
    );
  });

  it('changes when a pinned node moves', () => {
    const a1 = createNode('a', { x: 10, y: 10 }, true);
    const a2 = createNode('a', { x: 200, y: 200 }, true);
    expect(getLayoutCacheKey([a1], [], {})).not.toEqual(getLayoutCacheKey([a2], [], {}));
  });

  it('does not change when an unpinned node moves (positions are recomputed anyway)', () => {
    const a1 = createNode('a', { x: 10, y: 10 });
    const a2 = createNode('a', { x: 200, y: 200 });
    expect(getLayoutCacheKey([a1], [], {})).toEqual(getLayoutCacheKey([a2], [], {}));
  });
});
