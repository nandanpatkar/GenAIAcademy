import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Network Pruning Lab",
  "kicker": "Deep learning interactive lab",
  "description": "Inspect neural architectures, optimization at scale, compression, and robustness through live diagnostics.",
  "mode": "distribution",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "hsl(97 72% 42%)",
    "secondary": "hsl(225 70% 42%)",
    "background": "hsl(97 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(97 30% 13%)",
    "muted": "hsl(97 14% 43%)",
    "line": "hsl(97 28% 86%)",
    "soft": "hsl(97 55% 92%)"
  },
  "controlTitle": "Network Pruning Lab controls",
  "controls": [
    {
      "label": "Sparsity target",
      "min": 0,
      "max": 100,
      "default": 48,
      "unit": "%",
      "help": "Tune sparsity target and observe system behavior."
    },
    {
      "label": "Prune schedule",
      "min": 0,
      "max": 100,
      "default": 66,
      "unit": "",
      "help": "Stress prune schedule across realistic operating ranges."
    },
    {
      "label": "Recovery epochs",
      "min": 0,
      "max": 100,
      "default": 31,
      "unit": "",
      "help": "Use recovery epochs to reveal boundary failures."
    }
  ],
  "visualTitle": "Network Pruning Lab live view",
  "metrics": [
    {
      "label": "Network score",
      "detail": "primary behavior"
    },
    {
      "label": "Pruning score",
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
  "formula": "w′=w·1(|w|>τ)",
  "costScale": 1.15,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Sparsity needs hardware support",
      "body": "Principle 1: use this when reviewing network pruning lab behavior in production."
    },
    {
      "title": "Prune and recover",
      "body": "Principle 2: use this when reviewing network pruning lab behavior in production."
    },
    {
      "title": "Compare structured options",
      "body": "Principle 3: use this when reviewing network pruning lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "network-pruning-001",
    title: "overparameterized MLP · case 001",
    scenario: "Investigate overparameterized MLP in a large noisy workload.",
    failure: "one-shot pruning shocks model; scenario 1 exposes the operational consequence.",
    subtitle: "Sparsity needs hardware support — experiment 001",
    explanation: "Adjust the controls to see how one-shot pruning shocks model changes system quality, cost, and confidence.",
    lesson: "Sparsity needs hardware support. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 982,
    sampleSize: 272,
    signal: 94
  },
  {
    id: "network-pruning-002",
    title: "vision backbone compression · case 002",
    scenario: "Investigate vision backbone compression in a shifted production slice.",
    failure: "unstructured sparsity stays slow; scenario 2 exposes the operational consequence.",
    subtitle: "Prune and recover — experiment 002",
    explanation: "Adjust the controls to see how unstructured sparsity stays slow changes system quality, cost, and confidence.",
    lesson: "Prune and recover. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 989,
    sampleSize: 289,
    signal: 12
  },
  {
    id: "network-pruning-003",
    title: "transformer head pruning · case 003",
    scenario: "Investigate transformer head pruning in a rare failure regime.",
    failure: "important small weights vanish; scenario 3 exposes the operational consequence.",
    subtitle: "Compare structured options — experiment 003",
    explanation: "Adjust the controls to see how important small weights vanish changes system quality, cost, and confidence.",
    lesson: "Compare structured options. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 996,
    sampleSize: 306,
    signal: 31
  },
  {
    id: "network-pruning-004",
    title: "overparameterized MLP · case 004",
    scenario: "Investigate overparameterized MLP in a high-scale environment.",
    failure: "one-shot pruning shocks model; scenario 4 exposes the operational consequence.",
    subtitle: "Sparsity needs hardware support — experiment 004",
    explanation: "Adjust the controls to see how one-shot pruning shocks model changes system quality, cost, and confidence.",
    lesson: "Sparsity needs hardware support. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1003,
    sampleSize: 323,
    signal: 50
  },
  {
    id: "network-pruning-005",
    title: "vision backbone compression · case 005",
    scenario: "Investigate vision backbone compression in a small clean workload.",
    failure: "unstructured sparsity stays slow; scenario 5 exposes the operational consequence.",
    subtitle: "Prune and recover — experiment 005",
    explanation: "Adjust the controls to see how unstructured sparsity stays slow changes system quality, cost, and confidence.",
    lesson: "Prune and recover. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1010,
    sampleSize: 340,
    signal: 69
  },
  {
    id: "network-pruning-006",
    title: "transformer head pruning · case 006",
    scenario: "Investigate transformer head pruning in a large noisy workload.",
    failure: "important small weights vanish; scenario 6 exposes the operational consequence.",
    subtitle: "Compare structured options — experiment 006",
    explanation: "Adjust the controls to see how important small weights vanish changes system quality, cost, and confidence.",
    lesson: "Compare structured options. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1017,
    sampleSize: 357,
    signal: 88
  },
  {
    id: "network-pruning-007",
    title: "overparameterized MLP · case 007",
    scenario: "Investigate overparameterized MLP in a shifted production slice.",
    failure: "one-shot pruning shocks model; scenario 7 exposes the operational consequence.",
    subtitle: "Sparsity needs hardware support — experiment 007",
    explanation: "Adjust the controls to see how one-shot pruning shocks model changes system quality, cost, and confidence.",
    lesson: "Sparsity needs hardware support. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1024,
    sampleSize: 374,
    signal: 6
  },
  {
    id: "network-pruning-008",
    title: "vision backbone compression · case 008",
    scenario: "Investigate vision backbone compression in a rare failure regime.",
    failure: "unstructured sparsity stays slow; scenario 8 exposes the operational consequence.",
    subtitle: "Prune and recover — experiment 008",
    explanation: "Adjust the controls to see how unstructured sparsity stays slow changes system quality, cost, and confidence.",
    lesson: "Prune and recover. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1031,
    sampleSize: 391,
    signal: 25
  },
  {
    id: "network-pruning-009",
    title: "transformer head pruning · case 009",
    scenario: "Investigate transformer head pruning in a high-scale environment.",
    failure: "important small weights vanish; scenario 9 exposes the operational consequence.",
    subtitle: "Compare structured options — experiment 009",
    explanation: "Adjust the controls to see how important small weights vanish changes system quality, cost, and confidence.",
    lesson: "Compare structured options. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1038,
    sampleSize: 408,
    signal: 44
  },
  {
    id: "network-pruning-010",
    title: "overparameterized MLP · case 010",
    scenario: "Investigate overparameterized MLP in a small clean workload.",
    failure: "one-shot pruning shocks model; scenario 10 exposes the operational consequence.",
    subtitle: "Sparsity needs hardware support — experiment 010",
    explanation: "Adjust the controls to see how one-shot pruning shocks model changes system quality, cost, and confidence.",
    lesson: "Sparsity needs hardware support. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1045,
    sampleSize: 425,
    signal: 63
  },
  {
    id: "network-pruning-011",
    title: "vision backbone compression · case 011",
    scenario: "Investigate vision backbone compression in a large noisy workload.",
    failure: "unstructured sparsity stays slow; scenario 11 exposes the operational consequence.",
    subtitle: "Prune and recover — experiment 011",
    explanation: "Adjust the controls to see how unstructured sparsity stays slow changes system quality, cost, and confidence.",
    lesson: "Prune and recover. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1052,
    sampleSize: 442,
    signal: 82
  },
  {
    id: "network-pruning-012",
    title: "transformer head pruning · case 012",
    scenario: "Investigate transformer head pruning in a shifted production slice.",
    failure: "important small weights vanish; scenario 12 exposes the operational consequence.",
    subtitle: "Compare structured options — experiment 012",
    explanation: "Adjust the controls to see how important small weights vanish changes system quality, cost, and confidence.",
    lesson: "Compare structured options. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1059,
    sampleSize: 459,
    signal: 0
  }
];

export default function NetworkPruningLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

