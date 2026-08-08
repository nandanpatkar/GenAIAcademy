import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Cache Architecture Lab",
  "kicker": "Production engineering interactive lab",
  "description": "Practice reliable delivery, observability, scaling, testing, security, and distributed-system operations.",
  "mode": "grid",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "hsl(146 88% 66%)",
    "secondary": "hsl(274 78% 62%)",
    "background": "hsl(146 24% 7%)",
    "panel": "hsl(146 22% 12%)",
    "ink": "hsl(146 35% 94%)",
    "muted": "hsl(146 16% 68%)",
    "line": "hsl(146 20% 25%)",
    "soft": "hsl(146 25% 18%)"
  },
  "controlTitle": "Cache Architecture Lab controls",
  "controls": [
    {
      "label": "TTL",
      "min": 0,
      "max": 100,
      "default": 43,
      "unit": "%",
      "help": "Tune ttl and observe system behavior."
    },
    {
      "label": "Capacity",
      "min": 0,
      "max": 100,
      "default": 58,
      "unit": "",
      "help": "Stress capacity across realistic operating ranges."
    },
    {
      "label": "Invalidation delay",
      "min": 0,
      "max": 100,
      "default": 27,
      "unit": "",
      "help": "Use invalidation delay to reveal boundary failures."
    }
  ],
  "visualTitle": "Cache Architecture Lab live view",
  "metrics": [
    {
      "label": "Cache score",
      "detail": "primary behavior"
    },
    {
      "label": "Architecture score",
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
  "formula": "hit_ratio=hits/(hits+misses)",
  "costScale": 0.95,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Cache correctness first",
      "body": "Principle 1: use this when reviewing cache architecture lab behavior in production."
    },
    {
      "title": "Design stampede control",
      "body": "Principle 2: use this when reviewing cache architecture lab behavior in production."
    },
    {
      "title": "Observe false freshness",
      "body": "Principle 3: use this when reviewing cache architecture lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "cache-architecture-001",
    title: "product catalog cache · case 001",
    scenario: "Investigate product catalog cache in a rare failure regime.",
    failure: "stale value violates correctness; scenario 1 exposes the operational consequence.",
    subtitle: "Cache correctness first — experiment 001",
    explanation: "Adjust the controls to see how stale value violates correctness changes system quality, cost, and confidence.",
    lesson: "Cache correctness first. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1593,
    sampleSize: 319,
    signal: 40
  },
  {
    id: "cache-architecture-002",
    title: "embedding result cache · case 002",
    scenario: "Investigate embedding result cache in a high-scale environment.",
    failure: "hot key overloads shard; scenario 2 exposes the operational consequence.",
    subtitle: "Design stampede control — experiment 002",
    explanation: "Adjust the controls to see how hot key overloads shard changes system quality, cost, and confidence.",
    lesson: "Design stampede control. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1600,
    sampleSize: 336,
    signal: 59
  },
  {
    id: "cache-architecture-003",
    title: "session lookup cache · case 003",
    scenario: "Investigate session lookup cache in a small clean workload.",
    failure: "cache stampede hits origin; scenario 3 exposes the operational consequence.",
    subtitle: "Observe false freshness — experiment 003",
    explanation: "Adjust the controls to see how cache stampede hits origin changes system quality, cost, and confidence.",
    lesson: "Observe false freshness. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1607,
    sampleSize: 353,
    signal: 78
  },
  {
    id: "cache-architecture-004",
    title: "product catalog cache · case 004",
    scenario: "Investigate product catalog cache in a large noisy workload.",
    failure: "stale value violates correctness; scenario 4 exposes the operational consequence.",
    subtitle: "Cache correctness first — experiment 004",
    explanation: "Adjust the controls to see how stale value violates correctness changes system quality, cost, and confidence.",
    lesson: "Cache correctness first. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1614,
    sampleSize: 370,
    signal: 97
  },
  {
    id: "cache-architecture-005",
    title: "embedding result cache · case 005",
    scenario: "Investigate embedding result cache in a shifted production slice.",
    failure: "hot key overloads shard; scenario 5 exposes the operational consequence.",
    subtitle: "Design stampede control — experiment 005",
    explanation: "Adjust the controls to see how hot key overloads shard changes system quality, cost, and confidence.",
    lesson: "Design stampede control. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1621,
    sampleSize: 387,
    signal: 15
  },
  {
    id: "cache-architecture-006",
    title: "session lookup cache · case 006",
    scenario: "Investigate session lookup cache in a rare failure regime.",
    failure: "cache stampede hits origin; scenario 6 exposes the operational consequence.",
    subtitle: "Observe false freshness — experiment 006",
    explanation: "Adjust the controls to see how cache stampede hits origin changes system quality, cost, and confidence.",
    lesson: "Observe false freshness. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1628,
    sampleSize: 404,
    signal: 34
  },
  {
    id: "cache-architecture-007",
    title: "product catalog cache · case 007",
    scenario: "Investigate product catalog cache in a high-scale environment.",
    failure: "stale value violates correctness; scenario 7 exposes the operational consequence.",
    subtitle: "Cache correctness first — experiment 007",
    explanation: "Adjust the controls to see how stale value violates correctness changes system quality, cost, and confidence.",
    lesson: "Cache correctness first. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1635,
    sampleSize: 421,
    signal: 53
  },
  {
    id: "cache-architecture-008",
    title: "embedding result cache · case 008",
    scenario: "Investigate embedding result cache in a small clean workload.",
    failure: "hot key overloads shard; scenario 8 exposes the operational consequence.",
    subtitle: "Design stampede control — experiment 008",
    explanation: "Adjust the controls to see how hot key overloads shard changes system quality, cost, and confidence.",
    lesson: "Design stampede control. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1642,
    sampleSize: 438,
    signal: 72
  },
  {
    id: "cache-architecture-009",
    title: "session lookup cache · case 009",
    scenario: "Investigate session lookup cache in a large noisy workload.",
    failure: "cache stampede hits origin; scenario 9 exposes the operational consequence.",
    subtitle: "Observe false freshness — experiment 009",
    explanation: "Adjust the controls to see how cache stampede hits origin changes system quality, cost, and confidence.",
    lesson: "Observe false freshness. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1649,
    sampleSize: 455,
    signal: 91
  },
  {
    id: "cache-architecture-010",
    title: "product catalog cache · case 010",
    scenario: "Investigate product catalog cache in a shifted production slice.",
    failure: "stale value violates correctness; scenario 10 exposes the operational consequence.",
    subtitle: "Cache correctness first — experiment 010",
    explanation: "Adjust the controls to see how stale value violates correctness changes system quality, cost, and confidence.",
    lesson: "Cache correctness first. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1656,
    sampleSize: 472,
    signal: 9
  },
  {
    id: "cache-architecture-011",
    title: "embedding result cache · case 011",
    scenario: "Investigate embedding result cache in a rare failure regime.",
    failure: "hot key overloads shard; scenario 11 exposes the operational consequence.",
    subtitle: "Design stampede control — experiment 011",
    explanation: "Adjust the controls to see how hot key overloads shard changes system quality, cost, and confidence.",
    lesson: "Design stampede control. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1663,
    sampleSize: 489,
    signal: 28
  },
  {
    id: "cache-architecture-012",
    title: "session lookup cache · case 012",
    scenario: "Investigate session lookup cache in a high-scale environment.",
    failure: "cache stampede hits origin; scenario 12 exposes the operational consequence.",
    subtitle: "Observe false freshness — experiment 012",
    explanation: "Adjust the controls to see how cache stampede hits origin changes system quality, cost, and confidence.",
    lesson: "Observe false freshness. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1670,
    sampleSize: 506,
    signal: 47
  }
];

export default function CacheArchitectureLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

