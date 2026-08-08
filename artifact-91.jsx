import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Context Compression Lab",
  "kicker": "RAG systems interactive lab",
  "description": "Tune retrieval stages, evidence quality, freshness, permissions, and end-to-end answer reliability.",
  "mode": "network",
  "variant": 3,
  "dark": false,
  "palette": {
    "primary": "hsl(129 72% 42%)",
    "secondary": "hsl(257 70% 42%)",
    "background": "hsl(129 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(129 30% 13%)",
    "muted": "hsl(129 14% 43%)",
    "line": "hsl(129 28% 86%)",
    "soft": "hsl(129 55% 92%)"
  },
  "controlTitle": "Context Compression Lab controls",
  "controls": [
    {
      "label": "Compression ratio",
      "min": 0,
      "max": 100,
      "default": 38,
      "unit": "%",
      "help": "Tune compression ratio and observe system behavior."
    },
    {
      "label": "Claim coverage",
      "min": 0,
      "max": 100,
      "default": 60,
      "unit": "",
      "help": "Stress claim coverage across realistic operating ranges."
    },
    {
      "label": "Redundancy removal",
      "min": 0,
      "max": 100,
      "default": 30,
      "unit": "",
      "help": "Use redundancy removal to reveal boundary failures."
    }
  ],
  "visualTitle": "Context Compression Lab live view",
  "metrics": [
    {
      "label": "Context score",
      "detail": "primary behavior"
    },
    {
      "label": "Compression score",
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
  "formula": "c′=compress(c|q)",
  "costScale": 0.65,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Preserve entailment",
      "body": "Principle 1: use this when reviewing context compression lab behavior in production."
    },
    {
      "title": "Track removed claims",
      "body": "Principle 2: use this when reviewing context compression lab behavior in production."
    },
    {
      "title": "Compress after retrieval",
      "body": "Principle 3: use this when reviewing context compression lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "context-compression-001",
    title: "long policy evidence · case 001",
    scenario: "Investigate long policy evidence in a shifted production slice.",
    failure: "compressor drops qualifier; scenario 1 exposes the operational consequence.",
    subtitle: "Preserve entailment — experiment 001",
    explanation: "Adjust the controls to see how compressor drops qualifier changes system quality, cost, and confidence.",
    lesson: "Preserve entailment. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1190,
    sampleSize: 288,
    signal: 9
  },
  {
    id: "context-compression-002",
    title: "multi-document synthesis · case 002",
    scenario: "Investigate multi-document synthesis in a rare failure regime.",
    failure: "summary invents bridge; scenario 2 exposes the operational consequence.",
    subtitle: "Track removed claims — experiment 002",
    explanation: "Adjust the controls to see how summary invents bridge changes system quality, cost, and confidence.",
    lesson: "Track removed claims. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1197,
    sampleSize: 305,
    signal: 28
  },
  {
    id: "context-compression-003",
    title: "technical manual answer · case 003",
    scenario: "Investigate technical manual answer in a high-scale environment.",
    failure: "duplicate evidence wastes tokens; scenario 3 exposes the operational consequence.",
    subtitle: "Compress after retrieval — experiment 003",
    explanation: "Adjust the controls to see how duplicate evidence wastes tokens changes system quality, cost, and confidence.",
    lesson: "Compress after retrieval. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1204,
    sampleSize: 322,
    signal: 47
  },
  {
    id: "context-compression-004",
    title: "long policy evidence · case 004",
    scenario: "Investigate long policy evidence in a small clean workload.",
    failure: "compressor drops qualifier; scenario 4 exposes the operational consequence.",
    subtitle: "Preserve entailment — experiment 004",
    explanation: "Adjust the controls to see how compressor drops qualifier changes system quality, cost, and confidence.",
    lesson: "Preserve entailment. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1211,
    sampleSize: 339,
    signal: 66
  },
  {
    id: "context-compression-005",
    title: "multi-document synthesis · case 005",
    scenario: "Investigate multi-document synthesis in a large noisy workload.",
    failure: "summary invents bridge; scenario 5 exposes the operational consequence.",
    subtitle: "Track removed claims — experiment 005",
    explanation: "Adjust the controls to see how summary invents bridge changes system quality, cost, and confidence.",
    lesson: "Track removed claims. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1218,
    sampleSize: 356,
    signal: 85
  },
  {
    id: "context-compression-006",
    title: "technical manual answer · case 006",
    scenario: "Investigate technical manual answer in a shifted production slice.",
    failure: "duplicate evidence wastes tokens; scenario 6 exposes the operational consequence.",
    subtitle: "Compress after retrieval — experiment 006",
    explanation: "Adjust the controls to see how duplicate evidence wastes tokens changes system quality, cost, and confidence.",
    lesson: "Compress after retrieval. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1225,
    sampleSize: 373,
    signal: 3
  },
  {
    id: "context-compression-007",
    title: "long policy evidence · case 007",
    scenario: "Investigate long policy evidence in a rare failure regime.",
    failure: "compressor drops qualifier; scenario 7 exposes the operational consequence.",
    subtitle: "Preserve entailment — experiment 007",
    explanation: "Adjust the controls to see how compressor drops qualifier changes system quality, cost, and confidence.",
    lesson: "Preserve entailment. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1232,
    sampleSize: 390,
    signal: 22
  },
  {
    id: "context-compression-008",
    title: "multi-document synthesis · case 008",
    scenario: "Investigate multi-document synthesis in a high-scale environment.",
    failure: "summary invents bridge; scenario 8 exposes the operational consequence.",
    subtitle: "Track removed claims — experiment 008",
    explanation: "Adjust the controls to see how summary invents bridge changes system quality, cost, and confidence.",
    lesson: "Track removed claims. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1239,
    sampleSize: 407,
    signal: 41
  },
  {
    id: "context-compression-009",
    title: "technical manual answer · case 009",
    scenario: "Investigate technical manual answer in a small clean workload.",
    failure: "duplicate evidence wastes tokens; scenario 9 exposes the operational consequence.",
    subtitle: "Compress after retrieval — experiment 009",
    explanation: "Adjust the controls to see how duplicate evidence wastes tokens changes system quality, cost, and confidence.",
    lesson: "Compress after retrieval. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1246,
    sampleSize: 424,
    signal: 60
  },
  {
    id: "context-compression-010",
    title: "long policy evidence · case 010",
    scenario: "Investigate long policy evidence in a large noisy workload.",
    failure: "compressor drops qualifier; scenario 10 exposes the operational consequence.",
    subtitle: "Preserve entailment — experiment 010",
    explanation: "Adjust the controls to see how compressor drops qualifier changes system quality, cost, and confidence.",
    lesson: "Preserve entailment. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1253,
    sampleSize: 441,
    signal: 79
  },
  {
    id: "context-compression-011",
    title: "multi-document synthesis · case 011",
    scenario: "Investigate multi-document synthesis in a shifted production slice.",
    failure: "summary invents bridge; scenario 11 exposes the operational consequence.",
    subtitle: "Track removed claims — experiment 011",
    explanation: "Adjust the controls to see how summary invents bridge changes system quality, cost, and confidence.",
    lesson: "Track removed claims. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1260,
    sampleSize: 458,
    signal: 98
  },
  {
    id: "context-compression-012",
    title: "technical manual answer · case 012",
    scenario: "Investigate technical manual answer in a rare failure regime.",
    failure: "duplicate evidence wastes tokens; scenario 12 exposes the operational consequence.",
    subtitle: "Compress after retrieval — experiment 012",
    explanation: "Adjust the controls to see how duplicate evidence wastes tokens changes system quality, cost, and confidence.",
    lesson: "Compress after retrieval. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1267,
    sampleSize: 475,
    signal: 16
  }
];

export default function ContextCompressionLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

