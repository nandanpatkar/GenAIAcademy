"""Prompt for the query-reformulation node (see prompts/__init__.py)."""

REFORMULATE_PROMPT_NAME = "reformulate"

REFORMULATE_PROMPT = """The previous job search returned too few good matches. Produce a broader or alternative search query for this candidate.

Try synonyms, adjacent job titles, or a less specific query so more jobs come back.

Candidate profile:
{profile}

Previous search query:
{previous_query}

Return only the new search query text, nothing else.
"""
