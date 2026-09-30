// Buganizer: a personal issue tracker. Reports are private to this device;
// exporting one produces redacted Markdown suitable for a public tracker.

export const SEVERITIES = [
  { id: "low", label: "Low", hint: "Cosmetic or minor" },
  { id: "medium", label: "Medium", hint: "Something is wrong but there's a workaround" },
  { id: "high", label: "High", hint: "Blocks a problem or feature" },
  { id: "critical", label: "Critical", hint: "Data loss or wrong verdicts" },
];

export const AREAS = ["Problem statement", "Test cases / judge", "Editorial or solution", "Planner", "Review queue", "Notes / lists", "SQL practice", "Aptitude tests", "Community", "Other"];

export const STATUSES = [
  { id: "new", label: "New" },
  { id: "triaged", label: "Triaged" },
  { id: "investigating", label: "Investigating" },
  { id: "fixed", label: "Fixed" },
  { id: "verified", label: "Verified" },
  { id: "closed", label: "Closed" },
  { id: "duplicate", label: "Duplicate" },
  { id: "wontfix", label: "Won't fix" },
];

// Allowed moves. Closed states can always be reopened to "triaged".
export const TRANSITIONS = {
  new: ["triaged", "duplicate", "wontfix", "closed"],
  triaged: ["investigating", "duplicate", "wontfix"],
  investigating: ["fixed", "wontfix", "triaged"],
  fixed: ["verified", "investigating"],
  verified: ["closed", "investigating"],
  closed: ["triaged"],
  duplicate: ["triaged"],
  wontfix: ["triaged"],
};

export const OPEN_STATUSES = new Set(["new", "triaged", "investigating", "fixed"]);

const SECRET_PARAMS = /^(token|access_token|id_token|refresh_token|code|key|apikey|api_key|secret|password|pass|auth|session|sig|signature|jwt)$/i;

/**
 * Strip credentials, secret-looking query parameters and fragments from a URL
 * before it is stored in a report. Non-URLs come back unchanged but trimmed.
 */
export function sanitizeUrl(raw) {
  const value = String(raw || "").trim();
  if (!value) return "";
  let url;
  try { url = new URL(value); } catch { return value.slice(0, 300); }
  url.username = "";
  url.password = "";
  [...url.searchParams.keys()].forEach((key) => { if (SECRET_PARAMS.test(key)) url.searchParams.set(key, "[redacted]"); });
  url.hash = /token|key|secret|auth/i.test(url.hash) ? "" : url.hash;
  return url.toString();
}

export function canTransition(from, to) {
  return (TRANSITIONS[from] || []).includes(to);
}

export function applyTransition(bug, to, { note = "", duplicateOf = null, now = new Date().toISOString() } = {}) {
  if (!canTransition(bug.status, to)) throw new Error(`Can't move a ${bug.status} report to ${to}.`);
  if (to === "duplicate" && !duplicateOf) throw new Error("Pick the report this duplicates.");
  return {
    ...bug,
    status: to,
    duplicateOf: to === "duplicate" ? duplicateOf : bug.duplicateOf,
    updatedAt: now,
    timeline: [...bug.timeline, { kind: "status", from: bug.status, to, note: note.trim(), at: now }],
  };
}

export function bugToMarkdown(bug) {
  const lines = [
    `# ${bug.title}`,
    "",
    `- **Area:** ${bug.area}`,
    `- **Severity (reporter):** ${bug.severity}`,
    `- **Status:** ${bug.status}`,
    bug.url ? `- **Where:** ${bug.url}` : null,
    bug.environment ? `- **Environment:** ${bug.environment}` : null,
    "",
    "## Steps to reproduce",
    bug.steps || "_Not provided_",
    "",
    "## Expected",
    bug.expected || "_Not provided_",
    "",
    "## Actual",
    bug.actual || "_Not provided_",
  ];
  return lines.filter((line) => line !== null).join("\n");
}
