import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Cross-Validation Lab",
  "kicker": "Machine learning interactive lab",
  "description": "Run a hands-on classical machine-learning experiment, inspect failure modes, and connect each control to deployment behavior.",
  "mode": "timeline",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "#0369a1",
    "secondary": "#c2410c",
    "background": "#f0f9ff",
    "panel": "#ffffff",
    "ink": "#122531",
    "muted": "#667985",
    "line": "#d8e7ee",
    "soft": "#e0f2fe"
  },
  "controlTitle": "Cross-Validation Lab controls",
  "controls": [
    {
      "label": "Fold count",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune fold count and observe how the experiment responds."
    },
    {
      "label": "Time gap",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing time gap."
    },
    {
      "label": "Group isolation",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use group isolation to expose boundary behavior."
    }
  ],
  "visualTitle": "Cross-Validation Lab live view",
  "metrics": [
    {
      "label": "Validation fit",
      "detail": "primary behavior"
    },
    {
      "label": "Fold agreement",
      "detail": "robustness check"
    },
    {
      "label": "Runs",
      "detail": "resource demand"
    },
    {
      "label": "Confidence",
      "detail": "decision quality"
    }
  ],
  "formula": "CV = mean(score₁ … scoreₖ)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Match folds to deployment",
      "body": "Principle 1: apply this idea when reviewing cross-validation lab results."
    },
    {
      "title": "Keep groups intact",
      "body": "Principle 2: apply this idea when reviewing cross-validation lab results."
    },
    {
      "title": "Report fold spread",
      "body": "Principle 3: apply this idea when reviewing cross-validation lab results."
    }
  ]
};

const CASES = [
  {
    id: "cross-validation-001",
    title: "patient outcome study · case 001",
    scenario: "Investigate patient outcome study under small clean sample.",
    failure: "random folds leak time; case 1 makes the trade-off visible.",
    subtitle: "Match folds to deployment — experiment 001",
    explanation: "Move the controls to see why random folds leak time and how the measured response changes.",
    lesson: "Match folds to deployment. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "cross-validation-002",
    title: "weekly demand forecast · case 002",
    scenario: "Investigate weekly demand forecast under large noisy sample.",
    failure: "related users cross folds; case 2 makes the trade-off visible.",
    subtitle: "Keep groups intact — experiment 002",
    explanation: "Move the controls to see why related users cross folds and how the measured response changes.",
    lesson: "Keep groups intact. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "cross-validation-003",
    title: "user recommendation model · case 003",
    scenario: "Investigate user recommendation model under shifted production slice.",
    failure: "one lucky split misleads; case 3 makes the trade-off visible.",
    subtitle: "Report fold spread — experiment 003",
    explanation: "Move the controls to see why one lucky split misleads and how the measured response changes.",
    lesson: "Report fold spread. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "cross-validation-004",
    title: "regional pricing model · case 004",
    scenario: "Investigate regional pricing model under rare-event regime.",
    failure: "random folds leak time; case 4 makes the trade-off visible.",
    subtitle: "Match folds to deployment — experiment 004",
    explanation: "Move the controls to see why random folds leak time and how the measured response changes.",
    lesson: "Match folds to deployment. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "cross-validation-005",
    title: "patient outcome study · case 005",
    scenario: "Investigate patient outcome study under high-dimensional setting.",
    failure: "related users cross folds; case 5 makes the trade-off visible.",
    subtitle: "Keep groups intact — experiment 005",
    explanation: "Move the controls to see why related users cross folds and how the measured response changes.",
    lesson: "Keep groups intact. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "cross-validation-006",
    title: "weekly demand forecast · case 006",
    scenario: "Investigate weekly demand forecast under small clean sample.",
    failure: "one lucky split misleads; case 6 makes the trade-off visible.",
    subtitle: "Report fold spread — experiment 006",
    explanation: "Move the controls to see why one lucky split misleads and how the measured response changes.",
    lesson: "Report fold spread. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "cross-validation-007",
    title: "user recommendation model · case 007",
    scenario: "Investigate user recommendation model under large noisy sample.",
    failure: "random folds leak time; case 7 makes the trade-off visible.",
    subtitle: "Match folds to deployment — experiment 007",
    explanation: "Move the controls to see why random folds leak time and how the measured response changes.",
    lesson: "Match folds to deployment. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "cross-validation-008",
    title: "regional pricing model · case 008",
    scenario: "Investigate regional pricing model under shifted production slice.",
    failure: "related users cross folds; case 8 makes the trade-off visible.",
    subtitle: "Keep groups intact — experiment 008",
    explanation: "Move the controls to see why related users cross folds and how the measured response changes.",
    lesson: "Keep groups intact. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "cross-validation-009",
    title: "patient outcome study · case 009",
    scenario: "Investigate patient outcome study under rare-event regime.",
    failure: "one lucky split misleads; case 9 makes the trade-off visible.",
    subtitle: "Report fold spread — experiment 009",
    explanation: "Move the controls to see why one lucky split misleads and how the measured response changes.",
    lesson: "Report fold spread. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "cross-validation-010",
    title: "weekly demand forecast · case 010",
    scenario: "Investigate weekly demand forecast under high-dimensional setting.",
    failure: "random folds leak time; case 10 makes the trade-off visible.",
    subtitle: "Match folds to deployment — experiment 010",
    explanation: "Move the controls to see why random folds leak time and how the measured response changes.",
    lesson: "Match folds to deployment. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "cross-validation-011",
    title: "user recommendation model · case 011",
    scenario: "Investigate user recommendation model under small clean sample.",
    failure: "related users cross folds; case 11 makes the trade-off visible.",
    subtitle: "Keep groups intact — experiment 011",
    explanation: "Move the controls to see why related users cross folds and how the measured response changes.",
    lesson: "Keep groups intact. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "cross-validation-012",
    title: "regional pricing model · case 012",
    scenario: "Investigate regional pricing model under large noisy sample.",
    failure: "one lucky split misleads; case 12 makes the trade-off visible.",
    subtitle: "Report fold spread — experiment 012",
    explanation: "Move the controls to see why one lucky split misleads and how the measured response changes.",
    lesson: "Report fold spread. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function CrossValidationLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

