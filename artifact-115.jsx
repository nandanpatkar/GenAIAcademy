import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Incident Command Simulator",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "tree",
  "variant": 3,
  "dark": false,
  "palette": {
    "primary": "hsl(177 72% 42%)",
    "secondary": "hsl(305 70% 42%)",
    "background": "hsl(177 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(177 30% 13%)",
    "muted": "hsl(177 14% 43%)",
    "line": "hsl(177 28% 86%)",
    "soft": "hsl(177 55% 92%)"
  },
  "controlTitle": "Incident Command Simulator controls",
  "controls": [
    {
      "label": "Severity",
      "min": 0,
      "max": 100,
      "default": 49,
      "unit": "%",
      "help": "Tune severity and observe system behavior."
    },
    {
      "label": "Responder count",
      "min": 0,
      "max": 100,
      "default": 62,
      "unit": "",
      "help": "Stress responder count across realistic operating ranges."
    },
    {
      "label": "Update cadence",
      "min": 0,
      "max": 100,
      "default": 37,
      "unit": "",
      "help": "Use update cadence to reveal boundary failures."
    }
  ],
  "visualTitle": "Incident Command Simulator live view",
  "metrics": [
    {
      "label": "Incident score",
      "detail": "primary behavior"
    },
    {
      "label": "Command score",
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
  "formula": "mitigate→stabilize→learn",
  "costScale": 0.95,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Assign clear roles",
      "body": "Principle 1: use this when reviewing incident command simulator behavior in production."
    },
    {
      "title": "Mitigate before perfection",
      "body": "Principle 2: use this when reviewing incident command simulator behavior in production."
    },
    {
      "title": "Preserve timeline",
      "body": "Principle 3: use this when reviewing incident command simulator behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "incident-response-001",
    title: "regional API outage · case 001",
    scenario: "Investigate regional API outage in a large noisy workload.",
    failure: "everyone debugs without command; scenario 1 exposes the operational consequence.",
    subtitle: "Assign clear roles — experiment 001",
    explanation: "Adjust the controls to see how everyone debugs without command changes system quality, cost, and confidence.",
    lesson: "Assign clear roles. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1502,
    sampleSize: 312,
    signal: 33
  },
  {
    id: "incident-response-002",
    title: "bad model rollout · case 002",
    scenario: "Investigate bad model rollout in a shifted production slice.",
    failure: "status updates stop; scenario 2 exposes the operational consequence.",
    subtitle: "Mitigate before perfection — experiment 002",
    explanation: "Adjust the controls to see how status updates stop changes system quality, cost, and confidence.",
    lesson: "Mitigate before perfection. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1509,
    sampleSize: 329,
    signal: 52
  },
  {
    id: "incident-response-003",
    title: "database saturation incident · case 003",
    scenario: "Investigate database saturation incident in a rare failure regime.",
    failure: "root cause delays mitigation; scenario 3 exposes the operational consequence.",
    subtitle: "Preserve timeline — experiment 003",
    explanation: "Adjust the controls to see how root cause delays mitigation changes system quality, cost, and confidence.",
    lesson: "Preserve timeline. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1516,
    sampleSize: 346,
    signal: 71
  },
  {
    id: "incident-response-004",
    title: "regional API outage · case 004",
    scenario: "Investigate regional API outage in a high-scale environment.",
    failure: "everyone debugs without command; scenario 4 exposes the operational consequence.",
    subtitle: "Assign clear roles — experiment 004",
    explanation: "Adjust the controls to see how everyone debugs without command changes system quality, cost, and confidence.",
    lesson: "Assign clear roles. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1523,
    sampleSize: 363,
    signal: 90
  },
  {
    id: "incident-response-005",
    title: "bad model rollout · case 005",
    scenario: "Investigate bad model rollout in a small clean workload.",
    failure: "status updates stop; scenario 5 exposes the operational consequence.",
    subtitle: "Mitigate before perfection — experiment 005",
    explanation: "Adjust the controls to see how status updates stop changes system quality, cost, and confidence.",
    lesson: "Mitigate before perfection. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1530,
    sampleSize: 380,
    signal: 8
  },
  {
    id: "incident-response-006",
    title: "database saturation incident · case 006",
    scenario: "Investigate database saturation incident in a large noisy workload.",
    failure: "root cause delays mitigation; scenario 6 exposes the operational consequence.",
    subtitle: "Preserve timeline — experiment 006",
    explanation: "Adjust the controls to see how root cause delays mitigation changes system quality, cost, and confidence.",
    lesson: "Preserve timeline. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1537,
    sampleSize: 397,
    signal: 27
  },
  {
    id: "incident-response-007",
    title: "regional API outage · case 007",
    scenario: "Investigate regional API outage in a shifted production slice.",
    failure: "everyone debugs without command; scenario 7 exposes the operational consequence.",
    subtitle: "Assign clear roles — experiment 007",
    explanation: "Adjust the controls to see how everyone debugs without command changes system quality, cost, and confidence.",
    lesson: "Assign clear roles. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1544,
    sampleSize: 414,
    signal: 46
  },
  {
    id: "incident-response-008",
    title: "bad model rollout · case 008",
    scenario: "Investigate bad model rollout in a rare failure regime.",
    failure: "status updates stop; scenario 8 exposes the operational consequence.",
    subtitle: "Mitigate before perfection — experiment 008",
    explanation: "Adjust the controls to see how status updates stop changes system quality, cost, and confidence.",
    lesson: "Mitigate before perfection. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1551,
    sampleSize: 431,
    signal: 65
  },
  {
    id: "incident-response-009",
    title: "database saturation incident · case 009",
    scenario: "Investigate database saturation incident in a high-scale environment.",
    failure: "root cause delays mitigation; scenario 9 exposes the operational consequence.",
    subtitle: "Preserve timeline — experiment 009",
    explanation: "Adjust the controls to see how root cause delays mitigation changes system quality, cost, and confidence.",
    lesson: "Preserve timeline. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1558,
    sampleSize: 448,
    signal: 84
  },
  {
    id: "incident-response-010",
    title: "regional API outage · case 010",
    scenario: "Investigate regional API outage in a small clean workload.",
    failure: "everyone debugs without command; scenario 10 exposes the operational consequence.",
    subtitle: "Assign clear roles — experiment 010",
    explanation: "Adjust the controls to see how everyone debugs without command changes system quality, cost, and confidence.",
    lesson: "Assign clear roles. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1565,
    sampleSize: 465,
    signal: 2
  },
  {
    id: "incident-response-011",
    title: "bad model rollout · case 011",
    scenario: "Investigate bad model rollout in a large noisy workload.",
    failure: "status updates stop; scenario 11 exposes the operational consequence.",
    subtitle: "Mitigate before perfection — experiment 011",
    explanation: "Adjust the controls to see how status updates stop changes system quality, cost, and confidence.",
    lesson: "Mitigate before perfection. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1572,
    sampleSize: 482,
    signal: 21
  },
  {
    id: "incident-response-012",
    title: "database saturation incident · case 012",
    scenario: "Investigate database saturation incident in a shifted production slice.",
    failure: "root cause delays mitigation; scenario 12 exposes the operational consequence.",
    subtitle: "Preserve timeline — experiment 012",
    explanation: "Adjust the controls to see how root cause delays mitigation changes system quality, cost, and confidence.",
    lesson: "Preserve timeline. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1579,
    sampleSize: 499,
    signal: 40
  }
];

export default function IncidentCommandSimulatorLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

