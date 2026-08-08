import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Multimodal Alignment Lab",
  "kicker": "Generative AI interactive lab",
  "description": "Control generation, adaptation, multimodal behavior, evaluation, and safety with measurable trade-offs.",
  "mode": "curve",
  "variant": 3,
  "dark": false,
  "palette": {
    "primary": "hsl(207 72% 42%)",
    "secondary": "hsl(335 70% 42%)",
    "background": "hsl(207 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(207 30% 13%)",
    "muted": "hsl(207 14% 43%)",
    "line": "hsl(207 28% 86%)",
    "soft": "hsl(207 55% 92%)"
  },
  "controlTitle": "Multimodal Alignment Lab controls",
  "controls": [
    {
      "label": "Vision weight",
      "min": 0,
      "max": 100,
      "default": 45,
      "unit": "%",
      "help": "Tune vision weight and observe system behavior."
    },
    {
      "label": "Text weight",
      "min": 0,
      "max": 100,
      "default": 65,
      "unit": "",
      "help": "Stress text weight across realistic operating ranges."
    },
    {
      "label": "Alignment temperature",
      "min": 0,
      "max": 100,
      "default": 24,
      "unit": "",
      "help": "Use alignment temperature to reveal boundary failures."
    }
  ],
  "visualTitle": "Multimodal Alignment Lab live view",
  "metrics": [
    {
      "label": "Multimodal score",
      "detail": "primary behavior"
    },
    {
      "label": "Alignment score",
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
  "formula": "sim(v,t)=v·t/(||v||||t||)",
  "costScale": 0.75,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Test modality ablations",
      "body": "Principle 1: use this when reviewing multimodal alignment lab behavior in production."
    },
    {
      "title": "Align at the right level",
      "body": "Principle 2: use this when reviewing multimodal alignment lab behavior in production."
    },
    {
      "title": "Surface disagreement",
      "body": "Principle 3: use this when reviewing multimodal alignment lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "multimodal-alignment-001",
    title: "image caption matcher · case 001",
    scenario: "Investigate image caption matcher in a large noisy workload.",
    failure: "text shortcut ignores image; scenario 1 exposes the operational consequence.",
    subtitle: "Test modality ablations — experiment 001",
    explanation: "Adjust the controls to see how text shortcut ignores image changes system quality, cost, and confidence.",
    lesson: "Test modality ablations. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1112,
    sampleSize: 282,
    signal: 3
  },
  {
    id: "multimodal-alignment-002",
    title: "document vision assistant · case 002",
    scenario: "Investigate document vision assistant in a shifted production slice.",
    failure: "image crop removes evidence; scenario 2 exposes the operational consequence.",
    subtitle: "Align at the right level — experiment 002",
    explanation: "Adjust the controls to see how image crop removes evidence changes system quality, cost, and confidence.",
    lesson: "Align at the right level. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1119,
    sampleSize: 299,
    signal: 22
  },
  {
    id: "multimodal-alignment-003",
    title: "product photo search · case 003",
    scenario: "Investigate product photo search in a rare failure regime.",
    failure: "modalities disagree silently; scenario 3 exposes the operational consequence.",
    subtitle: "Surface disagreement — experiment 003",
    explanation: "Adjust the controls to see how modalities disagree silently changes system quality, cost, and confidence.",
    lesson: "Surface disagreement. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1126,
    sampleSize: 316,
    signal: 41
  },
  {
    id: "multimodal-alignment-004",
    title: "image caption matcher · case 004",
    scenario: "Investigate image caption matcher in a high-scale environment.",
    failure: "text shortcut ignores image; scenario 4 exposes the operational consequence.",
    subtitle: "Test modality ablations — experiment 004",
    explanation: "Adjust the controls to see how text shortcut ignores image changes system quality, cost, and confidence.",
    lesson: "Test modality ablations. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1133,
    sampleSize: 333,
    signal: 60
  },
  {
    id: "multimodal-alignment-005",
    title: "document vision assistant · case 005",
    scenario: "Investigate document vision assistant in a small clean workload.",
    failure: "image crop removes evidence; scenario 5 exposes the operational consequence.",
    subtitle: "Align at the right level — experiment 005",
    explanation: "Adjust the controls to see how image crop removes evidence changes system quality, cost, and confidence.",
    lesson: "Align at the right level. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1140,
    sampleSize: 350,
    signal: 79
  },
  {
    id: "multimodal-alignment-006",
    title: "product photo search · case 006",
    scenario: "Investigate product photo search in a large noisy workload.",
    failure: "modalities disagree silently; scenario 6 exposes the operational consequence.",
    subtitle: "Surface disagreement — experiment 006",
    explanation: "Adjust the controls to see how modalities disagree silently changes system quality, cost, and confidence.",
    lesson: "Surface disagreement. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1147,
    sampleSize: 367,
    signal: 98
  },
  {
    id: "multimodal-alignment-007",
    title: "image caption matcher · case 007",
    scenario: "Investigate image caption matcher in a shifted production slice.",
    failure: "text shortcut ignores image; scenario 7 exposes the operational consequence.",
    subtitle: "Test modality ablations — experiment 007",
    explanation: "Adjust the controls to see how text shortcut ignores image changes system quality, cost, and confidence.",
    lesson: "Test modality ablations. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1154,
    sampleSize: 384,
    signal: 16
  },
  {
    id: "multimodal-alignment-008",
    title: "document vision assistant · case 008",
    scenario: "Investigate document vision assistant in a rare failure regime.",
    failure: "image crop removes evidence; scenario 8 exposes the operational consequence.",
    subtitle: "Align at the right level — experiment 008",
    explanation: "Adjust the controls to see how image crop removes evidence changes system quality, cost, and confidence.",
    lesson: "Align at the right level. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1161,
    sampleSize: 401,
    signal: 35
  },
  {
    id: "multimodal-alignment-009",
    title: "product photo search · case 009",
    scenario: "Investigate product photo search in a high-scale environment.",
    failure: "modalities disagree silently; scenario 9 exposes the operational consequence.",
    subtitle: "Surface disagreement — experiment 009",
    explanation: "Adjust the controls to see how modalities disagree silently changes system quality, cost, and confidence.",
    lesson: "Surface disagreement. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1168,
    sampleSize: 418,
    signal: 54
  },
  {
    id: "multimodal-alignment-010",
    title: "image caption matcher · case 010",
    scenario: "Investigate image caption matcher in a small clean workload.",
    failure: "text shortcut ignores image; scenario 10 exposes the operational consequence.",
    subtitle: "Test modality ablations — experiment 010",
    explanation: "Adjust the controls to see how text shortcut ignores image changes system quality, cost, and confidence.",
    lesson: "Test modality ablations. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1175,
    sampleSize: 435,
    signal: 73
  },
  {
    id: "multimodal-alignment-011",
    title: "document vision assistant · case 011",
    scenario: "Investigate document vision assistant in a large noisy workload.",
    failure: "image crop removes evidence; scenario 11 exposes the operational consequence.",
    subtitle: "Align at the right level — experiment 011",
    explanation: "Adjust the controls to see how image crop removes evidence changes system quality, cost, and confidence.",
    lesson: "Align at the right level. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1182,
    sampleSize: 452,
    signal: 92
  },
  {
    id: "multimodal-alignment-012",
    title: "product photo search · case 012",
    scenario: "Investigate product photo search in a shifted production slice.",
    failure: "modalities disagree silently; scenario 12 exposes the operational consequence.",
    subtitle: "Surface disagreement — experiment 012",
    explanation: "Adjust the controls to see how modalities disagree silently changes system quality, cost, and confidence.",
    lesson: "Surface disagreement. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1189,
    sampleSize: 469,
    signal: 10
  }
];

export default function MultimodalAlignmentLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

