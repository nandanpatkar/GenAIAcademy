/**
 * api/_lib/examScraper.js
 *
 * Shared scraping + Supabase caching logic for the Exam Bank feature.
 * Ported from server.py's scrape_questions(), plus a Supabase cache layer
 * so we don't re-hit open-exam-prep.com on every request (see
 * cached_exam_questions table in supabase/migrations/20260715_exam_bank.sql).
 *
 * Requires (Vercel dashboard + .env.local for `vercel dev`):
 *   SUPABASE_URL                (or reuse the public anon URL)
 *   SUPABASE_SERVICE_ROLE_KEY   (server-side only — bypasses RLS for cache writes)
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://twcsujjshudwgpihkwyz.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function unescapeChunk(str) {
  return str
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .replace(/\\u0022/g, '"')
    .replace(/\\u0026/g, "&")
    .replace(/\\u0027/g, "'");
}

/** Scrape live from open-exam-prep.com and parse the embedded questions array. */
export async function scrapeLive(examSlug) {
  const url = `https://open-exam-prep.com/practice/${examSlug}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Source site returned HTTP ${res.status}`);
  const html = await res.text();

  // Locate the start of the questions array: [{"id": ... or [{\"id\":...
  const startRe = /\[\s*\\?\{\s*\\?"id\\?":/g;
  let startPos = -1;
  let m;
  while ((m = startRe.exec(html)) !== null) {
    if (html.slice(m.index, m.index + 150).includes("question")) {
      startPos = m.index;
      break;
    }
  }
  if (startPos === -1) throw new Error("Could not find the start of the questions array in the HTML source.");

  const chunk = html.slice(startPos);
  let bracketCount = 0;
  let endPos = -1;
  for (let i = 0; i < chunk.length; i++) {
    if (chunk[i] === "[") bracketCount++;
    else if (chunk[i] === "]") {
      bracketCount--;
      if (bracketCount === 0) {
        endPos = i;
        break;
      }
    }
  }
  if (endPos === -1) throw new Error("Could not find the end of the questions array.");

  const rawArrayStr = chunk.slice(0, endPos + 1);
  let cleaned = rawArrayStr;
  if (cleaned.startsWith('[{\\"') || cleaned.startsWith("[{\\u0022")) {
    cleaned = unescapeChunk(cleaned);
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    // Regex fallback for malformed JSON, mirroring server.py's approach
    const unescaped = unescapeChunk(rawArrayStr);
    const pattern = /\{\s*"id"\s*:\s*"[^"]+"\s*,\s*"question"\s*:\s*".+?"\s*,\s*"options"\s*:\s*\[.+?\]\s*,\s*"correctAnswer"\s*:\s*\d+?.+?\}/gs;
    const matches = unescaped.match(pattern) || [];
    const parsed = [];
    for (const chunkStr of matches) {
      try {
        parsed.push(JSON.parse(chunkStr));
      } catch {
        // skip unparsable fragment
      }
    }
    if (parsed.length === 0) throw new Error("Failed to extract questions via JSON parser or regex scanner.");
    return parsed;
  }
}

async function supabaseFetch(pathAndQuery, options = {}) {
  if (!SERVICE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY env var");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  return res;
}

export async function getCached(examSlug) {
  const res = await supabaseFetch(
    `cached_exam_questions?exam_slug=eq.${encodeURIComponent(examSlug)}&select=questions,scraped_at`
  );
  if (!res.ok) return null;
  const rows = await res.json().catch(() => []);
  return rows && rows[0] ? rows[0] : null;
}

export async function setCached(examSlug, examName, questions) {
  try {
    await supabaseFetch("cached_exam_questions", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify([
        {
          exam_slug: examSlug,
          exam_name: examName || examSlug,
          questions,
          scraped_at: new Date().toISOString(),
        },
      ]),
    });
  } catch (err) {
    // Cache write failures shouldn't break the response to the user
    console.error("Exam cache write failed:", err.message);
  }
}

/** Get questions for an exam: cache first, then live scrape + cache write. */
export async function getExamQuestions(examSlug, examName) {
  const cached = await getCached(examSlug).catch(() => null);
  if (cached && Array.isArray(cached.questions) && cached.questions.length > 0) {
    return { questions: cached.questions, source: "cache", scrapedAt: cached.scraped_at };
  }

  const questions = await scrapeLive(examSlug);
  await setCached(examSlug, examName, questions);
  return { questions, source: "live", scrapedAt: new Date().toISOString() };
}
