import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Prompt Versioning Lab",
  "kicker": "Generative AI interactive lab",
  "description": "Control generation, adaptation, multimodal behavior, evaluation, and safety with measurable trade-offs.",
  "mode": "tree",
  "variant": 3,
  "dark": false,
  "palette": {
    "primary": "hsl(285 72% 42%)",
    "secondary": "hsl(53 70% 42%)",
    "background": "hsl(285 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(285 30% 13%)",
    "muted": "hsl(285 14% 43%)",
    "line": "hsl(285 28% 86%)",
    "soft": "hsl(285 55% 92%)"
  },
  "controlTitle": "Prompt Versioning Lab controls",
  "controls": [
    {
      "label": "Instruction weight",
      "min": 0,
      "max": 100,
      "default": 39,
      "unit": "%",
      "help": "Tune instruction weight and observe system behavior."
    },
    {
      "label": "Example count",
      "min": 0,
      "max": 100,
      "default": 59,
      "unit": "",
      "help": "Stress example count across realistic operating ranges."
    },
    {
      "label": "Prompt revision",
      "min": 0,
      "max": 100,
      "default": 35,
      "unit": "",
      "help": "Use prompt revision to reveal boundary failures."
    }
  ],
  "visualTitle": "Prompt Versioning Lab live view",
  "metrics": [
    {
      "label": "Prompt score",
      "detail": "primary behavior"
    },
    {
      "label": "Versioning score",
      "detail": "robustness check"
    },
    {
      "label": "Work units",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "output=M(system,user,examples)",
  "costScale": 0.8500000000000001,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Version prompts as code",
      "body": "Principle 1: use this when reviewing prompt versioning lab behavior in production."
    },
    {
      "title": "Test behavioral contracts",
      "body": "Principle 2: use this when reviewing prompt versioning lab behavior in production."
    },
    {
      "title": "Record model and settings",
      "body": "Principle 3: use this when reviewing prompt versioning lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "prompt-versioning-001",
    title: "support reply prompt · case 001",
    scenario: "Investigate support reply prompt in a small clean workload.",
    failure: "silent edit causes regression; scenario 1 exposes the operational consequence.",
    subtitle: "Version prompts as code — experiment 001",
    explanation: "Adjust the controls to see how silent edit causes regression changes system quality, cost, and confidence.",
    lesson: "Version prompts as code. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1034,
    sampleSize: 276,
    signal: 98
  },
  {
    id: "prompt-versioning-002",
    title: "extraction template · case 002",
    scenario: "Investigate extraction template in a large noisy workload.",
    failure: "examples contradict policy; scenario 2 exposes the operational consequence.",
    subtitle: "Test behavioral contracts — experiment 002",
    explanation: "Adjust the controls to see how examples contradict policy changes system quality, cost, and confidence.",
    lesson: "Test behavioral contracts. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1041,
    sampleSize: 293,
    signal: 16
  },
  {
    id: "prompt-versioning-003",
    title: "coding assistant instruction · case 003",
    scenario: "Investigate coding assistant instruction in a shifted production slice.",
    failure: "instruction order changes outcome; scenario 3 exposes the operational consequence.",
    subtitle: "Record model and settings — experiment 003",
    explanation: "Adjust the controls to see how instruction order changes outcome changes system quality, cost, and confidence.",
    lesson: "Record model and settings. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1048,
    sampleSize: 310,
    signal: 35
  },
  {
    id: "prompt-versioning-004",
    title: "support reply prompt · case 004",
    scenario: "Investigate support reply prompt in a rare failure regime.",
    failure: "silent edit causes regression; scenario 4 exposes the operational consequence.",
    subtitle: "Version prompts as code — experiment 004",
    explanation: "Adjust the controls to see how silent edit causes regression changes system quality, cost, and confidence.",
    lesson: "Version prompts as code. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1055,
    sampleSize: 327,
    signal: 54
  },
  {
    id: "prompt-versioning-005",
    title: "extraction template · case 005",
    scenario: "Investigate extraction template in a high-scale environment.",
    failure: "examples contradict policy; scenario 5 exposes the operational consequence.",
    subtitle: "Test behavioral contracts — experiment 005",
    explanation: "Adjust the controls to see how examples contradict policy changes system quality, cost, and confidence.",
    lesson: "Test behavioral contracts. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1062,
    sampleSize: 344,
    signal: 73
  },
  {
    id: "prompt-versioning-006",
    title: "coding assistant instruction · case 006",
    scenario: "Investigate coding assistant instruction in a small clean workload.",
    failure: "instruction order changes outcome; scenario 6 exposes the operational consequence.",
    subtitle: "Record model and settings — experiment 006",
    explanation: "Adjust the controls to see how instruction order changes outcome changes system quality, cost, and confidence.",
    lesson: "Record model and settings. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1069,
    sampleSize: 361,
    signal: 92
  },
  {
    id: "prompt-versioning-007",
    title: "support reply prompt · case 007",
    scenario: "Investigate support reply prompt in a large noisy workload.",
    failure: "silent edit causes regression; scenario 7 exposes the operational consequence.",
    subtitle: "Version prompts as code — experiment 007",
    explanation: "Adjust the controls to see how silent edit causes regression changes system quality, cost, and confidence.",
    lesson: "Version prompts as code. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1076,
    sampleSize: 378,
    signal: 10
  },
  {
    id: "prompt-versioning-008",
    title: "extraction template · case 008",
    scenario: "Investigate extraction template in a shifted production slice.",
    failure: "examples contradict policy; scenario 8 exposes the operational consequence.",
    subtitle: "Test behavioral contracts — experiment 008",
    explanation: "Adjust the controls to see how examples contradict policy changes system quality, cost, and confidence.",
    lesson: "Test behavioral contracts. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1083,
    sampleSize: 395,
    signal: 29
  },
  {
    id: "prompt-versioning-009",
    title: "coding assistant instruction · case 009",
    scenario: "Investigate coding assistant instruction in a rare failure regime.",
    failure: "instruction order changes outcome; scenario 9 exposes the operational consequence.",
    subtitle: "Record model and settings — experiment 009",
    explanation: "Adjust the controls to see how instruction order changes outcome changes system quality, cost, and confidence.",
    lesson: "Record model and settings. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1090,
    sampleSize: 412,
    signal: 48
  },
  {
    id: "prompt-versioning-010",
    title: "support reply prompt · case 010",
    scenario: "Investigate support reply prompt in a high-scale environment.",
    failure: "silent edit causes regression; scenario 10 exposes the operational consequence.",
    subtitle: "Version prompts as code — experiment 010",
    explanation: "Adjust the controls to see how silent edit causes regression changes system quality, cost, and confidence.",
    lesson: "Version prompts as code. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1097,
    sampleSize: 429,
    signal: 67
  },
  {
    id: "prompt-versioning-011",
    title: "extraction template · case 011",
    scenario: "Investigate extraction template in a small clean workload.",
    failure: "examples contradict policy; scenario 11 exposes the operational consequence.",
    subtitle: "Test behavioral contracts — experiment 011",
    explanation: "Adjust the controls to see how examples contradict policy changes system quality, cost, and confidence.",
    lesson: "Test behavioral contracts. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1104,
    sampleSize: 446,
    signal: 86
  },
  {
    id: "prompt-versioning-012",
    title: "coding assistant instruction · case 012",
    scenario: "Investigate coding assistant instruction in a large noisy workload.",
    failure: "instruction order changes outcome; scenario 12 exposes the operational consequence.",
    subtitle: "Record model and settings — experiment 012",
    explanation: "Adjust the controls to see how instruction order changes outcome changes system quality, cost, and confidence.",
    lesson: "Record model and settings. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1111,
    sampleSize: 463,
    signal: 4
  }
];

export default function PromptVersioningLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

