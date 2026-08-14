"""Fabrication validator: grounding checks, thresholds, degradation modes."""

from __future__ import annotations

from job_scout.config import get_settings
from job_scout.corpus import CandidateCorpus, CorpusItem, build_corpus
from job_scout.graph.schemas import CVContent, ExperienceEntry, TailoredBullet, TailoringPack
from job_scout.validation import validate_pack
from tests.test_corpus import SAMPLE_CV


def _corpus():
    return build_corpus(SAMPLE_CV)


def _pack(
    bullets: list[TailoredBullet], skills: list[str] | None = None, letter: str = "Dear team,\nBest, Jane"
) -> TailoringPack:
    return TailoringPack(
        cv=CVContent(
            headline="Data Engineer",
            summary="Builds pipelines.",
            experience=[ExperienceEntry(role="Data Engineer", company="PipeCorp", dates="2022-2026", bullets=bullets)],
            skills=skills if skills is not None else ["Python"],
        ),
        cover_letter=letter,
    )


def test_threshold_defaults_are_documented():
    # Changing a default should be a conscious diff, not a drive-by tweak.
    # (Env-tunable via SCOUT_FAB_*; Phase 2 baselines ran at 0.75/0.9/0.55.)
    settings = get_settings()
    assert settings.fab_bullet_ratio == 0.65
    assert settings.fab_skill_ratio == 0.85
    assert settings.fab_letter_ratio == 0.55


def test_thresholds_are_recorded_in_the_report():
    report = validate_pack(_pack([]), _corpus())
    assert report.thresholds == {"bullet": 0.65, "skill": 0.85, "letter": 0.55}


def test_thresholds_are_env_tunable(monkeypatch):
    monkeypatch.setenv("SCOUT_FAB_BULLET_RATIO", "0.99")
    get_settings.cache_clear()
    bullet = TailoredBullet(text="Built streaming ingestion pipelines handling 2M events/day", corpus_ref="cv-bullet-002")
    report = validate_pack(_pack([bullet]), _corpus())
    assert report.flags == 1  # the same close rewrite that passes at the default


def test_close_rewrite_passes():
    # cv-bullet-002: "Built streaming ingestion handling 2M events/day."
    bullet = TailoredBullet(text="Built streaming ingestion pipelines handling 2M events/day", corpus_ref="cv-bullet-002")
    report = validate_pack(_pack([bullet]), _corpus())
    assert report.flags == 0


def test_fabricated_bullet_is_flagged():
    bullet = TailoredBullet(text="Led a 30-person org and shipped a self-driving car", corpus_ref="cv-bullet-002")
    report = validate_pack(_pack([bullet]), _corpus())
    assert report.flags == 1
    assert report.flagged[0].where == "cv_bullet:cv-bullet-002"
    assert report.flagged[0].best_match_ratio < get_settings().fab_bullet_ratio


def test_unresolvable_corpus_ref_is_flagged():
    bullet = TailoredBullet(text="Built streaming ingestion handling 2M events/day.", corpus_ref="cv-bullet-999")
    report = validate_pack(_pack([bullet]), _corpus())
    assert report.flags == 1
    assert "does not resolve" in report.flagged[0].reason


def test_skill_outside_corpus_is_flagged():
    report = validate_pack(_pack([], skills=["Python", "Kubernetes"]), _corpus())
    assert report.flags == 1
    assert report.flagged[0].where == "skill:Kubernetes"


def test_skill_normalization_tolerates_case():
    report = validate_pack(_pack([], skills=["python", "SQL"]), _corpus())
    assert report.flags == 0


def _corpus_without_skills_section() -> CandidateCorpus:
    return CandidateCorpus(
        items=[
            CorpusItem(
                id="cv-bullet-001",
                text="Built Python and PySpark pipelines on AWS Bedrock",
                kind="bullet",
                source="cv",
                section="Experience",
            )
        ]
    )


def test_skills_ground_in_full_text_when_no_skills_section_parsed():
    # A CV whose layout defeats the skills-section heuristic must not flag
    # every skill at 0.00 against an empty vocabulary.
    report = validate_pack(_pack([], skills=["Python, PySpark", "AWS Bedrock"]), _corpus_without_skills_section())
    assert report.flags == 0


def test_ungrounded_skill_still_flagged_without_skills_section():
    report = validate_pack(_pack([], skills=["Kubernetes"]), _corpus_without_skills_section())
    assert report.flags == 1
    assert "no skills section was parsed" in report.flagged[0].reason
    assert "kubernetes" in report.flagged[0].reason


def test_cover_letter_invented_metric_is_flagged():
    letter = "Dear team,\nI increased revenue by 300% at Google Cloud last year.\nBest regards, Jane"
    report = validate_pack(_pack([], letter=letter), _corpus())
    assert report.flags == 1
    assert report.flagged[0].where.startswith("cover_letter:sentence:")


def test_cover_letter_grounded_in_corpus_passes():
    letter = "Dear team,\nI built streaming ingestion handling 2M events/day at PipeCorp.\nBest regards, Jane"
    report = validate_pack(_pack([], letter=letter), _corpus())
    assert report.flags == 0


def test_cover_letter_grounded_in_research_passes():
    letter = "Dear team,\nI admire that Acme Rockets launched 12 missions in 2025.\nBest regards, Jane"
    research = "Acme Rockets launched 12 missions in 2025 and builds reusable boosters."
    flagged_without = validate_pack(_pack([], letter=letter), _corpus())
    passed_with = validate_pack(_pack([], letter=letter), _corpus(), research_notes=research)
    assert flagged_without.flags == 1
    assert passed_with.flags == 0


def test_cover_letter_job_context_not_flagged():
    letter = "Dear team,\nI am excited to apply for the Data Engineer role at Initech Systems in Berlin.\nBest regards, Jane"
    job_context = ["Data Engineer at Initech Systems", "Initech Systems"]
    report = validate_pack(_pack([], letter=letter), _corpus(), job_context=job_context)
    assert report.flags == 0


def test_non_factual_sentences_are_skipped():
    letter = "Dear team,\nI am deeply passionate about building wonderful things together with kind people.\nBest regards, Jane"
    report = validate_pack(_pack([], letter=letter), _corpus())
    assert report.flags == 0


def test_greeting_and_signoff_are_never_checked():
    letter = "Dear Initech Systems hiring team of 500 engineers!\nSincerely, Jane Doe, 42nd applicant"
    report = validate_pack(_pack([], letter=letter), _corpus())
    assert report.flags == 0


def test_unit_spelling_rewrite_is_not_flagged():
    """Phase 3 #8: '10M requests/day' and '10 million requests per day' are one claim."""
    corpus = CandidateCorpus(
        items=[
            CorpusItem(
                id="cv-bullet-001",
                text="Designed a real-time recommendation service handling 10M requests/day.",
                kind="bullet",
                source="cv",
                section="Experience",
            )
        ]
    )
    pack = _pack(
        [
            TailoredBullet(
                text="Designed a real-time recommendation service handling 10 million requests daily", corpus_ref="cv-bullet-001"
            )
        ],
        skills=[],
    )
    report = validate_pack(pack, corpus)
    assert report.flags == 0


def test_skill_subset_of_corpus_skill_passes():
    """Phase 3 #8: claiming less than the corpus states is honest ('AWS' vs 'basic AWS')."""
    corpus = CandidateCorpus(items=[CorpusItem(id="cv-skill-001", text="basic AWS", kind="skill", source="cv", section="Skills")])
    ok = _pack([], skills=["AWS"])
    assert validate_pack(ok, corpus).flags == 0

    inflated = _pack([], skills=["advanced AWS solution architecture"])
    report = validate_pack(inflated, corpus)
    assert report.flags == 1 and report.flagged[0].where == "skill:advanced AWS solution architecture"


def test_compositional_letter_claim_passes_via_pair():
    """Phase 3 #9: a true sentence assembled from two corpus items is not a fabrication."""
    corpus = CandidateCorpus(
        items=[
            CorpusItem(
                id="cv-summary-001",
                text="1.5 years of experience as a Data Analyst at BrightRetail Inc.",
                kind="summary",
                source="cv",
                section="Summary",
            ),
            CorpusItem(
                id="cv-bullet-001",
                text="Built forecasting models for retail demand planning.",
                kind="bullet",
                source="cv",
                section="Experience",
            ),
        ]
    )
    letter = (
        "Dear team,\n"
        "With 1.5 years of experience as a Data Analyst at BrightRetail Inc, I built forecasting models for retail demand.\n"
        "Kind regards, Jane"
    )
    pack = _pack([], skills=[], letter=letter)
    report = validate_pack(pack, corpus)
    assert report.flags == 0
