import {
  LayoutDashboard, Rocket, Network, CircleDashed, Orbit, Share2,
  Terminal, Code2, Boxes, Sparkles, Layers, Box,
  BookOpen, BookMarked, Bookmark, GitBranch,
  HelpCircle, Users, HeartHandshake, CheckSquare, GraduationCap,
  Database, Clapperboard, GitCommit, FileText, Globe, Car, Plane,
  DatabaseZap, Split, ShieldCheck, Braces, ReceiptText, PanelLeft,
  Bot, Workflow, Blocks, Activity, Waypoints, FileCode2,
  FlaskConical, Headphones, Tags, Swords,
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
  leetcode: { icon: Code2, label: "Code Lab", description: "Practice LeetCode problems" },
  algowar: { icon: Swords, label: "AlgoWar Arena", description: "Compete in real-time coding battles" },
  playground: { icon: Boxes, label: "AI Playground", description: "Experiment with AI systems" },
  genai_playground2: { icon: Sparkles, label: "Gen AI Playground 2.0", description: "Design systems, diagrams, and AI whiteboards" },
  simulator: { icon: Layers, label: "System Design", description: "Practice architecture decisions" },
  algo_visualizer: { icon: Box, label: "Algorithm Practice", description: "Learn algorithms step by step" },
  learnbug: { icon: Terminal, label: "Visualize", description: "Debug Python code with memory, structure, and timeline views" },
  sql_lab: { icon: DatabaseZap, label: "SQL & Query Plans", description: "Run real Postgres in-browser and read EXPLAIN ANALYZE output" },
  concurrency_lab: { icon: Split, label: "Concurrency Lab", description: "Step through thread interleavings and watch races happen" },
  labs: { icon: FlaskConical, label: "Labs", description: "Build and test real AI systems" },
  lab_retrieval_tuning: { icon: Braces, label: "Retrieval Lab — Tune the Pipeline", description: "Tune chunking, retrieval, and reranking" },
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
  lab_retrieval_observatory: { icon: Activity, label: "Retrieval Observatory", description: "Diagnose retrieval precision, recall, and reranking" },
  lab_graphrag_atlas: { icon: Share2, label: "GraphRAG Atlas", description: "Navigate local, global, and connected graph evidence" },
  lab_plan_repair: { icon: Workflow, label: "Plan Repair Studio", description: "Repair an agent plan after the world changes" },
  lab_durable_agent_ops: { icon: DatabaseZap, label: "Durable Agent Ops", description: "Crash and safely resume long-running agents" },
  lab_tokenization_microscope: { icon: Braces, label: "Tokenization Microscope", description: "Inspect normalization, subwords, IDs, and fragmentation" },
  lab_entity_boundary: { icon: Tags, label: "Entity Boundary Studio", description: "Practice BIO tagging and exact entity spans" },
  lab_semantic_cartographer: { icon: Orbit, label: "Semantic Space Cartographer", description: "Map sentence embeddings and hard negatives" },
  lab_intent_calibration: { icon: Activity, label: "Intent Calibration Clinic", description: "Tune NLP classification thresholds and confidence" },
  lab_bias_variance: { icon: Activity, label: "Bias–Variance Playground", description: "Balance underfitting, variance, data size, and label noise." },
  lab_feature_foundry: { icon: Braces, label: "Feature Engineering Foundry", description: "Transform, encode, and audit tabular features." },
  lab_cross_validation: { icon: Split, label: "Cross-Validation Lab", description: "Design folds that match the deployment boundary." },
  lab_regularization_path: { icon: Activity, label: "Regularization Path Explorer", description: "Explore L1/L2 shrinkage and sparse solutions." },
  lab_tree_split: { icon: GitBranch, label: "Decision Tree Split Simulator", description: "Grow, inspect, and prune decision trees." },
  lab_knn_neighborhood: { icon: Orbit, label: "KNN Neighborhood Explorer", description: "Inspect neighborhoods, scaling, and local boundaries." },
  lab_imbalance_triage: { icon: Activity, label: "Imbalanced Learning Triage", description: "Tune cost-aware thresholds for rare classes." },
  lab_drift_monitor: { icon: Activity, label: "Model Drift Monitor", description: "Detect data and performance drift over time." },
  lab_tensor_shape: { icon: Boxes, label: "Tensor Shape Gym", description: "Practice tensor axes, broadcasting, and shape flow." },
  lab_backprop_debugger: { icon: Network, label: "Backpropagation Debugger", description: "Trace gradients and repair broken computation graphs." },
  lab_activation_arena: { icon: Activity, label: "Activation Function Arena", description: "Compare saturation, sparsity, and gradient flow." },
  lab_optimizer_race: { icon: Activity, label: "Optimizer Race Track", description: "Compare optimizer dynamics under equal budgets." },
  lab_initialization_signal: { icon: Network, label: "Initialization Signal Lab", description: "Preserve activation and gradient scale across depth." },
  lab_attention_mechanism: { icon: Blocks, label: "Attention Mechanism Lab", description: "Inspect masks, heads, temperature, and context." },
  lab_autoencoder_latent: { icon: Orbit, label: "Autoencoder Latent Space Lab", description: "Explore reconstruction pressure and latent geometry." },
  lab_training_stability: { icon: Activity, label: "Training Stability Control Room", description: "Control clipping, warmup, normalization, and recovery." },
  lab_convolution_lens: { icon: Boxes, label: "Convolution Lens", description: "Explore kernels, stride, edges, and feature maps." },
  lab_detection_iou: { icon: Activity, label: "Detection IoU & NMS Arena", description: "Tune box matching and duplicate suppression." },
  lab_augmentation_lab: { icon: Layers, label: "Image Augmentation Lab", description: "Build label-safe visual augmentation policies." },
  lab_segmentation_pixel: { icon: Blocks, label: "Segmentation Pixel Lab", description: "Measure masks, boundaries, and class imbalance." },
  lab_vit_patch: { icon: Boxes, label: "Vision Transformer Patch Lab", description: "Explore patch granularity and visual token budgets." },
  lab_distribution_explorer: { icon: Activity, label: "Probability Distribution Explorer", description: "Explore location, spread, shape, and tail risk." },
  lab_bayes_rule: { icon: GitBranch, label: "Bayes Rule Evidence Lab", description: "Update priors with evidence and base rates." },
  lab_hypothesis_court: { icon: FlaskConical, label: "Hypothesis Testing Court", description: "Study power, errors, effect size, and significance." },
  lab_confidence_factory: { icon: Activity, label: "Confidence Interval Factory", description: "Build and interpret interval estimation procedures." },
  lab_sampling_bias: { icon: Users, label: "Sampling Bias Simulator", description: "Expose coverage, response, and selection bias." },
  lab_causation_lab: { icon: Share2, label: "Correlation vs Causation Lab", description: "Separate association from causal identification." },
  lab_markov_chain: { icon: Blocks, label: "Markov Chain State Lab", description: "Simulate transitions, mixing, and steady states." },
  lab_monte_carlo: { icon: Orbit, label: "Monte Carlo Experiment Lab", description: "Estimate uncertainty through repeated simulation." },
  lab_pca_variance: { icon: Activity, label: "PCA Variance Explorer", description: "Scale before PCA. Variance is not usefulness." },
  lab_clustering_workbench: { icon: Blocks, label: "Clustering Workbench", description: "Cluster assumptions differ. Validate stability." },
  lab_svm_margin: { icon: Activity, label: "SVM Margin Lab", description: "Margins trade fit for robustness. Kernels reshape geometry." },
  lab_ensemble_fusion: { icon: GitBranch, label: "Ensemble Fusion Studio", description: "Diversity creates value. Blend out-of-fold." },
  lab_gradient_boosting: { icon: Orbit, label: "Gradient Boosting Stage Lab", description: "Boost residual structure. Rate and rounds interact." },
  lab_anomaly_detection: { icon: Braces, label: "Anomaly Detection Radar", description: "Define abnormal operationally. Threshold by response capacity." },
  lab_calibration_curve: { icon: Network, label: "Probability Calibration Lab", description: "Rank and calibration differ. Calibrate on held-out data." },
  lab_feature_selection: { icon: Layers, label: "Feature Selection Tournament", description: "Select inside the pipeline. Stability matters." },
  lab_hyperparameter_search: { icon: CircleDashed, label: "Hyperparameter Search Planner", description: "Separate search from test. Use informed spaces." },
  lab_model_explainability: { icon: Activity, label: "Model Explainability Lab", description: "Explain the question first. Compare methods." },
  lab_cnn_receptive_field: { icon: Blocks, label: "CNN Receptive Field Lab", description: "Track effective context. Resolution and context trade." },
  lab_rnn_sequence: { icon: Activity, label: "RNN Sequence Memory Lab", description: "State compresses history. Length changes difficulty." },
  lab_lstm_gates: { icon: GitBranch, label: "LSTM Gate Control Lab", description: "Gates route memory. Bias initialization matters." },
  lab_normalization_dynamics: { icon: Orbit, label: "Normalization Dynamics Lab", description: "Know the statistic axis. Small batches need care." },
  lab_dropout_uncertainty: { icon: Braces, label: "Dropout & Uncertainty Lab", description: "Dropout regularizes paths. Uncertainty needs calibration." },
  lab_transfer_learning: { icon: Network, label: "Transfer Learning Strategy Lab", description: "Transfer depends on similarity. Unfreeze gradually." },
  lab_quantization_tradeoff: { icon: Layers, label: "Neural Quantization Lab", description: "Measure hardware latency. Calibrate representative data." },
  lab_network_pruning: { icon: CircleDashed, label: "Network Pruning Lab", description: "Sparsity needs hardware support. Prune and recover." },
  lab_distributed_training: { icon: Activity, label: "Distributed Training Topology Lab", description: "Scale efficiency, not workers. Overlap communication." },
  lab_adversarial_robustness: { icon: Blocks, label: "Adversarial Robustness Arena", description: "State the attacker model. Evaluate adaptive attacks." },
  lab_decoding_strategies: { icon: Activity, label: "Decoding Strategy Arena", description: "Decoding changes behavior. Tune by task." },
  lab_prompt_versioning: { icon: GitBranch, label: "Prompt Versioning Lab", description: "Version prompts as code. Test behavioral contracts." },
  lab_context_budget: { icon: Orbit, label: "Context Window Budgeter", description: "Budget by information value. Protect critical instructions." },
  lab_structured_generation: { icon: Braces, label: "Structured Generation Validator", description: "Validate semantics too. Bound repair loops." },
  lab_hallucination_eval: { icon: Network, label: "Hallucination Evaluation Lab", description: "Evaluate claim by claim. Separate correctness and grounding." },
  lab_synthetic_data: { icon: Layers, label: "Synthetic Data Foundry", description: "Measure novelty. Keep real validation." },
  lab_lora_adaptation: { icon: CircleDashed, label: "LoRA Adaptation Lab", description: "Adapters trade capacity for cost. Track base compatibility." },
  lab_multimodal_alignment: { icon: Activity, label: "Multimodal Alignment Lab", description: "Test modality ablations. Align at the right level." },
  lab_diffusion_denoising: { icon: Blocks, label: "Diffusion Denoising Lab", description: "Sampling is iterative. Guidance trades diversity." },
  lab_genai_guardrails: { icon: Activity, label: "Generative AI Guardrail Lab", description: "Layer controls. Test evasions." },
  lab_query_rewriting: { icon: GitBranch, label: "Query Rewriting Lab", description: "Preserve user intent. Compare original retrieval." },
  lab_metadata_filtering: { icon: Orbit, label: "Metadata Filter Workshop", description: "Metadata is retrieval logic. Plan empty-result fallback." },
  lab_reranker_lab: { icon: Braces, label: "Neural Reranker Lab", description: "Recall before reranking. Measure stage metrics." },
  lab_context_compression: { icon: Network, label: "Context Compression Lab", description: "Preserve entailment. Track removed claims." },
  lab_citation_alignment: { icon: Layers, label: "Citation Alignment Studio", description: "Cite at claim level. Relevance is not entailment." },
  lab_multihop_retrieval: { icon: CircleDashed, label: "Multi-Hop Retrieval Planner", description: "Track hop provenance. Stop on sufficient evidence." },
  lab_freshness_versioning: { icon: Activity, label: "RAG Freshness & Version Lab", description: "Freshness is query-dependent. Store effective dates." },
  lab_rag_evaluation: { icon: Blocks, label: "RAG Evaluation Workbench", description: "Evaluate stages separately. Use real failure slices." },
  lab_semantic_cache: { icon: Activity, label: "Semantic Cache Lab", description: "Cache semantics carefully. Key all answer dependencies." },
  lab_retrieval_acl: { icon: GitBranch, label: "Retrieval Access-Control Lab", description: "Filter before exposure. Propagate identity end to end." },
  lab_tool_schema_design: { icon: Orbit, label: "Tool Schema Design Lab", description: "Schemas are interfaces. Constrain consequential fields." },
  lab_agent_planning: { icon: Braces, label: "Agent Planning Search Lab", description: "Plans are hypotheses. Observe before replanning." },
  lab_memory_policy: { icon: Network, label: "Agent Memory Policy Lab", description: "Memory needs policy. Make revision possible." },
  lab_agent_handoff: { icon: Layers, label: "Agent Handoff Protocol Lab", description: "Handoffs are contracts. Transfer state explicitly." },
  lab_agent_state_machine: { icon: CircleDashed, label: "Agent State Machine Lab", description: "Make states explicit. Guard side effects." },
  lab_approval_gates: { icon: Activity, label: "Agent Approval Gate Lab", description: "Show the proposed action. Fail closed for consequence." },
  lab_agent_retries: { icon: Blocks, label: "Agent Retry & Idempotency Lab", description: "Classify retryable errors. Key side effects." },
  lab_agent_budget: { icon: Activity, label: "Agent Budget Controller", description: "Allocate budget by stage. Reserve for verification." },
  lab_agent_observability: { icon: GitBranch, label: "Agent Trace Observatory", description: "Trace state transitions. Redact at collection." },
  lab_agent_sandbox: { icon: Orbit, label: "Agent Sandbox & Authority Lab", description: "Least authority by default. Separate data and instructions." },
  lab_container_resources: { icon: Braces, label: "Container Resource Planner", description: "Requests drive scheduling. Limits shape failure." },
  lab_autoscaling: { icon: Network, label: "Autoscaling Control Lab", description: "Scale on causal signals. Model startup time." },
  lab_health_probes: { icon: Layers, label: "Health Probe Designer", description: "Probes answer different questions. Avoid cascading restarts." },
  lab_canary_release: { icon: CircleDashed, label: "Canary Release Simulator", description: "Canary by risk slice. Predefine rollback." },
  lab_blue_green: { icon: Activity, label: "Blue–Green Deployment Lab", description: "Test production topology. Plan data compatibility." },
  lab_slo_budget: { icon: Blocks, label: "SLO & Error Budget Lab", description: "Measure user outcomes. Use burn rates." },
  lab_observability_signals: { icon: Activity, label: "Four Signals Observatory", description: "Monitor symptoms first. Correlate signals." },
  lab_incident_response: { icon: GitBranch, label: "Incident Command Simulator", description: "Assign clear roles. Mitigate before perfection." },
  lab_chaos_testing: { icon: Orbit, label: "Chaos Experiment Lab", description: "Start with a steady state. Limit blast radius." },
  lab_feature_flags: { icon: Braces, label: "Feature Flag Lifecycle Lab", description: "Flags need owners. Test both branches." },
  lab_ci_quality_gates: { icon: Network, label: "CI Quality Gate Lab", description: "Fast feedback first. Quarantine flakes visibly." },
  lab_test_pyramid: { icon: Layers, label: "Test Pyramid Planner", description: "Test at the cheapest useful layer. Keep contracts real." },
  lab_contract_testing: { icon: CircleDashed, label: "API Contract Testing Lab", description: "Contracts capture usage. Test compatibility before deploy." },
  lab_rate_limiting: { icon: Activity, label: "Rate Limiting Lab", description: "Limit by scarce resource. Return retry guidance." },
  lab_cache_architecture: { icon: Blocks, label: "Cache Architecture Lab", description: "Cache correctness first. Design stampede control." },
  lab_queue_backpressure: { icon: Activity, label: "Queue & Backpressure Lab", description: "Bound queues. Propagate pressure." },
  lab_database_migration: { icon: GitBranch, label: "Database Migration Safety Lab", description: "Keep versions compatible. Throttle backfills." },
  lab_supply_chain: { icon: Orbit, label: "Software Supply-Chain Lab", description: "Pin and verify inputs. Generate provenance." },
  lab_distributed_tracing: { icon: Braces, label: "Distributed Tracing Lab", description: "Propagate context everywhere. Sample intelligently." },
  lab_cost_performance: { icon: Network, label: "Cost–Performance FinOps Lab", description: "Optimize unit economics. Include quality constraints." },

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
  amazon_connect: { icon: Headphones, label: "Amazon Connect", description: "Routing, flows, channels, analytics, AI, development, and administration" },
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
  { id: "algowar", label: "AlgoWar", itemIds: ["algowar"] },
  { id: "labs", label: "Labs", itemIds: ["labs"] },
  { id: "agents", label: "Agents", itemIds: ["langchain", "langgraph", "deepagents", "langsmith", "langchain_samples", "strands", "aws_agentcore", "amazon_connect", "agent_library"] },
  { id: "library", label: "Library", itemIds: ["manual", "reference", "resources", "blog", "links", "github"] },
  { id: "career", label: "Career", itemIds: ["interview_prep", "interviewer", "gemini_interviewer", "emotional_support", "quiz"] },
  { id: "community", label: "Community", itemIds: ["community", "tasks", "aiml_companion"] },
  { id: "more_tools", label: "More tools", itemIds: ["projects", "aws_simulator", "dsa_animator", "k8s_games", "git_visualizer", "flow_design", "notion", "nosignups", "free_system_design"] },
];

const LAB_ITEM_IDS = [
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
];

const AGENT_ITEM_IDS = [
  "langchain",
  "langgraph",
  "deepagents",
  "langsmith",
  "langchain_samples",
  "strands",
  "aws_agentcore",
  "amazon_connect",
  "agent_library",
];

// Merges a saved custom layout with the default one so that any item id that
// isn't part of the saved layout (e.g. a feature shipped after the admin last
// customized things) still surfaces somewhere instead of silently vanishing.
export const resolveEffectiveLayout = (savedLayout) => {
  const source = savedLayout && savedLayout.length ? savedLayout : DEFAULT_SIDEBAR_LAYOUT;
  const groups = source.map((group) => ({ ...group, itemIds: [...group.itemIds] }));

  // AlgoWar owns a dedicated top-level section. Re-home it for saved/custom
  // layouts too, otherwise newly shipped items are appended under More tools.
  groups.forEach((group) => {
    group.itemIds = group.itemIds.filter((id) => id !== "algowar");
  });
  let algoWarGroup = groups.find((group) => group.id === "algowar");
  if (!algoWarGroup) {
    algoWarGroup = { id: "algowar", label: "AlgoWar", itemIds: [] };
    const labsIndex = groups.findIndex((group) => group.id === "labs");
    groups.splice(labsIndex === -1 ? groups.length : labsIndex, 0, algoWarGroup);
  }
  algoWarGroup.label = "AlgoWar";
  algoWarGroup.itemIds.push("algowar");

  // Consolidate older per-lab sidebar items into the single Labs home entry.
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
  labsGroup.itemIds.push("labs");

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
  // Individual lab destinations live inside LabsHub. They are intentionally
  // absent from the sidebar layout and must not be resurrected as orphans in
  // More tools after the consolidation above.
  const orphanIds = Object.keys(SIDEBAR_ITEM_REGISTRY)
    .filter((id) => !covered.has(id) && !LAB_ITEM_IDS.includes(id));
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
