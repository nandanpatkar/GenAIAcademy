import os, json
total_problems = 0
found_cats = []
for i in range(1, 10):
    try:
        with open(f'/Users/nandanpatkar/Downloads/genai-roadmap-src/src/data/dsa_part{i}.js') as f:
            content = f.read().split('=', 1)[1].strip().rstrip(';')
            data = json.loads(content)
            for cat in data:
                cat_probs = sum(len(m.get('subtopics', [])) for m in cat.get('modules', []))
                print(f"- {cat.get('title')}: {len(cat.get('modules', []))} modules, {cat_probs} problems")
                total_problems += cat_probs
                found_cats.append(cat.get('title'))
    except Exception as e:
        print(f"Error reading part {i}: {e}")
print(f"\nTotal categories: {len(found_cats)}")
print(f"Total problems: {total_problems}")
