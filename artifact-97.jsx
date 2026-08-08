import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Retrieval Access-Control Lab",
  "kicker": "RAG systems interactive lab",
  "description": "Tune retrieval stages, evidence quality, freshness, permissions, and end-to-end answer reliability.",
  "mode": "tree",
  "variant": 3,
  "dark": false,
  "palette": {
    "primary": "hsl(51 72% 42%)",
    "secondary": "hsl(179 70% 42%)",
    "background": "hsl(51 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(51 30% 13%)",
    "muted": "hsl(51 14% 43%)",
    "line": "hsl(51 28% 86%)",
    "soft": "hsl(51 55% 92%)"
  },
  "controlTitle": "Retrieval Access-Control Lab controls",
  "controls": [
    {
      "label": "ACL strictness",
      "min": 0,
      "max": 100,
      "default": 44,
      "unit": "%",
      "help": "Tune acl strictness and observe system behavior."
    },
    {
      "label": "Identity freshness",
      "min": 0,
      "max": 100,
      "default": 66,
      "unit": "",
      "help": "Stress identity freshness across realistic operating ranges."
    },
    {
      "label": "Filter depth",
      "min": 0,
      "max": 100,
      "default": 36,
      "unit": "",
      "help": "Use filter depth to reveal boundary failures."
    }
  ],
  "visualTitle": "Retrieval Access-Control Lab live view",
  "metrics": [
    {
      "label": "Retrieval score",
      "detail": "primary behavior"
    },
    {
      "label": "Access-Control score",
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
  "formula": "visible(d,u)=ACL(d)∩claims(u)",
  "costScale": 1.25,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Filter before exposure",
      "body": "Principle 1: use this when reviewing retrieval access-control lab behavior in production."
    },
    {
      "title": "Propagate identity end to end",
      "body": "Principle 2: use this when reviewing retrieval access-control lab behavior in production."
    },
    {
      "title": "Test negative permissions",
      "body": "Principle 3: use this when reviewing retrieval access-control lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "retrieval-acl-001",
    title: "multi-tenant document search · case 001",
    scenario: "Investigate multi-tenant document search in a rare failure regime.",
    failure: "embedding search crosses tenant; scenario 1 exposes the operational consequence.",
    subtitle: "Filter before exposure — experiment 001",
    explanation: "Adjust the controls to see how embedding search crosses tenant changes system quality, cost, and confidence.",
    lesson: "Filter before exposure. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1268,
    sampleSize: 294,
    signal: 15
  },
  {
    id: "retrieval-acl-002",
    title: "role-based policy assistant · case 002",
    scenario: "Investigate role-based policy assistant in a high-scale environment.",
    failure: "revoked role remains cached; scenario 2 exposes the operational consequence.",
    subtitle: "Propagate identity end to end — experiment 002",
    explanation: "Adjust the controls to see how revoked role remains cached changes system quality, cost, and confidence.",
    lesson: "Propagate identity end to end. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1275,
    sampleSize: 311,
    signal: 34
  },
  {
    id: "retrieval-acl-003",
    title: "project knowledge portal · case 003",
    scenario: "Investigate project knowledge portal in a small clean workload.",
    failure: "citation leaks restricted title; scenario 3 exposes the operational consequence.",
    subtitle: "Test negative permissions — experiment 003",
    explanation: "Adjust the controls to see how citation leaks restricted title changes system quality, cost, and confidence.",
    lesson: "Test negative permissions. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1282,
    sampleSize: 328,
    signal: 53
  },
  {
    id: "retrieval-acl-004",
    title: "multi-tenant document search · case 004",
    scenario: "Investigate multi-tenant document search in a large noisy workload.",
    failure: "embedding search crosses tenant; scenario 4 exposes the operational consequence.",
    subtitle: "Filter before exposure — experiment 004",
    explanation: "Adjust the controls to see how embedding search crosses tenant changes system quality, cost, and confidence.",
    lesson: "Filter before exposure. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1289,
    sampleSize: 345,
    signal: 72
  },
  {
    id: "retrieval-acl-005",
    title: "role-based policy assistant · case 005",
    scenario: "Investigate role-based policy assistant in a shifted production slice.",
    failure: "revoked role remains cached; scenario 5 exposes the operational consequence.",
    subtitle: "Propagate identity end to end — experiment 005",
    explanation: "Adjust the controls to see how revoked role remains cached changes system quality, cost, and confidence.",
    lesson: "Propagate identity end to end. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1296,
    sampleSize: 362,
    signal: 91
  },
  {
    id: "retrieval-acl-006",
    title: "project knowledge portal · case 006",
    scenario: "Investigate project knowledge portal in a rare failure regime.",
    failure: "citation leaks restricted title; scenario 6 exposes the operational consequence.",
    subtitle: "Test negative permissions — experiment 006",
    explanation: "Adjust the controls to see how citation leaks restricted title changes system quality, cost, and confidence.",
    lesson: "Test negative permissions. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1303,
    sampleSize: 379,
    signal: 9
  },
  {
    id: "retrieval-acl-007",
    title: "multi-tenant document search · case 007",
    scenario: "Investigate multi-tenant document search in a high-scale environment.",
    failure: "embedding search crosses tenant; scenario 7 exposes the operational consequence.",
    subtitle: "Filter before exposure — experiment 007",
    explanation: "Adjust the controls to see how embedding search crosses tenant changes system quality, cost, and confidence.",
    lesson: "Filter before exposure. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1310,
    sampleSize: 396,
    signal: 28
  },
  {
    id: "retrieval-acl-008",
    title: "role-based policy assistant · case 008",
    scenario: "Investigate role-based policy assistant in a small clean workload.",
    failure: "revoked role remains cached; scenario 8 exposes the operational consequence.",
    subtitle: "Propagate identity end to end — experiment 008",
    explanation: "Adjust the controls to see how revoked role remains cached changes system quality, cost, and confidence.",
    lesson: "Propagate identity end to end. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1317,
    sampleSize: 413,
    signal: 47
  },
  {
    id: "retrieval-acl-009",
    title: "project knowledge portal · case 009",
    scenario: "Investigate project knowledge portal in a large noisy workload.",
    failure: "citation leaks restricted title; scenario 9 exposes the operational consequence.",
    subtitle: "Test negative permissions — experiment 009",
    explanation: "Adjust the controls to see how citation leaks restricted title changes system quality, cost, and confidence.",
    lesson: "Test negative permissions. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1324,
    sampleSize: 430,
    signal: 66
  },
  {
    id: "retrieval-acl-010",
    title: "multi-tenant document search · case 010",
    scenario: "Investigate multi-tenant document search in a shifted production slice.",
    failure: "embedding search crosses tenant; scenario 10 exposes the operational consequence.",
    subtitle: "Filter before exposure — experiment 010",
    explanation: "Adjust the controls to see how embedding search crosses tenant changes system quality, cost, and confidence.",
    lesson: "Filter before exposure. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1331,
    sampleSize: 447,
    signal: 85
  },
  {
    id: "retrieval-acl-011",
    title: "role-based policy assistant · case 011",
    scenario: "Investigate role-based policy assistant in a rare failure regime.",
    failure: "revoked role remains cached; scenario 11 exposes the operational consequence.",
    subtitle: "Propagate identity end to end — experiment 011",
    explanation: "Adjust the controls to see how revoked role remains cached changes system quality, cost, and confidence.",
    lesson: "Propagate identity end to end. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1338,
    sampleSize: 464,
    signal: 3
  },
  {
    id: "retrieval-acl-012",
    title: "project knowledge portal · case 012",
    scenario: "Investigate project knowledge portal in a high-scale environment.",
    failure: "citation leaks restricted title; scenario 12 exposes the operational consequence.",
    subtitle: "Test negative permissions — experiment 012",
    explanation: "Adjust the controls to see how citation leaks restricted title changes system quality, cost, and confidence.",
    lesson: "Test negative permissions. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1345,
    sampleSize: 481,
    signal: 22
  }
];

export default function RetrievalAccessControlLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

