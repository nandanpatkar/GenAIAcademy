import type { FlowEdge, FlowNode } from '@/lib/types';

export interface MermaidDiagramHandle {
  db?: OfficialFlowchartDb;
  getType?: () => string;
}

export interface MermaidRuntime {
  initialize: (config: {
    startOnLoad: boolean;
    securityLevel: 'loose';
    suppressErrorRendering: boolean;
    htmlLabels?: boolean;
  }) => void;
  mermaidAPI?: {
    getDiagramFromText: (text: string) => Promise<MermaidDiagramHandle>;
  };
}

export interface OfficialFlowchartEdge {
  start: string;
  end: string;
  text?: string;
  stroke?: string;
  id?: string;
}

export interface OfficialFlowchartSubgraph {
  id: string;
  nodes: string[];
  title?: string;
}

export interface OfficialFlowchartVertex {
  text?: string;
  type?: string; // Mermaid shape type: 'square', 'round', 'diamond', 'hexagon', etc.
}

// Mermaid v11 stores vertices as a Map<string, vertex>; older versions used a plain object.
// The DB may also expose a getVertices() accessor.
export interface OfficialFlowchartDb {
  edges?: OfficialFlowchartEdge[];
  subGraphs?: OfficialFlowchartSubgraph[];
  // v10 plain object; v11+ Map
  vertices?: Map<string, OfficialFlowchartVertex> | Record<string, OfficialFlowchartVertex>;
  // v11 accessor method
  getVertices?: () => Map<string, OfficialFlowchartVertex>;
  getSubGraphs?: () => OfficialFlowchartSubgraph[];
  direction?: string; // e.g. 'LR', 'TB', 'RL', 'BT'
}

export interface OfficialFlowchartDefinition {
  edges: OfficialFlowchartEdge[];
  subgraphs: OfficialFlowchartSubgraph[];
  // Normalised to a plain Map for efficient .get() access
  verticesMap: Map<string, OfficialFlowchartVertex>;
  direction?: string;
}

export interface OfficialFlowchartImportGraph {
  nodes: FlowNode[];
  edges: FlowEdge[];
  matchedLeafNodeCount: number;
  totalLeafNodeCount: number;
  matchedSectionCount: number;
  totalSectionCount: number;
  matchedEdgeGeometryCount: number;
  totalEdgeCount: number;
  direction?: string;
  reason?: string;
}
