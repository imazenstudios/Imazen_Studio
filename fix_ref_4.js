const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

// Replace the slide container className
content = content.replace(
  /className="!w-auto h-\[50vh\] md:h-\[75vh\] cursor-pointer overflow-hidden border border-white\/10 relative hover:border-white\/30 transition-colors"/g,
  `className="!w-[280px] md:!w-[380px] h-[400px] md:h-[550px] cursor-pointer overflow-hidden border-0 relative transition-colors"`
);

// Replace the image className
content = content.replace(
  /className="w-auto h-full object-cover transition-transform duration-700 hover:scale-105"/g,
  `className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"`
);

// Also let's check if the video thumbnails have the same class and fix them if needed
// Actually, earlier I made video thumbnails the same. Wait, video thumbnails used the same regex!
// But wait, the first replace above was specific to `!w-auto h-[50vh]...`
// I'll make sure to save it.

fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
console.log('Fixed Our Portfolio styling');
