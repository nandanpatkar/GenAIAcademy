/**
 * AVArticle.jsx — renders one article from the research archive.
 *
 * Bodies are markdown fetched from R2 on demand (~13 KB each), unlike the CMS
 * posts in BlogPage which are stored as HTML and rendered with
 * dangerouslySetInnerHTML. That is the whole reason this is a separate
 * component rather than a branch inside BlogDetail.
 *
 * Image sources in the markdown are root-relative (`/2024/img/<slug>/1.webp`).
 * They are resolved against VITE_AV_CDN_BASE here, at render time, so pointing
 * the archive at a custom domain later is an env change rather than a rebuild
 * and re-upload of 8,632 files.
 *
 * No author and no link to the original article are rendered — the build strips
 * both from the body, and nothing here adds them back.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { loadPost, resolveImage } from "../../services/avArchiveService";

/** Stable, readable heading ids so the TOC and deep links agree. */
function slugifyHeading(children) {
  const text = React.Children.toArray(children)
    .map((child) => (typeof child === "string" ? child : child?.props?.children ?? ""))
    .join(" ");
  return {
    text,
    id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section",
  };
}

/** Flatten a react-markdown child tree back to plain source text. */
function extractText(node) {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  return extractText(node.props?.children);
}

/**
 * Most fences in this corpus have no language tag, and the scraper replaced
 * leading indentation with non-breaking spaces — which Prism will not tokenize
 * and which break copy-paste. Both are repaired here.
 */
const LANGUAGE_HINTS = [
  [/^\s*(?:from|import)\s+\w|def\s+\w+\s*\(|print\s*\(|\bself\b|pip install/m, "python"],
  [/^\s*(?:const|let|var|function|=>|require\(|console\.log)/m, "javascript"],
  [/^\s*(?:SELECT|INSERT|UPDATE|DELETE|CREATE TABLE)\b/im, "sql"],
  [/^\s*(?:library\(|<-\s|ggplot\()/m, "r"],
  [/^\s*[{[][\s\S]*["'][\w-]+["']\s*:/m, "json"],
  [/^\s*(?:\$|sudo |apt-get |cd |ls |curl |docker |git )/m, "bash"],
  [/<\/?[a-z][\w-]*[\s/>]/i, "markup"],
];

function guessLanguage(code) {
  for (const [pattern, language] of LANGUAGE_HINTS) {
    if (pattern.test(code)) return language;
  }
  return "text";
}

function AVImage({ src, alt, title }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null; // a dead image should not leave a broken-icon hole
  return (
    <img
      src={resolveImage(src)}
      alt={alt || ""}
      title={title || undefined}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      style={{
        maxWidth: "100%", height: "auto", display: "block",
        margin: "28px auto", borderRadius: 12, border: "1px solid var(--border)",
      }}
    />
  );
}

export default function AVArticle({ post, dark = true, onTocChange, onLoaded }) {
  const [markdown, setMarkdown] = useState("");
  const [state, setState] = useState("loading"); // loading | ready | error
  const [attempt, setAttempt] = useState(0);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!post?.slug) return undefined;
    let alive = true;
    setState("loading");
    setMarkdown("");

    loadPost(post.slug).then((text) => {
      if (!alive) return;
      if (!text) {
        setState("error");
        return;
      }
      setMarkdown(text);
      setState("ready");
      // Hand the body up so the page's AI summary works on the real article
      // rather than on the 200-character card excerpt.
      onLoaded?.(text);
    });

    return () => { alive = false; };
  }, [post?.slug, attempt, onLoaded]);

  // Headings are collected after render so the TOC reflects what is actually
  // on the page, matching how BlogDetail builds its own TOC from the DOM.
  useEffect(() => {
    if (state !== "ready" || !onTocChange || !bodyRef.current) return;
    const headings = Array.from(bodyRef.current.querySelectorAll("h2, h3"));
    onTocChange(headings.map((h) => ({
      id: h.id,
      text: h.textContent,
      level: Number(h.tagName.substring(1)),
    })));
  }, [state, markdown, onTocChange]);

  const components = useMemo(() => ({
    img: AVImage,
    h1: ({ children }) => {
      const { id, text } = slugifyHeading(children);
      return <h2 id={id}>{text}</h2>; // the real <h1> is the article title above
    },
    h2: ({ children }) => {
      const { id, text } = slugifyHeading(children);
      return <h2 id={id}>{text}</h2>;
    },
    h3: ({ children }) => {
      const { id, text } = slugifyHeading(children);
      return <h3 id={id}>{text}</h3>;
    },
    // Link handling has to be discriminating here. 3,299 links in the corpus
    // are in-page table-of-contents anchors, and blanket target="_blank" made
    // every one of them open the app itself in a new tab. Another 51 are
    // unusable (`file:///C:/Users/...`) or scheme-less (`www.example.com`).
    a: ({ href, children }) => {
      const raw = (href || "").trim();

      if (raw.startsWith("#")) {
        return (
          <a
            href={raw}
            onClick={(event) => {
              event.preventDefault();
              const root = bodyRef.current;
              if (!root) return;
              const byId = (value) => {
                try { return root.querySelector(`#${CSS.escape(value)}`); }
                catch { return null; }
              };
              // The source's anchors are WordPress-era (`#2`, `#h-introduction`)
              // and no longer match anything. The link text is the heading text
              // though, so slugifying it lands on the right heading.
              const target =
                byId(raw.slice(1)) ||
                byId(raw.slice(1).replace(/^h-/, "")) ||
                byId(slugifyHeading(children).id);
              target?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {children}
          </a>
        );
      }

      // Anything without a usable destination renders as plain text rather
      // than as a link that goes nowhere.
      if (!raw || /^(file|javascript|data):/i.test(raw)) return <>{children}</>;
      const url = /^https?:\/\//i.test(raw)
        ? raw
        : (/^www\./i.test(raw) ? `https://${raw}` : null);
      if (!url) return <>{children}</>;

      return <a href={url} target="_blank" rel="noopener noreferrer nofollow">{children}</a>;
    },
    table: ({ children }) => (
      // 127 MB of scraped content includes some very wide tables; let them
      // scroll inside the article instead of stretching the page.
      <div style={{ overflowX: "auto", margin: "24px 0" }}>
        <table>{children}</table>
      </div>
    ),
    // Fenced blocks are handled on `pre`, not `code`. react-markdown v10 no
    // longer passes an `inline` prop, and most fences in this corpus carry no
    // language tag — so keying off `language-*` on `code` classified every
    // untagged block as inline and gave each line its own pill background.
    // Deciding at the `pre` level is unambiguous: if it is a <pre>, it is a block.
    pre({ children }) {
      const child = React.Children.toArray(children)[0];
      const className = child?.props?.className || "";
      // The scraper wrote indentation as U+00A0. Prism will not tokenize it and
      // it breaks copy-paste, so it becomes a real space here.
      const raw = extractText(child?.props?.children)
        .replace(/ /g, " ")
        .replace(/\n$/, "");
      const language = (/language-(\w+)/.exec(className) || [])[1] || guessLanguage(raw);

      return (
        // Long single lines are common here, so the overflow is pinned inside
        // this element rather than allowed to widen the page.
        <SyntaxHighlighter
          style={dark ? oneDark : oneLight}
          language={language}
          PreTag="div"
          customStyle={{
            borderRadius: 10, fontSize: 13.5, margin: "24px 0",
            border: "1px solid var(--border)",
            maxWidth: "100%", overflowX: "auto",
          }}
          codeTagProps={{ style: { whiteSpace: "pre", fontFamily: "inherit" } }}
        >
          {raw}
        </SyntaxHighlighter>
      );
    },
    code({ className, children, ...props }) {
      // Only genuine inline spans reach here now; block content goes via `pre`.
      return <code className="av-inline-code" {...props}>{children}</code>;
    },
  }), [dark]);

  if (state === "loading") {
    return (
      <div className="av-article-state">
        <div className="blog-loading-orbit" />
        <span>Loading article…</span>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="av-article-state">
        <span>This article could not be loaded.</span>
        <button type="button" onClick={() => setAttempt((n) => n + 1)}>Retry</button>
      </div>
    );
  }

  // Title, date and category chips are rendered by BlogDetail, which owns the
  // page header for both archive posts and CMS posts. This renders the body only.
  return (
    <div ref={bodyRef} className="blog-content av-article-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
