import React, { useMemo, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import mermaid from "mermaid";
import {
  Copy, Check, Info, Lightbulb, TriangleAlert, OctagonAlert, Sparkles,
  ChevronRight, Play, ExternalLink, ArrowUpRight,
} from "lucide-react";

/* Markdown rendering for the LangChain docs viewer.
 *
 * The build script (scripts/build_langchain_docs.py) lowers Mintlify's MDX onto
 * plain markdown so react-markdown can parse it without rehype-raw:
 *
 *   <Note>…</Note>            ->  > [!NOTE] blockquote
 *   <Expandable title=…>      ->  > [!DETAILS] Title
 *   provider CodeGroups       ->  ```lc-tabs  fence holding JSON
 *   <Columns><Card …>         ->  ```lc-cards fence holding JSON
 *   /oss/langchain/agents     ->  (lc:oss/python/langchain/agents)
 *
 * Everything below is the other half of that contract.
 */

/* ── code themes ──────────────────────────────────────────────────────────
   docs.json pins catppuccin-latte / catppuccin-mocha. react-syntax-highlighter
   ships neither, but it takes any plain style object, so both palettes are
   mapped onto Prism's token names here. */

const makeTheme = (p) => ({
  'code[class*="language-"]': { color: p.text, background: "none", fontFamily: "var(--lc-mono)" },
  'pre[class*="language-"]': { color: p.text, background: p.base, fontFamily: "var(--lc-mono)" },
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

const MOCHA = makeTheme({
  base: "#181825", text: "#cdd6f4", subtext: "#a6adc8", overlay: "#7f849c",
  red: "#f38ba8", peach: "#fab387", yellow: "#f9e2af", green: "#a6e3a1",
  teal: "#94e2d5", blue: "#89b4fa", mauve: "#cba6f7",
});

const LATTE = makeTheme({
  base: "#eff1f5", text: "#4c4f69", subtext: "#6c6f85", overlay: "#8c8fa1",
  red: "#d20f39", peach: "#fe640b", yellow: "#df8e1d", green: "#40a02b",
  teal: "#179299", blue: "#1e66f5", mauve: "#8839ef",
});

/* Prism ships no `text` grammar; anything unknown renders unhighlighted. */
const HIGHLIGHTABLE = new Set([
  "python", "py", "bash", "shell", "sh", "json", "yaml", "yml", "typescript",
  "ts", "javascript", "js", "jsx", "tsx", "sql", "toml", "docker", "dockerfile",
  "http", "graphql", "xml", "html", "css", "diff", "markdown", "ini",
]);

const LANG_LABEL = {
  py: "python", sh: "bash", shell: "bash", yml: "yaml", ts: "typescript",
  js: "javascript", text: "text",
};

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

/* ── code block ──────────────────────────────────────────────────────────── */

export function LcCode({ language, code, filename, dark, compact }) {
  const [copied, setCopied] = useState(false);
  const lang = (language || "text").toLowerCase();

  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className={`lc-code${compact ? " lc-code--compact" : ""}`}>
      <div className="lc-code-bar">
        <span className="lc-code-lang">{filename || LANG_LABEL[lang] || lang}</span>
        <button className="lc-code-copy" onClick={copy} title="Copy code" type="button">
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={HIGHLIGHTABLE.has(lang) ? lang : "text"}
        style={dark ? MOCHA : LATTE}
        customStyle={{
          margin: 0, background: "transparent", fontSize: 13,
          padding: "14px 16px", lineHeight: 1.62,
        }}
        codeTagProps={{ style: { fontFamily: "var(--lc-mono)" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

/* ── provider / model tab strip ───────────────────────────────────────────
   The signature element of docs.langchain.com: one sample, one tab per model
   provider. The choice is sticky across pages because a reader picks their
   provider once and wants every later sample to match. */

const LS_PROVIDER = "langchain_docs_provider";

export function LcCodeTabs({ tabs, dark }) {
  const [active, setActive] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_PROVIDER);
      const index = tabs.findIndex((tab) => tab.label === saved);
      return index > -1 ? index : 0;
    } catch { return 0; }
  });

  const current = tabs[Math.min(active, tabs.length - 1)] || tabs[0];
  if (!current) return null;

  const pick = (index) => {
    setActive(index);
    try { localStorage.setItem(LS_PROVIDER, tabs[index].label); } catch { /* ignore */ }
  };

  return (
    <div className="lc-tabs">
      <div className="lc-tabs-strip" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={`${tab.label}-${index}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            className={`lc-tab${index === active ? " lc-tab--on" : ""}`}
            onClick={() => pick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <LcCode language={current.lang} code={current.code} dark={dark} compact />
    </div>
  );
}

/* ── card grid ───────────────────────────────────────────────────────────── */

export function LcCards({ cards, onDocLink }) {
  return (
    <div className="lc-cards">
      {cards.map((card, index) => {
        const internal = card.href && card.href.startsWith("lc:");
        const Tag = card.href ? "a" : "div";
        return (
          <Tag
            key={index}
            className="lc-card"
            {...(card.href
              ? internal
                ? {
                    href: `#${card.href.slice(3)}`,
                    onClick: (event) => { event.preventDefault(); onDocLink?.(card.href.slice(3)); },
                  }
                : { href: card.href, target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <span className="lc-card-title">
              {card.title}
              {card.href ? <ArrowUpRight size={13} /> : null}
            </span>
            {card.body ? <span className="lc-card-body">{card.body}</span> : null}
          </Tag>
        );
      })}
    </div>
  );
}

/* ── mermaid ─────────────────────────────────────────────────────────────
   99 diagrams across the corpus. The theme is set per diagram with an init
   directive rather than mermaid.initialize(), which is global and would
   otherwise fight with ManualViewer's own dark-themed diagrams. */

export function LcMermaid({ chart, dark }) {
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);
  const idRef = useRef(`lc-mermaid-${Math.random().toString(36).slice(2)}`);

  React.useEffect(() => {
    let alive = true;
    const theme = dark
      ? `%%{init:{"theme":"base","themeVariables":{"background":"#181825","primaryColor":"#1e2536","primaryTextColor":"#e8eefc","primaryBorderColor":"#4f5d73","lineColor":"#7FC8FF","secondaryColor":"#232c40","tertiaryColor":"#1a2233","fontFamily":"Inter, sans-serif"}}}%%\n`
      : `%%{init:{"theme":"base","themeVariables":{"background":"#ffffff","primaryColor":"#eaf3fd","primaryTextColor":"#030710","primaryBorderColor":"#9dc4e8","lineColor":"#006DDD","secondaryColor":"#f4f7fb","tertiaryColor":"#fafbfd","fontFamily":"Inter, sans-serif"}}}%%\n`;

    mermaid
      .render(idRef.current, theme + chart)
      .then((result) => { if (alive) setSvg(result.svg); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [chart, dark]);

  if (failed) return <LcCode language="text" code={chart} dark={dark} filename="diagram" />;
  return <div className="lc-mermaid" dangerouslySetInnerHTML={{ __html: svg }} />;
}

/* ── images ──────────────────────────────────────────────────────────────
   The build ships a first-frame poster for the 25 LangSmith screencasts and
   tags it `heavy:<MB>:<url>`. Clicking swaps in the animation from
   docs.langchain.com, so a reading pane never pulls 200 MB unasked. */

function LcImage({ src, alt, title }) {
  const heavy = /^heavy:([\d.]+):(.+)$/.exec(title || "");
  const [playing, setPlaying] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  if (heavy && !playing) {
    return (
      <figure className="lc-figure">
        <button type="button" className="lc-heavy" onClick={() => setPlaying(true)}>
          <img src={src} alt={alt || ""} loading="lazy" />
          <span className="lc-heavy-badge">
            <Play size={14} /> Play walkthrough · {heavy[1]} MB
          </span>
        </button>
        {alt ? <figcaption>{alt}</figcaption> : null}
      </figure>
    );
  }

  return (
    <figure className="lc-figure">
      <img
        className={`lc-img${zoomed ? " lc-img--zoom" : ""}`}
        src={heavy ? heavy[2] : src}
        alt={alt || ""}
        loading="lazy"
        onClick={() => setZoomed((value) => !value)}
      />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  );
}

/* ── callouts ────────────────────────────────────────────────────────────── */

const CALLOUT = {
  NOTE: { icon: Info, cls: "note" },
  TIP: { icon: Lightbulb, cls: "tip" },
  WARNING: { icon: TriangleAlert, cls: "warning" },
  DANGER: { icon: OctagonAlert, cls: "danger" },
  UPDATE: { icon: Sparkles, cls: "update" },
};

const MARKER_RE = /^\[!(NOTE|TIP|WARNING|DANGER|UPDATE|DETAILS)\](?:\s+([\s\S]*))?$/;

/* ── component map ───────────────────────────────────────────────────────── */

/**
 * @param resolveDoc  (slug) => boolean — is this slug part of the build?
 * @param onDocLink   (slug) => void    — navigate to that page
 * @param dark        current theme, for code and diagram palettes
 */
export function makeLangChainComponents({ onDocLink, resolveDoc, dark } = {}) {
  return {
    pre({ children }) {
      const child = Array.isArray(children) ? children[0] : children;
      const className = child?.props?.className || "";
      const lang = (/language-(\S+)/.exec(className) || [, "text"])[1];
      const meta = child?.props?.node?.data?.meta || "";
      const raw = child?.props?.children;
      const code = String(Array.isArray(raw) ? raw.join("") : (raw ?? "")).replace(/\n$/, "");

      if (lang === "lc-tabs") {
        try { return <LcCodeTabs tabs={JSON.parse(code)} dark={dark} />; }
        catch { return <LcCode language="json" code={code} dark={dark} />; }
      }
      if (lang === "lc-cards") {
        try { return <LcCards cards={JSON.parse(code)} onDocLink={onDocLink} />; }
        catch { return null; }
      }
      if (lang === "mermaid") return <LcMermaid chart={code} dark={dark} />;
      return <LcCode language={lang} code={code} filename={meta} dark={dark} />;
    },

    code: ({ children, ...props }) => <code className="lc-inline" {...props}>{children}</code>,

    blockquote({ children }) {
      const kids = React.Children.toArray(children)
        .filter((child) => typeof child !== "string" || child.trim());
      const marker = MARKER_RE.exec(childText(kids[0]).trim());
      if (!marker) return <blockquote className="lc-quote">{children}</blockquote>;

      const [, kind, label] = marker;
      const body = kids.slice(1);

      if (kind === "DETAILS") {
        return (
          <details className="lc-details">
            <summary>
              <ChevronRight size={14} />
              {label || "Details"}
            </summary>
            <div className="lc-details-body">{body}</div>
          </details>
        );
      }

      const { icon: Glyph, cls } = CALLOUT[kind] || CALLOUT.NOTE;
      return (
        <aside className={`lc-callout lc-callout--${cls}`}>
          <span className="lc-callout-icon"><Glyph size={15} /></span>
          <div className="lc-callout-body">
            {label ? <p className="lc-callout-title">{label}</p> : null}
            {body}
          </div>
        </aside>
      );
    },

    a({ href, children, ...props }) {
      if (!href) return <>{children}</>;

      if (href.startsWith("lc:")) {
        const slug = href.slice(3);
        const [target, hash] = slug.split("#");
        if (resolveDoc?.(target)) {
          return (
            <a
              className="lc-xref"
              href={`#${slug}`}
              onClick={(event) => { event.preventDefault(); onDocLink?.(target, hash); }}
              {...props}
            >{children}</a>
          );
        }
        return <span className="lc-delinked">{children}</span>;
      }

      if (href.startsWith("#")) {
        return (
          <a
            href={href}
            onClick={(event) => {
              event.preventDefault();
              document.getElementById(href.slice(1))
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            {...props}
          >{children}</a>
        );
      }

      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="lc-ext" {...props}>
          {children}<ExternalLink size={11} />
        </a>
      );
    },

    img: ({ src, alt, title }) => <LcImage src={src} alt={alt} title={title} />,
    h2: ({ children, ...props }) => <h2 id={slugifyHeading(children)} {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 id={slugifyHeading(children)} {...props}>{children}</h3>,
    h4: ({ children, ...props }) => <h4 id={slugifyHeading(children)} {...props}>{children}</h4>,
    table: ({ children, ...props }) => (
      <div className="lc-table-wrap"><table {...props}>{children}</table></div>
    ),
  };
}

/* react-markdown sanitizes any URL whose protocol is not on its allow-list, and
   `lc:` is not on it — without this every in-app cross-reference (about 7,000 of
   them) silently loses its href and renders as plain text. */
export const langChainUrlTransform = (url) =>
  url.startsWith("lc:") ? url : defaultUrlTransform(url);

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

export function useLangChainComponents(options) {
  return useMemo(() => makeLangChainComponents(options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.dark, options.onDocLink, options.resolveDoc]);
}
