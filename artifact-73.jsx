import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Transfer Learning Strategy Lab",
  "kicker": "Deep learning interactive lab",
  "description": "Inspect neural architectures, optimization at scale, compression, and robustness through live diagnostics.",
  "mode": "network",
  "variant": 3,
  "dark": false,
  "palette": {
    "primary": "hsl(3 72% 42%)",
    "secondary": "hsl(131 70% 42%)",
    "background": "hsl(3 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(3 30% 13%)",
    "muted": "hsl(3 14% 43%)",
    "line": "hsl(3 28% 86%)",
    "soft": "hsl(3 55% 92%)"
  },
  "controlTitle": "Transfer Learning Strategy Lab controls",
  "controls": [
    {
      "label": "Frozen layers",
      "min": 0,
      "max": 100,
      "default": 46,
      "unit": "%",
      "help": "Tune frozen layers and observe system behavior."
    },
    {
      "label": "Target data size",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress target data size across realistic operating ranges."
    },
    {
      "label": "Fine-tune rate",
      "min": 0,
      "max": 100,
      "default": 29,
      "unit": "",
      "help": "Use fine-tune rate to reveal boundary failures."
    }
  ],
  "visualTitle": "Transfer Learning Strategy Lab live view",
  "metrics": [
    {
      "label": "Transfer score",
      "detail": "primary behavior"
    },
    {
      "label": "Learning score",
      "detail": "robustness check"
    },
    {
      "label": "Strategy score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "θ′=θ_pretrained−η∇L_target",
  "costScale": 0.95,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Transfer depends on similarity",
      "body": "Principle 1: use this when reviewing transfer learning strategy lab behavior in production."
    },
    {
      "title": "Unfreeze gradually",
      "body": "Principle 2: use this when reviewing transfer learning strategy lab behavior in production."
    },
    {
      "title": "Use layer-wise rates",
      "body": "Principle 3: use this when reviewing transfer learning strategy lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "transfer-learning-001",
    title: "medical image transfer · case 001",
    scenario: "Investigate medical image transfer in a high-scale environment.",
    failure: "all layers forget features; scenario 1 exposes the operational consequence.",
    subtitle: "Transfer depends on similarity — experiment 001",
    explanation: "Adjust the controls to see how all layers forget features changes system quality, cost, and confidence.",
    lesson: "Transfer depends on similarity. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 956,
    sampleSize: 270,
    signal: 92
  },
  {
    id: "transfer-learning-002",
    title: "domain text adaptation · case 002",
    scenario: "Investigate domain text adaptation in a small clean workload.",
    failure: "frozen trunk mismatches domain; scenario 2 exposes the operational consequence.",
    subtitle: "Unfreeze gradually — experiment 002",
    explanation: "Adjust the controls to see how frozen trunk mismatches domain changes system quality, cost, and confidence.",
    lesson: "Unfreeze gradually. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 963,
    sampleSize: 287,
    signal: 10
  },
  {
    id: "transfer-learning-003",
    title: "industrial audio classifier · case 003",
    scenario: "Investigate industrial audio classifier in a large noisy workload.",
    failure: "high rate destroys initialization; scenario 3 exposes the operational consequence.",
    subtitle: "Use layer-wise rates — experiment 003",
    explanation: "Adjust the controls to see how high rate destroys initialization changes system quality, cost, and confidence.",
    lesson: "Use layer-wise rates. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 970,
    sampleSize: 304,
    signal: 29
  },
  {
    id: "transfer-learning-004",
    title: "medical image transfer · case 004",
    scenario: "Investigate medical image transfer in a shifted production slice.",
    failure: "all layers forget features; scenario 4 exposes the operational consequence.",
    subtitle: "Transfer depends on similarity — experiment 004",
    explanation: "Adjust the controls to see how all layers forget features changes system quality, cost, and confidence.",
    lesson: "Transfer depends on similarity. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 977,
    sampleSize: 321,
    signal: 48
  },
  {
    id: "transfer-learning-005",
    title: "domain text adaptation · case 005",
    scenario: "Investigate domain text adaptation in a rare failure regime.",
    failure: "frozen trunk mismatches domain; scenario 5 exposes the operational consequence.",
    subtitle: "Unfreeze gradually — experiment 005",
    explanation: "Adjust the controls to see how frozen trunk mismatches domain changes system quality, cost, and confidence.",
    lesson: "Unfreeze gradually. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 984,
    sampleSize: 338,
    signal: 67
  },
  {
    id: "transfer-learning-006",
    title: "industrial audio classifier · case 006",
    scenario: "Investigate industrial audio classifier in a high-scale environment.",
    failure: "high rate destroys initialization; scenario 6 exposes the operational consequence.",
    subtitle: "Use layer-wise rates — experiment 006",
    explanation: "Adjust the controls to see how high rate destroys initialization changes system quality, cost, and confidence.",
    lesson: "Use layer-wise rates. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 991,
    sampleSize: 355,
    signal: 86
  },
  {
    id: "transfer-learning-007",
    title: "medical image transfer · case 007",
    scenario: "Investigate medical image transfer in a small clean workload.",
    failure: "all layers forget features; scenario 7 exposes the operational consequence.",
    subtitle: "Transfer depends on similarity — experiment 007",
    explanation: "Adjust the controls to see how all layers forget features changes system quality, cost, and confidence.",
    lesson: "Transfer depends on similarity. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 998,
    sampleSize: 372,
    signal: 4
  },
  {
    id: "transfer-learning-008",
    title: "domain text adaptation · case 008",
    scenario: "Investigate domain text adaptation in a large noisy workload.",
    failure: "frozen trunk mismatches domain; scenario 8 exposes the operational consequence.",
    subtitle: "Unfreeze gradually — experiment 008",
    explanation: "Adjust the controls to see how frozen trunk mismatches domain changes system quality, cost, and confidence.",
    lesson: "Unfreeze gradually. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1005,
    sampleSize: 389,
    signal: 23
  },
  {
    id: "transfer-learning-009",
    title: "industrial audio classifier · case 009",
    scenario: "Investigate industrial audio classifier in a shifted production slice.",
    failure: "high rate destroys initialization; scenario 9 exposes the operational consequence.",
    subtitle: "Use layer-wise rates — experiment 009",
    explanation: "Adjust the controls to see how high rate destroys initialization changes system quality, cost, and confidence.",
    lesson: "Use layer-wise rates. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1012,
    sampleSize: 406,
    signal: 42
  },
  {
    id: "transfer-learning-010",
    title: "medical image transfer · case 010",
    scenario: "Investigate medical image transfer in a rare failure regime.",
    failure: "all layers forget features; scenario 10 exposes the operational consequence.",
    subtitle: "Transfer depends on similarity — experiment 010",
    explanation: "Adjust the controls to see how all layers forget features changes system quality, cost, and confidence.",
    lesson: "Transfer depends on similarity. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1019,
    sampleSize: 423,
    signal: 61
  },
  {
    id: "transfer-learning-011",
    title: "domain text adaptation · case 011",
    scenario: "Investigate domain text adaptation in a high-scale environment.",
    failure: "frozen trunk mismatches domain; scenario 11 exposes the operational consequence.",
    subtitle: "Unfreeze gradually — experiment 011",
    explanation: "Adjust the controls to see how frozen trunk mismatches domain changes system quality, cost, and confidence.",
    lesson: "Unfreeze gradually. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1026,
    sampleSize: 440,
    signal: 80
  },
  {
    id: "transfer-learning-012",
    title: "industrial audio classifier · case 012",
    scenario: "Investigate industrial audio classifier in a small clean workload.",
    failure: "high rate destroys initialization; scenario 12 exposes the operational consequence.",
    subtitle: "Use layer-wise rates — experiment 012",
    explanation: "Adjust the controls to see how high rate destroys initialization changes system quality, cost, and confidence.",
    lesson: "Use layer-wise rates. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1033,
    sampleSize: 457,
    signal: 99
  }
];

export default function TransferLearningStrategyLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

