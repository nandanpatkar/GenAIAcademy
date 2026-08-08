import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Anomaly Detection Radar",
  "kicker": "Machine learning interactive lab",
  "description": "Experiment with model geometry, selection, validation, and explainability using production-minded cases.",
  "mode": "matrix",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "hsl(253 72% 42%)",
    "secondary": "hsl(21 70% 42%)",
    "background": "hsl(253 55% 97%)",
    "panel": "#ffffff",
    "ink": "hsl(253 30% 13%)",
    "muted": "hsl(253 14% 43%)",
    "line": "hsl(253 28% 86%)",
    "soft": "hsl(253 55% 92%)"
  },
  "controlTitle": "Anomaly Detection Radar controls",
  "controls": [
    {
      "label": "Contamination rate",
      "min": 0,
      "max": 100,
      "default": 49,
      "unit": "%",
      "help": "Tune contamination rate and observe system behavior."
    },
    {
      "label": "Neighborhood size",
      "min": 0,
      "max": 100,
      "default": 65,
      "unit": "",
      "help": "Stress neighborhood size across realistic operating ranges."
    },
    {
      "label": "Score threshold",
      "min": 0,
      "max": 100,
      "default": 36,
      "unit": "",
      "help": "Use score threshold to reveal boundary failures."
    }
  ],
  "visualTitle": "Anomaly Detection Radar live view",
  "metrics": [
    {
      "label": "Anomaly score",
      "detail": "primary behavior"
    },
    {
      "label": "Detection score",
      "detail": "robustness check"
    },
    {
      "label": "Radar score",
      "detail": "resource demand"
    },
    {
      "label": "Decision trust",
      "detail": "decision quality"
    }
  ],
  "formula": "score(x)=−path_length(x)",
  "costScale": 0.65,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Define abnormal operationally",
      "body": "Principle 1: use this when reviewing anomaly detection radar behavior in production."
    },
    {
      "title": "Threshold by response capacity",
      "body": "Principle 2: use this when reviewing anomaly detection radar behavior in production."
    },
    {
      "title": "Evaluate labeled slices",
      "body": "Principle 3: use this when reviewing anomaly detection radar behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "anomaly-detection-001",
    title: "network intrusion stream · case 001",
    scenario: "Investigate network intrusion stream in a high-scale environment.",
    failure: "rare normal points are flagged; scenario 1 exposes the operational consequence.",
    subtitle: "Define abnormal operationally — experiment 001",
    explanation: "Adjust the controls to see how rare normal points are flagged changes system quality, cost, and confidence.",
    lesson: "Define abnormal operationally. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 826,
    sampleSize: 260,
    signal: 82
  },
  {
    id: "anomaly-detection-002",
    title: "factory sensor anomalies · case 002",
    scenario: "Investigate factory sensor anomalies in a small clean workload.",
    failure: "contamination prior is wrong; scenario 2 exposes the operational consequence.",
    subtitle: "Threshold by response capacity — experiment 002",
    explanation: "Adjust the controls to see how contamination prior is wrong changes system quality, cost, and confidence.",
    lesson: "Threshold by response capacity. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 833,
    sampleSize: 277,
    signal: 0
  },
  {
    id: "anomaly-detection-003",
    title: "payment outlier queue · case 003",
    scenario: "Investigate payment outlier queue in a large noisy workload.",
    failure: "collective anomaly is missed; scenario 3 exposes the operational consequence.",
    subtitle: "Evaluate labeled slices — experiment 003",
    explanation: "Adjust the controls to see how collective anomaly is missed changes system quality, cost, and confidence.",
    lesson: "Evaluate labeled slices. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 840,
    sampleSize: 294,
    signal: 19
  },
  {
    id: "anomaly-detection-004",
    title: "network intrusion stream · case 004",
    scenario: "Investigate network intrusion stream in a shifted production slice.",
    failure: "rare normal points are flagged; scenario 4 exposes the operational consequence.",
    subtitle: "Define abnormal operationally — experiment 004",
    explanation: "Adjust the controls to see how rare normal points are flagged changes system quality, cost, and confidence.",
    lesson: "Define abnormal operationally. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 847,
    sampleSize: 311,
    signal: 38
  },
  {
    id: "anomaly-detection-005",
    title: "factory sensor anomalies · case 005",
    scenario: "Investigate factory sensor anomalies in a rare failure regime.",
    failure: "contamination prior is wrong; scenario 5 exposes the operational consequence.",
    subtitle: "Threshold by response capacity — experiment 005",
    explanation: "Adjust the controls to see how contamination prior is wrong changes system quality, cost, and confidence.",
    lesson: "Threshold by response capacity. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 854,
    sampleSize: 328,
    signal: 57
  },
  {
    id: "anomaly-detection-006",
    title: "payment outlier queue · case 006",
    scenario: "Investigate payment outlier queue in a high-scale environment.",
    failure: "collective anomaly is missed; scenario 6 exposes the operational consequence.",
    subtitle: "Evaluate labeled slices — experiment 006",
    explanation: "Adjust the controls to see how collective anomaly is missed changes system quality, cost, and confidence.",
    lesson: "Evaluate labeled slices. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 861,
    sampleSize: 345,
    signal: 76
  },
  {
    id: "anomaly-detection-007",
    title: "network intrusion stream · case 007",
    scenario: "Investigate network intrusion stream in a small clean workload.",
    failure: "rare normal points are flagged; scenario 7 exposes the operational consequence.",
    subtitle: "Define abnormal operationally — experiment 007",
    explanation: "Adjust the controls to see how rare normal points are flagged changes system quality, cost, and confidence.",
    lesson: "Define abnormal operationally. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 868,
    sampleSize: 362,
    signal: 95
  },
  {
    id: "anomaly-detection-008",
    title: "factory sensor anomalies · case 008",
    scenario: "Investigate factory sensor anomalies in a large noisy workload.",
    failure: "contamination prior is wrong; scenario 8 exposes the operational consequence.",
    subtitle: "Threshold by response capacity — experiment 008",
    explanation: "Adjust the controls to see how contamination prior is wrong changes system quality, cost, and confidence.",
    lesson: "Threshold by response capacity. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 4,
    seed: 875,
    sampleSize: 379,
    signal: 13
  },
  {
    id: "anomaly-detection-009",
    title: "payment outlier queue · case 009",
    scenario: "Investigate payment outlier queue in a shifted production slice.",
    failure: "collective anomaly is missed; scenario 9 exposes the operational consequence.",
    subtitle: "Evaluate labeled slices — experiment 009",
    explanation: "Adjust the controls to see how collective anomaly is missed changes system quality, cost, and confidence.",
    lesson: "Evaluate labeled slices. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 5,
    seed: 882,
    sampleSize: 396,
    signal: 32
  },
  {
    id: "anomaly-detection-010",
    title: "network intrusion stream · case 010",
    scenario: "Investigate network intrusion stream in a rare failure regime.",
    failure: "rare normal points are flagged; scenario 10 exposes the operational consequence.",
    subtitle: "Define abnormal operationally — experiment 010",
    explanation: "Adjust the controls to see how rare normal points are flagged changes system quality, cost, and confidence.",
    lesson: "Define abnormal operationally. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 1,
    seed: 889,
    sampleSize: 413,
    signal: 51
  },
  {
    id: "anomaly-detection-011",
    title: "factory sensor anomalies · case 011",
    scenario: "Investigate factory sensor anomalies in a high-scale environment.",
    failure: "contamination prior is wrong; scenario 11 exposes the operational consequence.",
    subtitle: "Threshold by response capacity — experiment 011",
    explanation: "Adjust the controls to see how contamination prior is wrong changes system quality, cost, and confidence.",
    lesson: "Threshold by response capacity. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 2,
    seed: 896,
    sampleSize: 430,
    signal: 70
  },
  {
    id: "anomaly-detection-012",
    title: "payment outlier queue · case 012",
    scenario: "Investigate payment outlier queue in a small clean workload.",
    failure: "collective anomaly is missed; scenario 12 exposes the operational consequence.",
    subtitle: "Evaluate labeled slices — experiment 012",
    explanation: "Adjust the controls to see how collective anomaly is missed changes system quality, cost, and confidence.",
    lesson: "Evaluate labeled slices. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 3,
    seed: 903,
    sampleSize: 447,
    signal: 89
  }
];

export default function AnomalyDetectionRadarLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

