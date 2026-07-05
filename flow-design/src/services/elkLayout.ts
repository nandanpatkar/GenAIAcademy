import type { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk.bundled.js';
import { NODE_HEIGHT, NODE_WIDTH } from '@/constants';
import { createLogger } from '@/lib/logger';
import type { FlowEdge, FlowNode } from '@/lib/types';
import {
  isSparseDiagram,
  resolveAutomaticLayoutAlgorithm,
  shouldUseLightweightLayoutPostProcessing,
} from './elk-layout/algorithmSelection';
import {
  buildDynamicLayerOrder,
  resolveEffectiveDiagramType,
  sortTopLevelNodesForArchitecture,
} from './elk-layout/architectureLayout';
import { normalizeElkEdgeBoundaryFanout } from './elk-layout/boundaryFanout';
import { normalizeLayoutInputsForDeterminism } from './elk-layout/determinism';
import {
  applyElkHandles,
  resolveLayoutedEdgeHandles,
} from './elk-layout/edgeHandles';
import { applyRecursiveFallbackLayout } from './elk-layout/fallbackLayout';
import {
  IMPORT_NODE_MIN_HEIGHT,
  IMPORT_NODE_MIN_WIDTH,
  applyElkLayoutToNodes,
  buildElkRootGraph,
  buildPositionMap,
} from './elk-layout/graphBuilding';
import {
  getCachedLayout,
  getLayoutCacheKey,
  setCachedLayout,
} from './elk-layout/layoutCache';
import {
  buildResolvedLayoutConfiguration,
  getDeterministicSeedOptions,
  resolveLayoutPresetOptions,
} from './elk-layout/options';
import { getElkInstance } from './elk-layout/runtime';
import type { LayoutOptions } from './elk-layout/types';

const logger = createLogger({ scope: 'elkLayout' });

// Re-exported public surface (preserved exactly as before the split).
export type { LayoutAlgorithm, LayoutDirection, LayoutOptions } from './elk-layout/types';
export {
  buildResolvedLayoutConfiguration,
  getDeterministicSeedOptions,
  normalizeLayoutInputsForDeterminism,
  normalizeElkEdgeBoundaryFanout,
  resolveLayoutPresetOptions,
};
export {
  isSparseDiagram,
  resolveAutomaticLayoutAlgorithm,
  shouldUseLightweightLayoutPostProcessing,
} from './elk-layout/algorithmSelection';
export {
  enforceDirectionalHandles,
  resolveLayoutedEdgeHandles,
  rerouteEdges,
} from './elk-layout/edgeHandles';
export {
  applyElkLayoutToNodes,
  normalizeParentedElkPositions,
} from './elk-layout/graphBuilding';
export { clearLayoutCache } from './elk-layout/layoutCache';
export { resetElkInstance } from './elk-layout/runtime';

function collectEdgePoints(
  elkNode: ElkNode | (ElkNode & { edges?: ElkExtendedEdge[]; children?: ElkNode[] }),
  edgePointsMap: Map<string, { x: number; y: number }[]>
): void {
  if (elkNode.edges) {
    elkNode.edges.forEach((layeredElkEdge) => {
      if (layeredElkEdge.sections && layeredElkEdge.sections.length > 0) {
        const section = layeredElkEdge.sections[0];
        const points = [
          section.startPoint,
          ...(section.bendPoints || []),
          section.endPoint,
        ].filter(Boolean) as { x: number; y: number }[];
        edgePointsMap.set(layeredElkEdge.id, points);
      }
    });
  }
  if (elkNode.children) {
    elkNode.children.forEach((childNode) => collectEdgePoints(childNode, edgePointsMap));
  }
}

export async function getElkLayout(
  nodes: FlowNode[],
  edges: FlowEdge[],
  options: LayoutOptions = {}
): Promise<{ nodes: FlowNode[]; edges: FlowEdge[] }> {
  const effectiveDiagramType = resolveEffectiveDiagramType(nodes, options.diagramType);
  const requestedAlgorithm = resolveAutomaticLayoutAlgorithm(nodes, edges, {
    ...options,
    diagramType: effectiveDiagramType,
  });
  // Force/stress/radial crash inside elkjs (`pe` null deref) when the graph
  // has any compound nodes + INCLUDE_CHILDREN. Coerce to layered in that case.
  const hasCompoundNodes = nodes.some((node) => {
    const parentId = (node as { parentId?: string | null }).parentId;
    return typeof parentId === 'string' && parentId.length > 0;
  });
  const algorithm =
    hasCompoundNodes && (requestedAlgorithm === 'force' || requestedAlgorithm === 'stress' || requestedAlgorithm === 'radial')
      ? 'layered'
      : requestedAlgorithm;
  const cacheKey = getLayoutCacheKey(nodes, edges, {
    ...options,
    algorithm,
    diagramType: effectiveDiagramType,
  });
  const cached = getCachedLayout(cacheKey);
  if (cached) return cached;
  const baseConfiguration = buildResolvedLayoutConfiguration({
    ...options,
    algorithm,
    diagramType: effectiveDiagramType,
  });
  // Anchored layout: when any node is pinned, switch ELK to interactive mode
  // so it honors the per-node `x`/`y` positions emitted by buildElkNode.
  const hasPinnedNodes = nodes.some((node) => node.data?.pinned === true);
  const layoutOptions = hasPinnedNodes
    ? {
        ...baseConfiguration.layoutOptions,
        'org.eclipse.elk.interactiveLayout': 'true',
        'org.eclipse.elk.layered.layering.strategy': 'INTERACTIVE',
      }
    : baseConfiguration.layoutOptions;
  const { topLevelNodes, childrenByParent, sortedEdges } = normalizeLayoutInputsForDeterminism(
    nodes,
    edges
  );
  const orderedTopLevelNodes =
    effectiveDiagramType === 'architecture' || effectiveDiagramType === 'infrastructure'
      ? sortTopLevelNodesForArchitecture(topLevelNodes, buildDynamicLayerOrder(nodes))
      : topLevelNodes;

  const isImport = options.source === 'import';
  const nodeMinWidth = isImport ? IMPORT_NODE_MIN_WIDTH : NODE_WIDTH;
  const nodeMinHeight = isImport ? IMPORT_NODE_MIN_HEIGHT : NODE_HEIGHT;

  // INCLUDE_CHILDREN at root + edges nested inside compound children + the
  // layered algorithm triggers an elkjs internal crash (`pe` null deref).
  // Only enable INCLUDE_CHILDREN when at least one edge actually crosses the
  // root boundary (source/target have different top-level ancestors).
  const topLevelAncestor = new Map<string, string>();
  for (const node of nodes) {
    const parentId = (node as { parentId?: string | null }).parentId;
    if (!parentId) topLevelAncestor.set(node.id, node.id);
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of nodes) {
      if (topLevelAncestor.has(node.id)) continue;
      const parentId = (node as { parentId?: string | null }).parentId ?? '';
      const parentTop = topLevelAncestor.get(parentId);
      if (parentTop) {
        topLevelAncestor.set(node.id, parentTop);
        changed = true;
      }
    }
  }
  const hasCrossHierarchyEdge = edges.some((edge) => {
    const a = topLevelAncestor.get(edge.source);
    const b = topLevelAncestor.get(edge.target);
    return a && b && a !== b;
  });
  const effectiveLayoutOptions = hasCrossHierarchyEdge
    ? layoutOptions
    : (() => {
        const next = { ...layoutOptions };
        delete next['elk.hierarchyHandling'];
        return next;
      })();

  // Drop edges whose endpoints aren't present in the node set. elkjs crashes
  // with a null `pe` deref when an edge references a missing node (common after
  // partial Mermaid imports where a vertex failed to materialize).
  const nodeIdSet = new Set(nodes.map((node) => node.id));
  const safeEdges = sortedEdges.filter(
    (edge) => nodeIdSet.has(edge.source) && nodeIdSet.has(edge.target)
  );
  if (safeEdges.length < sortedEdges.length) {
    logger.warn('Dropped edges with missing endpoints before ELK layout.', {
      dropped: sortedEdges.length - safeEdges.length,
      total: sortedEdges.length,
    });
  }

  const elkGraph = buildElkRootGraph(
    orderedTopLevelNodes,
    childrenByParent,
    safeEdges,
    effectiveLayoutOptions,
    nodeMinWidth,
    nodeMinHeight
  );

  try {
    const elk = await getElkInstance();
    const layoutResult = await elk.layout(elkGraph);
    const positionMap = buildPositionMap(layoutResult);

    // Collect bend points by traversing the ENTIRE ELK result tree.
    // ELK puts routed edges inside children[].edges, NOT at the root level.
    const edgePointsMap = new Map<string, { x: number; y: number }[]>();
    collectEdgePoints(layoutResult, edgePointsMap);

    const laidOutNodes = applyElkLayoutToNodes(nodes, positionMap);
    const sparse = isSparseDiagram(nodes.length, safeEdges.length);
    const useLightweightPostProcessing = shouldUseLightweightLayoutPostProcessing(
      nodes.length,
      safeEdges.length,
      effectiveDiagramType
    );

    // For sparse/small diagrams: use smart position-based handle assignment + bezier routing.
    // For dense diagrams: infer handles directly from ELK's computed waypoints — more accurate.
    const reroutedEdges =
      sparse || useLightweightPostProcessing
        ? resolveLayoutedEdgeHandles(laidOutNodes, safeEdges)
        : applyElkHandles(safeEdges, laidOutNodes, positionMap, edgePointsMap);

    const normalizedElkPointsMap =
      sparse || useLightweightPostProcessing
        ? new Map<string, { x: number; y: number }[]>()
        : normalizeElkEdgeBoundaryFanout(reroutedEdges, laidOutNodes, positionMap, edgePointsMap);

    const laidOutEdges = reroutedEdges.map((edge) => {
      if (sparse || useLightweightPostProcessing) {
        return {
          ...edge,
          data: {
            ...edge.data,
            routingMode:
              edge.data?.routingMode === 'manual' ? ('manual' as const) : ('auto' as const),
            elkPoints: undefined,
            importRoutePoints: undefined,
            importRoutePath: undefined,
          },
        };
      }
      const points = normalizedElkPointsMap.get(edge.id) ?? edgePointsMap.get(edge.id);
      if (points) {
        return {
          ...edge,
          data: {
            ...edge.data,
            routingMode:
              edge.data?.routingMode === 'manual' ? ('manual' as const) : ('elk' as const),
            elkPoints: points,
            importRoutePoints: undefined,
            importRoutePath: undefined,
          },
        };
      }
      return edge;
    });

    setCachedLayout(cacheKey, laidOutNodes, laidOutEdges);

    return { nodes: laidOutNodes, edges: laidOutEdges };
  } catch (err) {
    logger.error('ELK layout error.', {
      error: err,
      nodeCount: nodes.length,
      edgeCount: safeEdges.length,
      diagramType: effectiveDiagramType,
      algorithm,
    });
    const fallbackNodes = applyRecursiveFallbackLayout(nodes, options, nodeMinWidth, nodeMinHeight);
    return {
      nodes: fallbackNodes,
      edges: resolveLayoutedEdgeHandles(fallbackNodes, safeEdges),
    };
  }
}
