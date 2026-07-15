// Onboarding chatbot catalogs.
// These are intentionally small, LLM-facing summaries — NOT full duplicates of
// the underlying datasets (manualData.js has 362 guides, referenceData.js has
// 215 sheets; dumping either into a prompt would blow the free-tier token budget).
// Stage 1 (LLM) picks broad categories/tags from these catalogs.
// Stage 2 (local, in aiService.js) matches specific guides/sheets with no API call.

import { PATHS } from "./roadmap";
import { MANUAL_STRUCTURE } from "./manualData";
import { REFERENCE_STRUCTURE } from "./referenceData";

// ── Roadmaps ────────────────────────────────────────────────────────────────
// Built from PATHS so it can never drift out of sync with the real roadmaps.
export const ROADMAP_CATALOG = Object.values(PATHS)
  .filter((p) => p && p.id && p.label)
  .map((p) => ({
    id: p.id,
    label: p.label,
    description: p.description || p.subtitle || "",
    audience: p.audience || "General learners",
    estimatedHours: p.estimatedHours || "Varies",
  }));

// ── Sidebar sections ────────────────────────────────────────────────────────
// Mirrors the ids used in Sidebar.jsx's sidebarGroups / handleNavClick switch.
// NOTE: if a new section is added to Sidebar.jsx, add it here too so the
// onboarding bot can recommend it.
export const SECTION_CATALOG = [
  { id: "overview", label: "Home", description: "Dashboard overview of your learning paths and progress." },
  { id: "galaxy", label: "Knowledge Galaxy", description: "Explore topics visually as a constellation of connected concepts." },
  { id: "knowledge_graph", label: "Knowledge Graph", description: "See how concepts across your curriculum connect to each other." },
  { id: "curriculum_map", label: "Study Map", description: "Visual roadmap of your chosen learning path's modules and progress." },
  { id: "progress", label: "Progress", description: "Track completion status across all your modules and paths." },
  { id: "manual", label: "The Missing Manual", description: "Long-form guides covering logic, math, CS fundamentals, and AI/ML concepts from first principles." },
  { id: "reference", label: "Quick Reference", description: "Cheat sheets for tools, languages, CLIs, and frameworks." },
  { id: "projects", label: "Cloud IDE", description: "Full project workspace with AI assistant, code execution, and file management for building real projects." },
  { id: "ide", label: "Practice IDE", description: "Lightweight code editor for quick Python practice and exercises." },
  { id: "playground", label: "GenAI Simulator", description: "Hands-on sandbox for experimenting with GenAI concepts like RAG, agents, and prompting." },
  { id: "simulator", label: "System Simulator", description: "Simulate and explore general system design concepts interactively." },
  { id: "aws_simulator", label: "AWS System Design Simulator", description: "Build and simulate cloud architecture on AWS, including Bedrock-based AI systems." },
  { id: "dsa_animator", label: "DSA Animator", description: "Watch data structures and algorithms execute step-by-step with animations." },
  { id: "algo_visualizer", label: "Algo Visualizer", description: "Visualize algorithm execution and complexity for interview prep." },
  { id: "k8s_games", label: "K8s Games", description: "Learn Kubernetes concepts through interactive game-based challenges." },
  { id: "git_visualizer", label: "Git Visualizer", description: "Interactive visualization of Git commands, branching, and merging." },
  { id: "flow_design", label: "Flow Design", description: "Design and visualize agentic/AI system architectures as flow diagrams." },
  { id: "notion", label: "Notion", description: "Connected Notion workspace content." },
  { id: "nosignups", label: "NoSignups", description: "Curated list of free tools and resources that don't require signup." },
  { id: "blog", label: "Blog", description: "Written articles and posts on AI engineering topics." },
  { id: "links", label: "Links", description: "Saved bookmarks and curated external resources." },
  { id: "github", label: "Github", description: "GitHub repository browser and integration hub." },
  { id: "tasks", label: "Quick Notes", description: "Personal notes and task tracking." },
  { id: "resources", label: "Resources", description: "Downloadable files, cheatsheets, and study resources." },
  { id: "interviewer", label: "AI Interviewer", description: "Practice live mock interviews with an AI interviewer, including feedback." },
  { id: "interview_prep", label: "Interview Prep", description: "22 structured courses covering technical and behavioral interview preparation." },
  { id: "quiz", label: "Quiz", description: "Test your knowledge with quizzes across various AI/ML/CS topics." },
];

// ── Manual categories (28 top-level categories, not the 362 guides) ────────
export const MANUAL_CATEGORY_CATALOG = MANUAL_STRUCTURE.map((cat) => ({
  slug: cat.slug,
  name: cat.name,
  blurb: cat.blurb || "",
}));

// ── Reference tags ───────────────────────────────────────────────────────────
// Curated down to dev/AI-relevant tags — REFERENCE_STRUCTURE also contains a
// lot of generic app-shortcut tags (Photoshop, 1Password, etc.) that aren't
// useful signal for an AI-learning-focused recommendation.
const RELEVANT_TAG_PATTERN = /ai\b|ml\b|llm|gpt|langchain|pandas|numpy|pytorch|tensorflow|python|azure|aws|cloud|api|agent|gemini|claude|openai|docker|kubernetes|k8s|sql|database|git|cli|framework|backend|frontend|javascript|react|node/i;

export const REFERENCE_TAG_CATALOG = Array.from(
  new Set(
    REFERENCE_STRUCTURE.flatMap((sheet) => sheet.tags || []).filter((tag) =>
      RELEVANT_TAG_PATTERN.test(tag)
    )
  )
).sort();
