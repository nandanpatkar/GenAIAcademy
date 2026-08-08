import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Sampling Bias Simulator",
  "kicker": "Statistics & probability interactive lab",
  "description": "Build statistical intuition by changing assumptions, sampling regimes, and uncertainty controls in real time.",
  "mode": "grid",
  "variant": 3,
  "dark": false,
  "palette": {
    "primary": "#0f766e",
    "secondary": "#c026d3",
    "background": "#f0fdfa",
    "panel": "#ffffff",
    "ink": "#15302d",
    "muted": "#687f7c",
    "line": "#d4e6e2",
    "soft": "#ccfbf1"
  },
  "controlTitle": "Sampling Bias Simulator controls",
  "controls": [
    {
      "label": "Coverage rate",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune coverage rate and observe how the experiment responds."
    },
    {
      "label": "Response propensity",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing response propensity."
    },
    {
      "label": "Sample size",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use sample size to expose boundary behavior."
    }
  ],
  "visualTitle": "Sampling Bias Simulator live view",
  "metrics": [
    {
      "label": "Representativeness",
      "detail": "primary behavior"
    },
    {
      "label": "Bias gap",
      "detail": "robustness check"
    },
    {
      "label": "Respondents",
      "detail": "resource demand"
    },
    {
      "label": "Survey trust",
      "detail": "decision quality"
    }
  ],
  "formula": "bias(x̄)=E[x̄]−μ",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Selection precedes inference",
      "body": "Principle 1: apply this idea when reviewing sampling bias simulator results."
    },
    {
      "title": "Large biased samples stay biased",
      "body": "Principle 2: apply this idea when reviewing sampling bias simulator results."
    },
    {
      "title": "Weighting needs measured drivers",
      "body": "Principle 3: apply this idea when reviewing sampling bias simulator results."
    }
  ]
};

const CASES = [
  {
    id: "sampling-bias-001",
    title: "online opinion poll · case 001",
    scenario: "Investigate online opinion poll under small clean sample.",
    failure: "frame excludes population; case 1 makes the trade-off visible.",
    subtitle: "Selection precedes inference — experiment 001",
    explanation: "Move the controls to see why frame excludes population and how the measured response changes.",
    lesson: "Selection precedes inference. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "sampling-bias-002",
    title: "employee engagement survey · case 002",
    scenario: "Investigate employee engagement survey under large noisy sample.",
    failure: "nonresponse follows outcome; case 2 makes the trade-off visible.",
    subtitle: "Large biased samples stay biased — experiment 002",
    explanation: "Move the controls to see why nonresponse follows outcome and how the measured response changes.",
    lesson: "Large biased samples stay biased. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "sampling-bias-003",
    title: "health prevalence study · case 003",
    scenario: "Investigate health prevalence study under shifted production slice.",
    failure: "convenience sample overstates; case 3 makes the trade-off visible.",
    subtitle: "Weighting needs measured drivers — experiment 003",
    explanation: "Move the controls to see why convenience sample overstates and how the measured response changes.",
    lesson: "Weighting needs measured drivers. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "sampling-bias-004",
    title: "product satisfaction sample · case 004",
    scenario: "Investigate product satisfaction sample under rare-event regime.",
    failure: "frame excludes population; case 4 makes the trade-off visible.",
    subtitle: "Selection precedes inference — experiment 004",
    explanation: "Move the controls to see why frame excludes population and how the measured response changes.",
    lesson: "Selection precedes inference. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "sampling-bias-005",
    title: "online opinion poll · case 005",
    scenario: "Investigate online opinion poll under high-dimensional setting.",
    failure: "nonresponse follows outcome; case 5 makes the trade-off visible.",
    subtitle: "Large biased samples stay biased — experiment 005",
    explanation: "Move the controls to see why nonresponse follows outcome and how the measured response changes.",
    lesson: "Large biased samples stay biased. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "sampling-bias-006",
    title: "employee engagement survey · case 006",
    scenario: "Investigate employee engagement survey under small clean sample.",
    failure: "convenience sample overstates; case 6 makes the trade-off visible.",
    subtitle: "Weighting needs measured drivers — experiment 006",
    explanation: "Move the controls to see why convenience sample overstates and how the measured response changes.",
    lesson: "Weighting needs measured drivers. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "sampling-bias-007",
    title: "health prevalence study · case 007",
    scenario: "Investigate health prevalence study under large noisy sample.",
    failure: "frame excludes population; case 7 makes the trade-off visible.",
    subtitle: "Selection precedes inference — experiment 007",
    explanation: "Move the controls to see why frame excludes population and how the measured response changes.",
    lesson: "Selection precedes inference. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "sampling-bias-008",
    title: "product satisfaction sample · case 008",
    scenario: "Investigate product satisfaction sample under shifted production slice.",
    failure: "nonresponse follows outcome; case 8 makes the trade-off visible.",
    subtitle: "Large biased samples stay biased — experiment 008",
    explanation: "Move the controls to see why nonresponse follows outcome and how the measured response changes.",
    lesson: "Large biased samples stay biased. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "sampling-bias-009",
    title: "online opinion poll · case 009",
    scenario: "Investigate online opinion poll under rare-event regime.",
    failure: "convenience sample overstates; case 9 makes the trade-off visible.",
    subtitle: "Weighting needs measured drivers — experiment 009",
    explanation: "Move the controls to see why convenience sample overstates and how the measured response changes.",
    lesson: "Weighting needs measured drivers. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "sampling-bias-010",
    title: "employee engagement survey · case 010",
    scenario: "Investigate employee engagement survey under high-dimensional setting.",
    failure: "frame excludes population; case 10 makes the trade-off visible.",
    subtitle: "Selection precedes inference — experiment 010",
    explanation: "Move the controls to see why frame excludes population and how the measured response changes.",
    lesson: "Selection precedes inference. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "sampling-bias-011",
    title: "health prevalence study · case 011",
    scenario: "Investigate health prevalence study under small clean sample.",
    failure: "nonresponse follows outcome; case 11 makes the trade-off visible.",
    subtitle: "Large biased samples stay biased — experiment 011",
    explanation: "Move the controls to see why nonresponse follows outcome and how the measured response changes.",
    lesson: "Large biased samples stay biased. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "sampling-bias-012",
    title: "product satisfaction sample · case 012",
    scenario: "Investigate product satisfaction sample under large noisy sample.",
    failure: "convenience sample overstates; case 12 makes the trade-off visible.",
    subtitle: "Weighting needs measured drivers — experiment 012",
    explanation: "Move the controls to see why convenience sample overstates and how the measured response changes.",
    lesson: "Weighting needs measured drivers. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function SamplingBiasLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

