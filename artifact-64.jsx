import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Probability Calibration Lab",
  "kicker": "Machine learning interactive lab",
  "description": "Experiment with model geometry, selection, validation, and explainability using production-minded cases.",
  "mode": "network",
  "variant": 0,
  "dark": false,
  "palette": {
    "primary": "hsl(300 72% 42%)",
    "secondary": "hsl(68 70% 42%)",
    "background": "hsl(300 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(300 30% 13%)",
    "muted": "hsl(300 14% 43%)",
    "line": "hsl(300 28% 86%)",
    "soft": "hsl(300 55% 92%)"
  },
  "controlTitle": "Probability Calibration Lab controls",
  "controls": [
    {
      "label": "Temperature",
      "min": 0,
      "max": 100,
      "default": 50,
      "unit": "%",
      "help": "Tune temperature and observe system behavior."
    },
    {
      "label": "Calibration bins",
      "min": 0,
      "max": 100,
      "default": 66,
      "unit": "",
      "help": "Stress calibration bins across realistic operating ranges."
    },
    {
      "label": "Decision threshold",
      "min": 0,
      "max": 100,
      "default": 37,
      "unit": "",
      "help": "Use decision threshold to reveal boundary failures."
    }
  ],
  "visualTitle": "Probability Calibration Lab live view",
  "metrics": [
    {
      "label": "Probability score",
      "detail": "primary behavior"
    },
    {
      "label": "Calibration score",
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
  "formula": "calibration(p)=P(Y=1|p)",
  "costScale": 0.75,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Rank and calibration differ",
      "body": "Principle 1: use this when reviewing probability calibration lab behavior in production."
    },
    {
      "title": "Calibrate on held-out data",
      "body": "Principle 2: use this when reviewing probability calibration lab behavior in production."
    },
    {
      "title": "Monitor calibration drift",
      "body": "Principle 3: use this when reviewing probability calibration lab behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "calibration-curve-001",
    title: "medical risk probabilities · case 001",
    scenario: "Investigate medical risk probabilities in a small clean workload.",
    failure: "confidence exceeds accuracy; scenario 1 exposes the operational consequence.",
    subtitle: "Rank and calibration differ — experiment 001",
    explanation: "Adjust the controls to see how confidence exceeds accuracy changes system quality, cost, and confidence.",
    lesson: "Rank and calibration differ. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 839,
    sampleSize: 261,
    signal: 83
  },
  {
    id: "calibration-curve-002",
    title: "churn propensity score · case 002",
    scenario: "Investigate churn propensity score in a large noisy workload.",
    failure: "small bins look noisy; scenario 2 exposes the operational consequence.",
    subtitle: "Calibrate on held-out data — experiment 002",
    explanation: "Adjust the controls to see how small bins look noisy changes system quality, cost, and confidence.",
    lesson: "Calibrate on held-out data. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 846,
    sampleSize: 278,
    signal: 1
  },
  {
    id: "calibration-curve-003",
    title: "fraud probability queue · case 003",
    scenario: "Investigate fraud probability queue in a shifted production slice.",
    failure: "recalibration breaks ranking; scenario 3 exposes the operational consequence.",
    subtitle: "Monitor calibration drift — experiment 003",
    explanation: "Adjust the controls to see how recalibration breaks ranking changes system quality, cost, and confidence.",
    lesson: "Monitor calibration drift. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 853,
    sampleSize: 295,
    signal: 20
  },
  {
    id: "calibration-curve-004",
    title: "medical risk probabilities · case 004",
    scenario: "Investigate medical risk probabilities in a rare failure regime.",
    failure: "confidence exceeds accuracy; scenario 4 exposes the operational consequence.",
    subtitle: "Rank and calibration differ — experiment 004",
    explanation: "Adjust the controls to see how confidence exceeds accuracy changes system quality, cost, and confidence.",
    lesson: "Rank and calibration differ. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 860,
    sampleSize: 312,
    signal: 39
  },
  {
    id: "calibration-curve-005",
    title: "churn propensity score · case 005",
    scenario: "Investigate churn propensity score in a high-scale environment.",
    failure: "small bins look noisy; scenario 5 exposes the operational consequence.",
    subtitle: "Calibrate on held-out data — experiment 005",
    explanation: "Adjust the controls to see how small bins look noisy changes system quality, cost, and confidence.",
    lesson: "Calibrate on held-out data. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 867,
    sampleSize: 329,
    signal: 58
  },
  {
    id: "calibration-curve-006",
    title: "fraud probability queue · case 006",
    scenario: "Investigate fraud probability queue in a small clean workload.",
    failure: "recalibration breaks ranking; scenario 6 exposes the operational consequence.",
    subtitle: "Monitor calibration drift — experiment 006",
    explanation: "Adjust the controls to see how recalibration breaks ranking changes system quality, cost, and confidence.",
    lesson: "Monitor calibration drift. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 874,
    sampleSize: 346,
    signal: 77
  },
  {
    id: "calibration-curve-007",
    title: "medical risk probabilities · case 007",
    scenario: "Investigate medical risk probabilities in a large noisy workload.",
    failure: "confidence exceeds accuracy; scenario 7 exposes the operational consequence.",
    subtitle: "Rank and calibration differ — experiment 007",
    explanation: "Adjust the controls to see how confidence exceeds accuracy changes system quality, cost, and confidence.",
    lesson: "Rank and calibration differ. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 881,
    sampleSize: 363,
    signal: 96
  },
  {
    id: "calibration-curve-008",
    title: "churn propensity score · case 008",
    scenario: "Investigate churn propensity score in a shifted production slice.",
    failure: "small bins look noisy; scenario 8 exposes the operational consequence.",
    subtitle: "Calibrate on held-out data — experiment 008",
    explanation: "Adjust the controls to see how small bins look noisy changes system quality, cost, and confidence.",
    lesson: "Calibrate on held-out data. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 888,
    sampleSize: 380,
    signal: 14
  },
  {
    id: "calibration-curve-009",
    title: "fraud probability queue · case 009",
    scenario: "Investigate fraud probability queue in a rare failure regime.",
    failure: "recalibration breaks ranking; scenario 9 exposes the operational consequence.",
    subtitle: "Monitor calibration drift — experiment 009",
    explanation: "Adjust the controls to see how recalibration breaks ranking changes system quality, cost, and confidence.",
    lesson: "Monitor calibration drift. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 895,
    sampleSize: 397,
    signal: 33
  },
  {
    id: "calibration-curve-010",
    title: "medical risk probabilities · case 010",
    scenario: "Investigate medical risk probabilities in a high-scale environment.",
    failure: "confidence exceeds accuracy; scenario 10 exposes the operational consequence.",
    subtitle: "Rank and calibration differ — experiment 010",
    explanation: "Adjust the controls to see how confidence exceeds accuracy changes system quality, cost, and confidence.",
    lesson: "Rank and calibration differ. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 902,
    sampleSize: 414,
    signal: 52
  },
  {
    id: "calibration-curve-011",
    title: "churn propensity score · case 011",
    scenario: "Investigate churn propensity score in a small clean workload.",
    failure: "small bins look noisy; scenario 11 exposes the operational consequence.",
    subtitle: "Calibrate on held-out data — experiment 011",
    explanation: "Adjust the controls to see how small bins look noisy changes system quality, cost, and confidence.",
    lesson: "Calibrate on held-out data. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 909,
    sampleSize: 431,
    signal: 71
  },
  {
    id: "calibration-curve-012",
    title: "fraud probability queue · case 012",
    scenario: "Investigate fraud probability queue in a large noisy workload.",
    failure: "recalibration breaks ranking; scenario 12 exposes the operational consequence.",
    subtitle: "Monitor calibration drift — experiment 012",
    explanation: "Adjust the controls to see how recalibration breaks ranking changes system quality, cost, and confidence.",
    lesson: "Monitor calibration drift. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 916,
    sampleSize: 448,
    signal: 90
  }
];

export default function ProbabilityCalibrationLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

