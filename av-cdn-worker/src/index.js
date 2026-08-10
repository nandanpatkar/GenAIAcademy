/**
 * av-cdn — serves the Analytics Vidhya archive (markdown + images) out of R2.
 *
 * Why this exists rather than a public bucket: R2's built-in `pub-*.r2.dev`
 * address is rate-limited by Cloudflare and documented as development-only.
 * A Worker with a private bucket binding has no such limit, needs no domain,
 * and keeps the bucket itself closed to the internet.
 *
 * URL shape mirrors the object keys exactly:
 *   GET /av/md/<slug>.md
 *   GET /av/img/<slug>/<n>.webp
 *   GET /av/img/<slug>/hero.webp
 *
 * Caching note: `caches.default` is a no-op on *.workers.dev — Cloudflare only
 * enables Cache API operations on custom domains. The code below is written to
 * work either way, so attaching a domain later turns on edge caching with no
 * change here. Until then, repeat views are served by the *browser* cache via
 * the immutable Cache-Control we set at upload time, which is the bulk of it.
 */

const IMMUTABLE = "public, max-age=31536000, immutable";

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      if (request.method === "OPTIONS") return preflight(request, env);
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD, OPTIONS" },
      });
    }

    const url = new URL(request.url);

    // Object keys are stored without a leading slash. decodeURIComponent is
    // needed because slugs are long and some contain percent-encoded chars.
    let key;
    try {
      key = decodeURIComponent(url.pathname.slice(1));
    } catch {
      return new Response("Bad Request", { status: 400 });
    }

    if (!key || key.endsWith("/") || key.includes("..")) {
      return new Response("Not Found", { status: 404 });
    }

    // Only ever expose the archive prefix, even if other things land in the
    // bucket later.
    if (!key.startsWith("av/")) {
      return new Response("Not Found", { status: 404 });
    }

    const cache = caches.default;
    const cached = await cache.match(request);
    if (cached) return withCors(cached, request, env);

    const object = await env.AV_BUCKET.get(key, {
      // Lets the browser's If-None-Match / If-Modified-Since turn into a 304,
      // and lets <video> seek without pulling the whole file.
      onlyIf: request.headers,
      range: request.headers,
    });

    if (object === null) {
      return withCors(new Response("Not Found", { status: 404 }), request, env);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers); // Content-Type, Content-Encoding, etc.
    headers.set("etag", object.httpEtag);
    if (!headers.has("cache-control")) headers.set("cache-control", IMMUTABLE);

    // `body` is absent when the conditional request matched (304/412) or on a
    // HEAD — R2 signals that by omitting the property rather than nulling it.
    const hasBody = "body" in object;
    let status = hasBody ? 200 : 304;

    if (hasBody && object.range && request.headers.has("range")) {
      status = 206;
      const { offset = 0, length = object.size - offset } = object.range;
      headers.set(
        "content-range",
        `bytes ${offset}-${offset + length - 1}/${object.size}`,
      );
    }

    const response = new Response(hasBody ? object.body : null, { status, headers });

    // 206 and 304 must not be written to cache.
    if (status === 200) {
      ctx.waitUntil(cache.put(request, response.clone()));
    }

    return withCors(response, request, env);
  },
};

function allowedOrigin(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin) return null; // <img>/<video> loads — no CORS needed at all

  const list = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (list.includes(origin)) return origin;

  // Vercel preview deployments get a fresh hostname per commit, so match on
  // suffix rather than pinning every one of them.
  const suffix = env.ALLOWED_ORIGIN_SUFFIX;
  if (suffix) {
    try {
      if (new URL(origin).hostname.endsWith(suffix)) return origin;
    } catch {
      /* malformed Origin — fall through to denial */
    }
  }
  return null;
}

function withCors(response, request, env) {
  const origin = allowedOrigin(request, env);
  if (!origin) return response;

  // Response from cache.match() is immutable, so rebuild rather than mutate.
  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", origin);
  headers.append("vary", "Origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function preflight(request, env) {
  const origin = allowedOrigin(request, env);
  if (!origin) return new Response(null, { status: 403 });
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "GET, HEAD, OPTIONS",
      "access-control-allow-headers": "Range, If-None-Match, If-Modified-Since",
      "access-control-max-age": "86400",
      vary: "Origin",
    },
  });
}
