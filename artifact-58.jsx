import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "PCA Variance Explorer",
  "kicker": "Machine learning interactive lab",
  "description": "Experiment with model geometry, selection, validation, and explainability using production-minded cases.",
  "mode": "curve",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "hsl(18 72% 42%)",
    "secondary": "hsl(146 70% 42%)",
    "background": "hsl(18 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(18 30% 13%)",
    "muted": "hsl(18 14% 43%)",
    "line": "hsl(18 28% 86%)",
    "soft": "hsl(18 55% 92%)"
  },
  "controlTitle": "PCA Variance Explorer controls",
  "controls": [
    {
      "label": "Component count",
      "min": 0,
      "max": 100,
      "default": 44,
      "unit": "%",
      "help": "Tune component count and observe system behavior."
    },
    {
      "label": "Feature correlation",
      "min": 0,
      "max": 100,
      "default": 60,
      "unit": "",
      "help": "Stress feature correlation across realistic operating ranges."
    },
    {
      "label": "Scale mismatch",
      "min": 0,
      "max": 100,
      "default": 31,
      "unit": "",
      "help": "Use scale mismatch to reveal boundary failures."
    }
  ],
  "visualTitle": "PCA Variance Explorer live view",
  "metrics": [
    {
      "label": "Variance score",
      "detail": "primary behavior"
    },
    {
      "label": "Explorer score",
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
  "formula": "Z = XWₖ",
  "costScale": 0.8500000000000001,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Scale before PCA",
      "body": "Principle 1: use this when reviewing pca variance explorer behavior in production."
    },
    {
      "title": "Variance is not usefulness",
      "body": "Principle 2: use this when reviewing pca variance explorer behavior in production."
    },
    {
      "title": "Inspect reconstruction loss",
      "body": "Principle 3: use this when reviewing pca variance explorer behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "pca-variance-001",
    title: "high-dimensional customer table · case 001",
    scenario: "Investigate high-dimensional customer table in a high-scale environment.",
    failure: "unscaled feature dominates components; scenario 1 exposes the operational consequence.",
    subtitle: "Scale before PCA — experiment 001",
    explanation: "Adjust the controls to see how unscaled feature dominates components changes system quality, cost, and confidence.",
    lesson: "Scale before PCA. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 761,
    sampleSize: 255,
    signal: 77
  },
  {
    id: "pca-variance-002",
    title: "sensor component analysis · case 002",
    scenario: "Investigate sensor component analysis in a small clean workload.",
    failure: "too few components erase signal; scenario 2 exposes the operational consequence.",
    subtitle: "Variance is not usefulness — experiment 002",
    explanation: "Adjust the controls to see how too few components erase signal changes system quality, cost, and confidence.",
    lesson: "Variance is not usefulness. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 768,
    sampleSize: 272,
    signal: 96
  },
  {
    id: "pca-variance-003",
    title: "image feature compression · case 003",
    scenario: "Investigate image feature compression in a large noisy workload.",
    failure: "variance is mistaken for relevance; scenario 3 exposes the operational consequence.",
    subtitle: "Inspect reconstruction loss — experiment 003",
    explanation: "Adjust the controls to see how variance is mistaken for relevance changes system quality, cost, and confidence.",
    lesson: "Inspect reconstruction loss. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 775,
    sampleSize: 289,
    signal: 14
  },
  {
    id: "pca-variance-004",
    title: "high-dimensional customer table · case 004",
    scenario: "Investigate high-dimensional customer table in a shifted production slice.",
    failure: "unscaled feature dominates components; scenario 4 exposes the operational consequence.",
    subtitle: "Scale before PCA — experiment 004",
    explanation: "Adjust the controls to see how unscaled feature dominates components changes system quality, cost, and confidence.",
    lesson: "Scale before PCA. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 782,
    sampleSize: 306,
    signal: 33
  },
  {
    id: "pca-variance-005",
    title: "sensor component analysis · case 005",
    scenario: "Investigate sensor component analysis in a rare failure regime.",
    failure: "too few components erase signal; scenario 5 exposes the operational consequence.",
    subtitle: "Variance is not usefulness — experiment 005",
    explanation: "Adjust the controls to see how too few components erase signal changes system quality, cost, and confidence.",
    lesson: "Variance is not usefulness. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 789,
    sampleSize: 323,
    signal: 52
  },
  {
    id: "pca-variance-006",
    title: "image feature compression · case 006",
    scenario: "Investigate image feature compression in a high-scale environment.",
    failure: "variance is mistaken for relevance; scenario 6 exposes the operational consequence.",
    subtitle: "Inspect reconstruction loss — experiment 006",
    explanation: "Adjust the controls to see how variance is mistaken for relevance changes system quality, cost, and confidence.",
    lesson: "Inspect reconstruction loss. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 796,
    sampleSize: 340,
    signal: 71
  },
  {
    id: "pca-variance-007",
    title: "high-dimensional customer table · case 007",
    scenario: "Investigate high-dimensional customer table in a small clean workload.",
    failure: "unscaled feature dominates components; scenario 7 exposes the operational consequence.",
    subtitle: "Scale before PCA — experiment 007",
    explanation: "Adjust the controls to see how unscaled feature dominates components changes system quality, cost, and confidence.",
    lesson: "Scale before PCA. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 803,
    sampleSize: 357,
    signal: 90
  },
  {
    id: "pca-variance-008",
    title: "sensor component analysis · case 008",
    scenario: "Investigate sensor component analysis in a large noisy workload.",
    failure: "too few components erase signal; scenario 8 exposes the operational consequence.",
    subtitle: "Variance is not usefulness — experiment 008",
    explanation: "Adjust the controls to see how too few components erase signal changes system quality, cost, and confidence.",
    lesson: "Variance is not usefulness. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 810,
    sampleSize: 374,
    signal: 8
  },
  {
    id: "pca-variance-009",
    title: "image feature compression · case 009",
    scenario: "Investigate image feature compression in a shifted production slice.",
    failure: "variance is mistaken for relevance; scenario 9 exposes the operational consequence.",
    subtitle: "Inspect reconstruction loss — experiment 009",
    explanation: "Adjust the controls to see how variance is mistaken for relevance changes system quality, cost, and confidence.",
    lesson: "Inspect reconstruction loss. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 817,
    sampleSize: 391,
    signal: 27
  },
  {
    id: "pca-variance-010",
    title: "high-dimensional customer table · case 010",
    scenario: "Investigate high-dimensional customer table in a rare failure regime.",
    failure: "unscaled feature dominates components; scenario 10 exposes the operational consequence.",
    subtitle: "Scale before PCA — experiment 010",
    explanation: "Adjust the controls to see how unscaled feature dominates components changes system quality, cost, and confidence.",
    lesson: "Scale before PCA. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 824,
    sampleSize: 408,
    signal: 46
  },
  {
    id: "pca-variance-011",
    title: "sensor component analysis · case 011",
    scenario: "Investigate sensor component analysis in a high-scale environment.",
    failure: "too few components erase signal; scenario 11 exposes the operational consequence.",
    subtitle: "Variance is not usefulness — experiment 011",
    explanation: "Adjust the controls to see how too few components erase signal changes system quality, cost, and confidence.",
    lesson: "Variance is not usefulness. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 831,
    sampleSize: 425,
    signal: 65
  },
  {
    id: "pca-variance-012",
    title: "image feature compression · case 012",
    scenario: "Investigate image feature compression in a small clean workload.",
    failure: "variance is mistaken for relevance; scenario 12 exposes the operational consequence.",
    subtitle: "Inspect reconstruction loss — experiment 012",
    explanation: "Adjust the controls to see how variance is mistaken for relevance changes system quality, cost, and confidence.",
    lesson: "Inspect reconstruction loss. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 838,
    sampleSize: 442,
    signal: 84
  }
];

export default function PcaVarianceExplorerLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

