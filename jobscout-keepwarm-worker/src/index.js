/**
 * jobscout-keepwarm — keeps the Job Scout container on Render from sleeping.
 *
 * Render spins a free web service down after 15 minutes without inbound
 * traffic. Measured on that free instance (512 MB / 0.1 CPU), this image takes
 * **286 seconds** to boot — 35x slower than unthrottled, and far too long to
 * put on a visitor's path. Warm, the same instance answers in under a second,
 * which is fine for a wizard whose real cost is waiting on LLM and job-board
 * APIs. So the whole hosting strategy is simply: never let it go cold.
 *
 * Ten-minute pings keep it up for ~744 hours in the longest month, inside the
 * 750 free instance-hours Render allows per workspace. That budget is the
 * reason Job Scout must stay the only free service in the workspace.
 *
 * TARGET must be the onrender.com hostname, NOT the Vercel domain. Vercel
 * honours upstream cache-control on external rewrites by default (since April
 * 2026), so a ping through the /jobscout/ rewrite could be answered from the
 * CDN and never reach Render at all — the service would sleep while this Worker
 * reported success.
 *
 * /api/config is the endpoint to hit rather than /: it is served by the FastAPI
 * process, so a 200 proves the Python interpreter is alive. nginx binds the port
 * about a second into boot and would answer / long before the agent is ready.
 */

/** A ping that takes longer than this means the service was asleep anyway. */
const PING_TIMEOUT_MS = 20000;

async function ping(target) {
  const res = await fetch(target, {
    signal: AbortSignal.timeout(PING_TIMEOUT_MS),
    // Cloudflare caches nothing by default on subrequests to a non-zone origin,
    // but be explicit: a cached 200 would defeat the entire point of this Worker.
    cf: { cacheTtl: 0, cacheEverything: false },
  });
  return res.status;
}

export default {
  async scheduled(_controller, env, ctx) {
    if (!env.TARGET) {
      console.error("TARGET is not configured; nothing to keep warm");
      return;
    }
    // waitUntil so a slow origin cannot fail the scheduled invocation. There is
    // nothing to retry against — the next tick is only ten minutes away.
    ctx.waitUntil(
      ping(env.TARGET)
        .then(status => {
          // A cold start returns 502 from Render's edge while the container
          // boots. That is expected right after a deploy and self-corrects.
          if (status !== 200) console.warn(`keep-warm ping: HTTP ${status}`);
        })
        .catch(err => console.warn(`keep-warm ping failed: ${err.message}`)),
    );
  },

  /**
   * Manual check: `curl https://jobscout-keepwarm.<subdomain>.workers.dev`.
   * Only useful for confirming the Worker can reach Render at all — the cron
   * handler above is what actually does the work.
   */
  async fetch(_request, env) {
    if (!env.TARGET) return new Response("TARGET not configured\n", { status: 500 });
    try {
      const status = await ping(env.TARGET);
      return new Response(`origin returned ${status}\n`, { status: 200 });
    } catch (err) {
      return new Response(`origin unreachable: ${err.message}\n`, { status: 502 });
    }
  },
};
