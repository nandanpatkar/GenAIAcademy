#!/usr/bin/env python3
"""Build the DSA practice set from the local takeUforward scrape in tuf/.

Reads (nothing is fetched from the network):
  tuf/site/practice/dsa/<slug>.html        problem pages (statement, examples,
                                            "Now Your Turn" quiz, hints, doubts,
                                            follow-ups, fun facts, starter code)
  tuf/site/practice/dsa/data/<slug>.json   peer solutions, tutorial pointer
  tuf/site/blogs/data-structure-and-algorithm/<slug>.html
                                            editorial with reference solutions
  tuf/*.html, tuf/site/prep-hub/*.html      sheets (A2Z, SDE, and any other
                                            saved sheet page)
  src/data/codelab/catalog.json            the Code Lab problems (322)

Writes:
  src/data/practice/index.json             one row per practice problem
  src/data/practice/sheets.json            sheet structure (steps/sections)
  public/practice/problems/<id>.json       per-problem detail, fetched on open
  api/_data/tufManifests.json              judge manifests for tuf problems

Problems that exist in both sources are merged under the Code Lab slug (so
existing progress, notes and the Code Lab judge keep working) and gain the tuf
extras. tuf-only problems keep their tuf slug.

Expected outputs are not in the scrape, so each problem's reference Python
solution (the last Python tab of its editorial) is run locally with the sample
inputs, via scripts/tuf_reference_runner.py in a subprocess with a timeout.
Those runs also answer the "Now Your Turn" quiz. A problem whose reference
cannot be run is still listed, just without the judge.

    python3 scripts/build_tuf_practice.py
"""
import concurrent.futures
import html
import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TUF = ROOT / "tuf"
PRACTICE_DIR = TUF / "site" / "practice" / "dsa"
BLOG_DIR = TUF / "site" / "blogs" / "data-structure-and-algorithm"
OUT_INDEX = ROOT / "src" / "data" / "practice" / "index.json"
OUT_SHEETS = ROOT / "src" / "data" / "practice" / "sheets.json"
OUT_DETAIL = ROOT / "public" / "practice" / "problems"
OUT_MANIFESTS = ROOT / "api" / "_data" / "tufManifests.json"
RUNNER = ROOT / "scripts" / "tuf_reference_runner.py"
ALIASES = json.loads((ROOT / "scripts" / "data" / "tuf_codelab_aliases.json").read_text())["aliases"]

# tuf sheet rows whose LeetCode link points at a different problem (a practice
# link for the pattern, not the same question).
LOOSE_LC_LINKS = {
    "detect-a-cycle-in-an-undirected-graph",
    "detect-a-cycle-in-a-directed-graph",
    "minimum-number-of-platforms-required-for-a-railway",
    "left-rotate-array-by-one",
    "minimum-number-of-bracket-reversals-to-make-an-expression-balanced",
    "flattening-of-ll",
    "morris-preorder-traversal-",
    "morris-inorder-traversal-",
}

# Sheets shown in Prep Hub, in the reference site's groups. Lists that are not
# in the local scrape stay listed with `available: False` until their page is
# saved under tuf/site/prep-hub/<slug>.html and this script is re-run.
SHEETS = [
    ("strivers-a2z-dsa-sheet", "Learn From Zero", "Striver’s A2Z DSA Sheet",
     "Learn DSA from the basics to advanced problem solving with Striver's roadmap for coding interviews."),
    ("strivers-180-master-dsa-patterns", "Interview Prep - India", "Striver's 180 – Master DSA Patterns",
     "Recognize DSA patterns and apply them to unfamiliar problems in coding interviews."),
    ("strivers-75-sheet", "Interview Prep - India", "Striver’s 75 – India’s Blind 75 Alternative",
     "Revise core DSA patterns with a focused set of problems for coding interviews and placements."),
    ("strivers-sde-sheet", "Interview Prep - India", "Striver’s SDE Sheet",
     "The classic top coding interview problems, grouped by topic across arrays, linked lists, trees, graphs and DP."),
    ("strivers-150-master-patterns-in-dsa", "Interview Prep - US/Europe/Others", "Strivers 150 – Master Patterns in DSA",
     "Learn to recognise DSA patterns and apply them across 150 questions for coding interview preparation."),
    ("blind-75", "Interview Prep - US/Europe/Others", "Blind 75 Sheet",
     "Prepare for coding interviews with focused DSA practice across arrays, strings, trees, graphs, and more."),
]

DSA_SHEET_SLUGS = {slug for slug, *_ in SHEETS}

# The public Blind 75 list (LeetCode problem slugs), used when no saved sheet
# page exists for it.
BLIND_75 = [
    ("Array", ["two-sum", "best-time-to-buy-and-sell-stock", "contains-duplicate", "product-of-array-except-self", "maximum-subarray",
               "maximum-product-subarray", "find-minimum-in-rotated-sorted-array", "search-in-rotated-sorted-array", "3sum", "container-with-most-water"]),
    ("Binary", ["sum-of-two-integers", "number-of-1-bits", "counting-bits", "missing-number", "reverse-bits"]),
    ("Dynamic Programming", ["climbing-stairs", "coin-change", "longest-increasing-subsequence", "longest-common-subsequence", "word-break",
                             "combination-sum-iv", "house-robber", "house-robber-ii", "decode-ways", "unique-paths", "jump-game"]),
    ("Graph", ["clone-graph", "course-schedule", "pacific-atlantic-water-flow", "number-of-islands", "longest-consecutive-sequence",
               "alien-dictionary", "graph-valid-tree", "number-of-connected-components-in-an-undirected-graph"]),
    ("Interval", ["insert-interval", "merge-intervals", "non-overlapping-intervals", "meeting-rooms", "meeting-rooms-ii"]),
    ("Linked List", ["reverse-linked-list", "linked-list-cycle", "merge-two-sorted-lists", "merge-k-sorted-lists",
                     "remove-nth-node-from-end-of-list", "reorder-list"]),
    ("Matrix", ["set-matrix-zeroes", "spiral-matrix", "rotate-image", "word-search"]),
    ("String", ["longest-substring-without-repeating-characters", "longest-repeating-character-replacement", "minimum-window-substring",
                "valid-anagram", "group-anagrams", "valid-parentheses", "valid-palindrome", "longest-palindromic-substring",
                "palindromic-substrings", "encode-and-decode-strings"]),
    ("Tree", ["maximum-depth-of-binary-tree", "same-tree", "invert-binary-tree", "binary-tree-maximum-path-sum",
              "binary-tree-level-order-traversal", "serialize-and-deserialize-binary-tree", "subtree-of-another-tree",
              "construct-binary-tree-from-preorder-and-inorder-traversal", "validate-binary-search-tree",
              "kth-smallest-element-in-a-bst", "lowest-common-ancestor-of-a-binary-search-tree", "implement-trie-prefix-tree",
              "design-add-and-search-words-data-structure", "word-search-ii"]),
    ("Heap", ["top-k-frequent-elements", "find-median-from-data-stream"]),
]

# Code Lab categories expressed in tuf's topic vocabulary.
CODELAB_TOPIC = {
    "Array": "Arrays", "Strings": "Strings", "Binary Search": "Binary Search", "Stack": "Stack / Queues",
    "Linked List": "Linked List", "Double Linked List": "Linked List", "HashMap": "Hashing", "Heap": "Heaps",
    "Recursion": "Recursion", "Tree": "Binary Trees", "Binary Search Tree": "Binary Search Trees", "Graph": "Graphs",
    "Backtracking": "Backtracking", "Greedy": "Greedy Algorithms", "Dynamic Programming": "Dynamic Programming",
    "Trie": "Tries", "Bit Manipulation": "Bit Manipulation",
}
LEVEL_OF_CODELAB = {"Easy": "Basic", "Medium": "Core", "Hard": "Pro"}

# One spelling per topic across sheet tags, sheet step titles and Code Lab.
TOPIC_ALIASES = {
    "Stack & Queues": "Stack / Queues", "Stack and Queue": "Stack / Queues", "Linked-List": "Linked List",
    "Strings (Basic and Medium)": "Strings", "Strings (Advanced Algo)": "Strings", "String": "Strings",
    "Maths": "Mathematics", "Beginner Problems": "Basics", "Recursion & Backtracking": "Backtracking",
    "Recursion and Backtracking": "Backtracking", "Greedy Algorithm": "Greedy Algorithms", "Heaps": "Heaps",
    "Tries": "Tries", "Trie": "Tries", "Graph": "Graphs", "Binary Tree": "Binary Trees", "Binary Search Tree": "Binary Search Trees",
    "Dynamic Programming": "Dynamic Programming", "Sliding Window / 2 Pointer": "Sliding Window / Two Pointers",
}


KEYWORD_TOPICS = [
    (r"\bll\b|linked ?list", "Linked List"), (r"\bbst\b", "Binary Search Trees"), (r"tree|\bbt\b|traversal", "Binary Trees"),
    (r"graph|island|bellman|dijkstra|kosaraju|component", "Graphs"), (r"dp\b|dp-|knapsack|subset sum|rod cutting", "Dynamic Programming"),
    (r"recursion", "Recursion"), (r"sorted array|pages|binary search", "Binary Search"), (r"stream|heap|kth largest", "Heaps"),
    (r"substring|anagram|string|prefix", "Strings"), (r"prime", "Mathematics"), (r"cookies|greedy", "Greedy Algorithms"),
]


def guess_topic(title):
    lowered = title.lower()
    return next((topic for pattern, topic in KEYWORD_TOPICS if re.search(pattern, lowered)), "Arrays")


def topic_name(name):
    name = re.sub(r"(\s+[Pp]art-?\s*[IVX]+|\s*\[.*\])$", "", (name or "").strip())
    return TOPIC_ALIASES.get(name, name)


# ── Next.js payload helpers ──────────────────────────────────────────────────
PUSH = re.compile(r'self\.__next_f\.push\(\[1,"(.*?)"\]\)</script>', re.S)
DECODER = json.JSONDecoder()


def next_payload(path):
    text = path.read_text(errors="ignore")
    return "".join(json.loads('"' + chunk + '"') for chunk in PUSH.findall(text))


def text_chunk(payload, ref):
    """Resolve a `$5d` reference to its `5d:T<hex length>,` text block."""
    match = re.search(r"(?:^|[\n}\]])" + re.escape(ref) + r":T([0-9a-f]+),", payload)
    # A text block can follow the previous one directly, with no separator.
    match = match or re.search(r"(?<![0-9a-f])" + re.escape(ref) + r":T([0-9a-f]+),", payload)
    if not match:
        return None
    raw = payload[match.end():].encode("utf-8")[: int(match.group(1), 16)]
    return raw.decode("utf-8", "ignore")


# ── HTML → Markdown (the statement is rendered as Markdown, never raw HTML) ──
class MarkdownWriter(HTMLParser):
    BLOCK = {"p", "div", "section", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.lists, self.in_pre, self.row, self.rows, self.cell = [], [], False, None, None, None

    def emit(self, text):
        if self.cell is not None:
            self.cell.append(text)
        else:
            self.out.append(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in self.BLOCK:
            self.emit("\n\n" + ("**" if tag.startswith("h") else ""))
        elif tag == "br":
            self.emit("\n" if self.in_pre else "  \n")
        elif tag in ("strong", "b"):
            self.emit("**")
        elif tag in ("em", "i"):
            self.emit("*")
        elif tag == "code" and not self.in_pre:
            self.emit("`")
        elif tag == "pre":
            self.in_pre = True
            self.emit("\n\n```\n")
        elif tag in ("ul", "ol"):
            self.lists.append([tag, 0])
            self.emit("\n")
        elif tag == "li":
            depth = max(0, len(self.lists) - 1)
            kind = self.lists[-1] if self.lists else ["ul", 0]
            kind[1] += 1
            self.emit("\n" + "  " * depth + ("- " if kind[0] == "ul" else f"{kind[1]}. "))
        elif tag == "sup":
            self.emit("^")
        elif tag == "img" and attrs.get("src", "").startswith("http"):
            self.emit(f"\n\n![{attrs.get('alt', '')}]({attrs['src']})\n\n")
        elif tag == "table":
            self.rows = []
        elif tag == "tr" and self.rows is not None:
            self.row = []
        elif tag in ("td", "th") and self.row is not None:
            self.cell = []

    def handle_endtag(self, tag):
        if tag in self.BLOCK:
            self.emit(("**" if tag.startswith("h") else "") + "\n\n")
        elif tag in ("strong", "b"):
            self.emit("**")
        elif tag in ("em", "i"):
            self.emit("*")
        elif tag == "code" and not self.in_pre:
            self.emit("`")
        elif tag == "pre":
            self.in_pre = False
            self.emit("\n```\n\n")
        elif tag in ("ul", "ol") and self.lists:
            self.lists.pop()
            self.emit("\n\n")
        elif tag in ("td", "th") and self.cell is not None and self.row is not None:
            self.row.append(" ".join("".join(self.cell).split()).replace("|", "\\|"))
            self.cell = None
        elif tag == "tr" and self.row is not None and self.rows is not None:
            self.rows.append(self.row)
            self.row = None
        elif tag == "table" and self.rows is not None:
            rows, self.rows = self.rows, None
            if rows:
                width = max(len(row) for row in rows)
                rows = [row + [""] * (width - len(row)) for row in rows]
                lines = ["| " + " | ".join(rows[0]) + " |", "|" + "---|" * width] + ["| " + " | ".join(row) + " |" for row in rows[1:]]
                self.emit("\n\n" + "\n".join(lines) + "\n\n")

    def handle_data(self, data):
        if self.in_pre:
            self.emit(data)
        else:
            self.emit(re.sub(r"\s+", " ", data))


def to_markdown(fragment):
    if not fragment:
        return ""
    writer = MarkdownWriter()
    writer.feed(fragment)
    text = "".join(writer.out)
    text = re.sub(r"\*\*\s*\*\*", "", text)          # empty bold from <p><strong></strong></p>
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"(^|\n)(-|\d+\.)[ \t]*\n+", r"\1\2 ", text)  # <li><p>…</p></li> → "- …"
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def to_text_lines(fragment):
    """Plain text lines of an example block (bold labels dropped)."""
    md = to_markdown(fragment).replace("**", "").replace("`", "")
    return [line.strip() for line in md.splitlines() if line.strip()]


# ── Value parsing (tuf writes inputs loosely: "3 9 20 null", "[7 ,4]") ──────
def parse_value(text, prefer_string=False):
    raw = html.unescape(str(text)).strip()
    if prefer_string:
        try:
            value = json.loads(raw)
            if isinstance(value, str):
                return value
        except Exception:
            pass
        if len(raw) >= 2 and raw[0] == raw[-1] and raw[0] in "'\"":
            return raw[1:-1]
        return raw
    for candidate in (raw, raw.replace("'", '"')):
        try:
            return json.loads(candidate)
        except Exception:
            pass
    python_like = re.sub(r"\bnull\b", "None", re.sub(r"\btrue\b", "True", re.sub(r"\bfalse\b", "False", raw)))
    try:
        import ast
        return ast.literal_eval(python_like)
    except Exception:
        pass
    tokens = raw.split()
    if len(tokens) > 1:  # space-separated level order / array
        values = []
        for token in tokens:
            token = token.strip(",")
            if token == "null":
                values.append(None)
                continue
            try:
                values.append(json.loads(token))
            except Exception:
                values.append(token)
        return values
    return raw


def split_assignments(text):
    """'nums = [1, 2], target = 3' → [('nums', '[1, 2]'), ('target', '3')]."""
    # Split on top-level commas that start a new `name =`.
    parts, pieces, depth, quote, start = [], [], 0, None, 0
    for index, char in enumerate(text):
        if quote:
            if char == quote:
                quote = None
            continue
        if char in "'\"":
            quote = char
        elif char in "[({":
            depth += 1
        elif char in "])}":
            depth -= 1
        elif char == "," and depth == 0 and re.match(r"\s*[A-Za-z_]\w*\s*=(?!=)", text[index + 1:]):
            pieces.append(text[start:index])
            start = index + 1
    pieces.append(text[start:])
    for piece in pieces:
        if "=" in piece:
            name, value = piece.split("=", 1)
            parts.append((name.strip(), value.strip()))
    return parts


# ── Starter code ─────────────────────────────────────────────────────────────
METHOD = re.compile(r"class Solution[^\n]*:\s*\n(?:\s*#[^\n]*\n|\s*\n)*\s*def (\w+)\(self\s*(?:,([^)]*))?\)")


def starter_signature(code):
    match = METHOD.search(code or "")
    if not match:
        return None, []
    params = []
    for part in (match.group(2) or "").split(","):
        name = part.split(":")[0].split("=")[0].strip()
        if name:
            params.append(name)
    return match.group(1), params


def serializers_for(code, params, sample_values):
    kinds = {}
    uses_list = "ListNode" in (code or "")
    uses_tree = "TreeNode" in (code or "")
    for name in params:
        value = sample_values.get(name)
        lowered = name.lower()
        if uses_list and isinstance(value, list) and re.search(r"head|list|^l\d$|^ll", lowered):
            kinds[name] = "linked-list"
        elif uses_tree and isinstance(value, list) and re.search(r"root|tree", lowered):
            kinds[name] = "binary-tree"
    return kinds


# ── Sheets ───────────────────────────────────────────────────────────────────
def read_sheet(path):
    payload = next_payload(path)
    at = payload.find('"sheet_syllabus":')
    if at < 0:
        return None
    syllabus, _ = DECODER.raw_decode(payload[at + len('"sheet_syllabus":'):])
    rows, fields = syllabus["rows"], syllabus["fields"]

    def resolve(value):
        if isinstance(value, str):
            match = re.match(r"\$[0-9a-f]+:sheet:sheet_syllabus:rows:(\d+):(\d+)$", value)
            if match:
                return resolve(rows[int(match.group(1))][int(match.group(2))])
        return value

    def record(index):
        row = rows[index]
        return {name: resolve(value) for name, value in zip(fields[row[0]], row[1:])}

    def build(index):
        node = record(index)
        if node.get("type") == "category":
            return {"title": node["label"].strip(), "children": [build(child) for child in node.get("children") or []]}
        return {
            "slug": node.get("slug"),
            "title": node.get("label", "").strip(),
            "kind": node.get("layoutType"),
            "difficulty": node.get("difficulty"),
            "minutes": int(re.match(r"(\d+)", node["duration"]).group(1)) if re.match(r"(\d+)", str(node.get("duration") or "")) else None,
            "video": node.get("yt_video") or None,
            "blog": (re.search(r"/blogs/data-structure-and-algorithm/([a-z0-9-]+)", str(node.get("free_blog_link") or "")) or [None, None])[1],
            "lc": (re.search(r"leetcode\.com/problems/([a-z0-9-]+)", str(node.get("leetcode_link") or "")) or [None, None])[1],
            "topics": [tag["name"] for tag in node.get("topic_tags") or [] if isinstance(tag, dict)],
            "patterns": [tag["name"] for tag in node.get("pattern_tags") or [] if isinstance(tag, dict)],
        }

    return [build(index) for index in syllabus["roots"]]


def slug_key(slug):
    """Sheet pages sometimes spell a problem slug with punctuation the problem
    page drops ("kadane's-algorithm" → kadanes-algorithm); compare letters/digits."""
    return re.sub(r"[^a-z0-9]", "", (slug or "").lower())


def sheet_items(tree, step=None):
    for node in tree:
        if "children" in node:
            yield from sheet_items(node["children"], step or node["title"])
        else:
            yield {**node, "step": step}


# ── Problem pages ────────────────────────────────────────────────────────────
def read_problem(path):
    payload = next_payload(path)
    at = payload.find('"examples":')
    if at < 0:
        return None
    start = payload.rfind('{"id":"', 0, at)
    problem, _ = DECODER.raw_decode(payload[start:])
    code_at = payload.find('"initialCodeData":')
    code_data = DECODER.raw_decode(payload[code_at + len('"initialCodeData":'):])[0] if code_at >= 0 else {}
    return problem, code_data


def resolve_text(payload, value):
    """A payload string that may be a `$5d` reference to a text block."""
    if isinstance(value, str) and re.fullmatch(r"\$[0-9a-f]+", value):
        return text_chunk(payload, value[1:]) or ""
    return value if isinstance(value, str) else ""


APPROACH_HEADING = re.compile(r"approach|brute|better|optimal|naive", re.I)


def editorial_approaches(payload):
    """The editorial split at its `<h2>` headings (Brute / Better / Optimal …).

    Each approach keeps its explanation (Algorithm, Dry Run, Complexity…) as
    Markdown and the Python tab of the code editor placed inside it."""
    start = payload.find('"sections":[')
    if start < 0:
        return []
    try:
        sections, _ = json.JSONDecoder().raw_decode(payload[start + len('"sections":'):])
    except ValueError:
        return []
    html_parts, python_by_div = [], {}
    for section in sections if isinstance(sections, list) else []:
        if not isinstance(section, dict):
            continue
        html_parts.append(resolve_text(payload, section.get("section")))
        for editor in section.get("code_editor") or []:
            tabs = {tab.get("tab_title"): tab.get("tab_content") for tab in editor.get("data") or [] if isinstance(tab, dict)}
            if tabs.get("python"):
                python_by_div[editor.get("div-id")] = resolve_text(payload, tabs["python"])
    approaches = []
    for chunk in re.split(r"(?=<h2[^>]*>)", "".join(html_parts)):
        heading = re.match(r"<h2[^>]*>(.*?)</h2>", chunk, re.S)
        if not heading:
            continue
        name = html.unescape(re.sub(r"<[^>]+>", "", heading.group(1))).strip()
        if not APPROACH_HEADING.search(name):
            continue
        code = next((python_by_div[div] for div in re.findall(r'<div id="([^"]+)"></div>', chunk) if div in python_by_div), "")
        body = to_markdown(re.sub(r'<div id="[^"]+"></div>', "", chunk[heading.end():]))
        approaches.append({"name": name[:80], "body": body[:6000], "code": code})
    return approaches


def reference_solution(blog_path):
    """The last Python tab of the editorial (the optimal approach), and the
    editorial's approaches."""
    if not blog_path or not blog_path.exists():
        return None, []
    payload = next_payload(blog_path)
    tabs = [json.loads(raw) for raw in re.findall(r'"tab_title":"python","tab_content":("(?:[^"\\]|\\.)*")', payload)]
    last = tabs[-1] if tabs else None
    code = text_chunk(payload, last[1:]) if last and re.fullmatch(r"\$[0-9a-f]+", last) else last
    return code, editorial_approaches(payload)


def run_reference(job):
    try:
        done = subprocess.run([sys.executable, str(RUNNER)], input=json.dumps(job), capture_output=True, text=True, timeout=20)
        return json.loads(done.stdout.strip().splitlines()[-1])
    except Exception as error:
        return {"ok": False, "error": str(error)[:200]}


def main():
    codelab = json.loads((ROOT / "src" / "data" / "codelab" / "catalog.json").read_text())["problems"]
    codelab_by_lc = {}
    for problem in codelab:
        match = re.search(r"leetcode\.com/problems/([a-z0-9-]+)", problem.get("url") or "")
        if match:
            codelab_by_lc[match.group(1)] = problem
    codelab_by_title = {re.sub(r"[^a-z0-9]", "", problem["title"].lower()): problem for problem in codelab}

    # Sheets: every saved sheet page, keyed by the sheet slug.
    sheet_trees = {}
    for path in sorted(TUF.glob("*.html")) + sorted((TUF / "site" / "prep-hub").glob("*.html")):
        slug = path.stem
        if slug not in DSA_SHEET_SLUGS or slug in sheet_trees:
            continue
        tree = read_sheet(path)
        if tree:
            sheet_trees[slug] = tree
    sheet_rows = {}  # tuf slug → first sheet row seen (difficulty, topics, lc…)
    for sheet_slug, tree in sheet_trees.items():
        for item in sheet_items(tree):
            if item["kind"] == "practice" and item["slug"]:
                key = slug_key(item["slug"])
                sheet_rows.setdefault(key, item)
                sheet_rows[key].setdefault("sheets", [])
                if sheet_slug not in sheet_rows[key]["sheets"]:
                    sheet_rows[key]["sheets"].append(sheet_slug)

    # tuf problems.
    tuf = {}
    pages = [path for path in sorted(PRACTICE_DIR.glob("*.html")) if not path.stem.endswith("-interview-questions")]
    for path in pages:
        parsed = read_problem(path)
        if not parsed:
            continue
        problem, code_data = parsed
        data_path = PRACTICE_DIR / "data" / f"{path.stem}.json"
        data = json.loads(data_path.read_text()) if data_path.exists() else {}
        tuf[path.stem] = {"page": problem, "code": code_data, "data": data, "sheet": sheet_rows.get(slug_key(path.stem), {})}
    print(f"tuf problems: {len(tuf)}; sheets: {', '.join(sheet_trees)}")

    # Merge with Code Lab: LeetCode link first, then the hand-checked aliases.
    merged_codelab = {}
    tuf_to_codelab = {}
    for slug in sorted(tuf, key=lambda s: (s.endswith("-1"), s)):
        sheet = tuf[slug]["sheet"]
        title_key = re.sub(r"[^a-z0-9]", "", (tuf[slug]["page"].get("name") or "").lower())
        # Exact title first; then the sheet's LeetCode link (skipped when it
        # points a doubly-linked-list problem at a singly-linked one); then the
        # hand-checked aliases.
        target = codelab_by_title.get(title_key)
        if target is None and sheet.get("lc") and slug not in LOOSE_LC_LINKS:
            candidate = codelab_by_lc.get(sheet["lc"])
            is_dll = lambda text: bool(re.search(r"doubly|\bdll\b", (text or "").lower()))  # noqa: E731
            if candidate and is_dll(tuf[slug]["page"].get("name")) == is_dll(candidate["title"]):
                target = candidate
        if target is None and slug in ALIASES:
            target = codelab_by_title.get(re.sub(r"[^a-z0-9]", "", ALIASES[slug].lower()))
        if target is not None and target["slug"] not in merged_codelab:
            merged_codelab[target["slug"]] = slug
            tuf_to_codelab[slug] = target["slug"]
    codelab_slugs = {problem["slug"] for problem in codelab}

    # Reference runs, in parallel.
    jobs, prepared = {}, {}
    for slug, entry in tuf.items():
        page, code_data = entry["page"], entry["code"]
        starter = (code_data.get("starterCodeByLanguage") or {}).get("python") or (entry["data"].get("boilerplates") or {}).get("python") or ""
        method, params = starter_signature(starter)
        samples = code_data.get("initialSampleCases") or entry["data"].get("sample_testcases") or []
        string_params = set(re.findall(r"(\w+)\s*:\s*str\b", starter))
        cases = []
        for index, case in enumerate(samples):
            inputs = case.get("inputs") or []
            if method and len(inputs) == len(params):
                # Match inputs to parameters by name (tuf capitalises some
                # keys); fall back to position only when the names differ.
                by_key = {str(item.get("key", "")).lower(): item for item in inputs}
                ordered = [by_key.get(name.lower()) for name in params]
                if not all(ordered):
                    ordered = inputs
                values = {name: parse_value(item.get("value"), name in string_params) for name, item in zip(params, ordered)}
                cases.append({"id": f"case-{index + 1}", "input": values})
        # Statement examples become hidden cases (their outputs come from the reference too).
        examples, quiz = [], None
        for index, example in enumerate(page.get("examples") or []):
            lines = to_text_lines(example.get("content"))
            input_line = next((line for line in lines if line.lower().startswith("input")), "")
            values = None
            if method and input_line:
                assignments = split_assignments(input_line.split(":", 1)[1] if ":" in input_line else input_line)
                by_name = {name.lower(): value for name, value in assignments}
                if len(assignments) == len(params):
                    values = {}
                    for position, name in enumerate(params):
                        raw = by_name.get(name.lower(), assignments[position][1])
                        values[name] = parse_value(raw, name in string_params)
            if example.get("isGamification"):
                quiz = {
                    "prompt": "\n".join(line for line in lines),
                    "options": [str(option) for option in example.get("gamificationOptions") or []],
                    "input": values,
                }
            else:
                examples.append({"lines": lines, "input": values})
        extra_cases = [{"id": f"example-{i + 1}", "input": ex["input"]} for i, ex in enumerate(examples) if ex["input"]]
        if quiz and quiz["input"]:
            extra_cases.append({"id": "quiz", "input": quiz["input"]})
        blog_file = (entry["data"].get("tutorial_solution") or {}).get("blog_file")
        candidates = [(PRACTICE_DIR / blog_file).resolve()] if blog_file else []
        if entry["sheet"].get("blog"):
            candidates.append(BLOG_DIR / f"{entry['sheet']['blog']}.html")
        candidates.append(BLOG_DIR / f"{slug}.html")
        blog_path = next((candidate for candidate in candidates if candidate.exists()), None)
        reference, approaches = reference_solution(blog_path)
        sample_values = cases[0]["input"] if cases else {}
        serializers = serializers_for(starter, params, sample_values)
        prepared[slug] = {"starter": starter, "method": method, "params": params, "cases": cases, "examples": examples,
                          "quiz": quiz, "reference": reference, "approaches": approaches, "serializers": serializers}
        if reference and method and (cases or extra_cases):
            jobs[slug] = {"code": reference, "method": method, "parameters": params, "serializers": serializers,
                          "cases": cases + extra_cases}

    print(f"running {len(jobs)} reference solutions…")
    outcomes = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for slug, outcome in zip(jobs, pool.map(run_reference, jobs.values())):
            outcomes[slug] = outcome

    # Assemble rows, details and manifests.
    OUT_DETAIL.mkdir(parents=True, exist_ok=True)
    for stale in OUT_DETAIL.glob("*.json"):
        stale.unlink()
    rows, manifests = [], []
    stats = {"judge": 0, "runOnly": 0, "quizAnswered": 0, "quiz": 0, "facts": 0, "peers": 0, "merged": len(tuf_to_codelab)}

    def row_topics(sheet, fallback):
        topics = [topic_name(topic) for topic in sheet.get("topics", []) if "*" not in topic]
        if not topics and sheet.get("step"):
            topics = [topic_name(sheet["step"])]
        return list(dict.fromkeys(topics or fallback))

    for slug, entry in tuf.items():
        page, data, sheet, prep = entry["page"], entry["data"], entry["sheet"], prepared[slug]
        safe_slug = re.sub(r"[^a-z0-9-]", "", slug.lower())  # "kadane's-algorithm" → kadanes-algorithm
        problem_id = tuf_to_codelab.get(slug) or (safe_slug if safe_slug not in codelab_slugs else f"tuf-{safe_slug}")
        outcome = outcomes.get(slug) or {}
        results = {result["id"]: result for result in outcome.get("results", []) if result.get("ok")}
        statement_text = re.sub(r"<[^>]+>", " ", page.get("statement") or "").lower()

        # Expected outputs → comparator.
        judge, visible, hidden = {"comparator": "deep-equal"}, [], []
        mutation_param = None
        first = next((results.get(case["id"]) for case in prep["cases"] if results.get(case["id"])), None)
        if first and first.get("value") is None and first.get("mutated"):
            mutation_param = next(iter(first["mutated"]))
            judge = {"comparator": "mutation", "mutationParameter": mutation_param}
        elif "any order" in statement_text:
            judge = {"comparator": "unordered"}
        elif first and isinstance(first.get("value"), float):
            judge = {"comparator": "float"}

        def expected_of(case_id):
            result = results.get(case_id)
            if not result:
                return None, False
            if mutation_param:
                return result.get("mutated", {}).get(mutation_param, result.get("value")), True
            if result.get("value") is None:
                return None, False  # prints instead of returning, or returned nothing
            return result["value"], True

        for case in prep["cases"]:
            expected, ok = expected_of(case["id"])
            visible.append({"id": case["id"], "input": case["input"], **({"expected": expected} if ok else {})})
        for index, example in enumerate(prep["examples"]):
            expected, ok = expected_of(f"example-{index + 1}")
            if ok and example["input"]:
                hidden.append({"id": f"example-{index + 1}", "input": example["input"], "expected": expected})
        judgeable = bool(prep["method"]) and bool(visible) and all("expected" in case for case in visible)

        quiz = None
        if prep["quiz"]:
            stats["quiz"] += 1
            answer = None
            quiz_result = results.get("quiz")
            if quiz_result and prep["quiz"]["options"]:
                actual = quiz_result.get("mutated", {}).get(mutation_param) if mutation_param else quiz_result.get("value")
                if actual is not None:
                    def same(option):
                        parsed = parse_value(option)
                        if parsed == actual:
                            return True
                        try:
                            key = lambda item: json.dumps(item, sort_keys=True)  # noqa: E731
                            deep = lambda v: sorted((deep(i) for i in v), key=key) if isinstance(v, list) else v  # noqa: E731
                            return judge["comparator"] == "unordered" and deep(parsed) == deep(actual)
                        except Exception:
                            return False
                    matches = [index for index, option in enumerate(prep["quiz"]["options"]) if same(option)]
                    if len(matches) == 1:
                        answer = matches[0]
                        stats["quizAnswered"] += 1
            quiz = {"prompt": prep["quiz"]["prompt"], "options": prep["quiz"]["options"], "answer": answer}

        runnable = bool(prep["method"]) and bool(visible)
        if problem_id not in codelab_slugs and runnable:
            stats["judge"] += judgeable
            stats["runOnly"] += not judgeable
            manifests.append({
                "slug": problem_id, "title": page.get("name"),
                "entrypoint": {"kind": "solution-method", "className": "Solution", "methodName": prep["method"], "parameters": prep["params"]},
                "serializers": prep["serializers"], "judge": judge,
                "visibleTests": visible, "hiddenTests": hidden if judgeable else [],
                "judgeAvailable": judgeable, "runnable": True,
            })

        facts = [fact for fact in page.get("facts") or [] if isinstance(fact, str)]
        peers = [{
            "id": str(peer.get("id")), "title": peer.get("title"), "author": peer.get("author"), "username": peer.get("username"),
            "reactions": peer.get("reactions", 0), "comments": peer.get("comments", 0), "date": peer.get("date"), "content": peer.get("content") or "",
        } for peer in data.get("peer_solutions") or []]
        stats["facts"] += bool(facts)
        stats["peers"] += bool(peers)
        similar = [{"slug": item.get("slug"), "title": item.get("name")} for item in page.get("similarProblems") or [] if isinstance(item, dict)]

        example_md = []
        for index, example in enumerate(prep["examples"]):
            example_md.append(f"**Example {index + 1}:**\n\n```\n" + "\n".join(example["lines"]) + "\n```")
        detail = {
            "id": problem_id, "tufSlug": slug, "title": page.get("name"),
            "statement": (to_markdown(page.get("statement")) + "\n\n" + "\n\n".join(example_md)).strip(),
            "constraints": to_markdown(page.get("constraints")),
            "starterCode": prep["starter"],
            "visibleTests": visible, "hiddenTestCount": len(hidden), "judgeAvailable": problem_id in codelab_slugs or judgeable,
            "quiz": quiz,
            "hints": [{"title": hint.get("title"), "body": hint.get("description")} for hint in page.get("hints") or []],
            "doubts": [{"question": item.get("question"), "answer": item.get("answer")} for item in page.get("doubts") or []],
            "followUps": [{"question": (item.get("question") or "").strip(), "answer": item.get("answer")} for item in page.get("followUps") or []],
            "facts": facts, "similar": similar, "peerSolutions": peers,
            "reference": prep["reference"], "approaches": prep["approaches"],
            "video": sheet.get("video"), "minutes": sheet.get("minutes") or round((page.get("estDurationSeconds") or 0) / 60) or None,
            "submissions": page.get("submissionCount"),
        }
        (OUT_DETAIL / f"{problem_id}.json").write_text(json.dumps(detail, ensure_ascii=False))

        difficulty = (sheet.get("difficulty") or page.get("difficulty") or "").capitalize() or None
        base = next((problem for problem in codelab if problem["slug"] == problem_id), None)
        judge_ready = bool(base.get("judgeAvailable")) if base else judgeable
        detail["judgeAvailable"] = judge_ready
        detail["runnable"] = judge_ready or (problem_id not in codelab_slugs and runnable)
        (OUT_DETAIL / f"{problem_id}.json").write_text(json.dumps(detail, ensure_ascii=False))
        if not difficulty and base:
            difficulty = LEVEL_OF_CODELAB.get(base.get("difficulty"))
        rows.append({
            "id": problem_id, "n": page.get("displayNumber") or None, "title": page.get("name") or slug,
            "difficulty": difficulty or "Core",
            "topics": row_topics(sheet, [CODELAB_TOPIC.get((base or {}).get("patterns", [{}])[0].get("category"), "Arrays")] if base else []),
            "patterns": sheet.get("patterns") or ([base["patterns"][0]["pattern"]] if base and base.get("patterns") else []),
            "codelab": problem_id if problem_id in codelab_slugs else None, "tuf": slug,
            "judge": judge_ready, "runnable": detail["runnable"],
            "video": bool(sheet.get("video")), "editorial": bool(prep["reference"]) or bool(base),
            "peers": len(peers), "extras": True, "minutes": detail["minutes"], "sheets": sheet.get("sheets", []),
            "lc": sheet.get("lc") or (re.search(r"problems/([a-z0-9-]+)", (base or {}).get("url") or "") or [None, None])[1],
            "premium": bool(page.get("isPremium")),
        })

    all_tuf_ids = {row["tuf"]: row["id"] for row in rows if row["tuf"]}

    # Code Lab problems with no tuf counterpart.
    next_number = max([row["n"] or 0 for row in rows] + [0]) + 1
    for problem in codelab:
        if problem["slug"] in merged_codelab:
            continue
        category = (problem.get("patterns") or [{}])[0].get("category")
        rows.append({
            "id": problem["slug"], "n": next_number, "title": problem["title"],
            "difficulty": LEVEL_OF_CODELAB.get(problem.get("difficulty"), "Core"),
            "topics": [topic_name(CODELAB_TOPIC.get(category, category or "Arrays"))],
            "patterns": [problem["patterns"][0]["pattern"]] if problem.get("patterns") else [],
            "codelab": problem["slug"], "tuf": None, "judge": bool(problem.get("judgeAvailable")), "runnable": bool(problem.get("judgeAvailable")),
            "video": False, "editorial": True, "peers": 0, "extras": False, "minutes": None, "sheets": [],
            "lc": (re.search(r"problems/([a-z0-9-]+)", problem.get("url") or "") or [None, None])[1], "premium": False,
        })
        next_number += 1
    rows.sort(key=lambda row: (row["n"] or 10 ** 6, row["title"]))

    # tuf lists some problems twice (a "-1" copy in another sheet). Keep one row
    # per title; sheets that pointed at the copy are redirected below.
    redirect, kept = {}, {}
    # Code Lab rows first, so a duplicate title keeps the judged problem's id.
    for row in sorted(rows, key=lambda row: row["codelab"] is None):
        key = re.sub(r"[^a-z0-9]", "", row["title"].lower())
        if key in kept:
            keep = kept[key]
            redirect[row["id"]] = keep["id"]
            keep["sheets"] = list(dict.fromkeys(keep["sheets"] + row["sheets"]))
            keep["topics"] = keep["topics"] or row["topics"]
        else:
            kept[key] = row
    rows = [row for row in rows if row["id"] not in redirect]

    # Rows no sheet covers borrow the topic of a similar problem that has one.
    topics_of_tuf = {row["tuf"]: row["topics"] for row in rows if row["tuf"] and row["topics"]}
    for row in rows:
        if not row["topics"] and row["tuf"]:
            similar = tuf[row["tuf"]]["page"].get("similarProblems") or []
            borrowed = next((topics_of_tuf[item.get("slug")] for item in similar if isinstance(item, dict) and item.get("slug") in topics_of_tuf), None)
            row["topics"] = borrowed or [guess_topic(row["title"])]

    # Sheet structures in terms of practice ids.
    id_of_tuf = {slug_key(slug): redirect.get(tuf_id, tuf_id) for slug, tuf_id in all_tuf_ids.items()}
    id_of_lc = {}
    for row in rows:
        if row["lc"]:
            id_of_lc.setdefault(row["lc"], row["id"])

    def sheet_node(node):
        if "children" in node:
            return {"title": node["title"], "children": [sheet_node(child) for child in node["children"]]}
        return {"title": node["title"], "kind": node["kind"], "id": id_of_tuf.get(slug_key(node["slug"])) if node["kind"] == "practice" else None,
                "difficulty": (node.get("difficulty") or "").capitalize() or None, "minutes": node.get("minutes"),
                "video": node.get("video"), "lc": node.get("lc")}

    sheets = []
    for slug, group, title, description in SHEETS:
        tree = [sheet_node(node) for node in sheet_trees.get(slug, [])]
        if not tree and slug == "blind-75":
            tree = [{"title": topic, "children": [{"title": lc.replace("-", " ").title(), "kind": "practice", "id": id_of_lc.get(lc),
                                                   "difficulty": None, "minutes": None, "video": None, "lc": lc} for lc in slugs]}
                    for topic, slugs in BLIND_75]
        sheets.append({"id": slug, "group": group, "title": title, "description": description, "available": bool(tree),
                       "source": "tuf" if slug in sheet_trees else ("public list" if tree else None), "steps": tree})

    topic_counts = {}
    for row in rows:
        for topic in row["topics"]:
            topic_counts[topic] = topic_counts.get(topic, 0) + 1
    counts = {level: sum(1 for row in rows if row["difficulty"] == level) for level in ("Basic", "Core", "Pro")}

    OUT_INDEX.parent.mkdir(parents=True, exist_ok=True)
    OUT_INDEX.write_text(json.dumps({
        "generatedFrom": "tuf/ scrape + src/data/codelab/catalog.json (scripts/build_tuf_practice.py)",
        "counts": {"problems": len(rows), **counts, "judge": sum(row["judge"] for row in rows)},
        "topics": sorted(({"name": name, "count": count} for name, count in topic_counts.items()), key=lambda item: -item["count"]),
        "problems": rows,
    }, ensure_ascii=False, separators=(",", ":")))
    OUT_SHEETS.write_text(json.dumps({"sheets": sheets}, ensure_ascii=False, separators=(",", ":")))
    OUT_MANIFESTS.write_text(json.dumps({"schemaVersion": 1, "problems": manifests}, ensure_ascii=False, separators=(",", ":")))
    print(json.dumps({"rows": len(rows), **counts, **stats,
                      "referenceFailures": sum(1 for outcome in outcomes.values() if not outcome.get("ok"))}, indent=1))


if __name__ == "__main__":
    main()
