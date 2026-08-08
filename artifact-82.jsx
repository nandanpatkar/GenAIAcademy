import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Hallucination Evaluation Lab",
  "kicker": "Generative AI interactive lab",
  "description": "Control generation, adaptation, multimodal behavior, evaluation, and safety with measurable trade-offs.",
  "mode": "network",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "hsl(66 72% 42%)",
    "secondary": "hsl(194 70% 42%)",
    "background": "hsl(66 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(66 30% 13%)",
    "muted": "hsl(66 14% 43%)",
    "line": "hsl(66 28% 86%)",
    "soft": "hsl(66 55% 92%)"
  },
  "controlTitle": "Hallucination Evaluation Lab controls",
  "controls": [
    {
      "label": "Claim granularity",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune claim granularity and observe system behavior."
    },
    {
      "label": "Evidence coverage",
      "min": 0,
      "max": 100,
      "default": 62,
      "unit": "",
      "help": "Stress evidence coverage across realistic operating ranges."
    },
    {
      "label": "Abstain threshold",
      "min": 0,
      "max": 100,
      "default": 38,
      "unit": "",
      "help": "Use abstain threshold to reveal boundary failures."
    }
  ],
  "visualTitle": "Hallucination Evaluation Lab live view",
  "metrics": [
    {
      "label": "Hallucination score",
      "detail": "primary behavior"
    },
    {
      "label": "Evaluation score",
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
  "formula": "faithfulness=supported_claims/all_claims",
  "costScale": 1.15,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Evaluate claim by claim",
      "body": "Principle 1: use this when reviewing hallucination evaluation lab behavior in production."
    },
    {
      "title": "Separate correctness and grounding",
      "body": "Principle 2: use this when reviewing hallucination evaluation lab behavior in production."
    },
    {
      "title": "Include abstention",
      "body": "Principle 3: use this when reviewing hallucination evaluation lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "hallucination-eval-001",
    title: "grounded summary review · case 001",
    scenario: "Investigate grounded summary review in a rare failure regime.",
    failure: "fluent claim lacks evidence; scenario 1 exposes the operational consequence.",
    subtitle: "Evaluate claim by claim — experiment 001",
    explanation: "Adjust the controls to see how fluent claim lacks evidence changes system quality, cost, and confidence.",
    lesson: "Evaluate claim by claim. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1073,
    sampleSize: 279,
    signal: 0
  },
  {
    id: "hallucination-eval-002",
    title: "product answer audit · case 002",
    scenario: "Investigate product answer audit in a high-scale environment.",
    failure: "reference itself is wrong; scenario 2 exposes the operational consequence.",
    subtitle: "Separate correctness and grounding — experiment 002",
    explanation: "Adjust the controls to see how reference itself is wrong changes system quality, cost, and confidence.",
    lesson: "Separate correctness and grounding. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1080,
    sampleSize: 296,
    signal: 19
  },
  {
    id: "hallucination-eval-003",
    title: "technical explanation check · case 003",
    scenario: "Investigate technical explanation check in a small clean workload.",
    failure: "judge model shares bias; scenario 3 exposes the operational consequence.",
    subtitle: "Include abstention — experiment 003",
    explanation: "Adjust the controls to see how judge model shares bias changes system quality, cost, and confidence.",
    lesson: "Include abstention. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1087,
    sampleSize: 313,
    signal: 38
  },
  {
    id: "hallucination-eval-004",
    title: "grounded summary review · case 004",
    scenario: "Investigate grounded summary review in a large noisy workload.",
    failure: "fluent claim lacks evidence; scenario 4 exposes the operational consequence.",
    subtitle: "Evaluate claim by claim — experiment 004",
    explanation: "Adjust the controls to see how fluent claim lacks evidence changes system quality, cost, and confidence.",
    lesson: "Evaluate claim by claim. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1094,
    sampleSize: 330,
    signal: 57
  },
  {
    id: "hallucination-eval-005",
    title: "product answer audit · case 005",
    scenario: "Investigate product answer audit in a shifted production slice.",
    failure: "reference itself is wrong; scenario 5 exposes the operational consequence.",
    subtitle: "Separate correctness and grounding — experiment 005",
    explanation: "Adjust the controls to see how reference itself is wrong changes system quality, cost, and confidence.",
    lesson: "Separate correctness and grounding. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1101,
    sampleSize: 347,
    signal: 76
  },
  {
    id: "hallucination-eval-006",
    title: "technical explanation check · case 006",
    scenario: "Investigate technical explanation check in a rare failure regime.",
    failure: "judge model shares bias; scenario 6 exposes the operational consequence.",
    subtitle: "Include abstention — experiment 006",
    explanation: "Adjust the controls to see how judge model shares bias changes system quality, cost, and confidence.",
    lesson: "Include abstention. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1108,
    sampleSize: 364,
    signal: 95
  },
  {
    id: "hallucination-eval-007",
    title: "grounded summary review · case 007",
    scenario: "Investigate grounded summary review in a high-scale environment.",
    failure: "fluent claim lacks evidence; scenario 7 exposes the operational consequence.",
    subtitle: "Evaluate claim by claim — experiment 007",
    explanation: "Adjust the controls to see how fluent claim lacks evidence changes system quality, cost, and confidence.",
    lesson: "Evaluate claim by claim. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1115,
    sampleSize: 381,
    signal: 13
  },
  {
    id: "hallucination-eval-008",
    title: "product answer audit · case 008",
    scenario: "Investigate product answer audit in a small clean workload.",
    failure: "reference itself is wrong; scenario 8 exposes the operational consequence.",
    subtitle: "Separate correctness and grounding — experiment 008",
    explanation: "Adjust the controls to see how reference itself is wrong changes system quality, cost, and confidence.",
    lesson: "Separate correctness and grounding. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1122,
    sampleSize: 398,
    signal: 32
  },
  {
    id: "hallucination-eval-009",
    title: "technical explanation check · case 009",
    scenario: "Investigate technical explanation check in a large noisy workload.",
    failure: "judge model shares bias; scenario 9 exposes the operational consequence.",
    subtitle: "Include abstention — experiment 009",
    explanation: "Adjust the controls to see how judge model shares bias changes system quality, cost, and confidence.",
    lesson: "Include abstention. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1129,
    sampleSize: 415,
    signal: 51
  },
  {
    id: "hallucination-eval-010",
    title: "grounded summary review · case 010",
    scenario: "Investigate grounded summary review in a shifted production slice.",
    failure: "fluent claim lacks evidence; scenario 10 exposes the operational consequence.",
    subtitle: "Evaluate claim by claim — experiment 010",
    explanation: "Adjust the controls to see how fluent claim lacks evidence changes system quality, cost, and confidence.",
    lesson: "Evaluate claim by claim. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1136,
    sampleSize: 432,
    signal: 70
  },
  {
    id: "hallucination-eval-011",
    title: "product answer audit · case 011",
    scenario: "Investigate product answer audit in a rare failure regime.",
    failure: "reference itself is wrong; scenario 11 exposes the operational consequence.",
    subtitle: "Separate correctness and grounding — experiment 011",
    explanation: "Adjust the controls to see how reference itself is wrong changes system quality, cost, and confidence.",
    lesson: "Separate correctness and grounding. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1143,
    sampleSize: 449,
    signal: 89
  },
  {
    id: "hallucination-eval-012",
    title: "technical explanation check · case 012",
    scenario: "Investigate technical explanation check in a high-scale environment.",
    failure: "judge model shares bias; scenario 12 exposes the operational consequence.",
    subtitle: "Include abstention — experiment 012",
    explanation: "Adjust the controls to see how judge model shares bias changes system quality, cost, and confidence.",
    lesson: "Include abstention. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1150,
    sampleSize: 466,
    signal: 7
  }
];

export default function HallucinationEvaluationLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

