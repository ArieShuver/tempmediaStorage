const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Testimonial Stars
html = html.replace(/⭐⭐⭐⭐⭐/g, '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>');

// Testimonial Icons
html = html.replace(/🙏🙏❤️/g, '<i class="fa-solid fa-hands-praying"></i> <i class="fa-solid fa-heart" style="color: #e74c3c;"></i>');
html = html.replace(/🙏/g, '<i class="fa-solid fa-hands-praying"></i>');
html = html.replace(/😁/g, '<i class="fa-solid fa-face-smile"></i>');

// Why Me Icons
html = html.replace(/<div class="why-icon">🏆<\/div>/g, '<i class="fa-solid fa-trophy why-icon"></i>');
html = html.replace(/<div class="why-icon">⚡<\/div>/g, '<i class="fa-solid fa-bolt why-icon"></i>');
html = html.replace(/<div class="why-icon">🤝<\/div>/g, '<i class="fa-solid fa-handshake why-icon"></i>');

fs.writeFileSync('index.html', html, 'utf8');
