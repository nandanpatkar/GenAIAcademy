"""The Phase 2 metric suite: verifiable checks vs unverifiable judgments.

Five headline metrics (the blog's teaching order):

- ``ProfileFieldAccuracy`` — deterministic, against hand-written labels. The
  eval on-ramp: unambiguous ground truth, zero LLM judges.
- ``FabricationRate`` — deterministic, wraps the fabrication validator.
- ``Hallucination`` / ``AnswerRelevance`` — Opik built-in LLM judges (imported
  where used, not wrapped here).
- ``fit_explanation_quality`` — a custom G-Eval rubric (an LLM judgment; its
  agreement with humans is measured, not assumed — see the calibration step).
"""

from __future__ import annotations

from difflib import SequenceMatcher
from typing import Any

from opik.evaluation.metrics import BaseMetric, GEval
from opik.evaluation.metrics.score_result import ScoreResult

from job_scout.corpus import build_corpus
from job_scout.graph.schemas import TailoringPack
from job_scout.validation import validate_pack

_FUZZY_MATCH_THRESHOLD = 0.8  # difflib ratio for roles/skills pair-matching


def _norm(text: str) -> str:
    return " ".join(str(text).lower().split())


def _set_score(output: list[str], expected: list[str]) -> float:
    """Jaccard similarity of normalized sets (1.0 iff exactly equal)."""
    a, b = {_norm(x) for x in output}, {_norm(x) for x in expected}
    if not a and not b:
        return 1.0
    return len(a & b) / len(a | b)


def _fuzzy_f1(output: list[str], expected: list[str]) -> float:
    """Greedy fuzzy-pair F1: an item matches if its best ratio ≥ 0.8."""
    if not output and not expected:
        return 1.0
    if not output or not expected:
        return 0.0
    remaining = [_norm(e) for e in expected]
    hits = 0
    for item in (_norm(o) for o in output):
        best_i, best_r = -1, 0.0
        for i, exp in enumerate(remaining):
            r = SequenceMatcher(None, item, exp).ratio()
            if r > best_r:
                best_i, best_r = i, r
        if best_r >= _FUZZY_MATCH_THRESHOLD:
            hits += 1
            remaining.pop(best_i)
    precision = hits / len(output)
    recall = hits / len(expected)
    return 0.0 if hits == 0 else 2 * precision * recall / (precision + recall)


class ProfileFieldAccuracy(BaseMetric):
    """Deterministic accuracy of an extracted ``Profile`` vs a hand label.

    Per-field scoring: exact for ``seniority``/``remote_ok``; ±1 year for
    ``years_experience``; set match (Jaccard) for ``locations``/``languages``;
    fuzzy pair F1 for ``primary_roles``/``skills``. The overall value is the
    mean; the per-field breakdown lands in ``ScoreResult.metadata``.
    """

    def __init__(self, name: str = "profile_field_accuracy", track: bool = True, project_name: str | None = None):
        super().__init__(name=name, track=track, project_name=project_name)

    def score(self, output: dict[str, Any], expected: dict[str, Any], **_: Any) -> ScoreResult:
        fields: dict[str, float] = {
            "seniority": 1.0 if _norm(output.get("seniority", "")) == _norm(expected.get("seniority", "")) else 0.0,
            "remote_ok": 1.0 if bool(output.get("remote_ok")) == bool(expected.get("remote_ok")) else 0.0,
            "locations": _set_score(output.get("locations", []), expected.get("locations", [])),
            "languages": _set_score(output.get("languages", []), expected.get("languages", [])),
            "primary_roles": _fuzzy_f1(output.get("primary_roles", []), expected.get("primary_roles", [])),
            "skills": _fuzzy_f1(output.get("skills", []), expected.get("skills", [])),
        }
        expected_years = expected.get("years_experience")
        if expected_years is not None:
            got = output.get("years_experience")
            fields["years_experience"] = 1.0 if got is not None and abs(float(got) - float(expected_years)) <= 1.0 else 0.0

        value = sum(fields.values()) / len(fields)
        worst = min(fields, key=fields.get)  # type: ignore[arg-type]
        return ScoreResult(
            name=self.name,
            value=round(value, 4),
            reason=f"mean of {len(fields)} fields; weakest: {worst}={fields[worst]:.2f}",
            metadata={"per_field": {k: round(v, 4) for k, v in fields.items()}},
        )


class FabricationRate(BaseMetric):
    """Share of tailoring-pack claims the deterministic validator flagged.

    0.0 = every claim grounded; 1.0 = nothing grounded. Reuses
    ``validate_pack`` verbatim, so offline eval and the live
    ``validate_tailoring`` node can never disagree.
    """

    def __init__(self, name: str = "fabrication_rate", track: bool = True, project_name: str | None = None):
        super().__init__(name=name, track=track, project_name=project_name)

    def score(
        self,
        pack: dict[str, Any],
        cv_text: str,
        linkedin_zip: str | None = None,
        research_notes: str | None = None,
        job_context: list[str] | None = None,
        **_: Any,
    ) -> ScoreResult:
        # Named ``pack`` (not ``output``) so it can share an evaluate() task
        # with judges whose ``output`` is the cover-letter string.
        validated = TailoringPack.model_validate(pack)
        corpus = build_corpus(cv_text, linkedin_zip)
        report = validate_pack(validated, corpus, research_notes=research_notes, job_context=job_context)
        value = report.flags / report.claims_checked if report.claims_checked else 0.0
        return ScoreResult(
            name=self.name,
            value=round(value, 4),
            reason=f"{report.flags} of {report.claims_checked} claims could not be grounded",
            metadata={"flags": report.flags, "claims_checked": report.claims_checked},
        )


# The G-Eval rubric, module-level so the online rule (docs/opik_setup.md §5)
# can copy the exact same text into the Opik UI.
FIT_EXPLANATION_TASK_INTRODUCTION = (
    "You evaluate the explanation a job-matching assistant wrote for why a job fits (or does not fit) a candidate."
)
FIT_EXPLANATION_CRITERIA = (
    "A good fit explanation: (1) cites concrete evidence from the candidate profile (skills, seniority, "
    "location) rather than generic praise; (2) honestly names gaps or mismatches instead of hiding them; "
    "(3) is consistent with the numeric fit score it accompanies; (4) mentions only skills that appear in "
    "the profile — inventing skills is a critical failure."
)


class FitExplanationQuality(BaseMetric):
    """Custom G-Eval judge for ranking explanations (unverifiable judgment).

    Thin adapter over Opik's ``GEval``: G-Eval reads only ``output``, but this
    judge needs the job + profile context to check claims, so ``score`` folds
    ``input`` (context) and ``output`` (the explanation) into one document. Its
    agreement with humans is measured in the calibration step, not assumed.
    """

    def __init__(self, model: str | None = None, name: str = "fit_explanation_quality", track: bool = True):
        super().__init__(name=name, track=track)
        self._geval = GEval(
            name=name,
            task_introduction=FIT_EXPLANATION_TASK_INTRODUCTION,
            evaluation_criteria=FIT_EXPLANATION_CRITERIA,
            model=model,
            track=False,
        )

    def score(self, input: str, output: str, **_: Any) -> ScoreResult:  # noqa: A002 - opik's standard key name
        combined = f"Job and candidate context:\n{input}\n\nFit explanation to evaluate:\n{output}"
        result = self._geval.score(output=combined)
        return ScoreResult(name=self.name, value=result.value, reason=result.reason, metadata=result.metadata)


def fit_explanation_quality(model: str | None = None) -> FitExplanationQuality:
    """Factory kept for symmetry with the other metrics."""
    return FitExplanationQuality(model=model)
