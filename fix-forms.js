const fs = require('fs');
const files = [
  'health-insurance.html',
  'investment-gemel.html',
  'life-insurance.html',
  'mortgage-reduction.html',
  'pension.html',
  'study-fund.html'
];

const newCta = `<p style="font-size: 1.3rem; margin-bottom: 30px; color: var(--primary-deep); max-width: 600px; margin-left: auto; margin-right: auto;">מלאו את הפרטים בלחיצה על הכפתור וגלו כיצד תוכלו לחסוך מאות ואלפי שקלים בביטוחים ובחסכונות שלכם.</p>
          <div style="margin-top: 40px; text-align: center;">
            <a href="index.html#contact" class="btn-solid btn-large" style="background: var(--green); font-size: 1.4rem; padding: 18px 45px; border-radius: 50px; box-shadow: 0 10px 30px rgba(65, 179, 124, 0.4); display: inline-flex; align-items: center; gap: 10px; transition: transform 0.3s ease;">
              <i class="fa-solid fa-rocket"></i> תתחיל לחסוך עכשיו עם הטובים ביותר!
            </a>
            <div class="contact-phone-actions" style="margin-top: 25px; justify-content: center;">
              <span class="footer-tag" style="color: var(--text-gray); text-shadow: none;">או התקשרו ישירות:</span>
              <a href="tel:0559106223" class="contact-phone-link" style="color: var(--primary);">
                <i class="fa-solid fa-phone"></i> 055-9106223
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>`;

let count = 0;
files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let html = fs.readFileSync(f, 'utf8');
  // the regex searches for "<p>מלאו את הטופס..." up to "</section>"
  const replaced = html.replace(/<p>מלאו את הטופס[\s\S]*?<\/section>/, newCta);
  if (html !== replaced) {
    fs.writeFileSync(f, replaced);
    count++;
  }
});
console.log('Modified ' + count + ' files.');
