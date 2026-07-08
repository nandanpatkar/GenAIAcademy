// src/utils/tiptapToText.js
//
// Shared plain-text extraction + keyword utilities. Originally lived only
// inside KnowledgeGraph.jsx — factored out here so other features (e.g.
// Interview Prep's course-notes context) can reuse the same logic instead
// of duplicating it.

const STOPWORDS = new Set([
  "the","a","an","of","in","for","to","with","and","or","on","at","by",
  "from","into","using","via","how","what","when","why","this","that",
  "your","our","its","is","are","was","be","can","will","has","have",
  "more","over","data","learn","basic","advanced","intro","introduction",
  "write","python","solution","here","problem","given","return","find",
  "array","list","output","input","example","note","approach","code",
]);

// ── TipTap JSON → plain text ────────────────────────────────────────────────
export function tiptapToText(json) {
  if (!json) return "";
  if (typeof json === "string") return json;
  const walk = (node) => {
    if (!node) return "";
    if (node.type === "text") return node.text || "";
    if (node.content) return node.content.map(walk).join(" ");
    return "";
  };
  return walk(json);
}

// ── Keyword extractor ───────────────────────────────────────────────────────
export function extractKeywords(text) {
  if (!text) return new Set();
  return new Set(
    text.toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w))
  );
}

// ── Overlap score between two keyword sets ──────────────────────────────────
export function keywordOverlapScore(setA, setB) {
  if (!setA.size || !setB.size) return 0;
  let overlap = 0;
  for (const w of setA) if (setB.has(w)) overlap++;
  return overlap;
}
