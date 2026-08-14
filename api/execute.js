/**
 * api/execute.js — code execution proxy (Vercel serverless)
 *
 * Keeps provider credentials server-side. The client posts
 * { script, language, versionIndex, stdin, provider } and gets back the
 * result in a common { output, statusCode, memory, cpuTime } shape.
 * `provider` is "jdoodle" (default) or "hackerearth".
 *
 * Required env vars (add to .env.local for `vercel dev`, and to the Vercel
 * dashboard for production):
 *   JDOODLE_CLIENT_ID
 *   JDOODLE_CLIENT_SECRET
 *   HACKEREARTH_CLIENT_SECRET
 */

import { executeOnHackerEarth } from "./_lib/hackerearth.js";

const JDOODLE_URL = "https://api.jdoodle.com/v1/execute";

const ALLOWED = {
  python3: true,
  nodejs: true,
  java: true,
  cpp17: true,
  cpp: true,
  go: true,
};

// Read and JSON-parse the request body robustly across `vercel dev` and
// production, where req.body may be a parsed object, a string, or an
// unconsumed stream.
async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body || "{}"); } catch { return {}; }
  }
  // Fall back to reading the raw stream.
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = await readBody(req);
    const { script, language, versionIndex = "0", stdin = "", provider = "jdoodle" } = body;

    if (!script || typeof script !== "string") {
      return res.status(400).json({ error: "Missing 'script' in request body" });
    }
    if (!language || !ALLOWED[language]) {
      return res.status(400).json({ error: `Unsupported language: ${language}` });
    }
    if (script.length > 200_000) {
      return res.status(413).json({ error: "Script too large (200KB limit)" });
    }
    if (provider !== "jdoodle" && provider !== "hackerearth") {
      return res.status(400).json({ error: `Unknown provider: ${provider}` });
    }

    if (provider === "hackerearth") {
      const clientSecret = process.env.HACKEREARTH_CLIENT_SECRET;
      if (!clientSecret) {
        return res.status(500).json({
          error: "Server not configured",
          details: "Missing env var HACKEREARTH_CLIENT_SECRET. Add it to .env.local (for `vercel dev`) or the Vercel dashboard, then restart.",
        });
      }
      try {
        const result = await executeOnHackerEarth({ script, language, stdin, clientSecret });
        return res.status(200).json(result);
      } catch (err) {
        return res.status(err.statusCode || 500).json({ error: err.message || "Execution failed" });
      }
    }

    const clientId = process.env.JDOODLE_CLIENT_ID;
    const clientSecret = process.env.JDOODLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      const missing = [
        !clientId && "JDOODLE_CLIENT_ID",
        !clientSecret && "JDOODLE_CLIENT_SECRET",
      ].filter(Boolean).join(", ");
      return res.status(500).json({
        error: "Server not configured",
        details: `Missing env var(s): ${missing}. Add them to .env.local (for \`vercel dev\`) or the Vercel dashboard, then restart.`,
      });
    }

    const jdoodleRes = await fetch(JDOODLE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        clientSecret,
        script,
        language,
        versionIndex: String(versionIndex),
        stdin: String(stdin || ""),
      }),
    });

    const data = await jdoodleRes.json().catch(() => ({}));

    if (!jdoodleRes.ok) {
      return res.status(jdoodleRes.status).json({
        error: data?.error || "Execution service error",
        statusCode: jdoodleRes.status,
      });
    }

    return res.status(200).json({
      output: data.output ?? "",
      statusCode: data.statusCode ?? null,
      memory: data.memory ?? null,
      cpuTime: data.cpuTime ?? null,
    });
  } catch (err) {
    console.error("Execute error:", err);
    return res.status(500).json({ error: "Execution failed", details: err.message });
  }
}
