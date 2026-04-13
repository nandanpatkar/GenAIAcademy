import json
import re

with open('/Users/nandanpatkar/Downloads/genai-roadmap-src/src/components/AimlCompanion.jsx', 'r') as f:
    content = f.read()

# Extract CURRICULA array content
start_marker = "const CURRICULA = ["
end_marker = "];"
start_idx = content.find(start_marker)
if start_idx == -1:
    print("Could not find CURRICULA")
    exit(1)

# Find matching closing bracket for CURRICULA
# Simple counter for brackets
bracket_count = 0
found_start = False
end_idx = -1
for i in range(start_idx + len(start_marker) - 1, len(content)):
    if content[i] == '[':
        bracket_count += 1
        found_start = True
    elif content[i] == ']':
        bracket_count -= 1
        if found_start and bracket_count == -1:
            end_idx = i + 1
            break

curricula_str = content[start_idx:end_idx]

# Clean up to make it more like Python list/dict
# Remove JS-specific parts
curricula_str = curricula_str.replace("const CURRICULA = ", "")
curricula_str = re.sub(r"url: `\${BASE}(.*)`", r'"url": "https://aimlcompanion.ai\1"', curricula_str)
curricula_str = re.sub(r"(\w+):", r'"\1":', curricula_str) # Add quotes to keys
curricula_str = curricula_str.replace("'", '"') # Use double quotes
curricula_str = re.sub(r",\s*]", "]", curricula_str) # Remove trailing commas in arrays
curricula_str = re.sub(r",\s*}", "}", curricula_str) # Remove trailing commas in objects

try:
    curricula = json.loads(curricula_str)
except Exception as e:
    # If JSON parse fails, I'll do a more robust regex extraction
    print("JSON parse failed, trying regex approach", e)
    curricula = []
    # Find curriculum blocks
    blocks = re.findall(r'\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*color:\s*"([^"]+)"(?:,\s*url:\s*[^,]+)?,\s*modules:\s*\[([^\]]+)\]', content)
    for cid, clabel, ccolor, mod_str in blocks:
        mods = re.findall(r'\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)"\s*\}', mod_str)
        curricula.append({
            "id": cid,
            "label": clabel,
            "color": ccolor,
            "modules": [{"id": mid, "label": mlabel} for mid, mlabel in mods]
        })

full_roadmap = {
    "id": "aiml-companion-comprehensive",
    "title": "AIML Companion: The Complete Roadmap",
    "description": "A comprehensive, high-fidelity curriculum covering the entire AI/ML ecosystem—from mathematical foundations to advanced LLM agents and MLOps.",
    "color": "#00ff88",
    "nodes": [
        {
            "id": curr["id"],
            "title": curr["label"],
            "color": curr.get("color", "#3b82f6"),
            "modules": [
                {
                    "id": mod["id"],
                    "title": mod["label"],
                    "status": "pending",
                    "subtopics": [
                        { "title": f"In-depth: {mod['label']}", "id": f"st-{mod['id']}-1", "status": "pending" }
                    ]
                } for mod in curr.get("modules", [])
            ]
        } for curr in curricula
    ]
}

with open('/Users/nandanpatkar/Downloads/genai-roadmap-src/aiml_comprehensive_roadmap.json', 'w') as f:
    json.dump(full_roadmap, f, indent=2)

print("Full Roadmap JSON generated successfully with Python.")
