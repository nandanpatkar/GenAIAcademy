import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Agent Planning Search Lab",
  "kicker": "Agent systems interactive lab",
  "description": "Design controlled agent execution with explicit state, tools, authority, budgets, and recovery behavior.",
  "mode": "matrix",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "hsl(145 72% 42%)",
    "secondary": "hsl(273 70% 42%)",
    "background": "hsl(145 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(145 30% 13%)",
    "muted": "hsl(145 14% 43%)",
    "line": "hsl(145 28% 86%)",
    "soft": "hsl(145 55% 92%)"
  },
  "controlTitle": "Agent Planning Search Lab controls",
  "controls": [
    {
      "label": "Plan depth",
      "min": 0,
      "max": 100,
      "default": 46,
      "unit": "%",
      "help": "Tune plan depth and observe system behavior."
    },
    {
      "label": "Branch factor",
      "min": 0,
      "max": 100,
      "default": 57,
      "unit": "",
      "help": "Stress branch factor across realistic operating ranges."
    },
    {
      "label": "Replan threshold",
      "min": 0,
      "max": 100,
      "default": 38,
      "unit": "",
      "help": "Use replan threshold to reveal boundary failures."
    }
  ],
  "visualTitle": "Agent Planning Search Lab live view",
  "metrics": [
    {
      "label": "Agent score",
      "detail": "primary behavior"
    },
    {
      "label": "Planning score",
      "detail": "robustness check"
    },
    {
      "label": "Search score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "plan*=argmin cost(plan|goal,state)",
  "costScale": 0.75,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Plans are hypotheses",
      "body": "Principle 1: use this when reviewing agent planning search lab behavior in production."
    },
    {
      "title": "Observe before replanning",
      "body": "Principle 2: use this when reviewing agent planning search lab behavior in production."
    },
    {
      "title": "Bound search",
      "body": "Principle 3: use this when reviewing agent planning search lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "agent-planning-001",
    title: "research workflow · case 001",
    scenario: "Investigate research workflow in a small clean workload.",
    failure: "planner decomposes endlessly; scenario 1 exposes the operational consequence.",
    subtitle: "Plans are hypotheses — experiment 001",
    explanation: "Adjust the controls to see how planner decomposes endlessly changes system quality, cost, and confidence.",
    lesson: "Plans are hypotheses. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1294,
    sampleSize: 296,
    signal: 17
  },
  {
    id: "agent-planning-002",
    title: "incident diagnosis plan · case 002",
    scenario: "Investigate incident diagnosis plan in a large noisy workload.",
    failure: "plan ignores observed state; scenario 2 exposes the operational consequence.",
    subtitle: "Observe before replanning — experiment 002",
    explanation: "Adjust the controls to see how plan ignores observed state changes system quality, cost, and confidence.",
    lesson: "Observe before replanning. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1301,
    sampleSize: 313,
    signal: 36
  },
  {
    id: "agent-planning-003",
    title: "data migration task · case 003",
    scenario: "Investigate data migration task in a shifted production slice.",
    failure: "replanning thrashes; scenario 3 exposes the operational consequence.",
    subtitle: "Bound search — experiment 003",
    explanation: "Adjust the controls to see how replanning thrashes changes system quality, cost, and confidence.",
    lesson: "Bound search. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1308,
    sampleSize: 330,
    signal: 55
  },
  {
    id: "agent-planning-004",
    title: "research workflow · case 004",
    scenario: "Investigate research workflow in a rare failure regime.",
    failure: "planner decomposes endlessly; scenario 4 exposes the operational consequence.",
    subtitle: "Plans are hypotheses — experiment 004",
    explanation: "Adjust the controls to see how planner decomposes endlessly changes system quality, cost, and confidence.",
    lesson: "Plans are hypotheses. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1315,
    sampleSize: 347,
    signal: 74
  },
  {
    id: "agent-planning-005",
    title: "incident diagnosis plan · case 005",
    scenario: "Investigate incident diagnosis plan in a high-scale environment.",
    failure: "plan ignores observed state; scenario 5 exposes the operational consequence.",
    subtitle: "Observe before replanning — experiment 005",
    explanation: "Adjust the controls to see how plan ignores observed state changes system quality, cost, and confidence.",
    lesson: "Observe before replanning. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1322,
    sampleSize: 364,
    signal: 93
  },
  {
    id: "agent-planning-006",
    title: "data migration task · case 006",
    scenario: "Investigate data migration task in a small clean workload.",
    failure: "replanning thrashes; scenario 6 exposes the operational consequence.",
    subtitle: "Bound search — experiment 006",
    explanation: "Adjust the controls to see how replanning thrashes changes system quality, cost, and confidence.",
    lesson: "Bound search. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1329,
    sampleSize: 381,
    signal: 11
  },
  {
    id: "agent-planning-007",
    title: "research workflow · case 007",
    scenario: "Investigate research workflow in a large noisy workload.",
    failure: "planner decomposes endlessly; scenario 7 exposes the operational consequence.",
    subtitle: "Plans are hypotheses — experiment 007",
    explanation: "Adjust the controls to see how planner decomposes endlessly changes system quality, cost, and confidence.",
    lesson: "Plans are hypotheses. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1336,
    sampleSize: 398,
    signal: 30
  },
  {
    id: "agent-planning-008",
    title: "incident diagnosis plan · case 008",
    scenario: "Investigate incident diagnosis plan in a shifted production slice.",
    failure: "plan ignores observed state; scenario 8 exposes the operational consequence.",
    subtitle: "Observe before replanning — experiment 008",
    explanation: "Adjust the controls to see how plan ignores observed state changes system quality, cost, and confidence.",
    lesson: "Observe before replanning. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1343,
    sampleSize: 415,
    signal: 49
  },
  {
    id: "agent-planning-009",
    title: "data migration task · case 009",
    scenario: "Investigate data migration task in a rare failure regime.",
    failure: "replanning thrashes; scenario 9 exposes the operational consequence.",
    subtitle: "Bound search — experiment 009",
    explanation: "Adjust the controls to see how replanning thrashes changes system quality, cost, and confidence.",
    lesson: "Bound search. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1350,
    sampleSize: 432,
    signal: 68
  },
  {
    id: "agent-planning-010",
    title: "research workflow · case 010",
    scenario: "Investigate research workflow in a high-scale environment.",
    failure: "planner decomposes endlessly; scenario 10 exposes the operational consequence.",
    subtitle: "Plans are hypotheses — experiment 010",
    explanation: "Adjust the controls to see how planner decomposes endlessly changes system quality, cost, and confidence.",
    lesson: "Plans are hypotheses. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1357,
    sampleSize: 449,
    signal: 87
  },
  {
    id: "agent-planning-011",
    title: "incident diagnosis plan · case 011",
    scenario: "Investigate incident diagnosis plan in a small clean workload.",
    failure: "plan ignores observed state; scenario 11 exposes the operational consequence.",
    subtitle: "Observe before replanning — experiment 011",
    explanation: "Adjust the controls to see how plan ignores observed state changes system quality, cost, and confidence.",
    lesson: "Observe before replanning. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1364,
    sampleSize: 466,
    signal: 5
  },
  {
    id: "agent-planning-012",
    title: "data migration task · case 012",
    scenario: "Investigate data migration task in a large noisy workload.",
    failure: "replanning thrashes; scenario 12 exposes the operational consequence.",
    subtitle: "Bound search — experiment 012",
    explanation: "Adjust the controls to see how replanning thrashes changes system quality, cost, and confidence.",
    lesson: "Bound search. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1371,
    sampleSize: 483,
    signal: 24
  }
];

export default function AgentPlanningSearchLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

