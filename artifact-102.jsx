import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Agent State Machine Lab",
  "kicker": "Agent systems interactive lab",
  "description": "Design controlled agent execution with explicit state, tools, authority, budgets, and recovery behavior.",
  "mode": "distribution",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "hsl(286 72% 42%)",
    "secondary": "hsl(54 70% 42%)",
    "background": "hsl(286 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(286 30% 13%)",
    "muted": "hsl(286 14% 43%)",
    "line": "hsl(286 28% 86%)",
    "soft": "hsl(286 55% 92%)"
  },
  "controlTitle": "Agent State Machine Lab controls",
  "controls": [
    {
      "label": "State count",
      "min": 0,
      "max": 100,
      "default": 49,
      "unit": "%",
      "help": "Tune state count and observe system behavior."
    },
    {
      "label": "Transition guard",
      "min": 0,
      "max": 100,
      "default": 60,
      "unit": "",
      "help": "Stress transition guard across realistic operating ranges."
    },
    {
      "label": "Timeout length",
      "min": 0,
      "max": 100,
      "default": 24,
      "unit": "",
      "help": "Use timeout length to reveal boundary failures."
    }
  ],
  "visualTitle": "Agent State Machine Lab live view",
  "metrics": [
    {
      "label": "Agent score",
      "detail": "primary behavior"
    },
    {
      "label": "State score",
      "detail": "robustness check"
    },
    {
      "label": "Machine score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "sₜ₊₁=δ(sₜ,event)",
  "costScale": 1.05,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Make states explicit",
      "body": "Principle 1: use this when reviewing agent state machine lab behavior in production."
    },
    {
      "title": "Guard side effects",
      "body": "Principle 2: use this when reviewing agent state machine lab behavior in production."
    },
    {
      "title": "Design recovery transitions",
      "body": "Principle 3: use this when reviewing agent state machine lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "agent-state-machine-001",
    title: "approval workflow agent · case 001",
    scenario: "Investigate approval workflow agent in a rare failure regime.",
    failure: "illegal transition skips review; scenario 1 exposes the operational consequence.",
    subtitle: "Make states explicit — experiment 001",
    explanation: "Adjust the controls to see how illegal transition skips review changes system quality, cost, and confidence.",
    lesson: "Make states explicit. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1333,
    sampleSize: 299,
    signal: 20
  },
  {
    id: "agent-state-machine-002",
    title: "support resolution agent · case 002",
    scenario: "Investigate support resolution agent in a high-scale environment.",
    failure: "timeout duplicates action; scenario 2 exposes the operational consequence.",
    subtitle: "Guard side effects — experiment 002",
    explanation: "Adjust the controls to see how timeout duplicates action changes system quality, cost, and confidence.",
    lesson: "Guard side effects. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1340,
    sampleSize: 316,
    signal: 39
  },
  {
    id: "agent-state-machine-003",
    title: "document processing agent · case 003",
    scenario: "Investigate document processing agent in a small clean workload.",
    failure: "terminal state is unclear; scenario 3 exposes the operational consequence.",
    subtitle: "Design recovery transitions — experiment 003",
    explanation: "Adjust the controls to see how terminal state is unclear changes system quality, cost, and confidence.",
    lesson: "Design recovery transitions. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1347,
    sampleSize: 333,
    signal: 58
  },
  {
    id: "agent-state-machine-004",
    title: "approval workflow agent · case 004",
    scenario: "Investigate approval workflow agent in a large noisy workload.",
    failure: "illegal transition skips review; scenario 4 exposes the operational consequence.",
    subtitle: "Make states explicit — experiment 004",
    explanation: "Adjust the controls to see how illegal transition skips review changes system quality, cost, and confidence.",
    lesson: "Make states explicit. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1354,
    sampleSize: 350,
    signal: 77
  },
  {
    id: "agent-state-machine-005",
    title: "support resolution agent · case 005",
    scenario: "Investigate support resolution agent in a shifted production slice.",
    failure: "timeout duplicates action; scenario 5 exposes the operational consequence.",
    subtitle: "Guard side effects — experiment 005",
    explanation: "Adjust the controls to see how timeout duplicates action changes system quality, cost, and confidence.",
    lesson: "Guard side effects. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1361,
    sampleSize: 367,
    signal: 96
  },
  {
    id: "agent-state-machine-006",
    title: "document processing agent · case 006",
    scenario: "Investigate document processing agent in a rare failure regime.",
    failure: "terminal state is unclear; scenario 6 exposes the operational consequence.",
    subtitle: "Design recovery transitions — experiment 006",
    explanation: "Adjust the controls to see how terminal state is unclear changes system quality, cost, and confidence.",
    lesson: "Design recovery transitions. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1368,
    sampleSize: 384,
    signal: 14
  },
  {
    id: "agent-state-machine-007",
    title: "approval workflow agent · case 007",
    scenario: "Investigate approval workflow agent in a high-scale environment.",
    failure: "illegal transition skips review; scenario 7 exposes the operational consequence.",
    subtitle: "Make states explicit — experiment 007",
    explanation: "Adjust the controls to see how illegal transition skips review changes system quality, cost, and confidence.",
    lesson: "Make states explicit. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1375,
    sampleSize: 401,
    signal: 33
  },
  {
    id: "agent-state-machine-008",
    title: "support resolution agent · case 008",
    scenario: "Investigate support resolution agent in a small clean workload.",
    failure: "timeout duplicates action; scenario 8 exposes the operational consequence.",
    subtitle: "Guard side effects — experiment 008",
    explanation: "Adjust the controls to see how timeout duplicates action changes system quality, cost, and confidence.",
    lesson: "Guard side effects. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1382,
    sampleSize: 418,
    signal: 52
  },
  {
    id: "agent-state-machine-009",
    title: "document processing agent · case 009",
    scenario: "Investigate document processing agent in a large noisy workload.",
    failure: "terminal state is unclear; scenario 9 exposes the operational consequence.",
    subtitle: "Design recovery transitions — experiment 009",
    explanation: "Adjust the controls to see how terminal state is unclear changes system quality, cost, and confidence.",
    lesson: "Design recovery transitions. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1389,
    sampleSize: 435,
    signal: 71
  },
  {
    id: "agent-state-machine-010",
    title: "approval workflow agent · case 010",
    scenario: "Investigate approval workflow agent in a shifted production slice.",
    failure: "illegal transition skips review; scenario 10 exposes the operational consequence.",
    subtitle: "Make states explicit — experiment 010",
    explanation: "Adjust the controls to see how illegal transition skips review changes system quality, cost, and confidence.",
    lesson: "Make states explicit. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1396,
    sampleSize: 452,
    signal: 90
  },
  {
    id: "agent-state-machine-011",
    title: "support resolution agent · case 011",
    scenario: "Investigate support resolution agent in a rare failure regime.",
    failure: "timeout duplicates action; scenario 11 exposes the operational consequence.",
    subtitle: "Guard side effects — experiment 011",
    explanation: "Adjust the controls to see how timeout duplicates action changes system quality, cost, and confidence.",
    lesson: "Guard side effects. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1403,
    sampleSize: 469,
    signal: 8
  },
  {
    id: "agent-state-machine-012",
    title: "document processing agent · case 012",
    scenario: "Investigate document processing agent in a high-scale environment.",
    failure: "terminal state is unclear; scenario 12 exposes the operational consequence.",
    subtitle: "Design recovery transitions — experiment 012",
    explanation: "Adjust the controls to see how terminal state is unclear changes system quality, cost, and confidence.",
    lesson: "Design recovery transitions. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1410,
    sampleSize: 486,
    signal: 27
  }
];

export default function AgentStateMachineLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

