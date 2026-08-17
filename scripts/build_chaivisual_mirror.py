#!/usr/bin/env python3
"""Stage the Chai Visual static mirror for serving under /chai-visual/.

The source is an HTTrack copy of dsa.chaicode.com, a Next.js App Router site.
It is friendlier than the Data Science mirror — pages are fully prerendered and
their asset hrefs are relative — but three things still need fixing on a copy
(the pristine mirror is never modified):

  1. Junk. HTTrack captured the same auth page ~400 times under hashed names
     (login*.html, signup*.html), plus a 404 page saved as if it were a JS
     chunk. None of it should ship.

  2. Broken RSC chunk references. The flight payload embedded in every page
     names its chunks, and HTTrack rewrote those names to a mangled stub
     ("static/chunks/4044e65-3") whose fetch 404s. The original name is
     recoverable: each mangled path is preceded by its webpack chunk id in the
     same array, and exactly one real file starts with that id.

  3. Those chunk paths resolve against the origin root at runtime, so they are
     rewritten to absolute /chai-visual/_next/ paths that survive the mount.

Output is gitignored; ship it with scripts/upload_docs_archive.mjs like the
other mirrors in this repo.

Usage:
    python3 scripts/build_chaivisual_mirror.py [--mirror DIR] [--out DIR]
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DEFAULT_MIRROR = REPO / "dsa.chaicode.com"
DEFAULT_OUT = REPO / "public" / "chai-visual"
# Pages captured from a signed-in session by fetch_chaivisual_content.mjs, laid
# over the HTTrack copy to replace its "This chapter is locked" placeholders.
DEFAULT_OVERLAY = REPO / ".chaivisual-fetched"

BASE = "/chai-visual"
LOCKED_RE = re.compile(r"This (?:chapter|pattern|problem|topic) is locked")

# HTTrack detritus: the auth pages it re-fetched under every query hash, its
# saved 404 document, and the OS metadata files.
DROP_GLOBS = ("login*.html", "signup*.html", ".DS_Store")
DROP_NAMES = {"404"}

# "<chunkId>","static/chunks/<mangled>" inside the escaped flight payload.
FLIGHT_PAIR_RE = re.compile(r'(\\"(\d+)\\",\\")static/chunks/(4044e65[0-9-]*)(\?[^\\"]*)?(\\")')


def copy_mirror(mirror: Path, out: Path) -> int:
    if out.exists():
        shutil.rmtree(out)
    shutil.copytree(mirror, out, ignore=shutil.ignore_patterns(*DROP_GLOBS))

    removed = 0
    for path in list(out.rglob("*")):
        if path.is_file() and path.name in DROP_NAMES:
            path.unlink()
            removed += 1

    # The mangled "chunks" HTTrack saved are copies of the 404 page, not code.
    # The same happened to a stylesheet whose URL it split mid-word, leaving a
    # "c/css/4044e65" tree at the root that nothing references.
    for pattern in ("static/chunks/4044e65*", "c/css/4044e65*"):
        for stray in list(out.rglob(pattern)):
            if stray.is_file():
                stray.unlink()
                removed += 1
    for empty in sorted(out.rglob("*"), key=lambda p: -len(p.parts)):
        if empty.is_dir() and not any(empty.iterdir()):
            empty.rmdir()
    return removed


def duplicate_asset_names(out: Path) -> int:
    """Serve every asset under both the mirrored and the live filename.

    Each asset picked up a "4e65" suffix on its way to disk
    ("page-f409a277f08c3e8b.js" -> "page-f409a277f08c3e8b4e65.js"). HTTrack
    rewrote the pages it saved to match, but signed-in captures name assets the
    way the live site serves them, so both spellings are in play.

    Rewriting references cannot close the gap on its own: the RSC payload is
    emitted as a sequence of `self.__next_f.push()` calls, and a filename can
    straddle two of them — "…/error-31c91d2575968280." ends one push and
    "js?dpl=…" begins the next. The browser concatenates them at runtime, so
    the full name never exists in the file to be matched. Putting the bytes at
    both paths sidesteps the whole problem. Hardlinked, so it costs nothing.
    """
    linked = 0
    for asset in list((out / "_next" / "static").rglob("*")):
        if not asset.is_file():
            continue
        stem, dot, ext = asset.name.rpartition(".")
        if not dot or not stem.endswith("4e65"):
            continue
        twin = asset.with_name(f"{stem[:-4]}.{ext}")
        if twin.exists():
            continue
        try:
            twin.hardlink_to(asset)
        except OSError:
            shutil.copy2(asset, twin)
        linked += 1
    return linked


def apply_overlay(overlay: Path, out: Path) -> tuple[int, int]:
    """Lay signed-in captures over the mirror's locked placeholders.

    These came from the live site rather than HTTrack, so their asset hrefs are
    origin-absolute ("/_next/…") and need the mount prefix. Their live asset
    *filenames* are handled later, by repair_pages, which applies the same
    aliasing to every page. Navigation hrefs are left alone — the viewer
    intercepts clicks in the frame, and rewriting them would not stop Next's
    own router from using the hrefs it generates on hydration.
    """
    if not overlay.exists():
        return 0, 0

    applied = 0
    skipped = 0
    for page in overlay.rglob("*.html"):
        source = page.read_text(encoding="utf-8", errors="replace")
        if LOCKED_RE.search(source):
            skipped += 1
            continue

        for quote in ('"', "'", '\\"'):
            source = source.replace(f"{quote}/_next/", f"{quote}{BASE}/_next/")

        target = out / page.relative_to(overlay)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(source, encoding="utf-8")
        applied += 1

    return applied, skipped


def patch_public_path(out: Path) -> bool:
    """Point webpack's asset base at the mount.

    Every chunk the runtime loads is `publicPath + "static/chunks/…"`, and that
    base is compiled in as "/_next/" — origin-absolute, so under a subpath each
    request misses. One string in the runtime chunk moves all of them.
    """
    patched = False
    for script in (out / "_next" / "static" / "chunks").glob("webpack-*.js"):
        source = script.read_text(encoding="utf-8", errors="replace")
        if '.p="/_next/"' in source:
            script.write_text(source.replace('.p="/_next/"', f'.p="{BASE}/_next/"'), encoding="utf-8")
            patched = True
            print(f"  patched publicPath in {script.name}")
    return patched


def chunk_map(out: Path) -> dict[str, str]:
    """webpack chunk id -> real filename, read off the captured chunk folder."""
    mapping = {}
    for path in (out / "_next" / "static" / "chunks").glob("*.js"):
        head = path.name.split("-")[0]
        if head.isdigit():
            mapping[head] = path.name
    return mapping


def repair_pages(out: Path, chunks: dict[str, str]) -> tuple[int, int]:
    """Point every page's flight payload at chunks that actually exist.

    HTTrack mangled the numbered chunk names into a stub it then saved a 404
    page under. The original is recoverable from the webpack chunk id sitting
    beside it in the same array. (The separate live-vs-mirrored naming problem
    is handled by duplicate_asset_names, not here.)
    """
    pages = 0
    repairs = 0
    unresolved: set[str] = set()

    for page in out.rglob("*.html"):
        source = page.read_text(encoding="utf-8", errors="replace")
        original = source

        def fix(match: re.Match) -> str:
            nonlocal repairs
            prefix, chunk_id, mangled, _query, suffix = match.groups()
            real = chunks.get(chunk_id)
            if not real:
                unresolved.add(f"{chunk_id} ({mangled})")
                return match.group(0)
            repairs += 1
            # Stays relative on purpose: webpack joins these onto its own
            # publicPath, which patch_public_path() points at the mount. Making
            # them absolute here instead produces /_next//chai-visual/_next/…
            return f"{prefix}static/chunks/{real}{suffix}"

        source = FLIGHT_PAIR_RE.sub(fix, source)

        if source != original:
            page.write_text(source, encoding="utf-8")
            pages += 1

    if unresolved:
        print(f"  ! unresolved chunk ids: {', '.join(sorted(unresolved))}", file=sys.stderr)
    return pages, repairs


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mirror", type=Path, default=DEFAULT_MIRROR)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    parser.add_argument("--overlay", type=Path, default=DEFAULT_OVERLAY)
    args = parser.parse_args()

    if not args.mirror.exists():
        print(f"mirror not found: {args.mirror}", file=sys.stderr)
        return 1

    print(f"staging {args.mirror.name} -> {args.out.relative_to(REPO)}")
    dropped = copy_mirror(args.mirror, args.out)
    print(f"  dropped {dropped} stray files (plus login/signup duplicates)")

    applied, skipped = apply_overlay(args.overlay, args.out)
    if applied or skipped:
        print(f"  overlaid {applied} signed-in captures ({skipped} still locked)")

    chunks = chunk_map(args.out)
    if not chunks:
        print("  ! no _next chunks found", file=sys.stderr)
        return 1

    linked = duplicate_asset_names(args.out)
    print(f"  aliased {linked} assets to their live filenames")

    if not patch_public_path(args.out):
        print("  ! webpack publicPath not found — chunk loads will miss", file=sys.stderr)

    pages, repairs = repair_pages(args.out, chunks)
    print(f"  repaired {repairs} chunk references across {pages} pages")

    total_pages = 0
    locked = 0
    for page in args.out.rglob("*.html"):
        total_pages += 1
        if LOCKED_RE.search(page.read_text(encoding="utf-8", errors="replace")):
            locked += 1

    size = sum(f.stat().st_size for f in args.out.rglob("*") if f.is_file())
    print(f"\n  {total_pages} pages, {size / 1_048_576:.1f} MB staged")
    if locked:
        print(
            f"  {locked} still show the paywall — run "
            "`node scripts/fetch_chaivisual_content.mjs` signed in to fill them"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
