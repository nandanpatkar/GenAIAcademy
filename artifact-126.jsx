import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Distributed Tracing Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "matrix",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "hsl(334 72% 42%)",
    "secondary": "hsl(102 70% 42%)",
    "background": "hsl(334 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(334 30% 13%)",
    "muted": "hsl(334 14% 43%)",
    "line": "hsl(334 28% 86%)",
    "soft": "hsl(334 55% 92%)"
  },
  "controlTitle": "Distributed Tracing Lab controls",
  "controls": [
    {
      "label": "Sampling rate",
      "min": 0,
      "max": 100,
      "default": 47,
      "unit": "%",
      "help": "Tune sampling rate and observe system behavior."
    },
    {
      "label": "Span detail",
      "min": 0,
      "max": 100,
      "default": 62,
      "unit": "",
      "help": "Stress span detail across realistic operating ranges."
    },
    {
      "label": "Propagation reliability",
      "min": 0,
      "max": 100,
      "default": 31,
      "unit": "",
      "help": "Use propagation reliability to reveal boundary failures."
    }
  ],
  "visualTitle": "Distributed Tracing Lab live view",
  "metrics": [
    {
      "label": "Distributed score",
      "detail": "primary behavior"
    },
    {
      "label": "Tracing score",
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
  "formula": "trace_id→Σ(service spans)",
  "costScale": 0.65,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Propagate context everywhere",
      "body": "Principle 1: use this when reviewing distributed tracing lab behavior in production."
    },
    {
      "title": "Sample intelligently",
      "body": "Principle 2: use this when reviewing distributed tracing lab behavior in production."
    },
    {
      "title": "Record boundaries and outcomes",
      "body": "Principle 3: use this when reviewing distributed tracing lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "distributed-tracing-001",
    title: "microservice request path · case 001",
    scenario: "Investigate microservice request path in a shifted production slice.",
    failure: "trace context breaks at queue; scenario 1 exposes the operational consequence.",
    subtitle: "Propagate context everywhere — experiment 001",
    explanation: "Adjust the controls to see how trace context breaks at queue changes system quality, cost, and confidence.",
    lesson: "Propagate context everywhere. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1645,
    sampleSize: 323,
    signal: 44
  },
  {
    id: "distributed-tracing-002",
    title: "agent tool workflow · case 002",
    scenario: "Investigate agent tool workflow in a rare failure regime.",
    failure: "high sampling cost spikes; scenario 2 exposes the operational consequence.",
    subtitle: "Sample intelligently — experiment 002",
    explanation: "Adjust the controls to see how high sampling cost spikes changes system quality, cost, and confidence.",
    lesson: "Sample intelligently. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1652,
    sampleSize: 340,
    signal: 63
  },
  {
    id: "distributed-tracing-003",
    title: "stream processing chain · case 003",
    scenario: "Investigate stream processing chain in a high-scale environment.",
    failure: "span names lack semantics; scenario 3 exposes the operational consequence.",
    subtitle: "Record boundaries and outcomes — experiment 003",
    explanation: "Adjust the controls to see how span names lack semantics changes system quality, cost, and confidence.",
    lesson: "Record boundaries and outcomes. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1659,
    sampleSize: 357,
    signal: 82
  },
  {
    id: "distributed-tracing-004",
    title: "microservice request path · case 004",
    scenario: "Investigate microservice request path in a small clean workload.",
    failure: "trace context breaks at queue; scenario 4 exposes the operational consequence.",
    subtitle: "Propagate context everywhere — experiment 004",
    explanation: "Adjust the controls to see how trace context breaks at queue changes system quality, cost, and confidence.",
    lesson: "Propagate context everywhere. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1666,
    sampleSize: 374,
    signal: 0
  },
  {
    id: "distributed-tracing-005",
    title: "agent tool workflow · case 005",
    scenario: "Investigate agent tool workflow in a large noisy workload.",
    failure: "high sampling cost spikes; scenario 5 exposes the operational consequence.",
    subtitle: "Sample intelligently — experiment 005",
    explanation: "Adjust the controls to see how high sampling cost spikes changes system quality, cost, and confidence.",
    lesson: "Sample intelligently. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1673,
    sampleSize: 391,
    signal: 19
  },
  {
    id: "distributed-tracing-006",
    title: "stream processing chain · case 006",
    scenario: "Investigate stream processing chain in a shifted production slice.",
    failure: "span names lack semantics; scenario 6 exposes the operational consequence.",
    subtitle: "Record boundaries and outcomes — experiment 006",
    explanation: "Adjust the controls to see how span names lack semantics changes system quality, cost, and confidence.",
    lesson: "Record boundaries and outcomes. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1680,
    sampleSize: 408,
    signal: 38
  },
  {
    id: "distributed-tracing-007",
    title: "microservice request path · case 007",
    scenario: "Investigate microservice request path in a rare failure regime.",
    failure: "trace context breaks at queue; scenario 7 exposes the operational consequence.",
    subtitle: "Propagate context everywhere — experiment 007",
    explanation: "Adjust the controls to see how trace context breaks at queue changes system quality, cost, and confidence.",
    lesson: "Propagate context everywhere. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1687,
    sampleSize: 425,
    signal: 57
  },
  {
    id: "distributed-tracing-008",
    title: "agent tool workflow · case 008",
    scenario: "Investigate agent tool workflow in a high-scale environment.",
    failure: "high sampling cost spikes; scenario 8 exposes the operational consequence.",
    subtitle: "Sample intelligently — experiment 008",
    explanation: "Adjust the controls to see how high sampling cost spikes changes system quality, cost, and confidence.",
    lesson: "Sample intelligently. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1694,
    sampleSize: 442,
    signal: 76
  },
  {
    id: "distributed-tracing-009",
    title: "stream processing chain · case 009",
    scenario: "Investigate stream processing chain in a small clean workload.",
    failure: "span names lack semantics; scenario 9 exposes the operational consequence.",
    subtitle: "Record boundaries and outcomes — experiment 009",
    explanation: "Adjust the controls to see how span names lack semantics changes system quality, cost, and confidence.",
    lesson: "Record boundaries and outcomes. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1701,
    sampleSize: 459,
    signal: 95
  },
  {
    id: "distributed-tracing-010",
    title: "microservice request path · case 010",
    scenario: "Investigate microservice request path in a large noisy workload.",
    failure: "trace context breaks at queue; scenario 10 exposes the operational consequence.",
    subtitle: "Propagate context everywhere — experiment 010",
    explanation: "Adjust the controls to see how trace context breaks at queue changes system quality, cost, and confidence.",
    lesson: "Propagate context everywhere. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1708,
    sampleSize: 476,
    signal: 13
  },
  {
    id: "distributed-tracing-011",
    title: "agent tool workflow · case 011",
    scenario: "Investigate agent tool workflow in a shifted production slice.",
    failure: "high sampling cost spikes; scenario 11 exposes the operational consequence.",
    subtitle: "Sample intelligently — experiment 011",
    explanation: "Adjust the controls to see how high sampling cost spikes changes system quality, cost, and confidence.",
    lesson: "Sample intelligently. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1715,
    sampleSize: 493,
    signal: 32
  },
  {
    id: "distributed-tracing-012",
    title: "stream processing chain · case 012",
    scenario: "Investigate stream processing chain in a rare failure regime.",
    failure: "span names lack semantics; scenario 12 exposes the operational consequence.",
    subtitle: "Record boundaries and outcomes — experiment 012",
    explanation: "Adjust the controls to see how span names lack semantics changes system quality, cost, and confidence.",
    lesson: "Record boundaries and outcomes. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1722,
    sampleSize: 510,
    signal: 51
  }
];

export default function DistributedTracingLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

