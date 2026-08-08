import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Tool Schema Design Lab",
  "kicker": "Agent systems interactive lab",
  "description": "Design controlled agent execution with explicit state, tools, authority, budgets, and recovery behavior.",
  "mode": "neighbors",
  "variant": 4,
  "dark": true,
  "palette": {
    "primary": "hsl(98 88% 66%)",
    "secondary": "hsl(226 78% 62%)",
    "background": "hsl(98 24% 7%)",
    "panel": "hsl(98 22% 12%)",
    "ink": "hsl(98 35% 94%)",
    "muted": "hsl(98 16% 68%)",
    "line": "hsl(98 20% 25%)",
    "soft": "hsl(98 25% 18%)"
  },
  "controlTitle": "Tool Schema Design Lab controls",
  "controls": [
    {
      "label": "Schema depth",
      "min": 0,
      "max": 100,
      "default": 45,
      "unit": "%",
      "help": "Tune schema depth and observe system behavior."
    },
    {
      "label": "Enum strictness",
      "min": 0,
      "max": 100,
      "default": 67,
      "unit": "",
      "help": "Stress enum strictness across realistic operating ranges."
    },
    {
      "label": "Description detail",
      "min": 0,
      "max": 100,
      "default": 37,
      "unit": "",
      "help": "Use description detail to reveal boundary failures."
    }
  ],
  "visualTitle": "Tool Schema Design Lab live view",
  "metrics": [
    {
      "label": "Tool score",
      "detail": "primary behavior"
    },
    {
      "label": "Schema score",
      "detail": "robustness check"
    },
    {
      "label": "Design score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "call=validate(args,schema)",
  "costScale": 0.65,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Schemas are interfaces",
      "body": "Principle 1: use this when reviewing tool schema design lab behavior in production."
    },
    {
      "title": "Constrain consequential fields",
      "body": "Principle 2: use this when reviewing tool schema design lab behavior in production."
    },
    {
      "title": "Return actionable errors",
      "body": "Principle 3: use this when reviewing tool schema design lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "tool-schema-design-001",
    title: "calendar tool call · case 001",
    scenario: "Investigate calendar tool call in a high-scale environment.",
    failure: "ambiguous field yields wrong call; scenario 1 exposes the operational consequence.",
    subtitle: "Schemas are interfaces — experiment 001",
    explanation: "Adjust the controls to see how ambiguous field yields wrong call changes system quality, cost, and confidence.",
    lesson: "Schemas are interfaces. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1281,
    sampleSize: 295,
    signal: 16
  },
  {
    id: "tool-schema-design-002",
    title: "database query tool · case 002",
    scenario: "Investigate database query tool in a small clean workload.",
    failure: "optional field is actually required; scenario 2 exposes the operational consequence.",
    subtitle: "Constrain consequential fields — experiment 002",
    explanation: "Adjust the controls to see how optional field is actually required changes system quality, cost, and confidence.",
    lesson: "Constrain consequential fields. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1288,
    sampleSize: 312,
    signal: 35
  },
  {
    id: "tool-schema-design-003",
    title: "payment lookup action · case 003",
    scenario: "Investigate payment lookup action in a large noisy workload.",
    failure: "schema permits dangerous scope; scenario 3 exposes the operational consequence.",
    subtitle: "Return actionable errors — experiment 003",
    explanation: "Adjust the controls to see how schema permits dangerous scope changes system quality, cost, and confidence.",
    lesson: "Return actionable errors. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1295,
    sampleSize: 329,
    signal: 54
  },
  {
    id: "tool-schema-design-004",
    title: "calendar tool call · case 004",
    scenario: "Investigate calendar tool call in a shifted production slice.",
    failure: "ambiguous field yields wrong call; scenario 4 exposes the operational consequence.",
    subtitle: "Schemas are interfaces — experiment 004",
    explanation: "Adjust the controls to see how ambiguous field yields wrong call changes system quality, cost, and confidence.",
    lesson: "Schemas are interfaces. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1302,
    sampleSize: 346,
    signal: 73
  },
  {
    id: "tool-schema-design-005",
    title: "database query tool · case 005",
    scenario: "Investigate database query tool in a rare failure regime.",
    failure: "optional field is actually required; scenario 5 exposes the operational consequence.",
    subtitle: "Constrain consequential fields — experiment 005",
    explanation: "Adjust the controls to see how optional field is actually required changes system quality, cost, and confidence.",
    lesson: "Constrain consequential fields. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1309,
    sampleSize: 363,
    signal: 92
  },
  {
    id: "tool-schema-design-006",
    title: "payment lookup action · case 006",
    scenario: "Investigate payment lookup action in a high-scale environment.",
    failure: "schema permits dangerous scope; scenario 6 exposes the operational consequence.",
    subtitle: "Return actionable errors — experiment 006",
    explanation: "Adjust the controls to see how schema permits dangerous scope changes system quality, cost, and confidence.",
    lesson: "Return actionable errors. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1316,
    sampleSize: 380,
    signal: 10
  },
  {
    id: "tool-schema-design-007",
    title: "calendar tool call · case 007",
    scenario: "Investigate calendar tool call in a small clean workload.",
    failure: "ambiguous field yields wrong call; scenario 7 exposes the operational consequence.",
    subtitle: "Schemas are interfaces — experiment 007",
    explanation: "Adjust the controls to see how ambiguous field yields wrong call changes system quality, cost, and confidence.",
    lesson: "Schemas are interfaces. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1323,
    sampleSize: 397,
    signal: 29
  },
  {
    id: "tool-schema-design-008",
    title: "database query tool · case 008",
    scenario: "Investigate database query tool in a large noisy workload.",
    failure: "optional field is actually required; scenario 8 exposes the operational consequence.",
    subtitle: "Constrain consequential fields — experiment 008",
    explanation: "Adjust the controls to see how optional field is actually required changes system quality, cost, and confidence.",
    lesson: "Constrain consequential fields. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 1330,
    sampleSize: 414,
    signal: 48
  },
  {
    id: "tool-schema-design-009",
    title: "payment lookup action · case 009",
    scenario: "Investigate payment lookup action in a shifted production slice.",
    failure: "schema permits dangerous scope; scenario 9 exposes the operational consequence.",
    subtitle: "Return actionable errors — experiment 009",
    explanation: "Adjust the controls to see how schema permits dangerous scope changes system quality, cost, and confidence.",
    lesson: "Return actionable errors. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 1337,
    sampleSize: 431,
    signal: 67
  },
  {
    id: "tool-schema-design-010",
    title: "calendar tool call · case 010",
    scenario: "Investigate calendar tool call in a rare failure regime.",
    failure: "ambiguous field yields wrong call; scenario 10 exposes the operational consequence.",
    subtitle: "Schemas are interfaces — experiment 010",
    explanation: "Adjust the controls to see how ambiguous field yields wrong call changes system quality, cost, and confidence.",
    lesson: "Schemas are interfaces. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 1344,
    sampleSize: 448,
    signal: 86
  },
  {
    id: "tool-schema-design-011",
    title: "database query tool · case 011",
    scenario: "Investigate database query tool in a high-scale environment.",
    failure: "optional field is actually required; scenario 11 exposes the operational consequence.",
    subtitle: "Constrain consequential fields — experiment 011",
    explanation: "Adjust the controls to see how optional field is actually required changes system quality, cost, and confidence.",
    lesson: "Constrain consequential fields. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 1351,
    sampleSize: 465,
    signal: 4
  },
  {
    id: "tool-schema-design-012",
    title: "payment lookup action · case 012",
    scenario: "Investigate payment lookup action in a small clean workload.",
    failure: "schema permits dangerous scope; scenario 12 exposes the operational consequence.",
    subtitle: "Return actionable errors — experiment 012",
    explanation: "Adjust the controls to see how schema permits dangerous scope changes system quality, cost, and confidence.",
    lesson: "Return actionable errors. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 1358,
    sampleSize: 482,
    signal: 23
  }
];

export default function ToolSchemaDesignLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

