import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Bias–Variance Playground",
  "kicker": "Machine learning interactive lab",
  "description": "Run a hands-on classical machine-learning experiment, inspect failure modes, and connect each control to deployment behavior.",
  "mode": "curve",
  "variant": 1,
  "dark": false,
  "palette": {
    "primary": "#ef4444",
    "secondary": "#2563eb",
    "background": "#fff7ed",
    "panel": "#ffffff",
    "ink": "#201a17",
    "muted": "#74665f",
    "line": "#e8d8cd",
    "soft": "#fee2e2"
  },
  "controlTitle": "Bias–Variance Playground controls",
  "controls": [
    {
      "label": "Model complexity",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune model complexity and observe how the experiment responds."
    },
    {
      "label": "Training set size",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing training set size."
    },
    {
      "label": "Label noise",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use label noise to expose boundary behavior."
    }
  ],
  "visualTitle": "Bias–Variance Playground live view",
  "metrics": [
    {
      "label": "Underfit risk",
      "detail": "primary behavior"
    },
    {
      "label": "Generalization",
      "detail": "robustness check"
    },
    {
      "label": "Compute units",
      "detail": "resource demand"
    },
    {
      "label": "Reliability",
      "detail": "decision quality"
    }
  ],
  "formula": "Error = Bias² + Variance + Noise",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Complexity has a sweet spot",
      "body": "Principle 1: apply this idea when reviewing bias–variance playground results."
    },
    {
      "title": "More data reduces variance",
      "body": "Principle 2: apply this idea when reviewing bias–variance playground results."
    },
    {
      "title": "Noise sets an error floor",
      "body": "Principle 3: apply this idea when reviewing bias–variance playground results."
    }
  ]
};

const CASES = [
  {
    id: "bias-variance-001",
    title: "polynomial regression · case 001",
    scenario: "Investigate polynomial regression under small clean sample.",
    failure: "high bias hides signal; case 1 makes the trade-off visible.",
    subtitle: "Complexity has a sweet spot — experiment 001",
    explanation: "Move the controls to see why high bias hides signal and how the measured response changes.",
    lesson: "Complexity has a sweet spot. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "bias-variance-002",
    title: "small tabular classifier · case 002",
    scenario: "Investigate small tabular classifier under large noisy sample.",
    failure: "variance memorizes noise; case 2 makes the trade-off visible.",
    subtitle: "More data reduces variance — experiment 002",
    explanation: "Move the controls to see why variance memorizes noise and how the measured response changes.",
    lesson: "More data reduces variance. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "bias-variance-003",
    title: "sensor forecast · case 003",
    scenario: "Investigate sensor forecast under shifted production slice.",
    failure: "test leakage flatters results; case 3 makes the trade-off visible.",
    subtitle: "Noise sets an error floor — experiment 003",
    explanation: "Move the controls to see why test leakage flatters results and how the measured response changes.",
    lesson: "Noise sets an error floor. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "bias-variance-004",
    title: "customer churn model · case 004",
    scenario: "Investigate customer churn model under rare-event regime.",
    failure: "high bias hides signal; case 4 makes the trade-off visible.",
    subtitle: "Complexity has a sweet spot — experiment 004",
    explanation: "Move the controls to see why high bias hides signal and how the measured response changes.",
    lesson: "Complexity has a sweet spot. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "bias-variance-005",
    title: "polynomial regression · case 005",
    scenario: "Investigate polynomial regression under high-dimensional setting.",
    failure: "variance memorizes noise; case 5 makes the trade-off visible.",
    subtitle: "More data reduces variance — experiment 005",
    explanation: "Move the controls to see why variance memorizes noise and how the measured response changes.",
    lesson: "More data reduces variance. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "bias-variance-006",
    title: "small tabular classifier · case 006",
    scenario: "Investigate small tabular classifier under small clean sample.",
    failure: "test leakage flatters results; case 6 makes the trade-off visible.",
    subtitle: "Noise sets an error floor — experiment 006",
    explanation: "Move the controls to see why test leakage flatters results and how the measured response changes.",
    lesson: "Noise sets an error floor. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "bias-variance-007",
    title: "sensor forecast · case 007",
    scenario: "Investigate sensor forecast under large noisy sample.",
    failure: "high bias hides signal; case 7 makes the trade-off visible.",
    subtitle: "Complexity has a sweet spot — experiment 007",
    explanation: "Move the controls to see why high bias hides signal and how the measured response changes.",
    lesson: "Complexity has a sweet spot. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "bias-variance-008",
    title: "customer churn model · case 008",
    scenario: "Investigate customer churn model under shifted production slice.",
    failure: "variance memorizes noise; case 8 makes the trade-off visible.",
    subtitle: "More data reduces variance — experiment 008",
    explanation: "Move the controls to see why variance memorizes noise and how the measured response changes.",
    lesson: "More data reduces variance. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "bias-variance-009",
    title: "polynomial regression · case 009",
    scenario: "Investigate polynomial regression under rare-event regime.",
    failure: "test leakage flatters results; case 9 makes the trade-off visible.",
    subtitle: "Noise sets an error floor — experiment 009",
    explanation: "Move the controls to see why test leakage flatters results and how the measured response changes.",
    lesson: "Noise sets an error floor. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "bias-variance-010",
    title: "small tabular classifier · case 010",
    scenario: "Investigate small tabular classifier under high-dimensional setting.",
    failure: "high bias hides signal; case 10 makes the trade-off visible.",
    subtitle: "Complexity has a sweet spot — experiment 010",
    explanation: "Move the controls to see why high bias hides signal and how the measured response changes.",
    lesson: "Complexity has a sweet spot. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "bias-variance-011",
    title: "sensor forecast · case 011",
    scenario: "Investigate sensor forecast under small clean sample.",
    failure: "variance memorizes noise; case 11 makes the trade-off visible.",
    subtitle: "More data reduces variance — experiment 011",
    explanation: "Move the controls to see why variance memorizes noise and how the measured response changes.",
    lesson: "More data reduces variance. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "bias-variance-012",
    title: "customer churn model · case 012",
    scenario: "Investigate customer churn model under large noisy sample.",
    failure: "test leakage flatters results; case 12 makes the trade-off visible.",
    subtitle: "Noise sets an error floor — experiment 012",
    explanation: "Move the controls to see why test leakage flatters results and how the measured response changes.",
    lesson: "Noise sets an error floor. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function BiasVariancePlaygroundLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

