const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix testi-card headings
  content = content.replace(/<h4([^>]*)>([^<]*)<\/h4>/gi, (match, attrs, text) => {
    // If it's a name in testi-card or success title, make it h3
    return `<h3${attrs}>${text}</h3>`;
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated headings in ${file}`);
});
