import React, { useState, useEffect, useCallback, useMemo, Component } from "react";
import { buildSearchIndex } from "./utils/buildSearchIndex";
import { ProjectsProvider } from "./contexts/ProjectsContext";
import {
  Box, BookOpen, Brain, Loader2, ChevronDown, ChevronUp,
  ExternalLink, CheckSquare, Library, Network, AlignLeft,
  Sparkles, Bookmark, Video, FileText, Link2, CheckCircle2,
  Map, Layout, User, PieChart, FlaskConical, Lock, Orbit, BoxSelect, House, MoreHorizontal,
  HelpCircle
} from "lucide-react";
// The default curriculum (`PATHS`) is ~600 KB — dsa_path + three aicxm paths +
// the Missing Manual — and was the single largest thing in the entry chunk, even
// though every use of it is inside an async function that runs after auth
// resolves. Loading it on demand takes it off the first-paint critical path.
// One shared promise so the three call sites don't fetch it three times.
let pathsModulePromise = null;
const loadDefaultPaths = () => {
  if (!pathsModulePromise) {
    pathsModulePromise = import("./data/roadmap").then((m) => m.PATHS);
  }
  return pathsModulePromise;
};
import { DATA_SCIENCE_LAB_IDS } from "./data/dataScienceLabCatalog";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { supabase } from "./config/supabaseClient";
import { loadCurriculumRow, resetCurriculumCache, primeCurriculumCache } from "./services/curriculumCache";
import { MAIN_STEPS, SECTION_STEPS, SIDEBAR_OVERVIEW_STEPS } from "./data/walkthroughSteps";
import { AnimatePresence } from "framer-motion";
import useIsMobile from "./hooks/useIsMobile";
import "./styles/global.css";
import "./styles/mobile-foundation.css";
import "./styles/mobile-destination-overrides.css";

// Product surfaces are loaded only when the user opens them. This keeps Monaco,
// graphing libraries, editors, and simulators out of the landing-page download.
const Sidebar = React.lazy(() => import("./components/Sidebar"));
const SidebarModern = React.lazy(() => import("./components/SidebarModern"));
const MobileNavigationSheet = React.lazy(() => import("./components/mobile/MobileNavigationSheet"));
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
const StrandsDocs = React.lazy(() => import("./components/StrandsDocs"));
const InterviewPrep = React.lazy(() => import("./components/InterviewPrep"));
const QuizApp = React.lazy(() => import("./components/QuizApp"));
const LeetCodePage = React.lazy(() => import("./pages/LeetCodePage"));
const AlgoWarArena = React.lazy(() => import("./components/AlgoWarArena"));
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
  ...DATA_SCIENCE_LAB_IDS,
  "lab_retrieval_tuning",
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
  "lab_retrieval_observatory",
  "lab_graphrag_atlas",
  "lab_plan_repair",
  "lab_durable_agent_ops",
  "lab_tokenization_microscope",
  "lab_entity_boundary",
  "lab_semantic_cartographer",
  "lab_intent_calibration",
  "lab_bias_variance",
  "lab_feature_foundry",
  "lab_cross_validation",
  "lab_regularization_path",
  "lab_tree_split",
  "lab_knn_neighborhood",
  "lab_imbalance_triage",
  "lab_drift_monitor",
  "lab_tensor_shape",
  "lab_backprop_debugger",
  "lab_activation_arena",
  "lab_optimizer_race",
  "lab_initialization_signal",
  "lab_attention_mechanism",
  "lab_autoencoder_latent",
  "lab_training_stability",
  "lab_convolution_lens",
  "lab_detection_iou",
  "lab_augmentation_lab",
  "lab_segmentation_pixel",
  "lab_vit_patch",
  "lab_distribution_explorer",
  "lab_bayes_rule",
  "lab_hypothesis_court",
  "lab_confidence_factory",
  "lab_sampling_bias",
  "lab_causation_lab",
  "lab_markov_chain",
  "lab_monte_carlo",
  "lab_pca_variance",
  "lab_clustering_workbench",
  "lab_svm_margin",
  "lab_ensemble_fusion",
  "lab_gradient_boosting",
  "lab_anomaly_detection",
  "lab_calibration_curve",
  "lab_feature_selection",
  "lab_hyperparameter_search",
  "lab_model_explainability",
  "lab_cnn_receptive_field",
  "lab_rnn_sequence",
  "lab_lstm_gates",
  "lab_normalization_dynamics",
  "lab_dropout_uncertainty",
  "lab_transfer_learning",
  "lab_quantization_tradeoff",
  "lab_network_pruning",
  "lab_distributed_training",
  "lab_adversarial_robustness",
  "lab_decoding_strategies",
  "lab_prompt_versioning",
  "lab_context_budget",
  "lab_structured_generation",
  "lab_hallucination_eval",
  "lab_synthetic_data",
  "lab_lora_adaptation",
  "lab_multimodal_alignment",
  "lab_diffusion_denoising",
  "lab_genai_guardrails",
  "lab_query_rewriting",
  "lab_metadata_filtering",
  "lab_reranker_lab",
  "lab_context_compression",
  "lab_citation_alignment",
  "lab_multihop_retrieval",
  "lab_freshness_versioning",
  "lab_rag_evaluation",
  "lab_semantic_cache",
  "lab_retrieval_acl",
  "lab_tool_schema_design",
  "lab_agent_planning",
  "lab_memory_policy",
  "lab_agent_handoff",
  "lab_agent_state_machine",
  "lab_approval_gates",
  "lab_agent_retries",
  "lab_agent_budget",
  "lab_agent_observability",
  "lab_agent_sandbox",
  "lab_container_resources",
  "lab_autoscaling",
  "lab_health_probes",
  "lab_canary_release",
  "lab_blue_green",
  "lab_slo_budget",
  "lab_observability_signals",
  "lab_incident_response",
  "lab_chaos_testing",
  "lab_feature_flags",
  "lab_ci_quality_gates",
  "lab_test_pyramid",
  "lab_contract_testing",
  "lab_rate_limiting",
  "lab_cache_architecture",
  "lab_queue_backpressure",
  "lab_database_migration",
  "lab_supply_chain",
  "lab_distributed_tracing",
  "lab_cost_performance",
]);
const DEFAULT_LAB_ID = null;

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
  // Explicit playback queue for videos opened from a broader scope (e.g. a
  // path/node/custom-folder in the Resources panel) where there's no single
  // active module for VideoModal to derive an auto-advance playlist from.
  const [activeVideoQueue, setActiveVideoQueue] = useState(null);
  const [lastCompletedNodeId, setLastCompletedNodeId] = useState(null);
  const [showLanding, setShowLanding] = useState(() => {
    // Only show landing if user hasn't seen it in this session and is not logged in
    return !localStorage.getItem("genai_landing_dismissed");
  });
  // The command palette is mounted only while open, so the Cmd+K binding lives
  // here in the always-mounted shell rather than inside the palette itself.
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showLeetCode, setShowLeetCode] = useState(false);
  const [showAlgoWar, setShowAlgoWar] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingMode, setOnboardingMode] = useState("modal"); // "modal" (first login) | "panel" (sidebar reopen)
  const hasCheckedOnboarding = React.useRef(false);

  const handleVideoSelect = (video, queue) => {
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
    // A video without a moduleId (browsed at path/node/custom-folder scope)
    // has no single module for VideoModal to derive a playlist from, so an
    // explicit queue keeps "up next"/auto-advance working there too.
    setActiveVideoQueue(!video.moduleId && queue?.length ? queue : null);
    setActiveVideo(video);
  };
  const handleCloseVideo = () => { setActiveVideo(null); setActiveVideoQueue(null); };

  // Keep a ref to latest pathsData so the flush function always has current data
  const pathsDataRef = React.useRef(pathsData);
  React.useEffect(() => { pathsDataRef.current = pathsData; }, [pathsData]);

  // Which user id the curriculum has been fetched for. Keyed by id rather than a
  // plain boolean: the session now hydrates optimistically from localStorage, so
  // the identity can be corrected once getSession() confirms it, and the fetch
  // must re-run for the real user rather than stay latched on the optimistic one.
  const fetchedForUserId = React.useRef(null);

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
    fetchedForUserId.current = null;
    // Otherwise the next user to sign in on this browser inherits this user's
    // cached curriculum promise.
    resetCurriculumCache();
    setIsDataLoaded(false);
    signOut();
  }, [user, signOut]);

  useEffect(() => {
    if (!user?.id) return;
    if (fetchedForUserId.current === user.id) return;
    fetchedForUserId.current = user.id;

    const fetchCurriculum = async () => {
      // Shared with ThemeContext — this row used to be fetched twice per load,
      // transferring the whole paths_data blob each time. See services/curriculumCache.
      const { paths_data, error } = await loadCurriculumRow(user.id);

      // Never treat an unavailable database as a brand-new account: that would
      // replace an existing curriculum with defaults on the next sync.
      if (error) {
        // Allow a retry on the next render rather than latching this user as done.
        fetchedForUserId.current = null;
        return;
      }

      if (paths_data && Object.keys(paths_data).length > 0) {
        const defaultPaths = injectDefaultIcons(await loadDefaultPaths());
        const mergedData = {};
        const allKeys = new Set([...Object.keys(defaultPaths), ...Object.keys(paths_data)]);

        for (const key of allKeys) {
          const defaultPath = defaultPaths[key];
          const savedPath = paths_data[key];
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
        const initialData = injectDefaultIcons(await loadDefaultPaths());
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
        // Keep the shared cache in step so anything reading it later this session
        // sees what was just written, not what was loaded at startup.
        primeCurriculumCache(user.id, { paths_data: dataToSync });
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

  const [showCurriculumMap, setShowCurriculumMap] = useViewState(savedViews.showCurriculumMap ?? false);
  const [showRoadmap2, setShowRoadmap2] = useViewState(savedViews.showRoadmap2 ?? false);
  const [showRoadmap3, setShowRoadmap3] = useViewState(savedViews.showRoadmap3 ?? false);
  const [showIDE, setShowIDE] = useViewState(savedViews.showIDE ?? false);
  const [showResources, setShowResources] = useViewState(savedViews.showResources ?? false);
  const [showProgress, setShowProgress] = useViewState(savedViews.showProgress ?? false);
  const [showPlayground, setShowPlayground] = useViewState(savedViews.showPlayground ?? false);
  const [showGenAIPlayground2, setShowGenAIPlayground2] = useViewState(false);
  const [showDSAAnimator, setShowDSAAnimator] = useViewState(savedViews.showDSAAnimator ?? false);
  const [showLearnBug, setShowLearnBug] = useViewState(savedViews.showLearnBug ?? false);
  const [showSqlLab, setShowSqlLab] = useViewState(savedViews.showSqlLab ?? false);
  const [showConcurrencyLab, setShowConcurrencyLab] = useViewState(savedViews.showConcurrencyLab ?? false);
  const [showLabs, setShowLabs] = useViewState(savedViews.showLabs ?? false);
  const [activeLabId, setActiveLabId] = useState(() => {
    const savedLabId = typeof window !== "undefined" ? localStorage.getItem("genai_active_lab") : null;
    return LAB_IDS.has(savedLabId) ? savedLabId : DEFAULT_LAB_ID;
  });
  const [showAgentLibrary, setShowAgentLibrary] = useViewState(savedViews.showAgentLibrary ?? false);
  const [showAimlCompanion, setShowAimlCompanion] = useViewState(savedViews.showAimlCompanion ?? false);
  const [showLinks, setShowLinks] = useViewState(savedViews.showLinks ?? false);
  const [showBlog, setShowBlog] = useViewState(savedViews.showBlog ?? false);
  // Year the blog archive should open on, set by the sidebar year sub-items.
  const [blogYear, setBlogYear] = useState(null);
  // Slug of an archive article to open directly, set by surfaces that
  // link to a specific piece (Intelligence Hub, home screen).
  const [blogSlug, setBlogSlug] = useState(null);
  // Category chip to pre-select, set when a topic node in the galaxy is opened.
  const [blogTag, setBlogTag] = useState(null);
  const [showAdminManagement, setShowAdminManagement] = useViewState(savedViews.showAdminManagement ?? false);
  const [showSimulator, setShowSimulator] = useViewState(savedViews.showSimulator ?? false);
  const [showAwsSimulator, setShowAwsSimulator] = useViewState(savedViews.showAwsSimulator ?? false);
  const [showGalaxy, setShowGalaxy] = useViewState(savedViews.showGalaxy ?? false);
  const [showAIInterviewer, setShowAIInterviewer] = useViewState(savedViews.showAIInterviewer ?? false);
  const [showGeminiInterviewer, setShowGeminiInterviewer] = useViewState(false);
  const [showEmotionalSupport, setShowEmotionalSupport] = useViewState(false);
  const [showAlgoStudio, setShowAlgoStudio] = useViewState(savedViews.showAlgoStudio ?? false);
  const [showAlgoVisualizer, setShowAlgoVisualizer] = useViewState(savedViews.showAlgoVisualizer ?? false);
  const [showK8sGames, setShowK8sGames] = useViewState(savedViews.showK8sGames ?? false);
  const [showGitVisualizer, setShowGitVisualizer] = useViewState(savedViews.showGitVisualizer ?? false);
  const [showFlowDesign, setShowFlowDesign] = useViewState(savedViews.showFlowDesign ?? false);
  const [showCommunity, setShowCommunity] = useViewState(savedViews.showCommunity ?? false);
  const [showNotion, setShowNotion] = useViewState(savedViews.showNotion ?? false);
  const [showNoSignups, setShowNoSignups] = useViewState(savedViews.showNoSignups ?? false);
  const [showFreeSystemDesign, setShowFreeSystemDesign] = useViewState(savedViews.showFreeSystemDesign ?? false);
  const [showManual, setShowManual] = useViewState(savedViews.showManual ?? false);
  const [activeManualPhase, setActiveManualPhase] = useState(null);
  const [showReference, setShowReference] = useViewState(savedViews.showReference ?? false);
  const [activeReferenceTopic, setActiveReferenceTopic] = useState(null);
  const [showAgentCore, setShowAgentCore] = useViewState(savedViews.showAgentCore ?? false);
  const [agentCoreMode, setAgentCoreMode] = useState("docs");
  const [showLangChainDocs, setShowLangChainDocs] = useViewState(savedViews.showLangChainDocs ?? false);
  const [langChainProduct, setLangChainProduct] = useState(savedViews.langChainProduct ?? "langchain");
  const [showStrandsDocs, setShowStrandsDocs] = useViewState(savedViews.showStrandsDocs ?? false);
  const [showInterviewPrep, setShowInterviewPrep] = useViewState(savedViews.showInterviewPrep ?? false);
  const [interviewDeepLinkId, setInterviewDeepLinkId] = useState(null);
  const [showProjects, setShowProjects] = useViewState(savedViews.showProjects ?? false);
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

  const [showGitHubHub, setShowGitHubHub] = useViewState(savedViews.showGitHubHub ?? false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Plain useState on purpose: this is a mobile panel toggle, not a lazy view.
  // A transition would make the tap feel unresponsive for no benefit.
  const [showModuleDetails, setShowModuleDetails] = useState(false);
  const [showIntelligenceHub, setShowIntelligenceHub] = useViewState(savedViews.showIntelligenceHub ?? true);
  // Home 2.0 is the phone-first dashboard. Keep the existing Intelligence Hub
  // as the desktop default, but enter Home 2.0 whenever the app starts or is
  // resized into the mobile breakpoint.
  const [showHome2, setShowHome2] = useViewState(isMobile);
  const [showLegacyIntelligenceHub, setShowLegacyIntelligenceHub] = useViewState(false);
  const [showWorkplaceLab, setShowWorkplaceLab] = useViewState(savedViews.showWorkplaceLab ?? false);
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useViewState(savedViews.showKnowledgeGraph ?? false);
  const [hubConfig, setHubConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("genai_hub_config");
      return saved ? JSON.parse(saved) : { view: 'main', year: null, isAI: false };
    } catch(e) { return { view: 'main', year: null, isAI: false }; }
  });

  useEffect(() => {
    if (isMobile && !showHome2 && showIntelligenceHub) {
      setShowIntelligenceHub(false);
      setShowHome2(true);
    }
  }, [isMobile]);

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
        showLangChainDocs, langChainProduct, showStrandsDocs
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
    showLangChainDocs, langChainProduct, showStrandsDocs
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

  // useCallback because this is passed into the memoized sidebar (directly and via
  // handleSidebarPathChange). Every setter it calls is referentially stable — the
  // plain useState setters by definition, and the useViewState ones by construction
  // — so `sidebarBeforeGenAI2` is the only real dependency.
  const closeAllPanels = useCallback(() => {
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
    setShowStrandsDocs(false);
    setShowLeetCode(false);
    setShowAlgoWar(false);
    setShowOnboarding(false);
    setInterviewDeepLinkId(null);
  }, [sidebarBeforeGenAI2]);

  // Stable identities for the four handlers the sidebar receives as inline arrows.
  // React.memo on the sidebar is a no-op while props are recreated every render,
  // so these have to be memoized together with it.
  const handleSidebarPathChange = useCallback((p) => {
    setActivePath(p);
    closeAllPanels();
  }, [closeAllPanels]);

  const handleAddPath = useCallback(() => {
    setEditData(null);
    setEditingPath(true);
  }, []);

  const handleEditPath = useCallback((p) => {
    setEditData({ ...p, id: activePath });
    setEditingPath(true);
  }, [activePath]);

  const handleSidebarOnboarding = useCallback((v) => {
    if (v) setOnboardingMode("panel");
    setShowOnboarding(v);
  }, []);

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
      case "labs": setActiveLabId(null); setShowLabs(true); break;
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

  const handleResetData = async () => {
    if (window.confirm("Reset all pathways to original defaults?")) {
      setPathsData(injectDefaultIcons(await loadDefaultPaths()));
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

  // Landing and auth get their own boundaries so that moving between them (and
  // into the app) doesn't unwind to the root fallback and blank the window.
  if (!user && showLanding) return (
    <React.Suspense fallback={<ViewLoadingSkeleton />}>
      <LandingWrapper theme={theme} toggleTheme={toggleTheme} onEnter={() => {
        setShowLanding(false);
        localStorage.setItem("genai_landing_dismissed", "true");
      }} />
    </React.Suspense>
  );

  if (!user) return (
    <React.Suspense fallback={<ViewLoadingSkeleton />}>
      <AuthInterface
        theme={theme}
        toggleTheme={toggleTheme}
        onBackToLanding={() => {
          setShowLanding(true);
          localStorage.removeItem("genai_landing_dismissed");
        }}
      />
    </React.Suspense>
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

  const sidebarProps = {
    activePath, setActivePath: handleSidebarPathChange,
    paths: pathsData, onReset: handleResetData, isEditMode, setIsEditMode,
    onAddPath: handleAddPath, onEditPath: handleEditPath,
    showCurriculumMap, setShowCurriculumMap,
    showRoadmap2, setShowRoadmap2, showRoadmap3, setShowRoadmap3,
    showIDE, setShowIDE, showResources, setShowResources,
    showProgress, setShowProgress, showPlayground, setShowPlayground,
    onOpenGenAIPlayground2: openGenAIPlayground2,
    showDSAAnimator, setShowDSAAnimator, showLearnBug, setShowLearnBug,
    showSqlLab, setShowSqlLab, showConcurrencyLab, setShowConcurrencyLab,
    showLabs, setShowLabs, activeLabId, setActiveLabId,
    showAgentLibrary, setShowAgentLibrary, showAimlCompanion, setShowAimlCompanion,
    showLinks, setShowLinks, showBlog, setShowBlog,
    onOpenBlogYear: (year) => { closeAllPanels(); setBlogSlug(null); setBlogTag(null); setBlogYear(year); setShowBlog(true); },
    showAdminManagement, setShowAdminManagement,
    showAwsSimulator, setShowAwsSimulator, showSimulator, setShowSimulator,
    showGalaxy, setShowGalaxy, showAIInterviewer, setShowAIInterviewer,
    showGeminiInterviewer, setShowGeminiInterviewer,
    showEmotionalSupport, setShowEmotionalSupport,
    showAlgoStudio, setShowAlgoStudio, showAlgoVisualizer, setShowAlgoVisualizer,
    showK8sGames, setShowK8sGames, showGitVisualizer, setShowGitVisualizer,
    showFlowDesign, setShowFlowDesign, showGitHubHub, setShowGitHubHub,
    showIntelligenceHub, setShowIntelligenceHub, showHome2, setShowHome2,
    showLegacyIntelligenceHub, setShowLegacyIntelligenceHub,
    showWorkplaceLab, setShowWorkplaceLab, showKnowledgeGraph, setShowKnowledgeGraph,
    showCommunity, setShowCommunity, showNotion, setShowNotion,
    showNoSignups, setShowNoSignups, showFreeSystemDesign, setShowFreeSystemDesign,
    showManual, setShowManual, activeManualPhase, setActiveManualPhase,
    showReference, setShowReference, activeReferenceTopic, setActiveReferenceTopic,
    showAgentCore, setShowAgentCore, agentCoreMode, setAgentCoreMode,
    showLangChainDocs, setShowLangChainDocs, langChainProduct, setLangChainProduct,
    showStrandsDocs, setShowStrandsDocs,
    showOnboarding, setShowOnboarding: handleSidebarOnboarding,
    showInterviewPrep, setShowInterviewPrep,
    activeToolHome, onOpenToolHome: setActiveToolHome,
    showQuiz, setShowQuiz, showLeetCode, setShowLeetCode,
    showAlgoWar, setShowAlgoWar, showProjects, setShowProjects,
    setLinksInitialTab, onHubNav: handleHubNav,
    isMobileMenuOpen, setIsMobileMenuOpen,
    activeNode, setActiveNode, setActiveModule, setActiveTopic,
    onSignOut: handleSignOut,
    isCollapsed: isSidebarCollapsed, setIsCollapsed: setIsSidebarCollapsed,
    onSectionWalkthrough: handleSectionWalkthrough,
  };

  return (
    <div className={`app ${isEditMode ? "edit-mode-active" : ""}${showOnboarding ? " onboarding-active" : ""}`}>
      {/* Mounted only while open — see the Cmd+K effect above and the note in
          GlobalSearchPalette for why it no longer lives here unconditionally. */}
      <OverlayBoundary>
        {isSearchOpen && (
          <GlobalSearchPalette
            open
            onClose={() => setIsSearchOpen(false)}
            items={searchItems}
            onNavigate={handleSearchNavigate}
          />
        )}
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
      </OverlayBoundary>
      {isEditMode && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '2px',
          background: '#f59e0b', zIndex: 9999, boxShadow: '0 0 10px #f59e0b'
        }} />
      )}
      <MobileHeader
        user={user}
        onSignOut={handleSignOut}
      />
      <div className="app-layout-root">
        {!isMobile && (
          <React.Suspense fallback={<aside className="app-sidebar-placeholder" aria-hidden="true" />}>
            <ActiveSidebar {...sidebarProps} />
          </React.Suspense>
        )}

        <main className="app-primary-content">
          {/*
            Every view below is React.lazy(). Without a boundary here, a view whose
            chunk isn't downloaded yet suspends and unwinds all the way to the root
            boundary in App() — blanking the entire window and remounting the
            sidebar, header, and providers' children on every single navigation.
            Scoping the boundary to the content area keeps the shell alive and
            confines the loading state to the region that is actually changing.
          */}
          <React.Suspense fallback={<ViewLoadingSkeleton />}>
          {showAdminManagement && isAdmin ? (
            <AdminManagement
              onClose={() => setShowAdminManagement(false)}
              pathsData={pathsData}
              setPathsData={setPathsData}
            />
          ) :
            showBlog ? <BlogPage theme={theme} isEditMode={isEditMode} initialYear={blogYear} initialSlug={blogSlug} initialTag={blogTag} onClose={() => setShowBlog(false)} /> :
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
                      onArticleClick={(slug) => {
                        closeAllPanels();
                        setBlogYear(null);
                        setBlogTag(null);
                        setBlogSlug(slug);
                        setShowBlog(true);
                      }}
                      onTopicClick={(tag, year) => {
                        closeAllPanels();
                        setBlogSlug(null);
                        setBlogYear(year);
                        setBlogTag(tag);
                        setShowBlog(true);
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
                            showLabs ? <LabsHub activeLabId={activeLabId} onSelectLab={setActiveLabId} /> :
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
                                                        showAgentCore ? <ErrorBoundary><AgentCoreViewer initialMode={agentCoreMode} onClose={() => setShowAgentCore(false)} /></ErrorBoundary> :
                                                        showLangChainDocs ? <ErrorBoundary><LangChainDocs product={langChainProduct} onClose={() => setShowLangChainDocs(false)} /></ErrorBoundary> :
                                                        showStrandsDocs ? <ErrorBoundary><StrandsDocs onClose={() => setShowStrandsDocs(false)} /></ErrorBoundary> :
                                                      showInterviewPrep ? <InterviewPrep onClose={() => { setInterviewDeepLinkId(null); setShowInterviewPrep(false); }} initialLessonId={interviewDeepLinkId} pathsData={pathsData} /> :
                                                      showLeetCode ? <LeetCodePage onClose={() => setShowLeetCode(false)} onSubmitLeetCode={handleLeetCodeSubmission} savedSubmissions={pathsData.leetcode?.submissions || {}} /> :
                                                      showAlgoWar ? <AlgoWarArena onClose={() => setShowAlgoWar(false)} /> :
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
                                                          onOpenArticle={(slug) => {
                                                            closeAllPanels();
                                                            setBlogYear(null);
                                                            setBlogTag(null);
                                                            setBlogSlug(slug);
                                                            setShowBlog(true);
                                                          }}
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
          </React.Suspense>
        </main>
      </div>

      <MobileBottomNav
        activeView={isMobileMenuOpen ? "more" : (showHome2 || showIntelligenceHub) ? "home" : showProgress ? "progress" : showQuiz ? "practice" : "roadmap"}
        setView={v => {
          closeAllPanels();
          if (v === "home") {
            if (isMobile) setShowHome2(true);
            else setShowIntelligenceHub(true);
          }
          else if (v === "progress") setShowProgress(true);
          else if (v === "practice") setShowQuiz(true);
        }}
        onMore={() => setIsMobileMenuOpen((open) => !open)}
        isMoreOpen={isMobileMenuOpen}
      />

      <OverlayBoundary>
        {isMobile && isMobileMenuOpen && (
          <MobileNavigationSheet
            open
            onClose={() => setIsMobileMenuOpen(false)}
            navigationProps={sidebarProps}
          />
        )}
      </OverlayBoundary>

      <OverlayBoundary>
        <FullContextChatbot
          user={user}
          pathsData={pathsData}
          activePath={activePath}
          activeNode={freshActiveNode}
          activeModule={freshActiveModule}
          activeTopic={activeTopic}
        />
      </OverlayBoundary>

      <OverlayBoundary>
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
      </OverlayBoundary>

      <OverlayBoundary>
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
            queueOverride={activeVideoQueue}
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
      </OverlayBoundary>

      <OverlayBoundary>
        {editingPath && <EditorModal type="path" data={editData} pathColor={editData?.color || "#3b82f6"} onClose={() => setEditingPath(false)} onSave={handleSavePath} onDelete={handleDeletePath} />}
        {editingNode && <EditorModal type="node" data={editData} pathColor={pathData.color} onClose={() => setEditingNode(false)} onSave={handleSaveNode} onDelete={handleDeleteNode} />}
        {editingModule && <EditorModal type="module" data={editData} pathColor={pathData.color} onClose={() => setEditingModule(false)} onSave={handleSaveModule} onDelete={handleDeleteModule} />}
        {editingTopic && <EditorModal type="topic" data={editData} pathColor={pathData.color} onClose={() => setEditingTopic(false)} onSave={handleSaveTopic} />}
      </OverlayBoundary>

      {/* Re-trigger Walkthrough Button (top-right, hidden until hover) — only on home/roadmap */}
      {!showWalkthrough && !sectionWalkthroughId &&
        !showCurriculumMap && !showIDE && !showResources && !showProgress &&
        !showPlayground && !showGenAIPlayground2 && !showDSAAnimator && !showLearnBug && !showSqlLab && !showConcurrencyLab && !showAgentLibrary && !showAimlCompanion && !showLinks &&
        !showBlog && !showAdminManagement && !showAwsSimulator && !showSimulator && !showGalaxy &&
        !showAIInterviewer && !showGeminiInterviewer && !showEmotionalSupport && !showAlgoStudio && !showAlgoVisualizer &&
        !showK8sGames && !showGitVisualizer && !showFlowDesign && !showGitHubHub &&
        !showIntelligenceHub && !showLegacyIntelligenceHub && !showWorkplaceLab && !showKnowledgeGraph &&
        !showCommunity && !showAlgoWar && (
          null
        )}

      <OverlayBoundary>
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
      </OverlayBoundary>
    </div>
  );
}

/**
 * Suspense boundary for lazy overlays (modals, palettes, walkthroughs, chatbots).
 *
 * These render outside <main>, so without a boundary of their own the first time
 * one is opened it suspends and unwinds to the root boundary — blanking the whole
 * application to show a modal. `fallback={null}` is the right fallback here: an
 * overlay appearing a beat later is correct, a flash of empty page is not.
 */
function OverlayBoundary({ children }) {
  return <React.Suspense fallback={null}>{children}</React.Suspense>;
}

/**
 * useState for a view-navigation flag, with the update marked as a transition.
 *
 * Every view in this app is React.lazy(). A plain setState that reveals a view
 * whose chunk hasn't downloaded yet suspends immediately, so the boundary shows
 * its fallback and the current screen disappears the instant you click. Marking
 * the update as a transition tells React to keep the *current* view on screen
 * and swap only once the new chunk is ready — the difference between a flash of
 * skeleton on every click and a normal-feeling navigation.
 *
 * Use this only for navigation flags. Anything driving a text input or another
 * high-frequency control must stay a plain useState — transitions are allowed to
 * be delayed, which is exactly wrong for typing.
 */
function useViewState(initial) {
  const [value, setValue] = useState(initial);
  const setTransitional = useCallback((next) => {
    React.startTransition(() => setValue(next));
  }, []);
  return [value, setTransitional];
}

/**
 * Fallback for the content-area Suspense boundary. Deliberately a layout-shaped
 * skeleton rather than a spinner or an empty div: it occupies the same space the
 * incoming view will, so the shell doesn't reflow when the chunk arrives.
 */
function ViewLoadingSkeleton() {
  return (
    <div className="view-skeleton" aria-busy="true" aria-live="polite">
      <div className="view-skeleton-bar" style={{ width: "38%", height: 28 }} />
      <div className="view-skeleton-bar" style={{ width: "62%" }} />
      <div className="view-skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="view-skeleton-card" />
        ))}
      </div>
      <span className="sr-only">Loading view…</span>
    </div>
  );
}

function MobileHeader({ user, onSignOut }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="mobile-header mobile-only">
      <div className="mobile-header__brand">
        <div className="mobile-header__identity" aria-label="GenAI Academy">
          <div className="mobile-header__mark" aria-hidden="true">
            <Sparkles size={16} color="black" />
          </div>
          <div className="mobile-header__wordmark">GEN<span>AI</span> ACADEMY</div>
        </div>
      </div>
      <div className="mobile-header__actions">
        <button
          type="button"
          className={`theme-switch mobile-header__theme-switch ${theme === "dark" ? "active" : ""}`}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          <div className="theme-switch-icon left"><Brain size={12} /></div>
          <div className="theme-switch-icon right"><Sparkles size={12} /></div>
          <div className="theme-switch-thumb"></div>
        </button>
        <button
          type="button"
          className="mobile-header__icon-button mobile-header__account-button"
          onClick={onSignOut}
          aria-label={`Sign out${user?.email ? ` ${user.email}` : ""}`}
        >
          <User size={18} />
        </button>
      </div>
    </header>
  );
}

function MobileBottomNav({ activeView, setView, onMore, isMoreOpen }) {
  const items = [
    { id: "home", icon: House, label: "Home" },
    { id: "roadmap", icon: Map, label: "Roadmap" },
    { id: "progress", icon: PieChart, label: "Progress" },
    { id: "practice", icon: FlaskConical, label: "Practice" },
    { id: "more", icon: MoreHorizontal, label: "More" },
  ];
  return (
    <nav className="mobile-nav mobile-only" aria-label="Primary navigation">
      {items.map(item => (
        <button
          key={item.id}
          type="button"
          className={`mobile-nav-item ${activeView === item.id ? "active" : ""}`}
          onClick={() => item.id === "more" ? onMore() : setView(item.id)}
          aria-current={activeView === item.id ? "page" : undefined}
          aria-expanded={item.id === "more" ? isMoreOpen : undefined}
          aria-controls={item.id === "more" ? "mobile-navigation-sheet" : undefined}
        >
          <div className="mobile-nav-icon"><item.icon size={20} /></div>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
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
