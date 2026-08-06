#!/usr/bin/env python3
"""Build the AgentCore samples index from the awslabs samples repo.

Walks agentcore-samples-main/, finds every "sample unit" (a directory holding a
README plus code), classifies it, and emits:

  src/data/agentcoreSamplesData.js   metadata index consumed by the viewer
  public/agentcore-samples/<path>/   README, code files and referenced diagrams

The repo layout is mirrored verbatim under public/ so a sample's slug is just
its path — unique by construction, and provenance stays obvious.

Notebooks are flattened to Markdown here (code cells become fenced blocks,
outputs are dropped) so the app can reuse its Markdown renderer instead of
shipping a notebook viewer, and so the base64 output blobs never ship.

Run:  python3 scripts/build_agentcore_samples.py
"""
import io
import json
import os
import re
import shutil
import sys

try:
    from PIL import Image
except ImportError:  # diagrams then ship at full size
    Image = None

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "agentcore-samples-main")
OUT_ASSETS = os.path.join(ROOT, "public", "agentcore-samples")
OUT_DATA = os.path.join(ROOT, "src", "data", "agentcoreSamplesData.js")

# Files worth shipping. Everything else (video, csv, zip, gifs, archives) stays out.
CODE_EXT = {
    ".py", ".ipynb", ".ts", ".tsx", ".js", ".jsx", ".json", ".yaml", ".yml",
    ".tf", ".tfvars", ".sh", ".toml", ".txt", ".md", ".html", ".css", ".sql",
    ".dockerfile", ".env.example", ".cfg", ".ini",
}
IMAGE_EXT = {".png", ".jpg", ".jpeg", ".svg", ".webp"}   # no .gif — they are huge
MAX_IMAGE_BYTES = 2 * 1024 * 1024
# Upstream diagrams are mostly retina console screenshots (median ~190KB, many
# over 1MB). Downscaling to a sensible display width and re-encoding keeps every
# diagram while cutting the image payload to roughly a sixth.
MAX_IMAGE_WIDTH = 1400
IMAGE_PASSTHROUGH_BYTES = 120 * 1024
SKIP_DIRS = {".git", ".github", "__pycache__", "node_modules", ".venv", "venv",
             "dist", "build", ".next", ".pytest_cache", ".ruff_cache"}
SKIP_FILES = {".secrets.baseline", "uv.lock", "package-lock.json", "pnpm-lock.yaml"}

# path fragment -> doc section id in agentcoreData.js. Order matters: first hit wins.
SECTION_RULES = [
    (r"harness", "harness"),
    (r"code-interpreter", "code-interpreter"),
    (r"browser", "browser"),
    (r"memory|manage-context", "memory"),
    (r"gateway", "gateway"),
    (r"identity|authenticate|auth0|okta|entra|inbound-auth|outbound-auth|m2m|3lo|obo",
     "identity"),
    (r"payment|transact", "payments"),
    (r"observab", "observability"),
    (r"evaluat", "evaluations"),
    (r"optimi", "optimization"),
    (r"registry", "registry"),
    (r"policy", "policy"),
    (r"security", "security"),
    (r"runtime|host-your-agent", "runtime"),
]

# top-level dir -> the kind of material it holds
KIND_RULES = [
    ("00-getting-started", "getting-started"),
    ("01-features", "feature"),
    ("02-use-cases", "use-case"),
    ("03-integrations", "integration"),
    ("04-infrastructure-as-code", "iac"),
    ("05-blueprints", "blueprint"),
    ("06-workshops", "workshop"),
]

FRAMEWORKS = [
    ("strands", "Strands"), ("langgraph", "LangGraph"), ("langchain", "LangChain"),
    ("crewai", "CrewAI"), ("llama_index", "LlamaIndex"), ("llamaindex", "LlamaIndex"),
    ("google.adk", "Google ADK"), ("openai", "OpenAI Agents"),
    ("claude_agent_sdk", "Claude Agent SDK"), ("autogen", "AutoGen"),
]


def rel(path):
    return os.path.relpath(path, SRC).replace(os.sep, "/")


def is_unit(files):
    """A sample unit = a README next to something runnable."""
    lower = {f.lower() for f in files}
    if "readme.md" not in lower:
        return False
    return any(os.path.splitext(f)[1].lower() in
               {".py", ".ipynb", ".ts", ".tsx", ".tf", ".yaml", ".yml", ".sh", ".js"}
               for f in files)


# ![alt](path)  and  <img src="path">
IMG_MD = re.compile(r'!\[[^\]]*\]\(\s*<?([^)>\s]+)[^)]*\)')
IMG_HTML = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.I)


def resolve_referenced_images(shipped_md, stats):
    """Copy the images the shipped Markdown actually points at, and strip the
    references that cannot be satisfied.

    Walking each unit's directory misses diagrams kept in a shared parent
    images/ folder (referenced as ../images/x.png) and leaves dangling links to
    the .gif demos we deliberately do not ship — so resolve from the text
    instead, which fixes both and copies strictly what is used.
    """
    for dest_md in shipped_md:
        rel_md = os.path.relpath(dest_md, OUT_ASSETS).replace(os.sep, "/")
        src_dir = os.path.join(SRC, os.path.dirname(rel_md))
        try:
            with open(dest_md, encoding="utf-8", errors="replace") as f:
                text = f.read()
        except OSError:
            continue

        changed = False
        for ref in set(IMG_MD.findall(text) + IMG_HTML.findall(text)):
            if ref.startswith(("http://", "https://", "data:", "/")):
                continue
            clean = ref.split("#")[0].split("?")[0]
            src_img = os.path.normpath(os.path.join(src_dir, clean))
            ext = os.path.splitext(src_img)[1].lower()

            keep = (
                os.path.isfile(src_img)
                and os.path.commonpath([os.path.abspath(src_img), SRC]) == SRC
                and ext in IMAGE_EXT
                and os.path.getsize(src_img) <= MAX_IMAGE_BYTES
            )
            if keep:
                dest_img = os.path.join(OUT_ASSETS, os.path.relpath(src_img, SRC))
                if not os.path.exists(dest_img):
                    stats["bytes"] += write_image(src_img, dest_img)
                    stats["copied"] += 1
                continue

            # Unsatisfiable: drop the reference so no broken icon renders.
            note = "_[animated demo omitted]_" if ext in {".gif", ".mp4", ".mov"} else ""
            text = IMG_MD.sub(
                lambda m: note if m.group(1) == ref else m.group(0), text)
            text = IMG_HTML.sub(
                lambda m: note if m.group(1) == ref else m.group(0), text)
            stats["stripped"] += 1
            changed = True

        if changed:
            with open(dest_md, "w", encoding="utf-8") as f:
                f.write(text)


def notebook_to_markdown(path):
    """Flatten a .ipynb into Markdown, dropping all outputs."""
    try:
        with open(path, encoding="utf-8") as f:
            nb = json.load(f)
    except (OSError, ValueError):
        return None
    lang = (nb.get("metadata", {}).get("language_info", {}).get("name") or "python")
    out = []
    for cell in nb.get("cells", []):
        src = cell.get("source", [])
        text = ("".join(src) if isinstance(src, list) else str(src)).rstrip()
        if not text:
            continue
        if cell.get("cell_type") == "markdown":
            out.append(text)
        elif cell.get("cell_type") == "code":
            longest = max((len(m) for m in re.findall(r"`+", text)), default=0)
            fence = "`" * max(3, longest + 1)
            out.append(f"{fence}{lang}\n{text}\n{fence}")
    return "\n\n".join(out) + "\n"


def write_image(src, dest):
    """Copy a diagram, downscaling/re-encoding it when that is a clear win.

    Transparency is flattened onto white because the viewer already renders
    diagrams on a white card — leaving alpha would turn transparent AWS
    diagrams black once converted to RGB.
    """
    orig = os.path.getsize(src)
    ext = os.path.splitext(src)[1].lower()
    os.makedirs(os.path.dirname(dest), exist_ok=True)

    if Image is None or ext in {".svg", ".webp"} or orig <= IMAGE_PASSTHROUGH_BYTES:
        shutil.copy2(src, dest)
        return orig
    try:
        im = Image.open(src)
        width, height = im.size
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
            im = Image.alpha_composite(Image.new("RGBA", im.size, (255, 255, 255, 255)), im)
        im = im.convert("RGB")
        if width > MAX_IMAGE_WIDTH:
            im = im.resize((MAX_IMAGE_WIDTH, round(height * MAX_IMAGE_WIDTH / width)),
                           Image.LANCZOS)
        if ext in {".jpg", ".jpeg"}:
            buf = io.BytesIO()
            im.save(buf, "JPEG", quality=82, optimize=True)
        else:
            plain, quant = io.BytesIO(), io.BytesIO()
            im.save(plain, "PNG", optimize=True)
            im.quantize(colors=256, method=Image.MEDIANCUT).save(quant, "PNG", optimize=True)
            buf = quant if quant.tell() < plain.tell() else plain
    except Exception:                      # unreadable/exotic image — ship as-is
        shutil.copy2(src, dest)
        return orig

    if buf.tell() >= orig:
        shutil.copy2(src, dest)
        return orig
    with open(dest, "wb") as f:
        f.write(buf.getvalue())
    return buf.tell()


def first_heading(md):
    for line in md.split("\n"):
        if line.startswith("# "):
            return line[2:].strip().replace("`", "")
    return None


def first_paragraph(md):
    """First real prose paragraph of a README, as a one-line blurb.

    Works on paragraph blocks rather than single lines: upstream READMEs hard-wrap
    prose, so judging each line alone would reject the opening line as "too short"
    and pick up its continuation, leaving a blurb that starts mid-sentence.
    Bullets are matched with a trailing space so a **bold**-led paragraph is not
    mistaken for a list item.
    """
    bullet = re.compile(r"^([*+-]|\d+\.)\s")
    skip = ("#", "!", "|", ">", "```", "---", "<", "=")
    block = []
    for raw in md.split("\n") + [""]:
        s = raw.strip()
        if not s or s.startswith(skip) or bullet.match(s):
            if block:
                text = " ".join(block)
                text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)   # links -> text
                text = re.sub(r"<[^>]+>", "", text)                     # stray html
                text = re.sub(r"[*_`]", "", text)
                text = re.sub(r"\s+", " ", text).strip()
                if len(text) >= 40:
                    return (text[:197].rsplit(" ", 1)[0] + "...") if len(text) > 200 else text
                block = []
            continue
        block.append(s)
    return ""


def prettify(name):
    name = re.sub(r"^\d+[-_]", "", name)
    return name.replace("-", " ").replace("_", " ").strip().title()


def classify_section(path_lower):
    for pattern, section in SECTION_RULES:
        if re.search(pattern, path_lower):
            return section
    return None


def classify_kind(rel_path):
    top = rel_path.split("/")[0]
    for prefix, kind in KIND_RULES:
        if top == prefix:
            return kind
    return "other"


def detect_frameworks(texts):
    found = []
    blob = "\n".join(texts).lower()
    for needle, label in FRAMEWORKS:
        if needle in blob and label not in found:
            found.append(label)
    return found


def main():
    if not os.path.isdir(SRC):
        raise SystemExit(f"samples repo not found at {SRC}")
    # Re-encoding ~850 diagrams dominates the runtime, so allow reusing them
    # when only the metadata/Markdown pass has changed.
    keep_assets = "--keep-assets" in sys.argv
    if os.path.isdir(OUT_ASSETS) and not keep_assets:
        shutil.rmtree(OUT_ASSETS)
    os.makedirs(OUT_ASSETS, exist_ok=True)

    # First pass: locate every unit so nested units don't get absorbed by a parent.
    unit_dirs = []
    for dirpath, dirnames, filenames in os.walk(SRC):
        dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIRS)
        if dirpath != SRC and is_unit(filenames):
            unit_dirs.append(dirpath)
    unit_set = set(unit_dirs)

    # Directories that hold a README and contain units below them are section
    # overviews (e.g. memory/README.md). They carry real orienting text, so ship
    # them too — flagged, so they don't pad the sample catalogue.
    overview_dirs = []
    for dirpath, dirnames, filenames in os.walk(SRC):
        dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIRS)
        if dirpath == SRC or dirpath in unit_set:
            continue
        if "README.md" not in filenames:
            continue
        if any(u.startswith(dirpath + os.sep) for u in unit_set):
            overview_dirs.append(dirpath)

    samples = []
    shipped_md = []
    copied_bytes = 0

    for unit in sorted(unit_dirs):
        slug = rel(unit)
        files_meta = []
        texts = []
        readme_md = ""

        # A unit owns its own files plus any subtree that isn't itself a unit.
        for dirpath, dirnames, filenames in os.walk(unit):
            dirnames[:] = sorted(
                d for d in dirnames
                if d not in SKIP_DIRS and os.path.join(dirpath, d) not in unit_set
            )
            for fname in sorted(filenames):
                if fname in SKIP_FILES or fname.startswith("."):
                    continue
                abs_path = os.path.join(dirpath, fname)
                ext = os.path.splitext(fname)[1].lower()
                try:
                    size = os.path.getsize(abs_path)
                except OSError:
                    continue

                rel_in_unit = os.path.relpath(abs_path, unit).replace(os.sep, "/")
                dest = os.path.join(OUT_ASSETS, slug, rel_in_unit)

                # Images are handled afterwards, driven by what the Markdown
                # actually references (see resolve_referenced_images).
                if ext in IMAGE_EXT:
                    continue

                if ext not in CODE_EXT:
                    continue

                # notebooks ship as flattened markdown
                if ext == ".ipynb":
                    md = notebook_to_markdown(abs_path)
                    if md is None:
                        continue
                    dest = dest[: -len(".ipynb")] + ".md"
                    rel_in_unit = rel_in_unit[: -len(".ipynb")] + ".md"
                    os.makedirs(os.path.dirname(dest), exist_ok=True)
                    with open(dest, "w", encoding="utf-8") as f:
                        f.write(md)
                    shipped_md.append(dest)
                    copied_bytes += len(md.encode("utf-8"))
                    files_meta.append({"path": rel_in_unit, "lang": "markdown",
                                       "bytes": len(md.encode("utf-8")),
                                       "fromNotebook": True})
                    texts.append(md[:4000])
                    continue

                os.makedirs(os.path.dirname(dest), exist_ok=True)
                shutil.copy2(abs_path, dest)
                copied_bytes += size
                if ext == ".md":
                    shipped_md.append(dest)

                if fname.lower() == "readme.md" and dirpath == unit:
                    with open(abs_path, encoding="utf-8", errors="replace") as f:
                        readme_md = f.read()
                    continue  # the README is surfaced on its own, not as a file entry

                lang = {
                    ".py": "python", ".ts": "typescript", ".tsx": "tsx",
                    ".js": "javascript", ".jsx": "jsx", ".json": "json",
                    ".yaml": "yaml", ".yml": "yaml", ".tf": "hcl", ".sh": "bash",
                    ".toml": "toml", ".md": "markdown", ".html": "html",
                    ".css": "css", ".sql": "sql",
                }.get(ext, "text")
                files_meta.append({"path": rel_in_unit, "lang": lang, "bytes": size})
                if ext in {".py", ".ts", ".tsx", ".js"} and size < 200_000:
                    try:
                        with open(abs_path, encoding="utf-8", errors="replace") as f:
                            texts.append(f.read(4000))
                    except OSError:
                        pass

        if not files_meta and not readme_md:
            continue

        low = slug.lower()
        title = first_heading(readme_md) or prettify(os.path.basename(unit))
        languages = sorted({f["lang"] for f in files_meta
                            if f["lang"] in {"python", "typescript", "tsx", "hcl", "javascript"}})

        samples.append({
            "slug": slug,
            "title": title[:120],
            "desc": first_paragraph(readme_md),
            "sectionId": classify_section(low),
            "kind": classify_kind(slug),
            "frameworks": detect_frameworks(texts + [readme_md[:4000]]),
            "languages": languages,
            "hasNotebook": any(f.get("fromNotebook") for f in files_meta),
            "readme": f"/agentcore-samples/{slug}/README.md" if readme_md else None,
            "base": f"/agentcore-samples/{slug}",
            "files": sorted(files_meta, key=lambda f: f["path"]),
        })

    # Section overviews: README only, flagged so the catalogue can separate them.
    overviews = []
    for odir in sorted(overview_dirs):
        slug = rel(odir)
        src_readme = os.path.join(odir, "README.md")
        dest = os.path.join(OUT_ASSETS, slug, "README.md")
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copy2(src_readme, dest)
        shipped_md.append(dest)
        copied_bytes += os.path.getsize(src_readme)
        with open(src_readme, encoding="utf-8", errors="replace") as f:
            md = f.read()
        overviews.append({
            "slug": slug,
            "title": (first_heading(md) or prettify(os.path.basename(odir)))[:120],
            "desc": first_paragraph(md),
            "sectionId": classify_section(slug.lower()),
            "kind": "overview",
            "readme": f"/agentcore-samples/{slug}/README.md",
            "base": f"/agentcore-samples/{slug}",
        })

    # Copy exactly the diagrams the shipped Markdown points at, and strip the rest.
    img_stats = {"copied": 0, "bytes": 0, "stripped": 0}
    resolve_referenced_images(shipped_md, img_stats)
    copied_bytes += img_stats["bytes"]

    # Apache-2.0 requires the licence and notice travel with the code.
    for legal in ("LICENSE", "NOTICE"):
        src_legal = os.path.join(SRC, legal)
        if os.path.exists(src_legal):
            shutil.copy2(src_legal, os.path.join(OUT_ASSETS, legal))

    total_files = sum(len(s["files"]) for s in samples)
    by_section = {}
    for s in samples:
        by_section[s["sectionId"] or "(unmapped)"] = by_section.get(s["sectionId"] or "(unmapped)", 0) + 1

    header = f"""// Auto-generated index of the Amazon Bedrock AgentCore samples.
//
// Source: awslabs/amazon-bedrock-agentcore-samples (Apache-2.0). The sample
// bodies live under public/agentcore-samples/, mirroring the upstream layout,
// and are fetched on demand by SampleViewer. Notebooks are flattened to
// Markdown at build time (outputs stripped).
//
// Regenerate with: python3 scripts/build_agentcore_samples.py — do not hand-edit.

export const AGENTCORE_SAMPLES_TOTAL = {len(samples)};

export const AGENTCORE_SAMPLES = """

    os.makedirs(os.path.dirname(OUT_DATA), exist_ok=True)
    with open(OUT_DATA, "w", encoding="utf-8") as f:
        f.write(header)
        json.dump(samples, f, indent=2, ensure_ascii=False)
        f.write(";\n\nexport const AGENTCORE_SAMPLE_OVERVIEWS = ")
        json.dump(overviews, f, indent=2, ensure_ascii=False)
        f.write(";\n\n")
        f.write(
            "export const SAMPLES_BY_SECTION = AGENTCORE_SAMPLES.reduce((acc, s) => {\n"
            "  if (!s.sectionId) return acc;\n"
            "  (acc[s.sectionId] = acc[s.sectionId] || []).push(s);\n"
            "  return acc;\n"
            "}, {});\n\n"
            "export const SAMPLE_KINDS = [...new Set(AGENTCORE_SAMPLES.map((s) => s.kind))].sort();\n"
            "export const SAMPLE_FRAMEWORKS = [...new Set(AGENTCORE_SAMPLES.flatMap((s) => s.frameworks))].sort();\n"
        )

    print(f"sample units      : {len(samples)}")
    print(f"section overviews : {len(overviews)}")
    print(f"files shipped     : {total_files}")
    print(f"diagrams copied   : {img_stats['copied']}  (refs stripped: {img_stats['stripped']})")
    print(f"assets written    : {copied_bytes / 1048576:.1f} MB")
    print("by section:")
    for k, v in sorted(by_section.items(), key=lambda x: -x[1]):
        print(f"  {v:4d}  {k}")


if __name__ == "__main__":
    main()
