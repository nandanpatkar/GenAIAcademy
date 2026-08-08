import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Feature Selection Tournament",
  "kicker": "Machine learning interactive lab",
  "description": "Experiment with model geometry, selection, validation, and explainability using production-minded cases.",
  "mode": "image",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "hsl(347 88% 66%)",
    "secondary": "hsl(115 78% 62%)",
    "background": "hsl(347 24% 7%)",
    "panel": "hsl(347 22% 12%)",
    "ink": "hsl(347 35% 94%)",
    "muted": "hsl(347 16% 68%)",
    "line": "hsl(347 20% 25%)",
    "soft": "hsl(347 25% 18%)"
  },
  "controlTitle": "Feature Selection Tournament controls",
  "controls": [
    {
      "label": "Feature budget",
      "min": 0,
      "max": 100,
      "default": 38,
      "unit": "%",
      "help": "Tune feature budget and observe system behavior."
    },
    {
      "label": "Selection strength",
      "min": 0,
      "max": 100,
      "default": 67,
      "unit": "",
      "help": "Stress selection strength across realistic operating ranges."
    },
    {
      "label": "Correlation penalty",
      "min": 0,
      "max": 100,
      "default": 38,
      "unit": "",
      "help": "Use correlation penalty to reveal boundary failures."
    }
  ],
  "visualTitle": "Feature Selection Tournament live view",
  "metrics": [
    {
      "label": "Feature score",
      "detail": "primary behavior"
    },
    {
      "label": "Selection score",
      "detail": "robustness check"
    },
    {
      "label": "Tournament score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "S*=argmax_S score(X_S)",
  "costScale": 0.8500000000000001,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Select inside the pipeline",
      "body": "Principle 1: use this when reviewing feature selection tournament behavior in production."
    },
    {
      "title": "Stability matters",
      "body": "Principle 2: use this when reviewing feature selection tournament behavior in production."
    },
    {
      "title": "Budget features by value",
      "body": "Principle 3: use this when reviewing feature selection tournament behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "feature-selection-001",
    title: "wide genomic features · case 001",
    scenario: "Investigate wide genomic features in a large noisy workload.",
    failure: "selector sees validation labels; scenario 1 exposes the operational consequence.",
    subtitle: "Select inside the pipeline — experiment 001",
    explanation: "Adjust the controls to see how selector sees validation labels changes system quality, cost, and confidence.",
    lesson: "Select inside the pipeline. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 852,
    sampleSize: 262,
    signal: 84
  },
  {
    id: "feature-selection-002",
    title: "marketing signal selection · case 002",
    scenario: "Investigate marketing signal selection in a shifted production slice.",
    failure: "correlated proxies split credit; scenario 2 exposes the operational consequence.",
    subtitle: "Stability matters — experiment 002",
    explanation: "Adjust the controls to see how correlated proxies split credit changes system quality, cost, and confidence.",
    lesson: "Stability matters. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 859,
    sampleSize: 279,
    signal: 2
  },
  {
    id: "feature-selection-003",
    title: "text feature pruning · case 003",
    scenario: "Investigate text feature pruning in a rare failure regime.",
    failure: "importance implies causality; scenario 3 exposes the operational consequence.",
    subtitle: "Budget features by value — experiment 003",
    explanation: "Adjust the controls to see how importance implies causality changes system quality, cost, and confidence.",
    lesson: "Budget features by value. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 866,
    sampleSize: 296,
    signal: 21
  },
  {
    id: "feature-selection-004",
    title: "wide genomic features · case 004",
    scenario: "Investigate wide genomic features in a high-scale environment.",
    failure: "selector sees validation labels; scenario 4 exposes the operational consequence.",
    subtitle: "Select inside the pipeline — experiment 004",
    explanation: "Adjust the controls to see how selector sees validation labels changes system quality, cost, and confidence.",
    lesson: "Select inside the pipeline. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 873,
    sampleSize: 313,
    signal: 40
  },
  {
    id: "feature-selection-005",
    title: "marketing signal selection · case 005",
    scenario: "Investigate marketing signal selection in a small clean workload.",
    failure: "correlated proxies split credit; scenario 5 exposes the operational consequence.",
    subtitle: "Stability matters — experiment 005",
    explanation: "Adjust the controls to see how correlated proxies split credit changes system quality, cost, and confidence.",
    lesson: "Stability matters. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 880,
    sampleSize: 330,
    signal: 59
  },
  {
    id: "feature-selection-006",
    title: "text feature pruning · case 006",
    scenario: "Investigate text feature pruning in a large noisy workload.",
    failure: "importance implies causality; scenario 6 exposes the operational consequence.",
    subtitle: "Budget features by value — experiment 006",
    explanation: "Adjust the controls to see how importance implies causality changes system quality, cost, and confidence.",
    lesson: "Budget features by value. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 887,
    sampleSize: 347,
    signal: 78
  },
  {
    id: "feature-selection-007",
    title: "wide genomic features · case 007",
    scenario: "Investigate wide genomic features in a shifted production slice.",
    failure: "selector sees validation labels; scenario 7 exposes the operational consequence.",
    subtitle: "Select inside the pipeline — experiment 007",
    explanation: "Adjust the controls to see how selector sees validation labels changes system quality, cost, and confidence.",
    lesson: "Select inside the pipeline. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 894,
    sampleSize: 364,
    signal: 97
  },
  {
    id: "feature-selection-008",
    title: "marketing signal selection · case 008",
    scenario: "Investigate marketing signal selection in a rare failure regime.",
    failure: "correlated proxies split credit; scenario 8 exposes the operational consequence.",
    subtitle: "Stability matters — experiment 008",
    explanation: "Adjust the controls to see how correlated proxies split credit changes system quality, cost, and confidence.",
    lesson: "Stability matters. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 901,
    sampleSize: 381,
    signal: 15
  },
  {
    id: "feature-selection-009",
    title: "text feature pruning · case 009",
    scenario: "Investigate text feature pruning in a high-scale environment.",
    failure: "importance implies causality; scenario 9 exposes the operational consequence.",
    subtitle: "Budget features by value — experiment 009",
    explanation: "Adjust the controls to see how importance implies causality changes system quality, cost, and confidence.",
    lesson: "Budget features by value. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 908,
    sampleSize: 398,
    signal: 34
  },
  {
    id: "feature-selection-010",
    title: "wide genomic features · case 010",
    scenario: "Investigate wide genomic features in a small clean workload.",
    failure: "selector sees validation labels; scenario 10 exposes the operational consequence.",
    subtitle: "Select inside the pipeline — experiment 010",
    explanation: "Adjust the controls to see how selector sees validation labels changes system quality, cost, and confidence.",
    lesson: "Select inside the pipeline. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 915,
    sampleSize: 415,
    signal: 53
  },
  {
    id: "feature-selection-011",
    title: "marketing signal selection · case 011",
    scenario: "Investigate marketing signal selection in a large noisy workload.",
    failure: "correlated proxies split credit; scenario 11 exposes the operational consequence.",
    subtitle: "Stability matters — experiment 011",
    explanation: "Adjust the controls to see how correlated proxies split credit changes system quality, cost, and confidence.",
    lesson: "Stability matters. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 922,
    sampleSize: 432,
    signal: 72
  },
  {
    id: "feature-selection-012",
    title: "text feature pruning · case 012",
    scenario: "Investigate text feature pruning in a shifted production slice.",
    failure: "importance implies causality; scenario 12 exposes the operational consequence.",
    subtitle: "Budget features by value — experiment 012",
    explanation: "Adjust the controls to see how importance implies causality changes system quality, cost, and confidence.",
    lesson: "Budget features by value. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 929,
    sampleSize: 449,
    signal: 91
  }
];

export default function FeatureSelectionTournamentLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

