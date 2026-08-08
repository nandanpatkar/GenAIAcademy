import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Agent Handoff Protocol Lab",
  "kicker": "Agent systems interactive lab",
  "description": "Design controlled agent execution with explicit state, tools, authority, budgets, and recovery behavior.",
  "mode": "image",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "hsl(239 88% 66%)",
    "secondary": "hsl(7 78% 62%)",
    "background": "hsl(239 24% 7%)",
    "panel": "hsl(239 22% 12%)",
    "ink": "hsl(239 35% 94%)",
    "muted": "hsl(239 16% 68%)",
    "line": "hsl(239 20% 25%)",
    "soft": "hsl(239 25% 18%)"
  },
  "controlTitle": "Agent Handoff Protocol Lab controls",
  "controls": [
    {
      "label": "Context package",
      "min": 0,
      "max": 100,
      "default": 48,
      "unit": "%",
      "help": "Tune context package and observe system behavior."
    },
    {
      "label": "Authority scope",
      "min": 0,
      "max": 100,
      "default": 59,
      "unit": "",
      "help": "Stress authority scope across realistic operating ranges."
    },
    {
      "label": "Acceptance check",
      "min": 0,
      "max": 100,
      "default": 40,
      "unit": "",
      "help": "Use acceptance check to reveal boundary failures."
    }
  ],
  "visualTitle": "Agent Handoff Protocol Lab live view",
  "metrics": [
    {
      "label": "Agent score",
      "detail": "primary behavior"
    },
    {
      "label": "Handoff score",
      "detail": "robustness check"
    },
    {
      "label": "Protocol score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "handoff=(goal,state,evidence,open_risks)",
  "costScale": 0.95,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Handoffs are contracts",
      "body": "Principle 1: use this when reviewing agent handoff protocol lab behavior in production."
    },
    {
      "title": "Transfer state explicitly",
      "body": "Principle 2: use this when reviewing agent handoff protocol lab behavior in production."
    },
    {
      "title": "Receiver validates",
      "body": "Principle 3: use this when reviewing agent handoff protocol lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "agent-handoff-001",
    title: "research to writer handoff · case 001",
    scenario: "Investigate research to writer handoff in a shifted production slice.",
    failure: "goal changes in transit; scenario 1 exposes the operational consequence.",
    subtitle: "Handoffs are contracts — experiment 001",
    explanation: "Adjust the controls to see how goal changes in transit changes system quality, cost, and confidence.",
    lesson: "Handoffs are contracts. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1320,
    sampleSize: 298,
    signal: 19
  },
  {
    id: "agent-handoff-002",
    title: "triage to specialist transfer · case 002",
    scenario: "Investigate triage to specialist transfer in a rare failure regime.",
    failure: "authority is ambiguous; scenario 2 exposes the operational consequence.",
    subtitle: "Transfer state explicitly — experiment 002",
    explanation: "Adjust the controls to see how authority is ambiguous changes system quality, cost, and confidence.",
    lesson: "Transfer state explicitly. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1327,
    sampleSize: 315,
    signal: 38
  },
  {
    id: "agent-handoff-003",
    title: "planner to executor delegation · case 003",
    scenario: "Investigate planner to executor delegation in a high-scale environment.",
    failure: "evidence provenance is lost; scenario 3 exposes the operational consequence.",
    subtitle: "Receiver validates — experiment 003",
    explanation: "Adjust the controls to see how evidence provenance is lost changes system quality, cost, and confidence.",
    lesson: "Receiver validates. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1334,
    sampleSize: 332,
    signal: 57
  },
  {
    id: "agent-handoff-004",
    title: "research to writer handoff · case 004",
    scenario: "Investigate research to writer handoff in a small clean workload.",
    failure: "goal changes in transit; scenario 4 exposes the operational consequence.",
    subtitle: "Handoffs are contracts — experiment 004",
    explanation: "Adjust the controls to see how goal changes in transit changes system quality, cost, and confidence.",
    lesson: "Handoffs are contracts. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1341,
    sampleSize: 349,
    signal: 76
  },
  {
    id: "agent-handoff-005",
    title: "triage to specialist transfer · case 005",
    scenario: "Investigate triage to specialist transfer in a large noisy workload.",
    failure: "authority is ambiguous; scenario 5 exposes the operational consequence.",
    subtitle: "Transfer state explicitly — experiment 005",
    explanation: "Adjust the controls to see how authority is ambiguous changes system quality, cost, and confidence.",
    lesson: "Transfer state explicitly. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1348,
    sampleSize: 366,
    signal: 95
  },
  {
    id: "agent-handoff-006",
    title: "planner to executor delegation · case 006",
    scenario: "Investigate planner to executor delegation in a shifted production slice.",
    failure: "evidence provenance is lost; scenario 6 exposes the operational consequence.",
    subtitle: "Receiver validates — experiment 006",
    explanation: "Adjust the controls to see how evidence provenance is lost changes system quality, cost, and confidence.",
    lesson: "Receiver validates. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1355,
    sampleSize: 383,
    signal: 13
  },
  {
    id: "agent-handoff-007",
    title: "research to writer handoff · case 007",
    scenario: "Investigate research to writer handoff in a rare failure regime.",
    failure: "goal changes in transit; scenario 7 exposes the operational consequence.",
    subtitle: "Handoffs are contracts — experiment 007",
    explanation: "Adjust the controls to see how goal changes in transit changes system quality, cost, and confidence.",
    lesson: "Handoffs are contracts. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1362,
    sampleSize: 400,
    signal: 32
  },
  {
    id: "agent-handoff-008",
    title: "triage to specialist transfer · case 008",
    scenario: "Investigate triage to specialist transfer in a high-scale environment.",
    failure: "authority is ambiguous; scenario 8 exposes the operational consequence.",
    subtitle: "Transfer state explicitly — experiment 008",
    explanation: "Adjust the controls to see how authority is ambiguous changes system quality, cost, and confidence.",
    lesson: "Transfer state explicitly. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1369,
    sampleSize: 417,
    signal: 51
  },
  {
    id: "agent-handoff-009",
    title: "planner to executor delegation · case 009",
    scenario: "Investigate planner to executor delegation in a small clean workload.",
    failure: "evidence provenance is lost; scenario 9 exposes the operational consequence.",
    subtitle: "Receiver validates — experiment 009",
    explanation: "Adjust the controls to see how evidence provenance is lost changes system quality, cost, and confidence.",
    lesson: "Receiver validates. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1376,
    sampleSize: 434,
    signal: 70
  },
  {
    id: "agent-handoff-010",
    title: "research to writer handoff · case 010",
    scenario: "Investigate research to writer handoff in a large noisy workload.",
    failure: "goal changes in transit; scenario 10 exposes the operational consequence.",
    subtitle: "Handoffs are contracts — experiment 010",
    explanation: "Adjust the controls to see how goal changes in transit changes system quality, cost, and confidence.",
    lesson: "Handoffs are contracts. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1383,
    sampleSize: 451,
    signal: 89
  },
  {
    id: "agent-handoff-011",
    title: "triage to specialist transfer · case 011",
    scenario: "Investigate triage to specialist transfer in a shifted production slice.",
    failure: "authority is ambiguous; scenario 11 exposes the operational consequence.",
    subtitle: "Transfer state explicitly — experiment 011",
    explanation: "Adjust the controls to see how authority is ambiguous changes system quality, cost, and confidence.",
    lesson: "Transfer state explicitly. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1390,
    sampleSize: 468,
    signal: 7
  },
  {
    id: "agent-handoff-012",
    title: "planner to executor delegation · case 012",
    scenario: "Investigate planner to executor delegation in a rare failure regime.",
    failure: "evidence provenance is lost; scenario 12 exposes the operational consequence.",
    subtitle: "Receiver validates — experiment 012",
    explanation: "Adjust the controls to see how evidence provenance is lost changes system quality, cost, and confidence.",
    lesson: "Receiver validates. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1397,
    sampleSize: 485,
    signal: 26
  }
];

export default function AgentHandoffProtocolLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

