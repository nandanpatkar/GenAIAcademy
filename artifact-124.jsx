import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Database Migration Safety Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "tree",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "hsl(240 72% 42%)",
    "secondary": "hsl(8 70% 42%)",
    "background": "hsl(240 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(240 30% 13%)",
    "muted": "hsl(240 14% 43%)",
    "line": "hsl(240 28% 86%)",
    "soft": "hsl(240 55% 92%)"
  },
  "controlTitle": "Database Migration Safety Lab controls",
  "controls": [
    {
      "label": "Backfill rate",
      "min": 0,
      "max": 100,
      "default": 45,
      "unit": "%",
      "help": "Tune backfill rate and observe system behavior."
    },
    {
      "label": "Dual-write period",
      "min": 0,
      "max": 100,
      "default": 60,
      "unit": "",
      "help": "Stress dual-write period across realistic operating ranges."
    },
    {
      "label": "Compatibility window",
      "min": 0,
      "max": 100,
      "default": 29,
      "unit": "",
      "help": "Use compatibility window to reveal boundary failures."
    }
  ],
  "visualTitle": "Database Migration Safety Lab live view",
  "metrics": [
    {
      "label": "Database score",
      "detail": "primary behavior"
    },
    {
      "label": "Migration score",
      "detail": "robustness check"
    },
    {
      "label": "Safety score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "expand→migrate→contract",
  "costScale": 1.15,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Keep versions compatible",
      "body": "Principle 1: use this when reviewing database migration safety lab behavior in production."
    },
    {
      "title": "Throttle backfills",
      "body": "Principle 2: use this when reviewing database migration safety lab behavior in production."
    },
    {
      "title": "Verify before contract",
      "body": "Principle 3: use this when reviewing database migration safety lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "database-migration-001",
    title: "column rename rollout · case 001",
    scenario: "Investigate column rename rollout in a small clean workload.",
    failure: "old binary sees new schema; scenario 1 exposes the operational consequence.",
    subtitle: "Keep versions compatible — experiment 001",
    explanation: "Adjust the controls to see how old binary sees new schema changes system quality, cost, and confidence.",
    lesson: "Keep versions compatible. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1619,
    sampleSize: 321,
    signal: 42
  },
  {
    id: "database-migration-002",
    title: "large table backfill · case 002",
    scenario: "Investigate large table backfill in a large noisy workload.",
    failure: "backfill saturates database; scenario 2 exposes the operational consequence.",
    subtitle: "Throttle backfills — experiment 002",
    explanation: "Adjust the controls to see how backfill saturates database changes system quality, cost, and confidence.",
    lesson: "Throttle backfills. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1626,
    sampleSize: 338,
    signal: 61
  },
  {
    id: "database-migration-003",
    title: "service schema split · case 003",
    scenario: "Investigate service schema split in a shifted production slice.",
    failure: "dual writes diverge; scenario 3 exposes the operational consequence.",
    subtitle: "Verify before contract — experiment 003",
    explanation: "Adjust the controls to see how dual writes diverge changes system quality, cost, and confidence.",
    lesson: "Verify before contract. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1633,
    sampleSize: 355,
    signal: 80
  },
  {
    id: "database-migration-004",
    title: "column rename rollout · case 004",
    scenario: "Investigate column rename rollout in a rare failure regime.",
    failure: "old binary sees new schema; scenario 4 exposes the operational consequence.",
    subtitle: "Keep versions compatible — experiment 004",
    explanation: "Adjust the controls to see how old binary sees new schema changes system quality, cost, and confidence.",
    lesson: "Keep versions compatible. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1640,
    sampleSize: 372,
    signal: 99
  },
  {
    id: "database-migration-005",
    title: "large table backfill · case 005",
    scenario: "Investigate large table backfill in a high-scale environment.",
    failure: "backfill saturates database; scenario 5 exposes the operational consequence.",
    subtitle: "Throttle backfills — experiment 005",
    explanation: "Adjust the controls to see how backfill saturates database changes system quality, cost, and confidence.",
    lesson: "Throttle backfills. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1647,
    sampleSize: 389,
    signal: 17
  },
  {
    id: "database-migration-006",
    title: "service schema split · case 006",
    scenario: "Investigate service schema split in a small clean workload.",
    failure: "dual writes diverge; scenario 6 exposes the operational consequence.",
    subtitle: "Verify before contract — experiment 006",
    explanation: "Adjust the controls to see how dual writes diverge changes system quality, cost, and confidence.",
    lesson: "Verify before contract. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1654,
    sampleSize: 406,
    signal: 36
  },
  {
    id: "database-migration-007",
    title: "column rename rollout · case 007",
    scenario: "Investigate column rename rollout in a large noisy workload.",
    failure: "old binary sees new schema; scenario 7 exposes the operational consequence.",
    subtitle: "Keep versions compatible — experiment 007",
    explanation: "Adjust the controls to see how old binary sees new schema changes system quality, cost, and confidence.",
    lesson: "Keep versions compatible. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1661,
    sampleSize: 423,
    signal: 55
  },
  {
    id: "database-migration-008",
    title: "large table backfill · case 008",
    scenario: "Investigate large table backfill in a shifted production slice.",
    failure: "backfill saturates database; scenario 8 exposes the operational consequence.",
    subtitle: "Throttle backfills — experiment 008",
    explanation: "Adjust the controls to see how backfill saturates database changes system quality, cost, and confidence.",
    lesson: "Throttle backfills. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1668,
    sampleSize: 440,
    signal: 74
  },
  {
    id: "database-migration-009",
    title: "service schema split · case 009",
    scenario: "Investigate service schema split in a rare failure regime.",
    failure: "dual writes diverge; scenario 9 exposes the operational consequence.",
    subtitle: "Verify before contract — experiment 009",
    explanation: "Adjust the controls to see how dual writes diverge changes system quality, cost, and confidence.",
    lesson: "Verify before contract. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1675,
    sampleSize: 457,
    signal: 93
  },
  {
    id: "database-migration-010",
    title: "column rename rollout · case 010",
    scenario: "Investigate column rename rollout in a high-scale environment.",
    failure: "old binary sees new schema; scenario 10 exposes the operational consequence.",
    subtitle: "Keep versions compatible — experiment 010",
    explanation: "Adjust the controls to see how old binary sees new schema changes system quality, cost, and confidence.",
    lesson: "Keep versions compatible. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1682,
    sampleSize: 474,
    signal: 11
  },
  {
    id: "database-migration-011",
    title: "large table backfill · case 011",
    scenario: "Investigate large table backfill in a small clean workload.",
    failure: "backfill saturates database; scenario 11 exposes the operational consequence.",
    subtitle: "Throttle backfills — experiment 011",
    explanation: "Adjust the controls to see how backfill saturates database changes system quality, cost, and confidence.",
    lesson: "Throttle backfills. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1689,
    sampleSize: 491,
    signal: 30
  },
  {
    id: "database-migration-012",
    title: "service schema split · case 012",
    scenario: "Investigate service schema split in a large noisy workload.",
    failure: "dual writes diverge; scenario 12 exposes the operational consequence.",
    subtitle: "Verify before contract — experiment 012",
    explanation: "Adjust the controls to see how dual writes diverge changes system quality, cost, and confidence.",
    lesson: "Verify before contract. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1696,
    sampleSize: 508,
    signal: 49
  }
];

export default function DatabaseMigrationSafetyLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

