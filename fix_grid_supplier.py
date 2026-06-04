import re

filepath = r"c:\Users\harshal\.gemini\antigravity-ide\scratch\aquanovax\frontend\src\pages\supplier\SupplierPages.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace <Grid size={{xs: 12, ...}}> with <Grid item xs={12} ...>
def repl(m):
    props_str = m.group(1) # e.g. "xs: 12, sm: 6"
    props = []
    for prop in props_str.split(','):
        prop = prop.strip()
        if prop:
            k, v = prop.split(':')
            k = k.strip()
            v = v.strip()
            props.append(f"{k}={{{v}}}")
    return "item " + " ".join(props)

# This regex matches size={{...}} and captures the inner part
content = re.sub(r'size=\{\{(.*?)\}\}', repl, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed Grid props in SupplierPages.tsx")
