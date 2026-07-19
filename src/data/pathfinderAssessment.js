// The Pathfinder assessment is intentionally lightweight and supportive.
// It measures starting confidence across useful learning domains; it is not
// an aptitude or intelligence test.

export const PATHFINDER_QUESTIONS = [
  {
    key: "mission",
    step: "direction",
    eyebrow: "01 / DIRECTION",
    title: "What would you love to be able to build?",
    helper: "Your destination helps us choose the right first route through the workspace.",
    type: "choice",
    options: [
      { id: "genai-builder", label: "GenAI applications", detail: "RAG, agents, copilots, and production AI", icon: "spark" },
      { id: "data-scientist", label: "Data science & ML", detail: "Models, experiments, and insight from data", icon: "chart" },
      { id: "systems-architect", label: "AI systems & cloud", detail: "Reliable architectures, APIs, and scale", icon: "layers" },
      { id: "interview-ready", label: "Career & interviews", detail: "Think clearly, code confidently, and communicate", icon: "target" },
      { id: "explorer", label: "Explore the foundations", detail: "Build a strong mental model before specializing", icon: "compass" },
    ],
  },
  {
    key: "goal",
    step: "direction",
    eyebrow: "02 / YOUR SIGNAL",
    title: "Tell us what success looks like.",
    helper: "A sentence is enough. We use it to make the recommendation feel like yours.",
    type: "text",
    placeholder: "e.g. I want to ship a RAG assistant for internal company docs",
  },
  {
    key: "background",
    step: "baseline",
    eyebrow: "03 / BASELINE",
    title: "How close are you to the code?",
    helper: "There is no wrong answer. This only sets your starting altitude.",
    type: "choice",
    options: [
      { id: "new", label: "New to programming", detail: "I am starting from first principles", score: { programming: 18, foundations: 22 } },
      { id: "some-code", label: "I can write small scripts", detail: "I understand the basics and want direction", score: { programming: 42, foundations: 34 } },
      { id: "python", label: "Comfortable with Python", detail: "I can build with libraries and debug code", score: { programming: 68, foundations: 48 } },
      { id: "experienced", label: "Experienced engineer", detail: "I want sharper AI and systems depth", score: { programming: 86, foundations: 68 } },
    ],
  },
  {
    key: "python",
    step: "baseline",
    eyebrow: "04 / PROGRAMMING",
    title: "Which task feels most familiar?",
    helper: "This helps us decide whether to start with implementation or concepts.",
    type: "choice",
    options: [
      { id: "read", label: "Read code", detail: "I can follow code but rarely write it", score: { programming: 28 } },
      { id: "scripts", label: "Write scripts", detail: "Functions, data structures, and APIs", score: { programming: 52 } },
      { id: "projects", label: "Ship small projects", detail: "I can structure, test, and debug a project", score: { programming: 74 } },
      { id: "production", label: "Build production software", detail: "Services, tests, deployments, and trade-offs", score: { programming: 92, systems: 70 } },
    ],
  },
  {
    key: "foundations",
    step: "baseline",
    eyebrow: "05 / ML FOUNDATIONS",
    title: "How would you describe your ML intuition?",
    helper: "Think of this as a confidence check, not a graded exam.",
    type: "choice",
    options: [
      { id: "curious", label: "Curious, still forming", detail: "Terms like training and features are new", score: { foundations: 22, math: 20 } },
      { id: "concepts", label: "I know the main concepts", detail: "I can explain models at a high level", score: { foundations: 48, math: 38 } },
      { id: "hands-on", label: "I have trained models", detail: "I understand evaluation and iteration", score: { foundations: 70, math: 58 } },
      { id: "deep", label: "I can reason about trade-offs", detail: "I want deeper theory or applied specialization", score: { foundations: 88, math: 78 } },
    ],
  },
  {
    key: "genai",
    step: "baseline",
    eyebrow: "06 / GENAI",
    title: "Where are you with modern AI systems?",
    helper: "We will use this to decide how quickly to move toward agents, RAG, and evaluation.",
    type: "choice",
    options: [
      { id: "watching", label: "I am just getting oriented", detail: "I want a clear map of the landscape", score: { genai: 18 } },
      { id: "prompting", label: "I use models and prompts", detail: "I want to turn experiments into systems", score: { genai: 42 } },
      { id: "building", label: "I have built with APIs", detail: "I want better retrieval, agents, and evaluation", score: { genai: 68 } },
      { id: "shipping", label: "I ship AI features", detail: "I want architecture, reliability, and scale", score: { genai: 88, systems: 64 } },
    ],
  },
  {
    key: "systems",
    step: "baseline",
    eyebrow: "07 / SYSTEMS",
    title: "How much architecture do you want in the mix?",
    helper: "This lets us surface the right simulators and build environments.",
    type: "choice",
    options: [
      { id: "none", label: "Keep it focused", detail: "I want to learn the core ideas first", score: { systems: 24 } },
      { id: "some", label: "A practical layer", detail: "APIs, storage, deployment, and debugging", score: { systems: 48 } },
      { id: "serious", label: "A major part of my goal", detail: "Design resilient AI products end to end", score: { systems: 74 } },
      { id: "specialist", label: "This is my edge", detail: "Cloud architecture and trade-offs are my focus", score: { systems: 92 } },
    ],
  },
  {
    key: "time",
    step: "rhythm",
    eyebrow: "08 / RHYTHM",
    title: "What can you protect each week?",
    helper: "A sustainable plan beats an ambitious plan you cannot keep.",
    type: "choice",
    options: [
      { id: "light", label: "1–3 hours", detail: "Small, focused sessions", score: { consistency: 42 } },
      { id: "steady", label: "5–7 hours", detail: "A reliable weekly rhythm", score: { consistency: 68 } },
      { id: "deep", label: "10+ hours", detail: "I am ready for an immersive sprint", score: { consistency: 92 } },
      { id: "unknown", label: "I am finding my rhythm", detail: "Help me start with something manageable", score: { consistency: 50 } },
    ],
  },
  {
    key: "format",
    step: "rhythm",
    eyebrow: "09 / MODE",
    title: "What kind of momentum keeps you engaged?",
    helper: "We will shape your first actions around the way you learn best.",
    type: "choice",
    options: [
      { id: "build", label: "Build first", detail: "Give me a project and let me learn by doing" },
      { id: "learn", label: "Understand first", detail: "Give me a structured foundation and clear notes" },
      { id: "mixed", label: "A deliberate mix", detail: "Alternate concepts, practice, and projects" },
      { id: "practice", label: "Practice under pressure", detail: "Interview questions, quizzes, and feedback" },
    ],
  },
];

export const PATHFINDER_PHASES = [
  { id: "direction", label: "Direction" },
  { id: "baseline", label: "Baseline" },
  { id: "rhythm", label: "Rhythm" },
];

export const getAssessmentOption = (question, value) =>
  question?.options?.find((option) => option.id === value);

export const getAssessmentLabel = (question, value) =>
  getAssessmentOption(question, value)?.label || value || "Not answered";
