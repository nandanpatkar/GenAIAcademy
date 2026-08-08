import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Agent Approval Gate Lab",
  "kicker": "Agent systems interactive lab",
  "description": "Design controlled agent execution with explicit state, tools, authority, budgets, and recovery behavior.",
  "mode": "curve",
  "variant": 3,
  "dark": false,
  "palette": {
    "primary": "hsl(333 72% 42%)",
    "secondary": "hsl(101 70% 42%)",
    "background": "hsl(333 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(333 30% 13%)",
    "muted": "hsl(333 14% 43%)",
    "line": "hsl(333 28% 86%)",
    "soft": "hsl(333 55% 92%)"
  },
  "controlTitle": "Agent Approval Gate Lab controls",
  "controls": [
    {
      "label": "Risk threshold",
      "min": 0,
      "max": 100,
      "default": 50,
      "unit": "%",
      "help": "Tune risk threshold and observe system behavior."
    },
    {
      "label": "Approval timeout",
      "min": 0,
      "max": 100,
      "default": 61,
      "unit": "",
      "help": "Stress approval timeout across realistic operating ranges."
    },
    {
      "label": "Scope breadth",
      "min": 0,
      "max": 100,
      "default": 25,
      "unit": "",
      "help": "Use scope breadth to reveal boundary failures."
    }
  ],
  "visualTitle": "Agent Approval Gate Lab live view",
  "metrics": [
    {
      "label": "Agent score",
      "detail": "primary behavior"
    },
    {
      "label": "Approval score",
      "detail": "robustness check"
    },
    {
      "label": "Gate score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "execute=approved∧within_scope",
  "costScale": 1.15,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Show the proposed action",
      "body": "Principle 1: use this when reviewing agent approval gate lab behavior in production."
    },
    {
      "title": "Fail closed for consequence",
      "body": "Principle 2: use this when reviewing agent approval gate lab behavior in production."
    },
    {
      "title": "Log decisions",
      "body": "Principle 3: use this when reviewing agent approval gate lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "approval-gates-001",
    title: "email sending agent · case 001",
    scenario: "Investigate email sending agent in a high-scale environment.",
    failure: "low-risk flood causes fatigue; scenario 1 exposes the operational consequence.",
    subtitle: "Show the proposed action — experiment 001",
    explanation: "Adjust the controls to see how low-risk flood causes fatigue changes system quality, cost, and confidence.",
    lesson: "Show the proposed action. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1346,
    sampleSize: 300,
    signal: 21
  },
  {
    id: "approval-gates-002",
    title: "infrastructure change agent · case 002",
    scenario: "Investigate infrastructure change agent in a small clean workload.",
    failure: "approval lacks exact diff; scenario 2 exposes the operational consequence.",
    subtitle: "Fail closed for consequence — experiment 002",
    explanation: "Adjust the controls to see how approval lacks exact diff changes system quality, cost, and confidence.",
    lesson: "Fail closed for consequence. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1353,
    sampleSize: 317,
    signal: 40
  },
  {
    id: "approval-gates-003",
    title: "financial action assistant · case 003",
    scenario: "Investigate financial action assistant in a large noisy workload.",
    failure: "timeout defaults to execute; scenario 3 exposes the operational consequence.",
    subtitle: "Log decisions — experiment 003",
    explanation: "Adjust the controls to see how timeout defaults to execute changes system quality, cost, and confidence.",
    lesson: "Log decisions. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1360,
    sampleSize: 334,
    signal: 59
  },
  {
    id: "approval-gates-004",
    title: "email sending agent · case 004",
    scenario: "Investigate email sending agent in a shifted production slice.",
    failure: "low-risk flood causes fatigue; scenario 4 exposes the operational consequence.",
    subtitle: "Show the proposed action — experiment 004",
    explanation: "Adjust the controls to see how low-risk flood causes fatigue changes system quality, cost, and confidence.",
    lesson: "Show the proposed action. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1367,
    sampleSize: 351,
    signal: 78
  },
  {
    id: "approval-gates-005",
    title: "infrastructure change agent · case 005",
    scenario: "Investigate infrastructure change agent in a rare failure regime.",
    failure: "approval lacks exact diff; scenario 5 exposes the operational consequence.",
    subtitle: "Fail closed for consequence — experiment 005",
    explanation: "Adjust the controls to see how approval lacks exact diff changes system quality, cost, and confidence.",
    lesson: "Fail closed for consequence. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1374,
    sampleSize: 368,
    signal: 97
  },
  {
    id: "approval-gates-006",
    title: "financial action assistant · case 006",
    scenario: "Investigate financial action assistant in a high-scale environment.",
    failure: "timeout defaults to execute; scenario 6 exposes the operational consequence.",
    subtitle: "Log decisions — experiment 006",
    explanation: "Adjust the controls to see how timeout defaults to execute changes system quality, cost, and confidence.",
    lesson: "Log decisions. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1381,
    sampleSize: 385,
    signal: 15
  },
  {
    id: "approval-gates-007",
    title: "email sending agent · case 007",
    scenario: "Investigate email sending agent in a small clean workload.",
    failure: "low-risk flood causes fatigue; scenario 7 exposes the operational consequence.",
    subtitle: "Show the proposed action — experiment 007",
    explanation: "Adjust the controls to see how low-risk flood causes fatigue changes system quality, cost, and confidence.",
    lesson: "Show the proposed action. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1388,
    sampleSize: 402,
    signal: 34
  },
  {
    id: "approval-gates-008",
    title: "infrastructure change agent · case 008",
    scenario: "Investigate infrastructure change agent in a large noisy workload.",
    failure: "approval lacks exact diff; scenario 8 exposes the operational consequence.",
    subtitle: "Fail closed for consequence — experiment 008",
    explanation: "Adjust the controls to see how approval lacks exact diff changes system quality, cost, and confidence.",
    lesson: "Fail closed for consequence. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1395,
    sampleSize: 419,
    signal: 53
  },
  {
    id: "approval-gates-009",
    title: "financial action assistant · case 009",
    scenario: "Investigate financial action assistant in a shifted production slice.",
    failure: "timeout defaults to execute; scenario 9 exposes the operational consequence.",
    subtitle: "Log decisions — experiment 009",
    explanation: "Adjust the controls to see how timeout defaults to execute changes system quality, cost, and confidence.",
    lesson: "Log decisions. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1402,
    sampleSize: 436,
    signal: 72
  },
  {
    id: "approval-gates-010",
    title: "email sending agent · case 010",
    scenario: "Investigate email sending agent in a rare failure regime.",
    failure: "low-risk flood causes fatigue; scenario 10 exposes the operational consequence.",
    subtitle: "Show the proposed action — experiment 010",
    explanation: "Adjust the controls to see how low-risk flood causes fatigue changes system quality, cost, and confidence.",
    lesson: "Show the proposed action. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1409,
    sampleSize: 453,
    signal: 91
  },
  {
    id: "approval-gates-011",
    title: "infrastructure change agent · case 011",
    scenario: "Investigate infrastructure change agent in a high-scale environment.",
    failure: "approval lacks exact diff; scenario 11 exposes the operational consequence.",
    subtitle: "Fail closed for consequence — experiment 011",
    explanation: "Adjust the controls to see how approval lacks exact diff changes system quality, cost, and confidence.",
    lesson: "Fail closed for consequence. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1416,
    sampleSize: 470,
    signal: 9
  },
  {
    id: "approval-gates-012",
    title: "financial action assistant · case 012",
    scenario: "Investigate financial action assistant in a small clean workload.",
    failure: "timeout defaults to execute; scenario 12 exposes the operational consequence.",
    subtitle: "Log decisions — experiment 012",
    explanation: "Adjust the controls to see how timeout defaults to execute changes system quality, cost, and confidence.",
    lesson: "Log decisions. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1423,
    sampleSize: 487,
    signal: 28
  }
];

export default function AgentApprovalGateLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

