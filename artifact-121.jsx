import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Rate Limiting Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "curve",
  "variant": 3,
  "dark": false,
  "palette": {
    "primary": "hsl(99 72% 42%)",
    "secondary": "hsl(227 70% 42%)",
    "background": "hsl(99 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(99 30% 13%)",
    "muted": "hsl(99 14% 43%)",
    "line": "hsl(99 28% 86%)",
    "soft": "hsl(99 55% 92%)"
  },
  "controlTitle": "Rate Limiting Lab controls",
  "controls": [
    {
      "label": "Refill rate",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune refill rate and observe system behavior."
    },
    {
      "label": "Burst size",
      "min": 0,
      "max": 100,
      "default": 57,
      "unit": "",
      "help": "Stress burst size across realistic operating ranges."
    },
    {
      "label": "Client weight",
      "min": 0,
      "max": 100,
      "default": 26,
      "unit": "",
      "help": "Use client weight to reveal boundary failures."
    }
  ],
  "visualTitle": "Rate Limiting Lab live view",
  "metrics": [
    {
      "label": "Rate score",
      "detail": "primary behavior"
    },
    {
      "label": "Limiting score",
      "detail": "robustness check"
    },
    {
      "label": "Work units",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "tokens=min(B,tokens+rΔt)",
  "costScale": 0.8500000000000001,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Limit by scarce resource",
      "body": "Principle 1: use this when reviewing rate limiting lab behavior in production."
    },
    {
      "title": "Return retry guidance",
      "body": "Principle 2: use this when reviewing rate limiting lab behavior in production."
    },
    {
      "title": "Combine fairness and protection",
      "body": "Principle 3: use this when reviewing rate limiting lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "rate-limiting-001",
    title: "public REST API · case 001",
    scenario: "Investigate public REST API in a shifted production slice.",
    failure: "global limit punishes one tenant; scenario 1 exposes the operational consequence.",
    subtitle: "Limit by scarce resource — experiment 001",
    explanation: "Adjust the controls to see how global limit punishes one tenant changes system quality, cost, and confidence.",
    lesson: "Limit by scarce resource. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1580,
    sampleSize: 318,
    signal: 39
  },
  {
    id: "rate-limiting-002",
    title: "LLM gateway · case 002",
    scenario: "Investigate LLM gateway in a rare failure regime.",
    failure: "burst exhausts downstream; scenario 2 exposes the operational consequence.",
    subtitle: "Return retry guidance — experiment 002",
    explanation: "Adjust the controls to see how burst exhausts downstream changes system quality, cost, and confidence.",
    lesson: "Return retry guidance. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1587,
    sampleSize: 335,
    signal: 58
  },
  {
    id: "rate-limiting-003",
    title: "webhook receiver · case 003",
    scenario: "Investigate webhook receiver in a high-scale environment.",
    failure: "retry storm follows 429; scenario 3 exposes the operational consequence.",
    subtitle: "Combine fairness and protection — experiment 003",
    explanation: "Adjust the controls to see how retry storm follows 429 changes system quality, cost, and confidence.",
    lesson: "Combine fairness and protection. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1594,
    sampleSize: 352,
    signal: 77
  },
  {
    id: "rate-limiting-004",
    title: "public REST API · case 004",
    scenario: "Investigate public REST API in a small clean workload.",
    failure: "global limit punishes one tenant; scenario 4 exposes the operational consequence.",
    subtitle: "Limit by scarce resource — experiment 004",
    explanation: "Adjust the controls to see how global limit punishes one tenant changes system quality, cost, and confidence.",
    lesson: "Limit by scarce resource. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1601,
    sampleSize: 369,
    signal: 96
  },
  {
    id: "rate-limiting-005",
    title: "LLM gateway · case 005",
    scenario: "Investigate LLM gateway in a large noisy workload.",
    failure: "burst exhausts downstream; scenario 5 exposes the operational consequence.",
    subtitle: "Return retry guidance — experiment 005",
    explanation: "Adjust the controls to see how burst exhausts downstream changes system quality, cost, and confidence.",
    lesson: "Return retry guidance. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1608,
    sampleSize: 386,
    signal: 14
  },
  {
    id: "rate-limiting-006",
    title: "webhook receiver · case 006",
    scenario: "Investigate webhook receiver in a shifted production slice.",
    failure: "retry storm follows 429; scenario 6 exposes the operational consequence.",
    subtitle: "Combine fairness and protection — experiment 006",
    explanation: "Adjust the controls to see how retry storm follows 429 changes system quality, cost, and confidence.",
    lesson: "Combine fairness and protection. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1615,
    sampleSize: 403,
    signal: 33
  },
  {
    id: "rate-limiting-007",
    title: "public REST API · case 007",
    scenario: "Investigate public REST API in a rare failure regime.",
    failure: "global limit punishes one tenant; scenario 7 exposes the operational consequence.",
    subtitle: "Limit by scarce resource — experiment 007",
    explanation: "Adjust the controls to see how global limit punishes one tenant changes system quality, cost, and confidence.",
    lesson: "Limit by scarce resource. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1622,
    sampleSize: 420,
    signal: 52
  },
  {
    id: "rate-limiting-008",
    title: "LLM gateway · case 008",
    scenario: "Investigate LLM gateway in a high-scale environment.",
    failure: "burst exhausts downstream; scenario 8 exposes the operational consequence.",
    subtitle: "Return retry guidance — experiment 008",
    explanation: "Adjust the controls to see how burst exhausts downstream changes system quality, cost, and confidence.",
    lesson: "Return retry guidance. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1629,
    sampleSize: 437,
    signal: 71
  },
  {
    id: "rate-limiting-009",
    title: "webhook receiver · case 009",
    scenario: "Investigate webhook receiver in a small clean workload.",
    failure: "retry storm follows 429; scenario 9 exposes the operational consequence.",
    subtitle: "Combine fairness and protection — experiment 009",
    explanation: "Adjust the controls to see how retry storm follows 429 changes system quality, cost, and confidence.",
    lesson: "Combine fairness and protection. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1636,
    sampleSize: 454,
    signal: 90
  },
  {
    id: "rate-limiting-010",
    title: "public REST API · case 010",
    scenario: "Investigate public REST API in a large noisy workload.",
    failure: "global limit punishes one tenant; scenario 10 exposes the operational consequence.",
    subtitle: "Limit by scarce resource — experiment 010",
    explanation: "Adjust the controls to see how global limit punishes one tenant changes system quality, cost, and confidence.",
    lesson: "Limit by scarce resource. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1643,
    sampleSize: 471,
    signal: 8
  },
  {
    id: "rate-limiting-011",
    title: "LLM gateway · case 011",
    scenario: "Investigate LLM gateway in a shifted production slice.",
    failure: "burst exhausts downstream; scenario 11 exposes the operational consequence.",
    subtitle: "Return retry guidance — experiment 011",
    explanation: "Adjust the controls to see how burst exhausts downstream changes system quality, cost, and confidence.",
    lesson: "Return retry guidance. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1650,
    sampleSize: 488,
    signal: 27
  },
  {
    id: "rate-limiting-012",
    title: "webhook receiver · case 012",
    scenario: "Investigate webhook receiver in a rare failure regime.",
    failure: "retry storm follows 429; scenario 12 exposes the operational consequence.",
    subtitle: "Combine fairness and protection — experiment 012",
    explanation: "Adjust the controls to see how retry storm follows 429 changes system quality, cost, and confidence.",
    lesson: "Combine fairness and protection. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1657,
    sampleSize: 505,
    signal: 46
  }
];

export default function RateLimitingLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

