const fs = require('fs');
const path = require('path');

const newFooter = `  <footer class="site-footer">
    <div class="wrap">
      
      <!-- Footer Columns -->
      <div class="footer-columns">
        
        <!-- Column 1: Services -->
        <div class="footer-col">
          <h3>השירותים שלנו</h3>
          <div class="footer-nav">
            <a href="mortgage-reduction.html">ביטוח משכנתא</a>
            <a href="health-insurance.html">בריאות</a>
            <a href="life-insurance.html">חיים</a>
            <a href="pension.html">פנסיה</a>
            <a href="study-fund.html">קרן השתלמות</a>
            <a href="investment-gemel.html">קופות גמל</a>
          </div>
        </div>

        <!-- Column 2: Contact Info -->
        <div class="footer-col">
          <h3>צור קשר</h3>
          <div class="footer-info">
            <span><a href="tel:0559106223">055-9106223</a><i class="fa-solid fa-phone"></i></span>
            <span>שחל 81, ירושלים<i class="fa-solid fa-location-dot"></i></span>
          </div>
        </div>

      </div>

      <!-- Row 3: Legal & Copyright -->
      <div class="footer-bottom">
        <div class="footer-links">
          <a href="privacy-policy.html">מדיניות פרטיות</a>
          <a href="terms-of-use.html">תנאי שימוש</a>
        </div>
        <p>© כל הזכויות שמורות למשה שובר סוכן ביטוח.</p>
        <div class="footer-tag">AS פיתוח וקידום אתרים</div>
      </div>

    </div>
    <!-- UserWay Accessibility Widget -->
    <script>
      var _userway_config = { color: '#41B37C', position: 5, account: 'j1gIuV8Npl' };
    </script>
    <script src="https://cdn.userway.org/widget.js" defer></script>
  </footer>`;

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'index.html');

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace everything between <footer class="site-footer"> and </footer>
  const regex = /<footer class="site-footer">[\s\S]*?<\/footer>/;
  if (regex.test(content)) {
    content = content.replace(regex, newFooter);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated footer in ${file}`);
  }
});
