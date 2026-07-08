/**
 * api/execute.js — JDoodle code execution proxy (Vercel serverless)
 *
 * Keeps JDoodle credentials server-side. The client posts
 * { script, language, versionIndex, stdin } and gets back JDoodle's result.
 *
 * Required Vercel env vars:
 *   JDOODLE_CLIENT_ID
 *   JDOODLE_CLIENT_SECRET
 */

const JDOODLE_URL = "https://api.jdoodle.com/v1/execute";

// Languages we expose in the IDE, with their default JDoodle version index.
const ALLOWED = {
  python3: true,
  nodejs: true,
  java: true,
  cpp17: true,
  cpp: true,
  go: true,
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const clientId = process.env.JDOODLE_CLIENT_ID;
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: "Server not configured",
      details: "JDOODLE_CLIENT_ID / JDOODLE_CLIENT_SECRET are missing in the environment.",
    });
  }

  try {
    // Vercel parses JSON bodies by default; fall back to manual parse if needed.
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body || "{}");
    body = body || {};

    const { script, language, versionIndex = "0", stdin = "" } = body;

    if (!script || typeof script !== "string") {
      return res.status(400).json({ error: "Missing 'script'" });
    }
    if (!language || !ALLOWED[language]) {
      return res.status(400).json({ error: `Unsupported language: ${language}` });
    }
    if (script.length > 200_000) {
      return res.status(413).json({ error: "Script too large (200KB limit)" });
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
      // Surface JDoodle's error (e.g. daily limit reached) without leaking creds.
      return res.status(jdoodleRes.status).json({
        error: data?.error || "Execution service error",
        statusCode: jdoodleRes.status,
      });
    }

    // JDoodle returns { output, statusCode, memory, cpuTime }
    return res.status(200).json({
      output: data.output ?? "",
      statusCode: data.statusCode ?? null,
      memory: data.memory ?? null,
      cpuTime: data.cpuTime ?? null,
    });
  } catch (err) {
    console.error("JDoodle execute error:", err);
    return res.status(500).json({ error: "Execution failed", details: err.message });
  }
}
