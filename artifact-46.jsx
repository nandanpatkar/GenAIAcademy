import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Detection IoU & NMS Arena",
  "kicker": "Computer vision interactive lab",
  "description": "Explore how visual representations, thresholds, and spatial choices change model behavior at pixel and object level.",
  "mode": "neighbors",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "#f97316",
    "secondary": "#22d3ee",
    "background": "#120d08",
    "panel": "#26180d",
    "ink": "#fff7ed",
    "muted": "#c2a28b",
    "line": "#57361f",
    "soft": "#3d2513"
  },
  "controlTitle": "Detection IoU & NMS Arena controls",
  "controls": [
    {
      "label": "IoU threshold",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune iou threshold and observe how the experiment responds."
    },
    {
      "label": "Confidence cutoff",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing confidence cutoff."
    },
    {
      "label": "NMS strength",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use nms strength to expose boundary behavior."
    }
  ],
  "visualTitle": "Detection IoU & NMS Arena live view",
  "metrics": [
    {
      "label": "Match quality",
      "detail": "primary behavior"
    },
    {
      "label": "Duplicate removal",
      "detail": "robustness check"
    },
    {
      "label": "Box ops",
      "detail": "resource demand"
    },
    {
      "label": "Detection trust",
      "detail": "decision quality"
    }
  ],
  "formula": "IoU = area(A∩B)/area(A∪B)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Matching rules shape metrics",
      "body": "Principle 1: apply this idea when reviewing detection iou & nms arena results."
    },
    {
      "title": "Crowds need careful suppression",
      "body": "Principle 2: apply this idea when reviewing detection iou & nms arena results."
    },
    {
      "title": "Confidence is not localization",
      "body": "Principle 3: apply this idea when reviewing detection iou & nms arena results."
    }
  ]
};

const CASES = [
  {
    id: "detection-iou-001",
    title: "crowded pedestrian scene · case 001",
    scenario: "Investigate crowded pedestrian scene under small clean sample.",
    failure: "NMS deletes nearby object; case 1 makes the trade-off visible.",
    subtitle: "Matching rules shape metrics — experiment 001",
    explanation: "Move the controls to see why NMS deletes nearby object and how the measured response changes.",
    lesson: "Matching rules shape metrics. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "detection-iou-002",
    title: "warehouse package scan · case 002",
    scenario: "Investigate warehouse package scan under large noisy sample.",
    failure: "low cutoff floods boxes; case 2 makes the trade-off visible.",
    subtitle: "Crowds need careful suppression — experiment 002",
    explanation: "Move the controls to see why low cutoff floods boxes and how the measured response changes.",
    lesson: "Crowds need careful suppression. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "detection-iou-003",
    title: "wildlife camera frame · case 003",
    scenario: "Investigate wildlife camera frame under shifted production slice.",
    failure: "IoU mismatch skews evaluation; case 3 makes the trade-off visible.",
    subtitle: "Confidence is not localization — experiment 003",
    explanation: "Move the controls to see why IoU mismatch skews evaluation and how the measured response changes.",
    lesson: "Confidence is not localization. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "detection-iou-004",
    title: "traffic intersection · case 004",
    scenario: "Investigate traffic intersection under rare-event regime.",
    failure: "NMS deletes nearby object; case 4 makes the trade-off visible.",
    subtitle: "Matching rules shape metrics — experiment 004",
    explanation: "Move the controls to see why NMS deletes nearby object and how the measured response changes.",
    lesson: "Matching rules shape metrics. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "detection-iou-005",
    title: "crowded pedestrian scene · case 005",
    scenario: "Investigate crowded pedestrian scene under high-dimensional setting.",
    failure: "low cutoff floods boxes; case 5 makes the trade-off visible.",
    subtitle: "Crowds need careful suppression — experiment 005",
    explanation: "Move the controls to see why low cutoff floods boxes and how the measured response changes.",
    lesson: "Crowds need careful suppression. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "detection-iou-006",
    title: "warehouse package scan · case 006",
    scenario: "Investigate warehouse package scan under small clean sample.",
    failure: "IoU mismatch skews evaluation; case 6 makes the trade-off visible.",
    subtitle: "Confidence is not localization — experiment 006",
    explanation: "Move the controls to see why IoU mismatch skews evaluation and how the measured response changes.",
    lesson: "Confidence is not localization. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "detection-iou-007",
    title: "wildlife camera frame · case 007",
    scenario: "Investigate wildlife camera frame under large noisy sample.",
    failure: "NMS deletes nearby object; case 7 makes the trade-off visible.",
    subtitle: "Matching rules shape metrics — experiment 007",
    explanation: "Move the controls to see why NMS deletes nearby object and how the measured response changes.",
    lesson: "Matching rules shape metrics. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "detection-iou-008",
    title: "traffic intersection · case 008",
    scenario: "Investigate traffic intersection under shifted production slice.",
    failure: "low cutoff floods boxes; case 8 makes the trade-off visible.",
    subtitle: "Crowds need careful suppression — experiment 008",
    explanation: "Move the controls to see why low cutoff floods boxes and how the measured response changes.",
    lesson: "Crowds need careful suppression. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "detection-iou-009",
    title: "crowded pedestrian scene · case 009",
    scenario: "Investigate crowded pedestrian scene under rare-event regime.",
    failure: "IoU mismatch skews evaluation; case 9 makes the trade-off visible.",
    subtitle: "Confidence is not localization — experiment 009",
    explanation: "Move the controls to see why IoU mismatch skews evaluation and how the measured response changes.",
    lesson: "Confidence is not localization. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "detection-iou-010",
    title: "warehouse package scan · case 010",
    scenario: "Investigate warehouse package scan under high-dimensional setting.",
    failure: "NMS deletes nearby object; case 10 makes the trade-off visible.",
    subtitle: "Matching rules shape metrics — experiment 010",
    explanation: "Move the controls to see why NMS deletes nearby object and how the measured response changes.",
    lesson: "Matching rules shape metrics. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "detection-iou-011",
    title: "wildlife camera frame · case 011",
    scenario: "Investigate wildlife camera frame under small clean sample.",
    failure: "low cutoff floods boxes; case 11 makes the trade-off visible.",
    subtitle: "Crowds need careful suppression — experiment 011",
    explanation: "Move the controls to see why low cutoff floods boxes and how the measured response changes.",
    lesson: "Crowds need careful suppression. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "detection-iou-012",
    title: "traffic intersection · case 012",
    scenario: "Investigate traffic intersection under large noisy sample.",
    failure: "IoU mismatch skews evaluation; case 12 makes the trade-off visible.",
    subtitle: "Confidence is not localization — experiment 012",
    explanation: "Move the controls to see why IoU mismatch skews evaluation and how the measured response changes.",
    lesson: "Confidence is not localization. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function DetectionIouNmsLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

