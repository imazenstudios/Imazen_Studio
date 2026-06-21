const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

// 1. Change logo3.png to logo.png
content = content.replace(
  /<img src="\/images\/logo3\.png"/g,
  `<img src="/images/logo.png"`
);

// 2. Fix images to original aspect ratio and tall height (like in screenshot)
content = content.replace(
  /className="!w-\[300px\] md:!w-\[400px\] h-\[400px\] md:h-\[500px\] cursor-pointer overflow-hidden border border-white\/10 relative hover:border-white\/30 transition-colors"/g,
  `className="!w-auto h-[50vh] md:h-[75vh] cursor-pointer overflow-hidden border border-white/10 relative hover:border-white/30 transition-colors"`
);

content = content.replace(
  /className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"/g,
  `className="w-auto h-full object-cover transition-transform duration-700 hover:scale-105"`
);

fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
console.log('Fixed ReferenceLandingPage.jsx images and logo');
