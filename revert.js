const fs = require('fs');

// REVERT HTML
let html = fs.readFileSync('index.html', 'utf8');
const startIdx = html.indexOf('<div class="testi-marquee">');
if (startIdx !== -1) {
  const endIdx = html.indexOf('</section>', startIdx);
  const replacement = `        <div class="testi-grid">

          <div class="testi-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"סוכן ישר ואדיב התאים לי בדיוק את הביטוח הנכון לי במחיר שלא מצאתי אצל שום סוכן והכול בחיוך תודה משה 🙏"
            </p>
            <h4>פנחס שמעוני</h4>
          </div>

          <div class="testi-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"סוכן ביטוח הכי טוב שפגשתי מאוד אדיב ומאוד קשוב המלצתי עליו למשפה וחברים וכמובן העברתי את כל העובדים דרך
              משה שובר סוכן ביטוח ממליץ בחום ממש🙏🙏❤️"</p>
            <h4>יצחק דוד ישורון</h4>
          </div>

          <div class="testi-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"היום דיברתי עם משה שובר, הסביר לי על כל העניינים, פשוט סבלן בטירוף סידר לי מחירים שלא מצאתי בשום מקום!!
              תודה רבה!!!"</p>
            <h4>TravelStock</h4>
          </div>

          <div class="testi-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"הסוכן שלי כבר תקופה, הביא לי תנאים מטורפים בקרן הפנסיה (אחרי סקר שוק מעמיק😁) וזה לא בא על חשבון
              המקצועיות והסבלנות שלו, ממליצה ממש."</p>
            <h4>חנה כ.</h4>
          </div>

          <div class="testi-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"משה התותח!! עשה לי סדר מטורף בתיק הביטוחי, ועזר לי על הדרך עם כמה דברים בתיק שלא הייתי בכלל מודע להם,
              עשה לי סדר ברמה גבוהה מאוד!! סוכן ביטוח אמין מאוד, זמין מאוד ועם מחירים שלא מצאתי בשום מקום אחר!! ממליץ
              בחום🙏"</p>
            <h4>אלי ברגר</h4>
          </div>

          <div class="testi-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"אני באתי מחול לא לפני הרבה זמן, הייתי צריך סוכן ביטוח שישב ויסביר לי את כל הנקודות ולא מצאתי אף אחד, עד
              שהכרתי את משה שובר היקר, הוא היה באמת הכי סבלני ומסור הרגשתי שיש לי על מי לסמוך. וכמובן נתן לי את המחירים
              הכי זולים."</p>
            <h4>קרלוס</h4>
          </div>

          <div class="testi-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"משה סוכן ביטוח ופנסיה מס 1 אמינות ברמה הכי גבוהה זמין תמיד גם בזמנים לא שגרתיים, עם המון סבלנות
              ואכפתיות, והכל עם ליווי צמוד לכל מה שצריך ונדרש."</p>
            <h4>מתי זבקץ׳</h4>
          </div>

          <div class="testi-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"משה דואג באמת לראות את התמונה המלאה... מומלץ לכל מי שרוצה להפסיק לדאוג מהביטוח."</p>
            <h4>אריה</h4>
          </div>

        </div>
      </div>
    `;
  html = html.substring(0, startIdx) + replacement + html.substring(endIdx);
  fs.writeFileSync('index.html', html, 'utf8');
}

// REVERT CSS
let css = fs.readFileSync('style.css', 'utf8');
const cssStart = css.indexOf('.testimonials { padding: 80px 0; background: var(--bg); overflow: hidden; }');
if (cssStart !== -1) {
  const cssEnd = css.indexOf('/* ===== FAQ ===== */', cssStart);
  const cssReplacement = `.testimonials {
  padding: 80px 0;
  background: var(--bg);
}

.testi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.testi-card {
  background: var(--white);
  padding: 30px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stars {
  color: #FFD700;
  margin-bottom: 16px;
  font-size: 1.2rem;
  letter-spacing: 2px;
}

.testi-card p {
  font-size: 1.05rem;
  font-style: italic;
  color: var(--text-gray);
  margin-bottom: 24px;
  line-height: 1.6;
}

.testi-card h4 {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--primary);
}

`;
  css = css.substring(0, cssStart) + cssReplacement + css.substring(cssEnd);
  fs.writeFileSync('style.css', css, 'utf8');
}
