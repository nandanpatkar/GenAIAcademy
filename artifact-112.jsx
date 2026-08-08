import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Blue–Green Deployment Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "curve",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "hsl(36 72% 42%)",
    "secondary": "hsl(164 70% 42%)",
    "background": "hsl(36 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(36 30% 13%)",
    "muted": "hsl(36 14% 43%)",
    "line": "hsl(36 28% 86%)",
    "soft": "hsl(36 55% 92%)"
  },
  "controlTitle": "Blue–Green Deployment Lab controls",
  "controls": [
    {
      "label": "Warmup traffic",
      "min": 0,
      "max": 100,
      "default": 46,
      "unit": "%",
      "help": "Tune warmup traffic and observe system behavior."
    },
    {
      "label": "Switch speed",
      "min": 0,
      "max": 100,
      "default": 59,
      "unit": "",
      "help": "Stress switch speed across realistic operating ranges."
    },
    {
      "label": "Rollback window",
      "min": 0,
      "max": 100,
      "default": 34,
      "unit": "",
      "help": "Use rollback window to reveal boundary failures."
    }
  ],
  "visualTitle": "Blue–Green Deployment Lab live view",
  "metrics": [
    {
      "label": "Blue score",
      "detail": "primary behavior"
    },
    {
      "label": "Green score",
      "detail": "robustness check"
    },
    {
      "label": "Deployment score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "switch(blue,green) if gates_pass",
  "costScale": 0.65,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Test production topology",
      "body": "Principle 1: use this when reviewing blue–green deployment lab behavior in production."
    },
    {
      "title": "Plan data compatibility",
      "body": "Principle 2: use this when reviewing blue–green deployment lab behavior in production."
    },
    {
      "title": "Keep rollback viable",
      "body": "Principle 3: use this when reviewing blue–green deployment lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "blue-green-001",
    title: "API platform release · case 001",
    scenario: "Investigate API platform release in a rare failure regime.",
    failure: "green lacks warm cache; scenario 1 exposes the operational consequence.",
    subtitle: "Test production topology — experiment 001",
    explanation: "Adjust the controls to see how green lacks warm cache changes system quality, cost, and confidence.",
    lesson: "Test production topology. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1463,
    sampleSize: 309,
    signal: 30
  },
  {
    id: "blue-green-002",
    title: "model serving upgrade · case 002",
    scenario: "Investigate model serving upgrade in a high-scale environment.",
    failure: "sessions break on switch; scenario 2 exposes the operational consequence.",
    subtitle: "Plan data compatibility — experiment 002",
    explanation: "Adjust the controls to see how sessions break on switch changes system quality, cost, and confidence.",
    lesson: "Plan data compatibility. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1470,
    sampleSize: 326,
    signal: 49
  },
  {
    id: "blue-green-003",
    title: "database reader migration · case 003",
    scenario: "Investigate database reader migration in a small clean workload.",
    failure: "both stacks share hidden dependency; scenario 3 exposes the operational consequence.",
    subtitle: "Keep rollback viable — experiment 003",
    explanation: "Adjust the controls to see how both stacks share hidden dependency changes system quality, cost, and confidence.",
    lesson: "Keep rollback viable. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1477,
    sampleSize: 343,
    signal: 68
  },
  {
    id: "blue-green-004",
    title: "API platform release · case 004",
    scenario: "Investigate API platform release in a large noisy workload.",
    failure: "green lacks warm cache; scenario 4 exposes the operational consequence.",
    subtitle: "Test production topology — experiment 004",
    explanation: "Adjust the controls to see how green lacks warm cache changes system quality, cost, and confidence.",
    lesson: "Test production topology. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1484,
    sampleSize: 360,
    signal: 87
  },
  {
    id: "blue-green-005",
    title: "model serving upgrade · case 005",
    scenario: "Investigate model serving upgrade in a shifted production slice.",
    failure: "sessions break on switch; scenario 5 exposes the operational consequence.",
    subtitle: "Plan data compatibility — experiment 005",
    explanation: "Adjust the controls to see how sessions break on switch changes system quality, cost, and confidence.",
    lesson: "Plan data compatibility. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1491,
    sampleSize: 377,
    signal: 5
  },
  {
    id: "blue-green-006",
    title: "database reader migration · case 006",
    scenario: "Investigate database reader migration in a rare failure regime.",
    failure: "both stacks share hidden dependency; scenario 6 exposes the operational consequence.",
    subtitle: "Keep rollback viable — experiment 006",
    explanation: "Adjust the controls to see how both stacks share hidden dependency changes system quality, cost, and confidence.",
    lesson: "Keep rollback viable. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1498,
    sampleSize: 394,
    signal: 24
  },
  {
    id: "blue-green-007",
    title: "API platform release · case 007",
    scenario: "Investigate API platform release in a high-scale environment.",
    failure: "green lacks warm cache; scenario 7 exposes the operational consequence.",
    subtitle: "Test production topology — experiment 007",
    explanation: "Adjust the controls to see how green lacks warm cache changes system quality, cost, and confidence.",
    lesson: "Test production topology. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1505,
    sampleSize: 411,
    signal: 43
  },
  {
    id: "blue-green-008",
    title: "model serving upgrade · case 008",
    scenario: "Investigate model serving upgrade in a small clean workload.",
    failure: "sessions break on switch; scenario 8 exposes the operational consequence.",
    subtitle: "Plan data compatibility — experiment 008",
    explanation: "Adjust the controls to see how sessions break on switch changes system quality, cost, and confidence.",
    lesson: "Plan data compatibility. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1512,
    sampleSize: 428,
    signal: 62
  },
  {
    id: "blue-green-009",
    title: "database reader migration · case 009",
    scenario: "Investigate database reader migration in a large noisy workload.",
    failure: "both stacks share hidden dependency; scenario 9 exposes the operational consequence.",
    subtitle: "Keep rollback viable — experiment 009",
    explanation: "Adjust the controls to see how both stacks share hidden dependency changes system quality, cost, and confidence.",
    lesson: "Keep rollback viable. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1519,
    sampleSize: 445,
    signal: 81
  },
  {
    id: "blue-green-010",
    title: "API platform release · case 010",
    scenario: "Investigate API platform release in a shifted production slice.",
    failure: "green lacks warm cache; scenario 10 exposes the operational consequence.",
    subtitle: "Test production topology — experiment 010",
    explanation: "Adjust the controls to see how green lacks warm cache changes system quality, cost, and confidence.",
    lesson: "Test production topology. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1526,
    sampleSize: 462,
    signal: 100
  },
  {
    id: "blue-green-011",
    title: "model serving upgrade · case 011",
    scenario: "Investigate model serving upgrade in a rare failure regime.",
    failure: "sessions break on switch; scenario 11 exposes the operational consequence.",
    subtitle: "Plan data compatibility — experiment 011",
    explanation: "Adjust the controls to see how sessions break on switch changes system quality, cost, and confidence.",
    lesson: "Plan data compatibility. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1533,
    sampleSize: 479,
    signal: 18
  },
  {
    id: "blue-green-012",
    title: "database reader migration · case 012",
    scenario: "Investigate database reader migration in a high-scale environment.",
    failure: "both stacks share hidden dependency; scenario 12 exposes the operational consequence.",
    subtitle: "Keep rollback viable — experiment 012",
    explanation: "Adjust the controls to see how both stacks share hidden dependency changes system quality, cost, and confidence.",
    lesson: "Keep rollback viable. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1540,
    sampleSize: 496,
    signal: 37
  }
];

export default function BlueGreenDeploymentLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

