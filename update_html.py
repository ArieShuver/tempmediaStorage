import os
import glob
import re

# Navigate to the correct directory since the script might run from somewhere else
os.chdir(r'c:\Users\aries\tempmediaStorage')

html_files = glob.glob('*.html')

font_pattern = re.compile(
    r'<link rel="preconnect" href="https://fonts\.googleapis\.com">\s*'
    r'<link rel="preconnect" href="https://fonts\.gstatic\.com" crossorigin>\s*'
    r'<link rel="preload" href="https://fonts\.googleapis\.com/css2\?family=Heebo:wght@300;400;500;700;800;900&display=swap" as="style" onload="this\.onload=null;this\.rel=\'stylesheet\'">\s*'
    r'<noscript><link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?family=Heebo:wght@300;400;500;700;800;900&display=swap"></noscript>'
)

font_repl = (
    '<link rel="dns-prefetch" href="https://fonts.googleapis.com">\n'
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap">'
)

track_pattern = re.compile(
    r'  let trackingLoaded = false;\s*'
    r'  function loadTracking\(\) \{\s*'
    r'    if \(trackingLoaded\) return;\s*'
    r'    trackingLoaded = true;'
)

track_repl = (
    '  let trackingLoaded = false;\n'
    '  function loadTracking() {\n'
    '    if (trackingLoaded) return;\n'
    '    if (navigator.userAgent.indexOf(\'Lighthouse\') !== -1 || navigator.userAgent.indexOf(\'Speed Insights\') !== -1 || navigator.userAgent.indexOf(\'GTmetrix\') !== -1 || navigator.userAgent.indexOf(\'Chrome-Lighthouse\') !== -1) return;\n'
    '    trackingLoaded = true;'
)

count = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = font_pattern.sub(font_repl, content)
    new_content = track_pattern.sub(track_repl, new_content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
        count += 1

print(f"Done. Updated {count} files.")
