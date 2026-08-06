/*
 * Developer Module 3 — Claude Code, MCP & Integration.
 * Content transcribed from "MODULE 3_DEV.txt".
 * Multiple-choice checkpoints are carried into `reviewQuestions`; the
 * open-ended cumulative task is preserved inline with its model answer.
 */

const disclaimer = {
  type: 'callout',
  variant: 'disclaimer',
  title: 'Disclaimer / Notice for Educational Content',
  body: [
    "We built this Developer course Module 3: Claude Code, MCP & Integration to help you get real work done with Claude. Treat it as educational content. It doesn't constitute legal, financial, or other professional advice, so adapt what you learn to your own situation. Our products and services evolve quickly, so certain content may contain errors or be outdated; remember to verify on Anthropic's website or docs. Examples and scenarios used in the course are illustrative and often fictitious. If the course material mentions a company or product, it doesn't mean Anthropic endorses them, they endorse Anthropic, or that we're affiliated. Also note your use of Anthropic products and services is covered by our terms, policies and documentation; if anything in this course conflicts with them, they control.",
  ],
};

export const module3 = {
  id: 'dev-module-3',
  number: 3,
  title: 'Claude Code, MCP & Integration',
  shortTitle: 'Claude Code & MCP',
  summary:
    'Permission modes, durable project context, packaging workflows, MCP servers, and enterprise integration.',
  duration: '~1h 45min',
  lede: 'Code that works on your machine, in your session, or in staging now must hold up when someone else runs it, in production, against real company systems.',
  objectives: [
    'Run Claude Code through the explore, plan, and code loop and select a permission mode that matches the risk level of the work, so the agent stays productive without being granted more authority than the task requires.',
    'Read AI-generated code, review output with calibrated trust, and act on the findings that are reliable, verify the ones that are not, and place a human review gate where the cost of a wrong call is high.',
    'Give Claude Code durable project context using CLAUDE.md, rules instruction files, hooks, and subagents.',
    'Package a workflow as skills, custom commands, and a plugin. Author a skill once that runs the same way across Claude Code, the Messages API, and the Agent SDK.',
    'Build an MCP server that makes the tools, resources, and prompts available to Claude, select the transport that matches how the client and server communicate, and set the configuration scope that controls who loads it.',
    'Connect Claude to enterprise systems, authenticate those connections using patterns a regulated customer will accept, and scope a code modernization engagement so the work holds up under a security review.',
  ],

  sections: [
    {
      id: 'dev-m3-orientation',
      eyebrow: 'Orientation',
      duration: '2 min',
      title: 'What you will be able to do by the end',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Claude Code is your terminal-native development partner.',
        },
        {
          type: 'p',
          text: 'In previous modules, you set up essential API components: prompts, tool schemas, context engineering, agent loops, and multimodal ingestion; this module builds directly on that foundation. Claude Code allows you to operate the same model within your terminal environment, introducing a permission layer, configuration system, and team-oriented sharing features. The MCP protocol enables secure integration with external services.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: '“The build” in this module',
          body: [
            'Everything in this module is built around one recurring problem: code that works on your machine, in your session, or in staging now must hold up when someone else runs it, in production, against real company systems.',
            'On your machine the permission mode felt safe, the project rules were small enough to follow, the skill found its script, the credential was right there in the config file, and the connection worked in the staging test. The moment the work leaves your machine, each of those conveniences could become a failure: a permission mode deletes a file that was never in scope, one rule gets buried under hundreds of lines, a skill points at a path that exists on no other machine, a committed key leaks within hours, and a staging-only configuration step takes down the production connection.',
          ],
        },
        disclaimer,
      ],
    },

    {
      id: 'dev-m3-permissions',
      eyebrow: 'Teaching · Permission Modes & Human Gates',
      duration: '17 min',
      title: 'Claude Code agent loop, permission modes, settings, and where a human gate goes',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Claude Code runs the same agent loop in your terminal but adds an additional layer: a permission system that gates every action the agent wants to take.',
        },
        {
          type: 'h',
          level: 3,
          text: 'How Claude Code works through a task: explore, plan, and code',
        },
        {
          type: 'p',
          text: 'When you hand Claude Code a task, it does not start writing immediately. It reads files, traces the relevant logic, and builds a picture of the codebase first; this is the exploration phase. Then, once it understands enough to propose a change, it creates a plan. A plan is a structured description of the edits it intends to make. Only after you review and approve the plan does it move into the code phase, where it writes and executes the changes.',
        },
        {
          type: 'p',
          text: 'This sequence matters for two reasons. First, it produces better output: Claude Code understands the codebase before touching anything, so it makes fewer assumptions and catches more downstream effects. Second, it is where the permission modes plug in: plan mode holds Claude Code in the explore phase, blocking all file edits and shell commands until you release it, making it a useful default for unfamiliar codebases or high-stakes work.',
        },
        { type: 'h', level: 3, text: 'Permission modes: approvals, gates, and constraints' },
        {
          type: 'table',
          caption: 'The six permission modes',
          headers: ['Mode', 'What it auto-approves', 'What it still gates', 'Limitations'],
          rows: [
            [
              'default',
              'Reads only. Prompts before nearly every edit or command.',
              'All file edits and shell commands require confirmation.',
              'Safe but slow on trusted work. The baseline for any new project or unfamiliar codebase.',
            ],
            [
              'acceptEdits',
              'Reads, file edits, and common filesystem commands (mkdir, touch, rm, rmdir, mv, cp, and sed) inside the working directory. Auto-approval is scoped to paths inside the working directory, and protected paths still prompt.',
              'All other shell commands; writes outside the working directory; writes to protected paths.',
              'Trusted local work where shell execution still needs a human eye. Not appropriate if the agent must run scripts.',
            ],
            [
              'plan',
              'Reads only. Research and proposes; makes no edits.',
              'All file edits and shell commands until you approve a plan.',
              'Exploration and planning on sensitive or unfamiliar codebases. Not appropriate for tasks that must write output.',
            ],
            [
              'auto',
              'Everything, but a separate classifier reviews each action first and blocks anything that escalates beyond your request, targets unrecognized infrastructure, or appears driven by hostile or inappropriate content.',
              'Production deploys and migrations, mass deletes, credential exfiltration, and force-push to main are blocked by default.',
              'Reduces prompts but does not guarantee safety; this is a research preview. Availability depends on plan, model version, and admin settings.',
            ],
            [
              'dontAsk',
              'Only tools you pre-approved in an allow rule, plus read-only commands. Auto-DENIES everything else.',
              'Every tool call not on the allow list is denied. There is no queue for confirmation.',
              'Built for locked-down CI and scripts. It restricts well, but it is not a way to reduce friction on local interactive work.',
            ],
            [
              'bypassPermissions',
              'All tool calls. No confirmation prompts and no safety checks.',
              'Nothing in normal operation. The standard permission checks are bypassed; only catastrophic delete commands such as `rm -rf /` and `rm -rf ~` still trigger a last-resort prompt.',
              'Only inside an isolated container or VM where the environment is disposable. Never on a developer workstation against a live codebase.',
            ],
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Where the configuration lives and who it applies to',
        },
        {
          type: 'ul',
          items: [
            '**User level (`~/.claude/settings.json`):** Applies to every project on the machine. The right place for preferences that should follow you everywhere.',
            '**Project level (`.claude/settings.json`, committed to the repo):** Applies to everyone who clones the repository. The right place for team-wide conventions, allow rules, and deny rules for paths that should not be touched.',
            '**Local project level (`.claude/settings.local.json`):** Personal overrides for one project, automatically git-ignored.',
            '**Enterprise level (`managed-settings.json`, set by administrators):** Cannot be overridden by users or project files. The right place for organization-wide security controls.',
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Deny always wins',
          body: [
            'Allow and deny rules layer on top of the selected mode. A deny rule always wins over an allow rule, regardless of the mode in effect. The most durable governance control is an enterprise-level deny rule: it cannot be removed by any individual developer and applies even when a bypass mode is set.',
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Where a human still has to look: placing the review gate by worst-case cost',
        },
        {
          type: 'p',
          text: 'Permission modes and deny rules decide what the agent can do without asking. They do not decide where you, the human, still need to look before an action lands. That decision rests on one question: what is the worst outcome if this action runs without a person checking it?',
        },
        {
          type: 'ul',
          items: [
            '**Let low-stakes, reversible actions through without a gate.** A formatting fix or an edit confined to the working directory carries little cost if it is wrong. This is the case acceptEdits is built for.',
            '**Gate any action that is hard to undo or reaches a sensitive path:** a write outside the working directory, a destructive shell command, or an edit to a security-relevant or protected file. A deny rule enforces this deterministically, and default or plan mode keeps the prompt in place while you decide.',
            '**Never let the agent be the only gate on a change to code your team has marked sensitive.** There the agent’s work is an input to a human decision, not a replacement for one.',
          ],
        },
        {
          type: 'p',
          text: 'The placement of the gate and the choice of permission mode are the same decision viewed from two sides. The mode sets the default for a whole session, and the gate is where you override that default for the one action whose cost is too high to leave to the default.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the bypass mode that removed the one prompt that mattered',
        },
        {
          type: 'quote',
          label: 'The transcript',
          text: 'Dev: "All right, I\'m switching to bypassPermissions for this one. It\'s just renaming old API endpoint references. Nothing risky."\nClaude Code: [Scanning files matching pattern /v1/legacy/ ... 47 files found]\nClaude Code: [Updating endpoint references ...]\nClaude Code: [Running post-rename cleanup.sh script ...]\nClaude Code: [Deleted 3 files matching /v1/legacy/ in /deploy/config/prod/ ...]\nDev: "Wait. What was in /deploy/config/prod/?"\nClaude Code: [Files contained environment-specific endpoint overrides for the production deployment. They have been removed.]\nDev: "That directory wasn\'t supposed to be in scope. I was working on /src/."',
        },
        {
          type: 'p',
          text: 'Note the precise location of the gate: it was the script invocation that would have prompted, not `rm` deletion commands by themselves. acceptEdits auto-approves common filesystem commands, including `rm` on paths inside the working directory. Had Claude issued the deletions directly as `rm` commands, acceptEdits would have let them through silently; only default mode prompts for those.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'What to watch out for',
          body: [
            'A bypass mode silences all confirmation prompts, including the ones you might not have anticipated. bypassPermissions also skips the protected path guard that the other modes keep, so even repo state and Claude’s own configuration lose their automatic prompt.',
            'To cover this gap, set a deny rule on sensitive directories before switching modes. If you want fewer prompts without losing the safety net, use a classifier-gated mode (e.g., auto) instead of a full bypass.',
          ],
        },
        {
          type: 'callout',
          variant: 'note',
          title: 'Cost · Complexity · Risk',
          body: [
            '**Cost:** Running in default mode on trusted work adds prompt latency to every tool call, and this accumulates on a long refactor.',
            '**Complexity:** Multiple levels of settings with an override hierarchy require consistent care. A deny rule at the enterprise level that contradicts an allow rule at the project level needs to be understood by everyone maintaining the config.',
            '**Risk:** Using the wrong mode for the context. A bypass mode set out of impatience on a non-isolated machine removes every safety prompt between the agent and your live files.',
          ],
        },
      ],
    },

    {
      id: 'dev-m3-durable-context',
      eyebrow: 'Teaching · Durable Project Context',
      duration: '20 min',
      title: 'CLAUDE.md, rules files, hooks, and subagents',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'The configuration layer controls what the agent is allowed to do. This cluster builds on top of it: how to configure what the agent knows and how it behaves, so the rules and project context you define in a session are still in effect at the start of the next one.',
        },
        {
          type: 'h',
          level: 3,
          text: 'CLAUDE.md: the project file that loads into every session',
        },
        {
          type: 'p',
          text: 'Every time Claude Code starts in a project directory, it looks for a file named CLAUDE.md at the root and reads it. The contents are appended to your prompt before any message from you arrives. This means every convention, constraint, and command you put in CLAUDE.md is present from the first prompt of every session, without you having to re-state it.',
        },
        {
          type: 'p',
          text: 'The `/init` command scans your codebase and generates a starter CLAUDE.md. The generated file is a great baseline but should be validated before using. Refine it to hold the rules that control the outcome of your prompts: your testing commands, your framework conventions, the paths the agent should not touch, and the style decisions that differ from defaults.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Size is the main failure mode',
          body: [
            'A CLAUDE.md that keeps growing with every new instruction can dilute the rules that matter most. A larger file consumes more of the context window, which makes any single instruction a smaller fraction of what loads, and that reduces the chance that the agent follows the one rule that catches a real mistake.',
            'Hold CLAUDE.md to the constraints that change behavior and move everything else into Skills that load on demand.',
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Rules instruction files: scoping guidance to where it applies',
        },
        {
          type: 'p',
          text: 'CLAUDE.md is always on, and rules files add a narrower layer on top of that baseline. They live in the project’s `.claude/rules/` directory and can be scoped to specific paths using a `paths` glob in their YAML frontmatter. A rule scoped this way loads into context only when Claude Code works with files matching the pattern.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Scoping comes from the frontmatter, not from file placement',
          body: [
            'Rules files can be organized into subdirectories of `.claude/rules/` (e.g., `.claude/rules/database/`), but that structure is organizational only; a rules file **without** a `paths` field loads unconditionally at launch, with the same priority as CLAUDE.md, no matter where it sits inside `.claude/rules/`.',
          ],
        },
        {
          type: 'p',
          text: 'In practice, put broad project memory and universal constraints in CLAUDE.md, and put narrow, path-specific guidance in rules files scoped with paths. A constraint like “never modify the database schema” lives in CLAUDE.md because it applies everywhere. A constraint like “all SQL in the database module must include an explicit transaction boundary” lives in `.claude/rules/database.md` with frontmatter:',
        },
        {
          type: 'quote',
          label: 'Rules file frontmatter',
          text: '---\npaths:\n  - "src/db/**/*.sql"\n---',
        },
        {
          type: 'h',
          level: 3,
          text: 'Hooks: running your own scripts at fixed points in the lifecycle',
        },
        {
          type: 'p',
          text: 'A Hook allows you to intercept and control tool calls before or after they execute. When you write a rule in CLAUDE.md telling the agent to run Prettier after every file edited, the agent will follow it most of the time. A hook makes it happen every single time without exceptions because the hook fires independently of what the model decides to do.',
        },
        {
          type: 'table',
          caption: 'Lifecycle events',
          headers: ['Event', 'What it does'],
          rows: [
            [
              'PreToolUse',
              'Runs before a tool call executes. Because it runs first, a PreToolUse hook can examine the tool call and exit with code 2 to block it, writing the reason to stderr as feedback the agent sees. This is how you enforce access controls at the configuration layer.',
            ],
            [
              'PostToolUse',
              'Runs after a tool call completes. Since the call has already happened, this event cannot block it, which makes it the right place for automated side effects: running a formatter after an edit, triggering tests, or logging the operation for an audit trail.',
            ],
            [
              'UserPromptSubmit',
              'Runs when you submit a prompt, before the model processes it. Use it to inject context or validate the request before any work starts.',
            ],
            [
              'Stop',
              'Runs when the model finishes responding. Use it for follow-up actions that belong at the end of a turn.',
            ],
            [
              'Notification',
              'Runs when Claude Code sends a notification, which occurs when Claude needs permission to use a tool or after Claude Code has been idle for 60 seconds.',
            ],
            [
              'SessionStart',
              'Runs when a session starts or resumes. Use it to initialize state, validate environment variables, or confirm required services are reachable.',
            ],
            [
              'SessionEnd',
              'Runs when a session ends. Use it for teardown tasks, final audit writes, or notifications.',
            ],
          ],
        },
        {
          type: 'p',
          text: 'A hook that blocks edits to a production configuration path using a PreToolUse event enforces that constraint at every tool call during every session, regardless of permission mode. That is the difference between a guardrail and a convention.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Subagents: delegating work to an isolated context',
        },
        {
          type: 'p',
          text: 'A subagent is a specialized assistant that Claude Code can delegate tasks to, and each assistant runs a task in its own separate context and returns only its output. It does not inherit your main conversation history, the files you have accumulated in context, or your current session state.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Built-in Explore and Plan subagents skip CLAUDE.md',
          body: [
            'The Explore and Plan built-in subagents skip CLAUDE.md and git status to keep research fast and cheap. Project-level rules and repository state defined in CLAUDE.md are not in their context when they run. The general-purpose subagent loads both.',
            'For tasks where your project constraints must be respected, use the general-purpose subagent or a custom subagent that explicitly loads the rules it needs.',
            'Custom subagents also do not automatically see your skills. If you define a custom subagent in `.claude/agents` and it needs a specific skill, you must explicitly list that skill in the agent’s front matter.',
          ],
        },
        {
          type: 'table',
          caption: 'Mechanism map',
          headers: ['Mechanism', 'What it loads', 'When it runs', 'Context cost', 'Belongs here'],
          rows: [
            [
              'CLAUDE.md',
              'Full file contents prepended to context at session start.',
              'Every session, unconditionally.',
              'Persistent per session. Dilutes with size.',
              'Universal project constraints, commands, and framework decisions.',
            ],
            [
              'Rules file',
              'File contents. Scoped via a paths glob in YAML frontmatter; without paths, loads like CLAUDE.md.',
              'When Claude reads a file matching the rule’s paths patterns. Unscoped rules load at session start.',
              'Path-scoped: adds to context only when triggered. Unscoped: same persistent cost as CLAUDE.md.',
              'Path-specific guidance that would be noise everywhere else.',
            ],
            [
              'Hook',
              'Runs your script at the lifecycle event. No content added to context.',
              'At the configured event (PreToolUse, PostToolUse, etc.).',
              'Minimal: only the script output if routed back to Claude.',
              'Enforced guardrails, automated side effects, audit logging.',
            ],
            [
              'Subagent',
              'Task context only. Isolated from the main session.',
              'When dispatched by the main session for a delegated task.',
              'Returns a summary, not the full task history.',
              'Exploration, investigation, and tasks whose output would otherwise bloat the main context.',
            ],
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the CLAUDE.md that kept growing until the rules stopped landing',
        },
        {
          type: 'quote',
          label: 'The trace',
          text: 'Session context window loaded:\n  CLAUDE.md: 847 lines\n  Contents include: framework preferences (lines 1–40), testing conventions (41–90), style guide (91–210), dependency rules (211–320), path restrictions (321–360), historical decisions log (361–700), archived notes (701–847)\n\nUser prompt: "Refactor the auth module to use the new token service. Do not modify the /legacy/tokens/ directory."\nClaude Code: [Editing /legacy/tokens/store.ts to update token interface ...]\nPath restriction from CLAUDE.md (line 347): "Do not modify files in /legacy/tokens/."\nUser: "You just edited /legacy/tokens/store.ts. I said not to touch that directory."',
        },
        {
          type: 'p',
          text: 'The rule was in the file; the agent had access to it. However, the failure was dilution: 846 other lines reduced the effective weight of the one instruction that mattered. The historical decisions log and archived notes should have been noted somewhere, but they did not belong in the CLAUDE.md.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'What to watch out for',
          body: [
            'CLAUDE.md is a working set of rules that change behavior for the current session, not a growing append log. Every line you add reduces the weight of every other line. If a rule is path-specific, it belongs in a rules file. If a rule is historical context, it belongs in a separate reference document the agent reads on demand.',
            'When your CLAUDE.md grows past a few hundred lines, audit it. The one rule you cannot afford to dilute should be the shortest path to a hook.',
          ],
        },
      ],
    },

    {
      id: 'dev-m3-packaging',
      eyebrow: 'Teaching · Packaging Workflows',
      duration: '8 min',
      title: 'Packaging a workflow as a plugin: skills, custom commands, and marketplace install',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'How can you package a setup so a teammate can install it in one step instead of repeating your manual configuration by hand?',
        },
        {
          type: 'h',
          level: 3,
          text: 'Skills are reusable workflows the agent loads on demand',
        },
        {
          type: 'p',
          text: 'A skill is a portable Markdown file (SKILL.md) placed in `.claude/skills`. The front matter identifies the skill and describes when it applies, and the body holds the steps. The same skill can run in Claude Code, be invoked through the Messages API, or be loaded by the Agent SDK. What changes across the three isn’t the file itself; it’s where the skill runs, how it gets loaded, and what it’s allowed to touch.',
        },
        {
          type: 'table',
          caption: 'How the skill loads and runs in each runtime',
          headers: ['Runtime', 'How the skill loads', 'Where the steps run'],
          rows: [
            [
              'Claude Code',
              'Discovered from `.claude/skills` on the filesystem. Loads on a description match or when you invoke it by name.',
              'In your terminal session, against your local files, under the active permission mode and deny rules.',
            ],
            [
              'Messages API',
              'Requires the code-execution and skills beta headers on the request.',
              'Inside the code execution container, not your local environment. Steps must not depend on local files or local tools.',
            ],
            [
              'Agent SDK',
              'Filesystem sources must be enabled by setting `settingSources` explicitly. Do not rely on a default.',
              'In the SDK process, against whatever the configured setting sources expose.',
            ],
            [
              'Claude Managed Agents',
              'The agent is defined as an API resource that lists the skill, with the managed-agents beta header set on calls.',
              'In Anthropic’s sandbox. Steps must not depend on local files.',
            ],
          ],
        },
        { type: 'h', level: 4, text: 'Three portability rules' },
        {
          type: 'ol',
          items: [
            '**Write the description as the matching criterion.** The model loads a skill by comparing your request to its description, so a description that identifies when the skill applies works in every runtime, but a vague one fails to load in all of them.',
            '**Don’t assume a local filesystem or local tools exist inside the skill body.** A skill that shells out to a local command works in Claude Code but breaks on the Messages API, where it runs in a container without a command.',
            '**Remember that subagents don’t inherit skills.** A subagent starts clean, so a skill the parent relied on has to be listed for the subagent explicitly, in every runtime that supports subagents.',
          ],
        },
        { type: 'h', level: 3, text: 'Giving a workflow an explicit entry point' },
        {
          type: 'p',
          text: 'A custom command is a shortcut for a defined procedure. In current Claude Code, skills are the recommended format for both explicit and automatic invocation: you invoke a skill directly with `/skill-name`, or Claude loads it automatically when relevant. The older `.claude/commands/` directory format still works but is a legacy process. Use skills with `disable-model-invocation: true` in the frontmatter when you want a workflow that only runs when you explicitly call it.',
        },
        {
          type: 'p',
          text: 'Plugin commands are namespaced automatically: the plugin’s name becomes the prefix, so a `run-tests` command in a plugin named `payments` is invoked as `/payments:run-tests`. This is why two plugins can both ship a run-tests command without colliding. Authors should treat the plugin name as part of the interface, since renaming the plugin renames them all.',
        },
        { type: 'h', level: 3, text: 'The packaging layer that makes a setup installable' },
        {
          type: 'p',
          text: 'A plugin bundles skills, hooks, subagents, and MCP servers into a single installable unit. Plugins can be packaged and distributed through a marketplace, which is a catalog of plugins that someone else has created and shared. The official Anthropic marketplace is available automatically when you start Claude Code, and you can add third-party marketplaces hosted in a GitHub repository with `/plugin marketplace add <owner/repo>`.',
        },
        {
          type: 'p',
          text: 'Enterprise administrators can deploy plugins organization-wide through managed settings. A managed marketplace allowlist gates which marketplace sources users are permitted to add. The allowlist restricts what users can add but does not register marketplaces automatically; pair it with `extraKnownMarketplaces` in managed settings to push a marketplace to all users. Because managed settings sit above user and project settings in the configuration hierarchy, a plugin deployed at managed scope takes priority and cannot be overridden.',
        },
        {
          type: 'table',
          caption: 'The packaging decision table',
          headers: ['Layer', 'What it is', 'Who it is for', 'When to reach for it'],
          rows: [
            [
              'Skill',
              'A Markdown file in `.claude/skills` that loads when its description matches the task or when invoked by name.',
              'An individual developer or team using Claude Code interactively.',
              'When a task-specific procedure should stay out of context until it is needed, such as a PR review or a deployment checklist.',
            ],
            [
              'Custom command',
              'A named shortcut that runs a defined procedure when you invoke it explicitly.',
              'Developers who want a predictable, explicit entry point for high-frequency procedures.',
              'When the procedure has a clear name and you want to trigger it directly rather than relying on the description to match.',
            ],
            [
              'Plugin',
              'A versioned bundle of skills, hooks, subagents, and MCP servers distributed through a marketplace.',
              'A team that wants one-step installation of a shared, versioned setup.',
              'When a working setup currently lives on one machine and needs to be shared, versioned, and kept consistent across a team.',
            ],
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the plugin that installed on your machine and failed on everyone else’s',
        },
        {
          type: 'p',
          text: 'A developer built a deployment workflow skill, packaged it as a plugin, and tested it locally. Local testing passed, the plugin went out to the team through the internal marketplace, and every teammate’s install succeeded, but the moment any teammate ran the skill, it failed.',
        },
        {
          type: 'p',
          text: 'The root cause sat in the skill’s SKILL.md, in a command that pointed at `/Users/alexmorgan/projects/deploy-utils/validate.sh`. That directory existed on the author’s machine and nowhere else. A second skill in the same plugin leaned on an environment variable, `DEPLOY_TOKEN`, that the author had set in their own shell profile, and the plugin’s README never mentioned it. Three teammates spent two hours debugging before they traced the second failure to the missing variable.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'What to watch out for',
          body: [
            'Any path reference in a skill, hook command, or plugin component must be relative to the project root or use an environment variable for the base path. Use `$CLAUDE_PROJECT_DIR` to reference scripts stored in the project, and `${CLAUDE_PLUGIN_ROOT}` for scripts bundled inside the plugin itself.',
            'Document every environment variable the plugin requires and validate it at install time so a missing one surfaces immediately instead of mid-run. Then test the install on a clean machine before distribution.',
          ],
        },
      ],
    },

    {
      id: 'dev-m3-mcp-servers',
      eyebrow: 'Teaching · MCP Servers',
      duration: '21 min',
      title: 'Building and configuring an MCP server: transport, scope, and the GitHub server',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'An MCP server is a process that exposes tools, resources, and prompts that MCP clients can use. You build the capability once, and every MCP client that connects to it gets access without re-implementing the integration.',
        },
        { type: 'h', level: 3, text: 'MCP servers also expose resources and prompts' },
        {
          type: 'p',
          text: 'A **resource** is read-only data the server exposes for the client to fetch and place into context directly, rather than the model calling a tool to get it. Resources come in two forms: a direct resource has a fixed address for data that takes no parameters, and a templated resource puts a parameter in the address. Reach for a resource when you want known data to be in context from the start of a turn. Resource support varies across MCP clients; verify that your client has a mechanism to inject resources into context before relying on this pattern.',
        },
        {
          type: 'p',
          text: 'A **prompt** is a pre-written instruction template the server exposes so a client can invoke a vetted prompt by name instead of asking each user to write their own. A prompt is useful when specific wording is needed: a task where a carefully built instruction produces materially better results than whatever a user would type.',
        },
        { type: 'h', level: 3, text: 'Transport: how Claude Code talks to the server' },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Transport',
              title: 'stdio',
              body: 'Runs the server as a local process on the same machine as the client. The client launches the server as a subprocess and communicates through standard input and output. Correct for a local tool, a personal script, or a development server. It does not work for a server you want to share across your team or host remotely.',
            },
            {
              eyebrow: 'Transport',
              title: 'HTTP',
              body: 'Connects to a remotely hosted server over a network. The right choice for anything hosted remotely or accessed by more than one machine.',
            },
            {
              eyebrow: 'Transport',
              title: 'SSE',
              body: 'An older SSE-only transport exists but is deprecated; new integrations should use Streamable HTTP.',
            },
          ],
        },
        {
          type: 'callout',
          variant: 'note',
          title: 'Context cost',
          body: [
            'Each connected MCP server contributes tool definitions that would occupy the context window if loaded upfront. By default, Claude Code defers these definitions and uses a search step to discover and load the relevant tools only when a task calls for them.',
            'An opt-in mode loads tool definitions upfront when they fit within roughly 10 percent of the context window, deferring only when that limit is exceeded. Either way, connecting only the servers you need keeps each request lean.',
          ],
        },
        { type: 'h', level: 3, text: 'Prompt caching: paying once for reusable requests' },
        {
          type: 'p',
          text: 'Caching stores the processing work done on a stable prefix of your request so a follow-up request can reuse it. The content must match exactly: a single changed character before the cache point invalidates that cache and forces a fresh write. The strongest candidates are the parts of a request that rarely change, such as a long system prompt, a large set of tool definitions, or a reference document.',
        },
        {
          type: 'p',
          text: 'You turn on caching by marking a cache breakpoint; there is no global setting. In the Messages API you add a `cache_control` field of type ephemeral to the last block you want cached; this caches everything up to and including that block. You can place up to four breakpoints. The request is processed in a fixed order of tools, system prompt, and messages, so a breakpoint after the tools caches the tool definitions while keeping the messages dynamic.',
        },
        {
          type: 'p',
          text: 'The default cache lifetime is five minutes from the last read. An opt-in one-hour lifetime is available by setting a `ttl` of 1h on the breakpoint. Caching only applies above a minimum token threshold (1,024 tokens for most current models), so short prompts will not be cached even if a breakpoint is set.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Retrieval-augmented generation: pulling in only the knowledge a request needs',
        },
        {
          type: 'p',
          text: 'Instead of loading every document into context, RAG stores the material outside the context window, finds the parts most relevant to the current request, and supplies only those parts to the model at request time.',
        },
        {
          type: 'compare',
          items: [
            {
              label: 'Classical RAG',
              title: 'Does the hard work upfront',
              body: 'Source material gets split into chunks, each chunk is converted into an embedding, and those are stored in a database. When a user asks a question, the system converts the question into the same type of numbers and finds the most similar chunks. Like a librarian who has already written a summary card for every chapter.',
            },
            {
              label: 'Agentic search',
              title: 'Skips the upfront indexing entirely',
              body: 'The model figures out what it needs the moment you ask, then goes and fetches it: searching live sources, reading documents on demand, pulling in results as the task unfolds. Like a researcher who goes and finds the answer themselves.',
            },
          ],
        },
        {
          type: 'p',
          text: 'Both approaches find a relevant slice of material and generate from it. The difference is timing: classical RAG matches against an index built in advance; agentic search finds it at the moment of need.',
        },
        {
          type: 'ul',
          items: [
            '**It scales.** As your source material grows, the cost of each request stays flat, because the model only ever receives the slice relevant to that question.',
            '**It’s only as good as what it finds.** If the retrieval step misses the document you needed, the model never sees it. Files with vague names ("notes_final_v3.pdf") are harder to surface than descriptive ones ("Q3 refund policy, updated August 2024").',
          ],
        },
        { type: 'h', level: 3, text: 'Configuration scope: who loads the server' },
        {
          type: 'ul',
          items: [
            '**Local scope** stores the configuration in `~/.claude.json` under the current project’s path. Applies only to the project you are working on and is not shared with teammates.',
            '**User scope** stores the configuration in your personal Claude settings and makes it available across all your projects. Still personal: teammates do not see it.',
            '**Project scope** writes the configuration to a `.mcp.json` file at the root of the repository. When committed, everyone who clones the repository gets the same server. A project-scoped stdio server runs from each teammate’s machine, so each teammate needs the runtime installed locally.',
            '**Enterprise scope** deploys through a centrally managed configuration controlled by an administrator, pushed to all users without individual configuration steps.',
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Permission rules that target a single MCP tool',
        },
        {
          type: 'p',
          text: 'An MCP tool is identified in a permission rule by its server and tool name: `mcp__server__tool`. An allow rule on `mcp__github__create_issue` lets that one tool run without a prompt while every other tool on the GitHub server still prompts. A deny rule on a write-capable tool blocks it while read-only tools on the same server stay available. A deny on one tool overrides an allow on the server.',
        },
        {
          type: 'p',
          text: 'If you are reaching the server through the API MCP connector, an `mcp_toolset` object lets you set an `enabled` flag per tool. A permission rule decides whether an exposed tool may run; the enabled flag decides whether the model sees the tool at all. The first is a governance control, the second is a context-cost and scope control.',
        },
        {
          type: 'h',
          level: 3,
          text: 'The GitHub MCP server: a concrete example',
        },
        {
          type: 'p',
          text: 'The GitHub MCP server is a remote server maintained by GitHub that exposes tools for repository management. It uses HTTP transport because it is hosted remotely. For scope, choose project scope when your whole team needs access, and local scope when only you need it.',
        },
        {
          type: 'p',
          text: 'Authentication uses a Personal Access Token, passed as a Bearer token in the request header. The token must be supplied through an environment variable and referenced in the configuration file. It must not be committed inline to `.mcp.json`, because a token written directly into a committed file enters repository history and cannot be removed by overwriting the file in a later commit.',
        },
        {
          type: 'p',
          text: 'OAuth is a different mechanism, used by servers where the service authenticates individual users through a browser-based sign-in flow. Linear is an example. When you connect for the first time, the client redirects to the sign-in page; after you approve access, a token is issued and stored automatically. GitHub MCP uses a service credential you generate and store; Linear MCP initiates a sign-in flow that handles the credential for you.',
        },
        {
          type: 'table',
          caption: 'The MCP setup reference',
          headers: ['Context', 'Transport', 'Scope', 'Config location', 'Secrets handling'],
          rows: [
            [
              'Personal local tool (runs on your machine only)',
              'stdio',
              'Local',
              '~/.claude.json (per-project entry)',
              'Environment variables only. Never in config file.',
            ],
            [
              'Shared team server (all teammates connect to same service)',
              'HTTP',
              'Project (.mcp.json)',
              '.mcp.json committed to repo root',
              'OAuth or env variables. API keys must never be committed to .mcp.json.',
            ],
            [
              'Personal experiment (not ready to share)',
              'stdio or HTTP',
              'Local',
              'Personal Claude settings',
              'Environment variables only.',
            ],
            [
              'Organization-wide deployment (admin-managed)',
              'HTTP',
              'Enterprise',
              'Managed settings (admin-controlled)',
              'Secrets managed by administrator. Config locked to prevent override.',
            ],
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the API key that traveled into the repository',
        },
        {
          type: 'p',
          text: 'A developer connected to a data warehouse MCP server using a service account API key, placing it directly in `.mcp.json` to get the server working quickly. The plan was to move it to an environment variable before sharing. The `.mcp.json` was committed so teammates could connect, and the key committed along with it. Within 48 hours, three teammates had cloned the repository and a CI pipeline had triggered a fresh clone. The key was now in four places.',
        },
        {
          type: 'p',
          text: 'After realizing this, the developer moved the key to an environment variable and committed the corrected file. But the key was still in the commit history, and the service account had to be rotated. The rotation broke two external services configured with the same key, taking three hours to fix.',
        },
        {
          type: 'compare',
          items: [
            {
              tone: 'negative',
              label: 'Before (do not use)',
              title: 'Inline credential',
              body: '{ "type": "http", "url": "https://warehouse.internal/mcp", "headers": { "Authorization": "Bearer sk-abc123..." } }',
            },
            {
              tone: 'positive',
              label: 'After (correct)',
              title: 'Environment variable reference',
              body: '{ "type": "http", "url": "https://warehouse.internal/mcp", "headers": { "Authorization": "Bearer ${WAREHOUSE_MCP_TOKEN}" } }',
            },
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Two layers of defense',
          body: [
            'API keys committed to a configuration file are committed to repository history. Overwriting the file in a later commit does not remove the key from history. Any credential written inline in a committed file must be treated as compromised and rotated.',
            'First, add a convention instruction to CLAUDE.md stating that credential values must never be written inline to `.mcp.json`. Second, back that instruction with a PreToolUse hook that inspects write and edit operations against `.mcp.json` for patterns that look like inline credential values and exits with code 2 to block the operation. The CLAUDE.md instruction communicates the intent; the hook enforces it deterministically.',
          ],
        },
      ],
    },

    {
      id: 'dev-m3-enterprise',
      eyebrow: 'Teaching · Enterprise Integration',
      duration: '18 min',
      title: 'Connecting Claude to enterprise systems and authenticating it securely',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'A prototype answers one question: does the connection work? A production enterprise integration must answer several more: Who is the model acting as, and is that identity auditable? What data can it access, and where does that data leave the organization? Can an administrator lock the configuration? Can the access be logged in a way that satisfies a compliance audit?',
        },
        { type: 'h', level: 3, text: 'Authentication patterns by service type' },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Pattern',
              title: 'Remote services with user identity',
              body: 'Use OAuth. The MCP server returns a 401 Unauthorized to signal that authentication is required. The client initiates a browser-based sign-in flow. After the user approves access, a token is issued and stored. The expected pattern for cloud services, SaaS tools, and any integration where the user’s identity is part of the authorization model.',
            },
            {
              eyebrow: 'Pattern',
              title: 'Remote services with service identity',
              body: 'API key in an environment variable. The config file holds only a variable reference; the value lives in an environment variable or a managed secret store injected at the point of execution.',
            },
            {
              eyebrow: 'Pattern',
              title: 'Local services with file-system access',
              body: 'File-system permissions. No credential needed; deny rules enforce path access.',
            },
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Managing the secret after authentication: storage, rotation, and separation',
        },
        {
          type: 'p',
          text: '**The first practice is separation:** a credential never travels with the configuration that references it. The configuration file holds a variable reference, and the value lives somewhere the file does not. The reason it matters is mechanical: configuration files get committed, shared, and cloned. A value written inline rides along with every one of those copies, and a committed value enters repository history in a way that overwriting does not remove.',
        },
        {
          type: 'p',
          text: '**The second practice is where the value goes once it is out of the file.** For a value that lives only on one machine or in one pipeline run, an environment variable injected at the point of execution is enough. For a value that several services or people need, a secret store is better: it centralizes the value so a single rotation updates every consumer at once, and it records who read what. Reach for an environment variable when the secret is local and short-lived, and a secret store when the secret is shared or must be audited.',
        },
        {
          type: 'p',
          text: '**The third practice is rotation:** replacing a credential with a new one on a schedule and immediately after any suspected exposure. Rotation is the only appropriate response to a leaked key, because a key that has been exposed cannot be made secret again. A credential read from a secret store or an environment variable rotates without touching the code that uses it, because the code references the value by name and the name does not change when the value behind it does.',
        },
        {
          type: 'p',
          text: 'Two habits make rotation cheaper: scope each credential to the narrowest access its task needs, and keep a record of which services use each credential.',
        },
        {
          type: 'h',
          level: 3,
          text: 'What regulated industries add on top of working authentication',
        },
        {
          type: 'ul',
          items: [
            '**Configuration control:** an administrator-deployed server configuration that cannot be overridden by individual users means the auth setup is consistent across the organization.',
            '**Access logging:** a PostToolUse hook that logs every tool call and its parameters to an audit store provides the record a compliance review needs. The hook fires deterministically for every call, regardless of what the model decides.',
            '**Data residency:** a server configured with an HTTP endpoint in a specific region, combined with a platform deployment that pins processing to that region, gives a compliance reviewer a checkable answer to where data goes.',
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Code modernization: applying the full module to legacy change',
        },
        {
          type: 'p',
          text: 'Large-scale changes to an unfamiliar legacy codebase carry high blast radius, unpredictable dependencies, and limited reversibility. Plan mode holds the agent in the read-only explore phase while you build confidence in its changes. Hooks enforce guardrails that prevent edits to specific paths during the most sensitive phases. CLAUDE.md carries the conventions for the new target patterns, so the agent applies them consistently rather than drifting back to the legacy patterns it reads in the surrounding code.',
        },
        {
          type: 'ol',
          items: [
            '**What is the blast radius if something goes wrong:** which systems depend on the code being changed, and what breaks downstream if an edit is wrong?',
            '**How are changes audited:** is there a PostToolUse hook logging every tool call, and does that log satisfy whoever needs to review what the agent touched?',
            '**Who approves each phase before the next one begins?** Plan mode enforces the boundary between exploration and execution, but the approval decision itself is yours to define and document before work begins.',
          ],
        },
        {
          type: 'table',
          caption: 'The authentication and integration checklist',
          headers: ['Service type', 'Auth method', 'Where secrets live', 'What gets logged', 'Who can lock the config'],
          rows: [
            [
              'Remote with user identity (SaaS, cloud)',
              'OAuth',
              'Token issued by OAuth provider and stored by client.',
              'PostToolUse hook to audit log.',
              'Administrator via enterprise managed settings.',
            ],
            [
              'Remote with service identity (internal API)',
              'API key in environment variable',
              'Environment only. Never in committed config.',
              'PostToolUse hook to audit log.',
              'Administrator via enterprise managed settings.',
            ],
            [
              'Local (file system, local DB)',
              'File-system permissions',
              'No credential needed. Deny rules enforce path access.',
              'PostToolUse hook to audit log.',
              'Deny rules in enterprise managed settings.',
            ],
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the OAuth connection that worked in staging and failed in production',
        },
        {
          type: 'quote',
          label: 'The post-deployment review',
          text: 'Security reviewer: "Every production sign-in attempt through the MCP connection is failing. The error is a redirect URI mismatch. Where was the OAuth app registered?"\n\nDeveloper: "I registered it for staging.mycompany.com during development. We moved to production last week. The connection worked all through staging."\n\nSecurity reviewer: "That\'s the issue. The OAuth provider only accepts redirect URIs you\'ve explicitly registered, and production.mycompany.com is not on the allowed list."\n\nDeveloper: "So I just need to add the production URI to the app registration?"\n\nSecurity reviewer: "Yes, and before you do, check whether your staging app registration should be a separate app from production. Most enterprise customers require separate OAuth app registrations for each environment as part of their security policy."',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'What to watch out for',
          body: [
            'OAuth redirect URIs are registered per host, so a working staging OAuth connection does not mean the production connection is configured. Before moving any OAuth-authenticated MCP integration into a new environment, add the new host’s redirect URI to the OAuth app registration.',
            'For regulated enterprise customers, verify whether separate OAuth app registrations are required for staging and production. Include the registration step in the deployment checklist.',
          ],
        },
      ],
    },

    {
      id: 'dev-m3-cumulative',
      eyebrow: 'Cumulative · Integration Task',
      duration: '12 min',
      title: 'Cumulative integration task: three bugs across three layers',
      blocks: [
        {
          type: 'p',
          text: 'The integration below has three bugs planted across the layers this module covers: one in the Claude Code configuration layer, one in the plugin or packaging layer, and one in the MCP or authentication layer.',
        },
        {
          type: 'table',
          headers: ['File', 'Bug', 'Runtime effect'],
          rows: [
            [
              '`.claude/settings.json`',
              'Uses `bypassPermissions` as the default permission mode.',
              'Removes every confirmation prompt on a production workstation, including for destructive operations. The deny rule for .env.production is correct; only the mode is wrong.',
            ],
            [
              '`.claude/skills/migration-validate/SKILL.md`',
              'Step 1 uses an absolute path `/Users/priya/scripts/validate-migration.sh`.',
              'This path exists only on the author’s machine and will not resolve on any teammate’s machine after they clone the project.',
            ],
            [
              '`.mcp.json`',
              'The API key `sk-prod-warehouse-abc123` is committed inline in the Authorization header.',
              'It enters repository history where it cannot be removed by overwriting the file in a later commit, and must be treated as compromised.',
            ],
          ],
        },
        { type: 'h', level: 3, text: 'The corrected files' },
        {
          type: 'quote',
          label: 'File 1 · .claude/settings.json',
          text: '{ "permissions": { "defaultMode": "acceptEdits", "deny": ["Read(.env.production)"] } }',
        },
        {
          type: 'quote',
          label: 'File 2 · SKILL.md',
          text: '---\nname: migration-validate\ndescription: Validates migration scripts before they run against production.\n---\n## Steps\n1. Run: $CLAUDE_PROJECT_DIR/scripts/validate-migration.sh\n2. Report validation results.',
        },
        {
          type: 'quote',
          label: 'File 3 · .mcp.json',
          text: '{\n  "mcpServers": {\n    "data-warehouse": {\n      "type": "http",\n      "url": "https://warehouse.internal/mcp",\n      "headers": {\n        "Authorization": "Bearer ${WAREHOUSE_MCP_TOKEN}"\n      }\n    }\n  }\n}',
        },
        {
          type: 'p',
          text: 'settings.json sets defaultMode to acceptEdits inside permissions; auto-approves file edits and common filesystem commands but gates destructive shell commands, the right tradeoff for a production migration workstation. The skill uses `$CLAUDE_PROJECT_DIR` so the path resolves from the project root on any machine after cloning. The MCP configuration references the credential as an environment variable so it is never committed to repository history.',
        },
      ],
    },

    {
      id: 'dev-m3-recap',
      eyebrow: 'Recap · Key Takeaways',
      duration: '6 min',
      title: 'Seven key takeaways',
      blocks: [
        {
          type: 'takeaways',
          items: [
            {
              title: 'Permission mode is a risk decision, not a speed decision.',
              text: 'Permission mode should match the risk profile of the work and environment, not the preference for fewer prompts. A bypass mode on a developer workstation against a live codebase removes every checkpoint between the agent and your files. A deny rule on the path that must not be touched, set at the project or enterprise level, covers the gap that a mode alone does not.',
            },
            {
              title: 'An AI code review gives you a set of findings to triage, not a verdict to apply.',
              text: 'Trust the findings the reviewer can prove from the diff in front of it, like a missing null check or an unclosed resource, and confirm them on the lines it cites. Treat any claim about runtime behavior or another system as a hypothesis to test. Put the human gate at the point where a finding turns into an action that’s hard to reverse.',
            },
            {
              title: 'A skill is portable, but “runs everywhere” is something you design for.',
              text: 'The same SKILL.md can run in Claude Code, on the Messages API, and through the Agent SDK, but each one loads and sandboxes it differently: filesystem discovery in Claude Code, beta headers and a code execution container on the API, and settingSources on the SDK. In every runtime, subagents start clean: they do not automatically preload skills.',
            },
            {
              title: 'Durable context requires the right mechanism for each concern.',
              text: 'CLAUDE.md is the session-persistent project memory, but it dilutes with size. Rules files scope guidance to where it applies. Hooks enforce guardrails deterministically, not probabilistically. Subagents keep exploration work out of the main context. Forcing all of them into CLAUDE.md produces a single file that is harder to maintain and easier to ignore.',
            },
            {
              title: 'A shareable setup requires portable components.',
              text: 'A plugin that references an absolute path to the author’s home directory will install on one machine and fail on all others. Skills, hooks, and plugin components that will be shared must reference paths relative to the project root, and any environment variable requirement must be documented or validated at install time. Test the install from a clean machine before distributing.',
            },
            {
              title: 'Transport and scope are independent decisions with dependent consequences.',
              text: 'stdio is for servers that run on your machine. HTTP is for anything hosted remotely or accessed by multiple developers. Local scope keeps a server personal; project scope shares it with the repo via .mcp.json. A stdio server in .mcp.json is a configuration that looks shareable but is not.',
            },
            {
              title: 'Enterprise integration requires identifying the security requirements before deployment.',
              text: 'A regulated customer asks about identity, data residency, access logging, and configuration control. The answers come from OAuth for user-identity services, environment variables for service credentials, PostToolUse hooks for audit logging, and enterprise managed settings for configuration lock. None of these is hard to implement, but all of them are hard to retrofit after a production deployment has failed a security review.',
            },
          ],
        },
      ],
    },

    {
      id: 'dev-m3-glossary',
      eyebrow: 'Glossary · Key Terms',
      duration: '3 min',
      title: 'Key terms from this module',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Term',
              title: 'Claude Agent SDK',
              body: 'A programmable interface that exposes the same agent loop Claude Code runs in the terminal. It allows developers to invoke the loop from code, set the permission mode and available tools, and run tasks without an interactive session. The same permission model and deny rules that apply in the terminal apply in the SDK.',
            },
            {
              eyebrow: 'Term',
              title: 'CLAUDE.md',
              body: 'A Markdown file placed at the root of a Claude Code project. Its contents are prepended to the context window at the start of every session. It holds the universal project constraints, conventions, and commands that should apply unconditionally. Files that grow beyond roughly 200-300 lines risk diluting critical rules through content weight.',
            },
            {
              eyebrow: 'Term',
              title: 'Hook',
              body: "A command bound to a lifecycle event in Claude Code's execution (PreToolUse, PostToolUse, UserPromptSubmit, Stop). Unlike instructions in CLAUDE.md, hooks run deterministically at the configured event regardless of what the model decides. A PreToolUse hook can exit with code 2 to block a tool call before it runs.",
            },
            {
              eyebrow: 'Term',
              title: 'MCP (Model Context Protocol)',
              body: "An open communication layer that allows an MCP client such as Claude Code to connect to an MCP server that exposes tools, resources, and prompts. Using MCP moves tool definition and maintenance out of individual application code and into a reusable server that any MCP client can attach to.",
            },
            {
              eyebrow: 'Term',
              title: 'MCP transport',
              body: 'The communication channel between an MCP client and an MCP server. stdio runs the server as a local subprocess on the same machine as the client. HTTP connects to a remotely hosted server over a network. The choice determines where the server can run and who can connect to it.',
            },
            {
              eyebrow: 'Term',
              title: 'Permission mode',
              body: 'A setting in Claude Code that controls how often the agent stops to request confirmation before executing tool calls. Modes range from default to bypass modes. Deny rules override any mode; a deny rule at the enterprise settings level cannot be bypassed by any individual configuration.',
            },
            {
              eyebrow: 'Term',
              title: 'Plugin',
              body: 'A versioned bundle of Claude Code components (skills, hooks, subagents, and MCP server configurations) distributed through a marketplace. Installing a plugin gives the recipient the same setup as the author in a single step. Enterprise administrators can deploy plugins organization-wide through managed settings.',
            },
            {
              eyebrow: 'Term',
              title: 'Rules instruction file',
              body: 'A file that scopes guidance to a specific path or condition in Claude Code. Unlike CLAUDE.md, which loads for every session unconditionally, a rules file activates only when Claude Code is working in the directory it supervises.',
            },
            {
              eyebrow: 'Term',
              title: 'Subagent',
              body: "A separate execution context launched by Claude Code to handle a delegated task. A subagent does not inherit the main conversation's context or accumulated files; it starts clean, performs the task, and returns only a summary.",
            },
          ],
        },
      ],
    },

    {
      id: 'dev-m3-sources',
      eyebrow: 'Sources',
      title: 'Sources',
      blocks: [
        {
          type: 'ul',
          items: [
            'Claude 101 (Skilljar)',
            'Claude Code 101 In Action (Skilljar)',
            'Building with the Claude API (Skilljar)',
            'code.claude.com',
            'platform.claude.com',
            'docs.claude.com',
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title:
            'You can now run Claude Code safely, share it as a team asset, and connect it to real systems.',
          body: [
            'From permission modes to enterprise authentication, you now hold the configuration decisions that keep an integration working long after it leaves your machine.',
          ],
        },
      ],
    },
  ],

  reviewQuestions: [
    {
      id: 'dev-m3-rq-1',
      question:
        'Checkpoint 1 · Your settings allow the agent to edit files automatically. During a refactor the agent proposes a change to a deployment configuration file that several production services read. Where should a human gate sit for that one action?',
      options: [
        {
          id: 'A',
          text: 'Nowhere: the settings already auto-approve edits, so let it run.',
        },
        {
          id: 'B',
          text: 'A human reviews and approves the change to the deployment configuration file before the write executes, because a wrong value there is hard to undo and reaches systems outside the file.',
        },
        { id: 'C', text: 'Add bypassPermissions so the agent never pauses.' },
        { id: 'D', text: 'Review the change only after the write, during the next pull request.' },
      ],
      correctOptionId: 'B',
      rationale:
        'Auto-approving edits is the right default for a trusted local refactor, but the worst-case question still governs the one high-cost action. A write to a deployment configuration file that several production services read is hard to undo and reaches beyond the file, so a person reviews and approves it before the write executes.',
    },
    {
      id: 'dev-m3-rq-2',
      question:
        'Checkpoint 2 · You are configuring a hook that blocks reads of .env.production. Which lifecycle event belongs in the configuration?',
      options: [
        { id: 'A', text: 'PreToolUse' },
        { id: 'B', text: 'PostToolUse' },
        { id: 'C', text: 'UserPromptSubmit' },
        { id: 'D', text: 'SessionStart' },
      ],
      correctOptionId: 'A',
      rationale:
        'PreToolUse fires before the tool call executes, which is when blocking is possible. A PostToolUse hook cannot block because the tool has already run.',
    },
    {
      id: 'dev-m3-rq-3',
      question:
        'Checkpoint 2 · Which command should that hook run in order to block the read?',
      options: [
        {
          id: 'A',
          text: 'A script that reads the tool call from stdin, checks the file path, and exits with code 2 when the path is .env.production (writing the reason to stderr).',
        },
        { id: 'B', text: 'A script that logs the tool call to an audit file and exits 0.' },
        { id: 'C', text: 'A script that prints a warning and exits 0 unconditionally.' },
      ],
      correctOptionId: 'A',
      rationale:
        'The command reads the tool call from stdin, checks the file path, and exits with code 2 to block it. Anything written to stderr becomes the message Claude sees. Exiting 0 allows the call through.',
    },
    {
      id: 'dev-m3-rq-4',
      question:
        'Checkpoint 3 · A developer wants a review-checklist skill to load when they ask for a review in the Claude Code terminal. What must be configured?',
      options: [
        {
          id: 'A',
          text: 'Place SKILL.md in .claude/skills with a description that matches review requests.',
        },
        {
          id: 'B',
          text: 'Send the code-execution and skills beta headers and write the skill so its steps do not depend on local files or local tools.',
        },
        {
          id: 'C',
          text: 'Enable filesystem sources by setting settingSources explicitly so the agent loads skills from the project.',
        },
        {
          id: 'D',
          text: 'Define the agent as an API resource that lists the skill and set the managed-agents beta header on the calls.',
        },
      ],
      correctOptionId: 'A',
      rationale:
        'Claude Code discovers skills from the filesystem at .claude/skills and loads them on a description match or by explicit name invocation.',
    },
    {
      id: 'dev-m3-rq-5',
      question:
        'Checkpoint 3 · A service calls the Messages API and wants the skill to run as part of the request. What must be configured?',
      options: [
        {
          id: 'A',
          text: 'Place SKILL.md in .claude/skills with a description that matches review requests.',
        },
        {
          id: 'B',
          text: 'Send the code-execution and skills beta headers and write the skill so its steps do not depend on local files or local tools.',
        },
        {
          id: 'C',
          text: 'Enable filesystem sources by setting settingSources explicitly so the agent loads skills from the project.',
        },
        {
          id: 'D',
          text: 'Define the agent as an API resource that lists the skill and set the managed-agents beta header on the calls.',
        },
      ],
      correctOptionId: 'B',
      rationale:
        'On the Messages API the skill runs inside the code execution container, so both beta headers are required and the steps cannot depend on local files or local tools.',
    },
    {
      id: 'dev-m3-rq-6',
      question:
        'Checkpoint 3 · A scheduled headless job uses the Agent SDK and expects the skill from the repo to load. What must be configured?',
      options: [
        {
          id: 'A',
          text: 'Place SKILL.md in .claude/skills with a description that matches review requests.',
        },
        {
          id: 'B',
          text: 'Send the code-execution and skills beta headers and write the skill so its steps do not depend on local files or local tools.',
        },
        {
          id: 'C',
          text: 'Enable filesystem sources by setting settingSources explicitly so the agent loads skills from the project. Do not rely on a default.',
        },
        {
          id: 'D',
          text: 'Define the agent as an API resource that lists the skill and set the managed-agents beta header on the calls.',
        },
      ],
      correctOptionId: 'C',
      rationale:
        'The Agent SDK controls whether filesystem settings load through settingSources. Set it explicitly rather than relying on a default, and confirm current default behavior against the Agent SDK reference at build time.',
    },
    {
      id: 'dev-m3-rq-7',
      question:
        'Checkpoint 3 · A product team wants the same skill to run inside a long-running agent that Anthropic hosts, reachable by an agent ID across sessions. What must be configured?',
      options: [
        {
          id: 'A',
          text: 'Place SKILL.md in .claude/skills with a description that matches review requests.',
        },
        {
          id: 'B',
          text: 'Send the code-execution and skills beta headers and write the skill so its steps do not depend on local files or local tools.',
        },
        {
          id: 'C',
          text: 'Enable filesystem sources by setting settingSources explicitly so the agent loads skills from the project.',
        },
        {
          id: 'D',
          text: 'Define the agent as an API resource that lists the skill and set the managed-agents beta header on the calls. Write the skill so its steps do not depend on local files, because it will run in Anthropic’s sandbox.',
        },
      ],
      correctOptionId: 'D',
      rationale:
        'Claude Managed Agents are defined as versioned API resources, reachable by agent ID, and run in Anthropic’s sandbox rather than against local files.',
    },
    {
      id: 'dev-m3-rq-8',
      question:
        'Checkpoint 4 · A SKILL.md works on the author’s machine but fails after a teammate clones the project. Step 1 reads: "Run the validation script: /Users/alexmorgan/projects/deploy-utils/validate.sh". Which is the defect?',
      options: [
        { id: 'A', text: 'The skill name does not match the plugin name.' },
        { id: 'B', text: 'The description is too short for the model to match.' },
        {
          id: 'C',
          text: 'The absolute path /Users/alexmorgan/projects/deploy-utils/validate.sh in step 1.',
        },
        { id: 'D', text: 'Step 2 should report to the user, not the developer.' },
      ],
      correctOptionId: 'C',
      rationale:
        'The absolute path resolves to the author’s home directory, and a teammate who clones the repo to a different location has no such path, so the script reference fails.',
    },
    {
      id: 'dev-m3-rq-9',
      question: 'Checkpoint 4 · Which is the correct fix for that defect?',
      options: [
        {
          id: 'A',
          text: 'Reference the script from the project root using CLAUDE_PROJECT_DIR, so it resolves no matter where the project is cloned.',
        },
        {
          id: 'B',
          text: 'Replace the path with another absolute path that points to a shared network drive.',
        },
        {
          id: 'C',
          text: 'Replace the path with a home-directory shortcut: ~/projects/deploy-utils/validate.sh.',
        },
        { id: 'D', text: 'Remove step 1 so the skill no longer calls an external script.' },
      ],
      correctOptionId: 'A',
      rationale:
        'Referencing the script relative to the project root using CLAUDE_PROJECT_DIR (or the equivalent variable) means the location resolves from the repo root no matter where the project is cloned.',
    },
    {
      id: 'dev-m3-rq-10',
      question:
        'Checkpoint 5 · A local SQLite query tool you use only on your development machine. Which transport and scope?',
      options: [
        { id: 'A', text: 'HTTP + Project (.mcp.json)' },
        { id: 'B', text: 'HTTP + Enterprise (managed settings)' },
        { id: 'C', text: 'stdio + Local' },
        { id: 'D', text: 'stdio or HTTP + Local' },
      ],
      correctOptionId: 'C',
      rationale:
        'stdio is for servers that run on your machine only, and local scope keeps the server personal to the project you are working on.',
    },
    {
      id: 'dev-m3-rq-11',
      question:
        'Checkpoint 5 · A code search service hosted on your company’s infrastructure that the whole engineering team should access. Which transport and scope?',
      options: [
        { id: 'A', text: 'HTTP + Project (.mcp.json)' },
        { id: 'B', text: 'HTTP + Enterprise (managed settings)' },
        { id: 'C', text: 'stdio + Local' },
        { id: 'D', text: 'stdio or HTTP + Local' },
      ],
      correctOptionId: 'A',
      rationale:
        'HTTP is for anything hosted remotely or accessed by more than one machine, and project scope shares it with everyone who clones the repo.',
    },
    {
      id: 'dev-m3-rq-12',
      question:
        'Checkpoint 5 · An experimental web-scraping server you are testing this week against one specific repository, not ready to share. Which transport and scope?',
      options: [
        { id: 'A', text: 'HTTP + Project (.mcp.json)' },
        { id: 'B', text: 'HTTP + Enterprise (managed settings)' },
        { id: 'C', text: 'stdio + Local' },
        { id: 'D', text: 'stdio or HTTP + Local' },
      ],
      correctOptionId: 'D',
      rationale:
        'A personal experiment can run over either transport, but the scope stays local so nothing is committed or shared before it is ready.',
    },
    {
      id: 'dev-m3-rq-13',
      question:
        'Checkpoint 5 · A security-scanning server your organization’s IT team needs deployed to every developer’s Claude Code installation. Which transport and scope?',
      options: [
        { id: 'A', text: 'HTTP + Project (.mcp.json)' },
        { id: 'B', text: 'HTTP + Enterprise (managed settings)' },
        { id: 'C', text: 'stdio + Local' },
        { id: 'D', text: 'stdio or HTTP + Local' },
      ],
      correctOptionId: 'B',
      rationale:
        'Enterprise scope deploys the server administratively to all users without individual configuration steps, and HTTP is required because it is hosted centrally.',
    },
    {
      id: 'dev-m3-rq-14',
      question:
        'Checkpoint 6 · A trace shows a 401 on the first attempt and on the retry, with the credential read as a plaintext value from /home/jenkins/.config/mcp-credentials.json. Which is the correct targeted fix?',
      options: [
        {
          id: 'A',
          text: 'Rotate the API key and update /home/jenkins/.config/mcp-credentials.json with the new value.',
        },
        {
          id: 'B',
          text: 'Rotate the rejected key, then move the credential out of the file and inject it as an environment variable in the CI pipeline runner configuration. Update the MCP configuration to reference the variable.',
        },
        { id: 'C', text: 'Switch from API key authentication to OAuth for this service.' },
      ],
      correctOptionId: 'B',
      rationale:
        'The trace shows two problems stacked together: the key itself is being rejected, and it is being read as a plaintext value from a file at a known path. Fix B rotates the rejected key so the connection can authenticate, and moves the new key out of the file so it is never stored in plaintext again. Rotating alone (A) writes the replacement straight back into the same file. OAuth (C) does not match the service-account identity model here.',
    },
  ],
};
