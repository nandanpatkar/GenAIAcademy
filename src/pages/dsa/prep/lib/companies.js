// Company preparation, built only from interview experiences people shared.
// Numbers are counts of reports with their sample size — never presented as
// the probability that something will be asked.

export const companyKey = (name) => String(name || "").trim().toLowerCase().replace(/\s+/g, " ");

export function aggregateCompanies(posts) {
  const companies = new Map();
  posts
    .filter((post) => post.type === "experience" && post.status === "published" && post.experience?.company)
    .forEach((post) => {
      const exp = post.experience;
      const key = companyKey(exp.company);
      const entry = companies.get(key) || { key, name: exp.company.trim(), reports: 0, roles: new Map(), outcomes: {}, topics: new Map(), problems: new Map(), rounds: new Map(), difficulty: [], months: [], posts: [] };
      entry.reports += 1;
      entry.roles.set(exp.role.trim(), (entry.roles.get(exp.role.trim()) || 0) + 1);
      entry.outcomes[exp.outcome || "undisclosed"] = (entry.outcomes[exp.outcome || "undisclosed"] || 0) + 1;
      if (exp.difficulty) entry.difficulty.push(exp.difficulty);
      if (exp.month) entry.months.push(exp.month);
      // A topic or problem counts once per report, however many rounds mention it.
      const topicsHere = new Set();
      const problemsHere = new Set();
      (exp.rounds || []).forEach((round) => {
        entry.rounds.set(round.type, (entry.rounds.get(round.type) || 0) + 1);
        (round.topics || []).forEach((topic) => topicsHere.add(topic.trim().toLowerCase()));
        (round.problems || []).forEach((slug) => problemsHere.add(slug));
      });
      topicsHere.forEach((topic) => entry.topics.set(topic, (entry.topics.get(topic) || 0) + 1));
      problemsHere.forEach((slug) => entry.problems.set(slug, (entry.problems.get(slug) || 0) + 1));
      entry.posts.push(post);
      companies.set(key, entry);
    });

  return [...companies.values()].map((entry) => ({
    ...entry,
    roles: [...entry.roles.entries()].sort((a, b) => b[1] - a[1]),
    topics: [...entry.topics.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    problems: [...entry.problems.entries()].sort((a, b) => b[1] - a[1]),
    rounds: [...entry.rounds.entries()].sort((a, b) => b[1] - a[1]),
    avgDifficulty: entry.difficulty.length ? entry.difficulty.reduce((sum, value) => sum + value, 0) / entry.difficulty.length : null,
    latest: entry.months.sort().at(-1) || null,
    confidence: entry.reports >= 10 ? "moderate" : entry.reports >= 3 ? "low" : "very low",
  })).sort((a, b) => b.reports - a.reports || a.name.localeCompare(b.name));
}
