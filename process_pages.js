const fs = require('fs');
const path = require('path');

const files = [
  'health-insurance.html',
  'investment-gemel.html',
  'life-insurance.html',
  'mortgage-reduction.html',
  'pension.html',
  'study-fund.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Extract <head>
  const headMatch = content.match(/<head>([\s\S]*?)<\/head>/i);
  let headContent = headMatch ? headMatch[1] : '';

  // Ensure font-awesome is in head
  if (!headContent.includes('font-awesome')) {
    headContent = headContent.replace('</title>', '</title>\n  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">');
  }

  // Extract elements from about-text
  const aboutTextMatch = content.match(/<div class="about-text">([\s\S]*?)<\/div>\n\s*<img/i);
  if (!aboutTextMatch) {
    console.log(`Could not find about-text in ${file}`);
    return;
  }
  const aboutText = aboutTextMatch[1];

  const highlightMatch = aboutText.match(/<p class="highlight-text">(.*?)<\/p>/);
  const highlight = highlightMatch ? highlightMatch[1] : '';

  const h1Match = aboutText.match(/<h1>(.*?)<\/h1>/);
  const h1 = h1Match ? h1Match[1] : '';

  // Extract paragraphs before first h2
  const pIntroMatch = aboutText.match(/<\/h1>\s*<p>([\s\S]*?)<\/p>\s*<h2>/);
  const intro = pIntroMatch ? pIntroMatch[1] : '';

  // Extract specific sections
  const extractSection = (title) => {
    const regex = new RegExp(`<h2>${title}</h2>\\s*<p>([\\s\\S]*?)</p>(?:\\s*<h2>|\\s*<a)`);
    const match = aboutText.match(regex);
    return match ? match[1].trim() : '';
  };

  const whyImportant = extractSection('למה השירות חשוב');
  const commonMistakes = extractSection('טעויות נפוצות');
  const whyChooseMe = extractSection('למה לבחור בי');

  // Extract FAQ
  const faqSectionMatch = aboutText.match(/<h2>שאלות נפוצות<\/h2>([\s\S]*?)<a href=/);
  const faqs = [];
  if (faqSectionMatch) {
    const faqText = faqSectionMatch[1];
    const qas = faqText.split('</p>');
    qas.forEach(qa => {
      const qMatch = qa.match(/<strong>(.*?)<\/strong>\s*(.*)/);
      if (qMatch) {
        faqs.push({ q: qMatch[1].trim(), a: qMatch[2].trim() });
      }
    });
  }

  // Build new HTML
  let newHtml = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>${headContent}</head>
<body class="subpage-main">
  <header class="site-header" id="site-header">
    <div class="header-inner wrap">
      <a href="index.html" class="logo">
        <img src="brand-logo.webp" alt="לוגו משה שובר" class="header-brand-logo">
        <div class="logo-text">
          <span class="logo-title">משה שובר</span>
          <span class="logo-subtitle">סוכן ביטוח</span>
        </div>
      </a>
      <nav class="nav" id="nav">
        <a href="index.html#home" class="nav-a">דף הבית</a>
        <a href="index.html#services" class="nav-a">שירותים</a>
        <a href="index.html#about" class="nav-a">אודות</a>
        <a href="index.html#reviews" class="nav-a">לקוחות ממליצים</a>
        <a href="index.html#contact" class="nav-a">צור קשר</a>
      </nav>
      <div class="header-actions">
        <a href="index.html#contact" class="btn-solid btn-header">צור קשר</a>
        <button class="burger" id="burger" aria-label="תפריט">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
  <main>
    <!-- ===== INNER HERO ===== -->
    <section class="inner-hero">
      <div class="inner-hero-bg"></div>
      <div class="wrap inner-hero-content">
        ${highlight ? `<span class="highlight-text">${highlight}</span>` : ''}
        <h1>${h1}</h1>
        <p>${intro}</p>
      </div>
    </section>

    <!-- ===== STORY SECTION ===== -->
    <section class="story-section article-section">
      <div class="wrap">
        <div class="story-content">
          <h2>למה השירות חשוב</h2>
          <p>${whyImportant}</p>
        </div>
      </div>
    </section>

    <!-- ===== WHY GRID (Cards) ===== -->
    <section class="why-me">
      <div class="wrap">
        <h2 class="section-title centered">למה כדאי לשים לב?</h2>
        <div class="why-grid">
          <div class="why-card">
            <i class="fa-solid fa-triangle-exclamation why-icon"></i>
            <h3>טעויות נפוצות</h3>
            <p>${commonMistakes}</p>
          </div>
          <div class="why-card">
            <i class="fa-solid fa-handshake why-icon"></i>
            <h3>למה לבחור בי</h3>
            <p>${whyChooseMe}</p>
          </div>
          <div class="why-card">
            <i class="fa-solid fa-user-shield why-icon"></i>
            <h3>התאמה אישית</h3>
            <p>לכל משפחה צרכים אחרים ותקציב שונה. אני כאן כדי להתאים את הביטוח בצורה מדויקת עבורכם במחירים קולקטיביים חסרי תקדים.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FAQ ===== -->
    <section class="faq-section">
      <div class="wrap">
        <h2 class="section-title centered">שאלות נפוצות</h2>
        <div class="faq-list">
          ${faqs.map(faq => `
          <div class="faq-item">
            <button class="faq-q">${faq.q}<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" /></svg></button>
            <div class="faq-a">
              <p>${faq.a}</p>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- ======== BOTTOM CTA ======== -->
    <section class="bottom-cta" id="contact">
      <div class="wrap">
        <div class="cta-box">
          <h2>לשיחת ייעוץ ללא עלות</h2>
          <div class="contact-phone-actions">
            <a href="tel:+972559106223" class="contact-phone-link is-visible" data-phone-link>
              <i class="fa-solid fa-phone-volume"></i>
              055-9106223
            </a>
          </div>
          <p>מלאו את הטופס הבא וגלו כיצד תוכלו לחסוך מאות ואלפי שקלים בביטוחים שלכם</p>

          <form class="lead-form bottom-form" novalidate>
            <div class="b-inputs">
              <div class="field">
                <input type="text" class="f-name" placeholder="שם מלא" required minlength="2" />
              </div>
              <div class="field">
                <input type="tel" class="f-phone" placeholder="טלפון" required />
              </div>
              <div class="field select-box">
                  <select class="f-interest" required>
                    <option value="" disabled selected>נושא הפנייה</option>
                    <option value="life">ביטוח חיים ובריאות</option>
                    <option value="mortgage">הוזלת ביטוח משכנתא</option>
                    <option value="pension">פנסיה וקופת גמל</option>
                    <option value="study">קרן השתלמות</option>
                  </select>
                  <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
            </div>

            <div class="privacy-check" style="margin-top:15px; margin-bottom:15px; text-align:right;">
              <input type="checkbox" id="privacy" required />
              <label for="privacy">מאשר.ת שקראתי את מדיניות הפרטיות ותנאי השימוש</label>
            </div>

            <button type="submit" class="btn-solid btn-submit">
              <span class="btn-label">שלח וקבל הצעה</span>
              <span class="spinner"></span>
            </button>
          </form>

          <div class="success">
            <div class="success-inner">
              <h4>הבקשה נשלחה בהצלחה!</h4>
              <p>תודה רבה <span class="suc-name"></span>, נחזור אליך בהקדם.</p>
              <button class="btn-solid btn-outline btn-close">סגור</button>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>
  <footer class="site-footer">
    <div class="wrap">
      <p>© כל הזכויות שמורות למשה שובר סוכן ביטוח.</p>
      <div class="footer-tag">AS פיתוח וקידום אתרים</div>
    </div>
    <!-- UserWay Accessibility Widget -->
    <script>
      var _userway_config = { color: '#41B37C', position: 5, account: 'j1gIuV8Npl' };
    </script>
    <script src="https://cdn.userway.org/widget.js"></script>
  </footer>
  <script src="script.js"></script>
</body>
</html>`;

  fs.writeFileSync(filePath, newHtml, 'utf-8');
  console.log(`Successfully processed ${file}`);
});
