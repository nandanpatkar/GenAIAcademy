import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Semantic Cache Lab",
  "kicker": "RAG systems interactive lab",
  "description": "Tune retrieval stages, evidence quality, freshness, permissions, and end-to-end answer reliability.",
  "mode": "timeline",
  "variant": 2,
  "dark": false,
  "palette": {
    "primary": "hsl(4 72% 42%)",
    "secondary": "hsl(132 70% 42%)",
    "background": "hsl(4 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(4 30% 13%)",
    "muted": "hsl(4 14% 43%)",
    "line": "hsl(4 28% 86%)",
    "soft": "hsl(4 55% 92%)"
  },
  "controlTitle": "Semantic Cache Lab controls",
  "controls": [
    {
      "label": "Similarity threshold",
      "min": 0,
      "max": 100,
      "default": 43,
      "unit": "%",
      "help": "Tune similarity threshold and observe system behavior."
    },
    {
      "label": "TTL",
      "min": 0,
      "max": 100,
      "default": 65,
      "unit": "",
      "help": "Stress ttl across realistic operating ranges."
    },
    {
      "label": "Context key depth",
      "min": 0,
      "max": 100,
      "default": 35,
      "unit": "",
      "help": "Use context key depth to reveal boundary failures."
    }
  ],
  "visualTitle": "Semantic Cache Lab live view",
  "metrics": [
    {
      "label": "Semantic score",
      "detail": "primary behavior"
    },
    {
      "label": "Cache score",
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
  "formula": "hit=sim(q,q_cache)>τ",
  "costScale": 1.15,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Cache semantics carefully",
      "body": "Principle 1: use this when reviewing semantic cache lab behavior in production."
    },
    {
      "title": "Key all answer dependencies",
      "body": "Principle 2: use this when reviewing semantic cache lab behavior in production."
    },
    {
      "title": "Measure false hits",
      "body": "Principle 3: use this when reviewing semantic cache lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "semantic-cache-001",
    title: "FAQ assistant cache · case 001",
    scenario: "Investigate FAQ assistant cache in a shifted production slice.",
    failure: "near query needs different answer; scenario 1 exposes the operational consequence.",
    subtitle: "Cache semantics carefully — experiment 001",
    explanation: "Adjust the controls to see how near query needs different answer changes system quality, cost, and confidence.",
    lesson: "Cache semantics carefully. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1255,
    sampleSize: 293,
    signal: 14
  },
  {
    id: "semantic-cache-002",
    title: "coding answer cache · case 002",
    scenario: "Investigate coding answer cache in a rare failure regime.",
    failure: "stale hit survives update; scenario 2 exposes the operational consequence.",
    subtitle: "Key all answer dependencies — experiment 002",
    explanation: "Adjust the controls to see how stale hit survives update changes system quality, cost, and confidence.",
    lesson: "Key all answer dependencies. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1262,
    sampleSize: 310,
    signal: 33
  },
  {
    id: "semantic-cache-003",
    title: "product recommendation cache · case 003",
    scenario: "Investigate product recommendation cache in a high-scale environment.",
    failure: "tenant context omitted from key; scenario 3 exposes the operational consequence.",
    subtitle: "Measure false hits — experiment 003",
    explanation: "Adjust the controls to see how tenant context omitted from key changes system quality, cost, and confidence.",
    lesson: "Measure false hits. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1269,
    sampleSize: 327,
    signal: 52
  },
  {
    id: "semantic-cache-004",
    title: "FAQ assistant cache · case 004",
    scenario: "Investigate FAQ assistant cache in a small clean workload.",
    failure: "near query needs different answer; scenario 4 exposes the operational consequence.",
    subtitle: "Cache semantics carefully — experiment 004",
    explanation: "Adjust the controls to see how near query needs different answer changes system quality, cost, and confidence.",
    lesson: "Cache semantics carefully. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1276,
    sampleSize: 344,
    signal: 71
  },
  {
    id: "semantic-cache-005",
    title: "coding answer cache · case 005",
    scenario: "Investigate coding answer cache in a large noisy workload.",
    failure: "stale hit survives update; scenario 5 exposes the operational consequence.",
    subtitle: "Key all answer dependencies — experiment 005",
    explanation: "Adjust the controls to see how stale hit survives update changes system quality, cost, and confidence.",
    lesson: "Key all answer dependencies. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1283,
    sampleSize: 361,
    signal: 90
  },
  {
    id: "semantic-cache-006",
    title: "product recommendation cache · case 006",
    scenario: "Investigate product recommendation cache in a shifted production slice.",
    failure: "tenant context omitted from key; scenario 6 exposes the operational consequence.",
    subtitle: "Measure false hits — experiment 006",
    explanation: "Adjust the controls to see how tenant context omitted from key changes system quality, cost, and confidence.",
    lesson: "Measure false hits. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1290,
    sampleSize: 378,
    signal: 8
  },
  {
    id: "semantic-cache-007",
    title: "FAQ assistant cache · case 007",
    scenario: "Investigate FAQ assistant cache in a rare failure regime.",
    failure: "near query needs different answer; scenario 7 exposes the operational consequence.",
    subtitle: "Cache semantics carefully — experiment 007",
    explanation: "Adjust the controls to see how near query needs different answer changes system quality, cost, and confidence.",
    lesson: "Cache semantics carefully. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1297,
    sampleSize: 395,
    signal: 27
  },
  {
    id: "semantic-cache-008",
    title: "coding answer cache · case 008",
    scenario: "Investigate coding answer cache in a high-scale environment.",
    failure: "stale hit survives update; scenario 8 exposes the operational consequence.",
    subtitle: "Key all answer dependencies — experiment 008",
    explanation: "Adjust the controls to see how stale hit survives update changes system quality, cost, and confidence.",
    lesson: "Key all answer dependencies. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 4,
    seed: 1304,
    sampleSize: 412,
    signal: 46
  },
  {
    id: "semantic-cache-009",
    title: "product recommendation cache · case 009",
    scenario: "Investigate product recommendation cache in a small clean workload.",
    failure: "tenant context omitted from key; scenario 9 exposes the operational consequence.",
    subtitle: "Measure false hits — experiment 009",
    explanation: "Adjust the controls to see how tenant context omitted from key changes system quality, cost, and confidence.",
    lesson: "Measure false hits. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 5,
    seed: 1311,
    sampleSize: 429,
    signal: 65
  },
  {
    id: "semantic-cache-010",
    title: "FAQ assistant cache · case 010",
    scenario: "Investigate FAQ assistant cache in a large noisy workload.",
    failure: "near query needs different answer; scenario 10 exposes the operational consequence.",
    subtitle: "Cache semantics carefully — experiment 010",
    explanation: "Adjust the controls to see how near query needs different answer changes system quality, cost, and confidence.",
    lesson: "Cache semantics carefully. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 1,
    seed: 1318,
    sampleSize: 446,
    signal: 84
  },
  {
    id: "semantic-cache-011",
    title: "coding answer cache · case 011",
    scenario: "Investigate coding answer cache in a shifted production slice.",
    failure: "stale hit survives update; scenario 11 exposes the operational consequence.",
    subtitle: "Key all answer dependencies — experiment 011",
    explanation: "Adjust the controls to see how stale hit survives update changes system quality, cost, and confidence.",
    lesson: "Key all answer dependencies. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 2,
    seed: 1325,
    sampleSize: 463,
    signal: 2
  },
  {
    id: "semantic-cache-012",
    title: "product recommendation cache · case 012",
    scenario: "Investigate product recommendation cache in a rare failure regime.",
    failure: "tenant context omitted from key; scenario 12 exposes the operational consequence.",
    subtitle: "Measure false hits — experiment 012",
    explanation: "Adjust the controls to see how tenant context omitted from key changes system quality, cost, and confidence.",
    lesson: "Measure false hits. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 3,
    seed: 1332,
    sampleSize: 480,
    signal: 21
  }
];

export default function SemanticCacheLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

