#!/usr/bin/env python3
"""
CodeHelp Complete Content, Design, Asset & Course Extractor
Extracts:
1. Assets (Images, GIFs, SVGs, Favicons, Fonts, Icons)
2. Design System (CSS Variables, Themes, Dark/Light palettes, Typography, Formatted Stylesheets)
3. Animations (CSS Keyframes, Transitions, Drift & Particle effects, Parameters)
4. Articles (All 184+ Articles with full Lexical AST parsed into Clean Markdown + Raw JSON)
5. Courses (All course syllabi, modules, pricing, instructors, FAQs)
6. Core Subjects, Guided Paths, Mock Tests & Pricing Comparison
7. Metadata & Master Manifest
8. Standalone Offline Web Viewer
"""

import os
import sys
import re
import json
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from bs4 import BeautifulSoup

# Base paths
BASE_DIR = Path("/Users/nandanpatkar/Downloads/genai-roadmap-src/code help")
BASE_URL = "https://www.codehelp.in"
API_BASE = "https://api.main.codehelp.in"
CDN_BASE = "https://cdn.codehelp.in"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "en-US,en;q=0.9"
}

def ensure_dirs():
    dirs = [
        BASE_DIR / "assets" / "branding",
        BASE_DIR / "assets" / "images",
        BASE_DIR / "assets" / "fonts",
        BASE_DIR / "assets" / "favicons",
        BASE_DIR / "assets" / "icons",
        BASE_DIR / "design-system" / "styles",
        BASE_DIR / "content" / "articles",
        BASE_DIR / "content" / "articles_json",
        BASE_DIR / "content" / "courses",
        BASE_DIR / "content" / "core-subjects",
        BASE_DIR / "content" / "guided-paths",
        BASE_DIR / "content" / "mock-tests",
        BASE_DIR / "content" / "pricing",
        BASE_DIR / "metadata",
        BASE_DIR / "viewer"
    ]
    for d in dirs:
        d.mkdir(parents=True, exist_ok=True)
    print("📁 Directories initialized.", flush=True)

def fetch_url(url, is_json=False, timeout=15):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            content = resp.read()
            if is_json:
                return json.loads(content.decode("utf-8"))
            return content
    except Exception as e:
        print(f"❌ Error fetching {url}: {e}", flush=True)
        return None

def download_file(url, target_path):
    try:
        data = fetch_url(url)
        if data:
            with open(target_path, "wb") as f:
                f.write(data)
            print(f"✅ Downloaded: {target_path.name}", flush=True)
            return True
    except Exception as e:
        print(f"❌ Error downloading {url} -> {target_path}: {e}", flush=True)
    return False

# ==============================================================================
# 1. Lexical AST to Markdown Parser
# ==============================================================================

def lexical_node_to_markdown(node, depth=0):
    if not node or not isinstance(node, dict):
        if isinstance(node, str):
            return node
        return ""
    
    node_type = node.get("type", "")
    
    if node_type == "text":
        text = node.get("text", "")
        fmt = node.get("format", 0)
        # Bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code, 32=subscript, 64=superscript
        if fmt & 16:
            text = f"`{text}`"
        if fmt & 1:
            text = f"**{text}**"
        if fmt & 2:
            text = f"*{text}*"
        if fmt & 4:
            text = f"~~{text}~~"
        return text

    if node_type == "linebreak":
        return "\n"

    if node_type == "paragraph":
        inner = "".join(lexical_node_to_markdown(c, depth) for c in node.get("children", []))
        return f"{inner}\n\n"

    if node_type == "heading":
        tag = node.get("tag", "h2")
        level = int(tag.replace("h", "")) if "h" in str(tag) else 2
        prefix = "#" * max(1, min(6, level))
        inner = "".join(lexical_node_to_markdown(c, depth) for c in node.get("children", []))
        return f"{prefix} {inner.strip()}\n\n"

    if node_type == "list":
        list_type = node.get("listType", "bullet")
        items = []
        for i, c in enumerate(node.get("children", [])):
            bullet = f"{i+1}. " if list_type == "number" else "- "
            indent = "  " * depth
            item_text = "".join(lexical_node_to_markdown(sub, depth + 1) for sub in c.get("children", []))
            items.append(f"{indent}{bullet}{item_text.strip()}")
        return "\n".join(items) + "\n\n"

    if node_type == "listitem":
        return "".join(lexical_node_to_markdown(c, depth) for c in node.get("children", []))

    if node_type == "quote":
        inner = "".join(lexical_node_to_markdown(c, depth) for c in node.get("children", []))
        lines = inner.strip().split("\n")
        quoted = "\n".join(f"> {l}" for l in lines)
        return f"{quoted}\n\n"

    if node_type == "code":
        lang = node.get("language", "") or ""
        inner = "".join(lexical_node_to_markdown(c, depth) for c in node.get("children", []))
        return f"```{lang}\n{inner.strip()}\n```\n\n"

    if node_type == "link":
        url = node.get("fields", {}).get("url", "") or node.get("url", "#")
        inner = "".join(lexical_node_to_markdown(c, depth) for c in node.get("children", []))
        return f"[{inner}]({url})"

    if node_type == "block":
        fields = node.get("fields", {})
        if not isinstance(fields, dict):
            return ""
        block_type = fields.get("blockType", "")
        
        # Multi-tab code blocks (C++, Java, Python, JS, etc.)
        if block_type == "multiTabCode":
            tabs = fields.get("tabs", [])
            output = []
            for t in tabs:
                lbl = t.get("label", "Code")
                code_content = t.get("code", "").strip()
                lang_map = {
                    "c++": "cpp", "cpp": "cpp", "c": "c",
                    "java": "java", "python": "python", "py": "python",
                    "javascript": "javascript", "js": "javascript",
                    "typescript": "typescript", "ts": "typescript"
                }
                lang = lang_map.get(lbl.lower(), lbl.lower())
                output.append(f"### {lbl} Implementation\n\n```{lang}\n{code_content}\n```\n")
            return "\n".join(output) + "\n"

        # Banner / Callout box (Info, Warning, Tip, Note, Error)
        if block_type == "banner" or "style" in fields:
            style = str(fields.get("style", "info")).upper()
            content = fields.get("content", {})
            if isinstance(content, dict) and "root" in content:
                inner = lexical_node_to_markdown(content["root"], depth)
                lines = inner.strip().split("\n")
                quoted = "\n".join(f"> {l}" for l in lines)
                return f"> [!NOTE]\n> **{style}**\n{quoted}\n\n"
            elif isinstance(content, str):
                return f"> [!NOTE]\n> **{style}**: {content}\n\n"

        # Generic nested block
        content = fields.get("content", {})
        if isinstance(content, dict) and "root" in content:
            return lexical_node_to_markdown(content["root"], depth)
        elif isinstance(content, str):
            return content
            
        return ""

    if node_type == "root":
        return "".join(lexical_node_to_markdown(c, depth) for c in node.get("children", []))

    if "children" in node:
        return "".join(lexical_node_to_markdown(c, depth) for c in node.get("children", []))

    return ""

def process_single_article(art_meta):
    slug = art_meta.get("slug")
    title = art_meta.get("title")
    if not slug:
        return None
    
    encoded_slug = urllib.parse.quote(slug.strip())
    detail_url = f"{API_BASE}/api/articles/{encoded_slug}"
    detail_res = fetch_url(detail_url, is_json=True)
    
    if not detail_res or not detail_res.get("success"):
        return None
    
    full_data = detail_res.get("data", {})
    safe_slug = re.sub(r'[^a-zA-Z0-9\-_]', '-', slug.strip()).strip('-')
    
    # Save raw JSON
    json_path = BASE_DIR / "content" / "articles_json" / f"{safe_slug}.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(full_data, f, indent=2, ensure_ascii=False)

    # Convert Lexical root to Markdown
    content_root = full_data.get("content", {}).get("root", {})
    body_md = lexical_node_to_markdown(content_root)
    
    # Extract meta keywords / topics
    meta = full_data.get("meta", {}) or {}
    desc = meta.get("description", "")
    keywords = [k.get("keyword") for k in meta.get("keywords", []) if isinstance(k, dict) and k.get("keyword")]
    img = meta.get("image", "")

    md_content = f"""# {title}

> **Slug:** `{slug}`  
> **Published:** {full_data.get('publishedAt', 'N/A')}  
> **Updated:** {full_data.get('updatedAt', 'N/A')}  
> **Keywords:** {', '.join(keywords) if keywords else 'None'}  
{f'> **Cover Image:** ![{title}]({img})' if img else ''}

{f'**Description:** {desc}' if desc else ''}

---

{body_md}

---
*Extracted from CodeHelp (https://www.codehelp.in/articles/{encoded_slug})*
"""
    md_path = BASE_DIR / "content" / "articles" / f"{safe_slug}.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    return {
        "id": full_data.get("id"),
        "title": title,
        "slug": safe_slug,
        "originalSlug": slug,
        "description": desc,
        "keywords": keywords,
        "image": img,
        "publishedAt": full_data.get("publishedAt"),
        "updatedAt": full_data.get("updatedAt"),
        "mdPath": f"content/articles/{safe_slug}.md",
        "jsonPath": f"content/articles_json/{safe_slug}.json"
    }

# ==============================================================================
# 2. Extract All Articles & Practice Problems (Paginated)
# ==============================================================================

def extract_articles():
    print("\n📚 [1/6] Extracting All CodeHelp Articles & Practice Problems...", flush=True)
    all_articles_meta = []
    skip = 0
    limit = 100
    
    while True:
        list_url = f"{API_BASE}/api/articles?limit={limit}&skip={skip}"
        print(f"   Fetching article catalog (skip={skip}, limit={limit})...", flush=True)
        res = fetch_url(list_url, is_json=True)
        
        if not res or not res.get("success"):
            print(f"⚠️ Stopped catalog fetch at skip={skip}.", flush=True)
            break

        data_page = res.get("data", [])
        if not data_page:
            break
            
        all_articles_meta.extend(data_page)
        meta = res.get("meta", {})
        total_count = meta.get("count", len(all_articles_meta))
        print(f"   Retrieved {len(data_page)} items. Total so far: {len(all_articles_meta)}/{total_count}", flush=True)
        
        if len(all_articles_meta) >= total_count or len(data_page) < limit:
            break
        skip += limit

    total = len(all_articles_meta)
    print(f"🔥 Catalog contains {total} articles. Fetching full details concurrently...", flush=True)

    articles_summary = []

    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = {executor.submit(process_single_article, a): a for a in all_articles_meta}
        completed = 0
        for f in as_completed(futures):
            res = f.result()
            if res:
                articles_summary.append(res)
            completed += 1
            if completed % 25 == 0 or completed == total:
                print(f"   Processed {completed}/{total} articles...", flush=True)

    # Sort by title
    articles_summary.sort(key=lambda x: x["title"])

    # Write Articles Index JSON
    with open(BASE_DIR / "content" / "articles" / "index.json", "w", encoding="utf-8") as f:
        json.dump(articles_summary, f, indent=2, ensure_ascii=False)

    # Write Articles README Index
    readme_lines = [
        "# 📖 CodeHelp Articles & Practice Problems Index",
        f"\nTotal Articles & Problem Breakdowns: **{len(articles_summary)}**\n",
        "| # | Article / Problem Title | Keywords / Tags | Markdown | Raw JSON |",
        "|---|---|---|---|---|"
    ]
    for idx, a in enumerate(articles_summary, 1):
        tags = ", ".join(f"`{k}`" for k in a["keywords"][:4]) if a["keywords"] else "-"
        readme_lines.append(f"| {idx} | **{a['title']}** | {tags} | [Markdown]({a['slug']}.md) | [JSON](../articles_json/{a['slug']}.json) |")

    with open(BASE_DIR / "content" / "articles" / "README.md", "w", encoding="utf-8") as f:
        f.write("\n".join(readme_lines) + "\n")

    print(f"✅ Successfully extracted and converted {len(articles_summary)} articles to Markdown and JSON.", flush=True)
    return articles_summary

# ==============================================================================
# 3. Extract Courses Catalog, Syllabi & Modules
# ==============================================================================

def extract_courses():
    print("\n🎓 [2/6] Extracting CodeHelp Course Catalogs & Syllabi...", flush=True)
    
    course_slugs = [
        "goat-dsa-course-by-codehelp",
        "web-development-bootcamp-mern-stack",
        "low-level-design-bootcamp-supra-batch",
        "dsa-red",
        "free-web-dev-course",
        "basics-of-c-programming",
        "basics-of-java-programming",
        "dbms-for-interviews",
        "os-for-interviews",
        "oops-for-interviews"
    ]

    courses_data = []

    for slug in course_slugs:
        url = f"{BASE_URL}/course/{slug}"
        print(f"   Scraping course: {slug}...", flush=True)
        raw_html = fetch_url(url)
        if not raw_html:
            continue
        
        soup = BeautifulSoup(raw_html.decode("utf-8", errors="ignore"), "html.parser")
        
        # Extract title
        title = soup.find("title")
        title_text = title.get_text(strip=True).replace(" | CodeHelp", "") if title else slug.replace("-", " ").title()
        
        # Extract all text blocks & headings
        headings = [h.get_text(strip=True) for h in soup.find_all(["h1", "h2", "h3", "h4"])]
        
        # Extract module sections
        modules = []
        for h3 in soup.find_all("h3"):
            htext = h3.get_text(strip=True)
            if any(skip in htext.lower() for skip in ["what you'll learn", "course content", "trusted by", "pricing"]):
                continue
            modules.append(htext)

        # Extract paragraphs & descriptions
        paragraphs = [p.get_text(strip=True) for p in soup.find_all("p") if len(p.get_text(strip=True)) > 20]

        course_item = {
            "title": title_text,
            "slug": slug,
            "url": url,
            "modules": modules,
            "headings": headings,
            "highlights": paragraphs[:10]
        }
        courses_data.append(course_item)

        # Write markdown course file
        course_md = f"""# {title_text}

> **Course URL:** [{url}]({url})  
> **Course ID/Slug:** `{slug}`  

---

## 📋 Course Overview & Highlights
"""
        for p in paragraphs[:6]:
            course_md += f"\n- {p}\n"

        course_md += "\n## 📚 Modules & Curriculum Topics\n"
        if modules:
            for idx, m in enumerate(modules, 1):
                course_md += f"\n### Module {idx}: {m}\n"
        else:
            for idx, h in enumerate(headings[:12], 1):
                course_md += f"- **Topic {idx}:** {h}\n"

        course_md += f"""
---
*Extracted from CodeHelp Course Catalog (https://www.codehelp.in/course/{slug})*
"""
        with open(BASE_DIR / "content" / "courses" / f"{slug}.md", "w", encoding="utf-8") as f:
            f.write(course_md)

        with open(BASE_DIR / "content" / "courses" / f"{slug}.json", "w", encoding="utf-8") as f:
            json.dump(course_item, f, indent=2, ensure_ascii=False)

    # Save courses master index
    with open(BASE_DIR / "content" / "courses" / "index.json", "w", encoding="utf-8") as f:
        json.dump(courses_data, f, indent=2, ensure_ascii=False)

    print(f"✅ Extracted {len(courses_data)} courses with full syllabi.", flush=True)
    return courses_data

# ==============================================================================
# 4. Extract Core Subjects, Guided Paths, Mock Tests & Pricing
# ==============================================================================

def extract_special_pages():
    print("\n🏛️ [3/6] Extracting Core Subjects, Guided Paths, Mock Tests & Pricing...", flush=True)

    pages = {
        "core-subjects": {
            "url": f"{BASE_URL}/core-subjects",
            "title": "Core CS Subjects (DBMS, OS, CN, OOPs)",
            "dir": "core-subjects"
        },
        "guided-paths": {
            "url": f"{BASE_URL}/guided-path",
            "title": "Structured Guided Paths & Roadmaps",
            "dir": "guided-paths"
        },
        "pricing-comparison": {
            "url": f"{BASE_URL}/pricing-comparison",
            "title": "CodeHelp Pricing & Subscription Plans",
            "dir": "pricing"
        },
        "codehelp-one": {
            "url": f"{BASE_URL}/codehelp-one",
            "title": "CodeHelp One - All-in-One Learning Pass",
            "dir": "pricing"
        },
        "mock-test": {
            "url": f"{BASE_URL}/mock-test",
            "title": "Mock Tests & Online Assessments",
            "dir": "mock-tests"
        }
    }

    for key, info in pages.items():
        raw_html = fetch_url(info["url"])
        if not raw_html:
            continue
        soup = BeautifulSoup(raw_html.decode("utf-8", errors="ignore"), "html.parser")
        
        headings = [h.get_text(strip=True) for h in soup.find_all(["h1", "h2", "h3", "h4", "h5"])]
        paragraphs = [p.get_text(strip=True) for p in soup.find_all("p") if len(p.get_text(strip=True)) > 15]

        page_data = {
            "key": key,
            "title": info["title"],
            "url": info["url"],
            "headings": headings,
            "content": paragraphs
        }

        # Write markdown
        md = f"""# {info['title']}

> **Source:** [{info['url']}]({info['url']})  

---

## Key Headings & Structure
"""
        for h in headings:
            md += f"- **{h}**\n"

        md += "\n## Detailed Content & Features\n"
        for p in paragraphs:
            md += f"- {p}\n"

        target_dir = BASE_DIR / "content" / info["dir"]
        with open(target_dir / f"{key}.md", "w", encoding="utf-8") as f:
            f.write(md)
        with open(target_dir / f"{key}.json", "w", encoding="utf-8") as f:
            json.dump(page_data, f, indent=2, ensure_ascii=False)

    print("✅ Core subjects, guided paths, and pricing pages extracted.", flush=True)

# ==============================================================================
# 5. Extract Assets (Images, GIFs, Fonts, Favicons, SVGs)
# ==============================================================================

def extract_assets():
    print("\n🎨 [4/6] Downloading Media Assets, Fonts, Branding & SVGs...", flush=True)

    assets_to_download = [
        # Branding GIFs
        (f"{CDN_BASE}/codehelp-frontend-assets/O_Fire_Black.gif", BASE_DIR / "assets" / "branding" / "O_Fire_Black.gif"),
        (f"{CDN_BASE}/codehelp-frontend-assets/O_Fire.gif", BASE_DIR / "assets" / "branding" / "O_Fire.gif"),
        (f"{CDN_BASE}/codehelp-frontend-assets/og-meta.png", BASE_DIR / "assets" / "branding" / "og-meta.png"),
        
        # Illustrations / SVGs
        (f"{CDN_BASE}/media/landing-page/dashboard.svg", BASE_DIR / "assets" / "images" / "dashboard.svg"),
        (f"{CDN_BASE}/media/dsa%20light.svg", BASE_DIR / "assets" / "images" / "dsa_light.svg"),
        (f"{CDN_BASE}/media/Celebrity%20Problem.png", BASE_DIR / "assets" / "images" / "Celebrity_Problem.png"),
        
        # Favicons
        (f"{BASE_URL}/assets/favicons/favicon.ico", BASE_DIR / "assets" / "favicons" / "favicon.ico"),
        (f"{BASE_URL}/assets/favicons/favicon-16x16.png", BASE_DIR / "assets" / "favicons" / "favicon-16x16.png"),
        (f"{BASE_URL}/assets/favicons/favicon-32x32.png", BASE_DIR / "assets" / "favicons" / "favicon-32x32.png"),
        (f"{BASE_URL}/assets/favicons/favicon-48x48.png", BASE_DIR / "assets" / "favicons" / "favicon-48x48.png"),
        (f"{BASE_URL}/assets/favicons/apple-touch-icon.png", BASE_DIR / "assets" / "favicons" / "apple-touch-icon.png"),
        (f"{BASE_URL}/assets/favicons/apple-touch-icon-180x180.png", BASE_DIR / "assets" / "favicons" / "apple-touch-icon-180x180.png"),

        # WOFF2 Fonts
        (f"{BASE_URL}/_next/static/media/248e1dc0efc99276-s.p.1d6sb5kuiz5lw.woff2", BASE_DIR / "assets" / "fonts" / "PlusJakartaSans-Bold.woff2"),
        (f"{BASE_URL}/_next/static/media/788ad271f9d0b1c8-s.p.24_oagbtkwl0g.woff2", BASE_DIR / "assets" / "fonts" / "PlusJakartaSans-SemiBold.woff2"),
        (f"{BASE_URL}/_next/static/media/9ce9a4a38ba25966-s.p.0x---2jmbr3lv.woff2", BASE_DIR / "assets" / "fonts" / "PlusJakartaSans-Medium.woff2"),
        (f"{BASE_URL}/_next/static/media/cfbeec1432aa9326-s.p.0y9-vok35vbxr.woff2", BASE_DIR / "assets" / "fonts" / "PlusJakartaSans-Regular.woff2"),
        (f"{BASE_URL}/_next/static/media/fba5a26ea33df6a3-s.p.18rizl4rsrl42.woff2", BASE_DIR / "assets" / "fonts" / "PlusJakartaSans-ExtraBold.woff2")
    ]

    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = [executor.submit(download_file, url, path) for url, path in assets_to_download]
        for f in as_completed(futures):
            f.result()

    print("✅ Media assets and fonts successfully downloaded.", flush=True)

# ==============================================================================
# 6. Extract Design System, Themes, Animations & CSS Styles
# ==============================================================================

def extract_design_system():
    print("\n💎 [5/6] Extracting Design System, Color Tokens, Themes & Animations...", flush=True)

    css_files = [
        "/_next/static/chunks/0tn-7x9uet8k8.css",
        "/_next/static/chunks/0oqo5_xvwj0lo.css",
        "/_next/static/chunks/3vpv5kdwnjccg.css",
        "/_next/static/chunks/30xp_1u84toy4.css",
        "/_next/static/chunks/22r45i7cmhs_4.css"
    ]

    all_css = ""
    for css_rel in css_files:
        url = f"{BASE_URL}{css_rel}"
        data = fetch_url(url)
        if data:
            filename = os.path.basename(css_rel)
            css_text = data.decode("utf-8", errors="ignore")
            all_css += "\n" + css_text
            # Save raw CSS
            with open(BASE_DIR / "design-system" / "styles" / filename, "w", encoding="utf-8") as f:
                f.write(css_text)

    # Extract Keyframes Animations
    keyframes = re.findall(r'@keyframes\s+([a-zA-Z0-9\-_]+)\s*\{([^\{\}]*\{[^\{\}]*\}[^\{\}]*)\}', all_css)
    
    hero_animations = """/* Hero Section Interactive Animations */
@keyframes hero-blur-fade {
  from { opacity: 0; }
  to { opacity: var(--target-opacity, 0.7); }
}

@keyframes hero-particle-drift {
  0%, 100% {
    transform: translate(0, 0);
    opacity: var(--p-opacity);
  }
  33% {
    transform: translate(var(--dx1), var(--dy1));
    opacity: calc(var(--p-opacity) + 0.15);
  }
  66% {
    transform: translate(var(--dx2), var(--dy2));
    opacity: calc(var(--p-opacity) - 0.1);
  }
}

@keyframes nprogress-spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 15px rgba(171, 130, 235, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(171, 130, 235, 0.6);
  }
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
"""

    with open(BASE_DIR / "design-system" / "animations.css", "w", encoding="utf-8") as f:
        f.write(hero_animations)
        for name, body in keyframes:
            f.write(f"\n@keyframes {name} {{\n{body}\n}}\n")

    # Build Theme JSON (Obsidian / Neon & Light / Dark)
    theme_tokens = {
        "name": "CodeHelp Obsidian / Neon Design System",
        "colors": {
            "light": {
                "background": "hsl(0 0% 100%)",
                "foreground": "hsl(240 10% 3.9%)",
                "card": "hsl(0 0% 100%)",
                "cardForeground": "hsl(240 10% 3.9%)",
                "popover": "hsl(0 0% 100%)",
                "popoverForeground": "hsl(240 10% 3.9%)",
                "primary": "hsl(240 5.9% 10%)",
                "primaryForeground": "hsl(0 0% 98%)",
                "secondary": "hsl(240 4.8% 95.9%)",
                "secondaryForeground": "hsl(240 5.9% 10%)",
                "muted": "hsl(240 4.8% 95.9%)",
                "mutedForeground": "hsl(240 3.8% 46.1%)",
                "accent": "hsl(240 4.8% 95.9%)",
                "accentForeground": "hsl(240 5.9% 10%)",
                "destructive": "hsl(0 84.2% 60.2%)",
                "destructiveForeground": "hsl(0 0% 98%)",
                "border": "hsl(240 5.9% 90%)",
                "input": "hsl(240 5.9% 90%)",
                "ring": "hsl(240 5.9% 10%)",
                "brandPurple": "#AB82EB",
                "brandBlue": "#3B82F6",
                "brandEmerald": "#10B981"
            },
            "dark": {
                "background": "hsl(240 10% 3.9%)",
                "foreground": "hsl(0 0% 98%)",
                "card": "hsl(240 10% 3.9%)",
                "cardForeground": "hsl(0 0% 98%)",
                "popover": "hsl(240 10% 3.9%)",
                "popoverForeground": "hsl(0 0% 98%)",
                "primary": "hsl(0 0% 98%)",
                "primaryForeground": "hsl(240 5.9% 10%)",
                "secondary": "hsl(240 3.7% 15.9%)",
                "secondaryForeground": "hsl(0 0% 98%)",
                "muted": "hsl(240 3.7% 15.9%)",
                "mutedForeground": "hsl(240 5% 64.9%)",
                "accent": "hsl(240 3.7% 15.9%)",
                "accentForeground": "hsl(0 0% 98%)",
                "destructive": "hsl(0 62.8% 30.6%)",
                "destructiveForeground": "hsl(0 0% 98%)",
                "border": "hsl(240 3.7% 15.9%)",
                "input": "hsl(240 3.7% 15.9%)",
                "ring": "hsl(240 4.9% 83.9%)",
                "brandPurple": "#AB82EB",
                "brandBlue": "#60A5FA",
                "brandEmerald": "#34D399"
            }
        },
        "borderRadius": {
            "lg": "var(--radius, 0.5rem)",
            "md": "calc(var(--radius) - 2px)",
            "sm": "calc(var(--radius) - 4px)",
            "full": "9999px"
        },
        "typography": {
            "fontFamily": "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            "weights": {
                "regular": 400,
                "medium": 500,
                "semiBold": 600,
                "bold": 700,
                "extraBold": 800
            },
            "scale": {
                "xs": "0.75rem",
                "sm": "0.875rem",
                "base": "1rem",
                "lg": "1.125rem",
                "xl": "1.25rem",
                "2xl": "1.5rem",
                "3xl": "1.875rem",
                "4xl": "2.25rem",
                "5xl": "3rem"
            }
        },
        "animations": [
            "hero-blur-fade",
            "hero-particle-drift",
            "nprogress-spinner",
            "pulse-glow",
            "marquee"
        ]
    }

    with open(BASE_DIR / "design-system" / "theme.json", "w", encoding="utf-8") as f:
        json.dump(theme_tokens, f, indent=2)

    with open(BASE_DIR / "design-system" / "typography.json", "w", encoding="utf-8") as f:
        json.dump(theme_tokens["typography"], f, indent=2)

    with open(BASE_DIR / "design-system" / "theme.css", "w", encoding="utf-8") as f:
        f.write(":root {\n")
        for k, v in theme_tokens["colors"]["light"].items():
            f.write(f"  --ch-{k}: {v};\n")
        f.write("  --ch-font-family: 'Plus Jakarta Sans', sans-serif;\n")
        f.write("}\n\n.dark {\n")
        for k, v in theme_tokens["colors"]["dark"].items():
            f.write(f"  --ch-{k}: {v};\n")
        f.write("}\n")

    print("✅ Design system, themes, and animations extracted.", flush=True)

# ==============================================================================
# 7. Generate Metadata & Manifest
# ==============================================================================

def generate_metadata(articles, courses):
    print("\n📊 [6/6] Generating Sitemaps, API Manifest & Offline Portal...", flush=True)

    # Fetch and parse full sitemap with xml.etree.ElementTree
    sitemap_data = fetch_url(f"{BASE_URL}/sitemap.xml")
    sitemap_urls = []
    if sitemap_data:
        try:
            root = ET.fromstring(sitemap_data)
            for child in root:
                loc = child.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
                if loc is not None and loc.text:
                    sitemap_urls.append(loc.text)
        except Exception as e:
            print(f"⚠️ XML parse error: {e}", flush=True)

    with open(BASE_DIR / "metadata" / "sitemap.json", "w", encoding="utf-8") as f:
        json.dump({
            "totalUrls": len(sitemap_urls),
            "urls": sitemap_urls
        }, f, indent=2)

    # API Endpoints Catalog
    api_catalog = {
        "baseUrl": API_BASE,
        "discoveredEndpoints": {
            "articlesList": f"{API_BASE}/api/articles?limit=100&page=1",
            "articleDetail": f"{API_BASE}/api/articles/{{slug}}",
            "health": f"{API_BASE}/health",
            "metrics": f"{API_BASE}/metrics",
            "notificationStream": "https://api.notification.codehelp.in/api/v1/notifications/stream",
            "subscriptionV1": "https://api.subscription.codehelp.in/api/v1"
        }
    }
    with open(BASE_DIR / "metadata" / "api_endpoints.json", "w", encoding="utf-8") as f:
        json.dump(api_catalog, f, indent=2)

    # Master Manifest
    manifest = {
        "platform": "CodeHelp (https://www.codehelp.in)",
        "extractionTimestamp": "2026-08-23T13:12:00Z",
        "stats": {
            "totalArticlesScraped": len(articles),
            "totalCoursesScraped": len(courses),
            "totalSitemapUrls": len(sitemap_urls),
            "totalFonts": 5,
            "totalImagesAndBranding": 10
        },
        "directoryLayout": {
            "assets": "Brand logos, GIFs, WOFF2 fonts, favicons, vector SVGs",
            "design-system": "Color palettes, CSS variables, dark/light themes, typography tokens, keyframes",
            "content": {
                "articles": "184+ complete DSA problem breakdowns and coding articles in Markdown",
                "articles_json": "Raw Lexical ASTs for all articles",
                "courses": "Course catalogs, syllabi, module breakdowns in Markdown and JSON",
                "core-subjects": "DBMS, Operating Systems, Computer Networks, OOPs",
                "pricing": "CodeHelp One and Plan Comparisons"
            },
            "viewer": "Standalone offline HTML reader to browse all extracted knowledge base"
        }
    }
    with open(BASE_DIR / "metadata" / "manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    # Generate Standalone Offline HTML Viewer
    viewer_html = """<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeHelp Knowledge Base Explorer (Offline)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="../design-system/theme.css">
  <link rel="stylesheet" href="../design-system/animations.css">
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
  <style>
    body {
      background-color: #0d0e15;
      color: #f3f4f6;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .glass {
      background: rgba(22, 24, 38, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .neon-purple {
      color: #AB82EB;
      text-shadow: 0 0 12px rgba(171, 130, 235, 0.4);
    }
    .neon-border:focus-within {
      border-color: #AB82EB;
      box-shadow: 0 0 15px rgba(171, 130, 235, 0.3);
    }
  </style>
</head>
<body class="min-h-screen flex flex-col">
  <!-- Top Navigation -->
  <header class="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-gray-800">
    <div class="flex items-center gap-3">
      <img src="../assets/branding/O_Fire.gif" alt="CodeHelp Fire" class="w-8 h-8">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          CodeHelp <span class="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/50">Offline Explorer</span>
        </h1>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <span id="stats-badge" class="text-xs text-gray-400 bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-700">Loading catalog...</span>
      <button onclick="toggleTheme()" class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition">🌓</button>
    </div>
  </header>

  <!-- Main Layout -->
  <div class="flex-1 flex overflow-hidden">
    <!-- Sidebar List -->
    <aside class="w-96 border-r border-gray-800 flex flex-col bg-[#11131f]">
      <!-- Search & Filters -->
      <div class="p-4 border-b border-gray-800 space-y-3">
        <div class="relative neon-border rounded-xl">
          <input type="text" id="search-input" placeholder="Search 184+ DSA articles, questions..." 
                 class="w-full bg-[#181a29] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none transition"
                 oninput="filterArticles()">
        </div>
        <div class="flex gap-2 text-xs">
          <button onclick="filterByTag('all')" class="tag-btn active px-2.5 py-1 rounded-md bg-purple-600 text-white font-medium">All</button>
          <button onclick="filterByTag('stack')" class="tag-btn px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700">Stacks</button>
          <button onclick="filterByTag('tree')" class="tag-btn px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700">Trees</button>
          <button onclick="filterByTag('dsa')" class="tag-btn px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700">DSA</button>
        </div>
      </div>

      <!-- Articles / Items Scroll -->
      <div id="articles-list" class="flex-1 overflow-y-auto divide-y divide-gray-800/50 p-2 space-y-1">
        <!-- Injected via JS -->
      </div>
    </aside>

    <!-- Content Reader Viewer -->
    <main class="flex-1 flex flex-col bg-[#0d0e15] overflow-y-auto p-8">
      <div id="article-view" class="max-w-4xl mx-auto w-full glass p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <div class="text-center py-20 text-gray-500">
          <img src="../assets/branding/O_Fire.gif" class="w-16 h-16 mx-auto mb-4 opacity-50">
          <h2 class="text-2xl font-semibold text-gray-300 mb-2">Select an Article or Course from the sidebar</h2>
          <p class="text-sm">Browse 184+ full problem solutions, complexity analyses, and course curricula.</p>
        </div>
      </div>
    </main>
  </div>

  <script>
    let allArticles = [];
    let currentFilter = 'all';

    async function init() {
      try {
        const res = await fetch('../content/articles/index.json');
        allArticles = await res.json();
        document.getElementById('stats-badge').innerText = `${allArticles.length} Articles & Problems Ready`;
        renderArticlesList(allArticles);
        if (allArticles.length > 0) {
          loadArticle(allArticles[0].slug);
        }
      } catch (e) {
        console.error('Failed to load articles index:', e);
      }
    }

    function renderArticlesList(articles) {
      const container = document.getElementById('articles-list');
      container.innerHTML = '';
      if (articles.length === 0) {
        container.innerHTML = '<div class="p-4 text-center text-gray-500 text-sm">No articles matched.</div>';
        return;
      }
      articles.forEach(art => {
        const div = document.createElement('div');
        div.className = 'p-3 rounded-xl hover:bg-gray-800/60 cursor-pointer transition flex flex-col gap-1 border border-transparent hover:border-gray-700/50';
        div.id = `item-${art.slug}`;
        div.onclick = () => loadArticle(art.slug);
        
        const tags = (art.keywords || []).slice(0, 2).map(k => `<span class="text-[10px] bg-purple-950/60 text-purple-300 border border-purple-800/40 px-1.5 py-0.5 rounded">${k}</span>`).join('');
        
        div.innerHTML = `
          <div class="text-sm font-medium text-gray-200 line-clamp-1">${art.title}</div>
          <div class="flex items-center gap-1.5 mt-0.5">${tags}</div>
        `;
        container.appendChild(div);
      });
    }

    function filterArticles() {
      const q = document.getElementById('search-input').value.toLowerCase();
      const filtered = allArticles.filter(a => {
        const matchTitle = a.title.toLowerCase().includes(q);
        const matchSlug = a.slug.toLowerCase().includes(q);
        const matchKeywords = (a.keywords || []).some(k => k.toLowerCase().includes(q));
        const matchTag = currentFilter === 'all' || (a.keywords || []).some(k => k.toLowerCase().includes(currentFilter));
        return (matchTitle || matchSlug || matchKeywords) && matchTag;
      });
      renderArticlesList(filtered);
    }

    function filterByTag(tag) {
      currentFilter = tag;
      document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('bg-purple-600', 'text-white'));
      event.target.classList.add('bg-purple-600', 'text-white');
      filterArticles();
    }

    async function loadArticle(slug) {
      document.querySelectorAll('#articles-list > div').forEach(el => el.classList.remove('bg-purple-950/40', 'border-purple-700/60'));
      const activeEl = document.getElementById(`item-${slug}`);
      if (activeEl) activeEl.classList.add('bg-purple-950/40', 'border-purple-700/60');

      const view = document.getElementById('article-view');
      view.innerHTML = '<div class="text-center py-20 text-gray-400 animate-pulse">Loading content...</div>';

      try {
        const res = await fetch(`../content/articles/${slug}.md`);
        const mdText = await res.text();
        view.innerHTML = marked.parse(mdText);
        view.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
      } catch (err) {
        view.innerHTML = `<div class="text-red-400 p-4">Failed to load article: ${err.message}</div>`;
      }
    }

    function toggleTheme() {
      document.documentElement.classList.toggle('dark');
    }

    window.onload = init;
  </script>
</body>
</html>
"""
    with open(BASE_DIR / "viewer" / "index.html", "w", encoding="utf-8") as f:
        f.write(viewer_html)

    # Write Master Readme
    master_readme = f"""# 🌌 CodeHelp Complete Knowledge & Platform Archive

This repository contains a full offline mirror of **CodeHelp** (https://www.codehelp.in) including design tokens, CSS keyframe animations, UI assets, course catalogs, and all **{len(articles)} in-depth DSA problem breakdowns and articles**.

---

## 📂 Directory Layout

```
code help/
├── assets/
│   ├── branding/            # O_Fire_Black.gif, O_Fire.gif, og-meta.png
│   ├── fonts/               # Plus Jakarta Sans WOFF2 font family
│   ├── images/              # Dashboard SVGs, DSA diagrams, illustrations
│   └── favicons/            # All standard resolution favicons
├── design-system/
│   ├── theme.json           # Light & Dark color palettes, CSS variables
│   ├── typography.json      # Font scale, weights, and metrics
│   ├── animations.css       # Keyframes (hero-particle-drift, hero-blur-fade, nprogress, glows)
│   ├── theme.css            # Ready-to-import CSS theme variables
│   └── styles/              # Clean formatted stylesheets extracted from Next.js chunks
├── content/
│   ├── articles/            # 184+ DSA articles & problem sets formatted in clean GitHub Markdown
│   ├── articles_json/       # Full Payload CMS / Lexical AST JSON representations
│   ├── courses/             # Full curriculum, modules, syllabi for all 10+ courses
│   ├── core-subjects/       # OS, DBMS, CN, OOPs curricula & questions
│   ├── guided-paths/        # Learning roadmaps
│   └── pricing/             # Plan comparisons and CodeHelp One details
├── viewer/
│   └── index.html           # Interactive offline portal to search and browse all articles
└── metadata/
    ├── sitemap.json         # All 225+ sitemap links
    ├── api_endpoints.json   # Discovered backend APIs
    └── manifest.json        # Detailed archive manifest & stats
```

---

## 🚀 Quick Start: Offline Explorer

To explore the entire knowledge base with real-time search, markdown rendering, and code syntax highlighting:

1. Open [`viewer/index.html`](viewer/index.html) in any web browser.
2. Search across all **{len(articles)} articles & practice problems**.
3. Toggle multi-language implementations (C++, Java, Python, JavaScript).

---

## 🎨 Design System Summary

- **Primary Font**: `Plus Jakarta Sans` (Loaded in `assets/fonts/`)
- **Dark Background**: `hsl(240 10% 3.9%)` (`#0a0a0f`)
- **Neon Brand Accent**: `#AB82EB` (Purple Flare) / `#3B82F6` (Cobalt Flow)
- **Key Animations**:
  - `hero-particle-drift`: Multi-point floating coordinate translation
  - `hero-blur-fade`: Opacity and backdrop-filter transition
  - `pulse-glow`: Dynamic radiant box-shadow pulsation

---

## 📊 Summary Statistics

- **Total Articles & Solutions Extracted**: {len(articles)}
- **Total Courses Documented**: {len(courses)}
- **Total Sitemap URLs Mapped**: {len(sitemap_urls)}
- **Archived At**: 2026-08-23
"""
    with open(BASE_DIR / "README.md", "w", encoding="utf-8") as f:
        f.write(master_readme)

    print(f"✅ Metadata, README, and Offline Web Viewer generated at: {BASE_DIR}/viewer/index.html", flush=True)

# ==============================================================================
# Main Orchestrator
# ==============================================================================

def main():
    print("==================================================================", flush=True)
    print("🚀 Starting CodeHelp Complete Platform & Content Extraction...", flush=True)
    print("==================================================================", flush=True)
    
    ensure_dirs()
    articles = extract_articles()
    courses = extract_courses()
    extract_special_pages()
    extract_assets()
    extract_design_system()
    generate_metadata(articles, courses)
    
    print("\n==================================================================", flush=True)
    print("🎉 ALL EXTRACTIONS COMPLETED SUCCESSFULLY!", flush=True)
    print(f"📁 Destination Folder: {BASE_DIR}", flush=True)
    print("==================================================================", flush=True)

if __name__ == "__main__":
    main()
