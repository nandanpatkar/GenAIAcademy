import type { FlowNode } from '@/lib/types';
import { ensureMermaidMeasurementSupport } from './ensureMermaidMeasurementSupport';
import {
  extractRawClustersFromSvg,
  extractRawEdgesFromSvg,
  extractRawNodesFromSvg,
  normalizeRawGeometry,
} from './extractLayoutFromSvg/rawExtraction';
import {
  reconcileEdges,
  reconcileRawClusters,
  reconcileRawNodes,
} from './extractLayoutFromSvg/reconciliation';
import type {
  ExtractedMermaidLayout,
  RawExtractedMermaidGeometry,
} from './extractLayoutFromSvg/types';

/**
 * Extracts layout positions from a Mermaid.js SVG render.
 *
 * Mermaid renders the diagram into SVG first, with concrete node bounds and edge
 * paths. We use that SVG as the source of truth for import fidelity whenever we
 * can reconcile the rendered elements back to our parsed nodes reliably.
 *
 * We use Dagre (Mermaid's default) for the hidden render. ELK requires getBBox()
 * during its text measurement phase, which crashes inside Mermaid's internal code
 * even with a live DOM container. Dagre skips text measurement and renders reliably.
 * The extraction selectors handle both Dagre and ELK SVG output structures.
 */

export type {
  ExtractedEdgeLayout,
  ExtractedMermaidLayout,
  ExtractedNodeLayout,
  RawExtractedMermaidGeometry,
} from './extractLayoutFromSvg/types';
export { parseSvgPathPoints } from './extractLayoutFromSvg/svgGeometry';

interface MermaidRenderRuntime {
  initialize: (config: {
    startOnLoad: boolean;
    securityLevel: 'loose';
    suppressErrorRendering: boolean;
    theme: string;
    htmlLabels?: boolean;
    flowchart?: {
      defaultRenderer?: 'dagre-d3' | 'dagre-wrapper' | 'elk';
      htmlLabels?: boolean;
      useMaxWidth?: boolean;
    };
  }) => void;
  render: (id: string, text: string, svgContainingElement?: Element) => Promise<{ svg: string }>;
}

let renderRuntimePromise: Promise<MermaidRenderRuntime | null> | null = null;
let renderCounter = 0;

const MERMAID_IMPORT_RENDER_CONFIG = {
  startOnLoad: false,
  securityLevel: 'loose' as const,
  suppressErrorRendering: true,
  theme: 'default',
  htmlLabels: false,
  flowchart: {
    defaultRenderer: 'dagre-wrapper' as const,
    htmlLabels: false,
    useMaxWidth: false,
  },
};

function canExtractLayout(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

async function getMermaidRenderRuntime(): Promise<MermaidRenderRuntime | null> {
  if (!canExtractLayout()) return null;

  if (!renderRuntimePromise) {
    renderRuntimePromise = import('mermaid')
      .then((module) => module.default as MermaidRenderRuntime)
      .catch(() => null);
  }

  const runtime = await renderRuntimePromise;
  if (runtime) {
    runtime.initialize(MERMAID_IMPORT_RENDER_CONFIG);
  }

  return runtime;
}

async function renderAndNormalize(diagramText: string): Promise<{
  normalized: ReturnType<typeof normalizeRawGeometry>;
  container: HTMLDivElement;
}> {
  ensureMermaidMeasurementSupport();
  const mermaid = await getMermaidRenderRuntime();
  if (!mermaid) {
    throw new Error('Mermaid runtime failed to load for SVG extraction.');
  }

  const containerId = `mermaid-extract-${++renderCounter}`;
  const container = document.createElement('div');
  container.id = containerId;
  // Must be in the live DOM for getBBox() to return real coordinates when we
  // fall back to shape-attribute parsing. opacity:0 keeps it invisible but rendered.
  container.style.cssText = 'position:absolute;top:-9999px;left:-9999px;opacity:0;pointer-events:none;';
  document.body.appendChild(container);

  try {
    const { svg } = await mermaid.render(containerId, diagramText, container);
    if (!svg) {
      throw new Error('Mermaid render returned empty SVG output.');
    }

    container.innerHTML = svg;
    const svgRoot = container.querySelector('svg');
    if (!svgRoot) {
      throw new Error('Rendered Mermaid SVG was not attached to the extraction container.');
    }

    const normalized = normalizeRawGeometry(
      extractRawNodesFromSvg(svgRoot),
      extractRawClustersFromSvg(svgRoot),
      extractRawEdgesFromSvg(svgRoot)
    );
    return { normalized, container };
  } catch (error) {
    container.remove();
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Mermaid render/extraction failed: ${message}`);
  }
}

export async function extractMermaidLayout(
  diagramText: string,
  nodes: FlowNode[]
): Promise<ExtractedMermaidLayout | null> {
  if (!canExtractLayout()) {
    throw new Error('Mermaid SVG extraction requires a browser DOM runtime.');
  }

  const { normalized, container } = await renderAndNormalize(diagramText);

  try {
    const leafResolution = reconcileRawNodes(normalized.nodes, nodes);
    const clusterResolution = reconcileRawClusters(
      normalized.clusters,
      nodes,
      leafResolution.resolved
    );

    if (leafResolution.matchedCount === 0) {
      return null;
    }

    const edges = reconcileEdges(
      normalized.edges,
      leafResolution.resolved,
      clusterResolution.resolved
    );

    const issues: string[] = [];
    if (leafResolution.matchedCount < leafResolution.totalCount) {
      issues.push(`matched ${leafResolution.matchedCount}/${leafResolution.totalCount} leaf nodes`);
    }
    if (clusterResolution.totalCount > 0 && clusterResolution.matchedCount < clusterResolution.totalCount) {
      issues.push(`matched ${clusterResolution.matchedCount}/${clusterResolution.totalCount} sections`);
    }
    if (edges.length === 0) {
      issues.push('could not reconcile Mermaid edge geometry');
    }

    return {
      nodes: leafResolution.resolved,
      clusters: clusterResolution.resolved,
      edges,
      matchedLeafNodeCount: leafResolution.matchedCount,
      totalLeafNodeCount: leafResolution.totalCount,
      matchedSectionCount: clusterResolution.matchedCount,
      totalSectionCount: clusterResolution.totalCount,
      reason: issues.length > 0 ? issues.join('; ') : undefined,
    };
  } finally {
    container.remove();
  }
}

export async function extractRawMermaidGeometry(
  diagramText: string
): Promise<RawExtractedMermaidGeometry> {
  if (!canExtractLayout()) {
    throw new Error('Mermaid SVG extraction requires a browser DOM runtime.');
  }

  const { normalized, container } = await renderAndNormalize(diagramText);
  container.remove();
  return normalized;
}
