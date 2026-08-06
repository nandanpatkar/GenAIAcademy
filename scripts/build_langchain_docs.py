#!/usr/bin/env python3
"""Build the LangChain (Python) docs index from the docs.langchain.com export.

Reads two inputs:

  LangChain-website/          Mintlify MDX exported to .md, snippets pre-inlined
  Langchain/                  the langchain-ai/docs checkout, for three things:
                              src/docs.json      the real Mintlify nav config
                              src/code-samples/  the runnable samples the docs embed
                              its own README and contributor guides

and emits:

  src/data/langchainDocsData.js   nav tree + page index consumed by the viewer
  public/langchain/md/<slug>.md   normalized page bodies, fetched on demand
  public/langchain/images/        referenced diagrams, downscaled
  public/langchain/build-report.json

JavaScript is dropped everywhere: the JS navigation dropdown, the `:::js`
blocks, and the `oss/javascript/**` slugs. That is what makes the page set
resolve cleanly — every JS-only slug in docs.json is missing from the export,
while all 690 Python slugs are present.

The export has one quirk worth knowing about. Mintlify `import` statements were
replaced in place by the snippet body, so each page opens with a run of

    <!-- Inlined Snippet: agents-intro-py.mdx -->
    ...snippet body...

blocks, and the *usage* sites further down still say `<AgentsIntroPy />`. When
both exist the dump is a duplicate: it gets removed and the body is spliced in
at the reference. When no reference exists the dump is the real placement and
stays put. Boundaries come from the matching file under snippets/, since the
inlined copy carries no end marker and is sometimes indented, sometimes not.

Run:  python3 scripts/build_langchain_docs.py
"""
import json
import os
import posixpath
import re
import shutil
import sys
from collections import OrderedDict

try:
    from PIL import Image
except ImportError:  # diagrams then ship at full size
    Image = None

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOWNLOADS = os.path.dirname(ROOT)

SRC = os.path.join(DOWNLOADS, "genai-roadmap-src", "LangChain-website")
REPO = os.path.join(ROOT, "Langchain")
DOCS_JSON = os.path.join(REPO, "src", "docs.json")
CODE_SAMPLES = os.path.join(REPO, "src", "code-samples")

REPO_URL = "https://github.com/langchain-ai/docs"
REPO_BLOB = REPO_URL + "/blob/main/"

OUT_MD = os.path.join(ROOT, "public", "langchain", "md")
OUT_IMG = os.path.join(ROOT, "public", "langchain", "images")
OUT_DATA = os.path.join(ROOT, "src", "data", "langchainDocsData.js")
OUT_REPORT = os.path.join(ROOT, "public", "langchain", "build-report.json")

SOURCE_URL = "https://docs.langchain.com/"

# Images above this ship, but the viewer only fetches them on click. Every one
# is a multi-megabyte LangSmith UI screencast; eager-loading them would pull
# hundreds of megabytes through a reading pane.
HEAVY_IMAGE_BYTES = 2 * 1024 * 1024
MAX_IMAGE_WIDTH = 1400
IMAGE_PASSTHROUGH_BYTES = 120 * 1024
POSTER_SUFFIX = ".poster.png"

# ── products ────────────────────────────────────────────────────────────────
# Each becomes one subsection under the sidebar's "Agents" group. The nav in
# docs.json is organised by lifecycle stage (Build / Test / Deploy / Monitor),
# not by library, so tabs are re-homed onto the library they document.
PRODUCTS = OrderedDict([
    ("langchain", {
        "label": "LangChain",
        "blurb": "Build agents with models, tools, and middleware.",
        "icon": "langchain-icon.png",
        "accent": "#1C3C3C",
    }),
    ("langgraph", {
        "label": "LangGraph",
        "blurb": "Stateful graphs, durable execution, and time travel.",
        "icon": "langgraph-icon.png",
        "accent": "#2F6868",
    }),
    ("deepagents", {
        "label": "Deep Agents",
        "blurb": "Long-horizon agents with skills, sandboxes, and subagents.",
        "icon": "deep-agents-icon.png",
        "accent": "#4B3F8F",
    }),
    ("langsmith", {
        "label": "LangSmith",
        "blurb": "Trace, evaluate, deploy, and monitor agents in production.",
        "icon": "observability-icon-light.png",
        "accent": "#006DDD",
    }),
    ("langchain_samples", {
        "label": "Samples & Repo",
        "blurb": "The runnable code behind the docs, plus the docs repo's own guides.",
        "icon": "engine-icon-light.png",
        "accent": "#8A4FBF",
    }),
])

# (menu, tab) -> product. Tabs not listed fall back to MENU_PRODUCT.
TAB_PRODUCT = {
    ("Build", "Overview"): "langchain",
    ("Build", "LangChain"): "langchain",
    ("Build", "Integrations"): "langchain",
    ("Build", "Learn"): "langchain",
    ("Build", "Reference"): "langchain",
    ("Build", "Contribute"): "langchain",
    ("Build", "LangGraph"): "langgraph",
    ("Build", "Deep Agents"): "deepagents",
    ("Build", "OpenWiki"): "deepagents",
}
MENU_PRODUCT = {
    "Test": "langsmith",
    "Deploy": "langsmith",
    "Monitor": "langsmith",
    "Cloud and Self-hosted": "langsmith",
    "LLM Gateway": "langsmith",
    "No-code agents": "langsmith",
    "Engine": "langsmith",
    "Deep Agents Code": "deepagents",
}

PAGE_TITLES = {}

report = {
    "pages": 0, "missing_slugs": [], "unknown_components": {},
    "images_copied": 0, "images_missing": [], "images_heavy": [],
    "unresolved_links": [], "snippets_spliced": 0, "snippets_inplace": 0,
    "redirects": 0, "externals": 0,
    "samples": 0, "samples_linked": 0, "repo_docs_missing": [],
    "bytes_md": 0, "bytes_img": 0,
}


# ── snippets ────────────────────────────────────────────────────────────────

def pascal(name):
    """agents-intro-py -> AgentsIntroPy, matching the export's reference names."""
    return "".join(part[:1].upper() + part[1:] for part in re.split(r"[-_]", name) if part)


def load_snippets():
    """basename -> body, for every file under snippets/."""
    out = {}
    root_dir = os.path.join(SRC, "snippets")
    for base, _dirs, files in os.walk(root_dir):
        for fname in files:
            if not fname.endswith(".md"):
                continue
            key = fname[:-3]
            body = read_text(os.path.join(base, fname))
            body = strip_frontmatter(body)[1]
            # A first-seen wins policy is fine: the few duplicated basenames are
            # language pairs, and the -py/-js suffix already separates those.
            out.setdefault(key, dedent_snippet(body.strip("\n")))
    return out


def dedent_snippet(text):
    """Undo the stray indent left behind when <CodeGroup> wrappers were stripped.

    96 of the 537 snippet files open with an unindented fence and then indent
    everything after it by four spaces — the shape of a JSX child list with its
    wrapper removed. Left alone, every fence but the first parses as an indented
    code block, so the provider tab strips never group and the code renders as
    literal backticks.
    """
    lines = text.split("\n")
    if not lines or not lines[0].startswith("```"):
        return text
    body = [line for line in lines[1:] if line.strip()]
    if not body:
        return text
    common = min(len(line) - len(line.lstrip()) for line in body)
    if common < 2:
        return text
    return "\n".join([lines[0]] + [line[common:] if line.strip() else line
                                   for line in lines[1:]])


# ── small helpers ───────────────────────────────────────────────────────────

def read_text(path):
    with open(path, encoding="utf-8", errors="ignore") as handle:
        return handle.read()


FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---\n?", re.S)


def strip_frontmatter(text):
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}, text
    meta = {}
    for line in match.group(1).split("\n"):
        if ":" in line and not line.startswith((" ", "-", "#")):
            key, _, value = line.partition(":")
            meta[key.strip()] = value.strip().strip("\"'")
    return meta, text[match.end():]


def fence_map(lines):
    """True for every line that sits inside a fenced code block.

    Every transform below consults this. The export is full of shell and JSON
    samples containing `<DEPLOYMENT_ID>`, `<YOUR_API_KEY>` and TypeScript
    generics, all of which look exactly like MDX components.
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


# ── step 1: inlined-snippet dumps ───────────────────────────────────────────

MARKER_RE = re.compile(r"^\s*<!--\s*Inlined Snippet:\s*(.+?)\.mdx\s*-->\s*$")


def resolve_snippet_dumps(body, snippets):
    """Remove duplicated dumps, keep in-place ones, and splice at references."""
    lines = body.split("\n")
    out, spliceable, i = [], {}, 0

    while i < len(lines):
        match = MARKER_RE.match(lines[i])
        if not match:
            out.append(lines[i])
            i += 1
            continue

        name = match.group(1)
        snippet = snippets.get(name)
        ref_re = re.compile(r"<%s\s*/?>" % re.escape(pascal(name)))
        has_ref = bool(ref_re.search(body))

        if snippet is None:
            # No source file, so the dump's extent is unknowable. Leave the body
            # exactly where it is and drop only the marker; the reference (if
            # any) is removed later so the content never appears twice.
            out.append("")
            i += 1
            continue

        snippet_lines = [l for l in snippet.split("\n")]
        # Consume the dumped copy, which may be indented by 0, 2 or 4 spaces.
        j, matched = i + 1, 0
        while j < len(lines) and matched < len(snippet_lines):
            if not lines[j].strip() and not snippet_lines[matched].strip():
                j += 1
                matched += 1
                continue
            if lines[j].strip() == snippet_lines[matched].strip():
                j += 1
                matched += 1
                continue
            if not lines[j].strip():   # extra blank introduced by indenting
                j += 1
                continue
            break

        if matched < len(snippet_lines) * 0.6:
            # Did not line up; safest is to keep whatever is there verbatim.
            out.append("")
            i += 1
            continue

        if has_ref:
            spliceable[name] = snippet
            report["snippets_spliced"] += 1
            out.append("")
        else:
            report["snippets_inplace"] += 1
            out.extend(["", snippet, ""])
        i = j

    return "\n".join(out), spliceable


def splice_snippet_refs(body, snippets, spliceable):
    """Replace <AgentsIntroPy /> with the snippet body (or drop it)."""
    def sub(match):
        name = match.group(1)
        for key in (spliceable, snippets):
            for candidate, value in key.items():
                if pascal(candidate) == name:
                    return "\n" + value + "\n"
        return ""

    # Attributes are allowed: several snippet components take props, e.g.
    # <PatternEmbed pattern="..." />. Components with no snippet file resolve to
    # "" — they are region tables and embeds that carry no text of their own.
    return re.sub(r"<([A-Z][A-Za-z0-9]*)(?:\s[^>]*?)?\s*/>", sub, body)


# ── step 2: language directives ─────────────────────────────────────────────

def apply_language_directives(body):
    """Keep :::python, drop :::js, map :::caution onto a warning callout."""
    lines = body.split("\n")
    inside = fence_map(lines)
    out, skip_depth, keep_stack = [], 0, []

    for i, line in enumerate(lines):
        if inside[i]:
            if skip_depth == 0:
                out.append(line)
            continue

        stripped = line.strip()
        if stripped.startswith(":::"):
            token = stripped[3:].strip()
            if token:                                  # opening
                if skip_depth or token in ("js", "javascript", "typescript", "agent"):
                    skip_depth += 1
                elif token == "caution":
                    keep_stack.append("caution")
                    out.append("<Warning>")
                else:                                   # python, or an unknown
                    keep_stack.append(token)
                continue
            if skip_depth:                              # closing a dropped block
                skip_depth -= 1
                continue
            if keep_stack and keep_stack.pop() == "caution":
                out.append("</Warning>")
            continue

        if skip_depth == 0:
            out.append(line)

    return "\n".join(out)


# ── step 3: MDX components -> markdown ──────────────────────────────────────

CALLOUTS = {
    "Note": "NOTE", "Info": "NOTE", "Tip": "TIP", "Check": "TIP",
    "Warning": "WARNING", "Important": "WARNING", "Danger": "DANGER",
    "Update": "UPDATE",
}
DISCLOSURES = {"Expandable", "Accordion", "AccordionGroup"}

KNOWN_COMPONENTS = (set(CALLOUTS) | DISCLOSURES |
                    {"Columns", "Card", "CardGroup", "Icon", "Frame", "Tabs", "Tab",
                     "ResponseField", "ParamField", "Tree"})


def convert_components(body):
    """Lower the MDX component set onto markdown the renderer can intercept.

    Callouts and disclosures become GitHub-style alert blockquotes so their
    bodies stay real markdown (bold, links, nested lists and code all survive).
    Card grids become a JSON fence, since card bodies are short label text.
    """
    # <Update label="July 27-31, 2026" rss={{...}}> is a changelog entry, not a
    # callout — the label is the section it introduces.
    body = re.sub(r"<Update\s+([^>]*?)>", lambda m: "\n\n### %s\n\n" % attr(m.group(1), "label"),
                  body, flags=re.S)
    body = re.sub(r"</Update>", "", body)

    for tag, kind in CALLOUTS.items():
        # Attributes are optional: <Note icon="wand" iconType="regular"> occurs.
        body = re.sub(
            r"<%s(?:\s[^>]*)?>\s*(.*?)\s*</%s>" % (tag, tag),
            lambda m, k=kind: blockquote(k, "", m.group(1)),
            body, flags=re.S)
        body = re.sub(r"</?%s(?:\s[^>]*)?>" % tag, "", body)

    for tag in DISCLOSURES:
        body = re.sub(
            r"<%s(?:\s+title=[\"'](.*?)[\"'])?[^>]*>\s*(.*?)\s*</%s>" % (tag, tag),
            lambda m: blockquote("DETAILS", m.group(1) or "Details", m.group(2)),
            body, flags=re.S)
        body = re.sub(r"</?%s[^>]*>" % tag, "", body)

    body = convert_cards(body)
    body = convert_fields(body)

    # <Tree> renders a directory listing; it is already ASCII art inside.
    body = re.sub(r"<Tree[^>]*>\s*(.*?)\s*</Tree>",
                  lambda m: "\n\n```text\n%s\n```\n\n" % m.group(1).strip(),
                  body, flags=re.S)

    # <Icon icon="settings" /> is decorative; the label beside it carries meaning.
    body = re.sub(r"<Icon\s[^>]*/?>", "", body)
    body = re.sub(r"</?(Frame|CardGroup|Columns|Tabs|Tab)[^>]*>", "", body)

    # JSX <img src=".." alt=".." style={{..}} /> -> markdown image.
    body = re.sub(
        r"<img\s+([^>]*?)/?>",
        lambda m: "\n![%s](%s)\n" % (attr(m.group(1), "alt"), attr(m.group(1), "src")),
        body, flags=re.S)

    # Mintlify API-reference shorthand: @[`create_agent`] -> `create_agent`.
    body = re.sub(r"@\[(`[^`]+`)\]", r"\1", body)
    body = re.sub(r"@\[([^\]]+)\]", r"`\1`", body)
    return body


def attr(blob, name):
    match = re.search(r'%s=["\']([^"\']*)["\']' % name, blob)
    return match.group(1) if match else ""


def blockquote(kind, title, content):
    # The lone ">" after the marker keeps it in its own paragraph, so the
    # renderer can drop that first child instead of string-editing the body.
    head = "> [!%s]%s" % (kind, (" " + title) if title else "")
    lines = [head, ">"]
    for line in content.strip("\n").split("\n"):
        lines.append("> " + line if line.strip() else ">")
    return "\n\n" + "\n".join(lines) + "\n\n"


CARD_RE = re.compile(r"<Card\s+([^>]*?)(?:/>|>(.*?)</Card>)", re.S)


def convert_cards(body):
    def one_group(match):
        cards = []
        for card in CARD_RE.finditer(match.group(1)):
            blob, inner = card.group(1), (card.group(2) or "")
            cards.append({
                "title": attr(blob, "title"),
                "icon": attr(blob, "icon"),
                "href": attr(blob, "href"),
                "body": re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", inner)).strip(),
            })
        if not cards:
            # The export flattened most card grids into `### [Title](#)` headings
            # before we ever see them. Keep that body; only the wrapper goes.
            return "\n\n" + match.group(1).strip() + "\n\n"
        return "\n\n```lc-cards\n%s\n```\n\n" % json.dumps(cards, indent=1)

    body = re.sub(r"<Columns[^>]*>(.*?)</Columns>", one_group, body, flags=re.S)
    body = re.sub(r"<CardGroup[^>]*>(.*?)</CardGroup>", one_group, body, flags=re.S)
    # Cards outside a grid still render as a one-card grid.
    body = re.sub(r"(?:<Card\s[^>]*?(?:/>|>.*?</Card>)\s*)+",
                  lambda m: one_group(re.match(r"(.*)", m.group(0), re.S)), body, flags=re.S)
    return body


FIELD_RE = re.compile(
    r"<(ResponseField|ParamField)\s+([^>]*?)(?:/>|>(.*?)</\1>)", re.S)


def convert_fields(body):
    """API field docs -> a bolded term with its type, then an indented body.

    These carry the parameter reference tables on the SDK pages; dropping the
    tag alone would run the field name into its own description.
    """
    def one(match):
        blob, inner = match.group(2), (match.group(3) or "")
        name = attr(blob, "name") or attr(blob, "query") or attr(blob, "path") or ""
        kind = attr(blob, "type")
        required = "required" in blob
        head = "**`%s`**" % name if name else ""
        if kind:
            head += " · `%s`" % kind
        if required:
            head += " · _required_"
        inner = re.sub(r"\n{2,}", "\n", inner.strip())
        return "\n\n%s\n%s\n" % (head, inner)

    previous = None
    while previous != body:          # ResponseField nests one level on some pages
        previous = body
        body = FIELD_RE.sub(one, body)
    return body


def record_unknown(body):
    lines = body.split("\n")
    inside = fence_map(lines)
    for i, line in enumerate(lines):
        if inside[i]:
            continue
        for tag in re.findall(r"</?([A-Z][A-Za-z0-9]{2,})[\s/>]", line):
            if tag not in KNOWN_COMPONENTS:
                report["unknown_components"][tag] = report["unknown_components"].get(tag, 0) + 1


# ── step 4: code fences -> provider tab groups ──────────────────────────────

def group_code_tabs(body):
    """Collapse consecutive labelled fences into one tab strip.

    The export writes provider variants as ```python Anthropic, ```python OpenAI
    and so on — the model switcher on docs.langchain.com. Rendered as-is that is
    six near-identical blocks stacked vertically.
    """
    # Fences are sometimes indented because they sit inside a numbered step.
    head_re = re.compile(r"^([ \t]*)```([a-zA-Z0-9_+-]+)[ \t]+(\S.*?)\s*$")
    lines = body.split("\n")
    out, i = [], 0
    while i < len(lines):
        if not head_re.match(lines[i]):
            out.append(lines[i])
            i += 1
            continue

        indent, tabs = head_re.match(lines[i]).group(1), []
        while i < len(lines):
            head = head_re.match(lines[i])
            if not head or head.group(1) != indent:
                break
            lang, label = head.group(2), head.group(3).strip()
            j, buf = i + 1, []
            while j < len(lines) and not lines[j].lstrip().startswith("```"):
                buf.append(lines[j][len(indent):] if lines[j].startswith(indent) else lines[j])
                j += 1
            code = "\n".join(line.rstrip() for line in buf).strip("\n")
            tabs.append({"label": label, "lang": lang, "code": code})
            i = j + 1
            peek = i
            while peek < len(lines) and not lines[peek].strip():
                peek += 1
            nxt = head_re.match(lines[peek]) if peek < len(lines) else None
            if nxt and nxt.group(1) == indent:
                i = peek
            else:
                break

        # This build is Python-only, so a TypeScript sibling in the same strip is
        # the other half of a language toggle and would be a dead tab.
        if any(t["lang"] in ("python", "py") for t in tabs):
            tabs = [t for t in tabs
                    if t["lang"] not in ("typescript", "ts", "javascript", "js")]

        if len(tabs) == 1:
            # A lone labelled fence is a filename caption, not a tab strip.
            out.append("%s```%s %s" % (indent, tabs[0]["lang"], tabs[0]["label"]))
            out.extend(indent + line for line in tabs[0]["code"].split("\n"))
            out.append(indent + "```")
        else:
            out.append(indent + "```lc-tabs")
            out.extend(indent + line for line in json.dumps(tabs, indent=1).split("\n"))
            out.append(indent + "```")
    return "\n".join(out)


# ── step 5: links and images ────────────────────────────────────────────────

def normalize_slug(target):
    target = target.split("#")[0].split("?")[0].rstrip("/")
    target = re.sub(r"^/oss/(python|javascript|js)/", "/oss/", target)
    return target.lstrip("/")


def resolve_link(key, slug_by_archive):
    """Match a href against the build, widening through the shapes docs use.

    Section links point at a directory (`/oss/langchain/middleware`) whose page
    is `middleware/overview.md` or `multi-agent/index.md`, and integration links
    drop the language segment that the file tree actually carries.
    """
    candidates = [key, key + "/index", key + "/overview"]
    if key.startswith("oss/") and not key.startswith("oss/python/"):
        withlang = "oss/python/" + key[len("oss/"):]
        candidates += [withlang, withlang + "/index", withlang + "/overview"]
    for candidate in candidates:
        target = slug_by_archive.get(candidate)
        if target:
            return target
    return None


def rewrite_links(body, slug_by_archive, page_slug):
    def sub(match):
        label, href = match.group(1), match.group(2)
        if href.startswith(("http://", "https://", "#", "mailto:")):
            return match.group(0)
        if not href.startswith("/"):
            return match.group(0)
        anchor = "#" + href.split("#", 1)[1] if "#" in href else ""
        key = normalize_slug(href)
        target = resolve_link(key, slug_by_archive)
        if target:
            return "[%s](lc:%s%s)" % (label, target, anchor)
        report["unresolved_links"].append({"from": page_slug, "href": href})
        return "[%s](%s%s)" % (label, SOURCE_URL.rstrip("/") + "/" + key, anchor)

    # The lookbehind keeps this off image syntax, which rewrite_images owns.
    return re.sub(r"(?<!!)\[([^\]]*)\]\((/[^)\s]*)\)", sub, body)


def rewrite_images(body, assets_used):
    def sub(match):
        alt, src = match.group(1), match.group(2).strip()
        if src.startswith(("http://", "https://", "data:")):
            return match.group(0)
        rel = src.lstrip("/")
        source = os.path.join(SRC, "assets", rel)
        if not os.path.exists(source):
            report["images_missing"].append(src)
            return ""
        size = os.path.getsize(source)
        if size > HEAVY_IMAGE_BYTES:
            # 25 LangSmith screencasts account for 224 MB — more than everything
            # else combined. Ship a first-frame poster instead and let the
            # viewer fetch the animation from docs.langchain.com on click.
            assets_used.add(rel + POSTER_SUFFIX)
            return '![%s](%s "heavy:%.1f:%s")' % (
                alt, "/langchain/images/" + rel + POSTER_SUFFIX,
                size / 1e6, SOURCE_URL.rstrip("/") + "/" + rel)
        assets_used.add(rel)
        return "![%s](%s)" % (alt, "/langchain/images/" + rel)

    return re.sub(r"!\[([^\]]*)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)", sub, body)


# ── step 6: tidy ────────────────────────────────────────────────────────────

def tidy(body):
    # Placeholders like <YOUR_API_KEY> outside code would be eaten as HTML.
    lines = body.split("\n")
    inside = fence_map(lines)
    for i, line in enumerate(lines):
        if not inside[i]:
            lines[i] = re.sub(r"<([A-Z][A-Z0-9_]{2,})>", r"`<\1>`", line)
    body = "\n".join(lines)
    body = re.sub(r"\n{4,}", "\n\n\n", body)
    return body.strip() + "\n"


# ── navigation ──────────────────────────────────────────────────────────────

def find_archive(slug):
    for candidate in (slug, re.sub(r"^oss/(python|javascript|js)/", "oss/", slug)):
        path = os.path.join(SRC, candidate + ".md")
        if os.path.exists(path):
            return candidate, path
    return None, None


def build_nav(docs):
    """Walk docs.json into per-product tab trees, skipping every JS branch."""
    products = {pid: {"id": pid, **meta, "tabs": []} for pid, meta in PRODUCTS.items()}
    seen = set()

    def page_node(slug, tag=None):
        if slug.startswith("oss/javascript/") or slug in seen:
            return None
        archive, path = find_archive(slug)
        if not archive:
            report["missing_slugs"].append(slug)
            return None
        seen.add(slug)
        return {"kind": "page", "slug": slug, "archive": archive, "path": path, "tag": tag}

    def walk(items, tag=None):
        out = []
        for item in items or []:
            if isinstance(item, str):
                node = page_node(item, tag)
                if node:
                    out.append(node)
            elif isinstance(item, dict):
                group = {
                    "kind": "group",
                    "label": item.get("group", ""),
                    "tag": item.get("tag"),
                    "expanded": bool(item.get("expanded")),
                    "items": [],
                }
                if item.get("root"):
                    node = page_node(item["root"], item.get("tag"))
                    if node:
                        group["items"].append(node)
                group["items"].extend(walk(item.get("pages"), item.get("tag")))
                if group["items"]:
                    out.append(group)
        return out

    def add_tab(product_id, label, items, section=""):
        """Tabs keep the lifecycle stage they came from as a section header.

        LangSmith alone contributes 26 tabs across five menus; flattening them
        into one list makes the rail unreadable.
        """
        if not items:
            return
        bucket = products[product_id]["tabs"]
        for tab in bucket:
            if tab["tab"] == label and tab["section"] == section:
                tab["items"].extend(items)
                return
        bucket.append({"section": section, "tab": label, "items": items})

    for product in docs["navigation"]["products"]:
        for menu in product.get("menu", []):
            name = menu.get("item")
            if name == "Home":
                continue

            for dropdown in menu.get("dropdowns", []) or []:
                if dropdown.get("dropdown") != "Python":
                    continue
                for tab in dropdown.get("tabs", []) or []:
                    label = tab.get("tab")
                    pid = TAB_PRODUCT.get((name, label)) or MENU_PRODUCT.get(name)
                    if pid:
                        add_tab(pid, label, walk(tab.get("pages")))

            for tab in menu.get("tabs", []) or []:
                label = tab.get("tab")
                pid = TAB_PRODUCT.get((name, label)) or MENU_PRODUCT.get(name)
                if pid:
                    add_tab(pid, label, walk(tab.get("pages")), section=name)

            if menu.get("pages"):
                pid = MENU_PRODUCT.get(name)
                if pid:
                    add_tab(pid, name, walk(menu.get("pages")), section="Platform")

    sweep_integrations(products, seen)
    return products


# docs.json lists only the per-component index pages, so the ~340 individual
# provider pages under oss/python/integrations/ are unreachable from the nav
# even though the prose links to them constantly. Sweep them into a catalog tab.
COMPONENT_LABELS = {
    "chat": "Chat models", "llms": "LLMs", "embeddings": "Embeddings",
    "vectorstores": "Vector stores", "retrievers": "Retrievers",
    "document_loaders": "Document loaders", "document_transformers": "Document transformers",
    "tools": "Tools", "providers": "Providers", "middleware": "Middleware",
    "sandboxes": "Sandboxes", "stores": "Stores", "graphs": "Graphs",
    "splitters": "Splitters", "caches": "Caches", "callbacks": "Callbacks",
    "checkpointers": "Checkpointers", "chains": "Chains",
    "chat_message_histories": "Chat message histories",
    "long-term-memory": "Long-term memory",
}


def sweep_integrations(products, claimed):
    base = os.path.join(SRC, "oss", "python", "integrations")
    if not os.path.isdir(base):
        return
    groups = {}
    for component in sorted(os.listdir(base)):
        folder = os.path.join(base, component)
        if not os.path.isdir(folder):
            continue
        items = []
        for fname in sorted(os.listdir(folder)):
            if not fname.endswith(".md") or fname == "TEMPLATE.md":
                continue
            slug = "oss/python/integrations/%s/%s" % (component, fname[:-3])
            if slug in claimed:
                continue
            claimed.add(slug)
            items.append({"kind": "page", "slug": slug, "archive": slug,
                          "path": os.path.join(folder, fname), "tag": None})
        if items:
            groups[component] = {
                "kind": "group",
                "label": COMPONENT_LABELS.get(component, component.replace("_", " ").title()),
                "tag": None, "expanded": False, "items": items,
            }
    if groups:
        products["langchain"]["tabs"].append({
            "section": "", "tab": "Integrations catalog",
            "items": [groups[k] for k in sorted(groups)],
        })


def iter_pages(node):
    for item in node:
        if item["kind"] == "page":
            yield item
        else:
            yield from iter_pages(item["items"])


# ── the samples and repo product ────────────────────────────────────────────
#
# `src/code-samples/<product>/**` holds the runnable programs the docs embed.
# Each one carries `# :snippet-start: <name>` markers, the docs pages import
# `/snippets/code-samples/<name>.mdx`, and those two facts together give every
# sample a backlink to the pages it appears on. The docs only ever show the
# marked region; this product ships the whole file, which is the part a reader
# actually needs to run it.

SAMPLE_LANGS = {".py": "python", ".sh": "bash", ".yaml": "yaml", ".yml": "yaml"}

# Files that are test scaffolding or package metadata rather than samples.
SAMPLE_SKIP = {"conftest.py", "package.json", "package-lock.json", ".npmrc"}

# Directive lines the extraction pipeline reads and the reader should not see.
DIRECTIVE_LINE_RE = re.compile(
    r"^\s*(?:#|//)\s*(?::(?:snippet-start|snippet-end|remove-start|remove-end|"
    r"replace-start|replace-end|codegroup-tab|codegroup-fence-mods):|KEEP MODEL\s*$)")

SNIPPET_START_RE = re.compile(r":snippet-start:\s*(\S+)")
SNIPPET_IMPORT_RE = re.compile(r"/snippets/code-samples/([A-Za-z0-9_./-]+)\.mdx")

# The repo's own guides, in reading order. CLAUDE.md is byte-identical to
# AGENTS.md and pull_request_template.md is a form, so neither is listed.
REPO_DOCS = [
    ("README.md", "Read me", "How the docs site is built, run, and contributed to."),
    ("AGENTS.md", "Writing guide", "The house style every docs page is held to."),
    ("IDE_SETUP.md", "IDE setup", "Editor configuration for working on the docs."),
    (".github/CONTRIBUTING.md", "Contributing", "How to open a pull request against the docs."),
    (".github/brand-guidelines.md", "Brand guidelines", "Naming and capitalization rules for the LangChain products."),
    (".github/copilot-instructions.md", "Copilot instructions", "The repo's instructions for AI assistants."),
    ("idea.md", "Proposal: langchain deploy", "A design proposal for TypeScript-native agent deployment."),
    ("docs/superpowers/specs/2026-07-08-threads-traces-migration-guide-design.md",
     "Spec: threads and traces migration", "Design notes for the threads/traces migration guide."),
]

SAMPLE_ACRONYMS = {
    "api": "API", "sql": "SQL", "rag": "RAG", "hitl": "HITL", "llm": "LLM",
    "openai": "OpenAI", "sdk": "SDK", "cli": "CLI", "ui": "UI", "js": "JS",
    "mcp": "MCP", "ttl": "TTL", "csv": "CSV", "url": "URL", "id": "ID",
    "v2": "v2", "v3": "v3", "db": "DB", "otel": "OTel", "ai": "AI",
    "langgraph": "LangGraph", "langchain": "LangChain", "langsmith": "LangSmith",
    "smithdb": "SmithDB", "acp": "ACP", "http": "HTTP", "json": "JSON",
    "oauth": "OAuth", "inmemory": "InMemory", "postgres": "Postgres",
}
SAMPLE_STOPWORDS = {"and", "with", "to", "in", "for", "the", "of", "as", "a", "an", "on", "or"}


def sample_title(stem):
    words = [word for word in re.split(r"[-_\s]+", stem) if word]
    out = []
    for index, word in enumerate(words):
        lowered = word.lower()
        if lowered in SAMPLE_ACRONYMS:
            out.append(SAMPLE_ACRONYMS[lowered])
        elif index and lowered in SAMPLE_STOPWORDS:
            out.append(lowered)
        else:
            out.append(word[:1].upper() + word[1:])
    return " ".join(out)


def snippet_usage(slug_by_archive):
    """snippet name -> the docs slugs whose page imports it.

    Only the Python build's pages count. A sample whose only consumers are
    JavaScript pages still ships; it simply has no backlinks to offer.
    """
    uses = {}
    src_root = os.path.join(REPO, "src")
    for base, _dirs, files in os.walk(src_root):
        if os.path.join("src", "code-samples") in base or os.path.join("src", "snippets") in base:
            continue
        for fname in files:
            if not fname.endswith(".mdx"):
                continue
            rel = os.path.relpath(os.path.join(base, fname), src_root)[:-4]
            target = resolve_link(normalize_slug("/" + rel), slug_by_archive)
            if not target:
                continue
            for match in SNIPPET_IMPORT_RE.finditer(read_text(os.path.join(base, fname))):
                uses.setdefault(match.group(1), set()).add(target)
    return uses


def sample_body(path, ext, uses):
    """A sample page: where it is used, then the whole file."""
    raw = read_text(path)
    names = SNIPPET_START_RE.findall(raw)

    if ext == ".md":            # a SKILL.md or a repo guide — already prose
        body = strip_frontmatter(raw)[1]
    else:
        kept = [line for line in raw.split("\n") if not DIRECTIVE_LINE_RE.match(line)]
        code = "\n".join(kept).strip("\n")
        body = "```%s %s\n%s\n```\n" % (SAMPLE_LANGS[ext], os.path.basename(path), code)

    targets = sorted({slug for name in names for slug in uses.get(name, ())})
    if targets:
        links = ", ".join("[%s](lc:%s)" % (PAGE_TITLES.get(slug, slug), slug)
                          for slug in targets[:8])
        report["samples_linked"] += 1
        body = ("> [!NOTE] Where this runs in the docs\n>\n> %s\n\n%s" % (links, body))
    return body, names, targets


def build_samples(products, slug_by_archive):
    """Fill the Samples & Repo product; returns its pages, bodies included."""
    if not os.path.isdir(CODE_SAMPLES):
        report["samples_missing"] = CODE_SAMPLES
        return []

    uses = snippet_usage(slug_by_archive)
    pages, tabs = [], []

    def make_page(path, slug, title, tab_label, desc=""):
        ext = os.path.splitext(path)[1]
        body, names, targets = sample_body(path, ext, uses)
        rel = os.path.relpath(path, REPO).replace(os.sep, "/")
        page = {
            "kind": "page", "slug": slug, "archive": slug, "path": path, "tag": None,
            "body": body, "title": title, "navTitle": title,
            "desc": desc or first_sentence(strip_frontmatter(read_text(path))[1] if ext == ".md" else "")
                    or (docstring_line(path) if ext == ".py" else "")
                    or ("Used on %s." % PAGE_TITLES.get(targets[0], targets[0]) if targets else "")
                    or ("Defines the %s snippet." % names[0] if names else "")
                    or "From the docs repo's code samples: %s." % rel,
            "source": REPO_BLOB + rel,
            "tabLabel": tab_label,
        }
        pages.append(page)
        return page

    for product_id in ("langchain", "langgraph", "deepagents", "langsmith"):
        folder = os.path.join(CODE_SAMPLES, product_id)
        if not os.path.isdir(folder):
            continue
        flat, groups = [], OrderedDict()
        for base, dirs, files in os.walk(folder):
            dirs.sort()
            for fname in sorted(files):
                ext = os.path.splitext(fname)[1]
                if fname in SAMPLE_SKIP or (ext not in SAMPLE_LANGS and ext != ".md"):
                    continue
                path = os.path.join(base, fname)
                rel = os.path.relpath(path, folder).replace(os.sep, "/")
                slug = "samples/%s/%s" % (product_id, os.path.splitext(rel)[0])
                sub = os.path.dirname(rel)
                # A skill is a directory with a SKILL.md in it; the directory
                # name is what it is called, "SKILL" is not.
                stem = (os.path.basename(sub) if fname == "SKILL.md" and sub
                        else os.path.splitext(fname)[0])
                page = make_page(path, slug, sample_title(stem),
                                 PRODUCTS[product_id]["label"])
                entry = {"kind": "page", "slug": slug, "navTitle": page["title"], "tag": None}
                if sub:
                    groups.setdefault(sub, []).append(entry)
                else:
                    flat.append(entry)

        items = flat + [{"kind": "group", "label": sample_title(sub.replace("/", " ")),
                         "tag": None, "expanded": False, "items": entries}
                        for sub, entries in groups.items()]
        if items:
            tabs.append({"section": "Code samples", "tab": PRODUCTS[product_id]["label"],
                         "items": items})

    repo_items = []
    for rel, title, desc in REPO_DOCS:
        path = os.path.join(REPO, rel)
        if not os.path.exists(path):
            report["repo_docs_missing"].append(rel)
            continue
        slug = "repo/" + os.path.splitext(rel)[0].replace(os.sep, "/").lstrip(".")
        make_page(path, slug, title, "Repository", desc)
        repo_items.append({"kind": "page", "slug": slug, "navTitle": title, "tag": None})
    if repo_items:
        tabs.append({"section": "langchain-ai/docs", "tab": "Repository", "items": repo_items})

    products["langchain_samples"]["tabs"] = tabs
    report["samples"] = len(pages)
    return pages


def docstring_line(path):
    """First line of a module docstring, when the sample opens with one."""
    match = re.match(r'\A(?:#[^\n]*\n)*\s*(?:"""|\'\'\')\s*(.+)', read_text(path))
    return match.group(1).strip().rstrip('"\'').strip() if match else ""


def rewrite_repo_links(body, slug):
    """Repo guides link to sibling files and code; resolve those to GitHub.

    They are ordinary GitHub markdown, so an unqualified `src/oss/index.mdx`
    means a path in the checkout, not a page in this build.
    """
    def sub(match):
        label, href = match.group(1), match.group(2).strip()
        if not href or href.startswith(("http://", "https://", "mailto:", "#")):
            return match.group(0)
        base = REPO_BLOB + posixpath.dirname(slug[len("repo/"):]) + "/"
        joined = posixpath.normpath(posixpath.join(base, href.split("#")[0]))
        anchor = "#" + href.split("#", 1)[1] if "#" in href else ""
        return "[%s](%s%s)" % (label, joined.replace(":/", "://", 1), anchor)

    return re.sub(r"(?<!!)\[([^\]]*)\]\(([^)\s]*)\)", sub, body)


# ── main ────────────────────────────────────────────────────────────────────

def main():
    if not os.path.isdir(SRC):
        sys.exit("missing content export: %s" % SRC)
    if not os.path.exists(DOCS_JSON):
        sys.exit("missing navigation config: %s" % DOCS_JSON)

    docs = json.load(open(DOCS_JSON, encoding="utf-8"))
    snippets = load_snippets()
    products = build_nav(docs)

    all_pages = []
    for product in products.values():
        for tab in product["tabs"]:
            for page in iter_pages(tab["items"]):
                page["product"] = product["id"]
                page["tabLabel"] = tab["tab"]
                all_pages.append(page)

    if report["missing_slugs"]:
        sys.exit("unresolved slugs (%d): %s"
                 % (len(report["missing_slugs"]), report["missing_slugs"][:10]))

    # Cross-references are written against several spellings of the same page:
    # the nav slug (`oss/python/langchain/agents`), the archive path
    # (`oss/langchain/agents`), and either one with the language segment. Index
    # every variant so a link only falls through to docs.langchain.com when the
    # page genuinely is not in this build.
    slug_by_archive = {}
    for page in all_pages:
        for key in (page["archive"], page["slug"]):
            slug_by_archive.setdefault(key, page["slug"])
            slug_by_archive.setdefault(normalize_slug("/" + key), page["slug"])

    # Titles up front, so a redirect stub can name where it is sending you.
    global PAGE_TITLES
    PAGE_TITLES = {}
    for page in all_pages:
        meta = strip_frontmatter(read_text(page["path"]))[0]
        PAGE_TITLES[page["slug"]] = (meta.get("sidebarTitle") or meta.get("title")
                                     or page["slug"].split("/")[-1])

    for path in (OUT_MD, OUT_IMG):
        shutil.rmtree(path, ignore_errors=True)
        os.makedirs(path, exist_ok=True)

    assets_used = set()

    for page in all_pages:
        raw = read_text(page["path"])
        meta, body = strip_frontmatter(raw)

        body, spliceable = resolve_snippet_dumps(body, snippets)
        body = splice_snippet_refs(body, snippets, spliceable)
        body = apply_language_directives(body)
        record_unknown(body)
        body = convert_components(body)
        body = group_code_tabs(body)
        # Images first: their markdown is a superset of link markdown, so the
        # link pass would otherwise consume `![alt](/oss/images/x.png)`.
        body = rewrite_images(body, assets_used)
        body = rewrite_links(body, slug_by_archive, page["slug"])
        body = tidy(body)

        # 35 pages are redirect stubs: frontmatter carrying a `url:` and no body.
        # The viewer forwards to the target so the nav entry is never a dead end.
        if meta.get("url") and len(body.strip()) < 40:
            url = meta["url"]
            # Some stubs point at a full docs.langchain.com URL rather than a
            # path; those still resolve inside this build.
            internal = url.startswith(SOURCE_URL)
            target = (resolve_link(normalize_slug(url[len(SOURCE_URL) - 1:] if internal else url),
                                   slug_by_archive)
                      if internal or url.startswith("/") else None)
            if target and target != page["slug"]:
                page["redirect"] = target
                report["redirects"] += 1
                body = "This page has moved to [%s](lc:%s).\n" % (
                    PAGE_TITLES.get(target, target), target)
            elif url.startswith("http"):
                # Genuinely off-site (reference.langchain.com, academy, GitHub).
                page["external"] = url
                report["externals"] += 1
                body = "%s lives outside the documentation site.\n\n[Open %s ↗](%s)\n" % (
                    meta.get("title") or "This page", url.split("/")[2], url)

        title = meta.get("title") or meta.get("sidebarTitle") or page["slug"].split("/")[-1]
        page["title"] = title
        page["navTitle"] = meta.get("sidebarTitle") or title
        page["desc"] = meta.get("description") or first_sentence(body)
        page["file"] = "/langchain/md/%s.md" % page["slug"]
        page["source"] = SOURCE_URL + page["slug"]

        dest = os.path.join(OUT_MD, page["slug"] + ".md")
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "w", encoding="utf-8") as handle:
            handle.write(body)
        report["bytes_md"] += len(body.encode("utf-8"))
        report["pages"] += 1

    # The Samples & Repo product is built last: its backlink notes and titles
    # need PAGE_TITLES and slug_by_archive complete, and its bodies are whole
    # files rather than exported MDX, so they skip the pipeline above.
    for page in build_samples(products, slug_by_archive):
        body = page.pop("body")
        if page["slug"].startswith("repo/"):
            body = rewrite_repo_links(body, page["slug"])
        body = tidy(body)
        page["product"] = "langchain_samples"
        page["file"] = "/langchain/md/%s.md" % page["slug"]
        all_pages.append(page)

        dest = os.path.join(OUT_MD, page["slug"] + ".md")
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "w", encoding="utf-8") as handle:
            handle.write(body)
        report["bytes_md"] += len(body.encode("utf-8"))
        report["pages"] += 1

    # Product icons are chrome, not page content, so nothing in the markdown
    # references them and the sweep above would never pick them up.
    for meta in PRODUCTS.values():
        assets_used.add("images/brand/" + meta["icon"])

    copy_assets(assets_used)
    missing_icons = [meta["icon"] for meta in PRODUCTS.values()
                     if not os.path.exists(os.path.join(OUT_IMG, "images", "brand", meta["icon"]))]
    if missing_icons:
        sys.exit("product icons missing from the export: %s" % missing_icons)

    write_data(products, all_pages)

    os.makedirs(os.path.dirname(OUT_REPORT), exist_ok=True)
    counts = {}
    for link in report["unresolved_links"]:
        href = link["href"].split("#")[0]
        counts[href] = counts.get(href, 0) + 1
    trimmed = dict(report)
    trimmed["unresolved_links"] = sorted(
        ({"href": h, "count": n} for h, n in counts.items()),
        key=lambda item: -item["count"])
    trimmed["unresolved_link_count"] = len(report["unresolved_links"])
    trimmed["unresolved_link_targets"] = len(counts)
    trimmed["images_missing"] = sorted(set(report["images_missing"]))
    with open(OUT_REPORT, "w", encoding="utf-8") as handle:
        json.dump(trimmed, handle, indent=1)

    print("pages           %d" % report["pages"])
    print("markdown        %.1f MB" % (report["bytes_md"] / 1e6))
    print("images          %d copied (%.1f MB), %d heavy, %d missing"
          % (report["images_copied"], report["bytes_img"] / 1e6,
             len(report["images_heavy"]), len(set(report["images_missing"]))))
    print("snippets        %d spliced, %d kept in place"
          % (report["snippets_spliced"], report["snippets_inplace"]))
    print("samples         %d shipped, %d with docs backlinks" % (report["samples"], report["samples_linked"]))
    print("redirects       %d forwarded, %d link out" % (report["redirects"], report["externals"]))
    print("links           %d unresolved" % len(report["unresolved_links"]))
    if report["unknown_components"]:
        top = sorted(report["unknown_components"].items(), key=lambda kv: -kv[1])[:8]
        print("unknown tags    %s" % ", ".join("%s×%d" % (k, v) for k, v in top))
    else:
        print("unknown tags    none")


def first_sentence(body):
    for line in body.split("\n"):
        line = line.strip()
        if not line or line.startswith(("#", ">", "!", "|", "```", "-", "*")):
            continue
        text = re.sub(r"[*`\[\]]|\(lc:[^)]*\)", "", line)
        return (text[:180] + "…") if len(text) > 180 else text
    return ""


def write_poster(source, dest):
    """First frame of a screencast GIF, as a still PNG.

    Turns ~9 MB of animation into ~80 KB of poster. The viewer overlays a play
    control and swaps in the real animation from docs.langchain.com on click.
    """
    if Image is None:
        return False
    try:
        with Image.open(source) as img:
            img.seek(0)
            frame = img.convert("RGB")
            if frame.width > MAX_IMAGE_WIDTH:
                ratio = MAX_IMAGE_WIDTH / float(frame.width)
                frame = frame.resize((MAX_IMAGE_WIDTH, int(frame.height * ratio)),
                                     Image.LANCZOS)
            frame.save(dest, "PNG", optimize=True)
        return True
    except Exception:
        return False


def copy_assets(assets_used):
    for rel in sorted(assets_used):
        poster = rel.endswith(POSTER_SUFFIX)
        source = os.path.join(SRC, "assets", rel[:-len(POSTER_SUFFIX)] if poster else rel)
        dest = os.path.join(OUT_IMG, rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)

        if poster:
            report["images_heavy"].append(rel)
            if not write_poster(source, dest):
                continue
            report["images_copied"] += 1
            report["bytes_img"] += os.path.getsize(dest)
            continue

        size = os.path.getsize(source)
        ext = os.path.splitext(rel)[1].lower()
        if (Image is None or ext in (".svg", ".gif", ".mp4")
                or size <= IMAGE_PASSTHROUGH_BYTES):
            shutil.copy2(source, dest)
        else:
            try:
                with Image.open(source) as img:
                    if img.width > MAX_IMAGE_WIDTH:
                        ratio = MAX_IMAGE_WIDTH / float(img.width)
                        img = img.resize((MAX_IMAGE_WIDTH, int(img.height * ratio)),
                                         Image.LANCZOS)
                    if img.mode in ("P", "LA"):
                        img = img.convert("RGBA")
                    img.save(dest, optimize=True)
            except Exception:
                shutil.copy2(source, dest)

        report["images_copied"] += 1
        report["bytes_img"] += os.path.getsize(dest)


def write_data(products, all_pages):
    def clean(node):
        out = []
        for item in node:
            if item["kind"] == "page":
                entry = {"slug": item["slug"], "title": item["navTitle"]}
                if item.get("tag"):
                    entry["tag"] = item["tag"]
                out.append(entry)
            else:
                kids = clean(item["items"])
                if kids:
                    out.append({"group": item["label"], "expanded": item["expanded"],
                                "items": kids, **({"tag": item["tag"]} if item.get("tag") else {})})
        return out

    tree = []
    for product in products.values():
        tree.append({
            "id": product["id"], "label": product["label"], "blurb": product["blurb"],
            "icon": "/langchain/images/images/brand/" + product["icon"],
            "accent": product["accent"],
            "tabs": [{"section": t.get("section", ""), "tab": t["tab"],
                      "items": clean(t["items"])} for t in product["tabs"]],
        })

    index = [{
        "slug": p["slug"], "title": p["title"], "desc": p["desc"], "file": p["file"],
        "product": p["product"], "tab": p["tabLabel"], "source": p["source"],
        **({"redirect": p["redirect"]} if p.get("redirect") else {}),
        **({"external": p["external"]} if p.get("external") else {}),
    } for p in all_pages]

    with open(OUT_DATA, "w", encoding="utf-8") as handle:
        handle.write(
            "// Auto-generated index of the LangChain Python documentation.\n"
            "//\n"
            "// Source: %s (Python only — the JS navigation is dropped at build time).\n"
            "// %d pages. Bodies live under public/langchain/md/ and are fetched on\n"
            "// demand by LangChainDocs; diagrams live under public/langchain/images/.\n"
            "//\n"
            "// Regenerate with `npm run build:langchain` rather than hand-editing.\n\n"
            "export const LANGCHAIN_SOURCE_URL = %s;\n\n"
            "export const LANGCHAIN_TOTAL_PAGES = %d;\n\n"
            "export const LANGCHAIN_PRODUCTS = %s;\n\n"
            "export const LANGCHAIN_ALL_PAGES = %s;\n"
            % (SOURCE_URL, len(index), json.dumps(SOURCE_URL), len(index),
               json.dumps(tree, indent=1), json.dumps(index, indent=1))
        )


if __name__ == "__main__":
    main()
