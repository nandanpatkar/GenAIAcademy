import {
  getMermaidImportCandidateIds,
  normalizeMermaidImportIdentifier,
} from '../importGeometryUtils';
import type {
  ExtractedEdgeLayout,
  ExtractedNodeLayout,
  RawExtractedMermaidGeometry,
} from '../extractLayoutFromSvg';
import type { OfficialFlowchartDefinition } from './types';

function getNodeCenter(node: ExtractedNodeLayout): { x: number; y: number } {
  return { x: node.x + node.width / 2, y: node.y + node.height / 2 };
}

function getDistanceToNodeBounds(
  point: { x: number; y: number },
  node: ExtractedNodeLayout
): number {
  const clampedX = Math.min(Math.max(point.x, node.x), node.x + node.width);
  const clampedY = Math.min(Math.max(point.y, node.y), node.y + node.height);
  const outside = Math.hypot(point.x - clampedX, point.y - clampedY);

  if (outside > 0) {
    return outside;
  }

  return Math.min(
    Math.abs(point.x - node.x),
    Math.abs(node.x + node.width - point.x),
    Math.abs(point.y - node.y),
    Math.abs(node.y + node.height - point.y)
  );
}

function nearestNodeId(
  point: { x: number; y: number },
  nodes: ExtractedNodeLayout[]
): string | null {
  const containing = nodes.filter(
    (node) =>
      point.x >= node.x &&
      point.x <= node.x + node.width &&
      point.y >= node.y &&
      point.y <= node.y + node.height
  );

  if (containing.length > 0) {
    return containing.slice().sort((a, b) => a.width * a.height - b.width * b.height)[0].id;
  }

  let bestId: string | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestCenterDistance = Number.POSITIVE_INFINITY;

  for (const node of nodes) {
    const distance = getDistanceToNodeBounds(point, node);
    const center = getNodeCenter(node);
    const centerDistance = Math.hypot(center.x - point.x, center.y - point.y);

    if (distance < bestDistance || (distance === bestDistance && centerDistance < bestCenterDistance)) {
      bestDistance = distance;
      bestCenterDistance = centerDistance;
      bestId = node.id;
    }
  }

  return bestId;
}

export function mapEdgeEndpoint(
  endpointId: string,
  sectionIdBySubgraphId: Map<string, string>
): string {
  return sectionIdBySubgraphId.get(endpointId) ?? endpointId;
}

export function mapRawNodesByOfficialId(
  rawNodes: RawExtractedMermaidGeometry['nodes']
): Map<string, RawExtractedMermaidGeometry['nodes'][number]> {
  const mapped = new Map<string, RawExtractedMermaidGeometry['nodes'][number]>();

  for (const rawNode of rawNodes) {
    for (const candidate of getMermaidImportCandidateIds(rawNode.rawId)) {
      mapped.set(candidate, rawNode);
      const normalized = normalizeMermaidImportIdentifier(candidate);
      if (normalized) {
        mapped.set(normalized, rawNode);
      }
    }
  }

  return mapped;
}

export function reconcileEdges(
  definition: OfficialFlowchartDefinition,
  rawGeometry: RawExtractedMermaidGeometry,
  leafLayouts: ExtractedNodeLayout[],
  clusterLayouts: ExtractedNodeLayout[],
  sectionIdBySubgraphId: Map<string, string>
): ExtractedEdgeLayout[] {
  const rawEdgeById = new Map<string, RawExtractedMermaidGeometry['edges'][number]>();
  for (const rawEdge of rawGeometry.edges) {
    if (!rawEdge.rawId) continue;
    rawEdgeById.set(rawEdge.rawId, rawEdge);
  }

  const directMatches = definition.edges.flatMap((edge) => {
    const rawEdge = edge.id ? rawEdgeById.get(edge.id) : undefined;
    if (!rawEdge) {
      return [];
    }

    return [{
      source: mapEdgeEndpoint(edge.start, sectionIdBySubgraphId),
      target: mapEdgeEndpoint(edge.end, sectionIdBySubgraphId),
      points: rawEdge.points,
      path: rawEdge.path,
    }];
  });

  if (directMatches.length > 0) {
    return directMatches;
  }

  const routingTargets = [...leafLayouts, ...clusterLayouts];
  return rawGeometry.edges.flatMap((rawEdge) => {
    const source = nearestNodeId(rawEdge.points[0], routingTargets);
    const target = nearestNodeId(rawEdge.points[rawEdge.points.length - 1], routingTargets);
    if (!source || !target) {
      return [];
    }

    return [{ source, target, points: rawEdge.points, path: rawEdge.path }];
  });
}
