import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Dropout & Uncertainty Lab",
  "kicker": "Deep learning interactive lab",
  "description": "Inspect neural architectures, optimization at scale, compression, and robustness through live diagnostics.",
  "mode": "matrix",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "hsl(316 72% 42%)",
    "secondary": "hsl(84 70% 42%)",
    "background": "hsl(316 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(316 30% 13%)",
    "muted": "hsl(316 14% 43%)",
    "line": "hsl(316 28% 86%)",
    "soft": "hsl(316 55% 92%)"
  },
  "controlTitle": "Dropout & Uncertainty Lab controls",
  "controls": [
    {
      "label": "Drop probability",
      "min": 0,
      "max": 100,
      "default": 45,
      "unit": "%",
      "help": "Tune drop probability and observe system behavior."
    },
    {
      "label": "Network width",
      "min": 0,
      "max": 100,
      "default": 63,
      "unit": "",
      "help": "Stress network width across realistic operating ranges."
    },
    {
      "label": "MC passes",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use mc passes to reveal boundary failures."
    }
  ],
  "visualTitle": "Dropout & Uncertainty Lab live view",
  "metrics": [
    {
      "label": "Dropout score",
      "detail": "primary behavior"
    },
    {
      "label": "Uncertainty score",
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
  "formula": "h′=m⊙h/(1−p)",
  "costScale": 0.8500000000000001,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Dropout regularizes paths",
      "body": "Principle 1: use this when reviewing dropout & uncertainty lab behavior in production."
    },
    {
      "title": "Uncertainty needs calibration",
      "body": "Principle 2: use this when reviewing dropout & uncertainty lab behavior in production."
    },
    {
      "title": "Capacity and rate interact",
      "body": "Principle 3: use this when reviewing dropout & uncertainty lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "dropout-uncertainty-001",
    title: "overfit dense network · case 001",
    scenario: "Investigate overfit dense network in a rare failure regime.",
    failure: "high dropout erases capacity; scenario 1 exposes the operational consequence.",
    subtitle: "Dropout regularizes paths — experiment 001",
    explanation: "Adjust the controls to see how high dropout erases capacity changes system quality, cost, and confidence.",
    lesson: "Dropout regularizes paths. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 943,
    sampleSize: 269,
    signal: 91
  },
  {
    id: "dropout-uncertainty-002",
    title: "uncertainty estimation run · case 002",
    scenario: "Investigate uncertainty estimation run in a high-scale environment.",
    failure: "train inference scaling differs; scenario 2 exposes the operational consequence.",
    subtitle: "Uncertainty needs calibration — experiment 002",
    explanation: "Adjust the controls to see how train inference scaling differs changes system quality, cost, and confidence.",
    lesson: "Uncertainty needs calibration. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 950,
    sampleSize: 286,
    signal: 9
  },
  {
    id: "dropout-uncertainty-003",
    title: "small-data classifier · case 003",
    scenario: "Investigate small-data classifier in a small clean workload.",
    failure: "MC spread is miscalibrated; scenario 3 exposes the operational consequence.",
    subtitle: "Capacity and rate interact — experiment 003",
    explanation: "Adjust the controls to see how MC spread is miscalibrated changes system quality, cost, and confidence.",
    lesson: "Capacity and rate interact. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 957,
    sampleSize: 303,
    signal: 28
  },
  {
    id: "dropout-uncertainty-004",
    title: "overfit dense network · case 004",
    scenario: "Investigate overfit dense network in a large noisy workload.",
    failure: "high dropout erases capacity; scenario 4 exposes the operational consequence.",
    subtitle: "Dropout regularizes paths — experiment 004",
    explanation: "Adjust the controls to see how high dropout erases capacity changes system quality, cost, and confidence.",
    lesson: "Dropout regularizes paths. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 964,
    sampleSize: 320,
    signal: 47
  },
  {
    id: "dropout-uncertainty-005",
    title: "uncertainty estimation run · case 005",
    scenario: "Investigate uncertainty estimation run in a shifted production slice.",
    failure: "train inference scaling differs; scenario 5 exposes the operational consequence.",
    subtitle: "Uncertainty needs calibration — experiment 005",
    explanation: "Adjust the controls to see how train inference scaling differs changes system quality, cost, and confidence.",
    lesson: "Uncertainty needs calibration. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 971,
    sampleSize: 337,
    signal: 66
  },
  {
    id: "dropout-uncertainty-006",
    title: "small-data classifier · case 006",
    scenario: "Investigate small-data classifier in a rare failure regime.",
    failure: "MC spread is miscalibrated; scenario 6 exposes the operational consequence.",
    subtitle: "Capacity and rate interact — experiment 006",
    explanation: "Adjust the controls to see how MC spread is miscalibrated changes system quality, cost, and confidence.",
    lesson: "Capacity and rate interact. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 978,
    sampleSize: 354,
    signal: 85
  },
  {
    id: "dropout-uncertainty-007",
    title: "overfit dense network · case 007",
    scenario: "Investigate overfit dense network in a high-scale environment.",
    failure: "high dropout erases capacity; scenario 7 exposes the operational consequence.",
    subtitle: "Dropout regularizes paths — experiment 007",
    explanation: "Adjust the controls to see how high dropout erases capacity changes system quality, cost, and confidence.",
    lesson: "Dropout regularizes paths. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 985,
    sampleSize: 371,
    signal: 3
  },
  {
    id: "dropout-uncertainty-008",
    title: "uncertainty estimation run · case 008",
    scenario: "Investigate uncertainty estimation run in a small clean workload.",
    failure: "train inference scaling differs; scenario 8 exposes the operational consequence.",
    subtitle: "Uncertainty needs calibration — experiment 008",
    explanation: "Adjust the controls to see how train inference scaling differs changes system quality, cost, and confidence.",
    lesson: "Uncertainty needs calibration. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 992,
    sampleSize: 388,
    signal: 22
  },
  {
    id: "dropout-uncertainty-009",
    title: "small-data classifier · case 009",
    scenario: "Investigate small-data classifier in a large noisy workload.",
    failure: "MC spread is miscalibrated; scenario 9 exposes the operational consequence.",
    subtitle: "Capacity and rate interact — experiment 009",
    explanation: "Adjust the controls to see how MC spread is miscalibrated changes system quality, cost, and confidence.",
    lesson: "Capacity and rate interact. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 999,
    sampleSize: 405,
    signal: 41
  },
  {
    id: "dropout-uncertainty-010",
    title: "overfit dense network · case 010",
    scenario: "Investigate overfit dense network in a shifted production slice.",
    failure: "high dropout erases capacity; scenario 10 exposes the operational consequence.",
    subtitle: "Dropout regularizes paths — experiment 010",
    explanation: "Adjust the controls to see how high dropout erases capacity changes system quality, cost, and confidence.",
    lesson: "Dropout regularizes paths. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1006,
    sampleSize: 422,
    signal: 60
  },
  {
    id: "dropout-uncertainty-011",
    title: "uncertainty estimation run · case 011",
    scenario: "Investigate uncertainty estimation run in a rare failure regime.",
    failure: "train inference scaling differs; scenario 11 exposes the operational consequence.",
    subtitle: "Uncertainty needs calibration — experiment 011",
    explanation: "Adjust the controls to see how train inference scaling differs changes system quality, cost, and confidence.",
    lesson: "Uncertainty needs calibration. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1013,
    sampleSize: 439,
    signal: 79
  },
  {
    id: "dropout-uncertainty-012",
    title: "small-data classifier · case 012",
    scenario: "Investigate small-data classifier in a high-scale environment.",
    failure: "MC spread is miscalibrated; scenario 12 exposes the operational consequence.",
    subtitle: "Capacity and rate interact — experiment 012",
    explanation: "Adjust the controls to see how MC spread is miscalibrated changes system quality, cost, and confidence.",
    lesson: "Capacity and rate interact. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1020,
    sampleSize: 456,
    signal: 98
  }
];

export default function DropoutUncertaintyLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

