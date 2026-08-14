"""Shared test fixtures. Forces Opik off and provides mock LLMs / data."""

from __future__ import annotations

import os
from pathlib import Path
from unittest.mock import MagicMock

import pytest

# Enforce the offline test environment before anything imports settings.
# Force every network-backed source off so tests never hit an API or spend
# credits. Empty env vars override any values in a developer's local .env.
os.environ["OPIK_ENABLED"] = "false"
os.environ["OPIK_API_KEY"] = ""
os.environ["ADZUNA_APP_ID"] = ""
os.environ["ADZUNA_APP_KEY"] = ""
os.environ["JSEARCH_API_KEY"] = ""
os.environ["TAVILY_API_KEY"] = ""
os.environ["ELEVENLABS_API_KEY"] = ""
os.environ["ELEVENLABS_AGENT_ID"] = ""
os.environ.setdefault("OPENAI_API_KEY", "test-openai-key")
# Pin tunable knobs to their defaults so a developer's .env tuning
# (e.g. SCOUT_MAX_REFORMULATIONS=0 or looser validator ratios) can't
# change test behavior.
os.environ["SCOUT_MAX_JOBS"] = "10"
os.environ["SCOUT_MAX_REFORMULATIONS"] = "2"
os.environ["SCOUT_FETCH_MODEL"] = ""
os.environ["SCOUT_RANK_BATCH"] = "4"
os.environ["SCOUT_FAB_BULLET_RATIO"] = "0.65"
os.environ["SCOUT_FAB_SKILL_RATIO"] = "0.85"
os.environ["SCOUT_FAB_LETTER_RATIO"] = "0.55"

from job_scout.config import get_settings  # noqa: E402
from job_scout.graph.schemas import JobPosting, Profile  # noqa: E402

FIXTURE_CVS = Path(__file__).resolve().parent.parent / "data" / "fixture_cvs"


@pytest.fixture(autouse=True)
def _clear_settings_cache():
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


@pytest.fixture(autouse=True)
def _isolated_candidate_store(tmp_path, monkeypatch):
    """No test may touch the REAL persisted candidate (data/candidate/).

    A bare reset() call in a handler test once wiped a user's stored CV —
    every test now gets a throwaway store; per-test fixtures may re-patch.
    """
    import job_scout.candidate_store as candidate_store

    monkeypatch.setattr(candidate_store, "_STORE_DIR", tmp_path / "candidate")
    monkeypatch.setattr(candidate_store, "_STORE_PATH", tmp_path / "candidate" / "profile.json")


@pytest.fixture
def sample_profile() -> Profile:
    return Profile(
        name="Test Candidate",
        seniority="mid",
        primary_roles=["Data Scientist", "ML Engineer"],
        skills=["python", "sql", "scikit-learn", "pandas"],
        years_experience=3.0,
        locations=["Berlin, Germany"],
        languages=["English"],
        remote_ok=True,
        raw_summary="A mid-level data scientist.",
    )


def make_job(job_id: str, title: str, company: str, source: str = "cache", remote: bool = False) -> JobPosting:
    return JobPosting(
        job_id=job_id,
        title=title,
        company=company,
        location="Berlin",
        remote=remote,
        description=f"{title} role needing python and sql.",
        url="https://example.com",
        tags=["data"],
        source=source,
    )


@pytest.fixture
def sample_jobs() -> list[JobPosting]:
    return [
        make_job("j1", "Data Scientist", "Acme"),
        make_job("j2", "ML Engineer", "Globex"),
        make_job("j3", "Data Analyst", "Initech"),
    ]


def structured_llm(return_value) -> MagicMock:
    """A MagicMock chat model whose .with_structured_output(...).invoke() returns value."""
    llm = MagicMock()
    structured = MagicMock()
    structured.invoke.return_value = return_value
    llm.with_structured_output.return_value = structured
    return llm


def tool_calling_llm(tool_calls: list[dict]) -> MagicMock:
    """A MagicMock chat model whose .bind_tools(...).invoke() returns a message with tool_calls."""
    llm = MagicMock()
    bound = MagicMock()
    message = MagicMock()
    message.tool_calls = tool_calls
    bound.invoke.return_value = message
    llm.bind_tools.return_value = bound
    return llm


def plain_llm(content: str) -> MagicMock:
    """A MagicMock chat model whose .invoke().content returns a string."""
    llm = MagicMock()
    message = MagicMock()
    message.content = content
    llm.invoke.return_value = message
    return llm
