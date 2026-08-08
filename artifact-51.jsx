import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Bayes Rule Evidence Lab",
  "kicker": "Statistics & probability interactive lab",
  "description": "Build statistical intuition by changing assumptions, sampling regimes, and uncertainty controls in real time.",
  "mode": "tree",
  "variant": 0,
  "dark": true,
  "palette": {
    "primary": "#38bdf8",
    "secondary": "#fbbf24",
    "background": "#07131b",
    "panel": "#0d2633",
    "ink": "#e0f2fe",
    "muted": "#8fa9b8",
    "line": "#22485d",
    "soft": "#153747"
  },
  "controlTitle": "Bayes Rule Evidence Lab controls",
  "controls": [
    {
      "label": "Prior probability",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune prior probability and observe how the experiment responds."
    },
    {
      "label": "Test sensitivity",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing test sensitivity."
    },
    {
      "label": "False positive rate",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use false positive rate to expose boundary behavior."
    }
  ],
  "visualTitle": "Bayes Rule Evidence Lab live view",
  "metrics": [
    {
      "label": "Posterior",
      "detail": "primary behavior"
    },
    {
      "label": "Evidence lift",
      "detail": "robustness check"
    },
    {
      "label": "Cases",
      "detail": "resource demand"
    },
    {
      "label": "Belief confidence",
      "detail": "decision quality"
    }
  ],
  "formula": "P(H|E)=P(E|H)P(H)/P(E)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Priors matter most when rare",
      "body": "Principle 1: apply this idea when reviewing bayes rule evidence lab results."
    },
    {
      "title": "Likelihood updates belief",
      "body": "Principle 2: apply this idea when reviewing bayes rule evidence lab results."
    },
    {
      "title": "Communicate natural frequencies",
      "body": "Principle 3: apply this idea when reviewing bayes rule evidence lab results."
    }
  ]
};

const CASES = [
  {
    id: "bayes-rule-001",
    title: "rare disease screening · case 001",
    scenario: "Investigate rare disease screening under small clean sample.",
    failure: "base rate is ignored; case 1 makes the trade-off visible.",
    subtitle: "Priors matter most when rare — experiment 001",
    explanation: "Move the controls to see why base rate is ignored and how the measured response changes.",
    lesson: "Priors matter most when rare. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "bayes-rule-002",
    title: "fraud transaction flag · case 002",
    scenario: "Investigate fraud transaction flag under large noisy sample.",
    failure: "test accuracy is conflated; case 2 makes the trade-off visible.",
    subtitle: "Likelihood updates belief — experiment 002",
    explanation: "Move the controls to see why test accuracy is conflated and how the measured response changes.",
    lesson: "Likelihood updates belief. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "bayes-rule-003",
    title: "spam message filter · case 003",
    scenario: "Investigate spam message filter under shifted production slice.",
    failure: "evidence counted twice; case 3 makes the trade-off visible.",
    subtitle: "Communicate natural frequencies — experiment 003",
    explanation: "Move the controls to see why evidence counted twice and how the measured response changes.",
    lesson: "Communicate natural frequencies. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "bayes-rule-004",
    title: "quality control test · case 004",
    scenario: "Investigate quality control test under rare-event regime.",
    failure: "base rate is ignored; case 4 makes the trade-off visible.",
    subtitle: "Priors matter most when rare — experiment 004",
    explanation: "Move the controls to see why base rate is ignored and how the measured response changes.",
    lesson: "Priors matter most when rare. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "bayes-rule-005",
    title: "rare disease screening · case 005",
    scenario: "Investigate rare disease screening under high-dimensional setting.",
    failure: "test accuracy is conflated; case 5 makes the trade-off visible.",
    subtitle: "Likelihood updates belief — experiment 005",
    explanation: "Move the controls to see why test accuracy is conflated and how the measured response changes.",
    lesson: "Likelihood updates belief. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "bayes-rule-006",
    title: "fraud transaction flag · case 006",
    scenario: "Investigate fraud transaction flag under small clean sample.",
    failure: "evidence counted twice; case 6 makes the trade-off visible.",
    subtitle: "Communicate natural frequencies — experiment 006",
    explanation: "Move the controls to see why evidence counted twice and how the measured response changes.",
    lesson: "Communicate natural frequencies. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "bayes-rule-007",
    title: "spam message filter · case 007",
    scenario: "Investigate spam message filter under large noisy sample.",
    failure: "base rate is ignored; case 7 makes the trade-off visible.",
    subtitle: "Priors matter most when rare — experiment 007",
    explanation: "Move the controls to see why base rate is ignored and how the measured response changes.",
    lesson: "Priors matter most when rare. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "bayes-rule-008",
    title: "quality control test · case 008",
    scenario: "Investigate quality control test under shifted production slice.",
    failure: "test accuracy is conflated; case 8 makes the trade-off visible.",
    subtitle: "Likelihood updates belief — experiment 008",
    explanation: "Move the controls to see why test accuracy is conflated and how the measured response changes.",
    lesson: "Likelihood updates belief. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "bayes-rule-009",
    title: "rare disease screening · case 009",
    scenario: "Investigate rare disease screening under rare-event regime.",
    failure: "evidence counted twice; case 9 makes the trade-off visible.",
    subtitle: "Communicate natural frequencies — experiment 009",
    explanation: "Move the controls to see why evidence counted twice and how the measured response changes.",
    lesson: "Communicate natural frequencies. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "bayes-rule-010",
    title: "fraud transaction flag · case 010",
    scenario: "Investigate fraud transaction flag under high-dimensional setting.",
    failure: "base rate is ignored; case 10 makes the trade-off visible.",
    subtitle: "Priors matter most when rare — experiment 010",
    explanation: "Move the controls to see why base rate is ignored and how the measured response changes.",
    lesson: "Priors matter most when rare. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "bayes-rule-011",
    title: "spam message filter · case 011",
    scenario: "Investigate spam message filter under small clean sample.",
    failure: "test accuracy is conflated; case 11 makes the trade-off visible.",
    subtitle: "Likelihood updates belief — experiment 011",
    explanation: "Move the controls to see why test accuracy is conflated and how the measured response changes.",
    lesson: "Likelihood updates belief. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "bayes-rule-012",
    title: "quality control test · case 012",
    scenario: "Investigate quality control test under large noisy sample.",
    failure: "evidence counted twice; case 12 makes the trade-off visible.",
    subtitle: "Communicate natural frequencies — experiment 012",
    explanation: "Move the controls to see why evidence counted twice and how the measured response changes.",
    lesson: "Communicate natural frequencies. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function BayesRuleLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

