// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  ArchitectureDesign.jsx  — Eraser.io-style canvas                       ║
// ║  Uses @iconify/react for exact official brand icons                      ║
// ║  Drop into: src/pages/playground/ArchitectureDesign.jsx                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import React, { useState, useCallback, useRef } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  MiniMap,
  Controls,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  EdgeLabelRenderer,
  getBezierPath,
  Handle,
  Position,
  ConnectionMode,
} from "reactflow";
import "reactflow/dist/style.css";
import { Icon } from "@iconify/react";
import {
  Download, Search, X, Layers, Trash2,
  Grid, Maximize2, RotateCcw, RotateCw,
  Sparkles, MousePointer, ChevronDown, ChevronRight, Loader2,
  Type, Square, Circle
} from "lucide-react";

// ─── ICON REGISTRY ────────────────────────────────────────────────────────────
// Uses @iconify/react "logos:" + "carbon:" sets — same icons as Eraser.io
// Browse all: https://icon-sets.iconify.design/logos/
const ICON_MAP = {
  // ── AWS ───────────────────────────────────────────────────────────────────
  "aws-s3":              { icon: "logos:amazon-s3",               label: "S3",               sub: "Object Storage",    bg: "#3F8624" },
  "aws-lambda":          { icon: "logos:aws-lambda",              label: "Lambda",           sub: "Serverless",        bg: "#E7800D" },
  "aws-ec2":             { icon: "logos:amazon-ec2",              label: "EC2",              sub: "Virtual Machine",   bg: "#E7800D" },
  "aws-rds":             { icon: "logos:amazon-rds",              label: "RDS",              sub: "Relational DB",     bg: "#3F8624" },
  "aws-bedrock":         { icon: "logos:aws",                     label: "Bedrock",          sub: "GenAI Platform",    bg: "#7B2D8B" },
  "aws-sqs":             { icon: "logos:amazon-sqs",              label: "SQS",              sub: "Message Queue",     bg: "#E7800D" },
  "aws-sns":             { icon: "logos:amazon-sns",              label: "SNS",              sub: "Pub/Sub",           bg: "#E7800D" },
  "aws-api-gateway":     { icon: "logos:aws-api-gateway",         label: "API Gateway",      sub: "API Management",    bg: "#E7800D" },
  "aws-cloudfront":      { icon: "logos:aws-cloudfront",          label: "CloudFront",       sub: "CDN",               bg: "#8C4FFF" },
  "aws-cognito":         { icon: "logos:aws-cognito",             label: "Cognito",          sub: "Auth",              bg: "#E7800D" },
  "aws-elb":             { icon: "logos:aws",                     label: "ELB",              sub: "Load Balancer",     bg: "#8C4FFF" },
  "aws-ecs":             { icon: "logos:amazon-ecs",              label: "ECS",              sub: "Containers",        bg: "#E7800D" },
  "aws-eks":             { icon: "logos:amazon-eks",              label: "EKS",              sub: "Kubernetes",        bg: "#E7800D" },
  "aws-dynamodb":        { icon: "logos:amazon-dynamodb",         label: "DynamoDB",         sub: "NoSQL DB",          bg: "#3F8624" },
  "aws-kinesis":         { icon: "logos:aws",                     label: "Kinesis",          sub: "Streaming",         bg: "#8C4FFF" },
  "aws-step-functions":  { icon: "logos:aws",                     label: "Step Functions",   sub: "Orchestration",     bg: "#E7800D" },
  "aws-secrets-manager": { icon: "logos:aws",                     label: "Secrets Manager",  sub: "Secrets",           bg: "#DD344C" },
  "aws-cloudwatch":      { icon: "logos:amazon-cloudwatch",       label: "CloudWatch",       sub: "Monitoring",        bg: "#E7800D" },
  "aws-glue":            { icon: "logos:aws",                     label: "Glue",             sub: "ETL",               bg: "#3F8624" },
  "aws-athena":          { icon: "logos:aws",                     label: "Athena",           sub: "Serverless Query",  bg: "#8C4FFF" },

  // ── AZURE ─────────────────────────────────────────────────────────────────
  "azure-blob":          { icon: "logos:microsoft-azure",         label: "Blob Storage",     sub: "Object Storage",    bg: "#0078D4" },
  "azure-functions":     { icon: "logos:azure-functions",         label: "Functions",        sub: "Serverless",        bg: "#0078D4" },
  "azure-sql":           { icon: "logos:microsoft-azure",         label: "Azure SQL",        sub: "Relational DB",     bg: "#0078D4" },
  "azure-cosmos":        { icon: "logos:azure-cosmos-db",         label: "Cosmos DB",        sub: "Multi-model DB",    bg: "#0078D4" },
  "azure-openai":        { icon: "logos:openai-icon",             label: "Azure OpenAI",     sub: "AI Models",         bg: "#0078D4" },
  "azure-ai-foundry":    { icon: "logos:microsoft-azure",         label: "AI Foundry",       sub: "GenAI Platform",    bg: "#5C2D91" },
  "azure-aks":           { icon: "logos:microsoft-azure",         label: "AKS",              sub: "Kubernetes",        bg: "#0078D4" },
  "azure-service-bus":   { icon: "logos:microsoft-azure",         label: "Service Bus",      sub: "Messaging",         bg: "#0078D4" },
  "azure-monitor":       { icon: "logos:microsoft-azure",         label: "Monitor",          sub: "Observability",     bg: "#0078D4" },
  "azure-cdn":           { icon: "logos:microsoft-azure",         label: "CDN",              sub: "Edge Network",      bg: "#0078D4" },
  "azure-keyvault":      { icon: "logos:microsoft-azure",         label: "Key Vault",        sub: "Secrets",           bg: "#0078D4" },

  // ── GCP ───────────────────────────────────────────────────────────────────
  "gcp-gcs":             { icon: "logos:google-cloud-storage",    label: "Cloud Storage",    sub: "Object Storage",    bg: "#4285F4" },
  "gcp-cloud-functions": { icon: "logos:google-cloud-functions",  label: "Cloud Functions",  sub: "Serverless",        bg: "#34A853" },
  "gcp-bigquery":        { icon: "logos:google-bigquery",         label: "BigQuery",         sub: "Data Warehouse",    bg: "#4285F4" },
  "gcp-vertex-ai":       { icon: "logos:google-cloud",            label: "Vertex AI",        sub: "ML Platform",       bg: "#4285F4" },
  "gcp-pub-sub":         { icon: "logos:google-cloud",            label: "Pub/Sub",          sub: "Messaging",         bg: "#FBBC05" },
  "gcp-cloud-run":       { icon: "logos:google-cloud-run",        label: "Cloud Run",        sub: "Containers",        bg: "#34A853" },
  "gcp-firestore":       { icon: "logos:google-cloud-firestore",  label: "Firestore",        sub: "NoSQL DB",          bg: "#FBBC05" },
  "gcp-gke":             { icon: "logos:google-kubernetes-engine",label: "GKE",              sub: "Kubernetes",        bg: "#4285F4" },
  "gcp-spanner":         { icon: "logos:google-cloud-spanner",    label: "Spanner",          sub: "Distributed SQL",   bg: "#4285F4" },

  // ── DATABRICKS ────────────────────────────────────────────────────────────
  "databricks-workspace":    { icon: "logos:databricks",          label: "Workspace",        sub: "Dev Environment",   bg: "#FF3621" },
  "databricks-mlflow":       { icon: "logos:mlflow",              label: "MLflow",           sub: "ML Lifecycle",      bg: "#0db7ed" },
  "databricks-delta":        { icon: "logos:databricks",          label: "Delta Lake",       sub: "Lakehouse",         bg: "#FF3621" },
  "databricks-unity":        { icon: "logos:databricks",          label: "Unity Catalog",    sub: "Governance",        bg: "#FF3621" },
  "databricks-agentbricks":  { icon: "logos:databricks",          label: "AgentBricks",      sub: "Agent Platform",    bg: "#FF3621" },

  // ── MESSAGING & STREAMING ─────────────────────────────────────────────────
  "kafka":               { icon: "logos:kafka",                   label: "Kafka",            sub: "Stream Processing", bg: "#231F20" },
  "rabbitmq":            { icon: "logos:rabbitmq",                label: "RabbitMQ",         sub: "Message Queue",     bg: "#FF6600" },
  "twilio":              { icon: "logos:twilio",                  label: "Twilio",           sub: "Communications",    bg: "#F22F46" },
  "nats":                { icon: "logos:nats-icon",               label: "NATS",             sub: "Messaging",         bg: "#27AAE1" },

  // ── DATABASES & CACHE ─────────────────────────────────────────────────────
  "postgres":            { icon: "logos:postgresql",              label: "PostgreSQL",       sub: "Relational DB",     bg: "#336791" },
  "mongodb":             { icon: "logos:mongodb-icon",            label: "MongoDB",          sub: "Document DB",       bg: "#13AA52" },
  "redis":               { icon: "logos:redis",                   label: "Redis",            sub: "In-memory Cache",   bg: "#DC382D" },
  "elasticsearch":       { icon: "logos:elasticsearch",           label: "Elasticsearch",    sub: "Search Engine",     bg: "#F6D000" },
  "mysql":               { icon: "logos:mysql",                   label: "MySQL",            sub: "Relational DB",     bg: "#4479A1" },
  "neo4j":               { icon: "logos:neo4j",                   label: "Neo4j",            sub: "Graph DB",          bg: "#018BFF" },
  "cassandra":           { icon: "logos:cassandra",               label: "Cassandra",        sub: "Wide-column DB",    bg: "#1287B1" },
  "cockroachdb":         { icon: "logos:cockroachdb",             label: "CockroachDB",      sub: "Distributed SQL",   bg: "#6933FF" },
  "supabase":            { icon: "logos:supabase",                label: "Supabase",         sub: "BaaS",              bg: "#3ECF8E" },

  // ── AI & LLMs ─────────────────────────────────────────────────────────────
  "openai":              { icon: "logos:openai-icon",             label: "OpenAI",           sub: "GPT Models",        bg: "#10a37f" },
  "anthropic":           { icon: "logos:anthropic",               label: "Anthropic",        sub: "Claude Models",     bg: "#CC785C" },
  "langchain":           { icon: "logos:langchain",               label: "LangChain",        sub: "LLM Framework",     bg: "#1C3C3C" },
  "huggingface":         { icon: "logos:hugging-face-icon",       label: "HuggingFace",      sub: "Model Hub",         bg: "#FFD21E" },
  "ollama":              { icon: "logos:ollama",                  label: "Ollama",           sub: "Local LLMs",        bg: "#333"    },
  "pinecone":            { icon: "logos:pinecone",                label: "Pinecone",         sub: "Vector DB",         bg: "#000"    },
  "weaviate":            { icon: "logos:weaviate",                label: "Weaviate",         sub: "Vector DB",         bg: "#E94E3C" },
  "qdrant":              { icon: "logos:qdrant",                  label: "Qdrant",           sub: "Vector DB",         bg: "#24386C" },
  "cohere":              { icon: "logos:cohere",                  label: "Cohere",           sub: "AI Platform",       bg: "#39594D" },

  // ── INFRASTRUCTURE & DEVOPS ───────────────────────────────────────────────
  "docker":              { icon: "logos:docker-icon",             label: "Docker",           sub: "Containers",        bg: "#2496ED" },
  "kubernetes":          { icon: "logos:kubernetes",              label: "Kubernetes",       sub: "Orchestration",     bg: "#326CE5" },
  "nginx":               { icon: "logos:nginx",                   label: "Nginx",            sub: "Web Server / LB",   bg: "#009900" },
  "terraform":           { icon: "logos:terraform-icon",          label: "Terraform",        sub: "IaC",               bg: "#7B42BC" },
  "github-actions":      { icon: "logos:github-actions",          label: "GitHub Actions",   sub: "CI/CD",             bg: "#2088FF" },
  "jenkins":             { icon: "logos:jenkins",                 label: "Jenkins",          sub: "CI/CD",             bg: "#D24939" },
  "prometheus":          { icon: "logos:prometheus",              label: "Prometheus",       sub: "Metrics",           bg: "#E6522C" },
  "grafana":             { icon: "logos:grafana",                 label: "Grafana",          sub: "Dashboards",        bg: "#F46800" },
  "datadog":             { icon: "logos:datadog",                 label: "Datadog",          sub: "Observability",     bg: "#632CA6" },
  "cloudflare":          { icon: "logos:cloudflare",              label: "Cloudflare",       sub: "CDN / Security",    bg: "#F48120" },

  // ── API, AUTH & PAYMENTS ──────────────────────────────────────────────────
  "graphql":             { icon: "logos:graphql",                 label: "GraphQL",          sub: "API Query Lang",    bg: "#E10098" },
  "grpc":                { icon: "logos:grpc",                    label: "gRPC",             sub: "RPC Framework",     bg: "#244C5A" },
  "stripe":              { icon: "logos:stripe",                  label: "Stripe",           sub: "Payments",          bg: "#635BFF" },
  "auth0":               { icon: "logos:auth0",                   label: "Auth0",            sub: "Auth",              bg: "#EB5424" },

  // ── FRONTEND & DEPLOYMENT ─────────────────────────────────────────────────
  "react":               { icon: "logos:react",                   label: "React",            sub: "UI Framework",      bg: "#20232a" },
  "nextjs":              { icon: "logos:nextjs-icon",             label: "Next.js",          sub: "Full-stack React",  bg: "#000"    },
  "vercel":              { icon: "logos:vercel-icon",             label: "Vercel",           sub: "Deployment",        bg: "#000"    },

  // ── GENERIC COMPONENTS ────────────────────────────────────────────────────
  "user":                { icon: "carbon:user-filled",            label: "User",             sub: "End User",          bg: "#4B5563" },
  "browser":             { icon: "carbon:application-web",        label: "Browser",          sub: "Web Client",        bg: "#4B5563" },
  "mobile":              { icon: "carbon:mobile",                 label: "Mobile App",       sub: "iOS / Android",     bg: "#4B5563" },
  "server":              { icon: "carbon:server",                 label: "Server",           sub: "Backend Server",    bg: "#374151" },
  "database":            { icon: "carbon:data-base",              label: "Database",         sub: "Generic DB",        bg: "#374151" },
  "api":                 { icon: "carbon:api",                    label: "API",              sub: "REST / HTTP",       bg: "#374151" },
  "queue":               { icon: "carbon:ibm-mq",                 label: "Queue",            sub: "Message Queue",     bg: "#374151" },
  "cache":               { icon: "carbon:cache",                  label: "Cache",            sub: "Caching Layer",     bg: "#374151" },
  "cdn":                 { icon: "carbon:cloud-satellite",        label: "CDN",              sub: "Edge Network",      bg: "#374151" },
  "microservice":        { icon: "carbon:microservices-1",        label: "Microservice",     sub: "Service",           bg: "#374151" },
  "gateway":             { icon: "carbon:gateway",                label: "Gateway",          sub: "API / Service GW",  bg: "#374151" },
  "firewall":            { icon: "carbon:firewall",               label: "Firewall",         sub: "Security",          bg: "#374151" },
  "vpn":                 { icon: "carbon:vpn",                    label: "VPN",              sub: "Secure Tunnel",     bg: "#374151" },
  "load-balancer":       { icon: "carbon:load-balancer-global",   label: "Load Balancer",    sub: "Traffic",           bg: "#374151" },
  "monitoring":          { icon: "carbon:activity",               label: "Monitoring",       sub: "Observability",     bg: "#374151" },
  "scheduler":           { icon: "carbon:timer",                  label: "Scheduler",        sub: "Cron / Jobs",       bg: "#374151" },
  "webhook":             { icon: "carbon:webhook",                label: "Webhook",          sub: "Event Trigger",     bg: "#374151" },
};

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "aws",       label: "Amazon Web Services",     color: "#E7800D", items: ["aws-s3","aws-lambda","aws-ec2","aws-rds","aws-bedrock","aws-sqs","aws-sns","aws-api-gateway","aws-cloudfront","aws-cognito","aws-elb","aws-ecs","aws-eks","aws-dynamodb","aws-kinesis","aws-step-functions","aws-secrets-manager","aws-cloudwatch","aws-glue","aws-athena"] },
  { id: "azure",     label: "Microsoft Azure",         color: "#0078D4", items: ["azure-blob","azure-functions","azure-sql","azure-cosmos","azure-openai","azure-ai-foundry","azure-aks","azure-service-bus","azure-monitor","azure-cdn","azure-keyvault"] },
  { id: "gcp",       label: "Google Cloud",            color: "#4285F4", items: ["gcp-gcs","gcp-cloud-functions","gcp-bigquery","gcp-vertex-ai","gcp-pub-sub","gcp-cloud-run","gcp-firestore","gcp-gke","gcp-spanner"] },
  { id: "databricks",label: "Databricks",              color: "#FF3621", items: ["databricks-workspace","databricks-mlflow","databricks-delta","databricks-unity","databricks-agentbricks"] },
  { id: "messaging", label: "Messaging & Streaming",   color: "#FF6600", items: ["kafka","rabbitmq","twilio","nats"] },
  { id: "data",      label: "Databases & Cache",       color: "#336791", items: ["postgres","mongodb","redis","elasticsearch","mysql","neo4j","cassandra","cockroachdb","supabase"] },
  { id: "ai",        label: "AI & LLMs",               color: "#10a37f", items: ["openai","anthropic","langchain","huggingface","ollama","pinecone","weaviate","qdrant","cohere"] },
  { id: "infra",     label: "Infrastructure & DevOps", color: "#326CE5", items: ["docker","kubernetes","nginx","terraform","github-actions","jenkins","prometheus","grafana","datadog","cloudflare"] },
  { id: "api",       label: "API, Auth & Payments",    color: "#635BFF", items: ["graphql","grpc","stripe","auth0"] },
  { id: "frontend",  label: "Frontend & Deployment",   color: "#61DAFB", items: ["react","nextjs","vercel"] },
  { id: "generic",   label: "Generic Components",      color: "#6B7280", items: ["user","browser","mobile","server","database","api","queue","cache","cdn","microservice","gateway","firewall","vpn","load-balancer","monitoring","scheduler","webhook"] },
];

// ─── ZONE PRESETS ─────────────────────────────────────────────────────────────
const ZONE_PRESETS = [
  { id: "vpc",      label: "VPC",               color: "#f97316", bg: "#f9731608" },
  { id: "subnet",   label: "Subnet",            color: "#3b82f6", bg: "#3b82f608" },
  { id: "region",   label: "Region",            color: "#8b5cf6", bg: "#8b5cf608" },
  { id: "k8s",      label: "K8s Cluster",       color: "#326CE5", bg: "#326CE508" },
  { id: "az",       label: "Availability Zone", color: "#10b981", bg: "#10b98108" },
  { id: "swimlane", label: "Swimlane",          color: "#6366f1", bg: "#6366f108" },
  { id: "boundary", label: "System Boundary",   color: "#94a3b8", bg: "#94a3b808" },
  { id: "private",  label: "Private Network",   color: "#f43f5e", bg: "#f43f5e08" },
  { id: "dmz",      label: "DMZ",               color: "#fb923c", bg: "#fb923c08" },
];

// ─── ARCH NODE ────────────────────────────────────────────────────────────────
function ArchNode({ data, selected }) {
  const meta = ICON_MAP[data.iconId] || ICON_MAP["server"];
  const catColor = meta.bg || "#6B7280";
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "8px 6px 5px",
        background: selected ? `${catColor}20` : "rgba(255,255,255,0.03)",
        border: `2px solid ${selected ? catColor : "transparent"}`,
        borderRadius: 12, cursor: "pointer", minWidth: 76,
        transition: "all 0.15s", backdropFilter: "blur(4px)",
        position: "relative"
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.border = `2px solid ${catColor}66`; e.currentTarget.style.background = `${catColor}10`; }}}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.border = "2px solid transparent"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}}
    >
      <Handle type="source" position={Position.Top} id="top" className="arch-handle" />
      <Handle type="source" position={Position.Right} id="right" className="arch-handle" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="arch-handle" />
      <Handle type="source" position={Position.Left} id="left" className="arch-handle" />
      <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 5 }}>
        <Icon icon={meta.icon} width={32} height={32} />
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--pg-text, #e6edf3)", fontFamily: "'DM Mono',monospace", textAlign: "center", maxWidth: 84, lineHeight: 1.25, wordBreak: "break-word" }}>{data.label}</div>
      {data.sub && <div style={{ fontSize: 8, color: "var(--pg-text3, #8b949e)", textAlign: "center", fontFamily: "'DM Mono',monospace", marginTop: 2, maxWidth: 84 }}>{data.sub}</div>}
    </div>
  );
}

// ─── ZONE NODE ────────────────────────────────────────────────────────────────
function ZoneNode({ data, selected }) {
  return (
    <div style={{ width: data.width || 340, height: data.height || 220, border: `2px dashed ${data.color || "#6B7280"}`, borderRadius: 14, background: data.bg || "transparent", position: "relative", boxSizing: "border-box" }}>
      <Handle type="source" position={Position.Top} id="top" className="arch-handle" />
      <Handle type="source" position={Position.Right} id="right" className="arch-handle" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="arch-handle" />
      <Handle type="source" position={Position.Left} id="left" className="arch-handle" />
      <div style={{ position: "absolute", top: -11, left: 14, background: "var(--pg-bg, #0f1117)", padding: "1px 10px", fontSize: 9.5, fontWeight: 800, color: data.color || "#6B7280", fontFamily: "'DM Mono',monospace", letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: 4, border: `1px solid ${data.color || "#6B7280"}44` }}>{data.label}</div>
      {selected && <div style={{ position: "absolute", inset: 3, borderRadius: 10, border: `1px solid ${data.color || "#6B7280"}`, opacity: 0.3, pointerEvents: "none" }} />}
    </div>
  );
}

// ─── TEXT NODE ────────────────────────────────────────────────────────────────
function TextNode({ id, data, selected }) {
  const { setNodes } = useReactFlow();
  const updateText = (e) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, text: e.target.value } } : n));
  };
  return (
    <div style={{ padding: "8px", minWidth: 100, border: selected ? "1px dashed #818cf8" : "1px dashed transparent", position: "relative" }}>
      <Handle type="source" position={Position.Top} id="top" className="arch-handle" />
      <Handle type="source" position={Position.Right} id="right" className="arch-handle" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="arch-handle" />
      <Handle type="source" position={Position.Left} id="left" className="arch-handle" />
      <textarea
        defaultValue={data.text || ""}
        onChange={updateText}
        placeholder="Type text..."
        style={{
          background: "transparent", border: "none", color: "var(--pg-text, #e6edf3)",
          fontSize: data.fontSize || 14, fontWeight: data.fontWeight || 500,
          resize: "none", outline: "none", width: "100%", height: "100%",
          fontFamily: "'DM Mono',monospace", overflow: "hidden"
        }}
      />
    </div>
  );
}

// ─── SHAPE NODE ───────────────────────────────────────────────────────────────
function ShapeNode({ data, selected }) {
  const isCircle = data.shapeType === "circle";
  return (
    <div style={{
      width: data.width || 120, height: data.height || 120,
      background: data.bg || "rgba(255,255,255,0.05)",
      border: `2px solid ${data.color || "#6B7280"}`,
      borderRadius: isCircle ? "50%" : Math.min(8, (data.width||120)*0.1),
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative"
    }}>
      <Handle type="source" position={Position.Top} id="top" className="arch-handle" />
      <Handle type="source" position={Position.Right} id="right" className="arch-handle" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="arch-handle" />
      <Handle type="source" position={Position.Left} id="left" className="arch-handle" />
      {data.label && <div style={{ color: "var(--pg-text, #e6edf3)", fontSize: 12, fontFamily: "'DM Mono',monospace", textAlign: "center" }}>{data.label}</div>}
      {selected && <div style={{ position: "absolute", inset: -4, borderRadius: isCircle ? "50%" : 10, border: "1px dashed #818cf8", opacity: 0.5, pointerEvents: "none" }} />}
    </div>
  );
}

const NODE_TYPES = { archNode: ArchNode, zoneNode: ZoneNode, textNode: TextNode, shapeNode: ShapeNode };

// ─── CUSTOM EDGE ──────────────────────────────────────────────────────────────
function LabelledEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, markerEnd, style }) {
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} style={style} />
      {data?.label && (
        <EdgeLabelRenderer>
          <div style={{ position: "absolute", transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`, background: "var(--pg-bg, #0f1117)", border: "1px solid var(--pg-border, #30363d)", borderRadius: 4, padding: "2px 7px", fontSize: 9, color: "var(--pg-text2, #c9d1d9)", fontFamily: "'DM Mono',monospace", pointerEvents: "all", whiteSpace: "nowrap" }}>{data.label}</div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const EDGE_TYPES = { labelled: LabelledEdge };

// ─── MAIN CANVAS ──────────────────────────────────────────────────────────────
function ArchCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [search, setSearch]           = useState("");
  const [openCats, setOpenCats]       = useState({});
  const [diagramName, setDiagramName] = useState("Untitled Diagram");
  const [editingName, setEditingName] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showAI, setShowAI]           = useState(false);
  const [aiPrompt, setAiPrompt]       = useState("");
  const [aiLoading, setAiLoading]     = useState(false);
  const [snapGrid, setSnapGrid]       = useState(false);
  const [sideTab, setSideTab]         = useState("icons");
  const [history, setHistory]         = useState([]);
  const [histIdx, setHistIdx]         = useState(-1);
  const rfWrapper = useRef(null);
  const nodeIdRef = useRef(1);
  const rfi = useReactFlow();
  const getId = () => `arch-${nodeIdRef.current++}`;

  // ── History ────────────────────────────────────────────────────────────────
  const snapshot = useCallback(() => {
    const snap = { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) };
    setHistory(h => [...h.slice(0, histIdx + 1), snap]);
    setHistIdx(i => i + 1);
  }, [nodes, edges, histIdx]);

  const undo = () => { if (histIdx < 1) return; const p = history[histIdx - 1]; setNodes(p.nodes); setEdges(p.edges); setHistIdx(i => i - 1); };
  const redo = () => { if (histIdx >= history.length - 1) return; const n = history[histIdx + 1]; setNodes(n.nodes); setEdges(n.edges); setHistIdx(i => i + 1); };

  // ── Connect ────────────────────────────────────────────────────────────────
  const onConnect = useCallback((params) => {
    snapshot();
    setEdges(eds => addEdge({ ...params, type: "labelled", animated: false, style: { stroke: "#6b7280", strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: "#6b7280" }, data: { label: "" } }, eds));
  }, [snapshot]);

  // ── Drag & Drop ────────────────────────────────────────────────────────────
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; };
  const onDrop = useCallback((e) => {
    e.preventDefault();
    const iconId = e.dataTransfer.getData("arch/iconId");
    const label  = e.dataTransfer.getData("arch/label");
    const sub    = e.dataTransfer.getData("arch/sub");
    if (!iconId) return;
    const bounds = rfWrapper.current.getBoundingClientRect();
    const pos = rfi.screenToFlowPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    snapshot();
    setNodes(ns => [...ns, { id: getId(), type: "archNode", position: snapGrid ? { x: Math.round(pos.x / 20) * 20, y: Math.round(pos.y / 20) * 20 } : pos, data: { iconId, label, sub } }]);
  }, [rfi, snapshot, snapGrid]);

  // ── Add Zone ───────────────────────────────────────────────────────────────
  const addZone = (preset) => {
    snapshot();
    const pos = rfi.screenToFlowPosition({ x: 260, y: 200 });
    setNodes(ns => [...ns, { id: getId(), type: "zoneNode", position: pos, style: { zIndex: -1 }, data: { label: preset.label, color: preset.color, bg: preset.bg } }]);
  };

  const addTextNode = () => {
    snapshot();
    const pos = rfi.screenToFlowPosition({ x: 400, y: 200 });
    setNodes(ns => [...ns, { id: getId(), type: "textNode", position: pos, data: { text: "Double click to edit..." } }]);
  };

  const addShapeNode = (shapeType) => {
    snapshot();
    const pos = rfi.screenToFlowPosition({ x: 400, y: 200 });
    setNodes(ns => [...ns, { id: getId(), type: "shapeNode", position: pos, data: { shapeType, width: 120, height: shapeType === "rectangle" ? 80 : 120, color: "#8b949e", bg: "rgba(139,148,158,0.1)" } }]);
  };

  // ── AI Generation ──────────────────────────────────────────────────────────
  const generateFromAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const availableIds = Object.keys(ICON_MAP).join(", ");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Generate a React Flow architecture diagram JSON for: "${aiPrompt}".

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "nodes": [
    { "id": "1", "type": "archNode", "position": {"x": 100, "y": 150}, "data": { "iconId": "aws-lambda", "label": "Lambda", "sub": "Serverless" } }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "type": "labelled", "data": { "label": "invoke" } }
  ]
}

Available iconIds (ONLY use these exact strings): ${availableIds}

Rules:
- Pick the most accurate iconId for each component from the list above
- Space nodes 220px apart horizontally, 160px vertically in a logical left-to-right flow
- Max 14 nodes, max 16 edges
- Every edge source and target must reference valid node ids
- Return ONLY the raw JSON object, nothing else`
          }]
        }),
      });
      const result = await res.json();
      const text = (result.content || []).map(b => b.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      snapshot();
      setNodes(parsed.nodes || []);
      setEdges((parsed.edges || []).map(e => ({ ...e, type: "labelled", animated: false, style: { stroke: "#6b7280", strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: "#6b7280" }, data: e.data || { label: "" } })));
      setTimeout(() => rfi.fitView({ padding: 0.12 }), 120);
      setShowAI(false);
      setAiPrompt("");
    } catch (err) {
      alert("AI generation failed: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // ── Export ─────────────────────────────────────────────────────────────────
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ name: diagramName, nodes, edges }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${diagramName}.json`; a.click();
  };
  const exportPNG = async () => {
    try {
      const { toPng } = await import("html-to-image");
      const el = rfWrapper.current?.querySelector(".react-flow__renderer");
      if (!el) return;
      const url = await toPng(el, { backgroundColor: "#0f1117", pixelRatio: 2 });
      const a = document.createElement("a"); a.href = url; a.download = `${diagramName}.png`; a.click();
    } catch { alert("PNG export requires: npm install html-to-image"); }
  };

  // ── Filtered categories ────────────────────────────────────────────────────
  const filteredCats = CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.map(id => ({ id, ...ICON_MAP[id] })).filter(item =>
      !search ||
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.sub.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => !search || cat.items.length > 0);

  return (
    <div style={{ display: "flex", flex: 1, height: "100%", background: "var(--pg-bg, #0f1117)", fontFamily: "'DM Mono','Fira Code',monospace", overflow: "hidden" }}>

      {/* ═══ SIDEBAR ════════════════════════════════════════════════════════ */}
      <div style={{ width: 234, minWidth: 234, background: "var(--pg-sidebar, #161b22)", borderRight: "1px solid var(--pg-border, #30363d)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--pg-border, #30363d)" }}>
          {[{ id: "icons", label: "Icons" }, { id: "zones", label: "Zones" }].map(t => (
            <button key={t.id} onClick={() => setSideTab(t.id)}
              style={{ flex: 1, background: "none", border: "none", padding: "10px 6px", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: sideTab === t.id ? "var(--pg-text, #e6edf3)" : "var(--pg-text3, #8b949e)", borderBottom: `2px solid ${sideTab === t.id ? "var(--pg-accent, #818cf8)" : "transparent"}`, transition: "all 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {sideTab === "icons" ? (<>
          {/* Search */}
          <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--pg-border, #30363d)" }}>
            <div style={{ position: "relative" }}>
              <Search size={11} color="#8b949e" style={{ position: "absolute", left: 9, top: 8 }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search icons..."
                style={{ width: "100%", background: "var(--pg-panel, #1c2128)", border: "1px solid var(--pg-border2, #21262d)", borderRadius: 6, color: "var(--pg-text, #e6edf3)", fontSize: 11, padding: "6px 8px 6px 28px", outline: "none", fontFamily: "'DM Mono',monospace", boxSizing: "border-box" }} />
            </div>
          </div>

          {/* Category list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredCats.map(cat => {
              const isOpen = !!openCats[cat.id];
              return (
                <div key={cat.id}>
                  <button onClick={() => setOpenCats(p => ({ ...p, [cat.id]: !isOpen }))}
                    style={{ width: "100%", background: "none", border: "none", padding: "7px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "'DM Mono',monospace" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--pg-panel, #1c2128)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: isOpen ? "var(--pg-text, #e6edf3)" : "var(--pg-text3, #8b949e)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{cat.label}</span>
                      <span style={{ fontSize: 9, color: "var(--pg-text3, #8b949e)", background: "var(--pg-border2, #21262d)", borderRadius: 3, padding: "1px 4px" }}>{cat.items.length}</span>
                    </div>
                    {isOpen ? <ChevronDown size={10} color="#8b949e" /> : <ChevronRight size={10} color="#8b949e" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: "2px 8px 6px" }}>
                      {cat.items.map(item => (
                        <div key={item.id} draggable
                          onDragStart={e => { e.dataTransfer.setData("arch/iconId", item.id); e.dataTransfer.setData("arch/label", item.label); e.dataTransfer.setData("arch/sub", item.sub); }}
                          style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 6px", borderRadius: 7, cursor: "grab", marginBottom: 1, transition: "background 0.1s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--pg-panel, #1c2128)"}
                          onMouseLeave={e => e.currentTarget.style.background = "none"}>
                          {/* Real brand icon */}
                          <div style={{ width: 32, height: 32, borderRadius: 7, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon icon={item.icon} width={22} height={22} />
                          </div>
                          <div>
                            <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--pg-text, #e6edf3)" }}>{item.label}</div>
                            <div style={{ fontSize: 8.5, color: "var(--pg-text3, #8b949e)" }}>{item.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>) : (
          /* Zones tab */
          <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
            <div style={{ fontSize: 9, color: "var(--pg-text3, #8b949e)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 4px 10px" }}>Click to add a zone to canvas</div>
            {ZONE_PRESETS.map(z => (
              <button key={z.id} onClick={() => addZone(z)}
                style={{ width: "100%", background: z.bg, border: `1.5px dashed ${z.color}`, borderRadius: 8, padding: "9px 12px", cursor: "pointer", marginBottom: 6, fontFamily: "'DM Mono',monospace", textAlign: "left", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = z.color + "20"; }}
                onMouseLeave={e => { e.currentTarget.style.background = z.bg; }}>
                <div style={{ width: 10, height: 10, border: `2px dashed ${z.color}`, borderRadius: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 10.5, fontWeight: 700, color: z.color }}>{z.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Stats */}
        <div style={{ padding: "10px 12px", borderTop: "1px solid var(--pg-border, #30363d)" }}>
          <div style={{ background: "rgba(129,140,248,0.05)", border: "1px solid var(--pg-border, #30363d)", borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 9, color: "var(--pg-accent, #818cf8)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Canvas</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--pg-text, #e6edf3)" }}>{nodes.length} nodes · {edges.length} edges</div>
          </div>
        </div>
      </div>

      {/* ═══ CANVAS AREA ════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ height: 46, background: "var(--pg-sidebar, #161b22)", borderBottom: "1px solid var(--pg-border, #30363d)", display: "flex", alignItems: "center", padding: "0 12px", gap: 6, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: "var(--pg-accent, #818cf8)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
            <Layers size={11} /> Architecture
          </div>
          <div style={{ width: 1, height: 14, background: "var(--pg-border, #30363d)" }} />
          {editingName
            ? <input autoFocus value={diagramName} onChange={e => setDiagramName(e.target.value)} onBlur={() => setEditingName(false)} onKeyDown={e => e.key === "Enter" && setEditingName(false)}
                style={{ background: "var(--pg-panel, #1c2128)", border: "1px solid #818cf8", borderRadius: 5, color: "var(--pg-text, #e6edf3)", fontSize: 11, padding: "2px 7px", fontFamily: "'DM Mono',monospace", outline: "none", width: 200 }} />
            : <span onClick={() => setEditingName(true)} style={{ fontSize: 11, color: "var(--pg-text, #e6edf3)", cursor: "text", padding: "2px 6px", borderRadius: 4, border: "1px solid transparent", transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#30363d"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>{diagramName}</span>
          }
          <div style={{ flex: 1 }} />

          <button onClick={undo} disabled={histIdx < 1} title="Undo" style={{ background: "none", border: "1px solid var(--pg-border2, #21262d)", borderRadius: 5, color: histIdx < 1 ? "#30363d" : "#8b949e", padding: "4px 7px", cursor: histIdx < 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}><RotateCcw size={12} /></button>
          <button onClick={redo} disabled={histIdx >= history.length - 1} title="Redo" style={{ background: "none", border: "1px solid var(--pg-border2, #21262d)", borderRadius: 5, color: histIdx >= history.length - 1 ? "#30363d" : "#8b949e", padding: "4px 7px", cursor: histIdx >= history.length - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}><RotateCw size={12} /></button>
          <div style={{ width: 1, height: 14, background: "var(--pg-border, #30363d)" }} />

          <button onClick={() => setSnapGrid(g => !g)} title="Snap to Grid" style={{ background: snapGrid ? "#818cf822" : "none", border: `1px solid ${snapGrid ? "#818cf8" : "var(--pg-border2, #21262d)"}`, borderRadius: 5, color: snapGrid ? "#818cf8" : "#8b949e", padding: "4px 7px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 9.5 }}><Grid size={12} /> Snap</button>
          <button onClick={() => setShowMinimap(m => !m)} title="Toggle Minimap" style={{ background: showMinimap ? "#818cf822" : "none", border: `1px solid ${showMinimap ? "#818cf8" : "var(--pg-border2, #21262d)"}`, borderRadius: 5, color: showMinimap ? "#818cf8" : "#8b949e", padding: "4px 7px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 9.5 }}><Maximize2 size={12} /> Map</button>
          <button onClick={() => rfi.fitView({ padding: 0.12 })} title="Fit View" style={{ background: "none", border: "1px solid var(--pg-border2, #21262d)", borderRadius: 5, color: "#8b949e", padding: "4px 7px", cursor: "pointer", display: "flex", alignItems: "center" }}><MousePointer size={12} /></button>
          <button onClick={() => { if (window.confirm("Clear canvas?")) { snapshot(); setNodes([]); setEdges([]); }}} title="Clear" style={{ background: "none", border: "1px solid var(--pg-border2, #21262d)", borderRadius: 5, color: "#8b949e", padding: "4px 7px", cursor: "pointer", display: "flex", alignItems: "center" }}><Trash2 size={12} /></button>
          <div style={{ width: 1, height: 14, background: "var(--pg-border, #30363d)" }} />

          <button onClick={addTextNode} title="Add Text" style={{ background: "none", border: "1px solid var(--pg-border2, #21262d)", borderRadius: 5, color: "#8b949e", padding: "4px 7px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 9.5 }}><Type size={12} /> Text</button>
          <button onClick={() => addShapeNode('rectangle')} title="Add Rectangle" style={{ background: "none", border: "1px solid var(--pg-border2, #21262d)", borderRadius: 5, color: "#8b949e", padding: "4px 7px", cursor: "pointer", display: "flex", alignItems: "center" }}><Square size={12} /></button>
          <button onClick={() => addShapeNode('circle')} title="Add Circle" style={{ background: "none", border: "1px solid var(--pg-border2, #21262d)", borderRadius: 5, color: "#8b949e", padding: "4px 7px", cursor: "pointer", display: "flex", alignItems: "center" }}><Circle size={12} /></button>
          <div style={{ width: 1, height: 14, background: "var(--pg-border, #30363d)" }} />

          <button onClick={() => setShowAI(true)} style={{ background: "linear-gradient(135deg,#818cf8,#a78bfa)", border: "none", borderRadius: 6, color: "#fff", fontSize: 9.5, fontWeight: 700, padding: "5px 11px", cursor: "pointer", fontFamily: "'DM Mono',monospace", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 5 }}>
            <Sparkles size={11} /> AI Generate
          </button>
          <button onClick={() => { const c = window.prompt("Export:\n1 = PNG\n2 = JSON"); if (c === "1") exportPNG(); else if (c === "2") exportJSON(); }} style={{ background: "none", border: "1px solid var(--pg-border2, #21262d)", borderRadius: 5, color: "#8b949e", fontSize: 9.5, padding: "4px 9px", cursor: "pointer", fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", gap: 4 }}>
            <Download size={11} /> Export
          </button>
        </div>

        {/* ReactFlow Canvas */}
        <div ref={rfWrapper} style={{ flex: 1, position: "relative" }} onDragOver={onDragOver} onDrop={onDrop}>
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionMode={ConnectionMode.Loose}
            nodeTypes={NODE_TYPES} edgeTypes={EDGE_TYPES}
            snapToGrid={snapGrid} snapGrid={[20, 20]}
            fitView minZoom={0.1} maxZoom={3}
            deleteKeyCode="Delete"
            style={{ background: "var(--pg-bg, #0f1117)" }}
          >
            <Background color="#1c2128" gap={24} size={1} />
            <Controls showInteractive={false} style={{ background: "var(--pg-sidebar, #161b22)", border: "1px solid var(--pg-border, #30363d)", borderRadius: 8 }} />
            {showMinimap && <MiniMap nodeColor={n => ICON_MAP[n.data?.iconId]?.bg || "#6B7280"} style={{ background: "var(--pg-sidebar, #161b22)", border: "1px solid var(--pg-border, #30363d)", borderRadius: 8 }} />}
          </ReactFlow>

          {nodes.length === 0 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.2 }}>🏗️</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--pg-text3, #8b949e)", marginBottom: 8 }}>Start building your architecture</div>
              <div style={{ fontSize: 11, color: "#6b7280", textAlign: "center", lineHeight: 1.8 }}>← Drag official brand icons from the sidebar<br/>or click <b style={{ color: "#818cf8" }}>✨ AI Generate</b> to auto-create from a description</div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ AI MODAL ═══════════════════════════════════════════════════════ */}
      {showAI && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={e => { if (e.target === e.currentTarget) setShowAI(false); }}>
          <div style={{ background: "var(--pg-sidebar, #161b22)", border: "1px solid #818cf8", borderRadius: 14, padding: 28, width: 540, maxWidth: "92vw", boxShadow: "0 24px 70px rgba(0,0,0,0.7)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Sparkles size={15} color="#818cf8" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: "var(--pg-text, #e6edf3)" }}>AI Architecture Generator</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--pg-text3, #8b949e)" }}>Describe your system — Claude places real brand icons automatically</div>
              </div>
              <button onClick={() => setShowAI(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8b949e" }}><X size={16} /></button>
            </div>

            <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={4}
              placeholder="e.g. A RAG pipeline with AWS Bedrock, S3, Lambda, API Gateway, and Pinecone vector DB"
              style={{ width: "100%", background: "var(--pg-panel, #1c2128)", border: "1px solid var(--pg-border2, #21262d)", borderRadius: 8, color: "var(--pg-text, #e6edf3)", fontSize: 12, padding: "10px 12px", outline: "none", resize: "vertical", fontFamily: "'DM Mono',monospace", lineHeight: 1.6, boxSizing: "border-box", marginBottom: 12 }}
              onFocus={e => e.target.style.borderColor = "#818cf8"}
              onBlur={e => e.target.style.borderColor = "var(--pg-border2, #21262d)"}
              onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generateFromAI(); }}
            />

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Quick prompts</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {[
                  "AWS serverless REST API with DynamoDB and Cognito",
                  "Kubernetes microservices with Kafka and Redis",
                  "RAG pipeline with Azure OpenAI and Cosmos DB",
                  "Databricks MLOps with Delta Lake and MLflow",
                  "Multi-cloud with Cloudflare, AWS and GCP",
                  "Real-time pipeline with Kafka and Elasticsearch",
                ].map(p => (
                  <button key={p} onClick={() => setAiPrompt(p)}
                    style={{ background: "#818cf811", border: "1px solid #818cf833", borderRadius: 4, color: "#818cf8", fontSize: 9, padding: "3px 8px", cursor: "pointer", fontFamily: "'DM Mono',monospace" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#818cf822"}
                    onMouseLeave={e => e.currentTarget.style.background = "#818cf811"}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowAI(false)} style={{ flex: 1, background: "none", border: "1px solid var(--pg-border, #30363d)", borderRadius: 7, color: "#8b949e", fontSize: 11, padding: "9px", cursor: "pointer", fontFamily: "'DM Mono',monospace" }}>Cancel</button>
              <button onClick={generateFromAI} disabled={aiLoading || !aiPrompt.trim()} style={{ flex: 3, background: aiLoading ? "#818cf844" : "linear-gradient(135deg,#818cf8,#a78bfa)", border: "none", borderRadius: 7, color: "#fff", fontSize: 11, fontWeight: 700, padding: "9px", cursor: aiLoading ? "not-allowed" : "pointer", fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {aiLoading ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Generating…</> : <><Sparkles size={13} /> Generate Diagram</>}
              </button>
            </div>
            <div style={{ marginTop: 8, fontSize: 9, color: "#6b7280", textAlign: "center" }}>⌘ + Enter to generate</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .react-flow__node { cursor: grab; }
        .react-flow__node:active { cursor: grabbing; }
        .react-flow__controls button { background: var(--pg-sidebar, #161b22) !important; color: var(--pg-text3, #8b949e) !important; border-bottom: 1px solid var(--pg-border, #30363d) !important; }
        .react-flow__controls button:hover { background: var(--pg-panel, #1c2128) !important; }
        .react-flow__attribution { display: none !important; }
        .react-flow__handle.arch-handle { width: 8px; height: 8px; background: #818cf8; border: 2px solid #0f1117; opacity: 0; transition: opacity 0.2s; }
        .react-flow__node:hover .react-flow__handle.arch-handle { opacity: 1; }
      `}</style>
    </div>
  );
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export default function ArchitectureDesign() {
  return (
    <ReactFlowProvider>
      <ArchCanvas />
    </ReactFlowProvider>
  );
}