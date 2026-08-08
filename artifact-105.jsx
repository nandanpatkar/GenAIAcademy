import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Agent Budget Controller",
  "kicker": "Agent systems interactive lab",
  "description": "Design controlled agent execution with explicit state, tools, authority, budgets, and recovery behavior.",
  "mode": "timeline",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "hsl(67 72% 42%)",
    "secondary": "hsl(195 70% 42%)",
    "background": "hsl(67 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(67 30% 13%)",
    "muted": "hsl(67 14% 43%)",
    "line": "hsl(67 28% 86%)",
    "soft": "hsl(67 55% 92%)"
  },
  "controlTitle": "Agent Budget Controller controls",
  "controls": [
    {
      "label": "Token budget",
      "min": 0,
      "max": 100,
      "default": 39,
      "unit": "%",
      "help": "Tune token budget and observe system behavior."
    },
    {
      "label": "Tool limit",
      "min": 0,
      "max": 100,
      "default": 63,
      "unit": "",
      "help": "Stress tool limit across realistic operating ranges."
    },
    {
      "label": "Time horizon",
      "min": 0,
      "max": 100,
      "default": 27,
      "unit": "",
      "help": "Use time horizon to reveal boundary failures."
    }
  ],
  "visualTitle": "Agent Budget Controller live view",
  "metrics": [
    {
      "label": "Agent score",
      "detail": "primary behavior"
    },
    {
      "label": "Budget score",
      "detail": "robustness check"
    },
    {
      "label": "Controller score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "utility≤token+time+tool budgets",
  "costScale": 0.65,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Allocate budget by stage",
      "body": "Principle 1: use this when reviewing agent budget controller behavior in production."
    },
    {
      "title": "Reserve for verification",
      "body": "Principle 2: use this when reviewing agent budget controller behavior in production."
    },
    {
      "title": "Stop with useful partial state",
      "body": "Principle 3: use this when reviewing agent budget controller behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "agent-budget-001",
    title: "deep research agent · case 001",
    scenario: "Investigate deep research agent in a large noisy workload.",
    failure: "agent spends budget on low value; scenario 1 exposes the operational consequence.",
    subtitle: "Allocate budget by stage — experiment 001",
    explanation: "Adjust the controls to see how agent spends budget on low value changes system quality, cost, and confidence.",
    lesson: "Allocate budget by stage. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1372,
    sampleSize: 302,
    signal: 23
  },
  {
    id: "agent-budget-002",
    title: "coding repair agent · case 002",
    scenario: "Investigate coding repair agent in a shifted production slice.",
    failure: "tool loop never converges; scenario 2 exposes the operational consequence.",
    subtitle: "Reserve for verification — experiment 002",
    explanation: "Adjust the controls to see how tool loop never converges changes system quality, cost, and confidence.",
    lesson: "Reserve for verification. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1379,
    sampleSize: 319,
    signal: 42
  },
  {
    id: "agent-budget-003",
    title: "travel planning workflow · case 003",
    scenario: "Investigate travel planning workflow in a rare failure regime.",
    failure: "deadline interrupts side effect; scenario 3 exposes the operational consequence.",
    subtitle: "Stop with useful partial state — experiment 003",
    explanation: "Adjust the controls to see how deadline interrupts side effect changes system quality, cost, and confidence.",
    lesson: "Stop with useful partial state. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1386,
    sampleSize: 336,
    signal: 61
  },
  {
    id: "agent-budget-004",
    title: "deep research agent · case 004",
    scenario: "Investigate deep research agent in a high-scale environment.",
    failure: "agent spends budget on low value; scenario 4 exposes the operational consequence.",
    subtitle: "Allocate budget by stage — experiment 004",
    explanation: "Adjust the controls to see how agent spends budget on low value changes system quality, cost, and confidence.",
    lesson: "Allocate budget by stage. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1393,
    sampleSize: 353,
    signal: 80
  },
  {
    id: "agent-budget-005",
    title: "coding repair agent · case 005",
    scenario: "Investigate coding repair agent in a small clean workload.",
    failure: "tool loop never converges; scenario 5 exposes the operational consequence.",
    subtitle: "Reserve for verification — experiment 005",
    explanation: "Adjust the controls to see how tool loop never converges changes system quality, cost, and confidence.",
    lesson: "Reserve for verification. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1400,
    sampleSize: 370,
    signal: 99
  },
  {
    id: "agent-budget-006",
    title: "travel planning workflow · case 006",
    scenario: "Investigate travel planning workflow in a large noisy workload.",
    failure: "deadline interrupts side effect; scenario 6 exposes the operational consequence.",
    subtitle: "Stop with useful partial state — experiment 006",
    explanation: "Adjust the controls to see how deadline interrupts side effect changes system quality, cost, and confidence.",
    lesson: "Stop with useful partial state. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1407,
    sampleSize: 387,
    signal: 17
  },
  {
    id: "agent-budget-007",
    title: "deep research agent · case 007",
    scenario: "Investigate deep research agent in a shifted production slice.",
    failure: "agent spends budget on low value; scenario 7 exposes the operational consequence.",
    subtitle: "Allocate budget by stage — experiment 007",
    explanation: "Adjust the controls to see how agent spends budget on low value changes system quality, cost, and confidence.",
    lesson: "Allocate budget by stage. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1414,
    sampleSize: 404,
    signal: 36
  },
  {
    id: "agent-budget-008",
    title: "coding repair agent · case 008",
    scenario: "Investigate coding repair agent in a rare failure regime.",
    failure: "tool loop never converges; scenario 8 exposes the operational consequence.",
    subtitle: "Reserve for verification — experiment 008",
    explanation: "Adjust the controls to see how tool loop never converges changes system quality, cost, and confidence.",
    lesson: "Reserve for verification. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1421,
    sampleSize: 421,
    signal: 55
  },
  {
    id: "agent-budget-009",
    title: "travel planning workflow · case 009",
    scenario: "Investigate travel planning workflow in a high-scale environment.",
    failure: "deadline interrupts side effect; scenario 9 exposes the operational consequence.",
    subtitle: "Stop with useful partial state — experiment 009",
    explanation: "Adjust the controls to see how deadline interrupts side effect changes system quality, cost, and confidence.",
    lesson: "Stop with useful partial state. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1428,
    sampleSize: 438,
    signal: 74
  },
  {
    id: "agent-budget-010",
    title: "deep research agent · case 010",
    scenario: "Investigate deep research agent in a small clean workload.",
    failure: "agent spends budget on low value; scenario 10 exposes the operational consequence.",
    subtitle: "Allocate budget by stage — experiment 010",
    explanation: "Adjust the controls to see how agent spends budget on low value changes system quality, cost, and confidence.",
    lesson: "Allocate budget by stage. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1435,
    sampleSize: 455,
    signal: 93
  },
  {
    id: "agent-budget-011",
    title: "coding repair agent · case 011",
    scenario: "Investigate coding repair agent in a large noisy workload.",
    failure: "tool loop never converges; scenario 11 exposes the operational consequence.",
    subtitle: "Reserve for verification — experiment 011",
    explanation: "Adjust the controls to see how tool loop never converges changes system quality, cost, and confidence.",
    lesson: "Reserve for verification. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1442,
    sampleSize: 472,
    signal: 11
  },
  {
    id: "agent-budget-012",
    title: "travel planning workflow · case 012",
    scenario: "Investigate travel planning workflow in a shifted production slice.",
    failure: "deadline interrupts side effect; scenario 12 exposes the operational consequence.",
    subtitle: "Stop with useful partial state — experiment 012",
    explanation: "Adjust the controls to see how deadline interrupts side effect changes system quality, cost, and confidence.",
    lesson: "Stop with useful partial state. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1449,
    sampleSize: 489,
    signal: 30
  }
];

export default function AgentBudgetControllerLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

