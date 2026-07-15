/**
 * api/exam-studyguide.js — Exam Bank study-guide TOC (Vercel serverless)
 *
 * GET /api/exam-studyguide?exam=<slug>
 */

import { getStudyGuideTOC } from "./_lib/examScraper.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const examSlug = req.query?.exam;
  if (!examSlug || typeof examSlug !== "string") {
    return res.status(400).json({ error: "Missing 'exam' parameter" });
  }

  try {
    const { data, source } = await getStudyGuideTOC(examSlug);
    return res.status(200).json({ toc: data, source });
  } catch (err) {
    console.error("Exam study guide TOC error:", err);
    return res.status(500).json({ error: "Could not retrieve the study guide for this exam.", details: err.message });
  }
}
