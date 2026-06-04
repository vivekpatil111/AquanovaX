import os
import re

FILES = [
    r"c:\Users\harshal\.gemini\antigravity-ide\scratch\aquanovax\frontend\src\pages\customer\CustomerDashboard.tsx",
    r"c:\Users\harshal\.gemini\antigravity-ide\scratch\aquanovax\frontend\src\pages\customer\CustomerPages.tsx",
    r"c:\Users\harshal\.gemini\antigravity-ide\scratch\aquanovax\frontend\src\pages\customer\MarketplacePage.tsx"
]

def replace_grid_item(content):
    # Regex to find `<Grid item xs={12} sm={6} ...>` and convert it to `<Grid size={{ xs: 12, sm: 6, ... }}>`
    # Match `<Grid item` followed by space-separated size props up to `>` or `sx={` or other props.
    # Actually, simpler: replace `item ` with ` ` and convert `xs={12} sm={6}` to `size={{xs: 12, sm: 6}}`?
    # No, what if we just strip `item ` entirely? Does `<Grid xs={12}>` work in MUI v6? 
    # Let's just remove `item ` and see if `<Grid xs={12}>` works, or just replace `item` with nothing. Wait, `<Grid xs={12}>` throws warnings in v6 if size is expected.
    # Let's do a regex that extracts size attributes.
    
    def replacer(match):
        attrs_str = match.group(1)
        # Find all sizes
        sizes = {}
        def attr_repl(m):
            sizes[m.group(1)] = m.group(2)
            return ""
        
        # Remove xs={X}, sm={Y}, md={Z}, lg={W}, xl={V}
        attrs_str = re.sub(r'\b(xs|sm|md|lg|xl)={([^}]+)}', attr_repl, attrs_str)
        
        size_str = ""
        if sizes:
            size_inner = ", ".join(f"{k}: {v}" for k, v in sizes.items())
            size_str = f" size={{{{{size_inner}}}}}"
            
        # Also remove `item`
        attrs_str = re.sub(r'\bitem\b', '', attrs_str)
        
        return f"<Grid{size_str}{attrs_str}>"
        
    return re.sub(r'<Grid([^>]*?)>', replacer, content)

for fpath in FILES:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = replace_grid_item(content)
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
print("Fixed Grid items.")
