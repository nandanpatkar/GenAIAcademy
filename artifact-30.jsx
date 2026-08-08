import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Feature Engineering Foundry",
  "kicker": "Machine learning interactive lab",
  "description": "Run a hands-on classical machine-learning experiment, inspect failure modes, and connect each control to deployment behavior.",
  "mode": "grid",
  "variant": 4,
  "dark": false,
  "palette": {
    "primary": "#7c3aed",
    "secondary": "#ea580c",
    "background": "#faf5ff",
    "panel": "#ffffff",
    "ink": "#241536",
    "muted": "#78678b",
    "line": "#e4d7ef",
    "soft": "#ede9fe"
  },
  "controlTitle": "Feature Engineering Foundry controls",
  "controls": [
    {
      "label": "Interaction depth",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune interaction depth and observe how the experiment responds."
    },
    {
      "label": "Encoding capacity",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing encoding capacity."
    },
    {
      "label": "Scale alignment",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use scale alignment to expose boundary behavior."
    }
  ],
  "visualTitle": "Feature Engineering Foundry live view",
  "metrics": [
    {
      "label": "Signal gain",
      "detail": "primary behavior"
    },
    {
      "label": "Stability",
      "detail": "robustness check"
    },
    {
      "label": "Feature count",
      "detail": "resource demand"
    },
    {
      "label": "Trust index",
      "detail": "decision quality"
    }
  ],
  "formula": "x′ = scale(encode(x) ⊕ interactions)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Transform with a hypothesis",
      "body": "Principle 1: apply this idea when reviewing feature engineering foundry results."
    },
    {
      "title": "Fit transforms on train only",
      "body": "Principle 2: apply this idea when reviewing feature engineering foundry results."
    },
    {
      "title": "Audit feature lineage",
      "body": "Principle 3: apply this idea when reviewing feature engineering foundry results."
    }
  ]
};

const CASES = [
  {
    id: "feature-foundry-001",
    title: "retail demand table · case 001",
    scenario: "Investigate retail demand table under small clean sample.",
    failure: "category leakage enters features; case 1 makes the trade-off visible.",
    subtitle: "Transform with a hypothesis — experiment 001",
    explanation: "Move the controls to see why category leakage enters features and how the measured response changes.",
    lesson: "Transform with a hypothesis. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "feature-foundry-002",
    title: "fraud event stream · case 002",
    scenario: "Investigate fraud event stream under large noisy sample.",
    failure: "scale dominates distance; case 2 makes the trade-off visible.",
    subtitle: "Fit transforms on train only — experiment 002",
    explanation: "Move the controls to see why scale dominates distance and how the measured response changes.",
    lesson: "Fit transforms on train only. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "feature-foundry-003",
    title: "housing dataset · case 003",
    scenario: "Investigate housing dataset under shifted production slice.",
    failure: "interaction explosion overfits; case 3 makes the trade-off visible.",
    subtitle: "Audit feature lineage — experiment 003",
    explanation: "Move the controls to see why interaction explosion overfits and how the measured response changes.",
    lesson: "Audit feature lineage. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "feature-foundry-004",
    title: "support ticket metadata · case 004",
    scenario: "Investigate support ticket metadata under rare-event regime.",
    failure: "category leakage enters features; case 4 makes the trade-off visible.",
    subtitle: "Transform with a hypothesis — experiment 004",
    explanation: "Move the controls to see why category leakage enters features and how the measured response changes.",
    lesson: "Transform with a hypothesis. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "feature-foundry-005",
    title: "retail demand table · case 005",
    scenario: "Investigate retail demand table under high-dimensional setting.",
    failure: "scale dominates distance; case 5 makes the trade-off visible.",
    subtitle: "Fit transforms on train only — experiment 005",
    explanation: "Move the controls to see why scale dominates distance and how the measured response changes.",
    lesson: "Fit transforms on train only. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "feature-foundry-006",
    title: "fraud event stream · case 006",
    scenario: "Investigate fraud event stream under small clean sample.",
    failure: "interaction explosion overfits; case 6 makes the trade-off visible.",
    subtitle: "Audit feature lineage — experiment 006",
    explanation: "Move the controls to see why interaction explosion overfits and how the measured response changes.",
    lesson: "Audit feature lineage. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "feature-foundry-007",
    title: "housing dataset · case 007",
    scenario: "Investigate housing dataset under large noisy sample.",
    failure: "category leakage enters features; case 7 makes the trade-off visible.",
    subtitle: "Transform with a hypothesis — experiment 007",
    explanation: "Move the controls to see why category leakage enters features and how the measured response changes.",
    lesson: "Transform with a hypothesis. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "feature-foundry-008",
    title: "support ticket metadata · case 008",
    scenario: "Investigate support ticket metadata under shifted production slice.",
    failure: "scale dominates distance; case 8 makes the trade-off visible.",
    subtitle: "Fit transforms on train only — experiment 008",
    explanation: "Move the controls to see why scale dominates distance and how the measured response changes.",
    lesson: "Fit transforms on train only. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "feature-foundry-009",
    title: "retail demand table · case 009",
    scenario: "Investigate retail demand table under rare-event regime.",
    failure: "interaction explosion overfits; case 9 makes the trade-off visible.",
    subtitle: "Audit feature lineage — experiment 009",
    explanation: "Move the controls to see why interaction explosion overfits and how the measured response changes.",
    lesson: "Audit feature lineage. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "feature-foundry-010",
    title: "fraud event stream · case 010",
    scenario: "Investigate fraud event stream under high-dimensional setting.",
    failure: "category leakage enters features; case 10 makes the trade-off visible.",
    subtitle: "Transform with a hypothesis — experiment 010",
    explanation: "Move the controls to see why category leakage enters features and how the measured response changes.",
    lesson: "Transform with a hypothesis. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "feature-foundry-011",
    title: "housing dataset · case 011",
    scenario: "Investigate housing dataset under small clean sample.",
    failure: "scale dominates distance; case 11 makes the trade-off visible.",
    subtitle: "Fit transforms on train only — experiment 011",
    explanation: "Move the controls to see why scale dominates distance and how the measured response changes.",
    lesson: "Fit transforms on train only. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "feature-foundry-012",
    title: "support ticket metadata · case 012",
    scenario: "Investigate support ticket metadata under large noisy sample.",
    failure: "interaction explosion overfits; case 12 makes the trade-off visible.",
    subtitle: "Audit feature lineage — experiment 012",
    explanation: "Move the controls to see why interaction explosion overfits and how the measured response changes.",
    lesson: "Audit feature lineage. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function FeatureEngineeringFoundryLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

