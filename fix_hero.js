const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/Hero.jsx', 'utf8');

// Replace the centering div for the hero content
content = content.replace(/<div className="absolute inset-0 flex items-center justify-center pointer-events-none">/g, 
  '<div className={`absolute inset-0 flex flex-col pointer-events-none ${i === 0 ? "items-center justify-center" : "items-center justify-end pb-24 md:pb-32"}`}>');

fs.writeFileSync('frontend/src/components/Hero.jsx', content, 'utf8');
console.log('Fixed Hero.jsx');
