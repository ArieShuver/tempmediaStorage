const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf-8');
css = css.replace(/\.testi-card h4/g, '.testi-card h3');
css = css.replace(/\.success h4/g, '.success h3');
fs.writeFileSync('style.css', css, 'utf-8');
console.log('Fixed CSS selectors for h3');
