import os
import json
import shutil
import re

# Canonical categories in order, matching DEFS in Categories.rs
CATEGORIES_DEFS = [
    {"slug": "logic", "name": "Logic", "icon": "ti-logic-and", "blurb": "Clear reasoning from the ground up - true/false, if-then, proof, and spotting bad arguments."},
    {"slug": "mathematics", "name": "Mathematics", "icon": "ti-math-symbols", "blurb": "The language reality is written in - sets, numbers, probability, and more - taught from intuition."},
    {"slug": "physics", "name": "Physics", "icon": "ti-atom", "blurb": "How the physical world really works, in plain language - motion, energy, light, and quantum rules."},
    {"slug": "operating-systems", "name": "Operating Systems", "icon": "ti-device-desktop", "blurb": "Windows, macOS, and Linux - what they're really doing under the hood."},
    {"slug": "hardware", "name": "Hardware", "icon": "ti-cpu", "blurb": "How the machine is actually built and talks to itself - from the chip to the device on your desk."},
    {"slug": "networking", "name": "Networking", "icon": "ti-network", "blurb": "How the internet really works, and how to design networks that hold up."},
    {"slug": "programming-concepts", "name": "Programming Concepts", "icon": "ti-bulb", "blurb": "The ideas under every language - how code runs, data structures, async, memory, big-O, and tool choice."},
    {"slug": "programming-languages", "name": "Programming Languages", "icon": "ti-code", "blurb": "Python, JavaScript, TypeScript, Java, C#, Go, and Rust - each language end to end."},
    {"slug": "web-fundamentals", "name": "Web Fundamentals", "icon": "ti-world-www", "blurb": "HTML, CSS, and how the browser actually works - the web platform itself, learned properly."},
    {"slug": "frameworks", "name": "Frameworks & Libraries", "icon": "ti-stack-2", "blurb": "Django, FastAPI, React, Next, Spring Boot, and friends."},
    {"slug": "version-control", "name": "Version Control", "icon": "ti-git-branch", "blurb": "Git and friends: what they actually do, and how to stay calm when they break."},
    {"slug": "debugging", "name": "Debugging & Troubleshooting", "icon": "ti-bug", "blurb": "Reading the error, finding the real cause, and fixing it calmly instead of guessing."},
    {"slug": "testing", "name": "Testing", "icon": "ti-test-pipe", "blurb": "Unit, integration, end-to-end, and load tests - plus TDD/BDD - that actually catch the bug."},
    {"slug": "databases", "name": "Databases", "icon": "ti-database", "blurb": "Schemas, queries, and the production lessons that come with them."},
    {"slug": "data-analytics", "name": "Data & Analytics", "icon": "ti-chart-histogram", "blurb": "Data pipelines, engineering, BI, and the ML basics - turning raw data into answers."},
    {"slug": "apis", "name": "APIs & Integration", "icon": "ti-plug-connected", "blurb": "REST, GraphQL, gRPC, webhooks, and message queues - how systems talk to each other."},
    {"slug": "architecture", "name": "Architecture", "icon": "ti-sitemap", "blurb": "Designing systems that survive contact with real load and real teams."},
    {"slug": "devops", "name": "DevOps", "icon": "ti-infinity", "blurb": "CI/CD, automation, and infrastructure as code - shipping safely and repeatedly."},
    {"slug": "infrastructure", "name": "Infrastructure & Cloud", "icon": "ti-cloud", "blurb": "Servers, containers, and cloud platforms - where your code actually runs."},
    {"slug": "performance", "name": "Performance", "icon": "ti-gauge", "blurb": "Finding the slow thing, and the tools that show you where it hides."},
    {"slug": "security", "name": "Security", "icon": "ti-shield-lock", "blurb": "The threats, the defaults, and the habits that keep you out of the news."},
    {"slug": "ai-ml", "name": "AI & Machine Learning", "icon": "ti-brain", "blurb": "Models, training, and putting AI into products - without hype or hand-waving."},
    {"slug": "working-with-ai", "name": "Working with AI", "icon": "ti-robot", "blurb": "Practical AI for everyone - prompting, agents, CLIs, MCP, skills, and loops."},
    {"slug": "no-code", "name": "No-Code & Automation", "icon": "ti-puzzle", "blurb": "Build apps and automate work without (much) code - Zapier, Make, n8n, Airtable, Retool."},
    {"slug": "tooling", "name": "Tools & Workflow", "icon": "ti-tools", "blurb": "The tools a job expects you to know - migrations, builds, containers, cloud, auth, observability."},
    {"slug": "projects", "name": "Projects", "icon": "ti-rocket", "blurb": "Build real things end to end - small projects with working code run in the browser."},
    {"slug": "working-as-a-developer", "name": "Working as a Developer", "icon": "ti-briefcase", "blurb": "Human side of the job - reviews, messy code, asking questions, on-call, and interviews."},
    {"slug": "practice", "name": "Practice", "icon": "ti-keyboard", "blurb": "Hands-on lessons in a coding playground - SQL, JavaScript, Python."}
]

def parse_frontmatter(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return {}, ""
    
    if not content.startswith("---"):
        return {}, content
    
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content
    
    frontmatter_str = parts[1]
    body = parts[2]
    
    metadata = {}
    for line in frontmatter_str.split("\n"):
        line = line.strip()
        if not line or ":" not in line:
            continue
        key, val = line.split(":", 1)
        key = key.strip()
        val = val.strip()
        
        # strip quotes
        if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
            val = val[1:-1]
        
        # parse tags or lists if needed
        if val.startswith('[') and val.endswith(']'):
            val = [x.strip().strip('"').strip("'") for x in val[1:-1].split(',')]
            
        metadata[key] = val
        
    return metadata, body

def main():
    # Dynamically resolve workspace root relative to the script location
    workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    guides_src = os.path.join(workspace_dir, "themissingmanual", "guides")
    guides_dest = os.path.join(workspace_dir, "public", "guides")
    output_js_path = os.path.join(workspace_dir, "src", "data", "manualData.js")
    
    # 1. Copy guides to public/guides
    print(f"Copying guides from {guides_src} to {guides_dest}...")
    if os.path.exists(guides_dest):
        shutil.rmtree(guides_dest)
    shutil.copytree(guides_src, guides_dest)
    
    # 2. Build index structure
    structure = []
    
    # Map for easy lookup
    cat_map = {c["slug"]: c for c in CATEGORIES_DEFS}
    
    # Scan categories
    for cat_slug in os.listdir(guides_src):
        cat_path = os.path.join(guides_src, cat_slug)
        if not os.path.isdir(cat_path) or cat_slug.startswith("."):
            continue
            
        # Get category metadata
        cat_meta = cat_map.get(cat_slug, {
            "slug": cat_slug,
            "name": cat_slug.replace("-", " ").title(),
            "icon": "ti-book",
            "blurb": ""
        })
        
        category_entry = {
            "slug": cat_meta["slug"],
            "name": cat_meta["name"],
            "icon": cat_meta["icon"],
            "blurb": cat_meta["blurb"],
            "guides": []
        }
        
        # Scan guides inside category
        for guide_slug in os.listdir(cat_path):
            guide_path = os.path.join(cat_path, guide_slug)
            if not os.path.isdir(guide_path) or guide_slug.startswith("."):
                continue
                
            # Read _guide.md for guide metadata
            guide_meta_file = os.path.join(guide_path, "_guide.md")
            guide_title = guide_slug.replace("-", " ").title()
            guide_summary = ""
            guide_order = 999
            
            if os.path.exists(guide_meta_file):
                meta, _ = parse_frontmatter(guide_meta_file)
                guide_title = meta.get("title", guide_title)
                guide_summary = meta.get("summary", "")
                try:
                    guide_order = int(meta.get("order", 999))
                except:
                    pass
            
            guide_entry = {
                "slug": guide_slug,
                "title": guide_title,
                "summary": guide_summary,
                "order": guide_order,
                "phases": []
            }
            
            # Scan phases inside guide (excluding _guide.md)
            for file_name in os.listdir(guide_path):
                if file_name == "_guide.md" or not file_name.endswith(".md") or file_name.startswith("."):
                    continue
                    
                phase_path = os.path.join(guide_path, file_name)
                meta, _ = parse_frontmatter(phase_path)
                
                phase_slug = file_name[:-3] # strip .md
                phase_title = meta.get("title", phase_slug.replace("-", " ").title())
                phase_num = meta.get("phase", "1")
                phase_summary = meta.get("summary", "")
                
                # Check for numeric ordering
                try:
                    phase_order = int(phase_num)
                except:
                    phase_order = 999
                    
                phase_entry = {
                    "slug": phase_slug,
                    "title": phase_title,
                    "phaseNum": phase_num,
                    "order": phase_order,
                    "summary": phase_summary,
                    "filePath": f"/guides/{cat_slug}/{guide_slug}/{file_name}"
                }
                
                guide_entry["phases"].append(phase_entry)
                
            # Sort phases by phaseNum/order
            guide_entry["phases"].sort(key=lambda x: x["order"])
            category_entry["guides"].append(guide_entry)
            
        # Sort guides by order, then title
        category_entry["guides"].sort(key=lambda x: (x["order"], x["title"]))
        
        # Only add if category has guides
        if category_entry["guides"]:
            structure.append(category_entry)
            
    # Sort categories according to CATEGORIES_DEFS order
    def cat_sort_key(cat):
        for idx, definition in enumerate(CATEGORIES_DEFS):
            if definition["slug"] == cat["slug"]:
                return idx
        return len(CATEGORIES_DEFS) # append unknown at end
        
    structure.sort(key=cat_sort_key)
    
    # Write src/data/manualData.js
    with open(output_js_path, "w", encoding="utf-8") as f:
        f.write("// Auto-generated missing manual structure data\n")
        f.write("export const MANUAL_STRUCTURE = ")
        f.write(json.dumps(structure, indent=2))
        f.write(";\n")
        
    print(f"Successfully processed {len(structure)} categories into {output_js_path}")

if __name__ == "__main__":
    main()
