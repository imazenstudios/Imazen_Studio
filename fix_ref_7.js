const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

// 1. Change slide container to fixed width and height
content = content.replace(
  /className="!w-auto h-\[400px\] md:h-\[500px\] cursor-pointer overflow-hidden border-0 relative transition-colors flex justify-center"/g,
  `className="!w-[280px] md:!w-[350px] h-[400px] md:h-[500px] cursor-pointer overflow-hidden border-0 relative transition-colors"`
);

// 2. Change image to w-full h-full object-cover
content = content.replace(
  /className="h-full w-auto block object-contain transition-transform duration-700 hover:scale-105"/g,
  `className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"`
);

fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
console.log('Fixed Our Portfolio fixed uniform sizes');
