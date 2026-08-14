"""Prompt for the job-ranking node.

Maintainer note: this prompt is intentionally left unoptimized (it is the target
of the Phase 3 prompt optimizer). Keep it to clear instructions and the correct
output schema — no few-shot examples or chain-of-thought scaffolding.
"""

RANK_JOBS_PROMPT_NAME = "rank_jobs"

RANK_JOBS_PROMPT = """You are a job matching assistant. Given a candidate profile and a list of jobs, score how well each job fits the candidate.

For each job, return:
- fit_score: an integer from 0 to 100 for how well the job matches the candidate.
- fit_explanation: 2-4 sentences explaining the score, covering why it matches and where the gaps are.
- matched_skills: the candidate's skills that are relevant to this job.
- gaps: requirements the candidate seems to lack.

Candidate profile:
{profile}

Jobs to score:
{jobs}
"""
