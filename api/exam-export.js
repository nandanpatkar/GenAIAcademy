/**
 * api/exam-export.js — Exam Bank export/download (Vercel serverless)
 *
 * GET /api/exam-export?exam=<slug>&format=json|csv&name=<display name>
 *
 * Ported from server.py's /api/export route. Uses the same cache-first
 * lookup as exam-scrape.js so exporting doesn't re-scrape unnecessarily.
 */

import { getExamQuestions } from "./_lib/examScraper.js";

function toCsv(questions) {
  const header = [
    "ID", "Question", "Option A", "Option B", "Option C", "Option D",
    "Correct Answer Index", "Correct Answer Text", "Explanation", "Category", "Difficulty",
  ];

  const escapeCell = (val) => {
    const s = String(val ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const rows = questions.map((q) => {
    const opts = q.options || [];
    const correctIdx = q.correctAnswer ?? 0;
    const correctTxt = opts[correctIdx] ?? "";
    return [
      q.id || "", q.question || "",
      opts[0] || "", opts[1] || "", opts[2] || "", opts[3] || "",
      correctIdx, correctTxt,
      q.explanation || "", q.category || "", q.difficulty || "",
    ].map(escapeCell).join(",");
  });

  return [header.join(","), ...rows].join("\n");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const examSlug = req.query?.exam;
  const examName = req.query?.name;
  const format = req.query?.format === "csv" ? "csv" : "json";

  if (!examSlug || typeof examSlug !== "string") {
    return res.status(400).json({ error: "Missing 'exam' parameter" });
  }

  try {
    const { questions } = await getExamQuestions(examSlug, examName);

    if (format === "csv") {
      const csv = toCsv(questions);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${examSlug}_questions.csv"`);
      return res.status(200).send(csv);
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${examSlug}_questions.json"`);
    return res.status(200).send(JSON.stringify(questions, null, 2));
  } catch (err) {
    console.error("Exam export error:", err);
    return res.status(500).json({ error: "Export failed", details: err.message });
  }
}
