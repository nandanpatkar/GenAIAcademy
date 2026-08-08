import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Container Resource Planner",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "matrix",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "hsl(208 72% 42%)",
    "secondary": "hsl(336 70% 42%)",
    "background": "hsl(208 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(208 30% 13%)",
    "muted": "hsl(208 14% 43%)",
    "line": "hsl(208 28% 86%)",
    "soft": "hsl(208 55% 92%)"
  },
  "controlTitle": "Container Resource Planner controls",
  "controls": [
    {
      "label": "CPU request",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune cpu request and observe system behavior."
    },
    {
      "label": "Memory limit",
      "min": 0,
      "max": 100,
      "default": 66,
      "unit": "",
      "help": "Stress memory limit across realistic operating ranges."
    },
    {
      "label": "Replica count",
      "min": 0,
      "max": 100,
      "default": 30,
      "unit": "",
      "help": "Use replica count to reveal boundary failures."
    }
  ],
  "visualTitle": "Container Resource Planner live view",
  "metrics": [
    {
      "label": "Container score",
      "detail": "primary behavior"
    },
    {
      "label": "Resource score",
      "detail": "robustness check"
    },
    {
      "label": "Planner score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "capacity=min(CPU/mcpu, RAM/mem)",
  "costScale": 0.95,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Requests drive scheduling",
      "body": "Principle 1: use this when reviewing container resource planner behavior in production."
    },
    {
      "title": "Limits shape failure",
      "body": "Principle 2: use this when reviewing container resource planner behavior in production."
    },
    {
      "title": "Measure real usage",
      "body": "Principle 3: use this when reviewing container resource planner behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "container-resources-001",
    title: "model inference container · case 001",
    scenario: "Investigate model inference container in a high-scale environment.",
    failure: "low request causes throttling; scenario 1 exposes the operational consequence.",
    subtitle: "Requests drive scheduling — experiment 001",
    explanation: "Adjust the controls to see how low request causes throttling changes system quality, cost, and confidence.",
    lesson: "Requests drive scheduling. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1411,
    sampleSize: 305,
    signal: 26
  },
  {
    id: "container-resources-002",
    title: "batch worker service · case 002",
    scenario: "Investigate batch worker service in a small clean workload.",
    failure: "tight limit triggers OOM; scenario 2 exposes the operational consequence.",
    subtitle: "Limits shape failure — experiment 002",
    explanation: "Adjust the controls to see how tight limit triggers OOM changes system quality, cost, and confidence.",
    lesson: "Limits shape failure. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1418,
    sampleSize: 322,
    signal: 45
  },
  {
    id: "container-resources-003",
    title: "web API deployment · case 003",
    scenario: "Investigate web API deployment in a large noisy workload.",
    failure: "high request wastes nodes; scenario 3 exposes the operational consequence.",
    subtitle: "Measure real usage — experiment 003",
    explanation: "Adjust the controls to see how high request wastes nodes changes system quality, cost, and confidence.",
    lesson: "Measure real usage. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1425,
    sampleSize: 339,
    signal: 64
  },
  {
    id: "container-resources-004",
    title: "model inference container · case 004",
    scenario: "Investigate model inference container in a shifted production slice.",
    failure: "low request causes throttling; scenario 4 exposes the operational consequence.",
    subtitle: "Requests drive scheduling — experiment 004",
    explanation: "Adjust the controls to see how low request causes throttling changes system quality, cost, and confidence.",
    lesson: "Requests drive scheduling. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1432,
    sampleSize: 356,
    signal: 83
  },
  {
    id: "container-resources-005",
    title: "batch worker service · case 005",
    scenario: "Investigate batch worker service in a rare failure regime.",
    failure: "tight limit triggers OOM; scenario 5 exposes the operational consequence.",
    subtitle: "Limits shape failure — experiment 005",
    explanation: "Adjust the controls to see how tight limit triggers OOM changes system quality, cost, and confidence.",
    lesson: "Limits shape failure. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1439,
    sampleSize: 373,
    signal: 1
  },
  {
    id: "container-resources-006",
    title: "web API deployment · case 006",
    scenario: "Investigate web API deployment in a high-scale environment.",
    failure: "high request wastes nodes; scenario 6 exposes the operational consequence.",
    subtitle: "Measure real usage — experiment 006",
    explanation: "Adjust the controls to see how high request wastes nodes changes system quality, cost, and confidence.",
    lesson: "Measure real usage. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1446,
    sampleSize: 390,
    signal: 20
  },
  {
    id: "container-resources-007",
    title: "model inference container · case 007",
    scenario: "Investigate model inference container in a small clean workload.",
    failure: "low request causes throttling; scenario 7 exposes the operational consequence.",
    subtitle: "Requests drive scheduling — experiment 007",
    explanation: "Adjust the controls to see how low request causes throttling changes system quality, cost, and confidence.",
    lesson: "Requests drive scheduling. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1453,
    sampleSize: 407,
    signal: 39
  },
  {
    id: "container-resources-008",
    title: "batch worker service · case 008",
    scenario: "Investigate batch worker service in a large noisy workload.",
    failure: "tight limit triggers OOM; scenario 8 exposes the operational consequence.",
    subtitle: "Limits shape failure — experiment 008",
    explanation: "Adjust the controls to see how tight limit triggers OOM changes system quality, cost, and confidence.",
    lesson: "Limits shape failure. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1460,
    sampleSize: 424,
    signal: 58
  },
  {
    id: "container-resources-009",
    title: "web API deployment · case 009",
    scenario: "Investigate web API deployment in a shifted production slice.",
    failure: "high request wastes nodes; scenario 9 exposes the operational consequence.",
    subtitle: "Measure real usage — experiment 009",
    explanation: "Adjust the controls to see how high request wastes nodes changes system quality, cost, and confidence.",
    lesson: "Measure real usage. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1467,
    sampleSize: 441,
    signal: 77
  },
  {
    id: "container-resources-010",
    title: "model inference container · case 010",
    scenario: "Investigate model inference container in a rare failure regime.",
    failure: "low request causes throttling; scenario 10 exposes the operational consequence.",
    subtitle: "Requests drive scheduling — experiment 010",
    explanation: "Adjust the controls to see how low request causes throttling changes system quality, cost, and confidence.",
    lesson: "Requests drive scheduling. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1474,
    sampleSize: 458,
    signal: 96
  },
  {
    id: "container-resources-011",
    title: "batch worker service · case 011",
    scenario: "Investigate batch worker service in a high-scale environment.",
    failure: "tight limit triggers OOM; scenario 11 exposes the operational consequence.",
    subtitle: "Limits shape failure — experiment 011",
    explanation: "Adjust the controls to see how tight limit triggers OOM changes system quality, cost, and confidence.",
    lesson: "Limits shape failure. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1481,
    sampleSize: 475,
    signal: 14
  },
  {
    id: "container-resources-012",
    title: "web API deployment · case 012",
    scenario: "Investigate web API deployment in a small clean workload.",
    failure: "high request wastes nodes; scenario 12 exposes the operational consequence.",
    subtitle: "Measure real usage — experiment 012",
    explanation: "Adjust the controls to see how high request wastes nodes changes system quality, cost, and confidence.",
    lesson: "Measure real usage. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1488,
    sampleSize: 492,
    signal: 33
  }
];

export default function ContainerResourcePlannerLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

