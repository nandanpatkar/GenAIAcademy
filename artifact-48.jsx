import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Segmentation Pixel Lab",
  "kicker": "Computer vision interactive lab",
  "description": "Explore how visual representations, thresholds, and spatial choices change model behavior at pixel and object level.",
  "mode": "grid",
  "variant": 3,
  "dark": true,
  "palette": {
    "primary": "#10b981",
    "secondary": "#f472b6",
    "background": "#07140f",
    "panel": "#10271d",
    "ink": "#ecfdf5",
    "muted": "#8fb3a2",
    "line": "#234d39",
    "soft": "#183829"
  },
  "controlTitle": "Segmentation Pixel Lab controls",
  "controls": [
    {
      "label": "Mask threshold",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune mask threshold and observe how the experiment responds."
    },
    {
      "label": "Boundary weight",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing boundary weight."
    },
    {
      "label": "Class balance",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use class balance to expose boundary behavior."
    }
  ],
  "visualTitle": "Segmentation Pixel Lab live view",
  "metrics": [
    {
      "label": "Mean IoU",
      "detail": "primary behavior"
    },
    {
      "label": "Edge fidelity",
      "detail": "robustness check"
    },
    {
      "label": "Pixel cost",
      "detail": "resource demand"
    },
    {
      "label": "Mask confidence",
      "detail": "decision quality"
    }
  ],
  "formula": "Dice = 2|P∩G|/(|P|+|G|)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Pixel accuracy can mislead",
      "body": "Principle 1: apply this idea when reviewing segmentation pixel lab results."
    },
    {
      "title": "Boundaries deserve metrics",
      "body": "Principle 2: apply this idea when reviewing segmentation pixel lab results."
    },
    {
      "title": "Class weighting changes behavior",
      "body": "Principle 3: apply this idea when reviewing segmentation pixel lab results."
    }
  ]
};

const CASES = [
  {
    id: "segmentation-pixel-001",
    title: "tumor boundary mask · case 001",
    scenario: "Investigate tumor boundary mask under small clean sample.",
    failure: "large class dominates loss; case 1 makes the trade-off visible.",
    subtitle: "Pixel accuracy can mislead — experiment 001",
    explanation: "Move the controls to see why large class dominates loss and how the measured response changes.",
    lesson: "Pixel accuracy can mislead. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "segmentation-pixel-002",
    title: "road scene parser · case 002",
    scenario: "Investigate road scene parser under large noisy sample.",
    failure: "threshold breaks thin region; case 2 makes the trade-off visible.",
    subtitle: "Boundaries deserve metrics — experiment 002",
    explanation: "Move the controls to see why threshold breaks thin region and how the measured response changes.",
    lesson: "Boundaries deserve metrics. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "segmentation-pixel-003",
    title: "defect surface mask · case 003",
    scenario: "Investigate defect surface mask under shifted production slice.",
    failure: "annotation edge is ambiguous; case 3 makes the trade-off visible.",
    subtitle: "Class weighting changes behavior — experiment 003",
    explanation: "Move the controls to see why annotation edge is ambiguous and how the measured response changes.",
    lesson: "Class weighting changes behavior. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "segmentation-pixel-004",
    title: "document region segmenter · case 004",
    scenario: "Investigate document region segmenter under rare-event regime.",
    failure: "large class dominates loss; case 4 makes the trade-off visible.",
    subtitle: "Pixel accuracy can mislead — experiment 004",
    explanation: "Move the controls to see why large class dominates loss and how the measured response changes.",
    lesson: "Pixel accuracy can mislead. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "segmentation-pixel-005",
    title: "tumor boundary mask · case 005",
    scenario: "Investigate tumor boundary mask under high-dimensional setting.",
    failure: "threshold breaks thin region; case 5 makes the trade-off visible.",
    subtitle: "Boundaries deserve metrics — experiment 005",
    explanation: "Move the controls to see why threshold breaks thin region and how the measured response changes.",
    lesson: "Boundaries deserve metrics. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "segmentation-pixel-006",
    title: "road scene parser · case 006",
    scenario: "Investigate road scene parser under small clean sample.",
    failure: "annotation edge is ambiguous; case 6 makes the trade-off visible.",
    subtitle: "Class weighting changes behavior — experiment 006",
    explanation: "Move the controls to see why annotation edge is ambiguous and how the measured response changes.",
    lesson: "Class weighting changes behavior. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "segmentation-pixel-007",
    title: "defect surface mask · case 007",
    scenario: "Investigate defect surface mask under large noisy sample.",
    failure: "large class dominates loss; case 7 makes the trade-off visible.",
    subtitle: "Pixel accuracy can mislead — experiment 007",
    explanation: "Move the controls to see why large class dominates loss and how the measured response changes.",
    lesson: "Pixel accuracy can mislead. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "segmentation-pixel-008",
    title: "document region segmenter · case 008",
    scenario: "Investigate document region segmenter under shifted production slice.",
    failure: "threshold breaks thin region; case 8 makes the trade-off visible.",
    subtitle: "Boundaries deserve metrics — experiment 008",
    explanation: "Move the controls to see why threshold breaks thin region and how the measured response changes.",
    lesson: "Boundaries deserve metrics. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "segmentation-pixel-009",
    title: "tumor boundary mask · case 009",
    scenario: "Investigate tumor boundary mask under rare-event regime.",
    failure: "annotation edge is ambiguous; case 9 makes the trade-off visible.",
    subtitle: "Class weighting changes behavior — experiment 009",
    explanation: "Move the controls to see why annotation edge is ambiguous and how the measured response changes.",
    lesson: "Class weighting changes behavior. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "segmentation-pixel-010",
    title: "road scene parser · case 010",
    scenario: "Investigate road scene parser under high-dimensional setting.",
    failure: "large class dominates loss; case 10 makes the trade-off visible.",
    subtitle: "Pixel accuracy can mislead — experiment 010",
    explanation: "Move the controls to see why large class dominates loss and how the measured response changes.",
    lesson: "Pixel accuracy can mislead. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "segmentation-pixel-011",
    title: "defect surface mask · case 011",
    scenario: "Investigate defect surface mask under small clean sample.",
    failure: "threshold breaks thin region; case 11 makes the trade-off visible.",
    subtitle: "Boundaries deserve metrics — experiment 011",
    explanation: "Move the controls to see why threshold breaks thin region and how the measured response changes.",
    lesson: "Boundaries deserve metrics. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "segmentation-pixel-012",
    title: "document region segmenter · case 012",
    scenario: "Investigate document region segmenter under large noisy sample.",
    failure: "annotation edge is ambiguous; case 12 makes the trade-off visible.",
    subtitle: "Class weighting changes behavior — experiment 012",
    explanation: "Move the controls to see why annotation edge is ambiguous and how the measured response changes.",
    lesson: "Class weighting changes behavior. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function SegmentationPixelLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

