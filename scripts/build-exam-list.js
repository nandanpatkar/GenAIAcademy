#!/usr/bin/env node
/**
 * scripts/build-exam-list.js
 *
 * Parses filtered_exam_urls.csv (one open-exam-prep.com URL per row) into
 * public/data/exam-list.json — a static, lazy-fetched list the Exam Bank
 * tab reads at runtime (same pattern as interview-prep.json).
 *
 * Re-run this whenever filtered_exam_urls.csv changes:
 *   node scripts/build-exam-list.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_DIR = path.resolve(__dirname, "..");
const CSV_PATH = path.join(WORKSPACE_DIR, "filtered_exam_urls.csv");
const OUT_PATH = path.join(WORKSPACE_DIR, "public", "data", "exam-list.json");

const ACRONYMS = {
  aws: "AWS", gcp: "GCP", az: "AZ", dp: "DP", pl: "PL", sc: "SC",
  ms: "MS", mb: "MB", ai: "AI", ml: "ML", cwi: "CWI", ux: "UX", it: "IT",
};

function formatExamName(slug) {
  return slug
    .split("-")
    .map((w) => ACRONYMS[w.toLowerCase()] || w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function detectVendor(urlLower) {
  if (urlLower.includes("aws")) {
    const weldingTerms = ["welding", "welder", "cwi", "craw", "crwt", "radiographic-interpreter", "nde-coordination", "recert"];
    if (weldingTerms.some((t) => urlLower.includes(t))) return "AWS (American Welding Society)";
    return "AWS (Amazon Web Services)";
  }
  if (urlLower.includes("azure")) return "Azure";
  if (urlLower.includes("databricks")) return "Databricks";
  if (urlLower.includes("google") || urlLower.includes("gcp")) return "Google / GCP";
  return "Other";
}

function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`CSV not found at ${CSV_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const seen = new Set();
  const exams = [];

  for (const url of lines) {
    if (!url.includes("/practice/") || url.includes("/exams/")) continue;
    const slug = url.split("/").filter(Boolean).pop();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);

    const urlLower = url.toLowerCase();
    exams.push({
      slug,
      name: formatExamName(slug),
      vendor: detectVendor(urlLower),
    });
  }

  exams.sort((a, b) => (a.vendor + a.name).localeCompare(b.vendor + b.name));

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(exams, null, 2));
  console.log(`Wrote ${exams.length} exams to ${path.relative(WORKSPACE_DIR, OUT_PATH)}`);
}

main();

