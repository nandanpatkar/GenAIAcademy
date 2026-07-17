import re

filepath = 'src/styles/ProjectIDE.css'
with open(filepath, 'r') as f:
    content = f.read()

# Replace rgba(0, 255, 136, ...) with rgba(var(--neon-rgb, 0, 255, 136), ...)
content = re.sub(r'rgba\(0,\s*255,\s*136,', 'rgba(var(--neon-rgb, 0, 255, 136),', content)

# Also replace blue accent glow rgba(0, 136, 255, ...) with rgba(var(--neon-dim-rgb, 0, 136, 255), ...)
content = re.sub(r'rgba\(0,\s*136,\s*255,', 'rgba(var(--neon-dim-rgb, 0, 136, 255),', content)

with open(filepath, 'w') as f:
    f.write(content)

print("Updated ProjectIDE.css")
