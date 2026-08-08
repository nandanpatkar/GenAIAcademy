import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "SVM Margin Lab",
  "kicker": "Machine learning interactive lab",
  "description": "Experiment with model geometry, selection, validation, and explainability using production-minded cases.",
  "mode": "timeline",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "hsl(112 72% 42%)",
    "secondary": "hsl(240 70% 42%)",
    "background": "hsl(112 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(112 30% 13%)",
    "muted": "hsl(112 14% 43%)",
    "line": "hsl(112 28% 86%)",
    "soft": "hsl(112 55% 92%)"
  },
  "controlTitle": "SVM Margin Lab controls",
  "controls": [
    {
      "label": "Penalty C",
      "min": 0,
      "max": 100,
      "default": 46,
      "unit": "%",
      "help": "Tune penalty c and observe system behavior."
    },
    {
      "label": "Kernel width",
      "min": 0,
      "max": 100,
      "default": 62,
      "unit": "",
      "help": "Stress kernel width across realistic operating ranges."
    },
    {
      "label": "Margin noise",
      "min": 0,
      "max": 100,
      "default": 33,
      "unit": "",
      "help": "Use margin noise to reveal boundary failures."
    }
  ],
  "visualTitle": "SVM Margin Lab live view",
  "metrics": [
    {
      "label": "Margin score",
      "detail": "primary behavior"
    },
    {
      "label": "Stability margin",
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
  "formula": "min ½||w||² + CΣξᵢ",
  "costScale": 1.05,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Margins trade fit for robustness",
      "body": "Principle 1: use this when reviewing svm margin lab behavior in production."
    },
    {
      "title": "Kernels reshape geometry",
      "body": "Principle 2: use this when reviewing svm margin lab behavior in production."
    },
    {
      "title": "Support vectors carry the boundary",
      "body": "Principle 3: use this when reviewing svm margin lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "svm-margin-001",
    title: "two-class boundary · case 001",
    scenario: "Investigate two-class boundary in a large noisy workload.",
    failure: "large C chases violations; scenario 1 exposes the operational consequence.",
    subtitle: "Margins trade fit for robustness — experiment 001",
    explanation: "Adjust the controls to see how large C chases violations changes system quality, cost, and confidence.",
    lesson: "Margins trade fit for robustness. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 787,
    sampleSize: 257,
    signal: 79
  },
  {
    id: "svm-margin-002",
    title: "nonlinear quality gate · case 002",
    scenario: "Investigate nonlinear quality gate in a shifted production slice.",
    failure: "kernel width memorizes points; scenario 2 exposes the operational consequence.",
    subtitle: "Kernels reshape geometry — experiment 002",
    explanation: "Adjust the controls to see how kernel width memorizes points changes system quality, cost, and confidence.",
    lesson: "Kernels reshape geometry. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 794,
    sampleSize: 274,
    signal: 98
  },
  {
    id: "svm-margin-003",
    title: "sparse text classifier · case 003",
    scenario: "Investigate sparse text classifier in a rare failure regime.",
    failure: "unscaled features warp margin; scenario 3 exposes the operational consequence.",
    subtitle: "Support vectors carry the boundary — experiment 003",
    explanation: "Adjust the controls to see how unscaled features warp margin changes system quality, cost, and confidence.",
    lesson: "Support vectors carry the boundary. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 801,
    sampleSize: 291,
    signal: 16
  },
  {
    id: "svm-margin-004",
    title: "two-class boundary · case 004",
    scenario: "Investigate two-class boundary in a high-scale environment.",
    failure: "large C chases violations; scenario 4 exposes the operational consequence.",
    subtitle: "Margins trade fit for robustness — experiment 004",
    explanation: "Adjust the controls to see how large C chases violations changes system quality, cost, and confidence.",
    lesson: "Margins trade fit for robustness. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 808,
    sampleSize: 308,
    signal: 35
  },
  {
    id: "svm-margin-005",
    title: "nonlinear quality gate · case 005",
    scenario: "Investigate nonlinear quality gate in a small clean workload.",
    failure: "kernel width memorizes points; scenario 5 exposes the operational consequence.",
    subtitle: "Kernels reshape geometry — experiment 005",
    explanation: "Adjust the controls to see how kernel width memorizes points changes system quality, cost, and confidence.",
    lesson: "Kernels reshape geometry. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 815,
    sampleSize: 325,
    signal: 54
  },
  {
    id: "svm-margin-006",
    title: "sparse text classifier · case 006",
    scenario: "Investigate sparse text classifier in a large noisy workload.",
    failure: "unscaled features warp margin; scenario 6 exposes the operational consequence.",
    subtitle: "Support vectors carry the boundary — experiment 006",
    explanation: "Adjust the controls to see how unscaled features warp margin changes system quality, cost, and confidence.",
    lesson: "Support vectors carry the boundary. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 822,
    sampleSize: 342,
    signal: 73
  },
  {
    id: "svm-margin-007",
    title: "two-class boundary · case 007",
    scenario: "Investigate two-class boundary in a shifted production slice.",
    failure: "large C chases violations; scenario 7 exposes the operational consequence.",
    subtitle: "Margins trade fit for robustness — experiment 007",
    explanation: "Adjust the controls to see how large C chases violations changes system quality, cost, and confidence.",
    lesson: "Margins trade fit for robustness. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 829,
    sampleSize: 359,
    signal: 92
  },
  {
    id: "svm-margin-008",
    title: "nonlinear quality gate · case 008",
    scenario: "Investigate nonlinear quality gate in a rare failure regime.",
    failure: "kernel width memorizes points; scenario 8 exposes the operational consequence.",
    subtitle: "Kernels reshape geometry — experiment 008",
    explanation: "Adjust the controls to see how kernel width memorizes points changes system quality, cost, and confidence.",
    lesson: "Kernels reshape geometry. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 836,
    sampleSize: 376,
    signal: 10
  },
  {
    id: "svm-margin-009",
    title: "sparse text classifier · case 009",
    scenario: "Investigate sparse text classifier in a high-scale environment.",
    failure: "unscaled features warp margin; scenario 9 exposes the operational consequence.",
    subtitle: "Support vectors carry the boundary — experiment 009",
    explanation: "Adjust the controls to see how unscaled features warp margin changes system quality, cost, and confidence.",
    lesson: "Support vectors carry the boundary. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 843,
    sampleSize: 393,
    signal: 29
  },
  {
    id: "svm-margin-010",
    title: "two-class boundary · case 010",
    scenario: "Investigate two-class boundary in a small clean workload.",
    failure: "large C chases violations; scenario 10 exposes the operational consequence.",
    subtitle: "Margins trade fit for robustness — experiment 010",
    explanation: "Adjust the controls to see how large C chases violations changes system quality, cost, and confidence.",
    lesson: "Margins trade fit for robustness. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 850,
    sampleSize: 410,
    signal: 48
  },
  {
    id: "svm-margin-011",
    title: "nonlinear quality gate · case 011",
    scenario: "Investigate nonlinear quality gate in a large noisy workload.",
    failure: "kernel width memorizes points; scenario 11 exposes the operational consequence.",
    subtitle: "Kernels reshape geometry — experiment 011",
    explanation: "Adjust the controls to see how kernel width memorizes points changes system quality, cost, and confidence.",
    lesson: "Kernels reshape geometry. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 857,
    sampleSize: 427,
    signal: 67
  },
  {
    id: "svm-margin-012",
    title: "sparse text classifier · case 012",
    scenario: "Investigate sparse text classifier in a shifted production slice.",
    failure: "unscaled features warp margin; scenario 12 exposes the operational consequence.",
    subtitle: "Support vectors carry the boundary — experiment 012",
    explanation: "Adjust the controls to see how unscaled features warp margin changes system quality, cost, and confidence.",
    lesson: "Support vectors carry the boundary. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 864,
    sampleSize: 444,
    signal: 86
  }
];

export default function SvmMarginLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

