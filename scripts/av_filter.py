#!/usr/bin/env python3
"""av_filter.py — decide which Analytics Vidhya posts are educational, and clean them.

Imported by build_av_archive.py; also runnable directly to audit the corpus:

    python3 scripts/av_filter.py            # counts + samples per bucket
    python3 scripts/av_filter.py --list-dropped > dropped.txt

Every rule here was derived from measuring the actual corpus, not guessed. The
counts in the docstrings are from the 10,837-post scan and are worth re-checking
if the corpus is ever re-scraped.

Three kinds of thing get dropped:

  1. Job postings — 1,210 posts. Analytics Vidhya ran a job board under the same
     /blog/ path. These carry the `jobs` category with near-perfect precision;
     titles look like "Data Scientist - Amazon - Bangalore (2-6 years)".

  2. Site chrome / promos — the `announcement` category (DataHour webinars,
     course sales, funding press releases) plus event listings.

  3. Failed scrapes — 36 pages where the scraper captured the site footer
     instead of an article. They are detectable two ways at once: they contain
     the footer nav ("Flagship Programs" / "ref=footer") AND almost no body.
     Their titles are wrong too — all 36 inherited "GPT-5.6 Is Here: Sol, Terra,
     and Luna" from the site's latest-post widget, so title is not trustworthy
     on its own.

Deliberately KEPT, despite looking droppable:
  - `career` / `job-roles` (341) — "How to Learn AI?", "Career Transition From
    Software Developer to Data Scientist". Career *education*, not postings.
  - `interviews-2` (163) — dominated by "Top 25 Interview Questions on RNN"
    style interview prep.
  - `videos` (204) — "Softmax Activation Function", "Binary Cross Entropy".
  - Posts with no category at all (81) — these are old (2014-2017) posts that
    predate the category footer, and they are some of the most educational in
    the corpus ("An Intuitive Way to Understand Gradient Descent").
"""
import argparse
import os
import re
import sys
from collections import defaultdict

# --------------------------------------------------------------------------
# Rules
# --------------------------------------------------------------------------

#: Categories that are never educational content.
DROP_CATEGORIES = {"jobs", "announcement"}

#: Categories that are topical news rather than teaching.
NEWS_CATEGORIES = {"news", "avbytes"}

#: News ages badly; tutorials do not. Industry news from 2019 about a product
#: that no longer exists is noise, while recent news still has reference value.
#: So news is kept from this year onward and dropped before it. Tutorials are
#: never subject to this cutoff — a 2015 regression walkthrough is still a
#: regression walkthrough.
NEWS_CUTOFF_YEAR = 2024

#: Folder names are "YYYY-MM-slug" — the publication date, and more reliable
#: than the frontmatter `date:`, which records last-update and is unparseably
#: inconsistent across the corpus ("24 Apr, 2015" vs "2024-01").
SLUG_DATE = re.compile(r"^(\d{4})-(\d{2})-")

#: Job-posting titles. The "(N years of experience)" suffix is the strongest
#: single signal; the role-dash-company shape catches the rest.
JOB_TITLE = re.compile(
    r"\(\s*\d+\s*[-–—+]?\s*\d*\s*\+?\s*(years?|yrs?)[^)]*\)"
    r"|^\s*(senior|sr\.?|junior|jr\.?|lead|principal|associate)?\s*"
    r"(data scientist|data analyst|business analyst|business intelligence|"
    r"analytics? (manager|consultant|lead|architect)|hadoop developer|"
    r"bi (developer|analyst|architect)|research scientist|engagement manager|"
    r"team manager|group manager|technical (architect|lead))\b[^|]*[–—-]\s*\w",
    re.I,
)
JOB_WORDS = re.compile(
    r"\b(we are hiring|now hiring|job opening|vacancy|apply now|walk-?in drive)\b", re.I
)

#: Analytics Vidhya's own marketing and corporate news. Scoped tightly so it
#: cannot swallow third-party funding news, which is a separate policy call.
PROMO_TITLE = re.compile(
    r"\b(datahour|hacklive|flash sale|\d+\s*%\s*off|"
    # "Sessions at DataHack Summit", "DataHack Summit 2024: ..." — but not a
    # talk write-up that merely cites the summit in a trailing parenthetical.
    r"(sessions|speakers?|meet|attend|tickets?|agenda|wrap-?up)[^|]{0,30}"
    r"datahack summit|^datahack summit|"
    r"register now|hurry up|mark your calendars|"
    r"we just turned|small break to celebrate|independence day bonanza|"
    r"analytics vidhya (announces|launches)|launching analytics vidhya|"
    r"exciting updates from analytics vidhya|upcoming (datahour )?sessions)\b",
    re.I,
)
#: Corporate news *about Analytics Vidhya / its parent*, not the industry.
AV_CORPORATE = re.compile(
    r"(analytics vidhya|fractal)\b.{0,60}\b(funding|unicorn|acquire|raises|investment)"
    r"|\b(funding|unicorn|raises|investment)\b.{0,60}\b(analytics vidhya|fractal)",
    re.I,
)

#: Conference/meetup listings — "Event Name, City, Country, 5th July 2015".
#: Anchored to the end of the title so a mid-sentence date cannot trigger it.
EVENT_LISTING = re.compile(
    r",[^,]{2,40},[^,]{0,40}\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)"
    r"[a-z]*\.?\s*\d{1,2}([a-z]{2})?\s*([–—-]\s*\d{1,2}[a-z]{0,2})?,?\s*\d{4}?\s*$"
    r"|,\s*\d{1,2}(st|nd|rd|th)\s+\w+\s+\d{4}\s*$",
    re.I,
)

#: Titles shaped like teaching material. Any of these vetoes a *title-pattern*
#: drop — they exist because "Data Analyst Resume Secrets - How to Stand Out"
#: and "Exclusive Interview with SRK ... (DataHack Summit - Workshop Speaker)"
#: were both being dropped by patterns meant for postings and promos.
#: Category-based drops (jobs/announcement) are NOT vetoed: those are reliable.
EDUCATIONAL_SHAPE = re.compile(
    r"\b(how to|how do|what is|what are|why |guide|tutorial|introduction|intro to|"
    r"beginner|step[- ]by[- ]step|explained|understanding|learn |mastering|"
    r"tips|secrets|ways to|steps to|questions|cheat ?sheet|comparison|vs\.?\b|"
    r"difference between|complete |ultimate |top \d+|\d+ (best|ways|things|steps|"
    r"tips|questions|projects|tools|libraries|techniques|examples))\b"
    r"|^exclusive interview\b|\?$",
    re.I,
)

#: Site footer nav that leaked into failed scrapes.
FOOTER_CHROME = re.compile(
    r"##\s*Flagship Programs|GenAI Pinnacle Program|\?ref=footer", re.I
)

#: Below this many characters of real body, a post is a stub, not an article.
#: p1 of the corpus is ~1,838 chars, so 1,200 sits safely under real content.
MIN_BODY_CHARS = 1200

CATEGORY_LINK = re.compile(
    r"\[([^\]]+)\]\(https://www\.analyticsvidhya\.com/blog/category/([^)/]+)/?\)"
)
FRONTMATTER = re.compile(r"^---\n(.*?)\n---\n", re.S)
TITLE_FIELD = re.compile(r'^title:\s*"(.*)"\s*$', re.M)
UNICODE_ESCAPE = re.compile(r"\\u([0-9a-fA-F]{4})")
#: A UTF-16 surrogate pair: high (D800-DBFF) followed by low (DC00-DFFF).
SURROGATE_PAIR = re.compile(
    r"\\u([dD][89abAB][0-9a-fA-F]{2})\\u([dD][c-fC-F][0-9a-fA-F]{2})"
)


def decode_escapes(s):
    """Fix the scraper's undecoded \\uXXXX sequences — 24.8% of titles have them.

    Done with an explicit substitution rather than `codecs.decode(s,
    'unicode_escape')`, which would mangle any real non-ASCII already in the
    string by round-tripping it through latin-1.

    Surrogate pairs must be recombined *before* the single-escape pass. Six
    posts carry emoji as UTF-16 pairs (`\\ud83e\\udd47` = 🥇), and decoding each
    half on its own yields two lone surrogates — a str that looks fine in
    Python but raises "surrogates not allowed" the moment it is encoded to
    UTF-8. Any lone surrogate that survives is dropped rather than kept, since
    it cannot be written to a file or a JSON document either way.
    """
    s = SURROGATE_PAIR.sub(
        lambda m: chr(
            0x10000
            + ((int(m.group(1), 16) - 0xD800) << 10)
            + (int(m.group(2), 16) - 0xDC00)
        ),
        s,
    )

    def one(m):
        cp = int(m.group(1), 16)
        return "" if 0xD800 <= cp <= 0xDFFF else chr(cp)

    return UNICODE_ESCAPE.sub(one, s)


def strip_chrome(text):
    """Remove the leaked site footer. 152 posts have it; 116 of those are real
    articles that just need it cut off the end."""
    m = FOOTER_CHROME.search(text)
    return text[: m.start()] if m else text


def year_of(slug):
    """Publication year from the folder name, or None if it does not parse."""
    m = SLUG_DATE.match(slug)
    return int(m.group(1)) if m else None


def month_of(slug):
    m = SLUG_DATE.match(slug)
    return f"{m.group(1)}-{m.group(2)}" if m else None


def parse(path, slug=None):
    """Read one index.md into a dict of the fields the filter needs."""
    raw = open(path, encoding="utf-8", errors="replace").read()
    fm = FRONTMATTER.match(raw)
    meta, body = (fm.group(1), raw[fm.end():]) if fm else ("", raw)
    tm = TITLE_FIELD.search(meta)
    title = decode_escapes(tm.group(1)) if tm else ""
    cats = [c for _, c in CATEGORY_LINK.findall(raw[-3000:])]
    core = strip_chrome(body)
    if slug is None:
        slug = os.path.basename(os.path.dirname(path))
    return {
        "slug": slug,
        "year": year_of(slug),
        "month": month_of(slug),
        "title": title,
        "categories": cats,
        "body": body,
        "core": core,
        "raw": raw,
    }


def classify(post, drop_news=True):
    """Return None to keep, or a short string naming why it was dropped."""
    cats = set(post["categories"])
    title = post["title"]

    if FOOTER_CHROME.search(post["raw"]) and len(post["core"]) < MIN_BODY_CHARS:
        return "failed-scrape"
    if len(post["core"]) < MIN_BODY_CHARS:
        return "stub"
    if cats & DROP_CATEGORIES:
        return "job-or-announcement"

    # Below here the evidence is only the title, so an instructional title wins.
    # Precision matters more than recall: dropping a real tutorial is the
    # expensive mistake, keeping one stray promo is not.
    teachy = EDUCATIONAL_SHAPE.search(title)

    if not teachy and (JOB_TITLE.search(title) or JOB_WORDS.search(title)):
        return "job-posting"
    if not teachy and (PROMO_TITLE.search(title) or AV_CORPORATE.search(title)):
        return "av-promo"
    if not teachy and "events" in cats and EVENT_LISTING.search(title):
        return "event-listing"

    # Stale news only. A post with no parseable year is old by definition —
    # the folder naming has been consistent since 2013 — so treat it as stale.
    if drop_news and (cats & NEWS_CATEGORIES):
        year = post.get("year")
        if year is None or year < NEWS_CUTOFF_YEAR:
            return f"news-pre-{NEWS_CUTOFF_YEAR}"
    return None


# --------------------------------------------------------------------------
# Audit entry point
# --------------------------------------------------------------------------

def iter_posts(root):
    for entry in sorted(os.scandir(root), key=lambda e: e.name):
        if not entry.is_dir():
            continue
        path = os.path.join(entry.path, "index.md")
        if os.path.exists(path):
            yield entry.name, path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--root",
        default=os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            "Claude Certeficate", "analytics vidya", "blogs",
        ),
    )
    ap.add_argument(
        "--keep-all-news",
        action="store_true",
        help=f"keep news/avbytes from every year, not just {NEWS_CUTOFF_YEAR}+",
    )
    ap.add_argument("--list-dropped", action="store_true")
    ap.add_argument("--list-kept", action="store_true")
    args = ap.parse_args()

    if not os.path.isdir(args.root):
        sys.exit(f"corpus not found: {args.root}\nPass --root explicitly.")

    buckets = defaultdict(list)
    by_year = defaultdict(lambda: {"kept": 0, "dropped": 0})
    for slug, path in iter_posts(args.root):
        post = parse(path, slug)
        reason = classify(post, drop_news=not args.keep_all_news)
        buckets[reason or "KEEP"].append((slug, post["title"]))
        by_year[post["year"]]["dropped" if reason else "kept"] += 1

    total = sum(len(v) for v in buckets.values())
    kept = len(buckets["KEEP"])

    if args.list_dropped:
        for name, items in buckets.items():
            if name != "KEEP":
                for slug, _ in items:
                    print(slug)
        return
    if args.list_kept:
        for slug, _ in buckets["KEEP"]:
            print(slug)
        return

    news_policy = "all years" if args.keep_all_news else f"{NEWS_CUTOFF_YEAR}+ only"
    print(f"corpus: {total} posts    news kept: {news_policy}")
    print(f"KEEP:   {kept}  ({100*kept/total:.1f}%)\n")
    print("dropped:")
    for name, items in sorted(buckets.items(), key=lambda kv: -len(kv[1])):
        if name == "KEEP":
            continue
        print(f"  {len(items):5d}  {name}")
        for slug, title in items[:3]:
            print(f"           · {title[:78] or slug}")

    print("\nper year (kept / dropped):")
    peak = max(v["kept"] for v in by_year.values()) or 1
    for year in sorted(k for k in by_year if k is not None):
        v = by_year[year]
        bar = "█" * max(1, round(40 * v["kept"] / peak)) if v["kept"] else ""
        print(f"  {year}  {v['kept']:5d} / {v['dropped']:4d}  {bar}")
    print(f"\n  {len([y for y in by_year if y is not None])} years covered")


if __name__ == "__main__":
    main()
