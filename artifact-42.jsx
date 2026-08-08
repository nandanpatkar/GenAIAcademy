import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Attention Mechanism Lab",
  "kicker": "Deep learning interactive lab",
  "description": "Probe neural-network dynamics with interactive controls, live diagnostics, and production-focused debugging cases.",
  "mode": "matrix",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "#c084fc",
    "secondary": "#34d399",
    "background": "#110a19",
    "panel": "#21132f",
    "ink": "#faf5ff",
    "muted": "#b7a0c7",
    "line": "#4a2d60",
    "soft": "#351d49"
  },
  "controlTitle": "Attention Mechanism Lab controls",
  "controls": [
    {
      "label": "Head count",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune head count and observe how the experiment responds."
    },
    {
      "label": "Temperature",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing temperature."
    },
    {
      "label": "Context span",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use context span to expose boundary behavior."
    }
  ],
  "visualTitle": "Attention Mechanism Lab live view",
  "metrics": [
    {
      "label": "Focus quality",
      "detail": "primary behavior"
    },
    {
      "label": "Head diversity",
      "detail": "robustness check"
    },
    {
      "label": "Attention ops",
      "detail": "resource demand"
    },
    {
      "label": "Context trust",
      "detail": "decision quality"
    }
  ],
  "formula": "Attention(Q,K,V)=softmax(QKᵀ/√dₖ)V",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Attention is weighted routing",
      "body": "Principle 1: apply this idea when reviewing attention mechanism lab results."
    },
    {
      "title": "Masks define allowed evidence",
      "body": "Principle 2: apply this idea when reviewing attention mechanism lab results."
    },
    {
      "title": "Inspect heads cautiously",
      "body": "Principle 3: apply this idea when reviewing attention mechanism lab results."
    }
  ]
};

const CASES = [
  {
    id: "attention-mechanism-001",
    title: "document question answerer · case 001",
    scenario: "Investigate document question answerer under small clean sample.",
    failure: "attention diffuses broadly; case 1 makes the trade-off visible.",
    subtitle: "Attention is weighted routing — experiment 001",
    explanation: "Move the controls to see why attention diffuses broadly and how the measured response changes.",
    lesson: "Attention is weighted routing. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "attention-mechanism-002",
    title: "code completion window · case 002",
    scenario: "Investigate code completion window under large noisy sample.",
    failure: "one token dominates; case 2 makes the trade-off visible.",
    subtitle: "Masks define allowed evidence — experiment 002",
    explanation: "Move the controls to see why one token dominates and how the measured response changes.",
    lesson: "Masks define allowed evidence. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "attention-mechanism-003",
    title: "image patch encoder · case 003",
    scenario: "Investigate image patch encoder under shifted production slice.",
    failure: "mask exposes future token; case 3 makes the trade-off visible.",
    subtitle: "Inspect heads cautiously — experiment 003",
    explanation: "Move the controls to see why mask exposes future token and how the measured response changes.",
    lesson: "Inspect heads cautiously. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "attention-mechanism-004",
    title: "multilingual translator · case 004",
    scenario: "Investigate multilingual translator under rare-event regime.",
    failure: "attention diffuses broadly; case 4 makes the trade-off visible.",
    subtitle: "Attention is weighted routing — experiment 004",
    explanation: "Move the controls to see why attention diffuses broadly and how the measured response changes.",
    lesson: "Attention is weighted routing. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "attention-mechanism-005",
    title: "document question answerer · case 005",
    scenario: "Investigate document question answerer under high-dimensional setting.",
    failure: "one token dominates; case 5 makes the trade-off visible.",
    subtitle: "Masks define allowed evidence — experiment 005",
    explanation: "Move the controls to see why one token dominates and how the measured response changes.",
    lesson: "Masks define allowed evidence. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "attention-mechanism-006",
    title: "code completion window · case 006",
    scenario: "Investigate code completion window under small clean sample.",
    failure: "mask exposes future token; case 6 makes the trade-off visible.",
    subtitle: "Inspect heads cautiously — experiment 006",
    explanation: "Move the controls to see why mask exposes future token and how the measured response changes.",
    lesson: "Inspect heads cautiously. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "attention-mechanism-007",
    title: "image patch encoder · case 007",
    scenario: "Investigate image patch encoder under large noisy sample.",
    failure: "attention diffuses broadly; case 7 makes the trade-off visible.",
    subtitle: "Attention is weighted routing — experiment 007",
    explanation: "Move the controls to see why attention diffuses broadly and how the measured response changes.",
    lesson: "Attention is weighted routing. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "attention-mechanism-008",
    title: "multilingual translator · case 008",
    scenario: "Investigate multilingual translator under shifted production slice.",
    failure: "one token dominates; case 8 makes the trade-off visible.",
    subtitle: "Masks define allowed evidence — experiment 008",
    explanation: "Move the controls to see why one token dominates and how the measured response changes.",
    lesson: "Masks define allowed evidence. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "attention-mechanism-009",
    title: "document question answerer · case 009",
    scenario: "Investigate document question answerer under rare-event regime.",
    failure: "mask exposes future token; case 9 makes the trade-off visible.",
    subtitle: "Inspect heads cautiously — experiment 009",
    explanation: "Move the controls to see why mask exposes future token and how the measured response changes.",
    lesson: "Inspect heads cautiously. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "attention-mechanism-010",
    title: "code completion window · case 010",
    scenario: "Investigate code completion window under high-dimensional setting.",
    failure: "attention diffuses broadly; case 10 makes the trade-off visible.",
    subtitle: "Attention is weighted routing — experiment 010",
    explanation: "Move the controls to see why attention diffuses broadly and how the measured response changes.",
    lesson: "Attention is weighted routing. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "attention-mechanism-011",
    title: "image patch encoder · case 011",
    scenario: "Investigate image patch encoder under small clean sample.",
    failure: "one token dominates; case 11 makes the trade-off visible.",
    subtitle: "Masks define allowed evidence — experiment 011",
    explanation: "Move the controls to see why one token dominates and how the measured response changes.",
    lesson: "Masks define allowed evidence. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "attention-mechanism-012",
    title: "multilingual translator · case 012",
    scenario: "Investigate multilingual translator under large noisy sample.",
    failure: "mask exposes future token; case 12 makes the trade-off visible.",
    subtitle: "Inspect heads cautiously — experiment 012",
    explanation: "Move the controls to see why mask exposes future token and how the measured response changes.",
    lesson: "Inspect heads cautiously. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function AttentionMechanismLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

