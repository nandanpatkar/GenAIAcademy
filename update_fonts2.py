import os
import re

directories = ['src/components', 'src/styles', 'src/pages']

replacements = [
    (r"fontFamily:\s*['\"]'Fira Code', monospace['\"]", "fontFamily: 'var(--font-mono, monospace)'"),
    (r"fontFamily:\s*['\"]'Fira Code',\s*'JetBrains Mono',\s*'Cascadia Code',\s*monospace['\"]", "fontFamily: 'var(--font-mono, monospace)'"),
    (r"fontFamily:\s*['\"]'DM Mono',\s*'Fira Code',\s*monospace['\"]", "fontFamily: 'var(--font-mono, monospace)'"),
    (r"--ga-mono:\s*'Fira Code',\s*'JetBrains Mono',\s*ui-monospace,\s*monospace;", "--ga-mono: var(--font-mono, monospace);"),
    (r"--ide-font-mono:\s*'Fira Code',\s*'JetBrains Mono',\s*'Cascadia Code',\s*monospace;", "--ide-font-mono: var(--font-mono, monospace);")
]

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.css'):
                filepath = os.path.join(root, file)
                    
                with open(filepath, 'r') as f:
                    content = f.read()
                    
                original = content
                for pattern, repl in replacements:
                    content = re.sub(pattern, repl, content)
                
                if original != content:
                    with open(filepath, 'w') as f:
                        f.write(content)
                    print(f"Updated {filepath}")

