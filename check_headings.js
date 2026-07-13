const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const regex = /<h([1-6])(.*?)>(.*?)<\/h\1>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log(`h${match[1]}: ${match[3].replace(/<[^>]+>/g, '').trim()}`);
}
