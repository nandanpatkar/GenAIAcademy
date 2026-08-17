#!/usr/bin/env python3
"""Extract the Chai Visual course structure into a bundled data module.

Source is the mirrored dsa.chaicode.com site — a Next.js app covering four
tracks: DSA patterns, low-level design, computer networking and operating
systems. Unlike the Data Science mirror, its pages are fully prerendered, so
the reading content survives in the HTML; what does not survive is the canvas
animation work, which is why lessons are framed rather than rebuilt.

Two shapes of source, because the site itself has two:

  <pattern>/<topic>.html   DSA and LLD carry a full sidebar <nav> listing every
                           group and topic, so one page yields the whole tree.
  computer-network.html    Networking and OS are hub pages: chapters grouped
  operating-system.html    under <h2> parts, each with a number and a blurb.

Usage:
    python3 scripts/build_chaivisual_course.py [--mirror DIR] [--out FILE]
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DEFAULT_MIRROR = REPO / "dsa.chaicode.com"
DEFAULT_OUT = REPO / "src" / "data" / "chaiVisualCourseData.js"

TAG_RE = re.compile(r"<[^>]+>")
NAV_RE = re.compile(r'<nav class="mt-8 space-y-5 flex-1">(.*?)</nav>', re.S)
# A nav group: a heading button, then a <ul> of topic anchors.
GROUP_RE = re.compile(
    r'<span class="font-hand text-xl[^"]*">(.*?)</span>.*?<ul[^>]*>(.*?)</ul>', re.S
)
NAV_LINK_RE = re.compile(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', re.S)


def text_of(fragment: str) -> str:
    return html.unescape(TAG_RE.sub("", fragment)).strip()


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def normalise(href: str, base_dir: str) -> str:
    """Turn a mirror-relative href into a mount-relative, extension-less path.

    Hrefs in the nav are written relative to the page they appear on
    ("../arrays-hashing/two-sum.html", "intro.html"), while the app addresses
    lessons the way the Next router does — "arrays-hashing/two-sum".
    """
    href = href.split("?")[0].split("#")[0]
    parts = [p for p in base_dir.split("/") if p]
    for token in href.split("/"):
        if token == "..":
            if parts:
                parts.pop()
        elif token and token != ".":
            parts.append(token)
    return "/".join(parts).removesuffix(".html")


def parse_nav_track(mirror: Path, pages: list[str]) -> list[dict]:
    """Read a sidebar nav into groups of topics.

    Every DSA and LLD page carries the same complete tree, so any one of them
    is a valid source — with one wrinkle: the nav entry for the page you are
    currently on renders without its grey subtitle. Parsing two pages from
    different groups and filling the gaps from each other recovers all of them.
    """
    groups = _parse_nav_page(mirror, pages[0])
    for extra in pages[1:]:
        fallback = {
            item["path"]: item["subtitle"]
            for group in _parse_nav_page(mirror, extra)
            for item in group["items"]
        }
        for group in groups:
            for item in group["items"]:
                if not item["subtitle"]:
                    item["subtitle"] = fallback.get(item["path"], "")
    return groups


def _parse_nav_page(mirror: Path, page: str) -> list[dict]:
    src = read(mirror / page)
    nav = NAV_RE.search(src)
    if not nav:
        return []
    base_dir = str(Path(page).parent).replace(".", "")

    groups = []
    for match in GROUP_RE.finditer(nav.group(1)):
        title = text_of(match.group(1))
        items = []
        for link in NAV_LINK_RE.finditer(match.group(2)):
            href, inner = link.group(1), link.group(2)
            # The topic title is the anchor's own text; the grey line under it
            # is a nested <span> that has to be split off, not stripped away.
            sub = re.search(r'<span class="block text-xs text-mute">(.*?)</span>', inner, re.S)
            subtitle = text_of(sub.group(1)) if sub else ""
            full = text_of(inner)
            title_only = full[: -len(subtitle)].strip() if subtitle and full.endswith(subtitle) else full
            path = normalise(href, base_dir)
            items.append({"path": path, "title": title_only, "subtitle": subtitle})
        if items:
            groups.append({"title": title, "items": items})
    return groups


def parse_hub_track(mirror: Path, page: str, folder: str) -> list[dict]:
    """Read a hub page whose chapters are grouped under <h2> parts."""
    src = read(mirror / page)
    body = src[src.find("<main") if "<main" in src else 0 :]

    # Split on the part headings so each chapter lands under the right one.
    # Both hubs also put a single unheaded intro card above the first part —
    # skipping it would silently drop a real chapter, so it gets its own group.
    parts = re.split(r'<h2[^>]*>(.*?)</h2>', body, flags=re.S)
    sections = [("Introduction", parts[0])]
    sections += [
        (text_of(parts[i]), parts[i + 1] if i + 1 < len(parts) else "")
        for i in range(1, len(parts), 2)
    ]

    groups = []
    for title, chunk in sections:
        items = []
        for match in re.finditer(
            rf'<a[^>]+href="({re.escape(folder)}/[^"]+)"[^>]*>(.*?)</a>', chunk, re.S
        ):
            href, inner = match.group(1), match.group(2)
            # The card is three spans: a numbered badge, the title, and a blurb
            # that carries the section count appended after a middot.
            # Networking writes the title span as "block font-hand …" and gives
            # each chapter a blurb; OS writes "block truncate font-hand …" and
            # carries only a section count. One pattern has to cover both.
            number = re.search(r'rounded-full[^"]*"[^>]*>([^<]{1,4})</span>', inner)
            heading = re.search(r'<span class="block[^"]*font-hand[^"]*">(.*?)</span>', inner, re.S)
            blurb = re.search(r'<span class="(?:mt-0\.5 )?block[^"]*text-(?:sm|xs)[^"]*">(.*?)</span>', inner, re.S)

            subtitle, sections = "", 0
            if blurb:
                raw = blurb.group(1)
                count = re.search(r"(?:<!-- -->)?(\d+)(?:<!-- -->)?\s*sections", raw)
                if count:
                    sections = int(count.group(1))
                # Networking reads "<blurb> · N sections"; OS reads just
                # "N sections". Removing the count from the flattened text
                # leaves the blurb, or nothing at all.
                subtitle = re.sub(r"·?\s*\d+\s*sections\s*$", "", text_of(raw)).strip(" ·")

            items.append(
                {
                    "path": normalise(href, ""),
                    "title": text_of(heading.group(1)) if heading else text_of(inner)[:60],
                    "subtitle": subtitle,
                    "number": text_of(number.group(1)) if number else "",
                    "sections": sections,
                }
            )
        if items:
            groups.append({"title": title, "items": items})
    return groups


def parse_home_cards(mirror: Path) -> dict[str, dict]:
    """Read the landing page's track cards, keyed by their entry path.

    The home screen is rebuilt natively rather than framed, so the badge, the
    topic chips and the "18 patterns · 167 topics" line all have to come across
    as data. Cards are keyed by entry href because that is the only field the
    card shares with the track it opens.
    """
    src = read(mirror / "index.html")
    cards = {}
    for match in re.finditer(
        r'<a class="group sketch-border[^"]*" href="([^"]+)">(.*?)</a>', src, re.S
    ):
        href, inner = match.group(1), match.group(2)
        badge = re.search(r'rounded-full px-2 py-0\.5[^"]*">(.*?)</span>', inner, re.S)
        chips = re.findall(r'border border-ink/15 rounded-full[^"]*">(.*?)</span>', inner, re.S)
        more = re.search(r'>\+<!-- -->(\d+)<!-- --> more<', inner)
        summary = re.search(r'<span class="font-mono[^"]*">(.*?)</span>', inner, re.S)
        cards[normalise(href, "")] = {
            "badge": text_of(badge.group(1)) if badge else "",
            "chips": [text_of(c) for c in chips],
            "moreChips": int(more.group(1)) if more else 0,
            "summary": text_of(summary.group(1)) if summary else "",
        }
    return cards


def build(mirror: Path) -> list[dict]:
    tracks = [
        {
            "id": "dsa",
            "name": "DSA Visual",
            "subtitle": "Data Structures & Algorithms",
            "tagline": "Animated, step-by-step walkthroughs from two pointers to dynamic "
            "programming. Brute force first, then the optimized trick — always with the why.",
            # Only the two-pointers pages carry the full sidebar in the mirror;
            # the second one exists purely to recover intro's own subtitle,
            # which the page it is active on does not render.
            "groups": parse_nav_track(mirror, ["two-pointers/intro.html", "two-pointers/two-sum-ii.html"]),
        },
        {
            "id": "lld",
            "name": "LLD Visual",
            "subtitle": "Low-Level & OOP Design",
            "tagline": "Object-oriented design taught with animated UML — class & sequence "
            "diagrams that build themselves, plus the theory behind every pattern.",
            # The LLD nav lists titles only — there are no subtitles to recover.
            "groups": parse_nav_track(mirror, ["lld/lld-intro/overview.html"]),
        },
        {
            "id": "networking",
            "name": "Networking Visual",
            "subtitle": "Computer Networks, from the wire up",
            "tagline": "From a single fetch() down to bits on the wire and back up through "
            "TCP, DNS, HTTP and TLS. Every step illustrated, so the network stops being a black box.",
            "groups": parse_hub_track(mirror, "computer-network.html", "computer-network"),
        },
        {
            "id": "os",
            "name": "Operating Systems Visual",
            "subtitle": "How your machine really runs your code",
            "tagline": "Processes, scheduling, concurrency, virtual memory and file systems, "
            "explained the way a working engineer needs them — from a system call down to the kernel.",
            "groups": parse_hub_track(mirror, "operating-system.html", "operating-system"),
        },
    ]

    # The DSA and LLD cards link straight at a first lesson; the two note tracks
    # link at their hub page instead, so the card key cannot be derived from the
    # track's entry point and is stated per track.
    card_keys = {
        "dsa": "two-pointers/intro",
        "lld": "lld/lld-intro/overview",
        "networking": "computer-network",
        "os": "operating-system",
    }
    cards = parse_home_cards(mirror)
    blank = {"badge": "", "chips": [], "moreChips": 0, "summary": ""}

    for track in tracks:
        items = [i for g in track["groups"] for i in g["items"]]
        track["groupCount"] = len(track["groups"])
        track["lessonCount"] = len(items)
        track["entry"] = items[0]["path"] if items else ""
        track.update(cards.get(card_keys[track["id"]], blank))

    return tracks


def emit(tracks: list[dict], out: Path) -> None:
    total = sum(t["lessonCount"] for t in tracks)
    payload = json.dumps(tracks, indent=2, ensure_ascii=False)

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        f"""/* Generated by scripts/build_chaivisual_course.py — do not edit by hand.
 *
 * The Chai Visual course structure, extracted from the mirrored dsa.chaicode.com.
 * Lesson bodies are prerendered in the mirror and the animations are canvas work
 * inside its own bundle, so pages are framed from /chai-visual/ rather than
 * rebuilt. This module drives the shell around them: the tree, the overview,
 * search and progress.
 */

export const CV_BASE_PATH = "/chai-visual";

/* The landing page's own copy, so the native home reads as the site's home
   rather than as a paraphrase of it. Lifted from index.html. */
export const CV_HOME = {{
  eyebrow: "Watch computer science think",
  title: ["Data.", "Systems.", "Algorithms."],
  lede:
    "DSA here means all three — not just data structures and algorithms. "
    + "Pointers gliding, packets crossing the wire, a scheduler switching "
    + "context. Press play and watch the idea unfold.",
  chips: ["Algorithms", "Low-level design", "Networking", "Operating systems"],
  pitch: {{
    eyebrow: "Brute force → better",
    title: "Never stop at the first answer.",
    body:
      "Every problem carries its approaches side by side — the obvious brute "
      + "force and the sharp optimization. Jump between them in a tap and watch "
      + "the time and space complexity fall, so you learn the why, not just the trick.",
  }},
  tracksTitle: "Pick a track",
  tracksLede: "Every topic is taught the same way — by animating it. Jump straight in.",
}};

export const CV_TRACKS = {payload};

/* A standalone page rather than a track: the site's AI Roadmap pitch, which
   has no lessons under it. It appears on the home screen beside the four
   tracks and opens in the same frame. */
export const CV_EXTRAS = [
  {{
    id: "ai-roadmap",
    path: "ai-roadmap",
    name: "AI Roadmap",
    subtitle: "A learning plan for the days you actually have",
    tagline:
      "Tell it what you want to learn and it drafts the whole syllabus — ordered "
      + "so nothing depends on something you have not learnt yet, then served one "
      + "honest list each morning.",
    badge: "Extra",
    chips: ["Any subject", "Ordered", "Daily plan"],
  }},
];

export const CV_TOTALS = {{
  tracks: {len(tracks)},
  groups: {sum(t["groupCount"] for t in tracks)},
  lessons: {total},
}};

const LESSON_INDEX = new Map();
CV_TRACKS.forEach((track) => {{
  track.groups.forEach((group) => {{
    group.items.forEach((item, index) => {{
      LESSON_INDEX.set(item.path, {{ ...item, track, group, indexInGroup: index }});
    }});
  }});
}});

/* Reading order across the whole course, which is what prev/next walks. */
export const CV_LESSON_ORDER = [...LESSON_INDEX.keys()];

export function getLesson(path) {{
  return LESSON_INDEX.get(path) || null;
}}

export function getTrack(id) {{
  return CV_TRACKS.find((track) => track.id === id) || null;
}}

/* Which track a mirror path belongs to — used when navigation happens inside
   the frame and the shell has to catch up with it. */
export function trackOf(path) {{
  const lesson = LESSON_INDEX.get(path);
  return lesson ? lesson.track.id : null;
}}
""",
        encoding="utf-8",
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mirror", type=Path, default=DEFAULT_MIRROR)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    args = parser.parse_args()

    if not args.mirror.exists():
        print(f"mirror not found: {args.mirror}", file=sys.stderr)
        return 1

    tracks = build(args.mirror)
    missing = [t["name"] for t in tracks if not t["lessonCount"]]
    if missing:
        print(f"  ! no lessons extracted for: {', '.join(missing)}", file=sys.stderr)
        return 1

    emit(tracks, args.out)
    for track in tracks:
        print(f"  {track['name']:<26} {track['groupCount']:>2} groups  {track['lessonCount']:>3} lessons")
    print(
        f"\n  {len(tracks)} tracks, {sum(t['groupCount'] for t in tracks)} groups, "
        f"{sum(t['lessonCount'] for t in tracks)} lessons -> {args.out.relative_to(REPO)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
