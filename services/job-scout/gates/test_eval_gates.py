"""Regression gates over the evaluation numbers (Phase 3).

Two layers, split by Phase 2's two-kinds-of-truth line:

- The DETERMINISTIC gate here: re-validate the tailoring dataset's stored
  packs with the live corpus+validator stack and assert the fabrication rate
  never regresses past the Phase 3 paired measurement (0.2500 at the shipped
  thresholds) plus a small margin. Zero LLM calls, but it needs Opik access
  to fetch the dataset — which is why this lives OUTSIDE tests/ (the shared
  conftest deliberately blanks all keys). Run it with `make gates`.
- The JUDGED gate lives in scripts/setup_test_suite.py (Opik Test Suite),
  because judged assertions are opinions and belong in the dashboard, not in
  a pass/fail exit code you trust blindly.

The gate value is a measured ceiling, not an aspiration: move it only with a
new paired measurement in docs/phase3_findings.md.
"""

from __future__ import annotations

import pytest

# Paired revalidation of the 15 stored Phase 2 packs (docs/phase3_findings.md):
# v2 stack measured 0.2500 (61/244). Margin covers dataset drift, not code drift.
GATE_FABRICATION_RATE = 0.27


@pytest.fixture(scope="module")
def opik_client():
    from job_scout.config import get_settings

    if not get_settings().has_opik:
        pytest.skip("gate needs Opik access (OPIK_API_KEY in .env)")
    import opik

    from job_scout.tracing import configure_opik

    configure_opik()
    return opik.Opik()


def test_stored_packs_stay_under_the_fabrication_gate(opik_client):
    from job_scout.corpus import build_corpus
    from job_scout.graph.schemas import TailoringPack
    from job_scout.validation import validate_pack

    items = opik_client.get_dataset("job-scout-tailoring-cases").get_items()
    flags = claims = 0
    for item in items:
        if not item.get("pack") or not item.get("cv_text"):
            continue
        pack = TailoringPack.model_validate(item["pack"])
        context = [f"{item.get('job_title', '')} at {item.get('job_company', '')}", item.get("job_company", "")]
        report = validate_pack(pack, build_corpus(item["cv_text"]), job_context=context)
        flags += report.flags
        claims += report.claims_checked

    assert claims >= 200, f"dataset shrank unexpectedly ({claims} claims) — gate would be meaningless"
    rate = flags / claims
    assert rate <= GATE_FABRICATION_RATE, (
        f"fabrication rate regressed: {rate:.4f} ({flags}/{claims}) > gate {GATE_FABRICATION_RATE} — "
        "either the validator/corpus got stricter (update the gate with a new paired "
        "measurement in docs/phase3_findings.md) or a change made packs less grounded"
    )
