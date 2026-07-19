import { PROBLEMS } from "../../simulator/data/sdsProblems";
import { LEARNING_PATH } from "../../simulator/data/sdsLearningPath";
import { SERVICE_BY_ID } from "./serviceCatalog";

// The simulator and Playground 2.0 use different node vocabularies. Keep the
// source problem data intact, and translate only the reference graph into the
// services that the v2 canvas can render.
const COMPONENT_SERVICE_MAP = {
  dns: "client",
  cdn: "s3",
  "load-balancer": "api-gateway",
  "api-gateway": "api-gateway",
  "rate-limiter": "waf",
  "app-server": "lambda",
  cache: "elasticache",
  "nosql-db": "dynamodb",
  "sql-db": "dynamodb",
  database: "dynamodb",
  monitoring: "cloudwatch",
  "message-queue": "sqs",
  "pub-sub": "eventbridge",
  "task-scheduler": "step-functions",
  "object-storage": "s3",
  "file-storage": "s3",
  "auth-service": "cognito",
  "circuit-breaker": "guardrails",
  "search-service": "opensearch",
  "search-index": "opensearch",
  "embedding-service": "embeddings",
  "model-service": "bedrock",
  "notification-service": "eventbridge",
  "websocket-server": "tool",
  "payment-service": "tool",
  "location-service": "tool",
  "streaming-service": "s3",
  "user-service": "cognito",
};

const resolveServiceId = (componentId = "") => {
  const id = String(componentId).toLowerCase();
  if (COMPONENT_SERVICE_MAP[id]) return COMPONENT_SERVICE_MAP[id];
  if (/cache|redis|memcache/.test(id)) return "elasticache";
  if (/queue|kafka|stream|event/.test(id)) return "sqs";
  if (/search|index|trie/.test(id)) return "opensearch";
  if (/auth|user|identity|session/.test(id)) return "cognito";
  if (/storage|blob|file|media|object/.test(id)) return "s3";
  if (/db|database|sql|mongo|ledger|store/.test(id)) return "dynamodb";
  if (/monitor|metric|log|trace|observ/.test(id)) return "cloudwatch";
  if (/api|gateway|proxy|load/.test(id)) return "api-gateway";
  return "lambda";
};

const learningTierByProblem = Object.fromEntries(
  LEARNING_PATH.flatMap((tier) => tier.problemIds.map((problemId) => [problemId, tier.name])),
);

const referenceFor = (problem) => {
  const sourceNodes = Array.isArray(problem.referenceSolution?.nodes)
    ? problem.referenceSolution.nodes.filter((node) => node?.componentId)
    : [];
  const sourceEdges = Array.isArray(problem.referenceSolution?.edges)
    ? problem.referenceSolution.edges
    : [];
  const nodes = sourceNodes.map((node, index) => {
    const originalId = String(node.componentId);
    const serviceId = resolveServiceId(originalId);
    const service = SERVICE_BY_ID[serviceId];
    return {
      id: `sds-ref-${problem.id}-${index}`,
      originalComponentId: originalId,
      serviceId,
      label: originalId.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
      position: { x: Number.isFinite(node.x) ? node.x : 120 + index * 250, y: Number.isFinite(node.y) ? node.y : 180 + (index % 3) * 150 },
      kind: service?.kind || "service",
    };
  });
  const firstNodeByOriginalId = new Map();
  nodes.forEach((node) => {
    if (!firstNodeByOriginalId.has(node.originalComponentId)) firstNodeByOriginalId.set(node.originalComponentId, node.id);
  });
  const edges = sourceEdges.map((edge, index) => {
    const source = firstNodeByOriginalId.get(String(edge.source));
    const target = firstNodeByOriginalId.get(String(edge.target));
    if (!source || !target || source === target) return null;
    return { id: `sds-ref-edge-${problem.id}-${index}`, source, target, label: edge.label || "request", role: edge.role || "primary" };
  }).filter(Boolean);
  const requiredKinds = [...new Set(nodes.map((node) => node.kind))];
  return {
    nodes,
    edges,
    requiredKinds: requiredKinds.length ? requiredKinds : ["service"],
  };
};

export const SYSTEM_DESIGN_CHALLENGES = PROBLEMS.map((problem) => {
  const reference = referenceFor(problem);
  return {
    id: `sds:${problem.id}`,
    label: problem.title,
    difficulty: problem.difficulty,
    brief: problem.description,
    minEdges: Math.max(2, reference.edges.length || Math.min(5, reference.nodes.length - 1)),
    requiredKinds: reference.requiredKinds,
    source: "system-design-simulator",
    learningTier: learningTierByProblem[problem.id] || "Library",
    problem,
    reference,
  };
});

export const SYSTEM_DESIGN_CHALLENGE_BY_ID = Object.fromEntries(
  SYSTEM_DESIGN_CHALLENGES.map((challenge) => [challenge.id, challenge]),
);
