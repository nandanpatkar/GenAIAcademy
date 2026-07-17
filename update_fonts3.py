import os
import re

directories = ['src/components', 'src/styles', 'src/pages']

replacements = [
    (r"fontFamily:\s*['\"]Syne,\s*sans-serif['\"]", "fontFamily: 'var(--font-heading, inherit)'"),
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

