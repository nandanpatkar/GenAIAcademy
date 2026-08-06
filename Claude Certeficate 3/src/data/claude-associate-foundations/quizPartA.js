/*
 * PART A — Official course quiz questions (37 total).
 *
 * Transcribed verbatim from CCAO-F_Question_Dump.md. These are the condensed
 * restatements of each module's own quiz, so every question here has a
 * counterpart in the corresponding module's `reviewQuestions`. They are tagged
 * `source: 'course'` so the quiz setup can filter them apart from the 50
 * original questions in Part B.
 *
 * To add questions for a new course, create a parallel file and register it in
 * that course's quiz.js — do not append other courses' questions here.
 */

export const partA = [
  /* ---------- Module 1 — Product & Model Selection ---------- */
  {
    id: 'A-M1-Q1',
    ref: 'M1 Q1',
    source: 'course',
    moduleId: 'module-1',
    domainId: 'product-model-selection',
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
      'Recurring task (Project), stable reference document (knowledge base), consistent format (standing instructions), accurate numeric comparison (Code Execution).',
  },
  {
    id: 'A-M1-Q2',
    ref: 'M1 Q2',
    source: 'course',
    moduleId: 'module-1',
    domainId: 'product-model-selection',
    question:
      'A financial planner asks Claude to calculate compound interest on a portfolio scenario with five input variables. Which approach produces the most trustworthy result?',
    options: [
      { id: 'A', text: 'Ask Claude to calculate it in Chat and review manually' },
      { id: 'B', text: 'Upload variables to a Project and ask Claude to estimate the figure' },
      { id: 'C', text: 'Use Code Execution to run the calculation and return a verified result' },
      { id: 'D', text: 'Use Research to find comparable portfolio scenarios' },
    ],
    correctOptionId: 'C',
    rationale:
      'Code Execution produces a verified result; prose generation produces a plausible estimate that may be wrong.',
  },
  {
    id: 'A-M1-Q3',
    ref: 'M1 Q3',
    source: 'course',
    moduleId: 'module-1',
    domainId: 'product-model-selection',
    question:
      'A legal team needs to review 500 standard vendor agreements and classify each as low/medium/high risk using a clear, unambiguous rubric, in one session. Which model is most appropriate?',
    options: [
      { id: 'A', text: 'Opus, for highest accuracy' },
      { id: 'B', text: 'Sonnet, for balanced performance' },
      { id: 'C', text: 'Haiku, for fast, efficient structured classification at volume' },
      { id: 'D', text: "The default model, since selection isn't adjustable" },
    ],
    correctOptionId: 'C',
    rationale:
      "Unambiguous rubric + high volume = Haiku's use case; Opus is for nuanced judgment.",
  },
  {
    id: 'A-M1-Q4',
    ref: 'M1 Q4',
    source: 'course',
    moduleId: 'module-1',
    domainId: 'product-model-selection',
    question:
      'A consultant has worked in a single session for two hours on a complex analysis. In the last 30 minutes, responses stopped reflecting the analytical framework defined at the start. Most appropriate response?',
    options: [
      { id: 'A', text: 'Increase to Opus' },
      { id: 'B', text: 'Repeat the framework in the current conversation' },
      {
        id: 'C',
        text: 'Start a new conversation, paste a summary of decisions/progress, continue from there',
      },
      { id: 'D', text: 'Enable Research for more external context' },
    ],
    correctOptionId: 'C',
    rationale:
      "Context degradation; restarting from a summary is correct. Repeating (B) extends a degraded session; model change (A) doesn't fix exhausted context.",
  },
  {
    id: 'A-M1-Q5',
    ref: 'M1 Q5',
    source: 'course',
    moduleId: 'module-1',
    domainId: 'product-model-selection',
    question:
      'A consultant works on two client accounts and wants Client A context never to appear in Client B sessions. Correct configuration?',
    options: [
      { id: 'A', text: 'Incognito mode for all sessions' },
      { id: 'B', text: 'Clear Memory manually before switching clients' },
      { id: 'C', text: 'Separate Projects per client, using Project-scoped Memory' },
      { id: 'D', text: 'A different model tier per client' },
    ],
    correctOptionId: 'C',
    rationale: 'Project-scoped Memory keeps contexts separate per Project.',
  },

  /* ---------- Module 2 — Prompting & Task Execution ---------- */
  {
    id: 'A-M2-Q1',
    ref: 'M2 Q1',
    source: 'course',
    moduleId: 'module-2',
    domainId: 'prompting',
    question:
      '"Write a post about our new feature" produces generic copy. Which single change most improves the result?',
    options: [
      { id: 'A', text: 'Ask Claude to try harder / be more creative' },
      { id: 'B', text: 'Add context (audience, channel, key benefit) and output format' },
      { id: 'C', text: 'Switch to a more capable model and resend' },
      { id: 'D', text: 'Run it several times and pick the best' },
    ],
    correctOptionId: 'B',
    rationale:
      "Generic output = context gap; a better model doesn't fix under-specification.",
  },
  {
    id: 'A-M2-Q2',
    ref: 'M2 Q2',
    source: 'course',
    moduleId: 'module-2',
    domainId: 'prompting',
    question:
      'An analyst needs Claude to evaluate five suppliers against a requirements doc and recommend one. Most reliable approach?',
    options: [
      { id: 'A', text: 'Ask for evaluation + recommendation in one prompt' },
      {
        id: 'B',
        text: 'Decompose: derive criteria → score each → identify trade-offs → recommend',
      },
      { id: 'C', text: 'Ask Claude to recommend first, justify after' },
      { id: 'D', text: 'Five separate conversations, one per supplier, no shared criteria' },
    ],
    correctOptionId: 'B',
    rationale: 'Ordered decomposition with checkable intermediate results.',
  },
  {
    id: 'A-M2-Q3',
    ref: 'M2 Q3',
    source: 'course',
    moduleId: 'module-2',
    domainId: 'prompting',
    question:
      'A memo came back accurate but too long and too formal. Most efficient next step?',
    options: [
      { id: 'A', text: 'Rewrite the entire prompt' },
      { id: 'B', text: 'Switch models and regenerate' },
      { id: 'C', text: 'Adjust constraint/format components (length, tone) and resend' },
      { id: 'D', text: 'Manually cut it down and abandon the prompt' },
    ],
    correctOptionId: 'C',
    rationale: 'Targeted fix on the failing components.',
  },
  {
    id: 'A-M2-Q4',
    ref: 'M2 Q4',
    source: 'course',
    moduleId: 'module-2',
    domainId: 'prompting',
    question:
      'A team wants the widest range of campaign concepts before narrowing. How should the prompt be calibrated?',
    options: [
      { id: 'A', text: 'Tight constraints on length/format/terminology up front' },
      { id: 'B', text: 'Give the goal + a few guardrails, ask for volume/range, filter after' },
      { id: 'C', text: 'Request a single best idea' },
      { id: 'D', text: 'Specify the exact creative direction' },
    ],
    correctOptionId: 'B',
    rationale: 'Brainstorming rewards latitude; filter after generating.',
  },
  {
    id: 'A-M2-Q5',
    ref: 'M2 Q5',
    source: 'course',
    moduleId: 'module-2',
    domainId: 'prompting',
    question:
      '"Calculate the average deal size and summarize the trend" — summary is fine, average looks off. Best fix?',
    options: [
      { id: 'A', text: 'Trust the number' },
      { id: 'B', text: 'Add a constraint to use Code Execution for the calculation' },
      { id: 'C', text: 'Ask Claude to recompute three times and average those' },
      { id: 'D', text: 'Remove the calculation from the prompt' },
    ],
    correctOptionId: 'B',
    rationale:
      'Suspect calculation = verification problem, solved by Code Execution.',
  },

  /* ---------- Module 3 — Output Evaluation & Validation ---------- */
  {
    id: 'A-M3-Q1',
    ref: 'M3 Q1',
    source: 'course',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'A report is accurate on every figure you checked, but you suspect a relevant factor was omitted entirely. What does a complete Discernment review require?',
    options: [
      { id: 'A', text: 'Nothing further — figures checked out' },
      {
        id: 'B',
        text: 'A separate completeness check against requirements, looking for missing elements',
      },
      { id: 'C', text: 'Re-run on a more capable model' },
      { id: 'D', text: 'Ask Claude if it left anything out and trust the answer' },
    ],
    correctOptionId: 'B',
    rationale: 'Completeness is a separate check from accuracy.',
  },
  {
    id: 'A-M3-Q2',
    ref: 'M3 Q2',
    source: 'course',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'A market analysis includes a precise, confident statistic with no source. Most likely risk?',
    options: [
      { id: 'A', text: 'Fine — confident, specific figures are usually reliable' },
      {
        id: 'B',
        text: "A fabricated specific — invented detail that reads as authoritative because it's precise",
      },
      { id: 'C', text: 'A formatting issue' },
      { id: 'D', text: 'A model-tier problem' },
    ],
    correctOptionId: 'B',
    rationale: 'Specificity is the tell, not a reassurance.',
  },
  {
    id: 'A-M3-Q3',
    ref: 'M3 Q3',
    source: 'course',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'You need Claude to answer strictly from an uploaded contract without inventing anything. Which technique most reduces hallucination?',
    options: [
      { id: 'A', text: 'Ask and trust Claude to stay within the document' },
      {
        id: 'B',
        text: 'Restrict to the document, permit "I don\'t know," require citations to specific clauses',
      },
      { id: 'C', text: 'Ask the same question five times and average' },
      { id: 'D', text: 'Use the most capable model, ask in one sentence' },
    ],
    correctOptionId: 'B',
    rationale:
      'Source restriction + permission for uncertainty + auditable citations, combined.',
  },
  {
    id: 'A-M3-Q4',
    ref: 'M3 Q4',
    source: 'course',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      "A reconciliation table feeding a regulatory filing is clean and well-formatted, but its subtotal doesn't match the line items. Correct action?",
    options: [
      { id: 'A', text: 'Accept it — formatting is clean' },
      {
        id: 'B',
        text: 'Recompute with Code Execution, confirm the subtotal reconciles, resolve before use',
      },
      { id: 'C', text: 'Submit now, flag the discrepancy afterward' },
      { id: 'D', text: 'Ask Claude to reformat and resubmit' },
    ],
    correctOptionId: 'B',
    rationale: 'Internal inconsistency must be resolved before use, not after.',
  },
  {
    id: 'A-M3-Q5',
    ref: 'M3 Q5',
    source: 'course',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'One analysis must go to both the executive team and the working group. Best approach?',
    options: [
      { id: 'A', text: 'Send the same full draft to both' },
      {
        id: 'B',
        text: 'Produce an executive version (decision/impact) and a working-team version (detail/method)',
      },
      { id: 'C', text: 'Send executives the raw output' },
      { id: 'D', text: 'Ask Claude which audience matters more' },
    ],
    correctOptionId: 'B',
    rationale:
      'Audience calibration produces distinct versions from the same facts.',
  },
  {
    id: 'A-M3-Q6',
    ref: 'M3 Q6',
    source: 'course',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'A deliverable depends on a multi-variable financial calculation that must be exactly right. Most trustworthy output path?',
    options: [
      { id: 'A', text: 'Calculate inline, review the number' },
      { id: 'B', text: 'Request the figure as a formatted table' },
      { id: 'C', text: 'Use Code Execution so the calculation is run and verified' },
      { id: 'D', text: 'Use Research to find a comparable published figure' },
    ],
    correctOptionId: 'C',
    rationale:
      'Exact calculation = reliability problem, solved by Code Execution.',
  },
  {
    id: 'A-M3-Q7',
    ref: 'M3 Q7',
    source: 'course',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'A learner pastes six overlapping source files (several near-duplicate drafts) and asks for a policy summary. The summary comes back muddled with contradictory points. What most improves quality?',
    options: [
      { id: 'A', text: 'Switch to a higher model tier, re-run the same six files' },
      {
        id: 'B',
        text: 'De-duplicate/prune to the single approved version, label each remaining input, re-run',
      },
      { id: 'C', text: 'Ask Claude to make the summary longer' },
      { id: 'D', text: 'Paste all six files again in a fresh conversation' },
    ],
    correctOptionId: 'B',
    rationale:
      'Curate inputs at the source; a bigger model still has to reconcile contradictions.',
  },

  /* ---------- Module 4 — Workflow Integration & Solution Design ---------- */
  {
    id: 'A-M4-Q1',
    ref: 'M4 Q1',
    source: 'course',
    moduleId: 'module-4',
    domainId: 'workflow-integration',
    question:
      'Claude extracted four requirement statements from a vendor brief. Which is most ambiguous — the one that would lead two engineers to build different things?',
    options: [
      { id: 'A', text: '"The system must export reports in both PDF and CSV formats."' },
      { id: 'B', text: '"The system should handle a large number of concurrent users."' },
      {
        id: 'C',
        text: '"The login page must support single sign-on through the company\'s existing identity provider."',
      },
      {
        id: 'D',
        text: '"Password-reset emails must be sent within five minutes of a request."',
      },
    ],
    correctOptionId: 'B',
    rationale:
      '"A large number" is unquantified; the others are concrete and testable.',
  },
  {
    id: 'A-M4-Q2',
    ref: 'M4 Q2',
    source: 'course',
    moduleId: 'module-4',
    domainId: 'workflow-integration',
    question:
      'A capacity plan depends on growth/throughput figures from an uploaded dataset. How should those figures be produced?',
    options: [
      { id: 'A', text: 'Ask Claude to estimate them in prose' },
      {
        id: 'B',
        text: 'Use Code Execution to compute them, then synthesize the plan from verified numbers',
      },
      { id: 'C', text: 'Use Research to find industry averages instead' },
      { id: 'D', text: 'Have Claude recall typical figures from training data' },
    ],
    correctOptionId: 'B',
    rationale: 'Verify first, synthesize second.',
  },
  {
    id: 'A-M4-Q3',
    ref: 'M4 Q3',
    source: 'course',
    moduleId: 'module-4',
    domainId: 'workflow-integration',
    question:
      'A Claude-built dashboard artifact that started as an internal helper is now relied on daily by three departments. What does this signal?',
    options: [
      { id: 'A', text: 'Nothing — keep iterating by prompt as before' },
      {
        id: 'B',
        text: 'It has become a system others depend on and should be escalated toward Developer/Architect expertise',
      },
      { id: 'C', text: 'Switch to a more capable model and continue' },
      { id: 'D', text: 'Move it into Incognito mode for safety' },
    ],
    correctOptionId: 'B',
    rationale:
      'Dependency by others is the escalation trigger, not complexity.',
  },
  {
    id: 'A-M4-Q4',
    ref: 'M4 Q4',
    source: 'course',
    moduleId: 'module-4',
    domainId: 'workflow-integration',
    question:
      'In a contract-review redesign, which step should remain human-retained?',
    options: [
      { id: 'A', text: 'Extracting clauses from the document' },
      { id: 'B', text: 'Flagging departures from the playbook' },
      { id: 'C', text: 'Approving or rejecting each change and signing the contract' },
      { id: 'D', text: 'Computing the financial exposure of a penalty clause' },
    ],
    correctOptionId: 'C',
    rationale:
      'Irreversible + accountability-bearing, regardless of draft quality.',
  },
  {
    id: 'A-M4-Q5',
    ref: 'M4 Q5',
    source: 'course',
    moduleId: 'module-4',
    domainId: 'workflow-integration',
    question:
      'Which description of an AI-assisted contract workflow best builds stakeholder trust?',
    options: [
      { id: 'A', text: '"Our AI reviews contracts automatically."' },
      {
        id: 'B',
        text: '"Claude drafts the redline and flags playbook departures; our legal lead reviews and approves every change before sending."',
      },
      { id: 'C', text: '"Claude handles all the legal work now."' },
      { id: 'D', text: '"The AI is fully autonomous, so we no longer need legal review."' },
    ],
    correctOptionId: 'B',
    rationale: 'Accurate value + limits + a named human gate.',
  },

  /* ---------- Module 5 — Configuration & Knowledge Management ---------- */
  {
    id: 'A-M5-Q1',
    ref: 'M5 Q1',
    source: 'course',
    moduleId: 'module-5',
    domainId: 'configuration',
    question:
      'A team wants every report in a Project to follow the same multi-step formatting procedure. Which mechanism fits?',
    options: [
      { id: 'A', text: 'A standing instruction describing the format in prose' },
      { id: 'B', text: 'A Skill that carries the repeatable formatting procedure' },
      { id: 'C', text: 'A document in the knowledge base' },
      { id: 'D', text: 'A Memory entry' },
    ],
    correctOptionId: 'B',
    rationale: 'Multi-step procedure = Skill.',
  },
  {
    id: 'A-M5-Q2',
    ref: 'M5 Q2',
    source: 'course',
    moduleId: 'module-5',
    domainId: 'configuration',
    question:
      "An equity analyst covers two competing retailers and must ensure each company's confidential modeling assumptions never surface in work on the other. Correct setup?",
    options: [
      { id: 'A', text: 'A single Project covering both, separated by careful prompting' },
      { id: 'B', text: 'A separate Project per company, each with its own scoped Memory' },
      { id: 'C', text: 'Turn Memory off entirely for both' },
      { id: 'D', text: 'A different model tier per company' },
    ],
    correctOptionId: 'B',
    rationale:
      'Separate Projects + scoped Memory is the only setup that fully isolates.',
  },
  {
    id: 'A-M5-Q3',
    ref: 'M5 Q3',
    source: 'course',
    moduleId: 'module-5',
    domainId: 'configuration',
    question:
      'A user expects a mail connector to send emails, but it only searches and reads. Most accurate understanding?',
    options: [
      { id: 'A', text: 'The connector is broken; report it as a bug' },
      {
        id: 'B',
        text: "Each connector has a defined capability boundary; sending is outside this one's scope",
      },
      { id: 'C', text: 'A more capable model would enable sending' },
      { id: 'D', text: 'The connector needs to be re-added through the public directory' },
    ],
    correctOptionId: 'B',
    rationale: 'Capability boundary, not a defect.',
  },
  {
    id: 'A-M5-Q4',
    ref: 'M5 Q4',
    source: 'course',
    moduleId: 'module-5',
    domainId: 'configuration',
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
    rationale: 'Only this is precise and testable.',
  },
  {
    id: 'A-M5-Q5',
    ref: 'M5 Q5',
    source: 'course',
    moduleId: 'module-5',
    domainId: 'configuration',
    question:
      'A recurring monthly-report Project produces subtly outdated figures, no error message. Setup: standing instruction still says "Q2 FY25 template, FY25 targets"; knowledge base holds FY26 files; Memory says "Reporting period is FY25." Current period is FY26. What\'s driving the drift, and the fix?',
    options: [
      { id: 'A', text: 'The knowledge base — remove the unrelated brand guide' },
      {
        id: 'B',
        text: 'The standing instruction and the Memory entry still pin to FY25 while the knowledge base already holds FY26 — update both to FY26',
      },
      { id: 'C', text: 'Delete the FY26 template so Claude stops mixing versions' },
      { id: 'D', text: 'Nothing in the setup — the model tier is too low' },
    ],
    correctOptionId: 'B',
    rationale:
      'Diagnose which specific piece is stale, even when other pieces are already correct.',
  },

  /* ---------- Module 6 — Governance, Risk & Responsible Use ---------- */
  {
    id: 'A-M6-Q1',
    ref: 'M6 Q1',
    source: 'course',
    moduleId: 'module-6',
    domainId: 'governance',
    question:
      'A team proposes using Claude to produce final, unreviewed determinations on benefits eligibility. How should this be classified?',
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
    id: 'A-M6-Q2',
    ref: 'M6 Q2',
    source: 'course',
    moduleId: 'module-6',
    domainId: 'governance',
    question:
      "A colleague shares a Skill found in a public forum that converts meeting notes into a summary. Skills don't request permissions; once enabled, a Skill runs with whatever access the session already has, and nothing limits it to meeting notes. Right action?",
    options: [
      { id: 'A', text: 'Enable it — a colleague vouched for it' },
      {
        id: 'B',
        text: 'Evaluate the source and think through what it could reach in your session; publisher is unknown and it inherits full session access, so do not enable without organizational review',
      },
      { id: 'C', text: 'Enable it — a Skill can only use what its task actually needs' },
      { id: 'D', text: 'Enable it and watch what it does for the first week' },
    ],
    correctOptionId: 'B',
    rationale:
      "A Skill is software, and a colleague's recommendation is not the same as a vetted source. A Skill inherits the session's full access, so the exposure is disproportionate to summarizing notes.",
  },
  {
    id: 'A-M6-Q3',
    ref: 'M6 Q3',
    source: 'course',
    moduleId: 'module-6',
    domainId: 'governance',
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
      "Incognito keeps it out of Memory/history but doesn't override retention policy; approval comes first.",
  },
  {
    id: 'A-M6-Q4',
    ref: 'M6 Q4',
    source: 'course',
    moduleId: 'module-6',
    domainId: 'governance',
    question:
      'A quarterly review finds several team members routinely paste draft client deliverables into a personal Claude account because the approved workspace feels slower to log into. What does this represent?',
    options: [
      { id: 'A', text: 'An acceptable workaround' },
      {
        id: 'B',
        text: 'A Diligence gap between policy and practice — the friction in the approved path drives people to the unapproved one; fix the friction',
      },
      { id: 'C', text: 'A reason to ban the team from using Claude altogether' },
      { id: 'D', text: 'A problem only the individuals are responsible for' },
    ],
    correctOptionId: 'B',
    rationale:
      'When a compliant path is harder than a non-compliant one, people drift to the easy option; the durable fix is to reduce the friction.',
  },
  {
    id: 'A-M6-Q5',
    ref: 'M6 Q5',
    source: 'course',
    moduleId: 'module-6',
    domainId: 'governance',
    question:
      'A hiring coordinator uses Claude to screen résumés and produce a shortlist, forwarding it as "the candidates who qualified." The manager never sees excluded candidates. Which ethical concern is most directly raised?',
    options: [
      { id: 'A', text: "Disclosure — applicants weren't told Claude was used" },
      {
        id: 'B',
        text: 'Bias — an automated screen filters people out with no human review of exclusions, so systematic disadvantage can go undetected',
      },
      { id: 'C', text: 'Intellectual property — résumés may contain copyrighted material' },
      {
        id: 'D',
        text: 'Accountability transfer — Claude is now responsible for the hiring decision',
      },
    ],
    correctOptionId: 'B',
    rationale:
      'The defining feature is an automated screen that removes people with no human review of who was excluded; the live risk is systematic bias in the exclusions.',
  },

  /* ---------- Module 7 — Troubleshooting & Optimization ---------- */
  {
    id: 'A-M7-Q1',
    ref: 'M7 Q1',
    source: 'course',
    moduleId: 'module-7',
    domainId: 'troubleshooting',
    question:
      "A brand-new chat's very first response to a vendor renewal email request is generic and ignores the two contract terms you most needed flagged. Nothing degraded over time. Most likely root cause?",
    options: [
      { id: 'A', text: 'Context overload' },
      { id: 'B', text: 'Stale configuration' },
      {
        id: 'C',
        text: 'Under-specification — the prompt never named the contract terms or context that mattered',
      },
      { id: 'D', text: 'Wrong feature — needed Code Execution' },
    ],
    correctOptionId: 'C',
    rationale:
      'A fresh chat with a wrong first response means nothing had time to degrade or drift; the prompt never carried what it needed.',
  },
  {
    id: 'A-M7-Q2',
    ref: 'M7 Q2',
    source: 'course',
    moduleId: 'module-7',
    domainId: 'troubleshooting',
    question:
      "You ask for a thorough competitive analysis; responses stay shallow even after adding detail. You'd selected a fast, lightweight model tier. Diagnosis and fix?",
    options: [
      { id: 'A', text: 'Under-specification — keep adding context' },
      {
        id: 'B',
        text: 'Wrong model tier — switch to a more capable model built for deep analysis',
      },
      { id: 'C', text: 'Context overload — restart from a summary' },
      { id: 'D', text: 'Stale configuration — a knowledge source has drifted' },
    ],
    correctOptionId: 'B',
    rationale:
      'Persistently shallow output on a depth task run on a speed tier is a model-tier mismatch.',
  },
  {
    id: 'A-M7-Q3',
    ref: 'M7 Q3',
    source: 'course',
    moduleId: 'module-7',
    domainId: 'troubleshooting',
    question:
      "An output disappoints. What should you do before concluding Claude can't do the task?",
    options: [
      { id: 'A', text: 'Immediately switch to the most capable model' },
      {
        id: 'B',
        text: 'Run the diagnostic sequence: specification → context length → feature/model → configuration',
      },
      { id: 'C', text: 'Rewrite the prompt from scratch repeatedly' },
      { id: 'D', text: 'Abandon the task and do it manually' },
    ],
    correctOptionId: 'B',
    rationale:
      'Run the diagnostic sequence before concluding the task is not a fit; most failures have a findable cause.',
  },
  {
    id: 'A-M7-Q4',
    ref: 'M7 Q4',
    source: 'course',
    moduleId: 'module-7',
    domainId: 'troubleshooting',
    question:
      'A recurring report needs the same manual correction every week. Most durable fix?',
    options: [
      { id: 'A', text: 'Keep making the correction by hand' },
      {
        id: 'B',
        text: 'Capture the fix as a standing instruction or Skill in the Project so it persists',
      },
      { id: 'C', text: 'Switch models each week' },
      { id: 'D', text: 'Start a fresh conversation each time and re-explain' },
    ],
    correctOptionId: 'B',
    rationale:
      'Promoting the fix into configuration makes it persist; manual correction repeats the waste.',
  },
  {
    id: 'A-M7-Q5',
    ref: 'M7 Q5',
    source: 'course',
    moduleId: 'module-7',
    domainId: 'troubleshooting',
    question:
      'A monthly close report takes ~6 hours with reliable numbers, but three analysts format their sections differently, costing a reviewer ~90 minutes reconciling styles. Which optimization delivers the biggest gain against that specific metric?',
    options: [
      { id: 'A', text: 'Upgrade the model tier so sections draft faster' },
      { id: 'B', text: 'Create one shared Skill that formats every section to a single template' },
      { id: 'C', text: 'Ask analysts to start earlier in the month' },
      { id: 'D', text: 'Add a second reviewer to split the reconciliation work' },
    ],
    correctOptionId: 'B',
    rationale:
      'Targets the measured bottleneck (formatting inconsistency) at its source.',
  },
];
