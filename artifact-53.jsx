import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Confidence Interval Factory",
  "kicker": "Statistics & probability interactive lab",
  "description": "Build statistical intuition by changing assumptions, sampling regimes, and uncertainty controls in real time.",
  "mode": "curve",
  "variant": 5,
  "dark": true,
  "palette": {
    "primary": "#a3e635",
    "secondary": "#22d3ee",
    "background": "#111707",
    "panel": "#202b0d",
    "ink": "#f7fee7",
    "muted": "#acbd8d",
    "line": "#485b1f",
    "soft": "#344414"
  },
  "controlTitle": "Confidence Interval Factory controls",
  "controls": [
    {
      "label": "Confidence level",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune confidence level and observe how the experiment responds."
    },
    {
      "label": "Sample size",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing sample size."
    },
    {
      "label": "Population spread",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use population spread to expose boundary behavior."
    }
  ],
  "visualTitle": "Confidence Interval Factory live view",
  "metrics": [
    {
      "label": "Coverage",
      "detail": "primary behavior"
    },
    {
      "label": "Interval width",
      "detail": "robustness check"
    },
    {
      "label": "Resamples",
      "detail": "resource demand"
    },
    {
      "label": "Interval trust",
      "detail": "decision quality"
    }
  ],
  "formula": "CI = estimate ± critical·SE",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Intervals describe procedures",
      "body": "Principle 1: apply this idea when reviewing confidence interval factory results."
    },
    {
      "title": "Precision grows with information",
      "body": "Principle 2: apply this idea when reviewing confidence interval factory results."
    },
    {
      "title": "Coverage cannot cure bias",
      "body": "Principle 3: apply this idea when reviewing confidence interval factory results."
    }
  ]
};

const CASES = [
  {
    id: "confidence-factory-001",
    title: "mean response estimate · case 001",
    scenario: "Investigate mean response estimate under small clean sample.",
    failure: "interval interpreted per sample; case 1 makes the trade-off visible.",
    subtitle: "Intervals describe procedures — experiment 001",
    explanation: "Move the controls to see why interval interpreted per sample and how the measured response changes.",
    lesson: "Intervals describe procedures. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "confidence-factory-002",
    title: "conversion proportion · case 002",
    scenario: "Investigate conversion proportion under large noisy sample.",
    failure: "optional stopping narrows claim; case 2 makes the trade-off visible.",
    subtitle: "Precision grows with information — experiment 002",
    explanation: "Move the controls to see why optional stopping narrows claim and how the measured response changes.",
    lesson: "Precision grows with information. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "confidence-factory-003",
    title: "model accuracy sample · case 003",
    scenario: "Investigate model accuracy sample under shifted production slice.",
    failure: "biased sample misses target; case 3 makes the trade-off visible.",
    subtitle: "Coverage cannot cure bias — experiment 003",
    explanation: "Move the controls to see why biased sample misses target and how the measured response changes.",
    lesson: "Coverage cannot cure bias. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "confidence-factory-004",
    title: "mean processing time · case 004",
    scenario: "Investigate mean processing time under rare-event regime.",
    failure: "interval interpreted per sample; case 4 makes the trade-off visible.",
    subtitle: "Intervals describe procedures — experiment 004",
    explanation: "Move the controls to see why interval interpreted per sample and how the measured response changes.",
    lesson: "Intervals describe procedures. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "confidence-factory-005",
    title: "mean response estimate · case 005",
    scenario: "Investigate mean response estimate under high-dimensional setting.",
    failure: "optional stopping narrows claim; case 5 makes the trade-off visible.",
    subtitle: "Precision grows with information — experiment 005",
    explanation: "Move the controls to see why optional stopping narrows claim and how the measured response changes.",
    lesson: "Precision grows with information. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "confidence-factory-006",
    title: "conversion proportion · case 006",
    scenario: "Investigate conversion proportion under small clean sample.",
    failure: "biased sample misses target; case 6 makes the trade-off visible.",
    subtitle: "Coverage cannot cure bias — experiment 006",
    explanation: "Move the controls to see why biased sample misses target and how the measured response changes.",
    lesson: "Coverage cannot cure bias. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "confidence-factory-007",
    title: "model accuracy sample · case 007",
    scenario: "Investigate model accuracy sample under large noisy sample.",
    failure: "interval interpreted per sample; case 7 makes the trade-off visible.",
    subtitle: "Intervals describe procedures — experiment 007",
    explanation: "Move the controls to see why interval interpreted per sample and how the measured response changes.",
    lesson: "Intervals describe procedures. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "confidence-factory-008",
    title: "mean processing time · case 008",
    scenario: "Investigate mean processing time under shifted production slice.",
    failure: "optional stopping narrows claim; case 8 makes the trade-off visible.",
    subtitle: "Precision grows with information — experiment 008",
    explanation: "Move the controls to see why optional stopping narrows claim and how the measured response changes.",
    lesson: "Precision grows with information. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "confidence-factory-009",
    title: "mean response estimate · case 009",
    scenario: "Investigate mean response estimate under rare-event regime.",
    failure: "biased sample misses target; case 9 makes the trade-off visible.",
    subtitle: "Coverage cannot cure bias — experiment 009",
    explanation: "Move the controls to see why biased sample misses target and how the measured response changes.",
    lesson: "Coverage cannot cure bias. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "confidence-factory-010",
    title: "conversion proportion · case 010",
    scenario: "Investigate conversion proportion under high-dimensional setting.",
    failure: "interval interpreted per sample; case 10 makes the trade-off visible.",
    subtitle: "Intervals describe procedures — experiment 010",
    explanation: "Move the controls to see why interval interpreted per sample and how the measured response changes.",
    lesson: "Intervals describe procedures. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "confidence-factory-011",
    title: "model accuracy sample · case 011",
    scenario: "Investigate model accuracy sample under small clean sample.",
    failure: "optional stopping narrows claim; case 11 makes the trade-off visible.",
    subtitle: "Precision grows with information — experiment 011",
    explanation: "Move the controls to see why optional stopping narrows claim and how the measured response changes.",
    lesson: "Precision grows with information. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "confidence-factory-012",
    title: "mean processing time · case 012",
    scenario: "Investigate mean processing time under large noisy sample.",
    failure: "biased sample misses target; case 12 makes the trade-off visible.",
    subtitle: "Coverage cannot cure bias — experiment 012",
    explanation: "Move the controls to see why biased sample misses target and how the measured response changes.",
    lesson: "Coverage cannot cure bias. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function ConfidenceIntervalLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

