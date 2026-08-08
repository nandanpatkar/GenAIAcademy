import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Initialization Signal Lab",
  "kicker": "Deep learning interactive lab",
  "description": "Probe neural-network dynamics with interactive controls, live diagnostics, and production-focused debugging cases.",
  "mode": "network",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "#0f766e",
    "secondary": "#db2777",
    "background": "#f0fdfa",
    "panel": "#ffffff",
    "ink": "#12302d",
    "muted": "#657e7b",
    "line": "#cee5e1",
    "soft": "#ccfbf1"
  },
  "controlTitle": "Initialization Signal Lab controls",
  "controls": [
    {
      "label": "Weight variance",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune weight variance and observe how the experiment responds."
    },
    {
      "label": "Network depth",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing network depth."
    },
    {
      "label": "Fan scaling",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use fan scaling to expose boundary behavior."
    }
  ],
  "visualTitle": "Initialization Signal Lab live view",
  "metrics": [
    {
      "label": "Signal retention",
      "detail": "primary behavior"
    },
    {
      "label": "Gradient health",
      "detail": "robustness check"
    },
    {
      "label": "Parameters",
      "detail": "resource demand"
    },
    {
      "label": "Init confidence",
      "detail": "decision quality"
    }
  ],
  "formula": "Var(w) ≈ 2/fan_in",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Initialization preserves scale",
      "body": "Principle 1: apply this idea when reviewing initialization signal lab results."
    },
    {
      "title": "Match scheme to activation",
      "body": "Principle 2: apply this idea when reviewing initialization signal lab results."
    },
    {
      "title": "Residual paths change dynamics",
      "body": "Principle 3: apply this idea when reviewing initialization signal lab results."
    }
  ]
};

const CASES = [
  {
    id: "initialization-signal-001",
    title: "deep ReLU tower · case 001",
    scenario: "Investigate deep ReLU tower under small clean sample.",
    failure: "large weights explode activations; case 1 makes the trade-off visible.",
    subtitle: "Initialization preserves scale — experiment 001",
    explanation: "Move the controls to see why large weights explode activations and how the measured response changes.",
    lesson: "Initialization preserves scale. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "initialization-signal-002",
    title: "tanh recurrent cell · case 002",
    scenario: "Investigate tanh recurrent cell under large noisy sample.",
    failure: "small weights erase signal; case 2 makes the trade-off visible.",
    subtitle: "Match scheme to activation — experiment 002",
    explanation: "Move the controls to see why small weights erase signal and how the measured response changes.",
    lesson: "Match scheme to activation. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "initialization-signal-003",
    title: "residual vision trunk · case 003",
    scenario: "Investigate residual vision trunk under shifted production slice.",
    failure: "symmetry prevents specialization; case 3 makes the trade-off visible.",
    subtitle: "Residual paths change dynamics — experiment 003",
    explanation: "Move the controls to see why symmetry prevents specialization and how the measured response changes.",
    lesson: "Residual paths change dynamics. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "initialization-signal-004",
    title: "wide MLP · case 004",
    scenario: "Investigate wide MLP under rare-event regime.",
    failure: "large weights explode activations; case 4 makes the trade-off visible.",
    subtitle: "Initialization preserves scale — experiment 004",
    explanation: "Move the controls to see why large weights explode activations and how the measured response changes.",
    lesson: "Initialization preserves scale. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "initialization-signal-005",
    title: "deep ReLU tower · case 005",
    scenario: "Investigate deep ReLU tower under high-dimensional setting.",
    failure: "small weights erase signal; case 5 makes the trade-off visible.",
    subtitle: "Match scheme to activation — experiment 005",
    explanation: "Move the controls to see why small weights erase signal and how the measured response changes.",
    lesson: "Match scheme to activation. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "initialization-signal-006",
    title: "tanh recurrent cell · case 006",
    scenario: "Investigate tanh recurrent cell under small clean sample.",
    failure: "symmetry prevents specialization; case 6 makes the trade-off visible.",
    subtitle: "Residual paths change dynamics — experiment 006",
    explanation: "Move the controls to see why symmetry prevents specialization and how the measured response changes.",
    lesson: "Residual paths change dynamics. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "initialization-signal-007",
    title: "residual vision trunk · case 007",
    scenario: "Investigate residual vision trunk under large noisy sample.",
    failure: "large weights explode activations; case 7 makes the trade-off visible.",
    subtitle: "Initialization preserves scale — experiment 007",
    explanation: "Move the controls to see why large weights explode activations and how the measured response changes.",
    lesson: "Initialization preserves scale. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "initialization-signal-008",
    title: "wide MLP · case 008",
    scenario: "Investigate wide MLP under shifted production slice.",
    failure: "small weights erase signal; case 8 makes the trade-off visible.",
    subtitle: "Match scheme to activation — experiment 008",
    explanation: "Move the controls to see why small weights erase signal and how the measured response changes.",
    lesson: "Match scheme to activation. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "initialization-signal-009",
    title: "deep ReLU tower · case 009",
    scenario: "Investigate deep ReLU tower under rare-event regime.",
    failure: "symmetry prevents specialization; case 9 makes the trade-off visible.",
    subtitle: "Residual paths change dynamics — experiment 009",
    explanation: "Move the controls to see why symmetry prevents specialization and how the measured response changes.",
    lesson: "Residual paths change dynamics. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "initialization-signal-010",
    title: "tanh recurrent cell · case 010",
    scenario: "Investigate tanh recurrent cell under high-dimensional setting.",
    failure: "large weights explode activations; case 10 makes the trade-off visible.",
    subtitle: "Initialization preserves scale — experiment 010",
    explanation: "Move the controls to see why large weights explode activations and how the measured response changes.",
    lesson: "Initialization preserves scale. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "initialization-signal-011",
    title: "residual vision trunk · case 011",
    scenario: "Investigate residual vision trunk under small clean sample.",
    failure: "small weights erase signal; case 11 makes the trade-off visible.",
    subtitle: "Match scheme to activation — experiment 011",
    explanation: "Move the controls to see why small weights erase signal and how the measured response changes.",
    lesson: "Match scheme to activation. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "initialization-signal-012",
    title: "wide MLP · case 012",
    scenario: "Investigate wide MLP under large noisy sample.",
    failure: "symmetry prevents specialization; case 12 makes the trade-off visible.",
    subtitle: "Residual paths change dynamics — experiment 012",
    explanation: "Move the controls to see why symmetry prevents specialization and how the measured response changes.",
    lesson: "Residual paths change dynamics. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function InitializationSignalLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

