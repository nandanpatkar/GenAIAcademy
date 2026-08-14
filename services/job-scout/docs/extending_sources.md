# Extending job sources

Job Scout fetches postings through a small, pluggable interface. The agent only
ever sees **one** LangChain tool, `search_jobs`; behind it, a `JobSource`
adapter (or several, merged) does the actual fetching. This doc shows how to add
a new source and explains why scraping-based sources are deliberately excluded.

## The `JobSource` protocol

```python
class JobSource(Protocol):
    name: str
    def fetch(
        self, query: str, location: str | None, country: str | None,
        remote: bool, limit: int,
    ) -> list[JobPosting]: ...
```

Contract:

- **Never raise on a network/parse error.** Return an empty list instead, so the
  orchestrator (`run_search`) can fall through to the next source and ultimately
  to the committed cache. A raising adapter would break offline reproducibility.
- **Normalize into `JobPosting`.** Map the provider's fields onto our schema
  (`job_id`, `title`, `company`, `location`, `remote`, `description`, `url`,
  `tags`, `source`). Prefix `job_id` with the source name to avoid collisions.
- **Truncate descriptions** to `DESCRIPTION_LIMIT` (4000 chars).

The three shipped adapters live in `src/job_scout/tools/jobs_api.py`:
`AdzunaSource` (primary, international, needs free keys), `RemotiveSource`
(keyless, remote-only) and `CacheSource` (the committed offline dataset).

## Worked example: adding a hypothetical official API

Say "JobsCoAPI" offers an official REST endpoint with an API key.

```python
class JobsCoSource:
    name = "jobsco"
    BASE = "https://api.jobsco.example/v1/search"

    def __init__(self, api_key: str = "") -> None:
        self.api_key = api_key or get_settings().jobsco_api_key.get_secret_value()

    @property
    def available(self) -> bool:
        return bool(self.api_key)

    def fetch(self, query, location, country, remote, limit) -> list[JobPosting]:
        if not self.available:
            return []
        try:
            resp = httpx.get(
                self.BASE,
                params={"q": query, "loc": location, "limit": limit},
                headers={"Authorization": f"Bearer {self.api_key}"},
                timeout=10.0,
            )
            resp.raise_for_status()
            rows = resp.json().get("results", [])
        except (httpx.HTTPError, ValueError):
            return []
        return [
            JobPosting(
                job_id=f"jobsco-{r['id']}",
                title=r["title"],
                company=r["employer"],
                location=r.get("location", ""),
                remote=r.get("remote", False),
                description=(r.get("description") or "")[:DESCRIPTION_LIMIT],
                url=r.get("apply_url", ""),
                tags=r.get("skills", []),
                source="jobsco",  # add to the JobSourceName Literal in schemas.py
            )
            for r in rows
        ]
```

Then wire it into `run_search(...)` in the order you want it tried, add its key
to `config.py` + `.env.example`, and extend the `JobSourceName` literal in
`schemas.py`. That's it — the agent's tool signature does not change.

## Why no scrapers

This repo will not include LinkedIn/Indeed scrapers or third-party scraping
actors (e.g. Apify LinkedIn actors), **even as optional adapters**:

- It violates those platforms' Terms of Service.
- It risks readers' own accounts being flagged or banned.
- It costs credits and is brittle, breaking reproducibility for the course.

If you wire up a scraper privately, you accept those risks yourself. The
supported, reproducible path is official APIs behind the `JobSource` interface.
