import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Vision Transformer Patch Lab",
  "kicker": "Computer vision interactive lab",
  "description": "Explore how visual representations, thresholds, and spatial choices change model behavior at pixel and object level.",
  "mode": "matrix",
  "variant": 4,
  "dark": false,
  "palette": {
    "primary": "#dc2626",
    "secondary": "#2563eb",
    "background": "#fff7f7",
    "panel": "#ffffff",
    "ink": "#301717",
    "muted": "#806363",
    "line": "#ecd5d5",
    "soft": "#fee2e2"
  },
  "controlTitle": "Vision Transformer Patch Lab controls",
  "controls": [
    {
      "label": "Patch size",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune patch size and observe how the experiment responds."
    },
    {
      "label": "Attention span",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing attention span."
    },
    {
      "label": "Token dropout",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use token dropout to expose boundary behavior."
    }
  ],
  "visualTitle": "Vision Transformer Patch Lab live view",
  "metrics": [
    {
      "label": "Patch coverage",
      "detail": "primary behavior"
    },
    {
      "label": "Global context",
      "detail": "robustness check"
    },
    {
      "label": "Token count",
      "detail": "resource demand"
    },
    {
      "label": "Vision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "tokens = flatten(patches(X))Wₑ + position",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Patches set visual granularity",
      "body": "Principle 1: apply this idea when reviewing vision transformer patch lab results."
    },
    {
      "title": "Position carries geometry",
      "body": "Principle 2: apply this idea when reviewing vision transformer patch lab results."
    },
    {
      "title": "Token budgets shape resolution",
      "body": "Principle 3: apply this idea when reviewing vision transformer patch lab results."
    }
  ]
};

const CASES = [
  {
    id: "vit-patch-001",
    title: "fine-grained bird image · case 001",
    scenario: "Investigate fine-grained bird image under small clean sample.",
    failure: "patch hides tiny feature; case 1 makes the trade-off visible.",
    subtitle: "Patches set visual granularity — experiment 001",
    explanation: "Move the controls to see why patch hides tiny feature and how the measured response changes.",
    lesson: "Patches set visual granularity. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "vit-patch-002",
    title: "document layout page · case 002",
    scenario: "Investigate document layout page under large noisy sample.",
    failure: "position encoding drifts; case 2 makes the trade-off visible.",
    subtitle: "Position carries geometry — experiment 002",
    explanation: "Move the controls to see why position encoding drifts and how the measured response changes.",
    lesson: "Position carries geometry. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "vit-patch-003",
    title: "remote sensing tile · case 003",
    scenario: "Investigate remote sensing tile under shifted production slice.",
    failure: "quadratic cost explodes; case 3 makes the trade-off visible.",
    subtitle: "Token budgets shape resolution — experiment 003",
    explanation: "Move the controls to see why quadratic cost explodes and how the measured response changes.",
    lesson: "Token budgets shape resolution. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "vit-patch-004",
    title: "industrial inspection frame · case 004",
    scenario: "Investigate industrial inspection frame under rare-event regime.",
    failure: "patch hides tiny feature; case 4 makes the trade-off visible.",
    subtitle: "Patches set visual granularity — experiment 004",
    explanation: "Move the controls to see why patch hides tiny feature and how the measured response changes.",
    lesson: "Patches set visual granularity. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "vit-patch-005",
    title: "fine-grained bird image · case 005",
    scenario: "Investigate fine-grained bird image under high-dimensional setting.",
    failure: "position encoding drifts; case 5 makes the trade-off visible.",
    subtitle: "Position carries geometry — experiment 005",
    explanation: "Move the controls to see why position encoding drifts and how the measured response changes.",
    lesson: "Position carries geometry. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "vit-patch-006",
    title: "document layout page · case 006",
    scenario: "Investigate document layout page under small clean sample.",
    failure: "quadratic cost explodes; case 6 makes the trade-off visible.",
    subtitle: "Token budgets shape resolution — experiment 006",
    explanation: "Move the controls to see why quadratic cost explodes and how the measured response changes.",
    lesson: "Token budgets shape resolution. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "vit-patch-007",
    title: "remote sensing tile · case 007",
    scenario: "Investigate remote sensing tile under large noisy sample.",
    failure: "patch hides tiny feature; case 7 makes the trade-off visible.",
    subtitle: "Patches set visual granularity — experiment 007",
    explanation: "Move the controls to see why patch hides tiny feature and how the measured response changes.",
    lesson: "Patches set visual granularity. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "vit-patch-008",
    title: "industrial inspection frame · case 008",
    scenario: "Investigate industrial inspection frame under shifted production slice.",
    failure: "position encoding drifts; case 8 makes the trade-off visible.",
    subtitle: "Position carries geometry — experiment 008",
    explanation: "Move the controls to see why position encoding drifts and how the measured response changes.",
    lesson: "Position carries geometry. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "vit-patch-009",
    title: "fine-grained bird image · case 009",
    scenario: "Investigate fine-grained bird image under rare-event regime.",
    failure: "quadratic cost explodes; case 9 makes the trade-off visible.",
    subtitle: "Token budgets shape resolution — experiment 009",
    explanation: "Move the controls to see why quadratic cost explodes and how the measured response changes.",
    lesson: "Token budgets shape resolution. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "vit-patch-010",
    title: "document layout page · case 010",
    scenario: "Investigate document layout page under high-dimensional setting.",
    failure: "patch hides tiny feature; case 10 makes the trade-off visible.",
    subtitle: "Patches set visual granularity — experiment 010",
    explanation: "Move the controls to see why patch hides tiny feature and how the measured response changes.",
    lesson: "Patches set visual granularity. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "vit-patch-011",
    title: "remote sensing tile · case 011",
    scenario: "Investigate remote sensing tile under small clean sample.",
    failure: "position encoding drifts; case 11 makes the trade-off visible.",
    subtitle: "Position carries geometry — experiment 011",
    explanation: "Move the controls to see why position encoding drifts and how the measured response changes.",
    lesson: "Position carries geometry. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "vit-patch-012",
    title: "industrial inspection frame · case 012",
    scenario: "Investigate industrial inspection frame under large noisy sample.",
    failure: "quadratic cost explodes; case 12 makes the trade-off visible.",
    subtitle: "Token budgets shape resolution — experiment 012",
    explanation: "Move the controls to see why quadratic cost explodes and how the measured response changes.",
    lesson: "Token budgets shape resolution. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function VisionTransformerPatchLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

