"""Extract plain text from a CV PDF with pypdf.

Text extraction only — the LLM does the structuring downstream. No OCR, no
layout analysis (out of scope by design).
"""

from __future__ import annotations

from pathlib import Path

from pypdf import PdfReader


class CVReadError(ValueError):
    """Raised when a PDF cannot be read or yields no usable text."""


def extract_cv_text(path: str | Path) -> str:
    """Return the concatenated text of a CV PDF.

    Raises ``CVReadError`` if the file is missing, unreadable, or empty of text
    (e.g. a scanned image with no text layer) so the caller can surface a clean
    message instead of an opaque parser traceback.
    """
    path = Path(path)
    if not path.exists():
        raise CVReadError(f"CV file not found: {path}")

    try:
        reader = PdfReader(str(path))
        pages = [page.extract_text() or "" for page in reader.pages]
    except Exception as exc:  # noqa: BLE001 - normalize any parser failure
        raise CVReadError(f"Could not read PDF {path.name}: {exc}") from exc

    text = "\n".join(pages).strip()
    if not text:
        raise CVReadError(f"No extractable text in {path.name}. Is it a scanned image? OCR is out of scope for this project.")
    return text
