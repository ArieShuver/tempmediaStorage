import os
import re
import glob

def run():
    html_files = glob.glob('*.html')
    if not html_files:
        print('No html files found in root')
        return

    # Read index.html for template extraction
    with open('index.html', 'r', encoding='utf-8') as f:
        index_content = f.read()

    # Extract Header
    header_match = re.search(r'(<header class="site-header".*?</header>)', index_content, re.DOTALL)
    header_content = header_match.group(1) if header_match else ''
    
    # Extract Footer
    footer_match = re.search(r'(<footer class="site-footer">.*?</footer>)', index_content, re.DOTALL)
    footer_content = footer_match.group(1) if footer_match else ''

    # Extract bottom scripts and FABs
    bottom_match = re.search(r'</footer>\s*(.*?)</body>', index_content, re.DOTALL)
    bottom_content = bottom_match.group(1) if bottom_match else ''

    # Write Header.astro and Footer.astro
    with open('src/components/Header.astro', 'w', encoding='utf-8') as f:
        f.write(header_content)
    with open('src/components/Footer.astro', 'w', encoding='utf-8') as f:
        f.write(footer_content)

    # Prepare BaseLayout.astro
    head_template = """
--- 
interface Props {
  title?: string;
  description?: string;
}

const { 
  title = "משה שובר | סוכן ביטוח למשכנתא, בריאות, חיים ופנסיה",
  description = "משה שובר הוא סוכן ביטוח שמסייע בהוזלת ביטוח משכנתא, ביטוח חיים, ביטוח בריאות, פנסיה וקרן השתלמות עם ליווי אישי ותנאים משתלמים."
} = Astro.props;

import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="icon" href="/brand-logo.webp" type="image/webp">
  <meta http-equiv="Content-Security-Policy" content="script-src 'self' https://www.googletagmanager.com https://*.clarity.ms 'unsafe-inline';
    connect-src 'self' https://*.clarity.ms https://*.bing.com; img-src 'self' data: https://*.clarity.ms https://*.bing.com;">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="theme-color" content="#0A2A43" />
  <meta property="og:locale" content="he_IL" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="/main-bg.webp" />
  <meta property="og:image:alt" content="משה שובר סוכן ביטוח" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content="/main-bg.webp" />
  <link rel="preload" as="image" href="/hero-bg-contract.webp" fetchpriority="high">
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
  <link rel="dns-prefetch" href="https://www.clarity.ms" />
  <link rel="stylesheet" href="/style.min.css?v=2" />
  <slot name="head" />
</head>
<body>
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
""" + bottom_content.replace('src="script.js', 'src="/script.js') + "\n</body>\n</html>"

    with open('src/layouts/BaseLayout.astro', 'w', encoding='utf-8') as f:
        f.write(head_template)

    # Process all HTML files
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract title and description
        title_match = re.search(r'<title>(.*?)</title>', content)
        title = title_match.group(1) if title_match else ""
        
        desc_match = re.search(r'<meta name="description"\s+content="(.*?)"\s*/>', content, re.DOTALL)
        if not desc_match:
            desc_match = re.search(r'<meta content="(.*?)"\s+name="description"\s*/>', content, re.DOTALL)
        desc = desc_match.group(1).replace("\n", " ").strip() if desc_match else ""
        
        # Extract schema
        schemas = re.findall(r'(<script type="application/ld\+json">.*?</script>)', content, re.DOTALL)
        
        # Extract main content (everything between </header> and <footer)
        # But since some might have <main> tags, let's try to extract <main> content first
        main_match = re.search(r'<main.*?>(.*?)</main>', content, re.DOTALL)
        if main_match:
            page_content = main_match.group(1)
        else:
            # fallback
            content_match = re.search(r'</header>\s*(.*?)<footer', content, re.DOTALL)
            page_content = content_match.group(1) if content_match else ""
            
        # Convert standard URLs to root relative just in case or keep them
        # We can keep them relative for now.
        
        astro_content = f"""---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="{title}" description="{desc}">
"""
        if schemas:
            astro_content += '  <Fragment slot="head">\n'
            for s in schemas:
                astro_content += f"    {s}\n"
            astro_content += '  </Fragment>\n'
            
        astro_content += page_content + "\n</BaseLayout>"
        
        astro_name = html_file.replace('.html', '.astro')
        with open(f'src/pages/{astro_name}', 'w', encoding='utf-8') as f:
            f.write(astro_content)
            
        # Remove old HTML file
        os.remove(html_file)

run()
print("Conversion complete.")
