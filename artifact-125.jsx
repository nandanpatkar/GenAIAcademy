import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Software Supply-Chain Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "neighbors",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "hsl(287 88% 66%)",
    "secondary": "hsl(55 78% 62%)",
    "background": "hsl(287 24% 7%)",
    "panel": "hsl(287 22% 12%)",
    "ink": "hsl(287 35% 94%)",
    "muted": "hsl(287 16% 68%)",
    "line": "hsl(287 20% 25%)",
    "soft": "hsl(287 25% 18%)"
  },
  "controlTitle": "Software Supply-Chain Lab controls",
  "controls": [
    {
      "label": "Dependency depth",
      "min": 0,
      "max": 100,
      "default": 46,
      "unit": "%",
      "help": "Tune dependency depth and observe system behavior."
    },
    {
      "label": "Signature coverage",
      "min": 0,
      "max": 100,
      "default": 61,
      "unit": "",
      "help": "Stress signature coverage across realistic operating ranges."
    },
    {
      "label": "Update lag",
      "min": 0,
      "max": 100,
      "default": 30,
      "unit": "",
      "help": "Use update lag to reveal boundary failures."
    }
  ],
  "visualTitle": "Software Supply-Chain Lab live view",
  "metrics": [
    {
      "label": "Software score",
      "detail": "primary behavior"
    },
    {
      "label": "Supply-Chain score",
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
  "formula": "trust=source∧build∧artifact∧provenance",
  "costScale": 1.25,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Pin and verify inputs",
      "body": "Principle 1: use this when reviewing software supply-chain lab behavior in production."
    },
    {
      "title": "Generate provenance",
      "body": "Principle 2: use this when reviewing software supply-chain lab behavior in production."
    },
    {
      "title": "Scan without exposing secrets",
      "body": "Principle 3: use this when reviewing software supply-chain lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "supply-chain-001",
    title: "container image release · case 001",
    scenario: "Investigate container image release in a large noisy workload.",
    failure: "transitive package is compromised; scenario 1 exposes the operational consequence.",
    subtitle: "Pin and verify inputs — experiment 001",
    explanation: "Adjust the controls to see how transitive package is compromised changes system quality, cost, and confidence.",
    lesson: "Pin and verify inputs. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1632,
    sampleSize: 322,
    signal: 43
  },
  {
    id: "supply-chain-002",
    title: "JavaScript dependency tree · case 002",
    scenario: "Investigate JavaScript dependency tree in a shifted production slice.",
    failure: "artifact lacks provenance; scenario 2 exposes the operational consequence.",
    subtitle: "Generate provenance — experiment 002",
    explanation: "Adjust the controls to see how artifact lacks provenance changes system quality, cost, and confidence.",
    lesson: "Generate provenance. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1639,
    sampleSize: 339,
    signal: 62
  },
  {
    id: "supply-chain-003",
    title: "ML model artifact pipeline · case 003",
    scenario: "Investigate ML model artifact pipeline in a rare failure regime.",
    failure: "secret enters build log; scenario 3 exposes the operational consequence.",
    subtitle: "Scan without exposing secrets — experiment 003",
    explanation: "Adjust the controls to see how secret enters build log changes system quality, cost, and confidence.",
    lesson: "Scan without exposing secrets. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1646,
    sampleSize: 356,
    signal: 81
  },
  {
    id: "supply-chain-004",
    title: "container image release · case 004",
    scenario: "Investigate container image release in a high-scale environment.",
    failure: "transitive package is compromised; scenario 4 exposes the operational consequence.",
    subtitle: "Pin and verify inputs — experiment 004",
    explanation: "Adjust the controls to see how transitive package is compromised changes system quality, cost, and confidence.",
    lesson: "Pin and verify inputs. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1653,
    sampleSize: 373,
    signal: 100
  },
  {
    id: "supply-chain-005",
    title: "JavaScript dependency tree · case 005",
    scenario: "Investigate JavaScript dependency tree in a small clean workload.",
    failure: "artifact lacks provenance; scenario 5 exposes the operational consequence.",
    subtitle: "Generate provenance — experiment 005",
    explanation: "Adjust the controls to see how artifact lacks provenance changes system quality, cost, and confidence.",
    lesson: "Generate provenance. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1660,
    sampleSize: 390,
    signal: 18
  },
  {
    id: "supply-chain-006",
    title: "ML model artifact pipeline · case 006",
    scenario: "Investigate ML model artifact pipeline in a large noisy workload.",
    failure: "secret enters build log; scenario 6 exposes the operational consequence.",
    subtitle: "Scan without exposing secrets — experiment 006",
    explanation: "Adjust the controls to see how secret enters build log changes system quality, cost, and confidence.",
    lesson: "Scan without exposing secrets. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1667,
    sampleSize: 407,
    signal: 37
  },
  {
    id: "supply-chain-007",
    title: "container image release · case 007",
    scenario: "Investigate container image release in a shifted production slice.",
    failure: "transitive package is compromised; scenario 7 exposes the operational consequence.",
    subtitle: "Pin and verify inputs — experiment 007",
    explanation: "Adjust the controls to see how transitive package is compromised changes system quality, cost, and confidence.",
    lesson: "Pin and verify inputs. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1674,
    sampleSize: 424,
    signal: 56
  },
  {
    id: "supply-chain-008",
    title: "JavaScript dependency tree · case 008",
    scenario: "Investigate JavaScript dependency tree in a rare failure regime.",
    failure: "artifact lacks provenance; scenario 8 exposes the operational consequence.",
    subtitle: "Generate provenance — experiment 008",
    explanation: "Adjust the controls to see how artifact lacks provenance changes system quality, cost, and confidence.",
    lesson: "Generate provenance. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 4,
    seed: 1681,
    sampleSize: 441,
    signal: 75
  },
  {
    id: "supply-chain-009",
    title: "ML model artifact pipeline · case 009",
    scenario: "Investigate ML model artifact pipeline in a high-scale environment.",
    failure: "secret enters build log; scenario 9 exposes the operational consequence.",
    subtitle: "Scan without exposing secrets — experiment 009",
    explanation: "Adjust the controls to see how secret enters build log changes system quality, cost, and confidence.",
    lesson: "Scan without exposing secrets. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 5,
    seed: 1688,
    sampleSize: 458,
    signal: 94
  },
  {
    id: "supply-chain-010",
    title: "container image release · case 010",
    scenario: "Investigate container image release in a small clean workload.",
    failure: "transitive package is compromised; scenario 10 exposes the operational consequence.",
    subtitle: "Pin and verify inputs — experiment 010",
    explanation: "Adjust the controls to see how transitive package is compromised changes system quality, cost, and confidence.",
    lesson: "Pin and verify inputs. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 1,
    seed: 1695,
    sampleSize: 475,
    signal: 12
  },
  {
    id: "supply-chain-011",
    title: "JavaScript dependency tree · case 011",
    scenario: "Investigate JavaScript dependency tree in a large noisy workload.",
    failure: "artifact lacks provenance; scenario 11 exposes the operational consequence.",
    subtitle: "Generate provenance — experiment 011",
    explanation: "Adjust the controls to see how artifact lacks provenance changes system quality, cost, and confidence.",
    lesson: "Generate provenance. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 2,
    seed: 1702,
    sampleSize: 492,
    signal: 31
  },
  {
    id: "supply-chain-012",
    title: "ML model artifact pipeline · case 012",
    scenario: "Investigate ML model artifact pipeline in a shifted production slice.",
    failure: "secret enters build log; scenario 12 exposes the operational consequence.",
    subtitle: "Scan without exposing secrets — experiment 012",
    explanation: "Adjust the controls to see how secret enters build log changes system quality, cost, and confidence.",
    lesson: "Scan without exposing secrets. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 3,
    seed: 1709,
    sampleSize: 509,
    signal: 50
  }
];

export default function SoftwareSupplyChainLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

