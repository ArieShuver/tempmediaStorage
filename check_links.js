const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const regex = /<a\b[^>]*>(.*?)<\/a>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  const content = match[1].trim();
  if (content === '' || !content.match(/[a-zA-Zא-ת0-9]/)) {
    console.log('Empty link found:', match[0]);
  }
}
