import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Adversarial Robustness Arena",
  "kicker": "Deep learning interactive lab",
  "description": "Inspect neural architectures, optimization at scale, compression, and robustness through live diagnostics.",
  "mode": "grid",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "hsl(191 88% 66%)",
    "secondary": "hsl(319 78% 62%)",
    "background": "hsl(191 24% 7%)",
    "panel": "hsl(191 22% 12%)",
    "ink": "hsl(191 35% 94%)",
    "muted": "hsl(191 16% 68%)",
    "line": "hsl(191 20% 25%)",
    "soft": "hsl(191 25% 18%)"
  },
  "controlTitle": "Adversarial Robustness Arena controls",
  "controls": [
    {
      "label": "Attack budget",
      "min": 0,
      "max": 100,
      "default": 50,
      "unit": "%",
      "help": "Tune attack budget and observe system behavior."
    },
    {
      "label": "Defense strength",
      "min": 0,
      "max": 100,
      "default": 57,
      "unit": "",
      "help": "Stress defense strength across realistic operating ranges."
    },
    {
      "label": "Input noise",
      "min": 0,
      "max": 100,
      "default": 33,
      "unit": "",
      "help": "Use input noise to reveal boundary failures."
    }
  ],
  "visualTitle": "Adversarial Robustness Arena live view",
  "metrics": [
    {
      "label": "Adversarial score",
      "detail": "primary behavior"
    },
    {
      "label": "Robustness score",
      "detail": "robustness check"
    },
    {
      "label": "Arena score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "x_adv=x+ε·sign(∇ₓL)",
  "costScale": 0.65,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "State the attacker model",
      "body": "Principle 1: use this when reviewing adversarial robustness arena behavior in production."
    },
    {
      "title": "Evaluate adaptive attacks",
      "body": "Principle 2: use this when reviewing adversarial robustness arena behavior in production."
    },
    {
      "title": "Robustness has trade-offs",
      "body": "Principle 3: use this when reviewing adversarial robustness arena behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "adversarial-robustness-001",
    title: "image classifier attack · case 001",
    scenario: "Investigate image classifier attack in a rare failure regime.",
    failure: "clean accuracy hides fragility; scenario 1 exposes the operational consequence.",
    subtitle: "State the attacker model — experiment 001",
    explanation: "Adjust the controls to see how clean accuracy hides fragility changes system quality, cost, and confidence.",
    lesson: "State the attacker model. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1008,
    sampleSize: 274,
    signal: 96
  },
  {
    id: "adversarial-robustness-002",
    title: "text embedding perturbation · case 002",
    scenario: "Investigate text embedding perturbation in a high-scale environment.",
    failure: "defense masks gradients; scenario 2 exposes the operational consequence.",
    subtitle: "Evaluate adaptive attacks — experiment 002",
    explanation: "Adjust the controls to see how defense masks gradients changes system quality, cost, and confidence.",
    lesson: "Evaluate adaptive attacks. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1015,
    sampleSize: 291,
    signal: 14
  },
  {
    id: "adversarial-robustness-003",
    title: "sensor spoofing test · case 003",
    scenario: "Investigate sensor spoofing test in a small clean workload.",
    failure: "threat model is unrealistic; scenario 3 exposes the operational consequence.",
    subtitle: "Robustness has trade-offs — experiment 003",
    explanation: "Adjust the controls to see how threat model is unrealistic changes system quality, cost, and confidence.",
    lesson: "Robustness has trade-offs. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1022,
    sampleSize: 308,
    signal: 33
  },
  {
    id: "adversarial-robustness-004",
    title: "image classifier attack · case 004",
    scenario: "Investigate image classifier attack in a large noisy workload.",
    failure: "clean accuracy hides fragility; scenario 4 exposes the operational consequence.",
    subtitle: "State the attacker model — experiment 004",
    explanation: "Adjust the controls to see how clean accuracy hides fragility changes system quality, cost, and confidence.",
    lesson: "State the attacker model. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1029,
    sampleSize: 325,
    signal: 52
  },
  {
    id: "adversarial-robustness-005",
    title: "text embedding perturbation · case 005",
    scenario: "Investigate text embedding perturbation in a shifted production slice.",
    failure: "defense masks gradients; scenario 5 exposes the operational consequence.",
    subtitle: "Evaluate adaptive attacks — experiment 005",
    explanation: "Adjust the controls to see how defense masks gradients changes system quality, cost, and confidence.",
    lesson: "Evaluate adaptive attacks. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1036,
    sampleSize: 342,
    signal: 71
  },
  {
    id: "adversarial-robustness-006",
    title: "sensor spoofing test · case 006",
    scenario: "Investigate sensor spoofing test in a rare failure regime.",
    failure: "threat model is unrealistic; scenario 6 exposes the operational consequence.",
    subtitle: "Robustness has trade-offs — experiment 006",
    explanation: "Adjust the controls to see how threat model is unrealistic changes system quality, cost, and confidence.",
    lesson: "Robustness has trade-offs. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1043,
    sampleSize: 359,
    signal: 90
  },
  {
    id: "adversarial-robustness-007",
    title: "image classifier attack · case 007",
    scenario: "Investigate image classifier attack in a high-scale environment.",
    failure: "clean accuracy hides fragility; scenario 7 exposes the operational consequence.",
    subtitle: "State the attacker model — experiment 007",
    explanation: "Adjust the controls to see how clean accuracy hides fragility changes system quality, cost, and confidence.",
    lesson: "State the attacker model. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1050,
    sampleSize: 376,
    signal: 8
  },
  {
    id: "adversarial-robustness-008",
    title: "text embedding perturbation · case 008",
    scenario: "Investigate text embedding perturbation in a small clean workload.",
    failure: "defense masks gradients; scenario 8 exposes the operational consequence.",
    subtitle: "Evaluate adaptive attacks — experiment 008",
    explanation: "Adjust the controls to see how defense masks gradients changes system quality, cost, and confidence.",
    lesson: "Evaluate adaptive attacks. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 4,
    seed: 1057,
    sampleSize: 393,
    signal: 27
  },
  {
    id: "adversarial-robustness-009",
    title: "sensor spoofing test · case 009",
    scenario: "Investigate sensor spoofing test in a large noisy workload.",
    failure: "threat model is unrealistic; scenario 9 exposes the operational consequence.",
    subtitle: "Robustness has trade-offs — experiment 009",
    explanation: "Adjust the controls to see how threat model is unrealistic changes system quality, cost, and confidence.",
    lesson: "Robustness has trade-offs. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 5,
    seed: 1064,
    sampleSize: 410,
    signal: 46
  },
  {
    id: "adversarial-robustness-010",
    title: "image classifier attack · case 010",
    scenario: "Investigate image classifier attack in a shifted production slice.",
    failure: "clean accuracy hides fragility; scenario 10 exposes the operational consequence.",
    subtitle: "State the attacker model — experiment 010",
    explanation: "Adjust the controls to see how clean accuracy hides fragility changes system quality, cost, and confidence.",
    lesson: "State the attacker model. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 1,
    seed: 1071,
    sampleSize: 427,
    signal: 65
  },
  {
    id: "adversarial-robustness-011",
    title: "text embedding perturbation · case 011",
    scenario: "Investigate text embedding perturbation in a rare failure regime.",
    failure: "defense masks gradients; scenario 11 exposes the operational consequence.",
    subtitle: "Evaluate adaptive attacks — experiment 011",
    explanation: "Adjust the controls to see how defense masks gradients changes system quality, cost, and confidence.",
    lesson: "Evaluate adaptive attacks. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 2,
    seed: 1078,
    sampleSize: 444,
    signal: 84
  },
  {
    id: "adversarial-robustness-012",
    title: "sensor spoofing test · case 012",
    scenario: "Investigate sensor spoofing test in a high-scale environment.",
    failure: "threat model is unrealistic; scenario 12 exposes the operational consequence.",
    subtitle: "Robustness has trade-offs — experiment 012",
    explanation: "Adjust the controls to see how threat model is unrealistic changes system quality, cost, and confidence.",
    lesson: "Robustness has trade-offs. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 3,
    seed: 1085,
    sampleSize: 461,
    signal: 2
  }
];

export default function AdversarialRobustnessLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

