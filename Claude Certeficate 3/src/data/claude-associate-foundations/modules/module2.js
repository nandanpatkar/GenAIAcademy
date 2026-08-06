/* Module 2 — Prompting & Task Execution. Transcribed from MODULE 2.txt. */

const disclaimer = {
  type: 'callout',
  variant: 'disclaimer',
  title: 'Disclaimer / Notice for Educational Content',
  body: [
    "We built this Associate course Module 2: Prompting & Task Execution to help you get real work done with Claude. Treat it as educational content. It doesn't constitute legal, financial, or other professional advice, so adapt what you learn to your own situation. Our products and services evolve quickly, so certain content may contain errors or be outdated; remember to verify on Anthropic's website or docs. Examples and scenarios used in the course are illustrative and often fictitious. If the course material mentions a company or product, it doesn't mean Anthropic endorses them, they endorse Anthropic, or that we're affiliated. Also note your use of Anthropic products and services is covered by our terms, policies and documentation; if anything in this course conflicts with them, they control.",
  ],
};

export const module2 = {
  id: 'module-2',
  number: 2,
  title: 'Prompting & Task Execution',
  shortTitle: 'Prompting',
  summary: 'Build structured prompts and adapt them to the task type.',
  duration: '~50 min',
  lede: 'Consistent output quality comes from prompt structure, not cleverness or luck. Learn the five components, learn to decompose complex work, learn to iterate on the component that failed, and learn to match strategy to task type.',
  objectives: [
    'Create effective prompts for business and technical tasks using a repeatable component structure.',
    'Apply task decomposition techniques to structure complex, multi-part requests.',
    'Iterate prompts diagnostically to improve output quality.',
    'Adapt prompting strategy to the task type: analysis, research, drafting, or brainstorming.',
  ],

  sections: [
    {
      id: 'm2-intro',
      eyebrow: 'Introduction',
      duration: '4 min',
      title: 'Prompting & Task Execution',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'The same request, phrased two ways, produces two different levels of quality.',
        },
        {
          type: 'p',
          text: 'Ask Claude to "write something about our Q3 results" and you get a generic paragraph. Specify the audience, the three results that matter, the format, and the length, and you get a draft you can almost send. The model did not get smarter between those two requests. The prompt did.',
        },
        {
          type: 'p',
          text: 'This module treats prompting as a communication discipline with learnable structure, not a knack some people have and others do not. The structure has a name in the AI Fluency Framework: Description, the competency of telling Claude precisely what you want. Description is the backbone of this module and the prompting foundation the rest of the course builds on.',
        },
        { type: 'h', level: 3, text: 'The deal in this module' },
        {
          type: 'p',
          text: 'Consistent output quality comes from prompt structure, not cleverness or luck. Learn the five components, learn to decompose complex work, learn to iterate on the component that failed, and learn to match strategy to task type. Those four skills cover the entire Prompting section of the exam.',
        },
        disclaimer,
      ],
    },

    {
      id: 'm2-anatomy',
      eyebrow: 'Teaching · Anatomy of a Prompt',
      duration: '12 min',
      title: 'Anatomy of an Effective Prompt',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'A strong prompt is built from components, and most weak prompts are missing one or more of them.',
        },
        {
          type: 'p',
          text: 'Naming the components turns prompting from guesswork into a checklist you can run before sending any non-trivial request.',
        },
        { type: 'h', level: 3, text: 'The component stack' },
        {
          type: 'p',
          text: 'Five components carry almost all the weight in a professional prompt.',
        },
        {
          type: 'cards',
          items: [
            {
              eyebrow: 'Component',
              title: 'Role',
              body: 'Who you want Claude to be for this task: a financial analyst, an editor, a policy reviewer. Role sets the vocabulary, depth, and assumptions Claude brings.',
            },
            {
              eyebrow: 'Component',
              title: 'Context',
              body: 'The background Claude cannot know unless you provide it: the audience, the situation, prior decisions, the source material. This is the component professionals most often omit.',
            },
            {
              eyebrow: 'Component',
              title: 'Task',
              body: '"Summarize," "compare," "draft," "identify": the specific action, stated as a clear instruction. One primary verb, stated unambiguously.',
            },
            {
              eyebrow: 'Component',
              title: 'Constraints',
              body: 'The boundaries: length, tone, what to include, what to leave out, what to avoid. Constraints are how you keep the output usable without heavy editing.',
            },
            {
              eyebrow: 'Component',
              title: 'Output format',
              body: 'The shape of the result: a table, a bulleted list, a three-paragraph memo, a draft email. Stating the format up front saves an iteration.',
            },
          ],
        },
        {
          type: 'p',
          text: 'Not every prompt needs all five. A quick question needs a task and maybe a constraint. A client deliverable needs all five. The skill is noticing which components a given task requires.',
        },
        { type: 'h', level: 3, text: 'Description in practice' },
        {
          type: 'p',
          text: 'The Description competency is the habit of making each component explicit instead of assuming Claude will infer it. Unless you connect a source through a Connector, Claude cannot see your inbox, your org chart, or last week\'s meeting, and even with a connector, Claude sees only what you have allowed it to access. Anything that lives only in your head or outside a connected source is a context gap, and context gaps are the single most common reason a prompt underperforms for new users.',
        },
        { type: 'h', level: 3, text: 'Diagnosing a weak prompt' },
        {
          type: 'p',
          text: 'Hold a disappointing prompt against the component stack and the gap usually becomes obvious. Missing context produces generic output. An ambiguous task verb produces the wrong action. Absent constraints produce output that is the wrong length or tone. The components are also a diagnostic checklist, which is why Lesson 4 returns to them when output falls short.',
        },
      ],
    },

    {
      id: 'm2-worked-build',
      eyebrow: 'Teaching · Anatomy of a Prompt',
      duration: 'included in L2',
      title: 'A Worked Build',
      blocks: [
        { type: 'h', level: 3, text: 'Weak prompt: everything left implicit' },
        {
          type: 'quote',
          label: 'Weak prompt',
          text: '"Write a summary of our quarterly operations."',
        },
        {
          type: 'p',
          text: 'Claude produces three plausible paragraphs that could describe almost any company. No audience, no figures, no format, no sense of what matters. The output is not wrong. It is unusable, because the prompt specified almost nothing.',
        },
        { type: 'h', level: 3, text: 'Strong prompt: components made explicit' },
        {
          type: 'quote',
          label: 'Strong prompt',
          text: '"You are an operations analyst (role). I am preparing a one-page update for our regional director, who cares about throughput and cost, not process detail (context and audience). Summarize the attached Q3 operations data (task), covering only the three metrics that moved more than 10 percent against target (constraint). Format as a short headline followed by three bullet points, each one sentence (output format)."',
        },
        {
          type: 'p',
          text: 'Same model, same data. The second prompt produces a draft the analyst can refine in two minutes instead of rebuilding from scratch. The difference is entirely in the specification.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'The habit to build — before sending any prompt that matters',
          body: [
            'Run the five components in your head: have I given Claude the role, the context it cannot infer, an unambiguous task, the constraints, and the format I want back? Thirty seconds of specification routinely saves several rounds of correction.',
          ],
        },
      ],
    },

    {
      id: 'm2-decomposition',
      eyebrow: 'Teaching · Task Decomposition',
      duration: '10 min',
      title: 'Task Decomposition for Complex Requests',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Some requests are too large to specify as a single instruction.',
        },
        {
          type: 'p',
          text: 'When a task has several distinct stages, packing it into one prompt produces shallow work on every stage. Decomposition is how you break a complex request into a sequence Claude can execute well.',
        },
        {
          type: 'p',
          text: 'Decomposition means splitting a multi-part problem into discrete, ordered steps, then running them in sequence rather than asking for everything at once. A vendor evaluation is a good example: it is really four tasks wearing one sentence.',
        },
        { type: 'h', level: 3, text: 'The single-prompt version that underperforms' },
        {
          type: 'quote',
          label: 'Single prompt',
          text: '"Evaluate these three vendors and tell me which to pick."',
        },
        {
          type: 'p',
          text: 'Claude has to invent criteria, apply them, weigh trade-offs, and recommend, all in one pass. It will do all four shallowly and you will not see the reasoning behind the recommendation.',
        },
        { type: 'h', level: 3, text: 'The decomposed version' },
        {
          type: 'steps',
          items: [
            {
              title: 'Derive criteria',
              text: 'From the requirements document, derive the evaluation criteria that matter and weigh them.',
            },
            {
              title: 'Score vendors',
              text: 'Score each vendor against those criteria using the supplied materials.',
            },
            {
              title: 'Raise trade-offs',
              text: 'Raise the trade-offs where vendors diverge most.',
            },
            {
              title: 'Recommend',
              text: 'Recommend, with the reasoning tied back to the weighted criteria.',
            },
          ],
        },
        {
          type: 'p',
          text: 'Each step produces a checkable intermediate result. If the criteria in Step 1 are wrong, you catch it before scoring, not after the recommendation. Decomposition also makes the work auditable, which matters when someone asks how the recommendation was reached.',
        },
        { type: 'h', level: 3, text: 'One conversation or several' },
        {
          type: 'p',
          text: 'Keep sequential steps that build on each other in one conversation, so each step sees the prior results. Move to a separate conversation when a step is genuinely independent, or when the conversation has grown long enough that early context is degrading. That judgment connects directly to the context-management skills from Module 1.',
        },
      ],
    },

    {
      id: 'm2-parallel-case',
      eyebrow: 'Teaching · Task Decomposition',
      duration: 'included in L3',
      title: 'Decompose a Parallel Case',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'Three deliverables, one foundation: sequence the shared extraction first.',
        },
        { type: 'h', level: 3, text: 'Scenario' },
        {
          type: 'p',
          text: 'A communications manager needs to turn a dense 20-page policy change into an internal announcement, an FAQ for staff, and a short briefing for executives. Before reading on, decompose this into an ordered sequence of steps you would run with Claude.',
        },
        { type: 'h', level: 3, text: 'Model decomposition' },
        {
          type: 'ol',
          items: [
            'Extract the substantive changes from the policy document and what each one means in practice.',
            'Confirm the extraction is complete and accurate before building anything on top of it.',
            'Draft the staff announcement from the confirmed change list, tuned to a general audience.',
            'Draft the FAQ, anticipating the questions staff will likely ask about those changes.',
            'Draft the executive briefing, compressed down to decisions and impact.',
          ],
        },
        { type: 'h', level: 3, text: 'Why this order' },
        {
          type: 'p',
          text: 'Steps 1 and 2 build a verified foundation that the three deliverables all draw on. Drafting any deliverable before the change list is confirmed risks propagating the same misreading into three documents. Sequence the shared, high-stakes extraction first; let the parallel drafts follow.',
        },
      ],
    },

    {
      id: 'm2-iterating',
      eyebrow: 'Teaching · Iterating to Improve',
      duration: '8 min',
      title: 'Iterating Prompts to Improve Output',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'A first draft from Claude rarely lands perfectly. The skill is not rewriting the whole prompt when output disappoints. It is reading the output to diagnose which component fell short, then fixing that one thing.',
        },
        { type: 'h', level: 3, text: 'Output deficiencies are prompt diagnostics' },
        {
          type: 'p',
          text: 'Each kind of disappointment points back to a specific component:',
        },
        {
          type: 'table',
          headers: ['Symptom', 'Likely cause', 'Fix'],
          rows: [
            [
              'Output is generic or off-base',
              'The context was thin',
              'Add the background Claude could not infer',
            ],
            [
              'Output answered the wrong question',
              'The task verb was ambiguous',
              'Sharpen the instruction',
            ],
            [
              'Output is the wrong length, tone, or shape',
              'A constraint or the format was missing',
              'Add it',
            ],
            [
              'Output is close but misses on one section',
              '—',
              'Iterate on that section only; do not discard a draft that is mostly right',
            ],
          ],
        },
        { type: 'h', level: 3, text: 'Targeted revision, not wholesale rewriting' },
        {
          type: 'p',
          text: 'When you rewrite the entire prompt, you lose the parts that worked and you cannot tell which change fixed the problem. Change the one component the output told you to change, resend, and compare. The same diagnostic discipline applies to troubleshooting any underperforming workflow, covered in depth in Module 7.',
        },
        { type: 'h', level: 3, text: 'A live iteration cycle' },
        {
          type: 'p',
          text: 'Watch the diagnose-and-fix loop run on one deliberately weak prompt.',
        },
        {
          type: 'quote',
          label: 'Round 1 prompt',
          text: '"Write a follow-up email to the client about the delayed deliverable."',
        },
        {
          type: 'p',
          text: '**Round 1 output.** A generic, slightly defensive three-paragraph email that does not say when the deliverable will arrive or why it slipped. Diagnosis: the context is thin (no reason, no new date) and there is no tone constraint.',
        },
        {
          type: 'quote',
          label: 'Round 2 prompt',
          text: '"Write a follow-up to the client about the two-day delay on the analytics deliverable. The cause was a data-quality issue we have now fixed; new delivery is Thursday. Tone: accountable, not over-apologetic. Keep it under 120 words."',
        },
        {
          type: 'p',
          text: '**Round 2 output.** A tight, accountable note with the cause, the new date, and a confident close. Diagnosis: strong; only the subject line is missing.',
        },
        {
          type: 'quote',
          label: 'Round 3 prompt',
          text: '"Good. Add a subject line that signals resolution, not just delay."',
        },
        {
          type: 'p',
          text: 'Three rounds, each changing exactly the component the previous output exposed. No round threw away working text, and by round three the improvement was marginal, the signal to stop.',
        },
        { type: 'h', level: 3, text: 'Knowing when to stop' },
        {
          type: 'p',
          text: 'Iteration has converged when each additional round produces marginal change rather than improvement. At that point, further prompting yields less than a quick manual edit. Recognizing diminishing returns is part of the skill: the goal is a usable result, not a perfect prompt.',
        },
      ],
    },

    {
      id: 'm2-strategy',
      eyebrow: 'Teaching · Strategy by Task Type',
      duration: '8 min',
      title: 'Adapting Strategy by Task Type',
      blocks: [
        {
          type: 'p',
          variant: 'lede',
          text: 'The component stack applies to every prompt, but the emphasis shifts with the task.',
        },
        {
          type: 'p',
          text: 'Analysis, research, drafting, and brainstorming each reward a different balance of specificity and creative latitude. Using one fixed style across all four costs quality on every task it does not fit.',
        },
        {
          type: 'ul',
          items: [
            '**Analysis.** Wants tight constraints and explicit criteria. Tell Claude what to measure, against what standard, and how to handle ambiguity. Low creative latitude; high specification.',
            '**Research.** Wants clear scope and source discipline. Define the question, the boundaries, and whether current sources are required. Quick currency needs can be met by turning on web search in chat, while deep multi-source investigation points to Research (available on paid plans). Ask for citations so claims are checkable.',
            '**Drafting.** Wants audience, tone, and format specified, with room for Claude to find the phrasing. Medium latitude: you control the shape, Claude fills it.',
            '**Brainstorming.** Wants loose constraints and high latitude. Over-specifying kills the divergence you are after. Give the goal and the boundaries, then ask for volume and range before you narrow.',
          ],
        },
        {
          type: 'table',
          caption: 'Strategy quick reference',
          headers: ['Task type', 'What to tighten', 'What to loosen'],
          rows: [
            ['Analysis', 'Criteria, standards, scope', 'Phrasing'],
            ['Research', 'Question, sources, citations', 'Synthesis approach'],
            ['Drafting', 'Audience, tone, format', 'Word choice'],
            ['Brainstorming', 'Goal and guardrails only', 'Quantity and direction'],
          ],
        },
        { type: 'h', level: 3, text: 'Four mini-demos, one per task type' },
        {
          type: 'quote',
          label: 'Analysis',
          text: '"Compare these two vendor contracts on payment terms, termination rights, and liability caps. For each, state which contract is more favorable to us and why, in a three-row table."',
        },
        {
          type: 'p',
          text: 'Tight criteria, defined output, no room to wander.',
        },
        {
          type: 'quote',
          label: 'Research',
          text: '"Using current sources, summarize how three named competitors positioned their Q2 launches. Cite each source. Flag anything you cannot verify."',
        },
        {
          type: 'p',
          text: 'Scope and citation discipline up front; Research (or web search in chat for lighter needs) supplies the currency.',
        },
        {
          type: 'callout',
          variant: 'note',
          title: 'Note',
          body: [
            'Citations are checkable when they come from a grounded source (web search or Research results); citations produced from training memory alone can look equally confident and should be independently verified.',
          ],
        },
        {
          type: 'quote',
          label: 'Drafting',
          text: '"Draft a 150-word LinkedIn post announcing our new reporting feature, aimed at operations managers, in a confident but not salesy voice."',
        },
        {
          type: 'p',
          text: 'Audience, length, and tone fixed; phrasing left open.',
        },
        {
          type: 'quote',
          label: 'Brainstorming',
          text: '"Give me 20 angles for a campaign around faster month-end close. Range widely; do not self-edit yet."',
        },
        {
          type: 'p',
          text: 'Goal and one guardrail only; the constraints come later, after the range exists.',
        },
        {
          type: 'p',
          text: 'The same prompt structure underlies all four, but the dial between control and latitude moves with the task. The underlying move is the same each time: decide where you need control and where you need range, then set constraints accordingly. Matching strategy to task type is what separates a competent prompter from one who gets the same mediocre output on every task.',
        },
      ],
    },

    {
      id: 'm2-exercise',
      eyebrow: 'Exercise · Repair the Prompt',
      duration: '6 min',
      title: 'Repair the Underperforming Prompt',
      blocks: [
        {
          type: 'p',
          text: 'This exercise puts the whole module together: a weak prompt, its disappointing output, and your job to diagnose what is missing and repair it using the component stack.',
        },
        {
          type: 'p',
          text: 'Below is a prompt, the output it produced, and the author\'s actual goal. Work in three steps: find the specification gaps, match each fix to the component it repairs, then assemble the repaired prompt.',
        },
        {
          type: 'quote',
          label: 'The weak prompt',
          text: '"Summarize the customer feedback and tell me what to do."',
        },
        {
          type: 'p',
          text: '**The output it produced.** A generic five-bullet list of themes ("customers want faster support," "pricing is a concern") with vague advice ("consider improving response times"). Nothing tied to the actual data, no priorities, nothing actionable.',
        },
        {
          type: 'p',
          text: "**The author's real goal.** A product manager has 200 survey responses and needs the top three issues by frequency, each with a representative quote, ranked so she can decide what to fix this quarter.",
        },
        { type: 'h', level: 3, text: 'Stage 1 of 3 · Diagnose the gaps' },
        {
          type: 'p',
          text: 'Select every component the prompt is missing or under-specifies: Role, Context, Task (specificity), Constraints, Output format — all five are gaps. The context (200 responses) and role (analyst framing) are the easiest to miss because they exist in the author\'s head but never appear in the prompt.',
        },
        {
          type: 'h',
          level: 3,
          text: 'Stage 2 of 3 · Match each fix to the component it repairs',
        },
        {
          type: 'table',
          headers: ['Component', 'Fragment'],
          rows: [
            ['Role', 'You are a product analyst'],
            ['Context', 'Attached are 200 customer survey responses'],
            [
              'Task',
              'Identify the three most frequently raised issues, ranked by how many responses mention each',
            ],
            [
              'Constraints',
              'For each issue include one representative verbatim quote and the approximate share of responses it appears in; use code execution to count accurately rather than estimating',
            ],
            ['Output format', 'Format as a ranked list, most frequent first'],
            ['Does not belong', 'Make the summary sound professional and polished'],
          ],
        },
        {
          type: 'p',
          text: 'The tone instruction ("professional and polished") is the distractor; it closes no specification gap.',
        },
        { type: 'h', level: 3, text: 'Stage 3 of 3 · Assemble the repaired prompt' },
        {
          type: 'quote',
          label: 'Model answer',
          text: '"You are a product analyst (role). Attached are 200 customer survey responses (context). Identify the three most frequently raised issues (task), ranked by how many responses mention each, and for each issue include one representative verbatim quote and the approximate share of responses it appears in (constraints). Use code execution to count accurately rather than estimating. Format as a ranked list, most frequent first (output format)."',
        },
        { type: 'h', level: 4, text: 'Documented improvements' },
        {
          type: 'ul',
          items: [
            'Added role and context so the analysis is grounded in the actual responses',
            'Replaced the vague task with a specific, ranked, countable instruction',
            'Added constraints (representative quote, share of responses) that make the output actionable',
            'Specified code execution so the frequency counts are verified, not guessed',
            'Specified the output format so the result is decision-ready',
          ],
        },
      ],
    },

    {
      id: 'm2-takeaways',
      eyebrow: 'Key Takeaways',
      duration: '5 min',
      title: 'Five things that hold across this module',
      blocks: [
        {
          type: 'takeaways',
          items: [
            {
              title: 'Structure drives quality, not cleverness.',
              text: 'Five components (role, context, task, constraints, format) carry almost every professional prompt. Run them before sending anything that matters.',
            },
            {
              title: 'Context is the component you will forget.',
              text: 'Claude cannot see what lives only in your head. The most common cause of generic output is a context gap, not a model limitation.',
            },
            {
              title: 'Decompose complex work into ordered steps.',
              text: 'Multi-stage requests succeed when each step produces a checkable result and the high-stakes foundation is built first.',
            },
            {
              title: 'Iterate on the component that failed.',
              text: 'Read the output as a diagnostic, change the one thing it points to, and stop when rounds stop improving the result.',
            },
            {
              title: 'Match strategy to task type.',
              text: 'Analysis wants constraints; brainstorming wants latitude. Decide where you need control and where you need range, then set constraints to fit.',
            },
          ],
        },
      ],
    },

    {
      id: 'm2-sources',
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
            'Anthropic docs: prompt engineering overview and best practices, platform.claude.com/docs',
            'AI Fluency Framework: Description competency, for the prompting backbone framing',
            'Claude Help Center: Code execution for verified calculation, support.claude.com',
          ],
        },
      ],
    },
  ],

  reviewQuestions: [
    {
      id: 'm2-rq-1',
      question:
        'A marketer\'s prompt, "Write a post about our new feature," produces generic copy. Which single change will most improve the result?',
      options: [
        { id: 'A', text: 'Ask Claude to try harder and be more creative' },
        {
          id: 'B',
          text: "Add context (audience, channel, the feature's key benefit) and the output format",
        },
        { id: 'C', text: 'Switch to a more capable model and resend the same prompt' },
        { id: 'D', text: 'Run the same prompt several times and pick the best output' },
      ],
      correctOptionId: 'B',
      rationale:
        'Generic output signals a context gap; adding audience, channel, benefit, and format is the targeted fix. A more capable model does not solve under-specification.',
    },
    {
      id: 'm2-rq-2',
      question:
        'An analyst needs Claude to evaluate five suppliers against a requirements document and recommend one. Which approach produces the most reliable result?',
      options: [
        {
          id: 'A',
          text: 'Ask for the evaluation and recommendation in a single prompt',
        },
        {
          id: 'B',
          text: 'Decompose into derive-criteria, score-each, identify trade-offs, then recommend',
        },
        {
          id: 'C',
          text: 'Ask Claude to recommend first, then justify the choice afterward',
        },
        {
          id: 'D',
          text: 'Run five separate conversations, one per supplier, with no shared criteria',
        },
      ],
      correctOptionId: 'B',
      rationale:
        'A multi-stage evaluation decomposes into ordered steps with checkable intermediate results. Recommending first inverts the reasoning; isolated, per-supplier conversations lose shared criteria.',
    },
    {
      id: 'm2-rq-3',
      question:
        'A drafted memo came back accurate but far too long and too formal for its audience. What is the most efficient next step?',
      options: [
        { id: 'A', text: 'Rewrite the entire prompt from scratch' },
        { id: 'B', text: 'Switch models and regenerate' },
        {
          id: 'C',
          text: 'Adjust the constraint and format components (length and tone) and resend',
        },
        { id: 'D', text: 'Manually cut the memo down and abandon the prompt' },
      ],
      correctOptionId: 'C',
      rationale:
        'The output diagnoses the failing components, length (constraint) and tone, so revise those and resend rather than rewriting or switching models.',
    },
    {
      id: 'm2-rq-4',
      question:
        'A team wants the widest possible range of campaign concepts before narrowing. How should the prompt be calibrated?',
      options: [
        {
          id: 'A',
          text: 'Apply tight constraints on length, format, and terminology up front',
        },
        {
          id: 'B',
          text: 'Give the goal and a few guardrails, then ask for volume and range before filtering',
        },
        { id: 'C', text: 'Request a single best idea to save time' },
        { id: 'D', text: 'Specify the exact creative direction so Claude stays on message' },
      ],
      correctOptionId: 'B',
      rationale:
        'Brainstorming rewards latitude. Tight up-front constraints suppress the range the team wants; filter after generating.',
    },
    {
      id: 'm2-rq-5',
      question:
        'A prompt asks Claude to "calculate the average deal size and summarize the trend." The summary is fine, but the average looks off. What is the best fix?',
      options: [
        { id: 'A', text: 'Trust the number; Claude is usually right on arithmetic' },
        {
          id: 'B',
          text: 'Add a constraint to use code execution for the calculation, so the figure is verified',
        },
        {
          id: 'C',
          text: 'Ask Claude to recompute the average three times and average those',
        },
        { id: 'D', text: 'Remove the calculation from the prompt entirely' },
      ],
      correctOptionId: 'B',
      rationale:
        'A suspect calculation is a verification problem. Code execution returns a computed result rather than a probable one.',
    },
  ],
};
