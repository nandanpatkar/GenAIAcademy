import os
import re

directory = '/Users/nandanpatkar/Downloads/genai-roadmap-src'
exclude_dirs = {'node_modules', 'dist', '.git', '.vscode', '.antigravityignore'}
# But wait, public contains build output, which we also want to update, except maybe we will just rebuild.
# Yes, we will rebuild flow-design afterwards! So we can exclude public/flow-design or just rebuild.
# Let's exclude public from replacement to avoid corrupting binary files, though it has html.

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        return # Skip binary files

    new_content = content.replace('Flow Design', 'Flow Design')
    new_content = new_content.replace('flow-design', 'flow-design')
    new_content = new_content.replace('FLOW_DESIGN', 'FLOW_DESIGN')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(directory):
    dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
    for file in files:
        if file.startswith('.'):
            continue
        # Also avoid replacing in lockfiles as they are generated and huge
        if file == 'package-lock.json':
            continue
        filepath = os.path.join(root, file)
        replace_in_file(filepath)

print("Replacement complete.")
