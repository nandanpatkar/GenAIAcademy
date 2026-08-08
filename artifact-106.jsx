import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Agent Trace Observatory",
  "kicker": "Agent systems interactive lab",
  "description": "Design controlled agent execution with explicit state, tools, authority, budgets, and recovery behavior.",
  "mode": "tree",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "hsl(114 72% 42%)",
    "secondary": "hsl(242 70% 42%)",
    "background": "hsl(114 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(114 30% 13%)",
    "muted": "hsl(114 14% 43%)",
    "line": "hsl(114 28% 86%)",
    "soft": "hsl(114 55% 92%)"
  },
  "controlTitle": "Agent Trace Observatory controls",
  "controls": [
    {
      "label": "Trace detail",
      "min": 0,
      "max": 100,
      "default": 40,
      "unit": "%",
      "help": "Tune trace detail and observe system behavior."
    },
    {
      "label": "Sampling rate",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress sampling rate across realistic operating ranges."
    },
    {
      "label": "PII redaction",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use pii redaction to reveal boundary failures."
    }
  ],
  "visualTitle": "Agent Trace Observatory live view",
  "metrics": [
    {
      "label": "Agent score",
      "detail": "primary behavior"
    },
    {
      "label": "Trace score",
      "detail": "robustness check"
    },
    {
      "label": "Observatory score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "trace=Σ(span(model,tool,state))",
  "costScale": 0.75,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Trace state transitions",
      "body": "Principle 1: use this when reviewing agent trace observatory behavior in production."
    },
    {
      "title": "Redact at collection",
      "body": "Principle 2: use this when reviewing agent trace observatory behavior in production."
    },
    {
      "title": "Link outcome to spans",
      "body": "Principle 3: use this when reviewing agent trace observatory behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "agent-observability-001",
    title: "multi-tool support agent · case 001",
    scenario: "Investigate multi-tool support agent in a shifted production slice.",
    failure: "trace omits decision context; scenario 1 exposes the operational consequence.",
    subtitle: "Trace state transitions — experiment 001",
    explanation: "Adjust the controls to see how trace omits decision context changes system quality, cost, and confidence.",
    lesson: "Trace state transitions. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1385,
    sampleSize: 303,
    signal: 24
  },
  {
    id: "agent-observability-002",
    title: "browser automation agent · case 002",
    scenario: "Investigate browser automation agent in a rare failure regime.",
    failure: "full logging leaks secrets; scenario 2 exposes the operational consequence.",
    subtitle: "Redact at collection — experiment 002",
    explanation: "Adjust the controls to see how full logging leaks secrets changes system quality, cost, and confidence.",
    lesson: "Redact at collection. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1392,
    sampleSize: 320,
    signal: 43
  },
  {
    id: "agent-observability-003",
    title: "data analysis workflow · case 003",
    scenario: "Investigate data analysis workflow in a high-scale environment.",
    failure: "sample misses rare failure; scenario 3 exposes the operational consequence.",
    subtitle: "Link outcome to spans — experiment 003",
    explanation: "Adjust the controls to see how sample misses rare failure changes system quality, cost, and confidence.",
    lesson: "Link outcome to spans. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1399,
    sampleSize: 337,
    signal: 62
  },
  {
    id: "agent-observability-004",
    title: "multi-tool support agent · case 004",
    scenario: "Investigate multi-tool support agent in a small clean workload.",
    failure: "trace omits decision context; scenario 4 exposes the operational consequence.",
    subtitle: "Trace state transitions — experiment 004",
    explanation: "Adjust the controls to see how trace omits decision context changes system quality, cost, and confidence.",
    lesson: "Trace state transitions. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1406,
    sampleSize: 354,
    signal: 81
  },
  {
    id: "agent-observability-005",
    title: "browser automation agent · case 005",
    scenario: "Investigate browser automation agent in a large noisy workload.",
    failure: "full logging leaks secrets; scenario 5 exposes the operational consequence.",
    subtitle: "Redact at collection — experiment 005",
    explanation: "Adjust the controls to see how full logging leaks secrets changes system quality, cost, and confidence.",
    lesson: "Redact at collection. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1413,
    sampleSize: 371,
    signal: 100
  },
  {
    id: "agent-observability-006",
    title: "data analysis workflow · case 006",
    scenario: "Investigate data analysis workflow in a shifted production slice.",
    failure: "sample misses rare failure; scenario 6 exposes the operational consequence.",
    subtitle: "Link outcome to spans — experiment 006",
    explanation: "Adjust the controls to see how sample misses rare failure changes system quality, cost, and confidence.",
    lesson: "Link outcome to spans. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1420,
    sampleSize: 388,
    signal: 18
  },
  {
    id: "agent-observability-007",
    title: "multi-tool support agent · case 007",
    scenario: "Investigate multi-tool support agent in a rare failure regime.",
    failure: "trace omits decision context; scenario 7 exposes the operational consequence.",
    subtitle: "Trace state transitions — experiment 007",
    explanation: "Adjust the controls to see how trace omits decision context changes system quality, cost, and confidence.",
    lesson: "Trace state transitions. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1427,
    sampleSize: 405,
    signal: 37
  },
  {
    id: "agent-observability-008",
    title: "browser automation agent · case 008",
    scenario: "Investigate browser automation agent in a high-scale environment.",
    failure: "full logging leaks secrets; scenario 8 exposes the operational consequence.",
    subtitle: "Redact at collection — experiment 008",
    explanation: "Adjust the controls to see how full logging leaks secrets changes system quality, cost, and confidence.",
    lesson: "Redact at collection. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1434,
    sampleSize: 422,
    signal: 56
  },
  {
    id: "agent-observability-009",
    title: "data analysis workflow · case 009",
    scenario: "Investigate data analysis workflow in a small clean workload.",
    failure: "sample misses rare failure; scenario 9 exposes the operational consequence.",
    subtitle: "Link outcome to spans — experiment 009",
    explanation: "Adjust the controls to see how sample misses rare failure changes system quality, cost, and confidence.",
    lesson: "Link outcome to spans. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1441,
    sampleSize: 439,
    signal: 75
  },
  {
    id: "agent-observability-010",
    title: "multi-tool support agent · case 010",
    scenario: "Investigate multi-tool support agent in a large noisy workload.",
    failure: "trace omits decision context; scenario 10 exposes the operational consequence.",
    subtitle: "Trace state transitions — experiment 010",
    explanation: "Adjust the controls to see how trace omits decision context changes system quality, cost, and confidence.",
    lesson: "Trace state transitions. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1448,
    sampleSize: 456,
    signal: 94
  },
  {
    id: "agent-observability-011",
    title: "browser automation agent · case 011",
    scenario: "Investigate browser automation agent in a shifted production slice.",
    failure: "full logging leaks secrets; scenario 11 exposes the operational consequence.",
    subtitle: "Redact at collection — experiment 011",
    explanation: "Adjust the controls to see how full logging leaks secrets changes system quality, cost, and confidence.",
    lesson: "Redact at collection. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1455,
    sampleSize: 473,
    signal: 12
  },
  {
    id: "agent-observability-012",
    title: "data analysis workflow · case 012",
    scenario: "Investigate data analysis workflow in a rare failure regime.",
    failure: "sample misses rare failure; scenario 12 exposes the operational consequence.",
    subtitle: "Link outcome to spans — experiment 012",
    explanation: "Adjust the controls to see how sample misses rare failure changes system quality, cost, and confidence.",
    lesson: "Link outcome to spans. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1462,
    sampleSize: 490,
    signal: 31
  }
];

export default function AgentTraceObservatoryLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

