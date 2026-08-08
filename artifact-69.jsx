import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "RNN Sequence Memory Lab",
  "kicker": "Deep learning interactive lab",
  "description": "Inspect neural architectures, optimization at scale, compression, and robustness through live diagnostics.",
  "mode": "timeline",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "hsl(175 72% 42%)",
    "secondary": "hsl(303 70% 42%)",
    "background": "hsl(175 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(175 30% 13%)",
    "muted": "hsl(175 14% 43%)",
    "line": "hsl(175 28% 86%)",
    "soft": "hsl(175 55% 92%)"
  },
  "controlTitle": "RNN Sequence Memory Lab controls",
  "controls": [
    {
      "label": "Sequence length",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune sequence length and observe system behavior."
    },
    {
      "label": "Hidden width",
      "min": 0,
      "max": 100,
      "default": 60,
      "unit": "",
      "help": "Stress hidden width across realistic operating ranges."
    },
    {
      "label": "Memory decay",
      "min": 0,
      "max": 100,
      "default": 25,
      "unit": "",
      "help": "Use memory decay to reveal boundary failures."
    }
  ],
  "visualTitle": "RNN Sequence Memory Lab live view",
  "metrics": [
    {
      "label": "Sequence score",
      "detail": "primary behavior"
    },
    {
      "label": "Memory score",
      "detail": "robustness check"
    },
    {
      "label": "Work units",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "hₜ=φ(Wₓxₜ+Wₕhₜ₋₁)",
  "costScale": 1.25,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "State compresses history",
      "body": "Principle 1: use this when reviewing rnn sequence memory lab behavior in production."
    },
    {
      "title": "Length changes difficulty",
      "body": "Principle 2: use this when reviewing rnn sequence memory lab behavior in production."
    },
    {
      "title": "Inspect temporal gradients",
      "body": "Principle 3: use this when reviewing rnn sequence memory lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "rnn-sequence-001",
    title: "character sequence model · case 001",
    scenario: "Investigate character sequence model in a small clean workload.",
    failure: "early tokens vanish; scenario 1 exposes the operational consequence.",
    subtitle: "State compresses history — experiment 001",
    explanation: "Adjust the controls to see how early tokens vanish changes system quality, cost, and confidence.",
    lesson: "State compresses history. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 904,
    sampleSize: 266,
    signal: 88
  },
  {
    id: "rnn-sequence-002",
    title: "sensor event predictor · case 002",
    scenario: "Investigate sensor event predictor in a large noisy workload.",
    failure: "hidden state saturates; scenario 2 exposes the operational consequence.",
    subtitle: "Length changes difficulty — experiment 002",
    explanation: "Adjust the controls to see how hidden state saturates changes system quality, cost, and confidence.",
    lesson: "Length changes difficulty. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 911,
    sampleSize: 283,
    signal: 6
  },
  {
    id: "rnn-sequence-003",
    title: "clickstream encoder · case 003",
    scenario: "Investigate clickstream encoder in a shifted production slice.",
    failure: "long sequence destabilizes; scenario 3 exposes the operational consequence.",
    subtitle: "Inspect temporal gradients — experiment 003",
    explanation: "Adjust the controls to see how long sequence destabilizes changes system quality, cost, and confidence.",
    lesson: "Inspect temporal gradients. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 918,
    sampleSize: 300,
    signal: 25
  },
  {
    id: "rnn-sequence-004",
    title: "character sequence model · case 004",
    scenario: "Investigate character sequence model in a rare failure regime.",
    failure: "early tokens vanish; scenario 4 exposes the operational consequence.",
    subtitle: "State compresses history — experiment 004",
    explanation: "Adjust the controls to see how early tokens vanish changes system quality, cost, and confidence.",
    lesson: "State compresses history. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 925,
    sampleSize: 317,
    signal: 44
  },
  {
    id: "rnn-sequence-005",
    title: "sensor event predictor · case 005",
    scenario: "Investigate sensor event predictor in a high-scale environment.",
    failure: "hidden state saturates; scenario 5 exposes the operational consequence.",
    subtitle: "Length changes difficulty — experiment 005",
    explanation: "Adjust the controls to see how hidden state saturates changes system quality, cost, and confidence.",
    lesson: "Length changes difficulty. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 932,
    sampleSize: 334,
    signal: 63
  },
  {
    id: "rnn-sequence-006",
    title: "clickstream encoder · case 006",
    scenario: "Investigate clickstream encoder in a small clean workload.",
    failure: "long sequence destabilizes; scenario 6 exposes the operational consequence.",
    subtitle: "Inspect temporal gradients — experiment 006",
    explanation: "Adjust the controls to see how long sequence destabilizes changes system quality, cost, and confidence.",
    lesson: "Inspect temporal gradients. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 939,
    sampleSize: 351,
    signal: 82
  },
  {
    id: "rnn-sequence-007",
    title: "character sequence model · case 007",
    scenario: "Investigate character sequence model in a large noisy workload.",
    failure: "early tokens vanish; scenario 7 exposes the operational consequence.",
    subtitle: "State compresses history — experiment 007",
    explanation: "Adjust the controls to see how early tokens vanish changes system quality, cost, and confidence.",
    lesson: "State compresses history. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 946,
    sampleSize: 368,
    signal: 0
  },
  {
    id: "rnn-sequence-008",
    title: "sensor event predictor · case 008",
    scenario: "Investigate sensor event predictor in a shifted production slice.",
    failure: "hidden state saturates; scenario 8 exposes the operational consequence.",
    subtitle: "Length changes difficulty — experiment 008",
    explanation: "Adjust the controls to see how hidden state saturates changes system quality, cost, and confidence.",
    lesson: "Length changes difficulty. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 953,
    sampleSize: 385,
    signal: 19
  },
  {
    id: "rnn-sequence-009",
    title: "clickstream encoder · case 009",
    scenario: "Investigate clickstream encoder in a rare failure regime.",
    failure: "long sequence destabilizes; scenario 9 exposes the operational consequence.",
    subtitle: "Inspect temporal gradients — experiment 009",
    explanation: "Adjust the controls to see how long sequence destabilizes changes system quality, cost, and confidence.",
    lesson: "Inspect temporal gradients. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 960,
    sampleSize: 402,
    signal: 38
  },
  {
    id: "rnn-sequence-010",
    title: "character sequence model · case 010",
    scenario: "Investigate character sequence model in a high-scale environment.",
    failure: "early tokens vanish; scenario 10 exposes the operational consequence.",
    subtitle: "State compresses history — experiment 010",
    explanation: "Adjust the controls to see how early tokens vanish changes system quality, cost, and confidence.",
    lesson: "State compresses history. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 967,
    sampleSize: 419,
    signal: 57
  },
  {
    id: "rnn-sequence-011",
    title: "sensor event predictor · case 011",
    scenario: "Investigate sensor event predictor in a small clean workload.",
    failure: "hidden state saturates; scenario 11 exposes the operational consequence.",
    subtitle: "Length changes difficulty — experiment 011",
    explanation: "Adjust the controls to see how hidden state saturates changes system quality, cost, and confidence.",
    lesson: "Length changes difficulty. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 974,
    sampleSize: 436,
    signal: 76
  },
  {
    id: "rnn-sequence-012",
    title: "clickstream encoder · case 012",
    scenario: "Investigate clickstream encoder in a large noisy workload.",
    failure: "long sequence destabilizes; scenario 12 exposes the operational consequence.",
    subtitle: "Inspect temporal gradients — experiment 012",
    explanation: "Adjust the controls to see how long sequence destabilizes changes system quality, cost, and confidence.",
    lesson: "Inspect temporal gradients. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 981,
    sampleSize: 453,
    signal: 95
  }
];

export default function RnnSequenceMemoryLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

