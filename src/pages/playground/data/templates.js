import { MarkerType } from "reactflow";

const E = (id, source, target, label = "") => ({
  id, source, target, label, animated: true,
  style: { stroke: "#818cf8", strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "#818cf8", width: 14, height: 14 },
  labelStyle: { fill: "#94a3b8", fontSize: 9, fontFamily: "'DM Mono',monospace" },
  labelBgStyle: { fill: "#161b22", fillOpacity: 0.9 },
  labelBgPadding: [4, 2],
  labelBgBorderRadius: 3,
});

const N = (id, x, y, label, icon, sub, nodeType, colorKey) => ({
  id, type: "genai", position: { x, y },
  data: { label, icon, sub, nodeType, colorKey, status: "planned", collapsed: false },
});

export const TEMPLATES = [

  {
    id: "rag_basic", label: "Basic RAG Pipeline", icon: "BookOpen", tags: ["rag", "retrieval"],
    description: "Classic PDF ingestion → chunking → embedding → vector store → retrieval → rerank → LLM → response",
    nodes: [
      N("r1",  60,  160, "PDF / Docs",    "FileText",    "Unstructured text",    "datasource", "datasource"),
      N("r2",  280, 160, "Text Chunker",  "Layers",      "Recursive split",      "processing", "processing"),
      N("r3",  500, 160, "Embedder",      "CircuitBoard","ada-002 / E5",          "processing", "processing"),
      N("r4",  720, 160, "Pinecone",      "Database",    "Managed vector store", "vectordb",   "vectordb"),
      N("r5",  60,  360, "User Input",    "MessageSquare","Query entry",          "io",         "io"),
      N("r6",  500, 360, "Reranker",      "Filter",      "Cross-encoder",        "processing", "processing"),
      N("r7",  720, 360, "GPT-4o",        "Sparkles",    "OpenAI",               "llm",        "llm"),
      N("r8",  940, 360, "Final Response","Zap",         "Answer to user",       "io",         "io"),
    ],
    edges: [
      E("re1","r1","r2","docs"), E("re2","r2","r3","chunks"), E("re3","r3","r4","embeddings"),
      E("re4","r5","r6","query"), E("re5","r4","r6","top-k"), E("re6","r6","r7","context"),
      E("re7","r7","r8","tokens"),
    ],
  },
  {
    id: "react_agent", label: "ReAct Agent", icon: "Bot", tags: ["agent", "tools"],
    description: "User → Agent with tools (Web Search + Code Exec) + Short-Term Memory → Claude 3.5 + Guardrails → Response",
    nodes: [
      N("a1",  60,  200, "User Input",    "MessageSquare","Chat entry",           "io",         "io"),
      N("a2",  60,  380, "Short-Term Mem","Zap",          "Chat history",         "memory",     "memory"),
      N("a3",  300, 200, "ReAct Agent",   "Bot",          "Reason + Act loop",    "agent",      "agent"),
      N("a4",  560, 80,  "Web Search",    "Search",       "Tavily / SerpAPI",     "tool",       "tool"),
      N("a5",  560, 240, "Code Executor", "Code2",        "Sandboxed runtime",    "tool",       "tool"),
      N("a6",  800, 200, "Claude 3.5",    "Brain",        "Anthropic",            "llm",        "llm"),
      N("a7",  800, 380, "Guardrails",    "Shield",       "Safety filter",        "processing", "processing"),
      N("a8",  1040,200, "Final Response","Zap",          "Answer to user",       "io",         "io"),
    ],
    edges: [
      E("ae1","a1","a3","text"), E("ae2","a2","a3","memory"), E("ae3","a3","a4","tool_call"),
      E("ae4","a3","a5","tool_call"), E("ae5","a4","a6","docs"), E("ae6","a5","a6","json"),
      E("ae7","a6","a7","tokens"), E("ae8","a7","a8","text"),
    ],
  },
  {
    id: "aws_bedrock", label: "AWS Bedrock Agent", icon: "Cloud", tags: ["aws", "agent"],
    description: "S3 docs → Bedrock Knowledge Base → Bedrock Agent + Lambda tools + DynamoDB → Guardrails → Response",
    nodes: [
      N("w1",  60,  180, "S3 Bucket",      "FolderOpen","Object storage",         "aws",        "aws"),
      N("w2",  300, 180, "Knowledge Base", "BookOpen",  "Bedrock KB",             "aws",        "aws"),
      N("w3",  540, 180, "Bedrock Agents", "Bot",       "Managed agent runtime",  "aws",        "aws"),
      N("w4",  540, 60,  "AWS Bedrock",    "Cloud",     "Foundation model API",   "aws",        "aws"),
      N("w5",  780, 100, "AWS Lambda",     "Zap",       "Serverless function",    "aws",        "aws"),
      N("w6",  780, 260, "DynamoDB",       "Database",  "Session state storage",  "aws",        "aws"),
      N("w7",  1000,180, "Guardrails",     "Shield",    "Safety filter",          "processing", "processing"),
      N("w8",  1220,180, "Final Response", "Zap",       "Answer to user",         "io",         "io"),
    ],
    edges: [
      E("we1","w1","w2","docs"), E("we2","w2","w3","context"), E("we3","w4","w3","tokens"),
      E("we4","w3","w5","tool_call"), E("we5","w3","w6","json"), E("we6","w5","w7","json"),
      E("we7","w7","w8","text"),
    ],
  },
  {
    id: "multi_agent", label: "Multi-Agent System", icon: "Network", tags: ["agent", "multi"],
    description: "Supervisor routes tasks to specialized sub-agents (Research, Code, Writer) sharing long-term memory",
    nodes: [
      N("m1",  60,  220, "User Input",     "MessageSquare","Query entry",          "io",         "io"),
      N("m2",  300, 220, "Supervisor",     "Layers",      "Route sub-agents",      "agent",      "agent"),
      N("m3",  560, 80,  "Research Agent", "Search",      "Web + knowledge",       "agent",      "agent"),
      N("m4",  560, 220, "Code Agent",     "Code2",       "Code gen & exec",       "agent",      "agent"),
      N("m5",  560, 360, "Writer Agent",   "FileText",    "Content generation",    "agent",      "agent"),
      N("m6",  300, 400, "Long-Term Mem",  "MemoryStick", "Shared agent memory",   "memory",     "memory"),
      N("m7",  820, 220, "GPT-4o",         "Sparkles",    "OpenAI",                "llm",        "llm"),
      N("m8",  1060,220, "Final Response", "Zap",         "Answer to user",        "io",         "io"),
    ],
    edges: [
      E("me1","m1","m2","text"), E("me2","m2","m3","text"), E("me3","m2","m4","text"),
      E("me4","m2","m5","text"), E("me5","m6","m2","memory"), E("me6","m3","m7","docs"),
      E("me7","m4","m7","json"), E("me8","m5","m7","text"), E("me9","m7","m8","tokens"),
    ],
  },
  {
  id: "agentic_rag",
  label: "Agentic RAG System",
  icon: "Bot",
  tags: ["agent", "rag"],
  description: "Planner → Retriever Agent → LLM → Critic → Response",
  nodes: [
    N("ar1", 60, 220, "User Input", "MessageSquare", "Query", "io", "io"),
    N("ar2", 260, 220, "Planner Agent", "Workflow", "Plan steps", "agent", "agent"),
    N("ar3", 460, 120, "Retriever Agent", "Search", "Fetch docs", "agent", "agent"),
    N("ar4", 460, 320, "Vector DB", "Database", "Context", "vectordb", "vectordb"),
    N("ar5", 660, 220, "GPT-4o", "Sparkles", "Generate", "llm", "llm"),
    N("ar6", 860, 220, "Critic Agent", "ScanSearch", "Evaluate", "agent", "agent"),
    N("ar7", 1060,220, "Final Response", "Zap", "Output", "io", "io"),
  ],
  edges: [
    E("are1","ar1","ar2","text"),
    E("are2","ar2","ar3","task"),
    E("are3","ar3","ar4","query"),
    E("are4","ar4","ar5","docs"),
    E("are5","ar5","ar6","text"),
    E("are6","ar6","ar7","text"),
  ],
},
{
  id: "voicebot_flow",
  label: "Voicebot / Voice Agent",
  icon: "MessageSquare",
  tags: ["voice", "agent"],
  description: "Speech → STT → Router → Memory → Agent → Tools → Guardrails → TTS → Audio Response",
  nodes: [
    N("v1", 60, 220, "User Speech", "Mic", "Voice input", "io", "io"),
    N("v2", 260, 220, "Speech-to-Text", "MessageSquare", "Transcribe audio", "multimodal", "multimodal"),
    N("v3", 460, 220, "Router / Intent", "Network", "Intent detection", "processing", "processing"),
    N("v4", 660, 120, "Short-Term Mem", "Zap", "Conversation history", "memory", "memory"),
    N("v5", 660, 320, "Long-Term Mem", "MemoryStick", "User memory", "memory", "memory"),
    N("v6", 860, 220, "ReAct Agent", "Bot", "Reason + Act", "agent", "agent"),
    N("v7", 1060,120, "Web Search", "Search", "External info", "tool", "tool"),
    N("v8", 1060,320, "SQL / CRM", "Database", "Customer data", "tool", "tool"),
    N("v9", 1260,220, "GPT-4o", "Sparkles", "LLM reasoning", "llm", "llm"),
    N("v10",1460,220, "Guardrails", "Shield", "Safety filter", "processing", "processing"),
    N("v11",1660,220, "Text-to-Speech", "MessageSquare", "Generate audio", "multimodal", "multimodal"),
    N("v12",1860,220, "Audio Response", "Zap", "Voice output", "io", "io"),
  ],
  edges: [
    E("ve1","v1","v2","audio"),
    E("ve2","v2","v3","text"),
    E("ve3","v3","v6","intent"),
    E("ve4","v4","v6","memory"),
    E("ve5","v5","v6","memory"),
    E("ve6","v6","v7","tool_call"),
    E("ve7","v6","v8","tool_call"),
    E("ve8","v7","v9","docs"),
    E("ve9","v8","v9","json"),
    E("ve10","v9","v10","text"),
    E("ve11","v10","v11","text"),
    E("ve12","v11","v12","audio"),
  ],
},
{
  id: "tool_assistant",
  label: "Tool Calling Assistant",
  icon: "Wrench",
  tags: ["agent", "tools"],
  description: "LLM → Tool Router → APIs → LLM → Response",
  nodes: [
    N("t1", 60, 220, "User Input", "MessageSquare", "Query", "io", "io"),
    N("t2", 260, 220, "Tool Agent", "Bot", "Function calling", "agent", "agent"),
    N("t3", 460, 120, "Web Search", "Search", "Search tool", "tool", "tool"),
    N("t4", 460, 320, "SQL Executor", "Database", "DB query", "tool", "tool"),
    N("t5", 660, 220, "GPT-4o", "Sparkles", "LLM", "llm", "llm"),
    N("t6", 860, 220, "Final Response", "Zap", "Output", "io", "io"),
  ],
  edges: [
    E("te1","t1","t2","text"),
    E("te2","t2","t3","tool_call"),
    E("te3","t2","t4","tool_call"),
    E("te4","t3","t5","docs"),
    E("te5","t4","t5","json"),
    E("te6","t5","t6","tokens"),
  ],
},
{
  id: "self_rag",
  label: "Self-RAG Architecture",
  icon: "Database",
  tags: ["rag", "self-rag"],
  description: "LLM decides whether to retrieve documents or answer directly",
  nodes: [
    N("sr1", 60, 220, "User Input", "MessageSquare", "Query", "io", "io"),
    N("sr2", 260, 220, "GPT-4o", "Sparkles", "Decide retrieve?", "llm", "llm"),
    N("sr3", 460, 120, "Retriever", "Search", "Fetch docs", "processing", "processing"),
    N("sr4", 660, 120, "Vector DB", "Database", "Knowledge", "vectordb", "vectordb"),
    N("sr5", 860, 120, "Reranker", "Filter", "Rank docs", "processing", "processing"),
    N("sr6", 1060,220, "Final LLM", "Sparkles", "Generate answer", "llm", "llm"),
    N("sr7", 1260,220, "Final Response", "Zap", "Output", "io", "io"),
  ],
  edges: [
    E("sre1","sr1","sr2","text"),
    E("sre2","sr2","sr3","retrieve"),
    E("sre3","sr3","sr4","query"),
    E("sre4","sr4","sr5","docs"),
    E("sre5","sr5","sr6","context"),
    E("sre6","sr2","sr6","direct"),
    E("sre7","sr6","sr7","tokens"),
  ],
},
{
  id: "graph_rag",
  label: "Graph RAG System",
  icon: "Network",
  tags: ["rag", "graph"],
  description: "Vector search + Knowledge graph retrieval",
  nodes: [
    N("gr1", 60, 120, "Documents", "FileText", "Docs", "datasource", "datasource"),
    N("gr2", 260, 120, "Chunker", "Layers", "Split docs", "processing", "processing"),
    N("gr3", 460, 120, "Embedder", "CircuitBoard", "Embeddings", "processing", "processing"),
    N("gr4", 660, 120, "Vector DB", "Database", "Vectors", "vectordb", "vectordb"),
    N("gr5", 260, 300, "Entity Extractor", "ScanSearch", "Entities", "processing", "processing"),
    N("gr6", 460, 300, "Knowledge Graph", "Network", "Graph DB", "store", "store"),
    N("gr7", 60, 300, "User Query", "MessageSquare", "Query", "io", "io"),
    N("gr8", 860, 220, "GPT-4o", "Sparkles", "LLM", "llm", "llm"),
    N("gr9", 1060,220, "Final Response", "Zap", "Output", "io", "io"),
  ],
  edges: [
    E("gre1","gr1","gr2","docs"),
    E("gre2","gr2","gr3","docs"),
    E("gre3","gr3","gr4","embeddings"),
    E("gre4","gr1","gr5","docs"),
    E("gre5","gr5","gr6","entities"),
    E("gre6","gr7","gr4","vector search"),
    E("gre7","gr7","gr6","graph search"),
    E("gre8","gr4","gr8","docs"),
    E("gre9","gr6","gr8","relations"),
    E("gre10","gr8","gr9","tokens"),
  ],
},
{
  id: "llmops_pipeline",
  label: "LLMOps Production Pipeline",
  icon: "Cloud",
  tags: ["llmops", "production"],
  description: "Production LLM system with evaluation, monitoring, logging",
  nodes: [
    N("lp1", 60, 220, "User Input", "MessageSquare", "Request", "io", "io"),
    N("lp2", 260, 220, "Authentication", "Lock", "Auth", "security", "security"),
    N("lp3", 460, 220, "Router", "Network", "Route", "processing", "processing"),
    N("lp4", 660, 120, "Memory", "MemoryStick", "User memory", "memory", "memory"),
    N("lp5", 660, 320, "Vector DB", "Database", "Knowledge", "vectordb", "vectordb"),
    N("lp6", 860, 220, "GPT-4o", "Sparkles", "LLM", "llm", "llm"),
    N("lp7", 1060,120, "LLM Evaluator", "BarChart2", "Evaluate", "eval", "eval"),
    N("lp8", 1060,320, "Logging", "BarChart2", "Logs", "observ", "observ"),
    N("lp9", 1260,220, "Monitoring", "BarChart2", "Metrics", "observ", "observ"),
    N("lp10",1460,220, "Final Response", "Zap", "Output", "io", "io"),
  ],
  edges: [
    E("lpe1","lp1","lp2","text"),
    E("lpe2","lp2","lp3","text"),
    E("lpe3","lp3","lp4","memory"),
    E("lpe4","lp3","lp5","docs"),
    E("lpe5","lp4","lp6","memory"),
    E("lpe6","lp5","lp6","context"),
    E("lpe7","lp6","lp7","text"),
    E("lpe8","lp6","lp8","signal"),
    E("lpe9","lp6","lp9","metrics"),
    E("lpe10","lp6","lp10","tokens"),
  ],
},
{
  id: "event_agent_system",
  label: "Event Driven Agent System",
  icon: "Zap",
  tags: ["event", "agent"],
  description: "Webhook/Event → Queue → Agent → Tools → DB → LLM",
  nodes: [
    N("ea1", 60, 220, "Webhook Trigger", "Webhook", "Event", "io", "io"),
    N("ea2", 260, 220, "Queue", "Database", "Message queue", "workflow", "workflow"),
    N("ea3", 460, 220, "Agent", "Bot", "Process task", "agent", "agent"),
    N("ea4", 660, 120, "REST API", "Webhook", "External API", "tool", "tool"),
    N("ea5", 660, 320, "Database", "Database", "Store data", "store", "store"),
    N("ea6", 860, 220, "GPT-4o", "Sparkles", "LLM", "llm", "llm"),
    N("ea7", 1060,220, "Final Response", "Zap", "Output", "io", "io"),
  ],
  edges: [
    E("eae1","ea1","ea2","event"),
    E("eae2","ea2","ea3","task"),
    E("eae3","ea3","ea4","api"),
    E("eae4","ea3","ea5","data"),
    E("eae5","ea4","ea6","json"),
    E("eae6","ea5","ea6","json"),
    E("eae7","ea6","ea7","tokens"),
  ],
},
{
  id: "enterprise_mcp_agent_system",
  label: "Enterprise MCP Multi-Agent System",
  icon: "Network",
  tags: ["enterprise", "agent", "mcp"],
  description: "Auth → MCP Gateway → Router → Planner → Multi Agents → Tools → Memory → LLM → Evaluation → Observability → Response",
  nodes: [
    N("x1", 60, 260, "User Input", "MessageSquare", "API / UI", "io", "io"),
    N("x2", 260, 260, "Authentication", "Lock", "OAuth / IAM", "security", "security"),
    N("x3", 460, 260, "API Gateway", "Network", "Request routing", "workflow", "workflow"),
    N("x4", 660, 260, "MCP Gateway", "Server", "Tool registry", "mcp", "mcp"),

    N("x5", 860, 120, "Router Agent", "Network", "Route tasks", "agent", "agent"),
    N("x6", 860, 260, "Planner Agent", "Workflow", "Plan tasks", "agent", "agent"),
    N("x7", 860, 400, "Coordinator Agent", "Settings", "Manage agents", "agent", "agent"),

    N("x8", 1060, 120, "Retriever Agent", "Search", "Fetch data", "agent", "agent"),
    N("x9", 1060, 260, "Worker Agent", "Wrench", "Execute task", "agent", "agent"),
    N("x10",1060, 400, "Tool Agent", "Wrench", "Call tools", "agent", "agent"),

    N("x11",1260, 80,  "Vector DB", "Database", "Knowledge", "vectordb", "vectordb"),
    N("x12",1260, 200, "SQL Database", "Database", "Structured data", "datasource", "datasource"),
    N("x13",1260, 320, "REST APIs", "Webhook", "External APIs", "tool", "tool"),
    N("x14",1260, 440, "Web Search", "Search", "Internet data", "tool", "tool"),

    N("x15",1460, 260, "Long-Term Memory", "MemoryStick", "Persistent memory", "memory", "memory"),
    N("x16",1660, 260, "GPT-4o", "Sparkles", "LLM reasoning", "llm", "llm"),

    N("x17",1860, 120, "LLM Evaluator", "BarChart2", "Evaluate output", "eval", "eval"),
    N("x18",1860, 260, "Guardrails", "Shield", "Safety filter", "processing", "processing"),
    N("x19",1860, 400, "Logging / Tracing", "BarChart2", "Observability", "observ", "observ"),

    N("x20",2060, 260, "Final Response", "Zap", "Output", "io", "io"),
  ],
  edges: [
    E("xe1","x1","x2","request"),
    E("xe2","x2","x3","auth"),
    E("xe3","x3","x4","route"),
    E("xe4","x4","x5","context"),
    E("xe5","x5","x6","task"),
    E("xe6","x6","x7","plan"),
    E("xe7","x7","x8","retrieve"),
    E("xe8","x7","x9","execute"),
    E("xe9","x7","x10","tools"),

    E("xe10","x8","x11","query"),
    E("xe11","x9","x12","sql"),
    E("xe12","x10","x13","api"),
    E("xe13","x10","x14","search"),

    E("xe14","x11","x16","docs"),
    E("xe15","x12","x16","json"),
    E("xe16","x13","x16","json"),
    E("xe17","x14","x16","docs"),
    E("xe18","x15","x16","memory"),

    E("xe19","x16","x17","text"),
    E("xe20","x16","x18","text"),
    E("xe21","x16","x19","logs"),
    E("xe22","x18","x20","response"),
  ],
},
{
  id: "ultra_enterprise_ai_platform",
  label: "Ultra Enterprise AI Platform",
  icon: "Network",
  tags: ["enterprise", "ai-platform", "agents", "rag"],
  description: "Full enterprise AI platform with auth, MCP, multi-agent, RAG, memory, evaluation, observability, storage, multimodal",
  nodes: [
    // IO / Multimodal
    N("u1", 40, 260, "User Input", "MessageSquare", "Web / App", "io", "io"),
    N("u2", 40, 380, "Speech-to-Text", "Mic", "Voice input", "multimodal", "multimodal"),

    // Security
    N("u3", 220, 260, "Authentication", "Lock", "OAuth / IAM", "security", "security"),
    N("u4", 220, 380, "Rate Limiter", "Shield", "API limits", "security", "security"),

    // Workflow / Gateway
    N("u5", 420, 260, "API Gateway", "Network", "Route request", "workflow", "workflow"),
    N("u6", 420, 380, "Scheduler / Queue", "Workflow", "Async jobs", "workflow", "workflow"),

    // MCP
    N("u7", 620, 320, "MCP Gateway", "Server", "Tool registry", "mcp", "mcp"),

    // Agents
    N("u8", 820, 120, "Router Agent", "Network", "Route tasks", "agent", "agent"),
    N("u9", 820, 260, "Planner Agent", "Workflow", "Plan tasks", "agent", "agent"),
    N("u10",820, 400, "Coordinator Agent", "Settings", "Manage agents", "agent", "agent"),

    N("u11",1020, 80,  "Retriever Agent", "Search", "Fetch docs", "agent", "agent"),
    N("u12",1020, 200, "Worker Agent", "Wrench", "Execute task", "agent", "agent"),
    N("u13",1020, 320, "Tool Agent", "Wrench", "Call APIs", "agent", "agent"),
    N("u14",1020, 440, "Critic Agent", "ScanSearch", "Evaluate", "agent", "agent"),

    // Data / Vector / Storage
    N("u15",1220, 40,  "PDF / Docs", "FileText", "Documents", "datasource", "datasource"),
    N("u16",1220, 120, "Text Chunker", "Layers", "Split docs", "processing", "processing"),
    N("u17",1220, 200, "Embedder", "CircuitBoard", "Embeddings", "processing", "processing"),
    N("u18",1220, 280, "Vector DB", "Database", "Knowledge", "vectordb", "vectordb"),
    N("u19",1220, 360, "SQL Database", "Database", "Structured data", "datasource", "datasource"),
    N("u20",1220, 440, "S3 / Blob Storage", "FolderOpen", "File storage", "store", "store"),

    // Memory
    N("u21",1420, 200, "Long-Term Memory", "MemoryStick", "Persistent memory", "memory", "memory"),
    N("u22",1420, 320, "Redis Cache", "Server", "Cache", "memory", "memory"),

    // Prompt
    N("u23",1620, 200, "System Prompt", "Settings", "Instructions", "prompt", "prompt"),
    N("u24",1620, 320, "RAG Prompt", "BookOpen", "Context injection", "prompt", "prompt"),

    // LLM
    N("u25",1820, 260, "GPT-4o", "Sparkles", "LLM", "llm", "llm"),

    // Evaluation / Observability
    N("u26",2020, 120, "LLM Evaluator", "BarChart2", "Quality check", "eval", "eval"),
    N("u27",2020, 260, "Guardrails", "Shield", "Safety", "processing", "processing"),
    N("u28",2020, 400, "Logging / Tracing", "BarChart2", "Observability", "observ", "observ"),

    // Output
    N("u29",2220, 260, "Text-to-Speech", "MessageSquare", "Voice output", "multimodal", "multimodal"),
    N("u30",2420, 260, "Final Response", "Zap", "Output", "io", "io"),
  ],

  edges: [
    E("ue1","u1","u3","request"),
    E("ue2","u2","u3","voice"),
    E("ue3","u3","u4","auth"),
    E("ue4","u4","u5","route"),
    E("ue5","u5","u6","queue"),
    E("ue6","u6","u7","context"),

    E("ue7","u7","u8","route"),
    E("ue8","u8","u9","plan"),
    E("ue9","u9","u10","coordinate"),
    E("ue10","u10","u11","retrieve"),
    E("ue11","u10","u12","execute"),
    E("ue12","u10","u13","tools"),
    E("ue13","u12","u14","review"),

    E("ue14","u15","u16","docs"),
    E("ue15","u16","u17","docs"),
    E("ue16","u17","u18","embeddings"),
    E("ue17","u18","u25","context"),
    E("ue18","u19","u25","data"),
    E("ue19","u20","u25","files"),

    E("ue20","u21","u25","memory"),
    E("ue21","u22","u25","cache"),

    E("ue22","u23","u25","prompt"),
    E("ue23","u24","u25","rag"),

    E("ue24","u25","u26","evaluate"),
    E("ue25","u25","u27","safety"),
    E("ue26","u25","u28","logs"),

    E("ue27","u27","u29","text"),
    E("ue28","u29","u30","audio"),
  ],
},
{
  id: "doc_pipeline",
  label: "Document Processing Pipeline",
  icon: "FileText",
  tags: ["etl", "documents"],
  description: "PDF → OCR → Chunk → Embed → Vector DB",
  nodes: [
    N("d1", 60, 200, "PDF / Docs", "FileText", "Documents", "datasource", "datasource"),
    N("d2", 260, 200, "OCR / Parser", "FileText", "Extract text", "processing", "processing"),
    N("d3", 460, 200, "Text Chunker", "Layers", "Split text", "processing", "processing"),
    N("d4", 660, 200, "Embedder", "CircuitBoard", "Embeddings", "processing", "processing"),
    N("d5", 860, 200, "Vector DB", "Database", "Store vectors", "vectordb", "vectordb"),
  ],
  edges: [
    E("de1","d1","d2","docs"),
    E("de2","d2","d3","docs"),
    E("de3","d3","d4","docs"),
    E("de4","d4","d5","embeddings"),
  ],
},
{
  id: "enterprise_agentic_rag",
  label: "Enterprise Agentic RAG",
  icon: "Network",
  tags: ["rag", "agent", "enterprise"],
  description: "Router → Planner → Retrieval + Tools → Rerank → LLM → Critic → Guardrails → Response",
  nodes: [
    N("e1", 60, 220, "User Input", "MessageSquare", "Query", "io", "io"),
    N("e2", 260, 220, "Router Agent", "Network", "Route intent", "agent", "agent"),
    N("e3", 460, 220, "Planner Agent", "Workflow", "Plan steps", "agent", "agent"),
    N("e4", 660, 120, "Retriever Agent", "Search", "Fetch docs", "agent", "agent"),
    N("e5", 860, 120, "Vector DB", "Database", "Knowledge", "vectordb", "vectordb"),
    N("e6", 660, 320, "Web Search", "Search", "Live data", "tool", "tool"),
    N("e7", 860, 220, "Reranker", "Filter", "Rank docs", "processing", "processing"),
    N("e8", 1060,220, "GPT-4o", "Sparkles", "LLM", "llm", "llm"),
    N("e9", 1260,220, "Critic Agent", "ScanSearch", "Evaluate", "agent", "agent"),
    N("e10",1460,220, "Guardrails", "Shield", "Safety", "processing", "processing"),
    N("e11",1660,220, "Final Response", "Zap", "Output", "io", "io"),
  ],
  edges: [
    E("ee1","e1","e2","text"),
    E("ee2","e2","e3","task"),
    E("ee3","e3","e4","retrieve"),
    E("ee4","e4","e5","query"),
    E("ee5","e6","e7","docs"),
    E("ee6","e5","e7","docs"),
    E("ee7","e7","e8","context"),
    E("ee8","e8","e9","text"),
    E("ee9","e9","e10","text"),
    E("ee10","e10","e11","text"),
  ],
},
{
  id: "multi_agent_engineer",
  label: "Multi-Agent Software Engineer",
  icon: "Boxes",
  tags: ["multi-agent"],
  description: "Manager → Task Decomposer → Worker Agents → LLM → Critic",
  nodes: [
    N("s1", 60, 220, "User Input", "MessageSquare", "Task", "io", "io"),
    N("s2", 260, 220, "Manager Agent", "Boxes", "Manage tasks", "agent", "agent"),
    N("s3", 460, 220, "Task Decomposer", "Layers", "Split tasks", "agent", "agent"),
    N("s4", 660, 120, "Worker Agent", "Wrench", "Execute task", "agent", "agent"),
    N("s5", 660, 320, "Code Executor", "Code2", "Run code", "tool", "tool"),
    N("s6", 860, 220, "GPT-4o", "Sparkles", "LLM", "llm", "llm"),
    N("s7", 1060,220, "Critic Agent", "ScanSearch", "Review output", "agent", "agent"),
    N("s8", 1260,220, "Final Response", "Zap", "Output", "io", "io"),
  ],
  edges: [
    E("se1","s1","s2","text"),
    E("se2","s2","s3","task"),
    E("se3","s3","s4","task"),
    E("se4","s4","s5","tool_call"),
    E("se5","s5","s6","json"),
    E("se6","s6","s7","text"),
    E("se7","s7","s8","text"),
  ],
},
{
  id: "production_llm_system",
  label: "Production LLM System",
  icon: "Cloud",
  tags: ["production"],
  description: "Auth → Router → Memory → RAG → LLM → Evaluation → Logs",
  nodes: [
    N("p1", 60, 220, "User Input", "MessageSquare", "Request", "io", "io"),
    N("p2", 260, 220, "Authentication", "Lock", "Auth", "security", "security"),
    N("p3", 460, 220, "Router", "Network", "Route task", "processing", "processing"),
    N("p4", 660, 120, "Long-Term Mem", "MemoryStick", "Memory", "memory", "memory"),
    N("p5", 660, 320, "Vector DB", "Database", "Knowledge", "vectordb", "vectordb"),
    N("p6", 860, 220, "GPT-4o", "Sparkles", "LLM", "llm", "llm"),
    N("p7", 1060,120, "LLM Evaluator", "BarChart2", "Evaluate", "eval", "eval"),
    N("p8", 1060,320, "Logging", "BarChart2", "Logs", "observ", "observ"),
    N("p9", 1260,220, "Final Response", "Zap", "Output", "io", "io"),
  ],
  edges: [
    E("pe1","p1","p2","text"),
    E("pe2","p2","p3","text"),
    E("pe3","p3","p4","memory"),
    E("pe4","p3","p5","docs"),
    E("pe5","p4","p6","memory"),
    E("pe6","p5","p6","context"),
    E("pe7","p6","p7","text"),
    E("pe8","p6","p8","signal"),
    E("pe9","p6","p9","tokens"),
  ],
},
{
  id: "chatbot_memory",
  label: "Chatbot with Memory",
  icon: "MessageSquare",
  tags: ["chatbot", "memory"],
  description: "User → Short-term memory → Long-term memory → LLM → Response",
  nodes: [
    N("c1", 60, 200, "User Input", "MessageSquare", "Chat entry", "io", "io"),
    N("c2", 300, 200, "Short-Term Mem", "Zap", "Chat history", "memory", "memory"),
    N("c3", 300, 350, "Long-Term Mem", "MemoryStick", "Persistent memory", "memory", "memory"),
    N("c4", 550, 200, "GPT-4o", "Sparkles", "LLM response", "llm", "llm"),
    N("c5", 800, 200, "Final Response", "Zap", "Answer to user", "io", "io"),
  ],
  edges: [
    E("ce1","c1","c2","text"),
    E("ce2","c2","c4","memory"),
    E("ce3","c3","c4","memory"),
    E("ce4","c4","c5","tokens"),
  ],
},
  {
    id: "azure_pipeline", label: "Azure AI Pipeline", icon: "Cloud", tags: ["azure", "rag"],
    description: "Blob storage → AI Search hybrid retrieval → Semantic Kernel agent → Azure OpenAI → Monitor → Response",
    nodes: [
      N("z1",  60,  180, "Azure Blob",      "FolderOpen","Object storage",         "azure",      "azure"),
      N("z2",  300, 180, "Azure AI Search", "Search",    "Hybrid + semantic",      "azure",      "azure"),
      N("z3",  540, 180, "Semantic Kernel", "Network",   "MS agent framework",     "azure",      "azure"),
      N("z4",  540, 60,  "Azure OpenAI",    "Brain",     "GPT-4o deployment",      "azure",      "azure"),
      N("z5",  780, 180, "Prompt Flow",     "Workflow",  "LLMOps orchestration",   "azure",      "azure"),
      N("z6",  1020,180, "Azure Monitor",   "BarChart2", "Observability & logs",   "azure",      "azure"),
      N("z7",  60,  340, "User Input",      "MessageSquare","Query entry",          "io",         "io"),
      N("z8",  1220,180, "Final Response",  "Zap",       "Answer to user",         "io",         "io"),
    ],
    edges: [
      E("ze1","z1","z2","docs"), E("ze2","z2","z3","context"), E("ze3","z4","z3","tokens"),
      E("ze4","z7","z3","text"), E("ze5","z3","z5","any"), E("ze6","z5","z6","signal"),
      E("ze7","z5","z8","text"),
    ],
  },
  // ──────── N8N-LIKE WORKFLOW TEMPLATES ────────
  {
    id: "n8n_http_workflow",
    label: "N8N-Style HTTP Workflow",
    icon: "Webhook",
    tags: ["n8n", "workflow", "http"],
    description: "Webhook trigger → Conditional branching → HTTP requests → Data transformation → Error handling → Response",
    nodes: [
      N("n1", 60, 220, "Webhook Trigger", "Webhook", "Event entry", "io", "io"),
      N("n2", 260, 220, "Parse JSON", "Code2", "Deserialize", "transform", "transform"),
      N("n3", 460, 220, "Conditional", "GitBranch", "Route logic", "conditional", "conditional"),
      N("n4", 660, 120, "HTTP GET", "Globe", "API request", "http", "http"),
      N("n5", 660, 320, "Database Lookup", "Database", "Query DB", "database", "database"),
      N("n6", 860, 220, "Transform Data", "Layers", "Map fields", "transform", "transform"),
      N("n7", 1060, 220, "Error Handler", "AlertCircle", "Catch & retry", "error", "error"),
      N("n8", 1260, 220, "HTTP Response", "Zap", "Send response", "http", "http"),
    ],
    edges: [
      E("ne1", "n1", "n2", "json"),
      E("ne2", "n2", "n3", "json"),
      E("ne3", "n3", "n4", "http"),
      E("ne4", "n3", "n5", "signal"),
      E("ne5", "n4", "n6", "json"),
      E("ne6", "n5", "n6", "json"),
      E("ne7", "n6", "n7", "json"),
      E("ne8", "n7", "n8", "json"),
    ],
  },
  {
    id: "n8n_loop_transform",
    label: "N8N Loop & Transform",
    icon: "Layers",
    tags: ["n8n", "loop", "etl"],
    description: "Data source → Loop node → Item-by-item transform → Batch aggregator → Output",
    nodes: [
      N("l1", 60, 220, "CSV Input", "FileText", "Read CSV", "datasource", "datasource"),
      N("l2", 260, 220, "Loop", "RefreshCw", "For each item", "loop", "loop"),
      N("l3", 460, 220, "Transform Item", "Layers", "Map fields", "transform", "transform"),
      N("l4", 660, 220, "Aggregate", "BarChart2", "Collect results", "processing", "processing"),
      N("l5", 860, 220, "Sort & Filter", "Filter", "Post-process", "processing", "processing"),
      N("l6", 1060, 220, "Output", "FileText", "Write CSV", "datasource", "datasource"),
    ],
    edges: [
      E("le1", "l1", "l2", "json"),
      E("le2", "l2", "l3", "json"),
      E("le3", "l3", "l4", "json"),
      E("le4", "l4", "l5", "json"),
      E("le5", "l5", "l6", "json"),
    ],
  },
  {
    id: "n8n_schedule_job",
    label: "N8N Scheduled Job",
    icon: "Clock",
    tags: ["n8n", "schedule", "cron"],
    description: "Cron schedule → Data fetch → Process → Email notification → DB update",
    nodes: [
      N("s1", 60, 220, "Schedule Trigger", "Clock", "Cron: Daily 9am", "schedule", "schedule"),
      N("s2", 260, 220, "API Call", "Webhook", "Fetch data", "http", "http"),
      N("s3", 460, 220, "Transform", "Layers", "Process records", "transform", "transform"),
      N("s4", 660, 120, "Email Send", "Mail", "Notify users", "email", "email"),
      N("s5", 660, 320, "Database Write", "Database", "Store results", "database", "database"),
      N("s6", 860, 220, "Completion Log", "BarChart2", "Log execution", "observ", "observ"),
    ],
    edges: [
      E("se1", "s1", "s2", "signal"),
      E("se2", "s2", "s3", "json"),
      E("se3", "s3", "s4", "json"),
      E("se4", "s3", "s5", "json"),
      E("se5", "s4", "s6", "signal"),
      E("se6", "s5", "s6", "signal"),
    ],
  },
  {
    id: "n8n_error_handling",
    label: "N8N Error Handling & Retry",
    icon: "AlertCircle",
    tags: ["n8n", "error", "retry"],
    description: "HTTP request → Retry logic → Catch error → Alternative path → Notification",
    nodes: [
      N("e1", 60, 220, "Trigger", "Zap", "Start", "io", "io"),
      N("e2", 260, 220, "HTTP Request", "Webhook", "API call", "http", "http"),
      N("e3", 460, 120, "Retry Logic", "RefreshCw", "Exponential backoff", "error", "error"),
      N("e4", 460, 320, "Error Catch", "AlertCircle", "On failure", "error", "error"),
      N("e5", 660, 220, "Fallback API", "Webhook", "Alternative source", "http", "http"),
      N("e6", 860, 120, "Alert Slack", "MessageSquare", "Notify team", "notification", "notification"),
      N("e7", 860, 320, "Log Error", "BarChart2", "Error tracking", "observ", "observ"),
      N("e8", 1060, 220, "Response", "Zap", "Final output", "io", "io"),
    ],
    edges: [
      E("ee1", "e1", "e2", "signal"),
      E("ee2", "e2", "e3", "json"),
      E("ee3", "e3", "e5", "json"),
      E("ee4", "e2", "e4", "signal"),
      E("ee5", "e4", "e5", "signal"),
      E("ee6", "e4", "e7", "json"),
      E("ee7", "e5", "e6", "json"),
      E("ee8", "e6", "e8", "signal"),
    ],
  },
  // ──────── MULTIMODAL & TTS/STT TEMPLATES ────────
  {
    id: "tts_stt_pipeline",
    label: "TTS/STT Voice Pipeline",
    icon: "Mic",
    tags: ["audio", "tts", "stt", "multimodal"],
    description: "Audio input → STT → Text processing → TTS → Audio output with voices & real-time streaming",
    nodes: [
      N("a1", 60, 220, "User Speech", "Mic", "Voice input", "io", "io"),
      N("a2", 260, 220, "Speech-to-Text", "MessageSquare", "Azure/AWS/Google STT", "audio", "audio"),
      N("a3", 460, 220, "Intent Detection", "Network", "Decode user intent", "processing", "processing"),
      N("a4", 660, 220, "LLM Response", "Sparkles", "Generate reply", "llm", "llm"),
      N("a5", 860, 220, "Text-to-Speech", "MessageSquare", "Azure/Google TTS", "audio", "audio"),
      N("a6", 1060, 120, "Voice Selection", "Settings", "Choose voice (en-US, female, etc)", "audio", "audio"),
      N("a7", 1060, 320, "Audio Streaming", "Zap", "Send audio stream", "websocket", "websocket"),
      N("a8", 1260, 220, "Speaker Output", "Zap", "Play audio", "io", "io"),
    ],
    edges: [
      E("ae1", "a1", "a2", "audio"),
      E("ae2", "a2", "a3", "text"),
      E("ae3", "a3", "a4", "text"),
      E("ae4", "a4", "a5", "text"),
      E("ae5", "a6", "a5", "signal"),
      E("ae6", "a5", "a7", "audio"),
      E("ae7", "a7", "a8", "stream"),
    ],
  },
  {
    id: "image_processing",
    label: "Image Processing Pipeline",
    icon: "Image",
    tags: ["image", "vision", "multimodal"],
    description: "Image input → OCR → Vision analysis → Image generation → Image output",
    nodes: [
      N("i1", 60, 220, "Image Upload", "ImagePlus", "User uploads image", "io", "io"),
      N("i2", 260, 220, "OCR / Text Extract", "FileText", "Extract text from image", "image", "image"),
      N("i3", 460, 120, "Vision Analysis", "Eye", "GPT-4 Vision / Claude Opus", "llm", "llm"),
      N("i4", 460, 320, "Alternative: Image Embedding", "CircuitBoard", "CLIP/BLIP embeddings", "processing", "processing"),
      N("i5", 660, 220, "Processing Decision", "GitBranch", "Route based on analysis", "conditional", "conditional"),
      N("i6", 860, 120, "Image Generation", "Sparkles", "Generate new images", "image", "image"),
      N("i7", 860, 320, "Vector DB Store", "Database", "Store embeddings", "vectordb", "vectordb"),
      N("i8", 1060, 220, "Final Output", "Zap", "Return images/data", "io", "io"),
    ],
    edges: [
      E("ie1", "i1", "i2", "image"),
      E("ie2", "i1", "i3", "image"),
      E("ie3", "i1", "i4", "image"),
      E("ie4", "i2", "i5", "text"),
      E("ie5", "i3", "i5", "json"),
      E("ie6", "i4", "i7", "embeddings"),
      E("ie7", "i5", "i6", "signal"),
      E("ie8", "i6", "i8", "image"),
      E("ie9", "i7", "i8", "signal"),
    ],
  },
  {
    id: "multimodal_input_output",
    label: "Multimodal Input/Output System",
    icon: "Zap",
    tags: ["multimodal", "io", "text", "image", "audio", "video"],
    description: "Text + Image + Audio inputs → Unified processing → Text + Audio + Image outputs",
    nodes: [
      N("m1", 40, 140, "Text Input", "MessageSquare", "User text", "io", "io"),
      N("m2", 40, 220, "Image Upload", "ImagePlus", "User image", "io", "io"),
      N("m3", 40, 300, "Audio Upload", "Mic", "User audio", "io", "io"),
      N("m4", 260, 220, "Multimodal Fusion", "Network", "Combine inputs", "processing", "processing"),
      N("m5", 460, 220, "Claude Opus Multimodal", "Sparkles", "Analyze all modalities", "llm", "llm"),
      N("m6", 660, 100, "Text Generation", "MessageSquare", "Generate text", "processing", "processing"),
      N("m7", 660, 220, "Image Generation", "Sparkles", "DALL-E 3 / Flux", "image", "image"),
      N("m8", 660, 340, "Audio Generation", "MessageSquare", "TTS synthesis", "audio", "audio"),
      N("m9", 860, 140, "Text Output", "MessageSquare", "Response text", "io", "io"),
      N("m10",860, 220, "Image Output", "ImagePlus", "Generated images", "io", "io"),
      N("m11",860, 300, "Audio Output", "Zap", "Synthesized audio", "io", "io"),
    ],
    edges: [
      E("me1", "m1", "m4", "text"),
      E("me2", "m2", "m4", "image"),
      E("me3", "m3", "m4", "audio"),
      E("me4", "m4", "m5", "any"),
      E("me5", "m5", "m6", "signal"),
      E("me6", "m5", "m7", "signal"),
      E("me7", "m5", "m8", "signal"),
      E("me8", "m6", "m9", "text"),
      E("me9", "m7", "m10", "image"),
      E("me10", "m8", "m11", "audio"),
    ],
  },
  // ──────── IN-DEPTH MCP TEMPLATES ────────
  {
    id: "mcp_multi_server_orchestration",
    label: "Multi-MCP Server Orchestration",
    icon: "Network",
    tags: ["mcp", "orchestration", "multi-tool"],
    description: "Agent → MCP Gateway → Multiple MCP servers (FS, GitHub, DB, Search, Email) → Response",
    nodes: [
      N("mo1", 60, 220, "User Query", "MessageSquare", "Task entry", "io", "io"),
      N("mo2", 260, 220, "MCP Gateway", "Server", "Route to MCPs", "mcp", "mcp"),
      N("mo3", 460, 80, "Filesystem MCP", "FolderOpen", "Read/write files", "mcp", "mcp"),
      N("mo4", 460, 180, "GitHub MCP", "Code2", "Repo operations", "mcp", "mcp"),
      N("mo5", 460, 280, "PostgreSQL MCP", "Database", "Query DB", "mcp", "mcp"),
      N("mo6", 460, 380, "Brave Search MCP", "Search", "Web search", "mcp", "mcp"),
      N("mo7", 660, 180, "Agent Coordinator", "Bot", "Orchestrate MCPs", "agent", "agent"),
      N("mo8", 860, 220, "GPT-4o", "Sparkles", "Reasoning", "llm", "llm"),
      N("mo9", 1060, 220, "Final Response", "Zap", "Output", "io", "io"),
    ],
    edges: [
      E("moe1", "mo1", "mo2", "text"),
      E("moe2", "mo2", "mo3", "signal"),
      E("moe3", "mo2", "mo4", "signal"),
      E("moe4", "mo2", "mo5", "signal"),
      E("moe5", "mo2", "mo6", "signal"),
      E("moe6", "mo3", "mo7", "docs"),
      E("moe7", "mo4", "mo7", "json"),
      E("moe8", "mo5", "mo7", "json"),
      E("moe9", "mo6", "mo7", "docs"),
      E("moe10", "mo7", "mo8", "any"),
      E("moe11", "mo8", "mo9", "text"),
    ],
  },
  {
    id: "n8n_mcp_converter",
    label: "N8N Nodes as MCP Tools",
    icon: "Webhook",
    tags: ["mcp", "n8n", "integration"],
    description: "Agent uses N8N-style MCP nodes (HTTP, Gmail, Sheets, Jira, Slack, Airtable, MongoDB, Twilio)",
    nodes: [
      N("n1", 60, 220, "Agent Request", "MessageSquare", "Task query", "io", "io"),
      N("n2", 260, 220, "HTTP Request MCP", "Webhook", "Call REST APIs", "mcp", "mcp"),
      N("n3", 460, 60, "Gmail MCP", "Mail", "Email ops", "mcp", "mcp"),
      N("n4", 460, 140, "Sheets MCP", "BarChart2", "Spreadsheet CRUD", "mcp", "mcp"),
      N("n5", 460, 220, "Jira MCP", "CheckCircle", "Issue tracking", "mcp", "mcp"),
      N("n6", 460, 300, "Slack MCP", "MessageSquare", "Ch...messaging", "mcp", "mcp"),
      N("n7", 660, 90, "Airtable MCP", "Database", "Base data", "mcp", "mcp"),
      N("n8", 660, 180, "MongoDB MCP", "Database", "Document DB", "mcp", "mcp"),
      N("n9", 660, 270, "Twilio MCP", "MessageSquare", "SMS/voice", "mcp", "mcp"),
      N("n10", 860, 180, "Data Aggregator", "Layers", "Combine results", "processing", "processing"),
      N("n11", 1060, 220, "Claude LLM", "Sparkles", "Synthesize", "llm", "llm"),
      N("n12", 1260, 220, "Response", "Zap", "Output", "io", "io"),
    ],
    edges: [
      E("nne1", "n1", "n2", "text"),
      E("nne2", "n1", "n3", "text"),
      E("nne3", "n1", "n4", "text"),
      E("nne4", "n1", "n5", "text"),
      E("nne5", "n1", "n6", "text"),
      E("nne6", "n1", "n7", "text"),
      E("nne7", "n1", "n8", "text"),
      E("nne8", "n1", "n9", "text"),
      E("nne9", "n2", "n10", "json"),
      E("nne10", "n3", "n10", "json"),
      E("nne11", "n4", "n10", "json"),
      E("nne12", "n5", "n10", "json"),
      E("nne13", "n6", "n10", "json"),
      E("nne14", "n7", "n10", "json"),
      E("nne15", "n8", "n10", "json"),
      E("nne16", "n9", "n10", "json"),
      E("nne17", "n10", "n11", "json"),
      E("nne18", "n11", "n12", "text"),
    ],
  },
  // ──────── REAL-TIME & WEBSOCKET TEMPLATES ────────
  {
    id: "websocket_realtime",
    label: "WebSocket Real-Time Agent",
    icon: "Zap",
    tags: ["websocket", "realtime", "streaming"],
    description: "WebSocket connection → Stream handler → Real-time agent → Live streaming response",
    nodes: [
      N("w1", 60, 220, "WebSocket Connect", "Zap", "Client connection", "websocket", "websocket"),
      N("w2", 260, 220, "Stream Buffer", "Layers", "Buffer incoming data", "processing", "processing"),
      N("w3", 460, 220, "Agent Process", "Bot", "Real-time reasoning", "agent", "agent"),
      N("w4", 660, 120, "GPT-4o Stream", "Sparkles", "Token streaming", "llm", "llm"),
      N("w5", 660, 320, "Memory Update", "MemoryStick", "Session memory", "memory", "memory"),
      N("w6", 860, 220, "Broadcast", "Radio", "Send to all clients", "websocket", "websocket"),
      N("w7", 1060, 220, "Client Receive", "Zap", "Frontend display", "io", "io"),
    ],
    edges: [
      E("we1", "w1", "w2", "stream"),
      E("we2", "w2", "w3", "json"),
      E("we3", "w3", "w4", "text"),
      E("we4", "w3", "w5", "memory"),
      E("we5", "w4", "w6", "stream"),
      E("we6", "w5", "w6", "signal"),
      E("we7", "w6", "w7", "stream"),
    ],
  },
  {
    id: "realtime_data_streaming",
    label: "Real-Time Data Streaming Pipeline",
    icon: "Zap",
    tags: ["realtime", "streaming", "websocket", "event"],
    description: "Event source → WebSocket stream → Real-time processing → Vector embedding → Live dashboard",
    nodes: [
      N("r1", 60, 220, "Event Source", "Radio", "Live data feed", "io", "io"),
      N("r2", 260, 220, "WebSocket Receive", "Zap", "Stream handler", "websocket", "websocket"),
      N("r3", 460, 220, "Stream Processor", "Cpu", "Real-time transform", "processing", "processing"),
      N("r4", 660, 120, "Embedder", "CircuitBoard", "Generate embeddings", "processing", "processing"),
      N("r5", 660, 320, "Vector DB Upsert", "Database", "Update vectors", "vectordb", "vectordb"),
      N("r6", 860, 220, "Analytics", "BarChart2", "Compute metrics", "observ", "observ"),
      N("r7", 1060, 220, "WebSocket Broadcast", "Radio", "Send to UI", "websocket", "websocket"),
      N("r8", 1260, 220, "Dashboard", "BarChart2", "Live visualization", "io", "io"),
    ],
    edges: [
      E("re1", "r1", "r2", "stream"),
      E("re2", "r2", "r3", "json"),
      E("re3", "r3", "r4", "text"),
      E("re4", "r3", "r6", "json"),
      E("re5", "r4", "r5", "embeddings"),
      E("re6", "r5", "r7", "signal"),
      E("re7", "r6", "r7", "json"),
      E("re8", "r7", "r8", "stream"),
    ],
  },
  // ──────── DATABASE & COLLABORATIVE TEMPLATES ────────
  {
    id: "database_sync_agent",
    label: "Database Sync & Query Agent",
    icon: "Database",
    tags: ["database", "sql", "agent", "crud"],
    description: "User query → Text-to-SQL → Query executor → Response formatter → Update memory",
    nodes: [
      N("d1", 60, 220, "User Query", "MessageSquare", "Natural language", "io", "io"),
      N("d2", 260, 220, "Text-to-SQL", "Code2", "GPT generates SQL", "processing", "processing"),
      N("d3", 460, 220, "Query Executor", "Database", "Execute on live DB", "database", "database"),
      N("d4", 660, 120, "Result Formatter", "Layers", "Format results", "processing", "processing"),
      N("d5", 660, 320, "LLM Summarizer", "Sparkles", "Summarize findings", "llm", "llm"),
      N("d6", 860, 220, "Cache Results", "Cache", "Store in Redis", "cache", "cache"),
      N("d7", 1060, 220, "Response", "Zap", "Output to user", "io", "io"),
    ],
    edges: [
      E("de1", "d1", "d2", "text"),
      E("de2", "d2", "d3", "text"),
      E("de3", "d3", "d4", "json"),
      E("de4", "d4", "d5", "json"),
      E("de5", "d4", "d6", "json"),
      E("de6", "d5", "d7", "text"),
    ],
  },

  {
    id: "collaborative_doc_agent",
    label: "Collaborative Document Agent",
    icon: "BookOpen",
    tags: ["collaboration", "documents", "mcp", "realtime"],
    description: "Multiple users → WebSocket → Shared doc sync → Agent editing → Version control → Live preview",
    nodes: [
      N("c1", 60, 120, "User A Input", "MessageSquare", "Edit request", "io", "io"),
      N("c2", 60, 280, "User B Input", "MessageSquare", "Edit request", "io", "io"),
      N("c3", 260, 200, "WebSocket Sync", "Zap", "Sync layer", "websocket", "websocket"),
      N("c4", 460, 200, "Conflict Resolver", "GitBranch", "Handle conflicts", "processing", "processing"),
      N("c5", 660, 100, "Doc Agent Edit", "Bot", "AI suggestions", "agent", "agent"),
      N("c6", 660, 280, "Notion MCP", "BookOpen", "Update Notion", "mcp", "mcp"),
      N("c7", 860, 200, "Version Control", "GitBranch", "Track versions", "store", "store"),
      N("c8", 1060, 120, "User A View", "Eye", "See updates", "io", "io"),
      N("c9", 1060, 280, "User B View", "Eye", "See updates", "io", "io"),
    ],
    edges: [
      E("ce1", "c1", "c3", "json"),
      E("ce2", "c2", "c3", "json"),
      E("ce3", "c3", "c4", "json"),
      E("ce4", "c4", "c5", "json"),
      E("ce5", "c4", "c6", "json"),
      E("ce6", "c5", "c7", "json"),
      E("ce7", "c6", "c7", "signal"),
      E("ce8", "c7", "c8", "stream"),
      E("ce9", "c7", "c9", "stream"),
    ],
  },

  {
    id: "full_stack_enterprise_genai_platform",
    label: "Full-Stack Enterprise GenAI Platform",
    icon: "Network",
    tags: [
      "enterprise", "agentic", "rag", "multimodal", "finetuning",
      "observability", "guardrails", "evaluation", "voice", "video",
      "mcp", "aws", "azure", "databricks", "llmops",
    ],
    description:
      "Complete production-grade AI platform: multimodal inputs → security → API gateway → " +
      "multi-agent orchestration (LangGraph + CrewAI + AutoGen) → hybrid RAG (embedding + reranking + " +
      "HyDE + hybrid search) → reasoning LLMs (o3 + Claude Thinking + Gemini) → fine-tuning pipeline " +
      "(LoRA + DPO) → guardrails (NeMo + LlamaGuard + Presidio) → evaluation (Ragas + DeepEval + " +
      "LangSmith) → observability (Langfuse + Arize + OTEL) → multimodal output " +
      "(TTS + Video Gen + VLM) → MCP tools → cloud storage (AWS + Azure + Databricks)",

    nodes: [

      // ══════════════════════════════════════════════════════════
      // LAYER 0 — INPUTS  (x: 40–240)
      // ══════════════════════════════════════════════════════════
      N("in1",  40,  60,  "User Text Input",      "MessageSquare", "Web / App chat",           "io",          "io"),
      N("in2",  40,  180, "Voice Input",           "Mic",           "Speech upload",            "multimodal",  "multimodal"),
      N("in3",  40,  300, "Image Upload",          "Image",         "Vision input",             "multimodal",  "multimodal"),
      N("in4",  40,  420, "Video Upload",          "Play",          "Video input",              "multimodal",  "multimodal"),
      N("in5",  40,  540, "Document Upload",       "FileText",      "PDF / DOCX / PPTX",        "datasource",  "datasource"),
      N("in6",  40,  660, "Webhook Trigger",       "Webhook",       "External event",           "io",          "io"),

      // ══════════════════════════════════════════════════════════
      // LAYER 1 — SECURITY & GATEWAY  (x: 280–480)
      // ══════════════════════════════════════════════════════════
      N("sec1", 280,  60,  "Authentication",        "Key",           "OAuth2 / JWT / OIDC",     "security",    "security"),
      N("sec2", 280,  180, "PII Masking",           "Lock",          "Presidio redaction",      "security",    "security"),
      N("sec3", 280,  300, "Rate Limiter",          "Shield",        "Token bucket",            "security",    "security"),
      N("sec4", 280,  420, "Prompt Inj. Filter",   "Filter",        "Lakera Guard",            "security",    "security"),
      N("sec5", 480,  240, "API Gateway",           "Network",       "Route & throttle",        "workflow",    "workflow"),
      N("sec6", 480,  420, "Secrets Manager",       "Lock",          "Vault / SSM / Key Vault", "security",    "security"),

      // ══════════════════════════════════════════════════════════
      // LAYER 2 — MULTIMODAL PRE-PROCESSING  (x: 700–900)
      // ══════════════════════════════════════════════════════════
      N("mm1",  700,  60,  "Speech to Text",        "Mic",           "OpenAI Whisper v3",       "multimodal",  "multimodal"),
      N("mm2",  700,  180, "GPT-4o Vision",         "Eye",           "Image → text",            "multimodal",  "multimodal"),
      N("mm3",  700,  300, "Video Understanding",   "Brain",         "Gemini 1.5 Pro (2M ctx)", "multimodal",  "multimodal"),
      N("mm4",  700,  420, "Unstructured.io",       "FileText",      "Doc parser → markdown",   "processing",  "processing"),
      N("mm5",  700,  540, "Firecrawl",             "Globe",         "Web → markdown",          "processing",  "processing"),
      N("mm6",  900,  300, "Multimodal Fusion",     "Network",       "Merge all modalities",    "processing",  "processing"),

      // ══════════════════════════════════════════════════════════
      // LAYER 3 — AGENT ORCHESTRATION  (x: 1100–1400)
      // ══════════════════════════════════════════════════════════
      N("ag1",  1100, 120, "LangGraph",             "GitBranch",     "Stateful agent graph",    "agent",       "agent"),
      N("ag2",  1100, 300, "Router Agent",          "Network",       "Intent classification",   "agent",       "agent"),
      N("ag3",  1100, 480, "CrewAI",                "Users",         "Role-based crew",         "agent",       "agent"),
      N("ag4",  1300, 60,  "Planner Agent",         "Workflow",      "Decompose goal",          "agent",       "agent"),
      N("ag5",  1300, 200, "Research Agent",        "BookOpen",      "Web + docs + search",     "agent",       "agent"),
      N("ag6",  1300, 340, "Code Agent",            "Code2",         "Generate & execute",      "agent",       "agent"),
      N("ag7",  1300, 480, "AutoGen",               "RefreshCw",     "Self-improving loop",     "agent",       "agent"),
      N("ag8",  1300, 620, "Supervisor",            "Layers",        "Manage sub-agents",       "agent",       "agent"),
      N("ag9",  1500, 340, "Task Decomposer",       "Boxes",         "Break into subtasks",     "agent",       "agent"),
      N("ag10", 1500, 480, "Coordinator Agent",     "Settings",      "Cross-agent sync",        "agent",       "agent"),

      // ══════════════════════════════════════════════════════════
      // LAYER 4 — MCP TOOLS  (x: 1700–1900)
      // ══════════════════════════════════════════════════════════
      N("mcp1", 1700, 60,  "Web Search Tool",       "Search",        "Tavily + Brave",          "tool",        "tool"),
      N("mcp2", 1700, 180, "Code Executor",         "Code2",         "E2B sandbox",             "tool",        "tool"),
      N("mcp3", 1700, 300, "GitHub MCP",            "Code2",         "Repos / PRs / Issues",    "mcp",         "mcp"),
      N("mcp4", 1700, 420, "Google Drive MCP",      "FolderOpen",    "Docs / Sheets",           "mcp",         "mcp"),
      N("mcp5", 1700, 540, "Slack MCP",             "MessageSquare", "Team notifications",      "mcp",         "mcp"),
      N("mcp6", 1700, 660, "PostgreSQL MCP",        "Database",      "SQL queries",             "mcp",         "mcp"),
      N("mcp7", 1900, 360, "MCP Gateway",           "Server",        "Tool registry",           "mcp",         "mcp"),

      // ══════════════════════════════════════════════════════════
      // LAYER 5 — RAG PIPELINE  (x: 2100–2600)
      // ══════════════════════════════════════════════════════════
      N("rag1", 2100, 60,  "Text Chunker",          "Layers",        "Recursive / semantic",    "processing",  "processing"),
      N("rag2", 2100, 200, "Gemini Embedding 2",    "CircuitBoard",  "Text+img+audio vectors",  "multimodal",  "multimodal"),
      N("rag3", 2100, 340, "CLIP",                  "CircuitBoard",  "Image embeddings",        "multimodal",  "multimodal"),
      N("rag4", 2100, 480, "ImageBind",             "CircuitBoard",  "6-modality embeddings",   "multimodal",  "multimodal"),
      N("rag5", 2300, 60,  "Pinecone",              "Database",      "Primary vector store",    "vectordb",    "vectordb"),
      N("rag6", 2300, 200, "Weaviate",              "Network",       "Hybrid + multimodal",     "vectordb",    "vectordb"),
      N("rag7", 2300, 340, "pgvector",              "Database",      "Postgres vector search",  "vectordb",    "vectordb"),
      N("rag8", 2300, 480, "Delta Lake",            "Database",      "Databricks Lakehouse",    "databricks",  "databricks"),
      N("rag9", 2500, 60,  "Query Rewriter",        "RefreshCw",     "HyDE + step-back",        "rag",         "rag"),
      N("rag10",2500, 200, "Hybrid Search",         "Search",        "BM25 + vector fusion",    "rag",         "rag"),
      N("rag11",2500, 340, "Metadata Filter",       "Filter",        "Pre-filter by attr",      "rag",         "rag"),
      N("rag12",2500, 480, "BGE-Reranker",          "Filter",        "Cross-encoder rerank",    "processing",  "processing"),
      N("rag13",2500, 620, "Cohere Rerank 3.5",     "Filter",        "Commercial reranker",     "processing",  "processing"),
      N("rag14",2700, 340, "Context Builder",       "Boxes",         "Assemble prompt context", "rag",         "rag"),
      N("rag15",2700, 480, "Citation Generator",    "FileText",      "Source attribution",      "rag",         "rag"),

      // ══════════════════════════════════════════════════════════
      // LAYER 6 — MEMORY  (x: 2100–2500, lower rows)
      // ══════════════════════════════════════════════════════════
      N("mem1", 2100, 780, "Long-Term Memory",      "MemoryStick",   "Zep / Letta / Mem0",      "memory",      "memory"),
      N("mem2", 2300, 780, "Redis Cache",           "Server",        "Session + embedding cache","memory",     "memory"),
      N("mem3", 2500, 780, "Graph DB (Neo4j)",      "Network",       "Knowledge graph",         "store",       "store"),
      N("mem4", 2700, 780, "Episodic Memory",       "Layers",        "Past session recall",     "memory",      "memory"),

      // ══════════════════════════════════════════════════════════
      // LAYER 7 — PROMPT ENGINEERING  (x: 2900–3100)
      // ══════════════════════════════════════════════════════════
      N("pr1",  2900, 200, "System Prompt",         "Settings",      "Persona + constraints",   "prompt",      "prompt"),
      N("pr2",  2900, 340, "HyDE Prompt",           "FileText",      "Hypothetical doc embed",  "prompt",      "prompt"),
      N("pr3",  2900, 480, "Chain-of-Thought",      "GitBranch",     "Step-by-step reasoning",  "prompt",      "prompt"),
      N("pr4",  2900, 620, "RAG Prompt",            "BookOpen",      "Context injection",       "prompt",      "prompt"),

      // ══════════════════════════════════════════════════════════
      // LAYER 8 — LLMs + REASONING MODELS  (x: 3200–3600)
      // ══════════════════════════════════════════════════════════
      N("llm1", 3200, 60,  "Claude Opus 4.6",       "Brain",         "Anthropic frontier",      "anthropic",   "anthropic"),
      N("llm2", 3200, 200, "Claude 3.7 Thinking",   "Brain",         "Extended thinking 128K",  "anthropic",   "anthropic"),
      N("llm3", 3200, 340, "o3 (Reasoning)",        "Brain",         "OpenAI deep reasoning",   "openai",      "openai"),
      N("llm4", 3200, 480, "Gemini 2.5 Thinking",   "Brain",         "Google adaptive CoT",     "google",      "google"),
      N("llm5", 3200, 620, "DeepSeek-R1 (OSS)",     "CircuitBoard",  "SOTA open reasoning",     "opensource",  "opensource"),
      N("llm6", 3200, 760, "QwQ-32B (OSS)",         "CircuitBoard",  "Alibaba reasoning OSS",   "opensource",  "opensource"),
      N("llm7", 3400, 400, "LLM Router",            "GitBranch",     "Cost / quality routing",  "workflow",    "workflow"),
      N("llm8", 3600, 400, "Answer Synthesizer",    "Brain",         "Ground in sources",       "rag",         "rag"),

      // ══════════════════════════════════════════════════════════
      // LAYER 9 — FINE-TUNING PIPELINE  (x: 3200–3600, upper)
      // ══════════════════════════════════════════════════════════
      N("ft1",  3200, -120, "Training Dataset",     "FileText",      "JSONL preference pairs",  "datasource",  "datasource"),
      N("ft2",  3400, -120, "LoRA / QLoRA",         "Layers",        "PEFT adapter training",   "finetune",    "finetune"),
      N("ft3",  3600, -180, "Unsloth",              "CircuitBoard",  "2× faster LoRA",          "finetune",    "finetune"),
      N("ft4",  3600, -60,  "DPO / RLHF",          "RefreshCw",     "Preference alignment",    "finetune",    "finetune"),
      N("ft5",  3800, -120, "MLflow",               "BarChart2",     "Experiment tracking",     "databricks",  "databricks"),
      N("ft6",  4000, -120, "SageMaker / Vertex",   "Cloud",         "Managed training infra",  "aws",         "aws"),

      // ══════════════════════════════════════════════════════════
      // LAYER 10 — GUARDRAILS  (x: 3800–4200)
      // ══════════════════════════════════════════════════════════
      N("grd1", 3800, 200, "NeMo Guardrails",       "Shield",        "Topic + jailbreak filter","processing",  "processing"),
      N("grd2", 3800, 340, "LlamaGuard 3",          "Shield",        "14-category I/O safety",  "processing",  "processing"),
      N("grd3", 3800, 480, "AWS Bedrock Guardrails","Shield",        "PII + HAP + hallucination","processing", "processing"),
      N("grd4", 3800, 620, "Guardrails AI",         "Shield",        "JSON schema validators",  "processing",  "processing"),
      N("grd5", 4000, 400, "Safety Aggregator",     "Shield",        "Merge all guard signals", "processing",  "processing"),
      N("grd6", 4200, 400, "Content Moderation",    "ScanSearch",    "OpenAI moderation API",   "security",    "security"),

      // ══════════════════════════════════════════════════════════
      // LAYER 11 — EVALUATION  (x: 4400–4800)
      // ══════════════════════════════════════════════════════════
      N("ev1",  4400, 120, "Ragas",                 "BarChart2",     "RAG triad evaluation",    "eval",        "eval"),
      N("ev2",  4400, 260, "DeepEval",              "BarChart2",     "LLM unit tests",          "eval",        "eval"),
      N("ev3",  4400, 400, "LangSmith Evals",       "BarChart2",     "Online + batch evals",    "eval",        "eval"),
      N("ev4",  4400, 540, "TruLens",               "BarChart2",     "Groundedness check",      "eval",        "eval"),
      N("ev5",  4400, 680, "Hallucination Check",   "ScanSearch",    "Factual consistency",     "eval",        "eval"),
      N("ev6",  4600, 400, "Eval Aggregator",       "BarChart2",     "Score fusion",            "eval",        "eval"),
      N("ev7",  4800, 400, "A/B Testing",           "FlaskConical",  "Prompt variant test",     "eval",        "eval"),
      N("ev8",  4800, 540, "Human Feedback",        "MessageSquare", "RLHF thumbs up/down",     "eval",        "eval"),

      // ══════════════════════════════════════════════════════════
      // LAYER 12 — OBSERVABILITY  (x: 4400–4800, lower)
      // ══════════════════════════════════════════════════════════
      N("obs1", 4400, 900, "Langfuse",              "Activity",      "OSS LLM tracing",         "observ",      "observ"),
      N("obs2", 4400,1020, "Arize Phoenix",         "Activity",      "Embedding drift + RAG",   "observ",      "observ"),
      N("obs3", 4600, 900, "OpenTelemetry GenAI",   "Activity",      "Vendor-neutral spans",    "observ",      "observ"),
      N("obs4", 4600,1020, "Helicone",              "Activity",      "Cost + latency proxy",    "observ",      "observ"),
      N("obs5", 4800, 960, "W&B Weave",             "BarChart2",     "ML experiment + LLM",     "observ",      "observ"),
      N("obs6", 5000, 960, "Cost Tracking",         "BarChart2",     "Budget alerts",           "observ",      "observ"),
      N("obs7", 5000,1080, "Latency Monitor",       "Activity",      "TTFT / E2E latency",      "observ",      "observ"),
      N("obs8", 5200, 960, "Alerts",                "Bell",          "PagerDuty / Slack",       "observ",      "observ"),

      // ══════════════════════════════════════════════════════════
      // LAYER 13 — CLOUD STORAGE & INFRA  (x: 5000–5200)
      // ══════════════════════════════════════════════════════════
      N("cld1", 5000, 120, "AWS S3 Bucket",         "Cloud",         "Object storage",          "aws",         "aws"),
      N("cld2", 5000, 260, "Azure Blob",            "FolderOpen",    "Azure storage",           "azure",       "azure"),
      N("cld3", 5000, 400, "Delta Lake",            "Database",      "Databricks Lakehouse",    "databricks",  "databricks"),
      N("cld4", 5000, 540, "DynamoDB",              "Database",      "Agent session state",     "aws",         "aws"),
      N("cld5", 5000, 680, "Cosmos DB",             "Database",      "Multi-model NoSQL",       "azure",       "azure"),
      N("cld6", 5200, 400, "Knowledge Base",        "BookOpen",      "Searchable content store","store",       "store"),

      // ══════════════════════════════════════════════════════════
      // LAYER 14 — MULTIMODAL OUTPUT  (x: 5400–5800)
      // ══════════════════════════════════════════════════════════
      N("out1", 5400, 100, "ElevenLabs Conv. AI",  "Mic",           "Voice agent TTS",         "multimodal",  "multimodal"),
      N("out2", 5400, 240, "OpenAI Realtime API",  "Mic",           "Bidirectional voice",     "multimodal",  "multimodal"),
      N("out3", 5400, 380, "Sora",                 "Play",          "Text-to-video gen",       "multimodal",  "multimodal"),
      N("out4", 5400, 520, "Veo 3",                "Play",          "Google 4K video",         "multimodal",  "multimodal"),
      N("out5", 5400, 660, "Runway Gen-4",         "Play",          "Cinematic video",         "multimodal",  "multimodal"),
      N("out6", 5400, 800, "DALL-E 3",             "Image",         "Image generation",        "multimodal",  "multimodal"),
      N("out7", 5600, 480, "Streaming Output",     "Layers",        "Token-by-token stream",   "io",          "io"),
      N("out8", 5800, 480, "Final Response",       "Zap",           "Unified output",          "io",          "io"),

    ],

    edges: [

      // ── LAYER 0 → LAYER 1 (Inputs → Security) ─────────────────
      E("e001", "in1", "sec1", "request"),
      E("e002", "in2", "sec1", "voice"),
      E("e003", "in3", "sec1", "image"),
      E("e004", "in4", "sec1", "video"),
      E("e005", "in5", "sec1", "file"),
      E("e006", "in6", "sec1", "event"),
      E("e007", "sec1", "sec2", "auth"),
      E("e008", "sec2", "sec3", "text"),
      E("e009", "sec3", "sec4", "text"),
      E("e010", "sec4", "sec5", "text"),
      E("e011", "sec6", "sec5", "signal"),

      // ── LAYER 1 → LAYER 2 (Gateway → Multimodal pre-process) ──
      E("e012", "sec5", "mm1",  "audio"),
      E("e013", "sec5", "mm2",  "image"),
      E("e014", "sec5", "mm3",  "video"),
      E("e015", "sec5", "mm4",  "file"),
      E("e016", "sec5", "mm5",  "http"),
      E("e017", "mm1",  "mm6",  "text"),
      E("e018", "mm2",  "mm6",  "text"),
      E("e019", "mm3",  "mm6",  "text"),
      E("e020", "mm4",  "mm6",  "docs"),
      E("e021", "mm5",  "mm6",  "docs"),

      // ── LAYER 2 → LAYER 3 (Multimodal → Agent Orchestration) ──
      E("e022", "mm6",  "ag2",  "text"),
      E("e023", "sec5", "ag2",  "text"),
      E("e024", "ag2",  "ag1",  "route"),
      E("e025", "ag2",  "ag3",  "route"),
      E("e026", "ag1",  "ag4",  "plan"),
      E("e027", "ag1",  "ag5",  "task"),
      E("e028", "ag1",  "ag6",  "code"),
      E("e029", "ag3",  "ag7",  "task"),
      E("e030", "ag3",  "ag8",  "task"),
      E("e031", "ag8",  "ag9",  "decompose"),
      E("e032", "ag9",  "ag10", "coordinate"),

      // ── LAYER 3 → LAYER 4 (Agents → MCP Tools) ───────────────
      E("e033", "ag5",  "mcp1", "search"),
      E("e034", "ag6",  "mcp2", "code"),
      E("e035", "ag5",  "mcp3", "tool_call"),
      E("e036", "ag5",  "mcp4", "tool_call"),
      E("e037", "ag10", "mcp5", "notify"),
      E("e038", "ag6",  "mcp6", "tool_call"),
      E("e039", "mcp1", "mcp7", "signal"),
      E("e040", "mcp2", "mcp7", "signal"),
      E("e041", "mcp3", "mcp7", "signal"),
      E("e042", "mcp4", "mcp7", "signal"),
      E("e043", "mcp5", "mcp7", "signal"),
      E("e044", "mcp6", "mcp7", "signal"),

      // ── LAYER 2 → LAYER 5 (Docs → RAG ingestion) ─────────────
      E("e045", "mm4",  "rag1", "docs"),
      E("e046", "rag1", "rag2", "docs"),
      E("e047", "mm3",  "rag3", "image"),
      E("e048", "mm3",  "rag4", "video"),
      E("e049", "rag2", "rag5", "embeddings"),
      E("e050", "rag2", "rag6", "embeddings"),
      E("e051", "rag2", "rag7", "embeddings"),
      E("e052", "rag2", "rag8", "embeddings"),
      E("e053", "rag3", "rag6", "embeddings"),
      E("e054", "rag4", "rag6", "embeddings"),

      // ── LAYER 3 → RAG retrieval ────────────────────────────────
      E("e055", "ag4",  "rag9",  "query"),
      E("e056", "ag5",  "rag9",  "query"),
      E("e057", "rag9", "rag10", "text"),
      E("e058", "rag10","rag11", "docs"),
      E("e059", "rag5", "rag11", "docs"),
      E("e060", "rag6", "rag11", "docs"),
      E("e061", "rag7", "rag11", "docs"),
      E("e062", "rag8", "rag11", "docs"),
      E("e063", "rag11","rag12", "docs"),
      E("e064", "rag11","rag13", "docs"),
      E("e065", "rag12","rag14", "docs"),
      E("e066", "rag13","rag14", "docs"),
      E("e067", "rag14","rag15", "text"),

      // ── Memory → RAG + Agents ──────────────────────────────────
      E("e068", "mem1", "ag1",  "memory"),
      E("e069", "mem2", "rag10","signal"),
      E("e070", "mem3", "rag14","json"),
      E("e071", "mem4", "ag4",  "memory"),
      E("e072", "rag14","mem1", "context"),
      E("e073", "rag14","mem2", "cache"),

      // ── LAYER 7 — Prompts → RAG assembly ──────────────────────
      E("e074", "pr1",  "rag14", "system"),
      E("e075", "pr2",  "rag9",  "hyde"),
      E("e076", "pr3",  "rag14", "cot"),
      E("e077", "pr4",  "rag14", "rag"),

      // ── LAYER 8 — RAG → LLMs ──────────────────────────────────
      E("e078", "rag14","llm7",  "context"),
      E("e079", "rag15","llm7",  "citations"),
      E("e080", "mcp7", "llm7",  "tool_call"),
      E("e081", "llm7", "llm1",  "route"),
      E("e082", "llm7", "llm2",  "route"),
      E("e083", "llm7", "llm3",  "route"),
      E("e084", "llm7", "llm4",  "route"),
      E("e085", "llm7", "llm5",  "route"),
      E("e086", "llm7", "llm6",  "route"),
      E("e087", "llm1", "llm8",  "tokens"),
      E("e088", "llm2", "llm8",  "tokens"),
      E("e089", "llm3", "llm8",  "tokens"),
      E("e090", "llm4", "llm8",  "tokens"),
      E("e091", "llm5", "llm8",  "tokens"),
      E("e092", "llm6", "llm8",  "tokens"),

      // ── Fine-Tuning pipeline (offline loop) ───────────────────
      E("e093", "ft1",  "ft2",  "docs"),
      E("e094", "ft2",  "ft3",  "lora"),
      E("e095", "ft2",  "ft4",  "preference"),
      E("e096", "ft3",  "ft5",  "model"),
      E("e097", "ft4",  "ft5",  "model"),
      E("e098", "ft5",  "ft6",  "registry"),
      E("e099", "ft6",  "llm7", "fine_tuned"),

      // ── LAYER 10 — LLMs → Guardrails ──────────────────────────
      E("e100", "llm8", "grd1", "text"),
      E("e101", "llm8", "grd2", "text"),
      E("e102", "llm8", "grd3", "text"),
      E("e103", "llm8", "grd4", "json"),
      E("e104", "grd1", "grd5", "signal"),
      E("e105", "grd2", "grd5", "signal"),
      E("e106", "grd3", "grd5", "signal"),
      E("e107", "grd4", "grd5", "signal"),
      E("e108", "grd5", "grd6", "text"),

      // ── LAYER 11 — Guardrails → Evaluation ───────────────────
      E("e109", "grd6", "ev1",  "text"),
      E("e110", "grd6", "ev2",  "text"),
      E("e111", "grd6", "ev3",  "text"),
      E("e112", "grd6", "ev4",  "text"),
      E("e113", "grd6", "ev5",  "text"),
      E("e114", "ev1",  "ev6",  "json"),
      E("e115", "ev2",  "ev6",  "json"),
      E("e116", "ev3",  "ev6",  "json"),
      E("e117", "ev4",  "ev6",  "json"),
      E("e118", "ev5",  "ev6",  "json"),
      E("e119", "ev6",  "ev7",  "score"),
      E("e120", "ev6",  "ev8",  "score"),

      // ── Evaluation feedback → Fine-tuning loop ────────────────
      E("e121", "ev8",  "ft1",  "preference"),

      // ── LAYER 12 — Observability (parallel to eval) ───────────
      E("e122", "llm8", "obs1", "trace"),
      E("e123", "llm8", "obs2", "trace"),
      E("e124", "obs1", "obs3", "signal"),
      E("e125", "obs2", "obs3", "signal"),
      E("e126", "obs3", "obs4", "signal"),
      E("e127", "obs4", "obs5", "signal"),
      E("e128", "obs5", "obs6", "json"),
      E("e129", "obs5", "obs7", "json"),
      E("e130", "obs6", "obs8", "signal"),
      E("e131", "obs7", "obs8", "signal"),

      // ── LAYER 13 — Cloud Storage ──────────────────────────────
      E("e132", "rag8", "cld3",  "delta"),
      E("e133", "mm4",  "cld1",  "file"),
      E("e134", "mm4",  "cld2",  "file"),
      E("e135", "ag10", "cld4",  "session"),
      E("e136", "ag10", "cld5",  "state"),
      E("e137", "rag14","cld6",  "knowledge"),
      E("e138", "cld1", "llm7",  "files"),
      E("e139", "cld6", "rag14", "docs"),

      // ── LAYER 14 — Eval+Guard → Multimodal Output ─────────────
      E("e140", "grd6", "out1", "text"),
      E("e141", "grd6", "out2", "text"),
      E("e142", "grd6", "out3", "text"),
      E("e143", "grd6", "out4", "text"),
      E("e144", "grd6", "out5", "text"),
      E("e145", "grd6", "out6", "text"),
      E("e146", "out1", "out7", "audio"),
      E("e147", "out2", "out7", "audio"),
      E("e148", "out3", "out7", "video"),
      E("e149", "out4", "out7", "video"),
      E("e150", "out5", "out7", "video"),
      E("e151", "out6", "out7", "image"),
      E("e152", "out7", "out8", "stream"),

    ],
  },
  // ============================================================
// U MOBILE SMART ASSIST — Production Telecom AI Platform
//
// HOW TO USE:
//   Paste the object below into the TEMPLATES array in
//   src/pages/playground/data/templates.js
//   (add a comma after the last existing entry)
//
// ARCHITECTURE STORY (left → right):
//   INGEST  →  SECURITY  →  LIVE CALL (Twilio/STT)
//   →  INGESTION PIPELINE (all doc types + S3 + Lambda)
//   →  KNOWLEDGE BASE (embed + OpenSearch + FAISS)
//   →  RAG ENGINE (query rewrite + hybrid + rerank)
//   →  16 TELECOM API TOOLS (billing, SIM, network, etc.)
//   →  LLM ORCHESTRATION (LangGraph + Bedrock)
//   →  MEMORY + SESSION (DynamoDB + ElastiCache)
//   →  GUARDRAILS + SENTIMENT + PII
//   →  RESPONSE (TTS / chat / agent assist)
//   →  ANALYTICS + OBSERVABILITY (CloudWatch + EventBridge)
// ============================================================

  {
    id: "umobile_smart_assist",
    label: "U Mobile Smart Assist — Telecom AI Platform",
    icon: "Phone",
    tags: [
      "telecom","voice","rag","aws","live-call","sentiment",
      "stt","tts","twilio","guardrails","tools","eventbridge",
      "opensearch","dynamodb","bedrock","s3","lambda","sagemaker",
    ],
    description:
      "Production telecom AI platform for U Mobile: Twilio live call → Amazon Transcribe STT → " +
      "VAD & barge-in → security (PII masking + auth) → full document ingestion pipeline " +
      "(PDF, DOCX, Excel, CSV, images, TXT via S3 + Lambda + Textract + Unstructured) → " +
      "Amazon OpenSearch hybrid RAG + FAISS in-memory index → 16 telecom tool APIs " +
      "(billing, SIM, PPID, network, plan, roaming, rewards, complaints…) → " +
      "LangGraph orchestrator on Bedrock (Claude Sonnet) → DynamoDB session + ElastiCache → " +
      "NeMo guardrails + sentiment scoring + Presidio PII → Amazon Polly TTS → " +
      "agent assist overlay + supervisor dashboard → EventBridge events → " +
      "CloudWatch + SageMaker model monitor → analytics & audit trail",

    nodes: [

      // ══════════════════════════════════════════════════════
      // LAYER 0 — LIVE CALL ENTRY  (x: 40)
      // ══════════════════════════════════════════════════════
      N("lc1",  40,  100, "Twilio Voice Call",     "Phone",        "Inbound IVR / PSTN",         "mcp",         "mcp"),
      N("lc2",  40,  240, "Twilio SMS / WhatsApp", "MessageSquare","Async text channel",          "mcp",         "mcp"),
      N("lc3",  40,  380, "Web Chat Widget",       "MessageSquare","Browser chat",               "io",          "io"),
      N("lc4",  40,  520, "Agent Desk API",        "Webhook",      "Genesys / NICE inContact",   "tool",        "tool"),

      // ══════════════════════════════════════════════════════
      // LAYER 1 — VOICE PROCESSING  (x: 260)
      // ══════════════════════════════════════════════════════
      N("vp1",  260, 100, "Amazon Transcribe",     "Mic",          "Real-time STT (BM · EN · MS)","aws",         "aws"),
      N("vp2",  260, 240, "VAD / Barge-in",        "Activity",     "Voice activity detection",   "processing",  "processing"),
      N("vp3",  260, 380, "Language Detect",       "ScanSearch",   "Malay / English / Mandarin", "processing",  "processing"),
      N("vp4",  260, 520, "Turn Manager",          "RefreshCw",    "Speaker diarization",        "processing",  "processing"),

      // ══════════════════════════════════════════════════════
      // LAYER 2 — SECURITY & AUTH  (x: 480)
      // ══════════════════════════════════════════════════════
      N("sc1",  480, 60,  "AWS Cognito",           "Key",          "OAuth2 / JWT auth",          "aws",         "aws"),
      N("sc2",  480, 180, "Presidio PII Masking",  "Lock",         "IC / Phone / PPID redact",   "processing",  "processing"),
      N("sc3",  480, 300, "API Gateway (AWS)",     "Network",      "Rate limit + WAF",           "aws",         "aws"),
      N("sc4",  480, 420, "Lakera Guard",          "Shield",       "Prompt injection block",     "processing",  "processing"),
      N("sc5",  480, 540, "AWS IAM Roles",         "UserCheck",    "Fine-grained access ctrl",   "aws",         "aws"),
      N("sc6",  480, 660, "Secrets Manager",       "Lock",         "API keys / credentials",     "aws",         "aws"),

      // ══════════════════════════════════════════════════════
      // LAYER 3 — DATA INGESTION PIPELINE  (x: 700–1000)
      // ══════════════════════════════════════════════════════

      // Sources
      N("di1",  700, 60,  "S3 Raw Bucket",         "Cloud",        "PDF / DOCX / XLSX / CSV / TXT","aws",        "aws"),
      N("di2",  700, 180, "Image Files (S3)",       "Image",        "Scanned forms / ID docs",    "aws",         "aws"),
      N("di3",  700, 300, "CRM Data Feed",         "Database",     "Customer records export",    "datasource",  "datasource"),
      N("di4",  700, 420, "Network KPI Feed",      "Activity",     "Tower / IPDR / CDR data",    "datasource",  "datasource"),
      N("di5",  700, 540, "Product Catalogue",     "BookOpen",     "Plans / Add-ons / Promos",   "datasource",  "datasource"),
      N("di6",  700, 660, "Regulatory Docs",       "FileText",     "MCMC / PDPA policies",       "datasource",  "datasource"),

      // Ingest Lambdas
      N("di7",  900, 120, "Lambda: Doc Parser",    "Zap",          "Unstructured.io dispatcher", "aws",         "aws"),
      N("di8",  900, 260, "Amazon Textract",       "FileText",     "OCR — forms & tables",       "aws",         "aws"),
      N("di9",  900, 400, "Lambda: CSV/Excel ETL", "Zap",          "Pandas normalise → JSON",    "aws",         "aws"),
      N("di10", 900, 540, "AWS Glue",              "Database",     "Serverless ETL / catalogue", "aws",         "aws"),

      // Processing
      N("di11",1100, 200, "Text Chunker",          "Layers",       "Recursive 512 tok / 10% OL", "processing",  "processing"),
      N("di12",1100, 360, "Docling",               "FileText",     "Table / heading preserving", "processing",  "processing"),
      N("di13",1100, 520, "MarkItDown",            "FileText",     "PPTX / XLSX → Markdown",     "processing",  "processing"),

      // ══════════════════════════════════════════════════════
      // LAYER 4 — EMBEDDINGS & INDEXES  (x: 1300–1600)
      // ══════════════════════════════════════════════════════
      N("em1", 1300, 120, "Amazon Titan Embed v2", "CircuitBoard", "Dense 1536-dim embeddings",  "aws",         "aws"),
      N("em2", 1300, 260, "Cohere Embed v3",       "CircuitBoard", "Multilingual embeddings",    "processing",  "processing"),
      N("em3", 1300, 400, "CLIP (Image Embed)",    "CircuitBoard", "Image → vector",             "multimodal",  "multimodal"),

      N("ix1", 1500, 80,  "Amazon OpenSearch",     "Search",       "Primary vector + BM25 index","aws",         "aws"),
      N("ix2", 1500, 220, "FAISS In-Memory",       "Zap",          "Low-latency hot index",      "vectordb",    "vectordb"),
      N("ix3", 1500, 360, "DynamoDB — Doc Store",  "Database",     "Raw chunk + metadata store", "aws",         "aws"),
      N("ix4", 1500, 500, "S3 Processed Bucket",  "Cloud",        "Parsed markdown archive",    "aws",         "aws"),

      // ══════════════════════════════════════════════════════
      // LAYER 5 — RAG ENGINE  (x: 1720–2100)
      // ══════════════════════════════════════════════════════
      N("rg1", 1720, 120, "Query Rewriter",        "RefreshCw",    "HyDE + multi-query expand",  "rag",         "rag"),
      N("rg2", 1720, 260, "Intent Classifier",     "ScanSearch",   "Billing / Tech / Sales / HR","processing",  "processing"),
      N("rg3", 1720, 400, "Metadata Filter",       "Filter",       "Plan tier / region / lang",  "rag",         "rag"),
      N("rg4", 1920, 80,  "Hybrid Search",         "Search",       "BM25 + dense fusion (RRF)",  "rag",         "rag"),
      N("rg5", 1920, 220, "FAISS Retriever",       "Search",       "In-memory ANN top-20",       "vectordb",    "vectordb"),
      N("rg6", 1920, 360, "OpenSearch Retriever",  "Search",       "Lexical + semantic top-20",  "aws",         "aws"),
      N("rg7", 2100, 80,  "Cohere Rerank 3.5",     "Filter",       "Cross-encoder top-5",        "processing",  "processing"),
      N("rg8", 2100, 220, "BGE Reranker v2",       "Filter",       "Open-source rerank",         "processing",  "processing"),
      N("rg9", 2100, 360, "Context Builder",       "Boxes",        "Assemble 4K token context",  "rag",         "rag"),
      N("rg10",2100, 500, "Citation Generator",    "FileText",     "Source doc attribution",     "rag",         "rag"),

      // ══════════════════════════════════════════════════════
      // LAYER 6 — 16 TELECOM TOOL APIs  (x: 2300)
      // ══════════════════════════════════════════════════════
      N("tl1", 2300,  40, "Billing API",           "Wrench",       "Balance / invoices / due",   "tool",        "tool"),
      N("tl2", 2300, 120, "Plan & Add-on API",     "Wrench",       "Active plan / upgrade",      "tool",        "tool"),
      N("tl3", 2300, 200, "SIM / eSIM API",        "Wrench",       "Status / swap / register",   "tool",        "tool"),
      N("tl4", 2300, 280, "Network API",           "Wrench",       "Coverage / outage / speed",  "tool",        "tool"),
      N("tl5", 2300, 360, "PPID / KYC API",        "Wrench",       "Identity verification",      "tool",        "tool"),
      N("tl6", 2300, 440, "Roaming API",           "Wrench",       "Passes / dest / rates",      "tool",        "tool"),
      N("tl7", 2300, 520, "Rewards / Points API",  "Wrench",       "Upoints balance / redeem",   "tool",        "tool"),
      N("tl8", 2300, 600, "Complaint API",         "Wrench",       "Log / track / escalate",     "tool",        "tool"),
      N("tl9", 2300, 680, "Port-In / MNP API",     "Wrench",       "Number porting status",      "tool",        "tool"),
      N("tl10",2300, 760, "Device / IMEI API",     "Wrench",       "Compatibility check",        "tool",        "tool"),
      N("tl11",2300, 840, "IDD / VAS API",         "Wrench",       "International / add-ons",    "tool",        "tool"),
      N("tl12",2300, 920, "Autopay / Wallet API",  "Wrench",       "Payment methods / auto-debit","tool",       "tool"),
      N("tl13",2300,1000, "Notification API",      "Bell",         "SMS / push / email send",    "tool",        "tool"),
      N("tl14",2300,1080, "AWS Location Svc",      "Globe",        "Nearest store / tower loc",  "aws",         "aws"),
      N("tl15",2300,1160, "Contract / Legal API",  "Wrench",       "T&C / agreement lookup",     "tool",        "tool"),
      N("tl16",2300,1240, "Agent Escalation API",  "Phone",        "Transfer to human agent",    "tool",        "tool"),

      // ══════════════════════════════════════════════════════
      // LAYER 7 — ORCHESTRATION ENGINE  (x: 2560–2760)
      // ══════════════════════════════════════════════════════
      N("oc1", 2560, 300, "LangGraph Orchestrator","GitBranch",    "Stateful agentic graph",     "agent",       "agent"),
      N("oc2", 2560, 480, "Bedrock Agents",        "Bot",          "AWS managed agent runtime",  "aws",         "aws"),
      N("oc3", 2560, 660, "ReAct Agent",           "Bot",          "Reason + Act + Observe",     "agent",       "agent"),
      N("oc4", 2760, 300, "Claude Sonnet 4.5",     "Brain",        "Anthropic · primary LLM",    "anthropic",   "anthropic"),
      N("oc5", 2760, 480, "Amazon Nova Pro",       "Sparkles",     "AWS native fallback LLM",    "aws",         "aws"),
      N("oc6", 2760, 660, "Llama 4 Scout",         "CircuitBoard", "OSS low-latency fallback",   "opensource",  "opensource"),
      N("oc7", 2960, 480, "LLM Router",            "GitBranch",    "Cost / latency / lang route","workflow",    "workflow"),

      // ══════════════════════════════════════════════════════
      // LAYER 8 — MEMORY & SESSION  (x: 3160)
      // ══════════════════════════════════════════════════════
      N("ms1", 3160, 200, "DynamoDB — Sessions",   "Database",     "Per-call conversation hist", "aws",         "aws"),
      N("ms2", 3160, 340, "ElastiCache Redis",     "Server",       "Hot response + embed cache", "aws",         "aws"),
      N("ms3", 3160, 480, "DynamoDB — User Prefs", "Database",     "Language / plan / history",  "aws",         "aws"),
      N("ms4", 3160, 620, "DynamoDB — Audit Log",  "Database",     "Full conversation audit",    "aws",         "aws"),
      N("ms5", 3160, 760, "S3 Transcripts",        "Cloud",        "Archived call transcripts",  "aws",         "aws"),

      // ══════════════════════════════════════════════════════
      // LAYER 9 — GUARDRAILS + SENTIMENT  (x: 3400)
      // ══════════════════════════════════════════════════════
      N("gr1", 3400, 160, "NeMo Guardrails",       "Shield",       "Topic + jailbreak ctrl",     "processing",  "processing"),
      N("gr2", 3400, 300, "AWS Bedrock Guardrails","Shield",       "PII + NSFW + hallucination", "aws",         "aws"),
      N("gr3", 3400, 440, "Sentiment Analyser",    "Activity",     "Real-time CSAT scoring",     "processing",  "processing"),
      N("gr4", 3400, 580, "Frustration Detector",  "AlertCircle",  "Escalation trigger rules",   "processing",  "processing"),
      N("gr5", 3400, 720, "Compliance Checker",    "ScanSearch",   "PDPA / MCMC policy filter",  "processing",  "processing"),
      N("gr6", 3600, 440, "Guard Aggregator",      "Shield",       "Merge all safety signals",   "processing",  "processing"),

      // ══════════════════════════════════════════════════════
      // LAYER 10 — RESPONSE GENERATION  (x: 3800)
      // ══════════════════════════════════════════════════════
      N("rp1", 3800, 160, "Amazon Polly TTS",      "Volume2",      "Neural voice · BM/EN/ZH",    "aws",         "aws"),
      N("rp2", 3800, 300, "ElevenLabs Conv. AI",   "Mic",          "Ultra-realistic TTS",        "multimodal",  "multimodal"),
      N("rp3", 3800, 440, "Chat Response",         "MessageSquare","Structured text reply",      "io",          "io"),
      N("rp4", 3800, 580, "Agent Assist Panel",    "Eye",          "Real-time agent overlay",    "io",          "io"),
      N("rp5", 3800, 720, "Streaming Output",      "Layers",       "Token-by-token SSE stream",  "io",          "io"),
      N("rp6", 4000, 440, "Final Response",        "Zap",          "Unified customer response",  "io",          "io"),

      // ══════════════════════════════════════════════════════
      // LAYER 11 — ANALYTICS, EVENTS & OBSERVABILITY  (x: 4200)
      // ══════════════════════════════════════════════════════
      N("an1", 4200, 100, "AWS EventBridge",       "Zap",          "Event bus — all triggers",   "aws",         "aws"),
      N("an2", 4200, 240, "Amazon CloudWatch",     "BarChart2",    "Metrics / logs / alarms",    "aws",         "aws"),
      N("an3", 4200, 380, "CloudWatch Insights",   "Activity",     "Log query & dashboards",     "aws",         "aws"),
      N("an4", 4200, 520, "SageMaker Monitor",     "Brain",        "Model drift detection",      "aws",         "aws"),
      N("an5", 4200, 660, "Langfuse",              "Activity",     "LLM trace + evals",          "observ",      "observ"),
      N("an6", 4200, 800, "Arize Phoenix",         "Activity",     "Embedding drift + RAG eval", "observ",      "observ"),
      N("an7", 4400, 240, "Ragas Evaluator",       "BarChart2",    "Faithfulness / relevance",   "eval",        "eval"),
      N("an8", 4400, 380, "CSAT Dashboard",        "BarChart2",    "Supervisor analytics UI",    "io",          "io"),
      N("an9", 4400, 520, "Escalation Alert",      "Bell",         "PagerDuty + Slack notify",   "observ",      "observ"),
      N("an10",4400, 660, "Audit Trail S3",        "Cloud",        "Immutable compliance log",   "aws",         "aws"),
      N("an11",4400, 800, "Step Functions",        "Workflow",     "Async escalation workflow",  "aws",         "aws"),

    ],

    edges: [

      // ── LAYER 0 → LAYER 1: Call entry → Voice processing ────
      E("e001", "lc1", "vp1", "audio"),
      E("e002", "lc1", "vp2", "stream"),
      E("e003", "vp1", "vp2", "text"),
      E("e004", "vp2", "vp3", "text"),
      E("e005", "vp3", "vp4", "text"),
      E("e006", "lc2", "sc3", "text"),
      E("e007", "lc3", "sc3", "text"),
      E("e008", "lc4", "sc3", "json"),

      // ── LAYER 1 → LAYER 2: Voice → Security ─────────────────
      E("e009", "vp4", "sc1", "text"),
      E("e010", "sc1", "sc2", "auth"),
      E("e011", "sc2", "sc3", "text"),
      E("e012", "sc3", "sc4", "text"),
      E("e013", "sc4", "sc5", "signal"),
      E("e014", "sc6", "sc3", "signal"),
      E("e015", "sc5", "sc3", "signal"),

      // ── LAYER 2 → LAYER 3: Security → Ingestion ─────────────
      E("e016", "sc3", "di1", "file"),
      E("e017", "sc3", "di2", "file"),
      E("e018", "sc3", "di3", "json"),
      E("e019", "sc3", "di4", "json"),
      E("e020", "sc3", "di5", "docs"),
      E("e021", "sc3", "di6", "docs"),

      // ── LAYER 3: Ingestion internal wiring ──────────────────
      E("e022", "di1", "di7", "file"),
      E("e023", "di2", "di8", "image"),
      E("e024", "di3", "di9", "json"),
      E("e025", "di4", "di9", "json"),
      E("e026", "di5", "di7", "docs"),
      E("e027", "di6", "di7", "docs"),
      E("e028", "di7", "di11","docs"),
      E("e029", "di8", "di12","docs"),
      E("e030", "di9", "di10","json"),
      E("e031", "di10","di11","docs"),
      E("e032", "di12","di11","docs"),
      E("e033", "di13","di11","docs"),

      // ── LAYER 3 → LAYER 4: Chunks → Embeddings ──────────────
      E("e034", "di11","em1", "docs"),
      E("e035", "di11","em2", "docs"),
      E("e036", "di8", "em3", "image"),
      E("e037", "di7", "di13","file"),

      // ── LAYER 4: Embeddings → Indexes ───────────────────────
      E("e038", "em1", "ix1", "embeddings"),
      E("e039", "em1", "ix2", "embeddings"),
      E("e040", "em2", "ix1", "embeddings"),
      E("e041", "em3", "ix1", "embeddings"),
      E("e042", "di11","ix3", "docs"),
      E("e043", "di11","ix4", "docs"),

      // ── LAYER 2 → LAYER 5: Live query → RAG engine ──────────
      E("e044", "sc3", "rg2", "text"),
      E("e045", "rg2", "rg1", "intent"),
      E("e046", "rg2", "rg3", "intent"),
      E("e047", "rg1", "rg4", "text"),
      E("e048", "rg3", "rg4", "filter"),
      E("e049", "rg3", "rg5", "filter"),
      E("e050", "rg3", "rg6", "filter"),

      // ── LAYER 4 Indexes → RAG retrieval ─────────────────────
      E("e051", "ix1", "rg6", "embeddings"),
      E("e052", "ix2", "rg5", "embeddings"),
      E("e053", "ix3", "rg9", "docs"),

      // ── RAG retrieval → Rerankers → Context builder ──────────
      E("e054", "rg4", "rg7", "docs"),
      E("e055", "rg5", "rg7", "docs"),
      E("e056", "rg6", "rg8", "docs"),
      E("e057", "rg7", "rg9", "docs"),
      E("e058", "rg8", "rg9", "docs"),
      E("e059", "rg9", "rg10","text"),

      // ── LAYER 5 → LAYER 6: RAG → Tool APIs ──────────────────
      E("e060", "rg2", "tl1", "intent"),
      E("e061", "rg2", "tl2", "intent"),
      E("e062", "rg2", "tl3", "intent"),
      E("e063", "rg2", "tl4", "intent"),
      E("e064", "rg2", "tl5", "intent"),
      E("e065", "rg2", "tl6", "intent"),
      E("e066", "rg2", "tl7", "intent"),
      E("e067", "rg2", "tl8", "intent"),
      E("e068", "rg2", "tl9", "intent"),
      E("e069", "rg2", "tl10","intent"),
      E("e070", "rg2", "tl11","intent"),
      E("e071", "rg2", "tl12","intent"),
      E("e072", "rg2", "tl13","intent"),
      E("e073", "rg2", "tl14","intent"),
      E("e074", "rg2", "tl15","intent"),
      E("e075", "rg2", "tl16","intent"),

      // ── LAYER 6 → LAYER 7: Tool results → Orchestrator ──────
      E("e076", "tl1", "oc1", "json"),
      E("e077", "tl2", "oc1", "json"),
      E("e078", "tl3", "oc1", "json"),
      E("e079", "tl4", "oc1", "json"),
      E("e080", "tl5", "oc1", "json"),
      E("e081", "tl6", "oc1", "json"),
      E("e082", "tl7", "oc1", "json"),
      E("e083", "tl8", "oc1", "json"),
      E("e084", "tl9", "oc1", "json"),
      E("e085", "tl10","oc1", "json"),
      E("e086", "tl11","oc1", "json"),
      E("e087", "tl12","oc1", "json"),
      E("e088", "tl13","oc1", "signal"),
      E("e089", "tl14","oc1", "json"),
      E("e090", "tl15","oc1", "docs"),
      E("e091", "tl16","oc2", "escalate"),

      // ── RAG context → Orchestrator ───────────────────────────
      E("e092", "rg9", "oc1", "context"),
      E("e093", "rg10","oc1", "citations"),

      // ── Orchestrator internal ─────────────────────────────────
      E("e094", "oc1", "oc2", "plan"),
      E("e095", "oc1", "oc3", "task"),
      E("e096", "oc2", "oc7", "tokens"),
      E("e097", "oc3", "oc7", "tokens"),
      E("e098", "oc7", "oc4", "route"),
      E("e099", "oc7", "oc5", "route"),
      E("e100", "oc7", "oc6", "route"),
      E("e101", "oc4", "ms1", "history"),
      E("e102", "oc5", "ms1", "history"),
      E("e103", "oc6", "ms1", "history"),

      // ── Memory → Orchestrator (read) ─────────────────────────
      E("e104", "ms1", "oc1", "memory"),
      E("e105", "ms2", "oc1", "cache"),
      E("e106", "ms3", "oc1", "prefs"),

      // ── Orchestrator → Audit logs ─────────────────────────────
      E("e107", "oc1", "ms4", "audit"),
      E("e108", "oc1", "ms5", "transcript"),

      // ── LAYER 7 → LAYER 9: LLM output → Guardrails ──────────
      E("e109", "oc4", "gr1", "text"),
      E("e110", "oc4", "gr2", "text"),
      E("e111", "oc4", "gr3", "text"),
      E("e112", "oc4", "gr5", "text"),
      E("e113", "oc5", "gr1", "text"),
      E("e114", "oc6", "gr1", "text"),
      E("e115", "gr3", "gr4", "score"),
      E("e116", "gr4", "tl16","escalate"),
      E("e117", "gr1", "gr6", "signal"),
      E("e118", "gr2", "gr6", "signal"),
      E("e119", "gr3", "gr6", "signal"),
      E("e120", "gr5", "gr6", "signal"),

      // ── LAYER 9 → LAYER 10: Guardrails → Response ────────────
      E("e121", "gr6", "rp1", "text"),
      E("e122", "gr6", "rp2", "text"),
      E("e123", "gr6", "rp3", "text"),
      E("e124", "gr6", "rp4", "json"),
      E("e125", "rp1", "rp5", "audio"),
      E("e126", "rp2", "rp5", "audio"),
      E("e127", "rp3", "rp5", "text"),
      E("e128", "rp4", "rp5", "signal"),
      E("e129", "rp5", "rp6", "stream"),

      // ── Response → Twilio (voice back to caller) ─────────────
      E("e130", "rp6", "lc1", "audio"),

      // ── LAYER 10 → LAYER 11: Response → Analytics ────────────
      E("e131", "rp6", "an1", "event"),
      E("e132", "an1", "an2", "event"),
      E("e133", "an2", "an3", "logs"),
      E("e134", "an2", "an7", "metrics"),
      E("e135", "an1", "an5", "trace"),
      E("e136", "an1", "an6", "trace"),
      E("e137", "gr3", "an8", "score"),
      E("e138", "gr4", "an9", "alert"),
      E("e139", "an9", "an11","signal"),
      E("e140", "ms4", "an10","audit"),
      E("e141", "an4", "an2", "signal"),
      E("e142", "an1", "an4", "event"),
      E("e143", "an7", "an8", "score"),

    ],
  },
  // ============================================================
// U MOBILE SMART REPLY / SMART ASSIST — Phase 3
// Accurate architecture based on actual codebase & FRD
//
// HOW TO USE:
//   Paste the object below into the TEMPLATES array in
//   src/pages/playground/data/templates.js
//   (add a comma after the last existing entry)
//
// ARCHITECTURE STORY (left → right):
//
//  ┌─ INGEST PATH (offline / batch) ──────────────────────────────────────┐
//  │  Data Sources → SFTP/S3 → EventBridge → Lambda Pipeline              │
//  │  → Chunking → Cohere Embed Multilingual v3 → AOSS (5 indices)        │
//  └───────────────────────────────────────────────────────────────────────┘
//
//  ┌─ LIVE CALL RUNTIME PATH (per-turn) ──────────────────────────────────┐
//  │  Customer Call → Genesys CX → AudioHook (WebSocket/TLS)              │
//  │  → AWS EKS (FastAPI app.py / celebal_contact_center runner)           │
//  │  ↓                                                                    │
//  │  Auth: Genesys Implicit Grant Token → mypurecloud OAuth               │
//  │  CRM Model: ZSmartClient → qryCustomerDetail → MSISDN + Name         │
//  │  ↓                                                                    │
//  │  process_job_logic.py                                                 │
//  │    ├─ Load PPID state from DynamoDB (ppid_already_called flag)        │
//  │    ├─ Detect Prospect vs Registered (filter tools accordingly)        │
//  │    ├─ Language selection (EN / BM)                                    │
//  │    ├─ CMS API upsell_model (STS campaign offer eligibility)           │
//  │    └─ Similarity check (rapidfuzz) vs previous_smart_reply            │
//  │  ↓                                                                    │
//  │  smartReply() → utils.py                                              │
//  │    ├─ Step 1: CacheManager.get() → AOSS smart_reply_cache_index       │
//  │    │          HIT  → return cached response (sub-100ms)               │
//  │    │          MISS → proceed                                           │
//  │    ├─ Step 2: HybridLLM.handle_query_two_model()                      │
//  │    │   ├─ ORCHESTRATION: Claude Haiku 3.5                             │
//  │    │   │   ├─ get_filtered_tools() → PPID state templating            │
//  │    │   │   ├─ Tool execution (up to 3 iterations)                     │
//  │    │   │   │   ├─ search_knowledge_base → Retriever                   │
//  │    │   │   │   │   ├─ kb_vs  (KBS_INDEX_NAME)                        │
//  │    │   │   │   │   ├─ att_vs (ATTACHMENT_INDEX_NAME)                  │
//  │    │   │   │   │   ├─ web_vs (WEBSITE_INDEX_NAME)                     │
//  │    │   │   │   │   └─ CohereReranker (cohere.rerank-multilingual-v3)  │
//  │    │   │   │   ├─ ppid_verification → ppidZsmart + KB search          │
//  │    │   │   │   ├─ no_network_troubleshoot → Location + SQVE + ZSmart  │
//  │    │   │   │   ├─ slow_internet_troubleshoot → Location + ZSmart      │
//  │    │   │   │   ├─ find_nearest_stores → AWS Location Service          │
//  │    │   │   │   ├─ get_country_services → S3Reader (IDD/Roaming)       │
//  │    │   │   │   ├─ Smartphone_Details → static URL response            │
//  │    │   │   │   ├─ Device_Stock_Availability → static URL response     │
//  │    │   │   │   ├─ customer_asking_for_eligible_offers → CMS API       │
//  │    │   │   │   ├─ bills_and_payments → billingZsmart                  │
//  │    │   │   │   ├─ ppid_verification (single-use, removed after call)  │
//  │    │   │   │   ├─ query_mnp_order → mnpZsmart                         │
//  │    │   │   │   ├─ get_contract_details → contractDetailsZsmart        │
//  │    │   │   │   ├─ check_postpaid_to_prepaid_downgrade_eligibility      │
//  │    │   │   │   ├─ check_postpaid_to_postpaid_downgrade_eligibility     │
//  │    │   │   │   ├─ check_prepaid_to_postpaid_upgrade_eligibility        │
//  │    │   │   │   └─ check_postpaid_to_postpaid_upgrade_eligibility       │
//  │    │   │   └─ tool_results → pass to Nova                             │
//  │    │   └─ RESPONSE GEN: Amazon Nova Pro                               │
//  │    │       ├─ Responder system prompt (language BM/EN)                │
//  │    │       ├─ Anti-repetition (semantic duplicate check)              │
//  │    │       └─ XML artifact cleanup + markdown link rewrite            │
//  │    └─ Step 3: CacheManager.insert() → AOSS cache index               │
//  │  ↓                                                                    │
//  │  similarity check (rapidfuzz > 90%) → "Nothing"                      │
//  │  PPID state persist → DynamoDB (job.save_state)                       │
//  │  Smart Reply → Genesys Desktop KB iFrame (agent overlay)             │
//  │  Smart Assist → agent chat query → same pipeline                     │
//  └───────────────────────────────────────────────────────────────────────┘
// ============================================================

  {
    id: "umobile_smart_reply_phase3",
    label: "U Mobile Smart Reply & Smart Assist — Phase 3",
    icon: "Phone",
    tags: [
      "telecom", "rag", "aws", "live-call", "smart-reply", "smart-assist",
      "genesys", "audiohook", "opensearch", "dynamodb", "elasticache",
      "bedrock", "claude-haiku", "nova-pro", "cohere", "zsmart",
      "ppid", "mnp", "billing", "eks", "lambda", "eventbridge",
      "s3", "sagemaker", "location", "cms-api", "faiss",
    ],
    description:
      "Phase 3 production AI platform for U Mobile's contact centre (200+ concurrent agents). " +
      "Two modes: Smart Reply (real-time agent suggestion during live call) and Smart Assist (agent chatbot). " +
      "Customer call → Genesys CX → AudioHook WebSocket/TLS → AWS EKS (FastAPI + celebal_contact_center runner) → " +
      "Genesys OAuth token validation → ZSmartClient CRM lookup (MSISDN + customer name) → " +
      "process_job_logic (PPID state from DynamoDB, Prospect detection, language EN/BM, CMS STS upsell) → " +
      "smartReply() with 3-tier caching (AOSS semantic cache → sub-100ms HIT) → " +
      "HybridLLM two-model orchestration: Claude Haiku 3.5 (tool orchestrator) + Amazon Nova Pro (response generator) → " +
      "14 AI tools: search_knowledge_base (3-index AOSS + Cohere Rerank), ppid_verification (single-use + DynamoDB persist), " +
      "no_network / slow_internet (AWS Location + SQVE), find_nearest_stores (AWS Location), " +
      "get_country_services (S3Reader IDD/Roaming), bills_and_payments, query_mnp_order, " +
      "get_contract_details, 4× plan eligibility tools, Smartphone_Details, Device_Stock_Availability, CMS eligible offers → " +
      "AOSS (5 indices: KBS, Website, Attachment, SmartReply, Cache) with Cohere Embed Multilingual v3 + Cohere Rerank v3 → " +
      "DynamoDB session + ElastiCache + EventBridge → " +
      "Genesys Desktop KB iFrame agent overlay + sentiment gauge + feedback thumbs-down + sources attribution",

    nodes: [

      // ══════════════════════════════════════════════════════
      // LAYER 0 — DATA SOURCES (offline ingestion)  x: 40
      // ══════════════════════════════════════════════════════
      N("ds1",  40,   60, "ZSmart KB File Dump",   "Database",     "Daily via SFTP → S3 (site-to-site VPN)", "datasource", "datasource"),
      N("ds2",  40,  180, "U Mobile Website",      "Globe",        "Web scrape (u.com.my) static content",   "datasource", "datasource"),
      N("ds3",  40,  300, "Manual S3 Upload",      "Upload",       "UM team uploads via AWS Console",        "datasource", "datasource"),
      N("ds4",  40,  420, "Avows API",             "Webhook",      "Deals page content (static)",            "datasource", "datasource"),
      N("ds5",  40,  540, "GrowthOps API",         "Webhook",      "Business devices page content",          "datasource", "datasource"),

      // ══════════════════════════════════════════════════════
      // LAYER 1 — INGESTION TRIGGER  x: 260
      // ══════════════════════════════════════════════════════
      N("ig1",  260,  60, "S3 Raw Bucket",         "Cloud",        "PDF / DOCX / XLSX / images / TXT",       "aws",        "aws"),
      N("ig2",  260, 300, "AWS EventBridge",       "Zap",          "S3 PutObject trigger → Lambda",          "aws",        "aws"),
      N("ig3",  260, 540, "SFTP Server",           "Server",       "Secure file transfer from ZSmart",       "processing", "processing"),

      // ══════════════════════════════════════════════════════
      // LAYER 2 — LAMBDA PROCESSING PIPELINE  x: 480
      // ══════════════════════════════════════════════════════
      N("lm1",  480, 100, "Lambda: Dispatcher",   "Zap",          "Fetch from S3 / web / APIs by source",   "aws",        "aws"),
      N("lm2",  480, 240, "Lambda: Web Scraper",  "Zap",          "Scrape u.com.my static pages",           "aws",        "aws"),
      N("lm3",  480, 380, "Lambda: Doc Parser",   "Zap",          "Parse PDF/DOCX/XLSX/images → text",      "aws",        "aws"),
      N("lm4",  480, 520, "Lambda: CSV/Excel ETL","Zap",          "Normalise tabular data → JSON",          "aws",        "aws"),

      // ══════════════════════════════════════════════════════
      // LAYER 3 — CHUNKING + EMBEDDING  x: 700
      // ══════════════════════════════════════════════════════
      N("ch1",  700, 200, "Text Chunker",          "Layers",       "Split text into manageable chunks",      "processing", "processing"),
      N("ch2",  700, 380, "Cohere Embed Multilingual v3", "CircuitBoard", "cohere.embed-multilingual-v3 via Bedrock", "processing", "processing"),

      // ══════════════════════════════════════════════════════
      // LAYER 4 — AOSS (5 INDICES)  x: 920
      // ══════════════════════════════════════════════════════
      N("ix1",  920,  60, "AOSS: KBS Index",       "Search",       "KBS_INDEX_NAME — ZSmart KB articles",    "aws",        "aws"),
      N("ix2",  920, 200, "AOSS: Website Index",   "Search",       "WEBSITE_INDEX_NAME — u.com.my content",  "aws",        "aws"),
      N("ix3",  920, 340, "AOSS: Attachment Index","Search",       "ATTACHMENT_INDEX_NAME — SOP docs / PDFs","aws",        "aws"),
      N("ix4",  920, 480, "AOSS: SmartReply Index","Search",       "SMART_REPLY_INDEX_NAME — stored replies","aws",        "aws"),
      N("ix5",  920, 620, "AOSS: Cache Index",     "Search",       "SMART_REPLY_CACHE_INDEX_NAME — semantic cache", "aws", "aws"),

      // ══════════════════════════════════════════════════════
      // LAYER 5 — LIVE CALL ENTRY  x: 1140
      // ══════════════════════════════════════════════════════
      N("lc1", 1140,  80, "Customer Phone Call",   "Phone",        "Inbound voice call",                     "io",         "io"),
      N("lc2", 1140, 220, "Genesys Cloud CX",      "Network",      "Call routing + PBX integration",         "mcp",        "mcp"),
      N("lc3", 1140, 380, "Genesys Desktop KB",    "Eye",          "iFrame embedded in agent desktop",       "io",         "io"),
      N("lc4", 1140, 520, "Agent (Smart Assist)",  "User",         "Direct chatbot queries from agent",      "io",         "io"),

      // ══════════════════════════════════════════════════════
      // LAYER 6 — AUDIO + AUTH  x: 1360
      // ══════════════════════════════════════════════════════
      N("ah1", 1360, 100, "AudioHook Integration", "Mic",          "WebSocket/TLS real-time audio stream",   "processing", "processing"),
      N("ah2", 1360, 260, "AWS SageMaker STT",     "FileText",     "Speech-to-text transcription",           "aws",        "aws"),
      N("ah3", 1360, 420, "Genesys Implicit Grant","Key",          "OAuth2 token from mypurecloud",          "processing", "processing"),
      N("ah4", 1360, 560, "Token Validator",       "UserCheck",    "api.mypurecloud/v2/users/me validation", "processing", "processing"),

      // ══════════════════════════════════════════════════════
      // LAYER 7 — AWS EKS CORE SERVICE  x: 1580
      // ══════════════════════════════════════════════════════
      N("ek1", 1580, 200, "AWS EKS",               "Server",       "FastAPI app.py + celebal_contact_center runner", "aws", "aws"),
      N("ek2", 1580, 380, "Internal ALB",          "Network",      "Routes traffic to EKS (private subnet)", "aws",        "aws"),
      N("ek3", 1580, 540, "PrivateLink / VPC",     "Lock",         "S3 / DynamoDB / Bedrock without internet","aws",       "aws"),
      N("ek4", 1580,  60, "AWS Secrets Manager",   "Lock",         "API keys / ZSmart credentials",          "aws",        "aws"),

      // ══════════════════════════════════════════════════════
      // LAYER 8 — CRM + JOB INIT  x: 1800
      // ══════════════════════════════════════════════════════
      N("cr1", 1800,  80, "ZSmartClient CRM Model","Database",     "qryCustomerDetail → MSISDN + customer name", "tool",   "tool"),
      N("cr2", 1800, 220, "CMS API",               "Webhook",      "STS campaign offer eligibility (upsell_model)", "tool","tool"),
      N("cr3", 1800, 360, "process_job_logic.py",  "GitBranch",    "Job orchestration: PPID state, language, prospect detection", "processing", "processing"),
      N("cr4", 1800, 500, "DynamoDB: Job State",   "Database",     "PPID flag + MSISDN state persistence across turns", "aws", "aws"),
      N("cr5", 1800, 640, "ElastiCache Redis",     "Server",       "Low-latency session / call data caching","aws",        "aws"),

      // ══════════════════════════════════════════════════════
      // LAYER 9 — SMART REPLY ENTRY + CACHE  x: 2020
      // ══════════════════════════════════════════════════════
      N("sr1", 2020, 100, "Language Selector",     "ScanSearch",   "EN / BM — from custom/smart_reply_language", "processing", "processing"),
      N("sr2", 2020, 240, "Prospect Detection",    "UserCheck",    "Prospect → limit to KB + MNP tools only","processing", "processing"),
      N("sr3", 2020, 380, "smartReply() entry",    "Zap",          "Main entry: format conversation + context", "workflow", "workflow"),
      N("sr4", 2020, 520, "CacheManager.get()",    "Search",       "Semantic similarity search AOSS Cache Index (threshold 1.74)", "processing", "processing"),
      N("sr5", 2020, 660, "Cache HIT → Return",    "Zap",          "Sub-100ms — skip KB + Bedrock entirely", "io",         "io"),

      // ══════════════════════════════════════════════════════
      // LAYER 10 — TOOL FILTERING + PPID STATE  x: 2240
      // ══════════════════════════════════════════════════════
      N("tf1", 2240, 120, "get_filtered_tools()",  "Filter",       "PPID state → inject/remove PPID text in tool descriptions", "processing", "processing"),
      N("tf2", 2240, 280, "Orchestrator Prompt",   "FileText",     "prompts.py: orchestrator system prompt + language instruction", "processing", "processing"),
      N("tf3", 2240, 440, "Responder Prompt",      "FileText",     "prompts.py: Nova responder prompt + anti-repetition rules + PPID response rules", "processing", "processing"),
      N("tf4", 2240, 600, "Previous Reply Context","FileText",     "Previous smart reply passed to Nova for deduplication", "processing", "processing"),

      // ══════════════════════════════════════════════════════
      // LAYER 11 — CLAUDE HAIKU 3.5 ORCHESTRATION  x: 2460
      // ══════════════════════════════════════════════════════
      N("oc1", 2460, 240, "Claude Haiku 3.5",      "Brain",        "Orchestrator: tool selection + execution (max 3 iterations)", "anthropic", "anthropic"),
      N("oc2", 2460, 400, "Tool Loop",             "RefreshCw",    "stop_reason=tool_use → execute → continue / end_turn exit", "workflow", "workflow"),
      N("oc3", 2460, 560, "Malformed XML Guard",   "Shield",       "Detect <function> artifacts → reroute to Nova or output Nothing", "processing", "processing"),

      // ══════════════════════════════════════════════════════
      // LAYER 12 — 14 AI TOOLS  x: 2680
      // ══════════════════════════════════════════════════════
      N("tl1", 2680,  20, "search_knowledge_base", "Search",       "Semantic search: kb + att + web indices. Default tool.", "tool", "tool"),
      N("tl2", 2680, 110, "ppid_verification",     "UserCheck",    "Single-use KYC. Queries KB for manual PPID steps. Removed from tools after first call.", "tool", "tool"),
      N("tl3", 2680, 200, "no_network_troubleshoot","Wrench",      "Location geocode → SQVE / SIM Vulnerability + ZSmart account status + outages", "tool", "tool"),
      N("tl4", 2680, 290, "slow_internet_troubleshoot","Wrench",   "Location geocode → ZSmart data balance + case details + outages", "tool", "tool"),
      N("tl5", 2680, 380, "find_nearest_stores",   "Globe",        "AWS Location Service → nearest U Mobile stores (personal/business + service filter)", "tool", "tool"),
      N("tl6", 2680, 470, "get_country_services",  "Globe",        "S3Reader → IDD calling rates or Roaming charges per country", "tool", "tool"),
      N("tl7", 2680, 560, "Smartphone_Details",    "Smartphone",   "Static URL response (u.com.my/devices)", "tool", "tool"),
      N("tl8", 2680, 650, "Device_Stock_Availability","Package",   "Static URL response (offline-device-stock-check)", "tool", "tool"),
      N("tl9", 2680, 740, "customer_eligible_offers","Star",       "CMS API → STS campaign offer eligibility button", "tool", "tool"),
      N("tl10",2680, 830, "bills_and_payments",    "Wrench",       "billingZsmart → outstanding / unbilled / last payment (PPID-gated)", "tool", "tool"),
      N("tl11",2680, 920, "query_mnp_order",       "ArrowLeftRight","mnpZsmart → port-in/out status + reject codes + resubmission", "tool", "tool"),
      N("tl12",2680,1010, "get_contract_details",  "FileText",     "contractDetailsZsmart → active contracts + ETP (PPID-gated)", "tool", "tool"),
      N("tl13",2680,1100, "post2pre_downgrade",    "TrendingDown", "planEligibilityZsmart → CRP limit + contract + MUT + overdue + member line", "tool", "tool"),
      N("tl14",2680,1190, "post2post_downgrade",   "TrendingDown", "planEligibilityZsmart → blacklist + CRP + contract + MUT + overdue", "tool", "tool"),
      N("tl15",2680,1280, "pre2post_upgrade",      "TrendingUp",   "planEligibilityZsmart + CMS STS campaign eligibility", "tool", "tool"),
      N("tl16",2680,1370, "post2post_upgrade",     "TrendingUp",   "planEligibilityZsmart → account status + CRP + overdue", "tool", "tool"),

      // ══════════════════════════════════════════════════════
      // LAYER 13 — ZSMART API LAYER  x: 2900
      // ══════════════════════════════════════════════════════
      N("zs1", 2900, 100, "ZSmart API Gateway",    "Network",      "ZSmart CRM access token + MSISDN routing", "tool",     "tool"),
      N("zs2", 2900, 220, "qryCustomerDetail",     "Database",     "certType + certNum → account status, customer type", "tool", "tool"),
      N("zs3", 2900, 340, "checkCustomerEligibility","Database",   "Internal blacklist check (certType ≠ 8 only)", "tool",  "tool"),
      N("zs4", 2900, 460, "checkChangeSubsPlan",   "Database",     "CRP limit (≤6/year) + blacklist check",  "tool",       "tool"),
      N("zs5", 2900, 580, "queryBill",             "Database",     "overDueAmount + billing history",        "tool",       "tool"),
      N("zs6", 2900, 700, "queryFFGroupInfo",       "Database",     "Member line / stand-alone plan check",   "tool",       "tool"),
      N("zs7", 2900, 820, "getSubscriberBaseInfo",  "Database",     "Account status + MUT check",             "tool",       "tool"),
      N("zs8", 2900, 940, "querySubscriberAgreement","Database",   "Active contracts + ETP",                 "tool",       "tool"),
      N("zs9", 2900,1060, "queryMNPOrder",          "Database",     "MNP port-in/out status + reject codes",  "tool",       "tool"),
      N("zs10",2900,1180, "SQVE / SIM Vulnerability","Network",    "SIM status + network outage check",      "tool",       "tool"),
      N("zs11",2900,1300, "AWS Location Service",   "Globe",        "Geocode address → lat/lng for store + network lookup", "aws", "aws"),

      // ══════════════════════════════════════════════════════
      // LAYER 14 — RAG: RETRIEVER + RERANKER  x: 3120
      // ══════════════════════════════════════════════════════
      N("rg1", 3120, 100, "Retriever.get_context()","Search",      "Async parallel search: kb_vs + att_vs + web_vs", "rag", "rag"),
      N("rg2", 3120, 260, "AOSS KBS Vector Search", "Search",      "Faiss engine — ZSmart KB articles",      "aws",        "aws"),
      N("rg3", 3120, 420, "AOSS Attachment Search", "Search",      "Faiss engine — SOPs / PDF attachments",  "aws",        "aws"),
      N("rg4", 3120, 580, "AOSS Website Search",    "Search",      "Faiss engine — u.com.my web content",    "aws",        "aws"),
      N("rg5", 3120, 740, "Cohere Rerank v3",       "Filter",      "cohere.rerank-multilingual-v3 cross-encoder top-k", "processing", "processing"),

      // ══════════════════════════════════════════════════════
      // LAYER 15 — AMAZON NOVA PRO RESPONSE GEN  x: 3340
      // ══════════════════════════════════════════════════════
      N("nv1", 3340, 200, "Amazon Nova Pro",        "Sparkles",    "Response generator: analyzes tool results → final reply", "aws", "aws"),
      N("nv2", 3340, 380, "Anti-Repetition Check",  "AlertCircle", "Semantic dedup vs previous smart reply (Nova prompt layer)", "processing", "processing"),
      N("nv3", 3340, 540, "XML Artifact Cleanup",   "RefreshCw",   "Strip <thinking> tags + rewrite internal markdown links", "processing", "processing"),
      N("nv4", 3340, 700, "Language Enforcement",   "ScanSearch",  "EN or BM enforced in responder prompt",  "processing", "processing"),

      // ══════════════════════════════════════════════════════
      // LAYER 16 — POST-GENERATION CHECKS  x: 3560
      // ══════════════════════════════════════════════════════
      N("pg1", 3560, 160, "rapidfuzz Similarity",   "Activity",    "token_set_ratio vs previous reply → >90% → output Nothing", "processing", "processing"),
      N("pg2", 3560, 320, "PPID Flag Persist",      "Database",    "ppid_called=True → job.save_state() → DynamoDB", "aws",   "aws"),
      N("pg3", 3560, 480, "CacheManager.insert()",  "Database",    "Insert query+response into AOSS Cache Index (KL timezone)", "processing", "processing"),
      N("pg4", 3560, 640, "Sources Attribution",    "FileText",    "Source URLs attached to response for agent verification", "processing", "processing"),

      // ══════════════════════════════════════════════════════
      // LAYER 17 — OUTPUT  x: 3780
      // ══════════════════════════════════════════════════════
      N("op1", 3780,  80, "Smart Reply Panel",      "MessageSquare","Real-time agent suggestion with issue tag (Network/SIM/Plans/Port/Mobile)", "io", "io"),
      N("op2", 3780, 240, "Smart Assist Panel",     "Bot",          "Agent chatbot with inline KB answers",  "io",         "io"),
      N("op3", 3780, 400, "Sentiment Gauge",        "Activity",     "Positive / Neutral / Negative per customer utterance", "io", "io"),
      N("op4", 3780, 540, "Feedback Thumbs-Down",   "ThumbsDown",   "Agent feedback → audit trail",          "io",         "io"),
      N("op5", 3780, 680, "DynamoDB: Audit Trail",  "Database",     "Full conversation log + feedback + timestamps", "aws", "aws"),

    ],

    edges: [

      // ── Data sources → S3 / SFTP ────────────────────────────
      E("e001", "ds1", "ig3", "sftp"),
      E("e002", "ds2", "lm2", "scrape"),
      E("e003", "ds3", "ig1", "upload"),
      E("e004", "ds4", "lm1", "api"),
      E("e005", "ds5", "lm1", "api"),
      E("e006", "ig3", "ig1", "file"),

      // ── S3 → EventBridge → Lambda ───────────────────────────
      E("e007", "ig1", "ig2", "event"),
      E("e008", "ig2", "lm1", "trigger"),
      E("e009", "lm1", "lm2", "dispatch"),
      E("e010", "lm1", "lm3", "dispatch"),
      E("e011", "lm1", "lm4", "dispatch"),

      // ── Lambda → Chunking → Embedding → AOSS ───────────────
      E("e012", "lm2", "ch1", "text"),
      E("e013", "lm3", "ch1", "text"),
      E("e014", "lm4", "ch1", "text"),
      E("e015", "ch1", "ch2", "chunks"),
      E("e016", "ch2", "ix1", "embeddings"),
      E("e017", "ch2", "ix2", "embeddings"),
      E("e018", "ch2", "ix3", "embeddings"),
      E("e019", "ch2", "ix4", "embeddings"),

      // ── Live call → AudioHook → EKS ─────────────────────────
      E("e020", "lc1", "lc2", "call"),
      E("e021", "lc2", "ah1", "audio-stream"),
      E("e022", "ah1", "ah2", "audio"),
      E("e023", "ah2", "ek2", "transcript"),
      E("e024", "lc2", "ah3", "oauth"),
      E("e025", "ah3", "ah4", "token"),
      E("e026", "ah4", "ek1", "auth"),
      E("e027", "ek2", "ek1", "route"),
      E("e028", "ek4", "ek1", "secrets"),
      E("e029", "ek3", "ek1", "privatelink"),

      // ── Smart Assist direct path ────────────────────────────
      E("e030", "lc3", "ah4", "token"),
      E("e031", "lc4", "ek1", "query"),

      // ── EKS → CRM Model + job init ──────────────────────────
      E("e032", "ek1", "cr1", "msisdn"),
      E("e033", "cr1", "zs1", "api"),
      E("e034", "zs1", "zs2", "query"),
      E("e035", "cr1", "cr3", "crm-data"),
      E("e036", "ek1", "cr2", "trigger"),
      E("e037", "cr2", "cr3", "upsell-data"),
      E("e038", "cr4", "cr3", "ppid-state"),
      E("e039", "cr5", "cr3", "session"),

      // ── process_job → smartReply ────────────────────────────
      E("e040", "cr3", "sr1", "language"),
      E("e041", "cr3", "sr2", "prospect-flag"),
      E("e042", "sr1", "sr3", "context"),
      E("e043", "sr2", "sr3", "filtered-tools"),

      // ── Cache check ─────────────────────────────────────────
      E("e044", "sr3", "sr4", "query"),
      E("e045", "sr4", "ix5", "search"),
      E("e046", "sr4", "sr5", "cache-hit"),
      E("e047", "sr5", "op1", "response"),

      // ── Cache miss → tool filtering ─────────────────────────
      E("e048", "sr4", "tf1", "cache-miss"),
      E("e049", "tf1", "tf2", "tools"),
      E("e050", "tf1", "tf3", "tools"),
      E("e051", "tf4", "tf3", "context"),

      // ── Prompts → Claude orchestrator ────────────────────────
      E("e052", "tf2", "oc1", "system-prompt"),
      E("e053", "tf3", "nv1", "system-prompt"),
      E("e054", "oc1", "oc2", "tool-use"),
      E("e055", "oc2", "oc3", "response"),

      // ── Claude → tools ───────────────────────────────────────
      E("e056", "oc2", "tl1", "tool-call"),
      E("e057", "oc2", "tl2", "tool-call"),
      E("e058", "oc2", "tl3", "tool-call"),
      E("e059", "oc2", "tl4", "tool-call"),
      E("e060", "oc2", "tl5", "tool-call"),
      E("e061", "oc2", "tl6", "tool-call"),
      E("e062", "oc2", "tl7", "tool-call"),
      E("e063", "oc2", "tl8", "tool-call"),
      E("e064", "oc2", "tl9", "tool-call"),
      E("e065", "oc2", "tl10","tool-call"),
      E("e066", "oc2", "tl11","tool-call"),
      E("e067", "oc2", "tl12","tool-call"),
      E("e068", "oc2", "tl13","tool-call"),
      E("e069", "oc2", "tl14","tool-call"),
      E("e070", "oc2", "tl15","tool-call"),
      E("e071", "oc2", "tl16","tool-call"),

      // ── search_knowledge_base → Retriever → AOSS ────────────
      E("e072", "tl1", "rg1", "query"),
      E("e073", "rg1", "rg2", "search"),
      E("e074", "rg1", "rg3", "search"),
      E("e075", "rg1", "rg4", "search"),
      E("e076", "ix1", "rg2", "index"),
      E("e077", "ix3", "rg3", "index"),
      E("e078", "ix2", "rg4", "index"),
      E("e079", "rg2", "rg5", "docs"),
      E("e080", "rg3", "rg5", "docs"),
      E("e081", "rg4", "rg5", "docs"),
      E("e082", "rg5", "oc2", "reranked-docs"),

      // ── ppid_verification → KB search ───────────────────────
      E("e083", "tl2", "rg1", "ppid-query"),

      // ── network/slow → Location + ZSmart ────────────────────
      E("e084", "tl3", "zs11","address"),
      E("e085", "tl4", "zs11","address"),
      E("e086", "zs11","zs10","coords"),
      E("e087", "tl3", "zs1", "api"),
      E("e088", "tl4", "zs1", "api"),

      // ── store locator → Location ─────────────────────────────
      E("e089", "tl5", "zs11","address"),

      // ── country services → S3Reader ─────────────────────────
      E("e090", "tl6", "ek3", "s3-read"),

      // ── billing/MNP/contract/eligibility → ZSmart ───────────
      E("e091", "tl10","zs1", "api"),
      E("e092", "tl11","zs1", "api"),
      E("e093", "tl12","zs1", "api"),
      E("e094", "tl13","zs1", "api"),
      E("e095", "tl14","zs1", "api"),
      E("e096", "tl15","zs1", "api"),
      E("e097", "tl16","zs1", "api"),

      // ── ZSmart internal routing ──────────────────────────────
      E("e098", "zs1", "zs3", "blacklist"),
      E("e099", "zs1", "zs4", "crp"),
      E("e100", "zs1", "zs5", "billing"),
      E("e101", "zs1", "zs6", "member-line"),
      E("e102", "zs1", "zs7", "subscriber"),
      E("e103", "zs1", "zs8", "contract"),
      E("e104", "zs1", "zs9", "mnp"),

      // ── Tool results → Claude loop ───────────────────────────
      E("e105", "tl1", "oc2", "tool-result"),
      E("e106", "tl2", "oc2", "tool-result"),
      E("e107", "tl3", "oc2", "tool-result"),
      E("e108", "tl4", "oc2", "tool-result"),
      E("e109", "tl5", "oc2", "tool-result"),
      E("e110", "tl6", "oc2", "tool-result"),
      E("e111", "tl7", "oc2", "tool-result"),
      E("e112", "tl8", "oc2", "tool-result"),
      E("e113", "tl9", "oc2", "tool-result"),
      E("e114", "tl10","oc2", "tool-result"),
      E("e115", "tl11","oc2", "tool-result"),
      E("e116", "tl12","oc2", "tool-result"),
      E("e117", "tl13","oc2", "tool-result"),
      E("e118", "tl14","oc2", "tool-result"),
      E("e119", "tl15","oc2", "tool-result"),
      E("e120", "tl16","oc2", "tool-result"),

      // ── Tool results → Nova Pro ──────────────────────────────
      E("e121", "oc2", "nv1", "tool-results-bundle"),
      E("e122", "nv1", "nv2", "draft"),
      E("e123", "nv2", "nv3", "text"),
      E("e124", "nv3", "nv4", "text"),

      // ── Nova → post-generation checks ───────────────────────
      E("e125", "nv4", "pg1", "response"),
      E("e126", "pg1", "pg3", "final-reply"),
      E("e127", "pg3", "ix5", "cache-write"),
      E("e128", "tl2", "pg2", "ppid-called"),
      E("e129", "pg2", "cr4", "persist"),
      E("e130", "nv4", "pg4", "sources"),

      // ── Final output ─────────────────────────────────────────
      E("e131", "pg1", "op1", "smart-reply"),
      E("e132", "pg4", "op1", "sources"),
      E("e133", "pg1", "op2", "smart-assist"),
      E("e134", "ah2", "op3", "sentiment"),
      E("e135", "op4", "op5", "feedback"),
      E("e136", "op1", "op5", "audit"),

      // ── EventBridge analytics ────────────────────────────────
      E("e137", "ek1", "ig2", "events"),
      E("e138", "op5", "ig2", "audit-event"),

    ],
  },
];
