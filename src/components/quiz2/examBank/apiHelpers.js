/**
 * Fetches a URL and parses it as JSON, but reads the body as text first so
 * a non-JSON response (e.g. a platform-level crash page instead of our own
 * res.status(500).json({...})) produces a clear error message instead of
 * an opaque "Unexpected token '<'... is not valid JSON" SyntaxError.
 */
export async function safeFetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    const snippet = text.replace(/\s+/g, " ").trim().slice(0, 140);
    throw new Error(
      res.ok
        ? "Received an unexpected (non-JSON) response from the server."
        : `Server error (HTTP ${res.status}): ${snippet || "no response body"}`
    );
  }

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}
