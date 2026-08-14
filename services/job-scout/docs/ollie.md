# Ollie: from reading the trace to fixing the code

Ollie is Opik's assistant, and it does more than answer questions about traces.
Connected to your repository it will read the code behind a span, propose an
edit, rerun the agent on the original inputs, and run a test suite to show the
regression is gone — with your approval on every write.

That is the whole arc of this chapter, and it runs on **one real bug we left in
on purpose**.

## The bug, and why it is still here

Phase 3 gave every job source its own span (`traced_call` in `tracing.py`).
The first real traced search answered a question nobody had asked:

| span | duration |
|------|----------|
| `source.jsearch` | **15 307 ms** |
| `source.adzuna` | 892 ms |
| `source.remotive` | 157 ms |

and `sources_used` was `['adzuna']`.

The **primary** source spends fifteen seconds and contributes **nothing**.
15.0s is exactly `JSearchSource`'s timeout — it is not slow, it is timing out.
Reproduced directly, three times: 15 264 ms, 15 265 ms, 15 244 ms, zero jobs.
Because the fan-out queries live sources concurrently, wall time is the slowest
source, so **every search pays a 15-second tax for a discarded result**.

The old instrumentation would have said "search took 15 seconds" and sent you
to look at the ranking prompt.

**It was deliberately left unfixed** until the session below, because it is a
genuine product decision rather than a one-line bug: a short timeout drops
sources that are merely slow, and JSearch is *sometimes the only source that
returns anything*. That is exactly the kind of decision Ollie is built to walk
you through, and the constraint you should hand it explicitly.

Resolved 2026-08-05 with a two-phase soft deadline: **16 109 ms → 1 103 ms**
paired, same 10 jobs. The search suite stayed at 33%, correctly — see the
release checklist at the end and
[`phase3_findings.md`](phase3_findings.md).

## Connecting the repository

Capabilities 2, 3 and 4 need a local bridge. From the repo root:

```bash
uv run opik connect --project job-scout
```

Leave it running in its own terminal. To stop it:

```bash
uv run opik connect stop --project job-scout
uv run opik connect stop --all
```

**Be clear about what this grants.** While the daemon is up, Ollie can read
files in this project, propose edits to them, and run your agent. Writes
require your explicit approval each time, and the session is scoped to the
project you named — but it is still a real grant of access to a directory on
your machine, and it should be a deliberate choice rather than a step you
click past. It is also why nothing in this repo starts it for you.

### Two failure modes worth recognising, because they look identical

Both present as Ollie sitting on "Working…" for minutes with no card. They are
not the same problem and the fix is different.

**The bridge died.** `pgrep -f "opik connect"` returns nothing. Ollie eventually
says so itself — *"the bridge connection dropped, connect_edit is no longer
available… Reconnect with `opik connect --project job-scout`"* — and helpfully
prints the diff for you to apply by hand. Being **logged into Opik in the
browser is not the same as having the bridge up**; the browser session and the
local daemon are independent, and only the daemon grants file access.

**Ollie is out of credits.** The bridge is fine (`Ollie connected` shows bottom
right, pairing succeeded), but the reply comes back as *"Your API credit limit
has been reached."* Observed 2026-08-05 after roughly a dozen requests, one of
which hung for 460s before failing rather than erroring immediately. Nothing is
written and nothing is lost, but no amount of reconnecting fixes it. Check the
Admin dashboard before debugging the bridge.

## The five capabilities

Run through them in order; each one sets up the next.

### 1. Trace investigation

Open the **job-scout** project → **Traces** → a search trace → the Ollie panel.

> "This search took 15 seconds. Which part was slow?"

It should name `source.jsearch`. Without per-source spans the only honest
answer is the total you already knew — worth showing an old trace beside a new
one, because that contrast *is* the lesson: an assistant can only find what
your instrumentation recorded.

> "Did the slow source contribute any results?"

The answer is in `sources_used` on the trace output. This is the good one: the
slow thing was also the useless thing, and no amount of staring at a total
would have told you.

### 2. Source-code integration

With `opik connect` running:

> "Read the code behind the source.jsearch span and tell me where that 15
> seconds comes from."

It should find `JSearchSource.__init__` in `src/job_scout/tools/jobs_api.py`
and the `timeout: float = 15.0` default.

**Verify rather than trust.** Open the file yourself. An assistant that names
the right file and the wrong line is more dangerous than one that says it does
not know, and this is the moment to find that out — while it is cheap.

### 3. Proposing and applying a fix

> "Propose a change that stops one slow source holding up the whole search.
> Keep the cascade's consumption order and thresholds unchanged."

Add the constraint that makes this hard, because it is real: on 2026-08-05
JSearch was the *only* source that returned anything. Say so, and add **"do not
edit anything yet, just show me the diff you would make."**

We expected a `SCOUT_SOURCE_TIMEOUT` threaded through the three adapters. What
it proposed was better: a **two-phase soft deadline** in `run_search` (phase 1
bounds the wait and falls through to finished sources, phase 2 goes back and
waits for JSearch in full if the cascade is still short and JSearch was never
consumed). Judge any answer against
[`optimizing_latency.md`](optimizing_latency.md), which records what was
already tried, what worked, and one honest failure — an assistant that
proposes something already measured and rejected is worth catching.

Approve the write only when you have read the diff, and click **"Allow once"**
rather than "Always allow" — the latter quietly ends the review. Ollie edits
your working tree; `git diff` is the real review. Two things it got wrong that
only the human pass caught, both recorded in
[`phase3_findings.md`](phase3_findings.md):

- it **deleted the comment** explaining why `copy_context` wraps each worker
  thread, which is the line keeping Opik's tracer alive inside the pool and
  therefore the reason the per-source spans exist at all
- its default of `5.0s` was **unmeasured**. The deadline is paid in full on
  every search, and JSearch has never returned under 8s, so 5s buys it no
  chance and costs the user 5 seconds. Measured default: `1.0s`

### 4. Rerunning and verifying

> "Rerun that search with the original inputs and show me the new span tree."

Then the gate:

> "Run the job-scout-search-suite against the updated agent."

The suite (`scripts/setup_search_suite.py`) exists for exactly this. Its
assertions read the numbers the fix is supposed to move:

- no source's `duration_ms` above 8 000
- every source in `sources_used` contributed at least one job
- the search returned at least one job

**The before number, measured 2026-08-05:**

| assertion | pass |
|-----------|------|
| no source over 8s | 33% (1/3) |
| every used source contributed | 67% (2/3) |
| search returned jobs | 100% (3/3) |
| **suite pass rate** | **33%** |

A fix that works moves that to 100%. A fix that only *looks* right will not,
and that is the entire point of having the gate before the fix.

Ollie also writes a regression test with each fix. Keep an eye on where it puts
it: `gates/` in this repo is deterministic and offline by contract, so a test
that hits live job APIs belongs in the suite, not there.

### 4b. The warm-up write: let Ollie add the entrypoint

Ollie's own report noticed there is no `@opik.track(entrypoint=True)` anywhere,
which is why the **Agent Playground** cannot run this agent from the UI. That
makes it the ideal *first* thing to let it edit: additive, one decorator, a
diff you can read in five seconds, and it unlocks a capability rather than
changing behaviour.

> "Add an entrypoint so I can run this agent from the Agent Playground."

Order your session by blast radius, not by interest. A tool that is about to
edit your working tree should earn it on something trivial first — and if it
fumbles the trivial change, you have learned that cheaply.

Then check the Playground actually works before moving on. That is the
verification step for a write, the same way the search suite is the
verification step for the timeout fix.

### 5. Cross-workspace search

Ollie queries traces, datasets, experiments and prompts in one conversation.
Phase 2 and 3 left plenty to ask about:

> "Compare the tailoring-gpt-4.1-mini experiments before and after the prompt
> optimization."

(0.309 → 0.1423 fabrication rate; see [`phase3_findings.md`](phase3_findings.md).)

> "Show me the versions of the tailor prompt and what changed."

(The optimizer's winning instruction block is the current version.)

> "Which traces in this project have fabrication_flags above zero?"

> "What is in the job-scout-tailoring-cases dataset?"

Each answer is checkable against a number already written down in this repo,
which is the right way to build trust in a tool that reads your data: ask it
things you already know before you ask it things you do not.

## What Ollie actually said, and what survived checking

Asked *"How can I improve my agent?"* on 2026-08-05, Ollie read the experiments,
the optimizer run and the recent traces, and came back with four items. Scoring
them against what this repo already records is the whole "trust but verify"
lesson, delivered by the tool itself:

| # | Ollie's claim | Verdict |
|---|---------------|---------|
| 1 | Search suite at 33%; sources slow and/or empty; `fetch_jobs` is the bottleneck | **Right**, and it found the same thing we did — but see below |
| 2 | 4.1-mini fabricates less (0.14) and hallucinates more (0.37); 4o-mini the reverse (0.17 / 0.28) | **Right, and we were wrong to doubt it.** Fabrication exact (0.1423 / 0.1749). The hallucination figures are **recorded feedback scores** on experiment `tailoring-gpt-4.1-mini` (30 Jul), visible in its header next to the fabrication number: `hallucination_metric (avg) 0.37`. They were never in our *markdown*, which is not the same as not in our records |
| 3 | Recent eval traces error with "must return a dict with 'input' and 'output'" | **Right about the error, wrong about the world** — already fixed |
| 4 | No `@opik.track(entrypoint=True)`, so the Agent Playground cannot run your agent | **Right, and new** — `grep -rn entrypoint src/` returns nothing |

Three things worth sitting with.

**It recommended work already shipped.** Item 1's suggested fixes were "add
timeouts per source, parallelize fetches, or drop sources that return nothing".
The middle one landed in Phase 3 — `SCOUT_CONCURRENT_SOURCES`, on by default,
measured at 3.01s → 2.01s and written up in
[`optimizing_latency.md`](optimizing_latency.md). Ollie can read your traces;
it cannot read your changelog. This is exactly the check this chapter tells you
to run, and it fired on the first real question.

**It reported a fixed bug as outstanding.** Item 3 is real — `opik.run_tests`
does require both keys, and both suite scripts did return only `output`. It was
fixed roughly an hour before Ollie was asked. It was reading traces from before
the fix and had no way to know. An assistant grounded in telemetry inherits
telemetry's lag.

**It found something genuinely new.** Item 2's *trade-off* is not in any of our
findings: we measured fabrication on both models and never put the hallucination
judge beside it. Whether the specific numbers hold is untested — the metric
disagreement in `phase2_eval_report.md` (0.44 vs 0.84 on the same explanations)
is precisely why a judged number needs its own verification before it earns a
sentence in a blog post. **Open the experiments and confirm 0.37 / 0.28 before
quoting them anywhere.**

Item 4 is the best kind of finding: cheap, checkable, and it unlocks something
we were not using.

### The scorecard is the story

Two of four right and immediately actionable, one right but stale, one right
with a recommendation already implemented. That is a genuinely useful assistant
and an unreliable narrator at the same time, which is the honest thing to
report about a tool reading your traces. None of the four required Ollie to be
*trusted* — every one was checkable in under a minute against something already
written down.

## The honest close

Ollie did not find the 15-second timeout. The instrumentation did — because
somebody decided a job source deserved its own span — and Ollie read it out
loud, then followed it into the code. That is a genuinely useful thing for a
tool to do, and it is not the same as the tool doing your observability for
you. Every question above was answerable only because the trace already
contained the answer.

## The session to run, in order

Copy-paste prompts, ordered so each one earns the next. Nothing here needs you
to trust an answer you cannot check within a minute.

| # | Ask Ollie | What you are showing | Check it against |
|---|-----------|----------------------|------------------|
| 1 | *"How can I improve my agent?"* | It reads experiments, traces and optimizer runs unprompted | The scorecard above — expect a stale item and an already-shipped suggestion |
| 2 | *"This search took 15 seconds. Which part was slow?"* | Trace investigation | `source.jsearch` in the span tree |
| 3 | *"Did the slow source contribute any results?"* | Reading the trace output, not guessing | `sources_used: ['adzuna']` |
| 4 | *"Read the code behind the source.jsearch span and tell me where that 15 seconds comes from."* | Source-code integration | `jobs_api.py`, `timeout: float = 15.0` — open the file |
| 5 | *"Add an entrypoint so I can run this agent from the Agent Playground."* | A safe first write, with approval | `git diff`, then the Playground runs |
| 6 | *"Propose a change so one slow source cannot hold up the whole search. Keep the cascade's consumption order and thresholds unchanged."* | The real fix | `optimizing_latency.md` — reject anything already tried |
| 7 | *"Rerun that search with the original inputs."* | Agent re-execution | The new span tree |
| 8 | *"Run the job-scout-search-suite against the updated agent."* | Regression proof | 33% → should be 100% |
| 9 | *"Compare the tailoring-gpt-4.1-mini experiments before and after the prompt optimization."* | Cross-workspace search | 0.309 → 0.1423, already on record |
| 10 | *"Which traces have fabrication_flags above zero?"* | Querying traces conversationally | The flags in `phase3_findings.md` |

Ask 9 before you ask anything you cannot check. If it gets a number you already
know wrong, that is worth far more than a correct answer to a question you had
to take on faith.

## Screenshot shot-list for the Part 3 post

Ten image slots in the draft. Three are diagrams we render ourselves and are
ready to use; the rest are live Opik captures.

**Capture rule, learned the hard way.** Substack renders every image at 728 CSS
pixels wide. A full browser window captured on a 1x display puts Opik's ~11px
interface text at roughly 5px on screen, which reads as a grey smudge and makes
the shot decorative rather than evidential. So:

1. Put the browser on a **Retina (2x) display**, not an external 1x monitor
2. Use **Cmd-Shift-4** and drag a region, which writes a true 2x PNG
3. **Crop tight to the rows that carry the claim.** Never the whole window.
   Roughly 900px of captured width is the ceiling before the text gets too small
4. Save as PNG, not GIF. GIF is 256 colours and turns antialiased text to mush

### Ready to paste (rendered at 2x, authored for the width)

| slot | file | what it is |
|---|---|---|
| D1 | `blog/images/D1_journey_part3.jpg` | four-part journey map, arrow under Part 3 |
| D6 | `blog/images/D6_ollie_loop.jpg` | the six-step loop, coral card is the human gate |
| D5 | `blog/images/D7_numbers.jpg` | the Phase 3 measurements card |

### Needs capturing

| slot | shot | click path | crop to |
|---|---|---|---|
| O-intro | The Ollie panel open beside a trace | any trace → owl icon, top right | the panel, from its header down to the message box |
| O1 | Span tree, `source.jsearch` 15.4s dwarfing the rest | trace `019fcb21-c8ce-7d21-b8e4-53a1dcedc333` (see URL below) | the four `source.*` rows only |
| O5 | Ollie's reply after approving edits | the conversation with `connect_edit – Approved` | from the approval rows down to "All 24 tests pass" |
| O6 | **The pending approval card** | ask for a trivial edit, shoot **before** clicking, then Deny | the diff plus the three buttons |
| O7 | Both gate runs at 33% | **Experiments** | the table rows, both `33%` pills visible |
| O10 | The "how can I improve my agent?" report | Ollie panel | the reply, from the question down to item 5 |
| O11 | `fabrication_rate 0.14` beside `hallucination_metric 0.37` | **Experiments** → `tailoring-gpt-4.1-mini` | the header strip with both scores |
| logo | The Opik logo block | reuse Part 2's | n/a |

The O1 trace, verified to be the one the post's code block quotes:

```
https://www.comet.com/opik/shirin-4590/projects/019f5bf7-e5c8-73dd-b739-dc2c9af67762/logs?traces_search=concurrent&trace=019fcb21-c8ce-7d21-b8e4-53a1dcedc333
```

Collapse the Ollie panel before shooting it, or it eats a third of the frame.

### O6 needs a live bridge and spare credits

It is the most valuable missing image, because the post's whole safety argument
rests on that dialog. A re-shoot attempt on 2026-08-05 failed on the Ollie
**credit limit**, not the bridge, which had paired fine. When credits are back:

1. `uv run opik connect --project job-scout`, open the pairing link
2. Ask for something trivial and reversible, e.g. *"add a one-line comment above
   the JSearchSource class saying its 15s timeout is deliberate"*
3. Screenshot the card **before** clicking. The three buttons are the subject
4. Click **Deny**. The image is the point; the edit is not

### Highlight boxes

The three number-carrying shots (O1, O7, O11) read far faster with a coral box
around the number the sentence is about. Colour `#C0392B`, 5px, to match the
human-gate card in D6. Box the `source.jsearch` row, both `33%` pills, and
`hallucination_metric 0.37` respectively, and leave the neighbouring numbers
unboxed so the contrast does the arguing.

Opik's UI ships weekly; if a path has moved, `comet.com/docs/opik/llms.txt`
resolves faster than clicking around.
## Release checklist

- [x] The JSearch tax is contained via Ollie (2026-08-05): two-phase soft
      deadline, 16 109 ms → 1 103 ms paired, same 10 jobs, 226 tests green
- [x] `job-scout-search-suite` re-run after the fix: **33% → 33%**, and that is
      the correct answer. Assertion 2 went 67% → 100%; assertion 1 still fails
      because JSearch is still a 15-second source. Both runs are in Opik under
      `search-suite-gate` for the before/after screenshot
- [x] `docs/phase3_findings.md` updated with the measured after-numbers
- [ ] JSearch itself is still slow. Containing is not repairing — decide before
      `part3.0` whether to demote it below Adzuna in the cascade
- [x] Ollie's hallucination figures **confirmed** 2026-08-05: `tailoring-gpt-4.1-mini`
      shows `fabrication_rate (avg) 0.14` and `hallucination_metric (avg) 0.37`
      in the experiment header. Prompt v1 was 0.227 (`phase2_eval_report.md`).
      Safe to quote as fact
- [ ] Decide what to do about the trade the optimizer made: fabrication -54%,
      hallucination +64%. Adding hallucination to the objective is the obvious
      next optimizer run
