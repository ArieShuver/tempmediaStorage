const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'index.html');

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace inputs with aria-labels
  content = content.replace(
    /<input type="text" class="f-name" placeholder="שם מלא" required minlength="2" \/>/g,
    '<input type="text" class="f-name" placeholder="שם מלא" aria-label="שם מלא" required minlength="2" />'
  );
  content = content.replace(
    /<input type="tel" class="f-phone" placeholder="טלפון" required \/>/g,
    '<input type="tel" class="f-phone" placeholder="טלפון" aria-label="טלפון" required />'
  );
  content = content.replace(
    /<select class="f-interest" required>/g,
    '<select class="f-interest" aria-label="נושא הפנייה" required>'
  );
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated form aria-labels in ${file}`);
});
