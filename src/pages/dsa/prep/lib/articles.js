// The article corpus under public/dsa/articles ships with a Markdown index
// (README.md). These helpers turn that index and each article's metadata
// header into something a reader UI can use. Pure — tested in isolation.

const clean = (value) => String(value || "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();

export const normalizeTitle = (value) => clean(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Topic buckets, matched in order against title + keywords. Language basics
// come first so "Arrays in Java" lands with Java rather than with arrays.
export const ARTICLE_TOPICS = [
  { id: "language", label: "Language basics", category: null, words: ["java", "c++", "loop", "conditional", "datatype", "abstraction", "encapsulation", "inheritance", "polymorphism", "oops", "container", "control flow", "collection", "operator", "function", "variable", "pointer basics"] },
  { id: "linked-list", label: "Linked lists", category: "Linked List", words: ["linked list", "linkedlist", "node", "random pointer"] },
  { id: "tree", label: "Trees & BST", category: "Tree", words: ["tree", "bst", "traversal", "ancestor", "leaf", "diameter", "root"] },
  { id: "heap", label: "Heaps", category: "Heap", words: ["heap", "priority queue", "kth largest", "kth smallest"] },
  { id: "stack", label: "Stacks & queues", category: "Stack", words: ["stack", "queue", "temperature", "asteroid", "browser history", "parenthes", "valid"] },
  { id: "hashing", label: "Hashing & tries", category: "HashMap", words: ["map", "hash", "trie", "frequency", "anagram", "camelcase"] },
  { id: "string", label: "Strings", category: "Strings", words: ["string", "palindrome", "lowercase", "uppercase", "character", "vowel", "word", "decode", "pattern"] },
  { id: "recursion", label: "Recursion & backtracking", category: "Recursion", words: ["recursion", "recursive", "backtrack", "subset", "permutation", "combination"] },
  { id: "math", label: "Maths & bits", category: "Bit Manipulation", words: ["math", "binary", "bitwise", "bit ", "number system", "prime", "gcd", "decimal"] },
  { id: "array", label: "Arrays", category: "Array", words: ["array", "subarray", "pivot", "rotate", "element", "duplicate", "sorted", "missing number", "matrix"] },
];

export function topicFor(title, keywords = []) {
  const haystack = ` ${[title, ...keywords].join(" ").toLowerCase()} `;
  return ARTICLE_TOPICS.find((topic) => topic.words.some((word) => haystack.includes(word))) || { id: "general", label: "General", category: null };
}

/** Parse README.md's `| # | **Title** | `tags` | [Markdown](file.md) | … |` rows. */
export function parseArticleIndex(markdown) {
  const rows = [];
  String(markdown || "").split("\n").forEach((line) => {
    if (!/^\|\s*\d+\s*\|/.test(line)) return;
    const cells = line.split("|").map((cell) => cell.trim());
    const title = clean(cells[2]);
    const keywords = [...String(cells[3] || "").matchAll(/`([^`]+)`/g)].map((match) => match[1].trim()).filter((word) => word && word.toLowerCase() !== "test");
    const file = String(cells[4] || "").match(/\(([^)]+\.md)\)/)?.[1];
    if (!title || !file) return;
    const topic = topicFor(title, keywords);
    rows.push({ file, title, keywords, topic: topic.id, topicLabel: topic.label });
  });
  return rows.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Split an article into its metadata header (Slug/Published/Keywords/Cover
 * Image blockquote + **Description:**) and the readable body. The corpus's
 * cover images point at CMS ids, not URLs, so they are dropped, and GitHub
 * `[!NOTE]` callouts become plain bold labels that react-markdown can render.
 */
export function parseArticle(markdown) {
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  let title = "";
  const meta = {};
  let description = "";
  const body = [];
  let inHeader = true;

  lines.forEach((line) => {
    if (inHeader) {
      if (!title && /^#\s+/.test(line)) { title = clean(line.replace(/^#\s+/, "")); return; }
      const metaMatch = line.match(/^>\s*\*\*([^:*]+):\*\*\s*(.*?)\s*$/);
      if (metaMatch) { meta[metaMatch[1].trim().toLowerCase()] = metaMatch[2].trim(); return; }
      const descMatch = line.match(/^\*\*Description:\*\*\s*(.*)$/);
      if (descMatch) { description = descMatch[1].trim(); return; }
      if (/^---\s*$/.test(line) || !line.trim()) return;
      inHeader = false;
    }
    body.push(line);
  });

  const text = body.join("\n")
    .replace(/^>\s*\[!(NOTE|TIP|INFO|WARNING|IMPORTANT|CAUTION)\]\s*$/gim, (_, kind) => `> **${kind[0]}${kind.slice(1).toLowerCase()}**`)
    .replace(/^>\s*\*\*INFO\*\*\s*$/gim, ">")
    // Callout examples put Input/Output on consecutive lines; keep them apart.
    .replace(/^(>[ \t]*\S.*?)[ \t]*$/gm, "$1  ")
    .trim();

  return {
    title,
    description,
    published: meta.published || "",
    keywords: meta.keywords ? meta.keywords.split(",").map((word) => word.trim()).filter(Boolean) : [],
    body: text,
    minutes: Math.max(1, Math.round(text.split(/\s+/).length / 200)),
  };
}

/** Only absolute http(s) images render — CMS ids and local paths are broken links. */
export const isRenderableImage = (src) => /^https?:\/\//i.test(String(src || ""));
