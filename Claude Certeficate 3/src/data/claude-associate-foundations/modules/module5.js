/* Module 5 — Configuration & Knowledge Management. From MODULE 5.txt. */

const disclaimer = {
  type: 'callout',
  variant: 'disclaimer',
  title: 'Disclaimer / Notice for Educational Content',
  body: [
    "We built this Associate course Module 5: Configuration & Knowledge Management to help you get real work done with Claude. Treat it as educational content. It doesn't constitute legal, financial, or other professional advice, so adapt what you learn to your own situation. Our products and services evolve quickly, so certain content may contain errors or be outdated; remember to verify on Anthropic's website or docs. Examples and scenarios used in the course are illustrative and often fictitious. If the course material mentions a company or product, it doesn't mean Anthropic endorses them, they endorse Anthropic, or that we're affiliated. Also note your use of Anthropic products and services is covered by our terms, policies and documentation; if anything in this course conflicts with them, they control.",
  ],
};

export const module5 = {
  id: 'module-5',
  number: 5,
  title: 'Configuration & Knowledge Management',
  shortTitle: 'Configuration',
  summary: 'Configure and maintain Projects, instructions, and knowledge.',
  duration: '~45 min',
  lede: 'Set up once, benefit every conversation, then maintain it so it stays true.',
  objectives: [
    'Configure Claude Projects with instructions and knowledge sources.',
    'Manage uploaded knowledge and connectors such as Google Drive and Gmail.',
    'Create effective system-level instructions.',
    'Inform, maintain, and update configurations, knowledge sources, and instructions.',
  ],

  sections: [
    {
      id: 'm5-toc',
      eyebrow: 'Associate Certification · Module 5',
      title: 'Table of contents',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'There is a line between using Claude and operating Claude. Using it means typing a good prompt today. Operating it means building an environment where the right context, instructions, and procedures are already in place, so every conversation starts from a configured baseline instead of a blank slate. This module teaches you to build that environment and maintain it so it stays accurate.',
        },
        {
          type: 'table',
          headers: ['Screen', 'Length'],
          rows: [
            ['Module Introduction', '1 screen'],
            ['Configuring Projects', '1 screen'],
            ['Connectors & Uploaded Knowledge', '1 screen'],
            ['System-Level Instructions That Stick', '1 screen'],
            ['Maintaining Configurations', '1 screen'],
            ['Module 5 Quiz', '2 screens'],
            ['Module Complete', '1 screen'],
          ],
        },
      ],
    },

    {
      id: 'm5-intro',
      eyebrow: 'Introduction',
      duration: '4 min',
      title: 'Configuration & Knowledge Management',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'There is a line between using Claude and operating Claude.',
        },
        {
          type: 'p',
          text: 'Using it means typing a good prompt today. Operating it means building an environment where the right context, instructions, and procedures are already in place, so every conversation starts from a configured baseline instead of a blank slate. Configuration is leverage: you set it up once and benefit from it on every conversation that follows.',
        },
        {
          type: 'p',
          text: 'Configuration is also the move that turns individual skill into team capability. When the Project, instructions, and knowledge are curated, two people asking the same question get the same quality of answer. When they are not, everyone re-invents context daily and the answers drift.',
        },
        {
          type: 'p',
          text: 'There is a second half to the discipline: maintenance. Configurations age. A standing instruction written for last quarter\'s process, a knowledge base full of superseded documents, or a Skill that has drifted out of date will quietly degrade output. A well-configured environment is built deliberately and reviewed on a cadence.',
        },
        { type: 'h', level: 3, text: 'The deal in this module' },
        {
          type: 'p',
          text: "Set up once, benefit every conversation, then maintain it so it stays true. Learn to configure a Project's instructions, knowledge, and scoped Memory; manage connectors and their boundaries; write persistent instructions that hold; and run the maintenance reviews that keep a configuration from decaying.",
        },
        disclaimer,
      ],
    },

    {
      id: 'm5-projects',
      eyebrow: 'Teaching · Configuring Projects',
      duration: '12 min',
      title: 'Configuring Claude Projects',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'A Project has several configuration slots, and the skill is putting each piece of a recurring need into the right one. Instructions govern behavior, the knowledge base holds facts, Skills carry procedures, and scoped Memory keeps continuity. Choosing the right slot for each need is what makes a Project run smoothly.',
        },
        { type: 'h', level: 3, text: 'The four configuration mechanisms' },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Mechanism',
              title: 'Standing instructions',
              body: 'How Claude should behave across every conversation in the Project: tone, format defaults, verification habits. Behavior, not facts.',
            },
            {
              eyebrow: 'Mechanism',
              title: 'Knowledge base',
              body: 'The documents, policies, and reference files Claude should draw on without re-uploading. Facts and reference, not behavior.',
            },
            {
              eyebrow: 'Mechanism',
              title: 'Skills',
              body: 'Repeatable procedures Claude should follow consistently for a task type. Procedure, not one-off instruction. Skills live at the account level under Customize, not inside any one Project, a Skill you build is reusable across any Project that needs it.',
            },
            {
              eyebrow: 'Mechanism',
              title: 'Scoped Memory',
              body: 'Continuity within the Project, kept separate from your other Projects so context does not bleed between workstreams.',
            },
          ],
        },
        { type: 'h', level: 3, text: 'Choosing the right mechanism' },
        {
          type: 'p',
          text: 'The recurring question is: instruction, knowledge, or Skill? A rule about behavior ("always cite sources") is an instruction. A fact Claude needs ("our brand palette is these hex codes") is knowledge. A multi-step procedure ("format findings into our standard report template") is a Skill, built once at the account level under Customize and reused across any Project that needs it, rather than configured inside a single Project.',
        },
        {
          type: 'p',
          text: 'Putting a procedure into the instructions, or a behavior rule into the knowledge base, is the most common configuration mistake, and it makes the Project harder to maintain.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Worked example: a client account workspace — one Project per client',
        },
        { type: 'p', text: 'A consultant sets up one Project per client. For Client A:' },
        {
          type: 'ul',
          items: [
            '**Standing instructions:** "Write in a formal register. Always cite the source document for any factual claim. Flag anything you are unsure of rather than guessing."',
            "**Knowledge base:** the client's brand guide, the current statement of work, and the last three status reports.",
            "**Skill (account-level, reused here):** the firm's status-report formatter, which lives under Customize at the account level and is available to any Project, so every weekly update comes out in the same structure.",
            "**Scoped Memory:** the client's stakeholder names and standing preferences, which never appear in Client B's Project.",
          ],
        },
        {
          type: 'p',
          text: "On Team or Enterprise, the Project can be shared with the engagement team under permissions, so everyone works from the same configured baseline. Project-scoped Memory is what guarantees Client A's context does not appear in a Client B conversation, the separation that makes one-Project-per-client safe.",
        },
        { type: 'h', level: 3, text: 'Scoped Memory as a first-class mechanism' },
        {
          type: 'p',
          text: 'Memory is easy to treat as an afterthought, but in a Project, it is a configuration slot like any other. Instructions say how Claude should behave and the knowledge base says what is true. Skills carry reusable procedures at the account level, available to any Project that needs them. Scoped Memory holds what the Project has already settled: the stakeholder names, the standing preferences, the decisions from earlier conversations you do not want to restate every time.',
        },
        {
          type: 'p',
          text: 'The word that matters is "scoped". A Project\'s Memory is sectioned off from your other Projects, so context built up for one client or workstream never appears in another. That isolation is what makes Memory safe for sensitive or client-specific continuity. Claude remembers what it needs to without the risk of it revealing information to the incorrect audience. Deciding what belongs in Memory versus knowledge comes down to type: a stable reference fact goes in knowledge while an evolving record of Project decisions goes in Memory.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'When a need spans two mechanisms — the pairing rule',
          body: [
            'The cleanest configurations rarely map a need to a single slot. The most common pattern is a behavior rule plus the facts it acts on: "Always cite the source document for factual claims" is a standing instruction, but the documents it cites live in the knowledge base. Neither works alone: the instruction has nothing to cite without the documents, and the documents get used inconsistently without the instruction. Skills pair the same way: a status-report Skill carries the procedure, while the brand guide it formats against sits in knowledge. So when you configure a Project, ask which slot a need belongs in, and whether it needs two slots wired together.',
          ],
        },
      ],
    },

    {
      id: 'm5-connectors',
      eyebrow: 'Teaching · Connectors & Uploaded Knowledge',
      duration: '8 min',
      title: 'Connectors and Uploaded Knowledge',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Connectors extend Claude\'s reach into the data you already work in, like Google Drive and Gmail. They are powerful, and they have boundaries.',
        },
        {
          type: 'p',
          text: 'Managing them as curated sources, and knowing exactly what each one can and cannot do, is what keeps them useful instead of frustrating.',
        },
        { type: 'h', level: 3, text: 'Connecting external sources' },
        {
          type: 'p',
          text: 'A connector lets Claude reach an external system you authorize, such as searching your Drive for a document or finding a relevant email. You manage what is accessible, and you keep that set deliberate rather than connecting everything by default.',
        },
        { type: 'h', level: 3, text: 'Capability boundaries' },
        {
          type: 'p',
          text: 'Each connector has a defined boundary and knowing it prevents wasted time. A mail connector may let Claude search and read messages but not send them. Expecting an action a connector cannot perform produces a confusing failure, not a clear error, so learn each connector\'s boundaries before you build a workflow on it.',
        },
        { type: 'h', level: 3, text: 'Two field-observed pitfalls' },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Pitfall',
              title: 'Wrong path to add a connector',
              body: "The obvious add-connector path can route to a public directory rather than your organization's vetted connectors. Confirm the right path with your admin, especially on Team or Enterprise, so you connect the approved source and not a look-alike.",
            },
            {
              eyebrow: 'Pitfall',
              title: 'Boundary confusion misroutes fixes',
              body: "When a connector hits its capability boundary, the failure can look like a bug, a pattern reported from field use rather than documented product behavior. Reports then go to the wrong team and the fix stalls. Knowing where each connector's capability ends keeps the issue from being mislabeled.",
            },
          ],
        },
        { type: 'h', level: 3, text: 'Keeping uploaded knowledge current' },
        {
          type: 'p',
          text: 'Uploaded knowledge needs the same care as a connected source: keep it current, relevant, and free of duplicates. A knowledge base with three versions of the same policy invites Claude to cite the wrong one. Curate it the way you would a shared drive, removing deprecated versions as you add new ones.',
        },
      ],
    },

    {
      id: 'm5-instructions',
      eyebrow: 'Teaching · System-Level Instructions',
      duration: '8 min',
      title: 'System-Level Instructions That Stick',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Teams keep asking a version of the same question: can we bake the guardrails in once instead of re-typing them every conversation? Persistent instructions are exactly that mechanism.',
        },
        {
          type: 'p',
          text: 'You write the verification behaviors, format defaults, and tone once, and every conversation in the Project inherits them.',
        },
        { type: 'h', level: 3, text: 'Write the guardrails once' },
        {
          type: 'p',
          text: 'The highest-value instructions are the ones you would otherwise re-type constantly. Set the verification behaviors as standing instructions, for example:',
        },
        {
          type: 'quote',
          label: 'Standing instruction',
          text: '"Cite the source document for every factual claim, and say \'I don\'t know\' rather than guessing when the documents do not cover something."',
        },
        {
          type: 'p',
          text: 'Now that discipline applies to every conversation without anyone remembering to ask for it.',
        },
        { type: 'h', level: 3, text: 'Anticipate the use cases' },
        {
          type: 'p',
          text: 'Good standing instructions embed format, tone, and guardrail guidance ahead of need. If the Project produces client deliverables, the instructions can specify the preferred format and register up front, so the first draft lands closer to a final deliverable rather than needing the same corrections each time.',
        },
        { type: 'h', level: 3, text: 'Precision, or it silently fails' },
        {
          type: 'p',
          text: 'Vague instructions do not announce that they failed; they just quietly do not work. "Be professional" gives Claude almost nothing to act on. "Use a formal register, define any acronym on first use, and keep paragraphs under four sentences" is precise enough to change the output.',
        },
        {
          type: 'p',
          text: 'The test of an instruction is whether two different people would read it the same way.',
        },
        { type: 'h', level: 3, text: 'Worked example: before and after an instruction' },
        {
          type: 'compare',
          items: [
            {
              tone: 'negative',
              label: 'Before · vague',
              title: '"Make the reports good and accurate."',
              body: 'Output quality varies conversation to conversation; nothing concrete changed.',
            },
            {
              tone: 'positive',
              label: 'After · precise',
              title:
                '"For every figure in a report, state its source. If a figure is not in the provided data, mark it \'unverified\' rather than including it. Lead each report with a one-sentence headline."',
              body: 'Now the verification behavior is consistent, and the headline appears every time.',
            },
          ],
        },
      ],
    },

    {
      id: 'm5-maintenance',
      eyebrow: 'Teaching · Maintaining Configurations',
      duration: '10 min',
      title: 'Maintaining Configurations',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Configurations are living assets. Instructions, knowledge, Skills, and Memory all drift toward stale, and stale configuration degrades output quietly, with no error to alert you. Scheduling maintenance is how you catch decay before it reaches a deliverable.',
        },
        { type: 'h', level: 3, text: 'Review cadence' },
        {
          type: 'p',
          text: 'Set a recurring review for each active Project: do the standing instructions still match the current process, is the knowledge base free of superseded documents, are the right Skills enabled? A monthly pass for active Projects catches most drift. The signal that you waited too long is output quality slipping for no visible reason.',
        },
        { type: 'h', level: 3, text: 'Skills versioning' },
        {
          type: 'p',
          text: 'Skills update over time. Anthropic-built and organization-provisioned Skills update automatically; your own custom-uploaded Skills change only when you re-upload them. Watch for a misconfigured or out-of-date Skill degrading output. A Skill that silently produces a slightly off format every run is a maintenance problem, not a prompting problem.',
        },
        { type: 'h', level: 3, text: 'Memory lifecycle' },
        {
          type: 'p',
          text: "Treat Memory like a working file. Review it periodically, edit or delete entries that have gone stale, and export it as a backup before a major change. When a Project's Memory has accumulated enough outdated context to mislead, a full reset is the right call. The accuracy of what is stored matters more than the volume.",
        },
        {
          type: 'p',
          text: 'Configuration is also additive: when Claude has not automatically captured a fact that matters: a constraint, a preference, a piece of background, add it explicitly to standing instructions or Memory rather than re-supplying it each session.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Worked example: auditing a degraded setup',
        },
        {
          type: 'p',
          text: '**A recurring report Project starts producing subtly wrong output.** The maintenance checklist finds the causes: a standing instruction still references a metric the team renamed last quarter, the knowledge base holds two versions of the template, and a Memory entry records a stakeholder who has left.',
        },
        {
          type: 'p',
          text: 'The fix is maintenance, not a new prompt: update the instruction, remove the old template, delete the stale Memory entry. Output returns to standard without changing how anyone prompts.',
        },
      ],
    },

    {
      id: 'm5-takeaways',
      eyebrow: 'Key Takeaways',
      duration: '5 min',
      title: 'Five things that hold across this module',
      blocks: [
        {
          type: 'takeaways',
          items: [
            {
              title: 'Configuration is leverage.',
              text: 'Set up once, benefit on every conversation. A configured environment separates operating Claude from merely using it.',
            },
            {
              title: 'Match each need to the right mechanism.',
              text: 'Instructions for behavior, knowledge for facts, Skills for procedures, scoped Memory for continuity.',
            },
            {
              title: "Know each connector's boundary.",
              text: "Connectors extend Claude's reach, but each has a capability edge; knowing it prevents frustration and misrouted fixes.",
            },
            {
              title: 'Write instructions precisely.',
              text: 'Vague standing instructions silently fail; precise, testable ones change output every conversation.',
            },
            {
              title: 'Maintain or watch quality decay.',
              text: 'Configurations age. Schedule reviews of instructions, knowledge, Skills versions, and Memory, or output degrades with no warning.',
            },
          ],
        },
      ],
    },

    {
      id: 'm5-sources',
      eyebrow: 'Sources',
      title: 'Sources',
      blocks: [
        {
          type: 'p',
          text: 'All product behavior descriptions are based on claude.ai features as of June 2026. Feature availability and behavior should be verified against current Anthropic documentation at publish:',
        },
        {
          type: 'ul',
          items: [
            'Claude Help Center: Projects, knowledge base, Skills, Memory, connectors, support.claude.com',
            'Connector list, capability boundaries, and org-directory routing: confirm current behavior before finalizing Lesson 3',
            'Skills versioning behavior and Memory export/reset: confirm current claude.ai behavior before finalizing Lesson 5',
            'Team/Enterprise Project sharing and org-level Memory controls: confirm tier availability',
          ],
        },
      ],
    },
  ],

  reviewQuestions: [
    {
      id: 'm5-rq-1',
      question:
        'A team wants every report in the Project to follow the same multi-step formatting procedure. Which configuration mechanism fits?',
      options: [
        { id: 'A', text: 'A standing instruction describing the format in prose' },
        { id: 'B', text: 'A Skill that carries the repeatable formatting procedure' },
        { id: 'C', text: 'A document in the knowledge base' },
        { id: 'D', text: 'A Memory entry' },
      ],
      correctOptionId: 'B',
      rationale:
        'A repeatable multi-step procedure is a Skill; instructions govern behavior and the knowledge base holds facts.',
    },
    {
      id: 'm5-rq-2',
      question:
        "An equity analyst covers two competing retailers, Retailer A and Seller B, and must ensure each company's confidential modeling assumptions never surface in work on the other. What is the correct setup?",
      options: [
        {
          id: 'A',
          text: 'A single Project covering both companies, separated by careful prompting in each chat',
        },
        {
          id: 'B',
          text: "A separate Project for each company, each with its own scoped Memory holding that company's assumptions",
        },
        { id: 'C', text: 'Turning Memory off entirely so nothing is retained for either company' },
        { id: 'D', text: "A different model tier for each company's analysis" },
      ],
      correctOptionId: 'B',
      rationale:
        "A separate Project per company, each with its own scoped Memory, keeps Retailer A's and Seller B's assumptions isolated. A single shared Project risks bleed no matter how careful the prompting; turning Memory off sacrifices the continuity that makes Projects useful; and the model tier has no effect on isolation.",
    },
    {
      id: 'm5-rq-3',
      question:
        'A user expects a mail connector to send emails on their behalf, but it only searches and reads. What is the most accurate understanding?',
      options: [
        { id: 'A', text: 'The connector is broken and should be reported as a bug' },
        {
          id: 'B',
          text: "Each connector has a defined capability boundary; sending is outside this one's scope",
        },
        { id: 'C', text: 'A more capable model would enable sending' },
        { id: 'D', text: 'The connector needs to be re-added through the public directory' },
      ],
      correctOptionId: 'B',
      rationale:
        'The behavior is a defined capability boundary, not a defect; knowing the edge prevents misrouted reports.',
    },
    {
      id: 'm5-rq-4',
      question:
        'A Project produces meeting-summary notes. Which standing instruction is most likely to actually change the output?',
      options: [
        { id: 'A', text: '"Capture the meeting clearly and thoroughly."' },
        { id: 'B', text: '"Write up the notes nicely."' },
        {
          id: 'C',
          text: '"List each decision as its own bullet; record every action item as owner plus due date; flag any unassigned action as \'owner TBD\'."',
        },
        { id: 'D', text: '"Summarize each meeting as best you can."' },
      ],
      correctOptionId: 'C',
      rationale:
        'Only option C is precise and testable; it names the exact structure (one bullet per decision, owner plus due date per action, an explicit flag for unassigned items), so two people would read it the same way. A, B, and D are vague aspirations that give Claude nothing concrete to act on, so they silently fail.',
    },
    {
      id: 'm5-rq-5',
      question:
        'A recurring monthly-report Project has started producing subtly outdated figures, with no error message. Here is its current setup:\n\n• Standing instruction: "Format every report using the Q2 FY25 template and cite the FY25 targets."\n• Knowledge base: Brand_Guide_v4.pdf; FY26_Targets.xlsx; Report_Template_FY26.docx\n• Memory: "Reporting period is FY25; quarterly targets are in the FY25 plan."\n\nThe current reporting period is now FY26. Which element is driving the drift, and what is the corrective?',
      options: [
        {
          id: 'A',
          text: 'The knowledge base: remove Brand_Guide_v4.pdf, which is unrelated to the figures.',
        },
        {
          id: 'B',
          text: 'The standing instruction and the Memory entry: both still pin the report to the FY25 template and FY25 targets, while the knowledge base already holds the FY26 versions; update both to FY26.',
        },
        {
          id: 'C',
          text: 'The report template: delete the FY26 template so Claude stops mixing versions.',
        },
        {
          id: 'D',
          text: 'Nothing in the setup; subtle drift with no error means the model tier is too low.',
        },
      ],
      correctOptionId: 'B',
      rationale:
        'The knowledge base is already current (the FY26 files are present). The drift comes from the standing instruction and the Memory entry, which still direct Claude to the FY25 template and targets, so Claude faithfully follows stale configuration. The corrective is to update the instruction text and the Memory entry to FY26 to match the knowledge base. This is evaluation: judging a setup, not recalling a first move.',
    },
  ],
};
