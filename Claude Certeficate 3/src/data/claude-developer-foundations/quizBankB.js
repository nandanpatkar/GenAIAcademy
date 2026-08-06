/*
 * CCDV-F quiz bank, part B — Modules 3, 4 and 5 (65 questions).
 * See quizBankA.js for the transcription and rationale-sourcing notes.
 */

const derived = 'derived';

export const quizBankB = [
  /* ========== MODULE 3 — Claude Code, MCP & Integration (23) ========== */
  {
    id: 'D-Q3.1',
    ref: 'Q3.1',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'What does plan mode do in the explore/plan/code loop?',
    options: [
      { id: 'A', text: 'Auto-approves all edits' },
      {
        id: 'B',
        text: 'Holds Claude Code in the read-only explore phase, blocking edits/commands until you release it',
      },
      { id: 'C', text: 'Skips the explore phase entirely' },
      { id: 'D', text: 'Only works with MCP servers' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Plan mode is a useful default for unfamiliar codebases or high-stakes work, because it blocks all file edits and shell commands until you approve a plan.',
  },
  {
    id: 'D-Q3.2',
    ref: 'Q3.2',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question:
      'Which permission mode auto-approves reads, file edits, and common filesystem commands (mkdir, rm, mv, etc.) but ONLY inside the working directory?',
    options: [
      { id: 'A', text: 'default' },
      { id: 'B', text: 'acceptEdits' },
      { id: 'C', text: 'bypassPermissions' },
      { id: 'D', text: 'dontAsk' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'acceptEdits scopes auto-approval to paths inside the working directory; protected paths still prompt, and all other shell commands are still gated.',
  },
  {
    id: 'D-Q3.3',
    ref: 'Q3.3',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'In `bypassPermissions` mode, which of the following is true?',
    options: [
      { id: 'A', text: 'It still prompts before destructive shell commands' },
      {
        id: 'B',
        text: 'It removes all prompts including the protected-path guard the other modes keep — only catastrophic commands like `rm -rf /` trigger a last-resort prompt',
      },
      { id: 'C', text: "It's safe on any developer workstation" },
      { id: 'D', text: "It's the recommended default for new projects" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'bypassPermissions is only appropriate inside an isolated container or VM where the environment is disposable. Never on a developer workstation against a live codebase.',
  },
  {
    id: 'D-Q3.4',
    ref: 'Q3.4',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'A deny rule and an allow rule both apply to the same action. What wins?',
    options: [
      { id: 'A', text: 'Allow always wins' },
      { id: 'B', text: 'Deny always wins, regardless of mode' },
      { id: 'C', text: 'Whichever was set most recently' },
      { id: 'D', text: 'The narrower rule wins' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A deny rule always wins over an allow rule, regardless of the mode in effect — including when a bypass mode is set.',
  },
  {
    id: 'D-Q3.5',
    ref: 'Q3.5',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'Where should an org-wide deny rule live so no individual developer can override it?',
    options: [
      { id: 'A', text: '`.claude/settings.local.json`' },
      { id: 'B', text: '`~/.claude/settings.json`' },
      { id: 'C', text: 'Enterprise-level `managed-settings.json`' },
      { id: 'D', text: '`.claude/settings.json` in the repo' },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'Enterprise-level settings cannot be overridden by users or project files, which makes an enterprise deny rule the most durable governance control.',
  },
  {
    id: 'D-Q3.6',
    ref: 'Q3.6',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'The single governing question for where to place a human review gate is:',
    options: [
      { id: 'A', text: 'How long did the task take?' },
      { id: 'B', text: 'What is the worst outcome if this action runs without a person checking it?' },
      { id: 'C', text: 'Does the user trust the agent?' },
      { id: 'D', text: 'Is the file under version control?' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The lower the cost of being wrong, the more you can let through. The higher the cost, and the harder it is to undo, the more a step needs a human gate before it executes.',
  },
  {
    id: 'D-Q3.7',
    ref: 'Q3.7',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'What does a CLAUDE.md file do?',
    options: [
      { id: 'A', text: 'Loads only when explicitly invoked by name' },
      { id: 'B', text: 'Is prepended to context at the start of every session, unconditionally' },
      { id: 'C', text: 'Only applies to subagents' },
      { id: 'D', text: 'Replaces the need for a system prompt' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Every convention, constraint, and command in CLAUDE.md is present from the first prompt of every session, without you having to re-state it.',
  },
  {
    id: 'D-Q3.8',
    ref: 'Q3.8',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: "What's the main failure mode of a CLAUDE.md file?",
    options: [
      { id: 'A', text: "It can't hold code examples" },
      {
        id: 'B',
        text: 'Size — every added line dilutes the weight of every other line, including the one rule that matters',
      },
      { id: 'C', text: 'It only works with Opus' },
      { id: 'D', text: "It can't reference file paths" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A larger file makes any single instruction a smaller fraction of what loads, which reduces the chance the agent follows the one rule that catches a real mistake.',
  },
  {
    id: 'D-Q3.9',
    ref: 'Q3.9',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'A rules file in `.claude/rules/` with no `paths` field in its frontmatter:',
    options: [
      { id: 'A', text: 'Never loads' },
      {
        id: 'B',
        text: 'Loads unconditionally at launch, same priority as CLAUDE.md, regardless of subdirectory placement',
      },
      { id: 'C', text: 'Only loads for subagents' },
      { id: 'D', text: 'Requires a hook to trigger it' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The scoping comes from the frontmatter, not from file placement. Subdirectory structure inside .claude/rules/ is organizational only.',
  },
  {
    id: 'D-Q3.10',
    ref: 'Q3.10',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'Which hook event can actually BLOCK a tool call before it executes?',
    options: [
      { id: 'A', text: 'PostToolUse' },
      { id: 'B', text: 'PreToolUse (exit code 2 blocks it)' },
      { id: 'C', text: 'SessionEnd' },
      { id: 'D', text: 'Notification' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Because it runs first, a PreToolUse hook can examine the tool call and exit with code 2 to block it, writing the reason to stderr as feedback the agent sees.',
  },
  {
    id: 'D-Q3.11',
    ref: 'Q3.11',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: "Why can't PostToolUse block an action?",
    options: [
      { id: 'A', text: "It's disabled by default" },
      { id: 'B', text: 'It fires after the tool call has already completed' },
      { id: 'C', text: 'It only applies to reads' },
      { id: 'D', text: 'It requires a different config file' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Since the call has already happened, PostToolUse is the right place for automated side effects: formatting after an edit, triggering tests, or logging for an audit trail.',
  },
  {
    id: 'D-Q3.12',
    ref: 'Q3.12',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'Do the built-in Explore and Plan subagents load CLAUDE.md and git status?',
    options: [
      { id: 'A', text: 'Yes, always' },
      {
        id: 'B',
        text: 'No — they skip both to stay fast/cheap; use general-purpose or a custom subagent if project rules must apply',
      },
      { id: 'C', text: 'Only Explore does' },
      { id: 'D', text: 'Only if a hook forces it' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'They are optimized for speed, so project-level rules and repository state defined in CLAUDE.md are not in their context when they run. The general-purpose subagent loads both.',
  },
  {
    id: 'D-Q3.13',
    ref: 'Q3.13',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question:
      'What\'s the recommended, current format for both explicit and automatic workflow invocation in Claude Code?',
    options: [
      { id: 'A', text: 'The legacy `.claude/commands/` directory' },
      {
        id: 'B',
        text: 'Skills (invoked via `/skill-name` or loaded automatically on description match)',
      },
      { id: 'C', text: 'Only CLAUDE.md instructions' },
      { id: 'D', text: 'Environment variables' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The older `.claude/commands/` format still works but is legacy. Use skills with `disable-model-invocation: true` when you want a workflow that only runs when you explicitly call it.',
  },
  {
    id: 'D-Q3.14',
    ref: 'Q3.14',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'How are plugin commands namespaced?',
    options: [
      { id: 'A', text: "They're never namespaced and can collide" },
      { id: 'B', text: "The plugin's name becomes the prefix (e.g., `/payments:run-tests`)" },
      { id: 'C', text: 'Alphabetically by install order' },
      { id: 'D', text: "By the user's OS username" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'This is why two plugins can both ship a run-tests command without colliding. Treat the plugin name as part of the interface, since renaming the plugin renames every command it ships.',
  },
  {
    id: 'D-Q3.15',
    ref: 'Q3.15',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question:
      "A skill's SKILL.md references an absolute path like `/Users/alexmorgan/projects/deploy-utils/validate.sh`. What's the problem?",
    options: [
      { id: 'A', text: "Nothing, as long as the author's machine still exists" },
      { id: 'B', text: 'It only resolves on the author\'s machine — breaks for every teammate after install' },
      { id: 'C', text: 'Absolute paths are always faster' },
      { id: 'D', text: 'It only affects Windows machines' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The install still succeeds everywhere, but execution fails everywhere except the author’s own setup, because that directory exists on no other machine.',
  },
  {
    id: 'D-Q3.16',
    ref: 'Q3.16',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question:
      "What's the correct variable to reference a script bundled inside a plugin itself (not just the project)?",
    options: [
      { id: 'A', text: '`$HOME`' },
      { id: 'B', text: '`${CLAUDE_PLUGIN_ROOT}`' },
      { id: 'C', text: '`$PWD`' },
      { id: 'D', text: '`${CLAUDE_PROJECT_DIR}` only' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Use `$CLAUDE_PROJECT_DIR` for scripts stored in the project and `${CLAUDE_PLUGIN_ROOT}` for scripts bundled inside the plugin itself, so the path resolves no matter whose machine runs it.',
  },
  {
    id: 'D-Q3.17',
    ref: 'Q3.17',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'An MCP tool permission rule is scoped using what naming pattern?',
    options: [
      { id: 'A', text: '`tool.server.name`' },
      { id: 'B', text: '`mcp__server__tool`' },
      { id: 'C', text: '`server:tool`' },
      { id: 'D', text: '`@server/tool`' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'This is how you connect a broad server but keep the agent inside a narrow slice of what it can do. A deny on one tool overrides an allow on the server.',
  },
  {
    id: 'D-Q3.18',
    ref: 'Q3.18',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'What transport should a locally-run, personal MCP server use?',
    options: [
      { id: 'A', text: 'HTTP' },
      { id: 'B', text: 'SSE' },
      { id: 'C', text: 'stdio' },
      { id: 'D', text: 'WebSocket' },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'stdio runs the server as a local subprocess and communicates through standard input and output. It does not work for a server you want to share across your team or host remotely.',
  },
  {
    id: 'D-Q3.19',
    ref: 'Q3.19',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'A committed `.mcp.json` should NEVER contain:',
    options: [
      { id: 'A', text: 'The server URL' },
      { id: 'B', text: 'An inline API key/credential value' },
      { id: 'C', text: 'The transport type' },
      { id: 'D', text: 'The scope setting' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A token written directly into a committed file enters repository history and cannot be removed by overwriting the file in a later commit. Put the value in an environment variable and reference the variable.',
  },
  {
    id: 'D-Q3.20',
    ref: 'Q3.20',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question:
      "What's the two-layer defense against an agent accidentally writing a credential inline to a committed config file?",
    options: [
      { id: 'A', text: 'Just a strongly worded comment in the file' },
      {
        id: 'B',
        text: 'A CLAUDE.md convention instruction + a PreToolUse hook that blocks credential-looking patterns in writes to that file',
      },
      { id: 'C', text: 'Deleting the file after each session' },
      { id: 'D', text: 'Using bypassPermissions mode' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The CLAUDE.md instruction communicates the intent; the hook enforces it deterministically regardless of what the model decides. An instruction alone can be followed inconsistently as the file grows.',
  },
  {
    id: 'D-Q3.21',
    ref: 'Q3.21',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question:
      "Why doesn't rotating a leaked API key alone fully fix the problem if the key was ever committed?",
    options: [
      { id: 'A', text: 'It does fully fix it' },
      {
        id: 'B',
        text: "The key remains in repository history — overwriting the file in a later commit doesn't remove it from history",
      },
      { id: 'C', text: 'Rotation always breaks other services' },
      { id: 'D', text: "Git doesn't support rotation" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Any credential written inline in a committed file must be treated as compromised. Rotation is necessary, but the exposure in history remains, which is why the value should never have entered the file.',
  },
  {
    id: 'D-Q3.22',
    ref: 'Q3.22',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question: 'OAuth redirect URIs are registered:',
    options: [
      { id: 'A', text: 'Globally, once, for all environments' },
      { id: 'B', text: 'Per host — a working staging registration does NOT cover production' },
      { id: 'C', text: 'Only for stdio servers' },
      { id: 'D', text: 'Automatically by Claude Code' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The OAuth provider only accepts redirect URIs you have explicitly registered. Include the registration step in the deployment checklist so it is not discovered at the first production sign-in attempt.',
  },
  {
    id: 'D-Q3.23',
    ref: 'Q3.23',
    source: 'original',
    moduleId: 'dev-module-3',
    domainId: 'claude-code-mcp',
    question:
      'For regulated enterprise customers, staging and production OAuth app registrations should typically be:',
    options: [
      { id: 'A', text: 'The exact same app registration' },
      {
        id: 'B',
        text: 'Separate app registrations per environment, as many enterprise security policies require',
      },
      { id: 'C', text: 'Never used together' },
      { id: 'D', text: 'Shared across all customers' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Most enterprise customers require separate OAuth app registrations for each environment as part of their security policy; using one across environments is a second issue a reviewer would flag.',
  },

  /* ===== MODULE 4 — Production Engineering, Evals & Security (25) ===== */
  {
    id: 'D-Q4.1',
    ref: 'Q4.1',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question:
      'What are the four decisions a design document should state before production code is written?',
    options: [
      { id: 'A', text: 'Budget, timeline, team size, stakeholders' },
      { id: 'B', text: 'Success criteria, failure handling, cost/latency budget, trust boundary' },
      { id: 'C', text: 'Model choice, prompt text, tool list, deployment date' },
      { id: 'D', text: 'API version, SDK version, region, currency' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Every production layer is based on those four: the success criteria become the eval cases, the failures become the retriable/terminal paths, the budget becomes what you instrument against, and the trust boundary becomes what you gate with a hook.',
  },
  {
    id: 'D-Q4.2',
    ref: 'Q4.2',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question: 'Which grading method is correct for a task with exactly one correct label/value?',
    options: [
      { id: 'A', text: 'LLM-as-judge' },
      { id: 'B', text: 'Exact/string match' },
      { id: 'C', text: 'Code-graded check' },
      { id: 'D', text: 'Human review only' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'It is the cheapest grader and the most brittle. It is the right tool only when there is exactly one correct answer with zero ambiguity, and the wrong tool anytime the output can be phrased more than one way.',
  },
  {
    id: 'D-Q4.3',
    ref: 'Q4.3',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question:
      'Which grading method is correct for validating that output is parseable JSON with required fields, regardless of exact content?',
    options: [
      { id: 'A', text: 'Exact/string match' },
      { id: 'B', text: 'Code-graded check' },
      { id: 'C', text: 'LLM-as-judge only' },
      { id: 'D', text: "None — this can't be automated" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The output does not have to match a fixed string, only satisfy a rule. A code grader is often just a parse attempt: if it parses it scores well, if it throws it scores zero.',
  },
  {
    id: 'D-Q4.4',
    ref: 'Q4.4',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question: 'Why does an LLM-as-judge need to be calibrated before you trust its scores?',
    options: [
      { id: 'A', text: "It isn't necessary — judges are accurate by default" },
      {
        id: 'B',
        text: 'Without measuring agreement against human-labeled cases, a judge can produce a confident-looking but meaningless number',
      },
      { id: 'C', text: 'Calibration only matters for code graders' },
      { id: 'D', text: "It's a one-time API requirement, not an accuracy issue" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A judge that disagrees with human labels half the time produces a number that looks rigorous but provides no value. If agreement is low, tighten the rubric and re-measure.',
  },
  {
    id: 'D-Q4.5',
    ref: 'Q4.5',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question: 'Why should a judge be asked for strengths/weaknesses/reasoning, not just a raw score?',
    options: [
      { id: 'A', text: "It's required by the API schema" },
      {
        id: 'B',
        text: 'Without reasoning-first, models drift toward a safe middle score (~6) regardless of actual quality',
      },
      { id: 'C', text: 'It reduces token cost' },
      { id: 'D', text: "It's only needed for code-graded checks" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Asking the judge for reasoning first is what anchors the score to something specific rather than to a safe default.',
  },
  {
    id: 'D-Q4.6',
    ref: 'Q4.6',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question:
      'A team ran a feature through a dozen manually-picked examples, all passed, and shipped. Two weeks later it failed on a message containing two dates. What was the actual root cause?',
    options: [
      { id: 'A', text: 'A bug in the model' },
      {
        id: 'B',
        text: 'No eval/graded set existed — the dozen manual checks all shared the same input shape, so there was no signal the two-date case existed',
      },
      { id: 'C', text: 'Validation was missing entirely' },
      { id: 'D', text: 'The prompt was too long' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Validation was present and every check passed — validation confirms a value is the right shape, not that it is the right value. The missing graded set was the root cause.',
  },
  {
    id: 'D-Q4.7',
    ref: 'Q4.7',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question:
      "Which test level catches a failure where two components each pass their own tests, but the data format they exchange doesn't match?",
    options: [
      { id: 'A', text: 'Unit test' },
      { id: 'B', text: 'Functional test' },
      { id: 'C', text: 'Integration test' },
      { id: 'D', text: "None — this can't be tested" },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'This is where most silent failures hide, because each side can pass its own tests while the handoff between them is broken.',
  },
  {
    id: 'D-Q4.8',
    ref: 'Q4.8',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question: 'What does a trace add that a failing eval score alone does not?',
    options: [
      { id: 'A', text: 'A lower score' },
      { id: 'B', text: 'Which specific step in the pipeline produced the bad result' },
      { id: 'C', text: 'A cost estimate' },
      { id: 'D', text: 'A retry mechanism' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Without a trace, a failed eval tells you something is wrong but not where. This is the difference between a five-minute fix and a day spent tracing the workflow by hand.',
  },
  {
    id: 'D-Q4.9',
    ref: 'Q4.9',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question:
      'For a single-fact lookup against a stable, unchanging reference corpus, which retrieval approach is correct?',
    options: [
      { id: 'A', text: 'Agentic/iterative search across many rounds' },
      { id: 'B', text: 'Fetch-once (static retrieval, one pass)' },
      { id: 'C', text: 'Always use both simultaneously' },
      { id: 'D', text: 'Neither — always answer from memory' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Defaulting everything to iterative search inflates cost and latency on questions a single fetch would have answered. For a stable reference corpus queried with simple lookups, the index is worth owning.',
  },
  {
    id: 'D-Q4.10',
    ref: 'Q4.10',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question: 'A 429 response is:',
    options: [
      { id: 'A', text: 'Terminal — never retry' },
      {
        id: 'B',
        text: 'Retriable — clears with time, often via honoring `retry-after` before falling back to exponential backoff',
      },
      { id: 'C', text: 'A model refusal' },
      { id: 'D', text: 'A tool-result error' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A rate limit clears with time, so the same request will probably go through in a moment. Honoring retry-after is more precise than guessing with backoff alone.',
  },
  {
    id: 'D-Q4.11',
    ref: 'Q4.11',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question: 'A 400 (bad request) response is:',
    options: [
      { id: 'A', text: 'Retriable with backoff' },
      { id: 'B', text: 'Terminal — retrying the identical malformed request accomplishes nothing' },
      { id: 'C', text: 'The same as a 429' },
      { id: 'D', text: 'Fixed by adding jitter' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The cause is in the request itself, so time changes nothing. Retrying a terminal error wastes the retry budget and hides the actual problem behind a wall of identical failures.',
  },
  {
    id: 'D-Q4.12',
    ref: 'Q4.12',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question:
      'When you\'re unsure whether an error is retriable or terminal, the safer default is to treat it as:',
    options: [
      { id: 'A', text: 'Retriable, and retry aggressively' },
      {
        id: 'B',
        text: 'Terminal — fails loudly and gets fixed, vs. a wrongly-retriable error hammering a service silently',
      },
      { id: 'C', text: 'Neither — ignore it' },
      { id: 'D', text: 'Always terminal for 5xx errors specifically' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A failure incorrectly classified as terminal fails loudly and gets fixed. A failure incorrectly classified as retriable hammers a service and hides the real problem behind a wall of retries.',
  },
  {
    id: 'D-Q4.13',
    ref: 'Q4.13',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question:
      'What happens if a tool call fails and your code returns an empty result instead of setting `is_error: true`?',
    options: [
      { id: 'A', text: 'Claude automatically retries the tool' },
      {
        id: 'B',
        text: 'Claude treats the empty result as valid data and reasons on top of it, producing a confident but wrong answer',
      },
      { id: 'C', text: 'The API rejects the request' },
      { id: 'D', text: "Nothing — it's equivalent to setting is_error" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A visible failure is far easier to catch than a confident but incorrect answer built on missing data. With is_error set, the model knows the tool failed and can react.',
  },
  {
    id: 'D-Q4.14',
    ref: 'Q4.14',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question: 'A refusal (`stop_reason: "refusal"`) arrives as what HTTP status?',
    options: [
      { id: 'A', text: '400' },
      { id: 'B', text: '429' },
      {
        id: 'C',
        text: '200 — meaning the status-code retriable/terminal classifier alone will NOT catch it',
      },
      { id: 'D', text: '500' },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'A refusal is a content decision, not a transient error, so it must be raised to the caller and logged rather than silently retried or treated as valid output.',
  },
  {
    id: 'D-Q4.15',
    ref: 'Q4.15',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question: 'The default model selection discipline is:',
    options: [
      { id: 'A', text: 'Always start with the most capable model available' },
      {
        id: 'B',
        text: 'Start with Sonnet; move up to Opus only when an eval shows Sonnet missing the bar; move down to Haiku only when an eval shows the drop is acceptable',
      },
      { id: 'C', text: 'Always use Haiku for cost reasons' },
      { id: 'D', text: 'Pick the model that was used in the last project' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Reaching for the most capable model by default is the most common and most expensive model-selection mistake in production. In both directions the eval is the instrument.',
  },
  {
    id: 'D-Q4.16',
    ref: 'Q4.16',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question: 'What are the three metrics you should instrument on every Claude API call in production?',
    options: [
      { id: 'A', text: 'Model name, prompt length, user ID' },
      { id: 'B', text: 'Token usage (input/output), latency, error rate' },
      { id: 'C', text: 'Region, SDK version, retry count only' },
      { id: 'D', text: 'Cost only' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'With three metrics for every call, you can see which step is expensive or slow instead of guessing from a total monthly bill. Treating observability as a later step means the bill arrives before the explanation.',
  },
  {
    id: 'D-Q4.17',
    ref: 'Q4.17',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question:
      "Roughly how much more expensive is an orchestrator-worker (multi-agent) pattern vs. a single chat interaction, per Anthropic's reported internal case?",
    options: [
      { id: 'A', text: '2x' },
      { id: 'B', text: '5x' },
      { id: 'C', text: '~15x' },
      { id: 'D', text: '100x' },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'Every subagent spends its own tokens against its own context. The multiplier applies to both input and output tokens, and compounds further when a subagent misbehaves.',
  },
  {
    id: 'D-Q4.18',
    ref: 'Q4.18',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question: 'When is the orchestrator-worker pattern the WRONG choice?',
    options: [
      { id: 'A', text: 'Broad research across many independent sources' },
      {
        id: 'B',
        text: 'A tightly coupled task like coding, where each step depends on the previous one',
      },
      { id: 'C', text: 'Any task requiring parallel exploration' },
      { id: 'D', text: 'Tasks with independent subtasks' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Where each step depends on the last, the subagents are mostly waiting on each other, so you pay the fan-out cost without getting the parallel benefit.',
  },
  {
    id: 'D-Q4.19',
    ref: 'Q4.19',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question: 'What should be defined FIRST when balancing cost and reliability?',
    options: [
      { id: 'A', text: 'The cost ceiling — reliability is tuned to fit under it' },
      {
        id: 'B',
        text: 'The reliability floor (retry budget, latency ceiling) — cost is then optimized above that floor, not below it',
      },
      { id: 'C', text: "Neither — they're independent" },
      { id: 'D', text: 'Whichever the customer complains about first' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Cost is the louder pressure, showing up on a dashboard every day, while a reliability problem is easy to dismiss as noise. Setting the floor first makes reliability the fixed constraint.',
  },
  {
    id: 'D-Q4.20',
    ref: 'Q4.20',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question:
      'Why does the model treat an instruction hidden inside a fetched web page the same as an instruction from the user?',
    options: [
      { id: 'A', text: "It doesn't — it always distinguishes them" },
      {
        id: 'B',
        text: 'The model reads its entire context as one undifferentiated stream of tokens with no built-in trusted/untrusted marker',
      },
      { id: 'C', text: 'Only if the page uses white text' },
      { id: 'D', text: 'Only on older models' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Your system prompt, the user’s message, and the fetched content are all just text in one sequence. There is no structural marker that says "these tokens are trusted and those are not."',
  },
  {
    id: 'D-Q4.21',
    ref: 'Q4.21',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question:
      'Why doesn\'t "we only work with trusted internal users" solve the prompt injection problem?',
    options: [
      { id: 'A', text: 'It does solve it completely' },
      {
        id: 'B',
        text: "The hostile instruction typically arrives through fetched/retrieved CONTENT, not the user's own prompt — trusting the user doesn't touch that vector",
      },
      { id: 'C', text: 'Internal users are always malicious' },
      { id: 'D', text: 'It only matters for external-facing apps' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Any content the agent reads that someone else can write is a vector: a shared-drive document, a database record, an email body, or a tool result that itself fetched somewhere else.',
  },
  {
    id: 'D-Q4.22',
    ref: 'Q4.22',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question: 'What is the actual reliable boundary against prompt injection, per this module?',
    options: [
      { id: 'A', text: 'Wording the prompt more carefully' },
      {
        id: 'B',
        text: 'What the agent is ALLOWED TO DO as a result of untrusted text — i.e., the action boundary, enforced via least privilege + hooks',
      },
      { id: 'C', text: 'Adding more delimiters only' },
      { id: 'D', text: "Increasing the model's temperature" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Delimiters and model training raise the bar but remain probabilistic. Defending the wording of a single prompt does not generalize; defending the action boundary does.',
  },
  {
    id: 'D-Q4.23',
    ref: 'Q4.23',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question: 'Why is least privilege called "a design principle, not a configuration setting"?',
    options: [
      { id: 'A', text: "It's just a philosophical preference" },
      {
        id: 'B',
        text: "It's the control that holds even when every other defense (training, classifiers, delimiters) fails — it bounds the severity of a steered action",
      },
      { id: 'C', text: "It doesn't actually affect security outcomes" },
      { id: 'D', text: 'It only applies to MCP servers' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'If the identity can write anywhere and read every secret, the injection is an incident. If it can write to one output directory, the same injection is a denied action and a log entry.',
  },
  {
    id: 'D-Q4.24',
    ref: 'Q4.24',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question:
      'What precedence order applies when multiple hooks/permission rules could apply to the same action?',
    options: [
      { id: 'A', text: 'Allow > ask > deny' },
      { id: 'B', text: 'Deny > ask > allow' },
      { id: 'C', text: 'Whichever fired first' },
      { id: 'D', text: 'Ask > deny > allow' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A single deny rule blocks the action regardless of how many allow rules are also present. That ordering is what makes the hook a real boundary rather than a best-effort check.',
  },
  {
    id: 'D-Q4.25',
    ref: 'Q4.25',
    source: 'original',
    moduleId: 'dev-module-4',
    domainId: 'production-evals-security',
    question:
      "What's the \"residual control\" that holds even when a hook is missing, misconfigured, or bypassed?",
    options: [
      { id: 'A', text: 'A stronger system prompt' },
      {
        id: 'B',
        text: 'OS-level sandboxing (filesystem/network isolation enforced by the operating system, not application logic)',
      },
      { id: 'C', text: 'A second LLM judge' },
      { id: 'D', text: 'Increasing the retry budget' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Hooks must explicitly cover the path or endpoint they protect. Because OS-level isolation is enforced by the operating system rather than application logic, it holds even when a rule is missing.',
  },

  /* ========== MODULE 5 — Accelerators and IP Contribution (17) ========== */
  {
    id: 'D-Q5.1',
    ref: 'Q5.1',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question:
      'What\'s the defining difference between "a template that runs" and "a template packaged for reuse"?',
    options: [
      { id: 'A', text: 'There is no difference' },
      {
        id: 'B',
        text: 'A packaged template has customer-specific values pulled into parameters with documented defaults, documented assumptions, and a bundled eval',
      },
      { id: 'C', text: 'A packaged template is always shorter' },
      { id: 'D', text: 'Packaging just means adding comments' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'These are different finishing states. The warning signs of the first are no parameters, no documented assumptions, and no bundled eval proving the asset still works elsewhere.',
  },
  {
    id: 'D-Q5.2',
    ref: 'Q5.2',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question:
      'Which asset type\'s packaging requirement is "document each tool input and let the installing team set the scope, so it installs without code edits"?',
    options: [
      { id: 'A', text: 'Agent template' },
      { id: 'B', text: 'MCP Server Package' },
      { id: 'C', text: 'Eval Suite' },
      { id: 'D', text: 'None of these' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'An MCP Server Package bundles the tools the server exposes with their inputs and the scope the installing team controls, so the server installs into a new environment without code edits.',
  },
  {
    id: 'D-Q5.3',
    ref: 'Q5.3',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question:
      "Besides proving a feature works, what's the SECOND role of a bundled eval suite mentioned in this module?",
    options: [
      { id: 'A', text: 'It has no second role' },
      {
        id: 'B',
        text: 'It acts as the deployment gate — a new model version must clear the pinned baseline before promotion',
      },
      { id: 'C', text: 'It replaces the need for documentation' },
      { id: 'D', text: "It's only used during the first build" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'This is where the eval stops being a one-time test and becomes the deployment gate: promote or roll back on the result against the pinned baseline.',
  },
  {
    id: 'D-Q5.4',
    ref: 'Q5.4',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question: 'The Claude Cookbook is designed for:',
    options: [
      { id: 'A', text: 'Full multi-component applications, UI included' },
      { id: 'B', text: 'Self-contained, focused single- or multi-pattern reference implementations' },
      { id: 'C', text: 'Only bug fixes' },
      { id: 'D', text: 'Internal company use only' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The repository is set up to review one focused pattern rather than an entire application, so a submission that large does not fit what reviewers are looking for and will stall.',
  },
  {
    id: 'D-Q5.5',
    ref: 'Q5.5',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question: 'What are the four things that make a contribution verifiable by a maintainer?',
    options: [
      { id: 'A', text: 'Good variable names, comments, a README, a license file' },
      {
        id: 'B',
        text: 'The code does one thing, an example shows it running, a test proves it works, a short statement names the assumptions',
      },
      { id: 'C', text: 'Star count, fork count, issue count, PR count' },
      { id: 'D', text: 'Code coverage percentage, CI badge, changelog, versioning' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The bar is set by what the maintainer needs to check, not by how clever the code is. A contribution a reviewer cannot verify sits at the back of the queue.',
  },
  {
    id: 'D-Q5.6',
    ref: 'Q5.6',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question: 'Rights/licensing/attribution checks happen:',
    options: [
      { id: 'A', text: 'After the technical review, if the code is accepted' },
      { id: 'B', text: 'Before the technical review — they gate whether a contribution can be accepted at all' },
      { id: 'C', text: 'Only for MCP servers' },
      { id: 'D', text: 'Only if the maintainer asks' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Code carried in from a customer engagement may have constraints on where it can go. Skipping this is what turns a contribution into a problem the legal team must unwind later.',
  },
  {
    id: 'D-Q5.7',
    ref: 'Q5.7',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question: '"The agent should be fast and accurate" is:',
    options: [
      { id: 'A', text: 'A valid functional requirement' },
      { id: 'B', text: "NOT checkable, so it's not a valid functional requirement" },
      { id: 'C', text: 'A valid infrastructure requirement' },
      { id: 'D', text: 'Both A and C' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A functional requirement names what the system must do, stated with enough detail to check. A vague goal cannot be designed against or verified.',
  },
  {
    id: 'D-Q5.8',
    ref: 'Q5.8',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question: '"Transcript data must be processed within the EU" is:',
    options: [
      { id: 'A', text: 'A functional requirement' },
      { id: 'B', text: 'An infrastructure requirement (residency)' },
      { id: 'C', text: 'A design choice, not a requirement' },
      { id: 'D', text: 'Not something that can be captured before build' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Residency is one of the four infrastructure requirements — alongside latency, scale, and identity — that most often decide the deployment platform.',
  },
  {
    id: 'D-Q5.9',
    ref: 'Q5.9',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question:
      'In the systems lifecycle (Requirements → Design → Build → Test → Deploy → Operate → Iterate), where does "gate promotion on the eval result before a version goes to production" belong?',
    options: [
      { id: 'A', text: 'Test' },
      { id: 'B', text: 'Deploy' },
      { id: 'C', text: 'Design' },
      { id: 'D', text: 'Operate' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Writing the eval suite and rubric is test; gating promotion on its result is deploy.',
  },
  {
    id: 'D-Q5.10',
    ref: 'Q5.10',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question:
      'What\'s the danger of shipping against a model ALIAS (e.g., `"opus"`) instead of a pinned full model ID?',
    options: [
      { id: 'A', text: 'There is no danger — aliases are always safe' },
      {
        id: 'B',
        text: 'The alias can resolve to a new version with no app change, producing a silent production change with no pinned version to roll back to',
      },
      { id: 'C', text: 'Aliases only affect latency, not output' },
      { id: 'D', text: "Aliases are deprecated and won't work at all" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Aliases also resolve differently across deployment platforms. Pin the full model ID and keep the prior version available so a regression is a rollback rather than a hotfix.',
  },
  {
    id: 'D-Q5.11',
    ref: 'Q5.11',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question: 'For Claude Platform on AWS, where does inference actually run?',
    options: [
      { id: 'A', text: "Inside the customer's AWS boundary" },
      {
        id: 'B',
        text: "Anthropic-operated infrastructure, OUTSIDE the AWS boundary, even though it's accessed via the customer's AWS account",
      },
      { id: 'C', text: "On the customer's own GPUs" },
      { id: 'D', text: 'It varies randomly per request' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Claude Platform on AWS uses Anthropic’s own model IDs and lifecycle. That is the distinction from Claude in Amazon Bedrock, where data stays inside the customer’s configured AWS boundary.',
  },
  {
    id: 'D-Q5.12',
    ref: 'Q5.12',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question: 'Why can a lower per-token price still result in a higher total cost on a given platform?',
    options: [
      { id: 'A', text: "It can't — token price is the only cost driver" },
      { id: 'B', text: 'Total cost also includes egress, platform fees, and integration effort' },
      { id: 'C', text: 'Token price and total cost are always identical' },
      { id: 'D', text: 'Only latency affects total cost' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Per-token rates are broadly aligned across platforms; total cost moves on egress, platform fees, and integration effort. Measure total cost per call, not token price alone.',
  },
  {
    id: 'D-Q5.13',
    ref: 'Q5.13',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question:
      "A latency measurement taken from a developer's laptop for a customer in eu-west is:",
    options: [
      { id: 'A', text: 'Always accurate regardless of location' },
      {
        id: 'B',
        text: "Potentially misleading — latency should be measured from the customer's actual region against their actual payload",
      },
      { id: 'C', text: 'Irrelevant to platform choice' },
      { id: 'D', text: 'The industry-standard method' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A measurement from your laptop hides the round-trip penalty that appears once the workload runs where the customer is.',
  },
  {
    id: 'D-Q5.14',
    ref: 'Q5.14',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question:
      'For a regulated financial/healthcare customer, a data residency requirement is typically treated as:',
    options: [
      { id: 'A', text: 'A tradeoff to balance against cost' },
      { id: 'B', text: 'Pass-or-fail, not a tradeoff' },
      { id: 'C', text: 'Irrelevant if latency is good' },
      { id: 'D', text: 'Only relevant post-launch' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Raise the compliance constraint during scoping, or it surfaces at contract review after the work is done — the most expensive place to discover it.',
  },
  {
    id: 'D-Q5.15',
    ref: 'Q5.15',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question:
      "In a multi-component app (API → Claude Code task → MCP server), what determines the application's overall containment?",
    options: [
      { id: 'A', text: 'The average privilege level across all components' },
      {
        id: 'B',
        text: 'The MOST privileged seam — one overly-broad component becomes the weak point even if others are scoped correctly',
      },
      { id: 'C', text: 'The least privileged component only' },
      { id: 'D', text: 'The total number of components' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Scope each component to the least privilege its role in the workflow requires. This is what keeps a steered component from reaching beyond its intended task.',
  },
  {
    id: 'D-Q5.16',
    ref: 'Q5.16',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question:
      'Content fetched by one component in a multi-component app and passed to the next component should be treated as:',
    options: [
      { id: 'A', text: 'Trusted instructions, since it came from your own component' },
      {
        id: 'B',
        text: 'Untrusted data — trust must be explicitly established at each boundary, not inherited from the sending component',
      },
      { id: 'C', text: 'Irrelevant to security since each component was tested individually' },
      { id: 'D', text: 'Automatically safe if the fetching component passed its unit tests' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A component that passes its own tests has no seam-level controls. Every point where data crosses between deployment environments requires an explicit boundary control.',
  },
  {
    id: 'D-Q5.17',
    ref: 'Q5.17',
    source: 'original',
    moduleId: 'dev-module-5',
    domainId: 'accelerators-ip',
    question:
      "When a trust boundary/seam in a multi-component app cannot be secured, what's the correct move?",
    options: [
      { id: 'A', text: 'Ship it anyway and monitor closely' },
      { id: 'B', text: 'Escalate to a human owner rather than shipping around it' },
      { id: 'C', text: 'Disable the seam entirely' },
      { id: 'D', text: 'Add a comment warning future developers' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'When a seam cannot be secured, do not ship around it: escalate to a human owner.',
  },
];
