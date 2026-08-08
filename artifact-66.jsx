import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Hyperparameter Search Planner",
  "kicker": "Machine learning interactive lab",
  "description": "Experiment with model geometry, selection, validation, and explainability using production-minded cases.",
  "mode": "distribution",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "hsl(34 72% 42%)",
    "secondary": "hsl(162 70% 42%)",
    "background": "hsl(34 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(34 30% 13%)",
    "muted": "hsl(34 14% 43%)",
    "line": "hsl(34 28% 86%)",
    "soft": "hsl(34 55% 92%)"
  },
  "controlTitle": "Hyperparameter Search Planner controls",
  "controls": [
    {
      "label": "Trial budget",
      "min": 0,
      "max": 100,
      "default": 39,
      "unit": "%",
      "help": "Tune trial budget and observe system behavior."
    },
    {
      "label": "Search breadth",
      "min": 0,
      "max": 100,
      "default": 57,
      "unit": "",
      "help": "Stress search breadth across realistic operating ranges."
    },
    {
      "label": "Early stop rate",
      "min": 0,
      "max": 100,
      "default": 39,
      "unit": "",
      "help": "Use early stop rate to reveal boundary failures."
    }
  ],
  "visualTitle": "Hyperparameter Search Planner live view",
  "metrics": [
    {
      "label": "Hyperparameter score",
      "detail": "primary behavior"
    },
    {
      "label": "Search score",
      "detail": "robustness check"
    },
    {
      "label": "Planner score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "θ*=argmaxθ CV(θ)",
  "costScale": 0.95,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Separate search from test",
      "body": "Principle 1: use this when reviewing hyperparameter search planner behavior in production."
    },
    {
      "title": "Use informed spaces",
      "body": "Principle 2: use this when reviewing hyperparameter search planner behavior in production."
    },
    {
      "title": "Track trial uncertainty",
      "body": "Principle 3: use this when reviewing hyperparameter search planner behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "hyperparameter-search-001",
    title: "boosting parameter search · case 001",
    scenario: "Investigate boosting parameter search in a shifted production slice.",
    failure: "test set guides tuning; scenario 1 exposes the operational consequence.",
    subtitle: "Separate search from test — experiment 001",
    explanation: "Adjust the controls to see how test set guides tuning changes system quality, cost, and confidence.",
    lesson: "Separate search from test. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 865,
    sampleSize: 263,
    signal: 85
  },
  {
    id: "hyperparameter-search-002",
    title: "kernel model tuning · case 002",
    scenario: "Investigate kernel model tuning in a rare failure regime.",
    failure: "wide search wastes trials; scenario 2 exposes the operational consequence.",
    subtitle: "Use informed spaces — experiment 002",
    explanation: "Adjust the controls to see how wide search wastes trials changes system quality, cost, and confidence.",
    lesson: "Use informed spaces. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 872,
    sampleSize: 280,
    signal: 3
  },
  {
    id: "hyperparameter-search-003",
    title: "pipeline configuration hunt · case 003",
    scenario: "Investigate pipeline configuration hunt in a high-scale environment.",
    failure: "early stop drops slow winner; scenario 3 exposes the operational consequence.",
    subtitle: "Track trial uncertainty — experiment 003",
    explanation: "Adjust the controls to see how early stop drops slow winner changes system quality, cost, and confidence.",
    lesson: "Track trial uncertainty. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 879,
    sampleSize: 297,
    signal: 22
  },
  {
    id: "hyperparameter-search-004",
    title: "boosting parameter search · case 004",
    scenario: "Investigate boosting parameter search in a small clean workload.",
    failure: "test set guides tuning; scenario 4 exposes the operational consequence.",
    subtitle: "Separate search from test — experiment 004",
    explanation: "Adjust the controls to see how test set guides tuning changes system quality, cost, and confidence.",
    lesson: "Separate search from test. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 886,
    sampleSize: 314,
    signal: 41
  },
  {
    id: "hyperparameter-search-005",
    title: "kernel model tuning · case 005",
    scenario: "Investigate kernel model tuning in a large noisy workload.",
    failure: "wide search wastes trials; scenario 5 exposes the operational consequence.",
    subtitle: "Use informed spaces — experiment 005",
    explanation: "Adjust the controls to see how wide search wastes trials changes system quality, cost, and confidence.",
    lesson: "Use informed spaces. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 893,
    sampleSize: 331,
    signal: 60
  },
  {
    id: "hyperparameter-search-006",
    title: "pipeline configuration hunt · case 006",
    scenario: "Investigate pipeline configuration hunt in a shifted production slice.",
    failure: "early stop drops slow winner; scenario 6 exposes the operational consequence.",
    subtitle: "Track trial uncertainty — experiment 006",
    explanation: "Adjust the controls to see how early stop drops slow winner changes system quality, cost, and confidence.",
    lesson: "Track trial uncertainty. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 900,
    sampleSize: 348,
    signal: 79
  },
  {
    id: "hyperparameter-search-007",
    title: "boosting parameter search · case 007",
    scenario: "Investigate boosting parameter search in a rare failure regime.",
    failure: "test set guides tuning; scenario 7 exposes the operational consequence.",
    subtitle: "Separate search from test — experiment 007",
    explanation: "Adjust the controls to see how test set guides tuning changes system quality, cost, and confidence.",
    lesson: "Separate search from test. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 907,
    sampleSize: 365,
    signal: 98
  },
  {
    id: "hyperparameter-search-008",
    title: "kernel model tuning · case 008",
    scenario: "Investigate kernel model tuning in a high-scale environment.",
    failure: "wide search wastes trials; scenario 8 exposes the operational consequence.",
    subtitle: "Use informed spaces — experiment 008",
    explanation: "Adjust the controls to see how wide search wastes trials changes system quality, cost, and confidence.",
    lesson: "Use informed spaces. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 914,
    sampleSize: 382,
    signal: 16
  },
  {
    id: "hyperparameter-search-009",
    title: "pipeline configuration hunt · case 009",
    scenario: "Investigate pipeline configuration hunt in a small clean workload.",
    failure: "early stop drops slow winner; scenario 9 exposes the operational consequence.",
    subtitle: "Track trial uncertainty — experiment 009",
    explanation: "Adjust the controls to see how early stop drops slow winner changes system quality, cost, and confidence.",
    lesson: "Track trial uncertainty. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 921,
    sampleSize: 399,
    signal: 35
  },
  {
    id: "hyperparameter-search-010",
    title: "boosting parameter search · case 010",
    scenario: "Investigate boosting parameter search in a large noisy workload.",
    failure: "test set guides tuning; scenario 10 exposes the operational consequence.",
    subtitle: "Separate search from test — experiment 010",
    explanation: "Adjust the controls to see how test set guides tuning changes system quality, cost, and confidence.",
    lesson: "Separate search from test. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 928,
    sampleSize: 416,
    signal: 54
  },
  {
    id: "hyperparameter-search-011",
    title: "kernel model tuning · case 011",
    scenario: "Investigate kernel model tuning in a shifted production slice.",
    failure: "wide search wastes trials; scenario 11 exposes the operational consequence.",
    subtitle: "Use informed spaces — experiment 011",
    explanation: "Adjust the controls to see how wide search wastes trials changes system quality, cost, and confidence.",
    lesson: "Use informed spaces. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 935,
    sampleSize: 433,
    signal: 73
  },
  {
    id: "hyperparameter-search-012",
    title: "pipeline configuration hunt · case 012",
    scenario: "Investigate pipeline configuration hunt in a rare failure regime.",
    failure: "early stop drops slow winner; scenario 12 exposes the operational consequence.",
    subtitle: "Track trial uncertainty — experiment 012",
    explanation: "Adjust the controls to see how early stop drops slow winner changes system quality, cost, and confidence.",
    lesson: "Track trial uncertainty. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 942,
    sampleSize: 450,
    signal: 92
  }
];

export default function HyperparameterSearchPlannerLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

