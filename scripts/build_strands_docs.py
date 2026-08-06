#!/usr/bin/env python3
"""Build the Strands Agents docs index from the strandsagents.com archive.

Reads four inputs that live outside this repo, under
`Claude Certeficate/Strands Agents/`:

  user-guide/ api/ examples/ community/ contribute/ labs/
        the rendered docs archive — plain markdown, Python-first, with the
        MDX components already flattened. These are the page *bodies*.
  strands github/harness-sdk/site/src/config/navigation.yml
        the real Starlight navigation config. This is the page *order*.
  strands github/harness-sdk/site/src/content/docs/**
        the MDX sources behind the archive. Read only for frontmatter
        (titles, descriptions, tags) and to recover the `:::note` callouts
        that the archive flattened into bare paragraphs.
  strands github/samples/** and strands github/*/README.md
        the cookbook repo and the org's repo READMEs.

and emits:

  src/data/strandsDocsData.js    nav tree + page index consumed by the viewer
  public/strands/md/<slug>.md    normalized page bodies, fetched on demand
  public/strands/images/         referenced diagrams and the brand marks
  public/strands/build-report.json

The archive and the navigation config disagree in three places, all handled
below: the site publishes docs under `docs/`, the archive drops that prefix;
the site calls the community catalog `integrations/`, the archive calls it
`community/`; and the archive is Python-only, so every TypeScript-only slug in
navigation.yml has no file and is skipped rather than shipped as a dead entry.

Output markdown targets the same renderer contract as the LangChain build
(scripts/build_langchain_docs.py), so both viewers share one markdown module:

    :::caution[Title]         ->  > [!WARNING] Title  blockquote
    (( tab "Python" ))        ->  ```sa-tabs  fence holding JSON
    /docs/user-guide/x/index.md  ->  (lc:user-guide/x)

Run:  python3 scripts/build_strands_docs.py
"""
import json
import os
import posixpath
import re
import shutil
import sys
from collections import OrderedDict

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOWNLOADS = os.path.dirname(ROOT)

ARCHIVE = os.path.join(DOWNLOADS, "Claude Certeficate", "Strands Agents")
GITHUB = os.path.join(ARCHIVE, "strands github")
SITE = os.path.join(GITHUB, "harness-sdk", "site")
NAV_YML = os.path.join(SITE, "src", "config", "navigation.yml")
CONTENT = os.path.join(SITE, "src", "content", "docs")
SAMPLES = os.path.join(GITHUB, "samples")

OUT_MD = os.path.join(ROOT, "public", "strands", "md")
OUT_IMG = os.path.join(ROOT, "public", "strands", "images")
OUT_DATA = os.path.join(ROOT, "src", "data", "strandsDocsData.js")
OUT_REPORT = os.path.join(ROOT, "public", "strands", "build-report.json")

SOURCE_URL = "https://strandsagents.com/"
GITHUB_ORG = "https://github.com/strands-agents"
SAMPLES_TREE = GITHUB_ORG + "/samples/tree/main/"

# The org repos that the archive cloned, in the order the README lists them.
REPOS = [
    ("harness-sdk", "Harness SDK", "The Python and TypeScript agent SDKs — the core of Strands."),
    ("tools", "Tools", "The community tools package: calculator, shell, file IO, and more."),
    ("evals", "Evals", "The evaluation suite: evaluators, detectors, simulators, red teaming."),
    ("shell", "Shell", "The Strands terminal agent."),
    ("agent-builder", "Agent Builder", "An agent that builds agents, with scaffolding and tooling."),
    ("agent-sop", "Agent SOP", "Standard operating procedures agents can follow."),
    ("devtools", "Devtools", "Local development tooling for Strands agents."),
    ("mcp-server", "MCP Server", "The Strands MCP server."),
    ("sdk-typescript", "SDK (TypeScript)", "The standalone TypeScript SDK distribution."),
    ("extension-template", "Extension Template", "A starting point for publishing a community extension."),
    ("samples", "Samples", "The sample repository this section's cookbook is drawn from."),
    ("docs", "Docs", "The documentation site source."),
]

# ── products ────────────────────────────────────────────────────────────────
# Each becomes one entry in the viewer's rail switcher. The sidebar has a
# single "Strands Agents" item that enters at the guide; crossing between
# products happens inside the viewer, because the prose links across them.
PRODUCTS = OrderedDict([
    ("guide", {
        "label": "User Guide",
        "blurb": "Quickstart, the agent loop, tools, memory, multi-agent, evals, and deployment.",
        "glyph": "book",
        "accent": "#00A34C",
    }),
    ("api", {
        "label": "Python API",
        "blurb": "Every module, class, and function in the Strands Python SDK.",
        "glyph": "braces",
        "accent": "#0E9F6E",
    }),
    ("examples", {
        "label": "Examples",
        "blurb": "Runnable agents that each demonstrate one pattern end to end.",
        "glyph": "play",
        "accent": "#00B353",
    }),
    ("community", {
        "label": "Community",
        "blurb": "Community model providers, tools, plugins, memory stores, and how to contribute.",
        "glyph": "users",
        "accent": "#2BA36A",
    }),
    ("samples", {
        "label": "Samples & Repos",
        "blurb": "The samples cookbook and the strands-agents GitHub repositories.",
        "glyph": "github",
        "accent": "#3F8F63",
    }),
])

report = {
    "pages": 0, "skipped_typescript_only": [], "missing_slugs": [],
    "images_copied": 0, "images_missing": [],
    "callouts_restored": 0, "callouts_unmatched": [],
    "tab_groups": 0, "tabs_dropped_empty": 0,
    "unresolved_links": [], "empty_links": 0,
    "swept_pages": [], "bytes_md": 0, "bytes_img": 0,
}


# ── small helpers ───────────────────────────────────────────────────────────

def read_text(path):
    with open(path, encoding="utf-8", errors="ignore") as handle:
        return handle.read()


FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---\n?", re.S)


def split_frontmatter(text):
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}, text
    try:
        meta = yaml.safe_load(match.group(1)) or {}
    except yaml.YAMLError:
        meta = {}
    return (meta if isinstance(meta, dict) else {}), text[match.end():]


TAB_OPEN_RE = re.compile(r'^\(\(\s*tab\s+"(.*?)"\s*\)\)\s*$')
TAB_CLOSE_RE = re.compile(r'^\(\(\s*/tab\s+"(.*?)"\s*\)\)\s*$')
TAB_MARKER_RE = re.compile(r'^\(\(\s*/?tab\s+".*?"\s*\)\)\s*$')


def fence_map(lines):
    """True for every line inside a fenced code block.

    Consulted by every transform below — the corpus is full of shell samples
    holding `<YOUR_KEY>` and `:::` separators that would otherwise be read as
    markup.
    """
    inside = [False] * len(lines)
    fence = None
    for i, line in enumerate(lines):
        stripped = line.lstrip()
        match = re.match(r"^(`{3,}|~{3,})", stripped)
        if match:
            token = match.group(1)[0] * 3
            if fence is None:
                fence, inside[i] = token, True
                continue
            if stripped.startswith(fence):
                inside[i], fence = True, None
                continue
        inside[i] = fence is not None
    return inside


def blocks_of(text):
    """Split into (start, end, joined_text) blocks, treating a fence as one block.

    Callout recovery matches on whole paragraphs: the MDX hard-wraps its prose
    and the archive does not, so line-by-line comparison misses a fifth of them.

    A `(( tab ))` marker ends a block the way a blank line does and never joins
    one. It sits flush against the prose it wraps, so without this a callout
    inside a tab would swallow its own closing marker and the tab would never
    terminate.
    """
    lines = text.split("\n")
    inside = fence_map(lines)
    out, start = [], None
    for i, line in enumerate(lines):
        boundary = not inside[i] and (not line.strip() or TAB_MARKER_RE.match(line))
        if not boundary:
            if start is None:
                start = i
        elif start is not None:
            out.append((start, i - 1, " ".join(lines[start:i])))
            start = None
    if start is not None:
        out.append((start, len(lines) - 1, " ".join(lines[start:])))
    return out


def plain(text):
    """Prose down to comparable text: no markup, no smart punctuation."""
    text = (text.replace("’", "'").replace("‘", "'")
                .replace("“", '"').replace("”", '"')
                .replace("—", "--").replace("–", "-"))
    text = re.sub(r"<Syntax[^>]*/>", "", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\\(.)", r"\1", text)
    text = re.sub(r"[*_`#>]", "", text)
    return re.sub(r"\s+", " ", text).strip()


def first_sentence(body):
    for line in body.split("\n"):
        line = line.strip()
        if not line or line.startswith(("#", ">", "!", "|", "```", "-", "*", "(")):
            continue
        text = plain(line)
        if not text:
            continue
        return (text[:180] + "…") if len(text) > 180 else text
    return ""


# ── slugs ───────────────────────────────────────────────────────────────────

def archive_slug(nav_slug):
    """`docs/integrations/tools/x` -> `community/tools/x`, the archive's spelling."""
    slug = nav_slug.strip().strip("/")
    if slug.startswith("docs/"):
        slug = slug[len("docs/"):]
    return re.sub(r"^integrations(/|$)", r"community\1", slug)


def archive_path(slug):
    """The archive file for a slug, allowing the `index.md` form for section roots."""
    for candidate in (slug + ".md", os.path.join(slug, "index.md")):
        path = os.path.join(ARCHIVE, candidate)
        if os.path.exists(path):
            return path
    return None


def site_path(slug):
    """The MDX behind an archive slug, for frontmatter and callouts."""
    rel = re.sub(r"^community(/|$)", r"integrations\1", slug)
    for candidate in (rel + ".mdx", rel + ".md",
                      os.path.join(rel, "index.mdx"), os.path.join(rel, "index.md")):
        path = os.path.join(CONTENT, candidate)
        if os.path.exists(path):
            return path
    return None


def source_url(slug):
    if slug.startswith(("samples/", "repos/")):
        return None
    published = re.sub(r"^community(/|$)", r"integrations\1", slug)
    published = re.sub(r"/index$", "", published)
    return "%sdocs/%s/" % (SOURCE_URL, published)


# Sample folders are named for what they teach, so a plain title-case pass
# turns the acronyms in them into words ("Tools And Mcp", "Genai").
ACRONYMS = {
    "mcp": "MCP", "sdk": "SDK", "api": "API", "sql": "SQL", "dsql": "DSQL",
    "a2a": "A2A", "ai": "AI", "hitl": "HITL", "aws": "AWS", "cli": "CLI",
    "llm": "LLM", "rag": "RAG", "ui": "UI", "sre": "SRE", "genai": "GenAI",
    "pii": "PII", "otel": "OTel", "whatsapp": "WhatsApp",
}
STOPWORDS = {"and", "with", "to", "in", "for", "the", "of", "as", "a", "an", "on"}


def titleize(name):
    """`agents-as-tools` -> `Agents as Tools`, the archive README's own scheme."""
    words = [word for word in re.split(r"[-_\s]+", name.replace(".md", "")) if word]
    out = []
    for index, word in enumerate(words):
        lowered = word.lower()
        if lowered in ACRONYMS:
            out.append(ACRONYMS[lowered])
        elif index and lowered in STOPWORDS:
            out.append(lowered)
        else:
            out.append(word[:1].upper() + word[1:])
    return " ".join(out)


# ── step 1: recover the callouts the archive flattened ──────────────────────

DIRECTIVE_RE = re.compile(
    r"^:::(note|caution|tip|danger|warning|important)(?:\[([^\]]*)\])?\s*\n(.*?)^:::\s*$",
    re.S | re.M)

DIRECTIVE_KIND = {
    "note": "NOTE", "tip": "TIP", "caution": "WARNING",
    "warning": "WARNING", "important": "WARNING", "danger": "DANGER",
}


def restore_callouts(body, mdx, slug):
    """Re-wrap the `:::note` blocks that the archive rendered as bare prose.

    The archive lost the callout chrome but kept the text verbatim, so each
    directive is located by matching the first 60 characters of its body
    against the archive's blocks. An unmatched directive is left alone — the
    prose is still correct, it just reads as an ordinary paragraph.
    """
    if not mdx or ":::" not in mdx:
        return body

    for match in DIRECTIVE_RE.finditer(mdx):
        kind = DIRECTIVE_KIND.get(match.group(1), "NOTE")
        title = (match.group(2) or "").strip()
        parts = [plain(text) for _s, _e, text in blocks_of(match.group(3).strip("\n"))]
        parts = [part for part in parts if part]
        if not parts:
            continue

        lines = body.split("\n")
        blocks = blocks_of(body)
        head = next((b for b in blocks if b[2] and plain(b[2]).startswith(parts[0][:60])), None)
        if head is None:
            report["callouts_unmatched"].append({"slug": slug, "title": title or None})
            continue

        # Walk forward to the block holding the directive's last paragraph, so
        # multi-paragraph callouts keep all of their body.
        tail = head
        if len(parts) > 1:
            start = blocks.index(head)
            for block in blocks[start:start + len(parts) + 2]:
                if block[2] and plain(block[2]).startswith(parts[-1][:60]):
                    tail = block
        first, last = head[0], tail[1]
        if any(TAB_MARKER_RE.match(line) for line in lines[first:last + 1]):
            # A callout that appears to straddle a tab boundary is a mismatch:
            # wrapping it would quote the marker and orphan the tab.
            report["callouts_unmatched"].append({"slug": slug, "title": title or None})
            continue

        # The archive prints a titled callout's title as the paragraph directly
        # above the body. Absorb it so it does not repeat inside the callout.
        if title:
            above = [b for b in blocks if b[1] < first and b[2].strip()]
            if above and plain(above[-1][2]) == plain(title):
                first = above[-1][0]

        quoted = ["> [!%s]%s" % (kind, (" " + title) if title else ""), ">"]
        for line in lines[head[0]:last + 1]:
            quoted.append("> " + line if line.strip() else ">")
        body = "\n".join(lines[:first] + quoted + lines[last + 1:])
        report["callouts_restored"] += 1

    return body


# ── step 2: language tab groups ─────────────────────────────────────────────

def convert_tabs(body):
    """`(( tab "Python" ))` runs -> one ```sa-tabs fence holding JSON.

    Bodies are markdown, not just code: most Python/TypeScript pairs carry a
    sentence of their own before the sample, so the viewer renders each tab
    through the same markdown pipeline rather than as a bare code block. A few
    pages nest a language pair inside an outer tab (the MCP page pairs
    Strands / Claude Code and then Python / TypeScript within each), so a body
    is converted recursively and the scan tracks depth to find its own closer.
    """
    lines = body.split("\n")
    inside = fence_map(lines)
    out, i = [], 0

    while i < len(lines):
        if inside[i] or not TAB_OPEN_RE.match(lines[i]):
            out.append(lines[i])
            i += 1
            continue

        tabs = []
        while i < len(lines):
            head = TAB_OPEN_RE.match(lines[i]) if not inside[i] else None
            if not head:
                break
            label, j, buf, depth = head.group(1), i + 1, [], 0
            while j < len(lines):
                if not inside[j]:
                    if TAB_OPEN_RE.match(lines[j]):
                        depth += 1
                    elif TAB_CLOSE_RE.match(lines[j]):
                        if depth == 0:
                            break
                        depth -= 1
                buf.append(lines[j])
                j += 1
            if j >= len(lines):        # unterminated; leave the run untouched
                break
            text = convert_tabs("\n".join(buf).strip("\n"))
            if text.strip():
                tabs.append({"label": label, "body": text})
            else:
                report["tabs_dropped_empty"] += 1
            i = j + 1
            peek = i
            while peek < len(lines) and not lines[peek].strip():
                peek += 1
            if peek < len(lines) and not inside[peek] and TAB_OPEN_RE.match(lines[peek]):
                i = peek
            else:
                break

        if not tabs:
            continue
        report["tab_groups"] += 1
        out.append("```sa-tabs")
        out.extend(json.dumps(tabs, indent=1).split("\n"))
        out.append("```")

    return "\n".join(out)


# ── step 3: links and images ────────────────────────────────────────────────

def normalize_target(href):
    target = href.split("#")[0].split("?")[0].rstrip("/")
    target = re.sub(r"/index\.md$", "", target)
    target = re.sub(r"\.md$", "", target)
    return archive_slug(target)


def repo_base(slug):
    """The GitHub tree URL a README's own relative links are written against.

    Sample and repo pages are ordinary GitHub markdown: they point at sibling
    notebooks, `.env.example` files and code directories that this build has no
    page for. Resolving them against the docs site would send every one of them
    to a 404, so they resolve back to GitHub instead.
    """
    if slug.startswith("samples/"):
        rest = slug[len("samples/"):]
        return SAMPLES_TREE + (rest + "/" if rest else "")
    if slug.startswith("repos/"):
        return "%s/%s/tree/main/" % (GITHUB_ORG, slug[len("repos/"):])
    return None


def rewrite_links(body, known, slug):
    """`/docs/user-guide/x/index.md#y` -> `(lc:user-guide/x#y)` when in the build."""
    base = repo_base(slug)

    def sub(match):
        label, href = match.group(1), match.group(2).strip()
        if not href:
            report["empty_links"] += 1
            return label
        if href.startswith(("http://", "https://", "mailto:", "#")):
            return match.group(0)
        anchor = "#" + href.split("#", 1)[1] if "#" in href else ""
        target = normalize_target(href)
        if target in known:
            return "[%s](lc:%s%s)" % (label, target, anchor)
        report["unresolved_links"].append({"from": slug, "href": href})
        if base and not href.startswith("/"):
            # posixpath.normpath collapses the ../ hops the README walks up.
            joined = posixpath.normpath(posixpath.join(base, href.split("#")[0]))
            return "[%s](%s%s)" % (label, joined.replace(":/", "://", 1), anchor)
        return "[%s](%sdocs/%s/%s)" % (
            label, SOURCE_URL, re.sub(r"^community(/|$)", r"integrations\1", target), anchor)

    # The lookbehind keeps this off image syntax, which rewrite_images owns.
    return re.sub(r"(?<!!)\[([^\]]*)\]\(([^)\s]*)\)", sub, body)


def rewrite_images(body, page_dir, assets):
    def sub(match):
        alt, src = match.group(1), match.group(2).strip()
        if src.startswith(("http://", "https://", "data:")):
            return match.group(0)
        source = os.path.normpath(os.path.join(page_dir, src))
        if not (source.startswith(ARCHIVE) and os.path.exists(source)):
            report["images_missing"].append(src)
            return ""
        rel = os.path.relpath(source, ARCHIVE).replace(os.sep, "/")
        assets.add(rel)
        return "![%s](/strands/images/%s)" % (alt, rel)

    return re.sub(r"!\[([^\]]*)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)", sub, body)


# ── step 4: tidy ────────────────────────────────────────────────────────────

def lift_heading(body):
    """Pull a leading `# Title` off the body, returning (body, title or None).

    Only the README-sourced pages have one; every docs page opens straight into
    prose because its title lives in frontmatter. Left in place it would render
    a second, differently-worded headline under the viewer's own.
    """
    match = re.match(r"\A\s*#\s+(.+?)\s*\n", body)
    if not match:
        return body, None
    return body[match.end():], plain(match.group(1)) or None


def tidy(body):
    lines = body.split("\n")
    inside = fence_map(lines)
    for i, line in enumerate(lines):
        if inside[i]:
            continue
        # react-markdown drops raw HTML, so a <br> would silently eat its line
        # break; two trailing spaces is the markdown spelling of the same thing.
        lines[i] = re.sub(r"<br\s*/?>", "  \n", line)
        # Placeholders like <YOUR_API_KEY> outside code read as HTML otherwise.
        lines[i] = re.sub(r"<([A-Z][A-Z0-9_]{2,})>", r"`<\1>`", lines[i])
    body = "\n".join(lines)
    body = re.sub(r"\n{4,}", "\n\n\n", body)
    return body.strip() + "\n"


# ── navigation: the docs corpus ─────────────────────────────────────────────

def nav_entries(items):
    """Walk navigation.yml into (label, slug) leaves and nested groups."""
    out = []
    for item in items or []:
        if isinstance(item, str):
            out.append({"kind": "page", "slug": archive_slug(item), "label": None})
        elif isinstance(item, dict):
            if item.get("items"):
                kids = nav_entries(item["items"])
                if kids:
                    out.append({
                        "kind": "group", "label": item.get("label", ""),
                        "expanded": not item.get("collapsed", False),
                        "badge": badge_text(item.get("badge")), "items": kids,
                    })
            elif item.get("slug"):
                out.append({"kind": "page", "slug": archive_slug(item["slug"]),
                            "label": item.get("label")})
    return out


def badge_text(badge):
    if isinstance(badge, str):
        return badge
    if isinstance(badge, dict):
        return badge.get("text")
    return None


def prune(items, claimed):
    """Drop entries with no archive file — every one is a TypeScript-only page."""
    out = []
    for item in items:
        if item["kind"] == "group":
            kids = prune(item["items"], claimed)
            if kids:
                out.append({**item, "items": kids})
            continue
        slug = item["slug"]
        if slug in claimed:
            continue
        if not archive_path(slug):
            report["skipped_typescript_only"].append(slug)
            continue
        claimed.add(slug)
        out.append(item)
    return out


# ── navigation: the Python API reference ────────────────────────────────────

API_LINK_RE = re.compile(r"^(\s*)-\s+\[([^\]]+)\]\(/docs/api/python/([^)]+)\)\s*$")
API_GROUP_RE = re.compile(r"^(\s*)-\s+\*\*(.+?)\*\*\s*$")


def api_tree(claimed):
    """`api/python.md` is the reference's own nav: nested bold groups of links."""
    path = os.path.join(ARCHIVE, "api", "python.md")
    if not os.path.exists(path):
        return []

    root = []
    stack = [(-1, root)]
    for line in read_text(path).split("\n"):
        group = API_GROUP_RE.match(line)
        link = API_LINK_RE.match(line)
        if not group and not link:
            continue
        indent = len((group or link).group(1))
        while len(stack) > 1 and indent <= stack[-1][0]:
            stack.pop()
        parent = stack[-1][1]
        if group:
            node = {"kind": "group", "label": group.group(2), "expanded": False,
                    "badge": None, "items": []}
            parent.append(node)
            stack.append((indent, node["items"]))
        else:
            slug = "api/python/" + link.group(3).strip().rstrip("/")
            if slug in claimed or not archive_path(slug):
                continue
            claimed.add(slug)
            parent.append({"kind": "page", "slug": slug, "label": link.group(2)})
    return root


# ── navigation: the samples cookbook and the org repos ──────────────────────

SAMPLE_SECTIONS = OrderedDict([
    ("01-learn", "Learn"),
    ("02-deploy", "Deploy"),
    ("03-integrate", "Integrate"),
    ("04-industry-use-cases", "Industry use cases"),
])


def samples_tree(bodies):
    """Every README.md under samples/python, grouped by its numbered section.

    Sample slugs are `samples/<path>`; their bodies are read straight from the
    repo rather than from the archive, so they are collected here.
    """
    tabs = []
    for folder, label in SAMPLE_SECTIONS.items():
        base = os.path.join(SAMPLES, "python", folder)
        if not os.path.isdir(base):
            continue
        items, root_slug = [], None
        for current, dirs, files in os.walk(base):
            dirs.sort()
            if "README.md" not in files:
                continue
            rel = os.path.relpath(os.path.join(current, "README.md"), SAMPLES)
            slug = "samples/" + os.path.dirname(rel).replace(os.sep, "/")
            bodies[slug] = os.path.join(current, "README.md")
            if current == base:
                root_slug = slug
                continue
            depth = slug.count("/") - 2
            items.append({"kind": "page", "slug": slug,
                          "label": titleize(re.sub(r"^\d+-", "", os.path.basename(current))),
                          "depth": depth})
        items.sort(key=lambda item: item["slug"])
        if root_slug:
            items.insert(0, {"kind": "page", "slug": root_slug, "label": "Overview"})
        if items:
            tabs.append({"section": "Samples cookbook", "tab": label,
                         "items": [{k: v for k, v in item.items() if k != "depth"}
                                   for item in items]})

    repo_items = []
    for name, label, _blurb in REPOS:
        readme = os.path.join(GITHUB, name, "README.md")
        if not os.path.exists(readme):
            continue
        slug = "repos/" + name
        bodies[slug] = readme
        repo_items.append({"kind": "page", "slug": slug, "label": label})
    if repo_items:
        tabs.append({"section": "GitHub", "tab": "Repositories", "items": repo_items})
    return tabs


# ── assembly ────────────────────────────────────────────────────────────────

def build_products():
    """Returns (products, extra_bodies) — the nav for all five rail entries."""
    config = yaml.safe_load(read_text(NAV_YML))
    sidebar = {group.get("label"): group.get("items", [])
               for group in config.get("sidebar", []) if isinstance(group, dict)}

    claimed, bodies = set(), {}
    products = {pid: {"id": pid, **meta, "tabs": []} for pid, meta in PRODUCTS.items()}

    def add_tabs(pid, groups, section=""):
        """Each nav group becomes one tab in the rail.

        A handful of pages sit loose at the top level of a nav group rather
        than inside one ("Build with AI", "Versioning & Support"). They all
        collect into a single Overview tab, placed where the first of them
        appeared — two tabs sharing that name would read as a duplicate.
        """
        bucket = products[pid]["tabs"]
        overview = None
        for group in groups:
            if group["kind"] == "group":
                bucket.append(
                    {"section": section, "tab": group["label"], "items": group["items"]})
                continue
            if overview is None:
                overview = {"section": section, "tab": "Overview", "items": []}
                bucket.append(overview)
            overview["items"].append(group)

    add_tabs("guide", prune(nav_entries(sidebar.get("Docs")), claimed))
    add_tabs("examples", [{"kind": "group", "label": "Examples", "expanded": True,
                           "badge": None,
                           "items": prune(nav_entries(sidebar.get("Examples")), claimed)}])
    add_tabs("community", prune(nav_entries(sidebar.get("Community")), claimed))

    for group in api_tree(claimed):
        if group["kind"] == "group":
            products["api"]["tabs"].append(
                {"section": "strands", "tab": group["label"], "items": group["items"]})
        else:
            products["api"]["tabs"].insert(
                0, {"section": "strands", "tab": "Modules", "items": [group]})

    products["samples"]["tabs"] = samples_tree(bodies)

    sweep_orphans(products, claimed)
    return products, bodies


# navigation.yml predates a handful of archive pages (the community catalog
# landing, two tool integrations). Without this they would be in the build,
# linked to from the prose, and unreachable from the rail.
SWEEP_INTO = [
    ("community/community-packages", "community", "Contribute", "Community catalog"),
    ("community/tools/strands-google", "community", "Tools", "Strands Google"),
    ("community/tools/strands-perplexity", "community", "Tools", "Strands Perplexity"),
]


def sweep_orphans(products, claimed):
    for slug, pid, tab_label, label in SWEEP_INTO:
        if slug in claimed or not archive_path(slug):
            continue
        tab = next((t for t in products[pid]["tabs"] if t["tab"] == tab_label), None)
        if tab is None:
            continue
        claimed.add(slug)
        tab["items"].append({"kind": "page", "slug": slug, "label": label})
        report["swept_pages"].append(slug)


def iter_pages(items):
    for item in items:
        if item["kind"] == "page":
            yield item
        else:
            yield from iter_pages(item["items"])


# ── main ────────────────────────────────────────────────────────────────────

def main():
    for path in (ARCHIVE, NAV_YML, CONTENT):
        if not os.path.exists(path):
            sys.exit("missing input: %s" % path)

    products, extra_bodies = build_products()

    pages = []
    for product in products.values():
        for tab in product["tabs"]:
            for page in iter_pages(tab["items"]):
                page["product"] = product["id"]
                page["tabLabel"] = tab["tab"]
                pages.append(page)
    known = {page["slug"] for page in pages}

    for path in (OUT_MD, OUT_IMG):
        shutil.rmtree(path, ignore_errors=True)
        os.makedirs(path, exist_ok=True)

    assets = set()

    for page in pages:
        slug = page["slug"]
        path = extra_bodies.get(slug) or archive_path(slug)
        if not path:
            report["missing_slugs"].append(slug)
            continue

        body = read_text(path)
        meta = {}
        mdx = site_path(slug)
        if mdx:
            meta, _ = split_frontmatter(read_text(mdx))
        else:
            meta, body = split_frontmatter(body)

        body = restore_callouts(body, read_text(mdx) if mdx else "", slug)
        body = convert_tabs(body)
        # Images before links: image markdown is a superset of link markdown.
        body = rewrite_images(body, os.path.dirname(path), assets)
        body = rewrite_links(body, known, slug)
        body, heading = lift_heading(body)
        body = tidy(body)

        sidebar_meta = meta.get("sidebar") if isinstance(meta.get("sidebar"), dict) else {}
        # Docs pages carry their title in frontmatter and open straight into
        # prose. READMEs carry it as a leading H1 instead, which the viewer's
        # own <h1> would sit directly on top of — so it becomes the title and
        # the rail keeps the shorter label derived from the folder name.
        title = (meta.get("title") or heading or page.get("label")
                 or titleize(os.path.basename(slug)))
        page["title"] = title
        page["navTitle"] = page.get("label") or sidebar_meta.get("label") or title
        page["desc"] = meta.get("description") or first_sentence(body)
        page["tags"] = [str(tag) for tag in (meta.get("tags") or [])][:6]
        page["file"] = "/strands/md/%s.md" % slug
        page["source"] = source_url(slug) or (
            SAMPLES_TREE + slug[len("samples/"):] if slug.startswith("samples/")
            else "%s/%s" % (GITHUB_ORG, slug[len("repos/"):]))

        dest = os.path.join(OUT_MD, slug + ".md")
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "w", encoding="utf-8") as handle:
            handle.write(body)
        report["bytes_md"] += len(body.encode("utf-8"))
        report["pages"] += 1

    if report["missing_slugs"]:
        sys.exit("unresolved slugs: %s" % report["missing_slugs"][:10])

    copy_assets(assets)
    copy_brand()
    write_data(products, pages)
    write_report()

    print("pages           %d across %d sections"
          % (report["pages"], sum(len(p["tabs"]) for p in products.values())))
    print("markdown        %.1f MB" % (report["bytes_md"] / 1e6))
    print("callouts        %d restored, %d unmatched"
          % (report["callouts_restored"], len(report["callouts_unmatched"])))
    print("tab groups      %d" % report["tab_groups"])
    print("images          %d copied, %d missing"
          % (report["images_copied"], len(set(report["images_missing"]))))
    print("typescript      %d slugs skipped (no Python page in the archive)"
          % len(report["skipped_typescript_only"]))
    print("links           %d unresolved, %d empty"
          % (len(report["unresolved_links"]), report["empty_links"]))


def copy_assets(assets):
    for rel in sorted(assets):
        source = os.path.join(ARCHIVE, rel)
        dest = os.path.join(OUT_IMG, rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copy2(source, dest)
        report["images_copied"] += 1
        report["bytes_img"] += os.path.getsize(dest)


def copy_brand():
    """The Strands mark, in both polarities, for the viewer's rail and landing.

    Renamed on the way out. Upstream, `logo-light.svg` is the pale mark drawn
    for a dark page and `logo-dark.svg` is the near-black one drawn for a light
    page, which is exactly backwards from how the viewer picks between them.
    """
    for source_name, dest_name in (("logo-light.svg", "mark-on-dark.svg"),
                                   ("logo-dark.svg", "mark-on-light.svg")):
        source = os.path.join(SITE, "src", "assets", source_name)
        if not os.path.exists(source):
            sys.exit("brand mark missing from the archive: %s" % source)
        shutil.copy2(source, os.path.join(OUT_IMG, dest_name))
        report["images_copied"] += 1


def write_data(products, pages):
    def clean(items):
        out = []
        for item in items:
            if item["kind"] == "page":
                entry = {"slug": item["slug"], "title": item["navTitle"]}
                out.append(entry)
            else:
                kids = clean(item["items"])
                if kids:
                    out.append({
                        "group": item["label"], "expanded": bool(item.get("expanded")),
                        "items": kids,
                        **({"tag": item["badge"]} if item.get("badge") else {}),
                    })
        return out

    tree = [{
        "id": product["id"], "label": product["label"], "blurb": product["blurb"],
        "glyph": product["glyph"], "accent": product["accent"],
        "tabs": [{"section": tab.get("section", ""), "tab": tab["tab"],
                  "items": clean(tab["items"])} for tab in product["tabs"]],
    } for product in products.values()]

    index = [{
        "slug": page["slug"], "title": page["title"], "desc": page["desc"],
        "file": page["file"], "product": page["product"], "tab": page["tabLabel"],
        "source": page["source"],
        **({"tags": page["tags"]} if page.get("tags") else {}),
    } for page in pages]

    with open(OUT_DATA, "w", encoding="utf-8") as handle:
        handle.write(
            "// Auto-generated index of the Strands Agents documentation.\n"
            "//\n"
            "// Source: %s (Python only — TypeScript-only pages are absent from the\n"
            "// archive and are skipped at build time). %d pages. Bodies live under\n"
            "// public/strands/md/ and are fetched on demand by StrandsDocs.\n"
            "//\n"
            "// Regenerate with `npm run build:strands` rather than hand-editing.\n\n"
            "export const STRANDS_SOURCE_URL = %s;\n\n"
            "export const STRANDS_TOTAL_PAGES = %d;\n\n"
            "export const STRANDS_PRODUCTS = %s;\n\n"
            "export const STRANDS_ALL_PAGES = %s;\n"
            % (SOURCE_URL, len(index), json.dumps(SOURCE_URL), len(index),
               json.dumps(tree, indent=1), json.dumps(index, indent=1))
        )


def write_report():
    counts = {}
    for link in report["unresolved_links"]:
        counts[link["href"]] = counts.get(link["href"], 0) + 1
    trimmed = dict(report)
    trimmed["unresolved_links"] = sorted(
        ({"href": href, "count": n} for href, n in counts.items()),
        key=lambda item: -item["count"])[:60]
    trimmed["unresolved_link_count"] = len(report["unresolved_links"])
    trimmed["images_missing"] = sorted(set(report["images_missing"]))
    os.makedirs(os.path.dirname(OUT_REPORT), exist_ok=True)
    with open(OUT_REPORT, "w", encoding="utf-8") as handle:
        json.dump(trimmed, handle, indent=1)


if __name__ == "__main__":
    main()
