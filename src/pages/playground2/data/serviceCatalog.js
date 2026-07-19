import { CATEGORIES } from "../../playground/data/nodes";
import { TEMPLATES } from "../../playground/data/templates";

const awsIconBase = "https://raw.githubusercontent.com/icacho-dev/aws-architecture-icons/main/Resource-Icons_02072025";
const awsServiceIcon = (path) => `https://raw.githubusercontent.com/icacho-dev/aws-architecture-icons/main/Architecture-Service-Icons_02072025/${path}`;
const flowIcon = (file) => `/flow-design-icons/${file}`;

const bundledFlowIcons = import.meta.glob("/flow-design/assets/third-party-icons/*/processed/**/*.svg", { eager: true, query: "?url", import: "default" });
const normalize = (value = "") => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const flowIconEntries = Object.entries(bundledFlowIcons).map(([path, url]) => ({
  path,
  url,
  provider: path.split("/third-party-icons/")[1]?.split("/")[0] || "developer",
  tokens: normalize(path.split("/processed/")[1] || path).split(" ").filter((token) => token.length > 2),
}));
const findFlowIcon = (label, provider = "") => {
  const labelTokens = normalize(label).split(" ").filter((token) => token.length > 2);
  if (!labelTokens.length) return null;
  const normalizedProvider = normalize(provider);
  const ranked = flowIconEntries.map((entry) => {
    const hits = labelTokens.filter((token) => entry.tokens.includes(token)).length;
    const providerBonus = normalizedProvider && entry.provider === normalizedProvider ? 4 : 0;
    return { entry, score: hits * 3 + providerBonus };
  }).filter((item) => item.score > 0).sort((left, right) => right.score - left.score);
  return ranked[0]?.entry.url || null;
};
const titleFromFlowPath = (path) => {
  const source = (path.split("/processed/")[1] || path).replace(/\.svg$/, "").split("/").pop();
  return source.split(/[-_]+/).filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};
const flowProviderColor = { aws: "#f59e0b", azure: "#2563eb", gcp: "#16a34a", cncf: "#0891b2", developer: "#64748b" };

const legacyColor = {
  agent: "#818cf8", llm: "#a78bfa", processing: "#94a3b8", io: "#38bdf8", datasource: "#fbbf24",
  vectordb: "#34d399", tool: "#f87171", memory: "#f472b6", aws: "#fb923c", azure: "#60a5fa",
  databricks: "#fc8181", mcp: "#c084fc", multimodal: "#2dd4bf", database: "#3b82f6", rag: "#06b6d4",
  workflow: "#a855f7", security: "#f97316", observ: "#10b981", eval: "#f59e0b", cache: "#06b6d4",
  notification: "#f59e0b", websocket: "#10b981", image: "#2dd4bf", audio: "#8b5cf6", conditional: "#ec4899",
  email: "#f59e0b", http: "#06b6d4", loop: "#8b5cf6", error: "#ef4444", transform: "#14b8a6", schedule: "#f97316",
};

const legacyKind = (nodeType = "service") => ({
  io: "source", datasource: "datasource", vectordb: "vector", llm: "llm", agent: "router", tool: "tool",
  memory: "memory", database: "database", aws: "service", azure: "service", databricks: "service", mcp: "tool",
  observ: "observability", rag: "retriever", multimodal: "multimodal", workflow: "orchestrator", processing: "processor",
}[nodeType] || nodeType);

const makeLegacyService = (node, category) => {
  const provider = ["aws", "azure", "databricks", "mcp"].includes(node.color) ? node.color : category.id === "llms" ? "models" : "GenAI";
  return {
    id: `legacy:${category.id}:${node.id}`,
    label: node.label,
    category: category.label,
    provider: provider === "models" ? "Models" : provider === "GenAI" ? "GenAI" : provider,
    iconUrl: findFlowIcon(node.label, provider) || findFlowIcon(node.label, "developer"),
    fallbackIcon: node.icon || "Box",
    color: legacyColor[node.color] || "#60a5fa",
    kind: legacyKind(node.nodeType || node.color),
    description: node.info || node.sub || `${node.label} GenAI playground node`,
    legacy: true,
    legacyMeta: node,
  };
};

// This catalog intentionally points at the same AWS catalog used by the AWS simulator
// and the built SVG assets shipped with Flow Design. The v2 canvas only adds a thin
// GenAI vocabulary on top of those shared service icons.
export const SERVICE_CATALOG = [
  { id: "client", label: "Client", category: "Experience", provider: "Core", iconUrl: `${awsIconBase}/Res_General-Icons/Res_48_Light/Res_Users_48_Light.svg`, fallbackIcon: "Users", color: "#38bdf8", kind: "source", description: "Users, apps, or devices entering the GenAI experience." },
  { id: "api-gateway", label: "API Gateway", category: "Edge", provider: "AWS", iconUrl: awsServiceIcon("Arch_Networking-Content-Delivery/48/Arch_Amazon-API-Gateway_48.svg"), fallbackIcon: "Globe2", color: "#f59e0b", kind: "service", description: "Managed API front door with throttling, auth, and routing." },
  { id: "cognito", label: "Cognito", category: "Security", provider: "AWS", iconUrl: awsServiceIcon("Arch_Security-Identity-Compliance/48/Arch_Amazon-Cognito_48.svg"), fallbackIcon: "KeyRound", color: "#ef4444", kind: "service", description: "Identity, login, federation, and token issuance." },
  { id: "waf", label: "AWS WAF", category: "Security", provider: "AWS", iconUrl: awsServiceIcon("Arch_Security-Identity-Compliance/48/Arch_AWS-WAF_48.svg"), fallbackIcon: "ShieldCheck", color: "#ef4444", kind: "guardrail", description: "Web traffic filtering before requests reach the application." },
  { id: "lambda", label: "Lambda", category: "Compute", provider: "AWS", iconUrl: awsServiceIcon("Arch_Compute/48/Arch_AWS-Lambda_48.svg"), fallbackIcon: "Zap", color: "#f59e0b", kind: "service", description: "Short-lived serverless orchestration and transformation." },
  { id: "step-functions", label: "Step Functions", category: "Orchestration", provider: "AWS", iconUrl: awsServiceIcon("Arch_App-Integration/48/Arch_AWS-Step-Functions_48.svg"), fallbackIcon: "Workflow", color: "#f59e0b", kind: "orchestrator", description: "Explicit state, branching, retries, and human approval." },
  { id: "s3", label: "Amazon S3", category: "Data", provider: "AWS", iconUrl: awsServiceIcon("Arch_Storage/48/Arch_Amazon-Simple-Storage-Service_48.svg"), flowIconUrl: flowIcon("Simple-Storage-Service_S3-Standard-s8fBfA57.svg"), fallbackIcon: "Archive", color: "#22c55e", kind: "datasource", description: "Durable object store for documents, uploads, and artifacts." },
  { id: "dynamodb", label: "DynamoDB", category: "Data", provider: "AWS", iconUrl: awsServiceIcon("Arch_Database/48/Arch_Amazon-DynamoDB_48.svg"), flowIconUrl: flowIcon("DynamoDB-sqOqO05b.svg"), fallbackIcon: "Table2", color: "#3b82f6", kind: "database", description: "Low-latency key-value or document state store." },
  { id: "opensearch", label: "OpenSearch", category: "Retrieval", provider: "AWS", iconUrl: awsServiceIcon("Arch_Analytics/48/Arch_Amazon-OpenSearch-Service_48.svg"), flowIconUrl: flowIcon("OpenSearch-Service_Cluster-Administrator-Node-D63QXuwD.svg"), fallbackIcon: "Search", color: "#a855f7", kind: "vector", description: "Search and vector retrieval for grounding context." },
  { id: "elasticache", label: "ElastiCache", category: "Data", provider: "AWS", iconUrl: awsServiceIcon("Arch_Database/48/Arch_Amazon-ElastiCache_48.svg"), flowIconUrl: flowIcon("ElastiCache-CI1ssUED.svg"), fallbackIcon: "Gauge", color: "#a855f7", kind: "cache", description: "Fast response, session, and semantic result caching." },
  { id: "bedrock", label: "Amazon Bedrock", category: "Models", provider: "AWS", iconUrl: awsServiceIcon("Arch_Artificial-Intelligence/48/Arch_Amazon-Bedrock_48.svg"), flowIconUrl: flowIcon("Bedrock-CSJm_peo.svg"), fallbackIcon: "BrainCircuit", color: "#c084fc", kind: "llm", description: "Managed foundation model inference and model routing." },
  { id: "sagemaker", label: "SageMaker AI", category: "Models", provider: "AWS", iconUrl: awsServiceIcon("Arch_Artificial-Intelligence/48/Arch_Amazon-SageMaker-AI_48.svg"), fallbackIcon: "Brain", color: "#c084fc", kind: "llm", description: "Custom model endpoints, tuning, and evaluation." },
  { id: "guardrails", label: "Bedrock Guardrails", category: "Safety", provider: "AWS", iconUrl: flowIcon("GuardDuty-BSc8x8EP.svg"), fallbackIcon: "ShieldCheck", color: "#ef4444", kind: "guardrail", description: "Content filters, topic policies, PII handling, and grounding checks." },
  { id: "cloudwatch", label: "CloudWatch", category: "Operations", provider: "AWS", iconUrl: awsServiceIcon("Arch_Management-Governance/48/Arch_Amazon-CloudWatch_48.svg"), flowIconUrl: flowIcon("CloudWatch-BvXWk7_X.svg"), fallbackIcon: "Activity", color: "#fb7185", kind: "observability", description: "Metrics, logs, traces, alarms, and operational feedback." },
  { id: "sqs", label: "SQS", category: "Orchestration", provider: "AWS", iconUrl: awsServiceIcon("Arch_App-Integration/48/Arch_Amazon-Simple-Queue-Service_48.svg"), fallbackIcon: "ListTodo", color: "#f59e0b", kind: "queue", description: "Buffer asynchronous ingestion and background jobs." },
  { id: "eventbridge", label: "EventBridge", category: "Orchestration", provider: "AWS", iconUrl: awsServiceIcon("Arch_App-Integration/48/Arch_Amazon-EventBridge_48.svg"), fallbackIcon: "RadioTower", color: "#f59e0b", kind: "event", description: "Route domain and AWS events between decoupled components." },
  { id: "openai", label: "OpenAI model", category: "Models", provider: "OpenAI", iconUrl: "/flow-design-icons/Openai.svg", fallbackIcon: "Sparkles", color: "#10b981", kind: "llm", description: "External model endpoint for comparison or hybrid routing." },
  { id: "anthropic", label: "Anthropic model", category: "Models", provider: "Anthropic", iconUrl: "/flow-design-icons/claude.svg", fallbackIcon: "Sparkles", color: "#f97316", kind: "llm", description: "External model endpoint for comparison or hybrid routing." },
  { id: "embeddings", label: "Embedding model", category: "Retrieval", provider: "GenAI", iconUrl: flowIcon("Bedrock-CSJm_peo.svg"), fallbackIcon: "Binary", color: "#8b5cf6", kind: "embedder", description: "Turn documents and queries into vectors for semantic retrieval." },
  { id: "prompt-router", label: "Prompt router", category: "Agents", provider: "GenAI", iconUrl: flowIcon("web-app-plus-database-CyDFvZBb.svg"), fallbackIcon: "GitBranch", color: "#06b6d4", kind: "router", description: "Select prompts, models, and tools based on intent or policy." },
  { id: "tool", label: "Tool / API", category: "Agents", provider: "GenAI", iconUrl: awsServiceIcon("Arch_Networking-Content-Delivery/48/Arch_Amazon-API-Gateway_48.svg"), fallbackIcon: "Webhook", color: "#06b6d4", kind: "tool", description: "A callable function, search API, or business system." },
  { id: "human-review", label: "Human review", category: "Safety", provider: "Core", iconUrl: flowIcon("Support-D2lXj50U.svg"), fallbackIcon: "UserCheck", color: "#fbbf24", kind: "human", description: "Approval or escalation step for risky or uncertain outputs." },
  { id: "response", label: "Response", category: "Experience", provider: "Core", iconUrl: flowIcon("website-power-BZks3FSC.svg"), fallbackIcon: "MessageSquare", color: "#38bdf8", kind: "sink", description: "The response, stream, notification, or generated artifact." },
];

export const LEGACY_COMPONENTS = CATEGORIES.flatMap((category) => category.nodes.map((node) => makeLegacyService(node, category)));
export const FLOW_COMPONENTS = flowIconEntries.map((entry) => ({
  id: `flow:${entry.provider}:${normalize(entry.path).replace(/\s+/g, "-")}`,
  label: titleFromFlowPath(entry.path),
  category: `${entry.provider.toUpperCase()} / ${titleFromFlowPath(entry.path.split("/processed/")[1] || "Services").split(" ")[0]}`,
  provider: entry.provider.toUpperCase(),
  iconUrl: entry.url,
  fallbackIcon: "Box",
  color: flowProviderColor[entry.provider] || "#64748b",
  kind: "service",
  description: `${entry.provider.toUpperCase()} service icon from Flow Design's provider library.`,
  flowSource: true,
}));
export const ALL_COMPONENTS = [...SERVICE_CATALOG, ...LEGACY_COMPONENTS, ...FLOW_COMPONENTS];
export const SERVICE_BY_ID = Object.fromEntries(ALL_COMPONENTS.map((service) => [service.id, service]));

const legacyTemplateService = (node) => {
  const category = CATEGORIES.find((item) => item.nodes.some((candidate) => candidate.id === node.id)) || { id: "templates", label: "Template" };
  return makeLegacyService({ ...node.data, id: node.id, label: node.data?.label || node.label, icon: node.data?.icon || node.icon, color: node.data?.colorKey || node.colorKey, nodeType: node.data?.nodeType || node.nodeType, sub: node.data?.sub || node.sub }, category);
};

export const LEGACY_TEMPLATES = TEMPLATES.map((template) => {
  const idMap = Object.fromEntries(template.nodes.map((node) => [node.id, `template:${template.id}:${node.id}`]));
  return {
    ...template,
    nodes: template.nodes.map((node) => {
      const service = legacyTemplateService(node);
      return {
        id: idMap[node.id],
        type: "genaiService",
        position: node.position,
        data: { serviceId: service.id, label: service.label, service, runtimeState: "idle", config: {}, templateSourceId: node.id },
      };
    }),
    edges: template.edges.map((edge) => ({
      id: `template-edge:${template.id}:${edge.id}`,
      source: idMap[edge.source] || edge.source,
      target: idMap[edge.target] || edge.target,
      type: "bezier",
      pathOptions: { curvature: 0.28 },
      label: edge.label,
      animated: false,
      markerEnd: { type: "arrowclosed", color: "#64748b" },
      style: { stroke: "#64748b", strokeWidth: 1.5, strokeLinecap: "round" },
      labelStyle: { fill: "#64748b", fontSize: 10 },
    })),
  };
});

export const PATTERNS = [
  { id: "rag", label: "RAG assistant", description: "Ground model answers in a managed document corpus.", icon: "Database", nodeIds: ["client", "api-gateway", "guardrails", "embeddings", "s3", "opensearch", "bedrock", "response"] },
  { id: "agent", label: "Tool-using agent", description: "Route intent to a model that can call governed business tools.", icon: "Bot", nodeIds: ["client", "api-gateway", "cognito", "prompt-router", "bedrock", "tool", "guardrails", "response"] },
  { id: "ingestion", label: "Ingestion pipeline", description: "Process, embed, and index new content asynchronously.", icon: "Workflow", nodeIds: ["s3", "eventbridge", "sqs", "lambda", "embeddings", "opensearch", "cloudwatch"] },
  { id: "hybrid", label: "Hybrid model gateway", description: "Compare providers with policy, cost, and fallback routing.", icon: "GitBranch", nodeIds: ["client", "api-gateway", "prompt-router", "bedrock", "openai", "anthropic", "cloudwatch", "response"] },
];

export const REVIEW_PILLARS = [
  { id: "operational", label: "Operational excellence", short: "Ops", color: "#60a5fa" },
  { id: "security", label: "Security & responsible AI", short: "Safety", color: "#f87171" },
  { id: "reliability", label: "Reliability", short: "Reliability", color: "#34d399" },
  { id: "performance", label: "Performance efficiency", short: "Perf", color: "#fbbf24" },
  { id: "cost", label: "Cost optimization", short: "Cost", color: "#c084fc" },
  { id: "sustainability", label: "Sustainability", short: "Sustainability", color: "#2dd4bf" },
];

export const CHALLENGES = [
  { id: "production-rag", label: "Production RAG", difficulty: "Intermediate", brief: "Design a grounded assistant with durable documents, vector search, model inference, and safety controls.", requiredKinds: ["datasource", "embedder", "vector", "llm", "guardrail", "sink"], minEdges: 5 },
  { id: "agent-safety", label: "Safe tool agent", difficulty: "Advanced", brief: "Create a tool-using assistant with identity, tool execution, safety filtering, and an observable response path.", requiredKinds: ["source", "router", "llm", "tool", "guardrail", "observability"], minEdges: 5 },
];
