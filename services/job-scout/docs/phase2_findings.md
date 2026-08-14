# Phase 2 findings

Phase 2 extended the agent (corpus-grounded tailoring + deterministic
fabrication validation) and built the evaluation stack. **Everything below is
documented, not fixed** — fixing is Phase 3's story, so the weaknesses stay
observable until then.

Sources: `docs/tailor_batch.json` (15 tailoring cases, tags
`phase-2`/`tailor-batch`), the Opik experiments listed in
`docs/phase2_eval_report.md`, and the trajectory feedback scores on 20
traces.

## Phase 1 weaknesses, carried forward

| # | weakness (see `phase1_findings.md`) | Phase 2 status |
|---|---|---|
| 1 | Adzuna almost never used; LLM tool args defeat the international design | **Still open — now quantified**: `agent_tool_correctness` mean **0.675** over 20 traces (judge gpt-4o-mini), scores written back onto the traces. Phase 3 optimizer target. |
| 2 | Location constraints ignored | Still open. Unchanged in the tailor batch (Remotive-dominated results regardless of profile location). |
| 3 | Reformulation fires constantly, rarely helps | Still open. Fired throughout the tailor batch's search legs. |
| 4 | Reformulation dominates cost/latency | Still open — and it now also stretches the *tailoring* UX, since the search leg gates the pack (search legs ~60–370s in the batch). |
| 5 | Ranking scores skew low, compress at the top | Still open; visible again in the ranking dataset (`rank_index` spread). |
| 6 | `matched_skills` grounding unchecked | **Partially addressed by measurement, not by fix**: tailoring claims are now validated (`FabricationRate`), and the Hallucination judge over ranking explanations scores ~0.53–0.58 — half the explanations contain claims the judge can't ground. The ranking path itself still has no deterministic grounding check. |

## New weaknesses (Phase 2)

### 7. The first-draft tailor prompt drifts and pads — every run was flagged

**All 14 tailored runs produced fabrication flags: 79 flags over 229 checked
claims (rate 0.345).** Breakdown (12-run standard subset): ~53% CV-bullet
rewrites below the 0.75 similarity threshold, ~40% unverifiable cover-letter
claims, ~7% out-of-corpus skills. The offline eval reproduces it:
`FabricationRate` averaged **0.309** on the `tailoring-cases` experiment —
deterministic metrics agree with the live validator, by construction. Some
flags are genuine embellishment (rewrites importing the job ad's vocabulary
wholesale); the prompt has no notion of "stay close to the source."
Deliberately unoptimized — optimizer target #2 for Phase 3. (For contrast, the
built-in Hallucination judge on the same cover letters averaged only 0.227 —
the deterministic check is stricter than the LLM judge here.)

### 8. The validator's thresholds flag honest rewrites (false positives are loud)

Of the 68 flags, roughly half sit in the 0.55–0.74 "near-miss" band —
aggressive-but-honest paraphrases ("10M requests/day" → "10 million requests
per day" pushes a bullet below 0.75 when combined with other rewording).
Clearest cases:

- skill "AWS" flagged against corpus skill "basic AWS" (ratio 0.50) — the
  qualifier defeats normalized matching;
- "agile Methoden" (German CV) flagged at 0.73 — cross-language/inflection
  artifacts;
- "I am excited to apply for the Online Data Analyst position." flagged even
  with job context supplied — the sentence-vs-reference ratio is too blunt.

Documented heuristic, deliberately not tuned (see `validation.py` docstring):
the false-positive pattern itself is the Phase 3 test-suite material.

### 9. Compositional truths are unverifiable at sentence level (false negatives too)

Sentences like "With 1.5 years of experience as a Data Analyst at BrightRetail
Inc, I built forecasting models" are *true* — but assembled from several corpus
items, so no single reference reaches the 0.55 sentence threshold → flagged.
Conversely, a fabricated detail embedded in an otherwise-copied bullet can pass
at ≥0.75. Sentence-level best-match cannot see composition or embedded edits.

### 10. The unverifiable judgment depends on the judge — 0.44 vs 0.84

The same 30 ranking explanations scored `fit_explanation_quality` **0.44**
under a gpt-4o-mini judge and **0.84** under gpt-4.1-mini (both experiments in
Opik on `job-scout-ranking-cases`). The metric moves twice as much with the
judge as anything else in the system. Until the judge-vs-human calibration
lands (10 hand-labeled cases, pending), neither number deserves trust — which
is precisely the "unverifiable judgments" half of this phase's thesis.

### 11. Online rules cannot read the attached CV PDF

The Phase 1 design attached the CV PDF to every trace for a PDF-aware online
judge. Opik's online rules currently map only trace input/output variables —
attachments are unreachable from rules. Fallback shipped instead (see
`docs/opik_setup.md` §5): a rule that judges the cover letter against the
checkpointed `cv_text` in the trace output. Consequence: PDF-extraction errors
are invisible to online evaluation.

### 12. Naive CV segmentation pollutes the corpus

The line-based segmenter splits PDF-wrapped sentences into fragment items
(e.g. the senior CV's summary becomes two items, one starting mid-sentence:
"owns MLOps, and is open to remote or Berlin-based roles."). Fragments both
weaken bullet-similarity scores (feeding #8) and hand the tailor LLM
awkward source items. No NLP libraries by design; documented, not fixed.

## Non-issues (worth noting)

- **0 search failures, 0 crashes** across the batch; the unknown-job case
  degraded gracefully into state + trace exactly as designed.
- **Checkpoint reuse held everywhere**: every tailor invocation ran only
  `tailor` + `validate_tailoring` (verified in traces and asserted in
  `tests/test_thread_continuity.py`).
- **Cover-letter length contract held**: 179–243 words across runs, well under
  the 350-word cap.
- **The renderer never failed a run**: PDFs compiled with tectonic present;
  the `.tex` + Overleaf path covered its absence.

## Reproduce

```bash
uv run python scripts/run_tailor_batch.py --yes           # ~$0.45, ~90 min
uv run python scripts/build_eval_dataset.py --kind tailoring --push
uv run python scripts/run_evals.py --suite ranking --judge-model gpt-4o-mini --yes
uv run python scripts/run_evals.py --suite ranking --judge-model gpt-4.1-mini --yes
uv run python scripts/run_evals.py --trajectory --yes
```
