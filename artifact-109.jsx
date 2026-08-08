import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Autoscaling Control Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "network",
  "variant": 3,
  "dark": false,
  "palette": {
    "primary": "hsl(255 72% 42%)",
    "secondary": "hsl(23 70% 42%)",
    "background": "hsl(255 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(255 30% 13%)",
    "muted": "hsl(255 14% 43%)",
    "line": "hsl(255 28% 86%)",
    "soft": "hsl(255 55% 92%)"
  },
  "controlTitle": "Autoscaling Control Lab controls",
  "controls": [
    {
      "label": "Target utilization",
      "min": 0,
      "max": 100,
      "default": 43,
      "unit": "%",
      "help": "Tune target utilization and observe system behavior."
    },
    {
      "label": "Scale-up rate",
      "min": 0,
      "max": 100,
      "default": 67,
      "unit": "",
      "help": "Stress scale-up rate across realistic operating ranges."
    },
    {
      "label": "Cooldown",
      "min": 0,
      "max": 100,
      "default": 31,
      "unit": "",
      "help": "Use cooldown to reveal boundary failures."
    }
  ],
  "visualTitle": "Autoscaling Control Lab live view",
  "metrics": [
    {
      "label": "Autoscaling score",
      "detail": "primary behavior"
    },
    {
      "label": "Control score",
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
  "formula": "replicas≈current·metric/target",
  "costScale": 1.05,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Scale on causal signals",
      "body": "Principle 1: use this when reviewing autoscaling control lab behavior in production."
    },
    {
      "title": "Model startup time",
      "body": "Principle 2: use this when reviewing autoscaling control lab behavior in production."
    },
    {
      "title": "Protect downstreams",
      "body": "Principle 3: use this when reviewing autoscaling control lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "autoscaling-001",
    title: "bursty inference API · case 001",
    scenario: "Investigate bursty inference API in a small clean workload.",
    failure: "autoscaler chases noise; scenario 1 exposes the operational consequence.",
    subtitle: "Scale on causal signals — experiment 001",
    explanation: "Adjust the controls to see how autoscaler chases noise changes system quality, cost, and confidence.",
    lesson: "Scale on causal signals. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1424,
    sampleSize: 306,
    signal: 27
  },
  {
    id: "autoscaling-002",
    title: "queue consumer fleet · case 002",
    scenario: "Investigate queue consumer fleet in a large noisy workload.",
    failure: "slow scale-up drops traffic; scenario 2 exposes the operational consequence.",
    subtitle: "Model startup time — experiment 002",
    explanation: "Adjust the controls to see how slow scale-up drops traffic changes system quality, cost, and confidence.",
    lesson: "Model startup time. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1431,
    sampleSize: 323,
    signal: 46
  },
  {
    id: "autoscaling-003",
    title: "interactive web service · case 003",
    scenario: "Investigate interactive web service in a shifted production slice.",
    failure: "cooldown delays recovery; scenario 3 exposes the operational consequence.",
    subtitle: "Protect downstreams — experiment 003",
    explanation: "Adjust the controls to see how cooldown delays recovery changes system quality, cost, and confidence.",
    lesson: "Protect downstreams. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1438,
    sampleSize: 340,
    signal: 65
  },
  {
    id: "autoscaling-004",
    title: "bursty inference API · case 004",
    scenario: "Investigate bursty inference API in a rare failure regime.",
    failure: "autoscaler chases noise; scenario 4 exposes the operational consequence.",
    subtitle: "Scale on causal signals — experiment 004",
    explanation: "Adjust the controls to see how autoscaler chases noise changes system quality, cost, and confidence.",
    lesson: "Scale on causal signals. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1445,
    sampleSize: 357,
    signal: 84
  },
  {
    id: "autoscaling-005",
    title: "queue consumer fleet · case 005",
    scenario: "Investigate queue consumer fleet in a high-scale environment.",
    failure: "slow scale-up drops traffic; scenario 5 exposes the operational consequence.",
    subtitle: "Model startup time — experiment 005",
    explanation: "Adjust the controls to see how slow scale-up drops traffic changes system quality, cost, and confidence.",
    lesson: "Model startup time. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1452,
    sampleSize: 374,
    signal: 2
  },
  {
    id: "autoscaling-006",
    title: "interactive web service · case 006",
    scenario: "Investigate interactive web service in a small clean workload.",
    failure: "cooldown delays recovery; scenario 6 exposes the operational consequence.",
    subtitle: "Protect downstreams — experiment 006",
    explanation: "Adjust the controls to see how cooldown delays recovery changes system quality, cost, and confidence.",
    lesson: "Protect downstreams. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1459,
    sampleSize: 391,
    signal: 21
  },
  {
    id: "autoscaling-007",
    title: "bursty inference API · case 007",
    scenario: "Investigate bursty inference API in a large noisy workload.",
    failure: "autoscaler chases noise; scenario 7 exposes the operational consequence.",
    subtitle: "Scale on causal signals — experiment 007",
    explanation: "Adjust the controls to see how autoscaler chases noise changes system quality, cost, and confidence.",
    lesson: "Scale on causal signals. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1466,
    sampleSize: 408,
    signal: 40
  },
  {
    id: "autoscaling-008",
    title: "queue consumer fleet · case 008",
    scenario: "Investigate queue consumer fleet in a shifted production slice.",
    failure: "slow scale-up drops traffic; scenario 8 exposes the operational consequence.",
    subtitle: "Model startup time — experiment 008",
    explanation: "Adjust the controls to see how slow scale-up drops traffic changes system quality, cost, and confidence.",
    lesson: "Model startup time. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1473,
    sampleSize: 425,
    signal: 59
  },
  {
    id: "autoscaling-009",
    title: "interactive web service · case 009",
    scenario: "Investigate interactive web service in a rare failure regime.",
    failure: "cooldown delays recovery; scenario 9 exposes the operational consequence.",
    subtitle: "Protect downstreams — experiment 009",
    explanation: "Adjust the controls to see how cooldown delays recovery changes system quality, cost, and confidence.",
    lesson: "Protect downstreams. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1480,
    sampleSize: 442,
    signal: 78
  },
  {
    id: "autoscaling-010",
    title: "bursty inference API · case 010",
    scenario: "Investigate bursty inference API in a high-scale environment.",
    failure: "autoscaler chases noise; scenario 10 exposes the operational consequence.",
    subtitle: "Scale on causal signals — experiment 010",
    explanation: "Adjust the controls to see how autoscaler chases noise changes system quality, cost, and confidence.",
    lesson: "Scale on causal signals. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1487,
    sampleSize: 459,
    signal: 97
  },
  {
    id: "autoscaling-011",
    title: "queue consumer fleet · case 011",
    scenario: "Investigate queue consumer fleet in a small clean workload.",
    failure: "slow scale-up drops traffic; scenario 11 exposes the operational consequence.",
    subtitle: "Model startup time — experiment 011",
    explanation: "Adjust the controls to see how slow scale-up drops traffic changes system quality, cost, and confidence.",
    lesson: "Model startup time. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1494,
    sampleSize: 476,
    signal: 15
  },
  {
    id: "autoscaling-012",
    title: "interactive web service · case 012",
    scenario: "Investigate interactive web service in a large noisy workload.",
    failure: "cooldown delays recovery; scenario 12 exposes the operational consequence.",
    subtitle: "Protect downstreams — experiment 012",
    explanation: "Adjust the controls to see how cooldown delays recovery changes system quality, cost, and confidence.",
    lesson: "Protect downstreams. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1501,
    sampleSize: 493,
    signal: 34
  }
];

export default function AutoscalingControlLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

