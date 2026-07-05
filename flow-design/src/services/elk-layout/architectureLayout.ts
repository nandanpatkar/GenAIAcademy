import type { FlowNode } from '@/lib/types';

const FALLBACK_LAYER_ORDER = ['edge', 'frontend', 'api', 'services', 'data', 'external'] as const;

const FALLBACK_LAYER_KEYWORDS: ReadonlyArray<{
  layer: (typeof FALLBACK_LAYER_ORDER)[number];
  keywords: string[];
}> = [
  { layer: 'edge', keywords: ['edge', 'gateway', 'cdn'] },
  { layer: 'frontend', keywords: ['frontend', 'browser', 'web', 'mobile'] },
  { layer: 'api', keywords: ['api'] },
  { layer: 'services', keywords: ['service', 'compute', 'worker', 'backend'] },
  { layer: 'data', keywords: ['data', 'database', 'cache', 'storage'] },
  { layer: 'external', keywords: ['external', 'third-party', 'third party'] },
];

const SECTION_TYPES = new Set(['section', 'group', 'browser', 'mobile']);

export function buildDynamicLayerOrder(nodes: FlowNode[]): readonly string[] {
  const sections = nodes.filter((n) => SECTION_TYPES.has(String(n.type)));
  if (sections.length === 0) return FALLBACK_LAYER_ORDER;
  return sections.map((n) => String(n.data?.label ?? n.id).toLowerCase());
}

function inferSemanticLayerRank(node: FlowNode, dynamicOrder: readonly string[]): number | null {
  if (typeof node.data?.archLayerRank === 'number' && Number.isFinite(node.data.archLayerRank)) {
    return node.data.archLayerRank;
  }

  const label = String(node.data?.label ?? '').toLowerCase();
  const subLabel = String(node.data?.subLabel ?? '').toLowerCase();
  const type = String(node.type ?? '').toLowerCase();
  const haystack = `${label} ${subLabel} ${type}`;

  const dynamicRank = dynamicOrder.findIndex((layer) => haystack.includes(layer));
  if (dynamicRank !== -1) return dynamicRank;

  const fallbackMatch = FALLBACK_LAYER_KEYWORDS.find(({ keywords }) =>
    keywords.some((kw) => haystack.includes(kw))
  );
  return fallbackMatch ? FALLBACK_LAYER_ORDER.indexOf(fallbackMatch.layer) : null;
}

function isArchitectureLikeNode(node: FlowNode): boolean {
  if (node.type === 'architecture') return true;
  return (
    inferSemanticLayerRank(node, FALLBACK_LAYER_ORDER) !== null ||
    SECTION_TYPES.has(String(node.type))
  );
}

export function resolveEffectiveDiagramType(
  nodes: FlowNode[],
  diagramType?: string
): string | undefined {
  if (diagramType) return diagramType;
  return nodes.some(isArchitectureLikeNode) ? 'architecture' : undefined;
}

export function sortTopLevelNodesForArchitecture(
  topLevelNodes: FlowNode[],
  dynamicOrder: readonly string[]
): FlowNode[] {
  const rankCache = new Map(
    topLevelNodes.map((n) => [n.id, inferSemanticLayerRank(n, dynamicOrder)])
  );
  return [...topLevelNodes].sort((left, right) => {
    const leftRank = rankCache.get(left.id) ?? null;
    const rightRank = rankCache.get(right.id) ?? null;
    if (leftRank === null && rightRank === null) return 0;
    if (leftRank === null) return 1;
    if (rightRank === null) return -1;
    return leftRank - rightRank;
  });
}
