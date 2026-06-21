const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

content = content.replace(
  /className="h-\[400px\] md:h-\[500px\] cursor-pointer overflow-hidden border-0 relative transition-colors"/g,
  `className="h-[300px] md:h-[400px] cursor-pointer overflow-hidden border-0 relative transition-colors"`
);

fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
console.log('Reduced height to 400px');
