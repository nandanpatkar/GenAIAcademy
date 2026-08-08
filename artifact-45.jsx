import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Convolution Lens",
  "kicker": "Computer vision interactive lab",
  "description": "Explore how visual representations, thresholds, and spatial choices change model behavior at pixel and object level.",
  "mode": "image",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "#0284c7",
    "secondary": "#f59e0b",
    "background": "#f0f9ff",
    "panel": "#ffffff",
    "ink": "#102938",
    "muted": "#627b89",
    "line": "#d1e4ee",
    "soft": "#e0f2fe"
  },
  "controlTitle": "Convolution Lens controls",
  "controls": [
    {
      "label": "Kernel width",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune kernel width and observe how the experiment responds."
    },
    {
      "label": "Stride",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing stride."
    },
    {
      "label": "Edge strength",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use edge strength to expose boundary behavior."
    }
  ],
  "visualTitle": "Convolution Lens live view",
  "metrics": [
    {
      "label": "Feature response",
      "detail": "primary behavior"
    },
    {
      "label": "Spatial detail",
      "detail": "robustness check"
    },
    {
      "label": "Pixel ops",
      "detail": "resource demand"
    },
    {
      "label": "Filter trust",
      "detail": "decision quality"
    }
  ],
  "formula": "Y[i,j] = ΣₘΣₙ X[i+m,j+n]K[m,n]",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Kernels encode local patterns",
      "body": "Principle 1: apply this idea when reviewing convolution lens results."
    },
    {
      "title": "Stride trades detail for speed",
      "body": "Principle 2: apply this idea when reviewing convolution lens results."
    },
    {
      "title": "Inspect feature maps",
      "body": "Principle 3: apply this idea when reviewing convolution lens results."
    }
  ]
};

const CASES = [
  {
    id: "convolution-lens-001",
    title: "street edge detector · case 001",
    scenario: "Investigate street edge detector under small clean sample.",
    failure: "large stride skips detail; case 1 makes the trade-off visible.",
    subtitle: "Kernels encode local patterns — experiment 001",
    explanation: "Move the controls to see why large stride skips detail and how the measured response changes.",
    lesson: "Kernels encode local patterns. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "convolution-lens-002",
    title: "medical texture map · case 002",
    scenario: "Investigate medical texture map under large noisy sample.",
    failure: "kernel blurs thin edges; case 2 makes the trade-off visible.",
    subtitle: "Stride trades detail for speed — experiment 002",
    explanation: "Move the controls to see why kernel blurs thin edges and how the measured response changes.",
    lesson: "Stride trades detail for speed. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "convolution-lens-003",
    title: "satellite boundary scan · case 003",
    scenario: "Investigate satellite boundary scan under shifted production slice.",
    failure: "padding shifts boundaries; case 3 makes the trade-off visible.",
    subtitle: "Inspect feature maps — experiment 003",
    explanation: "Move the controls to see why padding shifts boundaries and how the measured response changes.",
    lesson: "Inspect feature maps. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "convolution-lens-004",
    title: "document line finder · case 004",
    scenario: "Investigate document line finder under rare-event regime.",
    failure: "large stride skips detail; case 4 makes the trade-off visible.",
    subtitle: "Kernels encode local patterns — experiment 004",
    explanation: "Move the controls to see why large stride skips detail and how the measured response changes.",
    lesson: "Kernels encode local patterns. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "convolution-lens-005",
    title: "street edge detector · case 005",
    scenario: "Investigate street edge detector under high-dimensional setting.",
    failure: "kernel blurs thin edges; case 5 makes the trade-off visible.",
    subtitle: "Stride trades detail for speed — experiment 005",
    explanation: "Move the controls to see why kernel blurs thin edges and how the measured response changes.",
    lesson: "Stride trades detail for speed. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "convolution-lens-006",
    title: "medical texture map · case 006",
    scenario: "Investigate medical texture map under small clean sample.",
    failure: "padding shifts boundaries; case 6 makes the trade-off visible.",
    subtitle: "Inspect feature maps — experiment 006",
    explanation: "Move the controls to see why padding shifts boundaries and how the measured response changes.",
    lesson: "Inspect feature maps. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "convolution-lens-007",
    title: "satellite boundary scan · case 007",
    scenario: "Investigate satellite boundary scan under large noisy sample.",
    failure: "large stride skips detail; case 7 makes the trade-off visible.",
    subtitle: "Kernels encode local patterns — experiment 007",
    explanation: "Move the controls to see why large stride skips detail and how the measured response changes.",
    lesson: "Kernels encode local patterns. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "convolution-lens-008",
    title: "document line finder · case 008",
    scenario: "Investigate document line finder under shifted production slice.",
    failure: "kernel blurs thin edges; case 8 makes the trade-off visible.",
    subtitle: "Stride trades detail for speed — experiment 008",
    explanation: "Move the controls to see why kernel blurs thin edges and how the measured response changes.",
    lesson: "Stride trades detail for speed. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "convolution-lens-009",
    title: "street edge detector · case 009",
    scenario: "Investigate street edge detector under rare-event regime.",
    failure: "padding shifts boundaries; case 9 makes the trade-off visible.",
    subtitle: "Inspect feature maps — experiment 009",
    explanation: "Move the controls to see why padding shifts boundaries and how the measured response changes.",
    lesson: "Inspect feature maps. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "convolution-lens-010",
    title: "medical texture map · case 010",
    scenario: "Investigate medical texture map under high-dimensional setting.",
    failure: "large stride skips detail; case 10 makes the trade-off visible.",
    subtitle: "Kernels encode local patterns — experiment 010",
    explanation: "Move the controls to see why large stride skips detail and how the measured response changes.",
    lesson: "Kernels encode local patterns. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "convolution-lens-011",
    title: "satellite boundary scan · case 011",
    scenario: "Investigate satellite boundary scan under small clean sample.",
    failure: "kernel blurs thin edges; case 11 makes the trade-off visible.",
    subtitle: "Stride trades detail for speed — experiment 011",
    explanation: "Move the controls to see why kernel blurs thin edges and how the measured response changes.",
    lesson: "Stride trades detail for speed. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "convolution-lens-012",
    title: "document line finder · case 012",
    scenario: "Investigate document line finder under large noisy sample.",
    failure: "padding shifts boundaries; case 12 makes the trade-off visible.",
    subtitle: "Inspect feature maps — experiment 012",
    explanation: "Move the controls to see why padding shifts boundaries and how the measured response changes.",
    lesson: "Inspect feature maps. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function ConvolutionLensLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

