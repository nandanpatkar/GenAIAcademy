"""Render the tailored CV: Jinja2 → LaTeX → PDF via tectonic.

The template pipes every user-derived value through the ``tex`` escape filter,
so LLM output can never inject LaTeX. Compilation uses tectonic (a single
binary, ``brew install tectonic``) — never a full texlive install.

Degradation contract: rendering must never fail a run. If tectonic is missing
or compilation fails, the ``.tex`` file is still written and the result carries
a human-readable pointer ("open it in Overleaf") instead of a PDF path.
"""

from __future__ import annotations

import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

from jinja2 import Environment, PackageLoader

from job_scout.graph.schemas import CVContent

_COMPILE_TIMEOUT_S = 120

OVERLEAF_HINT = "tectonic is not installed — download the .tex file and compile it on overleaf.com (New Project → Upload)."

# Order matters: backslash first, since the replacements introduce backslashes.
_TEX_REPLACEMENTS = [
    ("\\", r"\textbackslash{}"),
    ("&", r"\&"),
    ("%", r"\%"),
    ("$", r"\$"),
    ("#", r"\#"),
    ("_", r"\_"),
    ("{", r"\{"),
    ("}", r"\}"),
    ("~", r"\textasciitilde{}"),
    ("^", r"\textasciicircum{}"),
]


@dataclass
class RenderResult:
    """Outcome of one render: the .tex always, the PDF when tectonic works."""

    tex_path: Path
    pdf_path: Path | None = None
    message: str = ""


def latex_escape(text: str) -> str:
    """Escape LaTeX special characters in user-derived text."""
    # \textbackslash{} contains braces, which must not be re-escaped: replace
    # backslashes with a placeholder first, braces next, then resolve it.
    text = str(text).replace("\\", "\x00")
    for char, replacement in _TEX_REPLACEMENTS[1:]:
        text = text.replace(char, replacement)
    return text.replace("\x00", r"\textbackslash{}")


def _environment() -> Environment:
    """Jinja2 env with LaTeX-safe delimiters (``<< >>`` / ``<% %>``)."""
    env = Environment(
        loader=PackageLoader("job_scout", "templates"),
        variable_start_string="<<",
        variable_end_string=">>",
        block_start_string="<%",
        block_end_string="%>",
        comment_start_string="<#",
        comment_end_string="#>",
        autoescape=False,  # noqa: S701 - LaTeX, not HTML; the |tex filter escapes
        trim_blocks=True,
        lstrip_blocks=True,
    )
    env.filters["tex"] = latex_escape
    return env


def render_tex(cv: CVContent, candidate_name: str) -> str:
    """Render the tailored CV to LaTeX source."""
    template = _environment().get_template("cv.tex.j2")
    return template.render(cv=cv, name=candidate_name)


def tectonic_path() -> str | None:
    """Absolute path of the tectonic binary, or ``None`` when not installed."""
    return shutil.which("tectonic")


def render_pdf(cv: CVContent, candidate_name: str, out_dir: Path) -> RenderResult:
    """Write the ``.tex`` and compile it to PDF when tectonic is available.

    ``out_dir`` should be a temp/scratch directory chosen by the caller — never
    inside the repo. Never raises: every failure mode returns a ``RenderResult``
    with ``pdf_path=None`` and an actionable ``message``.
    """
    out_dir.mkdir(parents=True, exist_ok=True)
    tex_path = out_dir / "tailored_cv.tex"
    tex_path.write_text(render_tex(cv, candidate_name), encoding="utf-8")

    binary = tectonic_path()
    if binary is None:
        return RenderResult(tex_path=tex_path, message=OVERLEAF_HINT)

    try:
        proc = subprocess.run(
            [binary, str(tex_path), "--outdir", str(out_dir)],
            capture_output=True,
            text=True,
            timeout=_COMPILE_TIMEOUT_S,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        return RenderResult(tex_path=tex_path, message=f"tectonic failed to run ({exc}); {OVERLEAF_HINT}")

    pdf_path = tex_path.with_suffix(".pdf")
    if proc.returncode != 0 or not pdf_path.exists():
        tail = (proc.stderr or proc.stdout or "").strip().splitlines()[-3:]
        return RenderResult(tex_path=tex_path, message="tectonic compile failed: " + " / ".join(tail))
    return RenderResult(tex_path=tex_path, pdf_path=pdf_path)
