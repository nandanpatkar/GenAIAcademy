#!/usr/bin/env python3
"""Stage the Data Science Labs static mirror for serving under /datascience/.

The mirror is a React SPA that was built to live at an origin root: its router
matches `/<track>/<lesson>` and its assets are root-absolute. Dropping it under
a subpath therefore needs three fixes, all of which this script applies to a
copy — the pristine mirror is never modified.

  1. The Pyodide worker is missing. HTTrack cannot see
     `new URL("/assets/runtime.worker-*.js", import.meta.url)`, so the file that
     actually runs and grades Python was never mirrored. Without it every
     exercise hangs on "Putting the kettle on…". We fetch it from the live site.

  2. Root-absolute asset paths (/art, /notes, /assets, /chai-mascot.png) are
     prefixed with /datascience so they resolve under the subpath.

  3. React Router's default basename is flipped from "/" to "/datascience", so
     the SPA's internal links stay inside the mount point instead of escaping
     into the host app's routes.

Output is gitignored; ship it with scripts/upload_docs_archive.mjs like the
other mirrors in this repo.

Usage:
    python3 scripts/build_datascience_mirror.py [--mirror DIR] [--out DIR]
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DEFAULT_MIRROR = REPO / "datascience.chaicode.com"
DEFAULT_OUT = REPO / "public" / "datascience"

BASE = "/datascience"
LIVE_ORIGIN = "https://datascience.chaicode.com"
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)

# Junk HTTrack leaves behind that should not ship.
DROP = {".DS_Store", "cdn-cgi"}

# Every root-absolute reference the bundle makes, verified by enumerating
# string and template literals in index-*.js. Order matters only in that each
# pattern must be specific enough not to match an already-prefixed path.
ASSET_PREFIXES = ("/art/", "/notes/", "/assets/", "/chai-mascot.png", "/favicon.png")

# react-router's Router component defaults basename to "/" when the app does not
# pass one. This mirror's app does not, so retargeting the default relocates the
# entire route tree.
BASENAME_FROM = 'basename:n="/",children:r=null'
BASENAME_TO = f'basename:n="{BASE}",children:r=null'


def copy_mirror(mirror: Path, out: Path) -> None:
    if out.exists():
        shutil.rmtree(out)
    shutil.copytree(
        mirror,
        out,
        ignore=shutil.ignore_patterns(*DROP),
    )


# Content-hashed chunk names, as they appear in import specifiers and in the
# `new URL(...)` the worker is spawned from.
CHUNK_RE = re.compile(r"[\"'`](?:\./|/assets/)([A-Za-z0-9_.-]+-[A-Za-z0-9_-]{8}\.(?:js|css))")


def fetch_missing_assets(out: Path) -> int:
    """Download the chunks HTTrack could not see.

    A mirror only captures what appears in markup. Vite addresses its lazy
    chunks and its worker through `import()` and `new URL(..., import.meta.url)`,
    so those files — including the Pyodide runtime that grades every exercise —
    are silently absent. Each fetched chunk can name further chunks, so this
    walks transitively until the reference set closes.
    """
    assets = out / "assets"
    assets.mkdir(parents=True, exist_ok=True)

    seen: set[str] = set()
    queue = [p.name for p in assets.glob("*.js")]
    fetched = 0

    while queue:
        name = queue.pop()
        if name in seen:
            continue
        seen.add(name)

        target = assets / name
        if not target.exists():
            url = f"{LIVE_ORIGIN}/assets/{name}"
            # The origin sits behind Cloudflare, which 403s urllib's default agent.
            request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            try:
                with urllib.request.urlopen(request, timeout=30) as response:
                    payload = response.read()
            except OSError as error:
                print(f"  ! could not fetch {name}: {error}", file=sys.stderr)
                continue
            target.write_bytes(payload)
            fetched += 1
            print(f"  fetched assets/{name} ({len(payload):,} bytes)")

        if target.suffix == ".js":
            body = target.read_text(encoding="utf-8", errors="replace")
            queue.extend(n for n in CHUNK_RE.findall(body) if n not in seen)

    if fetched == 0:
        print("  no missing assets")
    return fetched


def patch_scripts(out: Path) -> None:
    """Relocate the bundle's root-absolute references onto the mount point.

    Applies to every JS asset, not just the entry chunk, since the lazily
    fetched ones carry their own asset paths.
    """
    basename_done = False
    for script in sorted((out / "assets").glob("*.js")):
        source = script.read_text(encoding="utf-8", errors="replace")
        original = source

        for prefix in ASSET_PREFIXES:
            # Only rewrite where the path opens a string or template literal, so
            # a substring of some longer unrelated path is never touched.
            for quote in ('"', "`", "'"):
                source = source.replace(f"{quote}{prefix}", f"{quote}{BASE}{prefix}")

        if BASENAME_FROM in source:
            source = source.replace(BASENAME_FROM, BASENAME_TO, 1)
            basename_done = True
        elif BASENAME_TO in source:
            basename_done = True

        if source != original:
            script.write_text(source, encoding="utf-8")
            print(f"  patched assets/{script.name}")

    if not basename_done:
        print("  ! basename default not found — routing will escape the mount", file=sys.stderr)


def rewrite_html(out: Path) -> None:
    """Point the prerendered pages at the relocated bundle and icons.

    HTTrack rewrote these to relative paths that only resolve at the depth each
    page happens to sit at. Absolute /datascience paths work from every depth,
    which matters because the app addresses lessons by extension-less URL.
    """
    count = 0
    for page in out.rglob("*.html"):
        source = page.read_text(encoding="utf-8", errors="replace")
        original = source

        # ../../assets/x -> /datascience/assets/x, and the same for the art,
        # notes and icon references the prerendered head carries.
        source = re.sub(
            r'((?:src|href)=")(?:\.\./)+(assets|art|notes)/',
            rf"\1{BASE}/\2/",
            source,
        )
        source = re.sub(
            r'((?:src|href)=")(?:\.\./)*(favicon\.png|apple-touch-icon\.png|chai-mascot\.png)"',
            rf'\1{BASE}/\2"',
            source,
        )

        # Cloudflare injected two things into the live pages that were mirrored
        # along with them: the Web Analytics beacon, and the bot-detection
        # bootstrap that builds a hidden iframe and pulls a challenge script
        # from /cdn-cgi/. Neither belongs in an embedded lesson — the beacon
        # reports our readers to a third party's analytics, and the challenge
        # path no longer resolves, so it 404s on every single load.
        source = re.sub(
            r'<script[^>]*src="https://static\.cloudflareinsights\.com[^"]*"[^>]*>\s*</script>',
            "",
            source,
        )
        source = re.sub(
            r"<script\b[^>]*>(?:(?!</script>).)*__CF\$cv\$params(?:(?!</script>).)*</script>",
            "",
            source,
            flags=re.S,
        )

        if source != original:
            page.write_text(source, encoding="utf-8")
            count += 1
    print(f"  rewrote asset paths in {count} pages")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mirror", type=Path, default=DEFAULT_MIRROR)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    parser.add_argument(
        "--skip-worker",
        action="store_true",
        help="work offline: skip fetching the chunks HTTrack missed, including "
        "the Pyodide worker (exercises will not grade without it)",
    )
    args = parser.parse_args()

    if not args.mirror.exists():
        print(f"mirror not found: {args.mirror}", file=sys.stderr)
        return 1

    print(f"staging {args.mirror.name} -> {args.out.relative_to(REPO)}")
    copy_mirror(args.mirror, args.out)

    if not sorted((args.out / "assets").glob("index-*.js")):
        print("  ! no index-*.js bundle found", file=sys.stderr)
        return 1

    # Fetch before patching: the discovery regex matches the original
    # root-absolute specifiers, which patching rewrites.
    if not args.skip_worker:
        fetch_missing_assets(args.out)
    patch_scripts(args.out)
    rewrite_html(args.out)

    size = sum(f.stat().st_size for f in args.out.rglob("*") if f.is_file())
    pages = sum(1 for _ in args.out.rglob("*.html"))
    print(f"\n  {pages} pages, {size / 1_048_576:.1f} MB staged")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
