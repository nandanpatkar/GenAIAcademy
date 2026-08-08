import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Generative AI Guardrail Lab",
  "kicker": "Generative AI interactive lab",
  "description": "Control generation, adaptation, multimodal behavior, evaluation, and safety with measurable trade-offs.",
  "mode": "timeline",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "hsl(301 72% 42%)",
    "secondary": "hsl(69 70% 42%)",
    "background": "hsl(301 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(301 30% 13%)",
    "muted": "hsl(301 14% 43%)",
    "line": "hsl(301 28% 86%)",
    "soft": "hsl(301 55% 92%)"
  },
  "controlTitle": "Generative AI Guardrail Lab controls",
  "controls": [
    {
      "label": "Input screening",
      "min": 0,
      "max": 100,
      "default": 47,
      "unit": "%",
      "help": "Tune input screening and observe system behavior."
    },
    {
      "label": "Output threshold",
      "min": 0,
      "max": 100,
      "default": 67,
      "unit": "",
      "help": "Stress output threshold across realistic operating ranges."
    },
    {
      "label": "Policy strictness",
      "min": 0,
      "max": 100,
      "default": 26,
      "unit": "",
      "help": "Use policy strictness to reveal boundary failures."
    }
  ],
  "visualTitle": "Generative AI Guardrail Lab live view",
  "metrics": [
    {
      "label": "Generative score",
      "detail": "primary behavior"
    },
    {
      "label": "Guardrail score",
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
  "formula": "allow=policy(input,output,context)",
  "costScale": 0.95,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Layer controls",
      "body": "Principle 1: use this when reviewing generative ai guardrail lab behavior in production."
    },
    {
      "title": "Test evasions",
      "body": "Principle 2: use this when reviewing generative ai guardrail lab behavior in production."
    },
    {
      "title": "Log decisions safely",
      "body": "Principle 3: use this when reviewing generative ai guardrail lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "genai-guardrails-001",
    title: "public chatbot response · case 001",
    scenario: "Investigate public chatbot response in a rare failure regime.",
    failure: "filter blocks safe request; scenario 1 exposes the operational consequence.",
    subtitle: "Layer controls — experiment 001",
    explanation: "Adjust the controls to see how filter blocks safe request changes system quality, cost, and confidence.",
    lesson: "Layer controls. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1138,
    sampleSize: 284,
    signal: 5
  },
  {
    id: "genai-guardrails-002",
    title: "internal knowledge assistant · case 002",
    scenario: "Investigate internal knowledge assistant in a high-scale environment.",
    failure: "obfuscated attack bypasses; scenario 2 exposes the operational consequence.",
    subtitle: "Test evasions — experiment 002",
    explanation: "Adjust the controls to see how obfuscated attack bypasses changes system quality, cost, and confidence.",
    lesson: "Test evasions. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1145,
    sampleSize: 301,
    signal: 24
  },
  {
    id: "genai-guardrails-003",
    title: "content generation workflow · case 003",
    scenario: "Investigate content generation workflow in a small clean workload.",
    failure: "policy lacks context; scenario 3 exposes the operational consequence.",
    subtitle: "Log decisions safely — experiment 003",
    explanation: "Adjust the controls to see how policy lacks context changes system quality, cost, and confidence.",
    lesson: "Log decisions safely. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1152,
    sampleSize: 318,
    signal: 43
  },
  {
    id: "genai-guardrails-004",
    title: "public chatbot response · case 004",
    scenario: "Investigate public chatbot response in a large noisy workload.",
    failure: "filter blocks safe request; scenario 4 exposes the operational consequence.",
    subtitle: "Layer controls — experiment 004",
    explanation: "Adjust the controls to see how filter blocks safe request changes system quality, cost, and confidence.",
    lesson: "Layer controls. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1159,
    sampleSize: 335,
    signal: 62
  },
  {
    id: "genai-guardrails-005",
    title: "internal knowledge assistant · case 005",
    scenario: "Investigate internal knowledge assistant in a shifted production slice.",
    failure: "obfuscated attack bypasses; scenario 5 exposes the operational consequence.",
    subtitle: "Test evasions — experiment 005",
    explanation: "Adjust the controls to see how obfuscated attack bypasses changes system quality, cost, and confidence.",
    lesson: "Test evasions. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1166,
    sampleSize: 352,
    signal: 81
  },
  {
    id: "genai-guardrails-006",
    title: "content generation workflow · case 006",
    scenario: "Investigate content generation workflow in a rare failure regime.",
    failure: "policy lacks context; scenario 6 exposes the operational consequence.",
    subtitle: "Log decisions safely — experiment 006",
    explanation: "Adjust the controls to see how policy lacks context changes system quality, cost, and confidence.",
    lesson: "Log decisions safely. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1173,
    sampleSize: 369,
    signal: 100
  },
  {
    id: "genai-guardrails-007",
    title: "public chatbot response · case 007",
    scenario: "Investigate public chatbot response in a high-scale environment.",
    failure: "filter blocks safe request; scenario 7 exposes the operational consequence.",
    subtitle: "Layer controls — experiment 007",
    explanation: "Adjust the controls to see how filter blocks safe request changes system quality, cost, and confidence.",
    lesson: "Layer controls. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1180,
    sampleSize: 386,
    signal: 18
  },
  {
    id: "genai-guardrails-008",
    title: "internal knowledge assistant · case 008",
    scenario: "Investigate internal knowledge assistant in a small clean workload.",
    failure: "obfuscated attack bypasses; scenario 8 exposes the operational consequence.",
    subtitle: "Test evasions — experiment 008",
    explanation: "Adjust the controls to see how obfuscated attack bypasses changes system quality, cost, and confidence.",
    lesson: "Test evasions. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1187,
    sampleSize: 403,
    signal: 37
  },
  {
    id: "genai-guardrails-009",
    title: "content generation workflow · case 009",
    scenario: "Investigate content generation workflow in a large noisy workload.",
    failure: "policy lacks context; scenario 9 exposes the operational consequence.",
    subtitle: "Log decisions safely — experiment 009",
    explanation: "Adjust the controls to see how policy lacks context changes system quality, cost, and confidence.",
    lesson: "Log decisions safely. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1194,
    sampleSize: 420,
    signal: 56
  },
  {
    id: "genai-guardrails-010",
    title: "public chatbot response · case 010",
    scenario: "Investigate public chatbot response in a shifted production slice.",
    failure: "filter blocks safe request; scenario 10 exposes the operational consequence.",
    subtitle: "Layer controls — experiment 010",
    explanation: "Adjust the controls to see how filter blocks safe request changes system quality, cost, and confidence.",
    lesson: "Layer controls. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1201,
    sampleSize: 437,
    signal: 75
  },
  {
    id: "genai-guardrails-011",
    title: "internal knowledge assistant · case 011",
    scenario: "Investigate internal knowledge assistant in a rare failure regime.",
    failure: "obfuscated attack bypasses; scenario 11 exposes the operational consequence.",
    subtitle: "Test evasions — experiment 011",
    explanation: "Adjust the controls to see how obfuscated attack bypasses changes system quality, cost, and confidence.",
    lesson: "Test evasions. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1208,
    sampleSize: 454,
    signal: 94
  },
  {
    id: "genai-guardrails-012",
    title: "content generation workflow · case 012",
    scenario: "Investigate content generation workflow in a high-scale environment.",
    failure: "policy lacks context; scenario 12 exposes the operational consequence.",
    subtitle: "Log decisions safely — experiment 012",
    explanation: "Adjust the controls to see how policy lacks context changes system quality, cost, and confidence.",
    lesson: "Log decisions safely. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1215,
    sampleSize: 471,
    signal: 12
  }
];

export default function GenerativeAiGuardrailLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

