import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Test Pyramid Planner",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "image",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "hsl(5 88% 66%)",
    "secondary": "hsl(133 78% 62%)",
    "background": "hsl(5 24% 7%)",
    "panel": "hsl(5 22% 12%)",
    "ink": "hsl(5 35% 94%)",
    "muted": "hsl(5 16% 68%)",
    "line": "hsl(5 20% 25%)",
    "soft": "hsl(5 25% 18%)"
  },
  "controlTitle": "Test Pyramid Planner controls",
  "controls": [
    {
      "label": "Unit coverage",
      "min": 0,
      "max": 100,
      "default": 40,
      "unit": "%",
      "help": "Tune unit coverage and observe system behavior."
    },
    {
      "label": "Integration depth",
      "min": 0,
      "max": 100,
      "default": 66,
      "unit": "",
      "help": "Stress integration depth across realistic operating ranges."
    },
    {
      "label": "End-to-end count",
      "min": 0,
      "max": 100,
      "default": 24,
      "unit": "",
      "help": "Use end-to-end count to reveal boundary failures."
    }
  ],
  "visualTitle": "Test Pyramid Planner live view",
  "metrics": [
    {
      "label": "Test score",
      "detail": "primary behavior"
    },
    {
      "label": "Pyramid score",
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
  "formula": "confidence/unit_cost = coverage_per_layer",
  "costScale": 0.65,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Test at the cheapest useful layer",
      "body": "Principle 1: use this when reviewing test pyramid planner behavior in production."
    },
    {
      "title": "Keep contracts real",
      "body": "Principle 2: use this when reviewing test pyramid planner behavior in production."
    },
    {
      "title": "Reserve E2E for journeys",
      "body": "Principle 3: use this when reviewing test pyramid planner behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "test-pyramid-001",
    title: "service business logic · case 001",
    scenario: "Investigate service business logic in a small clean workload.",
    failure: "too many UI tests are brittle; scenario 1 exposes the operational consequence.",
    subtitle: "Test at the cheapest useful layer — experiment 001",
    explanation: "Adjust the controls to see how too many UI tests are brittle changes system quality, cost, and confidence.",
    lesson: "Test at the cheapest useful layer. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1554,
    sampleSize: 316,
    signal: 37
  },
  {
    id: "test-pyramid-002",
    title: "data pipeline system · case 002",
    scenario: "Investigate data pipeline system in a large noisy workload.",
    failure: "mocks hide integration issue; scenario 2 exposes the operational consequence.",
    subtitle: "Keep contracts real — experiment 002",
    explanation: "Adjust the controls to see how mocks hide integration issue changes system quality, cost, and confidence.",
    lesson: "Keep contracts real. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1561,
    sampleSize: 333,
    signal: 56
  },
  {
    id: "test-pyramid-003",
    title: "agent tool workflow · case 003",
    scenario: "Investigate agent tool workflow in a shifted production slice.",
    failure: "unit count creates false confidence; scenario 3 exposes the operational consequence.",
    subtitle: "Reserve E2E for journeys — experiment 003",
    explanation: "Adjust the controls to see how unit count creates false confidence changes system quality, cost, and confidence.",
    lesson: "Reserve E2E for journeys. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1568,
    sampleSize: 350,
    signal: 75
  },
  {
    id: "test-pyramid-004",
    title: "service business logic · case 004",
    scenario: "Investigate service business logic in a rare failure regime.",
    failure: "too many UI tests are brittle; scenario 4 exposes the operational consequence.",
    subtitle: "Test at the cheapest useful layer — experiment 004",
    explanation: "Adjust the controls to see how too many UI tests are brittle changes system quality, cost, and confidence.",
    lesson: "Test at the cheapest useful layer. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1575,
    sampleSize: 367,
    signal: 94
  },
  {
    id: "test-pyramid-005",
    title: "data pipeline system · case 005",
    scenario: "Investigate data pipeline system in a high-scale environment.",
    failure: "mocks hide integration issue; scenario 5 exposes the operational consequence.",
    subtitle: "Keep contracts real — experiment 005",
    explanation: "Adjust the controls to see how mocks hide integration issue changes system quality, cost, and confidence.",
    lesson: "Keep contracts real. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1582,
    sampleSize: 384,
    signal: 12
  },
  {
    id: "test-pyramid-006",
    title: "agent tool workflow · case 006",
    scenario: "Investigate agent tool workflow in a small clean workload.",
    failure: "unit count creates false confidence; scenario 6 exposes the operational consequence.",
    subtitle: "Reserve E2E for journeys — experiment 006",
    explanation: "Adjust the controls to see how unit count creates false confidence changes system quality, cost, and confidence.",
    lesson: "Reserve E2E for journeys. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1589,
    sampleSize: 401,
    signal: 31
  },
  {
    id: "test-pyramid-007",
    title: "service business logic · case 007",
    scenario: "Investigate service business logic in a large noisy workload.",
    failure: "too many UI tests are brittle; scenario 7 exposes the operational consequence.",
    subtitle: "Test at the cheapest useful layer — experiment 007",
    explanation: "Adjust the controls to see how too many UI tests are brittle changes system quality, cost, and confidence.",
    lesson: "Test at the cheapest useful layer. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1596,
    sampleSize: 418,
    signal: 50
  },
  {
    id: "test-pyramid-008",
    title: "data pipeline system · case 008",
    scenario: "Investigate data pipeline system in a shifted production slice.",
    failure: "mocks hide integration issue; scenario 8 exposes the operational consequence.",
    subtitle: "Keep contracts real — experiment 008",
    explanation: "Adjust the controls to see how mocks hide integration issue changes system quality, cost, and confidence.",
    lesson: "Keep contracts real. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1603,
    sampleSize: 435,
    signal: 69
  },
  {
    id: "test-pyramid-009",
    title: "agent tool workflow · case 009",
    scenario: "Investigate agent tool workflow in a rare failure regime.",
    failure: "unit count creates false confidence; scenario 9 exposes the operational consequence.",
    subtitle: "Reserve E2E for journeys — experiment 009",
    explanation: "Adjust the controls to see how unit count creates false confidence changes system quality, cost, and confidence.",
    lesson: "Reserve E2E for journeys. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1610,
    sampleSize: 452,
    signal: 88
  },
  {
    id: "test-pyramid-010",
    title: "service business logic · case 010",
    scenario: "Investigate service business logic in a high-scale environment.",
    failure: "too many UI tests are brittle; scenario 10 exposes the operational consequence.",
    subtitle: "Test at the cheapest useful layer — experiment 010",
    explanation: "Adjust the controls to see how too many UI tests are brittle changes system quality, cost, and confidence.",
    lesson: "Test at the cheapest useful layer. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1617,
    sampleSize: 469,
    signal: 6
  },
  {
    id: "test-pyramid-011",
    title: "data pipeline system · case 011",
    scenario: "Investigate data pipeline system in a small clean workload.",
    failure: "mocks hide integration issue; scenario 11 exposes the operational consequence.",
    subtitle: "Keep contracts real — experiment 011",
    explanation: "Adjust the controls to see how mocks hide integration issue changes system quality, cost, and confidence.",
    lesson: "Keep contracts real. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1624,
    sampleSize: 486,
    signal: 25
  },
  {
    id: "test-pyramid-012",
    title: "agent tool workflow · case 012",
    scenario: "Investigate agent tool workflow in a large noisy workload.",
    failure: "unit count creates false confidence; scenario 12 exposes the operational consequence.",
    subtitle: "Reserve E2E for journeys — experiment 012",
    explanation: "Adjust the controls to see how unit count creates false confidence changes system quality, cost, and confidence.",
    lesson: "Reserve E2E for journeys. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1631,
    sampleSize: 503,
    signal: 44
  }
];

export default function TestPyramidPlannerLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

