import React, { useEffect, useMemo, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import mermaid from "mermaid";
import { Copy, Check, Info, Lightbulb, TriangleAlert, OctagonAlert, ExternalLink } from "lucide-react";
import { AIFS_CONTENT_BASE } from "../data/aiFromScratchData";

/* Markdown rendering for the AI from Scratch curriculum viewer.
 *
 * The build script (scripts/build_ai_from_scratch.py) hands this module plain
 * markdown with two guarantees:
 *
 *   - every figure is an absolute /ai-from-scratch/assets/… path
 *   - every cross-reference between lessons is `aifs:<phase>/<lesson>`
 *
 * so nothing here has to resolve a relative path against the source tree.
 */

const makeTheme = (p) => ({
  'code[class*="language-"]': { color: p.text, background: "none", fontFamily: "var(--aifs-mono)" },
  'pre[class*="language-"]': { color: p.text, background: p.base, fontFamily: "var(--aifs-mono)" },
  comment: { color: p.overlay, fontStyle: "italic" },
  prolog: { color: p.overlay },
  doctype: { color: p.overlay },
  cdata: { color: p.overlay },
  punctuation: { color: p.subtext },
  namespace: { opacity: 0.8 },
  property: { color: p.blue },
  tag: { color: p.blue },
  boolean: { color: p.peach },
  number: { color: p.peach },
  constant: { color: p.peach },
  symbol: { color: p.peach },
  deleted: { color: p.red },
  selector: { color: p.green },
  "attr-name": { color: p.yellow },
  string: { color: p.green },
  char: { color: p.green },
  builtin: { color: p.red },
  inserted: { color: p.green },
  operator: { color: p.teal },
  entity: { color: p.teal },
  url: { color: p.teal },
  variable: { color: p.text },
  atrule: { color: p.mauve },
  "attr-value": { color: p.green },
  keyword: { color: p.mauve },
  function: { color: p.blue },
  "class-name": { color: p.yellow },
  regex: { color: p.peach },
  important: { color: p.red, fontWeight: "bold" },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  decorator: { color: p.yellow },
  "function-variable": { color: p.blue },
  parameter: { color: p.text },
});

const DARK = makeTheme({
  base: "#0e1420", text: "#d7e0f0", subtext: "#9fb0c9", overlay: "#75849c",
  red: "#ff8b9e", peach: "#ffb478", yellow: "#ffd479", green: "#8fe3a4",
  teal: "#7fdbd0", blue: "#7fc8ff", mauve: "#c3a6ff",
});

const LIGHT = makeTheme({
  base: "#f4f7fb", text: "#31405c", subtext: "#5b6b86", overlay: "#7d8ba3",
  red: "#c81e4a", peach: "#c2620a", yellow: "#9a7112", green: "#227a3d",
  teal: "#0d7d78", blue: "#1462c4", mauve: "#6f3fd0",
});

/* Prism ships no `text` grammar; anything unknown renders unhighlighted. */
const HIGHLIGHTABLE = new Set([
  "python", "py", "bash", "shell", "sh", "json", "yaml", "yml", "typescript",
  "ts", "javascript", "js", "jsx", "tsx", "sql", "toml", "docker", "dockerfile",
  "http", "graphql", "xml", "html", "css", "diff", "markdown", "ini", "rust",
  "go", "c", "cpp", "java", "r", "makefile",
]);

const LANG_LABEL = { py: "python", sh: "bash", shell: "bash", yml: "yaml", ts: "typescript", js: "javascript" };

export const slugifyHeading = (value) =>
  String(childText(value)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* Flatten React children (or a hast node) down to plain text. */
function childText(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(childText).join("");
  if (node.value) return node.value;
  if (node.props?.children) return childText(node.props.children);
  if (node.children) return childText(node.children);
  return "";
}

/* ── code block ───────────────────────────────────────────────────────────── */

export function AifsCode({ language, code, filename, dark }) {
  const [copied, setCopied] = useState(false);
  const lang = (language || "text").toLowerCase();

  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className="aifs-code">
      <div className="aifs-code-bar">
        <span className="aifs-code-lang">{filename || LANG_LABEL[lang] || lang}</span>
        <button className="aifs-code-copy" onClick={copy} title="Copy code" type="button">
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={HIGHLIGHTABLE.has(lang) ? lang : "text"}
        style={dark ? DARK : LIGHT}
        customStyle={{ margin: 0, background: "transparent", fontSize: 13, padding: "14px 16px", lineHeight: 1.62 }}
        codeTagProps={{ style: { fontFamily: "var(--aifs-mono)" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

/* ── mermaid ──────────────────────────────────────────────────────────────
   Rendered per diagram with an init directive rather than a global
   mermaid.initialize(), which would fight with the other viewers' themes. */

export function AifsMermaid({ chart, dark }) {
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);
  const idRef = useRef(`aifs-mermaid-${Math.random().toString(36).slice(2)}`);

  React.useEffect(() => {
    let alive = true;
    const theme = dark
      ? `%%{init:{"theme":"base","themeVariables":{"background":"#0e1420","primaryColor":"#17203180","primaryTextColor":"#e8eefc","primaryBorderColor":"#3d4c66","lineColor":"#7fc8ff","secondaryColor":"#1c2537","tertiaryColor":"#141c2b","fontFamily":"Inter, sans-serif"}}}%%\n`
      : `%%{init:{"theme":"base","themeVariables":{"background":"#ffffff","primaryColor":"#eaf3fd","primaryTextColor":"#0b1220","primaryBorderColor":"#a9c8e8","lineColor":"#1462c4","secondaryColor":"#f4f7fb","tertiaryColor":"#fafbfd","fontFamily":"Inter, sans-serif"}}}%%\n`;

    mermaid
      .render(idRef.current, theme + chart)
      .then((result) => { if (alive) setSvg(result.svg); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [chart, dark]);

  if (failed) return <AifsCode language="text" code={chart} dark={dark} filename="diagram" />;
  return <div className="aifs-mermaid" dangerouslySetInnerHTML={{ __html: svg }} />;
}

/* ── interactive figures ─────────────────────────────────────────────────
   Nearly every lesson embeds one widget through a ```figure fence naming an
   id ("kv-cache", "linear-regression-fit", …). The build bundles the upstream
   runtime — 57 dependency-free IIFEs publishing window.LF, a registry, and
   window.mountLessonFigures(root) — into one script, loaded the first time a
   reader opens a lesson that has one and reused for the session.

   The widgets draw themselves entirely from CSS custom properties, which
   AiFromScratch.css maps onto this viewer's palette, so they follow the app's
   light/dark switch. They render into a div React deliberately leaves empty,
   which is why React never fights the widget over its children. */

let figureRuntime = null;

function loadFigureRuntime() {
  if (figureRuntime) return figureRuntime;
  figureRuntime = new Promise((resolve, reject) => {
    if (typeof window.mountLessonFigures === "function") { resolve(); return; }
    const script = document.createElement("script");
    script.src = `${AIFS_CONTENT_BASE}/figures/figures.bundle.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("figure runtime failed to load"));
    document.head.appendChild(script);
  });
  return figureRuntime;
}

export function AifsFigure({ spec, dark }) {
  const wrapRef = useRef(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let alive = true;
    setState("loading");
    loadFigureRuntime()
      .then(() => {
        const wrap = wrapRef.current;
        if (!alive || !wrap) return;
        // Re-mount rather than restyle on a theme flip: the widgets read the
        // custom properties once, when they draw.
        const host = wrap.firstElementChild;
        if (host) {
          host.innerHTML = "";
          delete host.dataset.lfMounted;
          host.classList.remove("lf-animated");
        }
        window.mountLessonFigures?.(wrap);
        setState(host && host.childElementCount ? "ready" : "unknown");
      })
      .catch(() => { if (alive) setState("unknown"); });
    return () => { alive = false; };
  }, [spec, dark]);

  return (
    <div
      ref={wrapRef}
      className={`aifs-widget${state === "unknown" ? " aifs-widget--hidden" : ""}`}
      data-state={state}
    >
      <div className="lesson-figure" data-figure={spec} />
    </div>
  );
}

/* ── figures ─────────────────────────────────────────────────────────────
   Lesson diagrams are SVGs drawn for a dark canvas upstream, so light mode
   gets a white plate behind them rather than a redraw. Click to zoom. */

function AifsImage({ src, alt }) {
  const [zoomed, setZoomed] = useState(false);
  return (
    <figure className="aifs-figure">
      <img
        className={`aifs-img${zoomed ? " aifs-img--zoom" : ""}`}
        src={src}
        alt={alt || ""}
        loading="lazy"
        onClick={() => setZoomed((value) => !value)}
      />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  );
}

/* ── callouts ─────────────────────────────────────────────────────────────── */

const CALLOUT = {
  NOTE: { icon: Info, cls: "note" },
  TIP: { icon: Lightbulb, cls: "tip" },
  WARNING: { icon: TriangleAlert, cls: "warning" },
  DANGER: { icon: OctagonAlert, cls: "danger" },
};

const MARKER_RE = /^\[!(NOTE|TIP|WARNING|DANGER|IMPORTANT|CAUTION)\](?:\s+([\s\S]*))?$/;

/**
 * @param onLessonLink (slug) => void — follow an `aifs:` cross-reference
 * @param resolveLesson (slug) => boolean — is that slug part of this build?
 * @param dark current theme, for code and diagram palettes
 */
export function makeAifsComponents({ onLessonLink, resolveLesson, dark } = {}) {
  return {
    pre({ children }) {
      const child = Array.isArray(children) ? children[0] : children;
      const className = child?.props?.className || "";
      const lang = (/language-(\S+)/.exec(className) || [, "text"])[1];
      const meta = child?.props?.node?.data?.meta || "";
      const raw = child?.props?.children;
      const code = String(Array.isArray(raw) ? raw.join("") : (raw ?? "")).replace(/\n$/, "");

      if (lang === "mermaid") return <AifsMermaid chart={code} dark={dark} />;
      if (lang === "figure") return <AifsFigure spec={code.trim()} dark={dark} />;
      return <AifsCode language={lang} code={code} filename={meta} dark={dark} />;
    },

    code: ({ children, ...props }) => <code className="aifs-inline" {...props}>{children}</code>,

    blockquote({ children }) {
      const kids = React.Children.toArray(children).filter((child) => typeof child !== "string" || child.trim());
      const marker = MARKER_RE.exec(childText(kids[0]).trim());
      if (!marker) return <blockquote className="aifs-quote">{children}</blockquote>;

      const [, rawKind, label] = marker;
      const kind = rawKind === "IMPORTANT" ? "NOTE" : rawKind === "CAUTION" ? "WARNING" : rawKind;
      const { icon: Glyph, cls } = CALLOUT[kind] || CALLOUT.NOTE;
      return (
        <aside className={`aifs-callout aifs-callout--${cls}`}>
          <span className="aifs-callout-icon"><Glyph size={15} /></span>
          <div className="aifs-callout-body">
            {label ? <p className="aifs-callout-title">{label}</p> : null}
            {kids.slice(1)}
          </div>
        </aside>
      );
    },

    a({ href, children, ...props }) {
      if (!href) return <>{children}</>;

      if (href.startsWith("aifs:")) {
        const slug = href.slice(5);
        if (resolveLesson?.(slug)) {
          return (
            <a
              className="aifs-xref"
              href={`#${slug}`}
              onClick={(event) => { event.preventDefault(); onLessonLink?.(slug); }}
              {...props}
            >{children}</a>
          );
        }
        return <span className="aifs-delinked">{children}</span>;
      }

      if (href.startsWith("#")) {
        return (
          <a
            href={href}
            onClick={(event) => {
              event.preventDefault();
              document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            {...props}
          >{children}</a>
        );
      }

      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="aifs-ext" {...props}>
          {children}<ExternalLink size={11} />
        </a>
      );
    },

    img: ({ src, alt }) => <AifsImage src={src} alt={alt} />,
    h2: ({ children, ...props }) => <h2 id={slugifyHeading(children)} {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 id={slugifyHeading(children)} {...props}>{children}</h3>,
    h4: ({ children, ...props }) => <h4 id={slugifyHeading(children)} {...props}>{children}</h4>,
    table: ({ children, ...props }) => (
      <div className="aifs-table-wrap"><table {...props}>{children}</table></div>
    ),
  };
}

/* react-markdown drops any href whose protocol is not on its allow-list, and
   `aifs:` is not on it — without this every in-app cross-reference silently
   loses its href and renders as plain text. */
export const aifsUrlTransform = (url) =>
  url.startsWith("aifs:") ? url : defaultUrlTransform(url);

/* Mirrors react-markdown's own default: allow relative URLs and the safe
   protocols, drop everything else. */
function defaultUrlTransform(url) {
  const colon = url.indexOf(":");
  const questionMark = url.indexOf("?");
  const hash = url.indexOf("#");
  const slash = url.indexOf("/");

  if (
    colon === -1 ||
    (slash !== -1 && colon > slash) ||
    (questionMark !== -1 && colon > questionMark) ||
    (hash !== -1 && colon > hash) ||
    /^(https?|mailto)$/i.test(url.slice(0, colon))
  ) {
    return url;
  }
  return "";
}

/* Headings of level 2–3, for the "On this page" rail. Fenced code is skipped so
   a `# comment` inside a sample never becomes a heading. */
export function extractToc(markdown) {
  const out = [];
  let fenced = false;
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; continue; }
    if (fenced) continue;
    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;
    const label = match[2].replace(/[*_`]/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").trim();
    if (label) out.push({ level: match[1].length, label, id: slugifyHeading(label) });
  }
  return out;
}

export function useAifsComponents(options) {
  return useMemo(() => makeAifsComponents(options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.dark, options.onLessonLink, options.resolveLesson]);
}
