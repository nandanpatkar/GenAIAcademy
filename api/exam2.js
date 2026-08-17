/**
 * api/exam2.js — Exam Bank, Quiz 2.0 test build (Vercel serverless)
 *
 * GET /api/exam2?resource=<resource>&exam=<slug>&...
 *
 * A fork of api/exam.js that calls into api/_lib/examScraper2.js instead
 * of examScraper.js, so Quiz 2.0 (src/components/QuizApp2.jsx) can
 * exercise the new headless-browser bot-challenge fallback without any
 * risk to the shipped /api/exam endpoint or its Supabase cache. Same
 * resource params and response shapes as api/exam.js — see that file for
 * the full endpoint list this consolidates.
 */

import {
  getExamQuestions,
  getExamFlashcards,
  getResourceAvailability,
  getStudyGuideTOC,
  getStudyGuideArticle,
  getExamVideos,
} from "./_lib/examScraper2.js";

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

async function handleScrape(req, res, examSlug) {
  const examName = req.query?.name;
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

async function handleFlashcards(req, res, examSlug) {
  try {
    const { data, source } = await getExamFlashcards(examSlug);
    return res.status(200).json({ flashcards: data, source });
  } catch (err) {
    console.error("Exam flashcards error:", err);
    return res.status(500).json({ error: "Could not retrieve flashcards for this exam.", details: err.message });
  }
}

async function handleResources(req, res, examSlug) {
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

async function handleStudyguide(req, res, examSlug) {
  try {
    const { data, source } = await getStudyGuideTOC(examSlug);
    return res.status(200).json({ toc: data, source });
  } catch (err) {
    console.error("Exam study guide TOC error:", err);
    return res.status(500).json({ error: "Could not retrieve the study guide for this exam.", details: err.message });
  }
}

async function handleStudyguideContent(req, res, examSlug) {
  const topicPath = req.query?.path;
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

async function handleVideos(req, res, examSlug) {
  try {
    const { data, source } = await getExamVideos(examSlug);
    return res.status(200).json({ videos: data, source });
  } catch (err) {
    console.error("Exam videos error:", err);
    return res.status(500).json({ error: "Could not retrieve videos for this exam.", details: err.message });
  }
}

async function handleExport(req, res, examSlug) {
  const examName = req.query?.name;
  const format = req.query?.format === "csv" ? "csv" : "json";

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

const RESOURCE_HANDLERS = {
  scrape: handleScrape,
  flashcards: handleFlashcards,
  resources: handleResources,
  studyguide: handleStudyguide,
  "studyguide-content": handleStudyguideContent,
  videos: handleVideos,
  export: handleExport,
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const resource = req.query?.resource;
  const examSlug = req.query?.exam;

  const resourceHandler = RESOURCE_HANDLERS[resource];
  if (!resourceHandler) {
    return res.status(400).json({ error: "Missing or unknown 'resource' parameter" });
  }
  if (!examSlug || typeof examSlug !== "string") {
    return res.status(400).json({ error: "Missing 'exam' parameter" });
  }

  return resourceHandler(req, res, examSlug);
}
