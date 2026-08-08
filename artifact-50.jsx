import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Probability Distribution Explorer",
  "kicker": "Statistics & probability interactive lab",
  "description": "Build statistical intuition by changing assumptions, sampling regimes, and uncertainty controls in real time.",
  "mode": "distribution",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "#4338ca",
    "secondary": "#ea580c",
    "background": "#eef2ff",
    "panel": "#ffffff",
    "ink": "#171733",
    "muted": "#696983",
    "line": "#d9daf0",
    "soft": "#e0e7ff"
  },
  "controlTitle": "Probability Distribution Explorer controls",
  "controls": [
    {
      "label": "Location μ",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune location μ and observe how the experiment responds."
    },
    {
      "label": "Spread σ",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing spread σ."
    },
    {
      "label": "Tail cutoff",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use tail cutoff to expose boundary behavior."
    }
  ],
  "visualTitle": "Probability Distribution Explorer live view",
  "metrics": [
    {
      "label": "Tail mass",
      "detail": "primary behavior"
    },
    {
      "label": "Central coverage",
      "detail": "robustness check"
    },
    {
      "label": "Samples",
      "detail": "resource demand"
    },
    {
      "label": "Estimate trust",
      "detail": "decision quality"
    }
  ],
  "formula": "z = (x−μ)/σ",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Shape before summary",
      "body": "Principle 1: apply this idea when reviewing probability distribution explorer results."
    },
    {
      "title": "Tails drive risk",
      "body": "Principle 2: apply this idea when reviewing probability distribution explorer results."
    },
    {
      "title": "Parameters need context",
      "body": "Principle 3: apply this idea when reviewing probability distribution explorer results."
    }
  ]
};

const CASES = [
  {
    id: "distribution-explorer-001",
    title: "delivery time model · case 001",
    scenario: "Investigate delivery time model under small clean sample.",
    failure: "normal model misses skew; case 1 makes the trade-off visible.",
    subtitle: "Shape before summary — experiment 001",
    explanation: "Move the controls to see why normal model misses skew and how the measured response changes.",
    lesson: "Shape before summary. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "distribution-explorer-002",
    title: "measurement error sample · case 002",
    scenario: "Investigate measurement error sample under large noisy sample.",
    failure: "tail event is underestimated; case 2 makes the trade-off visible.",
    subtitle: "Tails drive risk — experiment 002",
    explanation: "Move the controls to see why tail event is underestimated and how the measured response changes.",
    lesson: "Tails drive risk. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "distribution-explorer-003",
    title: "customer spend distribution · case 003",
    scenario: "Investigate customer spend distribution under shifted production slice.",
    failure: "summary hides multimodality; case 3 makes the trade-off visible.",
    subtitle: "Parameters need context — experiment 003",
    explanation: "Move the controls to see why summary hides multimodality and how the measured response changes.",
    lesson: "Parameters need context. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "distribution-explorer-004",
    title: "manufacturing tolerance · case 004",
    scenario: "Investigate manufacturing tolerance under rare-event regime.",
    failure: "normal model misses skew; case 4 makes the trade-off visible.",
    subtitle: "Shape before summary — experiment 004",
    explanation: "Move the controls to see why normal model misses skew and how the measured response changes.",
    lesson: "Shape before summary. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "distribution-explorer-005",
    title: "delivery time model · case 005",
    scenario: "Investigate delivery time model under high-dimensional setting.",
    failure: "tail event is underestimated; case 5 makes the trade-off visible.",
    subtitle: "Tails drive risk — experiment 005",
    explanation: "Move the controls to see why tail event is underestimated and how the measured response changes.",
    lesson: "Tails drive risk. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "distribution-explorer-006",
    title: "measurement error sample · case 006",
    scenario: "Investigate measurement error sample under small clean sample.",
    failure: "summary hides multimodality; case 6 makes the trade-off visible.",
    subtitle: "Parameters need context — experiment 006",
    explanation: "Move the controls to see why summary hides multimodality and how the measured response changes.",
    lesson: "Parameters need context. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "distribution-explorer-007",
    title: "customer spend distribution · case 007",
    scenario: "Investigate customer spend distribution under large noisy sample.",
    failure: "normal model misses skew; case 7 makes the trade-off visible.",
    subtitle: "Shape before summary — experiment 007",
    explanation: "Move the controls to see why normal model misses skew and how the measured response changes.",
    lesson: "Shape before summary. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "distribution-explorer-008",
    title: "manufacturing tolerance · case 008",
    scenario: "Investigate manufacturing tolerance under shifted production slice.",
    failure: "tail event is underestimated; case 8 makes the trade-off visible.",
    subtitle: "Tails drive risk — experiment 008",
    explanation: "Move the controls to see why tail event is underestimated and how the measured response changes.",
    lesson: "Tails drive risk. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "distribution-explorer-009",
    title: "delivery time model · case 009",
    scenario: "Investigate delivery time model under rare-event regime.",
    failure: "summary hides multimodality; case 9 makes the trade-off visible.",
    subtitle: "Parameters need context — experiment 009",
    explanation: "Move the controls to see why summary hides multimodality and how the measured response changes.",
    lesson: "Parameters need context. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "distribution-explorer-010",
    title: "measurement error sample · case 010",
    scenario: "Investigate measurement error sample under high-dimensional setting.",
    failure: "normal model misses skew; case 10 makes the trade-off visible.",
    subtitle: "Shape before summary — experiment 010",
    explanation: "Move the controls to see why normal model misses skew and how the measured response changes.",
    lesson: "Shape before summary. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "distribution-explorer-011",
    title: "customer spend distribution · case 011",
    scenario: "Investigate customer spend distribution under small clean sample.",
    failure: "tail event is underestimated; case 11 makes the trade-off visible.",
    subtitle: "Tails drive risk — experiment 011",
    explanation: "Move the controls to see why tail event is underestimated and how the measured response changes.",
    lesson: "Tails drive risk. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "distribution-explorer-012",
    title: "manufacturing tolerance · case 012",
    scenario: "Investigate manufacturing tolerance under large noisy sample.",
    failure: "summary hides multimodality; case 12 makes the trade-off visible.",
    subtitle: "Parameters need context — experiment 012",
    explanation: "Move the controls to see why summary hides multimodality and how the measured response changes.",
    lesson: "Parameters need context. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function ProbabilityDistributionLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

