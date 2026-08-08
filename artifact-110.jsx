import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Health Probe Designer",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "image",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "hsl(302 88% 66%)",
    "secondary": "hsl(70 78% 62%)",
    "background": "hsl(302 24% 7%)",
    "panel": "hsl(302 22% 12%)",
    "ink": "hsl(302 35% 94%)",
    "muted": "hsl(302 16% 68%)",
    "line": "hsl(302 20% 25%)",
    "soft": "hsl(302 25% 18%)"
  },
  "controlTitle": "Health Probe Designer controls",
  "controls": [
    {
      "label": "Startup delay",
      "min": 0,
      "max": 100,
      "default": 44,
      "unit": "%",
      "help": "Tune startup delay and observe system behavior."
    },
    {
      "label": "Probe period",
      "min": 0,
      "max": 100,
      "default": 57,
      "unit": "",
      "help": "Stress probe period across realistic operating ranges."
    },
    {
      "label": "Failure threshold",
      "min": 0,
      "max": 100,
      "default": 32,
      "unit": "",
      "help": "Use failure threshold to reveal boundary failures."
    }
  ],
  "visualTitle": "Health Probe Designer live view",
  "metrics": [
    {
      "label": "Health score",
      "detail": "primary behavior"
    },
    {
      "label": "Probe score",
      "detail": "robustness check"
    },
    {
      "label": "Designer score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "ready∧live∧started",
  "costScale": 1.15,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Probes answer different questions",
      "body": "Principle 1: use this when reviewing health probe designer behavior in production."
    },
    {
      "title": "Avoid cascading restarts",
      "body": "Principle 2: use this when reviewing health probe designer behavior in production."
    },
    {
      "title": "Test degraded states",
      "body": "Principle 3: use this when reviewing health probe designer behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "health-probes-001",
    title: "slow-start model server · case 001",
    scenario: "Investigate slow-start model server in a large noisy workload.",
    failure: "liveness causes restart loop; scenario 1 exposes the operational consequence.",
    subtitle: "Probes answer different questions — experiment 001",
    explanation: "Adjust the controls to see how liveness causes restart loop changes system quality, cost, and confidence.",
    lesson: "Probes answer different questions. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1437,
    sampleSize: 307,
    signal: 28
  },
  {
    id: "health-probes-002",
    title: "database-backed API · case 002",
    scenario: "Investigate database-backed API in a shifted production slice.",
    failure: "readiness checks dependency too hard; scenario 2 exposes the operational consequence.",
    subtitle: "Avoid cascading restarts — experiment 002",
    explanation: "Adjust the controls to see how readiness checks dependency too hard changes system quality, cost, and confidence.",
    lesson: "Avoid cascading restarts. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1444,
    sampleSize: 324,
    signal: 47
  },
  {
    id: "health-probes-003",
    title: "event processing worker · case 003",
    scenario: "Investigate event processing worker in a rare failure regime.",
    failure: "startup probe is absent; scenario 3 exposes the operational consequence.",
    subtitle: "Test degraded states — experiment 003",
    explanation: "Adjust the controls to see how startup probe is absent changes system quality, cost, and confidence.",
    lesson: "Test degraded states. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1451,
    sampleSize: 341,
    signal: 66
  },
  {
    id: "health-probes-004",
    title: "slow-start model server · case 004",
    scenario: "Investigate slow-start model server in a high-scale environment.",
    failure: "liveness causes restart loop; scenario 4 exposes the operational consequence.",
    subtitle: "Probes answer different questions — experiment 004",
    explanation: "Adjust the controls to see how liveness causes restart loop changes system quality, cost, and confidence.",
    lesson: "Probes answer different questions. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1458,
    sampleSize: 358,
    signal: 85
  },
  {
    id: "health-probes-005",
    title: "database-backed API · case 005",
    scenario: "Investigate database-backed API in a small clean workload.",
    failure: "readiness checks dependency too hard; scenario 5 exposes the operational consequence.",
    subtitle: "Avoid cascading restarts — experiment 005",
    explanation: "Adjust the controls to see how readiness checks dependency too hard changes system quality, cost, and confidence.",
    lesson: "Avoid cascading restarts. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1465,
    sampleSize: 375,
    signal: 3
  },
  {
    id: "health-probes-006",
    title: "event processing worker · case 006",
    scenario: "Investigate event processing worker in a large noisy workload.",
    failure: "startup probe is absent; scenario 6 exposes the operational consequence.",
    subtitle: "Test degraded states — experiment 006",
    explanation: "Adjust the controls to see how startup probe is absent changes system quality, cost, and confidence.",
    lesson: "Test degraded states. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1472,
    sampleSize: 392,
    signal: 22
  },
  {
    id: "health-probes-007",
    title: "slow-start model server · case 007",
    scenario: "Investigate slow-start model server in a shifted production slice.",
    failure: "liveness causes restart loop; scenario 7 exposes the operational consequence.",
    subtitle: "Probes answer different questions — experiment 007",
    explanation: "Adjust the controls to see how liveness causes restart loop changes system quality, cost, and confidence.",
    lesson: "Probes answer different questions. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1479,
    sampleSize: 409,
    signal: 41
  },
  {
    id: "health-probes-008",
    title: "database-backed API · case 008",
    scenario: "Investigate database-backed API in a rare failure regime.",
    failure: "readiness checks dependency too hard; scenario 8 exposes the operational consequence.",
    subtitle: "Avoid cascading restarts — experiment 008",
    explanation: "Adjust the controls to see how readiness checks dependency too hard changes system quality, cost, and confidence.",
    lesson: "Avoid cascading restarts. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1486,
    sampleSize: 426,
    signal: 60
  },
  {
    id: "health-probes-009",
    title: "event processing worker · case 009",
    scenario: "Investigate event processing worker in a high-scale environment.",
    failure: "startup probe is absent; scenario 9 exposes the operational consequence.",
    subtitle: "Test degraded states — experiment 009",
    explanation: "Adjust the controls to see how startup probe is absent changes system quality, cost, and confidence.",
    lesson: "Test degraded states. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1493,
    sampleSize: 443,
    signal: 79
  },
  {
    id: "health-probes-010",
    title: "slow-start model server · case 010",
    scenario: "Investigate slow-start model server in a small clean workload.",
    failure: "liveness causes restart loop; scenario 10 exposes the operational consequence.",
    subtitle: "Probes answer different questions — experiment 010",
    explanation: "Adjust the controls to see how liveness causes restart loop changes system quality, cost, and confidence.",
    lesson: "Probes answer different questions. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1500,
    sampleSize: 460,
    signal: 98
  },
  {
    id: "health-probes-011",
    title: "database-backed API · case 011",
    scenario: "Investigate database-backed API in a large noisy workload.",
    failure: "readiness checks dependency too hard; scenario 11 exposes the operational consequence.",
    subtitle: "Avoid cascading restarts — experiment 011",
    explanation: "Adjust the controls to see how readiness checks dependency too hard changes system quality, cost, and confidence.",
    lesson: "Avoid cascading restarts. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1507,
    sampleSize: 477,
    signal: 16
  },
  {
    id: "health-probes-012",
    title: "event processing worker · case 012",
    scenario: "Investigate event processing worker in a shifted production slice.",
    failure: "startup probe is absent; scenario 12 exposes the operational consequence.",
    subtitle: "Test degraded states — experiment 012",
    explanation: "Adjust the controls to see how startup probe is absent changes system quality, cost, and confidence.",
    lesson: "Test degraded states. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1514,
    sampleSize: 494,
    signal: 35
  }
];

export default function HealthProbeDesignerLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

