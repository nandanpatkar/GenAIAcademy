import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Monte Carlo Experiment Lab",
  "kicker": "Statistics & probability interactive lab",
  "description": "Build statistical intuition by changing assumptions, sampling regimes, and uncertainty controls in real time.",
  "mode": "distribution",
  "variant": 2,
  "dark": true,
  "palette": {
    "primary": "#f97316",
    "secondary": "#2dd4bf",
    "background": "#170e08",
    "panel": "#29180e",
    "ink": "#fff7ed",
    "muted": "#c4a38c",
    "line": "#5b371f",
    "soft": "#402512"
  },
  "controlTitle": "Monte Carlo Experiment Lab controls",
  "controls": [
    {
      "label": "Simulation draws",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune simulation draws and observe how the experiment responds."
    },
    {
      "label": "Rare-event rate",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing rare-event rate."
    },
    {
      "label": "Variance reduction",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use variance reduction to expose boundary behavior."
    }
  ],
  "visualTitle": "Monte Carlo Experiment Lab live view",
  "metrics": [
    {
      "label": "Estimate",
      "detail": "primary behavior"
    },
    {
      "label": "Error bound",
      "detail": "robustness check"
    },
    {
      "label": "Draw cost",
      "detail": "resource demand"
    },
    {
      "label": "Simulation trust",
      "detail": "decision quality"
    }
  ],
  "formula": "Ē[f(X)] = (1/N)Σ f(Xᵢ)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Monte Carlo exposes uncertainty",
      "body": "Principle 1: apply this idea when reviewing monte carlo experiment lab results."
    },
    {
      "title": "Error shrinks slowly",
      "body": "Principle 2: apply this idea when reviewing monte carlo experiment lab results."
    },
    {
      "title": "Variance reduction is design",
      "body": "Principle 3: apply this idea when reviewing monte carlo experiment lab results."
    }
  ]
};

const CASES = [
  {
    id: "monte-carlo-001",
    title: "portfolio loss estimate · case 001",
    scenario: "Investigate portfolio loss estimate under small clean sample.",
    failure: "rare event gets no draws; case 1 makes the trade-off visible.",
    subtitle: "Monte Carlo exposes uncertainty — experiment 001",
    explanation: "Move the controls to see why rare event gets no draws and how the measured response changes.",
    lesson: "Monte Carlo exposes uncertainty. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "monte-carlo-002",
    title: "queue wait forecast · case 002",
    scenario: "Investigate queue wait forecast under large noisy sample.",
    failure: "dependent samples look precise; case 2 makes the trade-off visible.",
    subtitle: "Error shrinks slowly — experiment 002",
    explanation: "Move the controls to see why dependent samples look precise and how the measured response changes.",
    lesson: "Error shrinks slowly. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "monte-carlo-003",
    title: "project completion risk · case 003",
    scenario: "Investigate project completion risk under shifted production slice.",
    failure: "seed sensitivity is ignored; case 3 makes the trade-off visible.",
    subtitle: "Variance reduction is design — experiment 003",
    explanation: "Move the controls to see why seed sensitivity is ignored and how the measured response changes.",
    lesson: "Variance reduction is design. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "monte-carlo-004",
    title: "reliability probability · case 004",
    scenario: "Investigate reliability probability under rare-event regime.",
    failure: "rare event gets no draws; case 4 makes the trade-off visible.",
    subtitle: "Monte Carlo exposes uncertainty — experiment 004",
    explanation: "Move the controls to see why rare event gets no draws and how the measured response changes.",
    lesson: "Monte Carlo exposes uncertainty. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "monte-carlo-005",
    title: "portfolio loss estimate · case 005",
    scenario: "Investigate portfolio loss estimate under high-dimensional setting.",
    failure: "dependent samples look precise; case 5 makes the trade-off visible.",
    subtitle: "Error shrinks slowly — experiment 005",
    explanation: "Move the controls to see why dependent samples look precise and how the measured response changes.",
    lesson: "Error shrinks slowly. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "monte-carlo-006",
    title: "queue wait forecast · case 006",
    scenario: "Investigate queue wait forecast under small clean sample.",
    failure: "seed sensitivity is ignored; case 6 makes the trade-off visible.",
    subtitle: "Variance reduction is design — experiment 006",
    explanation: "Move the controls to see why seed sensitivity is ignored and how the measured response changes.",
    lesson: "Variance reduction is design. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "monte-carlo-007",
    title: "project completion risk · case 007",
    scenario: "Investigate project completion risk under large noisy sample.",
    failure: "rare event gets no draws; case 7 makes the trade-off visible.",
    subtitle: "Monte Carlo exposes uncertainty — experiment 007",
    explanation: "Move the controls to see why rare event gets no draws and how the measured response changes.",
    lesson: "Monte Carlo exposes uncertainty. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "monte-carlo-008",
    title: "reliability probability · case 008",
    scenario: "Investigate reliability probability under shifted production slice.",
    failure: "dependent samples look precise; case 8 makes the trade-off visible.",
    subtitle: "Error shrinks slowly — experiment 008",
    explanation: "Move the controls to see why dependent samples look precise and how the measured response changes.",
    lesson: "Error shrinks slowly. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "monte-carlo-009",
    title: "portfolio loss estimate · case 009",
    scenario: "Investigate portfolio loss estimate under rare-event regime.",
    failure: "seed sensitivity is ignored; case 9 makes the trade-off visible.",
    subtitle: "Variance reduction is design — experiment 009",
    explanation: "Move the controls to see why seed sensitivity is ignored and how the measured response changes.",
    lesson: "Variance reduction is design. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "monte-carlo-010",
    title: "queue wait forecast · case 010",
    scenario: "Investigate queue wait forecast under high-dimensional setting.",
    failure: "rare event gets no draws; case 10 makes the trade-off visible.",
    subtitle: "Monte Carlo exposes uncertainty — experiment 010",
    explanation: "Move the controls to see why rare event gets no draws and how the measured response changes.",
    lesson: "Monte Carlo exposes uncertainty. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "monte-carlo-011",
    title: "project completion risk · case 011",
    scenario: "Investigate project completion risk under small clean sample.",
    failure: "dependent samples look precise; case 11 makes the trade-off visible.",
    subtitle: "Error shrinks slowly — experiment 011",
    explanation: "Move the controls to see why dependent samples look precise and how the measured response changes.",
    lesson: "Error shrinks slowly. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "monte-carlo-012",
    title: "reliability probability · case 012",
    scenario: "Investigate reliability probability under large noisy sample.",
    failure: "seed sensitivity is ignored; case 12 makes the trade-off visible.",
    subtitle: "Variance reduction is design — experiment 012",
    explanation: "Move the controls to see why seed sensitivity is ignored and how the measured response changes.",
    lesson: "Variance reduction is design. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function MonteCarloLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

