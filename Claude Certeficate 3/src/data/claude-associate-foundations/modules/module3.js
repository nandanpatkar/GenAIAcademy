/* Module 3 — Evaluating & Validating Claude's Output. From MODULE 3.txt. */

const disclaimer = {
  type: 'callout',
  variant: 'disclaimer',
  title: 'Disclaimer / Notice for Educational Content',
  body: [
    "We built this Associate course Module 3: Evaluating & Validating Claude's Output to help you get real work done with Claude. Treat it as educational content. It doesn't constitute legal, financial, or other professional advice, so adapt what you learn to your own situation. Our products and services evolve quickly, so certain content may contain errors or be outdated; remember to verify on Anthropic's website or docs. Examples and scenarios used in the course are illustrative and often fictitious. If the course material mentions a company or product, it doesn't mean Anthropic endorses them, they endorse Anthropic, or that we're affiliated. Also note your use of Anthropic products and services is covered by our terms, policies and documentation; if anything in this course conflicts with them, they control.",
  ],
};

export const module3 = {
  id: 'module-3',
  number: 3,
  title: "Evaluating & Validating Claude's Output",
  shortTitle: 'Output Evaluation',
  summary: 'Validate output and know when human review is non-negotiable.',
  duration: '~70 min',
  lede: 'You are accountable for everything you ship, created with Claude\'s help. Learn to evaluate output systematically, recognize the failure patterns, build verification into your prompts, know the thresholds where human review is mandatory, and choose the output format that matches the reliability the task demands.',
  objectives: [
    'Evaluate Claude-generated output for accuracy and completeness.',
    'Identify hallucinations, inconsistencies, and biases in responses.',
    'Apply fact-checking and validation techniques.',
    'Determine when human review or additional verification is required.',
    'Edit, adapt, refine, and compare output for the intended audience.',
    'Select appropriate output formats and organize information for optimal results.',
  ],

  sections: [
    {
      id: 'm3-toc',
      eyebrow: 'Module 3',
      title: 'Table of contents',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Claude saved you twenty minutes drafting an analysis. One fabricated figure in that analysis, sent to a client or a regulator, can cost far more than twenty minutes to undo. This module gives you the discipline to stand behind AI-assisted work: how to evaluate output systematically, recognize failure patterns, build verification into your prompts, and choose the format that matches the reliability the task demands.',
        },
        {
          type: 'table',
          headers: ['Screen', 'Length'],
          rows: [
            ['Module Introduction', '1 screen'],
            ['Discernment: Accuracy & Completeness', '1 screen'],
            ['Hallucinations, Inconsistencies & Bias', '1 screen'],
            ['Fact-Checking & Grounding', '1 screen'],
            ['Diligence: When Review Is Non-Negotiable', '1 screen'],
            ['Editing & Adapting for Audience', '1 screen'],
            ['Choosing Output Formats', '1 screen'],
            ['Exercise: Triage the Output Set', '2 screens'],
            ['Module 3 Quiz', '2 screens'],
            ['Module Complete', '1 screen'],
          ],
        },
      ],
    },

    {
      id: 'm3-intro',
      eyebrow: 'Introduction',
      duration: '4 min',
      title: "Evaluating & Validating Claude's Output",
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Claude saved you twenty minutes drafting an analysis. One fabricated figure in that analysis, sent to a client or a regulator, can cost far more than twenty minutes to undo.',
        },
        {
          type: 'p',
          text: 'This is the asymmetry at the center of professional AI use: the time saved is small and visible, and the cost of an unverified error is large and arrives later.',
        },
        {
          type: 'p',
          text: 'This is the largest section of the certification exam, and the reason is accountability. When you put your name on a deliverable, you own every claim in it, whether you wrote the words or Claude did. This module gives you the discipline to stand behind AI-assisted work.',
        },
        { type: 'h', level: 3, text: 'A short cautionary case' },
        {
          type: 'p',
          text: "A consultant asked Claude to pull supporting statistics for a client market-sizing deck. Claude returned five clean figures with confident framing. Four were sound. One, a growth rate, was fabricated, plausible enough that nobody questioned it. The figures went into a deck, the deck went to a client, and the client's own analyst flagged the fabricated figure in the room.",
        },
        {
          type: 'p',
          text: 'The ten minutes saved on research cost a credibility hit and a week of rebuilding trust. Nothing about the figure looked wrong on the screen. That is the problem this module is intended to solve: the cost of a missed error is not paid when you save the time, it is paid later, by someone whose trust you needed.',
        },
        {
          type: 'p',
          text: 'Two competencies from the AI Fluency Framework anchor the module. Discernment is the skill of critically evaluating output against requirements, sources, and standards. Diligence is deciding when verification is required and taking responsibility for the result. Discernment is how you review; Diligence is why you must.',
        },
        { type: 'h', level: 3, text: 'The deal in this module' },
        {
          type: 'p',
          text: "You are accountable for everything you ship, created with Claude's help. Learn to evaluate output systematically, recognize the failure patterns, build verification into your prompts, know the thresholds where human review is mandatory, and choose the output format that matches the reliability the task demands.",
        },
        disclaimer,
      ],
    },

    {
      id: 'm3-discernment',
      eyebrow: 'Teaching · Discernment',
      duration: '12 min',
      title: 'Discernment: Evaluating Accuracy, Completeness, and Fitness',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Evaluation is not a feeling about whether output looks good. It is a check against three fixed references: the requirements you set, the source material, and the professional standards of your field. The discernment protocol is running that check the same way every time, so quality does not depend on how rushed you happen to be.',
        },
        { type: 'h', level: 3, text: 'Three evaluation references' },
        {
          type: 'ul',
          items: [
            '**Requirements.** Does the output reflect what you asked for? Re-read your own request and confirm each part is addressed, not just the easy parts.',
            '**Source material.** Where the output relies on documents you supplied, does it match them? Trace specific claims back to the source rather than trusting that Claude read carefully.',
            '**Professional standards.** Would this pass in your field? A number without units, a recommendation without reasoning, a citation you cannot locate. These fail professional standards even when they read fluently.',
          ],
        },
        { type: 'h', level: 3, text: 'Stakes calibration' },
        {
          type: 'p',
          text: 'How deeply you review depends on the stakes, and the stakes are domain-dependent, not universal. In zero-tolerance work (legal analysis, financial figures, compliance reporting), accuracy outranks speed entirely, and every claim gets verified. In low-stakes internal brainstorming, a lighter review is appropriate. The risk is applying the same casual review to both. Determine the stakes before you decide the depth of review.',
        },
        { type: 'h', level: 3, text: 'A three-way triage' },
        {
          type: 'p',
          text: 'After review, sort each output into one of three states, with documented reasoning:',
        },
        {
          type: 'table',
          headers: ['Verdict', 'When it applies'],
          rows: [
            [
              'Ready to use',
              'Meets requirements, matches sources, clears professional standards. Ship it.',
            ],
            [
              'Needs revision',
              'Close, but a specific gap remains. Note the gap and iterate.',
            ],
            [
              'Needs human override',
              "The stakes, the errors, or the uncertainty mean this should not go out on Claude's draft alone. Escalate to a person.",
            ],
          ],
        },
        { type: 'h', level: 3, text: 'Completeness is a separate review' },
        {
          type: 'p',
          text: 'Accuracy asks whether what is present is correct. Completeness asks whether anything is missing. They fail independently: an output can be entirely accurate and still omit the one factor that impacts a decision. Review for both. Missing elements are harder to spot than wrong ones, because nothing on the screen draws your eye to them.',
        },
        { type: 'h', level: 3, text: 'The protocol on three real outputs' },
        {
          type: 'p',
          text: 'The protocol is most effective on outputs that are not obviously good or bad. Here it is applied to three, each a different verdict.',
        },
        {
          type: 'p',
          text: '**Output 1: a competitor-pricing summary.** You asked Claude to summarize three competitors\' published pricing from PDFs you uploaded. The summary is clean and well-organized. Running the three references: requirements met (it covers all three competitors), but the source review fails: one price is listed as "$40/user" when the uploaded PDF says "$40/user, minimum 10 seats." The omission changes the comparison. Verdict: needs revision. The fix is a source-restricted re-prompt, not a rewrite.',
        },
        {
          type: 'p',
          text: '**Output 2: an internal process recommendation.** You asked for three options to reduce invoice-processing time. The output gives three sensible options with trade-offs. Requirements met, no sources to check against, professional standards cleared, low stakes (internal discussion starter). Verdict: ready to use. Over-verifying this one wastes the time the tool saved.',
        },
        {
          type: 'p',
          text: '**Output 3: a compliance-gap analysis.** You asked Claude to compare your data-handling policy against a regulation and flag gaps. It flags four gaps confidently. Requirements appear met, but the regulation was not uploaded, so Claude worked from training-data recall of a rule that may have changed, and the stakes are regulatory. Verdict: needs human override. The output is a useful prompt for a compliance expert, not a substitute for one.',
        },
        {
          type: 'p',
          text: 'Same protocol, three verdicts. The difference is never how polished the output looks; it is what the three references and the stakes return.',
        },
      ],
    },

    {
      id: 'm3-failure-patterns',
      eyebrow: 'Teaching · Failure Patterns',
      duration: '10 min',
      title: 'Hallucinations, Inconsistencies & Bias',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Plausible is not the same as verified. Claude writes fluently whether it is right or wrong, so you cannot rely on tone or confidence to flag an error.',
        },
        {
          type: 'p',
          text: 'Knowing the specific signatures of failure lets you spot them quickly instead of reading every line with equal suspicion.',
        },
        { type: 'h', level: 3, text: 'Hallucination patterns' },
        {
          type: 'ul',
          items: [
            '**Plausible-but-unsupported claims.** A statement that sounds reasonable and fits the topic, with no basis in the source or in fact. The most dangerous kind, because nothing about it looks wrong.',
            '**Fabricated specifics.** Invented statistics, dates, names, quotations, or citations. Specificity reads as authority, which is exactly why fabricated specifics are persuasive.',
            '**Confident tone masking uncertainty.** Claude rarely hedges in proportion to its actual certainty. A guess and a well-grounded fact arrive in the same assured voice.',
          ],
        },
        { type: 'h', level: 3, text: 'Inconsistencies and bias' },
        {
          type: 'ul',
          items: [
            '**Internal contradictions.** In a long output, a claim early on can conflict with one later. Long documents are where contradictions hide, because you rarely hold the whole thing in view at once.',
            '**Confirmation bias in framing.** If your prompt implies a preferred answer, Claude may lean toward it. Watch for output that agrees with you a little too readily on a question that should be genuinely open.',
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'A completeness failure worth remembering',
          body: [
            'A common, anonymized field pattern: a professional asks Claude to compare a batch of documents and identify the differences. The output lists several differences and reads as thorough. It missed differences in the single most important file in the batch. Completeness failures concentrate where attention is lowest, and a confident summary of the easy files can mask silence on the hard one.',
          ],
        },
        { type: 'h', level: 3, text: 'Capability hallucination' },
        {
          type: 'p',
          text: 'Claude can claim to have taken an action it cannot actually take, such as "I\'ve emailed that to your team" or "I\'ve saved the file." Within claude.ai, Claude works with the conversation, connected tools, and uploaded files; it does not perform external actions it was not given a tool for. Treat any claimed external action as unverified until you confirm it happened.',
        },
        { type: 'h', level: 3, text: 'A failure-pattern gallery' },
        {
          type: 'p',
          text: 'Each pattern below is shown the way it can actually appear, so you recognize the signature rather than the label.',
        },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Pattern',
              title: 'Fabricated specific, in the wild',
              body: 'Prompt: "What share of mid-market SaaS firms adopted AI tools in 2025?" Output: "Approximately 63 percent of mid-market SaaS firms adopted at least one AI tool in 2025, up from 41 percent in 2024." The numbers are precise, the trend is plausible, and there is no source. The precision is the tell. Real figures this specific come with a citation; an uncited 63 percent is a number-shaped guess.',
            },
            {
              eyebrow: 'Pattern',
              title: 'Confident tone masking uncertainty',
              body: 'Prompt: "Is this clause enforceable in our state?" Output: a four-sentence answer stating it is enforceable, in the same assured voice Claude uses for arithmetic. Legal enforceability is jurisdiction-specific and date-sensitive, exactly the kind of claim that should hedge and does not. Assurance is not evidence.',
            },
            {
              eyebrow: 'Pattern',
              title: 'Internal contradiction across a long output',
              body: 'In a ten-page market analysis, page two states the addressable market is "roughly $2 billion" and page eight builds a projection on "the $2.6 billion market." Both read fine in isolation. The contradiction only becomes visible if you hold the whole document in view, which is why long outputs need a consistency pass, not just a paragraph-by-paragraph read.',
            },
          ],
        },
        { type: 'h', level: 3, text: 'How to read the gallery' },
        {
          type: 'p',
          text: 'None of these outputs looks broken. That is the point of the lesson: the failure modes are designed, by the nature of fluent generation, to pass a casual read. You catch them by knowing the signatures and checking against sources, not by waiting for something to look wrong.',
        },
      ],
    },

    {
      id: 'm3-fact-checking',
      eyebrow: 'Teaching · Fact-Checking & Grounding',
      duration: '10 min',
      title: 'Fact-Checking and Grounding Techniques',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'The strongest verification is built into the prompt, before the output exists.',
        },
        {
          type: 'p',
          text: 'A few prompt habits cut hallucinations at the source rather than catching them after the fact, and they make whatever remains far easier to audit.',
        },
        { type: 'h', level: 3, text: 'Prompt for verifiability' },
        {
          type: 'ul',
          items: [
            '**Permit "I don\'t know."** Tell Claude explicitly that admitting uncertainty is acceptable. Without that permission, a model under pressure to answer is more likely to fill the gap with something invented.',
            '**Restrict to provided sources.** For document work, instruct Claude to answer only from the materials you supplied and to flag anything those materials do not cover. This converts open-ended generation into bounded retrieval.',
            '**Require auditable citations.** Ask for the specific source and location behind each claim, in a form you can check. A citation you cannot trace is not a citation.',
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'The verification checklist',
          body: [
            'Before relying on an output: did I allow uncertainty, restrict to sources where appropriate, require citations I can audit, and check the high-stakes claims against something authoritative? Building these into the prompt is cheaper than rebuilding trust in the output afterward.',
          ],
        },
        { type: 'h', level: 3, text: 'Grounding techniques' },
        {
          type: 'ul',
          items: [
            '**Quote first, then analyze.** For long documents, ask Claude to extract the supporting quotes before drawing conclusions. Grounding the analysis in pulled quotes makes both the reasoning and the errors visible.',
            '**Best-of-N comparison.** Re-run the same request and compare. Where the runs agree, confidence rises; where they diverge, you have found the soft spots that need a human look.',
            '**Validate against authoritative sources.** For claims that matter, check against a trusted external reference rather than a second Claude response. In-product aids help here: Claude for Excel can produce cell-level citations that tie figures back to their inputs.',
          ],
        },
        { type: 'h', level: 3, text: 'The techniques as verbatim prompts' },
        {
          type: 'p',
          text: 'Each technique is a phrase you can paste. The wording is the skill.',
        },
        {
          type: 'quote',
          label: 'Permission to not know',
          text: '"If the answer is not supported by the documents I provided, say so explicitly rather than estimating. It is acceptable to answer \'the provided materials do not cover this.\'"',
        },
        {
          type: 'quote',
          label: 'Source restriction',
          text: '"Answer using only the attached contract. Do not use general knowledge. For anything the contract does not address, list it under \'Not covered by this document.\'"',
        },
        {
          type: 'quote',
          label: 'Auditable citation',
          text: '"For every claim, cite the section and clause number it comes from, in parentheses, so I can verify it against the source."',
        },
        {
          type: 'quote',
          label: 'Quote-grounding',
          text: '"Before you analyze, extract the exact sentences from the document that bear on my question. Then base your analysis only on those quotes."',
        },
      ],
    },

    {
      id: 'm3-diligence',
      eyebrow: 'Teaching · Diligence',
      duration: '10 min',
      title: 'Diligence: When Human Review Is Non-Negotiable',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Some outputs must never go out as a Claude draft alone, no matter how good they look.',
        },
        {
          type: 'p',
          text: 'Diligence means knowing those thresholds in advance, so the decision to escalate is made by policy, not in the moment after something has already gone wrong.',
        },
        {
          type: 'table',
          caption: 'Four risk thresholds',
          headers: ['Threshold', 'What to ask'],
          rows: [
            [
              'Stakes',
              'What is the cost if this is wrong? High-cost errors demand human review regardless of how confident the output appears.',
            ],
            [
              'Reversibility',
              'Can the action be undone? An irreversible step (a sent client deliverable, a filed report) clears a higher bar than a draft you can revise.',
            ],
            [
              'Audience',
              'Who sees it? External, executive, and regulatory audiences raise the review requirement above internal working drafts.',
            ],
            [
              'Regulatory exposure',
              'Does a rule, contract, or law govern this? Regulated content carries obligations that AI assistance does not remove.',
            ],
          ],
        },
        { type: 'h', level: 3, text: 'The do-not-ship-without-review list' },
        {
          type: 'p',
          text: 'Decide these in advance and treat them as fixed:',
        },
        {
          type: 'ul',
          items: [
            'Final client deliverables',
            'Audit-critical or financially material calculations',
            'Anything involving regulated, confidential, or highly sensitive data',
            'Public or legal communications where a misstatement carries lasting consequence',
          ],
        },
        { type: 'h', level: 3, text: 'Iteration versus escalation' },
        {
          type: 'p',
          text: 'Productive iteration improves the output each round. When rounds stop improving it, you have diminishing returns, and the right move is not another prompt; it is a human expert. Recognizing that line is part of Diligence: more prompting cannot manufacture judgment the situation requires.',
        },
        { type: 'h', level: 3, text: 'Owning the output' },
        {
          type: 'p',
          text: 'The accountability does not transfer to the tool. Work produced with Claude is your work when you ship it, and the professional standard is the same as if you had produced it unaided. Diligence is the habit of acting as though that is true, because it is.',
        },
        { type: 'h', level: 3, text: 'Three escalation scenarios' },
        {
          type: 'p',
          text: '**The fast "yes."** Claude drafts an internal meeting agenda. Low stakes, reversible, internal audience, no regulatory exposure. All four thresholds say ship. No escalation; this is the routine case you can move quickly on.',
        },
        {
          type: 'p',
          text: "**The deceptive \"looks fine.\"** Claude produces a board-deck financial summary that reads cleanly. The stakes are high, there's an executive audience, and the result will be partly irreversible once presented, tripping three of the risk thresholds. The clean appearance is irrelevant; this goes to a human reviewer and the figures get recomputed with code execution.",
        },
        {
          type: 'p',
          text: '**The slow creep.** You have iterated a client proposal five times. Rounds three through five changed almost nothing. Diminishing returns plus a high-stakes external deliverable: stop prompting, escalate to a colleague for a fresh read. The signal to escalate is the flat improvement curve, not a visible error.',
        },
      ],
    },

    {
      id: 'm3-editing',
      eyebrow: 'Teaching · Editing for Audience',
      duration: '8 min',
      title: 'Editing and Adapting Output for Your Audience',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Claude drafts; you deliver. The gap between a raw draft and a finished deliverable is the editing pass, and that pass is where your professional standards and your knowledge of the audience get applied. A draft that is accurate is still not finished.',
        },
        { type: 'h', level: 3, text: 'From raw output to deliverable' },
        {
          type: 'p',
          text: 'Three passes turn a draft into something you would put your name on:',
        },
        {
          type: 'ul',
          items: [
            '**Clarity.** Cut hedging, tighten loose sentences, remove anything that does not earn its place. Claude tends toward thoroughness; editing tends toward precision.',
            '**Tone.** Match the register to the relationship and the occasion. The same content reads differently to a peer, a client, and a regulator.',
            '**Formatting.** Shape the output for how it will be read: scannable for an executive, detailed for a working team, clean for an external recipient.',
          ],
        },
        { type: 'h', level: 3, text: 'Audience calibration' },
        {
          type: 'p',
          text: 'One analysis often needs to become several deliverables. An executive summary leads with the decision and the impact. A working-team version keeps the detail and the method. An external communication controls what is disclosed and how it is framed. The underlying facts hold steady; the selection, depth, and tone change with who is reading.',
        },
        { type: 'h', level: 3, text: 'Comparing outputs before you edit' },
        {
          type: 'p',
          text: 'When quality matters, generate more than one draft (across runs or across models) and choose the strongest base to edit from, rather than committing to the first response. Comparing candidates is cheaper than rescuing a weak draft, and it invites framing you might not have prompted for.',
        },
        { type: 'h', level: 3, text: 'One analysis, two audiences: a transformation' },
        {
          type: 'quote',
          label: 'Raw output (excerpt)',
          text: '"The analysis indicates that processing time increased by approximately 18 percent in Q3, which may be attributable to a combination of higher volume and the onboarding of three new staff members who were still onboarding during the period, and it is recommended that the team consider whether additional process documentation might help mitigate similar effects in future onboarding cycles."',
        },
        {
          type: 'compare',
          items: [
            {
              label: 'Executive version',
              title: 'Leads with the number and the decision; one sentence.',
              body: '"Q3 processing time rose 18 percent, driven by volume plus onboarding three new hires. Recommend standardized onboarding docs to limit the effect next time."',
            },
            {
              label: 'Working-team version',
              title: 'Keeps the method and adds the operational next step.',
              body: '"Processing time was up ~18% in Q3. Two drivers: higher volume and three new staff still onboarding. Action: draft onboarding documentation so the next cohort ramps faster (owner and timeline to confirm in standup)."',
            },
          ],
        },
        {
          type: 'p',
          text: 'Same facts, same 18 percent. The executive cut strips method and leads with impact; the working cut keeps detail and assigns action. Neither is a raw draft, which would not serve either audience.',
        },
      ],
    },

    {
      id: 'm3-formats',
      eyebrow: 'Teaching · Output Formats',
      duration: '8 min',
      title: 'Choosing Output Formats: Inline, Artifacts, Structured, Code-Executed',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'The output format is a reliability decision, not just a presentation choice. The right format depends on what the result is intended for and, above all, on how much the numbers have to be trusted.',
        },
        { type: 'h', level: 3, text: 'Format by purpose' },
        {
          type: 'ul',
          items: [
            '**Inline.** For conversational responses you will act on within the chat. Quick, contextual, not meant to be a standalone artifact.',
            '**Artifacts.** For documents and code: a separate, editable block you will refine and reuse. The right home for a deliverable rather than a reply.',
            '**Structured formats.** For data: tables and defined schemas that downstream tools or readers can consume directly.',
          ],
        },
        { type: 'h', level: 3, text: 'Code execution as the verified-output path' },
        {
          type: 'p',
          text: 'When numbers must be right, have Claude compute them rather than write them. Prose generation produces a plausible-looking figure; code execution runs the calculation and returns a computed, checkable result, along with charts and processed files. Determinism attaches to the executed computation; Claude writes the code, so the logic itself can still contain a bug. The guarantee is that you can read, verify, and re-run the calculation, but the code is not automatically correct. The same data task done two ways shows the difference: a number generated in prose is a guess in the shape of an answer, while a number from code execution is a computed result you can trace and check.',
        },
        { type: 'h', level: 3, text: 'Prose versus code-executed: the same task' },
        {
          type: 'p',
          text: 'Task: from an uploaded sales spreadsheet, report total Q3 revenue and the three top accounts.',
        },
        {
          type: 'compare',
          items: [
            {
              tone: 'negative',
              label: 'Prose path',
              title: 'Fluent, fast, and unverifiable',
              body: '"Total Q3 revenue was about $4.7 million, with the largest accounts being Northwind, Contoso, and Globex." The total is the model\'s best guess at summing a column it cannot actually add reliably, and a wrong total here propagates into every downstream slide.',
            },
            {
              tone: 'positive',
              label: 'Code-executed path',
              title: 'Traceable to the rows that produced it',
              body: 'Claude writes and runs code over the actual file, returning $4,712,380 as a computed sum, the three top accounts ranked by their real totals, and a bar chart. When the figure feeds a decision, this is the only path that earns trust.',
            },
          ],
        },
        {
          type: 'p',
          text: 'The prose answer is not lazy; it is a different kind of output. For a low-stakes gut-check it may be fine. For anything that gets reported, the reliability requirement points to code execution.',
        },
        { type: 'h', level: 3, text: 'Curate the inputs to shape the output' },
        {
          type: 'p',
          text: 'Organized inputs produce organized outputs. Supplying clean, well-labeled source material and stating the structure you want back is what lets Claude return something structured rather than something you have to restructure. The selection rule is simple: pick the output modality by the reliability the task requires. Curating inputs means removing the wrong material, in addition to adding the right material. Three techniques do most of the work: de-duplicate your sources so Claude is not reconciling three near-identical copies of the same document; label and structure what you supply so each input\'s role is explicit ("this is the approved policy; these are the draft responses"); and prune material that is not relevant to the question, because noise in the input becomes noise in the output. Clean, well-labeled, minimal inputs produce a cleaner result than a large undifferentiated pile.',
        },
      ],
    },

    {
      id: 'm3-exercise',
      eyebrow: 'Exercise · Triage the Output Set',
      duration: '7 min',
      title: 'Triage the Output Set',
      blocks: [
        {
          type: 'p',
          text: 'Triage is the daily muscle of responsible AI use. This exercise applies the Discernment protocol and the Diligence thresholds to a set of outputs, the way you would in real work.',
        },
        {
          type: 'p',
          text: 'Four Claude outputs follow. Classify each as ready to use, needs revision, or needs human override, and state the reason. Then compare against the model answers.',
        },
        {
          type: 'table',
          caption: 'Outputs to triage',
          headers: ['Output', 'Model answer'],
          rows: [
            [
              '**A.** An internal brainstorm of campaign ideas, clearly labeled as a starting point, with a few generic entries among strong ones.',
              'Ready to use (with light editing). Low stakes, internal, labeled as a draft. Trim the weak entries and proceed.',
            ],
            [
              '**B.** A financial summary stating a total that does not match the sum of the line items above it.',
              'Needs revision. An internal contradiction: the total conflicts with the line items. Recompute with code execution and confirm before use.',
            ],
            [
              '**C.** A market overview citing three statistics, none of which name a source you can check.',
              'Needs revision. Unsourced statistics are unverified claims. Require auditable citations or validate against authoritative sources before relying on them.',
            ],
            [
              '**D.** A draft regulatory filing summary, accurate on the points you spot-checked, intended for submission to a regulator.',
              'Needs human override. High stakes, irreversible, regulatory audience. Mandatory expert review regardless of how clean the draft looks.',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Model answers revealed',
          body: [
            'You separated stakes from output quality. Notice that the cleanest-looking output (D) carries the highest review requirement, and the messiest (A) the lowest; appearance and risk are not the same axis.',
          ],
        },
        {
          type: 'h',
          level: 3,
          text: 'Optional variant · Score your own conversation',
        },
        {
          type: 'p',
          text: 'Pick one of your own recent Claude conversations. Score it against the Discernment and Diligence behavioral indicators from this module: did you check the output before using it (Diligence), and did you judge whether the response actually fit the question you asked (Discernment)? Type one sentence on where you were strong and one on where you would tighten up, then reveal the indicator checklist to compare.',
        },
        { type: 'h', level: 4, text: 'Indicator checklist' },
        {
          type: 'ul',
          items: [
            'Diligence: did you check the output before using it, against the model and stakes you were relying on?',
            'Discernment: did you judge whether the response actually fit the question you asked, not just whether it read well?',
          ],
        },
        {
          type: 'p',
          text: 'This variant is optional and not scored; compare your two sentences against the checklist above.',
        },
      ],
    },

    {
      id: 'm3-takeaways',
      eyebrow: 'Key Takeaways',
      title: 'Six things that hold across this module',
      blocks: [
        {
          type: 'takeaways',
          items: [
            {
              title: 'Accountability stays with you.',
              text: "You own every claim in what you ship, whether you wrote it or Claude did. That is why this is the exam's largest section.",
            },
            {
              title: 'Evaluate against three references.',
              text: 'Requirements, source material, and professional standards. Run the same check every time and calibrate depth of review to what is at stake.',
            },
            {
              title: 'Plausible is not verified.',
              text: 'Fabricated specifics, confident uncertainty, and completeness gaps all read as competent. Learn the signs so you can spot them fast.',
            },
            {
              title: 'Build verification into the prompt.',
              text: 'Permit "I don\'t know," restrict to sources, and require auditable citations. Prevention is cheaper than reconstruction.',
            },
            {
              title: 'Know the thresholds in advance.',
              text: 'Stakes, reversibility, audience, and regulatory exposure decide when human review is mandatory. Set the line before the moment, not after.',
            },
            {
              title: 'Pick the format by reliability.',
              text: 'When numbers must be right, compute them with code execution rather than generating them as prose.',
            },
          ],
        },
      ],
    },

    {
      id: 'm3-sources',
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
            'AI Fluency Framework: Discernment and Diligence competencies and behavioral indicators',
            'Anthropic docs: reducing hallucinations, citations, and verification guidance, platform.claude.com/docs',
            'Claude Help Center: Code execution and Claude for Excel cell-level citations, support.claude.com',
          ],
        },
      ],
    },
  ],

  reviewQuestions: [
    {
      id: 'm3-rq-1',
      question:
        'A report Claude produced is accurate on every figure you checked, but you suspect a relevant factor was left out entirely. What does a complete Discernment review require?',
      options: [
        { id: 'A', text: 'Nothing further; every figure checked out, so the report is sound' },
        {
          id: 'B',
          text: 'A separate completeness check against the requirements, looking for missing elements, not just wrong ones',
        },
        { id: 'C', text: 'Re-running the report on a more capable model' },
        {
          id: 'D',
          text: 'Asking Claude whether it left anything out and trusting the answer',
        },
      ],
      correctOptionId: 'B',
      rationale:
        'Completeness is a separate check from accuracy; correct figures do not guarantee nothing was omitted.',
    },
    {
      id: 'm3-rq-2',
      question:
        'A market analysis includes a precise, confident statistic with no source attached. What is the most likely risk?',
      options: [
        {
          id: 'A',
          text: 'The output is fine; confident, specific figures are usually reliable',
        },
        {
          id: 'B',
          text: 'A fabricated specific: invented detail that reads as authoritative because it is precise',
        },
        { id: 'C', text: 'A formatting issue that does not affect accuracy' },
        { id: 'D', text: 'A model-tier problem solved by switching models' },
      ],
      correctOptionId: 'B',
      rationale:
        'A precise statistic with no source is a classic fabricated specific; specificity reads as authority but is not verification.',
    },
    {
      id: 'm3-rq-3',
      question:
        'You need Claude to answer questions strictly from a contract you uploaded, without inventing anything. Which prompt technique most reduces hallucination?',
      options: [
        { id: 'A', text: 'Ask the question and trust Claude to stay within the document' },
        {
          id: 'B',
          text: 'Restrict the answer to the provided document, permit "I don\'t know," and require citations to specific clauses',
        },
        { id: 'C', text: 'Ask the same question five times and average the answers' },
        { id: 'D', text: 'Use the most capable model and ask in a single sentence' },
      ],
      correctOptionId: 'B',
      rationale:
        'Source restriction, permission to say "I don\'t know," and auditable citations together cut hallucination at the prompt.',
    },
    {
      id: 'm3-rq-4',
      question:
        'Claude extracted figures from your source files into a reconciliation table that will feed a regulatory filing. The table is clean and well formatted, but its subtotal does not match the line items above it. What is the correct action before the table is used?',
      options: [
        {
          id: 'A',
          text: 'Accept the table; the formatting is clean and the rest of the figures look right',
        },
        {
          id: 'B',
          text: 'Recompute the figures with code execution, confirm the subtotal reconciles, and resolve the discrepancy before the table is used',
        },
        {
          id: 'C',
          text: 'Submit the filing now and flag the subtotal discrepancy to the regulator afterward',
        },
        {
          id: 'D',
          text: 'Ask Claude to reformat the table to make it look cleaner and resubmit',
        },
      ],
      correctOptionId: 'B',
      rationale:
        'A subtotal that conflicts with its line items is an internal inconsistency, so the table needs revision before use. Code execution recomputes and reconciles the figures, fixing the cause; accepting it on appearance (A), submitting and flagging later (C), or merely reformatting (D) all leave the discrepancy in a filing where it matters most.',
    },
    {
      id: 'm3-rq-5',
      question:
        'One analysis must go to both the executive team and the working group. What is the best approach?',
      options: [
        { id: 'A', text: 'Send the same full draft to both audiences' },
        {
          id: 'B',
          text: 'Produce an executive version leading with decision and impact, and a working-team version keeping detail and method',
        },
        { id: 'C', text: 'Send the executives the raw Claude output to save time' },
        { id: 'D', text: 'Ask Claude to pick which audience matters more' },
      ],
      correctOptionId: 'B',
      rationale:
        'Audience calibration produces distinct versions from the same facts; one draft does not serve both audiences well.',
    },
    {
      id: 'm3-rq-6',
      question:
        'A deliverable depends on a multi-variable financial calculation that must be exactly right. Which output path is most trustworthy?',
      options: [
        { id: 'A', text: 'Ask Claude to calculate it inline and review the number' },
        { id: 'B', text: 'Request the figure as a formatted table' },
        {
          id: 'C',
          text: 'Use code execution so the calculation is run and the result is verified',
        },
        { id: 'D', text: 'Use Research to find a comparable published figure' },
      ],
      correctOptionId: 'C',
      rationale:
        'An exact calculation is a reliability problem; code execution returns a computed, verified result rather than a probable-looking one.',
    },
    {
      id: 'm3-rq-7',
      question:
        'A learner pastes six overlapping source files, several are near-duplicate drafts of the same memo, and asks Claude to summarize the policy. The summary comes back muddled and repeats contradictory points. What most improves output quality?',
      options: [
        { id: 'A', text: 'Switch to a higher model tier and re-run the same six files.' },
        {
          id: 'B',
          text: 'De-duplicate and prune the sources to the single approved version, label what each remaining input is, then re-run.',
        },
        { id: 'C', text: 'Ask Claude to make the summary longer and more detailed.' },
        { id: 'D', text: 'Paste all six files again in a fresh conversation.' },
      ],
      correctOptionId: 'B',
      rationale:
        "Noisy, redundant inputs produce noisy outputs. Curating the inputs, removing duplicates, keeping the approved source, labeling each input's role, fixes the cause. A bigger model (A) still has to reconcile contradictory inputs; C and D do not address input quality.",
    },
  ],
};
