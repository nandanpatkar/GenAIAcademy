import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "CI Quality Gate Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "network",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "hsl(318 72% 42%)",
    "secondary": "hsl(86 70% 42%)",
    "background": "hsl(318 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(318 30% 13%)",
    "muted": "hsl(318 14% 43%)",
    "line": "hsl(318 28% 86%)",
    "soft": "hsl(318 55% 92%)"
  },
  "controlTitle": "CI Quality Gate Lab controls",
  "controls": [
    {
      "label": "Test breadth",
      "min": 0,
      "max": 100,
      "default": 39,
      "unit": "%",
      "help": "Tune test breadth and observe system behavior."
    },
    {
      "label": "Flake tolerance",
      "min": 0,
      "max": 100,
      "default": 65,
      "unit": "",
      "help": "Stress flake tolerance across realistic operating ranges."
    },
    {
      "label": "Gate strictness",
      "min": 0,
      "max": 100,
      "default": 40,
      "unit": "",
      "help": "Use gate strictness to reveal boundary failures."
    }
  ],
  "visualTitle": "CI Quality Gate Lab live view",
  "metrics": [
    {
      "label": "Quality score",
      "detail": "primary behavior"
    },
    {
      "label": "Gate score",
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
  "formula": "merge=tests∧lint∧security∧policy",
  "costScale": 1.25,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Fast feedback first",
      "body": "Principle 1: use this when reviewing ci quality gate lab behavior in production."
    },
    {
      "title": "Quarantine flakes visibly",
      "body": "Principle 2: use this when reviewing ci quality gate lab behavior in production."
    },
    {
      "title": "Gate meaningful risks",
      "body": "Principle 3: use this when reviewing ci quality gate lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "ci-quality-gates-001",
    title: "application pull request · case 001",
    scenario: "Investigate application pull request in a high-scale environment.",
    failure: "flaky test trains bypass; scenario 1 exposes the operational consequence.",
    subtitle: "Fast feedback first — experiment 001",
    explanation: "Adjust the controls to see how flaky test trains bypass changes system quality, cost, and confidence.",
    lesson: "Fast feedback first. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1541,
    sampleSize: 315,
    signal: 36
  },
  {
    id: "ci-quality-gates-002",
    title: "model pipeline change · case 002",
    scenario: "Investigate model pipeline change in a small clean workload.",
    failure: "slow gate blocks feedback; scenario 2 exposes the operational consequence.",
    subtitle: "Quarantine flakes visibly — experiment 002",
    explanation: "Adjust the controls to see how slow gate blocks feedback changes system quality, cost, and confidence.",
    lesson: "Quarantine flakes visibly. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1548,
    sampleSize: 332,
    signal: 55
  },
  {
    id: "ci-quality-gates-003",
    title: "infrastructure module update · case 003",
    scenario: "Investigate infrastructure module update in a large noisy workload.",
    failure: "coverage substitutes quality; scenario 3 exposes the operational consequence.",
    subtitle: "Gate meaningful risks — experiment 003",
    explanation: "Adjust the controls to see how coverage substitutes quality changes system quality, cost, and confidence.",
    lesson: "Gate meaningful risks. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1555,
    sampleSize: 349,
    signal: 74
  },
  {
    id: "ci-quality-gates-004",
    title: "application pull request · case 004",
    scenario: "Investigate application pull request in a shifted production slice.",
    failure: "flaky test trains bypass; scenario 4 exposes the operational consequence.",
    subtitle: "Fast feedback first — experiment 004",
    explanation: "Adjust the controls to see how flaky test trains bypass changes system quality, cost, and confidence.",
    lesson: "Fast feedback first. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1562,
    sampleSize: 366,
    signal: 93
  },
  {
    id: "ci-quality-gates-005",
    title: "model pipeline change · case 005",
    scenario: "Investigate model pipeline change in a rare failure regime.",
    failure: "slow gate blocks feedback; scenario 5 exposes the operational consequence.",
    subtitle: "Quarantine flakes visibly — experiment 005",
    explanation: "Adjust the controls to see how slow gate blocks feedback changes system quality, cost, and confidence.",
    lesson: "Quarantine flakes visibly. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1569,
    sampleSize: 383,
    signal: 11
  },
  {
    id: "ci-quality-gates-006",
    title: "infrastructure module update · case 006",
    scenario: "Investigate infrastructure module update in a high-scale environment.",
    failure: "coverage substitutes quality; scenario 6 exposes the operational consequence.",
    subtitle: "Gate meaningful risks — experiment 006",
    explanation: "Adjust the controls to see how coverage substitutes quality changes system quality, cost, and confidence.",
    lesson: "Gate meaningful risks. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1576,
    sampleSize: 400,
    signal: 30
  },
  {
    id: "ci-quality-gates-007",
    title: "application pull request · case 007",
    scenario: "Investigate application pull request in a small clean workload.",
    failure: "flaky test trains bypass; scenario 7 exposes the operational consequence.",
    subtitle: "Fast feedback first — experiment 007",
    explanation: "Adjust the controls to see how flaky test trains bypass changes system quality, cost, and confidence.",
    lesson: "Fast feedback first. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1583,
    sampleSize: 417,
    signal: 49
  },
  {
    id: "ci-quality-gates-008",
    title: "model pipeline change · case 008",
    scenario: "Investigate model pipeline change in a large noisy workload.",
    failure: "slow gate blocks feedback; scenario 8 exposes the operational consequence.",
    subtitle: "Quarantine flakes visibly — experiment 008",
    explanation: "Adjust the controls to see how slow gate blocks feedback changes system quality, cost, and confidence.",
    lesson: "Quarantine flakes visibly. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1590,
    sampleSize: 434,
    signal: 68
  },
  {
    id: "ci-quality-gates-009",
    title: "infrastructure module update · case 009",
    scenario: "Investigate infrastructure module update in a shifted production slice.",
    failure: "coverage substitutes quality; scenario 9 exposes the operational consequence.",
    subtitle: "Gate meaningful risks — experiment 009",
    explanation: "Adjust the controls to see how coverage substitutes quality changes system quality, cost, and confidence.",
    lesson: "Gate meaningful risks. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1597,
    sampleSize: 451,
    signal: 87
  },
  {
    id: "ci-quality-gates-010",
    title: "application pull request · case 010",
    scenario: "Investigate application pull request in a rare failure regime.",
    failure: "flaky test trains bypass; scenario 10 exposes the operational consequence.",
    subtitle: "Fast feedback first — experiment 010",
    explanation: "Adjust the controls to see how flaky test trains bypass changes system quality, cost, and confidence.",
    lesson: "Fast feedback first. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1604,
    sampleSize: 468,
    signal: 5
  },
  {
    id: "ci-quality-gates-011",
    title: "model pipeline change · case 011",
    scenario: "Investigate model pipeline change in a high-scale environment.",
    failure: "slow gate blocks feedback; scenario 11 exposes the operational consequence.",
    subtitle: "Quarantine flakes visibly — experiment 011",
    explanation: "Adjust the controls to see how slow gate blocks feedback changes system quality, cost, and confidence.",
    lesson: "Quarantine flakes visibly. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1611,
    sampleSize: 485,
    signal: 24
  },
  {
    id: "ci-quality-gates-012",
    title: "infrastructure module update · case 012",
    scenario: "Investigate infrastructure module update in a small clean workload.",
    failure: "coverage substitutes quality; scenario 12 exposes the operational consequence.",
    subtitle: "Gate meaningful risks — experiment 012",
    explanation: "Adjust the controls to see how coverage substitutes quality changes system quality, cost, and confidence.",
    lesson: "Gate meaningful risks. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1618,
    sampleSize: 502,
    signal: 43
  }
];

export default function CiQualityGateLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

