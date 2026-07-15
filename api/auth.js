// ─── Local-only auth stub for the embedded AFFiNE editor ────────────────────
// The editor's client checks login state via REST endpoints (not GraphQL):
//   GET /api/auth/session  → { user: null } when signed out
//   GET /api/auth/methods  → available auth methods (login page only)
// Without these, fetchSession() calls res.json() on a 404 HTML page, which
// throws and propagates out of getSession() (only UNSUPPORTED_CLIENT_VERSION
// is caught there). We run in local-workspace-only mode, so both endpoints
// just report "signed out" in valid JSON.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const rawUrl = req.url || '';

  if (rawUrl.includes('/api/auth/methods')) {
    res.statusCode = 200;
    res.end(JSON.stringify({ password: false, magicLink: false, oauth: [] }));
    return;
  }

  // Default: /api/auth/session
  res.statusCode = 200;
  res.end(JSON.stringify({ user: null }));
}
