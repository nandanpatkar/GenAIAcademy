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

// sanitize-html is imported lazily inside getStudyGuideArticleLive() rather
// than at module top-level. This file is shared by every api/exam-*.js
// function, so an eager top-level import here means any load/bundling
// issue with sanitize-html would crash Practice, Flashcards, and Videos
// too, not just the one endpoint that actually needs it.

const SUPABASE_URL = process.env.SUPABASE_URL || "https://twcsujjshudwgpihkwyz.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// A warm serverless instance can receive several requests at once (the Exam
// Bank probes availability while loading questions). @sparticuz/chromium
// extracts to a shared /tmp/chromium path. Keeping this promise at module
// scope prevents same-instance requests from trying to extract/launch that
// executable simultaneously.
let serverlessExecutablePathPromise;

function unescapeChunk(str) {
  return str
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .replace(/\\u0022/g, '"')
    .replace(/\\u0026/g, "&")
    .replace(/\\u0027/g, "'");
}

/**
 * The source is served behind Vercel's JavaScript security checkpoint. A
 * normal browser is allowed through, while a server-to-server fetch receives
 * a 429 challenge page. Render only that challenged public page in Chromium;
 * ordinary requests stay on the lightweight fetch path.
 */
async function fetchHtmlInBrowser(url) {
  const [{ default: puppeteer }, { default: chromium }] = await Promise.all([
    import("puppeteer-core"),
    import("@sparticuz/chromium"),
  ]);

  const isServerlessRuntime = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const headless = isServerlessRuntime ? "shell" : true;
  const executablePath = isServerlessRuntime
    ? await (serverlessExecutablePathPromise ||= chromium.executablePath())
    : process.env.CHROME_EXECUTABLE_PATH ||
      (process.platform === "darwin" ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" : null);

  if (!executablePath) {
    throw new Error("A local Chrome executable is required for challenged source pages. Set CHROME_EXECUTABLE_PATH.");
  }

  if (isServerlessRuntime) chromium.setGraphicsMode = false;
  const launchOptions = {
    args: await puppeteer.defaultArgs({
      ...(isServerlessRuntime ? { args: chromium.args } : {}),
      headless,
    }),
    executablePath,
    headless,
  };

  // Separate Vercel invocations can still share the same /tmp directory.
  // In that narrow window the executable exists but is open for extraction,
  // causing Linux to reject spawn with ETXTBSY. Waiting and retrying gives the
  // other invocation time to finish, while preserving genuine errors.
  let lastError;
  for (let attempt = 0; attempt < 4; attempt++) {
    let browser;
    try {
      browser = await puppeteer.launch(launchOptions);
      const page = await browser.newPage();
      // The source's Vercel Security Checkpoint first serves a small HTML
      // document, then completes its normal JavaScript navigation. Waiting
      // only for DOMContentLoaded captures that intermediate page in Lambda,
      // which has no question payload. Wait until the browser is idle and, if
      // necessary, until the actual embedded payload is present.
      await page.goto(url, { waitUntil: "networkidle2", timeout: 35_000 });
      await page.waitForFunction(
        () => document.documentElement.innerHTML.includes("initialQuestions") ||
          document.documentElement.innerHTML.includes('"question"'),
        { timeout: 12_000 }
      ).catch(() => {});

      const html = await page.content();
      if (!html.includes("initialQuestions") && !html.includes('"question"')) {
        throw new Error(`Browser did not reach the question payload (title: ${await page.title()}).`);
      }
      return html;
    } catch (error) {
      lastError = error;
      if (error?.code !== "ETXTBSY" || attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
    } finally {
      await browser?.close();
    }
  }

  throw lastError;
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (res.ok) return res.text();

  // `x-vercel-mitigated: challenge` is the source site's explicit signal
  // that its public page needs JavaScript rather than an API response.
  if (res.status === 429 && res.headers.get("x-vercel-mitigated") === "challenge") {
    return fetchHtmlInBrowser(url);
  }

  throw new Error(`Source site returned HTTP ${res.status}`);
}

function findMatchingArrayEnd(source, startPos) {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = startPos; i < source.length; i++) {
    const char = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
    } else if (char === "[") {
      depth++;
    } else if (char === "]" && --depth === 0) {
      return i;
    }
  }
  return -1;
}

/** Extract an array assigned to a named JSON property in the page payload. */
function extractNamedJsonArray(html, propertyName) {
  const property = new RegExp(`"${propertyName}"\\s*:\\s*\\[`, "g");
  const match = property.exec(html);
  if (!match) throw new Error(`Could not find the ${propertyName} array in the HTML source.`);

  const startPos = html.indexOf("[", match.index + match[0].length - 1);
  const endPos = findMatchingArrayEnd(html, startPos);
  if (endPos === -1) throw new Error("Could not find the matching closing bracket.");
  return html.slice(startPos, endPos + 1);
}

/** Locate a `[{...}, ...]` array embedded in a page's HTML, identified by a marker property name that appears inside its objects (e.g. "front" for flashcards). Returns the raw (unparsed) array substring. */
function extractJsonArray(html, marker, windowSize = 250) {
  const startPos = findArrayStart(html, marker, windowSize);
  if (startPos === -1) throw new Error(`Could not find the ${marker} JSON array in the HTML source.`);

  const endPos = findMatchingArrayEnd(html, startPos);
  if (endPos === -1) throw new Error("Could not find the matching closing bracket.");

  return html.slice(startPos, endPos + 1);
}

/**
 * Parse a raw array substring into JSON, trying progressively more
 * forgiving strategies rather than guessing up front whether it's escaped:
 *   1. Parse as-is (plain JSON, the common case)
 *   2. Unescape common HTML-embedded-JSON escape sequences, then parse
 *   3. Regex-recover individual `{...}` objects containing `marker`
 * This is intentionally tolerant since the exact embedding format can
 * vary by page/build without the underlying content being any different.
 */
function parseEmbeddedArray(rawArrayStr, marker) {
  try {
    return JSON.parse(rawArrayStr);
  } catch { /* try next strategy */ }

  try {
    return JSON.parse(unescapeChunk(rawArrayStr));
  } catch { /* try next strategy */ }

  const recovered = recoverObjectsByMarker(rawArrayStr, marker);
  if (recovered.length > 0) return recovered;

  throw new Error(`Found a "${marker}" array in the page but couldn't parse it as JSON.`);
}

/**
 * Find the start of a `[{...}]` array whose objects contain `marker`.
 * Two passes: first, the fast path assuming "id" is the first key (matches
 * the pattern server.py was built against); if that finds nothing, fall
 * back to a generic scan that doesn't assume any particular key order —
 * find the marker itself, then walk backward to the nearest `[{` that
 * opens its enclosing array.
 */
function findArrayStart(html, marker, windowSize) {
  const idFirstRe = /\[\s*\\?\{\s*\\?"id\\?":/g;
  let m;
  while ((m = idFirstRe.exec(html)) !== null) {
    if (html.slice(m.index, m.index + windowSize).includes(marker)) {
      return m.index;
    }
  }

  // Fallback: locate the marker property directly, then scan backward for
  // the nearest `[{` (allowing for `\"` escaped quotes) within a reasonable
  // distance, so we don't depend on key ordering at all.
  const markerRe = new RegExp(`\\\\?"${marker}\\\\?"\\s*:`, "g");
  let mm;
  while ((mm = markerRe.exec(html)) !== null) {
    const searchFrom = Math.max(0, mm.index - 4000);
    const window = html.slice(searchFrom, mm.index);
    const bracketRe = /\[\s*\\?\{/g;
    let lastMatch = null;
    let bm;
    while ((bm = bracketRe.exec(window)) !== null) lastMatch = bm;
    if (lastMatch) return searchFrom + lastMatch.index;
  }

  return -1;
}

/** Regex-based recovery when JSON.parse fails on a marker-delimited array — pulls out individual `{...}` objects that contain the marker key, mirroring the fallback already proven for questions. */
function recoverObjectsByMarker(rawArrayStr, marker) {
  const unescaped = unescapeChunk(rawArrayStr);
  const pattern = new RegExp(`\\{[^{}]*?"${marker}"\\s*:[^{}]*?\\}`, "gs");
  const matches = unescaped.match(pattern) || [];
  const parsed = [];
  for (const chunkStr of matches) {
    try {
      parsed.push(JSON.parse(chunkStr));
    } catch {
      // skip unparsable fragment
    }
  }
  return parsed;
}

/** Parse the current Next.js payload, while retaining the legacy page format. */
export function parseExamQuestionsHtml(html) {
  // OpenExamPrep moved from an Astro payload to a Next.js Flight payload.
  // The current page puts questions under `initialQuestions`, with every quote
  // escaped inside a script string. Normalize it before extracting the array.
  const payload = unescapeChunk(html);
  let rawArrayStr;
  try {
    rawArrayStr = extractNamedJsonArray(payload, "initialQuestions");
  } catch {
    // Keep supporting the source's older pages and any page that has not yet
    // migrated to the Next payload.
    rawArrayStr = extractJsonArray(payload, "question", 150);
  }
  return parseEmbeddedArray(rawArrayStr, "question");
}

/** Scrape live from open-exam-prep.com and parse the embedded questions array. */
export async function scrapeLive(examSlug) {
  const html = await fetchHtml(`https://open-exam-prep.com/practice/${examSlug}`);
  return parseExamQuestionsHtml(html);
}

/** Scrape live flashcards for an exam. */
export async function scrapeFlashcardsLive(examSlug) {
  const html = await fetchHtml(`https://open-exam-prep.com/flashcards/${examSlug}`);
  const rawArrayStr = extractJsonArray(html, "front");
  return parseEmbeddedArray(rawArrayStr, "front");
}

/** Scrape live video resources for an exam. */
export async function scrapeVideosLive(examSlug) {
  const html = await fetchHtml(`https://open-exam-prep.com/videos/exams/${examSlug}`);
  const rawArrayStr = extractJsonArray(html, "youtubeVideoId");
  return parseEmbeddedArray(rawArrayStr, "youtubeVideoId");
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

// Dangerous elements are removed along with their content entirely.
const STRIP_WITH_CONTENT = ["script", "style", "noscript", "iframe", "object", "embed", "link", "meta", "base", "form", "svg", "template"];
// Interactive form-control elements are unwrapped (tag removed, any text kept).
const STRIP_TAGS_ONLY = ["input", "button", "select", "textarea", "option"];

/**
 * Minimal, dependency-free HTML sanitizer for the scraped study-guide
 * article content. Deliberately not a full parser — a blocklist of the
 * concrete XSS vectors (script execution, event-handler attributes,
 * javascript:/vbscript: URIs, inline style, srcdoc) rather than an
 * allowlist-based rebuild, since the source is a specific, known,
 * scraping-permitted third-party site rather than arbitrary user input.
 * This avoids depending on a third-party sanitizer package after
 * sanitize-html caused platform-level 500s when it failed to load in
 * Vercel's serverless bundle.
 */
function sanitizeArticleHtml(html) {
  let out = html;

  // HTML comments can hide legacy/conditional script vectors.
  out = out.replace(/<!--[\s\S]*?-->/g, "");

  for (const tag of STRIP_WITH_CONTENT) {
    out = out.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"), "");
    out = out.replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi"), "");
  }

  for (const tag of STRIP_TAGS_ONLY) {
    out = out.replace(new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi"), "");
  }

  // Event handler attributes: onclick=, onerror=, onload=, etc.
  out = out.replace(/\son\w+\s*=\s*"(?:[^"\\]|\\.)*"/gi, "");
  out = out.replace(/\son\w+\s*=\s*'(?:[^'\\]|\\.)*'/gi, "");
  out = out.replace(/\son\w+\s*=\s*[^\s>]+/gi, "");

  // Inline style can carry CSS-based exfiltration/expression tricks.
  out = out.replace(/\sstyle\s*=\s*"(?:[^"\\]|\\.)*"/gi, "");
  out = out.replace(/\sstyle\s*=\s*'(?:[^'\\]|\\.)*'/gi, "");

  // Neutralize javascript:/vbscript: URIs in href/src/action.
  out = out.replace(/\s(href|src|action)\s*=\s*"\s*(?:javascript|vbscript):[^"]*"/gi, ' $1="#"');
  out = out.replace(/\s(href|src|action)\s*=\s*'\s*(?:javascript|vbscript):[^']*'/gi, " $1='#'");

  // srcdoc can inline an entire executable HTML document.
  out = out.replace(/\ssrcdoc\s*=\s*"(?:[^"\\]|\\.)*"/gi, "");
  out = out.replace(/\ssrcdoc\s*=\s*'(?:[^'\\]|\\.)*'/gi, "");

  // Force external links to open safely in a new tab.
  out = out.replace(/<a\b((?:(?!target=)[^>])*)>/gi, '<a$1 target="_blank" rel="noopener noreferrer">');

  return out.trim();
}

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

  return sanitizeArticleHtml(articleHtml);
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
