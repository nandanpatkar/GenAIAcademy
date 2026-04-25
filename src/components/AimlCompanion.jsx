import { useState, useEffect } from "react";
import { X, Search, ChevronDown, ChevronUp, PanelLeft, GraduationCap, Globe, BookOpen, ArrowUpRight, Loader2 } from "lucide-react";

// ── Curriculum data ───────────────────────────────────────────────────────────
const BASE = "https://aimlcompanion.ai";

const SITE_PAGES = [
  { id: "home",             label: "Home",             url: `${BASE}/` },
  { id: "curriculum",       label: "Study Paths",       url: `${BASE}/curriculum` },
  { id: "roadmap",          label: "Roadmap",          url: `${BASE}/roadmap` },
  { id: "about",            label: "About",            url: `${BASE}/about` },
  { id: "community",        label: "Community",        url: `${BASE}/community` },
  { id: "help",             label: "Help",             url: `${BASE}/help` },
  { id: "upgrade",          label: "Upgrade",          url: `${BASE}/upgrade` },
  { id: "founding-members", label: "Founding Members", url: `${BASE}/founding-members` },
];

const STUDY_PATHS = [
  {
    id: "foundations", label: "Foundations", color: "#a78bfa",
    url: `${BASE}/curriculum/foundations`,
    modules: [
      { id: "basicArith", label: "Basic Arithmetic" },
      { id: "fractions",  label: "Fractions" },
      { id: "exponents",  label: "Exponents" },
      { id: "algebra",    label: "Algebra" },
      { id: "functions",  label: "Functions" },
      { id: "notation",   label: "Notation" },
    ],
  },
  {
    id: "jupyterNotebook", label: "Jupyter Notebook", color: "#f97316",
    url: `${BASE}/curriculum/jupyterNotebook`,
    modules: [
      { id: "jupyterIntro",         label: "Jupyter Intro" },
      { id: "jupyterLocalSetup",    label: "Local Setup" },
      { id: "jupyterInterface",     label: "Jupyter Interface" },
      { id: "googleColab",          label: "Google Colab" },
      { id: "vsCodeJupyter",        label: "VS Code Jupyter" },
      { id: "jupyterBestPractices", label: "Best Practices" },
      { id: "jupyterMagics",        label: "Jupyter Magics" },
      { id: "jupyterVisualization", label: "Visualization" },
      { id: "kaggleNotebooks",      label: "Kaggle Notebooks" },
    ],
  },
  {
    id: "pythonML", label: "Python for ML", color: "#3b82f6",
    url: `${BASE}/curriculum/pythonML`,
    modules: [
      { id: "pythonBasics",     label: "Python Basics" },
      { id: "pythonFunctions",  label: "Functions" },
      { id: "numpyIntro",       label: "NumPy Intro" },
      { id: "numpyAdvanced",    label: "NumPy Advanced" },
      { id: "pandasIntro",      label: "Pandas Intro" },
      { id: "pandasAdvanced",   label: "Pandas Advanced" },
      { id: "matplotlib",       label: "Matplotlib" },
      { id: "sklearnIntro",     label: "Scikit-learn Intro" },
      { id: "sklearnPipelines", label: "Scikit-learn Pipelines" },
    ],
  },
  {
    id: "sql", label: "SQL", color: "#06b6d4",
    url: `${BASE}/curriculum/sql`,
    modules: [
      { id: "sqlIntro",           label: "SQL Intro" },
      { id: "sqlSelect",          label: "SELECT" },
      { id: "sqlSorting",         label: "Sorting" },
      { id: "sqlJoins",           label: "JOINs" },
      { id: "sqlAggregation",     label: "Aggregation" },
      { id: "sqlSubqueries",      label: "Subqueries" },
      { id: "sqlWindowFunctions", label: "Window Functions" },
      { id: "sqlCtes",            label: "CTEs" },
      { id: "sqlDdl",             label: "DDL" },
      { id: "sqlIndexing",        label: "Indexing" },
      { id: "sqlForMl",           label: "SQL for ML" },
    ],
  },
  {
    id: "linearAlgebra", label: "Linear Algebra", color: "#10b981",
    url: `${BASE}/curriculum/linearAlgebra`,
    modules: [
      { id: "vectors",     label: "Vectors" },
      { id: "matrices",    label: "Matrices" },
      { id: "dotProduct",  label: "Dot Product" },
      { id: "matrixMult",  label: "Matrix Multiplication" },
      { id: "transpose",   label: "Transpose" },
      { id: "eigenvalues", label: "Eigenvalues" },
      { id: "svd",         label: "SVD" },
    ],
  },
  {
    id: "probability", label: "Probability", color: "#f59e0b",
    url: `${BASE}/curriculum/probability`,
    modules: [
      { id: "basicProb",       label: "Basic Probability" },
      { id: "conditionalProb", label: "Conditional Probability" },
      { id: "bayes",           label: "Bayes Theorem" },
      { id: "distributions",   label: "Distributions" },
      { id: "expectation",     label: "Expectation" },
      { id: "variance",        label: "Variance" },
      { id: "lln",             label: "Law of Large Numbers" },
      { id: "clt",             label: "Central Limit Theorem" },
    ],
  },
  {
    id: "calculus", label: "Calculus", color: "#ec4899",
    url: `${BASE}/curriculum/calculus`,
    modules: [
      { id: "limits",      label: "Limits" },
      { id: "derivatives", label: "Derivatives" },
      { id: "partials",    label: "Partial Derivatives" },
      { id: "gradients",   label: "Gradients" },
      { id: "chainRule",   label: "Chain Rule" },
      { id: "integrals",   label: "Integrals" },
    ],
  },
  {
    id: "optimization", label: "Optimization", color: "#8b5cf6",
    url: `${BASE}/curriculum/optimization`,
    modules: [
      { id: "gradientDescent", label: "Gradient Descent" },
      { id: "learningRate",    label: "Learning Rate" },
      { id: "momentum",        label: "Momentum" },
      { id: "sgd",             label: "SGD" },
      { id: "adam",            label: "Adam" },
      { id: "lossFunctions",   label: "Loss Functions" },
      { id: "convexity",       label: "Convexity" },
    ],
  },
  {
    id: "statistics", label: "Statistics", color: "#14b8a6",
    url: `${BASE}/curriculum/statistics`,
    modules: [
      { id: "descriptive",  label: "Descriptive Stats" },
      { id: "stdDev",       label: "Std Deviation" },
      { id: "correlation",  label: "Correlation" },
      { id: "regression",   label: "Regression" },
      { id: "hypothesis",   label: "Hypothesis Testing" },
      { id: "confidence",   label: "Confidence Intervals" },
      { id: "biasVariance", label: "Bias-Variance Tradeoff" },
    ],
  },
  {
    id: "infoTheory", label: "Information Theory", color: "#64748b",
    url: `${BASE}/curriculum/infoTheory`,
    modules: [
      { id: "entropy",      label: "Entropy" },
      { id: "crossEntropy", label: "Cross Entropy" },
      { id: "kl",           label: "KL Divergence" },
      { id: "mutualInfo",   label: "Mutual Information" },
    ],
  },
  {
    id: "mlAlgorithms", label: "ML Algorithms", color: "#ef4444",
    url: `${BASE}/curriculum/mlAlgorithms`,
    modules: [
      { id: "mlIntro",                  label: "ML Intro" },
      { id: "linReg",                   label: "Linear Regression" },
      { id: "logReg",                   label: "Logistic Regression" },
      { id: "regularization",           label: "Regularization" },
      { id: "featureScaling",           label: "Feature Scaling" },
      { id: "naiveBayes",               label: "Naive Bayes" },
      { id: "knn",                      label: "KNN" },
      { id: "decisionTrees",            label: "Decision Trees" },
      { id: "svm",                      label: "SVM" },
      { id: "multiclassClassification", label: "Multiclass Classification" },
      { id: "neuralNets",               label: "Neural Networks" },
      { id: "kmeans",                   label: "K-Means" },
      { id: "hierarchicalClustering",   label: "Hierarchical Clustering" },
      { id: "dbscan",                   label: "DBSCAN" },
      { id: "pca",                      label: "PCA" },
      { id: "ensembles",                label: "Ensembles" },
      { id: "gradientBoosting",         label: "Gradient Boosting" },
      { id: "modelEval",                label: "Model Evaluation" },
      { id: "crossVal",                 label: "Cross Validation" },
      { id: "featureImportance",        label: "Feature Importance" },
      { id: "imbalancedData",           label: "Imbalanced Data" },
      { id: "mlAlgorithmsCapstone",     label: "Capstone" },
      { id: "iplProject",               label: "IPL Project" },
    ],
  },
  {
    id: "mlPipeline", label: "ML Pipeline", color: "#f97316",
    url: `${BASE}/curriculum/mlPipeline`,
    modules: [
      { id: "dataCollection",       label: "Data Collection" },
      { id: "edaBasics",            label: "EDA Basics" },
      { id: "edaVisualization",     label: "EDA Visualization" },
      { id: "dataPreprocessing",    label: "Data Preprocessing" },
      { id: "featureEngineering",   label: "Feature Engineering" },
      { id: "featureSelection",     label: "Feature Selection" },
      { id: "dataSplitting",        label: "Data Splitting" },
      { id: "modelSelection",       label: "Model Selection" },
      { id: "modelTraining",        label: "Model Training" },
      { id: "hyperparameterTuning", label: "Hyperparameter Tuning" },
      { id: "modelEvaluation",      label: "Model Evaluation" },
      { id: "modelInterpretation",  label: "Model Interpretation" },
      { id: "modelDeployment",      label: "Model Deployment" },
      { id: "mlMonitoring",         label: "ML Monitoring" },
      { id: "mlPipelineCapstone",   label: "Capstone" },
    ],
  },
  {
    id: "deepLearning", label: "Deep Learning", color: "#6366f1",
    url: `${BASE}/curriculum/deepLearning`,
    modules: [
      { id: "dlIntro",            label: "DL Intro" },
      { id: "dlNeurons",          label: "Neurons" },
      { id: "dlActivations",      label: "Activations" },
      { id: "dlForward",          label: "Forward Pass" },
      { id: "dlPytorch",          label: "PyTorch" },
      { id: "dlLoss",             label: "Loss Functions" },
      { id: "dlBackprop",         label: "Backpropagation" },
      { id: "dlOptimizers",       label: "Optimizers" },
      { id: "dlRegularization",   label: "Regularization" },
      { id: "dlBatchNorm",        label: "Batch Normalization" },
      { id: "dlCnnIntro",         label: "CNNs Intro" },
      { id: "dlCnnPooling",       label: "CNN Pooling" },
      { id: "dlEmbeddings",       label: "Embeddings" },
      { id: "dlRnnIntro",         label: "RNNs Intro" },
      { id: "dlLstmGru",          label: "LSTM & GRU" },
      { id: "dlAttention",        label: "Attention" },
      { id: "dlTransformers",     label: "Transformers" },
      { id: "dlTraining",         label: "Training Techniques" },
      { id: "dlGpuFundamentals",  label: "GPU Fundamentals" },
      { id: "dlDistributed",      label: "Distributed Training" },
      { id: "dlTransferLearning", label: "Transfer Learning" },
      { id: "dlModernArchs",      label: "Modern Architectures" },
      { id: "dlCapstone",         label: "Capstone" },
    ],
  },
  {
    id: "llm", label: "LLMs", color: "#00ff88",
    url: `${BASE}/curriculum/llm`,
    modules: [
      { id: "llmIntro",              label: "LLM Intro" },
      { id: "llmGenAI",              label: "GenAI Overview" },
      { id: "llmTokenization",       label: "Tokenization" },
      { id: "llmEmbeddings",         label: "Embeddings" },
      { id: "llmArchitecture",       label: "Architecture" },
      { id: "llmPositionalEncoding", label: "Positional Encoding" },
      { id: "llmMoE",                label: "Mixture of Experts" },
      { id: "llmAttentionVariants",  label: "Attention Variants" },
      { id: "llmPretraining",        label: "Pretraining" },
      { id: "llmLogits",             label: "Logits" },
      { id: "llmSampling",           label: "Sampling" },
      { id: "llmMultiTurn",          label: "Multi-Turn" },
      { id: "llmPromptEng",          label: "Prompt Engineering" },
      { id: "llmAdvancedPrompting",  label: "Advanced Prompting" },
      { id: "llmPromptOptimization", label: "Prompt Optimization" },
      { id: "llmICL",                label: "In-Context Learning" },
      { id: "llmFineTuning",         label: "Fine-Tuning" },
      { id: "llmRLHF",               label: "RLHF" },
      { id: "llmHallucinations",     label: "Hallucinations" },
      { id: "llmSecurity",           label: "Security" },
      { id: "llmEvaluation",         label: "Evaluation" },
      { id: "llmInference",          label: "Inference" },
      { id: "llmScaling",            label: "Scaling Laws" },
      { id: "llmOpenSource",         label: "Open Source LLMs" },
      { id: "llmAPIs",               label: "LLM APIs" },
      { id: "llmRAG",                label: "RAG" },
      { id: "llmCRAG",               label: "Corrective RAG" },
      { id: "llmGraphRAG",           label: "Graph RAG" },
      { id: "llmAdaptiveRAG",        label: "Adaptive RAG" },
      { id: "llmMultimodalRAG",      label: "Multimodal RAG" },
      { id: "llmAgents",             label: "Agents" },
      { id: "llmMultimodal",         label: "Multimodal LLMs" },
      { id: "llmDistillation",       label: "Distillation" },
      { id: "ragExpertAssistant",    label: "RAG Expert Assistant" },
    ],
    extras: [
      { id: "paper-attention", label: "Paper: Attention", url: `${BASE}/paper-story/llm/paper-attention` },
      { id: "paper-deepseek",  label: "Paper: DeepSeek",  url: `${BASE}/paper-story/llm/paper-deepseek` },
      { id: "paper-gpt3",      label: "Paper: GPT-3",     url: `${BASE}/paper-story/llm/paper-gpt3` },
    ],
  },
  {
    id: "gitVersionControl", label: "Git & Version Control", color: "#f87171",
    url: `${BASE}/curriculum/gitVersionControl`,
    modules: [
      { id: "gitIntro",            label: "Git Intro" },
      { id: "gitSetup",            label: "Git Setup" },
      { id: "gitBasics",           label: "Git Basics" },
      { id: "gitignorePatterns",   label: ".gitignore Patterns" },
      { id: "commitBestPractices", label: "Commit Best Practices" },
      { id: "gitBranching",        label: "Branching" },
      { id: "gitConflicts",        label: "Merge Conflicts" },
      { id: "gitUndoing",          label: "Undoing Changes" },
      { id: "gitHistory",          label: "Git History" },
      { id: "gitRemotes",          label: "Remotes" },
      { id: "githubIntro",         label: "GitHub Intro" },
      { id: "githubPRs",           label: "Pull Requests" },
      { id: "gitWorkflows",        label: "Git Workflows" },
      { id: "gitAdvanced",         label: "Advanced Git" },
      { id: "gitLFS",              label: "Git LFS" },
    ],
  },
  {
    id: "mlOps", label: "MLOps", color: "#fb923c",
    url: `${BASE}/curriculum/mlOps`,
    modules: [
      { id: "mlopsIntro",         label: "MLOps Intro" },
      { id: "dockerBasics",       label: "Docker Basics" },
      { id: "dockerML",           label: "Docker for ML" },
      { id: "mlAPIs",             label: "ML APIs" },
      { id: "cicdBasics",         label: "CI/CD Basics" },
      { id: "cicdML",             label: "CI/CD for ML" },
      { id: "experimentTracking", label: "Experiment Tracking" },
      { id: "modelVersioning",    label: "Model Versioning" },
      { id: "cloudDeploy",        label: "Cloud Deployment" },
      { id: "cloudGpuSelection",  label: "Cloud GPU Selection" },
      { id: "serverlessML",       label: "Serverless ML" },
      { id: "mlMonitoringOps",    label: "ML Monitoring" },
      { id: "kubernetesML",       label: "Kubernetes for ML" },
      { id: "mlopsCapstone",      label: "Capstone" },
    ],
  },
  {
    id: "softwareEngAI", label: "Software Eng for AI", color: "#22d3ee",
    url: `${BASE}/curriculum/softwareEngAI`,
    modules: [
      { id: "cleanCode",           label: "Clean Code" },
      { id: "pythonBestPractices", label: "Python Best Practices" },
      { id: "projectStructure",    label: "Project Structure" },
      { id: "codeDocumentation",   label: "Code Documentation" },
      { id: "pytestBasics",        label: "Pytest Basics" },
      { id: "testingML",           label: "Testing ML" },
      { id: "mockingTesting",      label: "Mocking & Testing" },
      { id: "apiDesign",           label: "API Design" },
      { id: "designPatterns",      label: "Design Patterns" },
      { id: "codeReview",          label: "Code Review" },
    ],
  },
  {
    id: "aiAgents", label: "AI Agents", color: "#00ff88",
    url: `${BASE}/curriculum/aiAgents`,
    modules: [
      { id: "agentsIntro",              label: "Agents Intro" },
      { id: "agentLifecycle",           label: "Agent Lifecycle" },
      { id: "functionCalling",          label: "Function Calling" },
      { id: "structuredOutputs",        label: "Structured Outputs" },
      { id: "toolDesign",               label: "Tool Design" },
      { id: "agentToolEcosystem",       label: "Tool Ecosystem" },
      { id: "reactPattern",             label: "ReAct Pattern" },
      { id: "agentPlanning",            label: "Agent Planning" },
      { id: "reasoningPatterns",        label: "Reasoning Patterns" },
      { id: "treeOfThought",            label: "Tree of Thought" },
      { id: "langchainBasics",          label: "LangChain Basics" },
      { id: "agentFrameworks",          label: "Agent Frameworks" },
      { id: "vectorDatabases",          label: "Vector Databases" },
      { id: "ragAdvanced",              label: "Advanced RAG" },
      { id: "agentEvaluation",          label: "Agent Evaluation" },
      { id: "mcpProtocol",              label: "MCP Protocol" },
      { id: "agentMemory",              label: "Agent Memory" },
      { id: "langgraphAgents",          label: "LangGraph Agents" },
      { id: "multiAgentPatterns",       label: "Multi-Agent Patterns" },
      { id: "crewaiAgents",             label: "CrewAI" },
      { id: "openaiAgentsSDK",          label: "OpenAI Agents SDK" },
      { id: "a2aProtocol",              label: "A2A Protocol" },
      { id: "agentGuardrails",          label: "Guardrails" },
      { id: "agentObservability",       label: "Observability" },
      { id: "agenticWorkflows",         label: "Agentic Workflows" },
      { id: "agentDeployment",          label: "Deployment" },
      { id: "agentFullStack",           label: "Full-Stack Agents" },
      { id: "autonomousResearch",       label: "Autonomous Research" },
      { id: "agentsCapstone",           label: "Capstone" },
      { id: "contentModerationProject", label: "Content Moderation Project" },
      { id: "dueDiligenceProject",      label: "Due Diligence Project" },
    ],
  },
  {
    id: "interviewScenarios", label: "Interview Scenarios", color: "#fbbf24",
    url: `${BASE}/curriculum/interviewScenarios`,
    modules: [
      { id: "ivMathStats",        label: "Math & Stats" },
      { id: "ivClassicalML",      label: "Classical ML" },
      { id: "ivMLCoding",         label: "ML Coding" },
      { id: "ivDLFundamentals",   label: "DL Fundamentals" },
      { id: "ivGenAICore",        label: "GenAI Core" },
      { id: "ivRAGPromptEng",     label: "RAG & Prompt Eng" },
      { id: "llmInterviewPrep",   label: "LLM Interview Prep" },
      { id: "ivLLMCore",          label: "LLM Core" },
      { id: "agentInterviewPrep", label: "Agent Interview Prep" },
      { id: "ivAgenticAI",        label: "Agentic AI" },
      { id: "ivMLSystemDesign",   label: "ML System Design" },
      { id: "ivMLOps",            label: "MLOps" },
    ],
  },
  {
    id: "aiTools", label: "AI Tools", color: "#c084fc",
    url: `${BASE}/curriculum/aiTools`,
    modules: [
      { id: "openclawSetup",   label: "OpenClaw Setup" },
      { id: "claudeCodeSetup", label: "Claude Code Setup" },
    ],
  },
];

function moduleUrl(curriculumId, moduleId) {
  return `${BASE}/module/${curriculumId}/${moduleId}`;
}

const totalModules = STUDY_PATHS.reduce(
  (sum, c) => sum + c.modules.length + (c.extras?.length || 0), 0
);

// ── In-memory preview cache ───────────────────────────────────────────────────
const previewCache = {};

async function fetchPreview(url) {
  if (previewCache[url]) return previewCache[url];
  try {
    const res = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=true`
    );
    const data = await res.json();
    const result = {
      title:       data.data?.title       || null,
      description: data.data?.description || null,
      image:       data.data?.screenshot?.url || data.data?.image?.url || null,
      logo:        data.data?.logo?.url   || null,
    };
    previewCache[url] = result;
    return result;
  } catch {
    return { title: null, description: null, image: null, logo: null };
  }
}

// ── Preview Card ──────────────────────────────────────────────────────────────
function PreviewCard({ item }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const accent = item.currColor || "#00ff88";

  useEffect(() => {
    setLoading(true);
    setPreview(null);
    fetchPreview(item.url).then(p => {
      setPreview(p);
      setLoading(false);
    });
  }, [item.url]);

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "32px 40px", overflowY: "auto",
    }}>
      <div style={{
        width: "100%", maxWidth: 660,
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 20, overflow: "hidden",
        boxShadow: `0 0 0 1px ${accent}15, 0 20px 60px rgba(0,0,0,0.3)`,
      }}>

        {/* Screenshot strip */}
        <div style={{
          width: "100%", aspectRatio: "16/9",
          background: "var(--bg3)", position: "relative", overflow: "hidden",
          borderBottom: "1px solid var(--border)",
        }}>
          {/* Accent top bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3, zIndex: 2,
            background: `linear-gradient(90deg, ${accent}, ${accent}44)`,
          }} />

          {loading ? (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, color: "var(--text3)", fontSize: 12,
            }}>
              <Loader2 size={16} style={{ animation: "aiml-spin 1s linear infinite" }} />
              Fetching preview…
            </div>
          ) : preview?.image ? (
            <img
              src={preview.image} alt={item.label}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 10,
              background: `radial-gradient(ellipse at 50% 50%, ${accent}10 0%, transparent 70%)`,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: `${accent}15`, border: `1px solid ${accent}28`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Globe size={24} style={{ color: accent }} />
              </div>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>No screenshot available</span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: "26px 30px 30px" }}>

          {/* Curriculum breadcrumb */}
          {item.currLabel && (
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
              color: accent, textTransform: "uppercase",
              marginBottom: 8, opacity: 0.9,
            }}>
              {item.currLabel}
            </div>
          )}

          {/* Title */}
          <div style={{
            fontSize: 21, fontWeight: 800, color: "var(--text)",
            fontFamily: "var(--font)", lineHeight: 1.25, marginBottom: 10,
          }}>
            {preview?.title || item.label}
          </div>

          {/* Description */}
          <div style={{
            fontSize: 13, color: "var(--text3)", lineHeight: 1.7, marginBottom: 22, minHeight: 42,
          }}>
            {loading
              ? "Loading description…"
              : preview?.description
                ? preview.description.length > 200
                  ? preview.description.slice(0, 200) + "…"
                  : preview.description
                : "An interactive learning module on AIML Companion. Click below to open the full lesson."}
          </div>

          {/* URL pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 10, color: "var(--text3)",
            background: "var(--bg3)", border: "1px solid var(--border)",
            borderRadius: 6, padding: "4px 10px", marginBottom: 22,
            maxWidth: "100%", overflow: "hidden",
          }}>
            {preview?.logo
              ? <img src={preview.logo} alt="" style={{ width: 13, height: 13, borderRadius: 3, objectFit: "contain", flexShrink: 0 }} />
              : <Globe size={11} style={{ flexShrink: 0 }} />
            }
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.url}
            </span>
          </div>

          {/* CTA */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "11px 22px",
              background: accent, color: "#000",
              fontWeight: 800, fontSize: 13,
              borderRadius: 10, textDecoration: "none",
              transition: "all .2s", fontFamily: "var(--font)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = "0.88";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <BookOpen size={14} />
            Open Module
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <style>{`@keyframes aiml-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AimlCompanion({ onClose }) {
  const [search, setSearch]               = useState("");
  const [showSidebar, setShowSidebar]     = useState(true);
  const [expanded, setExpanded]           = useState({});
  const [activeItem, setActiveItem]       = useState(null);
  const [activeSection, setActiveSection] = useState("curriculum");

  const toggleExpand = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const query = search.toLowerCase();
  const filteredStudyPaths = STUDY_PATHS.map(c => ({
    ...c,
    modules: c.modules.filter(m => m.label.toLowerCase().includes(query)),
    extras: (c.extras || []).filter(e => e.label.toLowerCase().includes(query)),
  })).filter(c =>
    c.label.toLowerCase().includes(query) || c.modules.length > 0 || c.extras.length > 0
  );
  const filteredSitePages = SITE_PAGES.filter(p => p.label.toLowerCase().includes(query));

  const handleSelect = (url, label, currLabel = "", currColor = null) => {
    setActiveItem({ url, label, currLabel, currColor });
  };

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
      background: "var(--bg)", color: "var(--text)",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }}>

      <header className="aiml-header" style={{ height: 62, background: 'var(--bg2)', borderBottom: `1px solid var(--border)`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, flexShrink: 0 }}>
        
        <button
          onClick={() => setShowSidebar(v => !v)}
          title="Toggle Sidebar"
          style={{
            background: showSidebar ? "var(--bg3)" : "transparent",
            border: "1px solid " + (showSidebar ? "var(--border)" : "transparent"),
            color: showSidebar ? "var(--text)" : "var(--text3)",
            cursor: "pointer", borderRadius: 7, width: 30, height: 30,
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", flexShrink: 0
          }}
        >
          <PanelLeft size={16} />
        </button>

        {/* Logo + Title Stack */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, #00ff88, #00cc66)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 18px rgba(0, 255, 136, 0.35)' }}>
            <GraduationCap size={19} color="#000" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1.1, margin: 0 }}>Aiml Companion</h1>
            <p style={{ margin: 0, fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>{totalModules} modules · {STUDY_PATHS.length} study paths · Interactive Learning</p>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: "4px 10px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
             <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 10px #00ff88" }} />
             <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text2)" }}>SYSTEM_ONLINE</span>
          </div>

          <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '4px 8px' }}>
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Sidebar */}
        {showSidebar && (
          <div style={{
            width: 260, minWidth: 260, borderRight: "1px solid var(--border)",
            background: "var(--bg2)", display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              margin: 10, padding: "7px 10px",
              background: "var(--bg3)", borderRadius: 8, border: "1px solid var(--border)",
            }}>
              <Search size={13} style={{ color: "var(--text3)", flexShrink: 0 }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search study blocks..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 12 }}
              />
              {search && (
                <button onClick={() => setSearch("")}
                  style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", display: "flex" }}>
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Section tabs */}
            <div style={{ display: "flex", gap: 4, padding: "0 10px 8px" }}>
              {[{ id: "curriculum", label: "Study Paths" }, { id: "site", label: "Site Pages" }].map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                  flex: 1, padding: "5px 0", fontSize: 11, fontWeight: 700,
                  borderRadius: 6, border: "1px solid var(--border)", cursor: "pointer", transition: "all .15s",
                  background: activeSection === s.id ? "var(--neon)" : "var(--bg3)",
                  color: activeSection === s.id ? "#000" : "var(--text2)",
                }}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>

              {/* Site pages */}
              {activeSection === "site" && filteredSitePages.map(page => {
                const isActive = activeItem?.url === page.url;
                return (
                  <button key={page.id} onClick={() => handleSelect(page.url, page.label)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", padding: "9px 16px",
                      background: isActive ? "var(--bg3)" : "transparent", border: "none",
                      borderLeft: isActive ? "3px solid var(--neon)" : "3px solid transparent",
                      cursor: "pointer", textAlign: "left", transition: "all .12s",
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg3)"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? "var(--text)" : "var(--text2)" }}>
                      {page.label}
                    </span>
                  </button>
                );
              })}

              {/* Study Paths */}
              {activeSection === "curriculum" && (
                filteredStudyPaths.length === 0
                  ? <div style={{ padding: 24, textAlign: "center", color: "var(--text3)", fontSize: 12 }}>No modules match "{search}"</div>
                  : filteredStudyPaths.map(curr => {
                    const isOpen = expanded[curr.id] ?? false;
                    const isCurrActive = activeItem?.url === curr.url;
                    return (
                      <div key={curr.id}>
                        <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
                          <button
                            onClick={() => handleSelect(curr.url, curr.label, curr.label, curr.color)}
                            style={{
                              flex: 1, display: "flex", alignItems: "center", gap: 8,
                              padding: "9px 12px 9px 14px",
                              background: isCurrActive ? "rgba(0,255,136,0.07)" : "transparent",
                              border: "none", borderLeft: isCurrActive ? `3px solid ${curr.color}` : "3px solid transparent",
                              cursor: "pointer", textAlign: "left",
                            }}
                          >
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: curr.color, flexShrink: 0 }} />
                            <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font)" }}>
                              {curr.label}
                            </span>
                            <span style={{ fontSize: 9, color: "var(--text3)", fontWeight: 600, background: "var(--bg4)", padding: "1px 6px", borderRadius: 4 }}>
                              {curr.modules.length + (curr.extras?.length || 0)}
                            </span>
                          </button>
                          <button onClick={() => toggleExpand(curr.id)}
                            style={{ padding: "9px 12px", background: "transparent", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex", alignItems: "center" }}>
                            {isOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                          </button>
                        </div>

                        {isOpen && (
                          <>
                            {curr.modules.map(mod => {
                              const url = moduleUrl(curr.id, mod.id);
                              const isActive = activeItem?.url === url;
                              return (
                                <button key={mod.id}
                                  onClick={() => handleSelect(url, mod.label, curr.label, curr.color)}
                                  style={{
                                    width: "100%", display: "flex", alignItems: "center",
                                    padding: "7px 14px 7px 28px",
                                    background: isActive ? "var(--bg3)" : "transparent",
                                    border: "none", borderLeft: isActive ? `3px solid ${curr.color}` : "3px solid transparent",
                                    cursor: "pointer", textAlign: "left", transition: "all .12s",
                                  }}
                                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg3)"; }}
                                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                                >
                                  <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 400, color: isActive ? "var(--text)" : "var(--text2)", lineHeight: 1.35 }}>
                                    {mod.label}
                                  </span>
                                </button>
                              );
                            })}
                            {curr.extras?.map(extra => {
                              const isActive = activeItem?.url === extra.url;
                              return (
                                <button key={extra.id}
                                  onClick={() => handleSelect(extra.url, extra.label, curr.label, curr.color)}
                                  style={{
                                    width: "100%", display: "flex", alignItems: "center",
                                    padding: "7px 14px 7px 28px",
                                    background: isActive ? "var(--bg3)" : "transparent",
                                    border: "none", borderLeft: isActive ? `3px solid ${curr.color}` : "3px solid transparent",
                                    cursor: "pointer", textAlign: "left", transition: "all .12s",
                                  }}
                                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg3)"; }}
                                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                                >
                                  <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, color: isActive ? "#fbbf24" : "var(--text3)", fontStyle: "italic" }}>
                                    {extra.label}
                                  </span>
                                </button>
                              );
                            })}
                          </>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}

        {/* Right content */}
        {activeItem ? (
          <PreviewCard item={activeItem} />
        ) : (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16, color: "var(--text3)",
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: "rgba(0,255,136,0.07)", border: "1px solid rgba(0,255,136,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#00ff88",
            }}>
              <GraduationCap size={34} strokeWidth={1.5} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text2)", marginBottom: 6, fontFamily: "var(--font)" }}>
                Select a Module to Preview
              </div>
              <div style={{ fontSize: 12, maxWidth: 320, lineHeight: 1.6 }}>
                Browse <strong style={{ color: "var(--text)" }}>{STUDY_PATHS.length} study paths</strong> and{" "}
                <strong style={{ color: "var(--text)" }}>{totalModules} modules</strong> from the left panel.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}