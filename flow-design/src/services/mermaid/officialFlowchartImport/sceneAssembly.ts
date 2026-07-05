import type { FlowNode } from '@/lib/types';
import { normalizeMermaidImportIdentifier } from '../importGeometryUtils';
import type {
  ExtractedEdgeLayout,
  ExtractedNodeLayout,
  RawExtractedMermaidGeometry,
} from '../extractLayoutFromSvg';
import type {
  MermaidImportSceneEdge,
  MermaidImportSceneNode,
} from '../importSceneProjection';
import { mapEdgeEndpoint } from './edgeReconciliation';
import type { OfficialFlowchartDefinition } from './types';

export function createLeafSceneNodes(
  leafIds: string[],
  parserNodesById: Map<string, FlowNode>,
  rawNodeByOfficialId: Map<string, RawExtractedMermaidGeometry['nodes'][number]>,
  definition: OfficialFlowchartDefinition,
  directParentSubgraphByLeafId: Map<string, string>,
  sectionIdBySubgraphId: Map<string, string>
): { sceneNodes: MermaidImportSceneNode[]; leafLayouts: ExtractedNodeLayout[] } {
  const sceneNodes: MermaidImportSceneNode[] = [];
  const leafLayouts: ExtractedNodeLayout[] = [];

  for (const leafId of leafIds) {
    const parserNode = parserNodesById.get(leafId);
    const rawNode =
      rawNodeByOfficialId.get(leafId) ??
      rawNodeByOfficialId.get(normalizeMermaidImportIdentifier(leafId) ?? '');
    const vertexText = definition.verticesMap.get(leafId)?.text;
    const parentSubgraphId = directParentSubgraphByLeafId.get(leafId);
    const parentId = parentSubgraphId ? sectionIdBySubgraphId.get(parentSubgraphId) : undefined;

    if (rawNode) {
      leafLayouts.push({
        id: leafId,
        rawId: rawNode.rawId,
        label: rawNode.label,
        x: rawNode.x,
        y: rawNode.y,
        width: rawNode.width,
        height: rawNode.height,
      });
    }

    sceneNodes.push({
      id: leafId,
      kind: 'leaf',
      label: rawNode?.label ?? vertexText ?? String(parserNode?.data?.label ?? leafId),
      parentId,
      position: { x: rawNode?.x ?? 0, y: rawNode?.y ?? 0 },
      width: rawNode?.width,
      height: rawNode?.height,
      sourceNode: parserNode,
      mermaidShapeType: definition.verticesMap.get(leafId)?.type,
    });
  }

  return { sceneNodes, leafLayouts };
}

export function createContainerSceneNodes(
  definition: OfficialFlowchartDefinition,
  parserNodesById: Map<string, FlowNode>,
  directParentSubgraphBySubgraphId: Map<string, string>,
  sectionIdBySubgraphId: Map<string, string>,
  clusterLayouts: Map<string, ExtractedNodeLayout>
): MermaidImportSceneNode[] {
  return definition.subgraphs.map((subgraph) => {
    const sectionId = sectionIdBySubgraphId.get(subgraph.id) as string;
    const cluster = clusterLayouts.get(sectionId);
    const parentSubgraphId = directParentSubgraphBySubgraphId.get(subgraph.id);
    const parentId = parentSubgraphId ? sectionIdBySubgraphId.get(parentSubgraphId) : undefined;
    const parserSection = parserNodesById.get(sectionId);

    return {
      id: sectionId,
      kind: 'container',
      label: subgraph.title || String(parserSection?.data?.label ?? sectionId),
      parentId,
      position: { x: cluster?.x ?? 0, y: cluster?.y ?? 0 },
      width: cluster?.width,
      height: cluster?.height,
      sourceNode: parserSection,
    };
  });
}

export function createSceneEdges(
  definition: OfficialFlowchartDefinition,
  sectionIdBySubgraphId: Map<string, string>,
  reconciledEdges: ExtractedEdgeLayout[]
): {
  sceneEdges: MermaidImportSceneEdge[];
  matchedEdgeGeometryCount: number;
} {
  const reconciledEdgeBuckets = new Map<string, ExtractedEdgeLayout[]>();
  for (const edge of reconciledEdges) {
    const key = `${edge.source}::${edge.target}`;
    const bucket = reconciledEdgeBuckets.get(key) ?? [];
    bucket.push(edge);
    reconciledEdgeBuckets.set(key, bucket);
  }

  let matchedEdgeGeometryCount = 0;
  const sceneEdges = definition.edges.map((edge, index) => {
    const source = mapEdgeEndpoint(edge.start, sectionIdBySubgraphId);
    const target = mapEdgeEndpoint(edge.end, sectionIdBySubgraphId);
    const key = `${source}::${target}`;
    const matchedGeometry = reconciledEdgeBuckets.get(key)?.shift();
    if (matchedGeometry) {
      matchedEdgeGeometryCount += 1;
    }

    return {
      id: edge.id || `e-mermaid-${index}`,
      source,
      target,
      label: edge.text || undefined,
      stroke: (edge.stroke === 'thick' || edge.stroke === 'dotted' ? edge.stroke : 'normal') as 'normal' | 'thick' | 'dotted',
      routePath: matchedGeometry?.path,
      routePoints: matchedGeometry?.points,
    };
  });

  return { sceneEdges, matchedEdgeGeometryCount };
}
