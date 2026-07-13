import os
import json
import shutil
import re

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
    lines = frontmatter_str.split("\n")
    current_key = None
    list_accumulator = None
    multiline_accumulator = None
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
            
        # Check if we are inside a multiline block
        if multiline_accumulator is not None:
            # A line belongs to the multiline block if it is indented
            if line.startswith(" ") or line.startswith("\t"):
                multiline_accumulator.append(line.strip())
                continue
            else:
                # End of multiline block
                metadata[current_key] = "\n".join(multiline_accumulator)
                multiline_accumulator = None
                current_key = None
                
        # Check if we are building a list
        if stripped.startswith("- ") and list_accumulator is not None:
            val = stripped[2:].strip()
            if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                val = val[1:-1]
            list_accumulator.append(val)
            continue
            
        # Standard key-value parsing (only for top-level keys which are not indented)
        if ":" in line and not (line.startswith(" ") or line.startswith("\t")):
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip()
            
            if val == "|" or val == ">":
                current_key = key
                multiline_accumulator = []
                metadata[key] = ""
                list_accumulator = None
            elif not val:
                current_key = key
                list_accumulator = []
                metadata[key] = list_accumulator
            else:
                if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                    val = val[1:-1]
                # If the val looks like a list in brackets, parse it
                if val.startswith("[") and val.endswith("]"):
                    items = [x.strip().strip('"').strip("'") for x in val[1:-1].split(",")]
                    metadata[key] = items
                else:
                    metadata[key] = val
                list_accumulator = None
                current_key = None
                
    if current_key and multiline_accumulator is not None:
        metadata[current_key] = "\n".join(multiline_accumulator)
        
    return metadata, body

def extract_hex_color(bg_str):
    if not bg_str:
        return None
    # match bg-[#xxxxxx] or bg-[#xxx]
    match = re.search(r"bg-\[#([0-9a-fA-F]{3,8})\]", bg_str)
    if match:
        return f"#{match.group(1)}"
    return None

def main():
    # Dynamically resolve workspace root relative to the script location
    workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    reference_src = os.path.join(workspace_dir, "reference", "source", "_posts")
    reference_dest = os.path.join(workspace_dir, "public", "reference")
    output_js_path = os.path.join(workspace_dir, "src", "data", "referenceData.js")
    
    # 1. Clean and Copy markdown files to public/reference
    print(f"Copying reference posts from {reference_src} to {reference_dest}...")
    if os.path.exists(reference_dest):
        shutil.rmtree(reference_dest)
    os.makedirs(reference_dest, exist_ok=True)
    
    # 2. Build index structure
    structure = []
    
    for file_name in os.listdir(reference_src):
        if not file_name.endswith(".md") or file_name.startswith("."):
            continue
            
        file_path = os.path.join(reference_src, file_name)
        meta, _ = parse_frontmatter(file_path)
        
        slug = file_name[:-3] # strip .md
        title = meta.get("title", slug.replace("-", " ").title())
        background = meta.get("background", "")
        bg_color = extract_hex_color(background) or "#00ff88" # Fallback to Emerald Pulse
        
        tags = meta.get("tags", [])
        if isinstance(tags, str):
            tags = [tags]
            
        categories = meta.get("categories", [])
        if isinstance(categories, str):
            categories = [categories]
        elif not categories:
            categories = ["General"]
            
        intro = meta.get("intro", "")
        if isinstance(intro, list):
            intro = " ".join(intro)
        elif not isinstance(intro, str):
            intro = str(intro)
            
        # Copy file to destination
        shutil.copy(file_path, os.path.join(reference_dest, file_name))
        
        structure.append({
            "slug": slug,
            "title": title,
            "background": background,
            "bgColor": bg_color,
            "tags": tags,
            "categories": categories,
            "intro": intro.strip(),
            "filePath": f"/reference/{file_name}"
        })
        
    # Sort structure by title
    structure.sort(key=lambda x: x["title"].lower())
    
    # Write src/data/referenceData.js
    with open(output_js_path, "w", encoding="utf-8") as f:
        f.write("// Auto-generated reference sheets index\n")
        f.write("export const REFERENCE_STRUCTURE = ")
        f.write(json.dumps(structure, indent=2))
        f.write(";\n")
        
    print(f"Successfully processed {len(structure)} reference sheets into {output_js_path}")

if __name__ == "__main__":
    main()
