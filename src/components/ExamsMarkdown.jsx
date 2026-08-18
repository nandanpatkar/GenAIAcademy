import React, { useEffect, useMemo, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import mermaid from "mermaid";
import {
  Copy, Check, Info, Lightbulb, TriangleAlert, OctagonAlert, ExternalLink,
  ArrowUpRight, ChevronRight, BookOpen, Compass, Layers, Boxes, Workflow,
  GitBranch, GraduationCap, Link2, Library, FlaskConical, CircleCheck, Quote,
} from "lucide-react";
import { slugifyHeading } from "./LangChainMarkdown";

/* Markdown rendering for the Exams and Certification viewer.
 *
 * The build script (scripts/build_exams_docs.py) hands this module plain
 * markdown with three guarantees:
 *
 *   - every cross-reference between notes is `ex:<folder>/<basename>`
 *   - the "Related Notes" list is an ```ex-cards  fence holding JSON
 *   - the "Sources" list is an  ```ex-sources fence holding JSON
 *
 * so nothing here has to resolve an Obsidian wikilink or guess which trailing
 * list is a citation block.
 *
 * The vault also writes to a fixed section template — Knowledge Relevance,
 * When To Use, Core Concepts, AWS Services And Features, Implementation
 * Patterns, Decision Triggers, Tradeoffs And Pitfalls, Exam Tips — which is
 * what SECTIONS below keys off to give each heading its own icon and accent.
 */

/* ── code theme ────────────────────────────────────────────────────────────
   The AWS console's own editor palette, mapped onto Prism's token names.
   react-syntax-highlighter takes any plain style object. */

const makeTheme = (p) => ({
  'code[class*="language-"]': { color: p.text, background: "none", fontFamily: "var(--ex-mono)" },
  'pre[class*="language-"]': { color: p.text, background: p.base, fontFamily: "var(--ex-mono)" },
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
  base: "#0c1420", text: "#dbe4f0", subtext: "#a3b2c7", overlay: "#75849c",
  red: "#ff8f9c", peach: "#ffb26b", yellow: "#f2cd5c", green: "#89dba0",
  teal: "#66d9c8", blue: "#7cc4fa", mauve: "#c4a7f5",
});

const LIGHT = makeTheme({
  base: "#f4f6f9", text: "#1b2532", subtext: "#4b5b70", overlay: "#7a8798",
  red: "#c7273c", peach: "#b35309", yellow: "#8a6400", green: "#26734a",
  teal: "#0f7a72", blue: "#0b64c4", mauve: "#7239b3",
});

/* Prism ships no `text` grammar; anything unknown renders unhighlighted. */
const HIGHLIGHTABLE = new Set([
  "python", "py", "bash", "shell", "sh", "json", "yaml", "yml", "typescript",
  "ts", "javascript", "js", "jsx", "tsx", "sql", "toml", "docker", "dockerfile",
  "http", "graphql", "xml", "html", "css", "diff", "markdown", "ini", "csv", "r",
]);

const LANG_LABEL = { py: "python", sh: "bash", shell: "bash", yml: "yaml", ts: "typescript", js: "javascript" };

/* ── section headings ─────────────────────────────────────────────────────
   The vault's note template, so a reader can find "Exam Tips" by its colour
   without reading a word. Keys are the heading text, lowercased, with the
   leading "1. " numbering some older notes still carry stripped off. */

const SECTIONS = {
  "overview": { icon: Info, kind: "intro" },
  "knowledge relevance": { icon: BookOpen, kind: "intro" },
  "when to use": { icon: Compass, kind: "use" },
  "typical use cases": { icon: Compass, kind: "use" },
  "core concepts": { icon: Layers, kind: "concept" },
  "key features": { icon: Layers, kind: "concept" },
  "key features and capabilities": { icon: Layers, kind: "concept" },
  "aws services and features": { icon: Boxes, kind: "service" },
  "aws services & features": { icon: Boxes, kind: "service" },
  "implementation patterns": { icon: Workflow, kind: "pattern" },
  "practical application": { icon: FlaskConical, kind: "pattern" },
  "practical use cases": { icon: FlaskConical, kind: "pattern" },
  "practical examples and real-world scenarios": { icon: FlaskConical, kind: "pattern" },
  "decision triggers": { icon: GitBranch, kind: "decision" },
  "tradeoffs and pitfalls": { icon: TriangleAlert, kind: "caution" },
  "common challenges and best practices": { icon: TriangleAlert, kind: "caution" },
  "challenges & best practices": { icon: TriangleAlert, kind: "caution" },
  "best practices": { icon: CircleCheck, kind: "good" },
  "exam tips": { icon: GraduationCap, kind: "exam" },
  "related notes": { icon: Link2, kind: "related" },
  "sources": { icon: Library, kind: "sources" },
  "additional resources": { icon: Library, kind: "sources" },
};

const sectionKey = (value) =>
  String(childText(value)).toLowerCase().replace(/^\d+\.\s*/, "").replace(/[:.]\s*$/, "").trim();

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

/* ── code block ──────────────────────────────────────────────────────────── */

export function ExCode({ language, code, filename, dark }) {
  const [copied, setCopied] = useState(false);
  const lang = (language || "text").toLowerCase();

  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className="ex-code">
      <div className="ex-code-bar">
        <span className="ex-code-lang">{filename || LANG_LABEL[lang] || lang}</span>
        <button className="ex-code-copy" onClick={copy} title="Copy code" type="button">
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={HIGHLIGHTABLE.has(lang) ? lang : "text"}
        style={dark ? DARK : LIGHT}
        customStyle={{ margin: 0, background: "transparent", fontSize: 13, padding: "14px 16px", lineHeight: 1.62 }}
        codeTagProps={{ style: { fontFamily: "var(--ex-mono)" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

/* ── related notes ───────────────────────────────────────────────────────
   Every vault note ends with a "Related Notes" list. As a bullet list of bare
   links it reads as an afterthought; as a card grid it reads as the map of the
   neighbourhood, which is what it actually is. */

export function ExCards({ cards, onDocLink, resolveDoc }) {
  return (
    <div className="ex-cards">
      {cards.map((card, index) => {
        const internal = card.href && card.href.startsWith("ex:");
        const slug = internal ? card.href.slice(3).split("#")[0] : null;
        const dead = internal && resolveDoc && !resolveDoc(slug);
        const Tag = card.href && !dead ? "a" : "div";
        return (
          <Tag
            key={`${card.href || card.title}-${index}`}
            className="ex-card"
            {...(card.href && !dead
              ? internal
                ? {
                    href: `#${card.href.slice(3)}`,
                    onClick: (event) => { event.preventDefault(); onDocLink?.(slug); },
                  }
                : { href: card.href, target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <span className="ex-card-title">
              {card.title}
              {card.href && !dead ? <ArrowUpRight size={13} /> : null}
            </span>
            {card.body ? <span className="ex-card-body">{card.body}</span> : null}
          </Tag>
        );
      })}
    </div>
  );
}

/* ── sources ─────────────────────────────────────────────────────────────
   285 of the 299 notes cite AWS documentation directly. Rendering the list as
   numbered citations rather than blue bullets makes it obvious which claims
   are sourced and where they came from. */

export function ExSources({ sources }) {
  return (
    <ol className="ex-sources">
      {sources.map((source, index) => {
        // Most notes cite a bare URL, so the "title" is the URL itself. Showing
        // the host again beside it just prints the same string twice.
        const bare = /^https?:\/\//i.test(source.title);
        let host = "";
        try { host = new URL(source.href).hostname.replace(/^www\./, ""); } catch { host = ""; }
        return (
          <li key={`${source.href}-${index}`}>
            <a href={source.href} target="_blank" rel="noopener noreferrer">
              <span className="ex-source-title">
                {bare ? source.title.replace(/^https?:\/\/(www\.)?/i, "") : source.title}
              </span>
              {host && !bare ? <span className="ex-source-host">{host}</span> : null}
              <ExternalLink size={11} />
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/* ── mermaid ─────────────────────────────────────────────────────────────
   Eleven diagrams across the corpus. The theme is set per diagram with an init
   directive rather than mermaid.initialize(), which is global and would
   otherwise fight with the other viewers' diagrams. */

export function ExMermaid({ chart, dark }) {
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);
  const idRef = useRef(`ex-mermaid-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    let alive = true;
    // No fontFamily override on purpose. Mermaid measures each label to size
    // its node, and it measures with its own stylesheet — naming a face the
    // measurement pass does not apply lays the boxes out for one font and
    // paints them in another, clipping every label that does not happen to fit.
    const theme = dark
      ? `%%{init:{"theme":"base","themeVariables":{"background":"#0c1420","primaryColor":"#132133","primaryTextColor":"#e7eefb","primaryBorderColor":"#3d5170","lineColor":"#ff9900","secondaryColor":"#182a41","tertiaryColor":"#101b2b"}}}%%\n`
      : `%%{init:{"theme":"base","themeVariables":{"background":"#ffffff","primaryColor":"#fff3e4","primaryTextColor":"#16202e","primaryBorderColor":"#e8a15c","lineColor":"#d97706","secondaryColor":"#f4f7fb","tertiaryColor":"#fafbfd"}}}%%\n`;

    mermaid
      .render(idRef.current, theme + chart)
      .then((result) => { if (alive) setSvg(result.svg); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [chart, dark]);

  if (failed) return <ExCode language="text" code={chart} dark={dark} filename="diagram" />;
  return <div className="ex-mermaid" dangerouslySetInnerHTML={{ __html: svg }} />;
}

/* ── callouts ────────────────────────────────────────────────────────────
   The vault writes plain blockquotes today, but its own improvement plan
   proposes GitHub-style admonitions, so both shapes render. */

const CALLOUT = {
  NOTE: { icon: Info, cls: "note" },
  TIP: { icon: Lightbulb, cls: "tip" },
  IMPORTANT: { icon: Info, cls: "note" },
  WARNING: { icon: TriangleAlert, cls: "warning" },
  CAUTION: { icon: OctagonAlert, cls: "danger" },
  DANGER: { icon: OctagonAlert, cls: "danger" },
};

const MARKER_RE = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|DANGER|DETAILS)\](?:\s+([\s\S]*))?$/;

/* ── component map ───────────────────────────────────────────────────────── */

/**
 * @param resolveDoc  (slug) => boolean — is this slug part of the build?
 * @param onDocLink   (slug, hash) => void — navigate to that note
 * @param dark        current theme, for code and diagram palettes
 */
export function makeExamsComponents({ onDocLink, resolveDoc, dark } = {}) {
  const heading = (Tag) => ({ children, ...props }) => {
    const info = Tag === "h2" ? SECTIONS[sectionKey(children)] : null;
    const Glyph = info?.icon;
    return (
      <Tag
        id={slugifyHeading(children)}
        className={info ? `ex-h ex-h--${info.kind}` : undefined}
        {...props}
      >
        {Glyph ? <Glyph size={17} className="ex-h-icon" aria-hidden="true" /> : null}
        <span>{children}</span>
      </Tag>
    );
  };

  return {
    pre({ children }) {
      const child = Array.isArray(children) ? children[0] : children;
      const className = child?.props?.className || "";
      const lang = (/language-(\S+)/.exec(className) || [, "text"])[1];
      const meta = child?.props?.node?.data?.meta || "";
      const raw = child?.props?.children;
      const code = String(Array.isArray(raw) ? raw.join("") : (raw ?? "")).replace(/\n$/, "");

      if (lang === "ex-cards") {
        try { return <ExCards cards={JSON.parse(code)} onDocLink={onDocLink} resolveDoc={resolveDoc} />; }
        catch { return null; }
      }
      if (lang === "ex-sources") {
        try { return <ExSources sources={JSON.parse(code)} />; }
        catch { return <ExCode language="json" code={code} dark={dark} />; }
      }
      if (lang === "mermaid") return <ExMermaid chart={code} dark={dark} />;
      return <ExCode language={lang} code={code} filename={meta} dark={dark} />;
    },

    code: ({ children, ...props }) => <code className="ex-inline" {...props}>{children}</code>,

    blockquote({ children }) {
      const kids = React.Children.toArray(children)
        .filter((child) => typeof child !== "string" || child.trim());
      const marker = MARKER_RE.exec(childText(kids[0]).trim());
      if (!marker) {
        return (
          <blockquote className="ex-quote">
            <Quote size={13} className="ex-quote-icon" aria-hidden="true" />
            <div>{children}</div>
          </blockquote>
        );
      }

      const [, kind, label] = marker;
      const body = kids.slice(1);

      if (kind === "DETAILS") {
        return (
          <details className="ex-details">
            <summary><ChevronRight size={14} />{label || "Details"}</summary>
            <div className="ex-details-body">{body}</div>
          </details>
        );
      }

      const { icon: Glyph, cls } = CALLOUT[kind] || CALLOUT.NOTE;
      return (
        <aside className={`ex-callout ex-callout--${cls}`}>
          <span className="ex-callout-icon"><Glyph size={15} /></span>
          <div className="ex-callout-body">
            {label ? <p className="ex-callout-title">{label}</p> : null}
            {body}
          </div>
        </aside>
      );
    },

    a({ href, children, ...props }) {
      if (!href) return <>{children}</>;

      if (href.startsWith("ex:")) {
        const [target, hash] = href.slice(3).split("#");
        if (resolveDoc?.(target)) {
          return (
            <a
              className="ex-xref"
              href={`#${href.slice(3)}`}
              onClick={(event) => { event.preventDefault(); onDocLink?.(target, hash); }}
              {...props}
            >{children}</a>
          );
        }
        return <span className="ex-delinked">{children}</span>;
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
        <a href={href} target="_blank" rel="noopener noreferrer" className="ex-ext" {...props}>
          {children}<ExternalLink size={11} />
        </a>
      );
    },

    h2: heading("h2"),
    h3: heading("h3"),
    h4: heading("h4"),
    table: ({ children, ...props }) => (
      <div className="ex-table-wrap"><table {...props}>{children}</table></div>
    ),
  };
}

/* react-markdown sanitizes any URL whose protocol is not on its allow-list, and
   `ex:` is not on it — without this every in-app cross-reference (365 of them)
   silently loses its href and renders as plain text. */
export const examsUrlTransform = (url) =>
  url.startsWith("ex:") ? url : defaultUrlTransform(url);

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
    /^(https?|ircs?|mailto|xmpp)$/i.test(url.slice(0, colon))
  ) {
    return url;
  }
  return "";
}

export function useExamsComponents(options) {
  return useMemo(
    () => makeExamsComponents(options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.dark, options.onDocLink, options.resolveDoc]
  );
}
