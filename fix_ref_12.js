const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

content = content.replace(
  /style=\{\{ width: 'auto' \}\} className="h-\[400px\] md:h-\[500px\] cursor-pointer overflow-hidden border-0 relative transition-colors"/g,
  `className="!w-[280px] md:!w-[350px] h-[400px] md:h-[500px] cursor-pointer overflow-hidden border-0 relative transition-colors flex justify-center"`
);

content = content.replace(
  /className="h-full w-auto max-w-none block object-cover transition-transform duration-700 hover:scale-105"/g,
  `className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"`
);

fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
console.log('Fixed Our Portfolio to strictly uniform cards');
