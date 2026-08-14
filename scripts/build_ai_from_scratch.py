#!/usr/bin/env python3
"""Build the "AI from Scratch" curriculum index from the vendored source tree.

Reads:

  ai-engineering-from-scratch-main/
      phases/<NN-phase>/<NN-lesson>/docs/en.md    the lesson prose
                                   /code/**        runnable samples
                                   /assets/*.svg   figures the prose embeds
                                   /outputs/*.md   the artifact each lesson ships
                                   /quiz.json      pre / check / post questions
      certifications/claude/lessons/<NN-lesson>/   same shape, one extra track
      glossary/{terms,myths}.md                    reference guides
      ROADMAP.md                                   phase titles and time budgets

and emits:

  src/data/aiFromScratchData.js            tracks, phases, lesson index
  public/ai-from-scratch/md/<slug>.md      lesson bodies, fetched on demand
  public/ai-from-scratch/bundle/<slug>.json  code + quiz + artifacts, lazy too
  public/ai-from-scratch/assets/...        the figures, copied verbatim
  public/ai-from-scratch/build-report.json

Everything that ships is scrubbed first (see `sanitize`): the upstream project's
own repository links, install commands, maintainer name, and About / Report /
Sponsors / license chrome are removed, and cross-references between lessons are
rewritten to the `aifs:` protocol the viewer resolves in-app. Citations to
papers and vendor documentation are left clickable — they are lesson content,
not navigation back to the source project. The build fails if any forbidden
token survives into an output file.

Run:  python3 scripts/build_ai_from_scratch.py     (or `npm run build:aifs`)
"""
import json
import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "ai-engineering-from-scratch-main")
PHASES = os.path.join(SRC, "phases")
CERT_LESSONS = os.path.join(SRC, "certifications", "claude", "lessons")
GLOSSARY = os.path.join(SRC, "glossary")
ROADMAP = os.path.join(SRC, "ROADMAP.md")
SITE = os.path.join(SRC, "site")

OUT_DATA = os.path.join(ROOT, "src", "data", "aiFromScratchData.js")
OUT_PUB = os.path.join(ROOT, "public", "ai-from-scratch")
PUBLIC_PREFIX = "/ai-from-scratch"

MAX_CODE_BYTES = 200_000
SKIP_CODE_PARTS = {"__pycache__", ".pytest_cache", "node_modules", ".venv"}

# ── sanitization ──────────────────────────────────────────────────────────
#
# One list, used both to rewrite text and to verify the result. Anything that
# still matches VERIFY_FORBIDDEN after a full pass is a build failure, so a new
# upstream mention of the source project cannot quietly reach the app.

REPO_TOKENS = r"(?:rohitg00|ai-engineering-from-scratch|aifromscratch\.dev)"

# [text](https://github.com/rohitg00/…) -> text
LINK_TO_REPO = re.compile(
    r"\[([^\]\n]*)\]\(\s*<?[^)\s]*" + REPO_TOKENS + r"[^)\s]*>?\s*(?:\"[^\"]*\")?\)",
    re.I,
)
# <https://github.com/rohitg00/…> and bare autolinks
BARE_REPO_URL = re.compile(r"<?https?://[^\s>)\]]*" + REPO_TOKENS + r"[^\s>)\]]*>?", re.I)
# a whole line that only exists to point at the source project
REPO_LINE = re.compile(
    r"^.*(?:git\s+clone|npx\s+skills\s+add|gh\s+repo\s+clone|pip\s+install\s+git\+).*"
    + REPO_TOKENS + r".*$",
    re.I | re.M,
)
# shields.io / star-count / sponsor badges, always image links
BADGE_LINE = re.compile(
    r"^.*!\[[^\]]*\]\([^)]*(?:shields\.io|img\.shields|badgen\.net|star-history)[^)]*\).*$",
    re.I | re.M,
)
OPEN_SOURCE_MIT = re.compile(
    r"\b(?:free,?\s+)?open[\s-]source[\s,·|•-]*\bMIT\b[\s.-]*|"
    r"\bMIT[\s-]licen[cs]ed?\b[\s.-]*|"
    r"\bMIT\s+License\b[\s.-]*",
    re.I,
)
IDENTITY_SUBS = [
    (re.compile(r"\bRohit\s+Ghumare\b", re.I), ""),
    (re.compile(r"\brohitg00\s*/\s*", re.I), ""),
    (re.compile(r"\brohitg00\b", re.I), "learner"),
    # Lookarounds rather than \b: the name also shows up inside sample
    # identifiers (`rohit_5s.wav`, `user=rohit`), where a trailing `_` is a
    # word character and would defeat \b.
    (re.compile(r"(?<![A-Za-z0-9])Rohit(?![A-Za-z])"), "Alex"),
    (re.compile(r"(?<![A-Za-z0-9])rohit(?![A-Za-z])"), "alex"),
    # Samples use the upstream repository name as a stand-in project folder
    # (`cd ai-engineering-from-scratch`, `name = "…"`). By this point every
    # link, URL, and clone command carrying it is already gone, so the leftovers
    # are prose about a directory — renamed rather than deleted, which would
    # leave a dangling `cd`.
    (re.compile(r"\bai-engineering-from-scratch\b", re.I), "ai-from-scratch"),
]
# "agentmemory (agentmemory)" — the residue of de-linking `name (owner/name)`
DUPLICATE_PAREN = re.compile(r"\b([\w.-]+)\s+\(\1\)")

# Sections that are project chrome rather than teaching material. Matched on a
# heading of any level; everything up to the next heading of the same level goes.
CHROME_HEADINGS = re.compile(
    r"^(#{1,6})\s*(?:"
    r"about(?:\s+(?:this|the)\s+\w+)?|"
    r"about\s+the\s+author|author|maintainer[s]?|"
    r"license|licensing|"
    r"contributing|contribution[s]?|"
    r"sponsor[s]?|sponsorship|support\s+(?:this|the)\s+\w+|funding|donate|"
    r"report\s+(?:an?\s+)?(?:issue|bug|problem)|"
    r"issues?\s*(?:/|and|&)?\s*suggestions?|suggestions?|feedback|"
    r"star\s+history|acknowledge?ments?|credits?|"
    r"follow\s+(?:me|us)|stay\s+in\s+touch|community\s+links?"
    r")\s*:?\s*$",
    re.I,
)

VERIFY_FORBIDDEN = re.compile(
    r"rohitg00|rohit\s*ghumare|ai-engineering-from-scratch|"
    r"open[\s-]source\s*[·•|-]\s*MIT|MIT\s+Licen",
    re.I,
)


def drop_chrome_sections(text):
    """Delete About / License / Sponsors / Report-style sections wholesale."""
    lines = text.split("\n")
    out, skip_level, fenced = [], None, False
    for line in lines:
        if re.match(r"^\s*(```|~~~)", line):
            fenced = not fenced
        if not fenced:
            heading = re.match(r"^(#{1,6})\s", line)
            if heading:
                level = len(heading.group(1))
                if skip_level is not None and level <= skip_level:
                    skip_level = None
                if CHROME_HEADINGS.match(line.strip()):
                    skip_level = level
                    continue
        if skip_level is None:
            out.append(line)
    return "\n".join(out)


def sanitize(text, *, drop_sections=False):
    """Strip every trace of the source project's own branding and identity."""
    if not text:
        return text
    if drop_sections:
        text = drop_chrome_sections(text)
    text = BADGE_LINE.sub("", text)
    text = REPO_LINE.sub("", text)
    text = LINK_TO_REPO.sub(r"\1", text)
    text = BARE_REPO_URL.sub("", text)
    text = OPEN_SOURCE_MIT.sub("", text)
    for pattern, replacement in IDENTITY_SUBS:
        text = pattern.sub(replacement, text)
    text = DUPLICATE_PAREN.sub(r"\1", text)
    # De-linking and line drops leave holes; close them up.
    text = re.sub(r"[ \t]+$", "", text, flags=re.M)
    text = re.sub(r"\n{4,}", "\n\n\n", text)
    text = re.sub(r"^-\s*$\n?", "", text, flags=re.M)
    return text


# ── metadata parsing ──────────────────────────────────────────────────────

META_FIELD = re.compile(r"^\*\*(Type|Languages?|Prerequisites?|Time|Difficulty):\*\*\s*(.+)$")
TIME_MINUTES = re.compile(r"(\d+)\s*(?:min|minute)", re.I)
TIME_HOURS = re.compile(r"(\d+(?:\.\d+)?)\s*(?:hr|hour)", re.I)


def strip_links(text):
    """Markdown link text only — used for chips that must not render markup."""
    return re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text).strip()


def parse_lesson(markdown):
    """Split the lesson header (title, blurb, meta chips) off from the body."""
    lines = markdown.split("\n")
    title, blurb, meta = "", "", {}
    index = 0

    while index < len(lines) and not lines[index].strip():
        index += 1
    if index < len(lines) and lines[index].startswith("# "):
        title = lines[index][2:].strip()
        index += 1

    consumed = index
    while index < len(lines):
        line = lines[index].strip()
        if not line:
            index += 1
            continue
        if line.startswith("> ") and not blurb:
            block = []
            while index < len(lines) and lines[index].strip().startswith(">"):
                block.append(lines[index].strip().lstrip(">").strip())
                index += 1
            blurb = " ".join(part for part in block if part)
            consumed = index
            continue
        field = META_FIELD.match(line)
        if field:
            key = field.group(1).lower().rstrip("s") if field.group(1) != "Languages" else "languages"
            meta[key] = strip_links(field.group(2))
            index += 1
            consumed = index
            continue
        break

    body = "\n".join(lines[consumed:]).strip()
    minutes = 0
    raw_time = meta.get("time", "")
    if raw_time:
        hours = TIME_HOURS.search(raw_time)
        mins = TIME_MINUTES.search(raw_time)
        if hours:
            minutes = int(float(hours.group(1)) * 60)
        elif mins:
            minutes = int(mins.group(1))
    return {
        "title": title,
        "blurb": blurb,
        "type": meta.get("type", ""),
        "languages": meta.get("languages", ""),
        "prerequisites": meta.get("prerequisite", ""),
        "time": raw_time,
        "minutes": minutes,
        "body": body,
    }


def read(path):
    with open(path, "r", encoding="utf-8", errors="replace") as handle:
        return handle.read()


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as handle:
        handle.write(text)


def title_case_from_dir(name):
    return re.sub(r"^\d+[-_]", "", name).replace("-", " ").replace("_", " ").title()


# ── phase headings from ROADMAP.md ────────────────────────────────────────

def read_phase_meta():
    """`## Phase 14: Agent Engineering — ✅ (~52 hours)` -> title + hours."""
    meta = {}
    if not os.path.exists(ROADMAP):
        return meta
    for line in read(ROADMAP).split("\n"):
        match = re.match(r"^##\s*Phase\s+(\d+)\s*:\s*(.+?)\s*$", line)
        if not match:
            continue
        number = int(match.group(1))
        rest = match.group(2)
        hours = ""
        hour_match = re.search(r"\(~?\s*([\d.]+)\s*hours?\)", rest)
        if hour_match:
            hours = hour_match.group(1)
        title = re.split(r"\s+[—–-]\s+", rest)[0].strip()
        title = re.sub(r"\s*\([^)]*\)\s*$", "", title).strip()
        meta[number] = {"title": title, "hours": hours}
    return meta


# ── per-lesson collection ─────────────────────────────────────────────────

CODE_LANG = {
    ".py": "python", ".ts": "typescript", ".tsx": "tsx", ".js": "javascript",
    ".jsx": "jsx", ".sh": "bash", ".bash": "bash", ".json": "json",
    ".yaml": "yaml", ".yml": "yaml", ".toml": "toml", ".sql": "sql",
    ".md": "markdown", ".txt": "text", ".rs": "rust", ".go": "go",
    ".c": "c", ".cpp": "cpp", ".java": "java", ".ipynb": "json",
    ".cfg": "ini", ".ini": "ini", ".env": "bash", ".dockerfile": "docker",
}


def collect_code(lesson_dir):
    code_root = os.path.join(lesson_dir, "code")
    if not os.path.isdir(code_root):
        return []
    files = []
    for current, dirs, names in os.walk(code_root):
        dirs[:] = sorted(d for d in dirs if d not in SKIP_CODE_PARTS and not d.startswith("."))
        for name in sorted(names):
            if name.startswith(".") or name.endswith((".pyc", ".pyo")):
                continue
            full = os.path.join(current, name)
            try:
                if os.path.getsize(full) > MAX_CODE_BYTES:
                    continue
                source = read(full)
            except OSError:
                continue
            extension = os.path.splitext(name)[1].lower()
            if name.lower() == "dockerfile":
                extension = ".dockerfile"
            files.append({
                "path": os.path.relpath(full, code_root).replace(os.sep, "/"),
                "lang": CODE_LANG.get(extension, "text"),
                "source": sanitize(source),
            })
    return files


def collect_artifacts(lesson_dir):
    outputs = os.path.join(lesson_dir, "outputs")
    if not os.path.isdir(outputs):
        return []
    items = []
    for name in sorted(os.listdir(outputs)):
        if not name.endswith(".md"):
            continue
        items.append({
            "name": name[:-3],
            "markdown": sanitize(read(os.path.join(outputs, name)), drop_sections=True),
        })
    return items


def collect_quiz(lesson_dir):
    path = os.path.join(lesson_dir, "quiz.json")
    if not os.path.exists(path):
        return None
    try:
        quiz = json.loads(sanitize(read(path)))
    except (ValueError, OSError):
        return None
    # Most lessons ship {lesson, title, questions: [...]}; a few ship the bare list.
    questions = quiz if isinstance(quiz, list) else (quiz.get("questions") or [])
    return questions or None


def copy_assets(lesson_dir, slug):
    """Copy the lesson's figures and return the src rewrites the body needs.

    SVGs carry their own labels, so they are scrubbed like prose rather than
    copied byte for byte.
    """
    assets = os.path.join(lesson_dir, "assets")
    if not os.path.isdir(assets):
        return {}
    target = os.path.join(OUT_PUB, "assets", slug)
    mapping = {}
    for name in sorted(os.listdir(assets)):
        source = os.path.join(assets, name)
        if not os.path.isfile(source) or name.startswith("."):
            continue
        os.makedirs(target, exist_ok=True)
        if name.lower().endswith(".svg"):
            write(os.path.join(target, name), sanitize(read(source)))
        else:
            shutil.copy2(source, os.path.join(target, name))
        mapping[name] = "%s/assets/%s/%s" % (PUBLIC_PREFIX, slug, name)
    return mapping


ASSET_REF = re.compile(r"\]\(\s*(?:\./|\.\./)*assets/([^)\s]+?)\s*(?:\"[^\"]*\")?\)")


def rewrite_assets(body, mapping):
    def replace(match):
        name = match.group(1)
        return "](%s)" % mapping[name] if name in mapping else "](#)"
    return ASSET_REF.sub(replace, body)


# ── cross-references between lessons ──────────────────────────────────────

def rewrite_cross_links(body, lesson_dir, slug_by_path):
    """`../../phases/11-llm-engineering/01-prompt-engineering/` -> `aifs:<slug>`.

    Relative paths pointing anywhere inside the source tree only resolve on the
    original repository layout, so every one of them is either mapped onto the
    in-app slug or de-linked. Nothing relative is allowed to survive.
    """
    def replace(match):
        bang, text, href = match.group(1), match.group(2), match.group(3).strip()
        # `/ai-from-scratch/…` is this build's own asset path, already rewritten.
        if re.match(r"^(?:https?:|mailto:|#|aifs:|/)", href):
            return match.group(0)
        target = os.path.normpath(os.path.join(lesson_dir, href.split("#")[0]))
        key = os.path.relpath(target, SRC).replace(os.sep, "/").rstrip("/")
        slug = slug_by_path.get(key) or slug_by_path.get(os.path.dirname(key))
        if slug:
            return "%s[%s](aifs:%s)" % (bang, text, slug)
        # An image whose file did not survive would leave a bare "!alt" line.
        return text

    return re.sub(r"(!?)\[([^\]\n]*)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)", replace, body)


# ── build ─────────────────────────────────────────────────────────────────

def lesson_record(lesson_dir, slug, number):
    doc = os.path.join(lesson_dir, "docs", "en.md")
    if not os.path.exists(doc):
        return None
    parsed = parse_lesson(sanitize(read(doc), drop_sections=True))
    if not parsed["title"]:
        parsed["title"] = title_case_from_dir(os.path.basename(lesson_dir))
    return {
        "slug": slug,
        "number": number,
        "dir": lesson_dir,
        "title": parsed["title"],
        "blurb": parsed["blurb"],
        "type": parsed["type"],
        "languages": parsed["languages"],
        "prerequisites": parsed["prerequisites"],
        "time": parsed["time"],
        "minutes": parsed["minutes"],
        "body": parsed["body"],
    }


def scan_phases(phase_meta):
    phases = []
    for name in sorted(os.listdir(PHASES)):
        phase_dir = os.path.join(PHASES, name)
        if not os.path.isdir(phase_dir) or not re.match(r"^\d+", name):
            continue
        number = int(re.match(r"^(\d+)", name).group(1))
        info = phase_meta.get(number, {})
        blurb = ""
        readme = os.path.join(phase_dir, "README.md")
        if os.path.exists(readme):
            head = parse_lesson(sanitize(read(readme), drop_sections=True))
            blurb = head["blurb"]
        lessons = []
        for lesson_name in sorted(os.listdir(phase_dir)):
            lesson_dir = os.path.join(phase_dir, lesson_name)
            if not os.path.isdir(lesson_dir) or not re.match(r"^\d+", lesson_name):
                continue
            record = lesson_record(
                lesson_dir,
                "%s/%s" % (name, lesson_name),
                int(re.match(r"^(\d+)", lesson_name).group(1)),
            )
            if record:
                lessons.append(record)
        if not lessons:
            continue
        phases.append({
            "id": name,
            "track": "curriculum",
            "number": number,
            "title": info.get("title") or title_case_from_dir(name),
            "blurb": blurb,
            "hours": info.get("hours", ""),
            "lessons": lessons,
        })
    return phases


def scan_certification():
    if not os.path.isdir(CERT_LESSONS):
        return []
    lessons = []
    for name in sorted(os.listdir(CERT_LESSONS)):
        lesson_dir = os.path.join(CERT_LESSONS, name)
        if not os.path.isdir(lesson_dir) or not re.match(r"^\d+", name):
            continue
        record = lesson_record(
            lesson_dir,
            "certification/%s" % name,
            int(re.match(r"^(\d+)", name).group(1)),
        )
        if record:
            lessons.append(record)
    if not lessons:
        return []
    return [{
        "id": "certification",
        "track": "certification",
        "number": 0,
        "title": "Claude Certification",
        "blurb": "A study track for the Claude certification exams — model selection, "
                 "prompting, agents, evaluation, security, and delivery.",
        "hours": "",
        "lessons": lessons,
    }]


def scan_guides():
    guides = []
    sources = [
        ("guides/roadmap", "Curriculum Roadmap",
         "Every phase and lesson in order, with time estimates.", ROADMAP),
        ("guides/glossary", "Glossary",
         "The vocabulary a lesson, paper, or review can introduce faster than it explains.",
         os.path.join(GLOSSARY, "terms.md")),
        ("guides/myths", "Myths & Misconceptions",
         "Claims that sound right and are not.", os.path.join(GLOSSARY, "myths.md")),
    ]
    for slug, title, blurb, path in sources:
        if not os.path.exists(path):
            continue
        parsed = parse_lesson(sanitize(read(path), drop_sections=True))
        guides.append({
            "slug": slug,
            "number": len(guides) + 1,
            "dir": os.path.dirname(path),
            "title": parsed["title"] or title,
            "blurb": parsed["blurb"] or blurb,
            "type": "Reference",
            "languages": "",
            "prerequisites": "",
            "time": "",
            "minutes": 0,
            "body": parsed["body"],
        })
    if not guides:
        return []
    return [{
        "id": "guides",
        "track": "guides",
        "number": 0,
        "title": "Reference",
        "blurb": "The roadmap and glossary that sit alongside the lessons.",
        "hours": "",
        "lessons": guides,
    }]


def build_figure_bundle():
    """Concatenate the interactive-figure runtime into one lazily-loaded file.

    Every lesson embeds exactly one widget through a ```figure fence naming an
    id. The upstream implementation is 57 dependency-free IIFEs: figures.js
    publishes window.AIFS_FIGURES, lesson-figures.js publishes window.LF and
    window.mountLessonFigures, and each figures-<topic>.js calls LF.register.
    Load order matters only for those first two, so the rest are appended
    alphabetically. Concatenating is safe precisely because each file is an
    IIFE that touches nothing but those globals.

    Returns the number of figure ids the bundle registers.
    """
    if not os.path.isdir(SITE):
        return 0
    modules = sorted(
        name for name in os.listdir(SITE)
        if name.startswith("figures-") and name.endswith(".js")
    )
    ordered = [name for name in ("figures.js", "lesson-figures.js")
               if os.path.exists(os.path.join(SITE, name))] + modules
    if not ordered:
        return 0

    parts = ["/* AI from Scratch — interactive lesson figures. Generated by "
             "scripts/build_ai_from_scratch.py; do not edit. */\n"]
    for name in ordered:
        parts.append("\n/* ── %s ── */\n" % name)
        parts.append(sanitize(read(os.path.join(SITE, name))))
    write(os.path.join(OUT_PUB, "figures", "figures.bundle.js"), "\n".join(parts))

    ids = set()
    for name in ordered:
        source = read(os.path.join(SITE, name))
        # LF.register({ 'kv-cache': fn, … }) and the FIGS / AIFS_FIGURES maps
        for match in re.finditer(r"^\s*'([a-z0-9][a-z0-9-]*)'\s*:", source, re.M):
            ids.add(match.group(1))
    return len(ids)


def main():
    if not os.path.isdir(PHASES):
        sys.exit("Source tree not found: %s" % PHASES)

    if os.path.isdir(OUT_PUB):
        shutil.rmtree(OUT_PUB)

    figure_ids = build_figure_bundle()
    phases = scan_phases(read_phase_meta()) + scan_certification() + scan_guides()

    # Path -> slug, so a relative cross-reference in any lesson can be resolved.
    slug_by_path = {}
    for phase in phases:
        for lesson in phase["lessons"]:
            key = os.path.relpath(lesson["dir"], SRC).replace(os.sep, "/")
            slug_by_path[key] = lesson["slug"]

    index, written, assets_copied, failures = [], 0, 0, []
    for phase in phases:
        entries = []
        for lesson in phase["lessons"]:
            slug = lesson["slug"]
            mapping = copy_assets(lesson["dir"], slug) if phase["track"] != "guides" else {}
            assets_copied += len(mapping)

            body = rewrite_assets(lesson["body"], mapping)
            body = rewrite_cross_links(body, lesson["dir"], slug_by_path)
            body = sanitize(body).strip() + "\n"

            code = collect_code(lesson["dir"])
            artifacts = collect_artifacts(lesson["dir"])
            quiz = collect_quiz(lesson["dir"])

            write(os.path.join(OUT_PUB, "md", slug + ".md"), body)
            written += 1
            if code or artifacts or quiz:
                write(
                    os.path.join(OUT_PUB, "bundle", slug + ".json"),
                    json.dumps({"code": code, "artifacts": artifacts, "quiz": quiz},
                               ensure_ascii=False),
                )

            for label, text in (("body", body),
                                ("code", json.dumps(code)),
                                ("artifacts", json.dumps(artifacts)),
                                ("quiz", json.dumps(quiz))):
                hit = VERIFY_FORBIDDEN.search(text or "")
                if hit:
                    failures.append("%s (%s): %s" % (slug, label, hit.group(0)))

            entries.append({
                "slug": slug,
                "n": lesson["number"],
                "title": lesson["title"],
                "blurb": lesson["blurb"],
                "type": lesson["type"],
                "langs": lesson["languages"],
                "prereq": lesson["prerequisites"],
                "time": lesson["time"],
                "minutes": lesson["minutes"],
                "code": len(code),
                "artifacts": len(artifacts),
                "quiz": len(quiz or []),
            })

        index.append({
            "id": phase["id"],
            "track": phase["track"],
            "n": phase["number"],
            "title": phase["title"],
            "blurb": phase["blurb"],
            "hours": phase["hours"],
            "lessons": entries,
        })

    if failures:
        sys.exit("Sanitization check failed:\n  " + "\n  ".join(failures[:20]))

    total = sum(len(phase["lessons"]) for phase in index)
    tracks = [
        {"id": "curriculum", "label": "Curriculum",
         "blurb": "Twenty phases, from setup to capstone. Every lesson ships something you keep."},
        {"id": "certification", "label": "Certification",
         "blurb": "A focused track for the Claude certification exams."},
        {"id": "guides", "label": "Reference",
         "blurb": "The roadmap, the glossary, and the myths worth unlearning."},
    ]
    tracks = [track for track in tracks
              if any(phase["track"] == track["id"] for phase in index)]

    header = (
        "// Auto-generated index of the AI from Scratch curriculum.\n"
        "//\n"
        "// %d lessons across %d phases. Bodies live under public%s/md/ and are\n"
        "// fetched on demand by AiFromScratch; code, artifacts, and quizzes live\n"
        "// under public%s/bundle/ and load only when a reader opens that tab.\n"
        "//\n"
        "// Regenerate with `npm run build:aifs` rather than hand-editing.\n\n"
        % (total, len(index), PUBLIC_PREFIX, PUBLIC_PREFIX)
    )
    body = (
        header
        + "export const AIFS_CONTENT_BASE = %s;\n\n" % json.dumps(PUBLIC_PREFIX)
        + "export const AIFS_TOTAL_LESSONS = %d;\n\n" % total
        + "export const AIFS_TRACKS = %s;\n\n" % json.dumps(tracks, indent=1, ensure_ascii=False)
        + "export const AIFS_PHASES = %s;\n" % json.dumps(index, indent=1, ensure_ascii=False)
    )
    write(OUT_DATA, body)

    write(os.path.join(OUT_PUB, "build-report.json"), json.dumps({
        "lessons": total,
        "phases": len(index),
        "tracks": [track["id"] for track in tracks],
        "markdownFiles": written,
        "assetsCopied": assets_copied,
        "figureWidgets": figure_ids,
    }, indent=1))

    print("AI from Scratch: %d lessons, %d phases, %d diagrams, %d figure widgets -> %s"
          % (total, len(index), assets_copied, figure_ids, os.path.relpath(OUT_PUB, ROOT)))
    print("index -> %s" % os.path.relpath(OUT_DATA, ROOT))


if __name__ == "__main__":
    main()
