"""Optional company research via Tavily (Phase 2).

One search per tailor run, used to ground company facts in the cover letter.
Strictly optional: keyless environments skip it entirely, and any failure
degrades to ``None`` — research must never fail a run. The raw result text is
stored in state (``research_notes``) so it is visible verbatim in the trace,
and the fabrication validator counts company claims not traceable to it.
"""

from __future__ import annotations

import httpx

from job_scout.config import get_settings

_TAVILY_URL = "https://api.tavily.com/search"
_MAX_RESULTS = 3


def research_company(company: str, *, timeout_s: float = 10.0) -> str | None:
    """Search Tavily for a company overview. Returns raw text, or ``None``.

    ``None`` means "no research available" (no key, network error, empty
    results) and callers must treat it as a normal, silent degradation.
    """
    settings = get_settings()
    if not settings.has_tavily or not company.strip():
        return None
    try:
        response = httpx.post(
            _TAVILY_URL,
            json={
                "api_key": settings.tavily_api_key.get_secret_value(),
                "query": f"{company} company overview products",
                "max_results": _MAX_RESULTS,
            },
            timeout=timeout_s,
        )
        response.raise_for_status()
        results = response.json().get("results", [])
    except (httpx.HTTPError, ValueError):
        return None

    chunks = []
    for result in results[:_MAX_RESULTS]:
        title = (result.get("title") or "").strip()
        content = (result.get("content") or "").strip()
        if title or content:
            chunks.append(f"{title}: {content}" if title else content)
    return "\n".join(chunks) or None
