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
  Type, Square, Circle, Cloud, Boxes, Database, Brain, Server,
  Key, Box, Activity, LayoutTemplate, MessageSquare, PanelLeft
} from "lucide-react";
import { generateArchitectureDiagram } from "../../services/aiService";
import * as LucideIcons from "lucide-react";

// Helper for dynamic Lucide icons
const LucideIcon = ({ name, size = 11, color }) => {
  const C = LucideIcons[name] || LucideIcons.Box;
  return <C size={size} color={color} />;
};

// ─── ICON REGISTRY ────────────────────────────────────────────────────────────
// Uses @iconify/react "logos:" + "simple-icons:" sets
const ICON_MAP = {
  // ── AWS ───────────────────────────────────────────────────────────────────
  "aws-s3":              { icon: "logos:amazon-s3",               label: "S3",               sub: "Object Storage",    bg: "#FF9900" },
  "aws-lambda":          { icon: "logos:aws-lambda",               label: "Lambda",           sub: "Serverless",        bg: "#FF9900" },
  "aws-ec2":             { icon: "logos:aws-ec2",                  label: "EC2",              sub: "Compute",           bg: "#FF9900" },
  "aws-rds":             { icon: "logos:aws-rds",                  label: "RDS",              sub: "Relational DB",     bg: "#FF9900" },
  "aws-bedrock":         { icon: "logos:aws-bedrock",              label: "Bedrock",          sub: "AI Services",       bg: "#FF9900" },
  "aws-sqs":             { icon: "logos:amazon-sqs",              label: "SQS",              sub: "Message Queue",     bg: "#FF9900" },
  "aws-sns":             { icon: "logos:amazon-sns",              label: "SNS",              sub: "Notification",      bg: "#FF9900" },
  "aws-api-gateway":     { icon: "logos:aws-api-gateway",          label: "API Gateway",      sub: "API Mgmt",          bg: "#FF9900" },
  "aws-cloudfront":      { icon: "logos:aws-cloudfront",           label: "CloudFront",       sub: "CDN",               bg: "#FF9900" },
  "aws-cognito":         { icon: "logos:aws-cognito",              label: "Cognito",          sub: "Identity",          bg: "#FF9900" },
  "aws-elb":             { icon: "logos:aws-elb",                  label: "Load Balancer",    sub: "Traffic Dist",      bg: "#FF9900" },
  "aws-ecs":             { icon: "logos:aws-ecs",                  label: "ECS",              sub: "Containers",        bg: "#FF9900" },
  "aws-eks":             { icon: "logos:aws-eks",                  label: "EKS",              sub: "Managed K8s",       bg: "#FF9900" },
  "aws-dynamodb":        { icon: "logos:amazon-dynamodb",          label: "DynamoDB",         sub: "NoSQL DB",          bg: "#FF9900" },
  "aws-kinesis":         { icon: "logos:aws-kinesis",              label: "Kinesis",          sub: "Streaming",         bg: "#FF9900" },
  "aws-step-functions":  { icon: "logos:aws-step-functions",       label: "Step Functions",   sub: "Workflows",         bg: "#FF9900" },
  "aws-secrets-manager": { icon: "logos:aws-secrets-manager",      label: "Secrets",          sub: "Vault",             bg: "#FF9900" },
  "aws-cloudwatch":      { icon: "logos:amazon-cloudwatch",        label: "CloudWatch",       sub: "Monitoring",        bg: "#FF9900" },
  "aws-glue":            { icon: "logos:aws-glue",                 label: "Glue",             sub: "ETL",               bg: "#FF9900" },
  "aws-athena":          { icon: "logos:aws-athena",               label: "Athena",           sub: "Query Service",     bg: "#FF9900" },
  "aws-route53":         { icon: "logos:aws-route53",              label: "Route 53",         sub: "DNS",               bg: "#FF9900" },
  "aws-iam":             { icon: "logos:aws-iam",                  label: "IAM",              sub: "Access Mgmt",       bg: "#FF9900" },
  "aws-cloudtrail":      { icon: "logos:aws-cloudtrail",           label: "CloudTrail",       sub: "Audit Logs",        bg: "#FF9900" },
  "aws-shield":          { icon: "logos:aws-shield",               label: "Shield",           sub: "DDoS Protect",      bg: "#FF9900" },

  // ── AZURE ─────────────────────────────────────────────────────────────────
  "azure-blob":          { icon: "logos:azure-blob-storage",       label: "Blob",             sub: "Object Storage",    bg: "#0078D4" },
  "azure-functions":     { icon: "logos:azure-functions",          label: "Functions",        sub: "Serverless",        bg: "#0078D4" },
  "azure-sql":           { icon: "logos:azure-sql",                label: "SQL",              sub: "Relational DB",     bg: "#0078D4" },
  "azure-cosmos":        { icon: "logos:azure-cosmos-db",          label: "Cosmos DB",        sub: "NoSQL DB",          bg: "#0078D4" },
  "azure-openai":        { icon: "logos:openai-icon",             label: "Azure OpenAI",     sub: "AI Models",         bg: "#0078D4" },
  "azure-ai-foundry":    { icon: "logos:microsoft-azure",          label: "AI Foundry",       sub: "GenAI Platform",    bg: "#5C2D91" },
  "azure-aks":           { icon: "logos:azure-kubernetes-service", label: "AKS",              sub: "Kubernetes",        bg: "#0078D4" },
  "azure-service-bus":   { icon: "logos:azure-service-bus",        label: "Service Bus",      sub: "Messaging",         bg: "#0078D4" },
  "azure-monitor":       { icon: "logos:azure-monitor",            label: "Monitor",          sub: "Observability",     bg: "#0078D4" },
  "azure-cdn":           { icon: "logos:azure-cdn",                label: "CDN",              sub: "Edge Network",      bg: "#0078D4" },
  "azure-keyvault":      { icon: "logos:azure-key-vault",          label: "Key Vault",        sub: "Secrets",           bg: "#0078D4" },
  "azure-pipelines":     { icon: "logos:azure-pipelines",          label: "Pipelines",        sub: "CI/CD",             bg: "#0078D4" },
  "azure-devops":        { icon: "logos:azure-devops",             label: "DevOps",           sub: "Platform",          bg: "#0078D4" },

  // ── GCP ───────────────────────────────────────────────────────────────────
  "gcp-gcs":             { icon: "logos:google-cloud-storage",    label: "GCS",              sub: "Object Storage",    bg: "#4285F4" },
  "gcp-cloud-functions": { icon: "logos:google-cloud-functions",  label: "Cloud Functions",  sub: "Serverless",        bg: "#4285F4" },
  "gcp-bigquery":        { icon: "logos:google-cloud-bigquery",    label: "BigQuery",         sub: "Data Warehouse",    bg: "#4285F4" },
  "gcp-vertex-ai":       { icon: "logos:google-cloud-vertex-ai",   label: "Vertex AI",        sub: "AI Platform",       bg: "#4285F4" },
  "gcp-pub-sub":         { icon: "logos:google-cloud-pubsub",      label: "Pub/Sub",          sub: "Messaging",         bg: "#4285F4" },
  "gcp-cloud-run":       { icon: "logos:google-cloud-run",        label: "Cloud Run",        sub: "Containers",        bg: "#4285F4" },
  "gcp-firestore":       { icon: "logos:google-cloud-firestore",  label: "Firestore",        sub: "NoSQL DB",          bg: "#4285F4" },
  "gcp-gke":             { icon: "logos:google-cloud-kubernetes-engine",label: "GKE",        sub: "Managed K8s",       bg: "#4285F4" },
  "gcp-spanner":         { icon: "simple-icons:googlecloudspanner",label: "Spanner",          sub: "Distributed SQL",   bg: "#4285F4" },
  "gcp-bigtable":        { icon: "simple-icons:googlecloudbigtable",label: "Bigtable",        sub: "NoSQL DB",          bg: "#4285F4" },

  // ── DATABRICKS ────────────────────────────────────────────────────────────
  "databricks-workspace":{ icon: "logos:databricks",               label: "Workspace",        sub: "Notebooks",         bg: "#FF3621" },
  "databricks-mlflow":   { icon: "logos:mlflow",                   label: "MLflow",           sub: "Ops",               bg: "#FF3621" },
  "databricks-delta":    { icon: "logos:databricks-icon",          label: "Delta Lake",       sub: "Storage",           bg: "#FF3621" },
  "databricks-unity":    { icon: "logos:databricks-icon",          label: "Unity Catalog",    sub: "Governance",        bg: "#FF3621" },
  "databricks-agentbricks": { icon: "logos:databricks-icon",       label: "AgentBricks",      sub: "AI Agents",         bg: "#FF3621" },

  // ── MESSAGING & TOOLS ─────────────────────────────────────────────────────
  "kafka":               { icon: "logos:kafka",                   label: "Kafka",            sub: "Streaming",         bg: "#000000" },
  "rabbitmq":            { icon: "logos:rabbitmq-icon",           label: "RabbitMQ",         sub: "Message Queue",     bg: "#FF6600" },
  "twilio":              { icon: "logos:twilio-icon",             label: "Twilio",           sub: "Comm API",          bg: "#F22F46" },
  "nats":                { icon: "logos:nats-icon",               label: "NATS",             sub: "JetStream",         bg: "#27AAE1" },
  "slack":               { icon: "logos:slack-icon",              label: "Slack",            sub: "Chat Ops",          bg: "#4A154B" },
  "discord":             { icon: "logos:discord-icon",            label: "Discord",          sub: "Comm",              bg: "#5865F2" },
  "pagerduty":           { icon: "logos:pagerduty-icon",          label: "PagerDuty",        sub: "Incidents",         bg: "#00A23E" },

  // ── DATABASES & STORAGE ───────────────────────────────────────────────────
  "postgres":            { icon: "logos:postgresql",              label: "PostgreSQL",       sub: "Relational DB",     bg: "#336791" },
  "mongodb":             { icon: "logos:mongodb-icon",            label: "MongoDB",          sub: "NoSQL DB",          bg: "#47A248" },
  "redis":               { icon: "logos:redis",                   label: "Redis",            sub: "Cache",             bg: "#DC382D" },
  "elasticsearch":       { icon: "logos:elasticsearch",           label: "Elasticsearch",    sub: "Search Engine",     bg: "#005571" },
  "mysql":               { icon: "logos:mysql",                   label: "MySQL",            sub: "Relational DB",     bg: "#4479A1" },
  "neo4j":               { icon: "logos:neo4j",                   label: "Neo4j",            sub: "Graph DB",          bg: "#008CC1" },
  "cassandra":           { icon: "logos:cassandra",               label: "Cassandra",        sub: "Columnar DB",       bg: "#1287B1" },
  "cockroachdb":         { icon: "logos:cockroachdb-icon",        label: "CockroachDB",      sub: "Distributed DB",    bg: "#6933FF" },
  "supabase":            { icon: "logos:supabase-icon",           label: "Supabase",         sub: "BaaS",              bg: "#3ECF8E" },
  "snowflake":           { icon: "logos:snowflake-icon",          label: "Snowflake",        sub: "Data Cloud",        bg: "#29B5E8" },
  "scylladb":            { icon: "simple-icons:scylladb",         label: "ScyllaDB",         sub: "NoSQL DB",          bg: "#4B5563" },
  "clickhouse":          { icon: "logos:clickhouse-icon",         label: "ClickHouse",       sub: "OLAP DB",           bg: "#FFCC01" },
  "upstash":             { icon: "logos:upstash-icon",            label: "Upstash",          sub: "Serverless DB",     bg: "#00E9A3" },
  "tidb":                { icon: "logos:tidb-icon",               label: "TiDB",             sub: "Distributed SQL",   bg: "#3B82F6" },
  "influxdb":            { icon: "logos:influxdb-icon",           label: "InfluxDB",         sub: "Time Series",       bg: "#22ADF6" },

  // ── AI & LLMS ─────────────────────────────────────────────────────────────
  "openai":              { icon: "logos:openai-icon",             label: "OpenAI",           sub: "GPT-4o",            bg: "#10a37f" },
  "anthropic":           { icon: "logos:anthropic-icon",          label: "Anthropic",        sub: "Claude 3.5",        bg: "#D97706" },
  "mistral":             { icon: "logos:mistral-ai-icon",         label: "Mistral",          sub: "Mistral Large",     bg: "#000000" },
  "meta_llama":          { icon: "logos:meta-icon",               label: "Meta Llama",       sub: "Llama 3.1",         bg: "#0668E1" },
  "deepseek":            { icon: "logos:deepseek-icon",           label: "DeepSeek",         sub: "V2.5",              bg: "#2D5CFE" },
  "perplexity":          { icon: "logos:perplexity-icon",         label: "Perplexity",       sub: "Search AI",         bg: "#191919" },
  "ollama":              { icon: "simple-icons:ollama",           label: "Ollama",           sub: "Local LLMs",        bg: "#000000" },
  "langchain":           { icon: "simple-icons:langchain",         label: "LangChain",        sub: "Orchestration",     bg: "#000000" },
  "huggingface":         { icon: "logos:huggingface-icon",        label: "Hugging Face",     sub: "Model Hub",         bg: "#FFD21E" },
  "pinecone":            { icon: "logos:pinecone-icon",           label: "Pinecone",         sub: "Vector DB",         bg: "#000000" },
  "milvus":              { icon: "logos:milvus-icon",             label: "Milvus",           sub: "Vector DB",         bg: "#4B5563" },
  "chroma":              { icon: "logos:chroma",                  label: "Chroma",           sub: "Vector DB",         bg: "#4B5563" },
  "weaviate":            { icon: "carbon:cloud-data-ops",         label: "Weaviate",         sub: "Vector DB",         bg: "#4B5563" },
  "qdrant":              { icon: "logos:qdrant-icon",             label: "Qdrant",           sub: "Vector DB",         bg: "#FF4A4A" },
  "cohere":              { icon: "carbon:brain",                  label: "Cohere",           sub: "LLM Provider",      bg: "#4B5563" },
  "pytorch":             { icon: "logos:pytorch-icon",            label: "PyTorch",          sub: "Deep Learning",     bg: "#EE4C2C" },
  "tensorflow":          { icon: "logos:tensorflow",              label: "TensorFlow",       sub: "ML Framework",      bg: "#FF6F00" },
  "dask":                { icon: "simple-icons:dask",            label: "Dask",             sub: "Parallel Computing", bg: "#4B5563" },

  // ── INFRASTRUCTURE ────────────────────────────────────────────────────────
  "docker":              { icon: "logos:docker-icon",             label: "Docker",           sub: "Containers",        bg: "#2496ED" },
  "kubernetes":          { icon: "logos:kubernetes",              label: "Kubernetes",       sub: "Orchestration",     bg: "#326CE5" },
  "nginx":               { icon: "logos:nginx",                   label: "NGINX",            sub: "Web Server",        bg: "#009639" },
  "terraform":           { icon: "logos:terraform-icon",          label: "Terraform",        sub: "IaC",               bg: "#7B42BC" },
  "github-actions":      { icon: "logos:github-actions",          label: "GitHub Actions",   sub: "CI/CD",             bg: "#2088FF" },
  "jenkins":             { icon: "logos:jenkins",                 label: "Jenkins",          sub: "Automation",        bg: "#D24939" },
  "prometheus":          { icon: "logos:prometheus",              label: "Prometheus",       sub: "Monitoring",        bg: "#E6522C" },
  "grafana":             { icon: "logos:grafana",                 label: "Grafana",          sub: "Dashboards",        bg: "#F46800" },
  "datadog":             { icon: "logos:datadog",                 label: "Datadog",          sub: "Observations",       bg: "#632CA6" },
  "cloudflare":          { icon: "logos:cloudflare",              label: "Cloudflare",       sub: "Security/CDN",      bg: "#F38020" },
  "sentry":              { icon: "logos:sentry-icon",             label: "Sentry",           sub: "Error Tracking",    bg: "#362D59" },
  "postman":             { icon: "logos:postman-icon",            label: "Postman",          sub: "API Testing",       bg: "#FF6C37" },

  // ── API & WEB ─────────────────────────────────────────────────────────────
  "graphql":             { icon: "logos:graphql",                 label: "GraphQL",          sub: "Query Lang",        bg: "#E10098" },
  "grpc":                { icon: "simple-icons:grpc",             label: "gRPC",             sub: "RPC Framework",     bg: "#244c5a" },
  "stripe":              { icon: "logos:stripe",                  label: "Stripe",           sub: "Payments",          bg: "#008CDD" },
  "auth0":               { icon: "logos:auth0-icon",              label: "Auth0",            sub: "Authentication",     bg: "#EB5424" },
  "react":               { icon: "logos:react",                   label: "React",            sub: "UI Library",        bg: "#61DAFB" },
  "nextjs":              { icon: "logos:nextjs-icon",             label: "Next.js",          sub: "Framework",         bg: "#000000" },
  "vercel":              { icon: "logos:vercel-icon",             label: "Vercel",           sub: "Hosting",           bg: "#000000" },

  // ── GENERIC & TOOLS ───────────────────────────────────────────────────────
  "user":                { icon: "logos:chrome",                  label: "User",             sub: "End User",          bg: "#4B5563" },
  "browser":             { icon: "logos:chrome",                  label: "Browser",          sub: "Web Client",        bg: "#4B5563" },
  "mobile":              { icon: "logos:apple-app-store",          label: "Mobile",           sub: "iOS/Android",       bg: "#4B5563" },
  "server":              { icon: "logos:ubuntu",                  label: "Server",           sub: "Compute Node",      bg: "#4B5563" },
  "database":            { icon: "logos:postgresql",              label: "Database",         sub: "Data Store",        bg: "#4B5563" },
  "api":                 { icon: "carbon:api",                    label: "API",              sub: "Endpoint",          bg: "#4B5563" },
  "queue":               { icon: "carbon:queue",                  label: "Queue",            sub: "Message Buffer",    bg: "#4B5563" },
  "cache":               { icon: "logos:redis",                   label: "Cache",            sub: "Fast Storage",      bg: "#4B5563" },
  "cdn":                 { icon: "logos:cloudflare",              label: "CDN",              sub: "Edge Network",      bg: "#4B5563" },
  "microservice":        { icon: "carbon:cube",                   label: "Microservice",     sub: "App Component",     bg: "#4B5563" },
  "gateway":             { icon: "carbon:gateway",                label: "Gateway",          sub: "API Entry",         bg: "#4B5563" },
  "firewall":            { icon: "carbon:firewall",               label: "Firewall",         sub: "Security",          bg: "#4B5563" },
  "vpn":                 { icon: "carbon:vpn",                    label: "VPN",              sub: "Secure Tunnel",     bg: "#4B5563" },
  "load-balancer":       { icon: "carbon:load-balancer-global",   label: "LB",               sub: "Traffic Dist",      bg: "#4B5563" },
  "monitoring":          { icon: "logos:grafana",                 label: "Observability",    sub: "Metrics",           bg: "#4B5563" },
  "scheduler":           { icon: "carbon:timer",                  label: "Scheduler",        sub: "Cron Job",          bg: "#4B5563" },
  "webhook":             { icon: "carbon:webhook",                label: "Webhook",          sub: "Event Trigger",     bg: "#4B5563" },
};

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "aws",       label: "Amazon Web Services",     color: "#fb923c", icon: "Cloud",         items: ["aws-s3","aws-lambda","aws-ec2","aws-rds","aws-bedrock","aws-sqs","aws-sns","aws-api-gateway","aws-cloudfront","aws-cognito","aws-elb","aws-ecs","aws-eks","aws-dynamodb","aws-kinesis","aws-step-functions","aws-secrets-manager","aws-cloudwatch","aws-glue","aws-athena","aws-route53","aws-iam","aws-cloudtrail","aws-shield"] },
  { id: "azure",     label: "Microsoft Azure",         color: "#60a5fa", icon: "Cloud",         items: ["azure-blob","azure-functions","azure-sql","azure-cosmos","azure-openai","azure-ai-foundry","azure-aks","azure-service-bus","azure-monitor","azure-cdn","azure-keyvault","azure-pipelines","azure-devops"] },
  { id: "gcp",       label: "Google Cloud",            color: "#38bdf8", icon: "Cloud",         items: ["gcp-gcs","gcp-cloud-functions","gcp-bigquery","gcp-vertex-ai","gcp-pub-sub","gcp-cloud-run","gcp-firestore","gcp-gke","gcp-spanner","gcp-bigtable"] },
  { id: "databricks",label: "Databricks",              color: "#f87171", icon: "Boxes",         items: ["databricks-workspace","databricks-mlflow","databricks-delta","databricks-unity","databricks-agentbricks"] },
  { id: "messaging", label: "Messaging & Tools",       color: "#fb923c", icon: "MessageSquare", items: ["kafka","rabbitmq","twilio","nats","slack","discord","pagerduty"] },
  { id: "data",      label: "Databases & Storage",     color: "#60a5fa", icon: "Database",      items: ["postgres","mongodb","redis","elasticsearch","mysql","neo4j","cassandra","cockroachdb","supabase","snowflake","scylladb","clickhouse","upstash","tidb","influxdb"] },
  { id: "ai",        label: "AI & LLMs",               color: "#10b981", icon: "Brain",         items: ["openai","anthropic","mistral","meta_llama","deepseek","perplexity","ollama","langchain","huggingface","pinecone","milvus","chroma","weaviate","qdrant","cohere","pytorch","tensorflow","dask"] },
  { id: "infra",     label: "Infrastructure & DevOps", color: "#818cf8", icon: "Server",        items: ["docker","kubernetes","nginx","terraform","github-actions","jenkins","prometheus","grafana","datadog","cloudflare","sentry"] },
  { id: "api",       label: "API, Auth & Payments",    color: "#a78bfa", icon: "Key",           items: ["graphql","grpc","stripe","auth0","postman"] },
  { id: "frontend",  label: "Frontend & Deployment",   color: "#22d3ee", icon: "Layout",        items: ["react","nextjs","vercel"] },
  { id: "generic",   label: "Generic Components",      color: "#94a3b8", icon: "Cpu",           items: ["user","browser","mobile","server","database","api","queue","cache","cdn","microservice","gateway","firewall","vpn","load-balancer","monitoring","scheduler","webhook"] },
];

// ─── ZONE PRESETS ─────────────────────────────────────────────────────────────
const ZONE_PRESETS = [
  { id: "vpc",      label: "VPC",               color: "#fb923c", bg: "#fb923c08" },
  { id: "subnet",   label: "Subnet",            color: "#60a5fa", bg: "#60a5fa08" },
  { id: "region",   label: "Region",            color: "#818cf8", bg: "#818cf808" },
  { id: "k8s",      label: "K8s Cluster",       color: "#38bdf8", bg: "#38bdf808" },
  { id: "az",       label: "Availability Zone", color: "#10b981", bg: "#10b98108" },
  { id: "swimlane", label: "Swimlane",          color: "#818cf8", bg: "#818cf808" },
  { id: "boundary", label: "System Boundary",   color: "#94a3b8", bg: "#94a3b808" },
  { id: "private",  label: "Private Network",   color: "#f87171", bg: "#f8717108" },
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
        padding: "10px 8px 8px",
        background: selected ? `linear-gradient(135deg, ${catColor}22, ${catColor}11)` : "rgba(255,255,255,0.02)",
        border: `1.5px solid ${selected ? catColor : "rgba(255,255,255,0.05)"}`,
        borderRadius: 14, cursor: "pointer", minWidth: 84,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)", backdropFilter: "blur(8px)",
        position: "relative",
        boxShadow: selected ? `0 8px 24px -8px ${catColor}44` : "0 4px 6px -1px rgba(0,0,0,0.1)",
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = `${catColor}66`;
          e.currentTarget.style.background = `linear-gradient(135deg, ${catColor}11, transparent)`;
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      <Handle type="source" position={Position.Top} id="top" className="arch-handle" />
      <Handle type="source" position={Position.Right} id="right" className="arch-handle" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="arch-handle" />
      <Handle type="source" position={Position.Left} id="left" className="arch-handle" />

      {/* Glossy Icon Container */}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: "rgba(0,0,0,0.3)",
        border: `1.5px solid ${catColor}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 8,
        boxShadow: `0 4px 12px -2px rgba(0,0,0,0.2)`
      }}>
        <Icon icon={meta.icon} width={28} height={28} />
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--pg-text, #e6edf3)", fontFamily: "'DM Mono',monospace", textAlign: "center", maxWidth: 90, lineHeight: 1.3, letterSpacing: "-0.01em" }}>{data.label}</div>
      {data.sub && <div style={{ fontSize: 8, color: "#8b949e", textAlign: "center", fontFamily: "'DM Mono',monospace", marginTop: 2, maxWidth: 90, opacity: 0.8 }}>{data.sub}</div>}

      {/* Selection Glow */}
      {selected && <div style={{ position: "absolute", inset: -4, borderRadius: 18, border: `1px solid ${catColor}33`, pointerEvents: "none" }} />}
    </div>
  );
}

// ─── ZONE NODE ────────────────────────────────────────────────────────────────
function ZoneNode({ data, selected }) {
  const borderColor = data.color || "#6B7280";
  return (
    <div style={{
      width: data.width || 340, height: data.height || 220,
      border: `2px dashed ${borderColor}66`,
      borderRadius: 16,
      background: data.bg || "rgba(255,255,255,0.01)",
      position: "relative",
      boxSizing: "border-box",
      backdropFilter: "blur(2px)",
      transition: "all 0.2s"
    }}>
      <Handle type="source" position={Position.Top} id="top" className="arch-handle" />
      <Handle type="source" position={Position.Right} id="right" className="arch-handle" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="arch-handle" />
      <Handle type="source" position={Position.Left} id="left" className="arch-handle" />

      {/* Zone Label Tag */}
      <div style={{
        position: "absolute", top: -12, left: 16,
        background: "var(--pg-bg, #0f1117)",
        padding: "2px 12px",
        fontSize: 10, fontWeight: 800,
        color: borderColor,
        fontFamily: "'DM Mono',monospace",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        borderRadius: 6,
        border: `1px solid ${borderColor}88`,
        boxShadow: `0 4px 12px -2px rgba(0,0,0,0.3)`
      }}>
        {data.label}
      </div>

      {/* Inner Highlight for selection */}
      {selected && (
        <div style={{
          position: "absolute", inset: -2, borderRadius: 18,
          border: `2px solid ${borderColor}`,
          opacity: 0.4, pointerEvents: "none"
        }} />
      )}
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
  const [showSidebar, setShowSidebar] = useState(true);
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
      const parsed = await generateArchitectureDiagram(aiPrompt, availableIds);
      
      snapshot();
      setNodes(parsed.nodes || []);
      setEdges((parsed.edges || []).map(e => ({
        ...e,
        type: "labelled",
        animated: false,
        style: { stroke: "#6b7280", strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: "#6b7280" },
        data: e.data || { label: "" }
      })));
      
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
      {showSidebar && (
      <div style={{ width: 234, minWidth: 234, background: "var(--pg-sidebar, #161b22)", borderRight: "1px solid var(--pg-border, #30363d)", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--pg-border, #30363d)" }}>
          {[{ id: "icons", label: "Icons", icon: "Layers" }, { id: "zones", label: "Zones", icon: "LayoutTemplate" }].map(t => (
            <button key={t.id} onClick={() => setSideTab(t.id)}
              style={{ flex: 1, background: "none", border: "none", padding: "10px 6px", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: sideTab === t.id ? "var(--pg-text, #e6edf3)" : "var(--pg-text3, #8b949e)", borderBottom: `2px solid ${sideTab === t.id ? "var(--pg-accent, #818cf8)" : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s" }}>
              <LucideIcon name={t.icon} size={11} color={sideTab === t.id ? "var(--pg-accent, #818cf8)" : "currentColor"} />
              {t.label}
            </button>
          ))}
        </div>

        {sideTab === "icons" ? (<>
          {/* Search */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--pg-border, #30363d)" }}>
            <div style={{ position: "relative" }}>
              <Search size={12} color="#8b949e" style={{ position: "absolute", left: 10, top: 9 }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..."
                style={{ width: "100%", background: "var(--pg-panel, #1c2128)", border: "1px solid var(--pg-border2, #21262d)", borderRadius: 6, color: "var(--pg-text, #e6edf3)", fontSize: 11, padding: "7px 10px 7px 30px", outline: "none", fontFamily: "'DM Mono',monospace", boxSizing: "border-box" }} />
            </div>
          </div>

          {/* Category list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredCats.map(cat => {
              const isOpen = !!openCats[cat.id];
              return (
                <div key={cat.id}>
                  <button onClick={() => setOpenCats(p => ({ ...p, [cat.id]: !isOpen }))}
                    style={{ width: "100%", background: "none", border: "none", padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "'DM Mono',monospace", transition: "all 0.2s", borderRadius: 6, margin: "2px 0" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--pg-panel, #1c2128)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: isOpen ? `${cat.color}11` : "transparent", border: isOpen ? `1px solid ${cat.color}33` : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                        <LucideIcon name={cat.icon} size={11} color={isOpen ? cat.color : "#8b949e"} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: isOpen ? "var(--pg-text, #e6edf3)" : "#8b949e", letterSpacing: "0.02em" }}>{cat.label}</span>
                      <span style={{ fontSize: 9, color: "#8b949e", background: "var(--pg-border2, #21262d)", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>{cat.items.length}</span>
                    </div>
                    {isOpen ? <ChevronDown size={11} color="#8b949e" /> : <ChevronRight size={11} color="#8b949e" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: "2px 8px 6px" }}>
                      {cat.items.map(item => (
                        <div key={item.id} draggable
                          onDragStart={e => { e.dataTransfer.setData("arch/iconId", item.id); e.dataTransfer.setData("arch/label", item.label); e.dataTransfer.setData("arch/sub", item.sub); }}
                          style={{ margin: "2px 0", padding: "6px 8px", background: "rgba(255,255,255,0.01)", border: `1px solid ${cat.color}22`, borderRadius: 7, cursor: "grab", display: "flex", alignItems: "center", gap: 9, transition: "all 0.12s", userSelect: "none" }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${cat.color}11`; e.currentTarget.style.borderColor = `${cat.color}44`; e.currentTarget.style.transform = "translateX(3px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.01)"; e.currentTarget.style.borderColor = `${cat.color}22`; e.currentTarget.style.transform = "translateX(0)"; }}>
                          {/* Real brand icon */}
                          <div style={{ width: 32, height: 32, borderRadius: 7, background: "rgba(0,0,0,0.2)", border: `1px solid ${cat.color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon icon={item.icon} width={22} height={22} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--pg-text, #e6edf3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</div>
                            <div style={{ fontSize: 8.5, color: "#8b949e", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.sub}</div>
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
      )}

      {/* ═══ CANVAS AREA ════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ height: 46, background: "var(--pg-sidebar, #161b22)", borderBottom: "1px solid var(--pg-border, #30363d)", display: "flex", alignItems: "center", padding: "0 12px", gap: 6, flexShrink: 0 }}>
          {/* Sidebar toggle */}
          <button
            onClick={() => setShowSidebar(s => !s)}
            title="Toggle Sidebar"
            style={{ background: showSidebar ? "#818cf822" : "none", border: `1px solid ${showSidebar ? "#818cf855" : "var(--pg-border2, #21262d)"}`, borderRadius: 5, color: showSidebar ? "#818cf8" : "#8b949e", cursor: "pointer", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}
          >
            <PanelLeft size={13} />
          </button>
          <div style={{ width: 1, height: 14, background: "var(--pg-border, #30363d)" }} />
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