"""Persist the candidate between app runs: CV text, typed profile, preferences.

The two kinds of session state have opposite lifetimes, and the store honors
that split: the CANDIDATE (and their chosen search locations) changes rarely,
so it survives restarts; JOBS go stale daily, so search results are
deliberately never persisted — every session fetches fresh.

``preferences`` is the human's answer to "where should we search?" —
``{"locations": [...], "remote": bool}``. It lives NEXT TO the profile rather
than inside it: the profile is what the extractor measured, the preferences
are what the person chose, and evaluation only ever grades the former.

Stored as one JSON file under ``data/candidate/`` (gitignored — it is personal
data). Loading never raises: a missing or corrupt file simply means "no saved
candidate" and the wizard starts from step 1. Version-1 files (no preferences)
load with ``preferences=None``; callers fall back to the profile's own hints.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import NamedTuple

from job_scout.graph.schemas import Profile

_STORE_DIR = Path(__file__).resolve().parents[2] / "data" / "candidate"
_STORE_PATH = _STORE_DIR / "profile.json"


class StoredCandidate(NamedTuple):
    """One saved candidate: what was extracted, plus what the human chose."""

    profile: Profile
    cv_text: str
    preferences: dict | None  # {"locations": [...], "remote": bool}; None on v1 files


def save_candidate(profile: Profile, cv_text: str, preferences: dict | None = None) -> None:
    """Persist the candidate, replacing any previous one."""
    _STORE_DIR.mkdir(parents=True, exist_ok=True)
    payload = {"version": 2, "profile": profile.model_dump(), "cv_text": cv_text, "preferences": preferences}
    _STORE_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def load_candidate() -> StoredCandidate | None:
    """The stored candidate, or None (never raises)."""
    try:
        payload = json.loads(_STORE_PATH.read_text(encoding="utf-8"))
        profile = Profile.model_validate(payload["profile"])
        return StoredCandidate(profile, str(payload["cv_text"]), payload.get("preferences"))
    except (OSError, ValueError, KeyError):
        return None


def clear_candidate() -> None:
    """Forget the stored candidate (the wizard's "start over")."""
    _STORE_PATH.unlink(missing_ok=True)


def effective_profile(profile: Profile, preferences: dict | None) -> Profile:
    """The profile the SEARCH sees: extraction fields overridden by the human's choice.

    The stored profile stays untouched — it is what the extractor measured and
    what evaluation grades. Only the search runs on the chosen locations.
    """
    if not preferences:
        return profile
    return profile.model_copy(
        update={"locations": list(preferences.get("locations") or []), "remote_ok": bool(preferences.get("remote"))}
    )
