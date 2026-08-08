import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Multi-Hop Retrieval Planner",
  "kicker": "RAG systems interactive lab",
  "description": "Tune retrieval stages, evidence quality, freshness, permissions, and end-to-end answer reliability.",
  "mode": "distribution",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "hsl(223 72% 42%)",
    "secondary": "hsl(351 70% 42%)",
    "background": "hsl(223 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(223 30% 13%)",
    "muted": "hsl(223 14% 43%)",
    "line": "hsl(223 28% 86%)",
    "soft": "hsl(223 55% 92%)"
  },
  "controlTitle": "Multi-Hop Retrieval Planner controls",
  "controls": [
    {
      "label": "Hop limit",
      "min": 0,
      "max": 100,
      "default": 40,
      "unit": "%",
      "help": "Tune hop limit and observe system behavior."
    },
    {
      "label": "Bridge breadth",
      "min": 0,
      "max": 100,
      "default": 62,
      "unit": "",
      "help": "Stress bridge breadth across realistic operating ranges."
    },
    {
      "label": "Stop confidence",
      "min": 0,
      "max": 100,
      "default": 32,
      "unit": "",
      "help": "Use stop confidence to reveal boundary failures."
    }
  ],
  "visualTitle": "Multi-Hop Retrieval Planner live view",
  "metrics": [
    {
      "label": "Multi-Hop score",
      "detail": "primary behavior"
    },
    {
      "label": "Retrieval score",
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
  "formula": "Eₜ₊₁=retrieve(question(Eₜ))",
  "costScale": 0.8500000000000001,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Track hop provenance",
      "body": "Principle 1: use this when reviewing multi-hop retrieval planner behavior in production."
    },
    {
      "title": "Stop on sufficient evidence",
      "body": "Principle 2: use this when reviewing multi-hop retrieval planner behavior in production."
    },
    {
      "title": "Evaluate bridge recall",
      "body": "Principle 3: use this when reviewing multi-hop retrieval planner behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "multihop-retrieval-001",
    title: "company acquisition question · case 001",
    scenario: "Investigate company acquisition question in a high-scale environment.",
    failure: "first hop picks wrong bridge; scenario 1 exposes the operational consequence.",
    subtitle: "Track hop provenance — experiment 001",
    explanation: "Adjust the controls to see how first hop picks wrong bridge changes system quality, cost, and confidence.",
    lesson: "Track hop provenance. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1216,
    sampleSize: 290,
    signal: 11
  },
  {
    id: "multihop-retrieval-002",
    title: "dependency chain diagnosis · case 002",
    scenario: "Investigate dependency chain diagnosis in a small clean workload.",
    failure: "loop repeats same evidence; scenario 2 exposes the operational consequence.",
    subtitle: "Stop on sufficient evidence — experiment 002",
    explanation: "Adjust the controls to see how loop repeats same evidence changes system quality, cost, and confidence.",
    lesson: "Stop on sufficient evidence. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1223,
    sampleSize: 307,
    signal: 30
  },
  {
    id: "multihop-retrieval-003",
    title: "historical entity lookup · case 003",
    scenario: "Investigate historical entity lookup in a large noisy workload.",
    failure: "late hop drifts from question; scenario 3 exposes the operational consequence.",
    subtitle: "Evaluate bridge recall — experiment 003",
    explanation: "Adjust the controls to see how late hop drifts from question changes system quality, cost, and confidence.",
    lesson: "Evaluate bridge recall. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1230,
    sampleSize: 324,
    signal: 49
  },
  {
    id: "multihop-retrieval-004",
    title: "company acquisition question · case 004",
    scenario: "Investigate company acquisition question in a shifted production slice.",
    failure: "first hop picks wrong bridge; scenario 4 exposes the operational consequence.",
    subtitle: "Track hop provenance — experiment 004",
    explanation: "Adjust the controls to see how first hop picks wrong bridge changes system quality, cost, and confidence.",
    lesson: "Track hop provenance. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1237,
    sampleSize: 341,
    signal: 68
  },
  {
    id: "multihop-retrieval-005",
    title: "dependency chain diagnosis · case 005",
    scenario: "Investigate dependency chain diagnosis in a rare failure regime.",
    failure: "loop repeats same evidence; scenario 5 exposes the operational consequence.",
    subtitle: "Stop on sufficient evidence — experiment 005",
    explanation: "Adjust the controls to see how loop repeats same evidence changes system quality, cost, and confidence.",
    lesson: "Stop on sufficient evidence. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1244,
    sampleSize: 358,
    signal: 87
  },
  {
    id: "multihop-retrieval-006",
    title: "historical entity lookup · case 006",
    scenario: "Investigate historical entity lookup in a high-scale environment.",
    failure: "late hop drifts from question; scenario 6 exposes the operational consequence.",
    subtitle: "Evaluate bridge recall — experiment 006",
    explanation: "Adjust the controls to see how late hop drifts from question changes system quality, cost, and confidence.",
    lesson: "Evaluate bridge recall. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1251,
    sampleSize: 375,
    signal: 5
  },
  {
    id: "multihop-retrieval-007",
    title: "company acquisition question · case 007",
    scenario: "Investigate company acquisition question in a small clean workload.",
    failure: "first hop picks wrong bridge; scenario 7 exposes the operational consequence.",
    subtitle: "Track hop provenance — experiment 007",
    explanation: "Adjust the controls to see how first hop picks wrong bridge changes system quality, cost, and confidence.",
    lesson: "Track hop provenance. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1258,
    sampleSize: 392,
    signal: 24
  },
  {
    id: "multihop-retrieval-008",
    title: "dependency chain diagnosis · case 008",
    scenario: "Investigate dependency chain diagnosis in a large noisy workload.",
    failure: "loop repeats same evidence; scenario 8 exposes the operational consequence.",
    subtitle: "Stop on sufficient evidence — experiment 008",
    explanation: "Adjust the controls to see how loop repeats same evidence changes system quality, cost, and confidence.",
    lesson: "Stop on sufficient evidence. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1265,
    sampleSize: 409,
    signal: 43
  },
  {
    id: "multihop-retrieval-009",
    title: "historical entity lookup · case 009",
    scenario: "Investigate historical entity lookup in a shifted production slice.",
    failure: "late hop drifts from question; scenario 9 exposes the operational consequence.",
    subtitle: "Evaluate bridge recall — experiment 009",
    explanation: "Adjust the controls to see how late hop drifts from question changes system quality, cost, and confidence.",
    lesson: "Evaluate bridge recall. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1272,
    sampleSize: 426,
    signal: 62
  },
  {
    id: "multihop-retrieval-010",
    title: "company acquisition question · case 010",
    scenario: "Investigate company acquisition question in a rare failure regime.",
    failure: "first hop picks wrong bridge; scenario 10 exposes the operational consequence.",
    subtitle: "Track hop provenance — experiment 010",
    explanation: "Adjust the controls to see how first hop picks wrong bridge changes system quality, cost, and confidence.",
    lesson: "Track hop provenance. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1279,
    sampleSize: 443,
    signal: 81
  },
  {
    id: "multihop-retrieval-011",
    title: "dependency chain diagnosis · case 011",
    scenario: "Investigate dependency chain diagnosis in a high-scale environment.",
    failure: "loop repeats same evidence; scenario 11 exposes the operational consequence.",
    subtitle: "Stop on sufficient evidence — experiment 011",
    explanation: "Adjust the controls to see how loop repeats same evidence changes system quality, cost, and confidence.",
    lesson: "Stop on sufficient evidence. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1286,
    sampleSize: 460,
    signal: 100
  },
  {
    id: "multihop-retrieval-012",
    title: "historical entity lookup · case 012",
    scenario: "Investigate historical entity lookup in a small clean workload.",
    failure: "late hop drifts from question; scenario 12 exposes the operational consequence.",
    subtitle: "Evaluate bridge recall — experiment 012",
    explanation: "Adjust the controls to see how late hop drifts from question changes system quality, cost, and confidence.",
    lesson: "Evaluate bridge recall. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1293,
    sampleSize: 477,
    signal: 18
  }
];

export default function MultiHopRetrievalLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

