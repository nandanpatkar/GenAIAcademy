/*
 * Module 1 — Claude Platform & Model Foundations.
 * Content transcribed from MODULE 1.txt. See ../../README-DATA.md for the
 * block-type reference used by ModuleContent.
 */

const disclaimer = {
  type: 'callout',
  variant: 'disclaimer',
  title: 'Disclaimer / Notice for Educational Content',
  body: [
    "We built this Associate course Module 1: Claude Platform & Model Foundations to help you get real work done with Claude, treat it as educational content. It doesn't constitute legal, financial, or other professional advice, so adapt what you learn to your own situation. Our products and services evolve quickly, so certain content may contain errors or be outdated; remember to verify on Anthropic's website or docs. Examples and scenarios used in the course are illustrative and often fictitious. If the course material mentions a company or product, it doesn't mean Anthropic endorses them, they endorse Anthropic, or that we're affiliated. Also note your use of Anthropic products and services is covered by our terms, policies and documentation; if anything in this course conflicts with them, they control.",
  ],
};

export const module1 = {
  id: 'module-1',
  number: 1,
  title: 'Claude Platform & Model Foundations',
  shortTitle: 'Product & Model Selection',
  summary:
    'Choose the right entry point, model, and features for any given task.',
  duration: '~60 min',
  lede: 'Four decisions determine the quality ceiling for every Claude session: entry point, capability layer, model, and context management. This module builds the framework for all four.',
  objectives: [
    'Select the appropriate Claude entry point and feature set for a given professional task.',
    'Differentiate Haiku, Sonnet, and Opus by capability characteristics and task fit.',
    'Match model selection to task requirements, including quality, speed, and volume trade-offs.',
    'Manage context limitations and use memory features to maintain continuity across sessions.',
  ],

  sections: [
    {
      id: 'm1-intro',
      eyebrow: 'Introduction',
      duration: '5 min',
      title: 'Overview',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Most professionals who use Claude start by learning one or two things it does well. That approach produces results for simple tasks.',
        },
        {
          type: 'p',
          text: 'For recurring work, team projects, and deliverables that need to hold up under review, the feature decisions made within Claude before writing a single prompt determine the quality ceiling for session outputs.',
        },
        {
          type: 'p',
          text: 'This module builds the framework for the four decisions that sit at the front of every Claude interaction: which entry point to use, which capability features to activate, which model to select, and how to manage context across a session. These four decisions determine whether sessions build on prior work or require constant re-setup.',
        },
        { type: 'h', level: 3, text: 'What this module covers' },
        {
          type: 'p',
          text: 'Four decisions determine the quality ceiling for every Claude session: entry point, capability layer, model, and context management. This module builds the framework for all four. Every subsequent module assumes you can make these decisions without returning here.',
        },
        disclaimer,
      ],
    },

    {
      id: 'm1-behaviour',
      eyebrow: 'Teaching · How Claude Behaves',
      duration: '6 min',
      title: 'What to Expect from Generative AI',
      blocks: [
        {
          type: 'p',
          text: 'Before selecting entry points and models, there are five behavioral properties that apply to Claude regardless of which feature you use. Understanding them before building workflows with Claude prevents the most common sources of frustration and misaligned expectations.',
        },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Property 1',
              title: 'Responses vary',
              body: 'Ask Claude the same question twice and you will get two different answers. Both may be useful, but neither should be viewed as the "one correct response." This is how generative AI works: outputs are produced using probability, as opposed to retrieved from a fixed database. Plan for variation in any workflow that depends on consistent outputs and build review into the process.',
            },
            {
              eyebrow: 'Property 2',
              title: 'Confident tone is not a signal of accuracy',
              body: 'Claude writes with consistent fluency regardless of whether the answer is actually correct. A fabricated statistic reads with the same assurance as a verified one. Module 3 builds verification habits; without them, fluency signals nothing about accuracy.',
            },
            {
              eyebrow: 'Property 3',
              title: 'Context is a budget',
              body: 'Every Claude conversation holds a working-memory limit. As a conversation approaches its limit, claude.ai automatically summarizes earlier messages so the session can continue (on paid plans with Code Execution enabled). Summaries compress detail, which is why instructions followed at the start of a two-hour session can lose force by the end. Lesson 6 covers the strategies for managing this: when to restart, when to summarize, when to persist.',
            },
            {
              eyebrow: 'Property 4',
              title: 'Knowledge has a training boundary',
              body: "Claude's training data has a cutoff date. Information after that date is outside Claude's reliable knowledge unless you connect a current source, turn on web search in chat, or use Research. This affects recent events, current regulations, and up-to-date market data. When relevance matters, verify or connect a source.",
            },
            {
              eyebrow: 'Property 5',
              title: 'Configured procedures still produce varied outputs',
              body: "A Skill set up to run the same procedure every time reduces output variance but does not eliminate it. Even a well-configured workflow produces different outputs each time it's run. Review stays in your workflow regardless of how carefully a Skill is built. Although configuration reduces variation, it does not remove the need to check the output.",
            },
          ],
        },
      ],
    },

    {
      id: 'm1-entry-points',
      eyebrow: 'Teaching · Core Entry Points',
      duration: '10 min',
      title: 'Chat, Projects, Artifacts, Research',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Claude appears in one interface, but that interface offers four distinct working entry points: Chat, Projects, Artifacts, and Research Mode. Choosing the right one before starting work determines how efficiently the session runs and whether the context you build today carries forward to tomorrow.',
        },
        { type: 'h', level: 3, text: 'Chat' },
        {
          type: 'p',
          text: "Chat is the default entry point, an unstructured conversation. A Chat is saved to your history and can be continued later, and Memory plus past-chat search can carry key context into new sessions; what Chat does not give you is a Project's deliberate persistence, standing instructions and a curated knowledge base. Use Chat for one-off questions, quick drafts, exploratory prompting, and tasks you will not repeat. Chat works well for any task where the work starts and ends in that session. However, when you find yourself opening a new Chat by pasting the same background paragraph you pasted last week, that workstream has outgrown Chat.",
        },
        { type: 'h', level: 3, text: 'Projects' },
        {
          type: 'p',
          text: 'Projects are persistent workspaces. A Project holds three things:',
        },
        {
          type: 'ul',
          items: [
            '**Standing instructions:** what Claude should know and do consistently across every conversation in this space',
            '**Knowledge base:** documents, policies, and reference files uploaded once so Claude can draw on them without re-uploading each session',
            '**Conversation history:** each Project maintains its own conversation list, separate from your global conversation history. Conversations within a Project share the Project\'s instructions and knowledge base, but they do not share context with each other.',
          ],
        },
        {
          type: 'p',
          text: "Projects solve the most common productivity drain in AI-assisted professional work: re-explaining the same background every session. Set the context once in the Project's standing instructions and knowledge base. Every conversation that follows starts with that context already in place.",
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'What makes a Project worth building',
          body: [
            'The task recurs, the background context is stable, and the output format is consistent. If any two of those conditions hold, a Project saves more time than it costs to build.',
          ],
        },
        { type: 'h', level: 3, text: 'Artifacts' },
        {
          type: 'p',
          text: 'Artifacts are the right output format when the result is a deliverable rather than a conversational reply. When Claude produces an Artifact, it appears as a separate, editable block alongside the chat rather than flowing into the conversation thread. Use Artifacts for draft documents, data tables, formatted reports, and code. Use inline responses for answers you will act on within the conversation.',
        },
        { type: 'h', level: 3, text: 'Research' },
        {
          type: 'p',
          text: "Research enables deep multi-source synthesis (available on paid plans). Regular Chat can search the web: web search is available on all Claude plans as a per-chat toggle in the chat input; on Team and Enterprise plans, an Owner or Primary Owner must first enable web search for the workspace in the organization's capability settings before members can switch it on. Official documentation does not specify whether the toggle is on or off by default. Research goes further: it runs multi-step searches across multiple sources and synthesizes them. Use Research when the task needs deep investigation across a range of sources, or synthesis of current information beyond a quick lookup.",
        },
        {
          type: 'table',
          caption: 'Selection logic',
          headers: ['Task type', 'Entry point'],
          rows: [
            ['One-off question or quick task, no plan to reuse', 'Chat'],
            ['Recurring work with stable context requirements', 'Project'],
            ['Output is a deliverable the recipient will open and read', 'Artifact'],
            [
              'Requires deep multi-source investigation or synthesis (quick current-information lookups: web search in Chat)',
              'Research',
            ],
          ],
        },
      ],
    },

    {
      id: 'm1-entry-points-worked',
      eyebrow: 'Teaching · Core Entry Points · Continued',
      duration: '10 min',
      title: 'A worked comparison',
      blocks: [
        {
          type: 'compare',
          items: [
            {
              tone: 'negative',
              label: 'Wrong entry point',
              title: 'The same setup, every week',
              body: 'A project coordinator drafts weekly team status reports. Every Monday she opens a new Chat and types the same opener: the project name, the team structure, the stakeholder list, the report format requirements, and the previous week\'s open items. Claude produces a good report, but the session takes 40 minutes, about 12 of which are context-loading.',
            },
            {
              tone: 'positive',
              label: 'Right entry point',
              title: 'Set up once, benefit every session',
              body: 'She builds a Project. The project background, team structure, and stakeholder list go into the knowledge base. The report format and standing instructions about escalation thresholds go into the Project instructions. On Monday, she opens the Project and pastes the week\'s updates. The context is already there, so the session takes 25 minutes.',
            },
          ],
        },
        {
          type: 'p',
          text: 'The report quality is the same, but the entry-point decision eliminated the weekly setup tax.',
        },
        {
          type: 'h',
          level: 3,
          text: 'The test for whether a Project is worth building',
        },
        { type: 'p', text: 'Ask three questions:' },
        {
          type: 'ol',
          items: [
            'Does this task recur?',
            'Is the background context the same across sessions?',
            'Is the output format consistent?',
          ],
        },
        {
          type: 'p',
          text: 'If the answer is yes to two or more, build the Project. The setup time is recovered within two or three sessions.',
        },
      ],
    },

    {
      id: 'm1-capability-layer',
      eyebrow: 'Teaching · Capability Layer',
      duration: '12 min',
      title: 'Skills and Code Execution',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Entry points determine where you work. The capability layer determines what Claude can do within that entry point.',
        },
        {
          type: 'p',
          text: "Three features extend Claude's default text-generation behavior in ways that matter for professional work: Skills for consistent procedures, Code Execution for verified computation, and Memory for continuity across sessions.",
        },
        { type: 'h', level: 3, text: 'The four-layer model' },
        {
          type: 'p',
          text: 'Think of the relationship between layers in the following way:',
        },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Layer',
              title: 'Projects carry context',
              body: 'What background knowledge and standing instructions apply to this workstream.',
            },
            {
              eyebrow: 'Layer',
              title: 'Skills define procedures',
              body: 'How a specific task should be executed, consistently, every time.',
            },
            {
              eyebrow: 'Layer',
              title: 'Code Execution verifies computations',
              body: 'When the result must be correct, not merely plausible.',
            },
            {
              eyebrow: 'Layer',
              title: 'Memory persists continuity',
              body: 'Relevant facts carry forward across sessions without re-entry.',
            },
          ],
        },
        {
          type: 'p',
          text: 'The layers are independent. Use any combination based on what the task requires. A one-off question needs none of them, while a recurring analytical workflow might use all four.',
        },
        { type: 'h', level: 3, text: 'Skills' },
        {
          type: 'p',
          text: "Skills are reusable procedures. Anthropic provides built-in Skills for common professional tasks: creating, editing, and analyzing Excel spreadsheets, Word documents, PowerPoint decks, and PDFs. Custom Skills can be added via settings for task-specific workflows. Skills live at the account level, not inside any one Project, and Claude invokes them automatically when relevant in any conversation, inside or outside a Project. A Project's own configuration is its standing instructions and knowledge base; an active Skill tells Claude to follow a defined procedure for that task type, consistently, wherever it applies.",
        },
        { type: 'p', text: 'There are two things to keep in mind about Skills:' },
        {
          type: 'p',
          text: 'First, Skills reduce variance, but they do not eliminate it. A Skill that generates weekly reports in a consistent format will still produce different prose each time it is run. Review stays in your workflow regardless of how well the Skill is configured.',
        },
        {
          type: 'p',
          text: 'Second, Skills require a trust evaluation. A Skill has access to whatever you give Claude access to during the session. Before enabling a third-party Skill, review its source and the permissions it requests. Anthropic-provided Skills and Skills approved by your organization are the lower-risk starting point. Module 6 covers this evaluation in full.',
        },
        { type: 'h', level: 3, text: 'Code Execution' },
        {
          type: 'p',
          text: "Code Execution is Claude's sandboxed computation environment. Claude writes and runs code internally, then returns the result. You do not write the code yourself.",
        },
        {
          type: 'p',
          text: 'Why this distinction matters: Claude generates prose by producing the most probable next sequence of text. This works well for language tasks. For computation, it produces plausible-looking numbers that may or may not be accurate. Code Execution produces a verified result by running the calculation.',
        },
        {
          type: 'p',
          text: 'Use Code Execution instead of asking Claude to calculate when:',
        },
        {
          type: 'ul',
          items: [
            'Any numeric output will be used or reported (calculations, projections, summaries of figures)',
            'Data needs to be transformed or cleaned (date normalization, deduplication, field formatting)',
            'The output needs to be a chart or visualization',
            'The output needs to be a real downloadable file (.xlsx, .pptx, .docx, .pdf)',
          ],
        },
      ],
    },

    {
      id: 'm1-memory',
      eyebrow: 'Teaching · Capability Layer · Memory',
      duration: '12 min',
      title: 'Memory',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Memory retains work-relevant facts across sessions, removing the need to re-enter the same context each time. Examples of what professionals store in Memory include: recurring role context, preferences for output format, names of frequent collaborators, standing constraints that apply across projects.',
        },
        { type: 'h', level: 3, text: 'Memory curation' },
        {
          type: 'p',
          text: 'Memory is most useful when actively curated. A memory that was accurate last quarter and has not been reviewed since can be actively misleading. Plan to:',
        },
        {
          type: 'ul',
          items: [
            'Review stored memories periodically, at least once per month for active users',
            'Delete or update entries that no longer hold',
            'Keep the stored set focused on information that genuinely recurs across sessions',
          ],
        },
        {
          type: 'p',
          text: 'Project-scoped Memory keeps Memory contexts separate for each Project. Context from client A does not appear in client B sessions. Set up separate Projects for separate workstreams; Memory will follow the same boundaries.',
        },
        {
          type: 'p',
          text: "Incognito mode keeps a session out of Memory and chat history (it applies to standalone chats, outside Projects). Use it for sensitive conversations or exploratory work with confidential inputs that shouldn't surface in history or Memory. Note it does not override your organization's underlying data retention.",
        },
        {
          type: 'callout',
          variant: 'note',
          title: 'Memory import (experimental)',
          body: [
            "Importing memories from other AI platforms is an experimental feature as of June 2026. Memory import is documented for Free, Pro, Max, and Team plans (not Enterprise). If the automatic import path is not available in your account, the documented fallback is to add the key facts to Memory manually through your memory settings, rather than routing them into a Project's knowledge base.",
          ],
        },
      ],
    },

    {
      id: 'm1-capability-scenario',
      eyebrow: 'Scenario · Capability Layer',
      title: 'A monthly report that got faster and more accurate at the same time',
      blocks: [
        { type: 'p', variant: 'lede', text: '(Illustrative Scenario)' },
        { type: 'h', level: 3, text: 'Setup' },
        {
          type: 'p',
          text: "A business analyst produced a regulatory tracking report once a month. The task was consistent: take that month's regulatory updates, identify which applied to the portfolio, summarize the implications, and format the output per a defined template. The task was high stakes, but with a repeatable structure.",
        },
        {
          type: 'p',
          text: 'For the first two months, she ran the workflow in Chat. Each session, she uploaded the regulatory documents, re-pasted the portfolio context, and re-typed the format instructions. She ran a verification step on every numeric figure. She caught two errors in month one and one in month two, all before the report went out.',
        },
        {
          type: 'p',
          text: 'In month three, she rebuilt the workflow using the capability layer. The portfolio context and standing format instructions went into the Project, prior reports went into the knowledge base, she enabled a Skill for the report output format, and numeric calculations moved to Code Execution.',
        },
        {
          type: 'p',
          text: 'The time per session dropped from 65 minutes to 30, and the verification step still ran. No errors were found in months three through eight.',
        },
        {
          type: 'table',
          caption: 'What the analyst asked before rebuilding',
          headers: ['Question', 'Layer it pointed to'],
          rows: [
            [
              'Which parts of this task are the same every time?',
              'Standing instructions + Skill',
            ],
            ['Which reference material recurs across sessions?', 'Knowledge base'],
            [
              'Which outputs need to be computed correctly, not just "sound right"?',
              'Code Execution',
            ],
            [
              'Which context do I want to carry across sessions without re-entry?',
              'Memory',
            ],
          ],
        },
      ],
    },

    {
      id: 'm1-models',
      eyebrow: 'Teaching · Choosing Models',
      duration: '8 min',
      title: 'Haiku, Sonnet, Opus',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'The capability layer determines what Claude does. The model determines how well Claude does it, and at what cost in speed.',
        },
        {
          type: 'p',
          text: 'Different model tiers in the Claude family span a range from efficient-and-fast to thorough-and-capable. Matching the tier to the task avoids both over-engineering routine work and under-resourcing high-stakes analysis.',
        },
        { type: 'h', level: 3, text: 'Haiku' },
        {
          type: 'p',
          text: "Haiku is the fastest and most efficient model in the Claude family. It handles structured tasks well: classification, extraction, formatting, straightforward summarization, and high-volume routine work where speed matters and the cost of an imperfect output is low. When a task runs at volume across hundreds of items in sequence, Haiku's speed advantage compounds.",
        },
        { type: 'h', level: 3, text: 'Sonnet' },
        {
          type: 'p',
          text: 'Sonnet is the balanced tier. It handles the full range of professional tasks with strong quality across task types: drafting, synthesis, analysis, research assistance, and document review. For most knowledge-worker work, Sonnet is the right starting point. If quality is falling short for a complex task, upgrade to Opus. If speed and volume are the primary requirements and the task is structured, then consider Haiku.',
        },
        { type: 'h', level: 3, text: 'Opus' },
        {
          type: 'p',
          text: 'Opus is a higher-capability tier, offering more advanced performance than Sonnet and Haiku. Use it for tasks that require nuanced judgment, complex multi-step reasoning, ambiguous inputs that require interpretation, or any work where quality outranks speed. Client-facing deliverables, complex document analysis, strategic planning, and high-stakes synthesis across multiple sources are typical Opus candidates.',
        },
        {
          type: 'table',
          caption: 'Decision logic',
          headers: ['Task profile', 'Model'],
          rows: [
            ['Routine, structured extraction or classification at volume', 'Haiku'],
            ['Most professional drafting, synthesis, and analysis', 'Sonnet'],
            [
              'Complex judgment, high-stakes output, ambiguous or multi-layered inputs',
              'Opus',
            ],
          ],
        },
        { type: 'h', level: 3, text: 'On usage and cost' },
        {
          type: 'p',
          text: 'Opus produces better output on complex tasks, with the tradeoff of running slower. For most knowledge work, Sonnet handles the task well. Reserve Opus for work where the quality ceiling genuinely matters. Use Haiku where volume and speed are the primary requirements and the task has clear structure.',
        },
        {
          type: 'p',
          text: 'One additional dimension to keep in mind: on metered or usage-budgeted plans (including API access), this speed-versus-capability trade-off also becomes a per-call cost trade-off. A higher-capability tier such as Opus consumes more usage per call than Haiku or Sonnet, so on those plans "efficiency" means cost as well as speed. On the standard claude.ai subscription surface, treat efficiency (speed and usage headroom) as the practical proxy for cost; the selection logic above does not change.',
        },
        {
          type: 'p',
          text: 'The model picker lineup, the default model, and automatic model-switching behavior vary by plan and change over time; verify all three in the product at publish. The decision logic above applies regardless of which tiers are available to you.',
        },
        {
          type: 'callout',
          variant: 'note',
          title: 'Please note',
          body: [
            'As of June 2026 the shipped model family includes a fourth tier above Opus (Claude Fable 5, GA 2026-06-09), and Opus-tier latency is currently characterized as moderate rather than slow. The certification pins the three-tier Haiku/Sonnet/Opus frame, so this lesson teaches that frame; treat tier names and characteristics as a verify-at-delivery item. Not exam-relevant.',
          ],
        },
      ],
    },

    {
      id: 'm1-context',
      eyebrow: 'Teaching · Context Management',
      duration: '8 min',
      title: 'Context Limits, Conversation Hygiene & Memory Management',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Model selection and capability configuration determine what Claude can do in a session. Context management determines how long it can do it well. Every Claude conversation has a finite working-memory budget, and that budget runs down as the conversation grows. Deliberate context management keeps sessions coherent through long or complex work.',
        },
        { type: 'h', level: 3, text: 'The context window in practical terms' },
        {
          type: 'p',
          text: "Every conversation has a working-memory limit. As messages and uploaded documents accumulate, Claude's context window fills. As it fills toward the limit, claude.ai automatically summarizes earlier messages to make room (on paid plans with Code Execution enabled), and the full history remains available for reference. In practical terms: a long session where you gave Claude detailed instructions in the first 10 minutes may produce responses 90 minutes later that don't follow those instructions, not because Claude is ignoring them, but because detail can compress when earlier context is summarized.",
        },
        { type: 'h', level: 4, text: 'Signs a conversation needs intervention:' },
        {
          type: 'ul',
          items: [
            'Claude stops following instructions it followed correctly earlier in the same session',
            'Responses address only the most recent exchange without reference to earlier decisions or context',
            'Accuracy drops in ways that are consistent with missing early-session context',
          ],
        },
        { type: 'h', level: 3, text: 'Three responses when context degrades' },
        {
          type: 'steps',
          items: [
            {
              title: 'Restart',
              text: "Start a new conversation. The Project's standing instructions and knowledge base carry forward automatically. The conversation thread does not. Restarting is the right call when the current session has drifted beyond recovery, or when you are beginning a genuinely new task within the same workstream.",
            },
            {
              title: 'Summarize',
              text: 'Before starting a new conversation, ask Claude to produce a summary of the current state: decisions made, work in progress, and open questions. Paste that summary at the start of the new conversation as context. This preserves thread continuity without carrying a degraded context window into the next session.',
            },
            {
              title: 'Persist',
              text: 'For information that should be available across all future sessions, save it to Memory or update the Project knowledge base. Saving the right information at the right moment is more efficient than re-entering it repeatedly. A well-maintained Project with current knowledge base entries reduces the impact of individual session context limits.',
            },
          ],
        },
        { type: 'h', level: 3, text: 'Memory curation' },
        {
          type: 'p',
          text: 'Memory serves best when it stays current. A memory entry that was accurate three months ago and has not been reviewed since can be actively misleading. Treat Memory like a working file. Review it on a regular cadence, delete entries that have expired, and update facts that have changed. The accuracy of stored memories matters more than the volume.',
        },
        { type: 'h', level: 3, text: 'Usage limits' },
        {
          type: 'p',
          text: "Claude's usage limits operate on more than one time window: a short rolling session window, plus weekly limits on paid plans that apply across models (with a separate weekly pool for the highest model tier). The specific windows and allowances vary by plan and change over time; verify current limits in the Help Center at publish. Extended sessions on higher-tier models may reach a limit before the work is complete. For intensive tasks, planning ahead is more efficient than working around an interrupted session: break large tasks into segments, save interim progress to the knowledge base, and restart from a summary rather than extending a single session indefinitely.",
        },
      ],
    },

    {
      id: 'm1-exercise',
      eyebrow: 'Exercise · Platform Selection',
      duration: '5 min',
      title: 'Pick the right feature for the job',
      blocks: [
        {
          type: 'p',
          text: 'The selection decisions from this module are applied together. Entry point, capability layer, model tier, and context strategy are four related choices made for the same task. This exercise practices identifying them together.',
        },
        {
          type: 'p',
          text: "Six professional scenarios, six configuration cards. Match each scenario to the configuration that fits it. Each card is used once. Check your results when you're done. This should take you approximately five minutes.",
        },
        {
          type: 'table',
          caption: 'Configuration cards',
          headers: ['Card', 'Configuration', 'Reason'],
          rows: [
            [
              'A',
              'Project + Skill · Sonnet',
              'Recurring structured task, stable context, fixed output format',
            ],
            [
              'B',
              'Research · Sonnet',
              'Current-information task; window post-dates reliable training-data recall',
            ],
            [
              'C',
              'Code Execution · Haiku or Sonnet',
              'Calculation on a defined dataset; result must be accurate',
            ],
            [
              'D',
              'Project (knowledge base) + Artifact · Opus',
              'Nuanced multi-source analysis, ambiguous inputs, high-stakes deliverable',
            ],
            [
              'E',
              'Chat + Artifact · Sonnet',
              'One-off drafting task; no capability layer needed',
            ],
            [
              'F',
              'Project + Code Execution + Skill · Sonnet',
              'Recurring workflow with verified numeric outputs and consistent format',
            ],
          ],
        },
        {
          type: 'ol',
          items: [
            '**S1.** A marketing director needs to know which competitors launched products in the last 90 days, summarized for a planning session.',
            '**S2.** A project coordinator drafts weekly meeting notes in a fixed format. Same template every week for six months.',
            '**S3.** A strategy consultant is drafting a 15-page board analysis from four uploaded reports, requiring nuanced interpretation of ambiguous signals.',
            '**S4.** An HR analyst has 800 survey responses and needs response rates by department, flagging any below 60% completion.',
            '**S5.** A financial analyst runs a monthly variance analysis: upload actuals, compare to budget, flag variances over 10%, format in the standard template.',
            '**S6.** A procurement manager needs a quick one-off reply to a vendor\'s payment-terms question. She has the policy document and the email.',
          ],
        },
        {
          type: 'p',
          text: 'Revisit the scenarios against the selection framework in Lessons 3 through 6. The four decision dimensions are entry point, capability layer, model tier, and context strategy.',
        },
        { type: 'h', level: 3, text: 'Part 2 · Justify one configuration' },
        {
          type: 'p',
          text: 'Matching a scenario to a card shows you can recognize the right configuration. This step asks you to defend one. Take scenario S3 (the 15-page board analysis built from four uploaded reports). Type the model you would choose and one sentence explaining the trade-off behind that choice; what the choice buys you, and what it costs. Then reveal the model answer and compare your reasoning, not just your selection.',
        },
      ],
    },

    {
      id: 'm1-recap',
      eyebrow: 'Recap · Five takeaways',
      duration: '3 min',
      title: 'Five things that hold across this module',
      blocks: [
        {
          type: 'takeaways',
          items: [
            {
              title: 'Select the entry point before writing the prompt.',
              text: 'Chat handles one-off work. Projects handle recurring work with stable context. Artifacts handle deliverable outputs. Research handles tasks requiring current multi-source information. The entry-point decision shapes every subsequent choice in the session.',
            },
            {
              title: 'Four capability layers, four distinct problems.',
              text: 'Projects carry context. Skills define repeatable procedures. Code Execution verifies computations. Memory persists continuity. Use them independently or in combination based on what the task requires.',
            },
            {
              title: 'Model tiers reflect a speed-capability trade-off.',
              text: 'Haiku handles structured, high-volume tasks efficiently. Sonnet covers most professional work. Opus handles complex, high-stakes tasks where quality outranks speed. Match the tier to what the task demands.',
            },
            {
              title: 'Context is a budget.',
              text: 'Long conversations degrade as context fills. Restart, summarize, or persist. Managing context deliberately is more efficient than working around drift after it has accumulated.',
            },
            {
              title: 'Variation is inherent; review is structural.',
              text: 'Every Claude feature, including configured Skills, produces different outputs run to run. Module 3 builds the discipline to evaluate those outputs before they leave your hands. The framework from this module determines the right entry point and capability layer. The framework from Module 3 determines what to do with the output.',
            },
          ],
        },
      ],
    },

    {
      id: 'm1-sources',
      eyebrow: 'Sources',
      title: 'Sources',
      blocks: [
        {
          type: 'p',
          text: 'All product behavior descriptions are based on claude.ai features as of June 2026. Feature availability and behavior should be verified against current Anthropic documentation at publish.',
        },
        {
          type: 'ul',
          items: [
            'Claude Help Center: Projects, Skills, Memory, file creation, usage limits, support.claude.com',
            'Anthropic docs: prompt engineering overview, model comparison, platform.claude.com/docs',
            'Model tier characteristics: verify the current model lineup, names, default model, and capability descriptions in-product before finalizing',
            'Memory import (experimental): confirm GA status and availability by account tier before finalizing Lesson 4 content',
            'Code Execution: confirm current file output types and sandbox egress controls before finalizing Lesson 4 content',
          ],
        },
        { type: 'h', level: 3, text: 'Module Complete' },
        {
          type: 'p',
          text: "Congrats! You've successfully completed this module. You can now identify the right Claude entry point, model tier, and capability layer for any task. Choose the right tool, and Claude becomes a reliable partner, not a guessing game.",
        },
      ],
    },
  ],

  /* Inline review questions — the module's own quiz, shown for review as you
     read rather than as a graded assessment. */
  reviewQuestions: [
    {
      id: 'm1-rq-1',
      question:
        'An operations analyst runs a weekly inventory reconciliation. Each week she uploads a new inventory file, compares it against a reorder threshold document that has not changed in a year, and produces a formatted exception report. Which configuration best fits this workflow?',
      options: [
        {
          id: 'A',
          text: 'A new Chat conversation each week, with the threshold document and inventory file pasted in',
        },
        {
          id: 'B',
          text: 'A Project with the threshold document in the knowledge base, standing instructions for the exception format, and Code Execution for the comparison calculations',
        },
        { id: 'C', text: 'Research with the inventory file uploaded each week' },
        {
          id: 'D',
          text: "Artifacts saved from each week's session as the primary continuity mechanism",
        },
      ],
      correctOptionId: 'B',
      rationale:
        'Recurring task (Project), stable reference document (knowledge base), consistent output format (standing instructions or Skill), accurate numeric comparison (Code Execution).',
    },
    {
      id: 'm1-rq-2',
      question:
        'A financial planner asks Claude to calculate compound interest on a portfolio scenario with five input variables. Which approach produces the most trustworthy result?',
      options: [
        {
          id: 'A',
          text: 'Asking Claude to calculate it in a Chat conversation and reviewing the answer manually',
        },
        {
          id: 'B',
          text: 'Uploading the variables to a Project and asking Claude to estimate the figure',
        },
        {
          id: 'C',
          text: 'Using Code Execution to run the calculation and return a verified result',
        },
        {
          id: 'D',
          text: 'Using Research to find comparable portfolio scenarios from public sources',
        },
      ],
      correctOptionId: 'C',
      rationale:
        'Code Execution produces a verified computational result. Prose generation produces a plausible estimate that may contain errors.',
    },
    {
      id: 'm1-rq-3',
      question:
        'A legal team needs to review 500 standard vendor agreements and classify each as low, medium, or high risk based on a clear, well-defined rubric. The classification criteria are unambiguous and the task will run to completion in one session. Which model is most appropriate?',
      options: [
        { id: 'A', text: 'Opus, for highest accuracy on legal content' },
        {
          id: 'B',
          text: 'Sonnet, for balanced performance across all professional tasks',
        },
        {
          id: 'C',
          text: 'Haiku, for fast and efficient structured classification at volume',
        },
        {
          id: 'D',
          text: 'The default model, since model selection is not adjustable for this task type',
        },
      ],
      correctOptionId: 'C',
      rationale:
        "Structured classification at high volume with an unambiguous rubric is Haiku's use case. Opus would apply if the classification required nuanced judgment.",
    },
    {
      id: 'm1-rq-4',
      question:
        'A consultant has been working in a single Claude session for two hours on a complex analysis. In the last 30 minutes, responses have stopped reflecting the analytical framework she defined at the start of the session. What is the most appropriate response?',
      options: [
        { id: 'A', text: 'Increase the model tier to Opus to restore output quality' },
        {
          id: 'B',
          text: 'Repeat the analytical framework in the current conversation to restore the context',
        },
        {
          id: 'C',
          text: 'Start a new conversation, paste a summary of decisions and progress, and continue from there',
        },
        {
          id: 'D',
          text: 'Enable Research to give Claude access to additional external context',
        },
      ],
      correctOptionId: 'C',
      rationale:
        'The session has hit context degradation. Starting a new conversation from a summary is the correct response. Repeating instructions (B) extends a degraded session. Changing model tier (A) does not address context exhaustion.',
    },
    {
      id: 'm1-rq-5',
      question:
        'A consultant works on two separate client accounts using Claude and wants to ensure that context from Client A sessions does not appear in Client B sessions. What is the correct configuration?',
      options: [
        {
          id: 'A',
          text: 'Use Incognito mode for all sessions to prevent any Memory persistence',
        },
        {
          id: 'B',
          text: 'Clear Memory manually at the start of each session before switching clients',
        },
        {
          id: 'C',
          text: 'Set up separate Projects for each client account and use Project-scoped Memory',
        },
        {
          id: 'D',
          text: 'Use a different model tier for each client to maintain separate contexts',
        },
      ],
      correctOptionId: 'C',
      rationale:
        'Project-scoped Memory keeps Memory contexts separate per Project. Separate client Projects with Project-scoped Memory is the correct configuration.',
    },
  ],
};
