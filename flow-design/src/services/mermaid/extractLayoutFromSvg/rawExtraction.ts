import {
  buildBoundsFromElement,
  getElementText,
  parseSvgPathPoints,
  shiftPathData,
} from './svgGeometry';
import type { RawSvgEdgeLayout, RawSvgNodeLayout } from './types';

export const CANVAS_PADDING = 40;

/**
 * Extracts raw node positions from a Mermaid SVG.
 *
 * Mermaid v11 uses two different rendering pipelines:
 * - Dagre path: nodes are <g class="node ..."> with id="flowchart-ID-N"
 * - ELK path:   nodes are <g data-id="ID" class="..."> (no "node" in class)
 *
 * We query both selectors and prefer data-id when present (it is the raw node ID,
 * needing no transformation to match our parsed node IDs).
 */
export function extractRawNodesFromSvg(svgRoot: ParentNode): RawSvgNodeLayout[] {
  const results: RawSvgNodeLayout[] = [];
  const seen = new Set<Element>();

  // g.node → Dagre pipeline. g[data-id] → ELK pipeline.
  // Exclude cluster containers (subgraphs) from node list.
  for (const group of svgRoot.querySelectorAll('g.node, g[data-id]')) {
    if (seen.has(group)) continue;
    seen.add(group);

    if (group.classList.contains('cluster')) continue;

    const bounds = buildBoundsFromElement(group);
    if (!bounds) continue;

    // data-id holds the raw Mermaid node ID in the ELK pipeline — use it directly.
    // Fall back to the element id attribute (Dagre pipeline).
    const dataId = group.getAttribute('data-id');
    const rawId = (dataId || group.id) || undefined;

    results.push({ rawId, label: getElementText(group), ...bounds });
  }

  return results;
}

/**
 * Extracts subgraph (cluster) bounds from a Mermaid SVG.
 * Clusters use class="cluster ..." in both Dagre and ELK pipelines.
 */
export function extractRawClustersFromSvg(svgRoot: ParentNode): RawSvgNodeLayout[] {
  const results: RawSvgNodeLayout[] = [];

  for (const group of svgRoot.querySelectorAll('g.cluster')) {
    const bounds = buildBoundsFromElement(group);
    if (!bounds) continue;

    const dataId = group.getAttribute('data-id');
    const rawId = (dataId || group.id) || undefined;

    results.push({ rawId, label: getElementText(group), ...bounds });
  }

  return results;
}

/**
 * Extracts edge paths from a Mermaid SVG.
 *
 * Dagre pipeline: edges are <g class="edgePath"> containing <path class="path">
 * ELK pipeline:  edges are <path class="flowchart-link ..."> (direct path elements)
 */
export function extractRawEdgesFromSvg(svgRoot: ParentNode): RawSvgEdgeLayout[] {
  const results: RawSvgEdgeLayout[] = [];
  const seen = new Set<Element>();

  const selector = [
    'g.edgePath path.path',
    'g.edge path.path',
    'g.edgePath path',
    'g.edge path',
    'path.flowchart-link',  // ELK pipeline
  ].join(', ');

  for (const pathEl of svgRoot.querySelectorAll(selector)) {
    if (seen.has(pathEl)) continue;
    seen.add(pathEl);

    const d = pathEl.getAttribute('d');
    if (!d) continue;

    const points = parseSvgPathPoints(d);
    if (points.length < 2) continue;

    results.push({
      rawId: pathEl.getAttribute('data-id') ?? pathEl.id ?? undefined,
      path: d,
      points,
    });
  }

  return results;
}

/**
 * Normalizes all extracted coordinates to start at (CANVAS_PADDING, CANVAS_PADDING).
 * Puts nodes, clusters, and edge paths in the same canvas coordinate space.
 */
export function normalizeRawGeometry(
  nodes: RawSvgNodeLayout[],
  clusters: RawSvgNodeLayout[],
  edges: RawSvgEdgeLayout[]
): { nodes: RawSvgNodeLayout[]; clusters: RawSvgNodeLayout[]; edges: RawSvgEdgeLayout[] } {
  const allX = [
    ...nodes.map((n) => n.x),
    ...clusters.map((c) => c.x),
    ...edges.flatMap((e) => e.points.map((p) => p.x)),
  ];
  const allY = [
    ...nodes.map((n) => n.y),
    ...clusters.map((c) => c.y),
    ...edges.flatMap((e) => e.points.map((p) => p.y)),
  ];

  if (allX.length === 0 || allY.length === 0) return { nodes, clusters, edges };

  const shiftX = -Math.min(...allX) + CANVAS_PADDING;
  const shiftY = -Math.min(...allY) + CANVAS_PADDING;
  const shiftPt = (p: { x: number; y: number }) => ({ x: p.x + shiftX, y: p.y + shiftY });

  return {
    nodes: nodes.map((n) => ({ ...n, x: n.x + shiftX, y: n.y + shiftY })),
    clusters: clusters.map((c) => ({ ...c, x: c.x + shiftX, y: c.y + shiftY })),
    edges: edges.map((e) => ({
      ...e,
      points: e.points.map(shiftPt),
      path: shiftPathData(e.path, shiftX, shiftY),
    })),
  };
}
