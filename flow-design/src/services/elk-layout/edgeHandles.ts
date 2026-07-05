import { NODE_HEIGHT, NODE_WIDTH } from '@/constants';
import { clearStoredRouteData } from '@/lib/edgeRouteData';
import { getNodeHandleIdForSide } from '@/lib/nodeHandles';
import type { FlowEdge, FlowNode } from '@/lib/types';
import { assignSmartHandlesWithOptions, handleSideFromVector } from '../smartEdgeRouting';
import type { NodeBounds } from './boundaryFanout';
import { getNodeBoundsFromPositionMap } from './fallbackLayout';

function inferHandleSideFromPoint(
  bounds: NodeBounds,
  point: { x: number; y: number },
  adjacentPoint?: { x: number; y: number }
): 'left' | 'right' | 'top' | 'bottom' {
  const dx = adjacentPoint ? adjacentPoint.x - point.x : point.x - bounds.centerX;
  const dy = adjacentPoint ? adjacentPoint.y - point.y : point.y - bounds.centerY;
  return handleSideFromVector(dx, dy);
}

function staggerParallelEdgeLabels(edges: FlowEdge[]): FlowEdge[] {
  if (!edges.some((e) => e.label)) return edges;

  const pairCounts = new Map<string, number>();
  const pairIndex = new Map<string, number>();

  for (const edge of edges) {
    const key = [edge.source, edge.target].sort().join('|');
    pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
  }

  return edges.map((edge) => {
    const key = [edge.source, edge.target].sort().join('|');
    const count = pairCounts.get(key) ?? 1;
    if (count <= 1 || !edge.label) return edge;

    const idx = pairIndex.get(key) ?? 0;
    pairIndex.set(key, idx + 1);

    // Spread labels across 0.3–0.7 range to avoid pile-up at the midpoint.
    const spread = 0.4;
    const labelPosition = 0.5 + spread * (idx / (count - 1) - 0.5);

    return {
      ...edge,
      data: {
        ...edge.data,
        labelPosition: edge.data?.labelPosition ?? labelPosition,
      },
    };
  });
}

export function applyElkHandles(
  edges: FlowEdge[],
  nodes: FlowNode[],
  positionMap: Map<string, { x: number; y: number; width?: number; height?: number }>,
  edgePointsMap: Map<string, { x: number; y: number }[]>
): FlowEdge[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const routed = edges.map((edge) => {
    if (edge.source === edge.target) return edge;
    const points = edgePointsMap.get(edge.id);
    if (!points || points.length < 2) return edge;
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    if (!sourceNode || !targetNode) return edge;
    const sourceBounds = getNodeBoundsFromPositionMap(sourceNode, positionMap, NODE_WIDTH, NODE_HEIGHT);
    const targetBounds = getNodeBoundsFromPositionMap(targetNode, positionMap, NODE_WIDTH, NODE_HEIGHT);
    const sourceSide = inferHandleSideFromPoint(sourceBounds, points[0], points[1]);
    const targetSide = inferHandleSideFromPoint(
      targetBounds,
      points[points.length - 1],
      points[points.length - 2]
    );
    const sourceHandle = getNodeHandleIdForSide(sourceNode, sourceSide);
    const targetHandle = getNodeHandleIdForSide(targetNode, targetSide);
    if (edge.sourceHandle === sourceHandle && edge.targetHandle === targetHandle) return edge;
    return { ...edge, sourceHandle, targetHandle };
  });
  return staggerParallelEdgeLabels(routed);
}

export function resolveLayoutedEdgeHandles(nodes: FlowNode[], edges: FlowEdge[]): FlowEdge[] {
  return assignSmartHandlesWithOptions(nodes, edges, {
    profile: 'standard',
    bundlingEnabled: true,
  });
}

/**
 * Re-routes all edges using smart handle assignment, clearing any stale ELK waypoints.
 * Use this after manual node moves to clean up all edges without re-running the full layout.
 */
export function rerouteEdges(nodes: FlowNode[], edges: FlowEdge[]): FlowEdge[] {
  return resolveLayoutedEdgeHandles(nodes, edges).map((edge) => ({
    ...edge,
    data: clearStoredRouteData(edge),
  }));
}

export function enforceDirectionalHandles(
  edges: FlowEdge[],
  direction: 'TB' | 'LR' | 'RL' | 'BT'
): FlowEdge[] {
  const isLR = direction === 'LR' || direction === 'RL';
  const sourceHandle = isLR ? 'right' : 'bottom';
  const targetHandle = isLR ? 'left' : 'top';

  return edges.map((edge) => ({
    ...edge,
    sourceHandle: edge.sourceHandle || sourceHandle,
    targetHandle: edge.targetHandle || targetHandle,
  }));
}
