import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Structured Generation Validator",
  "kicker": "Generative AI interactive lab",
  "description": "Control generation, adaptation, multimodal behavior, evaluation, and safety with measurable trade-offs.",
  "mode": "matrix",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "hsl(19 72% 42%)",
    "secondary": "hsl(147 70% 42%)",
    "background": "hsl(19 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(19 30% 13%)",
    "muted": "hsl(19 14% 43%)",
    "line": "hsl(19 28% 86%)",
    "soft": "hsl(19 55% 92%)"
  },
  "controlTitle": "Structured Generation Validator controls",
  "controls": [
    {
      "label": "Schema depth",
      "min": 0,
      "max": 100,
      "default": 41,
      "unit": "%",
      "help": "Tune schema depth and observe system behavior."
    },
    {
      "label": "Repair attempts",
      "min": 0,
      "max": 100,
      "default": 61,
      "unit": "",
      "help": "Stress repair attempts across realistic operating ranges."
    },
    {
      "label": "Constraint strictness",
      "min": 0,
      "max": 100,
      "default": 37,
      "unit": "",
      "help": "Use constraint strictness to reveal boundary failures."
    }
  ],
  "visualTitle": "Structured Generation Validator live view",
  "metrics": [
    {
      "label": "Structured score",
      "detail": "primary behavior"
    },
    {
      "label": "Generation score",
      "detail": "robustness check"
    },
    {
      "label": "Validator score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "y∈Language(schema)",
  "costScale": 1.05,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Validate semantics too",
      "body": "Principle 1: use this when reviewing structured generation validator behavior in production."
    },
    {
      "title": "Bound repair loops",
      "body": "Principle 2: use this when reviewing structured generation validator behavior in production."
    },
    {
      "title": "Design simple schemas",
      "body": "Principle 3: use this when reviewing structured generation validator behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "structured-generation-001",
    title: "invoice JSON extraction · case 001",
    scenario: "Investigate invoice JSON extraction in a shifted production slice.",
    failure: "valid JSON violates schema; scenario 1 exposes the operational consequence.",
    subtitle: "Validate semantics too — experiment 001",
    explanation: "Adjust the controls to see how valid JSON violates schema changes system quality, cost, and confidence.",
    lesson: "Validate semantics too. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1060,
    sampleSize: 278,
    signal: 100
  },
  {
    id: "structured-generation-002",
    title: "tool argument generation · case 002",
    scenario: "Investigate tool argument generation in a rare failure regime.",
    failure: "repair changes meaning; scenario 2 exposes the operational consequence.",
    subtitle: "Bound repair loops — experiment 002",
    explanation: "Adjust the controls to see how repair changes meaning changes system quality, cost, and confidence.",
    lesson: "Bound repair loops. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1067,
    sampleSize: 295,
    signal: 18
  },
  {
    id: "structured-generation-003",
    title: "typed report builder · case 003",
    scenario: "Investigate typed report builder in a high-scale environment.",
    failure: "strict grammar blocks answer; scenario 3 exposes the operational consequence.",
    subtitle: "Design simple schemas — experiment 003",
    explanation: "Adjust the controls to see how strict grammar blocks answer changes system quality, cost, and confidence.",
    lesson: "Design simple schemas. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1074,
    sampleSize: 312,
    signal: 37
  },
  {
    id: "structured-generation-004",
    title: "invoice JSON extraction · case 004",
    scenario: "Investigate invoice JSON extraction in a small clean workload.",
    failure: "valid JSON violates schema; scenario 4 exposes the operational consequence.",
    subtitle: "Validate semantics too — experiment 004",
    explanation: "Adjust the controls to see how valid JSON violates schema changes system quality, cost, and confidence.",
    lesson: "Validate semantics too. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1081,
    sampleSize: 329,
    signal: 56
  },
  {
    id: "structured-generation-005",
    title: "tool argument generation · case 005",
    scenario: "Investigate tool argument generation in a large noisy workload.",
    failure: "repair changes meaning; scenario 5 exposes the operational consequence.",
    subtitle: "Bound repair loops — experiment 005",
    explanation: "Adjust the controls to see how repair changes meaning changes system quality, cost, and confidence.",
    lesson: "Bound repair loops. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1088,
    sampleSize: 346,
    signal: 75
  },
  {
    id: "structured-generation-006",
    title: "typed report builder · case 006",
    scenario: "Investigate typed report builder in a shifted production slice.",
    failure: "strict grammar blocks answer; scenario 6 exposes the operational consequence.",
    subtitle: "Design simple schemas — experiment 006",
    explanation: "Adjust the controls to see how strict grammar blocks answer changes system quality, cost, and confidence.",
    lesson: "Design simple schemas. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1095,
    sampleSize: 363,
    signal: 94
  },
  {
    id: "structured-generation-007",
    title: "invoice JSON extraction · case 007",
    scenario: "Investigate invoice JSON extraction in a rare failure regime.",
    failure: "valid JSON violates schema; scenario 7 exposes the operational consequence.",
    subtitle: "Validate semantics too — experiment 007",
    explanation: "Adjust the controls to see how valid JSON violates schema changes system quality, cost, and confidence.",
    lesson: "Validate semantics too. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1102,
    sampleSize: 380,
    signal: 12
  },
  {
    id: "structured-generation-008",
    title: "tool argument generation · case 008",
    scenario: "Investigate tool argument generation in a high-scale environment.",
    failure: "repair changes meaning; scenario 8 exposes the operational consequence.",
    subtitle: "Bound repair loops — experiment 008",
    explanation: "Adjust the controls to see how repair changes meaning changes system quality, cost, and confidence.",
    lesson: "Bound repair loops. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1109,
    sampleSize: 397,
    signal: 31
  },
  {
    id: "structured-generation-009",
    title: "typed report builder · case 009",
    scenario: "Investigate typed report builder in a small clean workload.",
    failure: "strict grammar blocks answer; scenario 9 exposes the operational consequence.",
    subtitle: "Design simple schemas — experiment 009",
    explanation: "Adjust the controls to see how strict grammar blocks answer changes system quality, cost, and confidence.",
    lesson: "Design simple schemas. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1116,
    sampleSize: 414,
    signal: 50
  },
  {
    id: "structured-generation-010",
    title: "invoice JSON extraction · case 010",
    scenario: "Investigate invoice JSON extraction in a large noisy workload.",
    failure: "valid JSON violates schema; scenario 10 exposes the operational consequence.",
    subtitle: "Validate semantics too — experiment 010",
    explanation: "Adjust the controls to see how valid JSON violates schema changes system quality, cost, and confidence.",
    lesson: "Validate semantics too. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1123,
    sampleSize: 431,
    signal: 69
  },
  {
    id: "structured-generation-011",
    title: "tool argument generation · case 011",
    scenario: "Investigate tool argument generation in a shifted production slice.",
    failure: "repair changes meaning; scenario 11 exposes the operational consequence.",
    subtitle: "Bound repair loops — experiment 011",
    explanation: "Adjust the controls to see how repair changes meaning changes system quality, cost, and confidence.",
    lesson: "Bound repair loops. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1130,
    sampleSize: 448,
    signal: 88
  },
  {
    id: "structured-generation-012",
    title: "typed report builder · case 012",
    scenario: "Investigate typed report builder in a rare failure regime.",
    failure: "strict grammar blocks answer; scenario 12 exposes the operational consequence.",
    subtitle: "Design simple schemas — experiment 012",
    explanation: "Adjust the controls to see how strict grammar blocks answer changes system quality, cost, and confidence.",
    lesson: "Design simple schemas. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1137,
    sampleSize: 465,
    signal: 6
  }
];

export default function StructuredGenerationValidatorLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

