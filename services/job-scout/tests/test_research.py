"""research_company: keyless skip, happy path, and silent degradation."""

from __future__ import annotations

import httpx

from job_scout.tools.research import _TAVILY_URL, research_company


def _with_key(monkeypatch):
    monkeypatch.setenv("TAVILY_API_KEY", "test-tavily-key")
    from job_scout.config import get_settings

    get_settings.cache_clear()


def test_keyless_returns_none_without_http(respx_mock):
    # conftest forces TAVILY_API_KEY="" — no route registered, so any HTTP
    # call would raise; returning None proves the call was never made.
    assert research_company("Acme") is None


def test_happy_path_concatenates_results(monkeypatch, respx_mock):
    _with_key(monkeypatch)
    respx_mock.post(_TAVILY_URL).mock(
        return_value=httpx.Response(
            200,
            json={
                "results": [
                    {"title": "Acme", "content": "Acme builds rockets."},
                    {"title": "", "content": "Founded in 1999."},
                ]
            },
        )
    )
    notes = research_company("Acme")
    assert "Acme builds rockets." in notes
    assert "Founded in 1999." in notes


def test_server_error_returns_none(monkeypatch, respx_mock):
    _with_key(monkeypatch)
    respx_mock.post(_TAVILY_URL).mock(return_value=httpx.Response(500))
    assert research_company("Acme") is None


def test_network_error_returns_none(monkeypatch, respx_mock):
    _with_key(monkeypatch)
    respx_mock.post(_TAVILY_URL).mock(side_effect=httpx.ConnectError("boom"))
    assert research_company("Acme") is None


def test_empty_results_returns_none(monkeypatch, respx_mock):
    _with_key(monkeypatch)
    respx_mock.post(_TAVILY_URL).mock(return_value=httpx.Response(200, json={"results": []}))
    assert research_company("Acme") is None


def test_blank_company_returns_none(monkeypatch, respx_mock):
    _with_key(monkeypatch)
    assert research_company("   ") is None
