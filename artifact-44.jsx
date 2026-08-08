import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Training Stability Control Room",
  "kicker": "Deep learning interactive lab",
  "description": "Probe neural-network dynamics with interactive controls, live diagnostics, and production-focused debugging cases.",
  "mode": "timeline",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "#fb7185",
    "secondary": "#4ade80",
    "background": "#150a10",
    "panel": "#28121e",
    "ink": "#fff1f2",
    "muted": "#c8a2b5",
    "line": "#5b2c43",
    "soft": "#411d31"
  },
  "controlTitle": "Training Stability Control Room controls",
  "controls": [
    {
      "label": "Warmup length",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune warmup length and observe how the experiment responds."
    },
    {
      "label": "Clip threshold",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing clip threshold."
    },
    {
      "label": "Normalization strength",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use normalization strength to expose boundary behavior."
    }
  ],
  "visualTitle": "Training Stability Control Room live view",
  "metrics": [
    {
      "label": "Stable steps",
      "detail": "primary behavior"
    },
    {
      "label": "Gradient margin",
      "detail": "robustness check"
    },
    {
      "label": "Recovery cost",
      "detail": "resource demand"
    },
    {
      "label": "Run confidence",
      "detail": "decision quality"
    }
  ],
  "formula": "g′ = g·min(1,c/||g||)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Log before failure",
      "body": "Principle 1: apply this idea when reviewing training stability control room results."
    },
    {
      "title": "Stability tools interact",
      "body": "Principle 2: apply this idea when reviewing training stability control room results."
    },
    {
      "title": "Recovery must preserve state",
      "body": "Principle 3: apply this idea when reviewing training stability control room results."
    }
  ]
};

const CASES = [
  {
    id: "training-stability-001",
    title: "large transformer run · case 001",
    scenario: "Investigate large transformer run under small clean sample.",
    failure: "loss becomes NaN; case 1 makes the trade-off visible.",
    subtitle: "Log before failure — experiment 001",
    explanation: "Move the controls to see why loss becomes NaN and how the measured response changes.",
    lesson: "Log before failure. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "training-stability-002",
    title: "mixed precision vision run · case 002",
    scenario: "Investigate mixed precision vision run under large noisy sample.",
    failure: "gradient spikes after batch; case 2 makes the trade-off visible.",
    subtitle: "Stability tools interact — experiment 002",
    explanation: "Move the controls to see why gradient spikes after batch and how the measured response changes.",
    lesson: "Stability tools interact. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "training-stability-003",
    title: "recurrent audio model · case 003",
    scenario: "Investigate recurrent audio model under shifted production slice.",
    failure: "normalization statistics drift; case 3 makes the trade-off visible.",
    subtitle: "Recovery must preserve state — experiment 003",
    explanation: "Move the controls to see why normalization statistics drift and how the measured response changes.",
    lesson: "Recovery must preserve state. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "training-stability-004",
    title: "multi-task network · case 004",
    scenario: "Investigate multi-task network under rare-event regime.",
    failure: "loss becomes NaN; case 4 makes the trade-off visible.",
    subtitle: "Log before failure — experiment 004",
    explanation: "Move the controls to see why loss becomes NaN and how the measured response changes.",
    lesson: "Log before failure. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "training-stability-005",
    title: "large transformer run · case 005",
    scenario: "Investigate large transformer run under high-dimensional setting.",
    failure: "gradient spikes after batch; case 5 makes the trade-off visible.",
    subtitle: "Stability tools interact — experiment 005",
    explanation: "Move the controls to see why gradient spikes after batch and how the measured response changes.",
    lesson: "Stability tools interact. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "training-stability-006",
    title: "mixed precision vision run · case 006",
    scenario: "Investigate mixed precision vision run under small clean sample.",
    failure: "normalization statistics drift; case 6 makes the trade-off visible.",
    subtitle: "Recovery must preserve state — experiment 006",
    explanation: "Move the controls to see why normalization statistics drift and how the measured response changes.",
    lesson: "Recovery must preserve state. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "training-stability-007",
    title: "recurrent audio model · case 007",
    scenario: "Investigate recurrent audio model under large noisy sample.",
    failure: "loss becomes NaN; case 7 makes the trade-off visible.",
    subtitle: "Log before failure — experiment 007",
    explanation: "Move the controls to see why loss becomes NaN and how the measured response changes.",
    lesson: "Log before failure. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "training-stability-008",
    title: "multi-task network · case 008",
    scenario: "Investigate multi-task network under shifted production slice.",
    failure: "gradient spikes after batch; case 8 makes the trade-off visible.",
    subtitle: "Stability tools interact — experiment 008",
    explanation: "Move the controls to see why gradient spikes after batch and how the measured response changes.",
    lesson: "Stability tools interact. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "training-stability-009",
    title: "large transformer run · case 009",
    scenario: "Investigate large transformer run under rare-event regime.",
    failure: "normalization statistics drift; case 9 makes the trade-off visible.",
    subtitle: "Recovery must preserve state — experiment 009",
    explanation: "Move the controls to see why normalization statistics drift and how the measured response changes.",
    lesson: "Recovery must preserve state. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "training-stability-010",
    title: "mixed precision vision run · case 010",
    scenario: "Investigate mixed precision vision run under high-dimensional setting.",
    failure: "loss becomes NaN; case 10 makes the trade-off visible.",
    subtitle: "Log before failure — experiment 010",
    explanation: "Move the controls to see why loss becomes NaN and how the measured response changes.",
    lesson: "Log before failure. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "training-stability-011",
    title: "recurrent audio model · case 011",
    scenario: "Investigate recurrent audio model under small clean sample.",
    failure: "gradient spikes after batch; case 11 makes the trade-off visible.",
    subtitle: "Stability tools interact — experiment 011",
    explanation: "Move the controls to see why gradient spikes after batch and how the measured response changes.",
    lesson: "Stability tools interact. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "training-stability-012",
    title: "multi-task network · case 012",
    scenario: "Investigate multi-task network under large noisy sample.",
    failure: "normalization statistics drift; case 12 makes the trade-off visible.",
    subtitle: "Recovery must preserve state — experiment 012",
    explanation: "Move the controls to see why normalization statistics drift and how the measured response changes.",
    lesson: "Recovery must preserve state. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function TrainingStabilityLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

