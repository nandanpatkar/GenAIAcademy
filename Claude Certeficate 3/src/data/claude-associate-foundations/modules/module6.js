/* Module 6 — Governance, Risk & Responsible Use. From MODULE 6.txt. */

const disclaimer = {
  type: 'callout',
  variant: 'disclaimer',
  title: 'Disclaimer / Notice for Educational Content',
  body: [
    "We built this Associate course Module 6: Governance, Risk & Responsible Use to help you get real work done with Claude. Treat it as educational content. It doesn't constitute legal, financial, or other professional advice, so adapt what you learn to your own situation. Our products and services evolve quickly, so certain content may contain errors or be outdated; remember to verify on Anthropic's website or docs. Examples and scenarios used in the course are illustrative and often fictitious. If the course material mentions a company or product, it doesn't mean Anthropic endorses them, they endorse Anthropic, or that we're affiliated. Also note your use of Anthropic products and services is covered by our terms, policies and documentation; if anything in this course conflicts with them, they control.",
  ],
};

export const module6 = {
  id: 'module-6',
  number: 6,
  title: 'Governance, Risk & Responsible Use',
  shortTitle: 'Governance',
  summary: 'Apply use-case, data, policy, and ethics judgment responsibly.',
  duration: '~50 min',
  lede: 'Responsible use is a set of judgments you make every day.',
  objectives: [
    'Identify appropriate and inappropriate use cases.',
    'Apply data sensitivity, privacy, and regulatory considerations to Claude use.',
    'Follow organizational AI policies and governance standards.',
    'Understand the ethical implications of AI usage.',
  ],

  sections: [
    {
      id: 'm6-toc',
      eyebrow: 'Associate Certification · Module 6',
      title: 'Table of contents',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: "One inappropriate use case can freeze an entire organization's AI program. Sensitive data uploaded to the wrong place, an untrusted Skill granted broad access, a quiet policy violation at the wrong moment: any of these can trigger a freeze that costs every team the productivity they had gained. Governance is what keeps adoption moving safely, and it is exercised by practitioners, one decision at a time, not by a policy binder on a shelf.",
        },
        {
          type: 'table',
          headers: ['Screen', 'Length'],
          rows: [
            ['Module Introduction', '1 screen'],
            ['Appropriate vs Inappropriate Use Cases', '1 screen'],
            ['Skill Trust & Feature-Level Risk', '1 screen'],
            ['Data Sensitivity, Privacy & Feature Controls', '1 screen'],
            ['Organizational Policies & Diligence', '1 screen'],
            ['Ethical Implications', '1 screen'],
            ['Module 6 Quiz', '2 screens'],
            ['Module Complete', '1 screen'],
          ],
        },
      ],
    },

    {
      id: 'm6-intro',
      eyebrow: 'Introduction',
      duration: '4 min',
      title: 'Governance, Risk & Responsible Use',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: "One inappropriate use case can freeze an entire organization's AI program.",
        },
        {
          type: 'p',
          text: 'Sensitive data uploaded to the wrong place, an untrusted Skill granted broad access, a quiet policy violation at the wrong moment: any of these can trigger a freeze that costs every team the productivity they had gained. Governance is what keeps adoption moving safely, and it is exercised by practitioners, one decision at a time, not by a policy binder on a shelf.',
        },
        {
          type: 'p',
          text: 'That is the framing for this module: governance is a practitioner skill. The policy sets the boundary, but you are the one who decides, in the moment, whether this use case, this Skill, this upload is appropriate. Two competencies from the AI Fluency Framework govern those decisions. Diligence is about ownership and verification. Delegation supplies the criteria for judging whether a use case is appropriate at all.',
        },
        { type: 'h', level: 3, text: 'The deal in this module' },
        {
          type: 'p',
          text: 'Responsible use is a set of judgments you make every day. Learn to classify use cases against the Delegation criteria, vet a Skill the way you would any software, handle data by its sensitivity using the right feature controls, apply organizational policy as a sustained habit, and evaluate output for bias and fairness as part of routine review.',
        },
        disclaimer,
      ],
    },

    {
      id: 'm6-use-cases',
      eyebrow: 'Teaching · Appropriate Use Cases',
      duration: '10 min',
      title: 'Appropriate vs Inappropriate Use Cases',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Deciding whether a use case is appropriate is a structured evaluation, not a gut feeling.',
        },
        {
          type: 'p',
          text: 'The same Delegation criteria that map workflow steps also screen whole use cases: reversibility, consequence of error, the need for human creativity or empathy, and accountability. Running them every time turns a vague unease into a defensible call.',
        },
        {
          type: 'table',
          caption: 'Delegation criteria for screening',
          headers: ['Criterion', 'The question to ask'],
          rows: [
            [
              'Reversibility',
              'Can a wrong output be caught and undone before it causes harm? Irreversible consequences raise the bar sharply.',
            ],
            [
              'Consequence of error',
              'What is the cost if the output is wrong? Higher consequence demands more human control or rules the use case out.',
            ],
            [
              'Need for human creativity or empathy',
              'Does the task require judgment, relationship, or care that AI cannot supply? Some work should stay human regardless of capability.',
            ],
            [
              'Accountability',
              'Who is answerable for the outcome, and can that accountability be exercised over an AI-produced result?',
            ],
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'The criteria interact: name the load-bearing one',
        },
        {
          type: 'p',
          text: 'The four criteria are not a checklist where any single failure ends the discussion. They interact. A task can be low-consequence and reversible and still require human review. Accountability cannot be transferred to a model. Drafting a condolence note to a client is low-stakes and fully reversible, yet the relationship element means a person should own it. Conversely, a task can be high consequence but still appropriate with the right gate: a financial summary that feeds a decision is consequential, but if a named reviewer signs off before it is used, the accountability and reversibility are restored. The practical rule is to run all four, then ask which one is load bearing for this specific use case. The load-bearing criterion is the one that, if it is changed, would move the use case between classifications. Naming it is what makes your classification defensible to a risk or compliance reviewer.',
        },
        { type: 'h', level: 3, text: 'Three classifications' },
        {
          type: 'p',
          text: 'Each proposed use case sorts into one of three, with documented rationale:',
        },
        {
          type: 'ul',
          items: [
            '**Fully appropriate.** Reversible, low consequence, no special human element. Delegate with normal review.',
            '**Appropriate with human review.** Useful for AI assistance, but the stakes or accountability require a human gate. Define the gate explicitly.',
            '**Inappropriate.** The consequence, irreversibility, or human-element requirement means AI should not perform this. Articulate why and name the human role that must own it.',
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'The gate is the classification',
          body: [
            '"Appropriate with human review" is the classification people most often get wrong. Often, they stop at the label and never specify the gate. The gate is not "someone will check it." A defined gate establishes three things: who reviews (the role with the accountability, not whoever is free), what they verify (the specific risk the review exists to catch, such as factual accuracy, fairness, or policy compliance), and when in the workflow the review happens (before the output is used, not after). "A manager reviews the shortlist for adverse-impact patterns before any candidate is contacted" is a defined gate. "We will keep a human in the loop" is not. If you cannot state the gate in that who/what/when form, the use case is not yet ready to run.',
          ],
        },
        { type: 'h', level: 3, text: 'Worked example: a use-case portfolio' },
        {
          type: 'table',
          headers: ['Use case', 'The call and the reasoning'],
          rows: [
            [
              'Draft internal FAQ from approved policy docs',
              'Fully appropriate. Reversible, low stakes, factual grounding available.',
            ],
            [
              'Summarize candidate resumes to a shortlist',
              'Appropriate with human review, and only with bias safeguards. Consequential, fairness-sensitive, accountability rests with the hiring manager; the human owns the selection.',
            ],
            [
              'Generate a final medical or legal determination',
              'Inappropriate. Irreversible consequence and a professional accountability that cannot transfer to a tool. The human professional must make and own the determination.',
            ],
            [
              'Draft customer-facing responses to billing complaints',
              'This is the hard one, because it sits on the line. It is reversible if the response is reviewed before sending, moderately consequential (a wrong answer about a charge erodes trust and can have regulatory weight in some industries), and partly relationship sensitive. The right classification is appropriate with human review, and the load-bearing criterion is accountability: the company owns what it tells a customer about their money. The defined gate: a support agent reads each drafted response for accuracy against the actual account record and adjusts tone before it sends. The interesting governance work is not the obvious "yes" or "no" use cases; it is naming the gate for the ones in the middle.',
            ],
          ],
        },
        {
          type: 'p',
          text: 'Articulating why a use case fails the test, and what human role must be retained, is the deliverable. "It feels risky" does not travel; "irreversible consequence plus non-transferable accountability" does.',
        },
      ],
    },

    {
      id: 'm6-skill-trust',
      eyebrow: 'Teaching · Skill Trust & Feature Risk',
      duration: '8 min',
      title: 'Skill Trust and Feature-Level Risk',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'A Skill is software. It can access what you give Claude access to during a session and can take actions through code execution. A Skill from an untrusted source is therefore a real risk, and the practical answer to that risk is a source-and-permissions check before you enable it.',
        },
        { type: 'h', level: 3, text: 'Why untrusted Skills are a risk' },
        {
          type: 'p',
          text: 'Because a Skill runs procedures and can touch data and tools available in the session, one from an unknown source could mishandle data or take unintended actions. "Skills are a black box" is a common organizational worry, and the answer is not blind trust or blanket bans; it is a repeatable trust evaluation.',
        },
        { type: 'h', level: 3, text: 'Trust evaluation before enabling' },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Trust check',
              title: 'Source',
              body: 'Who published this Skill? Anthropic-provided and internally-approved Skills are the lower-risk starting point; an unknown third-party Skill demands more scrutiny.',
            },
            {
              eyebrow: 'Trust check',
              title: 'Reach',
              body: 'Skills do not request permissions; a Skill inherits whatever access the session it runs in already has. Ask instead: what could this Skill reach in the sessions where it will run, and is that exposure proportional to the task? Audit the bundle\'s contents (instructions, dependencies, bundled files) before enabling; a formatting Skill whose instructions roam far beyond formatting is a red flag.',
            },
            {
              eyebrow: 'Trust check',
              title: 'Appropriateness',
              body: 'Is this Skill the right tool for the task at all, or is it more capability than the job needs?',
            },
          ],
        },
        { type: 'h', level: 3, text: 'Internal does not mean vetted' },
        {
          type: 'p',
          text: 'Source is not a simple trusted-or-untrusted switch. The hardest case is the Skill built by another team inside your own organization. "Internal" feels safe, but it does not mean vetted: the team that built it may have given it broad permission for their own convenience or built it against an older policy. Treat an internal Skill from outside your team the way you would treat software from a sister department, confirm with the publisher what it accesses and why, and check that its permissions still match current policy, before you enable it on your own data. The trust question is "do I know what it does and does its access match the job?"',
        },
        {
          type: 'p',
          text: 'Failing the trust check does not always mean "never use it." It means do not enable it to your authority alone. The three outcomes are:',
        },
        {
          type: 'steps',
          items: [
            {
              title: 'Enable',
              text: 'Source, permissions, and appropriateness all clear.',
            },
            {
              title: 'Escalate',
              text: 'The Skill is useful but the source is unknown or the permissions look broad so route it to your admin or security function for review.',
            },
            {
              title: 'Decline',
              text: 'The permissions are clearly disproportionate or the source cannot be established, and no review would change that.',
            },
          ],
        },
        {
          type: 'p',
          text: 'The judgment is identifying which of the three applies.',
        },
        { type: 'h', level: 3, text: 'Worked example: vetting two Skills' },
        {
          type: 'compare',
          items: [
            {
              tone: 'positive',
              label: 'Enable',
              title: 'An Anthropic-provided document formatter',
              body: 'Source is trusted, permissions match the task (document handling), appropriate for the need. Enable it.',
            },
            {
              tone: 'negative',
              label: 'Do not enable',
              title:
                "A third-party 'analytics booster' from an unknown publisher requesting broad data access",
              body: 'Unknown source, disproportionate permissions for the stated purpose. Do not enable without your organization\'s review. Treat it the way you would any unvetted installed software.',
            },
          ],
        },
        {
          type: 'p',
          text: "The rule generalizes: evaluate a Skill's source and permissions like you would any software you were about to install on a work machine.",
        },
        {
          type: 'p',
          text: 'Skills are the sharpest version of feature-level risk, but the same proportionality habit applies to any capability you turn on. Before enabling a feature that can read your data or act on it, a connector, a tool, or an integration, ask the same three questions: who provides it, what does it access, and is that access proportional to what you need. The principle is least privilege: grant the narrowest access that lets the job get done and revisit it when the job changes.',
        },
      ],
    },

    {
      id: 'm6-data',
      eyebrow: 'Teaching · Data Sensitivity & Controls',
      duration: '12 min',
      title: 'Data Sensitivity, Privacy & Feature Controls',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Before any data enters any feature, you should know its sensitivity.',
        },
        {
          type: 'p',
          text: 'Data classification is the habit that prevents leakage, and the feature-specific controls, Incognito, Memory management, and sandbox awareness, are how you act on that classification when persistence or processing is not appropriate.',
        },
        { type: 'h', level: 3, text: 'Classify before you upload' },
        {
          type: 'p',
          text: 'Sort data into what is safe to use, what needs review first, and what stays out entirely. Public and internal-low-sensitivity material is generally fine; regulated, confidential, or personal data needs a deliberate check against policy before it goes anywhere near a feature. When you are unsure, the safe default is to ask before uploading. Most teams need three tiers they can apply in seconds:',
        },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Green',
              title: 'Safe to use',
              body: 'Published material, anonymized or aggregated data, or internal documents already cleared for wide sharing.',
            },
            {
              eyebrow: 'Yellow',
              title: 'Review first',
              body: 'Internal documents not meant to leave the company, anything with names or contact details, or draft material tied to a deal or product not yet announced.',
            },
            {
              eyebrow: 'Red',
              title: 'Keep out unless an approved path exists',
              body: 'Regulated data (health, financial, government), credentials and secrets, or anything covered by a confidentiality obligation to a third party.',
            },
          ],
        },
        {
          type: 'p',
          text: 'When you are unsure between two tiers, treat the data as the more sensitive one until you can confirm otherwise.',
        },
        { type: 'h', level: 3, text: 'Redaction and anonymization' },
        {
          type: 'p',
          text: 'When the substance of a task does not require the sensitive specifics, remove them. Redacting names, account numbers, or identifiers before uploading lets you get the analytical value without exposing the data. Building this habit prevents the most common form of accidental leakage. Redaction works when the task does not depend on the identifiers. Asking for trends across a customer list does not require the customers\' names; replacing them with "Customer 1, Customer 2" loses nothing the analysis needs.',
        },
        { type: 'h', level: 4, text: 'Two redaction failure modes' },
        {
          type: 'ul',
          items: [
            '**Partial redaction.** Removing the name but leaving an account number, a rare job title, or a specific date can still identify someone, especially in a small population. Strip every field that could lead to identification.',
            '**Redaction that breaks the task.** If the work genuinely needs the sensitive specifics, redaction is not the answer. It is better to confirm an approved path for that data or keep it out entirely. Redaction is a tool for the case where sensitivity and necessity do not overlap; it is not a way to make any data safe.',
          ],
        },
        { type: 'h', level: 3, text: 'Feature-specific controls' },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Control',
              title: 'Code execution sandbox',
              body: 'Code runs in a sandboxed environment, and uploaded files are processed there. Review what you upload before running analysis.',
            },
            {
              eyebrow: 'Control',
              title: 'Memory persistence',
              body: 'Memory carries information across sessions. For sensitive work, that persistence may be exactly what you do not want.',
            },
            {
              eyebrow: 'Control',
              title: 'Incognito mode',
              body: "Keeps the session out of your chat history and Memory. Incognito chats still follow your organization's data-retention policies and can appear in organizational data exports. Memory exclusion and data retention are separate controls. Use it for sensitive conversations or confidential inputs that should not surface in history or Memory.",
            },
            {
              eyebrow: 'Control',
              title: 'Org-level Memory controls',
              body: 'Team plans do not have organization-level controls for memory features; on Enterprise, Owners and Primary Owners hold the org-wide Memory controls, including disabling memory for the organization. Know which plan you are on and who controls the setting. Verify current behavior at the Claude Help Center memory article (support.claude.com).',
            },
          ],
        },
        {
          type: 'p',
          text: "The controls are only useful if you reach for the right one at the right moment. The habit is: classify first, then pick the control that matches. Green data needs no special control. Yellow data that should not persist across sessions is the case for Incognito, confidential but not regulated, where you want the analysis now without it entering Memory or chat history (your organization's underlying data-retention policy still applies). Red data needs an approved entry point confirmed before anything is uploaded, regardless of Memory settings. The common error is using Incognito and assuming it makes sensitive data safe.",
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Incognito does not make red data safe',
          body: [
            'Incognito controls whether something gets remembered; it does not confirm whether the data was allowed here in the first place. For regulated data, that second question comes first.',
          ],
        },
        { type: 'h', level: 3, text: 'Awareness across entry points, in plain terms' },
        {
          type: 'p',
          text: 'Different claude.ai entry points may handle data retention differently depending on how your organization has configured Claude. You do not need to memorize the technical detail; you need the habit of asking, when in doubt about a given entry point, before uploading. The plain rule: know your data\'s sensitivity first, then match the feature and its controls to it.',
        },
        { type: 'h', level: 3, text: 'Worked example: four data decisions' },
        {
          type: 'table',
          caption: 'Applying the tiers',
          headers: ['Data', 'Decision'],
          rows: [
            [
              'Anonymized survey data for trend analysis',
              'Green. Safe to upload; use code execution for verified counts. No personal identifiers present.',
            ],
            [
              'A confidential M&A document for summarization',
              'Yellow. Needs review against policy first, and Incognito so it does not enter Memory or chat history (it remains subject to organizational data retention). If policy prohibits the entry point, it stays out.',
            ],
            [
              'A spreadsheet of customer PII for cleanup',
              'Redact or anonymize the identifiers before upload, or keep it out entirely and confirm the approved path with your admin.',
            ],
            [
              'Patient records for a healthcare workflow summary',
              'This is red and it is the case Incognito does not solve. The data is regulated, so the first question is whether this entry point is approved for protected health information at all. If your organization has not confirmed an approved, compliant path for that data, the correct action is to stop and escalate to your admin. For regulated data, "is this allowed here" is settled before "how do I handle it here."',
            ],
          ],
        },
      ],
    },

    {
      id: 'm6-policies',
      eyebrow: 'Teaching · Organizational Policies',
      duration: '8 min',
      title: 'Organizational Policies and Diligence as a Habit',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'A policy that is followed only when someone is watching is not governance.',
        },
        {
          type: 'p',
          text: 'The gap between what the policy says and what people do, is exactly where risk lives. Diligence is the habit of applying the governance framework consistently, and of auditing real usage against it to close the gaps.',
        },
        { type: 'h', level: 3, text: 'Apply governance consistently' },
        {
          type: 'p',
          text: 'Governance compliance is a sustained habit, not a one-time acknowledgment. The standard is to apply the framework on the routine, low-visibility decisions, not only on the obvious high-stakes ones, because the routine decisions are where drift accumulates unnoticed.',
        },
        { type: 'h', level: 3, text: 'Audit usage against policy' },
        {
          type: 'p',
          text: 'Periodically compare what your team does or is planning to do with Claude against what the policy requires. Where they diverge, you have found a Diligence gap to close: a data type being uploaded that should not be, a review step being skipped, a Skill enabled without vetting. Spotting and closing those gaps is important work.',
        },
        { type: 'h', level: 3, text: 'Stay current' },
        {
          type: 'p',
          text: 'Policies and capabilities both evolve. A practice that was compliant last quarter may not be after a policy update or a new feature. Staying current with both is part of the habit, so your judgment keeps pace with the tools and the rules.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Worked example: a mini usage audit — three gaps, three closeable actions',
        },
        {
          type: 'p',
          text: "A team lead reviews a month of the team's Claude use against policy and finds three gaps: a marketer uploaded an unreleased product spec to a non-approved entry point, a Skill was enabled without a source check, and a recurring client report skipped its required human-review gate twice under deadline pressure.",
        },
        {
          type: 'p',
          text: 'None was malicious; all were drift. The fixes are habit-level: a reminder on approved entry points, a Skill-vetting step added to the Project setup, and a non-negotiable review gate on client deliverables. The audit converted invisible risk into three closeable actions.',
        },
      ],
    },

    {
      id: 'm6-ethics',
      eyebrow: 'Teaching · Ethical Implications',
      duration: '8 min',
      title: 'Ethical Implications: Bias, Fairness, Transparency',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Ethical risk does not announce itself; it hides in ordinary outputs.',
        },
        {
          type: 'p',
          text: 'A summary that quietly favors one group, a recommendation built on a biased framing, an AI-assisted document presented as fully human-authored: these are routine outputs with ethical weight. Evaluating for bias, fairness, and transparency belongs in routine review, not a separate ethics exercise.',
        },
        { type: 'h', level: 3, text: 'Recognize bias and fairness risk' },
        {
          type: 'p',
          text: 'AI-assisted work products can carry bias from the prompt, the framing, or the underlying patterns in how language is generated. In people-facing work, hiring, evaluation, communications to specific groups, check whether the output treats people fairly and whether a framing has tilted the result. The risk is highest where the stakes for individuals are highest.',
        },
        { type: 'h', level: 3, text: 'Transparency and disclosure' },
        {
          type: 'p',
          text: 'Know when to disclose AI assistance. Some contexts and some organizational policies require it; others treat it as routine tooling. The obligation depends on the setting and the audience, and the responsible default, when unsure, is to disclose rather than to conceal.',
        },
        { type: 'h', level: 3, text: 'Reasoning through ambiguous cases' },
        {
          type: 'p',
          text: 'Many ethical questions have no rule that settles them cleanly. A structured approach helps: name who is affected, what could go wrong, what the fair outcome looks like, and what disclosure the situation calls for. Reasoning it through, and documenting the reasoning, is the professional standard when no policy gives a direct answer.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'When reasoning alone is not enough',
          body: [
            'Structured reasoning handles most ambiguous cases, but some situations require more than individual judgment. If the affected population is large, the potential harm is significant, or the ethical question touches areas your team does not have standing to resolve the right move is to escalate rather than decide alone. Your organization\'s AI governance or ethics function exists for exactly these cases. Escalating the question with documented reasoning is more useful than bringing a verdict: it shows you applied the framework, identified where it ran out, and flagged the gap for the right reviewer.',
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Worked example: an ambiguous case — performance-review summaries',
        },
        {
          type: 'p',
          text: 'A manager uses Claude to draft performance-review summaries from their own notes. Is this appropriate? Working the reasoning: those affected are the employees; the risk is that a generated phrasing introduces an unfair or inconsistent tone across reviews; the fair outcome requires the manager to verify each summary reflects the actual notes and applies a consistent standard; and the setting may call for disclosing that AI assisted the drafting.',
        },
        {
          type: 'p',
          text: 'The conclusion is appropriate with human review and a fairness check, not a blanket yes or no. The reasoning, not the verdict alone, is what makes the decision defensible.',
        },
      ],
    },

    {
      id: 'm6-takeaways',
      eyebrow: 'Key Takeaways',
      duration: '5 min',
      title: 'Five things that hold across this module',
      blocks: [
        {
          type: 'takeaways',
          items: [
            {
              title: 'Governance is a practitioner skill.',
              text: 'Responsible use is exercised one decision at a time, by you, not by the policy binder.',
            },
            {
              title: 'Screen use cases with the Delegation criteria.',
              text: 'Reversibility, consequence, human element, and accountability classify a use case as appropriate, appropriate-with-review, or inappropriate.',
            },
            {
              title: 'A Skill is software.',
              text: 'Evaluate source and permissions before enabling, the way you would any installed software.',
            },
            {
              title: 'Know data sensitivity before it enters a feature.',
              text: 'Classify first, then use Incognito, Memory controls, and redaction to match the handling to the sensitivity.',
            },
            {
              title: 'Ethical risk hides in ordinary outputs.',
              text: 'Evaluate for bias, fairness, and disclosure as part of routine review, and reason ambiguous cases through.',
            },
          ],
        },
      ],
    },

    {
      id: 'm6-sources',
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
            'AI Fluency Framework: Diligence and Delegation competencies',
            'Claude Help Center: Skills trust, Memory, Incognito, code execution data handling, support.claude.com',
            'Code execution sandbox egress and file-handling specifics: confirm current behavior before finalizing Lesson 4',
            'Data retention by entry point and any compliance-scope language (HIPAA, FedRAMP, ZDR): escalate to the Anthropic account team for confirmation before finalizing',
          ],
        },
      ],
    },
  ],

  reviewQuestions: [
    {
      id: 'm6-rq-1',
      question:
        'A team proposes using Claude to produce final, unreviewed determinations on benefits eligibility. How should this use case be classified?',
      options: [
        { id: 'A', text: 'Fully appropriate, since it saves time' },
        { id: 'B', text: 'Appropriate with light human review' },
        {
          id: 'C',
          text: 'Inappropriate: irreversible consequence and non-transferable accountability require a human to own the determination',
        },
        { id: 'D', text: 'Appropriate if a more capable model is used' },
      ],
      correctOptionId: 'C',
      rationale:
        'Irreversibility plus non-transferable professional accountability makes final unreviewed determinations inappropriate for AI.',
    },
    {
      id: 'm6-rq-2',
      question:
        "A colleague shares a Skill they found in a public forum that converts meeting notes into a summary. Skills do not request permissions; once enabled, a Skill runs with whatever access your session already has, and nothing in this one's bundled instructions limits it to meeting notes. What is the right action?",
      options: [
        { id: 'A', text: 'Enable it; a colleague vouched for it, so the source is trusted' },
        {
          id: 'B',
          text: 'Evaluate the source and think through what the Skill could reach in your session; the publisher is unknown and a Skill inherits the session\'s full access, so do not enable it without organizational review',
        },
        {
          id: 'C',
          text: 'Enable it; a Skill can only use the access its own task actually needs',
        },
        { id: 'D', text: 'Enable it and watch what it does for the first week' },
      ],
      correctOptionId: 'B',
      rationale:
        "A Skill is software, and a colleague's recommendation is not the same as a vetted source. A Skill has no permission manifest; it inherits the session's full access, so the potential exposure is everything your session can reach, wildly disproportionate to summarizing notes. The trust check rests on the source and the bundle's contents. Assuming task-scoped access limits (C) misunderstands how session access works, and monitoring after the fact (D) grants the access before the risk is understood.",
    },
    {
      id: 'm6-rq-3',
      question:
        'You need to analyze a confidential document and nothing about the session should persist. Which control fits?',
      options: [
        { id: 'A', text: 'Standard Chat with Memory on' },
        {
          id: 'B',
          text: 'Incognito mode, after confirming the entry point is approved for this data',
        },
        { id: 'C', text: 'A more capable model' },
        { id: 'D', text: 'Upload it to a shared Project so the team can reuse it' },
      ],
      correctOptionId: 'B',
      rationale:
        'Incognito keeps the chat out of Memory and history but does not override organizational data retention; confirming the entry point is approved comes first.',
    },
    {
      id: 'm6-rq-4',
      question:
        "A quarterly review of a team's AI use finds that several members routinely paste draft client deliverables into a personal Claude account because the company-approved workspace feels slower to log into. What does this represent?",
      options: [
        { id: 'A', text: 'An acceptable workaround, since the work still gets done faster' },
        {
          id: 'B',
          text: 'A Diligence gap between policy and practice; the friction in the approved path is driving people to an unapproved one, and the fix is to remove that friction and make the compliant route the easy default',
        },
        { id: 'C', text: 'A reason to ban the team from using Claude altogether' },
        {
          id: 'D',
          text: 'A problem that only the individuals who took the shortcut are responsible for',
        },
      ],
      correctOptionId: 'B',
      rationale:
        'When a compliant path is harder than a non-compliant one, people drift to the easy option. That is a Diligence gap between policy and practice (B), and the durable fix is to reduce the friction so the approved route is the path of least resistance. A treats a data-exposure risk as a mere convenience. C overcorrects by banning a sanctioned tool. D is wrong because the organization, not just the individuals, owns the gap it created.',
    },
    {
      id: 'm6-rq-5',
      question:
        "A hiring coordinator uses Claude to screen incoming résumés and produce a shortlist, then forwards that shortlist to the hiring manager as 'the candidates who qualified.' The manager interviews only those candidates and never sees the ones Claude dropped. Which ethical concern is most directly raised by this use?",
      options: [
        {
          id: 'A',
          text: 'Disclosure: the applicants were not told that Claude was used in screening.',
        },
        {
          id: 'B',
          text: 'Bias: an automated screen filters people out with no human review of the exclusions, so a systematic disadvantage to some groups can go undetected.',
        },
        {
          id: 'C',
          text: 'Intellectual property: the résumés may contain copyrighted material.',
        },
        {
          id: 'D',
          text: 'Accountability transfer: Claude, not the coordinator, is now responsible for the hiring decision.',
        },
      ],
      correctOptionId: 'B',
      rationale:
        'The defining feature is that an automated screen removes people with no human review of who was excluded; the live risk is systematic bias in the exclusions. Disclosure (A) is a real but secondary concern here. C misnames the issue. D is wrong: accountability cannot transfer to a tool, the coordinator and employer remain responsible. Analyzing the case means naming which concern the situation most directly raises.',
    },
  ],
};
