/**
 * docs-cdn — serves the documentation archives (AgentCore docs & samples,
 * LangChain docs, Strands docs, the guides library) out of R2.
 *
 * Unlike av-cdn-worker, this Worker is reached only via a same-origin Vercel
 * rewrite (vercel.json proxies /agentcore-samples/*, /agentcore/*,
 * /langchain/*, /strands/*, /guides/* here), so there is no browser CORS to
 * handle — the request the browser sees never leaves the app's own origin.
 *
 * Object keys mirror the public/ layout exactly, which is what lets the
 * generated data files (src/data/agentcoreSamplesData.js etc.) keep the
 * root-relative paths they already emit — "/langchain/md/x.md" simply
 * resolves to key "langchain/md/x.md" with no rewriting of that data:
 *   GET /agentcore-samples/<path>
 *   GET /agentcore/<path>
 *   GET /langchain/<path>
 *   GET /strands/<path>
 *   GET /guides/<path>
 *   GET /ai-from-scratch/<path>
 *   GET /datascience/<path>
 *   GET /chai-visual/<path>
 */

const IMMUTABLE = "public, max-age=31536000, immutable";
// Prerendered pages are re-uploaded whenever the mirror is rebuilt, so they
// must revalidate instead of being pinned for a year like the hashed assets.
const REVALIDATE = "public, max-age=0, must-revalidate";
const ALLOWED_PREFIXES = [
  "agentcore-samples/",
  "agentcore/",
  "langchain/",
  "strands/",
  "guides/",
  "ai-from-scratch/",
  "datascience/",
  "chai-visual/",
];

// Both course mirrors are prerendered SPAs whose routers address routes without
// a file extension, while every route on disk is a .html file.
const HTML_ROUTED_PREFIXES = ["datascience/", "chai-visual/"];

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }

    const url = new URL(request.url);

    let key;
    try {
      key = decodeURIComponent(url.pathname.slice(1));
    } catch {
      return new Response("Bad Request", { status: 400 });
    }

    if (!key || key.endsWith("/") || key.includes("..")) {
      return new Response("Not Found", { status: 404 });
    }
    if (!ALLOWED_PREFIXES.some((p) => key.startsWith(p))) {
      return new Response("Not Found", { status: 404 });
    }

    const cache = caches.default;
    const cached = await cache.match(request);
    if (cached) return cached;

    let object = await env.DOCS_BUCKET.get(key, {
      onlyIf: request.headers,
      range: request.headers,
    });

    // Both course mirrors address lessons without a file extension, but on disk
    // each route is a .html file. Vercel's rewrite forwards the extension-less
    // URL verbatim, so resolve it here the way a static host would.
    if (object === null && !key.includes(".")
        && HTML_ROUTED_PREFIXES.some((p) => key.startsWith(p))) {
      key = `${key}.html`;
      object = await env.DOCS_BUCKET.get(key, { onlyIf: request.headers });
    }

    if (object === null) {
      return new Response("Not Found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    if (!headers.has("cache-control")) {
      headers.set("cache-control", key.endsWith(".html") ? REVALIDATE : IMMUTABLE);
    }

    const hasBody = "body" in object;
    let status = hasBody ? 200 : 304;

    if (hasBody && object.range && request.headers.has("range")) {
      status = 206;
      const { offset = 0, length = object.size - offset } = object.range;
      headers.set("content-range", `bytes ${offset}-${offset + length - 1}/${object.size}`);
    }

    const response = new Response(hasBody ? object.body : null, { status, headers });

    if (status === 200) {
      ctx.waitUntil(cache.put(request, response.clone()));
    }

    return response;
  },
};
