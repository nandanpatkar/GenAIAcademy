import { contentImage } from "./contentImages";

// Problem-statement renderer, ported from the AlgoWars bundle. Raw statements arrive as
// Codeforces-style text with LaTeX fragments (\leq, \cdot, 10^4, \,) and markdown bold,
// which is why dumping them straight into the DOM reads as noise.

const SYMBOLS = [
  ["leq?", "≤"], ["geq?", "≥"], ["neq?", "≠"],
  ["rightarrow", "→"], ["leftarrow", "←"], ["leftrightarrow", "↔"],
  ["ldots|dots", "…"], ["cdot", "·"], ["times", "×"],
  ["infty", "∞"], ["pm", "±"],
];

const HEADINGS = /^(Input|Output|Note|Examples?|Constraints?)\s*:?\s*$/gm;
const EXAMPLE = /\n(Example \d+:?)/g;

function symbols(text) {
  return SYMBOLS.reduce((acc, [pattern, glyph]) => acc.replace(new RegExp(`\\\\${pattern}\\b`, "g"), glyph), text);
}

/** Strips markup down to readable plain text — used for previews and AI prompts. */
export function toPlainText(html) {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<sup[^>]*>([\s\S]*?)<\/sup>/gi, "^{$1}")
    .replace(/<sub[^>]*>([\s\S]*?)<\/sub>/gi, "_{$1}")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|tr|pre)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Theory levels embed scraped article HTML. Some of those scrapes ran long and captured
// the source page's Next.js flight payload and <meta> tags after the article body, which
// renders as a wall of JSON. Cut the document at the first sign of that machinery.
const PAYLOAD_MARKERS = [
  /\n?\s*\d+:\["\$"/,          // RSC flight rows: 6:["$","$L18",...
  /self\.__next_f/,
  /\d+:"\$[a-z]:metadata"/,
  /\["\$","meta"/,
  /\["\$","link"/,
];

/** Cleans scraped article HTML: drops scripts, styles and any RSC payload tail. */
export function sanitizeArticleHtml(html) {
  if (!html) return "";

  let out = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<meta\b[^>]*>/gi, "");

  // Truncate at the earliest payload marker.
  let cut = out.length;
  for (const marker of PAYLOAD_MARKERS) {
    const m = out.match(marker);
    if (m && m.index < cut) cut = m.index;
  }
  out = out.slice(0, cut);

  out = out
    // These articles use a bold-only paragraph where a heading belongs, which reads as
    // undifferentiated prose. Promote those to real headings.
    .replace(/<p>\s*<strong>([^<]{3,90}?)<\/strong>\s*:?\s*<\/p>/gi, "<h3>$1</h3>")
    .replace(/<p>\s*<b>([^<]{3,90}?)<\/b>\s*:?\s*<\/p>/gi, "<h3>$1</h3>");

  return resolveImages(out)
    // Any stray flight rows or JSON fragments left mid-document.
    .replace(/^\s*\d+:\[.*$/gm, "")
    .replace(/\["\$",("[^"]*",?)+\{[^}]*\}\],?/g, "")
    // Outbound links have nowhere to go in a local mirror — keep the text, drop the href.
    .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1")
    .replace(/(<p>\s*(&nbsp;|\s)*<\/p>)+/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Swap the localized image tokens for their bundled URLs, and drop any <img> still
// pointing off-site — a handful of the source CDN links are dead upstream.
function resolveImages(html) {
  return html
    .replace(/(<img\b[^>]*?\bsrc=)(["'])algowar-content:([^"']+)\2/gi, (full, prefix, q, name) => {
      const url = contentImage(name);
      return url ? `${prefix}${q}${url}${q}` : full;
    })
    .replace(/<img\b[^>]*\bsrc=["'](?:https?:)?\/\/[^"']*["'][^>]*>/gi, "")
    .replace(/<img\b[^>]*\bsrc=["']algowar-content:[^"']*["'][^>]*>/gi, "");
}

/** Turns a raw statement into the same HTML structure the live site renders. */
export function renderStatement(raw) {
  if (!raw) return "";

  // Already-HTML statements (career levels and scraped theory articles) go through the
  // article sanitizer rather than the LaTeX pipeline.
  if (/<(p|div|ul|ol|strong|pre|h[1-6]|table|img)\b/i.test(raw)) return sanitizeArticleHtml(raw);

  let text = raw
    // Drop the Codeforces header block — title, limits and I/O mode are shown as chips.
    .replace(/^[A-Z]\d*\..*?\n(?:time limit per test\n.*?\n)?(?:memory limit per test\n.*?\n)?(?:input\n.*?\n)?(?:output\n.*?\n)?/i, "")
    .trim()
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // These payloads mark sections as markdown bold — sometimes mid-paragraph — while
    // the site's heading regex expects a bare label on its own line. Normalise first.
    .replace(/\*\*\s*(Input|Output|Constraints?|Examples?|Note)\s*:?\s*\*\*/gi, "\n\n$1\n")
    .replace(/\s*(Example \d+)\s*:/g, "\n\n$1:\n")
    .replace(/\\(?:text|mathrm|operatorname)\{([^{}]*)\}/g, "$1")
    .replace(/\\(?:textbf|mathbf)\{([^{}]*)\}/g, "<strong>$1</strong>")
    .replace(/\\(?:textit|mathit)\{([^{}]*)\}/g, "<em>$1</em>")
    .replace(/\\(?:texttt|mathtt)\{([^{}]*)\}/g, "<code>$1</code>")
    .replace(/\\color\{[^{}]*\}\{([^{}]*)\}/g, "$1")
    .replace(/\\color\{[^{}]*\}/g, "");

  text = symbols(text)
    .replace(/\\(min|max|gcd|bmod|mod)\b/g, "$1")
    .replace(/\\quad|\\qquad|\;|\\,/g, " ")
    .replace(/\\[()]/g, "")
    .replace(/\${1,2}/g, "")
    .replace(/\^\{([^{}]+)\}/g, "<sup>$1</sup>")
    .replace(/\^([A-Za-z0-9]+)/g, "<sup>$1</sup>")
    .replace(/_\{([^{}]+)\}/g, "<sub>$1</sub>")
    .replace(/_([A-Za-z0-9]+)/g, "<sub>$1</sub>")
    // Markdown bold survives in these payloads and marks the section headings.
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\\+/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n(Input:\n)([\s\S]*?)(?=\nOutput:)/g, '\n<div class="sample-label">Input</div><pre>$2</pre>')
    .replace(/\n(Output:\n)([\s\S]*?)(?=\n\n|\nExample|\n$)/g, '\n<div class="sample-label">Output</div><pre>$2</pre>')
    .replace(HEADINGS, '<h4 class="problem-heading">$1</h4>')
    .replace(EXAMPLE, '\n<div class="problem-example">$1</div>')
    .replace(/\n\n+/g, '</p><p class="mb-3">')
    .replace(/\n/g, "<br />");

  return `<div class="problem-content"><p class="mb-3">${text}</p></div>`;
}

/** Pulls the Codeforces header facts off a raw statement, for display as chips. */
export function statementMeta(raw) {
  if (!raw) return {};
  const time = raw.match(/time limit per test\n(.*)/i)?.[1]?.trim();
  const memory = raw.match(/memory limit per test\n(.*)/i)?.[1]?.trim();
  return { timeLimit: time, memoryLimit: memory };
}
