/**
 * Editorial helpers for the coach, shared by its tools and the @ menu. Pure,
 * so they can be unit-tested.
 */

/** The editorial's approaches, for tuf problems and Code Lab ones alike. */
export function editorialApproaches(detail) {
  const approaches = (detail?.extras?.approaches || []).filter((item) => item && typeof item === "object" && item.name);
  if (approaches.length) return approaches;
  if (detail?.solution) return [{ name: "Reference solution", body: detail.approach || "", code: detail.solution }];
  return [];
}

const APPROACH_WORDS = [
  ["brute", /brute|naive/i],
  ["better", /better/i],
  ["optimal", /optimal|best/i],
];

/** Pick an approach by "brute" / "better" / "optimal", a name, or an index. */
export function findApproach(approaches, query) {
  if (!approaches.length) return null;
  const wanted = String(query ?? "").trim().toLowerCase();
  if (!wanted) return approaches[approaches.length - 1];
  if (/^\d+$/.test(wanted)) return approaches[Number(wanted) - 1] || null;
  const word = APPROACH_WORDS.find(([key]) => wanted.includes(key));
  return (word && approaches.find((item) => word[1].test(item.name)))
    || approaches.find((item) => item.name.toLowerCase().includes(wanted))
    || (word?.[0] === "optimal" ? approaches[approaches.length - 1] : word?.[0] === "brute" ? approaches[0] : null);
}

export const approachText = (approach) => [
  `Editorial approach: ${approach.name}`,
  approach.body ? approach.body.slice(0, 6000) : "",
  approach.code ? `Reference Python:\n\`\`\`python\n${approach.code.slice(0, 5000)}\n\`\`\`` : "",
].filter(Boolean).join("\n\n");

export const problemText = (detail) => [
  String(detail?.statement || "").slice(0, 7000),
  detail?.constraints ? `Constraints:\n${String(detail.constraints).slice(0, 1500)}` : "",
].filter(Boolean).join("\n\n");
