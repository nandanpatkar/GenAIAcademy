import {
  LayoutDashboard, Rocket, Network, CircleDashed, Orbit, Share2,
  Terminal, Code2, Boxes, Sparkles, Layers, Box,
  BookOpen, BookMarked, Bookmark, GitBranch,
  HelpCircle, Users, HeartHandshake, CheckSquare, GraduationCap,
  Database, Clapperboard, GitCommit, FileText, Globe, Car, Plane,
  DatabaseZap, Split, ShieldCheck, Braces, ReceiptText, PanelLeft,
  Bot, Workflow, Blocks, Activity, Waypoints, FileCode2,
  FlaskConical,
} from "lucide-react";

// Every id here is what Sidebar.jsx's handleNavClick / getActiveId already
// switch on — this registry only controls where an item is grouped and who
// can see it, never invents new navigable ids.
export const SIDEBAR_ITEM_REGISTRY = {
  overview: { icon: LayoutDashboard, label: "Home", description: "Continue your learning" },
  home2: { icon: Rocket, label: "Home 2.0", description: "Mission-control view of the whole academy" },
  curriculum_map: { icon: Network, label: "Roadmaps", description: "See the full learning journey" },
  roadmap2: { icon: Car, label: "Roadmap 2.0", description: "Drive your study path down a highway" },
  roadmap3: { icon: Plane, label: "Roadmap 3.0", description: "Scroll to fly through your study path as a world" },
  progress: { icon: CircleDashed, label: "Progress", description: "Track what you have completed" },
  galaxy: { icon: Orbit, label: "Explore Concepts", description: "Discover connected topics" },
  knowledge_graph: { icon: Share2, label: "Concept Connections", description: "See how ideas relate" },

  ide: { icon: Terminal, label: "Coding Practice", description: "Write and run code" },
  leetcode: { icon: Code2, label: "LeetCode", description: "Solve LeetCode problems" },
  playground: { icon: Boxes, label: "AI Playground", description: "Experiment with AI systems" },
  genai_playground2: { icon: Sparkles, label: "Gen AI Playground 2.0", description: "Design systems, diagrams, and AI whiteboards" },
  simulator: { icon: Layers, label: "System Design", description: "Practice architecture decisions" },
  algo_visualizer: { icon: Box, label: "Algorithm Practice", description: "Learn algorithms step by step" },
  learnbug: { icon: Terminal, label: "Visualize", description: "Debug Python code with memory, structure, and timeline views" },
  sql_lab: { icon: DatabaseZap, label: "SQL & Query Plans", description: "Run real Postgres in-browser and read EXPLAIN ANALYZE output" },
  concurrency_lab: { icon: Split, label: "Concurrency Lab", description: "Step through thread interleavings and watch races happen" },
  lab_enterprise_ai_agents: { icon: ShieldCheck, label: "Enterprise AI Agent Problems", description: "Explore 30 production AI scenarios" },
  lab_chunking_bench: { icon: Braces, label: "Chunking Bench — How RAG Cuts, Embeds and Retrieves a Document", description: "Compare RAG chunking strategies" },
  lab_token_cost: { icon: ReceiptText, label: "Token Cost Lab — Beat the Bill", description: "Simulate and reduce token costs" },
  lab_agent_anatomy: { icon: Network, label: "Agent Anatomy Lab", description: "Build an agent stage by stage" },
  lab_agent_bottlenecks: { icon: PanelLeft, label: "20 AI Agent Bottlenecks, Live", description: "Run agent failure and recovery simulations" },
  lab_eval_forge: { icon: FlaskConical, label: "Eval Forge — Stop Vibe Testing", description: "Design eval suites and uncover hidden regressions" },
  lab_context_architect: { icon: Braces, label: "Context Architect — Pack the Perfect Context", description: "Curate context under a finite token budget" },
  lab_security_arena: { icon: ShieldCheck, label: "Agent Security Arena — Defend the Toolchain", description: "Defend agents against hijacking and excessive authority" },
  lab_memory_garden: { icon: Database, label: "Memory Garden — What Should the Agent Remember?", description: "Design useful, private, and revisable memory" },
  lab_tool_flight_school: { icon: Terminal, label: "Tool Calling Flight School", description: "Design reliable schemas, calls, and outcomes" },
  lab_human_control: { icon: Users, label: "Human-in-the-Loop Control Room", description: "Place approval gates around consequential actions" },
  lab_multi_agent: { icon: Workflow, label: "Multi-Agent Mission Control", description: "Coordinate parallel agents and explicit handoffs" },
  lab_mcp_permissions: { icon: Blocks, label: "MCP Permission Workshop", description: "Scope connectors, resources, and server trust" },
  lab_trace_detective: { icon: Activity, label: "Trace Detective — Debug an Agent Run", description: "Find root causes across traces and outcomes" },
  lab_structured_repair: { icon: FileCode2, label: "Structured Output Repair Shop", description: "Validate and repair machine-readable output" },
  lab_model_router: { icon: Split, label: "Model Router — Right Model, Right Task", description: "Route by complexity, modality, risk, and cost" },
  lab_grounding_court: { icon: BookMarked, label: "Grounding Court — Claim, Evidence, Verdict", description: "Judge claim-level evidence and citations" },
  lab_uncertainty: { icon: CircleDashed, label: "Agent Uncertainty Lab", description: "Calibrate when to answer, verify, ask, or abstain" },
  lab_prompt_cache: { icon: Layers, label: "Prompt Cache Workshop", description: "Structure stable prefixes and safe invalidation" },
  lab_technique_chooser: { icon: GitBranch, label: "Fine-Tune, RAG, Prompt, or Tool?", description: "Choose the right AI adaptation strategy" },

  // Agents — the LangChain Python docs, one entry per library, plus the two
  // agent surfaces that already existed elsewhere in the sidebar.
  langchain: { icon: Bot, label: "LangChain", description: "Build agents with models, tools, and middleware" },
  langgraph: { icon: Workflow, label: "LangGraph", description: "Stateful graphs, durable execution, and time travel" },
  deepagents: { icon: Blocks, label: "Deep Agents", description: "Long-horizon agents with skills, sandboxes, and subagents" },
  langsmith: { icon: Activity, label: "LangSmith", description: "Trace, evaluate, deploy, and monitor agents" },
  langchain_samples: { icon: FileCode2, label: "LangChain Samples", description: "The runnable code behind the docs, plus the repo's own guides" },
  strands: { icon: Waypoints, label: "Strands Agents", description: "The Strands Python SDK: agent loop, tools, evals, and deployment" },

  manual: { icon: BookOpen, label: "Manual", description: "Follow guided lessons" },
  reference: { icon: BookMarked, label: "Quick Reference", description: "Look up key concepts" },
  aws_agentcore: { icon: Layers, label: "AWS Agent Core", description: "The full Amazon Bedrock AgentCore developer guide" },
  resources: { icon: BookOpen, label: "Resources", description: "Browse learning materials" },
  blog: { icon: BookMarked, label: "Blog", description: "Read curated research" },
  links: { icon: Bookmark, label: "Saved Links", description: "Keep useful bookmarks" },
  github: { icon: GitBranch, label: "GitHub", description: "Explore repositories" },

  interview_prep: { icon: HelpCircle, label: "Interview Prep", description: "Prepare with structured lessons" },
  interviewer: { icon: Users, label: "AI Interviewer", description: "Practice realistic interviews" },
  gemini_interviewer: { icon: Sparkles, label: "Gemini Interview", description: "Live data science voice interview" },
  emotional_support: { icon: HeartHandshake, label: "Emotional Support", description: "A calm space to talk things through", defaultVisibility: "admin" },
  quiz: { icon: CheckSquare, label: "Quiz", description: "Practice quizzes and certification exams" },

  community: { icon: Users, label: "Community", description: "Chat and connect with learners" },
  tasks: { icon: CheckSquare, label: "Notes", description: "Capture ideas and reminders" },
  // Historically gated by the standalone allowAimlForAll flag (see resolveItemVisibility) rather
  // than a plain default — kept here too so it still shows correctly before any override exists.
  aiml_companion: { icon: GraduationCap, label: "AIML Companion", description: "Get help while studying", defaultVisibility: "admin" },

  agent_library: { icon: Database, label: "Agent Library", description: "Sync GitHub skills, prompts, and MCP definitions" },
  projects: { icon: Terminal, label: "Cloud Projects", description: "Build and save projects" },
  aws_simulator: { icon: Layers, label: "AWS System Design", description: "Practice AWS architecture" },
  dsa_animator: { icon: Clapperboard, label: "DSA Animator", description: "Animate data structures" },
  k8s_games: { icon: Boxes, label: "Kubernetes Games", description: "Learn through challenges" },
  git_visualizer: { icon: GitCommit, label: "Git Visualizer", description: "Explore branches visually" },
  flow_design: { icon: Network, label: "Flow Design", description: "Design application flows" },
  notion: { icon: FileText, label: "Notion", description: "View your workspace" },
  nosignups: { icon: Globe, label: "NoSignups", description: "Browse external tools" },
  free_system_design: { icon: Layers, label: "Free System Design", description: "Learn system design by building it" },
};

// The out-of-the-box grouping/order, used whenever no admin customization
// (sidebarConfig.layout) has been saved yet.
export const DEFAULT_SIDEBAR_LAYOUT = [
  { id: "learn", label: "Learn", itemIds: ["overview", "home2", "curriculum_map", "roadmap2", "roadmap3", "progress", "galaxy", "knowledge_graph"] },
  { id: "practice", label: "Practice", itemIds: ["ide", "leetcode", "playground", "genai_playground2", "simulator", "algo_visualizer", "learnbug", "sql_lab", "concurrency_lab"] },
  { id: "labs", label: "Labs", itemIds: ["lab_enterprise_ai_agents", "lab_chunking_bench", "lab_token_cost", "lab_agent_anatomy", "lab_agent_bottlenecks", "lab_eval_forge", "lab_context_architect", "lab_security_arena", "lab_memory_garden", "lab_tool_flight_school", "lab_human_control", "lab_multi_agent", "lab_mcp_permissions", "lab_trace_detective", "lab_structured_repair", "lab_model_router", "lab_grounding_court", "lab_uncertainty", "lab_prompt_cache", "lab_technique_chooser"] },
  { id: "agents", label: "Agents", itemIds: ["langchain", "langgraph", "deepagents", "langsmith", "langchain_samples", "strands", "aws_agentcore", "agent_library"] },
  { id: "library", label: "Library", itemIds: ["manual", "reference", "resources", "blog", "links", "github"] },
  { id: "career", label: "Career", itemIds: ["interview_prep", "interviewer", "gemini_interviewer", "emotional_support", "quiz"] },
  { id: "community", label: "Community", itemIds: ["community", "tasks", "aiml_companion"] },
  { id: "more_tools", label: "More tools", itemIds: ["projects", "aws_simulator", "dsa_animator", "k8s_games", "git_visualizer", "flow_design", "notion", "nosignups", "free_system_design"] },
];

const LAB_ITEM_IDS = [
  "lab_enterprise_ai_agents",
  "lab_chunking_bench",
  "lab_token_cost",
  "lab_agent_anatomy",
  "lab_agent_bottlenecks",
  "lab_eval_forge",
  "lab_context_architect",
  "lab_security_arena",
  "lab_memory_garden",
  "lab_tool_flight_school",
  "lab_human_control",
  "lab_multi_agent",
  "lab_mcp_permissions",
  "lab_trace_detective",
  "lab_structured_repair",
  "lab_model_router",
  "lab_grounding_court",
  "lab_uncertainty",
  "lab_prompt_cache",
  "lab_technique_chooser",
];

const AGENT_ITEM_IDS = [
  "langchain",
  "langgraph",
  "deepagents",
  "langsmith",
  "langchain_samples",
  "strands",
  "aws_agentcore",
  "agent_library",
];

// Merges a saved custom layout with the default one so that any item id that
// isn't part of the saved layout (e.g. a feature shipped after the admin last
// customized things) still surfaces somewhere instead of silently vanishing.
export const resolveEffectiveLayout = (savedLayout) => {
  const source = savedLayout && savedLayout.length ? savedLayout : DEFAULT_SIDEBAR_LAYOUT;
  const groups = source.map((group) => ({ ...group, itemIds: [...group.itemIds] }));

  // Migrate the original single Labs destination into a real sidebar subsection.
  // Lab choices stay together even for users with an older saved sidebar layout.
  groups.forEach((group) => {
    group.itemIds = group.itemIds.filter((id) => id !== "labs" && !LAB_ITEM_IDS.includes(id));
  });
  let labsGroup = groups.find((group) => group.id === "labs");
  if (!labsGroup) {
    labsGroup = { id: "labs", label: "Labs", itemIds: [] };
    const libraryIndex = groups.findIndex((group) => group.id === "library");
    groups.splice(libraryIndex === -1 ? groups.length : libraryIndex, 0, labsGroup);
  }
  labsGroup.label = "Labs";
  labsGroup.itemIds.push(...LAB_ITEM_IDS);

  // Same migration for the Agents subsection. Without this, anyone with a saved
  // layout (which is everyone who has ever customized the sidebar) would get the
  // LangChain entries appended to "More tools" as orphans, and would keep
  // aws_agentcore / agent_library in their old groups — so the section would
  // look right on a fresh profile and wrong everywhere else.
  groups.forEach((group) => {
    group.itemIds = group.itemIds.filter((id) => !AGENT_ITEM_IDS.includes(id));
  });
  let agentsGroup = groups.find((group) => group.id === "agents");
  if (!agentsGroup) {
    agentsGroup = { id: "agents", label: "Agents", itemIds: [] };
    const libraryIndex = groups.findIndex((group) => group.id === "library");
    groups.splice(libraryIndex === -1 ? groups.length : libraryIndex, 0, agentsGroup);
  }
  agentsGroup.label = "Agents";
  agentsGroup.itemIds.push(...AGENT_ITEM_IDS);

  const covered = new Set(groups.flatMap((group) => group.itemIds));
  const orphanIds = Object.keys(SIDEBAR_ITEM_REGISTRY).filter((id) => !covered.has(id));
  if (orphanIds.length) {
    const fallback = groups.find((group) => group.id === "more_tools") || groups[groups.length - 1];
    if (fallback) fallback.itemIds.push(...orphanIds);
  }
  return groups;
};

// 'all' | 'admin'. An explicit override always wins; aiml_companion falls
// back to the legacy allowAimlForAll flag for compatibility with data saved
// before this registry existed; everything else falls back to its registry default.
export const resolveItemVisibility = (itemId, { overrides, allowAimlForAll } = {}) => {
  if (overrides && overrides[itemId]) return overrides[itemId];
  if (itemId === "aiml_companion") return allowAimlForAll ? "all" : "admin";
  return SIDEBAR_ITEM_REGISTRY[itemId]?.defaultVisibility || "all";
};
