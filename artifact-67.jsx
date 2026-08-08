import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Model Explainability Lab",
  "kicker": "Machine learning interactive lab",
  "description": "Experiment with model geometry, selection, validation, and explainability using production-minded cases.",
  "mode": "curve",
  "variant": 3,
  "dark": false,
  "palette": {
    "primary": "hsl(81 72% 42%)",
    "secondary": "hsl(209 70% 42%)",
    "background": "hsl(81 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(81 30% 13%)",
    "muted": "hsl(81 14% 43%)",
    "line": "hsl(81 28% 86%)",
    "soft": "hsl(81 55% 92%)"
  },
  "controlTitle": "Model Explainability Lab controls",
  "controls": [
    {
      "label": "Explanation sample",
      "min": 0,
      "max": 100,
      "default": 40,
      "unit": "%",
      "help": "Tune explanation sample and observe system behavior."
    },
    {
      "label": "Perturbation size",
      "min": 0,
      "max": 100,
      "default": 58,
      "unit": "",
      "help": "Stress perturbation size across realistic operating ranges."
    },
    {
      "label": "Correlation guard",
      "min": 0,
      "max": 100,
      "default": 40,
      "unit": "",
      "help": "Use correlation guard to reveal boundary failures."
    }
  ],
  "visualTitle": "Model Explainability Lab live view",
  "metrics": [
    {
      "label": "Model score",
      "detail": "primary behavior"
    },
    {
      "label": "Explainability score",
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
  "formula": "importanceⱼ=E[L_permⱼ−L]",
  "costScale": 1.05,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Explain the question first",
      "body": "Principle 1: use this when reviewing model explainability lab behavior in production."
    },
    {
      "title": "Compare methods",
      "body": "Principle 2: use this when reviewing model explainability lab behavior in production."
    },
    {
      "title": "Test explanation fidelity",
      "body": "Principle 3: use this when reviewing model explainability lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "model-explainability-001",
    title: "credit model explanation · case 001",
    scenario: "Investigate credit model explanation in a rare failure regime.",
    failure: "correlated features swap credit; scenario 1 exposes the operational consequence.",
    subtitle: "Explain the question first — experiment 001",
    explanation: "Adjust the controls to see how correlated features swap credit changes system quality, cost, and confidence.",
    lesson: "Explain the question first. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 878,
    sampleSize: 264,
    signal: 86
  },
  {
    id: "model-explainability-002",
    title: "forecast feature attribution · case 002",
    scenario: "Investigate forecast feature attribution in a high-scale environment.",
    failure: "local story becomes global claim; scenario 2 exposes the operational consequence.",
    subtitle: "Compare methods — experiment 002",
    explanation: "Adjust the controls to see how local story becomes global claim changes system quality, cost, and confidence.",
    lesson: "Compare methods. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 885,
    sampleSize: 281,
    signal: 4
  },
  {
    id: "model-explainability-003",
    title: "classifier error review · case 003",
    scenario: "Investigate classifier error review in a small clean workload.",
    failure: "explanation hides instability; scenario 3 exposes the operational consequence.",
    subtitle: "Test explanation fidelity — experiment 003",
    explanation: "Adjust the controls to see how explanation hides instability changes system quality, cost, and confidence.",
    lesson: "Test explanation fidelity. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 892,
    sampleSize: 298,
    signal: 23
  },
  {
    id: "model-explainability-004",
    title: "credit model explanation · case 004",
    scenario: "Investigate credit model explanation in a large noisy workload.",
    failure: "correlated features swap credit; scenario 4 exposes the operational consequence.",
    subtitle: "Explain the question first — experiment 004",
    explanation: "Adjust the controls to see how correlated features swap credit changes system quality, cost, and confidence.",
    lesson: "Explain the question first. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 899,
    sampleSize: 315,
    signal: 42
  },
  {
    id: "model-explainability-005",
    title: "forecast feature attribution · case 005",
    scenario: "Investigate forecast feature attribution in a shifted production slice.",
    failure: "local story becomes global claim; scenario 5 exposes the operational consequence.",
    subtitle: "Compare methods — experiment 005",
    explanation: "Adjust the controls to see how local story becomes global claim changes system quality, cost, and confidence.",
    lesson: "Compare methods. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 906,
    sampleSize: 332,
    signal: 61
  },
  {
    id: "model-explainability-006",
    title: "classifier error review · case 006",
    scenario: "Investigate classifier error review in a rare failure regime.",
    failure: "explanation hides instability; scenario 6 exposes the operational consequence.",
    subtitle: "Test explanation fidelity — experiment 006",
    explanation: "Adjust the controls to see how explanation hides instability changes system quality, cost, and confidence.",
    lesson: "Test explanation fidelity. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 913,
    sampleSize: 349,
    signal: 80
  },
  {
    id: "model-explainability-007",
    title: "credit model explanation · case 007",
    scenario: "Investigate credit model explanation in a high-scale environment.",
    failure: "correlated features swap credit; scenario 7 exposes the operational consequence.",
    subtitle: "Explain the question first — experiment 007",
    explanation: "Adjust the controls to see how correlated features swap credit changes system quality, cost, and confidence.",
    lesson: "Explain the question first. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 920,
    sampleSize: 366,
    signal: 99
  },
  {
    id: "model-explainability-008",
    title: "forecast feature attribution · case 008",
    scenario: "Investigate forecast feature attribution in a small clean workload.",
    failure: "local story becomes global claim; scenario 8 exposes the operational consequence.",
    subtitle: "Compare methods — experiment 008",
    explanation: "Adjust the controls to see how local story becomes global claim changes system quality, cost, and confidence.",
    lesson: "Compare methods. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 927,
    sampleSize: 383,
    signal: 17
  },
  {
    id: "model-explainability-009",
    title: "classifier error review · case 009",
    scenario: "Investigate classifier error review in a large noisy workload.",
    failure: "explanation hides instability; scenario 9 exposes the operational consequence.",
    subtitle: "Test explanation fidelity — experiment 009",
    explanation: "Adjust the controls to see how explanation hides instability changes system quality, cost, and confidence.",
    lesson: "Test explanation fidelity. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 934,
    sampleSize: 400,
    signal: 36
  },
  {
    id: "model-explainability-010",
    title: "credit model explanation · case 010",
    scenario: "Investigate credit model explanation in a shifted production slice.",
    failure: "correlated features swap credit; scenario 10 exposes the operational consequence.",
    subtitle: "Explain the question first — experiment 010",
    explanation: "Adjust the controls to see how correlated features swap credit changes system quality, cost, and confidence.",
    lesson: "Explain the question first. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 941,
    sampleSize: 417,
    signal: 55
  },
  {
    id: "model-explainability-011",
    title: "forecast feature attribution · case 011",
    scenario: "Investigate forecast feature attribution in a rare failure regime.",
    failure: "local story becomes global claim; scenario 11 exposes the operational consequence.",
    subtitle: "Compare methods — experiment 011",
    explanation: "Adjust the controls to see how local story becomes global claim changes system quality, cost, and confidence.",
    lesson: "Compare methods. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 948,
    sampleSize: 434,
    signal: 74
  },
  {
    id: "model-explainability-012",
    title: "classifier error review · case 012",
    scenario: "Investigate classifier error review in a high-scale environment.",
    failure: "explanation hides instability; scenario 12 exposes the operational consequence.",
    subtitle: "Test explanation fidelity — experiment 012",
    explanation: "Adjust the controls to see how explanation hides instability changes system quality, cost, and confidence.",
    lesson: "Test explanation fidelity. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 955,
    sampleSize: 451,
    signal: 93
  }
];

export default function ModelExplainabilityLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

