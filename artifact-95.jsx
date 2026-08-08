import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "RAG Evaluation Workbench",
  "kicker": "RAG systems interactive lab",
  "description": "Tune retrieval stages, evidence quality, freshness, permissions, and end-to-end answer reliability.",
  "mode": "grid",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "hsl(317 88% 66%)",
    "secondary": "hsl(85 78% 62%)",
    "background": "hsl(317 24% 7%)",
    "panel": "hsl(317 22% 12%)",
    "ink": "hsl(317 35% 94%)",
    "muted": "hsl(317 16% 68%)",
    "line": "hsl(317 20% 25%)",
    "soft": "hsl(317 25% 18%)"
  },
  "controlTitle": "RAG Evaluation Workbench controls",
  "controls": [
    {
      "label": "Eval set size",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune eval set size and observe system behavior."
    },
    {
      "label": "Judge strictness",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress judge strictness across realistic operating ranges."
    },
    {
      "label": "Failure weighting",
      "min": 0,
      "max": 100,
      "default": 34,
      "unit": "",
      "help": "Use failure weighting to reveal boundary failures."
    }
  ],
  "visualTitle": "RAG Evaluation Workbench live view",
  "metrics": [
    {
      "label": "Evaluation score",
      "detail": "primary behavior"
    },
    {
      "label": "Workbench score",
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
  "formula": "quality=f(retrieval,faithfulness,usefulness)",
  "costScale": 1.05,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Evaluate stages separately",
      "body": "Principle 1: use this when reviewing rag evaluation workbench behavior in production."
    },
    {
      "title": "Use real failure slices",
      "body": "Principle 2: use this when reviewing rag evaluation workbench behavior in production."
    },
    {
      "title": "Calibrate automated judges",
      "body": "Principle 3: use this when reviewing rag evaluation workbench behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "rag-evaluation-001",
    title: "support QA benchmark · case 001",
    scenario: "Investigate support QA benchmark in a large noisy workload.",
    failure: "answer score hides retrieval miss; scenario 1 exposes the operational consequence.",
    subtitle: "Evaluate stages separately — experiment 001",
    explanation: "Adjust the controls to see how answer score hides retrieval miss changes system quality, cost, and confidence.",
    lesson: "Evaluate stages separately. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1242,
    sampleSize: 292,
    signal: 13
  },
  {
    id: "rag-evaluation-002",
    title: "enterprise search evaluation · case 002",
    scenario: "Investigate enterprise search evaluation in a shifted production slice.",
    failure: "synthetic set is too easy; scenario 2 exposes the operational consequence.",
    subtitle: "Use real failure slices — experiment 002",
    explanation: "Adjust the controls to see how synthetic set is too easy changes system quality, cost, and confidence.",
    lesson: "Use real failure slices. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1249,
    sampleSize: 309,
    signal: 32
  },
  {
    id: "rag-evaluation-003",
    title: "research assistant audit · case 003",
    scenario: "Investigate research assistant audit in a rare failure regime.",
    failure: "judge favors verbosity; scenario 3 exposes the operational consequence.",
    subtitle: "Calibrate automated judges — experiment 003",
    explanation: "Adjust the controls to see how judge favors verbosity changes system quality, cost, and confidence.",
    lesson: "Calibrate automated judges. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1256,
    sampleSize: 326,
    signal: 51
  },
  {
    id: "rag-evaluation-004",
    title: "support QA benchmark · case 004",
    scenario: "Investigate support QA benchmark in a high-scale environment.",
    failure: "answer score hides retrieval miss; scenario 4 exposes the operational consequence.",
    subtitle: "Evaluate stages separately — experiment 004",
    explanation: "Adjust the controls to see how answer score hides retrieval miss changes system quality, cost, and confidence.",
    lesson: "Evaluate stages separately. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1263,
    sampleSize: 343,
    signal: 70
  },
  {
    id: "rag-evaluation-005",
    title: "enterprise search evaluation · case 005",
    scenario: "Investigate enterprise search evaluation in a small clean workload.",
    failure: "synthetic set is too easy; scenario 5 exposes the operational consequence.",
    subtitle: "Use real failure slices — experiment 005",
    explanation: "Adjust the controls to see how synthetic set is too easy changes system quality, cost, and confidence.",
    lesson: "Use real failure slices. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1270,
    sampleSize: 360,
    signal: 89
  },
  {
    id: "rag-evaluation-006",
    title: "research assistant audit · case 006",
    scenario: "Investigate research assistant audit in a large noisy workload.",
    failure: "judge favors verbosity; scenario 6 exposes the operational consequence.",
    subtitle: "Calibrate automated judges — experiment 006",
    explanation: "Adjust the controls to see how judge favors verbosity changes system quality, cost, and confidence.",
    lesson: "Calibrate automated judges. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1277,
    sampleSize: 377,
    signal: 7
  },
  {
    id: "rag-evaluation-007",
    title: "support QA benchmark · case 007",
    scenario: "Investigate support QA benchmark in a shifted production slice.",
    failure: "answer score hides retrieval miss; scenario 7 exposes the operational consequence.",
    subtitle: "Evaluate stages separately — experiment 007",
    explanation: "Adjust the controls to see how answer score hides retrieval miss changes system quality, cost, and confidence.",
    lesson: "Evaluate stages separately. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1284,
    sampleSize: 394,
    signal: 26
  },
  {
    id: "rag-evaluation-008",
    title: "enterprise search evaluation · case 008",
    scenario: "Investigate enterprise search evaluation in a rare failure regime.",
    failure: "synthetic set is too easy; scenario 8 exposes the operational consequence.",
    subtitle: "Use real failure slices — experiment 008",
    explanation: "Adjust the controls to see how synthetic set is too easy changes system quality, cost, and confidence.",
    lesson: "Use real failure slices. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1291,
    sampleSize: 411,
    signal: 45
  },
  {
    id: "rag-evaluation-009",
    title: "research assistant audit · case 009",
    scenario: "Investigate research assistant audit in a high-scale environment.",
    failure: "judge favors verbosity; scenario 9 exposes the operational consequence.",
    subtitle: "Calibrate automated judges — experiment 009",
    explanation: "Adjust the controls to see how judge favors verbosity changes system quality, cost, and confidence.",
    lesson: "Calibrate automated judges. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1298,
    sampleSize: 428,
    signal: 64
  },
  {
    id: "rag-evaluation-010",
    title: "support QA benchmark · case 010",
    scenario: "Investigate support QA benchmark in a small clean workload.",
    failure: "answer score hides retrieval miss; scenario 10 exposes the operational consequence.",
    subtitle: "Evaluate stages separately — experiment 010",
    explanation: "Adjust the controls to see how answer score hides retrieval miss changes system quality, cost, and confidence.",
    lesson: "Evaluate stages separately. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1305,
    sampleSize: 445,
    signal: 83
  },
  {
    id: "rag-evaluation-011",
    title: "enterprise search evaluation · case 011",
    scenario: "Investigate enterprise search evaluation in a large noisy workload.",
    failure: "synthetic set is too easy; scenario 11 exposes the operational consequence.",
    subtitle: "Use real failure slices — experiment 011",
    explanation: "Adjust the controls to see how synthetic set is too easy changes system quality, cost, and confidence.",
    lesson: "Use real failure slices. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1312,
    sampleSize: 462,
    signal: 1
  },
  {
    id: "rag-evaluation-012",
    title: "research assistant audit · case 012",
    scenario: "Investigate research assistant audit in a shifted production slice.",
    failure: "judge favors verbosity; scenario 12 exposes the operational consequence.",
    subtitle: "Calibrate automated judges — experiment 012",
    explanation: "Adjust the controls to see how judge favors verbosity changes system quality, cost, and confidence.",
    lesson: "Calibrate automated judges. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1319,
    sampleSize: 479,
    signal: 20
  }
];

export default function RagEvaluationWorkbenchLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

