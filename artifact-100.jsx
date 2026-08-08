import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Agent Memory Policy Lab",
  "kicker": "Agent systems interactive lab",
  "description": "Design controlled agent execution with explicit state, tools, authority, budgets, and recovery behavior.",
  "mode": "network",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "hsl(192 72% 42%)",
    "secondary": "hsl(320 70% 42%)",
    "background": "hsl(192 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(192 30% 13%)",
    "muted": "hsl(192 14% 43%)",
    "line": "hsl(192 28% 86%)",
    "soft": "hsl(192 55% 92%)"
  },
  "controlTitle": "Agent Memory Policy Lab controls",
  "controls": [
    {
      "label": "Retention horizon",
      "min": 0,
      "max": 100,
      "default": 47,
      "unit": "%",
      "help": "Tune retention horizon and observe system behavior."
    },
    {
      "label": "Utility threshold",
      "min": 0,
      "max": 100,
      "default": 58,
      "unit": "",
      "help": "Stress utility threshold across realistic operating ranges."
    },
    {
      "label": "Privacy weight",
      "min": 0,
      "max": 100,
      "default": 39,
      "unit": "",
      "help": "Use privacy weight to reveal boundary failures."
    }
  ],
  "visualTitle": "Agent Memory Policy Lab live view",
  "metrics": [
    {
      "label": "Agent score",
      "detail": "primary behavior"
    },
    {
      "label": "Memory score",
      "detail": "robustness check"
    },
    {
      "label": "Policy score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "store=utility−privacy−staleness",
  "costScale": 0.8500000000000001,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Memory needs policy",
      "body": "Principle 1: use this when reviewing agent memory policy lab behavior in production."
    },
    {
      "title": "Make revision possible",
      "body": "Principle 2: use this when reviewing agent memory policy lab behavior in production."
    },
    {
      "title": "Separate facts and summaries",
      "body": "Principle 3: use this when reviewing agent memory policy lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "memory-policy-001",
    title: "personal assistant memory · case 001",
    scenario: "Investigate personal assistant memory in a large noisy workload.",
    failure: "sensitive fact is retained; scenario 1 exposes the operational consequence.",
    subtitle: "Memory needs policy — experiment 001",
    explanation: "Adjust the controls to see how sensitive fact is retained changes system quality, cost, and confidence.",
    lesson: "Memory needs policy. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1307,
    sampleSize: 297,
    signal: 18
  },
  {
    id: "memory-policy-002",
    title: "coding agent preferences · case 002",
    scenario: "Investigate coding agent preferences in a shifted production slice.",
    failure: "stale preference persists; scenario 2 exposes the operational consequence.",
    subtitle: "Make revision possible — experiment 002",
    explanation: "Adjust the controls to see how stale preference persists changes system quality, cost, and confidence.",
    lesson: "Make revision possible. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1314,
    sampleSize: 314,
    signal: 37
  },
  {
    id: "memory-policy-003",
    title: "customer support history · case 003",
    scenario: "Investigate customer support history in a rare failure regime.",
    failure: "memory overwhelms context; scenario 3 exposes the operational consequence.",
    subtitle: "Separate facts and summaries — experiment 003",
    explanation: "Adjust the controls to see how memory overwhelms context changes system quality, cost, and confidence.",
    lesson: "Separate facts and summaries. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1321,
    sampleSize: 331,
    signal: 56
  },
  {
    id: "memory-policy-004",
    title: "personal assistant memory · case 004",
    scenario: "Investigate personal assistant memory in a high-scale environment.",
    failure: "sensitive fact is retained; scenario 4 exposes the operational consequence.",
    subtitle: "Memory needs policy — experiment 004",
    explanation: "Adjust the controls to see how sensitive fact is retained changes system quality, cost, and confidence.",
    lesson: "Memory needs policy. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1328,
    sampleSize: 348,
    signal: 75
  },
  {
    id: "memory-policy-005",
    title: "coding agent preferences · case 005",
    scenario: "Investigate coding agent preferences in a small clean workload.",
    failure: "stale preference persists; scenario 5 exposes the operational consequence.",
    subtitle: "Make revision possible — experiment 005",
    explanation: "Adjust the controls to see how stale preference persists changes system quality, cost, and confidence.",
    lesson: "Make revision possible. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1335,
    sampleSize: 365,
    signal: 94
  },
  {
    id: "memory-policy-006",
    title: "customer support history · case 006",
    scenario: "Investigate customer support history in a large noisy workload.",
    failure: "memory overwhelms context; scenario 6 exposes the operational consequence.",
    subtitle: "Separate facts and summaries — experiment 006",
    explanation: "Adjust the controls to see how memory overwhelms context changes system quality, cost, and confidence.",
    lesson: "Separate facts and summaries. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1342,
    sampleSize: 382,
    signal: 12
  },
  {
    id: "memory-policy-007",
    title: "personal assistant memory · case 007",
    scenario: "Investigate personal assistant memory in a shifted production slice.",
    failure: "sensitive fact is retained; scenario 7 exposes the operational consequence.",
    subtitle: "Memory needs policy — experiment 007",
    explanation: "Adjust the controls to see how sensitive fact is retained changes system quality, cost, and confidence.",
    lesson: "Memory needs policy. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1349,
    sampleSize: 399,
    signal: 31
  },
  {
    id: "memory-policy-008",
    title: "coding agent preferences · case 008",
    scenario: "Investigate coding agent preferences in a rare failure regime.",
    failure: "stale preference persists; scenario 8 exposes the operational consequence.",
    subtitle: "Make revision possible — experiment 008",
    explanation: "Adjust the controls to see how stale preference persists changes system quality, cost, and confidence.",
    lesson: "Make revision possible. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1356,
    sampleSize: 416,
    signal: 50
  },
  {
    id: "memory-policy-009",
    title: "customer support history · case 009",
    scenario: "Investigate customer support history in a high-scale environment.",
    failure: "memory overwhelms context; scenario 9 exposes the operational consequence.",
    subtitle: "Separate facts and summaries — experiment 009",
    explanation: "Adjust the controls to see how memory overwhelms context changes system quality, cost, and confidence.",
    lesson: "Separate facts and summaries. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1363,
    sampleSize: 433,
    signal: 69
  },
  {
    id: "memory-policy-010",
    title: "personal assistant memory · case 010",
    scenario: "Investigate personal assistant memory in a small clean workload.",
    failure: "sensitive fact is retained; scenario 10 exposes the operational consequence.",
    subtitle: "Memory needs policy — experiment 010",
    explanation: "Adjust the controls to see how sensitive fact is retained changes system quality, cost, and confidence.",
    lesson: "Memory needs policy. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1370,
    sampleSize: 450,
    signal: 88
  },
  {
    id: "memory-policy-011",
    title: "coding agent preferences · case 011",
    scenario: "Investigate coding agent preferences in a large noisy workload.",
    failure: "stale preference persists; scenario 11 exposes the operational consequence.",
    subtitle: "Make revision possible — experiment 011",
    explanation: "Adjust the controls to see how stale preference persists changes system quality, cost, and confidence.",
    lesson: "Make revision possible. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1377,
    sampleSize: 467,
    signal: 6
  },
  {
    id: "memory-policy-012",
    title: "customer support history · case 012",
    scenario: "Investigate customer support history in a shifted production slice.",
    failure: "memory overwhelms context; scenario 12 exposes the operational consequence.",
    subtitle: "Separate facts and summaries — experiment 012",
    explanation: "Adjust the controls to see how memory overwhelms context changes system quality, cost, and confidence.",
    lesson: "Separate facts and summaries. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1384,
    sampleSize: 484,
    signal: 25
  }
];

export default function AgentMemoryPolicyLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

