/**
 * Documents for the coach's sandboxed artifacts (HTML pages and React
 * components), rendered in an <iframe sandbox="allow-scripts"> via srcdoc —
 * the way Claude artifacts run: an opaque origin (no access to the app, its
 * storage or cookies), no network except script/style CDNs, no forms, popups
 * or top navigation.
 *
 * Every document gets:
 *   - a CSP <meta> as the first thing in <head>
 *   - a tiny reporter that posts its height and any uncaught error to the
 *     parent, tagged with a per-frame token so other frames can't spoof it
 *   - zero-specificity base styles for the current theme (author styles win)
 *
 * Pure (string in, string out) so it can be unit-tested.
 */

export const CDN_HOSTS = ["https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://unpkg.com"];
const TAILWIND = "https://cdn.tailwindcss.com/3.4.16";

export const SANDBOX_CSP = [
  "default-src 'none'",
  `script-src 'unsafe-inline' 'unsafe-eval' ${CDN_HOSTS.join(" ")} https://cdn.tailwindcss.com`,
  `style-src 'unsafe-inline' ${CDN_HOSTS.join(" ")} https://fonts.googleapis.com`,
  `font-src data: ${CDN_HOSTS.join(" ")} https://fonts.gstatic.com`,
  "img-src data: blob: https:",
  "media-src data: blob:",
  "connect-src 'none'",
  "frame-src 'none'",
  "form-action 'none'",
  "base-uri 'none'",
].join("; ");

const THEMES = {
  dark: { bg: "#0f0f10", text: "#e7e9ee", muted: "#8d93a1", scheme: "dark" },
  light: { bg: "#ffffff", text: "#252a3c", muted: "#788395", scheme: "light" },
};

const escapeAttr = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function headExtras({ token, theme }) {
  const colors = THEMES[theme] || THEMES.dark;
  const reporter = `(function(){var T=${JSON.stringify(token)};function post(m){try{m.__dcx=T;parent.postMessage(m,"*")}catch(e){}}
function size(){var d=document.documentElement,b=document.body;post({type:"height",height:Math.ceil(Math.max(d.scrollHeight,b?b.scrollHeight:0))})}
window.addEventListener("error",function(e){post({type:"error",message:String((e&&e.message)||e)+(e&&e.lineno?" (line "+e.lineno+")":"")})});
window.addEventListener("unhandledrejection",function(e){post({type:"error",message:"Unhandled promise rejection: "+String(e&&e.reason&&(e.reason.message||e.reason))})});
window.__dcxReport=function(m){post({type:"error",message:String(m)})};
window.addEventListener("load",function(){size();try{new ResizeObserver(size).observe(document.documentElement)}catch(e){setInterval(size,500)}});
document.addEventListener("DOMContentLoaded",size)})();`;
  return `<meta http-equiv="Content-Security-Policy" content="${escapeAttr(SANDBOX_CSP)}">
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="${colors.scheme}">
<style>:where(html){color-scheme:${colors.scheme}}:where(body){margin:0;padding:16px;background:${colors.bg};color:${colors.text};font:14px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}:where(a){color:#4a8bf7}</style>
<script>${reporter}</script>`;
}

/**
 * A model-written HTML page (a whole document or a fragment) made safe to
 * run: the CSP and reporter go first inside <head>.
 */
export function buildHtmlDocument(source, { token = "", theme = "dark" } = {}) {
  const html = String(source || "");
  const extras = headExtras({ token, theme });
  if (/<head[\s>]/i.test(html)) return html.replace(/<head(\s[^>]*)?>/i, (match) => `${match}\n${extras}`);
  if (/<html[\s>]/i.test(html)) return html.replace(/<html(\s[^>]*)?>/i, (match) => `${match}\n<head>${extras}</head>`);
  const doctype = /^\s*<!doctype[^>]*>/i.exec(html);
  const body = doctype ? html.slice(doctype[0].length) : html;
  return `<!doctype html>\n<html><head>${extras}</head><body>\n${body}\n</body></html>`;
}

/* ── React components ───────────────────────────────────────────────────── */

/** Modules a React artifact may import, and the UMD builds that provide them. */
export const REACT_LIBRARIES = {
  react: { global: "React" },
  "react-dom": { global: "ReactDOM" },
  "react-dom/client": { global: "ReactDOM" },
  reactflow: { global: "__dcxReactFlow", scripts: ["https://cdn.jsdelivr.net/npm/reactflow@11.11.4/dist/umd/index.js"], styles: ["https://cdn.jsdelivr.net/npm/reactflow@11.11.4/dist/style.css"] },
  "@xyflow/react": { global: "__dcxReactFlow", alias: "reactflow" },
  d3: { global: "d3", scripts: ["https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"] },
  "lucide-react": { global: "LucideReact", scripts: ["https://cdn.jsdelivr.net/npm/lucide-react@0.460.0/dist/umd/lucide-react.min.js"] },
  recharts: { global: "Recharts", scripts: ["https://cdn.jsdelivr.net/npm/prop-types@15.8.1/prop-types.min.js", "https://cdn.jsdelivr.net/npm/recharts@2.12.7/umd/Recharts.min.js"] },
};
const BASE_SCRIPTS = [
  "https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.4/babel.min.js",
];

const IMPORT_RE = /^[ \t]*import\s+(?:([\w$]+)\s*,?\s*)?(?:\*\s+as\s+([\w$]+))?\s*(?:\{([\s\S]*?)\})?\s*(?:from\s+)?["']([^"']+)["'];?[ \t]*$/gm;

/**
 * Rewrites ES imports of the allowed modules to reads of their UMD globals,
 * drops CSS imports, and strips `export` so the component can be evaluated
 * as a plain script. Returns { code, modules, entry } or throws on an
 * unsupported import.
 */
export function transformComponentSource(source) {
  const modules = new Set();
  const unsupported = [];
  let code = String(source || "").replace(IMPORT_RE, (match, defaultName, namespace, named, from) => {
    if (/\.css$/.test(from)) return "";
    const library = REACT_LIBRARIES[from];
    if (!library) { unsupported.push(from); return ""; }
    modules.add(library.alias || from);
    const global = `window.${library.global}`;
    const lines = [];
    if (defaultName) lines.push(`const ${defaultName} = (${global} && ${global}.default) || ${global};`);
    if (namespace) lines.push(`const ${namespace} = ${global};`);
    if (named && named.trim()) {
      const bindings = named.split(",").map((part) => part.trim()).filter(Boolean).map((part) => part.replace(/^type\s+/, "").replace(/\s+as\s+/, ": "));
      lines.push(`const { ${bindings.join(", ")} } = ${global};`);
    }
    return lines.join(" ");
  });
  if (unsupported.length) {
    throw new Error(`Only these imports are available in a React artifact: ${Object.keys(REACT_LIBRARIES).join(", ")}. Not available: ${[...new Set(unsupported)].join(", ")}.`);
  }

  let entry = "";
  code = code
    .replace(/^[ \t]*export\s+default\s+function\s+([\w$]+)/m, (match, name) => { entry = name; return `function ${name}`; })
    .replace(/^[ \t]*export\s+default\s+class\s+([\w$]+)/m, (match, name) => { entry = name; return `class ${name}`; })
    .replace(/^[ \t]*export\s+default\s+([\w$]+)\s*;?[ \t]*$/m, (match, name) => { entry = name; return ""; })
    .replace(/^[ \t]*export\s+default\s+/m, () => { entry = "__DcxDefault"; return "const __DcxDefault = "; })
    .replace(/^[ \t]*export\s+(?=(?:const|let|var|function|class)\s)/gm, "");
  if (!entry) entry = /\bfunction\s+App\s*\(/.test(code) || /\b(?:const|let)\s+App\s*=/.test(code) ? "App" : (code.match(/\bfunction\s+([A-Z][\w$]*)\s*\(/) || [])[1] || "";
  if (!entry) throw new Error("The component needs a default export (e.g. `export default function App() { … }`).");
  return { code, modules: [...modules], entry };
}

/** A React component artifact, compiled in the frame by Babel standalone. */
export function buildReactDocument(source, { token = "", theme = "dark" } = {}) {
  let transformed;
  let failure = "";
  try {
    transformed = transformComponentSource(source);
  } catch (error) {
    failure = error.message;
    transformed = { code: "", modules: [], entry: "" };
  }
  const libraries = transformed.modules.map((name) => REACT_LIBRARIES[name]).filter(Boolean);
  const scripts = [...BASE_SCRIPTS, ...libraries.flatMap((library) => library.scripts || [])];
  const styles = libraries.flatMap((library) => library.styles || []);
  const tailwind = /className\s*=/.test(String(source || ""));
  // Babel's own output runs inside new Function so a compile error is reported, not thrown silently.
  const runner = `(function(){
  var src = document.getElementById("dcx-source").textContent;
  window.react = window.React;
  if (window.ReactFlow) window.__dcxReactFlow = Object.assign({}, window.ReactFlow, { ReactFlow: window.ReactFlow.default || window.ReactFlow.ReactFlow });
  var failure = ${JSON.stringify(failure)};
  if (failure) { window.__dcxReport(failure); document.body.innerHTML = '<pre style="white-space:pre-wrap;color:#f25e60">' + failure.replace(/</g, "&lt;") + "</pre>"; return; }
  try {
    var out = Babel.transform(src, { presets: [["typescript", { isTSX: true, allExtensions: true }], ["react", { runtime: "classic" }]], filename: "artifact.tsx" }).code;
    // React / ReactDOM are globals here; the component may also declare its own bindings for them.
    var Component = new Function(out + "\\n;return typeof ${transformed.entry || "undefined"} !== 'undefined' ? ${transformed.entry || "undefined"} : undefined;")();
    if (!Component) throw new Error("The component's default export wasn't found.");
    ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Component));
  } catch (error) {
    window.__dcxReport(error && error.message ? error.message : error);
    document.getElementById("root").innerHTML = '<pre style="white-space:pre-wrap;color:#f25e60">' + String(error && error.message || error).replace(/</g, "&lt;") + "</pre>";
  }
})();`;
  // A lucide-react quirk: its UMD build reads the global as lowercase \`react\`.
  const scriptTags = scripts.map((src) => (src.includes("lucide-react") ? `<script>window.react = window.React;</script><script src="${src}"></script>` : `<script src="${src}"></script>`)).join("\n");
  return `<!doctype html>
<html><head>${headExtras({ token, theme })}
${styles.map((href) => `<link rel="stylesheet" href="${href}">`).join("\n")}
${tailwind ? `<script src="${TAILWIND}"></script>` : ""}
${scriptTags}
</head><body><div id="root"></div>
<script type="text/plain" id="dcx-source">${transformed.code.replace(/<\/script/gi, "<\\/script")}</script>
<script>${runner}</script>
</body></html>`;
}

/** Does this HTML look like a page to render (vs. a snippet to read)? */
export const looksRenderable = (source) => /<(!doctype|html|body|head|script|style|svg|canvas|div|section|main)\b/i.test(String(source || ""));
