/*
 * Developer Module 5 — Accelerators and IP Contribution.
 * Content transcribed from "MODULE 5_DEV.txt".
 */

const disclaimer = {
  type: 'callout',
  variant: 'disclaimer',
  title: 'Disclaimer / Notice for Educational Content',
  body: [
    "We built this Developer course Module 5: Accelerators and IP Contribution to help you get real work done with Claude. Treat it as educational content. It doesn't constitute legal, financial, or other professional advice, so adapt what you learn to your own situation. Our products and services evolve quickly, so certain content may contain errors or be outdated; remember to verify on Anthropic's website or docs. Examples and scenarios used in the course are illustrative and often fictitious. If the course material mentions a company or product, it doesn't mean Anthropic endorses them, they endorse Anthropic, or that we're affiliated. Also note your use of Anthropic products and services is covered by our terms, policies and documentation; if anything in this course conflicts with them, they control.",
  ],
};

export const module5 = {
  id: 'dev-module-5',
  number: 5,
  title: 'Accelerators and IP Contribution',
  shortTitle: 'Accelerators & IP',
  summary:
    'Packaging for reuse, contributing back, requirements and lifecycle, deployment and versioning, platform comparison, and trust boundaries.',
  duration: '~2h 20min',
  lede: 'This module picks up the moment your code runs correctly and asks the harder question: can someone else reuse it, can a maintainer accept it, can it survive a model update, and can a security or procurement team sign off on where it runs.',
  objectives: [
    'Package a working solution as a reusable accelerator, whether that is a parameterized agent template, a configurable MCP server, or a portable eval suite, so the next engagement configures an asset rather than fully rebuilding it.',
    'Contribute a tool, pattern, or fix back through the documented channels and prepare it so a maintainer can accept it, turning a private asset into shared infrastructure.',
    'Choose where a Claude workload runs across the first-party API, Amazon Bedrock, Google Vertex AI, and third-party platforms, and version what ships so a model or prompt change does not silently break production.',
    'Compare those platforms on latency, compliance, and cost so the choice is one a procurement and security team can sign off on, rather than a default your team reached for.',
    'Build an application that coordinates several Claude deployments into one workflow and scope it so the data and identity boundaries are held under a security or compliance review.',
  ],

  sections: [
    {
      id: 'dev-m5-orientation',
      eyebrow: 'Orientation',
      duration: '2 min',
      title: 'What you will be able to do by the end',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Document the build well and the next engagement builds from it instead of from scratch.',
        },
        {
          type: 'p',
          text: 'This module covers what happens to a build after it works. You either rebuild it from scratch on the next engagement, or you package it once, so the next team just configures it. The second path is what frees your time for new work instead of repeated rebuilding.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: '“The build” in this module',
          body: [
            'Everything in this module hinges on one recurring gap: a build that works is not yet a build that survives reuse, review, or deployment.',
            'The same template must be configured for a team that never spoke to you. The same contribution must be verifiable by a maintainer who must reconstruct nothing. The same model must be pinned so an upstream change is a decision rather than a surprise. The same platform must clear a customer’s residency and compliance review. The same connected platforms must hold their trust boundaries under audit.',
            'The point where code starts working is where this module’s work begins.',
          ],
        },
        disclaimer,
      ],
    },

    {
      id: 'dev-m5-packaging',
      eyebrow: 'Teaching · Packaging for Reuse',
      duration: '16 min',
      title: 'Packaging a working build so the next engagement starts from an asset',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'An accelerator is a solution packaged so future engagements start from a working foundation rather than from a blank repository: separating engagement-specific code from the reusable core and parameterizing the rest.',
        },
        {
          type: 'p',
          text: 'Take a working build, separate the parts that are customer-specific, and expose them as parameters with documented defaults. The asset then configures rather than gets entirely rewritten. Packaging for reuse while the build is fresh is cheaper than reconstructing the intent months later, when the person who knew why a value was hardcoded has moved on.',
        },
        {
          type: 'table',
          caption: 'Three asset types, three packaging requirements',
          headers: ['Asset type', 'What it bundles', 'What correct packaging requires'],
          rows: [
            [
              'Agent Template',
              'The system prompt, the tool schemas, and the loop structure from a working agent.',
              'Pull the domain-specific values into configuration with documented defaults, so a new team sets the values rather than editing the loop.',
            ],
            [
              'MCP Server Package',
              'The tools the server exposes, with their inputs and the scope the installing team controls.',
              'Document each tool input and let the installing team set the scope, so the server installs into a new environment without code edits.',
            ],
            [
              'Eval Suite',
              'The graded test set and the judge rubric that prove the asset works.',
              'Ship the dataset and rubric together so a new team can run them in their own context. The same eval suite also acts as the gate at deployment: when you promote a new model version to production, run it against a pinned baseline score before the version goes live.',
            ],
          ],
        },
        {
          type: 'p',
          text: 'Shipping an agent as a set of loose scripts instead of a template is the most common version of the wrong approach. The scripts run, so they look reusable, but every customer-specific value is buried in a different file, and the next team copies and diverges them instead of configuring one asset.',
        },
        {
          type: 'p',
          text: '**Document both the code and the assumptions.** Code describes behavior. Documentation covers what a future builder cannot reliably infer from reading the source: the assumptions the asset makes about its environment, the inputs it expects, the failure modes it already handles, and the eval that defines whether it still works.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Bundle the audit log as part of the package',
          body: [
            'A regulated customer’s reviewer asks what data the asset touches, what identity it acts under, and what log it leaves. An accelerator without these passes a demo and stalls at the first security review.',
          ],
        },
        {
          type: 'table',
          caption: 'The packaging checklist',
          headers: ['Asset type', 'What to parameterize', 'What to document', 'What to bundle for audit'],
          rows: [
            [
              'Agent template',
              'Every value that changes per customer: prompts, paths, scopes, credentials by reference, and thresholds.',
              'Environment assumptions, expected inputs, handled failure modes, and the eval that defines working.',
              'The data touched, the identity acted under, and the log of what the asset did.',
            ],
            [
              'MCP Server',
              'Scopes, credentials by reference, and per-customer paths.',
              'Expected inputs per tool, scope boundaries, and handled failure modes.',
              'The data touched, the identity acted under, and the log of what the asset did.',
            ],
            [
              'Eval Suite',
              'Thresholds and dataset paths that change per customer or environment.',
              'The rubric logic, what the scores mean, and the baseline the asset is pinned to.',
              'The data touched, the identity acted under, and the log of what the asset did.',
            ],
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the template that shipped fast and could not be reused',
        },
        {
          type: 'p',
          text: 'A team built an agent template for a customer engagement and shipped it on time. To hit the due date, the customer-specific values went straight into the code: the repository path, the model name, the review thresholds, and a handful of prompt fragments specific to that customer’s domain. The template ran, the engagement closed, and the build went into the shared repository labeled as reusable.',
        },
        {
          type: 'p',
          text: 'Months later a second team picked it up. They could not configure it, because there was nothing to configure. There was no document saying which values were customer-specific and which were load-bearing. There was also no bundled eval, so even after they guessed at the edits, nothing confirmed the template still worked in the new context. They had to rewrite it from scratch.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'What to watch out for',
          body: [
            'A template that runs has not been packaged for reuse. These are different finishing states. The warning signs are the absence of three things: no parameters where customer-specific values belong, no documentation describing the assumptions, and no bundled eval proving the asset still works in a different context.',
          ],
        },
        {
          type: 'compare',
          items: [
            {
              tone: 'negative',
              label: 'Checkpoint 1 · As shipped',
              title: 'The hardcoded repo path',
              body: 'def build_review_agent():\n    return Agent(model="claude-opus-4-8", system_prompt=SYSTEM_PROMPT, tools=[read_file, run_linter], repo_path="/home/acme/checkout-service")',
            },
            {
              tone: 'positive',
              label: 'Model answer',
              title: 'Parameterized for reuse',
              body: 'def build_review_agent(repo_path):\n    return Agent(model="claude-opus-4-8", system_prompt=SYSTEM_PROMPT, tools=[read_file, run_linter], repo_path=repo_path)   # set per engagement',
            },
          ],
        },
        {
          type: 'p',
          text: 'The hardcoded `repo_path` is the defect. A reusable template takes the customer-specific value as a parameter, so the next team configures the asset instead of editing the code. That is the difference between a template that runs and a template that reuses.',
        },
      ],
    },

    {
      id: 'dev-m5-contributing',
      eyebrow: 'Teaching · Contributing Back',
      duration: '12 min',
      title: 'Moving an asset from private reuse into shared infrastructure a maintainer accepts',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'An asset packaged for internal reuse is already close to what a maintainer needs to accept it. The parameters show the asset can be configured rather than rewritten. The documented assumptions tell the maintainer what environment the asset expects. The bundled eval gives them a way to confirm it still works.',
        },
        { type: 'h', level: 3, text: 'Match the contribution to the channel built for it' },
        {
          type: 'p',
          text: 'The Claude Cookbook is a GitHub repository of focused reference implementations. It is designed for self-contained single- or multi-pattern implementations demonstrated clearly and working end to end. Open-source MCP servers and tools each live in their own repository with their own contribution conventions. Sending a full multi-component application to the Cookbook is a mismatch: the repository is set up to review one focused pattern rather than an entire application. Putting a full application where a focused example belongs is one of the most common reasons a contribution never gets reviewed.',
        },
        { type: 'h', level: 3, text: 'What makes verifying a contribution possible' },
        {
          type: 'ol',
          items: [
            '**The code does one thing.** A sprawling contribution forces a reviewer to reconstruct your intent before evaluating it.',
            '**An example shows it running.** A reviewer should not have to build a harness to see the behavior.',
            '**A test proves it works.** A test lets a maintainer verify the result without reproducing the reasoning themselves.',
            '**A short statement names the assumptions.** Otherwise, the first failure becomes the maintainer’s problem.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Rights and attribution come before technical review',
          body: [
            'Licensing and attribution decide whether a contribution can be accepted at all, which is why they come before the technical review. Code carried in from a customer engagement may have constraints on where it can go. Confirming you have the right to contribute it, and attributing anything you built on, is a gate the contribution must pass first.',
            'Skipping this is what turns a contribution into a problem the legal team must unwind later.',
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the pull request a maintainer could not verify',
        },
        {
          type: 'quote',
          label: 'The exchange',
          text: 'Developer: My PR has been open three weeks with no review. The code works, I use it every day. What is the holdup?\n\nMaintainer: It probably works for you. The problem is I can\'t tell. There is no test I can run, no example that proves the behavior, and nothing saying what it assumes about the environment.\n\nDeveloper: So, you want me to add a test and an example?\n\nMaintainer: Yes. A contribution a reviewer cannot verify sits at the back of the queue until someone has time to reconstruct what it does. A focused PR with a test and an example gets reviewed fast because there is nothing left for me to reverse-engineer.',
        },
        {
          type: 'p',
          text: 'The code was correct. The contribution stalled because the maintainer could not verify it without reconstructing the developer’s work. That gap is easy to overlook because the author already has the missing context.',
        },
      ],
    },

    {
      id: 'dev-m5-requirements',
      eyebrow: 'Teaching · Requirements & Lifecycle',
      duration: '16 min',
      title: 'From business requirements to functional and infrastructure requirements',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'A functional requirement names what the system must do, stated with enough detail to check.',
        },
        {
          type: 'p',
          text: 'A business problem (e.g. "help support agents answer faster") is not yet a requirement; the functional requirements derive from it (e.g. "classify each ticket into one of four queues; draft a reply citing the relevant policy; never auto-send without human approval"). A vague goal cannot be designed against or verified, while a specific one becomes a line in an eval and a criterion at review.',
        },
        {
          type: 'p',
          text: '**Infrastructure requirements** are the non-functional constraints the deployment must satisfy. Most are not stated in the business problem; you derive them by asking the questions it implies. **Latency:** how fast does a response need to be, measured where the user is? **Scale:** how many requests, and at what peak? **Residency:** where must the data be processed, and under which regulation? **Identity:** who acts, under what credentials, and what must be auditable?',
        },
        {
          type: 'p',
          text: 'Requirements are written down because the deployment decision will be reviewed by people who did not gather them. A short requirements record covering the functional behaviors, the infrastructure constraints, and the regulation each constraint comes from lets you defend a platform choice as following from the requirements rather than from familiarity.',
        },
        { type: 'h', level: 3, text: 'Systems lifecycle for Claude applications' },
        {
          type: 'steps',
          items: [
            { title: 'Requirements', text: 'Capture functional and infrastructure needs.' },
            { title: 'Design', text: 'Choose the platform, the model, and the trust boundaries.' },
            { title: 'Build', text: 'Write the agent, tools, and prompts.' },
            { title: 'Test', text: 'Evals, unit, integration, and end-to-end checks.' },
            { title: 'Deploy', text: 'Pin the version, gate promotion on the eval.' },
            { title: 'Operate', text: 'Instrument cost, latency, and errors; enforce guardrails.' },
            { title: 'Iterate', text: 'Feed production findings back into requirements.' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Gating between phases',
          body: [
            'A gate is a decision to move from one phase to the next, and it is where a regulated engagement keeps control. You do not move from design to build until the platform satisfies the residency requirement; you do not move from deploy toward full production until the new version clears the eval against the pinned baseline.',
            'Placing engineering work in the right phase, and refusing to skip a gate, is what keeps a Claude application reviewable.',
          ],
        },
      ],
    },

    {
      id: 'dev-m5-deployment',
      eyebrow: 'Teaching · Deployment & Versioning',
      duration: '15 min',
      title: 'Choosing where a Claude workload runs and versioning what ships',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'The platform decision is rarely about technical merit alone. In practice, it is usually shaped by where the customer already has cloud infrastructure, identity management, and compliance agreements in place.',
        },
        {
          type: 'p',
          text: 'The first-party Claude API is Anthropic’s own environment and typically receives new features first. **Claude Platform on AWS** is accessed through the customer’s AWS account using Anthropic’s own model IDs and lifecycle; inference is Anthropic-operated, **outside** the AWS boundary. **Amazon Bedrock** offers two integrations: Claude in Amazon Bedrock uses the Messages API at `/anthropic/v1/messages` with broad feature parity, while Claude on Amazon Bedrock (legacy) uses the InvokeModel/Converse APIs with ARN-versioned identifiers. **Google Vertex AI** does the same inside Google Cloud. **Third-party platforms**, such as Microsoft Foundry, embed Claude inside a product the customer already uses.',
        },
        {
          type: 'callout',
          variant: 'note',
          title: 'Microsoft Foundry has two hosting forms',
          body: [
            'Hosted on Azure (currently Claude Opus 4.8, Claude Sonnet 5, and Claude Haiku 4.5, with inference running end-to-end on Azure infrastructure, generally available) and Hosted on Anthropic (all other Foundry Claude models, with inference on Anthropic-operated infrastructure).',
            'Residency assumptions for regulated customers depend on the hosting form of the specific model. Confirm the hosting form and the current model split with Microsoft at build time.',
          ],
        },
        {
          type: 'p',
          text: 'Identity and data location are answered by the platform, not your code. Bedrock uses AWS identity and keeps data inside the customer’s AWS boundary; Vertex uses Google Cloud identity and boundary. Both offer regional routing when residency is a constraint.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Pin the version so an upstream model change is not a silent production change',
        },
        {
          type: 'p',
          text: 'Every Claude model ID points to a specific model snapshot. Aliases such as `opus` and `sonnet` are convenient, but they evolve over time and may resolve to different versions across deployment platforms. A pinned full model ID resolves to a fixed snapshot. Then version the prompt and the asset alongside the code, and keep the prior version available so the regression can be rolled back.',
        },
        {
          type: 'quote',
          label: 'Alias versus pinned snapshot',
          text: '# Pre-4.6 example: a convenience alias can resolve to a new\n# version without you knowing\nmodel = "claude-haiku-4-5"\n\n# Pre-4.6 pinned snapshot: the version is fixed until you change this line\nmodel = "claude-haiku-4-5-20251001"',
        },
        {
          type: 'p',
          text: 'For Claude 4.6 and later, the model ID alone pins to a specific snapshot; for earlier models, the ID plus a date suffix is required. Verify the current convention at platform.claude.com at build time.',
        },
        {
          type: 'p',
          text: '**Promote a version through the eval.** Send a new version to a portion of traffic, compare against the pinned baseline, and promote or roll back on the result. This is where the eval stops being a one-time test and becomes the deployment gate.',
        },
        {
          type: 'table',
          caption: 'The deployment-platform decision table',
          headers: ['Platform', 'Identity and data model', 'When to choose it', 'How versioning is pinned'],
          rows: [
            [
              'First-party Claude API',
              'Anthropic identity and terms.',
              'The customer has no binding cloud or residency constraint and wants the newest capabilities.',
              'Pin the full model ID and keep the prior snapshot.',
            ],
            [
              'Claude Platform on AWS',
              'Anthropic identity and terms, accessed through the customer’s AWS account; inference is Anthropic-operated outside the AWS boundary.',
              'The customer is on AWS but wants Anthropic model IDs, lifecycle, and feature parity with the first-party API.',
              'Pin using the same model ID format as the Claude API. Lifecycle follows Anthropic’s schedule.',
            ],
            [
              'Claude in Amazon Bedrock',
              'Messages API at /anthropic/v1/messages, broad feature parity. Data stays inside the customer’s configured AWS boundary.',
              'The customer is on AWS, wants broad feature parity, and holds a compliance posture there.',
              'Pin the full model ID using the `anthropic.` prefix format. Partner retirement dates differ from Anthropic’s schedule.',
            ],
            [
              'Claude on Amazon Bedrock (legacy)',
              'AWS identity and billing, InvokeModel/Converse APIs with ARN-versioned model identifiers.',
              'The customer is on an existing Bedrock integration and has not migrated to the Messages API.',
              'Pin via ARN-versioned model identifiers per Bedrock’s versioning controls.',
            ],
            [
              'Google Vertex AI',
              'Google Cloud identity, IAM, and billing, with regional or global endpoints for residency.',
              'The customer is on Google Cloud and holds a compliance posture there.',
              'Pin the full model ID before rollout using Vertex’s model ID format.',
            ],
            [
              'Third-party platform',
              'The wrapping product’s identity and billing model. Confirm residency and compliance terms before selecting this path for a regulated customer.',
              'The customer already runs the platform that embeds Claude.',
              'Pin per the platform’s versioning controls.',
            ],
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the deployment that broke when the model alias moved',
        },
        {
          type: 'quote',
          label: 'The production log',
          text: '--:  deploy: model="opus"  status=ok\n--:  alias advanced -> new opus version (no app change)\n--:  parser: KeyError "summary" in response payload\n--:  Error: output shape changed; downstream parse failed\n--:  rollback attempted -> no pinned prior version retained\n--:  incident: hotfix parser; root cause = unpinned deployment',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'What to watch out for',
          body: [
            'An alias resolves to a moving target; a pinned full model ID is a fixed snapshot. Pin the full model ID so an upstream update is something you adopt on purpose. Keep the prior pinned version available so a regression is a rollback rather than a hotfix. Gate the new version through your eval before you promote it, so the output-shape change shows up in a test run instead of in production.',
          ],
        },
      ],
    },

    {
      id: 'dev-m5-comparing',
      eyebrow: 'Teaching · Comparing Platforms',
      duration: '12 min',
      title: 'Comparing platforms on latency, compliance, and cost so the choice survives review',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: '"Right for their cloud" is not yet an argument a procurement and security team will sign off on.',
        },
        {
          type: 'p',
          text: '**Measure latency from the customer’s region.** A platform running in the customer’s own cloud region can reduce round-trip time compared to a first-party endpoint located farther away. The trade-off is timing of access: the first-party API typically receives new capabilities before they reach other platforms. A measurement from your laptop hides the round-trip penalty that appears once the workload runs where the customer is. Within Bedrock specifically, the choice between global and regional endpoints is also the primary residency control and can affect cost.',
        },
        {
          type: 'p',
          text: '**Compliance often determines the platform.** A customer who already holds a certification on one cloud is unlikely to re-certify on another. A regulated financial or healthcare customer treats residency and certifications as pass-or-fail rather than as tradeoffs to balance. The first-party Claude API may not offer EU data residency; EU-only residency typically requires Bedrock or Vertex AI. On third-party platforms such as Microsoft Foundry, hosting is per-model: Azure-hosted Foundry models run inference end-to-end on Azure infrastructure, while Anthropic-hosted Foundry models do not satisfy EU regional residency requirements.',
        },
        {
          type: 'p',
          text: '**What drives total cost beyond the per-token rate.** Per-token rates are broadly aligned across platforms; total cost moves on egress, platform fees, and integration effort. A lower token price can cost more in total once data transfer and integration are factored in.',
        },
        {
          type: 'table',
          caption: 'The cross-platform comparison reference',
          headers: ['Dimension', 'How it differs by platform', 'How to measure it', 'Where each platform wins'],
          rows: [
            [
              'Latency',
              'A platform in the customer’s region shortens the round trip, while the first-party API may reach new features first.',
              'From the customer’s actual region against their actual payload.',
              'An in-region cloud platform wins on round-trip latency, while the first-party API is advantaged on earliest feature access.',
            ],
            [
              'Compliance',
              'Data residency, certifications, and audit controls are determined by the deployment platform.',
              'Against the customer’s existing certification and residency requirements during scoping.',
              'The cloud platform the customer has already certified wins, because it needs no re-certification.',
            ],
            [
              'Cost',
              'Token price, data egress, platform fees, and integration effort all vary.',
              'Total cost per call per platform, including egress and integration, rather than token price alone.',
              'The platform with the lowest total cost for the actual workload wins, which is not always the cheapest token.',
            ],
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the platform picked on familiarity that failed residency',
        },
        {
          type: 'p',
          text: 'A developer building for a regulated customer chose the platform the team had shipped on before. The integration came together quickly. The build passed its functional tests. At the customer’s security review, the reviewer asked where data was being processed. The selected platform did not satisfy the customer’s residency requirements. The placement was rejected, and the integration had to be rebuilt.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Why this broke',
          body: [
            'Familiarity optimized for the wrong test. The easy migration answered whether the team could build quickly. It never answered whether the deployment would pass the customer’s residency review, which was the test that determined whether it could ship.',
            'Checking early costs a scoping conversation, while checking late costs an entire rebuild.',
          ],
        },
      ],
    },

    {
      id: 'dev-m5-boundaries',
      eyebrow: 'Teaching · Trust Boundaries',
      duration: '14 min',
      title: 'Coordinating several Claude deployments with the trust boundaries holding under review',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Connecting components multiplies the places where identity, secrets, and untrusted input can cross. The discipline is to identify every boundary before connecting anything.',
        },
        {
          type: 'p',
          text: 'A multi-component app coordinates more than one Claude capability into a single workflow. An API request might trigger a Claude Code task, which then reaches a customer system through an MCP server. Each component contributes a capability the others do not have. Map which component does what before connecting anything.',
        },
        {
          type: 'p',
          text: '**The trust boundary is where data moves** — the point where data or instructions move from one deployment environment to another. Content fetched by a Claude Code task is untrusted when it reaches the next component. The receiving component should treat it as data, rather than as instructions. Don’t assume a component is trusted simply because it worked correctly on its own.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'The application is only as contained as its most privileged seam',
          body: [
            'Each component operates under an identity. A single component scoped too broadly becomes the weak point even when every other component is properly scoped. Scope each component to the least privilege its role in the workflow requires.',
          ],
        },
        {
          type: 'p',
          text: 'A regulated review requires justifying audit logging, data-residency decisions, and permission controls across the full application. For regulated deployments, Bedrock and Vertex AI are typically the platforms that satisfy regional residency constraints. Confirm ZDR and HIPAA BAA eligibility for each component against the Anthropic Trust Center and platform.claude.com before scoping.',
        },
        {
          type: 'table',
          caption: 'The multi-component integration map',
          headers: ['Component', 'What it contributes', 'The trust boundary at its seam', 'The control that enforces it'],
          rows: [
            [
              'First-party API',
              'Orchestrates the workflow and holds the entry point.',
              'The request entering the app from outside.',
              'Input validation and the identity the call runs under.',
            ],
            [
              'Claude Code task',
              'Runs the agentic work and may fetch external content.',
              'Content it fetched, which is untrusted downstream.',
              'Treat fetched content as data at the next seam.',
            ],
            [
              'MCP server',
              'Reaches a customer system to read or act.',
              'The system access it holds on the app’s behalf.',
              'Scope the server to least privilege and log the access.',
            ],
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Watch out: the seam nobody marked as a boundary',
        },
        {
          type: 'quote',
          label: 'The pairing session',
          text: 'Dev A: All three components pass their own tests. I just wired them up.\nDev B: Where does the Claude Code task send what it fetched?\nDev A: Straight into the next call as part of the prompt. It is just the content we pulled from the customer page.\nDev B: That content is untrusted. If it carries instructions, the next component runs them, because we never mark that seam as a boundary.\nDev A: But each component was trusted on its own.\nDev B: Right, and the seam between them was not. That is the one nobody treated as a boundary, so fetched content crosses as instructions.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'What to watch out for',
          body: [
            'A component that is trusted in isolation does not automatically make the seam leaving it trustworthy. Mark every place data or instructions cross from one deployment environment to another as a boundary. Put a control there that treats fetched content as data rather than instructions.',
            'When a seam cannot be secured, do not ship around it: escalate to a human owner.',
          ],
        },
        {
          type: 'quote',
          label: 'Checkpoint 7 · the completed boundary configuration',
          text: '# components wired: API -> Claude Code task -> MCP server\nfetched = code_task.run(fetch_url=customer_page)\n\n# control on the seam receiving untrusted fetched content\nnext_call(input=treat_as_data(fetched))\n\n# MCP server reaches the customer system (most privileged component)\nmcp_server = MCPServer(\n    system=customer_db,\n    scope=least_privilege_read_only,\n)',
        },
      ],
    },

    {
      id: 'dev-m5-cumulative',
      eyebrow: 'Cumulative · All topics',
      duration: '12 min',
      title: 'Cumulative task: find all three, explain each, write the correction',
      blocks: [
        {
          type: 'quote',
          label: 'The deployment as shipped',
          text: '# Packaged code-review accelerator, deployed for a regulated AWS customer\ndef build_agent():\n    return Agent(\n        model="opus",\n        system_prompt=SYSTEM_PROMPT,\n        repo_path="/home/acme/checkout",\n        tools=[read_file, run_linter],\n    )\n\ndeploy(platform="amazon_bedrock", identity=aws_role_arn)\n\n# multi-component step: Claude Code task fetches a customer page\nfetched = code_task.run(fetch_url=customer_page)\nnext_call(input=fetched)',
        },
        {
          type: 'table',
          headers: ['Layer', 'Defect', 'Why it matters'],
          rows: [
            [
              'Packaging',
              'The `repo_path` is hardcoded instead of parameterized.',
              'A new engagement cannot configure it without editing the loop.',
            ],
            [
              'Deployment/versioning',
              '`model="opus"` is a moving alias, not a pinned full model ID.',
              'There is no retained prior version to roll back to, so an upstream change becomes an untracked production change.',
            ],
            [
              'Multi-component boundary',
              'Fetched content from the Claude Code task is passed straight into `next_call` as if it were trusted instructions.',
              'The seam is never marked as a boundary, so an injection in the fetched page crosses as instructions.',
            ],
          ],
        },
        {
          type: 'quote',
          label: 'The corrected deployment',
          text: 'def build_agent(repo_path):                   # parameterized for reuse\n    return Agent(\n        model="us.anthropic.claude-opus-4-8",     # pinned full Bedrock model ID\n        system_prompt=SYSTEM_PROMPT,\n        repo_path=repo_path,                  # set per engagement\n        tools=[read_file, run_linter],\n    )\n\ndeploy(platform="amazon_bedrock", identity=aws_role_arn,\n       retain_previous_pinned_version=True)   # rollback target kept\n\nfetched = code_task.run(fetch_url=customer_page)\nnext_call(input=treat_as_data(fetched))       # untrusted -> data, not instructions\n\n# verify before promoting: gate the version through the bundled eval\nassert eval_suite.run(model="us.anthropic.claude-opus-4-8") >= baseline_score',
        },
        {
          type: 'p',
          text: 'Parameterizing the repo path restores reuse. Pinning the full Bedrock model ID with a retained previous version restores controlled rollout and gives a rollback target. Wrapping the fetched content in `treat_as_data()` closes the trust boundary. The eval assertion gates promotion on a proven baseline score before the version ships.',
        },
      ],
    },

    {
      id: 'dev-m5-recap',
      eyebrow: 'Recap · Key takeaways',
      duration: '3 min',
      title: 'Key takeaways',
      blocks: [
        {
          type: 'takeaways',
          items: [
            {
              title: 'Package while the build is fresh.',
              text: 'An accelerator keeps the reusable logic, exposes the customer-specific parts as documented parameters, and bundles the eval and the audit log alongside the asset. The knowledge of what is customer-specific is most expensive to reconstruct after the people who held it have moved on.',
            },
            {
              title: 'A maintainer accepts what they can verify.',
              text: 'Match the asset to the channel built for its shape, then clear the review bar: focused code, a runnable example, a test, and a statement of assumptions, with licensing rights confirmed before the technical review. A contribution a reviewer cannot verify sits at the back of the queue.',
            },
            {
              title: 'Pin what ships.',
              text: 'Choose the deployment platform based on the customer’s cloud and compliance posture, then pin the specific model version rather than the moving alias and keep the prior version available. An alias is like asking for the current edition of a book: convenient, but the text can change. Pinning cites a fixed edition.',
            },
            {
              title: 'Measure the dimension that decides the placement.',
              text: 'A platform choice is defensible only when latency, compliance, and cost are measured: latency from the customer’s region, compliance against their existing certification, and cost as the total per call rather than the token price alone. For regulated customers, compliance is usually pass-or-fail.',
            },
            {
              title: 'Mark every seam as a boundary.',
              text: 'A multi-component application is only as contained as its most privileged seam. Scope each component to the minimum access its role requires and treat every point where data crosses as a trust boundary. Trust at a component boundary must be explicitly established — it does not carry over from the component that sent the data.',
            },
          ],
        },
      ],
    },

    {
      id: 'dev-m5-glossary',
      eyebrow: 'Glossary · Key Terms',
      duration: '3 min',
      title: 'Key terms and sources',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Term',
              title: 'Accelerator',
              body: 'A working solution packaged so the next engagement configures it rather than rebuilding it. Customer-specific parts are exposed as documented parameters, the assumptions are written down, and an eval is bundled to prove the asset still works in a new context.',
            },
            {
              eyebrow: 'Term',
              title: 'Contribution readiness',
              body: 'What a maintainer needs to verify a contribution: focused code, a runnable example, a test that proves the behavior, a statement of environment assumptions, and confirmed rights to contribute the code.',
            },
            {
              eyebrow: 'Term',
              title: 'Deployment platform',
              body: 'Where a Claude workload runs. The six are: the first-party Claude API, Claude Platform on AWS, Claude in Amazon Bedrock, Claude on Amazon Bedrock (legacy), Google Vertex AI, and third-party platforms. The same model can differ by platform on identity, data residency, latency, and cost.',
            },
            {
              eyebrow: 'Term',
              title: 'Model alias versus pinned ID',
              body: 'An alias such as opus or sonnet resolves to a recommended version that updates over time and can differ by platform. A pinned full model ID is a fixed snapshot. Pinning is what keeps an upstream model change from being a silent production change.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Anthropic public references (time-sensitive)',
          headers: ['ID', 'Source', 'Used for'],
          rows: [
            [
              'S1',
              'platform.claude.com (Claude in Amazon Bedrock, Claude on Vertex AI)',
              'Deployment platforms, identity and data models, residency routing, regional and global endpoints.',
            ],
            [
              'S2',
              'platform.claude.com (Model IDs and versioning, Model deprecations)',
              'Pinned model IDs, alias resolution, lifecycle and retirement, partner-set schedules.',
            ],
            [
              'S3',
              'anthropic.com and the Anthropic GitHub organization (Cookbook)',
              'Contribution channels, the Cookbook as a home for focused examples, contribution conventions.',
            ],
            [
              'S4',
              'Building with the Claude API (Skilljar)',
              'Eval datasets, graders, and the evaluation pipeline used as the deployment gate.',
            ],
            [
              'S5',
              'Claude Code 101 In Action (Skilljar)',
              'Claude Code agentic tasks and MCP server roles in a multi-component workflow.',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'You can now take a working build all the way to a deployable, auditable asset.',
          body: [
            'Package it, contribute it, place and version it, defend that placement, and hold the boundaries together under review.',
          ],
        },
      ],
    },
  ],

  reviewQuestions: [
    {
      id: 'dev-m5-rq-1',
      question:
        'Checkpoint 2 · Case A: a focused tool that wraps a single API into a clean function. Which channel is built for it?',
      options: [
        { id: 'A', text: "The tool's own repository" },
        {
          id: 'B',
          text: 'The Cookbook, but only after the reusable pattern is stripped out as a focused example',
        },
        { id: 'C', text: "The Cookbook example's own repository" },
      ],
      correctOptionId: 'A',
      rationale:
        'Open-source MCP servers and tools each live in their own repository with their own contribution conventions.',
    },
    {
      id: 'dev-m5-rq-2',
      question:
        'Checkpoint 2 · Case B: a full customer-service application shared whole, including its UI and deployment scripts. Which channel is built for it?',
      options: [
        { id: 'A', text: "The tool's own repository" },
        {
          id: 'B',
          text: 'The Cookbook, but only after the reusable pattern is stripped out as a focused example',
        },
        { id: 'C', text: "The Cookbook example's own repository" },
      ],
      correctOptionId: 'B',
      rationale:
        'The Cookbook is set up to review one focused pattern rather than an entire application, so a whole application does not belong as-is; the reusable pattern inside it goes there as a focused example.',
    },
    {
      id: 'dev-m5-rq-3',
      question:
        'Checkpoint 2 · Case C: a one-line fix to an existing Cookbook example, carried in from a customer engagement. Which channel is built for it?',
      options: [
        { id: 'A', text: "The tool's own repository" },
        {
          id: 'B',
          text: 'The Cookbook, but only after the reusable pattern is stripped out as a focused example',
        },
        { id: 'C', text: "The Cookbook example's own repository" },
      ],
      correctOptionId: 'C',
      rationale:
        'A fix to an existing Cookbook example belongs in that example’s own repository, following its contribution conventions.',
    },
    {
      id: 'dev-m5-rq-4',
      question:
        'Checkpoint 2 · Case A: the focused API wrapper, submitted as the function and nothing else. Which readiness item is missing?',
      options: [
        { id: 'A', text: 'A test that proves the wrapper behaves' },
        {
          id: 'B',
          text: 'Reduction to a single focused pattern, because a whole application does not fit a review built for one pattern',
        },
        {
          id: 'C',
          text: 'The rights check, because engagement code can carry a licensing constraint that blocks the merge before any technical review',
        },
      ],
      correctOptionId: 'A',
      rationale:
        'The code is already focused and the channel is right; what a maintainer cannot do is verify the behavior without a test to run.',
    },
    {
      id: 'dev-m5-rq-5',
      question:
        'Checkpoint 2 · Case B: the full customer-service application. Which readiness item is missing?',
      options: [
        { id: 'A', text: 'A test that proves the wrapper behaves' },
        {
          id: 'B',
          text: 'Reduction to a single focused pattern, because a whole application does not fit a review built for one pattern',
        },
        {
          id: 'C',
          text: 'The rights check, because engagement code can carry a licensing constraint that blocks the merge before any technical review',
        },
      ],
      correctOptionId: 'B',
      rationale:
        'A submission that large does not fit what reviewers are looking for and will stall. The reusable pattern has to be stripped out first.',
    },
    {
      id: 'dev-m5-rq-6',
      question:
        'Checkpoint 2 · Case C: the one-line fix carried in from a customer engagement. Which readiness item is missing?',
      options: [
        { id: 'A', text: 'A test that proves the wrapper behaves' },
        {
          id: 'B',
          text: 'Reduction to a single focused pattern, because a whole application does not fit a review built for one pattern',
        },
        {
          id: 'C',
          text: 'The rights check, because engagement code can carry a licensing constraint that blocks the merge before any technical review',
        },
      ],
      correctOptionId: 'C',
      rationale:
        'Licensing and attribution decide whether a contribution can be accepted at all, which is why they come before the technical review. Engagement code may carry constraints on where it can go.',
    },
    {
      id: 'dev-m5-rq-7',
      question:
        'Checkpoint 3 · A regulated EU bank wants an agent that summarizes customer call transcripts for its support team. Which is a valid functional requirement?',
      options: [
        { id: 'A', text: 'The agent should be fast and accurate.' },
        { id: 'B', text: 'The agent produces a summary that a human approves before it is stored.' },
        { id: 'C', text: 'The system must be built using an approved cloud provider.' },
        { id: 'D', text: 'Transcript data must not leave the EU.' },
      ],
      correctOptionId: 'B',
      rationale:
        'B is checkable and tied to a specific business process constraint (human-in-the-loop review). A is not checkable. C and D are infrastructure requirements, not functional ones.',
    },
    {
      id: 'dev-m5-rq-8',
      question:
        'Checkpoint 3 · From the same scenario, which is a valid infrastructure requirement?',
      options: [
        {
          id: 'A',
          text: 'The agent must produce summaries quickly enough for support staff to act on them.',
        },
        { id: 'B', text: 'The agent summarizes transcripts using a pre-approved prompt template.' },
        { id: 'C', text: 'Transcript data is processed in the EU.' },
        { id: 'D', text: 'A human reviews each summary before it is stored.' },
      ],
      correctOptionId: 'C',
      rationale:
        'C is checkable and tied to a specific regulatory constraint (data residency). A is not checkable. B is a design choice, not an infrastructure requirement. D is a functional requirement.',
    },
    {
      id: 'dev-m5-rq-9',
      question:
        'Checkpoint 4 · Which lifecycle phase does "pinning the full model ID and keeping the prior version" belong to?',
      options: [
        { id: 'A', text: 'Requirements' },
        { id: 'B', text: 'Design' },
        { id: 'C', text: 'Test' },
        { id: 'D', text: 'Deploy' },
      ],
      correctOptionId: 'D',
      rationale:
        'Pinning the version and retaining a rollback target are release-process decisions, which sit in the deploy phase.',
    },
    {
      id: 'dev-m5-rq-10',
      question:
        'Checkpoint 4 · Which lifecycle phase does "gating promotion on the eval result before a version goes to production" belong to?',
      options: [
        { id: 'A', text: 'Requirements' },
        { id: 'B', text: 'Design' },
        { id: 'C', text: 'Test' },
        { id: 'D', text: 'Deploy' },
      ],
      correctOptionId: 'D',
      rationale:
        'Writing the eval suite and rubric is test; gating promotion on its result is deploy.',
    },
    {
      id: 'dev-m5-rq-11',
      question:
        'Checkpoint 4 · Which lifecycle phase does "deciding data must be processed in a specific region" belong to?',
      options: [
        { id: 'A', text: 'Requirements' },
        { id: 'B', text: 'Design' },
        { id: 'C', text: 'Test' },
        { id: 'D', text: 'Operate' },
      ],
      correctOptionId: 'A',
      rationale:
        'The residency rule is a requirement. The platform chosen to satisfy it is the design decision that follows.',
    },
    {
      id: 'dev-m5-rq-12',
      question:
        'Checkpoint 4 · Which lifecycle phase does "instrumenting token cost and latency per call in production" belong to?',
      options: [
        { id: 'A', text: 'Requirements' },
        { id: 'B', text: 'Design' },
        { id: 'C', text: 'Deploy' },
        { id: 'D', text: 'Operate' },
      ],
      correctOptionId: 'D',
      rationale:
        'Instrumenting cost, latency, and errors and enforcing guardrails is the operate phase.',
    },
    {
      id: 'dev-m5-rq-13',
      question:
        'Checkpoint 4 · Which lifecycle phase does "choosing Amazon Bedrock because the customer holds its compliance posture there" belong to?',
      options: [
        { id: 'A', text: 'Requirements' },
        { id: 'B', text: 'Design' },
        { id: 'C', text: 'Test' },
        { id: 'D', text: 'Operate' },
      ],
      correctOptionId: 'B',
      rationale:
        'Choosing the platform, the model, and the trust boundaries is the design phase. The residency rule that drove it was the requirement.',
    },
    {
      id: 'dev-m5-rq-14',
      question:
        'Checkpoint 5 · A customer runs AWS with a data-residency requirement and needs to be able to roll back a model update. Which platform?',
      options: [
        { id: 'A', text: 'First-party API' },
        { id: 'B', text: 'Amazon Bedrock' },
        { id: 'C', text: 'Google Vertex AI' },
      ],
      correctOptionId: 'B',
      rationale:
        'Bedrock keeps identity and data inside the AWS boundary the customer already cleared.',
    },
    {
      id: 'dev-m5-rq-15',
      question: 'Checkpoint 5 · Which identity reference belongs in that configuration?',
      options: [
        { id: 'A', text: 'AWS identity reference' },
        { id: 'B', text: 'Anthropic API key' },
      ],
      correctOptionId: 'A',
      rationale:
        'Bedrock uses AWS identity, which is the identity model the customer has already cleared for this workload.',
    },
    {
      id: 'dev-m5-rq-16',
      question: 'Checkpoint 5 · Which model reference belongs in that configuration?',
      options: [
        { id: 'A', text: 'A pinned full model ID' },
        { id: 'B', text: 'A moving alias' },
      ],
      correctOptionId: 'A',
      rationale:
        'The pinned full Bedrock model ID (with the `anthropic.` prefix) makes an upstream change something you adopt deliberately rather than something that arrives overnight.',
    },
    {
      id: 'dev-m5-rq-17',
      question: 'Checkpoint 5 · Which rollback setting belongs in that configuration?',
      options: [
        { id: 'A', text: 'Retain the prior pinned version' },
        { id: 'B', text: 'No retention' },
      ],
      correctOptionId: 'A',
      rationale:
        'Retaining the prior version gives you a rollback target, which is the second half of the requirement alongside residency.',
    },
    {
      id: 'dev-m5-rq-18',
      question:
        'Checkpoint 6 · A trace shows a platform chosen on familiarity, latency measured at 180ms from a dev laptop, a customer in eu-west, and a compliance check requiring EU-only residency that the platform failed. Which is the targeted fix?',
      options: [
        {
          id: 'A',
          text: 'Optimize the parser to cut the 180ms latency measured on the laptop.',
        },
        {
          id: 'B',
          text: 'Remeasure latency from EU-west and select the platform whose region satisfies EU-only residency.',
        },
        { id: 'C', text: 'Add a caching layer to reduce per call cost on the selected platform.' },
      ],
      correctOptionId: 'B',
      rationale:
        'The mechanism is a residency mismatch. The latency number hides it because it was measured from the wrong place. The fix is to measure latency from the customer’s region and choose the platform that meets EU-only residency, which is the dimension that determines this placement.',
    },
  ],
};
