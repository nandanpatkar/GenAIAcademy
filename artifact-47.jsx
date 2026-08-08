import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Image Augmentation Lab",
  "kicker": "Computer vision interactive lab",
  "description": "Explore how visual representations, thresholds, and spatial choices change model behavior at pixel and object level.",
  "mode": "image",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "#7c3aed",
    "secondary": "#16a34a",
    "background": "#faf5ff",
    "panel": "#ffffff",
    "ink": "#281b36",
    "muted": "#79688a",
    "line": "#e2d8ea",
    "soft": "#ede9fe"
  },
  "controlTitle": "Image Augmentation Lab controls",
  "controls": [
    {
      "label": "Transform strength",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune transform strength and observe how the experiment responds."
    },
    {
      "label": "Crop coverage",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing crop coverage."
    },
    {
      "label": "Color jitter",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use color jitter to expose boundary behavior."
    }
  ],
  "visualTitle": "Image Augmentation Lab live view",
  "metrics": [
    {
      "label": "Invariance gain",
      "detail": "primary behavior"
    },
    {
      "label": "Label safety",
      "detail": "robustness check"
    },
    {
      "label": "Augment ops",
      "detail": "resource demand"
    },
    {
      "label": "Policy trust",
      "detail": "decision quality"
    }
  ],
  "formula": "x′ ~ T(x), y′ = preserve(y)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Augment plausible variation",
      "body": "Principle 1: apply this idea when reviewing image augmentation lab results."
    },
    {
      "title": "Transform labels with pixels",
      "body": "Principle 2: apply this idea when reviewing image augmentation lab results."
    },
    {
      "title": "Validate policies by slice",
      "body": "Principle 3: apply this idea when reviewing image augmentation lab results."
    }
  ]
};

const CASES = [
  {
    id: "augmentation-lab-001",
    title: "plant disease classifier · case 001",
    scenario: "Investigate plant disease classifier under small clean sample.",
    failure: "crop removes target; case 1 makes the trade-off visible.",
    subtitle: "Augment plausible variation — experiment 001",
    explanation: "Move the controls to see why crop removes target and how the measured response changes.",
    lesson: "Augment plausible variation. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "augmentation-lab-002",
    title: "retail shelf recognizer · case 002",
    scenario: "Investigate retail shelf recognizer under large noisy sample.",
    failure: "flip changes label meaning; case 2 makes the trade-off visible.",
    subtitle: "Transform labels with pixels — experiment 002",
    explanation: "Move the controls to see why flip changes label meaning and how the measured response changes.",
    lesson: "Transform labels with pixels. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "augmentation-lab-003",
    title: "face landmark model · case 003",
    scenario: "Investigate face landmark model under shifted production slice.",
    failure: "color jitter erases symptom; case 3 makes the trade-off visible.",
    subtitle: "Validate policies by slice — experiment 003",
    explanation: "Move the controls to see why color jitter erases symptom and how the measured response changes.",
    lesson: "Validate policies by slice. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "augmentation-lab-004",
    title: "aerial scene classifier · case 004",
    scenario: "Investigate aerial scene classifier under rare-event regime.",
    failure: "crop removes target; case 4 makes the trade-off visible.",
    subtitle: "Augment plausible variation — experiment 004",
    explanation: "Move the controls to see why crop removes target and how the measured response changes.",
    lesson: "Augment plausible variation. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "augmentation-lab-005",
    title: "plant disease classifier · case 005",
    scenario: "Investigate plant disease classifier under high-dimensional setting.",
    failure: "flip changes label meaning; case 5 makes the trade-off visible.",
    subtitle: "Transform labels with pixels — experiment 005",
    explanation: "Move the controls to see why flip changes label meaning and how the measured response changes.",
    lesson: "Transform labels with pixels. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "augmentation-lab-006",
    title: "retail shelf recognizer · case 006",
    scenario: "Investigate retail shelf recognizer under small clean sample.",
    failure: "color jitter erases symptom; case 6 makes the trade-off visible.",
    subtitle: "Validate policies by slice — experiment 006",
    explanation: "Move the controls to see why color jitter erases symptom and how the measured response changes.",
    lesson: "Validate policies by slice. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "augmentation-lab-007",
    title: "face landmark model · case 007",
    scenario: "Investigate face landmark model under large noisy sample.",
    failure: "crop removes target; case 7 makes the trade-off visible.",
    subtitle: "Augment plausible variation — experiment 007",
    explanation: "Move the controls to see why crop removes target and how the measured response changes.",
    lesson: "Augment plausible variation. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "augmentation-lab-008",
    title: "aerial scene classifier · case 008",
    scenario: "Investigate aerial scene classifier under shifted production slice.",
    failure: "flip changes label meaning; case 8 makes the trade-off visible.",
    subtitle: "Transform labels with pixels — experiment 008",
    explanation: "Move the controls to see why flip changes label meaning and how the measured response changes.",
    lesson: "Transform labels with pixels. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "augmentation-lab-009",
    title: "plant disease classifier · case 009",
    scenario: "Investigate plant disease classifier under rare-event regime.",
    failure: "color jitter erases symptom; case 9 makes the trade-off visible.",
    subtitle: "Validate policies by slice — experiment 009",
    explanation: "Move the controls to see why color jitter erases symptom and how the measured response changes.",
    lesson: "Validate policies by slice. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "augmentation-lab-010",
    title: "retail shelf recognizer · case 010",
    scenario: "Investigate retail shelf recognizer under high-dimensional setting.",
    failure: "crop removes target; case 10 makes the trade-off visible.",
    subtitle: "Augment plausible variation — experiment 010",
    explanation: "Move the controls to see why crop removes target and how the measured response changes.",
    lesson: "Augment plausible variation. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "augmentation-lab-011",
    title: "face landmark model · case 011",
    scenario: "Investigate face landmark model under small clean sample.",
    failure: "flip changes label meaning; case 11 makes the trade-off visible.",
    subtitle: "Transform labels with pixels — experiment 011",
    explanation: "Move the controls to see why flip changes label meaning and how the measured response changes.",
    lesson: "Transform labels with pixels. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "augmentation-lab-012",
    title: "aerial scene classifier · case 012",
    scenario: "Investigate aerial scene classifier under large noisy sample.",
    failure: "color jitter erases symptom; case 12 makes the trade-off visible.",
    subtitle: "Validate policies by slice — experiment 012",
    explanation: "Move the controls to see why color jitter erases symptom and how the measured response changes.",
    lesson: "Validate policies by slice. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function ImageAugmentationLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

