/*
 * Cross-Module Practice — the 12 exam-style synthesis questions from the
 * "ADDITIONAL CROSS-MODULE / EXAM-STYLE PRACTICE QUESTIONS" section of
 * CCDV-F_Question_Dump.md.
 *
 * These are short-answer questions in the source: each has a written answer
 * rather than an option set, so they cannot be graded as multiple choice and
 * are NOT part of the scored quiz bank. They are carried here as open-answer
 * review questions (`options: []`), which InlineReviewQuestion renders as a
 * plain "Show answer" reveal.
 *
 * This entry carries no teaching content of its own — it is practice material
 * drawn from the question dump, presented as such.
 */

export const crossModule = {
  id: 'dev-module-cross',
  number: 6,
  title: 'Cross-Module Practice',
  shortTitle: 'Cross-Module Practice',
  summary:
    'Twelve exam-style synthesis questions spanning all five modules. Practice material, not teaching content.',
  duration: '~20 min',
  lede: 'These questions cut across module boundaries the way the exam does. Each is short-answer rather than multiple choice, so they are here for self-check rather than in the scored quiz.',
  objectives: [],

  sections: [
    {
      id: 'dev-cross-about',
      eyebrow: 'About this set',
      title: 'How to use these',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'The five modules each teach one layer. These twelve questions ask you to reach across layers, which is the shape the certification exam favours.',
        },
        {
          type: 'callout',
          variant: 'note',
          title: 'Where these come from',
          body: [
            'These are transcribed from the "Additional cross-module / exam-style practice questions" section of the CCDV-F question dump. In the source they are short-answer questions with a written answer, not multiple-choice items.',
            'Because there is no option set to grade against, they are not part of the scored Quiz. Read the question, answer it in your head or on paper, then reveal the answer to compare.',
          ],
        },
        {
          type: 'p',
          text: 'The scored Quiz covers the 109 multiple-choice questions from Modules 1 through 5. Use that for a graded attempt and these for synthesis practice.',
        },
      ],
    },
  ],

  /* Open-answer: no `options`, so the reveal shows `answer` instead of a verdict. */
  reviewQuestions: [
    {
      id: 'dev-x-1',
      ref: 'X1',
      question:
        "You're building an agent where each tool call's output feeds directly into constructing the next tool call's arguments. Should these run in parallel or sequential?",
      options: [],
      answer:
        'Sequential — this is a genuine subtask dependency; the second call cannot be built until the first result returns. Use separate turns, or `disable_parallel_tool_use` if needed.',
    },
    {
      id: 'dev-x-2',
      ref: 'X2',
      question:
        'Your eval score holds steady at 7.2/10 average after a prompt change. Should you consider the change validated?',
      options: [],
      answer:
        'Not necessarily — check the per-case breakdown. A steady average can hide a change that fixed three cases and broke three others; the average conceals this while per-case results reveal it immediately.',
    },
    {
      id: 'dev-x-3',
      ref: 'X3',
      question:
        'An agent needs to remember a coding convention across every session in a project, regardless of what task is being run. Where does this belong?',
      options: [],
      answer:
        'CLAUDE.md (always-on, unconditional) — NOT a Skill (which loads only on-demand/description-match) and not a rules file (which is path-scoped).',
    },
    {
      id: 'dev-x-4',
      ref: 'X4',
      question:
        'A tool description reads "use this to retrieve data." What\'s wrong, and what\'s the fix?',
      options: [],
      answer:
        'It\'s too vague to disambiguate from other retrieval tools — Claude will guess. Fix: rewrite with a specific trigger AND an exclusion condition, e.g., "use this to retrieve the current balance for a specific account ID; do not use this for transaction history."',
    },
    {
      id: 'dev-x-5',
      ref: 'X5',
      question:
        'True or False: A hook enforces a rule more reliably than the same rule written into CLAUDE.md.',
      options: [],
      answer:
        'True — a hook fires deterministically at its lifecycle event regardless of what the model decides; a CLAUDE.md instruction can be followed inconsistently, especially as the file grows and dilutes.',
    },
    {
      id: 'dev-x-6',
      ref: 'X6',
      question:
        'Your orchestrator-worker research agent costs 15x a single-chat baseline on a task that turned out to be a single lookup. What\'s the fix?',
      options: [],
      answer:
        'Route: use a cheap classifier to detect single-lookup queries and send them through a single agent / fetch-once path; reserve orchestrator-worker for genuinely parallel-decomposable tasks.',
    },
    {
      id: 'dev-x-7',
      ref: 'X7',
      question:
        'You need EU-only data residency for a customer. Is the first-party Claude API guaranteed to satisfy this?',
      options: [],
      answer:
        "No — the first-party API's EU regional coverage should be confirmed at build time; EU-only residency typically requires Bedrock or Vertex AI.",
    },
    {
      id: 'dev-x-8',
      ref: 'X8',
      question:
        'A PR you submitted works perfectly for you but has sat unreviewed for three weeks. What three things are most likely missing?',
      options: [],
      answer:
        "A runnable example, a test proving the behavior, and a short statement of environment assumptions — a maintainer can't verify what they'd have to reverse-engineer.",
    },
    {
      id: 'dev-x-9',
      ref: 'X9',
      question:
        "What's the practical difference between `defer_loading` and `enabled` on an `mcp_toolset` config?",
      options: [],
      answer:
        '`defer_loading` delays WHEN a tool definition loads into context (a context-cost control); `enabled` decides WHETHER the model sees a given tool at all (a governance/scope control). They\'re often used together.',
    },
    {
      id: 'dev-x-10',
      ref: 'X10',
      question:
        'A subagent is delegated a task and it fails to apply a project-specific coding convention from CLAUDE.md. Why?',
      options: [],
      answer:
        "If it's a built-in Explore/Plan subagent, it skips CLAUDE.md and git status by design (optimized for fast/cheap research). Use a general-purpose or custom subagent (with rules explicitly loaded) when project constraints must be respected.",
    },
    {
      id: 'dev-x-11',
      ref: 'X11',
      question:
        "Why is caching a customer's live account balance in a long-lived prompt cache breakpoint risky?",
      options: [],
      answer:
        'Cache reuse assumes the cached content is still correct — a value that can change (like live account state) may be served stale for as long as the cache lives. Stable, unchanging content (system prompts, tool schemas) is the safe target.',
    },
    {
      id: 'dev-x-12',
      ref: 'X12',
      question:
        "A dev sets `max_attempts=5` with `time.sleep(0)` between retries on a 429. What's wrong?",
      options: [],
      answer:
        'No actual backoff — each instant retry counts as another request against the same rate limit and deepens it rather than waiting for it to clear. Needs exponential backoff (ideally honoring `retry-after`) with a cap.',
    },
  ],
};
