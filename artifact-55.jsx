import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Correlation vs Causation Lab",
  "kicker": "Statistics & probability interactive lab",
  "description": "Build statistical intuition by changing assumptions, sampling regimes, and uncertainty controls in real time.",
  "mode": "neighbors",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "#fb7185",
    "secondary": "#818cf8",
    "background": "#140b12",
    "panel": "#251425",
    "ink": "#fff1f2",
    "muted": "#bd9eb4",
    "line": "#573050",
    "soft": "#3c203a"
  },
  "controlTitle": "Correlation vs Causation Lab controls",
  "controls": [
    {
      "label": "Confounding strength",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune confounding strength and observe how the experiment responds."
    },
    {
      "label": "Treatment overlap",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing treatment overlap."
    },
    {
      "label": "Adjustment depth",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use adjustment depth to expose boundary behavior."
    }
  ],
  "visualTitle": "Correlation vs Causation Lab live view",
  "metrics": [
    {
      "label": "Association",
      "detail": "primary behavior"
    },
    {
      "label": "Balance",
      "detail": "robustness check"
    },
    {
      "label": "Matched units",
      "detail": "resource demand"
    },
    {
      "label": "Causal trust",
      "detail": "decision quality"
    }
  ],
  "formula": "ATE = E[Y(1)−Y(0)]",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Draw the causal story",
      "body": "Principle 1: apply this idea when reviewing correlation vs causation lab results."
    },
    {
      "title": "Adjustment needs assumptions",
      "body": "Principle 2: apply this idea when reviewing correlation vs causation lab results."
    },
    {
      "title": "Association alone is descriptive",
      "body": "Principle 3: apply this idea when reviewing correlation vs causation lab results."
    }
  ]
};

const CASES = [
  {
    id: "causation-lab-001",
    title: "exercise outcome study · case 001",
    scenario: "Investigate exercise outcome study under small clean sample.",
    failure: "confounder creates correlation; case 1 makes the trade-off visible.",
    subtitle: "Draw the causal story — experiment 001",
    explanation: "Move the controls to see why confounder creates correlation and how the measured response changes.",
    lesson: "Draw the causal story. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "causation-lab-002",
    title: "pricing policy analysis · case 002",
    scenario: "Investigate pricing policy analysis under large noisy sample.",
    failure: "collider adjustment adds bias; case 2 makes the trade-off visible.",
    subtitle: "Adjustment needs assumptions — experiment 002",
    explanation: "Move the controls to see why collider adjustment adds bias and how the measured response changes.",
    lesson: "Adjustment needs assumptions. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "causation-lab-003",
    title: "marketing campaign lift · case 003",
    scenario: "Investigate marketing campaign lift under shifted production slice.",
    failure: "poor overlap forces extrapolation; case 3 makes the trade-off visible.",
    subtitle: "Association alone is descriptive — experiment 003",
    explanation: "Move the controls to see why poor overlap forces extrapolation and how the measured response changes.",
    lesson: "Association alone is descriptive. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "causation-lab-004",
    title: "education program evaluation · case 004",
    scenario: "Investigate education program evaluation under rare-event regime.",
    failure: "confounder creates correlation; case 4 makes the trade-off visible.",
    subtitle: "Draw the causal story — experiment 004",
    explanation: "Move the controls to see why confounder creates correlation and how the measured response changes.",
    lesson: "Draw the causal story. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "causation-lab-005",
    title: "exercise outcome study · case 005",
    scenario: "Investigate exercise outcome study under high-dimensional setting.",
    failure: "collider adjustment adds bias; case 5 makes the trade-off visible.",
    subtitle: "Adjustment needs assumptions — experiment 005",
    explanation: "Move the controls to see why collider adjustment adds bias and how the measured response changes.",
    lesson: "Adjustment needs assumptions. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "causation-lab-006",
    title: "pricing policy analysis · case 006",
    scenario: "Investigate pricing policy analysis under small clean sample.",
    failure: "poor overlap forces extrapolation; case 6 makes the trade-off visible.",
    subtitle: "Association alone is descriptive — experiment 006",
    explanation: "Move the controls to see why poor overlap forces extrapolation and how the measured response changes.",
    lesson: "Association alone is descriptive. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "causation-lab-007",
    title: "marketing campaign lift · case 007",
    scenario: "Investigate marketing campaign lift under large noisy sample.",
    failure: "confounder creates correlation; case 7 makes the trade-off visible.",
    subtitle: "Draw the causal story — experiment 007",
    explanation: "Move the controls to see why confounder creates correlation and how the measured response changes.",
    lesson: "Draw the causal story. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "causation-lab-008",
    title: "education program evaluation · case 008",
    scenario: "Investigate education program evaluation under shifted production slice.",
    failure: "collider adjustment adds bias; case 8 makes the trade-off visible.",
    subtitle: "Adjustment needs assumptions — experiment 008",
    explanation: "Move the controls to see why collider adjustment adds bias and how the measured response changes.",
    lesson: "Adjustment needs assumptions. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "causation-lab-009",
    title: "exercise outcome study · case 009",
    scenario: "Investigate exercise outcome study under rare-event regime.",
    failure: "poor overlap forces extrapolation; case 9 makes the trade-off visible.",
    subtitle: "Association alone is descriptive — experiment 009",
    explanation: "Move the controls to see why poor overlap forces extrapolation and how the measured response changes.",
    lesson: "Association alone is descriptive. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "causation-lab-010",
    title: "pricing policy analysis · case 010",
    scenario: "Investigate pricing policy analysis under high-dimensional setting.",
    failure: "confounder creates correlation; case 10 makes the trade-off visible.",
    subtitle: "Draw the causal story — experiment 010",
    explanation: "Move the controls to see why confounder creates correlation and how the measured response changes.",
    lesson: "Draw the causal story. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "causation-lab-011",
    title: "marketing campaign lift · case 011",
    scenario: "Investigate marketing campaign lift under small clean sample.",
    failure: "collider adjustment adds bias; case 11 makes the trade-off visible.",
    subtitle: "Adjustment needs assumptions — experiment 011",
    explanation: "Move the controls to see why collider adjustment adds bias and how the measured response changes.",
    lesson: "Adjustment needs assumptions. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "causation-lab-012",
    title: "education program evaluation · case 012",
    scenario: "Investigate education program evaluation under large noisy sample.",
    failure: "poor overlap forces extrapolation; case 12 makes the trade-off visible.",
    subtitle: "Association alone is descriptive — experiment 012",
    explanation: "Move the controls to see why poor overlap forces extrapolation and how the measured response changes.",
    lesson: "Association alone is descriptive. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function CorrelationCausationLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

