# Claude Certified Developer (CCDV-F) — Full Question Dump
*Compiled from Modules 1–5 plus additional original practice questions. All questions are original write-ups testing the concepts from your course material — not verbatim reproductions of the course's own checkpoint text.*

**How to use this:** Answer each question yourself first, then check the answer key. Questions are tagged by module and by concept so you can drill weak areas. Scenario questions mirror the "diagnose → identify mechanism → predict/fix" pattern the actual course explicitly said would repeat across every module.

---

## MODULE 1 — MSO Foundations

**Q1.1** A request's input tokens + conversation history + tool definitions already exceed the context window before generation starts. What happens?
A) The response is silently truncated
B) The request is rejected with a validation error before generation begins
C) The oldest messages are automatically dropped
D) The model summarizes automatically

**Q1.2** A request fits within the context window, but generation hits the ceiling mid-response. What stop_reason do you see?
A) `end_turn`
B) `max_tokens`
C) `model_context_window_exceeded`
D) `refusal`

**Q1.3** True or False: At temperature 0, two identical requests are guaranteed to return identical output on every Claude model generation.

**Q1.4** On the newest Claude models, what happens if you set a non-default temperature/top_p/top_k?
A) It's silently ignored
B) It returns a 400 error — non-default sampling parameters aren't accepted
C) It works exactly as before
D) It only works with extended thinking off

**Q1.5** You need repeatable behavior on the newest models but can't set temperature. What's the correct lever instead?
A) Lower max_tokens
B) Manage repeatability through prompting
C) Switch to a smaller model
D) Use structured outputs only

**Q1.6** What's the difference between model tier selection and reasoning mode (effort)?
A) They're the same setting
B) Model tier picks which model runs; reasoning mode is a separate per-request setting for how much a model thinks
C) Reasoning mode only exists on Haiku
D) Model tier controls thinking, reasoning mode controls output length

**Q1.7** The `budget_tokens` parameter for extended thinking is:
A) Still the primary way to control thinking depth
B) Deprecated — returns a 400 error on newest model generations; effort setting is used instead
C) Required for all thinking-enabled requests
D) Only used with Haiku

**Q1.8** Why shouldn't you test LLM output correctness by checking for an exact string match?
A) String matching is too fast
B) Output is non-deterministic, so test on properties/structure or use a model-graded eval instead
C) String matches always fail on JSON
D) It's not allowed by the API

**Q1.9** When should you reach for multi-shot (few-shot) prompting instead of writing more instructions?
A) When the model needs to be told to be more polite
B) When the problem is about output *structure* — wrong format, wrong casing, a missed edge case — not more description
C) Never — zero-shot is always better
D) Only for classification tasks

**Q1.10** What is the key difference between the Message Batches API and calling `AsyncAnthropic`/an async client in a loop?
A) They're functionally identical
B) Async client calls still return in real time; Batches API is a bulk offline submission with up to 24h turnaround at lower per-token cost
C) Batches API is faster
D) Async is only for streaming

**Q1.11 (Scenario)** Your team builds a pipeline that classifies 50,000 support tickets overnight, with no one waiting on the result. Which mechanism is correct?
A) Synchronous calls in a tight loop
B) AsyncAnthropic with high concurrency
C) The Message Batches API
D) Streaming responses

**Q1.12** SDK vs. raw REST calls to the Claude API — what's the actual functional difference?
A) SDKs can do things REST can't
B) None functionally — the SDK is a convenience layer (auth, retries, parsing) over the same underlying API
C) REST is faster
D) SDKs don't support tool use

---

## MODULE 2 — Production-Grade Prompting, Agents & Tool-Use

**Q2.1** A classification prompt returns "Billing" sometimes, "billing" other times, and full sentences occasionally. What's missing?
A) A system prompt
B) An output constraint
C) Extended thinking
D) A larger model

**Q2.2** Content in a prompt keeps drifting off-topic and getting worse across turns. What's the fix?
A) A more specific/sharper system prompt
B) Few-shot examples
C) XML tags
D) A larger max_tokens

**Q2.3** The task is understood correctly but Claude invents a structure you never specified. What's missing?
A) Output constraint
B) System prompt
C) Few-shot examples
D) Extended thinking

**Q2.4** You've reworded the same prompt five times and the output is still wrong. What should you do?
A) Reword it a sixth time with more detail
B) Stop and diagnose which specific technique (constraint, system prompt, examples) is actually missing
C) Switch to a bigger model automatically
D) Enable extended thinking

**Q2.5** What's the difference between prompt-level "return only JSON" instructions and the API's structured outputs (`output_config.format`, `json_schema`)?
A) No difference
B) Structured outputs use constrained decoding — invalid tokens can't be generated at all — vs. a prompt instruction the model can still slip on for untested inputs
C) Structured outputs are always faster
D) Structured outputs replace the need for a system prompt

**Q2.6** Which of these does a schema-guaranteed JSON response NOT protect against?
A) Wrong field names
B) A refusal (stop_reason: refusal) or truncation (stop_reason: max_tokens) that still doesn't parse
C) Malformed JSON syntax
D) Inconsistent casing

**Q2.7** Structured outputs (JSON schema) and message prefilling —
A) Combine seamlessly
B) Are incompatible on the same request — pick one
C) Both require extended thinking
D) Only work with Opus

**Q2.8** When should extended thinking be left OFF?
A) Multi-step dependent planning
B) Mechanical/lookup tasks like classification or field extraction
C) Agentic loops with several tool calls
D) Complex math derivations

**Q2.9** What happens if you strip the thinking block out of history before the next tool-use turn to save context?
A) Nothing — it's optional
B) The signature no longer matches and the API rejects the next request
C) It saves money with no downside
D) It only affects Opus

**Q2.10** In a tool-use loop, who actually executes the tool?
A) Claude executes it directly
B) Your application code executes it after Claude issues a tool_use block
C) The Anthropic API executes it server-side automatically
D) The MCP server always executes it

**Q2.11** Every `tool_use` block must be answered by a `tool_result` block:
A) Anywhere later in the conversation
B) In the immediately following user turn, with a matching ID
C) Only if `is_error` is false
D) Only when extended thinking is off

**Q2.12** Two tools both say "use this to find information" in their descriptions. What's the most likely production symptom?
A) Faster responses
B) Wrong-tool selection, since Claude routes primarily on name + description
C) A validation error
D) Automatic tool merging

**Q2.13** What's the fix for two tools with overlapping descriptions?
A) Rename both tools
B) Add an exclusion condition to each description naming when NOT to use it
C) Delete one of the tools always
D) Increase max_tokens

**Q2.14** When should you reach for an MCP server instead of writing a tool schema by hand?
A) Always — MCP is strictly superior
B) When a well-maintained MCP server already exists and covers your exact needed operations
C) Only for read-only tools
D) Never — manual schemas are always better

**Q2.15** What's a cost implication of connecting multiple MCP servers?
A) None — it's free until a tool is called
B) Each server's tool definitions add to the context window even when unused this turn
C) Only the first server counts against context
D) MCP servers reduce token cost automatically

**Q2.16** In a streamed response, when is it safe to parse a `tool_use` block's JSON input?
A) As soon as the first delta arrives
B) Only after `content_block_stop` for that block
C) After `message_start`
D) Anytime, since JSON.parse handles partial strings

**Q2.17** A stream is interrupted mid-response before `message_stop`. What should your handler do?
A) Save whatever was collected so far to history
B) Discard the partial turn and retry the request
C) Continue building on the partial tool_use block
D) Immediately switch models

**Q2.18** What's the correct interpretation of "a stream ending is not the same as a message completing"?
A) They're always the same
B) A read loop can end without `message_stop` ever arriving — only `message_stop` means the message is whole
C) It refers only to network errors
D) It's about batch processing, not streaming

**Q2.19** Development test fixtures show a session completing cleanly in 20 turns. In production it fails at turn 8. What's the most likely cause?
A) A schema description problem
B) Tool outputs are 3-5x longer in production, filling the context window faster than development fixtures suggested
C) The model got worse
D) A network issue

**Q2.20** Which context management strategy removes visibility into HOW a subtask's answer was reached, in exchange for keeping the main context clean?
A) Pruning
B) Compaction
C) Subagent handoff
D) Clearing

**Q2.21** What's the risk of an under-specified summarizer prompt during compaction (e.g., "summarize the conversation so far")?
A) It costs more tokens
B) Task-critical state (file paths, decisions, errors+resolutions) can be silently dropped — one of the most common causes of multi-session agent failures
C) It always fails outright
D) It disables tool use

**Q2.22** Choose a workflow over an agent when:
A) The path through the task can't be enumerated in advance
B) You can write the exact steps in code and inputs are well-constrained
C) User inputs vary unpredictably
D) The task requires creative sequencing of tools

**Q2.23** What's the defining constraint that rules out Claude Managed Agents for PHI/ZDR workloads?
A) They're too slow
B) Managed Agent sessions are stateful and stored server-side — not currently eligible for ZDR or a HIPAA BAA
C) They don't support tool use
D) They require Opus specifically

**Q2.24** The single most important question for placing a human-in-the-loop (HITL) checkpoint is:
A) How long will the task take?
B) What is the worst possible outcome if this step runs without a human check?
C) Is the user watching?
D) Does the tool return JSON?

**Q2.25** An agent's tool validated a config change as "in range" and committed it — but the change broke a downstream system that depended on the old value. What was the actual failure?
A) The validation logic was buggy
B) There was no checkpoint between "validation passed" and "write committed" — the exit condition didn't account for downstream blast radius
C) The model hallucinated
D) The tool schema was too vague

**Q2.26** Over-tooling in agent design typically causes:
A) Faster responses
B) Erratic/degraded tool selection as the tool surface grows
C) Lower token costs
D) Better routing

**Q2.27** Match the memory scope to the use case: a document formatter that receives a file, transforms it, and terminates, with no continuity between jobs.
A) In-context memory
B) External storage
C) Stateless (no persistent memory)
D) Summarized memory

**Q2.28** Match the memory scope: a customer support agent that continues the same conversation thread with a user across two weeks of daily check-ins.
A) In-context memory
B) External storage
C) Stateless
D) Summarized memory only, no storage

**Q2.29** Do subagents automatically inherit Skills from a parent session?
A) Yes, always
B) No — a subagent starts clean; needed Skills must be explicitly listed in its configuration
C) Only built-in subagents do
D) Only if CLAUDE.md says so

**Q2.30** What's the formula for image token cost?
A) file size in KB × 10
B) ⌈width/28⌉ × ⌈height/28⌉ visual tokens
C) A fixed 1,000 tokens per image regardless of size
D) width × height ÷ 100

**Q2.31** A pipeline reuses the same reference product diagram in every request. What's the correct encoding method?
A) Inline base64 every time
B) Files API — upload once, reference file_id
C) Message Batches API
D) URL reference only

**Q2.32** "I chunked my list into smaller groups and looped calling the synchronous API for each chunk" — is this batching?
A) Yes, this is exactly what batching means
B) No — it's still one synchronous request per item and hits the same rate limits; true batching is a different submission model via the Batches API
C) Yes, as long as chunks are under 100
D) Only if run overnight

---

## MODULE 3 — Claude Code, MCP & Integration

**Q3.1** What does plan mode do in the explore/plan/code loop?
A) Auto-approves all edits
B) Holds Claude Code in the read-only explore phase, blocking edits/commands until you release it
C) Skips the explore phase entirely
D) Only works with MCP servers

**Q3.2** Which permission mode auto-approves reads, file edits, and common filesystem commands (mkdir, rm, mv, etc.) but ONLY inside the working directory?
A) default
B) acceptEdits
C) bypassPermissions
D) dontAsk

**Q3.3** In `bypassPermissions` mode, which of the following is true?
A) It still prompts before destructive shell commands
B) It removes all prompts including the protected-path guard the other modes keep — only catastrophic commands like `rm -rf /` trigger a last-resort prompt
C) It's safe on any developer workstation
D) It's the recommended default for new projects

**Q3.4** A deny rule and an allow rule both apply to the same action. What wins?
A) Allow always wins
B) Deny always wins, regardless of mode
C) Whichever was set most recently
D) The narrower rule wins

**Q3.5** Where should an org-wide deny rule live so no individual developer can override it?
A) `.claude/settings.local.json`
B) `~/.claude/settings.json`
C) Enterprise-level `managed-settings.json`
D) `.claude/settings.json` in the repo

**Q3.6** The single governing question for where to place a human review gate is:
A) How long did the task take?
B) What is the worst outcome if this action runs without a person checking it?
C) Does the user trust the agent?
D) Is the file under version control?

**Q3.7** What does a CLAUDE.md file do?
A) Loads only when explicitly invoked by name
B) Is prepended to context at the start of every session, unconditionally
C) Only applies to subagents
D) Replaces the need for a system prompt

**Q3.8** What's the main failure mode of a CLAUDE.md file?
A) It can't hold code examples
B) Size — every added line dilutes the weight of every other line, including the one rule that matters
C) It only works with Opus
D) It can't reference file paths

**Q3.9** A rules file in `.claude/rules/` with no `paths` field in its frontmatter:
A) Never loads
B) Loads unconditionally at launch, same priority as CLAUDE.md, regardless of subdirectory placement
C) Only loads for subagents
D) Requires a hook to trigger it

**Q3.10** Which hook event can actually BLOCK a tool call before it executes?
A) PostToolUse
B) PreToolUse (exit code 2 blocks it)
C) SessionEnd
D) Notification

**Q3.11** Why can't PostToolUse block an action?
A) It's disabled by default
B) It fires after the tool call has already completed
C) It only applies to reads
D) It requires a different config file

**Q3.12** Do the built-in Explore and Plan subagents load CLAUDE.md and git status?
A) Yes, always
B) No — they skip both to stay fast/cheap; use general-purpose or a custom subagent if project rules must apply
C) Only Explore does
D) Only if a hook forces it

**Q3.13** What's the recommended, current format for both explicit and automatic workflow invocation in Claude Code?
A) The legacy `.claude/commands/` directory
B) Skills (invoked via `/skill-name` or loaded automatically on description match)
C) Only CLAUDE.md instructions
D) Environment variables

**Q3.14** How are plugin commands namespaced?
A) They're never namespaced and can collide
B) The plugin's name becomes the prefix (e.g., `/payments:run-tests`)
C) Alphabetically by install order
D) By the user's OS username

**Q3.15** A skill's SKILL.md references an absolute path like `/Users/alexmorgan/projects/deploy-utils/validate.sh`. What's the problem?
A) Nothing, as long as the author's machine still exists
B) It only resolves on the author's machine — breaks for every teammate after install
C) Absolute paths are always faster
D) It only affects Windows machines

**Q3.16** What's the correct variable to reference a script bundled inside a plugin itself (not just the project)?
A) `$HOME`
B) `${CLAUDE_PLUGIN_ROOT}`
C) `$PWD`
D) `${CLAUDE_PROJECT_DIR}` only

**Q3.17** An MCP tool permission rule is scoped using what naming pattern?
A) `tool.server.name`
B) `mcp__server__tool`
C) `server:tool`
D) `@server/tool`

**Q3.18** What transport should a locally-run, personal MCP server use?
A) HTTP
B) SSE
C) stdio
D) WebSocket

**Q3.19** A committed `.mcp.json` should NEVER contain:
A) The server URL
B) An inline API key/credential value
C) The transport type
D) The scope setting

**Q3.20** What's the two-layer defense against an agent accidentally writing a credential inline to a committed config file?
A) Just a strongly worded comment in the file
B) A CLAUDE.md convention instruction + a PreToolUse hook that blocks credential-looking patterns in writes to that file
C) Deleting the file after each session
D) Using bypassPermissions mode

**Q3.21** Why doesn't rotating a leaked API key alone fully fix the problem if the key was ever committed?
A) It does fully fix it
B) The key remains in repository history — overwriting the file in a later commit doesn't remove it from history
C) Rotation always breaks other services
D) Git doesn't support rotation

**Q3.22** OAuth redirect URIs are registered:
A) Globally, once, for all environments
B) Per host — a working staging registration does NOT cover production
C) Only for stdio servers
D) Automatically by Claude Code

**Q3.23** For regulated enterprise customers, staging and production OAuth app registrations should typically be:
A) The exact same app registration
B) Separate app registrations per environment, as many enterprise security policies require
C) Never used together
D) Shared across all customers

---

## MODULE 4 — Production Engineering, Evals & Security

**Q4.1** What are the four decisions a design document should state before production code is written?
A) Budget, timeline, team size, stakeholders
B) Success criteria, failure handling, cost/latency budget, trust boundary
C) Model choice, prompt text, tool list, deployment date
D) API version, SDK version, region, currency

**Q4.2** Which grading method is correct for a task with exactly one correct label/value?
A) LLM-as-judge
B) Exact/string match
C) Code-graded check
D) Human review only

**Q4.3** Which grading method is correct for validating that output is parseable JSON with required fields, regardless of exact content?
A) Exact/string match
B) Code-graded check
C) LLM-as-judge only
D) None — this can't be automated

**Q4.4** Why does an LLM-as-judge need to be calibrated before you trust its scores?
A) It isn't necessary — judges are accurate by default
B) Without measuring agreement against human-labeled cases, a judge can produce a confident-looking but meaningless number
C) Calibration only matters for code graders
D) It's a one-time API requirement, not an accuracy issue

**Q4.5** Why should a judge be asked for strengths/weaknesses/reasoning, not just a raw score?
A) It's required by the API schema
B) Without reasoning-first, models drift toward a safe middle score (~6) regardless of actual quality
C) It reduces token cost
D) It's only needed for code-graded checks

**Q4.6** A team ran a feature through a dozen manually-picked examples, all passed, and shipped. Two weeks later it failed on a message containing two dates. What was the actual root cause?
A) A bug in the model
B) No eval/graded set existed — the dozen manual checks all shared the same input shape, so there was no signal the two-date case existed
C) Validation was missing entirely
D) The prompt was too long

**Q4.7** Which test level catches a failure where two components each pass their own tests, but the data format they exchange doesn't match?
A) Unit test
B) Functional test
C) Integration test
D) None — this can't be tested

**Q4.8** What does a trace add that a failing eval score alone does not?
A) A lower score
B) Which specific step in the pipeline produced the bad result
C) A cost estimate
D) A retry mechanism

**Q4.9** For a single-fact lookup against a stable, unchanging reference corpus, which retrieval approach is correct?
A) Agentic/iterative search across many rounds
B) Fetch-once (static retrieval, one pass)
C) Always use both simultaneously
D) Neither — always answer from memory

**Q4.10** A 429 response is:
A) Terminal — never retry
B) Retriable — clears with time, often via honoring `retry-after` before falling back to exponential backoff
C) A model refusal
D) A tool-result error

**Q4.11** A 400 (bad request) response is:
A) Retriable with backoff
B) Terminal — retrying the identical malformed request accomplishes nothing
C) The same as a 429
D) Fixed by adding jitter

**Q4.12** When you're unsure whether an error is retriable or terminal, the safer default is to treat it as:
A) Retriable, and retry aggressively
B) Terminal — fails loudly and gets fixed, vs. a wrongly-retriable error hammering a service silently
C) Neither — ignore it
D) Always terminal for 5xx errors specifically

**Q4.13** What happens if a tool call fails and your code returns an empty result instead of setting `is_error: true`?
A) Claude automatically retries the tool
B) Claude treats the empty result as valid data and reasons on top of it, producing a confident but wrong answer
C) The API rejects the request
D) Nothing — it's equivalent to setting is_error

**Q4.14** A refusal (`stop_reason: "refusal"`) arrives as what HTTP status?
A) 400
B) 429
C) 200 — meaning the status-code retriable/terminal classifier alone will NOT catch it
D) 500

**Q4.15** The default model selection discipline is:
A) Always start with the most capable model available
B) Start with Sonnet; move up to Opus only when an eval shows Sonnet missing the bar; move down to Haiku only when an eval shows the drop is acceptable
C) Always use Haiku for cost reasons
D) Pick the model that was used in the last project

**Q4.16** What are the three metrics you should instrument on every Claude API call in production?
A) Model name, prompt length, user ID
B) Token usage (input/output), latency, error rate
C) Region, SDK version, retry count only
D) Cost only

**Q4.17** Roughly how much more expensive is an orchestrator-worker (multi-agent) pattern vs. a single chat interaction, per Anthropic's reported internal case?
A) 2x
B) 5x
C) ~15x
D) 100x

**Q4.18** When is the orchestrator-worker pattern the WRONG choice?
A) Broad research across many independent sources
B) A tightly coupled task like coding, where each step depends on the previous one
C) Any task requiring parallel exploration
D) Tasks with independent subtasks

**Q4.19** What should be defined FIRST when balancing cost and reliability?
A) The cost ceiling — reliability is tuned to fit under it
B) The reliability floor (retry budget, latency ceiling) — cost is then optimized above that floor, not below it
C) Neither — they're independent
D) Whichever the customer complains about first

**Q4.20** Why does the model treat an instruction hidden inside a fetched web page the same as an instruction from the user?
A) It doesn't — it always distinguishes them
B) The model reads its entire context as one undifferentiated stream of tokens with no built-in trusted/untrusted marker
C) Only if the page uses white text
D) Only on older models

**Q4.21** Why doesn't "we only work with trusted internal users" solve the prompt injection problem?
A) It does solve it completely
B) The hostile instruction typically arrives through fetched/retrieved CONTENT, not the user's own prompt — trusting the user doesn't touch that vector
C) Internal users are always malicious
D) It only matters for external-facing apps

**Q4.22** What is the actual reliable boundary against prompt injection, per this module?
A) Wording the prompt more carefully
B) What the agent is ALLOWED TO DO as a result of untrusted text — i.e., the action boundary, enforced via least privilege + hooks
C) Adding more delimiters only
D) Increasing the model's temperature

**Q4.23** Why is least privilege called "a design principle, not a configuration setting"?
A) It's just a philosophical preference
B) It's the control that holds even when every other defense (training, classifiers, delimiters) fails — it bounds the severity of a steered action
C) It doesn't actually affect security outcomes
D) It only applies to MCP servers

**Q4.24** What precedence order applies when multiple hooks/permission rules could apply to the same action?
A) Allow > ask > deny
B) Deny > ask > allow
C) Whichever fired first
D) Ask > deny > allow

**Q4.25** What's the "residual control" that holds even when a hook is missing, misconfigured, or bypassed?
A) A stronger system prompt
B) OS-level sandboxing (filesystem/network isolation enforced by the operating system, not application logic)
C) A second LLM judge
D) Increasing the retry budget

---

## MODULE 5 — Accelerators and IP Contribution

**Q5.1** What's the defining difference between "a template that runs" and "a template packaged for reuse"?
A) There is no difference
B) A packaged template has customer-specific values pulled into parameters with documented defaults, documented assumptions, and a bundled eval
C) A packaged template is always shorter
D) Packaging just means adding comments

**Q5.2** Which asset type's packaging requirement is "document each tool input and let the installing team set the scope, so it installs without code edits"?
A) Agent template
B) MCP Server Package
C) Eval Suite
D) None of these

**Q5.3** Besides proving a feature works, what's the SECOND role of a bundled eval suite mentioned in this module?
A) It has no second role
B) It acts as the deployment gate — a new model version must clear the pinned baseline before promotion
C) It replaces the need for documentation
D) It's only used during the first build

**Q5.4** The Claude Cookbook is designed for:
A) Full multi-component applications, UI included
B) Self-contained, focused single- or multi-pattern reference implementations
C) Only bug fixes
D) Internal company use only

**Q5.5** What are the four things that make a contribution verifiable by a maintainer?
A) Good variable names, comments, a README, a license file
B) The code does one thing, an example shows it running, a test proves it works, a short statement names the assumptions
C) Star count, fork count, issue count, PR count
D) Code coverage percentage, CI badge, changelog, versioning

**Q5.6** Rights/licensing/attribution checks happen:
A) After the technical review, if the code is accepted
B) Before the technical review — they gate whether a contribution can be accepted at all
C) Only for MCP servers
D) Only if the maintainer asks

**Q5.7** "The agent should be fast and accurate" is:
A) A valid functional requirement
B) NOT checkable, so it's not a valid functional requirement
C) A valid infrastructure requirement
D) Both A and C

**Q5.8** "Transcript data must be processed within the EU" is:
A) A functional requirement
B) An infrastructure requirement (residency)
C) A design choice, not a requirement
D) Not something that can be captured before build

**Q5.9** In the systems lifecycle (Requirements → Design → Build → Test → Deploy → Operate → Iterate), where does "gate promotion on the eval result before a version goes to production" belong?
A) Test
B) Deploy
C) Design
D) Operate

**Q5.10** What's the danger of shipping against a model ALIAS (e.g., `"opus"`) instead of a pinned full model ID?
A) There is no danger — aliases are always safe
B) The alias can resolve to a new version with no app change, producing a silent production change with no pinned version to roll back to
C) Aliases only affect latency, not output
D) Aliases are deprecated and won't work at all

**Q5.11** For Claude Platform on AWS, where does inference actually run?
A) Inside the customer's AWS boundary
B) Anthropic-operated infrastructure, OUTSIDE the AWS boundary, even though it's accessed via the customer's AWS account
C) On the customer's own GPUs
D) It varies randomly per request

**Q5.12** Why can a lower per-token price still result in a higher total cost on a given platform?
A) It can't — token price is the only cost driver
B) Total cost also includes egress, platform fees, and integration effort
C) Token price and total cost are always identical
D) Only latency affects total cost

**Q5.13** A latency measurement taken from a developer's laptop for a customer in eu-west is:
A) Always accurate regardless of location
B) Potentially misleading — latency should be measured from the customer's actual region against their actual payload
C) Irrelevant to platform choice
D) The industry-standard method

**Q5.14** For a regulated financial/healthcare customer, a data residency requirement is typically treated as:
A) A tradeoff to balance against cost
B) Pass-or-fail, not a tradeoff
C) Irrelevant if latency is good
D) Only relevant post-launch

**Q5.15** In a multi-component app (API → Claude Code task → MCP server), what determines the application's overall containment?
A) The average privilege level across all components
B) The MOST privileged seam — one overly-broad component becomes the weak point even if others are scoped correctly
C) The least privileged component only
D) The total number of components

**Q5.16** Content fetched by one component in a multi-component app and passed to the next component should be treated as:
A) Trusted instructions, since it came from your own component
B) Untrusted data — trust must be explicitly established at each boundary, not inherited from the sending component
C) Irrelevant to security since each component was tested individually
D) Automatically safe if the fetching component passed its unit tests

**Q5.17** When a trust boundary/seam in a multi-component app cannot be secured, what's the correct move?
A) Ship it anyway and monitor closely
B) Escalate to a human owner rather than shipping around it
C) Disable the seam entirely
D) Add a comment warning future developers

---

## ADDITIONAL CROSS-MODULE / EXAM-STYLE PRACTICE QUESTIONS

**X1** You're building an agent where each tool call's output feeds directly into constructing the next tool call's arguments. Should these run in parallel or sequential?
→ **Sequential** — this is a genuine subtask dependency; the second call can't be built until the first result returns. Use separate turns, or `disable_parallel_tool_use` if needed.

**X2** Your eval score holds steady at 7.2/10 average after a prompt change. Should you consider the change validated?
→ Not necessarily — check the **per-case breakdown**. A steady average can hide a change that fixed three cases and broke three others; the average conceals this while per-case results reveal it immediately.

**X3** An agent needs to remember a coding convention across every session in a project, regardless of what task is being run. Where does this belong?
→ **CLAUDE.md** (always-on, unconditional) — NOT a Skill (which loads only on-demand/description-match) and not a rules file (which is path-scoped).

**X4** A tool description reads "use this to retrieve data." What's wrong, and what's the fix?
→ It's too vague to disambiguate from other retrieval tools — Claude will guess. Fix: rewrite with a specific trigger AND an exclusion condition, e.g., "use this to retrieve the current balance for a specific account ID; do not use this for transaction history."

**X5** True or False: A hook enforces a rule more reliably than the same rule written into CLAUDE.md.
→ **True** — a hook fires deterministically at its lifecycle event regardless of what the model decides; a CLAUDE.md instruction can be followed inconsistently, especially as the file grows and dilutes.

**X6** Your orchestrator-worker research agent costs 15x a single-chat baseline on a task that turned out to be a single lookup. What's the fix?
→ Route: use a cheap classifier to detect single-lookup queries and send them through a single agent / fetch-once path; reserve orchestrator-worker for genuinely parallel-decomposable tasks.

**X7** You need EU-only data residency for a customer. Is the first-party Claude API guaranteed to satisfy this?
→ No — the first-party API's EU regional coverage should be confirmed at build time; EU-only residency typically requires **Bedrock or Vertex AI**.

**X8** A PR you submitted works perfectly for you but has sat unreviewed for three weeks. What three things are most likely missing?
→ A runnable example, a test proving the behavior, and a short statement of environment assumptions — a maintainer can't verify what they'd have to reverse-engineer.

**X9** What's the practical difference between `defer_loading` and `enabled` on an `mcp_toolset` config?
→ `defer_loading` delays WHEN a tool definition loads into context (a context-cost control); `enabled` decides WHETHER the model sees a given tool at all (a governance/scope control). They're often used together.

**X10** A subagent is delegated a task and it fails to apply a project-specific coding convention from CLAUDE.md. Why?
→ If it's a built-in Explore/Plan subagent, it skips CLAUDE.md and git status by design (optimized for fast/cheap research). Use a general-purpose or custom subagent (with rules explicitly loaded) when project constraints must be respected.

**X11** Why is caching a customer's live account balance in a long-lived prompt cache breakpoint risky?
→ Cache reuse assumes the cached content is still correct — a value that can change (like live account state) may be served stale for as long as the cache lives. Stable, unchanging content (system prompts, tool schemas) is the safe target.

**X12** A dev sets `max_attempts=5` with `time.sleep(0)` between retries on a 429. What's wrong?
→ No actual backoff — each instant retry counts as another request against the same rate limit and deepens it rather than waiting for it to clear. Needs exponential backoff (ideally honoring `retry-after`) with a cap.

---

## ANSWER KEY

**Module 1:** 1.1-B, 1.2-C, 1.3-False, 1.4-B, 1.5-B, 1.6-B, 1.7-B, 1.8-B, 1.9-B, 1.10-B, 1.11-C, 1.12-B

**Module 2:** 2.1-B, 2.2-A, 2.3-C, 2.4-B, 2.5-B, 2.6-B, 2.7-B, 2.8-B, 2.9-B, 2.10-B, 2.11-B, 2.12-B, 2.13-B, 2.14-B, 2.15-B, 2.16-B, 2.17-B, 2.18-B, 2.19-B, 2.20-C, 2.21-B, 2.22-B, 2.23-B, 2.24-B, 2.25-B, 2.26-B, 2.27-C, 2.28-B, 2.29-B, 2.30-B, 2.31-B, 2.32-B

**Module 3:** 3.1-B, 3.2-B, 3.3-B, 3.4-B, 3.5-C, 3.6-B, 3.7-B, 3.8-B, 3.9-B, 3.10-B, 3.11-B, 3.12-B, 3.13-B, 3.14-B, 3.15-B, 3.16-B, 3.17-B, 3.18-C, 3.19-B, 3.20-B, 3.21-B, 3.22-B, 3.23-B

**Module 4:** 4.1-B, 4.2-B, 4.3-B, 4.4-B, 4.5-B, 4.6-B, 4.7-C, 4.8-B, 4.9-B, 4.10-B, 4.11-B, 4.12-B, 4.13-B, 4.14-C, 4.15-B, 4.16-B, 4.17-C, 4.18-B, 4.19-B, 4.20-B, 4.21-B, 4.22-B, 4.23-B, 4.24-B, 4.25-B

**Module 5:** 5.1-B, 5.2-B, 5.3-B, 5.4-B, 5.5-B, 5.6-B, 5.7-B, 5.8-B, 5.9-B, 5.10-B, 5.11-B, 5.12-B, 5.13-B, 5.14-B, 5.15-B, 5.16-B, 5.17-B

---

## A note on external "exam dump" sites

You asked for links to online question dumps too — a few honest things worth knowing before you go looking:

- Sites like Dumpspedia, Dumpsbase, PassQuestion, and Passcert do show up in search results claiming "100% guaranteed" CCDV-F dumps. I'd treat these with real skepticism: they're paid, unverified, third-party operations with no relationship to Anthropic, and there's no way to confirm the questions are accurate, current, or even legitimately sourced rather than fabricated to look plausible. Several certification programs (not confirmed for Anthropic's specifically, but worth checking) explicitly prohibit using leaked/brain-dump material under their candidate agreement — using them can risk your certification if discovered, separate from the accuracy problem.
- **Claude Certification Guide** (claudecertificationguide.com) looked like the most legitimate free option in my search — it says it offers free mock exams and study guides mirroring the official blueprint structure, no sign-up. I haven't independently verified its content accuracy, so treat it as a supplementary pacing/format exercise, not a source of truth.
- Your best "official" sources remain: the actual course modules you've been working through (which is what this whole dump is built from), and Anthropic's own docs at platform.claude.com for anything version-specific (model IDs, current pricing, current feature availability) since several answers above are explicitly flagged in your course material as "confirm at build time."

If you'd like, I can also turn this into a randomized/timed quiz format, or build out a similar dump once you've got Module 6+ (if there is one) or move on to Architect-track prep.
