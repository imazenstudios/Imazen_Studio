const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

// Replace the slide container
content = content.replace(
  /className="!w-\[280px\] md:!w-\[350px\] h-\[400px\] md:h-\[500px\] cursor-pointer overflow-hidden border-0 relative transition-colors"/g,
  `className="!w-auto h-[500px] cursor-pointer overflow-hidden border-0 relative transition-colors"`
);

// Replace the image
content = content.replace(
  /className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"/g,
  `className="h-full w-auto max-w-none object-cover transition-transform duration-700 hover:scale-105"`
);

fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
console.log('Fixed Our Portfolio height 500px width auto');
