import type { FlowNode } from '@/lib/types';
import { extractRawMermaidGeometry } from './extractLayoutFromSvg';
import {
  projectMermaidImportScene,
  type MermaidImportScene,
} from './importSceneProjection';
import { mermaidImportSetsAreEqual, normalizeMermaidImportIdentifier } from './importGeometryUtils';
import {
  mapRawNodesByOfficialId,
  reconcileEdges,
} from './officialFlowchartImport/edgeReconciliation';
import { extractOfficialFlowchartDefinition } from './officialFlowchartImport/runtime';
import {
  collectParserSectionLeafSets,
  createSyntheticSectionId,
  expandSubgraphLeafIds,
  getDirectParentSubgraphByLeafId,
  getDirectParentSubgraphBySubgraphId,
  mapClusterLayouts,
} from './officialFlowchartImport/sectionMapping';
import {
  createContainerSceneNodes,
  createLeafSceneNodes,
  createSceneEdges,
} from './officialFlowchartImport/sceneAssembly';
import type { OfficialFlowchartImportGraph } from './officialFlowchartImport/types';

export type { OfficialFlowchartImportGraph } from './officialFlowchartImport/types';

function resolveSectionIdsBySubgraph(
  definition: Awaited<ReturnType<typeof extractOfficialFlowchartDefinition>>,
  parserSections: FlowNode[],
  parserSectionLeafSets: Map<string, Set<string>>,
  subgraphLeafSets: Map<string, Set<string>>,
  takenIds: Set<string>
): Map<string, string> {
  const sectionIdBySubgraphId = new Map<string, string>();
  if (!definition) return sectionIdBySubgraphId;

  for (const subgraph of definition.subgraphs) {
    const normalizedSubgraphId = normalizeMermaidImportIdentifier(subgraph.id);
    const rawIdMatch = parserSections.filter((section) => {
      const parserRawId = normalizeMermaidImportIdentifier(
        typeof section.data?.sectionMermaidId === 'string' ? section.data.sectionMermaidId : undefined
      );
      return parserRawId && normalizedSubgraphId && parserRawId === normalizedSubgraphId;
    });
    if (rawIdMatch.length === 1) {
      sectionIdBySubgraphId.set(subgraph.id, rawIdMatch[0].id);
      continue;
    }

    const expectedLeafIds = subgraphLeafSets.get(subgraph.id) ?? new Set<string>();
    const exactLeafMatch = parserSections.filter((section) =>
      mermaidImportSetsAreEqual(parserSectionLeafSets.get(section.id) ?? new Set<string>(), expectedLeafIds)
    );

    if (exactLeafMatch.length === 1) {
      sectionIdBySubgraphId.set(subgraph.id, exactLeafMatch[0].id);
      continue;
    }

    const normalizedTitle = normalizeMermaidImportIdentifier(subgraph.title);
    const titleMatch = parserSections.filter(
      (section) =>
        normalizedTitle &&
        (
          normalizeMermaidImportIdentifier(
            typeof section.data?.sectionMermaidTitle === 'string'
              ? section.data.sectionMermaidTitle
              : undefined
          ) === normalizedTitle
          || normalizeMermaidImportIdentifier(String(section.data?.label ?? '')) === normalizedTitle
        )
    );
    if (titleMatch.length === 1) {
      sectionIdBySubgraphId.set(subgraph.id, titleMatch[0].id);
      continue;
    }

    sectionIdBySubgraphId.set(
      subgraph.id,
      createSyntheticSectionId(subgraph.title || subgraph.id || 'section', takenIds)
    );
  }

  return sectionIdBySubgraphId;
}

export async function buildOfficialFlowchartImportGraph(
  mermaidSource: string,
  parserNodes: FlowNode[]
): Promise<OfficialFlowchartImportGraph | null> {
  const [definition, rawGeometry] = await Promise.all([
    extractOfficialFlowchartDefinition(mermaidSource),
    extractRawMermaidGeometry(mermaidSource),
  ]);

  if (!definition) {
    return null;
  }

  const parserNodesById = new Map(parserNodes.map((node) => [node.id, node]));
  const parserSectionLeafSets = collectParserSectionLeafSets(parserNodes);
  const parserSections = parserNodes.filter((node) => node.type === 'section');
  const takenIds = new Set(parserNodes.map((node) => node.id));
  const subgraphsById = new Map(definition.subgraphs.map((subgraph) => [subgraph.id, subgraph]));
  const subgraphLeafSets = new Map(
    definition.subgraphs.map((subgraph) => [
      subgraph.id,
      expandSubgraphLeafIds(subgraph.id, subgraphsById),
    ])
  );

  const sectionIdBySubgraphId = resolveSectionIdsBySubgraph(
    definition,
    parserSections,
    parserSectionLeafSets,
    subgraphLeafSets,
    takenIds
  );

  const officialLeafIds = new Set<string>();
  definition.verticesMap.forEach((_, id) => officialLeafIds.add(id));
  definition.edges.forEach((edge) => {
    if (!subgraphsById.has(edge.start)) officialLeafIds.add(edge.start);
    if (!subgraphsById.has(edge.end)) officialLeafIds.add(edge.end);
  });
  for (const leafSet of subgraphLeafSets.values()) {
    for (const id of leafSet) officialLeafIds.add(id);
  }

  if (officialLeafIds.size === 0) {
    return null;
  }

  const leafIds = [...officialLeafIds];
  const directParentSubgraphByLeafId = getDirectParentSubgraphByLeafId(
    leafIds,
    definition,
    subgraphLeafSets
  );
  const directParentSubgraphBySubgraphId = getDirectParentSubgraphBySubgraphId(definition);

  const rawNodeByOfficialId = mapRawNodesByOfficialId(rawGeometry.nodes);
  const { sceneNodes: leafSceneNodes, leafLayouts } = createLeafSceneNodes(
    leafIds,
    parserNodesById,
    rawNodeByOfficialId,
    definition,
    directParentSubgraphByLeafId,
    sectionIdBySubgraphId
  );
  const clusterLayouts = mapClusterLayouts(
    definition.subgraphs,
    subgraphLeafSets,
    sectionIdBySubgraphId,
    rawGeometry,
    leafLayouts
  );
  const containerSceneNodes = createContainerSceneNodes(
    definition,
    parserNodesById,
    directParentSubgraphBySubgraphId,
    sectionIdBySubgraphId,
    clusterLayouts
  );
  const reconciledEdges = reconcileEdges(
    definition,
    rawGeometry,
    leafLayouts,
    [...clusterLayouts.values()],
    sectionIdBySubgraphId
  );
  const { sceneEdges, matchedEdgeGeometryCount } = createSceneEdges(
    definition,
    sectionIdBySubgraphId,
    reconciledEdges
  );

  const scene: MermaidImportScene = {
    nodes: [...leafSceneNodes, ...containerSceneNodes],
    edges: sceneEdges,
  };
  const projected = projectMermaidImportScene(scene);

  const issues: string[] = [];
  if (leafLayouts.length < leafIds.length) {
    issues.push(`matched ${leafLayouts.length}/${leafIds.length} official flowchart nodes`);
  }
  if (clusterLayouts.size < definition.subgraphs.length) {
    issues.push(`matched ${clusterLayouts.size}/${definition.subgraphs.length} official flowchart sections`);
  }
  if (matchedEdgeGeometryCount < projected.edges.length) {
    issues.push(`matched ${matchedEdgeGeometryCount}/${projected.edges.length} official flowchart edge routes`);
  }

  // TD is an alias for TB; normalize.
  const rawDir = definition.direction;
  const direction = rawDir === 'TD' ? 'TB' : rawDir;

  return {
    nodes: projected.nodes,
    edges: projected.edges,
    matchedLeafNodeCount: leafLayouts.length,
    totalLeafNodeCount: leafIds.length,
    matchedSectionCount: clusterLayouts.size,
    totalSectionCount: definition.subgraphs.length,
    matchedEdgeGeometryCount,
    totalEdgeCount: projected.edges.length,
    direction,
    reason: issues.length > 0 ? issues.join('; ') : undefined,
  };
}
