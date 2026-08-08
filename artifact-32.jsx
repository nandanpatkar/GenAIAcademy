import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Regularization Path Explorer",
  "kicker": "Machine learning interactive lab",
  "description": "Run a hands-on classical machine-learning experiment, inspect failure modes, and connect each control to deployment behavior.",
  "mode": "curve",
  "variant": 5,
  "dark": true,
  "palette": {
    "primary": "#22c55e",
    "secondary": "#f59e0b",
    "background": "#07130d",
    "panel": "#0e2117",
    "ink": "#ecfdf5",
    "muted": "#91b8a2",
    "line": "#244e34",
    "soft": "#163d25"
  },
  "controlTitle": "Regularization Path Explorer controls",
  "controls": [
    {
      "label": "Penalty strength",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune penalty strength and observe how the experiment responds."
    },
    {
      "label": "L1 share",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing l1 share."
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
  "visualTitle": "Regularization Path Explorer live view",
  "metrics": [
    {
      "label": "Sparsity",
      "detail": "primary behavior"
    },
    {
      "label": "Holdout fit",
      "detail": "robustness check"
    },
    {
      "label": "Active terms",
      "detail": "resource demand"
    },
    {
      "label": "Path confidence",
      "detail": "decision quality"
    }
  ],
  "formula": "min L(y,ŷ) + λ[(1−α)||w||² + α||w||₁]",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Regularization is a path",
      "body": "Principle 1: apply this idea when reviewing regularization path explorer results."
    },
    {
      "title": "Scaling changes the penalty",
      "body": "Principle 2: apply this idea when reviewing regularization path explorer results."
    },
    {
      "title": "Sparse is not automatically causal",
      "body": "Principle 3: apply this idea when reviewing regularization path explorer results."
    }
  ]
};

const CASES = [
  {
    id: "regularization-path-001",
    title: "wide genomic model · case 001",
    scenario: "Investigate wide genomic model under small clean sample.",
    failure: "weak penalty overfits; case 1 makes the trade-off visible.",
    subtitle: "Regularization is a path — experiment 001",
    explanation: "Move the controls to see why weak penalty overfits and how the measured response changes.",
    lesson: "Regularization is a path. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "regularization-path-002",
    title: "marketing response model · case 002",
    scenario: "Investigate marketing response model under large noisy sample.",
    failure: "strong penalty erases signal; case 2 makes the trade-off visible.",
    subtitle: "Scaling changes the penalty — experiment 002",
    explanation: "Move the controls to see why strong penalty erases signal and how the measured response changes.",
    lesson: "Scaling changes the penalty. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "regularization-path-003",
    title: "text feature classifier · case 003",
    scenario: "Investigate text feature classifier under shifted production slice.",
    failure: "unscaled features skew shrinkage; case 3 makes the trade-off visible.",
    subtitle: "Sparse is not automatically causal — experiment 003",
    explanation: "Move the controls to see why unscaled features skew shrinkage and how the measured response changes.",
    lesson: "Sparse is not automatically causal. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "regularization-path-004",
    title: "credit risk score · case 004",
    scenario: "Investigate credit risk score under rare-event regime.",
    failure: "weak penalty overfits; case 4 makes the trade-off visible.",
    subtitle: "Regularization is a path — experiment 004",
    explanation: "Move the controls to see why weak penalty overfits and how the measured response changes.",
    lesson: "Regularization is a path. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "regularization-path-005",
    title: "wide genomic model · case 005",
    scenario: "Investigate wide genomic model under high-dimensional setting.",
    failure: "strong penalty erases signal; case 5 makes the trade-off visible.",
    subtitle: "Scaling changes the penalty — experiment 005",
    explanation: "Move the controls to see why strong penalty erases signal and how the measured response changes.",
    lesson: "Scaling changes the penalty. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "regularization-path-006",
    title: "marketing response model · case 006",
    scenario: "Investigate marketing response model under small clean sample.",
    failure: "unscaled features skew shrinkage; case 6 makes the trade-off visible.",
    subtitle: "Sparse is not automatically causal — experiment 006",
    explanation: "Move the controls to see why unscaled features skew shrinkage and how the measured response changes.",
    lesson: "Sparse is not automatically causal. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "regularization-path-007",
    title: "text feature classifier · case 007",
    scenario: "Investigate text feature classifier under large noisy sample.",
    failure: "weak penalty overfits; case 7 makes the trade-off visible.",
    subtitle: "Regularization is a path — experiment 007",
    explanation: "Move the controls to see why weak penalty overfits and how the measured response changes.",
    lesson: "Regularization is a path. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "regularization-path-008",
    title: "credit risk score · case 008",
    scenario: "Investigate credit risk score under shifted production slice.",
    failure: "strong penalty erases signal; case 8 makes the trade-off visible.",
    subtitle: "Scaling changes the penalty — experiment 008",
    explanation: "Move the controls to see why strong penalty erases signal and how the measured response changes.",
    lesson: "Scaling changes the penalty. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "regularization-path-009",
    title: "wide genomic model · case 009",
    scenario: "Investigate wide genomic model under rare-event regime.",
    failure: "unscaled features skew shrinkage; case 9 makes the trade-off visible.",
    subtitle: "Sparse is not automatically causal — experiment 009",
    explanation: "Move the controls to see why unscaled features skew shrinkage and how the measured response changes.",
    lesson: "Sparse is not automatically causal. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "regularization-path-010",
    title: "marketing response model · case 010",
    scenario: "Investigate marketing response model under high-dimensional setting.",
    failure: "weak penalty overfits; case 10 makes the trade-off visible.",
    subtitle: "Regularization is a path — experiment 010",
    explanation: "Move the controls to see why weak penalty overfits and how the measured response changes.",
    lesson: "Regularization is a path. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "regularization-path-011",
    title: "text feature classifier · case 011",
    scenario: "Investigate text feature classifier under small clean sample.",
    failure: "strong penalty erases signal; case 11 makes the trade-off visible.",
    subtitle: "Scaling changes the penalty — experiment 011",
    explanation: "Move the controls to see why strong penalty erases signal and how the measured response changes.",
    lesson: "Scaling changes the penalty. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "regularization-path-012",
    title: "credit risk score · case 012",
    scenario: "Investigate credit risk score under large noisy sample.",
    failure: "unscaled features skew shrinkage; case 12 makes the trade-off visible.",
    subtitle: "Sparse is not automatically causal — experiment 012",
    explanation: "Move the controls to see why unscaled features skew shrinkage and how the measured response changes.",
    lesson: "Sparse is not automatically causal. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function RegularizationPathLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

