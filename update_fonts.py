import os
import re

directories = ['src/components', 'src/styles', 'src/pages']

replacements = [
    (r"font-family:\s*['\"]?Syne['\"]?,\s*sans-serif;", "font-family: inherit;"),
    (r"font-family:\s*['\"]?JetBrains Mono['\"]?,\s*['\"]?Fira Code['\"]?,\s*monospace;", "font-family: var(--font-mono, monospace);"),
    (r"font-family:\s*['\"]?Fira Code['\"]?,\s*monospace;", "font-family: var(--font-mono, monospace);"),
    (r"font-family:\s*['\"]?Fira Code['\"]?\s*;", "font-family: var(--font-mono, monospace);"),
    (r"font-family:\s*['\"]?JetBrains Mono['\"]?,\s*monospace;", "font-family: var(--font-mono, monospace);"),
    (r"font-family:\s*['\"]?Inter['\"]?,\s*system-ui,\s*sans-serif;", "font-family: inherit;"),
    (r"font-family:\s*['\"]?Inter['\"]?,\s*sans-serif;", "font-family: inherit;"),
    (r"font-family:\s*['\"]?Fira Code['\"]?,\s*['\"]?Consolas['\"]?,\s*monospace;", "font-family: var(--font-mono, monospace);"),
    (r"fontFamily:\s*['\"]'Syne',\s*sans-serif['\"]", "fontFamily: 'var(--font-heading, inherit)'"),
    (r"font-family:\s*ui-monospace,\s*SFMono-Regular,\s*Menlo,\s*Monaco,\s*Consolas,\s*monospace;", "font-family: var(--font-mono, monospace);")
]

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.css'):
                filepath = os.path.join(root, file)
                
                # skip global.css to protect the logo font
                if 'global.css' in filepath:
                    continue
                    
                with open(filepath, 'r') as f:
                    content = f.read()
                    
                original = content
                for pattern, repl in replacements:
                    content = re.sub(pattern, repl, content)
                
                if original != content:
                    with open(filepath, 'w') as f:
                        f.write(content)
                    print(f"Updated {filepath}")

