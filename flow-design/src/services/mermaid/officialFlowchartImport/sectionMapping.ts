import type { FlowNode } from '@/lib/types';
import {
  getMermaidImportCandidateIds,
  isMermaidImportPointInsideBounds,
  mermaidImportSetsAreEqual,
  normalizeMermaidImportIdentifier,
} from '../importGeometryUtils';
import type {
  ExtractedNodeLayout,
  RawExtractedMermaidGeometry,
} from '../extractLayoutFromSvg';
import type { OfficialFlowchartDefinition, OfficialFlowchartSubgraph } from './types';

export function createSyntheticSectionId(title: string, takenIds: Set<string>): string {
  const base = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
  let candidate = base;
  let counter = 1;
  while (takenIds.has(candidate)) {
    candidate = `${base}-${counter++}`;
  }
  takenIds.add(candidate);
  return candidate;
}

export function collectParserSectionLeafSets(nodes: FlowNode[]): Map<string, Set<string>> {
  const childrenByParent = new Map<string, FlowNode[]>();
  for (const node of nodes) {
    if (!node.parentId) continue;
    const children = childrenByParent.get(node.parentId) ?? [];
    children.push(node);
    childrenByParent.set(node.parentId, children);
  }

  const cache = new Map<string, Set<string>>();

  function collect(sectionId: string): Set<string> {
    const cached = cache.get(sectionId);
    if (cached) return cached;

    const leafIds = new Set<string>();
    for (const child of childrenByParent.get(sectionId) ?? []) {
      if (child.type === 'section') {
        for (const id of collect(child.id)) {
          leafIds.add(id);
        }
      } else {
        leafIds.add(child.id);
      }
    }

    cache.set(sectionId, leafIds);
    return leafIds;
  }

  for (const node of nodes) {
    if (node.type === 'section') {
      collect(node.id);
    }
  }

  return cache;
}

export function expandSubgraphLeafIds(
  subgraphId: string,
  subgraphsById: Map<string, OfficialFlowchartSubgraph>,
  visiting = new Set<string>()
): Set<string> {
  const subgraph = subgraphsById.get(subgraphId);
  if (!subgraph || visiting.has(subgraphId)) {
    return new Set();
  }

  visiting.add(subgraphId);
  const leafIds = new Set<string>();
  for (const nodeId of subgraph.nodes) {
    if (subgraphsById.has(nodeId)) {
      for (const nestedId of expandSubgraphLeafIds(nodeId, subgraphsById, visiting)) {
        leafIds.add(nestedId);
      }
    } else {
      leafIds.add(nodeId);
    }
  }
  visiting.delete(subgraphId);
  return leafIds;
}

export function getDirectParentSubgraphBySubgraphId(
  definition: OfficialFlowchartDefinition
): Map<string, string> {
  const directParentBySubgraphId = new Map<string, string>();

  for (const subgraph of definition.subgraphs) {
    const parent = definition.subgraphs.find(
      (candidate) => candidate.id !== subgraph.id && candidate.nodes.includes(subgraph.id)
    );
    if (parent) {
      directParentBySubgraphId.set(subgraph.id, parent.id);
    }
  }

  return directParentBySubgraphId;
}

export function getDirectParentSubgraphByLeafId(
  leafIds: string[],
  definition: OfficialFlowchartDefinition,
  subgraphLeafSets: Map<string, Set<string>>
): Map<string, string> {
  const directParentByLeafId = new Map<string, string>();

  for (const leafId of leafIds) {
    const directParent = definition.subgraphs.find((subgraph) => subgraph.nodes.includes(leafId));
    if (directParent) {
      directParentByLeafId.set(leafId, directParent.id);
      continue;
    }

    const fallbackParent = definition.subgraphs
      .filter((subgraph) => subgraphLeafSets.get(subgraph.id)?.has(leafId))
      .sort(
        (left, right) =>
          (subgraphLeafSets.get(left.id)?.size ?? Number.POSITIVE_INFINITY) -
          (subgraphLeafSets.get(right.id)?.size ?? Number.POSITIVE_INFINITY)
      )[0];
    if (fallbackParent) {
      directParentByLeafId.set(leafId, fallbackParent.id);
    }
  }

  return directParentByLeafId;
}

export function mapClusterLayouts(
  subgraphs: OfficialFlowchartSubgraph[],
  subgraphLeafSets: Map<string, Set<string>>,
  sectionIdBySubgraphId: Map<string, string>,
  rawGeometry: RawExtractedMermaidGeometry,
  leafLayouts: ExtractedNodeLayout[]
): Map<string, ExtractedNodeLayout> {
  const layoutBySectionId = new Map<string, ExtractedNodeLayout>();
  const usedClusters = new Set<number>();

  const rawClusterLeafSets = rawGeometry.clusters.map((cluster) => {
    const leafIds = new Set<string>();
    for (const leaf of leafLayouts) {
      const center = { x: leaf.x + leaf.width / 2, y: leaf.y + leaf.height / 2 };
      if (isMermaidImportPointInsideBounds(center, cluster)) {
        leafIds.add(leaf.id);
      }
    }
    return leafIds;
  });

  for (const subgraph of subgraphs) {
    const sectionId = sectionIdBySubgraphId.get(subgraph.id);
    if (!sectionId) continue;

    const normalizedTitle = normalizeMermaidImportIdentifier(subgraph.title);
    const normalizedSubgraphId = normalizeMermaidImportIdentifier(subgraph.id);
    let clusterIndex = rawGeometry.clusters.findIndex((cluster, index) => {
      if (usedClusters.has(index)) return false;
      const rawCandidates = getMermaidImportCandidateIds(cluster.rawId);
      if (rawCandidates.includes(subgraph.id)) return true;
      if (
        normalizedSubgraphId &&
        rawCandidates.some(
          (candidate) => normalizeMermaidImportIdentifier(candidate) === normalizedSubgraphId
        )
      ) {
        return true;
      }
      return normalizedTitle !== null && normalizeMermaidImportIdentifier(cluster.label) === normalizedTitle;
    });

    if (clusterIndex < 0) {
      const expectedLeafIds = subgraphLeafSets.get(subgraph.id);
      if (expectedLeafIds?.size) {
        clusterIndex = rawClusterLeafSets.findIndex(
          (leafIds, index) =>
            !usedClusters.has(index) && mermaidImportSetsAreEqual(leafIds, expectedLeafIds)
        );
      }
    }

    if (clusterIndex < 0) continue;

    usedClusters.add(clusterIndex);
    const cluster = rawGeometry.clusters[clusterIndex];
    layoutBySectionId.set(sectionId, {
      id: sectionId,
      rawId: cluster.rawId,
      label: cluster.label,
      x: cluster.x,
      y: cluster.y,
      width: cluster.width,
      height: cluster.height,
    });
  }

  return layoutBySectionId;
}
