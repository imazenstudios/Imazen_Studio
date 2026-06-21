const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

// 1. Change slide class to w-auto and h-[500px]
content = content.replace(
  /className="!w-\[280px\] md:!w-\[380px\] h-\[400px\] md:h-\[550px\] cursor-pointer overflow-hidden border-0 relative transition-colors"/g,
  `className="!w-auto h-[400px] md:h-[500px] cursor-pointer overflow-hidden border-0 relative transition-colors flex justify-center"`
);

// 2. Change img class to h-full w-auto
content = content.replace(
  /className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"/g,
  `className="h-full w-auto block object-contain transition-transform duration-700 hover:scale-105"`
);
content = content.replace(
  /className="w-full h-full object-contain transition-transform duration-700 hover:scale-105" alt="Video Thumbnail"/g,
  `className="h-full w-auto block object-contain transition-transform duration-700 hover:scale-105" alt="Video Thumbnail"`
);

fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
console.log('Fixed Our Portfolio heights');
