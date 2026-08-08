import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Gradient Boosting Stage Lab",
  "kicker": "Machine learning interactive lab",
  "description": "Experiment with model geometry, selection, validation, and explainability using production-minded cases.",
  "mode": "neighbors",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "hsl(206 88% 66%)",
    "secondary": "hsl(334 78% 62%)",
    "background": "hsl(206 24% 7%)",
    "panel": "hsl(206 22% 12%)",
    "ink": "hsl(206 35% 94%)",
    "muted": "hsl(206 16% 68%)",
    "line": "hsl(206 20% 25%)",
    "soft": "hsl(206 25% 18%)"
  },
  "controlTitle": "Gradient Boosting Stage Lab controls",
  "controls": [
    {
      "label": "Learning rate",
      "min": 0,
      "max": 100,
      "default": 48,
      "unit": "%",
      "help": "Tune learning rate and observe system behavior."
    },
    {
      "label": "Tree depth",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress tree depth across realistic operating ranges."
    },
    {
      "label": "Boosting rounds",
      "min": 0,
      "max": 100,
      "default": 35,
      "unit": "",
      "help": "Use boosting rounds to reveal boundary failures."
    }
  ],
  "visualTitle": "Gradient Boosting Stage Lab live view",
  "metrics": [
    {
      "label": "Gradient score",
      "detail": "primary behavior"
    },
    {
      "label": "Boosting score",
      "detail": "robustness check"
    },
    {
      "label": "Stage score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "Fₘ = Fₘ₋₁ + ηhₘ",
  "costScale": 1.25,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Boost residual structure",
      "body": "Principle 1: use this when reviewing gradient boosting stage lab behavior in production."
    },
    {
      "title": "Rate and rounds interact",
      "body": "Principle 2: use this when reviewing gradient boosting stage lab behavior in production."
    },
    {
      "title": "Stop on validation",
      "body": "Principle 3: use this when reviewing gradient boosting stage lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "gradient-boosting-001",
    title: "tabular ranking model · case 001",
    scenario: "Investigate tabular ranking model in a rare failure regime.",
    failure: "deep stages overfit residuals; scenario 1 exposes the operational consequence.",
    subtitle: "Boost residual structure — experiment 001",
    explanation: "Adjust the controls to see how deep stages overfit residuals changes system quality, cost, and confidence.",
    lesson: "Boost residual structure. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 813,
    sampleSize: 259,
    signal: 81
  },
  {
    id: "gradient-boosting-002",
    title: "insurance severity model · case 002",
    scenario: "Investigate insurance severity model in a high-scale environment.",
    failure: "high rate overshoots; scenario 2 exposes the operational consequence.",
    subtitle: "Rate and rounds interact — experiment 002",
    explanation: "Adjust the controls to see how high rate overshoots changes system quality, cost, and confidence.",
    lesson: "Rate and rounds interact. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 820,
    sampleSize: 276,
    signal: 100
  },
  {
    id: "gradient-boosting-003",
    title: "demand regression system · case 003",
    scenario: "Investigate demand regression system in a small clean workload.",
    failure: "too many rounds chase noise; scenario 3 exposes the operational consequence.",
    subtitle: "Stop on validation — experiment 003",
    explanation: "Adjust the controls to see how too many rounds chase noise changes system quality, cost, and confidence.",
    lesson: "Stop on validation. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 827,
    sampleSize: 293,
    signal: 18
  },
  {
    id: "gradient-boosting-004",
    title: "tabular ranking model · case 004",
    scenario: "Investigate tabular ranking model in a large noisy workload.",
    failure: "deep stages overfit residuals; scenario 4 exposes the operational consequence.",
    subtitle: "Boost residual structure — experiment 004",
    explanation: "Adjust the controls to see how deep stages overfit residuals changes system quality, cost, and confidence.",
    lesson: "Boost residual structure. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 834,
    sampleSize: 310,
    signal: 37
  },
  {
    id: "gradient-boosting-005",
    title: "insurance severity model · case 005",
    scenario: "Investigate insurance severity model in a shifted production slice.",
    failure: "high rate overshoots; scenario 5 exposes the operational consequence.",
    subtitle: "Rate and rounds interact — experiment 005",
    explanation: "Adjust the controls to see how high rate overshoots changes system quality, cost, and confidence.",
    lesson: "Rate and rounds interact. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 841,
    sampleSize: 327,
    signal: 56
  },
  {
    id: "gradient-boosting-006",
    title: "demand regression system · case 006",
    scenario: "Investigate demand regression system in a rare failure regime.",
    failure: "too many rounds chase noise; scenario 6 exposes the operational consequence.",
    subtitle: "Stop on validation — experiment 006",
    explanation: "Adjust the controls to see how too many rounds chase noise changes system quality, cost, and confidence.",
    lesson: "Stop on validation. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 848,
    sampleSize: 344,
    signal: 75
  },
  {
    id: "gradient-boosting-007",
    title: "tabular ranking model · case 007",
    scenario: "Investigate tabular ranking model in a high-scale environment.",
    failure: "deep stages overfit residuals; scenario 7 exposes the operational consequence.",
    subtitle: "Boost residual structure — experiment 007",
    explanation: "Adjust the controls to see how deep stages overfit residuals changes system quality, cost, and confidence.",
    lesson: "Boost residual structure. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 855,
    sampleSize: 361,
    signal: 94
  },
  {
    id: "gradient-boosting-008",
    title: "insurance severity model · case 008",
    scenario: "Investigate insurance severity model in a small clean workload.",
    failure: "high rate overshoots; scenario 8 exposes the operational consequence.",
    subtitle: "Rate and rounds interact — experiment 008",
    explanation: "Adjust the controls to see how high rate overshoots changes system quality, cost, and confidence.",
    lesson: "Rate and rounds interact. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 862,
    sampleSize: 378,
    signal: 12
  },
  {
    id: "gradient-boosting-009",
    title: "demand regression system · case 009",
    scenario: "Investigate demand regression system in a large noisy workload.",
    failure: "too many rounds chase noise; scenario 9 exposes the operational consequence.",
    subtitle: "Stop on validation — experiment 009",
    explanation: "Adjust the controls to see how too many rounds chase noise changes system quality, cost, and confidence.",
    lesson: "Stop on validation. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 869,
    sampleSize: 395,
    signal: 31
  },
  {
    id: "gradient-boosting-010",
    title: "tabular ranking model · case 010",
    scenario: "Investigate tabular ranking model in a shifted production slice.",
    failure: "deep stages overfit residuals; scenario 10 exposes the operational consequence.",
    subtitle: "Boost residual structure — experiment 010",
    explanation: "Adjust the controls to see how deep stages overfit residuals changes system quality, cost, and confidence.",
    lesson: "Boost residual structure. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 876,
    sampleSize: 412,
    signal: 50
  },
  {
    id: "gradient-boosting-011",
    title: "insurance severity model · case 011",
    scenario: "Investigate insurance severity model in a rare failure regime.",
    failure: "high rate overshoots; scenario 11 exposes the operational consequence.",
    subtitle: "Rate and rounds interact — experiment 011",
    explanation: "Adjust the controls to see how high rate overshoots changes system quality, cost, and confidence.",
    lesson: "Rate and rounds interact. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 883,
    sampleSize: 429,
    signal: 69
  },
  {
    id: "gradient-boosting-012",
    title: "demand regression system · case 012",
    scenario: "Investigate demand regression system in a high-scale environment.",
    failure: "too many rounds chase noise; scenario 12 exposes the operational consequence.",
    subtitle: "Stop on validation — experiment 012",
    explanation: "Adjust the controls to see how too many rounds chase noise changes system quality, cost, and confidence.",
    lesson: "Stop on validation. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 890,
    sampleSize: 446,
    signal: 88
  }
];

export default function GradientBoostingStageLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

