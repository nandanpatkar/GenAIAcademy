import type { FlowNode } from '@/lib/types';
import {
  getMermaidImportCandidateIds,
  isMermaidImportPointInsideBounds,
  mermaidImportSetsAreEqual,
  normalizeMermaidImportIdentifier,
} from '../importGeometryUtils';
import type {
  ExtractedEdgeLayout,
  ExtractedNodeLayout,
  RawSvgEdgeLayout,
  RawSvgNodeLayout,
} from './types';

function buildCandidateLookup(
  nodes: FlowNode[],
  options: { allowLabelMatching: boolean }
): Map<string, string[]> {
  const lookup = new Map<string, string[]>();

  for (const node of nodes) {
    const candidates = new Set<string>();
    candidates.add(node.id);

    const normalizedId = normalizeMermaidImportIdentifier(node.id);
    if (normalizedId) candidates.add(normalizedId);

    if (options.allowLabelMatching) {
      const label = normalizeMermaidImportIdentifier(String(node.data?.label ?? ''));
      if (label) candidates.add(label);
    }

    for (const candidate of candidates) {
      const existing = lookup.get(candidate) ?? [];
      existing.push(node.id);
      lookup.set(candidate, existing);
    }
  }

  return lookup;
}

function resolveNodeId(
  raw: RawSvgNodeLayout,
  lookup: Map<string, string[]>,
  usedIds: Set<string>,
  options: { allowLabelFallback: boolean }
): string | null {
  const candidates = new Set<string>();

  for (const rawCandidate of getMermaidImportCandidateIds(raw.rawId)) {
    candidates.add(rawCandidate);
    const normalized = normalizeMermaidImportIdentifier(rawCandidate);
    if (normalized) candidates.add(normalized);
  }

  if (options.allowLabelFallback) {
    const normalizedLabel = normalizeMermaidImportIdentifier(raw.label);
    if (normalizedLabel) candidates.add(normalizedLabel);
  }

  for (const candidate of candidates) {
    const matches = (lookup.get(candidate) ?? []).filter((id) => !usedIds.has(id));
    if (matches.length === 1) {
      usedIds.add(matches[0]);
      return matches[0];
    }
  }

  return null;
}

export function reconcileRawNodes(
  rawNodes: RawSvgNodeLayout[],
  nodes: FlowNode[]
): { resolved: ExtractedNodeLayout[]; matchedCount: number; totalCount: number } {
  const leafNodes = nodes.filter((node) => node.type !== 'section');
  const lookup = buildCandidateLookup(leafNodes, { allowLabelMatching: false });
  const usedIds = new Set<string>();
  const resolved: ExtractedNodeLayout[] = [];

  for (const rawNode of rawNodes) {
    const resolvedId = resolveNodeId(rawNode, lookup, usedIds, { allowLabelFallback: false });
    if (!resolvedId) continue;

    resolved.push({
      id: resolvedId,
      rawId: rawNode.rawId,
      label: rawNode.label,
      x: rawNode.x,
      y: rawNode.y,
      width: rawNode.width,
      height: rawNode.height,
    });
  }

  return { resolved, matchedCount: resolved.length, totalCount: leafNodes.length };
}

function getSectionDescendantLeafIds(nodes: FlowNode[]): Map<string, Set<string>> {
  const childrenByParent = new Map<string, FlowNode[]>();
  for (const node of nodes) {
    if (!node.parentId) continue;
    const bucket = childrenByParent.get(node.parentId) ?? [];
    bucket.push(node);
    childrenByParent.set(node.parentId, bucket);
  }

  const cache = new Map<string, Set<string>>();

  function collect(sectionId: string): Set<string> {
    const cached = cache.get(sectionId);
    if (cached) return cached;

    const leafIds = new Set<string>();
    for (const child of childrenByParent.get(sectionId) ?? []) {
      if (child.type === 'section') {
        for (const id of collect(child.id)) leafIds.add(id);
      } else {
        leafIds.add(child.id);
      }
    }

    cache.set(sectionId, leafIds);
    return leafIds;
  }

  for (const node of nodes) {
    if (node.type === 'section') collect(node.id);
  }

  return cache;
}

export function reconcileRawClusters(
  rawClusters: RawSvgNodeLayout[],
  nodes: FlowNode[],
  resolvedLeaves: ExtractedNodeLayout[]
): { resolved: ExtractedNodeLayout[]; matchedCount: number; totalCount: number } {
  const sectionNodes = nodes.filter((node) => node.type === 'section');
  const lookup = buildCandidateLookup(sectionNodes, { allowLabelMatching: true });
  const usedIds = new Set<string>();
  const resolvedById = new Map<string, ExtractedNodeLayout>();
  const usedClusterIndexes = new Set<number>();

  // Strategy 1 & 2: ID matching + label matching.
  for (const [clusterIndex, rawCluster] of rawClusters.entries()) {
    const resolvedId = resolveNodeId(rawCluster, lookup, usedIds, { allowLabelFallback: true });
    if (!resolvedId) continue;

    resolvedById.set(resolvedId, {
      id: resolvedId,
      rawId: rawCluster.rawId,
      label: rawCluster.label,
      x: rawCluster.x,
      y: rawCluster.y,
      width: rawCluster.width,
      height: rawCluster.height,
    });
    usedClusterIndexes.add(clusterIndex);
  }

  // Strategy 3: Spatial containment — for sections still unmatched (e.g. Mermaid
  // uses numeric IDs like subGraph0 that don't correlate to any section name).
  // Find the cluster whose contained resolved leaf nodes exactly match
  // a section's descendant leaf IDs.
  const unresolvedSections = sectionNodes.filter((node) => !resolvedById.has(node.id));
  if (unresolvedSections.length > 0 && resolvedLeaves.length > 0) {
    const descendantLeafIds = getSectionDescendantLeafIds(nodes);

    const rawClusterLeafIds = rawClusters.map((rawCluster) => {
      const leafIds = new Set<string>();
      for (const leaf of resolvedLeaves) {
        const center = { x: leaf.x + leaf.width / 2, y: leaf.y + leaf.height / 2 };
        if (isMermaidImportPointInsideBounds(center, rawCluster)) leafIds.add(leaf.id);
      }
      return leafIds;
    });

    for (const section of unresolvedSections) {
      const expectedLeafIds = descendantLeafIds.get(section.id);
      if (!expectedLeafIds || expectedLeafIds.size === 0) continue;

      const matches = rawClusterLeafIds
        .map((leafIds, clusterIndex) => ({ clusterIndex, leafIds }))
        .filter(({ clusterIndex, leafIds }) =>
          !usedClusterIndexes.has(clusterIndex)
          && mermaidImportSetsAreEqual(leafIds, expectedLeafIds)
        );

      if (matches.length !== 1) continue;

      const rawCluster = rawClusters[matches[0].clusterIndex];
      resolvedById.set(section.id, {
        id: section.id,
        rawId: rawCluster.rawId,
        label: rawCluster.label,
        x: rawCluster.x,
        y: rawCluster.y,
        width: rawCluster.width,
        height: rawCluster.height,
      });
      usedClusterIndexes.add(matches[0].clusterIndex);
    }
  }

  return {
    resolved: sectionNodes
      .map((node) => resolvedById.get(node.id))
      .filter((node): node is ExtractedNodeLayout => Boolean(node)),
    matchedCount: resolvedById.size,
    totalCount: sectionNodes.length,
  };
}

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

  if (outside > 0) return outside;

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
  // Max distance (px) we'll tolerate between a path endpoint and a node boundary.
  // If no node is within this radius the path likely belongs to a different
  // coordinate space and we skip the match rather than creating a garbage edge.
  const MAX_EDGE_SNAP_DISTANCE = 300;

  // If the point is inside any node, prefer the smallest containing node.
  const containing = nodes.filter((n) =>
    point.x >= n.x && point.x <= n.x + n.width &&
    point.y >= n.y && point.y <= n.y + n.height
  );
  if (containing.length > 0) {
    return containing
      .slice()
      .sort((a, b) => a.width * a.height - b.width * b.height)[0].id;
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

  if (bestDistance > MAX_EDGE_SNAP_DISTANCE) {
    return null;
  }

  return bestId;
}

export function reconcileEdges(
  rawEdges: RawSvgEdgeLayout[],
  resolvedNodes: ExtractedNodeLayout[],
  resolvedClusters: ExtractedNodeLayout[]
): ExtractedEdgeLayout[] {
  const routingTargets = [...resolvedNodes, ...resolvedClusters];

  return rawEdges.flatMap((rawEdge) => {
    const source = nearestNodeId(rawEdge.points[0], routingTargets);
    const target = nearestNodeId(rawEdge.points[rawEdge.points.length - 1], routingTargets);
    if (!source || !target) return [];

    return [{ source, target, points: rawEdge.points, path: rawEdge.path }];
  });
}
