import type {
  MermaidRuntime,
  OfficialFlowchartDb,
  OfficialFlowchartDefinition,
  OfficialFlowchartEdge,
  OfficialFlowchartVertex,
} from './types';

let runtimePromise: Promise<MermaidRuntime | null> | null = null;
let initialized = false;

function canUseOfficialRuntime(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

async function getOfficialRuntime(): Promise<MermaidRuntime | null> {
  if (!canUseOfficialRuntime()) {
    return null;
  }

  if (!runtimePromise) {
    runtimePromise = import('mermaid')
      .then((module) => {
        const runtime = module.default as MermaidRuntime;
        if (!initialized) {
          runtime.initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            suppressErrorRendering: true,
            htmlLabels: false,
          });
          initialized = true;
        }
        return runtime;
      })
      .catch(() => null);
  }

  return runtimePromise;
}

export async function extractOfficialFlowchartDefinition(
  mermaidSource: string
): Promise<OfficialFlowchartDefinition | null> {
  const runtime = await getOfficialRuntime();
  if (!runtime?.mermaidAPI?.getDiagramFromText) {
    return null;
  }

  const diagram = await runtime.mermaidAPI.getDiagramFromText(mermaidSource);
  const type = diagram.getType?.();
  if (typeof type !== 'string' || !type.startsWith('flowchart')) {
    return null;
  }

  const db = diagram.db as OfficialFlowchartDb | undefined;

  // Mermaid v11 stores vertices as a Map; older versions used a plain object.
  // Prefer getVertices() if available, then fall back to direct property access.
  let verticesMap: Map<string, OfficialFlowchartVertex>;
  const rawVertices = typeof db?.getVertices === 'function' ? db.getVertices() : db?.vertices;
  if (rawVertices instanceof Map) {
    verticesMap = rawVertices as Map<string, OfficialFlowchartVertex>;
  } else if (rawVertices && typeof rawVertices === 'object') {
    verticesMap = new Map(Object.entries(rawVertices as Record<string, OfficialFlowchartVertex>));
  } else {
    verticesMap = new Map();
  }

  // Mermaid v11 may expose getSubGraphs(); fall back to subGraphs property.
  const subgraphs = typeof db?.getSubGraphs === 'function'
    ? db.getSubGraphs()
    : Array.isArray(db?.subGraphs) ? db.subGraphs : [];

  return {
    edges: Array.isArray(db?.edges) ? db.edges as OfficialFlowchartEdge[] : [],
    subgraphs,
    verticesMap,
    direction: db?.direction ?? undefined,
  };
}
