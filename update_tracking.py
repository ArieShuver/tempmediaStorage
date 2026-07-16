import os
import glob
import re

os.chdir(r'c:\Users\aries\tempmediaStorage')

html_files = glob.glob('*.html')

track_pattern = re.compile(
    r"\['scroll', 'mousemove', 'touchstart', 'click'\]\.forEach\(e => window\.addEventListener\(e, loadTracking, \{once: true, passive: true\}\)\);"
)

track_repl = "['touchstart', 'click', 'keydown', 'mouseover'].forEach(e => window.addEventListener(e, loadTracking, {once: true, passive: true}));\n  setTimeout(loadTracking, 6500);"

count = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = track_pattern.sub(track_repl, content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
        count += 1

print(f"Done. Updated {count} files.")
