"""Pydantic models used across the agent graph.

These are the structured-output targets for the LLM/tool calls and the shared
data contracts the nodes read and write.

Phase 2 note: the Phase 1 ``TailoringPack`` stub (a flat "emphasis brief") was
replaced by the corpus-grounded v2 models below. That is a breaking change to
the checkpoint format, and it is safe only because the sole checkpointer is an
in-process ``MemorySaver``: no checkpoint survives a restart and no Phase 1
code path ever wrote ``tailoring`` into a thread. With a persistent
checkpointer (e.g. Postgres) this would have required a real migration.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

Seniority = Literal["junior", "mid", "senior", "lead", "unknown"]
JobSourceName = Literal["jsearch", "adzuna", "remotive", "cache"]


class Profile(BaseModel):
    """Structured candidate profile extracted from a CV."""

    name: str | None = None
    seniority: Seniority = "unknown"
    primary_roles: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    years_experience: float | None = None
    locations: list[str] = Field(default_factory=list)
    languages: list[str] = Field(default_factory=list)
    remote_ok: bool = False
    raw_summary: str = ""


class JobPosting(BaseModel):
    """A single job opening, normalized across all sources."""

    job_id: str
    title: str
    company: str
    location: str
    remote: bool = False
    description: str = ""
    url: str = ""
    tags: list[str] = Field(default_factory=list)
    source: JobSourceName


class JobScore(BaseModel):
    """The ranking LLM's score for one job, keyed back to a posting by id."""

    job_id: str
    fit_score: int = Field(ge=0, le=100)
    fit_explanation: str
    matched_skills: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)


class JobScores(BaseModel):
    """Structured-output container for a batch of ``JobScore``."""

    scores: list[JobScore]


class RankedJob(BaseModel):
    """A job scored against the candidate profile."""

    job: JobPosting
    fit_score: int = Field(ge=0, le=100)
    fit_explanation: str
    matched_skills: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)


class TailoredBullet(BaseModel):
    """One CV bullet reworded for the target job.

    ``corpus_ref`` is required: every bullet must point at the ``CorpusItem``
    it derives from, so the fabrication validator can check the rewrite against
    the candidate's real experience.
    """

    text: str
    corpus_ref: str


class ExperienceEntry(BaseModel):
    """One role in the tailored CV's experience section."""

    role: str
    company: str
    dates: str = ""
    bullets: list[TailoredBullet] = Field(default_factory=list)


class CVContent(BaseModel):
    """The tailored CV: selected and reworded content, never invented."""

    headline: str
    summary: str
    experience: list[ExperienceEntry] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    education: list[str] = Field(default_factory=list)


class TailoringPack(BaseModel):
    """Application material generated for a selected job (Phase 2).

    The cover letter should stay under 350 words and reference at least two
    specific job requirements; the honesty note names real gaps the candidate
    should not paper over. Both are prompt contracts, enforced by evaluation
    rather than validation.
    """

    cv: CVContent
    cover_letter: str
    honesty_note: str = ""


class FlaggedClaim(BaseModel):
    """One statement the fabrication validator could not ground in the corpus."""

    where: str  # "cv_bullet:<corpus_ref>" | "skill:<name>" | "cover_letter:sentence:<n>"
    text: str
    reason: str
    best_match_ratio: float = 0.0


class FabricationReport(BaseModel):
    """Deterministic validator output: flagged claims, never a retry signal.

    ``claims_checked`` counts every claim the validator examined (bullets,
    skills, factual cover-letter sentences) so a fabrication *rate* is
    well-defined: ``flags / claims_checked``.
    """

    flags: int = 0
    claims_checked: int = 0
    flagged: list[FlaggedClaim] = Field(default_factory=list)
    # The knob values this report ran with — recorded so every trace states
    # what produced the flags, making threshold tuning measurable in Opik.
    thresholds: dict[str, float] = Field(default_factory=dict)
