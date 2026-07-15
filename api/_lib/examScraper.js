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

import sanitizeHtml from "sanitize-html";

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

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Source site returned HTTP ${res.status}`);
  return res.text();
}

/** Locate and parse a `[{"id":...}, ...]` JSON array embedded in a page's HTML. */
function extractJsonArray(html, marker, windowSize = 200) {
  const startRe = /\[\s*\\?\{\s*\\?"id\\?":/g;
  let startPos = -1;
  let m;
  while ((m = startRe.exec(html)) !== null) {
    if (html.slice(m.index, m.index + windowSize).includes(marker)) {
      startPos = m.index;
      break;
    }
  }
  if (startPos === -1) throw new Error(`Could not find the ${marker} JSON array in the HTML source.`);

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
  if (endPos === -1) throw new Error("Could not find the matching closing bracket.");

  const rawArrayStr = chunk.slice(0, endPos + 1);
  let cleaned = rawArrayStr;
  if (cleaned.startsWith('[{\\"') || cleaned.startsWith("[{\\u0022")) {
    cleaned = unescapeChunk(cleaned);
  }
  return { cleaned, rawArrayStr };
}

/** Scrape live from open-exam-prep.com and parse the embedded questions array. */
export async function scrapeLive(examSlug) {
  const html = await fetchHtml(`https://open-exam-prep.com/practice/${examSlug}`);
  const { cleaned, rawArrayStr } = extractJsonArray(html, "question", 150);

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

/** Scrape live flashcards for an exam. */
export async function scrapeFlashcardsLive(examSlug) {
  const html = await fetchHtml(`https://open-exam-prep.com/flashcards/${examSlug}`);
  const { cleaned } = extractJsonArray(html, "front");
  return JSON.parse(cleaned);
}

/** Scrape live video resources for an exam. */
export async function scrapeVideosLive(examSlug) {
  const html = await fetchHtml(`https://open-exam-prep.com/videos/exams/${examSlug}`);
  const { cleaned } = extractJsonArray(html, "youtubeVideoId");
  return JSON.parse(cleaned);
}

function titleCaseSlug(slug) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const STUDY_GUIDE_CATEGORY_TITLES = {
  introduction: "Introduction",
  "cloud-concepts": "Domain 1: Cloud Concepts",
  "security-and-compliance": "Domain 2: Security and Compliance",
  "cloud-technology-and-services": "Domain 3: Cloud Technology and Services",
  "billing-pricing-and-support": "Domain 4: Billing, Pricing, and Support",
  "services-deep-dive": "Services Deep Dive",
};

/** Scrape live study-guide table of contents for an exam. */
export async function getStudyGuideTOCLive(examSlug) {
  const html = await fetchHtml(`https://open-exam-prep.com/study-guides/${examSlug}`);
  const pattern = new RegExp(`href="(/study-guides/${escapeRegExp(examSlug)}/([^"]+))"[^>]*>(.*?)</a>`, "gs");

  const categories = {};
  const orderedCats = [];
  let m;
  while ((m = pattern.exec(html)) !== null) {
    const [, , subPath, label] = m;
    const cleanLabel = label.replace(/<[^>]+>/g, "").trim();
    const catKey = subPath.split("/")[0];

    if (!categories[catKey]) {
      categories[catKey] = {
        id: catKey,
        title: STUDY_GUIDE_CATEGORY_TITLES[catKey] || titleCaseSlug(catKey),
        topics: [],
      };
      orderedCats.push(catKey);
    }
    categories[catKey].topics.push({ path: subPath, name: cleanLabel });
  }

  return orderedCats.map((k) => categories[k]);
}

const ARTICLE_SANITIZE_OPTIONS = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "div", "span",
    "ul", "ol", "li", "strong", "b", "em", "i", "u", "a", "img",
    "table", "thead", "tbody", "tr", "td", "th", "code", "pre",
    "blockquote", "figure", "figcaption",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
  },
};

/** Scrape live study-guide article HTML for one topic, sanitized before returning. */
export async function getStudyGuideArticleLive(examSlug, topicPath) {
  const html = await fetchHtml(`https://open-exam-prep.com/study-guides/${examSlug}/${topicPath}`);

  const startPos = html.indexOf("<article");
  if (startPos === -1) throw new Error("No <article> tag found in HTML source.");
  const endPos = html.indexOf("</article>");
  if (endPos === -1) throw new Error("No closing </article> tag found.");

  let articleHtml = html.slice(startPos, endPos + "</article>".length);
  articleHtml = articleHtml.split('src="/').join('src="https://open-exam-prep.com/');
  articleHtml = articleHtml.split('href="/').join('href="https://open-exam-prep.com/');

  return sanitizeHtml(articleHtml, ARTICLE_SANITIZE_OPTIONS);
}

/**
 * Whether a resource "exists" for an exam is determined by actually trying
 * to scrape it and checking for non-empty content — not by HTTP status.
 * open-exam-prep.com renders a shell page (HTTP 200) for most exam-shaped
 * URLs regardless of whether that specific resource was authored for that
 * exam, so a HEAD/GET status check was giving false negatives (and
 * occasionally false positives), hiding tabs that actually had content.
 * This reuses getExamFlashcards/getExamVideos/getStudyGuideTOC directly,
 * which has the side benefit of pre-warming their cache — so opening a
 * tab right after the availability check is instant.
 */
async function hasNonEmpty(promise) {
  try {
    const { data } = await promise;
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
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

// ── Generic resource cache (flashcards, videos, study guide, availability) ──
// Backed by cached_exam_resources: (exam_slug, resource_type, resource_key) unique.
// resource_key is '' for singleton resources and the topic path for study-guide
// articles, which have one row per topic.

async function getCachedResource(examSlug, resourceType, resourceKey = "") {
  const res = await supabaseFetch(
    `cached_exam_resources?exam_slug=eq.${encodeURIComponent(examSlug)}` +
    `&resource_type=eq.${encodeURIComponent(resourceType)}` +
    `&resource_key=eq.${encodeURIComponent(resourceKey)}&select=data,updated_at`
  );
  if (!res.ok) return null;
  const rows = await res.json().catch(() => []);
  return rows && rows[0] ? rows[0] : null;
}

async function setCachedResource(examSlug, resourceType, resourceKey, data) {
  try {
    await supabaseFetch(`cached_exam_resources?on_conflict=exam_slug,resource_type,resource_key`, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify([
        {
          exam_slug: examSlug,
          resource_type: resourceType,
          resource_key: resourceKey,
          data,
          updated_at: new Date().toISOString(),
        },
      ]),
    });
  } catch (err) {
    console.error(`Exam resource cache write failed (${resourceType}):`, err.message);
  }
}

/** Cache-first fetch for any exam resource (flashcards, videos, study guide, availability). */
async function getCachedOrFetch(examSlug, resourceType, resourceKey, fetchFn) {
  const cached = await getCachedResource(examSlug, resourceType, resourceKey).catch(() => null);
  if (cached && cached.data !== undefined && cached.data !== null) {
    return { data: cached.data, source: "cache", updatedAt: cached.updated_at };
  }
  const fresh = await fetchFn();
  await setCachedResource(examSlug, resourceType, resourceKey, fresh);
  return { data: fresh, source: "live", updatedAt: new Date().toISOString() };
}

export function getExamFlashcards(examSlug) {
  return getCachedOrFetch(examSlug, "flashcards", "", () => scrapeFlashcardsLive(examSlug));
}

export function getExamVideos(examSlug) {
  return getCachedOrFetch(examSlug, "videos", "", () => scrapeVideosLive(examSlug));
}

export function getStudyGuideTOC(examSlug) {
  return getCachedOrFetch(examSlug, "studyguide_toc", "", () => getStudyGuideTOCLive(examSlug));
}

export function getStudyGuideArticle(examSlug, topicPath) {
  return getCachedOrFetch(examSlug, "studyguide_article", topicPath, () => getStudyGuideArticleLive(examSlug, topicPath));
}

/**
 * Availability is a thin derived view over the real cache-first fetches
 * above: if flashcards/videos/study-guide TOC actually resolve to
 * non-empty content, that resource is "available". This call itself
 * always re-derives from (and warms) the underlying resource caches
 * rather than trusting a separately-cached boolean, so a stale/incorrect
 * availability row can never keep hiding content that does exist.
 */
export async function getResourceAvailability(examSlug) {
  const [flashcards, studyguide, videos] = await Promise.all([
    hasNonEmpty(getExamFlashcards(examSlug)),
    hasNonEmpty(getStudyGuideTOC(examSlug)),
    hasNonEmpty(getExamVideos(examSlug)),
  ]);
  return { data: { practice: true, flashcards, studyguide, videos }, source: "live" };
}
