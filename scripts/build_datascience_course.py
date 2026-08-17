#!/usr/bin/env python3
"""Extract the Data Science Labs course structure into a bundled data module.

Source is the mirrored datascience.chaicode.com site. The site is a React SPA
whose lesson prose and animations only exist inside its own JS bundle, so those
stay behind and get rendered in an embedded frame. What we pull out here is
everything needed to drive a native shell around it: the track -> module ->
lesson tree, per-lesson metadata, and all 382 graded exercises.

Three sources, each chosen because it is the one that carries the field cleanly:

  <track>.html            module grouping, lesson order, durations, exercise counts
  <track>/<lesson>.html   JSON-LD `teaches` (the "covers" tags) and capstone flag
  challenges/<track>.html exercise prompts, in lesson order

Usage:
    python3 scripts/build_datascience_course.py [--mirror DIR] [--out FILE]
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DEFAULT_MIRROR = REPO / "datascience.chaicode.com"
DEFAULT_OUT = REPO / "src" / "data" / "dataScienceCourseData.js"

# Slug -> display name. The mirror uses `ml` for the folder but "Machine
# Learning" everywhere in prose, so the two can't be derived from each other.
TRACKS = [
    ("numpy", "NumPy"),
    ("pandas", "pandas"),
    ("matplotlib", "Matplotlib"),
    ("ml", "Machine Learning"),
]

# The mirror serves .html files; the app addresses lessons by extension-less
# path so the embedded SPA's router resolves them as real routes.
TAG_RE = re.compile(r"<[^>]+>")
COMMENT_RE = re.compile(r"<!--.*?-->", re.S)


def text_of(fragment: str) -> str:
    """Strip markup from a prerendered fragment, leaving readable text.

    React's prerenderer splits interpolated text with `<!-- -->` markers, so
    those have to go before tags or words get glued together.
    """
    out = COMMENT_RE.sub("", fragment)
    out = TAG_RE.sub("", out)
    return html.unescape(out).strip()


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def parse_track_page(mirror: Path, slug: str) -> tuple[dict, list[dict]]:
    """Pull the module grouping and lesson rows out of a track hub page."""
    src = read(mirror / f"{slug}.html")
    body = src[src.find("<main") :]

    header = {
        "tagline": "",
        "lessonCount": 0,
        "exerciseCount": 0,
    }
    tagline = re.search(
        r'<h1[^>]*>.*?</h1><p class="mt-2 [^"]*">(.*?)</p>', body, re.S
    )
    if tagline:
        header["tagline"] = text_of(tagline.group(1))

    counts = re.search(r"of\s*<!-- -->(\d+)<!-- --> lessons built", body)
    if counts:
        header["lessonCount"] = int(counts.group(1))
    counts = re.search(r"of\s*<!-- -->(\d+)<!-- --> exercises solved", body)
    if counts:
        header["exerciseCount"] = int(counts.group(1))

    # Each module is a <section> holding a "Module N" label, a title, a tagline,
    # and an <ol> of lesson anchors.
    modules = []
    for chunk in body.split("<section>")[1:]:
        label = re.search(r"Module <!-- -->(\d+)</span>", chunk)
        title = re.search(r'<h2 class="font-display[^"]*">(.*?)</h2>', chunk, re.S)
        if not label or not title:
            continue
        mod_tagline = re.search(r'<p class="mb-3 [^"]*">(.*?)</p>', chunk, re.S)

        lessons = []
        for a in re.finditer(
            r'<a class="group flex items-center[^"]*" href="([^"]+)">(.*?)</a>',
            chunk,
            re.S,
        ):
            href, inner = a.group(1), a.group(2)
            number = re.search(r'group-hover:text-chai">(\d+)</span>', inner)
            l_title = re.search(r'<h3 class="font-display[^"]*">(.*?)</h3>', inner, re.S)
            l_tagline = re.search(r'<p class="mt-0\.5 [^"]*">(.*?)</p>', inner, re.S)
            minutes = re.search(r">(\d+)<!-- --> min<", inner)
            ex = re.search(r">(\d+)<!-- -->/<!-- -->(\d+)</span>", inner)
            if not (number and l_title):
                continue
            lessons.append(
                {
                    "number": int(number.group(1)),
                    "slug": href.split("/")[-1].removesuffix(".html"),
                    "title": text_of(l_title.group(1)),
                    "tagline": text_of(l_tagline.group(1)) if l_tagline else "",
                    "minutes": int(minutes.group(1)) if minutes else 0,
                    "exercises": int(ex.group(2)) if ex else 0,
                    "isCapstone": "&gt;capstone&lt;" in inner or ">capstone<" in inner,
                }
            )

        modules.append(
            {
                "number": int(label.group(1)),
                "title": text_of(title.group(1)),
                "tagline": text_of(mod_tagline.group(1)) if mod_tagline else "",
                "lessons": lessons,
            }
        )

    return header, modules


def parse_lesson_page(mirror: Path, track: str, lesson_slug: str) -> dict:
    """Read the per-lesson JSON-LD for the fields the hub page doesn't carry."""
    path = mirror / track / f"{lesson_slug}.html"
    if not path.exists():
        return {}
    src = read(path)
    block = re.search(
        r'<script type="application/ld\+json" id="route-jsonld">(.*?)</script>', src, re.S
    )
    if not block:
        return {}
    try:
        data = json.loads(block.group(1))
    except json.JSONDecodeError:
        return {}

    covers = data.get("teaches") or []
    minutes = 0
    if isinstance(data.get("timeRequired"), str):
        m = re.match(r"PT(\d+)M", data["timeRequired"])
        if m:
            minutes = int(m.group(1))
    return {
        "covers": covers if isinstance(covers, list) else [],
        "minutes": minutes,
        "isCapstone": data.get("learningResourceType") == "Capstone",
        "level": data.get("educationalLevel", ""),
    }


def parse_challenges(mirror: Path, track: str) -> list[dict]:
    """Pull every exercise prompt for a track, tagged with its parent lesson."""
    path = mirror / "challenges" / f"{track}.html"
    if not path.exists():
        return []
    src = read(path)
    body = src[src.find("<main") :]

    exercises = []
    # Prompts appear inside <ol> blocks, each preceded by the lesson anchor the
    # exercises belong to. Walking anchors in document order keeps them paired.
    for block in re.finditer(
        r'<a class="font-sans[^"]*" href="\.\./([a-z]+)/([a-z0-9-]+)\.html">(.*?)</a>'
        r'.*?<ol class="mt-2[^"]*">(.*?)</ol>',
        body,
        re.S,
    ):
        lesson_slug, lesson_title, items = block.group(2), text_of(block.group(3)), block.group(4)
        for a in re.finditer(
            r'<a class="group flex items-start[^"]*" href="\.\./[a-z]+/[a-z0-9-]+/([a-z0-9-]+)\.html">(.*?)</a>',
            items,
            re.S,
        ):
            slug, inner = a.group(1), a.group(2)
            prompt = re.search(r'<span class="min-w-0 flex-1[^"]*">(.*?)</span>', inner, re.S)
            number = re.search(r'<span class="mt-\[1px\][^"]*">(\d+)</span>', inner)
            exercises.append(
                {
                    "slug": slug,
                    "track": track,
                    "lessonSlug": lesson_slug,
                    "lessonTitle": lesson_title,
                    "number": int(number.group(1)) if number else 0,
                    "prompt": text_of(prompt.group(1)) if prompt else "",
                }
            )
    return exercises


def parse_home_art(mirror: Path) -> dict[str, dict]:
    """Read each track card's background art and progress-bar colour.

    The landing page gives every track a chapter illustration bled across the
    top of its card and a distinct accent on its progress bar. Both are part of
    how the page reads, so they come across as data rather than being invented.
    """
    src = read(mirror / "index.html")
    slugs = "|".join(slug for slug, _ in TRACKS)
    art = {}
    # Anchored on the track hrefs specifically — matching any *.html also picks
    # up the masthead's link to index.html — and read as a fixed span after the
    # href rather than up to </a>, since a whole card runs past any sane bound.
    for match in re.finditer(rf'href="({slugs})\.html"', src):
        slug = match.group(1)
        if slug in art:
            continue
        block = src[match.end() : match.end() + 2500]
        image = re.search(r"art/([a-z-]+\.(?:webp|jpg))", block)
        bar = re.search(r"background:var\(--color-([a-z0-9]+)\)", block)
        if image:
            art[slug] = {"art": image.group(1), "accent": bar.group(1) if bar else "chai"}
    return art


def build(mirror: Path) -> dict:
    tracks = []
    all_exercises = []
    art = parse_home_art(mirror)

    for slug, name in TRACKS:
        header, modules = parse_track_page(mirror, slug)

        for module in modules:
            for lesson in module["lessons"]:
                meta = parse_lesson_page(mirror, slug, lesson["slug"])
                lesson["covers"] = meta.get("covers", [])
                lesson["isCapstone"] = lesson["isCapstone"] or meta.get("isCapstone", False)
                if not lesson["minutes"]:
                    lesson["minutes"] = meta.get("minutes", 0)
                lesson["path"] = f"{slug}/{lesson['slug']}"

        exercises = parse_challenges(mirror, slug)
        all_exercises.extend(exercises)

        lessons = [l for m in modules for l in m["lessons"]]
        tracks.append(
            {
                "id": slug,
                "slug": slug,
                "name": name,
                "tagline": header["tagline"],
                "lessonCount": len(lessons),
                "exerciseCount": header["exerciseCount"] or len(exercises),
                "minutes": sum(l["minutes"] for l in lessons),
                "capstoneCount": sum(1 for l in lessons if l["isCapstone"]),
                # The home card lists the opening lessons by name, the way the
                # site's own track cards do, then counts off the remainder.
                "preview": [l["title"] for l in lessons[:4]],
                "previewMore": max(0, len(lessons) - 4),
                "entry": lessons[0]["path"] if lessons else "",
                **art.get(slug, {"art": "social-card.webp", "accent": "chai"}),
                "modules": modules,
            }
        )

    return {"tracks": tracks, "exercises": all_exercises}


def emit(data: dict, out: Path) -> None:
    tracks = json.dumps(data["tracks"], indent=2, ensure_ascii=False)
    exercises = json.dumps(data["exercises"], indent=2, ensure_ascii=False)
    total_lessons = sum(t["lessonCount"] for t in data["tracks"])
    total_exercises = len(data["exercises"])
    total_minutes = sum(t["minutes"] for t in data["tracks"])

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        f"""/* Generated by scripts/build_datascience_course.py — do not edit by hand.
 *
 * The Data Science Labs course structure, extracted from the mirrored site.
 * Lesson prose and the step-through animations are not here: they live inside
 * the mirror's own JS bundle and are rendered in an embedded frame, served
 * from /datascience/. This module drives everything around that frame — the
 * tree, the overview cards, search, and progress.
 */

export const DS_BASE_PATH = "/datascience";

/* The landing page's own copy, so the native home reads as the site's home
   rather than as a paraphrase of it. Lifted from index.html. */
export const DS_HOME = {{
  eyebrow: "Watch it happen. Then write it yourself.",
  title: ["Learn data science by", "watching it happen."],
  lede:
    "Every method gets an animation that shows what actually moves — arrays "
    + "stretching to broadcast, rows flying into groups, masks lighting up. Then "
    + "you write the code yourself and real Python checks your answer.",
  tracksTitle: "The tracks",
  tracksLede:
    "Each library gets the basics in depth, then a capstone that puts them together.",
}};

export const DS_TRACKS = {tracks};

/* Every graded exercise, flattened. Each one is a real page under
   /datascience/<track>/<lesson>/<slug> with a Python checker behind it. */
export const DS_EXERCISES = {exercises};

export const DS_TOTALS = {{
  tracks: {len(data["tracks"])},
  modules: {sum(len(t["modules"]) for t in data["tracks"])},
  lessons: {total_lessons},
  exercises: {total_exercises},
  capstones: {sum(t["capstoneCount"] for t in data["tracks"])},
  minutes: {total_minutes},
}};

const LESSON_INDEX = new Map();
DS_TRACKS.forEach((track) => {{
  track.modules.forEach((module) => {{
    module.lessons.forEach((lesson) => {{
      LESSON_INDEX.set(lesson.path, {{ ...lesson, track, module }});
    }});
  }});
}});

/* All lessons in reading order, which is what prev/next walks. */
export const DS_LESSON_ORDER = [...LESSON_INDEX.keys()];

export function getLesson(path) {{
  return LESSON_INDEX.get(path) || null;
}}

export function getTrack(id) {{
  return DS_TRACKS.find((track) => track.id === id) || null;
}}

/* Exercises belonging to one lesson, in the order they appear in it. */
export function getLessonExercises(track, lessonSlug) {{
  return DS_EXERCISES.filter(
    (exercise) => exercise.track === track && exercise.lessonSlug === lessonSlug,
  );
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

    data = build(args.mirror)
    emit(data, args.out)

    for track in data["tracks"]:
        print(
            f"  {track['name']:<18} {len(track['modules'])} modules  "
            f"{track['lessonCount']:>3} lessons  {track['exerciseCount']:>3} exercises  "
            f"{track['minutes']:>4} min"
        )
    print(
        f"\n  {len(data['tracks'])} tracks, "
        f"{sum(len(t['modules']) for t in data['tracks'])} modules, "
        f"{sum(t['lessonCount'] for t in data['tracks'])} lessons, "
        f"{len(data['exercises'])} exercises -> {args.out.relative_to(REPO)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
