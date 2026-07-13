const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Add dir="rtl" to all inputs and forms if missing
  content = content.replace(/<form /g, '<form dir="rtl" ');
  content = content.replace(/<input([^>]*)class="f-name"([^>]*)>/g, '<input$1class="f-name"$2 dir="rtl">');
  content = content.replace(/<input([^>]*)class="f-phone"([^>]*)>/g, '<input$1class="f-phone"$2 dir="rtl">');
  content = content.replace(/<input([^>]*)class="f-email"([^>]*)>/g, '<input$1class="f-email"$2 dir="rtl">');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Added dir="rtl" to forms in ${file}`);
});
