"""Jobs tool: adapter behaviour, fallback ordering, dedupe/cap."""

from __future__ import annotations

from unittest.mock import MagicMock

import httpx

from job_scout.tools.jobs_api import (
    AdzunaSource,
    CacheSource,
    JSearchSource,
    location_to_country,
    run_search,
)
from tests.conftest import make_job


def _fake_source(name, jobs):
    src = MagicMock()
    src.name = name
    src.fetch.return_value = jobs
    return src


def test_location_to_country_mapping():
    assert location_to_country("Berlin, Germany") == "de"
    assert location_to_country("San Francisco, USA") == "us"
    assert location_to_country("Bengaluru, India") == "in"
    assert location_to_country("Sydney") == "au"
    assert location_to_country("Atlantis") == "us"  # unmappable -> default
    assert location_to_country(None) == "us"


def test_adzuna_unavailable_without_keys():
    src = AdzunaSource(app_id="", app_key="")
    assert src.available is False
    assert src.fetch("data scientist", None, "us", False, 10) == []


def test_falls_back_to_cache_when_live_sources_empty():
    adzuna = _fake_source("adzuna", [])
    remotive = _fake_source("remotive", [])
    cache = _fake_source("cache", [make_job("c1", "Data Scientist", "CacheCorp")])
    jobs, used = run_search("data scientist", adzuna=adzuna, remotive=remotive, cache=cache)
    assert used == ["cache"]
    assert len(jobs) == 1


def test_cache_not_used_when_live_results_sufficient():
    adzuna = _fake_source("adzuna", [make_job(f"a{i}", f"Role {i}", f"Co{i}", "adzuna") for i in range(6)])
    remotive = _fake_source("remotive", [])
    cache = _fake_source("cache", [make_job("c1", "X", "Y")])
    jobs, used = run_search("data scientist", adzuna=adzuna, remotive=remotive, cache=cache)
    assert used == ["adzuna"]
    cache.fetch.assert_not_called()


def test_remotive_queried_when_adzuna_thin():
    adzuna = _fake_source("adzuna", [make_job("a1", "One", "Co", "adzuna")])
    remotive = _fake_source("remotive", [make_job(f"r{i}", f"R{i}", f"Ro{i}", "remotive", True) for i in range(4)])
    cache = _fake_source("cache", [])
    jobs, used = run_search("data scientist", adzuna=adzuna, remotive=remotive, cache=cache)
    assert used == ["adzuna", "remotive"]
    remotive.fetch.assert_called_once()


def test_remotive_queried_when_remote_requested():
    adzuna = _fake_source("adzuna", [make_job(f"a{i}", f"Role {i}", f"Co{i}", "adzuna") for i in range(6)])
    remotive = _fake_source("remotive", [make_job("r1", "Remote DS", "RemoteCo", "remotive", True)])
    cache = _fake_source("cache", [])
    jobs, used = run_search("ds", remote=True, adzuna=adzuna, remotive=remotive, cache=cache)
    assert "remotive" in used


def test_dedupe_by_title_company():
    dup = [make_job("a1", "Data Scientist", "Acme", "adzuna")] * 3
    adzuna = _fake_source("adzuna", dup + [make_job(f"a{i}", f"R{i}", f"C{i}", "adzuna") for i in range(5)])
    jobs, _ = run_search("ds", adzuna=adzuna, remotive=_fake_source("r", []), cache=_fake_source("c", []))
    keys = [(j.title, j.company) for j in jobs]
    assert len(keys) == len(set(keys))


def test_result_cap():
    many = [make_job(f"a{i}", f"Role {i}", f"Co{i}", "adzuna") for i in range(40)]
    adzuna = _fake_source("adzuna", many)
    jobs, _ = run_search("ds", limit=25, adzuna=adzuna, remotive=_fake_source("r", []), cache=_fake_source("c", []))
    assert len(jobs) == 25


def test_jsearch_unavailable_without_key():
    src = JSearchSource(api_key="")
    assert src.available is False
    assert src.fetch("data scientist", "Berlin", "de", False, 10) == []


def test_source_failure_is_logged_not_swallowed(respx_mock, caplog):
    """An exhausted quota must not look like a quiet day in the job market.

    Returning [] is still the right behaviour — the cascade depends on it — but
    returning it *silently* made HTTP 429, a rejected key and a genuine
    zero-result search indistinguishable from outside.
    """
    respx_mock.get("https://api.openwebninja.com/jsearch/search-v2").mock(
        return_value=httpx.Response(429, json={"error": {"message": "Too Many Requests"}})
    )
    src = JSearchSource(api_key="k")
    with caplog.at_level("WARNING"):
        assert src.fetch("data scientist", "Berlin", "de", False, 10) == []
    assert "jsearch" in caplog.text
    assert "429" in caplog.text and "quota exhausted" in caplog.text


def test_source_failure_names_a_rejected_key(respx_mock, caplog):
    respx_mock.get("https://api.openwebninja.com/jsearch/search-v2").mock(return_value=httpx.Response(401, json={}))
    with caplog.at_level("WARNING"):
        assert JSearchSource(api_key="k").fetch("x", "Berlin", "de", False, 10) == []
    assert "key rejected" in caplog.text


def test_jsearch_builds_location_query_and_maps_fields(respx_mock):
    payload = {
        "data": {
            "cursor": "next-page-token",
            "jobs": [
                {
                    "job_id": "abc",
                    "job_title": "Data Scientist",
                    "employer_name": "Acme GmbH",
                    "job_location": "Berlin • über Stepstone",
                    "job_city": None,
                    "job_country": None,
                    "job_is_remote": False,
                    "job_description": "python and sql",
                    "job_apply_link": "https://example.com/apply",
                    "job_employment_type": "FULLTIME",
                }
            ],
        }
    }
    route = respx_mock.get("https://api.openwebninja.com/jsearch/search-v2").mock(return_value=httpx.Response(200, json=payload))
    src = JSearchSource(api_key="test-key")
    jobs = src.fetch("data scientist", "Berlin, Germany", "de", False, 10)
    # location folded into the query, country passed through
    sent = route.calls.last.request
    assert "in Berlin, Germany" in sent.url.params["query"]
    assert sent.url.params["country"] == "de"
    assert sent.headers["X-API-Key"] == "test-key"
    # fields mapped; publisher attribution stripped from location
    assert jobs[0].title == "Data Scientist"
    assert jobs[0].company == "Acme GmbH"
    assert jobs[0].location == "Berlin"
    assert jobs[0].source == "jsearch"


def test_jsearch_primary_when_available():
    jsearch = MagicMock()
    jsearch.available = True
    jsearch.fetch.return_value = [make_job(f"js{i}", f"Role {i}", f"Co{i}", "jsearch") for i in range(6)]
    adzuna = _fake_source("adzuna", [make_job("a1", "X", "Y", "adzuna")])
    jobs, used = run_search(
        "ds",
        location="Berlin",
        jsearch=jsearch,
        adzuna=adzuna,
        remotive=_fake_source("r", []),
        cache=_fake_source("c", []),
    )
    assert used == ["jsearch"]
    # Since Phase 3 sources fire concurrently; "skipped" means not CONSUMED.
    assert all(job.source != "adzuna" for job in jobs)


def test_cache_source_keyword_match(tmp_path):
    import json

    data = [
        {
            "job_id": "1",
            "title": "Machine Learning Engineer",
            "company": "A",
            "location": "US",
            "remote": False,
            "description": "pytorch and python",
            "url": "",
            "tags": ["ml"],
            "source": "cache",
        },
        {
            "job_id": "2",
            "title": "Chef",
            "company": "B",
            "location": "US",
            "remote": False,
            "description": "cooking",
            "url": "",
            "tags": [],
            "source": "cache",
        },
    ]
    path = tmp_path / "cache.json"
    path.write_text(json.dumps(data))
    src = CacheSource(path=path)
    jobs = src.fetch("machine learning python", None, None, False, 10)
    assert jobs[0].title == "Machine Learning Engineer"
    assert jobs[0].source == "cache"


def test_concurrent_fanout_preserves_cascade_priority(monkeypatch):
    """Phase 3: sources are queried concurrently, consumed in cascade order."""

    class Fake:
        available = True

        def __init__(self, name, found):
            self.name, self.found, self.calls = name, found, 0

        def fetch(self, *a, **k):
            self.calls += 1
            return self.found

    rich = [make_job(f"jsearch-{i}", f"Job {i}", f"Co {i}") for i in range(6)]
    js, ad, rm = (
        Fake("jsearch", rich),
        Fake("adzuna", [make_job("a-1", "A", "ACo")]),
        Fake("remotive", [make_job("r-1", "R", "RCo")]),
    )
    jobs, used = run_search("q", jsearch=js, adzuna=ad, remotive=rm, cache=Fake("cache", []))
    # jsearch was rich: adzuna/remotive results are FETCHED (fired concurrently) but not consumed
    assert used == ["jsearch"]
    assert [j.job_id for j in jobs[:6]] == [f"jsearch-{i}" for i in range(6)]


def test_sequential_mode_skips_lower_sources_entirely(monkeypatch):
    monkeypatch.setenv("SCOUT_CONCURRENT_SOURCES", "false")
    from job_scout.config import get_settings

    get_settings.cache_clear()

    class Fake:
        available = True

        def __init__(self, found):
            self.found, self.calls = found, 0

        def fetch(self, *a, **k):
            self.calls += 1
            return self.found

    rich = [make_job(f"jsearch-{i}", f"Job {i}", f"Co {i}") for i in range(6)]
    js, ad, rm = Fake(rich), Fake([make_job("a-1", "A", "ACo")]), Fake([make_job("r-1", "R", "RCo")])
    jobs, used = run_search("q", jsearch=js, adzuna=ad, remotive=rm, cache=Fake([]))
    assert used == ["jsearch"] and ad.calls == 0 and rm.calls == 0
