import os
import json

def parse_files():
    data = []
    current_category = None
    current_subcat = None

    for i in range(1, 5):
        file_path = f'/Users/nandanpatkar/Downloads/genai-roadmap-src/dsa_data_{i}.txt'
        if not os.path.exists(file_path):
            continue
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = [l.strip() for l in f.readlines()]
            
            idx = 0
            while idx < len(lines):
                line = lines[idx]
                if not line:
                    idx += 1
                    continue
                
                if line.startswith('**') and not line.startswith('- '):
                    text = line.replace('**', '').strip()
                    main_cats = ['Array', 'Strings', 'Binary Search', 'Stack', 'Linked List', 'Double Linked List', 'HashMap', 'Heap', 'Recursion', 'Tree', 'Binary Search Tree', 'Graph', 'Backtracking', 'Greedy', 'Dynamic Programming', 'Trie', 'Bit Manipulation']
                    
                    if text in main_cats:
                        idx += 1
                        subtitle = lines[idx] if idx < len(lines) and not lines[idx].startswith('**') else ""
                        current_category = {
                            "id": "dsa-" + text.lower().replace(' ', '-'),
                            "title": text,
                            "subtitle": subtitle,
                            "tag": "CORE MAP",
                            "tagColor": "#3b82f6", # We can cycle this
                            "modules": []
                        }
                        data.append(current_category)
                        current_subcat = None
                    else:
                        idx += 1
                        subtitle = lines[idx] if idx < len(lines) and not lines[idx].startswith('-') else ""
                        clean_subt = subtitle.split('(')[0].strip()
                        current_subcat = {
                            "id": "sub-" + text.lower().replace(' ', '-').replace('/', '')[:10],
                            "title": text,
                            "subtitle": clean_subt,
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
                    if current_subcat is not None:
                        current_subcat["subtopics"].append(p_text)
                    
                    links = []
                    while idx + 1 < len(lines) and (lines[idx+1].startswith('GFG:') or lines[idx+1].startswith('LeetCode:')):
                        idx += 1
                        l_line = lines[idx]
                        if l_line.startswith('LeetCode:'):
                            url = l_line.replace('LeetCode:', '').strip()
                            if url.startswith('http'):
                                links.append({"title": p_text + " — Practice", "url": url})
                    
                    if current_subcat is not None:
                        current_subcat["links"].extend(links)
                        current_subcat["duration"] = f"{len(current_subcat['subtopics'])} problems"
                
                idx += 1

    # Cycle colors
    colors = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4"]
    for i, cat in enumerate(data):
        cat["tagColor"] = colors[i % len(colors)]
        if i == 0:
            for m in cat["modules"]:
                m["status"] = "complete"
                
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
