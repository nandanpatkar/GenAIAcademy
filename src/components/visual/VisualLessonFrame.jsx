import React, { useCallback, useEffect, useRef, useState } from "react";
import { Lock, RefreshCw } from "lucide-react";
import { CV_BASE_PATH, getLesson } from "../../data/chaiVisualCourseData";
import WanderingEyesLoader from "../WanderingEyesLoader";
import { applyFrameTheme, patchFramePalette, seedMirrorTheme } from "./visualTheme";
import "../../styles/VisualLearning.css";

/* One Visual Learning lesson, framed from the mirror at /chai-visual/.
 *
 * Lessons are prerendered Next.js pages whose teaching happens in canvas
 * animations driven by the mirror's own bundle, so they are framed rather
 * than rebuilt. Everything needed to make a framed page sit inside the app
 * lives here, so the main sidebar viewer, the DSA hub's lesson page and the
 * problem workspace's Visualize tab all behave the same:
 *
 *   - the mirror's own chrome is stripped (see stripFrameChrome);
 *   - the page is recoloured with the DSA hub's palette and typeface, and
 *     reloads to follow the app's light/dark switch (see visualTheme.js);
 *   - clicks on the mirror's <Link>s — which rewrite to origin-absolute hrefs
 *     on hydration and would otherwise navigate out of the mount — are caught
 *     in the capture phase and handed to `onNavigate`;
 *   - a page that came back as the paywall screen is reported as locked.
 */

const LOCKED_MARK = /This (?:chapter|pattern|problem|topic) is locked/;

const FRAME_CHROME_CSS = `
  [data-cv-hidden] { display: none !important; }
  main { padding-top: 4px !important; }
`;

/* Strip the mirror's own chrome from a framed lesson.
 *
 * The site uses two different layouts — DSA and LLD nest the lesson under
 * `div.flex.min-h-screen` with a sidebar, while the networking and OS note
 * tracks use `div.min-h-screen.bg-paper` with none — so matching on class
 * paths would need a rule per layout and would rot on any redeploy. Finding
 * the elements by what they are instead survives both.
 *
 * What deliberately stays is the lesson's own <header>: it carries the
 * difficulty badge, the LeetCode reference, the problem statement disclosure,
 * the approach switcher and the complexity for the selected approach. */
function stripFrameChrome(doc) {
  doc.querySelectorAll("aside, footer").forEach((el) => el.setAttribute("data-cv-hidden", ""));

  // Hide the auth links themselves rather than the strip that holds them: the
  // same strip carries "Hide solutions", which is a real reading control.
  doc.querySelectorAll('a[href$="/login"], a[href$="/signup"]')
    .forEach((el) => el.setAttribute("data-cv-hidden", ""));

  // "← All chapters" / "← all tracks" go nowhere once clicks are intercepted.
  doc.querySelectorAll("a").forEach((anchor) => {
    if (/^←?\s*all (tracks|chapters)$/i.test(anchor.textContent?.trim() || "")) {
      anchor.setAttribute("data-cv-hidden", "");
    }
  });

  // The note tracks put a branded masthead above the chapter. Remove the strip
  // it sits in, not just the wordmark, or an empty bar is left behind — but
  // never a strip carrying "Hide solutions".
  const brand = [...doc.querySelectorAll("a")]
    .find((a) => /^chai\s*visual$/i.test((a.textContent || "").replace(/\s+/g, " ").trim()));
  if (brand) {
    let row = brand;
    while (row.parentElement && row.parentElement !== doc.body
           && row.parentElement.offsetHeight <= 110) {
      row = row.parentElement;
    }
    const keeps = /hide solutions/i.test(row.textContent || "");
    (keeps ? brand : row).setAttribute("data-cv-hidden", "");
  }

  // The feedback tab is a fixed-position button pinned to the right edge.
  // Require `position: fixed` so no ordinary prose mentioning it is caught.
  const view = doc.defaultView;
  doc.querySelectorAll("button, a, div").forEach((el) => {
    if (el.hasAttribute("data-cv-hidden")) return;
    const text = el.textContent || "";
    if (text.length > 40 || !/feedback/i.test(text)) return;
    if (view?.getComputedStyle(el).position === "fixed") {
      el.setAttribute("data-cv-hidden", "");
    }
  });

  // The mirror's own light/dark switch: the app's theme drives the frame, and
  // a switch in here would leave the two disagreeing.
  doc.querySelectorAll('button[aria-label^="Switch to light mode"], button[aria-label^="Switch to dark mode"]')
    .forEach((el) => el.setAttribute("data-cv-hidden", ""));

  // Anything still pointing off-site — legal pages, pricing, the marketing
  // home — is dead weight in an embedded reader and leaks the reader out.
  doc.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href") || "";
    const offsite = /^https?:\/\//.test(href) && !href.includes("dsa.chaicode.com");
    const legal = /\/(privacy|terms|pricing|refund|about|contact)\b/i.test(href);
    if (offsite || legal) anchor.setAttribute("data-cv-hidden", "");
  });
}

/* Next renders the lesson after hydration, so a single pass on load can run
   against a half-built tree. Re-running over the first few seconds catches
   whatever arrived late; each pass is idempotent. The palette is retried on
   the same beat in case the module holding it evaluated late. */
function settleFrame(doc, win) {
  let tries = 0;
  const tick = () => {
    try {
      stripFrameChrome(doc);
      patchFramePalette(win);
    } catch { /* frame navigated away */ }
    if (++tries < 12) setTimeout(tick, 250);
  };
  tick();
}

/** The mirror path a raw in-frame href points at, or "" when it leaves the course. */
export function lessonPathFromHref(raw) {
  if (/^https?:\/\//.test(raw) && !raw.includes("dsa.chaicode.com")) return "";
  return raw
    .replace(/^https?:\/\/dsa\.chaicode\.com/, "")
    .replace(new RegExp(`^${CV_BASE_PATH}`), "")
    .replace(/^\//, "")
    .replace(/\.html$/, "")
    .split("?")[0]
    .split("#")[0];
}

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "CANVAS", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "IFRAME"]);
const BLOCK_TAGS = new Set(["P", "DIV", "SECTION", "ARTICLE", "HEADER", "LI", "TR", "UL", "OL", "TABLE", "BLOCKQUOTE", "DETAILS", "SUMMARY", "FIGURE", "DD", "DT"]);

/**
 * The lesson in a framed document as light Markdown — headings kept as `#`
 * lines so the AI tutor can read one section at a time, code as fenced
 * blocks, the animation canvases and controls left out.
 */
export function frameLessonMarkdown(doc) {
  const root = doc?.querySelector("main") || doc?.body;
  if (!root) return "";
  const out = [];
  const walk = (node) => {
    if (node.nodeType === 3) { out.push(node.nodeValue.replace(/\s+/g, " ")); return; }
    if (node.nodeType !== 1 || SKIP_TAGS.has(node.tagName.toUpperCase()) || node.hasAttribute("data-cv-hidden") || node.getAttribute("aria-hidden") === "true") return;
    const tag = node.tagName.toUpperCase();
    const heading = /^H([1-4])$/.exec(tag);
    if (heading) { out.push(`\n\n${"#".repeat(Number(heading[1]))} ${node.textContent.replace(/\s+/g, " ").trim()}\n\n`); return; }
    if (tag === "PRE") { out.push(`\n\n\`\`\`\n${node.textContent.trim()}\n\`\`\`\n\n`); return; }
    if (tag === "BR") { out.push("\n"); return; }
    if (tag === "LI") out.push("\n- ");
    node.childNodes.forEach(walk);
    if (BLOCK_TAGS.has(tag)) out.push("\n");
  };
  walk(root);
  return out.join("")
    .split("\n").map((line) => line.trim()).join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function VisualLessonFrame({
  path,
  title,
  dark,
  onNavigate,
  onLoaded,
  onDocument,
  className = "",
  compact = false,
}) {
  const frameRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const darkRef = useRef(dark);
  darkRef.current = dark;
  const navigateRef = useRef(onNavigate);
  navigateRef.current = onNavigate;
  const loadedRef = useRef(onLoaded);
  loadedRef.current = onLoaded;
  const documentRef = useRef(onDocument);
  documentRef.current = onDocument;

  useEffect(() => { setLoading(true); setLocked(false); }, [path, reloadKey]);

  // The mirror reads its theme once, on mount, so a switch reloads the frame.
  // (`themeKey` joins the iframe's key; the first render seeds it in place.)
  const [themeKey, setThemeKey] = useState(() => { seedMirrorTheme(dark); return dark ? "dark" : "light"; });
  useEffect(() => {
    const next = dark ? "dark" : "light";
    if (next === themeKey) return;
    seedMirrorTheme(dark);
    setThemeKey(next);
    setLoading(true);
  }, [dark, themeKey]);

  /* Recolour as early as possible: the palette module evaluates while the page
     is still loading, and patching it before hydration paints means the first
     animation frame is already in the hub's colours rather than flashing the
     mirror's orange. Stops at load, where onFrameLoad takes over. */
  useEffect(() => {
    let alive = true;
    let tries = 0;
    const poll = () => {
      if (!alive) return;
      try {
        const win = frameRef.current?.contentWindow;
        const doc = frameRef.current?.contentDocument;
        if (win && doc && win.location.pathname.endsWith(`${path}.html`)) {
          applyFrameTheme(doc, darkRef.current);
          if (patchFramePalette(win)) return;
        }
      } catch { /* cross-origin during navigation */ }
      if (++tries < 200) window.setTimeout(poll, 30);
    };
    poll();
    return () => { alive = false; };
  }, [path, reloadKey, themeKey]);

  const onFrameLoad = useCallback(() => {
    setLoading(false);
    const doc = (() => {
      try { return frameRef.current?.contentDocument || null; } catch { return null; }
    })();
    if (!doc) return;
    const win = doc.defaultView;

    if (!doc.getElementById("cv-embed-style")) {
      const style = doc.createElement("style");
      style.id = "cv-embed-style";
      style.textContent = FRAME_CHROME_CSS;
      doc.head?.appendChild(style);
    }
    applyFrameTheme(doc, darkRef.current);
    patchFramePalette(win);
    settleFrame(doc, win);

    const isLocked = LOCKED_MARK.test(doc.body?.innerText || "");
    setLocked(isLocked);

    // Next's router owns click handling on its own <Link>s, and by this point
    // their hrefs are origin-absolute — following one would leave the mount
    // and land in the host app. Capture-phase on the frame's window runs
    // before React's delegated listener, so the navigation never reaches it.
    if (!doc.__cvLinkGuard) {
      doc.__cvLinkGuard = true;
      win?.addEventListener("click", (event) => {
        const anchor = event.target?.closest?.("a[href]");
        if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey) return;
        const raw = anchor.getAttribute("href") || "";
        if (raw.startsWith("#") || raw.startsWith("mailto:")) return;
        event.preventDefault();
        event.stopPropagation();
        const target = lessonPathFromHref(raw);
        if (target && getLesson(target)) navigateRef.current?.(target);
      }, true);
    }

    documentRef.current?.(doc);
    if (!isLocked) loadedRef.current?.(path);
  }, [path]);

  useEffect(() => () => documentRef.current?.(null), []);

  return (
    <div className={`vlf${compact ? " is-compact" : ""} ${className}`.trim()}>
      {locked && (
        <div className="vlf-locked" role="status">
          <span className="vlf-locked-icon"><Lock size={20} /></span>
          <strong>This lesson is still locked</strong>
          <p>The mirror holds the paywall screen for this page rather than the lesson. Re-run <code>node scripts/fetch_chaivisual_content.mjs</code> while signed in to capture it.</p>
          <button type="button" className="vlf-btn" onClick={() => setReloadKey((key) => key + 1)}><RefreshCw size={13} /> Try again</button>
        </div>
      )}
      <div className="vlf-frame-wrap" hidden={locked}>
        {loading && <div className="vlf-loading"><WanderingEyesLoader size={20} label="Loading lesson…" block showLabel /></div>}
        <iframe
          key={`${path}:${reloadKey}:${themeKey}`}
          ref={frameRef}
          className="vlf-frame"
          src={`${CV_BASE_PATH}/${path}.html`}
          title={title || "Visual lesson"}
          onLoad={onFrameLoad}
        />
      </div>
    </div>
  );
}

/** Imperative reload for hosts with their own toolbar: bump `key` on the frame. */
export const useFrameReload = () => {
  const [key, setKey] = useState(0);
  return [key, () => setKey((value) => value + 1)];
};
