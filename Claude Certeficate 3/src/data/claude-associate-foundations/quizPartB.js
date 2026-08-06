/*
 * PART B — 50 additional original practice questions.
 *
 * Question text and options are transcribed verbatim from
 * CCAO-F_Question_Dump.md. Correct answers come from that file's answer key at
 * the end of Part B.
 *
 * IMPORTANT — about rationales:
 * Part B of the source dump supplies an answer key only, plus a parenthetical
 * note on a handful of questions. Where the source has a note, it is preserved
 * verbatim in `note`. The `rationale` field is marked
 * `rationaleSource: 'derived'` when it was written from the corresponding
 * module's teaching content rather than quoted from the dump, and the UI
 * labels those so a learner can tell the difference. No answer letter was
 * changed or inferred.
 *
 * Note on section counts: the dump's own headers claim 6 Configuration and
 * 5 Troubleshooting questions, but the file actually contains 5 (B42–B46) and
 * 4 (B47–B50). Part B totals 50 as stated.
 */

const derived = 'derived';

export const partB = [
  /* ---------- Output Evaluation & Validation (11) ---------- */
  {
    id: 'B1',
    ref: 'B1',
    source: 'original',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'Claude drafts a client-facing summary of a technical incident. On review, every sentence is factually correct, but the summary omits the one clause in the SLA that determines whether a penalty applies. What\'s the correct verdict?',
    options: [
      { id: 'A', text: 'Ready to use — nothing false' },
      { id: 'B', text: 'Needs revision — completeness failure, not an accuracy failure' },
      { id: 'C', text: "Needs human override — automatically, because it's client-facing" },
      { id: 'D', text: 'Ready to use, with a disclaimer added' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Accuracy and completeness fail independently. Every claim present is correct, so this is not an accuracy failure; a decision-relevant element is missing, which is the completeness half of the Discernment review. The specific gap is nameable and fixable, so the verdict is needs revision rather than human override.',
  },
  {
    id: 'B2',
    ref: 'B2',
    source: 'original',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'A generated market brief states: "Adoption reached 47.3% in Q2, up from 31.8% in Q1" with no source cited anywhere in the document. What should you do?',
    options: [
      { id: 'A', text: 'Trust it — the precision suggests it came from real data' },
      { id: 'B', text: 'Treat it as a fabricated specific until traced to an actual source' },
      { id: 'C', text: 'Round the numbers to make them look less precise' },
      { id: 'D', text: 'Ask Claude to rephrase it more cautiously' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The precision is the tell, not the reassurance. Real figures this specific arrive with a citation; an uncited decimal-place statistic is a number-shaped guess until traced to a source.',
  },
  {
    id: 'B3',
    ref: 'B3',
    source: 'original',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      "You're reviewing a 40-page report Claude generated from multiple source documents. Page 6 states company revenue was \"$18M,\" page 34 states it was \"$21M.\" What review technique catches this kind of error?",
    options: [
      { id: 'A', text: 'A single careful read-through' },
      { id: 'B', text: 'A dedicated consistency pass checking figures across the full document' },
      { id: 'C', text: 'Asking Claude if the document is internally consistent' },
      { id: 'D', text: 'Spot-checking only the executive summary' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Internal contradictions hide in long outputs because both claims read fine in isolation. Only a pass that holds the whole document in view — comparing figures across sections — surfaces them.',
  },
  {
    id: 'B4',
    ref: 'B4',
    source: 'original',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'Claude tells you "I\'ve sent the follow-up email to the client." Claude has no email-sending tool enabled in this session. What should you conclude?',
    options: [
      { id: 'A', text: "Claude must have used a background tool you're unaware of" },
      {
        id: 'B',
        text: 'This is a capability hallucination — treat the claimed action as unverified until you confirm it yourself',
      },
      { id: 'C', text: "It's a phrasing quirk with no practical implication" },
      { id: 'D', text: 'Ask Claude a second time; if it repeats the claim, trust it' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Claude does not perform external actions it was not given a tool for. A claimed action with no matching tool is a capability hallucination; confirm independently rather than re-asking, since a repeated claim is not evidence.',
  },
  {
    id: 'B5',
    ref: 'B5',
    source: 'original',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'A prompt asks Claude to answer only from an uploaded compliance manual. The response includes a claim not found anywhere in the manual. What prompt-design failure most likely caused this?',
    options: [
      { id: 'A', text: 'The model tier was too low' },
      { id: 'B', text: 'The prompt didn\'t restrict Claude to the source and permit "I don\'t know"' },
      { id: 'C', text: 'The manual was too long' },
      { id: 'D', text: "Code Execution wasn't enabled" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Without explicit source restriction and permission to admit uncertainty, a model under pressure to answer fills the gap. Both techniques together convert open-ended generation into bounded retrieval.',
  },
  {
    id: 'B6',
    ref: 'B6',
    source: 'original',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'You ask Claude to summarize customer complaints and it returns a tidy five-category breakdown. You have no way to see which raw complaints fed which category. What\'s missing?',
    options: [
      { id: 'A', text: 'Nothing — the categorization is the deliverable' },
      {
        id: 'B',
        text: "Traceability — a well-formed summary that can't be traced back to source data can still misrepresent it",
      },
      { id: 'C', text: 'A higher model tier' },
      { id: 'D', text: 'A shorter summary' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Grounding makes both the reasoning and the errors visible. A summary you cannot trace back to the source it claims to summarize is unverifiable, however tidy it looks.',
  },
  {
    id: 'B7',
    ref: 'B7',
    source: 'original',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'Two different runs of the same prompt against the same data produce noticeably different conclusions. What does this signal, and what\'s the appropriate response?',
    options: [
      { id: 'A', text: 'A bug — report it' },
      {
        id: 'B',
        text: 'Divergence across runs — flag the topic for human review rather than picking whichever answer you saw first',
      },
      { id: 'C', text: 'Nothing — this is expected and can be ignored' },
      { id: 'D', text: 'Switch to a faster model to get consistent output' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Best-of-N comparison works both ways: agreement across runs raises confidence, divergence locates the soft spots. Variation is inherent, so this is not a bug, but a divergent conclusion is exactly the signal to send it to a human.',
  },
  {
    id: 'B8',
    ref: 'B8',
    source: 'original',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      "A recommendation memo reads as extremely confident and polished. Which of the following is the most reliable signal that it's actually trustworthy?",
    options: [
      { id: 'A', text: 'Its confident, fluent tone' },
      { id: 'B', text: 'Its length and formatting' },
      {
        id: 'C',
        text: "Traceable citations you've independently checked against source material",
      },
      { id: 'D', text: 'That it agrees with your own initial hunch' },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'Fluency, length, and agreement with your prior view are all failure signatures rather than evidence — the last one is confirmation bias. Only a citation you have independently traced is verification.',
  },
  {
    id: 'B9',
    ref: 'B9',
    source: 'original',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'An analyst is preparing a document for public release. She personally finds it "basically fine" after a quick skim. What does the module\'s stakes-calibration principle say about this?',
    options: [
      { id: 'A', text: 'A quick skim is proportional for any output' },
      {
        id: 'B',
        text: 'Review depth should scale with stakes; public/external release warrants deeper verification than a quick skim',
      },
      { id: 'C', text: 'Only factual claims need checking, not framing' },
      { id: 'D', text: 'External review only matters for legal documents' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Depth of review is set by the stakes, not by how the output looks. A public, external, largely irreversible release trips several risk thresholds and warrants more than a skim.',
  },
  {
    id: 'B10',
    ref: 'B10',
    source: 'original',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      "Claude produces a comparison table of five vendors, each cell computed from a spreadsheet. Which output path guarantees the underlying arithmetic is traceable and re-runnable, even if it doesn't guarantee the code itself is bug-free?",
    options: [
      { id: 'A', text: 'Prose narrative summarizing the comparison' },
      { id: 'B', text: 'A nicely formatted markdown table generated directly' },
      { id: 'C', text: 'Code Execution, where Claude runs code over the actual data' },
      { id: 'D', text: 'Asking Claude to double check its own math in the same response' },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'The guarantee code execution offers is precisely traceability and re-runnability, not correctness — Claude writes the code, so the logic can still contain a bug. Prose and a directly generated table produce plausible figures with nothing to trace.',
  },
  {
    id: 'B11',
    ref: 'B11',
    source: 'original',
    moduleId: 'module-3',
    domainId: 'output-evaluation',
    question:
      'A batch of 12 supplier contracts is reviewed for red-flag clauses. Claude flags issues thoroughly in 11 of them but is silent on the 12th, which happens to be the most unusual contract in the batch. What failure pattern is this?',
    options: [
      { id: 'A', text: 'Fabrication' },
      {
        id: 'B',
        text: 'A completeness gap concentrated on the hardest item — the one requiring the most attention got the least',
      },
      { id: 'C', text: 'Model-tier mismatch' },
      { id: 'D', text: 'Context overload' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Completeness failures concentrate where attention is lowest, and a confident treatment of the easy items masks silence on the hard one. Nothing stated is false, so this is not fabrication.',
  },

  /* ---------- Workflow Integration & Solution Design (8) ---------- */
  {
    id: 'B12',
    ref: 'B12',
    source: 'original',
    moduleId: 'module-4',
    domainId: 'workflow-integration',
    question:
      'A support team wants Claude to triage incoming tickets by urgency and route them. Which step in this workflow is most clearly AI-appropriate on its own?',
    options: [
      { id: 'A', text: 'Notifying the customer their issue is resolved' },
      { id: 'B', text: 'Classifying ticket urgency from the ticket text against defined criteria' },
      { id: 'C', text: 'Issuing a refund over $500' },
      { id: 'D', text: 'Deciding to escalate a legal threat in a ticket' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Classification against defined criteria is reversible, low-stakes, and mechanical. The other three are outbound, financially material, or judgment-bearing — irreversibility or accountability makes each human-retained.',
  },
  {
    id: 'B13',
    ref: 'B13',
    source: 'original',
    moduleId: 'module-4',
    domainId: 'workflow-integration',
    question:
      'A team\'s requirement, as written, says: "The reporting tool should be fast." Why is this a weak requirement?',
    options: [
      { id: 'A', text: "It's too short" },
      { id: 'B', text: '"Fast" is unquantified — different engineers would build to different targets' },
      { id: 'C', text: "It doesn't mention a technology stack" },
      { id: 'D', text: 'It should be written by Claude instead of the team' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A requirement is weak when it is not decidable as written. An unquantified adjective leaves two readers building to different targets, which is the same defect as "a large number of concurrent users."',
  },
  {
    id: 'B14',
    ref: 'B14',
    source: 'original',
    moduleId: 'module-4',
    domainId: 'workflow-integration',
    question:
      "A Claude-assisted onboarding-document generator has just been connected to the HR system's live employee database by another team, without your review. What's the correct response?",
    options: [
      { id: 'A', text: 'Nothing — more data access is always an improvement' },
      {
        id: 'B',
        text: 'Treat this as an escalation trigger: verify the access is proportional and appropriately owned before it goes further',
      },
      { id: 'C', text: 'Assume HR already vetted it since they connected it' },
      { id: 'D', text: 'Switch the underlying model to a more capable tier' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A helper that gains live access to sensitive systems has crossed into territory where least privilege and ownership must be confirmed. Another team connecting it is not the same as it having been vetted.',
  },
  {
    id: 'B15',
    ref: 'B15',
    source: 'original',
    moduleId: 'module-4',
    domainId: 'workflow-integration',
    question:
      'In a workflow redesign, a step is deemed "collaborative" (AI drafts, human reviews). Six months later, an audit finds the human review step is rarely actually performed before output ships. What has happened?',
    options: [
      { id: 'A', text: 'Nothing concerning — the AI has proven reliable' },
      {
        id: 'B',
        text: "Collaborative has quietly collapsed into automated — the review gate exists on paper but isn't staffed",
      },
      { id: 'C', text: 'This means the step should be reclassified as fully AI-appropriate' },
      { id: 'D', text: 'The model should be downgraded to force more caution' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A collaborative step with no real reviewer is an automated step. This is one of the named mapping errors: the classification on paper no longer describes what the workflow actually does.',
  },
  {
    id: 'B16',
    ref: 'B16',
    source: 'original',
    moduleId: 'module-4',
    domainId: 'workflow-integration',
    question:
      'A team describes their new Claude-assisted workflow to a compliance reviewer as: "The AI makes the final call on flagged transactions." What\'s the issue with this framing, independent of how the workflow actually works?',
    options: [
      { id: 'A', text: 'None — as long as it\'s fast' },
      {
        id: 'B',
        text: 'It overstates AI accountability — even if a human quietly reviews everything, this phrasing conceals that gate and misrepresents where accountability sits',
      },
      { id: 'C', text: "It's fine because \"the AI\" is a shorthand everyone understands" },
      { id: 'D', text: "Compliance reviewers don't need this level of detail" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Credibility comes from claims that name the human gate. A phrasing that collapses the gate out of the sentence misrepresents accountability to exactly the audience that needs it stated.',
  },
  {
    id: 'B17',
    ref: 'B17',
    source: 'original',
    moduleId: 'module-4',
    domainId: 'workflow-integration',
    question:
      'A step in a workflow is low-stakes and fully reversible, but requires empathy and relationship judgment (e.g., delivering difficult performance feedback in person). Which Delegation criterion is load-bearing here?',
    options: [
      { id: 'A', text: 'Reversibility' },
      { id: 'B', text: 'Consequence of error' },
      { id: 'C', text: 'Need for human creativity/empathy' },
      { id: 'D', text: 'Accountability' },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'Reversibility and consequence both pass here, so neither is what moves the classification. The relationship element is the one criterion that, if changed, would change the call — which is what "load-bearing" means.',
  },
  {
    id: 'B18',
    ref: 'B18',
    source: 'original',
    moduleId: 'module-4',
    domainId: 'workflow-integration',
    question:
      'A capacity-planning artifact you built for one team is now being copied and reused, unmodified, by four other teams with different data patterns. What should you check first?',
    options: [
      { id: 'A', text: 'Nothing — reuse is success' },
      {
        id: 'B',
        text: "Whether the assumptions and calculations still hold for each new team's context, since it's now being relied on beyond its original scope",
      },
      { id: 'C', text: 'Whether to rename the artifact' },
      { id: 'D', text: 'Whether the artifact is aesthetically pleasing enough for wider use' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Dependency by others is the escalation signal, and assumptions built for one data pattern do not automatically transfer. Check that the logic still holds before the reuse compounds.',
  },
  {
    id: 'B19',
    ref: 'B19',
    source: 'original',
    moduleId: 'module-4',
    domainId: 'workflow-integration',
    question:
      'Which of the following is the most load-bearing reason a step like "final sign-off on a legally binding external communication" stays human-retained, regardless of how good the AI draft is?',
    options: [
      { id: 'A', text: 'AI drafts are usually lower quality than human drafts' },
      { id: 'B', text: 'Accountability for the communication cannot transfer to a tool' },
      { id: 'C', text: 'It takes too long for AI to draft legal communications' },
      { id: 'D', text: 'Legal communications require a specific model tier' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The question stipulates the draft is good, which rules out any quality-based answer. Accountability does not delegate even when the drafting does — drafting quality is not a license to delegate the decision.',
  },

  /* ---------- Governance, Risk & Responsible Use (9) ---------- */
  {
    id: 'B20',
    ref: 'B20',
    source: 'original',
    moduleId: 'module-6',
    domainId: 'governance',
    question:
      'A manager wants to use Claude to draft layoff notification letters that will be sent without any further review, since "the template is always the same." How should this be classified?',
    options: [
      { id: 'A', text: "Fully appropriate — it's just a template" },
      {
        id: 'B',
        text: 'Appropriate with human review — a defined gate is still needed given consequence and the human element',
      },
      { id: 'C', text: 'Inappropriate — regardless of any gate, this should never involve AI' },
      { id: 'D', text: 'Appropriate only if a more capable model is used' },
    ],
    correctOptionId: 'B',
    note: "Reasonable people could debate B vs. C; the module's framework asks you to name the load-bearing criterion and specify a gate — an unreviewed send is the actual problem here. The source dump flags this as the one genuinely debatable question in the set: understand why, not just the letter.",
    rationaleSource: derived,
    rationale:
      'The consequence for the individual is high and the task is relationship-sensitive, but a defined gate restores accountability and reversibility. The load-bearing failure in the proposal is the unreviewed send, not the drafting assistance itself.',
  },
  {
    id: 'B21',
    ref: 'B21',
    source: 'original',
    moduleId: 'module-6',
    domainId: 'governance',
    question:
      'Your organization has an approved, vetted Skill catalog. A colleague on another team offers you a Skill they built themselves for "faster invoice processing." What\'s the correct first move?',
    options: [
      { id: 'A', text: 'Enable it immediately since a colleague built it' },
      {
        id: 'B',
        text: 'Treat it like unvetted software — confirm with the publisher what it accesses and whether its permissions still match current policy before enabling it on your own data',
      },
      { id: 'C', text: "Decline automatically since it's not in the official catalog" },
      { id: 'D', text: 'Enable it only in Incognito mode' },
    ],
    correctOptionId: 'B',
    note: 'Enabling in Incognito does not address the underlying trust/permissions question.',
    rationaleSource: derived,
    rationale:
      '"Internal" does not mean vetted — a sister team may have granted broad access for their own convenience or built against an older policy. The trust check is a source-and-reach conversation with the publisher, not an automatic yes or an automatic ban.',
  },
  {
    id: 'B22',
    ref: 'B22',
    source: 'original',
    moduleId: 'module-6',
    domainId: 'governance',
    question:
      "You've been asked to analyze customer churn using a dataset that includes full names, home addresses, and account numbers, but your analysis only needs churn patterns by region and tenure. Best practice?",
    options: [
      { id: 'A', text: 'Upload the full dataset — more data is always better for analysis' },
      {
        id: 'B',
        text: "Redact or replace identifying fields (names, addresses, account numbers) with generic labels before uploading, since the analysis doesn't need them",
      },
      { id: 'C', text: 'Use Incognito mode instead of redacting' },
      { id: 'D', text: 'Ask Claude to ignore the sensitive fields itself' },
    ],
    correctOptionId: 'B',
    note: 'Incognito controls persistence, not whether upload was appropriate in the first place; redaction addresses the actual risk.',
    rationaleSource: derived,
    rationale:
      'Redaction is the right tool exactly when sensitivity and necessity do not overlap: the analysis needs region and tenure, not identity. Strip every field that could lead to identification, not just the names.',
  },
  {
    id: 'B23',
    ref: 'B23',
    source: 'original',
    moduleId: 'module-6',
    domainId: 'governance',
    question:
      'A dataset contains protected health information. Your organization has not confirmed whether any current entry point is approved for PHI. What should you do?',
    options: [
      { id: 'A', text: "Use Incognito mode and proceed — it's the safest available control" },
      {
        id: 'B',
        text: 'Stop and escalate to your admin to confirm an approved, compliant path before uploading anything',
      },
      { id: 'C', text: 'Proceed since PHI is a common data type' },
      { id: 'D', text: 'Redact only the patient names and proceed' },
    ],
    correctOptionId: 'B',
    note: 'For regulated data, "is this allowed here" is settled before "how do I handle it here" — Incognito doesn\'t resolve that first question.',
    rationaleSource: derived,
    rationale:
      'This is red-tier data, and Incognito controls whether something is remembered, not whether it was allowed here in the first place. Partial redaction also fails: clinical detail can still identify someone.',
  },
  {
    id: 'B24',
    ref: 'B24',
    source: 'original',
    moduleId: 'module-6',
    domainId: 'governance',
    question:
      "A monthly self-audit finds that a team has been uploading unreleased product roadmaps to a Claude entry point not approved for that sensitivity tier, consistently, for three months. What does this represent, and what's the durable fix?",
    options: [
      { id: 'A', text: 'A minor issue not worth addressing since nothing bad has happened yet' },
      {
        id: 'B',
        text: 'A Diligence gap — the routine, low-visibility use has drifted from policy; the fix is closing the specific gap (redirect to the approved entry point, reinforce the classification habit)',
      },
      { id: 'C', text: 'Grounds to ban all uploads across the org' },
      { id: 'D', text: 'A reason to disable Memory for the whole organization' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Routine, low-visibility decisions are exactly where drift accumulates unnoticed. An audit converts invisible risk into a closeable action; the absence of a visible incident is not evidence the practice is safe.',
  },
  {
    id: 'B25',
    ref: 'B25',
    source: 'original',
    moduleId: 'module-6',
    domainId: 'governance',
    question:
      'A Skill built by a sister team inside your own company requests broad file-system access "for convenience." Should "it\'s internal" settle the trust question?',
    options: [
      { id: 'A', text: 'Yes — internal tools are inherently vetted' },
      {
        id: 'B',
        text: "No — internal doesn't mean vetted; confirm what it accesses and whether that access still matches current policy before use",
      },
      { id: 'C', text: 'Yes, as long as it was built more than six months ago' },
      { id: 'D', text: 'No — internal Skills should never be used' },
    ],
    correctOptionId: 'B',
    note: 'The module explicitly makes internal-but-unvetted the hardest case, not an automatic pass or ban.',
    rationaleSource: derived,
    rationale:
      'Treat an internal Skill from outside your team the way you would software from a sister department. Broad access "for convenience" is the disproportionality signal; the answer is a trust check, not a blanket ban.',
  },
  {
    id: 'B26',
    ref: 'B26',
    source: 'original',
    moduleId: 'module-6',
    domainId: 'governance',
    question:
      'An HR tool auto-generates candidate rejection emails after an AI screen, with no human reviewing which candidates were excluded or why. Months later, a pattern emerges where one demographic group is disproportionately screened out. What was the primary governance failure?',
    options: [
      { id: 'A', text: 'The rejection emails were too impersonal' },
      {
        id: 'B',
        text: 'No human reviewed the exclusions the automated screen produced, so systemic bias went undetected',
      },
      { id: 'C', text: 'The AI model used was outdated' },
      { id: 'D', text: "Candidates weren't told a template was used" },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The defining feature is an automated screen that removes people with no review of who was excluded. Fairness risk is highest where the stakes for individuals are highest, and an unreviewed exclusion path is where it goes undetected.',
  },
  {
    id: 'B27',
    ref: 'B27',
    source: 'original',
    moduleId: 'module-6',
    domainId: 'governance',
    question:
      "A practitioner is asked to evaluate an ambiguous ethical situation with no clear policy precedent, involving a large number of affected employees. What's the appropriate move?",
    options: [
      { id: 'A', text: 'Make the call individually and move on — waiting for guidance wastes time' },
      {
        id: 'B',
        text: "Reason through it structurally (who's affected, what could go wrong, what's fair, what disclosure is needed), document that reasoning, and escalate given the scale of potential harm",
      },
      { id: 'C', text: 'Default to whatever is fastest to implement' },
      { id: 'D', text: 'Avoid documenting the reasoning to keep the record simple' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Structured reasoning handles most ambiguous cases, but a large affected population is the condition for escalating rather than deciding alone. Escalating with documented reasoning is more useful than bringing a verdict.',
  },
  {
    id: 'B28',
    ref: 'B28',
    source: 'original',
    moduleId: 'module-6',
    domainId: 'governance',
    question:
      'Which of these best reflects the "least privilege" principle from the Skills/feature-risk material?',
    options: [
      { id: 'A', text: 'Enable every available feature so nothing is missed' },
      {
        id: 'B',
        text: 'Grant the narrowest access that lets the job get done, and revisit that access when the job changes',
      },
      { id: 'C', text: 'Grant broad access up front and restrict later if problems occur' },
      { id: 'D', text: 'Access levels are fixed by the vendor and not something practitioners manage' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Least privilege is defined as the narrowest access that does the job, revisited when the job changes. The revisit clause is the part people drop; access proportional last quarter may not be proportional now.',
  },

  /* ---------- Prompting & Task Execution (7) ---------- */
  {
    id: 'B29',
    ref: 'B29',
    source: 'original',
    moduleId: 'module-2',
    domainId: 'prompting',
    question:
      'A prompt says: "Analyze this data and tell me what\'s important." The response is vague and doesn\'t match what the requester actually needed. Which missing component most directly explains this?',
    options: [
      { id: 'A', text: 'Role' },
      { id: 'B', text: 'Context — no criteria for "important" were given' },
      { id: 'C', text: 'Output format' },
      { id: 'D', text: 'Model choice' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Generic, off-target output is the signature of a context gap. What counts as "important" lives only in the requester\'s head, and Claude cannot infer it.',
  },
  {
    id: 'B30',
    ref: 'B30',
    source: 'original',
    moduleId: 'module-2',
    domainId: 'prompting',
    question:
      'You need Claude to draft a client apology for a service outage. Which combination of components matters most here?',
    options: [
      { id: 'A', text: 'Task and output format only' },
      {
        id: 'B',
        text: 'Role, context (what happened, who the audience is), constraints (tone — accountable, not defensive), output format',
      },
      { id: 'C', text: 'Just the task, stated clearly' },
      {
        id: 'D',
        text: 'A longer prompt is always better regardless of which components it includes',
      },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A client-facing deliverable is the case that needs all five components. Length is not the variable — which components carry weight is.',
  },
  {
    id: 'B31',
    ref: 'B31',
    source: 'original',
    moduleId: 'module-2',
    domainId: 'prompting',
    question:
      'A four-stage content workflow (research → outline → draft → edit) is being run in Claude. At what point does it make sense to split into a new conversation rather than continue the same one?',
    options: [
      { id: 'A', text: 'Never — always keep everything in one conversation' },
      {
        id: 'B',
        text: "When a stage doesn't depend on the prior stages' specific content, or when the current conversation is showing signs of context degradation",
      },
      { id: 'C', text: 'After every single stage, regardless of dependency' },
      { id: 'D', text: 'Only if the model tier changes' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Sequential steps that build on each other stay in one conversation so each sees the prior results. Genuine independence or visible context degradation are the two conditions that justify a split.',
  },
  {
    id: 'B32',
    ref: 'B32',
    source: 'original',
    moduleId: 'module-2',
    domainId: 'prompting',
    question:
      'After three rounds of revision, the fourth round produces output nearly identical to the third. What does this indicate?',
    options: [
      { id: 'A', text: 'Keep iterating — round five will likely be the breakthrough' },
      { id: 'B', text: 'Diminishing returns — a manual edit now likely beats another prompting round' },
      { id: 'C', text: 'Switch models immediately' },
      { id: 'D', text: 'The task is impossible for Claude' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Iteration has converged when rounds produce marginal change rather than improvement. The goal is a usable result, not a perfect prompt.',
  },
  {
    id: 'B33',
    ref: 'B33',
    source: 'original',
    moduleId: 'module-2',
    domainId: 'prompting',
    question:
      'A prompt for a research task says: "Find out about our competitor\'s pricing." Which addition would most improve reliability of the output?',
    options: [
      { id: 'A', text: "Nothing — it's already clear" },
      {
        id: 'B',
        text: 'A defined scope (which competitors, what pricing tiers) and a request for citations so claims are checkable',
      },
      { id: 'C', text: 'A request for a longer answer' },
      { id: 'D', text: 'A request for a more creative answer' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Research is the task type that rewards tightening scope, sources, and citations. Length and creativity are the wrong dials entirely for a task judged on checkability.',
  },
  {
    id: 'B34',
    ref: 'B34',
    source: 'original',
    moduleId: 'module-2',
    domainId: 'prompting',
    question:
      'Comparing "Summarize this" vs. "Summarize this for a VP audience in three bullets focused on budget impact" — what\'s the core difference in prompting discipline being demonstrated?',
    options: [
      { id: 'A', text: 'The second is just longer' },
      {
        id: 'B',
        text: 'The second specifies context, constraints, and format the first left to guesswork',
      },
      { id: 'C', text: 'The second uses more technical vocabulary' },
      { id: 'D', text: 'There is no meaningful difference; Claude infers audience either way' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'This is the Description competency: making each component explicit rather than assuming inference. The gain comes from specification, not from word count.',
  },
  {
    id: 'B35',
    ref: 'B35',
    source: 'original',
    moduleId: 'module-2',
    domainId: 'prompting',
    question:
      "A task requires Claude to draft a document AND perform an exact cost calculation feeding into it. What's the correct approach to a single combined prompt?",
    options: [
      { id: 'A', text: 'One prompt asking for both the draft and the calculation in prose' },
      {
        id: 'B',
        text: 'Have Claude perform the calculation via Code Execution first (or as a verified step), then draft the document using the verified figures',
      },
      { id: 'C', text: 'Skip the calculation and let the reader compute it' },
      { id: 'D', text: 'Ask for the draft first, backfill numbers later without verification' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Decomposition plus verified computation: build the checkable foundation first, then draft on top of it. Drafting first and backfilling propagates an unverified figure through the document.',
  },

  /* ---------- Product & Model Selection (6) ---------- */
  {
    id: 'B36',
    ref: 'B36',
    source: 'original',
    moduleId: 'module-1',
    domainId: 'product-model-selection',
    question:
      'A support team needs to classify thousands of incoming tickets per day into 5 fixed categories using a stable, unambiguous rubric. Which model tier fits best, and why?',
    options: [
      { id: 'A', text: 'Opus — always choose the most capable model for production use' },
      {
        id: 'B',
        text: 'Haiku — high-volume, unambiguous, structured classification is exactly its use case',
      },
      { id: 'C', text: 'Sonnet — it\'s the "safe default" for everything' },
      { id: 'D', text: 'Whichever model is cheapest that week' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      "High volume plus an unambiguous rubric is Haiku's profile, and its speed advantage compounds across thousands of items. Reserve Opus for work where the quality ceiling genuinely matters.",
  },
  {
    id: 'B37',
    ref: 'B37',
    source: 'original',
    moduleId: 'module-1',
    domainId: 'product-model-selection',
    question:
      'A one-off, exploratory question with no reuse planned is best handled in which entry point?',
    options: [
      { id: 'A', text: 'A Project' },
      { id: 'B', text: 'Chat' },
      { id: 'C', text: 'An Artifact' },
      { id: 'D', text: 'Research' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Chat is the entry point for one-off questions, quick drafts, and exploratory prompting — work that starts and ends in the session. A Project would cost more setup than it recovers.',
  },
  {
    id: 'B38',
    ref: 'B38',
    source: 'original',
    moduleId: 'module-1',
    domainId: 'product-model-selection',
    question:
      'A team needs Claude to synthesize considerations across 15+ sources for a nuanced market-entry recommendation with real ambiguity in the trade-offs. Which model tier is most appropriate?',
    options: [
      { id: 'A', text: 'Haiku, for speed' },
      { id: 'B', text: 'Sonnet, as a default with no further thought needed' },
      { id: 'C', text: 'Opus, given the complexity, ambiguity, and stakes involved' },
      { id: 'D', text: "Model choice doesn't matter for synthesis tasks" },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'Nuanced judgment, ambiguous inputs requiring interpretation, and high-stakes multi-source synthesis are the named Opus candidates. B is wrong less for the tier than for the "no further thought needed" reasoning.',
  },
  {
    id: 'B39',
    ref: 'B39',
    source: 'original',
    moduleId: 'module-1',
    domainId: 'product-model-selection',
    question:
      'A recurring monthly workflow has stable background context, produces a consistent output format, and happens every month without fail. Per the "2 of 3 questions" framework, should this become a Project?',
    options: [
      { id: 'A', text: 'No — Projects are only for teams, not individuals' },
      {
        id: 'B',
        text: 'Yes — it clears at least 2 of the 3 criteria (recurs, stable context, consistent format)',
      },
      { id: 'C', text: 'No — only tasks involving calculations need Projects' },
      { id: 'D', text: 'Only if the task also needs Opus' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'It clears all three, not merely two, so the Project is comfortably justified; the setup time is recovered within two or three sessions.',
  },
  {
    id: 'B40',
    ref: 'B40',
    source: 'original',
    moduleId: 'module-1',
    domainId: 'product-model-selection',
    question:
      'A deliverable will be a downloadable, formatted Excel file with several tabs and formulas. Beyond model choice, what else is essential to get a reliable result?',
    options: [
      { id: 'A', text: 'Nothing beyond a good prompt' },
      {
        id: 'B',
        text: 'Code Execution (to produce and verify the actual file), likely paired with the relevant Skill',
      },
      { id: 'C', text: 'Just a higher model tier' },
      { id: 'D', text: 'Running the same prompt multiple times and picking the best file' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A real downloadable file is one of the named triggers for Code Execution, and Anthropic provides built-in Skills for spreadsheet work. The capability layer, not the model tier, is what produces the artifact.',
  },
  {
    id: 'B41',
    ref: 'B41',
    source: 'original',
    moduleId: 'module-1',
    domainId: 'product-model-selection',
    question:
      'A user says: "I need this done as fast as possible and I don\'t mind if it\'s occasionally imperfect since I\'ll skim it anyway." What does this signal about model tier choice?',
    options: [
      { id: 'A', text: 'Always use Opus regardless of stated priorities' },
      {
        id: 'B',
        text: 'This favors a faster, lighter tier (e.g., Haiku) since speed matters more than maximal accuracy here',
      },
      { id: 'C', text: 'Use Research instead of a model choice' },
      { id: 'D', text: 'This has no bearing on model selection' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The tier decision is a speed-versus-capability trade-off, and the user has explicitly stated that the cost of an imperfect output is low. That is the condition for the fast tier.',
  },

  /* ---------- Configuration & Knowledge Management (5) ---------- */
  {
    id: 'B42',
    ref: 'B42',
    source: 'original',
    moduleId: 'module-5',
    domainId: 'configuration',
    question:
      'A Project\'s standing instructions currently include: "Follow the standard client-report format: exec summary, methodology, findings, then a page of appendix tables. Findings must be code-executed, not estimated." Where should the actual template file with sample tables live?',
    options: [
      { id: 'A', text: 'Nowhere — the instruction text is sufficient on its own' },
      {
        id: 'B',
        text: 'The knowledge base, alongside the instruction (the instruction is the rule; the template is the reference material it points to)',
      },
      { id: 'C', text: 'A Skill only, with no instruction needed' },
      { id: 'D', text: 'Memory, since it\'s used often' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'This is the pairing rule: a behavior rule plus the facts it acts on. The instruction has nothing to point at without the template, and the template gets used inconsistently without the instruction.',
  },
  {
    id: 'B43',
    ref: 'B43',
    source: 'original',
    moduleId: 'module-5',
    domainId: 'configuration',
    question:
      "A team keeps three versions of the same product spec in a Project's knowledge base — v1, v2 (current), and a draft v3. Claude occasionally cites v1 by mistake. What's the fix?",
    options: [
      { id: 'A', text: 'Add an instruction telling Claude to "always use the right version"' },
      {
        id: 'B',
        text: 'Remove the superseded/draft versions so only the current spec remains — curate the knowledge base like a shared drive',
      },
      { id: 'C', text: 'Switch to a more capable model' },
      { id: 'D', text: 'Nothing — this is expected behavior' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A knowledge base holding three versions of the same document invites Claude to cite the wrong one. Fix the input rather than adding an instruction that papers over it — and "always use the right version" is exactly the vague instruction that silently fails.',
  },
  {
    id: 'B44',
    ref: 'B44',
    source: 'original',
    moduleId: 'module-5',
    domainId: 'configuration',
    question:
      "Which of the following instructions would most reliably change Claude's actual output, versus reading as an aspiration?",
    options: [
      { id: 'A', text: '"Be thorough and accurate."' },
      {
        id: 'B',
        text: '"For every number reported, include its source document and page number; if a figure isn\'t in the provided data, label it \'unverified.\'"',
      },
      { id: 'C', text: '"Try to get this right."' },
      { id: 'D', text: '"Do a good job on this."' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The test of an instruction is whether two different people would read it the same way. Only B names a concrete, checkable behavior; the others give Claude nothing to act on and fail without announcing it.',
  },
  {
    id: 'B45',
    ref: 'B45',
    source: 'original',
    moduleId: 'module-5',
    domainId: 'configuration',
    question:
      "A Project's Memory contains a note referencing a stakeholder who left the company eight months ago, and this keeps surfacing in drafted emails. What's the correct maintenance action?",
    options: [
      { id: 'A', text: 'Leave it — Memory is meant to be comprehensive' },
      { id: 'B', text: 'Review and delete the stale entry as part of routine Memory curation' },
      { id: 'C', text: 'Turn off Memory for the whole Project permanently' },
      { id: 'D', text: 'Switch to Incognito mode going forward' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'Treat Memory like a working file: the accuracy of what is stored matters more than the volume. Disabling Memory outright sacrifices the continuity that makes the Project useful over one stale entry.',
  },
  {
    id: 'B46',
    ref: 'B46',
    source: 'original',
    moduleId: 'module-5',
    domainId: 'configuration',
    question:
      "A connector that's supposed to read calendar events is instead being used to try to create new events, and it silently fails to do anything useful. What's the most likely explanation and correct response?",
    options: [
      { id: 'A', text: 'The connector is broken; escalate as a bug immediately' },
      {
        id: 'B',
        text: 'This is likely a capability boundary (read-only) — confirm what the connector actually supports before treating it as a defect',
      },
      { id: 'C', text: 'Switch to a different, unrelated connector' },
      { id: 'D', text: 'Restart the whole Project' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'A connector at its capability boundary fails confusingly rather than with a clear error, which is exactly why it gets mislabeled as a bug and reported to the wrong team.',
  },

  /* ---------- Troubleshooting & Optimization (4) ---------- */
  {
    id: 'B47',
    ref: 'B47',
    source: 'original',
    moduleId: 'module-7',
    domainId: 'troubleshooting',
    question:
      "A weekly summary task worked perfectly for two months. This week, output quality dropped noticeably with no error shown. What should you check first, per the diagnostic sequence's cost-ordering?",
    options: [
      { id: 'A', text: 'Immediately assume the task is no longer a fit for Claude' },
      {
        id: 'B',
        text: 'Re-check the prompt/specification, then context length, then feature/model choice, then configuration — cheapest checks first',
      },
      { id: 'C', text: 'Switch to the most capable model right away' },
      { id: 'D', text: 'Abandon the workflow and do it manually going forward' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'The sequence runs cheapest-fix-first by design. "It used to work" points toward stale configuration, but that check is reached by running the sequence in order, not by skipping to step 5 — the most expensive conclusion.',
  },
  {
    id: 'B48',
    ref: 'B48',
    source: 'original',
    moduleId: 'module-7',
    domainId: 'troubleshooting',
    question:
      "In a fresh, short conversation, Claude gives a subtly wrong dollar figure that it computed by describing the arithmetic in prose rather than running it. What's the most targeted fix?",
    options: [
      { id: 'A', text: 'Restart the conversation' },
      { id: 'B', text: 'Switch to a different model tier' },
      { id: 'C', text: 'Ask Claude to use Code Execution for the calculation instead of prose arithmetic' },
      { id: 'D', text: 'Add more context about the business' },
    ],
    correctOptionId: 'C',
    rationaleSource: derived,
    rationale:
      'Numbers that are subtly wrong is the signature of the wrong-feature pattern. The conversation is fresh so context is not the issue, and no amount of extra context or model capability substitutes for actually running the calculation.',
  },
  {
    id: 'B49',
    ref: 'B49',
    source: 'original',
    moduleId: 'module-7',
    domainId: 'troubleshooting',
    question:
      'A recurring workflow shows three signs: the same background is pasted every session, the same correction is made every round, and different team members get different-quality results. Which combination of fixes addresses all three signals?',
    options: [
      { id: 'A', text: 'A faster model for everyone' },
      {
        id: 'B',
        text: 'Move background into the knowledge base/standing instructions, capture the correction as a standing instruction, and create a shared Skill so everyone runs the same setup',
      },
      { id: 'C', text: 'Tell each team member to try harder' },
      { id: 'D', text: 'Increase the number of revision rounds allowed' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'These are the three friction signals — repetition, correction, and variance — and each has its own promotion home. Reference goes to knowledge, the rule goes to a standing instruction, and the shared procedure goes to a Skill.',
  },
  {
    id: 'B50',
    ref: 'B50',
    source: 'original',
    moduleId: 'module-7',
    domainId: 'troubleshooting',
    question:
      "You ask Claude to predict next month's exact revenue to the dollar, and after several prompt rewrites, the number is still clearly a guess dressed up as precision. What's the correct diagnosis?",
    options: [
      { id: 'A', text: 'Under-specification — keep refining the prompt' },
      {
        id: 'B',
        text: "An expectation mismatch — reshape the task into a defensible range with stated assumptions, since exact future prediction isn't a fixable prompting problem",
      },
      { id: 'C', text: 'Context overload — restart the session' },
      { id: 'D', text: 'Wrong model — try a more capable tier' },
    ],
    correctOptionId: 'B',
    rationaleSource: derived,
    rationale:
      'This is the step-5 case the sequence is built to reach only after the cheaper causes are ruled out — and the rewrites have ruled them out. No prompt, restart, feature, or model change fixes a task asking for something the tool cannot do.',
  },
];
