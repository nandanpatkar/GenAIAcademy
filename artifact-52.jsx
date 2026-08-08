import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Hypothesis Testing Court",
  "kicker": "Statistics & probability interactive lab",
  "description": "Build statistical intuition by changing assumptions, sampling regimes, and uncertainty controls in real time.",
  "mode": "distribution",
  "variant": 1,
  "dark": false,
  "palette": {
    "primary": "#b91c1c",
    "secondary": "#0369a1",
    "background": "#fff7ed",
    "panel": "#ffffff",
    "ink": "#2d1915",
    "muted": "#7e6861",
    "line": "#eadbd2",
    "soft": "#fee2e2"
  },
  "controlTitle": "Hypothesis Testing Court controls",
  "controls": [
    {
      "label": "Effect size",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune effect size and observe how the experiment responds."
    },
    {
      "label": "Sample size",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing sample size."
    },
    {
      "label": "Alpha level",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use alpha level to expose boundary behavior."
    }
  ],
  "visualTitle": "Hypothesis Testing Court live view",
  "metrics": [
    {
      "label": "Test power",
      "detail": "primary behavior"
    },
    {
      "label": "Type I guard",
      "detail": "robustness check"
    },
    {
      "label": "Observations",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "t = (x̄−μ₀)/(s/√n)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Specify hypotheses first",
      "body": "Principle 1: apply this idea when reviewing hypothesis testing court results."
    },
    {
      "title": "Power before collection",
      "body": "Principle 2: apply this idea when reviewing hypothesis testing court results."
    },
    {
      "title": "Significance is not importance",
      "body": "Principle 3: apply this idea when reviewing hypothesis testing court results."
    }
  ]
};

const CASES = [
  {
    id: "hypothesis-court-001",
    title: "checkout experiment · case 001",
    scenario: "Investigate checkout experiment under small clean sample.",
    failure: "p-value becomes probability of null; case 1 makes the trade-off visible.",
    subtitle: "Specify hypotheses first — experiment 001",
    explanation: "Move the controls to see why p-value becomes probability of null and how the measured response changes.",
    lesson: "Specify hypotheses first. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "hypothesis-court-002",
    title: "clinical treatment study · case 002",
    scenario: "Investigate clinical treatment study under large noisy sample.",
    failure: "multiple tests inflate error; case 2 makes the trade-off visible.",
    subtitle: "Power before collection — experiment 002",
    explanation: "Move the controls to see why multiple tests inflate error and how the measured response changes.",
    lesson: "Power before collection. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "hypothesis-court-003",
    title: "factory mean comparison · case 003",
    scenario: "Investigate factory mean comparison under shifted production slice.",
    failure: "tiny effect looks important; case 3 makes the trade-off visible.",
    subtitle: "Significance is not importance — experiment 003",
    explanation: "Move the controls to see why tiny effect looks important and how the measured response changes.",
    lesson: "Significance is not importance. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "hypothesis-court-004",
    title: "education intervention · case 004",
    scenario: "Investigate education intervention under rare-event regime.",
    failure: "p-value becomes probability of null; case 4 makes the trade-off visible.",
    subtitle: "Specify hypotheses first — experiment 004",
    explanation: "Move the controls to see why p-value becomes probability of null and how the measured response changes.",
    lesson: "Specify hypotheses first. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "hypothesis-court-005",
    title: "checkout experiment · case 005",
    scenario: "Investigate checkout experiment under high-dimensional setting.",
    failure: "multiple tests inflate error; case 5 makes the trade-off visible.",
    subtitle: "Power before collection — experiment 005",
    explanation: "Move the controls to see why multiple tests inflate error and how the measured response changes.",
    lesson: "Power before collection. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "hypothesis-court-006",
    title: "clinical treatment study · case 006",
    scenario: "Investigate clinical treatment study under small clean sample.",
    failure: "tiny effect looks important; case 6 makes the trade-off visible.",
    subtitle: "Significance is not importance — experiment 006",
    explanation: "Move the controls to see why tiny effect looks important and how the measured response changes.",
    lesson: "Significance is not importance. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "hypothesis-court-007",
    title: "factory mean comparison · case 007",
    scenario: "Investigate factory mean comparison under large noisy sample.",
    failure: "p-value becomes probability of null; case 7 makes the trade-off visible.",
    subtitle: "Specify hypotheses first — experiment 007",
    explanation: "Move the controls to see why p-value becomes probability of null and how the measured response changes.",
    lesson: "Specify hypotheses first. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "hypothesis-court-008",
    title: "education intervention · case 008",
    scenario: "Investigate education intervention under shifted production slice.",
    failure: "multiple tests inflate error; case 8 makes the trade-off visible.",
    subtitle: "Power before collection — experiment 008",
    explanation: "Move the controls to see why multiple tests inflate error and how the measured response changes.",
    lesson: "Power before collection. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "hypothesis-court-009",
    title: "checkout experiment · case 009",
    scenario: "Investigate checkout experiment under rare-event regime.",
    failure: "tiny effect looks important; case 9 makes the trade-off visible.",
    subtitle: "Significance is not importance — experiment 009",
    explanation: "Move the controls to see why tiny effect looks important and how the measured response changes.",
    lesson: "Significance is not importance. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "hypothesis-court-010",
    title: "clinical treatment study · case 010",
    scenario: "Investigate clinical treatment study under high-dimensional setting.",
    failure: "p-value becomes probability of null; case 10 makes the trade-off visible.",
    subtitle: "Specify hypotheses first — experiment 010",
    explanation: "Move the controls to see why p-value becomes probability of null and how the measured response changes.",
    lesson: "Specify hypotheses first. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "hypothesis-court-011",
    title: "factory mean comparison · case 011",
    scenario: "Investigate factory mean comparison under small clean sample.",
    failure: "multiple tests inflate error; case 11 makes the trade-off visible.",
    subtitle: "Power before collection — experiment 011",
    explanation: "Move the controls to see why multiple tests inflate error and how the measured response changes.",
    lesson: "Power before collection. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "hypothesis-court-012",
    title: "education intervention · case 012",
    scenario: "Investigate education intervention under large noisy sample.",
    failure: "tiny effect looks important; case 12 makes the trade-off visible.",
    subtitle: "Significance is not importance — experiment 012",
    explanation: "Move the controls to see why tiny effect looks important and how the measured response changes.",
    lesson: "Significance is not importance. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function HypothesisTestingLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

