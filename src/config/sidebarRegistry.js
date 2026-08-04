import {
  LayoutDashboard, Rocket, Network, CircleDashed, Orbit, Share2,
  Terminal, Code2, Boxes, Sparkles, Layers, Box,
  BookOpen, BookMarked, Bookmark, GitBranch,
  HelpCircle, Users, HeartHandshake, CheckSquare, GraduationCap,
  Database, Clapperboard, GitCommit, FileText, Globe, Car, Plane,
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

  manual: { icon: BookOpen, label: "Manual", description: "Follow guided lessons" },
  reference: { icon: BookMarked, label: "Quick Reference", description: "Look up key concepts" },
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
  { id: "practice", label: "Practice", itemIds: ["ide", "leetcode", "playground", "genai_playground2", "simulator", "algo_visualizer", "learnbug"] },
  { id: "library", label: "Library", itemIds: ["manual", "reference", "resources", "blog", "links", "github"] },
  { id: "career", label: "Career", itemIds: ["interview_prep", "interviewer", "gemini_interviewer", "emotional_support", "quiz"] },
  { id: "community", label: "Community", itemIds: ["community", "tasks", "aiml_companion"] },
  { id: "more_tools", label: "More tools", itemIds: ["agent_library", "projects", "aws_simulator", "dsa_animator", "k8s_games", "git_visualizer", "flow_design", "notion", "nosignups", "free_system_design"] },
];

// Merges a saved custom layout with the default one so that any item id that
// isn't part of the saved layout (e.g. a feature shipped after the admin last
// customized things) still surfaces somewhere instead of silently vanishing.
export const resolveEffectiveLayout = (savedLayout) => {
  const source = savedLayout && savedLayout.length ? savedLayout : DEFAULT_SIDEBAR_LAYOUT;
  const groups = source.map((group) => ({ ...group, itemIds: [...group.itemIds] }));
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
