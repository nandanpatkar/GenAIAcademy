import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Decision Tree Split Simulator",
  "kicker": "Machine learning interactive lab",
  "description": "Run a hands-on classical machine-learning experiment, inspect failure modes, and connect each control to deployment behavior.",
  "mode": "tree",
  "variant": 1,
  "dark": false,
  "palette": {
    "primary": "#166534",
    "secondary": "#b45309",
    "background": "#f7fee7",
    "panel": "#ffffff",
    "ink": "#17220f",
    "muted": "#6b785f",
    "line": "#dbe9ce",
    "soft": "#dcfce7"
  },
  "controlTitle": "Decision Tree Split Simulator controls",
  "controls": [
    {
      "label": "Maximum depth",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune maximum depth and observe how the experiment responds."
    },
    {
      "label": "Minimum leaf size",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing minimum leaf size."
    },
    {
      "label": "Feature candidates",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use feature candidates to expose boundary behavior."
    }
  ],
  "visualTitle": "Decision Tree Split Simulator live view",
  "metrics": [
    {
      "label": "Purity gain",
      "detail": "primary behavior"
    },
    {
      "label": "Leaf balance",
      "detail": "robustness check"
    },
    {
      "label": "Node cost",
      "detail": "resource demand"
    },
    {
      "label": "Tree trust",
      "detail": "decision quality"
    }
  ],
  "formula": "Gain = I(parent) − Σ p(child)I(child)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Every split spends data",
      "body": "Principle 1: apply this idea when reviewing decision tree split simulator results."
    },
    {
      "title": "Impurity is local",
      "body": "Principle 2: apply this idea when reviewing decision tree split simulator results."
    },
    {
      "title": "Pruning improves robustness",
      "body": "Principle 3: apply this idea when reviewing decision tree split simulator results."
    }
  ]
};

const CASES = [
  {
    id: "tree-split-001",
    title: "loan approval tree · case 001",
    scenario: "Investigate loan approval tree under small clean sample.",
    failure: "deep branches memorize; case 1 makes the trade-off visible.",
    subtitle: "Every split spends data — experiment 001",
    explanation: "Move the controls to see why deep branches memorize and how the measured response changes.",
    lesson: "Every split spends data. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "tree-split-002",
    title: "equipment failure tree · case 002",
    scenario: "Investigate equipment failure tree under large noisy sample.",
    failure: "tiny leaves are unstable; case 2 makes the trade-off visible.",
    subtitle: "Impurity is local — experiment 002",
    explanation: "Move the controls to see why tiny leaves are unstable and how the measured response changes.",
    lesson: "Impurity is local. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "tree-split-003",
    title: "species classifier · case 003",
    scenario: "Investigate species classifier under shifted production slice.",
    failure: "proxy feature creates unfair split; case 3 makes the trade-off visible.",
    subtitle: "Pruning improves robustness — experiment 003",
    explanation: "Move the controls to see why proxy feature creates unfair split and how the measured response changes.",
    lesson: "Pruning improves robustness. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "tree-split-004",
    title: "delivery delay tree · case 004",
    scenario: "Investigate delivery delay tree under rare-event regime.",
    failure: "deep branches memorize; case 4 makes the trade-off visible.",
    subtitle: "Every split spends data — experiment 004",
    explanation: "Move the controls to see why deep branches memorize and how the measured response changes.",
    lesson: "Every split spends data. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "tree-split-005",
    title: "loan approval tree · case 005",
    scenario: "Investigate loan approval tree under high-dimensional setting.",
    failure: "tiny leaves are unstable; case 5 makes the trade-off visible.",
    subtitle: "Impurity is local — experiment 005",
    explanation: "Move the controls to see why tiny leaves are unstable and how the measured response changes.",
    lesson: "Impurity is local. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "tree-split-006",
    title: "equipment failure tree · case 006",
    scenario: "Investigate equipment failure tree under small clean sample.",
    failure: "proxy feature creates unfair split; case 6 makes the trade-off visible.",
    subtitle: "Pruning improves robustness — experiment 006",
    explanation: "Move the controls to see why proxy feature creates unfair split and how the measured response changes.",
    lesson: "Pruning improves robustness. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "tree-split-007",
    title: "species classifier · case 007",
    scenario: "Investigate species classifier under large noisy sample.",
    failure: "deep branches memorize; case 7 makes the trade-off visible.",
    subtitle: "Every split spends data — experiment 007",
    explanation: "Move the controls to see why deep branches memorize and how the measured response changes.",
    lesson: "Every split spends data. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "tree-split-008",
    title: "delivery delay tree · case 008",
    scenario: "Investigate delivery delay tree under shifted production slice.",
    failure: "tiny leaves are unstable; case 8 makes the trade-off visible.",
    subtitle: "Impurity is local — experiment 008",
    explanation: "Move the controls to see why tiny leaves are unstable and how the measured response changes.",
    lesson: "Impurity is local. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "tree-split-009",
    title: "loan approval tree · case 009",
    scenario: "Investigate loan approval tree under rare-event regime.",
    failure: "proxy feature creates unfair split; case 9 makes the trade-off visible.",
    subtitle: "Pruning improves robustness — experiment 009",
    explanation: "Move the controls to see why proxy feature creates unfair split and how the measured response changes.",
    lesson: "Pruning improves robustness. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "tree-split-010",
    title: "equipment failure tree · case 010",
    scenario: "Investigate equipment failure tree under high-dimensional setting.",
    failure: "deep branches memorize; case 10 makes the trade-off visible.",
    subtitle: "Every split spends data — experiment 010",
    explanation: "Move the controls to see why deep branches memorize and how the measured response changes.",
    lesson: "Every split spends data. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "tree-split-011",
    title: "species classifier · case 011",
    scenario: "Investigate species classifier under small clean sample.",
    failure: "tiny leaves are unstable; case 11 makes the trade-off visible.",
    subtitle: "Impurity is local — experiment 011",
    explanation: "Move the controls to see why tiny leaves are unstable and how the measured response changes.",
    lesson: "Impurity is local. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "tree-split-012",
    title: "delivery delay tree · case 012",
    scenario: "Investigate delivery delay tree under large noisy sample.",
    failure: "proxy feature creates unfair split; case 12 makes the trade-off visible.",
    subtitle: "Pruning improves robustness — experiment 012",
    explanation: "Move the controls to see why proxy feature creates unfair split and how the measured response changes.",
    lesson: "Pruning improves robustness. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function DecisionTreeSplitLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

