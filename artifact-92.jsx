import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Citation Alignment Studio",
  "kicker": "RAG systems interactive lab",
  "description": "Tune retrieval stages, evidence quality, freshness, permissions, and end-to-end answer reliability.",
  "mode": "image",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "hsl(176 88% 66%)",
    "secondary": "hsl(304 78% 62%)",
    "background": "hsl(176 24% 7%)",
    "panel": "hsl(176 22% 12%)",
    "ink": "hsl(176 35% 94%)",
    "muted": "hsl(176 16% 68%)",
    "line": "hsl(176 20% 25%)",
    "soft": "hsl(176 25% 18%)"
  },
  "controlTitle": "Citation Alignment Studio controls",
  "controls": [
    {
      "label": "Claim span",
      "min": 0,
      "max": 100,
      "default": 39,
      "unit": "%",
      "help": "Tune claim span and observe system behavior."
    },
    {
      "label": "Citation distance",
      "min": 0,
      "max": 100,
      "default": 61,
      "unit": "",
      "help": "Stress citation distance across realistic operating ranges."
    },
    {
      "label": "Support threshold",
      "min": 0,
      "max": 100,
      "default": 31,
      "unit": "",
      "help": "Use support threshold to reveal boundary failures."
    }
  ],
  "visualTitle": "Citation Alignment Studio live view",
  "metrics": [
    {
      "label": "Citation score",
      "detail": "primary behavior"
    },
    {
      "label": "Alignment score",
      "detail": "robustness check"
    },
    {
      "label": "Studio score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "alignment=entailed_claims/citations",
  "costScale": 0.75,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Cite at claim level",
      "body": "Principle 1: use this when reviewing citation alignment studio behavior in production."
    },
    {
      "title": "Relevance is not entailment",
      "body": "Principle 2: use this when reviewing citation alignment studio behavior in production."
    },
    {
      "title": "Make unsupported claims visible",
      "body": "Principle 3: use this when reviewing citation alignment studio behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "citation-alignment-001",
    title: "research answer citations · case 001",
    scenario: "Investigate research answer citations in a rare failure regime.",
    failure: "citation supports nearby claim only; scenario 1 exposes the operational consequence.",
    subtitle: "Cite at claim level — experiment 001",
    explanation: "Adjust the controls to see how citation supports nearby claim only changes system quality, cost, and confidence.",
    lesson: "Cite at claim level. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1203,
    sampleSize: 289,
    signal: 10
  },
  {
    id: "citation-alignment-002",
    title: "compliance response · case 002",
    scenario: "Investigate compliance response in a high-scale environment.",
    failure: "source is relevant but not entailing; scenario 2 exposes the operational consequence.",
    subtitle: "Relevance is not entailment — experiment 002",
    explanation: "Adjust the controls to see how source is relevant but not entailing changes system quality, cost, and confidence.",
    lesson: "Relevance is not entailment. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1210,
    sampleSize: 306,
    signal: 29
  },
  {
    id: "citation-alignment-003",
    title: "product comparison report · case 003",
    scenario: "Investigate product comparison report in a small clean workload.",
    failure: "multi-claim sentence blurs support; scenario 3 exposes the operational consequence.",
    subtitle: "Make unsupported claims visible — experiment 003",
    explanation: "Adjust the controls to see how multi-claim sentence blurs support changes system quality, cost, and confidence.",
    lesson: "Make unsupported claims visible. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1217,
    sampleSize: 323,
    signal: 48
  },
  {
    id: "citation-alignment-004",
    title: "research answer citations · case 004",
    scenario: "Investigate research answer citations in a large noisy workload.",
    failure: "citation supports nearby claim only; scenario 4 exposes the operational consequence.",
    subtitle: "Cite at claim level — experiment 004",
    explanation: "Adjust the controls to see how citation supports nearby claim only changes system quality, cost, and confidence.",
    lesson: "Cite at claim level. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1224,
    sampleSize: 340,
    signal: 67
  },
  {
    id: "citation-alignment-005",
    title: "compliance response · case 005",
    scenario: "Investigate compliance response in a shifted production slice.",
    failure: "source is relevant but not entailing; scenario 5 exposes the operational consequence.",
    subtitle: "Relevance is not entailment — experiment 005",
    explanation: "Adjust the controls to see how source is relevant but not entailing changes system quality, cost, and confidence.",
    lesson: "Relevance is not entailment. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1231,
    sampleSize: 357,
    signal: 86
  },
  {
    id: "citation-alignment-006",
    title: "product comparison report · case 006",
    scenario: "Investigate product comparison report in a rare failure regime.",
    failure: "multi-claim sentence blurs support; scenario 6 exposes the operational consequence.",
    subtitle: "Make unsupported claims visible — experiment 006",
    explanation: "Adjust the controls to see how multi-claim sentence blurs support changes system quality, cost, and confidence.",
    lesson: "Make unsupported claims visible. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1238,
    sampleSize: 374,
    signal: 4
  },
  {
    id: "citation-alignment-007",
    title: "research answer citations · case 007",
    scenario: "Investigate research answer citations in a high-scale environment.",
    failure: "citation supports nearby claim only; scenario 7 exposes the operational consequence.",
    subtitle: "Cite at claim level — experiment 007",
    explanation: "Adjust the controls to see how citation supports nearby claim only changes system quality, cost, and confidence.",
    lesson: "Cite at claim level. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1245,
    sampleSize: 391,
    signal: 23
  },
  {
    id: "citation-alignment-008",
    title: "compliance response · case 008",
    scenario: "Investigate compliance response in a small clean workload.",
    failure: "source is relevant but not entailing; scenario 8 exposes the operational consequence.",
    subtitle: "Relevance is not entailment — experiment 008",
    explanation: "Adjust the controls to see how source is relevant but not entailing changes system quality, cost, and confidence.",
    lesson: "Relevance is not entailment. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1252,
    sampleSize: 408,
    signal: 42
  },
  {
    id: "citation-alignment-009",
    title: "product comparison report · case 009",
    scenario: "Investigate product comparison report in a large noisy workload.",
    failure: "multi-claim sentence blurs support; scenario 9 exposes the operational consequence.",
    subtitle: "Make unsupported claims visible — experiment 009",
    explanation: "Adjust the controls to see how multi-claim sentence blurs support changes system quality, cost, and confidence.",
    lesson: "Make unsupported claims visible. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1259,
    sampleSize: 425,
    signal: 61
  },
  {
    id: "citation-alignment-010",
    title: "research answer citations · case 010",
    scenario: "Investigate research answer citations in a shifted production slice.",
    failure: "citation supports nearby claim only; scenario 10 exposes the operational consequence.",
    subtitle: "Cite at claim level — experiment 010",
    explanation: "Adjust the controls to see how citation supports nearby claim only changes system quality, cost, and confidence.",
    lesson: "Cite at claim level. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1266,
    sampleSize: 442,
    signal: 80
  },
  {
    id: "citation-alignment-011",
    title: "compliance response · case 011",
    scenario: "Investigate compliance response in a rare failure regime.",
    failure: "source is relevant but not entailing; scenario 11 exposes the operational consequence.",
    subtitle: "Relevance is not entailment — experiment 011",
    explanation: "Adjust the controls to see how source is relevant but not entailing changes system quality, cost, and confidence.",
    lesson: "Relevance is not entailment. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1273,
    sampleSize: 459,
    signal: 99
  },
  {
    id: "citation-alignment-012",
    title: "product comparison report · case 012",
    scenario: "Investigate product comparison report in a high-scale environment.",
    failure: "multi-claim sentence blurs support; scenario 12 exposes the operational consequence.",
    subtitle: "Make unsupported claims visible — experiment 012",
    explanation: "Adjust the controls to see how multi-claim sentence blurs support changes system quality, cost, and confidence.",
    lesson: "Make unsupported claims visible. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1280,
    sampleSize: 476,
    signal: 17
  }
];

export default function CitationAlignmentLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

