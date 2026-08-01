import React, { useState, useEffect } from "react";
import { LayoutDashboard, Network, CheckSquare, CircleDashed, BookOpen, Users, Hexagon, Edit2, Edit3, Eye, RotateCcw, Terminal, Code2, LogOut, Sun, Moon, Boxes, Box, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Clapperboard, BookMarked, Database, Shield, Cpu, Orbit, GraduationCap, Layers, BoxSelect, Sparkles, ExternalLink, Share2, Bookmark, GitCommit, GitBranch, HelpCircle, FileText, Search, Globe, Palette } from "lucide-react";
// Note: Sparkles was already imported above — kept as a single import line to avoid duplicate-identifier errors.
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import AppearanceSettings from "./AppearanceSettings";
import BentoCard from "./BentoCard";


export default function Sidebar({
  activePath, setActivePath, paths,
  activeNode, onReset, isEditMode, setIsEditMode, onAddPath, onEditPath,
  showCurriculumMap, setShowCurriculumMap,
  showIDE, setShowIDE,
  showProjects, setShowProjects,
  showResources, setShowResources,
  showProgress, setShowProgress,
  showPlayground, setShowPlayground,
  showDSAAnimator, setShowDSAAnimator,
  showLearnBug, setShowLearnBug,
  showAgentLibrary, setShowAgentLibrary,
  showBlog, setShowBlog,
  showAdminManagement, setShowAdminManagement,
  showAwsSimulator, setShowAwsSimulator,
  showSimulator, setShowSimulator,
  showGalaxy, setShowGalaxy,
  showAimlCompanion, setShowAimlCompanion,
  showLinks, setShowLinks,
  showAIInterviewer, setShowAIInterviewer,
  showGeminiInterviewer, setShowGeminiInterviewer,
  showAlgoStudio, setShowAlgoStudio,
  showAlgoVisualizer, setShowAlgoVisualizer,
  showK8sGames, setShowK8sGames,
  showGitVisualizer, setShowGitVisualizer,
  showFlowDesign, setShowFlowDesign,
  showIntelligenceHub, setShowIntelligenceHub,
  showLegacyIntelligenceHub, setShowLegacyIntelligenceHub,
  showWorkplaceLab, setShowWorkplaceLab,
  showKnowledgeGraph, setShowKnowledgeGraph,
  showCommunity, setShowCommunity,
  showNotion, setShowNotion,
  showInterviewPrep, setShowInterviewPrep,
  isMobileMenuOpen, setIsMobileMenuOpen,
  setActiveNode, setActiveModule, setActiveTopic,
  onSignOut,
  onHubNav,
  setLinksInitialTab,
  showGitHubHub, setShowGitHubHub,
  isCollapsed, setIsCollapsed,
  onSectionWalkthrough,
  showQuiz, setShowQuiz,
  showLeetCode, setShowLeetCode,
  showNoSignups, setShowNoSignups,
  showFreeSystemDesign, setShowFreeSystemDesign,
  showManual, setShowManual,
  activeManualPhase, setActiveManualPhase,
  showReference, setShowReference,
  activeReferenceTopic, setActiveReferenceTopic,
  showOnboarding, setShowOnboarding,
  activeToolHome, onOpenToolHome,
  onOpenGenAIPlayground2
}) {
  const [isBlogExpanded, setIsBlogExpanded] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [isPathsVisible, setIsPathsVisible] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({
    Learn: true,
    Practice: true,
    Library: false,
    Career: false,
    Community: false,
    Support: false,
    "More tools": false,
  });
  const [showAppearance, setShowAppearance] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAdmin, isAdminView, setIsAdminView, allowAimlForAll, geminiKey, updateGeminiKey, aiProvider, updateAiProvider, azureEndpoint, updateAzureEndpoint, azureKey, updateAzureKey } = useAuth();
  const [localKey, setLocalKey] = useState(geminiKey || "");
  const [localProvider, setLocalProvider] = useState(aiProvider || "gemini");
  const [localAzureEndpoint, setLocalAzureEndpoint] = useState(azureEndpoint || "");
  const [localAzureKey, setLocalAzureKey] = useState(azureKey || "");

  useEffect(() => {
    setLocalKey(geminiKey || "");
    setLocalProvider(aiProvider || "gemini");
    setLocalAzureEndpoint(azureEndpoint || "");
    setLocalAzureKey(azureKey || "");
  }, [geminiKey, aiProvider, azureEndpoint, azureKey]);

  const sidebarGroups = [
    {
      label: "Learn",
      items: [
        { icon: <LayoutDashboard size={14} />, label: "Home", id: "overview", description: "Continue your learning" },
        { icon: <Network size={14} />, label: "Roadmaps", id: "curriculum_map", description: "See the full learning journey" },
        { icon: <CircleDashed size={14} />, label: "Progress", id: "progress", description: "Track what you have completed" },
        { icon: <Orbit size={14} />, label: "Explore Concepts", id: "galaxy", description: "Discover connected topics" },
        { icon: <Share2 size={14} />, label: "Concept Connections", id: "knowledge_graph", description: "See how ideas relate" },
      ]
    },
    {
      label: "Practice",
      items: [
        { icon: <Terminal size={14} />, label: "Coding Practice", id: "ide", description: "Write and run code" },
        { icon: <Code2 size={14} />, label: "LeetCode", id: "leetcode", description: "Solve LeetCode problems" },
        { icon: <Boxes size={14} />, label: "AI Playground", id: "playground", description: "Experiment with AI systems" },
        { icon: <Sparkles size={14} />, label: "Gen AI Playground 2.0", id: "genai_playground2", description: "Design systems, diagrams, and AI whiteboards" },
        { icon: <Layers size={14} />, label: "System Design", id: "simulator", description: "Practice architecture decisions" },
        { icon: <Box size={14} />, label: "Algorithm Practice", id: "algo_visualizer", description: "Learn algorithms step by step" },
        { icon: <Terminal size={14} />, label: "Visualize", id: "learnbug", description: "Debug Python code with memory, structure, and timeline views" },
      ]
    },
    {
      label: "Library",
      items: [
        { icon: <BookOpen size={14} />, label: "Manual", id: "manual", description: "Follow guided lessons" },
        { icon: <BookMarked size={14} />, label: "Quick Reference", id: "reference", description: "Look up key concepts" },
        { icon: <BookOpen size={14} />, label: "Resources", id: "resources", description: "Browse learning materials" },
        { icon: <BookMarked size={14} />, label: "Blog", id: "blog", description: "Read curated research" },
        { icon: <Bookmark size={14} />, label: "Saved Links", id: "links", description: "Keep useful bookmarks" },
        { icon: <GitBranch size={14} />, label: "GitHub", id: "github", description: "Explore repositories" },
      ]
    },
    {
      label: "Career",
      items: [
        { icon: <HelpCircle size={14} />, label: "Interview Prep", id: "interview_prep", description: "Prepare with structured lessons" },
        { icon: <Users size={14} />, label: "AI Interviewer", id: "interviewer", description: "Practice realistic interviews" },
        { icon: <Sparkles size={14} />, label: "Gemini Interview", id: "gemini_interviewer", description: "Live data science voice interview" },
        { icon: <CheckSquare size={14} />, label: "Quiz", id: "quiz", description: "Test your understanding" },
      ]
    },
    {
      label: "Community",
      items: [
        { icon: <Users size={14} />, label: "Community", id: "community", description: "Chat and connect with learners" },
        { icon: <CheckSquare size={14} />, label: "Notes", id: "tasks", description: "Capture ideas and reminders" },
        ...((isAdmin || allowAimlForAll) ? [
          { icon: <GraduationCap size={14} />, label: "AIML Companion", id: "aiml_companion", description: "Get help while studying" }
        ] : []),
      ]
    },
    {
      label: "More tools",
      items: [
        { icon: <Database size={14} />, label: "Agent Library", id: "agent_library", description: "Sync GitHub skills, prompts, and MCP definitions" },
        { icon: <Terminal size={14} />, label: "Cloud Projects", id: "projects", description: "Build and save projects" },
        { icon: <Layers size={14} />, label: "AWS System Design", id: "aws_simulator", description: "Practice AWS architecture" },
        { icon: <Clapperboard size={14} />, label: "DSA Animator", id: "dsa_animator", description: "Animate data structures" },
        { icon: <Boxes size={14} />, label: "Kubernetes Games", id: "k8s_games", description: "Learn through challenges" },
        { icon: <GitCommit size={14} />, label: "Git Visualizer", id: "git_visualizer", description: "Explore branches visually" },
        { icon: <Network size={14} />, label: "Flow Design", id: "flow_design", description: "Design application flows" },
        { icon: <FileText size={14} />, label: "Notion", id: "notion", description: "View your workspace" },
        { icon: <Globe size={14} />, label: "NoSignups", id: "nosignups", description: "Browse external tools" },
        { icon: <Layers size={14} />, label: "Free System Design", id: "free_system_design", description: "Learn system design by building it" },
      ]
    },
    ...(isAdmin && isAdminView ? [{
      label: "Admin",
      items: [
        { icon: <Shield size={14} />, label: "Admin Panel", id: "admin_management" },
        { icon: <Cpu size={14} />, label: "Algo Studio", id: "algo_studio" },
        { icon: <Sparkles size={14} />, label: "AI Pathfinder", id: "onboarding_chat", description: "Build a learning path around your goals" },
      ]
    }] : [])
  ];

  const handleResetClick = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    } else {
      onReset();
      setResetConfirm(false);
    }
  };

  const getActiveId = () => {
    if (showOnboarding) return "onboarding_chat";
    if (activeToolHome === "interview") return "interview_prep";
    if (activeToolHome === "quiz") return "quiz";
    if (activeToolHome === "algo") return "algo_visualizer";
    if (activeToolHome === "playground") return "playground";
    if (activeToolHome === "interviewer") return "interviewer";
    if (activeToolHome === "dsa") return "dsa_animator";
    if (activeToolHome === "notion") return "notion";
    if (activeToolHome === "kubernetes") return "k8s_games";
    if (activeToolHome === "flow") return "flow_design";
    if (activeToolHome === "projects") return "projects";
    if (activeToolHome === "notes") return "tasks";
    if (activeToolHome === "community") return "community";
    if (activeToolHome === "github") return "github";
    if (activeToolHome === "links") return "links";
    if (activeToolHome === "blog") return "blog";
    if (activeToolHome === "reference") return "reference";
    if (activeToolHome === "manual") return "manual";
    if (activeToolHome === "system") return "simulator";
    if (activeToolHome === "coding") return "ide";
    if (activeToolHome === "resources") return "resources";
    if (activeToolHome === "visualize") return "learnbug";
    if (showKnowledgeGraph) return "knowledge_graph";
    if (showAdminManagement) return "admin_management";
    if (showBlog) return "blog";
    if (showAwsSimulator) return "aws_simulator";
    if (showSimulator) return "simulator";
    if (showGalaxy) return "galaxy";
    if (showDSAAnimator) return "dsa_animator";
    if (showLearnBug) return "learnbug";
    if (showAgentLibrary) return "agent_library";
    if (showAimlCompanion) return "aiml_companion";
    if (showLinks) return "links";
    if (showPlayground) return "playground";
    if (showProgress) return "progress";
    if (showProjects) return "projects";
    if (showIDE) return "ide";
    if (showResources) return "resources";
    if (showCurriculumMap) return "curriculum_map";
    if (showAIInterviewer) return "interviewer";
    if (showGeminiInterviewer) return "gemini_interviewer";
    if (showAlgoStudio) return "algo_studio";
    if (showAlgoVisualizer) return "algo_visualizer";
    if (showK8sGames) return "k8s_games";
    if (showGitVisualizer) return "git_visualizer";
    if (showFlowDesign) return "flow_design";
    if (showCommunity) return "community";
    if (showNotion) return "notion";
    if (showNoSignups) return "nosignups";
    if (showFreeSystemDesign) return "free_system_design";
    if (showInterviewPrep) return "interview_prep";
    if (showWorkplaceLab) return "tasks";
    if (showGitHubHub) return "github";
    if (showIntelligenceHub) return "overview";
    if (showLegacyIntelligenceHub) return "legacy_hub";
    if (showQuiz) return "quiz";
    if (showLeetCode) return "leetcode";
    if (showManual) return "manual";
    if (showReference) return "reference";
    if (!activeNode) return "overview";
    return null;
  };

  const activeNavId = getActiveId();

  const handleNavClick = (id) => {
    if (onOpenToolHome) onOpenToolHome(null);
    if (setActiveNode) setActiveNode(null);
    if (setActiveModule) setActiveModule(null);
    if (setActiveTopic) setActiveTopic(null);

    setShowCurriculumMap(false);
    if (setShowIDE) setShowIDE(false);
    if (setShowProjects) setShowProjects(false);
    if (setShowResources) setShowResources(false);
    if (setShowProgress) setShowProgress(false);
    if (setShowPlayground) setShowPlayground(false);
    if (setShowDSAAnimator) setShowDSAAnimator(false);
    if (setShowLearnBug) setShowLearnBug(false);
    if (setShowAgentLibrary) setShowAgentLibrary(false);
    if (setShowAimlCompanion) setShowAimlCompanion(false);
    if (setShowLinks) setShowLinks(false);
    if (setShowBlog) setShowBlog(false);
    if (setShowAdminManagement) setShowAdminManagement(false);
    if (setShowAwsSimulator) setShowAwsSimulator(false);
    if (setShowSimulator) setShowSimulator(false);
    if (setShowGalaxy) setShowGalaxy(false);
    if (setShowAIInterviewer) setShowAIInterviewer(false);
    if (setShowGeminiInterviewer) setShowGeminiInterviewer(false);
    if (setShowAlgoStudio) setShowAlgoStudio(false);
    if (setShowAlgoVisualizer) setShowAlgoVisualizer(false);
    if (setShowK8sGames) setShowK8sGames(false);
    if (setShowGitVisualizer) setShowGitVisualizer(false);
    if (setShowFlowDesign) setShowFlowDesign(false);
    if (setShowWorkplaceLab) setShowWorkplaceLab(false);
    if (setShowKnowledgeGraph) setShowKnowledgeGraph(false);
    if (setShowGitHubHub) setShowGitHubHub(false);
    if (setShowCommunity) setShowCommunity(false);
    if (setShowNotion) setShowNotion(false);
    if (setShowNoSignups) setShowNoSignups(false);
    if (setShowFreeSystemDesign) setShowFreeSystemDesign(false);
    if (setShowInterviewPrep) setShowInterviewPrep(false);
    if (setShowIntelligenceHub) setShowIntelligenceHub(false);
    if (setShowLegacyIntelligenceHub) setShowLegacyIntelligenceHub(false);
    if (setShowQuiz) setShowQuiz(false);
    if (setShowLeetCode) setShowLeetCode(false);
    if (setShowManual) setShowManual(false);
    if (setShowReference) setShowReference(false);
    if (setShowOnboarding) setShowOnboarding(false);

    switch (id) {
      case "overview":
        // Home is the learner dashboard, not just the roadmap canvas.
        if (setShowIntelligenceHub) setShowIntelligenceHub(true);
        break;
      case "onboarding_chat":
        if (setShowOnboarding) setShowOnboarding(true);
        break;
      case "reference":
        if (setActiveReferenceTopic) setActiveReferenceTopic(null);
        if (onOpenToolHome) onOpenToolHome("reference"); else if (setShowReference) setShowReference(true);
        break;
      case "manual": 
        if (setActiveManualPhase) setActiveManualPhase(null);
        if (onOpenToolHome) onOpenToolHome("manual"); else if (setShowManual) setShowManual(true);
        break;
      case "nosignups": if (setShowNoSignups) setShowNoSignups(true); break;
      case "free_system_design": window.open("https://freesystemdesign.com/", "_blank", "noopener,noreferrer"); break;
      case "knowledge_graph": if (setShowKnowledgeGraph) setShowKnowledgeGraph(true); break;
      case "curriculum_map": setShowCurriculumMap(true); break;
      case "projects": if (onOpenToolHome) onOpenToolHome("projects"); else if (setShowProjects) setShowProjects(true); break;
      case "ide": if (onOpenToolHome) onOpenToolHome("coding"); else if (setShowIDE) setShowIDE(true); break;
      case "resources": if (onOpenToolHome) onOpenToolHome("resources"); else if (setShowResources) setShowResources(true); break;
      case "progress": if (setShowProgress) setShowProgress(true); break;
      case "playground": if (onOpenToolHome) onOpenToolHome("playground"); else if (setShowPlayground) setShowPlayground(true); break;
      case "genai_playground2": if (onOpenGenAIPlayground2) onOpenGenAIPlayground2(); break;
      case "dsa_animator": if (onOpenToolHome) onOpenToolHome("dsa"); else if (setShowDSAAnimator) setShowDSAAnimator(true); break;
      case "learnbug": if (onOpenToolHome) onOpenToolHome("visualize"); else if (setShowLearnBug) setShowLearnBug(true); break;
      case "agent_library": if (setShowAgentLibrary) setShowAgentLibrary(true); break;
      case "aiml_companion": if (setShowAimlCompanion) setShowAimlCompanion(true); break;
      case "links": 
        if (setLinksInitialTab) setLinksInitialTab("links");
        if (onOpenToolHome) onOpenToolHome("links"); else if (setShowLinks) setShowLinks(true);
        break;
      case "github":
        if (onOpenToolHome) onOpenToolHome("github"); else if (setShowGitHubHub) setShowGitHubHub(true);
        break;
      case "aws_simulator": if (setShowAwsSimulator) setShowAwsSimulator(true); break;
      case "simulator": if (onOpenToolHome) onOpenToolHome("system"); else if (setShowSimulator) setShowSimulator(true); break;
      case "galaxy": if (setShowGalaxy) setShowGalaxy(true); break;
      case "blog": 
        if (onOpenToolHome) onOpenToolHome("blog");
        else { setIsBlogExpanded(!isBlogExpanded); if (onHubNav) onHubNav({ view: 'blog', year: null, isAI: false }); }
        break;
      case "admin_management":
        if (setShowAdminManagement) setShowAdminManagement(true);
        break;
      case "interviewer":
        if (onOpenToolHome) onOpenToolHome("interviewer"); else if (setShowAIInterviewer) setShowAIInterviewer(true);
        break;
      case "gemini_interviewer":
        if (setShowGeminiInterviewer) setShowGeminiInterviewer(true);
        break;
      case "algo_studio":
        if (setShowAlgoStudio) setShowAlgoStudio(true);
        break;
      case "algo_visualizer":
        if (onOpenToolHome) onOpenToolHome("algo"); else if (setShowAlgoVisualizer) setShowAlgoVisualizer(true);
        break;
      case "k8s_games":
        if (onOpenToolHome) onOpenToolHome("kubernetes"); else if (setShowK8sGames) setShowK8sGames(true);
        break;
      case "git_visualizer":
        if (setShowGitVisualizer) setShowGitVisualizer(true);
        break;
      case "flow_design":
        if (onOpenToolHome) onOpenToolHome("flow"); else if (setShowFlowDesign) setShowFlowDesign(true);
        break;
      case "notion":
        if (onOpenToolHome) onOpenToolHome("notion"); else if (setShowNotion) setShowNotion(true);
        break;
      case "interview_prep":
        if (onOpenToolHome) onOpenToolHome("interview"); else if (setShowInterviewPrep) setShowInterviewPrep(true);
        break;
      case "tasks":
        if (onOpenToolHome) onOpenToolHome("notes"); else if (setShowWorkplaceLab) setShowWorkplaceLab(true);
        break;
      case "hub":
        if (setShowIntelligenceHub) setShowIntelligenceHub(true);
        break;
      case "legacy_hub":
        if (setShowLegacyIntelligenceHub) setShowLegacyIntelligenceHub(true);
        break;
      case "quiz":
        if (onOpenToolHome) onOpenToolHome("quiz"); else if (setShowQuiz) setShowQuiz(true);
        break;
      case "leetcode":
        if (setShowLeetCode) setShowLeetCode(true);
        break;
      case "community":
        if (onOpenToolHome) onOpenToolHome("community"); else if (setShowCommunity) setShowCommunity(true);
        break;
      default: break;
    }

    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const pathList = Object.keys(paths || {})
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
  });

  return (
    <>
    <aside className={`sidebar${isCollapsed ? " sidebar-collapsed" : ""}${isMobileMenuOpen ? " sidebar-mobile-open" : ""}${isPathsVisible ? " sidebar-paths-visible" : ""}`}>
      <div className="sidebar-logo morphing-header">
        <div className="logo-orb">
          <svg className="quantum-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(-30 50 50)" className="logo-orbit" />
            <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(30 50 50)" className="logo-orbit" />
            <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(90 50 50)" className="logo-orbit" />
            <circle r="3" className="logo-node node-1" />
            <circle r="3" className="logo-node node-2" />
            <circle r="3" className="logo-node node-3" />
            <path d="M50 35L63 42.5V57.5L50 65L37 57.5V42.5L50 35Z" className="logo-nucleus" />
            <circle cx="50" cy="50" r="4" className="logo-core" />
          </svg>
          <div className="logo-pulse" />
        </div>

        {!isCollapsed && (
          <div className="brand-layer">
            <div className="brand-stack">
              <span className="brand pixar-brand line-1">
                {"GenAI".split("").map((char, i) => (
                  <span key={i} className={`pixar-char ${char === 'I' ? 'char-i' : ''}`} style={{ "--idx": i }}>
                    {char}
                  </span>
                ))}
              </span>
              <span className="brand pixar-brand line-2">
                {"Academy".split("").map((char, i) => (
                  <span key={i + 6} className="pixar-char academy-char" style={{ "--idx": i + 6 }}>
                    {char}
                  </span>
                ))}
              </span>
            </div>
          </div>
        )}

        <button
          className="sidebar-collapse-btn"
          onClick={() => setIsCollapsed(c => !c)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <div
        className="sidebar-item sidebar-search-btn"
        onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
        title="Search (⌘K)"
        style={{ margin: "4px 0 8px" }}
      >
        <span className="sidebar-item-icon">
          <Search size={14} />
        </span>
        {!isCollapsed && (
          <>
            <span>Search</span>
            <span style={{
              marginLeft: "auto", fontSize: 10, opacity: 0.5,
              border: "1px solid var(--bg3)", borderRadius: 4, padding: "1px 5px",
              fontFamily: "var(--mono, monospace)",
            }}>
              ⌘K
            </span>
          </>
        )}
      </div>

      <div className="sidebar-nav-container">
        <div className="sidebar-nav">
          {sidebarGroups.map((group) => (
            <div key={group.label} className="sidebar-group">
              {!isCollapsed && (
                <button
                  className="sidebar-section-header sidebar-section-toggle"
                  onClick={() => setExpandedGroups(prev => ({ ...prev, [group.label]: !prev[group.label] }))}
                  aria-expanded={expandedGroups[group.label] !== false}
                >
                  <span className="sidebar-section-label">{group.label}</span>
                  <ChevronDown size={12} className={expandedGroups[group.label] === false ? "section-chevron collapsed" : "section-chevron"} />
                </button>
              )}
              <div className="sidebar-section" style={{ display: isCollapsed || expandedGroups[group.label] !== false ? undefined : "none" }}>
                {group.items.map((item) => (
                  <React.Fragment key={item.id}>
                    <div
                      id={`sidebar-item-${item.id}`}
                      className={`sidebar-item ${activeNavId === item.id ? "active" : ""}`}
                      onClick={() => handleNavClick(item.id)}
                      data-label={item.label}
                      title={!isCollapsed && item.description ? item.description : item.label}
                    >
                      <span className="sidebar-item-icon">
                        {item.icon}
                      </span>
                      {!isCollapsed && <span>{item.label}</span>}
                      {!isCollapsed && item.id !== 'blog' && onSectionWalkthrough && (
                        <button
                          className="sidebar-section-info-btn"
                          title={`Guide: ${item.label}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSectionWalkthrough(item.id);
                          }}
                        >
                          <HelpCircle size={12} />
                        </button>
                      )}
                      {!isCollapsed && item.id === 'blog' && (
                        <ChevronRight size={12} style={{ marginLeft: 'auto', transition: '0.3s', transform: isBlogExpanded ? 'rotate(90deg)' : 'none' }} />
                      )}
                    </div>

                    {!isCollapsed && item.id === 'blog' && isBlogExpanded && (
                      <div className="sidebar-sub-menu">
                        <div className="sub-item ai-sub" onClick={() => onHubNav({ view: 'blog', year: null, isAI: true })}>
                          <Sparkles size={12} />
                          <span>Neural Pilot</span>
                        </div>
                        <div className="sub-item" onClick={() => onHubNav({ view: 'blog', year: '2025', isAI: false })}>
                          <div className="sub-dot" />
                          <span>2025 Repository</span>
                        </div>
                        <div className="sub-item" onClick={() => onHubNav({ view: 'blog', year: '2024', isAI: false })}>
                          <div className="sub-dot" />
                          <span>2024 Repository</span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {!isCollapsed && <div className="group-divider" />}
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-divider-wrapper">
        <div className="sidebar-divider" />
        {!isCollapsed && (
          <button 
            className="sidebar-paths-toggle"
            onClick={() => setIsPathsVisible(!isPathsVisible)}
            title={isPathsVisible ? "Hide Learning Paths" : "Show Learning Paths"}
          >
            {isPathsVisible ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        )}
      </div>

      <div className="sidebar-paths-container">
        {isCollapsed && (
          <div className="sidebar-path-dot-strip">
            {pathList.filter(Boolean).map(p => (
              <div
                key={p.key}
                className={`sidebar-path-dot-btn ${activePath === p.key ? "active" : ""}`}
                onClick={() => setActivePath(p.key)}
                data-label={`${p.label} (${p.progressPercent}%)`}
              >
                <span>{p.label.charAt(0)}</span>
              </div>
            ))}
          </div>
        )}

        {!isCollapsed && <div className="sidebar-path-pills">
          <div className="sidebar-section-header">
            <span className="sidebar-section-label">Study Paths</span>
          </div>
          <AnimatePresence>
            {isPathsVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                animate={{ height: 'auto', opacity: 1, overflow: 'visible' }}
                exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="sidebar-paths-list"
              >
                {pathList.filter(Boolean).map((p) => (
                  <div
                    id={`sidebar-path-${p.key}`}
                    key={p.key}
                    className={`path-pill-container ${activePath === p.key ? "active" : ""}`}
                  >
                    <button
                      className="path-pill"
                      onClick={() => {
                        setActivePath(p.key);
                        if (setActiveNode) setActiveNode(null);
                        if (setActiveModule) setActiveModule(null);
                        if (setActiveTopic) setActiveTopic(null);
                        if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                      }}
                    >
                      <div className="path-pill-main">
                        <span className="pill-label">{p.label}</span>
                        <span className="pill-percentage">{p.progressPercent}%</span>
                      </div>
                    </button>

                    {isEditMode && activePath === p.key && onEditPath && (
                      <button
                        onClick={() => onEditPath(paths[p.key])}
                        className="path-edit-btn"
                        title="Path Settings"
                      >
                        <Edit2 size={11} />
                      </button>
                    )}
                  </div>
                ))}

                {isEditMode && onAddPath && (
                  <button
                    className="path-pill-add"
                    onClick={onAddPath}
                  >
                    <Edit3 size={12} style={{ opacity: 0.6 }} />
                    <span>Create New Path</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>}
      </div>

      <div className="sidebar-footer">
        <div className="footer-super-button-container">
          <div className="footer-popout-menu">
            <div className="popout-section-label" style={{ fontSize: 9, fontWeight: 900, color: 'var(--text3)', padding: '8px 16px 4px', letterSpacing: 1 }}>SYSTEM_CONFIG</div>
            
            {isAdmin && (
              <div id="sidebar-admin-toggle" className="popout-item" style={{ cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Shield size={14} color={isAdminView ? "var(--neon)" : "var(--text3)"} />
                  <span>Admin View</span>
                </div>
                <div 
                  className={`admin-view-toggle ${isAdminView ? 'active' : ''}`}
                  onClick={() => {
                    const nextState = !isAdminView;
                    setIsAdminView(nextState);
                    localStorage.setItem('genai_isAdminView', nextState.toString());
                  }}
                  style={{
                    width: 32,
                    height: 18,
                    borderRadius: 20,
                    background: isAdminView ? 'var(--neon)' : 'rgba(255,255,255,0.1)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <motion.div 
                    animate={{ x: isAdminView ? 16 : 2 }}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: isAdminView ? '#000' : '#fff',
                      position: 'absolute',
                      top: 2,
                      left: 0
                    }}
                  />
                </div>
              </div>
            )}

            <button 
              id="sidebar-edit-mode"
              className={`popout-item ${isEditMode ? 'active edit' : ''}`}
              onClick={() => setIsEditMode(!isEditMode)}
              title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            >
              {isEditMode ? <Edit3 size={14} /> : <Eye size={14} />}
              <span>{isEditMode ? "Edit Mode" : "View Mode"}</span>
            </button>

            <button 
              id="sidebar-theme-toggle"
              className={`popout-item theme-toggle overlay-item ${theme === 'dark' ? 'dark' : 'light'}`}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              <span>{theme === 'dark' ? "Dark Mode" : "Light Mode"}</span>
            </button>

            <button
              id="sidebar-appearance-btn"
              className="popout-item overlay-item"
              onClick={() => setShowAppearance(true)}
            >
              <Palette size={14} />
              <span>Appearance</span>
            </button>



            <button 
              id="sidebar-reset-data"
              className={`popout-item reset overlay-item ${resetConfirm ? 'danger confirmed' : ''}`}
              onClick={handleResetClick}
            >
              <RotateCcw size={14} className={resetConfirm ? "spin-warning" : ""} />
              <span>{resetConfirm ? "Confirm Reset" : "Reset Data"}</span>
            </button>

            <div className="popout-divider" />
            <div className="popout-section-label" style={{ fontSize: 9, fontWeight: 900, color: 'var(--text3)', padding: '12px 16px 4px', letterSpacing: 1 }}>PERSONAL_AI_CREDENTIALS</div>
            <div style={{ padding: '0 12px 8px', color: 'var(--text3)', fontSize: 10, lineHeight: 1.45 }}>Required for Atlas. Your credentials are stored only for your signed-in account.</div>
            
            <div id="sidebar-gemini-key" style={{ padding: '4px 12px 12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <select
                  value={localProvider}
                  onChange={(e) => setLocalProvider(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: '8px 10px',
                    fontSize: 11,
                    color: 'var(--text)',
                    outline: 'none',
                    transition: 'all 0.2s',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="azure-openai">Azure OpenAI</option>
                </select>

                {localProvider === 'gemini' && (
                  <input 
                    type="password"
                    placeholder="Paste Gemini Key..."
                    value={localKey}
                    onChange={(e) => setLocalKey(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '8px 10px',
                      fontSize: 11,
                      color: 'var(--text)',
                      fontFamily: 'monospace',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--neon)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  />
                )}
                {localProvider === 'azure-openai' && (
                  <>
                    <input 
                      type="text"
                      placeholder="Azure OpenAI Endpoint"
                      value={localAzureEndpoint}
                      onChange={(e) => setLocalAzureEndpoint(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        padding: '8px 10px',
                        fontSize: 11,
                        color: 'var(--text)',
                        fontFamily: 'monospace',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--neon)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                    />
                    <input 
                      type="password"
                      placeholder="Azure OpenAI Key"
                      value={localAzureKey}
                      onChange={(e) => setLocalAzureKey(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        padding: '8px 10px',
                        fontSize: 11,
                        color: 'var(--text)',
                        fontFamily: 'monospace',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--neon)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                    />
                  </>
                )}

                <motion.button 
                  onClick={() => {
                    updateGeminiKey(localKey);
                    updateAiProvider(localProvider);
                    updateAzureEndpoint(localAzureEndpoint);
                    updateAzureKey(localAzureKey);
                  }}
                  whileHover={{ scale: 1.02, background: 'var(--neon)', color: '#000', boxShadow: '0 0 12px var(--neon)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: 'var(--neon)',
                    border: 'none',
                    borderRadius: 6,
                    width: '100%',
                    padding: '8px 0',
                    color: '#000',
                    fontSize: 10,
                    fontWeight: 950,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  SAVE CONFIG
                </motion.button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <p style={{ margin: 0, fontSize: 9, color: 'var(--text3)', opacity: 0.6 }}>Keys are stored locally.</p>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: 9, 
                    color: 'var(--neon)', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 4,
                    fontWeight: 700,
                    opacity: 0.8
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '1'}
                  onMouseLeave={(e) => e.target.style.opacity = '0.8'}
                >
                  GET KEY <ExternalLink size={10} />
                </a>
              </div>
            </div>

            <div className="popout-divider" />

            <button className="popout-item logout overlay-item" onClick={onSignOut}>
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>

          <button id="sidebar-settings-btn" className="super-control-btn">
            <div className={`control-orb ${isEditMode ? 'editing' : ''}`}>
              <Orbit size={18} />
            </div>
            {!isCollapsed && <span className="control-label">Settings</span>}
          </button>
        </div>
      </div>
    </aside>
    {showAppearance && (
      <AppearanceSettings onClose={() => setShowAppearance(false)} />
    )}
  </>
  );
}

const styles = `
  /* AWS system-design treatment for the Learn > Roadmaps navigation item */
  .sidebar-divider-wrapper {
    position: relative;
    height: 1px;
    margin: 4px 0;
  }
  .sidebar-paths-toggle {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--bg2);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text3);
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s;
  }
  .sidebar-paths-toggle:hover {
    background: var(--bg3);
    color: var(--neon);
    border-color: var(--neon);
    box-shadow: 0 0 10px var(--neon-dim);
  }
  .sidebar-paths-toggle svg {
    transition: transform 0.3s ease;
  }
  .sidebar-paths-visible .sidebar-paths-toggle svg {
    /* transform: rotate(180deg); */
  }
  .sidebar-group {
    margin-bottom: 12px;
  }
  .group-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border), transparent);
    margin: 8px 20px;
    opacity: 0.3;
  }
  .edit-pill {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text3);
    font-size: 9px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
  }
  .edit-pill.active {
    background: rgba(245, 158, 11, 0.1);
    border-color: #f59e0b;
    color: #f59e0b;
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.2);
  }
  .sidebar-path-dot-strip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 16px 0;
  }
  .sidebar-path-dot-btn {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 900;
    color: var(--text2);
    background: var(--white-3);
    border: 1px solid var(--white-8);
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
  }
  .sidebar-path-dot-btn:hover {
    transform: scale(1.1);
  }
  .sidebar-path-dot-btn.active {
    color: var(--text);
    background: var(--white-8);
    border-color: var(--white-15);
  }
  .sidebar-path-dot-btn[data-label]:hover::after {
    content: attr(data-label);
    position: absolute;
    left: calc(100% + 10px);
    background: var(--bg5);
    border: 1px solid var(--border2);
    color: #fff;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 10px;
    white-space: nowrap;
    z-index: 1000;
  }
  .spin-warning {
    animation: spin 3s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* ── Sidebar redesign ─────────────────────────────────────
     A quieter, editorial workspace rail: neutral surfaces, clear grouping,
     and one consistent interaction language across every sidebar section. */
  .sidebar {
    width: 268px;
    min-width: 268px;
    position: relative;
    isolation: isolate;
    background:
      radial-gradient(circle at 0% 0%, rgba(121,190,218,.09), transparent 34%),
      linear-gradient(180deg, rgba(17,21,29,.72), rgba(8,11,17,.78));
    backdrop-filter: blur(30px) saturate(150%);
    -webkit-backdrop-filter: blur(30px) saturate(150%);
    border-right: 1px solid rgba(255,255,255,.13);
    box-shadow: inset -1px 0 rgba(255,255,255,.035), 18px 0 50px rgba(0,0,0,.2);
  }

  .sidebar::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: .58;
    background-image:
      linear-gradient(rgba(118,181,210,.075) 1px, transparent 1px),
      linear-gradient(90deg, rgba(118,181,210,.075) 1px, transparent 1px),
      linear-gradient(116deg, transparent 0 38%, rgba(255,170,72,.15) 38.1%, transparent 38.35%),
      linear-gradient(64deg, transparent 0 72%, rgba(82,185,220,.12) 72.1%, transparent 72.35%);
    background-size: 24px 24px, 24px 24px, 100% 100%, 100% 100%;
    mask-image: linear-gradient(180deg, #000 0%, rgba(0,0,0,.72) 62%, transparent 100%);
  }

  .sidebar::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: .68;
    background:
      radial-gradient(circle at 18% 22%, rgba(255,172,76,.24) 0 1.5px, transparent 2.5px),
      radial-gradient(circle at 78% 38%, rgba(77,195,231,.22) 0 1.5px, transparent 2.5px),
      radial-gradient(circle at 34% 74%, rgba(92,153,255,.18) 0 1.5px, transparent 2.5px),
      radial-gradient(ellipse at 12% 20%, rgba(255,172,76,.1), transparent 30%),
      radial-gradient(ellipse at 85% 42%, rgba(77,195,231,.08), transparent 34%);
    filter: blur(.15px);
  }

  .sidebar > * {
    position: relative;
    z-index: 1;
  }

  .sidebar-collapsed {
    width: 72px;
    min-width: 72px;
  }

  .sidebar-logo.morphing-header {
    height: 78px;
    padding: 0 16px;
    overflow: visible;
    border-bottom: 1px solid rgba(255,255,255,.09);
    background: rgba(255,255,255,.025);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .sidebar-collapse-btn {
    top: 50%;
    right: 14px;
    width: 30px;
    height: 30px;
    padding: 0;
    border-radius: 50%;
    background: rgba(19,24,32,.82);
    border-color: rgba(255,255,255,.16);
    color: var(--text3);
    line-height: 0;
    box-shadow: 0 8px 22px rgba(0,0,0,.3), inset 0 1px rgba(255,255,255,.1);
    backdrop-filter: blur(18px) saturate(150%);
    -webkit-backdrop-filter: blur(18px) saturate(150%);
    transform: translateY(-50%);
  }

  .sidebar-collapse-btn:hover {
    background: rgba(35,43,54,.92);
    color: var(--text);
    border-color: rgba(255,255,255,.2);
    box-shadow: 0 8px 24px rgba(0,0,0,.35), inset 0 1px rgba(255,255,255,.14);
    transform: translateY(-50%) scale(1.05);
  }

  .sidebar-collapsed .sidebar-collapse-btn {
    right: -15px;
    background: rgba(25,31,40,.9);
    color: var(--text2);
    border-color: rgba(255,255,255,.18);
    box-shadow: 0 8px 24px rgba(0,0,0,.4), inset 0 1px rgba(255,255,255,.12);
    transform: translateY(-50%);
  }

  .sidebar-search-btn {
    min-height: 40px;
    margin: 8px 12px 10px !important;
    padding: 0 12px;
    gap: 10px;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 11px;
    background: rgba(255,255,255,.045);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    color: var(--text3);
    font-size: 12px;
    font-weight: 600;
  }

  .sidebar-search-btn:hover {
    margin-left: 12px;
    background: rgba(255,255,255,.065);
    border-color: rgba(255,255,255,.15);
    color: var(--text);
    transform: none;
  }

  .sidebar-search-btn .sidebar-item-icon {
    width: 22px;
    height: 22px;
    color: var(--text2);
  }

  .sidebar-search-btn > span:last-child {
    border-color: rgba(255,255,255,.1) !important;
    color: var(--text3);
    background: rgba(255,255,255,.03);
  }

  .sidebar-nav {
    padding: 2px 12px 14px;
  }

  .sidebar-section-header {
    padding: 14px 8px 6px;
  }

  .sidebar-section-label {
    color: var(--text3);
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.8px;
    opacity: .62;
  }

  .sidebar-group { margin-bottom: 4px; }

  .sidebar-section-toggle {
    color: var(--text3);
    border-radius: 8px;
  }

  .sidebar-section-toggle:hover {
    background: rgba(255,255,255,.03);
    color: var(--text2);
  }

  .sidebar-item {
    min-height: 38px;
    margin: 3px 0;
    padding: 5px 10px;
    gap: 10px;
    border: 1px solid transparent;
    border-radius: 10px;
    color: #9698a4;
    font-size: 12px;
    font-weight: 600;
  }

  .sidebar-item:hover {
    background: rgba(255,255,255,.045);
    border-color: rgba(255,255,255,.05);
    color: var(--text);
    transform: none;
  }

  .sidebar-item.active {
    background: rgba(255,255,255,.08);
    border-color: rgba(255,255,255,.1);
    color: var(--text);
    box-shadow: 0 8px 20px rgba(0,0,0,.16);
  }

  .sidebar-item.active::before { display: none; }

  .sidebar-item-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: rgba(255,255,255,.035);
    color: #777a87;
    transition: background .2s ease, color .2s ease;
  }

  .sidebar-item:hover .sidebar-item-icon,
  .sidebar-item.active .sidebar-item-icon {
    background: rgba(255,255,255,.08);
    color: var(--text);
  }

  .sidebar-section-info-btn {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--text3);
    opacity: 0;
    cursor: pointer;
    transition: opacity .2s ease, background .2s ease, color .2s ease;
  }

  .sidebar-item:hover .sidebar-section-info-btn,
  .sidebar-item.active .sidebar-section-info-btn { opacity: .7; }
  .sidebar-section-info-btn:hover { opacity: 1 !important; background: rgba(255,255,255,.08); color: var(--text); }

  .group-divider {
    height: 1px;
    margin: 7px 8px;
    background: rgba(255,255,255,.065);
    opacity: 1;
  }

  .sidebar-paths-visible .sidebar-nav-container { max-height: 54%; }
  .sidebar-paths-visible .sidebar-paths-container {
    max-height: 46%;
    border-top: 1px solid rgba(255,255,255,.075);
    background: rgba(4,8,13,.34);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .sidebar-divider-wrapper { margin: 0 14px; }
  .sidebar-divider { margin: 0; background: rgba(255,255,255,.08); opacity: 1; }

  .sidebar-paths-toggle {
    width: 24px;
    height: 24px;
    background: #15161b;
    border-color: rgba(255,255,255,.1);
    color: var(--text3);
  }

  .sidebar-paths-toggle:hover {
    background: #1d1e25;
    border-color: rgba(255,255,255,.2);
    color: var(--text);
    box-shadow: 0 5px 14px rgba(0,0,0,.25);
  }

  .sidebar-path-pills {
    padding: 10px 12px 14px;
    gap: 4px;
    border-top: 0;
  }

  .sidebar-path-pills > .sidebar-section-header { padding: 4px 8px 9px; }

  .path-pill-container {
    border: 1px solid transparent;
    border-radius: 10px;
    background: transparent;
    margin-bottom: 1px;
  }

  .path-pill-container:hover {
    background: rgba(255,255,255,.045);
    border-color: rgba(255,255,255,.06);
    transform: none;
  }

  .path-pill-container.active {
    background: rgba(255,255,255,.075);
    border-color: rgba(255,255,255,.1);
    box-shadow: none;
  }

  .path-pill { padding: 9px 10px; }
  .path-pill-main { gap: 8px; }
  .pill-label { font-size: 12px; font-weight: 600; color: #b2b3bc; }
  .path-pill-container.active .pill-label { color: var(--text); }
  .pill-percentage { padding: 0; background: transparent; color: #747782; font-size: 10px; }

  .path-edit-btn {
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    background: rgba(0,0,0,.28);
    border-color: rgba(255,255,255,.1);
  }
  .path-pill-container:hover .path-edit-btn { transform: translateY(-50%); }

  .path-pill-add {
    margin-top: 6px;
    padding: 10px;
    border-radius: 10px;
    border-color: rgba(255,255,255,.1);
    color: var(--text3);
  }
  .path-pill-add:hover { background: rgba(255,255,255,.04); border-color: rgba(255,255,255,.18); }

  .sidebar-path-dot-strip {
    gap: 8px;
    padding: 14px 0;
    border-top: 0;
  }

  .sidebar-path-dot-btn {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.08);
    color: var(--text3);
  }
  .sidebar-path-dot-btn:hover { background: rgba(255,255,255,.08); transform: none; }
  .sidebar-path-dot-btn.active { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.16); color: var(--text); }

  .sidebar-footer {
    padding: 12px;
    border-top: 1px solid rgba(255,255,255,.075);
    background: rgba(0,0,0,.12);
  }

  .super-control-btn {
    min-height: 42px;
    padding: 5px 8px;
    border-radius: 10px;
    background: rgba(255,255,255,.035);
    border-color: rgba(255,255,255,.08);
  }

  .super-control-btn:hover {
    background: rgba(255,255,255,.07);
    border-color: rgba(255,255,255,.14);
    transform: none;
    box-shadow: none;
  }

  .control-orb { width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,.06); color: var(--text3); }
  .super-control-btn:hover .control-orb { background: rgba(255,255,255,.1); color: var(--text); transform: none; }
  .control-label { color: var(--text2); font-size: 11px; letter-spacing: .2px; }

  .footer-popout-menu {
    background: rgba(19,24,31,.8);
    backdrop-filter: blur(30px) saturate(150%);
    -webkit-backdrop-filter: blur(30px) saturate(150%);
    border-color: rgba(255,255,255,.12);
    border-radius: 14px;
    box-shadow: 0 20px 50px rgba(0,0,0,.5);
  }

  .popout-item:hover { background: rgba(255,255,255,.065); transform: none; }

  .sidebar-collapsed .sidebar-nav { padding: 8px 7px; }
  .sidebar-collapsed .sidebar-item { min-height: 38px; padding: 5px 0; }
  .sidebar-collapsed .sidebar-item-icon { width: 34px; height: 34px; }
  .sidebar-collapsed .sidebar-search-btn { margin: 12px 10px !important; padding: 0; }
  .sidebar-collapsed .sidebar-logo { padding: 0; justify-content: center; }
  .sidebar-collapsed .sidebar-footer { padding: 10px 8px; }

  .sidebar-nav-container:hover::-webkit-scrollbar-thumb,
  .sidebar-paths-container:hover::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,.16);
  }

  .sidebar-nav-container::-webkit-scrollbar-thumb:hover,
  .sidebar-paths-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,.28);
    box-shadow: none;
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 280px;
      min-width: 280px;
      background: rgba(13,17,23,.86);
      backdrop-filter: blur(26px) saturate(145%);
      -webkit-backdrop-filter: blur(26px) saturate(145%);
      box-shadow: 20px 0 50px rgba(0,0,0,.45);
    }
    .sidebar-collapsed { width: 72px; min-width: 72px; }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
