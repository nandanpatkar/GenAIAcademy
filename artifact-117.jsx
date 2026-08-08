import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Feature Flag Lifecycle Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "matrix",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "hsl(271 72% 42%)",
    "secondary": "hsl(39 70% 42%)",
    "background": "hsl(271 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(271 30% 13%)",
    "muted": "hsl(271 14% 43%)",
    "line": "hsl(271 28% 86%)",
    "soft": "hsl(271 55% 92%)"
  },
  "controlTitle": "Feature Flag Lifecycle Lab controls",
  "controls": [
    {
      "label": "Rollout percent",
      "min": 0,
      "max": 100,
      "default": 38,
      "unit": "%",
      "help": "Tune rollout percent and observe system behavior."
    },
    {
      "label": "Target rules",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress target rules across realistic operating ranges."
    },
    {
      "label": "Flag age",
      "min": 0,
      "max": 100,
      "default": 39,
      "unit": "",
      "help": "Use flag age to reveal boundary failures."
    }
  ],
  "visualTitle": "Feature Flag Lifecycle Lab live view",
  "metrics": [
    {
      "label": "Feature score",
      "detail": "primary behavior"
    },
    {
      "label": "Flag score",
      "detail": "robustness check"
    },
    {
      "label": "Lifecycle score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "enabled=user∈target∧flag_on",
  "costScale": 1.15,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Flags need owners",
      "body": "Principle 1: use this when reviewing feature flag lifecycle lab behavior in production."
    },
    {
      "title": "Test both branches",
      "body": "Principle 2: use this when reviewing feature flag lifecycle lab behavior in production."
    },
    {
      "title": "Remove completed flags",
      "body": "Principle 3: use this when reviewing feature flag lifecycle lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "feature-flags-001",
    title: "new ranking feature · case 001",
    scenario: "Investigate new ranking feature in a rare failure regime.",
    failure: "flag combinations explode; scenario 1 exposes the operational consequence.",
    subtitle: "Flags need owners — experiment 001",
    explanation: "Adjust the controls to see how flag combinations explode changes system quality, cost, and confidence.",
    lesson: "Flags need owners. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1528,
    sampleSize: 314,
    signal: 35
  },
  {
    id: "feature-flags-002",
    title: "payment workflow change · case 002",
    scenario: "Investigate payment workflow change in a high-scale environment.",
    failure: "stale flag becomes permanent; scenario 2 exposes the operational consequence.",
    subtitle: "Test both branches — experiment 002",
    explanation: "Adjust the controls to see how stale flag becomes permanent changes system quality, cost, and confidence.",
    lesson: "Test both branches. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1535,
    sampleSize: 331,
    signal: 54
  },
  {
    id: "feature-flags-003",
    title: "UI experiment · case 003",
    scenario: "Investigate UI experiment in a small clean workload.",
    failure: "targeting leaks sensitive trait; scenario 3 exposes the operational consequence.",
    subtitle: "Remove completed flags — experiment 003",
    explanation: "Adjust the controls to see how targeting leaks sensitive trait changes system quality, cost, and confidence.",
    lesson: "Remove completed flags. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1542,
    sampleSize: 348,
    signal: 73
  },
  {
    id: "feature-flags-004",
    title: "new ranking feature · case 004",
    scenario: "Investigate new ranking feature in a large noisy workload.",
    failure: "flag combinations explode; scenario 4 exposes the operational consequence.",
    subtitle: "Flags need owners — experiment 004",
    explanation: "Adjust the controls to see how flag combinations explode changes system quality, cost, and confidence.",
    lesson: "Flags need owners. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1549,
    sampleSize: 365,
    signal: 92
  },
  {
    id: "feature-flags-005",
    title: "payment workflow change · case 005",
    scenario: "Investigate payment workflow change in a shifted production slice.",
    failure: "stale flag becomes permanent; scenario 5 exposes the operational consequence.",
    subtitle: "Test both branches — experiment 005",
    explanation: "Adjust the controls to see how stale flag becomes permanent changes system quality, cost, and confidence.",
    lesson: "Test both branches. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1556,
    sampleSize: 382,
    signal: 10
  },
  {
    id: "feature-flags-006",
    title: "UI experiment · case 006",
    scenario: "Investigate UI experiment in a rare failure regime.",
    failure: "targeting leaks sensitive trait; scenario 6 exposes the operational consequence.",
    subtitle: "Remove completed flags — experiment 006",
    explanation: "Adjust the controls to see how targeting leaks sensitive trait changes system quality, cost, and confidence.",
    lesson: "Remove completed flags. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1563,
    sampleSize: 399,
    signal: 29
  },
  {
    id: "feature-flags-007",
    title: "new ranking feature · case 007",
    scenario: "Investigate new ranking feature in a high-scale environment.",
    failure: "flag combinations explode; scenario 7 exposes the operational consequence.",
    subtitle: "Flags need owners — experiment 007",
    explanation: "Adjust the controls to see how flag combinations explode changes system quality, cost, and confidence.",
    lesson: "Flags need owners. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1570,
    sampleSize: 416,
    signal: 48
  },
  {
    id: "feature-flags-008",
    title: "payment workflow change · case 008",
    scenario: "Investigate payment workflow change in a small clean workload.",
    failure: "stale flag becomes permanent; scenario 8 exposes the operational consequence.",
    subtitle: "Test both branches — experiment 008",
    explanation: "Adjust the controls to see how stale flag becomes permanent changes system quality, cost, and confidence.",
    lesson: "Test both branches. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1577,
    sampleSize: 433,
    signal: 67
  },
  {
    id: "feature-flags-009",
    title: "UI experiment · case 009",
    scenario: "Investigate UI experiment in a large noisy workload.",
    failure: "targeting leaks sensitive trait; scenario 9 exposes the operational consequence.",
    subtitle: "Remove completed flags — experiment 009",
    explanation: "Adjust the controls to see how targeting leaks sensitive trait changes system quality, cost, and confidence.",
    lesson: "Remove completed flags. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1584,
    sampleSize: 450,
    signal: 86
  },
  {
    id: "feature-flags-010",
    title: "new ranking feature · case 010",
    scenario: "Investigate new ranking feature in a shifted production slice.",
    failure: "flag combinations explode; scenario 10 exposes the operational consequence.",
    subtitle: "Flags need owners — experiment 010",
    explanation: "Adjust the controls to see how flag combinations explode changes system quality, cost, and confidence.",
    lesson: "Flags need owners. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1591,
    sampleSize: 467,
    signal: 4
  },
  {
    id: "feature-flags-011",
    title: "payment workflow change · case 011",
    scenario: "Investigate payment workflow change in a rare failure regime.",
    failure: "stale flag becomes permanent; scenario 11 exposes the operational consequence.",
    subtitle: "Test both branches — experiment 011",
    explanation: "Adjust the controls to see how stale flag becomes permanent changes system quality, cost, and confidence.",
    lesson: "Test both branches. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1598,
    sampleSize: 484,
    signal: 23
  },
  {
    id: "feature-flags-012",
    title: "UI experiment · case 012",
    scenario: "Investigate UI experiment in a high-scale environment.",
    failure: "targeting leaks sensitive trait; scenario 12 exposes the operational consequence.",
    subtitle: "Remove completed flags — experiment 012",
    explanation: "Adjust the controls to see how targeting leaks sensitive trait changes system quality, cost, and confidence.",
    lesson: "Remove completed flags. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1605,
    sampleSize: 501,
    signal: 42
  }
];

export default function FeatureFlagLifecycleLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

