import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "CNN Receptive Field Lab",
  "kicker": "Deep learning interactive lab",
  "description": "Inspect neural architectures, optimization at scale, compression, and robustness through live diagnostics.",
  "mode": "grid",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "hsl(128 88% 66%)",
    "secondary": "hsl(256 78% 62%)",
    "background": "hsl(128 24% 7%)",
    "panel": "hsl(128 22% 12%)",
    "ink": "hsl(128 35% 94%)",
    "muted": "hsl(128 16% 68%)",
    "line": "hsl(128 20% 25%)",
    "soft": "hsl(128 25% 18%)"
  },
  "controlTitle": "CNN Receptive Field Lab controls",
  "controls": [
    {
      "label": "Kernel stack",
      "min": 0,
      "max": 100,
      "default": 41,
      "unit": "%",
      "help": "Tune kernel stack and observe system behavior."
    },
    {
      "label": "Dilation rate",
      "min": 0,
      "max": 100,
      "default": 59,
      "unit": "",
      "help": "Stress dilation rate across realistic operating ranges."
    },
    {
      "label": "Stride depth",
      "min": 0,
      "max": 100,
      "default": 24,
      "unit": "",
      "help": "Use stride depth to reveal boundary failures."
    }
  ],
  "visualTitle": "CNN Receptive Field Lab live view",
  "metrics": [
    {
      "label": "Receptive score",
      "detail": "primary behavior"
    },
    {
      "label": "Field score",
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
  "formula": "Rₗ=Rₗ₋₁+(kₗ−1)Πsᵢ",
  "costScale": 1.15,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Track effective context",
      "body": "Principle 1: use this when reviewing cnn receptive field lab behavior in production."
    },
    {
      "title": "Resolution and context trade",
      "body": "Principle 2: use this when reviewing cnn receptive field lab behavior in production."
    },
    {
      "title": "Visualize layer responses",
      "body": "Principle 3: use this when reviewing cnn receptive field lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "cnn-receptive-field-001",
    title: "fine texture network · case 001",
    scenario: "Investigate fine texture network in a high-scale environment.",
    failure: "field misses global context; scenario 1 exposes the operational consequence.",
    subtitle: "Track effective context — experiment 001",
    explanation: "Adjust the controls to see how field misses global context changes system quality, cost, and confidence.",
    lesson: "Track effective context. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 891,
    sampleSize: 265,
    signal: 87
  },
  {
    id: "cnn-receptive-field-002",
    title: "scene recognition trunk · case 002",
    scenario: "Investigate scene recognition trunk in a small clean workload.",
    failure: "stride destroys alignment; scenario 2 exposes the operational consequence.",
    subtitle: "Resolution and context trade — experiment 002",
    explanation: "Adjust the controls to see how stride destroys alignment changes system quality, cost, and confidence.",
    lesson: "Resolution and context trade. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 898,
    sampleSize: 282,
    signal: 5
  },
  {
    id: "cnn-receptive-field-003",
    title: "audio spectrogram CNN · case 003",
    scenario: "Investigate audio spectrogram CNN in a large noisy workload.",
    failure: "dilation creates blind spots; scenario 3 exposes the operational consequence.",
    subtitle: "Visualize layer responses — experiment 003",
    explanation: "Adjust the controls to see how dilation creates blind spots changes system quality, cost, and confidence.",
    lesson: "Visualize layer responses. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 905,
    sampleSize: 299,
    signal: 24
  },
  {
    id: "cnn-receptive-field-004",
    title: "fine texture network · case 004",
    scenario: "Investigate fine texture network in a shifted production slice.",
    failure: "field misses global context; scenario 4 exposes the operational consequence.",
    subtitle: "Track effective context — experiment 004",
    explanation: "Adjust the controls to see how field misses global context changes system quality, cost, and confidence.",
    lesson: "Track effective context. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 912,
    sampleSize: 316,
    signal: 43
  },
  {
    id: "cnn-receptive-field-005",
    title: "scene recognition trunk · case 005",
    scenario: "Investigate scene recognition trunk in a rare failure regime.",
    failure: "stride destroys alignment; scenario 5 exposes the operational consequence.",
    subtitle: "Resolution and context trade — experiment 005",
    explanation: "Adjust the controls to see how stride destroys alignment changes system quality, cost, and confidence.",
    lesson: "Resolution and context trade. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 919,
    sampleSize: 333,
    signal: 62
  },
  {
    id: "cnn-receptive-field-006",
    title: "audio spectrogram CNN · case 006",
    scenario: "Investigate audio spectrogram CNN in a high-scale environment.",
    failure: "dilation creates blind spots; scenario 6 exposes the operational consequence.",
    subtitle: "Visualize layer responses — experiment 006",
    explanation: "Adjust the controls to see how dilation creates blind spots changes system quality, cost, and confidence.",
    lesson: "Visualize layer responses. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 926,
    sampleSize: 350,
    signal: 81
  },
  {
    id: "cnn-receptive-field-007",
    title: "fine texture network · case 007",
    scenario: "Investigate fine texture network in a small clean workload.",
    failure: "field misses global context; scenario 7 exposes the operational consequence.",
    subtitle: "Track effective context — experiment 007",
    explanation: "Adjust the controls to see how field misses global context changes system quality, cost, and confidence.",
    lesson: "Track effective context. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 933,
    sampleSize: 367,
    signal: 100
  },
  {
    id: "cnn-receptive-field-008",
    title: "scene recognition trunk · case 008",
    scenario: "Investigate scene recognition trunk in a large noisy workload.",
    failure: "stride destroys alignment; scenario 8 exposes the operational consequence.",
    subtitle: "Resolution and context trade — experiment 008",
    explanation: "Adjust the controls to see how stride destroys alignment changes system quality, cost, and confidence.",
    lesson: "Resolution and context trade. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 940,
    sampleSize: 384,
    signal: 18
  },
  {
    id: "cnn-receptive-field-009",
    title: "audio spectrogram CNN · case 009",
    scenario: "Investigate audio spectrogram CNN in a shifted production slice.",
    failure: "dilation creates blind spots; scenario 9 exposes the operational consequence.",
    subtitle: "Visualize layer responses — experiment 009",
    explanation: "Adjust the controls to see how dilation creates blind spots changes system quality, cost, and confidence.",
    lesson: "Visualize layer responses. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 947,
    sampleSize: 401,
    signal: 37
  },
  {
    id: "cnn-receptive-field-010",
    title: "fine texture network · case 010",
    scenario: "Investigate fine texture network in a rare failure regime.",
    failure: "field misses global context; scenario 10 exposes the operational consequence.",
    subtitle: "Track effective context — experiment 010",
    explanation: "Adjust the controls to see how field misses global context changes system quality, cost, and confidence.",
    lesson: "Track effective context. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 954,
    sampleSize: 418,
    signal: 56
  },
  {
    id: "cnn-receptive-field-011",
    title: "scene recognition trunk · case 011",
    scenario: "Investigate scene recognition trunk in a high-scale environment.",
    failure: "stride destroys alignment; scenario 11 exposes the operational consequence.",
    subtitle: "Resolution and context trade — experiment 011",
    explanation: "Adjust the controls to see how stride destroys alignment changes system quality, cost, and confidence.",
    lesson: "Resolution and context trade. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 961,
    sampleSize: 435,
    signal: 75
  },
  {
    id: "cnn-receptive-field-012",
    title: "audio spectrogram CNN · case 012",
    scenario: "Investigate audio spectrogram CNN in a small clean workload.",
    failure: "dilation creates blind spots; scenario 12 exposes the operational consequence.",
    subtitle: "Visualize layer responses — experiment 012",
    explanation: "Adjust the controls to see how dilation creates blind spots changes system quality, cost, and confidence.",
    lesson: "Visualize layer responses. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 968,
    sampleSize: 452,
    signal: 94
  }
];

export default function CnnReceptiveFieldLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

