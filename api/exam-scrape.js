/**
 * api/exam-scrape.js — Exam Bank question fetch (Vercel serverless)
 *
 * GET /api/exam-scrape?exam=<slug>&name=<display name>
 *
 * Returns cached questions from Supabase when available, otherwise scrapes
 * open-exam-prep.com live and writes the result to the cache. Ported from
 * server.py's /api/scrape route.
 */

import { getExamQuestions } from "./_lib/examScraper.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const examSlug = req.query?.exam;
  const examName = req.query?.name;

  if (!examSlug || typeof examSlug !== "string") {
    return res.status(400).json({ error: "Missing 'exam' parameter" });
  }

  try {
    const { questions, source, scrapedAt } = await getExamQuestions(examSlug, examName);
    return res.status(200).json({ questions, source, scrapedAt });
  } catch (err) {
    console.error("Exam scrape error:", err);
    return res.status(500).json({
      error: "Could not retrieve or parse questions for this exam.",
      details: err.message,
    });
  }
}
