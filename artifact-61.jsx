import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Ensemble Fusion Studio",
  "kicker": "Machine learning interactive lab",
  "description": "Experiment with model geometry, selection, validation, and explainability using production-minded cases.",
  "mode": "tree",
  "variant": 3,
  "dark": false,
  "palette": {
    "primary": "hsl(159 72% 42%)",
    "secondary": "hsl(287 70% 42%)",
    "background": "hsl(159 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(159 30% 13%)",
    "muted": "hsl(159 14% 43%)",
    "line": "hsl(159 28% 86%)",
    "soft": "hsl(159 55% 92%)"
  },
  "controlTitle": "Ensemble Fusion Studio controls",
  "controls": [
    {
      "label": "Estimator count",
      "min": 0,
      "max": 100,
      "default": 47,
      "unit": "%",
      "help": "Tune estimator count and observe system behavior."
    },
    {
      "label": "Model diversity",
      "min": 0,
      "max": 100,
      "default": 63,
      "unit": "",
      "help": "Stress model diversity across realistic operating ranges."
    },
    {
      "label": "Voting sharpness",
      "min": 0,
      "max": 100,
      "default": 34,
      "unit": "",
      "help": "Use voting sharpness to reveal boundary failures."
    }
  ],
  "visualTitle": "Ensemble Fusion Studio live view",
  "metrics": [
    {
      "label": "Ensemble score",
      "detail": "primary behavior"
    },
    {
      "label": "Fusion score",
      "detail": "robustness check"
    },
    {
      "label": "Studio score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "ŷ = Σ wⱼfⱼ(x)",
  "costScale": 1.15,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Diversity creates value",
      "body": "Principle 1: use this when reviewing ensemble fusion studio behavior in production."
    },
    {
      "title": "Blend out-of-fold",
      "body": "Principle 2: use this when reviewing ensemble fusion studio behavior in production."
    },
    {
      "title": "Audit member failures",
      "body": "Principle 3: use this when reviewing ensemble fusion studio behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "ensemble-fusion-001",
    title: "risk model ensemble · case 001",
    scenario: "Investigate risk model ensemble in a shifted production slice.",
    failure: "correlated models repeat errors; scenario 1 exposes the operational consequence.",
    subtitle: "Diversity creates value — experiment 001",
    explanation: "Adjust the controls to see how correlated models repeat errors changes system quality, cost, and confidence.",
    lesson: "Diversity creates value. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 800,
    sampleSize: 258,
    signal: 80
  },
  {
    id: "ensemble-fusion-002",
    title: "forecast model blend · case 002",
    scenario: "Investigate forecast model blend in a rare failure regime.",
    failure: "weak learner overwhelms vote; scenario 2 exposes the operational consequence.",
    subtitle: "Blend out-of-fold — experiment 002",
    explanation: "Adjust the controls to see how weak learner overwhelms vote changes system quality, cost, and confidence.",
    lesson: "Blend out-of-fold. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 807,
    sampleSize: 275,
    signal: 99
  },
  {
    id: "ensemble-fusion-003",
    title: "multiclass voting system · case 003",
    scenario: "Investigate multiclass voting system in a high-scale environment.",
    failure: "stacking leaks validation; scenario 3 exposes the operational consequence.",
    subtitle: "Audit member failures — experiment 003",
    explanation: "Adjust the controls to see how stacking leaks validation changes system quality, cost, and confidence.",
    lesson: "Audit member failures. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 814,
    sampleSize: 292,
    signal: 17
  },
  {
    id: "ensemble-fusion-004",
    title: "risk model ensemble · case 004",
    scenario: "Investigate risk model ensemble in a small clean workload.",
    failure: "correlated models repeat errors; scenario 4 exposes the operational consequence.",
    subtitle: "Diversity creates value — experiment 004",
    explanation: "Adjust the controls to see how correlated models repeat errors changes system quality, cost, and confidence.",
    lesson: "Diversity creates value. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 821,
    sampleSize: 309,
    signal: 36
  },
  {
    id: "ensemble-fusion-005",
    title: "forecast model blend · case 005",
    scenario: "Investigate forecast model blend in a large noisy workload.",
    failure: "weak learner overwhelms vote; scenario 5 exposes the operational consequence.",
    subtitle: "Blend out-of-fold — experiment 005",
    explanation: "Adjust the controls to see how weak learner overwhelms vote changes system quality, cost, and confidence.",
    lesson: "Blend out-of-fold. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 828,
    sampleSize: 326,
    signal: 55
  },
  {
    id: "ensemble-fusion-006",
    title: "multiclass voting system · case 006",
    scenario: "Investigate multiclass voting system in a shifted production slice.",
    failure: "stacking leaks validation; scenario 6 exposes the operational consequence.",
    subtitle: "Audit member failures — experiment 006",
    explanation: "Adjust the controls to see how stacking leaks validation changes system quality, cost, and confidence.",
    lesson: "Audit member failures. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 835,
    sampleSize: 343,
    signal: 74
  },
  {
    id: "ensemble-fusion-007",
    title: "risk model ensemble · case 007",
    scenario: "Investigate risk model ensemble in a rare failure regime.",
    failure: "correlated models repeat errors; scenario 7 exposes the operational consequence.",
    subtitle: "Diversity creates value — experiment 007",
    explanation: "Adjust the controls to see how correlated models repeat errors changes system quality, cost, and confidence.",
    lesson: "Diversity creates value. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 842,
    sampleSize: 360,
    signal: 93
  },
  {
    id: "ensemble-fusion-008",
    title: "forecast model blend · case 008",
    scenario: "Investigate forecast model blend in a high-scale environment.",
    failure: "weak learner overwhelms vote; scenario 8 exposes the operational consequence.",
    subtitle: "Blend out-of-fold — experiment 008",
    explanation: "Adjust the controls to see how weak learner overwhelms vote changes system quality, cost, and confidence.",
    lesson: "Blend out-of-fold. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 849,
    sampleSize: 377,
    signal: 11
  },
  {
    id: "ensemble-fusion-009",
    title: "multiclass voting system · case 009",
    scenario: "Investigate multiclass voting system in a small clean workload.",
    failure: "stacking leaks validation; scenario 9 exposes the operational consequence.",
    subtitle: "Audit member failures — experiment 009",
    explanation: "Adjust the controls to see how stacking leaks validation changes system quality, cost, and confidence.",
    lesson: "Audit member failures. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 856,
    sampleSize: 394,
    signal: 30
  },
  {
    id: "ensemble-fusion-010",
    title: "risk model ensemble · case 010",
    scenario: "Investigate risk model ensemble in a large noisy workload.",
    failure: "correlated models repeat errors; scenario 10 exposes the operational consequence.",
    subtitle: "Diversity creates value — experiment 010",
    explanation: "Adjust the controls to see how correlated models repeat errors changes system quality, cost, and confidence.",
    lesson: "Diversity creates value. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 863,
    sampleSize: 411,
    signal: 49
  },
  {
    id: "ensemble-fusion-011",
    title: "forecast model blend · case 011",
    scenario: "Investigate forecast model blend in a shifted production slice.",
    failure: "weak learner overwhelms vote; scenario 11 exposes the operational consequence.",
    subtitle: "Blend out-of-fold — experiment 011",
    explanation: "Adjust the controls to see how weak learner overwhelms vote changes system quality, cost, and confidence.",
    lesson: "Blend out-of-fold. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 870,
    sampleSize: 428,
    signal: 68
  },
  {
    id: "ensemble-fusion-012",
    title: "multiclass voting system · case 012",
    scenario: "Investigate multiclass voting system in a rare failure regime.",
    failure: "stacking leaks validation; scenario 12 exposes the operational consequence.",
    subtitle: "Audit member failures — experiment 012",
    explanation: "Adjust the controls to see how stacking leaks validation changes system quality, cost, and confidence.",
    lesson: "Audit member failures. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 877,
    sampleSize: 445,
    signal: 87
  }
];

export default function EnsembleFusionLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

