import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Optimizer Race Track",
  "kicker": "Deep learning interactive lab",
  "description": "Probe neural-network dynamics with interactive controls, live diagnostics, and production-focused debugging cases.",
  "mode": "timeline",
  "variant": 3,
  "dark": true,
  "palette": {
    "primary": "#eab308",
    "secondary": "#06b6d4",
    "background": "#151307",
    "panel": "#28240d",
    "ink": "#fefce8",
    "muted": "#b8b080",
    "line": "#58501a",
    "soft": "#3f3910"
  },
  "controlTitle": "Optimizer Race Track controls",
  "controls": [
    {
      "label": "Step size",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune step size and observe how the experiment responds."
    },
    {
      "label": "Momentum",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing momentum."
    },
    {
      "label": "Batch noise",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use batch noise to expose boundary behavior."
    }
  ],
  "visualTitle": "Optimizer Race Track live view",
  "metrics": [
    {
      "label": "Convergence",
      "detail": "primary behavior"
    },
    {
      "label": "Oscillation",
      "detail": "robustness check"
    },
    {
      "label": "Steps",
      "detail": "resource demand"
    },
    {
      "label": "Optimizer trust",
      "detail": "decision quality"
    }
  ],
  "formula": "θₜ₊₁ = θₜ − η·update(gₜ)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Compare equal budgets",
      "body": "Principle 1: apply this idea when reviewing optimizer race track results."
    },
    {
      "title": "Schedules matter",
      "body": "Principle 2: apply this idea when reviewing optimizer race track results."
    },
    {
      "title": "Optimizer cannot fix bad data",
      "body": "Principle 3: apply this idea when reviewing optimizer race track results."
    }
  ]
};

const CASES = [
  {
    id: "optimizer-race-001",
    title: "noisy convex basin · case 001",
    scenario: "Investigate noisy convex basin under small clean sample.",
    failure: "steps overshoot valley; case 1 makes the trade-off visible.",
    subtitle: "Compare equal budgets — experiment 001",
    explanation: "Move the controls to see why steps overshoot valley and how the measured response changes.",
    lesson: "Compare equal budgets. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "optimizer-race-002",
    title: "sparse embedding task · case 002",
    scenario: "Investigate sparse embedding task under large noisy sample.",
    failure: "momentum carries past optimum; case 2 makes the trade-off visible.",
    subtitle: "Schedules matter — experiment 002",
    explanation: "Move the controls to see why momentum carries past optimum and how the measured response changes.",
    lesson: "Schedules matter. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "optimizer-race-003",
    title: "vision fine-tuning run · case 003",
    scenario: "Investigate vision fine-tuning run under shifted production slice.",
    failure: "adaptive rate masks instability; case 3 makes the trade-off visible.",
    subtitle: "Optimizer cannot fix bad data — experiment 003",
    explanation: "Move the controls to see why adaptive rate masks instability and how the measured response changes.",
    lesson: "Optimizer cannot fix bad data. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "optimizer-race-004",
    title: "transformer pretraining slice · case 004",
    scenario: "Investigate transformer pretraining slice under rare-event regime.",
    failure: "steps overshoot valley; case 4 makes the trade-off visible.",
    subtitle: "Compare equal budgets — experiment 004",
    explanation: "Move the controls to see why steps overshoot valley and how the measured response changes.",
    lesson: "Compare equal budgets. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "optimizer-race-005",
    title: "noisy convex basin · case 005",
    scenario: "Investigate noisy convex basin under high-dimensional setting.",
    failure: "momentum carries past optimum; case 5 makes the trade-off visible.",
    subtitle: "Schedules matter — experiment 005",
    explanation: "Move the controls to see why momentum carries past optimum and how the measured response changes.",
    lesson: "Schedules matter. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "optimizer-race-006",
    title: "sparse embedding task · case 006",
    scenario: "Investigate sparse embedding task under small clean sample.",
    failure: "adaptive rate masks instability; case 6 makes the trade-off visible.",
    subtitle: "Optimizer cannot fix bad data — experiment 006",
    explanation: "Move the controls to see why adaptive rate masks instability and how the measured response changes.",
    lesson: "Optimizer cannot fix bad data. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "optimizer-race-007",
    title: "vision fine-tuning run · case 007",
    scenario: "Investigate vision fine-tuning run under large noisy sample.",
    failure: "steps overshoot valley; case 7 makes the trade-off visible.",
    subtitle: "Compare equal budgets — experiment 007",
    explanation: "Move the controls to see why steps overshoot valley and how the measured response changes.",
    lesson: "Compare equal budgets. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "optimizer-race-008",
    title: "transformer pretraining slice · case 008",
    scenario: "Investigate transformer pretraining slice under shifted production slice.",
    failure: "momentum carries past optimum; case 8 makes the trade-off visible.",
    subtitle: "Schedules matter — experiment 008",
    explanation: "Move the controls to see why momentum carries past optimum and how the measured response changes.",
    lesson: "Schedules matter. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "optimizer-race-009",
    title: "noisy convex basin · case 009",
    scenario: "Investigate noisy convex basin under rare-event regime.",
    failure: "adaptive rate masks instability; case 9 makes the trade-off visible.",
    subtitle: "Optimizer cannot fix bad data — experiment 009",
    explanation: "Move the controls to see why adaptive rate masks instability and how the measured response changes.",
    lesson: "Optimizer cannot fix bad data. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "optimizer-race-010",
    title: "sparse embedding task · case 010",
    scenario: "Investigate sparse embedding task under high-dimensional setting.",
    failure: "steps overshoot valley; case 10 makes the trade-off visible.",
    subtitle: "Compare equal budgets — experiment 010",
    explanation: "Move the controls to see why steps overshoot valley and how the measured response changes.",
    lesson: "Compare equal budgets. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "optimizer-race-011",
    title: "vision fine-tuning run · case 011",
    scenario: "Investigate vision fine-tuning run under small clean sample.",
    failure: "momentum carries past optimum; case 11 makes the trade-off visible.",
    subtitle: "Schedules matter — experiment 011",
    explanation: "Move the controls to see why momentum carries past optimum and how the measured response changes.",
    lesson: "Schedules matter. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "optimizer-race-012",
    title: "transformer pretraining slice · case 012",
    scenario: "Investigate transformer pretraining slice under large noisy sample.",
    failure: "adaptive rate masks instability; case 12 makes the trade-off visible.",
    subtitle: "Optimizer cannot fix bad data — experiment 012",
    explanation: "Move the controls to see why adaptive rate masks instability and how the measured response changes.",
    lesson: "Optimizer cannot fix bad data. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function OptimizerRaceLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

