/**
 * api/exam-resources.js — Exam Bank resource availability (Vercel serverless)
 *
 * GET /api/exam-resources?exam=<slug>
 *
 * Checks (cache-first) whether flashcards, a study guide, and videos exist
 * for an exam, so the Exam Hub only shows tabs that have content. Ported
 * from server.py's get_resource_availability()/check_url_exists().
 */

import { getResourceAvailability } from "./_lib/examScraper.js";

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
    const { data } = await getResourceAvailability(examSlug);
    return res.status(200).json(data);
  } catch (err) {
    console.error("Exam resource availability error:", err);
    // Fail open on practice only, so a broken availability check never
    // hides the core feature.
    return res.status(200).json({ practice: true, flashcards: false, studyguide: false, videos: false });
  }
}
