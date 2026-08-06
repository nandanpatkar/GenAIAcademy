import React, { useState, useEffect, useCallback, useMemo, Component } from "react";
import { buildSearchIndex } from "./utils/buildSearchIndex";
import { ProjectsProvider } from "./contexts/ProjectsContext";
import {
  Box, BookOpen, Brain, Loader2, ChevronDown, ChevronUp,
  ExternalLink, X, CheckSquare, Library, Network, AlignLeft,
  Sparkles, Bookmark, Video, FileText, Link2, CheckCircle2,
  Menu, Map, Layout, User, Settings, PieChart, FlaskConical, PenTool, Lock, Orbit, Mic, BoxSelect,
  HelpCircle
} from "lucide-react";
import { PATHS } from "./data/roadmap";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { supabase } from "./config/supabaseClient";
import { MAIN_STEPS, SECTION_STEPS, SIDEBAR_OVERVIEW_STEPS } from "./data/walkthroughSteps";
import { AnimatePresence } from "framer-motion";
import useIsMobile from "./hooks/useIsMobile";
import "./styles/global.css";
import "./styles/mobile-foundation.css";

// Product surfaces are loaded only when the user opens them. This keeps Monaco,
// graphing libraries, editors, and simulators out of the landing-page download.
const Sidebar = React.lazy(() => import("./components/Sidebar"));
const SidebarModern = React.lazy(() => import("./components/SidebarModern"));
const GlobalSearchPalette = React.lazy(() => import("./components/GlobalSearchPalette"));
const RoadmapGraph = React.lazy(() => import("./components/RoadmapGraph"));
const Roadmap2 = React.lazy(() => import("./components/Roadmap2"));
const Roadmap2NodeView = React.lazy(() => import("./components/Roadmap2NodeView"));
const Roadmap3 = React.lazy(() => import("./pages/roadmap/Roadmap3"));
const RoadmapMobile = React.lazy(() => import("./pages/roadmap/RoadmapMobile"));
const ModulePanel = React.lazy(() => import("./components/ModulePanel"));
const ResourcePanel = React.lazy(() => import("./components/ResourcePanel"));
const DetailPanel = React.lazy(() => import("./components/DetailPanel"));
const TopicContentPanel = React.lazy(() => import("./components/TopicContentPanel"));
const EditorModal = React.lazy(() => import("./components/EditorModal"));
const CurriculumTreePanel = React.lazy(() => import("./components/CurriculumTreePanel"));
const PythonIDE = React.lazy(() => import("./components/PythonIDE"));
const ResourceManager = React.lazy(() => import("./components/ResourceManager"));
const ProgressTracker = React.lazy(() => import("./components/ProgressTracker"));
const SystemDesignPlayground = React.lazy(() => import("./pages/playground/SystemDesignPlayground"));
const SystemDesignSimulator = React.lazy(() => import("./pages/simulator/SystemDesignSimulator"));
const AWSSystemDesignSimulator = React.lazy(() => import("./pages/simulator/AWSSystemDesignSimulator"));
const DSAAnimator = React.lazy(() => import("./components/DSAAnimator"));
const LearnBugEmbed = React.lazy(() => import("./components/LearnBugEmbed"));
const SqlLab = React.lazy(() => import("./components/SqlLab"));
const ConcurrencyLab = React.lazy(() => import("./components/ConcurrencyLab"));
const LabsHub = React.lazy(() => import("./components/LabsHub"));
const AgentLibrary = React.lazy(() => import("./components/AgentLibrary"));
const AimlCompanion = React.lazy(() => import("./components/AimlCompanion"));
const LinksCompanion = React.lazy(() => import("./components/LinksCompanion"));
const GitHubHub = React.lazy(() => import("./components/GitHubHub"));
const BlogPage = React.lazy(() => import("./pages/blog/BlogPage"));
const AdminManagement = React.lazy(() => import("./components/AdminManagement"));
const InterviewerPage = React.lazy(() => import("./pages/interviewer/InterviewerPage"));
const GeminiInterviewerPage = React.lazy(() => import("./pages/gemini-interviewer/GeminiInterviewerPage"));
const EmotionalSupportPage = React.lazy(() => import("./pages/emotional-support/EmotionalSupportPage"));
const AlgoVisualizer = React.lazy(() => import("./components/AlgoVisualizer"));
const CodeVisualizer = React.lazy(() => import("./components/CodeVisualizer"));
const K8sGames = React.lazy(() => import("./components/K8sGames"));
const GitVisualizer = React.lazy(() => import("./components/GitVisualizer"));
const FlowDesign = React.lazy(() => import("./components/FlowDesign"));
const NotionRenderer = React.lazy(() => import("./components/notion/NotionRenderer"));
const NoSignups = React.lazy(() => import("./components/NoSignups"));
const FreeSystemDesign = React.lazy(() => import("./components/FreeSystemDesign"));
const ManualViewer = React.lazy(() => import("./components/ManualViewer"));
const ReferenceViewer = React.lazy(() => import("./components/ReferenceViewer"));
const AgentCoreViewer = React.lazy(() => import("./components/AgentCoreViewer"));
const LangChainDocs = React.lazy(() => import("./components/LangChainDocs"));
const InterviewPrep = React.lazy(() => import("./components/InterviewPrep"));
const QuizApp = React.lazy(() => import("./components/QuizApp"));
const LeetCodePage = React.lazy(() => import("./pages/LeetCodePage"));
const ProjectIDE = React.lazy(() => import("./components/Projects/ProjectIDE"));
const IntelligenceHub = React.lazy(() => import("./components/IntelligenceHub"));
const HomeDashboard = React.lazy(() => import("./components/HomeDashboard"));
const Home2Dashboard = React.lazy(() => import("./components/Home2Dashboard"));
const WorkplaceLab = React.lazy(() => import("./components/WorkplaceLab"));
const OnboardingChatbot = React.lazy(() => import("./components/OnboardingChatbot"));
const FullContextChatbot = React.lazy(() => import("./components/FullContextChatbot"));
const AuthInterface = React.lazy(() => import("./components/AuthInterface"));
const KnowledgeGalaxy = React.lazy(() => import("./components/KnowledgeGalaxy"));
const FocusPulse = React.lazy(() => import("./components/FocusPulse"));
const VideoModal = React.lazy(() => import("./components/VideoModal"));
const LandingWrapper = React.lazy(() => import("./pages/LandingWrapper"));
const KnowledgeGraph = React.lazy(() => import("./pages/KnowledgeGraph"));
const Community = React.lazy(() => import("./components/Community/Community"));
const AppWalkthrough = React.lazy(() => import("./components/AppWalkthrough"));
const FeatureHome = React.lazy(() => import("./components/FeatureHome"));
const GenAIPlayground2 = React.lazy(() => import("./pages/playground2/GenAIPlayground2"));

const LAB_IDS = new Set([
  "lab_enterprise_ai_agents",
  "lab_chunking_bench",
  "lab_token_cost",
  "lab_agent_anatomy",
  "lab_agent_bottlenecks",
]);
const DEFAULT_LAB_ID = "lab_enterprise_ai_agents";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 50, color: 'maroon', background: '#ffebee', flex: 1, zIndex: 9999 }}>
          <h1 style={{ fontSize: 24, marginBottom: 16 }}>ResourceManager Render Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13 }}>{this.state.error?.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 11, opacity: 0.7, marginTop: 12 }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const PATH_ICONS = {
  ds: ["🐍", "📊", "🔬", "🗄️", "🤖", "🧠", "💬", "🚀"],
  genai: ["🏗️", "✨", "⛓️", "🗃️", "🔍", "🎯", "📡", "☁️"],
  agentic: ["🤖", "🕸️", "👥", "🛠️", "🧠", "☁️", "⚡"],
  aicxm_aws: ["📱", "🐍", "🏗️", "☁️", "🗣️", "🤖", "✨", "🔍", "🕸️", "🔗", "⚡", "📊"],
  aicxm_azure: ["📱", "🐍", "🏗️", "☁️", "🗣️", "🤖", "✨", "🔍", "🕸️", "🚀", "🧩", "📊"],
  aicxm_databricks: ["📱", "🐍", "🏗️", "☁️", "🗣️", "🤖", "✨", "🔍", "🕸️", "🧱", "📊"],
};

const injectDefaultIcons = (paths) => {
  const updated = JSON.parse(JSON.stringify(paths));
  Object.keys(updated).forEach(k => {
    updated[k].nodes = updated[k].nodes.map((n, i) => ({
      ...n, icon: n.icon || PATH_ICONS[k]?.[i] || "◈"
    }));
  });
  return updated;
};

function MainApp() {
  const { user, isAdmin, isLocked, signOut, aiProvider, providerConfigs, sidebarConfig } = useAuth();
  // 'modern' (redesigned rail) is the default; admins can switch back to the
  // 'legacy' sidebar from the Admin Panel › Sidebar tab.
  const ActiveSidebar = (sidebarConfig?.variant === "legacy") ? Sidebar : SidebarModern;
  const { theme, toggleTheme } = useTheme();
  // isMobile now comes from the centralized useIsMobile hook (Phase 0 of
  // the mobile redesign) instead of an inline `width <= 768` check.
  const isMobile = useIsMobile();

  // Sync personal AI config (all providers) to the AI Service.
  useEffect(() => {
    import('./services/aiService').then(({ setProviderConfigs, setAiProvider }) => {
      setProviderConfigs(providerConfigs || {});
      setAiProvider(aiProvider);
    });
  }, [aiProvider, providerConfigs]);

  // theme & toggleTheme now come from ThemeContext (see above)
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [pathsData, setPathsData] = useState({});
  const [activePath, setActivePath] = useState("ds");
  const [activeNode, setActiveNode] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [nodeStates, setNodeStates] = useState({});
  const [focusNodeId, setFocusNodeId] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [lastCompletedNodeId, setLastCompletedNodeId] = useState(null);
  const [showLanding, setShowLanding] = useState(() => {
    // Only show landing if user hasn't seen it in this session and is not logged in
    return !localStorage.getItem("genai_landing_dismissed");
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showLeetCode, setShowLeetCode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingMode, setOnboardingMode] = useState("modal"); // "modal" (first login) | "panel" (sidebar reopen)
  const hasCheckedOnboarding = React.useRef(false);

  const handleVideoSelect = (video) => {
    if (video.pathKey) setActivePath(video.pathKey);
    if (video.nodeId) {
      const p = pathsData[video.pathKey] || activePathData;
      const node = p?.nodes?.find(n => n.id === video.nodeId);
      if (node) setActiveNode(node);
    }
    if (video.moduleId && activeNode) {
      const mod = activeNode.modules?.find(m => m.id === video.moduleId);
      if (mod) setActiveModule(mod);
    } else if (video.moduleId) {
      // If node wasn't active yet, find it
      const p = pathsData[video.pathKey] || activePathData;
      const foundNode = p?.nodes?.find(n => n.modules?.some(m => m.id === video.moduleId));
      if (foundNode) {
        setActiveNode(foundNode);
        const mod = foundNode.modules.find(m => m.id === video.moduleId);
        if (mod) setActiveModule(mod);
      }
    }
    setActiveVideo(video);
  };
  const handleCloseVideo = () => setActiveVideo(null);

  // Keep a ref to latest pathsData so the flush function always has current data
  const pathsDataRef = React.useRef(pathsData);
  React.useEffect(() => { pathsDataRef.current = pathsData; }, [pathsData]);

  const hasFetched = React.useRef(false);

  // Flush save to Supabase immediately, then sign out
  const handleSignOut = React.useCallback(async () => {
    setActiveTopic(null);
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentData = pathsDataRef.current;
    if (user && Object.keys(currentData).length > 0) {
      try {
        localStorage.setItem("genai_paths_v3", JSON.stringify(currentData));
        const { error } = await supabase
          .from('user_curriculum')
          .upsert({ id: user.id, paths_data: currentData, updated_at: new Date().toISOString() });
        if (error) throw error;
      } catch (e) {
        console.error("Flush save before sign-out failed:", e);
      }
    }
    hasFetched.current = false;
    setIsDataLoaded(false);
    signOut();
  }, [user, signOut]);

  useEffect(() => {
    if (!user) return;
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCurriculum = async () => {
      const { data, error } = await supabase
        .from('user_curriculum')
        .select('paths_data')
        .eq('id', user.id)
        .single();

      // Never treat an unavailable database as a brand-new account: that would
      // replace an existing curriculum with defaults on the next sync.
      if (error && error.code !== 'PGRST116') {
        console.error('Could not load curriculum from Supabase:', error);
        return;
      }

      if (data && data.paths_data && Object.keys(data.paths_data).length > 0) {
        const defaultPaths = injectDefaultIcons(PATHS);
        const mergedData = {};
        const allKeys = new Set([...Object.keys(defaultPaths), ...Object.keys(data.paths_data)]);

        for (const key of allKeys) {
          const defaultPath = defaultPaths[key];
          const savedPath = data.paths_data[key];
          if (!defaultPath) { mergedData[key] = savedPath; continue; }
          if (!savedPath) { mergedData[key] = defaultPath; continue; }

          const savedNodes = savedPath.nodes || [];
          const mergedNodes = (defaultPath.nodes || []).map(defaultNode => {
            const savedNode = savedNodes.find(n => n.id === defaultNode.id);
            if (!savedNode) return defaultNode;
            return {
              ...defaultNode,
              modules: (defaultNode.modules || []).map(defaultModule => {
                const savedModule = (savedNode.modules || []).find(m => m.id === defaultModule.id);
                if (!savedModule) return defaultModule;
                return {
                  ...defaultModule,
                  status: savedModule.status ?? defaultModule.status,
                  completionDate: savedModule.completionDate ?? null,
                  subtopics: (defaultModule.subtopics || []).map(defaultSub => {
                    const defaultTitle = typeof defaultSub === "object" ? defaultSub.title : defaultSub;
                    const savedSub = (savedModule.subtopics || []).find(s =>
                      (typeof s === "object" ? s.title : s) === defaultTitle
                    );
                    if (!savedSub || typeof savedSub !== "object") return defaultSub;
                    const base = typeof defaultSub === "object" ? defaultSub : { title: defaultSub, status: "pending" };
                    return { ...base, ...savedSub };
                  }),
                };
              }),
            };
          });
          const extraNodes = savedNodes.filter(sn => !(defaultPath.nodes || []).some(dn => dn.id === sn.id));
          mergedData[key] = { ...defaultPath, ...savedPath, nodes: [...mergedNodes, ...extraNodes] };
        }

        setPathsData(mergedData);
        const keys = Object.keys(mergedData).filter(k => !["workspace", "videoIntelligence", "saved_algos", "genai-roadmap-campusx", "onboarding", "appearance", "leetcode"].includes(k));
        if (keys.length > 0) setActivePath(keys[0]);

        // Existing user: only show the onboarding modal if they haven't completed it.
        if (!hasCheckedOnboarding.current) {
          hasCheckedOnboarding.current = true;
          if (!mergedData.onboarding?.completed) {
            setOnboardingMode("modal");
            setShowOnboarding(true);
          }
        }
      } else {
        // New user: Use default paths strictly, do NOT pull from localStorage
        const initialData = injectDefaultIcons(PATHS);
        setPathsData(initialData);
        const keys = Object.keys(initialData).filter(k => !["workspace", "videoIntelligence", "saved_algos", "genai-roadmap-campusx", "onboarding", "appearance", "leetcode"].includes(k));
        if (keys.length > 0) setActivePath(keys[0]);
        const { error: insertError } = await supabase
          .from('user_curriculum')
          .insert({ id: user.id, paths_data: initialData });
        if (insertError) {
          console.error('Could not create curriculum in Supabase:', insertError);
          return;
        }

        // Brand new user — always show the onboarding modal.
        if (!hasCheckedOnboarding.current) {
          hasCheckedOnboarding.current = true;
          setOnboardingMode("modal");
          setShowOnboarding(true);
        }
      }
      setIsDataLoaded(true);
    };
    fetchCurriculum();
  }, [user]);

  useEffect(() => {
    if (!user || !isDataLoaded) return;
    if (Object.keys(pathsData).length === 0) return;
    // Removed shared localStorage to prevent user leakage


    const timeoutId = setTimeout(async () => {
      // Ensure videoIntelligence structure exists in paths_data for legacy updates
      const dataToSync = {
        ...pathsData,
        videoIntelligence: pathsData.videoIntelligence || {}
      };
      try {
        const { error } = await supabase
          .from('user_curriculum')
          .upsert({
            id: user.id,
            paths_data: dataToSync,
            updated_at: new Date().toISOString()
          });
        if (error) throw error;
      } catch (e) {
        console.error("Supabase sync failed:", e);
      }
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [pathsData, user, isDataLoaded]);

  const handleUpdateVideoProgress = (videoId, currentTime) => {
    setPathsData(prev => ({
      ...prev,
      videoIntelligence: {
        ...(prev.videoIntelligence || {}),
        [videoId]: {
          ...(prev.videoIntelligence?.[videoId] || {}),
          progress: currentTime
        }
      }
    }));
  };

  const handleSaveVideoNote = (videoId, note) => {
    setPathsData(prev => {
      const vidData = prev.videoIntelligence?.[videoId] || {};
      const notes = vidData.notes || [];
      return {
        ...prev,
        videoIntelligence: {
          ...(prev.videoIntelligence || {}),
          [videoId]: {
            ...vidData,
            notes: [...notes, { ...note, id: Date.now().toString() }]
          }
        }
      };
    });
  };

  const handleDeleteVideoNote = (videoId, noteId) => {
    setPathsData(prev => {
      const vidData = prev.videoIntelligence?.[videoId] || {};
      const notes = (vidData.notes || []).filter(n => n.id !== noteId);
      return {
        ...prev,
        videoIntelligence: {
          ...(prev.videoIntelligence || {}),
          [videoId]: {
            ...vidData,
            notes
          }
        }
      };
    });
  };

  // Theme persistence is handled by ThemeContext — no duplicate effect needed here.

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPath, setEditingPath] = useState(false);
  const [editingNode, setEditingNode] = useState(false);
  const [editingModule, setEditingModule] = useState(false);
  const [editingTopic, setEditingTopic] = useState(false);
  const [editData, setEditData] = useState(null);
  const [insertionIndex, setInsertionIndex] = useState(-1);

  const savedViewsStr = typeof window !== 'undefined' ? localStorage.getItem("genai_active_views") : null;
  let savedViews = {};
  try { if (savedViewsStr) savedViews = JSON.parse(savedViewsStr); } catch (e) {}

  const [showCurriculumMap, setShowCurriculumMap] = useState(savedViews.showCurriculumMap ?? false);
  const [showRoadmap2, setShowRoadmap2] = useState(savedViews.showRoadmap2 ?? false);
  const [showRoadmap3, setShowRoadmap3] = useState(savedViews.showRoadmap3 ?? false);
  const [showIDE, setShowIDE] = useState(savedViews.showIDE ?? false);
  const [showResources, setShowResources] = useState(savedViews.showResources ?? false);
  const [showProgress, setShowProgress] = useState(savedViews.showProgress ?? false);
  const [showPlayground, setShowPlayground] = useState(savedViews.showPlayground ?? false);
  const [showGenAIPlayground2, setShowGenAIPlayground2] = useState(false);
  const [showDSAAnimator, setShowDSAAnimator] = useState(savedViews.showDSAAnimator ?? false);
  const [showLearnBug, setShowLearnBug] = useState(savedViews.showLearnBug ?? false);
  const [showSqlLab, setShowSqlLab] = useState(savedViews.showSqlLab ?? false);
  const [showConcurrencyLab, setShowConcurrencyLab] = useState(savedViews.showConcurrencyLab ?? false);
  const [showLabs, setShowLabs] = useState(savedViews.showLabs ?? false);
  const [activeLabId, setActiveLabId] = useState(() => {
    const savedLabId = typeof window !== "undefined" ? localStorage.getItem("genai_active_lab") : null;
    return LAB_IDS.has(savedLabId) ? savedLabId : DEFAULT_LAB_ID;
  });
  const [showAgentLibrary, setShowAgentLibrary] = useState(savedViews.showAgentLibrary ?? false);
  const [showAimlCompanion, setShowAimlCompanion] = useState(savedViews.showAimlCompanion ?? false);
  const [showLinks, setShowLinks] = useState(savedViews.showLinks ?? false);
  const [showBlog, setShowBlog] = useState(savedViews.showBlog ?? false);
  const [showAdminManagement, setShowAdminManagement] = useState(savedViews.showAdminManagement ?? false);
  const [showSimulator, setShowSimulator] = useState(savedViews.showSimulator ?? false);
  const [showAwsSimulator, setShowAwsSimulator] = useState(savedViews.showAwsSimulator ?? false);
  const [showGalaxy, setShowGalaxy] = useState(savedViews.showGalaxy ?? false);
  const [showAIInterviewer, setShowAIInterviewer] = useState(savedViews.showAIInterviewer ?? false);
  const [showGeminiInterviewer, setShowGeminiInterviewer] = useState(false);
  const [showEmotionalSupport, setShowEmotionalSupport] = useState(false);
  const [showAlgoStudio, setShowAlgoStudio] = useState(savedViews.showAlgoStudio ?? false);
  const [showAlgoVisualizer, setShowAlgoVisualizer] = useState(savedViews.showAlgoVisualizer ?? false);
  const [showK8sGames, setShowK8sGames] = useState(savedViews.showK8sGames ?? false);
  const [showGitVisualizer, setShowGitVisualizer] = useState(savedViews.showGitVisualizer ?? false);
  const [showFlowDesign, setShowFlowDesign] = useState(savedViews.showFlowDesign ?? false);
  const [showCommunity, setShowCommunity] = useState(savedViews.showCommunity ?? false);
  const [showNotion, setShowNotion] = useState(savedViews.showNotion ?? false);
  const [showNoSignups, setShowNoSignups] = useState(savedViews.showNoSignups ?? false);
  const [showFreeSystemDesign, setShowFreeSystemDesign] = useState(savedViews.showFreeSystemDesign ?? false);
  const [showManual, setShowManual] = useState(savedViews.showManual ?? false);
  const [activeManualPhase, setActiveManualPhase] = useState(null);
  const [showReference, setShowReference] = useState(savedViews.showReference ?? false);
  const [activeReferenceTopic, setActiveReferenceTopic] = useState(null);
  const [showAgentCore, setShowAgentCore] = useState(savedViews.showAgentCore ?? false);
  const [showLangChainDocs, setShowLangChainDocs] = useState(savedViews.showLangChainDocs ?? false);
  const [langChainProduct, setLangChainProduct] = useState(savedViews.langChainProduct ?? "langchain");
  const [showInterviewPrep, setShowInterviewPrep] = useState(savedViews.showInterviewPrep ?? false);
  const [interviewDeepLinkId, setInterviewDeepLinkId] = useState(null);
  const [showProjects, setShowProjects] = useState(savedViews.showProjects ?? false);
  const [activeToolHome, setActiveToolHome] = useState(null);
  const [sidebarBeforeGenAI2, setSidebarBeforeGenAI2] = useState(null);

  const openGenAIPlayground2 = useCallback(() => {
    setSidebarBeforeGenAI2(isSidebarCollapsed);
    closeAllPanels();
    setIsSidebarCollapsed(false);
    setShowGenAIPlayground2(true);
  }, [isSidebarCollapsed]);

  const closeGenAIPlayground2 = useCallback(() => {
    setShowGenAIPlayground2(false);
    if (sidebarBeforeGenAI2 !== null) setIsSidebarCollapsed(sidebarBeforeGenAI2);
    setSidebarBeforeGenAI2(null);
  }, [sidebarBeforeGenAI2]);

  const [showGitHubHub, setShowGitHubHub] = useState(savedViews.showGitHubHub ?? false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showModuleDetails, setShowModuleDetails] = useState(false);
  const [showIntelligenceHub, setShowIntelligenceHub] = useState(savedViews.showIntelligenceHub ?? true);
  const [showHome2, setShowHome2] = useState(false);
  const [showLegacyIntelligenceHub, setShowLegacyIntelligenceHub] = useState(false);
  const [showWorkplaceLab, setShowWorkplaceLab] = useState(savedViews.showWorkplaceLab ?? false);
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(savedViews.showKnowledgeGraph ?? false);
  const [hubConfig, setHubConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("genai_hub_config");
      return saved ? JSON.parse(saved) : { view: 'main', year: null, isAI: false };
    } catch(e) { return { view: 'main', year: null, isAI: false }; }
  });

  useEffect(() => {
    try {
      localStorage.setItem("genai_active_views", JSON.stringify({
        showCurriculumMap, showRoadmap2, showRoadmap3, showIDE, showResources, showProgress, showPlayground,
        showDSAAnimator, showLearnBug, showSqlLab, showConcurrencyLab, showLabs, showAgentLibrary, showAimlCompanion, showLinks, showBlog, showAdminManagement,
        showSimulator, showAwsSimulator, showGalaxy, showAIInterviewer, showAlgoStudio,
        showAlgoVisualizer, showK8sGames, showGitVisualizer, showFlowDesign,
        showCommunity, showNotion, showNoSignups, showFreeSystemDesign, showManual, showInterviewPrep,
        showProjects, showGitHubHub, showIntelligenceHub, showWorkplaceLab,
        showKnowledgeGraph, showReference, showAgentCore,
        showLangChainDocs, langChainProduct
      }));
    } catch (e) {
      console.warn("Failed to save genai_active_views to localStorage:", e);
    }
  }, [
    showCurriculumMap, showRoadmap2, showRoadmap3, showIDE, showResources, showProgress, showPlayground,
    showDSAAnimator, showLearnBug, showSqlLab, showConcurrencyLab, showLabs, showAgentLibrary, showAimlCompanion, showLinks, showBlog, showAdminManagement,
    showSimulator, showAwsSimulator, showGalaxy, showAIInterviewer, showAlgoStudio,
    showAlgoVisualizer, showK8sGames, showGitVisualizer, showFlowDesign,
    showCommunity, showNotion, showNoSignups, showFreeSystemDesign, showManual, showInterviewPrep,
    showProjects, showGitHubHub, showIntelligenceHub, showWorkplaceLab,
    showKnowledgeGraph, showReference, showAgentCore,
    showLangChainDocs, langChainProduct
  ]);

  useEffect(() => {
    try {
      localStorage.setItem("genai_hub_config", JSON.stringify(hubConfig));
    } catch (e) {
      console.warn("Failed to save genai_hub_config to localStorage:", e);
    }
  }, [hubConfig]);

  useEffect(() => {
    localStorage.setItem("genai_active_lab", activeLabId);
  }, [activeLabId]);

  // Walkthrough: auto-show for first-time users
  const [showWalkthrough, setShowWalkthrough] = useState(() => {
    return !localStorage.getItem('genai_walkthrough_done');
  });
  const [showSidebarWalkthrough, setShowSidebarWalkthrough] = useState(false);

  // Section walkthrough: per-section guided tours
  const [sectionWalkthroughId, setSectionWalkthroughId] = useState(null);

  const handleSectionWalkthrough = useCallback((sectionId) => {
    if (SECTION_STEPS[sectionId]) {
      setSectionWalkthroughId(sectionId);
    }
  }, []);

  const handleSectionWalkthroughComplete = useCallback(() => {
    if (sectionWalkthroughId) {
      localStorage.setItem(`genai_section_done_${sectionWalkthroughId}`, 'true');
    }
    setSectionWalkthroughId(null);
  }, [sectionWalkthroughId]);

  const handleHubNav = (config) => {
    closeAllPanels();
    setHubConfig(prev => ({ ...prev, ...config }));
    setShowIntelligenceHub(true);
  };

  const [playgroundInitialTab, setPlaygroundInitialTab] = useState("system");
  const [linksInitialTab, setLinksInitialTab] = useState("links");

  const handleHubStudyAction = (id, type) => {
    closeAllPanels();
    if (type === 'path') {
      setActivePath(id);
      setShowIntelligenceHub(false);
    } else {
      if (id === 'galaxy') { setShowGalaxy(true); setShowIntelligenceHub(false); }
      else if (id === 'knowledge_graph') { setShowKnowledgeGraph(true); setShowIntelligenceHub(false); }
      else if (id === 'resources') { setShowResources(true); setShowIntelligenceHub(false); }
      else if (id === 'algo_studio') {
        if (isAdmin) {
          setShowAlgoStudio(true);
          setShowIntelligenceHub(false);
        }
      }
      else if (id === 'algo_visualizer') { setShowAlgoVisualizer(true); setShowIntelligenceHub(false); }
      else if (id === 'k8s_games') { setShowK8sGames(true); setShowIntelligenceHub(false); }
      else if (id === 'git_visualizer') { setShowGitVisualizer(true); setShowIntelligenceHub(false); }
      else if (id === 'aiml_companion') { setShowAimlCompanion(true); setShowIntelligenceHub(false); }
      else if (id === 'links') { setShowLinks(true); setShowIntelligenceHub(false); }
      else if (id === 'community') { setShowCommunity(true); setShowIntelligenceHub(false); }
      else if (id === 'github') { setShowGitHubHub(true); setShowIntelligenceHub(false); }
      else if (id === 'blog') handleHubNav({ view: 'blog', year: null, isAI: false });
      else if (id === 'progress') { setShowProgress(true); setShowIntelligenceHub(false); }
      else if (id === 'tasks') { setShowWorkplaceLab(true); setShowIntelligenceHub(false); }
      else if (id === 'dsa_animator') { setShowDSAAnimator(true); setShowIntelligenceHub(false); }
      else if (id === 'ide') { setShowIDE(true); setShowIntelligenceHub(false); }
      else if (id === 'knowledge_tree' || id === 'curriculum_map') { setShowCurriculumMap(true); setShowIntelligenceHub(false); }
    }
  };

  const handleHubDesignAction = (action) => {
    closeAllPanels();
    if (action === 'playground') {
      setPlaygroundInitialTab("system");
      setShowPlayground(true);
    }
    else if (action === 'simulator') setShowSimulator(true);
    else if (action === 'architecture') {
      setPlaygroundInitialTab("arch");
      setShowPlayground(true);
    }
    setShowIntelligenceHub(false);
  };

  const handleHubInterview = () => {
    closeAllPanels();
    setShowAIInterviewer(true);
    setShowIntelligenceHub(false);
  };

  const handleKnowledgeGraphNavigate = (pathKey, nodeId, moduleId) => {
    setShowKnowledgeGraph(false);
    setActivePath(pathKey);
    const path = pathsData[pathKey];
    if (path) {
      const node = path.nodes?.find(n => n.id === nodeId);
      if (node) {
        setActiveNode(node);
        const mod = node.modules?.find(m => m.id === moduleId);
        if (mod) setActiveModule(mod);
      }
    }
  };

  const closeAllPanels = () => {
    setActiveToolHome(null);
    setShowCurriculumMap(false);
    setShowRoadmap2(false);
    setShowRoadmap3(false);
    setShowIDE(false);
    setShowResources(false);
    setShowProgress(false);
    setShowPlayground(false);
    setShowGenAIPlayground2(false);
    if (sidebarBeforeGenAI2 !== null) {
      setIsSidebarCollapsed(sidebarBeforeGenAI2);
      setSidebarBeforeGenAI2(null);
    }
    setShowDSAAnimator(false);
    setShowLearnBug(false);
    setShowSqlLab(false);
    setShowConcurrencyLab(false);
    setShowLabs(false);
    setShowAgentLibrary(false);
    setShowAimlCompanion(false);
    setShowLinks(false);
    setShowBlog(false);
    setShowAdminManagement(false);
    setShowAwsSimulator(false);
    setShowSimulator(false);
    setShowGalaxy(false);
    setShowAIInterviewer(false);
    setShowGeminiInterviewer(false);
    setShowEmotionalSupport(false);
    setShowAlgoStudio(false);
    setShowAlgoVisualizer(false);
    setShowK8sGames(false);
    setShowGitVisualizer(false);
    setShowFlowDesign(false);
    setShowGitHubHub(false);
    setIsMobileMenuOpen(false);
    // When closing everything, we usually return to roadmap, so we hide Hub unless specifically requested
    setShowIntelligenceHub(false);
    setShowHome2(false);
    setShowLegacyIntelligenceHub(false);
    setShowWorkplaceLab(false);
    setShowKnowledgeGraph(false);
    setShowCommunity(false);
    setShowNotion(false);
    setShowNoSignups(false);
    setShowFreeSystemDesign(false);
    setShowInterviewPrep(false);
    setShowProjects(false);
    setShowManual(false);
    setShowReference(false);
    setShowAgentCore(false);
    setShowLangChainDocs(false);
    setShowLeetCode(false);
    setShowOnboarding(false);
    setInterviewDeepLinkId(null);
  };

  const launchToolFromHome = (feature) => {
    closeAllPanels();
    const launchers = {
      interview: () => setShowInterviewPrep(true),
      quiz: () => setShowQuiz(true),
      algo: () => setShowAlgoVisualizer(true),
      playground: () => setShowPlayground(true),
      interviewer: () => setShowAIInterviewer(true),
      dsa: () => setShowDSAAnimator(true),
      notion: () => setShowNotion(true),
      kubernetes: () => setShowK8sGames(true),
      flow: () => setShowFlowDesign(true),
      projects: () => setShowProjects(true),
      notes: () => setShowWorkplaceLab(true),
      community: () => setShowCommunity(true),
      github: () => setShowGitHubHub(true),
      links: () => setShowLinks(true),
      blog: () => setShowBlog(true),
      reference: () => setShowReference(true),
      manual: () => setShowManual(true),
      system: () => setShowSimulator(true),
      coding: () => setShowIDE(true),
      resources: () => setShowResources(true),
      visualize: () => setShowLearnBug(true),
    };
    launchers[feature]?.();
  };

  const handleLeetCodeSubmission = async (submission) => {
    const nextPathsData = {
      ...pathsData,
      leetcode: {
        ...(pathsData.leetcode || {}),
        submissions: {
          ...(pathsData.leetcode?.submissions || {}),
          [submission.problemId]: { ...submission, updatedAt: new Date().toISOString() },
        },
      },
    };
    setPathsData(nextPathsData);
    if (user) {
      try {
        await supabase.from('user_curriculum').upsert({
          id: user.id,
          paths_data: nextPathsData,
          updated_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error('LeetCode submission save failed:', error);
      }
    }
  };

  // Used by OnboardingChatbot's recommendation chips to jump straight to a
  // section. Mirrors Sidebar.jsx's handleNavClick switch, but operates on
  // App.jsx's own state directly (the source of truth Sidebar's props point to).
  const navigateToSection = (sectionId) => {
    closeAllPanels();
    switch (sectionId) {
      case "overview": break; // closeAllPanels already returns to the dashboard
      case "home2": setShowHome2(true); break;
      case "galaxy": setShowGalaxy(true); break;
      case "knowledge_graph": setShowKnowledgeGraph(true); break;
      case "curriculum_map": setShowCurriculumMap(true); break;
      case "roadmap2": setShowRoadmap2(true); break;
      case "roadmap3": setShowRoadmap3(true); break;
      case "progress": setShowProgress(true); break;
      case "manual": setActiveToolHome("manual"); break;
      case "reference": setActiveToolHome("reference"); break;
      case "projects": setActiveToolHome("projects"); break;
      case "ide": setActiveToolHome("coding"); break;
      case "playground": setActiveToolHome("playground"); break;
      case "simulator": setActiveToolHome("system"); break;
      case "aws_simulator": setShowAwsSimulator(true); break;
      case "dsa_animator": setActiveToolHome("dsa"); break;
      case "algo_visualizer": setActiveToolHome("algo"); break;
      case "k8s_games": setActiveToolHome("kubernetes"); break;
      case "git_visualizer": setShowGitVisualizer(true); break;
      case "flow_design": setActiveToolHome("flow"); break;
      case "notion": setActiveToolHome("notion"); break;
      case "nosignups": setShowNoSignups(true); break;
      case "free_system_design": setShowFreeSystemDesign(true); break;
      case "blog": setActiveToolHome("blog"); break;
      case "links": setActiveToolHome("links"); break;
      case "github": setActiveToolHome("github"); break;
      case "tasks": setActiveToolHome("notes"); break;
      case "community": setActiveToolHome("community"); break;
      case "resources": setActiveToolHome("resources"); break;
      case "interviewer": setActiveToolHome("interviewer"); break;
      case "interview_prep": setActiveToolHome("interview"); break;
      case "quiz": setActiveToolHome("quiz"); break;
      case "leetcode": setShowLeetCode(true); break;
      case "agent_library": setShowAgentLibrary(true); break;
      case "sql_lab": setShowSqlLab(true); break;
      case "concurrency_lab": setShowConcurrencyLab(true); break;
      case "labs": setShowLabs(true); break;
      case "aiml_companion": setShowAimlCompanion(true); break;
      case "gemini_interviewer": setShowGeminiInterviewer(true); break;
      case "emotional_support": setShowEmotionalSupport(true); break;
      case "genai_playground2": openGenAIPlayground2(); break;
      default: break;
    }
  };

  // Persists the onboarding answers + recommendation into pathsData.onboarding
  // (a special key alongside roadmap paths, same pattern as videoIntelligence/
  // saved_algos). The existing 1500ms-debounced sync effect (below) picks this
  // up and upserts it to Supabase's user_curriculum table — no new table needed.
  const handleOnboardingComplete = (answers, recommendation) => {
    setPathsData(prev => ({
      ...prev,
      onboarding: {
        ...(prev.onboarding || {}),
        completed: true,
        assessmentVersion: recommendation?.version || 1,
        lastAnswers: answers,
        lastRecommendation: recommendation,
        completedAt: new Date().toISOString(),
        history: [
          ...(prev.onboarding?.history || []),
          {
            answers,
            recommendation,
            completedAt: new Date().toISOString(),
          },
        ].slice(-5),
      },
    }));
  };

  // Fires when the user closes the modal without finishing the assessment
  // (X button / Esc). Still marks onboarding as seen so the forced popup
  // only ever shows once per new user, not on every refresh/Home click.
  const handleOnboardingDismiss = () => {
    if (onboardingMode === "modal") {
      setPathsData(prev => ({
        ...prev,
        onboarding: {
          ...(prev.onboarding || {}),
          completed: true,
          dismissedAt: new Date().toISOString(),
        },
      }));
    }
    setShowOnboarding(false);
  };

  // ── Global Search (Cmd+K) ──────────────────────────────────────────────
  const searchItems = useMemo(
    () => buildSearchIndex({ pathsData }),
    [pathsData]
  );

  const handleSearchNavigate = useCallback((item) => {
    closeAllPanels();

    if (item.type === "section") {
      switch (item.action) {
        case "roadmap":        break; // default view — nothing else to open
        case "progress":       setShowProgress(true); break;
        case "playground":     setShowPlayground(true); break;
        case "algoStudio":     setShowAlgoStudio(true); break;
        case "workplaceLab":   setShowWorkplaceLab(true); break;
        case "interviewPrep":  setShowInterviewPrep(true); break;
        case "aiInterviewer":  setShowAIInterviewer(true); break;
        case "blog":           setShowBlog(true); break;
        case "community":      setShowCommunity(true); break;
        case "knowledgeGraph": setShowKnowledgeGraph(true); break;
        default: break;
      }
      return;
    }

    if (item.type === "module" || item.type === "subtopic") {
      setActivePath(item.pathKey);
      const node = pathsData[item.pathKey]?.nodes?.find(n => n.id === item.nodeId);
      const mod = node?.modules?.find(m => m.id === item.moduleId);
      setActiveNode(node || null);
      setActiveModule(mod || null);
      return;
    }

    if (item.type === "interview-lesson") {
      setShowInterviewPrep(true);
      setInterviewDeepLinkId(item.lessonId);
    }
  }, [pathsData]);

  const pathData = pathsData[activePath] || pathsData[Object.keys(pathsData).find(k => !["workspace", "videoIntelligence", "saved_algos", "genai-roadmap-campusx", "onboarding", "appearance", "leetcode"].includes(k))] || Object.values(pathsData)[0];

  const handleNodeClick = (node, pathId) => {
    if (pathId) setActivePath(pathId);
    setActiveNode(node);
    setActiveModule(null); // Don't auto-select on mobile to show list first
    setActiveTopic(null);
    setIsMobileMenuOpen(false);
    setShowModuleDetails(false);

    // Track Study History (Top 3 Recent Nodes)
    if (node) {
      setPathsData(prev => {
        const history = prev.workspace?.history || [];
        const currentPath = prev[pathId || activePath];
        const newEntry = {
          id: node.id,
          title: node.title,
          pathId: pathId || activePath,
          pathTitle: currentPath?.title || activePath,
          pathColor: currentPath?.color || "#00ff88"
        };

        // Remove duplicate and keep last 3
        const filteredHistory = history.filter(h => h.id !== node.id);
        const updatedHistory = [newEntry, ...filteredHistory].slice(0, 3);

        return {
          ...prev,
          workspace: {
            ...(prev.workspace || {}),
            history: updatedHistory
          }
        };
      });
    }
  };

  const handleTopicSelect = (topic) => {
    if (topic && topic.categorySlug && topic.guideSlug && topic.phaseSlug) {
      setActiveManualPhase({
        categorySlug: topic.categorySlug,
        guideSlug: topic.guideSlug,
        phaseSlug: topic.phaseSlug,
        filePath: topic.filePath,
        title: topic.title
      });
      setShowManual(true);
    } else {
      setActiveTopic(topic);
    }
  };

  const handleMarkState = (nodeId, state) => {
    setNodeStates((prev) => ({ ...prev, [`${activePath}_${nodeId}`]: state }));
    if (state === "done") {
      setLastCompletedNodeId(nodeId);
    }
  };

  const getNodeState = (nodeId) => nodeStates[`${activePath}_${nodeId}`] || "default";

  const completedCount = (pathData?.nodes || []).filter(n => getNodeState(n.id) === "done").length;

  const handleResetData = () => {
    if (window.confirm("Reset all pathways to original defaults?")) {
      setPathsData(injectDefaultIcons(PATHS));
      setActiveNode(null); setActiveModule(null); setEditingNode(false); setEditingModule(false); setNodeStates({});
    }
  };

  const handleSavePath = (newPathData) => {
    let targetKey = newPathData.id || `path-${Date.now()}`;
    const existing = pathsData[targetKey];
    const finalData = { ...existing, ...newPathData, id: targetKey, nodes: existing?.nodes || [] };
    setPathsData(prev => ({ ...prev, [targetKey]: finalData }));
    setActivePath(targetKey); setActiveNode(null); setActiveModule(null); setActiveTopic(null); setEditingPath(false);
  };

  const handleDeletePath = (pathId) => {
    if (Object.keys(pathsData).length <= 1) return alert("Cannot delete the last path.");
    if (window.confirm("Delete this Learning Path?")) {
      setPathsData(prev => { const copy = { ...prev }; delete copy[pathId]; return copy; });
      const remainingKeys = Object.keys(pathsData).filter(k => k !== pathId);
      if (remainingKeys.length > 0) setActivePath(remainingKeys[0]);
      setActiveNode(null); setActiveModule(null); setActiveTopic(null); setEditingPath(false);
    }
  };

  const handleSaveNode = (newNode) => {
    setPathsData(prev => {
      const parent = prev[activePath];
      const isExisting = parent.nodes.find(n => n.id === newNode.id);
      let updatedNodes;
      if (isExisting) {
        updatedNodes = parent.nodes.map(n => n.id === newNode.id ? { ...n, ...newNode } : n);
      } else {
        // Insertion logic
        updatedNodes = [...parent.nodes];
        if (insertionIndex >= 0 && insertionIndex <= updatedNodes.length) {
          updatedNodes.splice(insertionIndex, 0, newNode);
        } else {
          updatedNodes.push(newNode);
        }
      }
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
    setEditingNode(false);
    setInsertionIndex(-1);
  };

  const handleSaveTopic = (updatedTopic) => {
    if (!activeNode || !activeModule) return;
    setPathsData(prev => {
      const parent = prev[activePath];
      const updatedNodes = parent.nodes.map(n => {
        if (n.id !== activeNode.id) return n;
        const updatedModules = (n.modules || []).map(m => {
          if (m.id !== activeModule.id) return m;
          let found = false;
          const newSubtopics = (m.subtopics || []).map(s => {
            const sObj = typeof s === "object" ? s : { title: s, status: "pending" };
            const isMatch = (updatedTopic.id && sObj.id && sObj.id === updatedTopic.id) || (sObj.title === updatedTopic.title);
            if (isMatch) {
              found = true;
              return { ...sObj, ...updatedTopic, id: sObj.id || updatedTopic.id || `topic-${Date.now()}` };
            }
            return sObj.id ? sObj : { ...sObj, id: `topic-${sObj.title.replace(/\s+/g, '-').toLowerCase()}` };
          });

          if (!found) {
            const newTopicObj = { ...updatedTopic, id: updatedTopic.id || `topic-${Date.now()}`, status: updatedTopic.status || "pending" };
            if (insertionIndex >= 0 && insertionIndex <= newSubtopics.length) {
              newSubtopics.splice(insertionIndex, 0, newTopicObj);
            } else {
              newSubtopics.push(newTopicObj);
            }
          }
          return { ...m, subtopics: newSubtopics };
        });
        return { ...n, modules: updatedModules };
      });
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
    setInsertionIndex(-1);
    setEditingTopic(false);
  };

  const handleDeleteTopic = (moduleId, topicId) => {
    if (!activeNode) return;
    if (!window.confirm("Delete this topic?")) return;
    setPathsData(prev => {
      const parent = prev[activePath];
      const updatedNodes = parent.nodes.map(n => {
        if (n.id !== activeNode.id) return n;
        const updatedModules = (n.modules || []).map(m => {
          if (m.id !== moduleId) return m;
          const newSubtopics = (m.subtopics || []).filter(s => {
            const sid = typeof s === "object" ? s.id : s;
            return sid !== topicId;
          });
          return { ...m, subtopics: newSubtopics };
        });
        return { ...n, modules: updatedModules };
      });
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
  };

  const handleDeleteNode = (nodeId) => {
    if (window.confirm("Delete this node?")) {
      setPathsData(prev => {
        const parent = prev[activePath];
        const newNodes = parent.nodes.filter(n => n.id !== nodeId);
        return { ...prev, [activePath]: { ...parent, nodes: newNodes } };
      });
      if (activeNode?.id === nodeId) { setActiveNode(null); setActiveModule(null); }
      setEditingNode(false);
    }
  };

  const handleSaveModule = (newModule) => {
    if (!activeNode) return;
    setPathsData(prev => {
      const parent = prev[activePath];
      const updatedNodes = parent.nodes.map(n => {
        if (n.id === activeNode.id) {
          const isExisting = n.modules?.find(m => m.id === newModule.id);
          let updatedModules;
          if (isExisting) {
            updatedModules = n.modules.map(m => m.id === newModule.id ? { ...m, ...newModule } : m);
          } else {
            updatedModules = [...(n.modules || [])];
            if (insertionIndex >= 0 && insertionIndex <= updatedModules.length) {
              updatedModules.splice(insertionIndex, 0, newModule);
            } else {
              updatedModules.push(newModule);
            }
          }
          return { ...n, modules: updatedModules };
        }
        return n;
      });
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
    if (!activeModule || activeModule.id === newModule.id) setActiveModule(newModule);
    setEditingModule(false);
    setInsertionIndex(-1);
  };

  const handleSaveWorkspaceNote = useCallback((note) => {
    setPathsData(prev => {
      const workspace = prev.workspace || {};
      const notes = workspace.notes || [];
      return {
        ...prev,
        workspace: {
          ...workspace,
          notes: [note, ...notes]
        }
      };
    });
  }, []);

  const handleDeleteWorkspaceNote = useCallback((noteId) => {
    setPathsData(prev => {
      const workspace = prev.workspace || {};
      const notes = (workspace.notes || []).filter(n => n.id !== noteId);
      return {
        ...prev,
        workspace: {
          ...workspace,
          notes
        }
      };
    });
  }, []);

  const handleUpdateWorkspaceNote = useCallback((updatedNote) => {
    setPathsData(prev => {
      const workspace = prev.workspace || {};
      const notes = (workspace.notes || []).map(n => n.id === updatedNote.id ? { ...n, ...updatedNote } : n);
      return {
        ...prev,
        workspace: {
          ...workspace,
          notes
        }
      };
    });
  }, []);

  const handleUpdateWorkspaceMaps = useCallback((maps) => {
    setPathsData(prev => {
      const workspace = prev.workspace || {};
      return {
        ...prev,
        workspace: {
          ...workspace,
          maps
        }
      };
    });
  }, []);

  const handleSaveUserAlgo = (algo) => {
    setPathsData(prev => ({
      ...prev,
      saved_algos: prev.saved_algos ?
        (prev.saved_algos.some(a => a.id === algo.id) ?
          prev.saved_algos.map(a => a.id === algo.id ? { ...a, ...algo } : a) :
          [...prev.saved_algos, algo]) :
        [algo]
    }));
  };

  const handleDeleteModule = (moduleId) => {
    if (window.confirm("Delete this module?")) {
      setPathsData(prev => {
        const parent = prev[activePath];
        const updatedNodes = parent.nodes.map(n => {
          if (n.id === activeNode.id) return { ...n, modules: n.modules?.filter(m => m.id !== moduleId) || [] };
          return n;
        });
        return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
      });
      if (activeModule?.id === moduleId) setActiveModule(null);
      setEditingModule(false);
    }
  };

  const freshActiveNode = activeNode ? pathData?.nodes?.find(n => n.id === activeNode.id) : null;
  const freshActiveModule = activeModule && freshActiveNode ? freshActiveNode.modules?.find(m => m.id === activeModule.id) : null;

  const handleMarkModuleStatus = (moduleId, newStatus) => {
    if (!freshActiveNode) return;
    setPathsData(prev => {
      const parent = prev[activePath];
      const updatedNodes = parent.nodes.map(n => {
        if (n.id === freshActiveNode.id) {
          const updatedModules = (n.modules || []).map(m => m.id === moduleId ? { ...m, status: newStatus, completionDate: newStatus === 'complete' ? new Date().toISOString() : m.completionDate } : m);
          return { ...n, modules: updatedModules };
        }
        return n;
      });
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
    if (newStatus === "in_progress" && getNodeState(freshActiveNode.id) === "default") handleMarkState(freshActiveNode.id, "progress");
  };

  const handleToggleSubtopicStatus = (moduleId, subtopicTitle) => {
    if (!freshActiveNode) return;
    setPathsData(prev => {
      const parent = prev[activePath];
      const updatedNodes = parent.nodes.map(n => {
        if (n.id === freshActiveNode.id) {
          const updatedModules = (n.modules || []).map(m => {
            if (m.id === moduleId) {
              const newSubtopics = (m.subtopics || []).map(s => {
                const stitle = typeof s === "object" ? s.title : s;
                if (stitle === subtopicTitle) {
                  const newStatus = (typeof s === "object" && s.status === "complete") ? "pending" : "complete";
                  const baseObj = typeof s === "object" ? s : { title: s, id: `topic-${Math.random().toString(36).substr(2, 9)}` };
                  return { ...baseObj, status: newStatus, completionDate: newStatus === "complete" ? new Date().toISOString() : null };
                }
                return typeof s === "object" ? s : { title: s, status: "pending", id: `topic-${Math.random().toString(36).substr(2, 9)}` };
              });
              const allComplete = newSubtopics.every(s => s.status === "complete");
              return { ...m, subtopics: newSubtopics, status: allComplete ? "complete" : (m.status === "complete" ? "in_progress" : m.status) };
            }
            return m;
          });
          return { ...n, modules: updatedModules };
        }
        return n;
      });
      return { ...prev, [activePath]: { ...parent, nodes: updatedNodes } };
    });
  };

  if (!user && showLanding) return <LandingWrapper theme={theme} toggleTheme={toggleTheme} onEnter={() => {
    setShowLanding(false);
    localStorage.setItem("genai_landing_dismissed", "true");
  }} />;

  if (!user) return (
    <AuthInterface
      theme={theme}
      toggleTheme={toggleTheme}
      onBackToLanding={() => {
        setShowLanding(true);
        localStorage.removeItem("genai_landing_dismissed");
      }}
    />
  );


  if (isLocked) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)', gap: 24, padding: 40, textAlign: 'center' }}>
        <Lock size={40} color="#ef4444" />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Access Restricted</h1>
        <button className="rg-btn" onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <div className={`app ${isEditMode ? "edit-mode-active" : ""}${showOnboarding ? " onboarding-active" : ""}`}>
      <GlobalSearchPalette items={searchItems} onNavigate={handleSearchNavigate} />
      {showOnboarding && (
        <OnboardingChatbot
          mode={onboardingMode}
          onClose={handleOnboardingDismiss}
          onComplete={handleOnboardingComplete}
          navigateToSection={navigateToSection}
          setActivePath={setActivePath}
          setShowCurriculumMap={setShowCurriculumMap}
          setShowManual={setShowManual}
          setActiveManualPhase={setActiveManualPhase}
          setShowReference={setShowReference}
          setActiveReferenceTopic={setActiveReferenceTopic}
        />
      )}
      {isEditMode && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '2px',
          background: '#f59e0b', zIndex: 9999, boxShadow: '0 0 10px #f59e0b'
        }} />
      )}
      <MobileHeader
        user={user}
        onSignOut={handleSignOut}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="app-layout-root">
        <ActiveSidebar
          activePath={activePath} setActivePath={p => { setActivePath(p); closeAllPanels(); }}
          paths={pathsData} onReset={handleResetData} isEditMode={isEditMode} setIsEditMode={setIsEditMode}
          onAddPath={() => { setEditData(null); setEditingPath(true); }}
          onEditPath={p => { setEditData({ ...p, id: activePath }); setEditingPath(true); }}
          showCurriculumMap={showCurriculumMap} setShowCurriculumMap={setShowCurriculumMap}
          showRoadmap2={showRoadmap2} setShowRoadmap2={setShowRoadmap2}
          showRoadmap3={showRoadmap3} setShowRoadmap3={setShowRoadmap3}
          showIDE={showIDE} setShowIDE={setShowIDE}
          showResources={showResources} setShowResources={setShowResources}
          showProgress={showProgress} setShowProgress={setShowProgress}
          showPlayground={showPlayground} setShowPlayground={setShowPlayground}
          onOpenGenAIPlayground2={openGenAIPlayground2}
          showDSAAnimator={showDSAAnimator} setShowDSAAnimator={setShowDSAAnimator}
          showLearnBug={showLearnBug} setShowLearnBug={setShowLearnBug}
          showSqlLab={showSqlLab} setShowSqlLab={setShowSqlLab}
          showConcurrencyLab={showConcurrencyLab} setShowConcurrencyLab={setShowConcurrencyLab}
          showLabs={showLabs} setShowLabs={setShowLabs}
          activeLabId={activeLabId} setActiveLabId={setActiveLabId}
          showAgentLibrary={showAgentLibrary} setShowAgentLibrary={setShowAgentLibrary}
          showAimlCompanion={showAimlCompanion} setShowAimlCompanion={setShowAimlCompanion}
          showLinks={showLinks} setShowLinks={setShowLinks}
          showBlog={showBlog} setShowBlog={setShowBlog}
          showAdminManagement={showAdminManagement} setShowAdminManagement={setShowAdminManagement}
          showAwsSimulator={showAwsSimulator} setShowAwsSimulator={setShowAwsSimulator}
          showSimulator={showSimulator} setShowSimulator={setShowSimulator}
          showGalaxy={showGalaxy} setShowGalaxy={setShowGalaxy}
          showAIInterviewer={showAIInterviewer} setShowAIInterviewer={setShowAIInterviewer}
          showGeminiInterviewer={showGeminiInterviewer} setShowGeminiInterviewer={setShowGeminiInterviewer}
          showEmotionalSupport={showEmotionalSupport} setShowEmotionalSupport={setShowEmotionalSupport}
          showAlgoStudio={showAlgoStudio} setShowAlgoStudio={setShowAlgoStudio}
          showAlgoVisualizer={showAlgoVisualizer} setShowAlgoVisualizer={setShowAlgoVisualizer}
          showK8sGames={showK8sGames} setShowK8sGames={setShowK8sGames}
          showGitVisualizer={showGitVisualizer} setShowGitVisualizer={setShowGitVisualizer}
          showFlowDesign={showFlowDesign} setShowFlowDesign={setShowFlowDesign}
          showGitHubHub={showGitHubHub} setShowGitHubHub={setShowGitHubHub}
          showIntelligenceHub={showIntelligenceHub} setShowIntelligenceHub={setShowIntelligenceHub}
          showHome2={showHome2} setShowHome2={setShowHome2}
          showLegacyIntelligenceHub={showLegacyIntelligenceHub} setShowLegacyIntelligenceHub={setShowLegacyIntelligenceHub}
          showWorkplaceLab={showWorkplaceLab} setShowWorkplaceLab={setShowWorkplaceLab}
          showKnowledgeGraph={showKnowledgeGraph} setShowKnowledgeGraph={setShowKnowledgeGraph}
          showCommunity={showCommunity} setShowCommunity={setShowCommunity}
          showNotion={showNotion} setShowNotion={setShowNotion}
          showNoSignups={showNoSignups} setShowNoSignups={setShowNoSignups}
          showFreeSystemDesign={showFreeSystemDesign} setShowFreeSystemDesign={setShowFreeSystemDesign}
          showManual={showManual} setShowManual={setShowManual}
          activeManualPhase={activeManualPhase} setActiveManualPhase={setActiveManualPhase}
          showReference={showReference} setShowReference={setShowReference}
          activeReferenceTopic={activeReferenceTopic} setActiveReferenceTopic={setActiveReferenceTopic}
          showAgentCore={showAgentCore} setShowAgentCore={setShowAgentCore}
          showLangChainDocs={showLangChainDocs} setShowLangChainDocs={setShowLangChainDocs}
          langChainProduct={langChainProduct} setLangChainProduct={setLangChainProduct}
          showOnboarding={showOnboarding}
          setShowOnboarding={(v) => { if (v) setOnboardingMode("panel"); setShowOnboarding(v); }}
          showInterviewPrep={showInterviewPrep} setShowInterviewPrep={setShowInterviewPrep}
          activeToolHome={activeToolHome} onOpenToolHome={setActiveToolHome}
          showQuiz={showQuiz} setShowQuiz={setShowQuiz}
          showLeetCode={showLeetCode} setShowLeetCode={setShowLeetCode}
          showProjects={showProjects} setShowProjects={setShowProjects}
          setLinksInitialTab={setLinksInitialTab}
          onHubNav={handleHubNav}
          isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeNode={activeNode} setActiveNode={setActiveNode} setActiveModule={setActiveModule} setActiveTopic={setActiveTopic}
          onSignOut={handleSignOut}
          isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed}
          onSectionWalkthrough={handleSectionWalkthrough}
        />

        <main className="app-primary-content">
          {showAdminManagement && isAdmin ? (
            <AdminManagement
              onClose={() => setShowAdminManagement(false)}
              pathsData={pathsData}
              setPathsData={setPathsData}
            />
          ) :
            showBlog ? <BlogPage theme={theme} isEditMode={isEditMode} onClose={() => setShowBlog(false)} /> :
              showCommunity ? (
                <Community isSidebarCollapsed={isSidebarCollapsed} />
              ) :
                showKnowledgeGraph ? (
                  <KnowledgeGraph
                    pathsData={pathsData}
                    userId={user?.id}
                    onClose={() => setShowKnowledgeGraph(false)}
                    onNavigate={handleKnowledgeGraphNavigate}
                  />
                ) :
                  showGalaxy ? (
                    <KnowledgeGalaxy
                      nodes={pathsData}
                      activePath={activePath}
                      onNodeClick={handleNodeClick}
                      onModuleClick={(node, mod, pathId) => {
                        if (pathId) setActivePath(pathId);
                        setActiveNode(node);
                        setActiveModule(mod);
                        setActiveTopic(null);
                      }}
                      onSubtopicClick={(node, mod, topic, pathId) => {
                        if (pathId) setActivePath(pathId);
                        setActiveNode(node);
                        setActiveModule(mod);
                        setActiveTopic(topic);
                      }}
                      onClose={() => setShowGalaxy(false)}
                    />
                  ) :
                    activeToolHome ? <FeatureHome feature={activeToolHome} onLaunch={launchToolFromHome} onClose={() => setActiveToolHome(null)} /> :
                    showAwsSimulator ? <AWSSystemDesignSimulator onClose={() => setShowAwsSimulator(false)} isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} /> :
                      showSimulator ? <SystemDesignSimulator onClose={() => setShowSimulator(false)} /> :
                        showAIInterviewer ? <InterviewerPage onClose={() => setShowAIInterviewer(false)} /> :
                          showGeminiInterviewer ? <GeminiInterviewerPage onClose={() => setShowGeminiInterviewer(false)} /> :
                          showEmotionalSupport ? <EmotionalSupportPage onClose={() => setShowEmotionalSupport(false)} /> :
                          showDSAAnimator ? <DSAAnimator onClose={() => setShowDSAAnimator(false)} /> :
                            showLearnBug ? <LearnBugEmbed onClose={() => setShowLearnBug(false)} /> :
                            showSqlLab ? <SqlLab onClose={() => setShowSqlLab(false)} /> :
                            showConcurrencyLab ? <ConcurrencyLab onClose={() => setShowConcurrencyLab(false)} /> :
                            showLabs ? <LabsHub activeLabId={activeLabId} /> :
                            showAgentLibrary ? <AgentLibrary onClose={() => setShowAgentLibrary(false)} /> :
                            showAimlCompanion ? <AimlCompanion onClose={() => setShowAimlCompanion(false)} /> :
                              showGitHubHub ? <GitHubHub onClose={() => setShowGitHubHub(false)} /> :
                                showLinks ? <LinksCompanion isEditMode={isEditMode} initialTab={linksInitialTab} onClose={() => setShowLinks(false)} /> :
                                  showGenAIPlayground2 ? <React.Suspense fallback={<div style={{ display: "grid", placeItems: "center", width: "100%", height: "100%", background: "#f7f8ff", color: "#64748b", fontSize: 12 }}>Loading Gen AI Playground 2.0…</div>}><GenAIPlayground2 theme={theme} isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} onClose={closeGenAIPlayground2} /></React.Suspense> :
                                    showPlayground ? <SystemDesignPlayground key={playgroundInitialTab} initialTab={playgroundInitialTab} theme={theme} onClose={() => setShowPlayground(false)} /> :
                                    showProgress ? <ProgressTracker pathsData={pathsData} onClose={() => setShowProgress(false)} /> :
                                      showProjects ? (
                                        <ProjectsProvider>
                                          <ProjectIDE />
                                        </ProjectsProvider>
                                      ) :
                                      showIDE ? <PythonIDE onClose={() => setShowIDE(false)} /> :
                                        showAlgoStudio ? <AlgoVisualizer
                                          user={user}
                                          savedAlgos={pathsData.saved_algos || []}
                                          onSaveAlgo={handleSaveUserAlgo}
                                          onClose={() => setShowAlgoStudio(false)}
                                        /> :
                                          showAlgoVisualizer ? <CodeVisualizer
                                            savedAlgos={pathsData.saved_algos || []}
                                            onSaveAlgo={handleSaveUserAlgo}
                                            onClose={() => setShowAlgoVisualizer(false)}
                                          /> :
                                            showK8sGames ? <K8sGames onClose={() => setShowK8sGames(false)} /> :
                                              showGitVisualizer ? <GitVisualizer onClose={() => setShowGitVisualizer(false)} /> :
                                                showFlowDesign ? <FlowDesign onClose={() => setShowFlowDesign(false)} /> :
                                                showWorkplaceLab ? <WorkplaceLab
                                                  pathsData={pathsData}
                                                  history={pathsData.workspace?.history || []}
                                                  notes={pathsData.workspace?.notes || []}
                                                  maps={pathsData.workspace?.maps || []}
                                                  onSaveNote={handleSaveWorkspaceNote}
                                                  onUpdateNote={handleUpdateWorkspaceNote}
                                                  onDeleteNote={handleDeleteWorkspaceNote}
                                                  onUpdateMaps={handleUpdateWorkspaceMaps}
                                                  onJumpToNode={(nodeId, pathId) => {
                                                    const path = pathsData[pathId];
                                                    const node = path?.nodes?.find(n => n.id === nodeId);
                                                    if (node) handleNodeClick(node, pathId);
                                                    setShowWorkplaceLab(false);
                                                  }}
                                                  onClose={() => setShowWorkplaceLab(false)}
                                                /> :
                                                  showResources ? <ErrorBoundary><ResourceManager pathsData={pathsData} setPathsData={setPathsData} onClose={() => setShowResources(false)} isEditMode={isEditMode} onVideoSelect={handleVideoSelect} /></ErrorBoundary> :
                                                    showNotion ? <NotionRenderer onClose={() => setShowNotion(false)} theme={theme} /> :
                                                      showNoSignups ? <NoSignups onClose={() => setShowNoSignups(false)} /> :
                                                        showFreeSystemDesign ? <FreeSystemDesign onClose={() => setShowFreeSystemDesign(false)} /> :
                                                        showManual ? <ManualViewer activePhase={activeManualPhase} onSelectPhase={setActiveManualPhase} onClose={() => setShowManual(false)} /> :
                                                        showReference ? <ReferenceViewer activeTopic={activeReferenceTopic} onSelectTopic={setActiveReferenceTopic} onClose={() => setShowReference(false)} /> :
                                                        showAgentCore ? <ErrorBoundary><AgentCoreViewer onClose={() => setShowAgentCore(false)} /></ErrorBoundary> :
                                                        showLangChainDocs ? <ErrorBoundary><LangChainDocs product={langChainProduct} onClose={() => setShowLangChainDocs(false)} /></ErrorBoundary> :
                                                      showInterviewPrep ? <InterviewPrep onClose={() => { setInterviewDeepLinkId(null); setShowInterviewPrep(false); }} initialLessonId={interviewDeepLinkId} pathsData={pathsData} /> :
                                                      showLeetCode ? <LeetCodePage onClose={() => setShowLeetCode(false)} onSubmitLeetCode={handleLeetCodeSubmission} savedSubmissions={pathsData.leetcode?.submissions || {}} /> :
                                                      showQuiz ? <QuizApp /> :
                                                      showHome2 ? (
                                                        <Home2Dashboard
                                                          user={user}
                                                          pathsData={pathsData}
                                                          activePath={activePath}
                                                          setActivePath={setActivePath}
                                                          onContinue={(node, pathId) => { setShowHome2(false); handleNodeClick(node, pathId); }}
                                                          onOpenRoadmap={() => setShowHome2(false)}
                                                          onOpenProgress={() => { closeAllPanels(); setShowProgress(true); }}
                                                          onOpenDiscovery={(item) => {
                                                            closeAllPanels();
                                                            if (item.type === "interview") {
                                                              setInterviewDeepLinkId(item.lessonId || null);
                                                              setShowInterviewPrep(true);
                                                            }
                                                            if (item.type === "manual") {
                                                              if (item.phase) setActiveManualPhase(item.phase);
                                                              setShowManual(true);
                                                            }
                                                          }}
                                                          onOpenOnboarding={() => { setOnboardingMode("panel"); setShowOnboarding(true); }}
                                                          onNavigate={navigateToSection}
                                                        />
                                                      ) :
                                                      showLegacyIntelligenceHub ? (
                                                        <IntelligenceHub
                                                          paths={pathsData}
                                                          pathsData={pathsData}
                                                          activePath={activePath}
                                                          onStudyAction={handleHubStudyAction}
                                                          onDesignAction={handleHubDesignAction}
                                                          onInterview={handleHubInterview}
                                                          onShowAll={() => setShowLegacyIntelligenceHub(false)}
                                                          initialView={hubConfig.view}
                                                          initialYear={hubConfig.year}
                                                          initialAI={hubConfig.isAI}
                                                          onTour={() => setShowSidebarWalkthrough(true)}
                                                        />
                                                      ) : showIntelligenceHub ? (
                                                        <HomeDashboard
                                                          user={user}
                                                          pathsData={pathsData}
                                                          activePath={activePath}
                                                          setActivePath={setActivePath}
                                                          onContinue={(node, pathId) => { setShowIntelligenceHub(false); handleNodeClick(node, pathId); }}
                                                          onOpenShelfItem={(item) => {
                                                            if (item.type === "roadmap") return;
                                                            closeAllPanels();
                                                            if (item.type === "manual") setShowManual(true);
                                                            if (item.type === "reference") setShowReference(true);
                                                            if (item.type === "quiz") setShowQuiz(true);
                                                            if (item.type === "dsa") setShowDSAAnimator(true);
                                                          }}
                                                          onOpenRoadmap={() => setShowIntelligenceHub(false)}
                                                          onOpenProgress={() => { closeAllPanels(); setShowProgress(true); }}
                                                          onOpenPractice={() => { closeAllPanels(); setShowIDE(true); }}
                                                          onOpenPlayground={() => { closeAllPanels(); setShowPlayground(true); }}
                                                          onOpenAwsSystemDesign={() => { closeAllPanels(); setShowAwsSimulator(true); }}
                                                          onOpenDiscovery={(item) => {
                                                            closeAllPanels();
                                                            if (item.type === "interview") {
                                                              setInterviewDeepLinkId(item.lessonId || null);
                                                              setShowInterviewPrep(true);
                                                            }
                                                            if (item.type === "manual") {
                                                              if (item.phase) setActiveManualPhase(item.phase);
                                                              setShowManual(true);
                                                            }
                                                            if (item.type === "reference") setShowReference(true);
                                                          }}
                                                          onOpenOnboarding={() => { setOnboardingMode("panel"); setShowOnboarding(true); }}
                                                        />
                                                      ) :
                                                      showCurriculumMap ? <CurriculumTreePanel paths={pathsData} activePath={activePath} setActivePath={setActivePath} pathData={pathData} activeNode={activeNode} setActiveNode={setActiveNode} activeModule={activeModule} setActiveModule={setActiveModule} activeTopic={activeTopic} setActiveTopic={handleTopicSelect} onClose={() => setShowCurriculumMap(false)} /> :
                                                        <>
                                                          {!freshActiveNode && (
                                                            <>
                                                              {showRoadmap2 ? (
                                                                <Roadmap2
                                                                  path={pathData} activePath={activePath} setActivePath={setActivePath} pathsData={pathsData}
                                                                  onNodeClick={handleNodeClick} getNodeState={getNodeState}
                                                                  completedCount={completedCount}
                                                                />
                                                              ) : showRoadmap3 ? (
                                                                <Roadmap3
                                                                  path={pathData} activePath={activePath} setActivePath={setActivePath} pathsData={pathsData}
                                                                  onNodeClick={handleNodeClick} getNodeState={getNodeState}
                                                                  completedCount={completedCount}
                                                                />
                                                              ) : isMobile && !isEditMode ? (
                                                                <RoadmapMobile
                                                                  path={pathData} activePath={activePath} setActivePath={setActivePath} pathsData={pathsData}
                                                                  onNodeClick={handleNodeClick} getNodeState={getNodeState}
                                                                  completedCount={completedCount}
                                                                />
                                                              ) : (
                                                                <RoadmapGraph
                                                                  path={pathData} activePath={activePath} setActivePath={setActivePath} pathsData={pathsData}
                                                                  activeNode={freshActiveNode} onNodeClick={handleNodeClick} getNodeState={getNodeState}
                                                                  completedCount={completedCount} onMarkState={handleMarkState}
                                                                  onAddNode={(idx = -1) => { setEditData(null); setEditingNode(true); setInsertionIndex(idx); }}
                                                                  onEditNode={n => { setEditData(n); setEditingNode(true); }}
                                                                  onAddNodeAfter={(nodeId, idx) => { setEditData(null); setEditingNode(true); setInsertionIndex(idx); }}
                                                                  onDeleteNode={handleDeleteNode}
                                                                  isEditMode={isEditMode}
                                                                  lastCompletedNodeId={lastCompletedNodeId}
                                                                  onAnimationTriggered={() => setLastCompletedNodeId(null)}
                                                                />
                                                              )}
                                                            </>
                                                          )}
            {/* Roadmap 2.0 opens its own "Pit Stop" node view instead of the classic three-panel stack */}
            {freshActiveNode && !activeTopic && (showRoadmap2 || showRoadmap3) && (
                                                          <Roadmap2NodeView
                                                            node={freshActiveNode}
                                                            nodeIndex={pathData?.nodes?.findIndex(n => n.id === freshActiveNode.id)}
                                                            path={pathData}
                                                            nodeState={getNodeState(freshActiveNode.id)}
                                                            activeModule={freshActiveModule}
                                                            setActiveModule={setActiveModule}
                                                            onMarkNodeState={(state) => handleMarkState(freshActiveNode.id, state)}
                                                            onMarkModuleStatus={handleMarkModuleStatus}
                                                            onToggleSubtopicStatus={handleToggleSubtopicStatus}
                                                            onTopicSelect={handleTopicSelect}
                                                            onVideoSelect={handleVideoSelect}
                                                            onEnterFocusMode={() => setFocusNodeId(freshActiveNode.id)}
                                                            isEditMode={isEditMode}
                                                            onAddModule={(idx = -1) => { setEditData(null); setEditingModule(true); setInsertionIndex(idx); }}
                                                            onEditModule={m => { setEditData(m); setEditingModule(true); }}
                                                            onDeleteModule={handleDeleteModule}
                                                            onSaveModule={handleSaveModule}
                                                            onAddTopic={(idx = -1) => { setEditData(null); setEditingTopic(true); setInsertionIndex(idx); }}
                                                            onDeleteTopic={(topicId) => freshActiveModule && handleDeleteTopic(freshActiveModule.id, topicId)}
                                                            onBack={() => { setActiveNode(null); setActiveModule(null); setActiveTopic(null); }}
                                                          />
                                                        )}
            {freshActiveNode && !activeTopic && !showRoadmap2 && !showRoadmap3 && (!showModuleDetails || !isMobile) && (
                                                          <ModulePanel
                                                            node={freshActiveNode} activeModule={freshActiveModule}
                                                            setActiveModule={(mod) => {
                                                              setActiveModule(mod);
                                                              if (isMobile) setShowModuleDetails(true);
                                                            }}
                                                            pathColor={pathData.color} onClose={() => { setActiveNode(null); setActiveModule(null); setActiveTopic(null); }}
                                                            onBack={() => { setActiveNode(null); setActiveModule(null); setActiveTopic(null); }}
                                                            onAddModule={(idx = -1) => { setEditData(null); setEditingModule(true); setInsertionIndex(idx); }}
                                                            onEditModule={m => { setEditData(m); setEditingModule(true); }}
                                                            onDeleteModule={handleDeleteModule}
                                                            isEditMode={isEditMode} activePath={activePath}
                                                          />
                                                        )}
                                                        {freshActiveModule && freshActiveNode && !activeTopic && !showRoadmap2 && !showRoadmap3 && (showModuleDetails || !isMobile) && (
                                                          <DetailPanel
                                                            node={freshActiveNode} module={freshActiveModule} pathColor={pathData.color}
                                                            onMarkDone={() => { handleMarkState(freshActiveNode.id, "done"); setActiveNode(null); }}
                                                            onMarkProgress={() => handleMarkState(freshActiveNode.id, "progress")}
                                                            onMarkModuleStatus={status => handleMarkModuleStatus(freshActiveModule.id, status)}
                                                            onToggleSubtopicStatus={title => handleToggleSubtopicStatus(freshActiveModule.id, title)}
                                                            onAddTopic={(idx = -1) => { setEditData(null); setEditingTopic(true); setInsertionIndex(idx); }}
                                                            onDeleteTopic={(topicId) => handleDeleteTopic(freshActiveModule.id, topicId)}
                                                            nodeState={getNodeState(freshActiveNode.id)} onModuleSelect={setActiveModule} onTopicSelect={handleTopicSelect} isEditMode={isEditMode}
                                                            onBackToGalaxy={() => setShowGalaxy(true)}
                                                            onEnterFocusMode={() => setFocusNodeId(freshActiveNode.id)}
                                                            onVideoSelect={handleVideoSelect}
                                                            onClose={() => {
                                                              if (isMobile) setShowModuleDetails(false);
                                                              else setActiveModule(null);
                                                            }}
                                                          />
                                                        )}
                                                        {freshActiveModule && freshActiveNode && !activeTopic && !showRoadmap2 && !showRoadmap3 && !isMobile && (
                                                          <ResourcePanel
                                                            module={freshActiveModule}
                                                            pathColor={pathData.color}
                                                            onClose={() => setActiveModule(null)}
                                                            onEditModule={handleSaveModule}
                                                            isEditMode={isEditMode}
                                                            onVideoSelect={handleVideoSelect}
                                                          />
                                                        )}
                                                        {activeTopic && (
                                                          <TopicContentPanel
                                                            topic={activeTopic} module={freshActiveModule} pathColor={pathData.color}
                                                            activePath={activePath} onClose={() => setActiveTopic(null)} isEditMode={isEditMode} onSaveTopic={handleSaveTopic}
                                                            onVideoSelect={handleVideoSelect}
                                                          />
                                                        )}
                                                      </>
          }
        </main>
      </div>

      <MobileBottomNav
        activeView={showAdminManagement ? "admin" : showBlog ? "blog" : showPlayground ? "playground" : showProgress ? "progress" : "roadmap"}
        setView={v => {
          closeAllPanels();
          if (v === "admin") setShowAdminManagement(true);
          else if (v === "blog") setShowBlog(true);
          else if (v === "interviewer") setShowAIInterviewer(true);
          else if (v === "playground") setShowPlayground(true);
          else if (v === "progress") setShowProgress(true);
        }}
      />

      <FullContextChatbot
        user={user}
        pathsData={pathsData}
        activePath={activePath}
        activeNode={freshActiveNode}
        activeModule={freshActiveModule}
        activeTopic={activeTopic}
      />

      <AnimatePresence>
        {focusNodeId && freshActiveNode && freshActiveModule && (
          <FocusPulse
            node={freshActiveNode}
            module={freshActiveModule}
            onClose={() => setFocusNodeId(null)}
            onToggleSubtopicStatus={title => handleToggleSubtopicStatus(freshActiveModule.id, title)}
            onVideoSelect={handleVideoSelect}
            onOpenNotion={() => {
              setFocusNodeId(null);
              setShowNotion(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            video={activeVideo}
            onClose={handleCloseVideo}
            videoIntelligence={pathsData.videoIntelligence?.[activeVideo.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/)?.[1]] || {}}
            onUpdateProgress={(time) => handleUpdateVideoProgress(activeVideo.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/)?.[1], time)}
            onSaveNote={(note) => handleSaveVideoNote(activeVideo.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/)?.[1], note)}
            onDeleteNote={(noteId) => handleDeleteVideoNote(activeVideo.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/)?.[1], noteId)}
            moduleContext={freshActiveModule}
            pathsData={pathsData}
            onNavigate={(p, n, m) => {
              if (p) setActivePath(p);
              if (n) setActiveNode(n);
              if (m) {
                setActiveModule(m);
                setActiveTopic(null);
                setShowGalaxy(false);
              }
            }}
          />
        )}
      </AnimatePresence>



      {editingPath && <EditorModal type="path" data={editData} pathColor={editData?.color || "#3b82f6"} onClose={() => setEditingPath(false)} onSave={handleSavePath} onDelete={handleDeletePath} />}
      {editingNode && <EditorModal type="node" data={editData} pathColor={pathData.color} onClose={() => setEditingNode(false)} onSave={handleSaveNode} onDelete={handleDeleteNode} />}
      {editingModule && <EditorModal type="module" data={editData} pathColor={pathData.color} onClose={() => setEditingModule(false)} onSave={handleSaveModule} onDelete={handleDeleteModule} />}
      {editingTopic && <EditorModal type="topic" data={editData} pathColor={pathData.color} onClose={() => setEditingTopic(false)} onSave={handleSaveTopic} />}

      {/* Re-trigger Walkthrough Button (top-right, hidden until hover) — only on home/roadmap */}
      {!showWalkthrough && !sectionWalkthroughId &&
        !showCurriculumMap && !showIDE && !showResources && !showProgress &&
        !showPlayground && !showGenAIPlayground2 && !showDSAAnimator && !showLearnBug && !showSqlLab && !showConcurrencyLab && !showAgentLibrary && !showAimlCompanion && !showLinks &&
        !showBlog && !showAdminManagement && !showAwsSimulator && !showSimulator && !showGalaxy &&
        !showAIInterviewer && !showGeminiInterviewer && !showEmotionalSupport && !showAlgoStudio && !showAlgoVisualizer &&
        !showK8sGames && !showGitVisualizer && !showFlowDesign && !showGitHubHub &&
        !showIntelligenceHub && !showLegacyIntelligenceHub && !showWorkplaceLab && !showKnowledgeGraph &&
        !showCommunity && (
          null
        )}

      {/* Main Walkthrough Overlay */}
      <AnimatePresence>
        {showWalkthrough && (
          <AppWalkthrough
            steps={MAIN_STEPS}
            mode="main"
            onComplete={() => {
              localStorage.setItem('genai_walkthrough_done', 'true');
              setShowWalkthrough(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Section Walkthrough Overlay */}
      <AnimatePresence>
        {sectionWalkthroughId && SECTION_STEPS[sectionWalkthroughId] && (
          <AppWalkthrough
            steps={SECTION_STEPS[sectionWalkthroughId].steps}
            mode="section"
            sectionTitle={SECTION_STEPS[sectionWalkthroughId].title}
            sectionColor={SECTION_STEPS[sectionWalkthroughId].color}
            onComplete={handleSectionWalkthroughComplete}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Overview Walkthrough Overlay */}
      <AnimatePresence>
        {showSidebarWalkthrough && (
          <AppWalkthrough
            steps={SIDEBAR_OVERVIEW_STEPS}
            mode="floating"
            sectionTitle="SIDEBAR NAVIGATION"
            sectionColor="#00ff88"
            onComplete={() => setShowSidebarWalkthrough(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileHeader({ user, onSignOut, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="mobile-header mobile-only">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ background: "none", border: "none", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #00ff88, #0088ff)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(0,255,136,0.2)" }}>
            <Sparkles size={16} color="black" />
          </div>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 0.5 }}>GEN<span>AI</span> ACADEMY</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className={`theme-switch ${theme === "dark" ? "active" : ""}`} onClick={toggleTheme}>
          <div className="theme-switch-icon left"><Brain size={12} /></div>
          <div className="theme-switch-icon right"><Sparkles size={12} /></div>
          <div className="theme-switch-thumb"></div>
        </div>
        <div onClick={onSignOut} style={{ cursor: "pointer", opacity: 0.6 }}><User size={18} /></div>
      </div>
    </div>
  );
}

function MobileBottomNav({ activeView, setView }) {
  const items = [
    { id: "roadmap", icon: Map, label: "Roadmap" },
    { id: "progress", icon: PieChart, label: "Progress" },
    { id: "playground", icon: FlaskConical, label: "Lab" },
    { id: "blog", icon: PenTool, label: "Blog" },
    { id: "interviewer", icon: Mic, label: "Interview" },
    { id: "admin", icon: Settings, label: "Admin" },
  ];
  return (
    <div className="mobile-nav mobile-only">
      {items.map(item => (
        <div key={item.id} className={`mobile-nav-item ${activeView === item.id ? "active" : ""}`} onClick={() => setView(item.id)}>
          <div className="mobile-nav-icon"><item.icon size={20} /></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <React.Suspense
          fallback={<div style={{ minHeight: "100vh", background: "var(--bg, #0b1020)" }} />}
        >
          <MainApp />
        </React.Suspense>
      </ThemeProvider>
    </AuthProvider>
  );
}
