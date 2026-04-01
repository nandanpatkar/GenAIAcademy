import { useState, useCallback, useRef } from "react";
import { MarkerType } from "reactflow";

const STORAGE_KEY = "genai_playground_flows_v2";
const MAX_HISTORY  = 40;

const DEFAULT_EDGE_OPTS = {
  animated: true,
  style: { stroke: "#818cf8", strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "#818cf8", width: 14, height: 14 },
  labelStyle: { fill: "#94a3b8", fontSize: 9, fontFamily: "'DM Mono',monospace" },
  labelBgStyle: { fill: "#161b22", fillOpacity: 0.9 },
  labelBgPadding: [4, 2],
  labelBgBorderRadius: 3,
};

// ── Persistence helpers ───────────────────────────────────────────────────────
export function loadFlowsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveFlowsToStorage(flows) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(flows)); } catch {}
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useFlowStore() {
  const [savedFlows,   setSavedFlows]   = useState(() => loadFlowsFromStorage());
  const [activeFlowId, setActiveFlowId] = useState(null);
  const historyRef = useRef([]);   // array of {nodes, edges} snapshots
  const futureRef  = useRef([]);

  // Push snapshot for undo
  const snapshot = useCallback((nodes, edges) => {
    historyRef.current = [...historyRef.current.slice(-MAX_HISTORY), { nodes, edges }];
    futureRef.current  = [];
  }, []);

  const canUndo = historyRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  const undo = useCallback((currentNodes, currentEdges, setNodes, setEdges) => {
    if (!historyRef.current.length) return;
    const prev = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    futureRef.current  = [{ nodes: currentNodes, edges: currentEdges }, ...futureRef.current];
    setNodes(prev.nodes);
    setEdges(prev.edges);
  }, []);

  const redo = useCallback((currentNodes, currentEdges, setNodes, setEdges) => {
    if (!futureRef.current.length) return;
    const next = futureRef.current[0];
    futureRef.current  = futureRef.current.slice(1);
    historyRef.current = [...historyRef.current, { nodes: currentNodes, edges: currentEdges }];
    setNodes(next.nodes);
    setEdges(next.edges);
  }, []);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const saveFlow = useCallback((id, meta, nodes, edges) => {
    const updated = {
      ...loadFlowsFromStorage(),
      [id]: {
        ...meta,
        id,
        nodes,
        edges,
        updatedAt: new Date().toISOString(),
        createdAt: meta.createdAt || new Date().toISOString(),
      },
    };
    saveFlowsToStorage(updated);
    setSavedFlows(updated);
    return updated[id];
  }, []);

  const deleteFlow = useCallback((id) => {
    const current = loadFlowsFromStorage();
    delete current[id];
    saveFlowsToStorage(current);
    setSavedFlows({ ...current });
    if (activeFlowId === id) setActiveFlowId(null);
  }, [activeFlowId]);

  const duplicateFlow = useCallback((id) => {
    const current = loadFlowsFromStorage();
    const orig    = current[id];
    if (!orig) return;
    const newId   = `flow_${Date.now()}`;
    const copy    = { ...orig, id: newId, name: `${orig.name} (copy)`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    current[newId] = copy;
    saveFlowsToStorage(current);
    setSavedFlows({ ...current });
    return newId;
  }, []);

  const toggleFavorite = useCallback((id) => {
    const current = loadFlowsFromStorage();
    if (!current[id]) return;
    current[id].favorite = !current[id].favorite;
    saveFlowsToStorage(current);
    setSavedFlows({ ...current });
  }, []);

  return {
    savedFlows, activeFlowId, setActiveFlowId,
    saveFlow, deleteFlow, duplicateFlow, toggleFavorite,
    snapshot, undo, redo, canUndo, canRedo,
    DEFAULT_EDGE_OPTS,
  };
}
