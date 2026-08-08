import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Clustering Workbench",
  "kicker": "Machine learning interactive lab",
  "description": "Experiment with model geometry, selection, validation, and explainability using production-minded cases.",
  "mode": "grid",
  "variant": 1,
  "dark": true,
  "palette": {
    "primary": "hsl(65 88% 66%)",
    "secondary": "hsl(193 78% 62%)",
    "background": "hsl(65 24% 7%)",
    "panel": "hsl(65 22% 12%)",
    "ink": "hsl(65 35% 94%)",
    "muted": "hsl(65 16% 68%)",
    "line": "hsl(65 20% 25%)",
    "soft": "hsl(65 25% 18%)"
  },
  "controlTitle": "Clustering Workbench controls",
  "controls": [
    {
      "label": "Cluster count",
      "min": 0,
      "max": 100,
      "default": 45,
      "unit": "%",
      "help": "Tune cluster count and observe system behavior."
    },
    {
      "label": "Density threshold",
      "min": 0,
      "max": 100,
      "default": 61,
      "unit": "",
      "help": "Stress density threshold across realistic operating ranges."
    },
    {
      "label": "Outlier tolerance",
      "min": 0,
      "max": 100,
      "default": 32,
      "unit": "",
      "help": "Use outlier tolerance to reveal boundary failures."
    }
  ],
  "visualTitle": "Clustering Workbench live view",
  "metrics": [
    {
      "label": "Clustering score",
      "detail": "primary behavior"
    },
    {
      "label": "Workbench score",
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
  "formula": "argmin Σ||xᵢ−μcᵢ||²",
  "costScale": 0.95,
  "success": "The current setup is inside the lab’s healthy operating zone.",
  "warning": "This setup exposes a meaningful failure mode; inspect the controls and scenario evidence.",
  "principles": [
    {
      "title": "Cluster assumptions differ",
      "body": "Principle 1: use this when reviewing clustering workbench behavior in production."
    },
    {
      "title": "Validate stability",
      "body": "Principle 2: use this when reviewing clustering workbench behavior in production."
    },
    {
      "title": "Profiles need domain meaning",
      "body": "Principle 3: use this when reviewing clustering workbench behavior in production."
    }
  ]
};

const CASES = [
  {
    id: "clustering-workbench-001",
    title: "customer segmentation map · case 001",
    scenario: "Investigate customer segmentation map in a small clean workload.",
    failure: "forced k invents structure; scenario 1 exposes the operational consequence.",
    subtitle: "Cluster assumptions differ — experiment 001",
    explanation: "Adjust the controls to see how forced k invents structure changes system quality, cost, and confidence.",
    lesson: "Cluster assumptions differ. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 774,
    sampleSize: 256,
    signal: 78
  },
  {
    id: "clustering-workbench-002",
    title: "document topic groups · case 002",
    scenario: "Investigate document topic groups in a large noisy workload.",
    failure: "density varies by region; scenario 2 exposes the operational consequence.",
    subtitle: "Validate stability — experiment 002",
    explanation: "Adjust the controls to see how density varies by region changes system quality, cost, and confidence.",
    lesson: "Validate stability. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 781,
    sampleSize: 273,
    signal: 97
  },
  {
    id: "clustering-workbench-003",
    title: "spatial hotspot discovery · case 003",
    scenario: "Investigate spatial hotspot discovery in a shifted production slice.",
    failure: "outliers drag centroids; scenario 3 exposes the operational consequence.",
    subtitle: "Profiles need domain meaning — experiment 003",
    explanation: "Adjust the controls to see how outliers drag centroids changes system quality, cost, and confidence.",
    lesson: "Profiles need domain meaning. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 788,
    sampleSize: 290,
    signal: 15
  },
  {
    id: "clustering-workbench-004",
    title: "customer segmentation map · case 004",
    scenario: "Investigate customer segmentation map in a rare failure regime.",
    failure: "forced k invents structure; scenario 4 exposes the operational consequence.",
    subtitle: "Cluster assumptions differ — experiment 004",
    explanation: "Adjust the controls to see how forced k invents structure changes system quality, cost, and confidence.",
    lesson: "Cluster assumptions differ. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 795,
    sampleSize: 307,
    signal: 34
  },
  {
    id: "clustering-workbench-005",
    title: "document topic groups · case 005",
    scenario: "Investigate document topic groups in a high-scale environment.",
    failure: "density varies by region; scenario 5 exposes the operational consequence.",
    subtitle: "Validate stability — experiment 005",
    explanation: "Adjust the controls to see how density varies by region changes system quality, cost, and confidence.",
    lesson: "Validate stability. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 802,
    sampleSize: 324,
    signal: 53
  },
  {
    id: "clustering-workbench-006",
    title: "spatial hotspot discovery · case 006",
    scenario: "Investigate spatial hotspot discovery in a small clean workload.",
    failure: "outliers drag centroids; scenario 6 exposes the operational consequence.",
    subtitle: "Profiles need domain meaning — experiment 006",
    explanation: "Adjust the controls to see how outliers drag centroids changes system quality, cost, and confidence.",
    lesson: "Profiles need domain meaning. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 809,
    sampleSize: 341,
    signal: 72
  },
  {
    id: "clustering-workbench-007",
    title: "customer segmentation map · case 007",
    scenario: "Investigate customer segmentation map in a large noisy workload.",
    failure: "forced k invents structure; scenario 7 exposes the operational consequence.",
    subtitle: "Cluster assumptions differ — experiment 007",
    explanation: "Adjust the controls to see how forced k invents structure changes system quality, cost, and confidence.",
    lesson: "Cluster assumptions differ. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 816,
    sampleSize: 358,
    signal: 91
  },
  {
    id: "clustering-workbench-008",
    title: "document topic groups · case 008",
    scenario: "Investigate document topic groups in a shifted production slice.",
    failure: "density varies by region; scenario 8 exposes the operational consequence.",
    subtitle: "Validate stability — experiment 008",
    explanation: "Adjust the controls to see how density varies by region changes system quality, cost, and confidence.",
    lesson: "Validate stability. Compare the baseline and document the trade-off before deployment.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 823,
    sampleSize: 375,
    signal: 9
  },
  {
    id: "clustering-workbench-009",
    title: "spatial hotspot discovery · case 009",
    scenario: "Investigate spatial hotspot discovery in a rare failure regime.",
    failure: "outliers drag centroids; scenario 9 exposes the operational consequence.",
    subtitle: "Profiles need domain meaning — experiment 009",
    explanation: "Adjust the controls to see how outliers drag centroids changes system quality, cost, and confidence.",
    lesson: "Profiles need domain meaning. Compare the baseline and document the trade-off before deployment.",
    regime: "rare failure regime",
    difficulty: 5,
    seed: 830,
    sampleSize: 392,
    signal: 28
  },
  {
    id: "clustering-workbench-010",
    title: "customer segmentation map · case 010",
    scenario: "Investigate customer segmentation map in a high-scale environment.",
    failure: "forced k invents structure; scenario 10 exposes the operational consequence.",
    subtitle: "Cluster assumptions differ — experiment 010",
    explanation: "Adjust the controls to see how forced k invents structure changes system quality, cost, and confidence.",
    lesson: "Cluster assumptions differ. Compare the baseline and document the trade-off before deployment.",
    regime: "high-scale environment",
    difficulty: 1,
    seed: 837,
    sampleSize: 409,
    signal: 47
  },
  {
    id: "clustering-workbench-011",
    title: "document topic groups · case 011",
    scenario: "Investigate document topic groups in a small clean workload.",
    failure: "density varies by region; scenario 11 exposes the operational consequence.",
    subtitle: "Validate stability — experiment 011",
    explanation: "Adjust the controls to see how density varies by region changes system quality, cost, and confidence.",
    lesson: "Validate stability. Compare the baseline and document the trade-off before deployment.",
    regime: "small clean workload",
    difficulty: 2,
    seed: 844,
    sampleSize: 426,
    signal: 66
  },
  {
    id: "clustering-workbench-012",
    title: "spatial hotspot discovery · case 012",
    scenario: "Investigate spatial hotspot discovery in a large noisy workload.",
    failure: "outliers drag centroids; scenario 12 exposes the operational consequence.",
    subtitle: "Profiles need domain meaning — experiment 012",
    explanation: "Adjust the controls to see how outliers drag centroids changes system quality, cost, and confidence.",
    lesson: "Profiles need domain meaning. Compare the baseline and document the trade-off before deployment.",
    regime: "large noisy workload",
    difficulty: 3,
    seed: 851,
    sampleSize: 443,
    signal: 85
  }
];

export default function ClusteringWorkbenchLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

