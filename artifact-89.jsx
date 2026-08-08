import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Metadata Filter Workshop",
  "kicker": "RAG systems interactive lab",
  "description": "Tune retrieval stages, evidence quality, freshness, permissions, and end-to-end answer reliability.",
  "mode": "neighbors",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "hsl(35 88% 66%)",
    "secondary": "hsl(163 78% 62%)",
    "background": "hsl(35 24% 7%)",
    "panel": "hsl(35 22% 12%)",
    "ink": "hsl(35 35% 94%)",
    "muted": "hsl(35 16% 68%)",
    "line": "hsl(35 20% 25%)",
    "soft": "hsl(35 25% 18%)"
  },
  "controlTitle": "Metadata Filter Workshop controls",
  "controls": [
    {
      "label": "Filter strictness",
      "min": 0,
      "max": 100,
      "default": 49,
      "unit": "%",
      "help": "Tune filter strictness and observe system behavior."
    },
    {
      "label": "Candidate pool",
      "min": 0,
      "max": 100,
      "default": 58,
      "unit": "",
      "help": "Stress candidate pool across realistic operating ranges."
    },
    {
      "label": "Missing metadata",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use missing metadata to reveal boundary failures."
    }
  ],
  "visualTitle": "Metadata Filter Workshop live view",
  "metrics": [
    {
      "label": "Metadata score",
      "detail": "primary behavior"
    },
    {
      "label": "Filter score",
      "detail": "robustness check"
    },
    {
      "label": "Workshop score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "results=ANN(q)∩filter(metadata)",
  "costScale": 1.15,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Metadata is retrieval logic",
      "body": "Principle 1: use this when reviewing metadata filter workshop behavior in production."
    },
    {
      "title": "Plan empty-result fallback",
      "body": "Principle 2: use this when reviewing metadata filter workshop behavior in production."
    },
    {
      "title": "Validate tenant boundaries",
      "body": "Principle 3: use this when reviewing metadata filter workshop behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "metadata-filtering-001",
    title: "regional policy search · case 001",
    scenario: "Investigate regional policy search in a small clean workload.",
    failure: "strict filter returns nothing; scenario 1 exposes the operational consequence.",
    subtitle: "Metadata is retrieval logic — experiment 001",
    explanation: "Adjust the controls to see how strict filter returns nothing changes system quality, cost, and confidence.",
    lesson: "Metadata is retrieval logic. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1164,
    sampleSize: 286,
    signal: 7
  },
  {
    id: "metadata-filtering-002",
    title: "versioned API docs · case 002",
    scenario: "Investigate versioned API docs in a large noisy workload.",
    failure: "missing tags hide evidence; scenario 2 exposes the operational consequence.",
    subtitle: "Plan empty-result fallback — experiment 002",
    explanation: "Adjust the controls to see how missing tags hide evidence changes system quality, cost, and confidence.",
    lesson: "Plan empty-result fallback. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1171,
    sampleSize: 303,
    signal: 26
  },
  {
    id: "metadata-filtering-003",
    title: "tenant-isolated knowledge · case 003",
    scenario: "Investigate tenant-isolated knowledge in a shifted production slice.",
    failure: "filter applied after small top-k; scenario 3 exposes the operational consequence.",
    subtitle: "Validate tenant boundaries — experiment 003",
    explanation: "Adjust the controls to see how filter applied after small top-k changes system quality, cost, and confidence.",
    lesson: "Validate tenant boundaries. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1178,
    sampleSize: 320,
    signal: 45
  },
  {
    id: "metadata-filtering-004",
    title: "regional policy search · case 004",
    scenario: "Investigate regional policy search in a rare failure regime.",
    failure: "strict filter returns nothing; scenario 4 exposes the operational consequence.",
    subtitle: "Metadata is retrieval logic — experiment 004",
    explanation: "Adjust the controls to see how strict filter returns nothing changes system quality, cost, and confidence.",
    lesson: "Metadata is retrieval logic. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1185,
    sampleSize: 337,
    signal: 64
  },
  {
    id: "metadata-filtering-005",
    title: "versioned API docs · case 005",
    scenario: "Investigate versioned API docs in a high-scale environment.",
    failure: "missing tags hide evidence; scenario 5 exposes the operational consequence.",
    subtitle: "Plan empty-result fallback — experiment 005",
    explanation: "Adjust the controls to see how missing tags hide evidence changes system quality, cost, and confidence.",
    lesson: "Plan empty-result fallback. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1192,
    sampleSize: 354,
    signal: 83
  },
  {
    id: "metadata-filtering-006",
    title: "tenant-isolated knowledge · case 006",
    scenario: "Investigate tenant-isolated knowledge in a small clean workload.",
    failure: "filter applied after small top-k; scenario 6 exposes the operational consequence.",
    subtitle: "Validate tenant boundaries — experiment 006",
    explanation: "Adjust the controls to see how filter applied after small top-k changes system quality, cost, and confidence.",
    lesson: "Validate tenant boundaries. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1199,
    sampleSize: 371,
    signal: 1
  },
  {
    id: "metadata-filtering-007",
    title: "regional policy search · case 007",
    scenario: "Investigate regional policy search in a large noisy workload.",
    failure: "strict filter returns nothing; scenario 7 exposes the operational consequence.",
    subtitle: "Metadata is retrieval logic — experiment 007",
    explanation: "Adjust the controls to see how strict filter returns nothing changes system quality, cost, and confidence.",
    lesson: "Metadata is retrieval logic. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1206,
    sampleSize: 388,
    signal: 20
  },
  {
    id: "metadata-filtering-008",
    title: "versioned API docs · case 008",
    scenario: "Investigate versioned API docs in a shifted production slice.",
    failure: "missing tags hide evidence; scenario 8 exposes the operational consequence.",
    subtitle: "Plan empty-result fallback — experiment 008",
    explanation: "Adjust the controls to see how missing tags hide evidence changes system quality, cost, and confidence.",
    lesson: "Plan empty-result fallback. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 1213,
    sampleSize: 405,
    signal: 39
  },
  {
    id: "metadata-filtering-009",
    title: "tenant-isolated knowledge · case 009",
    scenario: "Investigate tenant-isolated knowledge in a rare failure regime.",
    failure: "filter applied after small top-k; scenario 9 exposes the operational consequence.",
    subtitle: "Validate tenant boundaries — experiment 009",
    explanation: "Adjust the controls to see how filter applied after small top-k changes system quality, cost, and confidence.",
    lesson: "Validate tenant boundaries. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 1220,
    sampleSize: 422,
    signal: 58
  },
  {
    id: "metadata-filtering-010",
    title: "regional policy search · case 010",
    scenario: "Investigate regional policy search in a high-scale environment.",
    failure: "strict filter returns nothing; scenario 10 exposes the operational consequence.",
    subtitle: "Metadata is retrieval logic — experiment 010",
    explanation: "Adjust the controls to see how strict filter returns nothing changes system quality, cost, and confidence.",
    lesson: "Metadata is retrieval logic. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 1227,
    sampleSize: 439,
    signal: 77
  },
  {
    id: "metadata-filtering-011",
    title: "versioned API docs · case 011",
    scenario: "Investigate versioned API docs in a small clean workload.",
    failure: "missing tags hide evidence; scenario 11 exposes the operational consequence.",
    subtitle: "Plan empty-result fallback — experiment 011",
    explanation: "Adjust the controls to see how missing tags hide evidence changes system quality, cost, and confidence.",
    lesson: "Plan empty-result fallback. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 1234,
    sampleSize: 456,
    signal: 96
  },
  {
    id: "metadata-filtering-012",
    title: "tenant-isolated knowledge · case 012",
    scenario: "Investigate tenant-isolated knowledge in a large noisy workload.",
    failure: "filter applied after small top-k; scenario 12 exposes the operational consequence.",
    subtitle: "Validate tenant boundaries — experiment 012",
    explanation: "Adjust the controls to see how filter applied after small top-k changes system quality, cost, and confidence.",
    lesson: "Validate tenant boundaries. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 1241,
    sampleSize: 473,
    signal: 14
  }
];

export default function MetadataFilterWorkshopLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

