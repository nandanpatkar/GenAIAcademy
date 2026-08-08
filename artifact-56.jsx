import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Markov Chain State Lab",
  "kicker": "Statistics & probability interactive lab",
  "description": "Build statistical intuition by changing assumptions, sampling regimes, and uncertainty controls in real time.",
  "mode": "matrix",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "#2563eb",
    "secondary": "#f59e0b",
    "background": "#eff6ff",
    "panel": "#ffffff",
    "ink": "#13233c",
    "muted": "#697b94",
    "line": "#d5e1f3",
    "soft": "#dbeafe"
  },
  "controlTitle": "Markov Chain State Lab controls",
  "controls": [
    {
      "label": "Self-transition",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune self-transition and observe how the experiment responds."
    },
    {
      "label": "Mixing rate",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing mixing rate."
    },
    {
      "label": "Simulation horizon",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use simulation horizon to expose boundary behavior."
    }
  ],
  "visualTitle": "Markov Chain State Lab live view",
  "metrics": [
    {
      "label": "Steady mass",
      "detail": "primary behavior"
    },
    {
      "label": "Mixing score",
      "detail": "robustness check"
    },
    {
      "label": "Transitions",
      "detail": "resource demand"
    },
    {
      "label": "Chain trust",
      "detail": "decision quality"
    }
  ],
  "formula": "πₜ₊₁ = πₜP",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Transitions encode assumptions",
      "body": "Principle 1: apply this idea when reviewing markov chain state lab results."
    },
    {
      "title": "Check stationarity",
      "body": "Principle 2: apply this idea when reviewing markov chain state lab results."
    },
    {
      "title": "State design determines Markovness",
      "body": "Principle 3: apply this idea when reviewing markov chain state lab results."
    }
  ]
};

const CASES = [
  {
    id: "markov-chain-001",
    title: "customer lifecycle states · case 001",
    scenario: "Investigate customer lifecycle states under small clean sample.",
    failure: "chain mixes too slowly; case 1 makes the trade-off visible.",
    subtitle: "Transitions encode assumptions — experiment 001",
    explanation: "Move the controls to see why chain mixes too slowly and how the measured response changes.",
    lesson: "Transitions encode assumptions. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "markov-chain-002",
    title: "weather regime model · case 002",
    scenario: "Investigate weather regime model under large noisy sample.",
    failure: "state definition loses memory; case 2 makes the trade-off visible.",
    subtitle: "Check stationarity — experiment 002",
    explanation: "Move the controls to see why state definition loses memory and how the measured response changes.",
    lesson: "Check stationarity. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "markov-chain-003",
    title: "machine condition chain · case 003",
    scenario: "Investigate machine condition chain under shifted production slice.",
    failure: "absorbing state traps process; case 3 makes the trade-off visible.",
    subtitle: "State design determines Markovness — experiment 003",
    explanation: "Move the controls to see why absorbing state traps process and how the measured response changes.",
    lesson: "State design determines Markovness. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "markov-chain-004",
    title: "web navigation journey · case 004",
    scenario: "Investigate web navigation journey under rare-event regime.",
    failure: "chain mixes too slowly; case 4 makes the trade-off visible.",
    subtitle: "Transitions encode assumptions — experiment 004",
    explanation: "Move the controls to see why chain mixes too slowly and how the measured response changes.",
    lesson: "Transitions encode assumptions. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "markov-chain-005",
    title: "customer lifecycle states · case 005",
    scenario: "Investigate customer lifecycle states under high-dimensional setting.",
    failure: "state definition loses memory; case 5 makes the trade-off visible.",
    subtitle: "Check stationarity — experiment 005",
    explanation: "Move the controls to see why state definition loses memory and how the measured response changes.",
    lesson: "Check stationarity. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "markov-chain-006",
    title: "weather regime model · case 006",
    scenario: "Investigate weather regime model under small clean sample.",
    failure: "absorbing state traps process; case 6 makes the trade-off visible.",
    subtitle: "State design determines Markovness — experiment 006",
    explanation: "Move the controls to see why absorbing state traps process and how the measured response changes.",
    lesson: "State design determines Markovness. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "markov-chain-007",
    title: "machine condition chain · case 007",
    scenario: "Investigate machine condition chain under large noisy sample.",
    failure: "chain mixes too slowly; case 7 makes the trade-off visible.",
    subtitle: "Transitions encode assumptions — experiment 007",
    explanation: "Move the controls to see why chain mixes too slowly and how the measured response changes.",
    lesson: "Transitions encode assumptions. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "markov-chain-008",
    title: "web navigation journey · case 008",
    scenario: "Investigate web navigation journey under shifted production slice.",
    failure: "state definition loses memory; case 8 makes the trade-off visible.",
    subtitle: "Check stationarity — experiment 008",
    explanation: "Move the controls to see why state definition loses memory and how the measured response changes.",
    lesson: "Check stationarity. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "markov-chain-009",
    title: "customer lifecycle states · case 009",
    scenario: "Investigate customer lifecycle states under rare-event regime.",
    failure: "absorbing state traps process; case 9 makes the trade-off visible.",
    subtitle: "State design determines Markovness — experiment 009",
    explanation: "Move the controls to see why absorbing state traps process and how the measured response changes.",
    lesson: "State design determines Markovness. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "markov-chain-010",
    title: "weather regime model · case 010",
    scenario: "Investigate weather regime model under high-dimensional setting.",
    failure: "chain mixes too slowly; case 10 makes the trade-off visible.",
    subtitle: "Transitions encode assumptions — experiment 010",
    explanation: "Move the controls to see why chain mixes too slowly and how the measured response changes.",
    lesson: "Transitions encode assumptions. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "markov-chain-011",
    title: "machine condition chain · case 011",
    scenario: "Investigate machine condition chain under small clean sample.",
    failure: "state definition loses memory; case 11 makes the trade-off visible.",
    subtitle: "Check stationarity — experiment 011",
    explanation: "Move the controls to see why state definition loses memory and how the measured response changes.",
    lesson: "Check stationarity. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "markov-chain-012",
    title: "web navigation journey · case 012",
    scenario: "Investigate web navigation journey under large noisy sample.",
    failure: "absorbing state traps process; case 12 makes the trade-off visible.",
    subtitle: "State design determines Markovness — experiment 012",
    explanation: "Move the controls to see why absorbing state traps process and how the measured response changes.",
    lesson: "State design determines Markovness. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function MarkovChainLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

