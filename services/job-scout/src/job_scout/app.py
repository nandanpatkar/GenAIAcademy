"""Gradio UI for Job Scout.

A four-step wizard with a refined editorial look: warm-paper background with a
faint gradient-and-grain wash, a display serif (Fraunces) paired with a mono for
data (IBM Plex Mono), emerald accent. The flow is (1) drop your resume,
(2) review the extracted profile and choose where to search (the human decides
locations and remote, not the model), (3) find jobs — ranked as cards with a
conic-gauge fit score, matched-skill chips, and honest gaps — and (4) tailor an
application for a selected job: cover letter + reworded CV, every claim checked
against the resume, downloadable as PDF/.tex.

Jobvis, the voice concierge, is a separate surface now (job_scout.api serves it
on :8000) — the wizard just links to it. What stays here is the sync: a run
started by voice lands on these pages through the 1s Timer, and a click here
whispers a screen event to whoever is listening on the console.
"""

from __future__ import annotations

import tempfile
from html import escape
from pathlib import Path
from uuid import uuid4

import gradio as gr

from job_scout import candidate_store
from job_scout.graph.schemas import Profile, RankedJob
from job_scout.profile import extract_profile
from job_scout.renderer import render_pdf
from job_scout.runner import RunResult, TailorResult, stream_search, stream_tailor
from job_scout.tools.cv_reader import CVReadError, extract_cv_text
from job_scout.tracing import opik_url, register_prompts
from job_scout.voice import bridge as voice_bridge
from job_scout.voice import is_voice_available

CAPTION = "Prepares applications — never submits them."

INTRO_HTML = """
<p class="js-lead">Drop your resume and let Job Scout find roles that actually match it —
ranked by fit, with the gaps shown honestly.</p>
<ol class="js-steps">
  <li><span class="js-num">1</span><div><b>Drop your resume</b> (PDF) below.</div></li>
  <li><span class="js-num">2</span><div>We <b>read it</b> and show your skills, experience, and locations.</div></li>
  <li><span class="js-num">3</span><div>Hit <b>Find jobs</b> to get openings ranked by fit.</div></li>
</ol>
"""

THEME = gr.themes.Soft(
    primary_hue=gr.themes.colors.emerald,
    secondary_hue=gr.themes.colors.stone,
    neutral_hue=gr.themes.colors.stone,
    font=(gr.themes.GoogleFont("Public Sans"), "ui-sans-serif", "system-ui", "sans-serif"),
    radius_size=gr.themes.sizes.radius_md,
).set(
    body_background_fill="#FBFAF8",
    body_background_fill_dark="#141311",
    block_background_fill="#FFFFFF",
    block_background_fill_dark="#1E1D1A",
    button_primary_background_fill="#0E6E4A",
    button_primary_background_fill_hover="#0A5539",
    button_primary_text_color="#FFFFFF",
    button_large_radius="12px",
)

# Fine tiled grain, kept as a constant so the CSS block stays within line length.
_GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"  # noqa: E501

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

:root {
  --js-accent: #0E6E4A;
  --js-accent-bright: #0E9C68;
  --js-ring-track: rgba(20,19,17,0.08);
}
.dark {
  --js-ring-track: rgba(255,255,255,0.10);
}

/* --- Atmospheric background: faint emerald + amber wash over warm paper --- */
.gradio-container {
  max-width: 760px !important;
  margin: 0 auto !important;
  position: relative;
}
body::before {
  content: "";
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(60% 45% at 12% 4%, rgba(14,156,104,0.10), transparent 70%),
    radial-gradient(55% 45% at 92% 8%, rgba(180,83,9,0.07), transparent 72%);
}
.dark body::before {
  background:
    radial-gradient(60% 45% at 12% 4%, rgba(14,156,104,0.14), transparent 70%),
    radial-gradient(55% 45% at 92% 8%, rgba(180,83,9,0.10), transparent 72%);
}
/* fine grain */
body::after {
  content: "";
  position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.35;
  background-image: __GRAIN__;
}
.dark body::after { opacity: 0.5; mix-blend-mode: screen; }
.gradio-container > * { position: relative; z-index: 1; }

/* --- Header --- */
#js-header { text-align: center; padding: 22px 0 4px; }
#js-header .js-mark {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
}
#js-header .js-mark svg { width: 30px; height: 30px; color: var(--js-accent); }
#js-header h1 {
  font-family: 'Fraunces', Georgia, serif; font-weight: 600;
  font-size: 2.85rem; letter-spacing: -0.025em; margin: 0; line-height: 1.02;
}
#js-header .js-tag {
  display: inline-block; margin-top: 13px; font-size: 0.76rem; letter-spacing: 0.01em;
  color: var(--body-text-color-subdued);
  border: 1px solid var(--border-color-primary); border-radius: 999px; padding: 4px 14px;
  background: color-mix(in srgb, var(--block-background-fill) 55%, transparent);
  backdrop-filter: blur(4px);
}

/* --- Stepper --- */
.js-stepper {
  list-style: none; display: flex; align-items: center; justify-content: center;
  gap: 0; margin: 20px auto 6px; padding: 0; max-width: 420px;
}
.js-step { display: flex; align-items: center; gap: 9px; font-size: 0.82rem; }
.js-step-dot {
  width: 26px; height: 26px; border-radius: 50%; flex: none;
  display: grid; place-items: center; font-size: 0.78rem; font-weight: 700;
  font-family: 'IBM Plex Mono', monospace;
  border: 1.5px solid var(--border-color-primary); color: var(--body-text-color-subdued);
  background: var(--block-background-fill); transition: all .2s ease;
}
.js-step-label { color: var(--body-text-color-subdued); font-weight: 500; }
.js-step::after {
  content: ""; width: 34px; height: 1.5px; margin: 0 12px;
  background: var(--border-color-primary); border-radius: 2px;
}
.js-step:last-child::after { display: none; }
.js-step-active .js-step-dot {
  border-color: var(--js-accent); color: #fff; background: var(--js-accent);
  box-shadow: 0 0 0 4px rgba(14,110,74,0.14);
}
.js-step-active .js-step-label { color: var(--body-text-color); font-weight: 600; }
.js-step-done .js-step-dot {
  border-color: var(--js-accent); color: var(--js-accent);
  background: rgba(14,110,74,0.12);
}

/* --- Intro --- */
.js-lead { text-align: center; font-size: 1.05rem; line-height: 1.55; color: var(--body-text-color-subdued);
  margin: 14px auto 4px; max-width: 480px; }
.js-steps { list-style: none; padding: 0; margin: 18px auto 8px; max-width: 470px; }
.js-steps li { display: flex; gap: 13px; align-items: flex-start; padding: 9px 0; font-size: 0.95rem; line-height: 1.45; }
.js-steps .js-num { flex: none; width: 26px; height: 26px; border-radius: 50%;
  background: rgba(14,110,74,0.12); color: var(--js-accent); font-weight: 700; font-size: 0.82rem;
  font-family: 'IBM Plex Mono', monospace; margin-top: 1px;
  display: flex; align-items: center; justify-content: center; }

.js-section-label { font-size: 0.76rem; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--body-text-color-subdued); margin: 4px 0 10px 2px; }
.js-muted { color: var(--body-text-color-subdued); }

/* --- Dropzone polish --- */
.js-drop { border: 1.5px dashed var(--border-color-primary) !important;
  border-radius: 16px !important; background: color-mix(in srgb, var(--block-background-fill) 70%, transparent) !important;
  transition: border-color .2s ease, background .2s ease; }
.js-drop:hover { border-color: var(--js-accent) !important; }

/* --- Cards --- */
.js-card { background: var(--block-background-fill); border: 1px solid var(--border-color-primary);
  border-radius: 16px; padding: 20px 22px; box-shadow: 0 1px 2px rgba(20,19,17,0.03); }
.js-profile-name { font-family: 'Fraunces', serif; font-size: 1.5rem; font-weight: 600; margin: 0; letter-spacing: -0.01em; }
.js-profile-sub { color: var(--body-text-color-subdued); font-size: 0.92rem; margin: 3px 0 14px; }
.js-profile-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 4px 0 14px;
  border-top: 1px solid var(--border-color-primary); padding-top: 14px; }
.js-stat .js-stat-val { font-family: 'IBM Plex Mono', monospace; font-size: 1.15rem; font-weight: 600; line-height: 1; }
.js-stat .js-stat-key { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--body-text-color-subdued); margin-top: 5px; }
.js-profile-row { font-size: 0.9rem; margin: 3px 0; }
.js-profile-row b { font-weight: 600; }
.js-pill { display: inline-block; font-size: 0.75rem; padding: 3px 11px; border-radius: 999px;
  background: rgba(14,110,74,0.10); color: var(--js-accent); margin: 5px 5px 0 0; }

/* --- Job cards --- */
.js-jobs { display: flex; flex-direction: column; gap: 12px; }
.js-job { border: 1px solid var(--border-color-primary); border-radius: 14px;
  padding: 17px 19px; background: var(--block-background-fill);
  box-shadow: 0 1px 2px rgba(20,19,17,0.03);
  transition: box-shadow .18s ease, transform .18s ease, border-color .18s ease;
  opacity: 0; transform: translateY(8px); animation: js-rise .4s ease forwards; }
.js-job:hover { box-shadow: 0 12px 30px rgba(20,19,17,0.09); transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--js-accent) 40%, var(--border-color-primary)); }
@keyframes js-rise { to { opacity: 1; transform: none; } }

.js-job-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.js-job-title { font-weight: 600; font-size: 1.06rem; text-decoration: none; color: var(--body-text-color);
  line-height: 1.3; }
.js-job-title:hover { color: var(--js-accent); }
.js-job-meta { font-size: 0.85rem; color: var(--body-text-color-subdued); margin-top: 4px;
  display: flex; align-items: center; flex-wrap: wrap; gap: 7px; }
.js-remote, .js-source { font-size: 0.66rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;
  border-radius: 5px; padding: 2px 7px; line-height: 1.5; }
.js-remote { color: var(--js-accent); border: 1px solid rgba(14,110,74,0.35); }
.js-source { color: var(--body-text-color-subdued); border: 1px solid var(--border-color-primary); }
.js-job-why { font-size: 0.92rem; line-height: 1.55; margin: 12px 0 0; }

/* chips */
.js-chips { margin-top: 11px; display: flex; flex-wrap: wrap; gap: 6px; }
.js-chip { display: inline-flex; align-items: center; gap: 4px; font-size: 0.75rem;
  padding: 3px 10px; border-radius: 999px; line-height: 1.5; }
.js-chip-match { background: rgba(14,110,74,0.11); color: var(--js-accent); }
.js-chip-gap { background: rgba(100,116,139,0.13); color: var(--body-text-color-subdued); }

/* --- Fit gauge --- */
.js-fit-ring { --size: 56px; width: var(--size); height: var(--size); flex: none;
  border-radius: 50%; display: grid; place-items: center; position: relative;
  background: conic-gradient(var(--ring) calc(var(--val) * 1%), var(--js-ring-track) 0); }
.js-fit-ring::before { content: ""; position: absolute; inset: 5px; border-radius: 50%;
  background: var(--block-background-fill); }
.js-fit-num { position: relative; font-family: 'IBM Plex Mono', monospace; font-weight: 600;
  font-size: 1.05rem; color: var(--tier-fg); }
.js-fit-high { --ring: var(--js-accent-bright); --tier-fg: #0E6E4A; }
.js-fit-mid  { --ring: #D97706; --tier-fg: #B45309; }
.js-fit-low  { --ring: #94A3B8; --tier-fg: #64748B; }
.dark .js-fit-high { --tier-fg: #34D399; }
.dark .js-fit-mid  { --tier-fg: #FBBF24; }
.dark .js-fit-low  { --tier-fg: #94A3B8; }

/* --- States --- */
.js-empty { text-align: center; padding: 40px 20px; color: var(--body-text-color-subdued); }
.js-empty .js-empty-icon { font-size: 1.8rem; opacity: 0.8; margin-bottom: 8px; }
.js-status { font-size: 0.86rem; color: var(--body-text-color-subdued); text-align: center; min-height: 18px; }
.js-status-err { color: #B45309; }
.js-spin { display: inline-block; width: 13px; height: 13px; margin-right: 8px; vertical-align: -1px;
  border: 2px solid rgba(14,110,74,0.25); border-top-color: var(--js-accent); border-radius: 50%;
  animation: js-rotate .7s linear infinite; }
@keyframes js-rotate { to { transform: rotate(360deg); } }

/* --- Footer --- */
.js-footer { text-align: center; font-size: 0.82rem; color: var(--body-text-color-subdued);
  border-top: 1px solid var(--border-color-primary); margin-top: 20px; padding-top: 15px; }
.js-footer .js-meta-mono { font-family: 'IBM Plex Mono', monospace; }
.js-footer a { color: var(--js-accent); text-decoration: none; }
.js-footer a:hover { text-decoration: underline; }

/* --- Tailor pack (Phase 2) --- */
.js-pack { display: flex; flex-direction: column; gap: 14px; }
.js-letter { white-space: pre-wrap; font-size: 0.93rem; line-height: 1.6; }
.js-cvprev-role { font-weight: 600; margin: 10px 0 2px; }
.js-cvprev-dates { color: var(--body-text-color-subdued); font-size: 0.85rem; font-weight: 400; }
.js-cvprev ul { margin: 4px 0 0; padding-left: 1.2em; }
.js-cvprev li { font-size: 0.9rem; line-height: 1.5; margin: 3px 0; }
.js-ref { font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem; color: var(--js-accent);
  background: rgba(14,110,74,0.09); border-radius: 5px; padding: 1px 6px; margin-left: 6px;
  vertical-align: 1px; white-space: nowrap; }
.js-honesty { border-left: 3px solid #D97706; background: rgba(217,119,6,0.07);
  border-radius: 0 12px 12px 0; padding: 12px 16px; font-size: 0.9rem; line-height: 1.55; }
.js-honesty b { color: #B45309; }
.js-fab-ok { border: 1px solid rgba(14,110,74,0.35); background: rgba(14,110,74,0.06);
  border-radius: 12px; padding: 11px 16px; font-size: 0.88rem; color: var(--js-accent); }
.js-fab-warn { border: 1px solid rgba(217,119,6,0.45); background: rgba(217,119,6,0.07);
  border-radius: 12px; padding: 12px 16px; font-size: 0.88rem; }
.js-fab-warn b { color: #B45309; }
.js-fab-warn ul { margin: 8px 0 0; padding-left: 1.2em; }
.js-fab-warn li { margin: 4px 0; line-height: 1.5; }
.js-fab-warn .js-fab-reason { color: var(--body-text-color-subdued); font-size: 0.8rem; }

/* --- Strip the Gradio chrome: pages float directly on the paper --- */
footer { display: none !important; }
.js-page { background: transparent !important; border: none !important; box-shadow: none !important; }
.js-page > .styler, .js-page .form { background: transparent !important; border: none !important; box-shadow: none !important; }

/* --- Jobvis: a one-line pointer at the voice console on :8000 --- */
#jv-strip { display: flex; align-items: center; justify-content: center; gap: 12px;
  background: linear-gradient(140deg, #1A241F 0%, #101713 100%);
  border: 1px solid rgba(14,156,104,0.28); border-radius: 18px;
  padding: 12px 18px; margin: 2px 0 10px; box-shadow: 0 14px 40px rgba(10, 20, 16, 0.28); }
#jv-strip .jv-hint { margin: 0; color: rgba(236,242,238,0.72); }
.jv-hint { text-align: center; font-size: 0.78rem; color: var(--body-text-color-subdued); margin: 6px 0 0; }
.jv-link { font-family: 'IBM Plex Mono', monospace; font-size: 0.76rem; color: #7DE3B5 !important;
  text-decoration: none; white-space: nowrap; }
.jv-link:hover { text-decoration: underline; }

/* accessibility: visible focus */
a:focus-visible, button:focus-visible, .js-job-title:focus-visible {
  outline: 2px solid var(--js-accent); outline-offset: 2px; border-radius: 4px; }

@media (max-width: 520px) {
  #js-header h1 { font-size: 2.3rem; }
  .js-step-label { display: none; }
  .js-step::after { width: 22px; margin: 0 8px; }
  .js-profile-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .js-job { animation: none; opacity: 1; transform: none; }
  .js-spin { animation: none; }
}
""".replace("__GRAIN__", _GRAIN)

# Small compass mark for the wordmark.
_MARK = (
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" '
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.1 5-5 2.1 2.1-5z"/></svg>'
)


def _stepper(active: int) -> str:
    """Render the 4-step progress indicator with ``active`` (1-4) highlighted."""
    labels = ("Resume", "Profile", "Jobs", "Tailor")
    items = []
    for i, label in enumerate(labels, 1):
        state = "done" if i < active else "active" if i == active else "todo"
        mark = "✓" if state == "done" else str(i)
        items.append(
            f'<li class="js-step js-step-{state}">'
            f'<span class="js-step-dot">{mark}</span>'
            f'<span class="js-step-label">{label}</span></li>'
        )
    return f'<ol class="js-stepper">{"".join(items)}</ol>'


def _loading_html(text: str) -> str:
    """Centered spinner with a message."""
    return f'<div class="js-empty"><div class="js-empty-icon"><span class="js-spin"></span></div><div>{escape(text)}</div></div>'


def _chips(items: list[str], kind: str, limit: int) -> str:
    """Render a row of matched-skill or gap chips."""
    icon = "✓ " if kind == "match" else ""
    shown = "".join(f'<span class="js-chip js-chip-{kind}">{icon}{escape(s)}</span>' for s in items[:limit])
    return f'<div class="js-chips">{shown}</div>' if shown else ""


def _profile_html(profile: Profile | None) -> str:
    """Render the extracted profile as a card."""
    if profile is None:
        return '<div class="js-card js-muted">Could not read a profile from that resume.</div>'
    skills = "".join(f'<span class="js-pill">{escape(s)}</span>' for s in profile.skills) or "—"
    years = f"{profile.years_experience:g}" if profile.years_experience else "—"
    languages = escape(", ".join(profile.languages) or "—")
    return (
        '<div class="js-card">'
        f'<p class="js-profile-name">{escape(profile.name or "Candidate")}</p>'
        f'<p class="js-profile-sub">{escape(profile.seniority.title())} · '
        f"{escape(', '.join(profile.primary_roles) or '—')}</p>"
        '<div class="js-profile-grid">'
        f'<div class="js-stat"><div class="js-stat-val">{years}</div><div class="js-stat-key">Years exp</div></div>'
        f'<div class="js-stat"><div class="js-stat-val">{"Yes" if profile.remote_ok else "No"}</div>'
        '<div class="js-stat-key">Remote</div></div>'
        f'<div class="js-stat"><div class="js-stat-val">{len(profile.skills)}</div><div class="js-stat-key">Skills</div></div>'
        "</div>"
        f'<p class="js-profile-row"><b>Locations</b> &nbsp;{escape(", ".join(profile.locations) or "—")}</p>'
        f'<p class="js-profile-row"><b>Languages</b> &nbsp;{languages}</p>'
        f'<div style="margin-top:12px">{skills}</div>'
        "</div>"
    )


def _fit_class(score: int) -> str:
    """Return the CSS tier class for a fit score."""
    if score >= 80:
        return "js-fit-high"
    if score >= 60:
        return "js-fit-mid"
    return "js-fit-low"


def _fit_ring(score: int) -> str:
    """Render the fit score as a conic-gradient gauge."""
    return (
        f'<div class="js-fit-ring {_fit_class(score)}" style="--val:{score}" '
        f'role="img" aria-label="Fit score {score} out of 100">'
        f'<span class="js-fit-num">{score}</span></div>'
    )


def _job_card(ranked: RankedJob, index: int) -> str:
    """Render one ranked job as a card with a conic fit gauge and skill chips."""
    job = ranked.job
    title = escape(job.title)
    if job.url:
        title_html = f'<a class="js-job-title" href="{escape(job.url)}" target="_blank" rel="noopener">{title}</a>'
    else:
        title_html = f'<span class="js-job-title">{title}</span>'
    remote = '<span class="js-remote">Remote</span>' if job.remote else ""
    source = f'<span class="js-source">{escape(job.source)}</span>'
    matched = _chips(ranked.matched_skills, "match", 6)
    gaps = _chips(ranked.gaps, "gap", 4)
    delay = f"animation-delay:{min(index, 8) * 55}ms"
    return (
        f'<div class="js-job" style="{delay}">'
        '<div class="js-job-head">'
        f"<div>{title_html}"
        f'<div class="js-job-meta">{escape(job.company)} · {escape(job.location)}{remote}{source}</div></div>'
        f"{_fit_ring(ranked.fit_score)}"
        "</div>"
        f'<p class="js-job-why">{escape(ranked.fit_explanation)}</p>'
        f"{matched}{gaps}"
        "</div>"
    )


def _results_html(result: RunResult) -> str:
    """Render the ranked jobs as cards, or an empty state."""
    if not result.ranked_jobs:
        return (
            '<div class="js-empty"><div class="js-empty-icon">🔍</div>'
            "<div>No matching jobs found. Try a resume with more detail, or check back later.</div></div>"
        )
    cards = "".join(_job_card(r, i) for i, r in enumerate(result.ranked_jobs))
    return f'<div class="js-jobs">{cards}</div>'


def _footer_html(result: RunResult) -> str:
    """Render the run footer: cost, latency, job source, and the Opik link."""
    link = f'<a href="{result.opik_url or opik_url()}" target="_blank" rel="noopener">view traces in Opik ↗</a>'
    if result.failed:
        body = f"⚠ run failed — {escape(result.error_message)}. The trace has details · {link}"
    else:
        sources = escape(", ".join(result.jobs_sources) or "none")
        sep = ' <span class="js-muted">·</span> '
        body = (
            f'<span class="js-meta-mono">${result.cost_usd:.4f}</span>{sep}'
            f'<span class="js-meta-mono">{result.latency_s}s</span>{sep}'
            f"source: {sources}{sep}{link}"
        )
    return f'<div class="js-footer">{body}</div>'


def _cv_preview_html(pack) -> str:
    """Render the tailored CV with each bullet's corpus_ref chip (the grounding IS the feature)."""
    cv = pack.cv
    parts = [f"<p><b>{escape(cv.headline)}</b></p>", f'<p class="js-job-why">{escape(cv.summary)}</p>']
    for entry in cv.experience:
        dates = f' <span class="js-cvprev-dates">{escape(entry.dates)}</span>' if entry.dates else ""
        parts.append(f'<p class="js-cvprev-role">{escape(entry.role)} — {escape(entry.company)}{dates}</p>')
        if entry.bullets:
            bullets = "".join(
                f"<li>{escape(b.text)}<span class='js-ref'>{escape(b.corpus_ref)}</span></li>" for b in entry.bullets
            )
            parts.append(f"<ul>{bullets}</ul>")
    if cv.skills:
        pills = "".join(f'<span class="js-pill">{escape(s)}</span>' for s in cv.skills)
        parts.append(f'<div style="margin-top:10px">{pills}</div>')
    if cv.education:
        rows = "".join(f"<li>{escape(line)}</li>" for line in cv.education)
        parts.append(f"<ul>{rows}</ul>")
    return f'<div class="js-card js-cvprev">{"".join(parts)}</div>'


def _fabrication_html(result: TailorResult) -> str:
    """Render the validator verdict — never hidden, whatever it says."""
    if result.fabrication_flags == 0:
        return '<div class="js-fab-ok">✓ Every claim in this application traced back to your CV.</div>'
    report = result.fabrication_report
    items = ""
    if report:
        items = "".join(
            f"<li>“{escape(f.text[:140])}”<br><span class='js-fab-reason'>{escape(f.reason)}</span></li>" for f in report.flagged
        )
    n = result.fabrication_flags
    return (
        f'<div class="js-fab-warn"><b>⚠ {n} statement{"s" if n != 1 else ""} could not be verified against your CV.</b>'
        f" Review before sending.<ul>{items}</ul></div>"
    )


def _pack_html(result: TailorResult) -> str:
    """Render the application pack: cover letter, tailored CV, honesty note."""
    if result.pack is None:
        why = escape("; ".join(result.errors) or result.error_message or "unknown error")
        return f'<div class="js-empty"><div class="js-empty-icon">⚠</div><div>Could not tailor this job: {why}</div></div>'
    pack = result.pack
    honesty = ""
    if pack.honesty_note:
        honesty = f'<div class="js-honesty"><b>Honesty note</b> — {escape(pack.honesty_note)}</div>'
    return (
        '<div class="js-pack">'
        f"{_fabrication_html(result)}"
        '<p class="js-section-label">Cover letter</p>'
        f'<div class="js-card js-letter">{escape(pack.cover_letter)}</div>'
        '<p class="js-section-label">Tailored CV</p>'
        f"{_cv_preview_html(pack)}"
        f"{honesty}"
        "</div>"
    )


def _tailor_footer_html(result: TailorResult) -> str:
    """Run footer for the tailor step: cost, latency, research flag, Opik link."""
    link = f'<a href="{result.opik_url or opik_url()}" target="_blank" rel="noopener">view traces in Opik ↗</a>'
    if result.failed:
        body = f"⚠ run failed — {escape(result.error_message)}. The trace has details · {link}"
    else:
        sep = ' <span class="js-muted">·</span> '
        research = "with company research" if result.research_used else "no company research"
        body = (
            f'<span class="js-meta-mono">${result.cost_usd:.4f}</span>{sep}'
            f'<span class="js-meta-mono">{result.latency_s}s</span>{sep}'
            f"{research}{sep}{link}"
        )
    return f'<div class="js-footer">{body}</div>'


def _status(text: str, error: bool = False) -> str:
    """Render a status line on the start page."""
    cls = "js-status js-status-err" if error else "js-status"
    return f'<div class="{cls}">{escape(text)}</div>'


def _pack_downloads(result: TailorResult, profile: Profile | None) -> tuple[dict, dict, str]:
    """Footer + download-button updates for a finished tailoring run (click or voice)."""
    hidden = gr.update(visible=False)
    footer = _tailor_footer_html(result)
    pdf_btn, tex_btn = hidden, hidden
    if result.pack is not None:
        name = (profile.name if profile else None) or "Candidate"
        render = render_pdf(result.pack.cv, name, Path(tempfile.mkdtemp(prefix="job_scout_render_")))
        tex_btn = gr.update(value=str(render.tex_path), visible=True)
        if render.pdf_path is not None:
            pdf_btn = gr.update(value=str(render.pdf_path), visible=True)
        elif render.message:
            footer = f'<div class="js-footer">{escape(render.message)}</div>{footer}'
    return pdf_btn, tex_btn, footer


def _voice_context(text: str) -> None:
    """Tell a listening console what just happened on screen (silent context)."""
    voice_bridge.get_bridge().note_screen_event(text)


def on_run_tick():
    """Mirror a voice-triggered run into the wizard's pages.

    The console holds the conversation, but the click path still owns these
    screens, so a run started by voice has to land here too. While a run is IN
    FLIGHT this shows the runner's live status lines ("ranking 12 jobs…") so
    the page never sits frozen; when the bridge hands over the finished run,
    the SAME renderers the click path uses fill it in. Announcing the result is
    the console's job now — it hears the same run on its own feed.
    """
    no = gr.update()
    bridge = voice_bridge.get_bridge()
    run = bridge.pop_finished_run()
    if run is None:
        progress = bridge.run_status()
        if progress.get("running"):
            loading = _loading_html(str(progress.get("latest_status") or "working…"))
            if progress.get("kind") == "search":
                show_results = (gr.update(visible=False), gr.update(visible=True), gr.update(visible=False))
                return (*show_results, loading, "", no, no, no, no, no)
            return (
                gr.update(visible=False),
                gr.update(visible=False),
                gr.update(visible=True),
                no,
                no,
                no,
                loading,
                "",
                gr.update(visible=False),
                gr.update(visible=False),
            )
    if run is not None and run.kind == "search" and run.search_result is not None and not run.failed:
        result = run.search_result
        choices = [(f"{r.job.title} — {r.job.company} (fit {r.fit_score})", r.job.job_id) for r in result.ranked_jobs]
        return (
            gr.update(visible=False),
            gr.update(visible=True),
            gr.update(visible=False),
            _results_html(result),
            _footer_html(result),
            gr.update(choices=choices, value=None, visible=bool(choices)),
            no,
            no,
            no,
            no,
        )
    if run is not None and run.kind == "tailor" and run.tailor_result is not None and not run.failed:
        result = run.tailor_result
        pdf_btn, tex_btn, footer = _pack_downloads(result, bridge.snapshot().profile)
        return (
            gr.update(visible=False),
            gr.update(visible=False),
            gr.update(visible=True),
            no,
            no,
            no,
            _pack_html(result),
            footer,
            pdf_btn,
            tex_btn,
        )
    return (no,) * 10


REMOTE_CHOICE = "Remote (anywhere)"


def _selection_to_prefs(selection: list[str]) -> dict:
    """The chooser's ticked boxes as a preferences dict."""
    return {"locations": [s for s in selection if s != REMOTE_CHOICE], "remote": REMOTE_CHOICE in selection}


def _preference_selection(profile: Profile, preferences: dict | None) -> tuple[list[str], list[str]]:
    """(choices, selected) for the chooser — stored preferences win, else the extraction's suggestion."""
    if preferences:
        locations = [loc for loc in (preferences.get("locations") or []) if loc]
        remote = bool(preferences.get("remote"))
    else:
        locations, remote = list(profile.locations), bool(profile.remote_ok)
    choices = [*dict.fromkeys([*profile.locations, *locations]), REMOTE_CHOICE]
    return choices, [*locations, *([REMOTE_CHOICE] if remote else [])]


def on_prefs_change(selection: list[str], profile: Profile | None, cv_text: str, thread_id: str) -> None:
    """Persist the chooser's state and keep the voice bridge on the same page."""
    if profile is None:
        return
    prefs = _selection_to_prefs(selection)
    voice_bridge.get_bridge().record_profile(candidate_store.effective_profile(profile, prefs), cv_text, thread_id)
    candidate_store.save_candidate(profile, cv_text, prefs)


def on_add_location(new_location: str, choices: list[str], selection: list[str], profile, cv_text, thread_id):
    """Add a typed location to the chooser, ticked, and persist.

    Outputs: (loc_choices_state, loc_group, loc_new_textbox).
    """
    location = (new_location or "").strip()
    if not location or location in choices:
        return choices, gr.update(), ""
    choices = [*choices[:-1], location, REMOTE_CHOICE] if choices else [location, REMOTE_CHOICE]
    selection = [*selection, location]
    on_prefs_change(selection, profile, cv_text, thread_id)  # programmatic updates don't fire .change
    return choices, gr.update(choices=choices, value=selection), ""


def _on_load(thread_id: str):
    """Register the wizard thread with the voice bridge and restore a saved candidate.

    With a stored candidate the app opens on step 2 — profile shown, chooser
    restored, Find jobs ready, Jobvis pre-seeded — and no LLM call happens
    (the extraction was paid for when the CV was first uploaded). Jobs are NOT
    restored: results go stale, so every session fetches fresh.
    Outputs: (page_start, page_profile, profile_html, cv_text_state,
    profile_state, loc_choices_state, loc_group).
    """
    voice_bridge.get_bridge().register_thread(thread_id)
    stored = candidate_store.load_candidate()
    if stored is None:
        return (gr.update(), gr.update(), gr.update(), gr.update(), gr.update(), gr.update(), gr.update())
    choices, selected = _preference_selection(stored.profile, stored.preferences)
    effective = candidate_store.effective_profile(stored.profile, stored.preferences)
    voice_bridge.get_bridge().record_profile(effective, stored.cv_text, thread_id)
    note = (
        '<p class="js-muted" style="text-align:center;font-size:0.8rem;margin-top:10px">'
        "Restored from your last session — “Start over” forgets it.</p>"
    )
    return (
        gr.update(visible=False),
        gr.update(visible=True),
        _profile_html(stored.profile) + note,
        stored.cv_text,
        stored.profile,
        choices,
        gr.update(choices=choices, value=selected),
    )


def on_upload(file_path: str | None, thread_id: str):
    """Step 1 → 2: read the resume, extract the profile, and reveal the profile page.

    The chooser is seeded with the extraction's locations/remote as a ticked
    SUGGESTION — the human confirms or edits before any search runs.
    Outputs: (page_start, page_profile, profile_html, cv_text_state,
    start_status, profile_state, loc_choices_state, loc_group).
    """
    stay = gr.update(visible=True), gr.update(visible=False)
    go = gr.update(visible=False), gr.update(visible=True)
    no = gr.update()

    if not file_path:
        yield (*stay, gr.update(), "", _status("Please drop a PDF resume.", error=True), None, no, no)
        return
    try:
        cv_text = extract_cv_text(file_path)
    except CVReadError as exc:
        yield (*stay, gr.update(), "", _status(f"Could not read that PDF: {exc}", error=True), None, no, no)
        return

    yield (*go, _loading_html("Reading your resume…"), cv_text, "", gr.update(), no, no)
    try:
        profile = extract_profile(cv_text, thread_id=thread_id, tags=["phase-2", "ui", "extract"])
    except Exception as exc:  # noqa: BLE001 - show a friendly error and return to start
        msg = f"Couldn't read a profile: {exc}"
        if "api_key" in str(exc).lower() or "credentials" in str(exc).lower():
            msg += " Add an LLM key to .env (OPENAI_API_KEY, or a free SCOUT_MODEL via groq:/ollama:)."
        yield (*stay, gr.update(), "", _status(msg, error=True), None, no, no)
        return
    choices, selected = _preference_selection(profile, None)
    voice_bridge.get_bridge().record_profile(profile, cv_text, thread_id)
    candidate_store.save_candidate(profile, cv_text, _selection_to_prefs(selected))
    _voice_context(f"Screen event: the user just uploaded a CV; a profile was extracted for {profile.name or 'the candidate'}.")
    yield (*go, _profile_html(profile), cv_text, "", profile, choices, gr.update(choices=choices, value=selected))


def on_find(cv_text: str, profile: Profile | None, thread_id: str, loc_selection: list[str]):
    """Step 2 → 3: run the job-finding graph for the chosen locations and stream results.

    The search runs on the EFFECTIVE profile — extraction overridden by the
    chooser's ticked locations/remote — so the model builds its query around
    where the human actually wants to work, not where it guessed.
    Outputs: (page_profile, page_results, results_html, footer_html, job_select).
    """
    go = gr.update(visible=False), gr.update(visible=True)
    if profile is None:
        yield (gr.update(visible=True), gr.update(visible=False), gr.update(), "", gr.update())
        return

    prefs = _selection_to_prefs(loc_selection or [])
    effective = candidate_store.effective_profile(profile, prefs)
    voice_bridge.get_bridge().record_profile(effective, cv_text, thread_id)
    candidate_store.save_candidate(profile, cv_text, prefs)

    yield (*go, _loading_html("Searching for jobs…"), "", gr.update())
    result = RunResult()
    for kind, payload in stream_search(effective, cv_text=cv_text, thread_id=thread_id, tags=["phase-2", "ui"]):
        if kind == "status":
            yield (*go, _loading_html(str(payload)), "", gr.update())
        elif kind == "result":
            result = payload  # type: ignore[assignment]

    choices = [(f"{r.job.title} — {r.job.company} (fit {r.fit_score})", r.job.job_id) for r in result.ranked_jobs]
    select = gr.update(choices=choices, value=None, visible=bool(choices))
    voice_bridge.get_bridge().record_step("results")
    _voice_context(f"Screen event: an on-screen job search just finished — {len(result.ranked_jobs)} ranked jobs are visible.")
    yield (*go, _results_html(result), _footer_html(result), select)


def on_zip(zip_path: str | None) -> str | None:
    """Store the optional LinkedIn export path in session state (path only, never traced)."""
    voice_bridge.get_bridge().record_linkedin_zip(zip_path)
    return zip_path


def on_tailor(selected_job_id: str | None, thread_id: str, linkedin_zip: str | None, profile: Profile | None):
    """Step 3 → 4: tailor an application for the selected job on the SAME thread.

    Only ``selected_job_id`` (+ optional LinkedIn export path) is passed to the
    graph — profile, ranked jobs and CV text come from the thread's checkpoint.
    Outputs: (page_results, page_tailor, tailor_html, tailor_footer, pdf_btn, tex_btn).
    """
    stay = gr.update(visible=True), gr.update(visible=False)
    go = gr.update(visible=False), gr.update(visible=True)
    hidden = gr.update(visible=False)
    if not selected_job_id:
        gr.Warning("Pick a job from the dropdown first.")
        yield (*stay, gr.update(), gr.update(), hidden, hidden)
        return

    yield (*go, _loading_html("Drafting the application…"), "", hidden, hidden)
    result = TailorResult()
    stream = stream_tailor(
        thread_id=thread_id,
        selected_job_id=selected_job_id,
        tags=["phase-2", "ui", "tailor"],
        linkedin_zip_path=linkedin_zip,
    )
    for kind, payload in stream:
        if kind == "status":
            yield (*go, _loading_html(str(payload)), "", hidden, hidden)
        elif kind == "result":
            result = payload  # type: ignore[assignment]

    pdf_btn, tex_btn, footer = _pack_downloads(result, profile)
    voice_bridge.get_bridge().record_step("tailor")
    _voice_context("Screen event: an application pack was just tailored via the on-screen button and is now visible.")
    yield (*go, _pack_html(result), footer, pdf_btn, tex_btn)


def reset():
    """Return to step 1, clear the wizard, start a FRESH thread, forget the candidate.

    A new thread_id matters now that the checkpointer is shared: reusing the
    old thread for a different resume would mix two candidates' state. The
    persisted candidate is cleared too — "start over" is the explicit way to
    switch resumes, whereas an app restart keeps you.

    Outputs: (page_start, page_profile, page_results, page_tailor, cv_file,
    cv_text_state, start_status, results_html, footer_html, thread_id,
    linkedin_zip_state, job_select, tailor_out, tailor_footer, pdf_btn, tex_btn,
    loc_choices_state, loc_group).
    """
    new_thread_id = str(uuid4())
    voice_bridge.get_bridge().register_thread(new_thread_id)
    candidate_store.clear_candidate()
    return (
        gr.update(visible=True),
        gr.update(visible=False),
        gr.update(visible=False),
        gr.update(visible=False),
        None,
        "",
        "",
        "",
        "",
        new_thread_id,
        None,
        gr.update(choices=[], value=None),
        "",
        "",
        gr.update(visible=False),
        gr.update(visible=False),
        [],
        gr.update(choices=[], value=[]),
    )


def build_app() -> gr.Blocks:
    """Build the four-step wizard app."""
    register_prompts()

    with gr.Blocks(title="Job Scout") as demo:
        thread_id = gr.State(lambda: str(uuid4()))
        cv_text_state = gr.State("")
        profile_state = gr.State(None)
        linkedin_zip_state = gr.State(None)

        gr.HTML(
            f'<div id="js-header"><div class="js-mark">{_MARK}<h1>Job Scout</h1></div>'
            f'<div><span class="js-tag">{CAPTION}</span></div></div>'
        )

        voice_ok, voice_hint = is_voice_available()
        if voice_ok:
            gr.HTML(
                '<div id="jv-strip"><span class="jv-hint">Jobvis, the voice concierge, runs in its own console.</span>'
                '<a class="jv-link" href="http://localhost:8000" target="_blank" rel="noopener">Talk to Jobvis ↗</a></div>'
            )
        else:
            gr.HTML(f'<p class="jv-hint">{escape(voice_hint)}</p>')

        with gr.Group(visible=True, elem_classes=["js-page"]) as page_start:
            gr.HTML(_stepper(1))
            gr.HTML(INTRO_HTML)
            cv_file = gr.File(label="", file_types=[".pdf"], type="filepath", height=150, elem_classes=["js-drop"])
            start_status = gr.HTML('<div class="js-status"></div>')

        with gr.Group(visible=False, elem_classes=["js-page"]) as page_profile:
            gr.HTML(_stepper(2))
            gr.HTML('<p class="js-section-label">Your profile</p>')
            profile_out = gr.HTML()
            gr.HTML('<p class="js-section-label" style="margin-top:14px">Where should we search?</p>')
            gr.HTML(
                '<p class="js-muted" style="font-size:0.86rem">The boxes come from your resume — a suggestion, '
                "not a decision. Tick where you actually want to work; add anywhere we missed.</p>"
            )
            loc_group = gr.CheckboxGroup(label="", show_label=False, choices=[], value=[], interactive=True)
            with gr.Row():
                loc_new = gr.Textbox(label="", show_label=False, placeholder="Add another location…", scale=4)
                loc_add = gr.Button("Add", size="sm", scale=0)
            find_btn = gr.Button("Find jobs", variant="primary", size="lg")
            with gr.Accordion("Add your LinkedIn export (optional)", open=False):
                gr.HTML(
                    '<p class="js-muted" style="font-size:0.86rem">Used only to enrich the tailoring step. '
                    "LinkedIn → Settings → “Get a copy of your data”. The ZIP stays on your machine and is "
                    "never attached to traces.</p>"
                )
                linkedin_file = gr.File(label="", file_types=[".zip"], type="filepath", height=90)
            change_btn = gr.Button("Upload a different resume", variant="secondary")

        with gr.Group(visible=False, elem_classes=["js-page"]) as page_results:
            gr.HTML(_stepper(3))
            gr.HTML('<p class="js-section-label">Ranked jobs</p>')
            results_out = gr.HTML()
            footer_out = gr.HTML()
            gr.HTML('<p class="js-section-label" style="margin-top:14px">Prepare an application</p>')
            job_select = gr.Dropdown(label="", choices=[], value=None, visible=False, interactive=True)
            tailor_btn = gr.Button("Tailor application", variant="primary")
            restart_btn = gr.Button("Start over", variant="secondary")

        with gr.Group(visible=False, elem_classes=["js-page"]) as page_tailor:
            gr.HTML(_stepper(4))
            gr.HTML('<p class="js-section-label">Application pack</p>')
            tailor_out = gr.HTML()
            with gr.Row():
                pdf_btn = gr.DownloadButton("Download tailored CV (PDF)", visible=False, variant="primary")
                tex_btn = gr.DownloadButton("Download .tex", visible=False, variant="secondary")
            tailor_footer = gr.HTML()
            back_btn = gr.Button("Back to jobs", variant="secondary")
            restart_btn2 = gr.Button("Start over", variant="secondary")

        loc_choices_state = gr.State([])
        cv_file.upload(
            on_upload,
            inputs=[cv_file, thread_id],
            outputs=[
                page_start,
                page_profile,
                profile_out,
                cv_text_state,
                start_status,
                profile_state,
                loc_choices_state,
                loc_group,
            ],
        )
        linkedin_file.change(on_zip, inputs=[linkedin_file], outputs=[linkedin_zip_state])
        loc_group.input(on_prefs_change, inputs=[loc_group, profile_state, cv_text_state, thread_id])
        loc_add.click(
            on_add_location,
            inputs=[loc_new, loc_choices_state, loc_group, profile_state, cv_text_state, thread_id],
            outputs=[loc_choices_state, loc_group, loc_new],
        )
        loc_new.submit(
            on_add_location,
            inputs=[loc_new, loc_choices_state, loc_group, profile_state, cv_text_state, thread_id],
            outputs=[loc_choices_state, loc_group, loc_new],
        )
        find_btn.click(
            on_find,
            inputs=[cv_text_state, profile_state, thread_id, loc_group],
            outputs=[page_profile, page_results, results_out, footer_out, job_select],
        )
        tailor_btn.click(
            on_tailor,
            inputs=[job_select, thread_id, linkedin_zip_state, profile_state],
            outputs=[page_results, page_tailor, tailor_out, tailor_footer, pdf_btn, tex_btn],
        )
        back_btn.click(
            lambda: (gr.update(visible=True), gr.update(visible=False)),
            outputs=[page_results, page_tailor],
        )
        reset_outputs = [
            page_start,
            page_profile,
            page_results,
            page_tailor,
            cv_file,
            cv_text_state,
            start_status,
            results_out,
            footer_out,
            thread_id,
            linkedin_zip_state,
            job_select,
            tailor_out,
            tailor_footer,
            pdf_btn,
            tex_btn,
            loc_choices_state,
            loc_group,
        ]
        change_btn.click(reset, outputs=reset_outputs)
        restart_btn.click(reset, outputs=reset_outputs)
        restart_btn2.click(reset, outputs=reset_outputs)

        if voice_ok:
            # A run started by voice in the console still has to land on these
            # pages. The Timer must sit at Blocks ROOT level: one created inside
            # a layout container can miss the client render tree, and its null
            # instance kills the frontend at dispatch_load_events (Gradio 6.20).
            gr.Timer(1.0).tick(
                on_run_tick,
                outputs=[
                    page_profile,
                    page_results,
                    page_tailor,
                    results_out,
                    footer_out,
                    job_select,
                    tailor_out,
                    tailor_footer,
                    pdf_btn,
                    tex_btn,
                ],
            )
        # Restore on page load. A load event, not a Timer: the client only opens
        # its event connection on the first event, so an unprimed timer never
        # fires.
        demo.load(
            _on_load,
            inputs=[thread_id],
            outputs=[page_start, page_profile, profile_out, cv_text_state, profile_state, loc_choices_state, loc_group],
        )

    return demo


def main() -> None:
    """Serve both surfaces from ONE process: wizard on :7860, Jobvis on :8000.

    One process is not a convenience here, it is a correctness requirement. The
    voice bridge and the LangGraph ``MemorySaver`` are both process-wide, so
    running the two servers separately gives you two sessions wearing the same
    name: the wizard finds jobs the console cannot see, and Jobvis truthfully
    reports an empty checkpoint. The API goes on a daemon thread first; Gradio
    keeps the main thread, as it prefers to.
    """
    from job_scout.api import CONSOLE_PORT, serve_in_thread

    serve_in_thread()
    print(f"Jobvis console: http://localhost:{CONSOLE_PORT}")
    build_app().launch(server_name="127.0.0.1", server_port=7860, theme=THEME, css=CSS)


if __name__ == "__main__":
    main()
