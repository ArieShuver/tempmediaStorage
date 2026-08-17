import os
import glob
import re

os.chdir(r'c:\Users\aries\tempmediaStorage')

html_files = glob.glob('*.html')

count = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add cache buster to style.min.css
    new_content = re.sub(r'href="style\.min\.css(\?v=\d+)?"', r'href="style.min.css?v=2"', content)
    
    # Add cache buster to script.js
    new_content = re.sub(r'src="script\.js(\?v=\d+)?"', r'src="script.js?v=2"', new_content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
        count += 1

print(f"Done. Updated {count} files.")
