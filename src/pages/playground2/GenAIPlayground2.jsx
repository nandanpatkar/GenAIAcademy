import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Activity,
  AlertCircle,
  Archive,
  ArrowLeft,
  BarChart3,
  Binary,
  Bot,
  Brain,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Cloud,
  Code2,
  Download,
  FileJson,
  Gauge,
  GitBranch,
  Globe2,
  KeyRound,
  Layers3,
  LayoutTemplate,
  Lightbulb,
  ListTodo,
  MessageSquare,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Table2,
  Target,
  Timer,
  Trash2,
  Upload,
  UserCheck,
  Users,
  Webhook,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { ALL_COMPONENTS, CHALLENGES, LEGACY_TEMPLATES, PATTERNS, SERVICE_BY_ID } from "./data/serviceCatalog";
import { generateFlowArchitecture, normalizeFlowArchitecture } from "../../services/aiService";
import "./genai-playground2.css";

const FALLBACK_ICONS = { Archive, Binary, Bot, Brain, BrainCircuit, Gauge, GitBranch, Globe2, KeyRound, Layers3, ListTodo, MessageSquare, Search, ShieldCheck, Sparkles, Table2, UserCheck, Users, Webhook, Workflow, Zap };
const uid = (prefix = "node") => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const arrowEdge = (id, source, target, label = "", options = {}) => ({
  id,
  source,
  target,
  type: options.feedback ? "smoothstep" : "bezier",
  pathOptions: options.feedback ? { offset: 34, borderRadius: 18 } : { curvature: options.curvature ?? 0.22 },
  label: options.showLabel === false ? "" : label,
  data: { flowLabel: label, role: options.role || "primary", feedback: Boolean(options.feedback) },
  animated: false,
  markerEnd: { type: MarkerType.ArrowClosed, color: options.feedback ? "#64748b" : "#8b5cf6" },
  style: { stroke: options.feedback ? "#64748b" : "#8b5cf6", strokeWidth: options.feedback ? 1.2 : 1.6, strokeLinecap: "round", strokeDasharray: options.feedback ? "5 4" : undefined, opacity: options.feedback ? 0.72 : 0.9 },
  labelStyle: { fill: "#cbd5e1", fontSize: 9, fontWeight: 500 },
  labelBgStyle: { fill: "#0b1220", fillOpacity: 0.88 },
});

const shouldShowFlowLabel = (label = "", role = "primary") => role !== "primary" || /branch|fallback|escalat|human|tool|retriev|error|retry|approved|denied|timeout|security|condition|no match/i.test(String(label));

// Layer the graph left-to-right and keep reverse/callback relationships on a
// quieter feedback route. The AI is free to describe the graph; this function
// owns the readable spatial arrangement.
function layoutGeneratedGraph(sourceNodes, sourceEdges) {
  const nodes = sourceNodes.map((node) => ({ ...node }));
  const ids = nodes.map((node) => String(node.id));
  const order = new Map(ids.map((id, index) => [id, index]));
  const validEdges = sourceEdges.filter((edge) => order.has(String(edge.source)) && order.has(String(edge.target)) && edge.source !== edge.target);
  const forwardEdges = validEdges.filter((edge) => order.get(String(edge.source)) < order.get(String(edge.target)));
  const rank = new Map(ids.map((id) => [id, 0]));
  [...ids].sort((left, right) => order.get(left) - order.get(right)).forEach((source) => {
    forwardEdges.filter((edge) => String(edge.source) === source).forEach((edge) => {
      const target = String(edge.target);
      rank.set(target, Math.max(rank.get(target) || 0, (rank.get(source) || 0) + 1));
    });
  });

  const layers = new Map();
  ids.forEach((id) => {
    const layer = rank.get(id) || 0;
    if (!layers.has(layer)) layers.set(layer, []);
    layers.get(layer).push(id);
  });
  const layerKeys = [...layers.keys()].sort((left, right) => left - right);
  layerKeys.forEach((layer) => layers.get(layer).sort((left, right) => order.get(left) - order.get(right)));

  const slot = new Map();
  for (let pass = 0; pass < 4; pass += 1) {
    layerKeys.forEach((layer) => layers.get(layer).forEach((id, index) => slot.set(id, index)));
    layerKeys.slice(1).forEach((layer) => {
      layers.get(layer).sort((left, right) => {
        const score = (id) => {
          const incoming = validEdges.filter((edge) => String(edge.target) === id);
          if (!incoming.length) return order.get(id);
          return incoming.reduce((total, edge) => total + (slot.get(String(edge.source)) ?? order.get(String(edge.source))), 0) / incoming.length;
        };
        return score(left) - score(right) || order.get(left) - order.get(right);
      });
    });
  }
  layerKeys.forEach((layer) => layers.get(layer).forEach((id, index) => slot.set(id, index)));

  const laidNodes = nodes.map((node) => {
    const id = String(node.id);
    const layer = rank.get(id) || 0;
    const index = slot.get(id) || 0;
    return { ...node, position: { x: 90 + layer * 270, y: 120 + index * 165 } };
  });
  const laidEdges = validEdges.map((edge, index) => {
    const source = String(edge.source);
    const target = String(edge.target);
    const feedback = (rank.get(target) || 0) <= (rank.get(source) || 0);
    const role = edge.role || edge.data?.role || (feedback ? "feedback" : "primary");
    const label = String(edge.label || edge.condition || edge.data?.flowLabel || "");
    return arrowEdge(edge.id || `generated-edge-${index}`, source, target, label, { feedback, role, showLabel: shouldShowFlowLabel(label, role) });
  });
  return { nodes: laidNodes, edges: laidEdges };
}

const patternPositions = [
  [40, 250], [280, 250], [520, 130], [520, 330], [770, 330], [1020, 330], [1270, 330], [1510, 250],
];

function newNode(serviceId, position, index = 0) {
  const service = SERVICE_BY_ID[serviceId] || SERVICE_BY_ID["lambda"];
  return {
    id: uid(serviceId),
    type: "genaiService",
    position: { x: position?.[0] ?? 160 + index * 230, y: position?.[1] ?? 220 },
    data: { serviceId: service.id, label: service.label, service, runtimeState: "idle", config: {} },
  };
}

function makePattern(patternId) {
  const pattern = PATTERNS.find((item) => item.id === patternId) || PATTERNS[0];
  const nodes = pattern.nodeIds.map((serviceId, index) => newNode(serviceId, patternPositions[index] || [180 + index * 220, 240 + (index % 2) * 140], index));
  const edges = nodes.slice(1).map((node, index) => arrowEdge(`edge-${nodes[index].id}-${node.id}`, nodes[index].id, node.id, index === 0 ? "request" : "context"));
  if (patternId === "rag") {
    const s3 = nodes.find((node) => node.data.serviceId === "s3");
    const embeddings = nodes.find((node) => node.data.serviceId === "embeddings");
    const vector = nodes.find((node) => node.data.serviceId === "opensearch");
    if (s3 && embeddings && vector) edges.push(arrowEdge(`edge-${s3.id}-${embeddings.id}`, s3.id, embeddings.id, "documents"), arrowEdge(`edge-${embeddings.id}-${vector.id}`, embeddings.id, vector.id, "vectors"));
  }
  return { nodes, edges };
}

function ServiceIcon({ service, size = 25 }) {
  const [broken, setBroken] = useState(false);
  const Fallback = FALLBACK_ICONS[service?.fallbackIcon] || Cloud;
  if (!service?.iconUrl || broken) return <Fallback size={size} strokeWidth={1.8} />;
  return <img src={service.flowIconUrl || service.iconUrl} alt="" width={size} height={size} onError={() => setBroken(true)} />;
}

function GenAIServiceNode({ data, selected }) {
  const service = data.service || SERVICE_BY_ID[data.serviceId] || SERVICE_BY_ID.lambda;
  const runtime = data.runtimeState || "idle";
  return (
    <div className={`g2-node ${selected ? "is-selected" : ""} runtime-${runtime}`} style={{ "--node-color": service.color }}>
      <Handle type="target" position={Position.Left} id="in" />
      <div className="g2-node-accent" />
      <div className="g2-node-head">
        <span className="g2-node-icon"><ServiceIcon service={service} size={25} /></span>
        <span className="g2-node-title"><strong>{service.label}</strong><small>{service.provider} · {service.category}</small></span>
        {runtime !== "idle" && <span className={`g2-runtime-dot ${runtime}`} />}
      </div>
      <div className="g2-node-foot"><span>{service.kind}</span><span>{runtime === "active" ? "processing" : runtime === "complete" ? "complete" : "ready"}</span></div>
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  );
}

const nodeTypes = { genaiService: GenAIServiceNode };

function PillarBar({ label, value, color }) {
  return <div className="g2-pillar-row"><div><span>{label}</span><b>{value}%</b></div><div className="g2-progress"><i style={{ width: `${value}%`, background: color }} /></div></div>;
}

function StudioDrawer({ prompt, setPrompt, onGenerate, onApplyJson, projectJson, setProjectJson, isGenerating, studioError }) {
  return <div className="g2-drawer-content">
    <div className="g2-drawer-kicker">STUDIO / AI ARCHITECT</div>
    <h2>Turn an idea into a testable flow</h2>
    <p className="g2-muted">Describe the user journey, constraints, model choice, or failure mode. Studio turns it into a starting pattern you can edit on the canvas.</p>
    <textarea className="g2-textarea" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Build a customer support RAG assistant with private documents, citations, and human escalation…" />
    <button className="g2-primary-btn" onClick={onGenerate} disabled={isGenerating}>{isGenerating ? <RefreshCw size={15} className="g2-spin" /> : <Sparkles size={15} />} {isGenerating ? "Generating architecture…" : "Generate architecture"}</button>
    {studioError && <div className="g2-studio-error"><AlertCircle size={14} /><span>{studioError}</span></div>}
    <div className="g2-section-label">Try a direction</div>
    <div className="g2-prompt-grid">
      {["RAG over private documents", "Tool-using agent with approvals", "Hybrid model gateway"].map((item) => <button key={item} className="g2-suggestion" onClick={() => setPrompt(item)}>{item}<ChevronRight size={13} /></button>)}
    </div>
    <div className="g2-divider" />
    <div className="g2-drawer-kicker">CODE MODE</div>
    <p className="g2-muted">Edit the graph as JSON when you want reproducible architecture reviews.</p>
    <textarea className="g2-codearea" value={projectJson} onChange={(event) => setProjectJson(event.target.value)} spellCheck="false" />
    <button className="g2-secondary-btn" onClick={onApplyJson}><FileJson size={14} /> Apply JSON to canvas</button>
  </div>;
}

function SimulationDrawer({ simQps, setSimQps, failureMode, setFailureMode, simResult, isRunning, step, onRun, onReset }) {
  return <div className="g2-drawer-content">
    <div className="g2-drawer-kicker">SIMULATION / RUNTIME WALKTHROUGH</div>
    <h2>Watch the request move</h2>
    <p className="g2-muted">Replay the primary path, inject a downstream failure, and see the cost and latency envelope change.</p>
    <div className="g2-control-row"><label>Traffic <b>{simQps} QPS</b></label><input type="range" min="1" max="2000" value={simQps} onChange={(event) => setSimQps(Number(event.target.value))} /></div>
    <label className="g2-switch-row"><span><span className="g2-switch-title">Inject model failure</span><small>Test fallback and escalation behavior.</small></span><input type="checkbox" checked={failureMode} onChange={(event) => setFailureMode(event.target.checked)} /></label>
    <div className="g2-run-row"><button className="g2-primary-btn" onClick={onRun}><Play size={15} /> {isRunning ? `Step ${step}` : "Run simulation"}</button><button className="g2-icon-btn" onClick={onReset} title="Reset runtime"><RefreshCw size={15} /></button></div>
    {simResult && <div className="g2-metric-grid"><div><small>p95 latency</small><strong>{simResult.latency} ms</strong></div><div><small>throughput</small><strong>{simResult.throughput} req/s</strong></div><div><small>monthly cost</small><strong>${simResult.cost}</strong></div><div><small>failure path</small><strong className={simResult.degraded ? "is-warn" : "is-good"}>{simResult.degraded ? "degraded" : "healthy"}</strong></div></div>}
    {simResult?.events?.length > 0 && <div className="g2-event-log">{simResult.events.map((event) => <div key={event.id}><span className={event.status} />{event.label}<em>{event.time} ms</em></div>)}</div>}
  </div>;
}

function ReviewDrawer({ reviewScore, reviewRows, onFocus }) {
  return <div className="g2-drawer-content">
    <div className="g2-drawer-kicker">REVIEW / WELL-ARCHITECTED LENS</div>
    <div className="g2-review-score"><div className="g2-score-ring" style={{ "--score": `${reviewScore * 3.6}deg` }}><strong>{reviewScore}</strong><small>/100</small></div><div><h2>Architecture health</h2><p className="g2-muted">Six AWS-inspired pillars plus responsible GenAI controls.</p></div></div>
    <div className="g2-review-list">{reviewRows.map((row) => <button key={row.id} className="g2-review-row" onClick={() => row.nodeId && onFocus(row.nodeId)}><span className="g2-review-status" style={{ background: row.color }} /><span><strong>{row.title}</strong><small>{row.detail}</small></span><b>{row.value}%</b></button>)}</div>
    <div className="g2-callout"><Lightbulb size={15} /><span>Use Review as a design conversation: every finding links back to a node or a missing control.</span></div>
  </div>;
}

function ChallengeDrawer({ challenge, challengeScore, onSelectChallenge, onFocus }) {
  return <div className="g2-drawer-content">
    <div className="g2-drawer-kicker">CHALLENGE / ARCHITECTURE INTERVIEW</div>
    <h2>Prove the design</h2>
    <p className="g2-muted">Pick a brief, build on the canvas, then validate the required responsibilities and trade-offs.</p>
    <div className="g2-challenge-tabs">{CHALLENGES.map((item) => <button key={item.id} className={challenge.id === item.id ? "active" : ""} onClick={() => onSelectChallenge(item)}>{item.label}</button>)}</div>
    <div className="g2-challenge-brief"><span>{challenge.difficulty}</span><p>{challenge.brief}</p></div>
    <div className="g2-challenge-score"><strong>{challengeScore.score}%</strong><span>{challengeScore.passed} of {challengeScore.total} checks passed</span></div>
    <div className="g2-check-list">{challengeScore.checks.map((check) => <button key={check.id} onClick={() => check.nodeId && onFocus(check.nodeId)}><span className={check.pass ? "pass" : "fail"}>{check.pass ? <Check size={13} /> : <AlertCircle size={13} />}</span><span>{check.label}</span>{check.nodeId && <ChevronRight size={13} />}</button>)}</div>
  </div>;
}

function InspectorDrawer({ selectedNode, onDelete, onClose }) {
  if (!selectedNode) return <div className="g2-drawer-content"><div className="g2-empty-drawer"><CircleDot size={24} /><h2>Select a component</h2><p>Choose a node on the canvas to inspect its role, provider, and design notes.</p></div></div>;
  const service = selectedNode.data.service || SERVICE_BY_ID[selectedNode.data.serviceId];
  return <div className="g2-drawer-content"><div className="g2-drawer-kicker">COMPONENT / INSPECTOR</div><div className="g2-inspector-title"><ServiceIcon service={service} size={36} /><div><h2>{service.label}</h2><p>{service.provider} · {service.category}</p></div></div><p className="g2-muted">{service.description}</p><div className="g2-inspector-fields"><label>Role<input value={service.kind} readOnly /></label><label>Provider<input value={service.provider} readOnly /></label><label>Design note<textarea placeholder="What decision does this component represent?" /></label></div><button className="g2-danger-btn" onClick={() => { onDelete(selectedNode.id); onClose(); }}><Trash2 size={14} /> Remove component</button></div>;
}

function PlaygroundHome({ patterns, templates, onStudio, onDesign, onPattern, onTemplate }) {
  return <main className="g2-home">
    <section className="g2-home-hero">
      <div className="g2-home-kicker"><span className="g2-home-kicker-dot" /> GEN AI ARCHITECTURE WORKBENCH</div>
      <h1>Design systems that are ready to run.</h1>
      <p>Turn a product idea into an editable architecture, test its runtime behavior, and review the decisions before you ship.</p>
      <div className="g2-home-actions"><button className="g2-home-primary" onClick={onStudio}><Sparkles size={16} /> Ask Studio to build it</button><button className="g2-home-secondary" onClick={onDesign}><Layers3 size={16} /> Start from a blank canvas</button></div>
      <div className="g2-home-meta"><span><CheckCircle2 size={13} /> AWS, Azure, Databricks, and Flow Design services</span><span><Workflow size={13} /> Editable paths and branching logic</span><span><Target size={13} /> Review against production concerns</span></div>
    </section>
    <section className="g2-home-section"><div className="g2-home-section-head"><div><span className="g2-drawer-kicker">QUICK STARTS</span><h2>Choose an architecture shape</h2></div><button className="g2-home-link" onClick={onDesign}>View all components <ChevronRight size={14} /></button></div><div className="g2-home-pattern-grid">{patterns.slice(0, 4).map((pattern) => <button className="g2-home-pattern" key={pattern.id} onClick={() => onPattern(pattern.id)}><span className="g2-home-pattern-icon"><Workflow size={18} /></span><span><strong>{pattern.label}</strong><small>{pattern.description}</small></span><ChevronRight size={15} /></button>)}</div></section>
    <section className="g2-home-section g2-home-templates"><div className="g2-home-section-head"><div><span className="g2-drawer-kicker">FROM YOUR PLAYGROUND</span><h2>Continue with a template</h2></div><button className="g2-home-link" onClick={onDesign}>Open template library <ChevronRight size={14} /></button></div><div className="g2-home-template-row">{templates.slice(0, 3).map((template) => <button className="g2-home-template" key={template.id} onClick={() => onTemplate(template.id)}><LayoutTemplate size={16} /><span><strong>{template.label}</strong><small>{template.description || `${template.nodes.length} nodes · ${template.edges.length} connections`}</small></span></button>)}</div></section>
  </main>;
}

function GenAIPlayground2Canvas({ onClose, theme, isSidebarCollapsed, setIsSidebarCollapsed }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [mode, setMode] = useState("home");
  const [showHome, setShowHome] = useState(true);
  const [railTab, setRailTab] = useState("components");
  const [drawer, setDrawer] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brief, setBrief] = useState("Build a production-ready RAG assistant with citations, private documents, and a safe escalation path.");
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState("Start from a pattern or assemble the architecture from the rail.");
  const [simQps, setSimQps] = useState(120);
  const [failureMode, setFailureMode] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [challenge, setChallenge] = useState(CHALLENGES[0]);
  const [projectJson, setProjectJson] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [studioError, setStudioError] = useState("");
  const [visualTheme, setVisualTheme] = useState(() => {
    try { return localStorage.getItem("genai_playground2_theme") || "light"; } catch { return "light"; }
  });
  const reactFlow = useReactFlow();
  const fitCanvas = useCallback(() => window.setTimeout(() => reactFlow.fitView({ padding: 0.22, duration: 320 }), 60), [reactFlow]);

  useEffect(() => {
    const initial = makePattern("rag");
    setNodes(initial.nodes);
    setEdges(initial.edges);
    setProjectJson(JSON.stringify({ brief, nodes: initial.nodes, edges: initial.edges }, null, 2));
    fitCanvas();
    // The host App owns global sidebar state. The v2 surface only owns its contextual rail.
  }, [fitCanvas]);

  useEffect(() => {
    try { localStorage.setItem("genai_playground2_theme", visualTheme); } catch { /* best effort */ }
  }, [visualTheme]);

  const categories = useMemo(() => ["All", ...new Set(ALL_COMPONENTS.map((service) => service.category))], []);
  const filteredServices = useMemo(() => ALL_COMPONENTS.filter((service) => (category === "All" || service.category === category) && `${service.label} ${service.provider} ${service.category}`.toLowerCase().includes(search.toLowerCase())), [category, search]);
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || null;
  const nodeKinds = useMemo(() => new Set(nodes.map((node) => node.data.service?.kind || SERVICE_BY_ID[node.data.serviceId]?.kind)), [nodes]);

  const applyPattern = useCallback((patternId) => {
    const next = makePattern(patternId);
    setNodes(next.nodes);
    setEdges(next.edges);
    setSelectedNodeId(null);
    setNotice(`${PATTERNS.find((pattern) => pattern.id === patternId)?.label || "Pattern"} loaded. Make the trade-offs explicit.`);
    setMode("design");
    setDrawer(null);
    fitCanvas();
  }, [fitCanvas, setNodes, setEdges]);

  const applyLegacyTemplate = useCallback((templateId) => {
    const template = LEGACY_TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;
    setNodes(template.nodes);
    setEdges(template.edges);
    setSelectedNodeId(null);
    setMode("design");
    setDrawer(null);
    fitCanvas();
    setNotice(`${template.label} loaded from the original GenAI Playground template library.`);
  }, [fitCanvas, setNodes, setEdges]);

  const addService = useCallback((serviceId) => {
    const service = SERVICE_BY_ID[serviceId];
    if (!service) return;
    const position = { x: 170 + (nodes.length % 4) * 250, y: 120 + Math.floor(nodes.length / 4) * 170 };
    const node = newNode(serviceId, [position.x, position.y], nodes.length);
    setNodes((current) => [...current, node]);
    setSelectedNodeId(node.id);
    setDrawer("inspect");
    setNotice(`${service.label} added to the canvas.`);
  }, [nodes.length, setNodes]);

  const onConnect = useCallback((connection) => setEdges((current) => addEdge({ ...connection, ...arrowEdge(uid("edge"), connection.source, connection.target) }, current)), [setEdges]);
  const focusNode = useCallback((nodeId) => { setSelectedNodeId(nodeId); setDrawer("inspect"); const node = nodes.find((item) => item.id === nodeId); if (node) reactFlow.setCenter(node.position.x + 100, node.position.y + 50, { zoom: 1.15, duration: 450 }); }, [nodes, reactFlow]);

  const metrics = useMemo(() => {
    const modelCount = nodes.filter((node) => ["llm", "embedder"].includes(node.data.service?.kind)).length;
    const vectorCount = nodes.filter((node) => node.data.service?.kind === "vector").length;
    const cacheCount = nodes.filter((node) => node.data.service?.kind === "cache").length;
    const baseLatency = 110 + nodes.length * 13 - cacheCount * 26 - vectorCount * 8;
    const throughput = Math.max(1, Math.round((simQps * (failureMode ? 0.58 : 0.92)) / Math.max(1, modelCount)));
    const monthlyRequests = simQps * 2592000;
    const cost = (monthlyRequests / 1000000) * (0.24 + modelCount * 0.82) + vectorCount * 38 + nodes.filter((node) => node.data.service?.provider === "AWS").length * 7;
    return { latency: Math.max(70, Math.round(baseLatency + simQps / 20 + (failureMode ? 180 : 0))), throughput, cost: cost.toFixed(2), monthlyRequests, modelCount };
  }, [nodes, simQps, failureMode]);

  const runSimulation = useCallback(() => {
    const path = nodes.filter((node) => node.data.service?.kind !== "datasource").slice(0, 8);
    const events = path.map((node, index) => ({ id: node.id, label: `${node.data.label} ${failureMode && node.data.service?.kind === "llm" ? "→ fallback" : "processed"}`, time: Math.round(38 + index * 22 + (node.data.service?.kind === "llm" ? 140 : 0)), status: failureMode && node.data.service?.kind === "llm" ? "warn" : "ok" }));
    setSimResult({ ...metrics, degraded: failureMode, events, path: path.map((node) => node.id) });
    setStep(0);
    setIsRunning(true);
    setMode("simulate");
    setDrawer("simulate");
  }, [failureMode, metrics, nodes]);

  useEffect(() => {
    if (!isRunning || !simResult?.path?.length) return undefined;
    const timer = window.setTimeout(() => {
      const next = step + 1;
      setStep(next);
      setNodes((current) => current.map((node) => ({ ...node, data: { ...node.data, runtimeState: simResult.path[next - 1] === node.id ? "active" : simResult.path.slice(0, next).includes(node.id) ? "complete" : "idle" } })));
      if (next >= simResult.path.length) setIsRunning(false);
    }, 460);
    return () => window.clearTimeout(timer);
  }, [isRunning, simResult, step, setNodes]);

  const resetRuntime = useCallback(() => { setIsRunning(false); setStep(0); setNodes((current) => current.map((node) => ({ ...node, data: { ...node.data, runtimeState: "idle" } }))); }, [setNodes]);

  const reviewRows = useMemo(() => {
    const hasObservability = nodeKinds.has("observability");
    const hasGuardrail = nodeKinds.has("guardrail");
    const hasAuth = nodeKinds.has("source") && (nodeKinds.has("guardrail") || nodes.some((node) => node.data.serviceId === "cognito"));
    const rows = [
      { id: "operational", title: "Operational excellence", detail: hasObservability ? "Telemetry and feedback loop present." : "Add metrics, traces, and an evaluation loop.", value: hasObservability ? 88 : 42, color: "#60a5fa", nodeId: nodes.find((node) => node.data.service?.kind === "observability")?.id },
      { id: "security", title: "Security & responsible AI", detail: hasGuardrail ? "Guardrail or policy boundary is explicit." : "Add content, PII, and prompt-injection controls.", value: hasGuardrail ? 91 : 34, color: "#f87171", nodeId: nodes.find((node) => node.data.service?.kind === "guardrail")?.id },
      { id: "reliability", title: "Reliability", detail: edges.length >= nodes.length - 1 ? "Primary path is connected." : "Connect the major request path.", value: edges.length >= nodes.length - 1 ? 84 : 46, color: "#34d399" },
      { id: "performance", title: "Performance efficiency", detail: nodeKinds.has("cache") ? "Cache strategy is visible." : "Consider semantic or response caching.", value: nodeKinds.has("cache") ? 82 : 57, color: "#fbbf24", nodeId: nodes.find((node) => node.data.service?.kind === "cache")?.id },
      { id: "cost", title: "Cost optimization", detail: metrics.cost < 260 ? "Model and service footprint is explainable." : "Compare model routing and caching choices.", value: metrics.cost < 260 ? 78 : 51, color: "#c084fc" },
      { id: "sustainability", title: "Sustainability", detail: nodes.length < 12 ? "Flow is appropriately small." : "Reduce unnecessary hops and model calls.", value: nodes.length < 12 ? 81 : 55, color: "#2dd4bf" },
    ];
    return hasAuth ? rows : rows.map((row) => row.id === "security" ? { ...row, value: Math.max(20, row.value - 12), detail: `${row.detail} Identity boundary is not explicit.` } : row);
  }, [edges.length, metrics.cost, nodeKinds, nodes]);
  const reviewScore = Math.round(reviewRows.reduce((sum, row) => sum + row.value, 0) / reviewRows.length);

  const challengeScore = useMemo(() => {
    const checks = challenge.requiredKinds.map((kind) => { const node = nodes.find((item) => item.data.service?.kind === kind); return { id: kind, label: `Include a ${kind} responsibility`, pass: Boolean(node), nodeId: node?.id }; });
    checks.push({ id: "edges", label: `Connect at least ${challenge.minEdges} meaningful relationships`, pass: edges.length >= challenge.minEdges });
    checks.push({ id: "brief", label: "Capture a clear design brief", pass: brief.trim().length > 35 });
    const passed = checks.filter((check) => check.pass).length;
    return { checks, passed, total: checks.length, score: Math.round((passed / checks.length) * 100) };
  }, [brief, challenge, edges.length, nodes]);

  const generateFromPrompt = useCallback(async () => {
    const request = prompt.trim() || brief.trim();
    if (!request || isGenerating) return;
    setIsGenerating(true);
    setStudioError("");
    try {
      const parsed = await generateFlowArchitecture(request);
      const sourceNodes = Array.isArray(parsed?.nodes) ? parsed.nodes.slice(0, 18) : [];
      if (!sourceNodes.length) throw new Error("The AI returned no architecture nodes.");
      const idMap = new Map(sourceNodes.map((node, index) => [String(node.id || index), `ai:${String(node.id || index)}:${Date.now()}`]));
      const generatedNodes = sourceNodes.map((node, index) => {
        const labelCandidates = [node.label, node.sub, node.info].map((value) => String(value || "").trim()).filter((value) => value.length >= 3 && /[a-z]{3}/i.test(value));
        const label = labelCandidates[0] || `${node.colorKey ? `${node.colorKey} ` : "AI "}component ${index + 1}`;
        const normalizedLabel = label.toLowerCase();
        const eligibleServices = ALL_COMPONENTS.filter((service) => service.label.trim().length >= 4);
        const matched = eligibleServices.find((service) => service.label.toLowerCase() === normalizedLabel) || eligibleServices.find((service) => normalizedLabel.includes(service.label.toLowerCase()) && service.label.trim().length >= 4);
        const color = node.colorKey === "azure" ? "#2563eb" : node.colorKey === "databricks" ? "#fc8181" : node.colorKey === "aws" ? "#f59e0b" : "#8b5cf6";
        const service = matched ? { ...matched, label, description: node.info || node.sub || matched.description } : { id: `ai-service:${index}`, label, provider: node.colorKey || "AI", category: "Generated", iconUrl: null, fallbackIcon: node.icon || "Cpu", color, kind: node.colorKey === "io" ? "sink" : node.colorKey === "llm" ? "llm" : "service", description: node.info || node.sub || "AI-generated architecture component" };
        const aiId = idMap.get(String(node.id || index));
        const position = node.position || { x: 120 + (index % 5) * 260, y: 180 + Math.floor(index / 5) * 170 };
        return { id: aiId, type: "genaiService", position, data: { serviceId: service.id, label: service.label, service, runtimeState: "idle", config: {}, aiGenerated: true } };
      });
      const rawGeneratedEdges = (Array.isArray(parsed.edges) ? parsed.edges : []).map((edge, index) => {
        const source = idMap.get(String(edge.source));
        const target = idMap.get(String(edge.target));
        return source && target ? { id: `ai-edge:${Date.now()}:${index}`, source, target, label: String(edge.label || edge.condition || ""), role: edge.role || edge.data?.role || "primary" } : null;
      }).filter(Boolean);
      const generatedGraph = layoutGeneratedGraph(generatedNodes, rawGeneratedEdges);
      setNodes(generatedGraph.nodes);
      setEdges(generatedGraph.edges);
      setProjectJson(JSON.stringify({ name: parsed.name || "AI generated architecture", description: parsed.description || request, nodes: generatedGraph.nodes, edges: generatedGraph.edges }, null, 2));
      setMode("studio");
      setDrawer("studio");
      setNotice(`Studio generated ${generatedGraph.nodes.length} nodes and ${generatedGraph.edges.length} readable connections from your brief.`);
      fitCanvas();
    } catch (error) {
      const value = request.toLowerCase();
      const patternId = value.includes("agent") || value.includes("tool") ? "agent" : value.includes("hybrid") || value.includes("provider") ? "hybrid" : value.includes("ingest") || value.includes("index") ? "ingestion" : "rag";
      applyPattern(patternId);
      setMode("studio");
      setDrawer("studio");
      setStudioError(`AI provider unavailable (${error.message}). Loaded the ${PATTERNS.find((item) => item.id === patternId).label} fallback so you can keep designing.`);
      setNotice("Studio used a local fallback pattern because the AI provider did not respond.");
    } finally {
      setIsGenerating(false);
    }
  }, [ALL_COMPONENTS, applyPattern, brief, fitCanvas, isGenerating, prompt, setEdges, setNodes]);

  const applyJson = useCallback(() => {
    try {
      const parsed = normalizeFlowArchitecture(JSON.parse(projectJson), brief);
      if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) throw new Error("Expected nodes and edges arrays");
      const isGeneratedGraph = parsed.nodes.some((node) => node.data?.aiGenerated || String(node.id).startsWith("ai:"));
      const nextGraph = isGeneratedGraph ? layoutGeneratedGraph(parsed.nodes, parsed.edges) : { nodes: parsed.nodes, edges: parsed.edges };
      setNodes(nextGraph.nodes);
      setEdges(nextGraph.edges);
      if (parsed.brief) setBrief(parsed.brief);
      setNotice("JSON applied successfully.");
    } catch (error) { setNotice(`Could not apply JSON: ${error.message}`); }
  }, [projectJson, setEdges, setNodes]);

  const exportProject = useCallback(() => {
    const payload = { version: "genai-playground-2.0", brief, nodes, edges, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "genai-playground-2-architecture.json"; link.click(); URL.revokeObjectURL(link.href);
  }, [brief, edges, nodes]);

  const openMode = (nextMode) => { setShowHome(false); setMode(nextMode); setDrawer(nextMode === "design" ? null : nextMode); if (nextMode === "simulate") runSimulation(); };
  const openHome = () => { setShowHome(true); setMode("home"); setDrawer(null); setSelectedNodeId(null); };
  const openStudioFromHome = () => { setShowHome(false); setMode("studio"); setDrawer("studio"); };
  const openBlankCanvas = () => { setShowHome(false); setMode("design"); setDrawer(null); setSelectedNodeId(null); setNodes([]); setEdges([]); setProjectJson(JSON.stringify({ brief, nodes: [], edges: [] }, null, 2)); setNotice("Blank canvas ready. Add services from the component rail or ask Studio to generate a flow."); };

  return <div className={`g2-shell theme-${visualTheme}`}>
    <header className="g2-topbar">
      <button className="g2-brand g2-brand-button" onClick={openHome}><span className="g2-brand-mark"><Sparkles size={16} /></span><span><strong>Gen AI Playground <span>2.0</span></strong><small>Architecture studio · simulation lab</small></span></button>
      <div className="g2-phase-tabs" role="tablist">{[["design", Layers3, "Design"], ["studio", Sparkles, "Studio"], ["simulate", Activity, "Simulate"], ["review", Target, "Review"], ["challenge", Lightbulb, "Challenge"]].map(([id, Icon, label]) => <button key={id} className={mode === id ? "active" : ""} onClick={() => openMode(id)}><Icon size={14} />{label}</button>)}</div>
      <div className="g2-top-actions"><span className="g2-saved"><CheckCircle2 size={13} /> autosaved</span><button className="g2-theme-btn" type="button" onClick={() => setVisualTheme((current) => current === "dark" ? "light" : "dark")} title={`Switch to ${visualTheme === "dark" ? "light" : "dark"} mode`}>{visualTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}<span>{visualTheme === "dark" ? "Light" : "Dark"}</span></button><button className="g2-icon-btn" onClick={exportProject} title="Export architecture"><Download size={15} /></button><button className="g2-close-btn" onClick={onClose}><ArrowLeft size={15} /> Exit</button></div>
    </header>
    {showHome ? <PlaygroundHome patterns={PATTERNS} templates={LEGACY_TEMPLATES} onStudio={openStudioFromHome} onDesign={openBlankCanvas} onPattern={(patternId) => { applyPattern(patternId); setShowHome(false); }} onTemplate={(templateId) => { applyLegacyTemplate(templateId); setShowHome(false); }} /> : <div className="g2-workspace">
      <aside className={`g2-rail ${railTab === "collapsed" ? "is-collapsed" : ""}`}>
        <div className="g2-rail-tabs"><button className={railTab === "components" ? "active" : ""} onClick={() => setRailTab("components")} title="Components"><Layers3 size={16} /></button><button className={railTab === "patterns" ? "active" : ""} onClick={() => setRailTab("patterns")} title="Patterns"><Workflow size={16} /></button><button className={railTab === "templates" ? "active" : ""} onClick={() => setRailTab("templates")} title="Existing templates"><LayoutTemplate size={16} /></button><button className={railTab === "brief" ? "active" : ""} onClick={() => setRailTab("brief")} title="Brief"><FileJson size={16} /></button></div>
        {railTab !== "collapsed" && <div className="g2-rail-body">
          {railTab === "components" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">BUILDING BLOCKS</span><h3>Components</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><div className="g2-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services" /></div><div className="g2-category-scroll">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="g2-service-list">{filteredServices.map((service) => <button key={service.id} className="g2-service-item" onClick={() => addService(service.id)}><span className="g2-service-img" style={{ "--service-color": service.color }}><ServiceIcon service={service} size={22} /></span><span><strong>{service.label}</strong><small>{service.provider} · {service.kind}</small></span><Plus size={13} /></button>)}</div></>}
          {railTab === "patterns" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">FLOW DESIGN PATTERNS</span><h3>Start with intent</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><p className="g2-muted">Patterns are editable starting points, not locked templates.</p><div className="g2-pattern-list">{PATTERNS.map((pattern) => <button key={pattern.id} className="g2-pattern-card" onClick={() => applyPattern(pattern.id)}><span className="g2-pattern-icon"><Workflow size={16} /></span><span><strong>{pattern.label}</strong><small>{pattern.description}</small></span><ChevronRight size={14} /></button>)}</div><div className="g2-rail-tip"><Lightbulb size={15} /><span>Good architecture answers are paths, controls, and trade-offs.</span></div></>}
          {railTab === "templates" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">ORIGINAL GENAI PLAYGROUND</span><h3>Templates</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><p className="g2-muted">All existing GenAI Playground templates are available here with their original nodes and connections.</p><div className="g2-pattern-list">{LEGACY_TEMPLATES.map((template) => <button key={template.id} className="g2-pattern-card" onClick={() => applyLegacyTemplate(template.id)}><span className="g2-pattern-icon"><LayoutTemplate size={16} /></span><span><strong>{template.label}</strong><small>{template.description || `${template.nodes.length} nodes · ${template.edges.length} connections`}</small></span><ChevronRight size={14} /></button>)}</div></>}
          {railTab === "brief" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">DESIGN BRIEF</span><h3>What are we solving?</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><textarea className="g2-brief-textarea" value={brief} onChange={(event) => setBrief(event.target.value)} /><div className="g2-section-label">GenAI lifecycle</div>{["Scope", "Select model", "Customize", "Integrate", "Deploy", "Improve"].map((item, index) => <div className={`g2-lifecycle ${index < 3 ? "done" : ""}`} key={item}><span>{index < 3 ? <Check size={12} /> : index + 1}</span>{item}<small>{index < 3 ? "covered" : "next"}</small></div>)}<div className="g2-rail-tip"><MessageSquare size={15} /><span>Keep the brief visible while you design so every component has a job.</span></div></>}
        </div>}
        {railTab === "collapsed" && <button className="g2-rail-expand" onClick={() => setRailTab("components")} title="Expand rail"><PanelLeftOpen size={16} /></button>}
      </aside>
      <main className="g2-canvas-wrap">
        <div className="g2-canvas-toolbar"><div><span className="g2-breadcrumb">PLAYGROUND / 2.0 /</span><strong>Support assistant architecture</strong></div><div className="g2-canvas-tools"><span className="g2-notice"><CircleDot size={11} /> {notice}</span><button type="button" className="g2-secondary-btn compact" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setMode("studio"); setDrawer("studio"); }}><Sparkles size={13} /> Ask Studio</button></div></div>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} connectionLineType={ConnectionLineType.Bezier} connectionLineStyle={{ stroke: "#64748b", strokeWidth: 1.5, strokeLinecap: "round" }} defaultEdgeOptions={{ type: "bezier", pathOptions: { curvature: 0.28 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" }, style: { stroke: "#64748b", strokeWidth: 1.5, strokeLinecap: "round" } }} onNodeClick={(_, node) => { setSelectedNodeId(node.id); setDrawer("inspect"); }} onPaneClick={() => { setSelectedNodeId(null); if (mode === "design") setDrawer(null); }} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.2 }} proOptions={{ hideAttribution: true }}>
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#334155" />
          <Controls showInteractive={false} />
          <MiniMap nodeColor={(node) => node.data?.service?.color || "#64748b"} maskColor="rgba(2, 6, 23, .75)" />
          <Panel position="bottom-left" className="g2-canvas-legend"><span><i className="dot source" />experience</span><span><i className="dot path" />data & flow</span><span><i className="dot safety" />safety boundary</span></Panel>
        </ReactFlow>
      </main>
      {drawer && <aside className="g2-drawer"><div className="g2-drawer-head"><span>{drawer === "inspect" ? "Inspector" : drawer[0].toUpperCase() + drawer.slice(1)}</span><button className="g2-icon-btn" onClick={() => setDrawer(null)} title="Close panel"><X size={16} /></button></div>{drawer === "studio" && <StudioDrawer prompt={prompt} setPrompt={setPrompt} onGenerate={generateFromPrompt} onApplyJson={applyJson} projectJson={projectJson || JSON.stringify({ brief, nodes, edges }, null, 2)} setProjectJson={setProjectJson} isGenerating={isGenerating} studioError={studioError} />}{drawer === "simulate" && <SimulationDrawer simQps={simQps} setSimQps={setSimQps} failureMode={failureMode} setFailureMode={setFailureMode} simResult={simResult} isRunning={isRunning} step={step} onRun={runSimulation} onReset={resetRuntime} />}{drawer === "review" && <ReviewDrawer reviewScore={reviewScore} reviewRows={reviewRows} onFocus={focusNode} />}{drawer === "challenge" && <ChallengeDrawer challenge={challenge} challengeScore={challengeScore} onSelectChallenge={setChallenge} onFocus={focusNode} />}{drawer === "inspect" && <InspectorDrawer selectedNode={selectedNode} onDelete={(nodeId) => setNodes((current) => current.filter((node) => node.id !== nodeId))} onClose={() => setDrawer(null)} />}</aside>}
    </div>}
  </div>;
}

export default function GenAIPlayground2(props) {
  return <ReactFlowProvider><GenAIPlayground2Canvas {...props} /></ReactFlowProvider>;
}
