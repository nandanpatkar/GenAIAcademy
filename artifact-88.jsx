import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Query Rewriting Lab",
  "kicker": "RAG systems interactive lab",
  "description": "Tune retrieval stages, evidence quality, freshness, permissions, and end-to-end answer reliability.",
  "mode": "tree",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "hsl(348 72% 42%)",
    "secondary": "hsl(116 70% 42%)",
    "background": "hsl(348 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(348 30% 13%)",
    "muted": "hsl(348 14% 43%)",
    "line": "hsl(348 28% 86%)",
    "soft": "hsl(348 55% 92%)"
  },
  "controlTitle": "Query Rewriting Lab controls",
  "controls": [
    {
      "label": "Rewrite strength",
      "min": 0,
      "max": 100,
      "default": 48,
      "unit": "%",
      "help": "Tune rewrite strength and observe system behavior."
    },
    {
      "label": "History depth",
      "min": 0,
      "max": 100,
      "default": 57,
      "unit": "",
      "help": "Stress history depth across realistic operating ranges."
    },
    {
      "label": "Expansion count",
      "min": 0,
      "max": 100,
      "default": 27,
      "unit": "",
      "help": "Use expansion count to reveal boundary failures."
    }
  ],
  "visualTitle": "Query Rewriting Lab live view",
  "metrics": [
    {
      "label": "Query score",
      "detail": "primary behavior"
    },
    {
      "label": "Rewriting score",
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
  "formula": "q′=rewrite(q,history)",
  "costScale": 1.05,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Preserve user intent",
      "body": "Principle 1: use this when reviewing query rewriting lab behavior in production."
    },
    {
      "title": "Compare original retrieval",
      "body": "Principle 2: use this when reviewing query rewriting lab behavior in production."
    },
    {
      "title": "Expose rewritten query",
      "body": "Principle 3: use this when reviewing query rewriting lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "query-rewriting-001",
    title: "ambiguous support question · case 001",
    scenario: "Investigate ambiguous support question in a high-scale environment.",
    failure: "rewrite changes intent; scenario 1 exposes the operational consequence.",
    subtitle: "Preserve user intent — experiment 001",
    explanation: "Adjust the controls to see how rewrite changes intent changes system quality, cost, and confidence.",
    lesson: "Preserve user intent. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1151,
    sampleSize: 285,
    signal: 6
  },
  {
    id: "query-rewriting-002",
    title: "follow-up product query · case 002",
    scenario: "Investigate follow-up product query in a small clean workload.",
    failure: "history injects stale entity; scenario 2 exposes the operational consequence.",
    subtitle: "Compare original retrieval — experiment 002",
    explanation: "Adjust the controls to see how history injects stale entity changes system quality, cost, and confidence.",
    lesson: "Compare original retrieval. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1158,
    sampleSize: 302,
    signal: 25
  },
  {
    id: "query-rewriting-003",
    title: "acronym-heavy technical search · case 003",
    scenario: "Investigate acronym-heavy technical search in a large noisy workload.",
    failure: "expansion adds noisy terms; scenario 3 exposes the operational consequence.",
    subtitle: "Expose rewritten query — experiment 003",
    explanation: "Adjust the controls to see how expansion adds noisy terms changes system quality, cost, and confidence.",
    lesson: "Expose rewritten query. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1165,
    sampleSize: 319,
    signal: 44
  },
  {
    id: "query-rewriting-004",
    title: "ambiguous support question · case 004",
    scenario: "Investigate ambiguous support question in a shifted production slice.",
    failure: "rewrite changes intent; scenario 4 exposes the operational consequence.",
    subtitle: "Preserve user intent — experiment 004",
    explanation: "Adjust the controls to see how rewrite changes intent changes system quality, cost, and confidence.",
    lesson: "Preserve user intent. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1172,
    sampleSize: 336,
    signal: 63
  },
  {
    id: "query-rewriting-005",
    title: "follow-up product query · case 005",
    scenario: "Investigate follow-up product query in a rare failure regime.",
    failure: "history injects stale entity; scenario 5 exposes the operational consequence.",
    subtitle: "Compare original retrieval — experiment 005",
    explanation: "Adjust the controls to see how history injects stale entity changes system quality, cost, and confidence.",
    lesson: "Compare original retrieval. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1179,
    sampleSize: 353,
    signal: 82
  },
  {
    id: "query-rewriting-006",
    title: "acronym-heavy technical search · case 006",
    scenario: "Investigate acronym-heavy technical search in a high-scale environment.",
    failure: "expansion adds noisy terms; scenario 6 exposes the operational consequence.",
    subtitle: "Expose rewritten query — experiment 006",
    explanation: "Adjust the controls to see how expansion adds noisy terms changes system quality, cost, and confidence.",
    lesson: "Expose rewritten query. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1186,
    sampleSize: 370,
    signal: 0
  },
  {
    id: "query-rewriting-007",
    title: "ambiguous support question · case 007",
    scenario: "Investigate ambiguous support question in a small clean workload.",
    failure: "rewrite changes intent; scenario 7 exposes the operational consequence.",
    subtitle: "Preserve user intent — experiment 007",
    explanation: "Adjust the controls to see how rewrite changes intent changes system quality, cost, and confidence.",
    lesson: "Preserve user intent. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1193,
    sampleSize: 387,
    signal: 19
  },
  {
    id: "query-rewriting-008",
    title: "follow-up product query · case 008",
    scenario: "Investigate follow-up product query in a large noisy workload.",
    failure: "history injects stale entity; scenario 8 exposes the operational consequence.",
    subtitle: "Compare original retrieval — experiment 008",
    explanation: "Adjust the controls to see how history injects stale entity changes system quality, cost, and confidence.",
    lesson: "Compare original retrieval. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1200,
    sampleSize: 404,
    signal: 38
  },
  {
    id: "query-rewriting-009",
    title: "acronym-heavy technical search · case 009",
    scenario: "Investigate acronym-heavy technical search in a shifted production slice.",
    failure: "expansion adds noisy terms; scenario 9 exposes the operational consequence.",
    subtitle: "Expose rewritten query — experiment 009",
    explanation: "Adjust the controls to see how expansion adds noisy terms changes system quality, cost, and confidence.",
    lesson: "Expose rewritten query. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1207,
    sampleSize: 421,
    signal: 57
  },
  {
    id: "query-rewriting-010",
    title: "ambiguous support question · case 010",
    scenario: "Investigate ambiguous support question in a rare failure regime.",
    failure: "rewrite changes intent; scenario 10 exposes the operational consequence.",
    subtitle: "Preserve user intent — experiment 010",
    explanation: "Adjust the controls to see how rewrite changes intent changes system quality, cost, and confidence.",
    lesson: "Preserve user intent. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1214,
    sampleSize: 438,
    signal: 76
  },
  {
    id: "query-rewriting-011",
    title: "follow-up product query · case 011",
    scenario: "Investigate follow-up product query in a high-scale environment.",
    failure: "history injects stale entity; scenario 11 exposes the operational consequence.",
    subtitle: "Compare original retrieval — experiment 011",
    explanation: "Adjust the controls to see how history injects stale entity changes system quality, cost, and confidence.",
    lesson: "Compare original retrieval. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1221,
    sampleSize: 455,
    signal: 95
  },
  {
    id: "query-rewriting-012",
    title: "acronym-heavy technical search · case 012",
    scenario: "Investigate acronym-heavy technical search in a small clean workload.",
    failure: "expansion adds noisy terms; scenario 12 exposes the operational consequence.",
    subtitle: "Expose rewritten query — experiment 012",
    explanation: "Adjust the controls to see how expansion adds noisy terms changes system quality, cost, and confidence.",
    lesson: "Expose rewritten query. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1228,
    sampleSize: 472,
    signal: 13
  }
];

export default function QueryRewritingLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

