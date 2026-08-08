import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Activation Function Arena",
  "kicker": "Deep learning interactive lab",
  "description": "Probe neural-network dynamics with interactive controls, live diagnostics, and production-focused debugging cases.",
  "mode": "curve",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "#4f46e5",
    "secondary": "#f97316",
    "background": "#eef2ff",
    "panel": "#ffffff",
    "ink": "#171734",
    "muted": "#6c6b88",
    "line": "#d8daf0",
    "soft": "#e0e7ff"
  },
  "controlTitle": "Activation Function Arena controls",
  "controls": [
    {
      "label": "Input amplitude",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune input amplitude and observe how the experiment responds."
    },
    {
      "label": "Negative slope",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing negative slope."
    },
    {
      "label": "Saturation range",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use saturation range to expose boundary behavior."
    }
  ],
  "visualTitle": "Activation Function Arena live view",
  "metrics": [
    {
      "label": "Active gradient",
      "detail": "primary behavior"
    },
    {
      "label": "Output spread",
      "detail": "robustness check"
    },
    {
      "label": "Ops budget",
      "detail": "resource demand"
    },
    {
      "label": "Activation fit",
      "detail": "decision quality"
    }
  ],
  "formula": "a = φ(Wx + b)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Activation shapes gradients",
      "body": "Principle 1: apply this idea when reviewing activation function arena results."
    },
    {
      "title": "Output layers encode assumptions",
      "body": "Principle 2: apply this idea when reviewing activation function arena results."
    },
    {
      "title": "Compare distributions, not slogans",
      "body": "Principle 3: apply this idea when reviewing activation function arena results."
    }
  ]
};

const CASES = [
  {
    id: "activation-arena-001",
    title: "dense image head · case 001",
    scenario: "Investigate dense image head under small clean sample.",
    failure: "sigmoid saturates; case 1 makes the trade-off visible.",
    subtitle: "Activation shapes gradients — experiment 001",
    explanation: "Move the controls to see why sigmoid saturates and how the measured response changes.",
    lesson: "Activation shapes gradients. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "activation-arena-002",
    title: "tabular residual block · case 002",
    scenario: "Investigate tabular residual block under large noisy sample.",
    failure: "dead ReLU blocks learning; case 2 makes the trade-off visible.",
    subtitle: "Output layers encode assumptions — experiment 002",
    explanation: "Move the controls to see why dead ReLU blocks learning and how the measured response changes.",
    lesson: "Output layers encode assumptions. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "activation-arena-003",
    title: "language feed-forward layer · case 003",
    scenario: "Investigate language feed-forward layer under shifted production slice.",
    failure: "activation mismatches output; case 3 makes the trade-off visible.",
    subtitle: "Compare distributions, not slogans — experiment 003",
    explanation: "Move the controls to see why activation mismatches output and how the measured response changes.",
    lesson: "Compare distributions, not slogans. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "activation-arena-004",
    title: "binary classifier output · case 004",
    scenario: "Investigate binary classifier output under rare-event regime.",
    failure: "sigmoid saturates; case 4 makes the trade-off visible.",
    subtitle: "Activation shapes gradients — experiment 004",
    explanation: "Move the controls to see why sigmoid saturates and how the measured response changes.",
    lesson: "Activation shapes gradients. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "activation-arena-005",
    title: "dense image head · case 005",
    scenario: "Investigate dense image head under high-dimensional setting.",
    failure: "dead ReLU blocks learning; case 5 makes the trade-off visible.",
    subtitle: "Output layers encode assumptions — experiment 005",
    explanation: "Move the controls to see why dead ReLU blocks learning and how the measured response changes.",
    lesson: "Output layers encode assumptions. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "activation-arena-006",
    title: "tabular residual block · case 006",
    scenario: "Investigate tabular residual block under small clean sample.",
    failure: "activation mismatches output; case 6 makes the trade-off visible.",
    subtitle: "Compare distributions, not slogans — experiment 006",
    explanation: "Move the controls to see why activation mismatches output and how the measured response changes.",
    lesson: "Compare distributions, not slogans. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "activation-arena-007",
    title: "language feed-forward layer · case 007",
    scenario: "Investigate language feed-forward layer under large noisy sample.",
    failure: "sigmoid saturates; case 7 makes the trade-off visible.",
    subtitle: "Activation shapes gradients — experiment 007",
    explanation: "Move the controls to see why sigmoid saturates and how the measured response changes.",
    lesson: "Activation shapes gradients. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "activation-arena-008",
    title: "binary classifier output · case 008",
    scenario: "Investigate binary classifier output under shifted production slice.",
    failure: "dead ReLU blocks learning; case 8 makes the trade-off visible.",
    subtitle: "Output layers encode assumptions — experiment 008",
    explanation: "Move the controls to see why dead ReLU blocks learning and how the measured response changes.",
    lesson: "Output layers encode assumptions. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "activation-arena-009",
    title: "dense image head · case 009",
    scenario: "Investigate dense image head under rare-event regime.",
    failure: "activation mismatches output; case 9 makes the trade-off visible.",
    subtitle: "Compare distributions, not slogans — experiment 009",
    explanation: "Move the controls to see why activation mismatches output and how the measured response changes.",
    lesson: "Compare distributions, not slogans. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "activation-arena-010",
    title: "tabular residual block · case 010",
    scenario: "Investigate tabular residual block under high-dimensional setting.",
    failure: "sigmoid saturates; case 10 makes the trade-off visible.",
    subtitle: "Activation shapes gradients — experiment 010",
    explanation: "Move the controls to see why sigmoid saturates and how the measured response changes.",
    lesson: "Activation shapes gradients. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "activation-arena-011",
    title: "language feed-forward layer · case 011",
    scenario: "Investigate language feed-forward layer under small clean sample.",
    failure: "dead ReLU blocks learning; case 11 makes the trade-off visible.",
    subtitle: "Output layers encode assumptions — experiment 011",
    explanation: "Move the controls to see why dead ReLU blocks learning and how the measured response changes.",
    lesson: "Output layers encode assumptions. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "activation-arena-012",
    title: "binary classifier output · case 012",
    scenario: "Investigate binary classifier output under large noisy sample.",
    failure: "activation mismatches output; case 12 makes the trade-off visible.",
    subtitle: "Compare distributions, not slogans — experiment 012",
    explanation: "Move the controls to see why activation mismatches output and how the measured response changes.",
    lesson: "Compare distributions, not slogans. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function ActivationArenaLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

