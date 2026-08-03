// Shared sidebar navigation behavior.
//
// The legacy Sidebar.jsx keeps its own inline copy of this logic (so it stays
// byte-for-byte "as is"); the redesigned SidebarModern.jsx consumes these
// helpers instead of duplicating them. Both operate on the exact same set of
// App.jsx show-flags / setters, so switching sidebar variants never changes
// what any nav item actually does.
import { SIDEBAR_ITEM_REGISTRY } from "./sidebarRegistry";

// Mirrors Sidebar.jsx's getActiveId — derives which nav id is currently active
// from App.jsx's view flags. `p` is the full sidebar props object.
export function getActiveNavId(p) {
  if (p.showOnboarding) return "onboarding_chat";
  if (p.activeToolHome === "interview") return "interview_prep";
  if (p.activeToolHome === "quiz") return "quiz";
  if (p.activeToolHome === "algo") return "algo_visualizer";
  if (p.activeToolHome === "playground") return "playground";
  if (p.activeToolHome === "interviewer") return "interviewer";
  if (p.activeToolHome === "dsa") return "dsa_animator";
  if (p.activeToolHome === "notion") return "notion";
  if (p.activeToolHome === "kubernetes") return "k8s_games";
  if (p.activeToolHome === "flow") return "flow_design";
  if (p.activeToolHome === "projects") return "projects";
  if (p.activeToolHome === "notes") return "tasks";
  if (p.activeToolHome === "community") return "community";
  if (p.activeToolHome === "github") return "github";
  if (p.activeToolHome === "links") return "links";
  if (p.activeToolHome === "blog") return "blog";
  if (p.activeToolHome === "reference") return "reference";
  if (p.activeToolHome === "manual") return "manual";
  if (p.activeToolHome === "system") return "simulator";
  if (p.activeToolHome === "coding") return "ide";
  if (p.activeToolHome === "resources") return "resources";
  if (p.activeToolHome === "visualize") return "learnbug";
  if (p.showKnowledgeGraph) return "knowledge_graph";
  if (p.showAdminManagement) return "admin_management";
  if (p.showBlog) return "blog";
  if (p.showAwsSimulator) return "aws_simulator";
  if (p.showSimulator) return "simulator";
  if (p.showGalaxy) return "galaxy";
  if (p.showDSAAnimator) return "dsa_animator";
  if (p.showLearnBug) return "learnbug";
  if (p.showAgentLibrary) return "agent_library";
  if (p.showAimlCompanion) return "aiml_companion";
  if (p.showLinks) return "links";
  if (p.showPlayground) return "playground";
  if (p.showProgress) return "progress";
  if (p.showProjects) return "projects";
  if (p.showIDE) return "ide";
  if (p.showResources) return "resources";
  if (p.showCurriculumMap) return "curriculum_map";
  if (p.showRoadmap2) return "roadmap2";
  if (p.showAIInterviewer) return "interviewer";
  if (p.showGeminiInterviewer) return "gemini_interviewer";
  if (p.showEmotionalSupport) return "emotional_support";
  if (p.showAlgoStudio) return "algo_studio";
  if (p.showAlgoVisualizer) return "algo_visualizer";
  if (p.showK8sGames) return "k8s_games";
  if (p.showGitVisualizer) return "git_visualizer";
  if (p.showFlowDesign) return "flow_design";
  if (p.showCommunity) return "community";
  if (p.showNotion) return "notion";
  if (p.showNoSignups) return "nosignups";
  if (p.showFreeSystemDesign) return "free_system_design";
  if (p.showInterviewPrep) return "interview_prep";
  if (p.showWorkplaceLab) return "tasks";
  if (p.showGitHubHub) return "github";
  if (p.showHome2) return "home2";
  if (p.showIntelligenceHub) return "overview";
  if (p.showLegacyIntelligenceHub) return "legacy_hub";
  if (p.showQuiz) return "quiz";
  if (p.showLeetCode) return "leetcode";
  if (p.showManual) return "manual";
  if (p.showReference) return "reference";
  if (!p.activeNode) return "overview";
  return null;
}

// Mirrors Sidebar.jsx's handleNavClick. `p` is the full sidebar props object;
// `ctx` carries the small amount of component-local state the switch needs.
export function runNavClick(id, p, ctx = {}) {
  const { isBlogExpanded, setIsBlogExpanded, isItemVisible } = ctx;

  // Defense in depth: registry-governed items must stay unreachable for a
  // non-admin even if something other than the filtered render triggers a click.
  if (SIDEBAR_ITEM_REGISTRY[id] && isItemVisible && !isItemVisible(id)) return;
  if (p.onOpenToolHome) p.onOpenToolHome(null);
  if (p.setActiveNode) p.setActiveNode(null);
  if (p.setActiveModule) p.setActiveModule(null);
  if (p.setActiveTopic) p.setActiveTopic(null);

  p.setShowCurriculumMap(false);
  if (p.setShowRoadmap2) p.setShowRoadmap2(false);
  if (p.setShowIDE) p.setShowIDE(false);
  if (p.setShowProjects) p.setShowProjects(false);
  if (p.setShowResources) p.setShowResources(false);
  if (p.setShowProgress) p.setShowProgress(false);
  if (p.setShowPlayground) p.setShowPlayground(false);
  if (p.setShowDSAAnimator) p.setShowDSAAnimator(false);
  if (p.setShowLearnBug) p.setShowLearnBug(false);
  if (p.setShowAgentLibrary) p.setShowAgentLibrary(false);
  if (p.setShowAimlCompanion) p.setShowAimlCompanion(false);
  if (p.setShowLinks) p.setShowLinks(false);
  if (p.setShowBlog) p.setShowBlog(false);
  if (p.setShowAdminManagement) p.setShowAdminManagement(false);
  if (p.setShowAwsSimulator) p.setShowAwsSimulator(false);
  if (p.setShowSimulator) p.setShowSimulator(false);
  if (p.setShowGalaxy) p.setShowGalaxy(false);
  if (p.setShowAIInterviewer) p.setShowAIInterviewer(false);
  if (p.setShowGeminiInterviewer) p.setShowGeminiInterviewer(false);
  if (p.setShowEmotionalSupport) p.setShowEmotionalSupport(false);
  if (p.setShowAlgoStudio) p.setShowAlgoStudio(false);
  if (p.setShowAlgoVisualizer) p.setShowAlgoVisualizer(false);
  if (p.setShowK8sGames) p.setShowK8sGames(false);
  if (p.setShowGitVisualizer) p.setShowGitVisualizer(false);
  if (p.setShowFlowDesign) p.setShowFlowDesign(false);
  if (p.setShowWorkplaceLab) p.setShowWorkplaceLab(false);
  if (p.setShowKnowledgeGraph) p.setShowKnowledgeGraph(false);
  if (p.setShowGitHubHub) p.setShowGitHubHub(false);
  if (p.setShowCommunity) p.setShowCommunity(false);
  if (p.setShowNotion) p.setShowNotion(false);
  if (p.setShowNoSignups) p.setShowNoSignups(false);
  if (p.setShowFreeSystemDesign) p.setShowFreeSystemDesign(false);
  if (p.setShowInterviewPrep) p.setShowInterviewPrep(false);
  if (p.setShowIntelligenceHub) p.setShowIntelligenceHub(false);
  if (p.setShowHome2) p.setShowHome2(false);
  if (p.setShowLegacyIntelligenceHub) p.setShowLegacyIntelligenceHub(false);
  if (p.setShowQuiz) p.setShowQuiz(false);
  if (p.setShowLeetCode) p.setShowLeetCode(false);
  if (p.setShowManual) p.setShowManual(false);
  if (p.setShowReference) p.setShowReference(false);
  if (p.setShowOnboarding) p.setShowOnboarding(false);

  switch (id) {
    case "overview":
      if (p.setShowIntelligenceHub) p.setShowIntelligenceHub(true);
      break;
    case "home2":
      if (p.setShowHome2) p.setShowHome2(true);
      break;
    case "onboarding_chat":
      if (p.setShowOnboarding) p.setShowOnboarding(true);
      break;
    case "reference":
      if (p.setActiveReferenceTopic) p.setActiveReferenceTopic(null);
      if (p.onOpenToolHome) p.onOpenToolHome("reference"); else if (p.setShowReference) p.setShowReference(true);
      break;
    case "manual":
      if (p.setActiveManualPhase) p.setActiveManualPhase(null);
      if (p.onOpenToolHome) p.onOpenToolHome("manual"); else if (p.setShowManual) p.setShowManual(true);
      break;
    case "nosignups": if (p.setShowNoSignups) p.setShowNoSignups(true); break;
    case "free_system_design": window.open("https://freesystemdesign.com/", "_blank", "noopener,noreferrer"); break;
    case "knowledge_graph": if (p.setShowKnowledgeGraph) p.setShowKnowledgeGraph(true); break;
    case "curriculum_map": p.setShowCurriculumMap(true); break;
    case "roadmap2": if (p.setShowRoadmap2) p.setShowRoadmap2(true); break;
    case "projects": if (p.onOpenToolHome) p.onOpenToolHome("projects"); else if (p.setShowProjects) p.setShowProjects(true); break;
    case "ide": if (p.onOpenToolHome) p.onOpenToolHome("coding"); else if (p.setShowIDE) p.setShowIDE(true); break;
    case "resources": if (p.onOpenToolHome) p.onOpenToolHome("resources"); else if (p.setShowResources) p.setShowResources(true); break;
    case "progress": if (p.setShowProgress) p.setShowProgress(true); break;
    case "playground": if (p.onOpenToolHome) p.onOpenToolHome("playground"); else if (p.setShowPlayground) p.setShowPlayground(true); break;
    case "genai_playground2": if (p.onOpenGenAIPlayground2) p.onOpenGenAIPlayground2(); break;
    case "dsa_animator": if (p.onOpenToolHome) p.onOpenToolHome("dsa"); else if (p.setShowDSAAnimator) p.setShowDSAAnimator(true); break;
    case "learnbug": if (p.onOpenToolHome) p.onOpenToolHome("visualize"); else if (p.setShowLearnBug) p.setShowLearnBug(true); break;
    case "agent_library": if (p.setShowAgentLibrary) p.setShowAgentLibrary(true); break;
    case "aiml_companion": if (p.setShowAimlCompanion) p.setShowAimlCompanion(true); break;
    case "links":
      if (p.setLinksInitialTab) p.setLinksInitialTab("links");
      if (p.onOpenToolHome) p.onOpenToolHome("links"); else if (p.setShowLinks) p.setShowLinks(true);
      break;
    case "github":
      if (p.onOpenToolHome) p.onOpenToolHome("github"); else if (p.setShowGitHubHub) p.setShowGitHubHub(true);
      break;
    case "aws_simulator": if (p.setShowAwsSimulator) p.setShowAwsSimulator(true); break;
    case "simulator": if (p.onOpenToolHome) p.onOpenToolHome("system"); else if (p.setShowSimulator) p.setShowSimulator(true); break;
    case "galaxy": if (p.setShowGalaxy) p.setShowGalaxy(true); break;
    case "blog":
      if (p.onOpenToolHome) p.onOpenToolHome("blog");
      else { if (setIsBlogExpanded) setIsBlogExpanded(!isBlogExpanded); if (p.onHubNav) p.onHubNav({ view: 'blog', year: null, isAI: false }); }
      break;
    case "admin_management":
      if (p.setShowAdminManagement) p.setShowAdminManagement(true);
      break;
    case "interviewer":
      if (p.onOpenToolHome) p.onOpenToolHome("interviewer"); else if (p.setShowAIInterviewer) p.setShowAIInterviewer(true);
      break;
    case "gemini_interviewer":
      if (p.setShowGeminiInterviewer) p.setShowGeminiInterviewer(true);
      break;
    case "emotional_support":
      if (p.setShowEmotionalSupport) p.setShowEmotionalSupport(true);
      break;
    case "algo_studio":
      if (p.setShowAlgoStudio) p.setShowAlgoStudio(true);
      break;
    case "algo_visualizer":
      if (p.onOpenToolHome) p.onOpenToolHome("algo"); else if (p.setShowAlgoVisualizer) p.setShowAlgoVisualizer(true);
      break;
    case "k8s_games":
      if (p.onOpenToolHome) p.onOpenToolHome("kubernetes"); else if (p.setShowK8sGames) p.setShowK8sGames(true);
      break;
    case "git_visualizer":
      if (p.setShowGitVisualizer) p.setShowGitVisualizer(true);
      break;
    case "flow_design":
      if (p.onOpenToolHome) p.onOpenToolHome("flow"); else if (p.setShowFlowDesign) p.setShowFlowDesign(true);
      break;
    case "notion":
      if (p.onOpenToolHome) p.onOpenToolHome("notion"); else if (p.setShowNotion) p.setShowNotion(true);
      break;
    case "interview_prep":
      if (p.onOpenToolHome) p.onOpenToolHome("interview"); else if (p.setShowInterviewPrep) p.setShowInterviewPrep(true);
      break;
    case "tasks":
      if (p.onOpenToolHome) p.onOpenToolHome("notes"); else if (p.setShowWorkplaceLab) p.setShowWorkplaceLab(true);
      break;
    case "hub":
      if (p.setShowIntelligenceHub) p.setShowIntelligenceHub(true);
      break;
    case "legacy_hub":
      if (p.setShowLegacyIntelligenceHub) p.setShowLegacyIntelligenceHub(true);
      break;
    case "quiz":
      if (p.onOpenToolHome) p.onOpenToolHome("quiz"); else if (p.setShowQuiz) p.setShowQuiz(true);
      break;
    case "leetcode":
      if (p.setShowLeetCode) p.setShowLeetCode(true);
      break;
    case "community":
      if (p.onOpenToolHome) p.onOpenToolHome("community"); else if (p.setShowCommunity) p.setShowCommunity(true);
      break;
    default: break;
  }

  if (p.setIsMobileMenuOpen) p.setIsMobileMenuOpen(false);
}

// Mirrors Sidebar.jsx's pathList builder — turns the raw paths object into
// display-ready study-path cards with progress percentages.
export function buildPathList(paths) {
  return Object.keys(paths || {})
    .filter(k => !["workspace", "videoIntelligence", "saved_algos", "genai-roadmap-campusx", "onboarding", "appearance", "leetcode"].includes(k))
    .map(k => {
      const p = paths[k];
      if (!p) return null;
      const nodeCount = p.nodes ? p.nodes.length : 0;

      let totalModules = 0;
      let completedModules = 0;
      (p.nodes || []).forEach(n => {
        (n.modules || []).forEach(m => {
          totalModules++;
          if (m.status === 'complete') completedModules++;
        });
      });
      const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

      let bg = "rgba(255,255,255,0.05)";
      if (p.color && p.color.startsWith("#")) {
        const hex = p.color.replace("#", "");
        if (hex.length === 6) {
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          bg = `rgba(${r},${g},${b},0.08)`;
        }
      }

      let label = p.title || p.id || k;
      if (k === "ds" && (!p.title || p.title === "Data Science Curriculum")) label = "Data Science";
      if (k === "genai" && (!p.title || p.title === "Gen AI Curriculum")) label = "Gen AI";
      if (k === "agentic" && (!p.title || p.title === "Agentic AI Curriculum")) label = "Agentic AI";
      if (label.includes("Curriculum")) label = label.replace(" Curriculum", "");

      return { key: k, label, color: p.color || "#00ff88", bg, badge: `${nodeCount} nodes`, progressPercent };
    })
    .filter(Boolean);
}
