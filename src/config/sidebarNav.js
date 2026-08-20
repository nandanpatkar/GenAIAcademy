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
  if (p.showSqlLab) return "sql_lab";
  if (p.showConcurrencyLab) return "concurrency_lab";
  if (p.showLabs) return "labs";
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
  if (p.showRoadmap3) return "roadmap3";
  if (p.showAIInterviewer) return "interviewer";
  if (p.showGeminiInterviewer) return "gemini_interviewer";
  if (p.showEmotionalSupport) return "emotional_support";
  if (p.showJobScout) return "job_scout";
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
  if (p.showHome3) return "home3";
  if (p.showIntelligenceHub) return "overview";
  if (p.showLegacyIntelligenceHub) return "legacy_hub";
  if (p.showQuiz) return "quiz";
  if (p.showLeetCode) return "leetcode";
  if (p.showAlgoWar) return "algowar";
  if (p.showManual) return "manual";
  if (p.showReference) return "reference";
  if (p.showApiHub) return "learn_api";
  if (p.showDataScience) return "data_science";
  if (p.showChaiVisual) return "chai_visual";
  if (p.showAgentCore) return p.agentCoreMode === "connect" ? "amazon_connect" : "aws_agentcore";
  // The LangChain product id doubles as the nav id, so the four Agents
  // subsections highlight without any extra mapping.
  if (p.showLangChainDocs) return p.langChainProduct || "langchain";
  // Strands is one nav item over five in-viewer products, so it does not.
  if (p.showStrandsDocs) return "strands";
  // One nav item over seven in-viewer tracks, so no extra mapping.
  if (p.showExamsDocs) return "exams";
  // Same shape: one nav item over the whole project-documentation viewer.
  if (p.showDocumentation) return "documentation";
  // The AI from Scratch track id doubles as the nav id, minus the prefix.
  if (p.showAiFromScratch) return `aifs_${p.aifsTrack === "guides" ? "reference" : p.aifsTrack || "curriculum"}`;
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
  if (p.setShowRoadmap3) p.setShowRoadmap3(false);
  if (p.setShowIDE) p.setShowIDE(false);
  if (p.setShowProjects) p.setShowProjects(false);
  if (p.setShowResources) p.setShowResources(false);
  if (p.setShowProgress) p.setShowProgress(false);
  if (p.setShowPlayground) p.setShowPlayground(false);
  if (p.setShowDSAAnimator) p.setShowDSAAnimator(false);
  if (p.setShowLearnBug) p.setShowLearnBug(false);
  if (p.setShowSqlLab) p.setShowSqlLab(false);
  if (p.setShowConcurrencyLab) p.setShowConcurrencyLab(false);
  if (p.setShowLabs) p.setShowLabs(false);
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
  if (p.setShowHome3) p.setShowHome3(false);
  if (p.setShowLegacyIntelligenceHub) p.setShowLegacyIntelligenceHub(false);
  if (p.setShowQuiz) p.setShowQuiz(false);
  if (p.setShowLeetCode) p.setShowLeetCode(false);
  if (p.setShowAlgoWar) p.setShowAlgoWar(false);
  if (p.setShowManual) p.setShowManual(false);
  if (p.setShowReference) p.setShowReference(false);
  if (p.setShowApiHub) p.setShowApiHub(false);
  if (p.setShowDataScience) p.setShowDataScience(false);
  if (p.setShowChaiVisual) p.setShowChaiVisual(false);
  if (p.setShowAgentCore) p.setShowAgentCore(false);
  if (p.setShowLangChainDocs) p.setShowLangChainDocs(false);
  if (p.setShowStrandsDocs) p.setShowStrandsDocs(false);
  if (p.setShowExamsDocs) p.setShowExamsDocs(false);
  if (p.setShowAiFromScratch) p.setShowAiFromScratch(false);
  if (p.setShowOnboarding) p.setShowOnboarding(false);

  switch (id) {
    case "overview":
      if (p.setShowIntelligenceHub) p.setShowIntelligenceHub(true);
      break;
    case "home2":
      if (p.setShowHome2) p.setShowHome2(true);
      break;
    case "home3":
      if (p.setShowHome3) p.setShowHome3(true);
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
    case "learn_api":
      if (p.setShowApiHub) p.setShowApiHub(true);
      break;
    case "data_science":
      if (p.setShowDataScience) p.setShowDataScience(true);
      break;
    case "chai_visual":
      if (p.setShowChaiVisual) p.setShowChaiVisual(true);
      break;
    case "aws_agentcore":
      if (p.setAgentCoreMode) p.setAgentCoreMode("docs");
      if (p.setShowAgentCore) p.setShowAgentCore(true);
      break;
    case "amazon_connect":
      if (p.setAgentCoreMode) p.setAgentCoreMode("connect");
      if (p.setShowAgentCore) p.setShowAgentCore(true);
      break;
    case "langchain":
    case "langgraph":
    case "deepagents":
    case "langsmith":
    case "langchain_samples":
      // One viewer, entered scoped to the library the reader picked.
      if (p.setLangChainProduct) p.setLangChainProduct(id);
      if (p.setShowLangChainDocs) p.setShowLangChainDocs(true);
      break;
    case "strands":
      if (p.setShowStrandsDocs) p.setShowStrandsDocs(true);
      break;
    case "exams":
      if (p.setShowExamsDocs) p.setShowExamsDocs(true);
      break;
    case "documentation":
      if (p.setShowDocumentation) p.setShowDocumentation(true);
      break;
    case "aifs_curriculum":
    case "aifs_certification":
    case "aifs_reference": {
      // One viewer, entered scoped to the track the reader picked.
      const track = id === "aifs_reference" ? "guides" : id.replace("aifs_", "");
      if (p.setAifsTrack) p.setAifsTrack(track);
      if (p.setShowAiFromScratch) p.setShowAiFromScratch(true);
      break;
    }
    case "nosignups": if (p.setShowNoSignups) p.setShowNoSignups(true); break;
    case "free_system_design": window.open("https://freesystemdesign.com/", "_blank", "noopener,noreferrer"); break;
    case "knowledge_graph": if (p.setShowKnowledgeGraph) p.setShowKnowledgeGraph(true); break;
    case "curriculum_map": p.setShowCurriculumMap(true); break;
    case "roadmap2": if (p.setShowRoadmap2) p.setShowRoadmap2(true); break;
    case "roadmap3": if (p.setShowRoadmap3) p.setShowRoadmap3(true); break;
    case "projects": if (p.onOpenToolHome) p.onOpenToolHome("projects"); else if (p.setShowProjects) p.setShowProjects(true); break;
    case "ide": if (p.onOpenToolHome) p.onOpenToolHome("coding"); else if (p.setShowIDE) p.setShowIDE(true); break;
    case "resources": if (p.onOpenToolHome) p.onOpenToolHome("resources"); else if (p.setShowResources) p.setShowResources(true); break;
    case "progress": if (p.setShowProgress) p.setShowProgress(true); break;
    case "playground": if (p.onOpenToolHome) p.onOpenToolHome("playground"); else if (p.setShowPlayground) p.setShowPlayground(true); break;
    case "genai_playground2": if (p.onOpenGenAIPlayground2) p.onOpenGenAIPlayground2(); break;
    case "dsa_animator": if (p.onOpenToolHome) p.onOpenToolHome("dsa"); else if (p.setShowDSAAnimator) p.setShowDSAAnimator(true); break;
    case "learnbug": if (p.onOpenToolHome) p.onOpenToolHome("visualize"); else if (p.setShowLearnBug) p.setShowLearnBug(true); break;
    case "sql_lab": if (p.setShowSqlLab) p.setShowSqlLab(true); break;
    case "concurrency_lab": if (p.setShowConcurrencyLab) p.setShowConcurrencyLab(true); break;
    case "labs":
      if (p.setActiveLabId) p.setActiveLabId(null);
      if (p.setShowLabs) p.setShowLabs(true);
      break;
    case "lab_retrieval_tuning":
    case "lab_enterprise_ai_agents":
    case "lab_chunking_bench":
    case "lab_token_cost":
    case "lab_agent_anatomy":
    case "lab_agent_bottlenecks":
    case "lab_eval_forge":
    case "lab_context_architect":
    case "lab_security_arena":
    case "lab_memory_garden":
    case "lab_tool_flight_school":
    case "lab_human_control":
    case "lab_multi_agent":
    case "lab_mcp_permissions":
    case "lab_trace_detective":
    case "lab_structured_repair":
    case "lab_model_router":
    case "lab_grounding_court":
    case "lab_uncertainty":
    case "lab_prompt_cache":
    case "lab_technique_chooser":
    case "lab_retrieval_observatory":
    case "lab_graphrag_atlas":
    case "lab_plan_repair":
    case "lab_durable_agent_ops":
    case "lab_tokenization_microscope":
    case "lab_entity_boundary":
    case "lab_semantic_cartographer":
    case "lab_intent_calibration":
    case "lab_bias_variance":
    case "lab_feature_foundry":
    case "lab_cross_validation":
    case "lab_regularization_path":
    case "lab_tree_split":
    case "lab_knn_neighborhood":
    case "lab_imbalance_triage":
    case "lab_drift_monitor":
    case "lab_tensor_shape":
    case "lab_backprop_debugger":
    case "lab_activation_arena":
    case "lab_optimizer_race":
    case "lab_initialization_signal":
    case "lab_attention_mechanism":
    case "lab_autoencoder_latent":
    case "lab_training_stability":
    case "lab_convolution_lens":
    case "lab_detection_iou":
    case "lab_augmentation_lab":
    case "lab_segmentation_pixel":
    case "lab_vit_patch":
    case "lab_distribution_explorer":
    case "lab_bayes_rule":
    case "lab_hypothesis_court":
    case "lab_confidence_factory":
    case "lab_sampling_bias":
    case "lab_causation_lab":
    case "lab_markov_chain":
    case "lab_monte_carlo":
    case "lab_pca_variance":
    case "lab_clustering_workbench":
    case "lab_svm_margin":
    case "lab_ensemble_fusion":
    case "lab_gradient_boosting":
    case "lab_anomaly_detection":
    case "lab_calibration_curve":
    case "lab_feature_selection":
    case "lab_hyperparameter_search":
    case "lab_model_explainability":
    case "lab_cnn_receptive_field":
    case "lab_rnn_sequence":
    case "lab_lstm_gates":
    case "lab_normalization_dynamics":
    case "lab_dropout_uncertainty":
    case "lab_transfer_learning":
    case "lab_quantization_tradeoff":
    case "lab_network_pruning":
    case "lab_distributed_training":
    case "lab_adversarial_robustness":
    case "lab_decoding_strategies":
    case "lab_prompt_versioning":
    case "lab_context_budget":
    case "lab_structured_generation":
    case "lab_hallucination_eval":
    case "lab_synthetic_data":
    case "lab_lora_adaptation":
    case "lab_multimodal_alignment":
    case "lab_diffusion_denoising":
    case "lab_genai_guardrails":
    case "lab_query_rewriting":
    case "lab_metadata_filtering":
    case "lab_reranker_lab":
    case "lab_context_compression":
    case "lab_citation_alignment":
    case "lab_multihop_retrieval":
    case "lab_freshness_versioning":
    case "lab_rag_evaluation":
    case "lab_semantic_cache":
    case "lab_retrieval_acl":
    case "lab_tool_schema_design":
    case "lab_agent_planning":
    case "lab_memory_policy":
    case "lab_agent_handoff":
    case "lab_agent_state_machine":
    case "lab_approval_gates":
    case "lab_agent_retries":
    case "lab_agent_budget":
    case "lab_agent_observability":
    case "lab_agent_sandbox":
    case "lab_container_resources":
    case "lab_autoscaling":
    case "lab_health_probes":
    case "lab_canary_release":
    case "lab_blue_green":
    case "lab_slo_budget":
    case "lab_observability_signals":
    case "lab_incident_response":
    case "lab_chaos_testing":
    case "lab_feature_flags":
    case "lab_ci_quality_gates":
    case "lab_test_pyramid":
    case "lab_contract_testing":
    case "lab_rate_limiting":
    case "lab_cache_architecture":
    case "lab_queue_backpressure":
    case "lab_database_migration":
    case "lab_supply_chain":
    case "lab_distributed_tracing":
    case "lab_cost_performance":
      if (p.setActiveLabId) p.setActiveLabId(id);
      if (p.setShowLabs) p.setShowLabs(true);
      break;
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
    case "job_scout":
      if (p.setShowJobScout) p.setShowJobScout(true);
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
    case "algowar":
      if (p.setShowAlgoWar) p.setShowAlgoWar(true);
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
