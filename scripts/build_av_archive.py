#!/usr/bin/env python3
"""build_av_archive.py — turn the raw Analytics Vidhya scrape into shippable content.

Reads   ../Claude Certeficate/analytics vidya/blogs/<YYYY>-<MM>-<slug>/
Writes  .av-build/<year>/md/<slug>.md          normalized bodies
        .av-build/<year>/img/<slug>/<n>.webp   optimized images
        .av-build/<year>/img/<slug>/hero.webp  400px card thumbnail
        public/data/av-years.json              ~1 KB, loaded up front
        public/data/av-<year>.json             per-year browse index
        public/data/av-preview.json            12 recent posts for the home screen
        .av-build/build-report.json            counts, skips, warnings

Editorial filtering lives in av_filter.py; this script only builds what survives.

Run:
    python3 scripts/build_av_archive.py                 # everything
    python3 scripts/build_av_archive.py --year 2024     # one year
    python3 scripts/build_av_archive.py --limit 20      # quick smoke test
    python3 scripts/build_av_archive.py --skip-images   # markdown + index only

Re-runs are cheap: a post whose source is unchanged since the last build is
skipped entirely. Delete .av-build/.cache.json to force a full rebuild.

Image paths in the emitted markdown are ROOT-RELATIVE (`/2024/img/<slug>/1.webp`),
not absolute CDN URLs. The reader prepends VITE_AV_CDN_BASE at render time, so
moving from workers.dev to a custom domain is an env change, not a rebuild of
8,632 files.
"""
import argparse
import hashlib
import io
import json
import os
import re
import shutil
import sys
import time
from collections import Counter, defaultdict
from concurrent.futures import ProcessPoolExecutor, as_completed

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import av_filter as F  # noqa: E402
import build_av_topics  # noqa: E402

try:
    from PIL import Image, ImageSequence
except ImportError:
    sys.exit("Pillow is required:  .venv/bin/pip install Pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOWNLOADS = os.path.dirname(ROOT)
CORPUS = os.path.join(DOWNLOADS, "Claude Certeficate", "analytics vidya", "blogs")
BUILD = os.path.join(ROOT, ".av-build")
DATA = os.path.join(ROOT, "public", "data")

MAX_WIDTH = 1280          # matches the median source width of the largest bucket
HERO_WIDTH = 400
WEBP_QUALITY = 80
WEBP_ANIM_QUALITY = 70
ANIM_MAX_WIDTH = 960      # animation costs frames x pixels; cap harder
#: Source-branded taxonomy that must not appear as a filter chip.
HIDDEN_CATEGORIES = {"analytics-vidhya", "avbytes", "analytics-vidhya-2"}
EXCERPT_CHARS = 200
PREVIEW_COUNT = 12

# --------------------------------------------------------------------------
# Markdown normalization
# --------------------------------------------------------------------------

#: The header block every file repeats from its own frontmatter.
HEADER_BLOCK = re.compile(
    r"\A\s*#[^\n]*\n+"                                   # duplicated H1
    r"(?:\*\*(?:Author|Date|Original Link):\*\*[^\n]*\n+)+"
    r"(?:-{3,}\s*\n+)?",
    re.M,
)
#: A trailing author card: optional avatar, the author profile link, the bio,
#: and the category links. Everything from the avatar onward is chrome.
AUTHOR_LINK = re.compile(
    r"\[([^\]]*)\]\(https://www\.analyticsvidhya\.com/blog/author/[^)]*\)"
)
AVATAR_BEFORE = re.compile(r"!\[[^\]]*\]\([^)]*\)\s*\Z")
CATEGORY_LINK = F.CATEGORY_LINK

#: WordPress shortcode residue, concentrated in 2013-2016 posts. Smart quotes
#: are common inside the attributes, hence the character class.
STEXTBOX = re.compile(r"\[stextbox[^\]]*\](.*?)\[/stextbox\]", re.S | re.I)
STEXTBOX_OPEN = re.compile(r"\[/?stextbox[^\]]*\]", re.I)
SHORTCODE = re.compile(r"\[/?[a-z][a-z0-9_]*(?:\s+[a-z_]+=[^\]]*)?\](?!\()", re.I)

# ── Code fence repair ─────────────────────────────────────────────────────
# Guarantees the invariant every downstream stage assumes: fences sit alone on
# their line, and every opened fence is closed.
#
# Worth knowing why this exists, because the failure it guards against was
# self-inflicted and very hard to see. An earlier tidy step used
# `re.sub(r"\s+([.,;:!?])", r"\1", text)` to remove space before punctuation.
# `\s` matches newlines and `!` was in the class, so
#
#     ```\n\n![pandas iloc](./images/image_11.jpg)
#
# collapsed to
#
#     ```![pandas iloc](./images/image_11.jpg)
#
# CommonMark requires a closing fence to be alone on its line, so that is no
# longer a close: the block ran on to the *next* fence — the following block's
# opening — and code and prose swapped places for the rest of the article.
# It hit 2,198 of 8,632 posts. The source markdown was correct all along.
#
# _tidy() is now horizontal-whitespace-only and excludes `!`, and runs only on
# non-code segments. This function is the backstop that proves the invariant
# rather than assuming it.
FENCE_LINE = re.compile(r"^(\s*)(`{3,}|~{3,})(.*)$")
#: A legitimate opening fence info string is a bare language token.
INFO_STRING = re.compile(r"^[A-Za-z0-9_+#.-]*$")


def fix_fences(text):
    """Put every fence alone on its line and close any that were left open."""
    out = []
    in_fence = False
    for line in text.split("\n"):
        match = FENCE_LINE.match(line)
        if not match:
            out.append(line)
            continue

        indent, ticks, rest = match.group(1), match.group(2), match.group(3)
        trailing = rest.strip()

        if in_fence:
            in_fence = False
            out.append(indent + ticks)
            if trailing:                      # content glued to the closing fence
                out.append(rest.lstrip())
        else:
            in_fence = True
            if INFO_STRING.match(trailing):   # ```python — a real info string
                out.append(indent + ticks + trailing)
            else:                             # ```df.head() — actually code
                out.append(indent + ticks)
                out.append(rest.lstrip())

    if in_fence:                              # 13 posts end mid-block
        out.append("```")
    return "\n".join(out)


# ── Source-brand removal ──────────────────────────────────────────────────
# The archive must not name its source anywhere in rendered content. A naive
# find-and-replace leaves wreckage ("a course offered by ."), so this runs in
# stages, most structural first, and only falls back to token replacement for
# text inside code fences where sentence boundaries cannot be trusted.
#
# Measured on a 700-file sample: 6,456 mentions -> 196 after the first four
# stages, -> 0 after sentence removal.
#: No leading \b: the scrape frequently loses the space before a proper noun
#: ("application forAnalytics Vidhya"), which a word boundary would skip.
BRAND = re.compile(r"Analytics\s*Vidhya\w*(?:\s*\(AV\))?('s|’s)?", re.I)
BRAND_DOMAIN = re.compile(r"[^\s<>()\[\]]*analyticsvidhya\.com[^\s<>()\[\]]*", re.I)
#: "The media shown in this article is not owned by … and is used at the
#: Author's discretion" — a notice about the source's ownership, meaningless
#: once the source is unnamed. ~2,900 posts.
BRAND_DISCLAIMER = re.compile(
    r"[^\n]*media shown in this article[^\n]*not owned by[^\n]*\n?", re.I
)
#: "This article was published as a part of the Data Science Blogathon" — a
#: promotion for the source's own contest. ~1,000 posts.
BRAND_CONTEST = re.compile(r"[^\n]*Data Science Blogathon[^\n]*\n?", re.I)
#: [text](https://…analyticsvidhya.com/…) -> text. Keeps the sentence intact
#: while dropping the destination.
BRAND_LINK = re.compile(
    r"\[([^\]]*)\]\(\s*<?https?://[^)\s]*analyticsvidhya\.com[^)\s]*>?\s*\)", re.I
)
CODE_FENCE = re.compile(r"(```.*?```|~~~.*?~~~)", re.S)
SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+")


def _strip_brand_sentences(text):
    """Drop whole sentences that name the source, paragraph by paragraph."""
    out = []
    for block in text.split("\n\n"):
        if not BRAND.search(block):
            out.append(block)
            continue
        # A heading or list item that names the source goes entirely — there is
        # no sentence structure worth preserving in "## <Brand> Blog Series".
        stripped = block.lstrip()
        if stripped.startswith(("#", "|")):
            continue
        kept = [s for s in SENTENCE_SPLIT.split(block) if not BRAND.search(s)]
        remainder = " ".join(kept).strip()
        if remainder and len(remainder) > 15:
            out.append(remainder)
    return "\n\n".join(out)


def scrub_brand(text):
    """Remove every reference to the source from an article body."""
    text = BRAND_DISCLAIMER.sub("", text)
    text = BRAND_CONTEST.sub("", text)
    text = BRAND_LINK.sub(r"\1", text)

    # Code fences are protected from sentence surgery: their line structure is
    # meaningful and a stray period is not a sentence boundary.
    parts = CODE_FENCE.split(text)
    for i, part in enumerate(parts):
        if part.startswith("```") or part.startswith("~~~"):
            # Code is never tidied: collapsing runs of spaces would destroy
            # indentation, which is load-bearing in Python.
            parts[i] = BRAND_DOMAIN.sub("", BRAND.sub("the source", part))
        else:
            part = BRAND_DOMAIN.sub("", part)
            parts[i] = _tidy(_strip_brand_sentences(part))
    return "".join(parts)


def _tidy(text):
    """Clean up what brand removal leaves behind, without damaging markdown.

    Two constraints learned the hard way:

    * Horizontal whitespace only. A `\\s+` here matches newlines, so collapsing
      whitespace before punctuation joined a closing ``` to the image that
      followed it and silently inverted code and prose across 2,198 posts.
    * `!` is not punctuation to tidy — `![alt](src)` is image syntax, and
      eating the space or newline before it corrupts the image.
    """
    text = re.sub(r"\[\s*\]\(\s*\)", "", text)   # empty link shells
    text = re.sub(r"[ \t]{2,}", " ", text)       # doubled spaces in prose
    text = re.sub(r"[ \t]+([.,;:?])", r"\1", text)
    text = re.sub(r"\(\s*\)", "", text)          # emptied parentheses
    return text


LOCAL_IMAGE = re.compile(r"!\[([^\]]*)\]\(\./images/([^)\s]+)(?:\s+\"[^\"]*\")?\)")
REMOTE_IMAGE = re.compile(r"!\[([^\]]*)\]\((https?://[^)\s]+)\)")
MD_SYNTAX = re.compile(r"[#*_`>\[\]!]|\(https?://[^)]*\)")
BLANKS = re.compile(r"\n{3,}")


def strip_author_card(body):
    """Remove the trailing author card and category links.

    Returns (cleaned_body, categories). Both are needed: categories drive the
    entire browse UI, and the author name is the only reliable repair for the
    corrupted `author:` frontmatter — even though neither the name nor the
    original link is ever rendered (see AV_ARCHIVE_PLAN.md §6.7).
    """
    categories = [c for _, c in CATEGORY_LINK.findall(body[-3000:])]

    # Cut at the FIRST author link in the tail, not the last. Many posts carry
    # two — an avatar rendered as a link whose alt text is a single letter
    # (`[D](…/author/deepsandhya2022/)`) followed by the full name. Cutting at
    # the last one leaves the first stranded at the end of the article.
    tail_start = len(body) * 0.6
    first = next((m for m in AUTHOR_LINK.finditer(body) if m.start() > tail_start), None)
    if first:
        cut = first.start()
        head = body[:cut].rstrip()
        avatar = AVATAR_BEFORE.search(head)
        if avatar and cut - (len(head) - len(avatar.group(0))) < 400:
            cut = len(head) - len(avatar.group(0))
        body = body[:cut]
    # Any category links that survived (no author link present) go too.
    body = CATEGORY_LINK.sub("", body)
    return body.rstrip(), categories


def clean_shortcodes(text):
    text = STEXTBOX.sub(lambda m: f"\n\n### {m.group(1).strip()}\n\n", text)
    text = STEXTBOX_OPEN.sub("", text)
    return SHORTCODE.sub("", text)


def make_excerpt(body):
    """First run of readable prose, for the archive card."""
    for para in body.split("\n\n"):
        para = para.strip()
        if not para or para.startswith(("#", "!", "|", "```", ">", "-", "*")):
            continue
        text = MD_SYNTAX.sub("", para).strip()
        text = re.sub(r"\s+", " ", text)
        if len(text) >= 40:
            return text[:EXCERPT_CHARS].rstrip() + ("…" if len(text) > EXCERPT_CHARS else "")
    return ""


# --------------------------------------------------------------------------
# Images
# --------------------------------------------------------------------------

def encode_still(im, max_width, quality):
    if im.width > max_width:
        h = max(1, round(im.height * max_width / im.width))
        im = im.resize((max_width, h), Image.LANCZOS)
    im = im.convert("RGBA" if im.mode in ("P", "RGBA", "LA") else "RGB")
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=quality, method=4)
    return buf.getvalue(), im.size


def encode_animation(im):
    """Animated GIF -> animated WebP. Measured at ~0.27x on the corpus.

    Chosen over ffmpeg/mp4 (~0.10x) because it needs no external binary and
    still renders in a plain <img>, where mp4 would force a <video> element
    and its own autoplay/muted/playsinline handling in the reader.
    """
    frames = []
    for frame in ImageSequence.Iterator(im):
        frame = frame.convert("RGBA")
        if frame.width > ANIM_MAX_WIDTH:
            h = max(1, round(frame.height * ANIM_MAX_WIDTH / frame.width))
            frame = frame.resize((ANIM_MAX_WIDTH, h), Image.LANCZOS)
        frames.append(frame)
    buf = io.BytesIO()
    frames[0].save(
        buf, "WEBP", save_all=True, append_images=frames[1:],
        quality=WEBP_ANIM_QUALITY, method=4,
        loop=im.info.get("loop", 0), duration=im.info.get("duration", 100),
    )
    return buf.getvalue(), frames[0].size


def process_image(src, dest_dir, stem):
    """Write the best available encoding. Returns (filename, w, h) or None.

    SVGs are copied verbatim — Pillow cannot rasterize them and they are
    already small (34 files, 44 KB average). For everything else the original
    bytes compete with the re-encode and the smaller one wins, which matters
    because 32,595 images are under 32 KB and naive re-encoding *inflates*
    those by ~40%.
    """
    name = os.path.basename(src)
    ext = name.rsplit(".", 1)[-1].lower() if "." in name else ""
    original = os.path.getsize(src)

    if ext == "svg":
        out = f"{stem}.svg"
        shutil.copyfile(src, os.path.join(dest_dir, out))
        return out, None, None

    try:
        im = Image.open(src)
        im.load()
    except Exception:
        return None

    try:
        if getattr(im, "n_frames", 1) > 1:
            data, size = encode_animation(Image.open(src))
        else:
            data, size = encode_still(im, MAX_WIDTH, WEBP_QUALITY)
    except Exception:
        return None

    if len(data) < original:
        out = f"{stem}.webp"
        with open(os.path.join(dest_dir, out), "wb") as fh:
            fh.write(data)
        return out, size[0], size[1]

    out = f"{stem}.{ext or 'bin'}"
    shutil.copyfile(src, os.path.join(dest_dir, out))
    return out, im.width, im.height


def write_hero(src, dest_dir):
    try:
        im = Image.open(src)
        im.load()
        if getattr(im, "n_frames", 1) > 1:
            im.seek(0)
        data, _ = encode_still(im, HERO_WIDTH, 75)
        with open(os.path.join(dest_dir, "hero.webp"), "wb") as fh:
            fh.write(data)
        return True
    except Exception:
        return False


# --------------------------------------------------------------------------
# Per-post build (runs in a worker process)
# --------------------------------------------------------------------------

def source_signature(post_dir):
    """Cheap fingerprint of a post's inputs, for skip-if-unchanged."""
    parts = []
    for path in sorted(_iter_source_files(post_dir)):
        st = os.stat(path)
        parts.append(f"{os.path.basename(path)}:{st.st_size}:{int(st.st_mtime)}")
    return hashlib.sha1("|".join(parts).encode()).hexdigest()[:16]


def _iter_source_files(post_dir):
    md = os.path.join(post_dir, "index.md")
    if os.path.exists(md):
        yield md
    img = os.path.join(post_dir, "images")
    if os.path.isdir(img):
        for entry in os.scandir(img):
            if entry.is_file() and not entry.name.startswith("."):
                yield entry.path


def build_post(args):
    slug, post_dir, skip_images, reuse_images = args
    md_path = os.path.join(post_dir, "index.md")
    parsed = F.parse(md_path, slug)
    year = parsed["year"]

    body = parsed["body"]
    body = F.decode_escapes(body)
    body = F.strip_chrome(body)
    # Must run before scrub_brand: that function protects code fences from
    # sentence surgery, which requires the fences to actually be correct.
    body = fix_fences(body)
    body = HEADER_BLOCK.sub("", body, count=1)
    body, categories = strip_author_card(body)
    categories = [c for c in categories if c not in HIDDEN_CATEGORIES]
    body = clean_shortcodes(body)
    # Runs before image collection so images inside removed paragraphs are
    # never processed or uploaded.
    # Balance pass runs again after scrubbing: sentence removal can delete a
    # paragraph that happened to contain a fence, and an unclosed fence renders
    # the whole rest of the article as one code block.
    body = fix_fences(scrub_brand(body))

    out_md_dir = os.path.join(BUILD, str(year), "md")
    out_img_dir = os.path.join(BUILD, str(year), "img", slug)
    os.makedirs(out_md_dir, exist_ok=True)

    # --- images -----------------------------------------------------------
    referenced = LOCAL_IMAGE.findall(body)
    src_img_dir = os.path.join(post_dir, "images")
    mapping = {}
    dims = {}
    order = []

    if referenced and not skip_images:
        os.makedirs(out_img_dir, exist_ok=True)
        for _, filename in referenced:
            if filename in mapping:
                continue
            src = os.path.join(src_img_dir, filename)
            if not os.path.exists(src):
                continue
            stem = os.path.splitext(filename)[0].replace("image_", "") or "0"

            # --reuse-images: a text-only rebuild adopts the derivatives already
            # on disk instead of re-encoding 65,000 images to produce identical
            # bytes. Turns a 20-minute rebuild into seconds.
            if reuse_images:
                existing = [
                    n for n in os.listdir(out_img_dir)
                    if os.path.splitext(n)[0] == stem
                ]
                if existing:
                    mapping[filename] = existing[0]
                    order.append(filename)
                    continue

            result = process_image(src, out_img_dir, stem)
            if result:
                mapping[filename] = result[0]
                dims[filename] = (result[1], result[2])
                order.append(filename)

    # The author avatar is always the final referenced image; excluding it stops
    # every card in the archive from being a headshot.
    hero = False
    if order and not skip_images:
        candidates = order[:-1] if len(order) > 1 else order
        for filename in candidates:
            if write_hero(os.path.join(src_img_dir, filename), out_img_dir):
                hero = True
                break

    def replace_local(m):
        alt, filename = m.group(1), m.group(2)
        out = mapping.get(filename)
        if not out:
            return ""  # image failed to process — drop the broken reference
        return f"![{alt}](/{year}/img/{slug}/{out})"

    body = LOCAL_IMAGE.sub(replace_local, body)
    remote = len(REMOTE_IMAGE.findall(body))
    body = BLANKS.sub("\n\n", body).strip() + "\n"

    with open(os.path.join(out_md_dir, f"{slug}.md"), "w", encoding="utf-8") as fh:
        fh.write(body)

    return {
        "slug": slug,
        "year": year,
        "month": parsed["month"],
        "title": scrub_brand(F.decode_escapes(parsed["title"])).strip(" -–—:|"),
        "categories": categories,
        "excerpt": make_excerpt(body),
        "hero": hero,
        "images": len(mapping),
        "remote_images": remote,
        "bytes": len(body.encode("utf-8")),
        "signature": source_signature(post_dir),
    }


# --------------------------------------------------------------------------
# Index emission
# --------------------------------------------------------------------------

#: Words that are neither Title Case nor ALL CAPS. Blind `.upper()` on an
#: acronym list produced "LLMS", "Chatgpt" and "Pytorch", which look wrong in a
#: filter chip, so the exceptions are spelled out.
CATEGORY_LABELS = {
    "llms": "LLMs", "large-language-models": "Large Language Models",
    "chatgpt": "ChatGPT", "pytorch": "PyTorch", "tensorflow": "TensorFlow",
    "genai": "GenAI", "generative-ai": "Generative AI", "javascript": "JavaScript",
    "mysql": "MySQL", "postgresql": "PostgreSQL", "nosql": "NoSQL",
    "mlops": "MLOps", "avbytes": "AV Bytes", "github": "GitHub",
    "openai": "OpenAI", "huggingface": "Hugging Face", "numpy": "NumPy",
    "scikit-learn": "scikit-learn", "matplotlib": "Matplotlib", "powerbi": "Power BI",
    "iot": "IoT", "ai-agent": "AI Agent", "ai-tools": "AI Tools",
}
#: Bare acronyms that really are all-caps.
CATEGORY_CAPS = {"ai", "ml", "nlp", "llm", "sql", "aws", "gcp", "api", "apis",
                 "bi", "eda", "gan", "gans", "cnn", "rnn", "lstm", "ocr", "r",
                 "csv", "json", "html", "css", "sas", "spss", "etl", "crm",
                 "rlhf", "gpt", "bert", "svm", "knn", "pca", "arima", "rag",
                 "ocr", "xml", "sdk", "ide", "gpu", "cpu", "vr", "ar", "iot"}


def humanize(slug):
    """`generative-ai` -> `Generative AI`, `llms` -> `LLMs`."""
    slug = re.sub(r"-\d+$", "", slug)  # `python-2` and `python` are one category
    if slug in CATEGORY_LABELS:
        return CATEGORY_LABELS[slug]
    return " ".join(
        w.upper() if w in CATEGORY_CAPS else w.capitalize() for w in slug.split("-")
    )


def write_indexes(entries, cdn_base):
    os.makedirs(DATA, exist_ok=True)
    by_year = defaultdict(list)
    for e in entries:
        by_year[e["year"]].append(e)

    years = []
    for year in sorted(by_year, reverse=True):
        posts = sorted(by_year[year], key=lambda e: (e["month"] or "", e["slug"]), reverse=True)

        labels, index_of = [], {}
        for e in posts:
            for slug in e["categories"]:
                label = humanize(slug)
                if label not in index_of:
                    index_of[label] = len(labels)
                    labels.append(label)

        payload = {
            "y": year,
            "categories": labels,
            "posts": [
                {
                    "s": e["slug"],
                    "t": e["title"],
                    "d": e["month"],
                    "c": sorted({index_of[humanize(c)] for c in e["categories"]}),
                    "x": e["excerpt"],
                    "h": 1 if e["hero"] else 0,
                    "n": e["images"],
                }
                for e in posts
            ],
        }
        path = os.path.join(DATA, f"av-{year}.json")
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(payload, fh, separators=(",", ":"), ensure_ascii=False)
        years.append({"y": year, "n": len(posts), "f": f"/data/av-{year}.json"})

    with open(os.path.join(DATA, "av-years.json"), "w", encoding="utf-8") as fh:
        json.dump({
            "version": 1,
            "generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "cdn": cdn_base,
            "total": len(entries),
            "years": years,
        }, fh, separators=(",", ":"), ensure_ascii=False)

    # Legacy catalog shape, still consumed by IntelligenceHub and FeatureHome.
    # Regenerated here so those screens stop depending on process_blogs.py,
    # which derived fake Title-Cased names from URL slugs and emitted outbound
    # links to the source site. Carries `slug` instead of `url`: every entry
    # now opens locally, and no source domain appears anywhere in the payload.
    catalog = {}
    for year in sorted(by_year, reverse=True):
        catalog[str(year)] = [
            {"title": e["title"], "slug": e["slug"], "description": e["excerpt"]}
            for e in sorted(by_year[year], key=lambda e: (e["month"] or ""), reverse=True)
        ]
    with open(os.path.join(DATA, "blog-catalog.json"), "w", encoding="utf-8") as fh:
        json.dump(catalog, fh, separators=(",", ":"), ensure_ascii=False)

    recent = sorted(entries, key=lambda e: (e["month"] or "", e["slug"]), reverse=True)
    with open(os.path.join(DATA, "av-preview.json"), "w", encoding="utf-8") as fh:
        # Field names match what FeatureHome already reads; `slug` replaces the
        # old outbound `url` so the home screen opens the article in-app.
        json.dump([
            {"title": e["title"], "slug": e["slug"], "year": str(e["year"]),
             "description": e["excerpt"], "hasHero": bool(e["hero"])}
            for e in recent[:PREVIEW_COUNT]
        ], fh, separators=(",", ":"), ensure_ascii=False)

    return years


def dir_size(path):
    total = 0
    for root, _, files in os.walk(path):
        for name in files:
            try:
                total += os.path.getsize(os.path.join(root, name))
            except OSError:
                pass
    return total


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=CORPUS)
    ap.add_argument("--year", type=int, action="append", help="build only these years")
    ap.add_argument("--limit", type=int, help="stop after N posts (smoke test)")
    ap.add_argument("--skip-images", action="store_true")
    ap.add_argument("--reuse-images", action="store_true",
                    help="rebuild markdown but adopt existing image derivatives")
    ap.add_argument("--keep-all-news", action="store_true")
    ap.add_argument("--jobs", type=int, default=max(1, (os.cpu_count() or 4) - 1))
    ap.add_argument("--force", action="store_true", help="ignore the unchanged-post cache")
    args = ap.parse_args()

    if not os.path.isdir(args.root):
        sys.exit(f"corpus not found: {args.root}")

    cdn_base = os.environ.get("VITE_AV_CDN_BASE", "")
    if not cdn_base:
        env_local = os.path.join(ROOT, ".env.local")
        if os.path.exists(env_local):
            for line in open(env_local, encoding="utf-8"):
                m = re.match(r'\s*VITE_AV_CDN_BASE\s*=\s*["\']?([^"\'\n]+)', line)
                if m:
                    cdn_base = m.group(1).strip()
    if not cdn_base:
        print("note: VITE_AV_CDN_BASE not set — index will carry an empty cdn field.\n"
              "      Harmless now; set it before the app fetches content.\n")

    os.makedirs(BUILD, exist_ok=True)
    cache_path = os.path.join(BUILD, ".cache.json")
    cache = {}
    if os.path.exists(cache_path) and not args.force:
        try:
            cache = json.load(open(cache_path))
        except (ValueError, OSError):
            cache = {}

    # --- select ------------------------------------------------------------
    dropped = Counter()
    todo, cached_entries = [], []
    for slug, path in F.iter_posts(args.root):
        post = F.parse(path, slug)
        reason = F.classify(post, drop_news=not args.keep_all_news)
        if reason:
            dropped[reason] += 1
            continue
        if args.year and post["year"] not in args.year:
            continue
        post_dir = os.path.dirname(path)
        hit = cache.get(slug)
        if hit and not args.force and not args.reuse_images \
                and hit.get("signature") == source_signature(post_dir):
            cached_entries.append(hit)
        else:
            todo.append((slug, post_dir, args.skip_images, args.reuse_images))
        if args.limit and len(todo) + len(cached_entries) >= args.limit:
            break

    total = len(todo) + len(cached_entries)
    print(f"posts to build: {len(todo)}   unchanged (cached): {len(cached_entries)}")
    print(f"dropped by filter: {sum(dropped.values())}  {dict(dropped)}\n")

    # --- build -------------------------------------------------------------
    entries = list(cached_entries)
    failures = []
    start = time.time()
    if todo:
        with ProcessPoolExecutor(max_workers=args.jobs) as pool:
            futures = {pool.submit(build_post, item): item[0] for item in todo}
            done = 0
            for fut in as_completed(futures):
                slug = futures[fut]
                done += 1
                try:
                    entries.append(fut.result())
                except Exception as exc:
                    failures.append({"slug": slug, "error": f"{type(exc).__name__}: {exc}"})
                if done % 100 == 0 or done == len(todo):
                    rate = done / max(0.001, time.time() - start)
                    eta = (len(todo) - done) / max(rate, 0.001)
                    print(f"  {done}/{len(todo)}  {rate:.1f}/s  eta {eta/60:.1f}m", flush=True)

    for e in entries:
        cache[e["slug"]] = e
    with open(cache_path, "w", encoding="utf-8") as fh:
        json.dump(cache, fh)

    # --- indexes + report ---------------------------------------------------
    years = write_indexes(entries, cdn_base)
    # Derived from the year indexes just written, so it can never describe an
    # older corpus than the one on disk. Cheap enough to always redo.
    topics = build_av_topics.build(DATA)
    img_bytes = dir_size(BUILD) - sum(e["bytes"] for e in entries)

    report = {
        "generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "corpus": args.root,
        "posts_built": len(entries),
        "dropped": dict(dropped),
        "failures": failures,
        "years": years,
        "markdown_bytes": sum(e["bytes"] for e in entries),
        "image_bytes": max(0, img_bytes),
        "posts_with_hero": sum(1 for e in entries if e["hero"]),
        "posts_without_images": sum(1 for e in entries if e["images"] == 0),
        "remote_image_refs": sum(e["remote_images"] for e in entries),
        "elapsed_seconds": round(time.time() - start, 1),
    }
    with open(os.path.join(BUILD, "build-report.json"), "w", encoding="utf-8") as fh:
        json.dump(report, fh, indent=2)

    print(f"\nbuilt {len(entries)} posts across {len(years)} years in "
          f"{report['elapsed_seconds']}s")
    print(f"  markdown {report['markdown_bytes']/1e6:8.1f} MB")
    print(f"  images   {report['image_bytes']/1e9:8.2f} GB")
    print(f"  heroes   {report['posts_with_hero']}   no images: {report['posts_without_images']}"
          f"   remote refs: {report['remote_image_refs']}")
    if failures:
        print(f"  FAILURES {len(failures)} — see .av-build/build-report.json")
    print(f"\nindexes -> public/data/av-years.json + {len(years)} year files")
    print(f"topics  -> public/data/av-topics.json "
          f"({len(topics['clusters'])} clusters, "
          f"{sum(len(c['topics']) for c in topics['clusters'])} topics)")


if __name__ == "__main__":
    main()
