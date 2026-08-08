import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Distributed Training Topology Lab",
  "kicker": "Deep learning interactive lab",
  "description": "Inspect neural architectures, optimization at scale, compression, and robustness through live diagnostics.",
  "mode": "curve",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "hsl(144 72% 42%)",
    "secondary": "hsl(272 70% 42%)",
    "background": "hsl(144 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(144 30% 13%)",
    "muted": "hsl(144 14% 43%)",
    "line": "hsl(144 28% 86%)",
    "soft": "hsl(144 55% 92%)"
  },
  "controlTitle": "Distributed Training Topology Lab controls",
  "controls": [
    {
      "label": "Worker count",
      "min": 0,
      "max": 100,
      "default": 49,
      "unit": "%",
      "help": "Tune worker count and observe system behavior."
    },
    {
      "label": "Bucket size",
      "min": 0,
      "max": 100,
      "default": 67,
      "unit": "",
      "help": "Stress bucket size across realistic operating ranges."
    },
    {
      "label": "Network latency",
      "min": 0,
      "max": 100,
      "default": 32,
      "unit": "",
      "help": "Use network latency to reveal boundary failures."
    }
  ],
  "visualTitle": "Distributed Training Topology Lab live view",
  "metrics": [
    {
      "label": "Distributed score",
      "detail": "primary behavior"
    },
    {
      "label": "Training score",
      "detail": "robustness check"
    },
    {
      "label": "Topology score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "T≈compute/N + communication",
  "costScale": 1.25,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Scale efficiency, not workers",
      "body": "Principle 1: use this when reviewing distributed training topology lab behavior in production."
    },
    {
      "title": "Overlap communication",
      "body": "Principle 2: use this when reviewing distributed training topology lab behavior in production."
    },
    {
      "title": "Profile synchronization",
      "body": "Principle 3: use this when reviewing distributed training topology lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "distributed-training-001",
    title: "multi-GPU transformer · case 001",
    scenario: "Investigate multi-GPU transformer in a shifted production slice.",
    failure: "communication dominates step; scenario 1 exposes the operational consequence.",
    subtitle: "Scale efficiency, not workers — experiment 001",
    explanation: "Adjust the controls to see how communication dominates step changes system quality, cost, and confidence.",
    lesson: "Scale efficiency, not workers. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 995,
    sampleSize: 273,
    signal: 95
  },
  {
    id: "distributed-training-002",
    title: "distributed vision run · case 002",
    scenario: "Investigate distributed vision run in a rare failure regime.",
    failure: "straggler stalls workers; scenario 2 exposes the operational consequence.",
    subtitle: "Overlap communication — experiment 002",
    explanation: "Adjust the controls to see how straggler stalls workers changes system quality, cost, and confidence.",
    lesson: "Overlap communication. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1002,
    sampleSize: 290,
    signal: 13
  },
  {
    id: "distributed-training-003",
    title: "cross-node recommendation model · case 003",
    scenario: "Investigate cross-node recommendation model in a high-scale environment.",
    failure: "shards become imbalanced; scenario 3 exposes the operational consequence.",
    subtitle: "Profile synchronization — experiment 003",
    explanation: "Adjust the controls to see how shards become imbalanced changes system quality, cost, and confidence.",
    lesson: "Profile synchronization. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1009,
    sampleSize: 307,
    signal: 32
  },
  {
    id: "distributed-training-004",
    title: "multi-GPU transformer · case 004",
    scenario: "Investigate multi-GPU transformer in a small clean workload.",
    failure: "communication dominates step; scenario 4 exposes the operational consequence.",
    subtitle: "Scale efficiency, not workers — experiment 004",
    explanation: "Adjust the controls to see how communication dominates step changes system quality, cost, and confidence.",
    lesson: "Scale efficiency, not workers. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1016,
    sampleSize: 324,
    signal: 51
  },
  {
    id: "distributed-training-005",
    title: "distributed vision run · case 005",
    scenario: "Investigate distributed vision run in a large noisy workload.",
    failure: "straggler stalls workers; scenario 5 exposes the operational consequence.",
    subtitle: "Overlap communication — experiment 005",
    explanation: "Adjust the controls to see how straggler stalls workers changes system quality, cost, and confidence.",
    lesson: "Overlap communication. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1023,
    sampleSize: 341,
    signal: 70
  },
  {
    id: "distributed-training-006",
    title: "cross-node recommendation model · case 006",
    scenario: "Investigate cross-node recommendation model in a shifted production slice.",
    failure: "shards become imbalanced; scenario 6 exposes the operational consequence.",
    subtitle: "Profile synchronization — experiment 006",
    explanation: "Adjust the controls to see how shards become imbalanced changes system quality, cost, and confidence.",
    lesson: "Profile synchronization. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1030,
    sampleSize: 358,
    signal: 89
  },
  {
    id: "distributed-training-007",
    title: "multi-GPU transformer · case 007",
    scenario: "Investigate multi-GPU transformer in a rare failure regime.",
    failure: "communication dominates step; scenario 7 exposes the operational consequence.",
    subtitle: "Scale efficiency, not workers — experiment 007",
    explanation: "Adjust the controls to see how communication dominates step changes system quality, cost, and confidence.",
    lesson: "Scale efficiency, not workers. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1037,
    sampleSize: 375,
    signal: 7
  },
  {
    id: "distributed-training-008",
    title: "distributed vision run · case 008",
    scenario: "Investigate distributed vision run in a high-scale environment.",
    failure: "straggler stalls workers; scenario 8 exposes the operational consequence.",
    subtitle: "Overlap communication — experiment 008",
    explanation: "Adjust the controls to see how straggler stalls workers changes system quality, cost, and confidence.",
    lesson: "Overlap communication. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1044,
    sampleSize: 392,
    signal: 26
  },
  {
    id: "distributed-training-009",
    title: "cross-node recommendation model · case 009",
    scenario: "Investigate cross-node recommendation model in a small clean workload.",
    failure: "shards become imbalanced; scenario 9 exposes the operational consequence.",
    subtitle: "Profile synchronization — experiment 009",
    explanation: "Adjust the controls to see how shards become imbalanced changes system quality, cost, and confidence.",
    lesson: "Profile synchronization. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1051,
    sampleSize: 409,
    signal: 45
  },
  {
    id: "distributed-training-010",
    title: "multi-GPU transformer · case 010",
    scenario: "Investigate multi-GPU transformer in a large noisy workload.",
    failure: "communication dominates step; scenario 10 exposes the operational consequence.",
    subtitle: "Scale efficiency, not workers — experiment 010",
    explanation: "Adjust the controls to see how communication dominates step changes system quality, cost, and confidence.",
    lesson: "Scale efficiency, not workers. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1058,
    sampleSize: 426,
    signal: 64
  },
  {
    id: "distributed-training-011",
    title: "distributed vision run · case 011",
    scenario: "Investigate distributed vision run in a shifted production slice.",
    failure: "straggler stalls workers; scenario 11 exposes the operational consequence.",
    subtitle: "Overlap communication — experiment 011",
    explanation: "Adjust the controls to see how straggler stalls workers changes system quality, cost, and confidence.",
    lesson: "Overlap communication. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1065,
    sampleSize: 443,
    signal: 83
  },
  {
    id: "distributed-training-012",
    title: "cross-node recommendation model · case 012",
    scenario: "Investigate cross-node recommendation model in a rare failure regime.",
    failure: "shards become imbalanced; scenario 12 exposes the operational consequence.",
    subtitle: "Profile synchronization — experiment 012",
    explanation: "Adjust the controls to see how shards become imbalanced changes system quality, cost, and confidence.",
    lesson: "Profile synchronization. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1072,
    sampleSize: 460,
    signal: 1
  }
];

export default function DistributedTrainingTopologyLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

