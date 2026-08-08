import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Agent Retry & Idempotency Lab",
  "kicker": "Agent systems interactive lab",
  "description": "Design controlled agent execution with explicit state, tools, authority, budgets, and recovery behavior.",
  "mode": "grid",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "hsl(20 88% 66%)",
    "secondary": "hsl(148 78% 62%)",
    "background": "hsl(20 24% 7%)",
    "panel": "hsl(20 22% 12%)",
    "ink": "hsl(20 35% 94%)",
    "muted": "hsl(20 16% 68%)",
    "line": "hsl(20 20% 25%)",
    "soft": "hsl(20 25% 18%)"
  },
  "controlTitle": "Agent Retry & Idempotency Lab controls",
  "controls": [
    {
      "label": "Retry count",
      "min": 0,
      "max": 100,
      "default": 38,
      "unit": "%",
      "help": "Tune retry count and observe system behavior."
    },
    {
      "label": "Backoff rate",
      "min": 0,
      "max": 100,
      "default": 62,
      "unit": "",
      "help": "Stress backoff rate across realistic operating ranges."
    },
    {
      "label": "Idempotency strength",
      "min": 0,
      "max": 100,
      "default": 26,
      "unit": "",
      "help": "Use idempotency strength to reveal boundary failures."
    }
  ],
  "visualTitle": "Agent Retry & Idempotency Lab live view",
  "metrics": [
    {
      "label": "Agent score",
      "detail": "primary behavior"
    },
    {
      "label": "Retry score",
      "detail": "robustness check"
    },
    {
      "label": "Idempotency score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "result=retry(op,key,policy)",
  "costScale": 1.25,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Classify retryable errors",
      "body": "Principle 1: use this when reviewing agent retry & idempotency lab behavior in production."
    },
    {
      "title": "Key side effects",
      "body": "Principle 2: use this when reviewing agent retry & idempotency lab behavior in production."
    },
    {
      "title": "Bound total time",
      "body": "Principle 3: use this when reviewing agent retry & idempotency lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "agent-retries-001",
    title: "payment tool retry · case 001",
    scenario: "Investigate payment tool retry in a small clean workload.",
    failure: "retry duplicates side effect; scenario 1 exposes the operational consequence.",
    subtitle: "Classify retryable errors — experiment 001",
    explanation: "Adjust the controls to see how retry duplicates side effect changes system quality, cost, and confidence.",
    lesson: "Classify retryable errors. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1359,
    sampleSize: 301,
    signal: 22
  },
  {
    id: "agent-retries-002",
    title: "ticket creation agent · case 002",
    scenario: "Investigate ticket creation agent in a large noisy workload.",
    failure: "backoff ignores deadline; scenario 2 exposes the operational consequence.",
    subtitle: "Key side effects — experiment 002",
    explanation: "Adjust the controls to see how backoff ignores deadline changes system quality, cost, and confidence.",
    lesson: "Key side effects. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1366,
    sampleSize: 318,
    signal: 41
  },
  {
    id: "agent-retries-003",
    title: "cloud provisioning call · case 003",
    scenario: "Investigate cloud provisioning call in a shifted production slice.",
    failure: "idempotency key is unstable; scenario 3 exposes the operational consequence.",
    subtitle: "Bound total time — experiment 003",
    explanation: "Adjust the controls to see how idempotency key is unstable changes system quality, cost, and confidence.",
    lesson: "Bound total time. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1373,
    sampleSize: 335,
    signal: 60
  },
  {
    id: "agent-retries-004",
    title: "payment tool retry · case 004",
    scenario: "Investigate payment tool retry in a rare failure regime.",
    failure: "retry duplicates side effect; scenario 4 exposes the operational consequence.",
    subtitle: "Classify retryable errors — experiment 004",
    explanation: "Adjust the controls to see how retry duplicates side effect changes system quality, cost, and confidence.",
    lesson: "Classify retryable errors. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1380,
    sampleSize: 352,
    signal: 79
  },
  {
    id: "agent-retries-005",
    title: "ticket creation agent · case 005",
    scenario: "Investigate ticket creation agent in a high-scale environment.",
    failure: "backoff ignores deadline; scenario 5 exposes the operational consequence.",
    subtitle: "Key side effects — experiment 005",
    explanation: "Adjust the controls to see how backoff ignores deadline changes system quality, cost, and confidence.",
    lesson: "Key side effects. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1387,
    sampleSize: 369,
    signal: 98
  },
  {
    id: "agent-retries-006",
    title: "cloud provisioning call · case 006",
    scenario: "Investigate cloud provisioning call in a small clean workload.",
    failure: "idempotency key is unstable; scenario 6 exposes the operational consequence.",
    subtitle: "Bound total time — experiment 006",
    explanation: "Adjust the controls to see how idempotency key is unstable changes system quality, cost, and confidence.",
    lesson: "Bound total time. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1394,
    sampleSize: 386,
    signal: 16
  },
  {
    id: "agent-retries-007",
    title: "payment tool retry · case 007",
    scenario: "Investigate payment tool retry in a large noisy workload.",
    failure: "retry duplicates side effect; scenario 7 exposes the operational consequence.",
    subtitle: "Classify retryable errors — experiment 007",
    explanation: "Adjust the controls to see how retry duplicates side effect changes system quality, cost, and confidence.",
    lesson: "Classify retryable errors. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1401,
    sampleSize: 403,
    signal: 35
  },
  {
    id: "agent-retries-008",
    title: "ticket creation agent · case 008",
    scenario: "Investigate ticket creation agent in a shifted production slice.",
    failure: "backoff ignores deadline; scenario 8 exposes the operational consequence.",
    subtitle: "Key side effects — experiment 008",
    explanation: "Adjust the controls to see how backoff ignores deadline changes system quality, cost, and confidence.",
    lesson: "Key side effects. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1408,
    sampleSize: 420,
    signal: 54
  },
  {
    id: "agent-retries-009",
    title: "cloud provisioning call · case 009",
    scenario: "Investigate cloud provisioning call in a rare failure regime.",
    failure: "idempotency key is unstable; scenario 9 exposes the operational consequence.",
    subtitle: "Bound total time — experiment 009",
    explanation: "Adjust the controls to see how idempotency key is unstable changes system quality, cost, and confidence.",
    lesson: "Bound total time. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1415,
    sampleSize: 437,
    signal: 73
  },
  {
    id: "agent-retries-010",
    title: "payment tool retry · case 010",
    scenario: "Investigate payment tool retry in a high-scale environment.",
    failure: "retry duplicates side effect; scenario 10 exposes the operational consequence.",
    subtitle: "Classify retryable errors — experiment 010",
    explanation: "Adjust the controls to see how retry duplicates side effect changes system quality, cost, and confidence.",
    lesson: "Classify retryable errors. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1422,
    sampleSize: 454,
    signal: 92
  },
  {
    id: "agent-retries-011",
    title: "ticket creation agent · case 011",
    scenario: "Investigate ticket creation agent in a small clean workload.",
    failure: "backoff ignores deadline; scenario 11 exposes the operational consequence.",
    subtitle: "Key side effects — experiment 011",
    explanation: "Adjust the controls to see how backoff ignores deadline changes system quality, cost, and confidence.",
    lesson: "Key side effects. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1429,
    sampleSize: 471,
    signal: 10
  },
  {
    id: "agent-retries-012",
    title: "cloud provisioning call · case 012",
    scenario: "Investigate cloud provisioning call in a large noisy workload.",
    failure: "idempotency key is unstable; scenario 12 exposes the operational consequence.",
    subtitle: "Bound total time — experiment 012",
    explanation: "Adjust the controls to see how idempotency key is unstable changes system quality, cost, and confidence.",
    lesson: "Bound total time. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1436,
    sampleSize: 488,
    signal: 29
  }
];

export default function AgentRetryIdempotencyLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

