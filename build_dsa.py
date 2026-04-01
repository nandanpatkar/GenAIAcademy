import os
import json
import re

def parse_files():
    data = []
    current_category = None
    current_subcat = None
    main_cats = [
        'Array', 'Strings', 'Binary Search', 'Stack', 'Linked List', 'Double Linked List',
        'HashMap', 'Heap', 'Recursion', 'Tree', 'Binary Search Tree', 'Graph',
        'Backtracking', 'Greedy', 'Dynamic Programming', 'Trie', 'Bit Manipulation'
    ]

    # Prefer consolidated file when present; otherwise use legacy split files.
    preferred_file = '/Users/nandanpatkar/Downloads/genai-roadmap-src/dsa_data.txt'
    if os.path.exists(preferred_file):
        input_files = [preferred_file]
    else:
        input_files = []
        for i in range(1, 5):
            file_path = f'/Users/nandanpatkar/Downloads/genai-roadmap-src/dsa_data_{i}.txt'
            if os.path.exists(file_path):
                input_files.append(file_path)

    for file_path in input_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = [l.strip() for l in f.readlines()]
            
            idx = 0
            while idx < len(lines):
                line = lines[idx]
                if not line:
                    idx += 1
                    continue
                
                if line.startswith('### '):
                    text = re.sub(r'\s*\(from.*\)$', '', line[4:].strip())
                    if text in main_cats:
                        current_category = {
                            "id": "dsa-" + text.lower().replace(' ', '-'),
                            "title": text,
                            "subtitle": "",
                            "tag": "CORE MAP",
                            "tagColor": "#3b82f6",
                            "modules": []
                        }
                        data.append(current_category)
                        current_subcat = None

                elif line.startswith('**') and not line.startswith('- '):
                    text = line.replace('**', '').strip()
                    text = re.sub(r'\s*\(from.*\)$', '', text)
                    if text in main_cats:
                        current_category = {
                            "id": "dsa-" + text.lower().replace(' ', '-'),
                            "title": text,
                            "subtitle": "",
                            "tag": "CORE MAP",
                            "tagColor": "#3b82f6",
                            "modules": []
                        }
                        data.append(current_category)
                        current_subcat = None
                    else:
                        clean_title = re.sub(r'\s*\(\d+/\d+\)\s*$', '', text).strip()
                        # Look ahead for subtitle
                        subtitle = ""
                        if idx + 1 < len(lines):
                            next_line = lines[idx+1].strip()
                            if next_line and not next_line.startswith('-') and not next_line.startswith('**') and not next_line.startswith('###'):
                                subtitle = next_line
                                idx += 1 # Consume subtitle line
                        
                        current_subcat = {
                            "id": "sub-" + clean_title.lower().replace(' ', '-').replace('/', '')[:10],
                            "title": clean_title,
                            "subtitle": subtitle,
                            "status": "locked",
                            "duration": "0 problems",
                            "subtopics": [],
                            "videos": [],
                            "files": [],
                            "links": [],
                            "overview": "Mastering " + text + " optimally natively."
                        }
                        if current_category:
                            current_category["modules"].append(current_subcat)

                
                elif line.startswith('- **'):
                    p_text = line.replace('- **', '').split('**')[0].strip()
                    difficulty = None
                    diff_match = re.search(r'—\s*\*\*(Easy|Medium|Hard)\*\*|—\s*(Easy|Medium|Hard)\b', line, re.IGNORECASE)
                    if diff_match:
                        difficulty = (diff_match.group(1) or diff_match.group(2)).capitalize()

                    if current_subcat is not None:
                        current_subcat["subtopics"].append({"title": p_text, "status": "pending"})

                    
                    links = []
                    while idx + 1 < len(lines) and (lines[idx+1].strip().startswith('GFG:') or lines[idx+1].strip().startswith('LeetCode:')):
                        idx += 1
                        l_line = lines[idx].strip()
                        if l_line.startswith('LeetCode:'):
                            url = l_line.replace('LeetCode:', '').strip()
                            if url.startswith('http'):
                                links.append({"title": p_text + " — Practice", "url": url, "difficulty": difficulty})
                        # GFG links are now removed per user request

                    
                    if current_subcat is not None:
                        current_subcat["links"].extend(links)
                        current_subcat["duration"] = f"{len(current_subcat['subtopics'])} problems"
                
                idx += 1


    # Sort data according to main_cats order
    data.sort(key=lambda x: main_cats.index(x["title"]) if x["title"] in main_cats else 999)

    # Cycle colors
    colors = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4"]

    for i, cat in enumerate(data):
        cat["tagColor"] = colors[i % len(colors)]
        if i == 0:
            for mi, m in enumerate(cat["modules"]):
                m["status"] = "complete"
                # For the first module, mark subtopics as complete
                if mi == 0:
                    for s in m["subtopics"]:
                        s["status"] = "complete"

                
    import math
    chunk_size = 2 # 2 categories per file to keep files small
    parts = math.ceil(len(data) / chunk_size)
    
    imports = []
    spreads = []
    
    for i in range(parts):
        chunk = data[i*chunk_size : (i+1)*chunk_size]
        part_name = f"dsaPart{i+1}"
        js_content = f"export const {part_name} = " + json.dumps(chunk, indent=2) + ";\n"
        
        with open(f'/Users/nandanpatkar/Downloads/genai-roadmap-src/src/data/dsa_part{i+1}.js', 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        imports.append(f'import {{ {part_name} }} from "./dsa_part{i+1}";')
        spreads.append(f"    ...{part_name}")

    path_content = f"""{chr(10).join(imports)}

export const DSA_PATH = {{
  id: "pattern-wise-dsa",
  title: "Pattern Wise DSA",
  subtitle: "Comprehensive algorithmic mastery mapping 450+ foundational patterns optimally.",
  nodes: [
{',\\n'.join(spreads)}
  ]
}};
"""
    with open('/Users/nandanpatkar/Downloads/genai-roadmap-src/src/data/dsa_path.js', 'w', encoding='utf-8') as f:
        f.write(path_content)
        
    print(f"Generated {parts} files.")

if __name__ == '__main__':
    parse_files()
