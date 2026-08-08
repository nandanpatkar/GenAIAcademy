import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Neural Reranker Lab",
  "kicker": "RAG systems interactive lab",
  "description": "Tune retrieval stages, evidence quality, freshness, permissions, and end-to-end answer reliability.",
  "mode": "matrix",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "hsl(82 72% 42%)",
    "secondary": "hsl(210 70% 42%)",
    "background": "hsl(82 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(82 30% 13%)",
    "muted": "hsl(82 14% 43%)",
    "line": "hsl(82 28% 86%)",
    "soft": "hsl(82 55% 92%)"
  },
  "controlTitle": "Neural Reranker Lab controls",
  "controls": [
    {
      "label": "Candidate depth",
      "min": 0,
      "max": 100,
      "default": 50,
      "unit": "%",
      "help": "Tune candidate depth and observe system behavior."
    },
    {
      "label": "Rerank cutoff",
      "min": 0,
      "max": 100,
      "default": 59,
      "unit": "",
      "help": "Stress rerank cutoff across realistic operating ranges."
    },
    {
      "label": "Latency budget",
      "min": 0,
      "max": 100,
      "default": 29,
      "unit": "",
      "help": "Use latency budget to reveal boundary failures."
    }
  ],
  "visualTitle": "Neural Reranker Lab live view",
  "metrics": [
    {
      "label": "Neural score",
      "detail": "primary behavior"
    },
    {
      "label": "Reranker score",
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
  "formula": "score(q,d)=cross_encoder(q,d)",
  "costScale": 1.25,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Recall before reranking",
      "body": "Principle 1: use this when reviewing neural reranker lab behavior in production."
    },
    {
      "title": "Measure stage metrics",
      "body": "Principle 2: use this when reviewing neural reranker lab behavior in production."
    },
    {
      "title": "Budget candidates",
      "body": "Principle 3: use this when reviewing neural reranker lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "reranker-lab-001",
    title: "legal passage ranking · case 001",
    scenario: "Investigate legal passage ranking in a large noisy workload.",
    failure: "relevant item never enters pool; scenario 1 exposes the operational consequence.",
    subtitle: "Recall before reranking — experiment 001",
    explanation: "Adjust the controls to see how relevant item never enters pool changes system quality, cost, and confidence.",
    lesson: "Recall before reranking. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1177,
    sampleSize: 287,
    signal: 8
  },
  {
    id: "reranker-lab-002",
    title: "support article search · case 002",
    scenario: "Investigate support article search in a shifted production slice.",
    failure: "reranker overfits position; scenario 2 exposes the operational consequence.",
    subtitle: "Measure stage metrics — experiment 002",
    explanation: "Adjust the controls to see how reranker overfits position changes system quality, cost, and confidence.",
    lesson: "Measure stage metrics. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1184,
    sampleSize: 304,
    signal: 27
  },
  {
    id: "reranker-lab-003",
    title: "research evidence retrieval · case 003",
    scenario: "Investigate research evidence retrieval in a rare failure regime.",
    failure: "latency exceeds budget; scenario 3 exposes the operational consequence.",
    subtitle: "Budget candidates — experiment 003",
    explanation: "Adjust the controls to see how latency exceeds budget changes system quality, cost, and confidence.",
    lesson: "Budget candidates. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1191,
    sampleSize: 321,
    signal: 46
  },
  {
    id: "reranker-lab-004",
    title: "legal passage ranking · case 004",
    scenario: "Investigate legal passage ranking in a high-scale environment.",
    failure: "relevant item never enters pool; scenario 4 exposes the operational consequence.",
    subtitle: "Recall before reranking — experiment 004",
    explanation: "Adjust the controls to see how relevant item never enters pool changes system quality, cost, and confidence.",
    lesson: "Recall before reranking. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1198,
    sampleSize: 338,
    signal: 65
  },
  {
    id: "reranker-lab-005",
    title: "support article search · case 005",
    scenario: "Investigate support article search in a small clean workload.",
    failure: "reranker overfits position; scenario 5 exposes the operational consequence.",
    subtitle: "Measure stage metrics — experiment 005",
    explanation: "Adjust the controls to see how reranker overfits position changes system quality, cost, and confidence.",
    lesson: "Measure stage metrics. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1205,
    sampleSize: 355,
    signal: 84
  },
  {
    id: "reranker-lab-006",
    title: "research evidence retrieval · case 006",
    scenario: "Investigate research evidence retrieval in a large noisy workload.",
    failure: "latency exceeds budget; scenario 6 exposes the operational consequence.",
    subtitle: "Budget candidates — experiment 006",
    explanation: "Adjust the controls to see how latency exceeds budget changes system quality, cost, and confidence.",
    lesson: "Budget candidates. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1212,
    sampleSize: 372,
    signal: 2
  },
  {
    id: "reranker-lab-007",
    title: "legal passage ranking · case 007",
    scenario: "Investigate legal passage ranking in a shifted production slice.",
    failure: "relevant item never enters pool; scenario 7 exposes the operational consequence.",
    subtitle: "Recall before reranking — experiment 007",
    explanation: "Adjust the controls to see how relevant item never enters pool changes system quality, cost, and confidence.",
    lesson: "Recall before reranking. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1219,
    sampleSize: 389,
    signal: 21
  },
  {
    id: "reranker-lab-008",
    title: "support article search · case 008",
    scenario: "Investigate support article search in a rare failure regime.",
    failure: "reranker overfits position; scenario 8 exposes the operational consequence.",
    subtitle: "Measure stage metrics — experiment 008",
    explanation: "Adjust the controls to see how reranker overfits position changes system quality, cost, and confidence.",
    lesson: "Measure stage metrics. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1226,
    sampleSize: 406,
    signal: 40
  },
  {
    id: "reranker-lab-009",
    title: "research evidence retrieval · case 009",
    scenario: "Investigate research evidence retrieval in a high-scale environment.",
    failure: "latency exceeds budget; scenario 9 exposes the operational consequence.",
    subtitle: "Budget candidates — experiment 009",
    explanation: "Adjust the controls to see how latency exceeds budget changes system quality, cost, and confidence.",
    lesson: "Budget candidates. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1233,
    sampleSize: 423,
    signal: 59
  },
  {
    id: "reranker-lab-010",
    title: "legal passage ranking · case 010",
    scenario: "Investigate legal passage ranking in a small clean workload.",
    failure: "relevant item never enters pool; scenario 10 exposes the operational consequence.",
    subtitle: "Recall before reranking — experiment 010",
    explanation: "Adjust the controls to see how relevant item never enters pool changes system quality, cost, and confidence.",
    lesson: "Recall before reranking. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1240,
    sampleSize: 440,
    signal: 78
  },
  {
    id: "reranker-lab-011",
    title: "support article search · case 011",
    scenario: "Investigate support article search in a large noisy workload.",
    failure: "reranker overfits position; scenario 11 exposes the operational consequence.",
    subtitle: "Measure stage metrics — experiment 011",
    explanation: "Adjust the controls to see how reranker overfits position changes system quality, cost, and confidence.",
    lesson: "Measure stage metrics. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1247,
    sampleSize: 457,
    signal: 97
  },
  {
    id: "reranker-lab-012",
    title: "research evidence retrieval · case 012",
    scenario: "Investigate research evidence retrieval in a shifted production slice.",
    failure: "latency exceeds budget; scenario 12 exposes the operational consequence.",
    subtitle: "Budget candidates — experiment 012",
    explanation: "Adjust the controls to see how latency exceeds budget changes system quality, cost, and confidence.",
    lesson: "Budget candidates. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1254,
    sampleSize: 474,
    signal: 15
  }
];

export default function NeuralRerankerLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

