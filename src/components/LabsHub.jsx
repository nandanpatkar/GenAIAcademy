import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Database,
  FlaskConical,
  Gauge,
  Loader2,
  Pencil,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trash2,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { createSharedLab, deleteSharedLab, listSharedLabs, updateSharedLab } from "../services/labCatalogService";
import { DATA_SCIENCE_LABS } from "../data/dataScienceLabCatalog";
import { FEATURED_LAB_TAGS, withLabTags } from "../utils/labTaxonomy";
import AgentBottlenecksLab from "../../artifact-5.jsx";
import EvalForgeLab from "../../artifact-6.jsx";
import ContextArchitectLab from "../../artifact-7.jsx";
import AgentSecurityArenaLab from "../../artifact-8.jsx";
import MemoryGardenLab from "../../artifact-9.jsx";
import ToolCallingFlightSchoolLab from "../../artifact-10.jsx";
import HumanControlRoomLab from "../../artifact-11.jsx";
import MultiAgentMissionControlLab from "../../artifact-12.jsx";
import McpPermissionWorkshopLab from "../../artifact-13.jsx";
import TraceDetectiveLab from "../../artifact-14.jsx";
import StructuredOutputRepairLab from "../../artifact-15.jsx";
import ModelRouterLab from "../../artifact-16.jsx";
import GroundingCourtLab from "../../artifact-17.jsx";
import AgentUncertaintyLab from "../../artifact-18.jsx";
import PromptCacheWorkshopLab from "../../artifact-19.jsx";
import TechniqueChooserLab from "../../artifact-20.jsx";
import RetrievalObservatoryLab from "../../artifact-21.jsx";
import GraphRagAtlasLab from "../../artifact-22.jsx";
import PlanRepairStudioLab from "../../artifact-23.jsx";
import DurableAgentOpsLab from "../../artifact-24.jsx";
import TokenizationMicroscopeLab from "../../artifact-25.jsx";
import EntityBoundaryStudioLab from "../../artifact-26.jsx";
import SemanticSpaceCartographerLab from "../../artifact-27.jsx";
import IntentCalibrationClinicLab from "../../artifact-28.jsx";
import BiasVariancePlaygroundLab from "../../artifact-29.jsx";
import FeatureEngineeringFoundryLab from "../../artifact-30.jsx";
import CrossValidationLab from "../../artifact-31.jsx";
import RegularizationPathLab from "../../artifact-32.jsx";
import DecisionTreeSplitLab from "../../artifact-33.jsx";
import KnnNeighborhoodLab from "../../artifact-34.jsx";
import ImbalancedLearningLab from "../../artifact-35.jsx";
import ModelDriftMonitorLab from "../../artifact-36.jsx";
import TensorShapeGymLab from "../../artifact-37.jsx";
import BackpropDebuggerLab from "../../artifact-38.jsx";
import ActivationArenaLab from "../../artifact-39.jsx";
import OptimizerRaceLab from "../../artifact-40.jsx";
import InitializationSignalLab from "../../artifact-41.jsx";
import AttentionMechanismLab from "../../artifact-42.jsx";
import AutoencoderLatentLab from "../../artifact-43.jsx";
import TrainingStabilityLab from "../../artifact-44.jsx";
import ConvolutionLensLab from "../../artifact-45.jsx";
import DetectionIouNmsLab from "../../artifact-46.jsx";
import ImageAugmentationLab from "../../artifact-47.jsx";
import SegmentationPixelLab from "../../artifact-48.jsx";
import VisionTransformerPatchLab from "../../artifact-49.jsx";
import ProbabilityDistributionLab from "../../artifact-50.jsx";
import BayesRuleLab from "../../artifact-51.jsx";
import HypothesisTestingLab from "../../artifact-52.jsx";
import ConfidenceIntervalLab from "../../artifact-53.jsx";
import SamplingBiasLab from "../../artifact-54.jsx";
import CorrelationCausationLab from "../../artifact-55.jsx";
import MarkovChainLab from "../../artifact-56.jsx";
import MonteCarloLab from "../../artifact-57.jsx";
import "../styles/LabsHub.css";

const PcaVarianceExplorerLab = React.lazy(() => import("../../artifact-58.jsx"));
const ClusteringWorkbenchLab = React.lazy(() => import("../../artifact-59.jsx"));
const SvmMarginLab = React.lazy(() => import("../../artifact-60.jsx"));
const EnsembleFusionLab = React.lazy(() => import("../../artifact-61.jsx"));
const GradientBoostingStageLab = React.lazy(() => import("../../artifact-62.jsx"));
const AnomalyDetectionRadarLab = React.lazy(() => import("../../artifact-63.jsx"));
const ProbabilityCalibrationLab = React.lazy(() => import("../../artifact-64.jsx"));
const FeatureSelectionTournamentLab = React.lazy(() => import("../../artifact-65.jsx"));
const HyperparameterSearchPlannerLab = React.lazy(() => import("../../artifact-66.jsx"));
const ModelExplainabilityLab = React.lazy(() => import("../../artifact-67.jsx"));
const CnnReceptiveFieldLab = React.lazy(() => import("../../artifact-68.jsx"));
const RnnSequenceMemoryLab = React.lazy(() => import("../../artifact-69.jsx"));
const LstmGateControlLab = React.lazy(() => import("../../artifact-70.jsx"));
const NormalizationDynamicsLab = React.lazy(() => import("../../artifact-71.jsx"));
const DropoutUncertaintyLab = React.lazy(() => import("../../artifact-72.jsx"));
const TransferLearningStrategyLab = React.lazy(() => import("../../artifact-73.jsx"));
const NeuralQuantizationLab = React.lazy(() => import("../../artifact-74.jsx"));
const NetworkPruningLab = React.lazy(() => import("../../artifact-75.jsx"));
const DistributedTrainingTopologyLab = React.lazy(() => import("../../artifact-76.jsx"));
const AdversarialRobustnessLab = React.lazy(() => import("../../artifact-77.jsx"));
const DecodingStrategyLab = React.lazy(() => import("../../artifact-78.jsx"));
const PromptVersioningLab = React.lazy(() => import("../../artifact-79.jsx"));
const ContextWindowBudgeterLab = React.lazy(() => import("../../artifact-80.jsx"));
const StructuredGenerationValidatorLab = React.lazy(() => import("../../artifact-81.jsx"));
const HallucinationEvaluationLab = React.lazy(() => import("../../artifact-82.jsx"));
const SyntheticDataFoundryLab = React.lazy(() => import("../../artifact-83.jsx"));
const LoraAdaptationLab = React.lazy(() => import("../../artifact-84.jsx"));
const MultimodalAlignmentLab = React.lazy(() => import("../../artifact-85.jsx"));
const DiffusionDenoisingLab = React.lazy(() => import("../../artifact-86.jsx"));
const GenerativeAiGuardrailLab = React.lazy(() => import("../../artifact-87.jsx"));
const QueryRewritingLab = React.lazy(() => import("../../artifact-88.jsx"));
const MetadataFilterWorkshopLab = React.lazy(() => import("../../artifact-89.jsx"));
const NeuralRerankerLab = React.lazy(() => import("../../artifact-90.jsx"));
const ContextCompressionLab = React.lazy(() => import("../../artifact-91.jsx"));
const CitationAlignmentLab = React.lazy(() => import("../../artifact-92.jsx"));
const MultiHopRetrievalLab = React.lazy(() => import("../../artifact-93.jsx"));
const RagFreshnessVersionLab = React.lazy(() => import("../../artifact-94.jsx"));
const RagEvaluationWorkbenchLab = React.lazy(() => import("../../artifact-95.jsx"));
const SemanticCacheLab = React.lazy(() => import("../../artifact-96.jsx"));
const RetrievalAccessControlLab = React.lazy(() => import("../../artifact-97.jsx"));
const ToolSchemaDesignLab = React.lazy(() => import("../../artifact-98.jsx"));
const AgentPlanningSearchLab = React.lazy(() => import("../../artifact-99.jsx"));
const AgentMemoryPolicyLab = React.lazy(() => import("../../artifact-100.jsx"));
const AgentHandoffProtocolLab = React.lazy(() => import("../../artifact-101.jsx"));
const AgentStateMachineLab = React.lazy(() => import("../../artifact-102.jsx"));
const AgentApprovalGateLab = React.lazy(() => import("../../artifact-103.jsx"));
const AgentRetryIdempotencyLab = React.lazy(() => import("../../artifact-104.jsx"));
const AgentBudgetControllerLab = React.lazy(() => import("../../artifact-105.jsx"));
const AgentTraceObservatoryLab = React.lazy(() => import("../../artifact-106.jsx"));
const AgentSandboxAuthorityLab = React.lazy(() => import("../../artifact-107.jsx"));
const ContainerResourcePlannerLab = React.lazy(() => import("../../artifact-108.jsx"));
const AutoscalingControlLab = React.lazy(() => import("../../artifact-109.jsx"));
const HealthProbeDesignerLab = React.lazy(() => import("../../artifact-110.jsx"));
const CanaryReleaseLab = React.lazy(() => import("../../artifact-111.jsx"));
const BlueGreenDeploymentLab = React.lazy(() => import("../../artifact-112.jsx"));
const SloErrorBudgetLab = React.lazy(() => import("../../artifact-113.jsx"));
const FourSignalsObservatoryLab = React.lazy(() => import("../../artifact-114.jsx"));
const IncidentCommandSimulatorLab = React.lazy(() => import("../../artifact-115.jsx"));
const ChaosExperimentLab = React.lazy(() => import("../../artifact-116.jsx"));
const FeatureFlagLifecycleLab = React.lazy(() => import("../../artifact-117.jsx"));
const CiQualityGateLab = React.lazy(() => import("../../artifact-118.jsx"));
const TestPyramidPlannerLab = React.lazy(() => import("../../artifact-119.jsx"));
const ApiContractTestingLab = React.lazy(() => import("../../artifact-120.jsx"));
const RateLimitingLab = React.lazy(() => import("../../artifact-121.jsx"));
const CacheArchitectureLab = React.lazy(() => import("../../artifact-122.jsx"));
const QueueBackpressureLab = React.lazy(() => import("../../artifact-123.jsx"));
const DatabaseMigrationSafetyLab = React.lazy(() => import("../../artifact-124.jsx"));
const SoftwareSupplyChainLab = React.lazy(() => import("../../artifact-125.jsx"));
const DistributedTracingLab = React.lazy(() => import("../../artifact-126.jsx"));
const CostPerformanceFinopsLab = React.lazy(() => import("../../artifact-127.jsx"));

const BUILTIN_LABS = [
  { id: "lab_retrieval_tuning", title: "Retrieval Lab — Tune the Pipeline", description: "Adjust chunking, retrieval, and reranking to see how the pipeline changes.", category: "RAG systems", kind: "html", src: "/labs/retrieval-lab.html" },
  { id: "lab_enterprise_ai_agents", title: "Enterprise AI Agent Problems", description: "Explore production AI scenarios and choose the right response.", category: "Agent systems", kind: "html", src: "/labs/enterprise-ai-agent-problems.html" },
  { id: "lab_chunking_bench", title: "Chunking Bench — How RAG Cuts, Embeds and Retrieves a Document", description: "Compare chunking strategies against the same source document.", category: "RAG systems", kind: "html", src: "/labs/chunking-bench.html" },
  { id: "lab_token_cost", title: "Token Cost Lab — Beat the Bill", description: "Simulate token spend and make tradeoffs that lower the bill.", category: "Optimization", kind: "html", src: "/labs/token-cost-lab.html" },
  { id: "lab_agent_anatomy", title: "Agent Anatomy Lab", description: "Build an agent one stage at a time and understand each decision.", category: "Agent systems", kind: "html", src: "/labs/agent-anatomy-lab.html" },
  { id: "lab_machine_reads_sentence", title: "How a Machine Reads a Sentence", description: "Follow one sentence through tokens, IDs, embeddings, attention, and the next-token pick.", category: "NLP systems", kind: "html", src: "/labs/machine-reads-a-sentence.html" },
  { id: "lab_agent_bottlenecks", title: "20 AI Agent Bottlenecks, Live", description: "Run agent failure and recovery simulations.", category: "Agent systems", kind: "react", component: AgentBottlenecksLab },
  { id: "lab_eval_forge", title: "Eval Forge — Stop Vibe Testing", description: "Design an eval suite that catches hidden regressions.", category: "Evaluation", kind: "react", component: EvalForgeLab },
  { id: "lab_context_architect", title: "Context Architect — Pack the Perfect Context", description: "Curate useful context inside a finite token budget.", category: "Optimization", kind: "react", component: ContextArchitectLab },
  { id: "lab_security_arena", title: "Agent Security Arena — Defend the Toolchain", description: "Defend agents against hijacking and excessive authority.", category: "Safety", kind: "react", component: AgentSecurityArenaLab },
  { id: "lab_memory_garden", title: "Memory Garden — What Should the Agent Remember?", description: "Design useful, private, and revisable agent memory.", category: "Agent systems", kind: "react", component: MemoryGardenLab },
  { id: "lab_tool_flight_school", title: "Tool Calling Flight School", description: "Design reliable schemas, calls, and outcomes.", category: "Agent systems", kind: "react", component: ToolCallingFlightSchoolLab },
  { id: "lab_human_control", title: "Human-in-the-Loop Control Room", description: "Place approval gates around consequential actions.", category: "Safety", kind: "react", component: HumanControlRoomLab },
  { id: "lab_multi_agent", title: "Multi-Agent Mission Control", description: "Coordinate parallel agents and explicit handoffs.", category: "Agent systems", kind: "react", component: MultiAgentMissionControlLab },
  { id: "lab_mcp_permissions", title: "MCP Permission Workshop", description: "Scope connectors, resources, and server trust.", category: "Safety", kind: "react", component: McpPermissionWorkshopLab },
  { id: "lab_trace_detective", title: "Trace Detective — Debug an Agent Run", description: "Find root causes across traces and outcomes.", category: "Evaluation", kind: "react", component: TraceDetectiveLab },
  { id: "lab_structured_repair", title: "Structured Output Repair Shop", description: "Validate and repair machine-readable output.", category: "Evaluation", kind: "react", component: StructuredOutputRepairLab },
  { id: "lab_model_router", title: "Model Router — Right Model, Right Task", description: "Route by complexity, modality, risk, and cost.", category: "Optimization", kind: "react", component: ModelRouterLab },
  { id: "lab_grounding_court", title: "Grounding Court — Claim, Evidence, Verdict", description: "Judge claim-level evidence and citations.", category: "RAG systems", kind: "react", component: GroundingCourtLab },
  { id: "lab_uncertainty", title: "Agent Uncertainty Lab", description: "Calibrate when to answer, verify, ask, or abstain.", category: "Evaluation", kind: "react", component: AgentUncertaintyLab },
  { id: "lab_prompt_cache", title: "Prompt Cache Workshop", description: "Structure stable prefixes and safe invalidation.", category: "Optimization", kind: "react", component: PromptCacheWorkshopLab },
  { id: "lab_technique_chooser", title: "Fine-Tune, RAG, Prompt, or Tool?", description: "Choose the right AI adaptation strategy.", category: "Strategy", kind: "react", component: TechniqueChooserLab },
  { id: "lab_retrieval_observatory", title: "Retrieval Observatory — Find What RAG Missed", description: "Diagnose hybrid retrieval, reranking, context precision, and recall.", category: "RAG systems", kind: "react", component: RetrievalObservatoryLab },
  { id: "lab_graphrag_atlas", title: "GraphRAG Atlas — Navigate Connected Evidence", description: "Compare local, global, and DRIFT-style graph retrieval.", category: "RAG systems", kind: "react", component: GraphRagAtlasLab },
  { id: "lab_plan_repair", title: "Plan Repair Studio — Adapt Without Wandering", description: "Inject disruptions and repair an agent plan from observed state.", category: "Agent systems", kind: "react", component: PlanRepairStudioLab },
  { id: "lab_durable_agent_ops", title: "Durable Agent Ops — Crash, Resume, Recover", description: "Practice checkpoints, interrupts, idempotency, and safe replay.", category: "Agent systems", kind: "react", component: DurableAgentOpsLab },
  { id: "lab_tokenization_microscope", title: "Tokenization Microscope — See Every Subword", description: "Compare normalization, subword algorithms, vocabulary size, and fragmentation.", category: "NLP systems", kind: "react", component: TokenizationMicroscopeLab },
  { id: "lab_entity_boundary", title: "Entity Boundary Studio — Tag the Exact Span", description: "Tune BIO tagging, entity confidence, boundaries, precision, and recall.", category: "NLP systems", kind: "react", component: EntityBoundaryStudioLab },
  { id: "lab_semantic_cartographer", title: "Semantic Space Cartographer — Map Meaning", description: "Explore sentence embeddings, cosine similarity, and hard negatives.", category: "NLP systems", kind: "react", component: SemanticSpaceCartographerLab },
  { id: "lab_intent_calibration", title: "Intent Calibration Clinic — Treat Hidden Errors", description: "Tune thresholds, calibration, abstention, and classification failure slices.", category: "NLP systems", kind: "react", component: IntentCalibrationClinicLab },
  { id: "lab_bias_variance", title: "Bias–Variance Playground", description: "Balance underfitting, variance, data size, and label noise.", category: "Machine learning", kind: "react", component: BiasVariancePlaygroundLab },
  { id: "lab_feature_foundry", title: "Feature Engineering Foundry", description: "Transform, encode, and audit tabular features.", category: "Machine learning", kind: "react", component: FeatureEngineeringFoundryLab },
  { id: "lab_cross_validation", title: "Cross-Validation Lab", description: "Design folds that match the deployment boundary.", category: "Machine learning", kind: "react", component: CrossValidationLab },
  { id: "lab_regularization_path", title: "Regularization Path Explorer", description: "Explore L1/L2 shrinkage and sparse solutions.", category: "Machine learning", kind: "react", component: RegularizationPathLab },
  { id: "lab_tree_split", title: "Decision Tree Split Simulator", description: "Grow, inspect, and prune decision trees.", category: "Machine learning", kind: "react", component: DecisionTreeSplitLab },
  { id: "lab_knn_neighborhood", title: "KNN Neighborhood Explorer", description: "Inspect neighborhoods, scaling, and local boundaries.", category: "Machine learning", kind: "react", component: KnnNeighborhoodLab },
  { id: "lab_imbalance_triage", title: "Imbalanced Learning Triage", description: "Tune cost-aware thresholds for rare classes.", category: "Machine learning", kind: "react", component: ImbalancedLearningLab },
  { id: "lab_drift_monitor", title: "Model Drift Monitor", description: "Detect data and performance drift over time.", category: "Machine learning", kind: "react", component: ModelDriftMonitorLab },
  { id: "lab_tensor_shape", title: "Tensor Shape Gym", description: "Practice tensor axes, broadcasting, and shape flow.", category: "Deep learning", kind: "react", component: TensorShapeGymLab },
  { id: "lab_backprop_debugger", title: "Backpropagation Debugger", description: "Trace gradients and repair broken computation graphs.", category: "Deep learning", kind: "react", component: BackpropDebuggerLab },
  { id: "lab_activation_arena", title: "Activation Function Arena", description: "Compare saturation, sparsity, and gradient flow.", category: "Deep learning", kind: "react", component: ActivationArenaLab },
  { id: "lab_optimizer_race", title: "Optimizer Race Track", description: "Compare optimizer dynamics under equal budgets.", category: "Deep learning", kind: "react", component: OptimizerRaceLab },
  { id: "lab_initialization_signal", title: "Initialization Signal Lab", description: "Preserve activation and gradient scale across depth.", category: "Deep learning", kind: "react", component: InitializationSignalLab },
  { id: "lab_attention_mechanism", title: "Attention Mechanism Lab", description: "Inspect masks, heads, temperature, and context.", category: "Deep learning", kind: "react", component: AttentionMechanismLab },
  { id: "lab_autoencoder_latent", title: "Autoencoder Latent Space Lab", description: "Explore reconstruction pressure and latent geometry.", category: "Deep learning", kind: "react", component: AutoencoderLatentLab },
  { id: "lab_training_stability", title: "Training Stability Control Room", description: "Control clipping, warmup, normalization, and recovery.", category: "Deep learning", kind: "react", component: TrainingStabilityLab },
  { id: "lab_convolution_lens", title: "Convolution Lens", description: "Explore kernels, stride, edges, and feature maps.", category: "Computer vision", kind: "react", component: ConvolutionLensLab },
  { id: "lab_detection_iou", title: "Detection IoU & NMS Arena", description: "Tune box matching and duplicate suppression.", category: "Computer vision", kind: "react", component: DetectionIouNmsLab },
  { id: "lab_augmentation_lab", title: "Image Augmentation Lab", description: "Build label-safe visual augmentation policies.", category: "Computer vision", kind: "react", component: ImageAugmentationLab },
  { id: "lab_segmentation_pixel", title: "Segmentation Pixel Lab", description: "Measure masks, boundaries, and class imbalance.", category: "Computer vision", kind: "react", component: SegmentationPixelLab },
  { id: "lab_vit_patch", title: "Vision Transformer Patch Lab", description: "Explore patch granularity and visual token budgets.", category: "Computer vision", kind: "react", component: VisionTransformerPatchLab },
  { id: "lab_distribution_explorer", title: "Probability Distribution Explorer", description: "Explore location, spread, shape, and tail risk.", category: "Statistics & probability", kind: "react", component: ProbabilityDistributionLab },
  { id: "lab_bayes_rule", title: "Bayes Rule Evidence Lab", description: "Update priors with evidence and base rates.", category: "Statistics & probability", kind: "react", component: BayesRuleLab },
  { id: "lab_hypothesis_court", title: "Hypothesis Testing Court", description: "Study power, errors, effect size, and significance.", category: "Statistics & probability", kind: "react", component: HypothesisTestingLab },
  { id: "lab_confidence_factory", title: "Confidence Interval Factory", description: "Build and interpret interval estimation procedures.", category: "Statistics & probability", kind: "react", component: ConfidenceIntervalLab },
  { id: "lab_sampling_bias", title: "Sampling Bias Simulator", description: "Expose coverage, response, and selection bias.", category: "Statistics & probability", kind: "react", component: SamplingBiasLab },
  { id: "lab_causation_lab", title: "Correlation vs Causation Lab", description: "Separate association from causal identification.", category: "Statistics & probability", kind: "react", component: CorrelationCausationLab },
  { id: "lab_markov_chain", title: "Markov Chain State Lab", description: "Simulate transitions, mixing, and steady states.", category: "Statistics & probability", kind: "react", component: MarkovChainLab },
  { id: "lab_monte_carlo", title: "Monte Carlo Experiment Lab", description: "Estimate uncertainty through repeated simulation.", category: "Statistics & probability", kind: "react", component: MonteCarloLab },
  { id: "lab_pca_variance", title: "PCA Variance Explorer", description: "Scale before PCA. Variance is not usefulness.", category: "Machine learning", kind: "react", component: PcaVarianceExplorerLab },
  { id: "lab_clustering_workbench", title: "Clustering Workbench", description: "Cluster assumptions differ. Validate stability.", category: "Machine learning", kind: "react", component: ClusteringWorkbenchLab },
  { id: "lab_svm_margin", title: "SVM Margin Lab", description: "Margins trade fit for robustness. Kernels reshape geometry.", category: "Machine learning", kind: "react", component: SvmMarginLab },
  { id: "lab_ensemble_fusion", title: "Ensemble Fusion Studio", description: "Diversity creates value. Blend out-of-fold.", category: "Machine learning", kind: "react", component: EnsembleFusionLab },
  { id: "lab_gradient_boosting", title: "Gradient Boosting Stage Lab", description: "Boost residual structure. Rate and rounds interact.", category: "Machine learning", kind: "react", component: GradientBoostingStageLab },
  { id: "lab_anomaly_detection", title: "Anomaly Detection Radar", description: "Define abnormal operationally. Threshold by response capacity.", category: "Machine learning", kind: "react", component: AnomalyDetectionRadarLab },
  { id: "lab_calibration_curve", title: "Probability Calibration Lab", description: "Rank and calibration differ. Calibrate on held-out data.", category: "Machine learning", kind: "react", component: ProbabilityCalibrationLab },
  { id: "lab_feature_selection", title: "Feature Selection Tournament", description: "Select inside the pipeline. Stability matters.", category: "Machine learning", kind: "react", component: FeatureSelectionTournamentLab },
  { id: "lab_hyperparameter_search", title: "Hyperparameter Search Planner", description: "Separate search from test. Use informed spaces.", category: "Machine learning", kind: "react", component: HyperparameterSearchPlannerLab },
  { id: "lab_model_explainability", title: "Model Explainability Lab", description: "Explain the question first. Compare methods.", category: "Machine learning", kind: "react", component: ModelExplainabilityLab },
  { id: "lab_cnn_receptive_field", title: "CNN Receptive Field Lab", description: "Track effective context. Resolution and context trade.", category: "Deep learning", kind: "react", component: CnnReceptiveFieldLab },
  { id: "lab_rnn_sequence", title: "RNN Sequence Memory Lab", description: "State compresses history. Length changes difficulty.", category: "Deep learning", kind: "react", component: RnnSequenceMemoryLab },
  { id: "lab_lstm_gates", title: "LSTM Gate Control Lab", description: "Gates route memory. Bias initialization matters.", category: "Deep learning", kind: "react", component: LstmGateControlLab },
  { id: "lab_normalization_dynamics", title: "Normalization Dynamics Lab", description: "Know the statistic axis. Small batches need care.", category: "Deep learning", kind: "react", component: NormalizationDynamicsLab },
  { id: "lab_dropout_uncertainty", title: "Dropout & Uncertainty Lab", description: "Dropout regularizes paths. Uncertainty needs calibration.", category: "Deep learning", kind: "react", component: DropoutUncertaintyLab },
  { id: "lab_transfer_learning", title: "Transfer Learning Strategy Lab", description: "Transfer depends on similarity. Unfreeze gradually.", category: "Deep learning", kind: "react", component: TransferLearningStrategyLab },
  { id: "lab_quantization_tradeoff", title: "Neural Quantization Lab", description: "Measure hardware latency. Calibrate representative data.", category: "Deep learning", kind: "react", component: NeuralQuantizationLab },
  { id: "lab_network_pruning", title: "Network Pruning Lab", description: "Sparsity needs hardware support. Prune and recover.", category: "Deep learning", kind: "react", component: NetworkPruningLab },
  { id: "lab_distributed_training", title: "Distributed Training Topology Lab", description: "Scale efficiency, not workers. Overlap communication.", category: "Deep learning", kind: "react", component: DistributedTrainingTopologyLab },
  { id: "lab_adversarial_robustness", title: "Adversarial Robustness Arena", description: "State the attacker model. Evaluate adaptive attacks.", category: "Deep learning", kind: "react", component: AdversarialRobustnessLab },
  { id: "lab_decoding_strategies", title: "Decoding Strategy Arena", description: "Decoding changes behavior. Tune by task.", category: "Generative AI", kind: "react", component: DecodingStrategyLab },
  { id: "lab_prompt_versioning", title: "Prompt Versioning Lab", description: "Version prompts as code. Test behavioral contracts.", category: "Generative AI", kind: "react", component: PromptVersioningLab },
  { id: "lab_context_budget", title: "Context Window Budgeter", description: "Budget by information value. Protect critical instructions.", category: "Generative AI", kind: "react", component: ContextWindowBudgeterLab },
  { id: "lab_structured_generation", title: "Structured Generation Validator", description: "Validate semantics too. Bound repair loops.", category: "Generative AI", kind: "react", component: StructuredGenerationValidatorLab },
  { id: "lab_hallucination_eval", title: "Hallucination Evaluation Lab", description: "Evaluate claim by claim. Separate correctness and grounding.", category: "Generative AI", kind: "react", component: HallucinationEvaluationLab },
  { id: "lab_synthetic_data", title: "Synthetic Data Foundry", description: "Measure novelty. Keep real validation.", category: "Generative AI", kind: "react", component: SyntheticDataFoundryLab },
  { id: "lab_lora_adaptation", title: "LoRA Adaptation Lab", description: "Adapters trade capacity for cost. Track base compatibility.", category: "Generative AI", kind: "react", component: LoraAdaptationLab },
  { id: "lab_multimodal_alignment", title: "Multimodal Alignment Lab", description: "Test modality ablations. Align at the right level.", category: "Generative AI", kind: "react", component: MultimodalAlignmentLab },
  { id: "lab_diffusion_denoising", title: "Diffusion Denoising Lab", description: "Sampling is iterative. Guidance trades diversity.", category: "Generative AI", kind: "react", component: DiffusionDenoisingLab },
  { id: "lab_genai_guardrails", title: "Generative AI Guardrail Lab", description: "Layer controls. Test evasions.", category: "Generative AI", kind: "react", component: GenerativeAiGuardrailLab },
  { id: "lab_query_rewriting", title: "Query Rewriting Lab", description: "Preserve user intent. Compare original retrieval.", category: "RAG systems", kind: "react", component: QueryRewritingLab },
  { id: "lab_metadata_filtering", title: "Metadata Filter Workshop", description: "Metadata is retrieval logic. Plan empty-result fallback.", category: "RAG systems", kind: "react", component: MetadataFilterWorkshopLab },
  { id: "lab_reranker_lab", title: "Neural Reranker Lab", description: "Recall before reranking. Measure stage metrics.", category: "RAG systems", kind: "react", component: NeuralRerankerLab },
  { id: "lab_context_compression", title: "Context Compression Lab", description: "Preserve entailment. Track removed claims.", category: "RAG systems", kind: "react", component: ContextCompressionLab },
  { id: "lab_citation_alignment", title: "Citation Alignment Studio", description: "Cite at claim level. Relevance is not entailment.", category: "RAG systems", kind: "react", component: CitationAlignmentLab },
  { id: "lab_multihop_retrieval", title: "Multi-Hop Retrieval Planner", description: "Track hop provenance. Stop on sufficient evidence.", category: "RAG systems", kind: "react", component: MultiHopRetrievalLab },
  { id: "lab_freshness_versioning", title: "RAG Freshness & Version Lab", description: "Freshness is query-dependent. Store effective dates.", category: "RAG systems", kind: "react", component: RagFreshnessVersionLab },
  { id: "lab_rag_evaluation", title: "RAG Evaluation Workbench", description: "Evaluate stages separately. Use real failure slices.", category: "RAG systems", kind: "react", component: RagEvaluationWorkbenchLab },
  { id: "lab_semantic_cache", title: "Semantic Cache Lab", description: "Cache semantics carefully. Key all answer dependencies.", category: "RAG systems", kind: "react", component: SemanticCacheLab },
  { id: "lab_retrieval_acl", title: "Retrieval Access-Control Lab", description: "Filter before exposure. Propagate identity end to end.", category: "RAG systems", kind: "react", component: RetrievalAccessControlLab },
  { id: "lab_tool_schema_design", title: "Tool Schema Design Lab", description: "Schemas are interfaces. Constrain consequential fields.", category: "Agent systems", kind: "react", component: ToolSchemaDesignLab },
  { id: "lab_agent_planning", title: "Agent Planning Search Lab", description: "Plans are hypotheses. Observe before replanning.", category: "Agent systems", kind: "react", component: AgentPlanningSearchLab },
  { id: "lab_memory_policy", title: "Agent Memory Policy Lab", description: "Memory needs policy. Make revision possible.", category: "Agent systems", kind: "react", component: AgentMemoryPolicyLab },
  { id: "lab_agent_handoff", title: "Agent Handoff Protocol Lab", description: "Handoffs are contracts. Transfer state explicitly.", category: "Agent systems", kind: "react", component: AgentHandoffProtocolLab },
  { id: "lab_agent_state_machine", title: "Agent State Machine Lab", description: "Make states explicit. Guard side effects.", category: "Agent systems", kind: "react", component: AgentStateMachineLab },
  { id: "lab_approval_gates", title: "Agent Approval Gate Lab", description: "Show the proposed action. Fail closed for consequence.", category: "Agent systems", kind: "react", component: AgentApprovalGateLab },
  { id: "lab_agent_retries", title: "Agent Retry & Idempotency Lab", description: "Classify retryable errors. Key side effects.", category: "Agent systems", kind: "react", component: AgentRetryIdempotencyLab },
  { id: "lab_agent_budget", title: "Agent Budget Controller", description: "Allocate budget by stage. Reserve for verification.", category: "Agent systems", kind: "react", component: AgentBudgetControllerLab },
  { id: "lab_agent_observability", title: "Agent Trace Observatory", description: "Trace state transitions. Redact at collection.", category: "Agent systems", kind: "react", component: AgentTraceObservatoryLab },
  { id: "lab_agent_sandbox", title: "Agent Sandbox & Authority Lab", description: "Least authority by default. Separate data and instructions.", category: "Agent systems", kind: "react", component: AgentSandboxAuthorityLab },
  { id: "lab_container_resources", title: "Container Resource Planner", description: "Requests drive scheduling. Limits shape failure.", category: "Production engineering", kind: "react", component: ContainerResourcePlannerLab },
  { id: "lab_autoscaling", title: "Autoscaling Control Lab", description: "Scale on causal signals. Model startup time.", category: "Production engineering", kind: "react", component: AutoscalingControlLab },
  { id: "lab_health_probes", title: "Health Probe Designer", description: "Probes answer different questions. Avoid cascading restarts.", category: "Production engineering", kind: "react", component: HealthProbeDesignerLab },
  { id: "lab_canary_release", title: "Canary Release Simulator", description: "Canary by risk slice. Predefine rollback.", category: "Production engineering", kind: "react", component: CanaryReleaseLab },
  { id: "lab_blue_green", title: "Blue–Green Deployment Lab", description: "Test production topology. Plan data compatibility.", category: "Production engineering", kind: "react", component: BlueGreenDeploymentLab },
  { id: "lab_slo_budget", title: "SLO & Error Budget Lab", description: "Measure user outcomes. Use burn rates.", category: "Production engineering", kind: "react", component: SloErrorBudgetLab },
  { id: "lab_observability_signals", title: "Four Signals Observatory", description: "Monitor symptoms first. Correlate signals.", category: "Production engineering", kind: "react", component: FourSignalsObservatoryLab },
  { id: "lab_incident_response", title: "Incident Command Simulator", description: "Assign clear roles. Mitigate before perfection.", category: "Production engineering", kind: "react", component: IncidentCommandSimulatorLab },
  { id: "lab_chaos_testing", title: "Chaos Experiment Lab", description: "Start with a steady state. Limit blast radius.", category: "Production engineering", kind: "react", component: ChaosExperimentLab },
  { id: "lab_feature_flags", title: "Feature Flag Lifecycle Lab", description: "Flags need owners. Test both branches.", category: "Production engineering", kind: "react", component: FeatureFlagLifecycleLab },
  { id: "lab_ci_quality_gates", title: "CI Quality Gate Lab", description: "Fast feedback first. Quarantine flakes visibly.", category: "Production engineering", kind: "react", component: CiQualityGateLab },
  { id: "lab_test_pyramid", title: "Test Pyramid Planner", description: "Test at the cheapest useful layer. Keep contracts real.", category: "Production engineering", kind: "react", component: TestPyramidPlannerLab },
  { id: "lab_contract_testing", title: "API Contract Testing Lab", description: "Contracts capture usage. Test compatibility before deploy.", category: "Production engineering", kind: "react", component: ApiContractTestingLab },
  { id: "lab_rate_limiting", title: "Rate Limiting Lab", description: "Limit by scarce resource. Return retry guidance.", category: "Production engineering", kind: "react", component: RateLimitingLab },
  { id: "lab_cache_architecture", title: "Cache Architecture Lab", description: "Cache correctness first. Design stampede control.", category: "Production engineering", kind: "react", component: CacheArchitectureLab },
  { id: "lab_queue_backpressure", title: "Queue & Backpressure Lab", description: "Bound queues. Propagate pressure.", category: "Production engineering", kind: "react", component: QueueBackpressureLab },
  { id: "lab_database_migration", title: "Database Migration Safety Lab", description: "Keep versions compatible. Throttle backfills.", category: "Production engineering", kind: "react", component: DatabaseMigrationSafetyLab },
  { id: "lab_supply_chain", title: "Software Supply-Chain Lab", description: "Pin and verify inputs. Generate provenance.", category: "Production engineering", kind: "react", component: SoftwareSupplyChainLab },
  { id: "lab_distributed_tracing", title: "Distributed Tracing Lab", description: "Propagate context everywhere. Sample intelligently.", category: "Production engineering", kind: "react", component: DistributedTracingLab },
  { id: "lab_cost_performance", title: "Cost–Performance FinOps Lab", description: "Optimize unit economics. Include quality constraints.", category: "Production engineering", kind: "react", component: CostPerformanceFinopsLab },
  ...DATA_SCIENCE_LABS,
  { id: "lab_python_variables", title: "Python · Variables", description: "Put a label on a box, store a value, then replace it when your program learns something new.", category: "Python", kind: "html", src: "/labs/python/artifacts/01-variables.html" },
  { id: "lab_python_data_types", title: "Python · Data Types", description: "A scanner identifies what kind of value entered the program so Python knows what operations make sense.", category: "Python", kind: "html", src: "/labs/python/artifacts/02-data-types.html" },
  { id: "lab_python_strings", title: "Python · Strings", description: "Text is a ribbon of characters: inspect it, join it, repeat it, or cut out a slice.", category: "Python", kind: "html", src: "/labs/python/artifacts/03-strings.html" },
  { id: "lab_python_lists", title: "Python · Lists", description: "A list is a train whose ordered carriages can be added, removed, replaced, and inspected.", category: "Python", kind: "html", src: "/labs/python/artifacts/04-lists.html" },
  { id: "lab_python_tuples", title: "Python · Tuples", description: "A tuple seals an ordered collection so its positions stay dependable after creation.", category: "Python", kind: "html", src: "/labs/python/artifacts/05-tuples.html" },
  { id: "lab_python_dictionaries", title: "Python · Dictionaries", description: "A dictionary connects unique keys to values like named addresses leading to buildings.", category: "Python", kind: "html", src: "/labs/python/artifacts/06-dictionaries.html" },
  { id: "lab_python_sets", title: "Python · Sets", description: "A set keeps only unique items and makes overlap, difference, and membership easy to see.", category: "Python", kind: "html", src: "/labs/python/artifacts/07-sets.html" },
  { id: "lab_python_booleans", title: "Python · Booleans", description: "A Boolean is a two-state signal: True lets current pass and False closes the gate.", category: "Python", kind: "html", src: "/labs/python/artifacts/08-booleans.html" },
  { id: "lab_python_comparisons", title: "Python · Comparisons", description: "Comparison operators place values on a balance and report a Boolean result.", category: "Python", kind: "html", src: "/labs/python/artifacts/09-comparisons.html" },
  { id: "lab_python_conditionals", title: "Python · Conditionals", description: "if, elif, and else open exactly one route based on conditions checked from top to bottom.", category: "Python", kind: "html", src: "/labs/python/artifacts/10-conditionals.html" },
  { id: "lab_python_for_loops", title: "Python · For Loops", description: "A for loop visits each item on a conveyor and performs the same clear job once per item.", category: "Python", kind: "html", src: "/labs/python/artifacts/11-for-loops.html" },
  { id: "lab_python_while_loops", title: "Python · While Loops", description: "A while loop keeps orbiting while its condition remains True, so its state must move toward a stop.", category: "Python", kind: "html", src: "/labs/python/artifacts/12-while-loops.html" },
  { id: "lab_python_range", title: "Python · The range() Function", description: "range produces a predictable stream of integers using start, stop, and step settings.", category: "Python", kind: "html", src: "/labs/python/artifacts/13-range.html" },
  { id: "lab_python_functions", title: "Python · Functions", description: "A function packages instructions into a named machine you can run whenever the job is needed.", category: "Python", kind: "html", src: "/labs/python/artifacts/14-functions.html" },
  { id: "lab_python_parameters", title: "Python · Parameters and Arguments", description: "Parameters are labeled mail slots; arguments are the actual packages delivered during a call.", category: "Python", kind: "html", src: "/labs/python/artifacts/15-parameters.html" },
  { id: "lab_python_return_values", title: "Python · Return Values", description: "return sends a result out of a function so the caller can store, combine, or display it.", category: "Python", kind: "html", src: "/labs/python/artifacts/16-return-values.html" },
  { id: "lab_python_scope", title: "Python · Variable Scope", description: "Names live on different floors: local rooms are private to a function, while global names live outside.", category: "Python", kind: "html", src: "/labs/python/artifacts/17-scope.html" },
  { id: "lab_python_lambda", title: "Python · Lambda Functions", description: "A lambda is a tiny unnamed function for one expression, useful when another tool needs quick behavior.", category: "Python", kind: "html", src: "/labs/python/artifacts/18-lambda.html" },
  { id: "lab_python_comprehensions", title: "Python · List Comprehensions", description: "A comprehension grows a new list by transforming each seed and optionally filtering what gets planted.", category: "Python", kind: "html", src: "/labs/python/artifacts/19-comprehensions.html" },
  { id: "lab_python_generators", title: "Python · Generators", description: "A generator produces one value only when requested, saving memory like energy made on demand.", category: "Python", kind: "html", src: "/labs/python/artifacts/20-generators.html" },
  { id: "lab_python_iterators", title: "Python · Iterators", description: "An iterator remembers its position and hands over the next value each time next is called.", category: "Python", kind: "html", src: "/labs/python/artifacts/21-iterators.html" },
  { id: "lab_python_exceptions", title: "Python · Exceptions", description: "try protects risky work; except catches a known problem and guides the program to a safe response.", category: "Python", kind: "html", src: "/labs/python/artifacts/22-exceptions.html" },
  { id: "lab_python_files", title: "Python · Reading and Writing Files", description: "A file handle checks a document in, lets Python read or write it, and should always be closed safely.", category: "Python", kind: "html", src: "/labs/python/artifacts/23-files.html" },
  { id: "lab_python_context_managers", title: "Python · Context Managers", description: "A context manager opens a resource, lets work happen safely, and guarantees cleanup when the block ends.", category: "Python", kind: "html", src: "/labs/python/artifacts/24-context-managers.html" },
  { id: "lab_python_modules", title: "Python · Modules", description: "A module is a Python file whose related names form a reusable constellation for other programs.", category: "Python", kind: "html", src: "/labs/python/artifacts/25-modules.html" },
  { id: "lab_python_imports", title: "Python · Imports", description: "Imports bring selected tools from another module into your program, like cargo unloaded at a named port.", category: "Python", kind: "html", src: "/labs/python/artifacts/26-imports.html" },
  { id: "lab_python_classes", title: "Python · Classes", description: "A class is a blueprint describing the data and behavior each future object should receive.", category: "Python", kind: "html", src: "/labs/python/artifacts/27-classes.html" },
  { id: "lab_python_objects", title: "Python · Objects", description: "An object is one working creation built from a class, with its own state and shared methods.", category: "Python", kind: "html", src: "/labs/python/artifacts/28-objects.html" },
  { id: "lab_python_inheritance", title: "Python · Inheritance", description: "A child class starts with a parent's features and can add or replace behavior of its own.", category: "Python", kind: "html", src: "/labs/python/artifacts/29-inheritance.html" },
  { id: "lab_python_polymorphism", title: "Python · Polymorphism", description: "Different objects can answer the same method call in their own way, so callers use one shared interface.", category: "Python", kind: "html", src: "/labs/python/artifacts/30-polymorphism.html" },
  { id: "lab_python_encapsulation", title: "Python · Encapsulation", description: "Encapsulation keeps state and the rules for changing it together behind a small, safe interface.", category: "Python", kind: "html", src: "/labs/python/artifacts/31-encapsulation.html" },
  { id: "lab_python_dataclasses", title: "Python · Data Classes", description: "A data class quickly stamps out clear record-like classes with generated setup and display methods.", category: "Python", kind: "html", src: "/labs/python/artifacts/32-dataclasses.html" },
  { id: "lab_python_decorators", title: "Python · Decorators", description: "A decorator wraps a function with extra behavior without rewriting the original function body.", category: "Python", kind: "html", src: "/labs/python/artifacts/33-decorators.html" },
  { id: "lab_python_recursion", title: "Python · Recursion", description: "A recursive function solves a smaller version of its own problem until it reaches a simple base case.", category: "Python", kind: "html", src: "/labs/python/artifacts/34-recursion.html" },
  { id: "lab_python_sorting", title: "Python · Sorting", description: "Sorting arranges values into an order; a key can say which feature controls the finish positions.", category: "Python", kind: "html", src: "/labs/python/artifacts/35-sorting.html" },
  { id: "lab_python_searching", title: "Python · Searching", description: "Searching checks candidate locations until a wanted value is found or every useful place is exhausted.", category: "Python", kind: "html", src: "/labs/python/artifacts/36-searching.html" },
  { id: "lab_python_slicing", title: "Python · Sequence Slicing", description: "A slice selects a new portion using start, stop, and step—like choosing layers without changing the loaf.", category: "Python", kind: "html", src: "/labs/python/artifacts/37-slicing.html" },
  { id: "lab_python_unpacking", title: "Python · Sequence Unpacking", description: "Unpacking sends sequence values into matching names in one readable move.", category: "Python", kind: "html", src: "/labs/python/artifacts/38-unpacking.html" },
  { id: "lab_python_args_kwargs", title: "Python · *args and **kwargs", description: "*args gathers extra positional inputs; **kwargs gathers extra named inputs into separate channels.", category: "Python", kind: "html", src: "/labs/python/artifacts/39-args-kwargs.html" },
  { id: "lab_python_enumerate", title: "Python · The enumerate() Function", description: "enumerate pairs every item with a counter so you never need to manage the number by hand.", category: "Python", kind: "html", src: "/labs/python/artifacts/40-enumerate.html" },
  { id: "lab_python_zip", title: "Python · The zip() Function", description: "zip joins items from parallel sequences into pairs, stopping when the shortest side runs out.", category: "Python", kind: "html", src: "/labs/python/artifacts/41-zip.html" },
  { id: "lab_python_map_filter_reduce", title: "Python · Map, Filter, and Reduce", description: "Map transforms, filter selects, and reduce combines—three different stations for processing a stream.", category: "Python", kind: "html", src: "/labs/python/artifacts/42-map-filter-reduce.html" },
  { id: "lab_python_any_all", title: "Python · any() and all()", description: "any turns on when at least one signal is True; all turns on only when every signal is True.", category: "Python", kind: "html", src: "/labs/python/artifacts/43-any-all.html" },
  { id: "lab_python_f_strings", title: "Python · Formatted String Literals", description: "An f-string places live expressions inside braces to build readable text without awkward joining.", category: "Python", kind: "html", src: "/labs/python/artifacts/44-f-strings.html" },
  { id: "lab_python_datetime", title: "Python · Dates and Times", description: "datetime objects represent calendar moments and timedeltas measure safe journeys between them.", category: "Python", kind: "html", src: "/labs/python/artifacts/45-datetime.html" },
  { id: "lab_python_random", title: "Python · Randomness", description: "The random module makes pseudorandom choices—repeatable when a seed is set for experiments.", category: "Python", kind: "html", src: "/labs/python/artifacts/46-random.html" },
  { id: "lab_python_json", title: "Python · JSON Data", description: "JSON packs Python-style data into portable text and unpacks received text back into useful structures.", category: "Python", kind: "html", src: "/labs/python/artifacts/47-json.html" },
  { id: "lab_python_regex", title: "Python · Regular Expressions", description: "A regular expression describes a text pattern so clues can be found, validated, or replaced.", category: "Python", kind: "html", src: "/labs/python/artifacts/48-regex.html" },
  { id: "lab_python_async_await", title: "Python · Async and Await", description: "Async code lets one task wait without blocking the whole kitchen, so other work can progress meanwhile.", category: "Python", kind: "html", src: "/labs/python/artifacts/49-async-await.html" },
  { id: "lab_python_testing", title: "Python · Unit Testing", description: "A unit test gives one small piece of code a known input and checks that the actual result matches expectation.", category: "Python", kind: "html", src: "/labs/python/artifacts/50-testing.html" },
];

const EMPTY_EDITOR = { title: "", description: "", category: "Community lab", html_code: "" };

const LAB_PATHS = [
  { tag: "GenAI", label: "Generative AI", description: "Prompts, decoding, context, and model behavior.", icon: BrainCircuit, tone: "violet" },
  { tag: "Agents", label: "Agent systems", description: "Tools, memory, planning, handoffs, and control.", icon: Bot, tone: "cyan" },
  { tag: "RAG", label: "Retrieval & RAG", description: "Chunk, retrieve, rerank, ground, and evaluate.", icon: Database, tone: "blue" },
  { tag: "Evaluation", label: "Evals & safety", description: "Measure quality, trace failures, and reduce risk.", icon: ShieldCheck, tone: "rose" },
  { tag: "ML", label: "Machine learning", description: "Build intuition for models, data, and trade-offs.", icon: Gauge, tone: "amber" },
  { tag: "DevOps", label: "Production AI", description: "Deploy, observe, scale, and operate resilient systems.", icon: Activity, tone: "green" },
];

const FEATURED_LAB_IDS = [
  "lab_retrieval_observatory",
  "lab_agent_bottlenecks",
  "lab_eval_forge",
  "lab_context_architect",
];

function ReactLabFrame({ title, component: LabComponent, onReady }) {
  const frameRef = useRef(null);
  const [mountNode, setMountNode] = useState(null);
  return <iframe ref={frameRef} className="labs-hub-frame" title={title} srcDoc="<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><style>html,body,#lab-root{margin:0;width:100%;min-height:100%;background:#fafaf9}body{overflow:auto}</style></head><body><div id='lab-root'></div></body></html>" onLoad={() => { const doc = frameRef.current?.contentDocument; setMountNode(doc?.getElementById("lab-root") || null); onReady?.(); }}>{mountNode ? createPortal(<React.Suspense fallback={<div style={{ padding: 24, fontFamily: "system-ui" }}>Loading interactive lab…</div>}><LabComponent /></React.Suspense>, mountNode) : null}</iframe>;
}

function SharedLabEditor({ initialLab, onClose, onSave }) {
  const [values, setValues] = useState(initialLab || EMPTY_EDITOR);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const titleRef = useRef(null);
  useEffect(() => titleRef.current?.focus(), []);
  const update = (field, value) => setValues((current) => ({ ...current, [field]: value }));
  const uploadCode = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { setError("Upload a code file smaller than 1 MB."); return; }
    update("html_code", await file.text());
    if (!values.title) update("title", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!values.title.trim() || !values.html_code.trim()) { setError("A title and HTML code are required."); return; }
    setError(""); setIsSaving(true);
    try { await onSave({ title: values.title.trim(), description: values.description.trim(), category: values.category.trim() || "Community lab", html_code: values.html_code }); }
    catch (saveError) { setError(saveError.message || "Could not save this lab."); }
    finally { setIsSaving(false); }
  };
  return <div className="labs-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><form className="labs-editor" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="labs-editor-title"><header><div><span className="labs-home-kicker">Shared lab</span><h2 id="labs-editor-title">{initialLab?.remoteId ? "Edit lab" : "Add a lab"}</h2></div><button type="button" className="labs-icon-button" onClick={onClose} aria-label="Close editor"><X size={19} /></button></header><label>Lab name<input ref={titleRef} value={values.title} maxLength="120" onChange={(event) => update("title", event.target.value)} /></label><label>Short description<textarea value={values.description} maxLength="500" rows="2" onChange={(event) => update("description", event.target.value)} /></label><label>Category<input value={values.category} maxLength="60" onChange={(event) => update("category", event.target.value)} /></label><div className="labs-editor-code-label"><label htmlFor="labs-code">HTML code</label><label className="labs-upload-control"><Upload size={15} aria-hidden="true" /> Upload code<input type="file" accept=".html,.htm,.txt,text/html,text/plain" onChange={uploadCode} /></label></div><textarea id="labs-code" className="labs-code-input" value={values.html_code} spellCheck="false" rows="12" onChange={(event) => update("html_code", event.target.value)} placeholder="<!doctype html>..." />{error && <p className="labs-form-error" role="alert">{error}</p>}<footer><button type="button" className="labs-back-button" onClick={onClose}>Cancel</button><button type="submit" className="labs-primary-action" disabled={isSaving}>{isSaving ? "Saving…" : "Save shared lab"}</button></footer></form></div>;
}

export default function LabsHub({ activeLabId, onSelectLab }) {
  const { user } = useAuth();
  const [screen, setScreen] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [sharedLabs, setSharedLabs] = useState([]);
  const [catalogError, setCatalogError] = useState("");
  const [editorLab, setEditorLab] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const screenRootRef = useRef(null);
  const deferredQuery = useDeferredValue(query);
  const labs = useMemo(() => [...BUILTIN_LABS, ...sharedLabs.map((lab) => ({ ...lab, id: `shared-${lab.id}`, remoteId: lab.id, kind: "html-code", isShared: true }))].map(withLabTags), [sharedLabs]);
  const activeLab = labs.find((lab) => lab.id === activeLabId);
  const visibleTags = useMemo(() => FEATURED_LAB_TAGS.filter((tag) => labs.some((lab) => lab.tags.includes(tag))), [labs]);
  const filteredLabs = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    return labs.filter((lab) => {
      const tagMatch = activeTag === "All" || lab.tags.includes(activeTag);
      const searchMatch = !needle || `${lab.title} ${lab.description} ${lab.category} ${lab.tags.join(" ")}`.toLowerCase().includes(needle);
      return tagMatch && searchMatch;
    });
  }, [activeTag, deferredQuery, labs]);
  const featuredLabs = useMemo(() => {
    const featured = FEATURED_LAB_IDS.map((id) => labs.find((lab) => lab.id === id)).filter(Boolean);
    return featured.length === FEATURED_LAB_IDS.length ? featured : labs.slice(0, 4);
  }, [labs]);
  const pathStats = useMemo(() => LAB_PATHS.map((path) => ({
    ...path,
    count: labs.filter((lab) => lab.tags.includes(path.tag)).length,
  })), [labs]);
  const interactiveCount = useMemo(() => labs.filter((lab) => lab.kind === "react").length, [labs]);

  useEffect(() => {
    if (!user) { setSharedLabs([]); return; }
    let active = true;
    listSharedLabs().then((data) => { if (active) setSharedLabs(data); }).catch((error) => { if (active) setCatalogError(error.message || "Could not load shared labs."); });
    return () => { active = false; };
  }, [user?.id]);
  useEffect(() => { if (activeLabId && activeLab) { setIsLoading(true); setScreen("lab"); } }, [activeLabId]);
  useEffect(() => {
    const handleLabMessage = (event) => {
      if (event.data?.type !== "genai-labs-back") return;
      onSelectLab?.(null);
      setScreen("directory");
    };
    window.addEventListener("message", handleLabMessage);
    return () => window.removeEventListener("message", handleLabMessage);
  }, [onSelectLab]);
  useEffect(() => {
    if (screen === "lab") return;
    screenRootRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [screen]);

  const openLab = (lab) => { onSelectLab?.(lab.id); setScreen("lab"); };
  const saveLab = async (values) => {
    if (!user) throw new Error("Sign in to add a shared lab.");
    const saved = editorLab?.remoteId ? await updateSharedLab(editorLab.remoteId, values) : await createSharedLab(user.id, values);
    setSharedLabs((current) => editorLab?.remoteId ? current.map((lab) => lab.id === saved.id ? saved : lab) : [saved, ...current]);
    setShowEditor(false); setEditorLab(null); setScreen("directory");
  };
  const removeLab = async (lab) => {
    if (!window.confirm(`Delete “${lab.title}” for every user? This cannot be undone.`)) return;
    try { await deleteSharedLab(lab.remoteId); setSharedLabs((current) => current.filter((item) => item.id !== lab.remoteId)); if (activeLabId === lab.id) onSelectLab?.(null); }
    catch (error) { setCatalogError(error.message || "Could not delete this lab."); }
  };
  const showNewLab = () => { setEditorLab(null); setShowEditor(true); };
  const browseLabs = (tag = "All") => {
    setActiveTag(tag);
    setScreen("directory");
  };
  const submitHomeSearch = (event) => {
    event.preventDefault();
    setActiveTag("All");
    setScreen("directory");
  };

  if (screen === "home") return (
    <section ref={screenRootRef} className="labs-home" aria-labelledby="labs-home-title">
      <div className="labs-home-ambient labs-home-ambient-one" aria-hidden="true" />
      <div className="labs-home-ambient labs-home-ambient-two" aria-hidden="true" />

      <header className="labs-home-nav">
        <div className="labs-home-brand" aria-label="GenAI Academy Lab">
          <span className="labs-home-brand-mark"><FlaskConical size={17} aria-hidden="true" /></span>
          <span><strong>LAB</strong><small>GenAI Academy</small></span>
        </div>
        <div className="labs-home-nav-status" aria-label={`${labs.length} labs online`}>
          <span aria-hidden="true" /> {labs.length} experiments online
        </div>
        <button className="labs-ghost-action" onClick={showNewLab} disabled={!user} title={user ? "Add a shared lab" : "Sign in to add a shared lab"}>
          <Plus size={16} aria-hidden="true" /> Contribute a lab
        </button>
      </header>

      <main className="labs-home-main">
        <section className="labs-hero" aria-label="Lab introduction">
          <div className="labs-hero-copy">
            <span className="labs-home-kicker"><Sparkles size={14} aria-hidden="true" /> Interactive learning environment</span>
            <h1 id="labs-home-title">Where AI concepts become <em>instinct.</em></h1>
            <p>Experiment with the systems behind modern AI. Change the inputs, break the pipeline, inspect the outcome—and learn by doing.</p>

            <form className="labs-home-search" onSubmit={submitHomeSearch}>
              <label htmlFor="labs-home-search-input" className="sr-only">Search all labs</label>
              <Search size={19} aria-hidden="true" />
              <input id="labs-home-search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What do you want to understand?" />
              <button type="submit" aria-label="Search lab directory"><ArrowRight size={18} aria-hidden="true" /></button>
            </form>

            <div className="labs-popular-searches" aria-label="Popular lab topics">
              <span>Explore</span>
              {["Agents", "RAG", "GenAI", "Evaluation"].map((tag) => (
                <button key={tag} type="button" onClick={() => browseLabs(tag)}>{tag}</button>
              ))}
            </div>

            <div className="labs-home-actions">
              <button className="labs-primary-action" onClick={() => browseLabs()}><Play size={16} fill="currentColor" aria-hidden="true" /> Explore all labs</button>
              <span>No setup. Start experimenting instantly.</span>
            </div>
          </div>

          <div className="labs-hero-visual" aria-label="Interactive agent evaluation preview">
            <div className="labs-console-topbar">
              <div><i /><i /><i /></div>
              <span><Terminal size={13} aria-hidden="true" /> agent_eval.lab</span>
              <small>RUNNING</small>
            </div>
            <div className="labs-console-canvas">
              <div className="labs-console-grid" aria-hidden="true" />
              <div className="labs-pipeline">
                <div className="labs-pipeline-node labs-pipeline-node-input"><span>01</span><BrainCircuit size={21} /><strong>Prompt</strong><small>3.2k tokens</small></div>
                <i className="labs-pipeline-line labs-pipeline-line-one" aria-hidden="true"><b /></i>
                <div className="labs-pipeline-node labs-pipeline-node-agent"><span>02</span><Bot size={21} /><strong>Agent</strong><small>4 tool calls</small></div>
                <i className="labs-pipeline-line labs-pipeline-line-two" aria-hidden="true"><b /></i>
                <div className="labs-pipeline-node labs-pipeline-node-eval"><span>03</span><ShieldCheck size={21} /><strong>Evaluator</strong><small>8 checks</small></div>
              </div>
              <div className="labs-console-score">
                <span>Experiment score</span>
                <strong>94.8</strong>
                <div><i style={{ "--score": ".948" }} /></div>
              </div>
              <div className="labs-console-log"><span><b /> TRACE COMPLETE</span><code>latency 1.24s · grounded 0.96</code></div>
            </div>
            <div className="labs-float-card labs-float-card-top"><Zap size={15} /><span><small>LIVE SIGNAL</small><strong>Retrieval improved</strong></span><b>+18%</b></div>
            <div className="labs-float-card labs-float-card-bottom"><Activity size={15} /><span><small>ACTIVE RUNS</small><strong>12 experiments</strong></span></div>
          </div>
        </section>

        <section className="labs-metrics" aria-label="Lab platform highlights">
          <div><strong>{labs.length}<sup>+</sup></strong><span>Hands-on labs</span></div>
          <div><strong>{interactiveCount}</strong><span>Interactive simulations</span></div>
          <div><strong>{visibleTags.length}</strong><span>Engineering domains</span></div>
          <div><strong>0</strong><span>Minutes of setup</span></div>
        </section>

        <section className="labs-home-section" aria-labelledby="labs-featured-title">
          <div className="labs-section-heading">
            <div><span className="labs-section-index">01 / FEATURED</span><h2 id="labs-featured-title">Start with a live experiment.</h2></div>
            <button type="button" onClick={() => browseLabs()}>View complete directory <ArrowUpRight size={16} aria-hidden="true" /></button>
          </div>
          <div className="labs-featured-grid">
            {featuredLabs.map((lab, index) => (
              <article className={`labs-featured-card labs-featured-card-${index + 1}`} key={lab.id}>
                <button type="button" onClick={() => openLab(lab)} aria-label={`Open ${lab.title}`}>
                  <span className="labs-featured-number">0{index + 1}</span>
                  <span className="labs-featured-icon">{index === 0 ? <Database /> : index === 1 ? <Bot /> : index === 2 ? <ShieldCheck /> : <Gauge />}</span>
                  <span className="labs-featured-category">{lab.category}</span>
                  <strong>{lab.title}</strong>
                  <p>{lab.description}</p>
                  <span className="labs-featured-open">Launch experiment <ArrowRight size={15} aria-hidden="true" /></span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="labs-home-section labs-paths-section" aria-labelledby="labs-paths-title">
          <div className="labs-section-heading">
            <div><span className="labs-section-index">02 / DISCOVER</span><h2 id="labs-paths-title">Follow your curiosity.</h2></div>
            <p>Pick a domain. Every lab is built to make a difficult idea visible, testable, and memorable.</p>
          </div>
          <div className="labs-path-grid">
            {pathStats.map(({ tag, label, description, icon: Icon, tone, count }) => (
              <button className={`labs-path-card is-${tone}`} key={tag} type="button" onClick={() => browseLabs(tag)}>
                <span className="labs-path-icon"><Icon size={20} aria-hidden="true" /></span>
                <span className="labs-path-copy"><strong>{label}</strong><small>{description}</small></span>
                <span className="labs-path-count">{count}<small>labs</small></span>
                <ArrowUpRight className="labs-path-arrow" size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        <section className="labs-home-cta" aria-label="Browse every lab">
          <div><span className="labs-section-index">READY WHEN YOU ARE</span><h2>Stop reading about AI.<br />Start testing it.</h2></div>
          <div><p>{labs.length} guided experiments. One click from theory to proof.</p><button className="labs-primary-action" onClick={() => browseLabs()}>Enter the lab <ArrowRight size={17} aria-hidden="true" /></button></div>
        </section>
      </main>

      <footer className="labs-home-footer"><span>GENAI ACADEMY / LAB</span><span>Built for curious minds</span><span>© 2026</span></footer>
      {showEditor && <SharedLabEditor initialLab={editorLab} onClose={() => setShowEditor(false)} onSave={saveLab} />}
    </section>
  );

  if (screen === "directory") return (
    <section ref={screenRootRef} className="labs-directory" aria-labelledby="labs-directory-title">
      <header className="labs-directory-header">
        <div><span className="labs-home-kicker">Lab directory / {labs.length} experiments</span><h1 id="labs-directory-title">Choose a lab.<br />Change the variables.</h1><p>Search the full collection or filter by the system you want to understand.</p></div>
        <div className="labs-directory-actions"><button className="labs-back-button" onClick={() => setScreen("home")}><ArrowLeft size={16} aria-hidden="true" /> Labs home</button><button className="labs-primary-action" onClick={showNewLab} disabled={!user}><Plus size={16} aria-hidden="true" /> Add lab</button></div>
      </header>
      <div className="labs-filter-deck" aria-label="Filter labs">
        <label className="labs-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search labs</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search labs, topics, or tags" /></label>
        <div className="labs-tag-filters" role="group" aria-label="Filter labs by tag">
          {["All", ...visibleTags].map((tag) => <button key={tag} type="button" className={activeTag === tag ? "active" : ""} onClick={() => setActiveTag(tag)} aria-pressed={activeTag === tag}>{tag}</button>)}
        </div>
        <p className="labs-result-count" aria-live="polite"><strong>{filteredLabs.length}</strong> of {labs.length} labs</p>
      </div>
      {catalogError && <p className="labs-catalog-error" role="alert">{catalogError}</p>}
      {filteredLabs.length ? <div className="labs-card-grid">{filteredLabs.map((lab) => {
        const index = labs.findIndex((item) => item.id === lab.id);
        return <article className="labs-card" key={lab.id}><button className="labs-card-open" onClick={() => openLab(lab)} aria-label={`Open ${lab.title}`}><span className="labs-card-number">{String(index + 1).padStart(2, "0")}</span><span className="labs-card-category">{lab.category}</span><strong>{lab.title}</strong><span className="labs-card-description">{lab.description}</span><span className="labs-card-tags">{lab.tags.slice(0, 3).map((tag) => <i key={tag}>{tag}</i>)}</span><span className="labs-card-link">Open lab <ArrowRight size={15} aria-hidden="true" /></span></button>{lab.isShared && <div className="labs-card-manager"><button onClick={() => { setEditorLab(lab); setShowEditor(true); }} aria-label={`Edit ${lab.title}`}><Pencil size={14} /> Edit</button><button className="labs-delete-button" onClick={() => removeLab(lab)} aria-label={`Delete ${lab.title}`}><Trash2 size={14} /> Delete</button></div>}</article>;
      })}</div> : <div className="labs-empty-filter"><strong>No labs match those filters.</strong><span>Try another tag or clear your search.</span><button type="button" onClick={() => { setQuery(""); setActiveTag("All"); }}>Clear filters</button></div>}
      {!user && <p className="labs-signin-note">Sign in to add, edit, or delete shared labs.</p>}
      {showEditor && <SharedLabEditor initialLab={editorLab} onClose={() => setShowEditor(false)} onSave={saveLab} />}
    </section>
  );

  return <section className="labs-hub" aria-label={activeLab?.title}><button className="labs-floating-back" onClick={() => { onSelectLab?.(null); setScreen("directory"); }} aria-label="Back to lab directory"><ArrowLeft size={17} aria-hidden="true" /> All labs</button><div className="labs-hub-canvas">{isLoading && <div className="labs-hub-loading" role="status" aria-live="polite"><Loader2 size={22} aria-hidden="true" /><span>Loading {activeLab?.title}</span></div>}{activeLab?.kind === "html" ? <iframe key={activeLab.id} className="labs-hub-frame" src={activeLab.src} title={activeLab.title} sandbox="allow-scripts allow-forms allow-modals allow-downloads allow-popups" allow="clipboard-write" onLoad={() => setIsLoading(false)} /> : activeLab?.kind === "html-code" ? <iframe key={activeLab.id} className="labs-hub-frame" srcDoc={activeLab.html_code} title={activeLab.title} sandbox="allow-scripts allow-forms allow-modals allow-downloads allow-popups" allow="clipboard-write" onLoad={() => setIsLoading(false)} /> : <ReactLabFrame key={activeLab?.id} title={activeLab?.title} component={activeLab?.component} onReady={() => setIsLoading(false)} />}</div></section>;
}
