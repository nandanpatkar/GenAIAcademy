import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Canary Release Simulator",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "distribution",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "hsl(349 72% 42%)",
    "secondary": "hsl(117 70% 42%)",
    "background": "hsl(349 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(349 30% 13%)",
    "muted": "hsl(349 14% 43%)",
    "line": "hsl(349 28% 86%)",
    "soft": "hsl(349 55% 92%)"
  },
  "controlTitle": "Canary Release Simulator controls",
  "controls": [
    {
      "label": "Canary traffic",
      "min": 0,
      "max": 100,
      "default": 45,
      "unit": "%",
      "help": "Tune canary traffic and observe system behavior."
    },
    {
      "label": "Error threshold",
      "min": 0,
      "max": 100,
      "default": 58,
      "unit": "",
      "help": "Stress error threshold across realistic operating ranges."
    },
    {
      "label": "Observation window",
      "min": 0,
      "max": 100,
      "default": 33,
      "unit": "",
      "help": "Use observation window to reveal boundary failures."
    }
  ],
  "visualTitle": "Canary Release Simulator live view",
  "metrics": [
    {
      "label": "Canary score",
      "detail": "primary behavior"
    },
    {
      "label": "Release score",
      "detail": "robustness check"
    },
    {
      "label": "Simulator score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "risk=traffic_share·error_delta",
  "costScale": 1.25,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Canary by risk slice",
      "body": "Principle 1: use this when reviewing canary release simulator behavior in production."
    },
    {
      "title": "Predefine rollback",
      "body": "Principle 2: use this when reviewing canary release simulator behavior in production."
    },
    {
      "title": "Compare against control",
      "body": "Principle 3: use this when reviewing canary release simulator behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "canary-release-001",
    title: "new inference version · case 001",
    scenario: "Investigate new inference version in a shifted production slice.",
    failure: "tiny canary misses segment; scenario 1 exposes the operational consequence.",
    subtitle: "Canary by risk slice — experiment 001",
    explanation: "Adjust the controls to see how tiny canary misses segment changes system quality, cost, and confidence.",
    lesson: "Canary by risk slice. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1450,
    sampleSize: 308,
    signal: 29
  },
  {
    id: "canary-release-002",
    title: "schema-compatible API release · case 002",
    scenario: "Investigate schema-compatible API release in a rare failure regime.",
    failure: "metric lag hides failure; scenario 2 exposes the operational consequence.",
    subtitle: "Predefine rollback — experiment 002",
    explanation: "Adjust the controls to see how metric lag hides failure changes system quality, cost, and confidence.",
    lesson: "Predefine rollback. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1457,
    sampleSize: 325,
    signal: 48
  },
  {
    id: "canary-release-003",
    title: "frontend rollout · case 003",
    scenario: "Investigate frontend rollout in a high-scale environment.",
    failure: "rollback trigger is noisy; scenario 3 exposes the operational consequence.",
    subtitle: "Compare against control — experiment 003",
    explanation: "Adjust the controls to see how rollback trigger is noisy changes system quality, cost, and confidence.",
    lesson: "Compare against control. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1464,
    sampleSize: 342,
    signal: 67
  },
  {
    id: "canary-release-004",
    title: "new inference version · case 004",
    scenario: "Investigate new inference version in a small clean workload.",
    failure: "tiny canary misses segment; scenario 4 exposes the operational consequence.",
    subtitle: "Canary by risk slice — experiment 004",
    explanation: "Adjust the controls to see how tiny canary misses segment changes system quality, cost, and confidence.",
    lesson: "Canary by risk slice. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1471,
    sampleSize: 359,
    signal: 86
  },
  {
    id: "canary-release-005",
    title: "schema-compatible API release · case 005",
    scenario: "Investigate schema-compatible API release in a large noisy workload.",
    failure: "metric lag hides failure; scenario 5 exposes the operational consequence.",
    subtitle: "Predefine rollback — experiment 005",
    explanation: "Adjust the controls to see how metric lag hides failure changes system quality, cost, and confidence.",
    lesson: "Predefine rollback. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1478,
    sampleSize: 376,
    signal: 4
  },
  {
    id: "canary-release-006",
    title: "frontend rollout · case 006",
    scenario: "Investigate frontend rollout in a shifted production slice.",
    failure: "rollback trigger is noisy; scenario 6 exposes the operational consequence.",
    subtitle: "Compare against control — experiment 006",
    explanation: "Adjust the controls to see how rollback trigger is noisy changes system quality, cost, and confidence.",
    lesson: "Compare against control. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1485,
    sampleSize: 393,
    signal: 23
  },
  {
    id: "canary-release-007",
    title: "new inference version · case 007",
    scenario: "Investigate new inference version in a rare failure regime.",
    failure: "tiny canary misses segment; scenario 7 exposes the operational consequence.",
    subtitle: "Canary by risk slice — experiment 007",
    explanation: "Adjust the controls to see how tiny canary misses segment changes system quality, cost, and confidence.",
    lesson: "Canary by risk slice. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1492,
    sampleSize: 410,
    signal: 42
  },
  {
    id: "canary-release-008",
    title: "schema-compatible API release · case 008",
    scenario: "Investigate schema-compatible API release in a high-scale environment.",
    failure: "metric lag hides failure; scenario 8 exposes the operational consequence.",
    subtitle: "Predefine rollback — experiment 008",
    explanation: "Adjust the controls to see how metric lag hides failure changes system quality, cost, and confidence.",
    lesson: "Predefine rollback. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1499,
    sampleSize: 427,
    signal: 61
  },
  {
    id: "canary-release-009",
    title: "frontend rollout · case 009",
    scenario: "Investigate frontend rollout in a small clean workload.",
    failure: "rollback trigger is noisy; scenario 9 exposes the operational consequence.",
    subtitle: "Compare against control — experiment 009",
    explanation: "Adjust the controls to see how rollback trigger is noisy changes system quality, cost, and confidence.",
    lesson: "Compare against control. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1506,
    sampleSize: 444,
    signal: 80
  },
  {
    id: "canary-release-010",
    title: "new inference version · case 010",
    scenario: "Investigate new inference version in a large noisy workload.",
    failure: "tiny canary misses segment; scenario 10 exposes the operational consequence.",
    subtitle: "Canary by risk slice — experiment 010",
    explanation: "Adjust the controls to see how tiny canary misses segment changes system quality, cost, and confidence.",
    lesson: "Canary by risk slice. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1513,
    sampleSize: 461,
    signal: 99
  },
  {
    id: "canary-release-011",
    title: "schema-compatible API release · case 011",
    scenario: "Investigate schema-compatible API release in a shifted production slice.",
    failure: "metric lag hides failure; scenario 11 exposes the operational consequence.",
    subtitle: "Predefine rollback — experiment 011",
    explanation: "Adjust the controls to see how metric lag hides failure changes system quality, cost, and confidence.",
    lesson: "Predefine rollback. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1520,
    sampleSize: 478,
    signal: 17
  },
  {
    id: "canary-release-012",
    title: "frontend rollout · case 012",
    scenario: "Investigate frontend rollout in a rare failure regime.",
    failure: "rollback trigger is noisy; scenario 12 exposes the operational consequence.",
    subtitle: "Compare against control — experiment 012",
    explanation: "Adjust the controls to see how rollback trigger is noisy changes system quality, cost, and confidence.",
    lesson: "Compare against control. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1527,
    sampleSize: 495,
    signal: 36
  }
];

export default function CanaryReleaseLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

