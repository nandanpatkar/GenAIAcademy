import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Backpropagation Debugger",
  "kicker": "Deep learning interactive lab",
  "description": "Probe neural-network dynamics with interactive controls, live diagnostics, and production-focused debugging cases.",
  "mode": "network",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "#f43f5e",
    "secondary": "#60a5fa",
    "background": "#14090d",
    "panel": "#241017",
    "ink": "#fff1f2",
    "muted": "#c5a0aa",
    "line": "#5b2635",
    "soft": "#3c1723"
  },
  "controlTitle": "Backpropagation Debugger controls",
  "controls": [
    {
      "label": "Learning rate",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune learning rate and observe how the experiment responds."
    },
    {
      "label": "Graph depth",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing graph depth."
    },
    {
      "label": "Gradient clipping",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use gradient clipping to expose boundary behavior."
    }
  ],
  "visualTitle": "Backpropagation Debugger live view",
  "metrics": [
    {
      "label": "Gradient flow",
      "detail": "primary behavior"
    },
    {
      "label": "Loss descent",
      "detail": "robustness check"
    },
    {
      "label": "Backprop ops",
      "detail": "resource demand"
    },
    {
      "label": "Update trust",
      "detail": "decision quality"
    }
  ],
  "formula": "∂L/∂w = ∂L/∂ŷ · ∂ŷ/∂h · ∂h/∂w",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Trace the computation graph",
      "body": "Principle 1: apply this idea when reviewing backpropagation debugger results."
    },
    {
      "title": "Zero gradients deliberately",
      "body": "Principle 2: apply this idea when reviewing backpropagation debugger results."
    },
    {
      "title": "Inspect norms layer by layer",
      "body": "Principle 3: apply this idea when reviewing backpropagation debugger results."
    }
  ]
};

const CASES = [
  {
    id: "backprop-debugger-001",
    title: "deep regression stack · case 001",
    scenario: "Investigate deep regression stack under small clean sample.",
    failure: "detached tensor stops flow; case 1 makes the trade-off visible.",
    subtitle: "Trace the computation graph — experiment 001",
    explanation: "Move the controls to see why detached tensor stops flow and how the measured response changes.",
    lesson: "Trace the computation graph. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "backprop-debugger-002",
    title: "recurrent sequence model · case 002",
    scenario: "Investigate recurrent sequence model under large noisy sample.",
    failure: "gradient explodes upstream; case 2 makes the trade-off visible.",
    subtitle: "Zero gradients deliberately — experiment 002",
    explanation: "Move the controls to see why gradient explodes upstream and how the measured response changes.",
    lesson: "Zero gradients deliberately. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "backprop-debugger-003",
    title: "multi-head objective · case 003",
    scenario: "Investigate multi-head objective under shifted production slice.",
    failure: "stale gradients accumulate; case 3 makes the trade-off visible.",
    subtitle: "Inspect norms layer by layer — experiment 003",
    explanation: "Move the controls to see why stale gradients accumulate and how the measured response changes.",
    lesson: "Inspect norms layer by layer. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "backprop-debugger-004",
    title: "custom differentiable layer · case 004",
    scenario: "Investigate custom differentiable layer under rare-event regime.",
    failure: "detached tensor stops flow; case 4 makes the trade-off visible.",
    subtitle: "Trace the computation graph — experiment 004",
    explanation: "Move the controls to see why detached tensor stops flow and how the measured response changes.",
    lesson: "Trace the computation graph. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "backprop-debugger-005",
    title: "deep regression stack · case 005",
    scenario: "Investigate deep regression stack under high-dimensional setting.",
    failure: "gradient explodes upstream; case 5 makes the trade-off visible.",
    subtitle: "Zero gradients deliberately — experiment 005",
    explanation: "Move the controls to see why gradient explodes upstream and how the measured response changes.",
    lesson: "Zero gradients deliberately. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "backprop-debugger-006",
    title: "recurrent sequence model · case 006",
    scenario: "Investigate recurrent sequence model under small clean sample.",
    failure: "stale gradients accumulate; case 6 makes the trade-off visible.",
    subtitle: "Inspect norms layer by layer — experiment 006",
    explanation: "Move the controls to see why stale gradients accumulate and how the measured response changes.",
    lesson: "Inspect norms layer by layer. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "backprop-debugger-007",
    title: "multi-head objective · case 007",
    scenario: "Investigate multi-head objective under large noisy sample.",
    failure: "detached tensor stops flow; case 7 makes the trade-off visible.",
    subtitle: "Trace the computation graph — experiment 007",
    explanation: "Move the controls to see why detached tensor stops flow and how the measured response changes.",
    lesson: "Trace the computation graph. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "backprop-debugger-008",
    title: "custom differentiable layer · case 008",
    scenario: "Investigate custom differentiable layer under shifted production slice.",
    failure: "gradient explodes upstream; case 8 makes the trade-off visible.",
    subtitle: "Zero gradients deliberately — experiment 008",
    explanation: "Move the controls to see why gradient explodes upstream and how the measured response changes.",
    lesson: "Zero gradients deliberately. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "backprop-debugger-009",
    title: "deep regression stack · case 009",
    scenario: "Investigate deep regression stack under rare-event regime.",
    failure: "stale gradients accumulate; case 9 makes the trade-off visible.",
    subtitle: "Inspect norms layer by layer — experiment 009",
    explanation: "Move the controls to see why stale gradients accumulate and how the measured response changes.",
    lesson: "Inspect norms layer by layer. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "backprop-debugger-010",
    title: "recurrent sequence model · case 010",
    scenario: "Investigate recurrent sequence model under high-dimensional setting.",
    failure: "detached tensor stops flow; case 10 makes the trade-off visible.",
    subtitle: "Trace the computation graph — experiment 010",
    explanation: "Move the controls to see why detached tensor stops flow and how the measured response changes.",
    lesson: "Trace the computation graph. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "backprop-debugger-011",
    title: "multi-head objective · case 011",
    scenario: "Investigate multi-head objective under small clean sample.",
    failure: "gradient explodes upstream; case 11 makes the trade-off visible.",
    subtitle: "Zero gradients deliberately — experiment 011",
    explanation: "Move the controls to see why gradient explodes upstream and how the measured response changes.",
    lesson: "Zero gradients deliberately. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "backprop-debugger-012",
    title: "custom differentiable layer · case 012",
    scenario: "Investigate custom differentiable layer under large noisy sample.",
    failure: "stale gradients accumulate; case 12 makes the trade-off visible.",
    subtitle: "Inspect norms layer by layer — experiment 012",
    explanation: "Move the controls to see why stale gradients accumulate and how the measured response changes.",
    lesson: "Inspect norms layer by layer. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function BackpropDebuggerLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

