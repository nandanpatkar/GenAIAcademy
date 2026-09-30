import React from "react";
import remarkGfm from "remark-gfm";

/**
 * Markdown settings for anything written by community members. react-markdown
 * never renders raw HTML; on top of that, images become plain links (no
 * third-party requests just from scrolling) and every link is marked ugc.
 */
export const safeMarkdown = {
  remarkPlugins: [remarkGfm],
  components: {
    img: ({ src, alt }) => <a href={src} target="_blank" rel="noopener noreferrer nofollow ugc">[image: {alt || "link"}]</a>,
    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer nofollow ugc">{children}</a>,
  },
};

export const excerpt = (markdown, length = 180) => {
  const text = String(markdown || "").replace(/```[\s\S]*?```/g, " ").replace(/[#>*_`~[\]()!-]/g, " ").replace(/\s+/g, " ").trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
};
