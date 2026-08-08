import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Queue & Backpressure Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "timeline",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "hsl(193 72% 42%)",
    "secondary": "hsl(321 70% 42%)",
    "background": "hsl(193 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(193 30% 13%)",
    "muted": "hsl(193 14% 43%)",
    "line": "hsl(193 28% 86%)",
    "soft": "hsl(193 55% 92%)"
  },
  "controlTitle": "Queue & Backpressure Lab controls",
  "controls": [
    {
      "label": "Arrival rate",
      "min": 0,
      "max": 100,
      "default": 44,
      "unit": "%",
      "help": "Tune arrival rate and observe system behavior."
    },
    {
      "label": "Worker count",
      "min": 0,
      "max": 100,
      "default": 59,
      "unit": "",
      "help": "Stress worker count across realistic operating ranges."
    },
    {
      "label": "Queue bound",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use queue bound to reveal boundary failures."
    }
  ],
  "visualTitle": "Queue & Backpressure Lab live view",
  "metrics": [
    {
      "label": "Queue score",
      "detail": "primary behavior"
    },
    {
      "label": "Backpressure score",
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
  "formula": "backlog′=arrival−service",
  "costScale": 1.05,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Bound queues",
      "body": "Principle 1: use this when reviewing queue & backpressure lab behavior in production."
    },
    {
      "title": "Propagate pressure",
      "body": "Principle 2: use this when reviewing queue & backpressure lab behavior in production."
    },
    {
      "title": "Design overload behavior",
      "body": "Principle 3: use this when reviewing queue & backpressure lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "queue-backpressure-001",
    title: "document processing queue · case 001",
    scenario: "Investigate document processing queue in a high-scale environment.",
    failure: "unbounded queue hides overload; scenario 1 exposes the operational consequence.",
    subtitle: "Bound queues — experiment 001",
    explanation: "Adjust the controls to see how unbounded queue hides overload changes system quality, cost, and confidence.",
    lesson: "Bound queues. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1606,
    sampleSize: 320,
    signal: 41
  },
  {
    id: "queue-backpressure-002",
    title: "notification delivery stream · case 002",
    scenario: "Investigate notification delivery stream in a small clean workload.",
    failure: "retry adds more work; scenario 2 exposes the operational consequence.",
    subtitle: "Propagate pressure — experiment 002",
    explanation: "Adjust the controls to see how retry adds more work changes system quality, cost, and confidence.",
    lesson: "Propagate pressure. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1613,
    sampleSize: 337,
    signal: 60
  },
  {
    id: "queue-backpressure-003",
    title: "GPU inference batcher · case 003",
    scenario: "Investigate GPU inference batcher in a large noisy workload.",
    failure: "priority starves normal jobs; scenario 3 exposes the operational consequence.",
    subtitle: "Design overload behavior — experiment 003",
    explanation: "Adjust the controls to see how priority starves normal jobs changes system quality, cost, and confidence.",
    lesson: "Design overload behavior. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1620,
    sampleSize: 354,
    signal: 79
  },
  {
    id: "queue-backpressure-004",
    title: "document processing queue · case 004",
    scenario: "Investigate document processing queue in a shifted production slice.",
    failure: "unbounded queue hides overload; scenario 4 exposes the operational consequence.",
    subtitle: "Bound queues — experiment 004",
    explanation: "Adjust the controls to see how unbounded queue hides overload changes system quality, cost, and confidence.",
    lesson: "Bound queues. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1627,
    sampleSize: 371,
    signal: 98
  },
  {
    id: "queue-backpressure-005",
    title: "notification delivery stream · case 005",
    scenario: "Investigate notification delivery stream in a rare failure regime.",
    failure: "retry adds more work; scenario 5 exposes the operational consequence.",
    subtitle: "Propagate pressure — experiment 005",
    explanation: "Adjust the controls to see how retry adds more work changes system quality, cost, and confidence.",
    lesson: "Propagate pressure. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1634,
    sampleSize: 388,
    signal: 16
  },
  {
    id: "queue-backpressure-006",
    title: "GPU inference batcher · case 006",
    scenario: "Investigate GPU inference batcher in a high-scale environment.",
    failure: "priority starves normal jobs; scenario 6 exposes the operational consequence.",
    subtitle: "Design overload behavior — experiment 006",
    explanation: "Adjust the controls to see how priority starves normal jobs changes system quality, cost, and confidence.",
    lesson: "Design overload behavior. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1641,
    sampleSize: 405,
    signal: 35
  },
  {
    id: "queue-backpressure-007",
    title: "document processing queue · case 007",
    scenario: "Investigate document processing queue in a small clean workload.",
    failure: "unbounded queue hides overload; scenario 7 exposes the operational consequence.",
    subtitle: "Bound queues — experiment 007",
    explanation: "Adjust the controls to see how unbounded queue hides overload changes system quality, cost, and confidence.",
    lesson: "Bound queues. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1648,
    sampleSize: 422,
    signal: 54
  },
  {
    id: "queue-backpressure-008",
    title: "notification delivery stream · case 008",
    scenario: "Investigate notification delivery stream in a large noisy workload.",
    failure: "retry adds more work; scenario 8 exposes the operational consequence.",
    subtitle: "Propagate pressure — experiment 008",
    explanation: "Adjust the controls to see how retry adds more work changes system quality, cost, and confidence.",
    lesson: "Propagate pressure. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1655,
    sampleSize: 439,
    signal: 73
  },
  {
    id: "queue-backpressure-009",
    title: "GPU inference batcher · case 009",
    scenario: "Investigate GPU inference batcher in a shifted production slice.",
    failure: "priority starves normal jobs; scenario 9 exposes the operational consequence.",
    subtitle: "Design overload behavior — experiment 009",
    explanation: "Adjust the controls to see how priority starves normal jobs changes system quality, cost, and confidence.",
    lesson: "Design overload behavior. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1662,
    sampleSize: 456,
    signal: 92
  },
  {
    id: "queue-backpressure-010",
    title: "document processing queue · case 010",
    scenario: "Investigate document processing queue in a rare failure regime.",
    failure: "unbounded queue hides overload; scenario 10 exposes the operational consequence.",
    subtitle: "Bound queues — experiment 010",
    explanation: "Adjust the controls to see how unbounded queue hides overload changes system quality, cost, and confidence.",
    lesson: "Bound queues. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1669,
    sampleSize: 473,
    signal: 10
  },
  {
    id: "queue-backpressure-011",
    title: "notification delivery stream · case 011",
    scenario: "Investigate notification delivery stream in a high-scale environment.",
    failure: "retry adds more work; scenario 11 exposes the operational consequence.",
    subtitle: "Propagate pressure — experiment 011",
    explanation: "Adjust the controls to see how retry adds more work changes system quality, cost, and confidence.",
    lesson: "Propagate pressure. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1676,
    sampleSize: 490,
    signal: 29
  },
  {
    id: "queue-backpressure-012",
    title: "GPU inference batcher · case 012",
    scenario: "Investigate GPU inference batcher in a small clean workload.",
    failure: "priority starves normal jobs; scenario 12 exposes the operational consequence.",
    subtitle: "Design overload behavior — experiment 012",
    explanation: "Adjust the controls to see how priority starves normal jobs changes system quality, cost, and confidence.",
    lesson: "Design overload behavior. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1683,
    sampleSize: 507,
    signal: 48
  }
];

export default function QueueBackpressureLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

