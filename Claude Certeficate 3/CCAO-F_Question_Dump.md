# Claude Certified Associate – Foundations (CCAO-F)
## Complete Question Dump for Exam Practice

**Format:** 60 scenario-based MCQs, 120 minutes, pass mark 720/1000
**Domains:** Output Evaluation & Validation (21%) · Workflow Integration & Solution Design (16%) · Governance, Risk & Responsible Use (15%) · Prompting & Task Execution (14%) · Product & Model Selection (12%) · Configuration & Knowledge Management (12%) · Troubleshooting & Optimization (10%)

This document has two parts:
- **Part A** — every quiz question from Modules 1–7 of your course, verbatim, with the correct answer and reasoning.
- **Part B** — 50 additional original scenario questions, built in the same style and roughly weighted to match the real domain percentages, so you get exposure beyond just the course's own questions. Answers are in an **answer key at the very end** so you can self-test honestly before checking.

---

# PART A — Official Course Quiz Questions (37 total)

## Module 1 — Product & Model Selection

**Q1.** An operations analyst runs a weekly inventory reconciliation. Each week she uploads a new inventory file, compares it against a reorder threshold document that has not changed in a year, and produces a formatted exception report. Which configuration best fits this workflow?
A. A new Chat conversation each week, with the threshold document and inventory file pasted in
B. A Project with the threshold document in the knowledge base, standing instructions for the exception format, and Code Execution for the comparison calculations
C. Research with the inventory file uploaded each week
D. Artifacts saved from each week's session as the primary continuity mechanism
**Answer: B** — Recurring task (Project), stable reference document (knowledge base), consistent format (standing instructions), accurate numeric comparison (Code Execution).

**Q2.** A financial planner asks Claude to calculate compound interest on a portfolio scenario with five input variables. Which approach produces the most trustworthy result?
A. Ask Claude to calculate it in Chat and review manually
B. Upload variables to a Project and ask Claude to estimate the figure
C. Use Code Execution to run the calculation and return a verified result
D. Use Research to find comparable portfolio scenarios
**Answer: C** — Code Execution produces a verified result; prose generation produces a plausible estimate that may be wrong.

**Q3.** A legal team needs to review 500 standard vendor agreements and classify each as low/medium/high risk using a clear, unambiguous rubric, in one session. Which model is most appropriate?
A. Opus, for highest accuracy
B. Sonnet, for balanced performance
C. Haiku, for fast, efficient structured classification at volume
D. The default model, since selection isn't adjustable
**Answer: C** — Unambiguous rubric + high volume = Haiku's use case; Opus is for nuanced judgment.

**Q4.** A consultant has worked in a single session for two hours on a complex analysis. In the last 30 minutes, responses stopped reflecting the analytical framework defined at the start. Most appropriate response?
A. Increase to Opus
B. Repeat the framework in the current conversation
C. Start a new conversation, paste a summary of decisions/progress, continue from there
D. Enable Research for more external context
**Answer: C** — Context degradation; restarting from a summary is correct. Repeating (B) extends a degraded session; model change (A) doesn't fix exhausted context.

**Q5.** A consultant works on two client accounts and wants Client A context never to appear in Client B sessions. Correct configuration?
A. Incognito mode for all sessions
B. Clear Memory manually before switching clients
C. Separate Projects per client, using Project-scoped Memory
D. A different model tier per client
**Answer: C** — Project-scoped Memory keeps contexts separate per Project.

---

## Module 2 — Prompting & Task Execution

**Q1.** "Write a post about our new feature" produces generic copy. Which single change most improves the result?
A. Ask Claude to try harder / be more creative
B. Add context (audience, channel, key benefit) and output format
C. Switch to a more capable model and resend
D. Run it several times and pick the best
**Answer: B** — Generic output = context gap; a better model doesn't fix under-specification.

**Q2.** An analyst needs Claude to evaluate five suppliers against a requirements doc and recommend one. Most reliable approach?
A. Ask for evaluation + recommendation in one prompt
B. Decompose: derive criteria → score each → identify trade-offs → recommend
C. Ask Claude to recommend first, justify after
D. Five separate conversations, one per supplier, no shared criteria
**Answer: B** — Ordered decomposition with checkable intermediate results.

**Q3.** A memo came back accurate but too long and too formal. Most efficient next step?
A. Rewrite the entire prompt
B. Switch models and regenerate
C. Adjust constraint/format components (length, tone) and resend
D. Manually cut it down and abandon the prompt
**Answer: C** — Targeted fix on the failing components.

**Q4.** A team wants the widest range of campaign concepts before narrowing. How should the prompt be calibrated?
A. Tight constraints on length/format/terminology up front
B. Give the goal + a few guardrails, ask for volume/range, filter after
C. Request a single best idea
D. Specify the exact creative direction
**Answer: B** — Brainstorming rewards latitude; filter after generating.

**Q5.** "Calculate the average deal size and summarize the trend" — summary is fine, average looks off. Best fix?
A. Trust the number
B. Add a constraint to use Code Execution for the calculation
C. Ask Claude to recompute three times and average those
D. Remove the calculation from the prompt
**Answer: B** — Suspect calculation = verification problem, solved by Code Execution.

---

## Module 3 — Output Evaluation & Validation

**Q1.** A report is accurate on every figure you checked, but you suspect a relevant factor was omitted entirely. What does a complete Discernment review require?
A. Nothing further — figures checked out
B. A separate completeness check against requirements, looking for missing elements
C. Re-run on a more capable model
D. Ask Claude if it left anything out and trust the answer
**Answer: B** — Completeness is a separate check from accuracy.

**Q2.** A market analysis includes a precise, confident statistic with no source. Most likely risk?
A. Fine — confident, specific figures are usually reliable
B. A fabricated specific — invented detail that reads as authoritative because it's precise
C. A formatting issue
D. A model-tier problem
**Answer: B** — Specificity is the tell, not a reassurance.

**Q3.** You need Claude to answer strictly from an uploaded contract without inventing anything. Which technique most reduces hallucination?
A. Ask and trust Claude to stay within the document
B. Restrict to the document, permit "I don't know," require citations to specific clauses
C. Ask the same question five times and average
D. Use the most capable model, ask in one sentence
**Answer: B** — Source restriction + permission for uncertainty + auditable citations, combined.

**Q4.** A reconciliation table feeding a regulatory filing is clean and well-formatted, but its subtotal doesn't match the line items. Correct action?
A. Accept it — formatting is clean
B. Recompute with Code Execution, confirm the subtotal reconciles, resolve before use
C. Submit now, flag the discrepancy afterward
D. Ask Claude to reformat and resubmit
**Answer: B** — Internal inconsistency must be resolved before use, not after.

**Q5.** One analysis must go to both the executive team and the working group. Best approach?
A. Send the same full draft to both
B. Produce an executive version (decision/impact) and a working-team version (detail/method)
C. Send executives the raw output
D. Ask Claude which audience matters more
**Answer: B** — Audience calibration produces distinct versions from the same facts.

**Q6.** A deliverable depends on a multi-variable financial calculation that must be exactly right. Most trustworthy output path?
A. Calculate inline, review the number
B. Request the figure as a formatted table
C. Use Code Execution so the calculation is run and verified
D. Use Research to find a comparable published figure
**Answer: C** — Exact calculation = reliability problem, solved by Code Execution.

**Q7.** A learner pastes six overlapping source files (several near-duplicate drafts) and asks for a policy summary. The summary comes back muddled with contradictory points. What most improves quality?
A. Switch to a higher model tier, re-run the same six files
B. De-duplicate/prune to the single approved version, label each remaining input, re-run
C. Ask Claude to make the summary longer
D. Paste all six files again in a fresh conversation
**Answer: B** — Curate inputs at the source; a bigger model still has to reconcile contradictions.

---

## Module 4 — Workflow Integration & Solution Design

**Q1.** Claude extracted four requirement statements from a vendor brief. Which is most ambiguous — the one that would lead two engineers to build different things?
A. "The system must export reports in both PDF and CSV formats."
B. "The system should handle a large number of concurrent users."
C. "The login page must support single sign-on through the company's existing identity provider."
D. "Password-reset emails must be sent within five minutes of a request."
**Answer: B** — "A large number" is unquantified; the others are concrete and testable.

**Q2.** A capacity plan depends on growth/throughput figures from an uploaded dataset. How should those figures be produced?
A. Ask Claude to estimate them in prose
B. Use Code Execution to compute them, then synthesize the plan from verified numbers
C. Use Research to find industry averages instead
D. Have Claude recall typical figures from training data
**Answer: B** — Verify first, synthesize second.

**Q3.** A Claude-built dashboard artifact that started as an internal helper is now relied on daily by three departments. What does this signal?
A. Nothing — keep iterating by prompt as before
B. It has become a system others depend on and should be escalated toward Developer/Architect expertise
C. Switch to a more capable model and continue
D. Move it into Incognito mode for safety
**Answer: B** — Dependency by others is the escalation trigger, not complexity.

**Q4.** In a contract-review redesign, which step should remain human-retained?
A. Extracting clauses from the document
B. Flagging departures from the playbook
C. Approving or rejecting each change and signing the contract
D. Computing the financial exposure of a penalty clause
**Answer: C** — Irreversible + accountability-bearing, regardless of draft quality.

**Q5.** Which description of an AI-assisted contract workflow best builds stakeholder trust?
A. "Our AI reviews contracts automatically."
B. "Claude drafts the redline and flags playbook departures; our legal lead reviews and approves every change before sending."
C. "Claude handles all the legal work now."
D. "The AI is fully autonomous, so we no longer need legal review."
**Answer: B** — Accurate value + limits + a named human gate.

---

## Module 5 — Configuration & Knowledge Management

**Q1.** A team wants every report in a Project to follow the same multi-step formatting procedure. Which mechanism fits?
A. A standing instruction describing the format in prose
B. A Skill that carries the repeatable formatting procedure
C. A document in the knowledge base
D. A Memory entry
**Answer: B** — Multi-step procedure = Skill.

**Q2.** An equity analyst covers two competing retailers and must ensure each company's confidential modeling assumptions never surface in work on the other. Correct setup?
A. A single Project covering both, separated by careful prompting
B. A separate Project per company, each with its own scoped Memory
C. Turn Memory off entirely for both
D. A different model tier per company
**Answer: B** — Separate Projects + scoped Memory is the only setup that fully isolates.

**Q3.** A user expects a mail connector to send emails, but it only searches and reads. Most accurate understanding?
A. The connector is broken; report it as a bug
B. Each connector has a defined capability boundary; sending is outside this one's scope
C. A more capable model would enable sending
D. The connector needs to be re-added through the public directory
**Answer: B** — Capability boundary, not a defect.

**Q4.** A Project produces meeting-summary notes. Which standing instruction is most likely to actually change the output?
A. "Capture the meeting clearly and thoroughly."
B. "Write up the notes nicely."
C. "List each decision as its own bullet; record every action item as owner plus due date; flag any unassigned action as 'owner TBD'."
D. "Summarize each meeting as best you can."
**Answer: C** — Only this is precise and testable.

**Q5.** A recurring monthly-report Project produces subtly outdated figures, no error message. Setup: standing instruction still says "Q2 FY25 template, FY25 targets"; knowledge base holds FY26 files; Memory says "Reporting period is FY25." Current period is FY26. What's driving the drift, and the fix?
A. The knowledge base — remove the unrelated brand guide
B. The standing instruction and the Memory entry still pin to FY25 while the knowledge base already holds FY26 — update both to FY26
C. Delete the FY26 template so Claude stops mixing versions
D. Nothing in the setup — the model tier is too low
**Answer: B** — Diagnose which specific piece is stale, even when other pieces are already correct.

---

## Module 6 — Governance, Risk & Responsible Use

**Q1.** A team proposes using Claude to produce final, unreviewed determinations on benefits eligibility. How should this be classified?
A. Fully appropriate, since it saves time
B. Appropriate with light human review
C. Inappropriate: irreversible consequence and non-transferable accountability require a human to own the determination
D. Appropriate if a more capable model is used
**Answer: C**

**Q2.** A colleague shares a Skill found in a public forum that converts meeting notes into a summary. Skills don't request permissions; once enabled, a Skill runs with whatever access the session already has, and nothing limits it to meeting notes. Right action?
A. Enable it — a colleague vouched for it
B. Evaluate the source and think through what it could reach in your session; publisher is unknown and it inherits full session access, so do not enable without organizational review
C. Enable it — a Skill can only use what its task actually needs
D. Enable it and watch what it does for the first week
**Answer: B**

**Q3.** You need to analyze a confidential document and nothing about the session should persist. Which control fits?
A. Standard Chat with Memory on
B. Incognito mode, after confirming the entry point is approved for this data
C. A more capable model
D. Upload it to a shared Project so the team can reuse it
**Answer: B** — Incognito keeps it out of Memory/history but doesn't override retention policy; approval comes first.

**Q4.** A quarterly review finds several team members routinely paste draft client deliverables into a personal Claude account because the approved workspace feels slower to log into. What does this represent?
A. An acceptable workaround
B. A Diligence gap between policy and practice — the friction in the approved path drives people to the unapproved one; fix the friction
C. A reason to ban the team from using Claude altogether
D. A problem only the individuals are responsible for
**Answer: B**

**Q5.** A hiring coordinator uses Claude to screen résumés and produce a shortlist, forwarding it as "the candidates who qualified." The manager never sees excluded candidates. Which ethical concern is most directly raised?
A. Disclosure — applicants weren't told Claude was used
B. Bias — an automated screen filters people out with no human review of exclusions, so systematic disadvantage can go undetected
C. Intellectual property — résumés may contain copyrighted material
D. Accountability transfer — Claude is now responsible for the hiring decision
**Answer: B**

---

## Module 7 — Troubleshooting & Optimization

**Q1.** A brand-new chat's very first response to a vendor renewal email request is generic and ignores the two contract terms you most needed flagged. Nothing degraded over time. Most likely root cause?
A. Context overload
B. Stale configuration
C. Under-specification — the prompt never named the contract terms or context that mattered
D. Wrong feature — needed Code Execution
**Answer: C**

**Q2.** You ask for a thorough competitive analysis; responses stay shallow even after adding detail. You'd selected a fast, lightweight model tier. Diagnosis and fix?
A. Under-specification — keep adding context
B. Wrong model tier — switch to a more capable model built for deep analysis
C. Context overload — restart from a summary
D. Stale configuration — a knowledge source has drifted
**Answer: B**

**Q3.** An output disappoints. What should you do before concluding Claude can't do the task?
A. Immediately switch to the most capable model
B. Run the diagnostic sequence: specification → context length → feature/model → configuration
C. Rewrite the prompt from scratch repeatedly
D. Abandon the task and do it manually
**Answer: B**

**Q4.** A recurring report needs the same manual correction every week. Most durable fix?
A. Keep making the correction by hand
B. Capture the fix as a standing instruction or Skill in the Project so it persists
C. Switch models each week
D. Start a fresh conversation each time and re-explain
**Answer: B**

**Q5.** A monthly close report takes ~6 hours with reliable numbers, but three analysts format their sections differently, costing a reviewer ~90 minutes reconciling styles. Which optimization delivers the biggest gain against that specific metric?
A. Upgrade the model tier so sections draft faster
B. Create one shared Skill that formats every section to a single template
C. Ask analysts to start earlier in the month
D. Add a second reviewer to split the reconciliation work
**Answer: B** — Targets the measured bottleneck (formatting inconsistency) at its source.

---

# PART B — 50 Additional Practice Questions

*Weighted roughly to match real domain percentages. Answer key at the very end — try to answer before checking.*

## Output Evaluation & Validation (11 questions)

**B1.** Claude drafts a client-facing summary of a technical incident. On review, every sentence is factually correct, but the summary omits the one clause in the SLA that determines whether a penalty applies. What's the correct verdict?
A. Ready to use — nothing false
B. Needs revision — completeness failure, not an accuracy failure
C. Needs human override — automatically, because it's client-facing
D. Ready to use, with a disclaimer added

**B2.** A generated market brief states: "Adoption reached 47.3% in Q2, up from 31.8% in Q1" with no source cited anywhere in the document. What should you do?
A. Trust it — the precision suggests it came from real data
B. Treat it as a fabricated specific until traced to an actual source
C. Round the numbers to make them look less precise
D. Ask Claude to rephrase it more cautiously

**B3.** You're reviewing a 40-page report Claude generated from multiple source documents. Page 6 states company revenue was "$18M," page 34 states it was "$21M." What review technique catches this kind of error?
A. A single careful read-through
B. A dedicated consistency pass checking figures across the full document
C. Asking Claude if the document is internally consistent
D. Spot-checking only the executive summary

**B4.** Claude tells you "I've sent the follow-up email to the client." Claude has no email-sending tool enabled in this session. What should you conclude?
A. Claude must have used a background tool you're unaware of
B. This is a capability hallucination — treat the claimed action as unverified until you confirm it yourself
C. It's a phrasing quirk with no practical implication
D. Ask Claude a second time; if it repeats the claim, trust it

**B5.** A prompt asks Claude to answer only from an uploaded compliance manual. The response includes a claim not found anywhere in the manual. What prompt-design failure most likely caused this?
A. The model tier was too low
B. The prompt didn't restrict Claude to the source and permit "I don't know"
C. The manual was too long
D. Code Execution wasn't enabled

**B6.** You ask Claude to summarize customer complaints and it returns a tidy five-category breakdown. You have no way to see which raw complaints fed which category. What's missing?
A. Nothing — the categorization is the deliverable
B. Traceability — a well-formed summary that can't be traced back to source data can still misrepresent it
C. A higher model tier
D. A shorter summary

**B7.** Two different runs of the same prompt against the same data produce noticeably different conclusions. What does this signal, and what's the appropriate response?
A. A bug — report it
B. Divergence across runs — flag the topic for human review rather than picking whichever answer you saw first
C. Nothing — this is expected and can be ignored
D. Switch to a faster model to get consistent output

**B8.** A recommendation memo reads as extremely confident and polished. Which of the following is the most reliable signal that it's actually trustworthy?
A. Its confident, fluent tone
B. Its length and formatting
C. Traceable citations you've independently checked against source material
D. That it agrees with your own initial hunch

**B9.** An analyst is preparing a document for public release. She personally finds it "basically fine" after a quick skim. What does the module's stakes-calibration principle say about this?
A. A quick skim is proportional for any output
B. Review depth should scale with stakes; public/external release warrants deeper verification than a quick skim
C. Only factual claims need checking, not framing
D. External review only matters for legal documents

**B10.** Claude produces a comparison table of five vendors, each cell computed from a spreadsheet. Which output path guarantees the underlying arithmetic is traceable and re-runnable, even if it doesn't guarantee the code itself is bug-free?
A. Prose narrative summarizing the comparison
B. A nicely formatted markdown table generated directly
C. Code Execution, where Claude runs code over the actual data
D. Asking Claude to double check its own math in the same response

**B11.** A batch of 12 supplier contracts is reviewed for red-flag clauses. Claude flags issues thoroughly in 11 of them but is silent on the 12th, which happens to be the most unusual contract in the batch. What failure pattern is this?
A. Fabrication
B. A completeness gap concentrated on the hardest item — the one requiring the most attention got the least
C. Model-tier mismatch
D. Context overload

---

## Workflow Integration & Solution Design (8 questions)

**B12.** A support team wants Claude to triage incoming tickets by urgency and route them. Which step in this workflow is most clearly AI-appropriate on its own?
A. Notifying the customer their issue is resolved
B. Classifying ticket urgency from the ticket text against defined criteria
C. Issuing a refund over $500
D. Deciding to escalate a legal threat in a ticket

**B13.** A team's requirement, as written, says: "The reporting tool should be fast." Why is this a weak requirement?
A. It's too short
B. "Fast" is unquantified — different engineers would build to different targets
C. It doesn't mention a technology stack
D. It should be written by Claude instead of the team

**B14.** A Claude-assisted onboarding-document generator has just been connected to the HR system's live employee database by another team, without your review. What's the correct response?
A. Nothing — more data access is always an improvement
B. Treat this as an escalation trigger: verify the access is proportional and appropriately owned before it goes further
C. Assume HR already vetted it since they connected it
D. Switch the underlying model to a more capable tier

**B15.** In a workflow redesign, a step is deemed "collaborative" (AI drafts, human reviews). Six months later, an audit finds the human review step is rarely actually performed before output ships. What has happened?
A. Nothing concerning — the AI has proven reliable
B. Collaborative has quietly collapsed into automated — the review gate exists on paper but isn't staffed
C. This means the step should be reclassified as fully AI-appropriate
D. The model should be downgraded to force more caution

**B16.** A team describes their new Claude-assisted workflow to a compliance reviewer as: "The AI makes the final call on flagged transactions." What's the issue with this framing, independent of how the workflow actually works?
A. None — as long as it's fast
B. It overstates AI accountability — even if a human quietly reviews everything, this phrasing conceals that gate and misrepresents where accountability sits
C. It's fine because "the AI" is a shorthand everyone understands
D. Compliance reviewers don't need this level of detail

**B17.** A step in a workflow is low-stakes and fully reversible, but requires empathy and relationship judgment (e.g., delivering difficult performance feedback in person). Which Delegation criterion is load-bearing here?
A. Reversibility
B. Consequence of error
C. Need for human creativity/empathy
D. Accountability

**B18.** A capacity-planning artifact you built for one team is now being copied and reused, unmodified, by four other teams with different data patterns. What should you check first?
A. Nothing — reuse is success
B. Whether the assumptions and calculations still hold for each new team's context, since it's now being relied on beyond its original scope
C. Whether to rename the artifact
D. Whether the artifact is aesthetically pleasing enough for wider use

**B19.** Which of the following is the most load-bearing reason a step like "final sign-off on a legally binding external communication" stays human-retained, regardless of how good the AI draft is?
A. AI drafts are usually lower quality than human drafts
B. Accountability for the communication cannot transfer to a tool
C. It takes too long for AI to draft legal communications
D. Legal communications require a specific model tier

---

## Governance, Risk & Responsible Use (9 questions)

**B20.** A manager wants to use Claude to draft layoff notification letters that will be sent without any further review, since "the template is always the same." How should this be classified?
A. Fully appropriate — it's just a template
B. Appropriate with human review — a defined gate is still needed given consequence and the human element
C. Inappropriate — regardless of any gate, this should never involve AI
D. Appropriate only if a more capable model is used
*(Note: reasonable people could debate B vs. C; the module's framework asks you to name the load-bearing criterion and specify a gate — an unreviewed send is the actual problem here.)*

**B21.** Your organization has an approved, vetted Skill catalog. A colleague on another team offers you a Skill they built themselves for "faster invoice processing." What's the correct first move?
A. Enable it immediately since a colleague built it
B. Treat it like unvetted software — confirm with the publisher what it accesses and whether its permissions still match current policy before enabling it on your own data
C. Decline automatically since it's not in the official catalog
D. Enable it only in Incognito mode
*(Enabling in Incognito does not address the underlying trust/permissions question.)*

**B22.** You've been asked to analyze customer churn using a dataset that includes full names, home addresses, and account numbers, but your analysis only needs churn patterns by region and tenure. Best practice?
A. Upload the full dataset — more data is always better for analysis
B. Redact or replace identifying fields (names, addresses, account numbers) with generic labels before uploading, since the analysis doesn't need them
C. Use Incognito mode instead of redacting
D. Ask Claude to ignore the sensitive fields itself
*(Incognito controls persistence, not whether upload was appropriate in the first place; redaction addresses the actual risk.)*

**B23.** A dataset contains protected health information. Your organization has not confirmed whether any current entry point is approved for PHI. What should you do?
A. Use Incognito mode and proceed — it's the safest available control
B. Stop and escalate to your admin to confirm an approved, compliant path before uploading anything
C. Proceed since PHI is a common data type
D. Redact only the patient names and proceed
*(For regulated data, "is this allowed here" is settled before "how do I handle it here" — Incognito doesn't resolve that first question.)*

**B24.** A monthly self-audit finds that a team has been uploading unreleased product roadmaps to a Claude entry point not approved for that sensitivity tier, consistently, for three months. What does this represent, and what's the durable fix?
A. A minor issue not worth addressing since nothing bad has happened yet
B. A Diligence gap — the routine, low-visibility use has drifted from policy; the fix is closing the specific gap (redirect to the approved entry point, reinforce the classification habit)
C. Grounds to ban all uploads across the org
D. A reason to disable Memory for the whole organization

**B25.** A Skill built by a sister team inside your own company requests broad file-system access "for convenience." Should "it's internal" settle the trust question?
A. Yes — internal tools are inherently vetted
B. No — internal doesn't mean vetted; confirm what it accesses and whether that access still matches current policy before use
C. Yes, as long as it was built more than six months ago
D. No — internal Skills should never be used
*(The module explicitly makes internal-but-unvetted the hardest case, not an automatic pass or ban.)*

**B26.** An HR tool auto-generates candidate rejection emails after an AI screen, with no human reviewing which candidates were excluded or why. Months later, a pattern emerges where one demographic group is disproportionately screened out. What was the primary governance failure?
A. The rejection emails were too impersonal
B. No human reviewed the exclusions the automated screen produced, so systemic bias went undetected
C. The AI model used was outdated
D. Candidates weren't told a template was used
**B27.** A practitioner is asked to evaluate an ambiguous ethical situation with no clear policy precedent, involving a large number of affected employees. What's the appropriate move?
A. Make the call individually and move on — waiting for guidance wastes time
B. Reason through it structurally (who's affected, what could go wrong, what's fair, what disclosure is needed), document that reasoning, and escalate given the scale of potential harm
C. Default to whatever is fastest to implement
D. Avoid documenting the reasoning to keep the record simple
**B28.** Which of these best reflects the "least privilege" principle from the Skills/feature-risk material?
A. Enable every available feature so nothing is missed
B. Grant the narrowest access that lets the job get done, and revisit that access when the job changes
C. Grant broad access up front and restrict later if problems occur
D. Access levels are fixed by the vendor and not something practitioners manage

---

## Prompting & Task Execution (7 questions)

**B29.** A prompt says: "Analyze this data and tell me what's important." The response is vague and doesn't match what the requester actually needed. Which missing component most directly explains this?
A. Role
B. Context — no criteria for "important" were given
C. Output format
D. Model choice
**B30.** You need Claude to draft a client apology for a service outage. Which combination of components matters most here?
A. Task and output format only
B. Role, context (what happened, who the audience is), constraints (tone — accountable, not defensive), output format
C. Just the task, stated clearly
D. A longer prompt is always better regardless of which components it includes
**B31.** A four-stage content workflow (research → outline → draft → edit) is being run in Claude. At what point does it make sense to split into a new conversation rather than continue the same one?
A. Never — always keep everything in one conversation
B. When a stage doesn't depend on the prior stages' specific content, or when the current conversation is showing signs of context degradation
C. After every single stage, regardless of dependency
D. Only if the model tier changes
**B32.** After three rounds of revision, the fourth round produces output nearly identical to the third. What does this indicate?
A. Keep iterating — round five will likely be the breakthrough
B. Diminishing returns — a manual edit now likely beats another prompting round
C. Switch models immediately
D. The task is impossible for Claude
**B33.** A prompt for a research task says: "Find out about our competitor's pricing." Which addition would most improve reliability of the output?
A. Nothing — it's already clear
B. A defined scope (which competitors, what pricing tiers) and a request for citations so claims are checkable
C. A request for a longer answer
D. A request for a more creative answer
**B34.** Comparing "Summarize this" vs. "Summarize this for a VP audience in three bullets focused on budget impact" — what's the core difference in prompting discipline being demonstrated?
A. The second is just longer
B. The second specifies context, constraints, and format the first left to guesswork
C. The second uses more technical vocabulary
D. There is no meaningful difference; Claude infers audience either way
**B35.** A task requires Claude to draft a document AND perform an exact cost calculation feeding into it. What's the correct approach to a single combined prompt?
A. One prompt asking for both the draft and the calculation in prose
B. Have Claude perform the calculation via Code Execution first (or as a verified step), then draft the document using the verified figures
C. Skip the calculation and let the reader compute it
D. Ask for the draft first, backfill numbers later without verification

---

## Product & Model Selection (6 questions)

**B36.** A support team needs to classify thousands of incoming tickets per day into 5 fixed categories using a stable, unambiguous rubric. Which model tier fits best, and why?
A. Opus — always choose the most capable model for production use
B. Haiku — high-volume, unambiguous, structured classification is exactly its use case
C. Sonnet — it's the "safe default" for everything
D. Whichever model is cheapest that week
**B37.** A one-off, exploratory question with no reuse planned is best handled in which entry point?
A. A Project
B. Chat
C. An Artifact
D. Research
**B38.** A team needs Claude to synthesize considerations across 15+ sources for a nuanced market-entry recommendation with real ambiguity in the trade-offs. Which model tier is most appropriate?
A. Haiku, for speed
B. Sonnet, as a default with no further thought needed
C. Opus, given the complexity, ambiguity, and stakes involved
D. Model choice doesn't matter for synthesis tasks
**B39.** A recurring monthly workflow has stable background context, produces a consistent output format, and happens every month without fail. Per the "2 of 3 questions" framework, should this become a Project?
A. No — Projects are only for teams, not individuals
B. Yes — it clears at least 2 of the 3 criteria (recurs, stable context, consistent format)
C. No — only tasks involving calculations need Projects
D. Only if the task also needs Opus
**B40.** A deliverable will be a downloadable, formatted Excel file with several tabs and formulas. Beyond model choice, what else is essential to get a reliable result?
A. Nothing beyond a good prompt
B. Code Execution (to produce and verify the actual file), likely paired with the relevant Skill
C. Just a higher model tier
D. Running the same prompt multiple times and picking the best file
**B41.** A user says: "I need this done as fast as possible and I don't mind if it's occasionally imperfect since I'll skim it anyway." What does this signal about model tier choice?
A. Always use Opus regardless of stated priorities
B. This favors a faster, lighter tier (e.g., Haiku) since speed matters more than maximal accuracy here
C. Use Research instead of a model choice
D. This has no bearing on model selection

---

## Configuration & Knowledge Management (6 questions)

**B42.** A Project's standing instructions currently include: "Follow the standard client-report format: exec summary, methodology, findings, then a page of appendix tables. Findings must be code-executed, not estimated." Where should the actual template file with sample tables live?
A. Nowhere — the instruction text is sufficient on its own
B. The knowledge base, alongside the instruction (the instruction is the rule; the template is the reference material it points to)
C. A Skill only, with no instruction needed
D. Memory, since it's used often
**B43.** A team keeps three versions of the same product spec in a Project's knowledge base — v1, v2 (current), and a draft v3. Claude occasionally cites v1 by mistake. What's the fix?
A. Add an instruction telling Claude to "always use the right version"
B. Remove the superseded/draft versions so only the current spec remains — curate the knowledge base like a shared drive
C. Switch to a more capable model
D. Nothing — this is expected behavior
**B44.** Which of the following instructions would most reliably change Claude's actual output, versus reading as an aspiration?
A. "Be thorough and accurate."
B. "For every number reported, include its source document and page number; if a figure isn't in the provided data, label it 'unverified.'"
C. "Try to get this right."
D. "Do a good job on this."
**B45.** A Project's Memory contains a note referencing a stakeholder who left the company eight months ago, and this keeps surfacing in drafted emails. What's the correct maintenance action?
A. Leave it — Memory is meant to be comprehensive
B. Review and delete the stale entry as part of routine Memory curation
C. Turn off Memory for the whole Project permanently
D. Switch to Incognito mode going forward
**B46.** A connector that's supposed to read calendar events is instead being used to try to create new events, and it silently fails to do anything useful. What's the most likely explanation and correct response?
A. The connector is broken; escalate as a bug immediately
B. This is likely a capability boundary (read-only) — confirm what the connector actually supports before treating it as a defect
C. Switch to a different, unrelated connector
D. Restart the whole Project

---

## Troubleshooting & Optimization (5 questions)

**B47.** A weekly summary task worked perfectly for two months. This week, output quality dropped noticeably with no error shown. What should you check first, per the diagnostic sequence's cost-ordering?
A. Immediately assume the task is no longer a fit for Claude
B. Re-check the prompt/specification, then context length, then feature/model choice, then configuration — cheapest checks first
C. Switch to the most capable model right away
D. Abandon the workflow and do it manually going forward
**B48.** In a fresh, short conversation, Claude gives a subtly wrong dollar figure that it computed by describing the arithmetic in prose rather than running it. What's the most targeted fix?
A. Restart the conversation
B. Switch to a different model tier
C. Ask Claude to use Code Execution for the calculation instead of prose arithmetic
D. Add more context about the business
**B49.** A recurring workflow shows three signs: the same background is pasted every session, the same correction is made every round, and different team members get different-quality results. Which combination of fixes addresses all three signals?
A. A faster model for everyone
B. Move background into the knowledge base/standing instructions, capture the correction as a standing instruction, and create a shared Skill so everyone runs the same setup
C. Tell each team member to try harder
D. Increase the number of revision rounds allowed
**B50.** You ask Claude to predict next month's exact revenue to the dollar, and after several prompt rewrites, the number is still clearly a guess dressed up as precision. What's the correct diagnosis?
A. Under-specification — keep refining the prompt
B. An expectation mismatch — reshape the task into a defensible range with stated assumptions, since exact future prediction isn't a fixable prompting problem
C. Context overload — restart the session
D. Wrong model — try a more capable tier

---

# ANSWER KEY — Part B

| # | Ans | # | Ans | # | Ans | # | Ans | # | Ans |
|---|---|---|---|---|---|---|---|---|---|
| B1 | B | B11 | B | B21 | B | B31 | B | B41 | B |
| B2 | B | B12 | B | B22 | B | B32 | B | B42 | B |
| B3 | B | B13 | B | B23 | B | B33 | B | B43 | B |
| B4 | B | B14 | B | B24 | B | B34 | B | B44 | B |
| B5 | B | B15 | B | B25 | B | B35 | B | B45 | B |
| B6 | B | B16 | B | B26 | B | B36 | B | B46 | B |
| B7 | B | B17 | C | B27 | B | B37 | B | B47 | B |
| B8 | C | B18 | B | B28 | B | B38 | C | B48 | C |
| B9 | B | B19 | B | — | — | B39 | B | B49 | B |
| B10 | C | — | — | — | — | B40 | B | B50 | B |
| — | — | — | — | — | — | — | — | — | — |
| B20 | B* | | | | | | | | |

*B20 is the one genuinely debatable question in this set — flagged in its own explanation above. The exam favors "name the load-bearing criterion and the gate" reasoning over a flat yes/no, so understand *why*, not just the letter.

---

# A note on third-party question dumps you asked about

I searched, and there are several paid/free "dump" sites circulating for CCAO-F (PassQuestion, Dumpsbase, and similar brain-dump vendors). A few honest caveats before you use any of them:

- **Provenance is unverified.** PassQuestion's own site states its content is "sourced from the Internet," not from Anthropic or verified test-takers — same pattern across most of these vendors. Treat any specific question/answer from them as unconfirmed until you reason through it yourself.
- **Some list an exam code mismatch** (CCAR-F vs. CCAO-F vs. CCA-F) — these are different Anthropic certifications (Architect vs. Associate), and some vendors conflate them. Double-check the code matches "Claude Certified Associate – Foundations" specifically before relying on a set.
- **If your exam has any integrity policy** (most professional certs do) about not using leaked/verbatim question sets, paid "dumps" can put you on the wrong side of that policy even if the vendor claims legitimacy.

If you still want them for extra exposure to the *format*, here's what's out there:
- Udemy — "Claude Certified Associate Foundations: 6 Practice Exams" (360 scenario questions, blueprint-weighted) — `udemy.com/course/claude-associate-foundations-practice-exams`
- Udemy — similarly named alternate listing — `udemy.com/course/claude-associate`
- PassQuestion — `passquestion.com/ccao-f.html` (paid, 125 Q&A)
- Dumpsbase — `dumpsbase.com/ccao-f.html` (paid, 52 Q&A)

My honest recommendation: the Udemy option is the more credible of these since it's explicitly built against "the official July 2026 exam blueprint" with per-domain weighting and full rationale for both correct and incorrect options — closer in spirit to how your actual course quizzes are written than a flat brain-dump. But everything in **Part A and Part B above**, plus your 8 modules, should already cover you comprehensively without needing to buy anything.
