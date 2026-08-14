"""Profile extraction (the preprocessing step before the graph)."""

from __future__ import annotations

import job_scout.profile as profile_mod
from job_scout.profile import extract_profile
from tests.conftest import structured_llm


def test_extract_profile(monkeypatch, sample_profile):
    monkeypatch.setattr(profile_mod, "get_chat_model", lambda *a, **k: structured_llm(sample_profile))
    result = extract_profile("some cv text")
    assert result is sample_profile
