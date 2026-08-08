import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "KNN Neighborhood Explorer",
  "kicker": "Machine learning interactive lab",
  "description": "Run a hands-on classical machine-learning experiment, inspect failure modes, and connect each control to deployment behavior.",
  "mode": "neighbors",
  "variant": 3,
  "dark": true,
  "palette": {
    "primary": "#38bdf8",
    "secondary": "#fb7185",
    "background": "#071521",
    "panel": "#0d2535",
    "ink": "#e0f2fe",
    "muted": "#8eaabd",
    "line": "#21445a",
    "soft": "#12364a"
  },
  "controlTitle": "KNN Neighborhood Explorer controls",
  "controls": [
    {
      "label": "Neighbor count k",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune neighbor count k and observe how the experiment responds."
    },
    {
      "label": "Distance weighting",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing distance weighting."
    },
    {
      "label": "Feature scale",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use feature scale to expose boundary behavior."
    }
  ],
  "visualTitle": "KNN Neighborhood Explorer live view",
  "metrics": [
    {
      "label": "Local purity",
      "detail": "primary behavior"
    },
    {
      "label": "Boundary margin",
      "detail": "robustness check"
    },
    {
      "label": "Distance cost",
      "detail": "resource demand"
    },
    {
      "label": "Prediction trust",
      "detail": "decision quality"
    }
  ],
  "formula": "ŷ = voteₖ(distance(x,xᵢ))",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Neighborhoods define belief",
      "body": "Principle 1: apply this idea when reviewing knn neighborhood explorer results."
    },
    {
      "title": "Scale before measuring",
      "body": "Principle 2: apply this idea when reviewing knn neighborhood explorer results."
    },
    {
      "title": "Inspect boundary cases",
      "body": "Principle 3: apply this idea when reviewing knn neighborhood explorer results."
    }
  ]
};

const CASES = [
  {
    id: "knn-neighborhood-001",
    title: "two-class embedding · case 001",
    scenario: "Investigate two-class embedding under small clean sample.",
    failure: "small k chases noise; case 1 makes the trade-off visible.",
    subtitle: "Neighborhoods define belief — experiment 001",
    explanation: "Move the controls to see why small k chases noise and how the measured response changes.",
    lesson: "Neighborhoods define belief. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "knn-neighborhood-002",
    title: "store similarity map · case 002",
    scenario: "Investigate store similarity map under large noisy sample.",
    failure: "large k blurs classes; case 2 makes the trade-off visible.",
    subtitle: "Scale before measuring — experiment 002",
    explanation: "Move the controls to see why large k blurs classes and how the measured response changes.",
    lesson: "Scale before measuring. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "knn-neighborhood-003",
    title: "anomaly neighborhood · case 003",
    scenario: "Investigate anomaly neighborhood under shifted production slice.",
    failure: "raw scales distort distance; case 3 makes the trade-off visible.",
    subtitle: "Inspect boundary cases — experiment 003",
    explanation: "Move the controls to see why raw scales distort distance and how the measured response changes.",
    lesson: "Inspect boundary cases. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "knn-neighborhood-004",
    title: "patient cohort search · case 004",
    scenario: "Investigate patient cohort search under rare-event regime.",
    failure: "small k chases noise; case 4 makes the trade-off visible.",
    subtitle: "Neighborhoods define belief — experiment 004",
    explanation: "Move the controls to see why small k chases noise and how the measured response changes.",
    lesson: "Neighborhoods define belief. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "knn-neighborhood-005",
    title: "two-class embedding · case 005",
    scenario: "Investigate two-class embedding under high-dimensional setting.",
    failure: "large k blurs classes; case 5 makes the trade-off visible.",
    subtitle: "Scale before measuring — experiment 005",
    explanation: "Move the controls to see why large k blurs classes and how the measured response changes.",
    lesson: "Scale before measuring. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "knn-neighborhood-006",
    title: "store similarity map · case 006",
    scenario: "Investigate store similarity map under small clean sample.",
    failure: "raw scales distort distance; case 6 makes the trade-off visible.",
    subtitle: "Inspect boundary cases — experiment 006",
    explanation: "Move the controls to see why raw scales distort distance and how the measured response changes.",
    lesson: "Inspect boundary cases. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "knn-neighborhood-007",
    title: "anomaly neighborhood · case 007",
    scenario: "Investigate anomaly neighborhood under large noisy sample.",
    failure: "small k chases noise; case 7 makes the trade-off visible.",
    subtitle: "Neighborhoods define belief — experiment 007",
    explanation: "Move the controls to see why small k chases noise and how the measured response changes.",
    lesson: "Neighborhoods define belief. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "knn-neighborhood-008",
    title: "patient cohort search · case 008",
    scenario: "Investigate patient cohort search under shifted production slice.",
    failure: "large k blurs classes; case 8 makes the trade-off visible.",
    subtitle: "Scale before measuring — experiment 008",
    explanation: "Move the controls to see why large k blurs classes and how the measured response changes.",
    lesson: "Scale before measuring. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "knn-neighborhood-009",
    title: "two-class embedding · case 009",
    scenario: "Investigate two-class embedding under rare-event regime.",
    failure: "raw scales distort distance; case 9 makes the trade-off visible.",
    subtitle: "Inspect boundary cases — experiment 009",
    explanation: "Move the controls to see why raw scales distort distance and how the measured response changes.",
    lesson: "Inspect boundary cases. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "knn-neighborhood-010",
    title: "store similarity map · case 010",
    scenario: "Investigate store similarity map under high-dimensional setting.",
    failure: "small k chases noise; case 10 makes the trade-off visible.",
    subtitle: "Neighborhoods define belief — experiment 010",
    explanation: "Move the controls to see why small k chases noise and how the measured response changes.",
    lesson: "Neighborhoods define belief. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "knn-neighborhood-011",
    title: "anomaly neighborhood · case 011",
    scenario: "Investigate anomaly neighborhood under small clean sample.",
    failure: "large k blurs classes; case 11 makes the trade-off visible.",
    subtitle: "Scale before measuring — experiment 011",
    explanation: "Move the controls to see why large k blurs classes and how the measured response changes.",
    lesson: "Scale before measuring. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "knn-neighborhood-012",
    title: "patient cohort search · case 012",
    scenario: "Investigate patient cohort search under large noisy sample.",
    failure: "raw scales distort distance; case 12 makes the trade-off visible.",
    subtitle: "Inspect boundary cases — experiment 012",
    explanation: "Move the controls to see why raw scales distort distance and how the measured response changes.",
    lesson: "Inspect boundary cases. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function KnnNeighborhoodLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

