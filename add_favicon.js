const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.includes('rel="icon"')) {
    content = content.replace('</title>', '</title>\n  <link rel="icon" href="brand-logo.webp" type="image/webp">');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Added favicon to ${file}`);
  } else {
    console.log(`Favicon already exists in ${file}`);
  }
});
