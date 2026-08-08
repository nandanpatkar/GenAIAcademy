import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Diffusion Denoising Lab",
  "kicker": "Generative AI interactive lab",
  "description": "Control generation, adaptation, multimodal behavior, evaluation, and safety with measurable trade-offs.",
  "mode": "grid",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "hsl(254 88% 66%)",
    "secondary": "hsl(22 78% 62%)",
    "background": "hsl(254 24% 7%)",
    "panel": "hsl(254 22% 12%)",
    "ink": "hsl(254 35% 94%)",
    "muted": "hsl(254 16% 68%)",
    "line": "hsl(254 20% 25%)",
    "soft": "hsl(254 25% 18%)"
  },
  "controlTitle": "Diffusion Denoising Lab controls",
  "controls": [
    {
      "label": "Noise steps",
      "min": 0,
      "max": 100,
      "default": 46,
      "unit": "%",
      "help": "Tune noise steps and observe system behavior."
    },
    {
      "label": "Guidance scale",
      "min": 0,
      "max": 100,
      "default": 66,
      "unit": "",
      "help": "Stress guidance scale across realistic operating ranges."
    },
    {
      "label": "Denoise strength",
      "min": 0,
      "max": 100,
      "default": 25,
      "unit": "",
      "help": "Use denoise strength to reveal boundary failures."
    }
  ],
  "visualTitle": "Diffusion Denoising Lab live view",
  "metrics": [
    {
      "label": "Diffusion score",
      "detail": "primary behavior"
    },
    {
      "label": "Denoising score",
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
  "formula": "xₜ₋₁=denoiseθ(xₜ,t,c)",
  "costScale": 0.8500000000000001,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Sampling is iterative",
      "body": "Principle 1: use this when reviewing diffusion denoising lab behavior in production."
    },
    {
      "title": "Guidance trades diversity",
      "body": "Principle 2: use this when reviewing diffusion denoising lab behavior in production."
    },
    {
      "title": "Inspect intermediate noise",
      "body": "Principle 3: use this when reviewing diffusion denoising lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "diffusion-denoising-001",
    title: "text-guided image sample · case 001",
    scenario: "Investigate text-guided image sample in a shifted production slice.",
    failure: "guidance oversaturates image; scenario 1 exposes the operational consequence.",
    subtitle: "Sampling is iterative — experiment 001",
    explanation: "Adjust the controls to see how guidance oversaturates image changes system quality, cost, and confidence.",
    lesson: "Sampling is iterative. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1125,
    sampleSize: 283,
    signal: 4
  },
  {
    id: "diffusion-denoising-002",
    title: "image restoration pass · case 002",
    scenario: "Investigate image restoration pass in a rare failure regime.",
    failure: "few steps lose detail; scenario 2 exposes the operational consequence.",
    subtitle: "Guidance trades diversity — experiment 002",
    explanation: "Adjust the controls to see how few steps lose detail changes system quality, cost, and confidence.",
    lesson: "Guidance trades diversity. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1132,
    sampleSize: 300,
    signal: 23
  },
  {
    id: "diffusion-denoising-003",
    title: "style-conditioned generation · case 003",
    scenario: "Investigate style-conditioned generation in a high-scale environment.",
    failure: "conditioning collapses diversity; scenario 3 exposes the operational consequence.",
    subtitle: "Inspect intermediate noise — experiment 003",
    explanation: "Adjust the controls to see how conditioning collapses diversity changes system quality, cost, and confidence.",
    lesson: "Inspect intermediate noise. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1139,
    sampleSize: 317,
    signal: 42
  },
  {
    id: "diffusion-denoising-004",
    title: "text-guided image sample · case 004",
    scenario: "Investigate text-guided image sample in a small clean workload.",
    failure: "guidance oversaturates image; scenario 4 exposes the operational consequence.",
    subtitle: "Sampling is iterative — experiment 004",
    explanation: "Adjust the controls to see how guidance oversaturates image changes system quality, cost, and confidence.",
    lesson: "Sampling is iterative. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1146,
    sampleSize: 334,
    signal: 61
  },
  {
    id: "diffusion-denoising-005",
    title: "image restoration pass · case 005",
    scenario: "Investigate image restoration pass in a large noisy workload.",
    failure: "few steps lose detail; scenario 5 exposes the operational consequence.",
    subtitle: "Guidance trades diversity — experiment 005",
    explanation: "Adjust the controls to see how few steps lose detail changes system quality, cost, and confidence.",
    lesson: "Guidance trades diversity. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1153,
    sampleSize: 351,
    signal: 80
  },
  {
    id: "diffusion-denoising-006",
    title: "style-conditioned generation · case 006",
    scenario: "Investigate style-conditioned generation in a shifted production slice.",
    failure: "conditioning collapses diversity; scenario 6 exposes the operational consequence.",
    subtitle: "Inspect intermediate noise — experiment 006",
    explanation: "Adjust the controls to see how conditioning collapses diversity changes system quality, cost, and confidence.",
    lesson: "Inspect intermediate noise. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1160,
    sampleSize: 368,
    signal: 99
  },
  {
    id: "diffusion-denoising-007",
    title: "text-guided image sample · case 007",
    scenario: "Investigate text-guided image sample in a rare failure regime.",
    failure: "guidance oversaturates image; scenario 7 exposes the operational consequence.",
    subtitle: "Sampling is iterative — experiment 007",
    explanation: "Adjust the controls to see how guidance oversaturates image changes system quality, cost, and confidence.",
    lesson: "Sampling is iterative. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1167,
    sampleSize: 385,
    signal: 17
  },
  {
    id: "diffusion-denoising-008",
    title: "image restoration pass · case 008",
    scenario: "Investigate image restoration pass in a high-scale environment.",
    failure: "few steps lose detail; scenario 8 exposes the operational consequence.",
    subtitle: "Guidance trades diversity — experiment 008",
    explanation: "Adjust the controls to see how few steps lose detail changes system quality, cost, and confidence.",
    lesson: "Guidance trades diversity. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1174,
    sampleSize: 402,
    signal: 36
  },
  {
    id: "diffusion-denoising-009",
    title: "style-conditioned generation · case 009",
    scenario: "Investigate style-conditioned generation in a small clean workload.",
    failure: "conditioning collapses diversity; scenario 9 exposes the operational consequence.",
    subtitle: "Inspect intermediate noise — experiment 009",
    explanation: "Adjust the controls to see how conditioning collapses diversity changes system quality, cost, and confidence.",
    lesson: "Inspect intermediate noise. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1181,
    sampleSize: 419,
    signal: 55
  },
  {
    id: "diffusion-denoising-010",
    title: "text-guided image sample · case 010",
    scenario: "Investigate text-guided image sample in a large noisy workload.",
    failure: "guidance oversaturates image; scenario 10 exposes the operational consequence.",
    subtitle: "Sampling is iterative — experiment 010",
    explanation: "Adjust the controls to see how guidance oversaturates image changes system quality, cost, and confidence.",
    lesson: "Sampling is iterative. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1188,
    sampleSize: 436,
    signal: 74
  },
  {
    id: "diffusion-denoising-011",
    title: "image restoration pass · case 011",
    scenario: "Investigate image restoration pass in a shifted production slice.",
    failure: "few steps lose detail; scenario 11 exposes the operational consequence.",
    subtitle: "Guidance trades diversity — experiment 011",
    explanation: "Adjust the controls to see how few steps lose detail changes system quality, cost, and confidence.",
    lesson: "Guidance trades diversity. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1195,
    sampleSize: 453,
    signal: 93
  },
  {
    id: "diffusion-denoising-012",
    title: "style-conditioned generation · case 012",
    scenario: "Investigate style-conditioned generation in a rare failure regime.",
    failure: "conditioning collapses diversity; scenario 12 exposes the operational consequence.",
    subtitle: "Inspect intermediate noise — experiment 012",
    explanation: "Adjust the controls to see how conditioning collapses diversity changes system quality, cost, and confidence.",
    lesson: "Inspect intermediate noise. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1202,
    sampleSize: 470,
    signal: 11
  }
];

export default function DiffusionDenoisingLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

