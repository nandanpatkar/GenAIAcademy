import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Context Window Budgeter",
  "kicker": "Generative AI interactive lab",
  "description": "Control generation, adaptation, multimodal behavior, evaluation, and safety with measurable trade-offs.",
  "mode": "neighbors",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "hsl(332 88% 66%)",
    "secondary": "hsl(100 78% 62%)",
    "background": "hsl(332 24% 7%)",
    "panel": "hsl(332 22% 12%)",
    "ink": "hsl(332 35% 94%)",
    "muted": "hsl(332 16% 68%)",
    "line": "hsl(332 20% 25%)",
    "soft": "hsl(332 25% 18%)"
  },
  "controlTitle": "Context Window Budgeter controls",
  "controls": [
    {
      "label": "Instruction tokens",
      "min": 0,
      "max": 100,
      "default": 40,
      "unit": "%",
      "help": "Tune instruction tokens and observe system behavior."
    },
    {
      "label": "Evidence budget",
      "min": 0,
      "max": 100,
      "default": 60,
      "unit": "",
      "help": "Stress evidence budget across realistic operating ranges."
    },
    {
      "label": "History depth",
      "min": 0,
      "max": 100,
      "default": 36,
      "unit": "",
      "help": "Use history depth to reveal boundary failures."
    }
  ],
  "visualTitle": "Context Window Budgeter live view",
  "metrics": [
    {
      "label": "Context score",
      "detail": "primary behavior"
    },
    {
      "label": "Window score",
      "detail": "robustness check"
    },
    {
      "label": "Budgeter score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "tokens=instructions+evidence+history+output",
  "costScale": 0.95,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Budget by information value",
      "body": "Principle 1: use this when reviewing context window budgeter behavior in production."
    },
    {
      "title": "Protect critical instructions",
      "body": "Principle 2: use this when reviewing context window budgeter behavior in production."
    },
    {
      "title": "Measure context utilization",
      "body": "Principle 3: use this when reviewing context window budgeter behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "context-budget-001",
    title: "long document assistant · case 001",
    scenario: "Investigate long document assistant in a large noisy workload.",
    failure: "history crowds out evidence; scenario 1 exposes the operational consequence.",
    subtitle: "Budget by information value — experiment 001",
    explanation: "Adjust the controls to see how history crowds out evidence changes system quality, cost, and confidence.",
    lesson: "Budget by information value. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1047,
    sampleSize: 277,
    signal: 99
  },
  {
    id: "context-budget-002",
    title: "multi-turn support chat · case 002",
    scenario: "Investigate multi-turn support chat in a shifted production slice.",
    failure: "truncation removes instruction; scenario 2 exposes the operational consequence.",
    subtitle: "Protect critical instructions — experiment 002",
    explanation: "Adjust the controls to see how truncation removes instruction changes system quality, cost, and confidence.",
    lesson: "Protect critical instructions. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1054,
    sampleSize: 294,
    signal: 17
  },
  {
    id: "context-budget-003",
    title: "codebase question context · case 003",
    scenario: "Investigate codebase question context in a rare failure regime.",
    failure: "large context dilutes signal; scenario 3 exposes the operational consequence.",
    subtitle: "Measure context utilization — experiment 003",
    explanation: "Adjust the controls to see how large context dilutes signal changes system quality, cost, and confidence.",
    lesson: "Measure context utilization. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1061,
    sampleSize: 311,
    signal: 36
  },
  {
    id: "context-budget-004",
    title: "long document assistant · case 004",
    scenario: "Investigate long document assistant in a high-scale environment.",
    failure: "history crowds out evidence; scenario 4 exposes the operational consequence.",
    subtitle: "Budget by information value — experiment 004",
    explanation: "Adjust the controls to see how history crowds out evidence changes system quality, cost, and confidence.",
    lesson: "Budget by information value. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1068,
    sampleSize: 328,
    signal: 55
  },
  {
    id: "context-budget-005",
    title: "multi-turn support chat · case 005",
    scenario: "Investigate multi-turn support chat in a small clean workload.",
    failure: "truncation removes instruction; scenario 5 exposes the operational consequence.",
    subtitle: "Protect critical instructions — experiment 005",
    explanation: "Adjust the controls to see how truncation removes instruction changes system quality, cost, and confidence.",
    lesson: "Protect critical instructions. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1075,
    sampleSize: 345,
    signal: 74
  },
  {
    id: "context-budget-006",
    title: "codebase question context · case 006",
    scenario: "Investigate codebase question context in a large noisy workload.",
    failure: "large context dilutes signal; scenario 6 exposes the operational consequence.",
    subtitle: "Measure context utilization — experiment 006",
    explanation: "Adjust the controls to see how large context dilutes signal changes system quality, cost, and confidence.",
    lesson: "Measure context utilization. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1082,
    sampleSize: 362,
    signal: 93
  },
  {
    id: "context-budget-007",
    title: "long document assistant · case 007",
    scenario: "Investigate long document assistant in a shifted production slice.",
    failure: "history crowds out evidence; scenario 7 exposes the operational consequence.",
    subtitle: "Budget by information value — experiment 007",
    explanation: "Adjust the controls to see how history crowds out evidence changes system quality, cost, and confidence.",
    lesson: "Budget by information value. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1089,
    sampleSize: 379,
    signal: 11
  },
  {
    id: "context-budget-008",
    title: "multi-turn support chat · case 008",
    scenario: "Investigate multi-turn support chat in a rare failure regime.",
    failure: "truncation removes instruction; scenario 8 exposes the operational consequence.",
    subtitle: "Protect critical instructions — experiment 008",
    explanation: "Adjust the controls to see how truncation removes instruction changes system quality, cost, and confidence.",
    lesson: "Protect critical instructions. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1096,
    sampleSize: 396,
    signal: 30
  },
  {
    id: "context-budget-009",
    title: "codebase question context · case 009",
    scenario: "Investigate codebase question context in a high-scale environment.",
    failure: "large context dilutes signal; scenario 9 exposes the operational consequence.",
    subtitle: "Measure context utilization — experiment 009",
    explanation: "Adjust the controls to see how large context dilutes signal changes system quality, cost, and confidence.",
    lesson: "Measure context utilization. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1103,
    sampleSize: 413,
    signal: 49
  },
  {
    id: "context-budget-010",
    title: "long document assistant · case 010",
    scenario: "Investigate long document assistant in a small clean workload.",
    failure: "history crowds out evidence; scenario 10 exposes the operational consequence.",
    subtitle: "Budget by information value — experiment 010",
    explanation: "Adjust the controls to see how history crowds out evidence changes system quality, cost, and confidence.",
    lesson: "Budget by information value. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1110,
    sampleSize: 430,
    signal: 68
  },
  {
    id: "context-budget-011",
    title: "multi-turn support chat · case 011",
    scenario: "Investigate multi-turn support chat in a large noisy workload.",
    failure: "truncation removes instruction; scenario 11 exposes the operational consequence.",
    subtitle: "Protect critical instructions — experiment 011",
    explanation: "Adjust the controls to see how truncation removes instruction changes system quality, cost, and confidence.",
    lesson: "Protect critical instructions. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1117,
    sampleSize: 447,
    signal: 87
  },
  {
    id: "context-budget-012",
    title: "codebase question context · case 012",
    scenario: "Investigate codebase question context in a shifted production slice.",
    failure: "large context dilutes signal; scenario 12 exposes the operational consequence.",
    subtitle: "Measure context utilization — experiment 012",
    explanation: "Adjust the controls to see how large context dilutes signal changes system quality, cost, and confidence.",
    lesson: "Measure context utilization. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1124,
    sampleSize: 464,
    signal: 5
  }
];

export default function ContextWindowBudgeterLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

