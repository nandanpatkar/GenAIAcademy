import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Database,
  Download,
  FileUp,
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
  Maximize2,
  Minus,
  Network,
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
  Wand2,
  Zap,
} from "lucide-react";
import { ALL_COMPONENTS, CHALLENGES, LEGACY_TEMPLATES, PATTERNS, SERVICE_BY_ID } from "./data/serviceCatalog";
import { DIAGRAM_TEMPLATE_BY_ID, DIAGRAM_TEMPLATES, DIAGRAM_TYPES } from "./data/diagramCatalog";
import { SYSTEM_DESIGN_CHALLENGES } from "./data/systemDesignChallengeCatalog";
import { getComponentById as getSystemComponentById } from "../simulator/data/sdsComponents";
import { runMonteCarlo as runSystemDesignMonteCarlo, runSimulation as runSystemDesignSimulation, runTrace as runSystemDesignTrace } from "../simulator/engine/sdsSimulator";
import { generateFlowArchitecture, normalizeFlowArchitecture } from "../../services/aiService";
import "./genai-playground2.css";

const FALLBACK_ICONS = { Activity, AlertCircle, Archive, Binary, Bot, Brain, BrainCircuit, CheckCircle2, CircleDot, Cloud, Code2, Database, Gauge, GitBranch, Globe2, KeyRound, Layers3, ListTodo, MessageSquare, Network, Search, ShieldCheck, Sparkles, Table2, UserCheck, Users, Webhook, Workflow, Zap };
const uid = (prefix = "node") => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const PROJECT_STORAGE_KEY = "genai_playground2_project_v2";
const normalizeReactFlowEdges = (edges = []) => edges.map((edge) => edge?.type === "bezier" ? { ...edge, type: "default" } : edge);
const SYSTEM_COMPONENT_BY_KIND = {
  source: "dns", sink: "app-server", service: "app-server", llm: "app-server", embedder: "app-server",
  router: "api-gateway", guardrail: "circuit-breaker", datasource: "object-storage", database: "nosql-db",
  vector: "vector-db", cache: "cache", queue: "message-queue", event: "pub-sub", orchestrator: "task-scheduler",
  observability: "monitoring", tool: "app-server", human: "app-server", entity: "sql-db", infrastructure: "app-server",
  network: "reverse-proxy", cluster: "app-server", namespace: "service-discovery", ingress: "load-balancer", workload: "app-server",
};
const INSTANCE_TYPES = ["t3.small", "t3.medium", "m6i.large", "m6i.xlarge", "c7i.large", "r6i.large", "serverless"];
const SIMULATION_SCENARIOS = [
  { id: "baseline", label: "Baseline traffic", factor: 1, problem: "Normal request volume with the architecture in its steady state." },
  { id: "traffic-spike", label: "10× traffic spike", factor: 10, problem: "A launch, viral event, or retry storm suddenly multiplies incoming requests." },
  { id: "service-crash", label: "Dependency crash", factor: 1, problem: "One component stops responding; the design must contain the blast radius." },
];
const REQUEST_SCENARIOS = [
  { id: "default", label: "Primary request path", description: "Follow the first reachable request path from the selected entry node." },
  { id: "cache-hit", label: "Cache hit", description: "Force a cache HIT and show the fast response path." },
  { id: "cache-miss", label: "Cache miss → origin", description: "Force a cache MISS and route cache-aside reads to the origin." },
];
const getSystemComponentId = (service = {}, data = {}) => data.simulatorComponentId || SYSTEM_COMPONENT_BY_KIND[service.kind] || "custom";
const getDefaultFlowMode = (service = {}) => service.kind === "observability" ? "telemetry" : ["queue", "event", "orchestrator"].includes(service.kind) ? "async" : "primary";
function buildSimulationAdvice(systemNodes, nodeMetrics, bottleneckNodeIds, failureNode, scenario) {
  const byId = new Map(systemNodes.map((node) => [node.id, node]));
  const recommendations = [];
  if (failureNode) {
    if (failureNode.flowMode === "telemetry") {
      recommendations.push("Keep telemetry off the request critical path; buffer and retry metrics independently.");
      recommendations.push("Add an alert on telemetry freshness so observability loss is visible without taking traffic down.");
    } else if (failureNode.flowMode === "async") {
      recommendations.push("Keep accepting user requests while the background queue recovers; use a durable buffer and replay failed work.");
      recommendations.push("Alert on queue age and dead-letter volume so background failure is visible before it becomes user-facing.");
    } else {
      recommendations.push(`Fail over or remove ${failureNode.label || "the failed component"} from service; route traffic to healthy replicas.`);
      recommendations.push("Add a timeout, retry budget, and circuit breaker so this failure cannot cascade downstream.");
    }
  }
  bottleneckNodeIds.forEach((nodeId) => {
    const node = byId.get(nodeId);
    const metric = nodeMetrics[nodeId];
    if (!node || !metric) return;
    const safeReplicas = Math.max(node.replicas || 1, Math.ceil(metric.incomingQPS / Math.max(1, node.maxQPS * 0.7)));
    recommendations.push(node.autoscaling
      ? `Let ${node.label || "the bottleneck"} scale toward ${Math.min(node.maxReplicas || safeReplicas, safeReplicas)} replicas before utilization reaches 90%.`
      : `Increase ${node.label || "the bottleneck"} from ${node.replicas || 1} to about ${safeReplicas} replicas, or lower its per-request work.`);
  });
  if (scenario?.id === "traffic-spike" && bottleneckNodeIds.length === 0 && !failureNode) {
    recommendations.push("The 10× spike is currently absorbed. Keep a load test and autoscaling alarm around this headroom.");
  }
  if (!recommendations.length) recommendations.push("No critical request-path failure detected. Try the 10× spike or crash a primary dependency to test resilience.");
  const primaryFailure = failureNode && failureNode.flowMode === "primary";
  const firstBottleneck = byId.get(bottleneckNodeIds[0]);
  const incident = failureNode
    ? { title: primaryFailure ? "Incident: request-path dependency failed" : "Contained incident: telemetry failed", detail: primaryFailure ? `${failureNode.label || "A primary component"} stopped serving requests, so the downstream request path is blocked.` : `${failureNode.label || "The monitoring component"} stopped receiving events, but user requests do not depend on telemetry completing.` }
    : firstBottleneck
      ? { title: "Incident: capacity saturation", detail: `${firstBottleneck.label || "A request component"} is above 90% utilization. The request path will queue, shed load, or time out unless capacity is added.` }
      : { title: "No active incident", detail: "The request path is below the critical utilization threshold at this traffic level." };
  return { incident: failureNode?.flowMode === "async" ? { title: "Contained incident: background worker failed", detail: `${failureNode.label || "An async component"} stopped processing background work; the synchronous request path remains available while queued work waits or retries.` } : incident, recommendations, primaryFailure };
}
const getNodeConfig = (node) => {
  const data = node?.data || {};
  const service = data.service || SERVICE_BY_ID[data.serviceId] || SERVICE_BY_ID.lambda;
  const component = getSystemComponentById(getSystemComponentId(service, data)) || getSystemComponentById("custom");
  const config = data.config || {};
  return {
    replicas: Math.max(1, Number(data.replicas ?? config.replicas ?? 1)),
    maxQPS: Math.max(1, Number(data.maxQPS ?? config.maxQPS ?? component.maxQPS ?? 50000)),
    latencyMs: Math.max(0, Number(data.latencyMs ?? config.latencyMs ?? component.latencyMs ?? 10)),
    instanceType: data.instanceType || config.instanceType || "t3.medium",
    region: data.region || config.region || "us-east-1",
    autoscaling: Boolean(data.autoscaling ?? config.autoscaling),
    minReplicas: Math.max(1, Number(data.minReplicas ?? config.minReplicas ?? 1)),
    maxReplicas: Math.max(1, Number(data.maxReplicas ?? config.maxReplicas ?? 20)),
    flowMode: data.flowMode || config.flowMode || getDefaultFlowMode(service),
    sampleRate: Math.min(1, Math.max(0.001, Number(data.sampleRate ?? config.sampleRate ?? 0.02))),
    forceFailure: Boolean(data.forceFailure ?? config.forceFailure),
    failureRate: Math.min(1, Math.max(0, Number(data.failureRate ?? config.failureRate ?? 0.01))),
    latencyOverrideMs: Math.max(0, Number(data.latencyOverrideMs ?? config.latencyOverrideMs ?? 0)),
    latencyJitter: Math.min(1, Math.max(0, Number(data.latencyJitter ?? config.latencyJitter ?? 0.3))),
    maxRetries: Math.max(0, Number(data.maxRetries ?? config.maxRetries ?? 0)),
    deadLetterQueue: Boolean(data.deadLetterQueue ?? config.deadLetterQueue),
    overloadBehavior: Boolean(data.overloadBehavior ?? config.overloadBehavior),
    degradedMode: Boolean(data.degradedMode ?? config.degradedMode),
    cacheOutcome: data.cacheOutcome || config.cacheOutcome || "auto",
    cacheStrategy: data.cacheStrategy || config.cacheStrategy || "cache-aside",
    cacheHitRate: Math.min(1, Math.max(0, Number(data.cacheHitRate ?? config.cacheHitRate ?? 0.85))),
    designNote: data.designNote || "",
  };
};
const arrowEdge = (id, source, target, label = "", options = {}) => ({
  id,
  source,
  target,
  // React Flow v11 does not register a "bezier" edge type. Its built-in
  // "default" edge already renders a Bezier path, so use that type and keep
  // smoothstep for feedback loops.
  type: options.feedback ? "smoothstep" : "default",
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

function newNode(serviceId, position, index = 0, overrides = {}) {
  const service = SERVICE_BY_ID[serviceId] || SERVICE_BY_ID["lambda"];
  const component = getSystemComponentById(getSystemComponentId(service)) || getSystemComponentById("custom");
  const label = overrides.label || service.label;
  return {
    id: uid(serviceId),
    type: "genaiService",
    position: { x: position?.[0] ?? 160 + index * 230, y: position?.[1] ?? 220 },
    data: { serviceId: service.id, label, service, runtimeState: "idle", config: {}, replicas: 1, maxQPS: component.maxQPS, latencyMs: component.latencyMs, instanceType: "t3.medium", region: "us-east-1", autoscaling: false, minReplicas: 1, maxReplicas: 20, flowMode: getDefaultFlowMode(service), sampleRate: 0.02, forceFailure: false, failureRate: 0.01, latencyOverrideMs: 0, latencyJitter: 0.3, maxRetries: 0, deadLetterQueue: false, overloadBehavior: false, degradedMode: false, cacheOutcome: "auto", cacheStrategy: "cache-aside", cacheHitRate: 0.85, ...overrides },
  };
}

function makeDiagramTemplate(templateId) {
  const template = DIAGRAM_TEMPLATE_BY_ID[templateId] || DIAGRAM_TEMPLATES[0];
  const nodes = template.nodes.map((spec, index) => newNode(spec.serviceId, spec.position, index, {
    label: spec.label,
    diagramType: template.diagramType,
    fields: spec.fields,
    sentiment: spec.sentiment,
  }));
  const edges = template.edges.map((link, index) => arrowEdge(
    `diagram-edge-${template.id}-${index}`,
    nodes[link.from]?.id,
    nodes[link.to]?.id,
    link.label,
    { role: link.role, feedback: link.role === "feedback" },
  )).filter((link) => link.source && link.target);
  return { nodes, edges, diagramType: template.diagramType, name: template.label, description: template.description };
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
  const diagramType = data.diagramType || "architecture";
  const fields = Array.isArray(data.fields) ? data.fields : [];
  const load = data.loadMetrics;
  return (
    <div className={`g2-node g2-node-${diagramType} ${selected ? "is-selected" : ""} runtime-${runtime}`} style={{ "--node-color": service.color }}>
      <Handle type="target" position={Position.Left} id="in" />
      <div className="g2-node-accent" />
      <div className="g2-node-head">
        <span className="g2-node-icon"><ServiceIcon service={service} size={25} /></span>
        <span className="g2-node-title"><strong>{data.label || service.label}</strong><small>{service.provider} · {service.category}</small></span>
        {runtime !== "idle" && <span className={`g2-runtime-dot ${runtime}`} />}
      </div>
      {fields.length > 0 && <div className="g2-node-fields">{fields.map((field) => <span key={field}>{field}</span>)}</div>}
      {data.sentiment && <div className="g2-node-sentiment">{data.sentiment}</div>}
      {load && <div className="g2-node-load"><span>{Math.round(load.incomingQPS).toLocaleString()} QPS</span><span>{Math.round(load.utilization * 100)}%</span></div>}
      <div className="g2-node-foot"><span>{service.kind}</span><span>{runtime === "active" ? "processing" : runtime === "complete" ? "complete" : runtime === "failed" ? "failed" : runtime === "blocked" ? "blocked" : "ready"}</span></div>
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

function SimulationDrawer({ simQps, setSimQps, simulationScenario, setSimulationScenario, effectiveSimQps, simulationMode, setSimulationMode, requestScenario, setRequestScenario, traceEntryNodeId, setTraceEntryNodeId, monteCarloSettings, setMonteCarloSettings, failureMode, setFailureMode, failureNodeId, setFailureNodeId, nodes, capacitySettings, setCapacitySettings, capacityEstimate, simResult, monteCarloResult, isRunning, step, onRun, onReset }) {
  const scenario = SIMULATION_SCENARIOS.find((item) => item.id === simulationScenario) || SIMULATION_SCENARIOS[0];
  const request = REQUEST_SCENARIOS.find((item) => item.id === requestScenario) || REQUEST_SCENARIOS[0];
  return <div className="g2-drawer-content">
    <div className="g2-drawer-kicker">SIMULATION / RUNTIME WALKTHROUGH</div>
    <h2>{simulationMode === "trace" ? "Trace one request" : "Run Monte Carlo"}</h2>
    <p className="g2-muted">{simulationMode === "trace" ? "Step through one deterministic request, including cache hits, misses, retries, and failures." : "Fire seeded trials through the same graph to estimate success rate, tail latency, and error hotspots."}</p>
    <div className="g2-sim-mode-tabs"><button className={simulationMode === "trace" ? "active" : ""} onClick={() => setSimulationMode("trace")}><Activity size={13} /> Trace</button><button className={simulationMode === "monte-carlo" ? "active" : ""} onClick={() => setSimulationMode("monte-carlo")}><BarChart3 size={13} /> Monte Carlo</button></div>
    <label className="g2-control-select"><span>Scenario</span><select className="g2-select" value={simulationScenario} onChange={(event) => { const value = event.target.value; setSimulationScenario(value); if (value === "service-crash") setFailureMode(true); }}>{SIMULATION_SCENARIOS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    <div className="g2-scenario-callout"><strong>What can go wrong?</strong><span>{scenario.problem}</span></div>
    <label className="g2-control-select"><span>Request flow</span><select className="g2-select" value={requestScenario} onChange={(event) => setRequestScenario(event.target.value)}>{REQUEST_SCENARIOS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    {simulationMode === "trace" ? <label className="g2-control-select"><span>Entry node</span><select className="g2-select" value={traceEntryNodeId} onChange={(event) => setTraceEntryNodeId(event.target.value)}><option value="">Auto-select first entry</option>{nodes.map((node) => <option key={node.id} value={node.id}>{node.data.label || node.data.service?.label}</option>)}</select></label> : <div className="g2-monte-controls"><label><span>Trials</span><select className="g2-select" value={monteCarloSettings.trials} onChange={(event) => setMonteCarloSettings((current) => ({ ...current, trials: Number(event.target.value) }))}>{[100, 500, 1000, 5000, 10000].map((value) => <option key={value} value={value}>{value.toLocaleString()}</option>)}</select></label><label><span>Load / RPS</span><input type="number" min="1" value={simQps} onChange={(event) => setSimQps(Math.max(1, Number(event.target.value)))} /></label><label><span>Seed</span><input type="number" min="1" value={monteCarloSettings.seed} onChange={(event) => setMonteCarloSettings((current) => ({ ...current, seed: Math.max(1, Number(event.target.value)) }))} /></label></div>}
    {simulationMode === "trace" && <div className="g2-control-row"><label>Traffic <b>{simQps} QPS{scenario.factor > 1 ? ` → ${effectiveSimQps.toLocaleString()} QPS` : ""}</b></label><input type="range" min="1" max="2000" value={simQps} onChange={(event) => setSimQps(Number(event.target.value))} /></div>}
    {simulationMode === "monte-carlo" && <label className="g2-checkbox-row g2-cascade-row"><span><strong>Cascade failures</strong><small>Let dependency failures stop downstream work.</small></span><input type="checkbox" checked={monteCarloSettings.cascade} onChange={(event) => setMonteCarloSettings((current) => ({ ...current, cascade: event.target.checked }))} /></label>}
    <label className="g2-switch-row"><span><span className="g2-switch-title">Inject node crash</span><small>Highlight the failed node with a red heartbeat.</small></span><input type="checkbox" checked={failureMode} onChange={(event) => setFailureMode(event.target.checked)} /></label>
    <label className="g2-control-select"><span>Failure target</span><select className="g2-select" value={failureNodeId} onChange={(event) => setFailureNodeId(event.target.value)} disabled={!failureMode}><option value="">Auto-select a primary path node</option>{nodes.map((node) => <option key={node.id} value={node.id}>{node.data.label || node.data.service?.label}</option>)}</select></label>
    <div className="g2-run-row"><button className="g2-primary-btn" onClick={onRun}><Play size={15} /> {simulationMode === "trace" ? (isRunning ? `Step ${step}` : "Start trace") : "Run Monte Carlo"}</button><button className="g2-icon-btn" onClick={onReset} title="Reset runtime"><RefreshCw size={15} /></button></div>
    {simResult?.failureNodeId && <div className={`g2-failure-callout ${simResult.failureAffectsRequest ? "" : "is-contained"}`}><AlertCircle size={13} /><span><strong>{simResult.failureNodeLabel}</strong> {simResult.failureAffectsRequest ? `crashed at step ${simResult.failureIndex + 1}; downstream request nodes are blocked.` : simResult.failureImpact === "async" ? "background work failed, but the primary request path stays available while queued work retries." : "lost telemetry, but the primary request path stays available."}</span></div>}
    {simResult && <div className="g2-metric-grid"><div><small>p95 latency</small><strong>{simResult.latency} ms</strong></div><div><small>throughput</small><strong>{simResult.throughput} req/s</strong></div><div><small>monthly cost</small><strong>${simResult.cost}</strong></div><div><small>request path</small><strong className={simResult.degraded ? "is-warn" : "is-good"}>{simResult.degraded ? "degraded" : "healthy"}</strong></div></div>}
    {simResult?.system && <div className="g2-system-metrics"><div><small>capacity throughput</small><strong>{Math.round(simResult.system.throughput).toLocaleString()} QPS</strong></div><div><small>critical request nodes</small><strong className={simResult.system.bottleneckNodeIds.length ? "is-warn" : "is-good"}>{simResult.system.bottleneckNodeIds.length}</strong></div><div><small>request path</small><strong>{simResult.system.totalLatencyMs} ms</strong></div></div>}
    {simResult?.system?.incident && <div className="g2-sim-incident"><strong>{simResult.system.incident.title}</strong><span>{simResult.system.incident.detail}</span></div>}
    {simResult?.system?.recommendations?.length > 0 && <div className="g2-sim-recommendations"><strong>How to solve it</strong>{simResult.system.recommendations.map((item) => <div key={item}><CheckCircle2 size={12} />{item}</div>)}</div>}
    {simResult?.system?.warnings?.map((warning) => <div className="g2-sim-warning" key={warning}><AlertCircle size={12} />{warning}</div>)}
    {monteCarloResult && <div className="g2-monte-result"><div className="g2-monte-result-head"><strong>{monteCarloResult.trials.toLocaleString()} trials</strong><span>seed {monteCarloResult.seed}</span></div><div className="g2-monte-metrics"><div><small>success</small><strong className="is-good">{(monteCarloResult.successRate * 100).toFixed(1)}%</strong></div><div><small>p50</small><strong>{monteCarloResult.p50} ms</strong></div><div><small>p95</small><strong>{monteCarloResult.p95} ms</strong></div><div><small>p99</small><strong>{monteCarloResult.p99} ms</strong></div></div><div className="g2-monte-outcomes"><span>errors {monteCarloResult.failures}</span><span>DLQ {monteCarloResult.deadLetters}</span><span>mean {monteCarloResult.mean} ms</span></div><div className="g2-section-label">Node visits / failures</div>{Object.values(monteCarloResult.nodeStats).filter((item) => item.visits > 0).map((item) => <div className="g2-node-stat" key={item.nodeId}><span>{nodes.find((node) => node.id === item.nodeId)?.data.label || item.nodeId}</span><span>{item.visits.toLocaleString()} / {item.failures}</span></div>)}</div>}
    <div className="g2-capacity-panel"><div className="g2-capacity-panel-head"><strong>Capacity planning</strong><span>Estimate AWS-style traffic needs</span></div><div className="g2-capacity-inputs">{[["dau", "DAU"], ["readsPerUser", "Reads / user"], ["writesPerUser", "Writes / user"], ["readSizeKb", "Read KB"], ["writeSizeKb", "Write KB"], ["storageMonths", "Months"], ["peakFactor", "Peak / avg ×"], ["replicationFactor", "Replication ×"]].map(([key, label]) => <label key={key}><span>{label}</span><input type="number" min="0" value={capacitySettings[key]} onChange={(event) => setCapacitySettings((current) => ({ ...current, [key]: Number(event.target.value) }))} /></label>)}</div><div className="g2-capacity-estimates">{[["Avg QPS", capacityEstimate.avgQps.toLocaleString()], ["Read QPS", capacityEstimate.readQps.toLocaleString()], ["Write QPS", capacityEstimate.writeQps.toLocaleString()], ["Peak QPS", capacityEstimate.peakQps.toLocaleString()], ["Storage", capacityEstimate.storage], ["Inbound", `${capacityEstimate.inbound} MB/s`], ["Outbound", `${capacityEstimate.outbound} MB/s`]].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div></div>
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

function ChallengeDrawer({ challenge, challenges, challengeScore, onSelectChallenge, onLoadReference, onFocus }) {
  const [query, setQuery] = useState("");
  const filteredChallenges = challenges.filter((item) => `${item.label} ${item.difficulty} ${item.learningTier || ""}`.toLowerCase().includes(query.toLowerCase()));
  const problem = challenge.problem;
  return <div className="g2-drawer-content">
    <div className="g2-drawer-kicker">CHALLENGE / SYSTEM DESIGN SIMULATOR</div>
    <h2>Practice the design</h2>
    <p className="g2-muted">The complete simulator library is available here: problem statements, scale requirements, constraints, hints, reference graphs, and canvas checks.</p>
    <div className="g2-challenge-library"><Search size={13} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${challenges.length} problems`} /></div>
    <div className="g2-challenge-tabs">{filteredChallenges.map((item) => <button key={item.id} className={challenge.id === item.id ? "active" : ""} onClick={() => onSelectChallenge(item)}>{item.label}<small>{item.difficulty}</small></button>)}</div>
    <div className="g2-challenge-brief"><span>{challenge.difficulty}{challenge.learningTier ? ` · ${challenge.learningTier}` : ""}</span><p>{challenge.brief}</p></div>
    {problem?.requirements && <div className="g2-challenge-requirements">{[["Reads/s", problem.requirements.readsPerSec], ["Writes/s", problem.requirements.writesPerSec], ["Storage", problem.requirements.storageGB ? `${problem.requirements.storageGB} GB` : "—"], ["Latency", problem.requirements.latencyMs ? `${problem.requirements.latencyMs} ms` : "—"]].map(([label, value]) => <div key={label}><small>{label}</small><strong>{typeof value === "number" ? value.toLocaleString() : value}</strong></div>)}</div>}
    {problem?.tags?.length > 0 && <div className="g2-challenge-tags">{problem.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
    {problem?.constraints?.length > 0 && <div className="g2-challenge-section"><strong>Constraints</strong>{problem.constraints.slice(0, 4).map((constraint) => <p key={constraint}>• {constraint}</p>)}</div>}
    {problem?.hints?.length > 0 && <div className="g2-challenge-section"><strong>Hints</strong>{problem.hints.slice(0, 3).map((hint) => <p key={hint.title}>💡 {hint.title}: {hint.content}</p>)}</div>}
    {challenge.reference?.nodes?.length > 0 && <button className="g2-secondary-btn g2-reference-btn" onClick={() => onLoadReference(challenge)}><Target size={13} /> Load reference architecture ({challenge.reference.nodes.length} components)</button>}
    <div className="g2-challenge-score"><strong>{challengeScore.score}%</strong><span>{challengeScore.passed} of {challengeScore.total} checks passed</span></div>
    <div className="g2-check-list">{challengeScore.checks.map((check) => <button key={check.id} onClick={() => check.nodeId && onFocus(check.nodeId)}><span className={check.pass ? "pass" : "fail"}>{check.pass ? <Check size={13} /> : <AlertCircle size={13} />}</span><span>{check.label}</span>{check.nodeId && <ChevronRight size={13} />}</button>)}</div>
  </div>;
}

function InspectorDrawer({ selectedNode, onUpdate, onDelete, onClose }) {
  if (!selectedNode) return <div className="g2-drawer-content"><div className="g2-empty-drawer"><CircleDot size={24} /><h2>Select a component</h2><p>Choose a node on the canvas to inspect its role, provider, and design notes.</p></div></div>;
  const service = selectedNode.data.service || SERVICE_BY_ID[selectedNode.data.serviceId];
  const config = getNodeConfig(selectedNode);
  const update = (patch) => onUpdate(selectedNode.id, patch);
  return <div className="g2-drawer-content"><div className="g2-drawer-kicker">COMPONENT / CONFIGURATION</div><div className="g2-inspector-title"><ServiceIcon service={service} size={36} /><div><h2>{selectedNode.data.label || service.label}</h2><p>{service.provider} · {service.category}</p></div></div><p className="g2-muted">{service.description}</p><div className="g2-inspector-fields"><label>Role<input value={service.kind} readOnly /></label><label>Provider<input value={service.provider} readOnly /></label><label>Traffic behavior<select value={config.flowMode} onChange={(event) => update({ flowMode: event.target.value })}><option value="primary">Primary request path</option><option value="async">Async/background work</option><option value="telemetry">Telemetry side channel</option></select></label>{config.flowMode === "telemetry" && <label>Telemetry sample rate<input type="number" min="0.1" max="100" step="0.1" value={Number((config.sampleRate * 100).toFixed(2))} onChange={(event) => update({ sampleRate: Math.min(1, Math.max(0.001, Number(event.target.value) / 100)) })} /><small>Only this percentage of request events enters the monitoring path.</small></label>}<label>Instance type<select value={config.instanceType} onChange={(event) => update({ instanceType: event.target.value })}>{INSTANCE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label>Region<select value={config.region} onChange={(event) => update({ region: event.target.value })}>{["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1", "ap-south-1"].map((region) => <option key={region} value={region}>{region}</option>)}</select></label><label>Max QPS per instance<input type="number" min="1" value={config.maxQPS} onChange={(event) => update({ maxQPS: Math.max(1, Number(event.target.value)) })} /></label><label>Base latency (ms)<input type="number" min="0" value={config.latencyMs} onChange={(event) => update({ latencyMs: Math.max(0, Number(event.target.value)) })} /></label></div><div className="g2-inspector-section"><div className="g2-inspector-section-title"><strong>Capacity & scaling</strong><span>{(config.maxQPS * config.replicas).toLocaleString()} effective QPS</span></div><div className="g2-replica-row"><button type="button" onClick={() => update({ replicas: Math.max(1, config.replicas - 1) })}><Minus size={12} /></button><input type="range" min="1" max="20" value={config.replicas} onChange={(event) => update({ replicas: Number(event.target.value) })} /><button type="button" onClick={() => update({ replicas: Math.min(20, config.replicas + 1) })}><Plus size={12} /></button></div><div className="g2-replica-value">{config.replicas}× instances / replicas</div><label className="g2-checkbox-row"><span><strong>Autoscaling</strong><small>Allow replica count to respond to load.</small></span><input type="checkbox" checked={config.autoscaling} onChange={(event) => update({ autoscaling: event.target.checked })} /></label>{config.autoscaling && <div className="g2-scaling-range"><label>Min replicas<input type="number" min="1" max={config.maxReplicas} value={config.minReplicas} onChange={(event) => update({ minReplicas: Math.max(1, Math.min(config.maxReplicas, Number(event.target.value))) })} /></label><label>Max replicas<input type="number" min={config.minReplicas} max="50" value={config.maxReplicas} onChange={(event) => update({ maxReplicas: Math.max(config.minReplicas, Number(event.target.value)) })} /></label></div>}</div><div className="g2-inspector-section"><div className="g2-inspector-section-title"><strong>Trace & Monte Carlo</strong><span>failure + tail latency</span></div><label className="g2-checkbox-row"><span><strong>Force failure</strong><small>Fail this node on the next trace.</small></span><input type="checkbox" checked={config.forceFailure} onChange={(event) => update({ forceFailure: event.target.checked })} /></label><div className="g2-inspector-fields"><label>Failure rate (%)<input type="number" min="0" max="100" step="0.1" value={Number((config.failureRate * 100).toFixed(2))} onChange={(event) => update({ failureRate: Math.min(1, Math.max(0, Number(event.target.value) / 100)) })} /></label><label>Latency override (ms)<input type="number" min="0" value={config.latencyOverrideMs} onChange={(event) => update({ latencyOverrideMs: Math.max(0, Number(event.target.value)) })} /></label><label>Latency jitter (%)<input type="number" min="0" max="100" step="1" value={Math.round(config.latencyJitter * 100)} onChange={(event) => update({ latencyJitter: Math.min(1, Math.max(0, Number(event.target.value) / 100)) })} /></label><label>Max retries<input type="number" min="0" max="10" value={config.maxRetries} onChange={(event) => update({ maxRetries: Math.max(0, Math.min(10, Number(event.target.value))) })} /></label></div><label className="g2-checkbox-row"><span><strong>Dead-letter queue</strong><small>Route exhausted async work to a DLQ.</small></span><input type="checkbox" checked={config.deadLetterQueue} onChange={(event) => update({ deadLetterQueue: event.target.checked })} /></label><label className="g2-checkbox-row"><span><strong>Overload behavior</strong><small>Fail when simulated utilization exceeds capacity.</small></span><input type="checkbox" checked={config.overloadBehavior} onChange={(event) => update({ overloadBehavior: event.target.checked })} /></label></div>{service.kind === "cache" && <div className="g2-inspector-section"><div className="g2-inspector-section-title"><strong>Cache behavior</strong><span>read path</span></div><label className="g2-control-select"><span>Trace outcome</span><select className="g2-select" value={config.cacheOutcome} onChange={(event) => update({ cacheOutcome: event.target.value })}><option value="auto">Auto / probability</option><option value="hit">Force HIT</option><option value="miss">Force MISS</option></select></label><label className="g2-control-select"><span>Miss strategy</span><select className="g2-select" value={config.cacheStrategy} onChange={(event) => update({ cacheStrategy: event.target.value })}><option value="cache-aside">Cache-aside</option><option value="read-through">Read-through</option></select></label><label>Monte Carlo hit rate (%)<input type="number" min="0" max="100" value={Math.round(config.cacheHitRate * 100)} onChange={(event) => update({ cacheHitRate: Math.min(1, Math.max(0, Number(event.target.value) / 100)) })} /></label></div>}<div className="g2-inspector-fields"><label>Design note<textarea value={config.designNote} onChange={(event) => update({ designNote: event.target.value })} placeholder="What decision does this component represent?" /></label></div><button className="g2-danger-btn" onClick={() => { onDelete(selectedNode.id); onClose(); }}><Trash2 size={14} /> Remove component</button></div>;
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
  const [diagramType, setDiagramType] = useState("architecture");
  const [drawer, setDrawer] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brief, setBrief] = useState("Build a production-ready RAG assistant with citations, private documents, and a safe escalation path.");
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState("Start from a pattern or assemble the architecture from the rail.");
  const [simQps, setSimQps] = useState(120);
  const [simulationScenario, setSimulationScenario] = useState("baseline");
  const [simulationMode, setSimulationMode] = useState("trace");
  const [requestScenario, setRequestScenario] = useState("default");
  const [traceEntryNodeId, setTraceEntryNodeId] = useState("");
  const [monteCarloSettings, setMonteCarloSettings] = useState({ trials: 1000, seed: 1, cascade: false });
  const [failureMode, setFailureMode] = useState(false);
  const [failureNodeId, setFailureNodeId] = useState("");
  const [simResult, setSimResult] = useState(null);
  const [monteCarloResult, setMonteCarloResult] = useState(null);
  const [capacitySettings, setCapacitySettings] = useState({ dau: 1000000, readsPerUser: 10, writesPerUser: 2, readSizeKb: 10, writeSizeKb: 2, storageMonths: 12, peakFactor: 3, replicationFactor: 3 });
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [challenge, setChallenge] = useState(CHALLENGES[0]);
  const [projectJson, setProjectJson] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [studioError, setStudioError] = useState("");
  const [didRestore, setDidRestore] = useState(false);
  const importInputRef = useRef(null);
  const [visualTheme, setVisualTheme] = useState(() => {
    try { return localStorage.getItem("genai_playground2_theme") || "light"; } catch { return "light"; }
  });
  const reactFlow = useReactFlow();
  const challengeCatalog = useMemo(() => [...CHALLENGES, ...SYSTEM_DESIGN_CHALLENGES], []);
  const fitCanvas = useCallback(() => window.setTimeout(() => reactFlow.fitView({ padding: 0.22, duration: 320 }), 60), [reactFlow]);

  useEffect(() => {
    const initial = makePattern("rag");
    let restored = null;
    try {
      const saved = localStorage.getItem(PROJECT_STORAGE_KEY);
      if (saved) restored = JSON.parse(saved);
    } catch { /* best effort restore */ }
    const nextNodes = Array.isArray(restored?.nodes) ? restored.nodes.map((node) => ({ ...node, data: { ...node.data, runtimeState: "idle", loadMetrics: null } })) : initial.nodes;
    const nextEdges = normalizeReactFlowEdges(Array.isArray(restored?.edges) ? restored.edges : initial.edges);
    setNodes(nextNodes);
    setEdges(nextEdges);
    if (restored?.brief) setBrief(restored.brief);
    if (restored?.diagramType) setDiagramType(restored.diagramType);
    setProjectJson(JSON.stringify({ brief: restored?.brief || brief, nodes: nextNodes, edges: nextEdges }, null, 2));
    setNotice(restored?.nodes?.length ? "Restored your last architecture from this device." : "Start from a pattern or assemble the architecture from the rail.");
    setDidRestore(true);
    fitCanvas();
    // The host App owns global sidebar state. The v2 surface only owns its contextual rail.
  }, [fitCanvas]);

  useEffect(() => {
    if (!didRestore) return;
    try {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
        version: "genai-playground-2.0",
        brief,
        diagramType,
        nodes,
        edges,
        savedAt: new Date().toISOString(),
      }));
    } catch { /* best effort autosave */ }
  }, [brief, diagramType, didRestore, edges, nodes]);

  useEffect(() => {
    try { localStorage.setItem("genai_playground2_theme", visualTheme); } catch { /* best effort */ }
  }, [visualTheme]);

  const categories = useMemo(() => ["All", ...new Set(ALL_COMPONENTS.map((service) => service.category))], []);
  const filteredServices = useMemo(() => ALL_COMPONENTS.filter((service) => (category === "All" || service.category === category) && `${service.label} ${service.provider} ${service.category}`.toLowerCase().includes(search.toLowerCase())), [category, search]);
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || null;
  const nodeKinds = useMemo(() => new Set(nodes.map((node) => node.data.service?.kind || SERVICE_BY_ID[node.data.serviceId]?.kind)), [nodes]);
  const capacityEstimate = useMemo(() => {
    const reads = Math.max(0, Number(capacitySettings.dau) * Number(capacitySettings.readsPerUser));
    const writes = Math.max(0, Number(capacitySettings.dau) * Number(capacitySettings.writesPerUser));
    const readQps = Math.round(reads / 86400);
    const writeQps = Math.round(writes / 86400);
    const storageGb = (writes * Number(capacitySettings.writeSizeKb) * 30 * Number(capacitySettings.storageMonths)) / (1024 * 1024);
    const avgQps = readQps + writeQps;
    const replicatedStorageGb = storageGb * Math.max(1, Number(capacitySettings.replicationFactor));
    return { avgQps, readQps, writeQps, peakQps: Math.round(avgQps * Math.max(1, Number(capacitySettings.peakFactor))), storage: replicatedStorageGb > 1024 ? `${(replicatedStorageGb / 1024).toFixed(2)} TB` : `${replicatedStorageGb.toFixed(1)} GB`, inbound: (writeQps * Number(capacitySettings.writeSizeKb) / 1024).toFixed(2), outbound: (readQps * Number(capacitySettings.readSizeKb) / 1024).toFixed(2) };
  }, [capacitySettings]);
  const selectedSimulationScenario = SIMULATION_SCENARIOS.find((item) => item.id === simulationScenario) || SIMULATION_SCENARIOS[0];
  const effectiveSimQps = Math.max(1, Math.round(simQps * selectedSimulationScenario.factor));

  const updateNodeConfig = useCallback((nodeId, patch) => {
    setNodes((current) => current.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, ...patch } } : node));
    setSimResult(null);
    setMonteCarloResult(null);
  }, [setNodes]);

  const selectChallenge = useCallback((nextChallenge) => {
    setChallenge(nextChallenge);
    if (nextChallenge?.brief) setBrief(nextChallenge.brief);
    setNotice(`${nextChallenge.label} loaded. Build the design, then run the canvas checks.`);
  }, []);

  const loadChallengeReference = useCallback((nextChallenge) => {
    const reference = nextChallenge?.reference;
    if (!reference?.nodes?.length) return;
    const nextNodes = reference.nodes.map((spec, index) => newNode(spec.serviceId, [spec.position.x, spec.position.y], index, {
      label: spec.label,
      diagramType: "architecture",
      simulatorComponentId: spec.originalComponentId,
    }));
    const idMap = Object.fromEntries(reference.nodes.map((spec, index) => [spec.id, nextNodes[index].id]));
    const nextEdges = reference.edges.map((edge, index) => arrowEdge(
      `sds-edge-${nextChallenge.id}-${index}`,
      idMap[edge.source],
      idMap[edge.target],
      edge.label,
      { role: edge.role, feedback: edge.role === "feedback" },
    )).filter((edge) => edge.source && edge.target);
    setNodes(nextNodes);
    setEdges(nextEdges);
    setBrief(nextChallenge.brief);
    setDiagramType("architecture");
    setSelectedNodeId(null);
    setNotice(`Reference architecture loaded for ${nextChallenge.label}. Adjust it and run Animate.`);
    setMode("design");
    setDrawer("challenge");
    fitCanvas();
  }, [fitCanvas, setEdges, setNodes]);

  const applyPattern = useCallback((patternId) => {
    const next = makePattern(patternId);
    setNodes(next.nodes);
    setEdges(next.edges);
    setDiagramType("architecture");
    setSelectedNodeId(null);
    setNotice(`${PATTERNS.find((pattern) => pattern.id === patternId)?.label || "Pattern"} loaded. Make the trade-offs explicit.`);
    setMode("design");
    setDrawer(null);
    fitCanvas();
  }, [fitCanvas, setEdges, setNodes]);

  const applyLegacyTemplate = useCallback((templateId) => {
    const template = LEGACY_TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;
    setNodes(template.nodes);
    setEdges(template.edges);
    setDiagramType("architecture");
    setSelectedNodeId(null);
    setMode("design");
    setDrawer(null);
    fitCanvas();
    setNotice(`${template.label} loaded from the original GenAI Playground template library.`);
  }, [fitCanvas, setEdges, setNodes]);

  const applyDiagramTemplate = useCallback((templateId) => {
    const next = makeDiagramTemplate(templateId);
    setNodes(next.nodes);
    setEdges(next.edges);
    setDiagramType(next.diagramType);
    setSelectedNodeId(null);
    setMode("design");
    setDrawer(null);
    setProjectJson(JSON.stringify({ name: next.name, description: next.description, brief, diagramType: next.diagramType, nodes: next.nodes, edges: next.edges }, null, 2));
    setNotice(`${next.name} loaded. Use Animate to walk through the behavior.`);
    fitCanvas();
  }, [brief, fitCanvas, setEdges, setNodes]);

  const applyDiagramType = useCallback((typeId) => {
    if (typeId === "architecture") {
      applyPattern("rag");
      return;
    }
    const template = DIAGRAM_TEMPLATES.find((item) => item.diagramType === typeId);
    if (template) applyDiagramTemplate(template.id);
  }, [applyDiagramTemplate, applyPattern]);

  const addService = useCallback((serviceId) => {
    const service = SERVICE_BY_ID[serviceId];
    if (!service) return;
    const position = { x: 170 + (nodes.length % 4) * 250, y: 120 + Math.floor(nodes.length / 4) * 170 };
    const node = newNode(serviceId, [position.x, position.y], nodes.length, { diagramType });
    setNodes((current) => [...current, node]);
    setSelectedNodeId(node.id);
    setDrawer("inspect");
    setNotice(`${service.label} added to the canvas.`);
  }, [diagramType, nodes.length, setNodes]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const serviceId = event.dataTransfer.getData("application/genai-service");
    const service = SERVICE_BY_ID[serviceId];
    if (!service) return;
    const position = reactFlow.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const node = newNode(serviceId, [position.x - 96, position.y - 35], nodes.length, { diagramType });
    setNodes((current) => [...current, node]);
    setSelectedNodeId(node.id);
    setDrawer("inspect");
    setNotice(`${service.label} added to the canvas.`);
  }, [diagramType, nodes.length, reactFlow, setNodes]);

  const autoArrange = useCallback(() => {
    if (!nodes.length) return;
    const next = layoutGeneratedGraph(nodes, edges);
    setNodes(next.nodes);
    setEdges(next.edges);
    setNotice("Canvas arranged into a readable left-to-right flow.");
    fitCanvas();
  }, [edges, fitCanvas, nodes, setEdges, setNodes]);

  const clearCanvas = useCallback(() => {
    if (!nodes.length || !window.confirm("Clear the current architecture?")) return;
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setDrawer(null);
    setProjectJson(JSON.stringify({ brief, nodes: [], edges: [] }, null, 2));
    setNotice("Canvas cleared. Add components or load a pattern to continue.");
  }, [brief, nodes.length, setEdges, setNodes]);

  const importProject = useCallback(async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      const isNativeProject = payload?.version === "genai-playground-2.0" && Array.isArray(payload.nodes) && payload.nodes.every((node) => node?.data?.service);
      const normalized = isNativeProject ? payload : normalizeFlowArchitecture(payload, payload.brief || brief);
      if (!Array.isArray(normalized.nodes) || !Array.isArray(normalized.edges)) throw new Error("Expected nodes and edges arrays.");
      setNodes(normalized.nodes);
      setEdges(normalizeReactFlowEdges(normalized.edges));
      if (normalized.brief) setBrief(normalized.brief);
      setProjectJson(JSON.stringify(normalized, null, 2));
      setSelectedNodeId(null);
      setDrawer(null);
      setNotice(`Imported ${normalized.nodes.length} components and ${normalized.edges.length} connections.`);
      fitCanvas();
    } catch (error) {
      setNotice(`Could not import architecture: ${error.message}`);
    }
  }, [brief, fitCanvas, setEdges, setNodes]);

  const onConnect = useCallback((connection) => setEdges((current) => addEdge({ ...connection, ...arrowEdge(uid("edge"), connection.source, connection.target) }, current)), [setEdges]);
  const focusNode = useCallback((nodeId) => { setSelectedNodeId(nodeId); setDrawer("inspect"); const node = nodes.find((item) => item.id === nodeId); if (node) reactFlow.setCenter(node.position.x + 100, node.position.y + 50, { zoom: 1.15, duration: 450 }); }, [nodes, reactFlow]);

  const metrics = useMemo(() => {
    const modelCount = nodes.filter((node) => ["llm", "embedder"].includes(node.data.service?.kind)).length;
    const vectorCount = nodes.filter((node) => node.data.service?.kind === "vector").length;
    const cacheCount = nodes.filter((node) => node.data.service?.kind === "cache").length;
    const baseLatency = 110 + nodes.length * 13 - cacheCount * 26 - vectorCount * 8;
    const throughput = Math.max(1, Math.round((effectiveSimQps * (failureMode ? 0.58 : 0.92)) / Math.max(1, modelCount)));
    const monthlyRequests = effectiveSimQps * 2592000;
    const cost = (monthlyRequests / 1000000) * (0.24 + modelCount * 0.82) + vectorCount * 38 + nodes.filter((node) => node.data.service?.provider === "AWS").length * 7;
    return { latency: Math.max(70, Math.round(baseLatency + effectiveSimQps / 20 + (failureMode ? 180 : 0))), throughput, cost: cost.toFixed(2), monthlyRequests, modelCount };
  }, [effectiveSimQps, failureMode, nodes]);

  const runSimulation = useCallback(() => {
    if (!nodes.length) {
      setNotice("Add at least one component before running the simulation.");
      setMode("simulate");
      setDrawer("simulate");
      return;
    }
    const autoFailureTargetId = nodes.find((node) => node.id === failureNodeId)?.id || nodes.find((node) => node.data.service?.kind === "llm")?.id || nodes[0]?.id;
    const systemNodes = nodes.map((node) => {
      const service = node.data.service || SERVICE_BY_ID[node.data.serviceId] || SERVICE_BY_ID.lambda;
      const config = getNodeConfig(node);
      const autoscaledReplicas = config.autoscaling
        ? Math.min(config.maxReplicas, Math.max(config.minReplicas, Math.ceil(effectiveSimQps / Math.max(1, config.maxQPS * 0.7))))
        : config.replicas;
      return { id: node.id, label: node.data.label || service.label, componentId: getSystemComponentId(service, node.data), flowMode: config.flowMode, sampleRate: config.sampleRate, replicas: autoscaledReplicas, requestedReplicas: config.replicas, autoscaling: config.autoscaling, minReplicas: config.minReplicas, maxReplicas: config.maxReplicas, maxQPS: config.maxQPS, latencyMs: config.latencyMs, forceFailure: config.forceFailure || (failureMode && node.id === autoFailureTargetId), failureRate: config.failureRate, latencyOverrideMs: config.latencyOverrideMs, latencyJitter: config.latencyJitter, maxRetries: config.maxRetries, deadLetterQueue: config.deadLetterQueue, overloadBehavior: config.overloadBehavior, degradedMode: config.degradedMode, cacheOutcome: requestScenario === "cache-hit" ? "hit" : requestScenario === "cache-miss" ? "miss" : config.cacheOutcome, cacheStrategy: config.cacheStrategy, cacheHitRate: config.cacheHitRate };
    });
    const engineResult = runSystemDesignSimulation(systemNodes, edges, effectiveSimQps);
    const nodeMetrics = Object.fromEntries([...engineResult.nodeMetrics.entries()]);
    if (simulationMode === "monte-carlo") {
      const monteResult = runSystemDesignMonteCarlo(systemNodes, edges, effectiveSimQps, { trials: monteCarloSettings.trials, seed: monteCarloSettings.seed, entryNodeId: traceEntryNodeId, cacheOutcome: requestScenario === "cache-hit" ? "hit" : requestScenario === "cache-miss" ? "miss" : "auto" });
      setMonteCarloResult(monteResult);
      setSimResult({ ...metrics, latency: monteResult.p95 || metrics.latency, throughput: Math.round(engineResult.throughput), degraded: monteResult.errorRate > 0, events: [], path: [], failureNodeId: "", failureNodeLabel: "", failureIndex: -1, failureAffectsRequest: false, system: { requestedQPS: effectiveSimQps, throughput: engineResult.throughput, totalLatencyMs: engineResult.totalLatencyMs, bottleneckNodeIds: engineResult.bottleneckNodes, warnings: engineResult.warnings, nodeMetrics, primaryExecutionOrder: engineResult.primaryExecutionOrder || [], telemetryNodeIds: systemNodes.filter((node) => node.flowMode === "telemetry").map((node) => node.id), incident: { title: monteResult.errorRate > 0 ? "Monte Carlo found reliability risk" : "Monte Carlo found no request failures", detail: `${Math.round(monteResult.errorRate * 1000) / 10}% of trials ended in an error or dead-letter outcome.` }, recommendations: monteResult.errorRate > 0 ? ["Inspect the node failure counts below, then add replicas, retries, circuit breaking, or a DLQ where the workload is asynchronous."] : ["Keep this seed as a regression case and rerun it after changing replicas, cache policy, or failure rates."] } });
      setNodes((current) => current.map((node) => ({ ...node, data: { ...node.data, runtimeState: "idle", loadMetrics: nodeMetrics[node.id] || null } })));
      setIsRunning(false);
      setStep(0);
      setMode("simulate");
      setDrawer("simulate");
      return;
    }
    const traceResult = runSystemDesignTrace(systemNodes, edges, { entryNodeId: traceEntryNodeId, cacheOutcome: requestScenario === "cache-hit" ? "hit" : requestScenario === "cache-miss" ? "miss" : "auto", nodeMetrics });
    const systemNodeById = new Map(systemNodes.map((node) => [node.id, node]));
    const primaryExecutionIds = (engineResult.primaryExecutionOrder || engineResult.executionOrder || nodes.map((node) => node.id)).filter((nodeId) => systemNodeById.get(nodeId)?.flowMode === "primary");
    const pathIds = traceResult.path?.length ? traceResult.path : (primaryExecutionIds.length ? primaryExecutionIds : nodes.map((node) => node.id));
    const path = pathIds.map((nodeId) => nodes.find((node) => node.id === nodeId)).filter(Boolean);
    const resolvedFailureNodeId = traceResult.failureNodeId || (failureMode ? autoFailureTargetId : "");
    const failedNode = nodes.find((node) => node.id === resolvedFailureNodeId);
    const failedConfig = failedNode ? getNodeConfig(failedNode) : null;
    const failureAffectsRequest = Boolean(failedNode && failedConfig?.flowMode === "primary");
    const failureIndex = failureAffectsRequest ? pathIds.indexOf(resolvedFailureNodeId) : -1;
    const advice = buildSimulationAdvice(systemNodes, nodeMetrics, engineResult.bottleneckNodes, failedNode ? { ...failedNode.data, ...failedConfig, flowMode: failedConfig?.flowMode, label: failedNode.data.label || failedNode.data.service?.label } : null, selectedSimulationScenario);
    const events = traceResult.events?.map((event) => ({ id: event.id, label: event.label, time: event.time, status: event.status })) || [];
    if (failedNode && !failureAffectsRequest) events.push({ id: `${failedNode.id}:contained`, label: `${failedNode.data.label || failedNode.data.service?.label} → telemetry side channel failed (request path unaffected)`, time: Math.round(38 + path.length * 22), status: "failed" });
    const system = { requestedQPS: effectiveSimQps, throughput: engineResult.throughput, totalLatencyMs: traceResult.totalLatencyMs || engineResult.totalLatencyMs, bottleneckNodeIds: engineResult.bottleneckNodes, warnings: engineResult.warnings, nodeMetrics, primaryExecutionOrder: pathIds, telemetryNodeIds: systemNodes.filter((node) => node.flowMode === "telemetry").map((node) => node.id), incident: traceResult.status === "success" ? { title: "Trace completed", detail: requestScenario === "cache-hit" ? "The cache served this request without touching the origin." : requestScenario === "cache-miss" ? "The cache missed and the request continued to the origin path." : "The request reached the end of its selected path." } : advice.incident, recommendations: traceResult.status === "success" ? ["Use Monte Carlo to turn this single trace into a distribution of success rate and tail latency."] : advice.recommendations };
    setMonteCarloResult(null);
    setSimResult({ ...metrics, latency: system.totalLatencyMs || metrics.latency, throughput: Math.round(system.throughput), degraded: traceResult.status !== "success" || system.bottleneckNodeIds.length > 0, events, path: pathIds, failureNodeId: resolvedFailureNodeId, failureNodeLabel: failedNode?.data.label || failedNode?.data.service?.label || "Unknown node", failureIndex, failureAffectsRequest, failureImpact: failedConfig?.flowMode || "primary", system });
    setStep(0);
    setIsRunning(true);
    setMode("simulate");
    setDrawer("simulate");
  }, [edges, effectiveSimQps, failureMode, failureNodeId, metrics, monteCarloSettings, nodes, requestScenario, selectedSimulationScenario, simulationMode, traceEntryNodeId]);

  useEffect(() => {
    if (!isRunning || !simResult?.path?.length) return undefined;
    const timer = window.setTimeout(() => {
      const next = step + 1;
      const failureIndex = simResult.failureIndex ?? -1;
      setStep(next);
      setNodes((current) => current.map((node) => {
        const pathIndex = simResult.path.indexOf(node.id);
        const load = simResult.system?.nodeMetrics?.[node.id];
        const failed = node.id === simResult.failureNodeId && next > failureIndex;
        const blocked = failureIndex >= 0 && pathIndex > failureIndex && next > failureIndex;
        const overloaded = load?.status === "critical" && pathIndex >= 0 && pathIndex < next;
        const runtimeState = failed ? "failed" : blocked ? "blocked" : overloaded ? "overloaded" : simResult.path[next - 1] === node.id ? "active" : simResult.path.slice(0, next).includes(node.id) ? "complete" : "idle";
        return { ...node, data: { ...node.data, runtimeState, loadMetrics: load || null } };
      }));
      if (next >= simResult.path.length) setIsRunning(false);
    }, 460);
    return () => window.clearTimeout(timer);
  }, [isRunning, simResult, step, setNodes]);

  useEffect(() => {
    if (!simResult?.path?.length) return;
    const activeIds = new Set(simResult.path.slice(0, Math.max(0, step)));
    setEdges((current) => current.map((edge) => {
      const active = activeIds.has(edge.source) && (activeIds.has(edge.target) || simResult.path[step - 1] === edge.target);
      const failed = simResult.failureNodeId && (edge.source === simResult.failureNodeId || edge.target === simResult.failureNodeId);
      return {
        ...edge,
        animated: Boolean(isRunning && active && !failed),
        style: { ...edge.style, stroke: failed ? "#ef4444" : active ? "#06b6d4" : edge.data?.feedback ? "#64748b" : "#8b5cf6" },
      };
    }));
  }, [isRunning, setEdges, simResult, step]);

  const resetRuntime = useCallback(() => { setIsRunning(false); setStep(0); setSimResult(null); setMonteCarloResult(null); setNodes((current) => current.map((node) => ({ ...node, data: { ...node.data, runtimeState: "idle", loadMetrics: null } }))); setEdges((current) => current.map((edge) => ({ ...edge, animated: false, style: { ...edge.style, stroke: edge.data?.feedback ? "#64748b" : "#8b5cf6" } }))); }, [setEdges, setNodes]);

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
      setDiagramType("architecture");
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
      setEdges(normalizeReactFlowEdges(nextGraph.edges));
      if (parsed.brief) setBrief(parsed.brief);
      if (parsed.diagramType) setDiagramType(parsed.diagramType);
      setNotice("JSON applied successfully.");
    } catch (error) { setNotice(`Could not apply JSON: ${error.message}`); }
  }, [projectJson, setEdges, setNodes]);

  const exportProject = useCallback(() => {
    const payload = { version: "genai-playground-2.0", brief, diagramType, nodes, edges, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "genai-playground-2-architecture.json"; link.click(); URL.revokeObjectURL(link.href);
  }, [brief, diagramType, edges, nodes]);

  const openMode = (nextMode) => { setShowHome(false); setMode(nextMode); setDrawer(nextMode === "design" ? null : nextMode); if (nextMode === "simulate") runSimulation(); };
  const openHome = () => { setShowHome(true); setMode("home"); setDrawer(null); setSelectedNodeId(null); };
  const openStudioFromHome = () => { setShowHome(false); setMode("studio"); setDrawer("studio"); };
  const openBlankCanvas = () => { setShowHome(false); setMode("design"); setDrawer(null); setSelectedNodeId(null); setDiagramType("architecture"); setNodes([]); setEdges([]); setProjectJson(JSON.stringify({ brief, diagramType: "architecture", nodes: [], edges: [] }, null, 2)); setNotice("Blank canvas ready. Add services from the component rail or ask Studio to generate a flow."); };

  return <div className={`g2-shell theme-${visualTheme}`}>
    <header className="g2-topbar">
      <button className="g2-brand g2-brand-button" onClick={openHome}><span className="g2-brand-mark"><Sparkles size={16} /></span><span><strong>Gen AI Playground <span>2.0</span></strong><small>Architecture studio · simulation lab</small></span></button>
      <div className="g2-phase-tabs" role="tablist">{[["design", Layers3, "Design"], ["studio", Sparkles, "Studio"], ["simulate", Activity, "Simulate"], ["review", Target, "Review"], ["challenge", Lightbulb, "Challenge"]].map(([id, Icon, label]) => <button key={id} className={mode === id ? "active" : ""} onClick={() => openMode(id)}><Icon size={14} />{label}</button>)}</div>
      <div className="g2-top-actions"><span className="g2-saved"><CheckCircle2 size={13} /> autosaved</span><button className="g2-theme-btn" type="button" onClick={() => setVisualTheme((current) => current === "dark" ? "light" : "dark")} title={`Switch to ${visualTheme === "dark" ? "light" : "dark"} mode`}>{visualTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}<span>{visualTheme === "dark" ? "Light" : "Dark"}</span></button><button className="g2-icon-btn" onClick={exportProject} title="Export architecture"><Download size={15} /></button><button className="g2-close-btn" onClick={onClose}><ArrowLeft size={15} /> Exit</button></div>
    </header>
    {showHome ? <PlaygroundHome patterns={PATTERNS} templates={LEGACY_TEMPLATES} onStudio={openStudioFromHome} onDesign={openBlankCanvas} onPattern={(patternId) => { applyPattern(patternId); setShowHome(false); }} onTemplate={(templateId) => { applyLegacyTemplate(templateId); setShowHome(false); }} /> : <div className="g2-workspace">
      <aside className={`g2-rail ${railTab === "collapsed" ? "is-collapsed" : ""}`}>
        <div className="g2-rail-tabs"><button className={railTab === "components" ? "active" : ""} onClick={() => setRailTab("components")} title="Components"><Layers3 size={16} /></button><button className={railTab === "diagrams" ? "active" : ""} onClick={() => setRailTab("diagrams")} title="Diagram types"><Table2 size={16} /></button><button className={railTab === "patterns" ? "active" : ""} onClick={() => setRailTab("patterns")} title="Patterns"><Workflow size={16} /></button><button className={railTab === "templates" ? "active" : ""} onClick={() => setRailTab("templates")} title="Existing templates"><LayoutTemplate size={16} /></button><button className={railTab === "brief" ? "active" : ""} onClick={() => setRailTab("brief")} title="Brief"><FileJson size={16} /></button></div>
        {railTab !== "collapsed" && <div className="g2-rail-body">
          {railTab === "diagrams" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">DIAGRAM LANGUAGE</span><h3>Choose a view</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><p className="g2-muted">Every view uses the same editable canvas, connectors, playback, and export pipeline.</p><div className="g2-diagram-type-list">{DIAGRAM_TYPES.map((item) => <button key={item.id} className={`g2-diagram-type ${diagramType === item.id ? "active" : ""}`} onClick={() => applyDiagramType(item.id)}><span><strong>{item.label}</strong><small>{item.description}</small></span><ChevronRight size={14} /></button>)}</div><div className="g2-section-label">Starter views</div><div className="g2-pattern-list">{DIAGRAM_TEMPLATES.map((template) => <button key={template.id} className="g2-pattern-card" onClick={() => applyDiagramTemplate(template.id)}><span className="g2-pattern-icon"><LayoutTemplate size={16} /></span><span><strong>{template.label}</strong><small>{template.description}</small></span><ChevronRight size={14} /></button>)}</div></>}
          {railTab === "components" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">BUILDING BLOCKS</span><h3>Components</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><div className="g2-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services" /></div><div className="g2-category-scroll">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="g2-service-list">{filteredServices.map((service) => <button key={service.id} className="g2-service-item" draggable onDragStart={(event) => { event.dataTransfer.setData("application/genai-service", service.id); event.dataTransfer.effectAllowed = "copy"; }} onClick={() => addService(service.id)} title="Click to add or drag onto the canvas"><span className="g2-service-img" style={{ "--service-color": service.color }}><ServiceIcon service={service} size={22} /></span><span><strong>{service.label}</strong><small>{service.provider} · {service.kind}</small></span><Plus size={13} /></button>)}</div></>}
          {railTab === "patterns" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">FLOW DESIGN PATTERNS</span><h3>Start with intent</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><p className="g2-muted">Patterns are editable starting points, not locked templates.</p><div className="g2-pattern-list">{PATTERNS.map((pattern) => <button key={pattern.id} className="g2-pattern-card" onClick={() => applyPattern(pattern.id)}><span className="g2-pattern-icon"><Workflow size={16} /></span><span><strong>{pattern.label}</strong><small>{pattern.description}</small></span><ChevronRight size={14} /></button>)}</div><div className="g2-rail-tip"><Lightbulb size={15} /><span>Good architecture answers are paths, controls, and trade-offs.</span></div></>}
          {railTab === "templates" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">ORIGINAL GENAI PLAYGROUND</span><h3>Templates</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><p className="g2-muted">All existing GenAI Playground templates are available here with their original nodes and connections.</p><div className="g2-pattern-list">{LEGACY_TEMPLATES.map((template) => <button key={template.id} className="g2-pattern-card" onClick={() => applyLegacyTemplate(template.id)}><span className="g2-pattern-icon"><LayoutTemplate size={16} /></span><span><strong>{template.label}</strong><small>{template.description || `${template.nodes.length} nodes · ${template.edges.length} connections`}</small></span><ChevronRight size={14} /></button>)}</div></>}
          {railTab === "brief" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">DESIGN BRIEF</span><h3>What are we solving?</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><textarea className="g2-brief-textarea" value={brief} onChange={(event) => setBrief(event.target.value)} /><div className="g2-section-label">GenAI lifecycle</div>{["Scope", "Select model", "Customize", "Integrate", "Deploy", "Improve"].map((item, index) => <div className={`g2-lifecycle ${index < 3 ? "done" : ""}`} key={item}><span>{index < 3 ? <Check size={12} /> : index + 1}</span>{item}<small>{index < 3 ? "covered" : "next"}</small></div>)}<div className="g2-rail-tip"><MessageSquare size={15} /><span>Keep the brief visible while you design so every component has a job.</span></div></>}
        </div>}
        {railTab === "collapsed" && <button className="g2-rail-expand" onClick={() => setRailTab("components")} title="Expand rail"><PanelLeftOpen size={16} /></button>}
      </aside>
      <main className="g2-canvas-wrap">
        <div className="g2-canvas-toolbar"><div><span className="g2-breadcrumb">PLAYGROUND / 2.0 /</span><strong>{DIAGRAM_TYPES.find((item) => item.id === diagramType)?.label || "Architecture"} workspace</strong></div><div className="g2-canvas-tools"><span className="g2-notice"><CircleDot size={11} /> {notice}</span><button type="button" className="g2-secondary-btn compact" onClick={runSimulation} title="Animate diagram"><Activity size={13} /> Animate</button><button type="button" className="g2-secondary-btn compact" onClick={autoArrange} title="Auto layout"><Wand2 size={13} /> Arrange</button><button type="button" className="g2-secondary-btn compact" onClick={fitCanvas} title="Fit canvas"><Maximize2 size={13} /></button><button type="button" className="g2-secondary-btn compact" onClick={() => importInputRef.current?.click()} title="Import JSON"><FileUp size={13} /></button><button type="button" className="g2-secondary-btn compact danger" onClick={clearCanvas} title="Clear canvas"><Trash2 size={13} /></button><button type="button" className="g2-secondary-btn compact" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setMode("studio"); setDrawer("studio"); }}><Sparkles size={13} /> Ask Studio</button><input ref={importInputRef} type="file" accept="application/json,.json" onChange={importProject} hidden /></div></div>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onDragOver={onDragOver} onDrop={onDrop} connectionLineType={ConnectionLineType.Bezier} connectionLineStyle={{ stroke: "#64748b", strokeWidth: 1.5, strokeLinecap: "round" }} defaultEdgeOptions={{ type: "default", pathOptions: { curvature: 0.28 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" }, style: { stroke: "#64748b", strokeWidth: 1.5, strokeLinecap: "round" } }} onNodeClick={(_, node) => { setSelectedNodeId(node.id); setDrawer("inspect"); }} onPaneClick={() => { setSelectedNodeId(null); if (mode === "design") setDrawer(null); }} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.2 }} proOptions={{ hideAttribution: true }}>
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#334155" />
          <Controls showInteractive={false} />
          <MiniMap nodeColor={(node) => node.data?.service?.color || "#64748b"} maskColor="rgba(2, 6, 23, .75)" />
          <Panel position="bottom-left" className="g2-canvas-legend"><span><i className="dot source" />experience</span><span><i className="dot path" />data & flow</span><span><i className="dot safety" />safety boundary</span></Panel>
        </ReactFlow>
      </main>
      {drawer && <aside className="g2-drawer"><div className="g2-drawer-head"><span>{drawer === "inspect" ? "Inspector" : drawer[0].toUpperCase() + drawer.slice(1)}</span><button className="g2-icon-btn" onClick={() => setDrawer(null)} title="Close panel"><X size={16} /></button></div>{drawer === "studio" && <StudioDrawer prompt={prompt} setPrompt={setPrompt} onGenerate={generateFromPrompt} onApplyJson={applyJson} projectJson={projectJson || JSON.stringify({ brief, nodes, edges }, null, 2)} setProjectJson={setProjectJson} isGenerating={isGenerating} studioError={studioError} />}{drawer === "simulate" && <SimulationDrawer simQps={simQps} setSimQps={setSimQps} simulationScenario={simulationScenario} setSimulationScenario={setSimulationScenario} effectiveSimQps={effectiveSimQps} simulationMode={simulationMode} setSimulationMode={setSimulationMode} requestScenario={requestScenario} setRequestScenario={setRequestScenario} traceEntryNodeId={traceEntryNodeId} setTraceEntryNodeId={setTraceEntryNodeId} monteCarloSettings={monteCarloSettings} setMonteCarloSettings={setMonteCarloSettings} failureMode={failureMode} setFailureMode={setFailureMode} failureNodeId={failureNodeId} setFailureNodeId={setFailureNodeId} nodes={nodes} capacitySettings={capacitySettings} setCapacitySettings={setCapacitySettings} capacityEstimate={capacityEstimate} simResult={simResult} monteCarloResult={monteCarloResult} isRunning={isRunning} step={step} onRun={runSimulation} onReset={resetRuntime} />}{drawer === "review" && <ReviewDrawer reviewScore={reviewScore} reviewRows={reviewRows} onFocus={focusNode} />}{drawer === "challenge" && <ChallengeDrawer challenge={challenge} challenges={challengeCatalog} challengeScore={challengeScore} onSelectChallenge={selectChallenge} onLoadReference={loadChallengeReference} onFocus={focusNode} />}{drawer === "inspect" && <InspectorDrawer selectedNode={selectedNode} onUpdate={updateNodeConfig} onDelete={(nodeId) => setNodes((current) => current.filter((node) => node.id !== nodeId))} onClose={() => setDrawer(null)} />}</aside>}
    </div>}
  </div>;
}

export default function GenAIPlayground2(props) {
  return <ReactFlowProvider><GenAIPlayground2Canvas {...props} /></ReactFlowProvider>;
}
