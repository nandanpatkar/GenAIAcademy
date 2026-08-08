import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "LSTM Gate Control Lab",
  "kicker": "Deep learning interactive lab",
  "description": "Inspect neural architectures, optimization at scale, compression, and robustness through live diagnostics.",
  "mode": "tree",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "hsl(222 72% 42%)",
    "secondary": "hsl(350 70% 42%)",
    "background": "hsl(222 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(222 30% 13%)",
    "muted": "hsl(222 14% 43%)",
    "line": "hsl(222 28% 86%)",
    "soft": "hsl(222 55% 92%)"
  },
  "controlTitle": "LSTM Gate Control Lab controls",
  "controls": [
    {
      "label": "Forget gate",
      "min": 0,
      "max": 100,
      "default": 43,
      "unit": "%",
      "help": "Tune forget gate and observe system behavior."
    },
    {
      "label": "Input gate",
      "min": 0,
      "max": 100,
      "default": 61,
      "unit": "",
      "help": "Stress input gate across realistic operating ranges."
    },
    {
      "label": "Cell depth",
      "min": 0,
      "max": 100,
      "default": 26,
      "unit": "",
      "help": "Use cell depth to reveal boundary failures."
    }
  ],
  "visualTitle": "LSTM Gate Control Lab live view",
  "metrics": [
    {
      "label": "LSTM score",
      "detail": "primary behavior"
    },
    {
      "label": "Gate score",
      "detail": "robustness check"
    },
    {
      "label": "Control score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "cₜ=fₜ⊙cₜ₋₁+iₜ⊙gₜ",
  "costScale": 0.65,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Gates route memory",
      "body": "Principle 1: use this when reviewing lstm gate control lab behavior in production."
    },
    {
      "title": "Bias initialization matters",
      "body": "Principle 2: use this when reviewing lstm gate control lab behavior in production."
    },
    {
      "title": "Probe dependency length",
      "body": "Principle 3: use this when reviewing lstm gate control lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "lstm-gates-001",
    title: "long dependency task · case 001",
    scenario: "Investigate long dependency task in a large noisy workload.",
    failure: "forget gate erases context; scenario 1 exposes the operational consequence.",
    subtitle: "Gates route memory — experiment 001",
    explanation: "Adjust the controls to see how forget gate erases context changes system quality, cost, and confidence.",
    lesson: "Gates route memory. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 917,
    sampleSize: 267,
    signal: 89
  },
  {
    id: "lstm-gates-002",
    title: "event interval forecast · case 002",
    scenario: "Investigate event interval forecast in a shifted production slice.",
    failure: "input gate admits noise; scenario 2 exposes the operational consequence.",
    subtitle: "Bias initialization matters — experiment 002",
    explanation: "Adjust the controls to see how input gate admits noise changes system quality, cost, and confidence.",
    lesson: "Bias initialization matters. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 924,
    sampleSize: 284,
    signal: 7
  },
  {
    id: "lstm-gates-003",
    title: "language sequence cell · case 003",
    scenario: "Investigate language sequence cell in a rare failure regime.",
    failure: "cell state grows stale; scenario 3 exposes the operational consequence.",
    subtitle: "Probe dependency length — experiment 003",
    explanation: "Adjust the controls to see how cell state grows stale changes system quality, cost, and confidence.",
    lesson: "Probe dependency length. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 931,
    sampleSize: 301,
    signal: 26
  },
  {
    id: "lstm-gates-004",
    title: "long dependency task · case 004",
    scenario: "Investigate long dependency task in a high-scale environment.",
    failure: "forget gate erases context; scenario 4 exposes the operational consequence.",
    subtitle: "Gates route memory — experiment 004",
    explanation: "Adjust the controls to see how forget gate erases context changes system quality, cost, and confidence.",
    lesson: "Gates route memory. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 938,
    sampleSize: 318,
    signal: 45
  },
  {
    id: "lstm-gates-005",
    title: "event interval forecast · case 005",
    scenario: "Investigate event interval forecast in a small clean workload.",
    failure: "input gate admits noise; scenario 5 exposes the operational consequence.",
    subtitle: "Bias initialization matters — experiment 005",
    explanation: "Adjust the controls to see how input gate admits noise changes system quality, cost, and confidence.",
    lesson: "Bias initialization matters. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 945,
    sampleSize: 335,
    signal: 64
  },
  {
    id: "lstm-gates-006",
    title: "language sequence cell · case 006",
    scenario: "Investigate language sequence cell in a large noisy workload.",
    failure: "cell state grows stale; scenario 6 exposes the operational consequence.",
    subtitle: "Probe dependency length — experiment 006",
    explanation: "Adjust the controls to see how cell state grows stale changes system quality, cost, and confidence.",
    lesson: "Probe dependency length. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 952,
    sampleSize: 352,
    signal: 83
  },
  {
    id: "lstm-gates-007",
    title: "long dependency task · case 007",
    scenario: "Investigate long dependency task in a shifted production slice.",
    failure: "forget gate erases context; scenario 7 exposes the operational consequence.",
    subtitle: "Gates route memory — experiment 007",
    explanation: "Adjust the controls to see how forget gate erases context changes system quality, cost, and confidence.",
    lesson: "Gates route memory. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 959,
    sampleSize: 369,
    signal: 1
  },
  {
    id: "lstm-gates-008",
    title: "event interval forecast · case 008",
    scenario: "Investigate event interval forecast in a rare failure regime.",
    failure: "input gate admits noise; scenario 8 exposes the operational consequence.",
    subtitle: "Bias initialization matters — experiment 008",
    explanation: "Adjust the controls to see how input gate admits noise changes system quality, cost, and confidence.",
    lesson: "Bias initialization matters. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 966,
    sampleSize: 386,
    signal: 20
  },
  {
    id: "lstm-gates-009",
    title: "language sequence cell · case 009",
    scenario: "Investigate language sequence cell in a high-scale environment.",
    failure: "cell state grows stale; scenario 9 exposes the operational consequence.",
    subtitle: "Probe dependency length — experiment 009",
    explanation: "Adjust the controls to see how cell state grows stale changes system quality, cost, and confidence.",
    lesson: "Probe dependency length. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 973,
    sampleSize: 403,
    signal: 39
  },
  {
    id: "lstm-gates-010",
    title: "long dependency task · case 010",
    scenario: "Investigate long dependency task in a small clean workload.",
    failure: "forget gate erases context; scenario 10 exposes the operational consequence.",
    subtitle: "Gates route memory — experiment 010",
    explanation: "Adjust the controls to see how forget gate erases context changes system quality, cost, and confidence.",
    lesson: "Gates route memory. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 980,
    sampleSize: 420,
    signal: 58
  },
  {
    id: "lstm-gates-011",
    title: "event interval forecast · case 011",
    scenario: "Investigate event interval forecast in a large noisy workload.",
    failure: "input gate admits noise; scenario 11 exposes the operational consequence.",
    subtitle: "Bias initialization matters — experiment 011",
    explanation: "Adjust the controls to see how input gate admits noise changes system quality, cost, and confidence.",
    lesson: "Bias initialization matters. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 987,
    sampleSize: 437,
    signal: 77
  },
  {
    id: "lstm-gates-012",
    title: "language sequence cell · case 012",
    scenario: "Investigate language sequence cell in a shifted production slice.",
    failure: "cell state grows stale; scenario 12 exposes the operational consequence.",
    subtitle: "Probe dependency length — experiment 012",
    explanation: "Adjust the controls to see how cell state grows stale changes system quality, cost, and confidence.",
    lesson: "Probe dependency length. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 994,
    sampleSize: 454,
    signal: 96
  }
];

export default function LstmGateControlLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

