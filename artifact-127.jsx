import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Cost–Performance FinOps Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "network",
  "variant": 3,
  "dark": false,
  "palette": {
    "primary": "hsl(21 72% 42%)",
    "secondary": "hsl(149 70% 42%)",
    "background": "hsl(21 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(21 30% 13%)",
    "muted": "hsl(21 14% 43%)",
    "line": "hsl(21 28% 86%)",
    "soft": "hsl(21 55% 92%)"
  },
  "controlTitle": "Cost–Performance FinOps Lab controls",
  "controls": [
    {
      "label": "Provisioned capacity",
      "min": 0,
      "max": 100,
      "default": 48,
      "unit": "%",
      "help": "Tune provisioned capacity and observe system behavior."
    },
    {
      "label": "Latency target",
      "min": 0,
      "max": 100,
      "default": 63,
      "unit": "",
      "help": "Stress latency target across realistic operating ranges."
    },
    {
      "label": "Utilization",
      "min": 0,
      "max": 100,
      "default": 32,
      "unit": "",
      "help": "Use utilization to reveal boundary failures."
    }
  ],
  "visualTitle": "Cost–Performance FinOps Lab live view",
  "metrics": [
    {
      "label": "Cost score",
      "detail": "primary behavior"
    },
    {
      "label": "Performance score",
      "detail": "robustness check"
    },
    {
      "label": "FinOps score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "unit_cost=total_cost/useful_requests",
  "costScale": 0.75,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Optimize unit economics",
      "body": "Principle 1: use this when reviewing cost–performance finops lab behavior in production."
    },
    {
      "title": "Include quality constraints",
      "body": "Principle 2: use this when reviewing cost–performance finops lab behavior in production."
    },
    {
      "title": "Attribute shared cost",
      "body": "Principle 3: use this when reviewing cost–performance finops lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "cost-performance-001",
    title: "GPU inference platform · case 001",
    scenario: "Investigate GPU inference platform in a rare failure regime.",
    failure: "idle capacity dominates cost; scenario 1 exposes the operational consequence.",
    subtitle: "Optimize unit economics — experiment 001",
    explanation: "Adjust the controls to see how idle capacity dominates cost changes system quality, cost, and confidence.",
    lesson: "Optimize unit economics. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1658,
    sampleSize: 324,
    signal: 45
  },
  {
    id: "cost-performance-002",
    title: "data processing cluster · case 002",
    scenario: "Investigate data processing cluster in a high-scale environment.",
    failure: "cheap tier violates latency; scenario 2 exposes the operational consequence.",
    subtitle: "Include quality constraints — experiment 002",
    explanation: "Adjust the controls to see how cheap tier violates latency changes system quality, cost, and confidence.",
    lesson: "Include quality constraints. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1665,
    sampleSize: 341,
    signal: 64
  },
  {
    id: "cost-performance-003",
    title: "high-traffic API · case 003",
    scenario: "Investigate high-traffic API in a small clean workload.",
    failure: "unit metric ignores quality; scenario 3 exposes the operational consequence.",
    subtitle: "Attribute shared cost — experiment 003",
    explanation: "Adjust the controls to see how unit metric ignores quality changes system quality, cost, and confidence.",
    lesson: "Attribute shared cost. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1672,
    sampleSize: 358,
    signal: 83
  },
  {
    id: "cost-performance-004",
    title: "GPU inference platform · case 004",
    scenario: "Investigate GPU inference platform in a large noisy workload.",
    failure: "idle capacity dominates cost; scenario 4 exposes the operational consequence.",
    subtitle: "Optimize unit economics — experiment 004",
    explanation: "Adjust the controls to see how idle capacity dominates cost changes system quality, cost, and confidence.",
    lesson: "Optimize unit economics. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1679,
    sampleSize: 375,
    signal: 1
  },
  {
    id: "cost-performance-005",
    title: "data processing cluster · case 005",
    scenario: "Investigate data processing cluster in a shifted production slice.",
    failure: "cheap tier violates latency; scenario 5 exposes the operational consequence.",
    subtitle: "Include quality constraints — experiment 005",
    explanation: "Adjust the controls to see how cheap tier violates latency changes system quality, cost, and confidence.",
    lesson: "Include quality constraints. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1686,
    sampleSize: 392,
    signal: 20
  },
  {
    id: "cost-performance-006",
    title: "high-traffic API · case 006",
    scenario: "Investigate high-traffic API in a rare failure regime.",
    failure: "unit metric ignores quality; scenario 6 exposes the operational consequence.",
    subtitle: "Attribute shared cost — experiment 006",
    explanation: "Adjust the controls to see how unit metric ignores quality changes system quality, cost, and confidence.",
    lesson: "Attribute shared cost. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1693,
    sampleSize: 409,
    signal: 39
  },
  {
    id: "cost-performance-007",
    title: "GPU inference platform · case 007",
    scenario: "Investigate GPU inference platform in a high-scale environment.",
    failure: "idle capacity dominates cost; scenario 7 exposes the operational consequence.",
    subtitle: "Optimize unit economics — experiment 007",
    explanation: "Adjust the controls to see how idle capacity dominates cost changes system quality, cost, and confidence.",
    lesson: "Optimize unit economics. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1700,
    sampleSize: 426,
    signal: 58
  },
  {
    id: "cost-performance-008",
    title: "data processing cluster · case 008",
    scenario: "Investigate data processing cluster in a small clean workload.",
    failure: "cheap tier violates latency; scenario 8 exposes the operational consequence.",
    subtitle: "Include quality constraints — experiment 008",
    explanation: "Adjust the controls to see how cheap tier violates latency changes system quality, cost, and confidence.",
    lesson: "Include quality constraints. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1707,
    sampleSize: 443,
    signal: 77
  },
  {
    id: "cost-performance-009",
    title: "high-traffic API · case 009",
    scenario: "Investigate high-traffic API in a large noisy workload.",
    failure: "unit metric ignores quality; scenario 9 exposes the operational consequence.",
    subtitle: "Attribute shared cost — experiment 009",
    explanation: "Adjust the controls to see how unit metric ignores quality changes system quality, cost, and confidence.",
    lesson: "Attribute shared cost. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1714,
    sampleSize: 460,
    signal: 96
  },
  {
    id: "cost-performance-010",
    title: "GPU inference platform · case 010",
    scenario: "Investigate GPU inference platform in a shifted production slice.",
    failure: "idle capacity dominates cost; scenario 10 exposes the operational consequence.",
    subtitle: "Optimize unit economics — experiment 010",
    explanation: "Adjust the controls to see how idle capacity dominates cost changes system quality, cost, and confidence.",
    lesson: "Optimize unit economics. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1721,
    sampleSize: 477,
    signal: 14
  },
  {
    id: "cost-performance-011",
    title: "data processing cluster · case 011",
    scenario: "Investigate data processing cluster in a rare failure regime.",
    failure: "cheap tier violates latency; scenario 11 exposes the operational consequence.",
    subtitle: "Include quality constraints — experiment 011",
    explanation: "Adjust the controls to see how cheap tier violates latency changes system quality, cost, and confidence.",
    lesson: "Include quality constraints. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1728,
    sampleSize: 494,
    signal: 33
  },
  {
    id: "cost-performance-012",
    title: "high-traffic API · case 012",
    scenario: "Investigate high-traffic API in a high-scale environment.",
    failure: "unit metric ignores quality; scenario 12 exposes the operational consequence.",
    subtitle: "Attribute shared cost — experiment 012",
    explanation: "Adjust the controls to see how unit metric ignores quality changes system quality, cost, and confidence.",
    lesson: "Attribute shared cost. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1735,
    sampleSize: 511,
    signal: 52
  }
];

export default function CostPerformanceFinopsLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

