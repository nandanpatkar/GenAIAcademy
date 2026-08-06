import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

/* Markdown rendering shared by the docs viewer and the samples viewer, so both
   get identical code blocks, tables, images and link policy. */

// Links out to AWS' own site are stripped: this guide is read in-app, and
// cross-references between AgentCore pages resolve locally instead.
export const isAwsDocsUrl = (href) =>
  /(^|\/\/)(docs\.|console\.)?aws\.amazon\.com/i.test(href);

export const slugifyHeading = (text) =>
  String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <div className="ac-code">
      <div className="ac-code-bar">
        <span className="ac-code-lang">{language || "text"}</span>
        <button className="ac-code-copy" onClick={copy} title="Copy code">
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus}
        customStyle={{
          margin: 0, background: "transparent", fontSize: 12.5,
          padding: "14px 16px", lineHeight: 1.6,
        }}
        codeTagProps={{ style: { fontFamily: "var(--mono)" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// Resolve a relative asset path against the document's own base directory.
// Sample READMEs reference ./images/x.png, and the fetched Markdown is rendered
// on a page whose URL is unrelated to where it came from.
const resolveAsset = (src, baseUrl) => {
  if (!src || /^(https?:|data:|\/)/i.test(src)) return src;
  if (!baseUrl) return src;
  try {
    return new URL(src, `${window.location.origin}${baseUrl.replace(/\/$/, "")}/`).pathname;
  } catch {
    return src;
  }
};

/**
 * Build the `components` map for ReactMarkdown.
 *
 * @param baseUrl     directory the Markdown came from, for relative assets
 * @param resolveDoc  (href) => slug | null — turns a link into an in-app doc page
 * @param onDocLink   (slug) => void — navigate to that doc page
 */
export function makeMarkdownComponents({ baseUrl, resolveDoc, onDocLink } = {}) {
  return {
    // Rendering the block at `pre` is unambiguous — react-markdown v10 drops the
    // `inline` flag, and a one-line fenced sample looks identical to inline code
    // at the `code` node. So `code` below only ever sees true inline spans.
    pre({ children }) {
      const child = Array.isArray(children) ? children[0] : children;
      const match = /language-(\w+)/.exec(child?.props?.className || "");
      const raw = child?.props?.children;
      const text = String(Array.isArray(raw) ? raw.join("") : (raw ?? "")).replace(/\n$/, "");
      return <CodeBlock language={match ? match[1] : "text"} code={text} />;
    },
    code({ className, children, ...props }) {
      return <code className="ac-inline-code" {...props}>{children}</code>;
    },
    a: ({ href, children, ...props }) => {
      if (!href) return <>{children}</>;
      if (href.startsWith("#")) {
        return (
          <a
            href={href}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(href.slice(1))
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            {...props}
          >{children}</a>
        );
      }
      const slug = resolveDoc ? resolveDoc(href) : null;
      if (slug && onDocLink) {
        return (
          <a
            className="ac-xref"
            href={`#${slug}`}
            onClick={(e) => { e.preventDefault(); onDocLink(slug); }}
            {...props}
          >{children}</a>
        );
      }
      if (isAwsDocsUrl(href)) return <span className="ac-delinked">{children}</span>;
      if (/^https?:/i.test(href)) {
        return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
      }
      // A relative link to a sibling file inside the same sample — not navigable
      // on its own, so render the label without a dead target.
      return <span className="ac-delinked">{children}</span>;
    },
    h2: ({ children, ...props }) => (
      <h2 id={slugifyHeading(children)} {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 id={slugifyHeading(children)} {...props}>{children}</h3>
    ),
    table: ({ children, ...props }) => (
      <div className="ac-table-wrap"><table {...props}>{children}</table></div>
    ),
    img: ({ src, alt, ...props }) => (
      <img className="ac-img" src={resolveAsset(src, baseUrl)} alt={alt || ""} loading="lazy" {...props} />
    ),
  };
}

// Headings of level 2–3, for the "on this page" rail.
export function extractToc(markdown) {
  return markdown.split("\n")
    .filter((l) => /^#{2,3}\s+/.test(l))
    .map((l) => {
      const level = l.match(/^#+/)[0].length;
      const label = l.replace(/^#+\s+/, "").replace(/[*_`]/g, "").trim();
      return { level, label, id: slugifyHeading(label) };
    })
    .filter((h) => h.label);
}
