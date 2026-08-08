import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Chaos Experiment Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "neighbors",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "hsl(224 88% 66%)",
    "secondary": "hsl(352 78% 62%)",
    "background": "hsl(224 24% 7%)",
    "panel": "hsl(224 22% 12%)",
    "ink": "hsl(224 35% 94%)",
    "muted": "hsl(224 16% 68%)",
    "line": "hsl(224 20% 25%)",
    "soft": "hsl(224 25% 18%)"
  },
  "controlTitle": "Chaos Experiment Lab controls",
  "controls": [
    {
      "label": "Fault strength",
      "min": 0,
      "max": 100,
      "default": 50,
      "unit": "%",
      "help": "Tune fault strength and observe system behavior."
    },
    {
      "label": "Blast radius",
      "min": 0,
      "max": 100,
      "default": 63,
      "unit": "",
      "help": "Stress blast radius across realistic operating ranges."
    },
    {
      "label": "Abort threshold",
      "min": 0,
      "max": 100,
      "default": 38,
      "unit": "",
      "help": "Use abort threshold to reveal boundary failures."
    }
  ],
  "visualTitle": "Chaos Experiment Lab live view",
  "metrics": [
    {
      "label": "Chaos score",
      "detail": "primary behavior"
    },
    {
      "label": "Experiment score",
      "detail": "robustness check"
    },
    {
      "label": "Work units",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "confidence=survived(hypothesis,blast_radius)",
  "costScale": 1.05,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Start with a steady state",
      "body": "Principle 1: use this when reviewing chaos experiment lab behavior in production."
    },
    {
      "title": "Limit blast radius",
      "body": "Principle 2: use this when reviewing chaos experiment lab behavior in production."
    },
    {
      "title": "Automate aborts",
      "body": "Principle 3: use this when reviewing chaos experiment lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "chaos-testing-001",
    title: "pod termination test · case 001",
    scenario: "Investigate pod termination test in a shifted production slice.",
    failure: "experiment has no hypothesis; scenario 1 exposes the operational consequence.",
    subtitle: "Start with a steady state — experiment 001",
    explanation: "Adjust the controls to see how experiment has no hypothesis changes system quality, cost, and confidence.",
    lesson: "Start with a steady state. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1515,
    sampleSize: 313,
    signal: 34
  },
  {
    id: "chaos-testing-002",
    title: "network latency injection · case 002",
    scenario: "Investigate network latency injection in a rare failure regime.",
    failure: "blast radius expands; scenario 2 exposes the operational consequence.",
    subtitle: "Limit blast radius — experiment 002",
    explanation: "Adjust the controls to see how blast radius expands changes system quality, cost, and confidence.",
    lesson: "Limit blast radius. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1522,
    sampleSize: 330,
    signal: 53
  },
  {
    id: "chaos-testing-003",
    title: "dependency outage drill · case 003",
    scenario: "Investigate dependency outage drill in a high-scale environment.",
    failure: "abort signal arrives late; scenario 3 exposes the operational consequence.",
    subtitle: "Automate aborts — experiment 003",
    explanation: "Adjust the controls to see how abort signal arrives late changes system quality, cost, and confidence.",
    lesson: "Automate aborts. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1529,
    sampleSize: 347,
    signal: 72
  },
  {
    id: "chaos-testing-004",
    title: "pod termination test · case 004",
    scenario: "Investigate pod termination test in a small clean workload.",
    failure: "experiment has no hypothesis; scenario 4 exposes the operational consequence.",
    subtitle: "Start with a steady state — experiment 004",
    explanation: "Adjust the controls to see how experiment has no hypothesis changes system quality, cost, and confidence.",
    lesson: "Start with a steady state. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1536,
    sampleSize: 364,
    signal: 91
  },
  {
    id: "chaos-testing-005",
    title: "network latency injection · case 005",
    scenario: "Investigate network latency injection in a large noisy workload.",
    failure: "blast radius expands; scenario 5 exposes the operational consequence.",
    subtitle: "Limit blast radius — experiment 005",
    explanation: "Adjust the controls to see how blast radius expands changes system quality, cost, and confidence.",
    lesson: "Limit blast radius. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1543,
    sampleSize: 381,
    signal: 9
  },
  {
    id: "chaos-testing-006",
    title: "dependency outage drill · case 006",
    scenario: "Investigate dependency outage drill in a shifted production slice.",
    failure: "abort signal arrives late; scenario 6 exposes the operational consequence.",
    subtitle: "Automate aborts — experiment 006",
    explanation: "Adjust the controls to see how abort signal arrives late changes system quality, cost, and confidence.",
    lesson: "Automate aborts. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1550,
    sampleSize: 398,
    signal: 28
  },
  {
    id: "chaos-testing-007",
    title: "pod termination test · case 007",
    scenario: "Investigate pod termination test in a rare failure regime.",
    failure: "experiment has no hypothesis; scenario 7 exposes the operational consequence.",
    subtitle: "Start with a steady state — experiment 007",
    explanation: "Adjust the controls to see how experiment has no hypothesis changes system quality, cost, and confidence.",
    lesson: "Start with a steady state. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1557,
    sampleSize: 415,
    signal: 47
  },
  {
    id: "chaos-testing-008",
    title: "network latency injection · case 008",
    scenario: "Investigate network latency injection in a high-scale environment.",
    failure: "blast radius expands; scenario 8 exposes the operational consequence.",
    subtitle: "Limit blast radius — experiment 008",
    explanation: "Adjust the controls to see how blast radius expands changes system quality, cost, and confidence.",
    lesson: "Limit blast radius. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1564,
    sampleSize: 432,
    signal: 66
  },
  {
    id: "chaos-testing-009",
    title: "dependency outage drill · case 009",
    scenario: "Investigate dependency outage drill in a small clean workload.",
    failure: "abort signal arrives late; scenario 9 exposes the operational consequence.",
    subtitle: "Automate aborts — experiment 009",
    explanation: "Adjust the controls to see how abort signal arrives late changes system quality, cost, and confidence.",
    lesson: "Automate aborts. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1571,
    sampleSize: 449,
    signal: 85
  },
  {
    id: "chaos-testing-010",
    title: "pod termination test · case 010",
    scenario: "Investigate pod termination test in a large noisy workload.",
    failure: "experiment has no hypothesis; scenario 10 exposes the operational consequence.",
    subtitle: "Start with a steady state — experiment 010",
    explanation: "Adjust the controls to see how experiment has no hypothesis changes system quality, cost, and confidence.",
    lesson: "Start with a steady state. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1578,
    sampleSize: 466,
    signal: 3
  },
  {
    id: "chaos-testing-011",
    title: "network latency injection · case 011",
    scenario: "Investigate network latency injection in a shifted production slice.",
    failure: "blast radius expands; scenario 11 exposes the operational consequence.",
    subtitle: "Limit blast radius — experiment 011",
    explanation: "Adjust the controls to see how blast radius expands changes system quality, cost, and confidence.",
    lesson: "Limit blast radius. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1585,
    sampleSize: 483,
    signal: 22
  },
  {
    id: "chaos-testing-012",
    title: "dependency outage drill · case 012",
    scenario: "Investigate dependency outage drill in a rare failure regime.",
    failure: "abort signal arrives late; scenario 12 exposes the operational consequence.",
    subtitle: "Automate aborts — experiment 012",
    explanation: "Adjust the controls to see how abort signal arrives late changes system quality, cost, and confidence.",
    lesson: "Automate aborts. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1592,
    sampleSize: 500,
    signal: 41
  }
];

export default function ChaosExperimentLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

