import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Normalization Dynamics Lab",
  "kicker": "Deep learning interactive lab",
  "description": "Inspect neural architectures, optimization at scale, compression, and robustness through live diagnostics.",
  "mode": "neighbors",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "hsl(269 88% 66%)",
    "secondary": "hsl(37 78% 62%)",
    "background": "hsl(269 24% 7%)",
    "panel": "hsl(269 22% 12%)",
    "ink": "hsl(269 35% 94%)",
    "muted": "hsl(269 16% 68%)",
    "line": "hsl(269 20% 25%)",
    "soft": "hsl(269 25% 18%)"
  },
  "controlTitle": "Normalization Dynamics Lab controls",
  "controls": [
    {
      "label": "Batch size",
      "min": 0,
      "max": 100,
      "default": 44,
      "unit": "%",
      "help": "Tune batch size and observe system behavior."
    },
    {
      "label": "Momentum",
      "min": 0,
      "max": 100,
      "default": 62,
      "unit": "",
      "help": "Stress momentum across realistic operating ranges."
    },
    {
      "label": "Epsilon scale",
      "min": 0,
      "max": 100,
      "default": 27,
      "unit": "",
      "help": "Use epsilon scale to reveal boundary failures."
    }
  ],
  "visualTitle": "Normalization Dynamics Lab live view",
  "metrics": [
    {
      "label": "Normalization score",
      "detail": "primary behavior"
    },
    {
      "label": "Dynamics score",
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
  "formula": "x̂=(x−μ)/√(σ²+ε)",
  "costScale": 0.75,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Know the statistic axis",
      "body": "Principle 1: use this when reviewing normalization dynamics lab behavior in production."
    },
    {
      "title": "Small batches need care",
      "body": "Principle 2: use this when reviewing normalization dynamics lab behavior in production."
    },
    {
      "title": "Freeze deliberately",
      "body": "Principle 3: use this when reviewing normalization dynamics lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "normalization-dynamics-001",
    title: "small-batch vision run · case 001",
    scenario: "Investigate small-batch vision run in a shifted production slice.",
    failure: "batch statistics are noisy; scenario 1 exposes the operational consequence.",
    subtitle: "Know the statistic axis — experiment 001",
    explanation: "Adjust the controls to see how batch statistics are noisy changes system quality, cost, and confidence.",
    lesson: "Know the statistic axis. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 930,
    sampleSize: 268,
    signal: 90
  },
  {
    id: "normalization-dynamics-002",
    title: "deep residual model · case 002",
    scenario: "Investigate deep residual model in a rare failure regime.",
    failure: "train and eval disagree; scenario 2 exposes the operational consequence.",
    subtitle: "Small batches need care — experiment 002",
    explanation: "Adjust the controls to see how train and eval disagree changes system quality, cost, and confidence.",
    lesson: "Small batches need care. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 937,
    sampleSize: 285,
    signal: 8
  },
  {
    id: "normalization-dynamics-003",
    title: "domain-shifted inference · case 003",
    scenario: "Investigate domain-shifted inference in a high-scale environment.",
    failure: "normalization leaks groups; scenario 3 exposes the operational consequence.",
    subtitle: "Freeze deliberately — experiment 003",
    explanation: "Adjust the controls to see how normalization leaks groups changes system quality, cost, and confidence.",
    lesson: "Freeze deliberately. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 944,
    sampleSize: 302,
    signal: 27
  },
  {
    id: "normalization-dynamics-004",
    title: "small-batch vision run · case 004",
    scenario: "Investigate small-batch vision run in a small clean workload.",
    failure: "batch statistics are noisy; scenario 4 exposes the operational consequence.",
    subtitle: "Know the statistic axis — experiment 004",
    explanation: "Adjust the controls to see how batch statistics are noisy changes system quality, cost, and confidence.",
    lesson: "Know the statistic axis. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 951,
    sampleSize: 319,
    signal: 46
  },
  {
    id: "normalization-dynamics-005",
    title: "deep residual model · case 005",
    scenario: "Investigate deep residual model in a large noisy workload.",
    failure: "train and eval disagree; scenario 5 exposes the operational consequence.",
    subtitle: "Small batches need care — experiment 005",
    explanation: "Adjust the controls to see how train and eval disagree changes system quality, cost, and confidence.",
    lesson: "Small batches need care. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 958,
    sampleSize: 336,
    signal: 65
  },
  {
    id: "normalization-dynamics-006",
    title: "domain-shifted inference · case 006",
    scenario: "Investigate domain-shifted inference in a shifted production slice.",
    failure: "normalization leaks groups; scenario 6 exposes the operational consequence.",
    subtitle: "Freeze deliberately — experiment 006",
    explanation: "Adjust the controls to see how normalization leaks groups changes system quality, cost, and confidence.",
    lesson: "Freeze deliberately. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 965,
    sampleSize: 353,
    signal: 84
  },
  {
    id: "normalization-dynamics-007",
    title: "small-batch vision run · case 007",
    scenario: "Investigate small-batch vision run in a rare failure regime.",
    failure: "batch statistics are noisy; scenario 7 exposes the operational consequence.",
    subtitle: "Know the statistic axis — experiment 007",
    explanation: "Adjust the controls to see how batch statistics are noisy changes system quality, cost, and confidence.",
    lesson: "Know the statistic axis. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 972,
    sampleSize: 370,
    signal: 2
  },
  {
    id: "normalization-dynamics-008",
    title: "deep residual model · case 008",
    scenario: "Investigate deep residual model in a high-scale environment.",
    failure: "train and eval disagree; scenario 8 exposes the operational consequence.",
    subtitle: "Small batches need care — experiment 008",
    explanation: "Adjust the controls to see how train and eval disagree changes system quality, cost, and confidence.",
    lesson: "Small batches need care. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 979,
    sampleSize: 387,
    signal: 21
  },
  {
    id: "normalization-dynamics-009",
    title: "domain-shifted inference · case 009",
    scenario: "Investigate domain-shifted inference in a small clean workload.",
    failure: "normalization leaks groups; scenario 9 exposes the operational consequence.",
    subtitle: "Freeze deliberately — experiment 009",
    explanation: "Adjust the controls to see how normalization leaks groups changes system quality, cost, and confidence.",
    lesson: "Freeze deliberately. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 986,
    sampleSize: 404,
    signal: 40
  },
  {
    id: "normalization-dynamics-010",
    title: "small-batch vision run · case 010",
    scenario: "Investigate small-batch vision run in a large noisy workload.",
    failure: "batch statistics are noisy; scenario 10 exposes the operational consequence.",
    subtitle: "Know the statistic axis — experiment 010",
    explanation: "Adjust the controls to see how batch statistics are noisy changes system quality, cost, and confidence.",
    lesson: "Know the statistic axis. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 993,
    sampleSize: 421,
    signal: 59
  },
  {
    id: "normalization-dynamics-011",
    title: "deep residual model · case 011",
    scenario: "Investigate deep residual model in a shifted production slice.",
    failure: "train and eval disagree; scenario 11 exposes the operational consequence.",
    subtitle: "Small batches need care — experiment 011",
    explanation: "Adjust the controls to see how train and eval disagree changes system quality, cost, and confidence.",
    lesson: "Small batches need care. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1000,
    sampleSize: 438,
    signal: 78
  },
  {
    id: "normalization-dynamics-012",
    title: "domain-shifted inference · case 012",
    scenario: "Investigate domain-shifted inference in a rare failure regime.",
    failure: "normalization leaks groups; scenario 12 exposes the operational consequence.",
    subtitle: "Freeze deliberately — experiment 012",
    explanation: "Adjust the controls to see how normalization leaks groups changes system quality, cost, and confidence.",
    lesson: "Freeze deliberately. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1007,
    sampleSize: 455,
    signal: 97
  }
];

export default function NormalizationDynamicsLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

