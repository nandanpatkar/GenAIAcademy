# Phase 3 — Ollie, and the traces worth reading

Companion notes for [`../phase3_ollie.ipynb`](../phase3_ollie.ipynb).

## What this phase adds

- **One span per job source.** `source.jsearch`, `source.adzuna`,
  `source.remotive`, each carrying the query it ran. Wrapped only when Opik is
  configured, so the keyless path stays silent.
- **Ollie, all five capabilities.** Trace investigation, source-code
  integration, agent re-execution, test-suite verification and cross-workspace
  search. There is no SDK for any of it, so the deliverable is a demo script
  (`../../docs/ollie.md`) plus traces and a gate good enough to answer real
  questions.
- **A search test suite.** `job-scout-search-suite` grades what the cascade
  *did* — which sources answered, which contributed, how long each took —
  because the tailoring suite grades prose and cannot verify a latency fix.
  It starts red (33%) on purpose.
- **One real bug, left in.** JSearch spends its full 15s timeout for zero jobs
  on every search. It is the subject of the codebase loop, and it must be fixed
  before `part3.0` ships.

The measurement half of Phase 3 — validator v2, the optimizer-tuned tailor
prompt, the regression gates — is written up in
[`../../docs/phase3_findings.md`](../../docs/phase3_findings.md) with the full
B0/B1/B2 ledger. This notebook does not repeat it.

## Learning objectives

1. **An assistant can only find what you recorded.** The same question ("why is
   search slow?") against the same system gives a useless answer before the
   per-source spans and a precise one after. The engineering is the decision to
   span a source; the assistant is the interface to it.
2. **Verify the assistant before you trust it.** Ask it things already written
   down in this repo — the 0.309 → 0.1423 fabrication rate, the prompt version
   history — before asking it things you cannot check. An assistant that names
   the right file and the wrong line is worse than one that says it does not
   know.
3. **A gate before a fix, not after.** The search suite is red (33%) before
   Ollie touches anything, so "it works now" is a number rather than a
   feeling.
4. **Concurrency changes the shape of a waterfall, not its worst case.** Fan-out
   turns sum-of-sources into max-of-sources. A single timing-out source is
   therefore fully exposed, not hidden — which is how we found one.
5. **A finding is not a fix.** The 15-second JSearch timeout is documented and
   left open, because lowering a source timeout changes what users get and not
   merely how fast they get it. Measure first, in the style of
   `../../docs/optimizing_latency.md`.

## Run it

```bash
uv sync --all-groups
cp .env.example .env       # OPIK_API_KEY is the one that matters here
uv run jupyter lab notebooks/phase3_ollie.ipynb
```

Then follow [`../../docs/ollie.md`](../../docs/ollie.md) in the Opik UI — the
notebook produces the traces, the doc has the click paths, the questions and
the screenshot shot-list.

Capabilities 2-4 need Ollie to reach the code, which is a local bridge you
start yourself and nothing here starts for you:

```bash
uv run opik connect --project job-scout      # read files, propose edits, run the agent
uv run opik connect stop --project job-scout
```

Note: the notebooks use `../data` paths, so the kernel's working directory must
be `notebooks/` (normal Jupyter behavior).

## Learning materials

- [Opik tracing concepts](https://www.comet.com/docs/opik/tracing/log_traces)
- [`../../docs/optimizing_latency.md`](../../docs/optimizing_latency.md) — the
  latency chapter this one continues, including an honest failed optimization
- [`../../docs/jobvis.md`](../../docs/jobvis.md) — the voice console
