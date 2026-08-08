import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Synthetic Data Foundry",
  "kicker": "Generative AI interactive lab",
  "description": "Control generation, adaptation, multimodal behavior, evaluation, and safety with measurable trade-offs.",
  "mode": "image",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "hsl(113 88% 66%)",
    "secondary": "hsl(241 78% 62%)",
    "background": "hsl(113 24% 7%)",
    "panel": "hsl(113 22% 12%)",
    "ink": "hsl(113 35% 94%)",
    "muted": "hsl(113 16% 68%)",
    "line": "hsl(113 20% 25%)",
    "soft": "hsl(113 25% 18%)"
  },
  "controlTitle": "Synthetic Data Foundry controls",
  "controls": [
    {
      "label": "Diversity target",
      "min": 0,
      "max": 100,
      "default": 43,
      "unit": "%",
      "help": "Tune diversity target and observe system behavior."
    },
    {
      "label": "Label noise",
      "min": 0,
      "max": 100,
      "default": 63,
      "unit": "",
      "help": "Stress label noise across realistic operating ranges."
    },
    {
      "label": "Filter threshold",
      "min": 0,
      "max": 100,
      "default": 39,
      "unit": "",
      "help": "Use filter threshold to reveal boundary failures."
    }
  ],
  "visualTitle": "Synthetic Data Foundry live view",
  "metrics": [
    {
      "label": "Synthetic score",
      "detail": "primary behavior"
    },
    {
      "label": "Data score",
      "detail": "robustness check"
    },
    {
      "label": "Foundry score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "D_syn~P_model(x,y|constraints)",
  "costScale": 1.25,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Measure novelty",
      "body": "Principle 1: use this when reviewing synthetic data foundry behavior in production."
    },
    {
      "title": "Keep real validation",
      "body": "Principle 2: use this when reviewing synthetic data foundry behavior in production."
    },
    {
      "title": "Audit subgroup realism",
      "body": "Principle 3: use this when reviewing synthetic data foundry behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "synthetic-data-001",
    title: "rare intent expansion · case 001",
    scenario: "Investigate rare intent expansion in a high-scale environment.",
    failure: "generator repeats stereotypes; scenario 1 exposes the operational consequence.",
    subtitle: "Measure novelty — experiment 001",
    explanation: "Adjust the controls to see how generator repeats stereotypes changes system quality, cost, and confidence.",
    lesson: "Measure novelty. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1086,
    sampleSize: 280,
    signal: 1
  },
  {
    id: "synthetic-data-002",
    title: "test case generation · case 002",
    scenario: "Investigate test case generation in a small clean workload.",
    failure: "filter removes hard cases; scenario 2 exposes the operational consequence.",
    subtitle: "Keep real validation — experiment 002",
    explanation: "Adjust the controls to see how filter removes hard cases changes system quality, cost, and confidence.",
    lesson: "Keep real validation. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1093,
    sampleSize: 297,
    signal: 20
  },
  {
    id: "synthetic-data-003",
    title: "privacy-safe prototype data · case 003",
    scenario: "Investigate privacy-safe prototype data in a large noisy workload.",
    failure: "synthetic labels echo model; scenario 3 exposes the operational consequence.",
    subtitle: "Audit subgroup realism — experiment 003",
    explanation: "Adjust the controls to see how synthetic labels echo model changes system quality, cost, and confidence.",
    lesson: "Audit subgroup realism. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1100,
    sampleSize: 314,
    signal: 39
  },
  {
    id: "synthetic-data-004",
    title: "rare intent expansion · case 004",
    scenario: "Investigate rare intent expansion in a shifted production slice.",
    failure: "generator repeats stereotypes; scenario 4 exposes the operational consequence.",
    subtitle: "Measure novelty — experiment 004",
    explanation: "Adjust the controls to see how generator repeats stereotypes changes system quality, cost, and confidence.",
    lesson: "Measure novelty. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1107,
    sampleSize: 331,
    signal: 58
  },
  {
    id: "synthetic-data-005",
    title: "test case generation · case 005",
    scenario: "Investigate test case generation in a rare failure regime.",
    failure: "filter removes hard cases; scenario 5 exposes the operational consequence.",
    subtitle: "Keep real validation — experiment 005",
    explanation: "Adjust the controls to see how filter removes hard cases changes system quality, cost, and confidence.",
    lesson: "Keep real validation. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1114,
    sampleSize: 348,
    signal: 77
  },
  {
    id: "synthetic-data-006",
    title: "privacy-safe prototype data · case 006",
    scenario: "Investigate privacy-safe prototype data in a high-scale environment.",
    failure: "synthetic labels echo model; scenario 6 exposes the operational consequence.",
    subtitle: "Audit subgroup realism — experiment 006",
    explanation: "Adjust the controls to see how synthetic labels echo model changes system quality, cost, and confidence.",
    lesson: "Audit subgroup realism. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1121,
    sampleSize: 365,
    signal: 96
  },
  {
    id: "synthetic-data-007",
    title: "rare intent expansion · case 007",
    scenario: "Investigate rare intent expansion in a small clean workload.",
    failure: "generator repeats stereotypes; scenario 7 exposes the operational consequence.",
    subtitle: "Measure novelty — experiment 007",
    explanation: "Adjust the controls to see how generator repeats stereotypes changes system quality, cost, and confidence.",
    lesson: "Measure novelty. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1128,
    sampleSize: 382,
    signal: 14
  },
  {
    id: "synthetic-data-008",
    title: "test case generation · case 008",
    scenario: "Investigate test case generation in a large noisy workload.",
    failure: "filter removes hard cases; scenario 8 exposes the operational consequence.",
    subtitle: "Keep real validation — experiment 008",
    explanation: "Adjust the controls to see how filter removes hard cases changes system quality, cost, and confidence.",
    lesson: "Keep real validation. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1135,
    sampleSize: 399,
    signal: 33
  },
  {
    id: "synthetic-data-009",
    title: "privacy-safe prototype data · case 009",
    scenario: "Investigate privacy-safe prototype data in a shifted production slice.",
    failure: "synthetic labels echo model; scenario 9 exposes the operational consequence.",
    subtitle: "Audit subgroup realism — experiment 009",
    explanation: "Adjust the controls to see how synthetic labels echo model changes system quality, cost, and confidence.",
    lesson: "Audit subgroup realism. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1142,
    sampleSize: 416,
    signal: 52
  },
  {
    id: "synthetic-data-010",
    title: "rare intent expansion · case 010",
    scenario: "Investigate rare intent expansion in a rare failure regime.",
    failure: "generator repeats stereotypes; scenario 10 exposes the operational consequence.",
    subtitle: "Measure novelty — experiment 010",
    explanation: "Adjust the controls to see how generator repeats stereotypes changes system quality, cost, and confidence.",
    lesson: "Measure novelty. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1149,
    sampleSize: 433,
    signal: 71
  },
  {
    id: "synthetic-data-011",
    title: "test case generation · case 011",
    scenario: "Investigate test case generation in a high-scale environment.",
    failure: "filter removes hard cases; scenario 11 exposes the operational consequence.",
    subtitle: "Keep real validation — experiment 011",
    explanation: "Adjust the controls to see how filter removes hard cases changes system quality, cost, and confidence.",
    lesson: "Keep real validation. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1156,
    sampleSize: 450,
    signal: 90
  },
  {
    id: "synthetic-data-012",
    title: "privacy-safe prototype data · case 012",
    scenario: "Investigate privacy-safe prototype data in a small clean workload.",
    failure: "synthetic labels echo model; scenario 12 exposes the operational consequence.",
    subtitle: "Audit subgroup realism — experiment 012",
    explanation: "Adjust the controls to see how synthetic labels echo model changes system quality, cost, and confidence.",
    lesson: "Audit subgroup realism. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1163,
    sampleSize: 467,
    signal: 8
  }
];

export default function SyntheticDataFoundryLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

