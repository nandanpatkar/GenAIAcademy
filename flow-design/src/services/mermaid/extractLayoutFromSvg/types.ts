export interface ExtractedNodeLayout {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rawId?: string;
  label?: string;
}

export interface ExtractedEdgeLayout {
  source: string;
  target: string;
  points: { x: number; y: number }[];
  path: string;
}

export interface ExtractedMermaidLayout {
  nodes: ExtractedNodeLayout[];
  clusters: ExtractedNodeLayout[];
  edges: ExtractedEdgeLayout[];
  matchedLeafNodeCount: number;
  totalLeafNodeCount: number;
  matchedSectionCount: number;
  totalSectionCount: number;
  reason?: string;
}

export interface RawSvgNodeLayout {
  rawId?: string;
  label?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RawSvgEdgeLayout {
  rawId?: string;
  path: string;
  points: { x: number; y: number }[];
}

export interface RawExtractedMermaidGeometry {
  nodes: RawSvgNodeLayout[];
  clusters: RawSvgNodeLayout[];
  edges: RawSvgEdgeLayout[];
}
