import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "API Contract Testing Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "distribution",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "hsl(52 72% 42%)",
    "secondary": "hsl(180 70% 42%)",
    "background": "hsl(52 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(52 30% 13%)",
    "muted": "hsl(52 14% 43%)",
    "line": "hsl(52 28% 86%)",
    "soft": "hsl(52 55% 92%)"
  },
  "controlTitle": "API Contract Testing Lab controls",
  "controls": [
    {
      "label": "Consumer count",
      "min": 0,
      "max": 100,
      "default": 41,
      "unit": "%",
      "help": "Tune consumer count and observe system behavior."
    },
    {
      "label": "Schema strictness",
      "min": 0,
      "max": 100,
      "default": 67,
      "unit": "",
      "help": "Stress schema strictness across realistic operating ranges."
    },
    {
      "label": "Version overlap",
      "min": 0,
      "max": 100,
      "default": 25,
      "unit": "",
      "help": "Use version overlap to reveal boundary failures."
    }
  ],
  "visualTitle": "API Contract Testing Lab live view",
  "metrics": [
    {
      "label": "Contract score",
      "detail": "primary behavior"
    },
    {
      "label": "Testing score",
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
  "formula": "compatible=consumer_expectations⊆provider",
  "costScale": 0.75,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Contracts capture usage",
      "body": "Principle 1: use this when reviewing api contract testing lab behavior in production."
    },
    {
      "title": "Test compatibility before deploy",
      "body": "Principle 2: use this when reviewing api contract testing lab behavior in production."
    },
    {
      "title": "Version deliberately",
      "body": "Principle 3: use this when reviewing api contract testing lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "contract-testing-001",
    title: "payment service API · case 001",
    scenario: "Investigate payment service API in a large noisy workload.",
    failure: "provider removes optional field; scenario 1 exposes the operational consequence.",
    subtitle: "Contracts capture usage — experiment 001",
    explanation: "Adjust the controls to see how provider removes optional field changes system quality, cost, and confidence.",
    lesson: "Contracts capture usage. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1567,
    sampleSize: 317,
    signal: 38
  },
  {
    id: "contract-testing-002",
    title: "event schema evolution · case 002",
    scenario: "Investigate event schema evolution in a shifted production slice.",
    failure: "consumer assumes undocumented behavior; scenario 2 exposes the operational consequence.",
    subtitle: "Test compatibility before deploy — experiment 002",
    explanation: "Adjust the controls to see how consumer assumes undocumented behavior changes system quality, cost, and confidence.",
    lesson: "Test compatibility before deploy. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1574,
    sampleSize: 334,
    signal: 57
  },
  {
    id: "contract-testing-003",
    title: "model inference endpoint · case 003",
    scenario: "Investigate model inference endpoint in a rare failure regime.",
    failure: "shared environment makes tests flaky; scenario 3 exposes the operational consequence.",
    subtitle: "Version deliberately — experiment 003",
    explanation: "Adjust the controls to see how shared environment makes tests flaky changes system quality, cost, and confidence.",
    lesson: "Version deliberately. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1581,
    sampleSize: 351,
    signal: 76
  },
  {
    id: "contract-testing-004",
    title: "payment service API · case 004",
    scenario: "Investigate payment service API in a high-scale environment.",
    failure: "provider removes optional field; scenario 4 exposes the operational consequence.",
    subtitle: "Contracts capture usage — experiment 004",
    explanation: "Adjust the controls to see how provider removes optional field changes system quality, cost, and confidence.",
    lesson: "Contracts capture usage. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1588,
    sampleSize: 368,
    signal: 95
  },
  {
    id: "contract-testing-005",
    title: "event schema evolution · case 005",
    scenario: "Investigate event schema evolution in a small clean workload.",
    failure: "consumer assumes undocumented behavior; scenario 5 exposes the operational consequence.",
    subtitle: "Test compatibility before deploy — experiment 005",
    explanation: "Adjust the controls to see how consumer assumes undocumented behavior changes system quality, cost, and confidence.",
    lesson: "Test compatibility before deploy. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1595,
    sampleSize: 385,
    signal: 13
  },
  {
    id: "contract-testing-006",
    title: "model inference endpoint · case 006",
    scenario: "Investigate model inference endpoint in a large noisy workload.",
    failure: "shared environment makes tests flaky; scenario 6 exposes the operational consequence.",
    subtitle: "Version deliberately — experiment 006",
    explanation: "Adjust the controls to see how shared environment makes tests flaky changes system quality, cost, and confidence.",
    lesson: "Version deliberately. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1602,
    sampleSize: 402,
    signal: 32
  },
  {
    id: "contract-testing-007",
    title: "payment service API · case 007",
    scenario: "Investigate payment service API in a shifted production slice.",
    failure: "provider removes optional field; scenario 7 exposes the operational consequence.",
    subtitle: "Contracts capture usage — experiment 007",
    explanation: "Adjust the controls to see how provider removes optional field changes system quality, cost, and confidence.",
    lesson: "Contracts capture usage. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1609,
    sampleSize: 419,
    signal: 51
  },
  {
    id: "contract-testing-008",
    title: "event schema evolution · case 008",
    scenario: "Investigate event schema evolution in a rare failure regime.",
    failure: "consumer assumes undocumented behavior; scenario 8 exposes the operational consequence.",
    subtitle: "Test compatibility before deploy — experiment 008",
    explanation: "Adjust the controls to see how consumer assumes undocumented behavior changes system quality, cost, and confidence.",
    lesson: "Test compatibility before deploy. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1616,
    sampleSize: 436,
    signal: 70
  },
  {
    id: "contract-testing-009",
    title: "model inference endpoint · case 009",
    scenario: "Investigate model inference endpoint in a high-scale environment.",
    failure: "shared environment makes tests flaky; scenario 9 exposes the operational consequence.",
    subtitle: "Version deliberately — experiment 009",
    explanation: "Adjust the controls to see how shared environment makes tests flaky changes system quality, cost, and confidence.",
    lesson: "Version deliberately. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1623,
    sampleSize: 453,
    signal: 89
  },
  {
    id: "contract-testing-010",
    title: "payment service API · case 010",
    scenario: "Investigate payment service API in a small clean workload.",
    failure: "provider removes optional field; scenario 10 exposes the operational consequence.",
    subtitle: "Contracts capture usage — experiment 010",
    explanation: "Adjust the controls to see how provider removes optional field changes system quality, cost, and confidence.",
    lesson: "Contracts capture usage. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1630,
    sampleSize: 470,
    signal: 7
  },
  {
    id: "contract-testing-011",
    title: "event schema evolution · case 011",
    scenario: "Investigate event schema evolution in a large noisy workload.",
    failure: "consumer assumes undocumented behavior; scenario 11 exposes the operational consequence.",
    subtitle: "Test compatibility before deploy — experiment 011",
    explanation: "Adjust the controls to see how consumer assumes undocumented behavior changes system quality, cost, and confidence.",
    lesson: "Test compatibility before deploy. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1637,
    sampleSize: 487,
    signal: 26
  },
  {
    id: "contract-testing-012",
    title: "model inference endpoint · case 012",
    scenario: "Investigate model inference endpoint in a shifted production slice.",
    failure: "shared environment makes tests flaky; scenario 12 exposes the operational consequence.",
    subtitle: "Version deliberately — experiment 012",
    explanation: "Adjust the controls to see how shared environment makes tests flaky changes system quality, cost, and confidence.",
    lesson: "Version deliberately. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1644,
    sampleSize: 504,
    signal: 45
  }
];

export default function ApiContractTestingLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

