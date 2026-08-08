import React from "react";
import ConceptSimulator from "./src/labs/ConceptSimulator.jsx";

const CONFIG = {
  "title": "Autoencoder Latent Space Lab",
  "kicker": "Deep learning interactive lab",
  "description": "Probe neural-network dynamics with interactive controls, live diagnostics, and production-focused debugging cases.",
  "mode": "neighbors",
  "variant": 5,
  "dark": false,
  "palette": {
    "primary": "#2563eb",
    "secondary": "#d946ef",
    "background": "#eff6ff",
    "panel": "#ffffff",
    "ink": "#14213b",
    "muted": "#697991",
    "line": "#d5e1f4",
    "soft": "#dbeafe"
  },
  "controlTitle": "Autoencoder Latent Space Lab controls",
  "controls": [
    {
      "label": "Latent width",
      "min": 0,
      "max": 100,
      "default": 42,
      "unit": "%",
      "help": "Tune latent width and observe how the experiment responds."
    },
    {
      "label": "Noise injection",
      "min": 0,
      "max": 100,
      "default": 64,
      "unit": "",
      "help": "Stress-test the model by changing noise injection."
    },
    {
      "label": "Reconstruction weight",
      "min": 0,
      "max": 100,
      "default": 28,
      "unit": "",
      "help": "Use reconstruction weight to expose boundary behavior."
    }
  ],
  "visualTitle": "Autoencoder Latent Space Lab live view",
  "metrics": [
    {
      "label": "Reconstruction",
      "detail": "primary behavior"
    },
    {
      "label": "Latent separation",
      "detail": "robustness check"
    },
    {
      "label": "Code size",
      "detail": "resource demand"
    },
    {
      "label": "Embedding trust",
      "detail": "decision quality"
    }
  ],
  "formula": "z=fθ(x), x̂=gφ(z)",
  "success": "The current configuration is within the lab’s healthy operating zone.",
  "warning": "The current configuration exposes a meaningful failure mode; inspect the controls.",
  "principles": [
    {
      "title": "Compression creates pressure",
      "body": "Principle 1: apply this idea when reviewing autoencoder latent space lab results."
    },
    {
      "title": "Latent geometry needs tests",
      "body": "Principle 2: apply this idea when reviewing autoencoder latent space lab results."
    },
    {
      "title": "Anomaly scores need calibration",
      "body": "Principle 3: apply this idea when reviewing autoencoder latent space lab results."
    }
  ]
};

const CASES = [
  {
    id: "autoencoder-latent-001",
    title: "handwritten digit compressor · case 001",
    scenario: "Investigate handwritten digit compressor under small clean sample.",
    failure: "wide code copies input; case 1 makes the trade-off visible.",
    subtitle: "Compression creates pressure — experiment 001",
    explanation: "Move the controls to see why wide code copies input and how the measured response changes.",
    lesson: "Compression creates pressure. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 18,
    sampleSize: 133,
    signal: 17
  },
  {
    id: "autoencoder-latent-002",
    title: "sensor anomaly detector · case 002",
    scenario: "Investigate sensor anomaly detector under large noisy sample.",
    failure: "narrow code loses structure; case 2 makes the trade-off visible.",
    subtitle: "Latent geometry needs tests — experiment 002",
    explanation: "Move the controls to see why narrow code loses structure and how the measured response changes.",
    lesson: "Latent geometry needs tests. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 25,
    sampleSize: 146,
    signal: 34
  },
  {
    id: "autoencoder-latent-003",
    title: "product image embedding · case 003",
    scenario: "Investigate product image embedding under shifted production slice.",
    failure: "reconstruction favors background; case 3 makes the trade-off visible.",
    subtitle: "Anomaly scores need calibration — experiment 003",
    explanation: "Move the controls to see why reconstruction favors background and how the measured response changes.",
    lesson: "Anomaly scores need calibration. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 32,
    sampleSize: 159,
    signal: 51
  },
  {
    id: "autoencoder-latent-004",
    title: "audio denoising model · case 004",
    scenario: "Investigate audio denoising model under rare-event regime.",
    failure: "wide code copies input; case 4 makes the trade-off visible.",
    subtitle: "Compression creates pressure — experiment 004",
    explanation: "Move the controls to see why wide code copies input and how the measured response changes.",
    lesson: "Compression creates pressure. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 39,
    sampleSize: 172,
    signal: 68
  },
  {
    id: "autoencoder-latent-005",
    title: "handwritten digit compressor · case 005",
    scenario: "Investigate handwritten digit compressor under high-dimensional setting.",
    failure: "narrow code loses structure; case 5 makes the trade-off visible.",
    subtitle: "Latent geometry needs tests — experiment 005",
    explanation: "Move the controls to see why narrow code loses structure and how the measured response changes.",
    lesson: "Latent geometry needs tests. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 46,
    sampleSize: 185,
    signal: 85
  },
  {
    id: "autoencoder-latent-006",
    title: "sensor anomaly detector · case 006",
    scenario: "Investigate sensor anomaly detector under small clean sample.",
    failure: "reconstruction favors background; case 6 makes the trade-off visible.",
    subtitle: "Anomaly scores need calibration — experiment 006",
    explanation: "Move the controls to see why reconstruction favors background and how the measured response changes.",
    lesson: "Anomaly scores need calibration. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 53,
    sampleSize: 198,
    signal: 1
  },
  {
    id: "autoencoder-latent-007",
    title: "product image embedding · case 007",
    scenario: "Investigate product image embedding under large noisy sample.",
    failure: "wide code copies input; case 7 makes the trade-off visible.",
    subtitle: "Compression creates pressure — experiment 007",
    explanation: "Move the controls to see why wide code copies input and how the measured response changes.",
    lesson: "Compression creates pressure. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 60,
    sampleSize: 211,
    signal: 18
  },
  {
    id: "autoencoder-latent-008",
    title: "audio denoising model · case 008",
    scenario: "Investigate audio denoising model under shifted production slice.",
    failure: "narrow code loses structure; case 8 makes the trade-off visible.",
    subtitle: "Latent geometry needs tests — experiment 008",
    explanation: "Move the controls to see why narrow code loses structure and how the measured response changes.",
    lesson: "Latent geometry needs tests. Compare the baseline before accepting the apparent improvement.",
    regime: "shifted production slice",
    difficulty: 4,
    seed: 67,
    sampleSize: 224,
    signal: 35
  },
  {
    id: "autoencoder-latent-009",
    title: "handwritten digit compressor · case 009",
    scenario: "Investigate handwritten digit compressor under rare-event regime.",
    failure: "reconstruction favors background; case 9 makes the trade-off visible.",
    subtitle: "Anomaly scores need calibration — experiment 009",
    explanation: "Move the controls to see why reconstruction favors background and how the measured response changes.",
    lesson: "Anomaly scores need calibration. Compare the baseline before accepting the apparent improvement.",
    regime: "rare-event regime",
    difficulty: 5,
    seed: 74,
    sampleSize: 237,
    signal: 52
  },
  {
    id: "autoencoder-latent-010",
    title: "sensor anomaly detector · case 010",
    scenario: "Investigate sensor anomaly detector under high-dimensional setting.",
    failure: "wide code copies input; case 10 makes the trade-off visible.",
    subtitle: "Compression creates pressure — experiment 010",
    explanation: "Move the controls to see why wide code copies input and how the measured response changes.",
    lesson: "Compression creates pressure. Compare the baseline before accepting the apparent improvement.",
    regime: "high-dimensional setting",
    difficulty: 1,
    seed: 81,
    sampleSize: 250,
    signal: 69
  },
  {
    id: "autoencoder-latent-011",
    title: "product image embedding · case 011",
    scenario: "Investigate product image embedding under small clean sample.",
    failure: "narrow code loses structure; case 11 makes the trade-off visible.",
    subtitle: "Latent geometry needs tests — experiment 011",
    explanation: "Move the controls to see why narrow code loses structure and how the measured response changes.",
    lesson: "Latent geometry needs tests. Compare the baseline before accepting the apparent improvement.",
    regime: "small clean sample",
    difficulty: 2,
    seed: 88,
    sampleSize: 263,
    signal: 86
  },
  {
    id: "autoencoder-latent-012",
    title: "audio denoising model · case 012",
    scenario: "Investigate audio denoising model under large noisy sample.",
    failure: "reconstruction favors background; case 12 makes the trade-off visible.",
    subtitle: "Anomaly scores need calibration — experiment 012",
    explanation: "Move the controls to see why reconstruction favors background and how the measured response changes.",
    lesson: "Anomaly scores need calibration. Compare the baseline before accepting the apparent improvement.",
    regime: "large noisy sample",
    difficulty: 3,
    seed: 95,
    sampleSize: 276,
    signal: 2
  }
];

export default function AutoencoderLatentLab() {
  return <ConceptSimulator config={CONFIG} cases={CASES} />;
}

