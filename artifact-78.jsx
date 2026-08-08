import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Decoding Strategy Arena",
  "kicker": "Generative AI interactive lab",
  "description": "Control generation, adaptation, multimodal behavior, evaluation, and safety with measurable trade-offs.",
  "mode": "timeline",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "hsl(238 72% 42%)",
    "secondary": "hsl(6 70% 42%)",
    "background": "hsl(238 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(238 30% 13%)",
    "muted": "hsl(238 14% 43%)",
    "line": "hsl(238 28% 86%)",
    "soft": "hsl(238 55% 92%)"
  },
  "controlTitle": "Decoding Strategy Arena controls",
  "controls": [
    {
      "label": "Temperature",
      "min": 0,
      "max": 100,
      "default": 38,
      "unit": "%",
      "help": "Tune temperature and observe system behavior."
    },
    {
      "label": "Top-p mass",
      "min": 0,
      "max": 100,
      "default": 58,
      "unit": "",
      "help": "Stress top-p mass across realistic operating ranges."
    },
    {
      "label": "Repetition penalty",
      "min": 0,
      "max": 100,
      "default": 34,
      "unit": "",
      "help": "Use repetition penalty to reveal boundary failures."
    }
  ],
  "visualTitle": "Decoding Strategy Arena live view",
  "metrics": [
    {
      "label": "Decoding score",
      "detail": "primary behavior"
    },
    {
      "label": "Strategy score",
      "detail": "robustness check"
    },
    {
      "label": "Arena score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "p′(x)=softmax(z/T)",
  "costScale": 0.75,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Decoding changes behavior",
      "body": "Principle 1: use this when reviewing decoding strategy arena behavior in production."
    },
    {
      "title": "Tune by task",
      "body": "Principle 2: use this when reviewing decoding strategy arena behavior in production."
    },
    {
      "title": "Evaluate distributions",
      "body": "Principle 3: use this when reviewing decoding strategy arena behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "decoding-strategies-001",
    title: "creative writing generation · case 001",
    scenario: "Investigate creative writing generation in a high-scale environment.",
    failure: "high temperature loses coherence; scenario 1 exposes the operational consequence.",
    subtitle: "Decoding changes behavior — experiment 001",
    explanation: "Adjust the controls to see how high temperature loses coherence changes system quality, cost, and confidence.",
    lesson: "Decoding changes behavior. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1021,
    sampleSize: 275,
    signal: 97
  },
  {
    id: "decoding-strategies-002",
    title: "factual summary output · case 002",
    scenario: "Investigate factual summary output in a small clean workload.",
    failure: "low temperature repeats pattern; scenario 2 exposes the operational consequence.",
    subtitle: "Tune by task — experiment 002",
    explanation: "Adjust the controls to see how low temperature repeats pattern changes system quality, cost, and confidence.",
    lesson: "Tune by task. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1028,
    sampleSize: 292,
    signal: 15
  },
  {
    id: "decoding-strategies-003",
    title: "code completion sampling · case 003",
    scenario: "Investigate code completion sampling in a large noisy workload.",
    failure: "top-p removes rare correct token; scenario 3 exposes the operational consequence.",
    subtitle: "Evaluate distributions — experiment 003",
    explanation: "Adjust the controls to see how top-p removes rare correct token changes system quality, cost, and confidence.",
    lesson: "Evaluate distributions. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1035,
    sampleSize: 309,
    signal: 34
  },
  {
    id: "decoding-strategies-004",
    title: "creative writing generation · case 004",
    scenario: "Investigate creative writing generation in a shifted production slice.",
    failure: "high temperature loses coherence; scenario 4 exposes the operational consequence.",
    subtitle: "Decoding changes behavior — experiment 004",
    explanation: "Adjust the controls to see how high temperature loses coherence changes system quality, cost, and confidence.",
    lesson: "Decoding changes behavior. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1042,
    sampleSize: 326,
    signal: 53
  },
  {
    id: "decoding-strategies-005",
    title: "factual summary output · case 005",
    scenario: "Investigate factual summary output in a rare failure regime.",
    failure: "low temperature repeats pattern; scenario 5 exposes the operational consequence.",
    subtitle: "Tune by task — experiment 005",
    explanation: "Adjust the controls to see how low temperature repeats pattern changes system quality, cost, and confidence.",
    lesson: "Tune by task. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1049,
    sampleSize: 343,
    signal: 72
  },
  {
    id: "decoding-strategies-006",
    title: "code completion sampling · case 006",
    scenario: "Investigate code completion sampling in a high-scale environment.",
    failure: "top-p removes rare correct token; scenario 6 exposes the operational consequence.",
    subtitle: "Evaluate distributions — experiment 006",
    explanation: "Adjust the controls to see how top-p removes rare correct token changes system quality, cost, and confidence.",
    lesson: "Evaluate distributions. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1056,
    sampleSize: 360,
    signal: 91
  },
  {
    id: "decoding-strategies-007",
    title: "creative writing generation · case 007",
    scenario: "Investigate creative writing generation in a small clean workload.",
    failure: "high temperature loses coherence; scenario 7 exposes the operational consequence.",
    subtitle: "Decoding changes behavior — experiment 007",
    explanation: "Adjust the controls to see how high temperature loses coherence changes system quality, cost, and confidence.",
    lesson: "Decoding changes behavior. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1063,
    sampleSize: 377,
    signal: 9
  },
  {
    id: "decoding-strategies-008",
    title: "factual summary output · case 008",
    scenario: "Investigate factual summary output in a large noisy workload.",
    failure: "low temperature repeats pattern; scenario 8 exposes the operational consequence.",
    subtitle: "Tune by task — experiment 008",
    explanation: "Adjust the controls to see how low temperature repeats pattern changes system quality, cost, and confidence.",
    lesson: "Tune by task. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1070,
    sampleSize: 394,
    signal: 28
  },
  {
    id: "decoding-strategies-009",
    title: "code completion sampling · case 009",
    scenario: "Investigate code completion sampling in a shifted production slice.",
    failure: "top-p removes rare correct token; scenario 9 exposes the operational consequence.",
    subtitle: "Evaluate distributions — experiment 009",
    explanation: "Adjust the controls to see how top-p removes rare correct token changes system quality, cost, and confidence.",
    lesson: "Evaluate distributions. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1077,
    sampleSize: 411,
    signal: 47
  },
  {
    id: "decoding-strategies-010",
    title: "creative writing generation · case 010",
    scenario: "Investigate creative writing generation in a rare failure regime.",
    failure: "high temperature loses coherence; scenario 10 exposes the operational consequence.",
    subtitle: "Decoding changes behavior — experiment 010",
    explanation: "Adjust the controls to see how high temperature loses coherence changes system quality, cost, and confidence.",
    lesson: "Decoding changes behavior. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1084,
    sampleSize: 428,
    signal: 66
  },
  {
    id: "decoding-strategies-011",
    title: "factual summary output · case 011",
    scenario: "Investigate factual summary output in a high-scale environment.",
    failure: "low temperature repeats pattern; scenario 11 exposes the operational consequence.",
    subtitle: "Tune by task — experiment 011",
    explanation: "Adjust the controls to see how low temperature repeats pattern changes system quality, cost, and confidence.",
    lesson: "Tune by task. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1091,
    sampleSize: 445,
    signal: 85
  },
  {
    id: "decoding-strategies-012",
    title: "code completion sampling · case 012",
    scenario: "Investigate code completion sampling in a small clean workload.",
    failure: "top-p removes rare correct token; scenario 12 exposes the operational consequence.",
    subtitle: "Evaluate distributions — experiment 012",
    explanation: "Adjust the controls to see how top-p removes rare correct token changes system quality, cost, and confidence.",
    lesson: "Evaluate distributions. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1098,
    sampleSize: 462,
    signal: 3
  }
];

export default function DecodingStrategyLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

