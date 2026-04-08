// System Design Simulator — Traffic Simulation Engine
// Ported from vijaygupta18/system-design-simulator (simulator.ts)

const UTILIZATION_WARNING  = 0.7;
const UTILIZATION_CRITICAL = 0.9;
const LATENCY_SPIKE_THRESHOLD  = 0.8;
const LATENCY_SPIKE_MULTIPLIER = 3.0;

const LOAD_BALANCING_COMPONENTS = new Set(["load-balancer", "api-gateway"]);

function getStatus(utilization) {
  if (utilization > UTILIZATION_CRITICAL) return "critical";
  if (utilization > UTILIZATION_WARNING)  return "warning";
  return "healthy";
}

function computeLatency(baseLatency, utilization) {
  if (utilization > LATENCY_SPIKE_THRESHOLD) {
    return baseLatency * (1 + Math.max(0, utilization - LATENCY_SPIKE_THRESHOLD) * LATENCY_SPIKE_MULTIPLIER);
  }
  return baseLatency;
}

export function runSimulation(nodes, edges, requestsPerSec) {
  const warnings = [];
  const nodeMetrics = new Map();
  const adjacency   = new Map();
  const inDegree    = new Map();

  for (const node of nodes) {
    adjacency.set(node.id, []);
    inDegree.set(node.id, 0);
  }
  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  const entryNodes = nodes.filter(n => (inDegree.get(n.id) ?? 0) === 0);
  const incomingQPS = new Map();
  const qpsPerEntry = entryNodes.length > 0 ? requestsPerSec / entryNodes.length : 0;
  for (const entry of entryNodes) incomingQPS.set(entry.id, qpsPerEntry);

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const remaining = new Map(inDegree);
  const queue = [];
  const bottleneckNodes = [];
  const processed = new Set();

  for (const entry of entryNodes) queue.push(entry.id);

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (processed.has(nodeId)) continue;
    processed.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node) continue;

    const incoming    = incomingQPS.get(nodeId) ?? 0;
    const replicas    = node.replicas ?? 1;
    const maxQPS      = node.maxQPS ?? 10000;
    const effectiveQPS = maxQPS * replicas;
    const utilization  = (effectiveQPS === 0 || effectiveQPS === Infinity) ? 0 : incoming / effectiveQPS;
    const latency      = computeLatency(node.latencyMs ?? 10, utilization);
    const status       = getStatus(utilization);
    const isBottleneck = utilization > UTILIZATION_CRITICAL;

    if (isBottleneck) bottleneckNodes.push(nodeId);

    nodeMetrics.set(nodeId, {
      nodeId,
      incomingQPS: Math.round(incoming),
      effectiveQPS,
      utilization: Math.min(utilization, 2),
      latencyMs: Math.round(latency),
      status,
      isBottleneck,
    });

    const children  = adjacency.get(nodeId) ?? [];
    const outputQPS = Math.min(incoming, effectiveQPS);
    const isSplitter = LOAD_BALANCING_COMPONENTS.has(node.componentId);

    for (const childId of children) {
      const qpsToChild = (isSplitter && children.length > 0)
        ? outputQPS / children.length
        : outputQPS;
      incomingQPS.set(childId, (incomingQPS.get(childId) ?? 0) + qpsToChild);
      const newDeg = (remaining.get(childId) ?? 1) - 1;
      remaining.set(childId, newDeg);
      if (newDeg === 0) queue.push(childId);
    }
  }

  // Cycle detection
  const cycleNodes = [];
  for (const node of nodes) {
    if (!processed.has(node.id) && (inDegree.get(node.id) ?? 0) > 0) {
      cycleNodes.push(node.id);
    }
  }
  if (cycleNodes.length > 0) {
    warnings.push(`Cycle detected involving: ${cycleNodes.join(", ")}. Processing with accumulated QPS.`);
    for (const nodeId of cycleNodes) {
      if (nodeMetrics.has(nodeId)) continue;
      const node = nodeMap.get(nodeId);
      if (!node) continue;
      const incoming = incomingQPS.get(nodeId) ?? 0;
      const replicas = node.replicas ?? 1;
      const effectiveQPS = (node.maxQPS ?? 10000) * replicas;
      const utilization = (effectiveQPS === 0) ? 0 : incoming / effectiveQPS;
      nodeMetrics.set(nodeId, {
        nodeId, incomingQPS: Math.round(incoming), effectiveQPS,
        utilization: Math.min(utilization, 2),
        latencyMs: Math.round(computeLatency(node.latencyMs ?? 10, utilization)),
        status: getStatus(utilization),
        isBottleneck: utilization > UTILIZATION_CRITICAL,
      });
    }
  }

  // Idle nodes
  for (const node of nodes) {
    if (!nodeMetrics.has(node.id)) {
      nodeMetrics.set(node.id, {
        nodeId: node.id, incomingQPS: 0, effectiveQPS: (node.maxQPS ?? 10000) * (node.replicas ?? 1),
        utilization: 0, latencyMs: node.latencyMs ?? 10, status: "idle", isBottleneck: false,
      });
    }
  }

  const totalLatencyMs = computeLongestPathLatency(nodes, adjacency, inDegree, nodeMetrics);
  const throughput = nodes.length === 0 ? 0
    : bottleneckNodes.length > 0
      ? Math.min(...bottleneckNodes.map(id => nodeMetrics.get(id)?.effectiveQPS ?? 0))
      : requestsPerSec;

  return { nodeMetrics, totalLatencyMs, bottleneckNodes, throughput, timestamp: Date.now(), warnings };
}

function computeLongestPathLatency(nodes, adjacency, inDegree, metrics) {
  if (nodes.length === 0) return 0;
  const remaining  = new Map(inDegree);
  const dist       = new Map();
  const entryNodes = nodes.filter(n => (inDegree.get(n.id) ?? 0) === 0);
  for (const entry of entryNodes) dist.set(entry.id, metrics.get(entry.id)?.latencyMs ?? 0);

  const queue    = [...entryNodes.map(n => n.id)];
  const processed = new Set();

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (processed.has(nodeId)) continue;
    processed.add(nodeId);
    const currentDist = dist.get(nodeId) ?? 0;
    for (const childId of (adjacency.get(nodeId) ?? [])) {
      const childLatency = metrics.get(childId)?.latencyMs ?? 0;
      const newDist = currentDist + childLatency;
      if (newDist > (dist.get(childId) ?? 0)) dist.set(childId, newDist);
      const newDeg = (remaining.get(childId) ?? 1) - 1;
      remaining.set(childId, newDeg);
      if (newDeg === 0) queue.push(childId);
    }
  }
  return Math.max(0, ...dist.values());
}

// ── Scoring Engine ────────────────────────────────────────────────────────────

export function scoreDesign(nodes, edges, problem, nodeMetrics) {
  const componentIds = new Set(nodes.map(n => n.componentId));
  const scores = {};
  let total = 0;

  // 1. Scalability (20 pts)
  const hasLB  = componentIds.has("load-balancer");
  const hasCache = componentIds.has("cache");
  const hasQueue = componentIds.has("message-queue") || componentIds.has("pub-sub");
  const scalableScore = (hasLB ? 8 : 0) + (hasCache ? 6 : 0) + (hasQueue ? 6 : 0);
  scores.scalability = Math.min(20, scalableScore);
  total += scores.scalability;

  // 2. Reliability (20 pts)
  const hasMonitoring = componentIds.has("monitoring");
  const hasCB   = componentIds.has("circuit-breaker");
  const hasAuth  = componentIds.has("auth-service");
  const reliabilityScore = (hasMonitoring ? 8 : 0) + (hasCB ? 6 : 0) + (hasAuth ? 6 : 0);
  scores.reliability = Math.min(20, reliabilityScore);
  total += scores.reliability;

  // 3. Performance (20 pts)
  const bottleneckPct  = nodeMetrics.size > 0
    ? [...nodeMetrics.values()].filter(m => m.isBottleneck).length / nodeMetrics.size
    : 0;
  const perfScore = Math.round(20 * (1 - bottleneckPct));
  scores.performance = Math.max(0, perfScore);
  total += scores.performance;

  // 4. Component Coverage (20 pts)
  const refIds = new Set((problem?.referenceSolution?.nodes || []).map(n => n.componentId));
  const matched = [...refIds].filter(id => componentIds.has(id)).length;
  const coverageScore = refIds.size > 0 ? Math.round((matched / refIds.size) * 20) : 10;
  scores.coverage = coverageScore;
  total += scores.coverage;

  // 5. Connections (20 pts)
  const isolated = nodes.filter(n => {
    const hasIncoming = edges.some(e => e.target === n.id);
    const hasOutgoing = edges.some(e => e.source === n.id);
    return !hasIncoming && !hasOutgoing;
  }).length;
  const connectionScore = nodes.length > 1
    ? Math.round(20 * Math.max(0, 1 - (isolated / nodes.length)))
    : (nodes.length === 1 ? 10 : 0);
  scores.connections = connectionScore;
  total += scores.connections;

  const verdict =
    total >= 86 ? "Architect Level 🏆" :
    total >= 71 ? "Excellent 🌟" :
    total >= 51 ? "Good 👍" :
    total >= 31 ? "Decent 📈" :
    "Needs Work 🔨";

  return { scores, total, verdict };
}
