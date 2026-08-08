import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Model Drift Monitor",
  "kicker": "Machine learning interactive lab",
  "description": "Run a hands-on classical machine-learning experiment, inspect failure modes, and connect each control to deployment behavior.",
  "mode": "timeline",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "#f97316",
    "secondary": "#a78bfa",
    "background": "#17100b",
    "panel": "#27190f",
    "ink": "#fff7ed",
    "muted": "#c0a48f",
    "line": "#59351d",
    "soft": "#422414"
  },
  "controlTitle": "Model Drift Monitor controls",
  "controls": [
    {
      "label": "Shift magnitude",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune shift magnitude and observe how the experiment responds."
    },
    {
      "label": "Window size",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing window size."
    },
    {
      "label": "Alert sensitivity",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use alert sensitivity to expose boundary behavior."
    }
  ],
  "visualTitle": "Model Drift Monitor live view",
  "metrics": [
    {
      "label": "Drift score",
      "detail": "primary behavior"
    },
    {
      "label": "Performance gap",
      "detail": "robustness check"
    },
    {
      "label": "Samples",
      "detail": "resource demand"
    },
    {
      "label": "Alert trust",
      "detail": "decision quality"
    }
  ],
  "formula": "PSI = Σ(actual−expected)ln(actual/expected)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Monitor inputs and outcomes",
      "body": "Principle 1: apply this idea when reviewing model drift monitor results."
    },
    {
      "title": "Choose operational windows",
      "body": "Principle 2: apply this idea when reviewing model drift monitor results."
    },
    {
      "title": "Alerts need response playbooks",
      "body": "Principle 3: apply this idea when reviewing model drift monitor results."
    }
  ]
};

const CASES = [
  {
    id: "drift-monitor-001",
    title: "checkout fraud model · case 001",
    scenario: "Investigate checkout fraud model under small clean sample.",
    failure: "silent covariate shift grows; case 1 makes the trade-off visible.",
    subtitle: "Monitor inputs and outcomes — experiment 001",
    explanation: "Move the controls to see why silent covariate shift grows and how the measured response changes.",
    lesson: "Monitor inputs and outcomes. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "drift-monitor-002",
    title: "search ranking model · case 002",
    scenario: "Investigate search ranking model under large noisy sample.",
    failure: "tiny window causes alarms; case 2 makes the trade-off visible.",
    subtitle: "Choose operational windows — experiment 002",
    explanation: "Move the controls to see why tiny window causes alarms and how the measured response changes.",
    lesson: "Choose operational windows. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "drift-monitor-003",
    title: "factory sensor model · case 003",
    scenario: "Investigate factory sensor model under shifted production slice.",
    failure: "label delay hides decay; case 3 makes the trade-off visible.",
    subtitle: "Alerts need response playbooks — experiment 003",
    explanation: "Move the controls to see why label delay hides decay and how the measured response changes.",
    lesson: "Alerts need response playbooks. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "drift-monitor-004",
    title: "seasonal demand model · case 004",
    scenario: "Investigate seasonal demand model under rare-event regime.",
    failure: "silent covariate shift grows; case 4 makes the trade-off visible.",
    subtitle: "Monitor inputs and outcomes — experiment 004",
    explanation: "Move the controls to see why silent covariate shift grows and how the measured response changes.",
    lesson: "Monitor inputs and outcomes. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "drift-monitor-005",
    title: "checkout fraud model · case 005",
    scenario: "Investigate checkout fraud model under high-dimensional setting.",
    failure: "tiny window causes alarms; case 5 makes the trade-off visible.",
    subtitle: "Choose operational windows — experiment 005",
    explanation: "Move the controls to see why tiny window causes alarms and how the measured response changes.",
    lesson: "Choose operational windows. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "drift-monitor-006",
    title: "search ranking model · case 006",
    scenario: "Investigate search ranking model under small clean sample.",
    failure: "label delay hides decay; case 6 makes the trade-off visible.",
    subtitle: "Alerts need response playbooks — experiment 006",
    explanation: "Move the controls to see why label delay hides decay and how the measured response changes.",
    lesson: "Alerts need response playbooks. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "drift-monitor-007",
    title: "factory sensor model · case 007",
    scenario: "Investigate factory sensor model under large noisy sample.",
    failure: "silent covariate shift grows; case 7 makes the trade-off visible.",
    subtitle: "Monitor inputs and outcomes — experiment 007",
    explanation: "Move the controls to see why silent covariate shift grows and how the measured response changes.",
    lesson: "Monitor inputs and outcomes. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "drift-monitor-008",
    title: "seasonal demand model · case 008",
    scenario: "Investigate seasonal demand model under shifted production slice.",
    failure: "tiny window causes alarms; case 8 makes the trade-off visible.",
    subtitle: "Choose operational windows — experiment 008",
    explanation: "Move the controls to see why tiny window causes alarms and how the measured response changes.",
    lesson: "Choose operational windows. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "drift-monitor-009",
    title: "checkout fraud model · case 009",
    scenario: "Investigate checkout fraud model under rare-event regime.",
    failure: "label delay hides decay; case 9 makes the trade-off visible.",
    subtitle: "Alerts need response playbooks — experiment 009",
    explanation: "Move the controls to see why label delay hides decay and how the measured response changes.",
    lesson: "Alerts need response playbooks. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "drift-monitor-010",
    title: "search ranking model · case 010",
    scenario: "Investigate search ranking model under high-dimensional setting.",
    failure: "silent covariate shift grows; case 10 makes the trade-off visible.",
    subtitle: "Monitor inputs and outcomes — experiment 010",
    explanation: "Move the controls to see why silent covariate shift grows and how the measured response changes.",
    lesson: "Monitor inputs and outcomes. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "drift-monitor-011",
    title: "factory sensor model · case 011",
    scenario: "Investigate factory sensor model under small clean sample.",
    failure: "tiny window causes alarms; case 11 makes the trade-off visible.",
    subtitle: "Choose operational windows — experiment 011",
    explanation: "Move the controls to see why tiny window causes alarms and how the measured response changes.",
    lesson: "Choose operational windows. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "drift-monitor-012",
    title: "seasonal demand model · case 012",
    scenario: "Investigate seasonal demand model under large noisy sample.",
    failure: "label delay hides decay; case 12 makes the trade-off visible.",
    subtitle: "Alerts need response playbooks — experiment 012",
    explanation: "Move the controls to see why label delay hides decay and how the measured response changes.",
    lesson: "Alerts need response playbooks. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function ModelDriftMonitorLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

