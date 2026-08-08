import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Four Signals Observatory",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "timeline",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "hsl(130 72% 42%)",
    "secondary": "hsl(258 70% 42%)",
    "background": "hsl(130 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(130 30% 13%)",
    "muted": "hsl(130 14% 43%)",
    "line": "hsl(130 28% 86%)",
    "soft": "hsl(130 55% 92%)"
  },
  "controlTitle": "Four Signals Observatory controls",
  "controls": [
    {
      "label": "Traffic load",
      "min": 0,
      "max": 100,
      "default": 48,
      "unit": "%",
      "help": "Tune traffic load and observe system behavior."
    },
    {
      "label": "Latency tail",
      "min": 0,
      "max": 100,
      "default": 61,
      "unit": "",
      "help": "Stress latency tail across realistic operating ranges."
    },
    {
      "label": "Saturation level",
      "min": 0,
      "max": 100,
      "default": 36,
      "unit": "",
      "help": "Use saturation level to reveal boundary failures."
    }
  ],
  "visualTitle": "Four Signals Observatory live view",
  "metrics": [
    {
      "label": "Four score",
      "detail": "primary behavior"
    },
    {
      "label": "Signals score",
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
  "formula": "health=f(latency,traffic,errors,saturation)",
  "costScale": 0.8500000000000001,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Monitor symptoms first",
      "body": "Principle 1: use this when reviewing four signals observatory behavior in production."
    },
    {
      "title": "Correlate signals",
      "body": "Principle 2: use this when reviewing four signals observatory behavior in production."
    },
    {
      "title": "Every alert needs action",
      "body": "Principle 3: use this when reviewing four signals observatory behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "observability-signals-001",
    title: "public API dashboard · case 001",
    scenario: "Investigate public API dashboard in a small clean workload.",
    failure: "average latency hides tail; scenario 1 exposes the operational consequence.",
    subtitle: "Monitor symptoms first — experiment 001",
    explanation: "Adjust the controls to see how average latency hides tail changes system quality, cost, and confidence.",
    lesson: "Monitor symptoms first. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1489,
    sampleSize: 311,
    signal: 32
  },
  {
    id: "observability-signals-002",
    title: "model endpoint monitor · case 002",
    scenario: "Investigate model endpoint monitor in a large noisy workload.",
    failure: "logs lack correlation ID; scenario 2 exposes the operational consequence.",
    subtitle: "Correlate signals — experiment 002",
    explanation: "Adjust the controls to see how logs lack correlation ID changes system quality, cost, and confidence.",
    lesson: "Correlate signals. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1496,
    sampleSize: 328,
    signal: 51
  },
  {
    id: "observability-signals-003",
    title: "stream processing service · case 003",
    scenario: "Investigate stream processing service in a shifted production slice.",
    failure: "metric has no action; scenario 3 exposes the operational consequence.",
    subtitle: "Every alert needs action — experiment 003",
    explanation: "Adjust the controls to see how metric has no action changes system quality, cost, and confidence.",
    lesson: "Every alert needs action. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1503,
    sampleSize: 345,
    signal: 70
  },
  {
    id: "observability-signals-004",
    title: "public API dashboard · case 004",
    scenario: "Investigate public API dashboard in a rare failure regime.",
    failure: "average latency hides tail; scenario 4 exposes the operational consequence.",
    subtitle: "Monitor symptoms first — experiment 004",
    explanation: "Adjust the controls to see how average latency hides tail changes system quality, cost, and confidence.",
    lesson: "Monitor symptoms first. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1510,
    sampleSize: 362,
    signal: 89
  },
  {
    id: "observability-signals-005",
    title: "model endpoint monitor · case 005",
    scenario: "Investigate model endpoint monitor in a high-scale environment.",
    failure: "logs lack correlation ID; scenario 5 exposes the operational consequence.",
    subtitle: "Correlate signals — experiment 005",
    explanation: "Adjust the controls to see how logs lack correlation ID changes system quality, cost, and confidence.",
    lesson: "Correlate signals. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1517,
    sampleSize: 379,
    signal: 7
  },
  {
    id: "observability-signals-006",
    title: "stream processing service · case 006",
    scenario: "Investigate stream processing service in a small clean workload.",
    failure: "metric has no action; scenario 6 exposes the operational consequence.",
    subtitle: "Every alert needs action — experiment 006",
    explanation: "Adjust the controls to see how metric has no action changes system quality, cost, and confidence.",
    lesson: "Every alert needs action. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1524,
    sampleSize: 396,
    signal: 26
  },
  {
    id: "observability-signals-007",
    title: "public API dashboard · case 007",
    scenario: "Investigate public API dashboard in a large noisy workload.",
    failure: "average latency hides tail; scenario 7 exposes the operational consequence.",
    subtitle: "Monitor symptoms first — experiment 007",
    explanation: "Adjust the controls to see how average latency hides tail changes system quality, cost, and confidence.",
    lesson: "Monitor symptoms first. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1531,
    sampleSize: 413,
    signal: 45
  },
  {
    id: "observability-signals-008",
    title: "model endpoint monitor · case 008",
    scenario: "Investigate model endpoint monitor in a shifted production slice.",
    failure: "logs lack correlation ID; scenario 8 exposes the operational consequence.",
    subtitle: "Correlate signals — experiment 008",
    explanation: "Adjust the controls to see how logs lack correlation ID changes system quality, cost, and confidence.",
    lesson: "Correlate signals. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1538,
    sampleSize: 430,
    signal: 64
  },
  {
    id: "observability-signals-009",
    title: "stream processing service · case 009",
    scenario: "Investigate stream processing service in a rare failure regime.",
    failure: "metric has no action; scenario 9 exposes the operational consequence.",
    subtitle: "Every alert needs action — experiment 009",
    explanation: "Adjust the controls to see how metric has no action changes system quality, cost, and confidence.",
    lesson: "Every alert needs action. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1545,
    sampleSize: 447,
    signal: 83
  },
  {
    id: "observability-signals-010",
    title: "public API dashboard · case 010",
    scenario: "Investigate public API dashboard in a high-scale environment.",
    failure: "average latency hides tail; scenario 10 exposes the operational consequence.",
    subtitle: "Monitor symptoms first — experiment 010",
    explanation: "Adjust the controls to see how average latency hides tail changes system quality, cost, and confidence.",
    lesson: "Monitor symptoms first. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1552,
    sampleSize: 464,
    signal: 1
  },
  {
    id: "observability-signals-011",
    title: "model endpoint monitor · case 011",
    scenario: "Investigate model endpoint monitor in a small clean workload.",
    failure: "logs lack correlation ID; scenario 11 exposes the operational consequence.",
    subtitle: "Correlate signals — experiment 011",
    explanation: "Adjust the controls to see how logs lack correlation ID changes system quality, cost, and confidence.",
    lesson: "Correlate signals. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1559,
    sampleSize: 481,
    signal: 20
  },
  {
    id: "observability-signals-012",
    title: "stream processing service · case 012",
    scenario: "Investigate stream processing service in a large noisy workload.",
    failure: "metric has no action; scenario 12 exposes the operational consequence.",
    subtitle: "Every alert needs action — experiment 012",
    explanation: "Adjust the controls to see how metric has no action changes system quality, cost, and confidence.",
    lesson: "Every alert needs action. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1566,
    sampleSize: 498,
    signal: 39
  }
];

export default function FourSignalsObservatoryLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

