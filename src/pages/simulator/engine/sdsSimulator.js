// System Design Simulator — Traffic Simulation Engine
// Ported from vijaygupta18/system-design-simulator (simulator.ts)

const UTILIZATION_WARNING  = 0.7;
const UTILIZATION_CRITICAL = 0.9;
const LATENCY_SPIKE_THRESHOLD  = 0.8;
const LATENCY_SPIKE_MULTIPLIER = 3.0;

const LOAD_BALANCING_COMPONENTS = new Set(["load-balancer", "api-gateway"]);
const TELEMETRY_COMPONENTS = new Set(["monitoring"]);
const ASYNC_COMPONENTS = new Set(["message-queue", "pub-sub", "task-scheduler"]);

// A diagram can contain several kinds of traffic. User requests are
// synchronous, while metrics/logs/traces and queued work are side channels.
// Keeping this distinction in the engine prevents an observability edge from
// accidentally becoming the last request-processing bottleneck.
function getFlowMode(node) {
  if (node?.flowMode) return node.flowMode;
  if (TELEMETRY_COMPONENTS.has(node?.componentId)) return "telemetry";
  if (ASYNC_COMPONENTS.has(node?.componentId)) return "async";
  return "primary";
}

function getSampleRate(node) {
  const value = Number(node?.sampleRate ?? 0.02);
  return Math.min(1, Math.max(0.001, Number.isFinite(value) ? value : 0.02));
}

function isPrimaryNode(node) {
  return getFlowMode(node) === "primary";
}

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
  const executionOrder = [];

  for (const entry of entryNodes) queue.push(entry.id);

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (processed.has(nodeId)) continue;
    processed.add(nodeId);
    executionOrder.push(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node) continue;

    const rawIncoming = incomingQPS.get(nodeId) ?? 0;
    const flowMode    = getFlowMode(node);
    const sampleRate  = flowMode === "telemetry" ? getSampleRate(node) : 1;
    const incoming    = rawIncoming * sampleRate;
    const replicas    = node.replicas ?? 1;
    const maxQPS      = node.maxQPS ?? 10000;
    const effectiveQPS = maxQPS * replicas;
    const utilization  = (effectiveQPS === 0 || effectiveQPS === Infinity) ? 0 : incoming / effectiveQPS;
    const latency      = computeLatency(node.latencyMs ?? 10, utilization);
    const status       = getStatus(utilization);
    const isCritical = utilization > UTILIZATION_CRITICAL;
    // Telemetry can be unhealthy without reducing user-request throughput.
    // Only synchronous primary-path nodes are capacity bottlenecks.
    const isBottleneck = isCritical && isPrimaryNode(node);

    if (isBottleneck) bottleneckNodes.push(nodeId);

    nodeMetrics.set(nodeId, {
      nodeId,
      flowMode,
      rawIncomingQPS: Math.round(rawIncoming),
      sampleRate,
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

    // Telemetry is a terminal side channel by default. It records health and
    // load but does not turn its own output into another synchronous hop.
    if (flowMode === "telemetry") {
      continue;
    }

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
      const rawIncoming = incomingQPS.get(nodeId) ?? 0;
      const flowMode = getFlowMode(node);
      const sampleRate = flowMode === "telemetry" ? getSampleRate(node) : 1;
      const incoming = rawIncoming * sampleRate;
      const replicas = node.replicas ?? 1;
      const effectiveQPS = (node.maxQPS ?? 10000) * replicas;
      const utilization = (effectiveQPS === 0) ? 0 : incoming / effectiveQPS;
      nodeMetrics.set(nodeId, {
        nodeId, incomingQPS: Math.round(incoming), rawIncomingQPS: Math.round(rawIncoming), sampleRate, flowMode, effectiveQPS,
        utilization: Math.min(utilization, 2),
        latencyMs: Math.round(computeLatency(node.latencyMs ?? 10, utilization)),
        status: getStatus(utilization),
        isBottleneck: utilization > UTILIZATION_CRITICAL && isPrimaryNode(node),
      });
    }
  }

  // Idle nodes
  for (const node of nodes) {
    if (!nodeMetrics.has(node.id)) {
      nodeMetrics.set(node.id, {
        nodeId: node.id, incomingQPS: 0, effectiveQPS: (node.maxQPS ?? 10000) * (node.replicas ?? 1),
        utilization: 0, latencyMs: node.latencyMs ?? 10, status: "idle", isBottleneck: false,
        flowMode: getFlowMode(node), rawIncomingQPS: 0, sampleRate: getFlowMode(node) === "telemetry" ? getSampleRate(node) : 1,
      });
    }
  }

  const telemetryNodes = nodes.filter((node) => getFlowMode(node) === "telemetry");
  if (telemetryNodes.length > 0) {
    const rates = [...new Set(telemetryNodes.map(getSampleRate))].sort((a, b) => a - b);
    warnings.push(`Telemetry is asynchronous and sampled at ${Math.round((rates[0] ?? 0.02) * 100)}%; it is excluded from request latency and throughput.`);
  }

  const totalLatencyMs = computeLongestPathLatency(nodes, adjacency, inDegree, nodeMetrics);
  const primaryExecutionOrder = executionOrder.filter((nodeId) => isPrimaryNode(nodeMap.get(nodeId)));
  const throughput = nodes.length === 0 ? 0
    : bottleneckNodes.length > 0
      ? Math.min(...bottleneckNodes.map(id => nodeMetrics.get(id)?.effectiveQPS ?? 0))
      : requestsPerSec;

  return { nodeMetrics, totalLatencyMs, bottleneckNodes, throughput, executionOrder, primaryExecutionOrder, timestamp: Date.now(), warnings };
}

function traceAdjacency(nodes, edges) {
  const adjacency = new Map(nodes.map((node) => [node.id, []]));
  for (const edge of edges) {
    if (edge?.data?.feedback || edge?.role === "feedback") continue;
    if (adjacency.has(edge.source) && adjacency.has(edge.target)) adjacency.get(edge.source).push(edge);
  }
  return adjacency;
}

function tracePercentile(values, percentile) {
  if (!values.length) return 0;
  const index = Math.min(values.length - 1, Math.max(0, Math.ceil(values.length * percentile) - 1));
  return values[index];
}

function createSeededRandom(seed = 1) {
  let state = (Number(seed) >>> 0) || 1;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function nodeFailure(node, metric, random, mode) {
  if (node.forceFailure) return "forced failure";
  if (node.degradedMode && metric?.status === "critical") return "dependency degraded";
  if (node.overloadBehavior && metric?.utilization > 1) return "overloaded";
  if (mode === "monte-carlo" && random() < Math.min(1, Math.max(0, Number(node.failureRate ?? 0)))) return "probabilistic failure";
  return "";
}

function selectTraceChild(node, children, random, mode) {
  if (!children.length) return null;
  const isSplitter = LOAD_BALANCING_COMPONENTS.has(node.componentId);
  if (isSplitter && mode === "monte-carlo") return children[Math.floor(random() * children.length)];
  return children[0];
}

export function runTrace(nodes, edges, options = {}) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const adjacency = traceAdjacency(nodes, edges);
  const incoming = new Map(nodes.map((node) => [node.id, 0]));
  for (const children of adjacency.values()) for (const edge of children) incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1);
  const entry = nodeMap.get(options.entryNodeId) || nodes.find((node) => (incoming.get(node.id) ?? 0) === 0) || nodes[0];
  if (!entry) return { status: "error", events: [], path: [], totalLatencyMs: 0, error: "No entry node" };

  const random = options.random || Math.random;
  const mode = options.mode || "trace";
  const cacheOutcome = options.cacheOutcome || "auto";
  const visited = [];
  const events = [{ id: `${entry.id}:origin`, label: `Request originates at ${entry.label || entry.componentId || entry.id}`, time: 0, status: "ok", type: "origin" }];
  const retries = new Map();
  let current = entry;
  let previous = null;
  let totalLatencyMs = 0;
  let hops = 0;

  while (current && hops < 80) {
    hops += 1;
    if (visited.includes(current.id) && current.id === previous?.id) return { status: "error", events, path: visited, totalLatencyMs, error: "Trace stopped at a cycle" };
    visited.push(current.id);
    const metric = options.nodeMetrics?.[current.id];
    const failureReason = nodeFailure(current, metric, random, mode);
    if (failureReason) {
      const retryCount = retries.get(current.id) ?? 0;
      const maxRetries = Math.max(0, Number(current.maxRetries ?? 0));
      if (retryCount < maxRetries) {
        retries.set(current.id, retryCount + 1);
        events.push({ id: `${current.id}:retry:${retryCount}`, label: `${current.label || current.id} → retry ${retryCount + 1}/${maxRetries} (${failureReason})`, time: Math.round(totalLatencyMs), status: "retry", type: "retry" });
        continue;
      }
      const deadLettered = Boolean(current.deadLetterQueue);
      events.push({ id: `${current.id}:failure`, label: `${current.label || current.id} → ${deadLettered ? "dead-lettered" : "failed"} (${failureReason})`, time: Math.round(totalLatencyMs), status: deadLettered ? "dead-letter" : "failed", type: "failure", nodeId: current.id });
      return { status: deadLettered ? "dead-letter" : "error", events, path: visited, totalLatencyMs, failureNodeId: current.id, error: failureReason };
    }

    const baseLatency = Number(current.latencyOverrideMs ?? 0) > 0 ? Number(current.latencyOverrideMs) : Number(current.latencyMs ?? 10);
    const jitter = mode === "monte-carlo" ? Math.min(1, Math.max(0, Number(current.latencyJitter ?? 0))) : 0;
    const latency = Math.max(0, Math.round(baseLatency * (1 + ((random() * 2) - 1) * jitter)));
    totalLatencyMs += latency;
    events.push({ id: `${current.id}:process:${hops}`, label: `Processed at ${current.label || current.id} (${current.componentId || "component"}, +${latency} ms)`, time: Math.round(totalLatencyMs), status: "ok", type: "process", nodeId: current.id });

    const children = adjacency.get(current.id) || [];
    if (current.componentId === "cache") {
      const hit = cacheOutcome === "hit" || (cacheOutcome !== "miss" && (mode === "trace" ? Number(current.cacheHitRate ?? 0.85) >= 0.5 : random() < Number(current.cacheHitRate ?? 0.85)));
      events.push({ id: `${current.id}:cache:${hops}`, label: hit ? `${current.label || "Cache"} HIT — request served` : `${current.label || "Cache"} MISS — following origin path`, time: Math.round(totalLatencyMs), status: hit ? "ok" : "miss", type: "cache", nodeId: current.id });
      if (hit) {
        events.push({ id: `${current.id}:complete`, label: `Request complete (${Math.round(totalLatencyMs)} ms)`, time: Math.round(totalLatencyMs), status: "ok", type: "complete" });
        return { status: "success", events, path: visited, totalLatencyMs };
      }
      if (current.cacheStrategy !== "read-through" && previous) {
        const fallback = (adjacency.get(previous.id) || []).find((edge) => edge.target !== current.id);
        if (fallback) {
          events.push({ id: `${current.id}:fallback`, label: `Cache miss → ${nodeMap.get(fallback.target)?.label || fallback.target}`, time: Math.round(totalLatencyMs), status: "miss", type: "fallback" });
          current = nodeMap.get(fallback.target);
          continue;
        }
      }
    }

    const nextEdge = selectTraceChild(current, children, random, mode);
    if (!nextEdge) {
      events.push({ id: `${current.id}:complete`, label: `Request complete (${Math.round(totalLatencyMs)} ms)`, time: Math.round(totalLatencyMs), status: "ok", type: "complete" });
      return { status: "success", events, path: visited, totalLatencyMs };
    }
    const next = nodeMap.get(nextEdge.target);
    events.push({ id: `${current.id}:to:${next.id}`, label: `→ ${next.label || next.componentId || next.id}`, time: Math.round(totalLatencyMs), status: "ok", type: "hop", nodeId: next.id });
    previous = current;
    current = next;
  }
  return { status: "error", events, path: visited, totalLatencyMs, error: "Trace exceeded the safe hop limit" };
}

export function runMonteCarlo(nodes, edges, requestsPerSec, options = {}) {
  const trials = Math.min(10000, Math.max(1, Number(options.trials ?? 1000)));
  const seed = Number(options.seed ?? 1) || 1;
  const random = createSeededRandom(seed);
  const base = runSimulation(nodes, edges, requestsPerSec);
  const latencies = [];
  const nodeStats = new Map(nodes.map((node) => [node.id, { nodeId: node.id, visits: 0, failures: 0 }]));
  let successes = 0;
  let deadLetters = 0;
  let failures = 0;
  const failureReasons = new Map();
  for (let trial = 0; trial < trials; trial += 1) {
    const result = runTrace(nodes, edges, { ...options, mode: "monte-carlo", random, nodeMetrics: Object.fromEntries(base.nodeMetrics) });
    if (result.status === "success") successes += 1;
    else if (result.status === "dead-letter") deadLetters += 1;
    else failures += 1;
    latencies.push(Math.round(result.totalLatencyMs));
    result.path.forEach((nodeId) => { const stat = nodeStats.get(nodeId); if (stat) stat.visits += 1; });
    if (result.failureNodeId) {
      const stat = nodeStats.get(result.failureNodeId); if (stat) stat.failures += 1;
      const reason = result.error || "failure";
      failureReasons.set(reason, (failureReasons.get(reason) ?? 0) + 1);
    }
  }
  latencies.sort((a, b) => a - b);
  return {
    trials, seed, successes, failures, deadLetters,
    successRate: successes / trials, errorRate: (failures + deadLetters) / trials,
    p50: tracePercentile(latencies, 0.5), p95: tracePercentile(latencies, 0.95), p99: tracePercentile(latencies, 0.99),
    mean: Math.round(latencies.reduce((sum, value) => sum + value, 0) / Math.max(1, latencies.length)), max: latencies[latencies.length - 1] || 0,
    nodeStats: Object.fromEntries(nodeStats), failureReasons: Object.fromEntries(failureReasons), base,
  };
}

function computeLongestPathLatency(nodes, adjacency, inDegree, metrics) {
  if (nodes.length === 0) return 0;
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const primaryNodes = nodes.filter(isPrimaryNode);
  if (primaryNodes.length === 0) return 0;
  const primaryInDegree = new Map(primaryNodes.map((node) => [node.id, 0]));
  for (const node of primaryNodes) {
    for (const childId of adjacency.get(node.id) ?? []) {
      if (isPrimaryNode(nodeMap.get(childId))) primaryInDegree.set(childId, (primaryInDegree.get(childId) ?? 0) + 1);
    }
  }
  const remaining  = new Map(primaryInDegree);
  const dist       = new Map();
  const entryNodes = primaryNodes.filter(n => (primaryInDegree.get(n.id) ?? 0) === 0);
  for (const entry of entryNodes) dist.set(entry.id, metrics.get(entry.id)?.latencyMs ?? 0);

  const queue    = [...entryNodes.map(n => n.id)];
  const processed = new Set();

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (processed.has(nodeId)) continue;
    processed.add(nodeId);
    const currentDist = dist.get(nodeId) ?? 0;
    for (const childId of (adjacency.get(nodeId) ?? [])) {
      if (!isPrimaryNode(nodeMap.get(childId))) continue;
      const childLatency = metrics.get(childId)?.latencyMs ?? 0;
      const newDist = currentDist + childLatency;
      if (newDist > (dist.get(childId) ?? 0)) dist.set(childId, newDist);
      const newDeg = (remaining.get(childId) ?? primaryInDegree.get(childId) ?? 1) - 1;
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
