import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "RAG Freshness & Version Lab",
  "kicker": "RAG systems interactive lab",
  "description": "Tune retrieval stages, evidence quality, freshness, permissions, and end-to-end answer reliability.",
  "mode": "curve",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "hsl(270 72% 42%)",
    "secondary": "hsl(38 70% 42%)",
    "background": "hsl(270 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(270 30% 13%)",
    "muted": "hsl(270 14% 43%)",
    "line": "hsl(270 28% 86%)",
    "soft": "hsl(270 55% 92%)"
  },
  "controlTitle": "RAG Freshness & Version Lab controls",
  "controls": [
    {
      "label": "Freshness weight",
      "min": 0,
      "max": 100,
      "default": 41,
      "unit": "%",
      "help": "Tune freshness weight and observe system behavior."
    },
    {
      "label": "Version strictness",
      "min": 0,
      "max": 100,
      "default": 63,
      "unit": "",
      "help": "Stress version strictness across realistic operating ranges."
    },
    {
      "label": "Update lag",
      "min": 0,
      "max": 100,
      "default": 33,
      "unit": "",
      "help": "Use update lag to reveal boundary failures."
    }
  ],
  "visualTitle": "RAG Freshness & Version Lab live view",
  "metrics": [
    {
      "label": "Freshness score",
      "detail": "primary behavior"
    },
    {
      "label": "Version score",
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
  "formula": "rank=rel−λ·age+version_match",
  "costScale": 0.95,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Freshness is query-dependent",
      "body": "Principle 1: use this when reviewing rag freshness & version lab behavior in production."
    },
    {
      "title": "Store effective dates",
      "body": "Principle 2: use this when reviewing rag freshness & version lab behavior in production."
    },
    {
      "title": "Monitor indexing lag",
      "body": "Principle 3: use this when reviewing rag freshness & version lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "freshness-versioning-001",
    title: "latest policy answer · case 001",
    scenario: "Investigate latest policy answer in a small clean workload.",
    failure: "old page ranks higher; scenario 1 exposes the operational consequence.",
    subtitle: "Freshness is query-dependent — experiment 001",
    explanation: "Adjust the controls to see how old page ranks higher changes system quality, cost, and confidence.",
    lesson: "Freshness is query-dependent. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1229,
    sampleSize: 291,
    signal: 12
  },
  {
    id: "freshness-versioning-002",
    title: "software version docs · case 002",
    scenario: "Investigate software version docs in a large noisy workload.",
    failure: "new content is unindexed; scenario 2 exposes the operational consequence.",
    subtitle: "Store effective dates — experiment 002",
    explanation: "Adjust the controls to see how new content is unindexed changes system quality, cost, and confidence.",
    lesson: "Store effective dates. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1236,
    sampleSize: 308,
    signal: 31
  },
  {
    id: "freshness-versioning-003",
    title: "daily market brief · case 003",
    scenario: "Investigate daily market brief in a shifted production slice.",
    failure: "versions are mixed in context; scenario 3 exposes the operational consequence.",
    subtitle: "Monitor indexing lag — experiment 003",
    explanation: "Adjust the controls to see how versions are mixed in context changes system quality, cost, and confidence.",
    lesson: "Monitor indexing lag. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1243,
    sampleSize: 325,
    signal: 50
  },
  {
    id: "freshness-versioning-004",
    title: "latest policy answer · case 004",
    scenario: "Investigate latest policy answer in a rare failure regime.",
    failure: "old page ranks higher; scenario 4 exposes the operational consequence.",
    subtitle: "Freshness is query-dependent — experiment 004",
    explanation: "Adjust the controls to see how old page ranks higher changes system quality, cost, and confidence.",
    lesson: "Freshness is query-dependent. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1250,
    sampleSize: 342,
    signal: 69
  },
  {
    id: "freshness-versioning-005",
    title: "software version docs · case 005",
    scenario: "Investigate software version docs in a high-scale environment.",
    failure: "new content is unindexed; scenario 5 exposes the operational consequence.",
    subtitle: "Store effective dates — experiment 005",
    explanation: "Adjust the controls to see how new content is unindexed changes system quality, cost, and confidence.",
    lesson: "Store effective dates. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1257,
    sampleSize: 359,
    signal: 88
  },
  {
    id: "freshness-versioning-006",
    title: "daily market brief · case 006",
    scenario: "Investigate daily market brief in a small clean workload.",
    failure: "versions are mixed in context; scenario 6 exposes the operational consequence.",
    subtitle: "Monitor indexing lag — experiment 006",
    explanation: "Adjust the controls to see how versions are mixed in context changes system quality, cost, and confidence.",
    lesson: "Monitor indexing lag. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1264,
    sampleSize: 376,
    signal: 6
  },
  {
    id: "freshness-versioning-007",
    title: "latest policy answer · case 007",
    scenario: "Investigate latest policy answer in a large noisy workload.",
    failure: "old page ranks higher; scenario 7 exposes the operational consequence.",
    subtitle: "Freshness is query-dependent — experiment 007",
    explanation: "Adjust the controls to see how old page ranks higher changes system quality, cost, and confidence.",
    lesson: "Freshness is query-dependent. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1271,
    sampleSize: 393,
    signal: 25
  },
  {
    id: "freshness-versioning-008",
    title: "software version docs · case 008",
    scenario: "Investigate software version docs in a shifted production slice.",
    failure: "new content is unindexed; scenario 8 exposes the operational consequence.",
    subtitle: "Store effective dates — experiment 008",
    explanation: "Adjust the controls to see how new content is unindexed changes system quality, cost, and confidence.",
    lesson: "Store effective dates. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1278,
    sampleSize: 410,
    signal: 44
  },
  {
    id: "freshness-versioning-009",
    title: "daily market brief · case 009",
    scenario: "Investigate daily market brief in a rare failure regime.",
    failure: "versions are mixed in context; scenario 9 exposes the operational consequence.",
    subtitle: "Monitor indexing lag — experiment 009",
    explanation: "Adjust the controls to see how versions are mixed in context changes system quality, cost, and confidence.",
    lesson: "Monitor indexing lag. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1285,
    sampleSize: 427,
    signal: 63
  },
  {
    id: "freshness-versioning-010",
    title: "latest policy answer · case 010",
    scenario: "Investigate latest policy answer in a high-scale environment.",
    failure: "old page ranks higher; scenario 10 exposes the operational consequence.",
    subtitle: "Freshness is query-dependent — experiment 010",
    explanation: "Adjust the controls to see how old page ranks higher changes system quality, cost, and confidence.",
    lesson: "Freshness is query-dependent. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1292,
    sampleSize: 444,
    signal: 82
  },
  {
    id: "freshness-versioning-011",
    title: "software version docs · case 011",
    scenario: "Investigate software version docs in a small clean workload.",
    failure: "new content is unindexed; scenario 11 exposes the operational consequence.",
    subtitle: "Store effective dates — experiment 011",
    explanation: "Adjust the controls to see how new content is unindexed changes system quality, cost, and confidence.",
    lesson: "Store effective dates. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1299,
    sampleSize: 461,
    signal: 0
  },
  {
    id: "freshness-versioning-012",
    title: "daily market brief · case 012",
    scenario: "Investigate daily market brief in a large noisy workload.",
    failure: "versions are mixed in context; scenario 12 exposes the operational consequence.",
    subtitle: "Monitor indexing lag — experiment 012",
    explanation: "Adjust the controls to see how versions are mixed in context changes system quality, cost, and confidence.",
    lesson: "Monitor indexing lag. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1306,
    sampleSize: 478,
    signal: 19
  }
];

export default function RagFreshnessVersionLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

