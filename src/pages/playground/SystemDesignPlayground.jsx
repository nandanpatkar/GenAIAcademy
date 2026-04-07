import { useState, useCallback, useRef, useMemo } from "react";
import ReactFlow, {
  addEdge, MiniMap, Controls, Background, useNodesState, useEdgesState,
  Handle, Position, NodeResizer, BackgroundVariant, MarkerType, Panel,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Bot, Brain, FileText, Database, FolderOpen, Wrench, MemoryStick,
  Cpu, ArrowRightLeft, X, Search, ChevronDown, ChevronRight,
  Trash2, Edit3, Copy, Download, LayoutTemplate, Layers, Globe,
  Code2, Shield, Zap, Network, Cloud, Server, GitBranch,
  MessageSquare, Mail, BarChart2, Lock, RefreshCw, Settings,
  Webhook, Boxes, ScanSearch, Filter, BookOpen, Workflow,
  Check, ArrowLeft, Link2, Sparkles, CircuitBoard,
  Save, FolderOpen as FolderOpenIcon, AlertCircle, RotateCcw, Redo2,
  StickyNote, Square, Grid3X3, Map, Maximize2, ZoomIn, ZoomOut,
  Play, Info, Star, Tag, CheckCircle, Minimize2, ExternalLink,
  MoreHorizontal, Upload, PanelLeft,
  Image, Mic, Volume2, Eye, Activity, Timer, Bell, FlaskConical, Key, UserCheck,
} from "lucide-react";

import { CATEGORIES, COLORS, COLOR_OVERRIDES, PORT_TYPES } from "./data/nodes.js";
import { TEMPLATES } from "./data/templates.js";
import { useFlowStore } from "./hooks/useFlowStore.js";
import { autoLayout, validateFlow, exportFlowJSON, exportFlowSVG, exportFlowPNG, importFlowJSON } from "./utils/flowUtils.js";
import InspectorPanel from "./components/InspectorPanel.jsx";
import FlowManager from "./components/FlowManager.jsx";
import SaveModal from "./components/SaveModal.jsx";
import { ValidationPanel, NodePopover } from "./components/Overlays.jsx";
import ArchitectureDesign from "./ArchitectureDesign";

// ─── Icon Registry ─────────────────────────────────────────────────────────────
const ICON_MAP = {
  Bot, Brain, FileText, Database, FolderOpen, Wrench, MemoryStick, Cpu,
  ArrowRightLeft, Globe, Code2, Shield, Zap, Network, Cloud, Server,
  GitBranch, MessageSquare, Mail, BarChart2, Lock, RefreshCw, Settings,
  Webhook, Boxes, ScanSearch, Filter, BookOpen, Workflow, Link2,
  Sparkles, CircuitBoard, Layers, Search,
  // new icons
  CheckCircle, Play, Star, AlertCircle,
  Image, Mic, Volume2, Eye, Activity, Timer, Bell, FlaskConical, Key, UserCheck,
};
const IC = ({ name, size = 13, color }) => { const C = ICON_MAP[name] || Cpu; return <C size={size} color={color} />; };

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  planned:     { bg: "#1e293b", text: "#64748b", label: "Planned"     },
  in_progress: { bg: "#1e3a5f", text: "#38bdf8", label: "In Progress" },
  done:        { bg: "#064e3b", text: "#34d399", label: "Done"        },
};

// ─── GenAI Node ────────────────────────────────────────────────────────────────
function GenAINode({ id, data, selected }) {
  const col    = COLORS[data.colorOverride || data.colorKey] || COLORS.agent;
  const status = STATUS_CFG[data.status]   || STATUS_CFG.planned;
  const inPT   = PORT_TYPES[data.inputPort]  || PORT_TYPES.any;
  const outPT  = PORT_TYPES[data.outputPort] || PORT_TYPES.any;

  if (data.collapsed) return (
    <div style={{ background: "#0d1117", border: `1.5px solid ${selected ? col.bg : col.border}`, borderRadius: 8, padding: "6px 10px", minWidth: 150, display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Mono',monospace", boxShadow: selected ? `0 0 0 2px ${col.bg}44` : "0 2px 8px rgba(0,0,0,0.4)" }}>
      <Handle type="target" position={Position.Left} id="in" style={{ background: inPT.color, border: "2px solid #0d1117", width: 9, height: 9, left: -5 }} />
      <div style={{ width: 18, height: 18, borderRadius: 4, background: col.dim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IC name={data.icon} size={10} color={col.bg} /></div>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#e6edf3", whiteSpace: "nowrap" }}>{data.label}</span>
      <Handle type="source" position={Position.Right} id="out" style={{ background: outPT.color, border: "2px solid #0d1117", width: 9, height: 9, right: -5 }} />
    </div>
  );

  return (
    <div style={{ background: "linear-gradient(145deg,#0d1117 0%,#161b22 100%)", border: `1.5px solid ${selected ? col.bg : col.border}`, borderRadius: 10, minWidth: 190, maxWidth: 260, boxShadow: selected ? `0 0 0 2px ${col.bg}44,0 6px 24px ${col.bg}22` : "0 2px 10px rgba(0,0,0,0.5)", transition: "all 0.15s", fontFamily: "'DM Mono',monospace", overflow: "hidden" }}>
      <NodeResizer minWidth={190} minHeight={80} isVisible={selected} lineStyle={{ border: `1px solid ${col.bg}55` }} handleStyle={{ background: col.bg, width: 7, height: 7 }} />
      <div style={{ height: 2, background: `linear-gradient(90deg,${col.bg},${col.bg}33)` }} />
      <Handle type="target" position={Position.Left} id="in" title={`Input: ${inPT.label}`} style={{ background: inPT.color, border: "2px solid #0d1117", width: 10, height: 10, left: -6 }} />
      <div style={{ padding: "8px 10px 6px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${col.border}` }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: col.dim, border: `1px solid ${col.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IC name={data.icon} size={13} color={col.bg} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#e6edf3", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{data.label}</div>
          <div style={{ fontSize: 8, color: col.bg, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 1 }}>{data.nodeType}</div>
        </div>
        <div style={{ background: status.bg, color: status.text, fontSize: 7, fontWeight: 700, padding: "2px 5px", borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0, whiteSpace: "nowrap" }}>{status.label}</div>
      </div>
      <div style={{ padding: "6px 10px 8px" }}>
        <div style={{ fontSize: 9.5, color: "#8b949e", lineHeight: 1.5 }}>{data.sub}</div>
        {data.note && <div style={{ marginTop: 4, fontSize: 9, color: "#fbbf24", background: "#fbbf2411", border: "1px solid #fbbf2433", borderRadius: 4, padding: "3px 6px", lineHeight: 1.4 }}>📝 {data.note}</div>}
        {data.cost && <div style={{ marginTop: 4, fontSize: 8, color: "#34d399", background: "#34d3991a", border: "1px solid #34d39933", borderRadius: 3, padding: "2px 5px", display: "inline-block" }}>💰 {data.cost}</div>}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <span style={{ fontSize: 7.5, color: inPT.color, opacity: 0.7 }}>← {inPT.label}</span>
          <span style={{ fontSize: 7.5, color: outPT.color, opacity: 0.7 }}>{outPT.label} →</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="out" title={`Output: ${outPT.label}`} style={{ background: outPT.color, border: "2px solid #0d1117", width: 10, height: 10, right: -6 }} />
    </div>
  );
}

// ─── Sticky Note Node ──────────────────────────────────────────────────────────
function NoteNode({ id, data, selected }) {
  const [text, setText] = useState(data.text || "");
  return (
    <div style={{ background: "#1c1a00", border: `1.5px solid ${selected ? "#facc15" : "#facc1540"}`, borderRadius: 8, padding: 10, minWidth: 180, boxShadow: selected ? "0 0 0 2px #facc1533" : "0 2px 8px rgba(0,0,0,0.4)", fontFamily: "'DM Mono',monospace" }}>
      <NodeResizer minWidth={160} minHeight={80} isVisible={selected} lineStyle={{ border: "1px solid #facc15" }} handleStyle={{ background: "#facc15", width: 7, height: 7 }} />
      <div style={{ fontSize: 8, color: "#facc15", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>📝 Note</div>
      <textarea value={text} onChange={e => { setText(e.target.value); data.onChange && data.onChange(id, e.target.value); }} placeholder="Type a note..." className="nodrag"
        style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "#fde68a", fontSize: 11, lineHeight: 1.6, resize: "none", minHeight: 60, fontFamily: "'DM Mono',monospace", boxSizing: "border-box" }} />
    </div>
  );
}

// ─── Group Node ────────────────────────────────────────────────────────────────
function GroupNode({ id, data, selected }) {
  return (
    <div style={{ border: `2px dashed ${selected ? data.color || "#6b7280" : (data.color || "#6b7280") + "55"}`, borderRadius: 14, background: (data.color || "#6b7280") + "09", minWidth: 300, minHeight: 200, position: "relative", fontFamily: "'DM Mono',monospace" }}>
      <NodeResizer minWidth={280} minHeight={180} isVisible={selected} lineStyle={{ border: `1px solid ${data.color || "#6b7280"}` }} handleStyle={{ background: data.color || "#6b7280", width: 8, height: 8 }} />
      <div style={{ position: "absolute", top: -12, left: 14, background: "#0d1117", padding: "2px 10px", borderRadius: 4, fontSize: 10, fontWeight: 700, color: data.color || "#94a3b8", border: `1px solid ${(data.color || "#6b7280") + "44"}`, letterSpacing: "0.06em", textTransform: "uppercase" }}>{data.label || "Group"}</div>
    </div>
  );
}

const NODE_TYPES = { genai: GenAINode, noteNode: NoteNode, groupNode: GroupNode };

let uid = 1;
const mkId = () => `n_${uid++}_${Date.now()}`;

const GROUP_COLORS = ["#6b7280","#818cf8","#34d399","#f87171","#fbbf24","#60a5fa","#c084fc","#f472b6"];

// ─── Edge label edit modal ─────────────────────────────────────────────────────
function EdgeLabelModal({ edge, onSave, onClose }) {
  const [label, setLabel] = useState(edge.label || "");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9995, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 320, background: "var(--pg-sidebar)", border: "1px solid var(--pg-border)", borderRadius: 9, padding: 16, fontFamily: "'DM Mono',monospace", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--pg-text)", marginBottom: 10 }}>Edit Edge Label</div>
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. embeddings, JSON, tokens..."
          autoFocus onKeyDown={e => e.key === "Enter" && onSave(label)}
          style={{ width: "100%", background: "var(--pg-panel)", border: "1px solid var(--pg-accent)", borderRadius: 5, color: "var(--pg-text)", fontSize: 11, padding: "7px 9px", fontFamily: "'DM Mono',monospace", outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid #30363d", borderRadius: 5, color: "#8b949e", fontSize: 10, padding: "7px", cursor: "pointer", fontFamily: "'DM Mono',monospace" }}>Cancel</button>
          <button onClick={() => onSave(label)} style={{ flex: 2, background: "#818cf8", border: "none", borderRadius: 5, color: "#fff", fontSize: 10, fontWeight: 700, padding: "7px", cursor: "pointer", fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <Check size={11} /> Save Label
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Context Menu ──────────────────────────────────────────────────────────────
function CtxMenu({ x, y, nodeId, onClose, onDelete, onDuplicate, onInspect }) {
  return (
    <div onMouseLeave={onClose} style={{ position: "fixed", top: y, left: x, background: "var(--pg-panel)", border: "1px solid var(--pg-border)", borderRadius: 8, padding: 4, zIndex: 9999, minWidth: 158, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", fontFamily: "'DM Mono',monospace" }}>
      {[
        { icon: Edit3,  label: "Inspect / Edit", fn: () => { onInspect(nodeId); onClose(); } },
        { icon: Copy,   label: "Duplicate",       fn: () => { onDuplicate(nodeId); onClose(); } },
        { icon: Trash2, label: "Delete",          fn: () => { onDelete(nodeId); onClose(); }, danger: true },
      ].map((item, i) => (
        <button key={i} onClick={item.fn}
          style={{ width: "100%", background: "none", border: "none", display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", cursor: "pointer", borderRadius: 5, color: item.danger ? "#f87171" : "var(--pg-text)", fontSize: 11, textAlign: "left", transition: "background 0.1s", fontFamily: "'DM Mono',monospace" }}
          onMouseEnter={e => e.currentTarget.style.background = item.danger ? "#f8717122" : "var(--pg-border2)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}>
          <item.icon size={11} /> {item.label}
        </button>
      ))}
    </div>
  );
}

// ─── Toolbar Button ────────────────────────────────────────────────────────────
const TBtn = ({ icon: Icon, label, onClick, active, accent, danger, disabled }) => (
  <button onClick={onClick} disabled={disabled} title={label}
    style={{ background: active ? (accent || "var(--pg-accent)") + "22" : "none", border: `1px solid ${active ? (accent || "var(--pg-accent)") : "var(--pg-border2)"}`, borderRadius: 5, color: disabled ? "var(--pg-border)" : active ? (accent || "var(--pg-accent)") : "var(--pg-text3)", fontSize: 9.5, padding: "4px 8px", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", gap: 4, transition: "all 0.12s", opacity: disabled ? 0.4 : 1 }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = danger ? "#f87171" : (accent || "var(--pg-accent)"); e.currentTarget.style.color = danger ? "#f87171" : (accent || "var(--pg-accent)"); }}}
    onMouseLeave={e => { if (!disabled) { e.currentTarget.style.borderColor = active ? (accent || "var(--pg-accent)") : "var(--pg-border2)"; e.currentTarget.style.color = active ? (accent || "var(--pg-accent)") : "var(--pg-text3)"; }}}>
    <Icon size={11} /> <span style={{ display: "none" }}>{label}</span>
  </button>
);

// ═══ MAIN COMPONENT ═══════════════════════════════════════════════════════════
export default function SystemDesignPlayground({ onClose }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // UI state
  const [search,        setSearch]        = useState("");
  const [openCats,      setOpenCats]      = useState({});  // all collapsed by default
  const [flowName,      setFlowName]      = useState("Untitled Architecture");
  const [editingName,   setEditingName]   = useState(false);
  const [selNode,       setSelNode]       = useState(null);
  const [showInspect,   setShowInspect]   = useState(false);
  const [ctxMenu,       setCtxMenu]       = useState(null);
  const [sideTab,       setSideTab]       = useState("nodes");
  const [snapToGrid,    setSnapToGrid]    = useState(false);
  const [showMinimap,   setShowMinimap]   = useState(true);
  const [showValidation,setShowValidation]= useState(false);
  const [showFlowMgr,   setShowFlowMgr]   = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingEdge,   setEditingEdge]   = useState(null);
  const [hoveredNode,   setHoveredNode]   = useState(null);
  const [hoverPos,      setHoverPos]      = useState({ x: 0, y: 0 });
  const [flowDesc,      setFlowDesc]      = useState("");
  const [flowTags,      setFlowTags]      = useState([]);
  const [activeFlowId,  setActiveFlowId]  = useState(null);
  const [mainTab,       setMainTab]       = useState("system"); // "system" | "arch"

  const rfWrapper = useRef(null);
  const [rfi, setRfi] = useState(null);
  const fileImportRef = useRef(null);

  const store = useFlowStore();
  const validationIssues = useMemo(() => validateFlow(nodes, edges), [nodes, edges]);

  // ── Edge defaults ──────────────────────────────────────────────────────────
  const edgeDefaults = {
    animated: true,
    style: { stroke: "var(--pg-accent)", strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--pg-accent)", width: 14, height: 14 },
    labelStyle: { fill: "var(--pg-text2)", fontSize: 9, fontFamily: "'DM Mono',monospace" },
    labelBgStyle: { fill: "var(--pg-panel)", fillOpacity: 0.9 },
    labelBgPadding: [4, 2],
    labelBgBorderRadius: 3,
  };

  // ── Connect ────────────────────────────────────────────────────────────────
  const onConnect = useCallback((params) => {
    store.snapshot(nodes, edges);
    setEdges(eds => addEdge({ ...params, ...edgeDefaults }, eds));
  }, [nodes, edges, setEdges, store]);

  const onDragOver = useCallback(e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }, []);

  // ── Drop node from sidebar ─────────────────────────────────────────────────
  const onDrop = useCallback(e => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/genai-node");
    if (!raw || !rfi) return;
    const item = JSON.parse(raw);
    const pos  = rfi.screenToFlowPosition({ x: e.clientX, y: e.clientY });
    store.snapshot(nodes, edges);
    setNodes(nds => nds.concat({
      id: mkId(), type: "genai", position: pos,
      data: { label: item.label, icon: item.icon, sub: item.sub, nodeType: item.color, colorKey: item.color, status: "planned", collapsed: false, info: item.info, docsUrl: item.docsUrl, cost: item.cost || null, inputPort: item.inputPort || "any", outputPort: item.outputPort || "any" },
    }));
  }, [rfi, nodes, edges, setNodes, store]);

  // ── Node interactions ──────────────────────────────────────────────────────
  const onNodeClick = useCallback((e, node) => {
    e.stopPropagation();
    setSelNode(node);
    setShowInspect(true);
    setCtxMenu(null);
    setHoveredNode(null);
  }, []);

  const onNodeCtx = useCallback((e, node) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, nodeId: node.id });
    setHoveredNode(null);
  }, []);

  const onNodeMouseEnter = useCallback((e, node) => {
    if (node.type === "noteNode" || node.type === "groupNode") return;
    setHoveredNode(node);
    setHoverPos({ x: e.clientX, y: e.clientY });
  }, []);

  const onNodeMouseLeave = useCallback(() => setHoveredNode(null), []);
  const onPaneClick      = useCallback(() => { setCtxMenu(null); setHoveredNode(null); }, []);

  // Double-click edge to edit label
  const onEdgeDblClick = useCallback((e, edge) => {
    e.stopPropagation();
    setEditingEdge(edge);
  }, []);

  // ── Node CRUD ──────────────────────────────────────────────────────────────
  const updateNode = (nodeId, patch) => {
    setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n));
    setSelNode(prev => prev?.id === nodeId ? { ...prev, data: { ...prev.data, ...patch } } : prev);
  };

  const deleteNode = (nodeId) => {
    store.snapshot(nodes, edges);
    setNodes(nds => nds.filter(n => n.id !== nodeId));
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    if (selNode?.id === nodeId) { setSelNode(null); setShowInspect(false); }
  };

  const duplicateNode = (nodeId) => {
    const orig = nodes.find(n => n.id === nodeId);
    if (!orig) return;
    store.snapshot(nodes, edges);
    setNodes(nds => nds.concat({ ...orig, id: mkId(), position: { x: orig.position.x + 44, y: orig.position.y + 44 } }));
  };

  // ── Add special nodes ──────────────────────────────────────────────────────
  const addNote = () => {
    const pos = rfi ? rfi.screenToFlowPosition({ x: 400, y: 300 }) : { x: 200, y: 200 };
    store.snapshot(nodes, edges);
    setNodes(nds => nds.concat({
      id: mkId(), type: "noteNode", position: pos,
      data: { text: "", onChange: (id, val) => setNodes(ns => ns.map(n => n.id === id ? { ...n, data: { ...n.data, text: val } } : n)) },
    }));
  };

  const addGroup = () => {
    const pos = rfi ? rfi.screenToFlowPosition({ x: 300, y: 250 }) : { x: 150, y: 150 };
    const label = prompt("Group label (e.g. Ingestion Layer):");
    if (!label) return;
    const color = GROUP_COLORS[Math.floor(Math.random() * GROUP_COLORS.length)];
    store.snapshot(nodes, edges);
    setNodes(nds => nds.concat({
      id: mkId(), type: "groupNode", position: pos,
      style: { width: 420, height: 260 },
      data: { label, color },
    }));
  };

  // ── Template load ──────────────────────────────────────────────────────────
  const loadTemplate = (tpl) => {
    store.snapshot(nodes, edges);
    setNodes(tpl.nodes);
    setEdges(tpl.edges);
    setFlowName(tpl.label);
    setFlowDesc(tpl.description || "");
    setFlowTags(tpl.tags || []);
    setSideTab("nodes");
  };

  // ── Auto layout ────────────────────────────────────────────────────────────
  const doAutoLayout = () => {
    store.snapshot(nodes, edges);
    setNodes(autoLayout(nodes, edges));
  };

  // ── Undo / Redo ────────────────────────────────────────────────────────────
  const doUndo = () => store.undo(nodes, edges, setNodes, setEdges);
  const doRedo = () => store.redo(nodes, edges, setNodes, setEdges);

  // ── Save flow ──────────────────────────────────────────────────────────────
  const handleSaveFlow = (name, desc, tags) => {
    const id = activeFlowId || `flow_${Date.now()}`;
    store.saveFlow(id, { name, description: desc, tags }, nodes, edges);
    setActiveFlowId(id);
    setFlowName(name);
    setFlowDesc(desc);
    setFlowTags(tags);
    setShowSaveModal(false);
    setShowFlowMgr(true);
  };

  const handleLoadFlow = (flow) => {
    store.snapshot(nodes, edges);
    setNodes(flow.nodes || []);
    setEdges((flow.edges || []).map(e => ({ ...e, ...edgeDefaults })));
    setFlowName(flow.name);
    setFlowDesc(flow.description || "");
    setFlowTags(flow.tags || []);
    setActiveFlowId(flow.id);
    setShowFlowMgr(false);
  };

  // ── Import JSON ────────────────────────────────────────────────────────────
  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    importFlowJSON(file, (data) => {
      store.snapshot(nodes, edges);
      setNodes(data.nodes);
      setEdges(data.edges);
      setFlowName(data.name);
      setFlowDesc(data.description || "");
      setFlowTags(data.tags || []);
      setActiveFlowId(null);
      e.target.value = "";
    }, (err) => alert("Import failed: " + err));
  };

  // ── Zoom presets ───────────────────────────────────────────────────────────
  const setZoom = (level) => { if (rfi) rfi.zoomTo(level); };
  const fitView = () => { if (rfi) rfi.fitView({ padding: 0.1 }); };

  // ── Filtered sidebar nodes ─────────────────────────────────────────────────
  const filtered = CATEGORIES.map(cat => ({
    ...cat, nodes: cat.nodes.filter(n =>
      !search || n.label.toLowerCase().includes(search.toLowerCase()) || n.sub.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => !search || cat.nodes.length > 0);

  const errorCount = validationIssues.filter(i => i.type === "error").length;
  const warnCount  = validationIssues.filter(i => i.type === "warning").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", overflow: "hidden" }}>

      {/* ══ TOP TAB BAR ══════════════════════════════════════════════════════ */}
      <div style={{
        display: "flex", alignItems: "center",
        background: "var(--pg-sidebar)", borderBottom: "1px solid var(--pg-border)",
        padding: "0 16px", height: 42, flexShrink: 0,
      }}>
        {[
          { id: "system", label: "⚙️  System Design"       },
          { id: "arch",   label: "🏗️  Architecture Design" },
        ].map(t => (
          <button key={t.id} onClick={() => setMainTab(t.id)}
            style={{
              background: "none", border: "none", padding: "0 18px",
              height: "100%", cursor: "pointer",
              fontFamily: "'DM Mono',monospace", fontSize: 10.5,
              fontWeight: 700, letterSpacing: "0.05em",
              color: mainTab === t.id ? "var(--pg-text)" : "var(--pg-text3)",
              borderBottom: `2px solid ${mainTab === t.id ? "var(--pg-accent)" : "transparent"}`,
              transition: "all 0.15s",
            }}>
            {t.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pg-text3)", fontSize: 18, padding: "4px 8px", borderRadius: 5, lineHeight: 1 }}>
          ✕
        </button>
      </div>

      {/* ══ TAB CONTENT ══════════════════════════════════════════════════════ */}
      {mainTab === "arch" ? (
        <ArchitectureDesign />
      ) : (

      <div style={{ display: "flex", flex: 1, height: "100%", background: "var(--pg-bg)", fontFamily: "'DM Mono','Fira Code',monospace", color: "var(--pg-text)", overflow: "hidden" }}>

        {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
        <div style={{ width: 230, minWidth: 230, background: "var(--pg-sidebar)", borderRight: "1px solid var(--pg-border)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--pg-border)" }}>
            {[{ id: "nodes", icon: Layers, label: "Nodes" }, { id: "templates", icon: LayoutTemplate, label: "Templates" }].map(tab => (
              <button key={tab.id} onClick={() => setSideTab(tab.id)}
                style={{ flex: 1, background: "none", border: "none", padding: "10px 6px", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: sideTab === tab.id ? "var(--pg-text)" : "var(--pg-text3)", borderBottom: `2px solid ${sideTab === tab.id ? "var(--pg-accent)" : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.15s" }}>
                <tab.icon size={10} /> {tab.label}
              </button>
            ))}
          </div>

          {sideTab === "nodes" ? (<>
            {/* Search */}
            <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--pg-border)" }}>
              <div style={{ position: "relative" }}>
                <Search size={12} color="var(--pg-text3)" style={{ position: "absolute", left: 10, top: 9 }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search node types..."
                  style={{ width: "100%", background: "var(--pg-panel)", border: "1px solid var(--pg-border2)", borderRadius: 6, color: "var(--pg-text)", fontSize: 11, padding: "7px 10px 7px 30px", outline: "none", fontFamily: "'DM Mono',monospace" }} />
              </div>
            </div>

            {/* Category list */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filtered.map(cat => {
                const isOpen = !!openCats[cat.id];
                return (
                  <div key={cat.id}>
                    <button onClick={() => setOpenCats(p => ({ ...p, [cat.id]: !isOpen }))}
                      style={{
                        width: "100%",
                        background: "none",
                        border: "none",
                        padding: "8px 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        fontFamily: "'DM Mono',monospace",
                        transition: "all 0.2s",
                        borderRadius: 6,
                        margin: "2px 0"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--pg-panel)"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          background: isOpen ? "rgba(148, 163, 184, 0.1)" : "transparent",
                          border: isOpen ? "1px solid rgba(148, 163, 184, 0.2)" : "1px solid transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s"
                        }}>
                          <IC name={cat.icon} size={11} color={isOpen ? "var(--pg-text2)" : "var(--pg-text3)"} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: isOpen ? "var(--pg-text)" : "var(--pg-text2)", letterSpacing: "0.02em" }}>{cat.label}</span>
                        <span style={{ fontSize: 9, color: "var(--pg-text3)", background: "var(--pg-border2)", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>{cat.nodes.length}</span>
                      </div>
                      {isOpen ? <ChevronDown size={11} color="var(--pg-text3)" /> : <ChevronRight size={11} color="var(--pg-text3)" />}
                    </button>

                    {isOpen && cat.nodes.map(item => (
                      <div key={item.id} draggable
                        onDragStart={e => { e.dataTransfer.setData("application/genai-node", JSON.stringify(item)); e.dataTransfer.effectAllowed = "move"; }}
                        style={{ margin: "2px 7px", padding: "6px 8px", background: "var(--pg-sidebar)", border: `1px solid ${COLORS[item.color]?.border}`, borderRadius: 6, cursor: "grab", display: "flex", alignItems: "center", gap: 7, transition: "all 0.12s", userSelect: "none" }}
                        onMouseEnter={e => { e.currentTarget.style.background = COLORS[item.color]?.dim; e.currentTarget.style.borderColor = COLORS[item.color]?.bg + "77"; e.currentTarget.style.transform = "translateX(2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "var(--pg-sidebar)"; e.currentTarget.style.borderColor = COLORS[item.color]?.border; e.currentTarget.style.transform = "translateX(0)"; }}>
                        <div style={{ width: 20, height: 20, borderRadius: 4, background: COLORS[item.color]?.dim, border: `1px solid ${COLORS[item.color]?.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <IC name={item.icon} size={10} color={COLORS[item.color]?.bg} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--pg-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</div>
                          <div style={{ fontSize: 8, color: "var(--pg-text3)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "12px", borderTop: "1px solid var(--pg-border)" }}>
              <div style={{ background: "rgba(129, 140, 248, 0.05)", border: "1px solid var(--pg-border2)", borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--pg-accent)", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Activity size={10} /> GENAI ANALYTICS
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--pg-text)" }}>{nodes.length} Components</div>
                <div style={{ fontSize: 9, color: "var(--pg-text3)", marginTop: 2 }}>{edges.length} flow connections active</div>
              </div>
            </div>
          </>) : (
            /* Templates tab */
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 7px" }}>
              <div style={{ fontSize: 8.5, color: "var(--pg-text3)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "6px 4px 8px" }}>Starter Templates</div>
              {TEMPLATES.map(tpl => (
                <div key={tpl.id} onClick={() => loadTemplate(tpl)}
                  style={{ marginBottom: 8, padding: 10, background: "var(--pg-panel)", border: "1px solid var(--pg-border)", borderRadius: 8, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--pg-accent)"; e.currentTarget.style.background = "var(--pg-border2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--pg-border)"; e.currentTarget.style.background = "var(--pg-panel)"; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 5, background: "var(--pg-accent)1a", border: "1px solid var(--pg-accent)40", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IC name={tpl.icon} size={11} color="var(--pg-accent)" />
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--pg-text)" }}>{tpl.label}</span>
                  </div>
                  <div style={{ fontSize: 8.5, color: "var(--pg-text3)", lineHeight: 1.5, marginBottom: 5 }}>{tpl.description}</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {(tpl.tags || []).map(t => <span key={t} style={{ fontSize: 7.5, color: "var(--pg-accent)", background: "var(--pg-accent)11", border: "1px solid var(--pg-accent)33", padding: "1px 5px", borderRadius: 3 }}>{t}</span>)}
                  </div>
                  <div style={{ marginTop: 5, fontSize: 8, color: "var(--pg-text3)" }}>{tpl.nodes.length} nodes · {tpl.edges.length} edges · click to load</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ CANVAS + TOOLBAR ═════════════════════════════════════════════════ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Toolbar row 1 */}
          <div style={{ height: 46, background: "var(--pg-sidebar)", borderBottom: "1px solid var(--pg-border)", display: "flex", alignItems: "center", padding: "0 12px", justifyContent: "space-between", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 10, color: "var(--pg-accent)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
                <Workflow size={11} /> System Design
              </div>
              <div style={{ width: 1, height: 14, background: "var(--pg-border)" }} />
              {editingName
                ? <input autoFocus value={flowName} onChange={e => setFlowName(e.target.value)} onBlur={() => setEditingName(false)} onKeyDown={e => e.key === "Enter" && setEditingName(false)}
                    style={{ background: "var(--pg-panel)", border: "1px solid var(--pg-accent)", borderRadius: 5, color: "var(--pg-text)", fontSize: 11, padding: "2px 7px", fontFamily: "'DM Mono',monospace", outline: "none", width: 180 }} />
                : <span onClick={() => setEditingName(true)}
                    style={{ fontSize: 11, color: activeFlowId ? "var(--pg-text)" : "var(--pg-text3)", cursor: "text", padding: "2px 5px", borderRadius: 4, border: "1px solid transparent", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s", whiteSpace: "nowrap" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--pg-border2)"; e.currentTarget.style.background = "var(--pg-panel)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "transparent"; }}>
                    {flowName} <Edit3 size={8} />
                  </span>
              }
            </div>

            <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "nowrap" }}>
              {/* Undo/Redo */}
              <TBtn icon={RotateCcw} label="Undo"  onClick={doUndo} disabled={!store.canUndo} />
              <TBtn icon={Redo2}     label="Redo"  onClick={doRedo} disabled={!store.canRedo} />
              <div style={{ width: 1, height: 14, background: "var(--pg-border)" }} />

              {/* Canvas tools */}
              <TBtn icon={Grid3X3}   label="Snap to Grid" onClick={() => setSnapToGrid(!snapToGrid)} active={snapToGrid} />
              <TBtn icon={Map}       label="Toggle Minimap" onClick={() => setShowMinimap(!showMinimap)} active={showMinimap} />
              <TBtn icon={Maximize2} label="Auto Layout" onClick={doAutoLayout} />
              <div style={{ width: 1, height: 14, background: "var(--pg-border)" }} />

              {/* Zoom */}
              <TBtn icon={ZoomOut}   label="50%"  onClick={() => setZoom(0.5)} />
              <TBtn icon={Maximize2} label="Fit"  onClick={fitView} />
              <TBtn icon={ZoomIn}    label="150%" onClick={() => setZoom(1.5)} />
              <div style={{ width: 1, height: 14, background: "var(--pg-border)" }} />

              {/* Validation */}
              <button onClick={() => setShowValidation(!showValidation)} title="Validate flow"
                style={{ background: showValidation ? "#f8717122" : "none", border: `1px solid ${errorCount > 0 ? "#f87171" : warnCount > 0 ? "#fbbf24" : "var(--pg-border)"}`, borderRadius: 5, color: errorCount > 0 ? "#f87171" : warnCount > 0 ? "#fbbf24" : "var(--pg-text3)", fontSize: 9, padding: "4px 7px", cursor: "pointer", fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", gap: 4 }}>
                <AlertCircle size={11} />
                {(errorCount + warnCount) > 0 && <span>{errorCount + warnCount}</span>}
              </button>
              <div style={{ width: 1, height: 14, background: "var(--pg-border)" }} />

              {/* Flow management */}
              <TBtn icon={FolderOpenIcon} label="My Flows"  onClick={() => setShowFlowMgr(true)} />
              <TBtn icon={Save}           label="Save Flow" onClick={() => setShowSaveModal(true)} accent="#34d399" />
              <div style={{ width: 1, height: 14, background: "var(--pg-border)" }} />

              {/* Import */}
              <input ref={fileImportRef} type="file" accept=".json" onChange={handleFileImport} style={{ display: "none" }} />
              <TBtn icon={Upload} label="Import JSON" onClick={() => fileImportRef.current.click()} />

              {/* Export menu */}
              <div style={{ position: "relative" }}>
                <button
                  style={{ background: "var(--pg-accent)", border: "none", borderRadius: 5, color: "#fff", fontSize: 9.5, fontWeight: 700, padding: "5px 10px", cursor: "pointer", fontFamily: "'DM Mono',monospace", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 4 }}
                  onClick={() => {
                    const choice = prompt("Export as:\n1 = PNG\n2 = JSON\n3 = SVG\n\nEnter 1, 2, or 3:");
                    if (choice === "1") exportFlowPNG(rfWrapper.current, flowName);
                    else if (choice === "2") exportFlowJSON(flowName, nodes, edges, flowTags, flowDesc);
                    else if (choice === "3") exportFlowSVG(rfi, flowName);
                  }}>
                  <Download size={10} /> Export
                </button>
              </div>

              {/* Stats */}
              <span style={{ fontSize: 8.5, color: "var(--pg-border2)", whiteSpace: "nowrap" }}>{nodes.length}n · {edges.length}e</span>

              {/* Clear */}
              <TBtn icon={Trash2} label="Clear canvas" onClick={() => { if (window.confirm("Clear canvas?")) { store.snapshot(nodes, edges); setNodes([]); setEdges([]); setSelNode(null); setShowInspect(false); }}} danger />
            </div>
          </div>

          {/* Canvas + Inspector row */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "var(--pg-bg)" }}>
            <div ref={rfWrapper} style={{ flex: 1, position: "relative" }} onDragOver={onDragOver} onDrop={onDrop}>
              <ReactFlow
                nodes={nodes} edges={edges}
                onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                onConnect={onConnect} onInit={setRfi}
                nodeTypes={NODE_TYPES}
                onNodeClick={onNodeClick}
                onNodeContextMenu={onNodeCtx}
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
                onPaneClick={onPaneClick}
                onEdgeDoubleClick={onEdgeDblClick}
                deleteKeyCode="Delete"
                snapToGrid={snapToGrid}
                snapGrid={[20, 20]}
                fitView
                style={{ background: "var(--pg-bg)" }}
                defaultEdgeOptions={edgeDefaults}
              >
                <Background variant={snapToGrid ? BackgroundVariant.Lines : BackgroundVariant.Dots} gap={snapToGrid ? 20 : 28} size={1} color="var(--pg-border2)" />
                <Controls style={{ background: "var(--pg-sidebar)", border: "1px solid var(--pg-border)", borderRadius: 8 }} />
                {showMinimap && <MiniMap style={{ background: "var(--pg-sidebar)", border: "1px solid var(--pg-border)", borderRadius: 8 }} nodeColor={n => COLORS[n.data?.colorOverride || n.data?.colorKey]?.bg || "var(--pg-accent)"} maskColor="var(--pg-bg)bb" />}
              </ReactFlow>

              {nodes.length === 0 && (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
                  <Workflow size={40} color="var(--pg-border2)" style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: 11, color: "var(--pg-border2)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 5 }}>Drag nodes · Load a template</div>
                  <div style={{ fontSize: 9, color: "var(--pg-border2)" }}>Double-click edges to add labels · Right-click nodes for actions</div>
                </div>
              )}

              {/* Validation panel */}
              {showValidation && <ValidationPanelInline issues={validationIssues} onClose={() => setShowValidation(false)} />}
            </div>

            {/* Inspector */}
            {showInspect && selNode && selNode.type === "genai" && (
              <InspectorPanel
                node={selNode}
                issues={validationIssues}
                onClose={() => { setShowInspect(false); setSelNode(null); }}
                onUpdate={updateNode}
                onDelete={deleteNode}
                onDuplicate={duplicateNode}
              />
            )}
          </div>
        </div>

        {/* ── Overlays ── */}
        {ctxMenu && (
          <CtxMenu x={ctxMenu.x} y={ctxMenu.y} nodeId={ctxMenu.nodeId}
            onClose={() => setCtxMenu(null)}
            onDelete={deleteNode}
            onDuplicate={duplicateNode}
            onInspect={id => { const n = nodes.find(n => n.id === id); if (n) { setSelNode(n); setShowInspect(true); } }}
          />
        )}

        {hoveredNode && !showInspect && <NodePopoverInline node={hoveredNode} position={hoverPos} />}

        {editingEdge && (
          <EdgeLabelModal
            edge={editingEdge}
            onSave={label => {
              setEdges(eds => eds.map(e => e.id === editingEdge.id ? { ...e, label } : e));
              setEditingEdge(null);
            }}
            onClose={() => setEditingEdge(null)}
          />
        )}

        {showFlowMgr && (
          <FlowManager
            flows={store.savedFlows}
            onLoad={handleLoadFlow}
            onDelete={store.deleteFlow}
            onDuplicate={store.duplicateFlow}
            onFavorite={store.toggleFavorite}
            onNew={() => { setNodes([]); setEdges([]); setFlowName("Untitled Architecture"); setActiveFlowId(null); setShowFlowMgr(false); }}
            onImport={(data) => { store.snapshot(nodes, edges); setNodes(data.nodes); setEdges(data.edges); setFlowName(data.name); setShowFlowMgr(false); }}
            onClose={() => setShowFlowMgr(false)}
          />
        )}

        {showSaveModal && (
          <SaveModal
            initialName={flowName}
            initialDesc={flowDesc}
            initialTags={flowTags}
            onSave={handleSaveFlow}
            onClose={() => setShowSaveModal(false)}
          />
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
          .react-flow__controls button { background: #0d1117 !important; border-color: #21262d !important; color: #484f58 !important; }
          .react-flow__controls button:hover { background: #161b22 !important; color: #818cf8 !important; }
          .react-flow__edge-path { stroke: #818cf8 !important; }
          .react-flow__edge.selected .react-flow__edge-path { stroke: #a78bfa !important; stroke-width: 2 !important; }
          .react-flow__edge:hover .react-flow__edge-path { stroke: #a78bfa !important; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #0d1117; }
          ::-webkit-scrollbar-thumb { background: #21262d; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #30363d; }
          .react-flow__minimap-mask { fill: rgba(1,4,9,0.75); }
          .react-flow__background { background-color: #010409 !important; }
        `}</style>
      </div>
      )}
    </div>
  );
}

// ── Inline validation panel ──────────────────────────────────────────────────
function ValidationPanelInline({ issues, onClose }) {
  const errors   = issues.filter(i => i.type === "error");
  const warnings = issues.filter(i => i.type === "warning");
  const infos    = issues.filter(i => i.type === "info");

  return (
    <div style={{ position: "absolute", bottom: 60, right: 16, width: 300, background: "#0d1117", border: "1px solid #30363d", borderRadius: 10, zIndex: 100, boxShadow: "0 8px 32px rgba(0,0,0,0.6)", fontFamily: "'DM Mono',monospace", overflow: "hidden" }}>
      <div style={{ padding: "9px 12px", borderBottom: "1px solid #21262d", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#e6edf3" }}>Flow Validation</div>
          <div style={{ fontSize: 8, color: "#484f58", marginTop: 1 }}>{errors.length} errors · {warnings.length} warnings · {infos.length} suggestions</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#484f58" }}><X size={12} /></button>
      </div>
      <div style={{ padding: "9px 12px", maxHeight: 240, overflowY: "auto" }}>
        {issues.length === 0
          ? <div style={{ textAlign: "center", padding: "14px 0", color: "#484f58" }}>
              <CheckCircle size={20} color="#34d399" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 10 }}>All clear!</div>
            </div>
          : issues.map((issue, i) => {
              const cfg = { error: { color: "#f87171", bg: "#f8717111" }, warning: { color: "#fbbf24", bg: "#fbbf2411" }, info: { color: "#818cf8", bg: "#818cf811" } }[issue.type];
              return (
                <div key={i} style={{ display: "flex", gap: 7, padding: "6px 8px", background: cfg.bg, borderRadius: 5, marginBottom: 5 }}>
                  <AlertCircle size={11} color={cfg.color} style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontSize: 9.5, color: "#e6edf3", lineHeight: 1.5 }}>{issue.message}</div>
                </div>
              );
            })
        }
      </div>
    </div>
  );
}

// ── Inline node popover ────────────────────────────────────────────────────────
function NodePopoverInline({ node, position }) {
  if (!node?.data) return null;
  const { data } = node;
  return (
    <div style={{ position: "fixed", top: position.y + 12, left: position.x + 12, zIndex: 8000, width: 256, background: "#0d1117", border: "1px solid #30363d", borderRadius: 9, padding: 11, boxShadow: "0 8px 32px rgba(0,0,0,0.7)", fontFamily: "'DM Mono',monospace", pointerEvents: "none" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#e6edf3", marginBottom: 5 }}>{data.label}</div>
      <div style={{ fontSize: 9.5, color: "#8b949e", lineHeight: 1.65, marginBottom: data.cost ? 6 : 0 }}>{data.info || data.sub}</div>
      {data.cost && <div style={{ fontSize: 8.5, color: "#34d399", background: "#34d3991a", border: "1px solid #34d39933", padding: "2px 6px", borderRadius: 3, display: "inline-block", marginTop: 4 }}>💰 {data.cost}</div>}
      <div style={{ fontSize: 7.5, color: "#30363d", borderTop: "1px solid #21262d", paddingTop: 5, marginTop: 6 }}>Click → inspect · Right-click → actions</div>
    </div>
  );
}