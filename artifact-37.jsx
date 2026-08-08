import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Tensor Shape Gym",
  "kicker": "Deep learning interactive lab",
  "description": "Probe neural-network dynamics with interactive controls, live diagnostics, and production-focused debugging cases.",
  "mode": "network",
  "variant": 0,
  "dark": true,
  "palette": {
    "primary": "#8b5cf6",
    "secondary": "#22d3ee",
    "background": "#0d0b1a",
    "panel": "#17132b",
    "ink": "#f5f3ff",
    "muted": "#aaa0cc",
    "line": "#39305b",
    "soft": "#292044"
  },
  "controlTitle": "Tensor Shape Gym controls",
  "controls": [
    {
      "label": "Batch width",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune batch width and observe how the experiment responds."
    },
    {
      "label": "Hidden channels",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing hidden channels."
    },
    {
      "label": "Sequence length",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use sequence length to expose boundary behavior."
    }
  ],
  "visualTitle": "Tensor Shape Gym live view",
  "metrics": [
    {
      "label": "Shape validity",
      "detail": "primary behavior"
    },
    {
      "label": "Memory fit",
      "detail": "robustness check"
    },
    {
      "label": "Tensor ops",
      "detail": "resource demand"
    },
    {
      "label": "Graph confidence",
      "detail": "decision quality"
    }
  ],
  "formula": "[B,T,D] × [D,H] → [B,T,H]",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Name every axis",
      "body": "Principle 1: apply this idea when reviewing tensor shape gym results."
    },
    {
      "title": "Check shapes at boundaries",
      "body": "Principle 2: apply this idea when reviewing tensor shape gym results."
    },
    {
      "title": "Broadcasting deserves suspicion",
      "body": "Principle 3: apply this idea when reviewing tensor shape gym results."
    }
  ]
};

const CASES = [
  {
    id: "tensor-shape-001",
    title: "sequence encoder · case 001",
    scenario: "Investigate sequence encoder under small clean sample.",
    failure: "broadcast hides a bug; case 1 makes the trade-off visible.",
    subtitle: "Name every axis — experiment 001",
    explanation: "Move the controls to see why broadcast hides a bug and how the measured response changes.",
    lesson: "Name every axis. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "tensor-shape-002",
    title: "image mini-batch · case 002",
    scenario: "Investigate image mini-batch under large noisy sample.",
    failure: "axes transpose silently; case 2 makes the trade-off visible.",
    subtitle: "Check shapes at boundaries — experiment 002",
    explanation: "Move the controls to see why axes transpose silently and how the measured response changes.",
    lesson: "Check shapes at boundaries. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "tensor-shape-003",
    title: "multimodal fusion block · case 003",
    scenario: "Investigate multimodal fusion block under shifted production slice.",
    failure: "batch dimension collapses; case 3 makes the trade-off visible.",
    subtitle: "Broadcasting deserves suspicion — experiment 003",
    explanation: "Move the controls to see why batch dimension collapses and how the measured response changes.",
    lesson: "Broadcasting deserves suspicion. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "tensor-shape-004",
    title: "time-series network · case 004",
    scenario: "Investigate time-series network under rare-event regime.",
    failure: "broadcast hides a bug; case 4 makes the trade-off visible.",
    subtitle: "Name every axis — experiment 004",
    explanation: "Move the controls to see why broadcast hides a bug and how the measured response changes.",
    lesson: "Name every axis. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "tensor-shape-005",
    title: "sequence encoder · case 005",
    scenario: "Investigate sequence encoder under high-dimensional setting.",
    failure: "axes transpose silently; case 5 makes the trade-off visible.",
    subtitle: "Check shapes at boundaries — experiment 005",
    explanation: "Move the controls to see why axes transpose silently and how the measured response changes.",
    lesson: "Check shapes at boundaries. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "tensor-shape-006",
    title: "image mini-batch · case 006",
    scenario: "Investigate image mini-batch under small clean sample.",
    failure: "batch dimension collapses; case 6 makes the trade-off visible.",
    subtitle: "Broadcasting deserves suspicion — experiment 006",
    explanation: "Move the controls to see why batch dimension collapses and how the measured response changes.",
    lesson: "Broadcasting deserves suspicion. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "tensor-shape-007",
    title: "multimodal fusion block · case 007",
    scenario: "Investigate multimodal fusion block under large noisy sample.",
    failure: "broadcast hides a bug; case 7 makes the trade-off visible.",
    subtitle: "Name every axis — experiment 007",
    explanation: "Move the controls to see why broadcast hides a bug and how the measured response changes.",
    lesson: "Name every axis. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "tensor-shape-008",
    title: "time-series network · case 008",
    scenario: "Investigate time-series network under shifted production slice.",
    failure: "axes transpose silently; case 8 makes the trade-off visible.",
    subtitle: "Check shapes at boundaries — experiment 008",
    explanation: "Move the controls to see why axes transpose silently and how the measured response changes.",
    lesson: "Check shapes at boundaries. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "tensor-shape-009",
    title: "sequence encoder · case 009",
    scenario: "Investigate sequence encoder under rare-event regime.",
    failure: "batch dimension collapses; case 9 makes the trade-off visible.",
    subtitle: "Broadcasting deserves suspicion — experiment 009",
    explanation: "Move the controls to see why batch dimension collapses and how the measured response changes.",
    lesson: "Broadcasting deserves suspicion. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "tensor-shape-010",
    title: "image mini-batch · case 010",
    scenario: "Investigate image mini-batch under high-dimensional setting.",
    failure: "broadcast hides a bug; case 10 makes the trade-off visible.",
    subtitle: "Name every axis — experiment 010",
    explanation: "Move the controls to see why broadcast hides a bug and how the measured response changes.",
    lesson: "Name every axis. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "tensor-shape-011",
    title: "multimodal fusion block · case 011",
    scenario: "Investigate multimodal fusion block under small clean sample.",
    failure: "axes transpose silently; case 11 makes the trade-off visible.",
    subtitle: "Check shapes at boundaries — experiment 011",
    explanation: "Move the controls to see why axes transpose silently and how the measured response changes.",
    lesson: "Check shapes at boundaries. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "tensor-shape-012",
    title: "time-series network · case 012",
    scenario: "Investigate time-series network under large noisy sample.",
    failure: "batch dimension collapses; case 12 makes the trade-off visible.",
    subtitle: "Broadcasting deserves suspicion — experiment 012",
    explanation: "Move the controls to see why batch dimension collapses and how the measured response changes.",
    lesson: "Broadcasting deserves suspicion. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function TensorShapeGymLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

