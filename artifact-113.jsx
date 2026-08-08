import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "SLO & Error Budget Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "grid",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "hsl(83 88% 66%)",
    "secondary": "hsl(211 78% 62%)",
    "background": "hsl(83 24% 7%)",
    "panel": "hsl(83 22% 12%)",
    "ink": "hsl(83 35% 94%)",
    "muted": "hsl(83 16% 68%)",
    "line": "hsl(83 20% 25%)",
    "soft": "hsl(83 25% 18%)"
  },
  "controlTitle": "SLO & Error Budget Lab controls",
  "controls": [
    {
      "label": "SLO target",
      "min": 0,
      "max": 100,
      "default": 47,
      "unit": "%",
      "help": "Tune slo target and observe system behavior."
    },
    {
      "label": "Traffic volume",
      "min": 0,
      "max": 100,
      "default": 60,
      "unit": "",
      "help": "Stress traffic volume across realistic operating ranges."
    },
    {
      "label": "Burn window",
      "min": 0,
      "max": 100,
      "default": 35,
      "unit": "",
      "help": "Use burn window to reveal boundary failures."
    }
  ],
  "visualTitle": "SLO & Error Budget Lab live view",
  "metrics": [
    {
      "label": "Error score",
      "detail": "primary behavior"
    },
    {
      "label": "Budget score",
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
  "formula": "budget=1−SLO−bad_fraction",
  "costScale": 0.75,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Measure user outcomes",
      "body": "Principle 1: use this when reviewing slo & error budget lab behavior in production."
    },
    {
      "title": "Use burn rates",
      "body": "Principle 2: use this when reviewing slo & error budget lab behavior in production."
    },
    {
      "title": "Tie budget to decisions",
      "body": "Principle 3: use this when reviewing slo & error budget lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "slo-budget-001",
    title: "checkout availability SLO · case 001",
    scenario: "Investigate checkout availability SLO in a high-scale environment.",
    failure: "average hides bad tail; scenario 1 exposes the operational consequence.",
    subtitle: "Measure user outcomes — experiment 001",
    explanation: "Adjust the controls to see how average hides bad tail changes system quality, cost, and confidence.",
    lesson: "Measure user outcomes. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1476,
    sampleSize: 310,
    signal: 31
  },
  {
    id: "slo-budget-002",
    title: "inference latency SLO · case 002",
    scenario: "Investigate inference latency SLO in a small clean workload.",
    failure: "SLO lacks user journey; scenario 2 exposes the operational consequence.",
    subtitle: "Use burn rates — experiment 002",
    explanation: "Adjust the controls to see how SLO lacks user journey changes system quality, cost, and confidence.",
    lesson: "Use burn rates. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1483,
    sampleSize: 327,
    signal: 50
  },
  {
    id: "slo-budget-003",
    title: "data freshness SLO · case 003",
    scenario: "Investigate data freshness SLO in a large noisy workload.",
    failure: "budget policy is ignored; scenario 3 exposes the operational consequence.",
    subtitle: "Tie budget to decisions — experiment 003",
    explanation: "Adjust the controls to see how budget policy is ignored changes system quality, cost, and confidence.",
    lesson: "Tie budget to decisions. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1490,
    sampleSize: 344,
    signal: 69
  },
  {
    id: "slo-budget-004",
    title: "checkout availability SLO · case 004",
    scenario: "Investigate checkout availability SLO in a shifted production slice.",
    failure: "average hides bad tail; scenario 4 exposes the operational consequence.",
    subtitle: "Measure user outcomes — experiment 004",
    explanation: "Adjust the controls to see how average hides bad tail changes system quality, cost, and confidence.",
    lesson: "Measure user outcomes. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1497,
    sampleSize: 361,
    signal: 88
  },
  {
    id: "slo-budget-005",
    title: "inference latency SLO · case 005",
    scenario: "Investigate inference latency SLO in a rare failure regime.",
    failure: "SLO lacks user journey; scenario 5 exposes the operational consequence.",
    subtitle: "Use burn rates — experiment 005",
    explanation: "Adjust the controls to see how SLO lacks user journey changes system quality, cost, and confidence.",
    lesson: "Use burn rates. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1504,
    sampleSize: 378,
    signal: 6
  },
  {
    id: "slo-budget-006",
    title: "data freshness SLO · case 006",
    scenario: "Investigate data freshness SLO in a high-scale environment.",
    failure: "budget policy is ignored; scenario 6 exposes the operational consequence.",
    subtitle: "Tie budget to decisions — experiment 006",
    explanation: "Adjust the controls to see how budget policy is ignored changes system quality, cost, and confidence.",
    lesson: "Tie budget to decisions. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1511,
    sampleSize: 395,
    signal: 25
  },
  {
    id: "slo-budget-007",
    title: "checkout availability SLO · case 007",
    scenario: "Investigate checkout availability SLO in a small clean workload.",
    failure: "average hides bad tail; scenario 7 exposes the operational consequence.",
    subtitle: "Measure user outcomes — experiment 007",
    explanation: "Adjust the controls to see how average hides bad tail changes system quality, cost, and confidence.",
    lesson: "Measure user outcomes. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1518,
    sampleSize: 412,
    signal: 44
  },
  {
    id: "slo-budget-008",
    title: "inference latency SLO · case 008",
    scenario: "Investigate inference latency SLO in a large noisy workload.",
    failure: "SLO lacks user journey; scenario 8 exposes the operational consequence.",
    subtitle: "Use burn rates — experiment 008",
    explanation: "Adjust the controls to see how SLO lacks user journey changes system quality, cost, and confidence.",
    lesson: "Use burn rates. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1525,
    sampleSize: 429,
    signal: 63
  },
  {
    id: "slo-budget-009",
    title: "data freshness SLO · case 009",
    scenario: "Investigate data freshness SLO in a shifted production slice.",
    failure: "budget policy is ignored; scenario 9 exposes the operational consequence.",
    subtitle: "Tie budget to decisions — experiment 009",
    explanation: "Adjust the controls to see how budget policy is ignored changes system quality, cost, and confidence.",
    lesson: "Tie budget to decisions. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1532,
    sampleSize: 446,
    signal: 82
  },
  {
    id: "slo-budget-010",
    title: "checkout availability SLO · case 010",
    scenario: "Investigate checkout availability SLO in a rare failure regime.",
    failure: "average hides bad tail; scenario 10 exposes the operational consequence.",
    subtitle: "Measure user outcomes — experiment 010",
    explanation: "Adjust the controls to see how average hides bad tail changes system quality, cost, and confidence.",
    lesson: "Measure user outcomes. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1539,
    sampleSize: 463,
    signal: 0
  },
  {
    id: "slo-budget-011",
    title: "inference latency SLO · case 011",
    scenario: "Investigate inference latency SLO in a high-scale environment.",
    failure: "SLO lacks user journey; scenario 11 exposes the operational consequence.",
    subtitle: "Use burn rates — experiment 011",
    explanation: "Adjust the controls to see how SLO lacks user journey changes system quality, cost, and confidence.",
    lesson: "Use burn rates. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1546,
    sampleSize: 480,
    signal: 19
  },
  {
    id: "slo-budget-012",
    title: "data freshness SLO · case 012",
    scenario: "Investigate data freshness SLO in a small clean workload.",
    failure: "budget policy is ignored; scenario 12 exposes the operational consequence.",
    subtitle: "Tie budget to decisions — experiment 012",
    explanation: "Adjust the controls to see how budget policy is ignored changes system quality, cost, and confidence.",
    lesson: "Tie budget to decisions. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1553,
    sampleSize: 497,
    signal: 38
  }
];

export default function SloErrorBudgetLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

