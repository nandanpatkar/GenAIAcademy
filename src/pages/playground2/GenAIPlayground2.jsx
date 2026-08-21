import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NinjaEye } from "../../components/NinjaEye";
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
  BringToFront,
  Circle,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Cloud,
  Code2,
  Copy,
  Database,
  Diamond,
  Download,
  Eraser,
  FileUp,
  FileJson,
  Frame,
  Gauge,
  GitBranch,
  Globe2,
  Hand,
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
  MousePointer2,
  Palette,
  Pause,
  PenLine,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Plus,
  RectangleHorizontal,
  Redo2,
  RefreshCw,
  Search,
  SendToBack,
  ShieldCheck,
  Shapes,
  Square,
  Sparkles,
  StickyNote,
  Star,
  Sun,
  Table2,
  Target,
  Type,
  Timer,
  Trash2,
  Undo2,
  Upload,
  UserCheck,
  User,
  UserRound,
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
import {
  WhiteboardFrameNode,
  WhiteboardIconNode,
  WhiteboardNoteNode,
  WhiteboardShapeNode,
  WhiteboardStrokeNode,
  WhiteboardTextNode,
} from "./WhiteboardNodes";
import "./genai-playground2.css";

const FALLBACK_ICONS = { Activity, AlertCircle, Archive, Binary, Bot, Brain, BrainCircuit, CheckCircle2, CircleDot, Cloud, Code2, Database, FileJson, Gauge, GitBranch, Globe2, KeyRound, Layers3, Lightbulb, ListTodo, MessageSquare, Network, Search, ShieldCheck, Sparkles, Star, Table2, Target, User, UserCheck, Users, Webhook, Workflow, Zap };
const uid = (prefix = "node") => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const PROJECT_STORAGE_KEY = "genai_playground2_project_v2";
const HISTORY_LIMIT = 60;
const WHITEBOARD_AI_TYPES = new Set(["flowchart", "erd", "dataflow", "sequence", "state", "bpmn", "mindmap", "userflow", "journey", "wireframe"]);
const WHITEBOARD_SHAPES = [
  { id: "rectangle", label: "Rectangle", icon: RectangleHorizontal },
  { id: "rounded", label: "Rounded", icon: RectangleHorizontal },
  { id: "ellipse", label: "Ellipse", icon: Circle },
  { id: "diamond", label: "Decision", icon: Diamond },
  { id: "hexagon", label: "Hexagon", icon: Shapes },
  { id: "parallelogram", label: "Data", icon: Shapes },
  { id: "document", label: "Document", icon: FileJson },
  { id: "triangle", label: "Triangle", icon: Shapes },
];
const WHITEBOARD_ICONS = [
  ["Lightbulb", "Idea"], ["User", "Person"], ["Users", "Team"], ["Target", "Goal"],
  ["Star", "Priority"], ["MessageSquare", "Conversation"], ["Bot", "AI agent"],
  ["Database", "Data"], ["Code2", "Code"], ["Globe2", "Web"], ["Zap", "Action"],
  ["CheckCircle2", "Complete"], ["Cloud", "Cloud"], ["BrainCircuit", "Model"],
  ["GitBranch", "Branch"], ["KeyRound", "Auth"], ["ShieldCheck", "Security"],
  ["Network", "Network"], ["Layers3", "Platform"], ["FileJson", "Document"],
];
const WB_COLORS = ["#ffffff", "#ede9fe", "#dbeafe", "#dcfce7", "#fef3a5", "#fee2e2", "#fce7f3", "#172033"];
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
const edgeHandlesForPositions = (sourcePosition, targetPosition) => {
  const deltaX = (targetPosition?.x || 0) - (sourcePosition?.x || 0);
  const deltaY = (targetPosition?.y || 0) - (sourcePosition?.y || 0);
  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    return deltaX >= 0
      ? { sourceHandle: "right-out", targetHandle: "left-in" }
      : { sourceHandle: "left-out", targetHandle: "right-in" };
  }
  return deltaY >= 0
    ? { sourceHandle: "bottom-out", targetHandle: "top-in" }
    : { sourceHandle: "top-out", targetHandle: "bottom-in" };
};

// Layer the graph left-to-right and keep reverse/callback relationships on a
// quieter feedback route. The AI is free to describe the graph; this function
// owns the readable spatial arrangement.
function layoutGeneratedGraph(sourceNodes, sourceEdges, diagramFormat = "architecture") {
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
    const sourceIndex = order.get(id) || 0;
    let position = { x: 90 + layer * 270, y: 120 + index * 165 };
    if (diagramFormat === "flowchart" || diagramFormat === "bpmn") {
      position = { x: 180 + index * 270, y: 80 + layer * 170 };
    } else if (diagramFormat === "sequence") {
      position = { x: 70 + sourceIndex * 250, y: 100 };
    } else if (diagramFormat === "mindmap") {
      const branchIndex = Math.max(0, sourceIndex - 1);
      const branchCount = Math.max(1, nodes.length - 1);
      const angle = (branchIndex / branchCount) * Math.PI * 2;
      position = sourceIndex === 0 ? { x: 560, y: 350 } : { x: 560 + Math.cos(angle) * 430, y: 350 + Math.sin(angle) * 280 };
    } else if (diagramFormat === "wireframe") {
      position = { x: 90 + (sourceIndex % 4) * 270, y: 90 + Math.floor(sourceIndex / 4) * 190 };
    }
    return { ...node, position };
  });
  const laidEdges = validEdges.map((edge, index) => {
    const source = String(edge.source);
    const target = String(edge.target);
    const feedback = (rank.get(target) || 0) <= (rank.get(source) || 0);
    const role = edge.role || edge.data?.role || (feedback ? "feedback" : "primary");
    const label = String(edge.label || edge.condition || edge.data?.flowLabel || "");
    const rendered = arrowEdge(edge.id || `generated-edge-${index}`, source, target, label, { feedback, role, showLabel: shouldShowFlowLabel(label, role) });
    if (["flowchart", "bpmn", "mindmap"].includes(diagramFormat)) {
      const sourceNode = laidNodes.find((node) => String(node.id) === source);
      const targetNode = laidNodes.find((node) => String(node.id) === target);
      return { ...rendered, ...edgeHandlesForPositions(sourceNode?.position, targetNode?.position) };
    }
    return rendered;
  });
  return { nodes: laidNodes, edges: laidEdges };
}

function nodeDimensions(node) {
  return {
    width: Number(node.measured?.width || node.style?.width || (node.type === "architectureIcon" ? 142 : 210)),
    height: Number(node.measured?.height || node.style?.height || (node.type === "architectureIcon" ? 120 : 110)),
  };
}

// Frames are semantic containers. Arrange each contained subgraph first, size
// the frame around it, and only then place the frames in non-overlapping lanes.
// This keeps an Arrange click from scattering children outside their region.
function layoutRegionAwareGraph(sourceNodes, sourceEdges, diagramFormat = "architecture") {
  const frames = sourceNodes.filter((node) => node.type === "whiteboardFrame" && node.data?.region);
  if (!frames.length) return layoutGeneratedGraph(sourceNodes, sourceEdges, diagramFormat);
  const services = sourceNodes.filter((node) => node.type === "genaiService" || node.type === "architectureIcon");
  const serviceIds = new Set(services.map((node) => node.id));
  const claimed = new Set();
  const groups = frames.map((frame) => {
    const explicitIds = Array.isArray(frame.data?.memberIds) ? frame.data.memberIds.filter((id) => serviceIds.has(id)) : [];
    const frameWidth = Number(frame.style?.width || 320);
    const frameHeight = Number(frame.style?.height || 240);
    const containedIds = services.filter((node) => {
      const { width, height } = nodeDimensions(node);
      const centerX = node.position.x + width / 2;
      const centerY = node.position.y + height / 2;
      return centerX >= frame.position.x && centerX <= frame.position.x + frameWidth && centerY >= frame.position.y && centerY <= frame.position.y + frameHeight;
    }).map((node) => node.id);
    const memberIds = (explicitIds.length ? explicitIds : containedIds).filter((id) => !claimed.has(id));
    memberIds.forEach((id) => claimed.add(id));
    return { frame, members: services.filter((node) => memberIds.includes(node.id)) };
  }).filter((group) => group.members.length);
  if (!groups.length) return layoutGeneratedGraph(sourceNodes, sourceEdges, diagramFormat);

  let cursorX = 80;
  let tallestFrame = 0;
  const arrangedFrames = [];
  const arrangedServices = [];
  groups.forEach(({ frame, members }) => {
    const memberIds = new Set(members.map((node) => node.id));
    const innerEdges = sourceEdges.filter((edge) => memberIds.has(edge.source) && memberIds.has(edge.target));
    const inner = layoutGeneratedGraph(members, innerEdges, diagramFormat).nodes;
    const minX = Math.min(...inner.map((node) => node.position.x));
    const minY = Math.min(...inner.map((node) => node.position.y));
    const maxX = Math.max(...inner.map((node) => node.position.x + nodeDimensions(node).width));
    const maxY = Math.max(...inner.map((node) => node.position.y + nodeDimensions(node).height));
    const width = Math.max(300, maxX - minX + 110);
    const height = Math.max(220, maxY - minY + 125);
    const position = { x: cursorX, y: 90 };
    arrangedFrames.push({ ...frame, position, style: { ...frame.style, width, height }, data: { ...frame.data, memberIds: [...memberIds] } });
    arrangedServices.push(...inner.map((node) => ({ ...node, position: { x: position.x + 50 + node.position.x - minX, y: position.y + 66 + node.position.y - minY } })));
    cursorX += width + 70;
    tallestFrame = Math.max(tallestFrame, height);
  });
  const ungrouped = services.filter((node) => !claimed.has(node.id));
  if (ungrouped.length) {
    const loose = layoutGeneratedGraph(ungrouped, sourceEdges.filter((edge) => ungrouped.some((node) => node.id === edge.source) && ungrouped.some((node) => node.id === edge.target)), diagramFormat).nodes;
    const minX = Math.min(...loose.map((node) => node.position.x));
    const minY = Math.min(...loose.map((node) => node.position.y));
    arrangedServices.push(...loose.map((node) => ({ ...node, position: { x: 90 + node.position.x - minX, y: tallestFrame + 210 + node.position.y - minY } })));
  }
  const otherNodes = sourceNodes.filter((node) => !serviceIds.has(node.id) && !frames.some((frame) => frame.id === node.id));
  return { nodes: [...arrangedFrames, ...arrangedServices, ...otherNodes], edges: layoutGeneratedGraph(services, sourceEdges, diagramFormat).edges };
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
    type: overrides.iconOnly ? "architectureIcon" : "genaiService",
    position: { x: position?.[0] ?? 160 + index * 230, y: position?.[1] ?? 220 },
    data: { serviceId: service.id, label, service, runtimeState: "idle", config: {}, replicas: 1, maxQPS: component.maxQPS, latencyMs: component.latencyMs, instanceType: "t3.medium", region: "us-east-1", autoscaling: false, minReplicas: 1, maxReplicas: 20, flowMode: getDefaultFlowMode(service), sampleRate: 0.02, forceFailure: false, failureRate: 0.01, latencyOverrideMs: 0, latencyJitter: 0.3, maxRetries: 0, deadLetterQueue: false, overloadBehavior: false, degradedMode: false, cacheOutcome: "auto", cacheStrategy: "cache-aside", cacheHitRate: 0.85, ...overrides },
  };
}

function makeDiagramTemplate(templateId) {
  const template = DIAGRAM_TEMPLATE_BY_ID[templateId] || DIAGRAM_TEMPLATES[0];
  const frames = (template.regions || []).map((region, index) => ({
    id: `region-${template.id}-${index}`,
    type: "whiteboardFrame",
    position: { x: region.position?.[0] || 0, y: region.position?.[1] || 0 },
    style: { width: region.size?.[0] || 320, height: region.size?.[1] || 300 },
    data: { label: region.label, subtitle: region.subtitle || "", whiteboard: true, region: true, style: { stroke: region.color || "#f59e0b", fill: region.fill || "transparent", text: "#172033" } },
  }));
  const nodes = template.nodes.map((spec, index) => newNode(spec.serviceId, spec.position, index, {
    label: spec.label,
    diagramType: template.diagramType,
    fields: spec.fields,
    sentiment: spec.sentiment,
    subtitle: spec.subtitle,
    iconOnly: Boolean(spec.iconOnly),
  }));
  const edges = template.edges.map((link, index) => arrowEdge(
    `diagram-edge-${template.id}-${index}`,
    nodes[link.from]?.id,
    nodes[link.to]?.id,
    link.label,
    { role: link.role, feedback: link.role === "feedback" },
  )).filter((link) => link.source && link.target);
  return { nodes: [...frames, ...nodes], edges, diagramType: template.diagramType, name: template.label, description: template.description };
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

// Architecture references often use the provider mark itself as the node. Keep
// the label and connection ports, but deliberately remove the surrounding card.
function ArchitectureIconNode({ data, selected }) {
  const service = data.service || SERVICE_BY_ID[data.serviceId] || SERVICE_BY_ID.lambda;
  const runtime = data.runtimeState || "idle";
  return <div className={`g2-architecture-icon runtime-${runtime} ${selected ? "is-selected" : ""}`} style={{ "--node-color": service.color }}>
    <Handle type="target" position={Position.Left} id="in" />
    <span className="g2-architecture-icon-art"><ServiceIcon service={service} size={48} /></span>
    <strong>{data.label || service.label}</strong>
    {data.subtitle && <small>{data.subtitle}</small>}
    {runtime !== "idle" && <i className={`g2-runtime-dot ${runtime}`} />}
    <Handle type="source" position={Position.Right} id="out" />
  </div>;
}

const nodeTypes = {
  genaiService: GenAIServiceNode,
  architectureIcon: ArchitectureIconNode,
  whiteboardShape: WhiteboardShapeNode,
  whiteboardNote: WhiteboardNoteNode,
  whiteboardText: WhiteboardTextNode,
  whiteboardFrame: WhiteboardFrameNode,
  whiteboardIcon: WhiteboardIconNode,
  whiteboardStroke: WhiteboardStrokeNode,
};

// Produce playback waves rather than a single chosen route. This mirrors how
// visual workflow runners reveal all reachable work: a node is emitted only
// after every reachable non-feedback predecessor has been visited. Cycles are
// handled safely by placing any remaining nodes in a final wave.
function buildAnimationPlan(nodes, edges, entryNodeId = "") {
  const validIds = new Set(nodes.map((node) => node.id));
  const links = edges.filter((edge) => validIds.has(edge.source) && validIds.has(edge.target) && edge.data?.role !== "feedback");
  const incoming = new Map(nodes.map((node) => [node.id, 0]));
  const outgoing = new Map(nodes.map((node) => [node.id, []]));
  links.forEach((edge) => {
    incoming.set(edge.target, (incoming.get(edge.target) || 0) + 1);
    outgoing.get(edge.source)?.push(edge);
  });
  // Kahn-style waves make every branch wait for its incoming work, while
  // still allowing independent branches and disconnected starts to run. This
  // avoids the old first-path BFS behaviour that could appear to end at a
  // fan-in node even though work was still visible elsewhere on the canvas.
  const ready = nodes.filter((node) => (incoming.get(node.id) || 0) === 0).map((node) => node.id);
  if (entryNodeId && ready.includes(entryNodeId)) ready.sort((left, right) => left === entryNodeId ? -1 : right === entryNodeId ? 1 : 0);
  const depth = new Map();
  const completed = new Set();
  const steps = [];
  let wave = 0;
  while (ready.length) {
    const current = ready.splice(0).filter((id) => !completed.has(id));
    if (!current.length) continue;
    current.forEach((id) => { completed.add(id); depth.set(id, wave); });
    steps.push(current);
    current.forEach((id) => (outgoing.get(id) || []).forEach((edge) => {
      incoming.set(edge.target, Math.max(0, (incoming.get(edge.target) || 0) - 1));
      if ((incoming.get(edge.target) || 0) === 0 && !completed.has(edge.target)) ready.push(edge.target);
    }));
    wave += 1;
  }
  // Cycles or malformed links cannot block the preview. Add every remaining
  // node as one final deterministic wave so no visible component is skipped.
  const remaining = nodes.map((node) => node.id).filter((id) => !completed.has(id));
  if (remaining.length) {
    remaining.forEach((id) => depth.set(id, steps.length));
    steps.push(remaining);
  }
  const edgeSteps = links.map((edge) => ({ ...edge, step: Math.max(1, depth.get(edge.target) || 0) }));
  return { steps, edgeSteps };
}

function PillarBar({ label, value, color }) {
  return <div className="g2-pillar-row"><div><span>{label}</span><b>{value}%</b></div><div className="g2-progress"><i style={{ width: `${value}%`, background: color }} /></div></div>;
}

function StudioDrawer({ prompt, setPrompt, onGenerate, onApplyJson, projectJson, setProjectJson, isGenerating, studioError, diagramType, componentDisplay, setComponentDisplay }) {
  const formatLabel = DIAGRAM_TYPES.find((item) => item.id === diagramType)?.label || "diagram";
  return <div className="g2-drawer-content">
    <div className="g2-drawer-kicker">STUDIO / AI VISUAL DESIGNER</div>
    <h2>Generate an editable {formatLabel.toLowerCase()}</h2>
    <p className="g2-muted">Describe the content, relationships, constraints, and visual intent. Ask for “icon-only nodes” and named regions such as “private VPC” or “hot path”; Studio creates editable frames, labels, nodes, and connections.</p>
    <div className="g2-studio-appearance"><span>Architecture components</span><div className="g2-component-display" role="group" aria-label="Generated component appearance"><button className={componentDisplay === "card" ? "active" : ""} onClick={() => setComponentDisplay("card")}><RectangleHorizontal size={14} /> Cards</button><button className={componentDisplay === "icon" ? "active" : ""} onClick={() => setComponentDisplay("icon")}><Sparkles size={14} /> Icons only</button></div></div>
    <textarea className="g2-textarea" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Build an icon-only AWS RAG architecture with frames for edge, private VPC, data plane, and observability…" />
    <button className="g2-primary-btn" onClick={onGenerate} disabled={isGenerating}>{isGenerating ? <NinjaEye size={16} labelled={false} /> : <Sparkles size={15} />} {isGenerating ? `Generating ${formatLabel.toLowerCase()}…` : `Generate ${formatLabel.toLowerCase()}`}</button>
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
  if (String(selectedNode.type || "").startsWith("whiteboard")) {
    const data = selectedNode.data || {};
    const style = data.style || {};
    const updateStyle = (patch) => onUpdate(selectedNode.id, { style: { ...style, ...patch } });
    return <div className="g2-drawer-content">
      <div className="g2-drawer-kicker">WHITEBOARD / FORMAT</div>
      <div className="g2-wb-inspector-title"><Palette size={18} /><div><h2>{data.label || "Canvas object"}</h2><p>{selectedNode.type.replace("whiteboard", "").toLowerCase() || "ink"}</p></div></div>
      {selectedNode.type === "whiteboardShape" && <label className="g2-control-select"><span>Shape</span><select className="g2-select" value={data.shape || "rectangle"} onChange={(event) => onUpdate(selectedNode.id, { shape: event.target.value })}>{WHITEBOARD_SHAPES.map((shape) => <option value={shape.id} key={shape.id}>{shape.label}</option>)}</select></label>}
      {selectedNode.type !== "whiteboardStroke" && <div className="g2-wb-format-grid">
        <label><span>Fill</span><input type="color" value={style.fill || "#ffffff"} onChange={(event) => updateStyle({ fill: event.target.value })} /></label>
        <label><span>Border</span><input type="color" value={style.stroke || "#7c3aed"} onChange={(event) => updateStyle({ stroke: event.target.value })} /></label>
        <label><span>Text</span><input type="color" value={style.text || "#172033"} onChange={(event) => updateStyle({ text: event.target.value })} /></label>
      </div>}
      <p className="g2-muted">Drag the selection handles to resize. Connect any visible port to another object, or edit text directly on the canvas.</p>
      <button className="g2-danger-btn" onClick={() => { onDelete(selectedNode.id); onClose(); }}><Trash2 size={14} /> Remove object</button>
    </div>;
  }
  const service = selectedNode.data.service || SERVICE_BY_ID[selectedNode.data.serviceId];
  const config = getNodeConfig(selectedNode);
  const update = (patch) => onUpdate(selectedNode.id, patch);
  return <div className="g2-drawer-content"><div className="g2-drawer-kicker">COMPONENT / CONFIGURATION</div><div className="g2-inspector-title"><ServiceIcon service={service} size={36} /><div><h2>{selectedNode.data.label || service.label}</h2><p>{service.provider} · {service.category}</p></div></div><p className="g2-muted">{service.description}</p><div className="g2-inspector-fields"><label>Role<input value={service.kind} readOnly /></label><label>Provider<input value={service.provider} readOnly /></label><label>Traffic behavior<select value={config.flowMode} onChange={(event) => update({ flowMode: event.target.value })}><option value="primary">Primary request path</option><option value="async">Async/background work</option><option value="telemetry">Telemetry side channel</option></select></label>{config.flowMode === "telemetry" && <label>Telemetry sample rate<input type="number" min="0.1" max="100" step="0.1" value={Number((config.sampleRate * 100).toFixed(2))} onChange={(event) => update({ sampleRate: Math.min(1, Math.max(0.001, Number(event.target.value) / 100)) })} /><small>Only this percentage of request events enters the monitoring path.</small></label>}<label>Instance type<select value={config.instanceType} onChange={(event) => update({ instanceType: event.target.value })}>{INSTANCE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label>Region<select value={config.region} onChange={(event) => update({ region: event.target.value })}>{["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1", "ap-south-1"].map((region) => <option key={region} value={region}>{region}</option>)}</select></label><label>Max QPS per instance<input type="number" min="1" value={config.maxQPS} onChange={(event) => update({ maxQPS: Math.max(1, Number(event.target.value)) })} /></label><label>Base latency (ms)<input type="number" min="0" value={config.latencyMs} onChange={(event) => update({ latencyMs: Math.max(0, Number(event.target.value)) })} /></label></div><div className="g2-inspector-section"><div className="g2-inspector-section-title"><strong>Capacity & scaling</strong><span>{(config.maxQPS * config.replicas).toLocaleString()} effective QPS</span></div><div className="g2-replica-row"><button type="button" onClick={() => update({ replicas: Math.max(1, config.replicas - 1) })}><Minus size={12} /></button><input type="range" min="1" max="20" value={config.replicas} onChange={(event) => update({ replicas: Number(event.target.value) })} /><button type="button" onClick={() => update({ replicas: Math.min(20, config.replicas + 1) })}><Plus size={12} /></button></div><div className="g2-replica-value">{config.replicas}× instances / replicas</div><label className="g2-checkbox-row"><span><strong>Autoscaling</strong><small>Allow replica count to respond to load.</small></span><input type="checkbox" checked={config.autoscaling} onChange={(event) => update({ autoscaling: event.target.checked })} /></label>{config.autoscaling && <div className="g2-scaling-range"><label>Min replicas<input type="number" min="1" max={config.maxReplicas} value={config.minReplicas} onChange={(event) => update({ minReplicas: Math.max(1, Math.min(config.maxReplicas, Number(event.target.value))) })} /></label><label>Max replicas<input type="number" min={config.minReplicas} max="50" value={config.maxReplicas} onChange={(event) => update({ maxReplicas: Math.max(config.minReplicas, Number(event.target.value)) })} /></label></div>}</div><div className="g2-inspector-section"><div className="g2-inspector-section-title"><strong>Trace & Monte Carlo</strong><span>failure + tail latency</span></div><label className="g2-checkbox-row"><span><strong>Force failure</strong><small>Fail this node on the next trace.</small></span><input type="checkbox" checked={config.forceFailure} onChange={(event) => update({ forceFailure: event.target.checked })} /></label><div className="g2-inspector-fields"><label>Failure rate (%)<input type="number" min="0" max="100" step="0.1" value={Number((config.failureRate * 100).toFixed(2))} onChange={(event) => update({ failureRate: Math.min(1, Math.max(0, Number(event.target.value) / 100)) })} /></label><label>Latency override (ms)<input type="number" min="0" value={config.latencyOverrideMs} onChange={(event) => update({ latencyOverrideMs: Math.max(0, Number(event.target.value)) })} /></label><label>Latency jitter (%)<input type="number" min="0" max="100" step="1" value={Math.round(config.latencyJitter * 100)} onChange={(event) => update({ latencyJitter: Math.min(1, Math.max(0, Number(event.target.value) / 100)) })} /></label><label>Max retries<input type="number" min="0" max="10" value={config.maxRetries} onChange={(event) => update({ maxRetries: Math.max(0, Math.min(10, Number(event.target.value))) })} /></label></div><label className="g2-checkbox-row"><span><strong>Dead-letter queue</strong><small>Route exhausted async work to a DLQ.</small></span><input type="checkbox" checked={config.deadLetterQueue} onChange={(event) => update({ deadLetterQueue: event.target.checked })} /></label><label className="g2-checkbox-row"><span><strong>Overload behavior</strong><small>Fail when simulated utilization exceeds capacity.</small></span><input type="checkbox" checked={config.overloadBehavior} onChange={(event) => update({ overloadBehavior: event.target.checked })} /></label></div>{service.kind === "cache" && <div className="g2-inspector-section"><div className="g2-inspector-section-title"><strong>Cache behavior</strong><span>read path</span></div><label className="g2-control-select"><span>Trace outcome</span><select className="g2-select" value={config.cacheOutcome} onChange={(event) => update({ cacheOutcome: event.target.value })}><option value="auto">Auto / probability</option><option value="hit">Force HIT</option><option value="miss">Force MISS</option></select></label><label className="g2-control-select"><span>Miss strategy</span><select className="g2-select" value={config.cacheStrategy} onChange={(event) => update({ cacheStrategy: event.target.value })}><option value="cache-aside">Cache-aside</option><option value="read-through">Read-through</option></select></label><label>Monte Carlo hit rate (%)<input type="number" min="0" max="100" value={Math.round(config.cacheHitRate * 100)} onChange={(event) => update({ cacheHitRate: Math.min(1, Math.max(0, Number(event.target.value) / 100)) })} /></label></div>}<div className="g2-inspector-fields"><label>Design note<textarea value={config.designNote} onChange={(event) => update({ designNote: event.target.value })} placeholder="What decision does this component represent?" /></label></div><button className="g2-danger-btn" onClick={() => { onDelete(selectedNode.id); onClose(); }}><Trash2 size={14} /> Remove component</button></div>;
}

function PlaygroundHome({ patterns, templates, onStudio, onDesign, onPattern, onTemplate }) {
  return <main className="g2-home">
    <section className="g2-home-hero">
      <div className="g2-home-kicker"><span className="g2-home-kicker-dot" /> AI-NATIVE VISUAL WORKBENCH</div>
      <h1>Think, draw, and design without limits.</h1>
      <p>Move from a rough idea to a beautiful whiteboard, flow, wireframe, or testable architecture—all on one AI-assisted canvas.</p>
      <div className="g2-home-actions"><button className="g2-home-primary" onClick={onStudio}><Sparkles size={16} /> Ask Studio to build it</button><button className="g2-home-secondary" onClick={onDesign}><Layers3 size={16} /> Start from a blank canvas</button></div>
      <div className="g2-home-meta"><span><CheckCircle2 size={13} /> Resizable shapes, cards, icons, and freehand ink</span><span><Workflow size={13} /> Diagrams, brainstorming, and architecture</span><span><Target size={13} /> Create manually or generate with AI</span></div>
    </section>
    <section className="g2-home-section"><div className="g2-home-section-head"><div><span className="g2-drawer-kicker">QUICK STARTS</span><h2>Choose a visual starting point</h2></div><button className="g2-home-link" onClick={onDesign}>Open the infinite canvas <ChevronRight size={14} /></button></div><div className="g2-home-pattern-grid">{patterns.slice(0, 4).map((pattern) => <button className="g2-home-pattern" key={pattern.id} onClick={() => onPattern(pattern.id)}><span className="g2-home-pattern-icon"><Workflow size={18} /></span><span><strong>{pattern.label}</strong><small>{pattern.description}</small></span><ChevronRight size={15} /></button>)}</div></section>
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
  const [componentDisplay, setComponentDisplay] = useState("card");
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
  const [playbackSpeed, setPlaybackSpeed] = useState(0.75);
  const [isPlaybackPaused, setIsPlaybackPaused] = useState(false);
  const [followExecution, setFollowExecution] = useState(true);
  const [challenge, setChallenge] = useState(CHALLENGES[0]);
  const [projectJson, setProjectJson] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [studioError, setStudioError] = useState("");
  const [didRestore, setDidRestore] = useState(false);
  const [toolMode, setToolMode] = useState("select");
  const [penColor, setPenColor] = useState("#172033");
  const [penWidth, setPenWidth] = useState(3);
  const [drawDraft, setDrawDraft] = useState([]);
  const [historyVersion, setHistoryVersion] = useState(0);
  const importInputRef = useRef(null);
  const canvasRef = useRef(null);
  const historyRef = useRef([]);
  const futureRef = useRef([]);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const dragCheckpointRef = useRef(false);
  const followedPlaybackRef = useRef(false);
  const [visualTheme, setVisualTheme] = useState(() => {
    try { return localStorage.getItem("genai_playground2_theme") || "light"; } catch { return "light"; }
  });
  const reactFlow = useReactFlow();
  const challengeCatalog = useMemo(() => [...CHALLENGES, ...SYSTEM_DESIGN_CHALLENGES], []);
  const fitCanvas = useCallback(() => window.setTimeout(() => reactFlow.fitView({ padding: 0.22, duration: 320 }), 60), [reactFlow]);

  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);

  const checkpoint = useCallback(() => {
    historyRef.current = [...historyRef.current.slice(-(HISTORY_LIMIT - 1)), {
      nodes: nodesRef.current,
      edges: edgesRef.current,
    }];
    futureRef.current = [];
    setHistoryVersion((value) => value + 1);
  }, []);
  const undo = useCallback(() => {
    const previous = historyRef.current.pop();
    if (!previous) return;
    futureRef.current.unshift({ nodes: nodesRef.current, edges: edgesRef.current });
    setNodes(previous.nodes); setEdges(previous.edges); setSelectedNodeId(null);
    setHistoryVersion((value) => value + 1);
  }, [setEdges, setNodes]);
  const redo = useCallback(() => {
    const next = futureRef.current.shift();
    if (!next) return;
    historyRef.current.push({ nodes: nodesRef.current, edges: edgesRef.current });
    setNodes(next.nodes); setEdges(next.edges); setSelectedNodeId(null);
    setHistoryVersion((value) => value + 1);
  }, [setEdges, setNodes]);

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
    checkpoint();
    setNodes((current) => current.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, ...patch } } : node));
    setSimResult(null);
    setMonteCarloResult(null);
  }, [checkpoint, setNodes]);

  const selectChallenge = useCallback((nextChallenge) => {
    setChallenge(nextChallenge);
    if (nextChallenge?.brief) setBrief(nextChallenge.brief);
    setNotice(`${nextChallenge.label} loaded. Build the design, then run the canvas checks.`);
  }, []);

  const loadChallengeReference = useCallback((nextChallenge) => {
    const reference = nextChallenge?.reference;
    if (!reference?.nodes?.length) return;
    checkpoint();
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
  }, [checkpoint, fitCanvas, setEdges, setNodes]);

  const applyPattern = useCallback((patternId) => {
    checkpoint();
    const next = makePattern(patternId);
    setNodes(next.nodes);
    setEdges(next.edges);
    setDiagramType("architecture");
    setSelectedNodeId(null);
    setNotice(`${PATTERNS.find((pattern) => pattern.id === patternId)?.label || "Pattern"} loaded. Make the trade-offs explicit.`);
    setMode("design");
    setDrawer(null);
    fitCanvas();
  }, [checkpoint, fitCanvas, setEdges, setNodes]);

  const applyLegacyTemplate = useCallback((templateId) => {
    const template = LEGACY_TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;
    checkpoint();
    setNodes(template.nodes);
    setEdges(template.edges);
    setDiagramType("architecture");
    setSelectedNodeId(null);
    setMode("design");
    setDrawer(null);
    fitCanvas();
    setNotice(`${template.label} loaded from the original GenAI Playground template library.`);
  }, [checkpoint, fitCanvas, setEdges, setNodes]);

  const applyDiagramTemplate = useCallback((templateId) => {
    checkpoint();
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
  }, [brief, checkpoint, fitCanvas, setEdges, setNodes]);

  const applyDiagramType = useCallback((typeId) => {
    if (typeId === "architecture") {
      applyPattern("rag");
      return;
    }
    const template = DIAGRAM_TEMPLATES.find((item) => item.diagramType === typeId);
    if (template) {
      applyDiagramTemplate(template.id);
      return;
    }
    setDiagramType(typeId);
    setNotice(`${DIAGRAM_TYPES.find((item) => item.id === typeId)?.label || "Diagram"} mode selected. Build manually or ask Studio to generate it with AI.`);
  }, [applyDiagramTemplate, applyPattern]);

  const addService = useCallback((serviceId, display = componentDisplay) => {
    const service = SERVICE_BY_ID[serviceId];
    if (!service) return;
    checkpoint();
    const position = { x: 170 + (nodes.length % 4) * 250, y: 120 + Math.floor(nodes.length / 4) * 170 };
    const node = newNode(serviceId, [position.x, position.y], nodes.length, { diagramType, iconOnly: display === "icon" });
    setNodes((current) => [...current, node]);
    setSelectedNodeId(node.id);
    setDrawer("inspect");
    setNotice(`${service.label} added to the canvas.`);
  }, [checkpoint, componentDisplay, diagramType, nodes.length, setNodes]);

  const updateWhiteboardText = useCallback((nodeId, label) => {
    setNodes((current) => current.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, label } } : node));
  }, [setNodes]);

  const createWhiteboardNode = useCallback((spec = {}, position) => {
    const point = position || reactFlow.screenToFlowPosition({
      x: (canvasRef.current?.getBoundingClientRect().left || 0) + (canvasRef.current?.clientWidth || 800) / 2,
      y: (canvasRef.current?.getBoundingClientRect().top || 0) + (canvasRef.current?.clientHeight || 600) / 2,
    });
    const type = spec.type || "whiteboardShape";
    const defaults = type === "whiteboardFrame"
      ? { width: 520, height: 320 }
      : type === "whiteboardText"
        ? { width: 230, height: 64 }
        : type === "whiteboardIcon"
          ? { width: 126, height: 112 }
          : type === "whiteboardNote"
            ? { width: 190, height: 170 }
            : { width: 210, height: 110 };
    return {
      id: uid("wb"),
      type,
      position: { x: point.x - defaults.width / 2, y: point.y - defaults.height / 2 },
      style: defaults,
      data: {
        label: spec.label || (type === "whiteboardNote" ? "New idea" : type === "whiteboardText" ? "Heading" : type === "whiteboardFrame" ? "New frame" : "Type here"),
        shape: spec.shape || "rectangle",
        icon: spec.icon || "Lightbulb",
        style: spec.style || { fill: type === "whiteboardNote" ? "#fef3a5" : "#ffffff", stroke: "#7c3aed", text: "#172033" },
        whiteboard: true,
      },
    };
  }, [reactFlow]);

  const addWhiteboardItem = useCallback((spec, position) => {
    checkpoint();
    const node = createWhiteboardNode(spec, position);
    setNodes((current) => [...current, node]);
    setSelectedNodeId(node.id);
    setDrawer("inspect");
    setNotice(`${spec.label || "Whiteboard object"} added. Drag the corners to resize.`);
    return node;
  }, [checkpoint, createWhiteboardNode, setNodes]);

  const applyBrainstormTemplate = useCallback((templateId) => {
    checkpoint();
    const center = reactFlow.screenToFlowPosition({
      x: (canvasRef.current?.getBoundingClientRect().left || 0) + (canvasRef.current?.clientWidth || 900) / 2,
      y: (canvasRef.current?.getBoundingClientRect().top || 0) + (canvasRef.current?.clientHeight || 620) / 2,
    });
    const notes = [];
    const frames = [];
    const templateEdges = [];
    if (templateId === "swot") {
      [["Strengths", -270, -190, "#dcfce7"], ["Weaknesses", 20, -190, "#fee2e2"], ["Opportunities", -270, 40, "#dbeafe"], ["Threats", 20, 40, "#fef3a5"]].forEach(([label, x, y, fill]) => {
        frames.push(createWhiteboardNode({ type: "whiteboardFrame", label, style: { stroke: "#8b5cf6" } }, { x: center.x + x + 130, y: center.y + y + 90 }));
        notes.push(createWhiteboardNode({ type: "whiteboardNote", label: `Add ${String(label).toLowerCase()}…`, style: { fill, text: "#172033", stroke: "#8b5cf6" } }, { x: center.x + x + 130, y: center.y + y + 100 }));
      });
    } else if (templateId === "retro") {
      [["Went well", -280, "#dcfce7"], ["Could improve", 0, "#fee2e2"], ["Actions", 280, "#dbeafe"]].forEach(([label, x, fill]) => {
        frames.push(createWhiteboardNode({ type: "whiteboardFrame", label, style: { stroke: "#8b5cf6" } }, { x: center.x + x, y: center.y }));
        [-90, 80].forEach((y) => notes.push(createWhiteboardNode({ type: "whiteboardNote", label: "Add a thought…", style: { fill, text: "#172033" } }, { x: center.x + x, y: center.y + y })));
      });
    } else {
      const central = createWhiteboardNode({ type: "whiteboardShape", shape: "ellipse", label: "Central idea", style: { fill: "#ede9fe", stroke: "#7c3aed", text: "#172033" } }, center);
      notes.push(central);
      const ideas = ["Users", "Problems", "Ideas", "Questions", "Next steps", "Risks"];
      ideas.forEach((label, index) => {
        const angle = (index / ideas.length) * Math.PI * 2;
        const notePosition = { x: center.x + Math.cos(angle) * 360, y: center.y + Math.sin(angle) * 240 };
        const note = createWhiteboardNode({ type: "whiteboardNote", label, style: { fill: WB_COLORS[2 + (index % 5)], text: "#172033" } }, notePosition);
        notes.push(note);
        templateEdges.push({
          ...arrowEdge(uid("mindmap-edge"), central.id, note.id, "", { role: "branch", showLabel: false, curvature: 0.3 }),
          ...edgeHandlesForPositions(center, notePosition),
        });
      });
    }
    const nextNodes = [...nodesRef.current, ...frames, ...notes];
    setNodes(nextNodes);
    setEdges((current) => [...current, ...templateEdges]);
    setDiagramType(templateId === "mindmap" ? "mindmap" : "userflow");
    setNotice(`${templateId === "swot" ? "SWOT" : templateId === "retro" ? "Retrospective" : "Mind map"} brainstorming board created.`);
    fitCanvas();
  }, [checkpoint, createWhiteboardNode, fitCanvas, reactFlow, setEdges, setNodes]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const whiteboardRaw = event.dataTransfer.getData("application/genai-whiteboard");
    if (whiteboardRaw) {
      try {
        const spec = JSON.parse(whiteboardRaw);
        const position = reactFlow.screenToFlowPosition({ x: event.clientX, y: event.clientY });
        addWhiteboardItem(spec, position);
      } catch { setNotice("That whiteboard item could not be added."); }
      return;
    }
    const serviceId = event.dataTransfer.getData("application/genai-service");
    const service = SERVICE_BY_ID[serviceId];
    if (!service) return;
    checkpoint();
    const position = reactFlow.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const display = event.dataTransfer.getData("application/genai-service-display") || componentDisplay;
    const node = newNode(serviceId, [position.x - (display === "icon" ? 68 : 96), position.y - (display === "icon" ? 52 : 35)], nodes.length, { diagramType, iconOnly: display === "icon" });
    setNodes((current) => [...current, node]);
    setSelectedNodeId(node.id);
    setDrawer("inspect");
    setNotice(`${service.label} added to the canvas.`);
  }, [addWhiteboardItem, checkpoint, componentDisplay, diagramType, nodes.length, reactFlow, setNodes]);

  const drawingPoint = useCallback((event) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      screen: { x: event.clientX - rect.left, y: event.clientY - rect.top },
      flow: reactFlow.screenToFlowPosition({ x: event.clientX, y: event.clientY }),
    };
  }, [reactFlow]);
  const eraseAt = useCallback((point) => {
    const candidates = [...nodesRef.current].reverse();
    const hit = candidates.find((node) => {
      const width = Number(node.measured?.width || node.width || node.style?.width || 200);
      const height = Number(node.measured?.height || node.height || node.style?.height || 100);
      return point.x >= node.position.x && point.x <= node.position.x + width && point.y >= node.position.y && point.y <= node.position.y + height;
    });
    if (!hit) return;
    checkpoint();
    setNodes((current) => current.filter((node) => node.id !== hit.id));
    setEdges((current) => current.filter((edge) => edge.source !== hit.id && edge.target !== hit.id));
    if (selectedNodeId === hit.id) { setSelectedNodeId(null); setDrawer(null); }
    setNotice("Object erased.");
  }, [checkpoint, selectedNodeId, setEdges, setNodes]);
  const onInkPointerDown = useCallback((event) => {
    const point = drawingPoint(event);
    if (!point) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    if (toolMode === "eraser") { eraseAt(point.flow); return; }
    if (toolMode !== "pen") return;
    setDrawDraft([point]);
  }, [drawingPoint, eraseAt, toolMode]);
  const onInkPointerMove = useCallback((event) => {
    if (toolMode !== "pen" || !drawDraft.length) return;
    const point = drawingPoint(event);
    if (point) setDrawDraft((current) => [...current, point]);
  }, [drawDraft.length, drawingPoint, toolMode]);
  const finishInk = useCallback(() => {
    if (toolMode !== "pen" || drawDraft.length < 2) { setDrawDraft([]); return; }
    const flowPoints = drawDraft.map((point) => point.flow);
    const minX = Math.min(...flowPoints.map((point) => point.x));
    const minY = Math.min(...flowPoints.map((point) => point.y));
    const maxX = Math.max(...flowPoints.map((point) => point.x));
    const maxY = Math.max(...flowPoints.map((point) => point.y));
    const padding = Math.max(4, penWidth * 2);
    const width = Math.max(12, maxX - minX + padding * 2);
    const height = Math.max(12, maxY - minY + padding * 2);
    checkpoint();
    const stroke = {
      id: uid("ink"),
      type: "whiteboardStroke",
      position: { x: minX - padding, y: minY - padding },
      style: { width, height },
      data: {
        whiteboard: true,
        label: "Freehand drawing",
        points: flowPoints.map((point) => ({ x: point.x - minX + padding, y: point.y - minY + padding })),
        viewWidth: width,
        viewHeight: height,
        color: penColor,
        strokeWidth: penWidth,
      },
    };
    setNodes((current) => [...current, stroke]);
    setDrawDraft([]);
    setNotice("Ink added. Switch to Select to move or resize it.");
  }, [checkpoint, drawDraft, penColor, penWidth, setNodes, toolMode]);

  const autoArrange = useCallback(() => {
    if (!nodes.length) return;
    checkpoint();
    const next = layoutRegionAwareGraph(nodes, edges, diagramType);
    setNodes(next.nodes);
    setEdges(next.edges);
    setNotice("Canvas arranged with dependency flow and fitted region boundaries.");
    fitCanvas();
  }, [checkpoint, diagramType, edges, fitCanvas, nodes, setEdges, setNodes]);

  const clearCanvas = useCallback(() => {
    if (!nodes.length || !window.confirm("Clear the current board?")) return;
    checkpoint();
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setDrawer(null);
    setProjectJson(JSON.stringify({ brief, nodes: [], edges: [] }, null, 2));
    setNotice("Canvas cleared. Add components or load a pattern to continue.");
  }, [brief, checkpoint, nodes.length, setEdges, setNodes]);

  const importProject = useCallback(async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      const isNativeProject = payload?.version === "genai-playground-2.0" && Array.isArray(payload.nodes) && Array.isArray(payload.edges);
      const normalized = isNativeProject ? payload : normalizeFlowArchitecture(payload, payload.brief || brief);
      if (!Array.isArray(normalized.nodes) || !Array.isArray(normalized.edges)) throw new Error("Expected nodes and edges arrays.");
      setNodes(normalized.nodes);
      setEdges(normalizeReactFlowEdges(normalized.edges));
      if (normalized.brief) setBrief(normalized.brief);
      setProjectJson(JSON.stringify(normalized, null, 2));
      setSelectedNodeId(null);
      setDrawer(null);
      setNotice(`Imported ${normalized.nodes.length} objects and ${normalized.edges.length} connections.`);
      fitCanvas();
    } catch (error) {
      setNotice(`Could not import architecture: ${error.message}`);
    }
  }, [brief, fitCanvas, setEdges, setNodes]);

  const onConnect = useCallback((connection) => {
    checkpoint();
    setEdges((current) => addEdge({ ...connection, ...arrowEdge(uid("edge"), connection.source, connection.target) }, current));
  }, [checkpoint, setEdges]);
  const focusNode = useCallback((nodeId) => { setSelectedNodeId(nodeId); setDrawer("inspect"); const node = nodes.find((item) => item.id === nodeId); if (node) reactFlow.setCenter(node.position.x + 100, node.position.y + 50, { zoom: 1.15, duration: 450 }); }, [nodes, reactFlow]);

  const deleteSelected = useCallback(() => {
    if (!selectedNodeId) return;
    checkpoint();
    setNodes((current) => current.filter((node) => node.id !== selectedNodeId));
    setEdges((current) => current.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null); setDrawer(null); setNotice("Selected object removed.");
  }, [checkpoint, selectedNodeId, setEdges, setNodes]);
  const duplicateSelected = useCallback(() => {
    const selected = nodesRef.current.find((node) => node.id === selectedNodeId);
    if (!selected) return;
    checkpoint();
    const clone = { ...selected, id: uid("copy"), selected: false, position: { x: selected.position.x + 34, y: selected.position.y + 34 }, data: { ...selected.data, label: selected.data?.label ? `${selected.data.label} copy` : selected.data?.label } };
    setNodes((current) => [...current, clone]); setSelectedNodeId(clone.id); setNotice("Object duplicated.");
  }, [checkpoint, selectedNodeId, setNodes]);
  const changeLayer = useCallback((direction) => {
    if (!selectedNodeId) return;
    checkpoint();
    setNodes((current) => {
      const selected = current.find((node) => node.id === selectedNodeId);
      if (!selected) return current;
      const others = current.filter((node) => node.id !== selectedNodeId);
      return direction === "front" ? [...others, selected] : [selected, ...others];
    });
  }, [checkpoint, selectedNodeId, setNodes]);
  const onNodeDragStart = useCallback(() => {
    if (dragCheckpointRef.current) return;
    checkpoint(); dragCheckpointRef.current = true;
  }, [checkpoint]);
  const onNodeDragStop = useCallback(() => { dragCheckpointRef.current = false; }, []);

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
    const executableNodes = nodes.filter((node) => node.type === "genaiService" || node.type === "architectureIcon");
    const autoFailureTargetId = executableNodes.find((node) => node.id === failureNodeId)?.id || executableNodes.find((node) => node.data.service?.kind === "llm")?.id || executableNodes[0]?.id;
    const systemNodes = executableNodes.map((node) => {
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
    const pathIds = traceResult.path?.length ? traceResult.path : (primaryExecutionIds.length ? primaryExecutionIds : executableNodes.map((node) => node.id));
    const path = pathIds.map((nodeId) => executableNodes.find((node) => node.id === nodeId)).filter(Boolean);
    const animationPlan = buildAnimationPlan(executableNodes, edges, traceEntryNodeId);
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
    setSimResult({ ...metrics, latency: system.totalLatencyMs || metrics.latency, throughput: Math.round(system.throughput), degraded: traceResult.status !== "success" || system.bottleneckNodeIds.length > 0, events, path: pathIds, animationSteps: animationPlan.steps, animationEdges: animationPlan.edgeSteps, failureNodeId: resolvedFailureNodeId, failureNodeLabel: failedNode?.data.label || failedNode?.data.service?.label || "Unknown node", failureIndex, failureAffectsRequest, failureImpact: failedConfig?.flowMode || "primary", system });
    setStep(0);
    setIsPlaybackPaused(false);
    setIsRunning(true);
    setMode("simulate");
    setDrawer("simulate");
  }, [edges, effectiveSimQps, failureMode, failureNodeId, metrics, monteCarloSettings, nodes, requestScenario, selectedSimulationScenario, simulationMode, traceEntryNodeId]);

  const advancePlayback = useCallback(() => {
    if (!simResult?.animationSteps?.length || step >= simResult.animationSteps.length) return;
    const next = step + 1;
    const isFinalWave = next >= simResult.animationSteps.length;
    const activeStepIds = new Set(simResult.animationSteps[step] || []);
    const completedIds = new Set(simResult.animationSteps.slice(0, step).flat());
    setStep(next);
    setNodes((current) => current.map((node) => {
      const load = simResult.system?.nodeMetrics?.[node.id];
      const failed = node.id === simResult.failureNodeId && activeStepIds.has(node.id);
      const overloaded = load?.status === "critical" && (activeStepIds.has(node.id) || completedIds.has(node.id));
      const runtimeState = failed ? "failed" : overloaded ? "overloaded" : activeStepIds.has(node.id) ? (isFinalWave ? "complete" : "active") : completedIds.has(node.id) ? "complete" : "idle";
      return { ...node, data: { ...node.data, runtimeState, loadMetrics: load || null } };
    }));
    if (isFinalWave) { setIsRunning(false); setIsPlaybackPaused(false); }
  }, [setNodes, simResult, step]);

  useEffect(() => {
    if (!isRunning || isPlaybackPaused || !simResult?.animationSteps?.length) return undefined;
    const timer = window.setTimeout(advancePlayback, Math.round(1100 / playbackSpeed));
    return () => window.clearTimeout(timer);
  }, [advancePlayback, isPlaybackPaused, isRunning, playbackSpeed, simResult]);

  useEffect(() => {
    if (!simResult?.animationSteps?.length) return;
    const completedIds = new Set(simResult.animationSteps.slice(0, step).flat());
    const activeEdgeIds = new Set((simResult.animationEdges || []).filter((edge) => edge.step <= step).map((edge) => edge.id));
    setEdges((current) => current.map((edge) => {
      const active = activeEdgeIds.has(edge.id) || (completedIds.has(edge.source) && completedIds.has(edge.target));
      const failed = simResult.failureNodeId && (edge.source === simResult.failureNodeId || edge.target === simResult.failureNodeId);
      return {
        ...edge,
        animated: Boolean(isRunning && !isPlaybackPaused && active && !failed),
        style: { ...edge.style, stroke: failed ? "#ef4444" : active ? "#06b6d4" : edge.data?.feedback ? "#64748b" : "#8b5cf6" },
      };
    }));
  }, [isPlaybackPaused, isRunning, setEdges, simResult, step]);

  // Follow the active execution wave with React Flow's own animated viewport.
  // Using setCenter (rather than CSS transforms) keeps the minimap, handles,
  // edge paths, and user pan/zoom state coherent during playback.
  useEffect(() => {
    if (!isRunning || !followExecution || !simResult?.animationSteps?.length) {
      if (!isRunning && followedPlaybackRef.current) {
        followedPlaybackRef.current = false;
        window.setTimeout(() => reactFlow.fitView({ padding: 0.2, duration: 440 }), 180);
      }
      return undefined;
    }
    followedPlaybackRef.current = true;
    const activeIds = new Set(simResult.animationSteps[Math.max(0, step - 1)] || simResult.animationSteps[0]);
    const activeNodes = nodes.filter((node) => activeIds.has(node.id));
    if (!activeNodes.length) return undefined;
    const bounds = activeNodes.reduce((result, node) => {
      const { width, height } = nodeDimensions(node);
      return {
        minX: Math.min(result.minX, node.position.x), minY: Math.min(result.minY, node.position.y),
        maxX: Math.max(result.maxX, node.position.x + width), maxY: Math.max(result.maxY, node.position.y + height),
      };
    }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
    reactFlow.setCenter((bounds.minX + bounds.maxX) / 2, (bounds.minY + bounds.maxY) / 2, {
      zoom: activeNodes.length === 1 ? 1.16 : 0.92,
      duration: Math.round(380 / playbackSpeed),
    });
    return undefined;
  }, [followExecution, isRunning, nodes, playbackSpeed, reactFlow, simResult, step]);

  const resetRuntime = useCallback(() => { setIsRunning(false); setIsPlaybackPaused(false); setStep(0); setSimResult(null); setMonteCarloResult(null); setNodes((current) => current.map((node) => ({ ...node, data: { ...node.data, runtimeState: "idle", loadMetrics: null } }))); setEdges((current) => current.map((edge) => ({ ...edge, animated: false, style: { ...edge.style, stroke: edge.data?.feedback ? "#64748b" : "#8b5cf6" } }))); }, [setEdges, setNodes]);

  const playFlowAnimation = useCallback(() => {
    const executableNodes = nodes.filter((node) => node.type === "genaiService" || node.type === "architectureIcon");
    if (!executableNodes.length) { setNotice("Add connected components before playing the flow."); return; }
    const plan = buildAnimationPlan(executableNodes, edges, "");
    if (!plan.steps.length) { setNotice("Connect at least one component before playing the flow."); return; }
    setMonteCarloResult(null);
    setSimResult({ animationSteps: plan.steps, animationEdges: plan.edgeSteps, path: plan.steps.flat(), failureNodeId: "", failureIndex: -1, system: { nodeMetrics: {} } });
    setStep(0);
    setIsPlaybackPaused(false);
    setIsRunning(true);
    setNotice(`Playing ${plan.steps.length} execution waves across the reachable graph.`);
  }, [edges, nodes]);

  const pauseOrResumePlayback = useCallback(() => {
    if (!simResult?.animationSteps?.length || !isRunning) { playFlowAnimation(); return; }
    setIsPlaybackPaused((paused) => !paused);
    setNotice(isPlaybackPaused ? "Flow playback resumed." : "Flow playback paused. Use Next to advance one wave.");
  }, [isPlaybackPaused, isRunning, playFlowAnimation, simResult]);

  const stepPlaybackForward = useCallback(() => {
    if (!simResult?.animationSteps?.length) { setNotice("Press Play flow to begin, then use Next to advance a wave."); return; }
    if (step >= simResult.animationSteps.length) { setNotice("The flow is complete. Press Play flow to replay it."); return; }
    setIsRunning(true);
    setIsPlaybackPaused(true);
    advancePlayback();
  }, [advancePlayback, simResult, step]);

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
      const parsed = await generateFlowArchitecture(request, diagramType);
      const sourceNodes = Array.isArray(parsed?.nodes) ? parsed.nodes.slice(0, 18) : [];
      const iconOnlyRequested = componentDisplay === "icon" || /icon[- ]only|icons? (rather than|instead of|not) cards?|aws reference|azure reference/i.test(request);
      if (!sourceNodes.length) throw new Error("The AI returned no diagram objects.");
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
        if (WHITEBOARD_AI_TYPES.has(diagramType)) {
          const isActor = ["userflow", "journey"].includes(diagramType) && /user|person|customer|team|actor|owner|stakeholder/i.test(label);
          const whiteboardType = diagramType === "mindmap" && index > 0
            ? "whiteboardNote"
            : isActor
              ? "whiteboardIcon"
              : "whiteboardShape";
          const shape = diagramType === "state"
            ? "ellipse"
            : ["bpmn", "flowchart"].includes(diagramType) && /gateway|decision|approve|check|condition|branch|if|yes|no/i.test(label)
              ? "diamond"
              : ["bpmn", "flowchart"].includes(diagramType) && /start|end|finish|complete|terminal/i.test(label)
                ? "ellipse"
              : diagramType === "dataflow" && /data|input|output|source|stream/i.test(label)
                ? "parallelogram"
                : diagramType === "sequence"
                  ? "rounded"
                  : diagramType === "mindmap" && index === 0
                    ? "ellipse"
                    : diagramType === "wireframe"
                      ? "rounded"
                  : "rectangle";
          return {
            id: aiId,
            type: whiteboardType,
            position,
            style: {
              width: whiteboardType === "whiteboardIcon" ? 126 : diagramType === "erd" ? 230 : diagramType === "mindmap" && index > 0 ? 190 : 210,
              height: whiteboardType === "whiteboardIcon" ? 112 : diagramType === "mindmap" && index > 0 ? 150 : diagramType === "state" ? 90 : 110,
            },
            data: {
              label,
              subtitle: node.sub || "",
              shape,
              icon: isActor ? "User" : node.icon || "Sparkles",
              whiteboard: true,
              aiGenerated: true,
              style: { fill: index % 3 === 0 ? "#ede9fe" : index % 3 === 1 ? "#dbeafe" : "#ffffff", stroke: color, text: "#172033" },
            },
          };
        }
        return { id: aiId, type: iconOnlyRequested ? "architectureIcon" : "genaiService", position, data: { serviceId: service.id, label: service.label, service, diagramType, runtimeState: "idle", config: {}, iconOnly: iconOnlyRequested, subtitle: node.sub || "", aiGenerated: true } };
      });
      const rawGeneratedEdges = (Array.isArray(parsed.edges) ? parsed.edges : []).map((edge, index) => {
        const source = idMap.get(String(edge.source));
        const target = idMap.get(String(edge.target));
        return source && target ? { id: `ai-edge:${Date.now()}:${index}`, source, target, label: String(edge.label || edge.condition || ""), role: edge.role || edge.data?.role || "primary" } : null;
      }).filter(Boolean);
      const generatedGraph = layoutGeneratedGraph(generatedNodes, rawGeneratedEdges, diagramType);
      // A frame is a layout boundary, not a decoration. Give each node to at
      // most one meaningful region, then lay every region into its own lane so
      // groups cannot overlap even when the model returns redundant regions.
      const claimedNodeIds = new Set();
      const regions = [];
      (Array.isArray(parsed?.regions) ? parsed.regions : []).slice(0, 4).forEach((region) => {
        const memberIds = (Array.isArray(region.nodeIds) ? region.nodeIds : [])
          .map((id) => idMap.get(String(id)))
          .filter((id) => id && !claimedNodeIds.has(id));
        if (memberIds.length < 2) return;
        memberIds.forEach((id) => claimedNodeIds.add(id));
        regions.push({ ...region, memberIds });
      });
      const generatedFrames = [];
      if (regions.length) {
        let laneX = 70;
        regions.forEach((region, index) => {
          const columns = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(region.memberIds.length))));
          const rows = Math.ceil(region.memberIds.length / columns);
          const width = Math.max(310, columns * 190 + 90);
          const height = Math.max(250, rows * 150 + 115);
          region.memberIds.forEach((id, memberIndex) => {
            const node = generatedGraph.nodes.find((candidate) => candidate.id === id);
            if (node) node.position = { x: laneX + 55 + (memberIndex % columns) * 190, y: 115 + Math.floor(memberIndex / columns) * 150 };
          });
          generatedFrames.push({ id: `ai-region:${Date.now()}:${index}`, type: "whiteboardFrame", position: { x: laneX, y: 55 }, style: { width, height }, data: { label: String(region.label || `Region ${index + 1}`), subtitle: String(region.subtitle || ""), memberIds: [...region.memberIds], whiteboard: true, region: true, aiGenerated: true, style: { stroke: region.color || ["#f59e0b", "#2563eb", "#10b981", "#8b5cf6"][index % 4], fill: "transparent", text: "#172033" } } });
          laneX += width + 45;
        });
        const ungrouped = generatedGraph.nodes.filter((node) => !claimedNodeIds.has(node.id));
        ungrouped.forEach((node, index) => { node.position = { x: 90 + index * 205, y: 400 }; });
      }
      generatedGraph.nodes = [...generatedFrames, ...generatedGraph.nodes];
      const finalGraph = generatedFrames.length ? layoutRegionAwareGraph(generatedGraph.nodes, generatedGraph.edges, diagramType) : generatedGraph;
      checkpoint();
      setNodes(finalGraph.nodes);
      setEdges(finalGraph.edges);
      setProjectJson(JSON.stringify({ name: parsed.name || `AI generated ${diagramType}`, description: parsed.description || request, diagramType, nodes: finalGraph.nodes, edges: finalGraph.edges }, null, 2));
      setMode("studio");
      setDrawer("studio");
      setNotice(`Studio generated ${finalGraph.nodes.length} nodes and ${finalGraph.edges.length} readable connections from your brief.`);
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
  }, [ALL_COMPONENTS, applyPattern, brief, checkpoint, componentDisplay, diagramType, fitCanvas, isGenerating, prompt, setEdges, setNodes]);

  const applyJson = useCallback(() => {
    try {
      const parsed = normalizeFlowArchitecture(JSON.parse(projectJson), brief);
      if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) throw new Error("Expected nodes and edges arrays");
      const isGeneratedGraph = parsed.nodes.some((node) => node.data?.aiGenerated || String(node.id).startsWith("ai:"));
      const nextGraph = isGeneratedGraph ? layoutGeneratedGraph(parsed.nodes, parsed.edges, parsed.diagramType || diagramType) : { nodes: parsed.nodes, edges: parsed.edges };
      checkpoint();
      setNodes(nextGraph.nodes);
      setEdges(normalizeReactFlowEdges(nextGraph.edges));
      if (parsed.brief) setBrief(parsed.brief);
      if (parsed.diagramType) setDiagramType(parsed.diagramType);
      setNotice("JSON applied successfully.");
    } catch (error) { setNotice(`Could not apply JSON: ${error.message}`); }
  }, [brief, checkpoint, diagramType, projectJson, setEdges, setNodes]);

  const exportProject = useCallback(() => {
    const payload = { version: "genai-playground-2.0", brief, diagramType, nodes, edges, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "genai-playground-2-board.json"; link.click(); URL.revokeObjectURL(link.href);
  }, [brief, diagramType, edges, nodes]);

  const exportImage = useCallback(async (format = "png") => {
    const element = canvasRef.current?.querySelector(".react-flow");
    if (!element) return;
    try {
      const image = await import("html-to-image");
      const dataUrl = format === "svg"
        ? await image.toSvg(element, { backgroundColor: visualTheme === "dark" ? "#0f1117" : "#f7f8fb" })
        : await image.toPng(element, { backgroundColor: visualTheme === "dark" ? "#0f1117" : "#f7f8fb", pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `genai-playground-2-whiteboard.${format}`;
      link.href = dataUrl;
      link.click();
      setNotice(`${format.toUpperCase()} exported successfully.`);
    } catch (error) { setNotice(`Could not export ${format.toUpperCase()}: ${error.message}`); }
  }, [visualTheme]);

  const selectCanvasNode = useCallback((nodeId) => {
    setSelectedNodeId(nodeId);
    setDrawer("inspect");
  }, []);

  const canvasNodes = useMemo(() => nodes.map((node) => ({
    ...node,
    selected: node.id === selectedNodeId,
    data: {
      ...node.data,
      onTextChange: updateWhiteboardText,
      onHistory: checkpoint,
      onSelect: selectCanvasNode,
    },
  })), [checkpoint, nodes, selectCanvasNode, selectedNodeId, updateWhiteboardText]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable) return;
      const command = event.metaKey || event.ctrlKey;
      if (command && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? redo() : undo(); return; }
      if (command && event.key.toLowerCase() === "y") { event.preventDefault(); redo(); return; }
      if (command && event.key.toLowerCase() === "d") { event.preventDefault(); duplicateSelected(); return; }
      if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); deleteSelected(); return; }
      if (event.key.toLowerCase() === "v" || event.key === "Escape") setToolMode("select");
      if (event.key.toLowerCase() === "p") setToolMode("pen");
      if (event.key.toLowerCase() === "e") setToolMode("eraser");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteSelected, duplicateSelected, redo, undo]);

  const openMode = (nextMode) => { setShowHome(false); setMode(nextMode); setDrawer(nextMode === "design" ? null : nextMode); if (nextMode === "simulate") runSimulation(); };
  const openHome = () => { setShowHome(true); setMode("home"); setDrawer(null); setSelectedNodeId(null); };
  const openStudioFromHome = () => { setShowHome(false); setMode("studio"); setDrawer("studio"); };
  const openBlankCanvas = () => { checkpoint(); setShowHome(false); setMode("design"); setDrawer(null); setSelectedNodeId(null); setDiagramType("architecture"); setNodes([]); setEdges([]); setProjectJson(JSON.stringify({ brief, diagramType: "architecture", nodes: [], edges: [] }, null, 2)); setNotice("Blank canvas ready. Open Whiteboard tools for shapes and ink, drag a component, or ask Studio."); };
  const openRailTab = (nextTab) => {
    setRailTab(nextTab);
    if (mode === "studio") setMode("design");
    if (drawer === "studio") setDrawer(null);
  };

  return <div className={`g2-shell theme-${visualTheme}`}>
    <header className="g2-topbar">
      <button className="g2-brand g2-brand-button" onClick={openHome}><span className="g2-brand-mark"><Sparkles size={16} /></span><span><strong>Gen AI Playground <span>2.0</span></strong><small>AI whiteboard · visual systems studio</small></span></button>
      <div className="g2-phase-tabs" role="tablist">{[["design", Layers3, "Design"], ["studio", Sparkles, "Studio"], ["simulate", Activity, "Simulate"], ["review", Target, "Review"], ["challenge", Lightbulb, "Challenge"]].map(([id, Icon, label]) => <button key={id} className={mode === id ? "active" : ""} onClick={() => openMode(id)}><Icon size={14} />{label}</button>)}</div>
      <div className="g2-top-actions"><span className="g2-saved"><CheckCircle2 size={13} /> autosaved</span><button className="g2-theme-btn" type="button" onClick={() => setVisualTheme((current) => current === "dark" ? "light" : "dark")} title={`Switch to ${visualTheme === "dark" ? "light" : "dark"} mode`}>{visualTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}<span>{visualTheme === "dark" ? "Light" : "Dark"}</span></button><button className="g2-icon-btn" onClick={exportProject} title="Export board"><Download size={15} /></button><button className="g2-close-btn" onClick={onClose}><ArrowLeft size={15} /> Exit</button></div>
    </header>
    {showHome ? <PlaygroundHome patterns={PATTERNS} templates={LEGACY_TEMPLATES} onStudio={openStudioFromHome} onDesign={openBlankCanvas} onPattern={(patternId) => { applyPattern(patternId); setShowHome(false); }} onTemplate={(templateId) => { applyLegacyTemplate(templateId); setShowHome(false); }} /> : <div className="g2-workspace">
      <aside className={`g2-rail ${railTab === "collapsed" ? "is-collapsed" : ""}`}>
        <div className="g2-rail-tabs"><button className={railTab === "components" ? "active" : ""} onClick={() => openRailTab("components")} title="Components"><Layers3 size={16} /></button><button className={railTab === "tools" ? "active" : ""} onClick={() => openRailTab("tools")} title="Whiteboard tools"><Shapes size={16} /></button><button className={railTab === "diagrams" ? "active" : ""} onClick={() => openRailTab("diagrams")} title="Diagram types"><Table2 size={16} /></button><button className={railTab === "patterns" ? "active" : ""} onClick={() => openRailTab("patterns")} title="Patterns"><Workflow size={16} /></button><button className={railTab === "templates" ? "active" : ""} onClick={() => openRailTab("templates")} title="Existing templates"><LayoutTemplate size={16} /></button><button className={railTab === "brief" ? "active" : ""} onClick={() => openRailTab("brief")} title="Brief"><FileJson size={16} /></button></div>
        {railTab !== "collapsed" && <div className="g2-rail-body">
          {railTab === "diagrams" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">DIAGRAM LANGUAGE</span><h3>Choose a view</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><p className="g2-muted">Every view uses the same editable canvas, connectors, playback, and export pipeline.</p><div className="g2-diagram-type-list">{DIAGRAM_TYPES.map((item) => <button key={item.id} className={`g2-diagram-type ${diagramType === item.id ? "active" : ""}`} onClick={() => applyDiagramType(item.id)}><span><strong>{item.label}</strong><small>{item.description}</small></span><ChevronRight size={14} /></button>)}</div><div className="g2-section-label">Starter views</div><div className="g2-pattern-list">{DIAGRAM_TEMPLATES.map((template) => <button key={template.id} className="g2-pattern-card" onClick={() => applyDiagramTemplate(template.id)}><span className="g2-pattern-icon"><LayoutTemplate size={16} /></span><span><strong>{template.label}</strong><small>{template.description}</small></span><ChevronRight size={14} /></button>)}</div></>}
          {railTab === "components" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">BUILDING BLOCKS</span><h3>Components</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><div className="g2-component-display" role="group" aria-label="Component appearance"><button className={componentDisplay === "card" ? "active" : ""} onClick={() => setComponentDisplay("card")}><RectangleHorizontal size={14} /> Cards</button><button className={componentDisplay === "icon" ? "active" : ""} onClick={() => setComponentDisplay("icon")}><Sparkles size={14} /> Icons only</button></div><p className="g2-muted">Icon-only components keep the provider mark, label, and connectors without a surrounding card.</p><div className="g2-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services" /></div><div className="g2-category-scroll">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="g2-service-list">{filteredServices.map((service) => <button key={service.id} className="g2-service-item" draggable onDragStart={(event) => { event.dataTransfer.setData("application/genai-service", service.id); event.dataTransfer.setData("application/genai-service-display", componentDisplay); event.dataTransfer.effectAllowed = "copy"; }} onClick={() => addService(service.id, componentDisplay)} title={`Add ${componentDisplay === "icon" ? "icon-only " : ""}${service.label}`}><span className="g2-service-img" style={{ "--service-color": service.color }}><ServiceIcon service={service} size={22} /></span><span><strong>{service.label}</strong><small>{service.provider} · {service.kind}</small></span><Plus size={13} /></button>)}</div></>}
          {railTab === "tools" && <div className="g2-wb-tools">
            <div className="g2-rail-heading"><div><span className="g2-drawer-kicker">CREATE / WHITEBOARD</span><h3>Tools</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div>
            <p className="g2-muted">Sketch freely, build with shapes, or ask AI to assemble the board.</p>
            <div className="g2-wb-mode-grid">
              {[["select", MousePointer2, "Select", "V"], ["hand", Hand, "Pan", "H"], ["pen", PenLine, "Pen", "P"], ["eraser", Eraser, "Erase", "E"]].map(([id, Icon, label, key]) => <button key={id} className={toolMode === id ? "active" : ""} onClick={() => setToolMode(id)} title={`${label} (${key})`}><Icon size={15} /><span>{label}</span><kbd>{key}</kbd></button>)}
            </div>
            {toolMode === "pen" && <div className="g2-wb-pen-options"><label><span>Ink</span><input type="color" value={penColor} onChange={(event) => setPenColor(event.target.value)} /></label><label><span>Width</span><input type="range" min="1" max="12" value={penWidth} onChange={(event) => setPenWidth(Number(event.target.value))} /><b>{penWidth}</b></label></div>}
            <div className="g2-section-label">Quick add</div>
            <div className="g2-wb-quick-grid">
              {[
                { type: "whiteboardNote", label: "Sticky note", icon: StickyNote },
                { type: "whiteboardText", label: "Text", icon: Type },
                { type: "whiteboardFrame", label: "Frame", icon: Frame },
                { type: "whiteboardIcon", label: "Icon card", icon: Lightbulb, itemIcon: "Lightbulb" },
              ].map((item) => <button key={item.label} draggable onDragStart={(event) => { event.dataTransfer.setData("application/genai-whiteboard", JSON.stringify({ type: item.type, label: item.label, icon: item.itemIcon })); event.dataTransfer.effectAllowed = "copy"; }} onClick={() => addWhiteboardItem({ type: item.type, label: item.label, icon: item.itemIcon })}><item.icon size={16} /><span>{item.label}</span></button>)}
            </div>
            <div className="g2-section-label">Shapes</div>
            <div className="g2-wb-shape-grid">{WHITEBOARD_SHAPES.map((shape) => <button key={shape.id} draggable onDragStart={(event) => { event.dataTransfer.setData("application/genai-whiteboard", JSON.stringify({ type: "whiteboardShape", shape: shape.id, label: shape.label })); event.dataTransfer.effectAllowed = "copy"; }} onClick={() => addWhiteboardItem({ type: "whiteboardShape", shape: shape.id, label: shape.label })} title={`Add ${shape.label}`}><shape.icon size={19} /><span>{shape.label}</span></button>)}</div>
            <div className="g2-section-label">Icon cards</div>
            <div className="g2-wb-icon-grid">{WHITEBOARD_ICONS.map(([icon, label]) => <button key={icon} draggable onDragStart={(event) => { event.dataTransfer.setData("application/genai-whiteboard", JSON.stringify({ type: "whiteboardIcon", icon, label })); event.dataTransfer.effectAllowed = "copy"; }} onClick={() => addWhiteboardItem({ type: "whiteboardIcon", icon, label })} title={label}>{(() => { const Icon = FALLBACK_ICONS[icon] || Lightbulb; return <Icon size={16} />; })()}</button>)}</div>
            <div className="g2-section-label">Brainstorm boards</div>
            <div className="g2-wb-template-list"><button onClick={() => applyBrainstormTemplate("mindmap")}><Lightbulb size={15} /><span><strong>Mind map</strong><small>Explore one idea radially</small></span></button><button onClick={() => applyBrainstormTemplate("swot")}><Target size={15} /><span><strong>SWOT board</strong><small>Strengths through threats</small></span></button><button onClick={() => applyBrainstormTemplate("retro")}><Users size={15} /><span><strong>Retrospective</strong><small>Reflect and assign actions</small></span></button></div>
            <button className="g2-wb-ai-button" onClick={() => { setMode("studio"); setDrawer("studio"); }}><Sparkles size={15} /><span><strong>Create with AI</strong><small>AI can use cards and shapes too</small></span><ChevronRight size={14} /></button>
          </div>}
          {railTab === "patterns" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">FLOW DESIGN PATTERNS</span><h3>Start with intent</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><p className="g2-muted">Patterns are editable starting points, not locked templates.</p><div className="g2-pattern-list">{PATTERNS.map((pattern) => <button key={pattern.id} className="g2-pattern-card" onClick={() => applyPattern(pattern.id)}><span className="g2-pattern-icon"><Workflow size={16} /></span><span><strong>{pattern.label}</strong><small>{pattern.description}</small></span><ChevronRight size={14} /></button>)}</div><div className="g2-rail-tip"><Lightbulb size={15} /><span>Good architecture answers are paths, controls, and trade-offs.</span></div></>}
          {railTab === "templates" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">ORIGINAL GENAI PLAYGROUND</span><h3>Templates</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><p className="g2-muted">All existing GenAI Playground templates are available here with their original nodes and connections.</p><div className="g2-pattern-list">{LEGACY_TEMPLATES.map((template) => <button key={template.id} className="g2-pattern-card" onClick={() => applyLegacyTemplate(template.id)}><span className="g2-pattern-icon"><LayoutTemplate size={16} /></span><span><strong>{template.label}</strong><small>{template.description || `${template.nodes.length} nodes · ${template.edges.length} connections`}</small></span><ChevronRight size={14} /></button>)}</div></>}
          {railTab === "brief" && <><div className="g2-rail-heading"><div><span className="g2-drawer-kicker">DESIGN BRIEF</span><h3>What are we solving?</h3></div><button className="g2-icon-btn" onClick={() => setRailTab("collapsed")} title="Collapse rail"><PanelLeftClose size={15} /></button></div><textarea className="g2-brief-textarea" value={brief} onChange={(event) => setBrief(event.target.value)} /><div className="g2-section-label">GenAI lifecycle</div>{["Scope", "Select model", "Customize", "Integrate", "Deploy", "Improve"].map((item, index) => <div className={`g2-lifecycle ${index < 3 ? "done" : ""}`} key={item}><span>{index < 3 ? <Check size={12} /> : index + 1}</span>{item}<small>{index < 3 ? "covered" : "next"}</small></div>)}<div className="g2-rail-tip"><MessageSquare size={15} /><span>Keep the brief visible while you design so every component has a job.</span></div></>}
        </div>}
        {railTab === "collapsed" && <button className="g2-rail-expand" onClick={() => setRailTab("components")} title="Expand rail"><PanelLeftOpen size={16} /></button>}
      </aside>
      <main className="g2-canvas-wrap">
        <div className="g2-canvas-toolbar">
          <div><span className="g2-breadcrumb">PLAYGROUND / 2.0 /</span><strong>{DIAGRAM_TYPES.find((item) => item.id === diagramType)?.label || "Architecture"} workspace</strong></div>
          <div className="g2-canvas-tools">
            <span className="g2-notice"><CircleDot size={11} /> {notice}</span>
            <button type="button" className={`g2-secondary-btn compact ${isRunning && !isPlaybackPaused ? "is-playing" : ""}`} onClick={pauseOrResumePlayback} title={isRunning && !isPlaybackPaused ? "Pause flow playback" : "Play or resume flow playback"}>{isRunning && !isPlaybackPaused ? <Pause size={13} /> : <Play size={13} />}{isRunning && !isPlaybackPaused ? "Pause" : "Play flow"}</button>
            <button type="button" className="g2-secondary-btn compact" onClick={stepPlaybackForward} disabled={!simResult?.animationSteps?.length || step >= (simResult?.animationSteps?.length || 0)} title="Advance one execution wave"><ChevronRight size={15} /> Next</button>
            <button type="button" className="g2-secondary-btn compact danger" onClick={resetRuntime} disabled={!simResult?.animationSteps?.length && !isRunning} title="Stop and reset flow playback"><Square size={11} /> Stop</button>
            <button type="button" className="g2-secondary-btn compact g2-speed-btn" onClick={() => setPlaybackSpeed((speed) => speed === 0.5 ? 0.75 : speed === 0.75 ? 1 : 0.5)} title="Cycle flow animation speed">{playbackSpeed}×</button>
            <button type="button" className={`g2-secondary-btn compact ${followExecution ? "is-playing" : ""}`} onClick={() => setFollowExecution((value) => !value)} title="Follow the active node with animated zoom"><Maximize2 size={13} /> Follow</button>
            <button type="button" className="g2-secondary-btn compact" onClick={runSimulation} title="Open detailed trace and Monte Carlo simulation"><Activity size={13} /> Simulate</button>
            <button type="button" className="g2-secondary-btn compact" onClick={autoArrange} title="Auto layout"><Wand2 size={13} /> Arrange</button>
            <button type="button" className="g2-secondary-btn compact" onClick={fitCanvas} title="Fit canvas"><Maximize2 size={13} /></button>
            <button type="button" className="g2-secondary-btn compact" onClick={() => exportImage("png")} title="Export PNG"><Download size={13} /> PNG</button>
            <button type="button" className="g2-secondary-btn compact" onClick={() => importInputRef.current?.click()} title="Import JSON"><FileUp size={13} /></button>
            <button type="button" className="g2-secondary-btn compact" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setMode("studio"); setDrawer("studio"); }}><Sparkles size={13} /> Ask Studio</button>
            <input ref={importInputRef} type="file" accept="application/json,.json" onChange={importProject} hidden />
          </div>
        </div>
        <div ref={canvasRef} className={`g2-flow-stage tool-${toolMode}`}>
          <ReactFlow
            nodes={canvasNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeDragStart={onNodeDragStart}
            onNodeDragStop={onNodeDragStop}
            connectionLineType={ConnectionLineType.Bezier}
            connectionLineStyle={{ stroke: "#64748b", strokeWidth: 1.5, strokeLinecap: "round" }}
            defaultEdgeOptions={{ type: "default", pathOptions: { curvature: 0.28 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" }, style: { stroke: "#64748b", strokeWidth: 1.5, strokeLinecap: "round" } }}
            onNodeClick={(_, node) => { if (toolMode === "eraser") { eraseAt(node.position); return; } setSelectedNodeId(node.id); setDrawer("inspect"); }}
            onPaneClick={() => { setSelectedNodeId(null); if (mode === "design") setDrawer(null); }}
            nodesDraggable={toolMode !== "hand" && toolMode !== "pen" && toolMode !== "eraser"}
            elementsSelectable={toolMode !== "hand" && toolMode !== "pen" && toolMode !== "eraser"}
            panOnDrag={toolMode === "hand" || toolMode === "select"}
            nodeTypes={nodeTypes}
            minZoom={0.05}
            maxZoom={2.4}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#94a3b855" />
            <Controls showInteractive={false} />
            <MiniMap nodeColor={(node) => node.data?.service?.color || node.data?.style?.fill || "#8b5cf6"} maskColor="rgba(2, 6, 23, .62)" />
            <Panel position="bottom-left" className="g2-canvas-legend"><span><i className="dot source" />experience</span><span><i className="dot path" />data & flow</span><span><i className="dot safety" />safety boundary</span></Panel>
          </ReactFlow>
          {(toolMode === "pen" || toolMode === "eraser") && <svg className="g2-ink-overlay" onPointerDown={onInkPointerDown} onPointerMove={onInkPointerMove} onPointerUp={finishInk} onPointerCancel={finishInk}>
            {drawDraft.length > 1 && <polyline points={drawDraft.map((point) => `${point.screen.x},${point.screen.y}`).join(" ")} fill="none" stroke={penColor} strokeWidth={penWidth} strokeLinecap="round" strokeLinejoin="round" />}
          </svg>}
          <div className="g2-selection-bar">
            <button onClick={undo} disabled={!historyRef.current.length} title="Undo (⌘Z)"><Undo2 size={14} /></button>
            <button onClick={redo} disabled={!futureRef.current.length} title="Redo (⌘⇧Z)"><Redo2 size={14} /></button>
            <i />
            <button onClick={duplicateSelected} disabled={!selectedNodeId} title="Duplicate (⌘D)"><Copy size={14} /></button>
            <button onClick={() => changeLayer("front")} disabled={!selectedNodeId} title="Bring to front"><BringToFront size={14} /></button>
            <button onClick={() => changeLayer("back")} disabled={!selectedNodeId} title="Send to back"><SendToBack size={14} /></button>
            <button onClick={deleteSelected} disabled={!selectedNodeId} className="danger" title="Delete"><Trash2 size={14} /></button>
            <i />
            <button onClick={() => exportImage("svg")} title="Export SVG"><Download size={14} /><span>SVG</span></button>
            <button onClick={clearCanvas} className="danger" title="Clear board"><Eraser size={14} /><span>Clear</span></button>
          </div>
        </div>
      </main>
      {drawer && <aside className="g2-drawer"><div className="g2-drawer-head"><span>{drawer === "inspect" ? "Inspector" : drawer[0].toUpperCase() + drawer.slice(1)}</span><button className="g2-icon-btn" onClick={() => setDrawer(null)} title="Close panel"><X size={16} /></button></div>{drawer === "studio" && <StudioDrawer prompt={prompt} setPrompt={setPrompt} onGenerate={generateFromPrompt} onApplyJson={applyJson} projectJson={projectJson || JSON.stringify({ brief, diagramType, nodes, edges }, null, 2)} setProjectJson={setProjectJson} isGenerating={isGenerating} studioError={studioError} diagramType={diagramType} componentDisplay={componentDisplay} setComponentDisplay={setComponentDisplay} />}{drawer === "simulate" && <SimulationDrawer simQps={simQps} setSimQps={setSimQps} simulationScenario={simulationScenario} setSimulationScenario={setSimulationScenario} effectiveSimQps={effectiveSimQps} simulationMode={simulationMode} setSimulationMode={setSimulationMode} requestScenario={requestScenario} setRequestScenario={setRequestScenario} traceEntryNodeId={traceEntryNodeId} setTraceEntryNodeId={setTraceEntryNodeId} monteCarloSettings={monteCarloSettings} setMonteCarloSettings={setMonteCarloSettings} failureMode={failureMode} setFailureMode={setFailureMode} failureNodeId={failureNodeId} setFailureNodeId={setFailureNodeId} nodes={nodes} capacitySettings={capacitySettings} setCapacitySettings={setCapacitySettings} capacityEstimate={capacityEstimate} simResult={simResult} monteCarloResult={monteCarloResult} isRunning={isRunning} step={step} onRun={runSimulation} onReset={resetRuntime} />}{drawer === "review" && <ReviewDrawer reviewScore={reviewScore} reviewRows={reviewRows} onFocus={focusNode} />}{drawer === "challenge" && <ChallengeDrawer challenge={challenge} challenges={challengeCatalog} challengeScore={challengeScore} onSelectChallenge={selectChallenge} onLoadReference={loadChallengeReference} onFocus={focusNode} />}{drawer === "inspect" && <InspectorDrawer selectedNode={selectedNode} onUpdate={updateNodeConfig} onDelete={deleteSelected} onClose={() => setDrawer(null)} />}</aside>}
    </div>}
  </div>;
}

export default function GenAIPlayground2(props) {
  return <ReactFlowProvider><GenAIPlayground2Canvas {...props} /></ReactFlowProvider>;
}
