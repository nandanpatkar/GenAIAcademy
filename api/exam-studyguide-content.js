/**
 * api/exam-studyguide-content.js — Exam Bank study-guide article (Vercel serverless)
 *
 * GET /api/exam-studyguide-content?exam=<slug>&path=<topic path>
 *
 * Returns sanitized article HTML (see ARTICLE_SANITIZE_OPTIONS in
 * _lib/examScraper.js) ready for dangerouslySetInnerHTML on the client.
 */

import { getStudyGuideArticle } from "./_lib/examScraper.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const examSlug = req.query?.exam;
  const topicPath = req.query?.path;

  if (!examSlug || typeof examSlug !== "string") {
    return res.status(400).json({ error: "Missing 'exam' parameter" });
  }
  if (!topicPath || typeof topicPath !== "string") {
    return res.status(400).json({ error: "Missing 'path' parameter" });
  }

  try {
    const { data, source } = await getStudyGuideArticle(examSlug, topicPath);
    return res.status(200).json({ html: data, source });
  } catch (err) {
    console.error("Exam study guide article error:", err);
    return res.status(500).json({ error: "Could not load this chapter.", details: err.message });
  }
}
