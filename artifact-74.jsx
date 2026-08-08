import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Neural Quantization Lab",
  "kicker": "Deep learning interactive lab",
  "description": "Inspect neural architectures, optimization at scale, compression, and robustness through live diagnostics.",
  "mode": "image",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "hsl(50 88% 66%)",
    "secondary": "hsl(178 78% 62%)",
    "background": "hsl(50 24% 7%)",
    "panel": "hsl(50 22% 12%)",
    "ink": "hsl(50 35% 94%)",
    "muted": "hsl(50 16% 68%)",
    "line": "hsl(50 20% 25%)",
    "soft": "hsl(50 25% 18%)"
  },
  "controlTitle": "Neural Quantization Lab controls",
  "controls": [
    {
      "label": "Bit width",
      "min": 0,
      "max": 100,
      "default": 47,
      "unit": "%",
      "help": "Tune bit width and observe system behavior."
    },
    {
      "label": "Calibration samples",
      "min": 0,
      "max": 100,
      "default": 65,
      "unit": "",
      "help": "Stress calibration samples across realistic operating ranges."
    },
    {
      "label": "Outlier clipping",
      "min": 0,
      "max": 100,
      "default": 30,
      "unit": "",
      "help": "Use outlier clipping to reveal boundary failures."
    }
  ],
  "visualTitle": "Neural Quantization Lab live view",
  "metrics": [
    {
      "label": "Neural score",
      "detail": "primary behavior"
    },
    {
      "label": "Quantization score",
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
  "formula": "q=round(x/scale)+zero",
  "costScale": 1.05,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Measure hardware latency",
      "body": "Principle 1: use this when reviewing neural quantization lab behavior in production."
    },
    {
      "title": "Calibrate representative data",
      "body": "Principle 2: use this when reviewing neural quantization lab behavior in production."
    },
    {
      "title": "Accuracy by slice",
      "body": "Principle 3: use this when reviewing neural quantization lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "quantization-tradeoff-001",
    title: "mobile image model · case 001",
    scenario: "Investigate mobile image model in a small clean workload.",
    failure: "activation outlier ruins scale; scenario 1 exposes the operational consequence.",
    subtitle: "Measure hardware latency — experiment 001",
    explanation: "Adjust the controls to see how activation outlier ruins scale changes system quality, cost, and confidence.",
    lesson: "Measure hardware latency. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 969,
    sampleSize: 271,
    signal: 93
  },
  {
    id: "quantization-tradeoff-002",
    title: "CPU language encoder · case 002",
    scenario: "Investigate CPU language encoder in a large noisy workload.",
    failure: "calibration misses inputs; scenario 2 exposes the operational consequence.",
    subtitle: "Calibrate representative data — experiment 002",
    explanation: "Adjust the controls to see how calibration misses inputs changes system quality, cost, and confidence.",
    lesson: "Calibrate representative data. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 976,
    sampleSize: 288,
    signal: 11
  },
  {
    id: "quantization-tradeoff-003",
    title: "edge anomaly detector · case 003",
    scenario: "Investigate edge anomaly detector in a shifted production slice.",
    failure: "speedup lacks kernel support; scenario 3 exposes the operational consequence.",
    subtitle: "Accuracy by slice — experiment 003",
    explanation: "Adjust the controls to see how speedup lacks kernel support changes system quality, cost, and confidence.",
    lesson: "Accuracy by slice. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 983,
    sampleSize: 305,
    signal: 30
  },
  {
    id: "quantization-tradeoff-004",
    title: "mobile image model · case 004",
    scenario: "Investigate mobile image model in a rare failure regime.",
    failure: "activation outlier ruins scale; scenario 4 exposes the operational consequence.",
    subtitle: "Measure hardware latency — experiment 004",
    explanation: "Adjust the controls to see how activation outlier ruins scale changes system quality, cost, and confidence.",
    lesson: "Measure hardware latency. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 990,
    sampleSize: 322,
    signal: 49
  },
  {
    id: "quantization-tradeoff-005",
    title: "CPU language encoder · case 005",
    scenario: "Investigate CPU language encoder in a high-scale environment.",
    failure: "calibration misses inputs; scenario 5 exposes the operational consequence.",
    subtitle: "Calibrate representative data — experiment 005",
    explanation: "Adjust the controls to see how calibration misses inputs changes system quality, cost, and confidence.",
    lesson: "Calibrate representative data. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 997,
    sampleSize: 339,
    signal: 68
  },
  {
    id: "quantization-tradeoff-006",
    title: "edge anomaly detector · case 006",
    scenario: "Investigate edge anomaly detector in a small clean workload.",
    failure: "speedup lacks kernel support; scenario 6 exposes the operational consequence.",
    subtitle: "Accuracy by slice — experiment 006",
    explanation: "Adjust the controls to see how speedup lacks kernel support changes system quality, cost, and confidence.",
    lesson: "Accuracy by slice. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1004,
    sampleSize: 356,
    signal: 87
  },
  {
    id: "quantization-tradeoff-007",
    title: "mobile image model · case 007",
    scenario: "Investigate mobile image model in a large noisy workload.",
    failure: "activation outlier ruins scale; scenario 7 exposes the operational consequence.",
    subtitle: "Measure hardware latency — experiment 007",
    explanation: "Adjust the controls to see how activation outlier ruins scale changes system quality, cost, and confidence.",
    lesson: "Measure hardware latency. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1011,
    sampleSize: 373,
    signal: 5
  },
  {
    id: "quantization-tradeoff-008",
    title: "CPU language encoder · case 008",
    scenario: "Investigate CPU language encoder in a shifted production slice.",
    failure: "calibration misses inputs; scenario 8 exposes the operational consequence.",
    subtitle: "Calibrate representative data — experiment 008",
    explanation: "Adjust the controls to see how calibration misses inputs changes system quality, cost, and confidence.",
    lesson: "Calibrate representative data. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1018,
    sampleSize: 390,
    signal: 24
  },
  {
    id: "quantization-tradeoff-009",
    title: "edge anomaly detector · case 009",
    scenario: "Investigate edge anomaly detector in a rare failure regime.",
    failure: "speedup lacks kernel support; scenario 9 exposes the operational consequence.",
    subtitle: "Accuracy by slice — experiment 009",
    explanation: "Adjust the controls to see how speedup lacks kernel support changes system quality, cost, and confidence.",
    lesson: "Accuracy by slice. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1025,
    sampleSize: 407,
    signal: 43
  },
  {
    id: "quantization-tradeoff-010",
    title: "mobile image model · case 010",
    scenario: "Investigate mobile image model in a high-scale environment.",
    failure: "activation outlier ruins scale; scenario 10 exposes the operational consequence.",
    subtitle: "Measure hardware latency — experiment 010",
    explanation: "Adjust the controls to see how activation outlier ruins scale changes system quality, cost, and confidence.",
    lesson: "Measure hardware latency. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1032,
    sampleSize: 424,
    signal: 62
  },
  {
    id: "quantization-tradeoff-011",
    title: "CPU language encoder · case 011",
    scenario: "Investigate CPU language encoder in a small clean workload.",
    failure: "calibration misses inputs; scenario 11 exposes the operational consequence.",
    subtitle: "Calibrate representative data — experiment 011",
    explanation: "Adjust the controls to see how calibration misses inputs changes system quality, cost, and confidence.",
    lesson: "Calibrate representative data. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1039,
    sampleSize: 441,
    signal: 81
  },
  {
    id: "quantization-tradeoff-012",
    title: "edge anomaly detector · case 012",
    scenario: "Investigate edge anomaly detector in a large noisy workload.",
    failure: "speedup lacks kernel support; scenario 12 exposes the operational consequence.",
    subtitle: "Accuracy by slice — experiment 012",
    explanation: "Adjust the controls to see how speedup lacks kernel support changes system quality, cost, and confidence.",
    lesson: "Accuracy by slice. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1046,
    sampleSize: 458,
    signal: 100
  }
];

export default function NeuralQuantizationLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

