// Every collection the prep sections persist, in one place, so export/import
// and reset know the full set. Values are suffixes under `dsa_prep_v1:`.
export const KEYS = {
  lastProblem: "practice.lastProblem", // { id, title, at } — the Home page's "continue"
  attempts: "practice.attempts", // { [slug]: { attempts, accepted, acceptedDays[], lastVerdict, lastAt, firstAcceptedAt } }
  submissions: "practice.submissions", // [{ id, slug, verdict, passed, total, code, provider, at }]
  enrollments: "learn.enrollments", // { [trackId]: { trackId, version, requiredSlugs, enrolledAt } }
  articlesRead: "learn.articlesRead", // { [file]: isoDate }
  review: "review.cards", // { [slug]: card }
  reviewSettings: "review.settings",
  ledger: "rewards.ledger", // append-only [{ id, ruleId, ruleVersion, sourceKey, points, at, day }]
  scorecards: "rewards.scorecards", // imported peers
  planner: "planner.state",
  notes: "spaces.notes",
  lists: "spaces.lists",
  codespace: "spaces.codespace",
  bugs: "spaces.bugs",
  playground: "devtools.playground",
  sqlProgress: "sql.progress",
  sqlDrafts: "sql.drafts",
  aptitude: "aptitude.sessions",
  posts: "community.posts",
  postDraft: "community.draft",
  votes: "community.votes",
  reports: "community.reports",
  aifsQuiz: "aifs.quiz", // { [slug]: { attempts, best, total, lastRatio, lastAt, passedAt } }
  aifsLast: "aifs.last", // { slug, title, phase, track, at } — for Today's "continue"
  visualLast: "visual.last", // { path, title, group, track, at } — for Today's "continue watching"
  profile: "account.profile",
  dismissed: "account.dismissedNotifications",
};
