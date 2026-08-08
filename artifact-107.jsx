import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Agent Sandbox & Authority Lab",
  "kicker": "Agent systems interactive lab",
  "description": "Design controlled agent execution with explicit state, tools, authority, budgets, and recovery behavior.",
  "mode": "neighbors",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "hsl(161 88% 66%)",
    "secondary": "hsl(289 78% 62%)",
    "background": "hsl(161 24% 7%)",
    "panel": "hsl(161 22% 12%)",
    "ink": "hsl(161 35% 94%)",
    "muted": "hsl(161 16% 68%)",
    "line": "hsl(161 20% 25%)",
    "soft": "hsl(161 25% 18%)"
  },
  "controlTitle": "Agent Sandbox & Authority Lab controls",
  "controls": [
    {
      "label": "Capability scope",
      "min": 0,
      "max": 100,
      "default": 41,
      "unit": "%",
      "help": "Tune capability scope and observe system behavior."
    },
    {
      "label": "Network isolation",
      "min": 0,
      "max": 100,
      "default": 65,
      "unit": "",
      "help": "Stress network isolation across realistic operating ranges."
    },
    {
      "label": "File boundary",
      "min": 0,
      "max": 100,
      "default": 29,
      "unit": "",
      "help": "Use file boundary to reveal boundary failures."
    }
  ],
  "visualTitle": "Agent Sandbox & Authority Lab live view",
  "metrics": [
    {
      "label": "Agent score",
      "detail": "primary behavior"
    },
    {
      "label": "Sandbox score",
      "detail": "robustness check"
    },
    {
      "label": "Authority score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "allowed=capability∩policy∩task_scope",
  "costScale": 0.8500000000000001,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Least authority by default",
      "body": "Principle 1: use this when reviewing agent sandbox & authority lab behavior in production."
    },
    {
      "title": "Separate data and instructions",
      "body": "Principle 2: use this when reviewing agent sandbox & authority lab behavior in production."
    },
    {
      "title": "Audit denied attempts",
      "body": "Principle 3: use this when reviewing agent sandbox & authority lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "agent-sandbox-001",
    title: "coding execution agent · case 001",
    scenario: "Investigate coding execution agent in a rare failure regime.",
    failure: "workspace scope is too broad; scenario 1 exposes the operational consequence.",
    subtitle: "Least authority by default — experiment 001",
    explanation: "Adjust the controls to see how workspace scope is too broad changes system quality, cost, and confidence.",
    lesson: "Least authority by default. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1398,
    sampleSize: 304,
    signal: 25
  },
  {
    id: "agent-sandbox-002",
    title: "web research agent · case 002",
    scenario: "Investigate web research agent in a high-scale environment.",
    failure: "network enables exfiltration; scenario 2 exposes the operational consequence.",
    subtitle: "Separate data and instructions — experiment 002",
    explanation: "Adjust the controls to see how network enables exfiltration changes system quality, cost, and confidence.",
    lesson: "Separate data and instructions. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1405,
    sampleSize: 321,
    signal: 44
  },
  {
    id: "agent-sandbox-003",
    title: "operations automation agent · case 003",
    scenario: "Investigate operations automation agent in a small clean workload.",
    failure: "tool output injects instructions; scenario 3 exposes the operational consequence.",
    subtitle: "Audit denied attempts — experiment 003",
    explanation: "Adjust the controls to see how tool output injects instructions changes system quality, cost, and confidence.",
    lesson: "Audit denied attempts. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1412,
    sampleSize: 338,
    signal: 63
  },
  {
    id: "agent-sandbox-004",
    title: "coding execution agent · case 004",
    scenario: "Investigate coding execution agent in a large noisy workload.",
    failure: "workspace scope is too broad; scenario 4 exposes the operational consequence.",
    subtitle: "Least authority by default — experiment 004",
    explanation: "Adjust the controls to see how workspace scope is too broad changes system quality, cost, and confidence.",
    lesson: "Least authority by default. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1419,
    sampleSize: 355,
    signal: 82
  },
  {
    id: "agent-sandbox-005",
    title: "web research agent · case 005",
    scenario: "Investigate web research agent in a shifted production slice.",
    failure: "network enables exfiltration; scenario 5 exposes the operational consequence.",
    subtitle: "Separate data and instructions — experiment 005",
    explanation: "Adjust the controls to see how network enables exfiltration changes system quality, cost, and confidence.",
    lesson: "Separate data and instructions. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1426,
    sampleSize: 372,
    signal: 0
  },
  {
    id: "agent-sandbox-006",
    title: "operations automation agent · case 006",
    scenario: "Investigate operations automation agent in a rare failure regime.",
    failure: "tool output injects instructions; scenario 6 exposes the operational consequence.",
    subtitle: "Audit denied attempts — experiment 006",
    explanation: "Adjust the controls to see how tool output injects instructions changes system quality, cost, and confidence.",
    lesson: "Audit denied attempts. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1433,
    sampleSize: 389,
    signal: 19
  },
  {
    id: "agent-sandbox-007",
    title: "coding execution agent · case 007",
    scenario: "Investigate coding execution agent in a high-scale environment.",
    failure: "workspace scope is too broad; scenario 7 exposes the operational consequence.",
    subtitle: "Least authority by default — experiment 007",
    explanation: "Adjust the controls to see how workspace scope is too broad changes system quality, cost, and confidence.",
    lesson: "Least authority by default. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1440,
    sampleSize: 406,
    signal: 38
  },
  {
    id: "agent-sandbox-008",
    title: "web research agent · case 008",
    scenario: "Investigate web research agent in a small clean workload.",
    failure: "network enables exfiltration; scenario 8 exposes the operational consequence.",
    subtitle: "Separate data and instructions — experiment 008",
    explanation: "Adjust the controls to see how network enables exfiltration changes system quality, cost, and confidence.",
    lesson: "Separate data and instructions. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1447,
    sampleSize: 423,
    signal: 57
  },
  {
    id: "agent-sandbox-009",
    title: "operations automation agent · case 009",
    scenario: "Investigate operations automation agent in a large noisy workload.",
    failure: "tool output injects instructions; scenario 9 exposes the operational consequence.",
    subtitle: "Audit denied attempts — experiment 009",
    explanation: "Adjust the controls to see how tool output injects instructions changes system quality, cost, and confidence.",
    lesson: "Audit denied attempts. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1454,
    sampleSize: 440,
    signal: 76
  },
  {
    id: "agent-sandbox-010",
    title: "coding execution agent · case 010",
    scenario: "Investigate coding execution agent in a shifted production slice.",
    failure: "workspace scope is too broad; scenario 10 exposes the operational consequence.",
    subtitle: "Least authority by default — experiment 010",
    explanation: "Adjust the controls to see how workspace scope is too broad changes system quality, cost, and confidence.",
    lesson: "Least authority by default. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1461,
    sampleSize: 457,
    signal: 95
  },
  {
    id: "agent-sandbox-011",
    title: "web research agent · case 011",
    scenario: "Investigate web research agent in a rare failure regime.",
    failure: "network enables exfiltration; scenario 11 exposes the operational consequence.",
    subtitle: "Separate data and instructions — experiment 011",
    explanation: "Adjust the controls to see how network enables exfiltration changes system quality, cost, and confidence.",
    lesson: "Separate data and instructions. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1468,
    sampleSize: 474,
    signal: 13
  },
  {
    id: "agent-sandbox-012",
    title: "operations automation agent · case 012",
    scenario: "Investigate operations automation agent in a high-scale environment.",
    failure: "tool output injects instructions; scenario 12 exposes the operational consequence.",
    subtitle: "Audit denied attempts — experiment 012",
    explanation: "Adjust the controls to see how tool output injects instructions changes system quality, cost, and confidence.",
    lesson: "Audit denied attempts. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1475,
    sampleSize: 491,
    signal: 32
  }
];

export default function AgentSandboxAuthorityLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

