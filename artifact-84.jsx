import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "LoRA Adaptation Lab",
  "kicker": "Generative AI interactive lab",
  "description": "Control generation, adaptation, multimodal behavior, evaluation, and safety with measurable trade-offs.",
  "mode": "distribution",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "hsl(160 72% 42%)",
    "secondary": "hsl(288 70% 42%)",
    "background": "hsl(160 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(160 30% 13%)",
    "muted": "hsl(160 14% 43%)",
    "line": "hsl(160 28% 86%)",
    "soft": "hsl(160 55% 92%)"
  },
  "controlTitle": "LoRA Adaptation Lab controls",
  "controls": [
    {
      "label": "Adapter rank",
      "min": 0,
      "max": 100,
      "default": 44,
      "unit": "%",
      "help": "Tune adapter rank and observe system behavior."
    },
    {
      "label": "Target modules",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress target modules across realistic operating ranges."
    },
    {
      "label": "Training rate",
      "min": 0,
      "max": 100,
      "default": 40,
      "unit": "",
      "help": "Use training rate to reveal boundary failures."
    }
  ],
  "visualTitle": "LoRA Adaptation Lab live view",
  "metrics": [
    {
      "label": "LoRA score",
      "detail": "primary behavior"
    },
    {
      "label": "Adaptation score",
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
  "formula": "W′=W+BA, rank(B A)=r",
  "costScale": 0.65,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Adapters trade capacity for cost",
      "body": "Principle 1: use this when reviewing lora adaptation lab behavior in production."
    },
    {
      "title": "Track base compatibility",
      "body": "Principle 2: use this when reviewing lora adaptation lab behavior in production."
    },
    {
      "title": "Evaluate forgetting",
      "body": "Principle 3: use this when reviewing lora adaptation lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "lora-adaptation-001",
    title: "domain language adapter · case 001",
    scenario: "Investigate domain language adapter in a small clean workload.",
    failure: "rank too small bottlenecks; scenario 1 exposes the operational consequence.",
    subtitle: "Adapters trade capacity for cost — experiment 001",
    explanation: "Adjust the controls to see how rank too small bottlenecks changes system quality, cost, and confidence.",
    lesson: "Adapters trade capacity for cost. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1099,
    sampleSize: 281,
    signal: 2
  },
  {
    id: "lora-adaptation-002",
    title: "style adaptation run · case 002",
    scenario: "Investigate style adaptation run in a large noisy workload.",
    failure: "wrong modules are targeted; scenario 2 exposes the operational consequence.",
    subtitle: "Track base compatibility — experiment 002",
    explanation: "Adjust the controls to see how wrong modules are targeted changes system quality, cost, and confidence.",
    lesson: "Track base compatibility. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1106,
    sampleSize: 298,
    signal: 21
  },
  {
    id: "lora-adaptation-003",
    title: "task-specific assistant · case 003",
    scenario: "Investigate task-specific assistant in a shifted production slice.",
    failure: "adapter overfits examples; scenario 3 exposes the operational consequence.",
    subtitle: "Evaluate forgetting — experiment 003",
    explanation: "Adjust the controls to see how adapter overfits examples changes system quality, cost, and confidence.",
    lesson: "Evaluate forgetting. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1113,
    sampleSize: 315,
    signal: 40
  },
  {
    id: "lora-adaptation-004",
    title: "domain language adapter · case 004",
    scenario: "Investigate domain language adapter in a rare failure regime.",
    failure: "rank too small bottlenecks; scenario 4 exposes the operational consequence.",
    subtitle: "Adapters trade capacity for cost — experiment 004",
    explanation: "Adjust the controls to see how rank too small bottlenecks changes system quality, cost, and confidence.",
    lesson: "Adapters trade capacity for cost. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1120,
    sampleSize: 332,
    signal: 59
  },
  {
    id: "lora-adaptation-005",
    title: "style adaptation run · case 005",
    scenario: "Investigate style adaptation run in a high-scale environment.",
    failure: "wrong modules are targeted; scenario 5 exposes the operational consequence.",
    subtitle: "Track base compatibility — experiment 005",
    explanation: "Adjust the controls to see how wrong modules are targeted changes system quality, cost, and confidence.",
    lesson: "Track base compatibility. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1127,
    sampleSize: 349,
    signal: 78
  },
  {
    id: "lora-adaptation-006",
    title: "task-specific assistant · case 006",
    scenario: "Investigate task-specific assistant in a small clean workload.",
    failure: "adapter overfits examples; scenario 6 exposes the operational consequence.",
    subtitle: "Evaluate forgetting — experiment 006",
    explanation: "Adjust the controls to see how adapter overfits examples changes system quality, cost, and confidence.",
    lesson: "Evaluate forgetting. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1134,
    sampleSize: 366,
    signal: 97
  },
  {
    id: "lora-adaptation-007",
    title: "domain language adapter · case 007",
    scenario: "Investigate domain language adapter in a large noisy workload.",
    failure: "rank too small bottlenecks; scenario 7 exposes the operational consequence.",
    subtitle: "Adapters trade capacity for cost — experiment 007",
    explanation: "Adjust the controls to see how rank too small bottlenecks changes system quality, cost, and confidence.",
    lesson: "Adapters trade capacity for cost. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1141,
    sampleSize: 383,
    signal: 15
  },
  {
    id: "lora-adaptation-008",
    title: "style adaptation run · case 008",
    scenario: "Investigate style adaptation run in a shifted production slice.",
    failure: "wrong modules are targeted; scenario 8 exposes the operational consequence.",
    subtitle: "Track base compatibility — experiment 008",
    explanation: "Adjust the controls to see how wrong modules are targeted changes system quality, cost, and confidence.",
    lesson: "Track base compatibility. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1148,
    sampleSize: 400,
    signal: 34
  },
  {
    id: "lora-adaptation-009",
    title: "task-specific assistant · case 009",
    scenario: "Investigate task-specific assistant in a rare failure regime.",
    failure: "adapter overfits examples; scenario 9 exposes the operational consequence.",
    subtitle: "Evaluate forgetting — experiment 009",
    explanation: "Adjust the controls to see how adapter overfits examples changes system quality, cost, and confidence.",
    lesson: "Evaluate forgetting. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1155,
    sampleSize: 417,
    signal: 53
  },
  {
    id: "lora-adaptation-010",
    title: "domain language adapter · case 010",
    scenario: "Investigate domain language adapter in a high-scale environment.",
    failure: "rank too small bottlenecks; scenario 10 exposes the operational consequence.",
    subtitle: "Adapters trade capacity for cost — experiment 010",
    explanation: "Adjust the controls to see how rank too small bottlenecks changes system quality, cost, and confidence.",
    lesson: "Adapters trade capacity for cost. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1162,
    sampleSize: 434,
    signal: 72
  },
  {
    id: "lora-adaptation-011",
    title: "style adaptation run · case 011",
    scenario: "Investigate style adaptation run in a small clean workload.",
    failure: "wrong modules are targeted; scenario 11 exposes the operational consequence.",
    subtitle: "Track base compatibility — experiment 011",
    explanation: "Adjust the controls to see how wrong modules are targeted changes system quality, cost, and confidence.",
    lesson: "Track base compatibility. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1169,
    sampleSize: 451,
    signal: 91
  },
  {
    id: "lora-adaptation-012",
    title: "task-specific assistant · case 012",
    scenario: "Investigate task-specific assistant in a large noisy workload.",
    failure: "adapter overfits examples; scenario 12 exposes the operational consequence.",
    subtitle: "Evaluate forgetting — experiment 012",
    explanation: "Adjust the controls to see how adapter overfits examples changes system quality, cost, and confidence.",
    lesson: "Evaluate forgetting. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1176,
    sampleSize: 468,
    signal: 9
  }
];

export default function LoraAdaptationLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

