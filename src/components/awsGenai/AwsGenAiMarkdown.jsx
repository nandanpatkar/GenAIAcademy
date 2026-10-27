import React, { Component, useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { AifsCode, AifsMermaid, defaultUrlTransform, makeAifsComponents, slugifyHeading } from "../AiFromScratchMarkdown";

/* Markdown rendering for the AWS GenAI (AIP-C01) study guide.
 *
 * It reuses the AI from Scratch components for headings, callouts, tables,
 * images and code, and swaps in two things of its own:
 *
 *   - links: scripts/build_aws_genai.py rewrites every cross-reference to
 *     `aip:<slug>#<heading>` (another page) or `aip-code:<path>` (a lab file in
 *     the lesson's Code tab), so nothing relative reaches the browser;
 *   - figures: a ```figure fence names an animated widget from figures/,
 *     loaded on first use so the reading pane stays light.
 */

const CODE_LABEL = {
  "lab-run": "runnable lab · offline Python",
  "lab-out": "captured output",
  snippet: "snippet · needs AWS, not run",
};

/* ── figures ─────────────────────────────────────────────────────────── */

let registryRequest = null;
const loadRegistry = () => {
  if (!registryRequest) {
    registryRequest = import("./figures/registry").then((module) => module.default);
  }
  return registryRequest;
};

/** "flow cli-auth" | "vector-space {\"filter\": true}" -> { name, id, config }. */
export function parseFigureSpec(spec) {
  const text = String(spec || "").trim();
  const [name, ...rest] = text.split(/\s+/);
  let id = null;
  let tail = text.slice(name.length).trim();
  if (name === "flow") {
    id = rest[0] || null;
    tail = tail.slice((id || "").length).trim();
  }
  let config = {};
  if (tail) {
    try { config = JSON.parse(tail); } catch { config = {}; }
  }
  return { name, id, config };
}

class FigureBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn("[aws-genai] figure failed:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function AwsFigure({ spec }) {
  const [registry, setRegistry] = useState(null);
  const { name, id, config } = useMemo(() => parseFigureSpec(spec), [spec]);

  useEffect(() => {
    let alive = true;
    loadRegistry()
      .then((value) => { if (alive) setRegistry(value); })
      .catch(() => { if (alive) setRegistry({}); });
    return () => { alive = false; };
  }, []);

  if (!registry) return <div className="aipf aipf--loading" aria-hidden="true" />;
  const Figure = registry[name];
  if (!Figure) return null;
  return (
    <FigureBoundary>
      <Figure id={id} config={config} />
    </FigureBoundary>
  );
}

/* ── components ──────────────────────────────────────────────────────── */

/**
 * @param onLessonLink (slug, hash) => void — follow an `aip:` cross-reference
 * @param onCodeLink (path) => void — open a lab file in the Code tab
 * @param resolveLesson (slug) => boolean — is that slug part of this build?
 */
export function makeAipComponents({ dark, onLessonLink, onCodeLink, resolveLesson } = {}) {
  const base = makeAifsComponents({ dark });
  return {
    ...base,

    pre({ children }) {
      const child = Array.isArray(children) ? children[0] : children;
      const className = child?.props?.className || "";
      const lang = (/language-(\S+)/.exec(className) || [, "text"])[1];
      const meta = child?.props?.node?.data?.meta || "";
      const raw = child?.props?.children;
      const code = String(Array.isArray(raw) ? raw.join("") : (raw ?? "")).replace(/\n$/, "");

      if (lang === "figure") return <AwsFigure spec={code.trim()} />;
      if (lang === "mermaid") return <AifsMermaid chart={code} dark={dark} />;
      const label = CODE_LABEL[meta.trim()] || meta;
      return <AifsCode language={lang} code={code} filename={label} dark={dark} />;
    },

    a({ href, children, ...props }) {
      if (!href) return <>{children}</>;

      if (href.startsWith("aip:")) {
        const [slug, hash] = href.slice(4).split("#");
        if (resolveLesson?.(slug)) {
          return (
            <a
              className="aifs-xref"
              href={`#${slug}`}
              onClick={(event) => { event.preventDefault(); onLessonLink?.(slug, hash || null); }}
              {...props}
            >{children}</a>
          );
        }
        return <span className="aifs-delinked">{children}</span>;
      }

      if (href.startsWith("aip-code:")) {
        const path = href.slice(9);
        return (
          <a
            className="aifs-xref aip-codelink"
            href={`#code-${path}`}
            onClick={(event) => { event.preventDefault(); onCodeLink?.(path); }}
            {...props}
          >{children}</a>
        );
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
  };
}

/** react-markdown drops unknown protocols; keep the two this guide uses. */
export const aipUrlTransform = (url) =>
  url.startsWith("aip:") || url.startsWith("aip-code:") ? url : defaultUrlTransform(url);

/* Headings of level 2–3 for the "On this page" rail. Inline code and bold
   markers go, as they do in the rendered heading's text; underscores inside
   words stay, so the id matches the one slugifyHeading gives the heading. */
export function extractAipToc(markdown) {
  const out = [];
  let fenced = false;
  for (const line of String(markdown || "").split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; continue; }
    if (fenced) continue;
    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;
    const text = match[2]
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[`*]/g, "")
      .replace(/(^|\W)_([^_]+)_(?=\W|$)/g, "$1$2")
      .trim();
    // The course marks verified headings with ✅ / 🟡 / ❌. The marks stay in
    // the body, but in a one-line contents list they are noise. The id still
    // comes from the full text, so it matches the rendered heading.
    const label = text.replace(/\s*[✅🟡❌]+/gu, "").replace(/\(\s*\)/g, "").replace(/\(\s+/g, "(").trim();
    if (label) out.push({ level: match[1].length, label, id: slugifyHeading(text) });
  }
  return out;
}
