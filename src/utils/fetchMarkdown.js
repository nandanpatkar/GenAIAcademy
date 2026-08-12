/**
 * Fetch a documentation page without ever treating an SPA fallback as prose.
 * Vite serves index.html for unknown client-side routes, while production
 * rewrites the documentation prefixes to the archive CDN.  Detecting an HTML
 * document here prevents the fallback from being passed to ReactMarkdown.
 */
export async function fetchMarkdown(url) {
  const response = await fetch(url, {
    headers: { Accept: "text/markdown, text/plain;q=0.9, */*;q=0.1" },
  });

  if (!response.ok) {
    throw new Error(`Could not load this page (${response.status}). Please try again.`);
  }

  const text = await response.text();
  const leadingContent = text.trimStart().slice(0, 500);
  const isHtmlDocument = /<!doctype\s+html|<html[\s>]|<head[\s>]|<body[\s>]/i.test(leadingContent);

  if (isHtmlDocument) {
    throw new Error("Documentation is temporarily unavailable. Please retry in a moment.");
  }
  if (!text.trim()) {
    throw new Error("This documentation page is empty. Please retry in a moment.");
  }

  return text;
}
