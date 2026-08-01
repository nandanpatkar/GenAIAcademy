/**
 * Vercel/serverless endpoint that keeps GEMINI_API_KEY out of the browser.
 * It creates a one-use, short-lived credential for Gemini Live API sessions.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured on the server.",
    });
  }

  try {
    const now = Date.now();
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1alpha/auth_tokens",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          uses: 1,
          // The browser must start the session shortly after requesting a token.
          newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
          // Limit an active practice session to 30 minutes.
          expireTime: new Date(now + 30 * 60 * 1000).toISOString(),
        }),
      },
    );

    const payload = await response.json();
    if (!response.ok) {
      console.error("Gemini ephemeral-token error", payload);
      return res.status(response.status).json({
        error: payload?.error?.message || "Unable to create a Gemini Live token.",
      });
    }

    return res.status(200).json({ token: payload.name });
  } catch (error) {
    console.error("Gemini token endpoint error", error);
    return res.status(500).json({ error: "Unable to contact the Gemini API." });
  }
}
