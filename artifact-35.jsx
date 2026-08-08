import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Imbalanced Learning Triage",
  "kicker": "Machine learning interactive lab",
  "description": "Run a hands-on classical machine-learning experiment, inspect failure modes, and connect each control to deployment behavior.",
  "mode": "matrix",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "#be123c",
    "secondary": "#0891b2",
    "background": "#fff1f2",
    "panel": "#ffffff",
    "ink": "#30141b",
    "muted": "#84636a",
    "line": "#edd2d8",
    "soft": "#ffe4e6"
  },
  "controlTitle": "Imbalanced Learning Triage controls",
  "controls": [
    {
      "label": "Positive prevalence",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune positive prevalence and observe how the experiment responds."
    },
    {
      "label": "Decision threshold",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing decision threshold."
    },
    {
      "label": "Class weight",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use class weight to expose boundary behavior."
    }
  ],
  "visualTitle": "Imbalanced Learning Triage live view",
  "metrics": [
    {
      "label": "Minority recall",
      "detail": "primary behavior"
    },
    {
      "label": "Precision guard",
      "detail": "robustness check"
    },
    {
      "label": "Review load",
      "detail": "resource demand"
    },
    {
      "label": "Triage confidence",
      "detail": "decision quality"
    }
  ],
  "formula": "cost = FN·C_FN + FP·C_FP",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Start from error costs",
      "body": "Principle 1: apply this idea when reviewing imbalanced learning triage results."
    },
    {
      "title": "Measure minority recall",
      "body": "Principle 2: apply this idea when reviewing imbalanced learning triage results."
    },
    {
      "title": "Calibrate after resampling",
      "body": "Principle 3: apply this idea when reviewing imbalanced learning triage results."
    }
  ]
};

const CASES = [
  {
    id: "imbalance-triage-001",
    title: "fraud screening queue · case 001",
    scenario: "Investigate fraud screening queue under small clean sample.",
    failure: "accuracy hides misses; case 1 makes the trade-off visible.",
    subtitle: "Start from error costs — experiment 001",
    explanation: "Move the controls to see why accuracy hides misses and how the measured response changes.",
    lesson: "Start from error costs. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "imbalance-triage-002",
    title: "rare disease test · case 002",
    scenario: "Investigate rare disease test under large noisy sample.",
    failure: "oversampling leaks duplicates; case 2 makes the trade-off visible.",
    subtitle: "Measure minority recall — experiment 002",
    explanation: "Move the controls to see why oversampling leaks duplicates and how the measured response changes.",
    lesson: "Measure minority recall. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "imbalance-triage-003",
    title: "machine fault alert · case 003",
    scenario: "Investigate machine fault alert under shifted production slice.",
    failure: "threshold ignores review capacity; case 3 makes the trade-off visible.",
    subtitle: "Calibrate after resampling — experiment 003",
    explanation: "Move the controls to see why threshold ignores review capacity and how the measured response changes.",
    lesson: "Calibrate after resampling. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "imbalance-triage-004",
    title: "content abuse detector · case 004",
    scenario: "Investigate content abuse detector under rare-event regime.",
    failure: "accuracy hides misses; case 4 makes the trade-off visible.",
    subtitle: "Start from error costs — experiment 004",
    explanation: "Move the controls to see why accuracy hides misses and how the measured response changes.",
    lesson: "Start from error costs. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "imbalance-triage-005",
    title: "fraud screening queue · case 005",
    scenario: "Investigate fraud screening queue under high-dimensional setting.",
    failure: "oversampling leaks duplicates; case 5 makes the trade-off visible.",
    subtitle: "Measure minority recall — experiment 005",
    explanation: "Move the controls to see why oversampling leaks duplicates and how the measured response changes.",
    lesson: "Measure minority recall. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "imbalance-triage-006",
    title: "rare disease test · case 006",
    scenario: "Investigate rare disease test under small clean sample.",
    failure: "threshold ignores review capacity; case 6 makes the trade-off visible.",
    subtitle: "Calibrate after resampling — experiment 006",
    explanation: "Move the controls to see why threshold ignores review capacity and how the measured response changes.",
    lesson: "Calibrate after resampling. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "imbalance-triage-007",
    title: "machine fault alert · case 007",
    scenario: "Investigate machine fault alert under large noisy sample.",
    failure: "accuracy hides misses; case 7 makes the trade-off visible.",
    subtitle: "Start from error costs — experiment 007",
    explanation: "Move the controls to see why accuracy hides misses and how the measured response changes.",
    lesson: "Start from error costs. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "imbalance-triage-008",
    title: "content abuse detector · case 008",
    scenario: "Investigate content abuse detector under shifted production slice.",
    failure: "oversampling leaks duplicates; case 8 makes the trade-off visible.",
    subtitle: "Measure minority recall — experiment 008",
    explanation: "Move the controls to see why oversampling leaks duplicates and how the measured response changes.",
    lesson: "Measure minority recall. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "imbalance-triage-009",
    title: "fraud screening queue · case 009",
    scenario: "Investigate fraud screening queue under rare-event regime.",
    failure: "threshold ignores review capacity; case 9 makes the trade-off visible.",
    subtitle: "Calibrate after resampling — experiment 009",
    explanation: "Move the controls to see why threshold ignores review capacity and how the measured response changes.",
    lesson: "Calibrate after resampling. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "imbalance-triage-010",
    title: "rare disease test · case 010",
    scenario: "Investigate rare disease test under high-dimensional setting.",
    failure: "accuracy hides misses; case 10 makes the trade-off visible.",
    subtitle: "Start from error costs — experiment 010",
    explanation: "Move the controls to see why accuracy hides misses and how the measured response changes.",
    lesson: "Start from error costs. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "imbalance-triage-011",
    title: "machine fault alert · case 011",
    scenario: "Investigate machine fault alert under small clean sample.",
    failure: "oversampling leaks duplicates; case 11 makes the trade-off visible.",
    subtitle: "Measure minority recall — experiment 011",
    explanation: "Move the controls to see why oversampling leaks duplicates and how the measured response changes.",
    lesson: "Measure minority recall. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "imbalance-triage-012",
    title: "content abuse detector · case 012",
    scenario: "Investigate content abuse detector under large noisy sample.",
    failure: "threshold ignores review capacity; case 12 makes the trade-off visible.",
    subtitle: "Calibrate after resampling — experiment 012",
    explanation: "Move the controls to see why threshold ignores review capacity and how the measured response changes.",
    lesson: "Calibrate after resampling. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function ImbalancedLearningLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

